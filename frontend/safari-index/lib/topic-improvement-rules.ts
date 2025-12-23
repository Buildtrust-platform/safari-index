/**
 * Topic Improvement Rules Engine
 *
 * Deterministic rules for suggesting topic improvements based on health metrics.
 * No AI - pure rule-based logic.
 *
 * Used by /dev/topic-improvements (staging only).
 */

import type { DecisionTopic, TopicInput } from '../app/content/decision-topics';

/**
 * Improvement suggestion
 */
export interface ImprovementSuggestion {
  rule_id: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  field: 'required_inputs' | 'optional_inputs' | 'variant_defaults' | 'topic_note';
  suggested_additions?: TopicInput[];
  suggested_changes?: Record<string, unknown>;
}

/**
 * Topic improvement analysis result
 */
export interface TopicImprovementAnalysis {
  topic_id: string;
  refusal_rate: number | null;
  suggestions: ImprovementSuggestion[];
}

/**
 * Patch export format
 */
export interface TopicPatch {
  topic_id: string;
  suggested_required_inputs_additions: TopicInput[];
  suggested_optional_inputs_additions: TopicInput[];
  suggested_variant_default_changes: Record<string, unknown>;
}

/**
 * Common input suggestions for missing material inputs
 */
const MATERIAL_INPUT_SUGGESTIONS: TopicInput[] = [
  { key: 'user_context.dates.month', label: 'Travel month', example: 'July' },
  { key: 'user_context.dates.year', label: 'Travel year', example: '2026' },
  { key: 'user_context.budget_band', label: 'Budget tier', example: 'fair_value' },
  { key: 'user_context.traveler_type', label: 'Traveler type', example: 'first_time' },
  { key: 'user_context.group_size', label: 'Group size', example: '2' },
];

/**
 * Bounds input suggestions for conflict resolution
 */
const BOUNDS_INPUT_SUGGESTIONS: TopicInput[] = [
  { key: 'user_context.dates.start', label: 'Earliest travel date', example: '2026-06-01' },
  { key: 'user_context.dates.end', label: 'Latest travel date', example: '2026-08-31' },
  { key: 'request.constraints.min_days', label: 'Minimum trip days', example: '5' },
  { key: 'request.constraints.max_days', label: 'Maximum trip days', example: '14' },
  { key: 'request.constraints.budget_min', label: 'Budget minimum', example: '3000' },
  { key: 'request.constraints.budget_max', label: 'Budget maximum', example: '8000' },
];

/**
 * Rule: High refusal rate (> 50%)
 */
function ruleHighRefusalRate(
  topic: DecisionTopic,
  refusalRate: number | null
): ImprovementSuggestion | null {
  if (refusalRate === null || refusalRate <= 0.5) return null;

  const currentCount = topic.required_inputs?.length || 0;
  const missingInputs = MATERIAL_INPUT_SUGGESTIONS.filter(
    (s) => !topic.required_inputs?.some((r) => r.key === s.key)
  ).slice(0, 2);

  return {
    rule_id: 'high_refusal_rate',
    severity: 'high',
    message: `Refusal rate ${Math.round(refusalRate * 100)}% exceeds 50%. Add more required_inputs examples to improve input completeness.`,
    field: 'required_inputs',
    suggested_additions: missingInputs.length > 0 ? missingInputs : [
      { key: 'user_context.risk_tolerance', label: 'Risk tolerance', example: 'medium' },
      { key: 'user_context.pace_preference', label: 'Pace preference', example: 'balanced' },
    ],
  };
}

/**
 * Rule: Watch-level refusal rate (30-50%)
 */
function ruleWatchRefusalRate(
  topic: DecisionTopic,
  refusalRate: number | null
): ImprovementSuggestion | null {
  if (refusalRate === null || refusalRate <= 0.3 || refusalRate > 0.5) return null;

  return {
    rule_id: 'watch_refusal_rate',
    severity: 'medium',
    message: `Refusal rate ${Math.round(refusalRate * 100)}% is elevated (30-50%). Consider adding optional_inputs for edge cases.`,
    field: 'optional_inputs',
    suggested_additions: [
      { key: 'request.constraints.flexibility', label: 'Date flexibility', example: 'flexible' },
    ],
  };
}

/**
 * Rule: Missing material inputs detected
 */
