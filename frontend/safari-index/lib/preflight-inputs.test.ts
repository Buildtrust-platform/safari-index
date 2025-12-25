/**
 * Preflight Inputs Unit Tests
 *
 * Tests for the input override merging utilities.
 * Run with: npx tsx lib/preflight-inputs.test.ts
 */

import type { StandardInputEnvelope } from './page-assembly';
import {
  parseInputValue,
  setNestedValue,
  deepMerge,
  buildOverridesFromInputs,
  mergeEnvelopeWithOverrides,
  getInputType,
  getSelectOptions,
  validateInputs,
} from './preflight-inputs';

// Test helpers
function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    console.error(`  ${error}`);
    process.exitCode = 1;
  }
}

function assertEqual<T>(actual: T, expected: T, message?: string) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `${message || 'Assertion failed'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
    );
  }
}

function assertTrue(actual: boolean, message?: string) {
  if (!actual) {
    throw new Error(`${message || 'Assertion failed'}: expected true, got false`);
  }
}

// Mock envelope factory
function createMockEnvelope(): StandardInputEnvelope {
  return {
    task: 'DECISION',
    tracking: {
      session_id: 'sess_test',
      traveler_id: null,
      lead_id: null,
    },
    user_context: {
      traveler_type: 'first_time',
      budget_band: 'fair_value',
      pace_preference: 'balanced',
      drive_tolerance_hours: 4,
      risk_tolerance: 'medium',
      dates: { type: 'month_year', month: 'February', year: 2026 },
      group_size: 2,
      prior_decisions: [],
    },
    request: {
      question: 'Test question?',
      scope: 'thin_edge_scope_only=true',
      destinations_considered: ['Tanzania'],
      constraints: {},
    },
    facts: {
      known_constraints: [],
      known_tradeoffs: [],
      destination_notes: [],
    },
    policy: {
      must_refuse_if: [],
      forbidden_phrases: [],
    },
  };
}

// Tests
console.log('\n=== Preflight Inputs Unit Tests ===\n');

// parseInputValue tests
test('parseInputValue parses string as string', () => {
  assertEqual(parseInputValue('hello'), 'hello');
});

test('parseInputValue parses number string as number', () => {
  assertEqual(parseInputValue('42'), 42);
  assertEqual(parseInputValue('3.14'), 3.14);
  assertEqual(parseInputValue('-5'), -5);
});

test('parseInputValue parses boolean strings', () => {
  assertEqual(parseInputValue('true'), true);
  assertEqual(parseInputValue('false'), false);
});

test('parseInputValue parses JSON arrays', () => {
  assertEqual(parseInputValue('["Tanzania", "Kenya"]'), ['Tanzania', 'Kenya']);
});

test('parseInputValue parses JSON objects', () => {
  assertEqual(parseInputValue('{"month": "July"}'), { month: 'July' });
});

test('parseInputValue returns string for invalid JSON', () => {
  assertEqual(parseInputValue('[invalid'), '[invalid');
});

test('parseInputValue trims whitespace', () => {
  assertEqual(parseInputValue('  hello  '), 'hello');
});

test('parseInputValue handles empty string', () => {
  assertEqual(parseInputValue(''), '');
  assertEqual(parseInputValue('   '), '');
});

// setNestedValue tests
test('setNestedValue sets top-level property', () => {
  const obj: Record<string, unknown> = {};
  setNestedValue(obj, 'name', 'test');
  assertEqual(obj.name, 'test');
});

test('setNestedValue sets nested property', () => {
  const obj: Record<string, unknown> = {};
  setNestedValue(obj, 'user_context.budget_band', 'premium');
  assertEqual((obj.user_context as Record<string, unknown>).budget_band, 'premium');
});

test('setNestedValue sets deeply nested property', () => {
  const obj: Record<string, unknown> = {};
  setNestedValue(obj, 'user_context.dates.month', 'July');
  assertEqual(
    ((obj.user_context as Record<string, unknown>).dates as Record<string, unknown>).month,
    'July'
  );
});

test('setNestedValue creates intermediate objects', () => {
  const obj: Record<string, unknown> = {};
  setNestedValue(obj, 'a.b.c.d', 'value');
  assertEqual(
    (((obj.a as Record<string, unknown>).b as Record<string, unknown>).c as Record<string, unknown>).d,
    'value'
  );
});

test('setNestedValue overwrites existing values', () => {
  const obj: Record<string, unknown> = { user_context: { budget_band: 'budget' } };
  setNestedValue(obj, 'user_context.budget_band', 'premium');
  assertEqual((obj.user_context as Record<string, unknown>).budget_band, 'premium');
});

// deepMerge tests
test('deepMerge merges top-level properties', () => {
  const target = { a: 1, b: 2 };
  const source = { b: 3, c: 4 };
  const result = deepMerge(target, source);
  assertEqual(result, { a: 1, b: 3, c: 4 } as typeof result);
});

test('deepMerge merges nested objects', () => {
  const target = { user: { name: 'Alice', age: 30 } };
  const source = { user: { age: 31 } };
  const result = deepMerge(target, source);
  assertEqual(result, { user: { name: 'Alice', age: 31 } });
});

test('deepMerge replaces arrays', () => {
  const target = { items: [1, 2, 3] };
  const source = { items: [4, 5] };
  const result = deepMerge(target, source);
  assertEqual(result, { items: [4, 5] });
});

test('deepMerge does not mutate original', () => {
  const target = { a: 1 };
  const source = { b: 2 };
  deepMerge(target, source);
  assertEqual(target, { a: 1 });
});

// buildOverridesFromInputs tests
test('buildOverridesFromInputs creates nested structure', () => {
  const inputs = {
    'user_context.budget_band': 'premium',
    'user_context.group_size': '4',
  };
  const overrides = buildOverridesFromInputs(inputs);
  assertEqual((overrides.user_context as Record<string, unknown>)?.budget_band, 'premium');
  assertEqual((overrides.user_context as Record<string, unknown>)?.group_size, 4);
});

test('buildOverridesFromInputs handles array values', () => {
  const inputs = {
    'request.destinations_considered': '["Kenya", "Tanzania"]',
  };
  const overrides = buildOverridesFromInputs(inputs);
  assertEqual((overrides.request as Record<string, unknown>)?.destinations_considered, ['Kenya', 'Tanzania']);
});

test('buildOverridesFromInputs skips empty values', () => {
  const inputs = {
    'user_context.budget_band': 'premium',
    'user_context.traveler_type': '',
  };
  const overrides = buildOverridesFromInputs(inputs);
  assertTrue((overrides.user_context as Record<string, unknown>)?.budget_band === 'premium');
  assertTrue((overrides.user_context as Record<string, unknown>)?.traveler_type === undefined);
});

// mergeEnvelopeWithOverrides tests
test('mergeEnvelopeWithOverrides overrides budget_band', () => {
  const envelope = createMockEnvelope();
  const overrides = { user_context: { budget_band: 'premium' } };
  const result = mergeEnvelopeWithOverrides(envelope, overrides as Partial<StandardInputEnvelope>);
  assertEqual(result.user_context.budget_band, 'premium');
  // Original values preserved
  assertEqual(result.user_context.traveler_type, 'first_time');
});

test('mergeEnvelopeWithOverrides overrides nested dates', () => {
  const envelope = createMockEnvelope();
  const overrides = { user_context: { dates: { month: 'July' } } };
  const result = mergeEnvelopeWithOverrides(envelope, overrides as Partial<StandardInputEnvelope>);
  assertEqual(result.user_context.dates.month, 'July');
  // Other date fields preserved
  assertEqual(result.user_context.dates.type, 'month_year');
});

test('mergeEnvelopeWithOverrides overrides request destinations', () => {
  const envelope = createMockEnvelope();
  const overrides = { request: { destinations_considered: ['Kenya', 'Botswana'] } };
  const result = mergeEnvelopeWithOverrides(envelope, overrides as Partial<StandardInputEnvelope>);
  assertEqual(result.request.destinations_considered, ['Kenya', 'Botswana']);
});

test('mergeEnvelopeWithOverrides preserves unmodified sections', () => {
  const envelope = createMockEnvelope();
  const overrides = { user_context: { budget_band: 'premium' } };
  const result = mergeEnvelopeWithOverrides(envelope, overrides as Partial<StandardInputEnvelope>);
  // Tracking unchanged
  assertEqual(result.tracking.session_id, 'sess_test');
  // Facts unchanged
  assertEqual(result.facts.known_constraints, []);
  // Policy unchanged
  assertEqual(result.policy.must_refuse_if, []);
});

// getInputType tests
test('getInputType returns select for known enum fields', () => {
  assertEqual(getInputType('user_context.budget_band'), 'select');
  assertEqual(getInputType('user_context.traveler_type'), 'select');
  assertEqual(getInputType('user_context.pace_preference'), 'select');
  assertEqual(getInputType('user_context.risk_tolerance'), 'select');
});

test('getInputType returns text for unknown fields', () => {
  assertEqual(getInputType('user_context.group_size'), 'text');
  assertEqual(getInputType('request.destinations_considered'), 'text');
  assertEqual(getInputType('unknown.field'), 'text');
});

// getSelectOptions tests
test('getSelectOptions returns options for budget_band', () => {
  const options = getSelectOptions('user_context.budget_band');
  assertTrue(options.includes('budget'));
  assertTrue(options.includes('fair_value'));
  assertTrue(options.includes('premium'));
});

test('getSelectOptions returns empty for unknown fields', () => {
  const options = getSelectOptions('unknown.field');
  assertEqual(options, []);
});

// validateInputs tests
test('validateInputs returns valid for complete inputs', () => {
  const inputs = {
    'user_context.dates.month': 'February',
    'user_context.budget_band': 'fair_value',
  };
  const required = [
    { key: 'user_context.dates.month', label: 'Travel month', example: 'February' },
    { key: 'user_context.budget_band', label: 'Budget tier', example: 'fair_value' },
  ];
  const result = validateInputs(inputs, required);
  assertTrue(result.valid);
  assertEqual(result.missing, []);
});

test('validateInputs returns missing for incomplete inputs', () => {
  const inputs = {
    'user_context.dates.month': 'February',
  };
  const required = [
    { key: 'user_context.dates.month', label: 'Travel month', example: 'February' },
    { key: 'user_context.budget_band', label: 'Budget tier', example: 'fair_value' },
  ];
  const result = validateInputs(inputs, required);
  assertTrue(!result.valid);
  assertTrue(result.missing.includes('Budget tier'));
});

test('validateInputs treats empty string as missing', () => {
  const inputs = {
    'user_context.dates.month': '',
  };
  const required = [
    { key: 'user_context.dates.month', label: 'Travel month', example: 'February' },
  ];
  const result = validateInputs(inputs, required);
  assertTrue(!result.valid);
  assertTrue(result.missing.includes('Travel month'));
});

console.log('\n=== All tests completed ===\n');
