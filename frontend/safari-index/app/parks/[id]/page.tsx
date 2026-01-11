/**
 * Individual Park/Reserve Page
 *
 * Dedicated pages for each game park/reserve with:
 * - Facts and key stats
 * - Wildlife sightings with probabilities
 * - Seasonal recommendations
 * - Activities available
 * - Trade-offs and fit
 * - Related content links
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  ChevronRight,
  ArrowRight,
  Calendar,
  MapPin,
  Users,
  AlertCircle,
  Check,
  Info,
  Compass,
  TreePine,
  Footprints,
  Sun,
  CloudRain,
} from 'lucide-react';
import { Navbar, Footer } from '../../components/layout';
import {
  ImageBand,
  ImageBandContent,
  getImagesByTag,
} from '../../components/visual';
import {
  getParkById,
  getAllParkIds,
  formatParkType,
  getProbabilityDisplay,
  type GamePark,
  type WildlifeSpecies,
} from '../../content/parks';
import { getItinerarySummaries, formatDurationBand } from '../../content/itineraries';

/**
 * Generate static params for all parks
 */
export function generateStaticParams() {
  const parkIds = getAllParkIds();
  return parkIds.map((id) => ({ id }));
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const park = getParkById(id);

  if (!park) {
    return { title: 'Park Not Found' };
  }

  return {
    title: `${park.name} Safari Guide | Wildlife, Seasons & Activities`,
    description: `${park.tagline}. ${park.description.slice(0, 120)}...`,
    openGraph: {
      title: `${park.name} Safari Guide`,
      description: park.tagline,
    },
  };
}

/**
 * Get park hero image based on ecosystem
 */
function getParkImage(park: GamePark) {
  const ecosystemImages = getImagesByTag(park.ecosystem);
  if (ecosystemImages.length > 0) {
    return ecosystemImages[0];
  }
  // Fallback
  return { src: '/images/ecosystems/savannah-morning.jpg', alt: 'Safari landscape' };
}

/**
 * Facts grid component
 */
