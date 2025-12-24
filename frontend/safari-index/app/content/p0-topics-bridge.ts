/**
 * P0 Topics Bridge
 *
 * Generates runtime DecisionTopic entries from P0 operational definitions.
 * This bridges the gap between:
 * - p0-decision-definitions.ts (operational: inputs, assumptions, tradeoffs)
 * - topic-inventory.ts (strategic: priority, SEO, assurance eligibility)
 * - decision-topics.ts (runtime: what Explore and Decision pages consume)
 *
 * Slug generation is deterministic: kebab-case from topic ID with common transforms.
 */

import { p0DecisionDefinitions, type P0DecisionDefinition } from './p0-decision-definitions';
import { topicInventory, type TopicInventoryItem } from './topic-inventory';
import type { DecisionTopic, TopicInput } from './decision-topics';

/**
 * Deterministic slug generation from topic ID
 * Handles common patterns to produce SEO-friendly slugs
 */
export function generateSlugFromId(id: string): string {
  // Map of ID patterns to slug transforms
  const slugMappings: Record<string, string> = {
    // Timing topics (month-specific)
    'tz-feb': 'tanzania-safari-february',
    'tz-jul': 'tanzania-safari-july',
    'tz-nov': 'tanzania-safari-november',
    'ke-aug': 'kenya-safari-august',
    'bw-jun': 'botswana-safari-june',

    // Comparison topics
    'tz-vs-ke': 'tanzania-vs-kenya-first-safari',
    'tz-vs-bw': 'tanzania-vs-botswana-safari',
    'sa-vs-ea': 'south-africa-vs-east-africa-safari',
    'uganda-vs-rwanda': 'uganda-vs-rwanda-gorillas',
    'serengeti-vs-mara': 'serengeti-vs-masai-mara',
    'kruger-vs-private': 'kruger-vs-private-reserves',
    'lodge-vs-tented': 'lodge-vs-tented-camp',
    'private-vs-shared': 'private-vs-shared-vehicle',
    'fly-vs-drive': 'fly-vs-drive-between-parks',
    'inside-vs-outside-park': 'stay-inside-or-outside-park',
    'peak-vs-value': 'peak-season-vs-value-season',

    // Personal fit topics
    'first-timer-ready': 'am-i-ready-for-first-safari',
    'solo-safari-fit': 'solo-safari-travel',
    'family-young-kids': 'safari-with-young-children',
    'multigenerational': 'multigenerational-safari',
    'honeymoon-fit': 'safari-honeymoon',
    'wildlife-expectation': 'big-five-expectations',

    // Destination topics
    'rwanda-gorillas-worth': 'rwanda-gorillas-worth-it',
    'okavango-worth': 'okavango-delta-worth-premium',
    'single-country-multi': 'single-vs-multi-country-safari',

    // Timing topics (general)
    'tz-dry-season': 'tanzania-dry-season-only',
    'migration-timing': 'great-migration-timing',
    'river-crossings': 'mara-river-crossings-timing',
    'calving-season': 'calving-season-safari',
    'green-season-value': 'green-season-safari-worth-it',
    'christmas-safari': 'christmas-safari-timing',
    'booking-lead-time': 'safari-booking-lead-time',

    // Experience topics
    'walking-safari': 'walking-safari-worth-it',
    'self-drive-safari': 'self-drive-safari',

    // Accommodation topics
    'luxury-worth-it': 'luxury-safari-worth-it',
    'budget-accommodation-ok': 'budget-safari-accommodation',
    'camp-hopping': 'multiple-camps-vs-one',

    // Logistics topics
    'trip-length': 'is-5-days-enough-for-safari',
    'ideal-length': 'ideal-safari-length',
    'beach-extension': 'safari-beach-extension',
    'agent-vs-direct': 'book-safari-agent-vs-direct',

    // Risk/Ethics topics
    'malaria-decision': 'avoid-malaria-zones-safari',

    // Value/Cost topics
    'total-budget': 'safari-total-budget',
    'budget-tanzania': 'tanzania-safari-on-budget',
    'cheap-warning': 'cheap-safari-warning',
    'splurge-allocation': 'safari-splurge-vs-save',
  };

  return slugMappings[id] || id.replace(/_/g, '-');
}

