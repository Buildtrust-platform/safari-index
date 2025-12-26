/**
 * Blog Header Component
 *
 * Editorial header for decision-linked blogs.
 * Always links back to source decision.
 */

import Link from 'next/link';

interface BlogHeaderProps {
  title: string;
  subtitle: string;
  decisionSlug: string;
  updatedAt: string;
}

export function BlogHeader({
  title,
  subtitle,
  decisionSlug,
  updatedAt,
}: BlogHeaderProps) {
  return (
    <header className="mb-12">
      {/* Decision anchor - always at top */}
      <div className="mb-6">
        <Link
          href={`/decisions/${decisionSlug}`}
          className="inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800"
        >
          <span className="text-amber-500">←</span>
          View the decision verdict
        </Link>
      </div>

      {/* H1 - exact question from decision */}
      <h1 className="font-editorial text-3xl md:text-4xl font-semibold text-stone-900 leading-tight mb-4">
        {title}
      </h1>

      {/* Subhead */}
      <p className="font-editorial text-lg text-stone-600 mb-4">
        {subtitle}
      </p>

      {/* Metadata */}
      <div className="flex items-center gap-4 text-sm text-stone-500">
        <span>Decision reference: {decisionSlug}</span>
        <span className="text-stone-300">|</span>
        <span>Last updated: {updatedAt}</span>
      </div>
    </header>
  );
}
