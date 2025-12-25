/**
 * Safari Index AI Engine Integration
 * Handles communication with AWS Bedrock (or other providers)
 * Provider-agnostic as per 12_ai_prompts.md
 *
 * Evidence injection:
 * - KB evidence is retrieved and injected into prompts for grounding
 * - Evidence injection is optional and fails closed (engine works without KB)
 * - No schema changes to AI output
 */

import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import { StandardInputEnvelope, AIOutput } from './types';
import { GLOBAL_SYSTEM_PROMPT, getTaskPrompt } from './prompts';
import {
  getEvidenceForTopic,
  formatEvidenceForPrompt,
  inferTagsFromInputs,
  isKBAvailable,
} from './kb';

// Configuration
const BEDROCK_REGION = process.env.BEDROCK_REGION || 'us-west-2';
const MODEL_ID = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-haiku-20240307-v1:0';
const MAX_RETRIES = 2;

// Initialize Bedrock client
const bedrockClient = new BedrockRuntimeClient({ region: BEDROCK_REGION });

/**
 * Invoke the AI engine with the given input
 * Returns parsed AI output or throws on failure
 */
export async function invokeAIEngine(
  input: StandardInputEnvelope
): Promise<AIOutput> {
  const taskPrompt = getTaskPrompt(input.task);

  const messages = [
    {
      role: 'user',
      content: `${taskPrompt}\n\nInput:\n${JSON.stringify(input, null, 2)}`,
    },
  ];

  const requestBody = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 4096,
    system: GLOBAL_SYSTEM_PROMPT,
    messages,
    temperature: 0.3, // Lower temperature for more consistent, analytical outputs
    top_p: 0.9,
  };

  const command = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(requestBody),
  });

  const response = await bedrockClient.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));

  // Extract text content from Claude response
  const textContent = responseBody.content?.find(
    (block: { type: string }) => block.type === 'text'
  );

  if (!textContent?.text) {
    throw new Error('No text content in AI response');
  }

  // Parse the JSON response
  const aiOutput = parseAIResponse(textContent.text);
  return aiOutput;
}

/**
 * Get evidence context for a topic (fails closed - returns empty string if KB unavailable)
 */
function getEvidenceContext(input: StandardInputEnvelope): string {
  try {
    // Only inject evidence for DECISION tasks
    if (input.task !== 'DECISION') {
      return '';
    }

    // Check if KB is available
    if (!isKBAvailable()) {
      return '';
    }

    // Extract topic ID from request scope
    const topicId = extractTopicIdFromScope(input.request.scope);
    if (!topicId) {
      return '';
    }

    // Infer additional tags from user inputs
    const additionalTags = inferTagsFromInputs({
      destinations: input.request.destinations_considered,
      budget_band: input.user_context.budget_band,
      traveler_type: input.user_context.traveler_type,
      dates: input.user_context.dates.month
        ? { month: input.user_context.dates.month }
        : undefined,
    });

    // Retrieve evidence cards
    const evidenceCards = getEvidenceForTopic(topicId, additionalTags, 8);

    if (evidenceCards.length === 0) {
      return '';
    }

    // Format for prompt injection
    return formatEvidenceForPrompt(evidenceCards);
  } catch (error) {
    // Fail closed - log and return empty
    console.warn('Evidence retrieval failed (continuing without):', error);
    return '';
  }
}

/**
 * Extract topic ID from request scope string
 */
function extractTopicIdFromScope(scope: string): string | null {
  // Scope format: "topic_id=xxx" or contains topic_id somewhere
  const match = scope.match(/topic_id=([a-z0-9-]+)/i);
  return match ? match[1] : null;
}

/**
 * Invoke AI engine with retry logic for invalid outputs
 * Per 12_ai_prompts.md section 8 retry mechanism
 */
export async function invokeAIEngineWithRetry(
  input: StandardInputEnvelope,
  retryPrompt?: string
): Promise<{ output: AIOutput; retryCount: number }> {
  let lastError: Error | null = null;
  let retryCount = 0;

  // Get evidence context (optional, fails closed)
  const evidenceContext = getEvidenceContext(input);

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const taskPrompt = getTaskPrompt(input.task);

      // Build message content with optional evidence injection
      let userContent = '';

      // Add evidence context if available (before task prompt)
      if (evidenceContext && attempt === 0) {
        userContent = `${evidenceContext}\n`;
      }

      userContent += `${taskPrompt}\n\nInput:\n${JSON.stringify(input, null, 2)}`;

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
        system: GLOBAL_SYSTEM_PROMPT,
        messages,
        temperature: attempt === 0 ? 0.3 : 0.2, // Lower temperature on retries
        top_p: 0.9,
      };

      const command = new InvokeModelCommand({
        modelId: MODEL_ID,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify(requestBody),
      });

      const response = await bedrockClient.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));

      const textContent = responseBody.content?.find(
        (block: { type: string }) => block.type === 'text'
      );

      if (!textContent?.text) {
        throw new Error('No text content in AI response');
      }

      const aiOutput = parseAIResponse(textContent.text);
      retryCount = attempt;

      return { output: aiOutput, retryCount };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      retryCount = attempt;

      // Don't retry on the last attempt
      if (attempt === MAX_RETRIES) {
        break;
      }
    }
  }

  // Per governance: return refusal instead of throwing
  // This ensures the caller always receives a valid AIOutput
  const errorMessage = lastError?.message || 'AI engine invocation failed after retries';
  console.error('Bedrock invocation failed, returning governed refusal:', errorMessage);

  return {
    output: {
      type: 'refusal' as const,
      refusal: {
        code: 'SERVICE_DEGRADED',
        reason: 'The decision service is temporarily unable to process your request.',
        missing_or_conflicting_inputs: [
          'Service capacity constraints are currently active',
          'Please wait a moment before trying again',
        ],
        safe_next_step: 'Wait a few seconds and refresh the page, or try again later.',
      },
    },
    retryCount,
  };
}

/**
 * Parse AI response text into structured output
 * Handles potential JSON extraction from text
 */
function parseAIResponse(text: string): AIOutput {
  // Try direct JSON parse first
  try {
    return JSON.parse(text) as AIOutput;
  } catch {
    // Try to extract JSON from text (in case AI added extra text)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]) as AIOutput;
      } catch {
        throw new Error('Failed to parse AI response as JSON');
      }
    }
    throw new Error('No valid JSON found in AI response');
  }
}

/**
 * Health check for AI engine connectivity
 */
export async function checkAIEngineHealth(): Promise<boolean> {
  try {
    const testInput: StandardInputEnvelope = {
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
  } catch {
    return false;
  }
}
