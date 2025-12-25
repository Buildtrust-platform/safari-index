/**
 * Bucket Hub Page
 *
 * Lists P0 topics for a specific planning domain (bucket).
 * Documentary, safari-native tone with framing copy.
 *
 * Role:
 * - Domain-specific guide index
 * - Framing copy for the planning domain
 * - Links to individual topic guides
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
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
  CheckCircle,
} from 'lucide-react';
import { TOPIC_BUCKETS, type TopicBucket } from '../../content/topic-inventory';
import {
  buildBucketGuide,
  slugToBucket,
  getAllBucketSlugs,
  getBucketConfig,
} from '../../../lib/guide-builder';
import { getRelatedBuckets, getBucketTopicLinks } from '../../../lib/internal-links';
import { ImageBand, ImageBandContent, ecosystemImages } from '../../components/visual';
import { Navbar } from '../../components/layout';

/**
 * Generate static params for all bucket slugs
 */
export function generateStaticParams() {
  return getAllBucketSlugs().map((bucket) => ({ bucket }));
}

/**
 * Generate metadata for the bucket page
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ bucket: string }>;
}): Promise<Metadata> {
  const { bucket: bucketSlug } = await params;
  const bucket = slugToBucket(bucketSlug);

  if (!bucket) {
    return { title: 'Not Found' };
  }

  const config = getBucketConfig(bucket);
  const guide = buildBucketGuide(bucket);

  return {
    title: `${config.title} Guides | Safari Index`,
    description: config.heroDescription + ' ' + (guide?.topics.length || 0) + ' in-depth guides.',
    robots: 'index, follow',
    alternates: {
      canonical: `/guides/${bucketSlug}`,
    },
    openGraph: {
      title: `${config.title} Guides | Safari Index`,
      description: config.heroDescription,
      type: 'website',
      url: `/guides/${bucketSlug}`,
    },
  };
}

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
 * Ecosystem image mapping for buckets
 */
const BUCKET_IMAGES: Record<TopicBucket, number> = {
  personal_fit: 0, // savannah-morning
  destination_choice: 1, // delta-channels
  timing: 4, // floodplain-evening
  experience_type: 6, // woodland-clearing
  accommodation: 3, // montane-forest
  logistics: 5, // kopje-landscape
  risk_ethics: 2, // desert-dunes
  value_cost: 7, // crater-highlands
};

/**
 * Topic card component
 */
function TopicCard({
  topic,
  bucketSlug,
}: {
  topic: { id: string; slug: string; title: string; hasBaseline: boolean };
  bucketSlug: string;
}) {
  return (
    <Link
      href={`/guides/${bucketSlug}/${topic.slug}`}
      className="group flex items-center justify-between py-4 px-5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 hover:shadow-sm transition-all"
      data-testid="topic-card"
    >
      <div className="flex items-center gap-3">
        {topic.hasBaseline && (
          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
        )}
        <span className="text-stone-700 group-hover:text-amber-700 transition-colors">
          {topic.title}
        </span>
      </div>
      <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
    </Link>
  );
}

/**
 * Related bucket link
 */
function RelatedBucketLink({ bucket }: { bucket: TopicBucket }) {
  const config = getBucketConfig(bucket);
  const Icon = BUCKET_ICONS[bucket];

  return (
    <Link
      href={`/guides/${config.slug}`}
      className="flex items-center gap-2 px-4 py-2 text-sm text-stone-600 bg-stone-100 rounded-full hover:bg-amber-50 hover:text-amber-700 transition-colors"
    >
      <Icon className="w-4 h-4" />
      <span>{config.title}</span>
    </Link>
  );
}

/**
 * Bucket Hub Page
 */
export default async function BucketHubPage({
  params,
}: {
  params: Promise<{ bucket: string }>;
}) {
  const { bucket: bucketSlug } = await params;
  const bucket = slugToBucket(bucketSlug);

  if (!bucket) {
    notFound();
  }

  const guide = buildBucketGuide(bucket);
  if (!guide || guide.topics.length === 0) {
    notFound();
  }

  const config = getBucketConfig(bucket);
  const Icon = BUCKET_ICONS[bucket];
  const relatedBuckets = getRelatedBuckets(bucket);
  const heroImage = ecosystemImages[BUCKET_IMAGES[bucket]];

  // Get top 8 topics for "Start with these" section
  const startTopics = guide.topics.slice(0, 8);

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Navbar */}
      <Navbar variant="transparent" />

      {/* Hero */}
      <ImageBand
        image={heroImage}
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
              <Link href="/guides" className="hover:text-white transition-colors">
                Guides
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{config.title}</span>
            </div>

            {/* Icon + Title */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Icon className="w-6 h-6 text-amber-400" strokeWidth={1.5} />
              </div>
              <h1
                className="font-editorial text-4xl md:text-5xl font-semibold text-white"
                data-testid="bucket-h1"
              >
                {config.title}
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              {guide.topics.length} guides exploring {config.heroDescription.toLowerCase()}
            </p>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
        {/* Framing copy */}
        <div className="mb-8 bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
          <p className="text-stone-600 leading-relaxed" data-testid="framing-copy">
            {config.framingCopy}
          </p>
        </div>

        {/* Topic list */}
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-4">
            All {config.title} Guides
          </h2>
          <div className="space-y-2" data-testid="topic-list">
            {guide.topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} bucketSlug={bucketSlug} />
            ))}
          </div>
        </div>

        {/* Start with these decisions */}
        {startTopics.length > 0 && (
          <div className="mb-8 bg-amber-50 rounded-2xl border border-amber-100 p-6">
            <h2 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Start with these decisions
            </h2>
            <ul className="space-y-2" data-testid="start-decisions">
              {startTopics.map((topic) => (
                <li key={topic.id}>
                  <Link
                    href={`/decisions/${topic.slug}`}
                    className="text-amber-700 hover:text-amber-900 underline underline-offset-2 text-sm"
                  >
                    {topic.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Related domains */}
        {relatedBuckets.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">
              Related Planning Domains
            </h2>
            <div className="flex flex-wrap gap-2">
              {relatedBuckets.map((relatedBucket) => (
                <RelatedBucketLink key={relatedBucket} bucket={relatedBucket} />
              ))}
            </div>
          </div>
        )}

        {/* Close framing */}
        <div className="pt-8 border-t border-stone-200">
          <p className="text-stone-500 text-sm">
            Looking for a specific decision?{' '}
            <Link
              href="/decisions"
              className="text-amber-600 hover:text-amber-700 underline underline-offset-2"
            >
              Browse all decisions
            </Link>{' '}
            or{' '}
            <Link
              href="/guides"
              className="text-amber-600 hover:text-amber-700 underline underline-offset-2"
            >
              explore other guide categories
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="font-editorial text-lg font-semibold">Safari Index</span>
              <span className="text-stone-500 text-sm ml-2">Pan-African Decision System</span>
            </div>

            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-sm text-stone-400 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                href="/guides"
                className="text-sm text-stone-400 hover:text-white transition-colors"
              >
                Guides
              </Link>
              <Link
                href="/decisions"
                className="text-sm text-stone-400 hover:text-white transition-colors"
              >
                Decisions
              </Link>
              <Link
                href="/how-it-works"
                className="text-sm text-stone-400 hover:text-white transition-colors"
              >
                How it works
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
