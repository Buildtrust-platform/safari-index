'use client';

/**
 * SearchAndFilters Component
 *
 * Redesigned search and filter component for safari discovery.
 * Features:
 * - Clean, intuitive search bar
 * - Visual destination selector with images
 * - Activity pills with icons
 * - Month/season selector
 * - Popular search suggestions
 * - Mobile-friendly design
 */

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  MapPin,
  Compass,
  Calendar,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  SlidersHorizontal,
  Binoculars,
  Footprints,
  Mountain,
  Camera,
  Moon,
  Plane,
  Sailboat,
  Sparkles,
} from 'lucide-react';

/**
 * Destination data with images
 */
const DESTINATIONS = [
  { id: 'tanzania', name: 'Tanzania', image: '/images/destinations/tanzania-serengeti.jpg' },
  { id: 'kenya', name: 'Kenya', image: '/images/destinations/kenya-mara.jpg' },
  { id: 'botswana', name: 'Botswana', image: '/images/destinations/botswana-delta.jpg' },
  { id: 'namibia', name: 'Namibia', image: '/images/destinations/namibia-sossusvlei.jpg' },
  { id: 'south-africa', name: 'South Africa', image: '/images/destinations/south-africa-kruger.jpg' },
  { id: 'rwanda', name: 'Rwanda', image: '/images/destinations/rwanda-volcanoes.jpg' },
  { id: 'uganda', name: 'Uganda', image: '/images/destinations/uganda-bwindi.jpg' },
  { id: 'zambia', name: 'Zambia', image: '/images/destinations/zambia-luangwa.jpg' },
];

/**
 * Activities with icons
 */
const ACTIVITIES = [
  { id: 'game-drive', name: 'Game Drives', icon: Binoculars },
  { id: 'walking-safari', name: 'Walking Safari', icon: Footprints },
  { id: 'gorilla-trekking', name: 'Gorilla Trekking', icon: Mountain },
  { id: 'hot-air-balloon', name: 'Balloon Safari', icon: Plane },
  { id: 'boat-safari', name: 'Boat Safari', icon: Sailboat },
  { id: 'night-drive', name: 'Night Drive', icon: Moon },
  { id: 'photography', name: 'Photography', icon: Camera },
];

/**
 * Months grouped by season
 */
const SEASONS = [
  {
    name: 'Dry Season (Peak)',
    months: [
      { id: '6', name: 'June' },
      { id: '7', name: 'July' },
      { id: '8', name: 'August' },
      { id: '9', name: 'September' },
      { id: '10', name: 'October' },
    ],
  },
  {
    name: 'Green Season',
    months: [
      { id: '11', name: 'November' },
      { id: '12', name: 'December' },
      { id: '1', name: 'January' },
      { id: '2', name: 'February' },
      { id: '3', name: 'March' },
    ],
  },
  {
    name: 'Long Rains',
    months: [
      { id: '4', name: 'April' },
      { id: '5', name: 'May' },
    ],
  },
];

/**
 * Popular search suggestions by context
 */
const POPULAR_SEARCHES: Record<string, string[]> = {
  default: ['Tanzania in July', 'First safari', 'Great Migration', 'Gorilla trekking', 'Family safari'],
  destinations: ['Best parks in Tanzania', 'Kenya vs Tanzania', 'Okavango Delta', 'Kruger safari'],
  trips: ['Migration safari', 'Gorilla trek', 'Honeymoon safari', 'Budget safari', 'Photography tour'],
  decisions: ['When to visit', 'Which country', 'How many days', 'Best value', 'First time safari'],
  activities: ['Walking safari', 'Night drive', 'Balloon ride', 'Mokoro', 'Gorilla tracking'],
  guides: ['Safari packing', 'Visa requirements', 'Tipping guide', 'What to expect', 'Safari clothing'],
};

export type SearchContext = 'default' | 'destinations' | 'trips' | 'decisions' | 'activities' | 'guides';

interface SearchAndFiltersProps {
  /** Context determines which popular searches to show */
  context?: SearchContext;
  /** Pre-selected destination filter */
  initialDestination?: string;
  /** Pre-selected activity filter */
  initialActivity?: string;
  /** Pre-selected month filter */
  initialMonth?: string;
  /** Placeholder text for search input */
  placeholder?: string;
  /** Show/hide destination filter */
  showDestinationFilter?: boolean;
  /** Show/hide activity filter */
  showActivityFilter?: boolean;
  /** Show/hide month filter */
  showMonthFilter?: boolean;
  /** Compact mode for narrower layouts */
  compact?: boolean;
  /** Hero mode - larger, more prominent styling */
  hero?: boolean;
}

