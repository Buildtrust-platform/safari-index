/**
 * Blog Schema Component
 *
 * Article JSON-LD structured data for decision blogs.
 * Follows schema.org Article specification.
 * Includes FAQPage schema when FAQ data is available.
 */

import type { BlogContent } from '../../../lib/blog-content';

interface BlogSchemaProps {
  blog: BlogContent;
  canonicalUrl: string;
}

export function BlogSchema({ blog, canonicalUrl }: BlogSchemaProps) {
  // Use individual author if available, otherwise organization
  const authorSchema = blog.author
    ? {
        '@type': 'Person',
        name: blog.author.name,
        jobTitle: blog.author.role,
        description: blog.author.credentials,
      }
    : {
        '@type': 'Organization',
        name: 'Vurara Safaris',
        url: 'https://www.vurarasafaris.com',
      };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: blog.subtitle,
    dateModified: blog.updatedAt,
    datePublished: blog.updatedAt,
    author: authorSchema,
    publisher: {
      '@type': 'Organization',
      name: 'Vurara Safaris',
      url: 'https://www.vurarasafaris.com',
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
      '@id': `https://www.vurarasafaris.com/decisions/${blog.decisionSlug}`,
      name: blog.title,
    },
    wordCount: blog.wordCount,
    articleSection: 'Safari Planning',
    inLanguage: 'en-US',
  };

  // FAQPage schema when FAQ data is present
  const faqSchema = blog.faq?.items?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: blog.faq.items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}
