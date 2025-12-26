"use strict";
/**
 * Decision Assurance Store
 * Persists assurance records to DynamoDB
 *
 * Per 02_decision_doctrine.md:
 * - Assurance records are immutable once issued
 * - Payment completion triggers "issued" status
 *
 * Per 11_mvp_build_plan.md:
 * - Monetization artifact must be auditable
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeAssurance = storeAssurance;
exports.getAssurance = getAssurance;
exports.getAssuranceByDecisionId = getAssuranceByDecisionId;
exports.getAssurancesByTraveler = getAssurancesByTraveler;
exports.updatePaymentStatus = updatePaymentStatus;
exports.recordAccess = recordAccess;
exports.revokeAssurance = revokeAssurance;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
// Configuration via environment variables
const ASSURANCE_TABLE = process.env.ASSURANCE_TABLE || 'safari-index-assurances';
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT;
// Initialize DynamoDB client
const ddbClient = new client_dynamodb_1.DynamoDBClient({
    region: AWS_REGION,
    ...(DYNAMODB_ENDPOINT && { endpoint: DYNAMODB_ENDPOINT }),
});
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(ddbClient);
/**
 * Remove null/undefined values from an object for DynamoDB
 * DynamoDB GSIs don't support null partition keys
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
 * Store a new assurance record
 * Per governance: immutable once stored
 */
async function storeAssurance(record) {
    const item = removeNullValues(record);
    await docClient.send(new lib_dynamodb_1.PutCommand({
        TableName: ASSURANCE_TABLE,
        Item: item,
        // Prevent overwriting existing assurance records
        ConditionExpression: 'attribute_not_exists(assurance_id)',
    }));
    return { assuranceId: record.assurance_id };
}
/**
 * Get assurance by ID
 */
async function getAssurance(assuranceId) {
    const result = await docClient.send(new lib_dynamodb_1.GetCommand({
        TableName: ASSURANCE_TABLE,
        Key: { assurance_id: assuranceId },
    }));
    return result.Item || null;
}
/**
 * Get assurance by decision ID
 * Uses GSI: decision_id index
 */
async function getAssuranceByDecisionId(decisionId) {
    const result = await docClient.send(new lib_dynamodb_1.QueryCommand({
        TableName: ASSURANCE_TABLE,
        IndexName: 'decision-index',
        KeyConditionExpression: 'decision_id = :did',
        ExpressionAttributeValues: {
            ':did': decisionId,
        },
        Limit: 1,
    }));
    return result.Items?.[0] || null;
}
/**
 * Get assurances by traveler ID
 * Uses GSI: traveler_id + created_at
 */
async function getAssurancesByTraveler(travelerId, limit = 20) {
    const result = await docClient.send(new lib_dynamodb_1.QueryCommand({
        TableName: ASSURANCE_TABLE,
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
 * Update payment status after successful payment
 * Per governance: this is the only update allowed after creation
 */
async function updatePaymentStatus(assuranceId, paymentId, status) {
    const now = new Date().toISOString();
    await docClient.send(new lib_dynamodb_1.UpdateCommand({
        TableName: ASSURANCE_TABLE,
        Key: { assurance_id: assuranceId },
        UpdateExpression: 'SET payment_status = :status, payment_id = :pid, updated_at = :now, #s = :issued',
        ExpressionAttributeNames: {
            '#s': 'status',
        },
        ExpressionAttributeValues: {
            ':status': status,
            ':pid': paymentId,
            ':now': now,
            ':issued': status === 'completed' ? 'issued' : 'revoked',
            ':pending': 'pending',
        },
        // Only update if payment is still pending
        ConditionExpression: 'payment_status = :pending',
    }));
}
/**
 * Record artifact access (download)
 * For audit and usage tracking
 */
async function recordAccess(assuranceId) {
    const now = new Date().toISOString();
    await docClient.send(new lib_dynamodb_1.UpdateCommand({
        TableName: ASSURANCE_TABLE,
        Key: { assurance_id: assuranceId },
        UpdateExpression: 'SET download_count = download_count + :inc, last_accessed_at = :now',
        ExpressionAttributeValues: {
            ':inc': 1,
            ':now': now,
        },
    }));
}
/**
 * Revoke an assurance (for refunds or policy violations)
 * Per governance: revocation reason must be documented
 */
async function revokeAssurance(assuranceId, reason) {
    const now = new Date().toISOString();
    await docClient.send(new lib_dynamodb_1.UpdateCommand({
        TableName: ASSURANCE_TABLE,
        Key: { assurance_id: assuranceId },
        UpdateExpression: 'SET #s = :revoked, revocation_reason = :reason, updated_at = :now',
        ExpressionAttributeNames: {
            '#s': 'status',
        },
        ExpressionAttributeValues: {
            ':revoked': 'revoked',
            ':reason': reason,
            ':now': now,
        },
    }));
}
//# sourceMappingURL=assurance-store.js.map