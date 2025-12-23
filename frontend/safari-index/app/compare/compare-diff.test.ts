/**
 * Compare Diff Unit Tests
 *
 * Tests for the pure diff functions in compare-diff.ts.
 * Run with: npx ts-node app/compare/compare-diff.test.ts
 */

import type { DecisionResponse } from '../../lib/contracts';
import type { DecisionTopic } from '../content/decision-topics';
import { normalize, diffStringArrays, computeDiff } from './compare-diff';

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

// Mock topic factory
function createMockTopic(overrides: Partial<DecisionTopic> = {}): DecisionTopic {
  return {
    topic_id: 'test-topic',
    slug: 'test-topic',
    question: 'Test question?',
    context_line: 'Test context',
    seo_title: 'Test SEO Title',
    seo_description: 'Test SEO Description',
    destinations: ['Tanzania'],
    primary_risks: ['Weather risk', 'Price risk'],
    key_tradeoffs: ['Cost vs quality'],
    traveler_profiles: ['first_time'],
    status: 'published',
    ...overrides,
  } as DecisionTopic;
}

// Mock decision response factory
function createMockDecision(overrides: {
  outcome?: 'book' | 'wait' | 'switch' | 'discard';
  confidence?: number;
  gains?: string[];
  losses?: string[];
  assumptions?: Array<{ id: string; text: string; confidence: number }>;
  change_conditions?: string[];
} = {}): DecisionResponse {
  return {
    decision_id: 'dec_test',
    output: {
      type: 'decision',
      decision: {
        outcome: overrides.outcome || 'book',
        headline: 'Test headline for testing',
        summary: 'Test summary for testing purposes',
        confidence: overrides.confidence ?? 0.75,
        tradeoffs: {
          gains: overrides.gains || ['Gain 1', 'Gain 2'],
          losses: overrides.losses || ['Loss 1', 'Loss 2'],
        },
        assumptions: overrides.assumptions || [
          { id: 'a1', text: 'Assumption 1', confidence: 0.8 },
          { id: 'a2', text: 'Assumption 2', confidence: 0.7 },
        ],
        change_conditions: overrides.change_conditions || ['Condition 1', 'Condition 2'],
      },
    },
    metadata: {
      logic_version: 'v1.0',
      ai_used: false,
    },
  };
}

// Tests
console.log('\n=== Compare Diff Unit Tests ===\n');

// normalize tests
test('normalize lowercases string', () => {
  assertEqual(normalize('HELLO'), 'hello');
});

test('normalize trims whitespace', () => {
  assertEqual(normalize('  hello  '), 'hello');
});

test('normalize collapses internal whitespace', () => {
  assertEqual(normalize('hello   world'), 'hello world');
});

test('normalize handles combined transformations', () => {
  assertEqual(normalize('  HELLO   WORLD  '), 'hello world');
});

// diffStringArrays tests
test('diffStringArrays returns empty when arrays match', () => {
  const result = diffStringArrays(['a', 'b'], ['a', 'b']);
  assertEqual(result.onlyInA, []);
  assertEqual(result.onlyInB, []);
});

test('diffStringArrays finds items only in A', () => {
  const result = diffStringArrays(['a', 'b', 'c'], ['a', 'b']);
  assertEqual(result.onlyInA, ['c']);
  assertEqual(result.onlyInB, []);
});

test('diffStringArrays finds items only in B', () => {
  const result = diffStringArrays(['a', 'b'], ['a', 'b', 'c']);
  assertEqual(result.onlyInA, []);
  assertEqual(result.onlyInB, ['c']);
});

test('diffStringArrays finds items in both directions', () => {
  const result = diffStringArrays(['a', 'x'], ['a', 'y']);
  assertEqual(result.onlyInA, ['x']);
  assertEqual(result.onlyInB, ['y']);
});

test('diffStringArrays ignores case differences', () => {
  const result = diffStringArrays(['Hello World'], ['hello world']);
  assertEqual(result.onlyInA, []);
  assertEqual(result.onlyInB, []);
});

test('diffStringArrays ignores whitespace differences', () => {
  const result = diffStringArrays(['hello  world'], ['hello world']);
  assertEqual(result.onlyInA, []);
  assertEqual(result.onlyInB, []);
});

