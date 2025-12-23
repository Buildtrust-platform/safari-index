'use client';

/**
 * Decision Assurance Checkout Page
 *
 * Per 02_decision_doctrine.md:
 * - Assurance is a one-time purchase
 * - No subscriptions, no bundles
 *
 * Per Task Requirements:
 * - Calm, no sales pressure
 * - Clear about what is being purchased
 *
 * MVP: Stub payment flow, will integrate Stripe later
 */

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { API_BASE } from '../../../lib/api-client';
const ASSURANCE_PRICE_CENTS = 2900;

interface AssuranceResponse {
  assurance_id: string;
  decision_id: string;
  payment_required: boolean;
  payment: {
    amount_cents: number;
    currency: string;
    checkout_url: string;
  };
  preview: {
    outcome: string;
    confidence_label: string;
  };
}

type PageState = 'loading' | 'preview' | 'processing' | 'success' | 'error';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const decisionId = searchParams.get('decision_id');

  const [state, setState] = useState<PageState>('loading');
  const [assurance, setAssurance] = useState<AssuranceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!decisionId) {
      setError('No decision ID provided');
      setState('error');
      return;
    }

    async function generateAssurance() {
      try {
        const response = await fetch(`${API_BASE}/assurance/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            decision_id: decisionId,
            session_id: `sess_checkout_${Date.now()}`,
            traveler_id: null,
          }),
        });

        if (response.status === 409) {
          // Assurance already exists
          const data = await response.json();
          setError(`Assurance already exists: ${data.existing_assurance_id}`);
          setState('error');
          return;
        }

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to generate assurance');
        }

        const data: AssuranceResponse = await response.json();
        setAssurance(data);
        setState('preview');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setState('error');
      }
    }

    generateAssurance();
  }, [decisionId]);

  // Stub payment handler - will integrate Stripe
  const handlePayment = async () => {
    setState('processing');

    // Simulate payment processing
    // In production, this would redirect to Stripe Checkout
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // For MVP, mark as successful
    setState('success');
  };

  if (state === 'loading') {
    return (
      <main className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-gray-50 border border-gray-200 p-6 rounded">
          <p className="text-gray-600">Preparing your assurance...</p>
        </div>
      </main>
    );
  }

  if (state === 'error') {
    return (
      <main className="max-w-xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold mb-4">Unable to proceed</h1>
        <div className="bg-red-50 border border-red-200 p-6 rounded">
          <p className="text-red-700">{error}</p>
        </div>
        <Link
          href="/decisions"
          className="inline-block mt-6 text-gray-600 hover:text-gray-900"
        >
          &larr; Back to decisions
        </Link>
      </main>
    );
  }

  if (state === 'success') {
    return (
      <main className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-green-50 border border-green-200 p-6 rounded mb-6">
          <h1 className="text-2xl font-semibold text-green-900 mb-2">
            Assurance purchased
          </h1>
          <p className="text-green-700">
            Your Decision Assurance is ready. You can access it anytime.
          </p>
        </div>

        <a
          href={`/assurance/${assurance?.assurance_id}`}
          className="inline-block bg-gray-900 text-white px-6 py-3 rounded text-center font-medium hover:bg-gray-800 transition-colors"
        >
          View your Decision Assurance
        </a>
      </main>
    );
  }

  // Preview state
  return (
    <main className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-2">Decision Assurance</h1>
      <p className="text-gray-600 mb-8">
        Keep a permanent record of this decision with full reasoning preserved.
      </p>

      {assurance && (
        <>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">Decision outcome</span>
              <span className="font-medium capitalize">{assurance.preview.outcome}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">Confidence</span>
              <span className="font-medium">{assurance.preview.confidence_label}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Decision ID</span>
              <span className="font-mono text-sm">{assurance.decision_id}</span>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="font-semibold mb-4">What you get</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">&#10003;</span>
                Full decision with reasoning preserved
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">&#10003;</span>
                All assumptions made explicit
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">&#10003;</span>
                Trade-offs documented
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">&#10003;</span>
                Conditions that would change this decision
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">&#10003;</span>
                Shareable link (no login required)
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">&#10003;</span>
                PDF download
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-between mb-6">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold">
              ${(ASSURANCE_PRICE_CENTS / 100).toFixed(0)}
            </span>
          </div>

          <button
            onClick={handlePayment}
            disabled={state === 'processing'}
            className="w-full bg-gray-900 text-white px-6 py-3 rounded text-center font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          >
            {state === 'processing' ? 'Processing...' : 'Purchase Assurance'}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            One-time purchase. No subscription. No hidden fees.
          </p>
        </>
      )}
    </main>
  );
}

export default function AssuranceCheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="max-w-xl mx-auto px-4 py-12">
          <div className="bg-gray-50 border border-gray-200 p-6 rounded">
            <p className="text-gray-600">Loading...</p>
          </div>
        </main>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
