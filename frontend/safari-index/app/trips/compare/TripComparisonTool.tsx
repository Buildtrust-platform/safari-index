'use client';

/**
 * Trip Comparison Tool
 *
 * Side-by-side comparison of safari trips.
 * Focuses on actionable differences: duration, cost, destinations, trade-offs.
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Clock,
  DollarSign,
  MapPin,
  Users,
  Calendar,
  Check,
  X,
  Plus,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import {
  getAllTrips,
  formatDuration,
  formatCostBand,
  formatBestMonths,
  getComfortTierDisplay,
  type TripArchetype,
} from '../../content/trip-shapes/trips';
import { cn } from '../../ui/utils';

// Trip selector component
function TripSelector({
  selectedId,
  onSelect,
  excludeIds,
  label,
}: {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  excludeIds: string[];
  label: string;
}) {
  const trips = getAllTrips();
  const availableTrips = trips.filter((t) => !excludeIds.includes(t.id) || t.id === selectedId);

  return (
    <div className="flex-1 min-w-0">
      <label className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          value={selectedId || ''}
          onChange={(e) => onSelect(e.target.value || null)}
          className="w-full px-4 py-3 pr-10 bg-white border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none"
        >
          <option value="">Select a trip...</option>
          {availableTrips.map((trip) => (
            <option key={trip.id} value={trip.id}>
              {trip.title}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 pointer-events-none" />
      </div>
    </div>
  );
}

// Comparison row component
function ComparisonRow({
  label,
  icon,
  values,
  highlight,
}: {
  label: string;
  icon?: React.ReactNode;
  values: (string | React.ReactNode)[];
  highlight?: number; // Index of the "better" value to highlight
}) {
  return (
    <div className="grid grid-cols-[140px_1fr_1fr_1fr] gap-4 py-3 border-b border-stone-100 last:border-0 items-start">
      <div className="flex items-center gap-2 text-sm text-stone-500">
        {icon}
        <span>{label}</span>
      </div>
      {values.map((value, idx) => (
        <div
          key={idx}
          className={cn(
            'text-sm',
            highlight === idx ? 'text-amber-700 font-medium' : 'text-stone-700'
          )}
        >
          {value || <span className="text-stone-300">—</span>}
        </div>
      ))}
    </div>
  );
}

// Trip card for comparison
function TripComparisonCard({
  trip,
  onRemove,
  position,
}: {
  trip: TripArchetype;
  onRemove: () => void;
  position: number;
}) {
  const tierColors = {
    budget: 'bg-green-50 text-green-700 border-green-200',
    mid: 'bg-blue-50 text-blue-700 border-blue-200',
    luxury: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      {/* Header */}
      <div className="bg-stone-50 px-4 py-3 border-b border-stone-200">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <Link
              href={`/trips/${trip.id}`}
              className="font-medium text-stone-900 hover:text-amber-700 transition-colors line-clamp-1"
            >
              {trip.title}
            </Link>
            <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{trip.subtitle}</p>
          </div>
          <button
            onClick={onRemove}
            className="ml-2 p-1 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded transition-colors"
            aria-label="Remove from comparison"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="p-4 space-y-3">
        {/* Duration and tier */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 text-sm text-stone-700">
            <Clock className="w-4 h-4 text-stone-400" />
            {formatDuration(trip.duration_days)}
          </span>
          <span
            className={cn(
              'px-2 py-0.5 text-xs font-medium rounded border',
              tierColors[trip.comfort_tier]
            )}
          >
            {getComfortTierDisplay(trip.comfort_tier)}
          </span>
        </div>

        {/* Cost */}
        <div className="flex items-center gap-1 text-sm text-stone-700">
          <DollarSign className="w-4 h-4 text-stone-400" />
          {formatCostBand(trip.cost_band)}
        </div>

        {/* Best months */}
        <div className="flex items-center gap-1 text-sm text-stone-700">
          <Calendar className="w-4 h-4 text-stone-400" />
          {formatBestMonths(trip.best_months)}
        </div>

        {/* Destinations */}
        <div className="flex items-start gap-1 text-sm text-stone-700">
          <MapPin className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{trip.core_parks_or_areas.join(', ')}</span>
        </div>

        {/* Traveler fit */}
        <div className="flex items-start gap-1 text-sm text-stone-700">
          <Users className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
          <div className="flex flex-wrap gap-1">
            {trip.traveler_fit.slice(0, 3).map((fit) => (
              <span
                key={fit}
                className="px-2 py-0.5 text-xs bg-stone-100 text-stone-600 rounded"
              >
                {fit.replace('-', ' ')}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Trade-offs */}
      <div className="px-4 pb-4">
        <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
          Trade-offs
        </p>
        <ul className="space-y-1">
          {trip.what_you_trade_off.map((tradeoff, idx) => (
            <li key={idx} className="text-xs text-stone-600 flex items-start gap-1.5">
              <span className="text-amber-500 mt-0.5">•</span>
              <span className="line-clamp-2">{tradeoff}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* View trip link */}
      <div className="px-4 pb-4">
        <Link
          href={`/trips/${trip.id}`}
          className="inline-flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
        >
          View full details
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

// Empty slot for adding a trip
function EmptyTripSlot({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center min-h-[280px] bg-white rounded-xl border-2 border-dashed border-stone-200 hover:border-amber-300 hover:bg-amber-50/30 transition-colors group"
    >
      <div className="w-12 h-12 rounded-full bg-stone-100 group-hover:bg-amber-100 flex items-center justify-center mb-3 transition-colors">
        <Plus className="w-6 h-6 text-stone-400 group-hover:text-amber-600" />
      </div>
      <span className="text-sm text-stone-500 group-hover:text-amber-700">{label}</span>
    </button>
  );
}

export function TripComparisonTool() {
  const [selectedIds, setSelectedIds] = useState<(string | null)[]>([null, null, null]);
  const [showSelector, setShowSelector] = useState<number | null>(null);

  const trips = getAllTrips();

  const selectedTrips = useMemo(() => {
    return selectedIds
      .map((id) => (id ? trips.find((t) => t.id === id) : null))
      .filter((t): t is TripArchetype => t !== null);
  }, [selectedIds, trips]);

  const handleSelect = (position: number, id: string | null) => {
    setSelectedIds((prev) => {
      const next = [...prev];
      next[position] = id;
      return next;
    });
    setShowSelector(null);
  };

  const handleRemove = (position: number) => {
    setSelectedIds((prev) => {
      const next = [...prev];
      next[position] = null;
      return next;
    });
  };

  const activeCount = selectedTrips.length;
  const excludeIds = selectedIds.filter((id): id is string => id !== null);

  return (
    <div className="space-y-6">
      {/* Selector row - shows when clicking "Add trip" */}
      {showSelector !== null && (
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="flex items-end gap-4">
            <TripSelector
              selectedId={null}
              onSelect={(id) => handleSelect(showSelector, id)}
              excludeIds={excludeIds}
              label={`Select trip ${showSelector + 1}`}
            />
            <button
              onClick={() => setShowSelector(null)}
              className="px-4 py-3 text-sm text-stone-600 hover:text-stone-900 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Trip cards grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {[0, 1, 2].map((position) => {
          const trip = selectedIds[position]
            ? trips.find((t) => t.id === selectedIds[position])
            : null;

          if (trip) {
            return (
              <TripComparisonCard
                key={trip.id}
                trip={trip}
                onRemove={() => handleRemove(position)}
                position={position}
              />
            );
          }

          // Show empty slot for first two positions, or third if at least one is selected
          if (position < 2 || activeCount >= 1) {
            return (
              <EmptyTripSlot
                key={`empty-${position}`}
                onClick={() => setShowSelector(position)}
                label={position === 0 ? 'Add first trip' : position === 1 ? 'Add second trip' : 'Add third trip (optional)'}
              />
            );
          }

          return null;
        })}
      </div>

      {/* Detailed comparison table - shows when 2+ trips selected */}
      {activeCount >= 2 && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="px-4 py-3 bg-stone-50 border-b border-stone-200">
            <h2 className="font-medium text-stone-900">Side-by-side comparison</h2>
          </div>
          <div className="p-4 overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Header row */}
              <div className="grid grid-cols-[140px_1fr_1fr_1fr] gap-4 pb-3 border-b border-stone-200">
                <div className="text-sm font-medium text-stone-500">Attribute</div>
                {selectedTrips.map((trip, idx) => (
                  <div key={trip.id} className="text-sm font-medium text-stone-900">
                    {trip.title}
                  </div>
                ))}
                {/* Fill empty columns */}
                {Array(3 - selectedTrips.length)
                  .fill(null)
                  .map((_, idx) => (
                    <div key={`empty-${idx}`} />
                  ))}
              </div>

              {/* Comparison rows */}
              <ComparisonRow
                label="Duration"
                icon={<Clock className="w-4 h-4" />}
                values={[
                  ...selectedTrips.map((t) => formatDuration(t.duration_days)),
                  ...Array(3 - selectedTrips.length).fill(null),
                ]}
              />
              <ComparisonRow
                label="Cost"
                icon={<DollarSign className="w-4 h-4" />}
                values={[
                  ...selectedTrips.map((t) => formatCostBand(t.cost_band)),
                  ...Array(3 - selectedTrips.length).fill(null),
                ]}
              />
              <ComparisonRow
                label="Comfort"
                values={[
                  ...selectedTrips.map((t) => getComfortTierDisplay(t.comfort_tier)),
                  ...Array(3 - selectedTrips.length).fill(null),
                ]}
              />
              <ComparisonRow
                label="Best months"
                icon={<Calendar className="w-4 h-4" />}
                values={[
                  ...selectedTrips.map((t) => formatBestMonths(t.best_months)),
                  ...Array(3 - selectedTrips.length).fill(null),
                ]}
              />
              <ComparisonRow
                label="Destinations"
                icon={<MapPin className="w-4 h-4" />}
                values={[
                  ...selectedTrips.map((t) => (
                    <span className="text-xs">{t.core_parks_or_areas.join(', ')}</span>
                  )),
                  ...Array(3 - selectedTrips.length).fill(null),
                ]}
              />
              <ComparisonRow
                label="Best for"
                icon={<Users className="w-4 h-4" />}
                values={[
                  ...selectedTrips.map((t) => (
                    <div className="flex flex-wrap gap-1">
                      {t.traveler_fit.slice(0, 3).map((fit) => (
                        <span
                          key={fit}
                          className="px-1.5 py-0.5 text-xs bg-stone-100 text-stone-600 rounded"
                        >
                          {fit.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  )),
                  ...Array(3 - selectedTrips.length).fill(null),
                ]}
              />
            </div>
          </div>
        </div>
      )}

      {/* Quick links to popular comparisons */}
      {activeCount === 0 && (
        <div className="bg-stone-50 rounded-xl p-6">
          <h3 className="font-medium text-stone-900 mb-4">Common comparisons</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              {
                ids: ['classic-serengeti-ngorongoro', 'classic-kenya-safari'],
                label: 'Tanzania vs Kenya classic safaris',
              },
              {
                ids: ['okavango-delta-immersion', 'zambia-walking-safari'],
                label: 'Okavango vs Zambia walking safari',
              },
              {
                ids: ['rwanda-gorilla-focused', 'uganda-primate-safari'],
                label: 'Rwanda vs Uganda gorilla trips',
              },
              {
                ids: ['kruger-greater-kruger', 'classic-serengeti-ngorongoro'],
                label: 'South Africa vs Tanzania first safari',
              },
            ].map((preset) => (
              <button
                key={preset.ids.join('-')}
                onClick={() => setSelectedIds([preset.ids[0], preset.ids[1], null])}
                className="text-left px-4 py-3 bg-white rounded-lg border border-stone-200 hover:border-amber-300 hover:bg-amber-50/30 transition-colors group"
              >
                <span className="text-sm text-stone-700 group-hover:text-amber-700">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      {activeCount >= 1 && (
        <div className="bg-stone-900 rounded-xl p-6 text-center">
          <p className="text-stone-400 text-sm mb-2">Found a trip that fits?</p>
          <p className="text-white mb-4">
            Share your priorities and we'll help you refine the details.
          </p>
          <Link
            href="/inquire"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-stone-900 rounded-lg font-medium hover:bg-stone-100 transition-colors"
          >
            Start planning
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
