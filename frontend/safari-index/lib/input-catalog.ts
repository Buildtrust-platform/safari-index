/**
 * Input Catalog - Canonical Input Definitions
 *
 * Normalized, reusable input definitions for P0 decision topics.
 * Each input has a single canonical definition that can be referenced
 * or overridden per-topic when context-specific wording is needed.
 *
 * This catalog:
 * - Reduces duplication across 40 P0 definitions
 * - Ensures consistent key paths, types, and descriptions
 * - Allows topic-specific overrides via spread syntax
 *
 * Usage in p0-decision-definitions.ts:
 *   required_inputs: [INPUT_CATALOG.budget_band, INPUT_CATALOG.travel_month]
 *   // Or with override:
 *   required_inputs: [{ ...INPUT_CATALOG.budget_band, description: 'Context-specific desc' }]
 */

/**
 * Input type specification for catalog entries
 */
export type InputType = 'string' | 'number' | 'boolean' | 'enum' | 'array';

/**
 * Canonical input definition with type metadata
 */
export interface CatalogInput {
  key: string;
  label: string;
  type: InputType;
  description: string;
  example: string;
  options?: readonly string[]; // For enum types
  notes?: string; // Internal notes for maintainers
}

/**
 * Runtime input definition (subset for decision engine)
 * This matches the existing InputDefinition interface
 */
export interface InputDefinition {
  key: string;
  label: string;
  description: string;
  example: string;
}

/**
 * Convert CatalogInput to InputDefinition (strips type metadata)
 */
export function toInputDefinition(input: CatalogInput): InputDefinition {
  return {
    key: input.key,
    label: input.label,
    description: input.description,
    example: input.example,
  };
}

// ============================================================
// INPUT CATALOG
// ============================================================

