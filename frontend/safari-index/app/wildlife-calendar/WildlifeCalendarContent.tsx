'use client';

/**
 * WildlifeCalendarContent Component
 *
 * Interactive calendar showing wildlife sightings, events, and seasonal info
 * by month and destination. Allows filtering by species and destination.
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Sun,
  Cloud,
  CloudRain,
  ChevronLeft,
  ChevronRight,
  Star,
  Filter,
  X,
  ArrowRight,
} from 'lucide-react';
import { cn } from '../ui/utils';
import {
  MONTHS,
  DESTINATIONS,
  CALENDAR_SPECIES,
  WILDLIFE_EVENTS,
  REGION_SEASONS,
  getRegionKey,
  getEventsForDestinationMonth,
  getDestinationSpeciesProbability,
  type WildlifeEvent,
  type SeasonInfo,
} from './calendar-data';
import {
  getProbabilityLabel,
  getProbabilityColor,
} from '../content/wildlife-sightings';

/**
 * Season icon component
 */
function SeasonIcon({ type }: { type: SeasonInfo['type'] }) {
  switch (type) {
    case 'dry':
      return <Sun className="w-4 h-4 text-amber-500" />;
    case 'green':
      return <CloudRain className="w-4 h-4 text-green-500" />;
    case 'shoulder':
      return <Cloud className="w-4 h-4 text-blue-400" />;
  }
}

/**
 * Season badge
 */
function SeasonBadge({ season }: { season: SeasonInfo }) {
  const styles = {
    dry: 'bg-amber-100 text-amber-700 border-amber-200',
    green: 'bg-green-100 text-green-700 border-green-200',
    shoulder: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full border',
        styles[season.type]
      )}
    >
      <SeasonIcon type={season.type} />
      {season.label}
    </span>
  );
}

/**
 * Probability bar visualization
 */
function ProbabilityBar({ probability }: { probability: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all', getProbabilityColor(probability))}
          style={{ width: `${probability}%` }}
        />
      </div>
      <span className="text-xs text-stone-500 w-8 text-right">{probability}%</span>
    </div>
  );
}

/**
 * Event card component
 */