/**
 * Get inventory metadata for a topic ID
 */
function getInventoryItem(id: string): TopicInventoryItem | undefined {
  return topicInventory.find((item) => item.id === id);
}

/**
 * Derive destinations from topic question and ID
 */
function deriveDestinations(def: P0DecisionDefinition): string[] {
  const q = def.question.toLowerCase();
  const id = def.id;

  // Explicit destination mappings
  if (id.startsWith('tz-') || id === 'budget-tanzania') return ['Tanzania'];
  if (id.startsWith('ke-')) return ['Kenya'];
  if (id.startsWith('bw-')) return ['Botswana'];
  if (id.includes('rwanda')) return ['Rwanda'];
  if (id.includes('uganda')) return ['Uganda'];

  // Comparison topics
  if (id === 'tz-vs-ke') return ['Tanzania', 'Kenya'];
  if (id === 'tz-vs-bw') return ['Tanzania', 'Botswana'];
  if (id === 'sa-vs-ea') return ['South Africa', 'Tanzania', 'Kenya'];
  if (id === 'uganda-vs-rwanda') return ['Uganda', 'Rwanda'];
  if (id === 'serengeti-vs-mara') return ['Tanzania', 'Kenya'];
  if (id === 'kruger-vs-private') return ['South Africa'];

  // Generic multi-destination topics
  if (q.includes('tanzania') && q.includes('kenya')) return ['Tanzania', 'Kenya'];
  if (q.includes('okavango')) return ['Botswana'];
  if (q.includes('kruger')) return ['South Africa'];

  // Default: common safari destinations
  return ['Tanzania', 'Kenya', 'Botswana'];
}

/**
 * Derive time context from topic
 */
function deriveTimeContext(def: P0DecisionDefinition): DecisionTopic['time_context'] {
  const id = def.id;
  const q = def.question.toLowerCase();

  // Month-specific topics
  if (id === 'tz-feb') return { month: 'February' };
  if (id === 'tz-jul') return { month: 'July' };
  if (id === 'tz-nov') return { month: 'November' };
  if (id === 'ke-aug') return { month: 'August' };
  if (id === 'bw-jun') return { month: 'June' };
  if (id === 'christmas-safari') return { month: 'December' };

  // Season topics
  if (id === 'green-season-value' || q.includes('green season')) return { season: 'green' };
  if (id === 'tz-dry-season' || q.includes('dry season')) return { season: 'dry' };
  if (id === 'calving-season') return { season: 'calving', month: 'February' };

  return undefined;
}

/**
 * Derive traveler profiles from topic
 */
function deriveTravelerProfiles(def: P0DecisionDefinition): string[] {
  const id = def.id;
  const q = def.question.toLowerCase();
  const profiles: string[] = [];

  // Personal fit topics
  if (id === 'first-timer-ready' || q.includes('first')) profiles.push('first_time');
  if (id === 'solo-safari-fit' || q.includes('solo')) profiles.push('solo');
  if (id === 'family-young-kids' || q.includes('children') || q.includes('kids')) profiles.push('families');
  if (id === 'multigenerational') profiles.push('families', 'multigenerational');
  if (id === 'honeymoon-fit' || q.includes('honeymoon')) profiles.push('couples', 'honeymoon');

  // Budget-related
  if (id.includes('budget') || q.includes('budget')) profiles.push('budget_conscious');
  if (id === 'luxury-worth-it' || q.includes('luxury')) profiles.push('luxury');

  // Experience level
  if (q.includes('repeat') || id.includes('repeat')) profiles.push('repeat');

  // Default
  if (profiles.length === 0) profiles.push('first_time');

  return profiles;
}

