/**
 * Guides Hub Page
 *
 * Consistent design with other hub pages:
 * - Hero with icon, title, subtitle, stats
 * - Search section
 * - Featured guides grid
 * - Category sections with visual headers
 * - CTA footer
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
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { TOPIC_BUCKETS, type TopicBucket } from '../content/topic-inventory';
import {
  getAllBucketGuides,
  getBucketConfig,
  bucketToSlug,
} from '../../lib/guide-builder';
import { ImageBand, ImageBandContent, ecosystemImages } from '../components/visual';
import { Navbar, Footer } from '../components/layout';
import { SearchAndFilters } from '../components/SearchAndFilters';

/**
 * SEO Metadata - indexable with canonical
 */
export const metadata: Metadata = {
  title: 'Safari Planning Guides | Safari Index',
  description:
    'In-depth safari planning guides across 8 domains: destinations, timing, accommodation, logistics, and more. Documentary-style guidance.',
  robots: 'index, follow',
  alternates: {
    canonical: '/guides',
  },
  openGraph: {
    title: 'Safari Planning Guides | Safari Index',
    description:
      'In-depth guides for safari planning decisions across 8 domains. Documentary-style guidance for informed travel choices.',
    type: 'website',
    url: '/guides',
  },
};

/**
 * Bucket configuration with icons and images
 */
const BUCKET_CONFIG: Record<
  TopicBucket,
  {
    icon: React.ElementType;
    imageIndex: number;
  }
> = {
  personal_fit: { icon: Users, imageIndex: 5 }, // woodland-afternoon
  destination_choice: { icon: MapPin, imageIndex: 1 }, // delta-channels
  timing: { icon: Calendar, imageIndex: 0 }, // savannah-morning
  experience_type: { icon: Compass, imageIndex: 4 }, // floodplain-evening
  accommodation: { icon: Tent, imageIndex: 6 }, // riverine-forest
  logistics: { icon: Plane, imageIndex: 7 }, // crater-highlands
  risk_ethics: { icon: Shield, imageIndex: 3 }, // montane-forest
  value_cost: { icon: DollarSign, imageIndex: 2 }, // acacia-kopje
};

/**
 * Featured guide card with large image
 */
function FeaturedBucketCard({ bucket }: { bucket: TopicBucket }) {
  const bucketConfig = getBucketConfig(bucket);
  const visualConfig = BUCKET_CONFIG[bucket];
  const bucketGuide = getAllBucketGuides().find((g) => g.bucket === bucket);
  const Icon = visualConfig.icon;
  const topicCount = bucketGuide?.topics.length || 0;
  const bgImage = ecosystemImages[visualConfig.imageIndex];

  if (topicCount === 0) return null;

  return (
    <Link
      href={`/guides/${bucketToSlug(bucket)}`}
      className="group block bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-amber-300 hover:shadow-lg transition-all"
      data-testid="featured-bucket"
    >
      {/* Image */}
      <div className="relative h-36 overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url(${bgImage.src})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium bg-white/90 backdrop-blur-sm text-stone-700 rounded-full">
            <Icon className="w-3 h-3" />
            {topicCount} guides
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-editorial text-lg font-semibold text-stone-900 group-hover:text-amber-700 transition-colors mb-1">
          {bucketConfig.title}
        </h3>
        <p className="text-stone-500 text-sm line-clamp-2 mb-3">{bucketConfig.heroDescription}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-stone-400">Explore guides</span>
          <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  );
}

/**
 * Bucket card in grid
 */
