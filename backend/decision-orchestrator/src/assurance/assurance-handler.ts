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
 * - POST /assurance/{id}/payment - Update payment status (webhook callback)
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {
  generateAssurance,
  buildAssuranceRecord,
  storeAssurance,
  getAssurance,
  getAssuranceByDecisionId,
  recordAccess,
  updatePaymentStatus,
  AssuranceRequest,
  ASSURANCE_PRICING,
} from './index';
import { logEvent } from '../db/event-store';

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
export async function handleGenerateAssurance(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
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
    const existingAssurance = await getAssuranceByDecisionId(body.decision_id);
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

    const request: AssuranceRequest = {
      decision_id: body.decision_id,
      session_id: body.session_id,
      traveler_id: body.traveler_id || null,
    };

    // Log ASSURANCE_REQUESTED event
    await logEvent({
      event_type: 'ASSURANCE_REQUESTED',
      session_id: request.session_id,
      traveler_id: request.traveler_id,
      decision_id: request.decision_id,
      payload: { decision_id: request.decision_id },
    });

    // Generate assurance artifact
    const result = await generateAssurance(request);

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
    const record = buildAssuranceRecord(
      result.artifact,
      request.session_id,
      request.traveler_id
    );
    await storeAssurance(record);

    // Log ASSURANCE_ISSUED event
    await logEvent({
      event_type: 'ASSURANCE_ISSUED',
      session_id: request.session_id,
      traveler_id: request.traveler_id,
      decision_id: request.decision_id,
      payload: {
        assurance_id: result.assurance_id,
        payment_status: 'pending',
        amount_cents: ASSURANCE_PRICING.BASE_PRICE_CENTS,
      },
    });

    return {
      statusCode: 201,
      headers: {
        ...CORS_HEADERS,
        'X-Assurance-Id': result.assurance_id!,
      },
      body: JSON.stringify({
        assurance_id: result.assurance_id,
        decision_id: request.decision_id,
        payment_required: true,
        payment: {
          amount_cents: ASSURANCE_PRICING.BASE_PRICE_CENTS,
          currency: ASSURANCE_PRICING.CURRENCY,
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
  } catch (error) {
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
export async function handleGetAssurance(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
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

    const record = await getAssurance(assuranceId);

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
    await recordAccess(assuranceId);

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
  } catch (error) {
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

/**
 * Handle POST /assurance/{assurance_id}/payment
 * Updates payment status after successful Stripe payment
 *
 * Per governance:
 * - Idempotent: safe to call multiple times
 * - Only transitions from 'pending' to 'completed'
 * - Logs payment event for audit trail
 */
export async function handleUpdatePayment(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
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

    const body = JSON.parse(event.body || '{}');

    if (!body.payment_id) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: 'payment_id is required',
        }),
      };
    }

    if (body.payment_status !== 'completed' && body.payment_status !== 'refunded') {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: 'payment_status must be "completed" or "refunded"',
        }),
      };
    }

    // Verify assurance exists
    const record = await getAssurance(assuranceId);

    if (!record) {
      return {
        statusCode: 404,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: 'Assurance not found',
        }),
      };
    }

    // Check if already processed (idempotent)
    if (record.payment_status === 'completed') {
      return {
        statusCode: 409,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          message: 'Payment already processed',
          assurance_id: assuranceId,
          payment_status: record.payment_status,
        }),
      };
    }

    // Update payment status
    await updatePaymentStatus(assuranceId, body.payment_id, body.payment_status);

    // Log payment event
    await logEvent({
      event_type: body.payment_status === 'completed' ? 'ASSURANCE_PAID' : 'ASSURANCE_REFUNDED',
      session_id: record.session_id,
      traveler_id: record.traveler_id,
      decision_id: record.decision_id,
      payload: {
        assurance_id: assuranceId,
        payment_id: body.payment_id,
        stripe_session_id: body.stripe_session_id,
        amount_cents: record.payment_amount_cents,
      },
    });

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: true,
        assurance_id: assuranceId,
        payment_status: body.payment_status,
      }),
    };
  } catch (error) {
    // Handle DynamoDB conditional check failure (already updated)
    if (error instanceof Error && error.name === 'ConditionalCheckFailedException') {
      return {
        statusCode: 409,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          message: 'Payment already processed (concurrent update)',
        }),
      };
    }

    console.error('Update payment error:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: 'Failed to update payment status',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
}
