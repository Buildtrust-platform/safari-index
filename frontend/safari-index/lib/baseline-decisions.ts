/**
 * Baseline Decision Loader
 *
 * Provides utilities for loading baseline decisions and detecting
 * capacity/service refusals. Used to implement fallback rendering
 * when the live decision service is unavailable.
 *
 * Per implementation requirements:
 * - Static imports (no fs at runtime)
 * - Compatible with Next.js app router
 * - Detects SERVICE_DEGRADED and capacity-related refusals
 */

import {
  baselineDecisions,
  baselineTopicIds,
  type BaselineDecision,
} from '../app/content/baseline-decisions';
import type { RefusalOutput } from './contracts';

export type { BaselineDecision };

/**
 * Get baseline decision for a topic
 *
 * @param topicId - The topic ID to look up
 * @returns BaselineDecision if available, null otherwise
 */
export function getBaselineDecision(topicId: string): BaselineDecision | null {
  return baselineDecisions[topicId] || null;
}

/**
 * Check if a baseline decision exists for a topic
 *
 * @param topicId - The topic ID to check
 * @returns true if baseline exists
 */
export function hasBaselineDecision(topicId: string): boolean {
  return topicId in baselineDecisions;
}

/**
 * Get list of topic IDs with baseline decisions
 */
export function getBaselineTopicIds(): string[] {
  return baselineTopicIds;
}

/**
 * Capacity/service refusal detection phrases
 *
 * These phrases indicate the refusal is due to service capacity
 * rather than user input issues.
 */
const CAPACITY_REFUSAL_PHRASES = [
  'at capacity',
  'temporarily unable',
  'temporarily unavailable',
  'service is temporarily',
  'capacity constraints',
  'try again later',
  'wait before trying',
  'service degraded',
];

/**
 * Check if a refusal is due to service capacity/degradation
 *
 * Detects refusals that should trigger baseline fallback:
 * - SERVICE_DEGRADED refusal code
 * - Reason text containing capacity-related phrases
 *
 * @param output - The response output to check
 * @returns true if this is a capacity/service refusal
 */
export function isCapacityOrServiceRefusal(output: {
  type: string;
  refusal?: RefusalOutput;
}): boolean {
  // Not a refusal
  if (output.type !== 'refusal' || !output.refusal) {
    return false;
  }

  const refusal = output.refusal;

  // Check for SERVICE_DEGRADED code
  if (refusal.code === 'SERVICE_DEGRADED') {
    return true;
  }

  // Check reason text for capacity-related phrases
  const reasonLower = refusal.reason.toLowerCase();
  for (const phrase of CAPACITY_REFUSAL_PHRASES) {
    if (reasonLower.includes(phrase)) {
      return true;
    }
  }

  // Check safe_next_step for capacity-related phrases
  const nextStepLower = refusal.safe_next_step.toLowerCase();
  for (const phrase of CAPACITY_REFUSAL_PHRASES) {
    if (nextStepLower.includes(phrase)) {
      return true;
    }
  }

  return false;
}
