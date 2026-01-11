/**
 * Wildlife Calendar Data
 *
 * Comprehensive data for the interactive wildlife calendar.
 * Combines wildlife sighting probabilities with seasonal timing.
 */

import {
  PARK_SIGHTINGS,
  SPECIES_NAMES,
  BIG_FIVE,
  NOTABLE_SPECIES,
  type ParkSightings,
} from '../content/wildlife-sightings';

export const MONTHS = [
  { value: 1, name: 'January', short: 'Jan' },
  { value: 2, name: 'February', short: 'Feb' },
  { value: 3, name: 'March', short: 'Mar' },
  { value: 4, name: 'April', short: 'Apr' },
  { value: 5, name: 'May', short: 'May' },
  { value: 6, name: 'June', short: 'Jun' },
  { value: 7, name: 'July', short: 'Jul' },
  { value: 8, name: 'August', short: 'Aug' },
  { value: 9, name: 'September', short: 'Sep' },
  { value: 10, name: 'October', short: 'Oct' },
  { value: 11, name: 'November', short: 'Nov' },
  { value: 12, name: 'December', short: 'Dec' },
] as const;

/**
 * Wildlife events by month
 */
export interface WildlifeEvent {
  id: string;
  title: string;
  description: string;
  months: number[];
  destinations: string[];
  species?: string[];
  highlight?: boolean;
}

export const WILDLIFE_EVENTS: WildlifeEvent[] = [
  // Great Migration
  {
    id: 'calving-season',
    title: 'Wildebeest Calving Season',
    description: 'Over 500,000 wildebeest calves born in the southern Serengeti and Ndutu area. Predator activity is at its peak.',
    months: [1, 2, 3],
    destinations: ['tanzania'],
    species: ['wildebeest', 'lion', 'cheetah', 'hyena'],
    highlight: true,
  },
  {
    id: 'migration-crossing',
    title: 'Mara River Crossings',
    description: 'The dramatic river crossings as the Great Migration herds cross into Kenya. Crocodiles lie in wait.',
    months: [7, 8, 9, 10],
    destinations: ['kenya', 'tanzania'],
    species: ['wildebeest', 'zebra', 'crocodile'],
    highlight: true,
  },
  {
    id: 'migration-south',
    title: 'Migration Returns South',
    description: 'The herds begin their journey back to Tanzania following the rains.',
    months: [10, 11],
    destinations: ['tanzania', 'kenya'],
    species: ['wildebeest', 'zebra'],
  },
  // Elephant gatherings
  {
    id: 'elephant-gathering',
    title: 'Elephant Gatherings',
    description: 'Dry season concentrates elephants at water sources. Chobe sees herds of 100+.',
    months: [8, 9, 10],
    destinations: ['botswana', 'zimbabwe'],
    species: ['elephant'],
    highlight: true,
  },
  // Wild dog denning
  {
    id: 'wild-dog-denning',
    title: 'Wild Dog Denning Season',
    description: 'Wild dog packs settle at dens with pups, making them easier to locate and observe.',
    months: [5, 6, 7, 8],
    destinations: ['botswana', 'zambia', 'zimbabwe'],
    species: ['wild-dog'],
  },
  // Okavango flood
  {
    id: 'okavango-flood',
    title: 'Okavango Delta Flood',
    description: 'Annual floodwaters arrive from Angola, transforming the delta and concentrating wildlife.',
    months: [6, 7, 8, 9],
    destinations: ['botswana'],
    species: ['hippo', 'crocodile', 'elephant', 'buffalo'],
    highlight: true,
  },
  // Birding peak
  {
    id: 'migratory-birds',
    title: 'Migratory Bird Peak',
    description: 'Palearctic migrants arrive in full force. Best birding diversity of the year.',
    months: [11, 12, 1, 2],
    destinations: ['tanzania', 'kenya', 'botswana', 'south-africa', 'zambia'],
    highlight: false,
  },
  // Green season babies
  {
    id: 'green-season-births',
    title: 'Impala & Antelope Births',
    description: 'Many antelope species synchronize births during the green season for safety in numbers.',
    months: [11, 12, 1],
    destinations: ['botswana', 'south-africa', 'zambia', 'zimbabwe'],
    species: ['zebra'],
  },
  // Gorilla trekking optimal
  {
    id: 'gorilla-dry-season',
    title: 'Prime Gorilla Trekking',
    description: 'Drier conditions make forest trails more accessible. Gorillas often at lower elevations.',
    months: [6, 7, 8, 9, 12, 1, 2],
    destinations: ['rwanda', 'uganda'],
    species: ['gorilla'],
  },
  // Chimp trekking fruit season
  {
    id: 'chimp-fruit-season',
    title: 'Chimpanzee Fruit Season',
    description: 'Fruiting trees keep chimps in predictable areas, improving tracking success.',
    months: [6, 7, 8, 9],
    destinations: ['uganda', 'tanzania'],
    species: ['chimpanzee'],
  },
];

