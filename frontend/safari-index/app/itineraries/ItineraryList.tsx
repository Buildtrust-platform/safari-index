'use client';

/**
 * ItineraryList Component
 *
 * Client-side filtered list of itineraries with the new filter UI.
 * Handles filtering logic and renders results with smooth transitions.
 */

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  DollarSign,
  ArrowRight,
  Globe,
  Route,
  FileText,
  Search,
} from 'lucide-react';
import { ItineraryFilters, type FilterState } from '../components/ItineraryFilters';
import { ecosystemImages, getDestinationImage } from '../components/visual';
import {
  formatDurationBand,
  type ItinerarySummary,
} from '../content/itineraries';
import { formatCostBand, getRegionDisplayName, getComfortTierDisplay } from '../content/trip-shapes/trips';

// Style tag display configuration
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

// Budget level mapping based on cost band high values
function getBudgetLevel(costBand: { low: number; high: number }): string {
  if (costBand.high <= 5000) return 'value';
  if (costBand.high <= 10000) return 'mid-range';
  if (costBand.high <= 20000) return 'premium';
  return 'ultra';
}

function StyleBadge({ style }: { style: string }) {
  const config = STYLE_DISPLAY[style] || { label: style, color: 'bg-stone-100 text-stone-600' };
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
}

// Comprehensive image mapping - unique image for each itinerary
const itineraryImageMap: Record<string, { src: string; alt: string }> = {
  // Tanzania (9 itineraries)
  'tanzania-classic-northern-circuit': { src: '/images/library/destinations/zebras-wildebeest-ngorongoro.jpg', alt: 'Zebras and wildebeest grazing in Ngorongoro Crater' },
  'tanzania-great-migration': { src: '/images/activities/migration.jpg', alt: 'Great Migration river crossing' },
  'tanzania-southern-circuit': { src: '/images/library/wildlife/lion-couple-savanna.jpg', alt: 'Lion pair in Ruaha savanna' },
  'tanzania-short-northern-circuit': { src: '/images/destinations/tanzania-ngorongoro.jpg', alt: 'Ngorongoro Crater landscape' },
  'tanzania-safari-and-beach': { src: '/images/library/destinations/stone-town-zanzibar.jpg', alt: 'Stone Town Zanzibar' },
  'tanzania-walking-safari': { src: '/images/activities/walking-safari.jpg', alt: 'Walking safari in Tanzania' },
  'tanzania-selous-ruaha': { src: '/images/library/wildlife/elephants-drinking-water.jpg', alt: 'Elephants at waterhole in Selous' },

  // Kenya (8 itineraries)
  'kenya-classic-safari': { src: '/images/library/wildlife/lion-portrait.jpg', alt: 'Lion in Masai Mara' },
  'kenya-private-conservancies': { src: '/images/library/wildlife/lioness-tree-shade.jpg', alt: 'Lioness resting in private conservancy' },
  'kenya-northern-frontier': { src: '/images/library/wildlife/elephant-in-water-kenya.jpg', alt: 'Elephant at waterhole in Samburu' },
  'kenya-masai-mara-migration': { src: '/images/activities/river-crossing.jpg', alt: 'Wildebeest river crossing in Mara' },
  'kenya-family-friendly': { src: '/images/library/birding/family-camping-safari.jpg', alt: 'Family on safari in Kenya' },
  'kenya-amboseli-tsavo': { src: '/images/library/destinations/elephants-kilimanjaro-amboseli.jpg', alt: 'Elephants with Kilimanjaro backdrop' },
  'kenya-laikipia-samburu': { src: '/images/library/wildlife/african-wildlife-sanctuary.jpg', alt: 'Wildlife in Laikipia' },
  'kenya-short-mara-safari': { src: '/images/library/wildlife/lions-feeding.jpg', alt: 'Lions in Masai Mara' },
  'kenya-honeymoon-safari': { src: '/images/library/destinations/tanzania-wildlife-sunset-1.jpg', alt: 'Romantic safari sunset' },

  // Botswana (4 itineraries)
  'botswana-okavango-delta': { src: '/images/destinations/botswana-delta.jpg', alt: 'Okavango Delta aerial view' },
  'botswana-delta-desert-pans': { src: '/images/ecosystems/desert-dunes.jpg', alt: 'Makgadikgadi salt pans' },
  'botswana-luxury-fly-in': { src: '/images/activities/scenic-helicopter.jpg', alt: 'Scenic flight over Okavango' },
  'botswana-mobile-camping-safari': { src: '/images/activities/fly-camping.jpg', alt: 'Mobile camping in Botswana' },

  // Uganda (4 itineraries)
  'uganda-primate-safari': { src: '/images/activities/chimp-tracking.jpg', alt: 'Chimpanzee tracking in Uganda' },
  'uganda-gorillas-and-wildlife': { src: '/images/activities/gorilla-trekking.jpg', alt: 'Mountain gorilla trekking' },
  'uganda-wildlife-safari': { src: '/images/library/wildlife/elephants-queen-elizabeth-uganda.jpg', alt: 'Elephants in Queen Elizabeth NP' },
  'uganda-rwanda-primate-expedition': { src: '/images/library/wildlife/elephants-pair-uganda.jpg', alt: 'Wildlife in Uganda' },

  // Rwanda (3 itineraries)
  'rwanda-gorilla-trek': { src: '/images/destinations/rwanda-volcanoes.jpg', alt: 'Volcanoes National Park Rwanda' },
  'rwanda-gorillas-and-savanna': { src: '/images/library/wildlife/elephant-with-birds-uganda.jpg', alt: 'Akagera savanna wildlife' },

  // Namibia (3 itineraries)
  'namibia-highlights': { src: '/images/destinations/namibia-sossusvlei.jpg', alt: 'Sossusvlei dunes' },
  'namibia-self-drive': { src: '/images/library/destinations/ruacana-waterfall-namibia.jpg', alt: 'Namibia self-drive adventure' },
  'namibia-skeleton-coast': { src: '/images/library/destinations/african-blue-sky.jpg', alt: 'Skeleton Coast landscape' },

  // South Africa (4 itineraries)
  'south-africa-kruger': { src: '/images/destinations/south-africa-kruger.jpg', alt: 'Kruger National Park' },
  'south-africa-safari-and-cape': { src: '/images/destinations/south-africa-lodge.jpg', alt: 'Cape Town and safari lodge' },
  'south-africa-family-safari': { src: '/images/library/wildlife/leopard-with-cubs.jpg', alt: 'Leopard family in South Africa' },
  'south-africa-short-safari': { src: '/images/library/wildlife/buffalo-at-waterhole.jpg', alt: 'Buffalo at Kruger waterhole' },

  // Zambia (3 itineraries)
  'zambia-walking-safari': { src: '/images/destinations/zambia-luangwa.jpg', alt: 'South Luangwa walking safari' },
  'zambia-classic-safari': { src: '/images/library/wildlife/lion-pride-resting.jpg', alt: 'Lion pride in South Luangwa' },
  'zambia-victoria-falls-safari': { src: '/images/library/destinations/african-waterfall-aerial.jpg', alt: 'Victoria Falls aerial' },

  // Zimbabwe (3 itineraries)
  'zimbabwe-falls-and-wildlife': { src: '/images/destinations/zimbabwe-mana.jpg', alt: 'Mana Pools Zimbabwe' },
  'zimbabwe-hwange-mana-pools': { src: '/images/library/wildlife/elephants-queen-elizabeth-park.jpg', alt: 'Hwange elephants' },
  'zimbabwe-mana-pools-canoe': { src: '/images/activities/canoe-safari.jpg', alt: 'Canoe safari on Zambezi' },

  // Multi-country
  'east-africa-grand-circuit': { src: '/images/library/experiences/african-wildlife-vacation.jpg', alt: 'East Africa grand safari' },
};

