/**
 * Wildlife Sighting Probability Data
 *
 * Estimated sighting probabilities for key species by park/reserve.
 * Based on aggregated operator feedback and published research.
 *
 * Per governance:
 * - Conservative estimates (under-promise, over-deliver)
 * - Seasonal variations noted where significant
 * - No guarantees implied
 *
 * Probability scale:
 * - 90-100%: Almost certain (daily sightings typical)
 * - 70-89%: Very likely (most safaris see this species)
 * - 50-69%: Good chance (more than half of safaris)
 * - 30-49%: Possible (requires some luck)
 * - 10-29%: Uncommon (notable if seen)
 * - <10%: Rare (exceptional sighting)
 */

export interface SpeciesSighting {
  species: string;
  probability: number; // 0-100
  notes?: string;
  seasonalVariation?: {
    peak: { months: number[]; probability: number };
    low: { months: number[]; probability: number };
  };
}

export interface ParkSightings {
  parkId: string;
  parkName: string;
  region: string;
  sightings: SpeciesSighting[];
  lastUpdated: string;
  dataSource: string;
}

/**
 * Big Five species IDs
 */
export const BIG_FIVE = ['lion', 'leopard', 'elephant', 'buffalo', 'rhino'] as const;

/**
 * Other notable species tracked
 */
export const NOTABLE_SPECIES = [
  'cheetah',
  'wild-dog',
  'hippo',
  'giraffe',
  'zebra',
  'wildebeest',
  'hyena',
  'crocodile',
  'gorilla',
  'chimpanzee',
] as const;

/**
 * Species display names
 */
export const SPECIES_NAMES: Record<string, string> = {
  lion: 'Lion',
  leopard: 'Leopard',
  elephant: 'African Elephant',
  buffalo: 'Cape Buffalo',
  rhino: 'Rhinoceros',
  cheetah: 'Cheetah',
  'wild-dog': 'African Wild Dog',
  hippo: 'Hippopotamus',
  giraffe: 'Giraffe',
  zebra: 'Zebra',
  wildebeest: 'Wildebeest',
  hyena: 'Spotted Hyena',
  crocodile: 'Nile Crocodile',
  gorilla: 'Mountain Gorilla',
  chimpanzee: 'Chimpanzee',
};

/**
 * Wildlife sighting data by park
 */
