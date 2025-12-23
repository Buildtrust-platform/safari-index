/**
 * Review Trigger Logic
 *
 * Per 06_review_correction.md:
 * - Automatically flag decisions for review when quality signals degrade
 *
 * Per 04_metrics_truth.md:
 * - Only track metrics that reflect decision quality
 */
export interface ReviewTriggerContext {
    topicId: string;
    decisionId: string | null;
    sessionId: string;
    travelerId: string | null;
}
/**
 * Check if repeated topic visit should trigger review
 */
export declare function checkRepeatedVisitTrigger(context: ReviewTriggerContext, visitCount: number): Promise<boolean>;
/**
 * Check if outcome change should trigger review
 */
export declare function checkOutcomeChangeTrigger(context: ReviewTriggerContext, previousOutcome: string, currentOutcome: string, hoursSincePrevious: number): Promise<boolean>;
/**
 * Check if refusal rate should trigger review
 */
export declare function checkRefusalRateTrigger(topicId: string, refusalCount: number, totalCount: number): Promise<boolean>;
/**
 * Check if confidence drift should trigger review
 */
export declare function checkConfidenceDriftTrigger(topicId: string, baselineConfidence: number, currentAvgConfidence: number): Promise<boolean>;
/**
 * Log quality gate failure for review
 */
export declare function logQualityGateFailure(topicId: string, decisionId: string | null, failures: string[]): Promise<string>;
//# sourceMappingURL=triggers.d.ts.map