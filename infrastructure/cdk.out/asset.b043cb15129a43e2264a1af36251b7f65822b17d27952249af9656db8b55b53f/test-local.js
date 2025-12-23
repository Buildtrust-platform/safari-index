"use strict";
/**
 * Local test runner for Decision Orchestrator
 * Invokes handler directly without HTTP/Lambda runtime
 *
 * Usage: npx ts-node src/test-local.ts
 *
 * Note: Requires DynamoDB Local or mocked AWS credentials
 */
Object.defineProperty(exports, "__esModule", { value: true });
const handler_1 = require("./handler");
// Mock samples
const samples = {
    guarantee_request: {
        task: 'DECISION',
        tracking: { session_id: 'sess_test_guarantee', traveler_id: null, lead_id: null },
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
            question: 'Can you guarantee I will see the Big Five?',
            scope: 'thin_edge_scope_only=true',
            destinations_considered: ['Tanzania'],
            constraints: {},
        },
        facts: { known_constraints: [], known_tradeoffs: [], destination_notes: [] },
        policy: {
            must_refuse_if: ['guarantee_requested', 'inputs_conflict_unbounded', 'missing_material_inputs'],
            forbidden_phrases: ['unforgettable', 'magical'],
        },
    },
    missing_inputs: {
        task: 'DECISION',
        tracking: { session_id: 'sess_test_missing', traveler_id: null, lead_id: null },
        user_context: {
            traveler_type: 'unknown',
            budget_band: 'unknown',
            pace_preference: 'unknown',
            drive_tolerance_hours: 0,
            risk_tolerance: 'unknown',
            dates: { type: 'unknown' },
            group_size: 0,
            prior_decisions: [],
        },
        request: {
            question: 'Should I go on a safari?',
            scope: 'thin_edge_scope_only=true',
            destinations_considered: [],
            constraints: {},
        },
        facts: { known_constraints: [], known_tradeoffs: [], destination_notes: [] },
        policy: {
            must_refuse_if: ['guarantee_requested', 'inputs_conflict_unbounded', 'missing_material_inputs'],
            forbidden_phrases: [],
        },
    },
};
function createMockEvent(body) {
    return {
        httpMethod: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
        path: '/decision/evaluate',
        pathParameters: null,
        queryStringParameters: null,
        multiValueQueryStringParameters: null,
        stageVariables: null,
        requestContext: {},
        resource: '',
        multiValueHeaders: {},
        isBase64Encoded: false,
    };
}
async function runTests() {
    console.log('='.repeat(50));
    console.log('Local Handler Tests (no DynamoDB/Bedrock)');
    console.log('='.repeat(50));
    console.log('');
    // Test 1: Guarantee request should trigger immediate refusal
    console.log('Test: guarantee_request');
    try {
        const event = createMockEvent(samples.guarantee_request);
        const result = await (0, handler_1.handler)(event);
        const body = JSON.parse(result.body);
        console.log('  Status:', result.statusCode);
        console.log('  Type:', body.output?.type || body.type || 'unknown');
        console.log('  Decision ID:', body.decision_id || 'none');
        if (body.output?.type === 'refusal' || body.type === 'refusal') {
            console.log('  ✓ PASS: Refusal triggered');
        }
        else {
            console.log('  ✗ FAIL: Expected refusal');
        }
    }
    catch (err) {
        console.log('  Error:', err.message);
    }
    console.log('');
    // Test 2: Missing inputs should trigger refusal
    console.log('Test: missing_inputs');
    try {
        const event = createMockEvent(samples.missing_inputs);
        const result = await (0, handler_1.handler)(event);
        const body = JSON.parse(result.body);
        console.log('  Status:', result.statusCode);
        console.log('  Type:', body.output?.type || body.type || 'unknown');
        console.log('  Decision ID:', body.decision_id || 'none');
        if (body.output?.type === 'refusal' || body.type === 'refusal') {
            console.log('  ✓ PASS: Refusal triggered');
        }
        else {
            console.log('  ✗ FAIL: Expected refusal');
        }
    }
    catch (err) {
        console.log('  Error:', err.message);
    }
    console.log('');
    console.log('='.repeat(50));
}
runTests().catch(console.error);
//# sourceMappingURL=test-local.js.map