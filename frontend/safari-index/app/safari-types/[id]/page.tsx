/**
 * Safari Type Detail Page
 *
 * Deep dive into a specific safari type with:
 * - Hero with positioning line
 * - Attributes overview
 * - Characteristics and trade-offs
 * - Best for / Not ideal for
 * - Linked itineraries
 * - Related safari types
 *
 * Per governance:
 * - Documentary, operator-grade tone
 * - Explicit trade-offs
 * - No hype or emojis
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  ChevronRight,
  ArrowRight,
  Compass,
  Activity,
  Shield,
  Gauge,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Plus,
  Minus,
  MapPin,
  Clock,
  DollarSign,
} from 'lucide-react';
import { Navbar, Footer } from '../../components/layout';
import { ImageBand, ImageBandContent, ecosystemImages } from '../../components/visual';
import {
  getPublishedSafariTypes,
  getSafariTypeById,
  formatPace,
  formatPhysicalDemand,
  formatPrivacyLevel,
  type SafariType,
} from '../../content/safari-types';
import { getAllItineraries, formatDurationBand, type Itinerary } from '../../content/itineraries';
import { formatCostBand, getRegionDisplayName } from '../../content/trip-shapes/trips';

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Generate static params for all safari types
 */
export async function generateStaticParams() {
  const safariTypes = getPublishedSafariTypes();
  return safariTypes.map((st) => ({
    id: st.id,
  }));
}

/**
 * Generate metadata for each safari type
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const safariType = getSafariTypeById(resolvedParams.id);

  if (!safariType) {
    return {
      title: 'Safari Type Not Found | Safari Index',
    };
  }

  return {
    title: `${safariType.name} Safari | Safari Index`,
    description: `${safariType.positioning_line}. Learn about this safari style, who it's best for, and browse related itineraries.`,
    robots: 'index, follow',
    alternates: {
      canonical: `/safari-types/${safariType.id}`,
    },
    openGraph: {
      title: `${safariType.name} Safari | Safari Index`,
      description: safariType.positioning_line,
      type: 'website',
      url: `/safari-types/${safariType.id}`,
    },
  };
}

/**
 * Attribute card component
 */
function AttributeCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  description?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
          <Icon className="w-5 h-5 text-amber-700" />
        </div>
        <div>
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
            {label}
          </p>
          <p className="font-medium text-stone-900">{value}</p>
        </div>
      </div>
      {description && (
        <p className="text-sm text-stone-600 mt-2">{description}</p>
      )}
    </div>
  );
}

/**
 * Linked itinerary card
 */
function LinkedItineraryCard({ itinerary }: { itinerary: Itinerary }) {
  const regionName = getRegionDisplayName(itinerary.region);

  return (
    <Link
      href={`/itineraries/${itinerary.slug}`}
      prefetch={false}
      className="group block bg-white rounded-xl border border-stone-200 p-4 hover:border-amber-300 hover:shadow-md transition-all"
      data-testid="linked-itinerary-card"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-1">
            {itinerary.title}
          </h4>
          <p className="text-sm text-stone-500 line-clamp-2 mt-1">
            {itinerary.subtitle}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {regionName}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDurationBand(itinerary.duration_band)}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              {formatCostBand(itinerary.cost_band)}
            </span>
          </div>
        </div>

        <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-600 flex-shrink-0 transition-colors" />
      </div>
    </Link>
  );
}

/**
 * Related safari type card (compact)
 */
function RelatedTypeCard({ safariType }: { safariType: SafariType }) {
  return (
    <Link
      href={`/safari-types/${safariType.id}`}
      prefetch={false}
      className="group flex items-center justify-between p-3 bg-stone-50 rounded-lg hover:bg-amber-50 transition-colors"
      data-testid="related-type-card"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-800 group-hover:text-amber-700 line-clamp-1">
          {safariType.name}
        </p>
        <p className="text-xs text-stone-500 line-clamp-1">
          {safariType.positioning_line}
        </p>
      </div>
      <ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-amber-600 flex-shrink-0 ml-2" />
    </Link>
  );
}

