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
import { DecisionResponse, StandardInputEnvelope } from '../types';
/**
 * Snapshot record stored in DynamoDB
 */
export interface SnapshotRecord {
    topic_id: string;
    decision_response: DecisionResponse;
    inputs_hash: string;
    created_at: string;
    expires_at: string;
    expires_at_epoch: number;
    lock_until?: string;
    lock_id?: string;
}
/**
 * Result of trying to get a snapshot
 */
export type SnapshotResult = {
    status: 'hit';
    snapshot: DecisionResponse;
    age_seconds: number;
} | {
    status: 'miss';
} | {
    status: 'locked';
    retry_after_seconds: number;
} | {
    status: 'stale';
    snapshot: DecisionResponse;
    age_seconds: number;
};
/**
 * Generate a deterministic hash of the input envelope for cache key comparison
 * Only includes fields that affect the decision output
 */
export declare function hashInputs(input: StandardInputEnvelope): string;
/**
 * Extract topic_id from the input envelope
 * The topic_id is derived from the request question/scope
 */
export declare function extractTopicId(input: StandardInputEnvelope): string;
/**
 * Check if an input is using default values (cacheable)
 * Custom/override inputs should bypass the cache
 */
export declare function isDefaultInput(input: StandardInputEnvelope): boolean;
/**
 * Try to get a cached snapshot for a topic
 * Returns the snapshot if valid, or status indicating why it's not available
 */
export declare function getSnapshot(topicId: string, inputsHash: string): Promise<SnapshotResult>;
/**
 * Lock acquisition result
 */
export type LockResult = {
    status: 'acquired';
    lockId: string;
} | {
    status: 'locked';
} | {
    status: 'unavailable';
};
/**
 * Try to acquire a lock for a topic evaluation
 * Uses conditional write to ensure only one evaluator proceeds
 * Returns status indicating whether lock was acquired, already held, or unavailable
 */
export declare function acquireLock(topicId: string): Promise<LockResult>;
/**
 * Store a snapshot and release the lock
 */
export declare function storeSnapshot(topicId: string, response: DecisionResponse, inputsHash: string, lockId?: string): Promise<void>;
/**
 * Release a lock without storing a snapshot (e.g., on error)
 */
export declare function releaseLock(topicId: string, lockId: string): Promise<void>;
/**
 * Invalidate a snapshot (force refresh on next request)
 */
export declare function invalidateSnapshot(topicId: string): Promise<void>;
//# sourceMappingURL=snapshot-store.d.ts.map