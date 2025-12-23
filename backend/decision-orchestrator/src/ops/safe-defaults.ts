/**
 * Safe Defaults for Degraded States
 *
 * Per task requirements:
 * - Define fallback behavior when services are unavailable
 * - Prefer refusal over weak or incorrect decisions
 * - No silent failures that could mislead users
 *
 * Philosophy: It is better to refuse than to guess.
 */

import { isBedrockCircuitOpen, isAssurancePaused } from './guardrails';

/**
 * Decision outcome types
 */
export type SafeOutcome = 'refuse' | 'defer' | 'cached';

/**
 * Safe decision response when AI is unavailable
 */
export interface SafeDecisionResponse {
  outcome: SafeOutcome;
  message: string;
  retryAfter?: number; // seconds
  cached?: {
    decisionId: string;
    generatedAt: string;
    isStale: boolean;
  };
}

/**
 * Safe assurance response when generation is unavailable
 */
export interface SafeAssuranceResponse {
  available: false;
  reason: string;
  retryAfter?: number;
}

/**
 * Get safe default decision when Bedrock is unavailable
 *
 * Per governance: prefer refusal over weak decisions
 */
export function getSafeDecisionDefault(
  topicId: string,
  cachedDecision?: { decisionId: string; generatedAt: string }
): SafeDecisionResponse {
  // If Bedrock circuit is open, we cannot generate new decisions
  if (isBedrockCircuitOpen()) {
    // If we have a cached decision less than 24 hours old, use it with warning
    if (cachedDecision) {
      const cacheAge = Date.now() - new Date(cachedDecision.generatedAt).getTime();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (cacheAge < twentyFourHours) {
        return {
          outcome: 'cached',
          message:
            'This decision was generated earlier. Real-time analysis is temporarily unavailable.',
          cached: {
            decisionId: cachedDecision.decisionId,
            generatedAt: cachedDecision.generatedAt,
            isStale: cacheAge > 12 * 60 * 60 * 1000, // Mark stale after 12 hours
          },
        };
      }
    }

    // No valid cache - refuse rather than guess
    return {
      outcome: 'refuse',
      message:
        'We cannot provide a decision at this time. Our analysis service is temporarily unavailable. Please try again later.',
      retryAfter: 300, // 5 minutes
    };
  }

  // Bedrock is available but something else failed
  return {
    outcome: 'defer',
    message:
      'We are experiencing a temporary issue. Please try again in a few moments.',
    retryAfter: 60,
  };
}

/**
 * Get safe default assurance response when generation is unavailable
 */
export function getSafeAssuranceDefault(): SafeAssuranceResponse {
  if (isAssurancePaused()) {
    return {
      available: false,
      reason:
        'Decision Assurance is temporarily unavailable. Your decision is still valid. Please try again later to generate documentation.',
      retryAfter: 600, // 10 minutes
    };
  }

  return {
    available: false,
    reason: 'Assurance generation encountered an issue. Please try again.',
    retryAfter: 60,
  };
}

/**
 * Safe embed response when embeds are disabled
 */
export interface SafeEmbedResponse {
  available: false;
  fallbackHtml: string;
}

export function getSafeEmbedDefault(decisionId: string): SafeEmbedResponse {
  return {
    available: false,
    fallbackHtml: `
      <div style="padding: 20px; border: 1px solid #e5e5e5; border-radius: 4px; font-family: system-ui, sans-serif; max-width: 600px;">
        <p style="margin: 0; color: #666; font-size: 14px;">
          Decision embed temporarily unavailable.
          <a href="https://safariindex.com/decisions/${decisionId}" style="color: #333; text-decoration: underline;">
            View decision on Safari Index
          </a>
        </p>
      </div>
    `.trim(),
  };
}

/**
 * Check if system is in degraded mode
 * Returns true if any major service is unavailable
 */
export function isSystemDegraded(): boolean {
  return isBedrockCircuitOpen() || isAssurancePaused();
}

/**
 * Get system status message for users
 */
export function getSystemStatusMessage(): string | null {
  if (isBedrockCircuitOpen()) {
    return 'Some features are temporarily unavailable. Cached decisions may be shown.';
  }

  if (isAssurancePaused()) {
    return 'Decision Assurance is temporarily unavailable. Decisions are still being generated normally.';
  }

  return null;
}

/**
 * Safe follow-up response when notifications cannot be processed
 */
export interface SafeFollowUpResponse {
  subscribed: boolean;
  message: string;
}

export function getSafeFollowUpDefault(): SafeFollowUpResponse {
  return {
    subscribed: false,
    message:
      'We could not process your subscription at this time. Please try again later.',
  };
}

/**
 * Decision schema for validation
 * Used to detect schema violations
 */
export interface DecisionSchema {
  decisionId: string;
  topicId: string;
  outcome: 'book' | 'wait' | 'switch' | 'discard';
  confidence: number;
  reasoning: string;
  assumptions: Array<{ id: string; text: string; confidence: number }>;
  logicVersion: string;
}

/**
 * Validate decision output against schema
 * Returns list of violations (empty if valid)
 */
export function validateDecisionSchema(decision: unknown): string[] {
  const violations: string[] = [];

  if (!decision || typeof decision !== 'object') {
    violations.push('Decision is not an object');
    return violations;
  }

  const d = decision as Record<string, unknown>;

  // Required string fields
  const requiredStrings = ['decisionId', 'topicId', 'outcome', 'reasoning', 'logicVersion'];
  for (const field of requiredStrings) {
    if (typeof d[field] !== 'string' || d[field] === '') {
      violations.push(`Missing or invalid ${field}`);
    }
  }

  // Outcome must be valid enum
  if (!['book', 'wait', 'switch', 'discard'].includes(d.outcome as string)) {
    violations.push(`Invalid outcome: ${d.outcome}`);
  }

  // Confidence must be 0-1
  if (typeof d.confidence !== 'number' || d.confidence < 0 || d.confidence > 1) {
    violations.push(`Invalid confidence: ${d.confidence}`);
  }

  // Assumptions must be array
  if (!Array.isArray(d.assumptions)) {
    violations.push('Assumptions is not an array');
  }

  return violations;
}
