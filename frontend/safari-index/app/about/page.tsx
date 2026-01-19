/**
 * About Page
 *
 * Per governance constitution:
 * - Documentary, observational tone
 * - No hype, no marketing language
 * - Name trade-offs explicitly
 *
 * Essential for SEO: E-E-A-T signals (Experience, Expertise, Authority, Trust)
 * Contains NAP data for Google business verification.
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import {
  MapPin,
  Mail,
  Phone,
  ChevronRight,
  ArrowRight,
  Building2,
  Scale,
  Clock,
  XCircle,
  Users,
  Compass,
  Globe,
} from 'lucide-react';
import { Navbar, Footer } from '../components/layout';
import { ImageBand, ImageBandContent, ecosystemImages } from '../components/visual';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Vurara Safaris plans safari trips across East and Southern Africa. Based in the Netherlands. We explain trade-offs, name uncertainties, and help you decide whether a trip fits.',
  robots: 'index, follow',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Vurara Safaris',
    description:
      'Safari planning across East and Southern Africa. We explain what works, what carries risk, and what depends on your specific situation.',
    type: 'website',
    url: '/about',
  },
};

// Company details for NAP consistency
const COMPANY = {
  name: 'Vurara Safaris',
  address: {
    street: 'De Wetstraat 134',
    city: 'Ridderkerk',
    country: 'Netherlands',
  },
  phone: '+31 6 14855683',
  email: 'info@vurarasafaris.com',
};

const aboutHeroImage = ecosystemImages[0]; // savannah-morning

export default function AboutPage() {
  return (
    <main id="main-content" className="min-h-screen bg-stone-50">
      <Navbar variant="transparent" />

      {/* Hero */}
      <ImageBand
        image={aboutHeroImage}
        height="compare"
        overlay="strong"
        align="center"
        priority
        alwaysRender
      >
        <ImageBandContent maxWidth="narrow" className="pt-24 pb-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-white/60 text-sm mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                Vurara Safaris
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">About</span>
            </div>
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Building2 className="w-6 h-6 text-amber-400" />
              </div>
              <h1
                className="font-editorial text-4xl md:text-5xl font-semibold text-white"
                data-testid="about-h1"
              >
                About Us
              </h1>
            </div>
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              Safari planning across East and Southern Africa. Trade-offs explained, uncertainties named.
            </p>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Main content - compact two-column grid */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">

        {/* Two column layout */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">

          {/* Left column: What we do + How we work */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">What we do</h2>
              <p className="text-stone-600 text-sm leading-relaxed mb-4">
                We build safari itineraries for Tanzania, Kenya, Botswana, South Africa, Namibia,
                Zambia, Rwanda, and Uganda. Two to four weeks from first conversation to confirmed booking.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-stone-600">Most clients are first-timers, though we also work with repeat travelers seeking something different.</p>
                </div>
                <div className="flex items-start gap-3">
                  <Compass className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-stone-600">We work with lodges and operators—not tied to a single inventory.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">Our approach</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Scale className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-stone-600"><span className="font-medium text-stone-900">Trade-offs named.</span> A lodge with excellent game may have average food. July has best migration but highest prices.</p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-stone-600"><span className="font-medium text-stone-900">Uncertainty acknowledged.</span> Wildlife varies. We improve odds, not guarantee outcomes.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: What we avoid + The business */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">What we avoid</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-stone-600"><span className="font-medium text-stone-900">Overstuffed itineraries.</span> Five parks in seven days exhausts. Fewer locations, more time.</p>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-stone-600"><span className="font-medium text-stone-900">Marketing-over-reality camps.</span> We use guest feedback, not brochures.</p>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-stone-600"><span className="font-medium text-stone-900">Trips that don't fit.</span> A clear refusal saves everyone time.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">The business</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-stone-600"><span className="font-medium text-stone-900">Netherlands-based.</span> We respond within one business day.</p>
                </div>
                <div className="flex items-start gap-3">
                  <Scale className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-stone-600"><span className="font-medium text-stone-900">Commission model.</span> No planning fees. We earn when bookings confirm.</p>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-stone-600"><span className="font-medium text-stone-900">Small operation.</span> Personal attention, limited capacity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact + CTA row */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact card with NAP */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">Contact</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-stone-900">{COMPANY.name}</p>
                  <p className="text-stone-600">{COMPANY.address.street}, {COMPANY.address.city}, {COMPANY.address.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <a href={`mailto:${COMPANY.email}`} className="text-sm text-stone-600 hover:text-stone-900 transition-colors">
                  {COMPANY.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <a href={`tel:${COMPANY.phone.replace(/\s/g, '')}`} className="text-sm text-stone-600 hover:text-stone-900 transition-colors">
                  {COMPANY.phone}
                </a>
              </div>
            </div>
          </div>

          {/* CTA card */}
          <div className="bg-stone-900 rounded-2xl p-6 flex flex-col justify-center">
            <h3 className="font-editorial text-xl font-semibold text-white mb-2">
              Ready to discuss a trip?
            </h3>
            <p className="text-stone-400 text-sm mb-4">
              Tell us what you have in mind. We'll let you know if we can help.
            </p>
            <Link
              href="/inquire"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-stone-900 rounded-lg text-sm font-medium hover:bg-stone-100 transition-colors w-fit"
            >
              Start an inquiry
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
