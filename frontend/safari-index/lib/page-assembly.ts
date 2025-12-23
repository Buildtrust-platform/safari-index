/**
 * Page Assembly Layer
 *
 * Organizes mapping from:
 * - topic -> request envelope
 * - decision response -> render model
 *
 * Does NOT change:
 * - Any logic or calculations
 * - Request body structure
 * - Render output
 *
 * Only consolidates existing patterns for reuse.
 */

import { DecisionTopic } from '../app/content/decision-topics';

/**
 * Standard Input Envelope structure
 * Per 10_data_model.md
 */
export interface StandardInputEnvelope {
  task: 'DECISION';
  tracking: {
    session_id: string;
    traveler_id: string | null;
    lead_id: string | null;
  };
  user_context: {
    traveler_type: string;
    budget_band: string;
    pace_preference: string;
    drive_tolerance_hours: number;
    risk_tolerance: string;
    dates: { type: string; month?: string; year?: number };
    group_size: number;
    prior_decisions: string[];
  };
  request: {
    question: string;
    scope: string;
    destinations_considered: string[];
    constraints: Record<string, unknown>;
  };
  facts: {
    known_constraints: string[];
    known_tradeoffs: string[];
    destination_notes: string[];
  };
  policy: {
    must_refuse_if: string[];
    forbidden_phrases: string[];
  };
}

/**
 * Decision API response structure
 */
export interface DecisionResponse {
  decision_id: string;
  output: {
    type: 'decision' | 'refusal';
    decision?: {
      outcome: 'book' | 'wait' | 'switch' | 'discard';
      headline: string;
      summary: string;
      assumptions: Array<{ id: string; text: string; confidence: number }>;
      tradeoffs: { gains: string[]; losses: string[] };
      change_conditions: string[];
      confidence: number;
    };
    refusal?: {
      reason: string;
      missing_or_conflicting_inputs: string[];
      safe_next_step: string;
    };
  };
  metadata: {
    logic_version: string;
    ai_used: boolean;
  };
}

/**
 * Fit/Misfit render model
 */
export interface FitMisfitModel {
  rightFor: string[];
  notIdealFor: string[];
}

/**
 * Derive budget_band from traveler profiles
 */
function deriveBudgetBand(profiles: string[] | undefined): string {
  if (!profiles) return 'fair_value';
  if (profiles.includes('budget_conscious')) return 'budget';
  if (profiles.includes('luxury')) return 'premium';
  return 'fair_value';
}

/**
 * Build Standard Input Envelope from topic
 * Extracts existing logic from decision page
 */
export function buildRequestEnvelope(topic: DecisionTopic): StandardInputEnvelope {
  return {
    task: 'DECISION',
    tracking: {
      session_id: `sess_page_${topic.topic_id}`,
      traveler_id: null,
      lead_id: null,
    },
    user_context: {
      traveler_type: topic.traveler_profiles?.[0] || 'first_time',
      budget_band: deriveBudgetBand(topic.traveler_profiles),
      pace_preference: 'balanced',
      drive_tolerance_hours: 4,
      risk_tolerance: 'medium',
      dates: topic.time_context?.month
        ? { type: 'month_year', month: topic.time_context.month, year: 2026 }
        : { type: 'flexible' },
      group_size: 2,
      prior_decisions: [],
    },
    request: {
      question: topic.question,
      scope: 'thin_edge_scope_only=true',
      destinations_considered: topic.destinations,
      constraints: {},
    },
    facts: {
      known_constraints: topic.primary_risks,
      known_tradeoffs: topic.key_tradeoffs,
      destination_notes: [],
    },
    policy: {
      must_refuse_if: [
        'guarantee_requested',
        'inputs_conflict_unbounded',
        'missing_material_inputs',
      ],
      forbidden_phrases: ['unforgettable', 'magical', 'once-in-a-lifetime'],
    },
  };
}

/**
 * Derive Fit/Misfit model from topic and outcome
 * Extracts existing logic from decision page
 */
export function deriveFitMisfitModel(
  topic: DecisionTopic,
  outcome: string
): FitMisfitModel {
  const rightFor: string[] = [];
  const notIdealFor: string[] = [];

  // Add profile-based fit
  if (topic.traveler_profiles?.includes('first_time')) {
    rightFor.push('First-time safari visitors');
  }
  if (topic.traveler_profiles?.includes('repeat')) {
    rightFor.push('Returning safari travelers seeking variety');
  }
  if (topic.traveler_profiles?.includes('budget_conscious')) {
    rightFor.push('Travelers prioritizing value');
    notIdealFor.push('Those requiring luxury accommodations');
  }
  if (topic.traveler_profiles?.includes('families')) {
    rightFor.push('Families with older children');
    notIdealFor.push('Travelers seeking adult-only experiences');
  }

  // Add outcome-based fit
  if (outcome === 'book') {
    rightFor.push('Those ready to commit with current constraints');
  } else if (outcome === 'wait') {
    notIdealFor.push('Travelers with fixed, immovable dates');
  } else if (outcome === 'switch') {
    notIdealFor.push('Those set on this specific option');
  }

  // Add risk-based misfit
  topic.primary_risks.slice(0, 2).forEach((risk) => {
    notIdealFor.push(`Those who cannot accept: ${risk.toLowerCase()}`);
  });

  // Ensure minimum items
  if (rightFor.length < 2) {
    rightFor.push('Travelers with flexibility in their requirements');
  }
  if (notIdealFor.length < 2) {
    notIdealFor.push('Those with rigid constraints');
  }

  return {
    rightFor: rightFor.slice(0, 4),
    notIdealFor: notIdealFor.slice(0, 4),
  };
}

/**
 * Extract primary condition from decision for ownership block
 */
export function extractPrimaryCondition(
  assumptions: Array<{ text: string }>,
  changeConditions: string[]
): string {
  return assumptions[0]?.text || changeConditions[0] || 'conditions favor this option';
}

/**
 * Extract invalidating condition from decision for ownership block
 */
export function extractInvalidatingCondition(changeConditions: string[]): string {
  return changeConditions[0] || 'your constraints or priorities change significantly';
}

/**
 * Page state types
 */
export type DecisionPageState = 'loading' | 'success' | 'refusal' | 'error' | 'quality_failed';

/**
 * Check if response is a successful decision
 */
export function isDecisionSuccess(response: DecisionResponse): boolean {
  return response.output.type === 'decision' && !!response.output.decision;
}

/**
 * Check if response is a refusal
 */
export function isDecisionRefusal(response: DecisionResponse): boolean {
  return response.output.type === 'refusal' && !!response.output.refusal;
}