export const PARK_SIGHTINGS: ParkSightings[] = [
  // TANZANIA
  {
    parkId: 'serengeti',
    parkName: 'Serengeti National Park',
    region: 'tanzania',
    lastUpdated: '2025-01',
    dataSource: 'Operator feedback aggregation',
    sightings: [
      { species: 'lion', probability: 95, notes: 'Multiple prides, especially Central Serengeti' },
      { species: 'leopard', probability: 65, notes: 'Best in Seronera area, around kopjes' },
      { species: 'elephant', probability: 85, notes: 'Common, especially in woodland areas' },
      { species: 'buffalo', probability: 90, notes: 'Large herds throughout' },
      { species: 'rhino', probability: 15, notes: 'Black rhino, very rare, Moru Kopjes area' },
      { species: 'cheetah', probability: 70, notes: 'Open plains, especially southern Serengeti' },
      { species: 'wild-dog', probability: 25, notes: 'Uncommon, best in dry season' },
      { species: 'hippo', probability: 85, notes: 'Hippo pools common' },
      { species: 'giraffe', probability: 95, notes: 'Masai giraffe, very common' },
      { species: 'hyena', probability: 90, notes: 'Abundant throughout' },
      {
        species: 'wildebeest',
        probability: 85,
        seasonalVariation: {
          peak: { months: [1, 2, 6, 7, 8, 9], probability: 98 },
          low: { months: [3, 4, 5, 10, 11, 12], probability: 60 },
        },
      },
    ],
  },
  {
    parkId: 'ngorongoro',
    parkName: 'Ngorongoro Crater',
    region: 'tanzania',
    lastUpdated: '2025-01',
    dataSource: 'Operator feedback aggregation',
    sightings: [
      { species: 'lion', probability: 95, notes: 'High density in crater, almost guaranteed' },
      { species: 'leopard', probability: 40, notes: 'Present but elusive in crater forest' },
      { species: 'elephant', probability: 70, notes: 'Bulls common, herds on crater rim' },
      { species: 'buffalo', probability: 95, notes: 'Large herds on crater floor' },
      { species: 'rhino', probability: 60, notes: 'Black rhino, best chance in Tanzania' },
      { species: 'cheetah', probability: 40, notes: 'Less common than Serengeti' },
      { species: 'hippo', probability: 95, notes: 'Hippo pool always reliable' },
      { species: 'hyena', probability: 95, notes: 'Very high density' },
      { species: 'wildebeest', probability: 90, notes: 'Resident population year-round' },
      { species: 'zebra', probability: 95, notes: 'Abundant on crater floor' },
    ],
  },
  {
    parkId: 'tarangire',
    parkName: 'Tarangire National Park',
    region: 'tanzania',
    lastUpdated: '2025-01',
    dataSource: 'Operator feedback aggregation',
    sightings: [
      { species: 'lion', probability: 75, notes: 'Good population, tree-climbing lions possible' },
      { species: 'leopard', probability: 45, notes: 'Present in riverine areas' },
      { species: 'elephant', probability: 95, notes: 'Massive herds, especially dry season' },
      { species: 'buffalo', probability: 85, notes: 'Large herds common' },
      { species: 'giraffe', probability: 90, notes: 'Very common' },
      { species: 'zebra', probability: 90, notes: 'Large herds' },
      { species: 'wild-dog', probability: 20, notes: 'Occasionally seen' },
    ],
  },
  // KENYA
  {
    parkId: 'masai-mara',
    parkName: 'Masai Mara National Reserve',
    region: 'kenya',
    lastUpdated: '2025-01',
    dataSource: 'Operator feedback aggregation',
    sightings: [
      { species: 'lion', probability: 95, notes: 'Excellent population, multiple prides' },
      { species: 'leopard', probability: 75, notes: 'Good sightings, especially along rivers' },
      { species: 'elephant', probability: 90, notes: 'Common throughout' },
      { species: 'buffalo', probability: 90, notes: 'Large herds' },
      { species: 'rhino', probability: 30, notes: 'Black rhino, uncommon' },
      { species: 'cheetah', probability: 80, notes: 'Excellent open grassland habitat' },
      { species: 'wild-dog', probability: 15, notes: 'Rare, occasional visitors' },
      { species: 'hippo', probability: 95, notes: 'Mara River pools' },
      { species: 'giraffe', probability: 95, notes: 'Masai giraffe common' },
      { species: 'hyena', probability: 90, notes: 'Abundant' },
      {
        species: 'wildebeest',
        probability: 80,
        seasonalVariation: {
          peak: { months: [7, 8, 9, 10], probability: 98 },
          low: { months: [1, 2, 3, 4, 5, 6, 11, 12], probability: 50 },
        },
        notes: 'Migration peaks July-October',
      },
    ],
  },
  {
    parkId: 'amboseli',
    parkName: 'Amboseli National Park',
    region: 'kenya',
    lastUpdated: '2025-01',
    dataSource: 'Operator feedback aggregation',
    sightings: [
      { species: 'lion', probability: 70, notes: 'Good population' },
      { species: 'leopard', probability: 30, notes: 'Present but rarely seen' },
      { species: 'elephant', probability: 98, notes: 'Famous for large-tusked elephants, almost guaranteed' },
      { species: 'buffalo', probability: 85, notes: 'Common in marshes' },
      { species: 'cheetah', probability: 60, notes: 'Open plains habitat' },
      { species: 'hippo', probability: 90, notes: 'In marshes' },
      { species: 'giraffe', probability: 85, notes: 'Masai giraffe' },
      { species: 'hyena', probability: 75, notes: 'Common' },
      { species: 'zebra', probability: 90, notes: 'Plains zebra common' },
      { species: 'wildebeest', probability: 80, notes: 'Resident population' },
    ],
  },
  // BOTSWANA
  {
    parkId: 'okavango-delta',
    parkName: 'Okavango Delta',
    region: 'botswana',
    lastUpdated: '2025-01',
    dataSource: 'Operator feedback aggregation',
    sightings: [
      { species: 'lion', probability: 85, notes: 'Strong population' },
      { species: 'leopard', probability: 70, notes: 'Good in woodland areas' },
      { species: 'elephant', probability: 95, notes: 'Massive population, especially dry season' },
      { species: 'buffalo', probability: 90, notes: 'Large herds' },
      { species: 'rhino', probability: 5, notes: 'Extremely rare in Delta' },
      { species: 'wild-dog', probability: 55, notes: 'Excellent wild dog territory' },
      { species: 'hippo', probability: 95, notes: 'Abundant in channels' },
      { species: 'giraffe', probability: 85, notes: 'Southern giraffe' },
      { species: 'crocodile', probability: 90, notes: 'Common in waterways' },
      { species: 'hyena', probability: 80, notes: 'Common' },
    ],
  },
  {
    parkId: 'chobe',
    parkName: 'Chobe National Park',
    region: 'botswana',
    lastUpdated: '2025-01',
    dataSource: 'Operator feedback aggregation',
    sightings: [
      { species: 'lion', probability: 80, notes: 'Good population' },
      { species: 'leopard', probability: 55, notes: 'Present in riverine areas' },
      { species: 'elephant', probability: 98, notes: 'Largest elephant population in Africa' },
      { species: 'buffalo', probability: 90, notes: 'Large herds, especially riverfront' },
      { species: 'hippo', probability: 95, notes: 'Chobe River' },
      { species: 'giraffe', probability: 85, notes: 'Common' },
      { species: 'crocodile', probability: 90, notes: 'River safaris' },
      { species: 'wild-dog', probability: 40, notes: 'Seen regularly' },
    ],
  },
  // SOUTH AFRICA
  {
    parkId: 'kruger',
    parkName: 'Kruger National Park',
    region: 'south-africa',
    lastUpdated: '2025-01',
    dataSource: 'Operator feedback aggregation',
    sightings: [
      { species: 'lion', probability: 75, notes: 'Good population, large park' },
      { species: 'leopard', probability: 50, notes: 'Present but elusive in main park' },
      { species: 'elephant', probability: 90, notes: 'Very common' },
      { species: 'buffalo', probability: 85, notes: 'Large herds' },
      { species: 'rhino', probability: 45, notes: 'Both species present, white more common' },
      { species: 'cheetah', probability: 30, notes: 'Present but less common' },
      { species: 'wild-dog', probability: 25, notes: 'Best in northern areas' },
      { species: 'hippo', probability: 85, notes: 'Rivers and dams' },
      { species: 'giraffe', probability: 90, notes: 'South African giraffe' },
      { species: 'hyena', probability: 70, notes: 'Common' },
    ],
  },
  {
    parkId: 'sabi-sands',
    parkName: 'Sabi Sands Game Reserve',
    region: 'south-africa',
    lastUpdated: '2025-01',
    dataSource: 'Operator feedback aggregation',
    sightings: [
      { species: 'lion', probability: 90, notes: 'Excellent, habituated prides' },
      { species: 'leopard', probability: 92, notes: 'Best leopard viewing in Africa' },
      { species: 'elephant', probability: 95, notes: 'Very common' },
      { species: 'buffalo', probability: 90, notes: 'Regular sightings' },
      { species: 'rhino', probability: 65, notes: 'Both species, white more common' },
      { species: 'cheetah', probability: 35, notes: 'Less common in thick bush' },
      { species: 'wild-dog', probability: 45, notes: 'Seen fairly regularly' },
      { species: 'hyena', probability: 85, notes: 'Common' },
    ],
  },
  // RWANDA
  {
    parkId: 'volcanoes-np',
    parkName: 'Volcanoes National Park',
    region: 'rwanda',
    lastUpdated: '2025-01',
    dataSource: 'Operator feedback aggregation',
    sightings: [
      { species: 'gorilla', probability: 98, notes: 'Habituated groups, permit required' },
      { species: 'elephant', probability: 15, notes: 'Forest elephant, rare sightings' },
      { species: 'buffalo', probability: 40, notes: 'Forest buffalo, occasionally seen' },
    ],
  },
  // UGANDA
  {
    parkId: 'bwindi',
    parkName: 'Bwindi Impenetrable Forest',
    region: 'uganda',
    lastUpdated: '2025-01',
    dataSource: 'Operator feedback aggregation',
    sightings: [
      { species: 'gorilla', probability: 98, notes: 'Habituated groups, permit required' },
      { species: 'chimpanzee', probability: 30, notes: 'Present but gorilla trekking focus' },
      { species: 'elephant', probability: 20, notes: 'Forest elephant, occasionally seen' },
    ],
  },
  {
    parkId: 'kibale',
    parkName: 'Kibale National Park',
    region: 'uganda',
    lastUpdated: '2025-01',
    dataSource: 'Operator feedback aggregation',
    sightings: [
      { species: 'chimpanzee', probability: 95, notes: 'Best chimp tracking in Africa' },
      { species: 'elephant', probability: 35, notes: 'Forest elephant, occasionally seen' },
    ],
  },
  {
    parkId: 'queen-elizabeth',
    parkName: 'Queen Elizabeth National Park',
    region: 'uganda',
    lastUpdated: '2025-01',
    dataSource: 'Operator feedback aggregation',
    sightings: [
      { species: 'lion', probability: 75, notes: 'Including tree-climbing lions in Ishasha' },
      { species: 'leopard', probability: 45, notes: 'Present in Ishasha sector' },
      { species: 'elephant', probability: 85, notes: 'Common' },
      { species: 'buffalo', probability: 90, notes: 'Large herds' },
      { species: 'hippo', probability: 95, notes: 'Kazinga Channel' },
      { species: 'chimpanzee', probability: 80, notes: 'Kyambura Gorge' },
    ],
  },
];

