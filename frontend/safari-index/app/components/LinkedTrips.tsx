/**
 * Linked Trips Component
 *
 * Shows trips where a specific decision matters.
 * Displayed on decision pages to provide application context.
 *
 * Per governance:
 * - Documentary tone
 * - Max 3 trips to avoid spam
 * - No promotional language
 */

import Link from 'next/link';
import { ArrowRight, Map } from 'lucide-react';
import { getTripsForDecision, type TripLink } from '../../lib/trip-links';

interface LinkedTripsProps {
  /** The topic ID to find linked trips for */
  topicId: string;
}

export function LinkedTrips({ topicId }: LinkedTripsProps) {
  const trips = getTripsForDecision(topicId);

  // Don't render if no linked trips
  if (trips.length === 0) {
    return null;
  }

  return (
    <section className="my-8" data-testid="linked-trips">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center">
          <Map className="w-4 h-4 text-stone-500" />
        </div>
        <h2 className="font-editorial text-lg font-semibold text-stone-900">
          Trips where this decision matters
        </h2>
      </div>

      <div className="space-y-3">
        {trips.map((trip) => (
          <Link
            key={trip.tripId}
            href={trip.href}
            className="flex items-center justify-between p-4 bg-white border border-stone-200 rounded-xl hover:border-amber-300 hover:shadow-sm transition-all group"
            data-testid="linked-trip"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-stone-900 group-hover:text-amber-700 transition-colors truncate">
                {trip.title}
              </p>
              <p className="text-sm text-stone-500 truncate">
                {trip.subtitle}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-colors flex-shrink-0 ml-3" />
          </Link>
        ))}
      </div>
    </section>
  );
}

export default LinkedTrips;
