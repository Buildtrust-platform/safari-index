/**
 * Decision Page Layout with Metadata and Structured Data
 *
 * Per 14_seo_generation.md:
 * - title, description, canonical per page
 * - No marketing language in meta
 *
 * Includes JSON-LD structured data:
 * - FAQPage schema for rich snippets
 * - BreadcrumbList for navigation context
 */

import { Metadata } from 'next';
import { getTopicBySlug, getPublishedTopics } from '../../content/decision-topics';
import {
  generateFAQSchema,
  generateBreadcrumbSchema,
  renderJsonLd,
} from '../../../lib/schema';

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

const BASE_URL = 'https://safariindex.com';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    return {
      title: 'Decision not found',
    };
  }

  return {
    title: topic.question,
    description: `${topic.context_line} A clear verdict on ${topic.destinations.join(', ')} with trade-offs, assumptions, and conditions.`,
    alternates: {
      canonical: `${BASE_URL}/decisions/${topic.slug}`,
    },
    openGraph: {
      title: topic.question,
      description: topic.context_line,
      url: `${BASE_URL}/decisions/${topic.slug}`,
      type: 'article',
    },
  };
}

export async function generateStaticParams() {
  const topics = getPublishedTopics();
  return topics.map((topic) => ({
    slug: topic.slug,
  }));
}

export default async function DecisionLayout({ params, children }: Props) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    return <>{children}</>;
  }

  // Generate FAQ schema - the main question with context as answer
  const faqSchema = generateFAQSchema([
    {
      question: topic.question,
      answer: topic.context_line,
    },
  ]);

  // Generate breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Safari Index', url: '/' },
    { name: 'Decisions', url: '/decisions' },
    { name: topic.question, url: `/decisions/${topic.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
