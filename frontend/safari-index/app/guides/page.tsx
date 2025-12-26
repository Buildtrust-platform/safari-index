/**
 * Guides Index Page
 *
 * Authority content layer entry point for Safari Index.
 * Displays 8 planning buckets with documentary, safari-native tone.
 *
 * Role:
 * - SEO authority page for safari planning guides
 * - User orientation layer for planning domains
 * - Funnels users to bucket hubs and decision pages
 *
 * Per governance: documentary, premium, calm. No hype words.
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
 * Bucket icons mapping
 */
const BUCKET_ICONS: Record<TopicBucket, React.ElementType> = {
  personal_fit: Users,
  destination_choice: MapPin,
  timing: Calendar,
  experience_type: Compass,
  accommodation: Tent,
  logistics: Plane,
  risk_ethics: Shield,
  value_cost: DollarSign,
};

/**
 * Bucket card component
 */
function BucketCard({ bucket }: { bucket: TopicBucket }) {
  const config = getBucketConfig(bucket);
  const bucketGuide = getAllBucketGuides().find((g) => g.bucket === bucket);
  const Icon = BUCKET_ICONS[bucket];
  const topicCount = bucketGuide?.topics.length || 0;

  if (topicCount === 0) return null;

  return (
    <Link
      href={`/guides/${bucketToSlug(bucket)}`}
      className="group block bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md hover:border-stone-300 transition-all"
      data-testid={`bucket-card-${bucketToSlug(bucket)}`}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center flex-shrink-0 border border-stone-200 group-hover:bg-amber-50 group-hover:border-amber-200 transition-colors">
          <Icon
            className="w-6 h-6 text-stone-600 group-hover:text-amber-700 transition-colors"
            strokeWidth={1.5}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-editorial text-lg font-semibold text-stone-900 group-hover:text-amber-800 transition-colors">
              {config.title}
            </h2>
            <ArrowRight className="w-5 h-5 text-stone-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </div>
          <p className="text-stone-500 text-sm line-clamp-2 mb-3">
            {config.heroDescription}
          </p>
          <span className="text-xs text-stone-400">
            {topicCount} {topicCount === 1 ? 'guide' : 'guides'}
          </span>
        </div>
      </div>
    </Link>
  );
}

/**
 * Guides Index Page
 */
export default function GuidesIndexPage() {
  const bucketGuides = getAllBucketGuides();
  const totalGuides = bucketGuides.reduce((sum, g) => sum + g.topics.length, 0);
  const activeBuckets = bucketGuides.filter((g) => g.topics.length > 0);

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Navbar */}
      <Navbar variant="transparent" />

      {/* Hero with ecosystem imagery */}
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
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Search Section */}
      <section className="bg-white py-8 border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <SearchAndFilters
            context="default"
            placeholder="Search guides... e.g., 'when to visit' or 'budget safari'"
            compact
          />
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {/* Orientation paragraph */}
        <div className="mb-8">
          <p className="text-stone-600 leading-relaxed">
            Safari planning involves navigating interconnected decisions that shape your
            experience. These guides examine the trade-offs, assumptions, and evidence behind
            common safari planning questions. Each guide connects to its corresponding decision
            page where you can get a personalized verdict based on your specific situation.
          </p>
        </div>

        {/* Bucket grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          data-testid="bucket-grid"
        >
          {TOPIC_BUCKETS.map((bucket) => (
            <BucketCard key={bucket} bucket={bucket} />
          ))}
        </div>

        {/* Close framing */}
        <div className="mt-12 pt-8 border-t border-stone-200">
          <p className="text-stone-500 text-sm">
            Want a personalized decision instead?{' '}
            <Link
              href="/decisions"
              className="text-amber-600 hover:text-amber-700 underline underline-offset-2"
            >
              Browse all decisions
            </Link>{' '}
            or{' '}
            <Link
              href="/explore"
              className="text-amber-600 hover:text-amber-700 underline underline-offset-2"
            >
              explore by topic
            </Link>
            .
          </p>
        </div>
      </div>

      <Footer variant="decision-system" />
    </main>
  );
}
