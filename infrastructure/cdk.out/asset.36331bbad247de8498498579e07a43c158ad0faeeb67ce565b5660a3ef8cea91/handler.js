"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
const validator_1 = require("./validator");
const output_enforcer_1 = require("./output-enforcer");
const ai_engine_1 = require("./ai-engine");
const db_1 = require("./db");
const assurance_handler_1 = require("./assurance/assurance-handler");
const ops_health_handler_1 = require("./ops/ops-health-handler");
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
async function handler(event) {
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
        return (0, ops_health_handler_1.handleOpsHealth)(event);
    }
    // Route to assurance handlers
    // POST /assurance/generate
    if (path.endsWith('/assurance/generate') && event.httpMethod === 'POST') {
        return (0, assurance_handler_1.handleGenerateAssurance)(event);
    }
    // POST /assurance/{id}/payment - Stripe webhook callback
    if (path.includes('/assurance/') && path.endsWith('/payment') && event.httpMethod === 'POST') {
        return (0, assurance_handler_1.handleUpdatePayment)(event);
    }
    // GET /assurance/{id}
    if (path.includes('/assurance/') && event.httpMethod === 'GET') {
        return (0, assurance_handler_1.handleGetAssurance)(event);
    }
    // Default: decision evaluation endpoint
    try {
        // Parse request body
        const body = parseRequestBody(event.body);
        // Step 1: Validate input structure
        const inputValidation = (0, validator_1.validateInput)(body);
        if (!inputValidation.valid) {
            return createErrorResponse(400, 'Invalid input structure', inputValidation.errors);
        }
        const input = body;
        // Extract tracking context (nullable per 10_data_model.md)
        const sessionId = input.tracking?.session_id || null;
        const travelerId = input.tracking?.traveler_id || null;
        const leadId = input.tracking?.lead_id || null;
        // Step 2: Detect input conflicts that require immediate refusal
        const conflicts = (0, validator_1.detectInputConflicts)(input);
        const mustRefuse = conflicts.some((conflict) => input.policy.must_refuse_if.includes(conflict));
        if (mustRefuse) {
            // Generate a refusal response without calling AI
            // Per 02_decision_doctrine.md section 7 and 08_ai_behavior.md section 6
            const refusalOutput = generateImmediateRefusal(conflicts, input);
            // Persist the refusal (per 10_data_model.md: every decision must be stored)
            const { decisionId, record } = await (0, db_1.storeDecision)(input, refusalOutput, sessionId, travelerId, leadId);
            // Log the refusal event (per 11_mvp_build_plan.md)
            await (0, db_1.logDecisionRefused)(record);
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
        // Step 3: Check snapshot cache for default inputs
        // This prevents evaluation stampedes and provides instant responses
        const topicId = (0, db_1.extractTopicId)(input);
        const inputsHash = (0, db_1.hashInputs)(input);
        const useCache = (0, db_1.isDefaultInput)(input);
        if (useCache) {
            const snapshotResult = await (0, db_1.getSnapshot)(topicId, inputsHash);
            if (snapshotResult.status === 'hit') {
                // Cache hit - return cached response immediately
                console.log('Snapshot cache hit:', { topicId, age_seconds: snapshotResult.age_seconds });
                return createSuccessResponse({
                    ...snapshotResult.snapshot,
                    metadata: {
                        ...snapshotResult.snapshot.metadata,
                        cached: true,
                        cache_age_seconds: snapshotResult.age_seconds,
                    },
                });
            }
            if (snapshotResult.status === 'locked') {
                // Another evaluation is in progress - return capacity refusal
                console.log('Snapshot locked, returning capacity refusal:', { topicId, retry_after: snapshotResult.retry_after_seconds });
                return createCapacityRefusal(snapshotResult.retry_after_seconds);
            }
            if (snapshotResult.status === 'stale') {
                // Stale cache - can serve while refreshing, but let's try to refresh
                // For now, proceed with evaluation but could serve stale in high-load scenarios
                console.log('Snapshot stale, proceeding with refresh:', { topicId, age_seconds: snapshotResult.age_seconds });
            }
        }
        // Step 4: Acquire lock for request coalescing (default inputs only)
        let lockId = null;
        if (useCache) {
            const lockResult = await (0, db_1.acquireLock)(topicId);
            if (lockResult.status === 'locked') {
                // Another process is evaluating - return capacity refusal
                console.log('Lock held by another process, returning capacity refusal:', { topicId });
                return createCapacityRefusal(5); // Suggest retry in 5 seconds
            }
            if (lockResult.status === 'acquired') {
                lockId = lockResult.lockId;
            }
            // If status === 'unavailable', proceed without lock (infrastructure not deployed)
            if (lockResult.status === 'unavailable') {
                console.log('Lock infrastructure unavailable, proceeding without caching:', { topicId });
            }
        }
        try {
            // Step 5: Invoke AI engine with validation and retry logic
            const result = await invokeAndValidateAI(input);
            // Step 6: Persist the decision (per 10_data_model.md)
            // Per 11_mvp_build_plan.md: "If decisions are not persisted, nothing else matters."
            const { decisionId, record } = await (0, db_1.storeDecision)(input, result.output, sessionId, travelerId, leadId);
            // Step 7: Log the appropriate event
            if (result.output.type === 'refusal') {
                await (0, db_1.logDecisionRefused)(record);
            }
            else if (result.output.type === 'decision') {
                await (0, db_1.logDecisionIssued)(record);
            }
            // Note: clarification, tradeoff_explanation, revision are not persisted as decisions
            // They are intermediate outputs. Only final decisions/refusals are stored.
            // Step 8: Build response
            const response = {
                decision_id: decisionId,
                output: result.output,
                metadata: {
                    logic_version: LOGIC_VERSION,
                    ai_used: true,
                    retry_count: result.retryCount,
                    persisted: true,
                },
            };
            // Step 9: Store snapshot for default inputs (releases lock)
            if (useCache && lockId && result.output.type === 'decision') {
                await (0, db_1.storeSnapshot)(topicId, response, inputsHash, lockId);
                console.log('Stored snapshot:', { topicId });
            }
            else if (lockId) {
                // Release lock without storing (e.g., for refusals)
                await (0, db_1.releaseLock)(topicId, lockId);
            }
            return createSuccessResponse(response);
        }
        catch (error) {
            // Release lock on error
            if (lockId) {
                await (0, db_1.releaseLock)(topicId, lockId);
            }
            throw error;
        }
    }
    catch (error) {
        // Per governance: return a governed refusal instead of 500
        // This ensures the frontend always receives a valid decision response
        console.error('Orchestrator error (returning governed refusal):', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        // Build a refusal output for unexpected errors
        const fallbackRefusal = {
            type: 'refusal',
            refusal: {
                code: 'SERVICE_DEGRADED',
                reason: 'A reliable recommendation could not be generated at this time.',
                missing_or_conflicting_inputs: [
                    'The decision service encountered an unexpected condition',
                    'This may be due to temporary capacity constraints',
                ],
                safe_next_step: 'Please try again in a few moments. If the issue persists, contact support.',
            },
        };
        // Generate a decision ID for tracking even on errors
        const fallbackDecisionId = `dec_err_${Date.now().toString(36)}`;
        // Log the error event for monitoring
        console.error('Fallback refusal issued:', {
            decision_id: fallbackDecisionId,
            error: errorMessage,
        });
        return createSuccessResponse({
            decision_id: fallbackDecisionId,
            output: fallbackRefusal,
            metadata: {
                logic_version: LOGIC_VERSION,
                ai_used: false,
                retry_count: 0,
                persisted: false, // Not persisted due to error
            },
        });
    }
}
/**
 * Parse and validate request body JSON
 */
function parseRequestBody(body) {
    if (!body) {
        throw new Error('Request body is required');
    }
    try {
        return JSON.parse(body);
    }
    catch {
        throw new Error('Invalid JSON in request body');
    }
}
/**
 * Invoke AI engine and validate output with retry logic
 * Per 12_ai_prompts.md section 8 and 15_ai_output_enforcement.md section 11
 */
async function invokeAndValidateAI(input) {
    const MAX_VALIDATION_RETRIES = 2;
    let retryPrompt;
    let totalRetries = 0;
    for (let attempt = 0; attempt <= MAX_VALIDATION_RETRIES; attempt++) {
        // Invoke AI engine
        const { output, retryCount } = await (0, ai_engine_1.invokeAIEngineWithRetry)(input, retryPrompt);
        totalRetries += retryCount;
        // Validate output
        const outputValidation = (0, output_enforcer_1.validateAIOutput)(output);
        if (outputValidation.valid) {
            return { output, retryCount: totalRetries };
        }
        // Generate retry prompt for next attempt
        // Per 15_ai_output_enforcement.md: "Re-prompt AI with correction instruction"
        retryPrompt = (0, output_enforcer_1.generateRetryPrompt)(outputValidation.errors);
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
                reason: 'A reliable recommendation could not be generated that meets our quality standards.',
                missing_or_conflicting_inputs: [
                    'Internal validation constraints were not satisfied',
                    'The AI engine produced output that did not meet constitutional requirements',
                ],
                safe_next_step: 'Please try again with more specific inputs, or contact support if the issue persists.',
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
function generateImmediateRefusal(conflicts, input) {
    const conflictMessages = {
        guarantee_requested: 'Safari experiences involve natural wildlife and cannot guarantee specific sightings.',
        inputs_conflict_unbounded: 'Your budget range conflicts with the comfort level or coverage selected.',
        missing_material_inputs: 'Key information (dates, preferences, or budget) is missing, preventing a reliable recommendation.',
    };
    const missingInputs = conflicts.map((c) => conflictMessages[c] || `Constraint violation: ${c}`);
    // Add specific guidance based on what's unknown
    if (input.user_context.dates.type === 'unknown') {
        missingInputs.push('Travel dates are not specified, which significantly affects availability and pricing.');
    }
    if (input.user_context.budget_band === 'unknown') {
        missingInputs.push('Budget range is not specified, which determines the tier of accommodations available.');
    }
    return {
        type: 'refusal',
        refusal: {
            reason: 'A reliable recommendation is not possible because the constraints conflict or key information is missing.',
            missing_or_conflicting_inputs: missingInputs.slice(0, 5), // Max 5 per schema
            safe_next_step: 'Clarify your priorities or provide the missing information, then request a new recommendation.',
        },
    };
}
/**
 * Create a success response with decision response structure
 * Returns decision_id for tracking per 10_data_model.md
 */
function createSuccessResponse(response) {
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
function createErrorResponse(statusCode, message, details) {
    return {
        statusCode,
        headers: CORS_HEADERS,
        body: JSON.stringify({
            error: message,
            details,
        }),
    };
}
/**
 * Create a capacity refusal response for request coalescing
 * Returns a valid DecisionResponse with SERVICE_DEGRADED code
 * Includes retry guidance for the frontend
 */
function createCapacityRefusal(retryAfterSeconds) {
    const refusalOutput = {
        type: 'refusal',
        refusal: {
            code: 'SERVICE_DEGRADED',
            reason: 'The decision service is currently at capacity. Please try again shortly.',
            missing_or_conflicting_inputs: [
                'Multiple requests for this decision are being processed',
                `Please retry in ${retryAfterSeconds} seconds`,
            ],
            safe_next_step: `Wait ${retryAfterSeconds} seconds and refresh the page, or try a different decision topic.`,
        },
    };
    const response = {
        decision_id: `dec_cap_${Date.now().toString(36)}`,
        output: refusalOutput,
        metadata: {
            logic_version: LOGIC_VERSION,
            ai_used: false,
            retry_count: 0,
            persisted: false,
        },
    };
    return {
        statusCode: 200,
        headers: {
            ...CORS_HEADERS,
            'X-Decision-Id': response.decision_id,
            'X-Logic-Version': LOGIC_VERSION,
            'X-Retry-After': String(retryAfterSeconds),
        },
        body: JSON.stringify(response),
    };
}
//# sourceMappingURL=handler.js.map