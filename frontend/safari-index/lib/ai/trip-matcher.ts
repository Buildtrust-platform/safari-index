/**
 * Trip Matcher
 *
 * Intelligent matching of inquiries to trip archetypes.
 * Scores trips based on budget, timing, traveler fit, and interests.
 *
 * Per governance:
 * - Deterministic scoring (no AI calls)
 * - Clear reasoning for each match
 * - Shows both positive signals and concerns
 */

import { tripArchetypes, type TripArchetype, type TravelerFit } from '../../app/content/trip-shapes/trips';
import type { InquiryRecord, BudgetBand } from '../contracts';

/**
 * Match result with scoring breakdown
 */
export interface TripMatch {
  trip_id: string;
  trip_title: string;
  match_score: number; // 0-100
  reasons: {
    positive: string[];
    concerns: string[];
  };
  score_breakdown: {
    budget: number;
    timing: number;
    traveler_fit: number;
    interest: number;
  };
}

/**
 * Budget band ranges in USD per person
 */
const BUDGET_RANGES: Record<BudgetBand, { min: number; max: number }> = {
  // Legacy values
  'under-5k': { min: 0, max: 5000 },
  '5k-10k': { min: 5000, max: 10000 },
  '10k-20k': { min: 10000, max: 20000 },
  '20k-35k': { min: 20000, max: 35000 },
  'above-35k': { min: 35000, max: 100000 },
  'flexible': { min: 0, max: 100000 },
  // New values
  '3k-6k': { min: 3000, max: 6000 },
  '6k-10k': { min: 6000, max: 10000 },
  '10k-15k': { min: 10000, max: 15000 },
  '15k-plus': { min: 15000, max: 50000 },
  'not-sure': { min: 0, max: 50000 },
};

/**
 * Map travel style to traveler fit tags
 */
const TRAVEL_STYLE_TO_FIT: Record<string, TravelerFit[]> = {
  solo: ['solo', 'adventure'],
  couple: ['honeymoon', 'photography'],
  'family-young-kids': ['family'],
  'family-teens': ['family', 'adventure'],
  multigenerational: ['multigenerational', 'family'],
  'friends-group': ['adventure', 'photography'],
  honeymoon: ['honeymoon'],
};

/**
 * Month names for display
 */
const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Score budget alignment (0-40 points)
 */
function scoreBudget(
  inquiry: InquiryRecord,
  trip: TripArchetype
): { score: number; reason: string | null; concern: string | null } {
  const budgetRange = BUDGET_RANGES[inquiry.budget_band];
  if (!budgetRange) {
    return { score: 20, reason: null, concern: null }; // Neutral if unknown
  }

  const tripLow = trip.cost_band.low;
  const tripHigh = trip.cost_band.high;
  const inquiryMid = (budgetRange.min + budgetRange.max) / 2;

  // Perfect overlap
  if (budgetRange.min <= tripHigh && budgetRange.max >= tripLow) {
    // Calculate how well it fits
    const overlapLow = Math.max(budgetRange.min, tripLow);
    const overlapHigh = Math.min(budgetRange.max, tripHigh);
    const overlapRange = overlapHigh - overlapLow;
    const inquiryRange = budgetRange.max - budgetRange.min;
    const overlapPercent = inquiryRange > 0 ? overlapRange / inquiryRange : 1;

    if (overlapPercent > 0.7) {
      return {
        score: 40,
        reason: `Budget fits perfectly ($${(tripLow / 1000).toFixed(0)}k-$${(tripHigh / 1000).toFixed(0)}k range)`,
        concern: null,
      };
    }
    if (overlapPercent > 0.3) {
      return {
        score: 30,
        reason: `Budget aligns with trip range`,
        concern: null,
      };
    }
  }

  // Trip is more expensive than budget
  if (tripLow > budgetRange.max) {
    const overBudgetPercent = (tripLow - budgetRange.max) / budgetRange.max;
    if (overBudgetPercent < 0.3) {
      return {
        score: 15,
        reason: null,
        concern: `Slightly above budget ($${(tripLow / 1000).toFixed(0)}k-$${(tripHigh / 1000).toFixed(0)}k)`,
      };
    }
    return {
      score: 5,
      reason: null,
      concern: `Above budget range ($${(tripLow / 1000).toFixed(0)}k-$${(tripHigh / 1000).toFixed(0)}k vs ${inquiry.budget_band})`,
    };
  }

  // Trip is cheaper than budget (usually good)
  if (tripHigh < budgetRange.min) {
    return {
      score: 25,
      reason: `Good value within budget`,
      concern: null,
    };
  }

  return { score: 20, reason: null, concern: null };
}

