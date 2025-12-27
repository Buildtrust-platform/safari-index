/**
 * Individual Destination Page
 *
 * Static, indexable page for each safari destination.
 * No Bedrock calls - purely deterministic content from inventory.
 *
 * Per governance:
 * - Documentary, operator-grade tone
 * - No hype or promotional language
 * - Honest about trade-offs and limitations
 * - Internal links to related trips and decisions
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  ChevronRight,
  ArrowRight,
  MapPin,
  Calendar,
  Plane,
  Sun,
  Cloud,
  ThermometerSun,
  Users,
  DollarSign,
  Globe,
  Compass,
  AlertTriangle,
  Route,
  FileText,
  Trees,
  Mountain,
} from 'lucide-react';
import { Navbar, Footer } from '../../components/layout';
import {
  ImageBand,
  ImageBandContent,
  getDestinationImage,
  ecosystemImages,
  getImagesByTag,
} from '../../components/visual';
import { SectionDivider } from '../../components/ui/Divider';
import {
  getAllTrips,
  formatDuration,
  formatCostBand,
  getComfortTierDisplay,
  type TripArchetype,
} from '../../content/trip-shapes/trips';
import {
  getItinerarySummaries,
  getAllItineraries,
  formatDurationBand,
  type ItinerarySummary,
} from '../../content/itineraries';
import { getActivityById } from '../../content/activities/activity-primitives';
import { Car, Waves, Footprints, Plane as PlaneIcon, Sparkles } from 'lucide-react';

/**
 * Ecosystem types for park images - matches EcosystemImage tags
 */
type EcosystemType = 'savannah' | 'delta' | 'forest' | 'desert' | 'mountains' | 'floodplain';

/**
 * Game parks/reserves data for each destination
 */
interface GamePark {
  id: string;
  name: string;
  type: 'national-park' | 'reserve' | 'conservancy' | 'conservation-area';
  ecosystem: EcosystemType;
  highlights: string[];
  bestFor: string;
}

/**
 * Park-to-activity mappings
 */
const PARK_ACTIVITIES: Record<string, string[]> = {
  // Tanzania
  'serengeti': ['game-drive', 'hot-air-balloon', 'walking-safari', 'fly-camping'],
  'ngorongoro': ['game-drive', 'walking-safari', 'cultural-visit'],
  'tarangire': ['game-drive', 'walking-safari', 'bird-watching'],
  'lake-manyara': ['game-drive', 'bird-watching', 'cultural-visit'],
  'ruaha': ['game-drive', 'walking-safari', 'fly-camping'],
  'nyerere-selous': ['boat-safari', 'walking-safari', 'game-drive', 'fishing'],
  'katavi': ['game-drive', 'walking-safari', 'fly-camping'],
  // Kenya
  'masai-mara': ['game-drive', 'hot-air-balloon', 'walking-safari', 'cultural-visit'],
  'amboseli': ['game-drive', 'bird-watching', 'cultural-visit'],
  'samburu': ['game-drive', 'walking-safari', 'cultural-visit'],
  'laikipia': ['walking-safari', 'horseback-safari', 'game-drive', 'night-drive'],
  'lake-nakuru': ['game-drive', 'bird-watching'],
  'tsavo': ['game-drive', 'walking-safari'],
  'mara-conservancies': ['game-drive', 'night-drive', 'walking-safari', 'cultural-visit'],
  // Botswana
  'okavango-delta': ['mokoro', 'boat-safari', 'walking-safari', 'game-drive', 'fly-camping'],
  'chobe': ['boat-safari', 'game-drive', 'photographic-hide'],
  'moremi': ['game-drive', 'mokoro', 'walking-safari'],
  'linyanti': ['game-drive', 'boat-safari', 'walking-safari'],
  'makgadikgadi': ['quad-biking', 'walking-safari', 'cultural-visit'],
  'central-kalahari': ['game-drive', 'walking-safari', 'cultural-visit'],
  // South Africa
  'kruger': ['game-drive', 'walking-safari', 'night-drive'],
  'sabi-sands': ['game-drive', 'walking-safari', 'night-drive', 'photographic-hide'],
  'timbavati': ['game-drive', 'walking-safari', 'night-drive'],
  'madikwe': ['game-drive', 'walking-safari', 'night-drive'],
  'phinda': ['game-drive', 'walking-safari', 'boat-safari'],
  'hluhluwe-imfolozi': ['game-drive', 'walking-safari'],
  // Rwanda
  'volcanoes-np': ['gorilla-trekking', 'golden-monkey-tracking', 'bird-watching'],
  'akagera': ['game-drive', 'boat-safari', 'bird-watching'],
  'nyungwe': ['chimp-tracking', 'bird-watching', 'walking-safari'],
  // Uganda
  'bwindi': ['gorilla-trekking', 'bird-watching', 'cultural-visit'],
  'kibale': ['chimp-tracking', 'bird-watching', 'walking-safari'],
  'queen-elizabeth': ['game-drive', 'boat-safari', 'chimp-tracking'],
  'murchison-falls': ['game-drive', 'boat-safari', 'fishing'],
  'mgahinga': ['gorilla-trekking', 'golden-monkey-tracking', 'bird-watching'],
  // Namibia
  'etosha': ['game-drive', 'photographic-hide'],
  'sossusvlei': ['quad-biking', 'hot-air-balloon', 'walking-safari'],
  'damaraland': ['game-drive', 'walking-safari', 'cultural-visit'],
  'skeleton-coast': ['scenic-helicopter', 'walking-safari'],
  'caprivi': ['boat-safari', 'game-drive', 'fishing', 'bird-watching'],
  'namibrand': ['walking-safari', 'quad-biking'],
  // Zambia
  'south-luangwa': ['walking-safari', 'game-drive', 'night-drive'],
  'lower-zambezi': ['canoe-safari', 'game-drive', 'fishing', 'walking-safari'],
  'kafue': ['game-drive', 'walking-safari', 'boat-safari'],
  'north-luangwa': ['walking-safari'],
  'victoria-falls': ['white-water-rafting', 'bungee-jumping', 'scenic-helicopter', 'kayaking'],
};

