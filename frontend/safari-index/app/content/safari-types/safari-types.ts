/**
 * Safari Types - Safari Type Definitions
 *
 * 10 Safari Type definitions that categorize safaris by traveler intent.
 * These sit above itineraries as a discovery layer.
 *
 * Per governance:
 * - Documentary, operator-grade tone (no hype, no emojis)
 * - Explicit trade-offs for every type
 * - Links to itineraries, decisions, and activities
 */

import type {
  SafariType,
  SafariTypeSummary,
} from './types';

/**
 * All Safari Types
 */
export const safariTypes: SafariType[] = [
  // ============================================================
  // 1. FIRST-TIME CLASSIC
  // ============================================================
  {
    id: 'first-time-classic',
    name: 'First-Time Classic',
    positioning_line: 'The safari most people imagine when they dream of Africa',

    attributes: {
      pace: 'moderate',
      accommodation_style: 'Mid-range lodges with consistent amenities',
      activity_mix: 'Game drives morning and afternoon, optional walking',
      vehicle_rules: 'Shared vehicles common, private upgrades available',
      privacy_level: 'medium',
      physical_demand: 'low',
      predictability: 'high',
    },

    characteristics: [
      'Iconic parks with reliable wildlife concentrations',
      'Balanced schedule with rest time between activities',
      'Knowledgeable guides accustomed to first-time questions',
      'Proven camp locations with tested logistics',
      'Mix of Big Five opportunities across multiple ecosystems',
    ],

    tradeoffs: {
      gains: [
        'Reliable wildlife sightings in well-managed parks',
        'Predictable daily rhythm that is easy to prepare for',
        'Guides experienced with first-timer expectations',
        'Strong value at mid-range price points',
      ],
      losses: [
        'Popular parks mean other vehicles at major sightings',
        'Less flexibility in daily schedule',
        'May feel structured compared to specialist safaris',
      ],
    },

    best_for: [
      'First-time safari travelers',
      'Travelers wanting proven itinerary patterns',
      'Those seeking balanced value and experience',
      'Groups with mixed experience levels',
    ],

    not_ideal_for: [
      'Repeat visitors seeking new territory',
      'Travelers who dislike shared sightings',
      'Those with specific species targets',
    ],

    linked_style_tags: ['classic', 'first-timer'],
    linked_traveler_fits: ['first-safari', 'family', 'wildlife-focused'],
    primary_regions: ['east-africa', 'tanzania', 'kenya'],

    image_guidance: {
      landscape_context: 'Classic savanna with acacia trees, Serengeti or Mara horizon',
      activity_moment: 'Open-top vehicle with guests viewing relaxed lion pride',
      accommodation_mood: 'Comfortable lodge tent with canvas and wood details',
      human_presence: 'Couple or family with cameras, engaged but relaxed expressions',
    },

    commercial_notes: {
      why_converts: 'Lowest barrier to entry, matches pre-existing safari mental model',
      typical_objections: [
        'Will it feel too touristy?',
        'Is mid-range quality good enough?',
        'Can we see the migration?',
      ],
      operator_interventions: [
        'Show specific camp photos, not stock images',
        'Explain vehicle sharing norms clearly',
        'Set realistic migration timing expectations',
      ],
    },

    is_published: true,
    display_order: 1,
  },

  // ============================================================
  // 2. PHOTOGRAPHY-FOCUSED
  // ============================================================
  {
    id: 'photography-focused',
    name: 'Photography-Focused',
    positioning_line: 'Optimized for the shot, not just the sighting',

    attributes: {
      pace: 'variable',
      accommodation_style: 'Camps with charging stations and low-light flexibility',
      activity_mix: 'Extended drives, golden hour priority, hides and blinds',
      vehicle_rules: 'Private vehicle mandatory, modified for camera mounts',
      privacy_level: 'high',
      physical_demand: 'medium',
      predictability: 'medium',
    },

    characteristics: [
      'Vehicles positioned for optimal light, not just proximity',
      'Extended time at single sightings when conditions warrant',
      'Guides trained in photographic composition requirements',
      'Flexibility to skip lunch for exceptional light',
      'Access to hides and blinds at waterholes',
    ],

    tradeoffs: {
      gains: [
        'Vehicle positioning prioritizes light direction and background',
        'Extended time at productive sightings',
        'Guides understand exposure and composition needs',
        'Schedule flexibility around golden hours',
      ],
      losses: [
        'May spend hours at single location',
        'Non-photographers in group may feel pace drag',
        'Higher cost for private vehicle and specialist guide',
        'Unpredictable daily schedules',
      ],
    },

    best_for: [
      'Serious amateur and professional photographers',
      'Travelers prioritizing quality over quantity of sightings',
      'Those willing to sacrifice comfort for the shot',
      'Solo travelers or photography-aligned pairs',
    ],

    not_ideal_for: [
      'Mixed groups with non-photographer travelers',
      'Those who want to see as much as possible',
      'Travelers needing predictable schedules',
      'Budget-conscious travelers',
    ],

    linked_style_tags: ['photography', 'specialist'],
    linked_traveler_fits: ['photography', 'repeat-visitor'],
    primary_regions: ['east-africa', 'southern-africa', 'botswana', 'kenya'],

    image_guidance: {
      landscape_context: 'Dramatic light conditions, backlit dust or storm clouds',
      activity_moment: 'Photographer with long lens, vehicle positioned against light',
      accommodation_mood: 'Functional camp with charging station visible',
      human_presence: 'Single focused photographer, camera to eye',
    },

    commercial_notes: {
      why_converts: 'Clear differentiation from standard safari, addresses specific frustration',
      typical_objections: [
        'Will the guide actually understand photography?',
        'What if the light is bad?',
        'Is private vehicle worth the premium?',
      ],
      operator_interventions: [
        'Provide guide photography credentials or sample images',
        'Explain vehicle modification details',
        'Set expectations for slow days',
      ],
    },

    is_published: true,
    display_order: 2,
  },

  // ============================================================
  // 3. HONEYMOON-ROMANTIC
  // ============================================================
  {
    id: 'honeymoon-romantic',
    name: 'Honeymoon and Romantic',
    positioning_line: 'Safari as celebration, not just expedition',

    attributes: {
      pace: 'slow',
      accommodation_style: 'Intimate camps with private dining options',
      activity_mix: 'Private drives, spa, sundowners, bush dinners',
      vehicle_rules: 'Private vehicle standard, romantic activity integration',
      privacy_level: 'very-high',
      physical_demand: 'low',
      predictability: 'high',
    },

    characteristics: [
      'Accommodations selected for romance, not just location',
      'Private dining options including bush dinners',
      'Flexible wake-up times and activity scheduling',
      'Spa and wellness facilities at most properties',
      'Celebration touches woven throughout itinerary',
    ],

    tradeoffs: {
      gains: [
        'Consistently high privacy levels',
        'Properties designed for couples',
        'Flexible scheduling around preferences',
        'Celebration touches included',
      ],
      losses: [
        'Premium pricing for privacy',
        'May sacrifice wildlife density for property ambiance',
        'Less social interaction with other travelers',
        'Some activities require advance booking',
      ],
    },

    best_for: [
      'Honeymooners and anniversary travelers',
      'Couples seeking celebration atmosphere',
      'Those prioritizing accommodation quality',
      'Travelers wanting safari-plus-beach combinations',
    ],

    not_ideal_for: [
      'Solo travelers',
      'Those prioritizing wildlife over ambiance',
      'Budget-conscious travelers',
      'Active adventure seekers',
    ],

    linked_style_tags: ['luxury', 'romantic'],
    linked_traveler_fits: ['honeymoon'],
    primary_regions: ['southern-africa', 'botswana', 'tanzania', 'kenya'],

    image_guidance: {
      landscape_context: 'Sunset over water or savanna, warm golden tones',
      activity_moment: 'Couple at sundowner setup, champagne visible',
      accommodation_mood: 'Four-poster bed, open tent sides, romantic lighting',
      human_presence: 'Couple together, relaxed and connected',
    },

    commercial_notes: {
      why_converts: 'Clear emotional value proposition, celebration framing',
      typical_objections: [
        'Is safari romantic or is it camping?',
        'Will we actually see wildlife?',
        'Can we combine with beach?',
      ],
      operator_interventions: [
        'Lead with property visuals, not wildlife',
        'Explain luxury tent standards clearly',
        'Provide beach extension options upfront',
      ],
    },

    is_published: true,
    display_order: 3,
  },

  // ============================================================
  // 4. FAMILY SAFARI
  // ============================================================
  {
    id: 'family-safari',
    name: 'Family Safari',
    positioning_line: 'Shared discovery across generations',

    attributes: {
      pace: 'moderate',
      accommodation_style: 'Family rooms and interconnecting suites',
      activity_mix: 'Shorter drives, junior ranger programs, pool time',
      vehicle_rules: 'Private vehicle recommended for flexibility',
      privacy_level: 'medium',
      physical_demand: 'low',
      predictability: 'high',
    },

    characteristics: [
      'Age-appropriate activity options at each property',
      'Junior ranger and bush skills programs',
      'Flexible meal times and familiar food options',
      'Pool and downtime infrastructure',
      'Family room configurations with appropriate space',
    ],

    tradeoffs: {
      gains: [
        'Age-appropriate programming at most camps',
        'Flexible schedules accommodate children',
        'Family room configurations available',
        'Educational components woven throughout',
      ],
      losses: [
        'Some parks and camps have age restrictions',
        'Walking activities often unavailable for young children',
        'May miss early morning and late activities',
        'Private vehicle costs add up for larger families',
      ],
    },

    best_for: [
      'Families with children ages 6-16',
      'Multigenerational groups',
      'Parents wanting educational travel',
      'Families with prior travel experience',
    ],

    not_ideal_for: [
      'Families with very young children under 5',
      'Those seeking intense wildlife focus',
      'Budget-constrained families',
      'Those wanting adult-only atmosphere',
    ],

    linked_style_tags: ['family', 'classic'],
    linked_traveler_fits: ['family', 'multigenerational'],
    primary_regions: ['east-africa', 'southern-africa', 'south-africa', 'kenya', 'tanzania'],

    image_guidance: {
      landscape_context: 'Accessible savanna with clear sightlines',
      activity_moment: 'Children with binoculars, guide explaining tracks',
      accommodation_mood: 'Family tent with two beds, comfortable common area',
      human_presence: 'Mixed age group, children engaged and curious',
    },

    commercial_notes: {
      why_converts: 'Addresses specific family travel anxiety, clear solutions',
      typical_objections: [
        'Is it safe for children?',
        'Will kids get bored?',
        'What about malaria?',
        'Are there age restrictions?',
      ],
      operator_interventions: [
        'Specify exact age policies per camp',
        'Detail junior ranger program activities',
        'Provide malaria zone clarity',
        'Explain family room layouts precisely',
      ],
    },

    is_published: true,
    display_order: 4,
  },

  // ============================================================
  // 5. ADVENTURE-WALKING
  // ============================================================
  {
    id: 'adventure-walking',
    name: 'Adventure and Walking',
    positioning_line: 'Safari at ground level, not through a windshield',

    attributes: {
      pace: 'structured',
      accommodation_style: 'Mobile camps and rustic lodges',
      activity_mix: 'Walking safaris, canoe trips, fly-camping',
      vehicle_rules: 'Minimal vehicle use, walking primary',
      privacy_level: 'high',
      physical_demand: 'high',
      predictability: 'low',
    },

    characteristics: [
      'Multi-day walking itineraries with camp-to-camp routes',
      'Armed guides with advanced tracking certification',
      'Lightweight mobile camping infrastructure',
      'Focus on ecosystem understanding, not just megafauna',
      'Physical fitness requirements clearly communicated',
    ],

    tradeoffs: {
      gains: [
        'Intimate connection with environment',
        'Skills development in tracking and bush craft',
        'Access to areas vehicles cannot reach',
        'Small group sizes mandatory',
      ],
      losses: [
        'Less predictable wildlife sightings',
        'Physical demands exclude some travelers',
        'Accommodation comfort reduced',
        'Weather impacts experience significantly',
      ],
    },

    best_for: [
      'Physically fit travelers seeking immersion',
      'Repeat visitors wanting new perspective',
      'Those interested in tracking and ecology',
      'Travelers comfortable with basic accommodations',
    ],

    not_ideal_for: [
      'First-time safari travelers',
      'Those with mobility limitations',
      'Travelers requiring predictable comfort',
      'Those focused primarily on Big Five sightings',
    ],

    linked_style_tags: ['adventure', 'walking'],
    linked_traveler_fits: ['adventure', 'repeat-visitor'],
    primary_regions: ['zambia', 'zimbabwe', 'tanzania', 'botswana'],

    image_guidance: {
      landscape_context: 'Single-file walking group through tall grass',
      activity_moment: 'Guide pointing at tracks, guests kneeling to examine',
      accommodation_mood: 'Simple fly camp with bedroll under stars',
      human_presence: 'Small group with daypacks, active posture',
    },

    commercial_notes: {
      why_converts: 'Appeals to experienced travelers seeking differentiation',
      typical_objections: [
        'Is it dangerous?',
        'How fit do I need to be?',
        'Will I still see animals?',
        'What about bathroom facilities?',
      ],
      operator_interventions: [
        'Explain guide certification and safety protocols',
        'Provide specific fitness benchmarks',
        'Set realistic wildlife expectations',
        'Detail camp facilities honestly',
      ],
    },

    is_published: true,
    display_order: 5,
  },

  // ============================================================
  // 6. LUXURY-COMFORT
  // ============================================================
  {
    id: 'luxury-comfort',
    name: 'Luxury and Comfort',
    positioning_line: 'Five-star service in the wilderness',

    attributes: {
      pace: 'slow',
      accommodation_style: 'Premium lodges and exclusive camps',
      activity_mix: 'Private activities, spa, fine dining, helicopter options',
      vehicle_rules: 'Private vehicle with dedicated guide',
      privacy_level: 'very-high',
      physical_demand: 'low',
      predictability: 'high',
    },

    characteristics: [
      'Properties with international luxury standards',
      'Private guide and vehicle throughout',
      'Gourmet dining with wine pairings',
      'Spa and wellness facilities standard',
      'Flexible scheduling around preferences',
    ],

    tradeoffs: {
      gains: [
        'Consistent five-star service levels',
        'Maximum flexibility and personalization',
        'No shared activities or vehicles',
        'Premium locations with exclusive access',
      ],
      losses: [
        'Significant price premium',
        'May feel insulated from authentic bush experience',
        'Luxury infrastructure limits location options',
        'Less interaction with other travelers',
      ],
    },

    best_for: [
      'Travelers accustomed to luxury travel',
      'Those celebrating special occasions',
      'Travelers with limited time wanting maximum comfort',
      'Those who prioritize service and amenities',
    ],

    not_ideal_for: [
      'Budget-conscious travelers',
      'Those seeking authentic bush immersion',
      'Adventure-oriented travelers',
      'Those preferring social travel experiences',
    ],

    linked_style_tags: ['luxury', 'premium'],
    linked_traveler_fits: ['honeymoon', 'repeat-visitor'],
    primary_regions: ['southern-africa', 'botswana', 'south-africa', 'kenya', 'tanzania'],

    image_guidance: {
      landscape_context: 'Infinity pool overlooking waterhole at sunset',
      activity_moment: 'Private sundowner setup with butler service',
      accommodation_mood: 'Spacious suite with freestanding bath, design details',
      human_presence: 'Elegant couple, understated luxury styling',
    },

    commercial_notes: {
      why_converts: 'Clear value proposition for luxury travelers, reduces uncertainty',
      typical_objections: [
        'Is it worth the premium over mid-range?',
        'Will it feel pretentious in the bush?',
        'What specifically justifies the price?',
      ],
      operator_interventions: [
        'Detail specific service differentiators',
        'Explain guide quality and exclusivity',
        'Provide clear comparison to mid-range options',
      ],
    },

    is_published: true,
    display_order: 6,
  },

  // ============================================================
  // 7. BUDGET-AWARE
  // ============================================================
  {
    id: 'budget-aware',
    name: 'Budget-Aware',
    positioning_line: 'Wildlife priority, comfort secondary',

    attributes: {
      pace: 'structured',
      accommodation_style: 'Basic lodges, camping, and budget tented camps',
      activity_mix: 'Shared game drives, self-drive options',
      vehicle_rules: 'Shared vehicles standard, group sizes larger',
      privacy_level: 'low',
      physical_demand: 'medium',
      predictability: 'high',
    },

    characteristics: [
      'Focus on park access rather than accommodation quality',
      'Shared vehicle game drives with larger groups',
      'Basic but clean accommodation standards',
      'Self-drive options where feasible',
      'National park lodges and public campsites',
    ],

    tradeoffs: {
      gains: [
        'Significantly lower total cost',
        'Same wildlife in same parks',
        'More days possible within budget',
        'Authentic interaction with other travelers',
      ],
      losses: [
        'Shared vehicles and larger group sizes',
        'Less flexibility in activity timing',
        'Basic accommodation comfort levels',
        'Less personalized guiding attention',
      ],
    },

    best_for: [
      'Budget-conscious travelers',
      'Young travelers and backpackers',
      'Those prioritizing duration over comfort',
      'Travelers comfortable with basic standards',
    ],

    not_ideal_for: [
      'Those requiring consistent comfort',
      'Travelers seeking privacy',
      'Those with specific dietary requirements',
      'Travelers with physical limitations',
    ],

    linked_style_tags: ['budget', 'overland'],
    linked_traveler_fits: ['solo', 'first-safari'],
    primary_regions: ['south-africa', 'east-africa', 'namibia', 'kenya', 'tanzania'],

    image_guidance: {
      landscape_context: 'Classic park scenery, focus on wildlife not camp',
      activity_moment: 'Group in open safari vehicle, genuine excitement',
      accommodation_mood: 'Simple tent or basic room, clean and functional',
      human_presence: 'Mixed group of travelers, social atmosphere',
    },

    commercial_notes: {
      why_converts: 'Removes price barrier, demonstrates value clearly',
      typical_objections: [
        'Will I actually see wildlife?',
        'How basic is basic?',
        'Is it safe?',
        'Will group size ruin the experience?',
      ],
      operator_interventions: [
        'Emphasize wildlife access parity',
        'Show specific accommodation photos',
        'Explain typical group compositions',
        'Detail what is and is not included',
      ],
    },

    is_published: true,
    display_order: 7,
  },

  // ============================================================
  // 8. SPECIALIST-WILDLIFE
  // ============================================================
  {
    id: 'specialist-wildlife',
    name: 'Specialist Wildlife',
    positioning_line: 'Single species, singular focus',

    attributes: {
      pace: 'variable',
      accommodation_style: 'Varies based on species requirements',
      activity_mix: 'Species-specific tracking, research participation',
      vehicle_rules: 'Specialist guides mandatory, small groups',
      privacy_level: 'high',
      physical_demand: 'medium',
      predictability: 'low',
    },

    characteristics: [
      'Itinerary built around specific species behavior',
      'Guides with deep species-specific expertise',
      'Timing aligned with species activity patterns',
      'Conservation research integration opportunities',
      'Willingness to wait extended periods for target species',
    ],

    tradeoffs: {
      gains: [
        'Deep expertise on target species',
        'Optimal timing for species behavior',
        'Smaller groups with aligned interests',
        'Conservation connection opportunities',
      ],
      losses: [
        'May miss broader safari experience',
        'Success not guaranteed for rare species',
        'Location constraints based on species range',
        'Higher cost for specialist guides',
      ],
    },

    best_for: [
      'Wildlife enthusiasts with specific interests',
      'Repeat visitors with targeted goals',
      'Conservation-minded travelers',
      'Those comfortable with uncertain outcomes',
    ],

    not_ideal_for: [
      'First-time safari travelers',
      'Those wanting broad wildlife coverage',
      'Travelers requiring predictable outcomes',
      'Those with limited time',
    ],

    linked_style_tags: ['specialist', 'wildlife'],
    linked_traveler_fits: ['wildlife-focused', 'repeat-visitor'],
    primary_regions: ['uganda-rwanda', 'botswana', 'zambia', 'zimbabwe'],

    image_guidance: {
      landscape_context: 'Habitat specific to target species',
      activity_moment: 'Small group observing species behavior quietly',
      accommodation_mood: 'Functional base camp near species territory',
      human_presence: 'Focused observers, professional equipment',
    },

    commercial_notes: {
      why_converts: 'Speaks directly to specific passion, demonstrates expertise',
      typical_objections: [
        'What if we do not see the target species?',
        'Is it worth going just for one animal?',
        'How early do we need to wake up?',
      ],
      operator_interventions: [
        'Provide realistic sighting probability',
        'Explain value of full experience beyond single sighting',
        'Detail physical and schedule requirements',
      ],
    },

    is_published: true,
    display_order: 8,
  },

  // ============================================================
  // 9. MULTI-COUNTRY-CIRCUIT
  // ============================================================
  {
    id: 'multi-country-circuit',
    name: 'Multi-Country Circuit',
    positioning_line: 'Regional breadth in a single journey',

    attributes: {
      pace: 'structured',
      accommodation_style: 'Varies by country and segment',
      activity_mix: 'Mixed activities across different ecosystems',
      vehicle_rules: 'Varies by segment, flights between countries',
      privacy_level: 'medium',
      physical_demand: 'medium',
      predictability: 'medium',
    },

    characteristics: [
      'Multiple countries visited in single itinerary',
      'Contrast between different ecosystems and wildlife',
      'Flight connections between safari segments',
      'Variety of accommodation styles across journey',
      'Exposure to different guiding cultures and approaches',
    ],

    tradeoffs: {
      gains: [
        'Maximum ecosystem diversity',
        'Compare different safari styles and cultures',
        'Efficient use of long-haul travel investment',
        'Broader regional understanding',
      ],
      losses: [
        'More transit time and logistics',
        'Less depth in any single location',
        'Variable accommodation quality across countries',
        'Complexity in planning and coordination',
      ],
    },

    best_for: [
      'Travelers on once-in-a-lifetime trips',
      'Those wanting maximum variety',
      'Travelers comfortable with logistics',
      'Those with sufficient time for extended itinerary',
    ],

    not_ideal_for: [
      'Travelers who prefer depth over breadth',
      'Those with limited time',
      'Budget-conscious travelers',
      'Those who dislike frequent transitions',
    ],

    linked_style_tags: ['multi-country', 'circuit'],
    linked_traveler_fits: ['first-safari', 'repeat-visitor'],
    primary_regions: ['east-africa', 'southern-africa'],

    image_guidance: {
      landscape_context: 'Split image showing contrasting ecosystems',
      activity_moment: 'Light aircraft on bush airstrip',
      accommodation_mood: 'Varied styles representing different segments',
      human_presence: 'Travelers at border or airport transition',
    },

    commercial_notes: {
      why_converts: 'Appeals to maximize value of long journey, bucket list framing',
      typical_objections: [
        'Is it too rushed?',
        'How difficult are the border crossings?',
        'Is the extra cost worth the variety?',
      ],
      operator_interventions: [
        'Provide detailed daily itinerary with transit times',
        'Explain visa and logistics clearly',
        'Compare cost-per-experience versus single-country',
      ],
    },

    is_published: true,
    display_order: 9,
  },

  // ============================================================
  // 10. CONSERVATION-FOCUSED
  // ============================================================
  {
    id: 'conservation-focused',
    name: 'Conservation-Focused',
    positioning_line: 'Travel as contribution, not just consumption',

    attributes: {
      pace: 'variable',
      accommodation_style: 'Conservation camps and research stations',
      activity_mix: 'Research participation, community visits, standard safari',
      vehicle_rules: 'Mix of research and safari vehicles',
      privacy_level: 'medium',
      physical_demand: 'medium',
      predictability: 'medium',
    },

    characteristics: [
      'Direct engagement with conservation projects',
      'Behind-the-scenes access to research operations',
      'Community development program visits',
      'Clear impact transparency and reporting',
      'Balance of meaningful work and wildlife viewing',
    ],

    tradeoffs: {
      gains: [
        'Direct contribution to conservation outcomes',
        'Access to research and projects normally closed',
        'Deep understanding of conservation challenges',
        'Meaningful connection beyond tourism',
      ],
      losses: [
        'May include less glamorous activities',
        'Schedule built around project needs, not preferences',
        'Some activities may feel like work',
        'Accommodation may prioritize function over comfort',
      ],
    },

    best_for: [
      'Conservation-minded travelers',
      'Those seeking purpose beyond sightseeing',
      'Repeat visitors wanting deeper engagement',
      'Families wanting educational impact',
    ],

    not_ideal_for: [
      'Those seeking pure relaxation',
      'Travelers uncomfortable with conservation realities',
      'Those with limited time',
      'Budget-focused travelers',
    ],

    linked_style_tags: ['conservation', 'research'],
    linked_traveler_fits: ['wildlife-focused', 'repeat-visitor', 'family'],
    primary_regions: ['southern-africa', 'east-africa', 'south-africa', 'botswana', 'kenya'],

    image_guidance: {
      landscape_context: 'Research station or conservation project setting',
      activity_moment: 'Guests participating in collaring or monitoring',
      accommodation_mood: 'Functional research camp with conservation branding',
      human_presence: 'Mix of researchers and travelers working together',
    },

    commercial_notes: {
      why_converts: 'Appeals to values-driven travelers, differentiation from standard safari',
      typical_objections: [
        'Will it feel like volunteering or vacation?',
        'How do I know the impact is real?',
        'Is it appropriate for children?',
      ],
      operator_interventions: [
        'Explain balance of activities clearly',
        'Provide specific impact metrics and reports',
        'Detail family-friendly program elements',
      ],
    },

    is_published: true,
    display_order: 10,
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get all published safari types
 */
export function getPublishedSafariTypes(): SafariType[] {
  return safariTypes
    .filter((st) => st.is_published)
    .sort((a, b) => a.display_order - b.display_order);
}

/**
 * Get safari type by ID
 */
export function getSafariTypeById(id: string): SafariType | undefined {
  return safariTypes.find((st) => st.id === id);
}

/**
 * Get safari type summary for hub listings
 */
export function getSafariTypeSummary(safariType: SafariType): SafariTypeSummary {
  return {
    id: safariType.id,
    name: safariType.name,
    positioning_line: safariType.positioning_line,
    attributes: {
      pace: safariType.attributes.pace,
      physical_demand: safariType.attributes.physical_demand,
      privacy_level: safariType.attributes.privacy_level,
    },
    best_for: safariType.best_for,
    display_order: safariType.display_order,
  };
}

/**
 * Get all published safari type summaries
 */
export function getAllSafariTypeSummaries(): SafariTypeSummary[] {
  return getPublishedSafariTypes().map(getSafariTypeSummary);
}

/**
 * Get safari types by traveler fit
 */
export function getSafariTypesByTravelerFit(fit: string): SafariType[] {
  return getPublishedSafariTypes().filter((st) =>
    st.linked_traveler_fits.includes(fit as SafariType['linked_traveler_fits'][number])
  );
}

/**
 * Get safari types by region
 */
export function getSafariTypesByRegion(region: string): SafariType[] {
  return getPublishedSafariTypes().filter((st) =>
    st.primary_regions.includes(region as SafariType['primary_regions'][number])
  );
}

/**
 * Get safari types by style tag
 */
export function getSafariTypesByStyleTag(styleTag: string): SafariType[] {
  return getPublishedSafariTypes().filter((st) =>
    st.linked_style_tags.includes(styleTag)
  );
}

/**
 * Format pace for display
 */
export function formatPace(pace: SafariType['attributes']['pace']): string {
  const paceLabels: Record<SafariType['attributes']['pace'], string> = {
    slow: 'Slow pace',
    moderate: 'Moderate pace',
    structured: 'Structured',
    variable: 'Variable',
  };
  return paceLabels[pace];
}

/**
 * Format physical demand for display
 */
export function formatPhysicalDemand(
  demand: SafariType['attributes']['physical_demand']
): string {
  const demandLabels: Record<SafariType['attributes']['physical_demand'], string> = {
    low: 'Low physical demand',
    medium: 'Moderate physical demand',
    high: 'High physical demand',
  };
  return demandLabels[demand];
}

/**
 * Format privacy level for display
 */
export function formatPrivacyLevel(
  level: SafariType['attributes']['privacy_level']
): string {
  const privacyLabels: Record<SafariType['attributes']['privacy_level'], string> = {
    low: 'Shared experiences',
    medium: 'Moderate privacy',
    high: 'High privacy',
    'very-high': 'Maximum privacy',
  };
  return privacyLabels[level];
}
