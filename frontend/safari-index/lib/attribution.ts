/**
 * Attribution Tracker
 *
 * Client-side utility for capturing user journey attribution data.
 * Used to understand which pages and content drive inquiries.
 *
 * Design principles:
 * - Never fails: all operations are wrapped in try-catch
 * - Privacy-respecting: no PII, no cookies, session-only storage
 * - Invisible: no user-facing impact
 * - Idempotent: safe to call multiple times
 *
 * Per governance:
 * - No external analytics SDKs
 * - No tracking cookies
 * - Session storage only (cleared on tab close)
 */

import type { EntrySurface, InquiryAttribution } from './contracts';

// Session storage keys
const STORAGE_KEYS = {
  FIRST_TOUCH_PATH: 'si_first_touch_path',
  FIRST_TOUCH_SURFACE: 'si_first_touch_surface',
  REFERRER: 'si_referrer',
  UTM_CAMPAIGN: 'si_utm_campaign',
  UTM_SOURCE: 'si_utm_source',
  UTM_MEDIUM: 'si_utm_medium',
  PAGES_VIEWED: 'si_pages_viewed',
  LAST_PATH: 'si_last_path',
  GUIDE_ID: 'si_guide_id',
} as const;

/**
 * Determine entry surface type from a URL path
 */
export function classifyEntrySurface(path: string): EntrySurface {
  if (!path || path === '/') return 'homepage';

  const normalized = path.toLowerCase();

  // Decision pages
  if (normalized === '/decisions') return 'decisions-hub';
  if (normalized.startsWith('/decisions/')) return 'decision-page';

  // Trip pages
  if (normalized.startsWith('/trips/') || normalized.startsWith('/trip/')) {
    return 'trip-page';
  }

  // Guide pages
  if (normalized.startsWith('/guides/') || normalized.startsWith('/guide/')) {
    return 'guide-page';
  }

  // Other hub pages
  if (normalized === '/destinations' || normalized.startsWith('/destinations/')) {
    return 'destinations';
  }
  if (normalized === '/activities' || normalized.startsWith('/activities/')) {
    return 'activities';
  }
  if (normalized === '/when-to-go' || normalized.startsWith('/when-to-go/')) {
    return 'when-to-go';
  }
  if (normalized === '/compare' || normalized.startsWith('/compare/')) {
    return 'compare';
  }

  // Direct to inquiry
  if (normalized === '/inquire' || normalized.startsWith('/inquire/')) {
    return 'direct';
  }

  return 'unknown';
}

/**
 * Extract guide ID from a path if present
 */
