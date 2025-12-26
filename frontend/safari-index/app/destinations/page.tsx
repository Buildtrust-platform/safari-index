/**
 * Destinations Hub Page
 *
 * Static, indexable hub for destination-based safari planning.
 * No Bedrock calls - purely deterministic content from inventory.
 *
 * Per governance:
 * - Documentary, calm tone
 * - No hype or urgency
 * - Internal links with question titles
 * - Max 6 decision links, 3 guide links, 3 trip links per section
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import {
  MapPin,
  ChevronRight,
  ArrowRight,
  Compass,
} from 'lucide-react';
import { Navbar, Footer } from '../components/layout';
import {
  ImageBand,
  ImageBandContent,
  ecosystemImages,
  getDestinationImage,
} from '../components/visual';
import { SearchAndFilters } from '../components/SearchAndFilters';
import {
  getDecisionsByRegion,
  getTripsByRegion,
  getP0DecisionsForHub,
  LINK_LIMITS,
} from '../../lib/internal-links';

export const metadata: Metadata = {
  title: 'Safari Destinations | Safari Index',
  description:
    'Safari destinations across East and Southern Africa. Tanzania, Kenya, Botswana, South Africa, Rwanda, Uganda, Namibia, Zambia, and Zimbabwe.',
  robots: 'index, follow',
  alternates: {
    canonical: '/destinations',
  },
  openGraph: {
    title: 'Safari Destinations | Safari Index',
    description:
      'Plan your safari by destination. Explore Tanzania, Kenya, Botswana, South Africa, Rwanda, and more with Safari Index.',
    type: 'website',
    url: '/destinations',
  },
};

/**
 * Destination data
 */
const DESTINATIONS = [
  {
    id: 'tanzania',
    name: 'Tanzania',
    region: 'East Africa',
    description: 'Serengeti, Ngorongoro Crater, and the southern circuit. The birthplace of safari.',
    highlights: ['Serengeti National Park', 'Ngorongoro Crater', 'Migration', 'Southern Circuit'],
    image: 'savannah-morning',
  },
  {
    id: 'kenya',
    name: 'Kenya',
    region: 'East Africa',
    description: 'Masai Mara conservancies, Laikipia, and the Rift Valley lakes. Accessible and diverse.',
    highlights: ['Masai Mara', 'Laikipia', 'Amboseli', 'Lake Nakuru'],
    image: 'savannah-morning',
  },
  {
    id: 'botswana',
    name: 'Botswana',
    region: 'Southern Africa',
    description: 'Okavango Delta, Chobe, and the Kalahari. Water-based safari and exclusive camps.',
    highlights: ['Okavango Delta', 'Chobe', 'Makgadikgadi', 'Kalahari'],
    image: 'delta-channels',
  },
  {
    id: 'south-africa',
    name: 'South Africa',
    region: 'Southern Africa',
    description: 'Greater Kruger, Sabi Sands, and malaria-free options. Combines well with Cape Town.',
    highlights: ['Kruger', 'Sabi Sands', 'Cape Town', 'Garden Route'],
    image: 'savannah-morning',
  },
  {
    id: 'rwanda',
    name: 'Rwanda',
    region: 'East Africa',
    description: 'Mountain gorillas in Volcanoes National Park. Short trips with high impact.',
    highlights: ['Gorilla Trekking', 'Volcanoes NP', 'Kigali'],
    image: 'montane-forest',
  },
  {
    id: 'uganda',
    name: 'Uganda',
    region: 'East Africa',
    description: 'Gorillas, chimps, and savannah in one itinerary. Value alternative to Rwanda.',
    highlights: ['Bwindi', 'Kibale', 'Queen Elizabeth', 'Murchison Falls'],
    image: 'montane-forest',
  },
  {
    id: 'namibia',
    name: 'Namibia',
    region: 'Southern Africa',
    description: 'Desert landscapes, Sossusvlei dunes, and self-drive adventures. Photography paradise.',
    highlights: ['Sossusvlei', 'Etosha', 'Skeleton Coast', 'Damaraland'],
    image: 'desert-dunes',
  },
  {
    id: 'zambia',
    name: 'Zambia & Zimbabwe',
    region: 'Southern Africa',
    description: 'Walking safaris, Victoria Falls, and remote wilderness. The purist approach.',
    highlights: ['South Luangwa', 'Victoria Falls', 'Lower Zambezi', 'Mana Pools'],
    image: 'floodplain-evening',
  },
];

