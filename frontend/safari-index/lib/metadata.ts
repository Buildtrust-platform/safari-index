/**
 * Shared Metadata Helpers
 *
 * Consolidates canonical URL and metadataBase logic.
 *
 * Does NOT change:
 * - Title or description strings
 * - Any existing metadata values
 * - Only organizes existing logic
 */

import { Metadata } from 'next';

/**
 * Site origin for canonical URLs
 * Uses SITE_ORIGIN env var or defaults to production domain
 */
export const SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://safariindex.com';

/**
 * Get absolute canonical URL for a path
 */
export function getCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_ORIGIN}${cleanPath}`;
}

/**
 * Create metadata base URL object
 */
export function getMetadataBase(): URL {
  return new URL(SITE_ORIGIN);
}

/**
 * Standard robots directive for indexed pages
 */
export const ROBOTS_INDEX = {
  index: true,
  follow: true,
} as const;

/**
 * Standard robots directive for non-indexed pages
 */
export const ROBOTS_NOINDEX = {
  index: false,
  follow: false,
} as const;

/**
 * Build decision page metadata
 * Accepts existing title/description - does NOT generate new copy
 */
export function buildDecisionMetadata(params: {
  slug: string;
  title: string;
  description: string;
}): Metadata {
  const canonicalUrl = getCanonicalUrl(`/decisions/${params.slug}`);

  return {
    title: params.title,
    description: params.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: params.title,
      description: params.description,
      type: 'article',
      url: canonicalUrl,
    },
    robots: ROBOTS_INDEX,
  };
}

/**
 * Build embed page metadata (noindex)
 */
export function buildEmbedMetadata(params: {
  title: string;
}): Metadata {
  return {
    title: params.title,
    robots: ROBOTS_NOINDEX,
  };
}

/**
 * Build assurance page metadata (noindex, purchase-gated)
 */
export function buildAssuranceMetadata(params: {
  title: string;
}): Metadata {
  return {
    title: params.title,
    robots: ROBOTS_NOINDEX,
  };
}

/**
 * Build dev page metadata (noindex)
 */
export function buildDevMetadata(params: {
  title: string;
}): Metadata {
  return {
    title: params.title,
    robots: 'noindex, nofollow',
  };
}
