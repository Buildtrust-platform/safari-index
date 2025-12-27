/**
 * Safari Types Hub Page
 *
 * Discovery page for Safari Types - categorization by traveler intent.
 * Helps travelers identify which safari approach matches their goals.
 *
 * Per governance:
 * - Documentary, operator-grade tone (no hype, no emojis)
 * - Clear trade-offs for every safari type
 * - Links to itineraries and decisions
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ChevronRight,
  ArrowRight,
  Compass,
  Activity,
  Shield,
  Gauge,
} from 'lucide-react';
import { Navbar, Footer } from '../components/layout';
import { ImageBand, ImageBandContent, ecosystemImages } from '../components/visual';
import {
  getPublishedSafariTypes,
  formatPace,
  formatPhysicalDemand,
  formatPrivacyLevel,
  type SafariType,
} from '../content/safari-types';

export const metadata: Metadata = {
  title: 'Safari Types | Safari Index',
  description:
    'Discover which safari style matches your travel goals. From first-time classics to specialist wildlife experiences, find your ideal approach to an African safari.',
  robots: 'index, follow',
  alternates: {
    canonical: '/safari-types',
  },
  openGraph: {
    title: 'Safari Types | Safari Index',
    description:
      'Explore 10 safari types categorized by traveler intent. Find the right safari approach for your goals, preferences, and experience level.',
    type: 'website',
    url: '/safari-types',
  },
};

/**
 * Attribute badge component
 */
function AttributeBadge({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="w-6 h-6 rounded-md bg-stone-100 flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 text-stone-500" />
      </div>
      <div>
        <span className="text-stone-400 text-xs">{label}: </span>
        <span className="text-stone-700">{value}</span>
      </div>
    </div>
  );
}

/**
 * Safari Type card component
 */
function SafariTypeCard({ safariType }: { safariType: SafariType }) {
  return (
    <Link
      href={`/safari-types/${safariType.id}`}
      prefetch={false}
      className="group block bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-amber-300 hover:shadow-lg transition-all"
      data-testid="safari-type-card"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h3 className="font-editorial text-xl font-semibold text-stone-900 mb-1 group-hover:text-amber-700 transition-colors">
              {safariType.name}
            </h3>
            <p className="text-stone-600 text-sm">
              {safariType.positioning_line}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <span className="text-amber-700 font-semibold text-lg">
              {safariType.display_order}
            </span>
          </div>
        </div>

        {/* Attributes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 pb-4 border-b border-stone-100">
          <AttributeBadge
            icon={Gauge}
            label="Pace"
            value={formatPace(safariType.attributes.pace)}
          />
          <AttributeBadge
            icon={Activity}
            label="Physical"
            value={formatPhysicalDemand(safariType.attributes.physical_demand)}
          />
          <AttributeBadge
            icon={Shield}
            label="Privacy"
            value={formatPrivacyLevel(safariType.attributes.privacy_level)}
          />
        </div>

        {/* Best for */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
            Best for
          </p>
          <div className="flex flex-wrap gap-1.5">
            {safariType.best_for.slice(0, 3).map((fit, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-50 text-green-700"
              >
                {fit}
              </span>
            ))}
            {safariType.best_for.length > 3 && (
              <span className="px-2 py-0.5 text-xs text-stone-400">
                +{safariType.best_for.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Trade-off preview */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <p className="text-xs text-green-600 font-medium mb-1">You gain</p>
            <p className="text-stone-600 line-clamp-2">
              {safariType.tradeoffs.gains[0]}
            </p>
          </div>
          <div>
            <p className="text-xs text-amber-600 font-medium mb-1">You trade</p>
            <p className="text-stone-600 line-clamp-2">
              {safariType.tradeoffs.losses[0]}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <span className="text-sm text-stone-500">
            View details and itineraries
          </span>
          <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  );
}

/**
 * Featured Safari Type card (larger format)
 */
function FeaturedSafariTypeCard({ safariType }: { safariType: SafariType }) {
  return (
    <Link
      href={`/safari-types/${safariType.id}`}
      prefetch={false}
      className="group block bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-amber-300 hover:shadow-lg transition-all"
      data-testid="featured-safari-type-card"
    >
      <div className="flex flex-col md:flex-row">
        {/* Visual side */}
        <div className="relative h-48 md:h-auto md:w-72 flex-shrink-0 overflow-hidden bg-gradient-to-br from-amber-100 to-amber-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 border border-amber-200">
                <Compass className="w-8 h-8 text-amber-600" />
              </div>
              <span className="text-amber-700 font-semibold">Most Popular</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1">
          <h3 className="font-editorial text-2xl font-semibold text-stone-900 mb-2 group-hover:text-amber-700 transition-colors">
            {safariType.name}
          </h3>
          <p className="text-stone-600 mb-4">
            {safariType.positioning_line}
          </p>

          {/* Attributes */}
          <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-stone-100">
            <AttributeBadge
              icon={Gauge}
              label="Pace"
              value={formatPace(safariType.attributes.pace)}
            />
            <AttributeBadge
              icon={Activity}
              label="Physical"
              value={formatPhysicalDemand(safariType.attributes.physical_demand)}
            />
            <AttributeBadge
              icon={Shield}
              label="Privacy"
              value={formatPrivacyLevel(safariType.attributes.privacy_level)}
            />
          </div>

          {/* Best for */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {safariType.best_for.map((fit, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-50 text-green-700"
              >
                {fit}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2 text-amber-700 font-medium">
            <span>Explore this safari type</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function SafariTypesPage() {
  const allSafariTypes = getPublishedSafariTypes();

  // First type is featured (first-time-classic)
  const featuredType = allSafariTypes[0];
  const otherTypes = allSafariTypes.slice(1);

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
              <span className="text-white">Safari Types</span>
            </div>

            {/* Icon + Title */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Compass className="w-6 h-6 text-amber-400" />
              </div>
              <h1
                className="font-editorial text-4xl md:text-5xl font-semibold text-white"
                data-testid="safari-types-h1"
              >
                Safari Types
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              Discover which safari style matches your travel goals.
              <br className="hidden md:block" />
              Each type is defined by pace, privacy, and purpose.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 mt-6 text-white/60 text-sm">
              <span>{allSafariTypes.length} safari types</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>Clear trade-offs for each</span>
            </div>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Featured type */}
      <section className="bg-white py-10 border-b border-stone-200" data-testid="featured-safari-type">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Compass className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="font-editorial text-xl font-semibold text-stone-900">
                Start Here
              </h2>
              <p className="text-stone-500 text-sm">The safari most travelers begin with</p>
            </div>
          </div>
          <FeaturedSafariTypeCard safariType={featuredType} />
        </div>
      </section>

      {/* All safari types */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        <div className="mb-8">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-2">
            All Safari Types
          </h2>
          <p className="text-stone-600">
            Find the safari style that matches your travel goals and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {otherTypes.map((safariType) => (
            <SafariTypeCard key={safariType.id} safariType={safariType} />
          ))}
        </div>

        {/* CTA section */}
        <div className="mt-12 bg-white rounded-2xl border border-stone-200 p-8 text-center">
          <h3 className="font-editorial text-xl font-semibold text-stone-900 mb-2">
            Not sure which type fits you?
          </h3>
          <p className="text-stone-600 mb-6 max-w-md mx-auto">
            Answer a few questions and we will recommend the safari type that matches your travel style.
          </p>
          <Link
            href="/compare"
            prefetch={false}
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
          >
            <span>Compare Options</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
