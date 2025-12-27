/**
 * Safari Types - Type Definitions
 *
 * Safari Types categorize safaris by traveler intent and experience style.
 * They sit above itineraries as a discovery layer, helping travelers
 * identify which safari approach matches their goals.
 *
 * Key principles:
 * - Documentary, operator-grade tone (no hype, no emojis)
 * - Explicit trade-offs for every type
 * - Links to itineraries, decisions, and activities
 * - Does NOT alter engine behavior or API schemas
 */

import type { RegionTag, TravelerFit } from '../trip-shapes/trips';

/**
 * Pace describes the daily rhythm and intensity
 */
export type SafariPace = 'slow' | 'moderate' | 'structured' | 'variable';

/**
 * Privacy level indicates exclusivity expectations
 */
export type PrivacyLevel = 'low' | 'medium' | 'high' | 'very-high';

/**
 * Physical demand for the safari type
 */
export type PhysicalDemand = 'low' | 'medium' | 'high';

/**
 * Predictability of the experience
 */
export type Predictability = 'low' | 'medium' | 'high';

/**
 * Safari Type Attributes
 * Describes the operational characteristics of this safari style
 */
export interface SafariTypeAttributes {
  pace: SafariPace;
  accommodation_style: string;
  activity_mix: string;
  vehicle_rules: string;
  privacy_level: PrivacyLevel;
  physical_demand: PhysicalDemand;
  predictability: Predictability;
}

/**
 * Trade-offs for safari type
 */
export interface SafariTypeTradeoffs {
  gains: string[];
  losses: string[];
}

/**
 * Image guidance for sourcing/commissioning photos
 */
export interface ImageGuidance {
  landscape_context: string;
  activity_moment: string;
  accommodation_mood: string;
  human_presence: string;
}

/**
 * Internal commercial notes (not user-facing)
 */
export interface CommercialNotes {
  why_converts: string;
  typical_objections: string[];
  operator_interventions: string[];
}

/**
 * Core Safari Type Definition
 */
export interface SafariType {
  // Identity
  id: string;
  name: string;
  positioning_line: string;

  // Attributes
  attributes: SafariTypeAttributes;

  // Characteristics (lived experience bullets)
  characteristics: string[];

  // Trade-offs
  tradeoffs: SafariTypeTradeoffs;

  // Suitability
  best_for: string[];
  not_ideal_for: string[];

  // Linkage
  linked_style_tags: string[]; // ItineraryStyleTag values
  linked_traveler_fits: TravelerFit[];
  primary_regions: RegionTag[];

  // Content
  image_guidance: ImageGuidance;

  // Internal (not rendered to users)
  commercial_notes: CommercialNotes;

  // Flags
  is_published: boolean;
  display_order: number;
}

/**
 * Safari Type Summary for hub listings
 */
export interface SafariTypeSummary {
  id: string;
  name: string;
  positioning_line: string;
  attributes: Pick<SafariTypeAttributes, 'pace' | 'physical_demand' | 'privacy_level'>;
  best_for: string[];
  display_order: number;
}

/**
 * Flagship itinerary definition for a safari type
 */
export interface FlagshipItinerary {
  safari_type_id: string;
  itinerary_id: string;
  is_primary: boolean; // true for main flagship, false for variants
  variant_differentiator?: string; // e.g., "shorter duration", "different destination"
}
