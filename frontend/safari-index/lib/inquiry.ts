/**
 * Safari Inquiry System - Decision-Led Planning Brief
 *
 * Types and utilities for the multi-step inquiry flow.
 * This captures traveler intent through a calm, guided conversation
 * without booking, pricing, or availability features.
 *
 * Per governance:
 * - No booking or quotes
 * - No pricing or availability
 * - Documentary tone, no hype
 * - Links back to decision system
 * - Refusal possible if constraints conflict
 */

import { TripArchetype, TravelerFit, ComfortTier } from '../app/content/trip-shapes/trips';

/**
 * Safari intent types - what kind of trip they're planning
 */
export type SafariIntent =
  | 'first-safari'
  | 'return-visit'
  | 'special-occasion'
  | 'photography'
  | 'family'
  | 'specific';

/**
 * Timing flexibility levels
 */
export type TimingFlexibility =
  | 'fixed'
  | 'few-weeks'
  | 'month-plus'
  | 'need-guidance';

/**
 * Budget bands for inquiry (not actual prices) - new design
 */
export type BudgetBand =
  | '3k-6k'
  | '6k-10k'
  | '10k-15k'
  | '15k-plus'
  | 'not-sure'
  // Legacy values for backwards compatibility
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
 * Traveler priorities - what matters most
 */
export type TravelerPriority =
  | 'wildlife-density'
  | 'exclusivity'
  | 'photography'
  | 'walking-active'
  | 'cultural'
  | 'relaxation'
  | 'specific-animals'
  | 'value'
  | 'beach-combo';

/**
 * Safari intent options for Step 1
 */
export const SAFARI_INTENTS: { value: SafariIntent; label: string; description: string }[] = [
  { value: 'first-safari', label: 'First safari', description: 'Want to get it right' },
  { value: 'return-visit', label: 'Return visit', description: 'Know what I want more of' },
  { value: 'special-occasion', label: 'Special occasion', description: 'Anniversary, honeymoon, milestone' },
  { value: 'photography', label: 'Photography-focused', description: 'Wildlife imagery is the priority' },
  { value: 'family', label: 'Family trip', description: 'Traveling with children' },
  { value: 'specific', label: 'Something specific', description: 'Gorillas, migration, walking safari' },
];

/**
 * Timing flexibility options for Step 2
 */
export const TIMING_FLEXIBILITY: { value: TimingFlexibility; label: string }[] = [
  { value: 'fixed', label: 'These dates are fixed' },
  { value: 'few-weeks', label: 'Flexible by a few weeks' },
  { value: 'month-plus', label: 'Flexible by a month or more' },
  { value: 'need-guidance', label: 'I need guidance on timing' },
];

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
 * Budget band options for Step 3 - redesigned with descriptions
 */
export const BUDGET_BAND_OPTIONS: { value: BudgetBand; label: string; description: string }[] = [
  { value: '3k-6k', label: '$3,000-6,000 per person', description: 'Quality safari, efficient routing, shared or mid-range camps' },
  { value: '6k-10k', label: '$6,000-10,000 per person', description: 'Private guiding, premium camps, more flexibility' },
  { value: '10k-15k', label: '$10,000-15,000 per person', description: 'Top-tier properties, exclusive access, complex logistics' },
  { value: '15k-plus', label: '$15,000+ per person', description: 'Ultra-premium, fly-in camps, bespoke throughout' },
  { value: 'not-sure', label: 'Not sure yet', description: 'I need help understanding what different levels deliver' },
];

/**
 * Legacy budget band display labels - for backwards compatibility
 */
