/**
 * Itinerary Layer - Type Definitions
 *
 * Production-ready itinerary data model that feels familiar and bookable
 * to safari travelers while remaining decision-backed and composable.
 *
 * Key principles:
 * - Built from reusable segments
 * - Integrates with decisions, activities, and inquiries
 * - Does NOT lock prices or dates
 * - Does NOT alter engine behavior
 * - Documentary, operator-grade tone
 */

import type { RegionTag, ComfortTier, TravelerFit, CostBand } from '../trip-shapes/trips';
import type { ActivityCategory } from '../activities/activity-primitives';

/**
 * Style tags for itinerary categorization
 * These align with common safari traveler search patterns
 */
export type ItineraryStyleTag =
  | 'first-safari'
  | 'migration'
  | 'family'
  | 'luxury'
  | 'value'
  | 'adventure'
  | 'honeymoon'
  | 'photography'
  | 'walking'
  | 'primate'
  | 'self-drive'
  | 'fly-in'
  | 'beach-combo';

/**
 * Duration band for flexible trip lengths
 */
export interface DurationBand {
  min_days: number;
  max_days: number;
  typical_days: number;
}

/**
 * Accommodation tier options for variants
 */
export type AccommodationTier = 'budget' | 'mid-range' | 'premium' | 'ultra-premium';

/**
 * Travel mode options
 */
export type TravelMode = 'drive' | 'fly' | 'mixed';

/**
 * Extension options available for this itinerary
 */
export interface ExtensionOption {
  id: string;
  name: string;
  description: string;
  adds_days: number;
  adds_cost_estimate: { low: number; high: number };
  type: 'beach' | 'extra-nights' | 'side-trip' | 'activity-add-on';
}

/**
 * Variant options for itinerary customization
 */
export interface VariantOptions {
  accommodation_tiers: AccommodationTier[];
  travel_modes: TravelMode[];
  extensions: ExtensionOption[];
}

/**
 * Individual segment within an itinerary
 * Represents a logical portion of the journey (not individual days)
 */
export interface ItinerarySegment {
  id: string;
  order: number;
  title: string;
  location: string;
  region: RegionTag;
  nights: number | [number, number]; // Fixed or range
  description: string;
  highlights: string[];
  activities_available: string[]; // Activity IDs from activity-primitives
  accommodation_archetype: string; // Archetype ID
  typical_day: {
    dawn?: string;
    morning: string;
    midday: string;
    afternoon: string;
    evening: string;
    night?: string;
  };
  transfers: {
    arrival: string;
    departure: string;
  };
}

/**
 * Season window for best travel timing
 */
export interface SeasonWindow {
  name: string;
  months: number[]; // 1-12
  description: string;
  is_peak: boolean;
}

/**
 * Trade-off statement (documentary tone)
 */
export interface TradeOff {
  gain: string;
  cost: string;
}

/**
 * Core Itinerary Definition
 *
 * This is the main data structure for a bookable-feeling itinerary
 * that remains decision-backed and composable.
 */
export interface Itinerary {
  // Identity
  id: string;
  slug: string;
  title: string;
  subtitle: string;

  // Region and routing
  region: RegionTag;
  secondary_regions: RegionTag[];
  route_summary: string; // e.g., "Arusha → Tarangire → Serengeti → Ngorongoro → Arusha"

  // Duration
  duration_band: DurationBand;

  // Categorization
  style_tags: ItineraryStyleTag[];
  traveler_fit: TravelerFit[];
  comfort_tier: ComfortTier;

  // Segments (ordered list of journey parts)
  core_segments: ItinerarySegment[];

  // Variant options
  variant_options: VariantOptions;

  // Activities
  included_activities: string[]; // Activity IDs
  optional_activities: string[]; // Additional available activities

  // Decision linkage (max 6)
  linked_decisions: string[]; // topic_ids, max 6

  // Cost context (not booking prices)
  cost_band: CostBand;

  // Timing
  best_season_windows: SeasonWindow[];

  // Trade-offs (3-5 bullets, documentary tone)
  trade_offs: TradeOff[];

  // Fit guidance
  who_this_is_for: string;
  who_this_is_not_for: string;

  // SEO and content
  hero_image_hint: string;
  meta_description: string;

  // Trip shape linkage (if maps to existing shape)
  linked_trip_shape_id: string | null;

  // Safari type linkage (categorization by traveler intent)
  safari_type_id: string | null;

  // Flags
  is_featured: boolean;
  is_published: boolean;
}

/**
 * Itinerary summary for hub page listings
 */
export interface ItinerarySummary {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  region: RegionTag;
  duration_band: DurationBand;
  style_tags: ItineraryStyleTag[];
  comfort_tier: ComfortTier;
  cost_band: CostBand;
  hero_image_hint: string;
  is_featured: boolean;
}

/**
 * Inquiry prefill data from itinerary
 */
export interface ItineraryInquiryPrefill {
  itinerary_id: string;
  itinerary_title: string;
  linked_decision_ids: string[];
  suggested_duration: number;
  suggested_budget_band: string;
  region: RegionTag;
}
