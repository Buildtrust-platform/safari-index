/**
 * P0 Decision Operational Definitions
 *
 * Production-ready definitions for 40 launch-critical decision topics.
 * These plug directly into the decision engine without schema changes.
 *
 * Each definition includes:
 * - Required/optional inputs for decision computation (normalized via INPUT_CATALOG)
 * - Core assumptions that underpin the decision
 * - Symmetric trade-offs (real gains, real losses)
 * - Change conditions that would flip the decision
 * - Explicit refusal triggers
 *
 * Input Normalization:
 * - Common inputs are defined in lib/input-catalog.ts
 * - Use toInputDef() to convert catalog entries
 * - Override with spread syntax when context-specific wording is needed
 */

import {
  INPUT_CATALOG,
  toInputDefinition,
  type InputDefinition,
} from '../../lib/input-catalog';

// Re-export for consumers
export type { InputDefinition };

/**
 * Helper to convert catalog input to definition with optional overrides
 */
function inp(
  catalogKey: keyof typeof INPUT_CATALOG,
  overrides?: Partial<InputDefinition>
): InputDefinition {
  const base = toInputDefinition(INPUT_CATALOG[catalogKey]);
  return overrides ? { ...base, ...overrides } : base;
}

/**
 * Helper for topic-specific inputs not in the catalog
 */
function customInput(def: InputDefinition): InputDefinition {
  return def;
}

export interface TradeoffPair {
  gain: string;
  loss: string;
}

export interface P0DecisionDefinition {
  id: string;
  question: string;
  required_inputs: InputDefinition[];
  optional_inputs: InputDefinition[];
  assumptions: string[];
  tradeoffs: TradeoffPair[];
  change_conditions: string[];
  refusal_triggers: string[];
}