export const BUDGET_BANDS: { value: BudgetBand; label: string }[] = [
  { value: 'under-5k', label: 'Under $5,000 per person' },
  { value: '5k-10k', label: '$5,000 – $10,000 per person' },
  { value: '10k-20k', label: '$10,000 – $20,000 per person' },
  { value: '20k-35k', label: '$20,000 – $35,000 per person' },
  { value: 'above-35k', label: 'Above $35,000 per person' },
  { value: 'flexible', label: 'Flexible / Not yet determined' },
  // New values
  { value: '3k-6k', label: '$3,000-6,000 per person' },
  { value: '6k-10k', label: '$6,000-10,000 per person' },
  { value: '10k-15k', label: '$10,000-15,000 per person' },
  { value: '15k-plus', label: '$15,000+ per person' },
  { value: 'not-sure', label: 'Not sure yet' },
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
 * Priority options for Step 4
 */
export const PRIORITY_OPTIONS: { value: TravelerPriority; label: string }[] = [
  { value: 'wildlife-density', label: 'Wildlife density' },
  { value: 'exclusivity', label: 'Exclusivity and privacy' },
  { value: 'photography', label: 'Photography opportunities' },
  { value: 'walking-active', label: 'Walking or active safaris' },
  { value: 'cultural', label: 'Cultural experiences' },
  { value: 'relaxation', label: 'Relaxation and pace' },
  { value: 'specific-animals', label: 'Seeing specific animals' },
  { value: 'value', label: 'Value for money' },
  { value: 'beach-combo', label: 'Combining with beach' },
];

/**
 * Common countries for dropdown
 */
export const COUNTRY_OPTIONS = [
  { value: 'US', label: 'United States' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'SG', label: 'Singapore' },
  { value: 'HK', label: 'Hong Kong' },
  { value: 'NZ', label: 'New Zealand' },
  { value: 'IE', label: 'Ireland' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'BE', label: 'Belgium' },
  { value: 'AT', label: 'Austria' },
  { value: 'SE', label: 'Sweden' },
  { value: 'NO', label: 'Norway' },
  { value: 'DK', label: 'Denmark' },
  { value: 'IT', label: 'Italy' },
  { value: 'ES', label: 'Spain' },
  { value: 'OTHER', label: 'Other' },
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
  { value: 8, label: '8' },
  { value: 9, label: '9' },
  { value: 10, label: '10' },
  { value: 11, label: '11' },
  { value: 12, label: '12' },
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
 * Multi-step form state for the redesigned inquiry
 */
export interface PlanningBriefState {
  // Step 1: Safari Intent
  safariIntent: SafariIntent | null;

  // Step 2: Timing
  travelMonth: number | null;
  travelYear: number | null;
  flexibility: TimingFlexibility | null;

  // Step 3: Budget
  budgetBand: BudgetBand | null;

  // Step 4: Travelers & Priorities
  travelerCount: number;
  childrenCount: number;
  priorities: TravelerPriority[];
  specificRequests: string;

  // Step 5: Contact
  name: string;
  email: string;
  country: string;
  phone: string;
  additionalNotes: string;
}

/**
 * Legacy form state for backwards compatibility
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
 * Get default planning brief state
 */
export function getDefaultPlanningBriefState(): PlanningBriefState {
  const now = new Date();
  const defaultMonth = now.getMonth() + 7; // 6 months ahead
  const defaultYear = defaultMonth > 12 ? now.getFullYear() + 1 : now.getFullYear();
  const normalizedMonth = defaultMonth > 12 ? defaultMonth - 12 : defaultMonth;

  return {
    safariIntent: null,
    travelMonth: normalizedMonth,
    travelYear: defaultYear,
    flexibility: 'few-weeks',
    budgetBand: null,
    travelerCount: 2,
    childrenCount: 0,
    priorities: [],
    specificRequests: '',
    name: '',
    email: '',
    country: '',
    phone: '',
    additionalNotes: '',
  };
}

/**
 * Convert planning brief state to API payload
 */
export function planningBriefToPayload(state: PlanningBriefState) {
  // Infer travel style from safari intent and traveler composition
  let travelStyle: TravelStyle = 'couple';
  if (state.travelerCount === 1) {
    travelStyle = 'solo';
  } else if (state.childrenCount > 0) {
    travelStyle = 'family-young-kids';
  } else if (state.safariIntent === 'special-occasion') {
    travelStyle = 'honeymoon';
  } else if (state.travelerCount > 4) {
    travelStyle = 'friends-group';
  }

  return {
    trip_shape_id: null, // Multi-step form doesn't use trip shapes directly
    budget_band: state.budgetBand,
    travel_month: state.travelMonth,
    travel_year: state.travelYear,
    traveler_count: state.travelerCount,
    travel_style: travelStyle,
    email: state.email,
    whatsapp: state.phone || null,
    linked_decision_ids: [],
    notes: buildNotesFromBrief(state),
    source_path: typeof window !== 'undefined' ? window.location.pathname : '/inquire',
    // Extended fields for new form
    safari_intent: state.safariIntent,
    flexibility: state.flexibility,
    children_count: state.childrenCount,
    priorities: state.priorities,
    name: state.name,
    country: state.country,
  };
}

/**
 * Build notes string from planning brief state
 */
function buildNotesFromBrief(state: PlanningBriefState): string {
  const parts: string[] = [];

  if (state.safariIntent) {
    const intent = SAFARI_INTENTS.find(i => i.value === state.safariIntent);
    if (intent) {
      parts.push(`Safari type: ${intent.label}`);
    }
  }

  if (state.flexibility) {
    const flex = TIMING_FLEXIBILITY.find(f => f.value === state.flexibility);
    if (flex) {
      parts.push(`Flexibility: ${flex.label}`);
    }
  }

  if (state.childrenCount > 0) {
    parts.push(`Children under 12: ${state.childrenCount}`);
  }

  if (state.priorities.length > 0) {
    const priorityLabels = state.priorities
      .map(p => PRIORITY_OPTIONS.find(o => o.value === p)?.label)
      .filter(Boolean);
    parts.push(`Priorities: ${priorityLabels.join(', ')}`);
  }

  if (state.specificRequests) {
    parts.push(`Specific requests: ${state.specificRequests}`);
  }

  if (state.additionalNotes) {
    parts.push(`Additional notes: ${state.additionalNotes}`);
  }

  return parts.join('\n');
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
 * Get month options starting from 6 months ahead
 */
export function getMonthYearOptions(): { month: number; year: number; label: string }[] {
  const now = new Date();
  const options: { month: number; year: number; label: string }[] = [];

  for (let i = 6; i <= 24; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const monthName = MONTH_OPTIONS.find(m => m.value === month)?.label || '';
    options.push({
      month,
      year,
      label: `${monthName} ${year}`,
    });
  }

  return options;
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

/**
 * Format safari intent for display
 */
export function formatSafariIntent(intent: SafariIntent): string {
  const found = SAFARI_INTENTS.find(i => i.value === intent);
  return found?.label || intent;
}

/**
 * Format flexibility for display
 */
export function formatFlexibility(flexibility: TimingFlexibility): string {
  const found = TIMING_FLEXIBILITY.find(f => f.value === flexibility);
  return found?.label || flexibility;
}

/**
 * Format budget band for display
 */
export function formatBudgetBandLabel(band: BudgetBand): string {
  const found = BUDGET_BAND_OPTIONS.find(b => b.value === band);
  if (found) return found.label;
  const legacy = BUDGET_BANDS.find(b => b.value === band);
  return legacy?.label || band;
}

/**
 * Format priorities for display
 */
export function formatPriorities(priorities: TravelerPriority[]): string {
  return priorities
    .map(p => PRIORITY_OPTIONS.find(o => o.value === p)?.label)
    .filter(Boolean)
    .join(', ');
}
