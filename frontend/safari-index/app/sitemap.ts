/**
 * Sitemap Generator
 *
 * Per 14_seo_generation.md:
 * - Include only published topics
 * - No analytics or tracking
 *
 * Includes:
 * - Homepage
 * - Decision pages
 * - Guide pages (index, bucket hubs, topic guides)
 */

import { MetadataRoute } from 'next';
import { getPublishedTopics } from './content/decision-topics';
import {
  getAllBucketGuides,
  getAllP0TopicIds,
  bucketToSlug,
  getTopicById,
} from '../lib/guide-builder';
import { generateSlugFromId } from './content/p0-topics-bridge';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://safariindex.com';
  const topics = getPublishedTopics();
  const bucketGuides = getAllBucketGuides();
  const p0TopicIds = getAllP0TopicIds();

  // Decision pages
  const decisionPages = topics.map((topic) => ({
    url: `${baseUrl}/decisions/${topic.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Guide index page
  const guidesIndexPage = {
    url: `${baseUrl}/guides`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  };

  // Bucket hub pages
  const bucketHubPages = bucketGuides.map((guide) => ({
    url: `${baseUrl}/guides/${guide.bucketSlug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Topic guide pages
  const topicGuidePages = p0TopicIds
    .map((topicId) => {
      const topic = getTopicById(topicId);
      if (!topic) return null;

      const bucketSlug = bucketToSlug(topic.bucket as Parameters<typeof bucketToSlug>[0]);
      const topicSlug = generateSlugFromId(topicId);

      return {
        url: `${baseUrl}/guides/${bucketSlug}/${topicSlug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      };
    })
    .filter((page): page is NonNullable<typeof page> => page !== null);

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    guidesIndexPage,
    ...bucketHubPages,
    ...topicGuidePages,
    ...decisionPages,
  ];
}
