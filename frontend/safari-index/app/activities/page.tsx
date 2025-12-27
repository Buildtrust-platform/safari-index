/**
 * Activities Hub Page
 *
 * Consistent design with other hub pages:
 * - Hero with icon, title, subtitle, stats
 * - Search section
 * - Featured activities grid
 * - Category sections with visual headers
 * - CTA footer
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
 * Category configuration with icons and images
 */
const CATEGORY_CONFIG: Record<
  ActivityCategory,
  {
    name: string;
    description: string;
    icon: React.ElementType;
    imageIndex: number;
  }
> = {
  vehicle: {
    name: 'Vehicle-Based',
    description: 'Classic game drives and 4x4 adventures',
    icon: Car,
    imageIndex: 0, // savannah-morning
  },
  water: {
    name: 'Water-Based',
    description: 'Boat safaris, mokoro, and canoe adventures',
    icon: Waves,
    imageIndex: 1, // delta-channels
  },
  foot: {
    name: 'On Foot',
    description: 'Walking safaris and bush experiences',
    icon: Footprints,
    imageIndex: 4, // floodplain-evening
  },
  aerial: {
    name: 'Aerial',
    description: 'Balloon rides and scenic flights',
    icon: Plane,
    imageIndex: 7, // crater-highlands
  },
  specialty: {
    name: 'Specialty',
    description: 'Gorilla trekking, night drives, and unique experiences',
    icon: Sparkles,
    imageIndex: 3, // montane-forest
  },
};

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
 * Featured activity card with large image
 */
