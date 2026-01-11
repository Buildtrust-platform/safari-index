/**
 * Itinerary Detail Page
 *
 * Production-ready itinerary page with:
 * - Hero and snapshot strip
 * - Route overview (segment list)
 * - What your days look like
 * - Activities included
 * - Decisions to confirm before booking
 * - Variants available
 * - Cost band explanation
 * - CTA to inquiry (prefilled)
 *
 * Per governance:
 * - Documentary, operator-grade tone
 * - No hype or urgency
 * - No pricing - cost bands only
 * - No booking logic
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  MapPin,
  ChevronRight,
  ArrowRight,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Plane,
  Car,
  Tent,
  Layers,
  Sun,
  Users,
  HelpCircle,
} from 'lucide-react';
import { Navbar, Footer } from '../../components/layout';
import { ImageBand, ImageBandContent, ecosystemImages, RouteMap } from '../../components/visual';
import { ProvenanceSection } from '../../components/itineraries';
import { ItineraryJsonLd, getBaseUrl } from './ItineraryJsonLd';
import {
  getItineraryBySlug,
  getAllItineraries,
  formatDurationBand,
  type Itinerary,
  type ItinerarySegment,
} from '../../content/itineraries';
import {
  formatCostBand,
  getRegionDisplayName,
  getComfortTierDisplay,
} from '../../content/trip-shapes/trips';
import { getActivityById } from '../../content/activities';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate static params for all itineraries
 */
export async function generateStaticParams() {
  const itineraries = getAllItineraries();
  return itineraries.map((itinerary) => ({
    slug: itinerary.slug,
  }));
}

/**
 * Generate metadata for each itinerary
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const itinerary = getItineraryBySlug(resolvedParams.slug);

  if (!itinerary) {
    return {
      title: 'Itinerary Not Found | Vurara Safaris',
    };
  }

  return {
    title: `${itinerary.title} | Vurara Safaris`,
    description: itinerary.meta_description,
    robots: 'index, follow',
    alternates: {
      canonical: `/itineraries/${itinerary.slug}`,
    },
    openGraph: {
      title: `${itinerary.title} | Vurara Safaris`,
      description: itinerary.meta_description,
      type: 'website',
      url: `/itineraries/${itinerary.slug}`,
    },
  };
}

/**
 * Style tag display
 */
const STYLE_DISPLAY: Record<string, { label: string; color: string }> = {
  'first-safari': { label: 'First Safari', color: 'bg-green-100 text-green-700' },
  migration: { label: 'Migration', color: 'bg-amber-100 text-amber-700' },
  family: { label: 'Family', color: 'bg-blue-100 text-blue-700' },
  luxury: { label: 'Luxury', color: 'bg-purple-100 text-purple-700' },
  value: { label: 'Value', color: 'bg-emerald-100 text-emerald-700' },
  adventure: { label: 'Adventure', color: 'bg-orange-100 text-orange-700' },
  honeymoon: { label: 'Honeymoon', color: 'bg-pink-100 text-pink-700' },
  photography: { label: 'Photography', color: 'bg-indigo-100 text-indigo-700' },
  walking: { label: 'Walking', color: 'bg-teal-100 text-teal-700' },
  primate: { label: 'Primate', color: 'bg-lime-100 text-lime-700' },
  'self-drive': { label: 'Self-Drive', color: 'bg-slate-100 text-slate-700' },
  'fly-in': { label: 'Fly-In', color: 'bg-sky-100 text-sky-700' },
  'beach-combo': { label: 'Beach Combo', color: 'bg-cyan-100 text-cyan-700' },
};

