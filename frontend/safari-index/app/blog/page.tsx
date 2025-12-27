/**
 * Blog Index Page
 *
 * Static, indexable page for SEO.
 * H1: "Safari Planning Insights"
 *
 * Lists all decision-linked blogs organized by bucket.
 * Each blog card shows title and one-line neutral summary.
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import {
  MapPin,
  Calendar,
  Users,
  Compass,
  Tent,
  Plane,
  Shield,
  DollarSign,
  ChevronRight,
  ArrowRight,
  Clock,
  BookOpen,
} from 'lucide-react';
import { getAllBlogs, type BlogContent } from '../../lib/blog-content';
import { getTopicBySlug } from '../content/decision-topics';
import {
  ImageBand,
  ImageBandContent,
  ecosystemImages,
  heroImages,
} from '../components/visual';
import { Navbar, Footer } from '../components/layout';
// Initialize blog content
import { initializeBlogs } from '../content/blog';

// Ensure blogs are registered before render
initializeBlogs();

/**
 * SEO Metadata - indexable with canonical
 */
export const metadata: Metadata = {
  title: 'Safari Planning Insights | Safari Index',
  description:
    'Long-form explanations of common safari planning decisions. In-depth context, trade-offs, and nuance for informed safari choices.',
  robots: 'index, follow',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Safari Planning Insights | Safari Index',
    description:
      'Long-form explanations of common safari planning decisions. In-depth context for informed safari choices.',
    type: 'website',
    url: '/blog',
  },
};

/**
 * Bucket configuration with icons and images
 */
const BUCKET_CONFIG: Record<
  string,
  {
    label: string;
    description: string;
    icon: React.ElementType;
    imageIndex: number; // Index into ecosystemImages
  }
> = {
  personal_fit: {
    label: 'Personal Fit',
    description: 'Is safari right for you?',
    icon: Users,
    imageIndex: 3, // montane-forest
  },
  destination_choice: {
    label: 'Destinations',
    description: 'Where should you go?',
    icon: MapPin,
    imageIndex: 0, // savannah-morning
  },
  timing: {
    label: 'Timing',
    description: 'When should you travel?',
    icon: Calendar,
    imageIndex: 4, // floodplain-evening
  },
  experience_type: {
    label: 'Experience Type',
    description: 'What kind of safari?',
    icon: Compass,
    imageIndex: 5, // kopje-landscape
  },
  accommodation: {
    label: 'Accommodation',
    description: 'Where to stay?',
    icon: Tent,
    imageIndex: 6, // woodland-clearing
  },
  logistics: {
    label: 'Logistics',
    description: 'How to plan and book?',
    icon: Plane,
    imageIndex: 7, // crater-highlands
  },
  risk_ethics: {
    label: 'Risk & Ethics',
    description: 'Safety considerations',
    icon: Shield,
    imageIndex: 2, // desert-dunes
  },
  value_cost: {
    label: 'Value & Cost',
    description: 'Budget decisions',
    icon: DollarSign,
    imageIndex: 1, // delta-channels
  },
  other: {
    label: 'Other',
    description: 'Additional topics',
    icon: BookOpen,
    imageIndex: 0,
  },
};

/**
 * Calculate reading time from word count
 */
function getReadingTime(wordCount: number): string {
  const minutes = Math.ceil(wordCount / 200);
  return `${minutes} min`;
}

