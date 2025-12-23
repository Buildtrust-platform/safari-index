/**
 * Refusal Recovery Mapping Unit Tests
 *
 * Tests for the pure mapping functions in refusal-recovery.ts.
 * Run with: npx tsx lib/refusal-recovery.test.ts
 */

import type { DecisionTopic } from '../app/content/decision-topics';
import {
  getMissingInputs,
  buildExampleSnippet,
  isKnownRefusalReason,
} from './refusal-recovery';

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

function assertFalse(actual: boolean, message?: string) {
  if (actual) {
    throw new Error(`${message || 'Assertion failed'}: expected false, got true`);
  }
}

function assertInRange(actual: number, min: number, max: number, message?: string) {
  if (actual < min || actual > max) {
    throw new Error(
      `${message || 'Assertion failed'}: expected ${actual} to be between ${min} and ${max}`
    );
  }
}

// Mock topic factory
function createMockTopic(overrides: Partial<DecisionTopic> = {}): DecisionTopic {
  return {
    topic_id: 'test-topic',
    slug: 'test-topic',
    question: 'Test question?',
    context_line: 'Test context',
    destinations: ['Tanzania'],
    primary_risks: ['Risk 1', 'Risk 2'],
    key_tradeoffs: ['Tradeoff 1'],
    eligible_outcomes: ['book', 'wait'],
    default_outcome: 'book',
    confidence_range: [0.6, 0.8],
    published: true,
    required_inputs: [
      { key: 'user_context.dates.month', label: 'Travel month', example: 'July' },
      { key: 'user_context.budget_band', label: 'Budget tier', example: 'fair_value' },
      { key: 'user_context.group_size', label: 'Group size', example: '2' },
    ],
    optional_inputs: [
      { key: 'user_context.risk_tolerance', label: 'Risk tolerance', example: 'medium' },
    ],
    ...overrides,
  } as DecisionTopic;
}

// Tests
console.log('\n=== Refusal Recovery Mapping Unit Tests ===\n');

// getMissingInputs tests
test('getMissingInputs returns topic required_inputs when reason is undefined', () => {
  const topic = createMockTopic();
  const result = getMissingInputs(undefined, topic);

  assertEqual(result.length, 3, 'should return 3 inputs');
  assertEqual(result[0].key, 'user_context.dates.month');
  assertEqual(result[0].label, 'Travel month');
  assertEqual(result[0].example, 'July');
});

test('getMissingInputs returns topic required_inputs when reason is unknown', () => {
  const topic = createMockTopic();
  const result = getMissingInputs('some_unknown_reason', topic);

  assertEqual(result.length, 3, 'should return topic required_inputs');
  assertEqual(result[0].key, 'user_context.dates.month');
});

test('getMissingInputs maps missing_material_inputs to correct fields', () => {
  const topic = createMockTopic();
  const result = getMissingInputs('missing_material_inputs', topic);

  assertEqual(result.length, 3, 'should return 3 inputs for missing_material_inputs');
  assertTrue(
    result.some((i) => i.key === 'user_context.dates.month'),
    'should include dates.month'
  );
  assertTrue(
    result.some((i) => i.key === 'user_context.traveler_type'),
    'should include traveler_type'
  );
  assertTrue(
    result.some((i) => i.key === 'user_context.budget_band'),
    'should include budget_band'
  );
});

test('getMissingInputs maps inputs_conflict_unbounded to budget and comfort fields', () => {
  const topic = createMockTopic();
  const result = getMissingInputs('inputs_conflict_unbounded', topic);

  assertEqual(result.length, 2, 'should return 2 inputs for conflict');
  assertTrue(
    result.some((i) => i.key === 'user_context.budget_band'),
    'should include budget_band'
  );
  assertTrue(
    result.some((i) => i.key === 'request.constraints.comfort_level'),
    'should include comfort_level'
  );
});

