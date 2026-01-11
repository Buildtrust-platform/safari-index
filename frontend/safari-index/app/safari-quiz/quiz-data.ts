/**
 * Safari Quiz Data
 *
 * Questions and scoring logic for the personalized trip recommendation quiz.
 * Maps user preferences to trip archetypes and itineraries.
 */

export interface QuizOption {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  tags: string[]; // Tags used for matching trips
}

export interface QuizQuestion {
  id: string;
  question: string;
  description?: string;
  type: 'single' | 'multiple';
  maxSelections?: number;
  options: QuizOption[];
}

/**
 * Quiz questions
 */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'experience',
    question: 'Is this your first safari?',
    description: 'This helps us calibrate our recommendations.',
    type: 'single',
    options: [
      {
        id: 'first-time',
        label: 'Yes, first safari',
        description: 'Looking for a classic introduction to African wildlife',
        tags: ['first-timers', 'classic'],
      },
      {
        id: 'some-experience',
        label: 'Been on 1-2 safaris',
        description: 'Ready for something a bit different',
        tags: ['experienced'],
      },
      {
        id: 'experienced',
        label: 'Experienced safari-goer',
        description: 'Looking for unique destinations or experiences',
        tags: ['experienced', 'specialist'],
      },
    ],
  },
  {
    id: 'priorities',
    question: 'What matters most to you?',
    description: 'Select up to 3 priorities.',
    type: 'multiple',
    maxSelections: 3,
    options: [
      {
        id: 'big-five',
        label: 'Big Five wildlife',
        description: 'Lions, leopards, elephants, buffalo, rhino',
        tags: ['big-five', 'wildlife-focus'],
      },
      {
        id: 'migration',
        label: 'The Great Migration',
        description: 'Wildebeest river crossings and vast herds',
        tags: ['migration', 'seasonal'],
      },
      {
        id: 'primates',
        label: 'Gorillas or chimpanzees',
        description: 'Close encounters with our closest relatives',
        tags: ['primates', 'gorilla-trekking'],
      },
      {
        id: 'photography',
        label: 'Photography opportunities',
        description: 'Special hides, lighting, and positioning',
        tags: ['photography', 'specialist'],
      },
      {
        id: 'luxury',
        label: 'Luxury lodges',
        description: 'Top-tier accommodation and service',
        tags: ['luxury', 'premium'],
      },
      {
        id: 'value',
        label: 'Best value',
        description: 'Quality experiences without premium prices',
        tags: ['budget-conscious', 'value'],
      },
      {
        id: 'off-beaten-path',
        label: 'Off the beaten path',
        description: 'Remote areas, fewer tourists',
        tags: ['remote', 'exclusive'],
      },
      {
        id: 'family-friendly',
        label: 'Family activities',
        description: 'Child-friendly experiences and lodges',
        tags: ['families', 'family-friendly'],
      },
    ],
  },
  {
    id: 'duration',
    question: 'How long can you travel?',
    type: 'single',
    options: [
      {
        id: 'short',
        label: '5-7 days',
        description: 'Focused itinerary, one main destination',
        tags: ['short-trip'],
      },
      {
        id: 'medium',
        label: '8-12 days',
        description: 'Room to explore multiple areas',
        tags: ['medium-trip'],
      },
      {
        id: 'long',
        label: '13+ days',
        description: 'Comprehensive safari with varied experiences',
        tags: ['long-trip', 'comprehensive'],
      },
    ],
  },
  {
    id: 'comfort',
    question: 'What\'s your accommodation style?',
    type: 'single',
    options: [
      {
        id: 'adventure',
        label: 'Adventure camp',
        description: 'Basic but authentic bush experience',
        tags: ['adventure', 'budget-conscious'],
      },
      {
        id: 'comfortable',
        label: 'Comfortable camp/lodge',
        description: 'Good amenities, classic safari feel',
        tags: ['mid-range', 'comfortable'],
      },
      {
        id: 'luxury',
        label: 'Luxury lodge',
        description: 'Premium lodges with exceptional service',
        tags: ['luxury', 'premium'],
      },
      {
        id: 'ultra-luxury',
        label: 'Ultra-luxury',
        description: 'The very best, price no object',
        tags: ['ultra-luxury', 'exclusive'],
      },
    ],
  },
  {
    id: 'activities',
    question: 'Which activities appeal to you?',
    description: 'Select all that interest you.',
    type: 'multiple',
    options: [
      {
        id: 'game-drives',
        label: 'Classic game drives',
        description: 'Dawn and dusk drives in open vehicles',
        tags: ['game-drives', 'classic'],
      },
      {
        id: 'walking',
        label: 'Walking safaris',
        description: 'On foot with armed guides',
        tags: ['walking-safari', 'active'],
      },
      {
        id: 'boat',
        label: 'Boat or canoe safaris',
        description: 'Water-based wildlife viewing',
        tags: ['boat-safari', 'water'],
      },
      {
        id: 'balloon',
        label: 'Hot air balloon',
        description: 'Sunrise flights over the savannah',
        tags: ['balloon', 'scenic'],
      },
      {
        id: 'cultural',
        label: 'Cultural visits',
        description: 'Local community interactions',
        tags: ['cultural', 'community'],
      },
      {
        id: 'birding',
        label: 'Birding',
        description: 'Focused bird watching',
        tags: ['birding', 'specialist'],
      },
    ],
  },
  {
    id: 'region',
    question: 'Any region preferences?',
    description: 'Or skip to see all options.',
    type: 'multiple',
    options: [
      {
        id: 'east-africa',
        label: 'East Africa',
        description: 'Tanzania, Kenya - classic safari destinations',
        tags: ['east-africa', 'tanzania', 'kenya'],
      },
      {
        id: 'southern-africa',
        label: 'Southern Africa',
        description: 'Botswana, South Africa, Zambia',
        tags: ['southern-africa', 'botswana', 'south-africa'],
      },
      {
        id: 'primate-region',
        label: 'Uganda & Rwanda',
        description: 'Gorilla and chimpanzee trekking',
        tags: ['uganda', 'rwanda', 'primates'],
      },
      {
        id: 'no-preference',
        label: 'No preference',
        description: 'Show me the best options anywhere',
        tags: [],
      },
    ],
  },
  {
    id: 'timing',
    question: 'When are you thinking of traveling?',
    type: 'single',
    options: [
      {
        id: 'dry-season',
        label: 'Dry season (Jun-Oct)',
        description: 'Peak wildlife viewing, higher prices',
        tags: ['dry-season', 'peak'],
      },
      {
        id: 'green-season',
        label: 'Green season (Nov-May)',
        description: 'Lush landscapes, lower prices, fewer crowds',
        tags: ['green-season', 'value'],
      },
      {
        id: 'migration-time',
        label: 'During the Migration',
        description: 'Jul-Oct for crossings, Jan-Feb for calving',
        tags: ['migration', 'seasonal'],
      },
      {
        id: 'flexible',
        label: 'I\'m flexible',
        description: 'Open to recommendations',
        tags: ['flexible'],
      },
    ],
  },
];

