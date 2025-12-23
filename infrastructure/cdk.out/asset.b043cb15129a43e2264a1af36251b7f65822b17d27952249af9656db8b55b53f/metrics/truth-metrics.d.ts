/**
 * Truth Metrics
 *
 * Per 04_metrics_truth.md:
 * - Only metrics that reflect decision quality
 * - No vanity metrics, no conversion optimization
 *
 * Metrics tracked:
 * - Decision Completion Rate: decisions issued / total requests
 * - Refusal Rate: refusals / total requests
 * - Decision Reversal Rate: outcome changes / total decisions
 */
export interface TopicMetrics {
    topic_id: string;
    total_requests: number;
    decisions_issued: number;
    refusals: number;
    completion_rate: number;
    refusal_rate: number;
    avg_confidence: number;
    outcome_distribution: Record<string, number>;
}
/**
 * Get metrics for a specific topic
 * Per 04_metrics_truth.md: truth metrics only
 */
export declare function getTopicMetrics(topicId: string): Promise<TopicMetrics>;
/**
 * Get confidence history for drift detection
 */
export declare function getConfidenceHistory(topicId: string, limit?: number): Promise<{
    confidence: number;
    created_at: string;
}[]>;
/**
 * Detect confidence drift for a topic
 * Returns true if drift exceeds threshold
 */
export declare function detectConfidenceDrift(topicId: string, baselineConfidence: number, threshold?: number): Promise<{
    drifted: boolean;
    currentAvg: number;
    drift: number;
}>;
/**
 * Get all topic metrics summary
 * For review interface
 */
export declare function getAllTopicsMetricsSummary(): Promise<{
    topic_id: string;
    refusal_rate: number;
    avg_confidence: number;
    total: number;
}[]>;
//# sourceMappingURL=truth-metrics.d.ts.map