'use client';

/**
 * Client-side actions for trip page
 * Includes save button, route map, and compare link (all require client-side interactivity)
 */

import Link from 'next/link';
import { ArrowRightLeft } from 'lucide-react';
import { SaveTripButton } from '../../components/engagement';
import { TravelMap } from '../../components/visual';

interface TripPageClientActionsProps {
  tripId: string;
  tripTitle: string;
  coreParks: string[];
  region: string;
}

export function TripPageClientActions({
  tripId,
  tripTitle,
  coreParks,
  region,
}: TripPageClientActionsProps) {
  // Convert parks to map segments
  const mapSegments = coreParks.map((park, index) => ({
    id: `${tripId}-${index}`,
    location: park,
    order: index + 1,
    nights: 2, // Default estimate
    travelMode: index > 0 ? ('road' as const) : undefined,
  }));

  return (
    <div className="space-y-6">
      {/* Action buttons - Save and Compare */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href={`/trips/compare?trips=${tripId}`}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-600 bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors"
        >
          <ArrowRightLeft className="w-4 h-4" />
          Compare with other trips
        </Link>
        <SaveTripButton
          tripId={tripId}
          tripTitle={tripTitle}
          variant="default"
        />
      </div>

      {/* Route map - only show if we have multiple locations */}
      {mapSegments.length >= 2 && (
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <h3 className="font-medium text-stone-900 mb-3">Route overview</h3>
          <TravelMap segments={mapSegments} region={region} />
        </div>
      )}
    </div>
  );
}
