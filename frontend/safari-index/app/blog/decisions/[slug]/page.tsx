'use client';

/**
 * Decision Blog Page
 *
 * Individual blog article anchored to a decision.
 * Follows strict 9-section template.
 */

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogByDecision } from '../../../../lib/blog-content';
import { getTopicBySlug } from '../../../content/decision-topics';
import {
  BlogHeader,
  BlogSchema,
  BlogSection,
  DecisionAnchor,
  RelatedContent,
} from '../../_components';
import { ImageBand, ImageBandContent, pageImages } from '../../../components/visual';
import { pageContainer } from '../../../ui/styles';
// Initialize blog content
import { initializeBlogs } from '../../../content/blog';

// Ensure blogs are registered before render
initializeBlogs();

export default function DecisionBlogPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // Get the blog content
  const blog = getBlogByDecision(slug);

  // Get the topic for validation
  const topic = getTopicBySlug(slug);

  // No blog or unpublished
  if (!blog || !blog.published) {
    // Check if decision exists but no blog
    if (topic) {
      return (
        <>
          <ImageBand
            image={pageImages.decision}
            height="decision"
            overlay="standard"
            align="center"
          />

          <main className={pageContainer}>
            <div className="mb-6">
              <Link
                href={`/decisions/${slug}`}
                className="inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800"
              >
                <span className="text-amber-500">←</span>
                View the decision verdict
              </Link>
            </div>

            <h1 className="font-editorial text-2xl md:text-3xl font-semibold text-stone-900 mb-4">
              {topic.question}
            </h1>

            <div className="bg-stone-50 border border-stone-200 rounded-lg p-6 my-8">
              <p className="text-stone-600">
                In-depth context for this decision is coming soon.
              </p>
              <p className="text-stone-500 text-sm mt-2">
                In the meantime, see the decision for the quick verdict.
              </p>
            </div>
          </main>
        </>
      );
    }

    notFound();
  }

  const canonicalUrl = `https://safariindex.com/blog/decisions/${slug}`;

  return (
    <>
      {/* Article Schema */}
      <BlogSchema blog={blog} canonicalUrl={canonicalUrl} />

      {/* Hero */}
      <ImageBand
        image={pageImages.decision}
        height="decision"
        overlay="standard"
        align="center"
        priority
      />

      <main className={`${pageContainer} min-h-screen bg-gradient-to-b from-amber-50/30 via-stone-50 to-stone-100`}>
        <article className="max-w-3xl">
          {/* Header with decision link */}
          <BlogHeader
            title={blog.title}
            subtitle={blog.subtitle}
            decisionSlug={blog.decisionSlug}
            updatedAt={blog.updatedAt}
          />

          {/* Section 1: Why This Decision Is Not Simple */}
          <BlogSection
            heading="Why This Decision Is Not Simple"
            content={blog.whyNotSimple}
          />

          {/* Section 2: The Variables That Change the Answer */}
          <BlogSection
            heading="The Variables That Change the Answer"
            content={blog.variables}
          />

          {/* Section 3: Trade-offs People Underestimate */}
          <BlogSection
            heading="Trade-offs People Underestimate"
            content={blog.tradeoffs}
          />

          {/* Section 4: Common Misconceptions */}
          <BlogSection
            heading="Common Misconceptions"
            content={blog.misconceptions}
          />

          {/* Section 5: When This Decision Breaks Down */}
          <BlogSection
            heading="When This Decision Breaks Down"
            content={blog.breaksDown}
          />

          {/* Section 6: How Safari Index Approaches This Decision */}
          <BlogSection
            heading="How Safari Index Approaches This Decision"
            content={blog.ourApproach}
          />

          {/* Related Content */}
          <RelatedContent
            decisions={blog.relatedDecisions}
            trips={blog.relatedTrips}
            guides={blog.relatedGuides}
          />

          {/* Bottom anchor to decision */}
          <DecisionAnchor
            decisionSlug={blog.decisionSlug}
            title={blog.title}
          />
        </article>
      </main>
    </>
  );
}
