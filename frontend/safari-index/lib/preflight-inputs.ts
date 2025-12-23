/**
 * Preflight Input Override Helper
 *
 * Merges wizard inputs into StandardInputEnvelope.
 * Staging-only utility for the preflight wizard.
 *
 * Does NOT change:
 * - Backend endpoints
 * - Request structure
 * - Existing buildRequestEnvelope behavior
 *
 * Only provides override merging for staging testing.
 */

import type { StandardInputEnvelope } from './page-assembly';
import type { TopicInput } from '../app/content/decision-topics';

/**
 * Session storage key for preflight inputs
 */
export const PREFLIGHT_STORAGE_KEY = 'preflight_wizard_inputs';

/**
 * Wizard input state (keyed by input key)
 */
export type PreflightInputs = Record<string, string>;

/**
 * Parse a string value into the appropriate type for the envelope
 * Handles: arrays, numbers, booleans, strings
 */
export function parseInputValue(value: string): unknown {
  const trimmed = value.trim();

  // Empty string stays empty
  if (trimmed === '') return trimmed;

  // Try JSON parsing for arrays/objects
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed;
    }
  }

  // Boolean
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;

  // Number (only if it's a pure number)
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }

  // Default: string
  return trimmed;
}

/**
 * Set a nested property on an object using dot notation
 * Creates intermediate objects as needed
 *
 * @param obj - Target object to modify (mutated in place)
 * @param path - Dot-notation path (e.g., "user_context.dates.month")
 * @param value - Value to set
 */
export function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): void {
  const parts = path.split('.');
  let current: Record<string, unknown> = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (current[part] === undefined || current[part] === null) {
      current[part] = {};
    }
    if (typeof current[part] !== 'object' || Array.isArray(current[part])) {
      // Can't traverse into non-object; overwrite
      current[part] = {};
    }
    current = current[part] as Record<string, unknown>;
  }

  const lastPart = parts[parts.length - 1];
  current[lastPart] = value;
}

/**
 * Deep merge two objects, with source overriding target
 * Arrays and primitives are replaced, not merged
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Record<string, unknown>
): T {
  const result = { ...target } as Record<string, unknown>;

  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = result[key];

    if (
      sourceValue !== null &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue !== null &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      // Both are objects, recurse
      result[key] = deepMerge(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>
      );
    } else {
      // Replace
      result[key] = sourceValue;
    }
  }

  return result as T;
}

/**
 * Build an overrides object from wizard inputs
 * Returns a partial StandardInputEnvelope structure
 */
export function buildOverridesFromInputs(
  inputs: PreflightInputs
): Partial<StandardInputEnvelope> {
  const overrides: Record<string, unknown> = {};

  for (const [key, rawValue] of Object.entries(inputs)) {
    if (rawValue === '' || rawValue === undefined) continue;
    const parsedValue = parseInputValue(rawValue);
    setNestedValue(overrides, key, parsedValue);
  }

  return overrides as Partial<StandardInputEnvelope>;
}

/**
 * Merge wizard overrides into a base envelope
 * Returns a new envelope without mutating the original
 */
export function mergeEnvelopeWithOverrides(
  baseEnvelope: StandardInputEnvelope,
  overrides: Partial<StandardInputEnvelope>
): StandardInputEnvelope {
  const result = deepMerge(
    baseEnvelope as unknown as Record<string, unknown>,
    overrides as Record<string, unknown>
  );
  return result as unknown as StandardInputEnvelope;
}

/**
 * Save preflight inputs to session storage
 */
export function savePreflightInputs(
  topicId: string,
  inputs: PreflightInputs
): void {
  if (typeof window === 'undefined') return;

  try {
    const stored = sessionStorage.getItem(PREFLIGHT_STORAGE_KEY);
    const data = stored ? JSON.parse(stored) : {};
    data[topicId] = inputs;
    sessionStorage.setItem(PREFLIGHT_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors in staging
  }
}

/**
 * Load preflight inputs from session storage
 */
export function loadPreflightInputs(topicId: string): PreflightInputs | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = sessionStorage.getItem(PREFLIGHT_STORAGE_KEY);
    if (!stored) return null;
    const data = JSON.parse(stored);
    return data[topicId] || null;
  } catch {
    return null;
  }
}

/**
 * Clear preflight inputs from session storage
 */
export function clearPreflightInputs(topicId?: string): void {
  if (typeof window === 'undefined') return;

  try {
    if (topicId) {
      const stored = sessionStorage.getItem(PREFLIGHT_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        delete data[topicId];
        sessionStorage.setItem(PREFLIGHT_STORAGE_KEY, JSON.stringify(data));
      }
    } else {
      sessionStorage.removeItem(PREFLIGHT_STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Get input type hint from key
 * Returns 'select' for known enum fields, 'text' otherwise
 */
export function getInputType(key: string): 'select' | 'text' {
  const selectKeys = [
    'user_context.budget_band',
    'user_context.traveler_type',
    'user_context.pace_preference',
    'user_context.risk_tolerance',
  ];
  return selectKeys.includes(key) ? 'select' : 'text';
}

/**
 * Get select options for known enum fields
 */
export function getSelectOptions(key: string): string[] {
  switch (key) {
    case 'user_context.budget_band':
      return ['budget', 'fair_value', 'premium', 'luxury'];
    case 'user_context.traveler_type':
      return ['first_time', 'repeat', 'families', 'budget_conscious', 'luxury'];
    case 'user_context.pace_preference':
      return ['relaxed', 'balanced', 'active'];
    case 'user_context.risk_tolerance':
      return ['low', 'medium', 'high'];
    default:
      return [];
  }
}

/**
 * Validate that required inputs have non-empty values
 */
export function validateInputs(
  inputs: PreflightInputs,
  requiredInputs: TopicInput[]
): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  for (const input of requiredInputs) {
    const value = inputs[input.key];
    if (!value || value.trim() === '') {
      missing.push(input.label);
    }
  }

  return { valid: missing.length === 0, missing };
}
