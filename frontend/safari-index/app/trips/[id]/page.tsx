/**
 * Trip Archetype Page
 *
 * Safari Index-operated itinerary shape with:
 * - Hero with operator badge and snapshot strip
 * - What this trip is for
 * - What you trade off
 * - Decisions to confirm before booking
 * - Guides worth reading
 * - Variants section
 * - Clear operator CTA
 *
 * Per governance: documentary, calm, safari-native tone.
 * No hype, emojis, or exclamation marks.
 * Positions Safari Index as the operator.
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  MapPin,
  Calendar,
  Compass,
  Sun,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  DollarSign,
} from 'lucide-react';
import {
  getAllTrips,
  getTripById,
  formatDuration,
  formatBestMonths,
  getRegionDisplayName,
  getComfortTierDisplay,
  formatCostBand,
  type TripArchetype,
} from '../../content/trip-shapes/trips';
import {
  getDecisionLinksForTrip,
  getGuideLinksForTrip,
  getTripVariants,
} from '../../../lib/trip-links';
import { ImageBand, ImageBandContent, ecosystemImages } from '../../components/visual';
import { Navbar } from '../../components/layout';
import { TypicalDaySection, AccommodationSection } from '../../components/trips';

/**
 * Generate static params for all trips
 */
export function generateStaticParams() {
  const trips = getAllTrips();
  return trips.map((trip) => ({
    id: trip.id,
  }));
}

/**
 * Generate metadata for each trip
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const trip = getTripById(id);

  if (!trip) {
    return {
      title: 'Trip Not Found | Safari Index',
    };
  }

  const regions = trip.regions
    .filter((r) => !['east-africa', 'southern-africa'].includes(r))
    .map((r) => getRegionDisplayName(r))
    .join(', ') || getRegionDisplayName(trip.regions[0]);

  return {
    title: `${trip.title} | Private Safari | Safari Index`,
    description: `${trip.subtitle}. A Safari Index-operated private safari: ${formatDuration(trip.duration_days)} in ${regions}. Custom-built around your decisions.`,
    robots: 'index, follow',
    alternates: {
      canonical: `/trips/${id}`,
    },
    openGraph: {
      title: `${trip.title} | Safari Index`,
      description: `Private safari operated by Safari Index. ${trip.what_this_trip_is_for}`,
      type: 'article',
      url: `/trips/${id}`,
    },
  };
}

/**
 * Get primary destination ID for activity/accommodation sections
 */
function getPrimaryDestination(trip: TripArchetype): string {
  // Filter out broad regional tags
  const specific = trip.regions.filter(
    (r) => !['east-africa', 'southern-africa'].includes(r)
  );
  return specific[0] || trip.regions[0];
}

/**
 * Get ecosystem image based on trip regions
 */
function getTripImage(trip: TripArchetype) {
  if (trip.regions.includes('botswana')) {
    return ecosystemImages.find((img) => img.id === 'delta-channels') || ecosystemImages[0];
  }
  if (trip.regions.includes('namibia')) {
    return ecosystemImages.find((img) => img.id === 'desert-dunes') || ecosystemImages[0];
  }
  if (trip.regions.includes('uganda-rwanda')) {
    return ecosystemImages.find((img) => img.id === 'montane-forest') || ecosystemImages[0];
  }
  if (trip.regions.includes('zambia') || trip.regions.includes('zimbabwe')) {
    return ecosystemImages.find((img) => img.id === 'floodplain-evening') || ecosystemImages[0];
  }
  // Default to savannah for East Africa
  return ecosystemImages.find((img) => img.id === 'savannah-morning') || ecosystemImages[0];
}

/**
 * Trip Archetype Page Component
 */
