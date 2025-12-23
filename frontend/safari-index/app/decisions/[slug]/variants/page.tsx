'use client';

/**
 * Decision Variants Page
 *
 * INTERNAL: Staging-only page for testing how different assumptions change outcomes.
 * Returns 404 in observation mode (production).
 * Must NEVER be exposed to production users.
 *
 * Classification: INTERNAL (gated forever)
 * Reason: Exposes internal parameterization and assumption testing.
 *
 * Per task requirements:
 * - Gated by APP_MODE
 * - Base decision at top
 * - Assumption toggles below
 * - Variant results as cards
 * - noindex, nofollow metadata
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, notFound } from 'next/navigation';
import { isBuildMode } from '../../../../lib/app-mode';
import { getTopicBySlug, type DecisionTopic } from '../../../content/decision-topics';
import {
  buildRequestEnvelope,
  type StandardInputEnvelope,
} from '../../../../lib/page-assembly';
import { API_BASE } from '../../../../lib/api-client';
import { normalizeDecisionResponse, isContractError } from '../../../../lib/adapters';
import type { DecisionResponse } from '../../../../lib/contracts';
import { VariantForm } from './VariantForm';
import { VariantCard } from './VariantCard';
import {
  type VariantFormState,
  type VariantResult,
  DEFAULT_VARIANT_FORM,
  generateVariantLabel,
  groupToTravelerType,
} from './variant-types';
import { VerdictCard } from '../../../components/VerdictCard';
import { SkeletonVerdictCard } from '../../../ui/Skeleton';
import {
  Heading1,
  Heading2,
  Text,
  Meta,
  Section,
  Warning,
  Icon,
} from '../../../components/ui';
import { PageGrid } from '../../../components/layout';
import { MetaRail } from '../../../components/layout/MetaRail';
import { GitBranch, FlaskConical } from 'lucide-react';

const API_ENDPOINT = `${API_BASE}/decision/evaluate`;

type BaseState = 'loading' | 'success' | 'refusal' | 'error';

/**
 * Build envelope with variant overrides
 */
function buildVariantEnvelope(
  topic: DecisionTopic,
  form: VariantFormState,
  variantId: string
): StandardInputEnvelope {
  const base = buildRequestEnvelope(topic);

  // Map form state to envelope fields
  return {
    ...base,
    tracking: {
      ...base.tracking,
      session_id: `sess_variant_${topic.topic_id}_${variantId}`,
    },
    user_context: {
      ...base.user_context,
      traveler_type: groupToTravelerType(form.groupComposition, form.travelStyle),
      budget_band: form.budgetTier,
      pace_preference:
        form.comfortTolerance === 'low'
          ? 'relaxed'
          : form.comfortTolerance === 'high'
            ? 'active'
            : 'balanced',
      risk_tolerance: form.riskTolerance,
      dates:
        form.dateFlexibility === 'fixed'
          ? { type: 'fixed', month: topic.time_context?.month, year: 2026 }
          : { type: 'flexible' },
      group_size:
        form.groupComposition === 'solo'
          ? 1
          : form.groupComposition === 'couple'
            ? 2
            : form.groupComposition === 'family'
              ? 4
              : 3,
    },
    request: {
      ...base.request,
      constraints: {
        crowd_tolerance: form.crowdTolerance,
        comfort_tolerance: form.comfortTolerance,
        time_available: form.timeAvailable,
      },
    },
  };
}

/**
 * Derive what changed the outcome
 */
function deriveChangeReason(
  baseDecision: DecisionResponse['output']['decision'],
  variantDecision: DecisionResponse['output']['decision']
): string | null {
  if (!baseDecision || !variantDecision) return null;
  if (baseDecision.outcome === variantDecision.outcome) return null;

  // Use the first change condition or tradeoff that differs
  const variantConditions = variantDecision.change_conditions;
  const variantLosses = variantDecision.tradeoffs.losses;

  // Prefer a change condition
  if (variantConditions.length > 0) {
    return variantConditions[0];
  }

  // Fall back to a loss
  if (variantLosses.length > 0) {
    return `Trade-off: ${variantLosses[0]}`;
  }

  return 'Assumptions shifted the decision threshold';
}

