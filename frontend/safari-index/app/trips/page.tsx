/**
 * Safaris Hub Page
 *
 * Vurara Safaris-operated itinerary shapes. Each is custom-built around
 * traveler decisions and preferences.
 *
 * Per governance: documentary, calm, safari-native tone. No hype, emojis,
 * or exclamation marks. Clear operator positioning.
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Compass,
  ChevronRight,
  Map,
  FileText,
} from 'lucide-react';
import { getAllTrips } from '../content/trip-shapes/trips';
import { ImageBand, ImageBandContent, ecosystemImages } from '../components/visual';
import { Navbar, Footer } from '../components/layout';
import { SearchAndFilters } from '../components/SearchAndFilters';
import { TripsContent } from './TripsContent';

/**
 * SEO Metadata
 */
export const metadata: Metadata = {
  title: 'Private Safaris | Vurara Safaris',
  description:
    'Private safaris operated by Vurara Safaris. 20 itinerary shapes across East and Southern Africa, each custom-built around your decisions.',
  robots: 'index, follow',
  alternates: {
    canonical: '/trips',
  },
  openGraph: {
    title: 'Private Safaris | Vurara Safaris',
    description:
      'Vurara Safaris operates private safaris across Africa. From classic Serengeti circuits to gorilla treks and self-drive adventures.',
    type: 'website',
    url: '/trips',
  },
};

/**
 * Region section configuration
 */
const REGION_SECTIONS = [
  {
    id: 'east-africa',
    name: 'East Africa',
    description: 'Tanzania, Kenya, and the Great Migration circuit',
    imageId: 'savannah-wildlife',
  },
  {
    id: 'southern-africa',
    name: 'Southern Africa',
    description: 'Botswana, South Africa, Namibia, Zambia, and Zimbabwe',
    imageId: 'delta-channels',
  },
  {
    id: 'uganda-rwanda',
    name: 'Uganda & Rwanda',
    description: 'Mountain gorillas and primate-focused safaris',
    imageId: 'montane-forest',
  },
  {
    id: 'special',
    name: 'Special Interest',
    description: 'Photography, honeymoon, family, and budget-focused trips',
    imageId: 'kopje-landscape',
  },
];

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
                Vurara Safaris
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">Safaris</span>
            </div>

            {/* Operator badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white/80 bg-white/10 rounded-full mb-4">
              <Compass className="w-3 h-3" />
              Vurara Safaris Operated
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

      {/* Sticky category navigation */}
      <nav className="sticky top-0 z-40 bg-white border-b border-stone-200 py-3" aria-label="Safari categories">
        <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wide whitespace-nowrap hidden sm:block">Categories</span>
            {regionData.map(({ section, trips }) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 bg-stone-50 rounded-lg border border-stone-200 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 transition-colors whitespace-nowrap"
              >
                <span>{section.name}</span>
                <span className="text-xs text-stone-400 bg-white px-1.5 py-0.5 rounded">
                  {trips.length}
                </span>
              </a>
            ))}
            <Link
              href="/itineraries"
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-stone-500 hover:text-amber-700 transition-colors whitespace-nowrap ml-auto"
            >
              <FileText className="w-4 h-4" />
              Day-by-day itineraries
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content with view toggle */}
      <TripsContent regionData={regionData} />

      <Footer variant="operator" />
    </main>
  );
}