function EventCard({ event }: { event: WildlifeEvent }) {
  return (
    <div
      className={cn(
        'p-3 rounded-lg border',
        event.highlight
          ? 'bg-amber-50 border-amber-200'
          : 'bg-stone-50 border-stone-200'
      )}
    >
      <div className="flex items-start gap-2">
        {event.highlight && <Star className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />}
        <div>
          <h4 className="font-medium text-stone-900 text-sm">{event.title}</h4>
          <p className="text-xs text-stone-600 mt-1">{event.description}</p>
          {event.species && event.species.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {event.species.slice(0, 4).map((s) => (
                <span
                  key={s}
                  className="px-1.5 py-0.5 text-xs bg-white text-stone-600 rounded border border-stone-200"
                >
                  {CALENDAR_SPECIES.find((cs) => cs.id === s)?.name || s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Month detail panel
 */
function MonthDetail({
  month,
  destination,
  selectedSpecies,
}: {
  month: number;
  destination: string;
  selectedSpecies: string[];
}) {
  const monthData = MONTHS.find((m) => m.value === month);
  const regionKey = getRegionKey(destination);
  const season = REGION_SEASONS[regionKey]?.[month];
  const events = getEventsForDestinationMonth(destination, month);
  const destinationData = DESTINATIONS.find((d) => d.id === destination);

  // Get species probabilities
  const speciesProbs = useMemo(() => {
    const speciesToShow = selectedSpecies.length > 0
      ? CALENDAR_SPECIES.filter((s) => selectedSpecies.includes(s.id))
      : CALENDAR_SPECIES;

    return speciesToShow
      .map((species) => ({
        ...species,
        probability: getDestinationSpeciesProbability(destination, species.id, month),
      }))
      .filter((s) => s.probability > 0)
      .sort((a, b) => b.probability - a.probability);
  }, [destination, month, selectedSpecies]);

  if (!monthData || !season || !destinationData) return null;

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      {/* Header */}
      <div className="bg-stone-50 border-b border-stone-200 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-editorial text-xl font-semibold text-stone-900">
              {monthData.name} in {destinationData.name}
            </h3>
            <p className="text-sm text-stone-500 mt-1">{season.description}</p>
          </div>
          <SeasonBadge season={season} />
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Wildlife Events */}
        {events.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-stone-700 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Wildlife Events
            </h4>
            <div className="space-y-2">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* Species Probabilities */}
        {speciesProbs.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-stone-700 mb-3">Sighting Probabilities</h4>
            <div className="space-y-3">
              {speciesProbs.slice(0, 8).map((species) => (
                <div key={species.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-stone-700">{species.name}</span>
                    <span className="text-xs text-stone-500">
                      {getProbabilityLabel(species.probability)}
                    </span>
                  </div>
                  <ProbabilityBar probability={species.probability} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No data message */}
        {events.length === 0 && speciesProbs.length === 0 && (
          <p className="text-stone-500 text-sm text-center py-4">
            No specific wildlife data available for this selection.
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Filter chips component
 */
function FilterChips({
  label,
  options,
  selected,
  onChange,
  allowMultiple = true,
}: {
  label: string;
  options: { id: string; name: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  allowMultiple?: boolean;
}) {
  const handleToggle = (id: string) => {
    if (allowMultiple) {
      if (selected.includes(id)) {
        onChange(selected.filter((s) => s !== id));
      } else {
        onChange([...selected, id]);
      }
    } else {
      onChange([id]);
    }
  };

  return (
    <div>
      <p className="text-xs text-stone-500 mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleToggle(option.id)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-full border transition-colors',
              selected.includes(option.id)
                ? 'bg-amber-100 border-amber-300 text-amber-800'
                : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
            )}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Calendar grid component
 */
function CalendarGrid({
  selectedMonth,
  onMonthSelect,
  destination,
  selectedSpecies,
}: {
  selectedMonth: number;
  onMonthSelect: (month: number) => void;
  destination: string;
  selectedSpecies: string[];
}) {
  const regionKey = getRegionKey(destination);

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
      {MONTHS.map((month) => {
        const season = REGION_SEASONS[regionKey]?.[month.value];
        const events = getEventsForDestinationMonth(destination, month.value);
        const hasHighlight = events.some((e) => e.highlight);

        return (
          <button
            key={month.value}
            onClick={() => onMonthSelect(month.value)}
            className={cn(
              'relative p-3 rounded-xl border text-left transition-all',
              selectedMonth === month.value
                ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-200'
                : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-sm'
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-stone-900">{month.short}</span>
              {season && <SeasonIcon type={season.type} />}
            </div>
            <p className="text-xs text-stone-500">{season?.label || ''}</p>
            {hasHighlight && (
              <Star className="absolute top-2 right-2 w-3 h-3 text-amber-500" />
            )}
            {events.length > 0 && (
              <div className="mt-2 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-xs text-stone-400">
                  {events.length} event{events.length > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Highlighted events panel
 */
function HighlightedEvents({ destination }: { destination: string }) {
  const highlights = WILDLIFE_EVENTS.filter(
    (e) => e.highlight && e.destinations.includes(destination)
  );

  if (highlights.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-stone-50 rounded-xl border border-amber-200/50 p-5">
      <h3 className="font-medium text-stone-900 mb-3 flex items-center gap-2">
        <Star className="w-4 h-4 text-amber-500" />
        Don't Miss Events in {DESTINATIONS.find((d) => d.id === destination)?.name}
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {highlights.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg border border-stone-200 p-3"
          >
            <h4 className="font-medium text-stone-900 text-sm">{event.title}</h4>
            <p className="text-xs text-stone-500 mt-1 line-clamp-2">{event.description}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {event.months.map((m) => (
                <span
                  key={m}
                  className="px-1.5 py-0.5 text-xs bg-amber-100 text-amber-700 rounded"
                >
                  {MONTHS.find((mo) => mo.value === m)?.short}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Main calendar content component
 */
export default function WildlifeCalendarContent() {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedDestination, setSelectedDestination] = useState<string>('tanzania');
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Species grouped by category
  const speciesByCategory = useMemo(() => {
    return {
      'big-five': CALENDAR_SPECIES.filter((s) => s.category === 'big-five'),
      predator: CALENDAR_SPECIES.filter((s) => s.category === 'predator'),
      primate: CALENDAR_SPECIES.filter((s) => s.category === 'primate'),
      other: CALENDAR_SPECIES.filter((s) => s.category === 'other'),
    };
  }, []);

  return (
    <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 md:px-8 py-10">
      {/* Filter section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-editorial text-xl font-semibold text-stone-900">
            Explore by Month & Destination
          </h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors',
              showFilters
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
            )}
          >
            <Filter className="w-4 h-4" />
            Filter by Species
            {selectedSpecies.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-amber-200 text-amber-800 rounded-full">
                {selectedSpecies.length}
              </span>
            )}
          </button>
        </div>

        {/* Destination selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          {DESTINATIONS.map((dest) => (
            <button
              key={dest.id}
              onClick={() => setSelectedDestination(dest.id)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border transition-colors',
                selectedDestination === dest.id
                  ? 'bg-stone-900 border-stone-900 text-white'
                  : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
              )}
            >
              <MapPin className="w-3.5 h-3.5" />
              {dest.name}
            </button>
          ))}
        </div>

        {/* Species filters (collapsible) */}
        {showFilters && (
          <div className="bg-stone-50 rounded-xl border border-stone-200 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-stone-700">Filter by species</p>
              {selectedSpecies.length > 0 && (
                <button
                  onClick={() => setSelectedSpecies([])}
                  className="text-xs text-stone-500 hover:text-stone-700 flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear all
                </button>
              )}
            </div>
            <FilterChips
              label="Big Five"
              options={speciesByCategory['big-five']}
              selected={selectedSpecies}
              onChange={setSelectedSpecies}
            />
            <FilterChips
              label="Other Predators"
              options={speciesByCategory.predator}
              selected={selectedSpecies}
              onChange={setSelectedSpecies}
            />
            <FilterChips
              label="Primates"
              options={speciesByCategory.primate}
              selected={selectedSpecies}
              onChange={setSelectedSpecies}
            />
            <FilterChips
              label="Other Wildlife"
              options={speciesByCategory.other}
              selected={selectedSpecies}
              onChange={setSelectedSpecies}
            />
          </div>
        )}
      </div>

      {/* Highlighted events */}
      <div className="mb-8">
        <HighlightedEvents destination={selectedDestination} />
      </div>

      {/* Calendar grid and detail */}
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <CalendarGrid
            selectedMonth={selectedMonth}
            onMonthSelect={setSelectedMonth}
            destination={selectedDestination}
            selectedSpecies={selectedSpecies}
          />
        </div>
        <div className="lg:col-span-2">
          <MonthDetail
            month={selectedMonth}
            destination={selectedDestination}
            selectedSpecies={selectedSpecies}
          />
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 bg-gradient-to-r from-stone-900 to-stone-800 rounded-xl p-6 text-center">
        <h3 className="font-editorial text-xl text-white mb-2">
          Ready to plan your safari?
        </h3>
        <p className="text-stone-400 text-sm mb-4 max-w-md mx-auto">
          Tell us what wildlife you most want to see and when you can travel.
          We'll recommend the perfect destinations.
        </p>
        <Link
          href="/inquire"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-stone-900 rounded-lg font-medium hover:bg-stone-100 transition-colors"
        >
          Start planning
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
