/**
 * Proposal Store
 *
 * DynamoDB operations for the proposal table.
 * Handles creation, retrieval, and updates of Safari Proposal Packs.
 *
 * Per governance:
 * - No booking or payment logic
 * - Shareable via public token
 * - Calm, documentary tone
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import type { ProposalRecord, ProposalUpdate } from '../contracts';

// Configuration from environment
const PROPOSAL_TABLE = process.env.PROPOSAL_TABLE || 'safari-index-proposals';
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT; // For local testing

// Initialize DynamoDB client
const ddbClient = new DynamoDBClient({
  region: AWS_REGION,
  ...(DYNAMODB_ENDPOINT && { endpoint: DYNAMODB_ENDPOINT }),
});
const docClient = DynamoDBDocumentClient.from(ddbClient);

/**
 * Generate a unique proposal ID with prefix
 */
function generateProposalId(): string {
  return `prop_${randomUUID().replace(/-/g, '').substring(0, 12)}`;
}

/**
 * Generate a public token for shareable URL
 * Format: 16 character alphanumeric string
 */
function generatePublicToken(): string {
  return randomUUID().replace(/-/g, '').substring(0, 16);
}

/**
 * Create a new proposal record from an inquiry
 */
export async function createProposal(inquiry_id: string): Promise<ProposalRecord> {
  const proposal_id = generateProposalId();
  const public_token = generatePublicToken();
  const now = new Date().toISOString();

  const record: ProposalRecord = {
    proposal_id,
    inquiry_id,
    created_at: now,
    updated_at: now,
    status: 'draft',
    operator_name: null,
    traveler_name: null,
    intro_note: null,
    recommended_trip_ids: [],
    recommended_decision_ids: [],
    pricing_notes: null,
    next_steps: null,
    public_token,
  };

  await docClient.send(
    new PutCommand({
      TableName: PROPOSAL_TABLE,
      Item: record,
    })
  );

  return record;
}

/**
 * Get a proposal by ID
 */
export async function getProposal(proposal_id: string): Promise<ProposalRecord | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: PROPOSAL_TABLE,
      Key: { proposal_id },
    })
  );

  return (result.Item as ProposalRecord) || null;
}

/**
 * Get a proposal by public token (for public view)
 */
export async function getProposalByToken(public_token: string): Promise<ProposalRecord | null> {
  // Scan for matching token - not ideal but proposals are few
  // Could add a GSI on public_token if volume increases
  const result = await docClient.send(
    new ScanCommand({
      TableName: PROPOSAL_TABLE,
      FilterExpression: 'public_token = :token',
      ExpressionAttributeValues: {
        ':token': public_token,
      },
      Limit: 1,
    })
  );

  const items = result.Items as ProposalRecord[];
  return items?.[0] || null;
}

/**
 * List proposals for an inquiry, newest first
 */
export async function listProposalsForInquiry(
  inquiry_id: string,
  limit: number = 10
): Promise<ProposalRecord[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: PROPOSAL_TABLE,
      IndexName: 'inquiry-created-index',
      KeyConditionExpression: 'inquiry_id = :inquiry_id',
      ExpressionAttributeValues: {
        ':inquiry_id': inquiry_id,
      },
      ScanIndexForward: false, // Newest first
      Limit: limit,
    })
  );

  return (result.Items as ProposalRecord[]) || [];
}

/**
 * Update proposal fields
 */
export async function updateProposal(
  proposal_id: string,
  updates: ProposalUpdate
): Promise<ProposalRecord | null> {
  const updateExpressions: string[] = ['#updated_at = :updated_at'];
  const expressionAttributeNames: Record<string, string> = {
    '#updated_at': 'updated_at',
  };
  const expressionAttributeValues: Record<string, unknown> = {
    ':updated_at': new Date().toISOString(),
  };

  if (updates.status !== undefined) {
    updateExpressions.push('#status = :status');
    expressionAttributeNames['#status'] = 'status';
    expressionAttributeValues[':status'] = updates.status;
  }

  if (updates.operator_name !== undefined) {
    updateExpressions.push('#operator_name = :operator_name');
    expressionAttributeNames['#operator_name'] = 'operator_name';
    expressionAttributeValues[':operator_name'] = updates.operator_name;
  }

  if (updates.traveler_name !== undefined) {
    updateExpressions.push('#traveler_name = :traveler_name');
    expressionAttributeNames['#traveler_name'] = 'traveler_name';
    expressionAttributeValues[':traveler_name'] = updates.traveler_name;
  }

  if (updates.intro_note !== undefined) {
    updateExpressions.push('#intro_note = :intro_note');
    expressionAttributeNames['#intro_note'] = 'intro_note';
    expressionAttributeValues[':intro_note'] = updates.intro_note;
  }

  if (updates.recommended_trip_ids !== undefined) {
    updateExpressions.push('#recommended_trip_ids = :recommended_trip_ids');
    expressionAttributeNames['#recommended_trip_ids'] = 'recommended_trip_ids';
    expressionAttributeValues[':recommended_trip_ids'] = updates.recommended_trip_ids;
  }

  if (updates.recommended_decision_ids !== undefined) {
    updateExpressions.push('#recommended_decision_ids = :recommended_decision_ids');
    expressionAttributeNames['#recommended_decision_ids'] = 'recommended_decision_ids';
    expressionAttributeValues[':recommended_decision_ids'] = updates.recommended_decision_ids;
  }

  if (updates.pricing_notes !== undefined) {
    updateExpressions.push('#pricing_notes = :pricing_notes');
    expressionAttributeNames['#pricing_notes'] = 'pricing_notes';
    expressionAttributeValues[':pricing_notes'] = updates.pricing_notes;
  }

  if (updates.next_steps !== undefined) {
    updateExpressions.push('#next_steps = :next_steps');
    expressionAttributeNames['#next_steps'] = 'next_steps';
    expressionAttributeValues[':next_steps'] = updates.next_steps;
  }

  const result = await docClient.send(
    new UpdateCommand({
      TableName: PROPOSAL_TABLE,
      Key: { proposal_id },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    })
  );

  return (result.Attributes as ProposalRecord) || null;
}
