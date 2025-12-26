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
/**
 * Review reason codes per 06_review_correction.md
 */
export type ReviewReasonCode = 'QUALITY_GATE_FAILED' | 'REPEATED_TOPIC_VISIT' | 'OUTCOME_CHANGED' | 'HIGH_REFUSAL_RATE' | 'CONFIDENCE_DRIFT' | 'MANUAL_FLAG';
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
/**
 * Create a review record
 */
export declare function createReviewRecord(topicId: string, decisionId: string | null, reasonCode: ReviewReasonCode, reasonDetails: string, metadata?: Record<string, unknown>): Promise<string>;
/**
 * Get pending reviews
 */
export declare function getPendingReviews(limit?: number): Promise<ReviewRecord[]>;
/**
 * Get reviews by topic
 */
export declare function getReviewsByTopic(topicId: string, limit?: number): Promise<ReviewRecord[]>;
/**
 * Update review status
 */
export declare function updateReviewStatus(reviewId: string, status: ReviewRecord['status'], reviewerId: string, notes: string): Promise<void>;
//# sourceMappingURL=review-store.d.ts.map