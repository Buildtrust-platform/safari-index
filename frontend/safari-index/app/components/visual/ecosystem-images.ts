/**
 * Ecosystem Image Set
 *
 * Pan-African documentary imagery for Safari Index staging pages.
 *
 * Licensed images from Envato Elements. These paths point to /public/images/ecosystems/.
 *
 * Requirements (per 01_brand_voice.md):
 * - Documentary/observational style
 * - No animals facing camera directly
 * - No tourists visible
 * - No lodges or commercial structures
 * - Focus on landscape, atmosphere, environment
 * - Natural lighting preferred
 *
 * Recommended sources:
 * - Unsplash (filter by safari, savannah, African landscape)
 * - Licensed stock photography
 * - Original documentary photography
 *
 * Image specs:
 * - Minimum 1920x1080 resolution
 * - Landscape orientation
 * - JPG or WebP format for performance
 */

export interface EcosystemImage {
  id: string;
  src: string;
  alt: string;
  tags: Array<'savannah' | 'delta' | 'desert' | 'forest' | 'floodplain' | 'mountains'>;
}

/**
 * Curated ecosystem images for environmental context.
 * Alt text follows documentary/observational style.
 */
export const ecosystemImages: EcosystemImage[] = [
  {
    id: 'savannah-morning',
    src: '/images/ecosystems/savannah-morning.jpg',
    alt: 'Three giraffes standing in golden African savannah grassland at dawn',
    tags: ['savannah'],
  },
  {
    id: 'delta-channels',
    src: '/images/ecosystems/delta-channels.jpg',
    alt: 'Aerial view of Okavango Delta waterways winding through lush green islands',
    tags: ['delta', 'floodplain'],
  },
  {
    id: 'desert-dunes',
    src: '/images/ecosystems/desert-dunes.jpg',
    alt: 'Vast Namib Desert landscape with red sand dunes stretching to horizon',
    tags: ['desert'],
  },
  {
    id: 'montane-forest',
    src: '/images/ecosystems/montane-forest.jpg',
    alt: 'Chimpanzee in natural montane forest habitat among green foliage',
    tags: ['forest', 'mountains'],
  },
  {
    id: 'floodplain-evening',
    src: '/images/ecosystems/floodplain-evening.jpg',
    alt: 'Hippopotamus in Botswana river at sunset with golden light reflections',
    tags: ['floodplain'],
  },
  {
    id: 'kopje-landscape',
    src: '/images/ecosystems/kopje-landscape.jpg',
    alt: 'Baboon Rock kopje rising from Laikipia savannah in Kenya',
    tags: ['savannah'],
  },
  {
    id: 'woodland-clearing',
    src: '/images/ecosystems/woodland-clearing.jpg',
    alt: 'Busy waterhole in Etosha National Park with zebras and other wildlife',
    tags: ['savannah', 'forest'],
  },
  {
    id: 'crater-highlands',
    src: '/images/ecosystems/crater-highlands.jpg',
    alt: 'Wildebeest grazing in Ngorongoro Crater with misty highlands in background',
    tags: ['mountains', 'savannah'],
  },
  {
    id: 'savannah-wildlife',
    src: '/images/ecosystems/savannah-wildlife.jpg',
    alt: 'Wild giraffes and zebras together on the African plains',
    tags: ['savannah'],
  },
];

/**
 * Get images by ecosystem tag
 */
export function getImagesByTag(
  tag: EcosystemImage['tags'][number]
): EcosystemImage[] {
  return ecosystemImages.filter((img) => img.tags.includes(tag));
}

/**
 * Get a single image by ID
 */
export function getImageById(id: string): EcosystemImage | undefined {
  return ecosystemImages.find((img) => img.id === id);
}

/**
 * Get a random image, optionally filtered by tag
 */
export function getRandomImage(
  tag?: EcosystemImage['tags'][number]
): EcosystemImage {
  const pool = tag ? getImagesByTag(tag) : ecosystemImages;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index] || ecosystemImages[0];
}

/**
 * Hero images for page-specific contexts
 * Higher resolution versions for full-width display
 */
