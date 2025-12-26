/**
 * Operational Guardrails
 *
 * Per task requirements:
 * - Detect silent failures before they cascade
 * - Alerts are calm, actionable, and rare
 * - No noisy monitoring
 *
 * These guardrails answer: "Should we intervene?"
 * They do not answer: "How do we optimize?"
 */
/**
 * Guardrail alert types
 * Each represents a condition that warrants attention
 */
export interface GuardrailAlert {
    id: string;
    severity: 'warning' | 'critical';
    title: string;
    description: string;
    action: string;
    detectedAt: string;
}
/**
 * Guardrail state
 * Tracks alerts and whether automatic interventions are active
 */
export interface GuardrailState {
    alerts: GuardrailAlert[];
    interventions: {
        bedrockCircuitOpen: boolean;
        assurancePaused: boolean;
        embedsDisabled: boolean;
    };
    lastCheck: string;
}
/**
 * In-memory state for consecutive failure tracking
 * In production, this would be stored in DynamoDB with TTL
 */
interface FailureTracker {
    bedrockConsecutive: number;
    assuranceConsecutive: number;
    schemaViolations: number;
    topicRefusals: Record<string, {
        total: number;
        refused: number;
    }>;
}
/**
 * Record Bedrock call result for circuit breaker
 */
export declare function trackBedrockResult(success: boolean): void;
/**
 * Record assurance generation result
 */
export declare function trackAssuranceResult(success: boolean): void;
/**
 * Record schema violation
 */
export declare function trackSchemaViolation(): void;
/**
 * Record decision for a topic (for refusal spike detection)
 */
export declare function trackTopicDecision(topicId: string, wasRefused: boolean): void;
/**
 * Check if Bedrock circuit breaker should be open
 */
export declare function isBedrockCircuitOpen(): boolean;
/**
 * Check if assurance generation should be paused
 */
export declare function isAssurancePaused(): boolean;
/**
 * Evaluate all guardrails and return current state
 */
export declare function evaluateGuardrails(): GuardrailState;
/**
 * Reset circuit breakers (for recovery)
 */
export declare function resetBedrockCircuit(): void;
export declare function resetAssuranceCircuit(): void;
/**
 * Reset all trackers (for testing or after major recovery)
 */
export declare function resetAllGuardrails(): void;
/**
 * Get current tracker state (for debugging)
 */
export declare function getTrackerState(): FailureTracker;
export {};
//# sourceMappingURL=guardrails.d.ts.map