const GAME_PARKS: Record<string, GamePark[]> = {
  tanzania: [
    { id: 'serengeti', name: 'Serengeti National Park', type: 'national-park', ecosystem: 'savannah', highlights: ['Great Migration', 'Big cats', 'Endless plains'], bestFor: 'Migration and predator action' },
    { id: 'ngorongoro', name: 'Ngorongoro Conservation Area', type: 'conservation-area', ecosystem: 'savannah', highlights: ['Crater ecosystem', 'High wildlife density', 'Black rhino'], bestFor: 'Big Five in one day' },
    { id: 'tarangire', name: 'Tarangire National Park', type: 'national-park', ecosystem: 'savannah', highlights: ['Elephant herds', 'Baobab trees', 'Bird diversity'], bestFor: 'Elephants and photography' },
    { id: 'lake-manyara', name: 'Lake Manyara National Park', type: 'national-park', ecosystem: 'savannah', highlights: ['Tree-climbing lions', 'Flamingos', 'Rift Valley views'], bestFor: 'Short visits and birding' },
    { id: 'ruaha', name: 'Ruaha National Park', type: 'national-park', ecosystem: 'savannah', highlights: ['Remote wilderness', 'Large elephant population', 'Wild dogs'], bestFor: 'Off-the-beaten-path experience' },
    { id: 'nyerere-selous', name: 'Nyerere National Park (Selous)', type: 'national-park', ecosystem: 'delta', highlights: ['Boat safaris', 'Walking safaris', 'Wild dogs'], bestFor: 'Water-based safari' },
    { id: 'katavi', name: 'Katavi National Park', type: 'national-park', ecosystem: 'floodplain', highlights: ['Remote', 'Hippo pools', 'Buffalo herds'], bestFor: 'True wilderness experience' },
  ],
  kenya: [
    { id: 'masai-mara', name: 'Masai Mara National Reserve', type: 'reserve', ecosystem: 'savannah', highlights: ['Migration crossings', 'Big cats', 'Open savannah'], bestFor: 'Wildebeest river crossings' },
    { id: 'amboseli', name: 'Amboseli National Park', type: 'national-park', ecosystem: 'savannah', highlights: ['Kilimanjaro views', 'Elephant herds', 'Swamps'], bestFor: 'Elephants with mountain backdrop' },
    { id: 'samburu', name: 'Samburu National Reserve', type: 'reserve', ecosystem: 'savannah', highlights: ['Samburu Special Five', 'Ewaso Nyiro River', 'Reticulated giraffe'], bestFor: 'Unique northern species' },
    { id: 'laikipia', name: 'Laikipia Plateau', type: 'conservancy', ecosystem: 'savannah', highlights: ['Private conservancies', 'Rhino sanctuaries', 'Walking safaris'], bestFor: 'Exclusive experiences' },
    { id: 'lake-nakuru', name: 'Lake Nakuru National Park', type: 'national-park', ecosystem: 'savannah', highlights: ['Rhino sanctuary', 'Flamingos', 'Leopards'], bestFor: 'Rhino sightings' },
    { id: 'tsavo', name: 'Tsavo East & West', type: 'national-park', ecosystem: 'savannah', highlights: ['Red elephants', 'Vast wilderness', 'Mzima Springs'], bestFor: 'Classic Kenya safari' },
    { id: 'mara-conservancies', name: 'Mara Conservancies', type: 'conservancy', ecosystem: 'savannah', highlights: ['Low vehicle density', 'Night drives', 'Walking'], bestFor: 'Exclusive Mara experience' },
  ],
  botswana: [
    { id: 'okavango-delta', name: 'Okavango Delta', type: 'reserve', ecosystem: 'delta', highlights: ['Mokoro safaris', 'Island hopping', 'Water-based wildlife'], bestFor: 'Unique water safari' },
    { id: 'chobe', name: 'Chobe National Park', type: 'national-park', ecosystem: 'delta', highlights: ['Highest elephant density', 'River cruises', 'Four distinct ecosystems'], bestFor: 'Elephant encounters' },
    { id: 'moremi', name: 'Moremi Game Reserve', type: 'reserve', ecosystem: 'delta', highlights: ['Predator sightings', 'Delta and dry land', 'Wild dogs'], bestFor: 'All-round wildlife' },
    { id: 'linyanti', name: 'Linyanti Reserve', type: 'reserve', ecosystem: 'floodplain', highlights: ['Private concession', 'Elephant migration', 'Predators'], bestFor: 'Exclusive elephant viewing' },
    { id: 'makgadikgadi', name: 'Makgadikgadi Pans', type: 'national-park', ecosystem: 'floodplain', highlights: ['Salt pans', 'Meerkats', 'Zebra migration'], bestFor: 'Surreal landscapes' },
    { id: 'central-kalahari', name: 'Central Kalahari Game Reserve', type: 'reserve', ecosystem: 'desert', highlights: ['Black-maned lions', 'Remote camps', 'San culture'], bestFor: 'Desert safari' },
  ],
  'south-africa': [
    { id: 'kruger', name: 'Kruger National Park', type: 'national-park', ecosystem: 'savannah', highlights: ['Self-drive safari', 'Big Five', 'Diverse ecosystems'], bestFor: 'Accessible Big Five' },
    { id: 'sabi-sands', name: 'Sabi Sands Game Reserve', type: 'reserve', ecosystem: 'savannah', highlights: ['Leopard sightings', 'Luxury lodges', 'No fences to Kruger'], bestFor: 'Best leopard viewing in Africa' },
    { id: 'timbavati', name: 'Timbavati Private Reserve', type: 'reserve', ecosystem: 'savannah', highlights: ['White lions', 'Private traversing', 'Walking safaris'], bestFor: 'Exclusive Kruger experience' },
    { id: 'madikwe', name: 'Madikwe Game Reserve', type: 'reserve', ecosystem: 'savannah', highlights: ['Malaria-free', 'Wild dogs', 'Family-friendly'], bestFor: 'Malaria-free safari' },
    { id: 'phinda', name: 'Phinda Private Game Reserve', type: 'reserve', ecosystem: 'savannah', highlights: ['Seven ecosystems', 'Cheetah', 'Conservation'], bestFor: 'Diverse habitats' },
    { id: 'hluhluwe-imfolozi', name: 'Hluhluwe-iMfolozi Park', type: 'national-park', ecosystem: 'savannah', highlights: ['Rhino conservation', 'Oldest reserve in Africa', 'Walking trails'], bestFor: 'Rhino heritage' },
  ],
  rwanda: [
    { id: 'volcanoes-np', name: 'Volcanoes National Park', type: 'national-park', ecosystem: 'mountains', highlights: ['Mountain gorillas', 'Golden monkeys', 'Volcanic peaks'], bestFor: 'Gorilla trekking' },
    { id: 'akagera', name: 'Akagera National Park', type: 'national-park', ecosystem: 'savannah', highlights: ['Big Five', 'Lakes and wetlands', 'Reintroduced lions'], bestFor: 'Savannah safari in Rwanda' },
    { id: 'nyungwe', name: 'Nyungwe Forest National Park', type: 'national-park', ecosystem: 'forest', highlights: ['Chimpanzees', 'Canopy walkway', '13 primate species'], bestFor: 'Rainforest primates' },
  ],
  uganda: [
    { id: 'bwindi', name: 'Bwindi Impenetrable Forest', type: 'national-park', ecosystem: 'forest', highlights: ['Mountain gorillas', 'Ancient rainforest', 'Bird diversity'], bestFor: 'Gorilla trekking' },
    { id: 'kibale', name: 'Kibale Forest National Park', type: 'national-park', ecosystem: 'forest', highlights: ['Chimpanzees', '13 primate species', 'Habituation experience'], bestFor: 'Chimpanzee tracking' },
    { id: 'queen-elizabeth', name: 'Queen Elizabeth National Park', type: 'national-park', ecosystem: 'savannah', highlights: ['Tree-climbing lions', 'Kazinga Channel', 'Diverse habitats'], bestFor: 'Classic Uganda safari' },
    { id: 'murchison-falls', name: 'Murchison Falls National Park', type: 'national-park', ecosystem: 'savannah', highlights: ['Powerful waterfall', 'Nile boat cruise', 'Rothschild giraffe'], bestFor: 'Dramatic landscapes' },
    { id: 'mgahinga', name: 'Mgahinga Gorilla National Park', type: 'national-park', ecosystem: 'mountains', highlights: ['Gorillas', 'Golden monkeys', 'Virunga Volcanoes'], bestFor: 'Less crowded gorilla experience' },
  ],
  namibia: [
    { id: 'etosha', name: 'Etosha National Park', type: 'national-park', ecosystem: 'savannah', highlights: ['Salt pan', 'Waterhole game viewing', 'Self-drive'], bestFor: 'Waterhole wildlife watching' },
    { id: 'sossusvlei', name: 'Sossusvlei', type: 'national-park', ecosystem: 'desert', highlights: ['Red dunes', 'Deadvlei', 'Desert landscapes'], bestFor: 'Iconic dune photography' },
    { id: 'damaraland', name: 'Damaraland', type: 'conservancy', ecosystem: 'desert', highlights: ['Desert elephants', 'Rock engravings', 'Stark beauty'], bestFor: 'Desert-adapted wildlife' },
    { id: 'skeleton-coast', name: 'Skeleton Coast', type: 'national-park', ecosystem: 'desert', highlights: ['Shipwrecks', 'Seal colonies', 'Remote wilderness'], bestFor: 'Dramatic coastal desert' },
    { id: 'caprivi', name: 'Caprivi Strip', type: 'reserve', ecosystem: 'delta', highlights: ['Waterways', 'Elephants', 'Birding'], bestFor: 'Water-based Namibia safari' },
    { id: 'namibrand', name: 'NamibRand Nature Reserve', type: 'reserve', ecosystem: 'desert', highlights: ['Dark sky reserve', 'Conservation', 'Exclusive'], bestFor: 'Stargazing and solitude' },
  ],
  zambia: [
    { id: 'south-luangwa', name: 'South Luangwa National Park', type: 'national-park', ecosystem: 'savannah', highlights: ['Walking safaris', 'Leopards', 'Wild dogs'], bestFor: 'Walking safari birthplace' },
    { id: 'lower-zambezi', name: 'Lower Zambezi National Park', type: 'national-park', ecosystem: 'delta', highlights: ['Canoe safaris', 'Elephants', 'Fishing'], bestFor: 'River-based safari' },
    { id: 'kafue', name: 'Kafue National Park', type: 'national-park', ecosystem: 'savannah', highlights: ['Remote wilderness', 'Cheetah', 'Large size'], bestFor: 'Off-grid experience' },
    { id: 'north-luangwa', name: 'North Luangwa National Park', type: 'national-park', ecosystem: 'savannah', highlights: ['Walking only', 'Buffalo herds', 'True wilderness'], bestFor: 'Serious walking safari' },
    { id: 'victoria-falls', name: 'Victoria Falls (Livingstone)', type: 'national-park', ecosystem: 'floodplain', highlights: ['World wonder', 'Activities hub', 'Devil\'s Pool'], bestFor: 'Iconic waterfall experience' },
  ],
};

