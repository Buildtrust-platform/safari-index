"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordDecisionIssued = recordDecisionIssued;
exports.recordDecisionRefused = recordDecisionRefused;
exports.recordDecisionFailed = recordDecisionFailed;
exports.recordAssuranceIssued = recordAssuranceIssued;
exports.recordAssuranceFailed = recordAssuranceFailed;
exports.recordEmbedRendered = recordEmbedRendered;
exports.recordEmbedError = recordEmbedError;
exports.recordBedrockCall = recordBedrockCall;
exports.recordReviewCreated = recordReviewCreated;
exports.recordReviewResolved = recordReviewResolved;
exports.computeHealthSignals = computeHealthSignals;
exports.getHealthSnapshot = getHealthSnapshot;
exports.getCounters = getCounters;
// Time window for rate calculations (1 hour in ms)
const WINDOW_MS = 60 * 60 * 1000;
// Global counters (would be CloudWatch/DynamoDB in production)
let counters = resetCounters();
function resetCounters() {
    return {
        decisionsIssued: 0,
        decisionsRefused: 0,
        decisionsFailed: 0,
        assurancesIssued: 0,
        assurancesFailed: 0,
        embedsRendered: 0,
        embedErrors: 0,
        bedrockFailures: 0,
        bedrockCalls: 0,
        reviewsCreated: 0,
        reviewsResolved: 0,
        windowStartTime: Date.now(),
    };
}
/**
 * Check if window has expired and reset if needed
 */
function checkWindow() {
    if (Date.now() - counters.windowStartTime > WINDOW_MS) {
        counters = resetCounters();
    }
}
/**
 * Increment counters (called from various parts of the system)
 */
function recordDecisionIssued() {
    checkWindow();
    counters.decisionsIssued++;
}
function recordDecisionRefused() {
    checkWindow();
    counters.decisionsRefused++;
}
function recordDecisionFailed() {
    checkWindow();
    counters.decisionsFailed++;
}
function recordAssuranceIssued() {
    checkWindow();
    counters.assurancesIssued++;
}
function recordAssuranceFailed() {
    checkWindow();
    counters.assurancesFailed++;
}
function recordEmbedRendered() {
    checkWindow();
    counters.embedsRendered++;
}
function recordEmbedError() {
    checkWindow();
    counters.embedErrors++;
}
function recordBedrockCall(success) {
    checkWindow();
    counters.bedrockCalls++;
    if (!success) {
        counters.bedrockFailures++;
    }
}
function recordReviewCreated() {
    checkWindow();
    counters.reviewsCreated++;
}
function recordReviewResolved() {
    checkWindow();
    counters.reviewsResolved++;
}
/**
 * Compute health signals from current counters
 */
function computeHealthSignals() {
    checkWindow();
    const signals = [];
    // 1. Decision Failure Rate
    // Threshold: >5% failures is warning, >15% is critical
    const totalDecisions = counters.decisionsIssued + counters.decisionsRefused + counters.decisionsFailed;
    const failureRate = totalDecisions > 0 ? counters.decisionsFailed / totalDecisions : 0;
    signals.push({
        name: 'decision_failure_rate',
        value: failureRate,
        threshold: 0.05,
        status: failureRate > 0.15 ? 'critical' : failureRate > 0.05 ? 'warning' : 'healthy',
        description: 'Rate of decision requests that failed completely',
    });
    // 2. Refusal Rate
    // Threshold: >40% refusals is warning (may indicate bad inputs or overly strict logic)
    const refusalRate = totalDecisions > 0
        ? counters.decisionsRefused / totalDecisions
        : 0;
    signals.push({
        name: 'refusal_rate',
        value: refusalRate,
        threshold: 0.4,
        status: refusalRate > 0.6 ? 'critical' : refusalRate > 0.4 ? 'warning' : 'healthy',
        description: 'Rate of decisions that resulted in refusal',
    });
    // 3. Bedrock Failure Rate
    // Threshold: >10% is warning, >30% is critical
    const bedrockFailureRate = counters.bedrockCalls > 0
        ? counters.bedrockFailures / counters.bedrockCalls
        : 0;
    signals.push({
        name: 'bedrock_failure_rate',
        value: bedrockFailureRate,
        threshold: 0.1,
        status: bedrockFailureRate > 0.3
            ? 'critical'
            : bedrockFailureRate > 0.1
                ? 'warning'
                : 'healthy',
        description: 'Rate of Bedrock AI calls that failed',
    });
    // 4. Assurance Success Rate
    // Threshold: <80% success is warning
    const totalAssurances = counters.assurancesIssued + counters.assurancesFailed;
    const assuranceSuccessRate = totalAssurances > 0 ? counters.assurancesIssued / totalAssurances : 1;
    signals.push({
        name: 'assurance_success_rate',
        value: assuranceSuccessRate,
        threshold: 0.8,
        status: assuranceSuccessRate < 0.6
            ? 'critical'
            : assuranceSuccessRate < 0.8
                ? 'warning'
                : 'healthy',
        description: 'Rate of assurance generation requests that succeeded',
    });
    // 5. Embed Error Rate
    // Threshold: >5% errors is warning
    const totalEmbeds = counters.embedsRendered + counters.embedErrors;
    const embedErrorRate = totalEmbeds > 0 ? counters.embedErrors / totalEmbeds : 0;
    signals.push({
        name: 'embed_error_rate',
        value: embedErrorRate,
        threshold: 0.05,
        status: embedErrorRate > 0.15
            ? 'critical'
            : embedErrorRate > 0.05
                ? 'warning'
                : 'healthy',
        description: 'Rate of embed renders that failed',
    });
    // 6. Review Queue Growth
    // Threshold: >10 unresolved reviews per hour is warning
    const reviewQueueGrowth = counters.reviewsCreated - counters.reviewsResolved;
    signals.push({
        name: 'review_queue_growth',
        value: reviewQueueGrowth,
        threshold: 10,
        status: reviewQueueGrowth > 25
            ? 'critical'
            : reviewQueueGrowth > 10
                ? 'warning'
                : 'healthy',
        description: 'Net growth of review queue in current window',
    });
    // 7. Total Volume (for context, not alerting)
    signals.push({
        name: 'total_decisions',
        value: totalDecisions,
        threshold: 0, // No threshold - informational only
        status: 'healthy',
        description: 'Total decision requests in current window',
    });
    return signals;
}
/**
 * Compute overall health snapshot
 */
function getHealthSnapshot() {
    const signals = computeHealthSignals();
    const criticalCount = signals.filter((s) => s.status === 'critical').length;
    const warningCount = signals.filter((s) => s.status === 'warning').length;
    let overall;
    let summary;
    let actionRequired;
    if (criticalCount > 0) {
        overall = 'critical';
        summary = `${criticalCount} critical signal(s) detected. Immediate attention required.`;
        actionRequired = true;
    }
    else if (warningCount > 0) {
        overall = 'degraded';
        summary = `${warningCount} warning signal(s) detected. Monitor closely.`;
        actionRequired = warningCount >= 3; // Only act if multiple warnings
    }
    else {
        overall = 'healthy';
        summary = 'All signals within normal parameters.';
        actionRequired = false;
    }
    return {
        timestamp: new Date().toISOString(),
        signals,
        overall,
        actionRequired,
        summary,
    };
}
/**
 * Get current counters (for debugging/testing)
 */
function getCounters() {
    checkWindow();
    return { ...counters };
}
//# sourceMappingURL=health-signals.js.map