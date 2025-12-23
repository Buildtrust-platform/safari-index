"use strict";
/**
 * Ops Health Handler
 *
 * Operator-only endpoint providing system health snapshot.
 * Uses existing health-signals.ts and guardrails.ts - no new data sources.
 *
 * Per task requirements:
 * - No auth for MVP (consistent with existing endpoints)
 * - Lightweight computation only
 * - No heavy scans
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOpsHealth = handleOpsHealth;
const health_signals_1 = require("./health-signals");
const guardrails_1 = require("./guardrails");
// Configuration
const LOGIC_VERSION = process.env.LOGIC_VERSION || 'rules_v1.0';
// Response headers
const CORS_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
};
/**
 * Handle GET /ops/health
 */
async function handleOpsHealth(_event) {
    try {
        // Get health snapshot (lightweight - in-memory counters)
        const healthSnapshot = (0, health_signals_1.getHealthSnapshot)();
        // Get guardrail state (lightweight - in-memory tracker)
        const guardrailState = (0, guardrails_1.evaluateGuardrails)();
        // Get raw counters for transparency
        const counters = (0, health_signals_1.getCounters)();
        // Calculate window age
        const windowAgeSeconds = Math.floor((Date.now() - counters.windowStartTime) / 1000);
        // Build response
        const response = {
            timestamp: new Date().toISOString(),
            logic_version: LOGIC_VERSION,
            status: healthSnapshot.overall,
            health_signals: healthSnapshot.signals.map((s) => ({
                name: s.name,
                value: s.value,
                threshold: s.threshold,
                status: s.status,
            })),
            guardrails: {
                bedrock_circuit_open: guardrailState.interventions.bedrockCircuitOpen,
                assurance_paused: guardrailState.interventions.assurancePaused,
                embeds_disabled: guardrailState.interventions.embedsDisabled,
                active_alerts: guardrailState.alerts.length,
            },
            counters: {
                decisions_issued: counters.decisionsIssued,
                decisions_refused: counters.decisionsRefused,
                decisions_failed: counters.decisionsFailed,
                window_age_seconds: windowAgeSeconds,
            },
        };
        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify(response),
        };
    }
    catch (error) {
        console.error('Health check failed:', error);
        // Even on error, return a response indicating the issue
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({
                timestamp: new Date().toISOString(),
                logic_version: LOGIC_VERSION,
                status: 'critical',
                error: 'Health check computation failed',
            }),
        };
    }
}
//# sourceMappingURL=ops-health-handler.js.map