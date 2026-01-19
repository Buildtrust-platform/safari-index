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
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  ChevronRight,
  ArrowRight,
  Building2,
  Scale,
  Clock,
  XCircle,
  Users,
  Compass,
} from 'lucide-react';
import { Navbar, Footer } from '../components/layout';
import { ImageBand, ImageBandContent, ecosystemImages } from '../components/visual';
import {
  Heading2,
  Text,
  Section,
  SectionDivider,
} from '../components/ui';

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

// Use savannah image for about page - documentary style
const aboutHeroImage = ecosystemImages[0]; // savannah-morning

/**
 * InfoCard - Card with icon for key information
 */
function InfoCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex gap-4 p-5 bg-white rounded-2xl border border-stone-200 shadow-sm">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center border border-amber-200/50">
          <Icon className="w-6 h-6 text-amber-700" />
        </div>
      </div>
      <div>
        <Text variant="body" color="primary" className="font-medium mb-1 text-stone-900">
          {title}
        </Text>
        <Text variant="body" color="secondary" className="text-stone-600">
          {description}
        </Text>
      </div>
    </div>
  );
}

/**
 * AvoidCard - What we tend to avoid (with X icon)
 */
function AvoidCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-5 bg-white rounded-2xl border border-stone-200">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <XCircle className="w-5 h-5 text-stone-400" />
        </div>
        <div>
          <p className="font-medium text-stone-900 mb-1">{title}</p>
          <p className="text-sm text-stone-600">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <main id="main-content" className="min-h-screen bg-stone-50">
      <Navbar variant="transparent" />

      {/* Hero with safari imagery */}
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
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-white/60 text-sm mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                Vurara Safaris
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">About</span>
            </div>

            {/* Icon + Title */}
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

            {/* Subtitle */}
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              Safari planning across East and Southern Africa. We explain what tends to work,
              what carries risk, and what depends on your specific situation.
            </p>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">

        {/* Section 1: What we do */}
        <Section className="mb-12">
          <Heading2 className="mb-6">What we do</Heading2>
          <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
            <p className="text-stone-900 leading-relaxed">
              We build safari itineraries for travelers going to Tanzania, Kenya, Botswana,
              South Africa, Namibia, Zambia, Rwanda, and Uganda. The process typically takes
              two to four weeks from first conversation to confirmed booking.
            </p>
          </div>
          <div className="space-y-4">
            <InfoCard
              icon={Users}
              title="Most clients are first-timers"
              description="Though we also work with travelers who have been before and want something different—deeper wildlife focus, new regions, specialist interests."
            />
            <InfoCard
              icon={Compass}
              title="We work with lodges and operators"
              description="We do not operate vehicles or employ guides directly. This means we can recommend across properties without being tied to a single inventory."
            />
          </div>
        </Section>

        <SectionDivider />

        {/* Section 2: How we approach planning */}
        <Section className="my-12">
          <Heading2 className="mb-6">How we approach planning</Heading2>
          <div className="space-y-4">
            <InfoCard
              icon={Scale}
              title="Trade-offs named, not hidden"
              description="A lodge with excellent game viewing may have average food. July offers the best migration viewing but also the highest prices and most crowded conditions. We explain these realities."
            />
            <InfoCard
              icon={Clock}
              title="Uncertainty acknowledged"
              description="Wildlife sightings vary. Weather patterns shift. A park that was quiet last month may be busy next month. We can improve your odds, but we cannot guarantee outcomes."
            />
          </div>
          <div className="mt-6 p-5 bg-stone-100 rounded-2xl">
            <p className="text-stone-700 leading-relaxed">
              When we recommend something, we explain why it fits your situation specifically—not
              why it is generally good. Generic advice helps no one.
            </p>
          </div>
        </Section>

        <SectionDivider />

        {/* Section 3: What we tend to avoid */}
        <Section className="my-12">
          <Heading2 className="mb-6">What we tend to avoid</Heading2>
          <div className="space-y-4">
            <AvoidCard
              title="Overstuffed itineraries"
              description="Five parks in seven days sounds impressive but often results in exhaustion and superficial experiences. Fewer locations with more time tends to work better."
            />
            <AvoidCard
              title="Marketing-over-reality properties"
              description="A camp may photograph beautifully but have service issues or inconsistent game. We rely on recent guest feedback and our own observations, not brochure copy."
            />
            <AvoidCard
              title="Trips that do not fit"
              description="If your budget, timing, or expectations do not align with what is realistically available, we will say so. A clear refusal saves everyone time."
            />
          </div>
        </Section>

        <SectionDivider />

        {/* Section 4: The business */}
        <Section className="my-12">
          <Heading2 className="mb-6">The business</Heading2>
          <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100">
            <div className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="w-4 h-4 text-stone-400" />
                <p className="font-medium text-stone-900">Netherlands-based</p>
              </div>
              <p className="text-sm text-stone-600 ml-6">
                We work with clients from Europe, North America, and elsewhere. Time zones mean some
                communication happens asynchronously—we respond within one business day.
              </p>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <Scale className="w-4 h-4 text-stone-400" />
                <p className="font-medium text-stone-900">Commission model</p>
              </div>
              <p className="text-sm text-stone-600 ml-6">
                We earn commission from lodges and operators when a booking is confirmed. Standard in
                the industry. No planning fees. If a trip does not proceed, we do not bill for time spent.
              </p>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-stone-400" />
                <p className="font-medium text-stone-900">Small operation</p>
              </div>
              <p className="text-sm text-stone-600 ml-6">
                Personal attention but limited capacity. During busy periods, we may not be able to
                take on new inquiries immediately.
              </p>
            </div>
          </div>
        </Section>

        <SectionDivider />

        {/* Section 5: Contact with NAP */}
        <Section className="my-12">
          <Heading2 className="mb-6">Contact</Heading2>
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-stone-900">{COMPANY.name}</p>
                  <p className="text-stone-600">{COMPANY.address.street}</p>
                  <p className="text-stone-600">{COMPANY.address.city}, {COMPANY.address.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  {COMPANY.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <a
                  href={`tel:${COMPANY.phone.replace(/\s/g, '')}`}
                  className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  {COMPANY.phone}
                </a>
              </div>
            </div>
          </div>
        </Section>

        {/* CTA section */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-white rounded-2xl border border-stone-200 p-8 max-w-lg">
            <h3 className="font-editorial text-xl font-semibold text-stone-900 mb-2">
              Ready to discuss a trip?
            </h3>
            <p className="text-stone-500 mb-6">
              The inquiry form is the best starting point. Tell us what you have in mind,
              and we will let you know if we can help.
            </p>
            <Link
              href="/inquire"
              className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors"
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