export default function VariantsPage() {
  // Gate: 404 in observation mode
  if (!isBuildMode()) {
    notFound();
  }

  const params = useParams();
  const slug = params?.slug as string;

  // Topic
  const [topic, setTopic] = useState<DecisionTopic | null>(null);

  // Base decision state
  const [baseState, setBaseState] = useState<BaseState>('loading');
  const [baseResponse, setBaseResponse] = useState<DecisionResponse | null>(null);
  const [baseError, setBaseError] = useState<string | null>(null);

  // Variant form
  const [form, setForm] = useState<VariantFormState>(DEFAULT_VARIANT_FORM);

  // Variant results
  const [variants, setVariants] = useState<VariantResult[]>([]);

  // Load topic and base decision
  useEffect(() => {
    const foundTopic = getTopicBySlug(slug);
    if (!foundTopic || !foundTopic.published) {
      return;
    }

    setTopic(foundTopic);

    async function fetchBase() {
      try {
        const request = buildRequestEnvelope(foundTopic!);
        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        });

        if (!response.ok) {
          throw new Error(`Service responded with ${response.status}`);
        }

        const rawData = await response.json();
        const data: DecisionResponse = normalizeDecisionResponse(rawData);
        setBaseResponse(data);

        if (data.output.type === 'refusal') {
          setBaseState('refusal');
        } else if (data.output.decision) {
          setBaseState('success');
        } else {
          setBaseState('error');
          setBaseError('Invalid response structure');
        }
      } catch (err) {
        const errorMessage = isContractError(err)
          ? 'Decision service unavailable'
          : err instanceof Error
            ? err.message
            : 'Decision service unavailable';
        setBaseError(errorMessage);
        setBaseState('error');
      }
    }

    fetchBase();
  }, [slug]);

  // Check if form differs from default
  const hasChanges =
    JSON.stringify(form) !== JSON.stringify(DEFAULT_VARIANT_FORM);

  // Run variant
  const runVariant = useCallback(async () => {
    if (!topic) return;

    const variantId = `v_${Date.now()}`;
    const label = generateVariantLabel(form, DEFAULT_VARIANT_FORM);

    // Dev-only analytics (staging only)
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Variant] VARIANT_RUN:', {
        topicId: topic.topic_id,
        variantId,
        changes: label,
        timestamp: new Date().toISOString(),
      });
    }

    // Add pending variant
    const newVariant: VariantResult = {
      id: variantId,
      label,
      formState: { ...form },
      state: 'loading',
      response: null,
      error: null,
      outcomeChanged: false,
      changeReason: null,
    };
    setVariants((prev) => [newVariant, ...prev]);

    try {
      const request = buildVariantEnvelope(topic, form, variantId);
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Service responded with ${response.status}`);
      }

      const rawData = await response.json();
      const data: DecisionResponse = normalizeDecisionResponse(rawData);

      // Determine if outcome changed vs base
      const baseOutcome = baseResponse?.output.decision?.outcome;
      const variantOutcome = data.output.decision?.outcome;
      const outcomeChanged = !!baseOutcome && !!variantOutcome && baseOutcome !== variantOutcome;

      const changeReason = outcomeChanged
        ? deriveChangeReason(baseResponse?.output.decision, data.output.decision)
        : null;

      setVariants((prev) =>
        prev.map((v) =>
          v.id === variantId
            ? {
                ...v,
                state: data.output.type === 'refusal' ? 'refusal' : 'success',
                response: data,
                outcomeChanged,
                changeReason,
              }
            : v
        )
      );
    } catch (err) {
      const errorMessage = isContractError(err)
        ? 'Decision service unavailable'
        : err instanceof Error
          ? err.message
          : 'Unknown error';

      setVariants((prev) =>
        prev.map((v) =>
          v.id === variantId
            ? { ...v, state: 'error', error: errorMessage }
            : v
        )
      );
    }
  }, [topic, form, baseResponse]);

  // Reset form
  const resetForm = () => {
    setForm(DEFAULT_VARIANT_FORM);
  };

  // Check if any variant is loading
  const isLoading = variants.some((v) => v.state === 'loading');

  // Topic not found
  if (!topic && baseState !== 'loading') {
    notFound();
  }

  // Base outcome for comparison
  const baseOutcome = baseResponse?.output.decision?.outcome || null;

  // Build MetaRail content
  const metaRailContent = baseResponse ? (
    <MetaRail
      logicVersion={baseResponse.metadata.logic_version}
      confidence={baseResponse.output.decision?.confidence || null}
      decisionId={baseResponse.decision_id}
    />
  ) : undefined;

  return (
    <PageGrid maxWidth="default" metaRail={metaRailContent}>
      {/* noindex metadata - handled via next/head or metadata export */}
      <meta name="robots" content="noindex, nofollow" />

      {/* Header - calm */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Icon icon={GitBranch} size="lg" color="secondary" aria-hidden />
          <Heading1 className="text-neutral-900">Decision variants</Heading1>
        </div>
        {topic && (
          <Text variant="body" color="secondary" className="mb-2">
            {topic.question}
          </Text>
        )}
        <Text variant="meta" color="muted">
          Test how different assumptions change the outcome.
        </Text>
      </header>

      {/* Base decision */}
      <Section className="mb-8">
        <Heading2 className="mb-4">Base decision</Heading2>

        {baseState === 'loading' && <SkeletonVerdictCard />}

        {baseState === 'error' && (
          <Warning role="alert">
            <Text variant="body" color="primary" className="mb-1">
              Unable to load base decision.
            </Text>
            <Text variant="meta" color="muted">{baseError}</Text>
          </Warning>
        )}

        {baseState === 'refusal' && baseResponse?.output.refusal && (
          <VerdictCard
            outcome="refused"
            headline="Decision refused"
            summary={baseResponse.output.refusal.reason}
            confidence={0}
          />
        )}

        {baseState === 'success' && baseResponse?.output.decision && (
          <VerdictCard
            outcome={baseResponse.output.decision.outcome}
            headline={baseResponse.output.decision.headline}
            summary={baseResponse.output.decision.summary}
            confidence={baseResponse.output.decision.confidence}
          />
        )}
      </Section>

      {/* Variant form */}
      <Section className="mb-8">
        <VariantForm
          form={form}
          onChange={setForm}
          onRun={runVariant}
          onReset={resetForm}
          isLoading={isLoading}
          hasChanges={hasChanges}
        />
      </Section>

      {/* Variant results */}
      {variants.length > 0 && (
        <Section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Icon icon={FlaskConical} size="md" color="secondary" aria-hidden />
            <Heading2>Variants ({variants.length})</Heading2>
          </div>
          <div className="space-y-4">
            {variants.map((variant) => (
              <VariantCard
                key={variant.id}
                label={variant.label}
                state={variant.state}
                response={variant.response}
                error={variant.error}
                outcomeChanged={variant.outcomeChanged}
                changeReason={variant.changeReason}
                baseOutcome={baseOutcome}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Footer - staging indicator */}
      <footer className="mt-16 pt-4 border-t border-neutral-200">
        <Meta>Staging only. This page is not indexed or visible in production.</Meta>
      </footer>
    </PageGrid>
  );
}
