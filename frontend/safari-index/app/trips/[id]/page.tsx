/**
 * Trip Archetype Page
 *
 * Vurara Safaris-operated itinerary shape with:
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
 * Positions Vurara Safaris as the operator.
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
import { Navbar, Footer } from '../../components/layout';
import { TypicalDaySection, AccommodationSection, CostSignalSection, ExclusionBlock } from '../../components/trips';

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
      title: 'Trip Not Found | Vurara Safaris',
    };
  }

  const regions = trip.regions
    .filter((r) => !['east-africa', 'southern-africa'].includes(r))
    .map((r) => getRegionDisplayName(r))
    .join(', ') || getRegionDisplayName(trip.regions[0]);

  return {
    title: `${trip.title} | Private Safari | Vurara Safaris`,
    description: `${trip.subtitle}. A Vurara Safaris-operated private safari: ${formatDuration(trip.duration_days)} in ${regions}. Custom-built around your decisions.`,
    robots: 'index, follow',
    alternates: {
      canonical: `/trips/${id}`,
    },
    openGraph: {
      title: `${trip.title} | Vurara Safaris`,
      description: `Private safari operated by Vurara Safaris. ${trip.what_this_trip_is_for}`,
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
                Vurara Safaris
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
              Vurara Safaris Operated
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

        {/* Advisory Panel - consolidated fit/trade-offs/exclusion */}
        <section className="mb-8" data-testid="section-advisory">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-3">
            Is this right for you?
          </h2>
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            {/* Fit + Trade-offs side by side */}
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200">
              {/* What this is for */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-medium text-green-800">Best for</p>
                </div>
                <p className="text-sm text-stone-600 mb-3">{trip.what_this_trip_is_for}</p>
                <div className="flex flex-wrap gap-1.5">
                  {trip.traveler_fit.map((fit) => (
                    <span
                      key={fit}
                      className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full"
                    >
                      {fit.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Trade-offs */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <p className="text-sm font-medium text-amber-800">Trade-offs</p>
                </div>
                <ul className="space-y-1.5" data-testid="tradeoffs-list">
                  {trip.what_you_trade_off.map((tradeoff, index) => (
                    <li key={index} className="text-sm text-stone-600 flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      {tradeoff}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </section>

        {/* Exclusions - compact version */}
        <ExclusionBlock trip={trip} />

        {/* Inline CTA - after suitability check */}
        <div className="mb-8 bg-gradient-to-r from-amber-50 to-stone-50 rounded-xl border border-amber-200/50 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-stone-900 font-medium">
                Looks like a fit?
              </p>
              <p className="text-stone-500 text-sm mt-0.5">
                We'll customize this around your dates and preferences
              </p>
            </div>
            <Link
              href={`/inquire?trip_id=${id}${trip.linked_decisions.length > 0 ? `&selected_decision_ids=${encodeURIComponent(trip.linked_decisions.slice(0, 6).join(','))}` : ''}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors text-sm whitespace-nowrap"
              prefetch={false}
              data-testid="inline-cta"
            >
              Plan this safari
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* What your days look like */}
        <TypicalDaySection primaryDestination={getPrimaryDestination(trip)} />

        {/* Where you'll stay */}
        <AccommodationSection
          primaryDestination={getPrimaryDestination(trip)}
          comfortTier={trip.comfort_tier}
        />

        {/* Typical cost range - Enhanced with logic disclaimers */}
        <CostSignalSection trip={trip} />

        {/* Decisions + Guides combined - compact grid */}
        {(decisionLinks.length > 0 || guideLinks.length > 0) && (
          <section className="mb-8 bg-stone-50 rounded-xl p-5" data-testid="section-resources">
            <h2 className="font-editorial text-lg font-semibold text-stone-900 mb-4">
              Before you book
            </h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {decisionLinks.slice(0, 4).map((link) => (
                <Link
                  key={link.topicId}
                  href={link.href}
                  className="flex items-center gap-2 p-3 bg-white border border-stone-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-colors text-sm"
                  title={link.title}
                  prefetch={false}
                  data-testid="decision-link"
                >
                  <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span className="text-stone-700 hover:text-amber-700 truncate">{link.anchorText}</span>
                </Link>
              ))}
              {guideLinks.slice(0, 2).map((link) => (
                <Link
                  key={link.slug}
                  href={link.href}
                  className="flex items-center gap-2 p-3 bg-white border border-stone-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-colors text-sm"
                  title={link.title}
                  prefetch={false}
                  data-testid="guide-link"
                >
                  <BookOpen className="w-4 h-4 text-stone-400 flex-shrink-0" />
                  <span className="text-stone-700 hover:text-amber-700 truncate">{link.anchorText}</span>
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
          <div className="mb-8 bg-stone-100 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-medium text-stone-900">High-stakes decisions ahead</p>
                <p className="text-stone-600 text-sm mt-0.5">
                  Consider Decision Assurance for evidence-backed guidance
                </p>
              </div>
              <Link
                href="/assurance/checkout"
                className="inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 font-medium whitespace-nowrap"
              >
                Learn more
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>

      <Footer variant="operator" />
    </main>
  );
}
