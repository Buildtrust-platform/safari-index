/**
 * Safari Index Event Store
 * Logs immutable events to DynamoDB
 *
 * Per 10_data_model.md Table 7: event_log
 * Per 11_mvp_build_plan.md: "If you don't log events now, you will never trust metrics later."
 *
 * Events are IMMUTABLE. Once written, they cannot be modified or deleted.
 * This enables:
 * - Audit trails
 * - Metrics calculation
 * - Decision review
 * - Trust verification
 */
import { EventRecord, EventType, SessionStartedPayload, EngagedPayload } from './types';
import { DecisionRecord } from './types';
/**
 * Log SESSION_STARTED event
 * Per 10_data_model.md and 11_mvp_build_plan.md Phase 1
 */
export declare function logSessionStarted(sessionId: string, travelerId: string | null, payload: SessionStartedPayload): Promise<string>;
/**
 * Log ENGAGED event
 * Triggered when user shows meaningful engagement
 * Per 10_data_model.md: engagement tracking
 */
export declare function logEngaged(sessionId: string, travelerId: string | null, payload: EngagedPayload): Promise<string>;
/**
 * Log DECISION_ISSUED event
 * Per 11_mvp_build_plan.md: Required MVP event
 *
 * This event fires when a decision with outcome (book|wait|switch|discard)
 * is successfully issued and stored.
 */
export declare function logDecisionIssued(decisionRecord: DecisionRecord): Promise<string>;
/**
 * Log DECISION_REFUSED event
 * Per 11_mvp_build_plan.md: Required MVP event
 *
 * This event fires when the platform refuses to issue a decision.
 * Per 02_decision_doctrine.md: "Refusal is not failure. Refusal is responsibility."
 */
export declare function logDecisionRefused(decisionRecord: DecisionRecord): Promise<string>;
/**
 * Log TOOL_COMPLETED event (optional per task description)
 * Tracks when a decision tool finishes execution
 */
export declare function logToolCompleted(sessionId: string, travelerId: string | null, toolName: string, durationMs: number): Promise<string>;
/**
 * Query events by traveler
 * Uses GSI1: traveler_id + created_at
 */
export declare function getEventsByTraveler(travelerId: string, limit?: number): Promise<EventRecord[]>;
/**
 * Query events by type
 * Uses GSI2: event_type + created_at
 */
export declare function getEventsByType(eventType: EventType, limit?: number): Promise<EventRecord[]>;
/**
 * Query events by session
 * Useful for reconstructing a user's journey
 */
export declare function getEventsBySession(sessionId: string, limit?: number): Promise<EventRecord[]>;
//# sourceMappingURL=event-store.d.ts.map