/**
 * Destinations Hub Page
 *
 * Consistent design with other hub pages:
 * - Hero with icon, title, subtitle, stats
 * - Search section
 * - Featured destinations grid
 * - Region-grouped sections with visual headers
 * - CTA footer
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import {
  MapPin,
  ChevronRight,
  ArrowRight,
  Globe,
  Sparkles,
} from 'lucide-react';
import { Navbar, Footer } from '../components/layout';
import {
  ImageBand,
  ImageBandContent,
  ecosystemImages,
  getDestinationImage,
} from '../components/visual';
import { SearchAndFilters } from '../components/SearchAndFilters';

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
    highlights: ['Serengeti', 'Ngorongoro', 'Migration', 'Southern Circuit'],
  },
  {
    id: 'kenya',
    name: 'Kenya',
    region: 'East Africa',
    description: 'Masai Mara conservancies, Laikipia, and the Rift Valley lakes. Accessible and diverse.',
    highlights: ['Masai Mara', 'Laikipia', 'Amboseli', 'Lake Nakuru'],
  },
  {
    id: 'botswana',
    name: 'Botswana',
    region: 'Southern Africa',
    description: 'Okavango Delta, Chobe, and the Kalahari. Water-based safari and exclusive camps.',
    highlights: ['Okavango Delta', 'Chobe', 'Makgadikgadi', 'Kalahari'],
  },
  {
    id: 'south-africa',
    name: 'South Africa',
    region: 'Southern Africa',
    description: 'Greater Kruger, Sabi Sands, and malaria-free options. Combines well with Cape Town.',
    highlights: ['Kruger', 'Sabi Sands', 'Cape Town', 'Garden Route'],
  },
  {
    id: 'rwanda',
    name: 'Rwanda',
    region: 'East Africa',
    description: 'Mountain gorillas in Volcanoes National Park. Short trips with high impact.',
    highlights: ['Gorilla Trekking', 'Volcanoes NP', 'Kigali'],
  },
  {
    id: 'uganda',
    name: 'Uganda',
    region: 'East Africa',
    description: 'Gorillas, chimps, and savannah in one itinerary. Value alternative to Rwanda.',
    highlights: ['Bwindi', 'Kibale', 'Queen Elizabeth', 'Murchison Falls'],
  },
  {
    id: 'namibia',
    name: 'Namibia',
    region: 'Southern Africa',
    description: 'Desert landscapes, Sossusvlei dunes, and self-drive adventures. Photography paradise.',
    highlights: ['Sossusvlei', 'Etosha', 'Skeleton Coast', 'Damaraland'],
  },
  {
    id: 'zambia',
    name: 'Zambia & Zimbabwe',
    region: 'Southern Africa',
    description: 'Walking safaris, Victoria Falls, and remote wilderness. The purist approach.',
    highlights: ['South Luangwa', 'Victoria Falls', 'Lower Zambezi', 'Mana Pools'],
  },
];

const REGIONS = {
  'East Africa': ['tanzania', 'kenya', 'rwanda', 'uganda'],
  'Southern Africa': ['botswana', 'south-africa', 'namibia', 'zambia'],
};

/**
 * Featured destination card with large image
 */
