'use client';

/**
 * InquiryPreview Component
 *
 * Right pane preview showing inquiry details at a glance.
 * Designed for split-pane inbox view with quick actions.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Users,
  Calendar,
  DollarSign,
  MapPin,
  Mail,
  Phone,
  Clock,
  MessageSquare,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { InquiryRecord, InquiryStatus } from '../../../lib/contracts';
import { StatusPill } from './StatusPill';

const TRAVEL_STYLE_LABELS: Record<string, string> = {
  solo: 'Solo Traveler',
  couple: 'Couple',
  'family-young-kids': 'Family with Young Kids',
  'family-teens': 'Family with Teens',
  multigenerational: 'Multi-generational Group',
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
  } | null;
}

interface InquiryPreviewProps {
  inquiry: InquiryRecord | null;
  matches?: TripMatch[];
  loading?: boolean;
  onStatusChange?: (status: InquiryStatus) => void;
  onGenerateResponse?: () => void;
  onOpenDetail?: () => void;
}

export function InquiryPreview({
  inquiry,
  matches = [],
  loading = false,
  onStatusChange,
  onGenerateResponse,
  onOpenDetail,
}: InquiryPreviewProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    if (!inquiry?.email) return;
    await navigator.clipboard.writeText(inquiry.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Empty state
  if (!inquiry && !loading) {
    return (
      <div className="h-full flex items-center justify-center text-stone-400 dark:text-zinc-600">
        <div className="text-center">
          <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Select an inquiry to preview</p>
          <p className="text-xs mt-1 opacity-75">Use ↑↓ or j/k to navigate</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full px-6">
          <div className="h-6 bg-stone-200 dark:bg-zinc-800 rounded w-3/4" />
          <div className="h-4 bg-stone-200 dark:bg-zinc-800 rounded w-1/2" />
          <div className="space-y-2 mt-6">
            <div className="h-20 bg-stone-200 dark:bg-zinc-800 rounded" />
            <div className="h-20 bg-stone-200 dark:bg-zinc-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!inquiry) return null;

  const travelStyle = TRAVEL_STYLE_LABELS[inquiry.travel_style] || inquiry.travel_style;
  const budget = BUDGET_LABELS[inquiry.budget_band] || inquiry.budget_band;
  const month = inquiry.travel_month ? MONTH_NAMES[inquiry.travel_month] : null;
  const timeline = [month, inquiry.travel_year].filter(Boolean).join(' ');
  const elapsed = formatDistanceToNow(new Date(inquiry.created_at), { addSuffix: true });

  const topMatch = matches[0];

  return (
    <motion.div
      key={inquiry.inquiry_id}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.15 }}
      className="h-full overflow-y-auto"
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-stone-900 dark:text-white truncate">
                  {inquiry.email}
                </h2>
                <button
                  onClick={copyEmail}
                  className="p-1 text-stone-400 hover:text-stone-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                  title="Copy email"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-sm text-stone-500 dark:text-zinc-400">{elapsed}</p>
            </div>
            <StatusPill
              status={inquiry.status}
              editable
              onChange={onStatusChange}
            />
          </div>

          {/* Quick actions */}
          <div className="flex gap-2">
            <button
              onClick={onGenerateResponse}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Generate Response
            </button>
            <button
              onClick={onOpenDetail}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-stone-100 text-stone-700 dark:bg-zinc-800 dark:text-zinc-300 rounded-lg hover:bg-stone-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Full View
            </button>
          </div>
        </div>

        {/* Traveler Profile */}
        <div className="bg-stone-50 dark:bg-zinc-800/50 rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-medium text-stone-400 dark:text-zinc-500 uppercase tracking-wide">
            Traveler Profile
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-stone-700 dark:text-zinc-300">
              <Users className="w-4 h-4 text-stone-400 dark:text-zinc-500" />
              <span>{inquiry.traveler_count} travelers</span>
            </div>
            <div className="flex items-center gap-2 text-stone-700 dark:text-zinc-300">
              <User className="w-4 h-4 text-stone-400 dark:text-zinc-500" />
              <span>{travelStyle}</span>
            </div>
            <div className="flex items-center gap-2 text-stone-700 dark:text-zinc-300">
              <DollarSign className="w-4 h-4 text-stone-400 dark:text-zinc-500" />
              <span>{budget}/person</span>
            </div>
            {timeline && (
              <div className="flex items-center gap-2 text-stone-700 dark:text-zinc-300">
                <Calendar className="w-4 h-4 text-stone-400 dark:text-zinc-500" />
                <span>{timeline}</span>
              </div>
            )}
            {inquiry.phone && (
              <div className="flex items-center gap-2 text-stone-700 dark:text-zinc-300 col-span-2">
                <Phone className="w-4 h-4 text-stone-400 dark:text-zinc-500" />
                <span>{inquiry.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Their Message */}
        {inquiry.additional_notes && (
          <div className="space-y-2">
            <h3 className="text-xs font-medium text-stone-400 dark:text-zinc-500 uppercase tracking-wide">
              Their Message
            </h3>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
              <p className="text-sm text-stone-700 dark:text-amber-200/90 whitespace-pre-wrap leading-relaxed">
                "{inquiry.additional_notes}"
              </p>
            </div>
          </div>
        )}

        {/* Best Match */}
        {topMatch && (
          <div className="space-y-2">
            <h3 className="text-xs font-medium text-stone-400 dark:text-zinc-500 uppercase tracking-wide">
              Best Match
            </h3>
            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-stone-200 dark:border-zinc-700 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🥇</span>
                    <h4 className="font-medium text-stone-900 dark:text-white">
                      {topMatch.trip_title}
                    </h4>
                  </div>
                  {topMatch.trip_details?.subtitle && (
                    <p className="text-sm text-stone-500 dark:text-zinc-400 mt-0.5">
                      {topMatch.trip_details.subtitle}
                    </p>
                  )}
                </div>
                <span className="px-2 py-1 text-sm font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg">
                  {Math.round(topMatch.match_score * 100)}%
                </span>
              </div>

              {/* Match reasons */}
              <div className="mt-3 space-y-1">
                {topMatch.reasons.positive.slice(0, 2).map((reason, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400"
                  >
                    <span className="text-green-500">✓</span>
                    {reason}
                  </div>
                ))}
                {topMatch.reasons.concerns.slice(0, 1).map((concern, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400"
                  >
                    <span className="text-amber-500">⚠</span>
                    {concern}
                  </div>
                ))}
              </div>

              {matches.length > 1 && (
                <p className="text-xs text-stone-400 dark:text-zinc-500 mt-3">
                  +{matches.length - 1} more matches
                </p>
              )}
            </div>
          </div>
        )}

        {/* Keyboard hints */}
        <div className="pt-4 border-t border-stone-200 dark:border-zinc-800">
          <div className="flex flex-wrap gap-3 text-xs text-stone-400 dark:text-zinc-500">
            <span>
              <kbd className="px-1.5 py-0.5 bg-stone-100 dark:bg-zinc-800 rounded">⏎</kbd> Open
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-stone-100 dark:bg-zinc-800 rounded">G</kbd> Generate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-stone-100 dark:bg-zinc-800 rounded">S</kbd> Status
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-stone-100 dark:bg-zinc-800 rounded">C</kbd> Copy
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default InquiryPreview;