export default async function SafariTypeDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const safariType = getSafariTypeById(resolvedParams.id);

  if (!safariType) {
    notFound();
  }

  // Get linked itineraries
  const allItineraries = getAllItineraries();
  const linkedItineraries = allItineraries.filter(
    (i) => i.safari_type_id === safariType.id && i.is_published
  );

  // Get related safari types (different types with similar traveler fits)
  const allSafariTypes = getPublishedSafariTypes();
  const relatedTypes = allSafariTypes.filter((st) => {
    if (st.id === safariType.id) return false;
    // Check for overlap in traveler fits
    return st.linked_traveler_fits.some((fit) =>
      safariType.linked_traveler_fits.includes(fit)
    );
  }).slice(0, 3);

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
              <Link href="/safari-types" className="hover:text-white transition-colors">
                Safari Types
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{safariType.name}</span>
            </div>

            {/* Icon + Title */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Compass className="w-6 h-6 text-amber-400" />
              </div>
              <h1
                className="font-editorial text-4xl md:text-5xl font-semibold text-white"
                data-testid="safari-type-h1"
              >
                {safariType.name}
              </h1>
            </div>

            {/* Positioning line */}
            <p className="text-white/90 text-xl max-w-xl mx-auto">
              {safariType.positioning_line}
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 mt-6 text-white/60 text-sm">
              <span>{linkedItineraries.length} itineraries</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>{formatPace(safariType.attributes.pace)}</span>
            </div>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Attributes strip */}
      <section className="bg-white border-b border-stone-200 py-6">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AttributeCard
              icon={Gauge}
              label="Pace"
              value={formatPace(safariType.attributes.pace)}
              description={safariType.attributes.activity_mix}
            />
            <AttributeCard
              icon={Activity}
              label="Physical Demand"
              value={formatPhysicalDemand(safariType.attributes.physical_demand)}
              description={safariType.attributes.vehicle_rules}
            />
            <AttributeCard
              icon={Shield}
              label="Privacy Level"
              value={formatPrivacyLevel(safariType.attributes.privacy_level)}
              description={safariType.attributes.accommodation_style}
            />
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Characteristics */}
            <section className="bg-white rounded-2xl border border-stone-200 p-6">
              <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
                Characteristics
              </h2>
              <ul className="space-y-3">
                {safariType.characteristics.map((char, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-stone-700">{char}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Trade-offs */}
            <section className="bg-white rounded-2xl border border-stone-200 p-6">
              <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
                Trade-offs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gains */}
                <div>
                  <p className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    What you gain
                  </p>
                  <ul className="space-y-2">
                    {safariType.tradeoffs.gains.map((gain, index) => (
                      <li key={index} className="flex items-start gap-2 text-stone-700 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                        {gain}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Losses */}
                <div>
                  <p className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Minus className="w-4 h-4" />
                    What you trade
                  </p>
                  <ul className="space-y-2">
                    {safariType.tradeoffs.losses.map((loss, index) => (
                      <li key={index} className="flex items-start gap-2 text-stone-700 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                        {loss}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Who is this for */}
            <section className="bg-white rounded-2xl border border-stone-200 p-6">
              <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
                Who is this for?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Best for */}
                <div>
                  <p className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-3">
                    Best for
                  </p>
                  <ul className="space-y-2">
                    {safariType.best_for.map((fit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-stone-700 text-sm">{fit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Not ideal for */}
                <div>
                  <p className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
                    Not ideal for
                  </p>
                  <ul className="space-y-2">
                    {safariType.not_ideal_for.map((fit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-stone-400" />
                        <span className="text-stone-600 text-sm">{fit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Linked itineraries */}
            {linkedItineraries.length > 0 && (
              <section className="bg-white rounded-2xl border border-stone-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-editorial text-xl font-semibold text-stone-900">
                    Itineraries in this style
                  </h2>
                  <Link
                    href="/itineraries"
                    prefetch={false}
                    className="text-sm text-amber-700 hover:text-amber-800 flex items-center gap-1"
                  >
                    View all
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {linkedItineraries.map((itinerary) => (
                    <LinkedItineraryCard key={itinerary.id} itinerary={itinerary} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick summary */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5">
              <h3 className="font-semibold text-stone-900 mb-4">Quick summary</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-stone-500">Pace</dt>
                  <dd className="text-stone-900 font-medium">
                    {formatPace(safariType.attributes.pace)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-stone-500">Physical demand</dt>
                  <dd className="text-stone-900 font-medium">
                    {formatPhysicalDemand(safariType.attributes.physical_demand)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-stone-500">Privacy</dt>
                  <dd className="text-stone-900 font-medium">
                    {formatPrivacyLevel(safariType.attributes.privacy_level)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-stone-500">Predictability</dt>
                  <dd className="text-stone-900 font-medium capitalize">
                    {safariType.attributes.predictability}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Primary regions */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5">
              <h3 className="font-semibold text-stone-900 mb-4">Primary regions</h3>
              <div className="flex flex-wrap gap-2">
                {safariType.primary_regions.map((region) => (
                  <Link
                    key={region}
                    href={`/destinations`}
                    prefetch={false}
                    className="px-3 py-1.5 text-sm bg-stone-100 text-stone-700 rounded-lg hover:bg-amber-100 hover:text-amber-700 transition-colors"
                  >
                    {getRegionDisplayName(region)}
                  </Link>
                ))}
              </div>
            </div>

            {/* Related types */}
            {relatedTypes.length > 0 && (
              <div className="bg-white rounded-2xl border border-stone-200 p-5">
                <h3 className="font-semibold text-stone-900 mb-4">Related safari types</h3>
                <div className="space-y-2">
                  {relatedTypes.map((type) => (
                    <RelatedTypeCard key={type.id} safariType={type} />
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 text-center">
              <h3 className="font-semibold text-stone-900 mb-2">
                Ready to explore?
              </h3>
              <p className="text-sm text-stone-600 mb-4">
                Browse itineraries matching this safari type
              </p>
              <Link
                href="/itineraries"
                prefetch={false}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
              >
                <span>View Itineraries</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
