/**
 * Baseline Decision Index
 *
 * Static imports of baseline decision JSON files for P0 topics.
 * These are pre-computed decisions used as fallbacks when the
 * live decision service is at capacity.
 *
 * Baseline decisions:
 * - Are clearly labeled as baselines (not personalized)
 * - Use default inputs (no user overrides)
 * - Provide continuity when live inference is unavailable
 */

// Initial 5 baselines
import tzDrySeason from './tz-dry-season.json';
import tzVsKe from './tz-vs-ke.json';
import totalBudget from './total-budget.json';
import ugandaVsRwanda from './uganda-vs-rwanda.json';
import selfDriveSafari from './self-drive-safari.json';

// Personal Fit
import firstTimerReady from './first-timer-ready.json';
import soloSafariFit from './solo-safari-fit.json';
import familyYoungKids from './family-young-kids.json';
import multigenerational from './multigenerational.json';
import honeymoonFit from './honeymoon-fit.json';
import wildlifeExpectation from './wildlife-expectation.json';

// Destination Choice
import tzVsBw from './tz-vs-bw.json';
import saVsEa from './sa-vs-ea.json';
import rwandaGorillasWorth from './rwanda-gorillas-worth.json';
import okavangoDeltaWorth from './okavango-worth.json';
import serengetiVsMara from './serengeti-vs-mara.json';
import krugerVsPrivate from './kruger-vs-private.json';
import singleCountryMulti from './single-country-multi.json';

// Timing
import migrationTiming from './migration-timing.json';
import riverCrossings from './river-crossings.json';
import calvingSeason from './calving-season.json';
import greenSeasonValue from './green-season-value.json';
import christmasSafari from './christmas-safari.json';
import tzFeb from './tz-feb.json';
import tzJul from './tz-jul.json';
import keAug from './ke-aug.json';
import bwJun from './bw-jun.json';
import bookingLeadTime from './booking-lead-time.json';

// Migration (expanded)
import migrationMonthPosition from './migration-month-position.json';
import migrationFirstTimer from './migration-first-timer.json';
import migrationCrowds from './migration-crowds.json';
import migrationCost from './migration-cost.json';
import crossingVsCalving from './crossing-vs-calving.json';
import migrationTripLength from './migration-trip-length.json';
import migrationSerengetiVsMara from './migration-serengeti-vs-mara.json';

// Experience Type
import walkingSafari from './walking-safari.json';
import privateVsShared from './private-vs-shared.json';

// Accommodation
import lodgeVsTented from './lodge-vs-tented.json';
import luxuryWorthIt from './luxury-worth-it.json';
import budgetAccommodationOk from './budget-accommodation-ok.json';
import insideVsOutsidePark from './inside-vs-outside-park.json';
import campHopping from './camp-hopping.json';

// Logistics
import tripLength from './trip-length.json';
import idealLength from './ideal-length.json';
import flyVsDrive from './fly-vs-drive.json';
import beachExtension from './beach-extension.json';
import agentVsDirect from './agent-vs-direct.json';

// Risk & Ethics
import malariaDecision from './malaria-decision.json';

// Value & Cost
import budgetTanzania from './budget-tanzania.json';
import peakVsValue from './peak-vs-value.json';
import cheapWarning from './cheap-warning.json';
import splurgeAllocation from './splurge-allocation.json';

// Birding
import birdingGreenVsDrySeason from './birding-green-vs-dry-season.json';
import birdingCombinedBigFive from './birding-combined-big-five.json';
import ugandaVsTanzaniaEndemicBirding from './uganda-vs-tanzania-endemic-birding.json';
import migratoryBirdPeakTiming from './migratory-bird-peak-timing.json';
import birdingPhotographyCompatibility from './birding-photography-compatibility.json';
import birdingShortItinerary from './birding-short-itinerary.json';

import type { Outcome, Assumption, Tradeoffs } from '../../../lib/contracts';

/**
 * Baseline decision shape - matches DecisionOutput from contracts
 */
export interface BaselineDecision {
  topic_id: string;
  outcome: Outcome;
  headline: string;
  summary: string;
  assumptions: Assumption[];
  tradeoffs: Tradeoffs;
  change_conditions: string[];
  confidence: number;
}

/**
 * Map of topic_id to baseline decision
 */
