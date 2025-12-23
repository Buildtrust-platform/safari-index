/**
 * Decision Assurance Types
 *
 * Per 02_decision_doctrine.md:
 * - Decision Assurance is a finalized, reviewable artifact
 * - It does NOT change the decision outcome
 * - It does NOT promise certainty or guarantees
 *
 * Per 11_mvp_build_plan.md:
 * - Monetization must not undermine authority
 * - No subscriptions, no bundles, no upsells
 */
/**
 * Decision Assurance artifact structure
 * This is what the user receives as a paid artifact
 */
export interface DecisionAssuranceArtifact {
    assurance_id: string;
    decision_id: string;
    topic_id: string;
    verdict: {
        outcome: 'book' | 'wait' | 'switch' | 'discard';
        headline: string;
        summary: string;
        confidence: number;
        confidence_label: 'High' | 'Medium' | 'Low';
    };
    assumptions: Array<{
        id: string;
        text: string;
        confidence: number;
    }>;
    tradeoffs: {
        gains: string[];
        losses: string[];
    };
    change_conditions: string[];
    invalidation_checklist: string[];
    created_at: string;
    logic_version: string;
    prompt_version: string;
    review_status: 'automated' | 'pending_human_review' | 'human_reviewed';
    reviewer_id: string | null;
    reviewed_at: string | null;
    payment_status: 'pending' | 'completed' | 'refunded';
    payment_id: string | null;
}
/**
 * Assurance record stored in DynamoDB
 */
export interface AssuranceRecord {
    assurance_id: string;
    decision_id: string;
    topic_id: string;
    traveler_id: string | null;
    session_id: string;
    created_at: string;
    updated_at: string;
    artifact: DecisionAssuranceArtifact;
    payment_status: 'pending' | 'completed' | 'refunded';
    payment_id: string | null;
    payment_amount_cents: number;
    payment_currency: string;
    download_count: number;
    last_accessed_at: string | null;
    status: 'draft' | 'issued' | 'revoked';
    revocation_reason: string | null;
}
/**
 * Assurance generation request
 */
export interface AssuranceRequest {
    decision_id: string;
    session_id: string;
    traveler_id: string | null;
}
/**
 * Assurance generation result
 */
export interface AssuranceResult {
    success: boolean;
    assurance_id?: string;
    artifact?: DecisionAssuranceArtifact;
    error?: string;
    error_code?: AssuranceErrorCode;
}
/**
 * Error codes for assurance generation failures
 * Per 02_decision_doctrine.md: refuse rather than issue weak assurance
 */
export type AssuranceErrorCode = 'DECISION_NOT_FOUND' | 'DECISION_IS_REFUSAL' | 'DECISION_FLAGGED_FOR_REVIEW' | 'CONFIDENCE_BELOW_THRESHOLD' | 'MISSING_REQUIRED_FIELDS' | 'PAYMENT_REQUIRED' | 'ALREADY_ISSUED';
/**
 * Pricing configuration
 * Per governance: one-time, single decision, no bundles
 */
export declare const ASSURANCE_PRICING: {
    readonly BASE_PRICE_CENTS: 2900;
    readonly CURRENCY: "USD";
};
/**
 * Minimum confidence threshold for assurance
 * Per 02_decision_doctrine.md: prefer refusal over weak decisions
 */
export declare const ASSURANCE_CONFIDENCE_THRESHOLD = 0.5;
//# sourceMappingURL=types.d.ts.map