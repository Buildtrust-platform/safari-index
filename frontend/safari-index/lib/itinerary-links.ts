/**
 * Itinerary Linking Utilities
 *
 * Deterministic helpers for cross-linking itineraries with:
 * - Decisions (reverse lookup)
 * - Trip shapes
 * - Other itineraries (related)
 * - Guides
 *
 * Scoring rules:
 * - Shared country > shared parks > shared tags > shared months
 */

import {
  getAllItineraries,
  getItineraryById,
  type Itinerary,
} from '../app/content/itineraries';

// ============================================================
// TYPES
// ============================================================

export interface LinkedDecision {
  id: string;
  relevance: 'high' | 'medium' | 'low';
}

export interface LinkedTrip {
  id: string;
  title: string;
  matchReason: string;
}

export interface RelatedItinerary {
  id: string;
  slug: string;
  title: string;
  region: string;
  score: number;
  matchReasons: string[];
}

// ============================================================
// DECISION LINKING
// ============================================================

/**
 * Get linked decisions for an itinerary (max 6 shown)
 * Returns decisions in order of relevance
 */
export function getLinkedDecisionsForItinerary(itinerary: Itinerary): string[] {
  // Return decisions in order, limited to 6
  return itinerary.linked_decisions.slice(0, 6);
}

/**
 * Get itineraries that link to a specific decision
 * Used for reverse lookup on decision pages
 */
export function getItinerariesForDecision(decisionId: string, limit = 3): Itinerary[] {
  const allItineraries = getAllItineraries();

  const matching = allItineraries.filter((itinerary) =>
    itinerary.linked_decisions.includes(decisionId)
  );

  // Sort by featured status, then by cost (lower first for variety)
  matching.sort((a, b) => {
    if (a.is_featured !== b.is_featured) {
      return a.is_featured ? -1 : 1;
    }
    return a.cost_band.low - b.cost_band.low;
  });

  return matching.slice(0, limit);
}

// ============================================================
// TRIP SHAPE LINKING
// ============================================================

/**
 * Get linked trips for an itinerary (max 3 shown)
 * Uses linked_trip_shape_id and region matching
 */
export function getLinkedTripsForItinerary(itinerary: Itinerary): LinkedTrip[] {
  const trips: LinkedTrip[] = [];

  // Primary: explicit link
  if (itinerary.linked_trip_shape_id) {
    trips.push({
      id: itinerary.linked_trip_shape_id,
      title: formatTripShapeTitle(itinerary.linked_trip_shape_id),
      matchReason: 'Direct match',
    });
  }

  // Secondary: region-based suggestions
  const regionTrips = getRegionTripShapes(itinerary.region);
  for (const tripId of regionTrips) {
    if (trips.length >= 3) break;
    if (tripId !== itinerary.linked_trip_shape_id) {
      trips.push({
        id: tripId,
        title: formatTripShapeTitle(tripId),
        matchReason: `Same region: ${itinerary.region}`,
      });
    }
  }

  return trips.slice(0, 3);
}

/**
 * Get itineraries linked to a trip shape
 */
export function getItinerariesForTripShape(tripShapeId: string, limit = 3): Itinerary[] {
  const allItineraries = getAllItineraries();

  // Direct matches first
  const directMatches = allItineraries.filter(
    (i) => i.linked_trip_shape_id === tripShapeId
  );

  if (directMatches.length >= limit) {
    return directMatches.slice(0, limit);
  }

  // Then region matches for the trip shape region
  const tripRegion = extractRegionFromTripShape(tripShapeId);
  if (tripRegion) {
    const regionMatches = allItineraries.filter(
      (i) => i.region === tripRegion && i.linked_trip_shape_id !== tripShapeId
    );
    return [...directMatches, ...regionMatches].slice(0, limit);
  }

  return directMatches.slice(0, limit);
}

// ============================================================
// RELATED ITINERARIES
// ============================================================

/**
 * Get related itineraries (max 4)
 * Scoring: shared country > shared parks > shared tags > shared months
 */
export function getRelatedItineraries(
  itinerary: Itinerary,
  limit = 4
): RelatedItinerary[] {
  const allItineraries = getAllItineraries();
  const scored: RelatedItinerary[] = [];

  for (const other of allItineraries) {
    // Skip self
    if (other.id === itinerary.id) continue;

    let score = 0;
    const matchReasons: string[] = [];

    // Shared country/region (highest weight)
    if (other.region === itinerary.region) {
      score += 100;
      matchReasons.push('Same region');
    } else if (
      other.secondary_regions.some((r) =>
        itinerary.secondary_regions.includes(r)
      )
    ) {
      score += 50;
      matchReasons.push('Overlapping regions');
    }

    // Shared style tags (medium weight)
    const sharedTags = other.style_tags.filter((t) =>
      itinerary.style_tags.includes(t)
    );
    if (sharedTags.length > 0) {
      score += sharedTags.length * 20;
      matchReasons.push(`Shared: ${sharedTags.slice(0, 2).join(', ')}`);
    }

    // Shared comfort tier (low weight)
    if (other.comfort_tier === itinerary.comfort_tier) {
      score += 10;
    }

    // Similar duration (low weight)
    const durationDiff = Math.abs(
      other.duration_band.typical_days - itinerary.duration_band.typical_days
    );
    if (durationDiff <= 2) {
      score += 5;
    }

    // Shared best months (low weight)
    const sharedMonths = other.best_season_windows.some((w) =>
      w.months.some((m) =>
        itinerary.best_season_windows.some((iw) => iw.months.includes(m))
      )
    );
    if (sharedMonths) {
      score += 3;
    }

    if (score > 0) {
      scored.push({
        id: other.id,
        slug: other.slug,
        title: other.title,
        region: other.region,
        score,
        matchReasons,
      });
    }
  }

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}

