/**
 * Decision Anchor Component
 *
 * Blog footer with:
 * - Closing statement (no summary hype)
 * - CTA to /inquire
 * - Back link to source decision
 */

import Link from 'next/link';

interface DecisionAnchorProps {
  decisionSlug: string;
  title: string;
}

export function DecisionAnchor({ decisionSlug, title }: DecisionAnchorProps) {
  return (
    <footer className="mt-12 pt-8 border-t border-stone-200 space-y-6">
      {/* Closing statement */}
      <p className="text-stone-700 leading-relaxed">
        If this decision connects to your travel plans, you can plan a safari with Safari Index.
      </p>

      {/* CTA */}
      <div>
        <Link
          href="/inquire"
          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          Plan a Safari
          <span className="text-amber-200">→</span>
        </Link>
      </div>

      {/* Back to decision link */}
      <div className="pt-4 border-t border-stone-100">
        <Link
          href={`/decisions/${decisionSlug}`}
          className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 text-sm"
        >
          <span className="text-amber-500">←</span>
          Back to decision: {title}
        </Link>
      </div>
    </footer>
  );
}
