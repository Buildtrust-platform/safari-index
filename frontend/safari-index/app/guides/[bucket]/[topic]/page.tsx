/**
 * Topic Guide Page
 *
 * In-depth guide for a P0 decision topic.
 * Documentary, safari-native, premium tone.
 *
 * Sections (in order):
 * 1. Hero (ImageBand + H1 = guide title)
 * 2. "The decision in one line" (derived from baseline)
 * 3. "What this depends on" (assumptions + change conditions)
 * 4. "Trade-offs to understand" (top 3 gains/losses)
 * 5. "Evidence to know" (6 evidence cards)
 * 6. "Related decisions" (3-6 internal links)
 * 7. "If you want the official decision" (quiet CTA)
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  ChevronRight,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Scale,
  FileText,
  Lightbulb,
  Link2,
} from 'lucide-react';
import { TOPIC_BUCKETS, type TopicBucket } from '../../../content/topic-inventory';
import {
  buildTopicGuide,
  slugToBucket,
  getAllBucketSlugs,
  getBucketConfig,
  getP0TopicsForBucket,
} from '../../../../lib/guide-builder';
import { generateSlugFromId } from '../../../content/p0-topics-bridge';
import {
  getRelatedDecisions,
  getCanonicalDecisionLink,
} from '../../../../lib/internal-links';
import { ImageBand, ImageBandContent, ecosystemImages } from '../../../components/visual';
import { Navbar } from '../../../components/layout';

/**
 * Generate static params for all P0 topic guides
 */
export function generateStaticParams() {
  const params: Array<{ bucket: string; topic: string }> = [];

  for (const bucket of TOPIC_BUCKETS) {
    const bucketSlug = getBucketConfig(bucket).slug;
    const topics = getP0TopicsForBucket(bucket);

    for (const topic of topics) {
      params.push({
        bucket: bucketSlug,
        topic: generateSlugFromId(topic.id),
      });
    }
  }

  return params;
}

/**
 * Generate metadata for the topic guide
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ bucket: string; topic: string }>;
}): Promise<Metadata> {
  const { bucket: bucketSlug, topic: topicSlug } = await params;
  const bucket = slugToBucket(bucketSlug);

  if (!bucket) {
    return { title: 'Not Found' };
  }

  // Find topic in bucket
  const topics = getP0TopicsForBucket(bucket);
  const topicItem = topics.find((t) => generateSlugFromId(t.id) === topicSlug);

  if (!topicItem) {
    return { title: 'Not Found' };
  }

  const guide = buildTopicGuide(topicItem.id);
  if (!guide) {
    return { title: 'Not Found' };
  }

  const bucketConfig = getBucketConfig(bucket);

  return {
    title: `${guide.title} | Safari Guide`,
    description: guide.decisionInOneLine,
    robots: 'index, follow',
    alternates: {
      canonical: `/guides/${bucketSlug}/${topicSlug}`,
    },
    openGraph: {
      title: `${guide.title} | Safari Guide`,
      description: guide.decisionInOneLine,
      type: 'article',
      url: `/guides/${bucketSlug}/${topicSlug}`,
    },
  };
}

/**
 * Ecosystem image mapping for buckets
 */
const BUCKET_IMAGES: Record<TopicBucket, number> = {
  personal_fit: 0,
  destination_choice: 1,
  timing: 4,
  experience_type: 6,
  accommodation: 3,
  logistics: 5,
  risk_ethics: 2,
  value_cost: 7,
};

/**
 * JSON-LD Article schema for guides
 */
