/**
 * Typical Day Section Component
 *
 * Shows "What your days look like" with activity rhythm for a destination.
 * Used on trip pages to give travelers a sense of daily flow.
 *
 * Per governance:
 * - Documentary tone
 * - No hype
 * - Practical, operator-grade descriptions
 */

import Link from 'next/link';
import {
  Sunrise,
  Sun,
  Coffee,
  Sunset,
  Moon,
  Stars,
  ArrowRight,
} from 'lucide-react';
import {
  DestinationActivityProfile,
  getProfileByDestination,
} from '../../content/activities/destination-profiles';
import {
  getActivityById,
  ActivityPrimitive,
} from '../../content/activities/activity-primitives';

interface TypicalDaySectionProps {
  /** Primary destination ID for this trip */
  primaryDestination: string;
  /** Optional: specific activities to highlight */
  highlightActivities?: string[];
}

/**
 * Time of day icon mapping
 */
function getTimeIcon(time: keyof DestinationActivityProfile['typical_day']) {
  switch (time) {
    case 'dawn':
      return <Sunrise className="w-5 h-5 text-amber-500" />;
    case 'morning':
      return <Sun className="w-5 h-5 text-amber-400" />;
    case 'midday':
      return <Coffee className="w-5 h-5 text-stone-400" />;
    case 'afternoon':
      return <Sun className="w-5 h-5 text-orange-400" />;
    case 'evening':
      return <Sunset className="w-5 h-5 text-orange-500" />;
    case 'night':
      return <Moon className="w-5 h-5 text-indigo-400" />;
  }
}

/**
 * Time of day label
 */
function getTimeLabel(time: keyof DestinationActivityProfile['typical_day']) {
  switch (time) {
    case 'dawn':
      return 'Dawn';
    case 'morning':
      return 'Morning';
    case 'midday':
      return 'Midday';
    case 'afternoon':
      return 'Afternoon';
    case 'evening':
      return 'Evening';
    case 'night':
      return 'Night';
  }
}

/**
 * Activity chip component
 */
function ActivityChip({ activity }: { activity: ActivityPrimitive }) {
  return (
    <Link
      href={`/activities/${activity.id}`}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs rounded-full hover:bg-amber-100 transition-colors"
      title={activity.what_it_is}
    >
      {activity.name}
      <ArrowRight className="w-3 h-3" />
    </Link>
  );
}

export function TypicalDaySection({
  primaryDestination,
  highlightActivities = [],
}: TypicalDaySectionProps) {
  const profile = getProfileByDestination(primaryDestination);

  if (!profile) {
    return null;
  }

  const timeSlots: (keyof DestinationActivityProfile['typical_day'])[] = [
    'dawn',
    'morning',
    'midday',
    'afternoon',
    'evening',
    'night',
  ];

  // Get highlighted activities that are available in this destination
  const availableHighlightActivities = highlightActivities
    .map((id) => getActivityById(id))
    .filter((a): a is ActivityPrimitive => a !== undefined)
    .filter((a) => profile.activities.some((pa) => pa.activityId === a.id));

  // Get signature activities for this destination
  const signatureActivities = profile.activities
    .slice(0, 4)
    .map((a) => getActivityById(a.activityId))
    .filter((a): a is ActivityPrimitive => a !== undefined);

  return (
    <section className="mb-8" data-testid="section-typical-day">
      <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-3">
        What your days look like
      </h2>
      <p className="text-stone-600 text-sm mb-4">
        A typical day on safari in {profile.destinationName}
      </p>

      {/* Day timeline */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {timeSlots.map((time, index) => (
          <div
            key={time}
            className={`flex items-start gap-4 px-6 py-4 ${
              index < timeSlots.length - 1 ? 'border-b border-stone-100' : ''
            }`}
          >
            <div className="w-24 flex-shrink-0 flex items-center gap-2">
              {getTimeIcon(time)}
              <span className="text-sm font-medium text-stone-700">{getTimeLabel(time)}</span>
            </div>
            <p className="text-stone-600 text-sm">{profile.typical_day[time]}</p>
          </div>
        ))}
      </div>

      {/* Signature experience */}
      <div className="mt-6 bg-stone-900 rounded-xl p-6 text-white">
        <div className="flex items-start gap-4">
          <Stars className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium text-lg mb-2">
              {profile.signature_experience.title}
            </h3>
            <p className="text-stone-300 text-sm leading-relaxed">
              {profile.signature_experience.description}
            </p>
            <p className="text-stone-500 text-xs mt-3 italic">
              📷 {profile.signature_experience.image_hint}
            </p>
          </div>
        </div>
      </div>

      {/* Available activities */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-stone-700 mb-3">
          Activities available in {profile.destinationName}
        </h3>
        <div className="flex flex-wrap gap-2">
          {(highlightActivities.length > 0 ? availableHighlightActivities : signatureActivities).map(
            (activity) => (
              <ActivityChip key={activity.id} activity={activity} />
            )
          )}
          <Link
            href="/activities"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 text-stone-600 text-xs rounded-full hover:bg-stone-200 transition-colors"
          >
            All activities
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default TypicalDaySection;
