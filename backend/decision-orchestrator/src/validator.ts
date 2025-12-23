/**
 * Safari Index Input Validator
 * Validates inputs against the Standard Input Envelope schema
 * Aligned with: 12_ai_prompts.md section 2
 */

import {
  StandardInputEnvelope,
  ValidationResult,
  ValidationError,
  TaskType,
  TravelerType,
  BudgetBand,
  PacePreference,
  RiskTolerance,
  DateType,
} from './types';

const VALID_TASKS: TaskType[] = [
  'DECISION',
  'REFUSAL',
  'REVISION',
  'TRADEOFF_EXPLANATION',
  'CLARIFICATION',
];

const VALID_TRAVELER_TYPES: TravelerType[] = [
  'first_time',
  'repeat',
  'family',
  'honeymoon',
  'photographer',
  'unknown',
];

const VALID_BUDGET_BANDS: BudgetBand[] = [
  'budget',
  'fair_value',
  'premium',
  'unknown',
];

const VALID_PACE_PREFERENCES: PacePreference[] = [
  'slow',
  'balanced',
  'fast',
  'unknown',
];

const VALID_RISK_TOLERANCES: RiskTolerance[] = [
  'low',
  'medium',
  'high',
  'unknown',
];

const VALID_DATE_TYPES: DateType[] = [
  'fixed_dates',
  'month_year',
  'flexible',
  'unknown',
];

/**
 * Validates the Standard Input Envelope
 * Returns validation result with specific errors
 */
