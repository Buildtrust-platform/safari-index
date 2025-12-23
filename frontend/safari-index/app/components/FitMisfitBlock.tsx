/**
 * Fit / Misfit Block Component
 *
 * Per 13_frontend_templates.md Section 1C:
 * - Purpose: stop wrong-fit conversions early
 * - Contains: "Right for" bullets, "Not ideal for" bullets
 *
 * Per 02_decision_doctrine.md:
 * - Some travelers should not book; that is a feature
 * - Misfit identification prevents regret
 */

import { section, sectionHeading, listContainer, listItem, listBullet, listText } from '../ui/styles';

interface FitMisfitBlockProps {
  rightFor: string[];
  notIdealFor: string[];
}

export function FitMisfitBlock({ rightFor, notIdealFor }: FitMisfitBlockProps) {
  return (
    <section className={section} aria-labelledby="fit-heading">
      <h2 id="fit-heading" className={sectionHeading}>Fit assessment</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Right for</h3>
          <ul className={listContainer} aria-label="This decision is right for">
            {rightFor.map((item, i) => (
              <li key={i} className={listItem}>
                <span className={listBullet} aria-hidden="true">&bull;</span>
                <span className={listText}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Not ideal for</h3>
          <ul className={listContainer} aria-label="This decision is not ideal for">
            {notIdealFor.map((item, i) => (
              <li key={i} className={listItem}>
                <span className={listBullet} aria-hidden="true">&bull;</span>
                <span className={listText}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
