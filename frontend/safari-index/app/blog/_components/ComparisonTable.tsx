/**
 * Comparison Table Component
 *
 * Side-by-side comparison display for A vs B decision blogs.
 * Shows two columns with contrasting features.
 */

import type { BlogContent } from '../../../lib/blog-content';

interface ComparisonTableProps {
  comparisonTable: NonNullable<BlogContent['comparisonTable']>;
}

export function ComparisonTable({ comparisonTable }: ComparisonTableProps) {
  const { leftHeader, rightHeader, rows } = comparisonTable;

  return (
    <div className="my-8 overflow-hidden rounded-xl border border-stone-200 bg-white">
      <table className="w-full text-sm" aria-label={`${leftHeader} vs ${rightHeader} comparison`}>
        <thead>
          <tr className="bg-stone-100">
            <th className="px-4 py-3 text-left font-semibold text-stone-800 w-1/2 border-r border-stone-200">
              {leftHeader}
            </th>
            <th className="px-4 py-3 text-left font-semibold text-stone-800 w-1/2">
              {rightHeader}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? 'bg-white' : 'bg-stone-50'}
            >
              <td className="px-4 py-3 text-stone-700 border-r border-stone-200 align-top">
                {row.left}
              </td>
              <td className="px-4 py-3 text-stone-700 align-top">{row.right}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
