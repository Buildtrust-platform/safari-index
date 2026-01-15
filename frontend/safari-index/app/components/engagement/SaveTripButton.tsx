/**
 * Save Trip Button Component
 *
 * Lower-commitment engagement for users who aren't ready to inquire.
 * Options:
 * - Save to browser (localStorage)
 * - Email trip details to themselves
 * - Share trip link
 *
 * Per governance: documentary, calm tone. No pushy CTAs.
 */

'use client';

import { useState, useEffect } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  Mail,
  Share2,
  Link2,
  Check,
  X,
} from 'lucide-react';
import { cn } from '../../ui/utils';

interface SaveTripButtonProps {
  tripId: string;
  tripTitle: string;
  tripUrl?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'icon-only';
}

const SAVED_TRIPS_KEY = 'vurara_saved_trips';

/**
 * Get saved trips from localStorage
 */
function getSavedTrips(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(SAVED_TRIPS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

/**
 * Save trip to localStorage
 */
function saveTrip(tripId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const saved = getSavedTrips();
    if (!saved.includes(tripId)) {
      saved.push(tripId);
      localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(saved));
    }
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

/**
 * Remove trip from localStorage
 */
function unsaveTrip(tripId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const saved = getSavedTrips().filter((id) => id !== tripId);
    localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(saved));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

export function SaveTripButton({
  tripId,
  tripTitle,
  tripUrl,
  className = '',
  variant = 'default',
}: SaveTripButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [copied, setCopied] = useState(false);

  // Check if trip is already saved
  useEffect(() => {
    const saved = getSavedTrips();
    setIsSaved(saved.includes(tripId));
  }, [tripId]);

  const handleSave = () => {
    if (isSaved) {
      unsaveTrip(tripId);
      setIsSaved(false);
    } else {
      saveTrip(tripId);
      setIsSaved(true);
    }
  };

  const handleCopyLink = async () => {
    const url = tripUrl || (typeof window !== 'undefined' ? window.location.href : '');
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    const url = tripUrl || (typeof window !== 'undefined' ? window.location.href : '');
    if (navigator.share) {
      try {
        await navigator.share({
          title: tripTitle,
          text: `Check out this safari: ${tripTitle}`,
          url: url,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitStatus('success');
      setEmail('');
      setTimeout(() => {
        setShowEmailForm(false);
        setSubmitStatus('idle');
      }, 2000);
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Icon-only variant
  if (variant === 'icon-only') {
    return (
      <button
        onClick={handleSave}
        className={cn(
          'p-2 rounded-lg transition-colors',
          isSaved
            ? 'bg-amber-100 text-amber-700'
            : 'bg-stone-100 text-stone-500 hover:bg-stone-200',
          className
        )}
        aria-label={isSaved ? 'Unsave trip' : 'Save trip'}
      >
        {isSaved ? (
          <BookmarkCheck className="w-5 h-5" />
        ) : (
          <Bookmark className="w-5 h-5" />
        )}
      </button>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={cn('inline-flex items-center gap-2', className)}>
        <button
          onClick={handleSave}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors',
            isSaved
              ? 'bg-amber-100 text-amber-700 border border-amber-200'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border border-stone-200'
          )}
        >
          {isSaved ? (
            <>
              <BookmarkCheck className="w-4 h-4" />
              Saved
            </>
          ) : (
            <>
              <Bookmark className="w-4 h-4" />
              Save
            </>
          )}
        </button>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-stone-100 text-stone-600 hover:bg-stone-200 border border-stone-200 rounded-lg transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>
    );
  }

  // Default full variant with dropdown
  return (
    <div className={cn('relative', className)}>
      {/* Main button group */}
      <div className="inline-flex items-center rounded-lg border border-stone-200 overflow-hidden">
        <button
          onClick={handleSave}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2.5 transition-colors',
            isSaved
              ? 'bg-amber-50 text-amber-700'
              : 'bg-white text-stone-700 hover:bg-stone-50'
          )}
        >
          {isSaved ? (
            <>
              <BookmarkCheck className="w-4 h-4" />
              <span className="text-sm font-medium">Saved</span>
            </>
          ) : (
            <>
              <Bookmark className="w-4 h-4" />
              <span className="text-sm font-medium">Save trip</span>
            </>
          )}
        </button>
        <div className="w-px bg-stone-200 self-stretch" />
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="px-3 py-2.5 bg-white text-stone-500 hover:bg-stone-50 transition-colors"
          aria-label="More options"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Dropdown menu */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setShowMenu(false);
              setShowEmailForm(false);
            }}
          />
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-stone-200 shadow-lg z-20 overflow-hidden">
            {!showEmailForm ? (
              <>
                <button
                  onClick={() => setShowEmailForm(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <Mail className="w-4 h-4 text-stone-400" />
                  <div>
                    <p className="text-sm font-medium">Email to myself</p>
                    <p className="text-xs text-stone-500">Get trip details in your inbox</p>
                  </div>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-stone-700 hover:bg-stone-50 transition-colors border-t border-stone-100"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Link2 className="w-4 h-4 text-stone-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {copied ? 'Link copied' : 'Copy link'}
                    </p>
                    <p className="text-xs text-stone-500">Share with others</p>
                  </div>
                </button>
                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-stone-700 hover:bg-stone-50 transition-colors border-t border-stone-100"
                  >
                    <Share2 className="w-4 h-4 text-stone-400" />
                    <div>
                      <p className="text-sm font-medium">Share</p>
                      <p className="text-xs text-stone-500">Via other apps</p>
                    </div>
                  </button>
                )}
              </>
            ) : (
              <form onSubmit={handleEmailSubmit} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-stone-900">Email trip details</p>
                  <button
                    type="button"
                    onClick={() => setShowEmailForm(false)}
                    className="p-1 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {submitStatus === 'success' ? (
                  <div className="flex items-center gap-2 text-green-600 py-2">
                    <Check className="w-4 h-4" />
                    <span className="text-sm">Sent to your inbox</span>
                  </div>
                ) : (
                  <>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 mb-3"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting || !email}
                      className={cn(
                        'w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                        isSubmitting || !email
                          ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                          : 'bg-amber-500 text-white hover:bg-amber-600'
                      )}
                    >
                      {isSubmitting ? 'Sending...' : 'Send'}
                    </button>
                    {submitStatus === 'error' && (
                      <p className="text-xs text-red-500 mt-2">
                        Failed to send. Please try again.
                      </p>
                    )}
                  </>
                )}
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default SaveTripButton;
