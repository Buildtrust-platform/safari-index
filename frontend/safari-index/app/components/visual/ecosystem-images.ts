/**
 * Ecosystem Image Set
 *
 * Pan-African documentary imagery for Safari Index staging pages.
 *
 * PLACEHOLDER IMAGES: These paths point to /public/images/ecosystems/.
 * Replace with actual documentary photographs that meet these criteria:
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
    alt: 'Overcast savannah plain with distant acacia silhouettes at dawn',
    tags: ['savannah'],
  },
  {
    id: 'delta-channels',
    src: '/images/ecosystems/delta-channels.jpg',
    alt: 'Aerial view of winding delta channels through papyrus beds',
    tags: ['delta', 'floodplain'],
  },
  {
    id: 'desert-dunes',
    src: '/images/ecosystems/desert-dunes.jpg',
    alt: 'Red sand dunes under soft overcast light in the Namib',
    tags: ['desert'],
  },
  {
    id: 'montane-forest',
    src: '/images/ecosystems/montane-forest.jpg',
    alt: 'Mist drifting through montane forest canopy at elevation',
    tags: ['forest', 'mountains'],
  },
  {
    id: 'floodplain-evening',
    src: '/images/ecosystems/floodplain-evening.jpg',
    alt: 'Seasonal floodplain reflecting evening clouds near the Zambezi',
    tags: ['floodplain'],
  },
  {
    id: 'kopje-landscape',
    src: '/images/ecosystems/kopje-landscape.jpg',
    alt: 'Granite kopje rising from grassland under dramatic sky',
    tags: ['savannah'],
  },
  {
    id: 'woodland-clearing',
    src: '/images/ecosystems/woodland-clearing.jpg',
    alt: 'Open woodland with scattered mopane trees in dry season',
    tags: ['savannah', 'forest'],
  },
  {
    id: 'crater-highlands',
    src: '/images/ecosystems/crater-highlands.jpg',
    alt: 'Highland grassland with volcanic crater rim in distance',
    tags: ['mountains', 'savannah'],
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
    src: '/images/heroes/home-hero.jpg',
    alt: 'Expansive African savannah at golden hour with acacia trees silhouetted against warm sky',
  },
  explore: {
    id: 'explore-hero',
    src: '/images/heroes/explore-hero.jpg',
    alt: 'Wide grassland vista with scattered wildlife in the distance under open African sky',
  },
  compare: {
    id: 'compare-hero',
    src: '/images/heroes/compare-hero.jpg',
    alt: 'Two distinct African landscapes meeting at the horizon, savannah and woodland',
  },
  decision: {
    id: 'decision-hero',
    src: '/images/heroes/decision-hero.jpg',
    alt: 'Safari vehicle at a crossroads on dusty track with dramatic clouds overhead',
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
    alt: 'Endless Serengeti grassland with scattered acacia trees under dramatic sky',
    ecosystem: 'savannah',
  },
  kenya: {
    id: 'dest-kenya',
    src: '/images/destinations/kenya-mara.jpg',
    alt: 'Rolling Masai Mara hills with seasonal river cutting through golden grass',
    ecosystem: 'savannah',
  },
  botswana: {
    id: 'dest-botswana',
    src: '/images/destinations/botswana-delta.jpg',
    alt: 'Aerial view of Okavango Delta waterways threading through green islands',
    ecosystem: 'delta',
  },
  'south-africa': {
    id: 'dest-south-africa',
    src: '/images/destinations/south-africa-kruger.jpg',
    alt: 'Classic bushveld with knob-thorn acacias and dry riverbed in winter',
    ecosystem: 'savannah',
  },
  namibia: {
    id: 'dest-namibia',
    src: '/images/destinations/namibia-sossusvlei.jpg',
    alt: 'Towering red dunes of Sossusvlei casting long shadows at dawn',
    ecosystem: 'desert',
  },
  zambia: {
    id: 'dest-zambia',
    src: '/images/destinations/zambia-luangwa.jpg',
    alt: 'South Luangwa river oxbow with hippo pods and distant woodland',
    ecosystem: 'floodplain',
  },
  zimbabwe: {
    id: 'dest-zimbabwe',
    src: '/images/destinations/zimbabwe-mana.jpg',
    alt: 'Mana Pools escarpment with albida trees and Zambezi in foreground',
    ecosystem: 'floodplain',
  },
  uganda: {
    id: 'dest-uganda',
    src: '/images/destinations/uganda-bwindi.jpg',
    alt: 'Mist-shrouded Bwindi Impenetrable Forest canopy at dawn',
    ecosystem: 'forest',
  },
  rwanda: {
    id: 'dest-rwanda',
    src: '/images/destinations/rwanda-volcanoes.jpg',
    alt: 'Virunga volcanic peaks emerging from bamboo forest and morning mist',
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
    alt: 'Safari vehicle observing wildlife at dawn on African savanna',
    fallbackEcosystem: 'savannah',
    hasImage: true,
  },
  'walking-safari': {
    activityId: 'walking-safari',
    src: '/images/activities/walking-safari.jpg',
    alt: 'Small group walking single file through African bush with guide',
    fallbackEcosystem: 'savannah',
    hasImage: true,
  },
  'night-drive': {
    activityId: 'night-drive',
    src: '/images/activities/night-drive.jpg',
    alt: 'Spotlight revealing nocturnal wildlife in African bush',
    fallbackEcosystem: 'savannah',
    hasImage: true,
  },
  'boat-safari': {
    activityId: 'boat-safari',
    src: '/images/activities/boat-safari.jpg',
    alt: 'Safari boat on African river with wildlife on banks',
    fallbackEcosystem: 'delta',
    hasImage: true,
  },
  mokoro: {
    activityId: 'mokoro',
    src: '/images/activities/mokoro.jpg',
    alt: 'Traditional dugout canoe gliding through Okavango Delta channels',
    fallbackEcosystem: 'delta',
    hasImage: true,
  },
  'gorilla-trekking': {
    activityId: 'gorilla-trekking',
    src: '/images/activities/gorilla-trekking.jpg',
    alt: 'Mountain gorilla in misty bamboo forest of Virunga',
    fallbackEcosystem: 'forest',
    hasImage: true,
  },
  'chimp-tracking': {
    activityId: 'chimp-tracking',
    src: '/images/activities/chimp-tracking.jpg',
    alt: 'Rainforest canopy with dappled light in primate habitat',
    fallbackEcosystem: 'forest',
    hasImage: true,
  },
  'hot-air-balloon': {
    activityId: 'hot-air-balloon',
    src: '/images/activities/hot-air-balloon.jpg',
    alt: 'Hot air balloon floating over Serengeti plains at sunrise',
    fallbackEcosystem: 'savannah',
    hasImage: true,
  },
  'canoe-safari': {
    activityId: 'canoe-safari',
    src: '/images/activities/canoe-safari.jpg',
    alt: 'Canoes on Zambezi River with elephants on riverbank',
    fallbackEcosystem: 'floodplain',
    hasImage: true,
  },
  'fly-camping': {
    activityId: 'fly-camping',
    src: '/images/activities/fly-camping.jpg',
    alt: 'Bedroll under mosquito net with African night sky',
    fallbackEcosystem: 'savannah',
    hasImage: true,
  },
  'horseback-safari': {
    activityId: 'horseback-safari',
    src: '/images/activities/horseback-safari.jpg',
    alt: 'Riders on horseback crossing Okavango Delta waters',
    fallbackEcosystem: 'delta',
    hasImage: true,
  },
  'photographic-hide': {
    activityId: 'photographic-hide',
    src: '/images/activities/photographic-hide.jpg',
    alt: 'Ground-level hide at waterhole with approaching wildlife',
    fallbackEcosystem: 'savannah',
    hasImage: true,
  },
  'cultural-visit': {
    activityId: 'cultural-visit',
    src: '/images/activities/cultural-visit.jpg',
    alt: 'Traditional village setting in African landscape',
    fallbackEcosystem: 'savannah',
    hasImage: true,
  },
  'scenic-helicopter': {
    activityId: 'scenic-helicopter',
    src: '/images/activities/scenic-helicopter.jpg',
    alt: 'Aerial view of African landscape from helicopter',
    fallbackEcosystem: 'delta',
    hasImage: true,
  },
  fishing: {
    activityId: 'fishing',
    src: '/images/activities/fishing.jpg',
    alt: 'Angler on African river in boat with fishing rod',
    fallbackEcosystem: 'floodplain',
    hasImage: true,
  },
  'white-water-rafting': {
    activityId: 'white-water-rafting',
    src: '/images/activities/white-water-rafting.jpg',
    alt: 'Raft navigating rapids on Nile River at Jinja',
    fallbackEcosystem: 'floodplain',
    hasImage: true,
  },
  'bungee-jumping': {
    activityId: 'bungee-jumping',
    src: '/images/activities/bungee-jumping.jpg',
    alt: 'Victoria Falls Bridge with gorge and spray below',
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
