'use client';

/**
 * TripsContent Component
 *
 * Client component that handles view toggle between grid and list views
 * for the trips hub page. Receives pre-grouped trip data from server component.
 */

import Link from 'next/link';
import {
  MapPin,
  Calendar,
  Compass,
  DollarSign,
  ArrowRight,
  Globe,
} from 'lucide-react';
import { ViewToggle, useViewPreference } from '../components/ui/ViewToggle';
import { SaveButton } from '../components/ui/SavedSafaris';
import {
  formatDuration,
  getRegionDisplayName,
  getComfortTierDisplay,
  formatCostBand,
  type TripArchetype,
} from '../content/trip-shapes/trips';
import { getDestinationImage, ecosystemImages } from '../components/visual';

/**
 * Unique image mapping for each trip - no duplicates
 */
const tripImageMap: Record<string, { src: string; alt: string }> = {
  // East Africa - Tanzania (3 trips)
  'classic-serengeti-ngorongoro': { src: '/images/destinations/tanzania-serengeti.jpg', alt: 'Serengeti plains at sunrise' },
  'migration-focused-serengeti': { src: '/images/activities/migration.jpg', alt: 'Great Migration wildebeest crossing' },
  'tanzania-southern-circuit': { src: '/images/library/wildlife/lion-couple-savanna.jpg', alt: 'Lions in Ruaha National Park' },

  // East Africa - Kenya (2 trips)
  'classic-kenya-safari': { src: '/images/destinations/kenya-mara.jpg', alt: 'Masai Mara landscape' },
  'kenya-conservancy-focused': { src: '/images/library/wildlife/lioness-tree-shade.jpg', alt: 'Lioness in private conservancy' },

  // Southern Africa - Botswana (2 trips)
  'okavango-delta-immersion': { src: '/images/destinations/botswana-delta.jpg', alt: 'Okavango Delta waterways' },
  'botswana-diverse-ecosystems': { src: '/images/ecosystems/delta-channels.jpg', alt: 'Diverse Botswana ecosystems' },

  // Southern Africa - South Africa (2 trips)
  'kruger-greater-kruger': { src: '/images/destinations/south-africa-kruger.jpg', alt: 'Greater Kruger wildlife' },
  'south-africa-combo': { src: '/images/destinations/south-africa-lodge.jpg', alt: 'South African safari lodge' },

  // Uganda & Rwanda (2 trips)
  'rwanda-gorilla-focused': { src: '/images/destinations/rwanda-volcanoes.jpg', alt: 'Volcanoes National Park' },
  'uganda-primate-safari': { src: '/images/activities/gorilla-trekking.jpg', alt: 'Mountain gorilla encounter' },

  // Southern Africa - Namibia (2 trips)
  'namibia-highlights': { src: '/images/destinations/namibia-sossusvlei.jpg', alt: 'Sossusvlei dunes' },
  'namibia-self-drive': { src: '/images/library/destinations/ruacana-waterfall-namibia.jpg', alt: 'Namibia self-drive adventure' },

  // Southern Africa - Zambia (2 trips)
  'zambia-walking-safari': { src: '/images/destinations/zambia-luangwa.jpg', alt: 'South Luangwa walking safari' },
  'victoria-falls-safari-combo': { src: '/images/library/destinations/african-waterfall-aerial.jpg', alt: 'Victoria Falls aerial view' },

  // Special Interest (4 trips)
  'photography-focused-safari': { src: '/images/activities/photographic-hide.jpg', alt: 'Photography hide setup' },
  'family-multigenerational': { src: '/images/library/birding/family-camping-safari.jpg', alt: 'Family safari experience' },
  'honeymoon-romance-safari': { src: '/images/library/destinations/tanzania-wildlife-sunset-1.jpg', alt: 'Romantic safari sunset' },
  'budget-first-safari': { src: '/images/destinations/tanzania-ngorongoro.jpg', alt: 'Ngorongoro Crater' },
};

/**
 * Get trip image based on trip ID
 */
