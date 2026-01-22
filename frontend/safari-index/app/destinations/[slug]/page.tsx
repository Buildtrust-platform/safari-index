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
  Calendar,
  Plane,
  Sun,
  Cloud,
  ThermometerSun,
  DollarSign,
  Globe,
  Compass,
  Route,
  FileText,
  TrendingUp,
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
  formatDurationBand,
  type ItinerarySummary,
} from '../../content/itineraries';
import { WildlifeSightings } from '../../components/WildlifeSightings';
import { getRegionSightings } from '../../content/wildlife-sightings';
import { getDestinationCluster, type ClusterItem } from '../../content/destination-clusters';

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
  zimbabwe: [
    { id: 'hwange', name: 'Hwange National Park', type: 'national-park', ecosystem: 'savannah', highlights: ['Elephant herds', 'Waterhole game viewing', 'Wild dogs'], bestFor: 'Elephant encounters and waterhole photography' },
    { id: 'mana-pools', name: 'Mana Pools National Park', type: 'national-park', ecosystem: 'floodplain', highlights: ['Walking safaris', 'Canoe safaris', 'Wild dogs', 'Elephants'], bestFor: 'Walking and canoe safaris' },
    { id: 'matobo', name: 'Matobo National Park', type: 'national-park', ecosystem: 'savannah', highlights: ['Rhino tracking', 'San rock art', 'Dramatic boulders'], bestFor: 'Rhino walks and cultural heritage' },
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
        'Cape Town and Johannesburg add urban options',
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
      title: 'Destination Not Found | Vurara Safaris',
    };
  }

  return {
    title: `${destination.name} Safari Guide | Vurara Safaris`,
    description: `${destination.description.slice(0, 155)}...`,
    robots: 'index, follow',
    alternates: {
      canonical: `/destinations/${destination.id}`,
    },
    openGraph: {
      title: `${destination.name} Safari Guide | Vurara Safaris`,
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
 * Park-specific image mapping to avoid repeated images
 * Uses a mix of destination, ecosystem, and activity images
 */
const PARK_IMAGES: Record<string, { src: string; alt: string }> = {
  // Tanzania
  'serengeti': { src: '/images/destinations/tanzania-serengeti.jpg', alt: 'Serengeti endless plains' },
  'ngorongoro': { src: '/images/destinations/tanzania-ngorongoro.jpg', alt: 'Ngorongoro Crater' },
  'tarangire': { src: '/images/ecosystems/savannah-morning.jpg', alt: 'Tarangire baobab landscape' },
  'lake-manyara': { src: '/images/ecosystems/woodland-clearing.jpg', alt: 'Lake Manyara woodland' },
  'ruaha': { src: '/images/ecosystems/kopje-landscape.jpg', alt: 'Ruaha wilderness' },
  'nyerere-selous': { src: '/images/ecosystems/delta-channels.jpg', alt: 'Selous waterways' },
  'katavi': { src: '/images/ecosystems/floodplain-evening.jpg', alt: 'Katavi floodplains' },
  // Kenya
  'masai-mara': { src: '/images/destinations/kenya-mara.jpg', alt: 'Masai Mara savannah' },
  'amboseli': { src: '/images/activities/wildlife-viewing.jpg', alt: 'Amboseli elephants with Kilimanjaro' },
  'samburu': { src: '/images/ecosystems/savannah-wildlife.jpg', alt: 'Samburu wildlife' },
  'laikipia': { src: '/images/activities/walking-safari.jpg', alt: 'Laikipia walking safari' },
  'lake-nakuru': { src: '/images/activities/birding/lilac-breasted-roller.jpg', alt: 'Lake Nakuru birdlife' },
  'tsavo': { src: '/images/ecosystems/kopje-landscape.jpg', alt: 'Tsavo red landscape' },
  'mara-conservancies': { src: '/images/activities/game-drive.jpg', alt: 'Mara conservancy game drive' },
  // Botswana
  'okavango-delta': { src: '/images/destinations/botswana-delta.jpg', alt: 'Okavango Delta waterways' },
  'chobe': { src: '/images/activities/boat-safari.jpg', alt: 'Chobe river safari' },
  'moremi': { src: '/images/ecosystems/delta-channels.jpg', alt: 'Moremi game reserve' },
  'linyanti': { src: '/images/ecosystems/floodplain-evening.jpg', alt: 'Linyanti wetlands' },
  'makgadikgadi': { src: '/images/ecosystems/desert-dunes.jpg', alt: 'Makgadikgadi salt pans' },
  'central-kalahari': { src: '/images/activities/big-cats.jpg', alt: 'Kalahari predators' },
  // South Africa
  'kruger': { src: '/images/destinations/south-africa-kruger.jpg', alt: 'Kruger National Park' },
  'sabi-sands': { src: '/images/activities/big-cats.jpg', alt: 'Sabi Sands leopard territory' },
  'timbavati': { src: '/images/ecosystems/savannah-morning.jpg', alt: 'Timbavati private reserve' },
  'madikwe': { src: '/images/activities/game-drive.jpg', alt: 'Madikwe game viewing' },
  'phinda': { src: '/images/ecosystems/woodland-clearing.jpg', alt: 'Phinda diverse habitats' },
  'hluhluwe-imfolozi': { src: '/images/activities/walking-safari.jpg', alt: 'Hluhluwe rhino walks' },
  // Rwanda
  'volcanoes-np': { src: '/images/destinations/rwanda-volcanoes.jpg', alt: 'Volcanoes National Park' },
  'akagera': { src: '/images/ecosystems/savannah-wildlife.jpg', alt: 'Akagera savannah' },
  'nyungwe': { src: '/images/ecosystems/montane-forest.jpg', alt: 'Nyungwe rainforest' },
  // Uganda
  'bwindi': { src: '/images/destinations/uganda-bwindi.jpg', alt: 'Bwindi Impenetrable Forest' },
  'kibale': { src: '/images/activities/chimp-tracking.jpg', alt: 'Kibale chimpanzees' },
  'queen-elizabeth': { src: '/images/ecosystems/savannah-morning.jpg', alt: 'Queen Elizabeth National Park' },
  'murchison-falls': { src: '/images/ecosystems/floodplain-evening.jpg', alt: 'Murchison Falls' },
  'mgahinga': { src: '/images/ecosystems/montane-forest.jpg', alt: 'Mgahinga volcanoes' },
  // Namibia
  'etosha': { src: '/images/activities/photographic-hide.jpg', alt: 'Etosha waterhole' },
  'sossusvlei': { src: '/images/destinations/namibia-sossusvlei.jpg', alt: 'Sossusvlei dunes' },
  'damaraland': { src: '/images/ecosystems/desert-dunes.jpg', alt: 'Damaraland desert' },
  'skeleton-coast': { src: '/images/activities/scenic-helicopter.jpg', alt: 'Skeleton Coast aerial' },
  'caprivi': { src: '/images/ecosystems/delta-channels.jpg', alt: 'Caprivi waterways' },
  'namibrand': { src: '/images/activities/fly-camping.jpg', alt: 'NamibRand stargazing' },
  // Zambia
  'south-luangwa': { src: '/images/destinations/zambia-luangwa.jpg', alt: 'South Luangwa' },
  'lower-zambezi': { src: '/images/activities/canoe-safari.jpg', alt: 'Lower Zambezi canoeing' },
  'kafue': { src: '/images/ecosystems/savannah-wildlife.jpg', alt: 'Kafue wilderness' },
  'north-luangwa': { src: '/images/activities/walking-safari.jpg', alt: 'North Luangwa walking' },
  'victoria-falls': { src: '/images/activities/white-water-rafting.jpg', alt: 'Victoria Falls activities' },
  // Zimbabwe
  'hwange': { src: '/images/activities/photographic-hide.jpg', alt: 'Hwange elephants' },
  'mana-pools': { src: '/images/destinations/zimbabwe-mana.jpg', alt: 'Mana Pools' },
  'matobo': { src: '/images/ecosystems/kopje-landscape.jpg', alt: 'Matobo rock formations' },
};

/**
 * Get image for a park - uses specific mapping or falls back to ecosystem
 */
function getParkImage(park: GamePark) {
  if (PARK_IMAGES[park.id]) {
    return PARK_IMAGES[park.id];
  }
  // Fallback to ecosystem-based image
  const images = getImagesByTag(park.ecosystem);
  return images.length > 0 ? images[0] : ecosystemImages[0];
}

/**
 * Migration Cross-Border Card - Shows for Tanzania/Kenya only
 * Explains the ecosystem unity and seasonal viewing windows
 */
function MigrationCrossBorderCard({ currentDestination }: { currentDestination: 'tanzania' | 'kenya' }) {
  const isTanzania = currentDestination === 'tanzania';
  const otherDestination = isTanzania ? 'Kenya' : 'Tanzania';
  const otherSlug = isTanzania ? 'kenya' : 'tanzania';

  return (
    <div className="bg-gradient-to-r from-amber-50 to-stone-50 rounded-xl border border-amber-200/50 p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-4 h-4 text-amber-700" />
        </div>
        <div>
          <h3 className="font-medium text-stone-900">
            One Ecosystem, Two Countries
          </h3>
          <p className="text-sm text-stone-600 mt-1">
            The Serengeti and Masai Mara are a single ecosystem divided by a border.
            The migration moves between them seasonally.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-stone-200 p-4 mb-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-stone-900 mb-1">
              {isTanzania ? 'Serengeti (Tanzania)' : 'Masai Mara (Kenya)'}
            </p>
            <p className="text-stone-600">
              {isTanzania
                ? 'Migration present ~9 months. Calving (Jan-Mar), movement (Apr-Jun), crossings (Jul-Oct).'
                : 'Migration present Jul-Oct. Peak river crossings. Concentrated herds.'}
            </p>
          </div>
          <div>
            <p className="font-medium text-stone-900 mb-1">
              {isTanzania ? 'Masai Mara (Kenya)' : 'Serengeti (Tanzania)'}
            </p>
            <p className="text-stone-600">
              {isTanzania
                ? 'Migration Jul-Oct only. Peak crossing season. Off-road driving permitted.'
                : 'Migration Nov-Jun. Calving season in south. More variety across regions.'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/migration-logic"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 text-sm font-medium rounded-lg hover:bg-amber-200 transition-colors"
        >
          Migration Logic Hub
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href={`/destinations/${otherSlug}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-stone-700 text-sm font-medium rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
        >
          Compare with {otherDestination}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/decisions/serengeti-vs-mara-migration"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-stone-700 text-sm font-medium rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
        >
          Serengeti vs Mara decision
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

/**
 * Images for trip cards - rotates through different images to avoid repetition
 */
const TRIP_CARD_IMAGES = [
  { src: '/images/activities/game-drive.jpg', alt: 'Safari game drive' },
  { src: '/images/ecosystems/savannah-wildlife.jpg', alt: 'African wildlife' },
  { src: '/images/activities/migration.jpg', alt: 'Wildlife migration' },
  { src: '/images/ecosystems/savannah-morning.jpg', alt: 'Morning safari' },
];

/**
 * Trip card component - Visual card with image header
 */
function TripCard({ trip, index }: { trip: TripArchetype; index: number }) {
  // Rotate through different images based on index
  const cardImage = TRIP_CARD_IMAGES[index % TRIP_CARD_IMAGES.length];

  return (
    <Link
      href={`/trips/${trip.id}`}
      className="group block bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-amber-300 hover:shadow-lg transition-all"
    >
      {/* Image header */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={cardImage.src}
          alt={cardImage.alt}
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
 * Images for itinerary cards - rotates through different images
 */
const ITINERARY_CARD_IMAGES = [
  { src: '/images/activities/river-crossing.jpg', alt: 'River crossing' },
  { src: '/images/ecosystems/crater-highlands.jpg', alt: 'Crater landscape' },
  { src: '/images/activities/wildlife-viewing.jpg', alt: 'Wildlife viewing' },
];

/**
 * Itinerary card component - Visual card with image header
 */
function ItineraryCard({ itinerary, index }: { itinerary: ItinerarySummary; index: number }) {
  // Rotate through different images based on index
  const cardImage = ITINERARY_CARD_IMAGES[index % ITINERARY_CARD_IMAGES.length];

  return (
    <Link
      href={`/itineraries/${itinerary.slug}`}
      className="group block bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-amber-300 hover:shadow-lg transition-all"
    >
      {/* Image header */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={cardImage.src}
          alt={cardImage.alt}
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
 * Compact game park card - links to dedicated park page
 */
function GameParkCard({ park }: { park: GamePark }) {
  const parkImage = getParkImage(park);

  return (
    <Link
      href={`/parks/${park.id}`}
      className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-amber-300 hover:shadow-md transition-all"
    >
      <div className="flex">
        {/* Thumbnail */}
        <div className="w-20 h-20 flex-shrink-0 overflow-hidden">
          <img
            src={parkImage.src}
            alt={parkImage.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        {/* Content */}
        <div className="flex-1 min-w-0 p-3">
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-stone-900 text-sm truncate mb-0.5 group-hover:text-amber-700 transition-colors">
              {park.name}
            </h4>
            <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-1" />
          </div>
          <p className="text-stone-500 text-xs line-clamp-1 mb-1.5">{park.bestFor}</p>
          <div className="flex flex-wrap gap-1">
            {park.highlights.slice(0, 2).map((highlight) => (
              <span
                key={highlight}
                className="px-1.5 py-0.5 bg-stone-100 text-stone-600 text-[10px] rounded"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Destination Cluster Section - Hub & Spoke SEO
 * Links to all decision/blog spokes relevant to this destination
 */
function DestinationClusterSection({
  destinationId,
  destinationName,
}: {
  destinationId: string;
  destinationName: string;
}) {
  const cluster = getDestinationCluster(destinationId);

  if (!cluster) return null;

  const hasContent =
    cluster.decisions.length > 0 ||
    cluster.comparisons.length > 0 ||
    cluster.timing.length > 0;

  if (!hasContent) return null;

  return (
    <section className="mb-10">
      <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
        {destinationName} decisions
      </h2>
      <p className="text-stone-600 text-sm mb-6">
        Key questions travelers ask about {destinationName}. Each decision explains trade-offs and conditions.
      </p>

      <div className="space-y-6">
        {/* Comparisons - Most valuable for SEO */}
        {cluster.comparisons.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-3">
              Comparisons
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {cluster.comparisons.map((item) => (
                <ClusterLink key={item.slug} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Timing Decisions */}
        {cluster.timing.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-3">
              When to visit
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cluster.timing.map((item) => (
                <ClusterLink key={item.slug} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Other Decisions */}
        {cluster.decisions.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-3">
              Planning decisions
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cluster.decisions.slice(0, 6).map((item) => (
                <ClusterLink key={item.slug} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Cluster Link - Individual spoke link with type badge
 */
function ClusterLink({ item }: { item: ClusterItem }) {
  const href =
    item.type === 'decision'
      ? `/decisions/${item.slug}`
      : item.type === 'blog'
        ? `/blog/decisions/${item.slug}`
        : `/guides/${item.slug}`;

  const typeLabel =
    item.type === 'decision' ? 'Decision' : item.type === 'blog' ? 'Deep dive' : 'Guide';

  return (
    <Link
      href={href}
      className="group flex items-start gap-3 p-3 bg-white rounded-lg border border-stone-200 hover:border-amber-300 hover:shadow-sm transition-all"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-900 group-hover:text-amber-700 transition-colors">
          {item.title}
        </p>
        {item.context && (
          <p className="text-xs text-stone-500 mt-0.5">{item.context}</p>
        )}
        <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider bg-stone-100 text-stone-500 rounded">
          {typeLabel}
        </span>
      </div>
      <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" />
    </Link>
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
                Vurara Safaris
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

        {/* Migration Cross-Border Card - Tanzania/Kenya only */}
        {(destination.id === 'tanzania' || destination.id === 'kenya') && (
          <section className="mb-8">
            <MigrationCrossBorderCard currentDestination={destination.id as 'tanzania' | 'kenya'} />
          </section>
        )}

        <SectionDivider />

        {/* Game Parks Section - Compact grid */}
        {gameParks.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-editorial text-xl font-semibold text-stone-900">
                Parks & Reserves
              </h2>
              <span className="text-sm text-stone-500">{gameParks.length} areas</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {gameParks.map((park) => (
                <GameParkCard key={park.name} park={park} />
              ))}
            </div>
          </section>
        )}

        {/* Wildlife Sighting Probabilities */}
        {getRegionSightings(destination.id).length > 0 && (
          <section className="mb-10">
            <WildlifeSightings region={destination.id} />
          </section>
        )}

        {/* Advisory Panel - Combined suitability + trade-offs */}
        <section className="mb-10">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
            Is {destination.name} right for you?
          </h2>
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-100">
              {/* Best for */}
              <div className="p-4">
                <h3 className="text-sm font-medium text-[#2F5D50] mb-2">Best for</h3>
                <ul className="space-y-1.5 text-sm">
                  {destination.bestFor.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#2F5D50]">+</span>
                      <span className="text-stone-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Not ideal for */}
              <div className="p-4">
                <h3 className="text-sm font-medium text-stone-500 mb-2">Consider alternatives if</h3>
                <ul className="space-y-1.5 text-sm">
                  {destination.notIdealFor.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-stone-400">-</span>
                      <span className="text-stone-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Trade-offs row */}
            <div className="border-t border-stone-100 grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-100">
              <div className="p-4 bg-stone-50/50">
                <h3 className="text-sm font-medium text-[#2F5D50] mb-2">What you gain</h3>
                <ul className="space-y-1 text-sm">
                  {destination.tradeoffs.gains.slice(0, 3).map((gain, i) => (
                    <li key={i} className="text-stone-700">• {gain}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-stone-50/50">
                <h3 className="text-sm font-medium text-[#8A3F3B] mb-2">What you trade</h3>
                <ul className="space-y-1 text-sm">
                  {destination.tradeoffs.losses.slice(0, 3).map((loss, i) => (
                    <li key={i} className="text-stone-600">• {loss}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="mb-10 bg-gradient-to-r from-amber-50 to-stone-50 rounded-xl border border-amber-200/50 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-stone-900 font-medium">
                Ready to plan your {destination.name} safari?
              </p>
              <p className="text-stone-500 text-sm mt-0.5">
                Tell us what matters most to you
              </p>
            </div>
            <Link
              href="/inquire"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors text-sm whitespace-nowrap"
            >
              Start planning
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Decision Cluster Hub - SEO Hub & Spoke */}
        <DestinationClusterSection destinationId={slug} destinationName={destination.name} />

        {/* Planning Essentials - Combined timing + practical */}
        <section className="mb-10">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
            Planning essentials
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* When to go */}
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <h3 className="font-medium text-stone-900 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                When to go
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Sun className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-stone-900">Peak: </span>
                    <span className="text-stone-600">{destination.whenToGo.peakSeason}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Cloud className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-stone-900">Shoulder: </span>
                    <span className="text-stone-600">{destination.whenToGo.shoulderSeason}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ThermometerSun className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-stone-900">Green: </span>
                    <span className="text-stone-600">{destination.whenToGo.greenSeason}</span>
                  </div>
                </div>
                {destination.whenToGo.migrationNotes && (
                  <div className="pt-2 mt-2 border-t border-stone-100 text-stone-600">
                    <Compass className="w-3.5 h-3.5 inline mr-1 text-blue-500" />
                    {destination.whenToGo.migrationNotes}
                  </div>
                )}
              </div>
            </div>

            {/* Practical info */}
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <h3 className="font-medium text-stone-900 mb-3 flex items-center gap-2">
                <Plane className="w-4 h-4 text-stone-500" />
                Practical info
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-stone-900">Gateway: </span>
                  <span className="text-stone-600">{destination.practicalInfo.gateway}</span>
                </div>
                <div>
                  <span className="font-medium text-stone-900">Visa: </span>
                  <span className="text-stone-600">{destination.practicalInfo.visaRequired}</span>
                </div>
                <div>
                  <span className="font-medium text-stone-900">Malaria: </span>
                  <span className="text-stone-600">{destination.practicalInfo.malariaRisk}</span>
                </div>
                <div className="pt-2 mt-2 border-t border-stone-100">
                  <span className="font-medium text-stone-900">Cost: </span>
                  <span className={`font-medium ${costDisplay.color}`}>{costDisplay.label}</span>
                  <span className="text-stone-500 block text-xs mt-0.5">{destination.parkFees}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trips & Itineraries - Combined section */}
        {(trips.length > 0 || itineraries.length > 0) && (
          <section className="mb-10">
            <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
              Explore {destination.name}
            </h2>

            {/* Trips */}
            {trips.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Route className="w-4 h-4" />
                    <span className="font-medium">Trip shapes</span>
                  </div>
                  <Link
                    href="/trips"
                    className="text-xs text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1"
                  >
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {trips.map((trip, idx) => (
                    <TripCard key={trip.id} trip={trip} index={idx} />
                  ))}
                </div>
              </div>
            )}

            {/* Itineraries */}
            {itineraries.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <FileText className="w-4 h-4" />
                    <span className="font-medium">Day-by-day itineraries</span>
                  </div>
                  <Link
                    href="/itineraries"
                    className="text-xs text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1"
                  >
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {itineraries.map((itinerary, idx) => (
                    <ItineraryCard key={itinerary.id} itinerary={itinerary} index={idx} />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

      </div>

      <Footer variant="operator" />
    </main>
  );
}
