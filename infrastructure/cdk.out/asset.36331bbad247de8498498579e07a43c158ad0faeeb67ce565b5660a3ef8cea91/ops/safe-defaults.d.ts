/**
 * Safe Defaults for Degraded States
 *
 * Per task requirements:
 * - Define fallback behavior when services are unavailable
 * - Prefer refusal over weak or incorrect decisions
 * - No silent failures that could mislead users
 *
 * Philosophy: It is better to refuse than to guess.
 */
/**
 * Decision outcome types
 */
export type SafeOutcome = 'refuse' | 'defer' | 'cached';
/**
 * Safe decision response when AI is unavailable
 */
export interface SafeDecisionResponse {
    outcome: SafeOutcome;
    message: string;
    retryAfter?: number;
    cached?: {
        decisionId: string;
        generatedAt: string;
        isStale: boolean;
    };
}
/**
 * Safe assurance response when generation is unavailable
 */
export interface SafeAssuranceResponse {
    available: false;
    reason: string;
    retryAfter?: number;
}
/**
 * Get safe default decision when Bedrock is unavailable
 *
 * Per governance: prefer refusal over weak decisions
 */
export declare function getSafeDecisionDefault(topicId: string, cachedDecision?: {
    decisionId: string;
    generatedAt: string;
}): SafeDecisionResponse;
/**
 * Get safe default assurance response when generation is unavailable
 */
export declare function getSafeAssuranceDefault(): SafeAssuranceResponse;
/**
 * Safe embed response when embeds are disabled
 */
export interface SafeEmbedResponse {
    available: false;
    fallbackHtml: string;
}
export declare function getSafeEmbedDefault(decisionId: string): SafeEmbedResponse;
/**
 * Check if system is in degraded mode
 * Returns true if any major service is unavailable
 */
export declare function isSystemDegraded(): boolean;
/**
 * Get system status message for users
 */
export declare function getSystemStatusMessage(): string | null;
/**
 * Safe follow-up response when notifications cannot be processed
 */
export interface SafeFollowUpResponse {
    subscribed: boolean;
    message: string;
}
export declare function getSafeFollowUpDefault(): SafeFollowUpResponse;
/**
 * Decision schema for validation
 * Used to detect schema violations
 */
export interface DecisionSchema {
    decisionId: string;
    topicId: string;
    outcome: 'book' | 'wait' | 'switch' | 'discard';
    confidence: number;
    reasoning: string;
    assumptions: Array<{
        id: string;
        text: string;
        confidence: number;
    }>;
    logicVersion: string;
}
/**
 * Validate decision output against schema
 * Returns list of violations (empty if valid)
 */
export declare function validateDecisionSchema(decision: unknown): string[];
//# sourceMappingURL=safe-defaults.d.ts.map