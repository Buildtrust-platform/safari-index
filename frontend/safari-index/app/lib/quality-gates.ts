/**
 * Decision Quality Gates
 *
 * Per 02_decision_doctrine.md:
 * - Prefer refusal over weak decisions
 * - Every decision must have trade-offs, assumptions, change conditions
 *
 * Per 07_thin_edge_scope.md:
 * - Quality gates prevent authority decay at scale
 *
 * Per 15_ai_output_enforcement.md:
 * - Decisions must meet minimum structural requirements
 */

export interface QualityGateResult {
  passed: boolean;
  failures: string[];
}

export interface DecisionOutput {
  outcome: string;
  headline: string;
  summary: string;
  assumptions: Array<{ id: string; text: string; confidence: number }>;
  tradeoffs: { gains: string[]; losses: string[] };
  change_conditions: string[];
  confidence: number;
}

/**
 * Minimum requirements for a publishable decision
 * Per 02_decision_doctrine.md: no weak decisions
 */
const QUALITY_THRESHOLDS = {
  MIN_TRADEOFFS: 2, // gains + losses combined
  MIN_ASSUMPTIONS: 2,
  MIN_CHANGE_CONDITIONS: 2,
  MIN_CONFIDENCE: 0.3,
  MIN_HEADLINE_LENGTH: 20,
  MIN_SUMMARY_LENGTH: 50,
};

/**
 * Validate a decision meets quality gates
 * Returns failures list - empty means passed
 */
export function validateDecisionQuality(decision: DecisionOutput): QualityGateResult {
  const failures: string[] = [];

  // Gate 1: Verdict must exist and be non-neutral
  if (!decision.outcome) {
    failures.push('MISSING_VERDICT: No outcome specified');
  } else if (!['book', 'wait', 'switch', 'discard'].includes(decision.outcome)) {
    failures.push(`INVALID_VERDICT: "${decision.outcome}" is not a valid outcome`);
  }

  // Gate 2: Trade-offs must exist
  const totalTradeoffs =
    (decision.tradeoffs?.gains?.length || 0) + (decision.tradeoffs?.losses?.length || 0);
  if (totalTradeoffs < QUALITY_THRESHOLDS.MIN_TRADEOFFS) {
    failures.push(
      `INSUFFICIENT_TRADEOFFS: Found ${totalTradeoffs}, need ${QUALITY_THRESHOLDS.MIN_TRADEOFFS}`
    );
  }

  // Gate 3: Assumptions must exist
  const assumptionCount = decision.assumptions?.length || 0;
  if (assumptionCount < QUALITY_THRESHOLDS.MIN_ASSUMPTIONS) {
    failures.push(
      `INSUFFICIENT_ASSUMPTIONS: Found ${assumptionCount}, need ${QUALITY_THRESHOLDS.MIN_ASSUMPTIONS}`
    );
  }

  // Gate 4: Change conditions must exist
  const changeConditionCount = decision.change_conditions?.length || 0;
  if (changeConditionCount < QUALITY_THRESHOLDS.MIN_CHANGE_CONDITIONS) {
    failures.push(
      `INSUFFICIENT_CHANGE_CONDITIONS: Found ${changeConditionCount}, need ${QUALITY_THRESHOLDS.MIN_CHANGE_CONDITIONS}`
    );
  }

  // Gate 5: Confidence must be above minimum
  if (typeof decision.confidence !== 'number' || decision.confidence < QUALITY_THRESHOLDS.MIN_CONFIDENCE) {
    failures.push(
      `LOW_CONFIDENCE: ${decision.confidence || 0} below threshold ${QUALITY_THRESHOLDS.MIN_CONFIDENCE}`
    );
  }

  // Gate 6: Headline must be substantive
  if (!decision.headline || decision.headline.length < QUALITY_THRESHOLDS.MIN_HEADLINE_LENGTH) {
    failures.push(
      `WEAK_HEADLINE: Length ${decision.headline?.length || 0} below ${QUALITY_THRESHOLDS.MIN_HEADLINE_LENGTH}`
    );
  }

  // Gate 7: Summary must be substantive
  if (!decision.summary || decision.summary.length < QUALITY_THRESHOLDS.MIN_SUMMARY_LENGTH) {
    failures.push(
      `WEAK_SUMMARY: Length ${decision.summary?.length || 0} below ${QUALITY_THRESHOLDS.MIN_SUMMARY_LENGTH}`
    );
  }

  return {
    passed: failures.length === 0,
    failures,
  };
}

/**
 * Format quality gate failures for display
 * Per 02_decision_doctrine.md: be clear about why we refuse
 */
export function formatQualityFailures(failures: string[]): string {
  return failures
    .map((f) => {
      const [code, message] = f.split(': ');
      return `${message || code}`;
    })
    .join('. ');
}