export interface HeroImage {
  id: string;
  src: string;
  alt: string;
}

export const heroImages: Record<string, HeroImage> = {
  home: {
    id: 'home-hero',
    src: '/images/heroes/migration-hero.jpg',
    alt: 'Dramatic wildebeest river crossing during the Great Migration in Kenya',
  },
  explore: {
    id: 'explore-hero',
    src: '/images/heroes/explore-hero.jpg',
    alt: 'The Great Migration - vast herds of wildebeest crossing the African savannah',
  },
  migration: {
    id: 'migration-hero',
    src: '/images/heroes/migration-hero.jpg',
    alt: 'Dramatic wildebeest river crossing during the Great Migration in Kenya',
  },
  compare: {
    id: 'compare-hero',
    src: '/images/heroes/compare-hero.jpg',
    alt: 'African safari landscape with scattered wildlife under vast open sky',
  },
  decision: {
    id: 'decision-hero',
    src: '/images/heroes/decision-hero.jpg',
    alt: 'Dirt road through African savannah grassland with acacia trees',
  },
};

/**
 * Default images for specific page contexts
 * (Deterministic selection for consistency)
 */
export const pageImages = {
  home: heroImages.home,
  explore: heroImages.explore,
  compare: heroImages.compare,
  decision: heroImages.decision,
  howItWorks: ecosystemImages[3], // montane-forest - contemplative
} as const;

// ============================================================================
// Destination Images
// ============================================================================

/**
 * Destination-specific hero images
 *
 * Documentary treatment: landscape-first, no posed tourists, no lodges.
 * These are the primary visual for destination hubs and profiles.
 */
export interface DestinationImage {
  id: string;
  src: string;
  alt: string;
  /** Ecosystem tag for fallback matching */
  ecosystem: EcosystemImage['tags'][number];
}

export const destinationImages: Record<string, DestinationImage> = {
  tanzania: {
    id: 'dest-tanzania',
    src: '/images/destinations/tanzania-serengeti.jpg',
    alt: 'Herds of wildebeest grazing in the Serengeti National Park, Tanzania',
    ecosystem: 'savannah',
  },
  'tanzania-ngorongoro': {
    id: 'dest-tanzania-ngorongoro',
    src: '/images/destinations/tanzania-ngorongoro.jpg',
    alt: 'Herd of African buffaloes grazing in Ngorongoro Crater, Tanzania',
    ecosystem: 'savannah',
  },
  kenya: {
    id: 'dest-kenya',
    src: '/images/destinations/kenya-mara.jpg',
    alt: 'Sweeping landscape of Masai Mara National Reserve, Kenya',
    ecosystem: 'savannah',
  },
  botswana: {
    id: 'dest-botswana',
    src: '/images/destinations/botswana-delta.jpg',
    alt: 'Elephants wading through the Okavango Delta waters, Botswana',
    ecosystem: 'delta',
  },
  'south-africa': {
    id: 'dest-south-africa',
    src: '/images/destinations/south-africa-kruger.jpg',
    alt: 'Plains zebras in Kruger National Park, South Africa',
    ecosystem: 'savannah',
  },
  namibia: {
    id: 'dest-namibia',
    src: '/images/destinations/namibia-sossusvlei.jpg',
    alt: 'Aerial view of the vast Namib Desert landscape, Namibia',
    ecosystem: 'desert',
  },
  zambia: {
    id: 'dest-zambia',
    src: '/images/destinations/zambia-luangwa.jpg',
    alt: 'Hippopotamus in river waters of South Luangwa, Zambia',
    ecosystem: 'floodplain',
  },
  zimbabwe: {
    id: 'dest-zimbabwe',
    src: '/images/destinations/zimbabwe-mana.jpg',
    alt: 'Golden sunset over Zimbabwe landscape with silhouetted trees',
    ecosystem: 'floodplain',
  },
  uganda: {
    id: 'dest-uganda',
    src: '/images/destinations/uganda-bwindi.jpg',
    alt: 'Lush green rainforest canopy of Bwindi Impenetrable Forest, Uganda',
    ecosystem: 'forest',
  },
  rwanda: {
    id: 'dest-rwanda',
    src: '/images/destinations/rwanda-volcanoes.jpg',
    alt: 'Mountain gorilla in natural habitat in Volcanoes National Park, Rwanda',
    ecosystem: 'mountains',
  },
  'south-africa-lodge': {
    id: 'dest-south-africa-lodge',
    src: '/images/destinations/south-africa-lodge.jpg',
    alt: 'Safari lodge in the Drakensberg mountains, South Africa',
    ecosystem: 'mountains',
  },
};

