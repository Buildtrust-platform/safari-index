/**
 * Sitemap Generator
 *
 * Per 14_seo_generation.md:
 * - Include only published topics
 * - No analytics or tracking
 */

import { MetadataRoute } from 'next';
import { getPublishedTopics } from './content/decision-topics';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://safariindex.com';
  const topics = getPublishedTopics();

  const decisionPages = topics.map((topic) => ({
    url: `${baseUrl}/decisions/${topic.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...decisionPages,
  ];
}
