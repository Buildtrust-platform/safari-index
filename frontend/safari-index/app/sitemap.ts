/**
 * Sitemap Generator
 *
 * Per 14_seo_generation.md:
 * - Include only published topics
 * - No analytics or tracking
 *
 * Includes:
 * - Homepage
 * - Authority hubs (when-to-go, destinations, activities)
 * - Trip pages (index, individual trip archetypes)
 * - Guide pages (index, bucket hubs, topic guides)
 * - Decision pages
 * - Blog pages (index, individual blog articles)
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
import { getAllTrips } from './content/trip-shapes/trips';
import { getAllActivityIds } from './content/activities/activity-primitives';
import { getAllBlogs } from '../lib/blog-content';
import { initializeBlogs } from './content/blog';
import { getAllItineraries } from './content/itineraries';
import { getPublishedSafariTypes } from './content/safari-types';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://safariindex.com';
  const topics = getPublishedTopics();
  const bucketGuides = getAllBucketGuides();
  const p0TopicIds = getAllP0TopicIds();
  const trips = getAllTrips();
  const activityIds = getAllActivityIds();
  const itineraries = getAllItineraries();
  const safariTypes = getPublishedSafariTypes();

  // Initialize blogs to populate the registry
  initializeBlogs();
  const blogs = getAllBlogs();

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

  // Trips index page
  const tripsIndexPage = {
    url: `${baseUrl}/trips`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  };

  // Individual trip pages
  const tripPages = trips.map((trip) => ({
    url: `${baseUrl}/trips/${trip.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Authority hub pages
  const whenToGoPage = {
    url: `${baseUrl}/when-to-go`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  };

  const destinationsPage = {
    url: `${baseUrl}/destinations`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  };

  // Activities hub page
  const activitiesIndexPage = {
    url: `${baseUrl}/activities`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  };

  // Individual activity pages
  const activityPages = activityIds.map((activityId) => ({
    url: `${baseUrl}/activities/${activityId}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Blog index page
  const blogIndexPage = {
    url: `${baseUrl}/blog`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  };

  // Individual blog pages - per spec: monthly, priority 0.6
  const blogPages = blogs.map((blog) => ({
    url: `${baseUrl}/blog/decisions/${blog.decisionSlug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Contact page
  const contactPage = {
    url: `${baseUrl}/contact`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  };

  // Compare page
  const comparePage = {
    url: `${baseUrl}/compare`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  };

  // Explore page
  const explorePage = {
    url: `${baseUrl}/explore`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  };

  // How It Works page
  const howItWorksPage = {
    url: `${baseUrl}/how-it-works`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  };

  // Inquire page
  const inquirePage = {
    url: `${baseUrl}/inquire`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  };

  // Itineraries index page
  const itinerariesIndexPage = {
    url: `${baseUrl}/itineraries`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  };

  // Individual itinerary pages
  const itineraryPages = itineraries.map((itinerary) => ({
    url: `${baseUrl}/itineraries/${itinerary.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Safari Types index page
  const safariTypesIndexPage = {
    url: `${baseUrl}/safari-types`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  };

  // Individual safari type pages
  const safariTypePages = safariTypes.map((safariType) => ({
    url: `${baseUrl}/safari-types/${safariType.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    explorePage,
    comparePage,
    howItWorksPage,
    inquirePage,
    whenToGoPage,
    destinationsPage,
    activitiesIndexPage,
    ...activityPages,
    tripsIndexPage,
    ...tripPages,
    guidesIndexPage,
    ...bucketHubPages,
    ...topicGuidePages,
    ...decisionPages,
    blogIndexPage,
    ...blogPages,
    contactPage,
    itinerariesIndexPage,
    ...itineraryPages,
    safariTypesIndexPage,
    ...safariTypePages,
  ];
}
