/**
 * Trip Page Layout with Structured Data
 *
 * Adds JSON-LD structured data:
 * - BreadcrumbList for navigation context
 * - TouristTrip for rich snippets
 */

import {
  generateBreadcrumbSchema,
  generateTripSchema,
  renderJsonLd,
} from '../../../lib/schema';
import { getTripById } from '../../content/trip-shapes/trips';

interface Props {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

export default async function TripLayout({ params, children }: Props) {
  const { id } = await params;
  const trip = getTripById(id);

  if (!trip) {
    return <>{children}</>;
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Safari Index', url: '/' },
    { name: 'Trips', url: '/trips' },
    { name: trip.title, url: `/trips/${id}` },
  ]);

  // Calculate duration string for schema
  const durationDays = Array.isArray(trip.duration_days)
    ? trip.duration_days[0]
    : trip.duration_days;
  const durationString = `P${durationDays}D`;

  const tripSchema = generateTripSchema({
    name: trip.title,
    description: trip.what_this_trip_is_for,
    url: `/trips/${id}`,
    duration: durationString,
    destinations: trip.core_parks_or_areas,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(tripSchema) }}
      />
      {children}
    </>
  );
}