function ruleMissingMaterialInputs(
  topic: DecisionTopic,
  refusalReasons: string[]
): ImprovementSuggestion | null {
  const hasMissingMaterial = refusalReasons.some(
    (r) => r.toLowerCase().includes('missing_material_inputs') ||
           r.toLowerCase().includes('missing material')
  );

  if (!hasMissingMaterial) return null;

  const existingKeys = new Set(topic.required_inputs?.map((i) => i.key) || []);
  const suggestions = MATERIAL_INPUT_SUGGESTIONS.filter((s) => !existingKeys.has(s.key));

  return {
    rule_id: 'missing_material_inputs',
    severity: 'high',
    message: 'Refusals due to missing material inputs. Tighten required_inputs list with explicit examples.',
    field: 'required_inputs',
    suggested_additions: suggestions.slice(0, 3),
  };
}

/**
 * Rule: Input conflicts detected
 */
function ruleInputConflicts(
  topic: DecisionTopic,
  refusalReasons: string[]
): ImprovementSuggestion | null {
  const hasConflict = refusalReasons.some(
    (r) => r.toLowerCase().includes('inputs_conflict') ||
           r.toLowerCase().includes('conflict')
  );

  if (!hasConflict) return null;

  const existingKeys = new Set([
    ...(topic.required_inputs?.map((i) => i.key) || []),
    ...(topic.optional_inputs?.map((i) => i.key) || []),
  ]);
  const suggestions = BOUNDS_INPUT_SUGGESTIONS.filter((s) => !existingKeys.has(s.key));

  return {
    rule_id: 'inputs_conflict_unbounded',
    severity: 'high',
    message: 'Refusals due to unbounded/conflicting inputs. Add bounds examples (date range, budget range, days).',
    field: 'optional_inputs',
    suggested_additions: suggestions.slice(0, 4),
  };
}

/**
 * Rule: Guarantee request detected
 */
function ruleGuaranteeRequest(
  topic: DecisionTopic,
  refusalReasons: string[]
): ImprovementSuggestion | null {
  const hasGuarantee = refusalReasons.some(
    (r) => r.toLowerCase().includes('guarantee')
  );

  if (!hasGuarantee) return null;

  return {
    rule_id: 'guarantee_request',
    severity: 'medium',
    message: 'Refusals due to guarantee requests. Add dev-only note: "Guarantees not possible for this topic."',
    field: 'topic_note',
    suggested_changes: {
      dev_note: 'Guarantees not possible - topic involves inherent uncertainty.',
    },
  };
}

/**
 * Rule: Insufficient required inputs
 */
function ruleInsufficientRequiredInputs(
  topic: DecisionTopic,
  _refusalRate: number | null
): ImprovementSuggestion | null {
  const count = topic.required_inputs?.length || 0;

  if (count >= 3) return null;

  const existingKeys = new Set(topic.required_inputs?.map((i) => i.key) || []);
  const suggestions = MATERIAL_INPUT_SUGGESTIONS.filter((s) => !existingKeys.has(s.key));

  return {
    rule_id: 'insufficient_required_inputs',
    severity: 'medium',
    message: `Only ${count} required_inputs defined. Recommend at least 3 for reliable decisions.`,
    field: 'required_inputs',
    suggested_additions: suggestions.slice(0, 3 - count),
  };
}

/**
 * Rule: No optional inputs defined
 */
function ruleNoOptionalInputs(
  topic: DecisionTopic,
  _refusalRate: number | null
): ImprovementSuggestion | null {
  const count = topic.optional_inputs?.length || 0;

  if (count > 0) return null;

  return {
    rule_id: 'no_optional_inputs',
    severity: 'low',
    message: 'No optional_inputs defined. Consider adding for variant exploration.',
    field: 'optional_inputs',
    suggested_additions: [
      { key: 'user_context.risk_tolerance', label: 'Risk tolerance', example: 'medium' },
      { key: 'request.constraints.flexibility', label: 'Flexibility', example: 'flexible' },
    ],
  };
}

/**
 * Rule: Missing date context for time-sensitive topic
 */
function ruleMissingDateContext(
  topic: DecisionTopic,
  _refusalRate: number | null
): ImprovementSuggestion | null {
  // Only applies to topics with time_context
  if (!topic.time_context?.month && !topic.time_context?.season) return null;

  const hasDateInput = topic.required_inputs?.some(
    (i) => i.key.includes('dates') || i.key.includes('month')
  );

  if (hasDateInput) return null;

  return {
    rule_id: 'missing_date_context',
    severity: 'medium',
    message: 'Topic has time_context but no date-related required_input. Add date input for consistency.',
    field: 'required_inputs',
    suggested_additions: [
      { key: 'user_context.dates.month', label: 'Travel month', example: topic.time_context?.month || 'July' },
    ],
  };
}

/**
 * Rule: High refusal with no variant defaults
 */
