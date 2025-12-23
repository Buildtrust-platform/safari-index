/**
 * Compare Diff Logic
 *
 * Pure functions for computing structured diffs between two decisions.
 * Used by the Differences section in /compare (staging only).
 *
 * Normalization: lowercase, trim, collapse whitespace.
 * No fuzzy matching, no external dependencies.
 */

import type { DecisionResponse, Outcome } from '../../lib/contracts';
import type { DecisionTopic } from '../content/decision-topics';
import { deriveFitMisfitModel } from '../../lib/page-assembly';

/**
 * Individual diff item
 */
export interface DiffItem {
  label: string;
  valueA: string | null;
  valueB: string | null;
}

/**
 * Diff for a category with only-in-A and only-in-B items
 */
export interface SetDiff {
  onlyInA: string[];
  onlyInB: string[];
}

/**
 * Complete diff model between two decisions
 */
export interface DiffModel {
  /** Outcome differs (book/wait/switch/discard) */
  outcome: DiffItem | null;

  /** Confidence differs by >= 10% */
  confidence: DiffItem | null;

  /** Gains present in one but not the other */
  gains: SetDiff;

  /** Losses present in one but not the other */
  losses: SetDiff;

  /** Assumptions that differ */
  assumptions: SetDiff;

  /** Change conditions that differ */
  changeConditions: SetDiff;

  /** Fit (rightFor) differences */
  fit: SetDiff;

  /** Misfit (notIdealFor) differences */
  misfit: SetDiff;

  /** True if there are any meaningful differences */
  hasDifferences: boolean;
}

/**
 * Normalize a string for comparison:
 * - lowercase
 * - trim
 * - collapse whitespace
 */
export function normalize(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Compare two string arrays and return items unique to each
 */
export function diffStringArrays(arrA: string[], arrB: string[]): SetDiff {
  const normalizedA = arrA.map(normalize);
  const normalizedB = arrB.map(normalize);

  const setB = new Set(normalizedB);
  const setA = new Set(normalizedA);

  // Items in A but not in B (use original strings, not normalized)
  const onlyInA = arrA.filter((_, i) => !setB.has(normalizedA[i]));

  // Items in B but not in A
  const onlyInB = arrB.filter((_, i) => !setA.has(normalizedB[i]));

  return { onlyInA, onlyInB };
}

/**
 * Check if a SetDiff has any differences
 */
function hasSetDiff(diff: SetDiff): boolean {
  return diff.onlyInA.length > 0 || diff.onlyInB.length > 0;
}

/**
 * Format confidence as percentage string
 */
function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}

/**
 * Compute structured diff between two decision responses.
 *
 * @param responseA - First decision response
 * @param responseB - Second decision response
 * @param topicA - Topic for decision A (for fit/misfit derivation)
 * @param topicB - Topic for decision B (for fit/misfit derivation)
 * @returns DiffModel with differences per category
 */
export function computeDiff(
  responseA: DecisionResponse,
  responseB: DecisionResponse,
  topicA: DecisionTopic,
  topicB: DecisionTopic
): DiffModel {
  const decisionA = responseA.output.decision;
  const decisionB = responseB.output.decision;

  // Handle cases where one or both are refusals
  if (!decisionA || !decisionB) {
    return {
      outcome: null,
      confidence: null,
      gains: { onlyInA: [], onlyInB: [] },
      losses: { onlyInA: [], onlyInB: [] },
      assumptions: { onlyInA: [], onlyInB: [] },
      changeConditions: { onlyInA: [], onlyInB: [] },
      fit: { onlyInA: [], onlyInB: [] },
      misfit: { onlyInA: [], onlyInB: [] },
      hasDifferences: false,
    };
  }

  // 1. Outcome difference
  let outcomeDiff: DiffItem | null = null;
  if (decisionA.outcome !== decisionB.outcome) {
    outcomeDiff = {
      label: 'Outcome',
      valueA: decisionA.outcome,
      valueB: decisionB.outcome,
    };
  }

  // 2. Confidence difference (only if delta >= 10%)
  let confidenceDiff: DiffItem | null = null;
  const confidenceDelta = Math.abs(decisionA.confidence - decisionB.confidence);
  if (confidenceDelta >= 0.1) {
    confidenceDiff = {
      label: 'Confidence',
      valueA: formatConfidence(decisionA.confidence),
      valueB: formatConfidence(decisionB.confidence),
    };
  }

  // 3. Trade-offs: gains (top 3)
  const gainsA = decisionA.tradeoffs.gains.slice(0, 3);
  const gainsB = decisionB.tradeoffs.gains.slice(0, 3);
  const gainsDiff = diffStringArrays(gainsA, gainsB);

  // 4. Trade-offs: losses (top 3)
  const lossesA = decisionA.tradeoffs.losses.slice(0, 3);
  const lossesB = decisionB.tradeoffs.losses.slice(0, 3);
  const lossesDiff = diffStringArrays(lossesA, lossesB);

  // 5. Assumptions (top 3)
  const assumptionsA = decisionA.assumptions.slice(0, 3).map((a) => a.text);
  const assumptionsB = decisionB.assumptions.slice(0, 3).map((a) => a.text);
  const assumptionsDiff = diffStringArrays(assumptionsA, assumptionsB);

  // 6. Change conditions (top 3)
  const conditionsA = decisionA.change_conditions.slice(0, 3);
  const conditionsB = decisionB.change_conditions.slice(0, 3);
  const conditionsDiff = diffStringArrays(conditionsA, conditionsB);

  // 7. Fit/Misfit (top 2 each)
  const fitMisfitA = deriveFitMisfitModel(topicA, decisionA.outcome);
  const fitMisfitB = deriveFitMisfitModel(topicB, decisionB.outcome);

  const fitDiff = diffStringArrays(
    fitMisfitA.rightFor.slice(0, 2),
    fitMisfitB.rightFor.slice(0, 2)
  );

  const misfitDiff = diffStringArrays(
    fitMisfitA.notIdealFor.slice(0, 2),
    fitMisfitB.notIdealFor.slice(0, 2)
  );

  // Determine if there are any differences
  const hasDifferences =
    outcomeDiff !== null ||
    confidenceDiff !== null ||
    hasSetDiff(gainsDiff) ||
    hasSetDiff(lossesDiff) ||
    hasSetDiff(assumptionsDiff) ||
    hasSetDiff(conditionsDiff) ||
    hasSetDiff(fitDiff) ||
    hasSetDiff(misfitDiff);

  return {
    outcome: outcomeDiff,
    confidence: confidenceDiff,
    gains: gainsDiff,
    losses: lossesDiff,
    assumptions: assumptionsDiff,
    changeConditions: conditionsDiff,
    fit: fitDiff,
    misfit: misfitDiff,
    hasDifferences,
  };
}
