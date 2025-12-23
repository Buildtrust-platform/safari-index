/**
 * Safari Index Decision Orchestrator Lambda Handler
 *
 * This Lambda function serves as the gateway to the AI engine.
 * It enforces the constitutional requirements before and after AI invocation:
 *
 * Pre-AI validation:
 * - Validates input against Standard Input Envelope schema (12_ai_prompts.md)
 * - Detects input conflicts that require immediate refusal
 * - Enforces policy constraints
 *
 * Post-AI enforcement:
 * - Validates AI output structure (verdict-or-refusal logic)
 * - Detects forbidden phrases and patterns
 * - Retries with correction prompt if output is invalid
 *
 * Persistence (per 10_data_model.md, 11_mvp_build_plan.md):
 * - Every decision and refusal is stored in DynamoDB
 * - Events are logged immutably for audit and metrics
 * - logic_version and prompt_version are tracked
 *
 * Governed by:
 * - 02_decision_doctrine.md
 * - 08_ai_behavior.md
 * - 10_data_model.md
 * - 11_mvp_build_plan.md
 * - 12_ai_prompts.md
 * - 15_ai_output_enforcement.md
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {
  StandardInputEnvelope,
  OrchestratorResponse,
  RefusalOutput,
  AIOutput,
  DecisionResponse,
} from './types';
import { validateInput, detectInputConflicts } from './validator';
import { validateAIOutput, generateRetryPrompt } from './output-enforcer';
import { invokeAIEngineWithRetry } from './ai-engine';
import {
  storeDecision,
  logDecisionIssued,
  logDecisionRefused,
} from './db';
import {
  handleGenerateAssurance,
  handleGetAssurance,
  handleUpdatePayment,
} from './assurance/assurance-handler';
import { handleOpsHealth } from './ops/ops-health-handler';

// Configuration
const LOGIC_VERSION = process.env.LOGIC_VERSION || 'rules_v1.0';

// Response headers
const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
};

/**
 * Main Lambda handler
 * Routes requests to appropriate handlers based on path
 */
