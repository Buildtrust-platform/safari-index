/**
 * Refusal Recovery Mapping
 *
 * Pure functions for mapping refusal reasons to missing inputs.
 * Used by RefusalRecoveryPanel (staging only).
 *
 * Mapping is conservative - unknown reasons fall back to topic.required_inputs.
 */

import type { DecisionTopic, TopicInput } from '../app/content/decision-topics';

/**
 * Missing input for recovery panel
 */
export interface MissingInput {
  key: string;
  label: string;
  example: string;
}

/**
 * Known refusal reason to missing fields mapping
 * Conservative: only map reasons we understand
 */
const REASON_TO_FIELDS: Record<string, string[]> = {
  // Missing material inputs - need core user context
  missing_material_inputs: [
    'user_context.dates.month',
    'user_context.traveler_type',
    'user_context.budget_band',
  ],
  'Missing material inputs': [
    'user_context.dates.month',
    'user_context.traveler_type',
    'user_context.budget_band',
  ],

  // Conflicting inputs - budget/comfort mismatch
  inputs_conflict_unbounded: [
    'user_context.budget_band',
    'request.constraints.comfort_level',
  ],
  'Conflicting inputs': [
    'user_context.budget_band',
    'request.constraints.comfort_level',
  ],

  // Missing dates
  'Missing travel dates': [
    'user_context.dates.month',
    'user_context.dates.year',
  ],
  missing_dates: [
    'user_context.dates.month',
    'user_context.dates.year',
  ],

  // Missing destination
  'Missing destination': [
    'request.destinations_considered',
  ],
  missing_destination: [
    'request.destinations_considered',
  ],

  // Missing group size
  'Missing group size': [
    'user_context.group_size',
  ],
  missing_group_size: [
    'user_context.group_size',
  ],

  // Missing budget
  'Missing budget information': [
    'user_context.budget_band',
  ],
  missing_budget: [
    'user_context.budget_band',
  ],
};

/**
 * Default example values for common fields
 * Used when topic doesn't provide examples
 */
const DEFAULT_EXAMPLES: Record<string, string> = {
  'user_context.dates.month': 'July',
  'user_context.dates.year': '2026',
  'user_context.traveler_type': 'first_time',
  'user_context.budget_band': 'fair_value',
  'user_context.group_size': '2',
  'user_context.risk_tolerance': 'medium',
  'user_context.pace_preference': 'balanced',
  'request.destinations_considered': '["Tanzania"]',
  'request.constraints.comfort_level': 'standard',
  'request.constraints.crowd_tolerance': 'medium',
};

/**
 * Default labels for common fields
 */
const DEFAULT_LABELS: Record<string, string> = {
  'user_context.dates.month': 'Travel month',
  'user_context.dates.year': 'Travel year',
  'user_context.traveler_type': 'Traveler type',
  'user_context.budget_band': 'Budget tier',
  'user_context.group_size': 'Group size',
  'user_context.risk_tolerance': 'Risk tolerance',
  'user_context.pace_preference': 'Pace preference',
  'request.destinations_considered': 'Destinations',
  'request.constraints.comfort_level': 'Comfort level',
  'request.constraints.crowd_tolerance': 'Crowd tolerance',
};

/**
 * Get missing inputs from refusal reason
 * Falls back to topic.required_inputs if reason is unknown
 */
export function getMissingInputs(
  reason: string | undefined,
  topic: DecisionTopic
): MissingInput[] {
  // Try to map reason to fields
  const fieldsFromReason = reason ? REASON_TO_FIELDS[reason] : undefined;

  if (fieldsFromReason && fieldsFromReason.length > 0) {
    return fieldsFromReason.map((key) => ({
      key,
      label: findLabel(key, topic),
      example: findExample(key, topic),
    }));
  }

  // Fallback: use topic.required_inputs
  if (topic.required_inputs && topic.required_inputs.length > 0) {
    return topic.required_inputs.slice(0, 7).map((input) => ({
      key: input.key,
      label: input.label,
      example: input.example,
    }));
  }

  // Last resort: return minimal set of common inputs
  return [
    { key: 'user_context.dates.month', label: 'Travel month', example: 'July' },
    { key: 'user_context.budget_band', label: 'Budget tier', example: 'fair_value' },
    { key: 'user_context.group_size', label: 'Group size', example: '2' },
  ];
}

/**
 * Find label for a field key
 */
function findLabel(key: string, topic: DecisionTopic): string {
  // Check topic required_inputs
  const fromRequired = topic.required_inputs?.find((i) => i.key === key);
  if (fromRequired) return fromRequired.label;

  // Check topic optional_inputs
  const fromOptional = topic.optional_inputs?.find((i) => i.key === key);
  if (fromOptional) return fromOptional.label;

  // Fall back to default
  return DEFAULT_LABELS[key] || key.split('.').pop() || key;
}

/**
 * Find example for a field key
 */
function findExample(key: string, topic: DecisionTopic): string {
  // Check topic required_inputs
  const fromRequired = topic.required_inputs?.find((i) => i.key === key);
  if (fromRequired) return fromRequired.example;

  // Check topic optional_inputs
  const fromOptional = topic.optional_inputs?.find((i) => i.key === key);
  if (fromOptional) return fromOptional.example;

  // Fall back to default
  return DEFAULT_EXAMPLES[key] || 'unknown';
}

/**
 * Build example JSON snippet compatible with StandardInputEnvelope
 * Only includes the missing fields, not the full envelope
 */
export function buildExampleSnippet(inputs: MissingInput[]): string {
  const snippet: Record<string, unknown> = {};

  for (const input of inputs) {
    setNestedValue(snippet, input.key, parseExampleValue(input.example));
  }

  return JSON.stringify(snippet, null, 2);
}

/**
 * Set a nested value in an object using dot notation
 */
function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split('.');
  let current = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!(part in current)) {
      current[part] = {};
    }
    current = current[part] as Record<string, unknown>;
  }

  current[parts[parts.length - 1]] = value;
}

/**
 * Parse example value string to appropriate type
 */
function parseExampleValue(example: string): unknown {
  // Try to parse as JSON (for arrays, objects, numbers, booleans)
  try {
    return JSON.parse(example);
  } catch {
    // Return as string if not valid JSON
    return example;
  }
}

/**
 * Check if a refusal reason is known/mapped
 */
export function isKnownRefusalReason(reason: string | undefined): boolean {
  if (!reason) return false;
  return reason in REASON_TO_FIELDS;
}