/**
 * Score timing/seasonality (0-25 points)
 */
function scoreTiming(
  inquiry: InquiryRecord,
  trip: TripArchetype
): { score: number; reason: string | null; concern: string | null } {
  if (!inquiry.travel_month) {
    return { score: 15, reason: null, concern: null }; // Neutral if no month specified
  }

  const month = inquiry.travel_month;
  const monthName = MONTH_NAMES[month];

  if (trip.best_months.includes(month)) {
    // Check if it's migration season for relevant trips
    if (
      (trip.id.includes('migration') || trip.id.includes('serengeti')) &&
      [6, 7, 8, 9].includes(month)
    ) {
      return {
        score: 25,
        reason: `${monthName} is peak migration season`,
        concern: null,
      };
    }
    return {
      score: 25,
      reason: `${monthName} is an excellent time for this trip`,
      concern: null,
    };
  }

  // Check if it's shoulder season (one month off)
  const isShoulderSeason = trip.best_months.some(
    (m) => Math.abs(m - month) === 1 || (m === 12 && month === 1) || (m === 1 && month === 12)
  );
  if (isShoulderSeason) {
    return {
      score: 18,
      reason: null,
      concern: `${monthName} is shoulder season - still good, but not peak`,
    };
  }

  // Off season
  return {
    score: 8,
    reason: null,
    concern: `${monthName} is not the best time for this region`,
  };
}

/**
 * Score traveler fit (0-20 points)
 */
function scoreTravelerFit(
  inquiry: InquiryRecord,
  trip: TripArchetype
): { score: number; reason: string | null; concern: string | null } {
  const travelStyle = inquiry.travel_style;
  const expectedFits = TRAVEL_STYLE_TO_FIT[travelStyle] || [];

  // Check direct match
  const matchingFits = expectedFits.filter((fit) => trip.traveler_fit.includes(fit));

  if (matchingFits.length > 0) {
    const fitLabel = formatTravelerFit(matchingFits[0]);
    return {
      score: 20,
      reason: `Great for ${fitLabel}`,
      concern: null,
    };
  }

  // Check if first safari and trip is good for first-timers
  if (trip.traveler_fit.includes('first-safari')) {
    return {
      score: 15,
      reason: `Suitable for first-time safari travelers`,
      concern: null,
    };
  }

  // Check if family with kids/teens and trip mentions family
  if (
    (travelStyle === 'family-young-kids' || travelStyle === 'family-teens') &&
    !trip.traveler_fit.includes('family')
  ) {
    return {
      score: 5,
      reason: null,
      concern: `May not be ideal for families`,
    };
  }

  return { score: 12, reason: null, concern: null };
}

/**
 * Score interest alignment from linked decisions (0-15 points)
 */
