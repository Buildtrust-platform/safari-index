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
 * Topic card component - visual card style
 */
function TopicCard({ topic }: { topic: TopicInventoryItem }) {
  const slug = generateSlugFromId(topic.id);
  const config = BUCKET_CONFIG[topic.bucket as TopicBucket];
  const Icon = config.icon;

  return (
    <Link
      href={`/decisions/${slug}`}
      prefetch={false}
      className="group block bg-white rounded-xl border border-stone-200 p-4 hover:border-amber-300 hover:shadow-md transition-all"
      data-testid="topic-link"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-stone-100 group-hover:bg-amber-100 flex items-center justify-center flex-shrink-0 transition-colors">
          <Icon className="w-4 h-4 text-stone-500 group-hover:text-amber-600 transition-colors" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-editorial text-sm font-medium text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-2 mb-1">
            {topic.title}
          </h3>
          <span className="text-xs text-stone-400">{config.title}</span>
        </div>
        <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
      </div>
    </Link>
  );
}

/**
 * Featured topic card - larger with more detail
 */
function FeaturedTopicCard({ topic, index }: { topic: TopicInventoryItem; index: number }) {
  const slug = generateSlugFromId(topic.id);
  const config = BUCKET_CONFIG[topic.bucket as TopicBucket];
  const Icon = config.icon;
  const bgImage = ecosystemImages[index % ecosystemImages.length];

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
          style={{ backgroundImage: `url(${bgImage.src})` }}
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
              {featuredTopics.map((topic, index) => (
                <FeaturedTopicCard key={topic.id} topic={topic} index={index} />
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
