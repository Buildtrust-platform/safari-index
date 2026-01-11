/**
 * Wildlife Sighting Probability Component
 *
 * Displays estimated sighting probabilities for key species in a park.
 * Based on aggregated operator feedback data.
 *
 * Per governance:
 * - Conservative estimates displayed
 * - Clear that these are probabilities, not guarantees
 * - No hype or promotional language
 */

'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import {
  getParkSightings,
  getRegionSightings,
  getProbabilityLabel,
  getProbabilityColor,
  getProbabilityTextColor,
  SPECIES_NAMES,
  BIG_FIVE,
  type ParkSightings,
  type SpeciesSighting,
} from '../content/wildlife-sightings';

interface WildlifeSightingsProps {
  parkId?: string;
  region?: string;
  showTitle?: boolean;
  compact?: boolean;
}

function ProbabilityBar({ probability }: { probability: number }) {
  return (
    <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${getProbabilityColor(probability)}`}
        style={{ width: `${probability}%` }}
      />
    </div>
  );
}

function SpeciesRow({ sighting, compact }: { sighting: SpeciesSighting; compact?: boolean }) {
  const speciesName = SPECIES_NAMES[sighting.species] || sighting.species;
  const isBigFive = BIG_FIVE.includes(sighting.species as any);

  return (
    <div className={`${compact ? 'py-2' : 'py-3'} ${!compact && 'border-b border-stone-100 last:border-0'}`}>
      <div className="flex items-center justify-between gap-4 mb-1.5">
        <div className="flex items-center gap-2">
          <span className={`text-sm ${isBigFive ? 'font-medium text-stone-900' : 'text-stone-700'}`}>
            {speciesName}
          </span>
          {isBigFive && (
            <span className="px-1.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded">
              Big 5
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${getProbabilityTextColor(sighting.probability)}`}>
            {sighting.probability}%
          </span>
          <span className="text-xs text-stone-500">
            {getProbabilityLabel(sighting.probability)}
          </span>
        </div>
      </div>
      <ProbabilityBar probability={sighting.probability} />
      {sighting.notes && !compact && (
        <p className="text-xs text-stone-500 mt-1.5">{sighting.notes}</p>
      )}
    </div>
  );
}

function ParkSightingsCard({ park, defaultExpanded = false }: { park: ParkSightings; defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  // Sort sightings: Big Five first, then by probability
  const sortedSightings = [...park.sightings].sort((a, b) => {
    const aIsBig5 = BIG_FIVE.includes(a.species as any);
    const bIsBig5 = BIG_FIVE.includes(b.species as any);
    if (aIsBig5 && !bIsBig5) return -1;
    if (!aIsBig5 && bIsBig5) return 1;
    return b.probability - a.probability;
  });

  const previewSightings = sortedSightings.slice(0, 5);
  const remainingSightings = sortedSightings.slice(5);

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="p-4 border-b border-stone-100">
        <h4 className="font-semibold text-stone-900">{park.parkName}</h4>
        <p className="text-xs text-stone-500 mt-1">
          Data source: {park.dataSource} · Updated {park.lastUpdated}
        </p>
      </div>

      <div className="px-4">
        {previewSightings.map((sighting) => (
          <SpeciesRow key={sighting.species} sighting={sighting} />
        ))}

        {remainingSightings.length > 0 && (
          <>
            {expanded && remainingSightings.map((sighting) => (
              <SpeciesRow key={sighting.species} sighting={sighting} />
            ))}
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full py-3 flex items-center justify-center gap-1 text-sm text-stone-500 hover:text-stone-700 transition-colors"
            >
              {expanded ? (
                <>
                  Show less <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Show {remainingSightings.length} more species <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function WildlifeSightings({ parkId, region, showTitle = true, compact = false }: WildlifeSightingsProps) {
  // Get data based on parkId or region
  let parks: ParkSightings[] = [];

  if (parkId) {
    const park = getParkSightings(parkId);
    if (park) parks = [park];
  } else if (region) {
    parks = getRegionSightings(region);
  }

  if (parks.length === 0) {
    return null;
  }

  return (
    <div>
      {showTitle && (
        <div className="flex items-start gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">🦁</span>
          </div>
          <div>
            <h3 className="font-editorial text-xl font-semibold text-stone-900">
              Wildlife Sighting Probabilities
            </h3>
            <p className="text-sm text-stone-600 mt-1">
              Estimated chances of seeing key species based on operator feedback
            </p>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
        <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-800">
          These are estimated probabilities based on typical multi-day visits. Actual sightings depend on season,
          weather, time spent in the park, and luck. Wildlife behavior is unpredictable.
        </p>
      </div>

      {/* Park cards */}
      <div className={parks.length === 1 ? '' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}>
        {parks.map((park, index) => (
          <ParkSightingsCard
            key={park.parkId}
            park={park}
            defaultExpanded={parks.length === 1 || index === 0}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Compact inline sighting display for cards/previews
 */
export function SightingPreview({ parkId }: { parkId: string }) {
  const park = getParkSightings(parkId);
  if (!park) return null;

  // Get top 3 Big Five species by probability
  const bigFiveSightings = park.sightings
    .filter((s) => BIG_FIVE.includes(s.species as any))
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 3);

  if (bigFiveSightings.length === 0) return null;

  return (
    <div className="flex items-center gap-3 text-xs text-stone-600">
      {bigFiveSightings.map((s) => (
        <span key={s.species} className="flex items-center gap-1">
          <span className={`font-medium ${getProbabilityTextColor(s.probability)}`}>
            {s.probability}%
          </span>
          <span>{SPECIES_NAMES[s.species]?.split(' ')[0] || s.species}</span>
        </span>
      ))}
    </div>
  );
}

export default WildlifeSightings;
