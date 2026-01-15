/**
 * Day-by-Day Visualization Component
 *
 * Shows a visual timeline of an itinerary with:
 * - Segment breakdown with nights at each location
 * - Time allocation visualization (wildlife, transit, rest)
 * - Activity highlights per segment
 *
 * Per governance: documentary, calm, safari-native tone.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  Camera,
  Car,
  Plane,
  Moon,
  ChevronDown,
  ChevronUp,
  Sunrise,
  Sun,
  Coffee,
  Sunset,
} from 'lucide-react';
import { cn } from '../../ui/utils';
import type { ItinerarySegment } from '../../content/itineraries/types';

interface DayByDayVisualizationProps {
  segments: ItinerarySegment[];
  tripTitle: string;
  totalDays: number;
  travelMode?: 'drive' | 'fly' | 'mixed';
}

/**
 * Calculate time breakdown percentages for a segment
 */
function calculateTimeBreakdown(segment: ItinerarySegment) {
  const nights = Array.isArray(segment.nights) ? segment.nights[0] : segment.nights;
  const totalHours = nights * 24;

  // Estimate hours per activity type based on typical safari schedule
  const sleepHours = nights * 8;
  const restHours = nights * 3; // Midday siesta
  const mealHours = nights * 3;
  const transferHours = 3; // Arrival/departure
  const wildlifeHours = totalHours - sleepHours - restHours - mealHours - transferHours;

  return {
    wildlife: Math.round((wildlifeHours / totalHours) * 100),
    transit: Math.round((transferHours / totalHours) * 100),
    rest: Math.round(((sleepHours + restHours) / totalHours) * 100),
    meals: Math.round((mealHours / totalHours) * 100),
  };
}

/**
 * Single segment card with expandable details
 */
