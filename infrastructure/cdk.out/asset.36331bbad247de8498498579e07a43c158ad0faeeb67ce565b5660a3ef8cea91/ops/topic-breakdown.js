"use strict";
/**
 * Topic Breakdown Aggregation
 *
 * Provides per-topic health metrics by querying the events table GSI.
 * Uses event_type-created_at-index (type-created-index) for efficient queries.
 *
 * Safety limits:
 * - Hard limit of 5000 items per query
 * - Aborts breakdown if limit exceeded
 * - Never degrades base /ops/health
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.aggregateByTopic = aggregateByTopic;
exports.getTopRefusalReasons = getTopRefusalReasons;
exports.fetchTopicBreakdown = fetchTopicBreakdown;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
// Configuration
const EVENT_TABLE = process.env.EVENT_TABLE || 'safari-index-events';
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT;
// Safety limits
const MAX_ITEMS_PER_QUERY = 5000;
const WINDOW_DAYS = 7;
// Known topic IDs (from decision-topics.ts)
const KNOWN_TOPIC_IDS = [
    'tz-feb',
    'tz-jul',
    'tz-nov',
    'ke-aug',
    'bw-jun',
    'tz-vs-ke',
    'short-safari',
    'kids-safari',
    'budget-tz',
    'green-season',
];
// Initialize DynamoDB client
const ddbClient = new client_dynamodb_1.DynamoDBClient({
    region: AWS_REGION,
    ...(DYNAMODB_ENDPOINT && { endpoint: DYNAMODB_ENDPOINT }),
});
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(ddbClient);
/**
 * Query events by type within time window
 * Uses GSI: type-created-index (event_type + created_at)
 */
async function queryEventsByType(eventType, sinceIso) {
    const items = [];
    let lastEvaluatedKey;
    let exceeded = false;
    do {
        const result = await docClient.send(new lib_dynamodb_1.QueryCommand({
            TableName: EVENT_TABLE,
            IndexName: 'type-created-index',
            KeyConditionExpression: 'event_type = :et AND created_at >= :since',
            ExpressionAttributeValues: {
                ':et': eventType,
                ':since': sinceIso,
            },
            ProjectionExpression: 'event_id, created_at, payload, decision_id',
            Limit: MAX_ITEMS_PER_QUERY,
            ExclusiveStartKey: lastEvaluatedKey,
        }));
        if (result.Items) {
            items.push(...result.Items);
        }
        // Check safety limit
        if (items.length >= MAX_ITEMS_PER_QUERY) {
            exceeded = true;
            break;
        }
        lastEvaluatedKey = result.LastEvaluatedKey;
    } while (lastEvaluatedKey && items.length < MAX_ITEMS_PER_QUERY);
    return { items, exceeded };
}
/**
 * Extract topic_id from event payload or decision context
 * Events may include topic_id in payload or we derive from session pattern
 */
function extractTopicId(event) {
    // Check payload for topic_id
    if (event.payload?.topic_id && typeof event.payload.topic_id === 'string') {
        return event.payload.topic_id;
    }
    // Check session_id pattern: sess_page_<topic_id>
    if (event.session_id?.startsWith('sess_page_')) {
        return event.session_id.replace('sess_page_', '');
    }
    return null;
}
/**
 * Aggregate events into per-topic counters
 * Pure function for easy testing
 */
function aggregateByTopic(issuedEvents, refusedEvents, knownTopicIds) {
    // Initialize counters for all known topics
    const counterMap = new Map();
    for (const topicId of knownTopicIds) {
        counterMap.set(topicId, {
            topic_id: topicId,
            issued: 0,
            refused: 0,
            clarifications: 0,
            quality_gate_failed: 0,
            refusal_rate: null,
        });
    }
    // Count issued decisions
    for (const event of issuedEvents) {
        const topicId = extractTopicId(event);
        if (topicId && counterMap.has(topicId)) {
            counterMap.get(topicId).issued++;
        }
    }
    // Count refused decisions and extract reasons
    const refusalReasons = new Map();
    for (const event of refusedEvents) {
        const topicId = extractTopicId(event);
        if (topicId && counterMap.has(topicId)) {
            counterMap.get(topicId).refused++;
        }
        // Extract refusal reason
        const payload = event.payload;
        if (payload?.reason && typeof payload.reason === 'string') {
            const reason = payload.reason.substring(0, 100); // Truncate long reasons
            refusalReasons.set(reason, (refusalReasons.get(reason) || 0) + 1);
        }
    }
    // Calculate refusal rates
    for (const counter of counterMap.values()) {
        const total = counter.issued + counter.refused;
        if (total > 0) {
            counter.refusal_rate = counter.refused / total;
        }
    }
    return {
        counters: Array.from(counterMap.values()),
        refusalReasons,
    };
}
/**
 * Get top N refusal reasons sorted by count
 */
function getTopRefusalReasons(refusalReasons, topN = 5) {
    return Array.from(refusalReasons.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN)
        .map(([reason]) => reason);
}
/**
 * Fetch topic breakdown from events table
 * Returns null if safety limits exceeded
 */
async function fetchTopicBreakdown() {
    try {
        // Calculate 7-day window
        const since = new Date();
        since.setDate(since.getDate() - WINDOW_DAYS);
        const sinceIso = since.toISOString();
        // Query DECISION_ISSUED events
        const issuedResult = await queryEventsByType('DECISION_ISSUED', sinceIso);
        if (issuedResult.exceeded) {
            return {
                success: false,
                skipped: true,
                skip_reason: 'too_many_events',
            };
        }
        // Query DECISION_REFUSED events
        const refusedResult = await queryEventsByType('DECISION_REFUSED', sinceIso);
        if (refusedResult.exceeded) {
            return {
                success: false,
                skipped: true,
                skip_reason: 'too_many_events',
            };
        }
        // Aggregate by topic
        const { counters, refusalReasons } = aggregateByTopic(issuedResult.items, refusedResult.items, KNOWN_TOPIC_IDS);
        // Get top refusal reasons
        const topReasons = getTopRefusalReasons(refusalReasons, 5);
        return {
            success: true,
            topic_counters: counters,
            top_refusal_reasons: topReasons.length > 0 ? topReasons : undefined,
        };
    }
    catch (error) {
        console.error('Topic breakdown failed:', error);
        return {
            success: false,
            skipped: true,
            skip_reason: 'query_error',
        };
    }
}
//# sourceMappingURL=topic-breakdown.js.map