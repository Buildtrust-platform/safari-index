/**
 * Decision Assurance CTA Component
 *
 * Per 02_decision_doctrine.md:
 * - Assurance is a paid artifact of professional judgment
 * - Must not promise certainty or guarantees
 *
 * Per Task Requirements:
 * - Calm, post-decision only
 * - No sales pressure
 * - Appears after user has seen the full decision
 */

interface AssuranceCTAProps {
  decisionId: string;
  outcome: 'book' | 'wait' | 'switch' | 'discard';
  confidence: number;
}

const ASSURANCE_PRICE_CENTS = 2900;
const ASSURANCE_CONFIDENCE_THRESHOLD = 0.5;

export function AssuranceCTA({ decisionId, outcome, confidence }: AssuranceCTAProps) {
  // Only show CTA if confidence meets threshold
  // Per governance: refuse rather than issue weak assurance
  if (confidence < ASSURANCE_CONFIDENCE_THRESHOLD) {
    return null;
  }

  // Don't offer assurance for refused decisions
  if (outcome === 'discard') {
    return null;
  }

  const priceFormatted = `$${(ASSURANCE_PRICE_CENTS / 100).toFixed(0)}`;

  return (
    <section className="mt-8 mb-8">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Keep this decision
        </h3>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          Get a permanent record of this decision with the reasoning, assumptions,
          and conditions that would change the recommendation. Useful for sharing
          with travel companions or revisiting later.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <a
            href={`/assurance/checkout?decision_id=${decisionId}`}
            className="inline-block bg-gray-900 text-white px-5 py-2.5 rounded text-center font-medium hover:bg-gray-800 transition-colors text-sm"
          >
            Get Decision Assurance - {priceFormatted}
          </a>

          <p className="text-gray-500 text-xs">
            One-time purchase. No subscription.
          </p>
        </div>

        <details className="mt-4">
          <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
            What is included
          </summary>
          <ul className="mt-2 text-sm text-gray-600 space-y-1 pl-4">
            <li>- Full decision with reasoning preserved</li>
            <li>- All assumptions made explicit</li>
            <li>- Trade-offs documented</li>
            <li>- Conditions that would change this decision</li>
            <li>- Shareable link (no login required)</li>
            <li>- PDF download option</li>
          </ul>
        </details>
      </div>
    </section>
  );
}