export default function BlogIndex() {
  const blogs = getAllBlogs().filter((b) => b.published);

  // Group blogs by bucket (derived from decision topics)
  const blogsByBucket = blogs.reduce(
    (acc, blog) => {
      const topic = getTopicBySlug(blog.decisionSlug);
      const bucket = topic?.bucket || 'other';
      if (!acc[bucket]) {
        acc[bucket] = [];
      }
      acc[bucket].push(blog);
      return acc;
    },
    {} as Record<string, BlogContent[]>
  );

  // Get featured blogs (first 3 for hero section)
  const featuredBlogs = blogs.slice(0, 3);

  // Get bucket order for display
  const bucketOrder = [
    'destination_choice',
    'timing',
    'personal_fit',
    'experience_type',
    'accommodation',
    'logistics',
    'value_cost',
    'risk_ethics',
  ];

  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar variant="transparent" />

      {/* Hero Section */}
      <ImageBand
        image={heroImages.explore}
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
              <span className="text-white">Insights</span>
            </div>

            {/* Icon + Title */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <BookOpen className="w-6 h-6 text-amber-400" />
              </div>
              <h1 className="font-editorial text-4xl md:text-5xl font-semibold text-white" data-testid="blog-h1">
                Safari Planning Insights
              </h1>
            </div>

            {/* Subtitle - intro paragraph explaining these are long-form decision explanations */}
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Long-form explanations of common safari planning decisions.
              Trade-offs, nuance, and context that doesn't fit a quick verdict.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 mt-6 text-white/60 text-sm">
              <span>{blogs.length} articles</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>{bucketOrder.filter((b) => blogsByBucket[b]?.length).length} categories</span>
            </div>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Featured Articles */}
      {featuredBlogs.length > 0 && (
        <section className="bg-white py-12 border-b border-stone-200">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-editorial text-2xl font-semibold text-stone-900">
                  Featured Articles
                </h2>
                <p className="text-stone-500 text-sm mt-1">
                  Start here for essential safari planning context
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredBlogs.map((blog, index) => (
                <FeaturedBlogCard
                  key={blog.decisionSlug}
                  blog={blog}
                  imageIndex={index}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Sections */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <div className="space-y-16">
          {bucketOrder.map((bucket) => {
            const bucketBlogs = blogsByBucket[bucket];
            if (!bucketBlogs || bucketBlogs.length === 0) return null;

            const config = BUCKET_CONFIG[bucket];
            const Icon = config.icon;
            const bgImage = ecosystemImages[config.imageIndex];

            return (
              <section key={bucket} id={bucket.replace('_', '-')}>
                {/* Category header with image */}
                <div className="relative rounded-2xl overflow-hidden mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-900/70 to-transparent z-10" />
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${bgImage.src})`,
                    }}
                  />
                  <div className="relative z-20 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                        <Icon className="w-5 h-5 text-amber-400" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h2 className="font-editorial text-xl font-semibold text-white">
                          {config.label}
                        </h2>
                        <p className="text-white/60 text-sm">{config.description}</p>
                      </div>
                    </div>
                    <p className="text-white/70 text-sm mt-2">
                      {bucketBlogs.length} article{bucketBlogs.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Article grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bucketBlogs.map((blog) => (
                    <BlogCard key={blog.decisionSlug} blog={blog} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* About section */}
        <section className="mt-20 bg-stone-100 rounded-2xl p-8 md:p-10">
          <div className="max-w-2xl">
            <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
              About These Articles
            </h2>
            <div className="space-y-4 text-stone-600 leading-relaxed">
              <p>
                Each article extends a Safari Index decision with additional context.
                These are not opinion pieces or travel-magazine features. They explore
                the complexity behind decisions, the variables that change answers,
                and the trade-offs that travelers often underestimate.
              </p>
              <p>
                Every article links to its source decision. Start with the decision
                for a quick verdict, then read the article if you want deeper
                understanding.
              </p>
            </div>
            <Link
              href="/decisions"
              className="inline-flex items-center gap-2 mt-6 text-amber-700 hover:text-amber-800 font-medium"
            >
              Browse all decisions
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}

/**
 * Featured blog card with larger image
 */
function FeaturedBlogCard({
  blog,
  imageIndex,
}: {
  blog: BlogContent;
  imageIndex: number;
}) {
  const topic = getTopicBySlug(blog.decisionSlug);
  const bucket = topic?.bucket || 'other';
  const config = BUCKET_CONFIG[bucket];
  const Icon = config.icon;
  const bgImage = ecosystemImages[imageIndex % ecosystemImages.length];

  return (
    <Link
      href={`/blog/decisions/${blog.decisionSlug}`}
      className="group block bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-amber-300 hover:shadow-lg transition-all"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url(${bgImage.src})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm text-stone-700 rounded-full">
            <Icon className="w-3 h-3" />
            {config.label}
          </span>
        </div>

        {/* Reading time */}
        <div className="absolute bottom-3 right-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-white/90 bg-black/40 backdrop-blur-sm rounded-full">
            <Clock className="w-3 h-3" />
            {getReadingTime(blog.wordCount)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-editorial text-lg font-semibold text-stone-900 mb-2 group-hover:text-amber-700 transition-colors line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-stone-500 text-sm line-clamp-2">{blog.subtitle}</p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
          <span className="text-xs text-stone-400">Updated {blog.updatedAt}</span>
          <span className="text-xs text-amber-600 group-hover:text-amber-700 font-medium flex items-center gap-1">
            Read article
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/**
 * Standard blog card
 */
function BlogCard({ blog }: { blog: BlogContent }) {
  const topic = getTopicBySlug(blog.decisionSlug);
  const bucket = topic?.bucket || 'other';
  const config = BUCKET_CONFIG[bucket];
  const Icon = config.icon;

  return (
    <Link
      href={`/blog/decisions/${blog.decisionSlug}`}
      className="group block bg-white rounded-xl border border-stone-200 p-5 hover:border-amber-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-stone-100 group-hover:bg-amber-100 flex items-center justify-center transition-colors">
          <Icon className="w-5 h-5 text-stone-500 group-hover:text-amber-600 transition-colors" strokeWidth={1.5} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-editorial text-base font-semibold text-stone-900 mb-1 group-hover:text-amber-700 transition-colors line-clamp-2">
            {blog.title}
          </h3>
          <p className="text-stone-500 text-sm line-clamp-2 mb-3">{blog.subtitle}</p>

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-stone-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {getReadingTime(blog.wordCount)}
            </span>
            <span className="w-1 h-1 rounded-full bg-stone-300" />
            <span>{blog.updatedAt}</span>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0">
          <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  );
}