function scoreInterest(
  inquiry: InquiryRecord,
  trip: TripArchetype
): { score: number; reason: string | null; concern: string | null } {
  const linkedDecisions = inquiry.linked_decision_ids || [];

  if (linkedDecisions.length === 0) {
    // Check if they selected a specific trip shape
    if (inquiry.trip_shape_id === trip.id) {
      return {
        score: 15,
        reason: `They specifically selected this trip`,
        concern: null,
      };
    }
    return { score: 8, reason: null, concern: null };
  }

  // Check how many of their researched decisions match this trip
  const tripDecisions = trip.linked_decisions;
  const matchingDecisions = linkedDecisions.filter((d) => tripDecisions.includes(d));

  if (matchingDecisions.length >= 2) {
    return {
      score: 15,
      reason: `Researched related topics (${matchingDecisions.length} matches)`,
      concern: null,
    };
  }
  if (matchingDecisions.length === 1) {
    return {
      score: 12,
      reason: `Showed interest in related topic`,
      concern: null,
    };
  }

  // Check if they viewed a region-specific decision
  const tripRegions = trip.regions;
  const viewedRegionDecision = linkedDecisions.some((d) => {
    const dLower = d.toLowerCase();
    return tripRegions.some((r) => dLower.includes(r.replace('-', '')));
  });

  if (viewedRegionDecision) {
    return {
      score: 10,
      reason: `Researched this region`,
      concern: null,
    };
  }

  return { score: 5, reason: null, concern: null };
}

/**
 * Format traveler fit for display
 */
function formatTravelerFit(fit: TravelerFit): string {
  const labels: Record<TravelerFit, string> = {
    'first-safari': 'first-time travelers',
    family: 'families',
    honeymoon: 'honeymooners',
    photography: 'photography enthusiasts',
    adventure: 'adventure seekers',
    solo: 'solo travelers',
    multigenerational: 'multigenerational groups',
    'repeat-visitor': 'experienced travelers',
    'wildlife-focused': 'wildlife enthusiasts',
    cultural: 'cultural experiences',
  };
  return labels[fit] || fit;
}

/**
 * Match an inquiry to all trip archetypes
 */
export function matchInquiryToTrips(inquiry: InquiryRecord): TripMatch[] {
  const matches: TripMatch[] = [];

  for (const trip of tripArchetypes) {
    const budgetResult = scoreBudget(inquiry, trip);
    const timingResult = scoreTiming(inquiry, trip);
    const travelerResult = scoreTravelerFit(inquiry, trip);
    const interestResult = scoreInterest(inquiry, trip);

    const totalScore =
      budgetResult.score + timingResult.score + travelerResult.score + interestResult.score;

    const positiveReasons: string[] = [];
    const concerns: string[] = [];

    // Collect all reasons
    if (budgetResult.reason) positiveReasons.push(budgetResult.reason);
    if (budgetResult.concern) concerns.push(budgetResult.concern);
    if (timingResult.reason) positiveReasons.push(timingResult.reason);
    if (timingResult.concern) concerns.push(timingResult.concern);
    if (travelerResult.reason) positiveReasons.push(travelerResult.reason);
    if (travelerResult.concern) concerns.push(travelerResult.concern);
    if (interestResult.reason) positiveReasons.push(interestResult.reason);
    if (interestResult.concern) concerns.push(interestResult.concern);

    matches.push({
      trip_id: trip.id,
      trip_title: trip.title,
      match_score: totalScore,
      reasons: {
        positive: positiveReasons,
        concerns,
      },
      score_breakdown: {
        budget: budgetResult.score,
        timing: timingResult.score,
        traveler_fit: travelerResult.score,
        interest: interestResult.score,
      },
    });
  }

  // Sort by score descending
  matches.sort((a, b) => b.match_score - a.match_score);

  return matches;
}

/**
 * Get top N trip matches for an inquiry
 */
export function getTopTripMatches(inquiry: InquiryRecord, limit: number = 3): TripMatch[] {
  const allMatches = matchInquiryToTrips(inquiry);
  return allMatches.slice(0, limit);
}

/**
 * Get trip archetype details by ID
 */
export function getTripArchetype(tripId: string): TripArchetype | undefined {
  return tripArchetypes.find((t) => t.id === tripId);
}
