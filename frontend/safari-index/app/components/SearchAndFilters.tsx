'use client';

/**
 * SearchAndFilters Component
 *
 * Reusable search bar and filter component for safari discovery.
 * Used across homepage, destinations, trips, decisions, and activities pages.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Compass, Calendar, ChevronDown, X, ArrowRight } from 'lucide-react';

/**
 * Filter data
 */
const DESTINATIONS_LIST = [
  { id: 'tanzania', name: 'Tanzania' },
  { id: 'kenya', name: 'Kenya' },
  { id: 'botswana', name: 'Botswana' },
  { id: 'namibia', name: 'Namibia' },
  { id: 'south-africa', name: 'South Africa' },
  { id: 'rwanda', name: 'Rwanda' },
  { id: 'uganda', name: 'Uganda' },
  { id: 'zambia', name: 'Zambia' },
];

const ACTIVITIES_LIST = [
  { id: 'game-drive', name: 'Game Drives' },
  { id: 'walking-safari', name: 'Walking Safaris' },
  { id: 'gorilla-trekking', name: 'Gorilla Trekking' },
  { id: 'hot-air-balloon', name: 'Balloon Safaris' },
  { id: 'boat-safari', name: 'Boat Safaris' },
  { id: 'night-drive', name: 'Night Drives' },
  { id: 'mokoro', name: 'Mokoro' },
  { id: 'horseback-safari', name: 'Horseback Safari' },
];

const MONTHS = [
  { id: '1', name: 'January' },
  { id: '2', name: 'February' },
  { id: '3', name: 'March' },
  { id: '4', name: 'April' },
  { id: '5', name: 'May' },
  { id: '6', name: 'June' },
  { id: '7', name: 'July' },
  { id: '8', name: 'August' },
  { id: '9', name: 'September' },
  { id: '10', name: 'October' },
  { id: '11', name: 'November' },
  { id: '12', name: 'December' },
];

/**
 * Filter Dropdown
 */
function FilterDropdown({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-xl shadow-xl border border-stone-200 p-2 min-w-[200px] max-h-[300px] overflow-y-auto">
        {children}
      </div>
    </>
  );
}

/**
 * Filter Option
 */
