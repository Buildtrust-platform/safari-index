/**
 * Safari Index Decision Orchestrator
 *
 * Lambda function that validates inputs and enforces verdict-or-refusal logic
 * before calling the AI engine.
 *
 * Constitutional alignment:
 * - 02_decision_doctrine.md: Decision philosophy and responsibility
 * - 08_ai_behavior.md: AI prompt and behavior rules
 * - 10_data_model.md: Persistence and event logging
 * - 11_mvp_build_plan.md: MVP requirements
 * - 12_ai_prompts.md: System prompts and output schemas
 * - 15_ai_output_enforcement.md: Runtime enforcement rules
 */

// Export handler for Lambda
export { handler } from './handler';

// Export types for use in other packages
export * from './types';

// Export validation utilities
export { validateInput, detectInputConflicts } from './validator';

// Export output enforcement utilities
export {
  validateAIOutput,
  detectForbiddenPhrases,
  detectGuarantees,
  generateRetryPrompt,
} from './output-enforcer';

// Export prompts for reference/testing
export {
  GLOBAL_SYSTEM_PROMPT,
  DECISION_TASK_PROMPT,
  REFUSAL_TASK_PROMPT,
  CLARIFICATION_TASK_PROMPT,
  TRADEOFF_EXPLANATION_TASK_PROMPT,
  REVISION_TASK_PROMPT,
  getTaskPrompt,
} from './prompts';

// Export AI engine utilities
export {
  invokeAIEngine,
  invokeAIEngineWithRetry,
  checkAIEngineHealth,
} from './ai-engine';

// Export database/persistence utilities
export * from './db';
