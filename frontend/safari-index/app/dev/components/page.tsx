/**
 * DEV-ONLY Component Preview Page
 *
 * Access: /dev/components
 * Gating: NODE_ENV !== 'production' OR ENABLE_DEV_PAGES=true
 * If accessed in production without flag, returns 404
 *
 * Purpose: Visual regression testing, component consistency checks
 * NOT linked from production UI, NOT indexed
 */

import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// Components to preview
import { VerdictCard } from '../../components/VerdictCard';
import { TradeoffLedger } from '../../components/TradeoffLedger';
import { FitMisfitBlock } from '../../components/FitMisfitBlock';
import { AssumptionsBlock } from '../../components/AssumptionsBlock';
import { ChangeConditions } from '../../components/ChangeConditions';
import { AnswerOwnershipBlock } from '../../components/AnswerOwnershipBlock';
import { AttributionFooter } from '../../components/AttributionFooter';
import { QualityGateFailure } from '../../components/QualityGateFailure';
import { DecisionEmbed } from '../../components/DecisionEmbed';
import { DecisionFollowUpPreview } from './DecisionFollowUpPreview';
import { NextSensibleStepPreview } from './NextSensibleStepPreview';
import {
  Skeleton,
  SkeletonText,
  SkeletonHeading,
  SkeletonVerdictCard,
  SkeletonSection,
  SkeletonDecisionPage,
  SkeletonEmbed,
} from '../../ui/Skeleton';

// Environment gating
function isDevAccessAllowed(): boolean {
  // Allow in development
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }
  // Allow in production only if explicitly enabled
  if (process.env.ENABLE_DEV_PAGES === 'true') {
    return true;
  }
  return false;
}

export const metadata: Metadata = {
  title: 'Component Preview (DEV)',
  robots: 'noindex, nofollow',
};

// Force dynamic to check env at runtime
export const dynamic = 'force-dynamic';

// Mock data for previews
const mockAssumptions = [
  { id: 'A1', text: 'You have flexibility in your travel dates within the month', confidence: 0.85 },
  { id: 'A2', text: 'Budget allows for mid-range to premium accommodations', confidence: 0.7 },
  { id: 'A3', text: 'Group size is 2-4 adults without young children', confidence: 0.9 },
];

const mockTradeoffs = {
  gains: [
    'Peak wildlife viewing during calving season',
    'Excellent photography conditions',
    'Lower crowd density than July-August',
  ],
  losses: [
    'Higher accommodation costs than shoulder season',
    'Some lodges fully booked 6+ months ahead',
    'Variable weather patterns possible',
  ],
};

const mockFit = {
  rightFor: [
    'First-time safari visitors',
    'Travelers with flexible schedules',
    'Those prioritizing wildlife density',
  ],
  notIdealFor: [
    'Budget-constrained travelers',
    'Those with fixed immovable dates',
    'Travelers who cannot tolerate crowds',
  ],
};

const mockChangeConditions = [
  'Your travel dates shift to rainy season',
  'Budget constraints require value-tier options',
  'Group composition changes to include young children',
  'Priority shifts from wildlife to cultural experiences',
];

