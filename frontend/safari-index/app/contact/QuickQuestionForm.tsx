'use client';

/**
 * Quick Question Form
 *
 * Lightweight form for quick safari questions on the contact page.
 * Submits to /api/contact and shows success state.
 *
 * Per governance:
 * - Documentary tone
 * - Clear feedback
 * - No hype
 */

import { useState } from 'react';
import { Send, Check, AlertCircle } from 'lucide-react';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export function QuickQuestionForm() {
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const isValid = email.includes('@') && question.length >= 10;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || formState === 'submitting') return;

    setFormState('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          question,
          source_path: typeof window !== 'undefined' ? window.location.pathname : '/contact',
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Something went wrong');
      }

      setFormState('success');
    } catch (err) {
      setFormState('error');
      setErrorMessage(err instanceof Error ? err.message : 'Unable to send. Please try again.');
    }
  }

  // Success state
  if (formState === 'success') {
    return (
      <div className="text-center py-4">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
          <Check className="w-5 h-5 text-green-600" />
        </div>
        <p className="text-stone-900 font-medium mb-1">Question sent</p>
        <p className="text-stone-500 text-sm">We will reply to {email} within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 focus:border-amber-300 focus:ring-1 focus:ring-amber-300 outline-none transition-colors"
          required
        />
      </div>
      <div>
        <textarea
          placeholder="What would you like to know?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 focus:border-amber-300 focus:ring-1 focus:ring-amber-300 outline-none transition-colors resize-none"
          required
          minLength={10}
        />
        <p className="text-xs text-stone-400 mt-1">
          {question.length < 10 ? `${10 - question.length} more characters` : 'Ready to send'}
        </p>
      </div>

      {formState === 'error' && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!isValid || formState === 'submitting'}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors"
      >
        {formState === 'submitting' ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Question
          </>
        )}
      </button>
    </form>
  );
}
