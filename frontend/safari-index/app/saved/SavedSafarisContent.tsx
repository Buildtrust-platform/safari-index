'use client';

/**
 * SavedSafarisContent - Client component for the saved safaris page
 *
 * Displays saved trips and itineraries from localStorage with options to
 * remove items or clear all.
 */

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Heart,
  Trash2,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  ArrowRight,
  Compass,
  Route,
  FileText,
} from 'lucide-react';
import { useSavedSafarisLocal, type SavedItem } from '../components/ui/SavedSafaris';
import { getAllTrips, formatDuration, getRegionDisplayName, getComfortTierDisplay, formatCostBand, type TripArchetype } from '../content/trip-shapes/trips';
import { getAllItineraries, formatDurationBand, type ItinerarySummary } from '../content/itineraries';
import { getDestinationImage } from '../components/visual';

// Image mappings (same as in TripsContent and ItineraryList)
const tripImageMap: Record<string, { src: string; alt: string }> = {
  'classic-serengeti-ngorongoro': { src: '/images/destinations/tanzania-serengeti.jpg', alt: 'Serengeti plains at sunrise' },
  'migration-focused-serengeti': { src: '/images/activities/migration.jpg', alt: 'Great Migration wildebeest crossing' },
  'tanzania-southern-circuit': { src: '/images/library/wildlife/lion-couple-savanna.jpg', alt: 'Lions in Ruaha National Park' },
  'classic-kenya-safari': { src: '/images/destinations/kenya-mara.jpg', alt: 'Masai Mara landscape' },
  'kenya-conservancy-focused': { src: '/images/library/wildlife/lioness-tree-shade.jpg', alt: 'Lioness in private conservancy' },
  'okavango-delta-immersion': { src: '/images/destinations/botswana-delta.jpg', alt: 'Okavango Delta waterways' },
  'botswana-diverse-ecosystems': { src: '/images/ecosystems/delta-channels.jpg', alt: 'Diverse Botswana ecosystems' },
  'kruger-greater-kruger': { src: '/images/destinations/south-africa-kruger.jpg', alt: 'Greater Kruger wildlife' },
  'south-africa-combo': { src: '/images/destinations/south-africa-lodge.jpg', alt: 'South African safari lodge' },
  'rwanda-gorilla-focused': { src: '/images/destinations/rwanda-volcanoes.jpg', alt: 'Volcanoes National Park' },
  'uganda-primate-safari': { src: '/images/activities/gorilla-trekking.jpg', alt: 'Mountain gorilla encounter' },
  'namibia-highlights': { src: '/images/destinations/namibia-sossusvlei.jpg', alt: 'Sossusvlei dunes' },
  'namibia-self-drive': { src: '/images/library/destinations/ruacana-waterfall-namibia.jpg', alt: 'Namibia self-drive adventure' },
  'zambia-walking-safari': { src: '/images/destinations/zambia-luangwa.jpg', alt: 'South Luangwa walking safari' },
  'victoria-falls-safari-combo': { src: '/images/library/destinations/african-waterfall-aerial.jpg', alt: 'Victoria Falls aerial view' },
  'photography-focused-safari': { src: '/images/activities/photographic-hide.jpg', alt: 'Photography hide setup' },
  'family-multigenerational': { src: '/images/library/birding/family-camping-safari.jpg', alt: 'Family safari experience' },
  'honeymoon-romance-safari': { src: '/images/library/destinations/tanzania-wildlife-sunset-1.jpg', alt: 'Romantic safari sunset' },
  'budget-first-safari': { src: '/images/destinations/tanzania-ngorongoro.jpg', alt: 'Ngorongoro Crater' },
};

const itineraryImageMap: Record<string, { src: string; alt: string }> = {
  'tanzania-classic-northern-circuit': { src: '/images/library/destinations/zebras-wildebeest-ngorongoro.jpg', alt: 'Zebras and wildebeest grazing in Ngorongoro Crater' },
  'tanzania-great-migration': { src: '/images/activities/migration.jpg', alt: 'Great Migration river crossing' },
  'kenya-classic-safari': { src: '/images/library/wildlife/lion-portrait.jpg', alt: 'Lion in Masai Mara' },
  'botswana-okavango-delta': { src: '/images/destinations/botswana-delta.jpg', alt: 'Okavango Delta aerial view' },
  // Add more as needed - fallback will handle missing ones
};