// ============================================================
// GUIDE LINKING
// ============================================================

/**
 * Get relevant guides for an itinerary (max 3)
 * Based on region and style tags
 */
export function getLinkedGuidesForItinerary(itinerary: Itinerary): string[] {
  const guides: string[] = [];

  // Region-based guides
  const regionGuides: Record<string, string[]> = {
    'tanzania': ['serengeti-guide', 'ngorongoro-guide', 'tanzania-timing'],
    'kenya': ['masai-mara-guide', 'kenya-timing', 'migration-guide'],
    'botswana': ['okavango-guide', 'botswana-timing', 'delta-guide'],
    'namibia': ['etosha-guide', 'namibia-self-drive'],
    'uganda-rwanda': ['gorilla-trekking-guide', 'primate-safari-guide'],
    'south-africa': ['kruger-guide', 'cape-town-guide'],
    'zambia': ['south-luangwa-guide', 'zambia-guide'],
    'zimbabwe': ['victoria-falls-guide', 'hwange-guide'],
  };

  const regionMatches = regionGuides[itinerary.region] || [];
  guides.push(...regionMatches.slice(0, 2));

  // Style-based guides
  const styleGuides: Record<string, string> = {
    'migration': 'migration-guide',
    'walking': 'walking-safari-guide',
    'primate': 'gorilla-trekking-guide',
    'family': 'family-safari-guide',
    'honeymoon': 'honeymoon-safari-guide',
    'photography': 'photography-safari-guide',
    'luxury': 'luxury-safari-guide',
  };

  for (const tag of itinerary.style_tags) {
    if (styleGuides[tag] && !guides.includes(styleGuides[tag])) {
      guides.push(styleGuides[tag]);
    }
  }

  return guides.slice(0, 3);
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Format trip shape ID to display title
 */
function formatTripShapeTitle(tripShapeId: string): string {
  return tripShapeId
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get trip shapes for a region
 */
function getRegionTripShapes(region: string): string[] {
  const regionTrips: Record<string, string[]> = {
    'tanzania': ['tanzania-classic', 'tanzania-migration', 'tanzania-beach-combo'],
    'kenya': ['kenya-classic', 'mara-migration-focused', 'kenya-family'],
    'botswana': ['botswana-delta', 'botswana-luxury', 'botswana-camping'],
    'namibia': ['namibia-self-drive', 'namibia-luxury'],
    'uganda-rwanda': ['uganda-gorilla', 'rwanda-gorilla', 'primate-combo'],
    'south-africa': ['south-africa-classic', 'south-africa-combo'],
    'zambia': ['zambia-walking', 'zambia-combo'],
    'zimbabwe': ['zimbabwe-falls-hwange', 'zimbabwe-combo'],
  };

  return regionTrips[region] || [];
}

/**
 * Extract region from trip shape ID
 */
function extractRegionFromTripShape(tripShapeId: string): string | null {
  const regionPrefixes: Record<string, string> = {
    'tanzania': 'tanzania',
    'kenya': 'kenya',
    'mara': 'kenya',
    'botswana': 'botswana',
    'okavango': 'botswana',
    'namibia': 'namibia',
    'uganda': 'uganda-rwanda',
    'rwanda': 'uganda-rwanda',
    'primate': 'uganda-rwanda',
    'gorilla': 'uganda-rwanda',
    'south-africa': 'south-africa',
    'kruger': 'south-africa',
    'zambia': 'zambia',
    'luangwa': 'zambia',
    'zimbabwe': 'zimbabwe',
  };

  for (const [prefix, region] of Object.entries(regionPrefixes)) {
    if (tripShapeId.toLowerCase().includes(prefix)) {
      return region;
    }
  }

  return null;
}

/**
 * Build inquiry URL with itinerary prefill
 */
export function buildItineraryInquiryUrl(itinerary: Itinerary): string {
  const params = new URLSearchParams();

  params.set('itinerary_id', itinerary.id);

  // Add linked decisions (first 6)
  const decisions = getLinkedDecisionsForItinerary(itinerary);
  if (decisions.length > 0) {
    params.set('selected_decision_ids', decisions.join(','));
  }

  // Add trip shape if linked
  if (itinerary.linked_trip_shape_id) {
    params.set('trip_id', itinerary.linked_trip_shape_id);
  }

  return `/inquire?${params.toString()}`;
}
