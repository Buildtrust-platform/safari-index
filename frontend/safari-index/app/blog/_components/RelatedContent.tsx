/**
 * Related Content Component
 *
 * Displays related decisions, trips, and guides.
 * Strict limits: 6 decisions, 3 trips, 3 guides.
 */

import Link from 'next/link';
import type { RelatedLink } from '../../../lib/blog-content';

interface RelatedContentProps {
  decisions: RelatedLink[];
  trips: RelatedLink[];
  guides: RelatedLink[];
}

export function RelatedContent({ decisions, trips, guides }: RelatedContentProps) {
  return (
    <aside className="mt-16 pt-8 border-t border-stone-200">
      {/* Related Decisions */}
      {decisions.length > 0 && (
        <section className="mb-10">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
            Related Decisions
          </h2>
          <ul className="space-y-2">
            {decisions.slice(0, 6).map((link) => (
              <li key={link.slug}>
                <Link
                  href={`/decisions/${link.slug}`}
                  className="text-amber-700 hover:text-amber-800 underline underline-offset-2"
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Related Trips */}
      {trips.length > 0 && (
        <section className="mb-10">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
            Related Trips
          </h2>
          <ul className="space-y-2">
            {trips.slice(0, 3).map((link) => (
              <li key={link.slug}>
                <Link
                  href={`/trips/${link.slug}`}
                  className="text-amber-700 hover:text-amber-800 underline underline-offset-2"
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Related Guides */}
      {guides.length > 0 && (
        <section className="mb-10">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
            Related Guides
          </h2>
          <ul className="space-y-2">
            {guides.slice(0, 3).map((link) => (
              <li key={link.slug}>
                <Link
                  href={`/guides/${link.slug}`}
                  className="text-amber-700 hover:text-amber-800 underline underline-offset-2"
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
}