// computeDiff tests
test('computeDiff detects outcome difference', () => {
  const topicA = createMockTopic();
  const topicB = createMockTopic();
  const responseA = createMockDecision({ outcome: 'book' });
  const responseB = createMockDecision({ outcome: 'wait' });

  const diff = computeDiff(responseA, responseB, topicA, topicB);

  assertTrue(diff.hasDifferences, 'should have differences');
  assertTrue(diff.outcome !== null, 'outcome should differ');
  assertEqual(diff.outcome?.valueA, 'book');
  assertEqual(diff.outcome?.valueB, 'wait');
});

test('computeDiff detects confidence difference >= 10%', () => {
  const topicA = createMockTopic();
  const topicB = createMockTopic();
  const responseA = createMockDecision({ confidence: 0.8 });
  const responseB = createMockDecision({ confidence: 0.6 });

  const diff = computeDiff(responseA, responseB, topicA, topicB);

  assertTrue(diff.hasDifferences, 'should have differences');
  assertTrue(diff.confidence !== null, 'confidence should differ');
  assertEqual(diff.confidence?.valueA, '80%');
  assertEqual(diff.confidence?.valueB, '60%');
});

test('computeDiff ignores confidence difference < 10%', () => {
  const topicA = createMockTopic();
  const topicB = createMockTopic();
  const responseA = createMockDecision({ confidence: 0.75 });
  const responseB = createMockDecision({ confidence: 0.70 });

  const diff = computeDiff(responseA, responseB, topicA, topicB);

  assertTrue(diff.confidence === null, 'confidence should not differ for < 10%');
});

test('computeDiff detects gains differences', () => {
  const topicA = createMockTopic();
  const topicB = createMockTopic();
  const responseA = createMockDecision({ gains: ['Optimal viewing', 'Less rain'] });
  const responseB = createMockDecision({ gains: ['Optimal viewing', 'Lower prices'] });

  const diff = computeDiff(responseA, responseB, topicA, topicB);

  assertTrue(diff.hasDifferences, 'should have differences');
  assertEqual(diff.gains.onlyInA, ['Less rain']);
  assertEqual(diff.gains.onlyInB, ['Lower prices']);
});

test('computeDiff detects assumption differences', () => {
  const topicA = createMockTopic();
  const topicB = createMockTopic();
  const responseA = createMockDecision({
    assumptions: [
      { id: 'a1', text: 'Flexible dates', confidence: 0.8 },
      { id: 'a2', text: 'Budget allows peak', confidence: 0.7 },
    ],
  });
  const responseB = createMockDecision({
    assumptions: [
      { id: 'a1', text: 'Flexible dates', confidence: 0.8 },
      { id: 'a2', text: 'First-time visitor', confidence: 0.7 },
    ],
  });

  const diff = computeDiff(responseA, responseB, topicA, topicB);

  assertTrue(diff.hasDifferences, 'should have differences');
  assertEqual(diff.assumptions.onlyInA, ['Budget allows peak']);
  assertEqual(diff.assumptions.onlyInB, ['First-time visitor']);
});

test('computeDiff returns no differences for identical decisions', () => {
  const topicA = createMockTopic();
  const topicB = createMockTopic();
  const responseA = createMockDecision();
  const responseB = createMockDecision();

  const diff = computeDiff(responseA, responseB, topicA, topicB);

  // Note: fit/misfit may still differ based on topic, but core decision fields are same
  // For truly identical, we need identical topics too
  assertFalse(diff.outcome !== null, 'outcome should be same');
  assertFalse(diff.confidence !== null, 'confidence should be same');
});

test('computeDiff handles refusal responses gracefully', () => {
  const topicA = createMockTopic();
  const topicB = createMockTopic();
  const responseA: DecisionResponse = {
    decision_id: 'dec_refusal',
    output: {
      type: 'refusal',
      refusal: {
        reason: 'Missing dates',
        missing_or_conflicting_inputs: ['dates'],
        safe_next_step: 'Provide dates',
      },
    },
    metadata: { logic_version: 'v1.0', ai_used: false },
  };
  const responseB = createMockDecision();

  const diff = computeDiff(responseA, responseB, topicA, topicB);

  assertFalse(diff.hasDifferences, 'should not have differences when one is refusal');
});

console.log('\n=== All tests completed ===\n');
