/**
 * Assumptions Block Component
 *
 * Per 13_frontend_templates.md Section 1D:
 * - Purpose: enforce responsibility boundary
 * - Contains: 2-5 assumptions, each short, specific, testable
 * - Never hide assumptions in fine print
 *
 * Per 02_decision_doctrine.md:
 * - Every decision is conditional on stated assumptions
 * - Assumptions are first-class outputs
 */

import { section, sectionHeading, textMuted, listText } from '../ui/styles';

interface Assumption {
  id: string;
  text: string;
  confidence: number;
}

interface AssumptionsBlockProps {
  assumptions: Assumption[];
}

export function AssumptionsBlock({ assumptions }: AssumptionsBlockProps) {
  return (
    <section className={section} aria-labelledby="assumptions-heading">
      <h2 id="assumptions-heading" className={sectionHeading}>Assumptions</h2>
      <p className={`${textMuted} mb-3`}>This decision assumes the following:</p>
      <ol className="space-y-3" aria-label="Decision assumptions">
        {assumptions.map((assumption, index) => (
          <li key={assumption.id} className="flex items-start">
            <span
              className="text-gray-400 mr-2 mt-0.5 font-mono text-sm shrink-0 w-6"
              aria-hidden="true"
            >
              {index + 1}.
            </span>
            <span className={listText}>{assumption.text}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
