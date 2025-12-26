'use client';

/**
 * Explore Decisions Page
 *
 * Browse safari decisions with premium safari travel aesthetic.
 * Includes "When to go" discovery hub for timing-focused exploration.
 * Uses ImageBand hero for immersive safari feel.
 */

import { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
import {
  MONTH_CHIPS,
  SEASON_CHIPS,
  INTEREST_CHIPS,
  getTopicsForChips,
  type WhenToGoChipKey,
} from './when-to-go-data';
import { cn } from '../ui/utils';
import { ImageBand, ImageBandContent, pageImages } from '../components/visual';
import { Navbar, Footer } from '../components/layout';
import { ArrowRight, Search, ChevronRight, MapPin, X, Compass, Calendar } from 'lucide-react';

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
 * Topic card - warm, inviting with safari aesthetic
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
      prefetch={false}
      className="group block"
    >
      <div className="p-5 rounded-xl bg-white border border-stone-200 hover:border-amber-300 hover:shadow-lg transition-all duration-200 h-full">
        <div className="flex flex-col h-full">
          <h3 className="font-editorial text-base font-medium text-stone-900 mb-2 group-hover:text-amber-700 transition-colors leading-snug">
            {question}
          </h3>
          <p className="text-sm text-stone-500 line-clamp-2 mb-4 flex-1">
            {contextLine}
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-stone-100">
            {destinations.length > 0 ? (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-xs font-medium text-stone-600">
                  {destinations.slice(0, 2).join(' · ')}
                  {destinations.length > 2 && ` +${destinations.length - 2}`}
                </span>
              </div>
            ) : (
              <span className="text-xs text-stone-400">All destinations</span>
            )}
            <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
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

/**
 * Timing chip for When to Go panel
 */
function TimingChip({
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
        'px-3 py-1.5 text-sm rounded-full border transition-all duration-200',
        active
          ? 'bg-stone-900 text-white border-stone-900'
          : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
      )}
    >
      {label}
    </button>
  );
}

/**
 * When to Go Discovery Panel
 *
 * Three chip rows: Months, Seasons, Interests
 * Selecting chips filters the topic grid to relevant decisions.
 */
function WhenToGoPanel({
  selectedChips,
  onToggleChip,
  onClear,
  panelRef,
}: {
  selectedChips: Set<WhenToGoChipKey>;
  onToggleChip: (chip: WhenToGoChipKey) => void;
  onClear: () => void;
  panelRef: React.RefObject<HTMLDivElement | null>;
}) {
  const hasSelection = selectedChips.size > 0;

  return (
    <div
      ref={panelRef}
      className="bg-white rounded-2xl border border-stone-200 p-6 mb-8 shadow-sm"
      data-testid="when-to-go-panel"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center border border-amber-200/50">
            <Calendar className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <h2 className="font-editorial text-lg font-semibold text-stone-900">When to go</h2>
            <p className="text-sm text-stone-500">Find the right timing for your safari</p>
          </div>
        </div>
        {hasSelection && (
          <button
            onClick={onClear}
            className="text-sm text-stone-500 hover:text-stone-700 underline"
            data-testid="when-to-go-clear"
          >
            Clear
          </button>
        )}
      </div>

      {/* Months row */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2 block">
          Month
        </label>
        <div className="flex flex-wrap gap-2" data-testid="when-to-go-months">
          {MONTH_CHIPS.map((chip) => (
            <TimingChip
              key={chip.key}
              label={chip.label}
              active={selectedChips.has(chip.key)}
              onClick={() => onToggleChip(chip.key)}
            />
          ))}
        </div>
      </div>

      {/* Seasons row */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2 block">
          Season
        </label>
        <div className="flex flex-wrap gap-2" data-testid="when-to-go-seasons">
          {SEASON_CHIPS.map((chip) => (
            <TimingChip
              key={chip.key}
              label={chip.label}
              active={selectedChips.has(chip.key)}
              onClick={() => onToggleChip(chip.key)}
            />
          ))}
        </div>
      </div>

      {/* Interests row */}
      <div>
        <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2 block">
          Interest
        </label>
        <div className="flex flex-wrap gap-2" data-testid="when-to-go-interests">
          {INTEREST_CHIPS.map((chip) => (
            <TimingChip
              key={chip.key}
              label={chip.label}
              active={selectedChips.has(chip.key)}
              onClick={() => onToggleChip(chip.key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Inner content component that uses useSearchParams
 */
function ExploreContent() {
  const searchParams = useSearchParams();
  const whenToGoPanelRef = useRef<HTMLDivElement>(null);

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

  // When to Go chip selection state
  const [selectedTimingChips, setSelectedTimingChips] = useState<Set<WhenToGoChipKey>>(
    new Set()
  );

  // Handle filter=when-to-go query param for auto-scroll
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam === 'when-to-go' && whenToGoPanelRef.current) {
      // Scroll to When to Go panel after a brief delay for render
      setTimeout(() => {
        whenToGoPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [searchParams]);

  // Get topic IDs matching selected timing chips
  const timingFilteredTopicIds = useMemo(() => {
    if (selectedTimingChips.size === 0) return null;
    return new Set(getTopicsForChips(Array.from(selectedTimingChips)));
  }, [selectedTimingChips]);

  const filteredTopics = useMemo(() => {
    let result = allTopics;

    // Apply timing chip filter first (if any chips selected)
    if (timingFilteredTopicIds) {
      result = result.filter((t) => timingFilteredTopicIds.has(t.topic_id));
    }

    result = searchTopics(result, searchQuery);
    result = filterTopics(result, filters);
    result = sortTopics(result, sort);
    return result;
  }, [allTopics, timingFilteredTopicIds, searchQuery, filters, sort]);

  const handleToggleTimingChip = (chip: WhenToGoChipKey) => {
    setSelectedTimingChips((prev) => {
      const next = new Set(prev);
      if (next.has(chip)) {
        next.delete(chip);
      } else {
        next.add(chip);
      }
      return next;
    });
  };

  const clearTimingChips = () => {
    setSelectedTimingChips(new Set());
  };

  const clearFilters = () => {
    setFilters({
      region: null,
      travelStyle: null,
      budgetTier: null,
      tripType: null,
    });
    setSearchQuery('');
    setSelectedTimingChips(new Set());
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
    <main className="min-h-screen bg-stone-50">
      {/* Navbar */}
      <Navbar variant="transparent" />

      {/* Hero with safari imagery */}
      <ImageBand
        image={pageImages.explore}
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
              <span className="text-white">Explore</span>
            </div>

            {/* Icon + Title */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Compass className="w-6 h-6 text-amber-400" />
              </div>
              <h1 className="font-editorial text-4xl md:text-5xl font-semibold text-white">
                Explore decisions
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              {allTopics.length} questions answered with clear verdicts.
              <br className="hidden md:block" />
              Find the guidance you need for your safari.
            </p>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {/* When to Go Discovery Panel */}
        <WhenToGoPanel
          selectedChips={selectedTimingChips}
          onToggleChip={handleToggleTimingChip}
          onClear={clearTimingChips}
          panelRef={whenToGoPanelRef}
        />

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
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      </div>

      <Footer variant="decision-system" />
    </main>
  );
}

/**
 * Explore page with Suspense boundary for useSearchParams
 */
export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-stone-50">
          <Navbar variant="solid" />
          <div className="pt-20 text-center">
            <p className="text-stone-400">Loading...</p>
          </div>
        </main>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
