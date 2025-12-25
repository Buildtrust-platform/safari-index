/**
 * Guide Builder
 *
 * Deterministic content generation for Safari Index Guides.
 * Composes guide content from topic-inventory, baselines, and evidence.
 *
 * Key principles:
 * - No AI runtime calls - purely static composition
 * - Uses existing KB data structures
 * - Follows governance banned phrases rules
 * - Documentary, safari-native, premium tone
 */

import {
  topicInventory,
  TOPIC_BUCKETS,
  type TopicBucket,
  type TopicInventoryItem,
} from '../app/content/topic-inventory';
import { generateSlugFromId } from '../app/content/p0-topics-bridge';
import {
  baselineDecisions,
  type BaselineDecision,
} from '../app/content/baseline-decisions';

// ============================================================================
// Types
// ============================================================================

export interface GuideSection {
  id: string;
  title: string;
  content: string | string[];
}

export interface TopicGuide {
  topicId: string;
  slug: string;
  title: string; // H1 - the question form
  bucket: TopicBucket;
  bucketSlug: string;

  // Content sections
  decisionInOneLine: string;
  dependsOn: {
    assumptions: Array<{ id: string; text: string; confidence: number }>;
    changeConditions: string[];
  };
  tradeoffs: {
    gains: string[];
    losses: string[];
  };
  evidence: EvidenceSnippet[];
  relatedDecisionIds: string[];

  // Metadata
  hasBaseline: boolean;
  assuranceEligible: boolean;
  confidence: number;
}

export interface EvidenceSnippet {
  claim: string;
  nuance?: string;
  scope: string;
}

export interface BucketGuide {
  bucket: TopicBucket;
  bucketSlug: string;
  title: string;
  framingCopy: string;
  topics: Array<{
    id: string;
    slug: string;
    title: string;
    hasBaseline: boolean;
  }>;
}

// ============================================================================
// Bucket Configuration (reused from decisions page, extended for guides)
// ============================================================================

const BUCKET_GUIDE_CONFIG: Record<
  TopicBucket,
  {
    title: string;
    slug: string;
    framingCopy: string;
    heroDescription: string;
  }
> = {
  personal_fit: {
    title: 'Personal Fit',
    slug: 'personal-fit',
    framingCopy:
      'Safari travel demands a particular alignment between your expectations and what the experience delivers. These guides explore the questions that help you assess whether safari matches your travel style, group composition, and underlying motivations. Understanding personal fit before booking prevents disappointment and ensures the investment is worthwhile.',
    heroDescription:
      'Assessing whether safari travel matches your expectations and circumstances.',
  },
  destination_choice: {
    title: 'Destination Choice',
    slug: 'destination-choice',
    framingCopy:
      'African safari destinations differ in fundamental ways: ecosystem type, wildlife density, infrastructure quality, and cost structure. These guides examine the trade-offs between major safari countries and regions, helping you select destinations that match your priorities. Each comparison considers what you gain and lose with each choice.',
    heroDescription:
      'Comparing safari destinations across Africa to find the right match.',
  },
  timing: {
    title: 'Timing',
    slug: 'timing',
    framingCopy:
      'When you travel affects nearly every aspect of your safari: wildlife behavior, weather patterns, crowd levels, and pricing. These guides examine the seasonal rhythms of African ecosystems and help you choose timing that aligns with your priorities. Some travelers optimize for wildlife spectacles; others for value or solitude.',
    heroDescription:
      'Understanding seasonal patterns and optimal timing for safari travel.',
  },
  experience_type: {
    title: 'Experience Type',
    slug: 'experience-type',
    framingCopy:
      'Safari experiences range from traditional game drives to walking safaris, self-drive adventures, and specialized photography expeditions. These guides explore the different ways to experience African wildlife, examining what each format offers and what it requires from you. The right experience type depends on your comfort with risk, physical capability, and desired level of immersion.',
    heroDescription:
      'Exploring different safari formats from walking safaris to self-drive adventures.',
  },
  accommodation: {
    title: 'Accommodation',
    slug: 'accommodation',
    framingCopy:
      'Safari accommodation spans from basic tented camps to ultra-luxury lodges, with meaningful differences in experience quality, location, and value. These guides examine the accommodation trade-offs that affect your overall experience. Where you sleep often determines what you can do and how much you pay.',
    heroDescription:
      'Comparing lodge and camp options across the safari spectrum.',
  },
  logistics: {
    title: 'Logistics',
    slug: 'logistics',
    framingCopy:
      'Safari logistics involve practical decisions about trip length, internal transport, booking mechanics, and add-on experiences. These guides address the operational questions that determine whether your trip runs smoothly. Good logistics planning prevents wasted time and unnecessary expense.',
    heroDescription:
      'Navigating practical decisions about trip structure and travel mechanics.',
  },
  risk_ethics: {
    title: 'Risk and Ethics',
    slug: 'risk-ethics',
    framingCopy:
      'Safari travel involves health considerations, political awareness, and ethical choices about wildlife interaction and community impact. These guides examine the factors that require caution or careful consideration. Responsible travel means understanding both the risks you accept and the impact you create.',
    heroDescription:
      'Considering health, safety, and ethical dimensions of safari travel.',
  },
  value_cost: {
    title: 'Value and Cost',
    slug: 'value-cost',
    framingCopy:
      'Safari pricing varies dramatically based on destination, season, accommodation tier, and booking approach. These guides help you understand what drives cost and where money is well spent versus wasted. Setting realistic expectations about budget prevents both overspending and under-delivering on experience quality.',
    heroDescription:
      'Understanding safari costs and where to allocate your budget.',
  },
};

