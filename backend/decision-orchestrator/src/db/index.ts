/**
 * Safari Index Database Layer
 * Exports persistence and event logging services
 */

// Types
export * from './types';

// Decision persistence
export {
  storeDecision,
  getDecision,
  getDecisionsByTraveler,
  getDecisionsNeedingReview,
} from './decision-store';

// Event logging
export {
  logSessionStarted,
  logEngaged,
  logDecisionIssued,
  logDecisionRefused,
  logToolCompleted,
  logEvent,
  getEventsByTraveler,
  getEventsByType,
  getEventsBySession,
} from './event-store';

// Review queue
export {
  createReviewRecord,
  getPendingReviews,
  getReviewsByTopic,
  updateReviewStatus,
} from './review-store';
export type { ReviewReasonCode, ReviewRecord } from './review-store';

// Snapshot cache
export {
  getSnapshot,
  storeSnapshot,
  acquireLock,
  releaseLock,
  invalidateSnapshot,
  hashInputs,
  extractTopicId,
  isDefaultInput,
} from './snapshot-store';
export type { SnapshotRecord, SnapshotResult, LockResult } from './snapshot-store';
