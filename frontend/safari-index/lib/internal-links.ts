/**
 * Internal Linking Module
 *
 * Implements deterministic internal linking rules for Safari Index Guides.
 * Ensures related decisions are logically connected without circular spam.
 *
 * Linking rules:
 * 1. Same bucket topics are related
 * 2. Shared tags increase relevance
 * 3. High assurance potential topics are preferred
 * 4. Max 6 related links per page
 * 5. Descriptive anchor text (question form, never "click here")
 */

import {
  topicInventory,
  type TopicBucket,
  type TopicInventoryItem,
} from '../app/content/topic-inventory';
import { generateSlugFromId } from '../app/content/p0-topics-bridge';
import { baselineDecisions } from '../app/content/baseline-decisions';

// ============================================================================
// Types
// ============================================================================

export interface RelatedDecision {
  topicId: string;
  slug: string;
  title: string; // Question form for anchor text
  bucket: TopicBucket;
  relevanceScore: number;
  hasBaseline: boolean;
}

export interface InternalLink {
  href: string;
  anchorText: string;
  title: string; // For title attribute
}

// ============================================================================
// Configuration
// ============================================================================

const MAX_RELATED_LINKS = 6;
const MIN_RELATED_LINKS = 3;

// Topic tag derivation from ID patterns
const TOPIC_TAGS: Record<string, string[]> = {
  // Destination tags
  'tz-': ['tanzania', 'east-africa'],
  'ke-': ['kenya', 'east-africa'],
  'bw-': ['botswana', 'southern-africa'],
  'sa-': ['south-africa', 'southern-africa'],
  'rwanda': ['rwanda', 'gorillas', 'east-africa'],
  'uganda': ['uganda', 'gorillas', 'east-africa'],
  'namibia': ['namibia', 'southern-africa'],
  'zambia': ['zambia', 'southern-africa'],
  'zimbabwe': ['zimbabwe', 'southern-africa'],
  'okavango': ['botswana', 'delta', 'southern-africa'],
  'serengeti': ['tanzania', 'serengeti', 'east-africa'],
  'mara': ['kenya', 'masai-mara', 'east-africa'],
  'kruger': ['south-africa', 'kruger', 'southern-africa'],
  'ngorongoro': ['tanzania', 'ngorongoro', 'east-africa'],

  // Experience tags
  'walking': ['walking-safari', 'adventure'],
  'self-drive': ['self-drive', 'independent'],
  'balloon': ['balloon', 'special-experience'],
  'mokoro': ['mokoro', 'water-safari', 'botswana'],
  'photo': ['photography', 'special-interest'],
  'night': ['night-drives', 'nocturnal'],

  // Accommodation tags
  'lodge': ['accommodation', 'lodge'],
  'tented': ['accommodation', 'tented-camp'],
  'luxury': ['accommodation', 'luxury'],
  'budget': ['accommodation', 'budget'],
  'camp': ['accommodation', 'camping'],

  // Timing tags
  'migration': ['migration', 'timing', 'wildlife'],
  'calving': ['calving', 'timing', 'serengeti'],
  'crossing': ['river-crossing', 'migration', 'timing'],
  'dry-season': ['dry-season', 'timing'],
  'green-season': ['green-season', 'timing'],
  'christmas': ['christmas', 'holiday', 'timing'],
  'feb': ['february', 'calving', 'timing'],
  'jul': ['july', 'dry-season', 'timing'],
  'aug': ['august', 'dry-season', 'timing'],
  'jun': ['june', 'dry-season', 'timing'],

  // Traveler tags
  'family': ['family', 'children'],
  'solo': ['solo', 'independent'],
  'honeymoon': ['honeymoon', 'couples', 'romance'],
  'multigenerational': ['multigenerational', 'family'],
  'first-timer': ['first-time', 'beginner'],

  // Cost tags
  'budget-': ['budget', 'cost', 'value'],
  'cost': ['cost', 'budget'],
  'value': ['value', 'cost'],
  'splurge': ['luxury', 'splurge', 'cost'],
  'cheap': ['budget', 'warning', 'cost'],

  // Risk tags
  'malaria': ['health', 'malaria', 'risk'],
  'yellow-fever': ['health', 'vaccination', 'risk'],
  'political': ['safety', 'risk'],
  'ethical': ['ethics', 'responsible'],
};

// ============================================================================
// Tag Extraction
// ============================================================================

/**
 * Extract tags from a topic ID
 */
function extractTagsFromTopicId(topicId: string): string[] {
  const tags: string[] = [];

  for (const [pattern, patternTags] of Object.entries(TOPIC_TAGS)) {
    if (topicId.includes(pattern)) {
      tags.push(...patternTags);
    }
  }

  // Add bucket as a tag
  const topic = topicInventory.find((t) => t.id === topicId);
  if (topic) {
    tags.push(topic.bucket.replace('_', '-'));
  }

  return [...new Set(tags)]; // Deduplicate
}

// ============================================================================
// Relevance Scoring
// ============================================================================

/**
 * Calculate relevance score between two topics
 */
