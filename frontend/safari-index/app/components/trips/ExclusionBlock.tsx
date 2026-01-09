/**
 * ExclusionBlock Component
 *
 * "Not for you if..." section for trip pages.
 * Derives exclusions from trip characteristics to help visitors
 * self-select out before wasting their time or ours.
 *
 * Per governance: documentary tone, no hype, filters low-intent leads.
 */

import { XCircle } from 'lucide-react';
import type { TripArchetype, ComfortTier, TravelerFit } from '../../content/trip-shapes/trips';

interface ExclusionBlockProps {
  trip: TripArchetype;
}

/**
 * Generate exclusion statements based on trip characteristics
 */
function getExclusions(trip: TripArchetype): string[] {
  const exclusions: string[] = [];

  // Budget-based exclusions
  if (trip.cost_band.low >= 10000) {
    exclusions.push('Your total budget is under $10,000 per person');
  } else if (trip.cost_band.low >= 6000) {
    exclusions.push('Your total budget is under $6,000 per person');
  }

  // Comfort tier exclusions
  if (trip.comfort_tier === 'luxury') {
    exclusions.push('You prioritize value over comfort and exclusivity');
  }
  if (trip.comfort_tier === 'budget') {
    exclusions.push('You expect luxury amenities or private vehicles');
  }

  // Duration exclusions
  const minDays = Array.isArray(trip.duration_days) ? trip.duration_days[0] : trip.duration_days;
  if (minDays >= 10) {
    exclusions.push('You only have a week or less for safari');
  }

  // Physical demands
  if (trip.traveler_fit.includes('adventure')) {
    exclusions.push('You prefer minimal physical activity on holiday');
  }

  // Walking safari specific
  if (trip.id.includes('walking')) {
    exclusions.push('Walking long distances is difficult for you');
  }

  // Self-drive specific
  if (trip.id.includes('self-drive')) {
    exclusions.push('You are uncomfortable driving on unfenced gravel roads');
    exclusions.push('You prefer having a guide handle logistics');
  }

  // Gorilla trek specific
  if (trip.id.includes('gorilla') || trip.id.includes('primate')) {
    exclusions.push('You are unwilling to pay $800-1,500 for a one-hour wildlife encounter');
    exclusions.push('Hiking steep terrain at altitude is not possible for you');
  }

  // Photography specific
  if (trip.traveler_fit.includes('photography') && !trip.traveler_fit.includes('first-safari')) {
    exclusions.push('You prefer to experience wildlife without a camera');
  }

  // Migration specific
  if (trip.id.includes('migration')) {
    exclusions.push('You need guaranteed sightings on specific dates');
    exclusions.push('Flexibility in camp locations does not work for you');
  }

  // Remote/southern circuit
  if (trip.id.includes('southern-circuit') || trip.id.includes('remote')) {
    exclusions.push('You want the classic, well-trodden safari route');
    exclusions.push('Unpredictable wildlife sightings frustrate you');
  }

  // Family specific exclusions
  if (trip.traveler_fit.includes('multigenerational')) {
    exclusions.push('Your group has conflicting interests that cannot compromise');
  }

  // First-timer exclusions (for advanced trips)
  if (trip.traveler_fit.includes('repeat-visitor') && !trip.traveler_fit.includes('first-safari')) {
    exclusions.push('This is your first safari and you want the classic experience');
  }

  // Honeymoon specific
  if (trip.traveler_fit.includes('honeymoon')) {
    exclusions.push('You want an action-packed itinerary with multiple activities daily');
  }

  // Region-specific
  if (trip.regions.includes('namibia')) {
    exclusions.push('You want dense, concentrated Big Five viewing');
  }

  if (trip.regions.includes('botswana') && trip.cost_band.low >= 10000) {
    exclusions.push('You are looking for a budget-friendly safari option');
  }

  // Seasonal constraints
  if (trip.best_months.length <= 4) {
    exclusions.push('Your travel dates are outside the recommended season');
  }

  // Limit to 4-5 most relevant exclusions
  return exclusions.slice(0, 5);
}

/**
 * ExclusionBlock Component
 *
 * Displays "Not for you if..." statements to help visitors self-select.
 */
export function ExclusionBlock({ trip }: ExclusionBlockProps) {
  const exclusions = getExclusions(trip);

  if (exclusions.length === 0) {
    return null;
  }

  return (
    <section className="mb-8" data-testid="section-exclusions">
      <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-3">
        Not for you if
      </h2>
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <ul className="space-y-3">
          {exclusions.map((exclusion, index) => (
            <li key={index} className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-stone-700">{exclusion}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 pt-4 border-t border-stone-100 text-sm text-stone-500">
          These are filters, not judgments. The right trip exists for every traveler.{' '}
          <a href="/trips" className="text-amber-600 hover:text-amber-700 underline underline-offset-2">
            Browse other options
          </a>
        </p>
      </div>
    </section>
  );
}
