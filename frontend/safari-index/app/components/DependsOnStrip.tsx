/**
 * DependsOnStrip Component
 *
 * Compact row of chips showing key dependencies for a decision.
 * Displays top assumptions and change conditions at a glance.
 *
 * Per 13_frontend_templates.md:
 * - Surface key decision factors quickly
 * - Documentary, non-promotional tone
 *
 * Presentation only - does not change underlying data.
 */

import { cn } from '../ui/utils';

interface DependsOnStripProps {
  /** Top assumptions (show first 3) */
  assumptions: Array<{ id: string; text: string; confidence: number }>;
  /** Change conditions (show first 2) */
  changeConditions: string[];
}

/**
 * Truncate text to first clause or ~40 chars
 */
function truncateToClause(text: string, maxLen = 40): string {
  // Split on common clause separators
  const firstClause = text.split(/[,;:]/).shift() || text;
  if (firstClause.length <= maxLen) {
    return firstClause.trim();
  }
  return firstClause.substring(0, maxLen).trim() + '...';
}

export function DependsOnStrip({
  assumptions,
  changeConditions,
}: DependsOnStripProps) {
  const topAssumptions = assumptions.slice(0, 3);
  const topConditions = changeConditions.slice(0, 2);

  // Combine into chips
  const chips: Array<{ type: 'assumption' | 'condition'; text: string }> = [
    ...topAssumptions.map((a) => ({
      type: 'assumption' as const,
      text: truncateToClause(a.text),
    })),
    ...topConditions.map((c) => ({
      type: 'condition' as const,
      text: truncateToClause(c),
    })),
  ];

  if (chips.length === 0) return null;

  return (
    <div
      className="py-4"
      role="complementary"
      aria-label="What this decision depends on"
      data-testid="depends-on-strip"
    >
      <p className="text-xs font-ui font-medium text-stone-500 uppercase tracking-wide mb-3">
        What this depends on
      </p>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip, index) => (
          <span
            key={index}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm',
              chip.type === 'assumption'
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'bg-stone-100 text-stone-700 border border-stone-200'
            )}
          >
            {chip.type === 'condition' && (
              <svg
                className="w-3 h-3 text-stone-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            )}
            {chip.text}
          </span>
        ))}
      </div>
    </div>
  );
}
