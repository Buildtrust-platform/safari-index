/**
 * Ops Inquiry Detail Page
 *
 * Internal-only page for viewing and managing a single inquiry.
 * Protected by x-ops-key header check.
 *
 * Per governance:
 * - noindex, nofollow
 * - Simple, functional UI
 * - No marketing or sales framing
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  Mail,
  Phone,
  Users,
  Wallet,
  Calendar,
  MapPin,
  Save,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  FileText,
  Plus,
  Send,
  Loader2,
} from 'lucide-react';
import type { InquiryRecord, InquiryStatus, ProposalRecord } from '../../../../lib/contracts';
import { BUDGET_BANDS, TRAVEL_STYLES, MONTH_OPTIONS } from '../../../../lib/inquiry';

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

/**
 * Format date for display
 */
function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Calculate and format elapsed time since creation
 * Returns both display string and raw hours for urgency highlighting
 */
function getElapsedTime(createdAt: string): { display: string; hours: number; isUrgent: boolean } {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  const remainingHours = diffHours % 24;

  let display: string;
  if (diffDays > 0) {
    display = remainingHours > 0
      ? `${diffDays}d ${remainingHours}h ago`
      : `${diffDays}d ago`;
  } else if (diffHours > 0) {
    display = `${diffHours}h ago`;
  } else {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    display = diffMinutes > 0 ? `${diffMinutes}m ago` : 'Just now';
  }

  return {
    display,
    hours: diffHours,
    isUrgent: diffHours >= 24, // Urgent if over 24 hours without response
  };
}

/**
 * Format budget band for display
 */
function formatBudgetBand(band: string): string {
  const found = BUDGET_BANDS.find((b) => b.value === band);
  return found?.label || band;
}

/**
 * Format travel style for display
 */
function formatTravelStyle(style: string): string {
  const found = TRAVEL_STYLES.find((s) => s.value === style);
  return found?.label || style;
}

/**
 * Format month for display
 */
function formatMonth(month: number | null): string | null {
  if (!month) return null;
  const found = MONTH_OPTIONS.find((m) => m.value === month);
  return found?.label || null;
}

/**
 * Build reply template
 */
function buildReplyTemplate(inquiry: InquiryRecord): string {
  const dateWindow = [formatMonth(inquiry.travel_month), inquiry.travel_year]
    .filter(Boolean)
    .join(' ');

  return `Hi,

Thank you for your inquiry about safari planning.

Here's what I have noted:
- Budget: ${formatBudgetBand(inquiry.budget_band)}
- Travelers: ${inquiry.traveler_count}
- Travel style: ${formatTravelStyle(inquiry.travel_style)}
- Date window: ${dateWindow || 'Flexible'}
${inquiry.trip_shape_id ? `- Trip interest: ${inquiry.trip_shape_id}` : ''}

I'll review this and get back to you with next steps.

Best regards`;
}

/**
 * Status options
 */
const STATUS_OPTIONS: { value: InquiryStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
];

