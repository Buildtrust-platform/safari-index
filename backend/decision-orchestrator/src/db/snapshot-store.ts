/**
 * Safari Index Snapshot Cache Store
 *
 * Provides caching layer for pre-computed decision snapshots.
 * Used to:
 * 1. Serve instant responses for default inputs
 * 2. Prevent evaluation stampedes via request coalescing
 * 3. Reduce Bedrock API calls for repeated identical requests
 *
 * Cache strategy:
 * - One snapshot per topic_id for default StandardInputEnvelope
 * - TTL-based expiration (24 hours default)
 * - In-flight lock for request coalescing (30 seconds)
 *
 * NOT used for:
 * - Custom/override inputs (those always go to live evaluation)
 * - Variant testing (always fresh)
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { createHash } from 'crypto';
import { DecisionResponse, StandardInputEnvelope } from '../types';

// Configuration
const SNAPSHOT_TABLE = process.env.SNAPSHOT_TABLE || 'safari-index-snapshots';
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT;

// Cache TTL settings
const SNAPSHOT_TTL_HOURS = 24; // Snapshots expire after 24 hours
const LOCK_TTL_SECONDS = 30; // In-flight lock expires after 30 seconds

// Initialize DynamoDB client
const ddbClient = new DynamoDBClient({
  region: AWS_REGION,
  ...(DYNAMODB_ENDPOINT && { endpoint: DYNAMODB_ENDPOINT }),
});
const docClient = DynamoDBDocumentClient.from(ddbClient);

/**
 * Snapshot record stored in DynamoDB
 */
export interface SnapshotRecord {
  topic_id: string;
  decision_response: DecisionResponse;
  inputs_hash: string;
  created_at: string; // ISO 8601
  expires_at: string; // ISO 8601
  expires_at_epoch: number; // Unix timestamp for DynamoDB TTL
  lock_until?: string; // ISO 8601, present if evaluation in progress
  lock_id?: string; // Unique lock identifier
}

/**
 * Result of trying to get a snapshot
 */
export type SnapshotResult =
  | { status: 'hit'; snapshot: DecisionResponse; age_seconds: number }
  | { status: 'miss' }
  | { status: 'locked'; retry_after_seconds: number }
  | { status: 'stale'; snapshot: DecisionResponse; age_seconds: number };

/**
 * Generate a deterministic hash of the input envelope for cache key comparison
 * Only includes fields that affect the decision output
 */
export function hashInputs(input: StandardInputEnvelope): string {
  const relevant = {
    task: input.task,
    user_context: input.user_context,
    request: {
      question: input.request.question,
      scope: input.request.scope,
      destinations_considered: input.request.destinations_considered,
    },
    facts: input.facts,
  };
  return createHash('sha256').update(JSON.stringify(relevant)).digest('hex').substring(0, 16);
}

/**
 * Extract topic_id from the input envelope
 * The topic_id is derived from the request question/scope
 */
export function extractTopicId(input: StandardInputEnvelope): string {
  // For now, use a hash of question + scope as topic_id
  // In production, this should be passed explicitly in the envelope
  const key = `${input.request.question}:${input.request.scope}`;
  return createHash('sha256').update(key).digest('hex').substring(0, 12);
}

/**
 * Check if an input is using default values (cacheable)
 * Custom/override inputs should bypass the cache
 */
export function isDefaultInput(input: StandardInputEnvelope): boolean {
  // Default inputs have unknown/balanced values
  const ctx = input.user_context;
  return (
    ctx.traveler_type === 'unknown' ||
    ctx.traveler_type === 'first_time'
  ) && (
    ctx.budget_band === 'unknown' ||
    ctx.budget_band === 'fair_value'
  ) && (
    ctx.dates.type === 'unknown' ||
    ctx.dates.type === 'flexible'
  );
}

/**
 * Try to get a cached snapshot for a topic
 * Returns the snapshot if valid, or status indicating why it's not available
 */
