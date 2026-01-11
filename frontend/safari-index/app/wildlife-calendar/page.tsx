/**
 * Wildlife Calendar Page
 *
 * Interactive calendar showing wildlife sightings, migration patterns,
 * and seasonal events across African safari destinations.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Calendar } from 'lucide-react';
import { Navbar, Footer } from '../components/layout';
import { ImageBand, ImageBandContent, ecosystemImages } from '../components/visual';
import WildlifeCalendarContent from './WildlifeCalendarContent';

export const metadata: Metadata = {
  title: 'Wildlife Calendar | Vurara Safaris',
  description:
    'Interactive wildlife calendar showing the best times to see lions, elephants, the Great Migration, and more across African safari destinations.',
  robots: 'index, follow',
  alternates: {
    canonical: '/wildlife-calendar',
  },
  openGraph: {
    title: 'Wildlife Calendar | Vurara Safaris',
    description:
      'Plan your safari around wildlife events. See migration patterns, calving seasons, and optimal viewing times by month and destination.',
    type: 'website',
    url: '/wildlife-calendar',
  },
};

export default function WildlifeCalendarPage() {
  return (
    <main id="main-content" className="min-h-screen bg-stone-50">
      <Navbar variant="transparent" />

      {/* Hero */}
      <ImageBand
        image={ecosystemImages.find((img) => img.id === 'migration-crossing') || ecosystemImages[0]}
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
              <span className="text-white">Wildlife Calendar</span>
            </div>

            {/* Icon + Title */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Calendar className="w-6 h-6 text-amber-400" />
              </div>
              <h1 className="font-editorial text-4xl md:text-5xl font-semibold text-white">
                Wildlife Calendar
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              Discover when and where to witness Africa's greatest wildlife spectacles.
              <br className="hidden md:block" />
              From the Great Migration to elephant gatherings and gorilla treks.
            </p>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Calendar Content */}
      <WildlifeCalendarContent />

      <Footer variant="operator" />
    </main>
  );
}
