"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackBedrockResult = trackBedrockResult;
exports.trackAssuranceResult = trackAssuranceResult;
exports.trackSchemaViolation = trackSchemaViolation;
exports.trackTopicDecision = trackTopicDecision;
exports.isBedrockCircuitOpen = isBedrockCircuitOpen;
exports.isAssurancePaused = isAssurancePaused;
exports.evaluateGuardrails = evaluateGuardrails;
exports.resetBedrockCircuit = resetBedrockCircuit;
exports.resetAssuranceCircuit = resetAssuranceCircuit;
exports.resetAllGuardrails = resetAllGuardrails;
exports.getTrackerState = getTrackerState;
const health_signals_1 = require("./health-signals");
/**
 * Thresholds for guardrail triggers
 * These are more aggressive than health signal thresholds
 * because they trigger intervention, not just observation
 */
const GUARDRAIL_THRESHOLDS = {
    // Bedrock failures: 3 consecutive failures triggers circuit breaker
    bedrockConsecutiveFailures: 3,
    // Refusal spike: 60% refusal rate in window triggers topic review
    refusalSpikeRate: 0.6,
    // Assurance failures: 3 consecutive failures pauses assurance
    assuranceConsecutiveFailures: 3,
    // Review queue: 30 unresolved triggers capacity warning
    reviewQueueCapacity: 30,
    // Schema violations: Any violation is critical
    schemaViolationCount: 1,
};
let tracker = resetTracker();
function resetTracker() {
    return {
        bedrockConsecutive: 0,
        assuranceConsecutive: 0,
        schemaViolations: 0,
        topicRefusals: {},
    };
}
/**
 * Record Bedrock call result for circuit breaker
 */
function trackBedrockResult(success) {
    if (success) {
        tracker.bedrockConsecutive = 0;
    }
    else {
        tracker.bedrockConsecutive++;
    }
}
/**
 * Record assurance generation result
 */
function trackAssuranceResult(success) {
    if (success) {
        tracker.assuranceConsecutive = 0;
    }
    else {
        tracker.assuranceConsecutive++;
    }
}
/**
 * Record schema violation
 */
function trackSchemaViolation() {
    tracker.schemaViolations++;
}
/**
 * Record decision for a topic (for refusal spike detection)
 */
function trackTopicDecision(topicId, wasRefused) {
    if (!tracker.topicRefusals[topicId]) {
        tracker.topicRefusals[topicId] = { total: 0, refused: 0 };
    }
    tracker.topicRefusals[topicId].total++;
    if (wasRefused) {
        tracker.topicRefusals[topicId].refused++;
    }
}
/**
 * Check if Bedrock circuit breaker should be open
 */
function isBedrockCircuitOpen() {
    return tracker.bedrockConsecutive >= GUARDRAIL_THRESHOLDS.bedrockConsecutiveFailures;
}
/**
 * Check if assurance generation should be paused
 */
function isAssurancePaused() {
    return tracker.assuranceConsecutive >= GUARDRAIL_THRESHOLDS.assuranceConsecutiveFailures;
}
/**
 * Get topics with refusal spikes
 */
function getRefusalSpikeTopics() {
    const spikeTopics = [];
    for (const [topicId, stats] of Object.entries(tracker.topicRefusals)) {
        // Only flag if we have enough data (at least 5 decisions)
        if (stats.total >= 5) {
            const refusalRate = stats.refused / stats.total;
            if (refusalRate >= GUARDRAIL_THRESHOLDS.refusalSpikeRate) {
                spikeTopics.push(topicId);
            }
        }
    }
    return spikeTopics;
}
/**
 * Evaluate all guardrails and return current state
 */
function evaluateGuardrails() {
    const alerts = [];
    const now = new Date().toISOString();
    // Get health snapshot for additional context
    const health = (0, health_signals_1.getHealthSnapshot)();
    // 1. Bedrock Circuit Breaker
    if (isBedrockCircuitOpen()) {
        alerts.push({
            id: 'bedrock-circuit-open',
            severity: 'critical',
            title: 'Bedrock AI Unavailable',
            description: `${tracker.bedrockConsecutive} consecutive Bedrock failures detected.`,
            action: 'Decisions are using safe defaults. Check AWS Bedrock status and credentials.',
            detectedAt: now,
        });
    }
    // 2. Assurance Paused
    if (isAssurancePaused()) {
        alerts.push({
            id: 'assurance-paused',
            severity: 'critical',
            title: 'Assurance Generation Paused',
            description: `${tracker.assuranceConsecutive} consecutive assurance failures detected.`,
            action: 'Assurance purchases are temporarily unavailable. Check PDF generation and AI services.',
            detectedAt: now,
        });
    }
    // 3. Schema Violations
    if (tracker.schemaViolations >= GUARDRAIL_THRESHOLDS.schemaViolationCount) {
        alerts.push({
            id: 'schema-violations',
            severity: 'critical',
            title: 'Decision Schema Violations',
            description: `${tracker.schemaViolations} schema violation(s) detected in decision output.`,
            action: 'Review decision logic. AI may be producing malformed output.',
            detectedAt: now,
        });
    }
    // 4. Refusal Spikes
    const spikeTopics = getRefusalSpikeTopics();
    if (spikeTopics.length > 0) {
        alerts.push({
            id: 'refusal-spike',
            severity: 'warning',
            title: 'Unusual Refusal Rate',
            description: `Topics with >60% refusal rate: ${spikeTopics.join(', ')}`,
            action: 'Review topic configurations. May indicate overly strict logic or bad input data.',
            detectedAt: now,
        });
    }
    // 5. Review Queue Capacity
    const reviewGrowthSignal = health.signals.find((s) => s.name === 'review_queue_growth');
    if (reviewGrowthSignal && reviewGrowthSignal.value >= GUARDRAIL_THRESHOLDS.reviewQueueCapacity) {
        alerts.push({
            id: 'review-queue-capacity',
            severity: 'warning',
            title: 'Review Queue Growing',
            description: `${reviewGrowthSignal.value} unresolved reviews in current window.`,
            action: 'Review queue may exceed capacity. Consider adding reviewers or adjusting review criteria.',
            detectedAt: now,
        });
    }
    // 6. Critical health status triggers general alert
    if (health.overall === 'critical' && alerts.length === 0) {
        alerts.push({
            id: 'health-critical',
            severity: 'critical',
            title: 'System Health Critical',
            description: health.summary,
            action: 'Review health signals for specific issues.',
            detectedAt: now,
        });
    }
    return {
        alerts,
        interventions: {
            bedrockCircuitOpen: isBedrockCircuitOpen(),
            assurancePaused: isAssurancePaused(),
            embedsDisabled: false, // Not currently implemented
        },
        lastCheck: now,
    };
}
/**
 * Reset circuit breakers (for recovery)
 */
function resetBedrockCircuit() {
    tracker.bedrockConsecutive = 0;
}
function resetAssuranceCircuit() {
    tracker.assuranceConsecutive = 0;
}
/**
 * Reset all trackers (for testing or after major recovery)
 */
function resetAllGuardrails() {
    tracker = resetTracker();
}
/**
 * Get current tracker state (for debugging)
 */
function getTrackerState() {
    return { ...tracker };
}
//# sourceMappingURL=guardrails.js.map