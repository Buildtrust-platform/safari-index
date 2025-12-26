'use client';

/**
 * Decision Insight Page
 *
 * Displays deep-dive blogs that extend decisions with deeper context.
 * Per blog specification:
 * - Parent decision link at top
 * - Documentary, non-promotional tone
 * - Related decisions at bottom (2-4)
 * - Never contradicts parent verdict
 */

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { getTopicBySlug, type DecisionTopic } from '../../content/decision-topics';
import { getBlogCollection } from '../../../lib/blog-loader';
// Initialize blog content
import '../../content/insights';
import { MarkdownRenderer } from '../../components/MarkdownRenderer';
import { RelatedDecisions } from '../../components/RelatedDecisions';
import { ImageBand, ImageBandContent, pageImages } from '../../components/visual';
import { pageContainer } from '../../ui/styles';

export default function InsightPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // Get the topic for this slug
  const topic = getTopicBySlug(slug);
  if (!topic) {
    notFound();
  }

  // Get blog collection for this decision
  const blogCollection = getBlogCollection(slug);

  // If no blogs available, show placeholder
  if (!blogCollection?.deepDive) {
    return (
      <>
        <ImageBand
          image={pageImages.decision}
          height="decision"
          overlay="standard"
          align="center"
        />

        <main className={pageContainer}>
          <h1 className="font-editorial text-2xl md:text-3xl font-semibold text-stone-900 mb-4">
            Insights: {topic.question}
          </h1>

          {/* Parent decision link */}
          <ParentDecisionLink topic={topic} />

          <div className="bg-stone-50 border border-stone-200 rounded-lg p-6 my-8">
            <p className="text-stone-600">
              Deep-dive content for this decision is coming soon.
            </p>
            <p className="text-stone-500 text-sm mt-2">
              In the meantime, see the core decision for the quick verdict.
            </p>
          </div>
        </main>
      </>
    );
  }

  const { deepDive, edgeCases, mistakes } = blogCollection;

  // Get related topics for linking
  const relatedTopics = deepDive?.relatedDecisions
    .map(id => getTopicBySlug(id))
    .filter((t): t is DecisionTopic => t !== null && t !== undefined)
    .slice(0, 4) || [];

  return (
    <>
      {/* Cinematic Hero */}
      <ImageBand
        image={pageImages.decision}
        height="decision-hero"
        overlay="cinematic"
        align="center"
        priority
      >
        <ImageBandContent maxWidth="default">
          {/* Eyebrow label */}
          <span className="inline-block font-ui text-xs font-medium text-white/70 uppercase tracking-wider mb-3">
            Deep Dive
          </span>

          {/* H1 - Decision question as title */}
          <h1 className="font-editorial text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-snug tracking-tight mb-3 max-w-[28ch]">
            {topic.question}
          </h1>

          {/* Context line */}
          <p className="font-editorial text-white/80 text-base md:text-lg leading-relaxed mb-6 max-w-xl">
            Extended context and nuance beyond the quick verdict.
          </p>
        </ImageBandContent>
      </ImageBand>

      {/* Body */}
      <main className={`${pageContainer} min-h-screen bg-gradient-to-b from-amber-50/30 via-stone-50 to-stone-100`}>
        {/* Parent decision link - always at top */}
        <ParentDecisionLink topic={topic} />

        {/* Deep Dive Content */}
        <article className="prose prose-stone prose-lg max-w-none mt-8">
          <MarkdownRenderer content={deepDive.content} />
        </article>

        {/* Edge Cases Section (if available) */}
        {edgeCases && (
          <section className="mt-12 pt-8 border-t border-stone-200">
            <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
              Edge Cases
            </h2>
            <article className="prose prose-stone max-w-none">
              <MarkdownRenderer content={edgeCases.content} />
            </article>
          </section>
        )}

        {/* Common Mistakes Section (if available) */}
        {mistakes && (
          <section className="mt-12 pt-8 border-t border-stone-200">
            <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
              Common Mistakes
            </h2>
            <article className="prose prose-stone max-w-none">
              <MarkdownRenderer content={mistakes.content} />
            </article>
          </section>
        )}

        {/* Related Decisions - at bottom per spec */}
        {relatedTopics.length > 0 && (
          <section className="mt-12 pt-8 border-t border-stone-200">
            <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
              Related Decisions
            </h2>
            <RelatedDecisions topics={relatedTopics} />
          </section>
        )}

        {/* Attribution */}
        <footer className="mt-12 pt-6 border-t border-stone-200 text-stone-500 text-sm">
          <p>Last updated: {deepDive.updated}</p>
          <p className="mt-1">
            <Link href={`/decisions/${slug}`} className="text-amber-700 hover:text-amber-800">
              ← Back to decision
            </Link>
          </p>
        </footer>
      </main>
    </>
  );
}

/**
 * Parent Decision Link Component
 * Always appears at top of insight pages per spec
 */
function ParentDecisionLink({ topic }: { topic: DecisionTopic }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
      <p className="text-sm text-stone-600 mb-1">
        This insight extends the decision:
      </p>
      <Link
        href={`/decisions/${topic.slug}`}
        className="font-medium text-amber-800 hover:text-amber-900 underline underline-offset-2"
      >
        {topic.question} →
      </Link>
    </div>
  );
}
