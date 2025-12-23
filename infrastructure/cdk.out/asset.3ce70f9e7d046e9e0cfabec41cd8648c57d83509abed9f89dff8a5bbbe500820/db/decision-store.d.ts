/**
 * Safari Index Decision Store
 * Persists decisions to DynamoDB
 *
 * Per 10_data_model.md: "If decisions are not persisted, nothing else matters."
 * Per 11_mvp_build_plan.md Phase 1: "Decision schema + DB"
 *
 * Every decision (issued or refused) MUST be stored with:
 * - verdict, assumptions, trade-offs, change conditions
 * - logic_version and prompt_version for audit
 * - inputs_snapshot for reproducibility
 */
import { DecisionRecord } from './types';
import { AIOutput, StandardInputEnvelope } from '../types';
/**
 * Store a decision in DynamoDB
 * Returns the decision_id for reference
 *
 * Per 11_mvp_build_plan.md: "A real decision can be issued and stored."
 */
export declare function storeDecision(input: StandardInputEnvelope, output: AIOutput, sessionId?: string | null, travelerId?: string | null, leadId?: string | null): Promise<{
    decisionId: string;
    record: DecisionRecord;
}>;
/**
 * Retrieve a decision by ID
 */
export declare function getDecision(decisionId: string): Promise<DecisionRecord | null>;
/**
 * Query decisions by traveler ID
 * Uses GSI1: traveler_id + created_at
 */
export declare function getDecisionsByTraveler(travelerId: string, limit?: number): Promise<DecisionRecord[]>;
/**
 * Query decisions needing review
 * Uses GSI3: review.needs_review + created_at
 */
export declare function getDecisionsNeedingReview(limit?: number): Promise<DecisionRecord[]>;
//# sourceMappingURL=decision-store.d.ts.map