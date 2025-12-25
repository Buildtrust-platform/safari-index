/**
 * Evidence Retrieval
 *
 * Retrieves relevant evidence cards for a topic using deterministic ranking.
 * Used to inject supporting context into AI prompts.
 *
 * Ranking criteria (in order):
 * 1. Tag overlap count (more matching tags = higher rank)
 * 2. Scope specificity (country > region > africa)
 * 3. Last updated (newer = higher rank)
 *
 * Hard cap on results to prevent token blowups.
 */

import { EvidenceCard, TopicMetadata } from './kb-contracts';
import { getAllEvidence, getTopicMetadata, isKBAvailable } from './kb-loader';

// ============================================================================
// Configuration
// ============================================================================

const DEFAULT_MAX_CARDS = 8;
const ABSOLUTE_MAX_CARDS = 12;

// Scope specificity scores (higher = more specific)
const SCOPE_SCORES: Record<string, number> = {
  // Countries (most specific)
  'tanzania': 10,
  'kenya': 10,
  'botswana': 10,
  'south-africa': 10,
  'rwanda': 10,
  'uganda': 10,
  'namibia': 10,
  'zimbabwe': 10,
  'zambia': 10,

  // Parks/Regions
  'serengeti': 8,
  'masai-mara': 8,
  'ngorongoro': 8,
  'okavango': 8,
  'kruger': 8,
  'chobe': 8,

  // Regions
  'east-africa': 5,
  'southern-africa': 5,

  // Generic
  'africa': 2,
};

// ============================================================================
// Types
// ============================================================================

interface ScoredEvidence {
  card: EvidenceCard;
  tagOverlap: number;
  scopeScore: number;
  recency: number; // Unix timestamp
}

// ============================================================================
// Retrieval
// ============================================================================

/**
 * Get evidence cards for a topic
 *
 * @param topicId - The topic ID to retrieve evidence for
 * @param additionalTags - Extra tags to match (e.g., from user inputs)
 * @param maxCards - Maximum cards to return (default 8, max 12)
 * @returns Array of evidence cards, deterministically ranked
 */
export function getEvidenceForTopic(
  topicId: string,
  additionalTags: string[] = [],
  maxCards: number = DEFAULT_MAX_CARDS
): EvidenceCard[] {
  // Fail closed if KB not available
  if (!isKBAvailable()) {
    console.warn('KB not available, returning empty evidence');
    return [];
  }

  // Get topic metadata for tags
  const topic = getTopicMetadata(topicId);
  if (!topic) {
    console.warn(`Topic not found in KB: ${topicId}`);
    return [];
  }

  // Combine topic tags with additional tags
  const searchTags = new Set([
    ...(topic.tags || []),
    ...topic.destinations.map(d => d.toLowerCase()),
    topic.bucket.replace('_', '-'),
    ...additionalTags.map(t => t.toLowerCase()),
  ]);

  // Get all evidence and score
  const allEvidence = getAllEvidence();
  const scored: ScoredEvidence[] = [];

  for (const card of Object.values(allEvidence)) {
    // Check if card is relevant (at least 1 tag overlap OR topic_id match)
    const cardTags = new Set(card.tags.map(t => t.toLowerCase()));
    const topicMatch = card.topic_ids.includes(topicId);

    let tagOverlap = 0;
    for (const tag of searchTags) {
      if (cardTags.has(tag)) tagOverlap++;
    }

    // Skip if no relevance
    if (tagOverlap === 0 && !topicMatch) continue;

    // Give bonus for direct topic match
    if (topicMatch) tagOverlap += 5;

    // Calculate scope score
    let scopeScore = 0;
    for (const dest of card.destinations) {
      const destKey = dest.toLowerCase().replace(' ', '-');
      scopeScore = Math.max(scopeScore, SCOPE_SCORES[destKey] || 1);
    }
    for (const tag of card.tags) {
      scopeScore = Math.max(scopeScore, SCOPE_SCORES[tag.toLowerCase()] || 0);
    }

    // Calculate recency (newer = higher)
    const recency = new Date(card.updated_at).getTime();

    scored.push({ card, tagOverlap, scopeScore, recency });
  }

  // Sort by ranking criteria (deterministic)
  scored.sort((a, b) => {
    // 1. Tag overlap (descending)
    if (b.tagOverlap !== a.tagOverlap) return b.tagOverlap - a.tagOverlap;

    // 2. Scope specificity (descending)
    if (b.scopeScore !== a.scopeScore) return b.scopeScore - a.scopeScore;

    // 3. Recency (descending)
    if (b.recency !== a.recency) return b.recency - a.recency;

    // 4. Tie-breaker: evidence_id alphabetically (for determinism)
    return a.card.evidence_id.localeCompare(b.card.evidence_id);
  });

  // Apply hard cap
  const effectiveMax = Math.min(maxCards, ABSOLUTE_MAX_CARDS);
  return scored.slice(0, effectiveMax).map(s => s.card);
}

/**
 * Format evidence cards for prompt injection
 *
 * @param cards - Evidence cards to format
 * @returns Formatted string for prompt context
 */
export function formatEvidenceForPrompt(cards: EvidenceCard[]): string {
  if (cards.length === 0) return '';

  const lines: string[] = [
    '--- EVIDENCE CONTEXT ---',
    'The following evidence may inform your decision. Use it to ground assumptions.',
    '',
  ];

  for (const card of cards) {
    lines.push(`[${card.type.toUpperCase()}] ${card.title}`);
    lines.push(card.content);

    if (card.source) {
      lines.push(`Source: ${card.source}${card.source_date ? ` (${card.source_date.split('T')[0]})` : ''}`);
    }

    lines.push(`Scope: ${card.destinations.join(', ')}`);
    lines.push('');
  }

  lines.push('--- END EVIDENCE ---');
  lines.push('');

  return lines.join('\n');
}

/**
 * Infer additional tags from user inputs
 *
 * @param inputs - User input data
 * @returns Array of inferred tags
 */
export function inferTagsFromInputs(inputs: {
  destinations?: string[];
  budget_band?: string;
  traveler_type?: string;
  dates?: { month?: string };
}): string[] {
  const tags: string[] = [];

  // Destinations
  if (inputs.destinations) {
    for (const dest of inputs.destinations) {
      tags.push(dest.toLowerCase().replace(' ', '-'));
    }
  }

  // Budget
  if (inputs.budget_band) {
    if (inputs.budget_band.includes('luxury') || inputs.budget_band.includes('high')) {
      tags.push('luxury');
    }
    if (inputs.budget_band.includes('budget') || inputs.budget_band.includes('low')) {
      tags.push('budget');
    }
  }

  // Traveler type
  if (inputs.traveler_type) {
    if (inputs.traveler_type.includes('family')) tags.push('family');
    if (inputs.traveler_type.includes('solo')) tags.push('solo');
    if (inputs.traveler_type.includes('honeymoon')) tags.push('honeymoon');
  }

  // Timing
  if (inputs.dates?.month) {
    tags.push('timing');
    const month = inputs.dates.month.toLowerCase();
    if (['june', 'july', 'august', 'september', 'october'].includes(month)) {
      tags.push('dry-season');
    }
    if (['december', 'january', 'february'].includes(month)) {
      tags.push('green-season');
    }
    if (['july', 'august', 'september', 'october'].includes(month)) {
      tags.push('migration');
    }
  }

  return tags;
}
