'use client';

/**
 * Decision Assurance View Page
 *
 * Per 02_decision_doctrine.md:
 * - Assurance artifact contains immutable copy of decision
 * - Shows verdict, assumptions, trade-offs, change conditions
 *
 * Per Task Requirements:
 * - Accessible via shareable link (no login required)
 * - PDF download option
 * - Payment status banner for pending/draft states (webhook delay handling)
 * - Professional "Issued Record" block for completed assurances
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { VerdictCard } from '../../components/VerdictCard';
import { TradeoffLedger } from '../../components/TradeoffLedger';
import { AssumptionsBlock } from '../../components/AssumptionsBlock';
import { ChangeConditions } from '../../components/ChangeConditions';
import { EmbedCodeGenerator } from '../../components/EmbedCodeGenerator';
import { API_BASE } from '../../../lib/api-client';
import { Inset } from '../../components/ui/Surface';
import { Text, Caption } from '../../components/ui/Text';
import { Divider } from '../../components/ui/Divider';

interface AssuranceArtifact {
  assurance_id: string;
  decision_id: string;
  topic_id: string;
  verdict: {
    outcome: 'book' | 'wait' | 'switch' | 'discard';
    headline: string;
    summary: string;
    confidence: number;
    confidence_label: 'High' | 'Medium' | 'Low';
  };
  assumptions: Array<{ id: string; text: string; confidence: number }>;
  tradeoffs: { gains: string[]; losses: string[] };
  change_conditions: string[];
  invalidation_checklist: string[];
  created_at: string;
  logic_version: string;
  review_status: string;
}

interface AssuranceResponse {
  assurance_id: string;
  decision_id: string;
  status: string;
  /** Payment status: 'pending', 'draft', 'completed', 'issued' */
  payment_status?: string;
  /** Stripe payment intent ID for support lookup */
  payment_id?: string;
  /** Stripe checkout session ID */
  stripe_session_id?: string;
  /** When the assurance was issued (payment completed) */
  issued_at?: string;
  artifact: AssuranceArtifact;
  access: {
    download_count: number;
    first_accessed: boolean;
  };
}

/**
 * Mask a payment reference to show only last 6-8 characters
 * e.g., "pi_1234567890abcdef" -> "...0abcdef"
 */
function maskPaymentReference(ref: string | undefined): string {
  if (!ref) return 'Not available';
  const suffix = ref.slice(-8);
  return `...${suffix}`;
}

type PageState = 'loading' | 'success' | 'payment_pending' | 'payment_required' | 'error';

/**
 * Payment Status Banner
 *
 * Shows when payment_status is 'pending' or 'draft' - indicates webhook delay.
 * Provides calm messaging, "What happens next" list, and refresh button.
 */
