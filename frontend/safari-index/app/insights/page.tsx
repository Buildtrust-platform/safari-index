'use client';

/**
 * Insights Hub Page
 *
 * Lists all available decision insights organized by category.
 * Entry point for users exploring deep-dive content.
 */

import Link from 'next/link';
import { getDecisionsWithBlogs, getBlogCollection } from '../../lib/blog-loader';
import { getTopicBySlug, type DecisionTopic } from '../content/decision-topics';
import { ImageBand, ImageBandContent, pageImages } from '../components/visual';
import { pageContainer } from '../ui/styles';
// Initialize blog content
import { initializeBlogs } from '../content/insights';

// Ensure blogs are registered before render
initializeBlogs();

export default function InsightsHub() {
  const decisionSlugs = getDecisionsWithBlogs();

  // Get topics for each decision with blogs
  const decisionsWithInsights = decisionSlugs
    .map(slug => {
      const topic = getTopicBySlug(slug);
      const collection = getBlogCollection(slug);
      if (!topic || !collection?.deepDive) return null;
      return { topic, collection };
    })
    .filter((item): item is { topic: DecisionTopic; collection: NonNullable<ReturnType<typeof getBlogCollection>> } =>
      item !== null
    );

  return (
    <>
      {/* Hero */}
      <ImageBand
        image={pageImages.decision}
        height="decision"
        overlay="standard"
        align="center"
        priority
      >
        <ImageBandContent maxWidth="default">
          <span className="inline-block font-ui text-xs font-medium text-white/70 uppercase tracking-wider mb-3">
            Safari Index
          </span>
          <h1 className="font-editorial text-3xl md:text-4xl font-semibold text-white leading-snug tracking-tight mb-3">
            Decision Insights
          </h1>
          <p className="font-editorial text-white/80 text-base md:text-lg leading-relaxed max-w-xl">
            Deep context beyond the quick verdict. Nuance, edge cases, and common mistakes.
          </p>
        </ImageBandContent>
      </ImageBand>

      <main className={`${pageContainer} min-h-screen bg-gradient-to-b from-amber-50/30 via-stone-50 to-stone-100`}>
        {decisionsWithInsights.length === 0 ? (
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-8 text-center">
            <p className="text-stone-600 mb-2">No insights published yet.</p>
            <p className="text-stone-500 text-sm">
              Deep-dive content is being developed for key decisions.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {decisionsWithInsights.map(({ topic, collection }) => (
              <InsightCard
                key={topic.slug}
                topic={topic}
                hasEdgeCases={!!collection.edgeCases}
                hasMistakes={!!collection.mistakes}
                updated={collection.deepDive?.updated || ''}
              />
            ))}
          </div>
        )}

        {/* About section */}
        <section className="mt-12 pt-8 border-t border-stone-200">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
            About Decision Insights
          </h2>
          <div className="prose prose-stone max-w-none">
            <p>
              Each insight extends a core decision with additional context that didn't fit
              the quick verdict format. These aren't opinion pieces—they're documentary
              explorations of the nuances that experienced travelers discover over time.
            </p>
            <p>
              Every insight links back to its parent decision. Start there for the verdict,
              then read the insight if you want to understand the full picture.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

/**
 * Individual insight card component
 */
function InsightCard({
  topic,
  hasEdgeCases,
  hasMistakes,
  updated,
}: {
  topic: DecisionTopic;
  hasEdgeCases: boolean;
  hasMistakes: boolean;
  updated: string;
}) {
  return (
    <article className="bg-white border border-stone-200 rounded-lg p-6 hover:border-amber-300 transition-colors">
      <Link href={`/insights/${topic.slug}`} className="block">
        <h2 className="font-editorial text-lg font-semibold text-stone-900 mb-2 hover:text-amber-800">
          {topic.question}
        </h2>
        <p className="text-stone-600 text-sm mb-3">
          {topic.context_line}
        </p>
        <div className="flex items-center gap-4 text-xs text-stone-500">
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Deep Dive
          </span>
          {hasEdgeCases && (
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-stone-300" />
              Edge Cases
            </span>
          )}
          {hasMistakes && (
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-stone-300" />
              Mistakes
            </span>
          )}
          {updated && (
            <span className="ml-auto">Updated {updated}</span>
          )}
        </div>
      </Link>

      {/* Link to parent decision */}
      <div className="mt-4 pt-3 border-t border-stone-100">
        <Link
          href={`/decisions/${topic.slug}`}
          className="text-xs text-amber-700 hover:text-amber-800"
        >
          View decision verdict →
        </Link>
      </div>
    </article>
  );
}