/**
 * Destination data - extended version with full details
 */
const DESTINATIONS_DATA: Record<string, DestinationDetails> = {
  tanzania: {
    id: 'tanzania',
    name: 'Tanzania',
    region: 'East Africa',
    regionTag: 'tanzania',
    tagline: 'The birthplace of safari',
    description:
      'Tanzania offers the most complete safari experience in Africa. The Serengeti-Ngorongoro circuit is unmatched for wildlife density and diversity. The southern parks provide solitude. The coast adds beach options.',
    highlights: ['Serengeti National Park', 'Ngorongoro Crater', 'Great Migration', 'Southern Circuit', 'Zanzibar'],
    bestFor: ['First-time safari travelers', 'Migration seekers', 'Big Five photography', 'Crater landscapes'],
    notIdealFor: ['Budget travelers', 'Self-drive enthusiasts', 'Those avoiding long drives'],
    whenToGo: {
      peakSeason: 'June to October (dry season)',
      shoulderSeason: 'November and March-May',
      greenSeason: 'April-May (heavy rains)',
      migrationNotes: 'Migration reaches Serengeti December-July; Mara crossing July-October',
    },
    practicalInfo: {
      gateway: 'Kilimanjaro (JRO) or Dar es Salaam (DAR)',
      visaRequired: 'Yes, e-visa available',
      malariaRisk: 'High in most areas',
      languages: 'Swahili, English',
      currency: 'Tanzanian Shilling (TZS)',
    },
    costLevel: 'high',
    parkFees: 'Highest in East Africa ($70-80/day in northern parks)',
    tradeoffs: {
      gains: [
        'Unmatched wildlife density in Serengeti',
        'Ngorongoro Crater is a unique ecosystem',
        'Migration spectacle available',
        'Variety of ecosystems in one trip',
      ],
      losses: [
        'High park fees increase overall cost',
        'Popular circuits can be crowded',
        'Long driving distances between parks',
        'Limited self-drive options',
      ],
    },
  },
  kenya: {
    id: 'kenya',
    name: 'Kenya',
    region: 'East Africa',
    regionTag: 'kenya',
    tagline: 'Accessible and diverse',
    description:
      'Kenya pioneered modern safari tourism. The Masai Mara conservancy system offers excellent wildlife with lower crowds than national parks. Laikipia provides a different, intimate experience. Infrastructure is strong.',
    highlights: ['Masai Mara', 'Laikipia Plateau', 'Amboseli', 'Lake Nakuru', 'Samburu'],
    bestFor: ['Conservancy experiences', 'Migration river crossings', 'Mount Kilimanjaro views', 'Accessible safaris'],
    notIdealFor: ['Those avoiding crowds (main Mara)', 'Budget travelers in high season'],
    whenToGo: {
      peakSeason: 'July to October (dry, migration)',
      shoulderSeason: 'January-February, November-December',
      greenSeason: 'April-May (long rains)',
      migrationNotes: 'Mara river crossings typically July-October',
    },
    practicalInfo: {
      gateway: 'Nairobi (NBO)',
      visaRequired: 'Yes, e-visa available',
      malariaRisk: 'Variable by region',
      languages: 'Swahili, English',
      currency: 'Kenyan Shilling (KES)',
    },
    costLevel: 'medium-high',
    parkFees: 'Moderate ($60-80/day in Mara)',
    tradeoffs: {
      gains: [
        'Conservancy system means lower vehicle density',
        'Strong infrastructure and accessibility',
        'Excellent guiding standards',
        'Can combine with beach easily',
      ],
      losses: [
        'Main Mara reserve can be crowded',
        'Some areas over-commercialized',
        'Less variety than Tanzania in single trip',
      ],
    },
  },
  botswana: {
    id: 'botswana',
    name: 'Botswana',
    region: 'Southern Africa',
    regionTag: 'botswana',
    tagline: 'Water-based safari and exclusivity',
    description:
      'Botswana offers a premium, low-volume safari experience. The Okavango Delta is unique - safari by mokoro and boat. Chobe has the highest elephant density in Africa. The country limits tourism to preserve wilderness.',
    highlights: ['Okavango Delta', 'Chobe National Park', 'Moremi Game Reserve', 'Makgadikgadi Pans', 'Kalahari'],
    bestFor: ['Repeat safari travelers', 'Water-based experiences', 'Exclusivity seekers', 'Elephant enthusiasts'],
    notIdealFor: ['Budget travelers', 'Those wanting crowds-free guarantee everywhere', 'First-timers on tight budget'],
    whenToGo: {
      peakSeason: 'May to October (dry season)',
      shoulderSeason: 'November, April',
      greenSeason: 'December to March (floods and births)',
      migrationNotes: 'Zebra migration in Makgadikgadi Dec-April',
    },
    practicalInfo: {
      gateway: 'Maun (MUB) or Kasane (BBK)',
      visaRequired: 'No visa for most nationalities',
      malariaRisk: 'Moderate to high in Delta/Chobe',
      languages: 'English, Setswana',
      currency: 'Botswana Pula (BWP)',
    },
    costLevel: 'very-high',
    parkFees: 'Moderate, but camps are expensive',
    tradeoffs: {
      gains: [
        'Unique water-based safari experiences',
        'Low tourist density by design',
        'Exceptional elephant populations',
        'Premium camp quality',
      ],
      losses: [
        'Highest cost destination in Africa',
        'Less variety than East Africa',
        'Flooding affects access seasonally',
        'Limited budget options',
      ],
    },
  },
  'south-africa': {
    id: 'south-africa',
    name: 'South Africa',
    region: 'Southern Africa',
    regionTag: 'south-africa',
    tagline: 'Self-drive and malaria-free options',
    description:
      'South Africa offers the most accessible safari experience. Self-drive is viable in Kruger. Private reserves like Sabi Sands guarantee Big Five. Malaria-free options exist. Combines well with Cape Town.',
    highlights: ['Kruger National Park', 'Sabi Sands', 'Madikwe', 'Cape Town', 'Garden Route'],
    bestFor: ['Self-drive travelers', 'Families with young children', 'First-timers wanting ease', 'Cape Town combiners'],
    notIdealFor: ['Those seeking remote wilderness', 'Anti-fence purists'],
    whenToGo: {
      peakSeason: 'May to September (winter, dry)',
      shoulderSeason: 'October-November, April',
      greenSeason: 'December to March (summer rains)',
      migrationNotes: 'No major migration; consistent year-round',
    },
    practicalInfo: {
      gateway: 'Johannesburg (JNB) or Cape Town (CPT)',
      visaRequired: 'No for most nationalities',
      malariaRisk: 'Low to none in many areas',
      languages: 'English, Afrikaans, others',
      currency: 'South African Rand (ZAR)',
    },
    costLevel: 'medium',
    parkFees: 'Low ($25-30/day in Kruger)',
    tradeoffs: {
      gains: [
        'Self-drive makes it accessible and flexible',
        'Malaria-free options available',
        'World-class city experiences',
        'Good value compared to other destinations',
      ],
      losses: [
        'Fenced reserves feel less wild',
        'Popular areas can be busy',
        'Less variety of landscapes than East Africa',
      ],
    },
  },
  rwanda: {
    id: 'rwanda',
    name: 'Rwanda',
    region: 'East Africa',
    regionTag: 'uganda-rwanda',
    tagline: 'Mountain gorillas in comfort',
    description:
      'Rwanda is the most accessible gorilla destination. Volcanoes National Park is well-organized and close to Kigali. The experience is brief but profound. Can combine with savannah safari in Akagera.',
    highlights: ['Volcanoes National Park', 'Mountain Gorillas', 'Kigali', 'Akagera National Park'],
    bestFor: ['Gorilla trekking priority', 'Short trips with impact', 'Luxury gorilla lodges', 'Combiners from East Africa'],
    notIdealFor: ['Budget travelers', 'Those wanting extended savannah time', 'Those with altitude issues'],
    whenToGo: {
      peakSeason: 'June to September, December to February',
      shoulderSeason: 'October-November, March',
      greenSeason: 'April-May (heavy rains)',
      migrationNotes: 'Gorillas available year-round',
    },
    practicalInfo: {
      gateway: 'Kigali (KGL)',
      visaRequired: 'Visa on arrival or e-visa',
      malariaRisk: 'Low to moderate',
      languages: 'Kinyarwanda, English, French',
      currency: 'Rwandan Franc (RWF)',
    },
    costLevel: 'very-high',
    parkFees: 'Gorilla permits $1,500/person',
    tradeoffs: {
      gains: [
        'Most efficient gorilla experience',
        'Excellent infrastructure and safety',
        'Premium lodge options',
        'Can do in 3-4 days',
      ],
      losses: [
        'Extremely expensive permit cost',
        'Limited savannah wildlife',
        'Small country, less variety',
      ],
    },
  },
  uganda: {
    id: 'uganda',
    name: 'Uganda',
    region: 'East Africa',
    regionTag: 'uganda-rwanda',
    tagline: 'Gorillas and chimps at better value',
    description:
      'Uganda offers gorillas at half the permit cost of Rwanda. Bwindi is more remote but the experience is equally profound. Chimps in Kibale are excellent. Queen Elizabeth adds savannah options.',
    highlights: ['Bwindi Impenetrable Forest', 'Kibale Forest', 'Queen Elizabeth NP', 'Murchison Falls'],
    bestFor: ['Primate enthusiasts on budget', 'Chimp and gorilla combos', 'Adventure travelers', 'Longer itineraries'],
    notIdealFor: ['Time-limited travelers', 'Those wanting polished infrastructure', 'Purely savannah focus'],
    whenToGo: {
      peakSeason: 'June to September, December to February',
      shoulderSeason: 'October-November, March',
      greenSeason: 'April-May (heavy rains)',
      migrationNotes: 'Primates available year-round',
    },
    practicalInfo: {
      gateway: 'Entebbe (EBB)',
      visaRequired: 'Yes, e-visa available',
      malariaRisk: 'High throughout',
      languages: 'English, Swahili, Luganda',
      currency: 'Ugandan Shilling (UGX)',
    },
    costLevel: 'medium',
    parkFees: 'Gorilla permits $700/person',
    tradeoffs: {
      gains: [
        'Gorilla permits half the Rwanda cost',
        'Can see chimps and gorillas',
        'More diverse itineraries possible',
        'Authentic, less polished experience',
      ],
      losses: [
        'Longer drives than Rwanda',
        'Infrastructure less developed',
        'Bwindi access can be challenging',
      ],
    },
  },
  namibia: {
    id: 'namibia',
    name: 'Namibia',
    region: 'Southern Africa',
    regionTag: 'namibia',
    tagline: 'Desert landscapes and self-drive',
    description:
      'Namibia is unlike any other safari destination. The landscapes are the star - Sossusvlei dunes, Skeleton Coast, Damaraland. Self-drive is the norm. Wildlife is adapted to desert conditions.',
    highlights: ['Sossusvlei', 'Etosha National Park', 'Skeleton Coast', 'Damaraland', 'Himba Culture'],
    bestFor: ['Landscape photographers', 'Self-drive adventurers', 'Desert enthusiasts', 'Cultural interests'],
    notIdealFor: ['Big Five priority', 'Those avoiding long drives', 'Wet season visitors'],
    whenToGo: {
      peakSeason: 'May to October (dry, cooler)',
      shoulderSeason: 'November, April',
      greenSeason: 'December to March (hot, some rain)',
      migrationNotes: 'Desert wildlife year-round',
    },
    practicalInfo: {
      gateway: 'Windhoek (WDH)',
      visaRequired: 'No for most nationalities',
      malariaRisk: 'Low except northern Etosha',
      languages: 'English, Afrikaans, German',
      currency: 'Namibian Dollar (NAD)',
    },
    costLevel: 'medium',
    parkFees: 'Low ($10-15/day)',
    tradeoffs: {
      gains: [
        'Unmatched landscape photography',
        'Excellent self-drive infrastructure',
        'Low malaria risk overall',
        'Unique desert-adapted wildlife',
      ],
      losses: [
        'Wildlife density lower than East Africa',
        'Requires long driving days',
        'Harsh conditions in summer',
      ],
    },
  },
  zambia: {
    id: 'zambia',
    name: 'Zambia',
    region: 'Southern Africa',
    regionTag: 'zambia',
    tagline: 'Walking safari origins and Victoria Falls',
    description:
      'Zambia invented the walking safari. South Luangwa remains the best place for it. Victoria Falls adds drama. Lower Zambezi offers canoeing. The country attracts serious safari travelers.',
    highlights: ['South Luangwa', 'Victoria Falls', 'Lower Zambezi', 'Kafue National Park'],
    bestFor: ['Walking safari enthusiasts', 'Repeat safari travelers', 'Victoria Falls combiners', 'Purists'],
    notIdealFor: ['First-timers wanting guaranteed Big Five', 'Budget travelers', 'Self-drive preference'],
    whenToGo: {
      peakSeason: 'June to October (dry season)',
      shoulderSeason: 'May, November',
      greenSeason: 'December to April (many camps close)',
      migrationNotes: 'Bat migration in Kasanka Oct-Dec',
    },
    practicalInfo: {
      gateway: 'Lusaka (LUN) or Livingstone (LVI)',
      visaRequired: 'Yes, e-visa or KAZA UniVisa',
      malariaRisk: 'High throughout',
      languages: 'English',
      currency: 'Zambian Kwacha (ZMW)',
    },
    costLevel: 'high',
    parkFees: 'Moderate',
    tradeoffs: {
      gains: [
        'Best walking safari destination',
        'Victoria Falls combination',
        'Authentic, uncrowded experience',
        'Excellent guiding standards',
      ],
      losses: [
        'Limited infrastructure',
        'Many camps seasonal',
        'Less Big Five density than East Africa',
      ],
    },
  },
};

