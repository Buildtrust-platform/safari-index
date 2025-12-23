/**
 * System Health Signals
 *
 * Per 04_metrics_truth.md:
 * - Metrics exist for truth, not optimization
 * - Health signals detect degradation, not performance
 *
 * These signals answer: "Is the system behaving correctly?"
 * They do not answer: "Is the system fast enough?"
 */
/**
 * Health signal definitions
 * Each signal has a threshold that triggers concern
 */
export interface HealthSignal {
    name: string;
    value: number;
    threshold: number;
    status: 'healthy' | 'warning' | 'critical';
    description: string;
}
export interface HealthSnapshot {
    timestamp: string;
    signals: HealthSignal[];
    overall: 'healthy' | 'degraded' | 'critical';
    actionRequired: boolean;
    summary: string;
}
/**
 * In-memory counters for health computation
 * Reset on deploy (stateless between invocations in Lambda)
 * For production, these would be read from CloudWatch metrics or DynamoDB
 */
interface HealthCounters {
    decisionsIssued: number;
    decisionsRefused: number;
    decisionsFailed: number;
    assurancesIssued: number;
    assurancesFailed: number;
    embedsRendered: number;
    embedErrors: number;
    bedrockFailures: number;
    bedrockCalls: number;
    reviewsCreated: number;
    reviewsResolved: number;
    windowStartTime: number;
}
/**
 * Increment counters (called from various parts of the system)
 */
export declare function recordDecisionIssued(): void;
export declare function recordDecisionRefused(): void;
export declare function recordDecisionFailed(): void;
export declare function recordAssuranceIssued(): void;
export declare function recordAssuranceFailed(): void;
export declare function recordEmbedRendered(): void;
export declare function recordEmbedError(): void;
export declare function recordBedrockCall(success: boolean): void;
export declare function recordReviewCreated(): void;
export declare function recordReviewResolved(): void;
/**
 * Compute health signals from current counters
 */
export declare function computeHealthSignals(): HealthSignal[];
/**
 * Compute overall health snapshot
 */
export declare function getHealthSnapshot(): HealthSnapshot;
/**
 * Get current counters (for debugging/testing)
 */
export declare function getCounters(): HealthCounters;
export {};
//# sourceMappingURL=health-signals.d.ts.map