export default async function TripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trip = getTripById(id);

  if (!trip) {
    notFound();
  }

  const decisionLinks = getDecisionLinksForTrip(trip);
  const guideLinks = getGuideLinksForTrip(trip);
  const variants = getTripVariants(trip);
  const tripImage = getTripImage(trip);

  const regions = trip.regions
    .filter((r) => !['east-africa', 'southern-africa'].includes(r))
    .map((r) => getRegionDisplayName(r))
    .join(', ') || getRegionDisplayName(trip.regions[0]);

  // JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: trip.title,
    description: trip.what_this_trip_is_for,
    touristType: trip.traveler_fit.map((f) => f.replace('-', ' ')),
    itinerary: {
      '@type': 'ItemList',
      itemListElement: trip.core_parks_or_areas.map((area, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: area,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar variant="transparent" />

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <ImageBand
        image={tripImage}
        height="decision-hero"
        overlay="cinematic"
        align="center"
        priority
        alwaysRender
      >
        <ImageBandContent maxWidth="default" className="pt-24 pb-8">
          <div className="text-center">
            {/* Breadcrumb */}
            <div
              className="flex items-center justify-center gap-2 text-white/60 text-sm mb-4 flex-wrap"
              data-testid="breadcrumb"
            >
              <Link href="/" className="hover:text-white transition-colors">
                Safari Index
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link
                href="/trips"
                className="hover:text-white transition-colors"
                data-testid="breadcrumb-trips"
              >
                Safaris
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white truncate max-w-[200px]">{trip.title}</span>
            </div>

            {/* Operator badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white/80 bg-white/10 rounded-full mb-4">
              <Compass className="w-3 h-3" />
              Safari Index Operated
            </span>

            {/* Title */}
            <h1
              className="font-editorial text-3xl md:text-4xl font-semibold text-white mb-2"
              data-testid="trip-h1"
            >
              {trip.title}
            </h1>

            {/* Subtitle */}
            <p className="text-white/80 text-lg mb-6">{trip.subtitle}</p>

            {/* Snapshot strip */}
            <div
              className="inline-flex flex-wrap justify-center gap-4 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
              data-testid="snapshot-strip"
            >
              <span className="flex items-center gap-2 text-white text-sm">
                <MapPin className="w-4 h-4 text-amber-400" />
                {regions}
              </span>
              <span className="flex items-center gap-2 text-white text-sm">
                <Calendar className="w-4 h-4 text-amber-400" />
                {formatDuration(trip.duration_days)}
              </span>
              <span className="flex items-center gap-2 text-white text-sm">
                <Compass className="w-4 h-4 text-amber-400" />
                {getComfortTierDisplay(trip.comfort_tier)}
              </span>
              <span className="flex items-center gap-2 text-white text-sm">
                <DollarSign className="w-4 h-4 text-amber-400" />
                {formatCostBand(trip.cost_band)}
              </span>
              <span className="flex items-center gap-2 text-white text-sm">
                <Sun className="w-4 h-4 text-amber-400" />
                {formatBestMonths(trip.best_months)}
              </span>
            </div>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {/* Core parks/areas */}
        <section className="mb-8" data-testid="section-parks">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-3">
            Core destinations
          </h2>
          <div className="flex flex-wrap gap-2">
            {trip.core_parks_or_areas.map((area) => (
              <span
                key={area}
                className="px-3 py-1.5 bg-white border border-stone-200 text-stone-700 text-sm rounded-lg"
              >
                {area}
              </span>
            ))}
          </div>
        </section>

        {/* What this trip is for */}
        <section className="mb-8" data-testid="section-fit">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-3">
            What this trip is for
          </h2>
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-stone-700 leading-relaxed">{trip.what_this_trip_is_for}</p>
            </div>
            {/* Traveler fit tags */}
            <div className="mt-4 pt-4 border-t border-stone-100">
              <p className="text-xs text-stone-500 mb-2">Best suited for:</p>
              <div className="flex flex-wrap gap-2">
                {trip.traveler_fit.map((fit) => (
                  <span
                    key={fit}
                    className="px-2.5 py-1 bg-stone-100 text-stone-600 text-xs rounded-full"
                  >
                    {fit.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What you trade off */}
        <section className="mb-8" data-testid="section-tradeoffs">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-3">
            What you trade off
          </h2>
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <ul className="space-y-3" data-testid="tradeoffs-list">
              {trip.what_you_trade_off.map((tradeoff, index) => (
                <li key={index} className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-stone-700">{tradeoff}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* What your days look like */}
        <TypicalDaySection primaryDestination={getPrimaryDestination(trip)} />

        {/* Where you'll stay */}
        <AccommodationSection
          primaryDestination={getPrimaryDestination(trip)}
          comfortTier={trip.comfort_tier}
        />

        {/* Typical cost range */}
        <section className="mb-8" data-testid="section-cost">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-3">
            Typical cost range
          </h2>
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <div className="flex items-center gap-4 mb-3">
              <DollarSign className="w-6 h-6 text-amber-600" />
              <span className="text-2xl font-semibold text-stone-900">
                {formatCostBand(trip.cost_band)}
              </span>
            </div>
            <p className="text-stone-600 text-sm">{trip.cost_band.note}</p>
            <p className="text-stone-500 text-xs mt-3">
              Based on 2024 operator rates. Actual costs vary by season, accommodation choice, and group size.
            </p>
          </div>
        </section>

        {/* Decisions to confirm */}
        {decisionLinks.length > 0 && (
          <section className="mb-8" data-testid="section-decisions">
            <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-3">
              Decisions to confirm before you book
            </h2>
            <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
              {decisionLinks.map((link) => (
                <Link
                  key={link.topicId}
                  href={link.href}
                  className="flex items-center justify-between px-6 py-4 hover:bg-stone-50 transition-colors group"
                  title={link.title}
                  prefetch={false}
                  data-testid="decision-link"
                >
                  <span className="text-stone-700 group-hover:text-amber-700 transition-colors">
                    {link.anchorText}
                  </span>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-colors" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Guides worth reading */}
        {guideLinks.length > 0 && (
          <section className="mb-8" data-testid="section-guides">
            <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-3">
              Guides worth reading
            </h2>
            <div className="grid gap-3">
              {guideLinks.map((link) => (
                <Link
                  key={link.slug}
                  href={link.href}
                  className="flex items-center gap-4 bg-white rounded-xl border border-stone-200 px-6 py-4 hover:bg-stone-50 hover:border-stone-300 transition-all group"
                  title={link.title}
                  prefetch={false}
                  data-testid="guide-link"
                >
                  <BookOpen className="w-5 h-5 text-stone-400 group-hover:text-amber-600 transition-colors" />
                  <span className="text-stone-700 group-hover:text-amber-700 transition-colors">
                    {link.anchorText}
                  </span>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-colors ml-auto" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Variants section */}
        <section className="mb-8" data-testid="section-variants">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-3">
            Variants
          </h2>
          <p className="text-stone-500 text-sm mb-4">
            The same route can work at different comfort levels
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {variants.map((variant) => (
              <div
                key={variant.id}
                className={`bg-white rounded-xl border p-5 ${
                  variant.id === 'primary'
                    ? 'border-amber-300 ring-1 ring-amber-100'
                    : 'border-stone-200'
                }`}
                data-testid="variant-card"
              >
                {variant.id === 'primary' && (
                  <span className="text-xs text-amber-600 font-medium mb-2 block">
                    This trip shape
                  </span>
                )}
                <h3 className="font-medium text-stone-900 mb-1">{variant.label}</h3>
                <p className="text-sm text-stone-600 mb-2">{variant.description}</p>
                <p className="text-xs text-stone-500">{variant.differentiator}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Assurance callout (if relevant) */}
        {trip.assurance_relevance && (
          <section className="mb-8" data-testid="section-assurance">
            <div className="bg-stone-100 rounded-xl p-6">
              <h3 className="font-medium text-stone-900 mb-2">
                High-stakes decisions ahead
              </h3>
              <p className="text-stone-600 text-sm mb-4">
                This trip shape involves significant trade-offs. Consider Decision Assurance
                for an evidence-backed review of your specific situation before committing.
              </p>
              <Link
                href="/assurance/checkout"
                className="inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 font-medium"
              >
                Learn about Decision Assurance
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        {/* Plan This Safari CTA */}
        <section className="mb-8" data-testid="section-inquiry">
          <Link
            href={`/inquire?trip_id=${id}${trip.linked_decisions.length > 0 ? `&selected_decision_ids=${encodeURIComponent(trip.linked_decisions.slice(0, 6).join(','))}` : ''}`}
            className="flex items-center justify-between p-6 bg-stone-900 rounded-xl text-white group hover:bg-stone-800 transition-colors"
            data-testid="inquiry-cta"
            prefetch={false}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Compass className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="font-medium text-lg">Plan this safari with Safari Index</p>
                <p className="text-stone-400 text-sm">
                  Private, custom-built around your dates and preferences
                </p>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-stone-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </Link>
        </section>

        {/* Close framing */}
        <div className="mt-12 pt-8 border-t border-stone-200">
          <p className="text-stone-500 text-sm">
            This is a Safari Index-operated itinerary shape. Every trip is custom-built.{' '}
            <Link
              href="/trips"
              className="text-amber-600 hover:text-amber-700 underline underline-offset-2"
            >
              Browse other safaris
            </Link>{' '}
            or{' '}
            <Link
              href="/decisions"
              className="text-amber-600 hover:text-amber-700 underline underline-offset-2"
            >
              explore the decisions that shape your trip
            </Link>
            .
          </p>
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
