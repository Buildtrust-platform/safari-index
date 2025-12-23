/**
 * Explore Page Types
 *
 * Types for the /explore route (staging only).
 * This page helps travelers find decision topics.
 */

/**
 * Filter values for explore page
 */
export type Region = 'tanzania' | 'kenya' | 'botswana' | 'south_africa' | 'zambia';
export type TravelStyle = 'first_time' | 'repeat' | 'luxury' | 'budget_conscious' | 'families' | 'photographers';
export type BudgetTier = 'budget' | 'mid_range' | 'luxury';
export type TripType = 'timing' | 'destination' | 'logistics' | 'comparison';

/**
 * Sort options
 */
export type SortOption = 'newest' | 'most_used' | 'most_refused';

/**
 * Explore filters state
 */
export interface ExploreFilters {
  region: Region | null;
  travelStyle: TravelStyle | null;
  budgetTier: BudgetTier | null;
  tripType: TripType | null;
}

/**
 * Extended topic with explore metadata
 */
export interface ExploreTopic {
  topic_id: string;
  slug: string;
  question: string;
  context_line: string;
  destinations: string[];
  traveler_profiles: string[];
  tags: string[];
  trip_type: TripType;
  // Staging metrics (mock for now, real data later)
  metrics: {
    view_count: number;
    decision_count: number;
    refusal_count: number;
    last_used: string; // ISO date
  };
}

/**
 * Filter option for UI
 */
export interface FilterOption<T> {
  value: T;
  label: string;
}

/**
 * Available filter options
 */
export const REGION_OPTIONS: FilterOption<Region>[] = [
  { value: 'tanzania', label: 'Tanzania' },
  { value: 'kenya', label: 'Kenya' },
  { value: 'botswana', label: 'Botswana' },
  { value: 'south_africa', label: 'South Africa' },
  { value: 'zambia', label: 'Zambia' },
];

export const TRAVEL_STYLE_OPTIONS: FilterOption<TravelStyle>[] = [
  { value: 'first_time', label: 'First Safari' },
  { value: 'repeat', label: 'Repeat Visitor' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'budget_conscious', label: 'Budget' },
  { value: 'families', label: 'Families' },
  { value: 'photographers', label: 'Photography' },
];

export const BUDGET_TIER_OPTIONS: FilterOption<BudgetTier>[] = [
  { value: 'budget', label: 'Budget' },
  { value: 'mid_range', label: 'Mid-Range' },
  { value: 'luxury', label: 'Luxury' },
];

export const TRIP_TYPE_OPTIONS: FilterOption<TripType>[] = [
  { value: 'timing', label: 'When to Go' },
  { value: 'destination', label: 'Where to Go' },
  { value: 'logistics', label: 'How to Plan' },
  { value: 'comparison', label: 'Compare Options' },
];

export const SORT_OPTIONS: FilterOption<SortOption>[] = [
  { value: 'most_used', label: 'Most Used' },
  { value: 'most_refused', label: 'Most Refused' },
  { value: 'newest', label: 'Newest' },
];