export const baselineDecisions: Record<string, BaselineDecision> = {
  // Initial 5
  'tz-dry-season': tzDrySeason as BaselineDecision,
  'tz-vs-ke': tzVsKe as BaselineDecision,
  'total-budget': totalBudget as BaselineDecision,
  'uganda-vs-rwanda': ugandaVsRwanda as BaselineDecision,
  'self-drive-safari': selfDriveSafari as BaselineDecision,

  // Personal Fit
  'first-timer-ready': firstTimerReady as BaselineDecision,
  'solo-safari-fit': soloSafariFit as BaselineDecision,
  'family-young-kids': familyYoungKids as BaselineDecision,
  'multigenerational': multigenerational as BaselineDecision,
  'honeymoon-fit': honeymoonFit as BaselineDecision,
  'wildlife-expectation': wildlifeExpectation as BaselineDecision,

  // Destination Choice
  'tz-vs-bw': tzVsBw as BaselineDecision,
  'sa-vs-ea': saVsEa as BaselineDecision,
  'rwanda-gorillas-worth': rwandaGorillasWorth as BaselineDecision,
  'okavango-worth': okavangoDeltaWorth as BaselineDecision,
  'serengeti-vs-mara': serengetiVsMara as BaselineDecision,
  'kruger-vs-private': krugerVsPrivate as BaselineDecision,
  'single-country-multi': singleCountryMulti as BaselineDecision,

  // Timing
  'migration-timing': migrationTiming as BaselineDecision,
  'river-crossings': riverCrossings as BaselineDecision,
  'calving-season': calvingSeason as BaselineDecision,
  'green-season-value': greenSeasonValue as BaselineDecision,
  'christmas-safari': christmasSafari as BaselineDecision,
  'tz-feb': tzFeb as BaselineDecision,
  'tz-jul': tzJul as BaselineDecision,
  'ke-aug': keAug as BaselineDecision,
  'bw-jun': bwJun as BaselineDecision,
  'booking-lead-time': bookingLeadTime as BaselineDecision,

  // Migration (expanded)
  'migration-month-position': migrationMonthPosition as BaselineDecision,
  'migration-first-timer': migrationFirstTimer as BaselineDecision,
  'migration-crowds': migrationCrowds as BaselineDecision,
  'migration-cost': migrationCost as BaselineDecision,
  'crossing-vs-calving': crossingVsCalving as BaselineDecision,
  'migration-trip-length': migrationTripLength as BaselineDecision,
  'migration-serengeti-vs-mara': migrationSerengetiVsMara as BaselineDecision,

  // Experience Type
  'walking-safari': walkingSafari as BaselineDecision,
  'private-vs-shared': privateVsShared as BaselineDecision,

  // Accommodation
  'lodge-vs-tented': lodgeVsTented as BaselineDecision,
  'luxury-worth-it': luxuryWorthIt as BaselineDecision,
  'budget-accommodation-ok': budgetAccommodationOk as BaselineDecision,
  'inside-vs-outside-park': insideVsOutsidePark as BaselineDecision,
  'camp-hopping': campHopping as BaselineDecision,

  // Logistics
  'trip-length': tripLength as BaselineDecision,
  'ideal-length': idealLength as BaselineDecision,
  'fly-vs-drive': flyVsDrive as BaselineDecision,
  'beach-extension': beachExtension as BaselineDecision,
  'agent-vs-direct': agentVsDirect as BaselineDecision,

  // Risk & Ethics
  'malaria-decision': malariaDecision as BaselineDecision,

  // Value & Cost
  'budget-tanzania': budgetTanzania as BaselineDecision,
  'peak-vs-value': peakVsValue as BaselineDecision,
  'cheap-warning': cheapWarning as BaselineDecision,
  'splurge-allocation': splurgeAllocation as BaselineDecision,

  // Birding
  'birding-green-vs-dry-season': birdingGreenVsDrySeason as BaselineDecision,
  'birding-combined-big-five': birdingCombinedBigFive as BaselineDecision,
  'uganda-vs-tanzania-endemic-birding': ugandaVsTanzaniaEndemicBirding as BaselineDecision,
  'migratory-bird-peak-timing': migratoryBirdPeakTiming as BaselineDecision,
  'birding-photography-compatibility': birdingPhotographyCompatibility as BaselineDecision,
  'birding-short-itinerary': birdingShortItinerary as BaselineDecision,
};

/**
 * List of topic IDs with baseline decisions available
 */
export const baselineTopicIds = Object.keys(baselineDecisions);
