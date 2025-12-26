'use client';

/**
 * How It Works Page
 *
 * Explains Safari Index methodology, refusal policy, and accountability.
 * Premium safari aesthetic with ImageBand hero.
 *
 * Sections:
 * 1. What it is
 * 2. What it does not do
 * 3. How a decision is made (4-step diagram)
 * 4. Why refusals exist
 * 5. Change and accountability (versioning and stability)
 */

import Link from 'next/link';
import { DecisionProcess, ImageBand, ImageBandContent, pageImages } from '../components/visual';
import { Navbar, Footer } from '../components/layout';
import {
  Heading2,
  Heading3,
  Text,
  Section,
  SectionDivider,
} from '../components/ui';
import { BookOpen, XCircle, AlertTriangle, HelpCircle, Target, ChevronRight, ArrowRight } from 'lucide-react';

/**
 * RefusalReason - Explains a specific refusal category with icon
 */
function RefusalReason({
  title,
  description,
  icon: RefusalIcon,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex gap-4 p-5 bg-white rounded-2xl border border-stone-200 shadow-sm">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center border border-amber-200/50">
          <RefusalIcon className="w-6 h-6 text-amber-700" />
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

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      {/* Navbar */}
      <Navbar variant="transparent" />

      {/* Hero with safari imagery */}
      <ImageBand
        image={pageImages.howItWorks}
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
                Safari Index
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">How it works</span>
            </div>

            {/* Icon + Title */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <BookOpen className="w-6 h-6 text-amber-400" />
              </div>
              <h1 className="font-editorial text-4xl md:text-5xl font-semibold text-white">
                How it works
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              The decision process, refusal policy, and accountability structure.
            </p>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">

        {/* Section 1: What it is */}
        <Section className="mb-12">
          <Heading2 className="mb-6">What it is</Heading2>
          <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-4">
            <p className="text-stone-900 leading-relaxed">
              Safari Index is a decision support system for safari travel planning.
              It provides clear verdicts on common safari questions: when to go,
              where to stay, what to expect. Trade-offs and conditions are stated upfront.
            </p>
          </div>
          <p className="text-stone-600 leading-relaxed">
            Each decision follows a consistent structure: a verdict, the reasoning behind it,
            the assumptions it depends on, and the conditions under which it would change.
          </p>
        </Section>

        <SectionDivider />

        {/* Section 2: What it does not do */}
        <Section className="my-12">
          <Heading2 className="mb-6">What it does not do</Heading2>
          <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100">
            <div className="p-5">
              <p className="font-medium text-stone-900">No bookings or tours</p>
              <p className="text-sm text-stone-500 mt-1">We provide decisions, not travel packages.</p>
            </div>
            <div className="p-5">
              <p className="font-medium text-stone-900">No operator rankings</p>
              <p className="text-sm text-stone-500 mt-1">We don't recommend or rate specific safari companies.</p>
            </div>
            <div className="p-5">
              <p className="font-medium text-stone-900">No sighting guarantees</p>
              <p className="text-sm text-stone-500 mt-1">Wildlife and weather are unpredictable by nature.</p>
            </div>
            <div className="p-5">
              <p className="font-medium text-stone-900">No hidden personalization</p>
              <p className="text-sm text-stone-500 mt-1">Every input we use is visible. No tracking, no signals.</p>
            </div>
          </div>
        </Section>

        <SectionDivider />

        {/* Section 3: Decision Process */}
        <Section className="my-12">
          <Heading2 className="mb-6">How a decision is made</Heading2>
          <Text variant="body" color="secondary" className="mb-8 max-w-2xl">
            Every decision follows a 4-step process. This structure ensures
            the question is addressed directly, trade-offs are surfaced, and
            conditions for change are stated.
          </Text>

          <DecisionProcess />
        </Section>

        <SectionDivider />

        {/* Section 4: Why refusals exist */}
        <Section className="my-12">
          <Heading2 className="mb-6">Why refusals exist</Heading2>

          <Text variant="body" color="secondary" className="mb-8 max-w-2xl">
            Refusal is preferred over a weak decision. When a clear verdict cannot
            be issued responsibly, we say so and explain what information is missing.
          </Text>

          <div className="space-y-4">
            <RefusalReason
              title="Insufficient context"
              description="Key factors (dates, preferences, constraints) are missing or unclear."
              icon={HelpCircle}
            />
            <RefusalReason
              title="Conflicting inputs"
              description="Stated preferences conflict with each other and cannot be reconciled."
              icon={XCircle}
            />
            <RefusalReason
              title="Outside scope"
              description="The question is about non-safari travel or unrelated destinations."
              icon={Target}
            />
            <RefusalReason
              title="Unknowable outcomes"
              description="The answer depends on factors that cannot be predicted (e.g., specific wildlife sightings)."
              icon={AlertTriangle}
            />
          </div>
        </Section>

        <SectionDivider />

        {/* Section 5: Change and accountability */}
        <Section className="my-12">
          <Heading2 className="mb-6">Change and accountability</Heading2>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <Heading3 className="mb-2">Decision IDs</Heading3>
              <Text variant="body" color="secondary">
                Every decision has a unique identifier that tracks the verdict,
                logic version, and timestamp.
              </Text>
            </div>
            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <Heading3 className="mb-2">Logic versioning</Heading3>
              <Text variant="body" color="secondary">
                Decision logic is versioned. When reasoning changes, the version
                increments. Prior decisions remain citable.
              </Text>
            </div>
            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <Heading3 className="mb-2">Inputs are visible</Heading3>
              <Text variant="body" color="secondary">
                The inputs used in any decision are visible. There are no hidden
                signals or personalization.
              </Text>
            </div>
            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <Heading3 className="mb-2">Citation</Heading3>
              <Text variant="body" color="secondary">
                Cite as: Safari Index. [Decision title]. Version [X]. [URL]. Accessed [date].
              </Text>
            </div>
          </div>
        </Section>

        {/* CTA section */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-white rounded-2xl border border-stone-200 p-8 max-w-lg">
            <h3 className="font-editorial text-xl font-semibold text-stone-900 mb-2">
              Ready to explore?
            </h3>
            <p className="text-stone-500 mb-6">
              Browse our library of safari decisions and find the answers you need.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors"
            >
              Browse decisions
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <Footer variant="decision-system" />
    </main>
  );
}
