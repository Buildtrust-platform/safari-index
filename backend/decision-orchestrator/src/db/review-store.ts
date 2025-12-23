/**
 * Review Queue Store
 *
 * Per 06_review_correction.md:
 * - Decisions can be flagged for human review
 * - Review reasons must be explicit
 *
 * Per 10_data_model.md Table 8: review_queue
 * - Tracks decisions needing human oversight
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  UpdateCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';

const REVIEW_TABLE = process.env.REVIEW_TABLE || 'safari-index-reviews';
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT;

const ddbClient = new DynamoDBClient({
  region: AWS_REGION,
  ...(DYNAMODB_ENDPOINT && { endpoint: DYNAMODB_ENDPOINT }),
});
const docClient = DynamoDBDocumentClient.from(ddbClient);

/**
 * Review reason codes per 06_review_correction.md
 */
export type ReviewReasonCode =
  | 'QUALITY_GATE_FAILED'
  | 'REPEATED_TOPIC_VISIT'
  | 'OUTCOME_CHANGED'
  | 'HIGH_REFUSAL_RATE'
  | 'CONFIDENCE_DRIFT'
  | 'MANUAL_FLAG';

export interface ReviewRecord {
  review_id: string;
  created_at: string;
  topic_id: string;
  decision_id: string | null;
  reason_code: ReviewReasonCode;
  reason_details: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  reviewer_id: string | null;
  reviewed_at: string | null;
  resolution_notes: string | null;
  metadata: Record<string, unknown>;
}

function generateReviewId(): string {
  return `rev_${randomUUID().replace(/-/g, '').substring(0, 12)}`;
}

function removeNullValues(obj: ReviewRecord): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(obj) as (keyof ReviewRecord)[]) {
    if (obj[key] !== null && obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Create a review record
 */
export async function createReviewRecord(
  topicId: string,
  decisionId: string | null,
  reasonCode: ReviewReasonCode,
  reasonDetails: string,
  metadata: Record<string, unknown> = {}
): Promise<string> {
  const record: ReviewRecord = {
    review_id: generateReviewId(),
    created_at: new Date().toISOString(),
    topic_id: topicId,
    decision_id: decisionId,
    reason_code: reasonCode,
    reason_details: reasonDetails,
    status: 'pending',
    reviewer_id: null,
    reviewed_at: null,
    resolution_notes: null,
    metadata,
  };

  await docClient.send(
    new PutCommand({
      TableName: REVIEW_TABLE,
      Item: removeNullValues(record),
      ConditionExpression: 'attribute_not_exists(review_id)',
    })
  );

  return record.review_id;
}

/**
 * Get pending reviews
 */
export async function getPendingReviews(limit: number = 50): Promise<ReviewRecord[]> {
  const result = await docClient.send(
    new ScanCommand({
      TableName: REVIEW_TABLE,
      FilterExpression: '#status = :pending',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: { ':pending': 'pending' },
      Limit: limit,
    })
  );

  return (result.Items as ReviewRecord[]) || [];
}

/**
 * Get reviews by topic
 */
export async function getReviewsByTopic(
  topicId: string,
  limit: number = 20
): Promise<ReviewRecord[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: REVIEW_TABLE,
      IndexName: 'topic-created-index',
      KeyConditionExpression: 'topic_id = :tid',
      ExpressionAttributeValues: { ':tid': topicId },
      ScanIndexForward: false,
      Limit: limit,
    })
  );

  return (result.Items as ReviewRecord[]) || [];
}

/**
 * Update review status
 */
export async function updateReviewStatus(
  reviewId: string,
  status: ReviewRecord['status'],
  reviewerId: string,
  notes: string
): Promise<void> {
  await docClient.send(
    new UpdateCommand({
      TableName: REVIEW_TABLE,
      Key: { review_id: reviewId },
      UpdateExpression:
        'SET #status = :status, reviewer_id = :reviewer, reviewed_at = :reviewed, resolution_notes = :notes',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: {
        ':status': status,
        ':reviewer': reviewerId,
        ':reviewed': new Date().toISOString(),
        ':notes': notes,
      },
    })
  );
}
