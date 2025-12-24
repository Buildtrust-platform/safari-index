/**
 * When to Go Discovery Data
 *
 * Deterministic mapping from timing chips to topic_ids.
 * No backend changes - all filtering happens client-side.
 *
 * Chip categories:
 * - Months: Jan–Dec
 * - Seasons: Dry season, Green season
 * - Interests: Great Migration, Calving, Fewer crowds, Lower prices
 */

/**
 * Month chip options
 */
export const MONTH_CHIPS = [
  { key: 'jan', label: 'Jan' },
  { key: 'feb', label: 'Feb' },
  { key: 'mar', label: 'Mar' },
  { key: 'apr', label: 'Apr' },
  { key: 'may', label: 'May' },
  { key: 'jun', label: 'Jun' },
  { key: 'jul', label: 'Jul' },
  { key: 'aug', label: 'Aug' },
  { key: 'sep', label: 'Sep' },
  { key: 'oct', label: 'Oct' },
  { key: 'nov', label: 'Nov' },
  { key: 'dec', label: 'Dec' },
] as const;

/**
 * Season chip options
 */
export const SEASON_CHIPS = [
  { key: 'dry', label: 'Dry season' },
  { key: 'green', label: 'Green season' },
] as const;

/**
 * Interest chip options
 */
export const INTEREST_CHIPS = [
  { key: 'migration', label: 'Great Migration' },
  { key: 'calving', label: 'Calving' },
  { key: 'fewer_crowds', label: 'Fewer crowds' },
  { key: 'lower_prices', label: 'Lower prices' },
] as const;

export type MonthKey = (typeof MONTH_CHIPS)[number]['key'];
export type SeasonKey = (typeof SEASON_CHIPS)[number]['key'];
export type InterestKey = (typeof INTEREST_CHIPS)[number]['key'];
export type WhenToGoChipKey = MonthKey | SeasonKey | InterestKey;

/**
 * Deterministic mapping: chip key → topic_ids
 *
 * Based on topic time_context and content analysis.
 * Each chip maps to topics that are relevant for that timing/interest.
 */
export const CHIP_TO_TOPICS: Record<WhenToGoChipKey, string[]> = {
  // Months → topics with that month context
  jan: ['tz-feb'], // Shoulder to Feb calving
  feb: ['tz-feb'], // Feb is calving peak
  mar: ['green-season'], // Short rains ending
  apr: ['green-season'], // Green season peak
  may: ['green-season', 'bw-jun'], // Transition
  jun: ['bw-jun', 'tz-jul'], // Dry season starts
  jul: ['tz-jul', 'ke-aug'], // Migration peak building
  aug: ['ke-aug', 'tz-jul'], // Migration river crossings
  sep: ['ke-aug', 'bw-jun'], // Late dry season
  oct: ['tz-nov', 'green-season'], // Transition to short rains
  nov: ['tz-nov', 'green-season'], // Short rains
  dec: ['tz-feb', 'green-season'], // Calving building

  // Seasons → topics with season context
  dry: ['tz-jul', 'ke-aug', 'bw-jun'], // Peak dry season topics
  green: ['green-season', 'tz-nov', 'tz-feb'], // Wet/shoulder topics

  // Interests → topics that match interest
  migration: ['tz-jul', 'ke-aug', 'tz-vs-ke'], // Migration-related
  calving: ['tz-feb'], // Calving season
  fewer_crowds: ['tz-nov', 'green-season', 'bw-jun'], // Lower crowd options
  lower_prices: ['tz-nov', 'green-season', 'budget-tz'], // Budget-friendly timing
};

/**
 * Get topic IDs for a chip
 */
export function getTopicsForChip(chip: WhenToGoChipKey): string[] {
  return CHIP_TO_TOPICS[chip] || [];
}

/**
 * Get all unique topic IDs for multiple chips (union)
 */
export function getTopicsForChips(chips: WhenToGoChipKey[]): string[] {
  const topicSet = new Set<string>();
  for (const chip of chips) {
    for (const topicId of CHIP_TO_TOPICS[chip] || []) {
      topicSet.add(topicId);
    }
  }
  return Array.from(topicSet);
}

/**
 * Check if a chip is a month
 */
export function isMonthChip(chip: string): chip is MonthKey {
  return MONTH_CHIPS.some((m) => m.key === chip);
}

/**
 * Check if a chip is a season
 */
export function isSeasonChip(chip: string): chip is SeasonKey {
  return SEASON_CHIPS.some((s) => s.key === chip);
}

/**
 * Check if a chip is an interest
 */
export function isInterestChip(chip: string): chip is InterestKey {
  return INTEREST_CHIPS.some((i) => i.key === chip);
}
