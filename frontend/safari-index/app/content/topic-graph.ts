/**
 * Topic Graph - Internal Linking Map
 *
 * Per 13_frontend_templates.md Section 10:
 * - Related decisions (internal linking): 3-5 links max
 * - Must be contextually adjacent, not random
 *
 * Adjacency types:
 * - Month-to-month (same destination)
 * - Destination-to-destination (same decision type)
 * - Comparison adjacency (vs topics)
 * - Constraint adjacency (budget, time, family)
 */

import { decisionTopics, DecisionTopic } from './decision-topics';

/**
 * Each topic maps to 3-5 related topic_ids
 * Relationships are intentional, not algorithmic
 */
export const topicGraph: Record<string, string[]> = {
  // Tanzania February → other Tanzania months + comparison
  'tz-feb': ['tz-jul', 'tz-nov', 'tz-vs-ke', 'green-season'],

  // Tanzania July → other peak months + comparison
  'tz-jul': ['tz-feb', 'ke-aug', 'tz-vs-ke', 'short-safari'],

  // Tanzania November → green season + other shoulder months
  'tz-nov': ['green-season', 'tz-feb', 'budget-tz', 'bw-jun'],

  // Kenya August → Tanzania migration months + comparison
  'ke-aug': ['tz-jul', 'tz-vs-ke', 'short-safari', 'bw-jun'],

  // Botswana June → other destinations + green season
  'bw-jun': ['ke-aug', 'tz-jul', 'green-season', 'budget-tz'],

  // Tanzania vs Kenya → both destination timing topics
  'tz-vs-ke': ['tz-feb', 'tz-jul', 'ke-aug', 'short-safari'],

  // 5 days enough → duration-adjacent + destination starters
  'short-safari': ['tz-vs-ke', 'tz-jul', 'ke-aug', 'kids-safari'],

  // Kids on safari → family-adjacent + safer options
  'kids-safari': ['short-safari', 'tz-vs-ke', 'budget-tz', 'green-season'],

  // Tanzania budget → cost-adjacent + timing for value
  'budget-tz': ['green-season', 'tz-nov', 'short-safari', 'tz-vs-ke'],

  // Green season → budget + specific month shoulders
  'green-season': ['tz-nov', 'budget-tz', 'bw-jun', 'kids-safari'],
};

/**
 * Get related topics for a given topic_id
 * Returns full topic objects, not just IDs
 */
export function getRelatedTopics(topicId: string): DecisionTopic[] {
  const relatedIds = topicGraph[topicId] || [];
  return relatedIds
    .map((id) => decisionTopics.find((t) => t.topic_id === id))
    .filter((t): t is DecisionTopic => t !== undefined && t.published);
}
