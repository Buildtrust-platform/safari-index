/**
 * Decision Assurance Generator
 *
 * Per 02_decision_doctrine.md:
 * - Assurance must NEVER change the decision outcome
 * - Assurance must NEVER promise certainty
 * - Refuse to generate if decision quality is insufficient
 *
 * Per 06_review_correction.md:
 * - Decisions flagged for review cannot have assurance issued
 */

import { randomUUID } from 'crypto';
import {
  DecisionAssuranceArtifact,
  AssuranceRecord,
  AssuranceRequest,
  AssuranceResult,
  AssuranceErrorCode,
  ASSURANCE_CONFIDENCE_THRESHOLD,
  ASSURANCE_PRICING,
} from './types';
import { getDecision } from '../db/decision-store';
import { DecisionRecord } from '../db/types';

const LOGIC_VERSION = process.env.LOGIC_VERSION || 'rules_v1.0';
const PROMPT_VERSION = process.env.PROMPT_VERSION || 'prompt_v1.0';

/**
 * Generate assurance ID
 */
function generateAssuranceId(): string {
  return `asr_${randomUUID().replace(/-/g, '').substring(0, 12)}`;
}

/**
 * Convert numeric confidence to label
 */
function getConfidenceLabel(confidence: number): 'High' | 'Medium' | 'Low' {
  if (confidence >= 0.7) return 'High';
  if (confidence >= 0.5) return 'Medium';
  return 'Low';
}

/**
 * Build invalidation checklist from decision
 * Per 02_decision_doctrine.md: decisions are conditional
 */
function buildInvalidationChecklist(decision: DecisionRecord): string[] {
  const checklist: string[] = [];

  // Add change conditions as invalidation triggers
  if (decision.change_conditions) {
    checklist.push(...decision.change_conditions);
  }

  // Add assumption-based invalidations
  if (decision.assumptions) {
    decision.assumptions.forEach((a) => {
      if (a.confidence < 0.7) {
        checklist.push(`Verify assumption: ${a.text}`);
      }
    });
  }

  // Standard invalidations
  checklist.push('If travel dates change by more than 2 weeks');
  checklist.push('If group size or composition changes');
  checklist.push('If budget constraints change significantly');

  return checklist.slice(0, 8); // Cap at 8 items
}

/**
 * Validate decision is eligible for assurance
 * Per 02_decision_doctrine.md: refuse rather than issue weak assurance
 */
function validateDecisionForAssurance(
  decision: DecisionRecord
): { valid: boolean; error?: AssuranceErrorCode; message?: string } {
  // Check 1: Decision must be ISSUED (not refused)
  if (decision.state === 'REFUSED') {
    return {
      valid: false,
      error: 'DECISION_IS_REFUSAL',
      message: 'Assurance cannot be issued for refused decisions',
    };
  }

  // Check 2: Decision must not be flagged for review
  if (decision.review?.needs_review) {
    return {
      valid: false,
      error: 'DECISION_FLAGGED_FOR_REVIEW',
      message: 'This decision is under review and assurance cannot be issued',
    };
  }

  // Check 3: Confidence must meet threshold
  if (decision.confidence < ASSURANCE_CONFIDENCE_THRESHOLD) {
    return {
      valid: false,
      error: 'CONFIDENCE_BELOW_THRESHOLD',
      message: `Decision confidence (${(decision.confidence * 100).toFixed(0)}%) is below the assurance threshold`,
    };
  }

  // Check 4: Required fields must exist
  if (!decision.verdict?.outcome || !decision.verdict?.summary) {
    return {
      valid: false,
      error: 'MISSING_REQUIRED_FIELDS',
      message: 'Decision is missing required verdict fields',
    };
  }

  if (!decision.assumptions || decision.assumptions.length < 2) {
    return {
      valid: false,
      error: 'MISSING_REQUIRED_FIELDS',
      message: 'Decision is missing sufficient assumptions',
    };
  }

  if (!decision.tradeoffs?.gains?.length || !decision.tradeoffs?.losses?.length) {
    return {
      valid: false,
      error: 'MISSING_REQUIRED_FIELDS',
      message: 'Decision is missing trade-off analysis',
    };
  }

  return { valid: true };
}

/**
 * Generate Decision Assurance artifact from a decision
 *
 * GOVERNANCE ENFORCEMENT:
 * - This function COPIES the decision, it does NOT modify it
 * - Validation gates prevent weak decisions from receiving assurance
 * - The artifact is a record of professional judgment, not a guarantee
 */
export async function generateAssurance(
  request: AssuranceRequest
): Promise<AssuranceResult> {
  // Fetch the decision
  const decision = await getDecision(request.decision_id);

  if (!decision) {
    return {
      success: false,
      error: 'Decision not found',
      error_code: 'DECISION_NOT_FOUND',
    };
  }

  // Validate decision is eligible for assurance
  const validation = validateDecisionForAssurance(decision);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.message,
      error_code: validation.error,
    };
  }

  // Extract topic_id from session_id (format: sess_page_<topic_id>)
  const topicId = decision.session_id?.replace('sess_page_', '') || 'unknown';

  // Build the assurance artifact
  // GOVERNANCE: This is an IMMUTABLE COPY of the decision
  const artifact: DecisionAssuranceArtifact = {
    assurance_id: generateAssuranceId(),
    decision_id: decision.decision_id,
    topic_id: topicId,

    verdict: {
      outcome: decision.verdict.outcome as 'book' | 'wait' | 'switch' | 'discard',
      headline: decision.verdict.headline,
      summary: decision.verdict.summary,
      confidence: decision.confidence,
      confidence_label: getConfidenceLabel(decision.confidence),
    },

    assumptions: decision.assumptions,
    tradeoffs: decision.tradeoffs,
    change_conditions: decision.change_conditions,
    invalidation_checklist: buildInvalidationChecklist(decision),

    created_at: new Date().toISOString(),
    logic_version: decision.logic_version || LOGIC_VERSION,
    prompt_version: PROMPT_VERSION,

    review_status: 'automated',
    reviewer_id: null,
    reviewed_at: null,

    payment_status: 'pending',
    payment_id: null,
  };

  return {
    success: true,
    assurance_id: artifact.assurance_id,
    artifact,
  };
}

/**
 * Build full assurance record for storage
 */
export function buildAssuranceRecord(
  artifact: DecisionAssuranceArtifact,
  sessionId: string,
  travelerId: string | null
): AssuranceRecord {
  const now = new Date().toISOString();

  return {
    assurance_id: artifact.assurance_id,
    decision_id: artifact.decision_id,
    topic_id: artifact.topic_id,
    traveler_id: travelerId,
    session_id: sessionId,

    created_at: now,
    updated_at: now,

    artifact,

    payment_status: 'pending',
    payment_id: null,
    payment_amount_cents: ASSURANCE_PRICING.BASE_PRICE_CENTS,
    payment_currency: ASSURANCE_PRICING.CURRENCY,

    download_count: 0,
    last_accessed_at: null,

    status: 'draft',
    revocation_reason: null,
  };
}