/**
 * Get destination image by ID, with fallback to ecosystem match
 */
export function getDestinationImage(destinationId: string): DestinationImage | EcosystemImage {
  const dest = destinationImages[destinationId.toLowerCase()];
  if (dest) return dest;

  // Fallback: try to match by common naming patterns
  const normalized = destinationId.toLowerCase().replace(/-/g, '');
  for (const [key, img] of Object.entries(destinationImages)) {
    if (normalized.includes(key.replace(/-/g, ''))) {
      return img;
    }
  }

  // Ultimate fallback: return first savannah ecosystem image
  return getImagesByTag('savannah')[0] || ecosystemImages[0];
}

// ============================================================================
// Activity Images (Placeholder Strategy)
// ============================================================================

/**
 * Activity image hints and placeholder references
 *
 * STRATEGY: Activities use image_hint text fields in activity-primitives.ts.
 * This registry provides optional upgrade paths when real images are added.
 *
 * Until real images are available, components should:
 * 1. Use ecosystem images as contextual backgrounds
 * 2. Display image_hint text as caption/alt guidance
 * 3. Not block rendering on missing assets
 */
export interface ActivityImageRef {
  activityId: string;
  /** Path to image when available */
  src: string | null;
  /** Alt text for accessibility */
  alt: string;
  /** Fallback ecosystem tag */
  fallbackEcosystem: EcosystemImage['tags'][number];
  /** Whether real image is available */
  hasImage: boolean;
}

/**
 * Activity image registry - upgrade-safe placeholders
 *
 * Set hasImage: true and provide src when real documentary images are added.
 * Components check hasImage before rendering activity-specific images.
 */
