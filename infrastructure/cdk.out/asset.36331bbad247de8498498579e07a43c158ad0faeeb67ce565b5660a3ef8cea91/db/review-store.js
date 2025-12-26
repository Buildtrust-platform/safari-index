"use strict";
/**
 * Review Queue Store
 *
 * Per 06_review_correction.md:
 * - Decisions can be flagged for human review
 * - Review reasons must be explicit
 *
 * Per 10_data_model.md Table 8: review_queue
 * - Tracks decisions needing human oversight
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReviewRecord = createReviewRecord;
exports.getPendingReviews = getPendingReviews;
exports.getReviewsByTopic = getReviewsByTopic;
exports.updateReviewStatus = updateReviewStatus;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const crypto_1 = require("crypto");
const REVIEW_TABLE = process.env.REVIEW_TABLE || 'safari-index-reviews';
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT;
const ddbClient = new client_dynamodb_1.DynamoDBClient({
    region: AWS_REGION,
    ...(DYNAMODB_ENDPOINT && { endpoint: DYNAMODB_ENDPOINT }),
});
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(ddbClient);
function generateReviewId() {
    return `rev_${(0, crypto_1.randomUUID)().replace(/-/g, '').substring(0, 12)}`;
}
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
 * Create a review record
 */
async function createReviewRecord(topicId, decisionId, reasonCode, reasonDetails, metadata = {}) {
    const record = {
        review_id: generateReviewId(),
        created_at: new Date().toISOString(),
        topic_id: topicId,
        decision_id: decisionId,
        reason_code: reasonCode,
        reason_details: reasonDetails,
        status: 'pending',
        reviewer_id: null,
        reviewed_at: null,
        resolution_notes: null,
        metadata,
    };
    await docClient.send(new lib_dynamodb_1.PutCommand({
        TableName: REVIEW_TABLE,
        Item: removeNullValues(record),
        ConditionExpression: 'attribute_not_exists(review_id)',
    }));
    return record.review_id;
}
/**
 * Get pending reviews
 */
async function getPendingReviews(limit = 50) {
    const result = await docClient.send(new lib_dynamodb_1.ScanCommand({
        TableName: REVIEW_TABLE,
        FilterExpression: '#status = :pending',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: { ':pending': 'pending' },
        Limit: limit,
    }));
    return result.Items || [];
}
/**
 * Get reviews by topic
 */
async function getReviewsByTopic(topicId, limit = 20) {
    const result = await docClient.send(new lib_dynamodb_1.QueryCommand({
        TableName: REVIEW_TABLE,
        IndexName: 'topic-created-index',
        KeyConditionExpression: 'topic_id = :tid',
        ExpressionAttributeValues: { ':tid': topicId },
        ScanIndexForward: false,
        Limit: limit,
    }));
    return result.Items || [];
}
/**
 * Update review status
 */
async function updateReviewStatus(reviewId, status, reviewerId, notes) {
    await docClient.send(new lib_dynamodb_1.UpdateCommand({
        TableName: REVIEW_TABLE,
        Key: { review_id: reviewId },
        UpdateExpression: 'SET #status = :status, reviewer_id = :reviewer, reviewed_at = :reviewed, resolution_notes = :notes',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: {
            ':status': status,
            ':reviewer': reviewerId,
            ':reviewed': new Date().toISOString(),
            ':notes': notes,
        },
    }));
}
//# sourceMappingURL=review-store.js.map