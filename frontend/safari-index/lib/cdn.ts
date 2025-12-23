/**
 * CDN URL Helper
 *
 * Transforms local asset paths to CloudFront CDN URLs when configured.
 * Falls back to local paths in development or when CDN is not configured.
 *
 * Environment variable:
 * - NEXT_PUBLIC_ASSETS_CDN_BASE: CloudFront distribution URL
 *   e.g., "https://d7lhxuw5xhnoj.cloudfront.net"
 */

/**
 * Get the CDN base URL from environment
 */
export function getCdnBase(): string | undefined {
  return process.env.NEXT_PUBLIC_ASSETS_CDN_BASE;
}

/**
 * Check if CDN is configured
 */
export function isCdnEnabled(): boolean {
  return Boolean(getCdnBase());
}

/**
 * Transform a local asset path to a CDN URL
 *
 * @param path - Local asset path (e.g., "/images/heroes/home-hero.jpg")
 * @returns CDN URL if configured, otherwise returns the original path
 *
 * @example
 * // With NEXT_PUBLIC_ASSETS_CDN_BASE=https://d7lhxuw5xhnoj.cloudfront.net
 * getCdnUrl('/images/hero.jpg')
 * // Returns: "https://d7lhxuw5xhnoj.cloudfront.net/images/hero.jpg"
 *
 * // Without CDN configured
 * getCdnUrl('/images/hero.jpg')
 * // Returns: "/images/hero.jpg"
 */
export function getCdnUrl(path: string): string {
  const cdnBase = getCdnBase();

  if (!cdnBase) {
    // No CDN configured, use local path
    return path;
  }

  // Normalize path to start with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // Remove trailing slash from CDN base if present
  const normalizedBase = cdnBase.endsWith('/')
    ? cdnBase.slice(0, -1)
    : cdnBase;

  return `${normalizedBase}${normalizedPath}`;
}
