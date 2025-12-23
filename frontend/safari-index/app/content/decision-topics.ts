/**
 * Decision Topic Registry
 *
 * Per 14_seo_generation.md:
 * - Topics must be thin-edge and decision-worthy
 * - No generic "best safari" topics
 * - Each topic answers a specific decision question
 *
 * Per 02_decision_doctrine.md:
 * - Every topic must have eligible outcomes
 * - Default outcome represents the most common verdict
 */

/**
 * Input specification for readiness panel (staging only)
 * Maps to StandardInputEnvelope fields
 */
export interface TopicInput {
  key: string; // Maps to envelope field path (e.g., "user_context.budget_band")
  label: string; // Human-readable label
  example: string; // Example value
}

export interface DecisionTopic {
  topic_id: string;
  slug: string;
  question: string;
  context_line: string; // One sentence context for the page
  destinations: string[];
  time_context?: {
    month?: string;
    year?: number;
    season?: string;
  };
  traveler_profiles?: string[];
  primary_risks: string[];
  key_tradeoffs: string[];
  eligible_outcomes: ('book' | 'wait' | 'switch' | 'discard')[];
  default_outcome: 'book' | 'wait' | 'switch' | 'discard';
  confidence_range: [number, number]; // min, max
  published: boolean;
  // Staging-only: inputs for readiness panel
  required_inputs?: TopicInput[];
  optional_inputs?: TopicInput[];
}

/**
 * 10 thin-edge decision topics
 * Each represents a real decision travelers face
 */
