'use client';

/**
 * ViewToggle Component
 *
 * Allows users to switch between grid and list views on listing pages.
 * Persists preference in localStorage.
 */

import { useState, useEffect } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { cn } from '../../ui/utils';

export type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
  /** Current view mode */
  view: ViewMode;
  /** Callback when view changes */
  onViewChange: (view: ViewMode) => void;
  /** Optional className */
  className?: string;
}

/**
 * ViewToggle - Toggle between grid and list views
 */
export function ViewToggle({ view, onViewChange, className }: ViewToggleProps) {
  return (
    <div
      className={cn('flex items-center gap-1 bg-stone-100 rounded-lg p-1', className)}
      role="radiogroup"
      aria-label="View mode"
    >
      <button
        type="button"
        role="radio"
        aria-checked={view === 'grid'}
        onClick={() => onViewChange('grid')}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
          view === 'grid'
            ? 'bg-white text-stone-900 shadow-sm'
            : 'text-stone-500 hover:text-stone-700'
        )}
      >
        <LayoutGrid className="w-4 h-4" />
        <span className="hidden sm:inline">Grid</span>
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={view === 'list'}
        onClick={() => onViewChange('list')}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
          view === 'list'
            ? 'bg-white text-stone-900 shadow-sm'
            : 'text-stone-500 hover:text-stone-700'
        )}
      >
        <List className="w-4 h-4" />
        <span className="hidden sm:inline">List</span>
      </button>
    </div>
  );
}

/**
 * Hook to manage view preference with localStorage persistence
 */
export function useViewPreference(key: string, defaultView: ViewMode = 'grid'): [ViewMode, (view: ViewMode) => void] {
  const [view, setView] = useState<ViewMode>(defaultView);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`view-preference-${key}`);
    if (stored === 'grid' || stored === 'list') {
      setView(stored);
    }
    setIsHydrated(true);
  }, [key]);

  // Save to localStorage when view changes
  const handleViewChange = (newView: ViewMode) => {
    setView(newView);
    localStorage.setItem(`view-preference-${key}`, newView);
  };

  return [view, handleViewChange];
}
