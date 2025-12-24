/**
 * Decision Topic Registry
 *
 * Per 14_seo_generation.md:
 * - Topics must be thin-edge and decision-worthy
 * - No generic "best safari" topics
 * - Each topic answers a specific decision question
 *
 * Per 02_decision_doctrine.md:
 * - Every topic must have eligible outcomes
 * - Default outcome represents the most common verdict
 *
 * Strategic metadata (launch_priority, assurance_eligible, seo_intent)
 * syncs with topic-inventory.ts for content planning.
 *
 * P0 WIRING:
 * - All 40 P0 topics are generated from p0-decision-definitions.ts
 * - The p0-topics-bridge.ts handles the transformation
 * - This ensures operational definitions drive runtime behavior
 */

import type { LaunchPriority, SeoIntent, TopicBucket } from './topic-inventory';
import { generateP0Topics } from './p0-topics-bridge';

/**
 * Input specification for readiness panel (staging only)
 * Maps to StandardInputEnvelope fields
 */
export interface TopicInput {
  key: string; // Maps to envelope field path (e.g., "user_context.budget_band")
  label: string; // Human-readable label
  example: string; // Example value
}

export interface DecisionTopic {
  topic_id: string;
  slug: string;
  question: string;
  context_line: string; // One sentence context for the page
  destinations: string[];
  time_context?: {
    month?: string;
    year?: number;
    season?: string;
  };
  traveler_profiles?: string[];
  primary_risks: string[];
  key_tradeoffs: string[];
  eligible_outcomes: ('book' | 'wait' | 'switch' | 'discard')[];
  default_outcome: 'book' | 'wait' | 'switch' | 'discard';
  confidence_range: [number, number]; // min, max
  published: boolean;
  // Staging-only: inputs for readiness panel
  required_inputs?: TopicInput[];
  optional_inputs?: TopicInput[];
  // Strategic metadata (syncs with topic-inventory.ts)
  launch_priority?: LaunchPriority;
  assurance_eligible?: boolean;
  seo_intent?: SeoIntent;
  bucket?: TopicBucket;
  compare_enabled?: boolean;
}

/**
 * All P0 decision topics
 *
 * Generated from p0-decision-definitions.ts via p0-topics-bridge.ts
 * This ensures all 40 P0 topics are available for:
 * - /explore page listing
 * - /decisions/[slug] routing
 * - Sitemap generation
 */
export const decisionTopics: DecisionTopic[] = generateP0Topics();

/**
 * Get topic by slug
 */
export function getTopicBySlug(slug: string): DecisionTopic | undefined {
  return decisionTopics.find((t) => t.slug === slug);
}

/**
 * Get all published topics
 */
export function getPublishedTopics(): DecisionTopic[] {
  return decisionTopics.filter((t) => t.published);
}

/**
 * Get all topic slugs (for static generation)
 */
export function getAllTopicSlugs(): string[] {
  return getPublishedTopics().map((t) => t.slug);
}