export function validateInput(input: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!input || typeof input !== 'object') {
    return {
      valid: false,
      errors: [{ field: 'root', message: 'Input must be a valid object' }],
    };
  }

  const envelope = input as Partial<StandardInputEnvelope>;

  // Validate task type (required)
  if (!envelope.task) {
    errors.push({ field: 'task', message: 'Task type is required' });
  } else if (!VALID_TASKS.includes(envelope.task)) {
    errors.push({
      field: 'task',
      message: `Invalid task type. Must be one of: ${VALID_TASKS.join(', ')}`,
    });
  }

  // Validate user_context (required)
  if (!envelope.user_context) {
    errors.push({ field: 'user_context', message: 'User context is required' });
  } else {
    validateUserContext(envelope.user_context, errors);
  }

  // Validate request (required)
  if (!envelope.request) {
    errors.push({ field: 'request', message: 'Request is required' });
  } else {
    validateRequest(envelope.request, errors);
  }

  // Validate facts (required but can have empty arrays)
  if (!envelope.facts) {
    errors.push({ field: 'facts', message: 'Facts object is required' });
  } else {
    validateFacts(envelope.facts, errors);
  }

  // Validate policy (required)
  if (!envelope.policy) {
    errors.push({ field: 'policy', message: 'Policy object is required' });
  } else {
    validatePolicy(envelope.policy, errors);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function validateUserContext(
  context: Partial<StandardInputEnvelope['user_context']>,
  errors: ValidationError[]
): void {
  // Validate traveler_type
  if (!context.traveler_type) {
    errors.push({
      field: 'user_context.traveler_type',
      message: 'Traveler type is required',
    });
  } else if (!VALID_TRAVELER_TYPES.includes(context.traveler_type)) {
    errors.push({
      field: 'user_context.traveler_type',
      message: `Invalid traveler type. Must be one of: ${VALID_TRAVELER_TYPES.join(', ')}`,
    });
  }

  // Validate budget_band
  if (!context.budget_band) {
    errors.push({
      field: 'user_context.budget_band',
      message: 'Budget band is required',
    });
  } else if (!VALID_BUDGET_BANDS.includes(context.budget_band)) {
    errors.push({
      field: 'user_context.budget_band',
      message: `Invalid budget band. Must be one of: ${VALID_BUDGET_BANDS.join(', ')}`,
    });
  }

  // Validate pace_preference
  if (!context.pace_preference) {
    errors.push({
      field: 'user_context.pace_preference',
      message: 'Pace preference is required',
    });
  } else if (!VALID_PACE_PREFERENCES.includes(context.pace_preference)) {
    errors.push({
      field: 'user_context.pace_preference',
      message: `Invalid pace preference. Must be one of: ${VALID_PACE_PREFERENCES.join(', ')}`,
    });
  }

  // Validate drive_tolerance_hours
  if (
    context.drive_tolerance_hours === undefined ||
    context.drive_tolerance_hours === null
  ) {
    errors.push({
      field: 'user_context.drive_tolerance_hours',
      message: 'Drive tolerance hours is required',
    });
  } else if (
    typeof context.drive_tolerance_hours !== 'number' ||
    context.drive_tolerance_hours < 0
  ) {
    errors.push({
      field: 'user_context.drive_tolerance_hours',
      message: 'Drive tolerance hours must be a non-negative number',
    });
  }

  // Validate risk_tolerance
  if (!context.risk_tolerance) {
    errors.push({
      field: 'user_context.risk_tolerance',
      message: 'Risk tolerance is required',
    });
  } else if (!VALID_RISK_TOLERANCES.includes(context.risk_tolerance)) {
    errors.push({
      field: 'user_context.risk_tolerance',
      message: `Invalid risk tolerance. Must be one of: ${VALID_RISK_TOLERANCES.join(', ')}`,
    });
  }

  // Validate dates
  if (!context.dates) {
    errors.push({
      field: 'user_context.dates',
      message: 'Dates object is required',
    });
  } else {
    validateDates(context.dates, errors);
  }

  // Validate group_size
  if (context.group_size === undefined || context.group_size === null) {
    errors.push({
      field: 'user_context.group_size',
      message: 'Group size is required',
    });
  } else if (typeof context.group_size !== 'number' || context.group_size < 0) {
    errors.push({
      field: 'user_context.group_size',
      message: 'Group size must be a non-negative number',
    });
  }

  // Validate prior_decisions (can be empty array)
  if (!Array.isArray(context.prior_decisions)) {
    errors.push({
      field: 'user_context.prior_decisions',
      message: 'Prior decisions must be an array',
    });
  }
}

function validateDates(
  dates: Partial<StandardInputEnvelope['user_context']['dates']>,
  errors: ValidationError[]
): void {
  if (!dates.type) {
    errors.push({
      field: 'user_context.dates.type',
      message: 'Date type is required',
    });
  } else if (!VALID_DATE_TYPES.includes(dates.type)) {
    errors.push({
      field: 'user_context.dates.type',
      message: `Invalid date type. Must be one of: ${VALID_DATE_TYPES.join(', ')}`,
    });
  }

  // Validate date format if provided
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (dates.start && !dateRegex.test(dates.start)) {
    errors.push({
      field: 'user_context.dates.start',
      message: 'Start date must be in YYYY-MM-DD format',
    });
  }
  if (dates.end && !dateRegex.test(dates.end)) {
    errors.push({
      field: 'user_context.dates.end',
      message: 'End date must be in YYYY-MM-DD format',
    });
  }

  // Validate year if provided
  if (dates.year !== undefined && dates.year !== null) {
    const currentYear = new Date().getFullYear();
    if (typeof dates.year !== 'number' || dates.year < currentYear) {
      errors.push({
        field: 'user_context.dates.year',
        message: 'Year must be a valid future year',
      });
    }
  }
}

function validateRequest(
  request: Partial<StandardInputEnvelope['request']>,
  errors: ValidationError[]
): void {
  if (!request.question || typeof request.question !== 'string') {
    errors.push({
      field: 'request.question',
      message: 'Question is required and must be a string',
    });
  }

  if (request.scope === undefined) {
    errors.push({ field: 'request.scope', message: 'Scope is required' });
  }

  if (!Array.isArray(request.destinations_considered)) {
    errors.push({
      field: 'request.destinations_considered',
      message: 'Destinations considered must be an array',
    });
  }

  if (!request.constraints || typeof request.constraints !== 'object') {
    errors.push({
      field: 'request.constraints',
      message: 'Constraints must be an object',
    });
  }
}

function validateFacts(
  facts: Partial<StandardInputEnvelope['facts']>,
  errors: ValidationError[]
): void {
  if (!Array.isArray(facts.known_constraints)) {
    errors.push({
      field: 'facts.known_constraints',
      message: 'Known constraints must be an array',
    });
  }
  if (!Array.isArray(facts.known_tradeoffs)) {
    errors.push({
      field: 'facts.known_tradeoffs',
      message: 'Known tradeoffs must be an array',
    });
  }
  if (!Array.isArray(facts.destination_notes)) {
    errors.push({
      field: 'facts.destination_notes',
      message: 'Destination notes must be an array',
    });
  }
}

function validatePolicy(
  policy: Partial<StandardInputEnvelope['policy']>,
  errors: ValidationError[]
): void {
  if (!Array.isArray(policy.must_refuse_if)) {
    errors.push({
      field: 'policy.must_refuse_if',
      message: 'Must refuse if conditions must be an array',
    });
  }
  if (!Array.isArray(policy.forbidden_phrases)) {
    errors.push({
      field: 'policy.forbidden_phrases',
      message: 'Forbidden phrases must be an array',
    });
  }
}

/**
 * Detects conflicts in user inputs that require refusal
 * Aligned with: 02_decision_doctrine.md section 7
 */
export function detectInputConflicts(
  input: StandardInputEnvelope
): string[] {
  const conflicts: string[] = [];

  // Check for guarantee requests in question
  const guaranteePatterns = [
    /guarantee/i,
    /promise/i,
    /will I see/i,
    /guaranteed sightings/i,
    /certain to/i,
  ];

  for (const pattern of guaranteePatterns) {
    if (pattern.test(input.request.question)) {
      conflicts.push('guarantee_requested');
      break;
    }
  }

  // Check for conflicting budget vs comfort expectations
  if (
    input.user_context.budget_band === 'budget' &&
    input.request.constraints &&
    (input.request.constraints as Record<string, unknown>).comfort_level === 'luxury'
  ) {
    conflicts.push('inputs_conflict_unbounded');
  }

  // Check for missing material inputs
  if (
    input.user_context.dates.type === 'unknown' &&
    input.user_context.traveler_type === 'unknown' &&
    input.user_context.budget_band === 'unknown'
  ) {
    conflicts.push('missing_material_inputs');
  }

  return conflicts;
}
