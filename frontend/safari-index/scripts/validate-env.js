#!/usr/bin/env node
/**
 * Environment Validation Script
 *
 * Run before deployment to verify environment configuration.
 * Exits with code 1 if validation fails.
 *
 * Usage:
 *   node scripts/validate-env.js
 *   npm run validate-env
 */

// Simulate browser environment check for modules that check typeof window
const expectedMode = process.env.NEXT_PUBLIC_APP_MODE;
const expectedEnv = process.env.NODE_ENV || 'development';

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║           Safari Index Environment Validation                 ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

console.log(`Environment: ${expectedEnv}`);
console.log(`App Mode: ${expectedMode || '(not set, defaults to observation)'}\n`);

let hasErrors = false;
let hasWarnings = false;

// Check 1: App Mode for production
if (expectedEnv === 'production') {
  if (!expectedMode) {
    console.log('⚠️  WARNING: NEXT_PUBLIC_APP_MODE not set');
    console.log('   Defaulting to "observation" mode (safe, but should be explicit)\n');
    hasWarnings = true;
  } else if (expectedMode !== 'observation') {
    console.log('❌ ERROR: Production must use observation mode');
    console.log(`   Current: NEXT_PUBLIC_APP_MODE=${expectedMode}`);
    console.log('   Required: NEXT_PUBLIC_APP_MODE=observation\n');
    hasErrors = true;
  } else {
    console.log('✅ App mode correct for production (observation)\n');
  }
}

// Check 2: App Mode for staging
if (expectedEnv === 'production' && expectedMode === 'build') {
  // This is staging environment
  console.log('✅ App mode correct for staging (build)\n');
}

// Check 3: API Base
const apiBase = process.env.NEXT_PUBLIC_API_BASE;
if (!apiBase) {
  if (expectedEnv === 'production') {
    console.log('⚠️  WARNING: NEXT_PUBLIC_API_BASE not set');
    console.log('   Will use default API endpoint\n');
    hasWarnings = true;
  } else {
    console.log('ℹ️  INFO: NEXT_PUBLIC_API_BASE not set (using default)\n');
  }
} else {
  console.log(`✅ API Base configured: ${apiBase}\n`);
}

// Check 4: CDN Base
const cdnBase = process.env.NEXT_PUBLIC_ASSETS_CDN_BASE;
if (!cdnBase) {
  console.log('ℹ️  INFO: NEXT_PUBLIC_ASSETS_CDN_BASE not set');
  console.log('   Images will load from local paths\n');
} else {
  console.log(`✅ CDN Base configured: ${cdnBase}\n`);
}

// Check 5: Site Origin
const siteOrigin = process.env.SITE_ORIGIN;
if (!siteOrigin) {
  console.log('ℹ️  INFO: SITE_ORIGIN not set (using default safariindex.com)\n');
} else {
  console.log(`✅ Site Origin configured: ${siteOrigin}\n`);
}

// Summary
console.log('─'.repeat(66));
if (hasErrors) {
  console.log('\n❌ VALIDATION FAILED - Fix errors before deploying\n');
  process.exit(1);
} else if (hasWarnings) {
  console.log('\n⚠️  VALIDATION PASSED WITH WARNINGS\n');
  process.exit(0);
} else {
  console.log('\n✅ VALIDATION PASSED\n');
  process.exit(0);
}
