/**
 * Diff Summary Component
 *
 * Renders the Differences section for /compare page.
 * Shows only non-empty categories.
 * Calm and factual - no marketing language.
 *
 * Design System v1 applied:
 * - Text primitives for typography
 * - Surface primitives for containers
 * - Icons for improved scanning
 */

import type { DiffModel, DiffItem, SetDiff } from './compare-diff';
import {
  Heading2,
  Text,
  Meta,
  Section,
  Icon,
  DifferenceIcon,
} from '../components/ui';
import {
  TrendingUp,
  TrendingDown,
  ListChecks,
  RefreshCw,
  UserCheck,
  UserX,
  ArrowLeftRight,
  Scale,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface DiffSummaryProps {
  diff: DiffModel;
  labelA: string;
  labelB: string;
}

/**
 * Renders a single value diff (e.g., outcome or confidence)
 */
function ValueDiffRow({
  item,
  labelA,
  labelB,
  icon,
}: {
  item: DiffItem;
  labelA: string;
  labelB: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-neutral-100 last:border-b-0">
      {icon && (
        <Icon icon={icon} size="md" color="secondary" aria-hidden />
      )}
      <Text variant="label" className="w-24 shrink-0">{item.label}</Text>
      <div className="flex items-center gap-3 flex-1">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 rounded text-sm text-neutral-700">
          <span className="text-neutral-500 text-xs">{labelA}:</span>
          <span className="font-medium">{item.valueA}</span>
        </span>
        <Icon icon={ArrowLeftRight} size="sm" color="muted" aria-hidden />
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 rounded text-sm text-neutral-700">
          <span className="text-neutral-500 text-xs">{labelB}:</span>
          <span className="font-medium">{item.valueB}</span>
        </span>
      </div>
    </div>
  );
}

/**
 * Renders a set diff (items only in A or only in B)
 */
function SetDiffSection({
  title,
  diff,
  labelA,
  labelB,
  maxItems = 3,
  icon,
}: {
  title: string;
  diff: SetDiff;
  labelA: string;
  labelB: string;
  maxItems?: number;
  icon?: LucideIcon;
}) {
  if (diff.onlyInA.length === 0 && diff.onlyInB.length === 0) {
    return null;
  }

  return (
    <div className="py-3 border-b border-neutral-100 last:border-b-0">
      <div className="flex items-center gap-2 mb-3">
        {icon && <Icon icon={icon} size="sm" color="secondary" aria-hidden />}
        <Text variant="label">{title}</Text>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {diff.onlyInA.length > 0 && (
          <div>
            <Meta className="mb-2">Only in {labelA}</Meta>
            <ul className="space-y-1.5">
              {diff.onlyInA.slice(0, maxItems).map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                  <span className="text-neutral-400 shrink-0 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
              {diff.onlyInA.length > maxItems && (
                <li className="text-xs text-neutral-400">
                  +{diff.onlyInA.length - maxItems} more
                </li>
              )}
            </ul>
          </div>
        )}
        {diff.onlyInB.length > 0 && (
          <div>
            <Meta className="mb-2">Only in {labelB}</Meta>
            <ul className="space-y-1.5">
              {diff.onlyInB.slice(0, maxItems).map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                  <span className="text-neutral-400 shrink-0 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
              {diff.onlyInB.length > maxItems && (
                <li className="text-xs text-neutral-400">
                  +{diff.onlyInB.length - maxItems} more
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Main DiffSummary component
 */
export function DiffSummary({ diff, labelA, labelB }: DiffSummaryProps) {
  // No differences - show minimal message
  if (!diff.hasDifferences) {
    return (
      <Section data-testid="diff-summary">
        <div className="flex items-center gap-2 mb-4">
          <Icon icon={DifferenceIcon} size="md" color="secondary" aria-hidden />
          <Heading2>Differences</Heading2>
        </div>
        <div className="p-6 bg-neutral-50 border border-neutral-200 rounded-lg text-center">
          <Text variant="body" color="muted">No meaningful differences detected.</Text>
        </div>
      </Section>
    );
  }

  // Check which set diffs have content
  const hasGains = diff.gains.onlyInA.length > 0 || diff.gains.onlyInB.length > 0;
  const hasLosses = diff.losses.onlyInA.length > 0 || diff.losses.onlyInB.length > 0;
  const hasAssumptions = diff.assumptions.onlyInA.length > 0 || diff.assumptions.onlyInB.length > 0;
  const hasConditions = diff.changeConditions.onlyInA.length > 0 || diff.changeConditions.onlyInB.length > 0;
  const hasFit = diff.fit.onlyInA.length > 0 || diff.fit.onlyInB.length > 0;
  const hasMisfit = diff.misfit.onlyInA.length > 0 || diff.misfit.onlyInB.length > 0;

  return (
    <Section data-testid="diff-summary">
      <div className="flex items-center gap-2 mb-4">
        <Icon icon={DifferenceIcon} size="md" color="secondary" aria-hidden />
        <Heading2>Differences</Heading2>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-5">
          {/* Outcome difference - most prominent */}
          {diff.outcome && (
            <ValueDiffRow
              item={diff.outcome}
              labelA={labelA}
              labelB={labelB}
              icon={Scale}
            />
          )}

          {/* Confidence difference */}
          {diff.confidence && (
            <ValueDiffRow
              item={diff.confidence}
              labelA={labelA}
              labelB={labelB}
            />
          )}

          {/* Trade-offs: gains */}
          {hasGains && (
            <SetDiffSection
              title="Gains"
              diff={diff.gains}
              labelA={labelA}
              labelB={labelB}
              maxItems={3}
              icon={TrendingUp}
            />
          )}

          {/* Trade-offs: losses */}
          {hasLosses && (
            <SetDiffSection
              title="Losses"
              diff={diff.losses}
              labelA={labelA}
              labelB={labelB}
              maxItems={3}
              icon={TrendingDown}
            />
          )}

          {/* Assumptions */}
          {hasAssumptions && (
            <SetDiffSection
              title="Assumptions"
              diff={diff.assumptions}
              labelA={labelA}
              labelB={labelB}
              maxItems={3}
              icon={ListChecks}
            />
          )}

          {/* Change conditions */}
          {hasConditions && (
            <SetDiffSection
              title="Revisit conditions"
              diff={diff.changeConditions}
              labelA={labelA}
              labelB={labelB}
              maxItems={3}
              icon={RefreshCw}
            />
          )}

          {/* Fit */}
          {hasFit && (
            <SetDiffSection
              title="Right for"
              diff={diff.fit}
              labelA={labelA}
              labelB={labelB}
              maxItems={2}
              icon={UserCheck}
            />
          )}

          {/* Misfit */}
          {hasMisfit && (
            <SetDiffSection
              title="Not ideal for"
              diff={diff.misfit}
              labelA={labelA}
              labelB={labelB}
              maxItems={2}
              icon={UserX}
            />
          )}
        </div>
      </div>
    </Section>
  );
}
