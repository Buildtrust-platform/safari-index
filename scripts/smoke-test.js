#!/usr/bin/env node
/**
 * Safari Index Decision API Smoke Test
 *
 * Tests:
 * 1. Valid decision request → expects type=decision with decision_id
 * 2. Guarantee request → expects type=refusal (DECISION_REFUSED event logged)
 *
 * Usage: node scripts/smoke-test.js [API_URL]
 */

const API_URL = process.argv[2] || 'https://qnxbpsr2a1.execute-api.eu-central-1.amazonaws.com/v1';
const ENDPOINT = `${API_URL}/decision/evaluate`;

// Test case 1: Valid decision request
const validDecisionRequest = {
  task: 'DECISION',
  tracking: { session_id: 'sess_smoke_valid', traveler_id: 'trav_smoke123', lead_id: null },
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
    question: 'Is February a good time for a safari in Tanzania?',
    scope: 'thin_edge_scope_only=true',
    destinations_considered: ['Tanzania'],
    constraints: {},
  },
  facts: {
    known_constraints: ['February is during short dry season'],
    known_tradeoffs: ['Higher wildlife density but also higher visitor numbers'],
    destination_notes: ['Serengeti calving season January-March'],
  },
  policy: {
    must_refuse_if: ['guarantee_requested', 'inputs_conflict_unbounded', 'missing_material_inputs'],
    forbidden_phrases: ['unforgettable', 'magical'],
  },
};

// Test case 2: Guarantee request (must trigger refusal)
const guaranteeRequest = {
  task: 'DECISION',
  tracking: { session_id: 'sess_smoke_guarantee', traveler_id: null, lead_id: null },
  user_context: {
    traveler_type: 'first_time',
    budget_band: 'premium',
    pace_preference: 'slow',
    drive_tolerance_hours: 3,
    risk_tolerance: 'low',
    dates: { type: 'fixed_dates', start: '2026-02-10', end: '2026-02-20' },
    group_size: 2,
    prior_decisions: [],
  },
  request: {
    question: 'Can you guarantee I will see the Big Five on this safari?',
    scope: 'thin_edge_scope_only=true',
    destinations_considered: ['Tanzania'],
    constraints: {},
  },
  facts: { known_constraints: [], known_tradeoffs: [], destination_notes: [] },
  policy: {
    must_refuse_if: ['guarantee_requested', 'inputs_conflict_unbounded', 'missing_material_inputs'],
    forbidden_phrases: ['unforgettable', 'magical', 'once-in-a-lifetime'],
  },
};

/**
 * Validate decision response schema
 * Per 10_data_model.md and 15_ai_output_enforcement.md
 */
function validateDecisionSchema(data) {
  const errors = [];

  if (!data.decision_id || !data.decision_id.startsWith('dec_')) {
    errors.push('Missing or invalid decision_id (must start with dec_)');
  }

  if (!data.output || !data.output.type) {
    errors.push('Missing output.type');
  }

  if (data.output?.type === 'decision') {
    const d = data.output.decision;
    if (!d) {
      errors.push('Missing output.decision');
    } else {
      if (!['book', 'wait', 'switch', 'discard'].includes(d.outcome)) {
        errors.push(`Invalid outcome: ${d.outcome} (must be book|wait|switch|discard)`);
      }
      if (!d.headline) errors.push('Missing headline');
      if (!d.summary) errors.push('Missing summary');
      if (!Array.isArray(d.assumptions)) errors.push('Missing assumptions array');
      if (!d.tradeoffs || !Array.isArray(d.tradeoffs.gains) || !Array.isArray(d.tradeoffs.losses)) {
        errors.push('Missing or invalid tradeoffs (needs gains[] and losses[])');
      }
      if (!Array.isArray(d.change_conditions)) errors.push('Missing change_conditions array');
      if (typeof d.confidence !== 'number' || d.confidence < 0 || d.confidence > 1) {
        errors.push(`Invalid confidence: ${d.confidence} (must be 0-1)`);
      }
    }
  }

  if (data.output?.type === 'refusal') {
    const r = data.output.refusal;
    if (!r) {
      errors.push('Missing output.refusal');
    } else {
      if (!r.reason) errors.push('Missing refusal.reason');
      if (!r.safe_next_step) errors.push('Missing refusal.safe_next_step');
    }
  }

  return errors;
}

