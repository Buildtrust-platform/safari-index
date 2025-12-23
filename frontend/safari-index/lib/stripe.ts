/**
 * Stripe Server-Side Client
 *
 * Per governance:
 * - One-time payment only ($29)
 * - No subscriptions, no bundles
 * - Stripe handles PCI compliance
 *
 * This module runs SERVER-SIDE ONLY.
 * Do not import in client components.
 */

import Stripe from 'stripe';

/**
 * Lazily initialized Stripe client
 * Prevents build-time errors when STRIPE_SECRET_KEY is not set
 */
let _stripe: Stripe | null = null;

function getStripeClient(): Stripe {
  if (_stripe) {
    return _stripe;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      'STRIPE_SECRET_KEY environment variable is required. ' +
      'Set it in your environment or Amplify console.'
    );
  }

  _stripe = new Stripe(secretKey, {
    apiVersion: '2025-02-24.acacia',
    typescript: true,
  });

  return _stripe;
}

/**
 * Assurance pricing - matches backend/decision-orchestrator/src/assurance/types.ts
 */
export const ASSURANCE_PRICE = {
  amount: 2900, // cents
  currency: 'usd',
  productName: 'Decision Assurance',
  productDescription: 'Permanent record of safari decision with reasoning, assumptions, and conditions.',
} as const;

/**
 * Get site origin for redirect URLs
 */
export function getSiteOrigin(): string {
  // Use explicit env var if set (production)
  if (process.env.NEXT_PUBLIC_SITE_ORIGIN) {
    return process.env.NEXT_PUBLIC_SITE_ORIGIN;
  }
  // Vercel/Amplify deployment URL
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  // Default for local development
  return 'http://localhost:3000';
}

/**
 * Checkout session metadata structure
 * Used for webhook reconciliation
 */
export interface CheckoutMetadata {
  assurance_id: string;
  decision_id: string;
}

/**
 * Create a Stripe Checkout Session for assurance purchase
 *
 * @param assuranceId - The pre-generated assurance artifact ID
 * @param decisionId - The decision being assured
 * @returns Stripe Checkout Session with redirect URL
 */
export async function createAssuranceCheckoutSession(
  assuranceId: string,
  decisionId: string
): Promise<{ sessionId: string; url: string }> {
  const stripe = getStripeClient();
  const origin = getSiteOrigin();

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: ASSURANCE_PRICE.currency,
          unit_amount: ASSURANCE_PRICE.amount,
          product_data: {
            name: ASSURANCE_PRICE.productName,
            description: ASSURANCE_PRICE.productDescription,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      assurance_id: assuranceId,
      decision_id: decisionId,
    } satisfies CheckoutMetadata,
    success_url: `${origin}/assurance/${assuranceId}?payment=success`,
    cancel_url: `${origin}/assurance/checkout?decision_id=${decisionId}&cancelled=true`,
    // Allow guest checkout (no account required)
    customer_creation: 'if_required',
    // Collect email for receipt
    customer_email: undefined, // Let Stripe collect it
    billing_address_collection: 'auto',
  });

  if (!session.url) {
    throw new Error('Failed to create checkout session URL');
  }

  return {
    sessionId: session.id,
    url: session.url,
  };
}

/**
 * Verify Stripe webhook signature
 *
 * @param payload - Raw request body
 * @param signature - Stripe-Signature header
 * @returns Verified event or null if invalid
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event | null {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured');
    return null;
  }

  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return null;
  }
}
