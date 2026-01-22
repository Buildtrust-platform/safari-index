/**
 * Verdict Box Component
 *
 * Visual display of the editorial verdict for comparison/decision blogs.
 * Shows verdict, recommendation, and outcome indicator.
 */

import type { BlogContent } from '../../../lib/blog-content';

interface VerdictBoxProps {
  verdictBox: NonNullable<BlogContent['verdictBox']>;
}

export function VerdictBox({ verdictBox }: VerdictBoxProps) {
  const { verdict, recommendation, outcome = 'depends' } = verdictBox;

  const outcomeStyles: Record<string, string> = {
    yes: 'bg-emerald-50 border-emerald-200',
    no: 'bg-rose-50 border-rose-200',
    depends: 'bg-amber-50 border-amber-200',
    wait: 'bg-blue-50 border-blue-200',
  };

  const outcomeLabels: Record<string, string> = {
    yes: 'Clear Winner',
    no: 'Not Recommended',
    depends: 'It Depends',
    wait: 'Worth Waiting',
  };

  const outcomeBadgeStyles: Record<string, string> = {
    yes: 'bg-emerald-100 text-emerald-800',
    no: 'bg-rose-100 text-rose-800',
    depends: 'bg-amber-100 text-amber-800',
    wait: 'bg-blue-100 text-blue-800',
  };

  const outcomeIcons: Record<string, string> = {
    yes: '✓',
    no: '✗',
    depends: '⚖',
    wait: '⏳',
  };

  return (
    <aside
      className={`my-8 rounded-xl border-2 p-6 ${outcomeStyles[outcome] || outcomeStyles.depends}`}
      aria-label="Editorial verdict"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl" aria-hidden="true">
          {outcomeIcons[outcome] || '⚖'}
        </span>
        <span
          className={`text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded ${outcomeBadgeStyles[outcome] || outcomeBadgeStyles.depends}`}
        >
          {outcomeLabels[outcome] || 'It Depends'}
        </span>
      </div>

      <h3 className="font-editorial text-xl font-semibold text-stone-900 mb-3">
        The Verdict
      </h3>

      <p className="text-stone-700 leading-relaxed mb-4">{verdict}</p>

      {recommendation && (
        <div className="pt-4 border-t border-stone-200/50">
          <p className="text-sm text-stone-600 italic">
            <strong className="not-italic text-stone-700">Our recommendation:</strong>{' '}
            {recommendation}
          </p>
        </div>
      )}
    </aside>
  );
}
