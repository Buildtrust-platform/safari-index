"use strict";
/**
 * Review Trigger Logic
 *
 * Per 06_review_correction.md:
 * - Automatically flag decisions for review when quality signals degrade
 *
 * Per 04_metrics_truth.md:
 * - Only track metrics that reflect decision quality
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRepeatedVisitTrigger = checkRepeatedVisitTrigger;
exports.checkOutcomeChangeTrigger = checkOutcomeChangeTrigger;
exports.checkRefusalRateTrigger = checkRefusalRateTrigger;
exports.checkConfidenceDriftTrigger = checkConfidenceDriftTrigger;
exports.logQualityGateFailure = logQualityGateFailure;
const review_store_1 = require("../db/review-store");
/**
 * Thresholds for triggering reviews
 * Per 06_review_correction.md: configurable but strict defaults
 */
const REVIEW_THRESHOLDS = {
    REPEATED_VISIT_COUNT: 3, // Same user, same topic
    REFUSAL_RATE_THRESHOLD: 0.3, // 30% refusals trigger review
    CONFIDENCE_DRIFT_THRESHOLD: 0.15, // 15% drop from baseline
    OUTCOME_CHANGE_WINDOW_HOURS: 24, // Same inputs, different outcome within window
};
/**
 * Check if repeated topic visit should trigger review
 */
async function checkRepeatedVisitTrigger(context, visitCount) {
    if (visitCount >= REVIEW_THRESHOLDS.REPEATED_VISIT_COUNT) {
        await (0, review_store_1.createReviewRecord)(context.topicId, context.decisionId, 'REPEATED_TOPIC_VISIT', `User visited topic ${visitCount} times, threshold is ${REVIEW_THRESHOLDS.REPEATED_VISIT_COUNT}`, {
            session_id: context.sessionId,
            traveler_id: context.travelerId,
            visit_count: visitCount,
        });
        return true;
    }
    return false;
}
/**
 * Check if outcome change should trigger review
 */
async function checkOutcomeChangeTrigger(context, previousOutcome, currentOutcome, hoursSincePrevious) {
    if (previousOutcome !== currentOutcome &&
        hoursSincePrevious <= REVIEW_THRESHOLDS.OUTCOME_CHANGE_WINDOW_HOURS) {
        await (0, review_store_1.createReviewRecord)(context.topicId, context.decisionId, 'OUTCOME_CHANGED', `Outcome changed from "${previousOutcome}" to "${currentOutcome}" within ${hoursSincePrevious}h`, {
            previous_outcome: previousOutcome,
            current_outcome: currentOutcome,
            hours_since_previous: hoursSincePrevious,
        });
        return true;
    }
    return false;
}
/**
 * Check if refusal rate should trigger review
 */
async function checkRefusalRateTrigger(topicId, refusalCount, totalCount) {
    if (totalCount < 10)
        return false; // Need minimum sample size
    const refusalRate = refusalCount / totalCount;
    if (refusalRate >= REVIEW_THRESHOLDS.REFUSAL_RATE_THRESHOLD) {
        await (0, review_store_1.createReviewRecord)(topicId, null, 'HIGH_REFUSAL_RATE', `Refusal rate ${(refusalRate * 100).toFixed(1)}% exceeds threshold ${REVIEW_THRESHOLDS.REFUSAL_RATE_THRESHOLD * 100}%`, {
            refusal_count: refusalCount,
            total_count: totalCount,
            refusal_rate: refusalRate,
        });
        return true;
    }
    return false;
}
/**
 * Check if confidence drift should trigger review
 */
async function checkConfidenceDriftTrigger(topicId, baselineConfidence, currentAvgConfidence) {
    const drift = baselineConfidence - currentAvgConfidence;
    if (drift >= REVIEW_THRESHOLDS.CONFIDENCE_DRIFT_THRESHOLD) {
        await (0, review_store_1.createReviewRecord)(topicId, null, 'CONFIDENCE_DRIFT', `Confidence dropped from ${(baselineConfidence * 100).toFixed(1)}% to ${(currentAvgConfidence * 100).toFixed(1)}%`, {
            baseline_confidence: baselineConfidence,
            current_avg_confidence: currentAvgConfidence,
            drift: drift,
        });
        return true;
    }
    return false;
}
/**
 * Log quality gate failure for review
 */
async function logQualityGateFailure(topicId, decisionId, failures) {
    return (0, review_store_1.createReviewRecord)(topicId, decisionId, 'QUALITY_GATE_FAILED', `Quality gates failed: ${failures.join('; ')}`, { failures });
}
//# sourceMappingURL=triggers.js.map