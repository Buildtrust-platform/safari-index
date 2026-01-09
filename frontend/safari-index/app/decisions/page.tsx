/**
 * Decisions Hub Page
 *
 * Authoritative index for Safari Index's decision library.
 * Organizes P0 decision topics by domain (bucket).
 *
 * Redesigned with:
 * - Visual category headers with ecosystem imagery
 * - Featured decisions section
 * - Card-based topic grid
 * - Improved visual hierarchy
 *
 * Role:
 * - Authority index for all published decisions
 * - User orientation layer for planning domains
 * - Crawl and internal-linking control surface
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import {
  MapPin,
  Calendar,
  Compass,
  Tent,
  Plane,
  Shield,
  DollarSign,
  Users,
  ArrowRight,
  ChevronRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  topicInventory,
  TOPIC_BUCKETS,
  type TopicBucket,
  type TopicInventoryItem,
} from '../content/topic-inventory';
import { generateSlugFromId } from '../content/p0-topics-bridge';
import { ImageBand, ImageBandContent, pageImages, ecosystemImages } from '../components/visual';
import { Navbar, Footer } from '../components/layout';
import { SearchAndFilters } from '../components/SearchAndFilters';

/**
 * SEO Metadata - indexable with canonical
 */
export const metadata: Metadata = {
  title: 'Safari Decisions | Safari Index',
  description:
    'Explore safari planning decisions across 8 domains: destinations, timing, experience types, accommodation, logistics, and more. Clear verdicts to guide your trip.',
  robots: 'index, follow',
  alternates: {
    canonical: '/decisions',
  },
};

/**
 * Bucket display metadata with icons, images, and framing copy
 */
const BUCKET_CONFIG: Record<
  TopicBucket,
  {
    title: string;
    anchorId: string;
    framingCopy: string;
    icon: React.ElementType;
    imageIndex: number;
  }
> = {
  personal_fit: {
    title: 'Personal Fit',
    anchorId: 'personal-fit',
    framingCopy: 'Is safari right for you? Assess expectations, travel style, and group needs.',
    icon: Users,
    imageIndex: 3, // montane-forest
  },
  destination_choice: {
    title: 'Destinations',
    anchorId: 'destination-choice',
    framingCopy: 'Where should you go? Compare countries, parks, and regions.',
    icon: MapPin,
    imageIndex: 0, // savannah-morning
  },
  timing: {
    title: 'Timing',
    anchorId: 'timing',
    framingCopy: 'When to travel? Wildlife, weather, crowds, and cost vary by month.',
    icon: Calendar,
    imageIndex: 4, // floodplain-evening
  },
  experience_type: {
    title: 'Experience Type',
    anchorId: 'experience-type',
    framingCopy: 'What kind of safari? Walking, self-drive, or guided options.',
    icon: Compass,
    imageIndex: 5, // kopje-landscape
  },
  accommodation: {
    title: 'Accommodation',
    anchorId: 'accommodation',
    framingCopy: 'Where to stay? Lodges, tented camps, and budget options.',
    icon: Tent,
    imageIndex: 6, // woodland-clearing
  },
  logistics: {
    title: 'Logistics',
    anchorId: 'logistics',
    framingCopy: 'How to plan? Trip length, flights, and booking mechanics.',
    icon: Plane,
    imageIndex: 7, // crater-highlands
  },
  risk_ethics: {
    title: 'Risk & Ethics',
    anchorId: 'risk-ethics',
    framingCopy: 'What to consider? Health, safety, and responsible travel.',
    icon: Shield,
    imageIndex: 2, // desert-dunes
  },
  value_cost: {
    title: 'Value & Cost',
    anchorId: 'value-cost',
    framingCopy: 'What does it cost? Set budgets and allocate spending wisely.',
    icon: DollarSign,
    imageIndex: 1, // delta-channels
  },
};

/**
 * Topic-specific image mapping
 * Each decision topic gets a unique, relevant image to avoid repetition
 */