export const activityImageRefs: Record<string, ActivityImageRef> = {
  'game-drive': {
    activityId: 'game-drive',
    src: '/images/activities/game-drive.jpg',
    alt: 'Safari touring vehicle among wildebeest and zebras on game drive',
    fallbackEcosystem: 'savannah',
    hasImage: true,
  },
  'wildlife-viewing': {
    activityId: 'wildlife-viewing',
    src: '/images/activities/wildlife-viewing.jpg',
    alt: 'Cheetah family resting in African savannah grassland',
    fallbackEcosystem: 'savannah',
    hasImage: true,
  },
  'big-cats': {
    activityId: 'big-cats',
    src: '/images/activities/big-cats.jpg',
    alt: 'Pride of lions walking towards the camera in African savannah',
    fallbackEcosystem: 'savannah',
    hasImage: true,
  },
  'river-crossing': {
    activityId: 'river-crossing',
    src: '/images/activities/river-crossing.jpg',
    alt: 'Zebra dashing through water during wildebeest migration river crossing',
    fallbackEcosystem: 'floodplain',
    hasImage: true,
  },
  migration: {
    activityId: 'migration',
    src: '/images/activities/migration.jpg',
    alt: 'Wildebeest and zebras jumping during Great Migration river crossing',
    fallbackEcosystem: 'savannah',
    hasImage: true,
  },
  'walking-safari': {
    activityId: 'walking-safari',
    src: '/images/activities/walking-safari.jpg',
    alt: 'Safari tourists on guided game drive in Serengeti savannah',
    fallbackEcosystem: 'savannah',
    hasImage: true,
  },
  'night-drive': {
    activityId: 'night-drive',
    src: '/images/activities/night-drive.jpg',
    alt: 'Black rhinos at artificially lit waterhole during night safari',
    fallbackEcosystem: 'savannah',
    hasImage: true,
  },
  'boat-safari': {
    activityId: 'boat-safari',
    src: '/images/activities/boat-safari.jpg',
    alt: 'Boat with tourists watching African elephants from the water',
    fallbackEcosystem: 'delta',
    hasImage: true,
  },
  mokoro: {
    activityId: 'mokoro',
    src: '/images/activities/mokoro.jpg',
    alt: 'People sailing traditional boats through calm waters',
    fallbackEcosystem: 'delta',
    hasImage: true,
  },
  'gorilla-trekking': {
    activityId: 'gorilla-trekking',
    src: '/images/activities/gorilla-trekking.jpg',
    alt: 'Group of mountain gorillas in Rwanda rainforest habitat',
    fallbackEcosystem: 'forest',
    hasImage: true,
  },
  'chimp-tracking': {
    activityId: 'chimp-tracking',
    src: '/images/activities/chimp-tracking.jpg',
    alt: 'Chimpanzee mother and child in natural forest habitat',
    fallbackEcosystem: 'forest',
    hasImage: true,
  },
  'hot-air-balloon': {
    activityId: 'hot-air-balloon',
    src: '/images/activities/hot-air-balloon.jpg',
    alt: 'Hot air balloon safari over Masai Mara National Reserve, Kenya',
    fallbackEcosystem: 'savannah',
    hasImage: true,
  },
  'canoe-safari': {
    activityId: 'canoe-safari',
    src: '/images/activities/canoe-safari.jpg',
    alt: 'Woman wading through water pushing traditional canoe',
    fallbackEcosystem: 'floodplain',
    hasImage: true,
  },
  'fly-camping': {
    activityId: 'fly-camping',
    src: '/images/activities/fly-camping.jpg',
    alt: 'Milky Way galaxy over Lake Naivasha camp under African night sky',
    fallbackEcosystem: 'savannah',
    hasImage: true,
  },
  'horseback-safari': {
    activityId: 'horseback-safari',
    src: '/images/activities/horseback-safari.jpg',
    alt: 'Zebra herd crossing the Mara River during migration',
    fallbackEcosystem: 'savannah',
    hasImage: true,
  },
  'photographic-hide': {
    activityId: 'photographic-hide',
    src: '/images/activities/photographic-hide.jpg',
    alt: 'African elephant at waterhole from ground-level hide perspective',
    fallbackEcosystem: 'savannah',
    hasImage: true,
  },
  'cultural-visit': {
    activityId: 'cultural-visit',
    src: '/images/activities/cultural-visit.jpg',
    alt: 'Traditional dance performance in African village',
    fallbackEcosystem: 'savannah',
    hasImage: true,
  },
  'scenic-helicopter': {
    activityId: 'scenic-helicopter',
    src: '/images/activities/scenic-helicopter.jpg',
    alt: 'Aerial view of elephant herd from scenic helicopter flight',
    fallbackEcosystem: 'delta',
    hasImage: true,
  },
  fishing: {
    activityId: 'fishing',
    src: '/images/activities/fishing.jpg',
    alt: 'African women fishing from traditional boat on river',
    fallbackEcosystem: 'floodplain',
    hasImage: true,
  },
  'white-water-rafting': {
    activityId: 'white-water-rafting',
    src: '/images/activities/white-water-rafting.jpg',
    alt: 'Team navigating white water rapids on African river',
    fallbackEcosystem: 'floodplain',
    hasImage: true,
  },
  'bungee-jumping': {
    activityId: 'bungee-jumping',
    src: '/images/activities/bungee-jumping.jpg',
    alt: 'Majestic waterfall cascading into mist-covered gorge',
    fallbackEcosystem: 'floodplain',
    hasImage: true,
  },
};

/**
 * Get activity image reference with fallback
 */
export function getActivityImageRef(activityId: string): ActivityImageRef | null {
  return activityImageRefs[activityId] || null;
}

/**
 * Get fallback ecosystem image for an activity
 */
export function getActivityFallbackImage(activityId: string): EcosystemImage {
  const ref = activityImageRefs[activityId];
  if (ref) {
    const images = getImagesByTag(ref.fallbackEcosystem);
    if (images.length > 0) return images[0];
  }
  return ecosystemImages[0];
}
