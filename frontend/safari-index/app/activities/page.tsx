/**
 * Activities Hub Page
 *
 * Design:
 * - Hero with icon, title, subtitle
 * - Sticky category navigation
 * - Category sections with visual headers
 * - Inline CTA after first category
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
  title: 'Safari Activities | Vurara Safaris',
  description:
    'Safari activities from game drives to walking safaris, gorilla trekking to mokoro excursions. Understand what each activity offers, who it suits, and the trade-offs.',
  robots: 'index, follow',
  alternates: {
    canonical: '/activities',
  },
  openGraph: {
    title: 'Safari Activities | Vurara Safaris',
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
 * Activity-specific fallback image mapping
 * Used when activity image doesn't exist or has hasImage: false
 * Each activity gets a unique, relevant fallback to avoid repetition
 */
const activityFallbackMap: Record<string, { src: string; alt: string }> = {
  // Vehicle-based activities
  'game-drive': {
    src: '/images/activities/game-drive.jpg',
    alt: 'Safari vehicle observing wildlife on an early morning game drive',
  },
  'night-drive': {
    src: '/images/activities/night-drive.jpg',
    alt: 'Black rhinos at artificially lit waterhole during night safari',
  },
  'photographic-hide': {
    src: '/images/activities/photographic-hide.jpg',
    alt: 'African elephant at waterhole from ground-level hide perspective',
  },
  // Water-based activities
  'boat-safari': {
    src: '/images/activities/boat-safari.jpg',
    alt: 'Safari boat cruising past hippos in African river',
  },
  mokoro: {
    src: '/images/activities/mokoro.jpg',
    alt: 'Traditional mokoro canoe on the Okavango Delta waterways',
  },
  'canoe-safari': {
    src: '/images/ecosystems/delta-channels.jpg',
    alt: 'Aerial view of Okavango Delta waterways winding through lush green islands',
  },
  kayaking: {
    src: '/images/activities/canoe-safari.jpg',
    alt: 'Kayaking on African waterways',
  },
  fishing: {
    src: '/images/activities/fishing.jpg',
    alt: 'Catch and release tiger fishing on African river',
  },
  'white-water-rafting': {
    src: '/images/activities/white-water-rafting.jpg',
    alt: 'Whitewater rafting near Victoria Falls on the Zambezi River',
  },
  'stand-up-paddleboarding': {
    src: '/images/ecosystems/floodplain-evening.jpg',
    alt: 'Hippopotamus in Botswana river at sunset with golden light reflections',
  },
  'source-of-nile': {
    src: '/images/destinations/uganda-bwindi.jpg',
    alt: 'Scenic views from Uganda',
  },
  // On foot activities
  'walking-safari': {
    src: '/images/activities/walking-safari.jpg',
    alt: 'Guided walking safari through African bush with armed ranger',
  },
  'gorilla-trekking': {
    src: '/images/activities/gorilla-trekking.jpg',
    alt: 'Group of mountain gorillas in Rwanda rainforest habitat',
  },
  'chimp-tracking': {
    src: '/images/activities/chimp-tracking.jpg',
    alt: 'Chimpanzee in tropical forest canopy',
  },
  'cultural-visit': {
    src: '/images/activities/cultural-visit.jpg',
    alt: 'Traditional Maasai village cultural experience',
  },
  'fly-camping': {
    src: '/images/activities/fly-camping.jpg',
    alt: 'Milky Way galaxy over Lake Naivasha camp under African night sky',
  },
  'horseback-safari': {
    src: '/images/ecosystems/savannah-wildlife.jpg',
    alt: 'Wild giraffes and zebras together on the African plains',
  },
  'golden-monkey-tracking': {
    src: '/images/destinations/rwanda-volcanoes.jpg',
    alt: 'Misty Volcanoes National Park, Rwanda',
  },
  'bird-watching': {
    src: '/images/ecosystems/woodland-clearing.jpg',
    alt: 'Woodland habitat perfect for bird watching',
  },
  'mountain-biking': {
    src: '/images/destinations/namibia-sossusvlei.jpg',
    alt: 'Towering red sand dunes of Sossusvlei at sunrise, Namibia',
  },
  // Aerial activities
  'hot-air-balloon': {
    src: '/images/activities/hot-air-balloon.jpg',
    alt: 'Hot air balloon floating over the Masai Mara at sunrise',
  },
  'scenic-helicopter': {
    src: '/images/activities/scenic-helicopter.jpg',
    alt: 'Helicopter flying over vast African wilderness landscape',
  },
  'zip-lining': {
    src: '/images/destinations/zimbabwe-mana.jpg',
    alt: 'Dramatic Zimbabwe landscape near Victoria Falls',
  },
  // Specialty activities
  'bungee-jumping': {
    src: '/images/activities/bungee-jumping.jpg',
    alt: 'Bungee jumping over Victoria Falls gorge',
  },
  'quad-biking': {
    src: '/images/ecosystems/desert-dunes.jpg',
    alt: 'Vast Namib Desert landscape with red sand dunes stretching to horizon',
  },
};