export const p0DecisionDefinitions: P0DecisionDefinition[] = [
  // ============================================================
  // PERSONAL FIT (6 P0 topics)
  // ============================================================
  {
    id: 'first-timer-ready',
    question: 'Am I ready for my first safari?',
    required_inputs: [
      inp('traveler_type'),
      inp('comfort_expectations', {
        label: 'Comfort expectations',
        description: 'Minimum comfort level you require (basic, moderate, high)',
      }),
      inp('physical_fitness', {
        description: 'Your general fitness level for early mornings and vehicle travel',
      }),
    ],
    optional_inputs: [
      customInput({
        key: 'user_context.travel_experience',
        label: 'General travel experience',
        description: 'Experience with developing-country travel',
        example: 'some',
      }),
      inp('flexibility', {
        label: 'Schedule flexibility',
        description: 'Ability to adapt to wildlife-driven schedules',
      }),
    ],
    assumptions: [
      'First-time safari visitors have expectations shaped by documentaries',
      'Wildlife sightings are never guaranteed regardless of destination',
      'Early morning game drives (5-6am) are standard practice',
      'Some degree of dust, bumpy roads, and basic facilities is normal',
      'Malaria prophylaxis may be required depending on destination',
    ],
    tradeoffs: [
      { gain: 'Life-changing wildlife encounters', loss: 'Comfort and predictability' },
      { gain: 'Authentic African wilderness experience', loss: 'Western convenience standards' },
      { gain: 'Expert guide knowledge and interpretation', loss: 'Self-directed exploration' },
    ],
    change_conditions: [
      'If comfort requirements are non-negotiable, consider South Africa private reserves',
      'If early mornings are impossible, safari may not be the right choice',
      'If flexibility is zero, structured group tours may be better than custom safaris',
    ],
    refusal_triggers: [
      'No indication of comfort expectations provided',
      'Physical limitations not disclosed that would affect vehicle travel',
    ],
  },
  {
    id: 'solo-safari-fit',
    question: 'Is solo safari travel right for me?',
    required_inputs: [
      inp('travel_style'),
      inp('budget_band', {
        description: 'Your budget category affects solo supplement costs',
      }),
      inp('social_preference'),
    ],
    optional_inputs: [
      customInput({
        key: 'user_context.solo_travel_experience',
        label: 'Solo travel experience',
        description: 'Prior experience traveling alone',
        example: 'experienced',
      }),
      inp('destinations_considered', {
        description: 'Countries being considered',
      }),
    ],
    assumptions: [
      'Solo supplements can add 30-50% to accommodation costs',
      'Shared vehicle game drives are common at mid-range camps',
      'Solo travelers often find social connection at communal dining',
      'Safety is generally not a concern at established camps and lodges',
      'Some walking safaris require minimum group sizes',
    ],
    tradeoffs: [
      { gain: 'Complete freedom of schedule and pace', loss: 'Higher per-person costs' },
      { gain: 'Potential for deeper wildlife immersion', loss: 'No one to share moments with in real-time' },
      { gain: 'Flexibility to change plans', loss: 'Solo supplement fees at most properties' },
      { gain: 'Meeting diverse travelers at camps', loss: 'Shared vehicle compromises on timing' },
    ],
    change_conditions: [
      'If budget is primary concern, group departures eliminate solo supplements',
      'If seeking romance or celebration, solo may not fit the occasion',
      'If nervous about developing-country travel, a companion may add comfort',
    ],
    refusal_triggers: [
      'Budget not specified when solo supplement is a key cost factor',
      'Conflicting inputs about social preference and travel style',
    ],
  },
  {
    id: 'family-young-kids',
    question: 'Should I take young children (under 6) on safari?',
    required_inputs: [
      inp('children_ages', { example: '[3, 5]' }),
      inp('budget_band', {
        description: 'Family-friendly camps tend to be in specific price ranges',
      }),
      inp('destinations_considered', {
        description: 'Countries being considered',
        example: '["South Africa", "Kenya"]',
      }),
    ],
    optional_inputs: [
      inp('malaria_tolerance', {
        description: 'Willingness to travel with children in malaria zones',
      }),
      customInput({
        key: 'user_context.child_travel_experience',
        label: 'Child travel experience',
        description: 'Prior long-haul travel with children',
        example: 'some',
      }),
    ],
    assumptions: [
      'Many lodges have minimum age policies (often 6-12 years)',
      'Children under 6 cannot participate in walking safaris',
      'Private vehicle bookings are typically required for young families',
      'Attention spans for long game drives are limited',
      'Malaria prophylaxis for young children requires specific medications',
      'South Africa has more malaria-free options than East Africa',
    ],
    tradeoffs: [
      { gain: 'Formative wildlife experience for children', loss: 'Flexibility in lodge choice' },
      { gain: 'Family bonding in unique environment', loss: 'Adult-only activities unavailable' },
      { gain: 'Educational value beyond any classroom', loss: 'Higher costs for private vehicles' },
      { gain: 'Memories that last a lifetime', loss: 'Risk of cranky, tired children' },
    ],
    change_conditions: [
      'If children are under 3, wait until they can remember the experience',
      'If malaria concern is high, focus on South Africa or malaria-free seasons',
      'If budget is constrained, private vehicle requirements may exceed budget',
      'If children have special needs, verify camp accessibility in advance',
    ],
    refusal_triggers: [
      'Children ages not provided',
      'Destinations include high-malaria zones with zero malaria tolerance and no alternatives discussed',
    ],
  },
  {
    id: 'multigenerational',
    question: 'Can a multigenerational group do safari together?',
    required_inputs: [
      inp('group_composition'),
      inp('budget_band', {
        description: 'Multigenerational trips often require larger units or multiple rooms',
      }),
      inp('mobility_requirements'),
    ],
    optional_inputs: [
      inp('pace_preference'),
      inp('private_vehicle_preference', {
        label: 'Private vehicle preference',
        description: 'Whether family wants exclusive use',
      }),
    ],
    assumptions: [
      'Different generations have different activity tolerances',
      'Family units or inter-connecting rooms are limited at most camps',
      'Private vehicle is often necessary for large family groups',
      'Pace must accommodate the slowest member',
      'Early morning drives may not suit all age groups',
      'Some camps handle multigenerational groups better than others',
    ],
    tradeoffs: [
      { gain: 'Shared family experience across generations', loss: 'Pace compromises for all' },
      { gain: 'Grandparents sharing knowledge with grandchildren', loss: 'Higher costs for larger accommodations' },
      { gain: 'Creating lasting family memories', loss: 'Reduced flexibility for individual interests' },
    ],
    change_conditions: [
      'If mobility issues are severe, some destinations become unsuitable',
      'If age range spans very young and elderly, activity overlap may be minimal',
      'If budget cannot cover private vehicle, shared drives may frustrate some members',
    ],
    refusal_triggers: [
      'Group composition not specified',
      'Mobility requirements unclear when age suggests potential limitations',
    ],
  },
  {
    id: 'honeymoon-fit',
    question: 'Is safari right for a honeymoon?',
    required_inputs: [
      inp('trip_purpose', {
        description: 'Confirmation this is a honeymoon or romantic trip',
      }),
      inp('romance_priority'),
      inp('adventure_tolerance'),
    ],
    optional_inputs: [
      inp('budget_band', {
        description: 'Romantic camps tend to be at higher price points',
        example: 'luxury',
      }),
      inp('beach_interest', {
        description: 'Interest in combining safari with beach destination',
        example: 'true',
      }),
    ],
    assumptions: [
      'Romantic safari experiences typically require higher-end properties',
      'Private dining and spa services are available at select camps',
      'Early 5am wake-ups are not inherently romantic',
      'Shared game drives with strangers reduce privacy',
      'Safari-beach combinations are popular for honeymoons',
      'Weather unpredictability can affect romantic outdoor experiences',
    ],
    tradeoffs: [
      { gain: 'Unique, adventurous start to marriage', loss: 'Traditional beach/relaxation honeymoon' },
      { gain: 'Shared awe at wildlife encounters', loss: 'Early mornings and dust' },
      { gain: 'Unforgettable stories to tell', loss: 'Higher cost for romantic properties' },
      { gain: 'Combination safari-beach options', loss: 'More logistics and travel time' },
    ],
    change_conditions: [
      'If romance priority is very high, focus on intimate camps with 6 or fewer rooms',
      'If adventure tolerance is low, consider South Africa private reserves',
      'If budget is limited, romantic safari properties may be out of reach',
      'If relaxation is primary goal, beach-first itinerary may be better',
    ],
    refusal_triggers: [
      'Romance priority and adventure tolerance not specified',
      'Conflicting requirements (high romance, low budget, peak season)',
    ],
  },
  {
    id: 'wildlife-expectation',
    question: 'Will I be disappointed if I don\'t see the Big Five?',
    required_inputs: [
      inp('wildlife_expectations', {
        description: 'How important are specific animal sightings to your satisfaction',
      }),
      inp('flexibility_mindset'),
    ],
    optional_inputs: [
      inp('trip_length', {
        description: 'Longer trips increase odds of varied sightings',
      }),
      inp('destinations_considered', {
        description: 'Some destinations have higher Big Five density',
        example: '["South Africa"]',
      }),
    ],
    assumptions: [
      'The Big Five is a colonial hunting term, not a biological grouping',
      'Leopard and rhino are the hardest to spot in most destinations',
      'No safari can guarantee any specific animal sighting',
      'Longer trips increase probability but never ensure sightings',
      'Many visitors find non-Big Five animals equally compelling',
      'Documentary footage is heavily edited from hundreds of hours',
    ],
    tradeoffs: [
      { gain: 'Potential for iconic animal encounters', loss: 'Guaranteed sighting certainty' },
      { gain: 'Understanding wildlife in natural context', loss: 'Ticking off a checklist' },
      { gain: 'Appreciation for ecosystem complexity', loss: 'Focus on five specific species' },
    ],
    change_conditions: [
      'If specific species are essential, choose destinations with higher densities',
      'If flexibility is very low, safari expectations may not be realistic',
      'If trip is short (3-4 days), manage expectations accordingly',
    ],
    refusal_triggers: [
      'Wildlife expectations not disclosed',
      'Expectation of guaranteed sightings expressed',
    ],
  },

  // ============================================================
  // DESTINATION CHOICE (10 P0 topics)
  // ============================================================
  {
    id: 'tz-vs-ke',
    question: 'Tanzania or Kenya for first safari?',
    required_inputs: [
      inp('destinations_considered', {
        label: 'Destinations being compared',
        description: 'Confirmation that Tanzania and Kenya are being compared',
        example: '["Tanzania", "Kenya"]',
      }),
      inp('budget_band', {
        description: 'Budget affects viable options in each country',
      }),
      inp('traveler_type', {
        label: 'Experience level',
        description: 'First-time vs repeat safari visitor',
      }),
    ],
    optional_inputs: [
      inp('travel_month', {
        description: 'Migration location varies by month',
        example: 'August',
      }),
      inp('crowd_tolerance'),
    ],
    assumptions: [
      'Tanzania is larger with more diverse ecosystems',
      'Kenya Masai Mara is smaller but more vehicle-dense',
      'Tanzania parks have stricter off-road regulations',
      'Kenya generally has slightly lower costs',
      'Both share the Great Migration at different times',
      'Tanzania requires more internal flights or long drives',
    ],
    tradeoffs: [
      { gain: 'Tanzania: Serengeti scale and variety', loss: 'More transit time between parks' },
      { gain: 'Kenya: Accessibility and efficiency', loss: 'Higher vehicle density in Mara' },
      { gain: 'Tanzania: Ngorongoro Crater uniqueness', loss: 'Higher overall costs' },
      { gain: 'Kenya: Easier logistics', loss: 'Less wilderness feeling' },
    ],
    change_conditions: [
      'If budget is primary constraint, Kenya may offer better value',
      'If migration is the goal, timing determines location',
      'If off-road game viewing matters, Kenya Mara allows it',
      'If time is limited, Kenya works better for short trips',
    ],
    refusal_triggers: [
      'Neither Tanzania nor Kenya specified in destinations',
      'Budget not provided when it significantly affects recommendation',
    ],
  },
  {
    id: 'tz-vs-bw',
    question: 'Tanzania or Botswana?',
    required_inputs: [
      inp('destinations_considered', {
        label: 'Destinations being compared',
        description: 'Confirmation that Tanzania and Botswana are being compared',
        example: '["Tanzania", "Botswana"]',
      }),
      inp('budget_band', {
        description: 'Botswana is significantly more expensive',
        example: 'luxury',
      }),
      inp('exclusivity_preference'),
    ],
    optional_inputs: [
      inp('activity_interests', {
        description: 'Interest in water-based activities',
        example: 'mokoro_interested',
      }),
      inp('travel_month', {
        description: 'Affects flooding in Okavango',
        example: 'July',
      }),
    ],
    assumptions: [
      'Botswana costs 2-3x more than Tanzania for equivalent quality',
      'Botswana limits tourist numbers through high-cost, low-volume policy',
      'Tanzania offers the Great Migration; Botswana does not',
      'Okavango Delta provides unique water-based safari',
      'Both have excellent predator sightings',
      'Botswana has less infrastructure for budget travelers',
    ],
    tradeoffs: [
      { gain: 'Tanzania: Migration spectacle', loss: 'Higher tourist density' },
      { gain: 'Botswana: Exclusive, uncrowded', loss: 'Significantly higher cost' },
      { gain: 'Tanzania: More lodge variety at all budgets', loss: 'More vehicles at sightings' },
      { gain: 'Botswana: Water activities (mokoro, boat)', loss: 'No migration experience' },
    ],
    change_conditions: [
      'If budget is limited, Tanzania is the viable option',
      'If migration is essential, Tanzania is the only choice',
      'If exclusivity matters most, Botswana is worth the premium',
      'If water activities appeal, Botswana is unique',
    ],
    refusal_triggers: [
      'Budget not specified when cost difference is 2-3x',
      'Neither destination specified',
    ],
  },
  {
    id: 'sa-vs-ea',
    question: 'South Africa or East Africa for first safari?',
    required_inputs: [
      inp('destinations_considered', {
        label: 'Destinations being compared',
        description: 'Regions being compared',
        example: '["South Africa", "Tanzania"]',
      }),
      inp('malaria_tolerance', {
        description: 'Willingness to use malaria prophylaxis',
      }),
      inp('driving_comfort'),
    ],
    optional_inputs: [
      inp('budget_band', {
        description: 'Both regions have full range',
      }),
      inp('trip_length', {
        description: 'Available days for safari',
      }),
    ],
    assumptions: [
      'South Africa has malaria-free options (Eastern Cape)',
      'East Africa requires malaria prophylaxis in most areas',
      'South Africa allows self-drive in Kruger',
      'East Africa requires guided vehicles in most parks',
      'South Africa has better tourism infrastructure',
      'East Africa offers the Great Migration',
    ],
    tradeoffs: [
      { gain: 'South Africa: Malaria-free options', loss: 'No migration experience' },
      { gain: 'East Africa: Migration spectacle', loss: 'Malaria prophylaxis required' },
      { gain: 'South Africa: Self-drive freedom', loss: 'Less guide expertise on drives' },
      { gain: 'East Africa: Vast wilderness scale', loss: 'Less polished infrastructure' },
    ],
    change_conditions: [
      'If malaria tolerance is zero, South Africa is the only option',
      'If migration is essential, East Africa is required',
      'If self-drive appeals, South Africa Kruger works well',
      'If time is very limited, South Africa is more efficient',
    ],
    refusal_triggers: [
      'Malaria tolerance not specified',
      'Neither region specified for comparison',
    ],
  },
  {
    id: 'rwanda-gorillas-worth',
    question: 'Is Rwanda worth it just for gorillas?',
    required_inputs: [
      inp('budget_band', {
        description: 'Gorilla permits alone cost $1,500 per person',
        example: 'luxury',
      }),
      inp('physical_fitness', {
        description: 'Trekking can be strenuous (2-6 hours, steep terrain)',
        example: 'good',
      }),
      inp('gorilla_priority', {
        description: 'How important is this experience to you',
      }),
    ],
    optional_inputs: [
      inp('trip_length', {
        description: 'Gorilla trekking can be done in 2-3 days',
        example: '3',
      }),
      customInput({
        key: 'request.constraints.combine_safari',
        label: 'Combine with safari',
        description: 'Interest in adding traditional safari',
        example: 'false',
      }),
    ],
    assumptions: [
      'Rwanda gorilla permits cost $1,500 per person (2024)',
      'Sighting is guaranteed (refund if no gorillas found)',
      'One hour with gorillas is the maximum allowed',
      'Trekking difficulty varies by gorilla group location',
      'Rwanda is compact and efficient for gorilla-only trips',
      'Golden monkeys and other activities available as add-ons',
    ],
    tradeoffs: [
      { gain: 'Life-changing primate encounter', loss: 'High cost per hour of experience' },
      { gain: 'Guaranteed gorilla sighting', loss: 'Only one hour allowed' },
      { gain: 'Efficient 2-3 day trip possible', loss: 'No traditional Big Five safari' },
      { gain: 'Supporting gorilla conservation', loss: 'Limited wildlife variety' },
    ],
    change_conditions: [
      'If budget is constrained, Uganda offers permits at $700',
      'If physical fitness is poor, trekking may be too difficult',
      'If gorilla is not a priority, money may be better spent elsewhere',
      'If wanting full safari, combine with Tanzania or Kenya',
    ],
    refusal_triggers: [
      'Budget not specified when permit cost is $1,500',
      'Physical fitness not disclosed when trek difficulty is high',
    ],
  },
  {
    id: 'uganda-vs-rwanda',
    question: 'Uganda or Rwanda for gorilla trekking?',
    required_inputs: [
      inp('destinations_considered', {
        label: 'Destinations being compared',
        description: 'Confirmation comparing Uganda and Rwanda',
        example: '["Uganda", "Rwanda"]',
      }),
      inp('budget_band', {
        description: 'Permit prices differ significantly ($700 vs $1,500)',
        example: 'mid_range',
      }),
      customInput({
        key: 'user_context.trip_length_available',
        label: 'Available time',
        description: 'Uganda requires more travel time',
        example: '5_days',
      }),
    ],
    optional_inputs: [
      customInput({
        key: 'request.constraints.other_activities',
        label: 'Other activity interest',
        description: 'Interest in chimps, tree-climbing lions, etc.',
        example: 'chimps_interested',
      }),
      inp('physical_fitness', {
        description: 'Both require trekking, Uganda can be more rugged',
        example: 'good',
      }),
    ],
    assumptions: [
      'Rwanda permits: $1,500; Uganda permits: $700 (2024)',
      'Rwanda is more compact; Uganda requires 8-10 hour drives',
      'Uganda offers chimp trekking as add-on',
      'Rwanda has better tourism infrastructure',
      'Both have similar gorilla encounter quality',
      'Uganda has tree-climbing lions in Queen Elizabeth NP',
    ],
    tradeoffs: [
      { gain: 'Rwanda: Efficiency and polish', loss: 'Double the permit cost' },
      { gain: 'Uganda: Significant cost savings', loss: 'Long, rough road transfers' },
      { gain: 'Rwanda: Quick in-and-out trip possible', loss: 'Fewer add-on wildlife options' },
      { gain: 'Uganda: Chimps and other primates', loss: 'More rugged infrastructure' },
    ],
    change_conditions: [
      'If time is limited (2-3 days), Rwanda is the only option',
      'If budget matters more than comfort, Uganda saves $800+ per person',
      'If chimps are interesting, Uganda combines both',
      'If wanting polish and ease, Rwanda is superior',
    ],
    refusal_triggers: [
      'Neither Uganda nor Rwanda specified',
      'Budget not specified when permit cost differs by $800',
    ],
  },
  {
    id: 'okavango-worth',
    question: 'Is the Okavango Delta worth the premium?',
    required_inputs: [
      inp('budget_band', {
        description: 'Okavango camps are among the most expensive in Africa',
        example: 'luxury',
      }),
      inp('water_activity_interest'),
      inp('exclusivity_preference', {
        description: 'Value placed on uncrowded experiences',
      }),
    ],
    optional_inputs: [
      inp('travel_month', {
        description: 'Flood levels vary significantly by month',
        example: 'July',
      }),
      customInput({
        key: 'request.constraints.prior_safari_experience',
        label: 'Prior safari experience',
        description: 'First-timers may want traditional safari first',
        example: 'repeat_visitor',
      }),
    ],
    assumptions: [
      'Okavango Delta camps average $1,000-2,000+ per person per night',
      'Water levels peak June-August, lowest November-February',
      'Mokoro canoe and boat safaris are unique to this ecosystem',
      'Predator densities are excellent year-round',
      'Fly-in access adds cost but enhances experience',
      'This is not a migration destination',
    ],
    tradeoffs: [
      { gain: 'Unique water-based safari experience', loss: 'Premium pricing ($1,000+/night)' },
      { gain: 'Exceptional exclusivity and wilderness', loss: 'No migration spectacle' },
      { gain: 'Diverse activities (mokoro, walks, drives)', loss: 'Remote access logistics' },
      { gain: 'Outstanding predator sightings', loss: 'Fewer large herbivore concentrations' },
    ],
    change_conditions: [
      'If budget cannot accommodate $1,000+/night, look elsewhere',
      'If water activities are not appealing, value diminishes',
      'If migration is the goal, Okavango cannot deliver',
      'If first safari, consider East Africa for classic experience first',
    ],
    refusal_triggers: [
      'Budget not specified when costs are $1,000+/night',
      'Water activity interest not indicated',
    ],
  },
  {
    id: 'serengeti-vs-mara',
    question: 'Serengeti or Masai Mara?',
    required_inputs: [
      inp('destinations_considered', {
        label: 'Destinations being compared',
        description: 'Confirmation comparing Serengeti (Tanzania) and Masai Mara (Kenya)',
        example: '["Serengeti", "Masai Mara"]',
      }),
      inp('travel_month', {
        description: 'Migration location varies by month',
        example: 'August',
      }),
      inp('crowd_tolerance', {
        description: 'Sensitivity to vehicle concentrations',
      }),
    ],
    optional_inputs: [
      inp('budget_band', {
        description: 'Kenya generally slightly less expensive',
      }),
      inp('trip_length', {
        description: 'Longer trips suit Serengeti diversity',
      }),
    ],
    assumptions: [
      'Serengeti is 14,750 km²; Masai Mara is 1,510 km²',
      'Migration is in Mara July-October, Serengeti rest of year',
      'Mara has higher vehicle density per square kilometer',
      'Serengeti requires internal flights for full exploration',
      'Both offer exceptional Big Five sightings',
      'River crossings are possible in both (Mara River)',
    ],
    tradeoffs: [
      { gain: 'Serengeti: Vast scale and solitude', loss: 'More logistics and flights' },
      { gain: 'Mara: Compact and accessible', loss: 'Higher vehicle density' },
      { gain: 'Serengeti: Year-round migration presence', loss: 'Longer travel between camps' },
      { gain: 'Mara: River crossing proximity', loss: 'Crowded crossing viewpoints' },
    ],
    change_conditions: [
      'If traveling July-October and want migration, Mara is closer',
      'If crowd-averse, Serengeti private concessions are better',
      'If time is limited, Mara is more efficient',
      'If wanting migration year-round, Serengeti has it somewhere always',
    ],
    refusal_triggers: [
      'Travel month not specified when it determines migration location',
      'Neither Serengeti nor Mara specified',
    ],
  },
  {
    id: 'kruger-vs-private',
    question: 'Kruger National Park or private reserves?',
    required_inputs: [
      inp('destinations_considered', {
        label: 'Options being compared',
        description: 'Kruger public park vs private reserves (Sabi Sands, etc.)',
        example: '["Kruger", "Sabi Sands"]',
      }),
      inp('budget_band', {
        description: 'Private reserves cost significantly more',
      }),
      inp('self_drive_preference'),
    ],
    optional_inputs: [
      inp('accommodation_style'),
      customInput({
        key: 'request.constraints.off_road_importance',
        label: 'Off-road importance',
        description: 'Value placed on off-road game viewing',
        example: 'high',
      }),
    ],
    assumptions: [
      'Kruger public park allows self-drive on tar and gravel roads',
      'Private reserves (Sabi Sands, Timbavati) allow off-road tracking',
      'Private reserves have unfenced boundaries with Kruger',
      'Leopard sightings are significantly higher in private reserves',
      'Kruger rest camps are budget-friendly; private lodges are expensive',
      'Night drives are allowed in private reserves, restricted in Kruger',
    ],
    tradeoffs: [
      { gain: 'Kruger: Budget-friendly self-drive', loss: 'No off-road tracking' },
      { gain: 'Private: Expert guides and off-road', loss: 'Significantly higher cost' },
      { gain: 'Kruger: Freedom and exploration', loss: 'Lower leopard sighting probability' },
      { gain: 'Private: Night drives available', loss: 'Cannot self-drive' },
    ],
    change_conditions: [
      'If budget is constrained, Kruger is viable at 1/5 the cost',
      'If leopard is a priority, private reserves are significantly better',
      'If self-drive appeals, Kruger is the only option',
      'If wanting expert interpretation, private reserves excel',
    ],
    refusal_triggers: [
      'Budget not specified when cost difference is 5x',
      'Self-drive preference not indicated',
    ],
  },
  {
    id: 'single-country-multi',
    question: 'Should I focus on one country or visit multiple?',
    required_inputs: [
      inp('trip_length', {
        description: 'Available days determines viability of multi-country',
        example: '10',
      }),
      inp('budget_band', {
        description: 'Multi-country adds flights and logistics costs',
      }),
      inp('traveler_type', {
        label: 'Experience level',
        description: 'First-timers may benefit from focus',
      }),
    ],
    optional_inputs: [
      customInput({
        key: 'request.constraints.specific_goals',
        label: 'Specific goals',
        description: 'If combining gorillas + safari, multi-country may be needed',
        example: 'gorillas_and_migration',
      }),
      inp('fatigue_tolerance'),
    ],
    assumptions: [
      'Each country transition costs 1-2 days in logistics',
      'Multi-country trips require additional flights',
      'First-time visitors often underestimate destination richness',
      'Depth in one destination often beats breadth across many',
      'Some combinations are logical (e.g., Kenya-Tanzania)',
      'Others are awkward (e.g., South Africa-Rwanda)',
    ],
    tradeoffs: [
      { gain: 'One country: Deeper experience, less fatigue', loss: 'Less variety' },
      { gain: 'Multi-country: More diversity', loss: 'More transit, higher cost' },
      { gain: 'One country: Simpler logistics', loss: 'May miss unique experiences elsewhere' },
      { gain: 'Multi-country: Can combine gorillas + safari', loss: 'Exhausting schedule' },
    ],
    change_conditions: [
      'If trip is under 10 days, single country is usually better',
      'If specific goals require it (gorillas + migration), multi-country is needed',
      'If fatigue tolerance is low, avoid multi-country',
      'If repeat visitor, multi-country adds new experiences',
    ],
    refusal_triggers: [
      'Trip length not specified',
      'Goals unclear when they determine whether multi-country is needed',
    ],
  },

  // ============================================================
  // TIMING (12 P0 topics)
  // ============================================================
  {
    id: 'tz-dry-season',
    question: 'Is dry season the only good time for Tanzania?',
    required_inputs: [
      inp('destinations_considered', {
        label: 'Destination',
        description: 'Confirmation this is about Tanzania',
        example: '["Tanzania"]',
      }),
      inp('wildlife_priority', {
        description: 'Importance of optimal wildlife viewing vs other factors',
      }),
      inp('budget_band', {
        description: 'Green season offers significant savings',
      }),
    ],
    optional_inputs: [
      inp('weather_tolerance'),
      inp('photography_priority', {
        description: 'Green season offers dramatic skies',
      }),
    ],
    assumptions: [
      'Dry season (June-October) has best game viewing conditions',
      'Green season (November-May) offers lower prices and fewer crowds',
      'Wildlife is present year-round, just more dispersed in green season',
      'Calving season (January-February) is green season but spectacular',
      'Some lodges close April-May for maintenance',
      'Road conditions vary in green season',
    ],
    tradeoffs: [
      { gain: 'Dry season: Concentrated wildlife', loss: 'Peak pricing, more visitors' },
      { gain: 'Green season: Lower prices, dramatic landscapes', loss: 'More challenging viewing' },
      { gain: 'Dry season: Easier photography', loss: 'Dustier, less dramatic skies' },
      { gain: 'Green season: Calving spectacle', loss: 'Rain may interrupt drives' },
    ],
    change_conditions: [
      'If budget is primary concern, green season saves 30-40%',
      'If wildlife visibility is essential, stick to dry season',
      'If photography is priority, green season skies are superior',
      'If dates are fixed in green season, trip is still viable',
    ],
    refusal_triggers: [
      'Destination not confirmed as Tanzania',
      'Wildlife priority not indicated',
    ],
  },
  {
    id: 'migration-timing',
    question: 'When is the best time to see the Great Migration?',
    required_inputs: [
      inp('migration_interest'),
      inp('flexibility', {
        label: 'Date flexibility',
      }),
      inp('destinations_considered', {
        label: 'Preferred country',
        description: 'Tanzania, Kenya, or either',
      }),
    ],
    optional_inputs: [
      inp('budget_band', {
        description: 'Migration peak is expensive',
      }),
      inp('crowd_tolerance', {
        description: 'Migration hotspots attract crowds',
      }),
    ],
    assumptions: [
      'Migration is a continuous movement, not a single event',
      'Herds are in Serengeti roughly November-June',
      'Herds are in Masai Mara roughly July-October',
      'River crossings are most likely July-September',
      'Crossings are unpredictable and never guaranteed',
      'Calving (January-February) is a distinct spectacle',
    ],
    tradeoffs: [
      { gain: 'River crossing window: Dramatic action', loss: 'No guarantee of witnessing' },
      { gain: 'Calving season: Predator action, birthing', loss: 'Green season conditions' },
      { gain: 'Following the herd: See the masses', loss: 'Location changes require research' },
      { gain: 'Shoulder periods: Fewer crowds', loss: 'May miss peak concentrations' },
    ],
    change_conditions: [
      'If river crossings are essential, plan July-September',
      'If calving is the goal, plan January-February',
      'If flexibility is low, accept that migration may not be where you are',
      'If crowds are a concern, avoid August entirely',
    ],
    refusal_triggers: [
      'Migration interest not specified (crossings vs calving vs general)',
      'Date flexibility not indicated',
    ],
  },
  {
    id: 'river-crossings',
    question: 'When is the best time to see river crossings?',
    required_inputs: [
      inp('flexibility', {
        label: 'Date flexibility',
        description: 'Crossings are unpredictable',
        example: 'highly_flexible',
      }),
      inp('expectation_management'),
      inp('trip_length', {
        description: 'Longer stays increase odds',
        example: '5',
      }),
    ],
    optional_inputs: [
      inp('destinations_considered', {
        label: 'Preferred location',
        description: 'Mara River in Tanzania or Kenya',
        example: '["Tanzania"]',
      }),
      inp('budget_band', {
        description: 'Crossing season is peak pricing',
      }),
    ],
    assumptions: [
      'River crossings are most likely July-September',
      'Crossings can happen at any time, with no schedule',
      'Some days have multiple crossings; some weeks have none',
      'Position near the river does not guarantee a crossing',
      'Guides communicate to locate herds',
      'Even 7-day trips may miss crossings',
    ],
    tradeoffs: [
      { gain: 'July-September: Best odds', loss: 'Peak pricing, peak crowds' },
      { gain: 'Longer stay: Higher probability', loss: 'More cost, more time' },
      { gain: 'Positioning near river: Ready when it happens', loss: 'May wait hours or days' },
      { gain: 'Flexible dates: Can extend if needed', loss: 'Harder to plan' },
    ],
    change_conditions: [
      'If stay is under 4 days, crossing odds are low',
      'If expectations require guaranteed sighting, safari may disappoint',
      'If budget cannot handle peak season, consider calving instead',
      'If flexibility is zero, accept uncertainty',
    ],
    refusal_triggers: [
      'Expectation of guaranteed crossing expressed',
      'Trip length not provided when it affects probability',
    ],
  },
  {
    id: 'calving-season',
    question: 'Is calving season worth planning around?',
    required_inputs: [
      inp('calving_interest', {
        description: 'Interest in witnessing births and predator action',
      }),
      inp('weather_tolerance', {
        description: 'Calving is during short rains',
      }),
      inp('destinations_considered', {
        label: 'Destination',
        description: 'Calving occurs in southern Serengeti',
        example: '["Tanzania"]',
      }),
    ],
    optional_inputs: [
      inp('travel_month', {
        description: 'Calving peaks January-February',
        example: 'February',
      }),
      inp('crowd_tolerance', {
        description: 'Calving season is busy but not as extreme as crossings',
      }),
    ],
    assumptions: [
      'Calving peaks late January through February',
      'Approximately 8,000 calves born daily during peak',
      'Predators concentrate around birthing areas',
      'Weather is short rains—afternoon showers typical',
      'Southern Serengeti (Ndutu) is the location',
      'Less crowded than river crossing season',
    ],
    tradeoffs: [
      { gain: 'Intense predator action', loss: 'Short rains, afternoon storms' },
      { gain: 'Witnessing births, vulnerable calves', loss: 'Can be emotionally intense' },
      { gain: 'Lower prices than dry season', loss: 'Some roads may be muddy' },
      { gain: 'Dramatic landscapes', loss: 'Dust-free but potentially wet' },
    ],
    change_conditions: [
      'If predator action is priority, calving season is superior to crossings',
      'If weather tolerance is low, dry season may be safer',
      'If dates cannot align with January-February, calving is missed',
      'If sensitive to witnessing kills, calving may be difficult',
    ],
    refusal_triggers: [
      'Calving interest not indicated',
      'Weather tolerance not specified',
    ],
  },
  {
    id: 'green-season-value',
    question: 'Is green season worth it for the savings?',
    required_inputs: [
      inp('budget_band', {
        description: 'Green season offers 30-40% savings',
        example: 'budget',
      }),
      inp('weather_tolerance', {
        description: 'Comfort with rain and muddy conditions',
        example: 'high',
      }),
      inp('traveler_type', {
        label: 'Experience level',
        description: 'Repeat visitors may appreciate green season more',
        example: 'repeat',
      }),
    ],
    optional_inputs: [
      inp('destinations_considered', {
        label: 'Destination',
        description: 'Green season varies by location',
        example: '["Botswana"]',
      }),
      inp('photography_priority', {
        description: 'Green season offers dramatic skies',
      }),
    ],
    assumptions: [
      'Green season pricing is 30-40% lower than dry season',
      'Wildlife is still present, just more dispersed',
      'Some lodges close April-May entirely',
      'Photography can be spectacular with dramatic skies',
      'Fewer tourists and vehicles at sightings',
      'Some roads may be impassable',
    ],
    tradeoffs: [
      { gain: 'Significant cost savings', loss: 'Weather unpredictability' },
      { gain: 'Fewer crowds and vehicles', loss: 'Wildlife more dispersed' },
      { gain: 'Dramatic photography conditions', loss: 'Potential for interrupted drives' },
      { gain: 'Lush, green landscapes', loss: 'Harder to spot animals in vegetation' },
    ],
    change_conditions: [
      'If budget is flexible, dry season is safer choice',
      'If weather tolerance is low, avoid green season',
      'If first safari, consider dry season for best odds',
      'If repeat visitor, green season offers fresh perspective',
    ],
    refusal_triggers: [
      'Weather tolerance not specified',
      'Budget not indicated when it is the primary driver',
    ],
  },
  {
    id: 'christmas-safari',
    question: 'Is Christmas a good time for safari?',
    required_inputs: [
      inp('travel_month', {
        description: 'Confirmation of December travel',
        example: 'December',
      }),
      inp('budget_band', {
        description: 'Christmas is peak season with peak pricing',
      }),
      inp('destinations_considered', {
        label: 'Destination',
        description: 'Weather varies by destination in December',
        example: '["Tanzania"]',
      }),
    ],
    optional_inputs: [
      inp('family_travel', {
        description: 'Traveling with children during school break',
      }),
      inp('weather_tolerance', {
        description: 'December is short rains in East Africa',
      }),
    ],
    assumptions: [
      'December is peak season pricing despite being short rains',
      'Weather is unpredictable—mix of sun and afternoon showers',
      'Bookings fill months in advance for Christmas',
      'Many lodges offer special Christmas programs',
      'Southern Africa (Botswana, Zimbabwe) is in green season',
      'South Africa is summer with good game viewing',
    ],
    tradeoffs: [
      { gain: 'Family holiday timing works', loss: 'Peak season pricing' },
      { gain: 'Festive atmosphere at lodges', loss: 'Booking competition intense' },
      { gain: 'Green landscapes and fewer crowds than July', loss: 'Afternoon rain likely' },
      { gain: 'School holiday alignment', loss: 'Surcharges common' },
    ],
    change_conditions: [
      'If budget is constrained, Christmas may not be affordable',
      'If flexibility exists, January offers similar conditions with lower prices',
      'If must book Christmas, book 9-12 months ahead',
      'If weather tolerance is low, consider South Africa over East Africa',
    ],
    refusal_triggers: [
      'Budget not specified when Christmas pricing is peak',
      'Destination not indicated when weather varies',
    ],
  },
  {
    id: 'tz-feb',
    question: 'Is February a good time for Tanzania safari?',
    required_inputs: [
      inp('destinations_considered', {
        label: 'Destination',
        description: 'Confirmation this is about Tanzania',
        example: '["Tanzania"]',
      }),
      inp('travel_month', {
        description: 'Confirmation of February travel',
        example: 'February',
      }),
      inp('calving_interest', {
        description: 'February is peak calving season',
        example: 'interested',
      }),
    ],
    optional_inputs: [
      inp('budget_band', {
        description: 'Calving season has moderate pricing',
      }),
      inp('weather_tolerance', {
        description: 'Short rains possible',
      }),
    ],
    assumptions: [
      'February is peak calving season in southern Serengeti',
      'Weather is typically short rains—afternoon showers',
      'Predator action is concentrated around birthing areas',
      'Prices are moderate—between peak and green season',
      'Ndutu area is the primary location',
      'Not ideal for river crossings (herds are in south)',
    ],
    tradeoffs: [
      { gain: 'Peak calving and predator action', loss: 'No river crossings' },
      { gain: 'Moderate pricing vs. dry season', loss: 'Potential afternoon rain' },
      { gain: 'Dramatic wildlife interactions', loss: 'Can be emotionally intense' },
      { gain: 'Green, photogenic landscapes', loss: 'Dust is minimal but mud possible' },
    ],
    change_conditions: [
      'If river crossings are the goal, February is wrong timing',
      'If budget is very tight, April may be cheaper but riskier',
      'If calving is not interesting, dry season is safer',
      'If weather tolerance is very low, postpone to June-October',
    ],
    refusal_triggers: [
      'Destination not confirmed as Tanzania',
      'Travel month not confirmed as February',
    ],
  },
  {
    id: 'tz-jul',
    question: 'Is July a good time for Tanzania safari?',
    required_inputs: [
      inp('destinations_considered', {
        label: 'Destination',
        description: 'Confirmation this is about Tanzania',
        example: '["Tanzania"]',
      }),
      inp('travel_month', {
        description: 'Confirmation of July travel',
        example: 'July',
      }),
      inp('budget_band', {
        description: 'July is peak season pricing',
      }),
    ],
    optional_inputs: [
      inp('crowd_tolerance', {
        description: 'July is busy season',
      }),
      inp('migration_interest', {
        description: 'Herds are moving north',
        example: 'crossings',
      }),
    ],
    assumptions: [
      'July is peak dry season with excellent game viewing',
      'Migration herds are typically in northern Serengeti or crossing to Mara',
      'Pricing is at annual peak',
      'Weather is dry, cool mornings, warm days',
      'Vehicle density at popular sightings is high',
      'Booking 6-12 months ahead is advisable',
    ],
    tradeoffs: [
      { gain: 'Optimal dry season viewing conditions', loss: 'Peak pricing' },
      { gain: 'Migration in northern Serengeti', loss: 'Crossing timing unpredictable' },
      { gain: 'Reliable weather', loss: 'More tourists and vehicles' },
      { gain: 'All lodges and roads open', loss: 'Popular camps book out early' },
    ],
    change_conditions: [
      'If budget is primary constraint, consider shoulder months',
      'If crowds are concerning, private concessions are better',
      'If crossings are essential, flexibility on exact timing helps',
      'If booking late, availability may be limited',
    ],
    refusal_triggers: [
      'Destination not confirmed as Tanzania',
      'Travel month not confirmed as July',
    ],
  },
  {
    id: 'ke-aug',
    question: 'Is August a good time for Kenya safari?',
    required_inputs: [
      inp('destinations_considered', {
        label: 'Destination',
        description: 'Confirmation this is about Kenya',
        example: '["Kenya"]',
      }),
      inp('travel_month', {
        description: 'Confirmation of August travel',
        example: 'August',
      }),
      inp('crowd_tolerance', {
        description: 'August is busiest month in Mara',
        example: 'high',
      }),
    ],
    optional_inputs: [
      inp('budget_band', {
        description: 'August is absolute peak pricing',
      }),
      inp('migration_interest', {
        description: 'August is peak Mara crossing season',
        example: 'crossings',
      }),
    ],
    assumptions: [
      'August is absolute peak season in Masai Mara',
      'River crossings are most likely July-September',
      'Vehicle density at crossings can be extreme',
      'Pricing is at annual maximum',
      'Weather is dry and reliable',
      'Booking 9-12 months ahead is often necessary',
    ],
    tradeoffs: [
      { gain: 'Best odds for river crossings', loss: 'Maximum crowds and prices' },
      { gain: 'Migration herds concentrated', loss: 'Dozens of vehicles at crossings' },
      { gain: 'Reliable dry weather', loss: 'Dusty conditions' },
      { gain: 'Peak wildlife action', loss: 'Premium required for availability' },
    ],
    change_conditions: [
      'If crowds are a concern, consider September or private conservancies',
      'If budget is limited, August Mara may be unaffordable',
      'If flexibility exists, late July or early September has similar odds with fewer crowds',
      'If private conservancy access is available, experience improves significantly',
    ],
    refusal_triggers: [
      'Destination not confirmed as Kenya',
      'Travel month not confirmed as August',
      'Crowd tolerance not indicated when August is extreme',
    ],
  },
  {
    id: 'bw-jun',
    question: 'Is June a good time for Botswana safari?',
    required_inputs: [
      inp('destinations_considered', {
        label: 'Destination',
        description: 'Confirmation this is about Botswana',
        example: '["Botswana"]',
      }),
      inp('travel_month', {
        description: 'Confirmation of June travel',
        example: 'June',
      }),
      inp('budget_band', {
        description: 'June is shoulder season pricing',
      }),
    ],
    optional_inputs: [
      inp('water_activity_interest', {
        description: 'Flood levels affect mokoro and boat options',
        example: 'high',
      }),
      inp('temperature_tolerance', {
        description: 'June mornings are cold (5-10°C)',
      }),
    ],
    assumptions: [
      'June marks start of dry season in Botswana',
      'Okavango flood waters are rising or at peak',
      'Morning temperatures can be cold (5-10°C/41-50°F)',
      'Wildlife concentrates around permanent water',
      'Pricing is shoulder season—below July-October peak',
      'Predator sightings are excellent as prey concentrates',
    ],
    tradeoffs: [
      { gain: 'Excellent water levels for mokoro', loss: 'Cold early mornings' },
      { gain: 'Shoulder season pricing', loss: 'Wildlife not yet fully concentrated' },
      { gain: 'Fewer tourists than July-October', loss: 'May need extra layers' },
      { gain: 'Green season transitioning out', loss: 'Some areas still drying' },
    ],
    change_conditions: [
      'If cold mornings are a problem, wait until August-September',
      'If water activities are priority, June-July is optimal',
      'If budget is tight, June offers value compared to peak',
      'If wanting drier conditions, July-October is safer',
    ],
    refusal_triggers: [
      'Destination not confirmed as Botswana',
      'Travel month not confirmed as June',
    ],
  },
  {
    id: 'booking-lead-time',
    question: 'How far in advance should I book?',
    required_inputs: [
      inp('travel_month', {
        description: 'Peak season requires longer lead time',
        example: 'August',
      }),
      inp('flexibility', {
        label: 'Flexibility level',
        description: 'How flexible are you on dates and properties',
        example: 'low',
      }),
      inp('accommodation_tier'),
    ],
    optional_inputs: [
      inp('destinations_considered', {
        label: 'Destination',
        description: 'Some destinations book faster',
        example: '["Botswana"]',
      }),
      customInput({
        key: 'request.constraints.specific_camps',
        label: 'Specific camps wanted',
        description: 'Particular properties require earlier booking',
        example: 'true',
      }),
    ],
    assumptions: [
      'Peak season (July-October) requires 9-12 month lead time',
      'Premium camps in Botswana book 12+ months ahead',
      'Gorilla permits should be booked 6+ months ahead',
      'Shoulder seasons offer more last-minute availability',
      'Flexibility on dates and properties improves availability',
      'Group size affects availability (larger groups harder)',
    ],
    tradeoffs: [
      { gain: 'Early booking: Best selection', loss: 'Less flexibility to change plans' },
      { gain: 'Last-minute booking: Lower prices possible', loss: 'Limited availability' },
      { gain: 'Booking with agent: Access to allocations', loss: 'Agent fees' },
      { gain: 'Flexibility: More options', loss: 'May not get first-choice camps' },
    ],
    change_conditions: [
      'If specific camps are essential, book 12 months ahead',
      'If flexible on properties, 3-6 months may work',
      'If traveling green season, shorter lead time is fine',
      'If gorillas are included, permits drive the timeline',
    ],
    refusal_triggers: [
      'Travel month not specified',
      'Flexibility level not indicated',
    ],
  },

  // ============================================================
  // EXPERIENCE TYPE (3 P0 topics)
  // ============================================================
  {
    id: 'walking-safari',
    question: 'Is a walking safari worth the risk and cost?',
    required_inputs: [
      inp('physical_fitness', {
        description: 'Walking safaris require moderate to good fitness',
        example: 'good',
      }),
      inp('risk_tolerance', {
        description: 'Walking with dangerous game carries inherent risk',
      }),
      inp('safari_experience', {
        description: 'Prior game drive experience recommended',
      }),
    ],
    optional_inputs: [
      inp('destinations_considered', {
        label: 'Destination',
        description: 'Not all destinations offer walking',
        example: '["Zambia"]',
      }),
      customInput({
        key: 'request.constraints.walking_intensity',
        label: 'Walking intensity',
        description: 'Multi-day vs. short walks',
        example: 'half_day',
      }),
    ],
    assumptions: [
      'Walking safaris involve armed guides and strict safety protocols',
      'Risk of dangerous animal encounter exists but is managed',
      'Pace is slow—focus on tracking, birds, insects, not vehicle miles',
      'Not suitable for young children or those with mobility issues',
      'Zambia, Zimbabwe, and some Tanzanian camps specialize in walking',
      'Multi-day walking safaris require good fitness',
    ],
    tradeoffs: [
      { gain: 'Intimate connection with bush', loss: 'Inherent safety considerations' },
      { gain: 'See what vehicles miss (tracks, birds)', loss: 'Less ground covered' },
      { gain: 'Heightened senses and awareness', loss: 'May not see Big Five up close' },
      { gain: 'Physical engagement with landscape', loss: 'Requires fitness and stamina' },
    ],
    change_conditions: [
      'If fitness is poor, walking safaris are not suitable',
      'If risk tolerance is very low, stick to vehicle safaris',
      'If first safari, consider game drives first',
      'If wanting big predator encounters, vehicle is usually better',
    ],
    refusal_triggers: [
      'Physical fitness not disclosed',
      'Risk tolerance not indicated',
    ],
  },
  {
    id: 'self-drive-safari',
    question: 'Should I do a self-drive safari?',
    required_inputs: [
      inp('driving_experience'),
      inp('wildlife_interpretation_need'),
      inp('destinations_considered', {
        label: 'Destination',
        description: 'Only some destinations allow self-drive',
        example: '["South Africa", "Namibia"]',
      }),
    ],
    optional_inputs: [
      inp('budget_band', {
        description: 'Self-drive is significantly cheaper',
        example: 'budget',
      }),
      customInput({
        key: 'request.constraints.navigation_comfort',
        label: 'Navigation comfort',
        description: 'Comfort finding your way in parks',
        example: 'comfortable',
      }),
    ],
    assumptions: [
      'Self-drive is viable in Kruger, Etosha, Namibia, some Kenya parks',
      'Tanzania and Botswana require guided vehicles in most areas',
      'No guide means no expert interpretation or tracking',
      'Significant cost savings vs. guided lodges',
      'Flexibility to set your own schedule',
      'Navigation apps and maps are essential',
    ],
    tradeoffs: [
      { gain: 'Complete freedom and flexibility', loss: 'No expert guide knowledge' },
      { gain: 'Significant cost savings', loss: 'May miss sightings guides would find' },
      { gain: 'Your own vehicle and schedule', loss: 'Responsibility for navigation' },
      { gain: 'Sense of adventure and discovery', loss: 'No off-road tracking allowed' },
    ],
    change_conditions: [
      'If guide interpretation is valued, self-drive may disappoint',
      'If destination does not allow self-drive, guided is the only option',
      'If budget is not a concern, guided adds significant value',
      'If nervous about Africa driving, guided is safer',
    ],
    refusal_triggers: [
      'Driving experience not disclosed',
      'Destination does not allow self-drive but is specified',
    ],
  },
  {
    id: 'private-vs-shared',
    question: 'Is a private vehicle worth double the cost?',
    required_inputs: [
      inp('budget_band', {
        description: 'Private vehicles significantly increase cost',
        example: 'mid_range',
      }),
      inp('flexibility_priority'),
      inp('group_size', {
        description: 'Larger groups make private more economical per person',
        example: '4',
      }),
    ],
    optional_inputs: [
      inp('photography_priority', {
        description: 'Photographers benefit from vehicle control',
      }),
      inp('social_preference', {
        description: 'Whether you enjoy meeting other travelers',
        example: 'private_preferred',
      }),
    ],
    assumptions: [
      'Private vehicle typically costs 30-100% more than shared',
      'Private means you control timing, stops, and pace',
      'Shared vehicles follow majority preferences',
      'Photographers strongly benefit from private',
      'Groups of 4+ make private more cost-effective per person',
      'Some camps include private vehicle at higher rates',
    ],
    tradeoffs: [
      { gain: 'Complete control of game drive', loss: 'Significant extra cost' },
      { gain: 'Stay at sightings as long as you want', loss: 'No social interaction with other guests' },
      { gain: 'Photography positions optimized', loss: 'May feel isolated' },
      { gain: 'Flexibility for special requests', loss: 'Higher per-person cost for small groups' },
    ],
    change_conditions: [
      'If budget is primary constraint, shared is acceptable',
      'If photography is serious, private is worth it',
      'If group is 4+, private becomes more economical',
      'If social interaction is valued, shared may be preferable',
    ],
    refusal_triggers: [
      'Budget not specified when cost difference is significant',
      'Flexibility priority not indicated',
    ],
  },

  // ============================================================
  // ACCOMMODATION (5 P0 topics)
  // ============================================================
  {
    id: 'lodge-vs-tented',
    question: 'Lodge or tented camp?',
    required_inputs: [
      inp('accommodation_preference', {
        description: 'Comfort level with canvas accommodation',
      }),
      inp('experience_priority'),
      customInput({
        key: 'user_context.weather_sensitivity',
        label: 'Weather sensitivity',
        description: 'Comfort with hearing rain, animals at night',
        example: 'enjoy_it',
      }),
    ],
    optional_inputs: [
      inp('budget_band', {
        description: 'Both styles exist at all price points',
      }),
      inp('family_travel', {
        description: 'With children considerations differ',
        example: 'false',
      }),
    ],
    assumptions: [
      'Modern tented camps often rival lodges in comfort',
      'Tents provide closer connection to sounds of the bush',
      'Lodges offer more solid construction and climate control',
      'Both styles exist at budget, mid-range, and luxury levels',
      'Tented does not mean basic—many have flush toilets and showers',
      'Some people have genuine canvas phobia',
    ],
    tradeoffs: [
      { gain: 'Tented: Immersive bush atmosphere', loss: 'Less sound insulation' },
      { gain: 'Lodge: Conventional comfort and privacy', loss: 'May feel less connected to wilderness' },
      { gain: 'Tented: Hear wildlife at night', loss: 'Some find this unsettling' },
      { gain: 'Lodge: Better climate control', loss: 'Less authentic safari feel' },
    ],
    change_conditions: [
      'If canvas is genuinely uncomfortable, choose lodges',
      'If immersion matters, tented is usually superior',
      'If traveling with nervous children, lodges may feel safer',
      'If wanting quintessential safari, tented is often preferred',
    ],
    refusal_triggers: [
      'Accommodation preference not indicated',
      'Experience priority not specified',
    ],
  },
  {
    id: 'luxury-worth-it',
    question: 'Is luxury accommodation worth it on safari?',
    required_inputs: [
      inp('budget_band', {
        description: 'Luxury camps cost $1,000-3,000+ per person per night',
        example: 'luxury',
      }),
      inp('comfort_priority'),
      inp('service_expectations'),
    ],
    optional_inputs: [
      inp('trip_purpose', {
        description: 'Special occasion may warrant splurge',
      }),
      inp('exclusivity_preference', {
        description: 'Value placed on small, private camps',
      }),
    ],
    assumptions: [
      'Luxury camps cost 3-5x mid-range options',
      'Guide quality is often (not always) better at luxury camps',
      'Food, wine, and service are significantly superior',
      'Wildlife is the same—animals do not prefer luxury camps',
      'Location and concession access may be better',
      'Guest-to-guide ratios are typically lower',
    ],
    tradeoffs: [
      { gain: 'Exceptional comfort and service', loss: 'Significant budget impact' },
      { gain: 'Often better guide-to-guest ratios', loss: 'Could do more days at mid-range' },
      { gain: 'Premium locations and concessions', loss: 'Wildlife itself is same quality' },
      { gain: 'Culinary and wine experiences', loss: 'May feel overly pampered for bush' },
    ],
    change_conditions: [
      'If budget is constrained, mid-range delivers excellent safaris',
      'If special occasion, luxury may be worth the splurge',
      'If comfort between drives matters little, save the money',
      'If exclusive concession access matters, luxury often provides it',
    ],
    refusal_triggers: [
      'Budget not specified when discussing $1,000+/night options',
      'Comfort priority not indicated',
    ],
  },
  {
    id: 'budget-accommodation-ok',
    question: 'Is budget accommodation acceptable for safari?',
    required_inputs: [
      inp('budget_band', {
        description: 'Confirmation of budget constraints',
        example: 'budget',
      }),
      inp('comfort_tolerance', {
        description: 'Willingness to accept basic amenities',
        example: 'high',
      }),
      inp('destinations_considered', {
        label: 'Destination',
        description: 'Budget options vary by country',
        example: '["Tanzania"]',
      }),
    ],
    optional_inputs: [
      customInput({
        key: 'user_context.privacy_importance',
        label: 'Privacy importance',
        description: 'Budget often means shared facilities',
        example: 'low',
      }),
      customInput({
        key: 'request.constraints.vehicle_sharing',
        label: 'Vehicle sharing',
        description: 'Budget usually means shared vehicles',
        example: 'acceptable',
      }),
    ],
    assumptions: [
      'Budget safaris ($150-300/day) are viable in Tanzania and Kenya',
      'Accommodation quality varies significantly—some are poor',
      'Shared vehicles are standard at budget level',
      'Guide quality can be lower at budget operations',
      'Wildlife is the same; experience interpretation may differ',
      'Some budget operators cut corners on safety or ethics',
    ],
    tradeoffs: [
      { gain: 'Safari at accessible price point', loss: 'Basic amenities' },
      { gain: 'See the same wildlife', loss: 'Less expert interpretation' },
      { gain: 'More days in the bush for same money', loss: 'Shared vehicles and schedules' },
      { gain: 'Accessible entry to safari', loss: 'Some operators are substandard' },
    ],
    change_conditions: [
      'If comfort tolerance is low, budget may disappoint',
      'If guide quality matters, budget is risky',
      'If wanting private vehicle, budget cannot deliver',
      'If safety concerns are high, choose established operators only',
    ],
    refusal_triggers: [
      'Comfort tolerance not specified',
      'Budget constraint not confirmed',
    ],
  },
  {
    id: 'inside-vs-outside-park',
    question: 'Should I stay inside or outside the park?',
    required_inputs: [
      inp('budget_band', {
        description: 'Inside-park options are often more expensive',
      }),
      inp('early_access_priority'),
      customInput({
        key: 'request.constraints.night_sounds_preference',
        label: 'Night sounds preference',
        description: 'Do you want to hear lions at night',
        example: 'yes',
      }),
    ],
    optional_inputs: [
      inp('destinations_considered', {
        label: 'Destination/Park',
        description: 'Gate access varies by park',
        example: '["Serengeti"]',
      }),
      customInput({
        key: 'request.constraints.night_drive_interest',
        label: 'Night drive interest',
        description: 'Outside-park properties may offer night drives',
        example: 'interested',
      }),
    ],
    assumptions: [
      'Inside-park lodges are often pricier',
      'Inside means no driving to gates, more time on game drives',
      'Outside may offer night drives (not allowed inside national parks)',
      'Outside camps may have private concession benefits',
      'Gate opening times limit outside-park lodge access',
      'Sound of wildlife at night requires inside-park or private concession',
    ],
    tradeoffs: [
      { gain: 'Inside: Maximum game time, no gate delays', loss: 'Often more expensive' },
      { gain: 'Outside: May have night drives', loss: 'Gate transit time' },
      { gain: 'Inside: Wildlife sounds at night', loss: 'No night drives in national parks' },
      { gain: 'Outside: Sometimes better value', loss: 'May miss early morning activity' },
    ],
    change_conditions: [
      'If maximizing game time is priority, inside is better',
      'If night drives are wanted, outside/private concession is needed',
      'If budget is constrained, outside may offer savings',
      'If first safari, being inside the action is usually preferred',
    ],
    refusal_triggers: [
      'Early access priority not specified',
      'Budget not indicated when cost difference exists',
    ],
  },
  {
    id: 'camp-hopping',
    question: 'Should I stay at multiple camps or just one?',
    required_inputs: [
      inp('trip_length', {
        description: 'Longer trips can accommodate more moves',
        example: '10',
      }),
      inp('variety_preference'),
      inp('pack_unpack_tolerance'),
    ],
    optional_inputs: [
      inp('destinations_considered', {
        label: 'Destination',
        description: 'Some parks are large enough to warrant moves',
        example: '["Serengeti"]',
      }),
      customInput({
        key: 'user_context.transit_tolerance',
        label: 'Transit tolerance',
        description: 'Comfort with flights or drives between camps',
        example: 'moderate',
      }),
    ],
    assumptions: [
      'Each camp move costs half a day in transit',
      'Different camps access different ecosystems and wildlife',
      'Frequent moves are tiring and reduce game time',
      'Large parks (Serengeti) benefit from multiple locations',
      'Small reserves (Mara) may not need moves',
      'Some travelers prefer to settle in and know the area',
    ],
    tradeoffs: [
      { gain: 'Multiple camps: Greater variety', loss: 'Transit time and fatigue' },
      { gain: 'Single camp: Deeper knowledge of area', loss: 'Less diversity' },
      { gain: 'Multiple camps: Follow migration', loss: 'Packing/unpacking hassle' },
      { gain: 'Single camp: Relationships with guides and staff', loss: 'May miss other ecosystems' },
    ],
    change_conditions: [
      'If trip is under 5 days, minimize moves',
      'If park is small, one camp may be sufficient',
      'If following migration, moves may be necessary',
      'If pack/unpack tolerance is low, stay put',
    ],
    refusal_triggers: [
      'Trip length not specified',
      'Variety preference not indicated',
    ],
  },

  // ============================================================
  // LOGISTICS (5 P0 topics)
  // ============================================================
  {
    id: 'trip-length',
    question: 'Is 5 days enough for safari?',
    required_inputs: [
      inp('time_available', {
        description: 'Total days for safari portion',
        example: '5',
      }),
      inp('destinations_considered', {
        label: 'Destination',
        description: 'Some destinations need more time',
        example: '["Tanzania"]',
      }),
      inp('expectation_scope'),
    ],
    optional_inputs: [
      inp('traveler_type', {
        label: 'Experience level',
        description: 'First-timers may want longer',
      }),
      customInput({
        key: 'request.constraints.park_count',
        label: 'Park count',
        description: 'How many parks you want to visit',
        example: '1',
      }),
    ],
    assumptions: [
      'Five days allows solid safari experience in one location',
      'Multi-park itineraries need 7+ days',
      'First-timers often wish they had longer',
      'Transit time eats into short trips',
      'Longer trips increase odds of rare sightings',
      'Quality beats quantity—5 good days beats 10 rushed days',
    ],
    tradeoffs: [
      { gain: '5 days: Achievable, focused experience', loss: 'Limited variety' },
      { gain: '5 days: Lower overall cost', loss: 'May miss rare species' },
      { gain: '5 days: Fits in limited vacation time', loss: 'No room for bad weather days' },
      { gain: '5 days: Concentrated intensity', loss: 'May feel rushed' },
    ],
    change_conditions: [
      'If wanting multiple parks, 5 days is too short',
      'If time can be extended, 7-10 days is significantly better',
      'If single park focus is acceptable, 5 days works',
      'If this is a taste before a longer trip, 5 days is fine',
    ],
    refusal_triggers: [
      'Days available not specified',
      'Expectation scope not indicated',
    ],
  },
  {
    id: 'ideal-length',
    question: 'What\'s the ideal safari length?',
    required_inputs: [
      inp('budget_band', {
        description: 'Budget determines viable length',
      }),
      customInput({
        key: 'request.constraints.destinations_count',
        label: 'Destinations count',
        description: 'How many countries or parks',
        example: '2',
      }),
      inp('fatigue_threshold'),
    ],
    optional_inputs: [
      customInput({
        key: 'request.constraints.specific_goals',
        label: 'Specific goals',
        description: 'Migration, gorillas, Big Five, etc.',
        example: 'migration_and_gorillas',
      }),
      customInput({
        key: 'user_context.beach_extension',
        label: 'Beach extension',
        description: 'Planning to add beach afterwards',
        example: 'yes',
      }),
    ],
    assumptions: [
      '7-10 days is the sweet spot for most travelers',
      'Under 5 days feels rushed',
      'Over 14 days risks safari fatigue',
      'Multi-destination trips need 10+ days',
      'Gorilla add-on requires 2-3 extra days',
      'Beach extension adds 3-5 days typically',
    ],
    tradeoffs: [
      { gain: '7-10 days: Optimal depth without fatigue', loss: 'Higher total cost' },
      { gain: 'Longer: More wildlife encounters', loss: 'Risk of safari fatigue' },
      { gain: 'Shorter: Fits vacation constraints', loss: 'May feel incomplete' },
      { gain: 'Split with beach: Variety', loss: 'Less safari time' },
    ],
    change_conditions: [
      'If budget is unlimited, 10-14 days allows rich experience',
      'If fatigue threshold is low, cap at 7 days of safari',
      'If wanting gorillas + safari, plan 10+ days total',
      'If first safari, err on the longer side if possible',
    ],
    refusal_triggers: [
      'No indication of constraints (budget, time, goals)',
      'Fatigue threshold not considered',
    ],
  },
  {
    id: 'fly-vs-drive',
    question: 'Should I fly or drive between parks?',
    required_inputs: [
      inp('time_available', {
        description: 'Flying saves significant time',
      }),
      inp('budget_band', {
        description: 'Flying costs more than driving',
      }),
      inp('journey_preference'),
    ],
    optional_inputs: [
      inp('destinations_considered', {
        label: 'Route',
        description: 'Some routes are more scenic than others',
        example: '["Arusha to Serengeti"]',
      }),
      customInput({
        key: 'request.constraints.luggage_weight',
        label: 'Luggage considerations',
        description: 'Bush flights have strict weight limits',
        example: 'can_pack_light',
      }),
    ],
    assumptions: [
      'Flying saves 4-8 hours per segment in Tanzania',
      'Flight costs $200-500 per person per segment',
      'Driving offers scenic value and roadside wildlife',
      'Bush plane weight limits are strict (15-20kg typically)',
      'Some routes are rough and tiring by road',
      'Flights may be delayed due to weather',
    ],
    tradeoffs: [
      { gain: 'Flying: More time on game drives', loss: 'Additional cost' },
      { gain: 'Driving: Scenic journey, roadside sightings', loss: 'Hours in vehicle' },
      { gain: 'Flying: Less fatigue', loss: 'Strict luggage weight limits' },
      { gain: 'Driving: Flexibility to stop', loss: 'Some roads are rough' },
    ],
    change_conditions: [
      'If time is short, flying is almost always worth it',
      'If budget is very constrained, driving saves money',
      'If journey is part of the experience, driving adds value',
      'If camps are close, driving makes more sense',
    ],
    refusal_triggers: [
      'Time available not specified',
      'Budget not indicated when cost is a factor',
    ],
  },
  {
    id: 'beach-extension',
    question: 'Should I add a beach extension?',
    required_inputs: [
      inp('beach_interest', {
        description: 'Actual desire for beach relaxation',
      }),
      inp('total_trip_length', {
        description: 'Beach requires additional days',
        example: '10',
      }),
      inp('budget_band', {
        description: 'Beach extends overall cost',
      }),
    ],
    optional_inputs: [
      inp('destinations_considered', {
        label: 'Safari destination',
        description: 'Determines logical beach options',
        example: '["Tanzania"]',
      }),
      customInput({
        key: 'user_context.energy_level',
        label: 'Energy level after safari',
        description: 'Some need recovery, others are energized',
        example: 'need_recovery',
      }),
    ],
    assumptions: [
      'Zanzibar is most common add-on from Tanzania',
      'Mombasa/Diani from Kenya',
      'Beach adds 3-5 days typically',
      'Additional flights and logistics required',
      'Some travelers find it anti-climactic after safari',
      'Others find it essential for recovery',
    ],
    tradeoffs: [
      { gain: 'Recovery and relaxation time', loss: 'Additional cost and days' },
      { gain: 'Complete trip with variety', loss: 'May feel anti-climactic after safari' },
      { gain: 'Beach activities (snorkeling, etc.)', loss: 'Less time for safari or home' },
      { gain: 'Couples/honeymooners often benefit', loss: 'Wildlife enthusiasts may prefer more safari' },
    ],
    change_conditions: [
      'If beach interest is low, skip it',
      'If energy level requires recovery, add it',
      'If honeymooning, beach is often expected',
      'If total trip length is constrained, prioritize safari',
    ],
    refusal_triggers: [
      'Beach interest not indicated',
      'Total trip length not specified',
    ],
  },
  {
    id: 'agent-vs-direct',
    question: 'Should I book through an agent or direct?',
    required_inputs: [
      inp('planning_comfort'),
      inp('budget_band', {
        description: 'Agents may access better rates or add fees',
      }),
      inp('trip_complexity'),
    ],
    optional_inputs: [
      customInput({
        key: 'user_context.support_expectation',
        label: 'Support expectation',
        description: 'Need for assistance during trip',
        example: 'high',
      }),
      customInput({
        key: 'request.constraints.time_for_planning',
        label: 'Planning time',
        description: 'Time available to research and book',
        example: 'limited',
      }),
    ],
    assumptions: [
      'Agents have access to lodge allocations and group rates',
      'Good agents add value through expertise and support',
      'Some agents charge fees; others earn commission',
      'Direct booking requires significant research',
      'Multi-camp itineraries are complex to coordinate',
      'On-trip support from agents can be valuable',
    ],
    tradeoffs: [
      { gain: 'Agent: Expertise and saved time', loss: 'Potential fees or markups' },
      { gain: 'Direct: Full control and transparency', loss: 'Time-intensive research' },
      { gain: 'Agent: On-trip support if issues arise', loss: 'Reliance on third party' },
      { gain: 'Direct: Direct relationship with camps', loss: 'No advocate if problems occur' },
    ],
    change_conditions: [
      'If trip is simple (one camp, short stay), direct works',
      'If complex multi-destination, agent value is high',
      'If wanting maximum support, use an agent',
      'If experienced and time-rich, direct is viable',
    ],
    refusal_triggers: [
      'Planning comfort not indicated',
      'Trip complexity not specified',
    ],
  },

  // ============================================================
  // RISK & ETHICS (1 P0 topic)
  // ============================================================
  {
    id: 'malaria-decision',
    question: 'Should I avoid malaria zones entirely?',
    required_inputs: [
      inp('malaria_tolerance', {
        label: 'Malaria tolerance',
        description: 'Willingness to take prophylaxis and accept risk',
      }),
      inp('health_considerations'),
      inp('traveling_with_children', {
        description: 'Children require different medication considerations',
      }),
    ],
    optional_inputs: [
      inp('destinations_considered', {
        label: 'Destinations considered',
        description: 'Malaria risk varies by destination',
        example: '["Tanzania", "South Africa"]',
      }),
      customInput({
        key: 'user_context.prior_malaria_experience',
        label: 'Prior experience',
        description: 'Previous use of prophylaxis',
        example: 'none',
      }),
    ],
    assumptions: [
      'East Africa (Tanzania, Kenya) is largely malarial',
      'South Africa has malaria-free options (Eastern Cape)',
      'Botswana is malarial in the north (Okavango)',
      'Prophylaxis is highly effective when taken correctly',
      'Some people experience side effects from medication',
      'Risk varies by season and specific location',
    ],
    tradeoffs: [
      { gain: 'Malaria zones: Best wildlife concentrations', loss: 'Medication and risk management' },
      { gain: 'Malaria-free: No prophylaxis needed', loss: 'Limited destination options' },
      { gain: 'Malaria zones: Full destination choice', loss: 'Ongoing medication required' },
      { gain: 'Malaria-free: Peace of mind', loss: 'Miss iconic destinations' },
    ],
    change_conditions: [
      'If malaria tolerance is zero, South Africa or specific areas only',
      'If pregnant or trying to conceive, medication options are limited',
      'If traveling with young children, consult doctor carefully',
      'If healthy and accepting risk, most destinations are viable',
    ],
    refusal_triggers: [
      'Malaria tolerance not specified',
      'Health considerations not disclosed when relevant',
    ],
  },

  // ============================================================
  // VALUE & COST (4 P0 topics)
  // ============================================================
  {
    id: 'total-budget',
    question: 'What should my total safari budget be?',
    required_inputs: [
      inp('trip_length', {
        description: 'Number of safari days',
      }),
      inp('comfort_expectations', {
        description: 'Budget, mid-range, or luxury',
        example: 'mid_range',
      }),
      inp('destinations_considered', {
        label: 'Destination',
        description: 'Costs vary significantly by country',
        example: '["Tanzania"]',
      }),
    ],
    optional_inputs: [
      inp('group_size', {
        description: 'Per-person costs decrease with groups',
      }),
      customInput({
        key: 'request.constraints.flights_included',
        label: 'Flights included',
        description: 'Whether to include international flights',
        example: 'false',
      }),
    ],
    assumptions: [
      'Budget safaris: $150-300 per person per day',
      'Mid-range safaris: $400-700 per person per day',
      'Luxury safaris: $800-1,500+ per person per day',
      'Ultra-luxury: $1,500-3,000+ per person per day',
      'Botswana is 2-3x East Africa prices',
      'Internal flights add $200-500 per segment',
    ],
    tradeoffs: [
      { gain: 'Higher budget: Better guides, locations, comfort', loss: 'Significant cost' },
      { gain: 'Lower budget: More accessible', loss: 'Compromises on service and location' },
      { gain: 'Mid-range: Good balance', loss: 'Neither cheapest nor best' },
      { gain: 'Luxury: Exceptional experience', loss: 'Fewer days possible for same money' },
    ],
    change_conditions: [
      'If Botswana is included, budget increases 2-3x',
      'If gorillas are included, add $2,000+ per person',
      'If internal flights needed, add $500-1,000 per person',
      'If traveling solo, add 30-50% for supplements',
    ],
    refusal_triggers: [
      'Trip length not specified',
      'Comfort expectations not indicated',
      'Destination not specified when costs vary 3x',
    ],
  },
  {
    id: 'budget-tanzania',
    question: 'Can I do Tanzania on a budget?',
    required_inputs: [
      inp('budget_band', {
        description: 'Confirmation of budget constraints',
        example: 'budget',
      }),
      inp('comfort_tolerance', {
        description: 'Acceptance of basic facilities',
      }),
      inp('shared_vehicle_ok', {
        description: 'Budget requires shared vehicles',
      }),
    ],
    optional_inputs: [
      customInput({
        key: 'request.constraints.northern_circuit_ok',
        label: 'Northern circuit focus',
        description: 'Budget options cluster in north',
        example: 'true',
      }),
      inp('group_size', {
        description: 'Groups can share vehicle costs',
      }),
    ],
    assumptions: [
      'Budget Tanzania runs $150-300 per person per day',
      'Shared vehicles with other travelers are standard',
      'Accommodation is basic lodges or camping',
      'Northern circuit (Serengeti, Ngorongoro) has most budget options',
      'Southern parks are harder to do cheaply',
      'Quality varies significantly—some operators are poor',
    ],
    tradeoffs: [
      { gain: 'Accessible safari entry point', loss: 'Basic accommodation' },
      { gain: 'See the same wildlife', loss: 'Less expert interpretation' },
      { gain: 'More days possible', loss: 'Shared vehicle compromises' },
      { gain: 'Budget-friendly', loss: 'Some operators cut corners' },
    ],
    change_conditions: [
      'If comfort tolerance is low, budget may disappoint',
      'If private vehicle is needed, budget cannot deliver',
      'If wanting southern parks, budget is very difficult',
      'If quality guide is essential, invest in mid-range',
    ],
    refusal_triggers: [
      'Budget constraint not confirmed',
      'Shared vehicle acceptability not indicated',
    ],
  },
  {
    id: 'peak-vs-value',
    question: 'Is peak season worth the premium?',
    required_inputs: [
      inp('budget_band', {
        description: 'Peak season adds 30-50% to costs',
      }),
      inp('wildlife_priority', {
        description: 'How important is optimal viewing',
      }),
      inp('flexibility', {
        description: 'Can you travel off-peak',
        example: 'moderate',
      }),
    ],
    optional_inputs: [
      customInput({
        key: 'request.constraints.specific_events',
        label: 'Specific events',
        description: 'Migration, calving, etc.',
        example: 'migration',
      }),
      inp('crowd_tolerance', {
        description: 'Peak also means more visitors',
      }),
    ],
    assumptions: [
      'Peak season (July-October) costs 30-50% more',
      'Wildlife viewing is typically easier in dry season',
      'Crowds are highest in peak season',
      'Shoulder seasons offer balance of value and conditions',
      'Green season has lowest prices but weather risk',
      'Migration can only be seen at specific times',
    ],
    tradeoffs: [
      { gain: 'Peak: Best viewing conditions', loss: 'Highest prices and crowds' },
      { gain: 'Off-peak: Significant savings', loss: 'Weather unpredictability' },
      { gain: 'Shoulder: Balance of value and conditions', loss: 'Neither best nor cheapest' },
      { gain: 'Peak: Specific events (migration)', loss: 'Must pay premium' },
    ],
    change_conditions: [
      'If migration is essential, peak is necessary',
      'If budget is constrained, off-peak saves significantly',
      'If first safari, peak offers best odds of satisfaction',
      'If repeat visitor, off-peak can be rewarding',
    ],
    refusal_triggers: [
      'Wildlife priority not indicated',
      'Budget not specified when peak costs 30-50% more',
    ],
  },
  {
    id: 'cheap-warning',
    question: 'When is cheap too cheap for safari?',
    required_inputs: [
      inp('budget_band', {
        description: 'What price point is being considered',
        example: 'very_low',
      }),
      inp('safety_priority', {
        description: 'Importance of reputable operators',
      }),
      inp('destinations_considered', {
        label: 'Destination',
        description: 'Minimum viable prices vary',
        example: '["Tanzania"]',
      }),
    ],
    optional_inputs: [
      customInput({
        key: 'user_context.research_done',
        label: 'Research done',
        description: 'Have you verified operator reputation',
        example: 'some',
      }),
      customInput({
        key: 'request.constraints.booking_source',
        label: 'Booking source',
        description: 'Where you found the deal',
        example: 'online_aggregator',
      }),
    ],
    assumptions: [
      'Below $100/day in Tanzania signals serious quality issues',
      'Cheap operators may use unqualified guides',
      'Vehicle maintenance may be neglected',
      'Park fees and proper licensing cost money',
      'Staff wages below fair level affect service',
      'Safety protocols may be compromised',
    ],
    tradeoffs: [
      { gain: 'Extremely low price', loss: 'Potential safety issues' },
      { gain: 'Affordable entry', loss: 'Unqualified guides, poor vehicles' },
      { gain: 'Saving money', loss: 'Supporting unethical operators' },
      { gain: 'Cheap on paper', loss: 'Hidden costs may emerge' },
    ],
    change_conditions: [
      'If price is well below market ($100/day in Tanzania), investigate deeply',
      'If operator has no verifiable reviews, avoid',
      'If terms require cash only, be cautious',
      'If safety or ethics are priorities, pay fair market rate',
    ],
    refusal_triggers: [
      'Budget tier not specified',
      'Safety priority not indicated when price is suspiciously low',
    ],
  },
  {
    id: 'splurge-allocation',
    question: 'Where should I splurge vs save?',
    required_inputs: [
      inp('budget_band', {
        description: 'Overall budget determines splurge capacity',
      }),
      inp('experience_priorities', {
        description: 'What matters most to you',
        example: 'wildlife_over_comfort',
      }),
      inp('trip_length', {
        description: 'Longer trips allow strategic allocation',
        example: '10',
      }),
    ],
    optional_inputs: [
      customInput({
        key: 'user_context.special_interests',
        label: 'Special interests',
        description: 'Photography, walking, gorillas, etc.',
        example: 'photography',
      }),
      customInput({
        key: 'request.constraints.specific_experiences',
        label: 'Must-do experiences',
        description: 'Experiences worth splurging on',
        example: 'balloon_safari',
      }),
    ],
    assumptions: [
      'Guide quality has highest impact on experience',
      'Location/concession access affects wildlife sightings',
      'Accommodation comfort matters less than wildlife',
      'One luxury night can elevate an otherwise mid-range trip',
      'Internal flights save time but add cost',
      'Food/wine matter less than wildlife to most travelers',
    ],
    tradeoffs: [
      { gain: 'Splurge on guide: Better interpretation', loss: 'Less on accommodation' },
      { gain: 'Splurge on location: Better sightings', loss: 'Basic rooms may suffice' },
      { gain: 'Save on meals: Standard is fine', loss: 'Miss premium culinary experience' },
      { gain: 'Splurge on one property: Memorable highlight', loss: 'Less everywhere else' },
    ],
    change_conditions: [
      'If wildlife is priority, invest in location and guide',
      'If comfort matters most, upgrade accommodation',
      'If photography is key, private vehicle is worth it',
      'If time is short, splurge on flights to maximize safari time',
    ],
    refusal_triggers: [
      'Experience priorities not indicated',
      'Budget tier not specified',
    ],
  },
];
