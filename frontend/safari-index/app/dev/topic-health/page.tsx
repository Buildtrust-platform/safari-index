'use client';

/**
 * Topic Health Dashboard
 *
 * DEV-ONLY page for monitoring decision health per topic.
 * Gate: Returns 404 in observation mode (production).
 * Not indexed, not in sitemap.
 *
 * Shows:
 * - Global health status from /ops/health
 * - Per-topic metrics (n/a if not available from API)
 * - Refusal rate and status badges
 * - Quick links to staging pages
 */

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { isBuildMode } from '../../../lib/app-mode';
import { apiGet } from '../../../lib/api-client';
import { getPublishedTopics, type DecisionTopic } from '../../content/decision-topics';
import {
  type GlobalHealth,
  type TopicHealthRow,
  type HealthStatus,
  type ApiTopicCounter,
  calculateRefusalRate,
  getStatusFromRefusalRate,
  STATUS_STYLES,
  formatPercent,
  formatCount,
} from './health-types';
import {
  Heading1,
  Heading2,
  Heading3,
  Text,
  Meta,
  Section,
  Card,
  Warning,
  Icon,
} from '../../components/ui';
import { PageGrid } from '../../components/layout';
import { MetaRail } from '../../components/layout/MetaRail';
import { Activity, Link2 } from 'lucide-react';

type LoadState = 'loading' | 'success' | 'error';

/**
 * Status badge component
 */
function StatusBadge({ status }: { status: HealthStatus }) {
  const styles = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles.bg} ${styles.text}`}
    >
      {status}
    </span>
  );
}

/**
 * Global health card
 */
function GlobalHealthCard({
  health,
  error,
  state,
}: {
  health: GlobalHealth | null;
  error: string | null;
  state: LoadState;
}) {
  if (state === 'loading') {
    return (
      <Card>
        <Text variant="body" color="muted">Loading global health...</Text>
      </Card>
    );
  }

  if (state === 'error' || !health) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
        <Text variant="body" className="text-red-700 font-medium mb-1">Failed to load /ops/health</Text>
        <Text variant="meta" className="text-red-600">{error || 'Unknown error'}</Text>
      </div>
    );
  }

  const globalRefusalRate = calculateRefusalRate(
    health.counters.decisions_issued,
    health.counters.decisions_refused
  );

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <Heading3>Global Health</Heading3>
        <StatusBadge status={health.status === 'healthy' ? 'healthy' : health.status === 'degraded' ? 'watch' : 'critical'} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <Metric label="Decisions issued" value={formatCount(health.counters.decisions_issued)} />
        <Metric label="Decisions refused" value={formatCount(health.counters.decisions_refused)} />
        <Metric label="Decisions failed" value={formatCount(health.counters.decisions_failed)} />
        <Metric label="Refusal rate" value={formatPercent(globalRefusalRate)} />
      </div>

      <div className="text-xs text-neutral-500 pt-3 border-t border-neutral-200">
        <span>Logic version: {health.logic_version}</span>
        <span className="mx-2">|</span>
        <span>Window: {health.counters.window_age_seconds}s</span>
        {health.guardrails.bedrock_circuit_open && (
          <>
            <span className="mx-2">|</span>
            <span className="text-red-600">Bedrock circuit OPEN</span>
          </>
        )}
      </div>
    </Card>
  );
}

/**
 * Metric display
 */
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-medium text-gray-900">{value}</p>
    </div>
  );
}

/**
 * Topic health table
 */
function TopicHealthTable({ topics }: { topics: TopicHealthRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Topic
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Issued
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Refused
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Clarifications
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              QG Failed
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Refusal Rate
            </th>
            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Links
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {topics.map((topic) => (
            <tr key={topic.topic_id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{topic.title}</p>
                  <p className="text-xs text-gray-500">{topic.topic_id}</p>
                </div>
              </td>
              <td className="px-4 py-3 text-right text-sm text-gray-600">
                {formatCount(topic.metrics.decisions_issued)}
              </td>
              <td className="px-4 py-3 text-right text-sm text-gray-600">
                {formatCount(topic.metrics.decisions_refused)}
              </td>
              <td className="px-4 py-3 text-right text-sm text-gray-600">
                {formatCount(topic.metrics.clarifications)}
              </td>
              <td className="px-4 py-3 text-right text-sm text-gray-600">
                {formatCount(topic.metrics.quality_gate_failed)}
              </td>
              <td className="px-4 py-3 text-right text-sm text-gray-600">
                {formatPercent(topic.refusal_rate)}
              </td>
              <td className="px-4 py-3 text-center">
                <StatusBadge status={topic.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/decisions/${topic.slug}`}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    View
                  </Link>
                  <Link
                    href={`/decisions/${topic.slug}/variants`}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Variants
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Refusal reasons section
 */
