/**
 * Quality Gate Failure Component
 *
 * Per 02_decision_doctrine.md:
 * - Prefer refusal over weak decisions
 * - Be clear about why we refuse
 *
 * Rendered when a decision fails quality gates
 */

import {
  pageContainer,
  section,
  sectionHeading,
  listContainer,
  listItem,
  listText,
  buttonPrimary,
  footer as footerStyles,
} from '../ui/styles';

interface QualityGateFailureProps {
  topicQuestion: string;
  failures: string[];
  decisionId?: string;
}

export function QualityGateFailure({
  topicQuestion,
  failures,
  decisionId,
}: QualityGateFailureProps) {
  return (
    <main className={pageContainer}>
      <h1 className="text-2xl font-semibold mb-8">{topicQuestion}</h1>

      <article
        className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8"
        aria-labelledby="quality-failure-heading"
      >
        <div className="flex items-center mb-4">
          <span
            className="bg-amber-600 text-white px-3 py-1 rounded text-sm font-medium"
            role="status"
          >
            Quality Check Failed
          </span>
        </div>
        <h2
          id="quality-failure-heading"
          className="text-xl font-semibold text-gray-900 mb-3"
        >
          This decision does not meet publication standards
        </h2>
        <p className="text-gray-700 leading-relaxed">
          We cannot display this decision because it lacks the completeness required for
          responsible guidance. Incomplete decisions can mislead.
        </p>
      </article>

      <section className={section} aria-labelledby="missing-heading">
        <h2 id="missing-heading" className={sectionHeading}>What is missing</h2>
        <ul className={listContainer} aria-label="Missing requirements">
          {failures.map((failure, i) => (
            <li key={i} className={listItem}>
              <span className="text-amber-600 mr-2 shrink-0" aria-hidden="true">&bull;</span>
              <span className={listText}>{failure}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={section} aria-labelledby="action-heading">
        <h2 id="action-heading" className={sectionHeading}>What you can do</h2>
        <p className="text-gray-700">
          This topic may require more specific inputs to generate a complete decision.
          Try the personalized tool with your specific constraints.
        </p>
      </section>

      <section className="mt-12 pt-8 border-t border-gray-200">
        <a
          href="/tools/safari-fit"
          className={buttonPrimary}
        >
          Get a personalized recommendation
        </a>
      </section>

      {decisionId && (
        <footer className={footerStyles} aria-label="Reference information">
          <p>Reference: {decisionId}</p>
        </footer>
      )}
    </main>
  );
}