/**
 * Season data by region and month
 */
export interface SeasonInfo {
  type: 'dry' | 'green' | 'shoulder';
  label: string;
  description: string;
}

export const REGION_SEASONS: Record<string, Record<number, SeasonInfo>> = {
  'east-africa': {
    1: { type: 'green', label: 'Green Season', description: 'Short dry spell, calving season' },
    2: { type: 'green', label: 'Green Season', description: 'Calving continues, excellent predator action' },
    3: { type: 'shoulder', label: 'Long Rains Begin', description: 'Rains starting, fewer crowds' },
    4: { type: 'green', label: 'Long Rains', description: 'Heavy rains, lowest prices' },
    5: { type: 'green', label: 'Long Rains', description: 'Rains tapering, migration moving north' },
    6: { type: 'dry', label: 'Dry Season', description: 'Peak season begins, excellent game viewing' },
    7: { type: 'dry', label: 'Dry Season', description: 'Migration in Mara area' },
    8: { type: 'dry', label: 'Dry Season', description: 'River crossings peak' },
    9: { type: 'dry', label: 'Dry Season', description: 'Crossings continue, excellent conditions' },
    10: { type: 'shoulder', label: 'Short Rains Begin', description: 'Rains starting, migration heads south' },
    11: { type: 'green', label: 'Short Rains', description: 'Green landscape, birthing season begins' },
    12: { type: 'green', label: 'Short Rains End', description: 'Holiday season, good value' },
  },
  'southern-africa': {
    1: { type: 'green', label: 'Green Season', description: 'Hot, wet, lush vegetation' },
    2: { type: 'green', label: 'Green Season', description: 'Peak rains in many areas' },
    3: { type: 'green', label: 'Green Season', description: 'Rains continue, birthing season' },
    4: { type: 'shoulder', label: 'Autumn', description: 'Rains ending, pleasant temperatures' },
    5: { type: 'dry', label: 'Dry Season', description: 'Excellent game viewing begins' },
    6: { type: 'dry', label: 'Dry Season', description: 'Cool mornings, great visibility' },
    7: { type: 'dry', label: 'Dry Season', description: 'Peak season, animals at water' },
    8: { type: 'dry', label: 'Dry Season', description: 'Best game viewing, Okavango flooded' },
    9: { type: 'dry', label: 'Dry Season', description: 'Hot, excellent wildlife concentration' },
    10: { type: 'dry', label: 'Late Dry', description: 'Very hot, animals at water sources' },
    11: { type: 'shoulder', label: 'Spring Rains', description: 'First rains, newborn animals' },
    12: { type: 'green', label: 'Green Season', description: 'Hot, afternoon storms' },
  },
};

/**
 * Get region key for a destination
 */
export function getRegionKey(destination: string): 'east-africa' | 'southern-africa' {
  const eastAfrica = ['tanzania', 'kenya', 'uganda', 'rwanda'];
  return eastAfrica.includes(destination) ? 'east-africa' : 'southern-africa';
}

/**
 * Destination data for filtering
 */
export interface Destination {
  id: string;
  name: string;
  region: 'east-africa' | 'southern-africa';
  parks: string[];
}

export const DESTINATIONS: Destination[] = [
  { id: 'tanzania', name: 'Tanzania', region: 'east-africa', parks: ['serengeti', 'ngorongoro', 'tarangire'] },
  { id: 'kenya', name: 'Kenya', region: 'east-africa', parks: ['masai-mara', 'amboseli'] },
  { id: 'uganda', name: 'Uganda', region: 'east-africa', parks: ['bwindi', 'kibale', 'queen-elizabeth'] },
  { id: 'rwanda', name: 'Rwanda', region: 'east-africa', parks: ['volcanoes-np'] },
  { id: 'botswana', name: 'Botswana', region: 'southern-africa', parks: ['okavango-delta', 'chobe'] },
  { id: 'south-africa', name: 'South Africa', region: 'southern-africa', parks: ['kruger', 'sabi-sands'] },
  { id: 'zambia', name: 'Zambia', region: 'southern-africa', parks: [] },
  { id: 'zimbabwe', name: 'Zimbabwe', region: 'southern-africa', parks: [] },
  { id: 'namibia', name: 'Namibia', region: 'southern-africa', parks: [] },
];

