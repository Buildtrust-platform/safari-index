/**
 * Trip Shapes - Safari Itinerary Archetypes
 *
 * Deterministic safari trip templates that represent common itinerary patterns.
 * These are NOT bookable products - they are planning reference shapes that
 * connect users to relevant decisions and guides.
 *
 * Per governance:
 * - Documentary, calm, safari-native tone
 * - No hype words, emojis, or exclamation marks
 * - Links to existing decision and guide content
 * - No runtime AI calls - purely static data
 */

export type RegionTag =
  | 'east-africa'
  | 'southern-africa'
  | 'uganda-rwanda'
  | 'tanzania'
  | 'kenya'
  | 'botswana'
  | 'south-africa'
  | 'namibia'
  | 'zambia'
  | 'zimbabwe';

export type ComfortTier = 'budget' | 'mid' | 'luxury';

export type TravelerFit =
  | 'first-safari'
  | 'family'
  | 'honeymoon'
  | 'photography'
  | 'adventure'
  | 'solo'
  | 'multigenerational'
  | 'repeat-visitor'
  | 'wildlife-focused'
  | 'cultural';

/**
 * Cost band for trip pricing context
 * Per-person USD ranges based on 2024 operator rates
 */
export interface CostBand {
  low: number;      // Per person, USD
  high: number;     // Per person, USD
  note: string;     // Exclusions or clarifications
}

export interface TripArchetype {
  id: string;
  title: string;
  subtitle: string;
  regions: RegionTag[];
  duration_days: number | [number, number]; // Single value or range
  comfort_tier: ComfortTier;
  cost_band: CostBand; // Typical per-person cost range
  best_months: number[]; // 1-12
  core_parks_or_areas: string[];
  traveler_fit: TravelerFit[];
  what_this_trip_is_for: string;
  what_you_trade_off: [string, string, string];
  linked_decisions: string[]; // topic_ids from topic-inventory
  linked_guides: string[]; // guide topic slugs
  assurance_relevance: boolean;
}

/**
 * 20 Launch Trip Archetypes
 *
 * Organized by primary region, covering the most common safari itinerary shapes.
 */