function FilterOption({
  label,
  isSelected,
  onClick,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
        isSelected
          ? 'bg-amber-50 text-amber-700 font-medium'
          : 'text-stone-700 hover:bg-stone-50'
      }`}
    >
      {label}
    </button>
  );
}

/**
 * Popular search suggestions by context
 */
const POPULAR_SEARCHES = {
  default: ['Tanzania in July', 'First safari', 'Great Migration', 'Gorilla trekking', 'Family friendly'],
  destinations: ['Best parks in Tanzania', 'Kenya vs Tanzania', 'Botswana Delta', 'South Africa safari'],
  trips: ['Migration safari', 'Gorilla trek', 'Honeymoon safari', 'Budget safari', 'Photography tour'],
  decisions: ['When to visit', 'Which country', 'How long', 'Best value', 'First timer'],
  activities: ['Walking safari', 'Night drive', 'Balloon ride', 'Mokoro', 'Gorilla tracking'],
};

export type SearchContext = 'default' | 'destinations' | 'trips' | 'decisions' | 'activities';

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
}

export function SearchAndFilters({
  context = 'default',
  initialDestination,
  initialActivity,
  initialMonth,
  placeholder = "Search decisions... e.g., 'Tanzania in February' or 'first safari'",
  showDestinationFilter = true,
  showActivityFilter = true,
  showMonthFilter = true,
  compact = false,
}: SearchAndFiltersProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<string | null>(initialDestination || null);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(initialActivity || null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(initialMonth || null);
  const [openDropdown, setOpenDropdown] = useState<'destination' | 'activity' | 'month' | null>(null);

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
    if (queryString) {
      router.push(`/trips?${queryString}`);
    } else {
      router.push('/trips');
    }
  };

  const getDestinationName = () =>
    DESTINATIONS_LIST.find((d) => d.id === selectedDestination)?.name || 'Destination';
  const getActivityName = () =>
    ACTIVITIES_LIST.find((a) => a.id === selectedActivity)?.name || 'Activity';
  const getMonthName = () => MONTHS.find((m) => m.id === selectedMonth)?.name || 'Month';

  const hasFilters = selectedDestination || selectedActivity || selectedMonth;
  const popularSearches = POPULAR_SEARCHES[context];

  return (
    <div className="w-full">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative mb-5">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className={`w-full pl-14 pr-14 bg-white rounded-2xl text-stone-900 placeholder:text-stone-400 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-300 shadow-sm text-base ${
              compact ? 'py-3' : 'py-4'
            }`}
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Search
            </button>
          )}
        </div>
      </form>

      {/* Filter Row */}
      <div className={`flex flex-wrap items-center gap-3 ${compact ? 'mb-3' : 'mb-4'}`}>
        <span className="text-stone-500 text-sm font-medium">Or explore by:</span>

        {/* Destination Filter */}
        {showDestinationFilter && (
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'destination' ? null : 'destination')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                selectedDestination
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
              }`}
            >
              <MapPin className="w-4 h-4" />
              {selectedDestination ? getDestinationName() : 'Destination'}
              {selectedDestination ? (
                <X
                  className="w-3.5 h-3.5 hover:text-amber-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDestination(null);
                  }}
                />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
            <FilterDropdown
              isOpen={openDropdown === 'destination'}
              onClose={() => setOpenDropdown(null)}
            >
              {DESTINATIONS_LIST.map((dest) => (
                <FilterOption
                  key={dest.id}
                  label={dest.name}
                  isSelected={selectedDestination === dest.id}
                  onClick={() => {
                    setSelectedDestination(dest.id);
                    setOpenDropdown(null);
                  }}
                />
              ))}
            </FilterDropdown>
          </div>
        )}

        {/* Activity Filter */}
        {showActivityFilter && (
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'activity' ? null : 'activity')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                selectedActivity
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
              }`}
            >
              <Compass className="w-4 h-4" />
              {selectedActivity ? getActivityName() : 'Activity'}
              {selectedActivity ? (
                <X
                  className="w-3.5 h-3.5 hover:text-amber-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedActivity(null);
                  }}
                />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
            <FilterDropdown
              isOpen={openDropdown === 'activity'}
              onClose={() => setOpenDropdown(null)}
            >
              {ACTIVITIES_LIST.map((activity) => (
                <FilterOption
                  key={activity.id}
                  label={activity.name}
                  isSelected={selectedActivity === activity.id}
                  onClick={() => {
                    setSelectedActivity(activity.id);
                    setOpenDropdown(null);
                  }}
                />
              ))}
            </FilterDropdown>
          </div>
        )}

        {/* Month Filter */}
        {showMonthFilter && (
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'month' ? null : 'month')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                selectedMonth
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
              }`}
            >
              <Calendar className="w-4 h-4" />
              {selectedMonth ? getMonthName() : 'Month'}
              {selectedMonth ? (
                <X
                  className="w-3.5 h-3.5 hover:text-amber-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMonth(null);
                  }}
                />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
            <FilterDropdown
              isOpen={openDropdown === 'month'}
              onClose={() => setOpenDropdown(null)}
            >
              {MONTHS.map((month) => (
                <FilterOption
                  key={month.id}
                  label={month.name}
                  isSelected={selectedMonth === month.id}
                  onClick={() => {
                    setSelectedMonth(month.id);
                    setOpenDropdown(null);
                  }}
                />
              ))}
            </FilterDropdown>
          </div>
        )}

        {/* Explore Button */}
        {hasFilters && (
          <button
            onClick={handleExplore}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-medium transition-colors ml-auto"
          >
            Find safaris
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Links */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="text-stone-400 text-sm">Popular:</span>
        {popularSearches.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => {
              setSearchQuery(suggestion);
              router.push(`/decisions?q=${encodeURIComponent(suggestion)}`);
            }}
            className="text-sm text-amber-700 hover:text-amber-800 hover:underline transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchAndFilters;