// ============================================================================
// Bucket Slug Utilities
// ============================================================================

/**
 * Convert bucket name to URL slug
 */
export function bucketToSlug(bucket: TopicBucket): string {
  return BUCKET_GUIDE_CONFIG[bucket].slug;
}

/**
 * Convert URL slug back to bucket
 */
export function slugToBucket(slug: string): TopicBucket | null {
  const entry = Object.entries(BUCKET_GUIDE_CONFIG).find(
    ([, config]) => config.slug === slug
  );
  return entry ? (entry[0] as TopicBucket) : null;
}

/**
 * Get all bucket slugs
 */
export function getAllBucketSlugs(): string[] {
  return TOPIC_BUCKETS.map((b) => BUCKET_GUIDE_CONFIG[b].slug);
}

// ============================================================================
// Guide Builders
// ============================================================================

/**
 * Build a topic guide from inventory and baseline data
 */
export function buildTopicGuide(topicId: string): TopicGuide | null {
  // Find topic in inventory
  const topic = topicInventory.find((t) => t.id === topicId);
  if (!topic) return null;

  // Only build guides for P0 topics
  if (topic.launch_priority !== 'P0') return null;

  // Get baseline if available
  const baseline = baselineDecisions[topicId] as BaselineDecision | undefined;

  // Generate slug
  const slug = generateSlugFromId(topicId);
  const bucketSlug = bucketToSlug(topic.bucket as TopicBucket);

  // Build the guide
  const guide: TopicGuide = {
    topicId,
    slug,
    title: topic.title,
    bucket: topic.bucket as TopicBucket,
    bucketSlug,

    // Decision in one line - derived from headline or title
    decisionInOneLine: baseline?.headline || deriveDecisionLine(topic),

    // Depends on section
    dependsOn: {
      assumptions: baseline?.assumptions || [],
      changeConditions: baseline?.change_conditions || [],
    },

    // Tradeoffs
    tradeoffs: baseline?.tradeoffs || { gains: [], losses: [] },

    // Evidence snippets - derived from baseline content
    evidence: deriveEvidenceSnippets(topic, baseline),

    // Related decisions - calculated separately
    relatedDecisionIds: [], // Will be populated by internal-links.ts

    // Metadata
    hasBaseline: !!baseline,
    assuranceEligible: topic.assurance_eligible,
    confidence: baseline?.confidence || 0.5,
  };

  return guide;
}

/**
 * Build a bucket guide with all P0 topics
 */
export function buildBucketGuide(bucket: TopicBucket): BucketGuide | null {
  const config = BUCKET_GUIDE_CONFIG[bucket];
  if (!config) return null;

  // Get P0 topics for this bucket
  const topics = topicInventory
    .filter((t) => t.bucket === bucket && t.launch_priority === 'P0')
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((t) => ({
      id: t.id,
      slug: generateSlugFromId(t.id),
      title: t.title,
      hasBaseline: t.id in baselineDecisions,
    }));

  return {
    bucket,
    bucketSlug: config.slug,
    title: config.title,
    framingCopy: config.framingCopy,
    topics,
  };
}

