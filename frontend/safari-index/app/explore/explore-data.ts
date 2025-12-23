/**
 * Explore Data Utilities
 *
 * Transforms decision topics into explore format with filtering/sorting.
 * Staging only - uses existing topics registry.
 */

import { decisionTopics, type DecisionTopic } from '../content/decision-topics';
import {
  type ExploreTopic,
  type ExploreFilters,
  type SortOption,
  type TripType,
  type Region,
} from './explore-types';

/**
 * Map destination to region
 */
function destinationToRegion(dest: string): Region | null {
  const map: Record<string, Region> = {
    'Tanzania': 'tanzania',
    'Kenya': 'kenya',
    'Botswana': 'botswana',
    'South Africa': 'south_africa',
    'Zambia': 'zambia',
  };
  return map[dest] || null;
}

/**
 * Infer trip type from topic
 */
function inferTripType(topic: DecisionTopic): TripType {
  const q = topic.question.toLowerCase();

  // Comparison topics
  if (q.includes(' vs ') || q.includes(' or ')) {
    return 'comparison';
  }

  // Timing topics (months, seasons)
  if (topic.time_context?.month || topic.time_context?.season || q.includes('good time')) {
    return 'timing';
  }

  // Logistics (how much, how long, can I)
  if (q.includes('enough') || q.includes('budget') || q.includes('should i')) {
    return 'logistics';
  }

  // Default to destination
  return 'destination';
}

/**
 * Generate tags from topic
 */
function generateTags(topic: DecisionTopic): string[] {
  const tags: string[] = [];

  // Add destinations
  tags.push(...topic.destinations.map((d) => d.toLowerCase()));

  // Add month/season if present
  if (topic.time_context?.month) {
    tags.push(topic.time_context.month.toLowerCase());
  }
  if (topic.time_context?.season) {
    tags.push(topic.time_context.season.toLowerCase());
  }

  // Add traveler profiles
  if (topic.traveler_profiles) {
    tags.push(...topic.traveler_profiles);
  }

  // Add outcome hints
  if (topic.default_outcome === 'wait') {
    tags.push('requires_caution');
  }
  if (topic.default_outcome === 'discard') {
    tags.push('often_refused');
  }

  return tags;
}

/**
 * Generate mock metrics for staging
 * In production, these would come from analytics
 */
function generateMockMetrics(topic: DecisionTopic): ExploreTopic['metrics'] {
  // Seed with topic_id for consistent mock data
  const seed = topic.topic_id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

  return {
    view_count: 100 + (seed % 500),
    decision_count: 20 + (seed % 80),
    refusal_count: 5 + (seed % 20),
    last_used: new Date(Date.now() - (seed % 30) * 24 * 60 * 60 * 1000).toISOString(),
  };
}

/**
 * Transform DecisionTopic to ExploreTopic
 */
function toExploreTopic(topic: DecisionTopic): ExploreTopic {
  return {
    topic_id: topic.topic_id,
    slug: topic.slug,
    question: topic.question,
    context_line: topic.context_line,
    destinations: topic.destinations,
    traveler_profiles: topic.traveler_profiles || [],
    tags: generateTags(topic),
    trip_type: inferTripType(topic),
    metrics: generateMockMetrics(topic),
  };
}

/**
 * Get all explore topics
 */
export function getExploreTopics(): ExploreTopic[] {
  return decisionTopics.filter((t) => t.published).map(toExploreTopic);
}

/**
 * Filter topics by criteria
 */
export function filterTopics(
  topics: ExploreTopic[],
  filters: ExploreFilters
): ExploreTopic[] {
  return topics.filter((topic) => {
    // Region filter
    if (filters.region) {
      const topicRegions = topic.destinations.map(destinationToRegion).filter(Boolean);
      if (!topicRegions.includes(filters.region)) {
        return false;
      }
    }

    // Travel style filter
    if (filters.travelStyle) {
      if (!topic.traveler_profiles.includes(filters.travelStyle)) {
        return false;
      }
    }

    // Budget tier filter (infer from tags/profiles)
    if (filters.budgetTier) {
      const hasBudget =
        topic.tags.includes('budget_conscious') ||
        topic.question.toLowerCase().includes('budget');
      const hasLuxury =
        topic.traveler_profiles.includes('luxury') ||
        topic.question.toLowerCase().includes('luxury');

      if (filters.budgetTier === 'budget' && !hasBudget) return false;
      if (filters.budgetTier === 'luxury' && !hasLuxury) return false;
      // mid_range passes if not specifically budget or luxury
    }

    // Trip type filter
    if (filters.tripType && topic.trip_type !== filters.tripType) {
      return false;
    }

    return true;
  });
}

/**
 * Sort topics
 */
export function sortTopics(
  topics: ExploreTopic[],
  sort: SortOption
): ExploreTopic[] {
  const sorted = [...topics];

  switch (sort) {
    case 'most_used':
      sorted.sort((a, b) => b.metrics.decision_count - a.metrics.decision_count);
      break;
    case 'most_refused':
      sorted.sort((a, b) => b.metrics.refusal_count - a.metrics.refusal_count);
      break;
    case 'newest':
      sorted.sort(
        (a, b) =>
          new Date(b.metrics.last_used).getTime() -
          new Date(a.metrics.last_used).getTime()
      );
      break;
  }

  return sorted;
}

/**
 * Search topics by query
 */
export function searchTopics(topics: ExploreTopic[], query: string): ExploreTopic[] {
  if (!query.trim()) {
    return topics;
  }

  const q = query.toLowerCase().trim();

  return topics.filter((topic) => {
    // Search in question
    if (topic.question.toLowerCase().includes(q)) return true;

    // Search in context line
    if (topic.context_line.toLowerCase().includes(q)) return true;

    // Search in tags
    if (topic.tags.some((tag) => tag.includes(q))) return true;

    // Search in destinations
    if (topic.destinations.some((d) => d.toLowerCase().includes(q))) return true;

    return false;
  });
}
