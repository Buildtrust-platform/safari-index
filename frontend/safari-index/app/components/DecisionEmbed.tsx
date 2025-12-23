/**
 * Decision Embed Component
 *
 * Per task requirements:
 * - Minimal, read-only decision display
 * - Question, verdict, answer block, confidence, attribution only
 * - NO CTAs, ads, pricing, navigation, external links
 * - Neutral styling for light/dark backgrounds
 * - Always links to canonical source
 *
 * This component is the authority artifact. It cannot be modified by host sites.
 */

interface DecisionEmbedProps {
  question: string;
  outcome: 'book' | 'wait' | 'switch' | 'discard';
  headline: string;
  quotableVerdict: string;
  confidence: number;
  answerVersion: string;
  logicVersion: string;
  issuedAt: string;
  canonicalUrl: string;
  decisionId: string;
  // If true, embed shows warning instead of decision
  isFlaggedForReview?: boolean;
}

function getConfidenceLabel(score: number): string {
  if (score >= 0.7) return 'High';
  if (score >= 0.5) return 'Medium';
  return 'Low';
}

function getOutcomeLabel(outcome: string): string {
  const labels: Record<string, string> = {
    book: 'Proceed',
    wait: 'Wait',
    switch: 'Consider alternatives',
    discard: 'Not recommended',
  };
  return labels[outcome] || outcome;
}

export function DecisionEmbed({
  question,
  outcome,
  headline,
  quotableVerdict,
  confidence,
  answerVersion,
  logicVersion,
  issuedAt,
  canonicalUrl,
  decisionId,
  isFlaggedForReview = false,
}: DecisionEmbedProps) {
  const confidenceLabel = getConfidenceLabel(confidence);
  const formattedDate = new Date(issuedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Flagged decisions must not display content
  // Per governance: decisions under review cannot be distributed
  if (isFlaggedForReview) {
    return (
      <article
        className="safari-index-embed safari-index-embed--warning"
        role="alert"
        aria-label="Decision under review"
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          maxWidth: '600px',
          padding: '24px',
          border: '1px solid #e5a846',
          borderRadius: '8px',
          backgroundColor: '#fffbeb',
          color: '#92400e',
        }}
      >
        <p style={{ margin: 0, fontSize: '14px' }}>
          This decision is currently under review and cannot be displayed.
        </p>
        <a
          href={canonicalUrl}
          style={{
            display: 'inline-block',
            marginTop: '12px',
            fontSize: '12px',
            color: '#92400e',
            textDecoration: 'underline',
          }}
          target="_blank"
          rel="noopener noreferrer"
        >
          View status at Safari Index
        </a>
      </article>
    );
  }

  return (
    <article
      className="safari-index-embed"
      aria-labelledby="embed-question"
      style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        maxWidth: '600px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        color: '#111827',
      }}
    >
      {/* Question */}
      <h2
        id="embed-question"
        style={{
          margin: '0 0 16px 0',
          fontSize: '18px',
          fontWeight: 600,
          lineHeight: 1.3,
        }}
      >
        {question}
      </h2>

      {/* Verdict Badge */}
      <div
        role="status"
        aria-label={`Decision outcome: ${getOutcomeLabel(outcome)}`}
        style={{
          display: 'inline-block',
          padding: '4px 12px',
          marginBottom: '16px',
          fontSize: '14px',
          fontWeight: 500,
          borderRadius: '4px',
          backgroundColor:
            outcome === 'book'
              ? '#dcfce7'
              : outcome === 'wait'
                ? '#fef3c7'
                : outcome === 'switch'
                  ? '#dbeafe'
                  : '#fee2e2',
          color:
            outcome === 'book'
              ? '#166534'
              : outcome === 'wait'
                ? '#92400e'
                : outcome === 'switch'
                  ? '#1e40af'
                  : '#991b1b',
        }}
      >
        {getOutcomeLabel(outcome)}
      </div>

      {/* Headline */}
      <p
        style={{
          margin: '0 0 12px 0',
          fontSize: '16px',
          fontWeight: 500,
          color: '#374151',
        }}
      >
        {headline}
      </p>

      {/* Quotable Verdict (Answer Ownership Block) */}
      <blockquote
        style={{
          padding: '12px 16px',
          marginBottom: '16px',
          marginLeft: 0,
          marginRight: 0,
          borderLeft: '3px solid #111827',
          backgroundColor: '#f9fafb',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '14px',
            lineHeight: 1.6,
            color: '#374151',
          }}
        >
          {quotableVerdict}
        </p>
      </blockquote>

      {/* Confidence */}
      <p
        aria-label={`Confidence: ${confidenceLabel}`}
        style={{
          margin: '0 0 16px 0',
          fontSize: '13px',
          color: '#6b7280',
        }}
      >
        Confidence: {confidenceLabel} ({Math.round(confidence * 100)}%)
      </p>

      {/* Attribution Footer - required, non-removable */}
      <footer
        aria-label="Decision attribution"
        style={{
          paddingTop: '12px',
          borderTop: '1px solid #e5e7eb',
          fontSize: '12px',
          color: '#9ca3af',
        }}
      >
        <p style={{ margin: '0 0 4px 0' }}>Decision issued by Safari Index</p>
        <p style={{ margin: '0 0 8px 0' }}>
          Logic: {logicVersion} · Answer: {answerVersion} ·{' '}
          <time dateTime={issuedAt}>{formattedDate}</time>
        </p>
        <a
          href={canonicalUrl}
          style={{
            color: '#6b7280',
            textDecoration: 'underline',
            fontSize: '11px',
          }}
          target="_blank"
          rel="noopener noreferrer"
        >
          View full decision at Safari Index
        </a>
      </footer>

      {/* Hidden metadata for integrity verification */}
      <div
        data-safari-index-decision-id={decisionId}
        style={{ display: 'none' }}
        aria-hidden="true"
      />
    </article>
  );
}
