/**
 * Safaris Hub Page
 *
 * Safari Index-operated itinerary shapes. Each is custom-built around
 * traveler decisions and preferences.
 *
 * Per governance: documentary, calm, safari-native tone. No hype, emojis,
 * or exclamation marks. Clear operator positioning.
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import {
  MapPin,
  Calendar,
  Compass,
  ArrowRight,
  ChevronRight,
  Map,
  DollarSign,
  Sparkles,
  Globe,
  Route,
  FileText,
} from 'lucide-react';
import {
  getAllTrips,
  formatDuration,
  getRegionDisplayName,
  getComfortTierDisplay,
  formatCostBand,
  type TripArchetype,
  type RegionTag,
  type ComfortTier,
} from '../content/trip-shapes/trips';
import { ImageBand, ImageBandContent, ecosystemImages, getDestinationImage } from '../components/visual';
import { Navbar, Footer } from '../components/layout';
import { SearchAndFilters } from '../components/SearchAndFilters';

/**
 * SEO Metadata
 */
export const metadata: Metadata = {
  title: 'Private Safaris | Safari Index',
  description:
    'Private safaris operated by Safari Index. 20 itinerary shapes across East and Southern Africa, each custom-built around your decisions.',
  robots: 'index, follow',
  alternates: {
    canonical: '/trips',
  },
  openGraph: {
    title: 'Private Safaris | Safari Index',
    description:
      'Safari Index operates private safaris across Africa. From classic Serengeti circuits to gorilla treks and self-drive adventures.',
    type: 'website',
    url: '/trips',
  },
};

/**
 * Region filter chips configuration
 */
const REGION_FILTERS: { value: RegionTag; label: string }[] = [
  { value: 'east-africa', label: 'East Africa' },
  { value: 'southern-africa', label: 'Southern Africa' },
  { value: 'uganda-rwanda', label: 'Uganda & Rwanda' },
  { value: 'tanzania', label: 'Tanzania' },
  { value: 'kenya', label: 'Kenya' },
  { value: 'botswana', label: 'Botswana' },
  { value: 'south-africa', label: 'South Africa' },
  { value: 'namibia', label: 'Namibia' },
];

/**
 * Comfort tier filters
 */
const COMFORT_FILTERS: { value: ComfortTier; label: string }[] = [
  { value: 'budget', label: 'Budget' },
  { value: 'mid', label: 'Mid-range' },
  { value: 'luxury', label: 'Luxury' },
];

/**
 * Duration filter options
 */
const DURATION_FILTERS = [
  { value: 'short', label: '4-7 days' },
  { value: 'medium', label: '8-10 days' },
  { value: 'long', label: '11+ days' },
];

/**
 * Get image for trip based on primary region
 */
function getTripImage(regions: RegionTag[]): { src: string; alt: string } {
  // Find first specific country/region
  const regionMap: Record<string, string> = {
    'tanzania': 'tanzania',
    'kenya': 'kenya',
    'botswana': 'botswana',
    'south-africa': 'south-africa',
    'namibia': 'namibia',
    'uganda-rwanda': 'rwanda',
    'zambia': 'zambia',
    'zimbabwe': 'zimbabwe',
  };

  for (const region of regions) {
    if (regionMap[region]) {
      const destImage = getDestinationImage(regionMap[region]);
      return { src: destImage.src, alt: destImage.alt };
    }
  }

  // Fallback to Tanzania
  const fallback = getDestinationImage('tanzania');
  return { src: fallback.src, alt: fallback.alt };
}

/**
 * Trip card component
 */
