/**
 * Blog Article Layout with Structured Data
 *
 * Adds JSON-LD structured data:
 * - BreadcrumbList for navigation context
 * - Article schema for rich snippets
 */

import {
  generateBreadcrumbSchema,
  generateArticleSchema,
  renderJsonLd,
} from '../../../../lib/schema';
import { getBlogByDecision } from '../../../../lib/blog-content';
import { initializeBlogs } from '../../../content/blog';

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export default async function BlogArticleLayout({ params, children }: Props) {
  const { slug } = await params;
  initializeBlogs();
  const blog = getBlogByDecision(slug);

  if (!blog || !blog.published) {
    return <>{children}</>;
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Safari Index', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: blog.title, url: `/blog/decisions/${slug}` },
  ]);

  const articleSchema = generateArticleSchema({
    headline: blog.title,
    description: blog.subtitle,
    url: `/blog/decisions/${slug}`,
    datePublished: new Date().toISOString(), // Blog content is evergreen
    authorName: 'Safari Index',
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(articleSchema) }}
      />
      {children}
    </>
  );
}
