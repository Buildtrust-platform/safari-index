'use client';

/**
 * ItineraryFilters Component
 *
 * A redesigned, intuitive search and filter experience for safari itineraries.
 * Features:
 * - Smart search with live suggestions
 * - Visual destination selector with images
 * - Duration range slider
 * - Budget band visual selector
 * - Style/experience tag pills
 * - Active filter summary with clear all
 */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  Search,
  X,
  MapPin,
  Clock,
  DollarSign,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Users,
  Heart,
  Camera,
  Footprints,
  Mountain,
  Plane,
  Palmtree,
  Binoculars,
} from 'lucide-react';

// Types
export interface FilterState {
  searchQuery: string;
  destinations: string[];
  durationRange: [number, number];
  budgetLevels: string[];
  styles: string[];
}

interface ItineraryFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
  totalCount: number;
  filteredCount: number;
}

// Constants
const DESTINATIONS = [
  { id: 'tanzania', name: 'Tanzania', image: '/images/destinations/tanzania-serengeti.jpg' },
  { id: 'kenya', name: 'Kenya', image: '/images/destinations/kenya-mara.jpg' },
  { id: 'botswana', name: 'Botswana', image: '/images/destinations/botswana-delta.jpg' },
  { id: 'uganda-rwanda', name: 'Uganda & Rwanda', image: '/images/destinations/uganda-bwindi.jpg' },
  { id: 'namibia', name: 'Namibia', image: '/images/destinations/namibia-sossusvlei.jpg' },
  { id: 'south-africa', name: 'South Africa', image: '/images/destinations/south-africa-kruger.jpg' },
  { id: 'zambia', name: 'Zambia', image: '/images/destinations/zambia-luangwa.jpg' },
  { id: 'zimbabwe', name: 'Zimbabwe', image: '/images/destinations/zimbabwe-mana.jpg' },
];

