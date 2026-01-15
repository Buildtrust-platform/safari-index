'use client';

/**
 * InquiryRow Component
 *
 * Single inquiry row with keyboard focus support.
 * Shows key info at a glance: email, style, timeline, budget.
 */

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Clock } from 'lucide-react';
import type { InquiryRecord, InquiryStatus } from '../../../lib/contracts';
import { formatDistanceToNow } from 'date-fns';

const STATUS_DOT: Record<InquiryStatus, string> = {
  new: 'bg-blue-500',
  contacted: 'bg-purple-500',
  quoted: 'bg-amber-500',
  won: 'bg-green-500',
  lost: 'bg-red-500',
};

const TRAVEL_STYLE_SHORT: Record<string, string> = {
  solo: 'Solo',
  couple: 'Couple',
  'family-young-kids': 'Family',
  'family-teens': 'Family',
  multigenerational: 'Multi-gen',
  'friends-group': 'Group',
  honeymoon: 'Honeymoon',
};

const BUDGET_SHORT: Record<string, string> = {
  '3k-6k': '$3-6k',
  '6k-10k': '$6-10k',
  '10k-15k': '$10-15k',
  '15k-plus': '$15k+',
  'not-sure': 'TBD',
};

const MONTH_SHORT = [
  '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

interface InquiryRowProps {
  inquiry: InquiryRecord;
  isSelected: boolean;
  isFocused: boolean;
  onClick: () => void;
  onDoubleClick?: () => void;
}

export const InquiryRow = forwardRef<HTMLDivElement, InquiryRowProps>(
  function InquiryRow({ inquiry, isSelected, isFocused, onClick, onDoubleClick }, ref) {
    const statusDot = STATUS_DOT[inquiry.status];
    const travelStyle = TRAVEL_STYLE_SHORT[inquiry.travel_style] || inquiry.travel_style;
    const budget = BUDGET_SHORT[inquiry.budget_band] || inquiry.budget_band;
    const month = inquiry.travel_month ? MONTH_SHORT[inquiry.travel_month] : null;
    const timeline = [month, inquiry.travel_year].filter(Boolean).join(' ');

    const elapsed = formatDistanceToNow(new Date(inquiry.created_at), { addSuffix: false });
    const isUrgent = inquiry.status === 'new' && Date.now() - new Date(inquiry.created_at).getTime() > 24 * 60 * 60 * 1000;

    return (
      <motion.div
        ref={ref}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        initial={false}
        animate={{
          backgroundColor: isSelected
            ? 'var(--row-selected-bg)'
            : isFocused
              ? 'var(--row-focused-bg)'
              : 'transparent',
        }}
        className={`
          group px-4 py-3 cursor-pointer border-b border-stone-100 dark:border-zinc-800
          ${isSelected
            ? 'bg-amber-50 dark:bg-amber-900/20 [--row-selected-bg:rgb(255_251_235)] dark:[--row-selected-bg:rgba(217_119_6_0.2)]'
            : isFocused
              ? 'bg-stone-50 dark:bg-zinc-800/50 [--row-focused-bg:rgb(250_250_249)] dark:[--row-focused-bg:rgba(39_39_42_0.5)]'
              : '[--row-selected-bg:transparent] [--row-focused-bg:transparent]'
          }
          hover:bg-stone-50 dark:hover:bg-zinc-800/50 transition-colors
        `}
        tabIndex={0}
        role="row"
        aria-selected={isSelected}
      >
        <div className="flex items-center gap-3">
          {/* Status dot */}
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot}`} />

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`font-medium truncate ${
                isSelected
                  ? 'text-amber-900 dark:text-amber-200'
                  : 'text-stone-900 dark:text-white'
              }`}>
                {inquiry.email}
              </span>
              {isUrgent && (
                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                  Urgent
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-zinc-400">
              <span>{travelStyle}</span>
              {timeline && (
                <>
                  <span className="text-stone-300 dark:text-zinc-600">·</span>
                  <span>{timeline}</span>
                </>
              )}
              <span className="text-stone-300 dark:text-zinc-600">·</span>
              <span>{budget}</span>
            </div>
          </div>

          {/* Time */}
          <div className="flex-shrink-0 text-right">
            <span className={`text-sm ${
              isUrgent ? 'text-red-500 dark:text-red-400 font-medium' : 'text-stone-400 dark:text-zinc-500'
            }`}>
              {elapsed}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }
);

export default InquiryRow;
