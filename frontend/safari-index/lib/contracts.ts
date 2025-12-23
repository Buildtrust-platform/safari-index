/**
 * AUTO-GENERATED - DO NOT EDIT DIRECTLY
 *
 * This file is synced from backend/contracts/index.ts
 * To update: edit backend/contracts/index.ts and run scripts/sync-contracts.sh
 *
 * Last synced: 2025-12-23T20:18:19Z
 */

import { z } from 'zod';


// ============================================================================
// Decision Response Contracts
// ============================================================================

/**
 * Outcome enum - the four possible verdicts
 */
export const OutcomeSchema = z.enum(['book', 'wait', 'switch', 'discard']);
export type Outcome = z.infer<typeof OutcomeSchema>;

/**
 * Confidence label enum
 */
export const ConfidenceLabelSchema = z.enum(['High', 'Medium', 'Low']);
export type ConfidenceLabel = z.infer<typeof ConfidenceLabelSchema>;

/**
 * Assumption item
 */
export const AssumptionSchema = z.object({
  id: z.string(),
  text: z.string(),
  confidence: z.number(),
});
export type Assumption = z.infer<typeof AssumptionSchema>;

/**
 * Tradeoffs structure
 */
export const TradeoffsSchema = z.object({
  gains: z.array(z.string()),
  losses: z.array(z.string()),
});
export type Tradeoffs = z.infer<typeof TradeoffsSchema>;

/**
 * Decision output (when type = 'decision')
 */
export const DecisionOutputSchema = z.object({
  outcome: OutcomeSchema,
  headline: z.string(),
  summary: z.string(),
  assumptions: z.array(AssumptionSchema),
  tradeoffs: TradeoffsSchema,
  change_conditions: z.array(z.string()),
  confidence: z.number(),
});
export type DecisionOutput = z.infer<typeof DecisionOutputSchema>;

/**
 * Refusal codes for categorizing refusal types
 * SERVICE_DEGRADED: Temporary service issue (rate limiting, timeouts)
 * MISSING_INPUTS: Required information not provided
 * CONFLICTING_INPUTS: User inputs are contradictory
 * GUARANTEE_REQUESTED: User asked for guarantees we cannot provide
 */
export const RefusalCodeSchema = z.enum([
  'SERVICE_DEGRADED',
  'MISSING_INPUTS',
  'CONFLICTING_INPUTS',
  'GUARANTEE_REQUESTED',
]);
export type RefusalCode = z.infer<typeof RefusalCodeSchema>;

/**
 * Refusal output (when type = 'refusal')
 */
export const RefusalOutputSchema = z.object({
  code: RefusalCodeSchema.optional(), // Optional for backwards compatibility
  reason: z.string(),
  missing_or_conflicting_inputs: z.array(z.string()),
  safe_next_step: z.string(),
});
export type RefusalOutput = z.infer<typeof RefusalOutputSchema>;

/**
 * Decision response - main API response from /decision/evaluate
 */
export const DecisionResponseSchema = z.object({
  decision_id: z.string(),
  output: z.object({
    type: z.enum(['decision', 'refusal']),
    decision: DecisionOutputSchema.optional(),
    refusal: RefusalOutputSchema.optional(),
  }),
  metadata: z.object({
    logic_version: z.string(),
    ai_used: z.boolean(),
  }),
});
export type DecisionResponse = z.infer<typeof DecisionResponseSchema>;

// ============================================================================
// Assurance Contracts
// ============================================================================

/**
 * Verdict block in assurance artifact
 */
export const VerdictSchema = z.object({
  outcome: OutcomeSchema,
  headline: z.string(),
  summary: z.string(),
  confidence: z.number(),
  confidence_label: ConfidenceLabelSchema,
});
export type Verdict = z.infer<typeof VerdictSchema>;

/**
 * Assurance artifact - immutable copy of decision
 */
export const AssuranceArtifactSchema = z.object({
  assurance_id: z.string(),
  decision_id: z.string(),
  topic_id: z.string(),
  verdict: VerdictSchema,
  assumptions: z.array(AssumptionSchema),
  tradeoffs: TradeoffsSchema,
  change_conditions: z.array(z.string()),
  invalidation_checklist: z.array(z.string()),
  created_at: z.string(),
  logic_version: z.string(),
  review_status: z.string(),
});
export type AssuranceArtifact = z.infer<typeof AssuranceArtifactSchema>;

/**
 * Assurance response - GET /assurance/{id}
 */
export const AssuranceResponseSchema = z.object({
  assurance_id: z.string(),
  decision_id: z.string(),
  status: z.string(),
  artifact: AssuranceArtifactSchema,
  access: z.object({
    download_count: z.number(),
    first_accessed: z.boolean(),
  }),
});
export type AssuranceResponse = z.infer<typeof AssuranceResponseSchema>;

// ============================================================================
// Answers API Contracts
// ============================================================================

/**
 * Answer block - /api/answers response item
 */
export const AnswerBlockSchema = z.object({
  topicId: z.string(),
  question: z.string(),
  verdict: z.string(),
  outcome: OutcomeSchema,
  confidence: z.object({
    score: z.number(),
    label: ConfidenceLabelSchema,
  }),
  canonicalUrl: z.string(),
  version: z.object({
    current: z.string(),
    issuedAt: z.string(),
    logicVersion: z.string(),
  }),
  attribution: z.object({
    source: z.literal('Safari Index'),
    type: z.literal('decision'),
  }),
});
export type AnswerBlock = z.infer<typeof AnswerBlockSchema>;

/**
 * Answers list response
 */
export const AnswersListResponseSchema = z.object({
  count: z.number(),
  answers: z.array(AnswerBlockSchema),
  meta: z.object({
    source: z.string(),
    description: z.string(),
    terms: z.string(),
    endpoints: z.object({
      list: z.string(),
      single: z.string(),
      versioned: z.string(),
    }),
  }),
});
export type AnswersListResponse = z.infer<typeof AnswersListResponseSchema>;

// ============================================================================
// Event Contracts
// ============================================================================

/**
 * Embed event types
 */
export const EmbedEventTypeSchema = z.enum(['EMBED_RENDERED', 'EMBED_VIEWED', 'EMBED_CLICKED']);
export type EmbedEventType = z.infer<typeof EmbedEventTypeSchema>;

/**
 * Embed event payload
 */
export const EmbedEventSchema = z.object({
  event_type: EmbedEventTypeSchema,
  decision_id: z.string(),
  answer_version: z.string(),
  referrer: z.string().optional(),
  timestamp: z.string(),
});
export type EmbedEvent = z.infer<typeof EmbedEventSchema>;

/**
 * Embed event response (fire-and-forget, minimal validation)
 */
export const EmbedEventResponseSchema = z.object({
  status: z.string().optional(),
  received: z.boolean().optional(),
}).passthrough();
export type EmbedEventResponse = z.infer<typeof EmbedEventResponseSchema>;

// ============================================================================
// Follow-up Subscription Contracts
// ============================================================================

/**
 * Follow-up subscription request
 */
export const FollowUpSubscriptionSchema = z.object({
  decision_id: z.string(),
  topic_id: z.string(),
  email: z.string().email(),
  logic_version: z.string(),
  confidence: z.number(),
});
export type FollowUpSubscription = z.infer<typeof FollowUpSubscriptionSchema>;