function BucketCard({ bucket }: { bucket: TopicBucket }) {
  const bucketConfig = getBucketConfig(bucket);
  const visualConfig = BUCKET_CONFIG[bucket];
  const bucketGuide = getAllBucketGuides().find((g) => g.bucket === bucket);
  const Icon = visualConfig.icon;
  const topicCount = bucketGuide?.topics.length || 0;

  if (topicCount === 0) return null;

  return (
    <Link
      href={`/guides/${bucketToSlug(bucket)}`}
      className="group block bg-white rounded-xl border border-stone-200 p-4 hover:border-amber-300 hover:shadow-md transition-all"
      data-testid={`bucket-card-${bucketToSlug(bucket)}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-stone-100 group-hover:bg-amber-100 flex items-center justify-center flex-shrink-0 transition-colors">
          <Icon className="w-5 h-5 text-stone-500 group-hover:text-amber-600 transition-colors" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-editorial text-base font-semibold text-stone-900 group-hover:text-amber-700 transition-colors">
              {bucketConfig.title}
            </h3>
            <span className="px-2 py-0.5 text-xs rounded-full bg-stone-100 text-stone-600 flex-shrink-0 ml-2">
              {topicCount} guides
            </span>
          </div>
          <p className="text-stone-500 text-sm line-clamp-2 mb-2">{bucketConfig.heroDescription}</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-400">View all</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Category section with visual header
 */
function CategorySection({
  title,
  description,
  buckets,
  imageIndex,
}: {
  title: string;
  description: string;
  buckets: TopicBucket[];
  imageIndex: number;
}) {
  const bgImage = ecosystemImages[imageIndex];
  const activeBuckets = buckets.filter((bucket) => {
    const bucketGuide = getAllBucketGuides().find((g) => g.bucket === bucket);
    return bucketGuide && bucketGuide.topics.length > 0;
  });

  if (activeBuckets.length === 0) return null;

  return (
    <section className="scroll-mt-24" data-testid={`category-${title.toLowerCase().replace(/\s+/g, '-')}`}>
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
              <BookOpen className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="font-editorial text-lg font-semibold text-white">{title}</h2>
              <p className="text-white/70 text-sm">{description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Buckets grid */}
      <div className="bg-white rounded-b-2xl border border-t-0 border-stone-200 p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeBuckets.map((bucket) => (
            <BucketCard key={bucket} bucket={bucket} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Navigation chip
 */
function BucketNavChip({ bucket }: { bucket: TopicBucket }) {
  const bucketConfig = getBucketConfig(bucket);
  const visualConfig = BUCKET_CONFIG[bucket];
  const bucketGuide = getAllBucketGuides().find((g) => g.bucket === bucket);
  const Icon = visualConfig.icon;
  const topicCount = bucketGuide?.topics.length || 0;

  if (topicCount === 0) return null;

  return (
    <Link
      href={`/guides/${bucketToSlug(bucket)}`}
      className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 bg-white rounded-lg border border-stone-200 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 transition-colors whitespace-nowrap shadow-sm"
    >
      <Icon className="w-4 h-4" />
      <span>{bucketConfig.title}</span>
      <span className="text-xs text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">{topicCount}</span>
    </Link>
  );
}

/**
 * Category groups for guides
 */
const GUIDE_CATEGORIES = [
  {
    title: 'Planning Fundamentals',
    description: 'Who, where, when, and what type of safari',
    buckets: ['personal_fit', 'destination_choice', 'timing', 'experience_type'] as TopicBucket[],
    imageIndex: 0, // savannah-morning
  },
  {
    title: 'Logistics & Practicalities',
    description: 'Accommodation, transport, health, and budget',
    buckets: ['accommodation', 'logistics', 'risk_ethics', 'value_cost'] as TopicBucket[],
    imageIndex: 6, // riverine-forest
  },
];

/**
 * Guides Hub Page
 */
export default function GuidesIndexPage() {
  const bucketGuides = getAllBucketGuides();
  const totalGuides = bucketGuides.reduce((sum, g) => sum + g.topics.length, 0);
  const activeBuckets = bucketGuides.filter((g) => g.topics.length > 0);

  // Featured buckets (first 4 with content)
  const featuredBuckets = TOPIC_BUCKETS.filter((bucket) => {
    const guide = bucketGuides.find((g) => g.bucket === bucket);
    return guide && guide.topics.length > 0;
  }).slice(0, 4);

  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar variant="transparent" />

      {/* Hero */}
      <ImageBand
        image={ecosystemImages[0]} // savannah-morning
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
              <span className="text-white">Guides</span>
            </div>

            {/* Icon + Title */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <BookOpen className="w-6 h-6 text-amber-400" />
              </div>
              <h1
                className="font-editorial text-4xl md:text-5xl font-semibold text-white"
                data-testid="guides-h1"
              >
                Safari Guides
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              {totalGuides} in-depth guides across {activeBuckets.length} planning domains.
              <br className="hidden md:block" />
              Documentary-style guidance for informed safari decisions.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 mt-6 text-white/60 text-sm">
              <span>{totalGuides} guides</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>{activeBuckets.length} categories</span>
            </div>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Search Section */}
      <section className="bg-white py-6 border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <SearchAndFilters
            context="default"
            placeholder="Search guides... e.g., 'when to visit' or 'budget safari'"
            compact
          />
        </div>
      </section>

      {/* Featured Guides */}
      <section className="bg-white py-10 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="font-editorial text-xl font-semibold text-stone-900">
                Popular Guide Categories
              </h2>
              <p className="text-stone-500 text-sm">Most common planning questions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredBuckets.map((bucket) => (
              <FeaturedBucketCard key={bucket} bucket={bucket} />
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        {/* Category navigation */}
        <nav className="mb-8" aria-label="Guide categories">
          <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">
            Browse by category
          </h2>
          <div className="flex flex-wrap gap-2" data-testid="bucket-nav">
            {TOPIC_BUCKETS.map((bucket) => (
              <BucketNavChip key={bucket} bucket={bucket} />
            ))}
          </div>
        </nav>

        {/* Category sections */}
        <div className="space-y-8" data-testid="category-sections">
          {GUIDE_CATEGORIES.map((category) => (
            <CategorySection
              key={category.title}
              title={category.title}
              description={category.description}
              buckets={category.buckets}
              imageIndex={category.imageIndex}
            />
          ))}
        </div>

        {/* CTA section */}
        <div className="mt-12 pt-8 border-t border-stone-200">
          <div className="bg-stone-900 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="font-editorial text-xl text-white mb-2">
                  Want personalized guidance?
                </h3>
                <p className="text-stone-400 text-sm">
                  Get a tailored recommendation based on your specific situation.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/inquire"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-stone-900 rounded-lg font-medium hover:bg-stone-100 transition-colors text-sm"
                >
                  Start planning
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/decisions"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-transparent text-white border border-white/30 rounded-lg font-medium hover:bg-white/10 transition-colors text-sm"
                >
                  Browse decisions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer variant="operator" />
    </main>
  );
}