function extractGuideId(path: string): string | undefined {
  const match = path.match(/\/guides?\/([^/?#]+)/i);
  return match ? match[1] : undefined;
}

/**
 * Safely get from sessionStorage
 */
function safeGet(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Safely set in sessionStorage
 */
function safeSet(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // Ignore storage errors (quota, private mode, etc.)
  }
}

/**
 * Safely increment a numeric counter in sessionStorage
 */
function safeIncrement(key: string): number {
  const current = parseInt(safeGet(key) || '0', 10);
  const next = current + 1;
  safeSet(key, String(next));
  return next;
}

/**
 * Parse UTM parameters from URL search string
 */
function parseUTMParams(search: string): {
  utm_campaign?: string;
  utm_source?: string;
  utm_medium?: string;
} {
  if (typeof window === 'undefined' || !search) return {};

  try {
    const params = new URLSearchParams(search);
    const result: Record<string, string> = {};

    const campaign = params.get('utm_campaign');
    const source = params.get('utm_source');
    const medium = params.get('utm_medium');

    if (campaign) result.utm_campaign = campaign;
    if (source) result.utm_source = source;
    if (medium) result.utm_medium = medium;

    return result;
  } catch {
    return {};
  }
}

/**
 * Initialize attribution tracking for a page view
 * Should be called once per page navigation
 *
 * @param path - Current page path
 * @param search - URL search string (optional)
 */
export function trackPageView(path: string, search?: string): void {
  if (typeof window === 'undefined') return;

  try {
    const currentPath = path + (search || '');

    // First-touch tracking (only set once per session)
    if (!safeGet(STORAGE_KEYS.FIRST_TOUCH_PATH)) {
      safeSet(STORAGE_KEYS.FIRST_TOUCH_PATH, currentPath);
      safeSet(STORAGE_KEYS.FIRST_TOUCH_SURFACE, classifyEntrySurface(path));

      // Capture referrer on first touch only
      if (document.referrer && !document.referrer.includes(window.location.hostname)) {
        safeSet(STORAGE_KEYS.REFERRER, document.referrer);
      }
    }

    // UTM tracking (capture on first appearance, don't overwrite)
    const utmParams = parseUTMParams(search || window.location.search);
    if (utmParams.utm_campaign && !safeGet(STORAGE_KEYS.UTM_CAMPAIGN)) {
      safeSet(STORAGE_KEYS.UTM_CAMPAIGN, utmParams.utm_campaign);
    }
    if (utmParams.utm_source && !safeGet(STORAGE_KEYS.UTM_SOURCE)) {
      safeSet(STORAGE_KEYS.UTM_SOURCE, utmParams.utm_source);
    }
    if (utmParams.utm_medium && !safeGet(STORAGE_KEYS.UTM_MEDIUM)) {
      safeSet(STORAGE_KEYS.UTM_MEDIUM, utmParams.utm_medium);
    }

    // Guide ID tracking (capture most recent)
    const guideId = extractGuideId(path);
    if (guideId) {
      safeSet(STORAGE_KEYS.GUIDE_ID, guideId);
    }

    // Update last path and page count
    safeSet(STORAGE_KEYS.LAST_PATH, currentPath);
    safeIncrement(STORAGE_KEYS.PAGES_VIEWED);
  } catch {
    // Never fail - attribution is non-critical
  }
}

/**
 * Get current attribution data for inquiry submission
 * Returns all tracked attribution fields
 */
export function getAttributionData(): InquiryAttribution {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const attribution: InquiryAttribution = {};

    // Entry surface
    const entrySurface = safeGet(STORAGE_KEYS.FIRST_TOUCH_SURFACE);
    if (entrySurface) {
      attribution.entry_surface = entrySurface as EntrySurface;
    }

    // First touch path
    const firstTouchPath = safeGet(STORAGE_KEYS.FIRST_TOUCH_PATH);
    if (firstTouchPath) {
      attribution.first_touch_path = firstTouchPath;
    }

    // Last touch path (page before inquiry)
    const lastPath = safeGet(STORAGE_KEYS.LAST_PATH);
    if (lastPath) {
      attribution.last_touch_path = lastPath;
    }

    // External referrer
    const referrer = safeGet(STORAGE_KEYS.REFERRER);
    if (referrer) {
      attribution.referrer = referrer;
    }

    // Guide ID
    const guideId = safeGet(STORAGE_KEYS.GUIDE_ID);
    if (guideId) {
      attribution.guide_id = guideId;
    }

    // UTM parameters
    const utmCampaign = safeGet(STORAGE_KEYS.UTM_CAMPAIGN);
    if (utmCampaign) {
      attribution.utm_campaign = utmCampaign;
    }

    const utmSource = safeGet(STORAGE_KEYS.UTM_SOURCE);
    if (utmSource) {
      attribution.utm_source = utmSource;
    }

    const utmMedium = safeGet(STORAGE_KEYS.UTM_MEDIUM);
    if (utmMedium) {
      attribution.utm_medium = utmMedium;
    }

    // Pages viewed
    const pagesViewed = safeGet(STORAGE_KEYS.PAGES_VIEWED);
    if (pagesViewed) {
      const count = parseInt(pagesViewed, 10);
      if (!isNaN(count) && count > 0) {
        attribution.pages_viewed = count;
      }
    }

    return attribution;
  } catch {
    // Return empty object on any error
    return {};
  }
}

/**
 * Clear all attribution data (e.g., after successful inquiry)
 */
export function clearAttributionData(): void {
  if (typeof window === 'undefined') return;

  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      sessionStorage.removeItem(key);
    });
  } catch {
    // Ignore errors
  }
}

/**
 * React hook for attribution tracking
 * Automatically tracks page views when path changes
 */
export function useAttributionTracking(path: string, search?: string): void {
  // This is a simple function that can be called in useEffect
  // We don't use actual React hooks here to keep dependencies minimal
  trackPageView(path, search);
}
