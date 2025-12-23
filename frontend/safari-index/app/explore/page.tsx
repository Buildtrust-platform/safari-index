'use client';

/**
 * Explore Decisions Page
 *
 * Browse safari decisions with travel-inspired warmth.
 * Clean but evocative - suggests adventure without being heavy.
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  getExploreTopics,
  filterTopics,
  sortTopics,
  searchTopics,
} from './explore-data';
import {
  type ExploreFilters,
  type SortOption,
  REGION_OPTIONS,
  TRAVEL_STYLE_OPTIONS,
  TRIP_TYPE_OPTIONS,
  SORT_OPTIONS,
} from './explore-types';
import { cn } from '../ui/utils';
import { PageGrid } from '../components/layout';
import { ArrowLeft, Search, ChevronRight, MapPin, X, Compass } from 'lucide-react';

/**
 * Filter chip
 */
function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 text-sm rounded-full transition-all duration-200',
        active
          ? 'bg-amber-600 text-white'
          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
      )}
    >
      {label}
    </button>
  );
}

/**
 * Topic card - warm, inviting
 */
function TopicCard({
  question,
  contextLine,
  slug,
  destinations,
}: {
  question: string;
  contextLine: string;
  slug: string;
  destinations: string[];
}) {
  return (
    <Link
      href={`/decisions/${slug}`}
      className="group block"
    >
      <div className="p-5 rounded-xl bg-white border border-stone-200 hover:border-amber-300 hover:shadow-md transition-all duration-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-editorial text-lg font-medium text-stone-900 mb-2 group-hover:text-amber-700 transition-colors">
              {question}
            </h3>
            <p className="text-sm text-stone-500 line-clamp-2 mb-3">
              {contextLine}
            </p>
            {destinations.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-amber-700">
                <MapPin className="w-3.5 h-3.5" />
                <span className="font-medium">{destinations.slice(0, 2).join(' · ')}</span>
              </div>
            )}
          </div>
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-100 group-hover:bg-amber-100 flex items-center justify-center transition-colors">
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Active filter pill
 */
function ActiveFilter({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-sm bg-amber-600 text-white rounded-full">
      {label}
      <button onClick={onRemove} className="hover:bg-amber-700 rounded-full p-0.5 transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

export default function ExplorePage() {
  // PRODUCTION-CORE: Topic discovery is essential user functionality
  const allTopics = useMemo(() => getExploreTopics(), []);

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ExploreFilters>({
    region: null,
    travelStyle: null,
    budgetTier: null,
    tripType: null,
  });
  const [sort, setSort] = useState<SortOption>('most_used');
  const [showFilters, setShowFilters] = useState(false);

  const filteredTopics = useMemo(() => {
    let result = allTopics;
    result = searchTopics(result, searchQuery);
    result = filterTopics(result, filters);
    result = sortTopics(result, sort);
    return result;
  }, [allTopics, searchQuery, filters, sort]);

  const clearFilters = () => {
    setFilters({
      region: null,
      travelStyle: null,
      budgetTier: null,
      tripType: null,
    });
    setSearchQuery('');
  };

  const activeFilterCount = [
    filters.region,
    filters.travelStyle,
    filters.tripType,
  ].filter(Boolean).length;

  const getFilterLabel = (type: string, value: string) => {
    const options = type === 'region' ? REGION_OPTIONS
      : type === 'travelStyle' ? TRAVEL_STYLE_OPTIONS
      : TRIP_TYPE_OPTIONS;
    return options.find(o => o.value === value)?.label || value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-stone-50 to-stone-100">
      {/* Hero header with warmth */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white">
        <PageGrid maxWidth="default" className="py-12 md:py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Safari Index
          </Link>

          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Compass className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="font-editorial text-3xl md:text-4xl font-semibold mb-2">
                Explore decisions
              </h1>
              <p className="text-stone-400 text-lg">
                {allTopics.length} questions answered with clear verdicts
              </p>
            </div>
          </div>
        </PageGrid>
      </div>

      <PageGrid maxWidth="default" className="py-8">
        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              placeholder="Search by destination, topic, or question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-base bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'px-5 py-3 text-sm font-medium rounded-xl border transition-all duration-200 shadow-sm',
              showFilters || activeFilterCount > 0
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
            )}
          >
            Filters{activeFilterCount > 0 && ` (${activeFilterCount})`}
          </button>
        </div>

        {/* Collapsible filters */}
        {showFilters && (
          <div className="bg-white rounded-xl border border-stone-200 p-5 mb-6 shadow-sm">
            <div className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3 block">
                  Region
                </label>
                <div className="flex flex-wrap gap-2">
                  {REGION_OPTIONS.map((opt) => (
                    <FilterChip
                      key={opt.value}
                      label={opt.label}
                      active={filters.region === opt.value}
                      onClick={() => setFilters(f => ({
                        ...f,
                        region: f.region === opt.value ? null : opt.value
                      }))}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3 block">
                  Travel Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {TRAVEL_STYLE_OPTIONS.map((opt) => (
                    <FilterChip
                      key={opt.value}
                      label={opt.label}
                      active={filters.travelStyle === opt.value}
                      onClick={() => setFilters(f => ({
                        ...f,
                        travelStyle: f.travelStyle === opt.value ? null : opt.value
                      }))}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3 block">
                  Decision Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {TRIP_TYPE_OPTIONS.map((opt) => (
                    <FilterChip
                      key={opt.value}
                      label={opt.label}
                      active={filters.tripType === opt.value}
                      onClick={() => setFilters(f => ({
                        ...f,
                        tripType: f.tripType === opt.value ? null : opt.value
                      }))}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active filters display */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-stone-500">Showing:</span>
            {filters.region && (
              <ActiveFilter
                label={getFilterLabel('region', filters.region)}
                onRemove={() => setFilters(f => ({ ...f, region: null }))}
              />
            )}
            {filters.travelStyle && (
              <ActiveFilter
                label={getFilterLabel('travelStyle', filters.travelStyle)}
                onRemove={() => setFilters(f => ({ ...f, travelStyle: null }))}
              />
            )}
            {filters.tripType && (
              <ActiveFilter
                label={getFilterLabel('tripType', filters.tripType)}
                onRemove={() => setFilters(f => ({ ...f, tripType: null }))}
              />
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-stone-500 hover:text-stone-700 underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-stone-600">
            {filteredTopics.length === allTopics.length
              ? <span><span className="font-semibold text-stone-900">{allTopics.length}</span> decisions to explore</span>
              : <span><span className="font-semibold text-stone-900">{filteredTopics.length}</span> of {allTopics.length} decisions</span>}
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="text-sm text-stone-600 bg-white border border-stone-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Results grid */}
        {filteredTopics.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-stone-400" />
            </div>
            <p className="text-stone-600 mb-4">No decisions match your filters.</p>
            <button
              onClick={clearFilters}
              className="text-amber-600 font-medium hover:text-amber-700"
            >
              Clear filters and start over
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTopics.map((topic) => (
              <TopicCard
                key={topic.topic_id}
                question={topic.question}
                contextLine={topic.context_line}
                slug={topic.slug}
                destinations={topic.destinations}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-stone-200">
          <p className="text-sm text-stone-400">
            Safari Index — Decision support for safari planning.
          </p>
        </footer>
      </PageGrid>
    </div>
  );
}
