/**
 * Follow-up Store
 *
 * DynamoDB operations for the follow-up table.
 * Tracks scheduled follow-ups for CRM workflow.
 *
 * Per governance:
 * - Simple task management for operator workflow
 * - Supports inquiry lifecycle tracking
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import type { FollowUpRecord, FollowUpType, FollowUpStatus } from '../contracts';

// Configuration from environment
const FOLLOWUP_TABLE = process.env.FOLLOWUP_TABLE || 'safari-index-followups';
const REGION = process.env.AWS_REGION || process.env.DYNAMO_REGION || 'eu-central-1';
const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT;

// Get credentials
const getCredentials = () => {
  if (process.env.DYNAMO_ACCESS_KEY_ID && process.env.DYNAMO_SECRET_ACCESS_KEY) {
    return {
      accessKeyId: process.env.DYNAMO_ACCESS_KEY_ID,
      secretAccessKey: process.env.DYNAMO_SECRET_ACCESS_KEY,
    };
  }
  return undefined;
};

// Initialize DynamoDB client
const ddbClient = new DynamoDBClient({
  region: REGION,
  ...(DYNAMODB_ENDPOINT && { endpoint: DYNAMODB_ENDPOINT }),
  ...(getCredentials() && { credentials: getCredentials() }),
});
const docClient = DynamoDBDocumentClient.from(ddbClient);

/**
 * Generate a unique follow-up ID with prefix
 */
function generateFollowUpId(): string {
  return `fup_${randomUUID().replace(/-/g, '').substring(0, 12)}`;
}

/**
 * Create a new follow-up
 */
export async function createFollowUp(params: {
  inquiry_id: string;
  scheduled_for: string;
  type: FollowUpType;
  notes?: string;
}): Promise<FollowUpRecord> {
  const followup_id = generateFollowUpId();
  const created_at = new Date().toISOString();

  const record: FollowUpRecord = {
    followup_id,
    inquiry_id: params.inquiry_id,
    scheduled_for: params.scheduled_for,
    type: params.type,
    notes: params.notes,
    status: 'pending',
    created_at,
  };

  await docClient.send(
    new PutCommand({
      TableName: FOLLOWUP_TABLE,
      Item: record,
    })
  );

  return record;
}

/**
 * Get a follow-up by ID
 */
export async function getFollowUp(followup_id: string): Promise<FollowUpRecord | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: FOLLOWUP_TABLE,
      Key: { followup_id },
    })
  );

  return (result.Item as FollowUpRecord) || null;
}

/**
 * List follow-ups for an inquiry
 */
export async function listFollowUpsByInquiry(
  inquiry_id: string,
  limit: number = 50
): Promise<FollowUpRecord[]> {
  try {
    const result = await docClient.send(
      new QueryCommand({
        TableName: FOLLOWUP_TABLE,
        IndexName: 'inquiry-scheduled-index',
        KeyConditionExpression: 'inquiry_id = :inquiry_id',
        ExpressionAttributeValues: {
          ':inquiry_id': inquiry_id,
        },
        ScanIndexForward: true, // Earliest first
        Limit: limit,
      })
    );

    return (result.Items as FollowUpRecord[]) || [];
  } catch (error) {
    console.warn('[FollowUp Store] Failed to list follow-ups:', error);
    return [];
  }
}

/**
 * List pending follow-ups by status
 */
export async function listFollowUpsByStatus(
  status: FollowUpStatus,
  limit: number = 100
): Promise<FollowUpRecord[]> {
  try {
    const result = await docClient.send(
      new QueryCommand({
        TableName: FOLLOWUP_TABLE,
        IndexName: 'status-scheduled-index',
        KeyConditionExpression: '#status = :status',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':status': status,
        },
        ScanIndexForward: true, // Earliest first (most urgent)
        Limit: limit,
      })
    );

    return (result.Items as FollowUpRecord[]) || [];
  } catch (error) {
    console.warn('[FollowUp Store] Failed to list follow-ups by status:', error);
    return [];
  }
}

/**
 * Get pending follow-ups that are due (scheduled_for <= now)
 */
export async function getDueFollowUps(limit: number = 50): Promise<FollowUpRecord[]> {
  const pendingFollowUps = await listFollowUpsByStatus('pending', limit * 2);
  const now = new Date().toISOString();

  // Filter to only those that are due
  return pendingFollowUps
    .filter((f) => f.scheduled_for <= now)
    .slice(0, limit);
}

/**
 * Update follow-up status
 */
export async function updateFollowUp(
  followup_id: string,
  updates: { status?: FollowUpStatus; notes?: string }
): Promise<FollowUpRecord | null> {
  const updateExpressions: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, unknown> = {};

  if (updates.status !== undefined) {
    updateExpressions.push('#status = :status');
    expressionAttributeNames['#status'] = 'status';
    expressionAttributeValues[':status'] = updates.status;

    // Set completed_at if status is completed
    if (updates.status === 'completed') {
      updateExpressions.push('#completed_at = :completed_at');
      expressionAttributeNames['#completed_at'] = 'completed_at';
      expressionAttributeValues[':completed_at'] = new Date().toISOString();
    }
  }

  if (updates.notes !== undefined) {
    updateExpressions.push('#notes = :notes');
    expressionAttributeNames['#notes'] = 'notes';
    expressionAttributeValues[':notes'] = updates.notes;
  }

  if (updateExpressions.length === 0) {
    return getFollowUp(followup_id);
  }

  const result = await docClient.send(
    new UpdateCommand({
      TableName: FOLLOWUP_TABLE,
      Key: { followup_id },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    })
  );

  return (result.Attributes as FollowUpRecord) || null;
}

/**
 * Complete a follow-up
 */
export async function completeFollowUp(followup_id: string): Promise<FollowUpRecord | null> {
  return updateFollowUp(followup_id, { status: 'completed' });
}

/**
 * Skip a follow-up
 */
export async function skipFollowUp(followup_id: string): Promise<FollowUpRecord | null> {
  return updateFollowUp(followup_id, { status: 'skipped' });
}

/**
 * Delete a follow-up
 */
export async function deleteFollowUp(followup_id: string): Promise<boolean> {
  try {
    await docClient.send(
      new DeleteCommand({
        TableName: FOLLOWUP_TABLE,
        Key: { followup_id },
      })
    );
    return true;
  } catch (error) {
    console.error('[FollowUp Store] Failed to delete follow-up:', error);
    return false;
  }
}
