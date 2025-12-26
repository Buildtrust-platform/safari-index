/**
 * Blog Schema Component
 *
 * Article JSON-LD structured data for decision blogs.
 * Follows schema.org Article specification.
 */

import type { BlogContent } from '../../../lib/blog-content';

interface BlogSchemaProps {
  blog: BlogContent;
  canonicalUrl: string;
}

export function BlogSchema({ blog, canonicalUrl }: BlogSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: blog.subtitle,
    dateModified: blog.updatedAt,
    datePublished: blog.updatedAt,
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
      '@id': canonicalUrl,
    },
    about: {
      '@type': 'Thing',
      name: blog.title,
      description: `In-depth context for the safari planning decision: ${blog.title}`,
    },
    isPartOf: {
      '@type': 'WebPage',
      '@id': `https://safariindex.com/decisions/${blog.decisionSlug}`,
      name: blog.title,
    },
    wordCount: blog.wordCount,
    articleSection: 'Safari Planning',
    inLanguage: 'en-US',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
