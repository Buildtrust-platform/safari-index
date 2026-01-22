/**
 * Destination Cluster Mapping
 *
 * Maps decision topics and blogs to specific destinations for Hub & Spoke SEO.
 * Each destination page becomes a cluster hub linking to relevant spokes.
 *
 * Per Hub & Spoke strategy:
 * - Every spoke links back to hub
 * - Spokes link sideways to related spokes
 * - Google sees tight relevance cluster = entity authority
 */

export interface ClusterItem {
  slug: string;
  title: string;
  type: 'decision' | 'blog' | 'guide';
  /** Brief context for why this is relevant to the destination */
  context?: string;
}

export interface DestinationCluster {
  /** Decisions specific to this destination */
  decisions: ClusterItem[];
  /** Timing/seasonality content */
  timing: ClusterItem[];
  /** Comparison content (vs other destinations) */
  comparisons: ClusterItem[];
  /** Related guides */
  guides: ClusterItem[];
}

/**
 * Destination cluster mappings
 * Each destination hub links to these spoke articles
 */
export const DESTINATION_CLUSTERS: Record<string, DestinationCluster> = {
  tanzania: {
    decisions: [
      { slug: 'tz-vs-ke', title: 'Tanzania vs Kenya for first safari', type: 'decision' },
      { slug: 'tz-vs-bw', title: 'Tanzania vs Botswana', type: 'decision' },
      { slug: 'serengeti-vs-mara', title: 'Serengeti vs Masai Mara', type: 'decision' },
      { slug: 'ngorongoro-worth', title: 'Is Ngorongoro Crater worth visiting?', type: 'decision' },
      { slug: 'budget-tanzania', title: 'Tanzania safari on a budget', type: 'decision' },
      { slug: 'migration-first-timer', title: 'Migration safari for first-timers', type: 'decision' },
    ],
    timing: [
      { slug: 'tz-feb', title: 'Tanzania in February (Calving)', type: 'decision' },
      { slug: 'tz-jul', title: 'Tanzania in July (Peak)', type: 'decision' },
      { slug: 'tz-dry-season', title: 'Tanzania dry season only?', type: 'decision' },
      { slug: 'calving-season', title: 'Calving season worth it?', type: 'decision' },
      { slug: 'migration-timing', title: 'Great Migration timing', type: 'decision' },
    ],
    comparisons: [
      { slug: 'tanzania-vs-kenya-first-safari', title: 'Tanzania vs Kenya', type: 'blog', context: 'The definitive comparison' },
      { slug: 'tanzania-vs-botswana-safari', title: 'Tanzania vs Botswana', type: 'blog', context: 'When the Delta is worth the cost' },
      { slug: 'serengeti-vs-masai-mara', title: 'Serengeti vs Mara', type: 'blog', context: 'Same ecosystem, different experience' },
    ],
    guides: [
      { slug: 'timing/great-migration-timing', title: 'Migration Timing Guide', type: 'guide' },
      { slug: 'destination-choice/tanzania-vs-kenya-first-safari', title: 'Tanzania vs Kenya Deep Dive', type: 'guide' },
    ],
  },

  kenya: {
    decisions: [
      { slug: 'tz-vs-ke', title: 'Tanzania vs Kenya for first safari', type: 'decision' },
      { slug: 'serengeti-vs-mara', title: 'Serengeti vs Masai Mara', type: 'decision' },
      { slug: 'ke-aug', title: 'Kenya in August', type: 'decision' },
      { slug: 'migration-crowds', title: 'Migration crowd tolerance', type: 'decision' },
      { slug: 'river-crossings', title: 'River crossings timing', type: 'decision' },
    ],
    timing: [
      { slug: 'ke-aug', title: 'Kenya in August (Peak crossings)', type: 'decision' },
      { slug: 'river-crossings', title: 'River crossing season', type: 'decision' },
      { slug: 'migration-timing', title: 'Great Migration timing', type: 'decision' },
    ],
    comparisons: [
      { slug: 'tanzania-vs-kenya-first-safari', title: 'Kenya vs Tanzania', type: 'blog', context: 'Conservancies vs national parks' },
      { slug: 'serengeti-vs-masai-mara', title: 'Mara vs Serengeti', type: 'blog', context: 'Why the Mara wins July-October' },
    ],
    guides: [
      { slug: 'timing/kenya-safari-august', title: 'August Safari Guide', type: 'guide' },
      { slug: 'timing/mara-river-crossings-timing', title: 'River Crossings Guide', type: 'guide' },
    ],
  },

  botswana: {
    decisions: [
      { slug: 'tz-vs-bw', title: 'Tanzania vs Botswana', type: 'decision' },
      { slug: 'okavango-worth', title: 'Is the Okavango Delta worth the premium?', type: 'decision' },
      { slug: 'bw-jun', title: 'Botswana in June', type: 'decision' },
      { slug: 'bw-peak-flood', title: 'Peak flood season timing', type: 'decision' },
      { slug: 'mokoro-canoe', title: 'Mokoro experience worth it?', type: 'decision' },
    ],
    timing: [
      { slug: 'bw-jun', title: 'Botswana in June', type: 'decision' },
      { slug: 'bw-peak-flood', title: 'Okavango flood timing', type: 'decision' },
      { slug: 'green-season-value', title: 'Green season value', type: 'decision' },
    ],
    comparisons: [
      { slug: 'tanzania-vs-botswana-safari', title: 'Botswana vs Tanzania', type: 'blog', context: 'Water safari vs migration' },
      { slug: 'okavango-delta-worth-premium', title: 'Is the Delta worth it?', type: 'blog', context: 'The honest cost breakdown' },
    ],
    guides: [
      { slug: 'destination-choice/okavango-delta-worth-premium', title: 'Okavango Guide', type: 'guide' },
    ],
  },

  'south-africa': {
    decisions: [
      { slug: 'sa-vs-ea', title: 'South Africa vs East Africa', type: 'decision' },
      { slug: 'kruger-vs-private', title: 'Kruger vs private reserves', type: 'decision' },
      { slug: 'self-drive-safari', title: 'Self-drive safari viable?', type: 'decision' },
      { slug: 'malaria-decision', title: 'Malaria-free safari options', type: 'decision' },
    ],
    timing: [
      { slug: 'green-season-value', title: 'Green season value', type: 'decision' },
      { slug: 'peak-vs-value', title: 'Peak vs value season', type: 'decision' },
    ],
    comparisons: [
      { slug: 'south-africa-vs-east-africa-safari', title: 'South Africa vs East Africa', type: 'blog', context: 'Accessibility vs wilderness' },
      { slug: 'kruger-vs-private-reserves', title: 'Kruger vs Sabi Sands', type: 'blog', context: 'Why private reserves cost more' },
    ],
    guides: [
      { slug: 'destination-choice/kruger-vs-private-reserves', title: 'Kruger Guide', type: 'guide' },
    ],
  },

  rwanda: {
    decisions: [
      { slug: 'rwanda-gorillas-worth', title: 'Are Rwanda gorillas worth $1,500?', type: 'decision' },
      { slug: 'uganda-vs-rwanda', title: 'Uganda vs Rwanda for gorillas', type: 'decision' },
    ],
    timing: [
      { slug: 'green-season-value', title: 'Best time for gorillas', type: 'decision' },
    ],
    comparisons: [
      { slug: 'uganda-vs-rwanda-gorillas', title: 'Uganda vs Rwanda', type: 'blog', context: 'The $700 price difference explained' },
      { slug: 'rwanda-gorillas-worth-it', title: 'Is Rwanda worth it?', type: 'blog', context: 'Premium price, premium experience' },
    ],
    guides: [
      { slug: 'destination-choice/rwanda-gorillas-worth-it', title: 'Rwanda Gorilla Guide', type: 'guide' },
    ],
  },

  uganda: {
    decisions: [
      { slug: 'uganda-vs-rwanda', title: 'Uganda vs Rwanda for gorillas', type: 'decision' },
      { slug: 'uganda-vs-tanzania-endemic-birding', title: 'Uganda birding vs Tanzania', type: 'decision' },
    ],
    timing: [
      { slug: 'green-season-value', title: 'Best time for gorillas', type: 'decision' },
    ],
    comparisons: [
      { slug: 'uganda-vs-rwanda-gorillas', title: 'Uganda vs Rwanda', type: 'blog', context: 'Value alternative with chimps' },
    ],
    guides: [],
  },

  namibia: {
    decisions: [
      { slug: 'self-drive-safari', title: 'Self-drive in Namibia', type: 'decision' },
      { slug: 'fly-vs-drive', title: 'Fly vs drive between locations', type: 'decision' },
    ],
    timing: [
      { slug: 'green-season-value', title: 'Green season value', type: 'decision' },
    ],
    comparisons: [],
    guides: [],
  },

  zambia: {
    decisions: [
      { slug: 'walking-safari', title: 'Walking safari worth it?', type: 'decision' },
    ],
    timing: [
      { slug: 'green-season-value', title: 'Emerald season value', type: 'decision' },
    ],
    comparisons: [],
    guides: [],
  },
};

/**
 * Get cluster data for a destination
 */
export function getDestinationCluster(destinationId: string): DestinationCluster | null {
  return DESTINATION_CLUSTERS[destinationId] || null;
}

/**
 * Get all spoke articles for a destination (flattened)
 */
export function getAllClusterSpokes(destinationId: string): ClusterItem[] {
  const cluster = DESTINATION_CLUSTERS[destinationId];
  if (!cluster) return [];

  return [
    ...cluster.decisions,
    ...cluster.timing,
    ...cluster.comparisons,
    ...cluster.guides,
  ];
}

/**
 * Count total spokes for a destination
 */
export function getClusterSpokeCount(destinationId: string): number {
  return getAllClusterSpokes(destinationId).length;
}