export const decisionTopics: DecisionTopic[] = [
  {
    topic_id: 'tz-feb',
    slug: 'tanzania-safari-february',
    question: 'Is February a good time for a Tanzania safari?',
    context_line: 'February rewards flexibility, but it is uneven.',
    destinations: ['Tanzania'],
    time_context: { month: 'February' },
    traveler_profiles: ['first_time', 'repeat'],
    primary_risks: [
      'Higher visitor density during calving season',
      'Accommodation availability constraints',
      'Variable short rains',
    ],
    key_tradeoffs: [
      'Wildlife density vs visitor crowds',
      'Calving spectacle vs premium pricing',
    ],
    eligible_outcomes: ['book', 'wait', 'switch'],
    default_outcome: 'book',
    confidence_range: [0.6, 0.85],
    published: true,
    required_inputs: [
      { key: 'user_context.dates.month', label: 'Travel month', example: 'February' },
      { key: 'user_context.budget_band', label: 'Budget tier', example: 'fair_value' },
      { key: 'user_context.group_size', label: 'Group size', example: '2' },
      { key: 'user_context.traveler_type', label: 'Traveler type', example: 'first_time' },
      { key: 'request.destinations_considered', label: 'Destinations', example: '["Tanzania"]' },
    ],
    optional_inputs: [
      { key: 'user_context.risk_tolerance', label: 'Risk tolerance', example: 'medium' },
      { key: 'user_context.pace_preference', label: 'Pace preference', example: 'balanced' },
      { key: 'request.constraints.crowd_tolerance', label: 'Crowd tolerance', example: 'medium' },
    ],
  },
  {
    topic_id: 'tz-jul',
    slug: 'tanzania-safari-july',
    question: 'Is July a good time for a Tanzania safari?',
    context_line: 'July is peak season with clear trade-offs.',
    destinations: ['Tanzania'],
    time_context: { month: 'July' },
    traveler_profiles: ['first_time', 'repeat'],
    primary_risks: [
      'Peak season pricing',
      'High vehicle density in Serengeti',
      'Booking lead time requirements',
    ],
    key_tradeoffs: [
      'Migration viewing vs crowds',
      'Dry conditions vs premium costs',
    ],
    eligible_outcomes: ['book', 'wait', 'switch'],
    default_outcome: 'book',
    confidence_range: [0.7, 0.9],
    published: true,
    required_inputs: [
      { key: 'user_context.dates.month', label: 'Travel month', example: 'July' },
      { key: 'user_context.budget_band', label: 'Budget tier', example: 'fair_value' },
      { key: 'user_context.group_size', label: 'Group size', example: '2' },
      { key: 'user_context.traveler_type', label: 'Traveler type', example: 'first_time' },
      { key: 'request.destinations_considered', label: 'Destinations', example: '["Tanzania"]' },
    ],
    optional_inputs: [
      { key: 'user_context.risk_tolerance', label: 'Risk tolerance', example: 'medium' },
      { key: 'request.constraints.crowd_tolerance', label: 'Crowd tolerance', example: 'high' },
      { key: 'request.constraints.booking_lead_weeks', label: 'Booking lead time (weeks)', example: '12' },
    ],
  },
  {
    topic_id: 'tz-nov',
    slug: 'tanzania-safari-november',
    question: 'Is November a good time for a Tanzania safari?',
    context_line: 'November sits in the short rains with divided opinion.',
    destinations: ['Tanzania'],
    time_context: { month: 'November' },
    traveler_profiles: ['first_time', 'repeat'],
    primary_risks: [
      'Short rains can disrupt game drives',
      'Some lodges close for maintenance',
      'Roads may become difficult',
    ],
    key_tradeoffs: [
      'Lower prices vs weather uncertainty',
      'Fewer crowds vs limited lodge options',
    ],
    eligible_outcomes: ['book', 'wait', 'switch', 'discard'],
    default_outcome: 'wait',
    confidence_range: [0.5, 0.75],
    published: true,
    required_inputs: [
      { key: 'user_context.dates.month', label: 'Travel month', example: 'November' },
      { key: 'user_context.budget_band', label: 'Budget tier', example: 'fair_value' },
      { key: 'user_context.traveler_type', label: 'Traveler type', example: 'repeat' },
      { key: 'request.destinations_considered', label: 'Destinations', example: '["Tanzania"]' },
    ],
    optional_inputs: [
      { key: 'user_context.risk_tolerance', label: 'Risk tolerance', example: 'high' },
      { key: 'request.constraints.weather_tolerance', label: 'Weather tolerance', example: 'high' },
    ],
  },
  {
    topic_id: 'ke-aug',
    slug: 'kenya-safari-august',
    question: 'Is August a good time for a Kenya safari?',
    context_line: 'August is migration peak in the Mara.',
    destinations: ['Kenya'],
    time_context: { month: 'August' },
    traveler_profiles: ['first_time', 'repeat'],
    primary_risks: [
      'Highest visitor numbers of the year',
      'Mara river crossing timing unpredictable',
      'Premium pricing across all camps',
    ],
    key_tradeoffs: [
      'River crossings vs crowds',
      'Best wildlife action vs highest costs',
    ],
    eligible_outcomes: ['book', 'wait', 'switch'],
    default_outcome: 'book',
    confidence_range: [0.7, 0.9],
    published: true,
    required_inputs: [
      { key: 'user_context.dates.month', label: 'Travel month', example: 'August' },
      { key: 'user_context.budget_band', label: 'Budget tier', example: 'fair_value' },
      { key: 'user_context.group_size', label: 'Group size', example: '2' },
      { key: 'request.destinations_considered', label: 'Destinations', example: '["Kenya"]' },
    ],
    optional_inputs: [
      { key: 'request.constraints.crowd_tolerance', label: 'Crowd tolerance', example: 'high' },
      { key: 'user_context.traveler_type', label: 'Traveler type', example: 'first_time' },
    ],
  },
  {
    topic_id: 'bw-jun',
    slug: 'botswana-safari-june',
    question: 'Is June a good time for a Botswana safari?',
    context_line: 'June marks the start of Botswana dry season.',
    destinations: ['Botswana'],
    time_context: { month: 'June' },
    traveler_profiles: ['repeat', 'luxury'],
    primary_risks: [
      'Early dry season means less concentrated wildlife',
      'Okavango flood levels variable',
      'Cooler temperatures require layering',
    ],
    key_tradeoffs: [
      'Shoulder pricing vs peak wildlife density',
      'Fewer crowds vs less predictable sightings',
    ],
    eligible_outcomes: ['book', 'wait'],
    default_outcome: 'book',
    confidence_range: [0.65, 0.85],
    published: true,
    required_inputs: [
      { key: 'user_context.dates.month', label: 'Travel month', example: 'June' },
      { key: 'user_context.budget_band', label: 'Budget tier', example: 'luxury' },
      { key: 'user_context.traveler_type', label: 'Traveler type', example: 'repeat' },
      { key: 'request.destinations_considered', label: 'Destinations', example: '["Botswana"]' },
    ],
    optional_inputs: [
      { key: 'request.constraints.crowd_tolerance', label: 'Crowd tolerance', example: 'low' },
      { key: 'user_context.pace_preference', label: 'Pace preference', example: 'relaxed' },
    ],
  },
  {
    topic_id: 'tz-vs-ke',
    slug: 'tanzania-vs-kenya-first-safari',
    question: 'Tanzania or Kenya for a first safari?',
    context_line: 'Both deliver, but they deliver differently.',
    destinations: ['Tanzania', 'Kenya'],
    traveler_profiles: ['first_time'],
    primary_risks: [
      'Tanzania requires more driving between parks',
      'Kenya has higher lodge density in Mara',
      'Budget allocation differs significantly',
    ],
    key_tradeoffs: [
      'Serengeti scale vs Mara accessibility',
      'Tanzania variety vs Kenya efficiency',
    ],
    eligible_outcomes: ['book', 'switch'],
    default_outcome: 'book',
    confidence_range: [0.6, 0.8],
    published: true,
    required_inputs: [
      { key: 'user_context.traveler_type', label: 'Traveler type', example: 'first_time' },
      { key: 'user_context.budget_band', label: 'Budget tier', example: 'fair_value' },
      { key: 'user_context.group_size', label: 'Group size', example: '2' },
      { key: 'request.destinations_considered', label: 'Destinations', example: '["Tanzania", "Kenya"]' },
    ],
    optional_inputs: [
      { key: 'user_context.dates.month', label: 'Travel month', example: 'July' },
      { key: 'request.constraints.time_available', label: 'Time available', example: '7' },
    ],
  },
  {
    topic_id: 'short-safari',
    slug: 'is-5-days-enough-for-safari',
    question: 'Is 5 days enough for a safari?',
    context_line: 'Five days works, but constraints matter.',
    destinations: ['Tanzania', 'Kenya', 'Botswana'],
    traveler_profiles: ['first_time', 'time_constrained'],
    primary_risks: [
      'Transit time eats into game viewing',
      'Single-park focus limits variety',
      'Fatigue from compressed schedule',
    ],
    key_tradeoffs: [
      'Depth vs breadth',
      'Quality time vs multi-destination ambition',
    ],
    eligible_outcomes: ['book', 'wait', 'discard'],
    default_outcome: 'book',
    confidence_range: [0.55, 0.8],
    published: true,
    required_inputs: [
      { key: 'request.constraints.time_available', label: 'Days available', example: '5' },
      { key: 'user_context.traveler_type', label: 'Traveler type', example: 'first_time' },
      { key: 'request.destinations_considered', label: 'Destinations', example: '["Tanzania"]' },
    ],
    optional_inputs: [
      { key: 'user_context.budget_band', label: 'Budget tier', example: 'fair_value' },
      { key: 'user_context.pace_preference', label: 'Pace preference', example: 'active' },
    ],
  },
  {
    topic_id: 'kids-safari',
    slug: 'safari-with-young-children',
    question: 'Should I take young children on safari?',
    context_line: 'Age matters less than preparation.',
    destinations: ['Tanzania', 'Kenya', 'South Africa'],
    traveler_profiles: ['families'],
    primary_risks: [
      'Many lodges have minimum age policies',
      'Long game drives challenge attention spans',
      'Malaria zones require medication decisions',
    ],
    key_tradeoffs: [
      'Family experience vs child-appropriate pacing',
      'Wildlife exposure vs safety constraints',
    ],
    eligible_outcomes: ['book', 'wait', 'switch', 'discard'],
    default_outcome: 'wait',
    confidence_range: [0.5, 0.75],
    published: true,
    required_inputs: [
      { key: 'user_context.group_size', label: 'Group size', example: '4' },
      { key: 'user_context.traveler_type', label: 'Traveler type', example: 'families' },
      { key: 'request.constraints.children_ages', label: 'Children ages', example: '[4, 7]' },
      { key: 'request.destinations_considered', label: 'Destinations', example: '["South Africa"]' },
    ],
    optional_inputs: [
      { key: 'user_context.budget_band', label: 'Budget tier', example: 'fair_value' },
      { key: 'request.constraints.malaria_tolerance', label: 'Malaria zone tolerance', example: 'low' },
    ],
  },
  {
    topic_id: 'budget-tz',
    slug: 'tanzania-safari-on-budget',
    question: 'Can I do Tanzania on a budget?',
    context_line: 'Budget safaris exist, but trade-offs are real.',
    destinations: ['Tanzania'],
    traveler_profiles: ['budget_conscious'],
    primary_risks: [
      'Budget options cluster in northern circuit',
      'Vehicle sharing affects flexibility',
      'Accommodation quality varies significantly',
    ],
    key_tradeoffs: [
      'Cost savings vs comfort and privacy',
      'Group departures vs custom timing',
    ],
    eligible_outcomes: ['book', 'switch', 'discard'],
    default_outcome: 'book',
    confidence_range: [0.55, 0.8],
    published: true,
    required_inputs: [
      { key: 'user_context.budget_band', label: 'Budget tier', example: 'budget' },
      { key: 'user_context.group_size', label: 'Group size', example: '2' },
      { key: 'request.destinations_considered', label: 'Destinations', example: '["Tanzania"]' },
    ],
    optional_inputs: [
      { key: 'request.constraints.comfort_tolerance', label: 'Comfort tolerance', example: 'high' },
      { key: 'request.constraints.shared_vehicle', label: 'Shared vehicle OK', example: 'true' },
    ],
  },
  {
    topic_id: 'green-season',
    slug: 'green-season-safari-worth-it',
    question: 'Is a green season safari worth it?',
    context_line: 'Green season divides opinion for good reason.',
    destinations: ['Tanzania', 'Kenya', 'Botswana', 'Zambia'],
    time_context: { season: 'green' },
    traveler_profiles: ['repeat', 'photographers', 'budget_conscious'],
    primary_risks: [
      'Rain can interrupt game drives',
      'Thick vegetation reduces visibility',
      'Some roads become impassable',
    ],
    key_tradeoffs: [
      'Lower prices vs weather risk',
      'Dramatic skies vs wildlife visibility',
      'Birthing season vs dispersed animals',
    ],
    eligible_outcomes: ['book', 'wait', 'switch', 'discard'],
    default_outcome: 'wait',
    confidence_range: [0.45, 0.75],
    published: true,
    required_inputs: [
      { key: 'user_context.dates.season', label: 'Season', example: 'green' },
      { key: 'user_context.traveler_type', label: 'Traveler type', example: 'repeat' },
      { key: 'request.destinations_considered', label: 'Destinations', example: '["Botswana"]' },
    ],
    optional_inputs: [
      { key: 'user_context.budget_band', label: 'Budget tier', example: 'fair_value' },
      { key: 'user_context.risk_tolerance', label: 'Weather risk tolerance', example: 'high' },
      { key: 'request.constraints.photography_priority', label: 'Photography priority', example: 'high' },
    ],
  },
];

/**
 * Get topic by slug
 */
export function getTopicBySlug(slug: string): DecisionTopic | undefined {
  return decisionTopics.find((t) => t.slug === slug);
}

/**
 * Get all published topics
 */
export function getPublishedTopics(): DecisionTopic[] {
  return decisionTopics.filter((t) => t.published);
}

/**
 * Get all topic slugs (for static generation)
 */
export function getAllTopicSlugs(): string[] {
  return getPublishedTopics().map((t) => t.slug);
}
