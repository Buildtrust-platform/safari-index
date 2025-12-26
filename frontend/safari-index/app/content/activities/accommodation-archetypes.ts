/**
 * Safari Accommodation Archetypes
 *
 * Canonical definitions of accommodation TYPES used across all destinations.
 * These are categories, NOT individual lodge listings.
 *
 * Per governance:
 * - No lodge names, prices, or availability
 * - Documentary, factual tone
 * - Focus on what travelers should expect from each type
 * - Honest about trade-offs and limitations
 */

export type PriceRange = 'budget' | 'mid-range' | 'premium' | 'ultra-premium';

export type AccommodationStyle =
  | 'permanent-camp'
  | 'mobile-camp'
  | 'lodge'
  | 'villa'
  | 'treehouse'
  | 'houseboat';

export interface AccommodationArchetype {
  id: string;
  name: string;
  style: AccommodationStyle;
  what_it_is: string;
  typical_capacity: string;
  price_range: PriceRange;
  where_common: string[];
  who_it_is_for: string;
  who_should_avoid: string;
  included_typically: string[];
  not_included_typically: string[];
  trade_offs: {
    gains: string;
    losses: string;
  };
  /** Stock photo reference for visual inspiration */
  image_hint: string;
}

export const accommodationArchetypes: AccommodationArchetype[] = [
  {
    id: 'classic-safari-lodge',
    name: 'Classic Safari Lodge',
    style: 'lodge',
    what_it_is:
      'Permanent structure with individual rooms or suites, typically stone or thatch construction. Common areas include dining room, lounge, pool. Full service with staff.',
    typical_capacity: '20-40 guests',
    price_range: 'premium',
    where_common: [
      'south-africa',
      'kenya',
      'tanzania',
      'botswana',
      'zimbabwe',
      'zambia',
    ],
    who_it_is_for:
      'First-time safari visitors; those wanting reliable comfort; families; couples',
    who_should_avoid:
      'Those seeking intimate wilderness immersion; budget-conscious travelers',
    included_typically: [
      'All meals',
      'House wines and spirits',
      'Two game activities daily',
      'Laundry service',
      'WiFi in common areas',
    ],
    not_included_typically: [
      'Premium drinks',
      'Spa treatments',
      'Special activities (balloon, walking)',
      'Gratuities',
      'Park fees (sometimes)',
    ],
    trade_offs: {
      gains:
        'Consistent comfort, reliable service, good for first-timers, often accessible',
      losses:
        'Less intimate than camps, more guests, can feel less wild, higher environmental footprint',
    },
    image_hint:
      'Stone and thatch safari lodge with swimming pool overlooking African savanna at sunset',
  },
  {
    id: 'tented-camp',
    name: 'Permanent Tented Camp',
    style: 'permanent-camp',
    what_it_is:
      'Canvas tents on raised platforms or concrete bases, with en-suite bathrooms, proper beds, and often verandas. Combines outdoor immersion with comfort.',
    typical_capacity: '10-20 guests',
    price_range: 'premium',
    where_common: [
      'botswana',
      'tanzania-serengeti',
      'kenya-mara',
      'zambia',
      'zimbabwe',
    ],
    who_it_is_for:
      'Those wanting bush atmosphere with comfort; second-time safari visitors; photographers',
    who_should_avoid:
      'Those uncomfortable with canvas walls; those requiring climate control in all conditions',
    included_typically: [
      'All meals',
      'Selected drinks',
      'Two game activities daily',
      'Laundry',
    ],
    not_included_typically: [
      'Premium champagnes',
      'Scenic flights',
      'Walking safaris (sometimes extra)',
      'Gratuities',
    ],
    trade_offs: {
      gains:
        'Authentic bush feel, smaller groups, closer to wildlife sounds, lower environmental impact',
      losses:
        'Canvas offers less insulation, can be hot/cold seasonally, less soundproofing',
    },
    image_hint:
      'Luxury canvas tent on wooden platform with private deck overlooking river at dawn',
  },
  {
    id: 'mobile-camp',
    name: 'Mobile Tented Camp',
    style: 'mobile-camp',
    what_it_is:
      'Lightweight camp that moves seasonally to follow wildlife. Canvas tents with camp beds, bucket showers, and bush toilets. Staff-to-guest ratio often 1:1.',
    typical_capacity: '6-12 guests',
    price_range: 'premium',
    where_common: [
      'tanzania-serengeti',
      'botswana-makgadikgadi',
      'kenya-mara',
      'zambia',
    ],
    who_it_is_for:
      'Adventure-oriented travelers; those following migration; experienced safari-goers',
    who_should_avoid:
      'Those requiring consistent amenities; mobility-limited travelers; first-time safari visitors',
    included_typically: [
      'All meals',
      'Drinks',
      'Game activities',
      'Camp moves with you',
      'Exclusive locations',
    ],
    not_included_typically: ['WiFi', 'Charging (limited solar)', 'Laundry (limited)'],
    trade_offs: {
      gains:
        'Follows the action, exclusive locations, authentic experience, small groups, high staff ratio',
      losses:
        'Basic amenities, no electricity in tents, bucket showers, requires flexibility',
    },
    image_hint:
      'Small tented camp setup in remote bush with safari vehicle and wildebeest migration in background',
  },
  {
    id: 'fly-camp',
    name: 'Fly Camp / Sleep-out',
    style: 'mobile-camp',
    what_it_is:
      'Single-night experience sleeping under stars or minimal canvas, away from main camp. Bedroll, mosquito net, armed guard. Maximum wilderness immersion.',
    typical_capacity: '2-6 guests',
    price_range: 'premium',
    where_common: [
      'tanzania-ruaha',
      'tanzania-selous',
      'botswana',
      'zambia',
      'kenya-conservancies',
    ],
    who_it_is_for:
      'Adventurous travelers; repeat safari visitors; those seeking transformative experiences',
    who_should_avoid:
      'Light sleepers; those uncomfortable outdoors; travelers requiring bathroom facilities',
    included_typically: [
      'Dinner and breakfast',
      'Drinks',
      'Armed escort',
      'Bedding',
      'Unique location',
    ],
    not_included_typically: ['Bathroom facilities', 'Shelter (often)', 'Power'],
    trade_offs: {
      gains:
        'Unfiltered wilderness, night sounds, stars overhead, profound connection to land',
      losses:
        'Minimal comfort, exposure to elements, limited sleep for some, basic toilet arrangements',
    },
    image_hint:
      'Bedroll under mosquito net with African night sky full of stars and distant campfire glow',
  },
  {
    id: 'exclusive-villa',
    name: 'Exclusive Use Villa / House',
    style: 'villa',
    what_it_is:
      'Private residence with dedicated staff, vehicle, and guide. Full kitchen, multiple bedrooms, private pool. Ideal for families or groups traveling together.',
    typical_capacity: '6-14 guests',
    price_range: 'ultra-premium',
    where_common: [
      'south-africa',
      'kenya-laikipia',
      'tanzania',
      'botswana',
    ],
    who_it_is_for:
      'Multi-generational families; groups of friends; those valuing privacy; celebration trips',
    who_should_avoid:
      'Solo travelers; those seeking social safari atmosphere; budget-conscious',
    included_typically: [
      'All meals (often flexible timing)',
      'Premium drinks',
      'Private vehicle and guide',
      'All activities',
      'Dedicated staff',
    ],
    not_included_typically: ['Spa treatments', 'Scenic flights', 'Conservation fees'],
    trade_offs: {
      gains:
        'Complete privacy, flexible schedule, personalized service, ideal for families',
      losses:
        'Significant cost, can feel isolated, miss meeting other travelers, requires larger group to justify',
    },
    image_hint:
      'Private safari villa with infinity pool overlooking wilderness and elephants at waterhole',
  },
  {
    id: 'treehouse',
    name: 'Treehouse / Star Bed',
    style: 'treehouse',
    what_it_is:
      'Elevated sleeping platform, either in actual tree or raised structure. Often used as special one-night experience. Combines sleep-out adventure with some structure.',
    typical_capacity: '2-4 guests',
    price_range: 'premium',
    where_common: [
      'kenya-laikipia',
      'botswana',
      'south-africa',
      'tanzania',
    ],
    who_it_is_for:
      'Couples seeking romance; adventurous families with older kids; those marking occasions',
    who_should_avoid:
      'Those with fear of heights; light sleepers; those requiring full bathroom facilities',
    included_typically: [
      'Dinner delivery',
      'Breakfast',
      'Drinks',
      'Radio contact with main camp',
    ],
    not_included_typically: ['Full bathroom (bucket shower)', 'Power', 'Climate control'],
    trade_offs: {
      gains:
        'Memorable experience, wildlife at eye level, night sounds, romantic setting',
      losses:
        'Limited comfort, exposed to weather, basic facilities, accessibility challenges',
    },
    image_hint:
      'Elevated star bed platform with white linens and mosquito net under acacia tree at twilight',
  },
  {
    id: 'houseboat',
    name: 'Houseboat Safari',
    style: 'houseboat',
    what_it_is:
      'Multi-bedroom vessel operating on rivers or lakes, combining accommodation with water-based safari. Often tenders for fishing and game viewing.',
    typical_capacity: '4-12 guests',
    price_range: 'mid-range',
    where_common: [
      'botswana-chobe',
      'zimbabwe-kariba',
      'zambia-kafue',
    ],
    who_it_is_for:
      'Those wanting water perspective; anglers; families; photographers seeking different angles',
    who_should_avoid:
      'Those prone to seasickness; travelers wanting walking safaris; those uncomfortable on water',
    included_typically: [
      'All meals',
      'Drinks',
      'Tender boat activities',
      'Fishing equipment',
      'Onboard guide',
    ],
    not_included_typically: ['Premium drinks', 'Game drives (separate)', 'Gratuities'],
    trade_offs: {
      gains:
        'Unique water perspective, access to river wildlife, good for birding, relaxed pace',
      losses:
        'Limited to waterways, cannot access terrestrial reserves, confined space, weather dependent',
    },
    image_hint:
      'Safari houseboat on Chobe River with elephants drinking at waters edge and sunset reflections',
  },
  {
    id: 'budget-camp',
    name: 'Budget Tented Camp',
    style: 'permanent-camp',
    what_it_is:
      'Basic tented accommodation, often outside park boundaries. Shared facilities common. Functional rather than luxurious. Good for budget-conscious wildlife access.',
    typical_capacity: '20-40 guests',
    price_range: 'budget',
    where_common: [
      'tanzania',
      'kenya',
      'south-africa',
    ],
    who_it_is_for:
      'Budget travelers; younger adventurers; those prioritizing wildlife over accommodation',
    who_should_avoid:
      'Those expecting full service; travelers wanting privacy; comfort-priority guests',
    included_typically: [
      'Breakfast',
      'Dinner',
      'Hot water (limited hours)',
    ],
    not_included_typically: [
      'Drinks',
      'Activities',
      'Laundry',
      'WiFi',
      'En-suite bathroom (often)',
    ],
    trade_offs: {
      gains: 'Affordable wildlife access, social atmosphere, good for backpackers',
      losses:
        'Basic facilities, shared bathrooms common, outside parks requiring longer drives, larger groups',
    },
    image_hint:
      'Simple dome tents in campground with communal area and safari vehicles parked nearby',
  },
];

/**
 * Get archetype by ID
 */
export function getArchetypeById(id: string): AccommodationArchetype | undefined {
  return accommodationArchetypes.find((a) => a.id === id);
}

/**
 * Get archetypes by price range
 */
export function getArchetypesByPriceRange(
  range: PriceRange
): AccommodationArchetype[] {
  return accommodationArchetypes.filter((a) => a.price_range === range);
}

/**
 * Get archetypes available in a specific region
 */
export function getArchetypesForRegion(region: string): AccommodationArchetype[] {
  const regionLower = region.toLowerCase();
  return accommodationArchetypes.filter((a) =>
    a.where_common.some(
      (w) =>
        w.toLowerCase().includes(regionLower) ||
        regionLower.includes(w.toLowerCase())
    )
  );
}

/**
 * Get all archetype IDs
 */
export function getAllArchetypeIds(): string[] {
  return accommodationArchetypes.map((a) => a.id);
}
