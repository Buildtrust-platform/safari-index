/**
 * Safari Birding Trip Archetypes
 *
 * Canonical definitions of birding trip TYPES used across all destinations.
 * These are trip styles, NOT individual itineraries.
 *
 * Per governance:
 * - No lodge names, prices, or availability
 * - Documentary, factual tone from ornithologist perspective
 * - Focus on what serious birders should expect from each type
 * - Honest about trade-offs and limitations
 */

export type BirdingIntensity = 'casual' | 'dedicated' | 'intensive';

export type BirdingFocus =
  | 'migratory-species'
  | 'endemic-forest'
  | 'savannah-diversity'
  | 'photography'
  | 'wetland-specialist'
  | 'raptor-focus';

export interface BirdingTripArchetype {
  id: string;
  name: string;
  focus: BirdingFocus;
  intensity: BirdingIntensity;
  what_it_is: string;
  typical_duration: string;
  typical_species_count: string;
  optimal_regions: string[];
  optimal_timing: string;
  who_it_is_for: string;
  who_should_avoid: string;
  required_equipment: string[];
  recommended_additions: string[];
  trade_offs: {
    gains: string;
    losses: string;
  };
  /** Stock photo reference for visual inspiration */
  image_hint: string;
}

export const birdingTripArchetypes: BirdingTripArchetype[] = [
  {
    id: 'migratory-focus',
    name: 'Palearctic Migrant Safari',
    focus: 'migratory-species',
    intensity: 'intensive',
    what_it_is:
      'Timed specifically for Palearctic migrant presence (November-March). Combines Rift Valley lakes for waders and waterbirds with savannah for passerines and raptors. Dawn-to-dusk birding with specialist guide.',
    typical_duration: '10-14 days',
    typical_species_count: '350-450 species',
    optimal_regions: [
      'kenya-rift-valley',
      'tanzania-northern-circuit',
      'ethiopia-rift',
    ],
    optimal_timing: 'Late November to mid-February',
    who_it_is_for:
      'Listers targeting Palearctic migrants; those building African species lists; birders comfortable with intensive field days',
    who_should_avoid:
      'Photography-focused birders (harsh light in peak migrant season); those wanting mammals as co-priority; travelers uncomfortable with unpredictable weather',
    required_equipment: [
      'Quality binoculars (8x42 or 10x42)',
      'Regional field guide',
      'Notebook or recording app',
      'Weatherproof layers',
    ],
    recommended_additions: [
      'Spotting scope (20-60x)',
      'Sound recording equipment',
      'Multiple field guides for complex IDs',
    ],
    trade_offs: {
      gains:
        'Maximum species diversity; Palearctic migrants in African winter quarters; breeding plumage on residents; concentrated wetland birding',
      losses:
        'Green season conditions; unpredictable access; competition with rain for field time; mammals less visible in dense vegetation',
    },
    image_hint:
      'Flock of European bee-eaters perched on branches with safari vehicle in background',
  },
  {
    id: 'endemic-forest',
    name: 'Albertine Rift Endemic Safari',
    focus: 'endemic-forest',
    intensity: 'intensive',
    what_it_is:
      'Focused forest birding targeting Albertine Rift endemics in Uganda and Rwanda. Combines montane forest specialists with primate tracking. Physically demanding trails, early starts, patient understory observation.',
    typical_duration: '12-16 days',
    typical_species_count: '300-400 species (40+ endemics)',
    optimal_regions: [
      'uganda-bwindi',
      'uganda-kibale',
      'uganda-rwenzori',
      'rwanda-nyungwe',
    ],
    optimal_timing: 'June-September or December-February (drier periods)',
    who_it_is_for:
      'Endemic hunters; those combining gorilla trekking with birding; experienced forest birders comfortable with challenging conditions',
    who_should_avoid:
      'Those prioritizing savannah mammals; photographers needing clean backgrounds; travelers with mobility limitations; those expecting high daily species counts',
    required_equipment: [
      'Waterproof hiking boots',
      'Rain gear',
      'Binoculars with close focus',
      'Headlamp for pre-dawn starts',
    ],
    recommended_additions: [
      'Gaiters for muddy trails',
      'Playback device (used sparingly)',
      'Compact camera for record shots',
    ],
    trade_offs: {
      gains:
        'Species found nowhere else on Earth; integration with gorilla/chimp trekking; Shoebill (Uganda); specialist guides with exceptional knowledge',
      losses:
        'Physically demanding; low daily species count in forest; challenging photography conditions; expensive forest lodge rates',
    },
    image_hint:
      'Great Blue Turaco in montane forest canopy with mist-shrouded Virunga volcanoes',
  },
  {
    id: 'photography-first',
    name: 'Bird Photography Safari',
    focus: 'photography',
    intensity: 'dedicated',
    what_it_is:
      'Optimized for photographic opportunities over species count. Dry season timing for clean backgrounds. Waterhole hides, vehicle-based stalking, and dedicated photography time at productive sites. Slow pace, extended time per subject.',
    typical_duration: '10-14 days',
    typical_species_count: '150-250 species (quality over quantity)',
    optimal_regions: [
      'south-africa-kruger',
      'botswana-chobe',
      'kenya-samburu',
      'namibia-etosha',
    ],
    optimal_timing: 'June-October (dry season)',
    who_it_is_for:
      'Serious bird photographers; those building portfolio; birders prioritizing image quality over list length; patient observers',
    who_should_avoid:
      'Listers wanting maximum species; those without telephoto equipment (400mm+); travelers unwilling to spend extended time at single locations',
    required_equipment: [
      'Camera with fast autofocus',
      'Telephoto lens (400-600mm)',
      'Sturdy tripod or bean bag',
      'Multiple memory cards',
    ],
    recommended_additions: [
      '1.4x teleconverter',
      'Flash with Better Beamer',
      'Laptop for backup and review',
      'Sensor cleaning kit',
    ],
    trade_offs: {
      gains:
        'Portfolio-quality images; predictable waterhole action; clean dry-season backgrounds; extended time with cooperative subjects',
      losses:
        'Miss green-season migrants; lower species count; pace frustrates non-photographers; equipment weight limits mobility',
    },
    image_hint:
      'Lilac-breasted roller portrait at waterhole hide with perfect catchlight',
  },
  {
    id: 'savannah-diversity',
    name: 'Classic Savannah Birding Safari',
    focus: 'savannah-diversity',
    intensity: 'dedicated',
    what_it_is:
      'Birding integrated with traditional Big Five safari. Morning drives include birding pace; afternoon focused on mammals. Savannah species with some woodland and wetland habitats. Balanced approach for mixed-interest groups.',
    typical_duration: '8-12 days',
    typical_species_count: '250-350 species',
    optimal_regions: [
      'tanzania-serengeti',
      'kenya-mara',
      'botswana-moremi',
      'south-africa-kruger',
    ],
    optimal_timing: 'Shoulder seasons (April-May, October-November)',
    who_it_is_for:
      'Birders traveling with non-birding companions; first-time Africa visitors wanting both birds and mammals; photographers seeking variety',
    who_should_avoid:
      'Serious listers wanting maximum species; endemic specialists; those frustrated by mammal-focused companions',
    required_equipment: [
      'Binoculars',
      'Field guide',
      'Camera (optional)',
      'Patience for compromises',
    ],
    recommended_additions: [
      'Bird ID app for calls',
      'Spotting scope',
      'Private vehicle arrangement',
    ],
    trade_offs: {
      gains:
        'See iconic birds and mammals; satisfies mixed groups; spectacular savannah specialties (Secretary Bird, Kori Bustard); accessible birding style',
      losses:
        'Compromised pace for serious birders; miss forest endemics; guides may lack deep birding expertise; shared vehicle dynamics',
    },
    image_hint:
      'Secretary bird striding through Serengeti grassland with wildebeest herd in background',
  },
  {
    id: 'wetland-specialist',
    name: 'Wetland and Waterbird Safari',
    focus: 'wetland-specialist',
    intensity: 'dedicated',
    what_it_is:
      'Focused on Africa\'s great wetland systems: Okavango Delta, Lake Victoria basin, Rift Valley lakes. Boat safaris, shoreline walks, and strategic waterhole positioning. Targets flamingos, herons, storks, waders, and wetland specialists.',
    typical_duration: '10-14 days',
    typical_species_count: '280-380 species',
    optimal_regions: [
      'botswana-okavango',
      'kenya-lake-naivasha',
      'uganda-mabamba',
      'zambia-bangweulu',
    ],
    optimal_timing: 'Variable by system - flooding patterns dictate timing',
    who_it_is_for:
      'Waterbird enthusiasts; those seeking Shoebill; photographers wanting reflections; birders comfortable on boats and in wet conditions',
    who_should_avoid:
      'Those uncomfortable on water; travelers wanting diverse terrestrial habitats; those seeking forest species; anyone prone to seasickness',
    required_equipment: [
      'Binoculars with waterproof housing',
      'Waterproof camera protection',
      'Quick-dry clothing',
      'Sun protection',
    ],
    recommended_additions: [
      'Polarizing filter for water photography',
      'Spotting scope with tripod',
      'Regional waterbird guide',
    ],
    trade_offs: {
      gains:
        'Spectacular concentrations; Shoebill in Uganda; flamingo flocks; excellent photography with reflections; relaxed boat-based viewing',
      losses:
        'Limited terrestrial birding; water levels unpredictable; some sites are physically challenging; miss forest and montane species',
    },
    image_hint:
      'Lesser flamingos in flight over Lake Nakuru with pink reflections on water',
  },
  {
    id: 'raptor-focus',
    name: 'Raptor Migration Safari',
    focus: 'raptor-focus',
    intensity: 'intensive',
    what_it_is:
      'Timed for raptor migration through East African flyways (September-November southbound, March-April northbound). Strategic positioning at known concentration points. Long observation sessions scanning thermals. Targets steppe eagles, buzzards, harriers, and falcons.',
    typical_duration: '7-10 days',
    typical_species_count: '180-250 species (40+ raptors)',
    optimal_regions: [
      'kenya-tsavo',
      'tanzania-tarangire',
      'ethiopia-bale',
      'israel-eilat-connection',
    ],
    optimal_timing: 'Late September to early November (peak southbound)',
    who_it_is_for:
      'Raptor specialists; experienced hawkwatchers; birders seeking passage spectacles; those with strong raptor ID skills',
    who_should_avoid:
      'Generalist birders wanting species diversity; those without raptor identification experience; travelers uncomfortable with extended scanning sessions',
    required_equipment: [
      'High-quality binoculars (10x ideal)',
      'Spotting scope essential',
      'Raptor field guide',
      'Comfortable seating for extended watches',
    ],
    recommended_additions: [
      'Camera for documentation',
      'Counter/tally device',
      'Shelter/shade equipment',
    ],
    trade_offs: {
      gains:
        'Spectacular migration counts; multiple raptor species in single thermal; uncommon passage species; unique African hawkwatching experience',
      losses:
        'Narrow timing window; weather-dependent success; patience required for slow days; miss many non-raptor species during watches',
    },
    image_hint:
      'Thermal spiral of steppe eagles and buzzards over East African savannah',
  },
];

