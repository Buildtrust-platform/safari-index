/**
 * CostSignalSection Component
 *
 * Enhanced cost display with logic disclaimers explaining what
 * affects safari pricing. Shows bands, not prices. Includes
 * honest context about cost drivers.
 *
 * Per governance: documentary tone, no pricing manipulation,
 * transparent about what creates cost differences.
 */

import { DollarSign, TrendingUp, TrendingDown, Info } from 'lucide-react';
import type { TripArchetype, ComfortTier } from '../../content/trip-shapes/trips';
import { formatCostBand } from '../../content/trip-shapes/trips';

interface CostSignalSectionProps {
  trip: TripArchetype;
}

/**
 * Get cost factors that apply to this trip
 */
function getCostFactors(trip: TripArchetype): { increases: string[]; decreases: string[] } {
  const increases: string[] = [];
  const decreases: string[] = [];

  // Season factors
  if (trip.best_months.includes(7) || trip.best_months.includes(8)) {
    increases.push('Peak season (Jul-Oct) adds 20-40% to accommodation rates');
  }

  // Transfer factors
  if (trip.regions.includes('botswana') || trip.id.includes('southern-circuit')) {
    increases.push('Charter flights between camps (often $300-600 per segment)');
  }

  // Comfort tier factors
  if (trip.comfort_tier === 'luxury') {
    increases.push('Exclusive-use or small-camp positioning');
  }

  // Gorilla permits
  if (trip.id.includes('gorilla') || trip.id.includes('primate')) {
    increases.push('Gorilla permits ($800-1,500 per trek, non-negotiable)');
  }

  // Park fees
  if (trip.regions.includes('tanzania')) {
    increases.push('Tanzania park fees are among the highest in Africa');
  }

  // Private guiding
  if (trip.traveler_fit.includes('photography')) {
    increases.push('Private vehicle and guide for flexibility');
  }

  // Group size decreases
  decreases.push('Larger groups (4-6 people) reduce per-person costs significantly');

  // Season decreases
  if (trip.best_months.length > 6) {
    decreases.push('Shoulder season (Apr-May, Nov) offers 15-30% savings');
  } else {
    decreases.push('Green season rates (if available) can reduce costs 20-40%');
  }

  // Self-drive
  if (trip.id.includes('self-drive')) {
    decreases.push('Self-catering and camping cut accommodation costs dramatically');
  }

  // Mid-range alternatives
  if (trip.comfort_tier === 'luxury') {
    decreases.push('Stepping down to quality mid-range camps');
  }

  return {
    increases: increases.slice(0, 3),
    decreases: decreases.slice(0, 3),
  };
}

/**
 * CostSignalSection Component
 */
export function CostSignalSection({ trip }: CostSignalSectionProps) {
  const factors = getCostFactors(trip);

  return (
    <section className="mb-8" data-testid="section-cost">
      <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-3">
        Typical cost range
      </h2>
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {/* Main cost display */}
        <div className="p-6 border-b border-stone-100">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <span className="text-2xl font-semibold text-stone-900">
                {formatCostBand(trip.cost_band)}
              </span>
              <p className="text-sm text-stone-500">Per person, land costs</p>
            </div>
          </div>
          <p className="text-stone-600 text-sm">{trip.cost_band.note}</p>
        </div>

        {/* Cost factors */}
        <div className="p-6 bg-stone-50">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-4 h-4 text-stone-500" />
            <span className="text-sm font-medium text-stone-700">What affects this range</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Increases */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-red-500" />
                <span className="text-xs font-medium text-stone-600 uppercase tracking-wide">
                  Pushes cost up
                </span>
              </div>
              <ul className="space-y-1.5">
                {factors.increases.map((factor, index) => (
                  <li key={index} className="text-sm text-stone-600 flex items-start gap-2">
                    <span className="text-red-400 mt-1">+</span>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>

            {/* Decreases */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-green-500" />
                <span className="text-xs font-medium text-stone-600 uppercase tracking-wide">
                  Reduces cost
                </span>
              </div>
              <ul className="space-y-1.5">
                {factors.decreases.map((factor, index) => (
                  <li key={index} className="text-sm text-stone-600 flex items-start gap-2">
                    <span className="text-green-500 mt-1">−</span>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-white">
          <p className="text-xs text-stone-500">
            These are cost bands, not quotes. Safari Index provides custom pricing
            based on your specific dates, group size, and accommodation preferences.
            Ranges reflect 2024-2025 operator rates and are updated periodically.
          </p>
        </div>
      </div>
    </section>
  );
}
