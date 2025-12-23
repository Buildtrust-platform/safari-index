/**
 * Verdict Card Component
 *
 * Per 13_frontend_templates.md Section 1A:
 * - Display decision outcome instantly, above the fold
 * - Contains: Outcome label, Headline, Summary, Confidence indicator
 * - Must not look like a promotional banner
 *
 * Per 02_decision_doctrine.md:
 * - Single verdict: book|wait|switch|discard|refused
 * - No marketing language, no hedging
 */

import { cn } from '../ui/utils';
import { section } from '../ui/styles';

interface VerdictCardProps {
  outcome: 'book' | 'wait' | 'switch' | 'discard' | 'refused';
  headline: string;
  summary: string;
  confidence: number; // 0-1, displayed as High/Medium/Low
}

function getConfidenceLabel(confidence: number): string {
  if (confidence >= 0.7) return 'High';
  if (confidence >= 0.4) return 'Medium';
  return 'Low';
}

function getOutcomeStyles(outcome: VerdictCardProps['outcome']): {
  bg: string;
  border: string;
  label: string;
  labelBg: string;
} {
  // Safari-industry semantic outcome colors
  switch (outcome) {
    case 'book':
      return {
        bg: 'bg-outcome-book-bg',
        border: 'border-outcome-book-border',
        label: 'Book',
        labelBg: 'bg-[#2F5D50] text-white',  // outcome.book.base
      };
    case 'wait':
      return {
        bg: 'bg-outcome-wait-bg',
        border: 'border-outcome-wait-border',
        label: 'Wait',
        labelBg: 'bg-[#8C6D2E] text-white',  // outcome.wait.base
      };
    case 'switch':
      return {
        bg: 'bg-outcome-switch-bg',
        border: 'border-outcome-switch-border',
        label: 'Switch',
        labelBg: 'bg-[#3E5C76] text-white',  // outcome.switch.base
      };
    case 'discard':
      return {
        bg: 'bg-outcome-discard-bg',
        border: 'border-outcome-discard-border',
        label: 'Discard',
        labelBg: 'bg-[#8A3F3B] text-white',  // outcome.discard.base
      };
    case 'refused':
      return {
        bg: 'bg-stone-50',
        border: 'border-stone-300',
        label: 'Refused',
        labelBg: 'bg-stone-500 text-white',
      };
  }
}

export function VerdictCard({ outcome, headline, summary, confidence }: VerdictCardProps) {
  const styles = getOutcomeStyles(outcome);
  const confidenceLabel = outcome !== 'refused' ? getConfidenceLabel(confidence) : null;

  return (
    <article
      className={cn(styles.bg, styles.border, 'border rounded-xl p-6 shadow-sm', section)}
      aria-labelledby="verdict-headline"
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className={cn(styles.labelBg, 'px-3 py-1 rounded-lg text-sm font-medium')}
          role="status"
          aria-label={`Decision outcome: ${styles.label}`}
        >
          {styles.label}
        </span>
        {confidenceLabel && (
          <span className="text-sm text-stone-500" aria-label={`Confidence level: ${confidenceLabel}`}>
            Confidence: {confidenceLabel}
          </span>
        )}
      </div>
      <h2 id="verdict-headline" className="font-editorial text-xl font-semibold text-stone-800 mb-3">
        {headline}
      </h2>
      <p className="font-editorial text-stone-600 leading-relaxed">{summary}</p>
    </article>
  );
}