function getTripImage(tripId: string, regions: string[]): { src: string; alt: string } {
  if (tripImageMap[tripId]) return tripImageMap[tripId];
  const regionMap: Record<string, string> = {
    'tanzania': 'tanzania', 'kenya': 'kenya', 'botswana': 'botswana',
    'south-africa': 'south-africa', 'namibia': 'namibia', 'uganda-rwanda': 'rwanda',
    'zambia': 'zambia', 'zimbabwe': 'zimbabwe',
  };
  for (const region of regions) {
    if (regionMap[region]) {
      const destImage = getDestinationImage(regionMap[region]);
      return { src: destImage.src, alt: destImage.alt };
    }
  }
  const fallback = getDestinationImage('tanzania');
  return { src: fallback.src, alt: fallback.alt };
}

function getItineraryImage(slug: string, region: string): { src: string; alt: string } {
  if (itineraryImageMap[slug]) return itineraryImageMap[slug];
  const destImage = getDestinationImage(region === 'uganda-rwanda' ? 'rwanda' : region);
  return { src: destImage.src, alt: destImage.alt };
}

type TabType = 'all' | 'trips' | 'itineraries';

export default function SavedSafarisContent() {
  const { savedItems, toggleSaved, clearAll } = useSavedSafarisLocal();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [allTrips, setAllTrips] = useState<TripArchetype[]>([]);
  const [allItineraries, setAllItineraries] = useState<ItinerarySummary[]>([]);

  // Load data on mount
  useEffect(() => {
    setAllTrips(getAllTrips());
    setAllItineraries(getAllItineraries());
  }, []);

  // Get saved trips and itineraries with full data
  const savedTrips = useMemo(() => {
    const tripIds = savedItems.filter((item) => item.type === 'trip').map((item) => item.id);
    return allTrips.filter((trip) => tripIds.includes(trip.id));
  }, [savedItems, allTrips]);

  const savedItineraries = useMemo(() => {
    const itineraryIds = savedItems.filter((item) => item.type === 'itinerary').map((item) => item.id);
    return allItineraries.filter((it) => itineraryIds.includes(it.slug));
  }, [savedItems, allItineraries]);

  // Filter based on active tab
  const displayedTrips = activeTab === 'itineraries' ? [] : savedTrips;
  const displayedItineraries = activeTab === 'trips' ? [] : savedItineraries;
  const totalDisplayed = displayedTrips.length + displayedItineraries.length;

  const handleRemove = (id: string, type: 'trip' | 'itinerary') => {
    toggleSaved(id, type);
  };

  // Empty state
  if (savedItems.length === 0) {
    return (
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-stone-300" />
          </div>
          <h2 className="text-xl font-semibold text-stone-900 mb-3">
            No saved safaris yet
          </h2>
          <p className="text-stone-500 mb-8 max-w-md mx-auto">
            Browse our trips and itineraries and click the heart icon to save ones you're interested in. They'll appear here for easy comparison.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/trips"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors"
            >
              <Route className="w-5 h-5" />
              Browse Trip Shapes
            </Link>
            <Link
              href="/itineraries"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-stone-900 rounded-xl font-medium border border-stone-200 hover:bg-stone-50 hover:border-stone-300 transition-colors"
            >
              <FileText className="w-5 h-5" />
              Browse Itineraries
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 md:px-8 py-10">
      {/* Header with tabs and clear all */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'all'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            All ({savedTrips.length + savedItineraries.length})
          </button>
          <button
            onClick={() => setActiveTab('trips')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'trips'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            Trips ({savedTrips.length})
          </button>
          <button
            onClick={() => setActiveTab('itineraries')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'itineraries'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            Itineraries ({savedItineraries.length})
          </button>
        </div>

        {/* Clear all button */}
        <button
          onClick={() => {
            if (confirm('Remove all saved safaris? This cannot be undone.')) {
              clearAll();
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-stone-500 hover:text-rose-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear all
        </button>
      </div>

      {/* Results */}
      {totalDisplayed === 0 ? (
        <div className="text-center py-12">
          <p className="text-stone-500">
            No {activeTab === 'trips' ? 'trips' : 'itineraries'} saved yet.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Trips section */}
          {displayedTrips.length > 0 && (
            <section>
              {activeTab === 'all' && (
                <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
                  <Route className="w-5 h-5 text-amber-600" />
                  Trip Shapes
                </h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {displayedTrips.map((trip) => (
                  <SavedTripCard
                    key={trip.id}
                    trip={trip}
                    onRemove={() => handleRemove(trip.id, 'trip')}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Itineraries section */}
          {displayedItineraries.length > 0 && (
            <section>
              {activeTab === 'all' && (
                <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-600" />
                  Day-by-Day Itineraries
                </h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {displayedItineraries.map((itinerary) => (
                  <SavedItineraryCard
                    key={itinerary.id}
                    itinerary={itinerary}
                    onRemove={() => handleRemove(itinerary.slug, 'itinerary')}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* CTA section */}
      <div className="mt-12 pt-8 border-t border-stone-200">
        <div className="bg-gradient-to-r from-amber-50 to-stone-50 rounded-2xl border border-amber-200/50 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-editorial text-xl text-stone-900 mb-2">
                Ready to plan your safari?
              </h3>
              <p className="text-stone-600">
                Share your saved choices with us and we'll help you customize the perfect trip.
              </p>
            </div>
            <Link
              href="/inquire"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors whitespace-nowrap"
            >
              Start planning
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * SavedTripCard - Card for displaying a saved trip
 */
function SavedTripCard({
  trip,
  onRemove,
}: {
  trip: TripArchetype;
  onRemove: () => void;
}) {
  const regions = trip.regions
    .filter((r) => !['east-africa', 'southern-africa'].includes(r))
    .slice(0, 2)
    .map((r) => getRegionDisplayName(r))
    .join(', ') || getRegionDisplayName(trip.regions[0]);

  const image = getTripImage(trip.id, trip.regions);

  return (
    <div className="group relative bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md hover:border-amber-300 transition-all">
      {/* Remove button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          onRemove();
        }}
        className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/90 text-rose-500 hover:bg-rose-100 shadow-sm backdrop-blur-sm transition-all"
        aria-label="Remove from saved"
      >
        <Heart className="w-4 h-4 fill-current" />
      </button>

      <Link href={`/trips/${trip.id}`} prefetch={false}>
        <div className="relative h-36 overflow-hidden">
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center gap-1.5 text-white/90 text-xs font-medium">
              <MapPin className="w-3 h-3" />
              {regions}
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-editorial text-lg font-semibold text-stone-900 group-hover:text-amber-800 transition-colors mb-1">
                {trip.title}
              </h3>
              <p className="text-stone-500 text-sm line-clamp-1">{trip.subtitle}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-stone-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-4" />
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-stone-500 mt-3 pt-3 border-t border-stone-100">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDuration(trip.duration_days)}
            </span>
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              {getComfortTierDisplay(trip.comfort_tier)}
            </span>
            <span className="flex items-center gap-1" title={trip.cost_band.note}>
              <DollarSign className="w-3.5 h-3.5" />
              {formatCostBand(trip.cost_band)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

/**
 * SavedItineraryCard - Card for displaying a saved itinerary
 */
function SavedItineraryCard({
  itinerary,
  onRemove,
}: {
  itinerary: ItinerarySummary;
  onRemove: () => void;
}) {
  const regionName = getRegionDisplayName(itinerary.region);
  const tierDisplay = getComfortTierDisplay(itinerary.comfort_tier);
  const image = getItineraryImage(itinerary.slug, itinerary.region);

  return (
    <div className="group relative bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md hover:border-amber-300 transition-all">
      {/* Remove button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          onRemove();
        }}
        className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/90 text-rose-500 hover:bg-rose-100 shadow-sm backdrop-blur-sm transition-all"
        aria-label="Remove from saved"
      >
        <Heart className="w-4 h-4 fill-current" />
      </button>

      <Link href={`/itineraries/${itinerary.slug}`} prefetch={false}>
        <div className="relative h-40 overflow-hidden">
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          {itinerary.is_featured && (
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 text-xs font-medium bg-amber-500 text-white rounded-full">
                Featured
              </span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-white/90 text-sm flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5" />
              {regionName}
            </p>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-editorial text-lg font-semibold text-stone-900 mb-1 group-hover:text-amber-700 transition-colors">
            {itinerary.title}
          </h3>
          <p className="text-stone-500 text-sm mb-4 line-clamp-2">
            {itinerary.subtitle}
          </p>

          <div className="flex items-center gap-4 text-sm text-stone-600 pt-3 border-t border-stone-100">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-stone-400" />
              {formatDurationBand(itinerary.duration_band)}
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-stone-400" />
              {formatCostBand(itinerary.cost_band)}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-stone-500 uppercase tracking-wide">
              {tierDisplay}
            </span>
            <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </Link>
    </div>
  );
}
