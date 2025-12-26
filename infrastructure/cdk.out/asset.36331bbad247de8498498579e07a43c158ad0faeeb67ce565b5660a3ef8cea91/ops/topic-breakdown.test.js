"use strict";
/**
 * Topic Breakdown Aggregation Tests
 *
 * Tests the pure aggregation function without DynamoDB dependencies.
 * Run with: npx ts-node src/ops/topic-breakdown.test.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
const topic_breakdown_1 = require("./topic-breakdown");
// Test helper to create mock event records
function createIssuedEvent(topicId) {
    return {
        event_id: `evt_test_${Math.random().toString(36).slice(2)}`,
        created_at: new Date().toISOString(),
        event_type: 'DECISION_ISSUED',
        traveler_id: null,
        session_id: `sess_page_${topicId}`,
        lead_id: null,
        decision_id: `dec_test_${Math.random().toString(36).slice(2)}`,
        itinerary_id: null,
        page_id: null,
        payload: {
            topic_id: topicId,
            outcome: 'book',
            confidence: 0.8,
            logic_version: 'rules_v1.0',
            ai_used: false,
        },
    };
}
function createRefusedEvent(topicId, reason) {
    return {
        event_id: `evt_test_${Math.random().toString(36).slice(2)}`,
        created_at: new Date().toISOString(),
        event_type: 'DECISION_REFUSED',
        traveler_id: null,
        session_id: `sess_page_${topicId}`,
        lead_id: null,
        decision_id: `dec_test_${Math.random().toString(36).slice(2)}`,
        itinerary_id: null,
        page_id: null,
        payload: {
            topic_id: topicId,
            reason,
            missing_inputs_count: 2,
            logic_version: 'rules_v1.0',
        },
    };
}
// Test runner
function test(name, fn) {
    try {
        fn();
        console.log(`✓ ${name}`);
    }
    catch (error) {
        console.error(`✗ ${name}`);
        console.error(`  ${error}`);
        process.exitCode = 1;
    }
}
function assertEqual(actual, expected, message) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`${message || 'Assertion failed'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
}
// Tests
console.log('\n=== Topic Breakdown Aggregation Tests ===\n');
test('aggregateByTopic returns counters for all known topics', () => {
    const knownTopics = ['tz-feb', 'tz-jul', 'ke-aug'];
    const { counters } = (0, topic_breakdown_1.aggregateByTopic)([], [], knownTopics);
    assertEqual(counters.length, 3, 'counter count');
    assertEqual(counters.map((c) => c.topic_id).sort(), knownTopics.sort(), 'topic IDs');
});
test('aggregateByTopic counts issued events correctly', () => {
    const knownTopics = ['tz-feb', 'tz-jul'];
    const issued = [
        createIssuedEvent('tz-feb'),
        createIssuedEvent('tz-feb'),
        createIssuedEvent('tz-jul'),
    ];
    const { counters } = (0, topic_breakdown_1.aggregateByTopic)(issued, [], knownTopics);
    const tzFeb = counters.find((c) => c.topic_id === 'tz-feb');
    const tzJul = counters.find((c) => c.topic_id === 'tz-jul');
    assertEqual(tzFeb.issued, 2, 'tz-feb issued');
    assertEqual(tzJul.issued, 1, 'tz-jul issued');
});
test('aggregateByTopic counts refused events correctly', () => {
    const knownTopics = ['tz-feb', 'tz-jul'];
    const refused = [
        createRefusedEvent('tz-feb', 'Missing dates'),
        createRefusedEvent('tz-feb', 'Missing budget'),
        createRefusedEvent('tz-feb', 'Missing dates'),
    ];
    const { counters, refusalReasons } = (0, topic_breakdown_1.aggregateByTopic)([], refused, knownTopics);
    const tzFeb = counters.find((c) => c.topic_id === 'tz-feb');
    assertEqual(tzFeb.refused, 3, 'tz-feb refused');
    // Check refusal reasons are counted
    assertEqual(refusalReasons.get('Missing dates'), 2, 'Missing dates count');
    assertEqual(refusalReasons.get('Missing budget'), 1, 'Missing budget count');
});
test('aggregateByTopic calculates refusal rate correctly', () => {
    const knownTopics = ['tz-feb'];
    const issued = [
        createIssuedEvent('tz-feb'),
        createIssuedEvent('tz-feb'),
        createIssuedEvent('tz-feb'),
    ];
    const refused = [createRefusedEvent('tz-feb', 'Missing dates')];
    const { counters } = (0, topic_breakdown_1.aggregateByTopic)(issued, refused, knownTopics);
    const tzFeb = counters.find((c) => c.topic_id === 'tz-feb');
    assertEqual(tzFeb.issued, 3, 'issued count');
    assertEqual(tzFeb.refused, 1, 'refused count');
    assertEqual(tzFeb.refusal_rate, 0.25, 'refusal rate'); // 1/(3+1) = 0.25
});
test('aggregateByTopic returns null refusal_rate when no decisions', () => {
    const knownTopics = ['tz-feb'];
    const { counters } = (0, topic_breakdown_1.aggregateByTopic)([], [], knownTopics);
    const tzFeb = counters.find((c) => c.topic_id === 'tz-feb');
    assertEqual(tzFeb.refusal_rate, null, 'refusal rate should be null');
});
test('aggregateByTopic ignores unknown topics', () => {
    const knownTopics = ['tz-feb'];
    const issued = [
        createIssuedEvent('tz-feb'),
        createIssuedEvent('unknown-topic'),
    ];
    const { counters } = (0, topic_breakdown_1.aggregateByTopic)(issued, [], knownTopics);
    assertEqual(counters.length, 1, 'only known topics returned');
    assertEqual(counters[0].issued, 1, 'only known topic counted');
});
test('getTopRefusalReasons returns sorted top N', () => {
    const reasons = new Map([
        ['Missing dates', 10],
        ['Missing budget', 5],
        ['Conflicting inputs', 3],
        ['Missing group size', 2],
        ['Unknown constraint', 1],
        ['Other reason', 1],
    ]);
    const top3 = (0, topic_breakdown_1.getTopRefusalReasons)(reasons, 3);
    assertEqual(top3.length, 3, 'returns 3 items');
    assertEqual(top3[0], 'Missing dates', 'first is highest');
    assertEqual(top3[1], 'Missing budget', 'second is second highest');
    assertEqual(top3[2], 'Conflicting inputs', 'third is third highest');
});
test('getTopRefusalReasons handles empty map', () => {
    const reasons = new Map();
    const topN = (0, topic_breakdown_1.getTopRefusalReasons)(reasons, 5);
    assertEqual(topN.length, 0, 'returns empty array');
});
test('aggregateByTopic extracts topic from session_id pattern', () => {
    const knownTopics = ['tz-feb'];
    // Event without topic_id in payload, but with session pattern
    const event = {
        event_id: 'evt_test',
        created_at: new Date().toISOString(),
        event_type: 'DECISION_ISSUED',
        traveler_id: null,
        session_id: 'sess_page_tz-feb',
        lead_id: null,
        decision_id: 'dec_test',
        itinerary_id: null,
        page_id: null,
        payload: {
            outcome: 'book',
            confidence: 0.8,
        },
    };
    const { counters } = (0, topic_breakdown_1.aggregateByTopic)([event], [], knownTopics);
    assertEqual(counters[0].issued, 1, 'extracted from session_id');
});
console.log('\n=== All tests completed ===\n');
//# sourceMappingURL=topic-breakdown.test.js.map