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
import { ChevronRight, Compass } from 'lucide-react';
import { Navbar, Footer } from '../components/layout';
import { ImageBand, ImageBandContent, ecosystemImages } from '../components/visual';
import { ItineraryList } from './ItineraryList';
import { getItinerarySummaries } from '../content/itineraries';

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

export default function ItinerariesPage() {
  const allItineraries = getItinerarySummaries();

  // Count unique regions
  const uniqueRegions = new Set(allItineraries.map((i) => i.region));

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

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 mt-6 text-white/60 text-sm">
              <span>{allItineraries.length} itineraries</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>{uniqueRegions.size} regions</span>
            </div>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Itinerary List with Filters (Client Component) */}
      <ItineraryList itineraries={allItineraries} />

      <Footer variant="operator" />
    </main>
  );
}