function TripCard({ trip }: { trip: TripArchetype }) {
  const regions = trip.regions
    .filter((r) => !['east-africa', 'southern-africa'].includes(r))
    .slice(0, 2)
    .map((r) => getRegionDisplayName(r))
    .join(', ') || getRegionDisplayName(trip.regions[0]);

  const image = getTripImage(trip.regions);

  return (
    <Link
      href={`/trips/${trip.id}`}
      className="group block bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md hover:border-amber-300 transition-all"
      data-testid={`trip-card-${trip.id}`}
      prefetch={false}
    >
      {/* Trip image */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={image.src}
          alt={image.alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <div className="flex items-center gap-1.5 text-white/90 text-xs font-medium">
            <MapPin className="w-3 h-3" />
            {regions}
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h2 className="font-editorial text-lg font-semibold text-stone-900 group-hover:text-amber-800 transition-colors mb-1">
              {trip.title}
            </h2>
            <p className="text-stone-500 text-sm line-clamp-1">{trip.subtitle}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-stone-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-4" />
        </div>

        {/* Snapshot strip */}
        <div className="flex flex-wrap gap-3 text-xs text-stone-500 mt-3 pt-3 border-t border-stone-100" data-testid="trip-snapshot">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDuration(trip.duration_days)}
          </span>
          <span className="flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            {getComfortTierDisplay(trip.comfort_tier)}
          </span>
          <span className="flex items-center gap-1" title={trip.cost_band.note}>
            <DollarSign className="w-3.5 h-3.5" />
            {formatCostBand(trip.cost_band)}
          </span>
        </div>

        {/* Traveler fit tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {trip.traveler_fit.slice(0, 3).map((fit) => (
            <span
              key={fit}
              className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs rounded-full"
            >
              {fit.replace('-', ' ')}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

/**
 * Region section configuration
 */
const REGION_SECTIONS = [
  {
    id: 'east-africa',
    name: 'East Africa',
    description: 'Tanzania, Kenya, and the Great Migration circuit',
    imageIndex: 0, // savannah-morning
  },
  {
    id: 'southern-africa',
    name: 'Southern Africa',
    description: 'Botswana, South Africa, Namibia, Zambia, and Zimbabwe',
    imageIndex: 1, // delta-channels
  },
  {
    id: 'uganda-rwanda',
    name: 'Uganda & Rwanda',
    description: 'Mountain gorillas and primate-focused safaris',
    imageIndex: 3, // montane-forest
  },
  {
    id: 'special',
    name: 'Special Interest',
    description: 'Photography, honeymoon, family, and budget-focused trips',
    imageIndex: 5, // kopje-landscape
  },
];

/**
 * Region section with visual header
 */
function RegionSection({
  section,
  trips,
}: {
  section: typeof REGION_SECTIONS[0];
  trips: TripArchetype[];
}) {
  const bgImage = ecosystemImages[section.imageIndex];

  if (trips.length === 0) return null;

  return (
    <section id={section.id} className="scroll-mt-24" data-testid={`region-section-${section.id}`}>
      {/* Region header with image */}
      <div className="relative rounded-t-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-900/70 to-stone-900/50 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage.src})` }}
        />
        <div className="relative z-20 p-5 md:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Globe className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="font-editorial text-lg font-semibold text-white">
                {section.name}
              </h2>
              <p className="text-white/70 text-sm">{section.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trips grid */}
      <div className="bg-white rounded-b-2xl border border-t-0 border-stone-200 p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Trips Hub Page
 */
export default function TripsHubPage() {
  const allTrips = getAllTrips();

  // Group trips by primary region for display
  const eastAfricaTrips = allTrips.filter(
    (t) => t.regions.includes('east-africa') || t.regions.includes('tanzania') || t.regions.includes('kenya')
  );
  const southernAfricaTrips = allTrips.filter(
    (t) =>
      (t.regions.includes('southern-africa') ||
        t.regions.includes('botswana') ||
        t.regions.includes('south-africa') ||
        t.regions.includes('namibia') ||
        t.regions.includes('zambia') ||
        t.regions.includes('zimbabwe')) &&
      !t.regions.includes('east-africa')
  );
  const ugandaRwandaTrips = allTrips.filter((t) => t.regions.includes('uganda-rwanda'));
  const specialTrips = allTrips.filter(
    (t) =>
      t.traveler_fit.includes('photography') ||
      t.traveler_fit.includes('honeymoon') ||
      t.traveler_fit.includes('multigenerational') ||
      t.id.includes('budget')
  );

  // Featured trips (first 6 for featured section)
  const featuredTrips = allTrips.slice(0, 6);

  // All region sections with their trips
  const regionData = [
    { section: REGION_SECTIONS[0], trips: eastAfricaTrips },
    { section: REGION_SECTIONS[1], trips: southernAfricaTrips },
    { section: REGION_SECTIONS[2], trips: ugandaRwandaTrips },
    { section: REGION_SECTIONS[3], trips: specialTrips },
  ].filter((r) => r.trips.length > 0);

  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar variant="transparent" />

      {/* Hero */}
      <ImageBand
        image={ecosystemImages[1]} // delta-channels
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
              <span className="text-white">Safaris</span>
            </div>

            {/* Operator badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white/80 bg-white/10 rounded-full mb-4">
              <Compass className="w-3 h-3" />
              Safari Index Operated
            </span>

            {/* Icon + Title */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Map className="w-6 h-6 text-amber-400" />
              </div>
              <h1
                className="font-editorial text-4xl md:text-5xl font-semibold text-white"
                data-testid="trips-h1"
              >
                Private Safaris
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              {allTrips.length} itinerary shapes across East and Southern Africa.
              <br className="hidden md:block" />
              Each is custom-built around your decisions.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 mt-6 text-white/60 text-sm">
              <span>{allTrips.length} safaris</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>{regionData.length} categories</span>
            </div>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Search Section */}
      <section className="bg-white py-6 border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <SearchAndFilters
            context="trips"
            placeholder="Search safaris... e.g., 'migration' or 'honeymoon'"
            compact
          />
        </div>
      </section>

      {/* Tab Navigation - Switch between Trip Shapes and Itineraries */}
      <section className="bg-stone-50 border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <nav className="flex gap-1" aria-label="Safari content type">
            <Link
              href="/trips"
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-amber-700 border-b-2 border-amber-600 bg-white -mb-px rounded-t-lg"
              aria-current="page"
            >
              <Route className="w-4 h-4" />
              Trip Shapes
              <span className="text-xs text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">
                {allTrips.length}
              </span>
            </Link>
            <Link
              href="/itineraries"
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-stone-500 hover:text-stone-700 hover:bg-white/50 rounded-t-lg transition-colors"
            >
              <FileText className="w-4 h-4" />
              Day-by-Day Itineraries
            </Link>
          </nav>
        </div>
      </section>

      {/* Featured Safaris */}
      <section className="bg-white py-10 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="font-editorial text-xl font-semibold text-stone-900">
                Popular Safaris
              </h2>
              <p className="text-stone-500 text-sm">Most requested itinerary shapes</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        {/* Region navigation */}
        <nav className="mb-8" aria-label="Safari categories">
          <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">
            Browse by category
          </h2>
          <div className="flex flex-wrap gap-2" data-testid="region-nav">
            {regionData.map(({ section, trips }) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 bg-white rounded-lg border border-stone-200 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 transition-colors whitespace-nowrap shadow-sm"
              >
                <Globe className="w-4 h-4" />
                <span>{section.name}</span>
                <span className="text-xs text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                  {trips.length}
                </span>
              </a>
            ))}
          </div>
        </nav>

        {/* Region sections */}
        <div className="space-y-8">
          {regionData.map(({ section, trips }) => (
            <RegionSection key={section.id} section={section} trips={trips} />
          ))}
        </div>

        {/* CTA section */}
        <div className="mt-12 pt-8 border-t border-stone-200">
          <div className="bg-stone-900 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="font-editorial text-xl text-white mb-2">
                  Ready to plan your safari?
                </h3>
                <p className="text-stone-400 text-sm">
                  Tell us about your trip and we'll build a custom itinerary.
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