export function SearchAndFilters({
  context = 'default',
  initialDestination,
  initialActivity,
  initialMonth,
  placeholder = "What are you looking for? e.g., 'Tanzania in July' or 'first safari'",
  showDestinationFilter = true,
  showActivityFilter = true,
  showMonthFilter = true,
  compact = false,
  hero = false,
}: SearchAndFiltersProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<string | null>(initialDestination || null);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(initialActivity || null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(initialMonth || null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activePanel, setActivePanel] = useState<'destination' | 'activity' | 'month' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActivePanel(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/decisions?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleExplore = () => {
    const params = new URLSearchParams();
    if (selectedDestination) params.set('destination', selectedDestination);
    if (selectedActivity) params.set('activity', selectedActivity);
    if (selectedMonth) params.set('month', selectedMonth);

    const queryString = params.toString();
    router.push(queryString ? `/trips?${queryString}` : '/trips');
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    router.push(`/decisions?q=${encodeURIComponent(query)}`);
  };

  const getDestinationName = () =>
    DESTINATIONS.find((d) => d.id === selectedDestination)?.name;
  const getActivityName = () =>
    ACTIVITIES.find((a) => a.id === selectedActivity)?.name;
  const getMonthName = () => {
    for (const season of SEASONS) {
      const month = season.months.find((m) => m.id === selectedMonth);
      if (month) return month.name;
    }
    return null;
  };

  const hasFilters = selectedDestination || selectedActivity || selectedMonth;
  const popularSearches = POPULAR_SEARCHES[context] || POPULAR_SEARCHES.default;
  const filterCount = [selectedDestination, selectedActivity, selectedMonth].filter(Boolean).length;

  return (
    <div ref={containerRef} className="w-full">
      {/* Main Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <div className={`relative flex items-center ${hero ? 'shadow-lg' : 'shadow-sm'}`}>
          <div className="relative flex-1">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 ${hero ? 'w-6 h-6' : 'w-5 h-5'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholder}
              className={`w-full bg-white border border-stone-200 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-300 transition-all ${
                hero
                  ? 'pl-14 pr-4 py-4 text-lg rounded-l-2xl'
                  : compact
                  ? 'pl-12 pr-4 py-3 text-base rounded-l-xl'
                  : 'pl-12 pr-4 py-3.5 text-base rounded-l-xl'
              }`}
            />
          </div>

          {/* Filter Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 border-y border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors ${
              hero ? 'px-4 py-4' : 'px-3 py-3'
            } ${filterCount > 0 ? 'text-amber-700' : 'text-stone-600'}`}
          >
            <SlidersHorizontal className={hero ? 'w-5 h-5' : 'w-4 h-4'} />
            <span className={`hidden sm:inline ${hero ? 'text-base' : 'text-sm'} font-medium`}>Filters</span>
            {filterCount > 0 && (
              <span className="w-5 h-5 bg-amber-600 text-white rounded-full text-xs font-bold flex items-center justify-center">
                {filterCount}
              </span>
            )}
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 hidden sm:block" />
            ) : (
              <ChevronDown className="w-4 h-4 hidden sm:block" />
            )}
          </button>

          {/* Search Button */}
          <button
            type="submit"
            className={`bg-amber-600 hover:bg-amber-700 text-white font-medium transition-colors ${
              hero
                ? 'px-6 py-4 text-base rounded-r-2xl'
                : 'px-5 py-3 text-sm rounded-r-xl'
            }`}
          >
            <span className="hidden sm:inline">Search</span>
            <ArrowRight className="w-5 h-5 sm:hidden" />
          </button>
        </div>

        {/* Clear button */}
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className={`absolute top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 ${
              hero ? 'right-44' : 'right-36'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </form>

      {/* Expanded Filter Panel */}
      {isExpanded && (
        <div className="mt-3 bg-white rounded-xl border border-stone-200 shadow-lg overflow-hidden">
          {/* Filter Tabs */}
          <div className="flex border-b border-stone-200">
            {showDestinationFilter && (
              <button
                onClick={() => setActivePanel(activePanel === 'destination' ? null : 'destination')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activePanel === 'destination'
                    ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-600'
                    : selectedDestination
                    ? 'text-amber-700 bg-amber-50/50'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>{getDestinationName() || 'Destination'}</span>
                {selectedDestination && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDestination(null);
                    }}
                    className="ml-1 hover:text-amber-900"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </button>
            )}

            {showActivityFilter && (
              <button
                onClick={() => setActivePanel(activePanel === 'activity' ? null : 'activity')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-l border-stone-200 ${
                  activePanel === 'activity'
                    ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-600'
                    : selectedActivity
                    ? 'text-amber-700 bg-amber-50/50'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>{getActivityName() || 'Activity'}</span>
                {selectedActivity && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedActivity(null);
                    }}
                    className="ml-1 hover:text-amber-900"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </button>
            )}

            {showMonthFilter && (
              <button
                onClick={() => setActivePanel(activePanel === 'month' ? null : 'month')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-l border-stone-200 ${
                  activePanel === 'month'
                    ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-600'
                    : selectedMonth
                    ? 'text-amber-700 bg-amber-50/50'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>{getMonthName() || 'Month'}</span>
                {selectedMonth && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMonth(null);
                    }}
                    className="ml-1 hover:text-amber-900"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </button>
            )}
          </div>

          {/* Destination Panel */}
          {activePanel === 'destination' && (
            <div className="p-4">
              <p className="text-xs text-stone-500 uppercase tracking-wide mb-3">Select a destination</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DESTINATIONS.map((dest) => {
                  const isSelected = selectedDestination === dest.id;
                  return (
                    <button
                      key={dest.id}
                      onClick={() => {
                        setSelectedDestination(isSelected ? null : dest.id);
                        setActivePanel(null);
                      }}
                      className={`relative rounded-xl overflow-hidden transition-all ${
                        isSelected
                          ? 'ring-2 ring-amber-500 ring-offset-2'
                          : 'hover:ring-2 hover:ring-stone-300 hover:ring-offset-1'
                      }`}
                    >
                      <div className="aspect-[4/3] relative">
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className="w-full h-full object-cover"
                        />
                        <div className={`absolute inset-0 ${isSelected ? 'bg-amber-600/30' : 'bg-black/40'}`} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white font-medium text-sm text-center px-2">
                            {dest.name}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Activity Panel */}
          {activePanel === 'activity' && (
            <div className="p-4">
              <p className="text-xs text-stone-500 uppercase tracking-wide mb-3">Select an activity</p>
              <div className="flex flex-wrap gap-2">
                {ACTIVITIES.map((activity) => {
                  const isSelected = selectedActivity === activity.id;
                  const Icon = activity.icon;
                  return (
                    <button
                      key={activity.id}
                      onClick={() => {
                        setSelectedActivity(isSelected ? null : activity.id);
                        setActivePanel(null);
                      }}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-amber-600 text-white shadow-md'
                          : 'bg-stone-100 text-stone-700 hover:bg-amber-100 hover:text-amber-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {activity.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Month Panel */}
          {activePanel === 'month' && (
            <div className="p-4">
              <div className="space-y-4">
                {SEASONS.map((season) => (
                  <div key={season.name}>
                    <p className="text-xs text-stone-500 uppercase tracking-wide mb-2">{season.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {season.months.map((month) => {
                        const isSelected = selectedMonth === month.id;
                        return (
                          <button
                            key={month.id}
                            onClick={() => {
                              setSelectedMonth(isSelected ? null : month.id);
                              setActivePanel(null);
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              isSelected
                                ? 'bg-amber-600 text-white'
                                : 'bg-stone-100 text-stone-700 hover:bg-amber-100 hover:text-amber-800'
                            }`}
                          >
                            {month.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Bar */}
          {hasFilters && (
            <div className="flex items-center justify-between px-4 py-3 bg-stone-50 border-t border-stone-200">
              <button
                onClick={() => {
                  setSelectedDestination(null);
                  setSelectedActivity(null);
                  setSelectedMonth(null);
                }}
                className="text-sm text-stone-500 hover:text-stone-700"
              >
                Clear all
              </button>
              <button
                onClick={handleExplore}
                className="inline-flex items-center gap-2 px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Find safaris
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quick Filters (when not expanded) */}
      {!isExpanded && (
        <div className={`flex flex-wrap items-center gap-2 ${compact ? 'mt-3' : 'mt-4'}`}>
          {/* Selected Filters as Pills */}
          {selectedDestination && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm">
              <MapPin className="w-3.5 h-3.5" />
              {getDestinationName()}
              <button onClick={() => setSelectedDestination(null)} className="hover:text-amber-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {selectedActivity && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm">
              <Compass className="w-3.5 h-3.5" />
              {getActivityName()}
              <button onClick={() => setSelectedActivity(null)} className="hover:text-blue-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {selectedMonth && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm">
              <Calendar className="w-3.5 h-3.5" />
              {getMonthName()}
              <button onClick={() => setSelectedMonth(null)} className="hover:text-green-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {/* Popular Searches */}
          {!hasFilters && (
            <>
              <span className="text-stone-400 text-sm">Popular:</span>
              {popularSearches.slice(0, compact ? 3 : 5).map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleQuickSearch(suggestion)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-stone-600 bg-stone-100 rounded-full hover:bg-amber-100 hover:text-amber-700 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  {suggestion}
                </button>
              ))}
            </>
          )}

          {/* Explore Button when filters selected */}
          {hasFilters && (
            <button
              onClick={handleExplore}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-sm font-medium transition-colors ml-auto"
            >
              Find safaris
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchAndFilters;