/**
 * Trip archetypes for matching
 */
export interface TripMatch {
  tripId: string;
  score: number;
  matchedTags: string[];
}

/**
 * Trip data for matching (simplified from full trip data)
 */
export const TRIP_TAGS: Record<string, string[]> = {
  // East Africa - Tanzania
  'classic-serengeti-ngorongoro': ['first-timers', 'classic', 'big-five', 'tanzania', 'east-africa', 'medium-trip', 'game-drives'],
  'migration-focused-serengeti': ['migration', 'seasonal', 'tanzania', 'east-africa', 'experienced', 'medium-trip', 'dry-season'],
  'tanzania-southern-circuit': ['experienced', 'remote', 'walking-safari', 'tanzania', 'east-africa', 'exclusive', 'medium-trip'],

  // East Africa - Kenya
  'classic-kenya-safari': ['first-timers', 'classic', 'big-five', 'kenya', 'east-africa', 'medium-trip', 'game-drives', 'families'],
  'kenya-conservancy-focused': ['exclusive', 'luxury', 'kenya', 'east-africa', 'experienced', 'game-drives', 'walking-safari'],

  // Southern Africa - Botswana
  'okavango-delta-immersion': ['luxury', 'water', 'boat-safari', 'botswana', 'southern-africa', 'medium-trip', 'experienced'],
  'botswana-diverse-ecosystems': ['experienced', 'botswana', 'southern-africa', 'long-trip', 'comprehensive', 'boat-safari'],

  // Southern Africa - South Africa
  'kruger-greater-kruger': ['first-timers', 'classic', 'big-five', 'south-africa', 'southern-africa', 'short-trip', 'value'],
  'south-africa-combo': ['first-timers', 'families', 'south-africa', 'southern-africa', 'medium-trip', 'cultural'],

  // Uganda & Rwanda
  'rwanda-gorilla-focused': ['primates', 'gorilla-trekking', 'rwanda', 'luxury', 'short-trip', 'specialist'],
  'uganda-primate-safari': ['primates', 'gorilla-trekking', 'uganda', 'active', 'medium-trip', 'specialist'],

  // Namibia
  'namibia-highlights': ['photography', 'scenic', 'namibia', 'southern-africa', 'medium-trip', 'experienced'],
  'namibia-self-drive': ['adventure', 'namibia', 'southern-africa', 'long-trip', 'value'],

  // Zambia
  'zambia-walking-safari': ['walking-safari', 'active', 'zambia', 'southern-africa', 'experienced', 'remote'],
  'victoria-falls-safari-combo': ['first-timers', 'zambia', 'zimbabwe', 'southern-africa', 'short-trip', 'water'],

  // Special Interest
  'photography-focused-safari': ['photography', 'specialist', 'experienced', 'medium-trip'],
  'family-multigenerational': ['families', 'family-friendly', 'first-timers', 'medium-trip', 'comfortable'],
  'honeymoon-romance-safari': ['luxury', 'exclusive', 'romantic', 'medium-trip'],
  'budget-first-safari': ['value', 'budget-conscious', 'first-timers', 'short-trip', 'adventure'],
};

