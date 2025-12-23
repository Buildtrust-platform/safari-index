"use strict";
/**
 * Safari Index AI Engine Integration
 * Handles communication with AWS Bedrock (or other providers)
 * Provider-agnostic as per 12_ai_prompts.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.invokeAIEngine = invokeAIEngine;
exports.invokeAIEngineWithRetry = invokeAIEngineWithRetry;
exports.checkAIEngineHealth = checkAIEngineHealth;
const client_bedrock_runtime_1 = require("@aws-sdk/client-bedrock-runtime");
const prompts_1 = require("./prompts");
// Configuration
const BEDROCK_REGION = process.env.BEDROCK_REGION || 'us-east-1';
const MODEL_ID = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-sonnet-20240229-v1:0';
const MAX_RETRIES = 2;
// Initialize Bedrock client
const bedrockClient = new client_bedrock_runtime_1.BedrockRuntimeClient({ region: BEDROCK_REGION });
/**
 * Invoke the AI engine with the given input
 * Returns parsed AI output or throws on failure
 */
async function invokeAIEngine(input) {
    const taskPrompt = (0, prompts_1.getTaskPrompt)(input.task);
    const messages = [
        {
            role: 'user',
            content: `${taskPrompt}\n\nInput:\n${JSON.stringify(input, null, 2)}`,
        },
    ];
    const requestBody = {
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 4096,
        system: prompts_1.GLOBAL_SYSTEM_PROMPT,
        messages,
        temperature: 0.3, // Lower temperature for more consistent, analytical outputs
        top_p: 0.9,
    };
    const command = new client_bedrock_runtime_1.InvokeModelCommand({
        modelId: MODEL_ID,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify(requestBody),
    });
    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    // Extract text content from Claude response
    const textContent = responseBody.content?.find((block) => block.type === 'text');
    if (!textContent?.text) {
        throw new Error('No text content in AI response');
    }
    // Parse the JSON response
    const aiOutput = parseAIResponse(textContent.text);
    return aiOutput;
}
/**
 * Invoke AI engine with retry logic for invalid outputs
 * Per 12_ai_prompts.md section 8 retry mechanism
 */
async function invokeAIEngineWithRetry(input, retryPrompt) {
    let lastError = null;
    let retryCount = 0;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const taskPrompt = (0, prompts_1.getTaskPrompt)(input.task);
            // Build message content
            let userContent = `${taskPrompt}\n\nInput:\n${JSON.stringify(input, null, 2)}`;
            // Add retry instructions if this is a retry attempt
            if (attempt > 0 && retryPrompt) {
                userContent = `${retryPrompt}\n\n${userContent}`;
            }
            const messages = [
                {
                    role: 'user',
                    content: userContent,
                },
            ];
            const requestBody = {
                anthropic_version: 'bedrock-2023-05-31',
                max_tokens: 4096,
                system: prompts_1.GLOBAL_SYSTEM_PROMPT,
                messages,
                temperature: attempt === 0 ? 0.3 : 0.2, // Lower temperature on retries
                top_p: 0.9,
            };
            const command = new client_bedrock_runtime_1.InvokeModelCommand({
                modelId: MODEL_ID,
                contentType: 'application/json',
                accept: 'application/json',
                body: JSON.stringify(requestBody),
            });
            const response = await bedrockClient.send(command);
            const responseBody = JSON.parse(new TextDecoder().decode(response.body));
            const textContent = responseBody.content?.find((block) => block.type === 'text');
            if (!textContent?.text) {
                throw new Error('No text content in AI response');
            }
            const aiOutput = parseAIResponse(textContent.text);
            retryCount = attempt;
            return { output: aiOutput, retryCount };
        }
        catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            retryCount = attempt;
            // Don't retry on the last attempt
            if (attempt === MAX_RETRIES) {
                break;
            }
        }
    }
    throw lastError || new Error('AI engine invocation failed after retries');
}
/**
 * Parse AI response text into structured output
 * Handles potential JSON extraction from text
 */
function parseAIResponse(text) {
    // Try direct JSON parse first
    try {
        return JSON.parse(text);
    }
    catch {
        // Try to extract JSON from text (in case AI added extra text)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[0]);
            }
            catch {
                throw new Error('Failed to parse AI response as JSON');
            }
        }
        throw new Error('No valid JSON found in AI response');
    }
}
/**
 * Health check for AI engine connectivity
 */
async function checkAIEngineHealth() {
    try {
        const testInput = {
            task: 'CLARIFICATION',
            user_context: {
                traveler_type: 'unknown',
                budget_band: 'unknown',
                pace_preference: 'unknown',
                drive_tolerance_hours: 0,
                risk_tolerance: 'unknown',
                dates: { type: 'unknown' },
                group_size: 0,
                prior_decisions: [],
            },
            request: {
                question: 'Health check',
                scope: 'thin_edge_scope_only=true',
                destinations_considered: [],
                constraints: {},
            },
            facts: {
                known_constraints: [],
                known_tradeoffs: [],
                destination_notes: [],
            },
            policy: {
                must_refuse_if: [],
                forbidden_phrases: [],
            },
        };
        await invokeAIEngine(testInput);
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=ai-engine.js.map