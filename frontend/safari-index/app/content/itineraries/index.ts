/**
 * Itineraries Module - Barrel Export
 *
 * Production-ready itinerary layer for Safari Index.
 * Provides bookable-feeling itineraries that remain decision-backed.
 */

// Types
export type {
  Itinerary,
  ItinerarySummary,
  ItinerarySegment,
  ItineraryInquiryPrefill,
  ItineraryStyleTag,
  DurationBand,
  AccommodationTier,
  TravelMode,
  ExtensionOption,
  VariantOptions,
  SeasonWindow,
  TradeOff,
} from './types';

// Data and utilities
export {
  itineraries,
  getAllItineraries,
  getFeaturedItineraries,
  getItineraryById,
  getItineraryBySlug,
  getItinerariesByRegion,
  getItinerariesByStyle,
  getItinerarySummaries,
  buildInquiryPrefill,
  formatDurationBand,
  getAllStyleTags,
  getAllItineraryRegions,
} from './itineraries';
