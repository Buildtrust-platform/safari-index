'use client';

/**
 * Attribution Tracker Component
 *
 * Invisible component that tracks page views for conversion intelligence.
 * Captures entry surface, referrer, UTM params, and page count.
 *
 * Per governance:
 * - No user-facing impact
 * - No external dependencies
 * - Session storage only (cleared on tab close)
 * - Never fails or blocks rendering
 */

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '../../lib/attribution';

export function AttributionTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page view on mount and when path changes
    const search = searchParams.toString();
    trackPageView(pathname, search ? `?${search}` : undefined);
  }, [pathname, searchParams]);

  // This component renders nothing
  return null;
}

export default AttributionTracker;
