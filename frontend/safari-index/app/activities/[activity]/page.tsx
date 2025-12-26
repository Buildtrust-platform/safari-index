/**
 * Individual Activity Page
 *
 * Static, indexable page for each safari activity.
 * No Bedrock calls - purely deterministic content from inventory.
 *
 * Per governance:
 * - Documentary, operator-grade tone
 * - No hype or promotional language
 * - Honest about trade-offs and limitations
 * - Internal links to related destinations and trips
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  ChevronRight,
  ArrowRight,
  Car,
  Waves,
  Footprints,
  Plane,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Compass,
  ImageIcon,
} from 'lucide-react';
import { Navbar } from '../../components/layout';
import {
  ImageBand,
  ImageBandContent,
  ecosystemImages,
  getActivityImageRef,
  getActivityFallbackImage,
} from '../../components/visual';
import {
  getActivityById,
  getAllActivityIds,
  ActivityPrimitive,
  ActivityCategory,
} from '../../content/activities/activity-primitives';
import {
  getDestinationsForActivity,
  getProfileByDestination,
} from '../../content/activities/destination-profiles';
import { getDecisionsByRegion, getTripsByRegion, LINK_LIMITS } from '../../../lib/internal-links';

/**
 * Generate static params for all activities
 */
export async function generateStaticParams() {
  const activityIds = getAllActivityIds();
  return activityIds.map((id) => ({ activity: id }));
}

/**
 * Generate metadata for each activity page
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ activity: string }>;
}): Promise<Metadata> {
  const { activity: activitySlug } = await params;
  const activity = getActivityById(activitySlug);

  if (!activity) {
    return {
      title: 'Activity Not Found | Safari Index',
    };
  }

  return {
    title: `${activity.name} Safari | Safari Index`,
    description: `${activity.what_it_is} Learn who ${activity.name.toLowerCase()} suits, where it's available, and what to expect.`,
    robots: 'index, follow',
    alternates: {
      canonical: `/activities/${activity.id}`,
    },
    openGraph: {
      title: `${activity.name} Safari | Safari Index`,
      description: activity.what_it_is,
      type: 'article',
      url: `/activities/${activity.id}`,
    },
  };
}

/**
 * Category icon mapping
 */
function getCategoryIcon(category: ActivityCategory) {
  switch (category) {
    case 'vehicle':
      return <Car className="w-6 h-6" />;
    case 'water':
      return <Waves className="w-6 h-6" />;
    case 'foot':
      return <Footprints className="w-6 h-6" />;
    case 'aerial':
      return <Plane className="w-6 h-6" />;
    case 'specialty':
      return <Sparkles className="w-6 h-6" />;
  }
}

/**
 * Category display name
 */
function getCategoryName(category: ActivityCategory): string {
  switch (category) {
    case 'vehicle':
      return 'Vehicle-Based';
    case 'water':
      return 'Water-Based';
    case 'foot':
      return 'On Foot';
    case 'aerial':
      return 'Aerial';
    case 'specialty':
      return 'Specialty';
  }
}

/**
 * Physical effort display
 */
function getEffortDisplay(effort: string): { label: string; color: string; description: string } {
  switch (effort) {
    case 'low':
      return {
        label: 'Low effort',
        color: 'bg-green-100 text-green-700 border-green-200',
        description: 'Suitable for all fitness levels. No special physical preparation required.',
      };
    case 'medium':
      return {
        label: 'Moderate effort',
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        description: 'Some physical activity involved. Basic fitness recommended.',
      };
    case 'medium-high':
      return {
        label: 'Demanding',
        color: 'bg-orange-100 text-orange-700 border-orange-200',
        description: 'Requires reasonable fitness. Expect extended walking or challenging terrain.',
      };
    case 'high':
      return {
        label: 'Strenuous',
        color: 'bg-red-100 text-red-700 border-red-200',
        description: 'Good fitness essential. May involve altitude, long hikes, or difficult conditions.',
      };
    default:
      return {
        label: effort,
        color: 'bg-stone-100 text-stone-700 border-stone-200',
        description: '',
      };
  }
}

/**
 * Destination section component
 */
