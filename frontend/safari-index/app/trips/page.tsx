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
import { ImageBand, ImageBandContent, ecosystemImages } from '../components/visual';
import { Navbar } from '../components/layout';

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
 * Trip card component
 */
function TripCard({ trip }: { trip: TripArchetype }) {
  const regions = trip.regions
    .filter((r) => !['east-africa', 'southern-africa'].includes(r))
    .slice(0, 2)
    .map((r) => getRegionDisplayName(r))
    .join(', ') || getRegionDisplayName(trip.regions[0]);

  return (
    <Link
      href={`/trips/${trip.id}`}
      className="group block bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md hover:border-stone-300 transition-all"
      data-testid={`trip-card-${trip.id}`}
      prefetch={false}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h2 className="font-editorial text-lg font-semibold text-stone-900 group-hover:text-amber-800 transition-colors mb-1">
            {trip.title}
          </h2>
          <p className="text-stone-500 text-sm line-clamp-1">{trip.subtitle}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-stone-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-4" />
      </div>

      {/* Snapshot strip */}
      <div className="flex flex-wrap gap-3 text-xs text-stone-500" data-testid="trip-snapshot">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {regions}
        </span>
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
    </Link>
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
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {/* Orientation */}
        <div className="mb-8">
          <p className="text-stone-600 leading-relaxed max-w-3xl">
            Safari Index plans and operates private safaris across Africa. These itinerary shapes
            are starting points—each trip is custom-built around your dates, preferences, and the
            decisions that matter for your situation.
          </p>
        </div>

        {/* East Africa Section */}
        <section className="mb-12" data-testid="region-section-east-africa">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-2">
            East Africa
          </h2>
          <p className="text-stone-500 text-sm mb-6">
            Tanzania, Kenya, and the Great Migration circuit
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eastAfricaTrips.slice(0, 6).map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>

        {/* Southern Africa Section */}
        <section className="mb-12" data-testid="region-section-southern-africa">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-2">
            Southern Africa
          </h2>
          <p className="text-stone-500 text-sm mb-6">
            Botswana, South Africa, Namibia, Zambia, and Zimbabwe
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {southernAfricaTrips.slice(0, 6).map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>

        {/* Uganda & Rwanda Section */}
        <section className="mb-12" data-testid="region-section-uganda-rwanda">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-2">
            Uganda and Rwanda
          </h2>
          <p className="text-stone-500 text-sm mb-6">
            Mountain gorillas and primate-focused safaris
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ugandaRwandaTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>

        {/* Special Interest Section */}
        <section className="mb-12" data-testid="region-section-special">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-2">
            Special Interest
          </h2>
          <p className="text-stone-500 text-sm mb-6">
            Photography, honeymoon, family, and budget-focused trips
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>

        {/* Plan a Safari CTA */}
        <div className="mt-12 pt-8 border-t border-stone-200">
          <div className="bg-stone-900 rounded-xl p-6 text-center">
            <h3 className="font-editorial text-xl text-white mb-2">Ready to plan your safari?</h3>
            <p className="text-stone-400 text-sm mb-4 max-w-md mx-auto">
              Tell us about your trip and we'll build a custom itinerary around your decisions.
            </p>
            <Link
              href="/inquire"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-stone-900 rounded-lg font-medium hover:bg-stone-100 transition-colors"
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
                href="/trips"
                className="text-sm text-stone-400 hover:text-white transition-colors"
              >
                Safaris
              </Link>
              <Link
                href="/decisions"
                className="text-sm text-stone-400 hover:text-white transition-colors"
              >
                Decisions
              </Link>
              <Link
                href="/guides"
                className="text-sm text-stone-400 hover:text-white transition-colors"
              >
                Guides
              </Link>
              <Link
                href="/how-it-works"
                className="text-sm text-stone-400 hover:text-white transition-colors"
              >
                How it works
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
