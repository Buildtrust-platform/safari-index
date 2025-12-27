/**
 * JSON-LD Schema Utilities
 *
 * Structured data helpers for SEO.
 * Generates schema.org compliant JSON-LD for rich snippets.
 */

const BASE_URL = 'https://safariindex.com';

/**
 * BreadcrumbList schema for navigation context
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

/**
 * FAQPage schema for decision pages
 */
export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/**
 * Article schema for blog posts
 */
export interface ArticleSchemaProps {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
}

export function generateArticleSchema(props: ArticleSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: props.headline,
    description: props.description,
    url: props.url.startsWith('http') ? props.url : `${BASE_URL}${props.url}`,
    datePublished: props.datePublished,
    dateModified: props.dateModified || props.datePublished,
    author: {
      '@type': 'Organization',
      name: props.authorName || 'Safari Index',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Safari Index',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
      },
    },
    ...(props.image && {
      image: {
        '@type': 'ImageObject',
        url: props.image.startsWith('http') ? props.image : `${BASE_URL}${props.image}`,
      },
    }),
  };
}

/**
 * TouristDestination schema for destination pages
 */
export interface DestinationSchemaProps {
  name: string;
  description: string;
  url: string;
  image?: string;
  containedInPlace?: string;
}

export function generateDestinationSchema(props: DestinationSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: props.name,
    description: props.description,
    url: props.url.startsWith('http') ? props.url : `${BASE_URL}${props.url}`,
    ...(props.image && {
      image: props.image.startsWith('http') ? props.image : `${BASE_URL}${props.image}`,
    }),
    ...(props.containedInPlace && {
      containedInPlace: {
        '@type': 'Continent',
        name: props.containedInPlace,
      },
    }),
  };
}

/**
 * TravelAction schema for trip/itinerary pages
 */
export interface TripSchemaProps {
  name: string;
  description: string;
  url: string;
  duration?: string; // ISO 8601 duration format, e.g., "P7D" for 7 days
  destinations?: string[];
}

export function generateTripSchema(props: TripSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: props.name,
    description: props.description,
    url: props.url.startsWith('http') ? props.url : `${BASE_URL}${props.url}`,
    ...(props.duration && { duration: props.duration }),
    ...(props.destinations && {
      touristType: 'Safari traveler',
      itinerary: {
        '@type': 'ItemList',
        itemListElement: props.destinations.map((dest, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: dest,
        })),
      },
    }),
  };
}

/**
 * Render JSON-LD script tag content
 */
export function renderJsonLd(schema: object): string {
  return JSON.stringify(schema);
}
