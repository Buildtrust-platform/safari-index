/**
 * Stripe Checkout Session Creation
 *
 * POST /api/stripe/checkout
 *
 * Per governance:
 * - Creates Stripe Checkout Session for assurance purchase
 * - Validates assurance eligibility before creating session
 * - Does NOT mark anything as paid (webhook handles that)
 * - One-time payment only, no subscriptions
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAssuranceCheckoutSession } from '../../../../lib/stripe';
import { API_BASE } from '../../../../lib/api-client';

/**
 * Request body for checkout session creation
 */
interface CheckoutRequest {
  assurance_id: string;
  decision_id: string;
}

/**
 * Assurance preview from backend (subset of full response)
 */
interface AssurancePreview {
  assurance_id: string;
  decision_id: string;
  payment_required: boolean;
  preview: {
    outcome: string;
    confidence_label: string;
  };
}

/**
 * POST /api/stripe/checkout
 *
 * Creates a Stripe Checkout Session for assurance purchase.
 * Requires assurance to already exist (from /assurance/generate).
 */
export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();

    // Validate required fields
    if (!body.assurance_id || !body.decision_id) {
      return NextResponse.json(
        { error: 'assurance_id and decision_id are required' },
        { status: 400 }
      );
    }

    // Verify assurance exists and is eligible for payment
    // This prevents creating checkout sessions for non-existent or already-paid assurances
    const verifyResponse = await fetch(`${API_BASE}/assurance/${body.assurance_id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    // 402 means payment required - this is the expected state for new checkout
    // 200 means already paid - should not create new session
    // 404 means assurance doesn't exist
    // 410 means revoked

    if (verifyResponse.status === 200) {
      // Already paid - redirect to assurance page
      return NextResponse.json(
        {
          error: 'Assurance already paid',
          redirect_url: `/assurance/${body.assurance_id}`,
        },
        { status: 409 }
      );
    }

    if (verifyResponse.status === 404) {
      return NextResponse.json(
        { error: 'Assurance not found. Please generate assurance first.' },
        { status: 404 }
      );
    }

    if (verifyResponse.status === 410) {
      return NextResponse.json(
        { error: 'Assurance has been revoked and cannot be purchased.' },
        { status: 410 }
      );
    }

    if (verifyResponse.status !== 402) {
      // Unexpected status
      const errorData = await verifyResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || 'Failed to verify assurance status' },
        { status: 500 }
      );
    }

    // 402 Payment Required - proceed with checkout session creation
    const { sessionId, url } = await createAssuranceCheckoutSession(
      body.assurance_id,
      body.decision_id
    );

    return NextResponse.json({
      checkout_session_id: sessionId,
      checkout_url: url,
    });
  } catch (error) {
    console.error('Checkout session creation error:', error);

    // Handle Stripe-specific errors
    if (error instanceof Error && error.message.includes('Stripe')) {
      return NextResponse.json(
        { error: 'Payment service temporarily unavailable' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

// Ensure this route is always dynamic (no caching)
export const dynamic = 'force-dynamic';
