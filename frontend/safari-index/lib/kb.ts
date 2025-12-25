/**
 * Knowledge Base Utilities
 *
 * Provides typed access to KB content with query functions.
 * All data is loaded statically at build time - no runtime fetching.
 *
 * Usage:
 *   import { getTopic, getBaseline, searchEvidenceByTags } from '@/lib/kb';
 *
 *   const topic = getTopic('tz-dry-season');
 *   const baseline = getBaseline('tz-dry-season');
 *   const evidence = searchEvidenceByTags(['tanzania', 'cost']);
 */

import {
  topics,
  baselines,
  evidenceCards,
  templates,
  bannedPhrases,
  topicIds,
  baselineIds,
  getP0TopicIds,
  getTopicIdsByBucket,
} from '../app/content/kb';

import type {
  TopicRecord,
  BaselineDecisionRecord,
  EvidenceCard,
  TemplateRecord,
  BannedPhrases,
  TopicBucket,
} from './kb-contracts';

import {
  validateNoBannedPhrases,
  validateBaselineGovernance,
} from './kb-contracts';

// ============================================================================
// Topic Queries
// ============================================================================

/**
 * Get a topic by ID
 * @param topicId - The topic ID to retrieve
 * @returns TopicRecord or null if not found
 */
export function getTopic(topicId: string): TopicRecord | null {
  return topics[topicId] || null;
}

/**
 * Get a topic by slug
 * @param slug - The URL slug to search for
 * @returns TopicRecord or null if not found
 */
export function getTopicBySlug(slug: string): TopicRecord | null {
  return Object.values(topics).find((t) => t.slug === slug) || null;
}

/**
 * List all topics
 * @returns Array of all topic records
 */
export function listTopics(): TopicRecord[] {
  return Object.values(topics);
}

/**
 * List topics by bucket
 * @param bucket - The topic bucket to filter by
 * @returns Array of topic records in the specified bucket
 */
export function listTopicsByBucket(bucket: TopicBucket): TopicRecord[] {
  return Object.values(topics).filter((t) => t.bucket === bucket);
}

/**
 * List topics by launch priority
 * @param priority - The launch priority to filter by
 * @returns Array of topic records with the specified priority
 */
export function listTopicsByPriority(priority: 'P0' | 'P1' | 'P2'): TopicRecord[] {
  return Object.values(topics).filter((t) => t.launch_priority === priority);
}

/**
 * Check if a topic exists
 * @param topicId - The topic ID to check
 * @returns true if topic exists
 */
export function hasTopic(topicId: string): boolean {
  return topicId in topics;
}

// ============================================================================
// Baseline Queries
// ============================================================================

/**
 * Get a baseline decision by topic ID
 * @param topicId - The topic ID to retrieve baseline for
 * @returns BaselineDecisionRecord or null if not found
 */
export function getBaseline(topicId: string): BaselineDecisionRecord | null {
  return baselines[topicId] || null;
}

/**
 * List all baselines
 * @returns Array of all baseline records
 */
export function listBaselines(): BaselineDecisionRecord[] {
  return Object.values(baselines);
}

/**
 * Check if a baseline exists for a topic
 * @param topicId - The topic ID to check
 * @returns true if baseline exists
 */
export function hasBaseline(topicId: string): boolean {
  return topicId in baselines;
}

/**
 * Get all topic IDs that have baselines
 * @returns Array of topic IDs with baselines
 */
export function getBaselineTopicIds(): string[] {
  return baselineIds;
}

// ============================================================================
// Evidence Queries
// ============================================================================

/**
 * Get an evidence card by ID
 * @param evidenceId - The evidence ID to retrieve
 * @returns EvidenceCard or null if not found
 */
export function getEvidence(evidenceId: string): EvidenceCard | null {
  return evidenceCards[evidenceId] || null;
}

/**
 * List all evidence cards
 * @returns Array of all evidence cards
 */
export function listEvidence(): EvidenceCard[] {
  return Object.values(evidenceCards);
}

/**
 * Search evidence by tags (in-memory filter)
 * Returns evidence cards that match ANY of the provided tags
 * @param tags - Array of tags to search for
 * @returns Array of matching evidence cards
 */