async function runTest(name, payload, expectedType) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${name}`);
  console.log(`Expected: ${expectedType}`);
  console.log('='.repeat(50));

  try {
    const startTime = Date.now();
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const duration = Date.now() - startTime;

    console.log(`\nStatus: ${response.status} ${response.statusText}`);
    console.log(`Duration: ${duration}ms`);
    console.log('\nHeaders:');
    for (const [key, value] of response.headers.entries()) {
      if (['content-type', 'x-amzn-requestid', 'x-amz-apigw-id'].includes(key.toLowerCase())) {
        console.log(`  ${key}: ${value}`);
      }
    }

    const data = await response.json();
    console.log('\nResponse:');
    console.log(JSON.stringify(data, null, 2));

    // Validate schema
    const schemaErrors = validateDecisionSchema(data);
    if (schemaErrors.length > 0) {
      console.log('\nSchema Errors:');
      schemaErrors.forEach(e => console.log(`  - ${e}`));
      return { pass: false, reason: 'Schema validation failed' };
    }

    // Check expected type
    const actualType = data.output?.type;
    if (actualType !== expectedType) {
      console.log(`\nFAIL: Expected type=${expectedType}, got type=${actualType}`);
      return { pass: false, reason: `Type mismatch: expected ${expectedType}, got ${actualType}` };
    }

    console.log(`\nPASS: type=${actualType}, decision_id=${data.decision_id}`);
    return { pass: true, decisionId: data.decision_id };

  } catch (err) {
    console.log(`\nERROR: ${err.message}`);
    return { pass: false, reason: err.message };
  }
}

async function main() {
  console.log('Safari Index Decision API Smoke Test');
  console.log(`Endpoint: ${ENDPOINT}`);
  console.log(`Time: ${new Date().toISOString()}`);

  const results = [];

  // Test 1: Valid decision
  results.push(await runTest('Valid Decision Request', validDecisionRequest, 'decision'));

  // Test 2: Guarantee refusal
  results.push(await runTest('Guarantee Request (must refuse)', guaranteeRequest, 'refusal'));

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('SUMMARY');
  console.log('='.repeat(50));
  const passed = results.filter(r => r.pass).length;
  const failed = results.length - passed;
  console.log(`Passed: ${passed}/${results.length}`);
  console.log(`Failed: ${failed}/${results.length}`);

  if (failed > 0) {
    console.log('\nFailed tests:');
    results.forEach((r, i) => {
      if (!r.pass) console.log(`  - Test ${i + 1}: ${r.reason}`);
    });
    process.exit(1);
  }

  console.log('\nAll tests passed.');

  // DynamoDB verification instructions
  console.log('\n' + '='.repeat(50));
  console.log('DYNAMODB VERIFICATION');
  console.log('='.repeat(50));
  console.log('\nTo verify decision records exist, run:');
  console.log('  aws dynamodb scan --table-name safari-index-decisions --max-items 5 --region eu-central-1');
  console.log('\nTo verify event_log entries exist, run:');
  console.log('  aws dynamodb scan --table-name safari-index-events --max-items 10 --region eu-central-1');
  console.log('\nTo query specific decision by ID:');
  results.forEach(r => {
    if (r.decisionId) {
      console.log(`  aws dynamodb get-item --table-name safari-index-decisions --key '{"decision_id":{"S":"${r.decisionId}"}}' --region eu-central-1`);
    }
  });
}

main().catch(console.error);
