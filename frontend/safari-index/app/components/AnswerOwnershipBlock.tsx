/**
 * Answer Ownership Block
 *
 * Per 14_seo_generation.md:
 * - Written for citation by Google featured snippets, AI assistants, journalists
 * - 40-70 words, quotable verdict summary
 * - Clear verdict with conditional logic ("because", "unless")
 * - No hype, no CTA
 *
 * This block exists to be quoted. It does not sell.
 */

import { section, textMuted } from '../ui/styles';

interface AnswerOwnershipBlockProps {
  question: string;
  outcome: 'book' | 'wait' | 'switch' | 'discard';
  headline: string;
  summary: string;
  confidence: number;
  primaryCondition: string;
  invalidatingCondition: string;
}

/**
 * Generate a quotable verdict statement (40-70 words)
 * Structured for snippet extraction and AI citation
 */
function generateQuotableVerdict(props: AnswerOwnershipBlockProps): string {
  const { outcome, headline, primaryCondition, invalidatingCondition } = props;

  const outcomeVerbs: Record<string, string> = {
    book: 'proceed with booking',
    wait: 'wait before booking',
    switch: 'consider alternatives',
    discard: 'not pursue this option',
  };

  const verb = outcomeVerbs[outcome] || 'evaluate carefully';

  // Construct verdict with conditional logic
  // Format: [Verdict] because [reason]. This changes if [condition].
  return `${headline}. Travelers should ${verb} because ${primaryCondition.toLowerCase()}. This recommendation changes if ${invalidatingCondition.toLowerCase()}.`;
}

export function AnswerOwnershipBlock(props: AnswerOwnershipBlockProps) {
  const quotableVerdict = generateQuotableVerdict(props);
  const confidenceLabel =
    props.confidence >= 0.7 ? 'High' : props.confidence >= 0.5 ? 'Medium' : 'Low';

  return (
    <blockquote
      className={`${section} border-l-4 border-gray-900 pl-4 py-2`}
      aria-label="Quotable verdict summary"
    >
      <p className="text-gray-900 leading-relaxed">{quotableVerdict}</p>
      <footer className={`${textMuted} mt-2`}>
        <span aria-label={`Confidence level: ${confidenceLabel}`}>
          Confidence: {confidenceLabel} ({Math.round(props.confidence * 100)}%)
        </span>
      </footer>
    </blockquote>
  );
}
