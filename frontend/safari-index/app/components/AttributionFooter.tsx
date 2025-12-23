/**
 * Attribution Footer
 *
 * Per task requirements:
 * - "Decision issued by Safari Index"
 * - Logic version + date
 * - No branding slogans
 * - Non-promotional
 *
 * This footer exists for citation integrity, not marketing.
 */

import { footer as footerStyles } from '../ui/styles';

interface AttributionFooterProps {
  decisionId: string;
  logicVersion: string;
  answerVersion: string;
  issuedAt: string;
}

export function AttributionFooter({
  decisionId,
  logicVersion,
  answerVersion,
  issuedAt,
}: AttributionFooterProps) {
  const formattedDate = new Date(issuedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <footer className={footerStyles} aria-label="Decision attribution">
      <p>Decision issued by Safari Index</p>
      <p className="mt-1">
        <span aria-label="Logic version">Logic: {logicVersion}</span>
        <span aria-hidden="true"> &middot; </span>
        <span aria-label="Answer version">Answer: {answerVersion}</span>
        <span aria-hidden="true"> &middot; </span>
        <time dateTime={issuedAt} aria-label="Date issued">
          Issued: {formattedDate}
        </time>
      </p>
      <p className="mt-1 font-mono text-xs select-all" aria-label="Decision ID">
        {decisionId}
      </p>
    </footer>
  );
}
