/**
 * Game Parks and Reserves Content
 *
 * Comprehensive data for individual park/reserve pages.
 * Each park has facts, wildlife, seasons, activities, and trade-offs.
 */

export type EcosystemType = 'savannah' | 'delta' | 'forest' | 'desert' | 'mountains' | 'floodplain';
export type ParkType = 'national-park' | 'reserve' | 'conservancy' | 'conservation-area';

export interface WildlifeSpecies {
  name: string;
  probability: 'guaranteed' | 'very-likely' | 'likely' | 'possible' | 'rare';
  notes?: string;
}

export interface ParkSeason {
  name: string;
  months: string;
  conditions: string;
  wildlife: string;
  crowds: 'low' | 'moderate' | 'high' | 'peak';
  recommended: boolean;
}

export interface ParkFact {
  label: string;
  value: string;
}

export interface ParkActivity {
  name: string;
  available: boolean;
  notes?: string;
}

export interface GamePark {
  id: string;
  name: string;
  destinationId: string;
  type: ParkType;
  ecosystem: EcosystemType;

  // Hero content
  tagline: string;
  description: string;

  // Key facts
  facts: ParkFact[];

  // Wildlife
  wildlife: WildlifeSpecies[];
  signatureSpecies: string[];

  // Seasons
  seasons: ParkSeason[];
  bestTime: string;

  // Activities available
  activities: ParkActivity[];

  // Highlights and trade-offs
  highlights: string[];
  bestFor: string;
  tradeoffs: {
    gains: string[];
    losses: string[];
  };

  // Practical
  accessInfo: string;
  typicalStay: string;

  // Links to related content
  relatedParks: string[];
}

/**
 * All game parks data
 */