function SegmentCard({
  segment,
  index,
  isLast,
  travelMode,
}: {
  segment: ItinerarySegment;
  index: number;
  isLast: boolean;
  travelMode: 'drive' | 'fly' | 'mixed';
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const nights = Array.isArray(segment.nights)
    ? `${segment.nights[0]}-${segment.nights[1]}`
    : segment.nights;
  const nightsNum = Array.isArray(segment.nights) ? segment.nights[0] : segment.nights;
  const breakdown = calculateTimeBreakdown(segment);

  return (
    <div className="relative">
      {/* Timeline connector */}
      {!isLast && (
        <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-stone-200" />
      )}

      {/* Segment card */}
      <div className="relative pl-14">
        {/* Day number badge */}
        <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center">
          <span className="text-sm font-semibold text-amber-800">
            {index === 0 ? '1' : `${index + 1}`}
          </span>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          {/* Header */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-5 py-4 flex items-start justify-between text-left hover:bg-stone-50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <h3 className="font-medium text-stone-900 truncate">{segment.title}</h3>
              </div>
              <p className="text-sm text-stone-500 line-clamp-1">{segment.description}</p>
            </div>
            <div className="flex items-center gap-3 ml-4">
              <span className="flex items-center gap-1 text-sm text-stone-600 bg-stone-100 px-2 py-1 rounded">
                <Moon className="w-3.5 h-3.5" />
                {nights} {nightsNum === 1 ? 'night' : 'nights'}
              </span>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-stone-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-stone-400" />
              )}
            </div>
          </button>

          {/* Expanded content */}
          {isExpanded && (
            <div className="px-5 pb-5 border-t border-stone-100">
              {/* Time breakdown bar */}
              <div className="mt-4 mb-4">
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
                  How your time breaks down
                </p>
                <div className="h-3 rounded-full overflow-hidden flex">
                  <div
                    className="bg-amber-500"
                    style={{ width: `${breakdown.wildlife}%` }}
                    title={`Wildlife viewing: ${breakdown.wildlife}%`}
                  />
                  <div
                    className="bg-stone-400"
                    style={{ width: `${breakdown.transit}%` }}
                    title={`Transit: ${breakdown.transit}%`}
                  />
                  <div
                    className="bg-blue-400"
                    style={{ width: `${breakdown.rest}%` }}
                    title={`Rest: ${breakdown.rest}%`}
                  />
                  <div
                    className="bg-green-400"
                    style={{ width: `${breakdown.meals}%` }}
                    title={`Meals: ${breakdown.meals}%`}
                  />
                </div>
                <div className="flex flex-wrap gap-3 mt-2 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Wildlife {breakdown.wildlife}%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-stone-400" />
                    Transit {breakdown.transit}%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    Rest {breakdown.rest}%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    Meals {breakdown.meals}%
                  </span>
                </div>
              </div>

              {/* Typical day schedule */}
              <div className="mb-4">
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
                  A typical day
                </p>
                <div className="space-y-2">
                  {segment.typical_day.dawn && (
                    <div className="flex items-start gap-3 text-sm">
                      <Sunrise className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-stone-700">Dawn:</span>{' '}
                        <span className="text-stone-600">{segment.typical_day.dawn}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3 text-sm">
                    <Sun className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-stone-700">Morning:</span>{' '}
                      <span className="text-stone-600">{segment.typical_day.morning}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Coffee className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-stone-700">Midday:</span>{' '}
                      <span className="text-stone-600">{segment.typical_day.midday}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Sun className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-stone-700">Afternoon:</span>{' '}
                      <span className="text-stone-600">{segment.typical_day.afternoon}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Sunset className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-stone-700">Evening:</span>{' '}
                      <span className="text-stone-600">{segment.typical_day.evening}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="mb-4">
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
                  Highlights
                </p>
                <ul className="space-y-1">
                  {segment.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-stone-600">
                      <Camera className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Activities */}
              <div className="mb-4">
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
                  Activities available
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {segment.activities_available.map((activity) => (
                    <Link
                      key={activity}
                      href={`/activities/${activity}`}
                      className="px-2 py-1 text-xs bg-amber-50 text-amber-700 rounded hover:bg-amber-100 transition-colors"
                    >
                      {activity.replace(/-/g, ' ')}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Transfers */}
              <div className="pt-3 border-t border-stone-100">
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
                  Getting here
                </p>
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  {travelMode === 'fly' ? (
                    <Plane className="w-4 h-4 text-stone-400" />
                  ) : (
                    <Car className="w-4 h-4 text-stone-400" />
                  )}
                  {segment.transfers.arrival}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transfer indicator between segments */}
      {!isLast && (
        <div className="relative pl-14 py-2">
          <div className="flex items-center gap-2 text-xs text-stone-400">
            {travelMode === 'fly' ? (
              <Plane className="w-3.5 h-3.5" />
            ) : (
              <Car className="w-3.5 h-3.5" />
            )}
            <span>Transfer to next destination</span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Overall trip time summary
 */
function TripTimeSummary({
  segments,
  totalDays,
}: {
  segments: ItinerarySegment[];
  totalDays: number;
}) {
  // Calculate aggregate time breakdown
  const totalHours = totalDays * 24;
  const totalNights = segments.reduce((sum, s) => {
    const n = Array.isArray(s.nights) ? s.nights[0] : s.nights;
    return sum + n;
  }, 0);

  const sleepHours = totalNights * 8;
  const restHours = totalNights * 3;
  const mealHours = totalNights * 3;
  const transferHours = segments.length * 3;
  const wildlifeHours = Math.max(0, totalHours - sleepHours - restHours - mealHours - transferHours);

  return (
    <div className="bg-stone-900 rounded-xl p-5 text-white mb-6">
      <h3 className="font-medium text-lg mb-3">Your time on safari</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-2xl font-semibold text-amber-400">{Math.round(wildlifeHours)}h</p>
          <p className="text-sm text-stone-400">Wildlife viewing</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-stone-300">{Math.round(transferHours)}h</p>
          <p className="text-sm text-stone-400">Transfers</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-blue-400">{Math.round(sleepHours + restHours)}h</p>
          <p className="text-sm text-stone-400">Rest and sleep</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-green-400">{Math.round(mealHours)}h</p>
          <p className="text-sm text-stone-400">Meals and socializing</p>
        </div>
      </div>
      <p className="text-xs text-stone-500 mt-4">
        Estimates based on typical safari schedules. Actual time varies by season and itinerary.
      </p>
    </div>
  );
}

export function DayByDayVisualization({
  segments,
  tripTitle,
  totalDays,
  travelMode = 'drive',
}: DayByDayVisualizationProps) {
  if (!segments || segments.length === 0) {
    return null;
  }

  return (
    <section className="mb-8" data-testid="section-day-by-day">
      <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-2">
        Day by day
      </h2>
      <p className="text-stone-600 text-sm mb-6">
        How your {totalDays} days unfold across {segments.length} destinations
      </p>

      {/* Time summary */}
      <TripTimeSummary segments={segments} totalDays={totalDays} />

      {/* Segment timeline */}
      <div className="space-y-2">
        {segments.map((segment, index) => (
          <SegmentCard
            key={segment.id}
            segment={segment}
            index={index}
            isLast={index === segments.length - 1}
            travelMode={travelMode}
          />
        ))}
      </div>
    </section>
  );
}

export default DayByDayVisualization;
