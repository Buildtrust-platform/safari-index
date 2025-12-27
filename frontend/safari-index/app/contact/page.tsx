/**
 * Contact Page
 *
 * Informational contact page with operator trust signals.
 * No contact form - just clear contact methods and CTA to inquire.
 *
 * Per governance:
 * - Documentary tone, no hype
 * - Clear contact methods
 * - Links to /inquire for safari planning
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import { Mail, MessageCircle, ArrowRight, MapPin, Clock, Users } from 'lucide-react';
import { ImageBand, ImageBandContent, pageImages } from '../components/visual';
import { Navbar, Footer, PageGrid } from '../components/layout';
import { OperatorCredentials } from '../components/OperatorCredentials';
import { NewsletterSignup } from '../components/NewsletterSignup';

// Environment variables with fallbacks
const OPERATOR_EMAIL = process.env.OPERATOR_EMAIL || 'hello@safariindex.com';
const SITE_WHATSAPP = process.env.SITE_WHATSAPP;

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

/**
 * Contact method card
 */
function ContactMethod({
  icon: Icon,
  title,
  description,
  action,
  href,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group block p-6 rounded-xl bg-white border border-stone-200 hover:border-amber-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-amber-700" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-stone-900 mb-1">{title}</h3>
          <p className="text-sm text-stone-500 mb-3">{description}</p>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-700 group-hover:text-amber-800">
            {action}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </a>
  );
}

/**
 * Quick link card
 */
function QuickLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group block p-4 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-stone-900 group-hover:text-amber-700 transition-colors">
            {title}
          </h4>
          <p className="text-sm text-stone-500">{description}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-colors" />
      </div>
    </Link>
  );
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar />

      {/* Hero with soft background */}
      <ImageBand
        image={pageImages.decision}
        height="decision"
        overlay="standard"
        align="center"
        priority
        alwaysRender
      >
        <ImageBandContent maxWidth="default" className="pt-24 pb-12">
          <div className="text-center">
            <h1
              className="font-editorial text-3xl md:text-4xl font-semibold text-white mb-4"
              data-testid="contact-h1"
            >
              Contact Safari Index
            </h1>
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              Questions about safari planning, our process, or an existing inquiry.
            </p>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Main content */}
      <div className="py-12 md:py-16">
        <PageGrid maxWidth="default">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left column - Contact methods */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact methods */}
              <section>
                <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
                  Get in touch
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ContactMethod
                    icon={Mail}
                    title="Email"
                    description="For planning questions and existing inquiries"
                    action={OPERATOR_EMAIL}
                    href={`mailto:${OPERATOR_EMAIL}`}
                  />
                  {SITE_WHATSAPP && (
                    <ContactMethod
                      icon={MessageCircle}
                      title="WhatsApp"
                      description="Quick questions and trip updates"
                      action="Send a message"
                      href={`https://wa.me/${SITE_WHATSAPP.replace(/[^0-9]/g, '')}`}
                    />
                  )}
                </div>
                <p className="text-sm text-stone-500 mt-4">
                  We respond personally. Expect a reply within 24 hours on business days.
                </p>
              </section>

              {/* Operator trust block */}
              <section
                className="mt-8 p-6 rounded-xl bg-white border border-stone-200"
                data-testid="operator-trust-block"
              >
                <h2 className="font-editorial text-lg font-semibold text-stone-900 mb-4">
                  About Safari Index
                </h2>
                <OperatorCredentials variant="full" />
                <div className="mt-6 pt-4 border-t border-stone-100">
                  <Link
                    href="/how-it-works"
                    className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors"
                  >
                    Learn how we plan safaris
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </section>

              {/* What we cover */}
              <section className="mt-8">
                <h2 className="font-editorial text-lg font-semibold text-stone-900 mb-4">
                  What we can help with
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-white border border-stone-200">
                    <MapPin className="w-5 h-5 text-amber-600 mb-2" />
                    <h3 className="font-medium text-stone-900 text-sm mb-1">Destinations</h3>
                    <p className="text-xs text-stone-500">
                      Tanzania, Kenya, Botswana, Namibia, Rwanda, Uganda, South Africa
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-white border border-stone-200">
                    <Clock className="w-5 h-5 text-amber-600 mb-2" />
                    <h3 className="font-medium text-stone-900 text-sm mb-1">Timing</h3>
                    <p className="text-xs text-stone-500">
                      Best months, migration patterns, seasonal trade-offs
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-white border border-stone-200">
                    <Users className="w-5 h-5 text-amber-600 mb-2" />
                    <h3 className="font-medium text-stone-900 text-sm mb-1">Trip Fit</h3>
                    <p className="text-xs text-stone-500">
                      Family safaris, couples, groups, first-timers
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Right column - CTA and quick links */}
            <div className="space-y-6">
              {/* Primary CTA */}
              <section className="p-6 rounded-xl bg-stone-900 text-white">
                <h2 className="font-editorial text-xl font-semibold mb-2">
                  Planning a safari?
                </h2>
                <p className="text-stone-300 text-sm mb-6">
                  Start with our planning form. Tell us about your trip and we will respond
                  with tailored recommendations.
                </p>
                <Link
                  href="/inquire"
                  className="group inline-flex items-center gap-2 w-full justify-center px-6 py-3 text-sm font-medium rounded-md bg-white text-stone-900 hover:bg-stone-100 transition-colors"
                  data-testid="plan-safari-cta"
                >
                  Plan a Safari
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </section>

              {/* Quick links */}
              <section>
                <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-3">
                  Explore
                </h3>
                <div className="space-y-2">
                  <QuickLink
                    href="/trips"
                    title="Safari Itineraries"
                    description="Browse our trip templates"
                  />
                  <QuickLink
                    href="/decisions"
                    title="Decisions"
                    description="See how we think about safari planning"
                  />
                  <QuickLink
                    href="/guides"
                    title="Guides"
                    description="In-depth destination and topic guides"
                  />
                </div>
              </section>
            </div>
          </div>
        </PageGrid>
      </div>

      {/* Newsletter Section */}
      <section className="py-12 md:py-16 bg-stone-900">
        <PageGrid maxWidth="default">
          <NewsletterSignup source="contact" />
        </PageGrid>
      </section>

      <Footer />
    </main>
  );
}