export const tripArchetypes: TripArchetype[] = [
  // ============================================================
  // EAST AFRICA - TANZANIA
  // ============================================================
  {
    id: 'classic-serengeti-ngorongoro',
    title: 'Classic Serengeti and Ngorongoro',
    subtitle: 'The quintessential East African safari circuit',
    regions: ['east-africa', 'tanzania'],
    duration_days: [7, 10],
    comfort_tier: 'mid',
    cost_band: { low: 6000, high: 10000, note: 'Excluding international flights' },
    best_months: [6, 7, 8, 9, 10, 1, 2],
    core_parks_or_areas: ['Serengeti National Park', 'Ngorongoro Crater', 'Lake Manyara'],
    traveler_fit: ['first-safari', 'family', 'wildlife-focused'],
    what_this_trip_is_for:
      'First-time safari travelers seeking the iconic East African experience with reliable wildlife viewing and diverse landscapes.',
    what_you_trade_off: [
      'Higher visitor density at popular viewpoints, especially Ngorongoro Crater rim',
      'Less flexibility in itinerary structure due to park logistics',
      'Premium pricing during peak migration months',
    ],
    linked_decisions: [
      'first-timer-ready',
      'tz-dry-season',
      'serengeti-vs-mara',
      'ngorongoro-worth',
      'lodge-vs-tented',
      'ideal-length',
    ],
    linked_guides: ['tanzania-dry-season-only', 'serengeti-vs-masai-mara'],
    assurance_relevance: true,
  },
  {
    id: 'migration-focused-serengeti',
    title: 'Migration-Focused Serengeti',
    subtitle: 'Following the wildebeest across the plains',
    regions: ['east-africa', 'tanzania'],
    duration_days: [8, 12],
    comfort_tier: 'luxury',
    cost_band: { low: 12000, high: 20000, note: 'Excluding international flights' },
    best_months: [1, 2, 6, 7, 8, 9],
    core_parks_or_areas: ['Serengeti National Park', 'Southern Serengeti', 'Northern Serengeti'],
    traveler_fit: ['wildlife-focused', 'photography', 'repeat-visitor'],
    what_this_trip_is_for:
      'Travelers specifically seeking migration spectacle, willing to position themselves strategically across Serengeti regions based on animal movement.',
    what_you_trade_off: [
      'Requires flexibility in exact camp locations based on migration position',
      'May involve internal flights or long drives between regions',
      'Higher cost due to mobile camp logistics and remote positioning',
    ],
    linked_decisions: [
      'migration-timing',
      'river-crossings',
      'calving-season',
      'booking-lead-time',
      'luxury-worth',
    ],
    linked_guides: ['migration-timing', 'river-crossings'],
    assurance_relevance: true,
  },
  {
    id: 'tanzania-southern-circuit',
    title: 'Tanzania Southern Circuit',
    subtitle: 'Remote wilderness away from the crowds',
    regions: ['east-africa', 'tanzania'],
    duration_days: [9, 14],
    comfort_tier: 'luxury',
    cost_band: { low: 10000, high: 18000, note: 'Excluding international flights, includes charter flights' },
    best_months: [6, 7, 8, 9, 10],
    core_parks_or_areas: ['Ruaha National Park', 'Selous/Nyerere', 'Katavi National Park'],
    traveler_fit: ['repeat-visitor', 'adventure', 'photography'],
    what_this_trip_is_for:
      'Experienced safari travelers seeking genuine remoteness, lower visitor density, and walking safari opportunities.',
    what_you_trade_off: [
      'Limited infrastructure means fewer accommodation options',
      'Longer transfer times and typically requires charter flights',
      'Less predictable wildlife concentrations than northern circuit',
    ],
    linked_decisions: ['walking-safari', 'off-beaten-path', 'fly-vs-drive', 'ideal-length'],
    linked_guides: ['walking-safari'],
    assurance_relevance: true,
  },

  // ============================================================
  // EAST AFRICA - KENYA
  // ============================================================
  {
    id: 'classic-kenya-safari',
    title: 'Classic Kenya Safari',
    subtitle: 'Masai Mara and the Rift Valley lakes',
    regions: ['east-africa', 'kenya'],
    duration_days: [7, 10],
    comfort_tier: 'mid',
    cost_band: { low: 5000, high: 9000, note: 'Excluding international flights' },
    best_months: [7, 8, 9, 10, 1, 2],
    core_parks_or_areas: ['Masai Mara', 'Lake Nakuru', 'Amboseli', 'Samburu'],
    traveler_fit: ['first-safari', 'family', 'wildlife-focused'],
    what_this_trip_is_for:
      'First-time visitors wanting varied Kenyan landscapes from savannah to flamingo-covered lakes with good road accessibility.',
    what_you_trade_off: [
      'Multiple parks means more driving time between destinations',
      'Masai Mara can feel crowded during peak crossing months',
      'Less exclusive than conservancy-only itineraries',
    ],
    linked_decisions: [
      'first-timer-ready',
      'ke-aug',
      'serengeti-vs-mara',
      'tz-vs-ke',
      'ideal-length',
    ],
    linked_guides: ['serengeti-vs-masai-mara', 'kenya-august'],
    assurance_relevance: true,
  },
  {
    id: 'kenya-conservancy-focused',
    title: 'Kenya Conservancy Experience',
    subtitle: 'Private reserves and community partnerships',
    regions: ['east-africa', 'kenya'],
    duration_days: [6, 8],
    comfort_tier: 'luxury',
    cost_band: { low: 8000, high: 15000, note: 'Excluding international flights' },
    best_months: [7, 8, 9, 10, 1, 2],
    core_parks_or_areas: ['Mara Conservancies', 'Laikipia Plateau', 'Lewa Wildlife Conservancy'],
    traveler_fit: ['honeymoon', 'photography', 'repeat-visitor'],
    what_this_trip_is_for:
      'Travelers prioritizing exclusivity, off-road driving, night drives, and walking safaris over maximum park variety.',
    what_you_trade_off: [
      'Higher nightly rates than national park lodges',
      'Fewer total parks visited in exchange for depth of experience',
      'May miss Mara National Reserve signature viewpoints',
    ],
    linked_decisions: [
      'luxury-worth',
      'private-vs-shared',
      'night-drives',
      'walking-safari',
      'inside-vs-outside',
    ],
    linked_guides: ['luxury-worth-it'],
    assurance_relevance: true,
  },

  // ============================================================
  // SOUTHERN AFRICA - BOTSWANA
  // ============================================================
  {
    id: 'okavango-delta-immersion',
    title: 'Okavango Delta Immersion',
    subtitle: 'Water-based safari in the inland delta',
    regions: ['southern-africa', 'botswana'],
    duration_days: [5, 8],
    comfort_tier: 'luxury',
    cost_band: { low: 10000, high: 18000, note: 'Excluding international flights, includes charter flights' },
    best_months: [5, 6, 7, 8, 9, 10],
    core_parks_or_areas: ['Okavango Delta', 'Moremi Game Reserve', 'Chief\'s Island'],
    traveler_fit: ['honeymoon', 'photography', 'repeat-visitor', 'adventure'],
    what_this_trip_is_for:
      'Travelers seeking the unique mokoro and boat-based safari experience in one of Africa\'s most pristine wilderness areas.',
    what_you_trade_off: [
      'Very high cost due to remote fly-in camps and low-impact tourism model',
      'Water levels vary seasonally, affecting which activities are possible',
      'Less game density than drier land-based safari areas',
    ],
    linked_decisions: ['okavango-worth', 'bw-jun', 'bw-peak-flood', 'mokoro-canoe', 'luxury-worth'],
    linked_guides: ['okavango-worth-it'],
    assurance_relevance: true,
  },
  {
    id: 'botswana-diverse-ecosystems',
    title: 'Botswana Diverse Ecosystems',
    subtitle: 'Delta, desert, and saltpans',
    regions: ['southern-africa', 'botswana'],
    duration_days: [10, 14],
    comfort_tier: 'luxury',
    cost_band: { low: 15000, high: 25000, note: 'Excluding international flights, includes charter flights' },
    best_months: [5, 6, 7, 8, 9, 10],
    core_parks_or_areas: [
      'Okavango Delta',
      'Chobe National Park',
      'Makgadikgadi Pans',
      'Central Kalahari',
    ],
    traveler_fit: ['adventure', 'photography', 'repeat-visitor'],
    what_this_trip_is_for:
      'Experienced travelers wanting to experience Botswana\'s landscape diversity from water to desert in a single journey.',
    what_you_trade_off: [
      'Requires multiple charter flights, significantly increasing cost',
      'Longer itinerary needed to do justice to each ecosystem',
      'Less time depth at each location compared to single-focus trips',
    ],
    linked_decisions: [
      'okavango-worth',
      'tz-vs-bw',
      'ideal-length',
      'fly-vs-drive',
      'splurge-allocation',
    ],
    linked_guides: ['okavango-worth-it', 'tanzania-vs-botswana'],
    assurance_relevance: true,
  },

  // ============================================================
  // SOUTHERN AFRICA - SOUTH AFRICA
  // ============================================================
  {
    id: 'kruger-greater-kruger',
    title: 'Greater Kruger Experience',
    subtitle: 'Private reserves bordering Kruger National Park',
    regions: ['southern-africa', 'south-africa'],
    duration_days: [4, 7],
    comfort_tier: 'mid',
    cost_band: { low: 3000, high: 6000, note: 'Excluding international flights' },
    best_months: [5, 6, 7, 8, 9, 10],
    core_parks_or_areas: ['Sabi Sands', 'Timbavati', 'Klaserie', 'Kruger National Park'],
    traveler_fit: ['first-safari', 'family', 'honeymoon', 'wildlife-focused'],
    what_this_trip_is_for:
      'Travelers wanting accessible Big Five safari with no malaria concerns in certain areas, good for combining with Cape Town.',
    what_you_trade_off: [
      'More commercialized feel than East African wilderness',
      'Smaller unfenced reserves mean wildlife encounters can feel less wild',
      'Limited to Big Five focus, less landscape diversity',
    ],
    linked_decisions: [
      'sa-vs-ea',
      'kruger-vs-private',
      'malaria-decision',
      'ideal-length',
      'first-timer-ready',
    ],
    linked_guides: ['south-africa-vs-east-africa', 'kruger-vs-private-reserves'],
    assurance_relevance: true,
  },
  {
    id: 'south-africa-combo',
    title: 'South Africa Safari and Cape',
    subtitle: 'Big Five plus Cape Town in one journey',
    regions: ['southern-africa', 'south-africa'],
    duration_days: [10, 14],
    comfort_tier: 'mid',
    cost_band: { low: 5000, high: 9000, note: 'Excluding international flights, includes internal flights' },
    best_months: [4, 5, 6, 7, 8, 9, 10],
    core_parks_or_areas: ['Greater Kruger', 'Cape Town', 'Winelands', 'Garden Route'],
    traveler_fit: ['first-safari', 'honeymoon', 'family', 'cultural'],
    what_this_trip_is_for:
      'Travelers wanting a multi-experience South Africa trip combining wildlife with urban culture and wine country.',
    what_you_trade_off: [
      'Safari portion is shorter, limiting wildlife depth',
      'Requires internal flights, adding complexity and cost',
      'Cape weather can be unpredictable in winter months',
    ],
    linked_decisions: ['sa-vs-ea', 'beach-extension', 'ideal-length', 'single-country-multi'],
    linked_guides: ['south-africa-vs-east-africa'],
    assurance_relevance: false,
  },

  // ============================================================
  // UGANDA & RWANDA - GORILLA TREKKING
  // ============================================================
  {
    id: 'rwanda-gorilla-focused',
    title: 'Rwanda Gorilla Trek',
    subtitle: 'Mountain gorillas in Volcanoes National Park',
    regions: ['uganda-rwanda'],
    duration_days: [4, 6],
    comfort_tier: 'luxury',
    cost_band: { low: 5000, high: 8000, note: 'Excluding international flights, includes $1,500 permit' },
    best_months: [1, 2, 6, 7, 8, 9, 12],
    core_parks_or_areas: ['Volcanoes National Park', 'Kigali'],
    traveler_fit: ['adventure', 'wildlife-focused', 'photography'],
    what_this_trip_is_for:
      'Travelers prioritizing the gorilla encounter above all else, with efficient logistics from Kigali.',
    what_you_trade_off: [
      'Very high permit cost (currently $1,500 per trek)',
      'Limited to 1-hour gorilla viewing time regardless of trek length',
      'Less wildlife diversity than combination itineraries',
    ],
    linked_decisions: ['rwanda-gorillas-worth', 'uganda-vs-rwanda', 'booking-lead-time'],
    linked_guides: ['rwanda-gorillas-worth-it', 'uganda-vs-rwanda'],
    assurance_relevance: true,
  },
  {
    id: 'uganda-primate-safari',
    title: 'Uganda Primate Safari',
    subtitle: 'Gorillas, chimps, and savannah wildlife',
    regions: ['uganda-rwanda'],
    duration_days: [8, 12],
    comfort_tier: 'mid',
    cost_band: { low: 5000, high: 9000, note: 'Excluding international flights, includes $800 gorilla permit' },
    best_months: [1, 2, 6, 7, 8, 9, 12],
    core_parks_or_areas: [
      'Bwindi Impenetrable Forest',
      'Kibale Forest',
      'Queen Elizabeth National Park',
      'Murchison Falls',
    ],
    traveler_fit: ['adventure', 'wildlife-focused', 'photography', 'repeat-visitor'],
    what_this_trip_is_for:
      'Travelers wanting both gorillas and chimpanzees plus traditional savannah safari, accepting longer drives.',
    what_you_trade_off: [
      'Significant driving time between parks on variable roads',
      'Less polished infrastructure than Kenya or Tanzania',
      'Gorilla permits still expensive, adding to overall cost',
    ],
    linked_decisions: [
      'uganda-vs-rwanda',
      'rwanda-gorillas-worth',
      'walking-safari',
      'ideal-length',
    ],
    linked_guides: ['uganda-vs-rwanda', 'rwanda-gorillas-worth-it'],
    assurance_relevance: true,
  },

  // ============================================================
  // NAMIBIA
  // ============================================================
  {
    id: 'namibia-highlights',
    title: 'Namibia Highlights',
    subtitle: 'Dunes, desert-adapted wildlife, and stark landscapes',
    regions: ['southern-africa', 'namibia'],
    duration_days: [10, 14],
    comfort_tier: 'mid',
    cost_band: { low: 5000, high: 10000, note: 'Excluding international flights' },
    best_months: [5, 6, 7, 8, 9, 10],
    core_parks_or_areas: ['Sossusvlei', 'Etosha', 'Damaraland', 'Skeleton Coast'],
    traveler_fit: ['photography', 'adventure', 'repeat-visitor', 'solo'],
    what_this_trip_is_for:
      'Travelers drawn to dramatic landscapes and desert-adapted wildlife, comfortable with self-drive options.',
    what_you_trade_off: [
      'Lower wildlife density than East African parks',
      'Long distances between destinations require extensive driving',
      'Less traditional "Big Five" safari, more landscape-focused',
    ],
    linked_decisions: ['namibia-different', 'self-drive-safari', 'ideal-length', 'solo-safari-fit'],
    linked_guides: ['self-drive-safari'],
    assurance_relevance: false,
  },
  {
    id: 'namibia-self-drive',
    title: 'Namibia Self-Drive Adventure',
    subtitle: 'Independent exploration of open roads',
    regions: ['southern-africa', 'namibia'],
    duration_days: [12, 18],
    comfort_tier: 'budget',
    cost_band: { low: 2500, high: 5000, note: 'Excluding international flights, includes 4x4 rental' },
    best_months: [4, 5, 6, 7, 8, 9, 10],
    core_parks_or_areas: [
      'Windhoek',
      'Sossusvlei',
      'Etosha',
      'Fish River Canyon',
      'Skeleton Coast',
    ],
    traveler_fit: ['adventure', 'solo', 'photography'],
    what_this_trip_is_for:
      'Independent travelers comfortable with 4x4 driving and self-catering, seeking flexibility and value.',
    what_you_trade_off: [
      'No guide expertise on wildlife spotting or behavior',
      'Responsibility for vehicle, navigation, and safety',
      'Remote breakdowns can be costly and time-consuming',
    ],
    linked_decisions: ['self-drive-safari', 'solo-safari-fit', 'budget-accommodation', 'total-budget'],
    linked_guides: ['self-drive-safari'],
    assurance_relevance: false,
  },

  // ============================================================
  // ZAMBIA & ZIMBABWE
  // ============================================================
  {
    id: 'zambia-walking-safari',
    title: 'Zambia Walking Safari',
    subtitle: 'On foot in the birthplace of walking safaris',
    regions: ['southern-africa', 'zambia'],
    duration_days: [7, 10],
    comfort_tier: 'luxury',
    cost_band: { low: 8000, high: 15000, note: 'Excluding international flights' },
    best_months: [6, 7, 8, 9, 10],
    core_parks_or_areas: ['South Luangwa', 'North Luangwa', 'Lower Zambezi'],
    traveler_fit: ['adventure', 'repeat-visitor', 'wildlife-focused'],
    what_this_trip_is_for:
      'Travelers seeking authentic walking safari experience with specialist guides in remote wilderness.',
    what_you_trade_off: [
      'Physically demanding with early starts and multi-hour walks',
      'Less game viewing quantity, more quality and depth',
      'Limited to dry season when walking is practical',
    ],
    linked_decisions: ['walking-safari', 'zambia-value', 'ideal-length', 'off-beaten-path'],
    linked_guides: ['walking-safari'],
    assurance_relevance: true,
  },
  {
    id: 'victoria-falls-safari-combo',
    title: 'Victoria Falls and Safari',
    subtitle: 'Combining the falls with Zambia or Zimbabwe parks',
    regions: ['southern-africa', 'zambia', 'zimbabwe'],
    duration_days: [6, 9],
    comfort_tier: 'mid',
    cost_band: { low: 4000, high: 7000, note: 'Excluding international flights' },
    best_months: [4, 5, 6, 7, 8, 9],
    core_parks_or_areas: ['Victoria Falls', 'Chobe (day trip)', 'Hwange', 'Mana Pools'],
    traveler_fit: ['first-safari', 'honeymoon', 'adventure'],
    what_this_trip_is_for:
      'Travelers wanting to combine the iconic Victoria Falls with wildlife viewing in nearby parks.',
    what_you_trade_off: [
      'Falls viewing time competes with safari time',
      'Border crossings add logistical complexity',
      'Tourist infrastructure around falls feels commercial',
    ],
    linked_decisions: ['zimbabwe-safe', 'beach-extension', 'ideal-length', 'first-timer-ready'],
    linked_guides: [],
    assurance_relevance: false,
  },

  // ============================================================
  // SPECIAL INTEREST / NICHE TRIPS
  // ============================================================
  {
    id: 'photography-focused-safari',
    title: 'Photography-Focused Safari',
    subtitle: 'Designed around light, positioning, and patience',
    regions: ['east-africa', 'southern-africa'],
    duration_days: [10, 14],
    comfort_tier: 'luxury',
    cost_band: { low: 12000, high: 20000, note: 'Excluding international flights, includes private vehicle' },
    best_months: [6, 7, 8, 9],
    core_parks_or_areas: ['Masai Mara', 'Serengeti', 'Okavango Delta', 'South Luangwa'],
    traveler_fit: ['photography', 'repeat-visitor'],
    what_this_trip_is_for:
      'Serious photographers prioritizing golden hour positioning, private vehicles, and extended sightings.',
    what_you_trade_off: [
      'Much higher cost for private vehicles and flexible scheduling',
      'Non-photographer companions may find pace slow',
      'Less variety in favor of optimal conditions at key locations',
    ],
    linked_decisions: [
      'photo-safari-vs-regular',
      'private-vs-shared',
      'luxury-worth',
      'booking-lead-time',
    ],
    linked_guides: [],
    assurance_relevance: true,
  },
  {
    id: 'family-multigenerational',
    title: 'Multigenerational Family Safari',
    subtitle: 'Three generations in the African bush',
    regions: ['east-africa', 'southern-africa'],
    duration_days: [8, 12],
    comfort_tier: 'luxury',
    cost_band: { low: 8000, high: 15000, note: 'Excluding international flights, per person' },
    best_months: [6, 7, 8, 12, 1, 2],
    core_parks_or_areas: ['Masai Mara', 'Greater Kruger', 'Okavango Delta'],
    traveler_fit: ['family', 'multigenerational'],
    what_this_trip_is_for:
      'Families traveling with grandparents and children, needing accessible logistics and flexible pacing.',
    what_you_trade_off: [
      'Premium pricing for family suites and private vehicles',
      'Pace must accommodate slowest member, limiting activities',
      'Some camps have age restrictions on walking or boat activities',
    ],
    linked_decisions: [
      'multigenerational',
      'family-young-kids',
      'mobility-challenges',
      'lodge-vs-tented',
      'ideal-length',
    ],
    linked_guides: ['multigenerational-safari'],
    assurance_relevance: true,
  },
  {
    id: 'honeymoon-romance-safari',
    title: 'Honeymoon Safari',
    subtitle: 'Romance in the wilderness',
    regions: ['east-africa', 'southern-africa'],
    duration_days: [7, 12],
    comfort_tier: 'luxury',
    cost_band: { low: 8000, high: 18000, note: 'Excluding international flights' },
    best_months: [5, 6, 7, 8, 9, 10],
    core_parks_or_areas: ['Masai Mara Conservancies', 'Okavango Delta', 'Greater Kruger'],
    traveler_fit: ['honeymoon'],
    what_this_trip_is_for:
      'Newlyweds seeking intimate, high-service safari experience with romantic camp settings.',
    what_you_trade_off: [
      'Premium positioning and service commands luxury pricing',
      'Remote romantic settings may limit activity variety',
      'High expectations can create pressure on the experience',
    ],
    linked_decisions: ['honeymoon-fit', 'luxury-worth', 'beach-extension', 'ideal-length'],
    linked_guides: ['safari-honeymoon'],
    assurance_relevance: true,
  },
  {
    id: 'budget-first-safari',
    title: 'Budget-Conscious First Safari',
    subtitle: 'Authentic wildlife experience at accessible price',
    regions: ['east-africa', 'southern-africa'],
    duration_days: [5, 7],
    comfort_tier: 'budget',
    cost_band: { low: 2000, high: 4000, note: 'Excluding international flights' },
    best_months: [1, 2, 3, 4, 5, 11],
    core_parks_or_areas: ['Serengeti', 'Ngorongoro', 'Kruger', 'Queen Elizabeth'],
    traveler_fit: ['first-safari', 'solo', 'adventure'],
    what_this_trip_is_for:
      'First-time travelers on limited budget who prioritize wildlife access over accommodation luxury.',
    what_you_trade_off: [
      'Basic accommodation with fewer amenities',
      'Shared vehicles and fixed schedules reduce flexibility',
      'Green season timing means possible rain and harder wildlife spotting',
    ],
    linked_decisions: [
      'budget-tanzania',
      'budget-accommodation',
      'green-season-value',
      'cheap-warning',
      'total-budget',
    ],
    linked_guides: ['budget-safari-tanzania', 'green-season-value'],
    assurance_relevance: false,
  },
];