/**
 * Get all bucket guides
 */
export function getAllBucketGuides(): BucketGuide[] {
  return TOPIC_BUCKETS.map((bucket) => buildBucketGuide(bucket)).filter(
    (g): g is BucketGuide => g !== null && g.topics.length > 0
  );
}

/**
 * Get bucket config for display
 */
export function getBucketConfig(bucket: TopicBucket) {
  return BUCKET_GUIDE_CONFIG[bucket];
}

/**
 * Get all P0 topic IDs
 */
export function getAllP0TopicIds(): string[] {
  return topicInventory
    .filter((t) => t.launch_priority === 'P0')
    .map((t) => t.id);
}

/**
 * Get P0 topics for a bucket
 */
export function getP0TopicsForBucket(bucket: TopicBucket): TopicInventoryItem[] {
  return topicInventory
    .filter((t) => t.bucket === bucket && t.launch_priority === 'P0')
    .sort((a, b) => a.title.localeCompare(b.title));
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Derive a decision line from topic title (fallback when no baseline)
 */
function deriveDecisionLine(topic: TopicInventoryItem): string {
  // Convert question to statement form
  const title = topic.title;

  // Simple transformations for common patterns
  if (title.startsWith('Should I ')) {
    return `Whether to ${title.replace('Should I ', '').replace('?', '')} depends on your priorities and constraints.`;
  }
  if (title.startsWith('Is ')) {
    return `${title.replace('?', '')} is a question that depends on your specific circumstances.`;
  }
  if (title.startsWith('Can I ') || title.startsWith('Can a ')) {
    return `${title.replace('?', '')} is possible with the right planning and expectations.`;
  }
  if (title.startsWith('When ')) {
    return `${title.replace('?', '')} varies based on your priorities and what you want to experience.`;
  }
  if (title.startsWith('What ')) {
    return `${title.replace('?', '')} depends on multiple factors specific to your situation.`;
  }
  if (title.startsWith('How ')) {
    return `${title.replace('?', '')} involves trade-offs worth understanding before deciding.`;
  }

  // Default fallback
  return `This decision involves trade-offs that depend on your specific situation and priorities.`;
}

/**
 * Derive evidence snippets from baseline content
 */
function deriveEvidenceSnippets(
  topic: TopicInventoryItem,
  baseline?: BaselineDecision
): EvidenceSnippet[] {
  const snippets: EvidenceSnippet[] = [];

  if (!baseline) {
    // Generate generic evidence snippets from topic metadata
    return [
      {
        claim: `${topic.title.replace('?', '')} is a ${topic.decision_complexity} decision.`,
        scope: 'General',
      },
    ];
  }

  // Extract evidence from assumptions
  baseline.assumptions.slice(0, 3).forEach((assumption) => {
    snippets.push({
      claim: assumption.text,
      nuance:
        assumption.confidence >= 0.9
          ? 'Well-established pattern'
          : assumption.confidence >= 0.7
            ? 'Common but variable'
            : 'Context-dependent',
      scope: 'Safari planning',
    });
  });

  // Extract evidence from tradeoffs
  if (baseline.tradeoffs.gains.length > 0) {
    snippets.push({
      claim: baseline.tradeoffs.gains[0],
      scope: 'Trade-off consideration',
    });
  }
  if (baseline.tradeoffs.losses.length > 0) {
    snippets.push({
      claim: baseline.tradeoffs.losses[0],
      scope: 'Trade-off consideration',
    });
  }

  // Limit to 6 evidence snippets
  return snippets.slice(0, 6);
}

/**
 * Get topic by ID from inventory
 */
export function getTopicById(topicId: string): TopicInventoryItem | null {
  return topicInventory.find((t) => t.id === topicId) || null;
}

/**
 * Get topic by slug
 */
export function getTopicBySlug(slug: string): TopicInventoryItem | null {
  // Find the topic whose generated slug matches
  return (
    topicInventory.find((t) => generateSlugFromId(t.id) === slug) || null
  );
}
