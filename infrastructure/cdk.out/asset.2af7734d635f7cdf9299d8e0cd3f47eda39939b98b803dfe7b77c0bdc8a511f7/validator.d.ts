/**
 * Safari Index Input Validator
 * Validates inputs against the Standard Input Envelope schema
 * Aligned with: 12_ai_prompts.md section 2
 */
import { StandardInputEnvelope, ValidationResult } from './types';
/**
 * Validates the Standard Input Envelope
 * Returns validation result with specific errors
 */
export declare function validateInput(input: unknown): ValidationResult;
/**
 * Detects conflicts in user inputs that require refusal
 * Aligned with: 02_decision_doctrine.md section 7
 */
export declare function detectInputConflicts(input: StandardInputEnvelope): string[];
//# sourceMappingURL=validator.d.ts.map