interface DestinationDetails {
  id: string;
  name: string;
  region: string;
  regionTag: string;
  tagline: string;
  description: string;
  highlights: string[];
  bestFor: string[];
  notIdealFor: string[];
  whenToGo: {
    peakSeason: string;
    shoulderSeason: string;
    greenSeason: string;
    migrationNotes: string;
  };
  practicalInfo: {
    gateway: string;
    visaRequired: string;
    malariaRisk: string;
    languages: string;
    currency: string;
  };
  costLevel: 'low' | 'medium' | 'medium-high' | 'high' | 'very-high';
  parkFees: string;
  tradeoffs: {
    gains: string[];
    losses: string[];
  };
}

/**
 * Generate static params for all destinations
 */
export async function generateStaticParams() {
  return Object.keys(DESTINATIONS_DATA).map((id) => ({ slug: id }));
}

/**
 * Generate metadata for each destination page
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = DESTINATIONS_DATA[slug];

  if (!destination) {
    return {
      title: 'Destination Not Found | Safari Index',
    };
  }

  return {
    title: `${destination.name} Safari Guide | Safari Index`,
    description: `${destination.description.slice(0, 155)}...`,
    robots: 'index, follow',
    alternates: {
      canonical: `/destinations/${destination.id}`,
    },
    openGraph: {
      title: `${destination.name} Safari Guide | Safari Index`,
      description: destination.tagline,
      type: 'article',
      url: `/destinations/${destination.id}`,
    },
  };
}

/**
 * Cost level display
 */
