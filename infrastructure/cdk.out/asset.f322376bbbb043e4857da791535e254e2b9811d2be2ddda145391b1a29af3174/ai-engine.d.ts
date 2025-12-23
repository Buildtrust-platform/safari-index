/**
 * Safari Index AI Engine Integration
 * Handles communication with AWS Bedrock (or other providers)
 * Provider-agnostic as per 12_ai_prompts.md
 */
import { StandardInputEnvelope, AIOutput } from './types';
/**
 * Invoke the AI engine with the given input
 * Returns parsed AI output or throws on failure
 */
export declare function invokeAIEngine(input: StandardInputEnvelope): Promise<AIOutput>;
/**
 * Invoke AI engine with retry logic for invalid outputs
 * Per 12_ai_prompts.md section 8 retry mechanism
 */
export declare function invokeAIEngineWithRetry(input: StandardInputEnvelope, retryPrompt?: string): Promise<{
    output: AIOutput;
    retryCount: number;
}>;
/**
 * Health check for AI engine connectivity
 */
export declare function checkAIEngineHealth(): Promise<boolean>;
//# sourceMappingURL=ai-engine.d.ts.map