function getTripImage(tripId: string, regions: string[]): { src: string; alt: string } {
  // Check for trip-specific image first
  if (tripImageMap[tripId]) {
    return tripImageMap[tripId];
  }

  // Fallback to region-based image
  const regionMap: Record<string, string> = {
    'tanzania': 'tanzania',
    'kenya': 'kenya',
    'botswana': 'botswana',
    'south-africa': 'south-africa',
    'namibia': 'namibia',
    'uganda-rwanda': 'rwanda',
    'zambia': 'zambia',
    'zimbabwe': 'zimbabwe',
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

/**
 * Grid view card
 */
function TripCardGrid({ trip }: { trip: TripArchetype }) {
  const regions = trip.regions
    .filter((r) => !['east-africa', 'southern-africa'].includes(r))
    .slice(0, 2)
    .map((r) => getRegionDisplayName(r))
    .join(', ') || getRegionDisplayName(trip.regions[0]);

  const image = getTripImage(trip.id, trip.regions);

  return (
    <div className="group relative bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md hover:border-amber-300 transition-all">
      <SaveButton
        id={trip.id}
        type="trip"
        size="sm"
        className="absolute top-3 right-3 z-10"
      />
      <Link
        href={`/trips/${trip.id}`}
        className="block"
        prefetch={false}
      >
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

          <div className="mt-3 flex flex-wrap gap-1.5">
            {trip.traveler_fit.slice(0, 3).map((fit) => (
              <span
                key={fit}
                className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs rounded-full"
              >
                {fit.replace('-', ' ')}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}

/**
 * List view card - horizontal layout
 */
function TripCardList({ trip }: { trip: TripArchetype }) {
  const regions = trip.regions
    .filter((r) => !['east-africa', 'southern-africa'].includes(r))
    .slice(0, 2)
    .map((r) => getRegionDisplayName(r))
    .join(', ') || getRegionDisplayName(trip.regions[0]);

  const image = getTripImage(trip.id, trip.regions);

  return (
    <div className="group relative flex bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-amber-300 hover:shadow-md transition-all">
      <SaveButton
        id={trip.id}
        type="trip"
        size="sm"
        className="absolute top-3 right-3 z-10"
      />
      <Link
        href={`/trips/${trip.id}`}
        className="flex flex-1"
        prefetch={false}
      >
        <div className="relative w-40 sm:w-48 md:w-56 flex-shrink-0 overflow-hidden">
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
        </div>

        <div className="flex-1 p-4 md:p-5 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs text-amber-700 mb-1">
                  <MapPin className="w-3 h-3" />
                  {regions}
                </div>
                <h3 className="font-editorial text-lg font-semibold text-stone-900 group-hover:text-amber-800 transition-colors">
                  {trip.title}
                </h3>
              </div>
              <ArrowRight className="w-5 h-5 text-stone-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </div>
            <p className="text-stone-500 text-sm line-clamp-2 mb-3">{trip.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-4 text-xs text-stone-500">
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

            <div className="flex flex-wrap gap-1.5">
              {trip.traveler_fit.slice(0, 3).map((fit) => (
                <span
                  key={fit}
                  className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs rounded-full"
                >
                  {fit.replace('-', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

interface RegionData {
  section: {
    id: string;
    name: string;
    description: string;
    imageId: string;
  };
  trips: TripArchetype[];
}

interface TripsContentProps {
  regionData: RegionData[];
}

/**
 * RegionSection with view-aware rendering
 */
function RegionSection({
  section,
  trips,
  view,
}: {
  section: RegionData['section'];
  trips: TripArchetype[];
  view: 'grid' | 'list';
}) {
  const bgImage = ecosystemImages.find(img => img.id === section.imageId) || ecosystemImages[0];

  if (trips.length === 0) return null;

  return (
    <section id={section.id} className="scroll-mt-24">
      {/* Region header with image */}
      <div className="relative rounded-t-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-900/70 to-stone-900/50 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage.src})` }}
        />
        <div className="relative z-20 p-5 md:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Globe className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="font-editorial text-lg font-semibold text-white">
                {section.name}
              </h2>
              <p className="text-white/70 text-sm">{section.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trips container */}
      <div className="bg-white rounded-b-2xl border border-t-0 border-stone-200 p-4 md:p-6">
        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {trips.map((trip) => (
              <TripCardGrid key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {trips.map((trip) => (
              <TripCardList key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * TripsContent - Main content area with view toggle
 */
export function TripsContent({ regionData }: TripsContentProps) {
  const [view, setView] = useViewPreference('trips', 'grid');

  return (
    <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 md:px-8 py-10">
      {/* View toggle */}
      <div className="flex justify-end mb-6">
        <ViewToggle view={view} onViewChange={setView} />
      </div>

      {/* Region sections with inline CTA after first */}
      <div className="space-y-8">
        {regionData.map(({ section, trips }, index) => (
          <div key={section.id}>
            <RegionSection section={section} trips={trips} view={view} />

            {/* Inline CTA after first region */}
            {index === 0 && (
              <div className="mt-8 bg-gradient-to-r from-amber-50 to-stone-50 rounded-xl border border-amber-200/50 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-stone-900 font-medium">
                      Not sure which safari fits your trip?
                    </p>
                    <p className="text-stone-500 text-sm mt-0.5">
                      Tell us your priorities and we'll recommend the right shape
                    </p>
                  </div>
                  <Link
                    href="/inquire"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors text-sm whitespace-nowrap"
                  >
                    Start planning
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
