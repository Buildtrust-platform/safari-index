/**
 * VerdictBox Component
 *
 * "Answer First" snippet box for SEO/AEO optimization.
 * Placed at the top of decision articles to provide immediate answers.
 *
 * Per Hub & Spoke strategy:
 * - AI scrapes this box to answer users immediately
 * - Background color makes it visually distinct
 * - Direct verdict + ratings for Featured Snippet targeting
 *
 * Usage:
 * <VerdictBox
 *   verdict="Yes, July is peak season. Expect 50+ vehicles at crossings."
 *   recommendation="Northern Mara offers lower density if you book early."
 *   ratings={[
 *     { label: 'Wildlife', score: 8 },
 *     { label: 'Privacy', score: 3 },
 *   ]}
 * />
 */

import { cn } from '../../ui/utils';
import { CheckIcon, ClockIcon, SwitchIcon, DiscardIcon } from './Icon';

// =============================================================================
// TYPES
// =============================================================================

export type VerdictOutcome = 'yes' | 'no' | 'depends' | 'wait';

export interface VerdictRating {
  label: string;
  score: number; // 1-10
}

export interface VerdictBoxProps {
  /** The direct answer/verdict */
  verdict: string;
  /** Optional recommendation or next step */
  recommendation?: string;
  /** Optional ratings (e.g., Wildlife: 8/10) */
  ratings?: VerdictRating[];
  /** Outcome type for styling */
  outcome?: VerdictOutcome;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// STYLING
// =============================================================================

const outcomeStyles: Record<VerdictOutcome, { bg: string; border: string; icon: React.ElementType }> = {
  yes: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: CheckIcon,
  },
  no: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    icon: DiscardIcon,
  },
  depends: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: SwitchIcon,
  },
  wait: {
    bg: 'bg-stone-100',
    border: 'border-stone-200',
    icon: ClockIcon,
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

export function VerdictBox({
  verdict,
  recommendation,
  ratings,
  outcome = 'depends',
  className,
}: VerdictBoxProps) {
  const styles = outcomeStyles[outcome];
  const Icon = styles.icon;

  return (
    <div
      className={cn(
        'rounded-xl border-2 p-6',
        styles.bg,
        styles.border,
        className
      )}
      role="region"
      aria-label="The Verdict"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5" />
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          The Verdict
        </span>
      </div>

      {/* Main verdict text */}
      <p className="text-lg font-medium text-stone-900 leading-relaxed mb-3">
        {verdict}
      </p>

      {/* Recommendation */}
      {recommendation && (
        <p className="text-stone-600 text-sm leading-relaxed mb-4">
          {recommendation}
        </p>
      )}

      {/* Ratings bar */}
      {ratings && ratings.length > 0 && (
        <div className="flex flex-wrap gap-4 pt-3 border-t border-stone-200/50">
          {ratings.map((rating) => (
            <div key={rating.label} className="flex items-center gap-2">
              <span className="text-sm text-stone-500">{rating.label}:</span>
              <span className="text-sm font-semibold text-stone-900">
                {rating.score}/10
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// COMPARISON TABLE COMPONENT
// =============================================================================

export interface ComparisonRow {
  left: string;
  right: string;
}

export interface ComparisonTableProps {
  /** Left column header */
  leftHeader: string;
  /** Right column header */
  rightHeader: string;
  /** Table rows */
  rows: ComparisonRow[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * ComparisonTable - Structured pros/cons table for Featured Snippets
 *
 * Usage:
 * <ComparisonTable
 *   leftHeader="Pros of July"
 *   rightHeader="Cons of July"
 *   rows={[
 *     { left: 'Peak migration activity', right: '50+ vehicles at crossings' },
 *     { left: 'Dry weather guaranteed', right: 'Highest prices of year' },
 *   ]}
 * />
 */
export function ComparisonTable({
  leftHeader,
  rightHeader,
  rows,
  className,
}: ComparisonTableProps) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left p-3 bg-emerald-50 border border-stone-200 font-semibold text-stone-900 text-sm">
              {leftHeader}
            </th>
            <th className="text-left p-3 bg-rose-50 border border-stone-200 font-semibold text-stone-900 text-sm">
              {rightHeader}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td className="p-3 border border-stone-200 text-stone-700 text-sm align-top">
                {row.left}
              </td>
              <td className="p-3 border border-stone-200 text-stone-700 text-sm align-top">
                {row.right}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// =============================================================================
// COMMERCIAL CTA COMPONENT
// =============================================================================

export interface CommercialCTAProps {
  /** CTA headline */
  headline: string;
  /** CTA description */
  description?: string;
  /** Link URL */
  href: string;
  /** Link text */
  linkText: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * CommercialCTA - Links article to trip product
 *
 * Usage:
 * <CommercialCTA
 *   headline="Want to avoid these crowds?"
 *   description="Our private July itinerary uses exclusive conservancies."
 *   href="/trips/migration-private-july"
 *   linkText="See Private July Itinerary"
 * />
 */
export function CommercialCTA({
  headline,
  description,
  href,
  linkText,
  className,
}: CommercialCTAProps) {
  return (
    <div
      className={cn(
        'bg-stone-900 rounded-xl p-6 text-white',
        className
      )}
    >
      <h3 className="font-semibold text-lg mb-2">{headline}</h3>
      {description && (
        <p className="text-stone-300 text-sm mb-4">{description}</p>
      )}
      <a
        href={href}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white text-stone-900 rounded-lg text-sm font-medium hover:bg-stone-100 transition-colors"
      >
        {linkText}
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </a>
    </div>
  );
}