/**
 * Convert P0 definition inputs to TopicInput format
 */
function toTopicInputs(
  inputs: P0DecisionDefinition['required_inputs'] | P0DecisionDefinition['optional_inputs']
): TopicInput[] {
  return inputs.map((input) => ({
    key: input.key,
    label: input.label,
    example: input.example,
  }));
}

/**
 * Derive eligible outcomes from topic context
 */
function deriveEligibleOutcomes(def: P0DecisionDefinition): ('book' | 'wait' | 'switch' | 'discard')[] {
  const id = def.id;
  const q = def.question.toLowerCase();

  // Comparison topics typically result in book or switch
  if (q.includes(' or ') || q.includes(' vs ')) {
    return ['book', 'switch'];
  }

  // Topics with high uncertainty
  if (id.includes('green-season') || id === 'river-crossings' || id === 'calving-season') {
    return ['book', 'wait', 'switch', 'discard'];
  }

  // Family/kids topics need more caution
  if (id === 'family-young-kids' || id === 'multigenerational') {
    return ['book', 'wait', 'switch', 'discard'];
  }

  // Default: most topics can result in book, wait, or switch
  return ['book', 'wait', 'switch'];
}

/**
 * Derive default outcome
 */
function deriveDefaultOutcome(def: P0DecisionDefinition): 'book' | 'wait' | 'switch' | 'discard' {
  const id = def.id;
  const q = def.question.toLowerCase();

  // Topics that typically counsel caution
  if (id === 'family-young-kids') return 'wait';
  if (id === 'green-season-value') return 'wait';
  if (id === 'cheap-warning') return 'wait';
  if (id === 'river-crossings') return 'wait'; // Unpredictable

  // Most topics lean toward actionable advice
  return 'book';
}

/**
 * Derive confidence range from topic complexity
 */
function deriveConfidenceRange(def: P0DecisionDefinition, inv?: TopicInventoryItem): [number, number] {
  if (!inv) return [0.6, 0.85];

  switch (inv.decision_complexity) {
    case 'binary':
      return [0.7, 0.9];
    case 'conditional':
      return [0.6, 0.85];
    case 'multi-factor':
      return [0.5, 0.8];
    default:
      return [0.6, 0.85];
  }
}

/**
 * Generate context line from topic
 */