const topicImageMap: Record<string, { src: string; alt: string }> = {
  // Personal Fit topics
  'first-timer-ready': {
    src: '/images/ecosystems/savannah-morning.jpg',
    alt: 'Three giraffes standing in golden African savannah grassland at dawn',
  },
  'solo-safari-fit': {
    src: '/images/activities/game-drive.jpg',
    alt: 'Safari vehicle observing wildlife on an early morning game drive',
  },
  'family-young-kids': {
    src: '/images/ecosystems/savannah-wildlife.jpg',
    alt: 'Wild giraffes and zebras together on the African plains',
  },
  'family-teens': {
    src: '/images/activities/walking-safari.jpg',
    alt: 'Guided walking safari through African bush with armed ranger',
  },
  multigenerational: {
    src: '/images/destinations/tanzania-serengeti.jpg',
    alt: 'Herds of wildebeest grazing in the Serengeti National Park, Tanzania',
  },
  'mobility-challenges': {
    src: '/images/destinations/south-africa-kruger.jpg',
    alt: 'Leopard resting on a tree branch in Kruger National Park',
  },
  'honeymoon-fit': {
    src: '/images/ecosystems/floodplain-evening.jpg',
    alt: 'Hippopotamus in Botswana river at sunset with golden light reflections',
  },
  'anniversary-trip': {
    src: '/images/ecosystems/floodplain-evening.jpg',
    alt: 'Romantic sunset over the African floodplains',
  },
  'photographer-fit': {
    src: '/images/activities/wildlife-viewing.jpg',
    alt: 'Cheetah family resting in African savannah grassland',
  },
  'adventure-seeker': {
    src: '/images/activities/hot-air-balloon.jpg',
    alt: 'Hot air balloon floating over the Masai Mara at sunrise',
  },
  'repeat-visitor-value': {
    src: '/images/destinations/botswana-delta.jpg',
    alt: 'Aerial view of the Okavango Delta waterways and islands, Botswana',
  },
  'wildlife-expectation': {
    src: '/images/activities/big-cats.jpg',
    alt: 'Pride of lions walking towards the camera in African savannah',
  },
  // Destination Choice topics
  'tz-vs-ke': {
    src: '/images/destinations/kenya-mara.jpg',
    alt: 'Lions resting in the golden grass of the Masai Mara, Kenya',
  },
  'tz-vs-bw': {
    src: '/images/destinations/botswana-delta.jpg',
    alt: 'Okavango Delta waterways, Botswana',
  },
  'ke-vs-bw': {
    src: '/images/ecosystems/delta-channels.jpg',
    alt: 'Aerial view of Okavango Delta waterways winding through lush green islands',
  },
  'sa-vs-ea': {
    src: '/images/destinations/south-africa-kruger.jpg',
    alt: 'South African wildlife safari experience',
  },
  'rwanda-gorillas-worth': {
    src: '/images/activities/gorilla-trekking.jpg',
    alt: 'Group of mountain gorillas in Rwanda rainforest habitat',
  },
  'uganda-vs-rwanda': {
    src: '/images/destinations/uganda-bwindi.jpg',
    alt: 'Primate habitat in Ugandan forest',
  },
  'namibia-different': {
    src: '/images/destinations/namibia-sossusvlei.jpg',
    alt: 'Towering red sand dunes of Sossusvlei at sunrise, Namibia',
  },
  'zambia-value': {
    src: '/images/destinations/zambia-luangwa.jpg',
    alt: 'Walking safari guide leading guests through the South Luangwa bush',
  },
  'zimbabwe-safe': {
    src: '/images/destinations/zimbabwe-mana.jpg',
    alt: 'Wildlife at Mana Pools National Park, Zimbabwe',
  },
  'okavango-worth': {
    src: '/images/activities/boat-safari.jpg',
    alt: 'Safari boat cruising past hippos in African river',
  },
  'serengeti-vs-mara': {
    src: '/images/activities/migration.jpg',
    alt: 'Wildebeest and zebras jumping during Great Migration river crossing',
  },
  'ngorongoro-worth': {
    src: '/images/destinations/tanzania-ngorongoro.jpg',
    alt: 'Panoramic view of Ngorongoro Crater from the rim, Tanzania',
  },
  'kruger-vs-private': {
    src: '/images/activities/night-drive.jpg',
    alt: 'Spotlight illuminating wildlife during an evening game drive',
  },
  'single-country-multi': {
    src: '/images/activities/scenic-helicopter.jpg',
    alt: 'Scenic flight over vast African wilderness landscape',
  },
  'off-beaten-path': {
    src: '/images/ecosystems/woodland-clearing.jpg',
    alt: 'Woodland clearing with filtered sunlight in African bush',
  },
  // Timing topics
  'tz-dry-season': {
    src: '/images/destinations/tanzania-serengeti.jpg',
    alt: 'Herds of wildebeest grazing in the Serengeti National Park, Tanzania',
  },
  'migration-timing': {
    src: '/images/activities/river-crossing.jpg',
    alt: 'Wildebeest crossing the Mara River during the Great Migration',
  },
  'river-crossings': {
    src: '/images/activities/migration.jpg',
    alt: 'Wildebeest and zebras jumping during Great Migration river crossing',
  },
  'calving-season': {
    src: '/images/ecosystems/savannah-morning.jpg',
    alt: 'Three giraffes standing in golden African savannah grassland at dawn',
  },
  'green-season-value': {
    src: '/images/ecosystems/montane-forest.jpg',
    alt: 'Lush green montane forest with misty atmosphere',
  },
  'shoulder-season': {
    src: '/images/ecosystems/floodplain-evening.jpg',
    alt: 'Hippopotamus in Botswana river at sunset with golden light reflections',
  },
  'christmas-safari': {
    src: '/images/ecosystems/savannah-wildlife.jpg',
    alt: 'Wildlife on the African plains during holiday season',
  },
  'school-holidays': {
    src: '/images/ecosystems/savannah-wildlife.jpg',
    alt: 'Wild giraffes and zebras together on the African plains',
  },
  'tz-feb': {
    src: '/images/destinations/tanzania-ngorongoro.jpg',
    alt: 'Panoramic view of Ngorongoro Crater from the rim, Tanzania',
  },
  'tz-jul': {
    src: '/images/activities/game-drive.jpg',
    alt: 'Safari vehicle observing wildlife on an early morning game drive',
  },
  'ke-aug': {
    src: '/images/destinations/kenya-mara.jpg',
    alt: 'Lions resting in the golden grass of the Masai Mara, Kenya',
  },
  'bw-jun': {
    src: '/images/destinations/botswana-delta.jpg',
    alt: 'Aerial view of the Okavango Delta waterways and islands, Botswana',
  },
  'bw-peak-flood': {
    src: '/images/ecosystems/delta-channels.jpg',
    alt: 'Aerial view of Okavango Delta waterways winding through lush green islands',
  },
  'sa-winter': {
    src: '/images/destinations/south-africa-kruger.jpg',
    alt: 'Leopard resting on a tree branch in Kruger National Park',
  },
  'rain-impact': {
    src: '/images/ecosystems/kopje-landscape.jpg',
    alt: 'Rocky kopje outcrop in African savannah landscape',
  },
  'last-minute-timing': {
    src: '/images/ecosystems/savannah-morning.jpg',
    alt: 'Golden savannah at dawn',
  },
  'booking-lead-time': {
    src: '/images/activities/scenic-helicopter.jpg',
    alt: 'Light aircraft flying over vast African wilderness landscape',
  },
  'weather-unpredictable': {
    src: '/images/ecosystems/crater-highlands.jpg',
    alt: 'Dramatic crater highlands landscape with volcanic features',
  },
  // Experience Type topics
  'walking-safari': {
    src: '/images/activities/walking-safari.jpg',
    alt: 'Guided walking safari through African bush with armed ranger',
  },
  'night-drives': {
    src: '/images/activities/night-drive.jpg',
    alt: 'Black rhinos at artificially lit waterhole during night safari',
  },
  'balloon-safari': {
    src: '/images/activities/hot-air-balloon.jpg',
    alt: 'Hot air balloon floating over the Masai Mara at sunrise',
  },
  'mokoro-canoe': {
    src: '/images/activities/mokoro.jpg',
    alt: 'Traditional mokoro canoe on the Okavango Delta',
  },
  'photo-safari-vs-regular': {
    src: '/images/activities/photographic-hide.jpg',
    alt: 'African elephant at waterhole from ground-level hide perspective',
  },
  'fly-camping': {
    src: '/images/activities/fly-camping.jpg',
    alt: 'Milky Way galaxy over Lake Naivasha camp under African night sky',
  },
  'mobile-vs-fixed': {
    src: '/images/ecosystems/savannah-morning.jpg',
    alt: 'Three giraffes standing in golden African savannah grassland at dawn',
  },
  'self-drive-safari': {
    src: '/images/ecosystems/desert-dunes.jpg',
    alt: 'Self-drive through dramatic African landscapes',
  },
  'private-vs-shared': {
    src: '/images/activities/game-drive.jpg',
    alt: 'Safari vehicle observing wildlife on an early morning game drive',
  },
  'group-tour-value': {
    src: '/images/ecosystems/savannah-wildlife.jpg',
    alt: 'Wild giraffes and zebras together on the African plains',
  },
  'conservation-experience': {
    src: '/images/activities/chimp-tracking.jpg',
    alt: 'Chimpanzee in tropical forest canopy',
  },
  'cultural-component': {
    src: '/images/activities/cultural-visit.jpg',
    alt: 'Traditional Maasai village cultural experience',
  },
  // Accommodation topics
  'lodge-vs-tented': {
    src: '/images/ecosystems/woodland-clearing.jpg',
    alt: 'Woodland clearing with filtered sunlight in African bush',
  },
  'luxury-worth-it': {
    src: '/images/destinations/south-africa-lodge.jpg',
    alt: 'Luxury safari lodge with scenic views',
  },
  'budget-accommodation-ok': {
    src: '/images/ecosystems/savannah-morning.jpg',
    alt: 'Three giraffes standing in golden African savannah grassland at dawn',
  },
  'inside-vs-outside-park': {
    src: '/images/destinations/tanzania-serengeti.jpg',
    alt: 'Herds of wildebeest grazing in the Serengeti National Park, Tanzania',
  },
  'all-inclusive-value': {
    src: '/images/ecosystems/floodplain-evening.jpg',
    alt: 'Hippopotamus in Botswana river at sunset with golden light reflections',
  },
  'camp-hopping': {
    src: '/images/activities/scenic-helicopter.jpg',
    alt: 'Light aircraft flying over vast African wilderness landscape',
  },
  'family-rooms': {
    src: '/images/ecosystems/savannah-wildlife.jpg',
    alt: 'Wild giraffes and zebras together on the African plains',
  },
  'private-pool-villa': {
    src: '/images/destinations/botswana-delta.jpg',
    alt: 'Luxury delta setting perfect for private villas',
  },
  'small-vs-large-camp': {
    src: '/images/activities/wildlife-viewing.jpg',
    alt: 'Cheetah family resting in African savannah grassland',
  },
  'owner-run-camps': {
    src: '/images/ecosystems/kopje-landscape.jpg',
    alt: 'Rocky kopje outcrop in African savannah landscape',
  },
  'treehouse-unique': {
    src: '/images/ecosystems/montane-forest.jpg',
    alt: 'Lush green montane forest with misty atmosphere',
  },
  // Logistics topics
  'trip-length': {
    src: '/images/activities/game-drive.jpg',
    alt: 'Safari vehicle observing wildlife on an early morning game drive',
  },
  'ideal-length': {
    src: '/images/destinations/kenya-mara.jpg',
    alt: 'Lions resting in the golden grass of the Masai Mara, Kenya',
  },
  'fly-vs-drive': {
    src: '/images/activities/scenic-helicopter.jpg',
    alt: 'Scenic flight over vast African wilderness landscape',
  },
  'charter-vs-scheduled': {
    src: '/images/ecosystems/crater-highlands.jpg',
    alt: 'Dramatic crater highlands landscape with volcanic features',
  },
  'beach-extension': {
    src: '/images/ecosystems/delta-channels.jpg',
    alt: 'Serene waterways for beach and safari combinations',
  },
  'city-stopover': {
    src: '/images/destinations/south-africa-kruger.jpg',
    alt: 'South African wildlife and city combination',
  },
  'visa-complexity': {
    src: '/images/ecosystems/savannah-morning.jpg',
    alt: 'Three giraffes standing in golden African savannah grassland at dawn',
  },
  'travel-insurance': {
    src: '/images/activities/walking-safari.jpg',
    alt: 'Walking safari adventure requiring proper insurance',
  },
  'packing-weight': {
    src: '/images/activities/scenic-helicopter.jpg',
    alt: 'Light aircraft with luggage weight restrictions',
  },
  'agent-vs-direct': {
    src: '/images/ecosystems/delta-channels.jpg',
    alt: 'Aerial view of Okavango Delta waterways winding through lush green islands',
  },
  'local-vs-international': {
    src: '/images/destinations/tanzania-serengeti.jpg',
    alt: 'Herds of wildebeest grazing in the Serengeti National Park, Tanzania',
  },
  'deposit-timing': {
    src: '/images/activities/migration.jpg',
    alt: 'Wildebeest and zebras jumping during Great Migration river crossing',
  },
  // Risk & Ethics topics
  'malaria-decision': {
    src: '/images/ecosystems/floodplain-evening.jpg',
    alt: 'Hippopotamus in Botswana river at sunset with golden light reflections',
  },
  'yellow-fever': {
    src: '/images/destinations/uganda-bwindi.jpg',
    alt: 'Tropical forest requiring yellow fever vaccination',
  },
  'political-stability': {
    src: '/images/ecosystems/savannah-wildlife.jpg',
    alt: 'Wildlife on the stable African plains',
  },
  'ethical-hunting': {
    src: '/images/activities/wildlife-viewing.jpg',
    alt: 'Cheetah family resting in African savannah grassland',
  },
  'volunteer-tourism': {
    src: '/images/activities/cultural-visit.jpg',
    alt: 'Traditional Maasai village cultural experience',
  },
  'orphanage-visits': {
    src: '/images/ecosystems/montane-forest.jpg',
    alt: 'Lush green montane forest with misty atmosphere',
  },
  'elephant-interaction': {
    src: '/images/destinations/botswana-delta.jpg',
    alt: 'Elephants in natural habitat, Botswana',
  },
  'carbon-offset': {
    src: '/images/activities/scenic-helicopter.jpg',
    alt: 'Flight over African wilderness with carbon considerations',
  },
  'community-benefit': {
    src: '/images/activities/cultural-visit.jpg',
    alt: 'Traditional Maasai village cultural experience',
  },
  'photography-ethics': {
    src: '/images/activities/photographic-hide.jpg',
    alt: 'African elephant at waterhole from ground-level hide perspective',
  },
  // Value & Cost topics
  'total-budget': {
    src: '/images/ecosystems/savannah-morning.jpg',
    alt: 'Three giraffes standing in golden African savannah grassland at dawn',
  },
  'budget-tanzania': {
    src: '/images/destinations/tanzania-ngorongoro.jpg',
    alt: 'Panoramic view of Ngorongoro Crater from the rim, Tanzania',
  },
  'hidden-costs': {
    src: '/images/activities/hot-air-balloon.jpg',
    alt: 'Hot air balloon floating over the Masai Mara at sunrise',
  },
  'tipping-guide': {
    src: '/images/activities/game-drive.jpg',
    alt: 'Safari vehicle observing wildlife on an early morning game drive',
  },
  'peak-vs-value': {
    src: '/images/ecosystems/floodplain-evening.jpg',
    alt: 'Hippopotamus in Botswana river at sunset with golden light reflections',
  },
  'cheap-warning': {
    src: '/images/ecosystems/desert-dunes.jpg',
    alt: 'Vast Namib Desert landscape with red sand dunes stretching to horizon',
  },
  'value-destinations': {
    src: '/images/destinations/zambia-luangwa.jpg',
    alt: 'Walking safari guide leading guests through the South Luangwa bush',
  },
  'splurge-allocation': {
    src: '/images/destinations/botswana-delta.jpg',
    alt: 'Premium Okavango Delta experience worth the splurge',
  },
  // Birding topics
  'birding-green-vs-dry-season': {
    src: '/images/ecosystems/woodland-clearing.jpg',
    alt: 'Woodland habitat for bird watching',
  },
};

