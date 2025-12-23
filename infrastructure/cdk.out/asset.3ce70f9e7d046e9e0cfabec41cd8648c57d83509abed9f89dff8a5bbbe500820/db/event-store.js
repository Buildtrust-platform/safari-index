"use strict";
/**
 * Safari Index Event Store
 * Logs immutable events to DynamoDB
 *
 * Per 10_data_model.md Table 7: event_log
 * Per 11_mvp_build_plan.md: "If you don't log events now, you will never trust metrics later."
 *
 * Events are IMMUTABLE. Once written, they cannot be modified or deleted.
 * This enables:
 * - Audit trails
 * - Metrics calculation
 * - Decision review
 * - Trust verification
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logSessionStarted = logSessionStarted;
exports.logEngaged = logEngaged;
exports.logDecisionIssued = logDecisionIssued;
exports.logDecisionRefused = logDecisionRefused;
exports.logToolCompleted = logToolCompleted;
exports.getEventsByTraveler = getEventsByTraveler;
exports.getEventsByType = getEventsByType;
exports.getEventsBySession = getEventsBySession;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const crypto_1 = require("crypto");
// Configuration via environment variables
const EVENT_TABLE = process.env.EVENT_TABLE || 'safari-index-events';
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT; // For local testing
// Initialize DynamoDB client (supports local endpoint for testing)
const ddbClient = new client_dynamodb_1.DynamoDBClient({
    region: AWS_REGION,
    ...(DYNAMODB_ENDPOINT && { endpoint: DYNAMODB_ENDPOINT }),
});
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(ddbClient);
/**
 * Generate an event ID with prefix
 * Per 10_data_model.md: IDs use prefix "evt_..."
 */
function generateEventId() {
    return `evt_${(0, crypto_1.randomUUID)().replace(/-/g, '').substring(0, 12)}`;
}
/**
 * Remove null/undefined values from an object for DynamoDB
 * DynamoDB GSIs don't support null partition keys, so we omit them entirely
 */
function removeNullValues(obj) {
    const result = {};
    for (const key of Object.keys(obj)) {
        if (obj[key] !== null && obj[key] !== undefined) {
            result[key] = obj[key];
        }
    }
    return result;
}
/**
 * Write an event to the event log
 * Events are immutable - no updates allowed
 *
 * Per 10_data_model.md: "An immutable record of what happened"
 */
async function writeEvent(event) {
    // Remove null values to avoid DynamoDB GSI errors
    const item = removeNullValues(event);
    await docClient.send(new lib_dynamodb_1.PutCommand({
        TableName: EVENT_TABLE,
        Item: item,
        // Events are immutable - never overwrite
        ConditionExpression: 'attribute_not_exists(event_id)',
    }));
    return event.event_id;
}
/**
 * Log SESSION_STARTED event
 * Per 10_data_model.md and 11_mvp_build_plan.md Phase 1
 */
async function logSessionStarted(sessionId, travelerId, payload) {
    const event = {
        event_id: generateEventId(),
        created_at: new Date().toISOString(),
        event_type: 'SESSION_STARTED',
        traveler_id: travelerId,
        session_id: sessionId,
        lead_id: null,
        decision_id: null,
        itinerary_id: null,
        page_id: null,
        payload,
    };
    return writeEvent(event);
}
/**
 * Log ENGAGED event
 * Triggered when user shows meaningful engagement
 * Per 10_data_model.md: engagement tracking
 */
async function logEngaged(sessionId, travelerId, payload) {
    const event = {
        event_id: generateEventId(),
        created_at: new Date().toISOString(),
        event_type: 'ENGAGED',
        traveler_id: travelerId,
        session_id: sessionId,
        lead_id: null,
        decision_id: null,
        itinerary_id: null,
        page_id: null,
        payload,
    };
    return writeEvent(event);
}
/**
 * Log DECISION_ISSUED event
 * Per 11_mvp_build_plan.md: Required MVP event
 *
 * This event fires when a decision with outcome (book|wait|switch|discard)
 * is successfully issued and stored.
 */
