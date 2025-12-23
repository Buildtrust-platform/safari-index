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
 */

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { VerdictCard } from '../../components/VerdictCard';
import { TradeoffLedger } from '../../components/TradeoffLedger';
import { AssumptionsBlock } from '../../components/AssumptionsBlock';
import { ChangeConditions } from '../../components/ChangeConditions';
import { EmbedCodeGenerator } from '../../components/EmbedCodeGenerator';
import { API_BASE } from '../../../lib/api-client';

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
  artifact: AssuranceArtifact;
  access: {
    download_count: number;
    first_accessed: boolean;
  };
}

type PageState = 'loading' | 'success' | 'payment_required' | 'error';

export default function AssuranceViewPage() {
  const params = useParams();
  const assuranceId = params?.id as string;

  const [state, setState] = useState<PageState>('loading');
  const [assurance, setAssurance] = useState<AssuranceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assuranceId) {
      setError('No assurance ID provided');
      setState('error');
      return;
    }

    async function fetchAssurance() {
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
        setState('success');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setState('error');
      }
    }

    fetchAssurance();
  }, [assuranceId]);

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

  if (!assurance) return null;

  const { artifact } = assurance;
  const createdDate = new Date(artifact.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
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
        <p className="text-sm text-gray-500">
          Issued {createdDate} &middot; Version {artifact.logic_version}
        </p>
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