function ArticleSchema({
  guide,
  bucketSlug,
  topicSlug,
}: {
  guide: NonNullable<ReturnType<typeof buildTopicGuide>>;
  bucketSlug: string;
  topicSlug: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.decisionInOneLine,
    author: {
      '@type': 'Organization',
      name: 'Safari Index',
      url: 'https://safariindex.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Safari Index',
      url: 'https://safariindex.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://safariindex.com/guides/${bucketSlug}/${topicSlug}`,
    },
    articleSection: getBucketConfig(guide.bucket).title,
    keywords: [
      'safari planning',
      'safari guide',
      guide.bucket.replace('_', ' '),
      guide.title.toLowerCase(),
    ].join(', '),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Assumption chip component
 */
function AssumptionChip({
  assumption,
}: {
  assumption: { id: string; text: string; confidence: number };
}) {
  const confidenceLabel =
    assumption.confidence >= 0.85
      ? 'High confidence'
      : assumption.confidence >= 0.7
        ? 'Medium confidence'
        : 'Variable';

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4">
      <p className="text-stone-700 text-sm mb-2">{assumption.text}</p>
      <span className="text-xs text-stone-400">{confidenceLabel}</span>
    </div>
  );
}

/**
 * Change condition chip component
 */
function ChangeConditionChip({ condition }: { condition: string }) {
  return (
    <div className="flex items-start gap-2 text-sm text-stone-600">
      <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
      <span>{condition}</span>
    </div>
  );
}

/**
 * Tradeoff row component
 */
function TradeoffRow({ type, text }: { type: 'gain' | 'loss'; text: string }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
          type === 'gain' ? 'bg-emerald-100' : 'bg-rose-100'
        }`}
      >
        {type === 'gain' ? (
          <span className="text-emerald-600 text-xs font-medium">+</span>
        ) : (
          <span className="text-rose-600 text-xs font-medium">-</span>
        )}
      </div>
      <span className="text-stone-600 text-sm">{text}</span>
    </div>
  );
}

/**
 * Evidence card component
 */
function EvidenceCard({
  evidence,
}: {
  evidence: { claim: string; nuance?: string; scope: string };
}) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4">
      <p className="text-stone-700 text-sm mb-2">{evidence.claim}</p>
      {evidence.nuance && (
        <p className="text-stone-500 text-xs mb-2 italic">{evidence.nuance}</p>
      )}
      <span className="text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded">
        {evidence.scope}
      </span>
    </div>
  );
}

/**
 * Related decision link component
 */
function RelatedDecisionLink({
  decision,
}: {
  decision: {
    topicId: string;
    slug: string;
    title: string;
    hasBaseline: boolean;
  };
}) {
  return (
    <Link
      href={`/decisions/${decision.slug}`}
      className="group flex items-center justify-between py-3 px-4 rounded-lg hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-200"
      data-testid="related-decision-link"
    >
      <div className="flex items-center gap-2">
        {decision.hasBaseline && (
          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
        )}
        <span className="text-stone-700 group-hover:text-amber-700 transition-colors text-sm">
          {decision.title}
        </span>
      </div>
      <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
    </Link>
  );
}

/**
 * Topic Guide Page
 */
export default async function TopicGuidePage({
  params,
}: {
  params: Promise<{ bucket: string; topic: string }>;
}) {
  const { bucket: bucketSlug, topic: topicSlug } = await params;
  const bucket = slugToBucket(bucketSlug);

  if (!bucket) {
    notFound();
  }

  // Find topic in bucket
  const topics = getP0TopicsForBucket(bucket);
  const topicItem = topics.find((t) => generateSlugFromId(t.id) === topicSlug);

  if (!topicItem) {
    notFound();
  }

  const guide = buildTopicGuide(topicItem.id);
  if (!guide) {
    notFound();
  }

  const bucketConfig = getBucketConfig(bucket);
  const heroImage = ecosystemImages[BUCKET_IMAGES[bucket]];
  const relatedDecisions = getRelatedDecisions(guide.topicId, 6);
  const decisionLink = getCanonicalDecisionLink(guide.topicId);

  // Get top 3 gains and losses for tradeoffs section
  const topGains = guide.tradeoffs.gains.slice(0, 3);
  const topLosses = guide.tradeoffs.losses.slice(0, 3);

  return (
    <main className="min-h-screen bg-stone-50">
      {/* JSON-LD Schema */}
      <ArticleSchema guide={guide} bucketSlug={bucketSlug} topicSlug={topicSlug} />

      {/* Navbar */}
      <Navbar variant="transparent" />

      {/* Hero */}
      <ImageBand
        image={heroImage}
        height="decision"
        overlay="cinematic"
        align="center"
        priority
        alwaysRender
      >
        <ImageBandContent maxWidth="default" className="pt-24 pb-8">
          <div className="text-center">
            {/* Breadcrumb */}
            <div
              className="flex items-center justify-center gap-2 text-white/60 text-sm mb-4 flex-wrap"
              data-testid="breadcrumb"
            >
              <Link href="/" className="hover:text-white transition-colors">
                Safari Index
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link
                href="/guides"
                className="hover:text-white transition-colors"
                data-testid="breadcrumb-guides"
              >
                Guides
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link
                href={`/guides/${bucketSlug}`}
                className="hover:text-white transition-colors"
              >
                {bucketConfig.title}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white truncate max-w-[200px]">{guide.title}</span>
            </div>

            {/* Title */}
            <h1
              className="font-editorial text-3xl md:text-4xl font-semibold text-white mb-4"
              data-testid="guide-h1"
            >
              {guide.title}
            </h1>

            {/* Confidence indicator */}
            {guide.hasBaseline && (
              <div className="flex items-center justify-center gap-2 text-white/70 text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Baseline decision available</span>
              </div>
            )}
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
        {/* Section 1: The decision in one line */}
        <section className="mb-8" data-testid="section-decision-line">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
                  The Decision in One Line
                </h2>
                <p className="text-stone-700 text-lg leading-relaxed">
                  {guide.decisionInOneLine}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: What this depends on */}
        {(guide.dependsOn.assumptions.length > 0 ||
          guide.dependsOn.changeConditions.length > 0) && (
          <section className="mb-8" data-testid="section-depends-on">
            <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              What This Depends On
            </h2>

            {/* Assumptions */}
            {guide.dependsOn.assumptions.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-stone-700 mb-3">Key Assumptions</h3>
                <div className="grid gap-3" data-testid="assumptions-list">
                  {guide.dependsOn.assumptions.map((assumption) => (
                    <AssumptionChip key={assumption.id} assumption={assumption} />
                  ))}
                </div>
              </div>
            )}

            {/* Change conditions */}
            {guide.dependsOn.changeConditions.length > 0 && (
              <div className="bg-amber-50 rounded-xl border border-amber-100 p-4">
                <h3 className="text-sm font-medium text-amber-800 mb-3">
                  This might change if...
                </h3>
                <div className="space-y-3" data-testid="change-conditions-list">
                  {guide.dependsOn.changeConditions.map((condition, idx) => (
                    <ChangeConditionChip key={idx} condition={condition} />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Section 3: Trade-offs to understand */}
        {(topGains.length > 0 || topLosses.length > 0) && (
          <section className="mb-8" data-testid="section-tradeoffs">
            <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Scale className="w-4 h-4" />
              Trade-offs to Understand
            </h2>
            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Gains */}
                {topGains.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-emerald-700 mb-2">
                      What you gain
                    </h3>
                    <div data-testid="gains-list">
                      {topGains.map((gain, idx) => (
                        <TradeoffRow key={idx} type="gain" text={gain} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Losses */}
                {topLosses.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-rose-700 mb-2">
                      What you accept
                    </h3>
                    <div data-testid="losses-list">
                      {topLosses.map((loss, idx) => (
                        <TradeoffRow key={idx} type="loss" text={loss} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Section 4: Evidence to know */}
        {guide.evidence.length > 0 && (
          <section className="mb-8" data-testid="section-evidence">
            <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-4">
              Evidence to Know
            </h2>
            <div className="grid gap-3" data-testid="evidence-list">
              {guide.evidence.map((evidence, idx) => (
                <EvidenceCard key={idx} evidence={evidence} />
              ))}
            </div>
          </section>
        )}

        {/* Section 5: Related decisions */}
        {relatedDecisions.length > 0 && (
          <section className="mb-8" data-testid="section-related">
            <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              Related Decisions
            </h2>
            <div
              className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100"
              data-testid="related-decisions-list"
            >
              {relatedDecisions.map((decision) => (
                <RelatedDecisionLink key={decision.topicId} decision={decision} />
              ))}
            </div>
          </section>
        )}

        {/* Section 6: CTA to decision page */}
        {decisionLink && (
          <section className="mb-8" data-testid="section-cta">
            <div className="bg-stone-100 rounded-2xl border border-stone-200 p-6 text-center">
              <h2 className="text-sm font-medium text-stone-700 mb-2">
                If you want the official decision
              </h2>
              <p className="text-stone-500 text-sm mb-4">
                Get a personalized verdict based on your specific situation and priorities.
              </p>
              <Link
                href={decisionLink.href}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-800 text-white rounded-lg hover:bg-stone-900 transition-colors text-sm font-medium"
                data-testid="decision-cta"
              >
                <span>View Decision</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        {/* Close framing */}
        <div className="pt-8 border-t border-stone-200">
          <p className="text-stone-500 text-sm">
            <Link
              href={`/guides/${bucketSlug}`}
              className="text-amber-600 hover:text-amber-700 underline underline-offset-2"
            >
              Back to {bucketConfig.title} guides
            </Link>{' '}
            or{' '}
            <Link
              href="/guides"
              className="text-amber-600 hover:text-amber-700 underline underline-offset-2"
            >
              explore all guide categories
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