function getCostDisplay(level: string): { label: string; color: string } {
  switch (level) {
    case 'low':
      return { label: 'Budget-friendly', color: 'text-green-700' };
    case 'medium':
      return { label: 'Moderate', color: 'text-amber-700' };
    case 'medium-high':
      return { label: 'Above average', color: 'text-orange-700' };
    case 'high':
      return { label: 'Premium', color: 'text-red-700' };
    case 'very-high':
      return { label: 'Luxury tier', color: 'text-purple-700' };
    default:
      return { label: level, color: 'text-stone-700' };
  }
}

/**
 * Get trips for a destination
 */
function getTripsForDestination(regionTag: string): TripArchetype[] {
  const allTrips = getAllTrips();
  return allTrips.filter((trip) =>
    trip.regions.includes(regionTag as any)
  ).slice(0, 4);
}

/**
 * Get itineraries for a destination
 */
function getItinerariesForDestination(regionTag: string): ItinerarySummary[] {
  const allItineraries = getItinerarySummaries();
  return allItineraries.filter((itin) => itin.region === regionTag).slice(0, 3);
}

/**
 * Get ecosystem-based image for a park
 */
function getParkImage(park: GamePark) {
  const images = getImagesByTag(park.ecosystem);
  return images.length > 0 ? images[0] : ecosystemImages[0];
}

