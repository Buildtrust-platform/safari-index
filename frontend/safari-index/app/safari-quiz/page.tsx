/**
 * Safari Quiz Page
 *
 * Personalized quiz that recommends safari trips based on
 * user preferences, travel style, and priorities.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Compass } from 'lucide-react';
import { Navbar, Footer } from '../components/layout';
import { ImageBand, ImageBandContent, ecosystemImages } from '../components/visual';
import SafariQuizContent from './SafariQuizContent';

export const metadata: Metadata = {
  title: 'Safari Quiz - Find Your Perfect Trip | Vurara Safaris',
  description:
    'Take our quick quiz to discover which African safari matches your travel style, priorities, and dreams. Get personalized recommendations in minutes.',
  robots: 'index, follow',
  alternates: {
    canonical: '/safari-quiz',
  },
  openGraph: {
    title: 'Safari Quiz - Find Your Perfect Trip | Vurara Safaris',
    description:
      'Answer a few questions about your travel preferences and discover which safari is right for you.',
    type: 'website',
    url: '/safari-quiz',
  },
};

export default function SafariQuizPage() {
  return (
    <main id="main-content" className="min-h-screen bg-stone-50">
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
              <span className="text-white">Safari Quiz</span>
            </div>

            {/* Icon + Title */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Compass className="w-6 h-6 text-amber-400" />
              </div>
              <h1 className="font-editorial text-4xl md:text-5xl font-semibold text-white">
                Find Your Safari
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              Answer a few questions and we'll recommend the perfect safari for you.
              <br className="hidden md:block" />
              Takes about 2 minutes.
            </p>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Quiz Content */}
      <SafariQuizContent />

      <Footer variant="operator" />
    </main>
  );
}