function getItineraryImage(slug: string, region: string): { src: string; alt: string } {
  if (itineraryImageMap[slug]) return itineraryImageMap[slug];
  const destImage = getDestinationImage(region === 'uganda-rwanda' ? 'rwanda' : region);
  return { src: destImage.src, alt: destImage.alt };
}

interface ItineraryCardProps {
  itinerary: ItinerarySummary;
}

function ItineraryCard({ itinerary }: ItineraryCardProps) {
  const regionName = getRegionDisplayName(itinerary.region);
  const tierDisplay = getComfortTierDisplay(itinerary.comfort_tier);
  const image = getItineraryImage(itinerary.slug, itinerary.region);

  return (
    <Link
      href={`/itineraries/${itinerary.slug}`}
      prefetch={false}
      className="group block bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-amber-300 hover:shadow-lg transition-all"
    >
      {/* Image */}
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

      {/* Content */}
      <div className="p-5">
        <h3 className="font-editorial text-lg font-semibold text-stone-900 mb-1 group-hover:text-amber-700 transition-colors">
          {itinerary.title}
        </h3>
        <p className="text-stone-500 text-sm mb-4 line-clamp-2">
          {itinerary.subtitle}
        </p>

        {/* Style tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {itinerary.style_tags.slice(0, 3).map((tag) => (
            <StyleBadge key={tag} style={tag} />
          ))}
        </div>

        {/* Meta row */}
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

        {/* Tier and CTA */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-stone-500 uppercase tracking-wide">
            {tierDisplay}
          </span>
          <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  );
}

interface ItineraryListProps {
  itineraries: ItinerarySummary[];
}

export function ItineraryList({ itineraries }: ItineraryListProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    destinations: [],
    durationRange: [3, 21],
    budgetLevels: [],
    styles: [],
  });

  // Filter itineraries based on current filters
  const filteredItineraries = useMemo(() => {
    return itineraries.filter((itinerary) => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch =
          itinerary.title.toLowerCase().includes(query) ||
          itinerary.subtitle.toLowerCase().includes(query) ||
          itinerary.region.toLowerCase().includes(query) ||
          itinerary.style_tags.some((tag) => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Destination filter
      if (filters.destinations.length > 0) {
        if (!filters.destinations.includes(itinerary.region)) return false;
      }

      // Duration filter
      const minDays = itinerary.duration_band.min_days;
      const maxDays = itinerary.duration_band.max_days;
      if (maxDays < filters.durationRange[0] || minDays > filters.durationRange[1]) {
        return false;
      }

      // Budget filter
      if (filters.budgetLevels.length > 0) {
        const budgetLevel = getBudgetLevel(itinerary.cost_band);
        if (!filters.budgetLevels.includes(budgetLevel)) return false;
      }

      // Style filter
      if (filters.styles.length > 0) {
        const hasMatchingStyle = filters.styles.some((style) =>
          itinerary.style_tags.includes(style as any)
        );
        if (!hasMatchingStyle) return false;
      }

      return true;
    });
  }, [itineraries, filters]);

  // Group filtered results by region
  const regionGroups = useMemo(() => {
    const groups: Record<string, ItinerarySummary[]> = {};
    filteredItineraries.forEach((itinerary) => {
      if (!groups[itinerary.region]) {
        groups[itinerary.region] = [];
      }
      groups[itinerary.region].push(itinerary);
    });
    return groups;
  }, [filteredItineraries]);

  const regionOrder = ['tanzania', 'kenya', 'botswana', 'uganda-rwanda', 'namibia', 'south-africa', 'zambia', 'zimbabwe'];
  const orderedRegions = regionOrder.filter((r) => regionGroups[r]?.length > 0);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const REGION_IMAGE_INDEX: Record<string, number> = {
    'tanzania': 0,
    'kenya': 0,
    'botswana': 1,
    'uganda-rwanda': 3,
    'namibia': 2,
    'south-africa': 5,
    'zambia': 4,
    'zimbabwe': 4,
  };

  return (
    <div>
      {/* Filters Section */}
      <section className="bg-white py-6 border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <ItineraryFilters
            onFilterChange={handleFilterChange}
            totalCount={itineraries.length}
            filteredCount={filteredItineraries.length}
          />
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-stone-50 border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <nav className="flex gap-1" aria-label="Safari content type">
            <Link
              href="/trips"
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-stone-500 hover:text-stone-700 hover:bg-white/50 rounded-t-lg transition-colors"
            >
              <Route className="w-4 h-4" />
              Trip Shapes
            </Link>
            <Link
              href="/itineraries"
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-amber-700 border-b-2 border-amber-600 bg-white -mb-px rounded-t-lg"
              aria-current="page"
            >
              <FileText className="w-4 h-4" />
              Day-by-Day Itineraries
              <span className="text-xs text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">
                {filteredItineraries.length}
              </span>
            </Link>
          </nav>
        </div>
      </section>

      {/* Results */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        {filteredItineraries.length === 0 ? (
          /* No Results */
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-stone-400" />
            </div>
            <h3 className="text-lg font-medium text-stone-900 mb-2">No itineraries found</h3>
            <p className="text-stone-500 mb-6 max-w-md mx-auto">
              Try adjusting your filters or search terms to find what you're looking for.
            </p>
            <button
              onClick={() => setFilters({
                searchQuery: '',
                destinations: [],
                durationRange: [3, 21],
                budgetLevels: [],
                styles: [],
              })}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            {/* Region navigation */}
            <nav className="mb-8" aria-label="Regions">
              <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">
                Browse by region
              </h2>
              <div className="flex flex-wrap gap-2">
                {orderedRegions.map((region) => (
                  <a
                    key={region}
                    href={`#${region}`}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 bg-white rounded-lg border border-stone-200 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 transition-colors whitespace-nowrap shadow-sm"
                  >
                    <Globe className="w-4 h-4" />
                    <span>{getRegionDisplayName(region as any)}</span>
                    <span className="text-xs text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                      {regionGroups[region].length}
                    </span>
                  </a>
                ))}
              </div>
            </nav>

            {/* Region groups */}
            <div className="space-y-8">
              {orderedRegions.map((region) => {
                const regionName = getRegionDisplayName(region as any) || region;
                const bgImage = ecosystemImages[REGION_IMAGE_INDEX[region] || 0];

                return (
                  <section key={region} id={region} className="scroll-mt-24">
                    {/* Region header */}
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
                              {regionName}
                            </h2>
                            <p className="text-white/70 text-sm">
                              {regionGroups[region].length}{' '}
                              {regionGroups[region].length === 1 ? 'itinerary' : 'itineraries'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Itineraries grid */}
                    <div className="bg-white rounded-b-2xl border border-t-0 border-stone-200 p-4 md:p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {regionGroups[region].map((itinerary) => (
                          <ItineraryCard key={itinerary.id} itinerary={itinerary} />
                        ))}
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          </>
        )}

        {/* CTA section */}
        <div className="mt-12 pt-8 border-t border-stone-200">
          <div className="bg-stone-900 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="font-editorial text-xl text-white mb-2">
                  Not seeing what you need?
                </h3>
                <p className="text-stone-400 text-sm">
                  Share your preferences and we'll design a custom itinerary.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/inquire"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-stone-900 rounded-lg font-medium hover:bg-stone-100 transition-colors text-sm"
                >
                  Start planning
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/trips"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-transparent text-white border border-white/30 rounded-lg font-medium hover:bg-white/10 transition-colors text-sm"
                >
                  Browse trips
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItineraryList;
