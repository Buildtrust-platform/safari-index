'use client';

/**
 * Preflight Wizard Component
 *
 * INTERNAL: Staging-only collapsible panel for testing decision inputs.
 * Appears ABOVE the evaluation trigger area on /decisions/[slug].
 *
 * Classification: INTERNAL (gated forever)
 * Reason: Developer testing tool, not user-facing functionality.
 *
 * Gate: isBuildMode() - renders nothing in production.
 *
 * Features:
 * - Uses topic.required_inputs as checklist
 * - Pre-fills with example as placeholder (not default)
 * - Two neutral buttons: "Use these inputs" / "Skip"
 * - Stores inputs in sessionStorage only
 */

import { useState, useEffect, useCallback } from 'react';
import { isBuildMode } from '../../lib/app-mode';
import type { DecisionTopic, TopicInput } from '../content/decision-topics';
import {
  type PreflightInputs,
  getInputType,
  getSelectOptions,
  savePreflightInputs,
  loadPreflightInputs,
  validateInputs,
} from '../../lib/preflight-inputs';
import {
  card,
  buttonPrimary,
  buttonSecondary,
  input as inputStyle,
  textMuted,
} from '../ui/styles';

interface PreflightWizardProps {
  topic: DecisionTopic;
  onUseInputs: (inputs: PreflightInputs) => void;
  onSkip: () => void;
}

/**
 * Input field component for the wizard
 */
function WizardInputField({
  inputSpec,
  value,
  onChange,
}: {
  inputSpec: TopicInput;
  value: string;
  onChange: (value: string) => void;
}) {
  const type = getInputType(inputSpec.key);
  const options = getSelectOptions(inputSpec.key);
  // Create a stable ID from the key
  const inputId = `preflight-${inputSpec.key.replace(/\./g, '-')}`;

  if (type === 'select' && options.length > 0) {
    return (
      <div className="mb-3">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {inputSpec.label}
        </label>
        <select
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputStyle} w-full`}
        >
          <option value="">Select... (e.g., {inputSpec.example})</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="mb-3">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {inputSpec.label}
      </label>
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={inputSpec.example}
        className={`${inputStyle} w-full`}
      />
    </div>
  );
}

export function PreflightWizard({
  topic,
  onUseInputs,
  onSkip,
}: PreflightWizardProps) {
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [inputs, setInputs] = useState<PreflightInputs>({});
  const [validationError, setValidationError] = useState<string | null>(null);

  const isAllowed = isBuildMode();

  // Mount check for hydration safety
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load saved inputs from sessionStorage
  useEffect(() => {
    if (!mounted || !isAllowed) return;

    const saved = loadPreflightInputs(topic.topic_id);
    if (saved) {
      setInputs(saved);
    }
  }, [mounted, isAllowed, topic.topic_id]);

  // Update a single input
  const handleInputChange = useCallback(
    (key: string, value: string) => {
      setInputs((prev) => {
        const next = { ...prev, [key]: value };
        savePreflightInputs(topic.topic_id, next);
        return next;
      });
      setValidationError(null);
    },
    [topic.topic_id]
  );

  // Handle "Use these inputs"
  const handleUseInputs = useCallback(() => {
    const requiredInputs = topic.required_inputs || [];
    const validation = validateInputs(inputs, requiredInputs);

    if (!validation.valid) {
      setValidationError(`Missing: ${validation.missing.join(', ')}`);
      return;
    }

    onUseInputs(inputs);
  }, [inputs, topic.required_inputs, onUseInputs]);

  // Handle "Skip"
  const handleSkip = useCallback(() => {
    onSkip();
  }, [onSkip]);

  // Don't render in production or before mount
  if (!mounted || !isAllowed) {
    return null;
  }

  const requiredInputs = topic.required_inputs || [];
  const optionalInputs = topic.optional_inputs || [];

  // No inputs defined, render nothing
  if (requiredInputs.length === 0 && optionalInputs.length === 0) {
    return null;
  }

  return (
    <div className="mb-6" data-testid="preflight-wizard">
      {/* Collapsible header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg text-left hover:bg-blue-100 transition-colors"
        aria-expanded={expanded}
        aria-controls="preflight-wizard-content"
      >
        <span className="text-sm font-medium text-blue-800">
          Answer quality check
        </span>
        <span className="text-blue-600 text-sm">
          {expanded ? '▲ Collapse' : '▼ Expand'}
        </span>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div
          id="preflight-wizard-content"
          className={`${card} mt-2 border-blue-200`}
        >
          <p className={`${textMuted} mb-4`}>
            Test the decision with specific inputs. Leave empty to use defaults.
          </p>

          {/* Required inputs */}
          {requiredInputs.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Required inputs
              </h4>
              {requiredInputs.map((input) => (
                <WizardInputField
                  key={input.key}
                  inputSpec={input}
                  value={inputs[input.key] || ''}
                  onChange={(value) => handleInputChange(input.key, value)}
                />
              ))}
            </div>
          )}

          {/* Optional inputs */}
          {optionalInputs.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Optional inputs
              </h4>
              {optionalInputs.map((input) => (
                <WizardInputField
                  key={input.key}
                  inputSpec={input}
                  value={inputs[input.key] || ''}
                  onChange={(value) => handleInputChange(input.key, value)}
                />
              ))}
            </div>
          )}

          {/* Validation error */}
          {validationError && (
            <p className="text-sm text-red-600 mb-3">{validationError}</p>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleUseInputs}
              className={buttonPrimary}
              data-testid="preflight-use-inputs"
            >
              Use these inputs
            </button>
            <button
              onClick={handleSkip}
              className={buttonSecondary}
              data-testid="preflight-skip"
            >
              Skip
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