/**
 * Get all trip archetypes
 */
export function getAllTrips(): TripArchetype[] {
  return tripArchetypes;
}

/**
 * Get trip by ID
 */
export function getTripById(id: string): TripArchetype | null {
  return tripArchetypes.find((t) => t.id === id) || null;
}

/**
 * Get trips by region
 */
export function getTripsByRegion(region: RegionTag): TripArchetype[] {
  return tripArchetypes.filter((t) => t.regions.includes(region));
}

/**
 * Get trips by comfort tier
 */
export function getTripsByComfortTier(tier: ComfortTier): TripArchetype[] {
  return tripArchetypes.filter((t) => t.comfort_tier === tier);
}

/**
 * Get trips by traveler fit
 */
export function getTripsByTravelerFit(fit: TravelerFit): TripArchetype[] {
  return tripArchetypes.filter((t) => t.traveler_fit.includes(fit));
}

/**
 * Format duration for display
 */
export function formatDuration(duration: number | [number, number]): string {
  if (Array.isArray(duration)) {
    return `${duration[0]}–${duration[1]} days`;
  }
  return `${duration} days`;
}

/**
 * Format months for display
 */
export function formatBestMonths(months: number[]): string {
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  if (months.length === 0) return 'Year-round';
  if (months.length >= 10) return 'Most of the year';

  // Group consecutive months
  const sorted = [...months].sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sorted[0];
  let end = sorted[0];

  for (let i = 1; i <= sorted.length; i++) {
    if (sorted[i] === end + 1 || (end === 12 && sorted[i] === 1)) {
      end = sorted[i];
    } else {
      if (start === end) {
        ranges.push(monthNames[start - 1]);
      } else {
        ranges.push(`${monthNames[start - 1]}–${monthNames[end - 1]}`);
      }
      start = sorted[i];
      end = sorted[i];
    }
  }

  return ranges.join(', ');
}

