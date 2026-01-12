/**
 * Ops Inquiry Detail Page - Smart Layout
 *
 * Intelligent inquiry view showing:
 * - Traveler profile at a glance
 * - Auto-matched trip recommendations with reasoning
 * - Research signals (decisions they viewed)
 * - AI response drafting
 * - Activity timeline
 *
 * Protected by x-ops-key header check.
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
  History,
  MessageSquare,
  ArrowRight,
  CalendarPlus,
  CheckCircle,
  X,
  Sparkles,
  Target,
  TrendingUp,
  Eye,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Award,
  Compass,
  Sun,
  AlertTriangle,
} from 'lucide-react';
import type {
  InquiryRecord,
  InquiryStatus,
  ProposalRecord,
  ActivityRecord,
  FollowUpRecord,
  FollowUpType,
} from '../../../../lib/contracts';
import { BUDGET_BANDS, TRAVEL_STYLES, MONTH_OPTIONS } from '../../../../lib/inquiry';

/**
 * Trip match type from API
 */
interface TripMatch {
  trip_id: string;
  trip_title: string;
  match_score: number;
  reasons: {
    positive: string[];
    concerns: string[];
  };
  score_breakdown: {
    budget: number;
    timing: number;
    traveler_fit: number;
    interest: number;
  };
  trip_details: {
    subtitle: string;
    regions: string[];
    duration_days: number | [number, number];
    comfort_tier: string;
    cost_band: { low: number; high: number; note: string };
    best_months: number[];
    core_parks_or_areas: string[];
    traveler_fit: string[];
    what_this_trip_is_for: string;
  } | null;
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

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

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getElapsedTime(createdAt: string): { display: string; hours: number; isUrgent: boolean } {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  const remainingHours = diffHours % 24;

  let display: string;
  if (diffDays > 0) {
    display = remainingHours > 0 ? `${diffDays}d ${remainingHours}h ago` : `${diffDays}d ago`;
  } else if (diffHours > 0) {
    display = `${diffHours}h ago`;
  } else {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    display = diffMinutes > 0 ? `${diffMinutes}m ago` : 'Just now';
  }

  return {
    display,
    hours: diffHours,
    isUrgent: diffHours >= 24,
  };
}

function formatBudgetBand(band: string): string {
  const found = BUDGET_BANDS.find((b) => b.value === band);
  return found?.label || band;
}

function formatTravelStyle(style: string): string {
  const found = TRAVEL_STYLES.find((s) => s.value === style);
  return found?.label || style;
}

function formatMonth(month: number | null): string | null {
  if (!month) return null;
  const found = MONTH_OPTIONS.find((m) => m.value === month);
  return found?.label || null;
}

const STATUS_OPTIONS: { value: InquiryStatus; label: string; color: string }[] = [
  { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-700' },
  { value: 'contacted', label: 'Contacted', color: 'bg-purple-100 text-purple-700' },
  { value: 'quoted', label: 'Quoted', color: 'bg-amber-100 text-amber-700' },
  { value: 'won', label: 'Won', color: 'bg-green-100 text-green-700' },
  { value: 'lost', label: 'Lost', color: 'bg-red-100 text-red-700' },
];

const FOLLOWUP_TYPE_OPTIONS: { value: FollowUpType; label: string }[] = [
  { value: 'email', label: 'Email' },
  { value: 'call', label: 'Call' },
  { value: 'proposal_review', label: 'Proposal Review' },
];

// ============================================================
// COMPONENTS
// ============================================================

function StatusBadge({ status }: { status: InquiryStatus }) {
  const statusConfig = STATUS_OPTIONS.find((s) => s.value === status);
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig?.color || 'bg-stone-100'}`}>
      {statusConfig?.label || status}
    </span>
  );
}

function TripMatchCard({
  match,
  rank,
  onSelect,
  isSelected,
}: {
  match: TripMatch;
  rank: number;
  onSelect: () => void;
  isSelected: boolean;
}) {
  const [expanded, setExpanded] = useState(rank === 1);
  const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉';

  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all ${
        isSelected ? 'border-amber-500 bg-amber-50/50' : 'border-stone-200 bg-white'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <span className="text-xl">{rankEmoji}</span>
            <div>
              <h4 className="font-semibold text-stone-900">{match.trip_title}</h4>
              <p className="text-sm text-stone-500">{match.trip_details?.subtitle}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-stone-900">{match.match_score}%</div>
            <div className="text-xs text-stone-400">match</div>
          </div>
        </div>

        {/* Quick reasons */}
        <div className="mt-3 space-y-1">
          {match.reasons.positive.slice(0, 2).map((reason, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-green-700">
              <Check className="w-3.5 h-3.5" />
              <span>{reason}</span>
            </div>
          ))}
          {match.reasons.concerns.slice(0, 1).map((concern, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-amber-700">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{concern}</span>
            </div>
          ))}
        </div>

        {/* Expanded details */}
        {expanded && match.trip_details && (
          <div className="mt-4 pt-4 border-t border-stone-100 space-y-3">
            <p className="text-sm text-stone-600">{match.trip_details.what_this_trip_is_for}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-stone-500">
                <Clock className="w-3.5 h-3.5" />
                {Array.isArray(match.trip_details.duration_days)
                  ? `${match.trip_details.duration_days[0]}-${match.trip_details.duration_days[1]} days`
                  : `${match.trip_details.duration_days} days`}
              </div>
              <div className="flex items-center gap-1.5 text-stone-500">
                <Wallet className="w-3.5 h-3.5" />$
                {(match.trip_details.cost_band.low / 1000).toFixed(0)}k-$
                {(match.trip_details.cost_band.high / 1000).toFixed(0)}k
              </div>
              <div className="flex items-center gap-1.5 text-stone-500 col-span-2">
                <MapPin className="w-3.5 h-3.5" />
                {match.trip_details.core_parks_or_areas.slice(0, 3).join(', ')}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-stone-500 hover:text-stone-700 flex items-center gap-1"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" /> Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" /> More
              </>
            )}
          </button>
          <button
            onClick={onSelect}
            className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
              isSelected
                ? 'bg-amber-600 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {isSelected ? 'Selected' : 'Use This Trip'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ activity }: { activity: ActivityRecord }) {
  const getIcon = () => {
    switch (activity.type) {
      case 'status_change':
        return <ArrowRight className="w-4 h-4 text-purple-500" />;
      case 'note_added':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'proposal_created':
        return <FileText className="w-4 h-4 text-amber-500" />;
      case 'proposal_sent':
        return <Send className="w-4 h-4 text-green-500" />;
      case 'followup_scheduled':
        return <CalendarPlus className="w-4 h-4 text-indigo-500" />;
      case 'followup_completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <History className="w-4 h-4 text-stone-400" />;
    }
  };

  const getDescription = () => {
    switch (activity.type) {
      case 'status_change':
        return `Status changed from ${activity.old_value} to ${activity.new_value}`;
      case 'note_added':
        return `Note added: "${activity.details?.substring(0, 50)}${(activity.details?.length || 0) > 50 ? '...' : ''}"`;
      case 'proposal_created':
        return 'Proposal created';
      case 'proposal_sent':
        return 'Proposal sent';
      case 'followup_scheduled':
        return `Follow-up scheduled: ${activity.details}`;
      case 'followup_completed':
        return 'Follow-up completed';
      default:
        return activity.type;
    }
  };

  return (
    <div className="flex items-start gap-3 text-sm">
      <div className="mt-0.5">{getIcon()}</div>
      <div className="flex-1">
        <p className="text-stone-700">{getDescription()}</p>
        <p className="text-xs text-stone-400">{formatDate(activity.timestamp)}</p>
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function OpsInquiryDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const inquiryId = params.id as string;

  // Core state
  const [inquiry, setInquiry] = useState<InquiryRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [opsKey, setOpsKey] = useState<string | null>(null);

  // Trip matches
  const [matches, setMatches] = useState<TripMatch[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  // Response drafting
  const [draftResponse, setDraftResponse] = useState('');
  const [generatingDraft, setGeneratingDraft] = useState(false);

  // Status and notes
  const [status, setStatus] = useState<InquiryStatus>('new');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Proposals
  const [proposals, setProposals] = useState<ProposalRecord[]>([]);
  const [loadingProposals, setLoadingProposals] = useState(false);
  const [creatingProposal, setCreatingProposal] = useState(false);

  // Activity timeline
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Follow-ups
  const [followups, setFollowups] = useState<FollowUpRecord[]>([]);
  const [loadingFollowups, setLoadingFollowups] = useState(false);
  const [showFollowupForm, setShowFollowupForm] = useState(false);
  const [newFollowupDate, setNewFollowupDate] = useState('');
  const [newFollowupType, setNewFollowupType] = useState<FollowUpType>('email');
  const [newFollowupNotes, setNewFollowupNotes] = useState('');
  const [creatingFollowup, setCreatingFollowup] = useState(false);

  // Copy state
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);

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
    fetchActivities(key);
    fetchFollowups(key);
    fetchMatches(key);
  }, [inquiryId, searchParams]);

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
      setNotes(data.ops_notes || '');
    } catch (err) {
      console.error('Failed to fetch inquiry:', err);
      setError('Failed to load inquiry.');
    } finally {
      setLoading(false);
    }
  }

  async function fetchMatches(key: string) {
    setLoadingMatches(true);
    try {
      const response = await fetch(`/api/ops/inquiries/${inquiryId}/matches?limit=3`, {
        headers: { 'x-ops-key': key },
      });

      if (response.ok) {
        const data = await response.json();
        setMatches(data.matches || []);
        // Auto-select top match
        if (data.matches?.length > 0) {
          setSelectedTripId(data.matches[0].trip_id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch matches:', err);
    } finally {
      setLoadingMatches(false);
    }
  }

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

  async function fetchActivities(key: string) {
    setLoadingActivities(true);
    try {
      const response = await fetch(`/api/ops/inquiries/${inquiryId}?timeline=true`, {
        headers: { 'x-ops-key': key },
      });

      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);
      }
    } catch (err) {
      console.error('Failed to fetch activities:', err);
    } finally {
      setLoadingActivities(false);
    }
  }

  async function fetchFollowups(key: string) {
    setLoadingFollowups(true);
    try {
      const response = await fetch(`/api/ops/followups?inquiry_id=${inquiryId}`, {
        headers: { 'x-ops-key': key },
      });

      if (response.ok) {
        const data = await response.json();
        setFollowups(data.followups || []);
      }
    } catch (err) {
      console.error('Failed to fetch followups:', err);
    } finally {
      setLoadingFollowups(false);
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
        body: JSON.stringify({ status, ops_notes: notes }),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      const updated = await response.json();
      setInquiry(updated);
      setSaveMessage('Saved');
      fetchActivities(opsKey);
      setTimeout(() => setSaveMessage(null), 2000);
    } catch (err) {
      console.error('Failed to save:', err);
      setSaveMessage('Failed to save');
    } finally {
      setSaving(false);
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
        fetchProposals(opsKey);
        fetchActivities(opsKey);
      }
    } catch (err) {
      console.error('Failed to create proposal:', err);
    } finally {
      setCreatingProposal(false);
    }
  }

  async function handleCreateFollowup() {
    if (!opsKey || !newFollowupDate) return;

    setCreatingFollowup(true);
    try {
      const response = await fetch('/api/ops/followups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-ops-key': opsKey,
        },
        body: JSON.stringify({
          inquiry_id: inquiryId,
          scheduled_for: new Date(newFollowupDate).toISOString(),
          type: newFollowupType,
          notes: newFollowupNotes || undefined,
        }),
      });

      if (response.ok) {
        fetchFollowups(opsKey);
        fetchActivities(opsKey);
        setShowFollowupForm(false);
        setNewFollowupDate('');
        setNewFollowupNotes('');
      }
    } catch (err) {
      console.error('Failed to create followup:', err);
    } finally {
      setCreatingFollowup(false);
    }
  }

  async function handleCompleteFollowup(followupId: string) {
    if (!opsKey) return;

    try {
      await fetch(`/api/ops/followups/${followupId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-ops-key': opsKey,
        },
        body: JSON.stringify({ status: 'completed' }),
      });

      fetchFollowups(opsKey);
      fetchActivities(opsKey);
    } catch (err) {
      console.error('Failed to complete followup:', err);
    }
  }

  async function handleGenerateDraft() {
    if (!opsKey || !inquiry) return;

    setGeneratingDraft(true);
    try {
      const response = await fetch(`/api/ops/inquiries/${inquiryId}/draft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-ops-key': opsKey,
        },
        body: JSON.stringify({
          trip_id: selectedTripId,
          template: 'first_response',
          use_ai: true,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Extract body from draft object returned by API
        if (data.draft && data.draft.body) {
          setDraftResponse(data.draft.body);
        } else if (typeof data.draft === 'string') {
          setDraftResponse(data.draft);
        } else {
          // Fallback to basic template
          setDraftResponse(buildBasicTemplate());
        }
      } else {
        // Fallback to basic template
        setDraftResponse(buildBasicTemplate());
      }
    } catch (err) {
      console.error('Failed to generate draft:', err);
      // Fallback to basic template
      setDraftResponse(buildBasicTemplate());
    } finally {
      setGeneratingDraft(false);
    }
  }

  function buildBasicTemplate(): string {
    if (!inquiry) return '';
    const monthStr = formatMonth(inquiry.travel_month);
    const dateWindow = [monthStr, inquiry.travel_year].filter(Boolean).join(' ');
    const selectedMatch = matches.find((m) => m.trip_id === selectedTripId);

    return `Hi,

Thank you for reaching out about a safari!

I've reviewed your inquiry and would love to help plan your ${formatTravelStyle(inquiry.travel_style).toLowerCase()} adventure${dateWindow ? ` in ${dateWindow}` : ''}.

${selectedMatch ? `Based on what you've shared, I think our ${selectedMatch.trip_title} would be a great fit. ${selectedMatch.trip_details?.what_this_trip_is_for || ''}` : ''}

Would you like to schedule a quick call to discuss the details? I'm available this week and would love to learn more about what you're hoping for from this trip.

Best regards,
Vurara Safaris`;
  }

  function handleCopyEmail() {
    if (inquiry) {
      navigator.clipboard.writeText(inquiry.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  }

  function handleCopyResponse() {
    navigator.clipboard.writeText(draftResponse);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="text-stone-500">Loading...</div>
      </main>
    );
  }

  if (error || !inquiry) {
    return (
      <main className="min-h-screen bg-stone-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <p>{error || 'Failed to load inquiry'}</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const elapsed = getElapsedTime(inquiry.created_at);

  return (
    <>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <main className="min-h-screen bg-stone-100">
        {/* Header */}
        <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href={`/ops/inquiries?ops_key=${opsKey}`}
                  className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-lg font-semibold text-stone-900">{inquiry.email}</h1>
                    <StatusBadge status={inquiry.status} />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-stone-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span className={elapsed.isUrgent && inquiry.status === 'new' ? 'text-red-600 font-medium' : ''}>
                      {elapsed.display}
                    </span>
                    {elapsed.isUrgent && inquiry.status === 'new' && (
                      <span className="text-red-600">- needs response</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyEmail}
                  className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg"
                  title="Copy email"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <a
                  href={`mailto:${inquiry.email}`}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </a>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Traveler Profile Card */}
              <div className="bg-white rounded-xl border border-stone-200 p-6">
                <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-4">
                  Traveler Profile
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-stone-400 mb-1">
                      <Users className="w-4 h-4" />
                      <span className="text-xs">Travelers</span>
                    </div>
                    <p className="font-semibold text-stone-900">{inquiry.traveler_count}</p>
                    <p className="text-sm text-stone-500">{formatTravelStyle(inquiry.travel_style)}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-stone-400 mb-1">
                      <Wallet className="w-4 h-4" />
                      <span className="text-xs">Budget</span>
                    </div>
                    <p className="font-semibold text-stone-900">{formatBudgetBand(inquiry.budget_band)}</p>
                    <p className="text-sm text-stone-500">per person</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-stone-400 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs">Timeline</span>
                    </div>
                    <p className="font-semibold text-stone-900">
                      {formatMonth(inquiry.travel_month) || 'Flexible'}
                    </p>
                    <p className="text-sm text-stone-500">{inquiry.travel_year || 'Any year'}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-stone-400 mb-1">
                      <Phone className="w-4 h-4" />
                      <span className="text-xs">WhatsApp</span>
                    </div>
                    <p className="font-semibold text-stone-900">
                      {inquiry.whatsapp || <span className="text-stone-400">Not provided</span>}
                    </p>
                  </div>
                </div>

                {/* Their notes */}
                {inquiry.notes && (
                  <div className="mt-4 pt-4 border-t border-stone-100">
                    <div className="flex items-center gap-2 text-stone-400 mb-2">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase">Their Notes</span>
                    </div>
                    <p className="text-stone-700 bg-stone-50 p-3 rounded-lg text-sm">{inquiry.notes}</p>
                  </div>
                )}

                {/* What they researched */}
                {inquiry.linked_decision_ids && inquiry.linked_decision_ids.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-stone-100">
                    <div className="flex items-center gap-2 text-stone-400 mb-2">
                      <Eye className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase">Research Signals</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {inquiry.linked_decision_ids.map((decisionId) => (
                        <Link
                          key={decisionId}
                          href={`/decisions/${decisionId}`}
                          target="_blank"
                          className="px-2.5 py-1 text-xs bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 flex items-center gap-1"
                        >
                          {decisionId.replace(/-/g, ' ')}
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Trip Matches Card */}
              <div className="bg-white rounded-xl border border-stone-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-amber-600" />
                    <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wide">
                      Trip Matches
                    </h2>
                  </div>
                  {loadingMatches && <Loader2 className="w-4 h-4 animate-spin text-stone-400" />}
                </div>

                {matches.length > 0 ? (
                  <div className="space-y-4">
                    {matches.map((match, idx) => (
                      <TripMatchCard
                        key={match.trip_id}
                        match={match}
                        rank={idx + 1}
                        isSelected={selectedTripId === match.trip_id}
                        onSelect={() => setSelectedTripId(match.trip_id)}
                      />
                    ))}
                  </div>
                ) : !loadingMatches ? (
                  <p className="text-stone-500 text-sm">No matches calculated yet.</p>
                ) : null}
              </div>

              {/* Response Composer */}
              <div className="bg-white rounded-xl border border-stone-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wide">
                      Compose Response
                    </h2>
                  </div>
                  <button
                    onClick={handleGenerateDraft}
                    disabled={generatingDraft}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 disabled:opacity-50"
                  >
                    {generatingDraft ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    {draftResponse ? 'Regenerate' : 'Generate Draft'}
                  </button>
                </div>

                <textarea
                  value={draftResponse}
                  onChange={(e) => setDraftResponse(e.target.value)}
                  placeholder="Click 'Generate Draft' to create a personalized response, or write your own..."
                  rows={10}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none font-mono text-sm"
                />

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-stone-400">
                    {selectedTripId
                      ? `Using: ${matches.find((m) => m.trip_id === selectedTripId)?.trip_title}`
                      : 'Select a trip above to personalize the response'}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyResponse}
                      disabled={!draftResponse}
                      className="flex items-center gap-2 px-4 py-2 text-sm border border-stone-200 rounded-lg hover:bg-stone-50 disabled:opacity-50"
                    >
                      {copiedResponse ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      Copy
                    </button>
                    <a
                      href={`mailto:${inquiry.email}?subject=Your Safari Inquiry&body=${encodeURIComponent(draftResponse)}`}
                      className={`flex items-center gap-2 px-4 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 ${!draftResponse ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <Send className="w-4 h-4" />
                      Send Email
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - 1 column */}
            <div className="space-y-6">
              {/* Status & Actions */}
              <div className="bg-white rounded-xl border border-stone-200 p-6">
                <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-4">
                  Status & Actions
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-stone-500 mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as InquiryStatus)}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-stone-500 mb-1">Internal Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes..."
                      rows={3}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none text-sm"
                    />
                  </div>

                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : saveMessage || 'Save Changes'}
                  </button>
                </div>
              </div>

              {/* Proposals */}
              <div className="bg-white rounded-xl border border-stone-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wide">
                    Proposals
                  </h3>
                  <button
                    onClick={handleCreateProposal}
                    disabled={creatingProposal}
                    className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg"
                  >
                    {creatingProposal ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>

                {loadingProposals ? (
                  <p className="text-sm text-stone-400">Loading...</p>
                ) : proposals.length > 0 ? (
                  <div className="space-y-2">
                    {proposals.map((proposal) => (
                      <Link
                        key={proposal.proposal_id}
                        href={`/ops/proposals/${proposal.proposal_id}?ops_key=${opsKey}`}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 group"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-stone-400" />
                          <span className="text-sm text-stone-700 group-hover:text-amber-700">
                            {proposal.status === 'draft' ? 'Draft' : 'Sent'}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-stone-400">No proposals yet</p>
                )}
              </div>

              {/* Follow-ups */}
              <div className="bg-white rounded-xl border border-stone-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wide">
                    Follow-ups
                  </h3>
                  <button
                    onClick={() => setShowFollowupForm(!showFollowupForm)}
                    className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg"
                  >
                    {showFollowupForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>

                {showFollowupForm && (
                  <div className="mb-4 p-3 bg-stone-50 rounded-lg space-y-3">
                    <input
                      type="datetime-local"
                      value={newFollowupDate}
                      onChange={(e) => setNewFollowupDate(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border border-stone-200 rounded-lg"
                    />
                    <select
                      value={newFollowupType}
                      onChange={(e) => setNewFollowupType(e.target.value as FollowUpType)}
                      className="w-full px-3 py-1.5 text-sm border border-stone-200 rounded-lg"
                    >
                      {FOLLOWUP_TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Notes (optional)"
                      value={newFollowupNotes}
                      onChange={(e) => setNewFollowupNotes(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border border-stone-200 rounded-lg"
                    />
                    <button
                      onClick={handleCreateFollowup}
                      disabled={creatingFollowup || !newFollowupDate}
                      className="w-full py-1.5 text-sm bg-stone-900 text-white rounded-lg disabled:opacity-50"
                    >
                      {creatingFollowup ? 'Scheduling...' : 'Schedule'}
                    </button>
                  </div>
                )}

                {loadingFollowups ? (
                  <p className="text-sm text-stone-400">Loading...</p>
                ) : followups.length > 0 ? (
                  <div className="space-y-2">
                    {followups
                      .filter((f) => f.status === 'pending')
                      .map((followup) => (
                        <div
                          key={followup.followup_id}
                          className="flex items-center justify-between p-2 rounded-lg bg-stone-50"
                        >
                          <div>
                            <p className="text-sm text-stone-700">
                              {FOLLOWUP_TYPE_OPTIONS.find((o) => o.value === followup.type)?.label}
                            </p>
                            <p className="text-xs text-stone-400">
                              {new Date(followup.scheduled_for).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleCompleteFollowup(followup.followup_id)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-stone-400">No follow-ups scheduled</p>
                )}
              </div>

              {/* Activity Timeline */}
              <div className="bg-white rounded-xl border border-stone-200 p-6">
                <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-4">
                  Activity
                </h3>

                {loadingActivities ? (
                  <p className="text-sm text-stone-400">Loading...</p>
                ) : activities.length > 0 ? (
                  <div className="space-y-4">
                    {activities.slice(0, 5).map((activity) => (
                      <ActivityItem key={activity.activity_id} activity={activity} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-stone-400">No activity yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
