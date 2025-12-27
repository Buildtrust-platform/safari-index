/**
 * Newsletter Signup Component - "Field Notes from Safari Index"
 *
 * Client component for newsletter subscription with authority-first positioning.
 * Posts to /api/newsletter and handles success/error states.
 *
 * Per spec:
 * - Heading: 'Field Notes from Safari Index'
 * - Description: Seasonal insights, destination updates, planning frameworks
 * - Frequency: Monthly at most (explicitly stated)
 * - Privacy: No spam, no deals, unsubscribe anytime
 * - Success states: 'Subscribed', 'Already subscribed', 'Welcome back'
 * - Error state for invalid email only
 * - Documentary tone throughout
 */

'use client';

import { useState } from 'react';
import { Compass, Check, AlertCircle } from 'lucide-react';

type SubscribeStatus = 'idle' | 'loading' | 'subscribed' | 'already_subscribed' | 'resubscribed' | 'error';

interface NewsletterSignupProps {
  source?: string;
}

export function NewsletterSignup({ source = 'homepage' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SubscribeStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus('error');
        setErrorMessage(data.error || 'Unable to subscribe. Please try again.');
        return;
      }

      // Map API response status to component status
      if (data.status === 'subscribed') {
        setStatus('subscribed');
      } else if (data.status === 'already_subscribed') {
        setStatus('already_subscribed');
      } else if (data.status === 'resubscribed') {
        setStatus('resubscribed');
      } else {
        setStatus('subscribed');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Unable to subscribe. Please try again.');
    }
  };

  // Success state
  if (status === 'subscribed' || status === 'already_subscribed' || status === 'resubscribed') {
    const message = status === 'already_subscribed'
      ? 'Already subscribed'
      : status === 'resubscribed'
      ? 'Welcome back'
      : 'Subscribed';

    return (
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-800 text-stone-300">
          <Check className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium">{message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Compass className="w-5 h-5 text-amber-500" />
        <h3 className="font-editorial text-xl font-semibold text-white">
          Field Notes from Safari Index
        </h3>
      </div>
      <p className="text-sm text-stone-300 mb-2 max-w-md mx-auto leading-relaxed">
        Occasional dispatches on safari planning: seasonal insights, destination updates, and planning frameworks.
      </p>
      <p className="text-xs text-stone-500 mb-6">
        No deals, no spam. Published monthly at most.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === 'error') {
              setStatus('idle');
              setErrorMessage('');
            }
          }}
          placeholder="your@email.com"
          className="flex-1 px-4 py-2.5 rounded-lg bg-stone-800 border border-stone-700 text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 text-sm"
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-5 py-2.5 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>

      {status === 'error' && errorMessage && (
        <div className="flex items-center justify-center gap-2 mt-3 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      <p className="text-xs text-stone-600 mt-4">
        Your email stays with us. Unsubscribe anytime.
      </p>
    </div>
  );
}