/**
 * Get image for activity - uses activity image if available, then fallback map, then category default
 */
function getActivityImage(activityId: string, categoryImageIndex: number): { src: string; alt: string } {
  // First check if activity has its own valid image
  const activityImage = getActivityImageRef(activityId);
  if (activityImage?.hasImage && activityImage.src) {
    return { src: activityImage.src, alt: activityImage.alt };
  }

  // Then check fallback map for specific alternative
  if (activityFallbackMap[activityId]) {
    return activityFallbackMap[activityId];
  }

  // Finally fall back to category ecosystem image
  const ecosystemImage = ecosystemImages[categoryImageIndex];
  return { src: ecosystemImage.src, alt: ecosystemImage.alt };
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
 * Activity card in category grid - responsive layout
 */
function ActivityCard({ activity }: { activity: typeof activityPrimitives[0] }) {
  const config = CATEGORY_CONFIG[activity.category];
  const effortDisplay = getEffortDisplay(activity.physical_effort);
  const image = getActivityImage(activity.id, config.imageIndex);

  return (
    <Link
      href={`/activities/${activity.id}`}
      className="group block bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-amber-300 hover:shadow-md transition-all"
      data-testid="activity-card"
    >
      {/* Vertical on mobile, horizontal on larger screens */}
      <div className="flex flex-col sm:flex-row">
        {/* Image - taller on mobile, thumbnail on desktop */}
        <div className="w-full h-32 sm:w-24 sm:h-28 flex-shrink-0 overflow-hidden">
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 p-3">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-editorial text-base font-semibold text-stone-900 group-hover:text-amber-700 transition-colors">
              {activity.name}
            </h3>
            <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
          </div>
          <p className="text-stone-500 text-sm line-clamp-2 mb-2">{activity.what_it_is}</p>
          <div className="flex items-center gap-2 text-xs">
            <span className={`px-2 py-0.5 rounded-full ${effortDisplay.color}`}>
              {effortDisplay.label}
            </span>
            <span className="text-stone-400">
              {activity.where_possible.length} destinations
            </span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
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
                Vurara Safaris
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
              From game drives to gorilla trekking.
              <br className="hidden md:block" />
              Each has its character, demands, and rewards.
            </p>
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


      {/* Sticky category navigation */}
      <nav className="sticky top-0 z-40 bg-white border-b border-stone-200 py-3" aria-label="Activity categories">
        <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide" data-testid="category-nav">
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wide whitespace-nowrap hidden sm:block">Categories</span>
            {categories.map((category) => (
              <CategoryNavChip
                key={category}
                category={category}
                count={groupedActivities[category].length}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 md:px-8 py-10">

        {/* Category sections with inline CTA */}
        <div className="space-y-8" data-testid="category-sections">
          {categories.map((category, index) => (
            <div key={category}>
              <CategorySection
                category={category}
                activities={groupedActivities[category]}
              />
              {/* CTA after first category */}
              {index === 0 && (
                <div className="mt-8 bg-gradient-to-r from-amber-50 to-stone-50 rounded-xl border border-amber-200/50 p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-stone-900 font-medium">
                        We'll build an itinerary with the right activity mix for you
                      </p>
                      <p className="text-stone-500 text-sm mt-0.5">
                        Tell us what matters most to you
                      </p>
                    </div>
                    <Link
                      href="/inquire"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors text-sm whitespace-nowrap"
                    >
                      Plan your safari
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer variant="operator" />
    </main>
  );
}
