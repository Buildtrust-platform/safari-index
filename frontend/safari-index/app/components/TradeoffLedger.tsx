/**
 * Trade-off Ledger Component
 *
 * Per 13_frontend_templates.md Section 1B:
 * - Purpose: show reality plainly
 * - Contains: Gains list (2-5 bullets), Losses list (2-5 bullets)
 * - No softening language
 * - No "but don't worry" phrasing
 *
 * Per 02_decision_doctrine.md:
 * - Every choice creates real trade-offs
 * - Trade-offs must be named explicitly
 */

import { section, sectionHeading, listContainer, listItem, listText } from '../ui/styles';

interface TradeoffLedgerProps {
  gains: string[];
  losses: string[];
}

export function TradeoffLedger({ gains, losses }: TradeoffLedgerProps) {
  return (
    <section className={section} aria-labelledby="tradeoffs-heading">
      <h2 id="tradeoffs-heading" className={sectionHeading}>Trade-offs</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-ui text-sm font-medium text-outcome-book mb-3 uppercase tracking-wide">
            Gains
          </h3>
          <ul className={listContainer} aria-label="Gains from this decision">
            {gains.map((gain, i) => (
              <li key={i} className={listItem}>
                <span className="text-outcome-book mr-2 mt-0.5 shrink-0" aria-hidden="true">+</span>
                <span className={listText}>{gain}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-ui text-sm font-medium text-outcome-discard mb-3 uppercase tracking-wide">
            Losses
          </h3>
          <ul className={listContainer} aria-label="Losses from this decision">
            {losses.map((loss, i) => (
              <li key={i} className={listItem}>
                <span className="text-outcome-discard mr-2 mt-0.5 shrink-0" aria-hidden="true">−</span>
                <span className={listText}>{loss}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