/**
 * Get trips that feature a specific park
 */
function getTripsForPark(parkName: string): TripArchetype[] {
  const allTrips = getAllTrips();
  const parkKeyword = parkName.toLowerCase().split(' ')[0]; // e.g., "Serengeti" from "Serengeti National Park"

  return allTrips.filter((trip) =>
    trip.core_parks_or_areas?.some((area) =>
      area.toLowerCase().includes(parkKeyword)
    )
  ).slice(0, 2);
}

/**
 * Get itineraries that feature a specific park
 */
function getItinerariesForPark(parkName: string): ItinerarySummary[] {
  const allItineraries = getAllItineraries();
  const parkKeyword = parkName.toLowerCase().split(' ')[0];

  return allItineraries.filter((itin) =>
    itin.core_segments?.some((seg) =>
      seg.title.toLowerCase().includes(parkKeyword)
    )
  ).slice(0, 2);
}

/**
 * Get activity icon by activity ID
 */
function getActivityIcon(activityId: string) {
  switch (activityId) {
    case 'game-drive':
    case 'night-drive':
      return <Car className="w-3.5 h-3.5" />;
    case 'mokoro':
    case 'boat-safari':
    case 'canoe-safari':
    case 'fishing':
    case 'kayaking':
      return <Waves className="w-3.5 h-3.5" />;
    case 'walking-safari':
    case 'gorilla-trekking':
    case 'chimp-tracking':
    case 'golden-monkey-tracking':
      return <Footprints className="w-3.5 h-3.5" />;
    case 'hot-air-balloon':
    case 'scenic-helicopter':
      return <PlaneIcon className="w-3.5 h-3.5" />;
    default:
      return <Sparkles className="w-3.5 h-3.5" />;
  }
}

/**
 * Format activity ID to display name
 */
