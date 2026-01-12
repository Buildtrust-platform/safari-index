/**
 * Context Builder
 *
 * Assembles all relevant knowledge for AI response generation.
 * Gathers inquiry details, trip matches, and relevant decision content.
 *
 * Per governance:
 * - No PII in AI context beyond necessary personalization
 * - Links to existing decision content for authoritative info
 * - Clear separation between traveler context and knowledge base
 */

import type { InquiryRecord, TravelStyle, BudgetBand } from '../contracts';
import type { TripMatch } from './trip-matcher';
import { getTripArchetype } from './trip-matcher';
import type { TripArchetype } from '../../app/content/trip-shapes/trips';

/**
 * Month names for display
 */
const MONTH_NAMES = [
  '',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Travel style labels for display
 */
const TRAVEL_STYLE_LABELS: Record<TravelStyle, string> = {
  solo: 'solo traveler',
  couple: 'couple',
  'family-young-kids': 'family with young children',
  'family-teens': 'family with teenagers',
  multigenerational: 'multigenerational group',
  'friends-group': 'group of friends',
  honeymoon: 'honeymooners',
};

/**
 * Budget band labels for display
 */
const BUDGET_LABELS: Record<BudgetBand, string> = {
  // Legacy values
  'under-5k': 'under $5,000 per person',
  '5k-10k': '$5,000-$10,000 per person',
  '10k-20k': '$10,000-$20,000 per person',
  '20k-35k': '$20,000-$35,000 per person',
  'above-35k': 'above $35,000 per person',
  'flexible': 'flexible budget',
  // New values
  '3k-6k': '$3,000-$6,000 per person',
  '6k-10k': '$6,000-$10,000 per person',
  '10k-15k': '$10,000-$15,000 per person',
  '15k-plus': '$15,000+ per person',
  'not-sure': 'flexible/undecided',
};

/**
 * Context assembled for AI response generation
 */
export interface ResponseContext {
  /** Formatted traveler profile */
  travelerProfile: string;
  /** Selected trip details (if any) */
  tripContext: string | null;
  /** Relevant decision topics they researched */
  researchSignals: string[];
  /** Seasonality context for their travel month */
  seasonalityContext: string | null;
  /** Their original notes/questions */
  travelerNotes: string | null;
  /** Response tone guidelines */
  toneGuidelines: string;
}

/**
 * Build traveler profile summary
 */
function buildTravelerProfile(inquiry: InquiryRecord): string {
  const parts: string[] = [];

  // Group composition
  const styleLabel = TRAVEL_STYLE_LABELS[inquiry.travel_style] || inquiry.travel_style;
  parts.push(`${inquiry.traveler_count} traveler${inquiry.traveler_count > 1 ? 's' : ''} (${styleLabel})`);

  // Budget
  const budgetLabel = BUDGET_LABELS[inquiry.budget_band] || inquiry.budget_band;
  parts.push(`Budget: ${budgetLabel}`);

  // Timeline
  if (inquiry.travel_month && inquiry.travel_year) {
    parts.push(`Planning to travel: ${MONTH_NAMES[inquiry.travel_month]} ${inquiry.travel_year}`);
  } else if (inquiry.travel_month) {
    parts.push(`Preferred month: ${MONTH_NAMES[inquiry.travel_month]}`);
  }

  // Contact preference
  if (inquiry.whatsapp) {
    parts.push(`Contact: Email and WhatsApp available`);
  } else {
    parts.push(`Contact: Email only`);
  }

  return parts.join('\n');
}

/**
 * Build trip context from selected match
 */
function buildTripContext(tripMatch: TripMatch): string {
  const trip = getTripArchetype(tripMatch.trip_id);
  if (!trip) return `Selected trip: ${tripMatch.trip_title}`;

  const parts: string[] = [];
  parts.push(`Trip: ${trip.title}`);
  parts.push(`Description: ${trip.subtitle}`);
  parts.push(`Duration: ${formatDuration(trip.duration_days)} days`);
  parts.push(`Regions: ${trip.regions.join(', ')}`);
  parts.push(`Main areas: ${trip.core_parks_or_areas.join(', ')}`);
  parts.push(`Price range: $${trip.cost_band.low.toLocaleString()}-$${trip.cost_band.high.toLocaleString()} per person (${trip.cost_band.note})`);
  parts.push(`Best months: ${trip.best_months.map((m) => MONTH_NAMES[m]).join(', ')}`);
  parts.push(`What this trip is for: ${trip.what_this_trip_is_for}`);

  // Match reasoning
  if (tripMatch.reasons.positive.length > 0) {
    parts.push(`\nWhy this trip fits:`);
    tripMatch.reasons.positive.forEach((r) => parts.push(`  - ${r}`));
  }

  if (tripMatch.reasons.concerns.length > 0) {
    parts.push(`\nConsiderations to mention:`);
    tripMatch.reasons.concerns.forEach((c) => parts.push(`  - ${c}`));
  }

  return parts.join('\n');
}

/**
 * Format duration (single value or range)
 */
function formatDuration(duration: number | [number, number]): string {
  if (Array.isArray(duration)) {
    return `${duration[0]}-${duration[1]}`;
  }
  return duration.toString();
}

/**
 * Build seasonality context for travel month
 */
function buildSeasonalityContext(month: number | null, tripMatch?: TripMatch): string | null {
  if (!month) return null;

  const monthName = MONTH_NAMES[month];
  const trip = tripMatch ? getTripArchetype(tripMatch.trip_id) : null;

  const parts: string[] = [];
  parts.push(`Travel month: ${monthName}`);

  // General East Africa seasonality
  if ([6, 7, 8, 9, 10].includes(month)) {
    parts.push('This is dry season in East Africa - excellent wildlife viewing as animals gather at water sources.');
    if ([7, 8, 9].includes(month)) {
      parts.push('Peak migration season in Serengeti/Mara - river crossings are possible.');
    }
  } else if ([11, 12, 3, 4, 5].includes(month)) {
    parts.push('This is wet season in much of East Africa - lush landscapes, fewer tourists, but some roads may be challenging.');
    if ([3, 4, 5].includes(month)) {
      parts.push('Long rains in East Africa - consider Southern Africa which has opposite seasons.');
    }
  } else if ([1, 2].includes(month)) {
    parts.push('Calving season in Serengeti - excellent for predator action and baby animals.');
  }

  // Trip-specific seasonality
  if (trip && trip.best_months.includes(month)) {
    parts.push(`${monthName} is one of the best months for this trip.`);
  } else if (trip) {
    const bestMonthNames = trip.best_months.slice(0, 3).map((m) => MONTH_NAMES[m]).join(', ');
    parts.push(`Note: Best months for this trip are typically ${bestMonthNames}.`);
  }

  return parts.join(' ');
}

/**
 * Format research signals from linked decisions
 */
function formatResearchSignals(linkedDecisions: string[]): string[] {
  if (!linkedDecisions || linkedDecisions.length === 0) return [];

  // Map decision IDs to human-readable topics
  const decisionLabels: Record<string, string> = {
    'first-timer-ready': 'First-time safari preparation',
    'tz-dry-season': 'Tanzania dry season timing',
    'serengeti-vs-mara': 'Serengeti vs Masai Mara comparison',
    'ngorongoro-worth': 'Ngorongoro Crater considerations',
    'lodge-vs-tented': 'Accommodation style preferences',
    'ideal-length': 'Safari duration planning',
    'migration-timing': 'Migration timing and positioning',
    'river-crossings': 'River crossing viewing',
    'calving-season': 'Calving season in Serengeti',
    'booking-lead-time': 'Booking timeline',
    'luxury-worth': 'Value of luxury accommodation',
    'walking-safari': 'Walking safari experiences',
    'off-beaten-path': 'Remote and off-grid options',
    'fly-vs-drive': 'Internal flights vs driving',
    'ke-aug': 'Kenya in August',
    'tz-vs-ke': 'Tanzania vs Kenya comparison',
    'gorilla-trekking': 'Gorilla trekking',
    'okavango-timing': 'Okavango Delta timing',
    'sa-first-timer': 'South Africa for first-timers',
    'self-drive': 'Self-drive safari options',
  };

  return linkedDecisions.map((id) => decisionLabels[id] || id);
}

/**
 * Build the full response context for AI generation
 */
export function buildResponseContext(
  inquiry: InquiryRecord,
  selectedTrip?: TripMatch
): ResponseContext {
  const travelerProfile = buildTravelerProfile(inquiry);

  const tripContext = selectedTrip ? buildTripContext(selectedTrip) : null;

  const researchSignals = formatResearchSignals(inquiry.linked_decision_ids || []);

  const seasonalityContext = buildSeasonalityContext(inquiry.travel_month, selectedTrip);

  const toneGuidelines = `
RESPONSE GUIDELINES:
- Warm, expert tone - helpful consultant, not salesperson
- Reference their specific situation (group type, timeline, interests)
- If they researched specific topics, acknowledge that knowledge
- Keep response under 200 words
- Include one clear next step (call scheduling, question to clarify, etc.)
- Do not use emojis or exclamation marks
- Do not make guarantees about wildlife sightings
- If concerns exist (budget, timing), address them honestly but constructively
`.trim();

  return {
    travelerProfile,
    tripContext,
    researchSignals,
    seasonalityContext,
    travelerNotes: inquiry.notes,
    toneGuidelines,
  };
}

/**
 * Build the system prompt for AI response generation
 */
export function buildSystemPrompt(context: ResponseContext): string {
  const parts: string[] = [];

  parts.push('You are a safari consultant for Vurara Safaris responding to an inquiry.');
  parts.push('Your role is to provide personalized, expert guidance based on the traveler details below.');
  parts.push('');

  parts.push('TRAVELER PROFILE:');
  parts.push(context.travelerProfile);
  parts.push('');

  if (context.tripContext) {
    parts.push('RECOMMENDED TRIP:');
    parts.push(context.tripContext);
    parts.push('');
  }

  if (context.researchSignals.length > 0) {
    parts.push('TOPICS THEY RESEARCHED:');
    context.researchSignals.forEach((signal) => parts.push(`- ${signal}`));
    parts.push('');
  }

  if (context.seasonalityContext) {
    parts.push('SEASONALITY CONTEXT:');
    parts.push(context.seasonalityContext);
    parts.push('');
  }

  if (context.travelerNotes) {
    parts.push('THEIR NOTES/QUESTIONS:');
    parts.push(context.travelerNotes);
    parts.push('');
  }

  parts.push(context.toneGuidelines);

  return parts.join('\n');
}

/**
 * Extract first name from email for personalization
 */
export function extractFirstName(email: string): string {
  const localPart = email.split('@')[0];

  // Try to extract name from common email formats
  // john.doe@example.com -> John
  // johndoe@example.com -> Johndoe (capitalized)
  // j.doe@example.com -> there (fallback)

  const parts = localPart.split(/[._-]/);
  const firstName = parts[0];

  // If it looks like just an initial, use fallback
  if (firstName.length <= 2) {
    return 'there';
  }

  // Capitalize first letter
  return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
}
