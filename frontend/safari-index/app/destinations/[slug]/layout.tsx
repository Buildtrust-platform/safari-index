/**
 * Destination Page Layout with Structured Data
 *
 * Adds JSON-LD structured data:
 * - BreadcrumbList for navigation context
 * - TouristDestination for rich snippets
 */

import {
  generateBreadcrumbSchema,
  generateDestinationSchema,
  renderJsonLd,
} from '../../../lib/schema';

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

// Minimal destination data for schema generation
const DESTINATION_NAMES: Record<string, { name: string; description: string }> = {
  tanzania: {
    name: 'Tanzania',
    description: 'The birthplace of safari. Home to the Serengeti, Ngorongoro Crater, and the Great Migration.',
  },
  kenya: {
    name: 'Kenya',
    description: 'Classic safari destination featuring the Masai Mara, Amboseli, and diverse ecosystems.',
  },
  botswana: {
    name: 'Botswana',
    description: 'Exclusive wilderness experiences in the Okavango Delta and Chobe regions.',
  },
  'south-africa': {
    name: 'South Africa',
    description: 'Accessible safari destination with malaria-free options and world-class private reserves.',
  },
  namibia: {
    name: 'Namibia',
    description: 'Desert landscapes, Sossusvlei dunes, and unique wildlife in arid ecosystems.',
  },
  zambia: {
    name: 'Zambia',
    description: 'Walking safari pioneer with South Luangwa and Victoria Falls.',
  },
  rwanda: {
    name: 'Rwanda',
    description: 'Mountain gorilla trekking in the Virunga volcanic highlands.',
  },
  uganda: {
    name: 'Uganda',
    description: 'Primate safaris with gorillas and chimpanzees in lush equatorial forests.',
  },
};

export default async function DestinationLayout({ params, children }: Props) {
  const { slug } = await params;
  const destination = DESTINATION_NAMES[slug];

  if (!destination) {
    return <>{children}</>;
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Safari Index', url: '/' },
    { name: 'Destinations', url: '/destinations' },
    { name: destination.name, url: `/destinations/${slug}` },
  ]);

  const destinationSchema = generateDestinationSchema({
    name: `${destination.name} Safari`,
    description: destination.description,
    url: `/destinations/${slug}`,
    containedInPlace: 'Africa',
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(destinationSchema) }}
      />
      {children}
    </>
  );
}