function StyleBadge({ style }: { style: string }) {
  const config = STYLE_DISPLAY[style] || { label: style, color: 'bg-stone-100 text-stone-600' };
  return (
    <span className={`px-3 py-1 text-sm font-medium rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
}

/**
 * Snapshot strip component
 */
function SnapshotStrip({ itinerary }: { itinerary: Itinerary }) {
  const regionName = getRegionDisplayName(itinerary.region);
  const tierDisplay = getComfortTierDisplay(itinerary.comfort_tier);

  return (
    <div className="bg-white border-b border-stone-200 py-4" data-testid="snapshot-strip">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-stone-600">
            <MapPin className="w-4 h-4 text-amber-600" />
            <span>{regionName}</span>
          </div>
          <div className="flex items-center gap-2 text-stone-600">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>{formatDurationBand(itinerary.duration_band)}</span>
          </div>
          <div className="flex items-center gap-2 text-stone-600">
            <DollarSign className="w-4 h-4 text-amber-600" />
            <span>{formatCostBand(itinerary.cost_band)}</span>
          </div>
          <div className="flex items-center gap-2 text-stone-600">
            <Tent className="w-4 h-4 text-amber-600" />
            <span>{tierDisplay}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Segment card component
 */
function SegmentCard({
  segment,
  isLast,
}: {
  segment: ItinerarySegment;
  isLast: boolean;
}) {
  const nights = Array.isArray(segment.nights)
    ? `${segment.nights[0]}–${segment.nights[1]} nights`
    : `${segment.nights} ${segment.nights === 1 ? 'night' : 'nights'}`;

  return (
    <div className="relative" data-testid="segment-card">
      {/* Connection line */}
      {!isLast && (
        <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-stone-200" />
      )}

      <div className="flex gap-4">
        {/* Order badge */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-600 text-white flex items-center justify-center font-semibold text-lg">
          {segment.order}
        </div>

        {/* Content */}
        <div className="flex-1 pb-8">
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-editorial text-lg font-semibold text-stone-900">
                  {segment.title}
                </h3>
                <p className="text-sm text-stone-500 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {segment.location}
                </p>
              </div>
              <span className="text-sm font-medium text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                {nights}
              </span>
            </div>

            <p className="text-stone-600 mb-4">{segment.description}</p>

            {/* Highlights */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
                Highlights
              </p>
              <ul className="space-y-1.5">
                {segment.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-stone-600">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            {/* Transfers */}
            <div className="flex gap-4 text-xs text-stone-500 pt-3 border-t border-stone-100">
              <div className="flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5" />
                <span>In: {segment.transfers.arrival}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5" />
                <span>Out: {segment.transfers.departure}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Typical day section
 */
function TypicalDaySection({ segment }: { segment: ItinerarySegment }) {
  const dayParts = segment.typical_day;
  const parts = [
    { key: 'dawn', label: 'Dawn', time: '5:30–6:30' },
    { key: 'morning', label: 'Morning', time: '7:00–12:00' },
    { key: 'midday', label: 'Midday', time: '12:00–15:00' },
    { key: 'afternoon', label: 'Afternoon', time: '15:00–18:00' },
    { key: 'evening', label: 'Evening', time: '18:00–21:00' },
    { key: 'night', label: 'Night', time: '21:00+' },
  ];

  return (
    <div className="space-y-2">
      {parts.map((part) => {
        const description = dayParts[part.key as keyof typeof dayParts];
        if (!description) return null;
        return (
          <div key={part.key} className="flex gap-4">
            <div className="w-24 flex-shrink-0">
              <span className="text-xs font-medium text-stone-500">{part.label}</span>
              <p className="text-xs text-stone-400">{part.time}</p>
            </div>
            <p className="text-sm text-stone-600">{description}</p>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Activities section
 */
function ActivitiesSection({ itinerary }: { itinerary: Itinerary }) {
  const includedActivities = itinerary.included_activities
    .map((id) => getActivityById(id))
    .filter(Boolean);
  const optionalActivities = itinerary.optional_activities
    .map((id) => getActivityById(id))
    .filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Included */}
      <div>
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">
          Included Activities
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {includedActivities.map((activity) => (
            <div
              key={activity!.id}
              className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg"
            >
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm text-stone-700">{activity!.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Optional */}
      {optionalActivities.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">
            Optional (additional cost)
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {optionalActivities.map((activity) => (
              <div
                key={activity!.id}
                className="flex items-center gap-2 px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg"
              >
                <span className="text-sm text-stone-600">{activity!.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Variants section
 */
function VariantsSection({ itinerary }: { itinerary: Itinerary }) {
  const { variant_options } = itinerary;

  return (
    <div className="space-y-6">
      {/* Accommodation tiers */}
      <div>
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">
          Accommodation Options
        </p>
        <div className="flex flex-wrap gap-2">
          {variant_options.accommodation_tiers.map((tier) => (
            <span
              key={tier}
              className="px-3 py-1.5 text-sm bg-white border border-stone-200 rounded-lg text-stone-600"
            >
              {tier.charAt(0).toUpperCase() + tier.slice(1).replace('-', ' ')}
            </span>
          ))}
        </div>
      </div>

      {/* Travel modes */}
      <div>
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">
          Travel Modes
        </p>
        <div className="flex flex-wrap gap-2">
          {variant_options.travel_modes.map((mode) => (
            <span
              key={mode}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white border border-stone-200 rounded-lg text-stone-600"
            >
              {mode === 'fly' && <Plane className="w-4 h-4" />}
              {mode === 'drive' && <Car className="w-4 h-4" />}
              {mode === 'mixed' && <Layers className="w-4 h-4" />}
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </span>
          ))}
        </div>
      </div>

      {/* Extensions */}
      {variant_options.extensions.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">
            Available Extensions
          </p>
          <div className="space-y-2">
            {variant_options.extensions.map((ext) => (
              <div
                key={ext.id}
                className="p-3 bg-white border border-stone-200 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-stone-800">{ext.name}</p>
                    <p className="text-sm text-stone-500">{ext.description}</p>
                  </div>
                  <span className="text-xs text-stone-500 whitespace-nowrap">
                    +{ext.adds_days} {ext.adds_days === 1 ? 'day' : 'days'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Advisory Panel - combines fit + trade-offs into single decision-focused section
 */
function AdvisoryPanel({ itinerary }: { itinerary: Itinerary }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      {/* Fit section - side by side */}
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-green-600" />
            <p className="text-sm font-medium text-green-800">Best for</p>
          </div>
          <p className="text-sm text-stone-600">{itinerary.who_this_is_for}</p>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <p className="text-sm font-medium text-amber-800">Not ideal for</p>
          </div>
          <p className="text-sm text-stone-600">{itinerary.who_this_is_not_for}</p>
        </div>
      </div>

      {/* Trade-offs - compact list */}
      {itinerary.trade_offs.length > 0 && (
        <div className="border-t border-stone-200 p-4 bg-stone-50">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">Trade-offs</p>
          <div className="grid md:grid-cols-2 gap-2">
            {itinerary.trade_offs.map((tradeoff, idx) => (
              <div key={idx} className="flex gap-3 text-sm">
                <div className="flex-1">
                  <span className="text-green-700">{tradeoff.gain}</span>
                  <span className="text-stone-400 mx-1.5">/</span>
                  <span className="text-amber-700">{tradeoff.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Season section
 */
function SeasonSection({ itinerary }: { itinerary: Itinerary }) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="space-y-4">
      {itinerary.best_season_windows.map((season, idx) => (
        <div key={idx} className="p-4 bg-white border border-stone-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-600" />
              <p className="font-medium text-stone-800">{season.name}</p>
            </div>
            {season.is_peak && (
              <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">
                Peak
              </span>
            )}
          </div>
          <p className="text-sm text-stone-600 mb-2">{season.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {season.months.map((month) => (
              <span
                key={month}
                className="px-2 py-0.5 text-xs bg-stone-100 text-stone-600 rounded"
              >
                {monthNames[month - 1]}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Cost explanation section
 */
function CostSection({ itinerary }: { itinerary: Itinerary }) {
  return (
    <div className="p-5 bg-white border border-stone-200 rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
          <DollarSign className="w-6 h-6 text-amber-700" />
        </div>
        <div>
          <p className="font-editorial text-xl font-semibold text-stone-900">
            {formatCostBand(itinerary.cost_band)}
          </p>
          <p className="text-sm text-stone-500">Per person estimate</p>
        </div>
      </div>
      <p className="text-sm text-stone-600 mb-3">
        This cost band represents typical per-person pricing for this itinerary pattern.
        Actual costs vary based on accommodation tier, travel mode, season, and party size.
      </p>
      <p className="text-xs text-stone-500 italic">{itinerary.cost_band.note}</p>
    </div>
  );
}

/**
 * Itinerary Detail Page
 */
export default async function ItineraryDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const itinerary = getItineraryBySlug(resolvedParams.slug);

  if (!itinerary) {
    notFound();
  }

  const regionName = getRegionDisplayName(itinerary.region);
  const baseUrl = getBaseUrl();

  // Build inquiry URL with prefill params
  const inquiryParams = new URLSearchParams({
    itinerary: itinerary.id,
    region: itinerary.region,
  });

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <ItineraryJsonLd itinerary={itinerary} baseUrl={baseUrl} />

      <main className="min-h-screen bg-stone-50">
        <Navbar variant="transparent" />

      {/* Hero */}
      <ImageBand
        image={ecosystemImages.find((img) => img.id === 'savannah-morning') || ecosystemImages[0]}
        height="compare"
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
              <Link href="/itineraries" className="hover:text-white transition-colors">
                Itineraries
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{regionName}</span>
            </div>

            {/* Title */}
            <h1
              className="font-editorial text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-3"
              data-testid="itinerary-h1"
            >
              {itinerary.title}
            </h1>

            {/* Subtitle */}
            <p className="text-white/80 text-lg mb-6">{itinerary.subtitle}</p>

            {/* Style tags */}
            <div className="flex flex-wrap justify-center gap-2">
              {itinerary.style_tags.map((tag) => (
                <StyleBadge key={tag} style={tag} />
              ))}
            </div>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Snapshot strip */}
      <SnapshotStrip itinerary={itinerary} />

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {/* Unified Route Section - summary + map + segments */}
        <section className="mb-10" data-testid="route-section">
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            {/* Route header with summary */}
            <div className="p-5 border-b border-stone-200">
              <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-2">Your Route</h2>
              <p className="text-stone-600">{itinerary.route_summary}</p>
            </div>

            {/* Route Map */}
            <div className="p-5 border-b border-stone-200 bg-stone-50" data-testid="travel-map">
              <RouteMap
                segments={itinerary.core_segments.map((segment) => ({
                  id: segment.id,
                  location: segment.location,
                  order: segment.order,
                  nights: segment.nights,
                  travelMode: segment.transfers?.arrival?.toLowerCase().includes('flight') ||
                    segment.transfers?.arrival?.toLowerCase().includes('charter')
                    ? 'flight' as const
                    : 'road' as const,
                }))}
                region={itinerary.region}
              />
            </div>

            {/* Segment cards */}
            <div className="p-5">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-4">
                Route Details
              </p>
              <div className="space-y-0">
                {itinerary.core_segments.map((segment, idx) => (
                  <SegmentCard
                    key={segment.id}
                    segment={segment}
                    isLast={idx === itinerary.core_segments.length - 1}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sections */}
        <div className="space-y-10">
          {/* Typical Day + Activities side by side on desktop */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* What Your Days Look Like */}
            <section data-testid="typical-day">
              <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
                A Typical Day
              </h2>
              <div className="bg-white rounded-xl border border-stone-200 p-4 h-full">
                <p className="text-xs text-stone-500 mb-3">
                  Sample from {itinerary.core_segments[0]?.title || 'camp'}
                </p>
                <TypicalDaySection segment={itinerary.core_segments[0]} />
              </div>
            </section>

            {/* Activities */}
            <section data-testid="activities">
              <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
                Activities
              </h2>
              <div className="bg-white rounded-xl border border-stone-200 p-4 h-full">
                <ActivitiesSection itinerary={itinerary} />
              </div>
            </section>
          </div>

          {/* Advisory Panel - combined fit + trade-offs */}
          <section data-testid="advisory">
            <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
              Is This Right for You?
            </h2>
            <AdvisoryPanel itinerary={itinerary} />
          </section>

          {/* Inline CTA - placed after advisory for decision momentum */}
          <div className="bg-gradient-to-r from-amber-50 to-stone-50 rounded-xl border border-amber-200/50 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-stone-900 font-medium">
                  Like what you see?
                </p>
                <p className="text-stone-500 text-sm mt-0.5">
                  We'll customize this route around your preferences
                </p>
              </div>
              <Link
                href={`/inquire?${inquiryParams.toString()}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors text-sm whitespace-nowrap"
                prefetch={false}
                data-testid="inquire-cta"
              >
                Start planning
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Best Season + Provenance side by side */}
          <div className="grid lg:grid-cols-2 gap-6">
            <section data-testid="best-season">
              <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
                Best Time to Go
              </h2>
              <SeasonSection itinerary={itinerary} />
            </section>

            <div>
              <ProvenanceSection itinerary={itinerary} />
            </div>
          </div>

          {/* Customization + Cost side by side */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Variants/Customization - BEFORE cost */}
            <section data-testid="variants">
              <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
                Customization Options
              </h2>
              <div className="bg-white rounded-xl border border-stone-200 p-4">
                <VariantsSection itinerary={itinerary} />
              </div>
            </section>

            {/* Cost */}
            <section data-testid="cost">
              <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
                Cost Context
              </h2>
              <CostSection itinerary={itinerary} />
            </section>
          </div>

          {/* Decisions - compact, optional reading */}
          {itinerary.linked_decisions.length > 0 && (
            <section data-testid="decisions" className="bg-stone-50 rounded-xl p-5">
              <h2 className="font-editorial text-lg font-semibold text-stone-900 mb-3">
                Related Decisions
              </h2>
              <p className="text-sm text-stone-500 mb-4">
                Questions to consider before booking
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {itinerary.linked_decisions.slice(0, 6).map((decisionId) => (
                  <Link
                    key={decisionId}
                    href={`/decisions/${decisionId}`}
                    prefetch={false}
                    className="flex items-center gap-2 p-2.5 bg-white border border-stone-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-colors text-sm text-stone-700 hover:text-amber-700"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                    <span className="truncate">
                      {decisionId.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <Footer variant="operator" />
    </main>
    </>
  );
}
