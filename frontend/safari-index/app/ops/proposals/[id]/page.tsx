/**
 * Ops Proposal Editor Page
 *
 * Internal-only page for editing and sending proposals.
 * Protected by x-ops-key header check.
 *
 * Per governance:
 * - noindex, nofollow
 * - Simple, functional UI
 * - No marketing or sales framing
 * - Calm, documentary tone
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Send,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import type { ProposalRecord, InquiryRecord } from '../../../../lib/contracts';
import { getAllTrips } from '../../../content/trip-shapes/trips';
import { getPublishedTopics } from '../../../content/decision-topics';

/**
 * Get OPS_KEY from URL or localStorage
 */
function getOpsKey(): string | null {
  if (typeof window === 'undefined') return null;

  const urlParams = new URLSearchParams(window.location.search);
  const keyFromUrl = urlParams.get('ops_key');
  if (keyFromUrl) {
    localStorage.setItem('ops_key', keyFromUrl);
    return keyFromUrl;
  }

  return localStorage.getItem('ops_key');
}

export default function OpsProposalEditorPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const proposalId = params.id as string;

  const [proposal, setProposal] = useState<ProposalRecord | null>(null);
  const [inquiry, setInquiry] = useState<InquiryRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [opsKey, setOpsKey] = useState<string | null>(null);

  // Editable fields
  const [operatorName, setOperatorName] = useState('');
  const [travelerName, setTravelerName] = useState('');
  const [introNote, setIntroNote] = useState('');
  const [selectedTripIds, setSelectedTripIds] = useState<string[]>([]);
  const [selectedDecisionIds, setSelectedDecisionIds] = useState<string[]>([]);
  const [pricingNotes, setPricingNotes] = useState('');
  const [nextSteps, setNextSteps] = useState('');

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  // Copy state
  const [copiedLink, setCopiedLink] = useState(false);

  // Available options
  const allTrips = getAllTrips();
  const allTopics = getPublishedTopics();

  useEffect(() => {
    const key = getOpsKey() || searchParams.get('ops_key');
    setOpsKey(key);

    if (!key) {
      setError('Access key required.');
      setLoading(false);
      return;
    }

    fetchProposal(key);
  }, [proposalId, searchParams]);

  async function fetchProposal(key: string) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/ops/proposals/${proposalId}`, {
        headers: { 'x-ops-key': key },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('Proposal not found or access denied.');
        } else {
          setError('Failed to load proposal.');
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setProposal(data);

      // Populate form fields
      setOperatorName(data.operator_name || '');
      setTravelerName(data.traveler_name || '');
      setIntroNote(data.intro_note || '');
      setSelectedTripIds(data.recommended_trip_ids || []);
      setSelectedDecisionIds(data.recommended_decision_ids || []);
      setPricingNotes(data.pricing_notes || '');
      setNextSteps(data.next_steps || '');

      // Fetch associated inquiry
      await fetchInquiry(key, data.inquiry_id);
    } catch (err) {
      console.error('Failed to fetch proposal:', err);
      setError('Failed to load proposal.');
    } finally {
      setLoading(false);
    }
  }

  async function fetchInquiry(key: string, inquiryId: string) {
    try {
      const response = await fetch(`/api/ops/inquiries/${inquiryId}`, {
        headers: { 'x-ops-key': key },
      });

      if (response.ok) {
        const data = await response.json();
        setInquiry(data);
      }
    } catch (err) {
      console.error('Failed to fetch inquiry:', err);
    }
  }

  async function handleSave() {
    if (!opsKey || !proposal) return;

    setSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch(`/api/ops/proposals/${proposalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-ops-key': opsKey,
        },
        body: JSON.stringify({
          operator_name: operatorName || null,
          traveler_name: travelerName || null,
          intro_note: introNote || null,
          recommended_trip_ids: selectedTripIds,
          recommended_decision_ids: selectedDecisionIds,
          pricing_notes: pricingNotes || null,
          next_steps: nextSteps || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      const updated = await response.json();
      setProposal(updated);
      setSaveMessage('Saved');
      setTimeout(() => setSaveMessage(null), 2000);
    } catch (err) {
      console.error('Failed to save:', err);
      setSaveMessage('Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function handleSend() {
    if (!opsKey || !proposal) return;

    // Validate required fields
    if (!operatorName || !travelerName) {
      setSaveMessage('Please fill in operator and traveler names');
      return;
    }

    setSending(true);
    setSaveMessage(null);

    try {
      // Save first, then mark as sent
      const response = await fetch(`/api/ops/proposals/${proposalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-ops-key': opsKey,
        },
        body: JSON.stringify({
          status: 'sent',
          operator_name: operatorName || null,
          traveler_name: travelerName || null,
          intro_note: introNote || null,
          recommended_trip_ids: selectedTripIds,
          recommended_decision_ids: selectedDecisionIds,
          pricing_notes: pricingNotes || null,
          next_steps: nextSteps || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send');
      }

      const updated = await response.json();
      setProposal(updated);
      setSaveMessage('Proposal sent');
    } catch (err) {
      console.error('Failed to send:', err);
      setSaveMessage('Failed to send');
    } finally {
      setSending(false);
    }
  }

  function handleCopyLink() {
    if (proposal) {
      const url = `${window.location.origin}/p/${proposal.public_token}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  }

  function toggleTrip(tripId: string) {
    setSelectedTripIds((prev) =>
      prev.includes(tripId) ? prev.filter((id) => id !== tripId) : [...prev, tripId]
    );
  }

  function toggleDecision(decisionId: string) {
    setSelectedDecisionIds((prev) =>
      prev.includes(decisionId)
        ? prev.filter((id) => id !== decisionId)
        : [...prev, decisionId]
    );
  }

  // Check for missing required fields
  const missingFields: string[] = [];
  if (!operatorName) missingFields.push('Operator Name');
  if (!travelerName) missingFields.push('Traveler Name');

  return (
    <>
      {/* noindex meta tag */}
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <main className="min-h-screen bg-stone-100">
        {/* Header */}
        <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link
                href={
                  inquiry
                    ? `/ops/inquiries/${inquiry.inquiry_id}?ops_key=${opsKey}`
                    : `/ops/inquiries?ops_key=${opsKey}`
                }
                className="flex items-center gap-1 text-sm text-stone-600 hover:text-stone-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to inquiry
              </Link>

              {proposal && (
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      proposal.status === 'sent'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {proposal.status}
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-stone-500">Loading proposal...</div>
            </div>
          )}

          {/* Proposal Content */}
          {!loading && !error && proposal && (
            <div className="space-y-6">
              {/* Header with ID */}
              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">
                      Proposal ID
                    </p>
                    <code className="font-mono text-lg text-stone-900">
                      {proposal.proposal_id}
                    </code>
                  </div>

                  <div className="flex items-center gap-2">
                    {proposal.status === 'sent' && (
                      <button
                        onClick={handleCopyLink}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200"
                      >
                        {copiedLink ? (
                          <>
                            <Check className="w-4 h-4 text-green-600" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy Link
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={handleSave}
                      disabled={saving || proposal.status === 'sent'}
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Saving...' : saveMessage || 'Save Draft'}
                    </button>

                    {proposal.status === 'draft' && (
                      <button
                        onClick={handleSend}
                        disabled={sending || missingFields.length > 0}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
                        title={
                          missingFields.length > 0
                            ? `Missing: ${missingFields.join(', ')}`
                            : undefined
                        }
                      >
                        {sending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Mark as Sent
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Missing fields warning */}
                {proposal.status === 'draft' && missingFields.length > 0 && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800">
                      <p className="font-medium">Required fields missing:</p>
                      <p>{missingFields.join(', ')}</p>
                    </div>
                  </div>
                )}

                {/* Public link for sent proposals */}
                {proposal.status === 'sent' && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 mb-2">
                      This proposal is live and can be shared:
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-white border border-green-200 rounded text-sm text-stone-700 font-mono">
                        {window.location.origin}/p/{proposal.public_token}
                      </code>
                      <Link
                        href={`/p/${proposal.public_token}`}
                        target="_blank"
                        className="flex items-center gap-1 px-3 py-2 text-sm text-green-700 hover:text-green-800"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Preview
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-stone-900 mb-4">
                  Proposal Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-stone-600 mb-1">
                      Operator Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={operatorName}
                      onChange={(e) => setOperatorName(e.target.value)}
                      placeholder="Your name or company"
                      disabled={proposal.status === 'sent'}
                      className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:bg-stone-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-stone-600 mb-1">
                      Traveler Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={travelerName}
                      onChange={(e) => setTravelerName(e.target.value)}
                      placeholder="Client's name"
                      disabled={proposal.status === 'sent'}
                      className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:bg-stone-50"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm text-stone-600 mb-1">
                    Introduction Note
                  </label>
                  <textarea
                    value={introNote}
                    onChange={(e) => setIntroNote(e.target.value)}
                    placeholder="A brief, personal message to the traveler..."
                    rows={3}
                    disabled={proposal.status === 'sent'}
                    className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none disabled:bg-stone-50"
                  />
                </div>
              </div>

              {/* Recommended Trips */}
              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-stone-900 mb-4">
                  Recommended Trip Shapes
                </h2>
                <p className="text-sm text-stone-500 mb-4">
                  Select trip shapes to include in the proposal.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {allTrips.slice(0, 12).map((trip) => (
                    <label
                      key={trip.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedTripIds.includes(trip.id)
                          ? 'border-amber-400 bg-amber-50'
                          : 'border-stone-200 hover:bg-stone-50'
                      } ${proposal.status === 'sent' ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTripIds.includes(trip.id)}
                        onChange={() => toggleTrip(trip.id)}
                        disabled={proposal.status === 'sent'}
                        className="mt-1"
                      />
                      <div>
                        <p className="text-sm font-medium text-stone-900">{trip.title}</p>
                        <p className="text-xs text-stone-500">{trip.subtitle}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Recommended Decisions */}
              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-stone-900 mb-4">
                  Relevant Decisions
                </h2>
                <p className="text-sm text-stone-500 mb-4">
                  Select decisions the traveler should review.
                </p>

                <div className="grid grid-cols-1 gap-2">
                  {allTopics.slice(0, 12).map((topic) => (
                    <label
                      key={topic.topic_id}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedDecisionIds.includes(topic.slug)
                          ? 'border-amber-400 bg-amber-50'
                          : 'border-stone-200 hover:bg-stone-50'
                      } ${proposal.status === 'sent' ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedDecisionIds.includes(topic.slug)}
                        onChange={() => toggleDecision(topic.slug)}
                        disabled={proposal.status === 'sent'}
                        className="mt-1"
                      />
                      <div>
                        <p className="text-sm font-medium text-stone-900">
                          {topic.question}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pricing Notes */}
              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-stone-900 mb-4">
                  Pricing Notes
                </h2>
                <p className="text-sm text-stone-500 mb-4">
                  Optional context about pricing, budgets, or estimates.
                </p>
                <textarea
                  value={pricingNotes}
                  onChange={(e) => setPricingNotes(e.target.value)}
                  placeholder="General pricing guidance, budget alignment, or cost context..."
                  rows={4}
                  disabled={proposal.status === 'sent'}
                  className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none disabled:bg-stone-50"
                />
              </div>

              {/* Next Steps */}
              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-stone-900 mb-4">
                  Next Steps
                </h2>
                <p className="text-sm text-stone-500 mb-4">
                  What should the traveler do after reviewing this proposal?
                </p>
                <textarea
                  value={nextSteps}
                  onChange={(e) => setNextSteps(e.target.value)}
                  placeholder="E.g., Reply to discuss further, schedule a call, review the linked decisions..."
                  rows={3}
                  disabled={proposal.status === 'sent'}
                  className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none disabled:bg-stone-50"
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
