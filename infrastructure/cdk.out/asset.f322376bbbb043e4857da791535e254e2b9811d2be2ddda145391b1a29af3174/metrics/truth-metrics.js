"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopicMetrics = getTopicMetrics;
exports.getConfidenceHistory = getConfidenceHistory;
exports.detectConfidenceDrift = detectConfidenceDrift;
exports.getAllTopicsMetricsSummary = getAllTopicsMetricsSummary;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const DECISION_TABLE = process.env.DECISION_TABLE || 'safari-index-decisions';
const EVENT_TABLE = process.env.EVENT_TABLE || 'safari-index-events';
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT;
const ddbClient = new client_dynamodb_1.DynamoDBClient({
    region: AWS_REGION,
    ...(DYNAMODB_ENDPOINT && { endpoint: DYNAMODB_ENDPOINT }),
});
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(ddbClient);
/**
 * Get metrics for a specific topic
 * Per 04_metrics_truth.md: truth metrics only
 */
async function getTopicMetrics(topicId) {
    // Query decisions for this topic using inputs_snapshot.topic_id
    // For MVP, we scan and filter - can be optimized with GSI later
    const decisionsResult = await docClient.send(new lib_dynamodb_1.ScanCommand({
        TableName: DECISION_TABLE,
        FilterExpression: 'contains(session_id, :topic)',
        ExpressionAttributeValues: { ':topic': topicId },
        Limit: 1000,
    }));
    const decisions = decisionsResult.Items || [];
    const issued = decisions.filter((d) => d.state === 'ISSUED');
    const refused = decisions.filter((d) => d.state === 'REFUSED');
    const totalRequests = decisions.length;
    const decisionsIssued = issued.length;
    const refusals = refused.length;
    // Calculate outcome distribution
    const outcomeDistribution = {};
    for (const d of issued) {
        const outcome = d.verdict?.outcome || 'unknown';
        outcomeDistribution[outcome] = (outcomeDistribution[outcome] || 0) + 1;
    }
    // Calculate average confidence
    const confidences = issued
        .map((d) => d.confidence)
        .filter((c) => typeof c === 'number');
    const avgConfidence = confidences.length > 0
        ? confidences.reduce((a, b) => a + b, 0) / confidences.length
        : 0;
    return {
        topic_id: topicId,
        total_requests: totalRequests,
        decisions_issued: decisionsIssued,
        refusals,
        completion_rate: totalRequests > 0 ? decisionsIssued / totalRequests : 0,
        refusal_rate: totalRequests > 0 ? refusals / totalRequests : 0,
        avg_confidence: avgConfidence,
        outcome_distribution: outcomeDistribution,
    };
}
/**
 * Get confidence history for drift detection
 */
async function getConfidenceHistory(topicId, limit = 50) {
    const result = await docClient.send(new lib_dynamodb_1.ScanCommand({
        TableName: DECISION_TABLE,
        FilterExpression: 'contains(session_id, :topic) AND #state = :issued',
        ExpressionAttributeNames: { '#state': 'state' },
        ExpressionAttributeValues: {
            ':topic': topicId,
            ':issued': 'ISSUED',
        },
        Limit: limit,
    }));
    return (result.Items || [])
        .map((d) => ({
        confidence: d.confidence,
        created_at: d.created_at,
    }))
        .sort((a, b) => b.created_at.localeCompare(a.created_at));
}
/**
 * Detect confidence drift for a topic
 * Returns true if drift exceeds threshold
 */
async function detectConfidenceDrift(topicId, baselineConfidence, threshold = 0.15) {
    const history = await getConfidenceHistory(topicId, 20);
    if (history.length < 5) {
        return { drifted: false, currentAvg: baselineConfidence, drift: 0 };
    }
    const recentConfidences = history.slice(0, 10).map((h) => h.confidence);
    const currentAvg = recentConfidences.reduce((a, b) => a + b, 0) / recentConfidences.length;
    const drift = baselineConfidence - currentAvg;
    return {
        drifted: drift >= threshold,
        currentAvg,
        drift,
    };
}
/**
 * Get all topic metrics summary
 * For review interface
 */
async function getAllTopicsMetricsSummary() {
    // For MVP, aggregate from known topic IDs
    const topicIds = [
        'tz-feb', 'tz-jul', 'tz-nov', 'ke-aug', 'bw-jun',
        'tz-vs-ke', 'short-safari', 'kids-safari', 'budget-tz', 'green-season',
    ];
    const summaries = await Promise.all(topicIds.map(async (topicId) => {
        const metrics = await getTopicMetrics(topicId);
        return {
            topic_id: topicId,
            refusal_rate: metrics.refusal_rate,
            avg_confidence: metrics.avg_confidence,
            total: metrics.total_requests,
        };
    }));
    return summaries.filter((s) => s.total > 0);
}
//# sourceMappingURL=truth-metrics.js.map