function formatActivityName(activityId: string): string {
  return activityId
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Trip card component - Visual card with image header
 */
function TripCard({ trip }: { trip: TripArchetype }) {
  const destImage = getDestinationImage(trip.regions[0] === 'east-africa' ? 'tanzania' : trip.regions[0]);

  return (
    <Link
      href={`/trips/${trip.id}`}
      className="group block bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-amber-300 hover:shadow-lg transition-all"
    >
      {/* Image header */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={destImage.src}
          alt={destImage.alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-white/90 backdrop-blur-sm text-stone-700 rounded-full">
              <Route className="w-3 h-3" />
              Trip Shape
            </span>
            <span className="text-xs text-white/80">{getComfortTierDisplay(trip.comfort_tier)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="font-editorial text-base font-semibold text-stone-900 group-hover:text-amber-700 transition-colors mb-1">
          {trip.title}
        </h4>
        <p className="text-stone-500 text-sm line-clamp-2 mb-3">{trip.subtitle}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDuration(trip.duration_days)}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              {formatCostBand(trip.cost_band)}
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  );
}

/**
 * Itinerary card component - Visual card with image header
 */
function ItineraryCard({ itinerary }: { itinerary: ItinerarySummary }) {
  const destImage = getDestinationImage(itinerary.region);

  return (
    <Link
      href={`/itineraries/${itinerary.slug}`}
      className="group block bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-amber-300 hover:shadow-lg transition-all"
    >
      {/* Image header */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={destImage.src}
          alt={destImage.alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-white/90 backdrop-blur-sm text-stone-700 rounded-full">
              <FileText className="w-3 h-3" />
              Day-by-Day
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="font-editorial text-base font-semibold text-stone-900 group-hover:text-amber-700 transition-colors mb-1">
          {itinerary.title}
        </h4>
        <p className="text-stone-500 text-sm line-clamp-2 mb-3">{itinerary.subtitle}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDurationBand(itinerary.duration_band)}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              {formatCostBand(itinerary.cost_band)}
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  );
}

/**
 * Game park card component - Enhanced with image, activities, trips/itineraries
 */
function GameParkCard({ park }: { park: GamePark }) {
  const parkImage = getParkImage(park);
  const activities = PARK_ACTIVITIES[park.id] || [];
  const trips = getTripsForPark(park.name);
  const itineraries = getItinerariesForPark(park.name);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'national-park': return 'National Park';
      case 'reserve': return 'Game Reserve';
      case 'conservancy': return 'Conservancy';
      case 'conservation-area': return 'Conservation Area';
      default: return type;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-amber-300 hover:shadow-lg transition-all">
      {/* Image header */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={parkImage.src}
          alt={parkImage.alt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium bg-white/90 backdrop-blur-sm text-stone-700 rounded-full">
            <Mountain className="w-3 h-3" />
            {getTypeLabel(park.type)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="font-editorial text-base font-semibold text-stone-900 mb-1">
          {park.name}
        </h4>
        <p className="text-stone-500 text-sm mb-3">{park.bestFor}</p>

        {/* Highlights */}
        <div className="flex flex-wrap gap-1 mb-3">
          {park.highlights.slice(0, 3).map((highlight) => (
            <span
              key={highlight}
              className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs rounded-full"
            >
              {highlight}
            </span>
          ))}
        </div>

        {/* Activities row */}
        {activities.length > 0 && (
          <div className="pt-3 border-t border-stone-100">
            <p className="text-xs text-stone-400 mb-2">Activities</p>
            <div className="flex flex-wrap gap-1.5">
              {activities.slice(0, 4).map((actId) => (
                <Link
                  key={actId}
                  href={`/activities/${actId}`}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-md text-xs hover:bg-amber-100 transition-colors"
                  title={formatActivityName(actId)}
                >
                  {getActivityIcon(actId)}
                  <span className="hidden sm:inline">{formatActivityName(actId)}</span>
                </Link>
              ))}
              {activities.length > 4 && (
                <span className="px-2 py-1 text-xs text-stone-400">
                  +{activities.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Featured in row */}
        {(trips.length > 0 || itineraries.length > 0) && (
          <div className="pt-3 mt-3 border-t border-stone-100">
            <p className="text-xs text-stone-400 mb-2">Featured in</p>
            <div className="flex flex-wrap gap-2">
              {trips.slice(0, 1).map((trip) => (
                <Link
                  key={trip.id}
                  href={`/trips/${trip.id}`}
                  className="inline-flex items-center gap-1 text-xs text-stone-600 hover:text-amber-700 transition-colors"
                >
                  <Route className="w-3 h-3" />
                  <span className="truncate max-w-[150px]">{trip.title}</span>
                </Link>
              ))}
              {itineraries.slice(0, 1).map((itin) => (
                <Link
                  key={itin.slug}
                  href={`/itineraries/${itin.slug}`}
                  className="inline-flex items-center gap-1 text-xs text-stone-600 hover:text-amber-700 transition-colors"
                >
                  <FileText className="w-3 h-3" />
                  <span className="truncate max-w-[150px]">{itin.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = DESTINATIONS_DATA[slug];

  if (!destination) {
    notFound();
  }

  const destImage = getDestinationImage(destination.id);
  const costDisplay = getCostDisplay(destination.costLevel);
  const trips = getTripsForDestination(destination.regionTag);
  const itineraries = getItinerariesForDestination(destination.regionTag);
  const gameParks = GAME_PARKS[destination.id] || [];

  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar variant="transparent" />

      {/* Hero */}
      <ImageBand
        image={destImage}
        height="compare"
        overlay="strong"
        align="center"
        priority
        alwaysRender
      >
        <ImageBandContent maxWidth="narrow" className="pt-24 pb-8">
          <div className="text-center">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-white/60 text-sm mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                Safari Index
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/destinations" className="hover:text-white transition-colors">
                Destinations
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{destination.name}</span>
            </div>

            {/* Region badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white/80 bg-white/10 rounded-full mb-4">
              <Globe className="w-3 h-3" />
              {destination.region}
            </span>

            {/* Title */}
            <h1 className="font-editorial text-4xl md:text-5xl font-semibold text-white mb-3">
              {destination.name}
            </h1>

            {/* Tagline */}
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              {destination.tagline}
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 mt-6 text-white/60 text-sm">
              <span>{gameParks.length} parks and reserves</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>{trips.length + itineraries.length} trip options</span>
            </div>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        {/* Overview */}
        <section className="mb-8">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
            <p className="text-stone-700 leading-relaxed text-lg">
              {destination.description}
            </p>
          </div>
        </section>

        {/* Highlights */}
        <section className="mb-8">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-4">
            Highlights
          </h2>
          <div className="flex flex-wrap gap-2">
            {destination.highlights.map((highlight) => (
              <span
                key={highlight}
                className="px-3 py-1.5 bg-amber-100 text-amber-800 text-sm rounded-full font-medium"
              >
                {highlight}
              </span>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* Game Parks Section */}
        {gameParks.length > 0 && (
          <section className="my-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Trees className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h2 className="font-editorial text-2xl font-semibold text-stone-900">
                  Parks and Reserves
                </h2>
                <p className="text-stone-500 text-sm">{gameParks.length} protected areas in {destination.name}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {gameParks.map((park) => (
                <GameParkCard key={park.name} park={park} />
              ))}
            </div>
          </section>
        )}

        <SectionDivider />

        {/* Who it is for / not for */}
        <section className="my-8">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-6">
            Who this destination suits
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-stone-200 p-5">
              <h3 className="font-ui text-sm font-medium text-[#2F5D50] mb-3 uppercase tracking-wide">
                Best for
              </h3>
              <ul className="space-y-2">
                {destination.bestFor.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#2F5D50] mt-0.5">+</span>
                    <span className="text-stone-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-stone-200 p-5">
              <h3 className="font-ui text-sm font-medium text-stone-500 mb-3 uppercase tracking-wide">
                Not ideal for
              </h3>
              <ul className="space-y-2">
                {destination.notIdealFor.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-stone-400 mt-0.5">-</span>
                    <span className="text-stone-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* When to go */}
        <section className="my-8">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-6">
            When to go
          </h2>
          <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100">
            <div className="p-5 flex items-start gap-4">
              <Sun className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-stone-900">Peak Season</p>
                <p className="text-stone-600 text-sm mt-1">{destination.whenToGo.peakSeason}</p>
              </div>
            </div>
            <div className="p-5 flex items-start gap-4">
              <Cloud className="w-5 h-5 text-stone-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-stone-900">Shoulder Season</p>
                <p className="text-stone-600 text-sm mt-1">{destination.whenToGo.shoulderSeason}</p>
              </div>
            </div>
            <div className="p-5 flex items-start gap-4">
              <ThermometerSun className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-stone-900">Green Season</p>
                <p className="text-stone-600 text-sm mt-1">{destination.whenToGo.greenSeason}</p>
              </div>
            </div>
            {destination.whenToGo.migrationNotes && (
              <div className="p-5 flex items-start gap-4">
                <Compass className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-stone-900">Wildlife Notes</p>
                  <p className="text-stone-600 text-sm mt-1">{destination.whenToGo.migrationNotes}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <SectionDivider />

        {/* Practical info */}
        <section className="my-8">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-6">
            Practical information
          </h2>
          <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100">
            <div className="p-5 flex items-start gap-4">
              <Plane className="w-5 h-5 text-stone-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-stone-900">Gateway</p>
                <p className="text-stone-600 text-sm mt-1">{destination.practicalInfo.gateway}</p>
              </div>
            </div>
            <div className="p-5 flex items-start gap-4">
              <Users className="w-5 h-5 text-stone-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-stone-900">Visa</p>
                <p className="text-stone-600 text-sm mt-1">{destination.practicalInfo.visaRequired}</p>
              </div>
            </div>
            <div className="p-5 flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-stone-900">Malaria Risk</p>
                <p className="text-stone-600 text-sm mt-1">{destination.practicalInfo.malariaRisk}</p>
              </div>
            </div>
            <div className="p-5 flex items-start gap-4">
              <DollarSign className="w-5 h-5 text-stone-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-stone-900">Cost Level</p>
                <p className={`text-sm mt-1 font-medium ${costDisplay.color}`}>
                  {costDisplay.label}
                </p>
                <p className="text-stone-500 text-sm">{destination.parkFees}</p>
              </div>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* Trade-offs */}
        <section className="my-8">
          <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-6">
            Trade-offs
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-stone-200 p-5">
              <h3 className="font-ui text-sm font-medium text-[#2F5D50] mb-3 uppercase tracking-wide">
                Gains
              </h3>
              <ul className="space-y-2">
                {destination.tradeoffs.gains.map((gain, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#2F5D50] mt-0.5">+</span>
                    <span className="text-stone-700">{gain}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-stone-200 p-5">
              <h3 className="font-ui text-sm font-medium text-[#8A3F3B] mb-3 uppercase tracking-wide">
                Losses
              </h3>
              <ul className="space-y-2">
                {destination.tradeoffs.losses.map((loss, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#8A3F3B] mt-0.5">-</span>
                    <span className="text-stone-700">{loss}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* Trips for this destination */}
        {trips.length > 0 && (
          <section className="my-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center">
                  <Route className="w-5 h-5 text-stone-600" />
                </div>
                <div>
                  <h2 className="font-editorial text-2xl font-semibold text-stone-900">
                    Safari trips in {destination.name}
                  </h2>
                  <p className="text-stone-500 text-sm">Trip shapes and planning templates</p>
                </div>
              </div>
              <Link
                href="/trips"
                className="text-sm text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          </section>
        )}

        {/* Itineraries for this destination */}
        {itineraries.length > 0 && (
          <>
            <SectionDivider />
            <section className="my-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-stone-600" />
                  </div>
                  <div>
                    <h2 className="font-editorial text-2xl font-semibold text-stone-900">
                      Day-by-day itineraries
                    </h2>
                    <p className="text-stone-500 text-sm">Detailed route plans with daily activities</p>
                  </div>
                </div>
                <Link
                  href="/itineraries"
                  className="text-sm text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1"
                >
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {itineraries.map((itinerary) => (
                  <ItineraryCard key={itinerary.id} itinerary={itinerary} />
                ))}
              </div>
            </section>
          </>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-white rounded-2xl border border-stone-200 p-8 max-w-lg">
            <h3 className="font-editorial text-xl font-semibold text-stone-900 mb-2">
              Plan your {destination.name} safari
            </h3>
            <p className="text-stone-500 mb-6">
              Share your dates and preferences. We will build a custom itinerary.
            </p>
            <Link
              href="/inquire"
              className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors"
            >
              Start planning
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <Footer variant="operator" />
    </main>
  );
}
