/**
 * Input Readiness Panel
 *
 * Staging-only component showing what inputs are needed for a decision.
 * Displays required and optional inputs with copy functionality.
 * Does NOT render in observation mode.
 *
 * Per task requirements:
 * - Shows "To answer this well, we need" with 6-10 bullet inputs
 * - Topic-specific inputs from decision-topics.ts
 * - Copy example inputs button
 * - Dev-only collapsible textarea with JSON snippet
 */

'use client';

import { useState } from 'react';
import { isBuildMode } from '../../lib/app-mode';
import type { DecisionTopic, TopicInput } from '../content/decision-topics';
import {
  section,
  sectionHeading,
  listContainer,
  listItem,
  listBullet,
  listText,
  buttonSecondary,
  textMuted,
} from '../ui/styles';

interface InputReadinessPanelProps {
  topic: DecisionTopic;
}

/**
 * Build example JSON snippet from topic inputs
 */
function buildExampleJson(topic: DecisionTopic): string {
  const example: Record<string, unknown> = {
    task: 'DECISION',
    tracking: {
      session_id: `sess_example_${topic.topic_id}`,
    },
    user_context: {},
    request: {
      question: topic.question,
      destinations_considered: topic.destinations,
      constraints: {},
    },
  };

  // Map inputs to example structure
  const allInputs = [...(topic.required_inputs || []), ...(topic.optional_inputs || [])];

  for (const input of allInputs) {
    const parts = input.key.split('.');
    let current: Record<string, unknown> = example;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part] as Record<string, unknown>;
    }

    const lastPart = parts[parts.length - 1];
    // Parse example value if it looks like JSON
    try {
      current[lastPart] = JSON.parse(input.example);
    } catch {
      current[lastPart] = input.example;
    }
  }

  return JSON.stringify(example, null, 2);
}

/**
 * Input item component
 */
function InputItem({ input, isRequired }: { input: TopicInput; isRequired: boolean }) {
  return (
    <li className={listItem}>
      <span className={listBullet} aria-hidden="true">&bull;</span>
      <span className={listText}>
        <span className="font-medium">{input.label}</span>
        {!isRequired && <span className="text-gray-400 ml-1">(optional)</span>}
        <span className="text-gray-400 ml-2">e.g. {input.example}</span>
      </span>
    </li>
  );
}

export function InputReadinessPanel({ topic }: InputReadinessPanelProps) {
  // Gate: do not render in observation mode
  if (!isBuildMode()) {
    return null;
  }

  const [showJson, setShowJson] = useState(false);
  const [copied, setCopied] = useState(false);

  const requiredInputs = topic.required_inputs || [];
  const optionalInputs = topic.optional_inputs || [];
  const hasInputs = requiredInputs.length > 0 || optionalInputs.length > 0;

  if (!hasInputs) {
    return null;
  }

  const exampleJson = buildExampleJson(topic);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exampleJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      console.log('Copy failed, JSON:', exampleJson);
    }
  };

  return (
    <section
      className={`${section} p-4 bg-blue-50 border border-blue-200 rounded-lg`}
      aria-labelledby="readiness-heading"
    >
      <h2 id="readiness-heading" className={`${sectionHeading} text-blue-900`}>
        To answer this well, we need
      </h2>

      {/* Required inputs */}
      {requiredInputs.length > 0 && (
        <ul className={listContainer} aria-label="Required inputs">
          {requiredInputs.map((input, i) => (
            <InputItem key={i} input={input} isRequired={true} />
          ))}
        </ul>
      )}

      {/* Optional inputs */}
      {optionalInputs.length > 0 && (
        <ul className={`${listContainer} mt-3`} aria-label="Optional inputs">
          {optionalInputs.map((input, i) => (
            <InputItem key={i} input={input} isRequired={false} />
          ))}
        </ul>
      )}

      {/* Actions */}
      <div className="mt-4 flex gap-3 items-center">
        <button
          onClick={handleCopy}
          className={buttonSecondary}
          aria-label="Copy example inputs as JSON"
        >
          {copied ? 'Copied' : 'Copy example inputs'}
        </button>

        {/* Dev-only toggle for JSON view */}
        {process.env.NODE_ENV !== 'production' && (
          <button
            onClick={() => setShowJson(!showJson)}
            className={`text-sm text-blue-700 underline hover:text-blue-900`}
          >
            {showJson ? 'Hide JSON' : 'Show JSON'}
          </button>
        )}
      </div>

      {/* Dev-only JSON textarea */}
      {showJson && process.env.NODE_ENV !== 'production' && (
        <div className="mt-4">
          <textarea
            readOnly
            value={exampleJson}
            className="w-full h-48 p-3 text-xs font-mono bg-gray-900 text-green-400 rounded border-0"
            aria-label="Example JSON input"
          />
          <p className={`${textMuted} mt-2`}>
            Staging only. Maps to StandardInputEnvelope structure.
          </p>
        </div>
      )}

      {/* Staging indicator */}
      <p className={`${textMuted} mt-4`}>
        Staging only. This panel is not visible in production.
      </p>
    </section>
  );
}
