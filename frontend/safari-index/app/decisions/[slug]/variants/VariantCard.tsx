/**
 * Variant Card Component
 *
 * Displays a single variant result.
 * Shows: label, outcome, headline, summary, what changed vs base.
 * Handles refusal state using existing refusal UI pattern.
 */

import type { DecisionResponse } from '../../../../lib/contracts';
import type { VariantState } from './variant-types';
import { Skeleton, SkeletonText } from '../../../ui/Skeleton';
import { listContainer, listItem, listBullet, listText } from '../../../ui/styles';
import { cn } from '../../../ui/utils';

interface VariantCardProps {
  label: string;
  state: VariantState;
  response: DecisionResponse | null;
  error: string | null;
  outcomeChanged: boolean;
  changeReason: string | null;
  baseOutcome: string | null;
}

/**
 * Outcome badge styling
 */
function getOutcomeStyles(outcome: string): { bg: string; text: string } {
  switch (outcome) {
    case 'book':
      return { bg: 'bg-green-700', text: 'text-white' };
    case 'wait':
      return { bg: 'bg-yellow-600', text: 'text-white' };
    case 'switch':
      return { bg: 'bg-blue-700', text: 'text-white' };
    case 'discard':
      return { bg: 'bg-gray-600', text: 'text-white' };
    default:
      return { bg: 'bg-gray-500', text: 'text-white' };
  }
}

/**
 * Confidence label
 */
function getConfidenceLabel(confidence: number): string {
  if (confidence >= 0.7) return 'High';
  if (confidence >= 0.4) return 'Medium';
  return 'Low';
}

/**
 * Loading skeleton
 */
function CardSkeleton({ label }: { label: string }) {
  return (
    <div
      className="p-4 border border-gray-200 rounded-lg"
      role="status"
      aria-label="Loading variant"
    >
      <p className="text-sm text-gray-600 mb-3">{label}</p>
      <div className="flex items-center gap-2 mb-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-5 w-3/4 mb-2" />
      <SkeletonText lines={2} />
    </div>
  );
}

/**
 * Error state
 */
function CardError({ label, error }: { label: string; error: string }) {
  return (
    <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
      <p className="text-sm text-gray-600 mb-2">{label}</p>
      <p className="text-sm text-red-700">Error: {error}</p>
    </div>
  );
}

/**
 * Refusal state - uses existing refusal UI pattern
 */
function CardRefusal({
  label,
  refusal,
}: {
  label: string;
  refusal: NonNullable<DecisionResponse['output']['refusal']>;
}) {
  return (
    <div className="p-4 border border-gray-300 bg-gray-50 rounded-lg">
      <p className="text-sm text-gray-600 mb-3">{label}</p>

      <div className="flex items-center gap-2 mb-2">
        <span className="px-2 py-0.5 bg-gray-500 text-white text-xs rounded font-medium">
          Refused
        </span>
      </div>

      <p className="text-sm text-gray-700 mb-3">{refusal.reason}</p>

      <div className="text-xs">
        <p className="font-medium text-gray-600 mb-1">What we need:</p>
        <ul className={listContainer}>
          {refusal.missing_or_conflicting_inputs.slice(0, 2).map((input, i) => (
            <li key={i} className={listItem}>
              <span className={listBullet}>&bull;</span>
              <span className={listText}>{input}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Success state
 */
function CardSuccess({
  label,
  decision,
  outcomeChanged,
  changeReason,
  baseOutcome,
}: {
  label: string;
  decision: NonNullable<DecisionResponse['output']['decision']>;
  outcomeChanged: boolean;
  changeReason: string | null;
  baseOutcome: string | null;
}) {
  const outcomeStyles = getOutcomeStyles(decision.outcome);

  return (
    <div
      className={cn(
        'p-4 border rounded-lg',
        outcomeChanged ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
      )}
    >
      {/* Variant label */}
      <p className="text-sm text-gray-600 mb-3">{label}</p>

      {/* Outcome + confidence */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className={cn(
            outcomeStyles.bg,
            outcomeStyles.text,
            'px-2 py-0.5 text-xs rounded font-medium capitalize'
          )}
        >
          {decision.outcome}
        </span>
        <span className="text-xs text-gray-500">
          Confidence: {getConfidenceLabel(decision.confidence)}
        </span>
        {outcomeChanged && baseOutcome && (
          <span className="text-xs text-blue-700 font-medium">
            (was: {baseOutcome})
          </span>
        )}
      </div>

      {/* Headline */}
      <p className="font-medium text-gray-900 mb-1">{decision.headline}</p>

      {/* Summary (1 paragraph) */}
      <p className="text-sm text-gray-700 mb-3">{decision.summary}</p>

      {/* What changed the outcome */}
      {outcomeChanged && changeReason && (
        <div className="pt-3 border-t border-blue-200">
          <p className="text-xs font-medium text-blue-800 mb-1">
            What changed the outcome:
          </p>
          <p className="text-xs text-blue-700">{changeReason}</p>
        </div>
      )}
    </div>
  );
}

export function VariantCard({
  label,
  state,
  response,
  error,
  outcomeChanged,
  changeReason,
  baseOutcome,
}: VariantCardProps) {
  // Loading
  if (state === 'loading') {
    return <CardSkeleton label={label} />;
  }

  // Error
  if (state === 'error') {
    return <CardError label={label} error={error || 'Unknown error'} />;
  }

  // Refusal
  if (state === 'refusal' && response?.output.refusal) {
    return <CardRefusal label={label} refusal={response.output.refusal} />;
  }

  // Success
  if (state === 'success' && response?.output.decision) {
    return (
      <CardSuccess
        label={label}
        decision={response.output.decision}
        outcomeChanged={outcomeChanged}
        changeReason={changeReason}
        baseOutcome={baseOutcome}
      />
    );
  }

  return null;
}