export default function OpsInquiryDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const inquiryId = params.id as string;

  const [inquiry, setInquiry] = useState<InquiryRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [opsKey, setOpsKey] = useState<string | null>(null);

  // Editable fields
  const [status, setStatus] = useState<InquiryStatus>('new');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Copy state
  const [copiedId, setCopiedId] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  // Proposal state
  const [proposals, setProposals] = useState<ProposalRecord[]>([]);
  const [loadingProposals, setLoadingProposals] = useState(false);
  const [creatingProposal, setCreatingProposal] = useState(false);

  useEffect(() => {
    const key = getOpsKey() || searchParams.get('ops_key');
    setOpsKey(key);

    if (!key) {
      setError('Access key required.');
      setLoading(false);
      return;
    }

    fetchInquiry(key);
    fetchProposals(key);
  }, [inquiryId, searchParams]);

  async function fetchProposals(key: string) {
    setLoadingProposals(true);
    try {
      const response = await fetch(`/api/ops/proposals?inquiry_id=${inquiryId}`, {
        headers: { 'x-ops-key': key },
      });

      if (response.ok) {
        const data = await response.json();
        setProposals(data.proposals || []);
      }
    } catch (err) {
      console.error('Failed to fetch proposals:', err);
    } finally {
      setLoadingProposals(false);
    }
  }

  async function handleCreateProposal() {
    if (!opsKey) return;

    setCreatingProposal(true);
    try {
      const response = await fetch('/api/ops/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-ops-key': opsKey,
        },
        body: JSON.stringify({ inquiry_id: inquiryId }),
      });

      if (response.ok) {
        const proposal = await response.json();
        // Navigate to the proposal editor
        window.location.href = `/ops/proposals/${proposal.proposal_id}?ops_key=${opsKey}`;
      }
    } catch (err) {
      console.error('Failed to create proposal:', err);
    } finally {
      setCreatingProposal(false);
    }
  }

  async function fetchInquiry(key: string) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/ops/inquiries/${inquiryId}`, {
        headers: { 'x-ops-key': key },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('Inquiry not found or access denied.');
        } else {
          setError('Failed to load inquiry.');
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setInquiry(data);
      setStatus(data.status);
      setNotes(data.notes || '');
    } catch (err) {
      console.error('Failed to fetch inquiry:', err);
      setError('Failed to load inquiry.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!opsKey || !inquiry) return;

    setSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch(`/api/ops/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-ops-key': opsKey,
        },
        body: JSON.stringify({ status, notes: notes || null }),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      const updated = await response.json();
      setInquiry(updated);
      setSaveMessage('Saved');
      setTimeout(() => setSaveMessage(null), 2000);
    } catch (err) {
      console.error('Failed to save:', err);
      setSaveMessage('Failed to save');
    } finally {
      setSaving(false);
    }
  }

  function handleCopyId() {
    if (inquiry) {
      navigator.clipboard.writeText(inquiry.inquiry_id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  }

  function handleCopyTemplate() {
    if (inquiry) {
      navigator.clipboard.writeText(buildReplyTemplate(inquiry));
      setCopiedTemplate(true);
      setTimeout(() => setCopiedTemplate(false), 2000);
    }
  }

  const dateWindow = inquiry
    ? [formatMonth(inquiry.travel_month), inquiry.travel_year].filter(Boolean).join(' ')
    : '';

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
            <div className="flex items-center gap-4">
              <Link
                href={`/ops/inquiries?ops_key=${opsKey}`}
                className="flex items-center gap-1 text-sm text-stone-600 hover:text-stone-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to list
              </Link>
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
              <div className="text-stone-500">Loading inquiry...</div>
            </div>
          )}

          {/* Inquiry Content */}
          {!loading && !error && inquiry && (
            <div className="space-y-6">
              {/* ID and Status Header */}
              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">
                      Inquiry ID
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-lg text-stone-900">
                        {inquiry.inquiry_id}
                      </code>
                      <button
                        onClick={handleCopyId}
                        className="p-1 text-stone-400 hover:text-stone-600"
                        title="Copy ID"
                      >
                        {copiedId ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-stone-500 mt-1 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDate(inquiry.created_at)}
                    </p>
                    {/* Elapsed time badge with urgency highlighting */}
                    {(() => {
                      const elapsed = getElapsedTime(inquiry.created_at);
                      return (
                        <span
                          className={`inline-flex items-center gap-1 mt-2 px-2 py-1 text-xs rounded-full ${
                            elapsed.isUrgent
                              ? 'bg-red-100 text-red-700'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                          data-testid="elapsed-time"
                        >
                          <Clock className="w-3 h-3" />
                          {elapsed.display}
                          {elapsed.isUrgent && ' - needs attention'}
                        </span>
                      );
                    })()}
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">
                        Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as InquiryStatus)}
                        className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Saving...' : saveMessage || 'Save'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-stone-900 mb-4">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-stone-400" />
                    <div>
                      <p className="text-xs text-stone-500">Email</p>
                      <a
                        href={`mailto:${inquiry.email}`}
                        className="text-stone-900 hover:text-amber-700"
                      >
                        {inquiry.email}
                      </a>
                    </div>
                  </div>
                  {inquiry.whatsapp && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-stone-400" />
                      <div>
                        <p className="text-xs text-stone-500">WhatsApp</p>
                        <a
                          href={`https://wa.me/${inquiry.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-stone-900 hover:text-amber-700 flex items-center gap-1"
                        >
                          {inquiry.whatsapp}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Trip Details */}
              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-stone-900 mb-4">
                  Trip Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {inquiry.trip_shape_id && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-stone-400" />
                      <div>
                        <p className="text-xs text-stone-500">Trip Shape</p>
                        <Link
                          href={`/trips/${inquiry.trip_shape_id}`}
                          target="_blank"
                          className="text-stone-900 hover:text-amber-700 flex items-center gap-1"
                        >
                          {inquiry.trip_shape_id}
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-stone-400" />
                    <div>
                      <p className="text-xs text-stone-500">Budget</p>
                      <p className="text-stone-900">{formatBudgetBand(inquiry.budget_band)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-stone-400" />
                    <div>
                      <p className="text-xs text-stone-500">Travelers</p>
                      <p className="text-stone-900">{inquiry.traveler_count}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-stone-400" />
                    <div>
                      <p className="text-xs text-stone-500">Travel Style</p>
                      <p className="text-stone-900">{formatTravelStyle(inquiry.travel_style)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-stone-400" />
                    <div>
                      <p className="text-xs text-stone-500">Date Window</p>
                      <p className="text-stone-900">{dateWindow || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Linked Decisions */}
              {inquiry.linked_decision_ids.length > 0 && (
                <div className="bg-white border border-stone-200 rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-stone-900 mb-4">
                    Linked Decisions
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {inquiry.linked_decision_ids.map((id) => (
                      <Link
                        key={id}
                        href={`/decisions/${id}`}
                        target="_blank"
                        className="px-3 py-1 bg-stone-100 text-stone-700 text-sm rounded-full hover:bg-amber-100 hover:text-amber-800 flex items-center gap-1"
                      >
                        {id}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-stone-900 mb-4">Notes</h2>

                {/* Customer notes */}
                {inquiry.notes && (
                  <div className="mb-4 p-4 bg-stone-50 rounded-lg">
                    <p className="text-xs text-stone-500 uppercase tracking-wide mb-2">
                      Customer Notes
                    </p>
                    <p className="text-stone-700">{inquiry.notes}</p>
                  </div>
                )}

                {/* Operator notes */}
                <div>
                  <label className="block text-xs text-stone-500 uppercase tracking-wide mb-2">
                    Operator Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add internal notes about this inquiry..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"
                  />
                </div>
              </div>

              {/* Proposals Section */}
              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-stone-400" />
                    Proposals
                  </h2>
                  <button
                    onClick={handleCreateProposal}
                    disabled={creatingProposal}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
                  >
                    {creatingProposal ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        New Proposal
                      </>
                    )}
                  </button>
                </div>

                {loadingProposals ? (
                  <div className="text-stone-500 text-sm">Loading proposals...</div>
                ) : proposals.length === 0 ? (
                  <div className="text-stone-500 text-sm py-4 text-center border border-dashed border-stone-200 rounded-lg">
                    No proposals yet. Create one to send a Safari Proposal Pack.
                  </div>
                ) : (
                  <div className="divide-y divide-stone-100">
                    {proposals.map((proposal) => (
                      <div
                        key={proposal.proposal_id}
                        className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono text-stone-700">
                              {proposal.proposal_id}
                            </code>
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full ${
                                proposal.status === 'sent'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-stone-100 text-stone-600'
                              }`}
                            >
                              {proposal.status}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 mt-1">
                            Created {new Date(proposal.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {proposal.status === 'sent' && (
                            <Link
                              href={`/p/${proposal.public_token}`}
                              target="_blank"
                              className="flex items-center gap-1 px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 bg-stone-100 rounded-lg"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View
                            </Link>
                          )}
                          <Link
                            href={`/ops/proposals/${proposal.proposal_id}?ops_key=${opsKey}`}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs text-amber-700 hover:text-amber-800 bg-amber-50 rounded-lg"
                          >
                            {proposal.status === 'draft' ? (
                              <>
                                <Send className="w-3 h-3" />
                                Edit
                              </>
                            ) : (
                              'Details'
                            )}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reply Template */}
              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-stone-900">
                    Reply Template
                  </h2>
                  <button
                    onClick={handleCopyTemplate}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 hover:text-stone-900 bg-stone-100 rounded-lg"
                  >
                    {copiedTemplate ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy template
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 bg-stone-50 rounded-lg text-sm text-stone-700 whitespace-pre-wrap font-sans">
                  {buildReplyTemplate(inquiry)}
                </pre>
              </div>

              {/* Source */}
              {inquiry.source_path && (
                <div className="text-sm text-stone-500">
                  Source: {inquiry.source_path}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