function generateContextLine(def: P0DecisionDefinition, inv?: TopicInventoryItem): string {
  const id = def.id;

  // Custom context lines for specific topics
  const contextLines: Record<string, string> = {
    'first-timer-ready': 'Readiness depends on expectations and preparation.',
    'solo-safari-fit': 'Solo travel works, but costs and social dynamics differ.',
    'family-young-kids': 'Age matters less than preparation.',
    'multigenerational': 'Group dynamics require careful planning.',
    'honeymoon-fit': 'Safari honeymoons reward the adventurous.',
    'wildlife-expectation': 'The Big Five is a starting point, not a checklist.',
    'tz-vs-ke': 'Both deliver, but they deliver differently.',
    'tz-vs-bw': 'Different price points, different experiences.',
    'sa-vs-ea': 'Malaria and self-drive are the key differentiators.',
    'rwanda-gorillas-worth': 'The permit cost is high. The experience may justify it.',
    'uganda-vs-rwanda': 'Cost vs convenience is the core trade-off.',
    'okavango-worth': 'The premium buys exclusivity and water activities.',
    'serengeti-vs-mara': 'Scale vs accessibility defines the choice.',
    'kruger-vs-private': 'Self-drive freedom vs guided expertise.',
    'single-country-multi': 'Depth often beats breadth on a first trip.',
    'tz-dry-season': 'Dry season is optimal, but not the only option.',
    'migration-timing': 'The migration is continuous, not a single event.',
    'river-crossings': 'Crossings are unpredictable. Plan accordingly.',
    'calving-season': 'Calving offers predator action in green conditions.',
    'green-season-value': 'Green season divides opinion for good reason.',
    'christmas-safari': 'Peak season pricing meets variable weather.',
    'tz-feb': 'February rewards flexibility, but it is uneven.',
    'tz-jul': 'July is peak season with clear trade-offs.',
    'ke-aug': 'August is migration peak in the Mara.',
    'bw-jun': 'June marks the start of Botswana dry season.',
    'booking-lead-time': 'Lead time requirements vary by season and camp.',
    'walking-safari': 'Walking adds immersion but requires fitness.',
    'self-drive-safari': 'Self-drive works in some destinations, not others.',
    'private-vs-shared': 'Private vehicles cost more but deliver control.',
    'lodge-vs-tented': 'Both styles exist at all comfort levels.',
    'luxury-worth-it': 'Luxury improves comfort, not wildlife.',
    'budget-accommodation-ok': 'Budget safaris exist, but trade-offs are real.',
    'inside-vs-outside-park': 'Inside-park means more game time.',
    'camp-hopping': 'Moving camps adds variety but costs time.',
    'trip-length': 'Five days works, but constraints matter.',
    'ideal-length': 'Seven to ten days is the sweet spot for most.',
    'fly-vs-drive': 'Flying saves time. Driving adds scenery.',
    'beach-extension': 'Beach adds recovery time at added cost.',
    'agent-vs-direct': 'Agents add value for complex itineraries.',
    'malaria-decision': 'Malaria zones include the best wildlife areas.',
    'total-budget': 'Budget ranges vary 10x depending on style.',
    'budget-tanzania': 'Budget safaris exist, but trade-offs are real.',
    'peak-vs-value': 'Peak season costs more for better conditions.',
    'cheap-warning': 'Below market rates signal quality concerns.',
    'splurge-allocation': 'Guide quality matters more than room luxury.',
  };

  return contextLines[id] || `A decision with trade-offs. Read the conditions.`;
}

/**
 * Convert P0DecisionDefinition to DecisionTopic
 */
export function p0DefToDecisionTopic(def: P0DecisionDefinition): DecisionTopic {
  const inv = getInventoryItem(def.id);

  return {
    topic_id: def.id,
    slug: generateSlugFromId(def.id),
    question: def.question,
    context_line: generateContextLine(def, inv),
    destinations: deriveDestinations(def),
    time_context: deriveTimeContext(def),
    traveler_profiles: deriveTravelerProfiles(def),
    primary_risks: def.refusal_triggers.slice(0, 3),
    key_tradeoffs: def.tradeoffs.slice(0, 2).map((t) => `${t.gain} vs ${t.loss}`),
    eligible_outcomes: deriveEligibleOutcomes(def),
    default_outcome: deriveDefaultOutcome(def),
    confidence_range: deriveConfidenceRange(def, inv),
    published: true,
    required_inputs: toTopicInputs(def.required_inputs),
    optional_inputs: toTopicInputs(def.optional_inputs),
    // Strategic metadata from inventory
    launch_priority: inv?.launch_priority || 'P0',
    assurance_eligible: inv?.assurance_eligible ?? true,
    seo_intent: inv?.seo_intent || 'high',
    bucket: inv?.bucket as DecisionTopic['bucket'],
    compare_enabled: inv?.compare_enabled ?? false,
  };
}

/**
 * Generate all P0 runtime topics
 */
export function generateP0Topics(): DecisionTopic[] {
  return p0DecisionDefinitions.map(p0DefToDecisionTopic);
}

/**
 * Get all P0 topic IDs
 */
export function getP0TopicIds(): string[] {
  return p0DecisionDefinitions.map((def) => def.id);
}

/**
 * Get P0 topic count
 */
export function getP0TopicCount(): number {
  return p0DecisionDefinitions.length;
}
