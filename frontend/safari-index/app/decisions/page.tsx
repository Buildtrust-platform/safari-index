/**
 * Decisions Hub Page
 *
 * Authoritative index for Safari Index's decision library.
 * Organizes P0 decision topics by domain (bucket).
 *
 * Role:
 * - Authority index for all published decisions
 * - User orientation layer for planning domains
 * - Crawl and internal-linking control surface
 *
 * Data source: topic-inventory.ts (strategic metadata)
 * Slug generation: p0-topics-bridge.ts
 *
 * Launch visibility: P0 topics only
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
} from 'lucide-react';
import {
  topicInventory,
  TOPIC_BUCKETS,
  type TopicBucket,
  type TopicInventoryItem,
} from '../content/topic-inventory';
import { generateSlugFromId } from '../content/p0-topics-bridge';
import { ImageBand, ImageBandContent, pageImages } from '../components/visual';
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
 * Bucket display metadata with icons and framing copy
 */
const BUCKET_CONFIG: Record<
  TopicBucket,
  {
    title: string;
    anchorId: string;
    framingCopy: string;
    icon: React.ElementType;
  }
> = {
  personal_fit: {
    title: 'Personal Fit',
    anchorId: 'personal-fit',
    framingCopy:
      'Is this trip right for you? These decisions help you assess whether safari matches your expectations, travel style, and group composition.',
    icon: Users,
  },
  destination_choice: {
    title: 'Destination Choice',
    anchorId: 'destination-choice',
    framingCopy:
      'Where should you go? These comparisons help you choose between countries, parks, and regions based on your priorities and constraints.',
    icon: MapPin,
  },
  timing: {
    title: 'Timing',
    anchorId: 'timing',
    framingCopy:
      'When should you go? Safari timing affects wildlife, weather, crowds, and cost. These decisions help you pick the right window for your priorities.',
    icon: Calendar,
  },
  experience_type: {
    title: 'Experience Type',
    anchorId: 'experience-type',
    framingCopy:
      'What kind of safari do you want? Walking safaris, self-drive adventures, or group tours each offer different trade-offs.',
    icon: Compass,
  },
  accommodation: {
    title: 'Accommodation',
    anchorId: 'accommodation',
    framingCopy:
      'Where should you stay? Lodges, tented camps, and budget options all exist across the safari spectrum.',
    icon: Tent,
  },
  logistics: {
    title: 'Logistics',
    anchorId: 'logistics',
    framingCopy:
      'How do you make this work practically? Trip length, internal flights, and booking mechanics all require decisions.',
    icon: Plane,
  },
  risk_ethics: {
    title: 'Risk and Ethics',
    anchorId: 'risk-ethics',
    framingCopy:
      'What should you be cautious about? Health zones, political stability, and ethical considerations factor into responsible travel.',
    icon: Shield,
  },
  value_cost: {
    title: 'Value and Cost',
    anchorId: 'value-cost',
    framingCopy:
      'Are you getting good value? These decisions help you set realistic budgets and allocate spending where it matters most.',
    icon: DollarSign,
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
 * Topic link component
 */
function TopicLink({ topic }: { topic: TopicInventoryItem }) {
  const slug = generateSlugFromId(topic.id);

  return (
    <Link
      href={`/decisions/${slug}`}
      prefetch={false}
      className="group flex items-center justify-between py-3 px-4 rounded-lg hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-200"
      data-testid="topic-link"
    >
      <span className="text-stone-700 group-hover:text-amber-700 transition-colors">
        {topic.title}
      </span>
      <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
    </Link>
  );
}

/**
 * Bucket section component
 */
function BucketSection({ bucket }: { bucket: TopicBucket }) {
  const config = BUCKET_CONFIG[bucket];
  const topics = getP0TopicsForBucket(bucket);
  const Icon = config.icon;

  if (topics.length === 0) {
    return null;
  }

  return (
    <section
      id={config.anchorId}
      className="scroll-mt-24"
      data-testid={`bucket-${config.anchorId}`}
    >
      <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 shadow-sm">
        {/* Section header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center flex-shrink-0 border border-stone-200">
            <Icon className="w-6 h-6 text-stone-600" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-1">
              {config.title}
            </h2>
            <p className="text-stone-500 text-sm">{config.framingCopy}</p>
          </div>
        </div>

        {/* Topic list */}
        <div className="divide-y divide-stone-100">
          {topics.map((topic) => (
            <TopicLink key={topic.id} topic={topic} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Bucket navigation chip
 */
function BucketNavChip({ bucket, count }: { bucket: TopicBucket; count: number }) {
  const config = BUCKET_CONFIG[bucket];

  return (
    <a
      href={`#${config.anchorId}`}
      className="flex items-center gap-2 px-4 py-2 text-sm text-stone-600 bg-white rounded-full border border-stone-200 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 transition-colors whitespace-nowrap"
    >
      <span>{config.title}</span>
      <span className="text-xs text-stone-400">({count})</span>
    </a>
  );
}

/**
 * Decisions Hub Page
 */
export default function DecisionsHubPage() {
  const p0Count = getP0TopicCount();
  const bucketsWithTopics = getBucketsWithP0Topics();

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
              {p0Count} decisions across {bucketsWithTopics.length} domains.
              <br className="hidden md:block" />
              Find the guidance you need, organized by what you're deciding.
            </p>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Search Section */}
      <section className="bg-white py-8 border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <SearchAndFilters
            context="decisions"
            placeholder="Search decisions... e.g., 'when to visit Tanzania' or 'budget safari'"
            compact
          />
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {/* Orientation paragraph */}
        <div className="mb-8">
          <p className="text-stone-600 leading-relaxed">
            Safari planning involves interconnected decisions about where to go, when to travel,
            how to structure your trip, and what trade-offs to accept. This page organizes our
            decision coverage into {bucketsWithTopics.length} domains, each addressing a different
            aspect of the planning process.
          </p>
        </div>

        {/* Bucket navigation */}
        <nav className="mb-10" aria-label="Decision domains">
          <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">
            Jump to domain
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

        {/* Close framing */}
        <div className="mt-12 pt-8 border-t border-stone-200">
          <p className="text-stone-500 text-sm">
            Looking for a specific topic?{' '}
            <Link
              href="/explore"
              className="text-amber-600 hover:text-amber-700 underline underline-offset-2"
            >
              Explore all decisions
            </Link>{' '}
            or{' '}
            <Link
              href="/compare"
              className="text-amber-600 hover:text-amber-700 underline underline-offset-2"
            >
              compare two decisions
            </Link>{' '}
            side by side.
          </p>
        </div>
      </div>

      <Footer variant="decision-system" />
    </main>
  );
}