function RefusalReasonsSection({ reasons }: { reasons: string[] | null }) {
  if (!reasons || reasons.length === 0) {
    return (
      <Card>
        <Heading3 className="mb-3">Top Refusal Reasons</Heading3>
        <Meta>n/a - Per-reason breakdown not available from /ops/health</Meta>
      </Card>
    );
  }

  return (
    <Card>
      <Heading3 className="mb-3">Top Refusal Reasons</Heading3>
      <ul className="space-y-2">
        {reasons.map((reason, i) => (
          <li key={i} className="flex items-start">
            <span className="text-neutral-400 mr-2">{i + 1}.</span>
            <Text variant="body" color="secondary">{reason}</Text>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/**
 * Quick links section
 */
function QuickLinksSection() {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Icon icon={Link2} size="md" color="secondary" aria-hidden />
        <Heading3>Quick Links</Heading3>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors"
        >
          Explore Topics
        </Link>
        <Link
          href="/compare"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors"
        >
          Compare Decisions
        </Link>
        <Link
          href="/dev/components"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors"
        >
          Component Preview
        </Link>
        <Link
          href="/dev/map"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors"
        >
          Decision Map
        </Link>
      </div>
    </Card>
  );
}

export default function TopicHealthPage() {
  // Use mounted state to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<LoadState>('loading');
  const [globalHealth, setGlobalHealth] = useState<GlobalHealth | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [topicRows, setTopicRows] = useState<TopicHealthRow[]>([]);

  // Track if breakdown was skipped
  const [breakdownSkipped, setBreakdownSkipped] = useState(false);
  const [breakdownReason, setBreakdownReason] = useState<string | null>(null);

  // Gate: 404 in observation mode (must be after hooks)
  const isAllowed = isBuildMode();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Gate check - redirect if not allowed (only after mount)
    if (mounted && !isAllowed) {
      notFound();
    }
  }, [mounted, isAllowed]);

  useEffect(() => {
    if (!mounted) return;
    if (!isAllowed) return;

    async function fetchHealth() {
      // Build topic rows from registry (defaults)
      const topics = getPublishedTopics();
      const topicMap = new Map<string, DecisionTopic>();
      topics.forEach((t: DecisionTopic) => topicMap.set(t.topic_id, t));

      // Fetch global health WITH topic breakdown
      const result = await apiGet<GlobalHealth>('/ops/health?topic_breakdown=true');

      if (result.success) {
        setGlobalHealth(result.data);

        // Check if breakdown was skipped
        if (result.data.topic_breakdown_skipped) {
          setBreakdownSkipped(true);
          setBreakdownReason(result.data.topic_breakdown_reason || null);
        }

        // Build rows from API data if available
        if (result.data.topic_counters && result.data.topic_counters.length > 0) {
          const rows: TopicHealthRow[] = result.data.topic_counters.map((counter: ApiTopicCounter) => {
            const topic = topicMap.get(counter.topic_id);
            return {
              topic_id: counter.topic_id,
              title: topic?.question || counter.topic_id,
              slug: topic?.slug || counter.topic_id,
              metrics: {
                decisions_issued: counter.issued,
                decisions_refused: counter.refused,
                clarifications: counter.clarifications,
                quality_gate_failed: counter.quality_gate_failed,
              },
              refusal_rate: counter.refusal_rate,
              status: getStatusFromRefusalRate(counter.refusal_rate),
            };
          });
          setTopicRows(rows);
        } else {
          // Fallback: show structure with n/a
          const rows: TopicHealthRow[] = topics.map((topic: DecisionTopic) => ({
            topic_id: topic.topic_id,
            title: topic.question,
            slug: topic.slug,
            metrics: {
              decisions_issued: null,
              decisions_refused: null,
              clarifications: null,
              quality_gate_failed: null,
            },
            refusal_rate: null,
            status: 'unknown' as HealthStatus,
          }));
          setTopicRows(rows);
        }

        setState('success');
      } else {
        setError(result.error.message);
        setState('error');

        // Still show structure with n/a on error
        const rows: TopicHealthRow[] = topics.map((topic: DecisionTopic) => ({
          topic_id: topic.topic_id,
          title: topic.question,
          slug: topic.slug,
          metrics: {
            decisions_issued: null,
            decisions_refused: null,
            clarifications: null,
            quality_gate_failed: null,
          },
          refusal_rate: null,
          status: 'unknown' as HealthStatus,
        }));
        setTopicRows(rows);
      }
    }

    fetchHealth();
  }, [mounted, isAllowed]);

  // Show nothing until mounted and access checked
  // This prevents hydration mismatch between server and client
  if (!mounted || !isAllowed) {
    return null;
  }

  // Derive health status for MetaRail
  const healthStatus = globalHealth?.status === 'healthy'
    ? 'healthy'
    : globalHealth?.status === 'degraded'
      ? 'watch'
      : globalHealth?.status === 'critical'
        ? 'critical'
        : 'unknown';

  // Build MetaRail content
  const metaRailContent = (
    <MetaRail
      logicVersion={globalHealth?.logic_version}
      status={healthStatus as 'healthy' | 'watch' | 'critical' | 'unknown'}
    />
  );

  return (
    <PageGrid maxWidth="default" metaRail={metaRailContent}>
      {/* noindex metadata */}
      <meta name="robots" content="noindex, nofollow" />

      {/* Header - calm */}
      <header className="mb-10">
        <Warning className="mb-6">
          <Text variant="body" className="text-amber-800">
            DEV-ONLY: This page is not accessible in production.
          </Text>
        </Warning>
        <div className="flex items-center gap-3 mb-2">
          <Icon icon={Activity} size="lg" color="secondary" aria-hidden />
          <Heading1 className="text-neutral-900">Topic Health Dashboard</Heading1>
        </div>
        <Text variant="meta" color="muted">
          Monitor decision health across topics. Last 7 days window.
        </Text>
      </header>

      {/* Global Health */}
      <Section className="mb-8">
        <GlobalHealthCard health={globalHealth} error={error} state={state} />
      </Section>

      {/* Per-topic breakdown */}
      <Section className="mb-8">
        <Heading2 className="mb-4">Per-Topic Breakdown</Heading2>
        {state === 'loading' ? (
          <Meta className="mb-4">Loading per-topic metrics...</Meta>
        ) : breakdownSkipped ? (
          <Meta className="mb-4">
            Breakdown skipped: {breakdownReason || 'unknown reason'}. Showing structure only.
          </Meta>
        ) : topicRows.some((r) => r.metrics.decisions_issued !== null) ? (
          <Meta className="mb-4">
            Metrics from last 7 days via /ops/health?topic_breakdown=true
          </Meta>
        ) : (
          <Meta className="mb-4">
            No per-topic data available. Showing structure only.
          </Meta>
        )}
        <TopicHealthTable topics={topicRows} />
      </Section>

      {/* Refusal reasons */}
      <Section className="mb-8">
        <RefusalReasonsSection reasons={globalHealth?.top_refusal_reasons || null} />
      </Section>

      {/* Quick links */}
      <Section className="mb-8">
        <QuickLinksSection />
      </Section>

      {/* Footer - staging indicator */}
      <footer className="mt-16 pt-4 border-t border-neutral-200">
        <Meta>Staging only. Thresholds: healthy (&lt;30%), watch (30-50%), critical (&gt;50%).</Meta>
      </footer>
    </PageGrid>
  );
}