/**
 * Species for calendar filtering
 */
export interface CalendarSpecies {
  id: string;
  name: string;
  category: 'big-five' | 'predator' | 'primate' | 'other';
  icon?: string;
}

export const CALENDAR_SPECIES: CalendarSpecies[] = [
  // Big Five
  { id: 'lion', name: 'Lion', category: 'big-five' },
  { id: 'leopard', name: 'Leopard', category: 'big-five' },
  { id: 'elephant', name: 'Elephant', category: 'big-five' },
  { id: 'buffalo', name: 'Buffalo', category: 'big-five' },
  { id: 'rhino', name: 'Rhino', category: 'big-five' },
  // Other predators
  { id: 'cheetah', name: 'Cheetah', category: 'predator' },
  { id: 'wild-dog', name: 'Wild Dog', category: 'predator' },
  { id: 'hyena', name: 'Hyena', category: 'predator' },
  { id: 'crocodile', name: 'Crocodile', category: 'predator' },
  // Primates
  { id: 'gorilla', name: 'Mountain Gorilla', category: 'primate' },
  { id: 'chimpanzee', name: 'Chimpanzee', category: 'primate' },
  // Other
  { id: 'wildebeest', name: 'Wildebeest', category: 'other' },
  { id: 'zebra', name: 'Zebra', category: 'other' },
  { id: 'giraffe', name: 'Giraffe', category: 'other' },
  { id: 'hippo', name: 'Hippo', category: 'other' },
];

/**
 * Get wildlife events for a specific month
 */
export function getEventsForMonth(month: number): WildlifeEvent[] {
  return WILDLIFE_EVENTS.filter((event) => event.months.includes(month));
}

/**
 * Get wildlife events for a specific destination and month
 */
export function getEventsForDestinationMonth(destination: string, month: number): WildlifeEvent[] {
  return WILDLIFE_EVENTS.filter(
    (event) => event.months.includes(month) && event.destinations.includes(destination)
  );
}

/**
 * Get sighting probability for a species in a month, accounting for seasonal variation
 */
export function getMonthlyProbability(
  parkSightings: ParkSightings,
  speciesId: string,
  month: number
): number {
  const sighting = parkSightings.sightings.find((s) => s.species === speciesId);
  if (!sighting) return 0;

  // Check for seasonal variation
  if (sighting.seasonalVariation) {
    const { peak, low } = sighting.seasonalVariation;
    if (peak.months.includes(month)) return peak.probability;
    if (low.months.includes(month)) return low.probability;
  }

  return sighting.probability;
}

/**
 * Get aggregated sighting probability for a species across all parks in a destination
 */
export function getDestinationSpeciesProbability(
  destinationId: string,
  speciesId: string,
  month: number
): number {
  const destination = DESTINATIONS.find((d) => d.id === destinationId);
  if (!destination || destination.parks.length === 0) return 0;

  const probabilities = destination.parks
    .map((parkId) => {
      const parkData = PARK_SIGHTINGS.find((p) => p.parkId === parkId);
      if (!parkData) return 0;
      return getMonthlyProbability(parkData, speciesId, month);
    })
    .filter((p) => p > 0);

  if (probabilities.length === 0) return 0;

  // Return the highest probability across parks
  return Math.max(...probabilities);
}

/**
 * Get best months for seeing a specific species in a destination
 */
export function getBestMonthsForSpecies(destinationId: string, speciesId: string): number[] {
  const probabilities = MONTHS.map((m) => ({
    month: m.value,
    probability: getDestinationSpeciesProbability(destinationId, speciesId, m.value),
  }));

  const maxProb = Math.max(...probabilities.map((p) => p.probability));
  if (maxProb === 0) return [];

  // Return months with probability within 10% of max
  return probabilities
    .filter((p) => p.probability >= maxProb * 0.9)
    .map((p) => p.month);
}

export { PARK_SIGHTINGS, SPECIES_NAMES, BIG_FIVE, NOTABLE_SPECIES };