export async function getSnapshot(topicId: string, inputsHash: string): Promise<SnapshotResult> {
  try {
    const result = await docClient.send(
      new GetCommand({
        TableName: SNAPSHOT_TABLE,
        Key: { topic_id: topicId },
      })
    );

    if (!result.Item) {
      return { status: 'miss' };
    }

    const record = result.Item as SnapshotRecord;
    const now = new Date();
    const createdAt = new Date(record.created_at);
    const expiresAt = new Date(record.expires_at);
    const ageSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);

    // Check if locked (evaluation in progress)
    if (record.lock_until) {
      const lockUntil = new Date(record.lock_until);
      if (now < lockUntil) {
        const retryAfter = Math.ceil((lockUntil.getTime() - now.getTime()) / 1000);
        return { status: 'locked', retry_after_seconds: retryAfter };
      }
      // Lock expired, proceed as if not locked
    }

    // Check if inputs match
    if (record.inputs_hash !== inputsHash) {
      // Different inputs, treat as miss
      return { status: 'miss' };
    }

    // Check if expired
    if (now > expiresAt) {
      // Expired but still usable as stale fallback
      return { status: 'stale', snapshot: record.decision_response, age_seconds: ageSeconds };
    }

    // Valid cache hit
    return { status: 'hit', snapshot: record.decision_response, age_seconds: ageSeconds };
  } catch (error) {
    console.error('Error reading snapshot cache:', error);
    return { status: 'miss' };
  }
}

/**
 * Lock acquisition result
 */
export type LockResult =
  | { status: 'acquired'; lockId: string }
  | { status: 'locked' } // Another process has the lock
  | { status: 'unavailable' }; // Infrastructure error - proceed without lock

/**
 * Try to acquire a lock for a topic evaluation
 * Uses conditional write to ensure only one evaluator proceeds
 * Returns status indicating whether lock was acquired, already held, or unavailable
 */
export async function acquireLock(topicId: string): Promise<LockResult> {
  const lockId = `lock_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
  const now = new Date();
  const lockUntil = new Date(now.getTime() + LOCK_TTL_SECONDS * 1000);

  try {
    await docClient.send(
      new UpdateCommand({
        TableName: SNAPSHOT_TABLE,
        Key: { topic_id: topicId },
        UpdateExpression: 'SET lock_until = :lockUntil, lock_id = :lockId',
        ConditionExpression:
          'attribute_not_exists(lock_until) OR lock_until < :now OR lock_id = :lockId',
        ExpressionAttributeValues: {
          ':lockUntil': lockUntil.toISOString(),
          ':lockId': lockId,
          ':now': now.toISOString(),
        },
      })
    );
    return { status: 'acquired', lockId };
  } catch (error) {
    // ConditionalCheckFailedException means another process has the lock
    if ((error as Error).name === 'ConditionalCheckFailedException') {
      return { status: 'locked' };
    }
    // For other errors (table doesn't exist, network issues), proceed without lock
    console.warn('Lock infrastructure unavailable, proceeding without lock:', error);
    return { status: 'unavailable' };
  }
}

/**
 * Store a snapshot and release the lock
 */
export async function storeSnapshot(
  topicId: string,
  response: DecisionResponse,
  inputsHash: string,
  lockId?: string
): Promise<void> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SNAPSHOT_TTL_HOURS * 60 * 60 * 1000);

  const record: SnapshotRecord = {
    topic_id: topicId,
    decision_response: response,
    inputs_hash: inputsHash,
    created_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
    expires_at_epoch: Math.floor(expiresAt.getTime() / 1000),
    // Clear the lock
  };

  try {
    if (lockId) {
      // Only store if we still hold the lock
      await docClient.send(
        new PutCommand({
          TableName: SNAPSHOT_TABLE,
          Item: record,
          ConditionExpression: 'lock_id = :lockId OR attribute_not_exists(topic_id)',
          ExpressionAttributeValues: {
            ':lockId': lockId,
          },
        })
      );
    } else {
      // No lock verification needed
      await docClient.send(
        new PutCommand({
          TableName: SNAPSHOT_TABLE,
          Item: record,
        })
      );
    }
  } catch (error) {
    console.error('Error storing snapshot:', error);
    // Don't throw - caching failure shouldn't break the response
  }
}

/**
 * Release a lock without storing a snapshot (e.g., on error)
 */
export async function releaseLock(topicId: string, lockId: string): Promise<void> {
  try {
    await docClient.send(
      new UpdateCommand({
        TableName: SNAPSHOT_TABLE,
        Key: { topic_id: topicId },
        UpdateExpression: 'REMOVE lock_until, lock_id',
        ConditionExpression: 'lock_id = :lockId',
        ExpressionAttributeValues: {
          ':lockId': lockId,
        },
      })
    );
  } catch (error) {
    // Ignore errors - lock will expire anyway
    console.warn('Error releasing lock:', error);
  }
}

/**
 * Invalidate a snapshot (force refresh on next request)
 */
export async function invalidateSnapshot(topicId: string): Promise<void> {
  try {
    await docClient.send(
      new DeleteCommand({
        TableName: SNAPSHOT_TABLE,
        Key: { topic_id: topicId },
      })
    );
  } catch (error) {
    console.error('Error invalidating snapshot:', error);
  }
}