function DestinationSection({ activity }: { activity: ActivityPrimitive }) {
  const destinationNames = getDestinationsForActivity(activity.id);

  return (
    <section className="mb-8">
      <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-amber-600" />
        Where Available
      </h2>
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <p className="text-stone-600 mb-4">
          {activity.name} is available in {destinationNames.length} destinations:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {destinationNames.map((name) => {
            const destinationId = name.toLowerCase().replace(' ', '-');
            const profile = getProfileByDestination(destinationId);
            const activityInfo = profile?.activities.find((a) => a.activityId === activity.id);

            return (
              <Link
                key={name}
                href={`/destinations#${destinationId}`}
                className="group p-3 bg-stone-50 rounded-lg hover:bg-amber-50 hover:border-amber-200 border border-transparent transition-colors"
                data-testid="destination-link"
              >
                <span className="text-stone-900 font-medium group-hover:text-amber-700 transition-colors">
                  {name}
                </span>
                {activityInfo?.availability === 'seasonal' && (
                  <span className="block text-xs text-stone-500 mt-1">
                    Seasonal: {activityInfo.bestMonths?.join(', ')}
                  </span>
                )}
                {activityInfo?.availability === 'limited' && (
                  <span className="block text-xs text-stone-500 mt-1">Limited availability</span>
                )}
                {activityInfo?.notes && (
                  <span className="block text-xs text-stone-500 mt-1">{activityInfo.notes}</span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * Related decisions section
 */
function RelatedDecisionsSection({ activity }: { activity: ActivityPrimitive }) {
  // Get decisions from destinations where this activity is available
  const destinationIds = activity.where_possible.slice(0, 3);
  const allDecisions = destinationIds.flatMap((destId) => {
    const baseId = destId.split('-')[0]; // Handle "tanzania-serengeti" -> "tanzania"
    return getDecisionsByRegion(baseId, 3);
  });

  // Dedupe and limit
  const uniqueDecisions = allDecisions.filter(
    (decision, index, self) => self.findIndex((d) => d.href === decision.href) === index
  ).slice(0, LINK_LIMITS.decisions);

  if (uniqueDecisions.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
        Related Decisions
      </h2>
      <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
        {uniqueDecisions.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center justify-between px-6 py-4 hover:bg-stone-50 transition-colors group"
            title={link.title}
            prefetch={false}
            data-testid="decision-link"
          >
            <span className="text-stone-700 group-hover:text-amber-700 transition-colors">
              {link.anchorText}
            </span>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-colors" />
          </Link>
        ))}
      </div>
    </section>
  );
}

/**
 * Related trips section
 */
function RelatedTripsSection({ activity }: { activity: ActivityPrimitive }) {
  const destinationIds = activity.where_possible.slice(0, 3);
  const allTrips = destinationIds.flatMap((destId) => {
    const baseId = destId.split('-')[0];
    return getTripsByRegion(baseId, 2);
  });

  const uniqueTrips = allTrips.filter(
    (trip, index, self) => self.findIndex((t) => t.href === trip.href) === index
  ).slice(0, LINK_LIMITS.trips);

  if (uniqueTrips.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4 flex items-center gap-2">
        <Compass className="w-5 h-5 text-amber-600" />
        Trips That Include This Activity
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {uniqueTrips.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group p-4 bg-white rounded-xl border border-stone-200 hover:border-amber-300 hover:shadow-md transition-all"
            title={link.title}
            prefetch={false}
            data-testid="trip-link"
          >
            <span className="text-stone-900 font-medium group-hover:text-amber-700 transition-colors block mb-1">
              {link.anchorText}
            </span>
            <span className="text-sm text-stone-500 flex items-center gap-1">
              View trip
              <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ activity: string }>;
}) {
  const { activity: activitySlug } = await params;
  const activity = getActivityById(activitySlug);

  if (!activity) {
    notFound();
  }

  const effortDisplay = getEffortDisplay(activity.physical_effort);

  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar variant="transparent" />

      {/* Hero - Use activity-specific image if available, otherwise fallback to ecosystem */}
      <ImageBand
        image={(() => {
          const activityRef = getActivityImageRef(activity.id);
          if (activityRef?.hasImage && activityRef.src) {
            return { id: activityRef.activityId, src: activityRef.src, alt: activityRef.alt, tags: [] as const };
          }
          return getActivityFallbackImage(activity.id);
        })()}
        height="explore"
        overlay="strong"
        align="center"
        priority
        alwaysRender
      >
        <ImageBandContent maxWidth="default" className="pt-24 pb-8">
          <div className="text-center">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-white/60 text-sm mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                Safari Index
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/activities" className="hover:text-white transition-colors">
                Activities
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{activity.name}</span>
            </div>

            {/* Category badge */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm border border-white/20">
                {getCategoryIcon(activity.category)}
                {getCategoryName(activity.category)}
              </span>
            </div>

            {/* Title */}
            <h1
              className="font-editorial text-4xl md:text-5xl font-semibold text-white mb-4"
              data-testid="activity-h1"
            >
              {activity.name}
            </h1>

            {/* Effort badge */}
            <span
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${effortDisplay.color}`}
            >
              {effortDisplay.label}
            </span>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {/* What it is */}
        <section className="mb-8">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
            What It Is
          </h2>
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <p className="text-stone-700 text-lg leading-relaxed">{activity.what_it_is}</p>
          </div>
        </section>

        {/* Photo inspiration */}
        <section className="mb-8">
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
            <div className="flex items-start gap-3">
              <ImageIcon className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-900 mb-1">Visual Reference</h3>
                <p className="text-amber-800 text-sm">{activity.image_hint}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Who it's for / Who should avoid - side by side */}
        <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h3 className="font-medium text-stone-900 mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              Best For
            </h3>
            <p className="text-stone-700">{activity.who_it_is_for}</p>
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h3 className="font-medium text-stone-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Consider Skipping If
            </h3>
            <p className="text-stone-700">{activity.who_should_avoid}</p>
          </div>
        </section>

        {/* Physical effort details */}
        <section className="mb-8">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
            Physical Demands
          </h2>
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${effortDisplay.color}`}>
                {effortDisplay.label}
              </span>
            </div>
            <p className="text-stone-700">{effortDisplay.description}</p>
          </div>
        </section>

        {/* Timing */}
        <section className="mb-8">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-600" />
            Best Season
          </h2>
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <p className="text-stone-700">{activity.best_season}</p>
          </div>
        </section>

        {/* Risk notes */}
        {activity.risk_notes && (
          <section className="mb-8">
            <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              What to Know
            </h2>
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
              <p className="text-amber-900">{activity.risk_notes}</p>
            </div>
          </section>
        )}

        {/* Trade-offs */}
        <section className="mb-8">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
            Trade-Offs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl border border-green-200 p-6">
              <h3 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                <ThumbsUp className="w-5 h-5" />
                What You Gain
              </h3>
              <p className="text-green-800">{activity.trade_offs.gains}</p>
            </div>
            <div className="bg-red-50 rounded-xl border border-red-200 p-6">
              <h3 className="font-medium text-red-900 mb-3 flex items-center gap-2">
                <ThumbsDown className="w-5 h-5" />
                What You Trade Away
              </h3>
              <p className="text-red-800">{activity.trade_offs.losses}</p>
            </div>
          </div>
        </section>

        {/* Destinations */}
        <DestinationSection activity={activity} />

        {/* Related decisions */}
        <RelatedDecisionsSection activity={activity} />

        {/* Related trips */}
        <RelatedTripsSection activity={activity} />

        {/* CTA */}
        <div className="mt-12 pt-8 border-t border-stone-200">
          <div className="bg-stone-900 rounded-xl p-6 text-center">
            <h3 className="font-editorial text-xl text-white mb-2">
              Want to include {activity.name.toLowerCase()} in your safari?
            </h3>
            <p className="text-stone-400 text-sm mb-4 max-w-md mx-auto">
              Share your preferences and we'll design an itinerary that includes this activity.
            </p>
            <Link
              href={`/inquire?activity=${activity.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-stone-900 rounded-lg font-medium hover:bg-stone-100 transition-colors"
              prefetch={false}
            >
              Start planning
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="font-editorial text-lg font-semibold">Safari Index</span>
              <span className="text-stone-500 text-sm ml-2">Private Safari Operator</span>
            </div>

            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-sm text-stone-400 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                href="/activities"
                className="text-sm text-stone-400 hover:text-white transition-colors"
              >
                Activities
              </Link>
              <Link
                href="/destinations"
                className="text-sm text-stone-400 hover:text-white transition-colors"
              >
                Destinations
              </Link>
              <Link
                href="/trips"
                className="text-sm text-stone-400 hover:text-white transition-colors"
              >
                Safaris
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