export default function DevComponentsPage() {
  // Gate access
  if (!isDevAccessAllowed()) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12 pb-8 border-b border-gray-200">
        <div className="bg-amber-50 border border-amber-200 rounded p-4 mb-6">
          <p className="text-sm text-amber-800">
            DEV-ONLY: This page is not accessible in production.
          </p>
        </div>
        <h1 className="text-3xl font-semibold text-gray-900">Component Preview</h1>
        <p className="mt-2 text-gray-600">
          Visual regression testing for Safari Index components.
        </p>
      </header>

      {/* VerdictCard - All Outcomes */}
      <Section title="VerdictCard">
        <div className="space-y-6">
          <Subsection title="Outcome: Book">
            <VerdictCard
              outcome="book"
              headline="February works well for your Tanzania safari"
              summary="The calving season offers exceptional wildlife viewing. Book early to secure preferred lodges."
              confidence={0.82}
            />
          </Subsection>

          <Subsection title="Outcome: Wait">
            <VerdictCard
              outcome="wait"
              headline="Consider waiting for better conditions"
              summary="Current pricing is at peak levels. Shoulder season offers similar wildlife at lower cost."
              confidence={0.65}
            />
          </Subsection>

          <Subsection title="Outcome: Switch">
            <VerdictCard
              outcome="switch"
              headline="Kenya may better suit your constraints"
              summary="Given your timeline and budget, the Masai Mara offers comparable experiences with better availability."
              confidence={0.71}
            />
          </Subsection>

          <Subsection title="Outcome: Discard">
            <VerdictCard
              outcome="discard"
              headline="This option does not meet your requirements"
              summary="The constraints you specified are incompatible with a February Tanzania safari."
              confidence={0.45}
            />
          </Subsection>

          <Subsection title="Outcome: Refused">
            <VerdictCard
              outcome="refused"
              headline="Decision refused"
              summary="We cannot provide a recommendation without knowing your travel dates and group size."
              confidence={0}
            />
          </Subsection>
        </div>
      </Section>

      {/* TradeoffLedger */}
      <Section title="TradeoffLedger">
        <TradeoffLedger gains={mockTradeoffs.gains} losses={mockTradeoffs.losses} />
      </Section>

      {/* FitMisfitBlock */}
      <Section title="FitMisfitBlock">
        <FitMisfitBlock rightFor={mockFit.rightFor} notIdealFor={mockFit.notIdealFor} />
      </Section>

      {/* AssumptionsBlock */}
      <Section title="AssumptionsBlock">
        <AssumptionsBlock assumptions={mockAssumptions} />
      </Section>

      {/* ChangeConditions */}
      <Section title="ChangeConditions">
        <ChangeConditions conditions={mockChangeConditions} />
      </Section>

      {/* AnswerOwnershipBlock */}
      <Section title="AnswerOwnershipBlock">
        <AnswerOwnershipBlock
          question="Is February a good time for a Tanzania safari?"
          outcome="book"
          headline="February works well for your Tanzania safari"
          summary="The calving season offers exceptional wildlife viewing."
          confidence={0.82}
          primaryCondition="the calving season offers exceptional wildlife density in the Serengeti"
          invalidatingCondition="your travel dates shift outside February or budget constraints require value-tier options"
        />
      </Section>

      {/* AttributionFooter */}
      <Section title="AttributionFooter">
        <AttributionFooter
          decisionId="dec_preview_12345"
          logicVersion="v2.1"
          answerVersion="v1.0"
          issuedAt="2024-12-21T10:30:00Z"
        />
      </Section>

      {/* QualityGateFailure */}
      <Section title="QualityGateFailure">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <QualityGateFailure
            topicQuestion="Is March a good time for a Zambia safari?"
            failures={[
              'Headline missing or too vague',
              'Fewer than 2 assumptions provided',
              'No change conditions specified',
            ]}
            decisionId="dec_failed_67890"
          />
        </div>
      </Section>

      {/* DecisionEmbed */}
      <Section title="DecisionEmbed">
        <Subsection title="Normal Embed (constrained width)">
          <div className="max-w-[600px] border border-gray-300 rounded">
            <DecisionEmbed
              question="Is February a good time for a Tanzania safari?"
              outcome="book"
              headline="February works well for your Tanzania safari"
              quotableVerdict="February works well for your Tanzania safari. Travelers should proceed with booking because the calving season offers exceptional wildlife density in the Serengeti. This recommendation changes if your travel dates shift outside February or budget constraints require value-tier options."
              confidence={0.82}
              answerVersion="v1.0"
              logicVersion="v2.1"
              issuedAt="2024-12-21T10:30:00Z"
              canonicalUrl="https://safariindex.com/decisions/tanzania-safari-february"
              decisionId="dec_embed_preview"
              isFlaggedForReview={false}
            />
          </div>
        </Subsection>

        <Subsection title="Flagged for Review">
          <div className="max-w-[600px] border border-gray-300 rounded">
            <DecisionEmbed
              question="Is February a good time for a Tanzania safari?"
              outcome="book"
              headline="February works well"
              quotableVerdict="This content is under review."
              confidence={0.82}
              answerVersion="v1.0"
              logicVersion="v2.1"
              issuedAt="2024-12-21T10:30:00Z"
              canonicalUrl="https://safariindex.com/decisions/tanzania-safari-february"
              decisionId="dec_embed_flagged"
              isFlaggedForReview={true}
            />
          </div>
        </Subsection>
      </Section>

      {/* DecisionFollowUp */}
      <Section title="DecisionFollowUp">
        <DecisionFollowUpPreview />
      </Section>

      {/* NextSensibleStep */}
      <Section title="NextSensibleStep">
        <NextSensibleStepPreview />
      </Section>

      {/* Skeleton States */}
      <Section title="Skeleton States">
        <Subsection title="Basic Skeleton">
          <Skeleton className="h-8 w-48" />
        </Subsection>

        <Subsection title="SkeletonText (3 lines)">
          <SkeletonText lines={3} />
        </Subsection>

        <Subsection title="SkeletonHeading">
          <SkeletonHeading />
        </Subsection>

        <Subsection title="SkeletonVerdictCard">
          <SkeletonVerdictCard />
        </Subsection>

        <Subsection title="SkeletonSection">
          <SkeletonSection lines={4} />
        </Subsection>

        <Subsection title="SkeletonEmbed">
          <div className="max-w-[600px] border border-gray-300 rounded p-4">
            <SkeletonEmbed />
          </div>
        </Subsection>

        <Subsection title="SkeletonDecisionPage (full)">
          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <SkeletonDecisionPage />
          </div>
        </Subsection>
      </Section>

      <footer className="mt-16 pt-8 border-t border-gray-200 text-sm text-gray-500">
        <p>DEV-ONLY preview page. Not for production use.</p>
      </footer>
    </main>
  );
}

// Helper components for page structure
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
        {title}
      </h3>
      {children}
    </div>
  );
}
