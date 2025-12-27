/**
 * Newsletter Store
 *
 * DynamoDB operations for newsletter subscribers.
 * Handles subscription, unsubscription, and ops queries.
 *
 * Per governance:
 * - No email sending - just subscriber collection
 * - Idempotent subscribe (resubscribe if previously unsubscribed)
 * - Simple ops interface for listing and status updates
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
import { createHash } from 'crypto';
import type {
  NewsletterSubscriberRecord,
  NewsletterSource,
  NewsletterStatus,
} from '../contracts';

// Configuration from environment
const NEWSLETTER_TABLE = process.env.NEWSLETTER_TABLE || 'safari-index-newsletter';
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT; // For local testing

// Initialize DynamoDB client
const ddbClient = new DynamoDBClient({
  region: AWS_REGION,
  ...(DYNAMODB_ENDPOINT && { endpoint: DYNAMODB_ENDPOINT }),
});
const docClient = DynamoDBDocumentClient.from(ddbClient);

/**
 * Generate a deterministic subscriber ID from email
 * This ensures same email always maps to same ID
 */
function generateSubscriberId(email: string): string {
  const normalizedEmail = email.toLowerCase().trim();
  const hash = createHash('sha256').update(normalizedEmail).digest('hex');
  return `sub_${hash.substring(0, 16)}`;
}

/**
 * Normalize email for storage
 */
function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

interface SubscribeMeta {
  ip?: string;
  userAgent?: string;
}

/**
 * Create or resubscribe a subscriber
 * Idempotent: if already subscribed, returns success
 * If previously unsubscribed, resubscribes
 */
export async function createOrResubscribe(
  email: string,
  source: NewsletterSource = 'homepage',
  meta?: SubscribeMeta
): Promise<{ subscriber_id: string; status: 'subscribed' | 'already_subscribed' | 'resubscribed' }> {
  const normalizedEmail = normalizeEmail(email);
  const subscriber_id = generateSubscriberId(normalizedEmail);
  const now = new Date().toISOString();

  // Check if subscriber already exists
  const existing = await getSubscriberById(subscriber_id);

  if (existing) {
    if (existing.status === 'subscribed') {
      // Already subscribed, no change needed
      return { subscriber_id, status: 'already_subscribed' };
    }

    // Previously unsubscribed, resubscribe
    await docClient.send(
      new UpdateCommand({
        TableName: NEWSLETTER_TABLE,
        Key: { subscriber_id },
        UpdateExpression: 'SET #status = :status, updated_at = :updated_at',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':status': 'subscribed',
          ':updated_at': now,
        },
      })
    );

    return { subscriber_id, status: 'resubscribed' };
  }

  // New subscriber
  const record: NewsletterSubscriberRecord = {
    subscriber_id,
    email: normalizedEmail,
    status: 'subscribed',
    source,
    created_at: now,
    updated_at: now,
    ...(meta?.ip && { last_ip: meta.ip }),
    ...(meta?.userAgent && { user_agent: meta.userAgent }),
  };

  await docClient.send(
    new PutCommand({
      TableName: NEWSLETTER_TABLE,
      Item: record,
    })
  );

  return { subscriber_id, status: 'subscribed' };
}

/**
 * Unsubscribe a subscriber by email
 */
export async function unsubscribe(email: string): Promise<boolean> {
  const normalizedEmail = normalizeEmail(email);
  const subscriber_id = generateSubscriberId(normalizedEmail);
  const now = new Date().toISOString();

  const existing = await getSubscriberById(subscriber_id);
  if (!existing) {
    return false;
  }

  await docClient.send(
    new UpdateCommand({
      TableName: NEWSLETTER_TABLE,
      Key: { subscriber_id },
      UpdateExpression: 'SET #status = :status, updated_at = :updated_at',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': 'unsubscribed',
        ':updated_at': now,
      },
    })
  );

  return true;
}

/**
 * Get a subscriber by ID
 */
export async function getSubscriberById(
  subscriber_id: string
): Promise<NewsletterSubscriberRecord | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: NEWSLETTER_TABLE,
      Key: { subscriber_id },
    })
  );

  return (result.Item as NewsletterSubscriberRecord) || null;
}

/**
 * List subscribers by status, newest first
 */
export async function listSubscribersByStatus(
  status: NewsletterStatus,
  limit: number = 100,
  cursor?: string
): Promise<{ subscribers: NewsletterSubscriberRecord[]; nextCursor?: string }> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: NEWSLETTER_TABLE,
      IndexName: 'status-created-index',
      KeyConditionExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': status,
      },
      ScanIndexForward: false, // Newest first
      Limit: limit,
      ...(cursor && { ExclusiveStartKey: JSON.parse(Buffer.from(cursor, 'base64').toString()) }),
    })
  );

  const subscribers = (result.Items as NewsletterSubscriberRecord[]) || [];
  const nextCursor = result.LastEvaluatedKey
    ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
    : undefined;

  return { subscribers, nextCursor };
}

/**
 * List all subscribers (for ops view)
 */
export async function listAllSubscribers(
  limit: number = 100,
  cursor?: string
): Promise<{ subscribers: NewsletterSubscriberRecord[]; nextCursor?: string }> {
  const result = await docClient.send(
    new ScanCommand({
      TableName: NEWSLETTER_TABLE,
      Limit: limit,
      ...(cursor && { ExclusiveStartKey: JSON.parse(Buffer.from(cursor, 'base64').toString()) }),
    })
  );

  // Sort by created_at descending (since scan doesn't guarantee order)
  const subscribers = ((result.Items as NewsletterSubscriberRecord[]) || []).sort(
    (a, b) => b.created_at.localeCompare(a.created_at)
  );

  const nextCursor = result.LastEvaluatedKey
    ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
    : undefined;

  return { subscribers, nextCursor };
}

/**
 * Update subscriber status (for ops)
 */
export async function updateSubscriber(
  subscriber_id: string,
  updates: { status: NewsletterStatus }
): Promise<NewsletterSubscriberRecord | null> {
  const now = new Date().toISOString();

  const result = await docClient.send(
    new UpdateCommand({
      TableName: NEWSLETTER_TABLE,
      Key: { subscriber_id },
      UpdateExpression: 'SET #status = :status, updated_at = :updated_at',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': updates.status,
        ':updated_at': now,
      },
      ReturnValues: 'ALL_NEW',
    })
  );

  return (result.Attributes as NewsletterSubscriberRecord) || null;
}

/**
 * Get subscriber counts by status
 */
export async function getSubscriberCounts(): Promise<{
  subscribed: number;
  unsubscribed: number;
  total: number;
}> {
  // Query each status separately for accurate counts
  const [subscribedResult, unsubscribedResult] = await Promise.all([
    docClient.send(
      new QueryCommand({
        TableName: NEWSLETTER_TABLE,
        IndexName: 'status-created-index',
        KeyConditionExpression: '#status = :status',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: { ':status': 'subscribed' },
        Select: 'COUNT',
      })
    ),
    docClient.send(
      new QueryCommand({
        TableName: NEWSLETTER_TABLE,
        IndexName: 'status-created-index',
        KeyConditionExpression: '#status = :status',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: { ':status': 'unsubscribed' },
        Select: 'COUNT',
      })
    ),
  ]);

  const subscribed = subscribedResult.Count || 0;
  const unsubscribed = unsubscribedResult.Count || 0;

  return {
    subscribed,
    unsubscribed,
    total: subscribed + unsubscribed,
  };
}
