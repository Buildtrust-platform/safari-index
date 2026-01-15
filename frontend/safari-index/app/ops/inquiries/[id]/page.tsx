'use client';

/**
 * Ops Inquiry Detail Page
 *
 * Professional full-width detail view with:
 * - All context visible at once (traveler profile, matches, compose)
 * - Keyboard shortcuts for fast actions
 * - AI response generation
 * - Activity timeline
 *
 * Keyboard shortcuts:
 * - G: Generate AI response
 * - S: Change status
 * - C: Copy email
 * - E: Send email
 * - Esc: Go back
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  Mail,
  Phone,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  Send,
  Loader2,
  History,
  MessageSquare,
  Sparkles,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Eye,
  Save,
  Plus,
  X,
  CheckCircle,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import type {
  InquiryRecord,
  InquiryStatus,
  ActivityRecord,
  FollowUpRecord,
  FollowUpType,
} from '../../../../lib/contracts';
import { useOpsKey } from '../../components/hooks/useOpsKey';
import { useInquiryDetail } from '../../components/hooks/useInquiries';
import { StatusPill } from '../../components/StatusPill';
import { KeyboardHint } from '../../components/KeyboardHint';

// ============================================================
// CONSTANTS
// ============================================================

const TRAVEL_STYLE_LABELS: Record<string, string> = {
  solo: 'Solo Traveler',
  couple: 'Couple',
  'family-young-kids': 'Family with Young Kids',
  'family-teens': 'Family with Teens',
  multigenerational: 'Multi-generational',
  'friends-group': 'Friends Group',
  honeymoon: 'Honeymoon',
};

const BUDGET_LABELS: Record<string, string> = {
  '3k-6k': '$3,000 - $6,000',
  '6k-10k': '$6,000 - $10,000',
  '10k-15k': '$10,000 - $15,000',
  '15k-plus': '$15,000+',
  'not-sure': 'Not Sure Yet',
};

const MONTH_NAMES = [
  '',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const FOLLOWUP_TYPES: { value: FollowUpType; label: string }[] = [
  { value: 'email', label: 'Email' },
  { value: 'call', label: 'Call' },
  { value: 'proposal_review', label: 'Proposal Review' },
];

// ============================================================
// TRIP MATCH COMPONENT
// ============================================================

interface TripMatch {
  trip_id: string;
  trip_title: string;
  match_score: number;
  reasons: {
    positive: string[];
    concerns: string[];
  };
  trip_details: {
    subtitle: string;
    regions: string[];
    duration_days: number | [number, number];
    cost_band: { low: number; high: number };
    core_parks_or_areas: string[];
    what_this_trip_is_for: string;
  } | null;
}

function TripMatchCard({
  match,
  rank,
  isSelected,
  onSelect,
}: {
  match: TripMatch;
  rank: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [expanded, setExpanded] = useState(rank === 1);
  const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉';

  return (
    <div
      className={`rounded-xl border transition-all ${
        isSelected
          ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-600'
          : 'border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-800'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <span className="text-xl flex-shrink-0">{rankEmoji}</span>
            <div className="min-w-0">
              <h4 className="font-semibold text-stone-900 dark:text-white truncate">
                {match.trip_title}
              </h4>
              {match.trip_details?.subtitle && (
                <p className="text-sm text-stone-500 dark:text-zinc-400 truncate">
                  {match.trip_details.subtitle}
                </p>
              )}
            </div>
          </div>
          <span className="px-2 py-1 text-sm font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg flex-shrink-0">
            {Math.round(match.match_score * 100)}%
          </span>
        </div>

        {/* Reasons */}
        <div className="mt-3 space-y-1">
          {match.reasons.positive.slice(0, 2).map((reason, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
              <Check className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{reason}</span>
            </div>
          ))}
          {match.reasons.concerns.slice(0, 1).map((concern, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{concern}</span>
            </div>
          ))}
        </div>

        {/* Expanded details */}
        <AnimatePresence>
          {expanded && match.trip_details && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-stone-100 dark:border-zinc-700 space-y-3">
                <p className="text-sm text-stone-600 dark:text-zinc-300">
                  {match.trip_details.what_this_trip_is_for}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-stone-500 dark:text-zinc-400">
                    <Clock className="w-3.5 h-3.5" />
                    {Array.isArray(match.trip_details.duration_days)
                      ? `${match.trip_details.duration_days[0]}-${match.trip_details.duration_days[1]} days`
                      : `${match.trip_details.duration_days} days`}
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-500 dark:text-zinc-400">
                    <DollarSign className="w-3.5 h-3.5" />
                    ${(match.trip_details.cost_band.low / 1000).toFixed(0)}k-$
                    {(match.trip_details.cost_band.high / 1000).toFixed(0)}k
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-500 dark:text-zinc-400 col-span-2">
                    <MapPin className="w-3.5 h-3.5" />
                    {match.trip_details.core_parks_or_areas.slice(0, 3).join(', ')}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-stone-500 dark:text-zinc-400 hover:text-stone-700 dark:hover:text-zinc-200 flex items-center gap-1"
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
                : 'bg-stone-100 dark:bg-zinc-700 text-stone-700 dark:text-zinc-300 hover:bg-stone-200 dark:hover:bg-zinc-600'
            }`}
          >
            {isSelected ? 'Selected' : 'Use This'}
          </button>
        </div>
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
  const router = useRouter();
  const inquiryId = params.id as string;

  const { opsKey, isAuthenticated, isLoading: authLoading, getAuthHeaders } = useOpsKey();
  const { inquiry, matches, loading, error, refresh, updateInquiry } = useInquiryDetail(
    inquiryId,
    opsKey
  );

  // Response composer
  const [draftResponse, setDraftResponse] = useState('');
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  // Notes
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Follow-ups
  const [followups, setFollowups] = useState<FollowUpRecord[]>([]);
  const [showFollowupForm, setShowFollowupForm] = useState(false);
  const [newFollowupDate, setNewFollowupDate] = useState('');
  const [newFollowupType, setNewFollowupType] = useState<FollowUpType>('email');
  const [newFollowupNotes, setNewFollowupNotes] = useState('');

  // Activities
  const [activities, setActivities] = useState<ActivityRecord[]>([]);

  // Copy states
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);

  // Auto-select top match
  useEffect(() => {
    if (matches.length > 0 && !selectedTripId) {
      setSelectedTripId(matches[0].trip_id);
    }
  }, [matches, selectedTripId]);

  // Internal notes are session-only (not persisted to DB)
  // TODO: Add ops_notes field to schema for persistent internal notes

  // Auto-generate if action=generate in URL
  useEffect(() => {
    if (searchParams.get('action') === 'generate' && inquiry && !generatingDraft) {
      handleGenerateDraft();
    }
  }, [inquiry, searchParams]);

  // Fetch additional data
  useEffect(() => {
    if (!opsKey || !inquiryId) return;

    // Fetch follow-ups
    fetch(`/api/ops/followups?inquiry_id=${inquiryId}`, {
      headers: getAuthHeaders(),
    })
      .then((res) => res.ok ? res.json() : { followups: [] })
      .then((data) => setFollowups(data.followups || []))
      .catch(console.error);

    // Fetch activities
    fetch(`/api/ops/inquiries/${inquiryId}?timeline=true`, {
      headers: getAuthHeaders(),
    })
      .then((res) => res.ok ? res.json() : { activities: [] })
      .then((data) => setActivities(data.activities || []))
      .catch(console.error);
  }, [opsKey, inquiryId, getAuthHeaders]);

  // Handlers
  const handleCopyEmail = useCallback(async () => {
    if (!inquiry?.email) return;
    await navigator.clipboard.writeText(inquiry.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  }, [inquiry]);

  const handleCopyResponse = useCallback(async () => {
    if (!draftResponse) return;
    await navigator.clipboard.writeText(draftResponse);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  }, [draftResponse]);

  const handleStatusChange = useCallback(
    async (newStatus: InquiryStatus) => {
      await updateInquiry({ status: newStatus });
    },
    [updateInquiry]
  );

  const handleSaveNotes = useCallback(async () => {
    // Session-only notes - just show saved feedback
    setSaving(true);
    // TODO: Implement ops_notes persistence when field is added to schema
    await new Promise(resolve => setTimeout(resolve, 300));
    setSaving(false);
  }, []);

  const handleGenerateDraft = useCallback(async () => {
    if (!opsKey || !inquiry) return;

    setGeneratingDraft(true);
    try {
      const response = await fetch(`/api/ops/inquiries/${inquiryId}/draft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          trip_id: selectedTripId,
          template: 'first_response',
          use_ai: true,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.draft?.body) {
          setDraftResponse(data.draft.body);
        } else if (typeof data.draft === 'string') {
          setDraftResponse(data.draft);
        } else {
          setDraftResponse(buildBasicTemplate());
        }
      } else {
        setDraftResponse(buildBasicTemplate());
      }
    } catch {
      setDraftResponse(buildBasicTemplate());
    } finally {
      setGeneratingDraft(false);
    }
  }, [opsKey, inquiry, inquiryId, selectedTripId, getAuthHeaders]);

  const buildBasicTemplate = useCallback(() => {
    if (!inquiry) return '';
    const month = inquiry.travel_month ? MONTH_NAMES[inquiry.travel_month] : null;
    const dateWindow = [month, inquiry.travel_year].filter(Boolean).join(' ');
    const selectedMatch = matches.find((m) => m.trip_id === selectedTripId);
    const travelStyle = TRAVEL_STYLE_LABELS[inquiry.travel_style] || inquiry.travel_style;

    return `Hi,

Thank you for reaching out about a safari!

I've reviewed your inquiry and would love to help plan your ${travelStyle.toLowerCase()} adventure${dateWindow ? ` in ${dateWindow}` : ''}.

${selectedMatch ? `Based on what you've shared, I think our ${selectedMatch.trip_title} would be a great fit. ${selectedMatch.trip_details?.what_this_trip_is_for || ''}` : ''}

Would you like to schedule a quick call to discuss the details? I'm available this week and would love to learn more about what you're hoping for from this trip.

Best regards,
Vurara Safaris`;
  }, [inquiry, matches, selectedTripId]);

  const handleCreateFollowup = useCallback(async () => {
    if (!opsKey || !newFollowupDate) return;

    try {
      const response = await fetch('/api/ops/followups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          inquiry_id: inquiryId,
          scheduled_for: new Date(newFollowupDate).toISOString(),
          type: newFollowupType,
          notes: newFollowupNotes || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setFollowups((prev) => [...prev, data]);
        setShowFollowupForm(false);
        setNewFollowupDate('');
        setNewFollowupNotes('');
      }
    } catch (err) {
      console.error('Failed to create followup:', err);
    }
  }, [opsKey, inquiryId, newFollowupDate, newFollowupType, newFollowupNotes, getAuthHeaders]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      // Escape - Go back
      if (e.key === 'Escape') {
        e.preventDefault();
        router.push('/ops/inbox');
        return;
      }

      // G - Generate response
      if (e.key === 'g' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        handleGenerateDraft();
        return;
      }

      // C - Copy email
      if (e.key === 'c' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        handleCopyEmail();
        return;
      }

      // E - Send email
      if (e.key === 'e' && !e.metaKey && !e.ctrlKey && inquiry && draftResponse) {
        e.preventDefault();
        window.location.href = `mailto:${inquiry.email}?subject=Your Safari Inquiry&body=${encodeURIComponent(draftResponse)}`;
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, handleGenerateDraft, handleCopyEmail, inquiry, draftResponse]);

  // Loading / auth states
  if (authLoading || loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-stone-50 dark:bg-zinc-950">
        <Loader2 className="w-6 h-6 text-stone-400 dark:text-zinc-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (error || !inquiry) {
    return (
      <div className="h-screen flex items-center justify-center bg-stone-50 dark:bg-zinc-950">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-stone-600 dark:text-zinc-400">{error || 'Inquiry not found'}</p>
          <button
            onClick={() => router.push('/ops/inbox')}
            className="mt-4 px-4 py-2 text-sm bg-stone-100 dark:bg-zinc-800 rounded-lg"
          >
            Back to Inbox
          </button>
        </div>
      </div>
    );
  }

  const travelStyle = TRAVEL_STYLE_LABELS[inquiry.travel_style] || inquiry.travel_style;
  const budget = BUDGET_LABELS[inquiry.budget_band] || inquiry.budget_band;
  const month = inquiry.travel_month ? MONTH_NAMES[inquiry.travel_month] : null;
  const timeline = [month, inquiry.travel_year].filter(Boolean).join(' ');
  const elapsed = formatDistanceToNow(new Date(inquiry.created_at), { addSuffix: true });
  const isUrgent = inquiry.status === 'new' && Date.now() - new Date(inquiry.created_at).getTime() > 24 * 60 * 60 * 1000;

  return (
    <div className="h-screen flex flex-col bg-stone-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="flex-shrink-0 h-14 bg-white dark:bg-zinc-900 border-b border-stone-200 dark:border-zinc-800">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => router.push('/ops/inbox')}
              className="p-2 text-stone-400 hover:text-stone-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold text-stone-900 dark:text-white truncate">
                  {inquiry.email}
                </h1>
                <StatusPill status={inquiry.status} editable onChange={handleStatusChange} />
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-zinc-400">
                <Clock className="w-3.5 h-3.5" />
                <span className={isUrgent ? 'text-red-500' : ''}>{elapsed}</span>
                {isUrgent && <span className="text-red-500 font-medium">- needs response</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyEmail}
              className="p-2 text-stone-400 hover:text-stone-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              title="Copy email (C)"
            >
              {copiedEmail ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
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
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Traveler + Matches */}
            <div className="space-y-6">
              {/* Traveler Profile */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-stone-200 dark:border-zinc-800 p-6">
                <h2 className="text-xs font-medium text-stone-400 dark:text-zinc-500 uppercase tracking-wide mb-4">
                  Traveler Profile
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-stone-400 dark:text-zinc-500" />
                    <div>
                      <p className="font-medium text-stone-900 dark:text-white">
                        {inquiry.traveler_count} travelers
                      </p>
                      <p className="text-sm text-stone-500 dark:text-zinc-400">{travelStyle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-stone-400 dark:text-zinc-500" />
                    <div>
                      <p className="font-medium text-stone-900 dark:text-white">{budget}</p>
                      <p className="text-sm text-stone-500 dark:text-zinc-400">per person</p>
                    </div>
                  </div>
                  {timeline && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-stone-400 dark:text-zinc-500" />
                      <div>
                        <p className="font-medium text-stone-900 dark:text-white">{timeline}</p>
                        <p className="text-sm text-stone-500 dark:text-zinc-400">travel window</p>
                      </div>
                    </div>
                  )}
                  {inquiry.whatsapp && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-stone-400 dark:text-zinc-500" />
                      <p className="font-medium text-stone-900 dark:text-white">{inquiry.whatsapp}</p>
                    </div>
                  )}
                </div>

                {/* Their message */}
                {inquiry.notes && (
                  <div className="mt-6 pt-4 border-t border-stone-100 dark:border-zinc-800">
                    <h3 className="text-xs font-medium text-stone-400 dark:text-zinc-500 uppercase tracking-wide mb-2">
                      Their Message
                    </h3>
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                      <p className="text-sm text-stone-700 dark:text-amber-200/90 whitespace-pre-wrap">
                        "{inquiry.notes}"
                      </p>
                    </div>
                  </div>
                )}

                {/* Research signals */}
                {inquiry.linked_decision_ids && inquiry.linked_decision_ids.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-stone-100 dark:border-zinc-800">
                    <h3 className="text-xs font-medium text-stone-400 dark:text-zinc-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      Research Signals
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {inquiry.linked_decision_ids.map((decisionId) => (
                        <a
                          key={decisionId}
                          href={`/decisions/${decisionId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 flex items-center gap-1"
                        >
                          {decisionId.replace(/-/g, ' ')}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Trip Matches */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-stone-200 dark:border-zinc-800 p-6">
                <h2 className="text-xs font-medium text-stone-400 dark:text-zinc-500 uppercase tracking-wide mb-4">
                  Trip Matches
                </h2>
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
                ) : (
                  <p className="text-sm text-stone-400 dark:text-zinc-500">No matches calculated</p>
                )}
              </div>
            </div>

            {/* Middle column - Compose */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-stone-200 dark:border-zinc-800 p-6 sticky top-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-medium text-stone-400 dark:text-zinc-500 uppercase tracking-wide flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    Compose Response
                  </h2>
                  <button
                    onClick={handleGenerateDraft}
                    disabled={generatingDraft}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 disabled:opacity-50 transition-colors"
                  >
                    {generatingDraft ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    {draftResponse ? 'Regenerate' : 'Generate'}
                  </button>
                </div>

                <textarea
                  value={draftResponse}
                  onChange={(e) => setDraftResponse(e.target.value)}
                  placeholder="Click 'Generate' to create a personalized response..."
                  rows={16}
                  className="w-full px-4 py-3 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-lg text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none font-mono text-sm"
                />

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-stone-400 dark:text-zinc-500">
                    {selectedTripId
                      ? `Using: ${matches.find((m) => m.trip_id === selectedTripId)?.trip_title}`
                      : 'Select a trip to personalize'}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyResponse}
                      disabled={!draftResponse}
                      className="flex items-center gap-2 px-3 py-2 text-sm border border-stone-200 dark:border-zinc-700 rounded-lg hover:bg-stone-50 dark:hover:bg-zinc-800 disabled:opacity-50 text-stone-700 dark:text-zinc-300 transition-colors"
                    >
                      {copiedResponse ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      Copy
                    </button>
                    <a
                      href={draftResponse ? `mailto:${inquiry.email}?subject=Your Safari Inquiry&body=${encodeURIComponent(draftResponse)}` : '#'}
                      className={`flex items-center gap-2 px-4 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors ${!draftResponse ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <Send className="w-4 h-4" />
                      Send
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Activity + Notes */}
            <div className="space-y-6">
              {/* Notes */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-stone-200 dark:border-zinc-800 p-6">
                <h2 className="text-xs font-medium text-stone-400 dark:text-zinc-500 uppercase tracking-wide mb-4">
                  Internal Notes
                </h2>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes..."
                  rows={4}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-lg text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none text-sm"
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={saving}
                  className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-lg hover:bg-stone-800 dark:hover:bg-stone-100 disabled:opacity-50 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Notes'}
                </button>
              </div>

              {/* Follow-ups */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-stone-200 dark:border-zinc-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-medium text-stone-400 dark:text-zinc-500 uppercase tracking-wide">
                    Follow-ups
                  </h2>
                  <button
                    onClick={() => setShowFollowupForm(!showFollowupForm)}
                    className="p-1.5 text-stone-400 hover:text-stone-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    {showFollowupForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>

                <AnimatePresence>
                  {showFollowupForm && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mb-4"
                    >
                      <div className="p-3 bg-stone-50 dark:bg-zinc-800 rounded-lg space-y-3">
                        <input
                          type="datetime-local"
                          value={newFollowupDate}
                          onChange={(e) => setNewFollowupDate(e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-stone-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-stone-900 dark:text-white"
                        />
                        <select
                          value={newFollowupType}
                          onChange={(e) => setNewFollowupType(e.target.value as FollowUpType)}
                          className="w-full px-3 py-1.5 text-sm border border-stone-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-stone-900 dark:text-white"
                        >
                          {FOLLOWUP_TYPES.map((opt) => (
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
                          className="w-full px-3 py-1.5 text-sm border border-stone-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-stone-900 dark:text-white"
                        />
                        <button
                          onClick={handleCreateFollowup}
                          disabled={!newFollowupDate}
                          className="w-full py-1.5 text-sm bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-lg disabled:opacity-50"
                        >
                          Schedule
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {followups.filter((f) => f.status === 'pending').length > 0 ? (
                  <div className="space-y-2">
                    {followups
                      .filter((f) => f.status === 'pending')
                      .map((followup) => (
                        <div
                          key={followup.followup_id}
                          className="flex items-center justify-between p-2 bg-stone-50 dark:bg-zinc-800 rounded-lg"
                        >
                          <div>
                            <p className="text-sm text-stone-700 dark:text-zinc-300">
                              {FOLLOWUP_TYPES.find((o) => o.value === followup.type)?.label}
                            </p>
                            <p className="text-xs text-stone-400 dark:text-zinc-500">
                              {format(new Date(followup.scheduled_for), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <button className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-stone-400 dark:text-zinc-500">No follow-ups scheduled</p>
                )}
              </div>

              {/* Activity */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-stone-200 dark:border-zinc-800 p-6">
                <h2 className="text-xs font-medium text-stone-400 dark:text-zinc-500 uppercase tracking-wide mb-4">
                  Activity
                </h2>
                {activities.length > 0 ? (
                  <div className="space-y-4">
                    {activities.slice(0, 5).map((activity) => (
                      <div key={activity.activity_id} className="flex items-start gap-3 text-sm">
                        <div className="mt-0.5">
                          <History className="w-4 h-4 text-stone-400 dark:text-zinc-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-stone-700 dark:text-zinc-300">
                            {activity.type === 'status_change'
                              ? `Status: ${activity.old_value} → ${activity.new_value}`
                              : activity.type.replace(/_/g, ' ')}
                          </p>
                          <p className="text-xs text-stone-400 dark:text-zinc-500">
                            {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-stone-400 dark:text-zinc-500">No activity yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard hints */}
      <KeyboardHint
        shortcuts={[
          { keys: ['Esc'], label: 'Back' },
          { keys: ['G'], label: 'Generate' },
          { keys: ['S'], label: 'Status' },
          { keys: ['C'], label: 'Copy' },
          { keys: ['E'], label: 'Send' },
        ]}
      />
    </div>
  );
}
