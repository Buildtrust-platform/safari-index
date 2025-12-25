/**
 * Trip Links Module
 *
 * Maps trip archetypes to decisions and guides.
 * Enforces linking rules:
 * - Max 6 decision links per trip
 * - Max 3 guide links per trip
 * - Descriptive, non-repetitive anchor text
 */

import {
  tripArchetypes,
  type TripArchetype,
} from '../app/content/trip-shapes/trips';
import { topicInventory } from '../app/content/topic-inventory';
import { generateSlugFromId } from '../app/content/p0-topics-bridge';

// ============================================================================
// Constants
// ============================================================================

const MAX_DECISION_LINKS = 6;
const MAX_GUIDE_LINKS = 3;

// ============================================================================
// Types
// ============================================================================

export interface DecisionLink {
  topicId: string;
  href: string;
  anchorText: string;
  title: string;
}

export interface GuideLink {
  slug: string;
  href: string;
  anchorText: string;
  title: string;
}

// ============================================================================
// Decision Link Generation
// ============================================================================

/**
 * Get decision links for a trip archetype
 * Returns validated links with descriptive anchor text
 */
export function getDecisionLinksForTrip(trip: TripArchetype): DecisionLink[] {
  const links: DecisionLink[] = [];

  // Limit to max allowed
  const topicIds = trip.linked_decisions.slice(0, MAX_DECISION_LINKS);

  for (const topicId of topicIds) {
    const topic = topicInventory.find((t) => t.id === topicId);
    if (!topic) continue;

    const slug = generateSlugFromId(topicId);

    links.push({
      topicId,
      href: `/decisions/${slug}`,
      anchorText: topic.title,
      title: `Get a personalized decision: ${topic.title}`,
    });
  }

  return links;
}

/**
 * Get guide links for a trip archetype
 * Returns validated links with descriptive anchor text
 */
export function getGuideLinksForTrip(trip: TripArchetype): GuideLink[] {
  const links: GuideLink[] = [];

  // Limit to max allowed
  const slugs = trip.linked_guides.slice(0, MAX_GUIDE_LINKS);

  for (const slug of slugs) {
    // Find the topic that matches this slug
    const topic = topicInventory.find((t) => {
      const generatedSlug = generateSlugFromId(t.id);
      return generatedSlug === slug;
    });

    if (!topic) continue;

    // Determine bucket slug
    const bucketSlug = topic.bucket.replace('_', '-');

    links.push({
      slug,
      href: `/guides/${bucketSlug}/${slug}`,
      anchorText: topic.title,
      title: `Read our guide: ${topic.title}`,
    });
  }

  return links;
}

// ============================================================================
// Trip Variants
// ============================================================================

export interface TripVariant {
  id: string;
  label: string;
  description: string;
  differentiator: string;
}

/**
 * Generate variants for a trip based on comfort tier
 * Returns 2-3 variants showing different approaches
 */
export function getTripVariants(trip: TripArchetype): TripVariant[] {
  const variants: TripVariant[] = [];
  const tier = trip.comfort_tier;

  // Primary variant is always the trip's actual tier
  const primaryVariant: TripVariant = {
    id: 'primary',
    label: tier === 'budget' ? 'Value Focus' : tier === 'mid' ? 'Balanced Approach' : 'Premium Experience',
    description: getVariantDescription(trip, tier),
    differentiator: getVariantDifferentiator(tier),
  };
  variants.push(primaryVariant);

  // Add adjacent tier variants where logical
  if (tier === 'budget') {
    variants.push({
      id: 'mid-upgrade',
      label: 'Mid-Range Upgrade',
      description: `Same route with improved accommodation and smaller group sizes.`,
      differentiator: 'Better lodges, more flexibility',
    });
  } else if (tier === 'mid') {
    variants.push({
      id: 'budget-alternative',
      label: 'Budget Alternative',
      description: `Same destinations with simpler accommodation and shared transfers.`,
      differentiator: 'Lower cost, basic comfort',
    });
    variants.push({
      id: 'luxury-upgrade',
      label: 'Luxury Upgrade',
      description: `Same route with premium camps and private guiding throughout.`,
      differentiator: 'Exclusive access, personalized service',
    });
  } else if (tier === 'luxury') {
    variants.push({
      id: 'mid-alternative',
      label: 'Mid-Range Alternative',
      description: `Similar experience with well-regarded lodges at more accessible pricing.`,
      differentiator: 'Good value, solid experience',
    });
  }

  return variants;
}