function PaymentStatusBanner({
  paymentStatus,
  onRefresh,
  isRefreshing,
}: {
  paymentStatus: string;
  onRefresh: () => void;
  isRefreshing: boolean;
}) {
  // Only show for pending/draft states
  if (paymentStatus === 'completed' || paymentStatus === 'issued') {
    return null;
  }

  return (
    <div
      className="bg-amber-50 border border-amber-200 rounded-lg p-5 mb-6"
      role="status"
      aria-live="polite"
      data-testid="payment-status-banner"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-amber-800 font-medium mb-1">
            Payment processing
          </p>
          <p className="text-amber-700 text-sm">
            Your payment is being confirmed. This usually takes a few seconds.
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex-shrink-0 px-4 py-2 text-sm font-medium text-amber-800 bg-amber-100 border border-amber-300 rounded hover:bg-amber-200 disabled:opacity-50 transition-colors"
          data-testid="refresh-status-button"
        >
          {isRefreshing ? 'Checking...' : 'Refresh status'}
        </button>
      </div>

      {/* What happens next */}
      <div className="border-t border-amber-200 pt-3" data-testid="what-happens-next">
        <p className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-2">
          What happens next
        </p>
        <ul className="space-y-1.5 text-sm text-amber-700">
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">1.</span>
            <span>Payment confirmation is sent from Stripe to our system</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">2.</span>
            <span>Your assurance record is marked as issued</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">3.</span>
            <span>Click "Refresh status" or reload this page to view your record</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Issued Record Block
 *
 * Professional archival block shown only when payment is completed/issued.
 * Displays key metadata in a clean key-value format.
 */
function IssuedRecordBlock({
  assurance,
}: {
  assurance: AssuranceResponse;
}) {
  const { artifact, payment_id, stripe_session_id, issued_at } = assurance;

  // Only show for completed/issued states
  if (assurance.payment_status !== 'completed' && assurance.payment_status !== 'issued') {
    return null;
  }

  // Format the issued date/time
  const issuedDate = issued_at || artifact.created_at;
  const formattedDate = new Date(issuedDate).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  // Use payment_id or stripe_session_id for reference, masked
  const paymentRef = payment_id || stripe_session_id;

  return (
    <Inset
      padding="default"
      className="mb-8"
      data-testid="issued-record-block"
      as="section"
      aria-labelledby="issued-record-heading"
    >
      <Text variant="h3" as="h2" id="issued-record-heading" className="mb-4">
        Assurance issued
      </Text>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between items-baseline gap-4">
          <dt className="text-neutral-500">Issued</dt>
          <dd className="text-neutral-700 text-right" data-testid="issued-date">
            {formattedDate}
          </dd>
        </div>
        <Divider spacing="sm" />
        <div className="flex justify-between items-baseline gap-4">
          <dt className="text-neutral-500">Decision ID</dt>
          <dd className="font-mono text-neutral-700" data-testid="decision-id">
            {artifact.decision_id}
          </dd>
        </div>
        <Divider spacing="sm" />
        <div className="flex justify-between items-baseline gap-4">
          <dt className="text-neutral-500">Logic version</dt>
          <dd className="text-neutral-700">{artifact.logic_version}</dd>
        </div>
        <Divider spacing="sm" />
        <div className="flex justify-between items-baseline gap-4">
          <dt className="text-neutral-500">Payment reference</dt>
          <dd className="font-mono text-neutral-700" data-testid="payment-reference">
            {maskPaymentReference(paymentRef)}
          </dd>
        </div>
      </dl>

      <Caption className="mt-4 block text-neutral-500">
        Keep this link. This record is version-locked.
      </Caption>
    </Inset>
  );
}

export default function AssuranceViewPage() {
  const params = useParams();
  const assuranceId = params?.id as string;

  const [state, setState] = useState<PageState>('loading');
  const [assurance, setAssurance] = useState<AssuranceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch assurance data - extracted as callback for refresh functionality
  const fetchAssurance = useCallback(async () => {
    if (!assuranceId) {
      setError('No assurance ID provided');
      setState('error');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/assurance/${assuranceId}`);

      if (response.status === 402) {
        setState('payment_required');
        return;
      }

      if (response.status === 404) {
        setError('Assurance not found');
        setState('error');
        return;
      }

      if (response.status === 410) {
        const data = await response.json();
        setError(`This assurance has been revoked: ${data.reason}`);
        setState('error');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to load assurance');
      }

      const data: AssuranceResponse = await response.json();
      setAssurance(data);

      // Check if payment is still pending (webhook delay)
      if (data.payment_status === 'pending' || data.payment_status === 'draft') {
        setState('payment_pending');
      } else {
        setState('success');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setState('error');
    }
  }, [assuranceId]);

  // Handler for refresh button - re-fetches assurance status
  const handleRefreshStatus = useCallback(async () => {
    setIsRefreshing(true);
    await fetchAssurance();
    setIsRefreshing(false);
  }, [fetchAssurance]);

  useEffect(() => {
    fetchAssurance();
  }, [fetchAssurance]);

  if (state === 'loading') {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-gray-50 border border-gray-200 p-6 rounded">
          <p className="text-gray-600">Loading assurance...</p>
        </div>
      </main>
    );
  }

  if (state === 'payment_required') {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold mb-4">Payment required</h1>
        <div className="bg-amber-50 border border-amber-200 p-6 rounded">
          <p className="text-amber-800">
            This assurance requires payment to access.
          </p>
        </div>
        <a
          href={`/assurance/checkout?decision_id=${assuranceId}`}
          className="inline-block mt-6 bg-gray-900 text-white px-6 py-3 rounded font-medium hover:bg-gray-800 transition-colors"
        >
          Complete payment
        </a>
      </main>
    );
  }

  if (state === 'error') {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold mb-4">Unable to load</h1>
        <div className="bg-red-50 border border-red-200 p-6 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      </main>
    );
  }

  // Handle payment_pending state - show content with banner
  if (!assurance && state !== 'payment_pending') return null;
  if (!assurance) return null;

  const { artifact } = assurance;
  const createdDate = new Date(artifact.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Determine if we should show the payment status banner
  const showPaymentBanner = state === 'payment_pending' ||
    (assurance.payment_status && !['completed', 'issued'].includes(assurance.payment_status));

  // Determine if payment is complete (for showing issued record block)
  const isPaymentComplete = assurance.payment_status === 'completed' || assurance.payment_status === 'issued';

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      {/* Payment Status Banner - shown when payment is processing */}
      {showPaymentBanner && assurance.payment_status && (
        <PaymentStatusBanner
          paymentStatus={assurance.payment_status}
          onRefresh={handleRefreshStatus}
          isRefreshing={isRefreshing}
        />
      )}

      {/* Issued Record Block - shown when payment is complete */}
      {isPaymentComplete && <IssuedRecordBlock assurance={assurance} />}

      {/* Header with assurance badge */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
            Decision Assurance
          </span>
          {assurance.access.first_accessed && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
              First access
            </span>
          )}
        </div>
        {/* Only show simple header for pending, use IssuedRecordBlock for complete */}
        {!isPaymentComplete && (
          <p className="text-sm text-gray-500">
            Issued {createdDate} &middot; Version {artifact.logic_version}
          </p>
        )}
      </div>

      {/* Verdict Card */}
      <VerdictCard
        outcome={artifact.verdict.outcome}
        headline={artifact.verdict.headline}
        summary={artifact.verdict.summary}
        confidence={artifact.verdict.confidence}
      />

      {/* Trade-offs */}
      <TradeoffLedger
        gains={artifact.tradeoffs.gains}
        losses={artifact.tradeoffs.losses}
      />

      {/* Assumptions */}
      <AssumptionsBlock assumptions={artifact.assumptions} />

      {/* Change Conditions */}
      <ChangeConditions conditions={artifact.change_conditions} />

      {/* Invalidation Checklist */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          When to reconsider
        </h2>
        <p className="text-sm text-gray-600 mb-3">
          This decision may no longer apply if any of these change:
        </p>
        <ul className="space-y-2">
          {artifact.invalidation_checklist.map((item, i) => (
            <li key={i} className="flex items-start text-sm">
              <span className="text-amber-600 mr-2 flex-shrink-0">&#9888;</span>
              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Actions */}
      <section className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => window.print()}
            className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded text-center font-medium hover:bg-gray-50 transition-colors"
          >
            Print / Save as PDF
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard');
            }}
            className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded text-center font-medium hover:bg-gray-50 transition-colors"
          >
            Copy shareable link
          </button>
        </div>
      </section>

      {/* Embed Code Generator - only available for purchased assurances */}
      <EmbedCodeGenerator
        assuranceId={artifact.assurance_id}
        answerVersion="v1.0"
      />

      {/* Footer with metadata */}
      <footer className="mt-16 pt-4 border-t border-gray-200 text-sm text-gray-500">
        <p>Assurance ID: {artifact.assurance_id}</p>
        <p>Decision ID: {artifact.decision_id}</p>
        <p>Review status: {artifact.review_status}</p>
        <p className="mt-2 text-xs">
          Access count: {assurance.access.download_count}
        </p>
      </footer>
    </main>
  );
}
