/**
 * Stripe Webhook Handler
 *
 * POST /api/stripe/webhook
 *
 * Per governance:
 * - Handles checkout.session.completed events
 * - Updates assurance payment_status to 'completed'
 * - Idempotent: duplicate webhooks are safe
 * - No PII storage
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature, type CheckoutMetadata } from '../../../../lib/stripe';
import { API_BASE } from '../../../../lib/api-client';
import type Stripe from 'stripe';

/**
 * POST /api/stripe/webhook
 *
 * Receives Stripe webhook events.
 * Only processes checkout.session.completed for assurance payments.
 */
export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('Webhook: Missing stripe-signature header');
    return NextResponse.json(
      { error: 'Missing signature' },
      { status: 400 }
    );
  }

  // Get raw body for signature verification
  const rawBody = await request.text();

  // Verify webhook signature
  const event = verifyWebhookSignature(rawBody, signature);

  if (!event) {
    console.error('Webhook: Invalid signature');
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 401 }
    );
  }

  // Log webhook receipt (no PII)
  console.log(`Webhook received: ${event.type} [${event.id}]`);

  // Only handle checkout.session.completed
  if (event.type !== 'checkout.session.completed') {
    // Acknowledge but don't process other event types
    return NextResponse.json({ received: true, processed: false });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Extract metadata
  const metadata = session.metadata as CheckoutMetadata | null;

  if (!metadata?.assurance_id || !metadata?.decision_id) {
    console.error('Webhook: Missing metadata in checkout session', {
      sessionId: session.id,
      hasAssuranceId: !!metadata?.assurance_id,
      hasDecisionId: !!metadata?.decision_id,
    });
    // Return 200 to prevent retries - this is a data issue, not transient
    return NextResponse.json({
      received: true,
      processed: false,
      error: 'Missing metadata',
    });
  }

  const { assurance_id, decision_id } = metadata;
  const paymentIntentId = typeof session.payment_intent === 'string'
    ? session.payment_intent
    : session.payment_intent?.id || session.id;

  console.log(`Webhook: Processing payment for assurance ${assurance_id}`, {
    decisionId: decision_id,
    paymentIntent: paymentIntentId,
    amount: session.amount_total,
  });

  try {
    // Update assurance payment status via backend API
    // This calls the updatePaymentStatus function which is idempotent
    const updateResponse = await fetch(`${API_BASE}/assurance/${assurance_id}/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment_id: paymentIntentId,
        payment_status: 'completed',
        stripe_session_id: session.id,
      }),
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json().catch(() => ({}));

      // 409 Conflict means already processed - this is OK (idempotent)
      if (updateResponse.status === 409) {
        console.log(`Webhook: Assurance ${assurance_id} already marked as paid (idempotent)`);
        return NextResponse.json({
          received: true,
          processed: true,
          note: 'Already processed',
        });
      }

      console.error(`Webhook: Failed to update payment status`, {
        assuranceId: assurance_id,
        status: updateResponse.status,
        error: errorData,
      });

      // Return 500 to trigger Stripe retry for transient failures
      return NextResponse.json(
        { error: 'Failed to update payment status' },
        { status: 500 }
      );
    }

    console.log(`Webhook: Successfully processed payment for assurance ${assurance_id}`);

    return NextResponse.json({
      received: true,
      processed: true,
      assurance_id,
    });
  } catch (error) {
    console.error('Webhook: Error processing payment', {
      assuranceId: assurance_id,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    // Return 500 to trigger Stripe retry
    return NextResponse.json(
      { error: 'Internal error processing webhook' },
      { status: 500 }
    );
  }
}

// Ensure this route is always dynamic and doesn't cache
export const dynamic = 'force-dynamic';

// Disable body parsing - we need raw body for signature verification
export const runtime = 'nodejs';
