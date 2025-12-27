/**
 * Related Content Component
 *
 * Displays supporting decisions, trips, and guides in organized card layout.
 * Per editorial spec:
 * - Supporting decisions: max 3 (same or adjacent bucket)
 * - Trips: max 2 with fit descriptions
 * - Guides: max 2 (optional)
 */

import Link from 'next/link';
import type { RelatedLink } from '../../../lib/blog-content';

interface RelatedContentProps {
  decisions: RelatedLink[];
  trips: RelatedLink[];
  guides: RelatedLink[];
}

/**
 * Individual link card with hover effect
 */
function LinkCard({
  href,
  title,
  type,
}: {
  href: string;
  title: string;
  type: 'decision' | 'trip' | 'guide';
}) {
  const typeLabels = {
    decision: 'Decision',
    trip: 'Safari',
    guide: 'Guide',
  };

  return (
    <Link
      href={href}
      className="group block bg-white rounded-xl border border-stone-200 p-4 hover:border-amber-300 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wider">
            {typeLabels[type]}
          </span>
          <h3 className="text-stone-800 group-hover:text-amber-700 transition-colors text-sm font-medium mt-1 leading-snug">
            {title}
          </h3>
        </div>
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-stone-100 group-hover:bg-amber-100 flex items-center justify-center transition-colors">
          <svg
            className="w-4 h-4 text-stone-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export function RelatedContent({ decisions, trips, guides }: RelatedContentProps) {
  const hasContent = decisions.length > 0 || trips.length > 0 || guides.length > 0;

  if (!hasContent) return null;

  return (
    <aside className="mt-16">
      {/* Section container with subtle background */}
      <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 md:p-8">
        {/* Section header */}
        <div className="mb-6">
          <h2 className="font-editorial text-lg font-semibold text-stone-900">
            Continue exploring
          </h2>
          <p className="text-stone-500 text-sm mt-1">
            Related decisions and itineraries to help you plan
          </p>
        </div>

        {/* Cards grid */}
        <div className="space-y-6">
          {/* Decisions section */}
          {decisions.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-stone-200 flex items-center justify-center">
                  <svg className="w-3 h-3 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                Related Decisions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {decisions.slice(0, 3).map((link) => (
                  <LinkCard
                    key={link.slug}
                    href={`/decisions/${link.slug}`}
                    title={link.title}
                    type="decision"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Trips section - links to /trips/[id] per spec */}
          {trips.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-amber-100 flex items-center justify-center">
                  <svg className="w-3 h-3 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </span>
                Safaris Where This Decision Matters
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" data-testid="related-trips">
                {trips.slice(0, 2).map((link) => (
                  <LinkCard
                    key={link.slug}
                    href={`/trips/${link.slug}`}
                    title={link.title}
                    type="trip"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Guides section */}
          {guides.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-stone-200 flex items-center justify-center">
                  <svg className="w-3 h-3 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </span>
                Deep Reading
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {guides.slice(0, 2).map((link) => (
                  <LinkCard
                    key={link.slug}
                    href={`/guides/${link.slug}`}
                    title={link.title}
                    type="guide"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
