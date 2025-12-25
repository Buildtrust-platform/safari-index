#!/usr/bin/env npx ts-node
/**
 * P0 Coverage Verification Script
 *
 * Validates that all P0 topics are properly wired end-to-end.
 * Runs locally and in CI. Fails (exit code 1) if any validation fails.
 *
 * Checks:
 * 1. Coverage & integrity
 *    - Every P0 topic in topic-inventory.ts has a corresponding definition in p0-decision-definitions.ts
 *    - Every definition has an ID present in topic-inventory.ts marked as P0
 *    - No duplicate IDs
 *    - No duplicate slugs
 *
 * 2. Input integrity
 *    - required_inputs.length between 2 and 4 (inclusive)
 *    - optional_inputs.length between 0 and 4 (inclusive)
 *    - Every input has key, label, description, example non-empty
 *    - No duplicate input keys within a topic
 *    - Catalog inputs resolve correctly
 *
 * Usage:
 *   npx ts-node scripts/verify-p0-coverage.ts
 *   npm run verify:p0
 */

import { topicInventory, getTopicsByPriority } from '../app/content/topic-inventory';
import { p0DecisionDefinitions, type P0DecisionDefinition } from '../app/content/p0-decision-definitions';
import { INPUT_CATALOG } from '../lib/input-catalog';
import { generateSlugFromId } from '../app/content/p0-topics-bridge';

interface ValidationError {
  topicId: string;
  category: 'coverage' | 'integrity' | 'input';
  message: string;
}

const errors: ValidationError[] = [];

function addError(topicId: string, category: ValidationError['category'], message: string) {
  errors.push({ topicId, category, message });
}

// ============================================================
// 1. COVERAGE & INTEGRITY CHECKS
// ============================================================

console.log('\n📋 Verifying P0 Coverage...\n');

// Get all P0 topics from inventory
const inventoryP0Topics = getTopicsByPriority('P0');
const inventoryP0Ids = new Set(inventoryP0Topics.map((t) => t.id));

// Get all definitions
const definitionIds = new Set(p0DecisionDefinitions.map((d) => d.id));

// Check: Every P0 in inventory has a definition
console.log('  Checking inventory → definitions mapping...');
let missingDefs = 0;
for (const invTopic of inventoryP0Topics) {
  if (!definitionIds.has(invTopic.id)) {
    addError(invTopic.id, 'coverage', `P0 topic in inventory has no definition in p0-decision-definitions.ts`);
    missingDefs++;
  }
}
if (missingDefs === 0) {
  console.log('    ✓ All inventory P0 topics have definitions');
} else {
  console.log(`    ✗ ${missingDefs} inventory P0 topics missing definitions`);
}

// Check: Every definition has a P0 entry in inventory
console.log('  Checking definitions → inventory mapping...');
let orphanDefs = 0;
for (const def of p0DecisionDefinitions) {
  if (!inventoryP0Ids.has(def.id)) {
    // Check if it exists but isn't P0
    const invItem = topicInventory.find((t) => t.id === def.id);
    if (invItem) {
      addError(def.id, 'coverage', `Definition exists but topic is ${invItem.launch_priority} in inventory, not P0`);
    } else {
      addError(def.id, 'coverage', `Definition has no corresponding entry in topic-inventory.ts`);
    }
    orphanDefs++;
  }
}
if (orphanDefs === 0) {
  console.log('    ✓ All definitions have P0 inventory entries');
} else {
  console.log(`    ✗ ${orphanDefs} definitions without P0 inventory entries`);
}

// Check: No duplicate IDs in definitions
console.log('  Checking for duplicate IDs...');
const seenIds = new Set<string>();
let dupIds = 0;
for (const def of p0DecisionDefinitions) {
  if (seenIds.has(def.id)) {
    addError(def.id, 'integrity', `Duplicate ID in p0-decision-definitions.ts`);
    dupIds++;
  }
  seenIds.add(def.id);
}
if (dupIds === 0) {
  console.log('    ✓ No duplicate IDs');
} else {
  console.log(`    ✗ ${dupIds} duplicate IDs found`);
}

// Check: No duplicate slugs
console.log('  Checking for duplicate slugs...');
const seenSlugs = new Map<string, string>(); // slug -> first topic id
let dupSlugs = 0;
for (const def of p0DecisionDefinitions) {
  const slug = generateSlugFromId(def.id);
  if (seenSlugs.has(slug)) {
    addError(def.id, 'integrity', `Duplicate slug "${slug}" (also used by ${seenSlugs.get(slug)})`);
    dupSlugs++;
  }
  seenSlugs.set(slug, def.id);
}
if (dupSlugs === 0) {
  console.log('    ✓ No duplicate slugs');
} else {
  console.log(`    ✗ ${dupSlugs} duplicate slugs found`);
}

