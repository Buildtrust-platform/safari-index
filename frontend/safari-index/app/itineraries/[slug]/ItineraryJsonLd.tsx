/**
 * JSON-LD TouristTrip Schema for Itinerary Pages
 *
 * Structured data for search engines following schema.org TouristTrip type.
 * This helps with rich results for travel-related searches.
 *
 * References:
 * - https://schema.org/TouristTrip
 * - https://developers.google.com/search/docs/appearance/structured-data
 */

import type { Itinerary } from '../../content/itineraries';
import { getRegionDisplayName, formatCostBand } from '../../content/trip-shapes/trips';
import { formatDurationBand } from '../../content/itineraries';

interface ItineraryJsonLdProps {
  itinerary: Itinerary;
  baseUrl: string;
}

/**
 * Build JSON-LD structured data for a TouristTrip
 */
function buildTouristTripSchema(itinerary: Itinerary, baseUrl: string) {
  const regionName = getRegionDisplayName(itinerary.region);
  const url = `${baseUrl}/itineraries/${itinerary.slug}`;

  // Map segments to itinerary items
  const itineraryItems = itinerary.core_segments.map((segment, index) => ({
    '@type': 'TouristAttraction',
    name: segment.title,
    description: segment.description,
    address: {
      '@type': 'PostalAddress',
      addressRegion: segment.location,
      addressCountry: regionName,
    },
  }));

  // Build best months as text
  const allBestMonths = itinerary.best_season_windows.flatMap((w) => w.months);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const bestMonthsText = [...new Set(allBestMonths)]
    .sort((a, b) => a - b)
    .map((m) => monthNames[m - 1])
    .join(', ');

  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: itinerary.title,
    description: itinerary.meta_description,
    url,
    touristType: itinerary.style_tags.map((tag) =>
      tag.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    ),
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: itinerary.core_segments.length,
      itemListElement: itineraryItems.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item,
      })),
    },
    // Duration as ISO 8601 duration
    duration: `P${itinerary.duration_band.typical_days}D`,
    // Offers for price range indication (not actual booking)
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: itinerary.cost_band.low,
      highPrice: itinerary.cost_band.high,
      offerCount: 1,
      availability: 'https://schema.org/InStock',
    },
    // Provider
    provider: {
      '@type': 'TravelAgency',
      name: 'Safari Index',
      url: baseUrl,
    },
    // Geographic coverage
    contentLocation: {
      '@type': 'Place',
      name: regionName,
      address: {
        '@type': 'PostalAddress',
        addressCountry: regionName,
      },
    },
    // Audience
    audience: {
      '@type': 'TouristAudience',
      audienceType: itinerary.who_this_is_for,
    },
    // Additional properties
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Comfort Tier',
        value: itinerary.comfort_tier,
      },
      {
        '@type': 'PropertyValue',
        name: 'Best Months',
        value: bestMonthsText,
      },
      {
        '@type': 'PropertyValue',
        name: 'Route',
        value: itinerary.route_summary,
      },
    ],
  };
}

/**
 * JSON-LD Script Component
 */
export function ItineraryJsonLd({ itinerary, baseUrl }: ItineraryJsonLdProps) {
  const schema = buildTouristTripSchema(itinerary, baseUrl);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Get base URL for structured data
 * In production, this should be the actual domain
 */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'https://safariindex.com';
}