/**
 * Get sighting data for a specific park
 */
export function getParkSightings(parkId: string): ParkSightings | undefined {
  return PARK_SIGHTINGS.find((p) => p.parkId === parkId);
}

/**
 * Get all sightings for a region
 */
export function getRegionSightings(region: string): ParkSightings[] {
  return PARK_SIGHTINGS.filter((p) => p.region === region);
}

/**
 * Get probability label for display
 */
export function getProbabilityLabel(probability: number): string {
  if (probability >= 90) return 'Almost certain';
  if (probability >= 70) return 'Very likely';
  if (probability >= 50) return 'Good chance';
  if (probability >= 30) return 'Possible';
  if (probability >= 10) return 'Uncommon';
  return 'Rare';
}

/**
 * Get probability color class for display
 */
export function getProbabilityColor(probability: number): string {
  if (probability >= 90) return 'bg-green-500';
  if (probability >= 70) return 'bg-green-400';
  if (probability >= 50) return 'bg-amber-400';
  if (probability >= 30) return 'bg-amber-500';
  if (probability >= 10) return 'bg-orange-400';
  return 'bg-red-400';
}

/**
 * Get probability text color class
 */
export function getProbabilityTextColor(probability: number): string {
  if (probability >= 70) return 'text-green-700';
  if (probability >= 50) return 'text-amber-700';
  if (probability >= 30) return 'text-amber-600';
  return 'text-orange-600';
}
