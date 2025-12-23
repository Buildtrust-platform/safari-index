/**
 * Decision Assurance Store
 * Persists assurance records to DynamoDB
 *
 * Per 02_decision_doctrine.md:
 * - Assurance records are immutable once issued
 * - Payment completion triggers "issued" status
 *
 * Per 11_mvp_build_plan.md:
 * - Monetization artifact must be auditable
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { AssuranceRecord, DecisionAssuranceArtifact } from './types';

// Configuration via environment variables
const ASSURANCE_TABLE = process.env.ASSURANCE_TABLE || 'safari-index-assurances';
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT;

// Initialize DynamoDB client
const ddbClient = new DynamoDBClient({
  region: AWS_REGION,
  ...(DYNAMODB_ENDPOINT && { endpoint: DYNAMODB_ENDPOINT }),
});
const docClient = DynamoDBDocumentClient.from(ddbClient);

/**
 * Remove null/undefined values from an object for DynamoDB
 * DynamoDB GSIs don't support null partition keys
 */
function removeNullValues(obj: AssuranceRecord): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(obj) as (keyof AssuranceRecord)[]) {
    if (obj[key] !== null && obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Store a new assurance record
 * Per governance: immutable once stored
 */
export async function storeAssurance(
  record: AssuranceRecord
): Promise<{ assuranceId: string }> {
  const item = removeNullValues(record);

  await docClient.send(
    new PutCommand({
      TableName: ASSURANCE_TABLE,
      Item: item,
      // Prevent overwriting existing assurance records
      ConditionExpression: 'attribute_not_exists(assurance_id)',
    })
  );

  return { assuranceId: record.assurance_id };
}

/**
 * Get assurance by ID
 */
export async function getAssurance(
  assuranceId: string
): Promise<AssuranceRecord | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: ASSURANCE_TABLE,
      Key: { assurance_id: assuranceId },
    })
  );

  return (result.Item as AssuranceRecord) || null;
}

/**
 * Get assurance by decision ID
 * Uses GSI: decision_id index
 */
export async function getAssuranceByDecisionId(
  decisionId: string
): Promise<AssuranceRecord | null> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: ASSURANCE_TABLE,
      IndexName: 'decision-index',
      KeyConditionExpression: 'decision_id = :did',
      ExpressionAttributeValues: {
        ':did': decisionId,
      },
      Limit: 1,
    })
  );

  return (result.Items?.[0] as AssuranceRecord) || null;
}

/**
 * Get assurances by traveler ID
 * Uses GSI: traveler_id + created_at
 */
export async function getAssurancesByTraveler(
  travelerId: string,
  limit: number = 20
): Promise<AssuranceRecord[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: ASSURANCE_TABLE,
      IndexName: 'traveler-created-index',
      KeyConditionExpression: 'traveler_id = :tid',
      ExpressionAttributeValues: {
        ':tid': travelerId,
      },
      ScanIndexForward: false,
      Limit: limit,
    })
  );

  return (result.Items as AssuranceRecord[]) || [];
}

/**
 * Update payment status after successful payment
 * Per governance: this is the only update allowed after creation
 */
export async function updatePaymentStatus(
  assuranceId: string,
  paymentId: string,
  status: 'completed' | 'refunded'
): Promise<void> {
  const now = new Date().toISOString();

  await docClient.send(
    new UpdateCommand({
      TableName: ASSURANCE_TABLE,
      Key: { assurance_id: assuranceId },
      UpdateExpression:
        'SET payment_status = :status, payment_id = :pid, updated_at = :now, #s = :issued',
      ExpressionAttributeNames: {
        '#s': 'status',
      },
      ExpressionAttributeValues: {
        ':status': status,
        ':pid': paymentId,
        ':now': now,
        ':issued': status === 'completed' ? 'issued' : 'revoked',
        ':pending': 'pending',
      },
      // Only update if payment is still pending
      ConditionExpression: 'payment_status = :pending',
    })
  );
}

/**
 * Record artifact access (download)
 * For audit and usage tracking
 */
export async function recordAccess(assuranceId: string): Promise<void> {
  const now = new Date().toISOString();

  await docClient.send(
    new UpdateCommand({
      TableName: ASSURANCE_TABLE,
      Key: { assurance_id: assuranceId },
      UpdateExpression:
        'SET download_count = download_count + :inc, last_accessed_at = :now',
      ExpressionAttributeValues: {
        ':inc': 1,
        ':now': now,
      },
    })
  );
}

/**
 * Revoke an assurance (for refunds or policy violations)
 * Per governance: revocation reason must be documented
 */
export async function revokeAssurance(
  assuranceId: string,
  reason: string
): Promise<void> {
  const now = new Date().toISOString();

  await docClient.send(
    new UpdateCommand({
      TableName: ASSURANCE_TABLE,
      Key: { assurance_id: assuranceId },
      UpdateExpression:
        'SET #s = :revoked, revocation_reason = :reason, updated_at = :now',
      ExpressionAttributeNames: {
        '#s': 'status',
      },
      ExpressionAttributeValues: {
        ':revoked': 'revoked',
        ':reason': reason,
        ':now': now,
      },
    })
  );
}
