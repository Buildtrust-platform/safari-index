/**
 * Decision Blog Page
 *
 * Static, indexable blog article anchored to a decision.
 * Uses generateMetadata for SEO and generateStaticParams for static generation.
 *
 * Structure per editorial spec:
 * 1. Intro (context-setting)
 * 2. Decision Spine (visible decision block)
 * 3. Core Analysis Sections
 * 4. Supporting Decisions (max 3)
 * 5. Trip Embedding (max 2)
 * 6. Optional Deep Reading (max 2)
 * 7. Closing with CTA to /inquire
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getBlogByDecision, getAllBlogs } from '../../../../lib/blog-content';
import { getTopicBySlug } from '../../../content/decision-topics';
import {
  BlogHeader,
  BlogSchema,
  BlogSection,
  DecisionAnchor,
  DecisionSpine,
  RelatedContent,
} from '../../_components';
import { ImageBand, pageImages } from '../../../components/visual';
import { Navbar, Footer } from '../../../components/layout';
import { pageContainer } from '../../../ui/styles';
// Initialize blog content
import { initializeBlogs } from '../../../content/blog';

// Ensure blogs are registered at build time
initializeBlogs();

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate static params for all published blogs
 */
export async function generateStaticParams() {
  initializeBlogs();
  const blogs = getAllBlogs();
  return blogs.map((blog) => ({
    slug: blog.decisionSlug,
  }));
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  initializeBlogs();
  const blog = getBlogByDecision(slug);

  if (!blog || !blog.published) {
    return {
      title: 'Article Not Found | Safari Index',
    };
  }

  const canonicalUrl = `/blog/decisions/${slug}`;

  return {
    title: `${blog.title} | Safari Index`,
    description: blog.subtitle,
    robots: 'index, follow',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: blog.title,
      description: blog.subtitle,
      type: 'article',
      url: canonicalUrl,
      publishedTime: blog.updatedAt,
      modifiedTime: blog.updatedAt,
      authors: ['Safari Index'],
      section: 'Safari Planning',
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.subtitle,
    },
  };
}

export default async function DecisionBlogPage({ params }: PageProps) {
  const { slug } = await params;

  // Get the blog content
  const blog = getBlogByDecision(slug);

  // Get the topic for validation
  const topic = getTopicBySlug(slug);

  // No blog or unpublished
  if (!blog || !blog.published) {
    // Check if decision exists but no blog
    if (topic) {
      return (
        <main className="min-h-screen bg-stone-50">
          <Navbar />
          <ImageBand
            image={pageImages.decision}
            height="decision"
            overlay="standard"
            align="center"
          />

          <div className={pageContainer}>
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
          </div>
          <Footer />
        </main>
      );
    }

    notFound();
  }

  const canonicalUrl = `https://safariindex.com/blog/decisions/${slug}`;

  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar />

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

      <div className={`${pageContainer} min-h-screen bg-gradient-to-b from-amber-50/30 via-stone-50 to-stone-100`}>
        <article className="max-w-3xl" data-testid="blog-article">
          {/* 1. Header (Intro) */}
          <BlogHeader
            title={blog.title}
            subtitle={blog.subtitle}
            decisionSlug={blog.decisionSlug}
            updatedAt={blog.updatedAt}
          />

          {/* 2. Decision Spine - visible decision block */}
          <DecisionSpine
            decisionSlug={blog.decisionSlug}
            decisionTitle={blog.title}
          />

          {/* 3. Core Analysis Sections */}
          <BlogSection
            heading="Why This Decision Is Not Simple"
            content={blog.whyNotSimple}
          />

          <BlogSection
            heading="The Variables That Change the Answer"
            content={blog.variables}
          />

          <BlogSection
            heading="Trade-offs People Underestimate"
            content={blog.tradeoffs}
          />

          <BlogSection
            heading="Common Misconceptions"
            content={blog.misconceptions}
          />

          <BlogSection
            heading="When This Decision Breaks Down"
            content={blog.breaksDown}
          />

          <BlogSection
            heading="How Safari Index Approaches This Decision"
            content={blog.ourApproach}
          />

          {/* 4-6. Related Content (decisions, trips, guides) */}
          <RelatedContent
            decisions={blog.relatedDecisions}
            trips={blog.relatedTrips}
            guides={blog.relatedGuides}
          />

          {/* 7. Closing with CTA */}
          <DecisionAnchor
            decisionSlug={blog.decisionSlug}
            title={blog.title}
          />
        </article>
      </div>

      <Footer />
    </main>
  );
}
