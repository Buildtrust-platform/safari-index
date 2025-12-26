/**
 * Itineraries Hub Page
 *
 * Production-ready itinerary discovery page.
 * Displays all published itineraries with filtering by region and style.
 *
 * Per governance:
 * - Documentary, calm, operator-grade tone
 * - No hype words, emojis, or exclamation marks
 * - Links to decision system, not booking
 * - No pricing - cost bands only
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import {
  MapPin,
  Calendar,
  ChevronRight,
  ArrowRight,
  Compass,
  Clock,
  DollarSign,
} from 'lucide-react';
import { Navbar, Footer } from '../components/layout';
import { ImageBand, ImageBandContent, ecosystemImages } from '../components/visual';
import { SearchAndFilters } from '../components/SearchAndFilters';
import {
  getAllItineraries,
  getFeaturedItineraries,
  getItinerarySummaries,
  formatDurationBand,
  type ItinerarySummary,
} from '../content/itineraries';
import { formatCostBand, getRegionDisplayName, getComfortTierDisplay } from '../content/trip-shapes/trips';

export const metadata: Metadata = {
  title: 'Safari Itineraries | Safari Index',
  description:
    'Production-ready safari itineraries across Tanzania, Kenya, Botswana, Namibia, Uganda, Rwanda, and South Africa. Decision-backed routes with clear trade-offs.',
  robots: 'index, follow',
  alternates: {
    canonical: '/itineraries',
  },
  openGraph: {
    title: 'Safari Itineraries | Safari Index',
    description:
      'Explore 15 safari itineraries from classic Serengeti circuits to gorilla treks. Each route is decision-backed with clear trade-offs.',
    type: 'website',
    url: '/itineraries',
  },
};

/**
 * Style tag display configuration
 */
const STYLE_DISPLAY: Record<string, { label: string; color: string }> = {
  'first-safari': { label: 'First Safari', color: 'bg-green-100 text-green-700' },
  migration: { label: 'Migration', color: 'bg-amber-100 text-amber-700' },
  family: { label: 'Family', color: 'bg-blue-100 text-blue-700' },
  luxury: { label: 'Luxury', color: 'bg-purple-100 text-purple-700' },
  value: { label: 'Value', color: 'bg-emerald-100 text-emerald-700' },
  adventure: { label: 'Adventure', color: 'bg-orange-100 text-orange-700' },
  honeymoon: { label: 'Honeymoon', color: 'bg-pink-100 text-pink-700' },
  photography: { label: 'Photography', color: 'bg-indigo-100 text-indigo-700' },
  walking: { label: 'Walking', color: 'bg-teal-100 text-teal-700' },
  primate: { label: 'Primate', color: 'bg-lime-100 text-lime-700' },
  'self-drive': { label: 'Self-Drive', color: 'bg-slate-100 text-slate-700' },
  'fly-in': { label: 'Fly-In', color: 'bg-sky-100 text-sky-700' },
  'beach-combo': { label: 'Beach Combo', color: 'bg-cyan-100 text-cyan-700' },
};

/**
 * Style tag badge component
 */
function StyleBadge({ style }: { style: string }) {
  const config = STYLE_DISPLAY[style] || { label: style, color: 'bg-stone-100 text-stone-600' };
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
}

/**
 * Itinerary card component
 */