/**
 * Get region display name
 */
export function getRegionDisplayName(region: RegionTag): string {
  const names: Record<RegionTag, string> = {
    'east-africa': 'East Africa',
    'southern-africa': 'Southern Africa',
    'uganda-rwanda': 'Uganda & Rwanda',
    'tanzania': 'Tanzania',
    'kenya': 'Kenya',
    'botswana': 'Botswana',
    'south-africa': 'South Africa',
    'namibia': 'Namibia',
    'zambia': 'Zambia',
    'zimbabwe': 'Zimbabwe',
  };
  return names[region];
}

/**
 * Get comfort tier display
 */
export function getComfortTierDisplay(tier: ComfortTier): string {
  const displays: Record<ComfortTier, string> = {
    budget: 'Budget',
    mid: 'Mid-range',
    luxury: 'Luxury',
  };
  return displays[tier];
}

/**
 * Format cost band for display
 * Examples: "$2,000–$4,000/pp" or "$12k–$20k/pp"
 */
export function formatCostBand(costBand: CostBand): string {
  const formatAmount = (n: number): string => {
    if (n >= 10000) {
      return `$${Math.round(n / 1000)}k`;
    }
    return `$${n.toLocaleString()}`;
  };

  return `${formatAmount(costBand.low)}–${formatAmount(costBand.high)}/pp`;
}
