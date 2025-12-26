/**
 * Trip Planning CTA
 *
 * Operator-framed call-to-action linking from decisions to safari planning.
 * Positions Safari Index as the operator who will plan and execute the trip.
 *
 * Per governance:
 * - No hype or urgency
 * - Documentary tone
 * - Operator identity clear
 *
 * Supports prefill:
 * - Links to /inquire with selected_decision_ids query param
 */

import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';

interface TripPlanningCTAProps {
  /** The decision topic ID for prefill linking */
  topicId?: string;
  /** The decision slug for URL construction (reserved for future use) */
  topicSlug?: string;
}

/**
 * Build inquiry URL with prefill params
 */
function buildInquireUrl(topicId?: string): string {
  if (!topicId) return '/inquire';
  return `/inquire?selected_decision_ids=${encodeURIComponent(topicId)}`;
}

export function TripPlanningCTA({ topicId }: TripPlanningCTAProps) {
  const inquireUrl = buildInquireUrl(topicId);

  return (
    <section className="my-8" data-testid="trip-planning-cta">
      <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Compass className="w-5 h-5 text-amber-700" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-stone-900 mb-1">
              Plan this safari with Safari Index
            </h3>
            <p className="text-sm text-stone-600 mb-4">
              We operate private safaris across East and Southern Africa.
              Start with a brief and we'll build a custom itinerary around the decisions that matter.
            </p>
            <Link
              href={inquireUrl}
              className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors"
              data-testid="trip-planning-link"
              prefetch={false}
            >
              Start planning
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TripPlanningCTA;