test('getMissingInputs uses topic examples when available', () => {
  const topic = createMockTopic({
    required_inputs: [
      { key: 'user_context.budget_band', label: 'Budget', example: 'premium' },
    ],
  });
  const result = getMissingInputs('missing_budget', topic);

  const budgetInput = result.find((i) => i.key === 'user_context.budget_band');
  assertEqual(budgetInput?.example, 'premium', 'should use topic example');
});

test('getMissingInputs returns at least 3 inputs', () => {
  const topic = createMockTopic({ required_inputs: [] });
  const result = getMissingInputs(undefined, topic);

  assertInRange(result.length, 3, 7, 'should return between 3 and 7 inputs');
});

test('getMissingInputs returns at most 7 inputs', () => {
  const topic = createMockTopic({
    required_inputs: [
      { key: 'field1', label: 'Field 1', example: '1' },
      { key: 'field2', label: 'Field 2', example: '2' },
      { key: 'field3', label: 'Field 3', example: '3' },
      { key: 'field4', label: 'Field 4', example: '4' },
      { key: 'field5', label: 'Field 5', example: '5' },
      { key: 'field6', label: 'Field 6', example: '6' },
      { key: 'field7', label: 'Field 7', example: '7' },
      { key: 'field8', label: 'Field 8', example: '8' },
      { key: 'field9', label: 'Field 9', example: '9' },
    ],
  });
  const result = getMissingInputs(undefined, topic);

  assertInRange(result.length, 3, 7, 'should return at most 7 inputs');
});

test('getMissingInputs handles Missing travel dates reason', () => {
  const topic = createMockTopic();
  const result = getMissingInputs('Missing travel dates', topic);

  assertTrue(
    result.some((i) => i.key === 'user_context.dates.month'),
    'should include dates.month'
  );
});

// buildExampleSnippet tests
test('buildExampleSnippet produces valid JSON', () => {
  const inputs = [
    { key: 'user_context.budget_band', label: 'Budget', example: 'fair_value' },
  ];
  const snippet = buildExampleSnippet(inputs);

  // Should parse without error
  const parsed = JSON.parse(snippet);
  assertEqual(parsed.user_context.budget_band, 'fair_value');
});

test('buildExampleSnippet handles nested paths correctly', () => {
  const inputs = [
    { key: 'user_context.dates.month', label: 'Month', example: 'July' },
    { key: 'user_context.dates.year', label: 'Year', example: '2026' },
  ];
  const snippet = buildExampleSnippet(inputs);
  const parsed = JSON.parse(snippet);

  assertEqual(parsed.user_context.dates.month, 'July');
  assertEqual(parsed.user_context.dates.year, 2026, 'should parse numeric string');
});

test('buildExampleSnippet parses JSON arrays in examples', () => {
  const inputs = [
    { key: 'request.destinations_considered', label: 'Destinations', example: '["Tanzania", "Kenya"]' },
  ];
  const snippet = buildExampleSnippet(inputs);
  const parsed = JSON.parse(snippet);

  assertTrue(Array.isArray(parsed.request.destinations_considered), 'should be array');
  assertEqual(parsed.request.destinations_considered.length, 2);
});

test('buildExampleSnippet parses boolean examples', () => {
  const inputs = [
    { key: 'request.constraints.shared_vehicle', label: 'Shared OK', example: 'true' },
  ];
  const snippet = buildExampleSnippet(inputs);
  const parsed = JSON.parse(snippet);

  assertEqual(parsed.request.constraints.shared_vehicle, true, 'should be boolean true');
});

// isKnownRefusalReason tests
test('isKnownRefusalReason returns true for known reasons', () => {
  assertTrue(isKnownRefusalReason('missing_material_inputs'));
  assertTrue(isKnownRefusalReason('inputs_conflict_unbounded'));
  assertTrue(isKnownRefusalReason('Missing travel dates'));
});

test('isKnownRefusalReason returns false for unknown reasons', () => {
  assertFalse(isKnownRefusalReason('some_random_reason'));
  assertFalse(isKnownRefusalReason(''));
  assertFalse(isKnownRefusalReason(undefined));
});

console.log('\n=== All tests completed ===\n');
