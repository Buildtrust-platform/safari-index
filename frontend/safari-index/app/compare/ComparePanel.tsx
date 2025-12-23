/**
 * Compare Panel Component
 *
 * Renders a single decision panel for side-by-side comparison.
 * Shows: Question, Verdict, Headline, Summary, Fit/Misfit, Top 3 Trade-offs,
 * Change Conditions, Assumptions.
 *
 * Handles refusal state as-is (no copy changes).
 */

import type { DecisionResponse } from '../../lib/contracts';
import type { DecisionTopic } from '../content/decision-topics';
import type { PanelState } from './compare-types';
import { deriveFitMisfitModel } from '../../lib/page-assembly';
import { Skeleton, SkeletonText } from '../ui/Skeleton';
import {
  listContainer,
  listItem,
  listBullet,
  listText,
  errorContainer,
} from '../ui/styles';
import { cn } from '../ui/utils';

interface ComparePanelProps {
  topic: DecisionTopic | null;
  state: PanelState;
  response: DecisionResponse | null;
  error: string | null;
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
 * Skeleton for loading state
 */
function PanelSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading decision">
      <span className="sr-only">Loading...</span>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="p-4 bg-gray-50 rounded border border-gray-200">
        <Skeleton className="h-6 w-20 mb-3" />
        <Skeleton className="h-5 w-2/3 mb-2" />
        <SkeletonText lines={2} />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <SkeletonText lines={3} />
      </div>
    </div>
  );
}

/**
 * Idle state - no topic selected
 */
function PanelIdle() {
  return (
    <div className="flex items-center justify-center h-64 text-gray-400 border border-dashed border-gray-300 rounded">
      <p>Select a decision above</p>
    </div>
  );
}

/**
 * Error state
 */
function PanelError({ error, question }: { error: string; question: string }) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{question}</h3>
      <div className={errorContainer} role="alert">
        <p className="text-gray-700 mb-1">Unable to retrieve decision.</p>
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    </div>
  );
}

/**
 * Refusal state - shown as-is per task requirements
 */
function PanelRefusal({
  topic,
  refusal,
}: {
  topic: DecisionTopic;
  refusal: NonNullable<DecisionResponse['output']['refusal']>;
}) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{topic.question}</h3>
      <p className="text-sm text-gray-600 mb-4">{topic.context_line}</p>

      {/* Verdict */}
      <div className="p-4 bg-gray-50 border border-gray-300 rounded mb-4">
        <span className="inline-block px-2 py-0.5 bg-gray-500 text-white text-sm rounded mb-2">
          Refused
        </span>
        <p className="text-gray-700">{refusal.reason}</p>
      </div>

      {/* What we need */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">What we need</h4>
        <ul className={listContainer}>
          {refusal.missing_or_conflicting_inputs.map((input, i) => (
            <li key={i} className={listItem}>
              <span className={listBullet}>&bull;</span>
              <span className={listText}>{input}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Next step */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Next step</h4>
        <p className="text-sm text-gray-600">{refusal.safe_next_step}</p>
      </div>
    </div>
  );
}

/**
 * Success state - full decision panel
 */
function PanelSuccess({
  topic,
  decision,
}: {
  topic: DecisionTopic;
  decision: NonNullable<DecisionResponse['output']['decision']>;
}) {
  const fitMisfit = deriveFitMisfitModel(topic, decision.outcome);
  const outcomeStyles = getOutcomeStyles(decision.outcome);

  // Top 3 trade-offs (or all if fewer)
  const gains = decision.tradeoffs.gains.slice(0, 3);
  const losses = decision.tradeoffs.losses.slice(0, 3);

  return (
    <div>
      {/* Question + context */}
      <h3 className="text-lg font-medium text-gray-900 mb-1">{topic.question}</h3>
      <p className="text-sm text-gray-600 mb-4">{topic.context_line}</p>

      {/* Verdict card */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded mb-4">
        <div className="flex items-center justify-between mb-2">
          <span
            className={cn(
              outcomeStyles.bg,
              outcomeStyles.text,
              'px-2 py-0.5 text-sm rounded font-medium capitalize'
            )}
          >
            {decision.outcome}
          </span>
          <span className="text-xs text-gray-500">
            Confidence: {getConfidenceLabel(decision.confidence)}
          </span>
        </div>
        <p className="font-medium text-gray-900 mb-1">{decision.headline}</p>
        <p className="text-sm text-gray-700">{decision.summary}</p>
      </div>

      {/* Fit/Misfit - compact */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Fit</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-500 mb-1">Right for</p>
            <ul className="space-y-1">
              {fitMisfit.rightFor.slice(0, 2).map((item, i) => (
                <li key={i} className="text-gray-600">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Not ideal for</p>
            <ul className="space-y-1">
              {fitMisfit.notIdealFor.slice(0, 2).map((item, i) => (
                <li key={i} className="text-gray-600">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Trade-offs - top 3 */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Trade-offs</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-green-700 mb-1">Gains</p>
            <ul className="space-y-1">
              {gains.map((g, i) => (
                <li key={i} className="text-gray-600 flex items-start gap-1">
                  <span className="text-green-600 shrink-0">+</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs text-red-700 mb-1">Losses</p>
            <ul className="space-y-1">
              {losses.map((l, i) => (
                <li key={i} className="text-gray-600 flex items-start gap-1">
                  <span className="text-red-600 shrink-0">-</span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Change conditions */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Revisit if</h4>
        <ul className="text-sm space-y-1">
          {decision.change_conditions.slice(0, 3).map((c, i) => (
            <li key={i} className="text-gray-600">
              {c}
            </li>
          ))}
        </ul>
      </div>

      {/* Assumptions */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Assumptions</h4>
        <ul className="text-sm space-y-1">
          {decision.assumptions.slice(0, 3).map((a, i) => (
            <li key={i} className="text-gray-600">
              {a.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ComparePanel({ topic, state, response, error }: ComparePanelProps) {
  // Idle - no topic selected
  if (state === 'idle' || !topic) {
    return <PanelIdle />;
  }

  // Loading
  if (state === 'loading') {
    return <PanelSkeleton />;
  }

  // Error
  if (state === 'error') {
    return <PanelError error={error || 'Unknown error'} question={topic.question} />;
  }

  // Refusal
  if (state === 'refusal' && response?.output.refusal) {
    return <PanelRefusal topic={topic} refusal={response.output.refusal} />;
  }

  // Success
  if (state === 'success' && response?.output.decision) {
    return <PanelSuccess topic={topic} decision={response.output.decision} />;
  }

  return null;
}
