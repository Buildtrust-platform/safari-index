/**
 * Canonical API Base Configuration
 *
 * Single source of truth for API base URL across the frontend.
 *
 * Environment variable:
 * - NEXT_PUBLIC_API_BASE: Full API Gateway URL
 *   e.g., "https://qnxbpsr2a1.execute-api.eu-central-1.amazonaws.com/v1"
 *
 * Behavior:
 * - Returns env var if set
 * - Falls back to default for development/build
 * - Logs warning in development if using fallback
 */

/** Default API base (used in development and build when env var not set) */
const DEFAULT_API_BASE =
  'https://qnxbpsr2a1.execute-api.eu-central-1.amazonaws.com/v1';

/** Whether we've logged the fallback warning */
let hasLoggedFallbackWarning = false;

/**
 * Get the canonical API base URL
 *
 * @returns API base URL (no trailing slash)
 */
export function getApiBase(): string {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE;

  if (apiBase) {
    // Normalize: remove trailing slash if present
    return apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
  }

  // Log warning once in development (client-side only)
  if (
    process.env.NODE_ENV === 'development' &&
    typeof window !== 'undefined' &&
    !hasLoggedFallbackWarning
  ) {
    hasLoggedFallbackWarning = true;
    console.warn(
      '[API] NEXT_PUBLIC_API_BASE not set. Using default:',
      DEFAULT_API_BASE
    );
  }

  return DEFAULT_API_BASE;
}

/**
 * Check if API base is explicitly configured via environment variable
 */
export function isApiBaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_API_BASE);
}

/**
 * Build a full API endpoint URL
 *
 * @param path - Endpoint path (e.g., "/decision/evaluate")
 * @returns Full URL (e.g., "https://api.../v1/decision/evaluate")
 */
export function getApiUrl(path: string): string {
  const base = getApiBase();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
