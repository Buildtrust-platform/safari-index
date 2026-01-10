/**
 * Contact Page
 *
 * Streamlined contact page with quick question form and clear CTAs.
 * Two paths: quick question (handled here) or full trip planning (/inquire).
 *
 * Per governance:
 * - Documentary tone, no hype
 * - Clear contact methods
 * - Links to /inquire for safari planning
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import { Mail, ArrowRight, Phone, Send } from 'lucide-react';
import { Navbar, Footer, PageGrid } from '../components/layout';
import { QuickQuestionForm } from './QuickQuestionForm';

// Environment variables with fallbacks
const OPERATOR_EMAIL = process.env.OPERATOR_EMAIL || 'hello@safariindex.com';
const OPERATOR_PHONE = process.env.OPERATOR_PHONE;

export const metadata: Metadata = {
  title: 'Contact | Safari Index',
  description:
    'Contact Safari Index for safari planning questions, inquiries about our process, or updates on an existing trip request.',
  robots: 'index, follow',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact | Safari Index',
    description:
      'Contact Safari Index for safari planning questions or existing inquiries.',
    type: 'website',
    url: '/contact',
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar variant="solid" />

      {/* Clean header - no hero image needed */}
      <div className="bg-stone-900 pt-24 pb-12">
        <PageGrid maxWidth="default">
          <div className="text-center">
            <h1
              className="font-editorial text-3xl md:text-4xl font-semibold text-white mb-3"
              data-testid="contact-h1"
            >
              Get in Touch
            </h1>
            <p className="text-stone-400 text-lg max-w-md mx-auto">
              Have a question? We respond personally within 24 hours.
            </p>
          </div>
        </PageGrid>
      </div>

      {/* Main content - two clear options */}
      <div className="py-12 md:py-16">
        <PageGrid maxWidth="default">
          <div className="max-w-4xl mx-auto">
            {/* Two paths grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* Path 1: Quick Question */}
              <div className="p-6 rounded-xl bg-white border border-stone-200">
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mb-4">
                  <Send className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-2">
                  Quick Question
                </h2>
                <p className="text-stone-500 text-sm mb-4">
                  Best for timing questions, destination comparisons, or general safari advice.
                </p>
                <QuickQuestionForm />
              </div>

              {/* Path 2: Plan a Trip */}
              <div className="p-6 rounded-xl bg-stone-900 text-white">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
                <h2 className="font-editorial text-xl font-semibold mb-2">
                  Plan a Safari
                </h2>
                <p className="text-stone-400 text-sm mb-6">
                  Ready to start planning? Our trip form captures your preferences so we can build a custom itinerary.
                </p>
                <Link
                  href="/inquire"
                  className="group inline-flex items-center gap-2 w-full justify-center px-6 py-3 text-sm font-medium rounded-lg bg-white text-stone-900 hover:bg-stone-100 transition-colors"
                  data-testid="plan-safari-cta"
                >
                  Start Planning
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <p className="text-stone-500 text-xs text-center mt-3">
                  Takes about 2 minutes
                </p>
              </div>
            </div>

            {/* Direct contact options */}
            <div className="border-t border-stone-200 pt-8">
              <p className="text-center text-sm text-stone-500 mb-6">
                Or reach us directly
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href={`mailto:${OPERATOR_EMAIL}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  {OPERATOR_EMAIL}
                </a>
                {OPERATOR_PHONE && (
                  <a
                    href={`tel:${OPERATOR_PHONE}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    {OPERATOR_PHONE}
                  </a>
                )}
              </div>
            </div>

            {/* Popular questions - drives to content */}
            <div className="mt-12 pt-8 border-t border-stone-200">
              <h3 className="text-center text-sm font-medium text-stone-500 uppercase tracking-wider mb-6">
                Common Questions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link
                  href="/decisions/tanzania-vs-kenya-first-safari"
                  className="group p-4 rounded-lg bg-white border border-stone-200 hover:border-amber-300 transition-colors"
                >
                  <p className="text-sm font-medium text-stone-900 group-hover:text-amber-700">
                    Tanzania or Kenya for first safari?
                  </p>
                </Link>
                <Link
                  href="/when-to-go"
                  className="group p-4 rounded-lg bg-white border border-stone-200 hover:border-amber-300 transition-colors"
                >
                  <p className="text-sm font-medium text-stone-900 group-hover:text-amber-700">
                    Best time to visit East Africa?
                  </p>
                </Link>
                <Link
                  href="/decisions/is-5-days-enough-for-safari"
                  className="group p-4 rounded-lg bg-white border border-stone-200 hover:border-amber-300 transition-colors"
                >
                  <p className="text-sm font-medium text-stone-900 group-hover:text-amber-700">
                    How many days do I need?
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </PageGrid>
      </div>

      <Footer />
    </main>
  );
}
