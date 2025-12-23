/**
 * Decision Page Layout with Metadata
 *
 * Per 14_seo_generation.md:
 * - title, description, canonical per page
 * - No marketing language in meta
 */

import { Metadata } from 'next';
import { getTopicBySlug, getPublishedTopics } from '../../content/decision-topics';

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    return {
      title: 'Decision not found',
    };
  }

  const baseUrl = 'https://safariindex.com';

  return {
    title: topic.question,
    description: `${topic.context_line} A clear verdict on ${topic.destinations.join(', ')} with trade-offs, assumptions, and conditions.`,
    alternates: {
      canonical: `${baseUrl}/decisions/${topic.slug}`,
    },
    openGraph: {
      title: topic.question,
      description: topic.context_line,
      url: `${baseUrl}/decisions/${topic.slug}`,
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

export default function DecisionLayout({ children }: Props) {
  return <>{children}</>;
}
