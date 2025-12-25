/**
 * Decision Knowledge Base Index
 *
 * Central export for the KB structure including:
 * - Topics (metadata and routing)
 * - Baselines (pre-computed decisions)
 * - Evidence (supporting data)
 * - Templates (writing guides and banned phrases)
 *
 * This module provides typed access to all KB content.
 * Validation is performed at build time via kb.spec.ts tests.
 */

import type {
  TopicRecord,
  BaselineDecisionRecord,
  EvidenceCard,
  TemplateRecord,
  BannedPhrases,
} from '../../../lib/kb-contracts';

// Import banned phrases
import bannedPhrasesData from './templates/banned-phrases.json';

// Import templates
import headlineTemplate from './templates/headline-template.json';
import assumptionTemplate from './templates/assumption-template.json';

// Import sample evidence
import serengetiParkFees from './evidence/sample-evidence.json';

// Import baselines from existing structure (re-export with KB typing)
import { baselineDecisions as legacyBaselines } from '../baseline-decisions';

// ============================================================================
// Banned Phrases
// ============================================================================

export const bannedPhrases: BannedPhrases = bannedPhrasesData as BannedPhrases;

// ============================================================================
// Templates
// ============================================================================

export const templates: Record<string, TemplateRecord> = {
  'headline-template': headlineTemplate as TemplateRecord,
  'assumption-template': assumptionTemplate as TemplateRecord,
};

// ============================================================================
// Evidence Cards
// ============================================================================

export const evidenceCards: Record<string, EvidenceCard> = {
  'serengeti-park-fees-2025': serengetiParkFees as EvidenceCard,
};

// ============================================================================
// Baselines (bridged from legacy structure)
// ============================================================================

/**
 * Convert legacy baseline format to KB record format
 * Adds version and metadata fields
 */
function toBaselineRecord(
  legacyBaseline: typeof legacyBaselines[string]
): BaselineDecisionRecord {
  return {
    ...legacyBaseline,
    version: '1.0.0',
    created_at: '2025-12-25T00:00:00Z',
    updated_at: '2025-12-25T00:00:00Z',
    review_status: 'approved',
  };
}

export const baselines: Record<string, BaselineDecisionRecord> = Object.fromEntries(
  Object.entries(legacyBaselines).map(([id, baseline]) => [
    id,
    toBaselineRecord(baseline),
  ])
);

// ============================================================================
// Topics (bridged from existing topic inventory)
// ============================================================================

import { topicInventory } from '../topic-inventory';
import { generateSlugFromId } from '../p0-topics-bridge';

/**
 * Convert topic inventory items to KB topic records
 */
function toTopicRecord(item: typeof topicInventory[number]): TopicRecord {
  return {
    topic_id: item.id,
    slug: generateSlugFromId(item.id),
    version: '1.0.0',
    title: item.title,
    question: item.title, // Use title as question for now
    context_line: item.assurance_rationale,
    bucket: item.bucket as TopicRecord['bucket'],
    decision_complexity: item.decision_complexity,
    destinations: ['Africa'], // Default, can be refined per topic
    eligible_outcomes: ['book', 'wait', 'switch', 'discard'],
    default_outcome: 'wait',
    launch_priority: item.launch_priority,
    seo_intent: item.seo_intent,
    assurance_eligible: item.assurance_eligible,
    compare_enabled: item.compare_enabled,
    created_at: '2025-12-25T00:00:00Z',
    updated_at: '2025-12-25T00:00:00Z',
  };
}

export const topics: Record<string, TopicRecord> = Object.fromEntries(
  topicInventory.map((item) => [item.id, toTopicRecord(item)])
);

// ============================================================================
// Convenience Exports
// ============================================================================

export const topicIds = Object.keys(topics);
export const baselineIds = Object.keys(baselines);
export const evidenceIds = Object.keys(evidenceCards);
export const templateIds = Object.keys(templates);

/**
 * Get all P0 topic IDs
 */
export function getP0TopicIds(): string[] {
  return Object.values(topics)
    .filter((t) => t.launch_priority === 'P0')
    .map((t) => t.topic_id);
}

/**
 * Get topic IDs by bucket
 */
export function getTopicIdsByBucket(bucket: TopicRecord['bucket']): string[] {
  return Object.values(topics)
    .filter((t) => t.bucket === bucket)
    .map((t) => t.topic_id);
}
