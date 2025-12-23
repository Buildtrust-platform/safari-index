/**
 * Response Adapters
 *
 * Normalize and validate API responses.
 * Invalid responses throw ContractError which routes to existing error paths.
 *
 * Per observation mode constraints:
 * - No new error messages
 * - Routes failures to existing calm error states
 * - Preserves all existing behavior for valid responses
 */

import { ZodError, ZodSchema } from 'zod';
import {
  DecisionResponseSchema,
  AssuranceResponseSchema,
  AnswersListResponseSchema,
  AnswerBlockSchema,
  DecisionResponse,
  AssuranceResponse,
  AnswersListResponse,
  AnswerBlock,
} from './contracts';

/**
 * Typed contract validation error
 * Contains details for logging but surfaces generic message to UI
 */
export class ContractError extends Error {
  public readonly zodError?: ZodError;
  public readonly rawData?: unknown;

  constructor(message: string, zodError?: ZodError, rawData?: unknown) {
    super(message);
    this.name = 'ContractError';
    this.zodError = zodError;
    this.rawData = rawData;

    // Dev-only logging (does not affect output)
    if (process.env.NODE_ENV !== 'production') {
      console.error('[ContractError]', message);
      if (zodError) {
        console.error('[ContractError] Validation issues:', zodError.issues);
      }
    }
  }
}

/**
 * Generic validator function type
 */
export type Validator<T> = (data: unknown) => T;

/**
 * Create a validator from a zod schema
 * Returns a function that validates and returns typed data or throws ContractError
 */
export function createValidator<T>(
  schema: ZodSchema<T>,
  entityName: string
): Validator<T> {
  return (data: unknown): T => {
    const result = schema.safeParse(data);
    if (!result.success) {
      throw new ContractError(
        `Invalid ${entityName} response shape`,
        result.error,
        data
      );
    }
    return result.data;
  };
}

/**
 * Normalize and validate DecisionResponse
 * Throws ContractError on invalid shape
 */
export const normalizeDecisionResponse: Validator<DecisionResponse> =
  createValidator(DecisionResponseSchema, 'DecisionResponse');

/**
 * Normalize and validate AssuranceResponse
 * Throws ContractError on invalid shape
 */
export const normalizeAssuranceResponse: Validator<AssuranceResponse> =
  createValidator(AssuranceResponseSchema, 'AssuranceResponse');

/**
 * Normalize and validate AnswersListResponse
 * Throws ContractError on invalid shape
 */
export const normalizeAnswersListResponse: Validator<AnswersListResponse> =
  createValidator(AnswersListResponseSchema, 'AnswersListResponse');

/**
 * Normalize and validate single AnswerBlock
 * Throws ContractError on invalid shape
 */
export const normalizeAnswerBlock: Validator<AnswerBlock> =
  createValidator(AnswerBlockSchema, 'AnswerBlock');

/**
 * Safe validation wrapper - returns null instead of throwing
 * For cases where caller handles invalid state explicitly
 */
export function safeValidate<T>(
  validator: Validator<T>,
  data: unknown
): T | null {
  try {
    return validator(data);
  } catch (error) {
    if (error instanceof ContractError) {
      return null;
    }
    throw error;
  }
}

/**
 * Check if an error is a contract validation error
 */
export function isContractError(error: unknown): error is ContractError {
  return error instanceof ContractError;
}
