/**
 * Knowledge Base Validation Tests
 *
 * These tests enforce KB integrity and governance compliance:
 * 1. Every baseline references a valid topic_id
 * 2. Every P0 topic has a baseline
 * 3. No duplicate IDs across collections
 * 4. Banned phrases do not appear in baseline content
 * 5. Schema validation for all records
 *
 * Run with: npx ts-node --project scripts/tsconfig.json lib/kb.test.ts
 */

import {
  getTopic,
  getBaseline,
  listTopics,
  listBaselines,
  listTopicsByBucket,
  searchEvidenceByTags,
  getP0TopicIds,
  getBaselineTopicIds,
  getBannedPhrases,
  validateBaseline,
  getKBStats,
  topicIds,
  baselineIds,
} from './kb';

import {
  BannedPhrasesSchema,
  validateNoBannedPhrases,
} from './kb-contracts';

// Simple test runner
let passed = 0;
let failed = 0;
const failures: string[] = [];

function test(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    failed++;
    const msg = e instanceof Error ? e.message : String(e);
    failures.push(`${name}: ${msg}`);
    console.log(`  ✗ ${name}`);
    console.log(`    ${msg}`);
  }
}

function expect<T>(actual: T) {
  return {
    toBe(expected: T) {
      if (actual !== expected) {
        throw new Error(`Expected ${expected} but got ${actual}`);
      }
    },
    toEqual(expected: T) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
      }
    },
    toBeGreaterThan(expected: number) {
      if (typeof actual !== 'number' || actual <= expected) {
        throw new Error(`Expected ${actual} to be greater than ${expected}`);
      }
    },
    toBeGreaterThanOrEqual(expected: number) {
      if (typeof actual !== 'number' || actual < expected) {
        throw new Error(`Expected ${actual} to be >= ${expected}`);
      }
    },
    toBeLessThanOrEqual(expected: number) {
      if (typeof actual !== 'number' || actual > expected) {
        throw new Error(`Expected ${actual} to be <= ${expected}`);
      }
    },
    not: {
      toBeNull() {
        if (actual === null) {
          throw new Error(`Expected value to not be null`);
        }
      },
    },
    toBeNull() {
      if (actual !== null) {
        throw new Error(`Expected null but got ${actual}`);
      }
    },
  };
}

function describe(name: string, fn: () => void) {
  console.log(`\n${name}`);
  fn();
}

// ============================================================================
// Run Tests
// ============================================================================

console.log('\n=== KB Validation Tests ===\n');

// ============================================================================
// Integrity Tests
// ============================================================================

