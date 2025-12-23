/**
 * Refusal Recovery Panel
 *
 * Staging-only component that appears below refusal messages.
 * Shows missing inputs needed to get a decision.
 *
 * Gated by isBuildMode() - does not render in production.
 */

'use client';

import { useState } from 'react';
import { isBuildMode } from '../../lib/app-mode';
import {
  getMissingInputs,
  buildExampleSnippet,
  type MissingInput,
} from '../../lib/refusal-recovery';
import type { DecisionTopic } from '../content/decision-topics';
import {
  section,
  sectionHeading,
  cardCompact,
  buttonSecondary,
  textMuted,
} from '../ui/styles';

interface RefusalRecoveryPanelProps {
  /** The refusal reason from the API */
  refusalReason?: string;
  /** The topic for this decision */
  topic: DecisionTopic;
}

/**
 * Single missing input row
 */
function MissingInputRow({ input }: { input: MissingInput }) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0">
      <div>
        <p className="text-sm font-medium text-gray-700">{input.label}</p>
        <p className="text-xs text-gray-500 font-mono">{input.key}</p>
      </div>
      <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
        {input.example}
      </code>
    </div>
  );
}

export function RefusalRecoveryPanel({
  refusalReason,
  topic,
}: RefusalRecoveryPanelProps) {
  const [copied, setCopied] = useState(false);

  // Gate: only render in build mode (staging)
  if (!isBuildMode()) {
    return null;
  }

  // Get missing inputs based on reason or topic fallback
  const missingInputs = getMissingInputs(refusalReason, topic);

  // Limit to 3-7 items as per requirements
  const displayInputs = missingInputs.slice(0, 7);

  if (displayInputs.length < 3) {
    // Pad with common inputs if we have fewer than 3
    const common = getMissingInputs(undefined, topic);
    while (displayInputs.length < 3 && common.length > displayInputs.length) {
      const next = common[displayInputs.length];
      if (!displayInputs.find((i) => i.key === next.key)) {
        displayInputs.push(next);
      }
    }
  }

  /**
   * Copy example JSON to clipboard
   */
  const handleCopy = async () => {
    const snippet = buildExampleSnippet(displayInputs);
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = snippet;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section
      className={section}
      aria-labelledby="recovery-heading"
      data-testid="refusal-recovery-panel"
    >
      <h2 id="recovery-heading" className={sectionHeading}>
        To answer this, we're missing
      </h2>

      <div className={cardCompact}>
        <div className="space-y-0">
          {displayInputs.map((input) => (
            <MissingInputRow key={input.key} input={input} />
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
          <p className={textMuted}>
            {displayInputs.length} input{displayInputs.length !== 1 ? 's' : ''} needed
          </p>
          <button
            onClick={handleCopy}
            className={buttonSecondary}
            aria-label="Copy example inputs as JSON"
          >
            {copied ? 'Copied' : 'Copy example inputs'}
          </button>
        </div>
      </div>

      <p className={`${textMuted} mt-2`}>
        DEV: Panel visible in staging only.
      </p>
    </section>
  );
}
