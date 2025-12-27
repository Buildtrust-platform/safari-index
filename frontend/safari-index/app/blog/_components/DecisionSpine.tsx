/**
 * Decision Spine Component
 *
 * Visible block showing the source decision for this blog.
 * Per editorial spec: exactly one decision, must match blog's slug.
 *
 * Format:
 * Related decision
 * "{Decision title}" → /decisions/{decision-slug}
 */

import Link from 'next/link';

interface DecisionSpineProps {
  decisionSlug: string;
  decisionTitle: string;
}

export function DecisionSpine({ decisionSlug, decisionTitle }: DecisionSpineProps) {
  return (
    <aside className="bg-stone-50 border border-stone-200 rounded-lg p-5 mb-10">
      <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
        Related decision
      </p>
      <Link
        href={`/decisions/${decisionSlug}`}
        className="flex items-center gap-2 text-stone-900 hover:text-amber-800"
      >
        <span className="font-editorial text-base font-medium">
          "{decisionTitle}"
        </span>
        <span className="text-stone-400">→</span>
        <span className="text-stone-500 text-sm">/decisions/{decisionSlug}</span>
      </Link>
    </aside>
  );
}