export const PARKS: Record<string, GamePark> = {
  // ============ TANZANIA ============
  'serengeti': {
    id: 'serengeti',
    name: 'Serengeti National Park',
    destinationId: 'tanzania',
    type: 'national-park',
    ecosystem: 'savannah',
    tagline: 'The endless plains where the Great Migration unfolds',
    description: 'The Serengeti is East Africa\'s most iconic park, famous for the Great Migration and exceptional predator sightings. At 14,750 km², it offers vast open plains, acacia woodlands, and riverine forests supporting one of the world\'s most complex ecosystems.',
    facts: [
      { label: 'Size', value: '14,750 km² (5,700 sq mi)' },
      { label: 'Established', value: '1951' },
      { label: 'UNESCO Status', value: 'World Heritage Site since 1981' },
      { label: 'Elevation', value: '920-1,850 m (3,020-6,070 ft)' },
      { label: 'Annual Visitors', value: '~350,000' },
      { label: 'Park Fees', value: '$70 per adult per 24 hours' },
    ],
    wildlife: [
      { name: 'Lion', probability: 'very-likely', notes: 'One of Africa\'s densest populations' },
      { name: 'Leopard', probability: 'likely', notes: 'Best in Seronera area' },
      { name: 'Cheetah', probability: 'likely', notes: 'Open plains ideal for sightings' },
      { name: 'Elephant', probability: 'very-likely' },
      { name: 'Buffalo', probability: 'guaranteed' },
      { name: 'Wildebeest', probability: 'guaranteed', notes: '1.5 million during migration' },
      { name: 'Zebra', probability: 'guaranteed', notes: '250,000 during migration' },
      { name: 'Hippo', probability: 'very-likely', notes: 'In rivers and pools' },
      { name: 'Crocodile', probability: 'very-likely', notes: 'At river crossings' },
      { name: 'Hyena', probability: 'very-likely' },
      { name: 'Wild Dog', probability: 'rare', notes: 'Occasionally seen' },
      { name: 'Black Rhino', probability: 'rare', notes: 'Small population exists' },
    ],
    signatureSpecies: ['Great Migration herds', 'Big cats', 'Nile crocodile'],
    seasons: [
      { name: 'Peak Dry', months: 'July-October', conditions: 'Dry, excellent visibility, wildlife concentrated at water', wildlife: 'Migration in northern Serengeti, river crossings', crowds: 'peak', recommended: true },
      { name: 'Short Dry', months: 'January-February', conditions: 'Dry, good roads', wildlife: 'Calving season in southern plains', crowds: 'high', recommended: true },
      { name: 'Green Season', months: 'March-May', conditions: 'Heavy rain, some road closures', wildlife: 'Dispersed but active, newborns', crowds: 'low', recommended: false },
      { name: 'Short Rains', months: 'November-December', conditions: 'Light rain, lush landscape', wildlife: 'Migration moving south', crowds: 'moderate', recommended: true },
    ],
    bestTime: 'July-October for river crossings, January-February for calving',
    activities: [
      { name: 'Game drives', available: true },
      { name: 'Hot air balloon', available: true, notes: 'Morning flights with champagne breakfast' },
      { name: 'Walking safari', available: true, notes: 'In designated areas only' },
      { name: 'Night drives', available: false, notes: 'Not permitted in national park' },
      { name: 'Bush meals', available: true },
    ],
    highlights: ['Great Migration', 'Big cats', 'Endless plains', 'Balloon safaris'],
    bestFor: 'Migration seekers, first-time safari travelers, wildlife photographers',
    tradeoffs: {
      gains: [
        'Unmatched wildlife density during migration',
        'Excellent predator sightings year-round',
        'Iconic African landscapes',
        'Well-developed infrastructure',
      ],
      losses: [
        'Popular areas can be crowded',
        'High park fees',
        'Large park requires multiple days',
        'Limited night drive and walking options',
      ],
    },
    accessInfo: 'Fly to Seronera airstrip (1.5hr from Arusha) or drive from Ngorongoro (3-4 hours)',
    typicalStay: '3-4 nights minimum, often combined with Ngorongoro',
    relatedParks: ['ngorongoro', 'tarangire', 'masai-mara'],
  },

  'ngorongoro': {
    id: 'ngorongoro',
    name: 'Ngorongoro Conservation Area',
    destinationId: 'tanzania',
    type: 'conservation-area',
    ecosystem: 'savannah',
    tagline: 'The world\'s largest intact volcanic caldera',
    description: 'Ngorongoro Crater is a 260 km² caldera floor teeming with wildlife. The Conservation Area also includes Olduvai Gorge and the Ngorongoro Highlands. It\'s the only place in Tanzania where Maasai coexist with wildlife.',
    facts: [
      { label: 'Crater Size', value: '260 km² floor, 610 m deep' },
      { label: 'Crater Rim', value: '2,286 m (7,500 ft) elevation' },
      { label: 'Total Area', value: '8,292 km² Conservation Area' },
      { label: 'Established', value: '1959' },
      { label: 'UNESCO Status', value: 'World Heritage Site since 1979' },
      { label: 'Crater Wildlife', value: '~25,000 large animals' },
    ],
    wildlife: [
      { name: 'Lion', probability: 'very-likely', notes: '~60 lions in crater' },
      { name: 'Black Rhino', probability: 'likely', notes: 'One of best places to see them' },
      { name: 'Elephant', probability: 'very-likely', notes: 'Mostly old bulls in crater' },
      { name: 'Buffalo', probability: 'guaranteed' },
      { name: 'Leopard', probability: 'possible', notes: 'On crater rim forests' },
      { name: 'Hippo', probability: 'guaranteed', notes: 'In Hippo Pool' },
      { name: 'Flamingo', probability: 'very-likely', notes: 'Lake Magadi' },
      { name: 'Wildebeest', probability: 'guaranteed', notes: 'Resident population ~7,000' },
      { name: 'Zebra', probability: 'guaranteed' },
      { name: 'Hyena', probability: 'very-likely' },
      { name: 'Serval', probability: 'possible', notes: 'In tall grass areas' },
      { name: 'Golden Jackal', probability: 'very-likely' },
    ],
    signatureSpecies: ['Black rhino', 'Crater lions', 'Flamingo'],
    seasons: [
      { name: 'Peak Dry', months: 'July-October', conditions: 'Cool, clear, dusty', wildlife: 'Concentrated at water sources', crowds: 'peak', recommended: true },
      { name: 'Short Dry', months: 'January-February', conditions: 'Warm, clear', wildlife: 'Calving in short grass', crowds: 'high', recommended: true },
      { name: 'Long Rains', months: 'March-May', conditions: 'Heavy rain, muddy roads', wildlife: 'Green but dispersed', crowds: 'low', recommended: false },
      { name: 'Short Rains', months: 'November-December', conditions: 'Light rain, lush', wildlife: 'Good visibility, newborns', crowds: 'moderate', recommended: true },
    ],
    bestTime: 'Year-round, but June-October for best weather',
    activities: [
      { name: 'Crater game drives', available: true, notes: '6-hour limit enforced' },
      { name: 'Rim walking', available: true, notes: 'With armed ranger' },
      { name: 'Olduvai Gorge visit', available: true, notes: 'Cradle of mankind site' },
      { name: 'Maasai village visits', available: true },
      { name: 'Night drives', available: false },
    ],
    highlights: ['Crater ecosystem', 'High wildlife density', 'Black rhino', 'Olduvai Gorge'],
    bestFor: 'Big Five in one day, unique landscape, first-time visitors',
    tradeoffs: {
      gains: [
        'Almost guaranteed Big Five in one day',
        'Unique geological formation',
        'High wildlife density in small area',
        'Good rhino sighting chances',
      ],
      losses: [
        'Very crowded at popular times',
        '6-hour crater limit restricts flexibility',
        'Expensive crater fees',
        'Rim can be cold and foggy',
      ],
    },
    accessInfo: 'Drive from Arusha (3-4 hours) or fly to Lake Manyara airstrip',
    typicalStay: '1-2 nights on rim, often combined with Serengeti',
    relatedParks: ['serengeti', 'tarangire', 'lake-manyara'],
  },

  'tarangire': {
    id: 'tarangire',
    name: 'Tarangire National Park',
    destinationId: 'tanzania',
    type: 'national-park',
    ecosystem: 'savannah',
    tagline: 'Elephants and baobabs in Tanzania\'s less-visited conservation area',
    description: 'Tarangire is defined by the Tarangire River, ancient baobab trees, and one of Africa\'s highest elephant densities. During dry season, wildlife concentrates along the river, creating spectacular viewing. Less crowded than northern circuit neighbors.',
    facts: [
      { label: 'Size', value: '2,850 km²' },
      { label: 'Established', value: '1970' },
      { label: 'Elevation', value: '900-1,200 m' },
      { label: 'Elephant Population', value: '~3,000 (up to 6,000 in dry season)' },
      { label: 'Park Fees', value: '$53.10 per adult per 24 hours' },
      { label: 'Distance from Arusha', value: '118 km (2 hours)' },
    ],
    wildlife: [
      { name: 'Elephant', probability: 'guaranteed', notes: 'Highest density in Tanzania' },
      { name: 'Lion', probability: 'very-likely', notes: 'Tree-climbing lions common' },
      { name: 'Leopard', probability: 'possible' },
      { name: 'Buffalo', probability: 'very-likely' },
      { name: 'Giraffe', probability: 'guaranteed' },
      { name: 'Zebra', probability: 'guaranteed' },
      { name: 'Wildebeest', probability: 'very-likely' },
      { name: 'Greater Kudu', probability: 'likely' },
      { name: 'Fringe-eared Oryx', probability: 'likely' },
      { name: 'Python', probability: 'possible', notes: 'In baobab trees' },
      { name: 'Birds (550+ species)', probability: 'guaranteed' },
    ],
    signatureSpecies: ['Elephant herds', 'Baobab trees', 'Tree-climbing lions'],
    seasons: [
      { name: 'Peak Dry', months: 'July-October', conditions: 'Dry, wildlife at river', wildlife: 'Massive elephant congregations', crowds: 'moderate', recommended: true },
      { name: 'Early Dry', months: 'June', conditions: 'Pleasant, green fading', wildlife: 'Good all-round', crowds: 'moderate', recommended: true },
      { name: 'Wet Season', months: 'November-May', conditions: 'Green, some rain', wildlife: 'Dispersed, migratory birds arrive', crowds: 'low', recommended: false },
    ],
    bestTime: 'July-October when elephants concentrate at the river',
    activities: [
      { name: 'Game drives', available: true },
      { name: 'Walking safari', available: true, notes: 'With armed ranger' },
      { name: 'Night drives', available: false },
      { name: 'Baobab photography', available: true },
    ],
    highlights: ['Elephant herds', 'Baobab trees', 'Bird diversity', 'Quieter than Serengeti'],
    bestFor: 'Elephant lovers, photographers, birders, those avoiding crowds',
    tradeoffs: {
      gains: [
        'Best elephant viewing in East Africa',
        'Iconic baobab landscapes',
        'Less crowded than Serengeti/Ngorongoro',
        'Excellent birding (550+ species)',
      ],
      losses: [
        'No rhino population',
        'Wildlife disperses in wet season',
        'Less variety than Serengeti',
        'Can be hot and dusty in dry season',
      ],
    },
    accessInfo: '2-hour drive from Arusha, often first stop on northern circuit',
    typicalStay: '1-2 nights, often en route to Serengeti',
    relatedParks: ['serengeti', 'ngorongoro', 'lake-manyara'],
  },

  // ============ KENYA ============
  'masai-mara': {
    id: 'masai-mara',
    name: 'Masai Mara National Reserve',
    destinationId: 'kenya',
    type: 'reserve',
    ecosystem: 'savannah',
    tagline: 'Where the Great Migration crosses the Mara River',
    description: 'The Masai Mara is Kenya\'s most famous wildlife destination, contiguous with Tanzania\'s Serengeti. The open savannah and Mara River create the setting for dramatic wildebeest crossings. Excellent predator sightings year-round.',
    facts: [
      { label: 'Size', value: '1,510 km² (reserve only)' },
      { label: 'With Conservancies', value: '~4,000 km² total ecosystem' },
      { label: 'Established', value: '1961' },
      { label: 'Elevation', value: '1,500-2,180 m' },
      { label: 'Park Fees', value: '$80 per adult per 24 hours (reserve)' },
      { label: 'Lion Population', value: '~850 in Greater Mara' },
    ],
    wildlife: [
      { name: 'Lion', probability: 'very-likely', notes: 'One of Africa\'s densest populations' },
      { name: 'Leopard', probability: 'likely', notes: 'Along rivers and luggas' },
      { name: 'Cheetah', probability: 'likely', notes: 'Open plains ideal' },
      { name: 'Elephant', probability: 'very-likely' },
      { name: 'Buffalo', probability: 'guaranteed' },
      { name: 'Hippo', probability: 'guaranteed', notes: 'Mara River' },
      { name: 'Crocodile', probability: 'guaranteed', notes: 'Mara River crossings' },
      { name: 'Wildebeest', probability: 'guaranteed', notes: 'July-October peak' },
      { name: 'Zebra', probability: 'guaranteed' },
      { name: 'Black Rhino', probability: 'rare', notes: 'Small population' },
      { name: 'Hyena', probability: 'very-likely' },
      { name: 'Topi', probability: 'guaranteed' },
    ],
    signatureSpecies: ['River crossings', 'Big cats', 'Mara ecosystem'],
    seasons: [
      { name: 'Migration Peak', months: 'July-October', conditions: 'Dry, clear', wildlife: 'River crossings, massive herds', crowds: 'peak', recommended: true },
      { name: 'Short Dry', months: 'January-February', conditions: 'Dry, warm', wildlife: 'Resident wildlife, predators', crowds: 'moderate', recommended: true },
      { name: 'Long Rains', months: 'March-May', conditions: 'Heavy rain, muddy', wildlife: 'Green season babies', crowds: 'low', recommended: false },
      { name: 'Short Rains', months: 'November-December', conditions: 'Light rain', wildlife: 'Migration departing', crowds: 'moderate', recommended: true },
    ],
    bestTime: 'July-October for river crossings; year-round for predators',
    activities: [
      { name: 'Game drives', available: true },
      { name: 'Hot air balloon', available: true },
      { name: 'Walking safari', available: true, notes: 'In conservancies only' },
      { name: 'Night drives', available: true, notes: 'In conservancies only' },
      { name: 'Maasai village visits', available: true },
    ],
    highlights: ['Migration crossings', 'Big cats', 'Open savannah', 'Conservancy system'],
    bestFor: 'Migration seekers, big cat enthusiasts, photographers',
    tradeoffs: {
      gains: [
        'Iconic Mara River crossings',
        'Excellent predator sightings year-round',
        'Conservancy system offers exclusivity',
        'Night drives and walking in conservancies',
      ],
      losses: [
        'Main reserve can be very crowded',
        'High fees in peak season',
        'Vehicle density at crossings',
        'Popular crossing points get congested',
      ],
    },
    accessInfo: 'Fly from Nairobi (45 min) or Wilson Airport to multiple airstrips',
    typicalStay: '3-4 nights, longer during migration',
    relatedParks: ['serengeti', 'mara-conservancies', 'amboseli'],
  },

  'amboseli': {
    id: 'amboseli',
    name: 'Amboseli National Park',
    destinationId: 'kenya',
    type: 'national-park',
    ecosystem: 'savannah',
    tagline: 'Elephants against the backdrop of Kilimanjaro',
    description: 'Amboseli offers the most iconic African image: elephants with snow-capped Kilimanjaro rising behind them. The park has one of Africa\'s best-studied elephant populations and reliable big cat sightings.',
    facts: [
      { label: 'Size', value: '392 km²' },
      { label: 'Established', value: '1974' },
      { label: 'Elevation', value: '1,100 m' },
      { label: 'Elephant Population', value: '~1,800 (well-studied families)' },
      { label: 'Park Fees', value: '$60 per adult per 24 hours' },
      { label: 'Distance from Nairobi', value: '240 km (4-5 hours)' },
    ],
    wildlife: [
      { name: 'Elephant', probability: 'guaranteed', notes: 'Big tuskers and family groups' },
      { name: 'Lion', probability: 'very-likely' },
      { name: 'Cheetah', probability: 'likely' },
      { name: 'Buffalo', probability: 'guaranteed' },
      { name: 'Giraffe', probability: 'very-likely' },
      { name: 'Zebra', probability: 'guaranteed' },
      { name: 'Wildebeest', probability: 'very-likely' },
      { name: 'Hippo', probability: 'very-likely', notes: 'In swamps' },
      { name: 'Hyena', probability: 'very-likely' },
      { name: 'Birds (400+ species)', probability: 'guaranteed' },
    ],
    signatureSpecies: ['Big tusker elephants', 'Kilimanjaro backdrop', 'Swamp wildlife'],
    seasons: [
      { name: 'Dry Season', months: 'June-October', conditions: 'Dry, clear Kilimanjaro views', wildlife: 'Concentrated at swamps', crowds: 'high', recommended: true },
      { name: 'Short Dry', months: 'January-February', conditions: 'Clear, warm', wildlife: 'Good elephant viewing', crowds: 'moderate', recommended: true },
      { name: 'Long Rains', months: 'March-May', conditions: 'Wet, Kilimanjaro often hidden', wildlife: 'Green but dispersed', crowds: 'low', recommended: false },
      { name: 'Short Rains', months: 'November-December', conditions: 'Light rain', wildlife: 'Good, some dust', crowds: 'moderate', recommended: true },
    ],
    bestTime: 'June-October for clear Kilimanjaro views and concentrated wildlife',
    activities: [
      { name: 'Game drives', available: true },
      { name: 'Walking safari', available: true, notes: 'In conservancies' },
      { name: 'Maasai village visits', available: true },
      { name: 'Night drives', available: false },
    ],
    highlights: ['Kilimanjaro views', 'Elephant herds', 'Swamp ecosystems', 'Photography'],
    bestFor: 'Photographers, elephant lovers, iconic Africa images',
    tradeoffs: {
      gains: [
        'Iconic Kilimanjaro backdrop',
        'Well-habituated elephant families',
        'Excellent photographic opportunities',
        'Compact park, easy game viewing',
      ],
      losses: [
        'Can be dusty and crowded',
        'Small park size limits diversity',
        'Kilimanjaro often hidden by clouds (afternoon)',
        'No rhino',
      ],
    },
    accessInfo: 'Fly from Nairobi (45 min) or drive (4-5 hours)',
    typicalStay: '2-3 nights',
    relatedParks: ['masai-mara', 'tsavo', 'lake-nakuru'],
  },

  // ============ BOTSWANA ============
  'okavango-delta': {
    id: 'okavango-delta',
    name: 'Okavango Delta',
    destinationId: 'botswana',
    type: 'reserve',
    ecosystem: 'delta',
    tagline: 'The world\'s largest inland delta',
    description: 'The Okavango is a unique ecosystem where the Okavango River disperses into the Kalahari sands, creating a 22,000 km² wetland. Safari here combines water and land, with mokoro canoes, motorboats, and traditional game drives.',
    facts: [
      { label: 'Size', value: '22,000 km² (seasonal flood)' },
      { label: 'UNESCO Status', value: 'World Heritage Site since 2014' },
      { label: 'Flood Source', value: 'Angolan highlands (4-month delay)' },
      { label: 'Peak Flood', value: 'July-August' },
      { label: 'Concession System', value: 'Private concessions limit visitors' },
      { label: 'Islands', value: 'Chief\'s Island is largest permanent' },
    ],
    wildlife: [
      { name: 'Elephant', probability: 'guaranteed', notes: 'Swimming between islands' },
      { name: 'Lion', probability: 'very-likely' },
      { name: 'Leopard', probability: 'likely' },
      { name: 'Buffalo', probability: 'guaranteed' },
      { name: 'Wild Dog', probability: 'likely', notes: 'Good population in delta' },
      { name: 'Hippo', probability: 'guaranteed' },
      { name: 'Crocodile', probability: 'guaranteed' },
      { name: 'Lechwe', probability: 'guaranteed', notes: 'Endemic red lechwe' },
      { name: 'Sitatunga', probability: 'possible', notes: 'Elusive aquatic antelope' },
      { name: 'African Fish Eagle', probability: 'guaranteed' },
      { name: 'Birds (450+ species)', probability: 'guaranteed' },
    ],
    signatureSpecies: ['Swimming elephants', 'Red lechwe', 'Wild dogs', 'Sitatunga'],
    seasons: [
      { name: 'High Flood', months: 'July-September', conditions: 'Peak water, cool', wildlife: 'Water activities prime, animals on islands', crowds: 'peak', recommended: true },
      { name: 'Dry Season', months: 'October-November', conditions: 'Hot, water receding', wildlife: 'Concentrated at remaining water', crowds: 'high', recommended: true },
      { name: 'Green Season', months: 'December-March', conditions: 'Rain, lush, hot', wildlife: 'Babies, birds, green landscapes', crowds: 'low', recommended: true },
      { name: 'Early Flood', months: 'April-June', conditions: 'Water arriving, cool', wildlife: 'Transitional, good birding', crowds: 'moderate', recommended: true },
    ],
    bestTime: 'July-September for peak water and classic delta experience',
    activities: [
      { name: 'Mokoro safari', available: true, notes: 'Traditional dugout canoe' },
      { name: 'Motorboat safari', available: true },
      { name: 'Game drives', available: true },
      { name: 'Walking safari', available: true },
      { name: 'Night drives', available: true, notes: 'In private concessions' },
      { name: 'Helicopter flights', available: true },
    ],
    highlights: ['Mokoro safaris', 'Island hopping', 'Water-based wildlife', 'Wild dogs'],
    bestFor: 'Repeat safari travelers, water safari experience, exclusivity seekers',
    tradeoffs: {
      gains: [
        'Unique water-based safari experience',
        'Low tourist numbers by design',
        'Multiple safari activities in one place',
        'Excellent wild dog sightings',
      ],
      losses: [
        'Very expensive',
        'Weather affects water levels',
        'Remote, light aircraft access only',
        'Seasonal variation in experience',
      ],
    },
    accessInfo: 'Fly from Maun (20-45 min light aircraft) to camp airstrips',
    typicalStay: '3-4 nights, often combined with Chobe or Moremi',
    relatedParks: ['chobe', 'moremi', 'linyanti'],
  },

  'chobe': {
    id: 'chobe',
    name: 'Chobe National Park',
    destinationId: 'botswana',
    type: 'national-park',
    ecosystem: 'delta',
    tagline: 'Africa\'s highest elephant concentration',
    description: 'Chobe is famous for its enormous elephant herds - an estimated 120,000 in the greater ecosystem. The Chobe River creates exceptional boat safari opportunities and the Savuti area is renowned for predator action.',
    facts: [
      { label: 'Size', value: '11,700 km²' },
      { label: 'Established', value: '1967' },
      { label: 'Elephant Population', value: '~120,000 in ecosystem' },
      { label: 'Park Fees', value: 'P190 per person per day (~$14)' },
      { label: 'Main Areas', value: 'Chobe River, Savuti, Linyanti' },
      { label: 'Distance from Victoria Falls', value: '80 km' },
    ],
    wildlife: [
      { name: 'Elephant', probability: 'guaranteed', notes: 'Massive herds at river' },
      { name: 'Lion', probability: 'very-likely', notes: 'Savuti famous for buffalo-hunting lions' },
      { name: 'Leopard', probability: 'likely' },
      { name: 'Buffalo', probability: 'guaranteed' },
      { name: 'Hippo', probability: 'guaranteed' },
      { name: 'Crocodile', probability: 'guaranteed' },
      { name: 'Giraffe', probability: 'very-likely' },
      { name: 'Wild Dog', probability: 'possible' },
      { name: 'Sable Antelope', probability: 'likely' },
      { name: 'Puku', probability: 'likely', notes: 'Uncommon antelope' },
    ],
    signatureSpecies: ['Elephant herds', 'River wildlife', 'Sable antelope'],
    seasons: [
      { name: 'Dry Season', months: 'May-October', conditions: 'Cool to hot, dry', wildlife: 'Elephants concentrate at river', crowds: 'high', recommended: true },
      { name: 'Wet Season', months: 'November-April', conditions: 'Hot, rain', wildlife: 'Dispersed but green, babies', crowds: 'low', recommended: false },
    ],
    bestTime: 'July-October for massive elephant herds at the river',
    activities: [
      { name: 'Game drives', available: true },
      { name: 'Boat safari', available: true, notes: 'Excellent on Chobe River' },
      { name: 'Walking safari', available: true, notes: 'In some areas' },
      { name: 'Night drives', available: false, notes: 'In park, yes in concessions' },
    ],
    highlights: ['Highest elephant density', 'River cruises', 'Savuti predators', 'Victoria Falls combo'],
    bestFor: 'Elephant enthusiasts, boat safari lovers, Victoria Falls combiners',
    tradeoffs: {
      gains: [
        'Incredible elephant numbers',
        'Easy Victoria Falls combination',
        'Excellent boat safari experience',
        'Multiple distinct ecosystems',
      ],
      losses: [
        'Riverfront can be crowded with boats',
        'Day-trippers from Vic Falls',
        'Less exclusive than private concessions',
        'Hot in late dry season',
      ],
    },
    accessInfo: 'Fly to Kasane (1hr from Johannesburg) or drive from Victoria Falls (1.5hr)',
    typicalStay: '2-3 nights, often combined with Victoria Falls or Okavango',
    relatedParks: ['okavango-delta', 'moremi', 'hwange'],
  },

  // ============ SOUTH AFRICA ============
  'kruger': {
    id: 'kruger',
    name: 'Kruger National Park',
    destinationId: 'south-africa',
    type: 'national-park',
    ecosystem: 'savannah',
    tagline: 'Africa\'s most accessible Big Five safari',
    description: 'Kruger is South Africa\'s flagship park and one of Africa\'s largest. The extensive road network makes self-drive safari viable, while rest camps provide affordable accommodation. Private reserves on the western border offer luxury alternatives.',
    facts: [
      { label: 'Size', value: '19,485 km²' },
      { label: 'Established', value: '1926' },
      { label: 'Length', value: '350 km north to south' },
      { label: 'Park Gates', value: '9 entrance gates' },
      { label: 'Rest Camps', value: '21 camps, 12 main' },
      { label: 'Park Fees', value: 'R460 per adult per day (~$25)' },
    ],
    wildlife: [
      { name: 'Lion', probability: 'likely', notes: '~1,600 in park' },
      { name: 'Leopard', probability: 'possible', notes: 'Elusive but present' },
      { name: 'Elephant', probability: 'very-likely', notes: '~17,000 in park' },
      { name: 'Buffalo', probability: 'very-likely' },
      { name: 'Rhino', probability: 'likely', notes: 'Both black and white' },
      { name: 'Cheetah', probability: 'possible' },
      { name: 'Wild Dog', probability: 'possible' },
      { name: 'Hippo', probability: 'very-likely' },
      { name: 'Giraffe', probability: 'very-likely' },
      { name: 'Hyena', probability: 'very-likely' },
    ],
    signatureSpecies: ['Big Five', 'Self-drive safari', 'Diverse ecosystems'],
    seasons: [
      { name: 'Dry Season', months: 'May-September', conditions: 'Cool, dry, vegetation sparse', wildlife: 'Concentrated at water, easier to spot', crowds: 'high', recommended: true },
      { name: 'Wet Season', months: 'October-April', conditions: 'Hot, rainy, lush', wildlife: 'Dispersed but active, babies', crowds: 'moderate', recommended: true },
    ],
    bestTime: 'May-September for easier wildlife spotting; October-March for babies and birds',
    activities: [
      { name: 'Self-drive safari', available: true },
      { name: 'Guided game drives', available: true },
      { name: 'Walking safari', available: true, notes: 'Wilderness trails bookable' },
      { name: 'Night drives', available: true, notes: 'Bookable at rest camps' },
      { name: 'Hide viewing', available: true },
    ],
    highlights: ['Self-drive safari', 'Big Five', 'Diverse ecosystems', 'Affordable options'],
    bestFor: 'Self-drivers, first-time safari travelers, budget-conscious, families',
    tradeoffs: {
      gains: [
        'Self-drive makes it flexible and affordable',
        'Excellent Big Five chances',
        'Good infrastructure and facilities',
        'Multiple accommodation options',
      ],
      losses: [
        'Crowded at popular spots',
        'Large park requires time to explore',
        'Self-drive means no expert guide',
        'Malaria area',
      ],
    },
    accessInfo: 'Fly to Skukuza (in park), Hoedspruit, or Nelspruit; 5-hour drive from Johannesburg',
    typicalStay: '3-5 nights minimum to explore different areas',
    relatedParks: ['sabi-sands', 'timbavati', 'madikwe'],
  },

  'sabi-sands': {
    id: 'sabi-sands',
    name: 'Sabi Sands Game Reserve',
    destinationId: 'south-africa',
    type: 'reserve',
    ecosystem: 'savannah',
    tagline: 'The best leopard viewing in Africa',
    description: 'Sabi Sands is a private reserve sharing an unfenced border with Kruger. It\'s famous for the best leopard sightings in Africa, luxury lodges, and expert guides. Night drives and walking safaris are permitted, unlike in Kruger proper.',
    facts: [
      { label: 'Size', value: '65,000 hectares' },
      { label: 'Established', value: '1948' },
      { label: 'Lodges', value: '~50 lodges in reserve' },
      { label: 'Leopard Sightings', value: 'Daily sightings typical' },
      { label: 'Conservation Fees', value: 'Included in lodge rates' },
      { label: 'Vehicle Limit', value: '3 vehicles per sighting' },
    ],
    wildlife: [
      { name: 'Leopard', probability: 'very-likely', notes: 'Best in Africa - habituated individuals' },
      { name: 'Lion', probability: 'very-likely' },
      { name: 'Elephant', probability: 'very-likely' },
      { name: 'Buffalo', probability: 'very-likely' },
      { name: 'Rhino', probability: 'likely', notes: 'Both species' },
      { name: 'Cheetah', probability: 'possible' },
      { name: 'Wild Dog', probability: 'possible' },
      { name: 'Hippo', probability: 'very-likely' },
      { name: 'Hyena', probability: 'very-likely' },
    ],
    signatureSpecies: ['Habituated leopards', 'Big Five', 'Luxury safari'],
    seasons: [
      { name: 'Dry Season', months: 'May-September', conditions: 'Cool, sparse vegetation', wildlife: 'Concentrated, excellent viewing', crowds: 'high', recommended: true },
      { name: 'Wet Season', months: 'October-April', conditions: 'Hot, lush', wildlife: 'Active, babies, birds', crowds: 'moderate', recommended: true },
    ],
    bestTime: 'Year-round excellent; May-September for easier spotting',
    activities: [
      { name: 'Game drives', available: true },
      { name: 'Walking safari', available: true },
      { name: 'Night drives', available: true },
      { name: 'Bush dining', available: true },
      { name: 'Photography hides', available: true, notes: 'At some lodges' },
    ],
    highlights: ['Leopard sightings', 'Luxury lodges', 'Night drives', 'Walking safaris'],
    bestFor: 'Leopard enthusiasts, luxury seekers, photographers, honeymoons',
    tradeoffs: {
      gains: [
        'Best leopard viewing in Africa',
        'Night drives and walking permitted',
        'Luxury lodge experience',
        'Expert guides and trackers',
      ],
      losses: [
        'Expensive',
        'Less wild feeling than remote parks',
        'Multiple lodges in relatively small area',
        'Traverse rights can limit exploration',
      ],
    },
    accessInfo: 'Fly to Skukuza or lodge airstrips; 5-hour drive from Johannesburg',
    typicalStay: '2-3 nights, often combined with Kruger or Cape Town',
    relatedParks: ['kruger', 'timbavati', 'madikwe'],
  },

  // ============ RWANDA ============
  'volcanoes-np': {
    id: 'volcanoes-np',
    name: 'Volcanoes National Park',
    destinationId: 'rwanda',
    type: 'national-park',
    ecosystem: 'mountains',
    tagline: 'Home of the mountain gorillas',
    description: 'Volcanoes National Park protects the Rwandan side of the Virunga Mountains, home to about half the world\'s mountain gorillas. This is the setting of Dian Fossey\'s famous research. Gorilla permits are limited and experiences are life-changing.',
    facts: [
      { label: 'Size', value: '160 km²' },
      { label: 'Established', value: '1925' },
      { label: 'Elevation', value: '2,400-4,507 m' },
      { label: 'Gorilla Groups', value: '12 habituated groups for tourism' },
      { label: 'Gorilla Permit', value: '$1,500 per person' },
      { label: 'Golden Monkey Permit', value: '$100 per person' },
    ],
    wildlife: [
      { name: 'Mountain Gorilla', probability: 'guaranteed', notes: 'With permit, 1 hour viewing' },
      { name: 'Golden Monkey', probability: 'guaranteed', notes: 'Separate tracking available' },
      { name: 'Forest Elephant', probability: 'rare', notes: 'Shy and elusive' },
      { name: 'Buffalo', probability: 'possible' },
      { name: 'Spotted Hyena', probability: 'rare' },
      { name: 'Various Primates', probability: 'likely' },
      { name: 'Endemic Birds', probability: 'likely' },
    ],
    signatureSpecies: ['Mountain gorillas', 'Golden monkeys', 'Virunga Volcanoes'],
    seasons: [
      { name: 'Dry Season', months: 'June-September', conditions: 'Drier, trails less muddy', wildlife: 'Easier trekking', crowds: 'high', recommended: true },
      { name: 'Short Dry', months: 'December-February', conditions: 'Dry, clear', wildlife: 'Good trekking', crowds: 'moderate', recommended: true },
      { name: 'Long Rains', months: 'March-May', conditions: 'Heavy rain, muddy trails', wildlife: 'Challenging but fewer people', crowds: 'low', recommended: false },
      { name: 'Short Rains', months: 'October-November', conditions: 'Light rain', wildlife: 'Reasonable trekking', crowds: 'moderate', recommended: true },
    ],
    bestTime: 'June-September and December-February for drier conditions',
    activities: [
      { name: 'Gorilla trekking', available: true, notes: 'Permit required, 1-8 hours trek' },
      { name: 'Golden monkey trekking', available: true },
      { name: 'Dian Fossey grave trek', available: true },
      { name: 'Volcano hiking', available: true, notes: 'Mt. Bisoke, Karisimbi' },
      { name: 'Cultural experiences', available: true },
    ],
    highlights: ['Mountain gorillas', 'Golden monkeys', 'Volcanic peaks', 'Dian Fossey legacy'],
    bestFor: 'Gorilla seekers, primate lovers, adventure trekkers',
    tradeoffs: {
      gains: [
        'Life-changing gorilla experience',
        'Well-organized permit system',
        'Supports conservation directly',
        'Easy to combine with other Rwanda attractions',
      ],
      losses: [
        'Expensive permit ($1,500)',
        'Physically demanding trek',
        'Limited to 1-hour gorilla viewing',
        'Weather can be challenging',
      ],
    },
    accessInfo: '2-hour drive from Kigali to Musanze/Kinigi park headquarters',
    typicalStay: '2-3 nights (1-2 treks)',
    relatedParks: ['bwindi', 'nyungwe', 'akagera'],
  },

  // ============ UGANDA ============
  'bwindi': {
    id: 'bwindi',
    name: 'Bwindi Impenetrable Forest',
    destinationId: 'uganda',
    type: 'national-park',
    ecosystem: 'forest',
    tagline: 'Africa\'s ancient rainforest and gorilla sanctuary',
    description: 'Bwindi is one of Africa\'s oldest rainforests and home to roughly half the world\'s mountain gorillas. The "impenetrable" forest offers challenging but rewarding gorilla trekking, plus exceptional birding with 350+ species.',
    facts: [
      { label: 'Size', value: '331 km²' },
      { label: 'Established', value: '1991' },
      { label: 'UNESCO Status', value: 'World Heritage Site since 1994' },
      { label: 'Gorilla Population', value: '~459 (half of world population)' },
      { label: 'Gorilla Groups', value: '19+ habituated groups' },
      { label: 'Gorilla Permit', value: '$800 per person' },
    ],
    wildlife: [
      { name: 'Mountain Gorilla', probability: 'guaranteed', notes: 'With permit' },
      { name: 'Chimpanzee', probability: 'rare', notes: 'Present but rarely seen' },
      { name: 'L\'Hoest\'s Monkey', probability: 'likely' },
      { name: 'Red-tailed Monkey', probability: 'likely' },
      { name: 'Black-and-White Colobus', probability: 'likely' },
      { name: 'Forest Elephant', probability: 'rare' },
      { name: 'Birds (350+ species)', probability: 'guaranteed', notes: '23 Albertine Rift endemics' },
    ],
    signatureSpecies: ['Mountain gorillas', 'Albertine Rift endemics', 'Forest primates'],
    seasons: [
      { name: 'Dry Season', months: 'June-August', conditions: 'Drier, easier trails', wildlife: 'Best trekking conditions', crowds: 'high', recommended: true },
      { name: 'Short Dry', months: 'December-February', conditions: 'Drier period', wildlife: 'Good trekking', crowds: 'moderate', recommended: true },
      { name: 'Wet Season', months: 'March-May, September-November', conditions: 'Rain, muddy trails', wildlife: 'Challenging but fewer people', crowds: 'low', recommended: false },
    ],
    bestTime: 'June-August and December-February for drier trails',
    activities: [
      { name: 'Gorilla trekking', available: true, notes: '1-6 hours trek' },
      { name: 'Gorilla habituation', available: true, notes: '4 hours with researchers, $1,500' },
      { name: 'Birding walks', available: true },
      { name: 'Forest walks', available: true },
      { name: 'Batwa cultural experience', available: true },
    ],
    highlights: ['Mountain gorillas', 'Ancient rainforest', 'Birding', 'Batwa pygmy culture'],
    bestFor: 'Gorilla seekers, birders, cultural enthusiasts, budget gorilla experience',
    tradeoffs: {
      gains: [
        'Lower permit cost than Rwanda ($800 vs $1,500)',
        'More gorilla groups available',
        'Habituation experience available',
        'Excellent birding',
      ],
      losses: [
        'More challenging terrain than Volcanoes',
        'Longer travel from Kampala (8-10 hours)',
        'Basic infrastructure in some areas',
        'Physically demanding treks',
      ],
    },
    accessInfo: 'Fly to Kihihi/Kisoro airstrips or 8-10 hour drive from Kampala',
    typicalStay: '2-3 nights',
    relatedParks: ['volcanoes-np', 'kibale', 'queen-elizabeth'],
  },

  // ============ ZAMBIA ============
  'south-luangwa': {
    id: 'south-luangwa',
    name: 'South Luangwa National Park',
    destinationId: 'zambia',
    type: 'national-park',
    ecosystem: 'savannah',
    tagline: 'Birthplace of the walking safari',
    description: 'South Luangwa pioneered the walking safari concept in the 1950s. The Luangwa River supports exceptional wildlife density, with renowned leopard sightings and one of Africa\'s largest wild dog populations. Night drives reveal a different Africa.',
    facts: [
      { label: 'Size', value: '9,050 km²' },
      { label: 'Established', value: '1972' },
      { label: 'Walking Safari Origin', value: '1950s, pioneered by Norman Carr' },
      { label: 'Leopard Population', value: 'One of Africa\'s densest' },
      { label: 'Wild Dog Population', value: '~450 in ecosystem' },
      { label: 'Park Fees', value: '$25 per person per day' },
    ],
    wildlife: [
      { name: 'Leopard', probability: 'very-likely', notes: 'Excellent sightings, often on night drives' },
      { name: 'Lion', probability: 'very-likely' },
      { name: 'Wild Dog', probability: 'likely', notes: 'Large population' },
      { name: 'Elephant', probability: 'guaranteed' },
      { name: 'Buffalo', probability: 'guaranteed' },
      { name: 'Hippo', probability: 'guaranteed' },
      { name: 'Thornicroft\'s Giraffe', probability: 'guaranteed', notes: 'Endemic subspecies' },
      { name: 'Cookson\'s Wildebeest', probability: 'likely', notes: 'Endemic subspecies' },
      { name: 'Carmine Bee-eater', probability: 'very-likely', notes: 'Breeding colonies Sep-Nov' },
    ],
    signatureSpecies: ['Walking safaris', 'Leopards', 'Wild dogs', 'Endemic species'],
    seasons: [
      { name: 'Dry Season', months: 'May-October', conditions: 'Dry, wildlife concentrated', wildlife: 'Peak viewing, concentrated at river', crowds: 'high', recommended: true },
      { name: 'Emerald Season', months: 'November-April', conditions: 'Green, some camps close', wildlife: 'Babies, birds, fewer tourists', crowds: 'low', recommended: true },
    ],
    bestTime: 'July-October for peak wildlife; September-October for carmine bee-eaters',
    activities: [
      { name: 'Walking safari', available: true, notes: 'The original and best' },
      { name: 'Game drives', available: true },
      { name: 'Night drives', available: true },
      { name: 'Hide viewing', available: true },
      { name: 'Photography', available: true },
    ],
    highlights: ['Walking safaris', 'Leopard sightings', 'Wild dogs', 'Night drives'],
    bestFor: 'Walking safari enthusiasts, leopard seekers, authentic Africa experience',
    tradeoffs: {
      gains: [
        'Best walking safaris in Africa',
        'Excellent leopard and wild dog sightings',
        'Night drives reveal nocturnal wildlife',
        'Authentic, less commercialized',
      ],
      losses: [
        'Remote, long journey to reach',
        'Many camps close in wet season',
        'No rhino',
        'Can be extremely hot Oct-Nov',
      ],
    },
    accessInfo: 'Fly from Lusaka to Mfuwe (1.5 hours)',
    typicalStay: '3-4 nights',
    relatedParks: ['lower-zambezi', 'kafue', 'mana-pools'],
  },

  // ============ NAMIBIA ============
  'etosha': {
    id: 'etosha',
    name: 'Etosha National Park',
    destinationId: 'namibia',
    type: 'national-park',
    ecosystem: 'savannah',
    tagline: 'Waterhole wildlife watching in stark beauty',
    description: 'Etosha centers on a vast salt pan visible from space. During dry season, wildlife congregates at waterholes, creating exceptional viewing opportunities. The park is one of the few in Africa where self-drive safari works brilliantly.',
    facts: [
      { label: 'Size', value: '22,270 km²' },
      { label: 'Etosha Pan', value: '4,760 km² salt pan' },
      { label: 'Established', value: '1907' },
      { label: 'Rest Camps', value: '5 main camps with waterholes' },
      { label: 'Park Fees', value: 'N$150 per adult per day (~$8)' },
      { label: 'Waterholes', value: '30+ natural and artificial' },
    ],
    wildlife: [
      { name: 'Lion', probability: 'very-likely' },
      { name: 'Leopard', probability: 'possible' },
      { name: 'Elephant', probability: 'guaranteed' },
      { name: 'Black Rhino', probability: 'likely', notes: 'One of Africa\'s best populations' },
      { name: 'White Rhino', probability: 'likely' },
      { name: 'Giraffe', probability: 'guaranteed' },
      { name: 'Zebra', probability: 'guaranteed' },
      { name: 'Springbok', probability: 'guaranteed', notes: 'Thousands' },
      { name: 'Oryx (Gemsbok)', probability: 'guaranteed' },
      { name: 'Cheetah', probability: 'likely' },
      { name: 'Black-faced Impala', probability: 'guaranteed', notes: 'Endemic subspecies' },
    ],
    signatureSpecies: ['Black rhino', 'Waterhole game viewing', 'Desert-adapted species'],
    seasons: [
      { name: 'Dry Season', months: 'May-October', conditions: 'Dry, cool, excellent visibility', wildlife: 'Concentrated at waterholes', crowds: 'high', recommended: true },
      { name: 'Wet Season', months: 'November-April', conditions: 'Hot, some rain', wildlife: 'Dispersed, flamingos on pan', crowds: 'low', recommended: false },
    ],
    bestTime: 'July-October for peak waterhole activity',
    activities: [
      { name: 'Self-drive safari', available: true },
      { name: 'Guided game drives', available: true },
      { name: 'Night drives', available: true, notes: 'At some camps' },
      { name: 'Waterhole viewing', available: true, notes: 'Floodlit at night' },
    ],
    highlights: ['Waterhole game viewing', 'Self-drive', 'Black rhino', 'Salt pan landscapes'],
    bestFor: 'Self-drivers, photographers, rhino seekers, those on Namibia circuits',
    tradeoffs: {
      gains: [
        'Excellent self-drive infrastructure',
        'Unique waterhole viewing',
        'Good black rhino sightings',
        'Affordable compared to many parks',
      ],
      losses: [
        'Less intimate than private reserves',
        'Waterholes can be crowded',
        'Limited walking/night activities',
        'Long driving distances',
      ],
    },
    accessInfo: 'Drive from Windhoek (4-5 hours) or fly to park airstrips',
    typicalStay: '2-3 nights, moving between camps',
    relatedParks: ['sossusvlei', 'damaraland', 'skeleton-coast'],
  },
};