async function logDecisionIssued(decisionRecord) {
    const payload = {
        outcome: decisionRecord.verdict.outcome,
        confidence: decisionRecord.confidence,
        logic_version: decisionRecord.logic_version,
        ai_used: decisionRecord.ai_used,
    };
    const event = {
        event_id: generateEventId(),
        created_at: new Date().toISOString(),
        event_type: 'DECISION_ISSUED',
        traveler_id: decisionRecord.traveler_id,
        session_id: decisionRecord.session_id,
        lead_id: decisionRecord.lead_id,
        decision_id: decisionRecord.decision_id,
        itinerary_id: null,
        page_id: null,
        payload,
    };
    return writeEvent(event);
}
/**
 * Log DECISION_REFUSED event
 * Per 11_mvp_build_plan.md: Required MVP event
 *
 * This event fires when the platform refuses to issue a decision.
 * Per 02_decision_doctrine.md: "Refusal is not failure. Refusal is responsibility."
 */
async function logDecisionRefused(decisionRecord) {
    const payload = {
        reason: decisionRecord.verdict.summary,
        missing_inputs_count: 0, // Could be extracted from refusal details if needed
        logic_version: decisionRecord.logic_version,
    };
    const event = {
        event_id: generateEventId(),
        created_at: new Date().toISOString(),
        event_type: 'DECISION_REFUSED',
        traveler_id: decisionRecord.traveler_id,
        session_id: decisionRecord.session_id,
        lead_id: decisionRecord.lead_id,
        decision_id: decisionRecord.decision_id,
        itinerary_id: null,
        page_id: null,
        payload,
    };
    return writeEvent(event);
}
/**
 * Log TOOL_COMPLETED event (optional per task description)
 * Tracks when a decision tool finishes execution
 */
async function logToolCompleted(sessionId, travelerId, toolName, durationMs) {
    const event = {
        event_id: generateEventId(),
        created_at: new Date().toISOString(),
        event_type: 'TOOL_COMPLETED',
        traveler_id: travelerId,
        session_id: sessionId,
        lead_id: null,
        decision_id: null,
        itinerary_id: null,
        page_id: null,
        payload: {
            tool_name: toolName,
            duration_ms: durationMs,
        },
    };
    return writeEvent(event);
}
/**
 * Query events by traveler
 * Uses GSI1: traveler_id + created_at
 */
async function getEventsByTraveler(travelerId, limit = 100) {
    const result = await docClient.send(new lib_dynamodb_1.QueryCommand({
        TableName: EVENT_TABLE,
        IndexName: 'traveler-created-index',
        KeyConditionExpression: 'traveler_id = :tid',
        ExpressionAttributeValues: {
            ':tid': travelerId,
        },
        ScanIndexForward: false,
        Limit: limit,
    }));
    return result.Items || [];
}
/**
 * Query events by type
 * Uses GSI2: event_type + created_at
 */
async function getEventsByType(eventType, limit = 100) {
    const result = await docClient.send(new lib_dynamodb_1.QueryCommand({
        TableName: EVENT_TABLE,
        IndexName: 'type-created-index',
        KeyConditionExpression: 'event_type = :et',
        ExpressionAttributeValues: {
            ':et': eventType,
        },
        ScanIndexForward: false,
        Limit: limit,
    }));
    return result.Items || [];
}
/**
 * Query events by session
 * Useful for reconstructing a user's journey
 */
async function getEventsBySession(sessionId, limit = 100) {
    const result = await docClient.send(new lib_dynamodb_1.QueryCommand({
        TableName: EVENT_TABLE,
        IndexName: 'session-created-index',
        KeyConditionExpression: 'session_id = :sid',
        ExpressionAttributeValues: {
            ':sid': sessionId,
        },
        ScanIndexForward: true, // Chronological order
        Limit: limit,
    }));
    return result.Items || [];
}
//# sourceMappingURL=event-store.js.map