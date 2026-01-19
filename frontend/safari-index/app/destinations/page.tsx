/**
 * Destinations Hub Page
 *
 * Design:
 * - Hero with icon, title, subtitle
 * - Sticky destination navigation
 * - Region sections with visual headers
 * - Inline CTA after first region
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import {
  MapPin,
  ChevronRight,
  ArrowRight,
  Globe,
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
  title: 'Safari Destinations | Vurara Safaris',
  description:
    'Safari destinations across East and Southern Africa. Tanzania, Kenya, Botswana, South Africa, Rwanda, Uganda, Namibia, Zambia, and Zimbabwe.',
  robots: 'index, follow',
  alternates: {
    canonical: '/destinations',
  },
  openGraph: {
    title: 'Safari Destinations | Vurara Safaris',
    description:
      'Plan your safari by destination. Explore Tanzania, Kenya, Botswana, South Africa, Rwanda, and more with Vurara Safaris.',
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
    description: 'Okavango Delta, Chobe, and the Kalahari. Water-based safari and low-density camps.',
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
    description: 'Desert landscapes, Sossusvlei dunes, and self-drive adventures. Strong photography conditions.',
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
 * Destination card in grid - responsive layout
 */
function DestinationCard({ destination }: { destination: typeof DESTINATIONS[0] }) {
  const destImage = getDestinationImage(destination.id);

  return (
    <Link
      href={`/destinations/${destination.id}`}
      id={destination.id}
      className="group block bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-amber-300 hover:shadow-md transition-all scroll-mt-24"
      data-testid="destination-card"
    >
      {/* Vertical on mobile, horizontal on larger screens */}
      <div className="flex flex-col sm:flex-row">
        {/* Image - taller on mobile, thumbnail on desktop */}
        <div className="w-full h-32 sm:w-28 sm:h-32 flex-shrink-0 overflow-hidden">
          <img
            src={destImage.src}
            alt={destImage.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 p-3">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="font-editorial text-base font-semibold text-stone-900 group-hover:text-amber-700 transition-colors">
                {destination.name}
              </h3>
              <span className="text-xs text-amber-700">{destination.region}</span>
            </div>
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
  // Use region-appropriate images: savannah/giraffe for East Africa, Kruger zebras for Southern Africa
  const bgImage = isEastAfrica
    ? ecosystemImages.find(img => img.id === 'savannah-morning') || ecosystemImages[0]
    : ecosystemImages.find(img => img.id === 'woodland-clearing') || ecosystemImages[0];

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
  const eastAfricaDestinations = DESTINATIONS.filter((d) => REGIONS['East Africa'].includes(d.id));
  const southernAfricaDestinations = DESTINATIONS.filter((d) => REGIONS['Southern Africa'].includes(d.id));

  return (
    <main id="main-content" className="min-h-screen bg-stone-50">
      <Navbar variant="transparent" />

      {/* Hero */}
      <ImageBand
        image={ecosystemImages.find((img) => img.id === 'savannah-wildlife') || ecosystemImages[0]}
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
              East and Southern Africa.
              <br className="hidden md:block" />
              Each destination has its own character, wildlife, and trade-offs.
            </p>
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


      {/* Sticky destination navigation */}
      <nav className="sticky top-0 z-40 bg-white border-b border-stone-200 py-3" aria-label="Destinations">
        <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide" data-testid="destination-nav">
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wide whitespace-nowrap hidden sm:block">Destinations</span>
            {DESTINATIONS.map((destination) => (
              <DestinationNavChip key={destination.id} destination={destination} />
            ))}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 md:px-8 py-10">

        {/* Region sections with inline CTA */}
        <div className="space-y-8">
          <div>
            <RegionSection region="East Africa" destinations={eastAfricaDestinations} />
            {/* CTA after first region */}
            <div className="mt-8 bg-gradient-to-r from-amber-50 to-stone-50 rounded-xl border border-amber-200/50 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-stone-900 font-medium">
                    We'll recommend the right destination based on your priorities
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
          </div>
          <RegionSection region="Southern Africa" destinations={southernAfricaDestinations} />
        </div>
      </div>

      <Footer variant="operator" />
    </main>
  );
}