describe('KB Integrity', () => {
  test('every baseline references a valid topic_id', () => {
    const allBaselines = listBaselines();
    const invalidReferences: string[] = [];

    for (const baseline of allBaselines) {
      if (!getTopic(baseline.topic_id)) {
        invalidReferences.push(baseline.topic_id);
      }
    }

    expect(invalidReferences).toEqual([]);
  });

  test('every P0 topic has a baseline', () => {
    const p0TopicIds = getP0TopicIds();
    const missingBaselines: string[] = [];

    for (const topicId of p0TopicIds) {
      if (!getBaseline(topicId)) {
        missingBaselines.push(topicId);
      }
    }

    expect(missingBaselines).toEqual([]);
  });

  test('topic IDs are unique', () => {
    const ids = topicIds;
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  test('baseline topic_ids are unique', () => {
    const ids = baselineIds;
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });
});

// ============================================================================
// Governance Tests
// ============================================================================

describe('KB Governance', () => {
  const phrases = getBannedPhrases();

  test('banned phrases list is valid', () => {
    const result = BannedPhrasesSchema.safeParse(phrases);
    expect(result.success).toBe(true);
  });

  test('banned phrases list has required content', () => {
    expect(phrases.banned_words.length).toBeGreaterThan(0);
    expect(phrases.forbidden_patterns.length).toBeGreaterThan(0);
    expect(phrases.preferred_vocabulary.length).toBeGreaterThan(0);
  });

  test('no baseline headline contains banned phrases', () => {
    const violations: Array<{ topicId: string; violations: string[] }> = [];

    for (const baseline of listBaselines()) {
      const result = validateNoBannedPhrases(baseline.headline, phrases);
      if (!result.valid) {
        violations.push({
          topicId: baseline.topic_id,
          violations: result.violations,
        });
      }
    }

    expect(violations).toEqual([]);
  });

  test('no baseline summary contains banned phrases', () => {
    const violations: Array<{ topicId: string; violations: string[] }> = [];

    for (const baseline of listBaselines()) {
      const result = validateNoBannedPhrases(baseline.summary, phrases);
      if (!result.valid) {
        violations.push({
          topicId: baseline.topic_id,
          violations: result.violations,
        });
      }
    }

    expect(violations).toEqual([]);
  });

  test('no baseline content contains exclamation marks', () => {
    const violations: string[] = [];

    for (const baseline of listBaselines()) {
      const allText = [
        baseline.headline,
        baseline.summary,
        ...baseline.assumptions.map((a) => a.text),
        ...baseline.tradeoffs.gains,
        ...baseline.tradeoffs.losses,
        ...baseline.change_conditions,
      ].join(' ');

      if (allText.includes('!')) {
        violations.push(baseline.topic_id);
      }
    }

    expect(violations).toEqual([]);
  });

  test('all baselines pass governance validation', () => {
    const failures: Array<{ topicId: string; violations: string[] }> = [];

    for (const baseline of listBaselines()) {
      const result = validateBaseline(baseline);
      if (!result.valid) {
        failures.push({
          topicId: baseline.topic_id,
          violations: result.violations,
        });
      }
    }

    expect(failures).toEqual([]);
  });
});

// ============================================================================
// Schema Validation Tests
// ============================================================================

describe('KB Schema Validation', () => {
  test('topic IDs are kebab-case', () => {
    const kebabCaseRegex = /^[a-z0-9-]+$/;
    const violations: string[] = [];

    for (const topicId of topicIds) {
      if (!kebabCaseRegex.test(topicId)) {
        violations.push(topicId);
      }
    }

    expect(violations).toEqual([]);
  });

  test('baseline topic_ids are kebab-case', () => {
    const kebabCaseRegex = /^[a-z0-9-]+$/;
    const violations: string[] = [];

    for (const baseline of listBaselines()) {
      if (!kebabCaseRegex.test(baseline.topic_id)) {
        violations.push(baseline.topic_id);
      }
    }

    expect(violations).toEqual([]);
  });

  test('baseline confidence scores are between 0 and 1', () => {
    const violations: string[] = [];

    for (const baseline of listBaselines()) {
      if (baseline.confidence < 0 || baseline.confidence > 1) {
        violations.push(`${baseline.topic_id}: ${baseline.confidence}`);
      }
    }

    expect(violations).toEqual([]);
  });

  test('baselines have at least 2 assumptions', () => {
    const violations: string[] = [];

    for (const baseline of listBaselines()) {
      if (baseline.assumptions.length < 2) {
        violations.push(`${baseline.topic_id}: ${baseline.assumptions.length} assumptions`);
      }
    }

    expect(violations).toEqual([]);
  });

  test('baselines have both gains and losses in tradeoffs', () => {
    const violations: string[] = [];

    for (const baseline of listBaselines()) {
      if (baseline.tradeoffs.gains.length === 0) {
        violations.push(`${baseline.topic_id}: no gains`);
      }
      if (baseline.tradeoffs.losses.length === 0) {
        violations.push(`${baseline.topic_id}: no losses`);
      }
    }

    expect(violations).toEqual([]);
  });

  test('baselines have at least 1 change condition', () => {
    const violations: string[] = [];

    for (const baseline of listBaselines()) {
      if (baseline.change_conditions.length === 0) {
        violations.push(baseline.topic_id);
      }
    }

    expect(violations).toEqual([]);
  });
});

// ============================================================================
// Query Function Tests
// ============================================================================

describe('KB Query Functions', () => {
  test('getTopic returns topic for valid ID', () => {
    const topic = getTopic('tz-dry-season');
    expect(topic).not.toBeNull();
  });

  test('getTopic returns null for invalid ID', () => {
    const topic = getTopic('nonexistent-topic');
    expect(topic).toBeNull();
  });

  test('getBaseline returns baseline for valid topic ID', () => {
    const baseline = getBaseline('tz-dry-season');
    expect(baseline).not.toBeNull();
  });

  test('getBaseline returns null for invalid topic ID', () => {
    const baseline = getBaseline('nonexistent-topic');
    expect(baseline).toBeNull();
  });

  test('listTopicsByBucket returns topics for valid bucket', () => {
    const timingTopics = listTopicsByBucket('timing');
    expect(timingTopics.length).toBeGreaterThan(0);
  });

  test('searchEvidenceByTags returns empty array for empty tags', () => {
    const evidence = searchEvidenceByTags([]);
    expect(evidence).toEqual([]);
  });

  test('getKBStats returns valid statistics', () => {
    const stats = getKBStats();
    expect(stats.topics.total).toBeGreaterThan(0);
    expect(stats.topics.p0).toBeGreaterThan(0);
    expect(stats.baselines.total).toBeGreaterThan(0);
  });

  test('P0 baseline coverage is 100%', () => {
    const stats = getKBStats();
    expect(stats.baselines.coverage).toBe(1);
  });
});

// ============================================================================
// Coverage Summary
// ============================================================================

console.log('\n=== KB Coverage Summary ===');
const stats = getKBStats();
console.log(`Topics: ${stats.topics.total} total (P0: ${stats.topics.p0}, P1: ${stats.topics.p1}, P2: ${stats.topics.p2})`);
console.log(`Baselines: ${stats.baselines.total} total`);
console.log(`P0 Baseline Coverage: ${(stats.baselines.coverage * 100).toFixed(1)}%`);
console.log(`Evidence Cards: ${stats.evidence.total}`);
console.log(`Templates: ${stats.templates.total}`);

// ============================================================================
// Results
// ============================================================================

console.log('\n=== Test Results ===');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed > 0) {
  console.log('\nFailures:');
  failures.forEach((f) => console.log(`  - ${f}`));
  process.exit(1);
}

console.log('\nAll tests passed!');
process.exit(0);
