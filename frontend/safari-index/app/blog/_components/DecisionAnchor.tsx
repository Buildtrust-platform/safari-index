/**
 * Decision Anchor Component
 *
 * Bottom link back to source decision.
 * Every blog ends with this anchor.
 */

import Link from 'next/link';

interface DecisionAnchorProps {
  decisionSlug: string;
  title: string;
}

export function DecisionAnchor({ decisionSlug, title }: DecisionAnchorProps) {
  return (
    <footer className="mt-12 pt-8 border-t border-stone-200">
      <Link
        href={`/decisions/${decisionSlug}`}
        className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 font-medium"
      >
        <span className="text-amber-500">←</span>
        Back to decision: {title}
      </Link>
    </footer>
  );
}
