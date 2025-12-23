/**
 * Decision Follow-Up Component
 *
 * Per task requirements:
 * - Optional, opt-in
 * - One checkbox: "Notify me if this decision changes"
 * - Requires only email
 * - No marketing emails
 * - Trigger only on: logic version change, confidence drift, review outcome
 *
 * This is not a newsletter signup. This is a notification service.
 */

'use client';

import { useState, useId } from 'react';
import { section, cardCompact, successContainer, successText, buttonPrimary, input } from '../ui/styles';

interface DecisionFollowUpProps {
  decisionId: string;
  topicId: string;
  currentLogicVersion: string;
  currentConfidence: number;
}

type SubscriptionState = 'idle' | 'submitting' | 'success' | 'error';

export function DecisionFollowUp({
  decisionId,
  topicId,
  currentLogicVersion,
  currentConfidence,
}: DecisionFollowUpProps) {
  const [isOptedIn, setIsOptedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [state, setState] = useState<SubscriptionState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Unique IDs for accessibility
  const checkboxId = useId();
  const emailId = useId();
  const errorId = useId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      setState('error');
      return;
    }

    setState('submitting');

    try {
      const response = await fetch('/api/followup/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          decision_id: decisionId,
          topic_id: topicId,
          subscribed_at_logic_version: currentLogicVersion,
          subscribed_at_confidence: currentConfidence,
        }),
      });

      if (!response.ok) {
        throw new Error('Subscription failed');
      }

      setState('success');
    } catch {
      setErrorMessage('Could not subscribe. Please try again.');
      setState('error');
    }
  };

  // Success state - confirmation only
  if (state === 'success') {
    return (
      <section className={`${section} ${successContainer}`} role="status" aria-live="polite">
        <p className={successText}>
          You will be notified if this decision changes materially. No other
          emails will be sent.
        </p>
      </section>
    );
  }

  return (
    <section className={section} aria-labelledby={checkboxId}>
      <div className={cardCompact}>
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id={checkboxId}
            checked={isOptedIn}
            onChange={(e) => setIsOptedIn(e.target.checked)}
            className="mt-1 h-4 w-4 text-gray-900 border-gray-300 rounded"
            aria-describedby={`${checkboxId}-description`}
          />
          <label htmlFor={checkboxId} className="text-sm text-gray-700 cursor-pointer">
            Notify me if this decision changes
          </label>
        </div>

        <p id={`${checkboxId}-description`} className="mt-2 ml-7 text-xs text-gray-500">
          You will only be notified if the logic version changes, confidence
          shifts significantly, or this decision is reviewed. No marketing
          emails.
        </p>

        {isOptedIn && (
          <form onSubmit={handleSubmit} className="mt-4 ml-7" aria-label="Subscribe to decision updates">
            <div className="flex flex-col sm:flex-row gap-2">
              <label htmlFor={emailId} className="sr-only">Email address</label>
              <input
                type="email"
                id={emailId}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className={`flex-1 ${input}`}
                disabled={state === 'submitting'}
                aria-describedby={state === 'error' ? errorId : undefined}
                aria-invalid={state === 'error'}
              />
              <button
                type="submit"
                disabled={state === 'submitting'}
                className={buttonPrimary}
                aria-busy={state === 'submitting'}
              >
                {state === 'submitting' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>

            {state === 'error' && (
              <p id={errorId} className="mt-2 text-sm text-red-600" role="alert">
                {errorMessage}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
