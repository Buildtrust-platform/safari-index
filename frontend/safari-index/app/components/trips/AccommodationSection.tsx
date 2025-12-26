/**
 * Accommodation Section Component
 *
 * Shows accommodation archetypes available for a trip/destination.
 * Used on trip pages to explain what kind of stays travelers can expect.
 *
 * Per governance:
 * - No lodge names or specific properties
 * - Focus on archetype categories
 * - Documentary, honest tone
 */

import Link from 'next/link';
import {
  Home,
  ArrowRight,
} from 'lucide-react';
import {
  getProfileByDestination,
} from '../../content/activities/destination-profiles';
import {
  getArchetypeById,
  AccommodationArchetype,
  PriceRange,
} from '../../content/activities/accommodation-archetypes';

interface AccommodationSectionProps {
  /** Primary destination ID for this trip */
  primaryDestination: string;
  /** Comfort tier for filtering recommendations (matches TripArchetype.comfort_tier) */
  comfortTier?: 'budget' | 'mid' | 'luxury';
}

/**
 * Price range display
 */
function getPriceRangeDisplay(range: PriceRange): { label: string; color: string } {
  switch (range) {
    case 'budget':
      return { label: '$', color: 'text-green-600' };
    case 'mid-range':
      return { label: '$$', color: 'text-amber-600' };
    case 'premium':
      return { label: '$$$', color: 'text-orange-600' };
    case 'ultra-premium':
      return { label: '$$$$', color: 'text-red-600' };
  }
}

/**
 * Prevalence badge
 */
function PrevalenceBadge({ prevalence }: { prevalence: 'common' | 'available' | 'rare' }) {
  const colors = {
    common: 'bg-green-100 text-green-700',
    available: 'bg-amber-100 text-amber-700',
    rare: 'bg-stone-100 text-stone-600',
  };

  const labels = {
    common: 'Widely available',
    available: 'Available',
    rare: 'Limited options',
  };

  return (
    <span className={`px-2 py-0.5 text-xs rounded-full ${colors[prevalence]}`}>
      {labels[prevalence]}
    </span>
  );
}

/**
 * Accommodation card component
 */
function AccommodationCard({
  archetype,
  prevalence,
  notes,
}: {
  archetype: AccommodationArchetype;
  prevalence: 'common' | 'available' | 'rare';
  notes?: string;
}) {
  const priceDisplay = getPriceRangeDisplay(archetype.price_range);

  return (
    <div
      className="bg-white rounded-xl border border-stone-200 p-5 hover:border-stone-300 transition-colors"
      data-testid="accommodation-card"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center">
            <Home className="w-4 h-4 text-stone-600" />
          </div>
          <div>
            <h4 className="font-medium text-stone-900">{archetype.name}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-sm font-medium ${priceDisplay.color}`}>
                {priceDisplay.label}
              </span>
              <PrevalenceBadge prevalence={prevalence} />
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-stone-600 text-sm mb-3 line-clamp-2">{archetype.what_it_is}</p>

      {/* Best for */}
      <div className="mb-3">
        <span className="text-xs text-stone-500">Best for:</span>
        <p className="text-sm text-stone-700 mt-0.5">{archetype.who_it_is_for}</p>
      </div>

      {/* Notes if any */}
      {notes && (
        <p className="text-xs text-stone-500 italic mb-3">{notes}</p>
      )}

      {/* Trade-offs preview */}
      <div className="pt-3 border-t border-stone-100">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-green-600">+ {archetype.trade_offs.gains.split(',')[0]}</span>
        </div>
        <div className="flex items-center gap-2 text-xs mt-1">
          <span className="text-red-600">- {archetype.trade_offs.losses.split(',')[0]}</span>
        </div>
      </div>

      {/* Photo hint */}
      <div className="mt-3 pt-3 border-t border-stone-100">
        <p className="text-xs text-stone-400 italic">📷 {archetype.image_hint}</p>
      </div>
    </div>
  );
}

export function AccommodationSection({
  primaryDestination,
  comfortTier = 'mid',
}: AccommodationSectionProps) {
  const profile = getProfileByDestination(primaryDestination);

  if (!profile) {
    return null;
  }

  // Filter accommodations by comfort tier relevance
  const filteredAccommodations = profile.accommodations
    .map((acc) => ({
      ...acc,
      archetype: getArchetypeById(acc.archetypeId),
    }))
    .filter((acc): acc is typeof acc & { archetype: AccommodationArchetype } => {
      if (!acc.archetype) return false;

      // Filter based on comfort tier (budget | mid | luxury from TripArchetype)
      if (comfortTier === 'luxury') {
        return ['premium', 'ultra-premium'].includes(acc.archetype.price_range);
      }
      if (comfortTier === 'budget') {
        return ['budget', 'mid-range'].includes(acc.archetype.price_range);
      }
      // Mid tier - show mid-range to premium
      return ['mid-range', 'premium'].includes(acc.archetype.price_range);
    })
    .slice(0, 4); // Limit to 4 cards

  if (filteredAccommodations.length === 0) {
    return null;
  }

  return (
    <section className="mb-8" data-testid="section-accommodation">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-editorial text-xl font-semibold text-stone-900">
          Where you'll stay
        </h2>
        <Link
          href="/activities"
          className="text-sm text-amber-600 hover:text-amber-700 flex items-center gap-1"
        >
          All accommodation types
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <p className="text-stone-600 text-sm mb-4">
        Accommodation styles available in {profile.destinationName} for this trip type
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAccommodations.map((acc) => (
          <AccommodationCard
            key={acc.archetypeId}
            archetype={acc.archetype}
            prevalence={acc.prevalence}
            notes={acc.notes}
          />
        ))}
      </div>

      {/* Note about no lodge listings */}
      <div className="mt-4 p-4 bg-stone-100 rounded-lg">
        <p className="text-xs text-stone-600">
          <strong>Note:</strong> Safari Index doesn't list specific lodges or camps.
          We select properties based on your preferences, timing, and availability during trip planning.
        </p>
      </div>
    </section>
  );
}

export default AccommodationSection;
