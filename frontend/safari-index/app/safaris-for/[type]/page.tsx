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
import { getPublishedItineraries, formatDurationBand, type ItinerarySummary } from '../../content/itineraries';
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
  filterFn: (itinerary: ItinerarySummary) => boolean;
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
    filterFn: (it) => it.style_tags.includes('first-safari') || it.traveler_fit.includes('first-safari'),
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
    filterFn: (it) => it.style_tags.includes('family') || it.traveler_fit.includes('family'),
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
    filterFn: (it) => it.style_tags.includes('photography') || it.traveler_fit.includes('photography'),
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
    filterFn: (it) => it.style_tags.includes('honeymoon') || it.style_tags.includes('luxury') || it.traveler_fit.includes('honeymoon'),
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
    filterFn: (it) => it.style_tags.includes('adventure') || it.style_tags.includes('walking') || it.traveler_fit.includes('repeat-visitor') || it.traveler_fit.includes('adventure'),
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
    filterFn: (it) => it.style_tags.includes('primate') || it.style_tags.includes('migration') || it.style_tags.includes('walking') || it.style_tags.includes('birding'),
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

  const allItineraries = getPublishedItineraries();
  const filteredItineraries = allItineraries.filter(config.filterFn);
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
              <span className="text-white">{config.title.replace('Safaris for ', '')}</span>
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

      {/* Expectations and Considerations */}
      <section className="bg-white py-8 border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* What to expect */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <h2 className="font-semibold text-stone-900">What to Expect</h2>
              </div>
              <ul className="space-y-2">
                {config.expectations.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-stone-600">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Considerations */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                </div>
                <h2 className="font-semibold text-stone-900">Things to Consider</h2>
              </div>
              <ul className="space-y-2">
                {config.considerations.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-stone-600">
                    <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Itineraries */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        <div className="mb-8">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-2">
            Recommended Itineraries
          </h2>
          <p className="text-stone-600">
            {filteredItineraries.length} itineraries matched to {config.subtitle.toLowerCase()}
          </p>
        </div>

        {filteredItineraries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItineraries.map((itinerary) => (
              <ItineraryCard key={itinerary.id} itinerary={itinerary} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
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

        {/* CTA section */}
        <div className="mt-12 bg-stone-900 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="font-editorial text-xl text-white mb-2">
                Need something more specific?
              </h3>
              <p className="text-stone-400 text-sm">
                These itineraries are starting points. Share your preferences and we will customize.
              </p>
            </div>
            <Link
              href="/inquire"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-stone-900 font-medium rounded-lg hover:bg-stone-100 transition-colors"
            >
              Start planning
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            href="/safaris-for"
            className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-700 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            View all traveler types
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