export const INPUT_CATALOG = {
  // ----------------------------------------------------------
  // BUDGET & COST
  // ----------------------------------------------------------
  budget_band: {
    key: 'user_context.budget_band',
    label: 'Budget tier',
    type: 'enum' as InputType,
    description: 'Your budget category for the safari',
    example: 'fair_value',
    options: ['budget', 'fair_value', 'mid_range', 'luxury', 'ultra_luxury'],
    notes: 'Primary cost driver; affects destination viability and lodge tier',
  },

  comfort_expectations: {
    key: 'user_context.comfort_expectations',
    label: 'Comfort expectations',
    type: 'enum' as InputType,
    description: 'Minimum comfort level you require',
    example: 'moderate',
    options: ['basic', 'moderate', 'high', 'luxury'],
    notes: 'Used for first-timer readiness and budget planning',
  },

  comfort_tolerance: {
    key: 'user_context.comfort_tolerance',
    label: 'Comfort tolerance',
    type: 'enum' as InputType,
    description: 'Willingness to accept basic amenities',
    example: 'high',
    options: ['low', 'moderate', 'high'],
    notes: 'Inverse of comfort_expectations; used for budget topics',
  },

  // ----------------------------------------------------------
  // TRAVELER PROFILE
  // ----------------------------------------------------------
  traveler_type: {
    key: 'user_context.traveler_type',
    label: 'Safari experience',
    type: 'enum' as InputType,
    description: 'Whether this is your first safari or you have prior experience',
    example: 'first_time',
    options: ['first_time', 'repeat', 'experienced'],
    notes: 'Core segmentation input across many decisions',
  },

  travel_style: {
    key: 'user_context.travel_style',
    label: 'Travel style',
    type: 'enum' as InputType,
    description: 'Whether you prefer solo or group experiences',
    example: 'solo',
    options: ['solo', 'couple', 'group', 'family'],
  },

  group_size: {
    key: 'user_context.group_size',
    label: 'Group size',
    type: 'number' as InputType,
    description: 'Number of travelers in your party',
    example: '2',
    notes: 'Affects per-person costs and vehicle requirements',
  },

  group_composition: {
    key: 'user_context.group_composition',
    label: 'Group composition',
    type: 'string' as InputType,
    description: 'Age ranges and mobility levels of all travelers',
    example: 'grandparents_60s, parents_40s, kids_10_12',
    notes: 'For multigenerational planning',
  },

  physical_fitness: {
    key: 'user_context.physical_fitness',
    label: 'Physical fitness',
    type: 'enum' as InputType,
    description: 'Your general fitness level for activities',
    example: 'moderate',
    options: ['limited', 'moderate', 'good', 'excellent'],
    notes: 'Walking safaris, gorilla trekking require good fitness',
  },

  // ----------------------------------------------------------
  // DESTINATIONS
  // ----------------------------------------------------------
  destinations_considered: {
    key: 'request.destinations_considered',
    label: 'Destinations',
    type: 'array' as InputType,
    description: 'Countries or regions being considered',
    example: '["Tanzania", "Kenya"]',
    notes: 'Core routing input; determines applicable logic',
  },

  // ----------------------------------------------------------
  // TIMING
  // ----------------------------------------------------------
  travel_month: {
    key: 'user_context.dates.month',
    label: 'Travel month',
    type: 'enum' as InputType,
    description: 'The month you plan to travel',
    example: 'July',
    options: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    notes: 'Determines migration location, weather, pricing',
  },

  flexibility: {
    key: 'user_context.flexibility',
    label: 'Date flexibility',
    type: 'enum' as InputType,
    description: 'How flexible are your travel dates',
    example: 'somewhat_flexible',
    options: ['fixed', 'somewhat_flexible', 'highly_flexible'],
    notes: 'Affects booking timing and migration planning',
  },

  // ----------------------------------------------------------
  // TRIP LOGISTICS
  // ----------------------------------------------------------
  trip_length: {
    key: 'request.constraints.trip_length',
    label: 'Trip length',
    type: 'number' as InputType,
    description: 'Number of days for safari',
    example: '7',
    notes: 'Core logistics input; affects multi-camp viability',
  },

  time_available: {
    key: 'request.constraints.time_available',
    label: 'Days available',
    type: 'number' as InputType,
    description: 'Total days available for safari portion',
    example: '5',
    notes: 'Alias for trip_length in some contexts',
  },

  total_trip_length: {
    key: 'request.constraints.total_trip_length',
    label: 'Total trip length',
    type: 'number' as InputType,
    description: 'Total trip including extensions (beach, etc.)',
    example: '10',
  },

  // ----------------------------------------------------------
  // TOLERANCES & PREFERENCES
  // ----------------------------------------------------------
  crowd_tolerance: {
    key: 'request.constraints.crowd_tolerance',
    label: 'Crowd tolerance',
    type: 'enum' as InputType,
    description: 'Sensitivity to other vehicles at sightings',
    example: 'medium',
    options: ['low', 'medium', 'high'],
    notes: 'Peak season and Mara have high vehicle density',
  },

  weather_tolerance: {
    key: 'user_context.weather_tolerance',
    label: 'Weather tolerance',
    type: 'enum' as InputType,
    description: 'Comfort with potential rain',
    example: 'moderate',
    options: ['low', 'moderate', 'high'],
    notes: 'Green season viability depends on this',
  },

  risk_tolerance: {
    key: 'user_context.risk_tolerance',
    label: 'Risk tolerance',
    type: 'enum' as InputType,
    description: 'Comfort with uncertainty and adventure',
    example: 'moderate',
    options: ['low', 'moderate', 'high'],
    notes: 'Walking safaris, green season require higher tolerance',
  },

  malaria_tolerance: {
    key: 'request.constraints.malaria_tolerance',
    label: 'Malaria zone tolerance',
    type: 'enum' as InputType,
    description: 'Willingness to travel in malaria zones with prophylaxis',
    example: 'moderate',
    options: ['none', 'low', 'moderate', 'high'],
    notes: 'Zero tolerance limits to SA/specific areas',
  },

  // ----------------------------------------------------------
  // CHILDREN & FAMILY
  // ----------------------------------------------------------
  children_ages: {
    key: 'request.constraints.children_ages',
    label: 'Children ages',
    type: 'array' as InputType,
    description: 'Ages of children traveling',
    example: '[4, 7]',
    notes: 'Many lodges have minimum age policies (6-12)',
  },

  family_travel: {
    key: 'request.constraints.family_travel',
    label: 'Family travel',
    type: 'boolean' as InputType,
    description: 'Traveling with children',
    example: 'true',
  },

  traveling_with_children: {
    key: 'request.constraints.traveling_with_children',
    label: 'Traveling with children',
    type: 'boolean' as InputType,
    description: 'Whether children are part of the travel party',
    example: 'false',
    notes: 'Affects malaria medication considerations',
  },

  // ----------------------------------------------------------
  // MOBILITY & ACCESSIBILITY
  // ----------------------------------------------------------
  mobility_requirements: {
    key: 'request.constraints.mobility_requirements',
    label: 'Mobility requirements',
    type: 'string' as InputType,
    description: 'Any mobility limitations in the group',
    example: 'one_member_limited_walking',
  },

  // ----------------------------------------------------------
  // WILDLIFE & EXPERIENCE
  // ----------------------------------------------------------
  wildlife_priority: {
    key: 'user_context.wildlife_priority',
    label: 'Wildlife priority',
    type: 'enum' as InputType,
    description: 'Importance of optimal wildlife viewing',
    example: 'high',
    options: ['low', 'medium', 'high'],
    notes: 'Drives season and destination recommendations',
  },

  wildlife_expectations: {
    key: 'user_context.wildlife_expectations',
    label: 'Wildlife expectations',
    type: 'enum' as InputType,
    description: 'How important are specific animal sightings',
    example: 'big_five_important',
    options: ['flexible', 'somewhat_specific', 'big_five_important', 'specific_species'],
  },

  migration_interest: {
    key: 'request.constraints.migration_interest',
    label: 'Migration interest',
    type: 'enum' as InputType,
    description: 'What aspect of migration interests you most',
    example: 'river_crossings',
    options: ['general', 'river_crossings', 'calving', 'herd_masses'],
  },

  calving_interest: {
    key: 'user_context.calving_interest',
    label: 'Calving interest',
    type: 'enum' as InputType,
    description: 'Interest in witnessing births and predator action',
    example: 'high',
    options: ['none', 'low', 'interested', 'high'],
  },

  photography_priority: {
    key: 'request.constraints.photography_priority',
    label: 'Photography priority',
    type: 'enum' as InputType,
    description: 'How important is photography to you',
    example: 'high',
    options: ['low', 'medium', 'high'],
    notes: 'Private vehicles and green season skies benefit photographers',
  },

  // ----------------------------------------------------------
  // ACCOMMODATION
  // ----------------------------------------------------------
  accommodation_preference: {
    key: 'user_context.accommodation_preference',
    label: 'Accommodation preference',
    type: 'enum' as InputType,
    description: 'Comfort level with canvas vs solid accommodation',
    example: 'open_to_both',
    options: ['lodges_only', 'open_to_both', 'tented_preferred'],
  },

  accommodation_tier: {
    key: 'user_context.accommodation_tier',
    label: 'Accommodation tier',
    type: 'enum' as InputType,
    description: 'Level of accommodation targeted',
    example: 'high_end',
    options: ['budget', 'mid_range', 'high_end', 'ultra_luxury'],
    notes: 'Premium camps book out faster',
  },

  accommodation_style: {
    key: 'request.constraints.accommodation_style',
    label: 'Accommodation style',
    type: 'enum' as InputType,
    description: 'Preferred style of accommodation',
    example: 'lodge',
    options: ['camping', 'rest_camp', 'tented', 'lodge', 'luxury_lodge'],
  },

  // ----------------------------------------------------------
  // EXCLUSIVITY & PRIVACY
  // ----------------------------------------------------------
  exclusivity_preference: {
    key: 'user_context.exclusivity_preference',
    label: 'Exclusivity preference',
    type: 'enum' as InputType,
    description: 'Importance of low tourist density',
    example: 'high',
    options: ['low', 'moderate', 'high'],
    notes: 'Botswana premium is partly about exclusivity',
  },

  social_preference: {
    key: 'user_context.social_preference',
    label: 'Social preference',
    type: 'enum' as InputType,
    description: 'Whether you want to meet others or prefer solitude',
    example: 'open_to_others',
    options: ['private_preferred', 'open_to_others', 'social'],
  },

  // ----------------------------------------------------------
  // TRIP PURPOSE
  // ----------------------------------------------------------
  trip_purpose: {
    key: 'user_context.trip_purpose',
    label: 'Trip purpose',
    type: 'enum' as InputType,
    description: 'The occasion or purpose of the trip',
    example: 'honeymoon',
    options: ['general', 'honeymoon', 'anniversary', 'celebration', 'bucket_list'],
  },

  romance_priority: {
    key: 'user_context.romance_priority',
    label: 'Romance priority',
    type: 'enum' as InputType,
    description: 'How important is privacy and romantic atmosphere',
    example: 'high',
    options: ['low', 'moderate', 'high'],
  },

  // ----------------------------------------------------------
  // ACTIVITIES
  // ----------------------------------------------------------
  water_activity_interest: {
    key: 'user_context.water_activity_interest',
    label: 'Water activity interest',
    type: 'enum' as InputType,
    description: 'Interest in mokoro, boat safaris, water-based experiences',
    example: 'high',
    options: ['none', 'low', 'moderate', 'high'],
    notes: 'Okavango Delta value depends heavily on this',
  },

  activity_interests: {
    key: 'request.constraints.activity_interests',
    label: 'Activity interests',
    type: 'string' as InputType,
    description: 'Specific activities of interest',
    example: 'mokoro_interested',
  },

  beach_interest: {
    key: 'user_context.beach_interest',
    label: 'Beach interest',
    type: 'enum' as InputType,
    description: 'Interest in combining safari with beach destination',
    example: 'high',
    options: ['none', 'low', 'moderate', 'high'],
  },

  // ----------------------------------------------------------
  // VEHICLE & DRIVING
  // ----------------------------------------------------------
  shared_vehicle_ok: {
    key: 'request.constraints.shared_vehicle_ok',
    label: 'Shared vehicle acceptable',
    type: 'boolean' as InputType,
    description: 'Willingness to share game drive vehicle',
    example: 'true',
    notes: 'Budget options require shared vehicles',
  },

  private_vehicle_preference: {
    key: 'request.constraints.shared_vehicle',
    label: 'Private vehicle preference',
    type: 'boolean' as InputType,
    description: 'Whether you want exclusive use of vehicle',
    example: 'true',
  },

  self_drive_preference: {
    key: 'user_context.self_drive_preference',
    label: 'Self-drive preference',
    type: 'enum' as InputType,
    description: 'Interest in driving yourself vs guided experience',
    example: 'guided_preferred',
    options: ['self_drive', 'guided_preferred', 'no_preference'],
  },

  driving_experience: {
    key: 'user_context.driving_experience',
    label: 'Driving experience',
    type: 'enum' as InputType,
    description: 'Comfort with gravel roads and left-hand drive',
    example: 'experienced',
    options: ['none', 'some', 'experienced'],
  },

  driving_comfort: {
    key: 'user_context.driving_comfort',
    label: 'Self-drive comfort',
    type: 'enum' as InputType,
    description: 'Comfort with left-hand drive if applicable',
    example: 'comfortable',
    options: ['uncomfortable', 'somewhat', 'comfortable'],
  },

  // ----------------------------------------------------------
  // BOOKING & PLANNING
  // ----------------------------------------------------------
  planning_comfort: {
    key: 'user_context.planning_comfort',
    label: 'Planning comfort',
    type: 'enum' as InputType,
    description: 'Comfort level researching and booking yourself',
    example: 'moderate',
    options: ['low', 'moderate', 'high'],
  },

  trip_complexity: {
    key: 'user_context.trip_complexity',
    label: 'Trip complexity',
    type: 'enum' as InputType,
    description: 'Complexity of planned itinerary',
    example: 'complex',
    options: ['simple', 'moderate', 'complex'],
    notes: 'Multi-destination trips benefit from agents',
  },

  // ----------------------------------------------------------
  // HEALTH & SAFETY
  // ----------------------------------------------------------
  health_considerations: {
    key: 'user_context.health_considerations',
    label: 'Health considerations',
    type: 'string' as InputType,
    description: 'Any conditions affecting medication tolerance',
    example: 'none',
  },

  safety_priority: {
    key: 'user_context.safety_priority',
    label: 'Safety priority',
    type: 'enum' as InputType,
    description: 'Importance of reputable operators',
    example: 'high',
    options: ['moderate', 'high'],
  },

  // ----------------------------------------------------------
  // SPECIAL INTERESTS
  // ----------------------------------------------------------
  gorilla_priority: {
    key: 'user_context.gorilla_priority',
    label: 'Gorilla priority',
    type: 'enum' as InputType,
    description: 'How important is gorilla trekking to you',
    example: 'bucket_list',
    options: ['not_interested', 'interested', 'high_priority', 'bucket_list'],
  },

  // ----------------------------------------------------------
  // MISC PREFERENCES
  // ----------------------------------------------------------
  experience_priority: {
    key: 'user_context.experience_priority',
    label: 'Experience priority',
    type: 'enum' as InputType,
    description: 'Immersive bush feel vs conventional comfort',
    example: 'immersive',
    options: ['conventional', 'balanced', 'immersive'],
  },

  variety_preference: {
    key: 'user_context.variety_preference',
    label: 'Variety preference',
    type: 'enum' as InputType,
    description: 'Value placed on seeing different areas',
    example: 'high',
    options: ['low', 'moderate', 'high'],
  },

  pack_unpack_tolerance: {
    key: 'user_context.pack_unpack_tolerance',
    label: 'Pack/unpack tolerance',
    type: 'enum' as InputType,
    description: 'Comfort with frequent camp moves',
    example: 'moderate',
    options: ['low', 'moderate', 'high'],
  },

  early_access_priority: {
    key: 'user_context.early_access_priority',
    label: 'Early access priority',
    type: 'enum' as InputType,
    description: 'Value placed on being in park at dawn',
    example: 'high',
    options: ['low', 'moderate', 'high'],
  },

  flexibility_priority: {
    key: 'user_context.flexibility_priority',
    label: 'Flexibility priority',
    type: 'enum' as InputType,
    description: 'How important is controlling your schedule',
    example: 'high',
    options: ['low', 'moderate', 'high'],
  },

  comfort_priority: {
    key: 'user_context.comfort_priority',
    label: 'Comfort priority',
    type: 'enum' as InputType,
    description: 'How important is high-end comfort between drives',
    example: 'important',
    options: ['low', 'moderate', 'important'],
  },

  service_expectations: {
    key: 'user_context.service_expectations',
    label: 'Service expectations',
    type: 'enum' as InputType,
    description: 'Expectations for personalized service',
    example: 'high',
    options: ['basic', 'moderate', 'high'],
  },

  journey_preference: {
    key: 'user_context.journey_preference',
    label: 'Journey preference',
    type: 'enum' as InputType,
    description: 'Do you value the drive as part of experience',
    example: 'destination_focused',
    options: ['journey_matters', 'no_preference', 'destination_focused'],
  },

  expectation_scope: {
    key: 'user_context.expectation_scope',
    label: 'Expectation scope',
    type: 'enum' as InputType,
    description: 'What you hope to see and do',
    example: 'single_park_focus',
    options: ['single_park_focus', 'multi_park', 'comprehensive'],
  },

  experience_priorities: {
    key: 'user_context.experience_priorities',
    label: 'Experience priorities',
    type: 'enum' as InputType,
    description: 'What matters most to you',
    example: 'wildlife_over_comfort',
    options: ['wildlife_over_comfort', 'balanced', 'comfort_first'],
  },

  adventure_tolerance: {
    key: 'user_context.adventure_tolerance',
    label: 'Adventure tolerance',
    type: 'enum' as InputType,
    description: 'Comfort with early mornings, bumpy roads, wildlife unpredictability',
    example: 'moderate',
    options: ['low', 'moderate', 'high'],
  },

  flexibility_mindset: {
    key: 'user_context.flexibility_mindset',
    label: 'Flexibility mindset',
    type: 'enum' as InputType,
    description: 'Ability to appreciate whatever wildlife appears',
    example: 'somewhat_flexible',
    options: ['rigid', 'somewhat_flexible', 'very_flexible'],
  },

  expectation_management: {
    key: 'user_context.expectation_management',
    label: 'Expectation level',
    type: 'enum' as InputType,
    description: 'Understanding that specific sightings are never guaranteed',
    example: 'realistic',
    options: ['unrealistic', 'somewhat_realistic', 'realistic'],
  },

  fatigue_threshold: {
    key: 'user_context.fatigue_threshold',
    label: 'Fatigue threshold',
    type: 'string' as InputType,
    description: 'When early mornings become tiring',
    example: '7_days',
  },

  fatigue_tolerance: {
    key: 'user_context.fatigue_tolerance',
    label: 'Travel fatigue tolerance',
    type: 'enum' as InputType,
    description: 'Comfort with multiple flights and transitions',
    example: 'moderate',
    options: ['low', 'moderate', 'high'],
  },

  temperature_tolerance: {
    key: 'user_context.temperature_tolerance',
    label: 'Temperature tolerance',
    type: 'enum' as InputType,
    description: 'Comfort with cold early mornings',
    example: 'moderate',
    options: ['low', 'moderate', 'high'],
  },

  pace_preference: {
    key: 'request.constraints.pace_preference',
    label: 'Pace preference',
    type: 'enum' as InputType,
    description: 'Desired activity level',
    example: 'relaxed',
    options: ['relaxed', 'balanced', 'active'],
  },

  wildlife_interpretation_need: {
    key: 'user_context.wildlife_interpretation_need',
    label: 'Interpretation need',
    type: 'enum' as InputType,
    description: 'How important is expert guide knowledge',
    example: 'not_essential',
    options: ['essential', 'valuable', 'not_essential'],
  },

  safari_experience: {
    key: 'user_context.safari_experience',
    label: 'Safari experience',
    type: 'enum' as InputType,
    description: 'Prior game drive experience',
    example: 'some',
    options: ['none', 'some', 'extensive'],
    notes: 'Walking safari readiness depends on this',
  },
} as const;

// Type for the catalog
export type InputCatalogKey = keyof typeof INPUT_CATALOG;

// Helper to get all catalog entries as an array
export function getCatalogEntries(): CatalogInput[] {
  return Object.values(INPUT_CATALOG);
}

// Helper to get input by key path
export function getInputByKeyPath(keyPath: string): CatalogInput | undefined {
  return Object.values(INPUT_CATALOG).find((input) => input.key === keyPath);
}
