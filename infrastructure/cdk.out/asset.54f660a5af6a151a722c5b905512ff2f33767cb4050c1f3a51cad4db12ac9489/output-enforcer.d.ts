/**
 * Safari Index Output Enforcer
 * Enforces verdict-or-refusal logic and validates AI output
 * Aligned with:
 * - 02_decision_doctrine.md (decision rules)
 * - 08_ai_behavior.md (output constraints)
 * - 12_ai_prompts.md (output schemas, forbidden patterns)
 */
import { ValidationResult, ValidationError } from './types';
/**
 * Detects forbidden phrases in text
 * Returns list of detected violations
 */
export declare function detectForbiddenPhrases(text: string): string[];
/**
 * Detects guarantee language that violates the constitution
 */
export declare function detectGuarantees(text: string): string[];
/**
 * Detects self-reference that violates constitution
 */
export declare function detectSelfReference(text: string): string[];
/**
 * Detects emojis in text (forbidden in output)
 */
export declare function detectEmojis(text: string): boolean;
/**
 * Detects exclamation marks (forbidden in output per voice rules)
 */
export declare function detectExclamationMarks(text: string): boolean;
/**
 * Main output validation function
 * Enforces verdict-or-refusal logic per constitution
 */
export declare function validateAIOutput(rawOutput: unknown): ValidationResult;
/**
 * Generates the retry prompt for invalid outputs
 * Per 12_ai_prompts.md section 8
 */
export declare function generateRetryPrompt(errors: ValidationError[]): string;
//# sourceMappingURL=output-enforcer.d.ts.map