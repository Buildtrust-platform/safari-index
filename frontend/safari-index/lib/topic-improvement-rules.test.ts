/**
 * Topic Improvement Rules Unit Tests
 *
 * Tests for the deterministic rule engine.
 * Run with: npx tsx lib/topic-improvement-rules.test.ts
 */

import type { DecisionTopic } from '../app/content/decision-topics';
import {
  analyzeTopicForImprovements,
  generateTopicPatch,
  type TopicImprovementAnalysis,
} from './topic-improvement-rules';

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

function assertGreaterThan(actual: number, expected: number, message?: string) {
  if (actual <= expected) {
    throw new Error(
      `${message || 'Assertion failed'}: expected ${actual} > ${expected}`
    );
  }
}

function assertIncludes(arr: string[], item: string, message?: string) {
  if (!arr.includes(item)) {
    throw new Error(
      `${message || 'Assertion failed'}: expected array to include "${item}"`
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
console.log('\n=== Topic Improvement Rules Unit Tests ===\n');

// Rule: High refusal rate
test('high refusal rate (> 50%) triggers suggestion', () => {
  const topic = createMockTopic();
  const analysis = analyzeTopicForImprovements(topic, 0.6, []);

  const highRefusalSuggestion = analysis.suggestions.find(
    (s) => s.rule_id === 'high_refusal_rate'
  );
  assertTrue(highRefusalSuggestion !== undefined, 'should have high_refusal_rate suggestion');
  assertEqual(highRefusalSuggestion?.severity, 'high');
});

test('refusal rate at 50% does not trigger high refusal suggestion', () => {
  const topic = createMockTopic();
  const analysis = analyzeTopicForImprovements(topic, 0.5, []);

  const highRefusalSuggestion = analysis.suggestions.find(
    (s) => s.rule_id === 'high_refusal_rate'
  );
  assertTrue(highRefusalSuggestion === undefined, 'should not have high_refusal_rate at 50%');
});

// Rule: Watch refusal rate
test('watch refusal rate (30-50%) triggers medium suggestion', () => {
  const topic = createMockTopic();
  const analysis = analyzeTopicForImprovements(topic, 0.4, []);

  const watchSuggestion = analysis.suggestions.find(
    (s) => s.rule_id === 'watch_refusal_rate'
  );
  assertTrue(watchSuggestion !== undefined, 'should have watch_refusal_rate suggestion');
  assertEqual(watchSuggestion?.severity, 'medium');
});

test('refusal rate below 30% does not trigger watch suggestion', () => {
  const topic = createMockTopic();
  const analysis = analyzeTopicForImprovements(topic, 0.2, []);

  const watchSuggestion = analysis.suggestions.find(
    (s) => s.rule_id === 'watch_refusal_rate'
  );
  assertTrue(watchSuggestion === undefined, 'should not have watch_refusal_rate at 20%');
});

// Rule: Missing material inputs
test('missing_material_inputs reason triggers suggestion', () => {
  const topic = createMockTopic();
  const analysis = analyzeTopicForImprovements(topic, 0.3, ['missing_material_inputs']);

  const suggestion = analysis.suggestions.find(
    (s) => s.rule_id === 'missing_material_inputs'
  );
  assertTrue(suggestion !== undefined, 'should have missing_material_inputs suggestion');
  assertEqual(suggestion?.severity, 'high');
  assertTrue(suggestion?.suggested_additions !== undefined, 'should have suggested additions');
});

// Rule: Input conflicts
test('inputs_conflict reason triggers bounds suggestion', () => {
  const topic = createMockTopic();
  const analysis = analyzeTopicForImprovements(topic, 0.3, ['inputs_conflict_unbounded']);

  const suggestion = analysis.suggestions.find(
    (s) => s.rule_id === 'inputs_conflict_unbounded'
  );
  assertTrue(suggestion !== undefined, 'should have inputs_conflict suggestion');
  assertEqual(suggestion?.field, 'optional_inputs');

  // Should suggest bounds inputs
  const keys = suggestion?.suggested_additions?.map((a) => a.key) || [];
  assertTrue(
    keys.some((k) => k.includes('min') || k.includes('max') || k.includes('start') || k.includes('end')),
    'should suggest bounds inputs'
  );
});

// Rule: Guarantee request
test('guarantee reason triggers topic note suggestion', () => {
  const topic = createMockTopic();
  const analysis = analyzeTopicForImprovements(topic, 0.3, ['guarantee_requested']);

  const suggestion = analysis.suggestions.find(
    (s) => s.rule_id === 'guarantee_request'
  );
  assertTrue(suggestion !== undefined, 'should have guarantee_request suggestion');
  assertEqual(suggestion?.field, 'topic_note');
});

// Rule: Insufficient required inputs
test('fewer than 3 required inputs triggers suggestion', () => {
  const topic = createMockTopic({
    required_inputs: [
      { key: 'user_context.dates.month', label: 'Month', example: 'July' },
    ],
  });
  const analysis = analyzeTopicForImprovements(topic, null, []);

  const suggestion = analysis.suggestions.find(
    (s) => s.rule_id === 'insufficient_required_inputs'
  );
  assertTrue(suggestion !== undefined, 'should have insufficient_required_inputs suggestion');
});

test('3 or more required inputs does not trigger suggestion', () => {
  const topic = createMockTopic(); // Has 3 required inputs
  const analysis = analyzeTopicForImprovements(topic, null, []);

  const suggestion = analysis.suggestions.find(
    (s) => s.rule_id === 'insufficient_required_inputs'
  );
  assertTrue(suggestion === undefined, 'should not have insufficient_required_inputs with 3 inputs');
});

// Rule: No optional inputs
test('no optional inputs triggers low priority suggestion', () => {
  const topic = createMockTopic({ optional_inputs: undefined });
  const analysis = analyzeTopicForImprovements(topic, null, []);

  const suggestion = analysis.suggestions.find(
    (s) => s.rule_id === 'no_optional_inputs'
  );
  assertTrue(suggestion !== undefined, 'should have no_optional_inputs suggestion');
  assertEqual(suggestion?.severity, 'low');
});

// Rule: Missing date context
test('time_context without date input triggers suggestion', () => {
  const topic = createMockTopic({
    time_context: { month: 'July' },
    required_inputs: [
      { key: 'user_context.budget_band', label: 'Budget', example: 'fair_value' },
    ],
  });
  const analysis = analyzeTopicForImprovements(topic, null, []);

  const suggestion = analysis.suggestions.find(
    (s) => s.rule_id === 'missing_date_context'
  );
  assertTrue(suggestion !== undefined, 'should have missing_date_context suggestion');
});

test('time_context with date input does not trigger suggestion', () => {
  const topic = createMockTopic({
    time_context: { month: 'July' },
    required_inputs: [
      { key: 'user_context.dates.month', label: 'Month', example: 'July' },
    ],
  });
  const analysis = analyzeTopicForImprovements(topic, null, []);

  const suggestion = analysis.suggestions.find(
    (s) => s.rule_id === 'missing_date_context'
  );
  assertTrue(suggestion === undefined, 'should not have missing_date_context with date input');
});

// Rule: Multi-destination without destination input
test('multi-destination topic without destination input triggers suggestion', () => {
  const topic = createMockTopic({
    destinations: ['Tanzania', 'Kenya', 'Botswana'],
    required_inputs: [
      { key: 'user_context.budget_band', label: 'Budget', example: 'fair_value' },
    ],
  });
  const analysis = analyzeTopicForImprovements(topic, null, []);

  const suggestion = analysis.suggestions.find(
    (s) => s.rule_id === 'missing_destination_input'
  );
  assertTrue(suggestion !== undefined, 'should have missing_destination_input suggestion');
});

// generateTopicPatch tests
test('generateTopicPatch produces correct structure', () => {
  const analysis: TopicImprovementAnalysis = {
    topic_id: 'test-topic',
    refusal_rate: 0.5,
    suggestions: [
      {
        rule_id: 'test',
        severity: 'high',
        message: 'Test',
        field: 'required_inputs',
        suggested_additions: [
          { key: 'test.key', label: 'Test', example: 'value' },
        ],
      },
    ],
  };

  const patch = generateTopicPatch(analysis);

  assertEqual(patch.topic_id, 'test-topic');
  assertEqual(patch.suggested_required_inputs_additions.length, 1);
  assertEqual(patch.suggested_required_inputs_additions[0].key, 'test.key');
});

test('generateTopicPatch deduplicates inputs', () => {
  const analysis: TopicImprovementAnalysis = {
    topic_id: 'test-topic',
    refusal_rate: 0.5,
    suggestions: [
      {
        rule_id: 'test1',
        severity: 'high',
        message: 'Test 1',
        field: 'required_inputs',
        suggested_additions: [
          { key: 'same.key', label: 'Test', example: 'value1' },
        ],
      },
      {
        rule_id: 'test2',
        severity: 'high',
        message: 'Test 2',
        field: 'required_inputs',
        suggested_additions: [
          { key: 'same.key', label: 'Test', example: 'value2' },
        ],
      },
    ],
  };

  const patch = generateTopicPatch(analysis);

  assertEqual(patch.suggested_required_inputs_additions.length, 1, 'should deduplicate by key');
});

// Suggestions sorted by severity
test('suggestions are sorted by severity (high first)', () => {
  const topic = createMockTopic({
    required_inputs: [], // Triggers insufficient_required_inputs (medium)
    optional_inputs: undefined, // Triggers no_optional_inputs (low)
  });
  const analysis = analyzeTopicForImprovements(topic, 0.6, []); // Triggers high_refusal_rate (high)

  assertTrue(analysis.suggestions.length >= 2, 'should have multiple suggestions');

  const severities = analysis.suggestions.map((s) => s.severity);
  const highIndex = severities.indexOf('high');
  const mediumIndex = severities.indexOf('medium');
  const lowIndex = severities.indexOf('low');

  if (highIndex !== -1 && mediumIndex !== -1) {
    assertTrue(highIndex < mediumIndex, 'high should come before medium');
  }
  if (mediumIndex !== -1 && lowIndex !== -1) {
    assertTrue(mediumIndex < lowIndex, 'medium should come before low');
  }
});

// Null refusal rate handling
test('null refusal rate does not crash analysis', () => {
  const topic = createMockTopic();
  const analysis = analyzeTopicForImprovements(topic, null, []);

  assertEqual(analysis.refusal_rate, null);
  assertTrue(Array.isArray(analysis.suggestions), 'should return valid suggestions array');
});

// Empty refusal reasons handling
test('empty refusal reasons does not crash analysis', () => {
  const topic = createMockTopic();
  const analysis = analyzeTopicForImprovements(topic, 0.3, []);

  assertTrue(Array.isArray(analysis.suggestions), 'should return valid suggestions array');
});

console.log('\n=== All tests completed ===\n');
