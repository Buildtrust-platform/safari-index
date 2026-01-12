/**
 * Activity Store
 *
 * DynamoDB operations for the activity log table.
 * Tracks all interactions on inquiries for CRM timeline.
 *
 * Per governance:
 * - Read-only analytics, no modification of source data
 * - Simple activity tracking for operator workflow
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import type { ActivityRecord, ActivityType } from '../contracts';

// Configuration from environment
const ACTIVITY_TABLE = process.env.ACTIVITY_TABLE || 'safari-index-activities';
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
 * Generate a unique activity ID with prefix
 */
function generateActivityId(): string {
  return `act_${randomUUID().replace(/-/g, '').substring(0, 12)}`;
}

/**
 * Log an activity for an inquiry
 */
export async function logActivity(params: {
  inquiry_id: string;
  type: ActivityType;
  actor?: string;
  old_value?: string;
  new_value?: string;
  details?: string;
}): Promise<ActivityRecord> {
  const activity_id = generateActivityId();
  const timestamp = new Date().toISOString();

  const record: ActivityRecord = {
    activity_id,
    inquiry_id: params.inquiry_id,
    timestamp,
    type: params.type,
    actor: params.actor,
    old_value: params.old_value,
    new_value: params.new_value,
    details: params.details,
  };

  await docClient.send(
    new PutCommand({
      TableName: ACTIVITY_TABLE,
      Item: record,
    })
  );

  return record;
}

/**
 * Log a status change activity
 */
export async function logStatusChange(
  inquiry_id: string,
  old_status: string,
  new_status: string,
  actor?: string
): Promise<ActivityRecord> {
  return logActivity({
    inquiry_id,
    type: 'status_change',
    actor,
    old_value: old_status,
    new_value: new_status,
  });
}

/**
 * Log a note added activity
 */
export async function logNoteAdded(
  inquiry_id: string,
  note: string,
  actor?: string
): Promise<ActivityRecord> {
  return logActivity({
    inquiry_id,
    type: 'note_added',
    actor,
    details: note.substring(0, 200), // Truncate for activity log
  });
}

/**
 * Log a proposal created activity
 */
export async function logProposalCreated(
  inquiry_id: string,
  proposal_id: string,
  actor?: string
): Promise<ActivityRecord> {
  return logActivity({
    inquiry_id,
    type: 'proposal_created',
    actor,
    details: proposal_id,
  });
}

/**
 * Log a proposal sent activity
 */
export async function logProposalSent(
  inquiry_id: string,
  proposal_id: string,
  actor?: string
): Promise<ActivityRecord> {
  return logActivity({
    inquiry_id,
    type: 'proposal_sent',
    actor,
    details: proposal_id,
  });
}

/**
 * Get activity timeline for an inquiry, newest first
 */
export async function getActivityTimeline(
  inquiry_id: string,
  limit: number = 50
): Promise<ActivityRecord[]> {
  try {
    const result = await docClient.send(
      new QueryCommand({
        TableName: ACTIVITY_TABLE,
        IndexName: 'inquiry-timestamp-index',
        KeyConditionExpression: 'inquiry_id = :inquiry_id',
        ExpressionAttributeValues: {
          ':inquiry_id': inquiry_id,
        },
        ScanIndexForward: false, // Newest first
        Limit: limit,
      })
    );

    return (result.Items as ActivityRecord[]) || [];
  } catch (error) {
    // If table doesn't exist yet, return empty array
    console.warn('[Activity Store] Failed to get timeline:', error);
    return [];
  }
}

/**
 * Get recent activities across all inquiries
 */
export async function getRecentActivities(limit: number = 50): Promise<ActivityRecord[]> {
  // Note: This would require a scan or a GSI on timestamp
  // For now, return empty - can be implemented with time-based GSI later
  console.warn('[Activity Store] getRecentActivities not implemented yet');
  return [];
}