/**
 * Destination card component
 */
function DestinationCard({ destination }: { destination: typeof DESTINATIONS[0] }) {
  const decisions = getDecisionsByRegion(destination.id, LINK_LIMITS.decisions);
  const trips = getTripsByRegion(destination.id, LINK_LIMITS.trips);
  const destImage = getDestinationImage(destination.id);

  return (
    <section
      id={destination.id}
      className="bg-white rounded-xl border border-stone-200 overflow-hidden scroll-mt-24"
      data-testid="destination-card"
    >
      {/* Destination Hero Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={destImage.src}
          alt={destImage.alt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-6 right-6">
          <h2 className="font-editorial text-2xl font-semibold text-white">
            {destination.name}
          </h2>
          <p className="text-sm text-white/80">{destination.region}</p>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <MapPin className="w-5 h-5 text-amber-600" />
        </div>

        <p className="text-stone-600 mb-4">{destination.description}</p>

        {/* Highlights */}
        <div className="flex flex-wrap gap-2 mb-6">
          {destination.highlights.map((highlight) => (
            <span
              key={highlight}
              className="px-3 py-1 bg-stone-100 text-stone-600 text-sm rounded-full"
            >
              {highlight}
            </span>
          ))}
        </div>

        {/* Decisions */}
        {decisions.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-stone-900 mb-2">
              Start with these decisions
            </h3>
            <div className="space-y-1">
              {decisions.slice(0, 4).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 text-sm text-stone-600 hover:text-amber-700 transition-colors"
                  title={link.title}
                  prefetch={false}
                  data-testid="decision-link"
                >
                  <ArrowRight className="w-3 h-3" />
                  {link.anchorText}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Trips */}
        {trips.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-stone-900 mb-2">
              Trips that fit
            </h3>
            <div className="space-y-1">
              {trips.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 text-sm text-stone-600 hover:text-amber-700 transition-colors"
                  title={link.title}
                  prefetch={false}
                  data-testid="trip-link"
                >
                  <Compass className="w-3 h-3" />
                  {link.anchorText}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function DestinationsPage() {
  const p0Decisions = getP0DecisionsForHub(LINK_LIMITS.decisions);

  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar variant="transparent" />

      {/* Hero */}
      <ImageBand
        image={ecosystemImages.find(img => img.id === 'delta-channels') || ecosystemImages[0]}
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
              <span className="text-white">Destinations</span>
            </div>

            {/* Icon + Title */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <MapPin className="w-6 h-6 text-amber-400" />
              </div>
              <h1
                className="font-editorial text-4xl md:text-5xl font-semibold text-white"
                data-testid="destinations-h1"
              >
                Destinations
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              Safari destinations across East and Southern Africa.
              <br className="hidden md:block" />
              Each has its own character, wildlife, and trade-offs.
            </p>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Search Section */}
      <section className="bg-white py-8 border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <SearchAndFilters
            context="destinations"
            placeholder="Search destinations... e.g., 'Serengeti' or 'gorilla trekking'"
            compact
          />
        </div>
      </section>

      {/* Quick nav */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {DESTINATIONS.map((dest) => (
            <a
              key={dest.id}
              href={`#${dest.id}`}
              className="px-4 py-2 bg-white border border-stone-200 text-stone-700 text-sm rounded-full hover:border-amber-300 hover:text-amber-700 transition-colors"
            >
              {dest.name}
            </a>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {/* Destination Cards */}
        <div className="space-y-8" data-testid="destination-list">
          {DESTINATIONS.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>

        {/* P0 Decisions overview */}
        <section className="mt-12 pt-8 border-t border-stone-200" data-testid="p0-decisions">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-2">
            Key Decisions Across All Destinations
          </h2>
          <p className="text-stone-600 mb-4">
            These questions apply regardless of where you go.
          </p>
          <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
            {p0Decisions.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between px-6 py-4 hover:bg-stone-50 transition-colors group"
                title={link.title}
                prefetch={false}
                data-testid="p0-decision-link"
              >
                <span className="text-stone-700 group-hover:text-amber-700 transition-colors">
                  {link.anchorText}
                </span>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-colors" />
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-12 pt-8 border-t border-stone-200">
          <div className="bg-stone-900 rounded-xl p-6 text-center">
            <h3 className="font-editorial text-xl text-white mb-2">Not sure where to go?</h3>
            <p className="text-stone-400 text-sm mb-4 max-w-md mx-auto">
              Share your preferences and we'll help you choose the right destination.
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