/**
 * Get all parks
 */
export function getAllParks(): GamePark[] {
  return Object.values(PARKS);
}

/**
 * Get park by ID
 */
export function getParkById(id: string): GamePark | undefined {
  return PARKS[id];
}

/**
 * Get parks by destination
 */
export function getParksByDestination(destinationId: string): GamePark[] {
  return Object.values(PARKS).filter(park => park.destinationId === destinationId);
}

/**
 * Get all park IDs for static generation
 */
export function getAllParkIds(): string[] {
  return Object.keys(PARKS);
}

/**
 * Format park type for display
 */
export function formatParkType(type: ParkType): string {
  const typeMap: Record<ParkType, string> = {
    'national-park': 'National Park',
    'reserve': 'Game Reserve',
    'conservancy': 'Conservancy',
    'conservation-area': 'Conservation Area',
  };
  return typeMap[type];
}

/**
 * Get probability display
 */
export function getProbabilityDisplay(probability: WildlifeSpecies['probability']): { label: string; color: string } {
  const displayMap: Record<WildlifeSpecies['probability'], { label: string; color: string }> = {
    'guaranteed': { label: 'Guaranteed', color: 'text-green-700 bg-green-50' },
    'very-likely': { label: 'Very Likely', color: 'text-green-600 bg-green-50' },
    'likely': { label: 'Likely', color: 'text-amber-700 bg-amber-50' },
    'possible': { label: 'Possible', color: 'text-stone-600 bg-stone-100' },
    'rare': { label: 'Rare', color: 'text-stone-500 bg-stone-100' },
  };
  return displayMap[probability];
}