function FactsSection({ park }: { park: GamePark }) {
  return (
    <section className="mb-8">
      <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4 flex items-center gap-2">
        <Info className="w-5 h-5 text-amber-600" />
        Key Facts
      </h2>
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-y divide-stone-100">
          {park.facts.map((fact, idx) => (
            <div key={idx} className="p-4">
              <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">{fact.label}</p>
              <p className="text-sm font-medium text-stone-900">{fact.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Wildlife section with probability indicators
 */
function WildlifeSection({ park }: { park: GamePark }) {
  // Group by probability
  const guaranteed = park.wildlife.filter(w => w.probability === 'guaranteed');
  const veryLikely = park.wildlife.filter(w => w.probability === 'very-likely');
  const likely = park.wildlife.filter(w => w.probability === 'likely');
  const possible = park.wildlife.filter(w => w.probability === 'possible' || w.probability === 'rare');

  const WildlifeRow = ({ species }: { species: WildlifeSpecies }) => {
    const display = getProbabilityDisplay(species.probability);
    return (
      <div className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
        <div className="flex-1">
          <span className="text-sm text-stone-900">{species.name}</span>
          {species.notes && (
            <span className="text-xs text-stone-500 ml-2">({species.notes})</span>
          )}
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${display.color}`}>
          {display.label}
        </span>
      </div>
    );
  };

  return (
    <section className="mb-8">
      <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4 flex items-center gap-2">
        <TreePine className="w-5 h-5 text-amber-600" />
        Wildlife
      </h2>

      {/* Signature species callout */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
        <p className="text-xs text-amber-700 uppercase tracking-wide mb-2">Signature Species</p>
        <div className="flex flex-wrap gap-2">
          {park.signatureSpecies.map((species, idx) => (
            <span key={idx} className="px-3 py-1 bg-white border border-amber-200 text-amber-800 text-sm rounded-full">
              {species}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200">
          {/* High probability */}
          <div className="p-4">
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-3">
              High Probability
            </p>
            <div className="space-y-0">
              {[...guaranteed, ...veryLikely].map((species, idx) => (
                <WildlifeRow key={idx} species={species} />
              ))}
            </div>
          </div>

          {/* Lower probability */}
          <div className="p-4">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">
              Moderate to Rare
            </p>
            <div className="space-y-0">
              {[...likely, ...possible].map((species, idx) => (
                <WildlifeRow key={idx} species={species} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Seasons section
 */
function SeasonsSection({ park }: { park: GamePark }) {
  return (
    <section className="mb-8">
      <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-amber-600" />
        Best Time to Visit
      </h2>

      {/* Best time callout */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
        <p className="text-sm text-green-800">
          <span className="font-medium">Recommended:</span> {park.bestTime}
        </p>
      </div>

      <div className="space-y-3">
        {park.seasons.map((season, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-xl border p-4 ${
              season.recommended
                ? 'border-green-200 bg-green-50/30'
                : 'border-stone-200'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-medium text-stone-900 flex items-center gap-2">
                  {season.recommended ? (
                    <Sun className="w-4 h-4 text-amber-500" />
                  ) : (
                    <CloudRain className="w-4 h-4 text-stone-400" />
                  )}
                  {season.name}
                </h3>
                <p className="text-sm text-stone-500">{season.months}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  season.crowds === 'peak' ? 'bg-red-100 text-red-700' :
                  season.crowds === 'high' ? 'bg-amber-100 text-amber-700' :
                  season.crowds === 'moderate' ? 'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {season.crowds} crowds
                </span>
                {season.recommended && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                    Recommended
                  </span>
                )}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-stone-500">Conditions:</span>{' '}
                <span className="text-stone-700">{season.conditions}</span>
              </div>
              <div>
                <span className="text-stone-500">Wildlife:</span>{' '}
                <span className="text-stone-700">{season.wildlife}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Activities section
 */
function ActivitiesSection({ park }: { park: GamePark }) {
  const available = park.activities.filter(a => a.available);
  const notAvailable = park.activities.filter(a => !a.available);

  return (
    <section className="mb-8">
      <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4 flex items-center gap-2">
        <Footprints className="w-5 h-5 text-amber-600" />
        Activities
      </h2>
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200">
          {/* Available */}
          <div className="p-4">
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-3">
              Available
            </p>
            <ul className="space-y-2">
              {available.map((activity, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-stone-900">{activity.name}</span>
                    {activity.notes && (
                      <p className="text-xs text-stone-500">{activity.notes}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Not available */}
          {notAvailable.length > 0 && (
            <div className="p-4">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">
                Not Available
              </p>
              <ul className="space-y-2">
                {notAvailable.map((activity, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-sm text-stone-500">{activity.name}</span>
                      {activity.notes && (
                        <p className="text-xs text-stone-400">{activity.notes}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * Advisory panel - fit and trade-offs
 */
function AdvisoryPanel({ park }: { park: GamePark }) {
  return (
    <section className="mb-8">
      <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
        Is {park.name} Right for You?
      </h2>
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {/* Best for */}
        <div className="p-4 border-b border-stone-200">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-green-600" />
            <p className="text-sm font-medium text-green-800">Best for</p>
          </div>
          <p className="text-sm text-stone-600">{park.bestFor}</p>
        </div>

        {/* Trade-offs */}
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200">
          <div className="p-4">
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">
              What You Gain
            </p>
            <ul className="space-y-1.5">
              {park.tradeoffs.gains.map((gain, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-green-600">+</span>
                  <span className="text-stone-700">{gain}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">
              What You Trade
            </p>
            <ul className="space-y-1.5">
              {park.tradeoffs.losses.map((loss, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-amber-600">-</span>
                  <span className="text-stone-600">{loss}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Practical info section
 */
function PracticalSection({ park }: { park: GamePark }) {
  return (
    <section className="mb-8">
      <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4 flex items-center gap-2">
        <Compass className="w-5 h-5 text-amber-600" />
        Practical Information
      </h2>
      <div className="bg-white rounded-xl border border-stone-200 p-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Getting There</p>
            <p className="text-sm text-stone-900">{park.accessInfo}</p>
          </div>
          <div>
            <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Typical Stay</p>
            <p className="text-sm text-stone-900">{park.typicalStay}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Related parks section
 */
function RelatedParksSection({ park }: { park: GamePark }) {
  const relatedParks = park.relatedParks
    .map(id => getParkById(id))
    .filter((p): p is GamePark => p !== undefined)
    .slice(0, 4);

  if (relatedParks.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="font-editorial text-lg font-semibold text-stone-900 mb-4">
        Compare With
      </h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {relatedParks.map((related) => (
          <Link
            key={related.id}
            href={`/parks/${related.id}`}
            className="flex items-center gap-3 p-3 bg-white border border-stone-200 rounded-xl hover:border-amber-300 hover:bg-amber-50 transition-colors"
          >
            <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-900 truncate">{related.name}</p>
              <p className="text-xs text-stone-500 truncate">{related.bestFor}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-300" />
          </Link>
        ))}
      </div>
    </section>
  );
}

/**
 * Related itineraries section
 */
function RelatedItinerariesSection({ park }: { park: GamePark }) {
  const allItineraries = getItinerarySummaries();
  // Filter itineraries that might include this park (by destination region match)
  const relatedItineraries = allItineraries
    .filter(it => it.region === park.destinationId ||
                  it.id.includes(park.destinationId) ||
                  it.id.includes(park.id))
    .slice(0, 3);

  if (relatedItineraries.length === 0) return null;

  return (
    <section className="mb-8 bg-stone-50 rounded-xl p-5">
      <h2 className="font-editorial text-lg font-semibold text-stone-900 mb-4">
        Itineraries Including {park.name.split(' ')[0]}
      </h2>
      <div className="grid sm:grid-cols-3 gap-3">
        {relatedItineraries.map((itinerary) => (
          <Link
            key={itinerary.id}
            href={`/itineraries/${itinerary.slug}`}
            className="block p-3 bg-white border border-stone-200 rounded-lg hover:border-amber-300 transition-colors"
          >
            <p className="text-sm font-medium text-stone-900 line-clamp-2">{itinerary.title}</p>
            <p className="text-xs text-stone-500 mt-1">{formatDurationBand(itinerary.duration_band)}</p>
          </Link>
        ))}
      </div>
      <Link
        href={`/itineraries?destination=${park.destinationId}`}
        className="inline-flex items-center gap-1 text-sm text-amber-700 hover:text-amber-800 mt-3"
      >
        View all itineraries <ArrowRight className="w-3 h-3" />
      </Link>
    </section>
  );
}

/**
 * Main park page component
 */
export default async function ParkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const park = getParkById(id);

  if (!park) {
    notFound();
  }

  const parkImage = getParkImage(park);

  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar variant="transparent" />

      {/* Hero */}
      <ImageBand image={parkImage} height="compare" overlay="strong" alwaysRender>
        <ImageBandContent maxWidth="narrow" className="pt-24 pb-8">
          <div>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-white/70 text-sm mb-3">
              <Link href="/destinations" className="hover:text-white transition-colors">
                Destinations
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link
                href={`/destinations/${park.destinationId}`}
                className="hover:text-white transition-colors capitalize"
              >
                {park.destinationId.replace('-', ' ')}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">Parks</span>
            </nav>

            {/* Park type badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                {formatParkType(park.type)}
              </span>
              <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full capitalize">
                {park.ecosystem}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-editorial text-3xl md:text-4xl font-bold text-white mb-2">
              {park.name}
            </h1>

            {/* Tagline */}
            <p className="text-white/90 text-lg">{park.tagline}</p>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Description */}
      <section className="bg-white py-6 border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <p className="text-stone-700 leading-relaxed">{park.description}</p>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
        {/* Facts */}
        <FactsSection park={park} />

        {/* Wildlife */}
        <WildlifeSection park={park} />

        {/* Seasons */}
        <SeasonsSection park={park} />

        {/* Advisory Panel */}
        <AdvisoryPanel park={park} />

        {/* CTA */}
        <div className="mb-8 bg-gradient-to-r from-amber-50 to-stone-50 rounded-xl border border-amber-200/50 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-stone-900 font-medium">
                Want to visit {park.name.split(' ')[0]}?
              </p>
              <p className="text-stone-500 text-sm mt-0.5">
                We'll build an itinerary around your preferences
              </p>
            </div>
            <Link
              href={`/inquire?destination=${park.destinationId}&park=${park.id}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors text-sm whitespace-nowrap"
            >
              Start planning
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Activities */}
        <ActivitiesSection park={park} />

        {/* Practical Info */}
        <PracticalSection park={park} />

        {/* Related Itineraries */}
        <RelatedItinerariesSection park={park} />

        {/* Related Parks */}
        <RelatedParksSection park={park} />

        {/* Back to destination */}
        <div className="pt-6 border-t border-stone-200 text-center">
          <Link
            href={`/destinations/${park.destinationId}`}
            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-amber-700 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to {park.destinationId.replace('-', ' ')} destination
          </Link>
        </div>
      </div>

      <Footer variant="operator" />
    </main>
  );
}
