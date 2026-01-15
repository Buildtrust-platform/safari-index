'use client';

/**
 * Client-side actions for trip page
 * Includes save button and route map (both require client-side interactivity)
 */

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
      {/* Save button */}
      <div className="flex justify-end">
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