/**
 * Trip display data
 */
export const TRIP_DISPLAY: Record<string, { title: string; subtitle: string; region: string }> = {
  'classic-serengeti-ngorongoro': {
    title: 'Classic Serengeti & Ngorongoro',
    subtitle: 'The quintessential Tanzania safari experience',
    region: 'Tanzania',
  },
  'migration-focused-serengeti': {
    title: 'Migration-Focused Serengeti',
    subtitle: 'Follow the Great Migration herds',
    region: 'Tanzania',
  },
  'tanzania-southern-circuit': {
    title: 'Tanzania Southern Circuit',
    subtitle: 'Remote parks, authentic wilderness',
    region: 'Tanzania',
  },
  'classic-kenya-safari': {
    title: 'Classic Kenya Safari',
    subtitle: 'Masai Mara and beyond',
    region: 'Kenya',
  },
  'kenya-conservancy-focused': {
    title: 'Kenya Conservancy Safari',
    subtitle: 'Private reserves, exclusive access',
    region: 'Kenya',
  },
  'okavango-delta-immersion': {
    title: 'Okavango Delta Immersion',
    subtitle: 'Water wilderness of Botswana',
    region: 'Botswana',
  },
  'botswana-diverse-ecosystems': {
    title: 'Botswana Diverse Ecosystems',
    subtitle: 'Delta, desert, and savannah',
    region: 'Botswana',
  },
  'kruger-greater-kruger': {
    title: 'Kruger & Greater Kruger',
    subtitle: 'South Africa\'s premier wildlife destination',
    region: 'South Africa',
  },
  'south-africa-combo': {
    title: 'South Africa Combo',
    subtitle: 'Safari plus Cape Town experience',
    region: 'South Africa',
  },
  'rwanda-gorilla-focused': {
    title: 'Rwanda Gorilla Safari',
    subtitle: 'Mountain gorilla encounters',
    region: 'Rwanda',
  },
  'uganda-primate-safari': {
    title: 'Uganda Primate Safari',
    subtitle: 'Gorillas and chimpanzees',
    region: 'Uganda',
  },
  'namibia-highlights': {
    title: 'Namibia Highlights',
    subtitle: 'Desert landscapes and unique wildlife',
    region: 'Namibia',
  },
  'namibia-self-drive': {
    title: 'Namibia Self-Drive Adventure',
    subtitle: 'Freedom to explore at your pace',
    region: 'Namibia',
  },
  'zambia-walking-safari': {
    title: 'Zambia Walking Safari',
    subtitle: 'On foot in pristine wilderness',
    region: 'Zambia',
  },
  'victoria-falls-safari-combo': {
    title: 'Victoria Falls & Safari',
    subtitle: 'Wildlife plus the world\'s greatest waterfall',
    region: 'Zambia/Zimbabwe',
  },
  'photography-focused-safari': {
    title: 'Photography Safari',
    subtitle: 'Designed for serious photographers',
    region: 'Multi-destination',
  },
  'family-multigenerational': {
    title: 'Family Safari',
    subtitle: 'Perfect for all ages',
    region: 'Multi-destination',
  },
  'honeymoon-romance-safari': {
    title: 'Honeymoon Safari',
    subtitle: 'Romantic bush experiences',
    region: 'Multi-destination',
  },
  'budget-first-safari': {
    title: 'Budget-Friendly First Safari',
    subtitle: 'Great value introduction',
    region: 'Multi-destination',
  },
};

/**
 * Calculate trip matches based on quiz answers
 */
export function calculateMatches(answers: Record<string, string[]>): TripMatch[] {
  // Collect all selected tags
  const selectedTags: string[] = [];

  Object.entries(answers).forEach(([questionId, selectedOptions]) => {
    const question = QUIZ_QUESTIONS.find((q) => q.id === questionId);
    if (!question) return;

    selectedOptions.forEach((optionId) => {
      const option = question.options.find((o) => o.id === optionId);
      if (option) {
        selectedTags.push(...option.tags);
      }
    });
  });

  // Score each trip
  const matches: TripMatch[] = Object.entries(TRIP_TAGS).map(([tripId, tripTags]) => {
    const matchedTags = tripTags.filter((tag) => selectedTags.includes(tag));
    const score = matchedTags.length;
    return { tripId, score, matchedTags };
  });

  // Sort by score descending
  return matches
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);
}

/**
 * Get top recommendations
 */
export function getRecommendations(answers: Record<string, string[]>, limit = 5): TripMatch[] {
  const matches = calculateMatches(answers);
  return matches.slice(0, limit);
}
