/**
 * About Page
 *
 * Per governance constitution:
 * - Documentary, observational tone
 * - No hype, no marketing language
 * - Name trade-offs explicitly
 * - Speak like someone who has seen this many times before
 *
 * Essential for SEO: E-E-A-T signals (Experience, Expertise, Authority, Trust)
 * Contains NAP data for Google business verification.
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import { MapPin, Mail, Phone } from 'lucide-react';
import { Navbar, Footer, PageGrid } from '../components/layout';

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

export default function AboutPage() {
  return (
    <main id="main-content" className="min-h-screen bg-stone-50">
      <Navbar variant="solid" />

      {/* Header */}
      <div className="bg-stone-900 pt-24 pb-16">
        <PageGrid maxWidth="default">
          <div className="max-w-2xl">
            <h1
              className="font-editorial text-3xl md:text-4xl font-semibold text-white mb-4"
              data-testid="about-h1"
            >
              About Vurara Safaris
            </h1>
            <p className="text-stone-400 text-lg leading-relaxed">
              We plan safari trips across East and Southern Africa. Our role is to explain
              what tends to work, what carries risk, and what depends on your specific situation.
            </p>
          </div>
        </PageGrid>
      </div>

      {/* Main content */}
      <div className="py-12 md:py-16">
        <PageGrid maxWidth="default">
          <div className="max-w-2xl">

            {/* What we actually do */}
            <section className="mb-16">
              <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-6">
                What we do
              </h2>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>
                  We build safari itineraries for travelers going to Tanzania, Kenya, Botswana,
                  South Africa, Namibia, Zambia, Rwanda, and Uganda.
                </p>
                <p>
                  Most inquiries come from people planning their first safari, though we also work
                  with travelers who have been before and want something different. The process
                  typically takes two to four weeks from first conversation to confirmed booking.
                </p>
                <p>
                  We work with lodges, camps, and ground operators in each country. We do not
                  operate vehicles or employ guides directly. This means we can recommend across
                  properties without being tied to a single inventory.
                </p>
              </div>
            </section>

            {/* How we approach planning */}
            <section className="mb-16">
              <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-6">
                How we approach planning
              </h2>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>
                  Safari planning involves trade-offs. A lodge with excellent game viewing may
                  have average food. A camp that suits couples may not work for families with
                  young children. July offers the best migration viewing in the Serengeti, but
                  also the highest prices and most crowded conditions.
                </p>
                <p>
                  We try to name these trade-offs rather than hide them. When we recommend
                  something, we explain why it fits your situation specifically—not why it is
                  generally good.
                </p>
                <p>
                  We also try to be clear about uncertainty. Wildlife sightings vary. Weather
                  patterns shift. A park that was quiet last month may be busy next month. We
                  can improve your odds, but we cannot guarantee outcomes.
                </p>
              </div>
            </section>

            {/* What we tend to avoid */}
            <section className="mb-16">
              <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-6">
                What we tend to avoid
              </h2>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>
                  We avoid itineraries that try to cover too much. Five parks in seven days
                  sounds impressive on paper but often results in exhaustion and superficial
                  experiences. Fewer locations with more time in each tends to work better.
                </p>
                <p>
                  We avoid properties where the marketing outpaces the reality. A camp may
                  photograph beautifully but have service issues or be in a location with
                  inconsistent game. We rely on recent guest feedback and our own observations,
                  not brochure copy.
                </p>
                <p>
                  We avoid pushing trips that do not fit. If your budget, timing, or expectations
                  do not align with what is realistically available, we will say so. A clear
                  refusal saves everyone time.
                </p>
              </div>
            </section>

            {/* The business */}
            <section className="mb-16">
              <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-6">
                The business
              </h2>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>
                  Vurara Safaris is based in the Netherlands. We work with clients from Europe,
                  North America, and elsewhere. Time zone differences mean some communication
                  happens asynchronously, but we aim to respond within one business day.
                </p>
                <p>
                  We earn commission from lodges and operators when a booking is confirmed. This
                  is standard in the industry. We do not charge planning fees. If a trip does
                  not proceed to booking, we do not bill for the time spent.
                </p>
                <p>
                  We are a small operation. This means personal attention but also limited
                  capacity. During busy periods, we may not be able to take on new inquiries
                  immediately.
                </p>
              </div>
            </section>

            {/* Contact section with NAP */}
            <section className="p-6 bg-white rounded-xl border border-stone-200">
              <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
                Contact
              </h2>
              <div className="space-y-3 text-stone-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-stone-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-stone-900">{COMPANY.name}</p>
                    <p className="text-sm">{COMPANY.address.street}</p>
                    <p className="text-sm">{COMPANY.address.city}, {COMPANY.address.country}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-stone-400 flex-shrink-0" />
                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="hover:text-stone-900 transition-colors"
                  >
                    {COMPANY.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-stone-400 flex-shrink-0" />
                  <a
                    href={`tel:${COMPANY.phone.replace(/\s/g, '')}`}
                    className="hover:text-stone-900 transition-colors"
                  >
                    {COMPANY.phone}
                  </a>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-stone-100">
                <p className="text-sm text-stone-500 mb-4">
                  If you want to discuss a potential trip, the inquiry form is the best starting point.
                </p>
                <Link
                  href="/inquire"
                  className="inline-flex items-center text-sm font-medium text-stone-900 hover:text-amber-700 transition-colors"
                >
                  Go to inquiry form →
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
