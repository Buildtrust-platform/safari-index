'use client';

/**
 * SavedSafaris System
 *
 * Provides wishlist functionality for trips and itineraries with localStorage persistence.
 * Includes the useSavedSafaris hook and SaveButton component.
 */

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '../../ui/utils';

export type SavedItemType = 'trip' | 'itinerary';

export interface SavedItem {
  id: string;
  type: SavedItemType;
  savedAt: string; // ISO date string
}

interface SavedSafarisContextType {
  savedItems: SavedItem[];
  isSaved: (id: string, type: SavedItemType) => boolean;
  toggleSaved: (id: string, type: SavedItemType) => void;
  clearAll: () => void;
  getCount: () => number;
}

const SavedSafarisContext = createContext<SavedSafarisContextType | null>(null);

const STORAGE_KEY = 'vurara-saved-safaris';

/**
 * Provider component for saved safaris functionality
 */
export function SavedSafarisProvider({ children }: { children: ReactNode }) {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedItems(parsed);
        }
      }
    } catch {
      // Ignore parse errors
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage when items change (after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedItems));
    }
  }, [savedItems, isHydrated]);

  const isSaved = useCallback(
    (id: string, type: SavedItemType) => {
      return savedItems.some((item) => item.id === id && item.type === type);
    },
    [savedItems]
  );

  const toggleSaved = useCallback((id: string, type: SavedItemType) => {
    setSavedItems((prev) => {
      const exists = prev.some((item) => item.id === id && item.type === type);
      if (exists) {
        return prev.filter((item) => !(item.id === id && item.type === type));
      } else {
        return [...prev, { id, type, savedAt: new Date().toISOString() }];
      }
    });
  }, []);

  const clearAll = useCallback(() => {
    setSavedItems([]);
  }, []);

  const getCount = useCallback(() => savedItems.length, [savedItems]);

  return (
    <SavedSafarisContext.Provider
      value={{ savedItems, isSaved, toggleSaved, clearAll, getCount }}
    >
      {children}
    </SavedSafarisContext.Provider>
  );
}

/**
 * Hook to access saved safaris functionality
 */
export function useSavedSafaris() {
  const context = useContext(SavedSafarisContext);
  if (!context) {
    throw new Error('useSavedSafaris must be used within SavedSafarisProvider');
  }
  return context;
}

/**
 * Standalone hook for components outside the provider (uses local state)
 */
export function useSavedSafarisLocal(): SavedSafarisContextType {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedItems(parsed);
        }
      }
    } catch {
      // Ignore parse errors
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedItems));
    }
  }, [savedItems, isHydrated]);

  const isSaved = useCallback(
    (id: string, type: SavedItemType) => {
      return savedItems.some((item) => item.id === id && item.type === type);
    },
    [savedItems]
  );

  const toggleSaved = useCallback((id: string, type: SavedItemType) => {
    setSavedItems((prev) => {
      const exists = prev.some((item) => item.id === id && item.type === type);
      if (exists) {
        return prev.filter((item) => !(item.id === id && item.type === type));
      } else {
        return [...prev, { id, type, savedAt: new Date().toISOString() }];
      }
    });
  }, []);

  const clearAll = useCallback(() => {
    setSavedItems([]);
  }, []);

  const getCount = useCallback(() => savedItems.length, [savedItems]);

  return { savedItems, isSaved, toggleSaved, clearAll, getCount };
}

interface SaveButtonProps {
  id: string;
  type: SavedItemType;
  className?: string;
  size?: 'sm' | 'md';
  variant?: 'icon' | 'button';
  showLabel?: boolean;
}

/**
 * SaveButton - Heart icon button to save/unsave items
 */
export function SaveButton({
  id,
  type,
  className,
  size = 'md',
  variant = 'icon',
  showLabel = false,
}: SaveButtonProps) {
  const { isSaved, toggleSaved } = useSavedSafarisLocal();
  const saved = isSaved(id, type);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaved(id, type);
  };

  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
          saved
            ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
            : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-700',
          className
        )}
        aria-label={saved ? 'Remove from saved' : 'Save for later'}
        aria-pressed={saved}
      >
        <Heart
          className={cn(iconSize, saved && 'fill-current')}
        />
        {showLabel && (saved ? 'Saved' : 'Save')}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'flex items-center justify-center rounded-full transition-all',
        size === 'sm' ? 'w-7 h-7' : 'w-9 h-9',
        saved
          ? 'bg-rose-100 text-rose-600 hover:bg-rose-200'
          : 'bg-white/90 text-stone-400 hover:bg-white hover:text-rose-500',
        'shadow-sm backdrop-blur-sm',
        className
      )}
      aria-label={saved ? 'Remove from saved' : 'Save for later'}
      aria-pressed={saved}
    >
      <Heart className={cn(iconSize, saved && 'fill-current')} />
    </button>
  );
}

/**
 * SavedCount - Badge showing number of saved items (for navbar)
 */
export function SavedCount({ className }: { className?: string }) {
  const { getCount } = useSavedSafarisLocal();
  const count = getCount();

  if (count === 0) return null;

  return (
    <span
      className={cn(
        'absolute -top-1 -right-1 flex items-center justify-center',
        'w-4 h-4 text-[10px] font-bold text-white bg-rose-500 rounded-full',
        className
      )}
    >
      {count > 9 ? '9+' : count}
    </span>
  );
}
