/**
 * Trip Planning CTA
 *
 * Quiet call-to-action linking from decisions to trip planning.
 * Appears after the verdict is shown, offering a path to capture intent.
 *
 * Per governance:
 * - No hype or urgency
 * - Documentary tone
 * - Links to inquiry system
 */

import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';

interface TripPlanningCTAProps {
  /** The decision topic ID for linking context */
  topicId: string;
  /** The decision slug for URL construction */
  topicSlug: string;
}

export function TripPlanningCTA({ topicId, topicSlug }: TripPlanningCTAProps) {
  return (
    <section className="my-8" data-testid="trip-planning-cta">
      <div className="p-6 bg-stone-50 border border-stone-200 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-stone-200 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-stone-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-stone-900 mb-1">
              Planning a trip where this decision matters
            </h3>
            <p className="text-sm text-stone-600 mb-4">
              Capture your trip intent and get a summary of decisions to confirm
              before booking.
            </p>
            <Link
              href="/inquire"
              className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors"
              data-testid="trip-planning-link"
            >
              Request a Trip Brief
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TripPlanningCTA;
