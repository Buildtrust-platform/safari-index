/**
 * Operational Health Endpoint
 *
 * Per task requirements:
 * - Returns operational snapshot of system health
 * - Includes health signals, guardrail state, and recommended actions
 * - Protected endpoint (in production, requires ops credentials)
 *
 * This endpoint answers: "What is the current system state?"
 * It does not answer: "What should we optimize?"
 */

import { NextResponse } from 'next/server';

/**
 * Health signal and guardrail types
 * In production, these would be imported from shared types
 */
interface HealthSignal {
  name: string;
  value: number;
  threshold: number;
  status: 'healthy' | 'warning' | 'critical';
  description: string;
}

interface GuardrailAlert {
  id: string;
  severity: 'warning' | 'critical';
  title: string;
  description: string;
  action: string;
  detectedAt: string;
}

interface OpsHealthResponse {
  timestamp: string;
  environment: string;
  health: {
    overall: 'healthy' | 'degraded' | 'critical';
    signals: HealthSignal[];
    summary: string;
  };
  guardrails: {
    alerts: GuardrailAlert[];
    interventions: {
      bedrockCircuitOpen: boolean;
      assurancePaused: boolean;
      embedsDisabled: boolean;
    };
  };
  actions: string[];
  version: string;
}

/**
 * Mock health data for frontend development
 * In production, this would call the backend decision-orchestrator
 */
function getMockHealthData(): OpsHealthResponse {
  const now = new Date().toISOString();

  return {
    timestamp: now,
    environment: process.env.NODE_ENV || 'development',
    health: {
      overall: 'healthy',
      signals: [
        {
          name: 'decision_failure_rate',
          value: 0.02,
          threshold: 0.05,
          status: 'healthy',
          description: 'Rate of decision requests that failed completely',
        },
        {
          name: 'refusal_rate',
          value: 0.15,
          threshold: 0.4,
          status: 'healthy',
          description: 'Rate of decisions that resulted in refusal',
        },
        {
          name: 'bedrock_failure_rate',
          value: 0.01,
          threshold: 0.1,
          status: 'healthy',
          description: 'Rate of Bedrock AI calls that failed',
        },
        {
          name: 'assurance_success_rate',
          value: 0.95,
          threshold: 0.8,
          status: 'healthy',
          description: 'Rate of assurance generation requests that succeeded',
        },
        {
          name: 'embed_error_rate',
          value: 0.0,
          threshold: 0.05,
          status: 'healthy',
          description: 'Rate of embed renders that failed',
        },
        {
          name: 'review_queue_growth',
          value: 3,
          threshold: 10,
          status: 'healthy',
          description: 'Net growth of review queue in current window',
        },
        {
          name: 'total_decisions',
          value: 127,
          threshold: 0,
          status: 'healthy',
          description: 'Total decision requests in current window',
        },
      ],
      summary: 'All signals within normal parameters.',
    },
    guardrails: {
      alerts: [],
      interventions: {
        bedrockCircuitOpen: false,
        assurancePaused: false,
        embedsDisabled: false,
      },
    },
    actions: [],
    version: '1.0.0',
  };
}

/**
 * GET /api/ops/health
 * Returns current operational health snapshot
 */
export async function GET() {
  // In production, verify ops credentials here
  // const authHeader = request.headers.get('authorization');
  // if (!isValidOpsCredential(authHeader)) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    // In production, call backend:
    // const response = await fetch(`${BACKEND_API}/ops/health`, {
    //   headers: { 'Authorization': `Bearer ${OPS_API_KEY}` },
    // });
    // const data = await response.json();

    const data = getMockHealthData();

    // Determine recommended actions based on state
    const actions: string[] = [];

    if (data.guardrails.interventions.bedrockCircuitOpen) {
      actions.push('Check AWS Bedrock service status and credentials.');
    }

    if (data.guardrails.interventions.assurancePaused) {
      actions.push('Review assurance generation logs. Service is temporarily unavailable.');
    }

    const criticalAlerts = data.guardrails.alerts.filter((a) => a.severity === 'critical');
    if (criticalAlerts.length > 0) {
      actions.push(`Address ${criticalAlerts.length} critical alert(s) immediately.`);
    }

    const warningAlerts = data.guardrails.alerts.filter((a) => a.severity === 'warning');
    if (warningAlerts.length >= 3) {
      actions.push(`Review ${warningAlerts.length} warning alerts. Multiple warnings may indicate systemic issue.`);
    }

    data.actions = actions;

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        health: {
          overall: 'critical',
          signals: [],
          summary: 'Unable to retrieve health data.',
        },
        guardrails: {
          alerts: [
            {
              id: 'health-unavailable',
              severity: 'critical',
              title: 'Health Check Failed',
              description: 'Could not retrieve system health data.',
              action: 'Check backend connectivity and logs.',
              detectedAt: new Date().toISOString(),
            },
          ],
          interventions: {
            bedrockCircuitOpen: false,
            assurancePaused: false,
            embedsDisabled: false,
          },
        },
        actions: ['Investigate health check failure. Backend may be unreachable.'],
        version: '1.0.0',
      },
      { status: 503 }
    );
  }
}

export const dynamic = 'force-dynamic';
