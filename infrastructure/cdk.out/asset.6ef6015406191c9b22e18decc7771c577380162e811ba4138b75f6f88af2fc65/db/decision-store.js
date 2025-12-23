"use strict";
/**
 * Safari Index Decision Store
 * Persists decisions to DynamoDB
 *
 * Per 10_data_model.md: "If decisions are not persisted, nothing else matters."
 * Per 11_mvp_build_plan.md Phase 1: "Decision schema + DB"
 *
 * Every decision (issued or refused) MUST be stored with:
 * - verdict, assumptions, trade-offs, change conditions
 * - logic_version and prompt_version for audit
 * - inputs_snapshot for reproducibility
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeDecision = storeDecision;
exports.getDecision = getDecision;
exports.getDecisionsByTraveler = getDecisionsByTraveler;
exports.getDecisionsNeedingReview = getDecisionsNeedingReview;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const crypto_1 = require("crypto");
// Configuration via environment variables
const DECISION_TABLE = process.env.DECISION_TABLE || 'safari-index-decisions';
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT; // For local testing
const LOGIC_VERSION = process.env.LOGIC_VERSION || 'rules_v1.0';
const PROMPT_VERSION = process.env.PROMPT_VERSION || 'prompt_v1.0';
const AI_MODEL = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-sonnet-20240229-v1:0';
// Initialize DynamoDB client (supports local endpoint for testing)
const ddbClient = new client_dynamodb_1.DynamoDBClient({
    region: AWS_REGION,
    ...(DYNAMODB_ENDPOINT && { endpoint: DYNAMODB_ENDPOINT }),
});
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(ddbClient);
/**
 * Generate a decision ID with prefix
 * Per 10_data_model.md: IDs use prefix "dec_..."
 */
function generateDecisionId() {
    return `dec_${(0, crypto_1.randomUUID)().replace(/-/g, '').substring(0, 12)}`;
}
/**
 * Determine decision type based on task and output
 * Maps AI output to stored decision_type
 */
function determineDecisionType(input, output) {
    if (output.type === 'refusal') {
        return 'refusal';
    }
    // Map task type to decision type
    // This is a simplified mapping; can be extended based on request.question analysis
    switch (input.task) {
        case 'DECISION':
            // Could be timing_verdict, fit_assessment, or comparison based on question
            if (input.request.question.toLowerCase().includes('when') ||
                input.request.question.toLowerCase().includes('timing') ||
                input.request.question.toLowerCase().includes('month')) {
                return 'timing_verdict';
            }
            if (input.request.destinations_considered.length > 1) {
                return 'comparison';
            }
            return 'fit_assessment';
        case 'REVISION':
            return 'fit_assessment'; // Revisions are re-assessments
        default:
            return 'fit_assessment';
    }
}
/**
 * Build a decision record from AI output
 * Ensures all required fields per 10_data_model.md are populated
 */
function buildDecisionRecord(input, output, sessionId, travelerId, leadId) {
    const now = new Date().toISOString();
    const decisionId = generateDecisionId();
    const decisionType = determineDecisionType(input, output);
    // Build AI trace
    const aiTrace = {
        model: AI_MODEL,
        prompt_version: PROMPT_VERSION,
        safety_flags: [],
    };
    // Build inputs snapshot for audit
    // Per 10_data_model.md: "inputs_snapshot (object of the user inputs used)"
    const inputsSnapshot = {
        task: input.task,
        user_context: input.user_context,
        request: {
            question: input.request.question,
            scope: input.request.scope,
            destinations_considered: input.request.destinations_considered,
        },
        // Do not store full constraints to limit record size
    };
    if (output.type === 'refusal') {
        const refusal = output;
        return {
            decision_id: decisionId,
            traveler_id: travelerId,
            session_id: sessionId,
            lead_id: leadId,
            created_at: now,
            updated_at: now,
            decision_type: 'refusal',
            state: 'REFUSED',
            verdict: {
                outcome: 'refused',
                headline: 'Decision refused',
                summary: refusal.refusal.reason,
            },
            // Refusals do not have assumptions/tradeoffs in the traditional sense
            // but we store empty arrays for schema consistency
            assumptions: [],
            tradeoffs: { gains: [], losses: [] },
            change_conditions: [],
            confidence: 0,
            inputs_snapshot: inputsSnapshot,
            logic_version: LOGIC_VERSION,
            ai_used: true,
            ai_trace: aiTrace,
            itinerary_id: null,
            content_page_id: null,
            review: {
                needs_review: false,
                review_reason: null,
                review_status: 'none',
            },
            supersedes_decision_id: null,
        };
    }
    // Handle decision output
    const decision = output;
    return {
        decision_id: decisionId,
        traveler_id: travelerId,
        session_id: sessionId,
        lead_id: leadId,
        created_at: now,
        updated_at: now,
        decision_type: decisionType,
        state: 'ISSUED',
        verdict: {
            outcome: decision.decision.outcome,
            headline: decision.decision.headline,
            summary: decision.decision.summary,
        },
        assumptions: decision.decision.assumptions,
        tradeoffs: decision.decision.tradeoffs,
        change_conditions: decision.decision.change_conditions,
        confidence: decision.decision.confidence,
        inputs_snapshot: inputsSnapshot,
        logic_version: LOGIC_VERSION,
        ai_used: true,
        ai_trace: aiTrace,
        itinerary_id: null,
        content_page_id: null,
        review: {
            needs_review: false,
            review_reason: null,
            review_status: 'none',
        },
        supersedes_decision_id: null,
    };
}
/**
 * Store a decision in DynamoDB
 * Returns the decision_id for reference
 *
 * Per 11_mvp_build_plan.md: "A real decision can be issued and stored."
 */
async function storeDecision(input, output, sessionId = null, travelerId = null, leadId = null) {
    const record = buildDecisionRecord(input, output, sessionId, travelerId, leadId);
    await docClient.send(new lib_dynamodb_1.PutCommand({
        TableName: DECISION_TABLE,
        Item: record,
        // Ensure we don't overwrite existing decisions (immutability principle)
        ConditionExpression: 'attribute_not_exists(decision_id)',
    }));
    return { decisionId: record.decision_id, record };
}
/**
 * Retrieve a decision by ID
 */
async function getDecision(decisionId) {
    const result = await docClient.send(new lib_dynamodb_1.GetCommand({
        TableName: DECISION_TABLE,
        Key: { decision_id: decisionId },
    }));
    return result.Item || null;
}
/**
 * Query decisions by traveler ID
 * Uses GSI1: traveler_id + created_at
 */
async function getDecisionsByTraveler(travelerId, limit = 20) {
    const result = await docClient.send(new lib_dynamodb_1.QueryCommand({
        TableName: DECISION_TABLE,
        IndexName: 'traveler-created-index',
        KeyConditionExpression: 'traveler_id = :tid',
        ExpressionAttributeValues: {
            ':tid': travelerId,
        },
        ScanIndexForward: false, // Most recent first
        Limit: limit,
    }));
    return result.Items || [];
}
/**
 * Query decisions needing review
 * Uses GSI3: review.needs_review + created_at
 */
async function getDecisionsNeedingReview(limit = 50) {
    const result = await docClient.send(new lib_dynamodb_1.QueryCommand({
        TableName: DECISION_TABLE,
        IndexName: 'review-created-index',
        KeyConditionExpression: 'review.needs_review = :nr',
        ExpressionAttributeValues: {
            ':nr': true,
        },
        ScanIndexForward: false,
        Limit: limit,
    }));
    return result.Items || [];
}
//# sourceMappingURL=decision-store.js.map