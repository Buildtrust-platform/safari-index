"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAIEngineHealth = exports.invokeAIEngineWithRetry = exports.invokeAIEngine = exports.getTaskPrompt = exports.REVISION_TASK_PROMPT = exports.TRADEOFF_EXPLANATION_TASK_PROMPT = exports.CLARIFICATION_TASK_PROMPT = exports.REFUSAL_TASK_PROMPT = exports.DECISION_TASK_PROMPT = exports.GLOBAL_SYSTEM_PROMPT = exports.generateRetryPrompt = exports.detectGuarantees = exports.detectForbiddenPhrases = exports.validateAIOutput = exports.detectInputConflicts = exports.validateInput = exports.handler = void 0;
// Export handler for Lambda
var handler_1 = require("./handler");
Object.defineProperty(exports, "handler", { enumerable: true, get: function () { return handler_1.handler; } });
// Export types for use in other packages
__exportStar(require("./types"), exports);
// Export validation utilities
var validator_1 = require("./validator");
Object.defineProperty(exports, "validateInput", { enumerable: true, get: function () { return validator_1.validateInput; } });
Object.defineProperty(exports, "detectInputConflicts", { enumerable: true, get: function () { return validator_1.detectInputConflicts; } });
// Export output enforcement utilities
var output_enforcer_1 = require("./output-enforcer");
Object.defineProperty(exports, "validateAIOutput", { enumerable: true, get: function () { return output_enforcer_1.validateAIOutput; } });
Object.defineProperty(exports, "detectForbiddenPhrases", { enumerable: true, get: function () { return output_enforcer_1.detectForbiddenPhrases; } });
Object.defineProperty(exports, "detectGuarantees", { enumerable: true, get: function () { return output_enforcer_1.detectGuarantees; } });
Object.defineProperty(exports, "generateRetryPrompt", { enumerable: true, get: function () { return output_enforcer_1.generateRetryPrompt; } });
// Export prompts for reference/testing
var prompts_1 = require("./prompts");
Object.defineProperty(exports, "GLOBAL_SYSTEM_PROMPT", { enumerable: true, get: function () { return prompts_1.GLOBAL_SYSTEM_PROMPT; } });
Object.defineProperty(exports, "DECISION_TASK_PROMPT", { enumerable: true, get: function () { return prompts_1.DECISION_TASK_PROMPT; } });
Object.defineProperty(exports, "REFUSAL_TASK_PROMPT", { enumerable: true, get: function () { return prompts_1.REFUSAL_TASK_PROMPT; } });
Object.defineProperty(exports, "CLARIFICATION_TASK_PROMPT", { enumerable: true, get: function () { return prompts_1.CLARIFICATION_TASK_PROMPT; } });
Object.defineProperty(exports, "TRADEOFF_EXPLANATION_TASK_PROMPT", { enumerable: true, get: function () { return prompts_1.TRADEOFF_EXPLANATION_TASK_PROMPT; } });
Object.defineProperty(exports, "REVISION_TASK_PROMPT", { enumerable: true, get: function () { return prompts_1.REVISION_TASK_PROMPT; } });
Object.defineProperty(exports, "getTaskPrompt", { enumerable: true, get: function () { return prompts_1.getTaskPrompt; } });
// Export AI engine utilities
var ai_engine_1 = require("./ai-engine");
Object.defineProperty(exports, "invokeAIEngine", { enumerable: true, get: function () { return ai_engine_1.invokeAIEngine; } });
Object.defineProperty(exports, "invokeAIEngineWithRetry", { enumerable: true, get: function () { return ai_engine_1.invokeAIEngineWithRetry; } });
Object.defineProperty(exports, "checkAIEngineHealth", { enumerable: true, get: function () { return ai_engine_1.checkAIEngineHealth; } });
// Export database/persistence utilities
__exportStar(require("./db"), exports);
//# sourceMappingURL=index.js.map