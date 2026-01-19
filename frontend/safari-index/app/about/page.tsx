/**
 * About Page
 *
 * Essential for SEO: establishes brand identity and E-E-A-T signals.
 * Contains NAP data (Name, Address, Phone) for Google business verification.
 *
 * Per governance:
 * - Documentary tone, no hype
 * - Clear company information
 * - Links to other important pages
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, MapPin, Mail, Phone, Globe } from 'lucide-react';
import { Navbar, Footer, PageGrid } from '../components/layout';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Vurara Safaris is a safari planning company based in the Netherlands, specializing in tailor-made safaris across East and Southern Africa. Logic-backed planning, honest trade-offs.',
  robots: 'index, follow',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Vurara Safaris',
    description:
      'Logic-backed safari planning across East and Southern Africa. We give you direct answers, not vague suggestions.',
    type: 'website',
    url: '/about',
  },
};

// Company details for NAP consistency
const COMPANY = {
  name: 'Vurara Safaris',
  tagline: 'The truth of the wild, revealed.',
  address: {
    street: 'De Wetstraat 134',
    city: 'Ridderkerk',
    country: 'Netherlands',
  },
  phone: '+31 6 14855683',
  email: 'hello@vurarasafaris.com',
  website: 'www.vurarasafaris.com',
};

export default function AboutPage() {
  return (
    <main id="main-content" className="min-h-screen bg-stone-50">
      <Navbar variant="solid" />

      {/* Header */}
      <div className="bg-stone-900 pt-24 pb-12">
        <PageGrid maxWidth="default">
          <div className="text-center">
            <h1
              className="font-editorial text-3xl md:text-4xl font-semibold text-white mb-3"
              data-testid="about-h1"
            >
              About Vurara Safaris
            </h1>
            <p className="text-stone-400 text-lg max-w-lg mx-auto">
              {COMPANY.tagline}
            </p>
          </div>
        </PageGrid>
      </div>

      {/* Main content */}
      <div className="py-12 md:py-16">
        <PageGrid maxWidth="default">
          <div className="max-w-3xl mx-auto">
            {/* Story section */}
            <section className="mb-12">
              <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-4">
                What We Do
              </h2>
              <div className="prose prose-stone max-w-none">
                <p className="text-stone-600 leading-relaxed mb-4">
                  Vurara Safaris specializes in tailor-made safari planning across East and Southern Africa.
                  We work with travelers who want clarity about their options—not sales pitches.
                </p>
                <p className="text-stone-600 leading-relaxed mb-4">
                  Our approach is different: we give you direct answers about what will and won&apos;t work for your
                  trip. If the timing is wrong for the migration, we&apos;ll tell you. If your budget doesn&apos;t match
                  your expectations, we&apos;ll explain the trade-offs honestly.
                </p>
                <p className="text-stone-600 leading-relaxed">
                  We cover Tanzania, Kenya, Botswana, South Africa, Namibia, Zambia, Rwanda, and Uganda—each
                  destination chosen for what it does best, not for commission rates.
                </p>
              </div>
            </section>

            {/* Approach section */}
            <section className="mb-12 p-6 bg-white rounded-xl border border-stone-200">
              <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
                Our Approach
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                  <span className="text-stone-600">
                    <strong className="text-stone-900">Logic-backed planning:</strong> Every recommendation
                    comes with reasoning you can evaluate yourself.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                  <span className="text-stone-600">
                    <strong className="text-stone-900">Honest trade-offs:</strong> We explain what you gain
                    and lose with each choice, so you decide with full context.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                  <span className="text-stone-600">
                    <strong className="text-stone-900">No pressure:</strong> We&apos;d rather lose a sale than
                    send you on the wrong trip.
                  </span>
                </li>
              </ul>
            </section>

            {/* Company info - NAP data for SEO */}
            <section className="mb-12">
              <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
                Company Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border border-stone-200">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-stone-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-stone-900">{COMPANY.name}</p>
                      <p className="text-sm text-stone-500">{COMPANY.address.street}</p>
                      <p className="text-sm text-stone-500">
                        {COMPANY.address.city}, {COMPANY.address.country}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-stone-200 space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-stone-400" />
                    <a
                      href={`mailto:${COMPANY.email}`}
                      className="text-stone-700 hover:text-amber-700 transition-colors"
                    >
                      {COMPANY.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-stone-400" />
                    <a
                      href={`tel:${COMPANY.phone.replace(/\s/g, '')}`}
                      className="text-stone-700 hover:text-amber-700 transition-colors"
                    >
                      {COMPANY.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-stone-400" />
                    <span className="text-stone-700">{COMPANY.website}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* CTAs */}
            <section className="border-t border-stone-200 pt-8">
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/inquire"
                  className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors"
                >
                  Start Planning a Safari
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                >
                  Contact Us
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                >
                  How It Works
                </Link>
              </div>
            </section>
          </div>
        </PageGrid>
      </div>

      <Footer />
    </main>
  );
}
