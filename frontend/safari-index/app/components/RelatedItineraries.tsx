/**
 * Related Itineraries Component
 *
 * Displays related itineraries on trip pages, decision pages, and guide pages.
 * Uses deterministic linking from lib/itinerary-links.ts.
 *
 * Per governance:
 * - Documentary tone, no hype
 * - prefetch={false} for cross-links
 * - Max 3 itineraries displayed
 */

import Link from 'next/link';
import { ArrowRight, Clock, DollarSign, MapPin } from 'lucide-react';
import { type Itinerary } from '../content/itineraries';
import { formatCostBand, getRegionDisplayName } from '../content/trip-shapes/trips';
import { formatDurationBand } from '../content/itineraries';

interface RelatedItinerariesProps {
  /** List of itineraries to display */
  itineraries: Itinerary[];
  /** Title for the section */
  title?: string;
  /** Subtitle/description for context */
  subtitle?: string;
  /** Context for styling (affects background) */
  context?: 'trip' | 'decision' | 'guide';
  /** Maximum number to show */
  limit?: number;
}

/**
 * Individual itinerary card for related list
 */
function ItineraryCard({ itinerary }: { itinerary: Itinerary }) {
  const regionName = getRegionDisplayName(itinerary.region);

  return (
    <Link
      href={`/itineraries/${itinerary.slug}`}
      prefetch={false}
      className="group block p-4 bg-white rounded-xl border border-stone-200 hover:border-amber-300 hover:shadow-md transition-all"
      data-testid="related-itinerary-card"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-1">
            {itinerary.title}
          </h4>
          <p className="text-sm text-stone-500 line-clamp-2 mt-1">
            {itinerary.subtitle}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {regionName}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDurationBand(itinerary.duration_band)}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              {formatCostBand(itinerary.cost_band)}
            </span>
          </div>
        </div>

        <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-600 flex-shrink-0 transition-colors" />
      </div>
    </Link>
  );
}

/**
 * Compact card variant for tighter spaces
 */
function CompactItineraryCard({ itinerary }: { itinerary: Itinerary }) {
  return (
    <Link
      href={`/itineraries/${itinerary.slug}`}
      prefetch={false}
      className="group flex items-center justify-between p-3 bg-stone-50 rounded-lg hover:bg-amber-50 transition-colors"
      data-testid="related-itinerary-compact"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-800 group-hover:text-amber-700 line-clamp-1">
          {itinerary.title}
        </p>
        <p className="text-xs text-stone-500">
          {formatDurationBand(itinerary.duration_band)} · {formatCostBand(itinerary.cost_band)}
        </p>
      </div>
      <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-600 flex-shrink-0 ml-2" />
    </Link>
  );
}

/**
 * Related Itineraries section component
 */
export function RelatedItineraries({
  itineraries,
  title = 'Related Itineraries',
  subtitle,
  context = 'trip',
  limit = 3,
}: RelatedItinerariesProps) {
  const displayItineraries = itineraries.slice(0, limit);

  if (displayItineraries.length === 0) {
    return null;
  }

  // Background varies by context
  const bgClass = context === 'decision'
    ? 'bg-stone-50 border border-stone-200'
    : 'bg-white border border-stone-200';

  return (
    <section
      className={`rounded-xl p-5 ${bgClass}`}
      data-testid="related-itineraries-section"
    >
      <div className="mb-4">
        <h3 className="font-editorial text-lg font-semibold text-stone-900">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-stone-500 mt-1">{subtitle}</p>
        )}
      </div>

      <div className="space-y-3">
        {displayItineraries.map((itinerary) => (
          <ItineraryCard key={itinerary.id} itinerary={itinerary} />
        ))}
      </div>

      {/* View all link */}
      <div className="mt-4 pt-3 border-t border-stone-100">
        <Link
          href="/itineraries"
          prefetch={false}
          className="inline-flex items-center gap-1 text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors"
        >
          View all itineraries
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

/**
 * Compact variant for sidebars or tighter spaces
 */
export function RelatedItinerariesCompact({
  itineraries,
  title = 'Itineraries where this matters',
  limit = 3,
}: Omit<RelatedItinerariesProps, 'subtitle' | 'context'>) {
  const displayItineraries = itineraries.slice(0, limit);

  if (displayItineraries.length === 0) {
    return null;
  }

  return (
    <div data-testid="related-itineraries-compact">
      <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">
        {title}
      </p>
      <div className="space-y-2">
        {displayItineraries.map((itinerary) => (
          <CompactItineraryCard key={itinerary.id} itinerary={itinerary} />
        ))}
      </div>
    </div>
  );
}

export default RelatedItineraries;
