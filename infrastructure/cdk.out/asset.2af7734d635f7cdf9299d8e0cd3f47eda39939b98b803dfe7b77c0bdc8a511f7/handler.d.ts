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
/**
 * Main Lambda handler
 */
export declare function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
//# sourceMappingURL=handler.d.ts.map