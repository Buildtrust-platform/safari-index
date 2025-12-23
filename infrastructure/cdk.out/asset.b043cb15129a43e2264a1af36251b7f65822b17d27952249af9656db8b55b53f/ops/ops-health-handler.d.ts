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
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
/**
 * Health response structure
 */
export interface OpsHealthResponse {
    timestamp: string;
    logic_version: string;
    status: 'healthy' | 'degraded' | 'critical';
    health_signals: Array<{
        name: string;
        value: number;
        threshold: number;
        status: 'healthy' | 'warning' | 'critical';
    }>;
    guardrails: {
        bedrock_circuit_open: boolean;
        assurance_paused: boolean;
        embeds_disabled: boolean;
        active_alerts: number;
    };
    counters: {
        decisions_issued: number;
        decisions_refused: number;
        decisions_failed: number;
        window_age_seconds: number;
    };
}
/**
 * Handle GET /ops/health
 */
export declare function handleOpsHealth(_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
//# sourceMappingURL=ops-health-handler.d.ts.map