export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: '',
    };
  }

  const path = event.path || '';

  // Route to ops health endpoint
  // GET /ops/health
  if (path.endsWith('/ops/health') && event.httpMethod === 'GET') {
    return handleOpsHealth(event);
  }

  // Route to assurance handlers
  // POST /assurance/generate
  if (path.endsWith('/assurance/generate') && event.httpMethod === 'POST') {
    return handleGenerateAssurance(event);
  }

  // POST /assurance/{id}/payment - Stripe webhook callback
  if (path.includes('/assurance/') && path.endsWith('/payment') && event.httpMethod === 'POST') {
    return handleUpdatePayment(event);
  }

  // GET /assurance/{id}
  if (path.includes('/assurance/') && event.httpMethod === 'GET') {
    return handleGetAssurance(event);
  }

  // Default: decision evaluation endpoint
  try {
    // Parse request body
    const body = parseRequestBody(event.body);

    // Step 1: Validate input structure
    const inputValidation = validateInput(body);
    if (!inputValidation.valid) {
      return createErrorResponse(400, 'Invalid input structure', inputValidation.errors);
    }

    const input = body as StandardInputEnvelope;

    // Extract tracking context (nullable per 10_data_model.md)
    const sessionId = input.tracking?.session_id || null;
    const travelerId = input.tracking?.traveler_id || null;
    const leadId = input.tracking?.lead_id || null;

    // Step 2: Detect input conflicts that require immediate refusal
    const conflicts = detectInputConflicts(input);
    const mustRefuse = conflicts.some((conflict) =>
      input.policy.must_refuse_if.includes(conflict)
    );

    if (mustRefuse) {
      // Generate a refusal response without calling AI
      // Per 02_decision_doctrine.md section 7 and 08_ai_behavior.md section 6
      const refusalOutput = generateImmediateRefusal(conflicts, input);

      // Persist the refusal (per 10_data_model.md: every decision must be stored)
      const { decisionId, record } = await storeDecision(
        input,
        refusalOutput,
        sessionId,
        travelerId,
        leadId
      );

      // Log the refusal event (per 11_mvp_build_plan.md)
      await logDecisionRefused(record);

      return createSuccessResponse({
        decision_id: decisionId,
        output: refusalOutput,
        metadata: {
          logic_version: LOGIC_VERSION,
          ai_used: false,
          retry_count: 0,
          persisted: true,
        },
      });
    }

    // Step 3: Invoke AI engine with validation and retry logic
    const result = await invokeAndValidateAI(input);

    // Step 4: Persist the decision (per 10_data_model.md)
    // Per 11_mvp_build_plan.md: "If decisions are not persisted, nothing else matters."
    const { decisionId, record } = await storeDecision(
      input,
      result.output,
      sessionId,
      travelerId,
      leadId
    );

    // Step 5: Log the appropriate event
    if (result.output.type === 'refusal') {
      await logDecisionRefused(record);
    } else if (result.output.type === 'decision') {
      await logDecisionIssued(record);
    }
    // Note: clarification, tradeoff_explanation, revision are not persisted as decisions
    // They are intermediate outputs. Only final decisions/refusals are stored.

    // Step 6: Return validated, persisted output
    return createSuccessResponse({
      decision_id: decisionId,
      output: result.output,
      metadata: {
        logic_version: LOGIC_VERSION,
        ai_used: true,
        retry_count: result.retryCount,
        persisted: true,
      },
    });
  } catch (error) {
    console.error('Orchestrator error:', error);
    return createErrorResponse(
      500,
      'Decision orchestration failed',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

/**
 * Parse and validate request body JSON
 */
function parseRequestBody(body: string | null): unknown {
  if (!body) {
    throw new Error('Request body is required');
  }

  try {
    return JSON.parse(body);
  } catch {
    throw new Error('Invalid JSON in request body');
  }
}

/**
 * Invoke AI engine and validate output with retry logic
 * Per 12_ai_prompts.md section 8 and 15_ai_output_enforcement.md section 11
 */
async function invokeAndValidateAI(
  input: StandardInputEnvelope
): Promise<{ output: AIOutput; retryCount: number }> {
  const MAX_VALIDATION_RETRIES = 2;
  let retryPrompt: string | undefined;
  let totalRetries = 0;

  for (let attempt = 0; attempt <= MAX_VALIDATION_RETRIES; attempt++) {
    // Invoke AI engine
    const { output, retryCount } = await invokeAIEngineWithRetry(input, retryPrompt);
    totalRetries += retryCount;

    // Validate output
    const outputValidation = validateAIOutput(output);

    if (outputValidation.valid) {
      return { output, retryCount: totalRetries };
    }

    // Generate retry prompt for next attempt
    // Per 15_ai_output_enforcement.md: "Re-prompt AI with correction instruction"
    retryPrompt = generateRetryPrompt(outputValidation.errors);

    // Log validation failures for monitoring
    // Per 15_ai_output_enforcement.md: "Log the failure for review"
    console.warn('AI output validation failed:', {
      attempt,
      errors: outputValidation.errors,
      outputType: output.type,
    });
  }

  // If we've exhausted retries and still have invalid output,
  // we must return a refusal per doctrine
  // Per 02_decision_doctrine.md: "If this sentence cannot be honestly said, the platform must refuse to decide."
  // Per 15_ai_output_enforcement.md section 12: "The system must choose correctness."
  console.error('AI output validation failed after retries, generating refusal');

  return {
    output: {
      type: 'refusal',
      refusal: {
        reason:
          'A reliable recommendation could not be generated that meets our quality standards.',
        missing_or_conflicting_inputs: [
          'Internal validation constraints were not satisfied',
          'The AI engine produced output that did not meet constitutional requirements',
        ],
        safe_next_step:
          'Please try again with more specific inputs, or contact support if the issue persists.',
      },
    },
    retryCount: totalRetries,
  };
}

/**
 * Generate an immediate refusal for detected input conflicts
 * Per 02_decision_doctrine.md section 7
 * Per 05_refusal_boundaries.md: "Refusal is not negativity. Refusal is discipline."
 */
function generateImmediateRefusal(
  conflicts: string[],
  input: StandardInputEnvelope
): RefusalOutput {
  const conflictMessages: Record<string, string> = {
    guarantee_requested:
      'Safari experiences involve natural wildlife and cannot guarantee specific sightings.',
    inputs_conflict_unbounded:
      'Your budget range conflicts with the comfort level or coverage selected.',
    missing_material_inputs:
      'Key information (dates, preferences, or budget) is missing, preventing a reliable recommendation.',
  };

  const missingInputs = conflicts.map(
    (c) => conflictMessages[c] || `Constraint violation: ${c}`
  );

  // Add specific guidance based on what's unknown
  if (input.user_context.dates.type === 'unknown') {
    missingInputs.push(
      'Travel dates are not specified, which significantly affects availability and pricing.'
    );
  }
  if (input.user_context.budget_band === 'unknown') {
    missingInputs.push(
      'Budget range is not specified, which determines the tier of accommodations available.'
    );
  }

  return {
    type: 'refusal',
    refusal: {
      reason:
        'A reliable recommendation is not possible because the constraints conflict or key information is missing.',
      missing_or_conflicting_inputs: missingInputs.slice(0, 5), // Max 5 per schema
      safe_next_step:
        'Clarify your priorities or provide the missing information, then request a new recommendation.',
    },
  };
}

/**
 * Create a success response with decision response structure
 * Returns decision_id for tracking per 10_data_model.md
 */
function createSuccessResponse(
  response: DecisionResponse
): OrchestratorResponse {
  return {
    statusCode: 200,
    headers: {
      ...CORS_HEADERS,
      'X-Decision-Id': response.decision_id,
      'X-Logic-Version': response.metadata.logic_version,
      'X-Retry-Count': String(response.metadata.retry_count),
    },
    body: JSON.stringify(response),
  };
}

/**
 * Create an error response
 */
function createErrorResponse(
  statusCode: number,
  message: string,
  details?: unknown
): OrchestratorResponse {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      error: message,
      details,
    }),
  };
}
