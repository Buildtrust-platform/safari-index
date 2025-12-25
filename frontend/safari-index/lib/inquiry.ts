/**
 * Safari Inquiry System
 *
 * Types and utilities for the trip inquiry flow.
 * This captures traveler intent and links to relevant decisions,
 * without booking, pricing, or availability features.
 *
 * Per governance:
 * - No booking or quotes
 * - No pricing or availability
 * - Documentary tone
 * - Links back to decision system
 */

import { TripArchetype, TravelerFit, ComfortTier } from '../app/content/trip-shapes/trips';

/**
 * Budget bands for inquiry (not actual prices)
 */
export type BudgetBand =
  | 'under-5k'
  | '5k-10k'
  | '10k-20k'
  | '20k-35k'
  | 'above-35k'
  | 'flexible';

/**
 * Travel style for inquiry
 */
export type TravelStyle =
  | 'solo'
  | 'couple'
  | 'family-young-kids'
  | 'family-teens'
  | 'multigenerational'
  | 'friends-group'
  | 'honeymoon';

/**
 * Month options for travel window
 */
export const MONTH_OPTIONS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

/**
 * Budget band display labels
 */
export const BUDGET_BANDS: { value: BudgetBand; label: string }[] = [
  { value: 'under-5k', label: 'Under $5,000 per person' },
  { value: '5k-10k', label: '$5,000 – $10,000 per person' },
  { value: '10k-20k', label: '$10,000 – $20,000 per person' },
  { value: '20k-35k', label: '$20,000 – $35,000 per person' },
  { value: 'above-35k', label: 'Above $35,000 per person' },
  { value: 'flexible', label: 'Flexible / Not yet determined' },
];

/**
 * Travel style display labels
 */
export const TRAVEL_STYLES: { value: TravelStyle; label: string }[] = [
  { value: 'solo', label: 'Solo traveler' },
  { value: 'couple', label: 'Couple' },
  { value: 'family-young-kids', label: 'Family with young children' },
  { value: 'family-teens', label: 'Family with teens' },
  { value: 'multigenerational', label: 'Multigenerational group' },
  { value: 'friends-group', label: 'Friends traveling together' },
  { value: 'honeymoon', label: 'Honeymoon' },
];

/**
 * Traveler count options
 */
export const TRAVELER_COUNTS = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' },
  { value: 7, label: '7' },
  { value: 8, label: '8+' },
];

/**
 * Trip Brief - The output of the inquiry form
 */
export interface TripBrief {
  inquiry_id: string;
  created_at: string;

  // Trip shape (optional - may not have selected one)
  trip_shape_id: string | null;
  trip_shape_title: string | null;

  // Core inputs
  budget_band: BudgetBand;
  travel_month: number | null;
  travel_year: number | null;
  traveler_count: number;
  travel_style: TravelStyle;

  // Contact
  email: string;
  whatsapp: string | null;

  // Linked decisions (derived from trip shape or inferred)
  linked_decision_ids: string[];

  // Additional context
  notes: string | null;
}

/**
 * Form state for the inquiry form
 */
export interface InquiryFormState {
  tripShapeId: string | null;
  budgetBand: BudgetBand | null;
  travelMonth: number | null;
  travelYear: number | null;
  travelerCount: number;
  travelStyle: TravelStyle | null;
  email: string;
  whatsapp: string;
  notes: string;
}

/**
 * Generate a unique inquiry ID
 */
export function generateInquiryId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `INQ-${timestamp}-${random}`.toUpperCase();
}

/**
 * Build a TripBrief from form state
 */
export function buildTripBrief(
  formState: InquiryFormState,
  trip: TripArchetype | null
): TripBrief {
  return {
    inquiry_id: generateInquiryId(),
    created_at: new Date().toISOString(),
    trip_shape_id: trip?.id || null,
    trip_shape_title: trip?.title || null,
    budget_band: formState.budgetBand || 'flexible',
    travel_month: formState.travelMonth,
    travel_year: formState.travelYear,
    traveler_count: formState.travelerCount,
    travel_style: formState.travelStyle || 'couple',
    email: formState.email,
    whatsapp: formState.whatsapp || null,
    linked_decision_ids: trip?.linked_decisions || [],
    notes: formState.notes || null,
  };
}

/**
 * Get travel style from trip's traveler fit
 */
export function inferTravelStyleFromTrip(trip: TripArchetype): TravelStyle | null {
  const fit = trip.traveler_fit;
  if (fit.includes('honeymoon')) return 'honeymoon';
  if (fit.includes('solo')) return 'solo';
  if (fit.includes('multigenerational')) return 'multigenerational';
  if (fit.includes('family')) return 'family-young-kids';
  return null;
}

/**
 * Get next year options (current year and next 2 years)
 */
export function getYearOptions(): { value: number; label: string }[] {
  const currentYear = new Date().getFullYear();
  return [
    { value: currentYear, label: String(currentYear) },
    { value: currentYear + 1, label: String(currentYear + 1) },
    { value: currentYear + 2, label: String(currentYear + 2) },
  ];
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate WhatsApp number (basic validation)
 */
export function isValidWhatsApp(phone: string): boolean {
  if (!phone) return true; // Optional field
  // Allow + prefix, spaces, dashes, and digits
  return /^\+?[\d\s-]{7,20}$/.test(phone.replace(/\s/g, ''));
}
