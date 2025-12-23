'use client';

/**
 * Topic Improvements Dashboard
 *
 * INTERNAL: DEV-ONLY page for analyzing topic health and suggesting improvements.
 * Gate: Returns 404 in observation mode (production).
 * Must NEVER be exposed to production users.
 *
 * Classification: INTERNAL (gated forever)
 * Reason: Internal improvement tooling exposing diagnostic analysis.
 *
 * Shows:
 * - Per-topic refusal rates
 * - Deterministic improvement suggestions
 * - Export patch functionality
 */

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { isBuildMode } from '../../../lib/app-mode';
import { apiGet } from '../../../lib/api-client';
import { getPublishedTopics, type DecisionTopic } from '../../content/decision-topics';
import {
  type GlobalHealth,
  type ApiTopicCounter,
  formatPercent,
} from '../topic-health/health-types';
import {
  analyzeTopicForImprovements,
  generateTopicPatch,
  type TopicImprovementAnalysis,
  type ImprovementSuggestion,
  SEVERITY_STYLES,
} from '../../../lib/topic-improvement-rules';
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
import { Lightbulb, Download } from 'lucide-react';

type LoadState = 'loading' | 'success' | 'error';

/**
 * Severity badge component
 */
function SeverityBadge({ severity }: { severity: 'high' | 'medium' | 'low' }) {
  const styles = SEVERITY_STYLES[severity];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles.bg} ${styles.text}`}
    >
      {severity}
    </span>
  );
}

/**
 * Single suggestion row
 */
function SuggestionRow({ suggestion }: { suggestion: ImprovementSuggestion }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-gray-100 py-3 last:border-b-0">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <SeverityBadge severity={suggestion.severity} />
            <code className="text-xs text-gray-500">{suggestion.rule_id}</code>
          </div>
          <p className="text-sm text-gray-700">{suggestion.message}</p>
          <p className="text-xs text-gray-500 mt-1">
            Field: <code>{suggestion.field}</code>
          </p>
        </div>
        {(suggestion.suggested_additions || suggestion.suggested_changes) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-blue-600 hover:text-blue-800 ml-2"
          >
            {expanded ? 'Hide' : 'Show'} details
          </button>
        )}
      </div>
      {expanded && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono overflow-x-auto">
          <pre>
            {JSON.stringify(
              suggestion.suggested_additions || suggestion.suggested_changes,
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
}

/**
 * Topic improvement card
 */
function TopicImprovementCard({
  analysis,
  topic,
  onExport,
}: {
  analysis: TopicImprovementAnalysis;
  topic: DecisionTopic;
  onExport: (analysis: TopicImprovementAnalysis) => void;
}) {
  const hasIssues = analysis.suggestions.length > 0;
  const highCount = analysis.suggestions.filter((s) => s.severity === 'high').length;
  const mediumCount = analysis.suggestions.filter((s) => s.severity === 'medium').length;

  return (
    <Card className="mb-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <Heading3 className="mb-1">{topic.question}</Heading3>
          <Meta>
            {topic.topic_id} &bull; Refusal rate: {formatPercent(analysis.refusal_rate)}
          </Meta>
        </div>
        {hasIssues && (
          <button
            onClick={() => onExport(analysis)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors"
          >
            <Icon icon={Download} size="sm" color="secondary" aria-hidden />
            Export patch
          </button>
        )}
      </div>

      {hasIssues ? (
        <>
          <div className="flex gap-4 mb-4 text-sm">
            {highCount > 0 && (
              <span className="text-red-700">{highCount} high priority</span>
            )}
            {mediumCount > 0 && (
              <span className="text-yellow-700">{mediumCount} medium priority</span>
            )}
          </div>
          <div className="space-y-0">
            {analysis.suggestions.map((suggestion, i) => (
              <SuggestionRow key={i} suggestion={suggestion} />
            ))}
          </div>
        </>
      ) : (
        <Text variant="body" className="text-green-700">No improvements suggested.</Text>
      )}
    </Card>
  );
}

export default function TopicImprovementsPage() {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<LoadState>('loading');
  const [analyses, setAnalyses] = useState<TopicImprovementAnalysis[]>([]);
  const [topRefusalReasons, setTopRefusalReasons] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isAllowed = isBuildMode();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAllowed) {
      notFound();
    }
  }, [mounted, isAllowed]);

  useEffect(() => {
    if (!mounted || !isAllowed) return;

    async function fetchData() {
      const topics = getPublishedTopics();
      const topicMap = new Map<string, DecisionTopic>();
      topics.forEach((t) => topicMap.set(t.topic_id, t));

      // Fetch health data with topic breakdown
      const result = await apiGet<GlobalHealth>('/ops/health?topic_breakdown=true');

      if (result.success) {
        const countersMap = new Map<string, ApiTopicCounter>();
        if (result.data.topic_counters) {
          result.data.topic_counters.forEach((c) => countersMap.set(c.topic_id, c));
        }

        // Store top refusal reasons
        if (result.data.top_refusal_reasons) {
          setTopRefusalReasons(result.data.top_refusal_reasons);
        }

        // Analyze each topic
        const allAnalyses: TopicImprovementAnalysis[] = topics.map((topic) => {
          const counter = countersMap.get(topic.topic_id);
          const refusalRate = counter?.refusal_rate ?? null;
          return analyzeTopicForImprovements(
            topic,
            refusalRate,
            result.data.top_refusal_reasons || []
          );
        });

        // Sort by number of suggestions (most issues first)
        allAnalyses.sort((a, b) => b.suggestions.length - a.suggestions.length);

        setAnalyses(allAnalyses);
        setState('success');
      } else {
        // Still analyze topics even without API data
        const allAnalyses: TopicImprovementAnalysis[] = topics.map((topic) =>
          analyzeTopicForImprovements(topic, null, [])
        );
        allAnalyses.sort((a, b) => b.suggestions.length - a.suggestions.length);
        setAnalyses(allAnalyses);
        setError(result.error.message);
        setState('success'); // Show partial results
      }
    }

    fetchData();
  }, [mounted, isAllowed]);

  /**
   * Export patch to clipboard
   */
  const handleExport = async (analysis: TopicImprovementAnalysis) => {
    const patch = generateTopicPatch(analysis);
    const json = JSON.stringify(patch, null, 2);

    try {
      await navigator.clipboard.writeText(json);
      setCopiedId(analysis.topic_id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = json;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedId(analysis.topic_id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Show nothing until mounted
  if (!mounted || !isAllowed) {
    return null;
  }

  const topics = getPublishedTopics();
  const topicMap = new Map<string, DecisionTopic>();
  topics.forEach((t) => topicMap.set(t.topic_id, t));

  const totalSuggestions = analyses.reduce((sum, a) => sum + a.suggestions.length, 0);
  const highPriorityCount = analyses.reduce(
    (sum, a) => sum + a.suggestions.filter((s) => s.severity === 'high').length,
    0
  );

  // Determine status based on high priority count
  const metaStatus = highPriorityCount > 3
    ? 'critical'
    : highPriorityCount > 0
      ? 'watch'
      : 'healthy';

  // Build MetaRail content
  const metaRailContent = (
    <MetaRail
      status={metaStatus as 'healthy' | 'watch' | 'critical' | 'unknown'}
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
          <Icon icon={Lightbulb} size="lg" color="secondary" aria-hidden />
          <Heading1 className="text-neutral-900">Topic Improvements</Heading1>
        </div>
        <Text variant="meta" color="muted">
          Deterministic suggestions for improving topic definitions based on health metrics.
        </Text>
      </header>

      {/* Summary */}
      <Section className="mb-8">
        <Card>
          <Heading2 className="mb-4">Summary</Heading2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Meta className="mb-1">Topics analyzed</Meta>
              <Text variant="h4" className="text-neutral-900">{analyses.length}</Text>
            </div>
            <div>
              <Meta className="mb-1">Total suggestions</Meta>
              <Text variant="h4" className="text-neutral-900">{totalSuggestions}</Text>
            </div>
            <div>
              <Meta className="mb-1">High priority</Meta>
              <Text variant="h4" className="text-red-700">{highPriorityCount}</Text>
            </div>
            <div>
              <Meta className="mb-1">Topics with issues</Meta>
              <Text variant="h4" className="text-neutral-900">
                {analyses.filter((a) => a.suggestions.length > 0).length}
              </Text>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <Text variant="body" className="text-yellow-800">
                API data unavailable: {error}. Showing structural analysis only.
              </Text>
            </div>
          )}
        </Card>
      </Section>

      {/* Top refusal reasons */}
      {topRefusalReasons.length > 0 && (
        <Section className="mb-8">
          <Heading2 className="mb-4">Top Refusal Reasons</Heading2>
          <Card>
            <ul className="space-y-2">
              {topRefusalReasons.slice(0, 5).map((reason, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-neutral-400 mr-2">{i + 1}.</span>
                  <Text variant="body" color="secondary">{reason}</Text>
                </li>
              ))}
            </ul>
          </Card>
        </Section>
      )}

      {/* Topic analyses */}
      <Section className="mb-8">
        <Heading2 className="mb-4">Per-Topic Analysis</Heading2>
        {state === 'loading' ? (
          <Meta>Loading topic analysis...</Meta>
        ) : (
          <div>
            {analyses.map((analysis) => {
              const topic = topicMap.get(analysis.topic_id);
              if (!topic) return null;
              return (
                <div key={analysis.topic_id} className="relative">
                  {copiedId === analysis.topic_id && (
                    <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Copied!
                    </div>
                  )}
                  <TopicImprovementCard
                    analysis={analysis}
                    topic={topic}
                    onExport={handleExport}
                  />
                </div>
              );
            })}
          </div>
        )}
      </Section>

      {/* Footer - staging indicator */}
      <footer className="mt-16 pt-4 border-t border-neutral-200">
        <Meta>Staging only. Rules are deterministic, not AI-generated.</Meta>
      </footer>
    </PageGrid>
  );
}
