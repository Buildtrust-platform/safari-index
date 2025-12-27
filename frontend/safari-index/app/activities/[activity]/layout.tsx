/**
 * Activity Page Layout with Structured Data
 *
 * Adds JSON-LD structured data:
 * - BreadcrumbList for navigation context
 */

import {
  generateBreadcrumbSchema,
  renderJsonLd,
} from '../../../lib/schema';
import { getActivityById } from '../../content/activities/activity-primitives';

interface Props {
  params: Promise<{ activity: string }>;
  children: React.ReactNode;
}

export default async function ActivityLayout({ params, children }: Props) {
  const { activity } = await params;
  const activityData = getActivityById(activity);

  if (!activityData) {
    return <>{children}</>;
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Safari Index', url: '/' },
    { name: 'Activities', url: '/activities' },
    { name: activityData.name, url: `/activities/${activity}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