function FeaturedDestinationCard({ destination }: { destination: typeof DESTINATIONS[0] }) {
  const destImage = getDestinationImage(destination.id);

  return (
    <Link
      href={`/destinations/${destination.id}`}
      className="group block bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-amber-300 hover:shadow-lg transition-all"
      data-testid="featured-destination"
    >
      {/* Image */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={destImage.src}
          alt={destImage.alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium bg-white/90 backdrop-blur-sm text-stone-700 rounded-full">
            <Globe className="w-3 h-3" />
            {destination.region}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-editorial text-lg font-semibold text-stone-900 group-hover:text-amber-700 transition-colors mb-1">
          {destination.name}
        </h3>
        <p className="text-stone-500 text-sm line-clamp-2 mb-3">{destination.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-stone-400">Explore</span>
          <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  );
}

/**
 * Destination card in grid
 */
function DestinationCard({ destination }: { destination: typeof DESTINATIONS[0] }) {
  const destImage = getDestinationImage(destination.id);

  return (
    <Link
      href={`/destinations/${destination.id}`}
      id={destination.id}
      className="group block bg-white rounded-xl border border-stone-200 p-4 hover:border-amber-300 hover:shadow-md transition-all scroll-mt-24"
      data-testid="destination-card"
    >
      <div className="flex items-start gap-4">
        {/* Thumbnail */}
        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={destImage.src}
            alt={destImage.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-editorial text-base font-semibold text-stone-900 group-hover:text-amber-700 transition-colors">
              {destination.name}
            </h3>
            <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </div>
          <p className="text-stone-500 text-sm line-clamp-2 mb-2">{destination.description}</p>

          {/* Highlights */}
          <div className="flex flex-wrap gap-1">
            {destination.highlights.slice(0, 3).map((highlight) => (
              <span
                key={highlight}
                className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs rounded-full"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Region section with visual header
 */
function RegionSection({ region, destinations }: { region: string; destinations: typeof DESTINATIONS }) {
  const isEastAfrica = region === 'East Africa';
  const bgImage = ecosystemImages[isEastAfrica ? 0 : 1]; // savannah for East, delta for Southern

  return (
    <section className="scroll-mt-24" data-testid={`region-${region.toLowerCase().replace(' ', '-')}`}>
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
                {region}
              </h2>
              <p className="text-white/70 text-sm">
                {destinations.length} {destinations.length === 1 ? 'destination' : 'destinations'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Destinations grid */}
      <div className="bg-white rounded-b-2xl border border-t-0 border-stone-200 p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {destinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Navigation chip
 */
function DestinationNavChip({ destination }: { destination: typeof DESTINATIONS[0] }) {
  const destImage = getDestinationImage(destination.id);

  return (
    <a
      href={`#${destination.id}`}
      className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 bg-white rounded-lg border border-stone-200 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 transition-colors whitespace-nowrap shadow-sm"
    >
      <div className="w-5 h-5 rounded-full overflow-hidden">
        <img src={destImage.src} alt="" className="w-full h-full object-cover" />
      </div>
      <span>{destination.name}</span>
    </a>
  );
}

export default function DestinationsPage() {
  const featuredDestinations = DESTINATIONS.slice(0, 4);
  const eastAfricaDestinations = DESTINATIONS.filter((d) => REGIONS['East Africa'].includes(d.id));
  const southernAfricaDestinations = DESTINATIONS.filter((d) => REGIONS['Southern Africa'].includes(d.id));

  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar variant="transparent" />

      {/* Hero */}
      <ImageBand
        image={ecosystemImages.find((img) => img.id === 'delta-channels') || ecosystemImages[0]}
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
              {DESTINATIONS.length} safari destinations across East and Southern Africa.
              <br className="hidden md:block" />
              Each has its own character, wildlife, and trade-offs.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 mt-6 text-white/60 text-sm">
              <span>{DESTINATIONS.length} destinations</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>2 regions</span>
            </div>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Search Section */}
      <section className="bg-white py-6 border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <SearchAndFilters
            context="destinations"
            placeholder="Search destinations... e.g., 'Serengeti' or 'gorilla trekking'"
            compact
          />
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="bg-white py-10 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="font-editorial text-xl font-semibold text-stone-900">
                Popular Destinations
              </h2>
              <p className="text-stone-500 text-sm">Where most first-time visitors go</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredDestinations.map((destination) => (
              <FeaturedDestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        {/* Destination navigation */}
        <nav className="mb-8" aria-label="Destinations">
          <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">
            Jump to destination
          </h2>
          <div className="flex flex-wrap gap-2" data-testid="destination-nav">
            {DESTINATIONS.map((destination) => (
              <DestinationNavChip key={destination.id} destination={destination} />
            ))}
          </div>
        </nav>

        {/* Region sections */}
        <div className="space-y-8">
          <RegionSection region="East Africa" destinations={eastAfricaDestinations} />
          <RegionSection region="Southern Africa" destinations={southernAfricaDestinations} />
        </div>

        {/* CTA section */}
        <div className="mt-12 pt-8 border-t border-stone-200">
          <div className="bg-stone-900 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="font-editorial text-xl text-white mb-2">
                  Not sure where to go?
                </h3>
                <p className="text-stone-400 text-sm">
                  Share your preferences and we'll help you choose the right destination.
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
                  href="/decisions"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-transparent text-white border border-white/30 rounded-lg font-medium hover:bg-white/10 transition-colors text-sm"
                >
                  Browse decisions
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
