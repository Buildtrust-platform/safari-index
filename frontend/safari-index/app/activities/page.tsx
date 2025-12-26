/**
 * Activities Hub Page
 *
 * Static, indexable hub for safari activities authority layer.
 * No Bedrock calls - purely deterministic content from inventory.
 *
 * Per governance:
 * - Documentary, operator-grade tone
 * - No hype or promotional language
 * - Internal links with question titles
 * - Honest about trade-offs and limitations
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Compass,
  ChevronRight,
  ArrowRight,
  Car,
  Waves,
  Footprints,
  Plane,
  Sparkles,
} from 'lucide-react';
import { Navbar, Footer } from '../components/layout';
import {
  ImageBand,
  ImageBandContent,
  ecosystemImages,
  getActivityImageRef,
} from '../components/visual';
import { SearchAndFilters } from '../components/SearchAndFilters';
import {
  activityPrimitives,
  ActivityCategory,
} from '../content/activities/activity-primitives';
import { getDecisionsByRegion, LINK_LIMITS } from '../../lib/internal-links';

export const metadata: Metadata = {
  title: 'Safari Activities | Safari Index',
  description:
    'Safari activities from game drives to walking safaris, gorilla trekking to mokoro excursions. Understand what each activity offers, who it suits, and the trade-offs.',
  robots: 'index, follow',
  alternates: {
    canonical: '/activities',
  },
  openGraph: {
    title: 'Safari Activities | Safari Index',
    description:
      'Explore safari activities: game drives, walking safaris, boat safaris, gorilla trekking, and more. Honest guidance on who each activity suits.',
    type: 'website',
    url: '/activities',
  },
};

/**
 * Category icon mapping
 */