/**
 * Get image for a topic - uses specific mapping first, then bucket fallback
 */
function getTopicImage(topicId: string, bucketImageIndex: number): { src: string; alt: string } {
  if (topicImageMap[topicId]) {
    return topicImageMap[topicId];
  }
  const ecosystemImage = ecosystemImages[bucketImageIndex % ecosystemImages.length];
  return { src: ecosystemImage.src, alt: ecosystemImage.alt };
}

/**
 * Get P0 topics for a specific bucket
 */
function getP0TopicsForBucket(bucket: TopicBucket): TopicInventoryItem[] {
  return topicInventory
    .filter((t) => t.bucket === bucket && t.launch_priority === 'P0')
    .sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Get all P0 topics count
 */
function getP0TopicCount(): number {
  return topicInventory.filter((t) => t.launch_priority === 'P0').length;
}

/**
 * Get buckets that have P0 topics
 */
function getBucketsWithP0Topics(): TopicBucket[] {
  return TOPIC_BUCKETS.filter((bucket) => getP0TopicsForBucket(bucket).length > 0);
}

/**
 * Get featured topics (first from key buckets)
 */
function getFeaturedTopics(): TopicInventoryItem[] {
  const featured: TopicInventoryItem[] = [];
  const priorityBuckets: TopicBucket[] = ['timing', 'destination_choice', 'personal_fit', 'value_cost'];

  for (const bucket of priorityBuckets) {
    const topics = getP0TopicsForBucket(bucket);
    if (topics.length > 0 && featured.length < 6) {
      featured.push(topics[0]);
    }
  }

  // Fill remaining with any other P0 topics
  const allP0 = topicInventory.filter((t) => t.launch_priority === 'P0');
  for (const topic of allP0) {
    if (featured.length >= 6) break;
    if (!featured.find((f) => f.id === topic.id)) {
      featured.push(topic);
    }
  }

  return featured.slice(0, 6);
}

/**
 * Topic card component - visual card style with thumbnail
 */
function TopicCard({ topic }: { topic: TopicInventoryItem }) {
  const slug = generateSlugFromId(topic.id);
  const config = BUCKET_CONFIG[topic.bucket as TopicBucket];
  const Icon = config.icon;
  const image = getTopicImage(topic.id, config.imageIndex);

  return (
    <Link
      href={`/decisions/${slug}`}
      prefetch={false}
      className="group block bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-amber-300 hover:shadow-md transition-all"
      data-testid="topic-link"
    >
      <div className="flex">
        {/* Thumbnail image */}
        <div className="w-20 h-24 flex-shrink-0 overflow-hidden relative">
          <div
            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
            style={{ backgroundImage: `url(${image.src})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 p-3">
          <div className="flex items-start gap-2 mb-1">
            <div className="w-6 h-6 rounded bg-stone-100 group-hover:bg-amber-100 flex items-center justify-center flex-shrink-0 transition-colors">
              <Icon className="w-3 h-3 text-stone-500 group-hover:text-amber-600 transition-colors" strokeWidth={1.5} />
            </div>
            <h3 className="font-editorial text-sm font-medium text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-2 flex-1">
              {topic.title}
            </h3>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-400">{config.title}</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Featured topic card - larger with more detail
 */
function FeaturedTopicCard({ topic }: { topic: TopicInventoryItem }) {
  const slug = generateSlugFromId(topic.id);
  const config = BUCKET_CONFIG[topic.bucket as TopicBucket];
  const Icon = config.icon;
  const image = getTopicImage(topic.id, config.imageIndex);

  return (
    <Link
      href={`/decisions/${slug}`}
      prefetch={false}
      className="group block bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-amber-300 hover:shadow-lg transition-all"
      data-testid="featured-topic"
    >
      {/* Image header */}
      <div className="relative h-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url(${image.src})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium bg-white/90 backdrop-blur-sm text-stone-700 rounded-full">
            <Icon className="w-3 h-3" />
            {config.title}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-editorial text-base font-semibold text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-2 mb-2">
          {topic.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-xs text-stone-400">Get verdict</span>
          <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  );
}

/**
 * Bucket section component with visual header
 */
function BucketSection({ bucket }: { bucket: TopicBucket }) {
  const config = BUCKET_CONFIG[bucket];
  const topics = getP0TopicsForBucket(bucket);
  const Icon = config.icon;
  const bgImage = ecosystemImages[config.imageIndex];

  if (topics.length === 0) {
    return null;
  }

  return (
    <section
      id={config.anchorId}
      className="scroll-mt-24"
      data-testid={`bucket-${config.anchorId}`}
    >
      {/* Category header with image */}
      <div className="relative rounded-t-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-900/70 to-stone-900/50 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage.src})` }}
        />
        <div className="relative z-20 p-5 md:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Icon className="w-5 h-5 text-amber-400" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-editorial text-lg font-semibold text-white">
                {config.title}
              </h2>
              <p className="text-white/70 text-sm">{config.framingCopy}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Topics grid */}
      <div className="bg-white rounded-b-2xl border border-t-0 border-stone-200 p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Bucket navigation chip with icon
 */
function BucketNavChip({ bucket, count }: { bucket: TopicBucket; count: number }) {
  const config = BUCKET_CONFIG[bucket];
  const Icon = config.icon;

  return (
    <a
      href={`#${config.anchorId}`}
      className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 bg-white rounded-lg border border-stone-200 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 transition-colors whitespace-nowrap shadow-sm"
    >
      <Icon className="w-4 h-4" />
      <span>{config.title}</span>
      <span className="text-xs text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">{count}</span>
    </a>
  );
}

/**
 * Decisions Hub Page
 */
export default function DecisionsHubPage() {
  const p0Count = getP0TopicCount();
  const bucketsWithTopics = getBucketsWithP0Topics();
  const featuredTopics = getFeaturedTopics();

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Navbar */}
      <Navbar variant="transparent" />

      {/* Hero with safari imagery */}
      <ImageBand
        image={pageImages.explore}
        height="explore"
        overlay="strong"
        align="center"
        priority
        alwaysRender
      >
        <ImageBandContent maxWidth="default" className="pt-24 pb-8">
          <div className="text-center">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-white/60 text-sm mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                Safari Index
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">Decisions</span>
            </div>

            {/* Icon + Title */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Layers className="w-6 h-6 text-amber-400" />
              </div>
              <h1
                className="font-editorial text-4xl md:text-5xl font-semibold text-white"
                data-testid="decisions-h1"
              >
                Safari Decisions
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              {p0Count} decisions across {bucketsWithTopics.length} planning domains.
              <br className="hidden md:block" />
              Clear verdicts with trade-offs stated upfront.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 mt-6 text-white/60 text-sm">
              <span>{p0Count} decisions</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>{bucketsWithTopics.length} categories</span>
            </div>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Search Section */}
      <section className="bg-white py-6 border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <SearchAndFilters
            context="decisions"
            placeholder="Search decisions... e.g., 'Tanzania February' or 'budget safari'"
            compact
          />
        </div>
      </section>

      {/* Featured Decisions */}
      {featuredTopics.length > 0 && (
        <section className="bg-white py-10 border-b border-stone-200">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h2 className="font-editorial text-xl font-semibold text-stone-900">
                  Popular Decisions
                </h2>
                <p className="text-stone-500 text-sm">Start with these common questions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredTopics.map((topic) => (
                <FeaturedTopicCard key={topic.id} topic={topic} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        {/* Bucket navigation */}
        <nav className="mb-8" aria-label="Decision domains">
          <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">
            Browse by category
          </h2>
          <div className="flex flex-wrap gap-2" data-testid="bucket-nav">
            {bucketsWithTopics.map((bucket) => (
              <BucketNavChip
                key={bucket}
                bucket={bucket}
                count={getP0TopicsForBucket(bucket).length}
              />
            ))}
          </div>
        </nav>

        {/* Bucket sections */}
        <div className="space-y-8" data-testid="bucket-sections">
          {TOPIC_BUCKETS.map((bucket) => (
            <BucketSection key={bucket} bucket={bucket} />
          ))}
        </div>

        {/* CTA section */}
        <div className="mt-12 pt-8 border-t border-stone-200">
          <div className="bg-stone-900 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="font-editorial text-xl text-white mb-2">
                  Not finding what you need?
                </h3>
                <p className="text-stone-400 text-sm">
                  Explore all decisions or compare two options side by side.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/explore"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-stone-900 rounded-lg font-medium hover:bg-stone-100 transition-colors text-sm"
                >
                  Explore all
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/compare"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-transparent text-white border border-white/30 rounded-lg font-medium hover:bg-white/10 transition-colors text-sm"
                >
                  Compare decisions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer variant="decision-system" />
    </main>
  );
}
