'use client';

/**
 * Newsletter Signup Component
 *
 * Lower-commitment engagement for users not ready to inquire.
 * Collects email for safari planning tips and seasonal updates.
 *
 * Per governance: documentary, calm tone. No pushy language.
 */

import { useState } from 'react';
import { Mail, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { cn } from '../../ui/utils';

interface NewsletterSignupProps {
  variant?: 'inline' | 'card' | 'footer';
  className?: string;
}

export function NewsletterSignup({
  variant = 'card',
  className = '',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to subscribe');
      }

      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  // Inline variant - minimal, single line
  if (variant === 'inline') {
    return (
      <div className={cn('', className)}>
        {status === 'success' ? (
          <div className="flex items-center gap-2 text-green-600">
            <Check className="w-4 h-4" />
            <span className="text-sm">You're subscribed</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-4 py-2 text-sm font-medium bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 transition-colors"
            >
              {status === 'loading' ? '...' : 'Subscribe'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
        )}
      </div>
    );
  }

  // Footer variant - darker theme
  if (variant === 'footer') {
    return (
      <div className={cn('', className)}>
        <h4 className="text-white font-medium mb-2">Safari planning tips</h4>
        <p className="text-stone-400 text-sm mb-4">
          Monthly insights on timing, destinations, and wildlife.
        </p>
        {status === 'success' ? (
          <div className="flex items-center gap-2 text-green-400">
            <Check className="w-4 h-4" />
            <span className="text-sm">You're on the list</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-3 py-2 text-sm bg-stone-800 border border-stone-700 text-white placeholder-stone-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-4 py-2 text-sm font-medium bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 transition-colors"
            >
              {status === 'loading' ? '...' : 'Join'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-xs text-red-400 mt-2">{errorMessage}</p>
        )}
      </div>
    );
  }

  // Default card variant
  return (
    <div
      className={cn(
        'bg-gradient-to-br from-amber-50 to-stone-50 rounded-xl border border-amber-200/50 p-6',
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
          <Mail className="w-5 h-5 text-amber-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-stone-900 mb-1">
            Not ready to plan yet?
          </h3>
          <p className="text-sm text-stone-600 mb-4">
            Get monthly safari insights: best times to visit, migration updates, and destination guides.
          </p>

          {status === 'success' ? (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-lg">
              <Check className="w-5 h-5" />
              <span className="text-sm font-medium">You're subscribed. Check your inbox.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 transition-colors"
                >
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errorMessage}
                </div>
              )}
              <p className="text-xs text-stone-500">
                No spam. Unsubscribe anytime. We respect your inbox.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewsletterSignup;
