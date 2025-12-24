/**
 * Related Decisions Component
 *
 * Per 13_frontend_templates.md Section 10:
 * - 3-5 links max
 * - Must be contextually adjacent, not random
 * - No decorative elements
 */

import Link from 'next/link';
import { DecisionTopic } from '../content/decision-topics';
import { sectionHeading, listContainer } from '../ui/styles';

interface RelatedDecisionsProps {
  topics: DecisionTopic[];
}

export function RelatedDecisions({ topics }: RelatedDecisionsProps) {
  if (topics.length === 0) return null;

  return (
    <nav className="mt-12 pt-8 border-t border-gray-200" aria-labelledby="related-heading">
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
    </nav>
  );
}