export function searchEvidenceByTags(tags: string[]): EvidenceCard[] {
  if (tags.length === 0) return [];

  const lowerTags = tags.map((t) => t.toLowerCase());

  return Object.values(evidenceCards).filter((evidence) =>
    evidence.tags.some((tag) => lowerTags.includes(tag.toLowerCase()))
  );
}

/**
 * Search evidence by topic ID
 * Returns evidence cards associated with the specified topic
 * @param topicId - The topic ID to search for
 * @returns Array of matching evidence cards
 */
export function searchEvidenceByTopic(topicId: string): EvidenceCard[] {
  return Object.values(evidenceCards).filter((evidence) =>
    evidence.topic_ids.includes(topicId)
  );
}

/**
 * Search evidence by destination
 * @param destination - The destination to search for
 * @returns Array of matching evidence cards
 */
export function searchEvidenceByDestination(destination: string): EvidenceCard[] {
  const lowerDest = destination.toLowerCase();
  return Object.values(evidenceCards).filter((evidence) =>
    evidence.destinations.some((d) => d.toLowerCase().includes(lowerDest))
  );
}

// ============================================================================
// Template Queries
// ============================================================================

/**
 * Get a template by ID
 * @param templateId - The template ID to retrieve
 * @returns TemplateRecord or null if not found
 */
export function getTemplate(templateId: string): TemplateRecord | null {
  return templates[templateId] || null;
}

/**
 * List all templates
 * @returns Array of all template records
 */
export function listTemplates(): TemplateRecord[] {
  return Object.values(templates);
}

/**
 * Get templates by category
 * @param category - The template category to filter by
 * @returns Array of templates in the specified category
 */
export function getTemplatesByCategory(
  category: TemplateRecord['category']
): TemplateRecord[] {
  return Object.values(templates).filter((t) => t.category === category);
}

// ============================================================================
// Governance & Validation
// ============================================================================

/**
 * Get the banned phrases list
 * @returns BannedPhrases configuration
 */
export function getBannedPhrases(): BannedPhrases {
  return bannedPhrases;
}

/**
 * Validate text against banned phrases
 * @param text - Text to validate
 * @returns Validation result with any violations
 */
export function validateText(text: string): {
  valid: boolean;
  violations: string[];
} {
  return validateNoBannedPhrases(text, bannedPhrases);
}

/**
 * Validate a baseline decision against governance rules
 * @param baseline - Baseline to validate
 * @returns Validation result with any violations
 */
export function validateBaseline(baseline: BaselineDecisionRecord): {
  valid: boolean;
  violations: string[];
} {
  return validateBaselineGovernance(baseline, bannedPhrases);
}

// ============================================================================
// Statistics & Coverage
// ============================================================================

/**
 * Get KB coverage statistics
 * @returns Object with counts and coverage percentages
 */
export function getKBStats(): {
  topics: { total: number; p0: number; p1: number; p2: number };
  baselines: { total: number; coverage: number };
  evidence: { total: number };
  templates: { total: number };
} {
  const allTopics = Object.values(topics);
  const p0Count = allTopics.filter((t) => t.launch_priority === 'P0').length;
  const p1Count = allTopics.filter((t) => t.launch_priority === 'P1').length;
  const p2Count = allTopics.filter((t) => t.launch_priority === 'P2').length;

  const baselineCount = baselineIds.length;
  const p0TopicIds = getP0TopicIds();
  const p0WithBaseline = p0TopicIds.filter((id) => hasBaseline(id)).length;

  return {
    topics: {
      total: allTopics.length,
      p0: p0Count,
      p1: p1Count,
      p2: p2Count,
    },
    baselines: {
      total: baselineCount,
      coverage: p0TopicIds.length > 0 ? p0WithBaseline / p0TopicIds.length : 0,
    },
    evidence: {
      total: Object.keys(evidenceCards).length,
    },
    templates: {
      total: Object.keys(templates).length,
    },
  };
}

// ============================================================================
// Re-exports for convenience
// ============================================================================

export { topicIds, baselineIds, getP0TopicIds, getTopicIdsByBucket };
export type {
  TopicRecord,
  BaselineDecisionRecord,
  EvidenceCard,
  TemplateRecord,
  BannedPhrases,
  TopicBucket,
};