function ruleNoVariantDefaults(
  topic: DecisionTopic,
  refusalRate: number | null
): ImprovementSuggestion | null {
  // Only suggest if refusal rate is concerning
  if (refusalRate === null || refusalRate < 0.3) return null;

  return {
    rule_id: 'suggest_variant_defaults',
    severity: 'low',
    message: 'Consider adding variant_defaults to provide fallback values for missing inputs.',
    field: 'variant_defaults',
    suggested_changes: {
      budget_band: 'fair_value',
      group_size: 2,
      traveler_type: 'first_time',
      risk_tolerance: 'medium',
    },
  };
}

/**
 * Rule: Missing destination input for multi-destination topic
 */
function ruleMissingDestinationInput(
  topic: DecisionTopic,
  _refusalRate: number | null
): ImprovementSuggestion | null {
  if (topic.destinations.length <= 1) return null;

  const hasDestinationInput = topic.required_inputs?.some(
    (i) => i.key.includes('destination')
  );

  if (hasDestinationInput) return null;

  return {
    rule_id: 'missing_destination_input',
    severity: 'medium',
    message: `Topic covers ${topic.destinations.length} destinations but lacks destination input.`,
    field: 'required_inputs',
    suggested_additions: [
      {
        key: 'request.destinations_considered',
        label: 'Destinations',
        example: JSON.stringify(topic.destinations.slice(0, 2)),
      },
    ],
  };
}

/**
 * Analyze a topic and generate improvement suggestions
 */
export function analyzeTopicForImprovements(
  topic: DecisionTopic,
  refusalRate: number | null,
  refusalReasons: string[]
): TopicImprovementAnalysis {
  const suggestions: ImprovementSuggestion[] = [];

  // Apply all rules
  const rules = [
    () => ruleHighRefusalRate(topic, refusalRate),
    () => ruleWatchRefusalRate(topic, refusalRate),
    () => ruleMissingMaterialInputs(topic, refusalReasons),
    () => ruleInputConflicts(topic, refusalReasons),
    () => ruleGuaranteeRequest(topic, refusalReasons),
    () => ruleInsufficientRequiredInputs(topic, refusalRate),
    () => ruleNoOptionalInputs(topic, refusalRate),
    () => ruleMissingDateContext(topic, refusalRate),
    () => ruleNoVariantDefaults(topic, refusalRate),
    () => ruleMissingDestinationInput(topic, refusalRate),
  ];

  for (const rule of rules) {
    const result = rule();
    if (result) {
      suggestions.push(result);
    }
  }

  // Sort by severity
  const severityOrder = { high: 0, medium: 1, low: 2 };
  suggestions.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return {
    topic_id: topic.topic_id,
    refusal_rate: refusalRate,
    suggestions,
  };
}

/**
 * Generate a patch export for a topic
 */
export function generateTopicPatch(analysis: TopicImprovementAnalysis): TopicPatch {
  const requiredAdditions: TopicInput[] = [];
  const optionalAdditions: TopicInput[] = [];
  const variantChanges: Record<string, unknown> = {};

  for (const suggestion of analysis.suggestions) {
    if (suggestion.field === 'required_inputs' && suggestion.suggested_additions) {
      requiredAdditions.push(...suggestion.suggested_additions);
    } else if (suggestion.field === 'optional_inputs' && suggestion.suggested_additions) {
      optionalAdditions.push(...suggestion.suggested_additions);
    } else if (suggestion.field === 'variant_defaults' && suggestion.suggested_changes) {
      Object.assign(variantChanges, suggestion.suggested_changes);
    }
  }

  // Deduplicate by key
  const uniqueRequired = deduplicateByKey(requiredAdditions);
  const uniqueOptional = deduplicateByKey(optionalAdditions);

  return {
    topic_id: analysis.topic_id,
    suggested_required_inputs_additions: uniqueRequired,
    suggested_optional_inputs_additions: uniqueOptional,
    suggested_variant_default_changes: variantChanges,
  };
}

/**
 * Deduplicate TopicInput array by key
 */
function deduplicateByKey(inputs: TopicInput[]): TopicInput[] {
  const seen = new Set<string>();
  return inputs.filter((input) => {
    if (seen.has(input.key)) return false;
    seen.add(input.key);
    return true;
  });
}

/**
 * Get severity badge styling
 */
export const SEVERITY_STYLES: Record<string, { bg: string; text: string }> = {
  high: { bg: 'bg-red-100', text: 'text-red-800' },
  medium: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  low: { bg: 'bg-blue-100', text: 'text-blue-800' },
};
