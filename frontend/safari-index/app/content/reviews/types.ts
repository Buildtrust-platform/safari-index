/**
 * Review System Types
 *
 * Type definitions for the traveler review system.
 * Designed for unfiltered, honest reviews following Expert Africa's model.
 *
 * Per governance:
 * - Reviews are never edited or filtered for sentiment
 * - All reviews include operator response capability
 * - Clear attribution to verified travelers
 * - No incentivized or fake reviews
 */

/**
 * Overall satisfaction rating (1-5 scale)
 */
export type SatisfactionRating = 1 | 2 | 3 | 4 | 5;

/**
 * Review verification status
 */
export type VerificationStatus =
  | 'verified'      // Confirmed booking through Vurara
  | 'claimed'       // User claims to have traveled, not verified
  | 'pending'       // Awaiting verification
  | 'rejected';     // Could not verify

/**
 * Review categories for structured feedback
 */
export interface ReviewRatings {
  overall: SatisfactionRating;
  wildlife?: SatisfactionRating;
  guiding?: SatisfactionRating;
  accommodation?: SatisfactionRating;
  value?: SatisfactionRating;
  logistics?: SatisfactionRating;
}

/**
 * Traveler review
 */
export interface TravelerReview {
  id: string;

  // Trip reference
  inquiry_id?: string;          // Link to original inquiry if booked through Vurara
  itinerary_slug?: string;      // Which itinerary they traveled
  destination_id: string;       // Primary destination
  parks_visited: string[];      // Specific parks/reserves visited

  // Traveler info
  traveler_name: string;        // Display name
  traveler_country: string;     // Country code
  traveler_type: string;        // first-timer, repeat-visitor, etc.
  travel_party: string;         // couple, family, solo, group

  // Trip details
  travel_date: string;          // Month/Year of travel (YYYY-MM)
  duration_days: number;        // How long they traveled

  // Review content
  ratings: ReviewRatings;
  title: string;                // Short summary headline
  review_text: string;          // Full review (unedited)
  highlights: string[];         // What they loved (up to 3)
  improvements: string[];       // What could be better (up to 3)

  // Would recommend
  would_recommend: boolean;
  recommend_for: string[];      // Who they'd recommend this to

  // Metadata
  submitted_at: string;         // ISO date
  verified_at?: string;         // When verification completed
  verification_status: VerificationStatus;

  // Operator response
  operator_response?: {
    text: string;
    responded_at: string;
    responder_name: string;
  };

  // Flags
  is_featured: boolean;         // Highlighted on homepage/destination
  is_published: boolean;        // Visible on site
}

/**
 * Review summary for display
 */
export interface ReviewSummary {
  id: string;
  traveler_name: string;
  traveler_country: string;
  travel_date: string;
  destination_id: string;
  ratings: ReviewRatings;
  title: string;
  review_excerpt: string;       // First 200 chars
  would_recommend: boolean;
  verification_status: VerificationStatus;
  has_operator_response: boolean;
}

/**
 * Aggregate review stats for a destination or itinerary
 */
export interface ReviewStats {
  total_reviews: number;
  average_rating: number;       // 1-5 scale
  rating_distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  category_averages: {
    wildlife: number;
    guiding: number;
    accommodation: number;
    value: number;
    logistics: number;
  };
  recommendation_rate: number;  // % who would recommend
  verified_count: number;       // Reviews from verified bookings
}

/**
 * Review collection request (for post-trip email)
 */
export interface ReviewRequest {
  id: string;
  inquiry_id: string;
  traveler_email: string;
  traveler_name: string;
  itinerary_slug: string;
  destination_id: string;
  travel_end_date: string;

  // Status
  sent_at?: string;
  reminder_sent_at?: string;
  completed_at?: string;
  review_id?: string;           // Link to submitted review

  // Token for secure submission
  submission_token: string;
  token_expires_at: string;
}

/**
 * Review submission payload (from form)
 */
export interface ReviewSubmission {
  token: string;                // From review request
  ratings: ReviewRatings;
  title: string;
  review_text: string;
  highlights: string[];
  improvements: string[];
  would_recommend: boolean;
  recommend_for: string[];
  parks_visited: string[];
  consent_to_publish: boolean;
  display_name?: string;        // Optional override of traveler name
}