const BUDGET_LEVELS = [
  { id: 'value', label: 'Value', range: '$3-5k', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { id: 'mid-range', label: 'Mid-Range', range: '$5-10k', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'premium', label: 'Premium', range: '$10-20k', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: 'ultra', label: 'Ultra-Luxury', range: '$20k+', color: 'bg-amber-100 text-amber-700 border-amber-200' },
];

const STYLE_TAGS = [
  { id: 'first-safari', label: 'First Safari', icon: Sparkles },
  { id: 'family', label: 'Family', icon: Users },
  { id: 'honeymoon', label: 'Honeymoon', icon: Heart },
  { id: 'photography', label: 'Photography', icon: Camera },
  { id: 'walking', label: 'Walking Safari', icon: Footprints },
  { id: 'primate', label: 'Gorillas & Chimps', icon: Mountain },
  { id: 'fly-in', label: 'Fly-In', icon: Plane },
  { id: 'beach-combo', label: 'Beach Combo', icon: Palmtree },
  { id: 'migration', label: 'Migration', icon: Binoculars },
];

const DURATION_MARKS = [3, 5, 7, 10, 14, 21];

// Duration Slider Component
function DurationSlider({
  value,
  onChange,
}: {
  value: [number, number];
  onChange: (range: [number, number]) => void;
}) {
  const [localMin, setLocalMin] = useState(value[0]);
  const [localMax, setLocalMax] = useState(value[1]);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalMin(value[0]);
    setLocalMax(value[1]);
  }, [value]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), localMax - 1);
    setLocalMin(newMin);
    onChange([newMin, localMax]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), localMin + 1);
    setLocalMax(newMax);
    onChange([localMin, newMax]);
  };

  const minPercent = ((localMin - 3) / (21 - 3)) * 100;
  const maxPercent = ((localMax - 3) / (21 - 3)) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-stone-700">Trip Duration</span>
        <span className="text-sm text-amber-700 font-medium">
          {localMin === localMax ? `${localMin} days` : `${localMin} - ${localMax} days`}
        </span>
      </div>

      <div className="relative pt-2 pb-6" ref={sliderRef}>
        {/* Track background */}
        <div className="absolute top-4 left-0 right-0 h-2 bg-stone-200 rounded-full" />

        {/* Active range */}
        <div
          className="absolute top-4 h-2 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        {/* Min slider */}
        <input
          type="range"
          min={3}
          max={21}
          value={localMin}
          onChange={handleMinChange}
          className="absolute w-full top-2 h-6 appearance-none bg-transparent cursor-pointer z-20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-amber-500 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
        />

        {/* Max slider */}
        <input
          type="range"
          min={3}
          max={21}
          value={localMax}
          onChange={handleMaxChange}
          className="absolute w-full top-2 h-6 appearance-none bg-transparent cursor-pointer z-20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-amber-500 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
        />

        {/* Duration marks */}
        <div className="absolute top-8 left-0 right-0 flex justify-between px-1">
          {DURATION_MARKS.map((mark) => (
            <span
              key={mark}
              className={`text-xs ${
                mark >= localMin && mark <= localMax ? 'text-amber-600 font-medium' : 'text-stone-400'
              }`}
            >
              {mark}d
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Quick duration presets
function DurationPresets({
  onSelect,
  currentRange,
}: {
  onSelect: (range: [number, number]) => void;
  currentRange: [number, number];
}) {
  const presets = [
    { label: 'Short (3-5 days)', range: [3, 5] as [number, number] },
    { label: 'Classic (6-10 days)', range: [6, 10] as [number, number] },
    { label: 'Extended (11-14 days)', range: [11, 14] as [number, number] },
    { label: 'Grand (15+ days)', range: [15, 21] as [number, number] },
  ];

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {presets.map((preset) => {
        const isActive = currentRange[0] === preset.range[0] && currentRange[1] === preset.range[1];
        return (
          <button
            key={preset.label}
            onClick={() => onSelect(preset.range)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
              isActive
                ? 'bg-amber-600 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {preset.label}
          </button>
        );
      })}
    </div>
  );
}

// Destination selector with images
function DestinationSelector({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (destinations: string[]) => void;
}) {
  const toggleDestination = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((d) => d !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {DESTINATIONS.map((dest) => {
        const isSelected = selected.includes(dest.id);
        return (
          <button
            key={dest.id}
            onClick={() => toggleDestination(dest.id)}
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
  );
}

// Budget level selector
function BudgetSelector({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (levels: string[]) => void;
}) {
  const toggleLevel = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((l) => l !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {BUDGET_LEVELS.map((level) => {
        const isSelected = selected.includes(level.id);
        return (
          <button
            key={level.id}
            onClick={() => toggleLevel(level.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all ${
              isSelected
                ? `${level.color} border-current`
                : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <div className="text-left">
              <div className="text-sm font-medium">{level.label}</div>
              <div className="text-xs opacity-70">{level.range}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// Style tag pills
function StyleSelector({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (styles: string[]) => void;
}) {
  const toggleStyle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {STYLE_TAGS.map((style) => {
        const isSelected = selected.includes(style.id);
        const Icon = style.icon;
        return (
          <button
            key={style.id}
            onClick={() => toggleStyle(style.id)}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
              isSelected
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white border border-stone-200 text-stone-600 hover:border-amber-300 hover:bg-amber-50'
            }`}
          >
            <Icon className="w-4 h-4" />
            {style.label}
          </button>
        );
      })}
    </div>
  );
}

// Active filters summary
function ActiveFilters({
  filters,
  onClear,
  onClearAll,
}: {
  filters: FilterState;
  onClear: (type: keyof FilterState, value?: string) => void;
  onClearAll: () => void;
}) {
  const activeCount =
    filters.destinations.length +
    filters.budgetLevels.length +
    filters.styles.length +
    (filters.durationRange[0] !== 3 || filters.durationRange[1] !== 21 ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  if (activeCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-3 border-t border-stone-200">
      <span className="text-sm text-stone-500">Active filters:</span>

      {filters.searchQuery && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-700 rounded-full text-sm">
          "{filters.searchQuery}"
          <button onClick={() => onClear('searchQuery')} className="hover:text-stone-900">
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      )}

      {filters.destinations.map((dest) => {
        const destData = DESTINATIONS.find((d) => d.id === dest);
        return (
          <span
            key={dest}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
          >
            <MapPin className="w-3.5 h-3.5" />
            {destData?.name}
            <button onClick={() => onClear('destinations', dest)} className="hover:text-amber-900">
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        );
      })}

      {(filters.durationRange[0] !== 3 || filters.durationRange[1] !== 21) && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          <Clock className="w-3.5 h-3.5" />
          {filters.durationRange[0]}-{filters.durationRange[1]} days
          <button onClick={() => onClear('durationRange')} className="hover:text-blue-900">
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      )}

      {filters.budgetLevels.map((level) => {
        const levelData = BUDGET_LEVELS.find((l) => l.id === level);
        return (
          <span
            key={level}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
          >
            <DollarSign className="w-3.5 h-3.5" />
            {levelData?.label}
            <button onClick={() => onClear('budgetLevels', level)} className="hover:text-purple-900">
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        );
      })}

      {filters.styles.map((style) => {
        const styleData = STYLE_TAGS.find((s) => s.id === style);
        return (
          <span
            key={style}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-sm"
          >
            {styleData?.label}
            <button onClick={() => onClear('styles', style)} className="hover:text-green-900">
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        );
      })}

      <button
        onClick={onClearAll}
        className="text-sm text-stone-500 hover:text-stone-700 underline ml-2"
      >
        Clear all
      </button>
    </div>
  );
}

// Main component
export function ItineraryFilters({
  onFilterChange,
  initialFilters,
  totalCount,
  filteredCount,
}: ItineraryFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: initialFilters?.searchQuery || '',
    destinations: initialFilters?.destinations || [],
    durationRange: initialFilters?.durationRange || [3, 21],
    budgetLevels: initialFilters?.budgetLevels || [],
    styles: initialFilters?.styles || [],
  });

  // Debounced filter change
  useEffect(() => {
    const timeout = setTimeout(() => {
      onFilterChange(filters);
    }, 150);
    return () => clearTimeout(timeout);
  }, [filters, onFilterChange]);

  const updateFilters = useCallback((partial: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleClearFilter = useCallback((type: keyof FilterState, value?: string) => {
    if (type === 'searchQuery') {
      updateFilters({ searchQuery: '' });
    } else if (type === 'durationRange') {
      updateFilters({ durationRange: [3, 21] });
    } else if (type === 'destinations' && value) {
      updateFilters({ destinations: filters.destinations.filter((d) => d !== value) });
    } else if (type === 'budgetLevels' && value) {
      updateFilters({ budgetLevels: filters.budgetLevels.filter((l) => l !== value) });
    } else if (type === 'styles' && value) {
      updateFilters({ styles: filters.styles.filter((s) => s !== value) });
    }
  }, [filters, updateFilters]);

  const handleClearAll = useCallback(() => {
    setFilters({
      searchQuery: '',
      destinations: [],
      durationRange: [3, 21],
      budgetLevels: [],
      styles: [],
    });
  }, []);

  const hasActiveFilters =
    filters.searchQuery ||
    filters.destinations.length > 0 ||
    filters.budgetLevels.length > 0 ||
    filters.styles.length > 0 ||
    filters.durationRange[0] !== 3 ||
    filters.durationRange[1] !== 21;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Search Bar Header */}
      <div className="p-4 md:p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => updateFilters({ searchQuery: e.target.value })}
              placeholder="Search by name, destination, or activity..."
              className="w-full pl-12 pr-10 py-3 bg-stone-50 rounded-xl text-stone-900 placeholder:text-stone-400 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-300 focus:bg-white transition-all"
            />
            {filters.searchQuery && (
              <button
                onClick={() => updateFilters({ searchQuery: '' })}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
              isExpanded || hasActiveFilters
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="w-5 h-5 bg-white text-amber-600 rounded-full text-xs font-bold flex items-center justify-center">
                {filters.destinations.length + filters.budgetLevels.length + filters.styles.length +
                 (filters.durationRange[0] !== 3 || filters.durationRange[1] !== 21 ? 1 : 0)}
              </span>
            )}
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 hidden sm:block" />
            ) : (
              <ChevronDown className="w-4 h-4 hidden sm:block" />
            )}
          </button>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-stone-500">
            {hasActiveFilters ? (
              <>
                Showing <span className="font-medium text-stone-900">{filteredCount}</span> of{' '}
                {totalCount} itineraries
              </>
            ) : (
              <>
                <span className="font-medium text-stone-900">{totalCount}</span> itineraries
                available
              </>
            )}
          </p>

          {/* Quick style filters always visible */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-stone-400">Quick:</span>
            {STYLE_TAGS.slice(0, 4).map((style) => {
              const isSelected = filters.styles.includes(style.id);
              return (
                <button
                  key={style.id}
                  onClick={() => {
                    if (isSelected) {
                      updateFilters({ styles: filters.styles.filter((s) => s !== style.id) });
                    } else {
                      updateFilters({ styles: [...filters.styles, style.id] });
                    }
                  }}
                  className={`px-2 py-1 text-xs rounded-full transition-all ${
                    isSelected
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-amber-100 hover:text-amber-700'
                  }`}
                >
                  {style.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Expanded Filters Panel */}
      {isExpanded && (
        <div className="border-t border-stone-200 bg-stone-50">
          <div className="p-4 md:p-6 space-y-6">
            {/* Destinations */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-semibold text-stone-800">Destinations</h3>
                {filters.destinations.length > 0 && (
                  <span className="text-xs text-amber-600">
                    {filters.destinations.length} selected
                  </span>
                )}
              </div>
              <DestinationSelector
                selected={filters.destinations}
                onChange={(destinations) => updateFilters({ destinations })}
              />
            </div>

            {/* Duration */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-semibold text-stone-800">Duration</h3>
              </div>
              <div className="bg-white rounded-xl p-4 border border-stone-200">
                <DurationSlider
                  value={filters.durationRange}
                  onChange={(range) => updateFilters({ durationRange: range })}
                />
                <DurationPresets
                  currentRange={filters.durationRange}
                  onSelect={(range) => updateFilters({ durationRange: range })}
                />
              </div>
            </div>

            {/* Budget */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-semibold text-stone-800">Budget Level</h3>
                {filters.budgetLevels.length > 0 && (
                  <span className="text-xs text-amber-600">
                    {filters.budgetLevels.length} selected
                  </span>
                )}
              </div>
              <BudgetSelector
                selected={filters.budgetLevels}
                onChange={(levels) => updateFilters({ budgetLevels: levels })}
              />
            </div>

            {/* Experience Types */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-semibold text-stone-800">Experience Type</h3>
                {filters.styles.length > 0 && (
                  <span className="text-xs text-amber-600">{filters.styles.length} selected</span>
                )}
              </div>
              <StyleSelector
                selected={filters.styles}
                onChange={(styles) => updateFilters({ styles })}
              />
            </div>
          </div>

          {/* Active Filters Summary */}
          <div className="px-4 md:px-6 pb-4">
            <ActiveFilters
              filters={filters}
              onClear={handleClearFilter}
              onClearAll={handleClearAll}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ItineraryFilters;