function getCategoryIcon(category: ActivityCategory) {
  switch (category) {
    case 'vehicle':
      return <Car className="w-5 h-5" />;
    case 'water':
      return <Waves className="w-5 h-5" />;
    case 'foot':
      return <Footprints className="w-5 h-5" />;
    case 'aerial':
      return <Plane className="w-5 h-5" />;
    case 'specialty':
      return <Sparkles className="w-5 h-5" />;
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
function getEffortDisplay(effort: string): { label: string; color: string } {
  switch (effort) {
    case 'low':
      return { label: 'Low effort', color: 'bg-green-100 text-green-700' };
    case 'medium':
      return { label: 'Moderate', color: 'bg-amber-100 text-amber-700' };
    case 'medium-high':
      return { label: 'Demanding', color: 'bg-orange-100 text-orange-700' };
    case 'high':
      return { label: 'Strenuous', color: 'bg-red-100 text-red-700' };
    default:
      return { label: effort, color: 'bg-stone-100 text-stone-700' };
  }
}

/**
 * Group activities by category
 */
function groupByCategory() {
  const groups: Record<ActivityCategory, typeof activityPrimitives> = {
    vehicle: [],
    water: [],
    foot: [],
    aerial: [],
    specialty: [],
  };

  for (const activity of activityPrimitives) {
    groups[activity.category].push(activity);
  }

  return groups;
}

/**
 * Activity card component
 */
function ActivityCard({ activity }: { activity: typeof activityPrimitives[0] }) {
  const effortDisplay = getEffortDisplay(activity.physical_effort);
  const activityImage = getActivityImageRef(activity.id);

  return (
    <Link
      href={`/activities/${activity.id}`}
      className="group block bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-amber-300 hover:shadow-md transition-all"
      data-testid="activity-card"
    >
      {/* Activity Image */}
      {activityImage?.hasImage && activityImage.src && (
        <div className="relative h-32 overflow-hidden">
          <img
            src={activityImage.src}
            alt={activityImage.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600 group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors">
              {getCategoryIcon(activity.category)}
            </div>
            <h3 className="font-editorial text-lg font-semibold text-stone-900 group-hover:text-amber-700 transition-colors">
              {activity.name}
            </h3>
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${effortDisplay.color}`}>
            {effortDisplay.label}
          </span>
        </div>

        {/* Description */}
        <p className="text-stone-600 text-sm mb-4 line-clamp-2">
          {activity.what_it_is}
        </p>

        {/* Who it's for */}
        <div className="mb-3">
          <span className="text-xs text-stone-500 uppercase tracking-wide">Best for</span>
          <p className="text-sm text-stone-700 mt-1">{activity.who_it_is_for}</p>
        </div>

        {/* Trade-offs preview */}
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <span className="text-green-600">+ {activity.trade_offs.gains.split(',')[0]}</span>
          <span className="text-stone-300">|</span>
          <span className="text-red-600">- {activity.trade_offs.losses.split(',')[0]}</span>
        </div>

        {/* Destinations count */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-sm">
          <span className="text-stone-500">
            Available in {activity.where_possible.length} destinations
          </span>
          <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}

export default function ActivitiesPage() {
  const groupedActivities = groupByCategory();
  const categories: ActivityCategory[] = ['vehicle', 'water', 'foot', 'aerial', 'specialty'];

  // Get some cross-cutting decisions for the bottom section
  const timingDecisions = getDecisionsByRegion('', 6).filter(
    (d) =>
      d.anchorText.toLowerCase().includes('when') ||
      d.anchorText.toLowerCase().includes('season')
  );

  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar variant="transparent" />

      {/* Hero */}
      <ImageBand
        image={ecosystemImages.find((img) => img.id === 'savannah-morning') || ecosystemImages[0]}
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
              <span className="text-white">Activities</span>
            </div>

            {/* Icon + Title */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Compass className="w-6 h-6 text-amber-400" />
              </div>
              <h1
                className="font-editorial text-4xl md:text-5xl font-semibold text-white"
                data-testid="activities-h1"
              >
                Safari Activities
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              What you'll actually do on safari.
              <br className="hidden md:block" />
              Each activity has its character, demands, and rewards.
            </p>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Search Section */}
      <section className="bg-white py-8 border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <SearchAndFilters
            context="activities"
            placeholder="Search activities... e.g., 'walking safari' or 'balloon'"
            showActivityFilter={false}
            compact
          />
        </div>
      </section>

      {/* Quick nav by category */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <a
              key={cat}
              href={`#${cat}`}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 text-stone-700 text-sm rounded-full hover:border-amber-300 hover:text-amber-700 transition-colors"
            >
              {getCategoryIcon(cat)}
              {getCategoryName(cat)}
            </a>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {/* Category sections */}
        {categories.map((category) => {
          const activities = groupedActivities[category];
          if (activities.length === 0) return null;

          return (
            <section key={category} id={category} className="mb-12 scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-stone-900 flex items-center justify-center text-white">
                  {getCategoryIcon(category)}
                </div>
                <h2 className="font-editorial text-2xl font-semibold text-stone-900">
                  {getCategoryName(category)} Activities
                </h2>
              </div>

              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                data-testid={`activity-category-${category}`}
              >
                {activities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </section>
          );
        })}

        {/* Timing considerations */}
        {timingDecisions.length > 0 && (
          <section className="mt-12 pt-8 border-t border-stone-200">
            <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-2">
              When Activities Are Best
            </h2>
            <p className="text-stone-600 mb-4">
              Activity availability often depends on season, water levels, and weather.
            </p>
            <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
              {timingDecisions.slice(0, LINK_LIMITS.decisions).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between px-6 py-4 hover:bg-stone-50 transition-colors group"
                  title={link.title}
                  prefetch={false}
                  data-testid="timing-decision-link"
                >
                  <span className="text-stone-700 group-hover:text-amber-700 transition-colors">
                    {link.anchorText}
                  </span>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-colors" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="mt-12 pt-8 border-t border-stone-200">
          <div className="bg-stone-900 rounded-xl p-6 text-center">
            <h3 className="font-editorial text-xl text-white mb-2">
              Not sure which activities suit you?
            </h3>
            <p className="text-stone-400 text-sm mb-4 max-w-md mx-auto">
              Share your preferences and we'll design an itinerary with the right activity mix.
            </p>
            <Link
              href="/inquire"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-stone-900 rounded-lg font-medium hover:bg-stone-100 transition-colors"
              prefetch={false}
            >
              Start planning
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <Footer variant="operator" />
    </main>
  );
}
