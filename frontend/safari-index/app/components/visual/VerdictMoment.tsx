/**
 * VerdictMoment Component
 *
 * A field instrument strip that displays the decision verdict in the hero.
 * Positioned directly under the question context line.
 *
 * Structure:
 * - Left: Outcome badge (book/wait/switch/discard) with semantic colors
 * - Middle: Confidence + 1-line explanatory phrase (uses headline)
 * - Right: Decision ID + logic version in mono (subdued)
 *
 * Per 01_brand_voice.md:
 * - Calm, deliberate, non-promotional
 * - No marketing language
 *
 * Per 13_frontend_templates.md:
 * - Verdict-first display pattern
 *
 * STAGING ONLY: Rendered within build mode pages.
 */

import { cn } from '../../ui/utils';
import { CopyIcon } from '../ui';

export type OutcomeType = 'book' | 'wait' | 'switch' | 'discard' | 'refused';

export interface VerdictMomentProps {
  /** Decision outcome */
  outcome: OutcomeType;
  /** Short explanatory headline (from decision API) */
  headline: string;
  /** Confidence score 0-1 */
  confidence: number;
  /** Decision ID for reference (optional for baseline fallback) */
  decisionId?: string;
  /** Logic version for transparency (optional for baseline fallback) */
  logicVersion?: string;
  /** Optional click handler for copy button */
  onCopyId?: () => void;
}

/** Outcome labels */
const OUTCOME_LABELS: Record<OutcomeType, string> = {
  book: 'Book',
  wait: 'Wait',
  switch: 'Switch',
  discard: 'Discard',
  refused: 'Refused',
};

/** Outcome badge styles - safari-industry semantic colors */
const OUTCOME_BADGE_STYLES: Record<OutcomeType, string> = {
  book: 'bg-[#2F5D50] text-white',      // Safari green
  wait: 'bg-[#8C6D2E] text-white',      // Savannah amber
  switch: 'bg-[#3E5C76] text-white',    // Safari blue-slate
  discard: 'bg-[#8A3F3B] text-white',   // Muted terracotta
  refused: 'bg-neutral-500 text-white', // Neutral
};

/** Confidence label mapping */
function getConfidenceLabel(confidence: number): string {
  if (confidence >= 0.7) return 'High';
  if (confidence >= 0.4) return 'Medium';
  return 'Low';
}

/**
 * VerdictMoment - Field instrument strip for decision verdict
 *
 * Designed to feel like a calm, premium instrument reading.
 */
export function VerdictMoment({
  outcome,
  headline,
  confidence,
  decisionId,
  logicVersion,
  onCopyId,
}: VerdictMomentProps) {
  const confidenceLabel = outcome !== 'refused' ? getConfidenceLabel(confidence) : null;

  const handleCopy = () => {
    if (onCopyId) {
      onCopyId();
    } else if (decisionId) {
      navigator.clipboard.writeText(decisionId);
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4',
        'py-3 px-4 rounded-md',
        'bg-black/20 backdrop-blur-sm',
        'border border-white/10'
      )}
      role="status"
      aria-label="Decision verdict summary"
      data-testid="verdict-moment"
    >
      {/* Left: Outcome badge */}
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'px-3 py-1.5 rounded text-sm font-medium tracking-wide',
            OUTCOME_BADGE_STYLES[outcome]
          )}
          aria-label={`Outcome: ${OUTCOME_LABELS[outcome]}`}
        >
          {OUTCOME_LABELS[outcome]}
        </span>

        {/* Middle: Confidence + headline */}
        {confidenceLabel && (
          <span className="text-white/70 text-sm font-ui">
            {confidenceLabel} confidence
          </span>
        )}
      </div>

      {/* Headline - truncated for strip display */}
      <div className="flex-1 min-w-0">
        <p className="text-white/90 text-sm font-editorial leading-snug truncate">
          {headline}
        </p>
      </div>

      {/* Right: Decision ID + version (subdued mono) - only shown for live decisions */}
      {decisionId && (
        <div className="flex items-center gap-2 text-white/50">
          {logicVersion && (
            <span className="font-mono text-xs hidden md:inline">
              {logicVersion}
            </span>
          )}
          <span className="font-mono text-xs">
            {decisionId.slice(0, 12)}…
          </span>
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            aria-label="Copy decision ID"
            title="Copy decision ID"
          >
            <CopyIcon className="w-3.5 h-3.5 text-white/50" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
