'use client';

/**
 * Dynamic Decision Page
 *
 * Per 13_frontend_templates.md:
 * - Verdict-first, one decision per screen
 * - Fixed structure: Title, Verdict Card, Trade-offs, Fit/Misfit, Assumptions, Change Conditions, CTA
 *
 * Per 14_seo_generation.md:
 * - URL pattern: /decisions/<topic-slug>
 * - Pages generated from decision topics, not keywords
 *
 * Design System v1 applied (staging only):
 * - ImageBand for environmental context above question
 * - No images below question or inside analytical surfaces
 *
 * Governance:
 * - 01_brand_voice.md: Documentary/editorial imagery
 * - 03_ux_flow.md: Images as context above analytical surfaces
 * - MVP_FREEZE.md: Gated by isBuildMode() - production unchanged
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { VerdictCard } from '../../components/VerdictCard';
import { TradeoffLedger } from '../../components/TradeoffLedger';
import { FitMisfitBlock } from '../../components/FitMisfitBlock';
import { AssumptionsBlock } from '../../components/AssumptionsBlock';
import { ChangeConditions } from '../../components/ChangeConditions';
import { CTABar } from '../../components/CTABar';
import { AssuranceCTA } from '../../components/AssuranceCTA';
import { RelatedDecisions } from '../../components/RelatedDecisions';
import { QualityGateFailure } from '../../components/QualityGateFailure';
import { AnswerOwnershipBlock } from '../../components/AnswerOwnershipBlock';
import { StructuredData } from '../../components/StructuredData';
import { AttributionFooter } from '../../components/AttributionFooter';
import { NextSensibleStep } from '../../components/NextSensibleStep';
import { DecisionFollowUp } from '../../components/DecisionFollowUp';
import { InputReadinessPanel } from '../../components/InputReadinessPanel';
import { RefusalRecoveryPanel } from '../../components/RefusalRecoveryPanel';
import { ServiceDegradedRefusal } from '../../components/ServiceDegradedRefusal';
import { PreflightWizard } from '../../components/PreflightWizard';
import { BaselineFallbackBanner } from '../../components/BaselineFallbackBanner';
import { TripPlanningCTA } from '../../components/TripPlanningCTA';
import { LinkedTrips } from '../../components/LinkedTrips';
import { getTopicBySlug, DecisionTopic } from '../../content/decision-topics';
import {
  getBaselineDecision,
  isCapacityOrServiceRefusal,
  type BaselineDecision,
} from '../../../lib/baseline-decisions';
import { getRelatedTopics } from '../../content/topic-graph';
import {
  validateDecisionQuality,
  DecisionOutput,
} from '../../lib/quality-gates';
import { getCurrentAnswer } from '../../lib/answer-versions';
import { isBuildMode } from '../../../lib/app-mode';
import { SkeletonDecisionPage } from '../../ui/Skeleton';
import {
  pageContainer,
  section,
  sectionHeading,
  listContainer,
  listItem,
  listBullet,
  listText,
  errorContainer,
  footer as footerStyles,
} from '../../ui/styles';
import {
  buildRequestEnvelope,
  deriveFitMisfitModel,
  extractPrimaryCondition,
  extractInvalidatingCondition,
} from '../../../lib/page-assembly';
import { API_BASE } from '../../../lib/api-client';
import { normalizeDecisionResponse, isContractError } from '../../../lib/adapters';
import type { DecisionResponse } from '../../../lib/contracts';
import {
  type PreflightInputs,
  buildOverridesFromInputs,
  mergeEnvelopeWithOverrides,
} from '../../../lib/preflight-inputs';
import { ImageBand, ImageBandContent, pageImages, VerdictMoment } from '../../components/visual';
import { DependsOnStrip } from '../../components/DependsOnStrip';
import { SectionDivider } from '../../components/ui/Divider';
import { Navbar, Footer } from '../../components/layout';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

type PageState = 'pending' | 'loading' | 'success' | 'refusal' | 'error' | 'quality_failed' | 'baseline_fallback';

const API_ENDPOINT = `${API_BASE}/decision/evaluate`;

export default function DecisionPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // In build mode, start with 'pending' to show wizard; in observation mode, start with 'loading'
  const initialState: PageState = isBuildMode() ? 'pending' : 'loading';
  const [state, setState] = useState<PageState>(initialState);
  const [decision, setDecision] = useState<DecisionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState<DecisionTopic | null>(null);
  const [relatedTopics, setRelatedTopics] = useState<DecisionTopic[]>([]);
  const [qualityFailures, setQualityFailures] = useState<string[]>([]);
  const [baselineDecision, setBaselineDecision] = useState<BaselineDecision | null>(null);

  // Fetch decision with optional overrides
  const fetchDecision = useCallback(
    async (foundTopic: DecisionTopic, overrides?: Partial<ReturnType<typeof buildRequestEnvelope>>) => {
      setState('loading');
      try {
        let request = buildRequestEnvelope(foundTopic);
        if (overrides) {
          request = mergeEnvelopeWithOverrides(request, overrides);
        }

        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        });

        if (!response.ok) {
          throw new Error(`Service responded with ${response.status}`);
        }

        const rawData = await response.json();
        // Validate response shape - routes contract errors to existing error state
        const data: DecisionResponse = normalizeDecisionResponse(rawData);
        setDecision(data);

        if (data.output.type === 'refusal') {
          // Check for capacity/service refusal and baseline availability
          if (isCapacityOrServiceRefusal(data.output)) {
            const baseline = getBaselineDecision(foundTopic.topic_id);
            if (baseline) {
              setBaselineDecision(baseline);
              setState('baseline_fallback');
              return;
            }
          }
          setState('refusal');
        } else if (data.output.decision) {
          // Validate quality gates before rendering
          // Per 02_decision_doctrine.md: prefer refusal over weak decisions
          const qualityResult = validateDecisionQuality(data.output.decision as DecisionOutput);
          if (!qualityResult.passed) {
            setQualityFailures(qualityResult.failures);
            setState('quality_failed');
          } else {
            setState('success');
          }
        } else {
          setState('error');
          setError('Invalid response structure');
        }
      } catch (err) {
        // Contract errors route to same error state - no copy change
        if (isContractError(err)) {
          setError('Decision service unavailable');
        } else {
          setError(err instanceof Error ? err.message : 'Decision service unavailable');
        }
        setState('error');
      }
    },
    []
  );

  // Initialize topic and auto-fetch in observation mode
  useEffect(() => {
    const foundTopic = getTopicBySlug(slug);
    if (!foundTopic || !foundTopic.published) {
      return;
    }

    setTopic(foundTopic);
    setRelatedTopics(getRelatedTopics(foundTopic.topic_id));

    // In observation mode, immediately fetch (no wizard)
    if (!isBuildMode()) {
      fetchDecision(foundTopic);
    }
  }, [slug, fetchDecision]);

  // Handle wizard "Use these inputs" action
  const handleUseInputs = useCallback(
    (inputs: PreflightInputs) => {
      if (!topic) return;
      const overrides = buildOverridesFromInputs(inputs);
      fetchDecision(topic, overrides);
    },
    [topic, fetchDecision]
  );

  // Handle wizard "Skip" action - use default behavior
  const handleSkip = useCallback(() => {
    if (!topic) return;
    fetchDecision(topic);
  }, [topic, fetchDecision]);

  // Topic not found
  if (!topic && state !== 'loading' && state !== 'pending') {
    notFound();
  }

  // Pending state (build mode only) - show wizard before fetching
  if (state === 'pending' && topic) {
    return (
      <>
        {/* Environmental context - ImageBand (staging only, above question) */}
        <ImageBand
          image={pageImages.decision}
          height="decision"
          overlay="standard"
          align="center"
        />

        <main className={pageContainer}>
          <h1 className="text-2xl font-semibold mb-2">{topic.question}</h1>
          <p className="text-gray-600 mb-8">{topic.context_line}</p>

          <PreflightWizard
            topic={topic}
            onUseInputs={handleUseInputs}
            onSkip={handleSkip}
          />

          <div className={`${errorContainer} bg-blue-50 border-blue-200`}>
            <p className="text-gray-700 mb-2">Waiting for input selection</p>
            <p className="text-gray-500 text-sm">
              Expand the panel above to test with specific inputs, or click Skip to use defaults.
            </p>
          </div>

          <RelatedDecisions topics={relatedTopics} />
        </main>
      </>
    );
  }

  // Loading state - calm, no spinner, skeleton layout
  if (state === 'loading' || !topic) {
    return (
      <main className={pageContainer}>
        <SkeletonDecisionPage />
      </main>
    );
  }

  // Error state
  if (state === 'error') {
    return (
      <main className={pageContainer}>
        <h1 className="text-2xl font-semibold mb-2">{topic.question}</h1>
        <p className="text-gray-600 mb-8">{topic.context_line}</p>
        <div className={errorContainer} role="alert">
          <p className="text-gray-700 mb-2">Unable to retrieve a decision at this time.</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
        <RelatedDecisions topics={relatedTopics} />
      </main>
    );
  }

  // Quality gate failure state
  // Per 02_decision_doctrine.md: prefer refusal over weak decisions
  if (state === 'quality_failed') {
    return (
      <QualityGateFailure
        topicQuestion={topic.question}
        failures={qualityFailures}
        decisionId={decision?.decision_id}
      />
    );
  }

  // Baseline fallback state - capacity refusal with available baseline
  if (state === 'baseline_fallback' && baselineDecision && topic) {
    const d = baselineDecision;
    const fitMisfit = deriveFitMisfitModel(topic, d.outcome);

    // Get outcome styling
    const getOutcomeColor = (outcome: string) => {
      switch (outcome) {
        case 'book': return 'bg-[#2F5D50] text-white';
        case 'wait': return 'bg-[#8C6D2E] text-white';
        case 'switch': return 'bg-[#3E5C76] text-white';
        case 'discard': return 'bg-[#8A3F3B] text-white';
        default: return 'bg-stone-500 text-white';
      }
    };

    const getConfidenceLabel = (confidence: number) => {
      if (confidence >= 0.7) return 'High';
      if (confidence >= 0.4) return 'Medium';
      return 'Low';
    };

    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar variant="transparent" />

        {/* Hero with safari imagery */}
        <ImageBand
          image={pageImages.decision}
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
                <Link href="/decisions" className="hover:text-white transition-colors">
                  Decisions
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white">Decision</span>
              </div>

              {/* Title */}
              <h1 className="font-editorial text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4">
                {topic.question}
              </h1>

              {/* Context */}
              <p className="text-white/80 text-lg max-w-xl mx-auto">
                {topic.context_line}
              </p>
            </div>
          </ImageBandContent>
        </ImageBand>

        {/* Main content */}
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">

          {/* Verdict Card */}
          <section className="mb-8">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className={`${getOutcomeColor(d.outcome)} px-3 py-1 rounded-lg text-sm font-medium capitalize`}>
                  {d.outcome}
                </span>
                <span className="text-sm text-stone-500">
                  Confidence: {getConfidenceLabel(d.confidence)}
                </span>
              </div>
              <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-3">
                {d.headline}
              </h2>
              <p className="font-editorial text-stone-600 leading-relaxed">
                {d.summary}
              </p>
            </div>
          </section>

          <SectionDivider />

          {/* Trade-offs */}
          <section className="my-8">
            <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-6">Trade-offs</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-stone-200 p-5">
                <h3 className="font-ui text-sm font-medium text-[#2F5D50] mb-3 uppercase tracking-wide">
                  Gains
                </h3>
                <ul className="space-y-2">
                  {d.tradeoffs.gains.map((gain, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#2F5D50] mt-0.5">+</span>
                      <span className="text-stone-700">{gain}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl border border-stone-200 p-5">
                <h3 className="font-ui text-sm font-medium text-[#8A3F3B] mb-3 uppercase tracking-wide">
                  Losses
                </h3>
                <ul className="space-y-2">
                  {d.tradeoffs.losses.map((loss, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#8A3F3B] mt-0.5">−</span>
                      <span className="text-stone-700">{loss}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <SectionDivider />

          {/* Assumptions */}
          <section className="my-8">
            <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-6">Assumptions</h2>
            <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100">
              {d.assumptions.map((assumption, i) => (
                <div key={i} className="p-5">
                  <p className="text-stone-900">{assumption.text}</p>
                  <p className="text-sm text-stone-500 mt-1">
                    Confidence: {Math.round(assumption.confidence * 100)}%
                  </p>
                </div>
              ))}
            </div>
          </section>

          <SectionDivider />

          {/* Change Conditions */}
          <section className="my-8">
            <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-6">When this changes</h2>
            <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100">
              {d.change_conditions.map((condition, i) => (
                <div key={i} className="p-5">
                  <p className="text-stone-700">{condition}</p>
                </div>
              ))}
            </div>
          </section>

          <SectionDivider />

          {/* Who this is for */}
          {(fitMisfit.rightFor.length > 0 || fitMisfit.notIdealFor.length > 0) && (
            <section className="my-8">
              <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-6">Who this is for</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {fitMisfit.rightFor.length > 0 && (
                  <div className="bg-white rounded-2xl border border-stone-200 p-5">
                    <h3 className="font-ui text-sm font-medium text-[#2F5D50] mb-3 uppercase tracking-wide">
                      Right for
                    </h3>
                    <ul className="space-y-2">
                      {fitMisfit.rightFor.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#2F5D50] mt-0.5">✓</span>
                          <span className="text-stone-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {fitMisfit.notIdealFor.length > 0 && (
                  <div className="bg-white rounded-2xl border border-stone-200 p-5">
                    <h3 className="font-ui text-sm font-medium text-stone-500 mb-3 uppercase tracking-wide">
                      Not ideal for
                    </h3>
                    <ul className="space-y-2">
                      {fitMisfit.notIdealFor.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-stone-400 mt-0.5">−</span>
                          <span className="text-stone-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Related Decisions */}
          {relatedTopics.length > 0 && (
            <>
              <SectionDivider />
              <section className="my-8">
                <h2 className="font-editorial text-2xl font-semibold text-stone-900 mb-6">Related decisions</h2>
                <div className="grid gap-3">
                  {relatedTopics.slice(0, 3).map((related) => (
                    <Link
                      key={related.topic_id}
                      href={`/decisions/${related.slug}`}
                      className="block bg-white rounded-xl border border-stone-200 p-4 hover:border-amber-300 hover:shadow-sm transition-all"
                    >
                      <p className="font-medium text-stone-900 group-hover:text-amber-700">
                        {related.question}
                      </p>
                      <p className="text-sm text-stone-500 mt-1">
                        {related.context_line}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* CTA */}
          <div className="mt-12 text-center">
            <div className="inline-block bg-white rounded-2xl border border-stone-200 p-8 max-w-lg">
              <h3 className="font-editorial text-xl font-semibold text-stone-900 mb-2">
                Need a personalized decision?
              </h3>
              <p className="text-stone-500 mb-6">
                Start planning your safari with inputs tailored to your travel dates and preferences.
              </p>
              <Link
                href="/inquire"
                className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors"
              >
                Start planning
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <Footer variant="decision-system" />
      </div>
    );
  }

  // Refusal state
  if (state === 'refusal' && decision?.output.refusal) {
    const refusal = decision.output.refusal;
    const isServiceDegraded = refusal.code === 'SERVICE_DEGRADED';

    // Handler for retry attempts (service-degraded only)
    const handleRetry = async () => {
      if (topic) {
        await fetchDecision(topic);
      }
    };

    return (
      <main className={pageContainer}>
        <h1 className="text-2xl font-semibold mb-2">{topic.question}</h1>
        <p className="text-gray-600 mb-8">{topic.context_line}</p>

        {/* Service-degraded refusals get special treatment */}
        {isServiceDegraded ? (
          <ServiceDegradedRefusal
            reason={refusal.reason}
            safeNextStep={refusal.safe_next_step}
            onRetry={handleRetry}
          />
        ) : (
          <>
            <VerdictCard
              outcome="refused"
              headline="Decision refused"
              summary={refusal.reason}
              confidence={0}
            />

            <section className={section} aria-labelledby="needs-heading">
              <h2 id="needs-heading" className={sectionHeading}>What we need</h2>
              <ul className={listContainer} aria-label="Required information">
                {refusal.missing_or_conflicting_inputs.map((input, i) => (
                  <li key={i} className={listItem}>
                    <span className={listBullet} aria-hidden="true">&bull;</span>
                    <span className={listText}>{input}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className={section} aria-labelledby="next-step-heading">
              <h2 id="next-step-heading" className={sectionHeading}>Next step</h2>
              <p className="text-gray-700">{refusal.safe_next_step}</p>
            </section>

            {/* Refusal Recovery Panel - staging only */}
            <RefusalRecoveryPanel refusalReason={refusal.reason} topic={topic} />

            <CTABar
              primary={{ label: 'Answer questions to get a recommendation', href: '/tools/safari-fit' }}
            />
          </>
        )}

        <RelatedDecisions topics={relatedTopics} />

        <footer className={footerStyles} aria-label="Reference information">
          <p>Decision ID: {decision.decision_id}</p>
        </footer>
      </main>
    );
  }

  // Success state
  if (state === 'success' && decision?.output.decision) {
    const d = decision.output.decision;
    const fitMisfit = deriveFitMisfitModel(topic, d.outcome);

    // Get versioned answer for structured data and attribution
    const answerVersion = getCurrentAnswer(topic.topic_id);
    const currentVersion = answerVersion?.version || 'v1.0';
    const issuedAt = answerVersion?.issuedAt || new Date().toISOString();

    // Derive primary condition from first assumption or change condition
    const primaryCondition = extractPrimaryCondition(d.assumptions, d.change_conditions);
    const invalidatingCondition = extractInvalidatingCondition(d.change_conditions);

    const canonicalUrl = `https://safariindex.com/decisions/${slug}`;
    const quotableVerdict = answerVersion?.quotableVerdict || d.summary;

    return (
      <>
        {/* Cinematic Hero - Documentary opening with verdict moment */}
        <ImageBand
          image={pageImages.decision}
          height="decision-hero"
          overlay="cinematic"
          align="center"
          priority
        >
          <ImageBandContent maxWidth="default">
            {/* Eyebrow label */}
            <span className="inline-block font-ui text-xs font-medium text-white/70 uppercase tracking-wider mb-3">
              Decision
            </span>

            {/* H1 Question - serif headline, short measure */}
            <h1 className="font-editorial text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-snug tracking-tight mb-3 max-w-[22ch]">
              {topic.question}
            </h1>

            {/* Context line - documentary framing */}
            <p className="font-editorial text-white/80 text-base md:text-lg leading-relaxed mb-6 max-w-xl">
              A decision with trade-offs. Read the conditions.
            </p>

            {/* Verdict Moment strip */}
            <VerdictMoment
              outcome={d.outcome}
              headline={d.headline}
              confidence={d.confidence}
              decisionId={decision.decision_id}
              logicVersion={decision.metadata.logic_version}
            />
          </ImageBandContent>
        </ImageBand>

        {/* Body - Warm safari background */}
        <main className={`${pageContainer} min-h-screen bg-gradient-to-b from-amber-50/30 via-stone-50 to-stone-100`}>
          {/* JSON-LD Structured Data for search engines and AI */}
          <StructuredData
            question={topic.question}
            answer={quotableVerdict}
            datePublished={issuedAt}
            dateModified={issuedAt}
            confidence={d.confidence}
            canonicalUrl={canonicalUrl}
            answerVersion={currentVersion}
          />

          {/* Input Readiness Panel - staging only */}
          <InputReadinessPanel topic={topic} />

          {/* Primary flow: VerdictCard → AnswerOwnershipBlock → Divider → DependsOnStrip */}
          <VerdictCard
            outcome={d.outcome}
            headline={d.headline}
            summary={d.summary}
            confidence={d.confidence}
          />

          {/* Answer Ownership Block - quotable verdict for citation */}
          <AnswerOwnershipBlock
            question={topic.question}
            outcome={d.outcome}
            headline={d.headline}
            summary={d.summary}
            confidence={d.confidence}
            primaryCondition={primaryCondition}
            invalidatingCondition={invalidatingCondition}
          />

          <SectionDivider />

          {/* What this depends on - key assumptions and change conditions */}
          <DependsOnStrip
            assumptions={d.assumptions}
            changeConditions={d.change_conditions}
          />

          <TradeoffLedger gains={d.tradeoffs.gains} losses={d.tradeoffs.losses} />

          <FitMisfitBlock rightFor={fitMisfit.rightFor} notIdealFor={fitMisfit.notIdealFor} />

          <AssumptionsBlock assumptions={d.assumptions} />

          <ChangeConditions conditions={d.change_conditions} />

          {/* Next Sensible Step - calm suggestion based on intent signals */}
          <NextSensibleStep
            decisionId={decision.decision_id}
            topicId={topic.topic_id}
            outcome={d.outcome}
            hasRelatedDecisions={relatedTopics.length > 0}
            assumptions={d.assumptions}
          />

          {/* Decision Follow-Up - opt-in notification for changes */}
          <DecisionFollowUp
            decisionId={decision.decision_id}
            topicId={topic.topic_id}
            currentLogicVersion={decision.metadata.logic_version}
            currentConfidence={d.confidence}
          />

          <CTABar primary={{ label: 'Check fit for your dates', href: '/tools/safari-fit' }} />

          <AssuranceCTA
            decisionId={decision.decision_id}
            outcome={d.outcome}
            confidence={d.confidence}
          />

          {/* Linked Trips - trips where this decision matters */}
          <LinkedTrips topicId={topic.topic_id} />

          {/* Trip Planning CTA - quiet link to inquiry system */}
          <TripPlanningCTA topicId={topic.topic_id} topicSlug={topic.slug} />

          <RelatedDecisions topics={relatedTopics} />

          {/* Attribution Footer - non-promotional */}
          <AttributionFooter
            decisionId={decision.decision_id}
            logicVersion={decision.metadata.logic_version}
            answerVersion={currentVersion}
            issuedAt={issuedAt}
          />
        </main>
      </>
    );
  }

  return null;
}
