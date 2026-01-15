'use client';

/**
 * useOpsKey Hook
 *
 * Manages ops authentication key from URL or localStorage.
 * Provides the key for API calls and auth state.
 */

import { useState, useEffect, useCallback } from 'react';

export function useOpsKey() {
  const [opsKey, setOpsKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check URL params first
    const urlParams = new URLSearchParams(window.location.search);
    const keyFromUrl = urlParams.get('ops_key');

    if (keyFromUrl) {
      localStorage.setItem('ops_key', keyFromUrl);
      setOpsKey(keyFromUrl);
      setIsAuthenticated(true);

      // Clean URL without reload
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('ops_key');
      window.history.replaceState({}, '', newUrl.toString());
    } else {
      const storedKey = localStorage.getItem('ops_key');
      if (storedKey) {
        setOpsKey(storedKey);
        setIsAuthenticated(true);
      }
    }

    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ops_key');
    setOpsKey(null);
    setIsAuthenticated(false);
  }, []);

  const getAuthHeaders = useCallback((): Record<string, string> => {
    if (!opsKey) return {};
    return { 'x-ops-key': opsKey };
  }, [opsKey]);

  return {
    opsKey,
    isLoading,
    isAuthenticated,
    logout,
    getAuthHeaders,
  };
}

export default useOpsKey;