function FeaturedActivityCard({ activity }: { activity: typeof activityPrimitives[0] }) {
  const config = CATEGORY_CONFIG[activity.category];
  const Icon = config.icon;
  const activityImage = getActivityImageRef(activity.id);
  const effortDisplay = getEffortDisplay(activity.physical_effort);

  return (
    <Link
      href={`/activities/${activity.id}`}
      className="group block bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-amber-300 hover:shadow-lg transition-all"
      data-testid="featured-activity"
    >
      {/* Image */}
      <div className="relative h-36 overflow-hidden">
        {activityImage?.hasImage && activityImage.src ? (
          <img
            src={activityImage.src}
            alt={activityImage.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
            style={{ backgroundImage: `url(${ecosystemImages[config.imageIndex].src})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium bg-white/90 backdrop-blur-sm text-stone-700 rounded-full">
            <Icon className="w-3 h-3" />
            {config.name}
          </span>
          <span className={`px-2 py-0.5 text-xs rounded-full ${effortDisplay.color}`}>
            {effortDisplay.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-editorial text-lg font-semibold text-stone-900 group-hover:text-amber-700 transition-colors mb-1">
          {activity.name}
        </h3>
        <p className="text-stone-500 text-sm line-clamp-2 mb-3">{activity.what_it_is}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-stone-400">
            {activity.where_possible.length} destinations
          </span>
          <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  );
}

/**
 * Activity card in category grid
 */
function ActivityCard({ activity }: { activity: typeof activityPrimitives[0] }) {
  const config = CATEGORY_CONFIG[activity.category];
  const Icon = config.icon;
  const effortDisplay = getEffortDisplay(activity.physical_effort);

  return (
    <Link
      href={`/activities/${activity.id}`}
      className="group block bg-white rounded-xl border border-stone-200 p-4 hover:border-amber-300 hover:shadow-md transition-all"
      data-testid="activity-card"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-stone-100 group-hover:bg-amber-100 flex items-center justify-center flex-shrink-0 transition-colors">
          <Icon className="w-5 h-5 text-stone-500 group-hover:text-amber-600 transition-colors" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-editorial text-base font-semibold text-stone-900 group-hover:text-amber-700 transition-colors">
              {activity.name}
            </h3>
            <span className={`px-2 py-0.5 text-xs rounded-full flex-shrink-0 ml-2 ${effortDisplay.color}`}>
              {effortDisplay.label}
            </span>
          </div>
          <p className="text-stone-500 text-sm line-clamp-2 mb-2">{activity.what_it_is}</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-400">
              {activity.where_possible.length} destinations
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Category section with visual header
 */
function CategorySection({ category, activities }: { category: ActivityCategory; activities: typeof activityPrimitives }) {
  const config = CATEGORY_CONFIG[category];
  const Icon = config.icon;
  const bgImage = ecosystemImages[config.imageIndex];

  if (activities.length === 0) return null;

  return (
    <section id={category} className="scroll-mt-24" data-testid={`category-${category}`}>
      {/* Category header with image */}
      <div className="relative rounded-t-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-900/70 to-stone-900/50 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage.src})` }}
        />
        <div className="relative z-20 p-5 md:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Icon className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="font-editorial text-lg font-semibold text-white">
                {config.name}
              </h2>
              <p className="text-white/70 text-sm">{config.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activities grid */}
      <div className="bg-white rounded-b-2xl border border-t-0 border-stone-200 p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Category navigation chip
 */
function CategoryNavChip({ category, count }: { category: ActivityCategory; count: number }) {
  const config = CATEGORY_CONFIG[category];
  const Icon = config.icon;

  return (
    <a
      href={`#${category}`}
      className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 bg-white rounded-lg border border-stone-200 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 transition-colors whitespace-nowrap shadow-sm"
    >
      <Icon className="w-4 h-4" />
      <span>{config.name}</span>
      <span className="text-xs text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">{count}</span>
    </a>
  );
}

export default function ActivitiesPage() {
  const groupedActivities = groupByCategory();
  const categories: ActivityCategory[] = ['vehicle', 'water', 'foot', 'aerial', 'specialty'];
  const totalActivities = activityPrimitives.length;

  // Get featured activities (first from each category)
  const featuredActivities = categories
    .map((cat) => groupedActivities[cat][0])
    .filter(Boolean)
    .slice(0, 6);

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
              {totalActivities} activities across {categories.length} categories.
              <br className="hidden md:block" />
              Each has its character, demands, and rewards.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 mt-6 text-white/60 text-sm">
              <span>{totalActivities} activities</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>{categories.length} categories</span>
            </div>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Search Section */}
      <section className="bg-white py-6 border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <SearchAndFilters
            context="activities"
            placeholder="Search activities... e.g., 'walking safari' or 'balloon'"
            showActivityFilter={false}
            compact
          />
        </div>
      </section>

      {/* Featured Activities */}
      <section className="bg-white py-10 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="font-editorial text-xl font-semibold text-stone-900">
                Popular Activities
              </h2>
              <p className="text-stone-500 text-sm">Most common safari experiences</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredActivities.map((activity) => (
              <FeaturedActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        {/* Category navigation */}
        <nav className="mb-8" aria-label="Activity categories">
          <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">
            Browse by category
          </h2>
          <div className="flex flex-wrap gap-2" data-testid="category-nav">
            {categories.map((category) => (
              <CategoryNavChip
                key={category}
                category={category}
                count={groupedActivities[category].length}
              />
            ))}
          </div>
        </nav>

        {/* Category sections */}
        <div className="space-y-8" data-testid="category-sections">
          {categories.map((category) => (
            <CategorySection
              key={category}
              category={category}
              activities={groupedActivities[category]}
            />
          ))}
        </div>

        {/* CTA section */}
        <div className="mt-12 pt-8 border-t border-stone-200">
          <div className="bg-stone-900 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="font-editorial text-xl text-white mb-2">
                  Not sure which activities suit you?
                </h3>
                <p className="text-stone-400 text-sm">
                  Share your preferences and we'll design the right activity mix.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/inquire"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-stone-900 rounded-lg font-medium hover:bg-stone-100 transition-colors text-sm"
                >
                  Start planning
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/itineraries"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-transparent text-white border border-white/30 rounded-lg font-medium hover:bg-white/10 transition-colors text-sm"
                >
                  Browse itineraries
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer variant="operator" />
    </main>
  );
}
