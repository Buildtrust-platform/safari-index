/**
 * Decision Assurance API Handler
 *
 * Per 02_decision_doctrine.md:
 * - Assurance is a paid artifact of professional judgment
 * - It never changes the underlying decision
 * - It refuses to generate for weak decisions
 *
 * Endpoints:
 * - POST /assurance/generate - Generate assurance from decision_id
 * - GET /assurance/{id} - Retrieve assurance artifact
 * - POST /assurance/{id}/payment - Update payment status (webhook callback)
 */
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
/**
 * Handle POST /assurance/generate
 * Generates a new assurance artifact from an existing decision
 */
export declare function handleGenerateAssurance(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
/**
 * Handle GET /assurance/{assurance_id}
 * Retrieves an assurance artifact (only if payment is complete)
 */
export declare function handleGetAssurance(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
/**
 * Handle POST /assurance/{assurance_id}/payment
 * Updates payment status after successful Stripe payment
 *
 * Per governance:
 * - Idempotent: safe to call multiple times
 * - Only transitions from 'pending' to 'completed'
 * - Logs payment event for audit trail
 */
export declare function handleUpdatePayment(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
//# sourceMappingURL=assurance-handler.d.ts.map