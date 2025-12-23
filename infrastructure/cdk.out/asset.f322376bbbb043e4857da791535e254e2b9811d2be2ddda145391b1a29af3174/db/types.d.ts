/**
 * Safari Index DynamoDB Types
 * Aligned with: 10_data_model.md
 *
 * These types define the persistence layer for decisions and events.
 * Every decision and refusal must be stored with full audit trail.
 */
import { Assumption, Tradeoffs, DecisionOutcome } from '../types';
/**
 * Decision types as defined in 10_data_model.md Table 4
 */
export type DecisionType = 'timing_verdict' | 'fit_assessment' | 'comparison' | 'itinerary_reco' | 'refusal';
/**
 * Decision state machine states
 * Per 10_data_model.md section 5.2
 */
export type DecisionState = 'ISSUED' | 'REFUSED' | 'REVISED' | 'SUPERSEDED' | 'FLAGGED_FOR_REVIEW' | 'REVIEWED' | 'CORRECTED' | 'CLOSED';
/**
 * Review status for decisions
 */
export type ReviewStatus = 'none' | 'queued' | 'reviewed' | 'corrected';
/**
 * AI trace information for audit
 * Per 10_data_model.md Table 4 ai_trace field
 */
export interface AITrace {
    model: string;
    prompt_version: string;
    safety_flags: string[];
}
/**
 * Review metadata for decisions
 */
export interface ReviewMetadata {
    needs_review: boolean;
    review_reason: string | null;
    review_status: ReviewStatus;
}
/**
 * Verdict structure within a decision record
 * Matches the AI output but stored as nested object
 */
export interface StoredVerdict {
    outcome: DecisionOutcome | 'refused';
    headline: string;
    summary: string;
}
/**
 * Decision record for DynamoDB
 * Per 10_data_model.md Table 4: decision
 *
 * PK: decision_id
 * GSI1: traveler_id + created_at
 * GSI2: lead_id + created_at
 * GSI3: review.needs_review + created_at
 */
export interface DecisionRecord {
    decision_id: string;
    traveler_id: string | null;
    session_id: string | null;
    lead_id: string | null;
    created_at: string;
    updated_at: string;
    decision_type: DecisionType;
    state: DecisionState;
    verdict: StoredVerdict;
    assumptions: Assumption[];
    tradeoffs: Tradeoffs;
    change_conditions: string[];
    confidence: number;
    inputs_snapshot: Record<string, unknown>;
    logic_version: string;
    ai_used: boolean;
    ai_trace: AITrace | null;
    itinerary_id: string | null;
    content_page_id: string | null;
    review: ReviewMetadata;
    supersedes_decision_id: string | null;
}
/**
 * Event types as defined in 10_data_model.md Table 7
 * Initial set for MVP per 11_mvp_build_plan.md
 */
export type EventType = 'SESSION_STARTED' | 'ENGAGED' | 'PAGE_VIEWED' | 'TOOL_STARTED' | 'TOOL_COMPLETED' | 'DECISION_ISSUED' | 'DECISION_REFUSED' | 'ITINERARY_GENERATED' | 'LEAD_CREATED' | 'LEAD_STATE_CHANGED' | 'DECISION_REVERSED' | 'TRUST_FLAG_RAISED';
/**
 * Event record for DynamoDB
 * Per 10_data_model.md Table 7: event_log
 *
 * PK: event_id
 * GSI1: traveler_id + created_at
 * GSI2: event_type + created_at
 *
 * Events are IMMUTABLE. Once written, they cannot be modified.
 */
export interface EventRecord {
    event_id: string;
    created_at: string;
    event_type: EventType;
    traveler_id: string | null;
    session_id: string | null;
    lead_id: string | null;
    decision_id: string | null;
    itinerary_id: string | null;
    page_id: string | null;
    payload: Record<string, unknown>;
}
/**
 * Payload types for specific events
 * These enforce structure on the payload field
 * Index signature allows compatibility with Record<string, unknown>
 */
export interface DecisionIssuedPayload {
    [key: string]: unknown;
    outcome: DecisionOutcome;
    confidence: number;
    logic_version: string;
    ai_used: boolean;
}
export interface DecisionRefusedPayload {
    [key: string]: unknown;
    reason: string;
    missing_inputs_count: number;
    logic_version: string;
}
export interface SessionStartedPayload {
    [key: string]: unknown;
    source: 'organic' | 'direct' | 'referral' | 'paid' | 'partner';
    landing_url: string;
    device_type: 'desktop' | 'mobile' | 'tablet';
}
export interface EngagedPayload {
    [key: string]: unknown;
    trigger: string;
}
//# sourceMappingURL=types.d.ts.map