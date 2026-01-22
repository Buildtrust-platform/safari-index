/**
 * Related Decisions Component
 *
 * Per 13_frontend_templates.md Section 10:
 * - 3-5 links max
 * - Must be contextually adjacent, not random
 * - No decorative elements
 *
 * Hub & Spoke SEO:
 * - Also shows related blog articles (bidirectional linking)
 * - Decisions link to blogs, blogs link back to decisions
 */

import Link from 'next/link';
import { DecisionTopic } from '../content/decision-topics';
import { getBlogsLinkingToDecision, hasBlog } from '../../lib/blog-content';
import { sectionHeading, listContainer } from '../ui/styles';

interface RelatedDecisionsProps {
  topics: DecisionTopic[];
  /** Current decision slug for bidirectional blog linking */
  currentDecisionSlug?: string;
}

export function RelatedDecisions({ topics, currentDecisionSlug }: RelatedDecisionsProps) {
  // Get blogs that link to this decision (bidirectional)
  const relatedBlogs = currentDecisionSlug
    ? getBlogsLinkingToDecision(currentDecisionSlug).slice(0, 3)
    : [];

  // Check if current decision has a dedicated blog
  const hasDeepDive = currentDecisionSlug ? hasBlog(currentDecisionSlug) : false;

  if (topics.length === 0 && relatedBlogs.length === 0 && !hasDeepDive) return null;

  return (
    <nav className="mt-12 pt-8 border-t border-gray-200" aria-labelledby="related-heading">
      {/* Deep dive blog link */}
      {hasDeepDive && currentDecisionSlug && (
        <div className="mb-6">
          <h2 className={sectionHeading}>Deep dive</h2>
          <Link
            href={`/blog/decisions/${currentDecisionSlug}`}
            prefetch={false}
            className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 font-medium"
          >
            Read the full analysis →
          </Link>
        </div>
      )}

      {/* Related decisions */}
      {topics.length > 0 && (
        <>
          <h2 id="related-heading" className={sectionHeading}>Related decisions</h2>
          <ul className={listContainer}>
            {topics.slice(0, 5).map((topic) => (
              <li key={topic.topic_id}>
                <Link
                  href={`/decisions/${topic.slug}`}
                  prefetch={false}
                  className="text-gray-700 hover:text-gray-900 hover:underline"
                >
                  {topic.question}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Related blog articles (bidirectional linking) */}
      {relatedBlogs.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
            Related articles
          </h3>
          <ul className={listContainer}>
            {relatedBlogs.map((blog) => (
              <li key={blog.decisionSlug}>
                <Link
                  href={`/blog/decisions/${blog.decisionSlug}`}
                  prefetch={false}
                  className="text-gray-700 hover:text-gray-900 hover:underline"
                >
                  {blog.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