function ItineraryCard({ itinerary }: { itinerary: ItinerarySummary }) {
  const regionName = getRegionDisplayName(itinerary.region);
  const tierDisplay = getComfortTierDisplay(itinerary.comfort_tier);

  return (
    <Link
      href={`/itineraries/${itinerary.slug}`}
      prefetch={false}
      className="group block bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-amber-300 hover:shadow-lg transition-all"
      data-testid="itinerary-card"
    >
      {/* Image placeholder */}
      <div className="relative h-40 bg-gradient-to-br from-stone-200 to-stone-300 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Compass className="w-12 h-12 text-stone-400/50" />
        </div>
        {itinerary.is_featured && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 text-xs font-medium bg-amber-500 text-white rounded-full">
              Featured
            </span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <p className="text-white/80 text-sm flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {regionName}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-editorial text-lg font-semibold text-stone-900 mb-1 group-hover:text-amber-700 transition-colors">
          {itinerary.title}
        </h3>
        <p className="text-stone-500 text-sm mb-4 line-clamp-2">
          {itinerary.subtitle}
        </p>

        {/* Style tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {itinerary.style_tags.slice(0, 3).map((tag) => (
            <StyleBadge key={tag} style={tag} />
          ))}
        </div>

        {/* Meta row */}
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

        {/* Tier and CTA */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-stone-500 uppercase tracking-wide">
            {tierDisplay}
          </span>
          <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  );
}

/**
 * Featured itinerary card (larger)
 */
function FeaturedItineraryCard({ itinerary }: { itinerary: ItinerarySummary }) {
  const regionName = getRegionDisplayName(itinerary.region);

  return (
    <Link
      href={`/itineraries/${itinerary.slug}`}
      prefetch={false}
      className="group block bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-amber-300 hover:shadow-lg transition-all"
      data-testid="featured-itinerary-card"
    >
      <div className="flex flex-col md:flex-row">
        {/* Image placeholder */}
        <div className="relative h-48 md:h-auto md:w-72 bg-gradient-to-br from-stone-200 to-stone-300 flex-shrink-0">
          <div className="absolute inset-0 flex items-center justify-center">
            <Compass className="w-16 h-16 text-stone-400/50" />
          </div>
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 text-xs font-medium bg-amber-500 text-white rounded-full">
              Featured
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1">
          <div className="flex items-center gap-2 text-sm text-stone-500 mb-2">
            <MapPin className="w-4 h-4" />
            {regionName}
          </div>

          <h3 className="font-editorial text-xl font-semibold text-stone-900 mb-2 group-hover:text-amber-700 transition-colors">
            {itinerary.title}
          </h3>
          <p className="text-stone-600 mb-4">
            {itinerary.subtitle}
          </p>

          {/* Style tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {itinerary.style_tags.map((tag) => (
              <StyleBadge key={tag} style={tag} />
            ))}
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-6 text-sm text-stone-600">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-stone-400" />
              {formatDurationBand(itinerary.duration_band)}
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-stone-400" />
              {formatCostBand(itinerary.cost_band)}
            </div>
            <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all ml-auto" />
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Region group component
 */
function RegionGroup({
  region,
  itineraries,
}: {
  region: string;
  itineraries: ItinerarySummary[];
}) {
  const regionName = getRegionDisplayName(region as any) || region;

  return (
    <section className="mb-12" data-testid={`region-${region}`}>
      <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-2">
        {regionName}
      </h2>
      <p className="text-stone-500 text-sm mb-6">
        {itineraries.length} {itineraries.length === 1 ? 'itinerary' : 'itineraries'}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {itineraries.map((itinerary) => (
          <ItineraryCard key={itinerary.id} itinerary={itinerary} />
        ))}
      </div>
    </section>
  );
}

export default function ItinerariesPage() {
  const allItineraries = getItinerarySummaries();
  const featuredItineraries = allItineraries.filter((i) => i.is_featured);

  // Group by primary region
  const regionGroups: Record<string, ItinerarySummary[]> = {};
  allItineraries.forEach((itinerary) => {
    const region = itinerary.region;
    if (!regionGroups[region]) {
      regionGroups[region] = [];
    }
    regionGroups[region].push(itinerary);
  });

  // Order regions
  const regionOrder = ['tanzania', 'kenya', 'botswana', 'uganda-rwanda', 'namibia', 'south-africa'];
  const orderedRegions = regionOrder.filter((r) => regionGroups[r]?.length > 0);

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
              <span className="text-white">Itineraries</span>
            </div>

            {/* Icon + Title */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Compass className="w-6 h-6 text-amber-400" />
              </div>
              <h1
                className="font-editorial text-4xl md:text-5xl font-semibold text-white"
                data-testid="itineraries-h1"
              >
                Safari Itineraries
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              {allItineraries.length} curated routes across Africa.
              <br className="hidden md:block" />
              Each itinerary is decision-backed with clear trade-offs.
            </p>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Search Section */}
      <section className="bg-white py-8 border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <SearchAndFilters
            context="trips"
            placeholder="Search itineraries... e.g., 'migration', 'gorilla', or 'honeymoon'"
            compact
          />
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {/* Orientation paragraph */}
        <div className="mb-8">
          <p className="text-stone-600 leading-relaxed">
            Each itinerary represents a proven route through Africa's safari destinations.
            They are starting points, not fixed products. Segments can be adjusted,
            accommodation tiers changed, and extensions added based on your decisions
            and preferences.
          </p>
        </div>

        {/* Featured itineraries */}
        {featuredItineraries.length > 0 && (
          <section className="mb-12" data-testid="featured-itineraries">
            <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-2">
              Featured Itineraries
            </h2>
            <p className="text-stone-500 text-sm mb-6">
              Popular routes for first-time planners
            </p>
            <div className="space-y-4">
              {featuredItineraries.map((itinerary) => (
                <FeaturedItineraryCard key={itinerary.id} itinerary={itinerary} />
              ))}
            </div>
          </section>
        )}

        {/* By region */}
        {orderedRegions.map((region) => (
          <RegionGroup
            key={region}
            region={region}
            itineraries={regionGroups[region]}
          />
        ))}

        {/* CTA section */}
        <div className="mt-12 pt-8 border-t border-stone-200">
          <div className="bg-stone-900 rounded-xl p-6 text-center">
            <h3 className="font-editorial text-xl text-white mb-2">
              Not seeing what you need?
            </h3>
            <p className="text-stone-400 text-sm mb-4 max-w-md mx-auto">
              Share your preferences and we'll design a custom itinerary around your decisions.
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