/**
 * Get birding archetype by ID
 */
export function getBirdingArchetypeById(
  id: string
): BirdingTripArchetype | undefined {
  return birdingTripArchetypes.find((a) => a.id === id);
}

/**
 * Get birding archetypes by focus
 */
export function getBirdingArchetypesByFocus(
  focus: BirdingFocus
): BirdingTripArchetype[] {
  return birdingTripArchetypes.filter((a) => a.focus === focus);
}

/**
 * Get birding archetypes by intensity
 */
export function getBirdingArchetypesByIntensity(
  intensity: BirdingIntensity
): BirdingTripArchetype[] {
  return birdingTripArchetypes.filter((a) => a.intensity === intensity);
}

/**
 * Get birding archetypes for a specific region
 */
export function getBirdingArchetypesForRegion(
  region: string
): BirdingTripArchetype[] {
  const regionLower = region.toLowerCase();
  return birdingTripArchetypes.filter((a) =>
    a.optimal_regions.some(
      (r) =>
        r.toLowerCase().includes(regionLower) ||
        regionLower.includes(r.toLowerCase())
    )
  );
}

/**
 * Get all birding archetype IDs
 */
export function getAllBirdingArchetypeIds(): string[] {
  return birdingTripArchetypes.map((a) => a.id);
}