function calculateRelevanceScore(
  sourceTopic: TopicInventoryItem,
  targetTopic: TopicInventoryItem
): number {
  let score = 0;

  // Same bucket: base score of 2
  if (sourceTopic.bucket === targetTopic.bucket) {
    score += 2;
  }

  // Shared tags
  const sourceTags = extractTagsFromTopicId(sourceTopic.id);
  const targetTags = extractTagsFromTopicId(targetTopic.id);
  const sharedTags = sourceTags.filter((t) => targetTags.includes(t));
  score += sharedTags.length * 0.5;

  // Assurance eligible bonus
  if (targetTopic.assurance_eligible) {
    score += 0.5;
  }

  // Has baseline bonus (more complete content)
  if (targetTopic.id in baselineDecisions) {
    score += 1;
  }

  // High SEO intent bonus
  if (targetTopic.seo_intent === 'high') {
    score += 0.3;
  }

  return score;
}

// ============================================================================
// Related Decisions
// ============================================================================

/**
 * Get related decisions for a topic
 *
 * Rules:
 * - Excludes the source topic itself
 * - Only includes P0 topics
 * - Sorted by relevance score
 * - Capped at MAX_RELATED_LINKS
 */
export function getRelatedDecisions(
  topicId: string,
  limit: number = MAX_RELATED_LINKS
): RelatedDecision[] {
  const sourceTopic = topicInventory.find((t) => t.id === topicId);
  if (!sourceTopic) return [];

  // Get all P0 topics except the source
  const candidates = topicInventory.filter(
    (t) => t.id !== topicId && t.launch_priority === 'P0'
  );

  // Score each candidate
  const scored = candidates.map((topic) => ({
    topicId: topic.id,
    slug: generateSlugFromId(topic.id),
    title: topic.title,
    bucket: topic.bucket as TopicBucket,
    relevanceScore: calculateRelevanceScore(sourceTopic, topic),
    hasBaseline: topic.id in baselineDecisions,
  }));

  // Sort by relevance score (descending)
  scored.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Return top N
  const actualLimit = Math.min(limit, MAX_RELATED_LINKS);
  return scored.slice(0, actualLimit);
}

/**
 * Get related decisions with minimum count guarantee
 * Falls back to bucket-mates if not enough high-relevance matches
 */
export function getRelatedDecisionsWithMinimum(
  topicId: string,
  minimum: number = MIN_RELATED_LINKS,
  maximum: number = MAX_RELATED_LINKS
): RelatedDecision[] {
  const related = getRelatedDecisions(topicId, maximum);

  if (related.length >= minimum) {
    return related;
  }

  // Not enough related decisions - this shouldn't happen for P0 topics
  // but handle gracefully
  return related;
}

// ============================================================================
// Link Generation
// ============================================================================

/**
 * Generate internal link to a decision page
 */
export function generateDecisionLink(topicId: string): InternalLink | null {
  const topic = topicInventory.find((t) => t.id === topicId);
  if (!topic) return null;

  const slug = generateSlugFromId(topicId);

  return {
    href: `/decisions/${slug}`,
    anchorText: topic.title, // Question form
    title: `Read our decision on: ${topic.title}`,
  };
}

/**
 * Generate internal link to a guide page
 */
export function generateGuideLink(topicId: string): InternalLink | null {
  const topic = topicInventory.find((t) => t.id === topicId);
  if (!topic || topic.launch_priority !== 'P0') return null;

  const slug = generateSlugFromId(topicId);
  const bucketSlug = topic.bucket.replace('_', '-');

  return {
    href: `/guides/${bucketSlug}/${slug}`,
    anchorText: topic.title,
    title: `Read our guide: ${topic.title}`,
  };
}

/**
 * Generate canonical decision page link for a topic
 * This is the primary CTA from guides to decisions
 */
export function getCanonicalDecisionLink(topicId: string): InternalLink | null {
  return generateDecisionLink(topicId);
}

// ============================================================================
// Bucket Links
// ============================================================================

/**
 * Get all topics in a bucket as links
 */
export function getBucketTopicLinks(bucket: TopicBucket): InternalLink[] {
  const topics = topicInventory.filter(
    (t) => t.bucket === bucket && t.launch_priority === 'P0'
  );

  return topics
    .map((topic) => generateDecisionLink(topic.id))
    .filter((link): link is InternalLink => link !== null);
}

/**
 * Get related buckets for cross-linking
 */
export function getRelatedBuckets(bucket: TopicBucket): TopicBucket[] {
  const BUCKET_RELATIONSHIPS: Record<TopicBucket, TopicBucket[]> = {
    personal_fit: ['destination_choice', 'experience_type'],
    destination_choice: ['timing', 'value_cost'],
    timing: ['destination_choice', 'value_cost'],
    experience_type: ['accommodation', 'logistics'],
    accommodation: ['value_cost', 'experience_type'],
    logistics: ['timing', 'accommodation'],
    risk_ethics: ['destination_choice', 'personal_fit'],
    value_cost: ['accommodation', 'timing'],
  };

  return BUCKET_RELATIONSHIPS[bucket] || [];
}
