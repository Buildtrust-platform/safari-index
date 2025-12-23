/**
 * Safari Index Decision Orchestrator Types
 * Aligned with: 12_ai_prompts.md Standard Input Envelope
 */

// Task types as defined in the constitution
export type TaskType =
  | 'DECISION'
  | 'REFUSAL'
  | 'REVISION'
  | 'TRADEOFF_EXPLANATION'
  | 'CLARIFICATION';

export type TravelerType =
  | 'first_time'
  | 'repeat'
  | 'family'
  | 'honeymoon'
  | 'photographer'
  | 'unknown';

export type BudgetBand = 'budget' | 'fair_value' | 'premium' | 'unknown';

export type PacePreference = 'slow' | 'balanced' | 'fast' | 'unknown';

export type RiskTolerance = 'low' | 'medium' | 'high' | 'unknown';

export type DateType = 'fixed_dates' | 'month_year' | 'flexible' | 'unknown';

export type DecisionOutcome = 'book' | 'wait' | 'switch' | 'discard';

// Standard Input Envelope (from 12_ai_prompts.md section 2)
export interface UserDates {
  type: DateType;
  start?: string; // YYYY-MM-DD
  end?: string; // YYYY-MM-DD
  month?: string;
  year?: number;
}

export interface UserContext {
  traveler_type: TravelerType;
  budget_band: BudgetBand;
  pace_preference: PacePreference;
  drive_tolerance_hours: number;
  risk_tolerance: RiskTolerance;
  dates: UserDates;
  group_size: number;
  prior_decisions: string[];
}

export interface Request {
  question: string;
  scope: string;
  destinations_considered: string[];
  constraints: Record<string, unknown>;
}

export interface Facts {
  known_constraints: string[];
  known_tradeoffs: string[];
  destination_notes: string[];
}

export interface Policy {
  must_refuse_if: string[];
  forbidden_phrases: string[];
}

/**
 * Tracking context for persistence and audit
 * Per 10_data_model.md: session_id and traveler_id are nullable until identified
 */
export interface TrackingContext {
  session_id?: string | null;
  traveler_id?: string | null;
  lead_id?: string | null;
}

export interface StandardInputEnvelope {
  task: TaskType;
  tracking?: TrackingContext;
  user_context: UserContext;
  request: Request;
  facts: Facts;
  policy: Policy;
}

// Output schemas (from 12_ai_prompts.md sections 3-7)
export interface Assumption {
  id: string;
  text: string;
  confidence: number;
}

export interface Tradeoffs {
  gains: string[];
  losses: string[];
}

export interface DecisionOutput {
  type: 'decision';
  decision: {
    outcome: DecisionOutcome;
    headline: string;
    summary: string;
    assumptions: Assumption[];
    tradeoffs: Tradeoffs;
    change_conditions: string[];
    confidence: number;
  };
}

/**
 * Refusal codes for categorizing refusal types
 * SERVICE_DEGRADED: Temporary service issue (rate limiting, timeouts)
 * MISSING_INPUTS: Required information not provided
 * CONFLICTING_INPUTS: User inputs are contradictory
 * GUARANTEE_REQUESTED: User asked for guarantees we cannot provide
 */
export type RefusalCode =
  | 'SERVICE_DEGRADED'
  | 'MISSING_INPUTS'
  | 'CONFLICTING_INPUTS'
  | 'GUARANTEE_REQUESTED';

export interface RefusalOutput {
  type: 'refusal';
  refusal: {
    code?: RefusalCode; // Optional for backwards compatibility
    reason: string;
    missing_or_conflicting_inputs: string[];
    safe_next_step: string;
  };
}

export interface ClarificationQuestion {
  id: string;
  question: string;
  why_it_matters: string;
}

export interface ClarificationOutput {
  type: 'clarification';
  clarification: {
    questions: ClarificationQuestion[];
  };
}

export interface TradeoffExplanationOutput {
  type: 'tradeoff_explanation';
  explanation: {
    text: string;
    next_step: string;
  };
}

export interface RevisionOutput {
  type: 'revision';
  revision: {
    what_changed: string;
    decision: {
      outcome: DecisionOutcome;
      headline: string;
      summary: string;
      assumptions: Assumption[];
      tradeoffs: Tradeoffs;
      change_conditions: string[];
      confidence: number;
    };
  };
}

export type AIOutput =
  | DecisionOutput
  | RefusalOutput
  | ClarificationOutput
  | TradeoffExplanationOutput
  | RevisionOutput;

// Validation result types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// Lambda response types
export interface OrchestratorResponse {
  statusCode: number;
  body: string;
  headers: Record<string, string>;
}

export interface OrchestratorError {
  error: string;
  details?: ValidationError[];
}

/**
 * Enriched response that includes decision_id for tracking
 * Per 10_data_model.md: every decision must be stored and referenceable
 */
export interface DecisionResponse {
  decision_id: string;
  output: AIOutput;
  metadata: {
    logic_version: string;
    ai_used: boolean;
    retry_count: number;
    persisted: boolean;
  };
}
