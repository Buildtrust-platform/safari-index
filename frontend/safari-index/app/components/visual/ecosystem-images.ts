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
