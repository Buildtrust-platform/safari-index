"use strict";
/**
 * Decision Assurance API Handler
 *
 * Per 02_decision_doctrine.md:
 * - Assurance is a paid artifact of professional judgment
 * - It never changes the underlying decision
 * - It refuses to generate for weak decisions
 *
 * Endpoints:
 * - POST /assurance/generate - Generate assurance from decision_id
 * - GET /assurance/{id} - Retrieve assurance artifact
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGenerateAssurance = handleGenerateAssurance;
exports.handleGetAssurance = handleGetAssurance;
const index_1 = require("./index");
const event_store_1 = require("../db/event-store");
// CORS headers
const CORS_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
};
/**
 * Handle POST /assurance/generate
 * Generates a new assurance artifact from an existing decision
 */
async function handleGenerateAssurance(event) {
    try {
        const body = JSON.parse(event.body || '{}');
        // Validate required fields
        if (!body.decision_id) {
            return {
                statusCode: 400,
                headers: CORS_HEADERS,
                body: JSON.stringify({
                    error: 'decision_id is required',
                }),
            };
        }
        if (!body.session_id) {
            return {
                statusCode: 400,
                headers: CORS_HEADERS,
                body: JSON.stringify({
                    error: 'session_id is required',
                }),
            };
        }
        // Check if assurance already exists for this decision
        const existingAssurance = await (0, index_1.getAssuranceByDecisionId)(body.decision_id);
        if (existingAssurance) {
            return {
                statusCode: 409,
                headers: CORS_HEADERS,
                body: JSON.stringify({
                    error: 'Assurance already exists for this decision',
                    error_code: 'ALREADY_ISSUED',
                    existing_assurance_id: existingAssurance.assurance_id,
                }),
            };
        }
        const request = {
            decision_id: body.decision_id,
            session_id: body.session_id,
            traveler_id: body.traveler_id || null,
        };
        // Log ASSURANCE_REQUESTED event
        await (0, event_store_1.logEvent)({
            event_type: 'ASSURANCE_REQUESTED',
            session_id: request.session_id,
            traveler_id: request.traveler_id,
            decision_id: request.decision_id,
            payload: { decision_id: request.decision_id },
        });
        // Generate assurance artifact
        const result = await (0, index_1.generateAssurance)(request);
        if (!result.success || !result.artifact) {
            return {
                statusCode: 422,
                headers: CORS_HEADERS,
                body: JSON.stringify({
                    error: result.error,
                    error_code: result.error_code,
                }),
            };
        }
        // Build and store the assurance record
        const record = (0, index_1.buildAssuranceRecord)(result.artifact, request.session_id, request.traveler_id);
        await (0, index_1.storeAssurance)(record);
        // Log ASSURANCE_ISSUED event
        await (0, event_store_1.logEvent)({
            event_type: 'ASSURANCE_ISSUED',
            session_id: request.session_id,
            traveler_id: request.traveler_id,
            decision_id: request.decision_id,
            payload: {
                assurance_id: result.assurance_id,
                payment_status: 'pending',
                amount_cents: index_1.ASSURANCE_PRICING.BASE_PRICE_CENTS,
            },
        });
        return {
            statusCode: 201,
            headers: {
                ...CORS_HEADERS,
                'X-Assurance-Id': result.assurance_id,
            },
            body: JSON.stringify({
                assurance_id: result.assurance_id,
                decision_id: request.decision_id,
                payment_required: true,
                payment: {
                    amount_cents: index_1.ASSURANCE_PRICING.BASE_PRICE_CENTS,
                    currency: index_1.ASSURANCE_PRICING.CURRENCY,
                    // Stripe payment intent would be created here
                    // For MVP, return stub payment URL
                    checkout_url: `/checkout/assurance/${result.assurance_id}`,
                },
                // Don't return full artifact until payment is complete
                preview: {
                    outcome: result.artifact.verdict.outcome,
                    confidence_label: result.artifact.verdict.confidence_label,
                },
            }),
        };
    }
    catch (error) {
        console.error('Generate assurance error:', error);
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({
                error: 'Failed to generate assurance',
                details: error instanceof Error ? error.message : 'Unknown error',
            }),
        };
    }
}
/**
 * Handle GET /assurance/{assurance_id}
 * Retrieves an assurance artifact (only if payment is complete)
 */
async function handleGetAssurance(event) {
    try {
        const assuranceId = event.pathParameters?.assurance_id;
        if (!assuranceId) {
            return {
                statusCode: 400,
                headers: CORS_HEADERS,
                body: JSON.stringify({
                    error: 'assurance_id is required',
                }),
            };
        }
        const record = await (0, index_1.getAssurance)(assuranceId);
        if (!record) {
            return {
                statusCode: 404,
                headers: CORS_HEADERS,
                body: JSON.stringify({
                    error: 'Assurance not found',
                }),
            };
        }
        // Check if payment is complete
        if (record.payment_status !== 'completed') {
            return {
                statusCode: 402,
                headers: CORS_HEADERS,
                body: JSON.stringify({
                    error: 'Payment required',
                    error_code: 'PAYMENT_REQUIRED',
                    assurance_id: record.assurance_id,
                    payment: {
                        status: record.payment_status,
                        amount_cents: record.payment_amount_cents,
                        currency: record.payment_currency,
                        checkout_url: `/checkout/assurance/${record.assurance_id}`,
                    },
                }),
            };
        }
        // Check if assurance is revoked
        if (record.status === 'revoked') {
            return {
                statusCode: 410,
                headers: CORS_HEADERS,
                body: JSON.stringify({
                    error: 'Assurance has been revoked',
                    reason: record.revocation_reason,
                }),
            };
        }
        // Record access for analytics
        await (0, index_1.recordAccess)(assuranceId);
        // Return full artifact
        return {
            statusCode: 200,
            headers: {
                ...CORS_HEADERS,
                'X-Assurance-Id': record.assurance_id,
                'X-Download-Count': String(record.download_count + 1),
            },
            body: JSON.stringify({
                assurance_id: record.assurance_id,
                decision_id: record.decision_id,
                status: record.status,
                artifact: record.artifact,
                access: {
                    download_count: record.download_count + 1,
                    first_accessed: record.download_count === 0,
                },
            }),
        };
    }
    catch (error) {
        console.error('Get assurance error:', error);
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({
                error: 'Failed to retrieve assurance',
                details: error instanceof Error ? error.message : 'Unknown error',
            }),
        };
    }
}
//# sourceMappingURL=assurance-handler.js.map