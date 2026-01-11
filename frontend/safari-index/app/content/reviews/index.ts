/**
 * Review System
 *
 * Infrastructure for collecting and displaying traveler reviews.
 * Currently a placeholder - will be activated once bookings are made.
 *
 * Per governance:
 * - Unfiltered reviews (positive and negative published)
 * - Verified traveler status where possible
 * - Operator response capability
 * - No incentivized reviews
 */

export * from './types';

import type {
  TravelerReview,
  ReviewSummary,
  ReviewStats,
  SatisfactionRating,
} from './types';

/**
 * Placeholder reviews - will be replaced with DynamoDB integration
 * These are example reviews to demonstrate the system
 */
const PLACEHOLDER_REVIEWS: TravelerReview[] = [];

/**
 * Get all published reviews
 */
export function getPublishedReviews(): TravelerReview[] {
  return PLACEHOLDER_REVIEWS.filter((r) => r.is_published);
}

/**
 * Get reviews for a specific destination
 */
export function getReviewsByDestination(destinationId: string): TravelerReview[] {
  return getPublishedReviews().filter((r) => r.destination_id === destinationId);
}

/**
 * Get reviews for a specific itinerary
 */
export function getReviewsByItinerary(itinerarySlug: string): TravelerReview[] {
  return getPublishedReviews().filter((r) => r.itinerary_slug === itinerarySlug);
}

/**
 * Get featured reviews for homepage
 */
export function getFeaturedReviews(limit = 3): TravelerReview[] {
  return getPublishedReviews()
    .filter((r) => r.is_featured && r.verification_status === 'verified')
    .slice(0, limit);
}

/**
 * Calculate review stats for a destination
 */
export function getDestinationReviewStats(destinationId: string): ReviewStats | null {
  const reviews = getReviewsByDestination(destinationId);

  if (reviews.length === 0) {
    return null;
  }

  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalRating = 0;
  let recommendCount = 0;
  let verifiedCount = 0;

  const categoryTotals = {
    wildlife: { sum: 0, count: 0 },
    guiding: { sum: 0, count: 0 },
    accommodation: { sum: 0, count: 0 },
    value: { sum: 0, count: 0 },
    logistics: { sum: 0, count: 0 },
  };

  reviews.forEach((review) => {
    const rating = review.ratings.overall;
    ratingCounts[rating]++;
    totalRating += rating;

    if (review.would_recommend) recommendCount++;
    if (review.verification_status === 'verified') verifiedCount++;

    // Category ratings
    Object.keys(categoryTotals).forEach((cat) => {
      const catRating = review.ratings[cat as keyof typeof categoryTotals];
      if (catRating) {
        categoryTotals[cat as keyof typeof categoryTotals].sum += catRating;
        categoryTotals[cat as keyof typeof categoryTotals].count++;
      }
    });
  });

  return {
    total_reviews: reviews.length,
    average_rating: Number((totalRating / reviews.length).toFixed(1)),
    rating_distribution: ratingCounts,
    category_averages: {
      wildlife: categoryTotals.wildlife.count > 0
        ? Number((categoryTotals.wildlife.sum / categoryTotals.wildlife.count).toFixed(1))
        : 0,
      guiding: categoryTotals.guiding.count > 0
        ? Number((categoryTotals.guiding.sum / categoryTotals.guiding.count).toFixed(1))
        : 0,
      accommodation: categoryTotals.accommodation.count > 0
        ? Number((categoryTotals.accommodation.sum / categoryTotals.accommodation.count).toFixed(1))
        : 0,
      value: categoryTotals.value.count > 0
        ? Number((categoryTotals.value.sum / categoryTotals.value.count).toFixed(1))
        : 0,
      logistics: categoryTotals.logistics.count > 0
        ? Number((categoryTotals.logistics.sum / categoryTotals.logistics.count).toFixed(1))
        : 0,
    },
    recommendation_rate: Number(((recommendCount / reviews.length) * 100).toFixed(0)),
    verified_count: verifiedCount,
  };
}

/**
 * Get review summary for display
 */
export function getReviewSummary(review: TravelerReview): ReviewSummary {
  return {
    id: review.id,
    traveler_name: review.traveler_name,
    traveler_country: review.traveler_country,
    travel_date: review.travel_date,
    destination_id: review.destination_id,
    ratings: review.ratings,
    title: review.title,
    review_excerpt: review.review_text.slice(0, 200) + (review.review_text.length > 200 ? '...' : ''),
    would_recommend: review.would_recommend,
    verification_status: review.verification_status,
    has_operator_response: !!review.operator_response,
  };
}

/**
 * Format rating for display
 */
export function formatRating(rating: SatisfactionRating): string {
  const labels: Record<SatisfactionRating, string> = {
    5: 'Excellent',
    4: 'Very Good',
    3: 'Good',
    2: 'Fair',
    1: 'Poor',
  };
  return labels[rating];
}

/**
 * Get rating color class
 */
export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return 'text-green-600';
  if (rating >= 4) return 'text-green-500';
  if (rating >= 3.5) return 'text-amber-600';
  if (rating >= 3) return 'text-amber-500';
  return 'text-red-500';
}

/**
 * Check if review system has any content
 * Used to conditionally show review sections
 */
export function hasReviews(): boolean {
  return getPublishedReviews().length > 0;
}

/**
 * Check if destination has reviews
 */
export function destinationHasReviews(destinationId: string): boolean {
  return getReviewsByDestination(destinationId).length > 0;
}
