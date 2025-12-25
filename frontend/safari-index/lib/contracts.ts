/**
 * AUTO-GENERATED - DO NOT EDIT DIRECTLY
 *
 * This file is synced from backend/contracts/index.ts
 * To update: edit backend/contracts/index.ts and run scripts/sync-contracts.sh
 *
 * Last synced: 2025-12-24T08:56:24Z
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

// ============================================================================
// Inquiry Contracts
// ============================================================================

/**
 * Budget band enum
 */
export const BudgetBandSchema = z.enum([
  'under-5k',
  '5k-10k',
  '10k-20k',
  '20k-35k',
  'above-35k',
  'flexible',
]);
export type BudgetBand = z.infer<typeof BudgetBandSchema>;

/**
 * Travel style enum
 */
export const TravelStyleSchema = z.enum([
  'solo',
  'couple',
  'family-young-kids',
  'family-teens',
  'multigenerational',
  'friends-group',
  'honeymoon',
]);
export type TravelStyle = z.infer<typeof TravelStyleSchema>;

/**
 * Inquiry status enum
 */
export const InquiryStatusSchema = z.enum([
  'new',
  'contacted',
  'quoted',
  'won',
  'lost',
]);
export type InquiryStatus = z.infer<typeof InquiryStatusSchema>;

/**
 * Inquiry request payload (POST /api/inquire)
 */
export const InquiryRequestSchema = z.object({
  trip_shape_id: z.string().nullable(),
  budget_band: BudgetBandSchema,
  travel_month: z.number().min(1).max(12).nullable(),
  travel_year: z.number().min(2024).max(2030).nullable(),
  traveler_count: z.number().min(1).max(20),
  travel_style: TravelStyleSchema,
  email: z.string().email(),
  whatsapp: z.string().nullable(),
  linked_decision_ids: z.array(z.string()),
  notes: z.string().nullable(),
  source_path: z.string().optional(),
});
export type InquiryRequest = z.infer<typeof InquiryRequestSchema>;

/**
 * Inquiry response (returned from POST /api/inquire)
 */
export const InquiryResponseSchema = z.object({
  inquiry_id: z.string(),
  created_at: z.string(),
});
export type InquiryResponse = z.infer<typeof InquiryResponseSchema>;

/**
 * Full inquiry record (stored in DynamoDB, returned from GET)
 */
export const InquiryRecordSchema = z.object({
  inquiry_id: z.string(),
  created_at: z.string(),
  status: InquiryStatusSchema,
  trip_shape_id: z.string().nullable(),
  budget_band: BudgetBandSchema,
  travel_month: z.number().nullable(),
  travel_year: z.number().nullable(),
  traveler_count: z.number(),
  travel_style: TravelStyleSchema,
  email: z.string(),
  whatsapp: z.string().nullable(),
  linked_decision_ids: z.array(z.string()),
  notes: z.string().nullable(),
  source_path: z.string().optional(),
});
export type InquiryRecord = z.infer<typeof InquiryRecordSchema>;

/**
 * Inquiry status update request (PATCH /api/ops/inquiries/[id])
 */
export const InquiryUpdateSchema = z.object({
  status: InquiryStatusSchema.optional(),
  notes: z.string().nullable().optional(),
});
export type InquiryUpdate = z.infer<typeof InquiryUpdateSchema>;

// ============================================================================
// Proposal Contracts
// ============================================================================

/**
 * Proposal status enum
 */
export const ProposalStatusSchema = z.enum(['draft', 'sent']);
export type ProposalStatus = z.infer<typeof ProposalStatusSchema>;

/**
 * Proposal create request (POST /api/ops/proposals)
 */
export const ProposalCreateSchema = z.object({
  inquiry_id: z.string(),
});
export type ProposalCreate = z.infer<typeof ProposalCreateSchema>;

/**
 * Proposal update request (PATCH /api/ops/proposals/[id])
 */
export const ProposalUpdateSchema = z.object({
  status: ProposalStatusSchema.optional(),
  operator_name: z.string().nullable().optional(),
  traveler_name: z.string().nullable().optional(),
  intro_note: z.string().nullable().optional(),
  recommended_trip_ids: z.array(z.string()).optional(),
  recommended_decision_ids: z.array(z.string()).optional(),
  pricing_notes: z.string().nullable().optional(),
  next_steps: z.string().nullable().optional(),
});
export type ProposalUpdate = z.infer<typeof ProposalUpdateSchema>;

/**
 * Full proposal record (stored in DynamoDB)
 */
export const ProposalRecordSchema = z.object({
  proposal_id: z.string(),
  inquiry_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  status: ProposalStatusSchema,
  operator_name: z.string().nullable(),
  traveler_name: z.string().nullable(),
  intro_note: z.string().nullable(),
  recommended_trip_ids: z.array(z.string()),
  recommended_decision_ids: z.array(z.string()),
  pricing_notes: z.string().nullable(),
  next_steps: z.string().nullable(),
  public_token: z.string(),
});
export type ProposalRecord = z.infer<typeof ProposalRecordSchema>;

/**
 * Public proposal response (GET /api/proposals/[token])
 * Includes hydrated data for display
 */
export const ProposalPublicResponseSchema = z.object({
  proposal: ProposalRecordSchema,
  inquiry: InquiryRecordSchema.pick({
    budget_band: true,
    travel_month: true,
    travel_year: true,
    traveler_count: true,
    travel_style: true,
  }),
});
