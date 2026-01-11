/**
 * Safaris For [Type] - Dynamic Traveler-Focused Landing Pages
 *
 * Filtered itinerary pages for specific traveler types:
 * - first-timers
 * - families
 * - photographers
 * - honeymooners
 * - repeat-visitors
 * - special-interests
 *
 * Per governance:
 * - Documentary, calm tone
 * - Clear trade-offs and expectations
 * - No hype or exclamation marks
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  ChevronRight,
  ArrowRight,
  Clock,
  DollarSign,
  MapPin,
  Check,
  AlertCircle,
  Compass,
  Users,
  Camera,
  Heart,
  Mountain,
  Bird,
} from 'lucide-react';
import { Navbar, Footer } from '../../components/layout';
import { ImageBand, ImageBandContent, ecosystemImages, getDestinationImage } from '../../components/visual';
import { getItinerarySummaries, formatDurationBand, type ItinerarySummary, type ItineraryStyleTag } from '../../content/itineraries';
import { formatCostBand, getRegionDisplayName } from '../../content/trip-shapes/trips';

// Traveler type configurations
const TRAVELER_CONFIGS: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  icon: typeof Compass;
  color: string;
  iconColor: string;
  heroText: string;
  styleTags: ItineraryStyleTag[];
  expectations: string[];
  considerations: string[];
  metaDescription: string;
}> = {
  'first-timers': {
    title: 'Safaris for First-Timers',
    subtitle: 'Get it right the first time',
    description: 'Itineraries designed for travelers experiencing their first African safari. Proven routes, reliable wildlife, and guides who specialize in first-timer questions.',
    icon: Compass,
    color: 'bg-green-100',
    iconColor: 'text-green-600',
    heroText: 'Your first safari should be memorable for the right reasons. These itineraries prioritize reliability, balanced pacing, and iconic wildlife encounters.',
    styleTags: ['first-safari'],
    expectations: [
      'Iconic parks with high wildlife density',
      'Guides experienced with first-timer questions',
      'Balanced daily schedule with rest time',
      'Mid-range to premium accommodations',
      'Clear logistics and transfers',
    ],
    considerations: [
      'Popular parks may have other vehicles at sightings',
      'Peak seasons book up 6-12 months ahead',
      'Some flexibility traded for reliability',
    ],
    metaDescription: 'Safaris designed for first-time travelers. Proven itineraries with reliable wildlife, balanced pacing, and guides who specialize in first-timer questions.',
  },
  'families': {
    title: 'Safaris for Families',
    subtitle: 'Adventures for all ages',
    description: 'Family-friendly itineraries with child-appropriate activities, flexible schedules, and lodges that welcome young travelers.',
    icon: Users,
    color: 'bg-blue-100',
    iconColor: 'text-blue-600',
    heroText: 'Family safaris require different logistics. These itineraries include child-friendly lodges, appropriate activity levels, and experiences that engage all ages.',
    styleTags: ['family'],
    expectations: [
      'Lodges with family rooms or connecting units',
      'Child-friendly game drives and activities',
      'Flexible meal times and dietary options',
      'Malaria-free options available',
      'Shorter travel days between destinations',
    ],
    considerations: [
      'Some luxury camps have minimum age requirements',
      'Walking safaris typically 12+ or 16+ only',
      'Peak school holiday periods book early',
    ],
    metaDescription: 'Family safari itineraries with child-friendly lodges, flexible schedules, and activities that engage all ages. Malaria-free options available.',
  },
  'photographers': {
    title: 'Safaris for Photographers',
    subtitle: 'Light, position, patience',
    description: 'Itineraries built around photography priorities: private vehicles, extended sighting time, optimal light windows, and guides who understand composition.',
    icon: Camera,
    color: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    heroText: 'Photography safaris are about time at sightings, not distance covered. These itineraries prioritize light, position, and the patience to wait for the shot.',
    styleTags: ['photography'],
    expectations: [
      'Private vehicle with no sharing',
      'Extended time at sightings (no "tick and move")',
      'Early starts for golden hour light',
      'Guides who understand photographer needs',
      'Camps positioned for proximity to wildlife',
    ],
    considerations: [
      'Higher cost due to private vehicle requirement',
      'Less ground covered per day',
      'May require longer overall trip duration',
    ],
    metaDescription: 'Photography safari itineraries with private vehicles, extended sighting time, golden hour focus, and guides who understand photographer needs.',
  },
  'honeymooners': {
    title: 'Safaris for Honeymooners',
    subtitle: 'Romance in the wild',
    description: 'Intimate safari experiences designed for couples. Private dining, romantic camps, and moments crafted for two.',
    icon: Heart,
    color: 'bg-pink-100',
    iconColor: 'text-pink-600',
    heroText: 'A honeymoon safari is not just a trip. These itineraries combine wildlife adventure with intimate experiences designed for couples.',
    styleTags: ['honeymoon', 'luxury'],
    expectations: [
      'Intimate camps with private experiences',
      'Private dining options (bush dinners, sundowners)',
      'Romantic room categories and turndown service',
      'Beach extension options for relaxation',
      'Flexible scheduling for couples',
    ],
    considerations: [
      'Premium pricing for intimate properties',
      'Some experiences weather-dependent',
      'Popular honeymoon months book early',
    ],
    metaDescription: 'Honeymoon safari itineraries with intimate camps, private dining, romantic experiences, and optional beach extensions.',
  },
  'repeat-visitors': {
    title: 'Safaris for Repeat Visitors',
    subtitle: 'Beyond the classics',
    description: 'For travelers who know Africa and want something different. Remote reserves, walking safaris, specialist guides, and destinations off the main circuit.',
    icon: Mountain,
    color: 'bg-amber-100',
    iconColor: 'text-amber-600',
    heroText: 'You have done the classics. These itineraries take you to remote corners, offer walking and specialist experiences, and reward those who already understand Africa.',
    styleTags: ['adventure', 'walking'],
    expectations: [
      'Remote reserves with lower visitor density',
      'Walking safari components',
      'Specialist guides with deep expertise',
      'Less structured daily schedules',
      'Unique accommodation styles (mobile, treehouse)',
    ],
    considerations: [
      'Remote locations require charter flights',
      'Higher physical fitness requirements for walking',
      'Less predictable wildlife compared to classic parks',
    ],
    metaDescription: 'Safari itineraries for experienced travelers. Remote reserves, walking safaris, specialist guides, and destinations beyond the classic circuit.',
  },
  'special-interests': {
    title: 'Special Interest Safaris',
    subtitle: 'Gorillas, migration, walking',
    description: 'Safaris defined by a specific experience: primate tracking, witnessing the migration, walking in big game country, or birding expeditions.',
    icon: Bird,
    color: 'bg-teal-100',
    iconColor: 'text-teal-600',
    heroText: 'Some travelers have a specific goal. These itineraries are built around signature experiences that define the trip.',
    styleTags: ['primate', 'migration', 'walking'],
    expectations: [
      'Itinerary structured around the core experience',
      'Timing aligned with wildlife/seasonal patterns',
      'Specialist guides for the activity',
      'Permit bookings handled in advance',
      'Supporting activities that complement the focus',
    ],
    considerations: [
      'Timing often non-negotiable (migration, permits)',
      'Weather can impact specific experiences',
      'May require booking 12+ months ahead',
    ],
    metaDescription: 'Special interest safari itineraries for gorilla tracking, Great Migration, walking safaris, and birding expeditions.',
  },
};

// Itinerary card with image
const itineraryImageMap: Record<string, { src: string; alt: string }> = {
  'tanzania-classic-northern-circuit': { src: '/images/library/destinations/zebras-wildebeest-ngorongoro.jpg', alt: 'Zebras and wildebeest in Ngorongoro' },
  'tanzania-great-migration': { src: '/images/activities/migration.jpg', alt: 'Great Migration river crossing' },
  'kenya-classic-safari': { src: '/images/library/wildlife/lion-portrait.jpg', alt: 'Lion in Masai Mara' },
  'kenya-family-friendly': { src: '/images/library/birding/family-camping-safari.jpg', alt: 'Family on safari' },
  'botswana-okavango-delta': { src: '/images/destinations/botswana-delta.jpg', alt: 'Okavango Delta' },
  'uganda-gorillas-and-wildlife': { src: '/images/activities/gorilla-trekking.jpg', alt: 'Gorilla trekking' },
  'rwanda-gorilla-trek': { src: '/images/destinations/rwanda-volcanoes.jpg', alt: 'Volcanoes National Park' },
  'zambia-walking-safari': { src: '/images/destinations/zambia-luangwa.jpg', alt: 'Walking safari in South Luangwa' },
};

function getItineraryImage(slug: string, region: string): { src: string; alt: string } {
  if (itineraryImageMap[slug]) return itineraryImageMap[slug];
  const destImage = getDestinationImage(region === 'uganda-rwanda' ? 'rwanda' : region);
  return { src: destImage.src, alt: destImage.alt };
}

function ItineraryCard({ itinerary }: { itinerary: ItinerarySummary }) {
  const regionName = getRegionDisplayName(itinerary.region);
  const image = getItineraryImage(itinerary.slug, itinerary.region);

  return (
    <Link
      href={`/itineraries/${itinerary.slug}`}
      className="group block bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-amber-300 hover:shadow-lg transition-all"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={image.src}
          alt={image.alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white/90 text-sm flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5" />
            {regionName}
          </p>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-editorial text-lg font-semibold text-stone-900 mb-1 group-hover:text-amber-700 transition-colors">
          {itinerary.title}
        </h3>
        <p className="text-stone-500 text-sm mb-4 line-clamp-2">
          {itinerary.subtitle}
        </p>

        <div className="flex items-center gap-4 text-sm text-stone-600 pt-3 border-t border-stone-100">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-stone-400" />
            {formatDurationBand(itinerary.duration_band)}
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-stone-400" />
            {formatCostBand(itinerary.cost_band)}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-stone-500 uppercase tracking-wide">
            View itinerary
          </span>
          <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  );
}

export async function generateStaticParams() {
  return Object.keys(TRAVELER_CONFIGS).map((type) => ({ type }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const config = TRAVELER_CONFIGS[type];

  if (!config) {
    return { title: 'Not Found' };
  }

  return {
    title: `${config.title} | Vurara Safaris`,
    description: config.metaDescription,
    robots: 'index, follow',
    alternates: {
      canonical: `/safaris-for/${type}`,
    },
    openGraph: {
      title: `${config.title} | Vurara Safaris`,
      description: config.metaDescription,
      type: 'website',
      url: `/safaris-for/${type}`,
    },
  };
}

export default async function SafarisForTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const config = TRAVELER_CONFIGS[type];

  if (!config) {
    notFound();
  }

  // Get all itineraries and filter by style tags
  const allItineraries = getItinerarySummaries();
  const filteredItineraries = allItineraries.filter((it) =>
    config.styleTags.some((tag) => it.style_tags.includes(tag))
  );

  const Icon = config.icon;

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
              <Link href="/safaris-for" className="hover:text-white transition-colors">
                Safaris For You
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{config.title.replace('Safaris for ', '').replace('Special Interest ', '')}</span>
            </div>

            <div className="flex items-center justify-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl ${config.color} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${config.iconColor}`} />
              </div>
              <h1 className="font-editorial text-3xl md:text-4xl font-semibold text-white">
                {config.title}
              </h1>
            </div>

            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              {config.heroText}
            </p>

            <div className="flex items-center justify-center gap-4 mt-6 text-white/60 text-sm">
              <span>{filteredItineraries.length} itineraries</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>Curated for {config.subtitle.toLowerCase()}</span>
            </div>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Advisory Panel - Expectations + Considerations */}
      <section className="bg-white py-6 border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="bg-stone-50 rounded-xl overflow-hidden">
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200">
              {/* What to expect */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Check className="w-4 h-4 text-green-600" />
                  <h2 className="text-sm font-medium text-green-800">What to expect</h2>
                </div>
                <ul className="space-y-1.5">
                  {config.expectations.slice(0, 4).map((item, index) => (
                    <li key={index} className="text-sm text-stone-600">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Considerations */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <h2 className="text-sm font-medium text-amber-800">Things to consider</h2>
                </div>
                <ul className="space-y-1.5">
                  {config.considerations.map((item, index) => (
                    <li key={index} className="text-sm text-stone-600">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        {/* Inline CTA - before itineraries */}
        <div className="mb-8 bg-gradient-to-r from-amber-50 to-stone-50 rounded-xl border border-amber-200/50 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-stone-900 font-medium">
                Want a personalized recommendation?
              </p>
              <p className="text-stone-500 text-sm mt-0.5">
                Tell us your priorities and we'll suggest the right itinerary
              </p>
            </div>
            <Link
              href="/inquire"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors text-sm whitespace-nowrap"
            >
              Start planning
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Itineraries */}
        <div className="mb-6">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-1">
            Recommended Itineraries
          </h2>
          <p className="text-stone-500 text-sm">
            {filteredItineraries.length} itineraries matched to {config.subtitle.toLowerCase()}
          </p>
        </div>

        {filteredItineraries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItineraries.map((itinerary) => (
              <ItineraryCard key={itinerary.id} itinerary={itinerary} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-stone-200">
            <p className="text-stone-600 mb-4">
              We are building itineraries for this category.
            </p>
            <Link
              href="/inquire"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
            >
              Tell us what you need
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Browse other types */}
        <div className="mt-10 pt-6 border-t border-stone-200 text-center">
          <Link
            href="/safaris-for"
            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-amber-700 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Browse other traveler types
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