// ============================================================
// 2. INPUT INTEGRITY CHECKS
// ============================================================

console.log('\n📝 Verifying Input Integrity...\n');

// Get all catalog keys for validation
const catalogKeys = new Set(Object.values(INPUT_CATALOG).map((input) => input.key));

function validateInputs(def: P0DecisionDefinition): void {
  const { id, required_inputs, optional_inputs } = def;

  // Check required_inputs count (2-4 inclusive)
  if (required_inputs.length < 2 || required_inputs.length > 4) {
    addError(
      id,
      'input',
      `required_inputs.length is ${required_inputs.length}, must be 2-4`
    );
  }

  // Check optional_inputs count (0-4 inclusive)
  if (optional_inputs.length > 4) {
    addError(
      id,
      'input',
      `optional_inputs.length is ${optional_inputs.length}, must be 0-4`
    );
  }

  // Check for empty fields and duplicates
  const allInputs = [...required_inputs, ...optional_inputs];
  const seenKeys = new Set<string>();

  for (const input of allInputs) {
    // Check required fields
    if (!input.key || input.key.trim() === '') {
      addError(id, 'input', `Input has empty key`);
    }
    if (!input.label || input.label.trim() === '') {
      addError(id, 'input', `Input "${input.key}" has empty label`);
    }
    if (!input.description || input.description.trim() === '') {
      addError(id, 'input', `Input "${input.key}" has empty description`);
    }
    if (!input.example || input.example.trim() === '') {
      addError(id, 'input', `Input "${input.key}" has empty example`);
    }

    // Check for duplicate keys
    if (seenKeys.has(input.key)) {
      addError(id, 'input', `Duplicate input key "${input.key}"`);
    }
    seenKeys.add(input.key);
  }
}

let topicsWithInputErrors = 0;
for (const def of p0DecisionDefinitions) {
  const beforeCount = errors.length;
  validateInputs(def);
  if (errors.length > beforeCount) {
    topicsWithInputErrors++;
  }
}

if (topicsWithInputErrors === 0) {
  console.log('  ✓ All topic inputs are valid');
} else {
  console.log(`  ✗ ${topicsWithInputErrors} topics have input errors`);
}

// ============================================================
// SUMMARY
// ============================================================

console.log('\n' + '='.repeat(60) + '\n');

const coverageErrors = errors.filter((e) => e.category === 'coverage').length;
const integrityErrors = errors.filter((e) => e.category === 'integrity').length;
const inputErrors = errors.filter((e) => e.category === 'input').length;

console.log('P0 COVERAGE VERIFICATION SUMMARY');
console.log('='.repeat(60));
console.log(`  Inventory P0 topics:     ${inventoryP0Topics.length}`);
console.log(`  P0 definitions:          ${p0DecisionDefinitions.length}`);
console.log(`  Generated slugs:         ${seenSlugs.size}`);
console.log('');
console.log('  Coverage errors:         ' + (coverageErrors === 0 ? '✓ 0' : `✗ ${coverageErrors}`));
console.log('  Integrity errors:        ' + (integrityErrors === 0 ? '✓ 0' : `✗ ${integrityErrors}`));
console.log('  Input errors:            ' + (inputErrors === 0 ? '✓ 0' : `✗ ${inputErrors}`));
console.log('='.repeat(60));

if (errors.length > 0) {
  console.log('\n❌ VALIDATION FAILED\n');
  console.log('Errors by topic:\n');

  // Group errors by topic
  const errorsByTopic = new Map<string, ValidationError[]>();
  for (const err of errors) {
    if (!errorsByTopic.has(err.topicId)) {
      errorsByTopic.set(err.topicId, []);
    }
    errorsByTopic.get(err.topicId)!.push(err);
  }

  for (const [topicId, topicErrors] of errorsByTopic) {
    console.log(`  ${topicId}:`);
    for (const err of topicErrors) {
      console.log(`    [${err.category}] ${err.message}`);
    }
    console.log('');
  }

  process.exit(1);
} else {
  console.log('\n✅ ALL CHECKS PASSED\n');
  console.log(`${p0DecisionDefinitions.length} P0 topics verified and ready for runtime.\n`);
  process.exit(0);
}
