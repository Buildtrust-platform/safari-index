/**
 * Saved Trips Panel Component
 *
 * Shows user's saved trips from localStorage.
 * Can be used as a sidebar, modal, or standalone page section.
 *
 * Per governance: documentary, calm tone.
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  BookmarkX,
  ArrowRight,
  Trash2,
  X,
} from 'lucide-react';
import { cn } from '../../ui/utils';
import {
  getAllTrips,
  getTripById,
  formatDuration,
  formatCostBand,
  type TripArchetype,
} from '../../content/trip-shapes/trips';

const SAVED_TRIPS_KEY = 'vurara_saved_trips';

interface SavedTripsPanelProps {
  className?: string;
  variant?: 'panel' | 'minimal' | 'floating';
  onClose?: () => void;
}

/**
 * Get saved trips from localStorage
 */
function getSavedTrips(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(SAVED_TRIPS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

/**
 * Remove trip from localStorage
 */
function unsaveTrip(tripId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const saved = getSavedTrips().filter((id) => id !== tripId);
    localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(saved));
  } catch {
    // Silently fail
  }
}

/**
 * Clear all saved trips
 */
function clearAllSavedTrips(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SAVED_TRIPS_KEY);
  } catch {
    // Silently fail
  }
}

export function SavedTripsPanel({
  className = '',
  variant = 'panel',
  onClose,
}: SavedTripsPanelProps) {
  const [savedTripIds, setSavedTripIds] = useState<string[]>([]);
  const [savedTrips, setSavedTrips] = useState<TripArchetype[]>([]);

  // Load saved trips
  useEffect(() => {
    const ids = getSavedTrips();
    setSavedTripIds(ids);
    const trips = ids
      .map((id) => getTripById(id))
      .filter((t): t is TripArchetype => t !== null);
    setSavedTrips(trips);
  }, []);

  const handleRemove = (tripId: string) => {
    unsaveTrip(tripId);
    setSavedTripIds((prev) => prev.filter((id) => id !== tripId));
    setSavedTrips((prev) => prev.filter((t) => t.id !== tripId));
  };

  const handleClearAll = () => {
    clearAllSavedTrips();
    setSavedTripIds([]);
    setSavedTrips([]);
  };

  // Floating badge variant (shows count only)
  if (variant === 'floating') {
    if (savedTrips.length === 0) return null;

    return (
      <Link
        href="/saved"
        className={cn(
          'fixed bottom-4 right-4 z-40 flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-full shadow-lg hover:bg-amber-600 transition-colors',
          className
        )}
      >
        <Bookmark className="w-4 h-4" />
        <span className="text-sm font-medium">{savedTrips.length} saved</span>
      </Link>
    );
  }

  // Minimal variant (inline list)
  if (variant === 'minimal') {
    if (savedTrips.length === 0) {
      return (
        <div className={cn('text-center py-4', className)}>
          <Bookmark className="w-8 h-8 text-stone-300 mx-auto mb-2" />
          <p className="text-sm text-stone-500">No saved trips yet</p>
        </div>
      );
    }

    return (
      <div className={className}>
        <ul className="space-y-2">
          {savedTrips.map((trip) => (
            <li key={trip.id} className="flex items-center justify-between">
              <Link
                href={`/trips/${trip.id}`}
                className="text-sm text-stone-700 hover:text-amber-700 truncate flex-1"
              >
                {trip.title}
              </Link>
              <button
                onClick={() => handleRemove(trip.id)}
                className="p-1 text-stone-400 hover:text-stone-600"
                aria-label={`Remove ${trip.title}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Default panel variant
  return (
    <div className={cn('bg-white rounded-xl border border-stone-200 overflow-hidden', className)}>
      {/* Header */}
      <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-amber-600" />
          <h3 className="font-medium text-stone-900">Saved safaris</h3>
          {savedTrips.length > 0 && (
            <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">
              {savedTrips.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {savedTrips.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-stone-500 hover:text-stone-700 transition-colors"
            >
              Clear all
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-stone-600"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {savedTrips.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <BookmarkX className="w-12 h-12 text-stone-200 mx-auto mb-3" />
          <p className="text-stone-600 font-medium mb-1">No saved trips</p>
          <p className="text-sm text-stone-500 mb-4">
            Save trips you're interested in to compare later
          </p>
          <Link
            href="/trips"
            className="inline-flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 font-medium"
          >
            Browse safaris
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-stone-100">
          {savedTrips.map((trip) => (
            <div key={trip.id} className="px-5 py-4 hover:bg-stone-50 transition-colors group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/trips/${trip.id}`}
                    className="font-medium text-stone-900 hover:text-amber-700 transition-colors line-clamp-1"
                  >
                    {trip.title}
                  </Link>
                  <p className="text-sm text-stone-500 mt-0.5 line-clamp-1">{trip.subtitle}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-stone-500">
                    <span>{formatDuration(trip.duration_days)}</span>
                    <span>•</span>
                    <span>{formatCostBand(trip.cost_band)}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(trip.id)}
                  className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  aria-label={`Remove ${trip.title} from saved`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer CTA */}
      {savedTrips.length > 0 && (
        <div className="px-5 py-4 bg-stone-50 border-t border-stone-200">
          <Link
            href={`/trips/compare?ids=${savedTripIds.slice(0, 3).join(',')}`}
            className="inline-flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-medium"
          >
            Compare saved trips
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default SavedTripsPanel;
