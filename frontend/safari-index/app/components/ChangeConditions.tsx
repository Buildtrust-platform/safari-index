/**
 * Change Conditions Component
 *
 * Per 13_frontend_templates.md Section 1E:
 * - Purpose: tell users what would change the verdict
 * - Contains: 2-4 "This changes if..." bullets
 *
 * Per 02_decision_doctrine.md:
 * - Decisions are not permanent; they expire under conditions
 * - Change conditions must be explicit
 */

import { section, sectionHeading, listContainer, listItem, listText } from '../ui/styles';

interface ChangeConditionsProps {
  conditions: string[];
}

export function ChangeConditions({ conditions }: ChangeConditionsProps) {
  return (
    <section className={section} aria-labelledby="conditions-heading">
      <h2 id="conditions-heading" className={sectionHeading}>This changes if</h2>
      <ul className={listContainer} aria-label="Conditions that would change this decision">
        {conditions.map((condition, i) => (
          <li key={i} className={listItem}>
            <span className="text-amber-600 mr-2 mt-0.5 shrink-0" aria-hidden="true">&bull;</span>
            <span className={listText}>{condition}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
