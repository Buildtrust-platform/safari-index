'use client';

/**
 * How It Works Page
 *
 * Explains Safari Index methodology, refusal policy, and accountability.
 * Editorial + documentary aesthetic. No marketing language.
 *
 * Sections:
 * 1. What it is
 * 2. What it does not do
 * 3. How a decision is made (4-step diagram)
 * 4. Why refusals exist
 * 5. Change and accountability (versioning and stability)
 *
 * Governance:
 * - 01_brand_voice.md: Senior safari planner voice
 * - 02_decision_doctrine.md: Decision framework and refusal policy
 * - 03_ux_flow.md: Clear information hierarchy
 * - 13_frontend_templates.md: Component patterns
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isBuildMode } from '../../lib/app-mode';
import { DecisionProcess } from '../components/visual';
import { PageGrid } from '../components/layout';
import {
  Heading1,
  Heading2,
  Heading3,
  Text,
  Meta,
  Section,
  SectionDivider,
} from '../components/ui';
import { ArrowLeft, BookOpen, XCircle, AlertTriangle, HelpCircle, Target, Hash, GitBranch, Eye, Quote, Compass, ChevronRight } from 'lucide-react';

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
    <div className="flex gap-4 p-4 bg-white rounded-xl border border-stone-200">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
          <RefusalIcon className="w-5 h-5 text-amber-600" />
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
  // Gate: 404 in observation mode
  if (!isBuildMode()) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-stone-50 to-stone-100">
      {/* Hero - Dark header matching explore/compare */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white">
        <PageGrid maxWidth="narrow" className="py-12 md:py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Safari Index
          </Link>

          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <Heading1 className="text-white text-3xl md:text-4xl font-semibold mb-2">
                How Safari Index works
              </Heading1>
              <Text variant="body" className="text-stone-400 text-lg max-w-xl">
                The decision process, refusal policy, and accountability structure.
              </Text>
            </div>
          </div>
        </PageGrid>
      </div>

      <PageGrid maxWidth="narrow" className="py-8">

        {/* Section 1: What it is */}
        <Section className="mb-12">
          <Heading2 className="mb-6">What it is</Heading2>
          <Text variant="body" color="primary" className="mb-4">
            Safari Index is a decision support system for safari travel planning.
            It provides clear verdicts on common safari questions—when to go,
            where to stay, what to expect—with trade-offs and conditions stated upfront.
          </Text>
          <Text variant="body" color="secondary">
            Each decision follows a consistent structure: a verdict, the reasoning behind it,
            the assumptions it depends on, and the conditions under which it would change.
          </Text>
        </Section>

        <SectionDivider />

        {/* Section 2: What it does not do */}
        <Section className="my-12">
          <Heading2 className="mb-6">What it does not do</Heading2>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <span className="text-neutral-400 select-none" aria-hidden>—</span>
              <Text variant="body" color="primary">
                Does not book travel or sell tours.
              </Text>
            </li>
            <li className="flex gap-3">
              <span className="text-neutral-400 select-none" aria-hidden>—</span>
              <Text variant="body" color="primary">
                Does not rank or recommend specific operators.
              </Text>
            </li>
            <li className="flex gap-3">
              <span className="text-neutral-400 select-none" aria-hidden>—</span>
              <Text variant="body" color="primary">
                Does not guarantee wildlife sightings or weather.
              </Text>
            </li>
            <li className="flex gap-3">
              <span className="text-neutral-400 select-none" aria-hidden>—</span>
              <Text variant="body" color="primary">
                Does not personalize based on hidden signals.
              </Text>
            </li>
          </ul>
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
            <div>
              <Heading3 className="mb-2">Decision IDs</Heading3>
              <Text variant="body" color="secondary">
                Every decision has a unique identifier that tracks the verdict,
                logic version, and timestamp.
              </Text>
            </div>
            <div>
              <Heading3 className="mb-2">Logic versioning</Heading3>
              <Text variant="body" color="secondary">
                Decision logic is versioned. When reasoning changes, the version
                increments. Prior decisions remain citable.
              </Text>
            </div>
            <div>
              <Heading3 className="mb-2">Inputs are visible</Heading3>
              <Text variant="body" color="secondary">
                The inputs used in any decision are visible. There are no hidden
                signals or personalization.
              </Text>
            </div>
            <div>
              <Heading3 className="mb-2">Citation</Heading3>
              <Text variant="body" color="secondary">
                Cite as: Safari Index. [Decision title]. Version [X]. [URL]. Accessed [date].
              </Text>
            </div>
          </div>
        </Section>

        <SectionDivider />

        {/* Optional link back to explore */}
        <Section className="my-12">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-amber-600 transition-colors"
          >
            Browse decisions
            <ChevronRight className="w-4 h-4" />
          </Link>
        </Section>

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-stone-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-600" />
              <Meta className="text-stone-600">Safari Index</Meta>
            </div>
            <Link href="/" className="text-sm text-stone-500 hover:text-amber-600 transition-colors">
              Home
            </Link>
          </div>
        </footer>
      </PageGrid>
    </div>
  );
}
