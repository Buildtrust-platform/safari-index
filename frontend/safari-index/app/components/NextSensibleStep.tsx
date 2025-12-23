/**
 * Next Sensible Step Component
 *
 * Per task requirements:
 * - Based on intent signals, suggest ONE calm next step
 * - Never suggest booking, buying, or urgency
 * - Render as informational, not promotional
 *
 * This component helps users think, not act impulsively.
 */

'use client';

import { useEffect } from 'react';
import {
  IntentSignal,
  detectIntentSignal,
  recordDecisionView,
} from '../lib/intent-signals';
import { section, cardCompact, link } from '../ui/styles';

interface NextSensibleStepProps {
  decisionId: string;
  topicId: string;
  outcome: 'book' | 'wait' | 'switch' | 'discard';
  hasRelatedDecisions: boolean;
  assumptions: Array<{ id: string; text: string; confidence: number }>;
}

interface SensibleStep {
  text: string;
  href: string | null;
  isAction: boolean;
}

/**
 * Determine the next sensible step based on intent signal
 * Each suggestion is calm and informational
 */
function getSensibleStep(
  signal: IntentSignal,
  props: NextSensibleStepProps
): SensibleStep | null {
  const { outcome, hasRelatedDecisions, assumptions, topicId } = props;

  // Users who purchased assurance are committed - no further suggestions needed
  if (signal === 'PURCHASED_ASSURANCE') {
    return null;
  }

  // Users who embedded are distributing - suggest nothing
  if (signal === 'EMBEDDED_DECISION') {
    return null;
  }

  // Returning visitors may benefit from comparison
  if (signal === 'RETURNING_VISIT' && hasRelatedDecisions) {
    return {
      text: 'You may find it useful to compare this with related decisions.',
      href: null, // RelatedDecisions component handles this
      isAction: false,
    };
  }

  // Users exploring related decisions may want to refine
  if (signal === 'VIEWED_RELATED') {
    return {
      text: 'If your constraints have changed, the outcome may differ.',
      href: `/tools/safari-fit?topic=${topicId}`,
      isAction: false,
    };
  }

  // Default suggestions based on outcome (only if no strong signal)
  if (signal === 'NONE') {
    // Low-confidence assumptions warrant attention
    const lowConfidenceAssumption = assumptions.find((a) => a.confidence < 0.6);
    if (lowConfidenceAssumption) {
      return {
        text: `This decision assumes: "${lowConfidenceAssumption.text.substring(0, 60)}..." — verify this applies to your situation.`,
        href: null,
        isAction: false,
      };
    }

    // Wait outcomes suggest checking back
    if (outcome === 'wait') {
      return {
        text: 'Conditions may change. You can subscribe to updates below.',
        href: null,
        isAction: false,
      };
    }

    // Switch outcomes suggest alternatives
    if (outcome === 'switch' && hasRelatedDecisions) {
      return {
        text: 'Alternative options are listed below for comparison.',
        href: null,
        isAction: false,
      };
    }
  }

  return null;
}

export function NextSensibleStep(props: NextSensibleStepProps) {
  const { decisionId } = props;

  // Record view as side effect (session-scoped)
  useEffect(() => {
    recordDecisionView(decisionId);
  }, [decisionId]);

  // Compute step synchronously - no need for state since it's derived from props
  const signal = detectIntentSignal(decisionId);
  const step = getSensibleStep(signal, props);

  // No suggestion needed
  if (!step) {
    return null;
  }

  return (
    <section className={`${section} ${cardCompact}`} aria-label="Suggested next step">
      <p className="text-sm text-gray-700 leading-relaxed">{step.text}</p>
      {step.href && (
        <a href={step.href} className={`inline-block mt-2 text-sm ${link}`}>
          Refine your inputs
        </a>
      )}
    </section>
  );
}
