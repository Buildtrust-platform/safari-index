'use client';

/**
 * Blog Index Page
 *
 * Lists all decision-linked blogs organized by bucket.
 * No orphan blogs - every entry links to a decision.
 */

import Link from 'next/link';
import { getAllBlogs, type BlogContent } from '../../lib/blog-content';
import { getTopicBySlug } from '../content/decision-topics';
import { ImageBand, ImageBandContent, pageImages } from '../components/visual';
import { pageContainer } from '../ui/styles';
// Initialize blog content
import { initializeBlogs } from '../content/blog';

// Ensure blogs are registered before render
initializeBlogs();

export default function BlogIndex() {
  const blogs = getAllBlogs();

  // Group blogs by bucket (derived from decision topics)
  const blogsByBucket = blogs.reduce((acc, blog) => {
    const topic = getTopicBySlug(blog.decisionSlug);
    const bucket = topic?.bucket || 'other';
    if (!acc[bucket]) {
      acc[bucket] = [];
    }
    acc[bucket].push(blog);
    return acc;
  }, {} as Record<string, BlogContent[]>);

  const bucketLabels: Record<string, string> = {
    destination_choice: 'Destination Choice',
    timing: 'Timing',
    personal_fit: 'Personal Fit',
    experience_type: 'Experience Type',
    accommodation: 'Accommodation',
    logistics: 'Logistics',
    risk_ethics: 'Risk & Ethics',
    value_cost: 'Value & Cost',
    other: 'Other',
  };

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
            Decision Context
          </h1>
          <p className="font-editorial text-white/80 text-base md:text-lg leading-relaxed max-w-xl">
            In-depth context for safari planning decisions. Each article extends a decision with the nuance that doesn't fit a quick verdict.
          </p>
        </ImageBandContent>
      </ImageBand>

      <main className={`${pageContainer} min-h-screen bg-gradient-to-b from-amber-50/30 via-stone-50 to-stone-100`}>
        {blogs.length === 0 ? (
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-8 text-center">
            <p className="text-stone-600 mb-2">No blog articles published yet.</p>
            <p className="text-stone-500 text-sm">
              In-depth context articles are being developed for key decisions.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(blogsByBucket).map(([bucket, bucketBlogs]) => (
              <section key={bucket}>
                <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-6">
                  {bucketLabels[bucket] || bucket}
                </h2>
                <div className="space-y-4">
                  {bucketBlogs.map((blog) => (
                    <BlogCard key={blog.decisionSlug} blog={blog} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* About section */}
        <section className="mt-16 pt-8 border-t border-stone-200">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
            About These Articles
          </h2>
          <div className="prose prose-stone max-w-none">
            <p className="text-stone-700 leading-relaxed">
              Each article extends a Safari Index decision with additional context. These are not opinion pieces or travel-magazine features. They explore the complexity behind decisions, the variables that change answers, and the trade-offs that travelers often underestimate.
            </p>
            <p className="text-stone-700 leading-relaxed mt-4">
              Every article links to its source decision. Start with the decision for a quick verdict, then read the article if you want deeper understanding.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

/**
 * Individual blog card
 */
function BlogCard({ blog }: { blog: BlogContent }) {
  const topic = getTopicBySlug(blog.decisionSlug);

  return (
    <article className="bg-white border border-stone-200 rounded-lg p-6 hover:border-amber-300 transition-colors">
      <Link href={`/blog/decisions/${blog.decisionSlug}`} className="block">
        <h3 className="font-editorial text-lg font-semibold text-stone-900 mb-2 hover:text-amber-800">
          {blog.title}
        </h3>
        <p className="text-stone-600 text-sm mb-3">
          {blog.subtitle}
        </p>
        <div className="flex items-center gap-4 text-xs text-stone-500">
          <span>{blog.wordCount.toLocaleString()} words</span>
          <span className="text-stone-300">|</span>
          <span>Updated {blog.updatedAt}</span>
        </div>
      </Link>

      {/* Link to source decision */}
      <div className="mt-4 pt-3 border-t border-stone-100">
        <Link
          href={`/decisions/${blog.decisionSlug}`}
          className="text-xs text-amber-700 hover:text-amber-800"
        >
          View decision verdict →
        </Link>
      </div>
    </article>
  );
}
