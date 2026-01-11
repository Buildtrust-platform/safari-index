/**
 * Safaris For Hub Page
 *
 * Discovery page for traveler-focused safari recommendations.
 * Routes to specific pages for first-timers, families, photographers, etc.
 *
 * Per governance:
 * - Documentary, calm tone
 * - No hype or exclamation marks
 * - Clear positioning for each traveler type
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ChevronRight,
  ArrowRight,
  Compass,
  Users,
  Camera,
  Heart,
  Mountain,
  Bird,
} from 'lucide-react';
import { Navbar, Footer } from '../components/layout';
import { ImageBand, ImageBandContent, ecosystemImages } from '../components/visual';

export const metadata: Metadata = {
  title: 'Safaris For You | Vurara Safaris',
  description:
    'Find the right safari for your travel style. Curated recommendations for first-timers, families, photographers, honeymooners, and experienced safari travelers.',
  robots: 'index, follow',
  alternates: {
    canonical: '/safaris-for',
  },
  openGraph: {
    title: 'Safaris For You | Vurara Safaris',
    description:
      'Find the right safari for your travel style. Curated recommendations for first-timers, families, photographers, and more.',
    type: 'website',
    url: '/safaris-for',
  },
};

const TRAVELER_TYPES = [
  {
    id: 'first-timers',
    title: 'First-Time Safari Travelers',
    subtitle: 'Get it right the first time',
    description: 'Proven itineraries, reliable wildlife, and guides who know how to make your first safari unforgettable.',
    icon: Compass,
    href: '/safaris-for/first-timers',
    color: 'bg-green-100 text-green-700',
    iconColor: 'text-green-600',
  },
  {
    id: 'families',
    title: 'Families with Children',
    subtitle: 'Adventures for all ages',
    description: 'Child-friendly lodges, flexible schedules, and activities that engage young explorers without exhausting parents.',
    icon: Users,
    href: '/safaris-for/families',
    color: 'bg-blue-100 text-blue-700',
    iconColor: 'text-blue-600',
  },
  {
    id: 'photographers',
    title: 'Wildlife Photographers',
    subtitle: 'Light, position, patience',
    description: 'Private vehicles, extended sighting time, and guides who understand the difference between seeing and capturing.',
    icon: Camera,
    href: '/safaris-for/photographers',
    color: 'bg-indigo-100 text-indigo-700',
    iconColor: 'text-indigo-600',
  },
  {
    id: 'honeymooners',
    title: 'Honeymoons and Couples',
    subtitle: 'Romance in the wild',
    description: 'Private dining, intimate camps, and moments designed for two. Safari is not just a trip, it is a shared experience.',
    icon: Heart,
    href: '/safaris-for/honeymooners',
    color: 'bg-pink-100 text-pink-700',
    iconColor: 'text-pink-600',
  },
  {
    id: 'repeat-visitors',
    title: 'Experienced Safari Travelers',
    subtitle: 'Beyond the classics',
    description: 'Remote reserves, walking safaris, specialist guides, and destinations that reward those who already know Africa.',
    icon: Mountain,
    href: '/safaris-for/repeat-visitors',
    color: 'bg-amber-100 text-amber-700',
    iconColor: 'text-amber-600',
  },
  {
    id: 'special-interests',
    title: 'Special Interest Safaris',
    subtitle: 'Gorillas, migration, walking',
    description: 'Specific experiences that define the trip: primate tracking, river crossings, fly-camping, or birding expeditions.',
    icon: Bird,
    href: '/safaris-for/special-interests',
    color: 'bg-teal-100 text-teal-700',
    iconColor: 'text-teal-600',
  },
];

function TravelerTypeCard({
  type,
}: {
  type: typeof TRAVELER_TYPES[0];
}) {
  const Icon = type.icon;

  return (
    <Link
      href={type.href}
      className="group block bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-amber-300 hover:shadow-lg transition-all"
    >
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 rounded-xl ${type.color} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-6 h-6 ${type.iconColor}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-editorial text-lg font-semibold text-stone-900 mb-1 group-hover:text-amber-700 transition-colors">
              {type.title}
            </h3>
            <p className="text-sm text-stone-500">{type.subtitle}</p>
          </div>
        </div>

        <p className="text-stone-600 text-sm mb-4">
          {type.description}
        </p>

        <div className="flex items-center gap-2 text-amber-700 font-medium text-sm pt-3 border-t border-stone-100">
          <span>View recommendations</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

export default function SafarisForPage() {
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
              <span className="text-white">Safaris For You</span>
            </div>

            <h1 className="font-editorial text-4xl md:text-5xl font-semibold text-white mb-4">
              Safaris For You
            </h1>

            <p className="text-white/80 text-lg max-w-xl mx-auto">
              Different travelers need different safaris.
              <br className="hidden md:block" />
              Find itineraries curated for your specific travel style.
            </p>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Traveler types grid */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        <div className="mb-8">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-2">
            Choose Your Travel Style
          </h2>
          <p className="text-stone-600">
            Select the category that best describes your trip
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRAVELER_TYPES.map((type) => (
            <TravelerTypeCard key={type.id} type={type} />
          ))}
        </div>

        {/* CTA section */}
        <div className="mt-12 bg-white rounded-2xl border border-stone-200 p-8 text-center">
          <h3 className="font-editorial text-xl font-semibold text-stone-900 mb-2">
            Not sure which fits you?
          </h3>
          <p className="text-stone-600 mb-6 max-w-md mx-auto">
            Start a planning brief and tell us what matters most. We will match you to the right safari.
          </p>
          <Link
            href="/inquire"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
          >
            <span>Start Planning</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