function getVariantDescription(trip: TripArchetype, tier: string): string {
  const duration = Array.isArray(trip.duration_days)
    ? `${trip.duration_days[0]}–${trip.duration_days[1]} days`
    : `${trip.duration_days} days`;

  const parks = trip.core_parks_or_areas.slice(0, 3).join(', ');

  return `${duration} covering ${parks}. ${tier === 'luxury' ? 'Premium camps with private guiding.' : tier === 'mid' ? 'Quality lodges with experienced guides.' : 'Basic but comfortable accommodation.'}`;
}

function getVariantDifferentiator(tier: string): string {
  switch (tier) {
    case 'luxury':
      return 'Exclusive camps, private vehicles';
    case 'mid':
      return 'Quality lodges, small groups';
    case 'budget':
      return 'Essential comfort, shared vehicles';
    default:
      return '';
  }
}

// ============================================================================
// Trip Filtering Helpers
// ============================================================================

/**
 * Get all unique regions from trip archetypes
 */
export function getAllTripRegions(): string[] {
  const regions = new Set<string>();
  for (const trip of tripArchetypes) {
    for (const region of trip.regions) {
      regions.add(region);
    }
  }
  return Array.from(regions).sort();
}

/**
 * Get all unique durations from trip archetypes
 */
export function getAllTripDurations(): string[] {
  const durations = new Set<string>();
  for (const trip of tripArchetypes) {
    if (Array.isArray(trip.duration_days)) {
      durations.add(`${trip.duration_days[0]}-${trip.duration_days[1]}`);
    } else {
      durations.add(String(trip.duration_days));
    }
  }
  return Array.from(durations).sort();
}

/**
 * Get all comfort tiers
 */
export function getAllComfortTiers(): string[] {
  return ['budget', 'mid', 'luxury'];
}

// ============================================================================
// Decision → Trip Linking (Reverse Lookup)
// ============================================================================

const MAX_TRIPS_PER_DECISION = 3;

export interface TripLink {
  tripId: string;
  href: string;
  title: string;
  subtitle: string;
}

/**
 * Get trips where a specific decision matters
 * Returns max 3 most relevant trips for this decision
 */
export function getTripsForDecision(topicId: string): TripLink[] {
  const links: TripLink[] = [];

  // Find all trips that link to this decision
  const matchingTrips = tripArchetypes.filter((trip) =>
    trip.linked_decisions.includes(topicId)
  );

  // Prioritize by assurance relevance and then by linked_decisions length (fewer = more focused)
  const sortedTrips = matchingTrips.sort((a, b) => {
    // Assurance-relevant trips first
    if (a.assurance_relevance && !b.assurance_relevance) return -1;
    if (!a.assurance_relevance && b.assurance_relevance) return 1;
    // Then by number of linked decisions (fewer = more focused on this decision)
    return a.linked_decisions.length - b.linked_decisions.length;
  });

  // Take top 3
  const selectedTrips = sortedTrips.slice(0, MAX_TRIPS_PER_DECISION);

  for (const trip of selectedTrips) {
    links.push({
      tripId: trip.id,
      href: `/trips/${trip.id}`,
      title: trip.title,
      subtitle: trip.subtitle,
    });
  }

  return links;
}

/**
 * Check if a decision has any linked trips
 */
export function decisionHasLinkedTrips(topicId: string): boolean {
  return tripArchetypes.some((trip) => trip.linked_decisions.includes(topicId));
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Validate that a trip's linked decisions exist
 */
export function validateTripDecisionLinks(trip: TripArchetype): {
  valid: boolean;
  missing: string[];
} {
  const missing: string[] = [];

  for (const topicId of trip.linked_decisions) {
    const exists = topicInventory.some((t) => t.id === topicId);
    if (!exists) {
      missing.push(topicId);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Validate all trips have valid links
 */
export function validateAllTripLinks(): {
  valid: boolean;
  issues: Array<{ tripId: string; missingDecisions: string[] }>;
} {
  const issues: Array<{ tripId: string; missingDecisions: string[] }> = [];

  for (const trip of tripArchetypes) {
    const validation = validateTripDecisionLinks(trip);
    if (!validation.valid) {
      issues.push({
        tripId: trip.id,
        missingDecisions: validation.missing,
      });
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
