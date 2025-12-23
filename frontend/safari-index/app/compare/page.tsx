'use client';

/**
 * Compare Decisions Page
 *
 * Side-by-side decision comparison with warm safari aesthetic.
 */

import { useState, useCallback, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { isBuildMode } from '../../lib/app-mode';
import { getPublishedTopics, type DecisionTopic } from '../content/decision-topics';
import { buildRequestEnvelope } from '../../lib/page-assembly';
import { API_BASE } from '../../lib/api-client';
import { normalizeDecisionResponse, isContractError } from '../../lib/adapters';
import type { DecisionResponse } from '../../lib/contracts';
import { ComparePanel } from './ComparePanel';
import { DiffSummary } from './DiffSummary';
import { computeDiff, type DiffModel } from './compare-diff';
import { emptyPanel, type ComparePanel as PanelType } from './compare-types';
import { PageGrid } from '../components/layout';
import { MetaRail } from '../components/layout/MetaRail';
import { ArrowLeft, RefreshCw, Loader2, ArrowRight, Hash, Scale } from 'lucide-react';

const API_ENDPOINT = `${API_BASE}/decision/evaluate`;

/**
 * Topic selector dropdown
 */
function TopicSelector({
  label,
  id,
  topics,
  selectedId,
  onSelect,
  disabled,
}: {
  label: string;
  id: string;
  topics: DecisionTopic[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex-1">
      <label htmlFor={id} className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
        {label}
      </label>
      <select
        id={id}
        value={selectedId || ''}
        onChange={(e) => onSelect(e.target.value || null)}
        disabled={disabled}
        className="w-full px-4 py-3 text-base border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-stone-100 disabled:cursor-not-allowed shadow-sm"
      >
        <option value="">Select a decision...</option>
        {topics.map((topic) => (
          <option key={topic.topic_id} value={topic.topic_id}>
            {topic.question}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function ComparePage() {
  if (!isBuildMode()) {
    notFound();
  }

  const topics = getPublishedTopics();

  const [selectedA, setSelectedA] = useState<string | null>(null);
  const [selectedB, setSelectedB] = useState<string | null>(null);
  const [panelA, setPanelA] = useState<PanelType>(emptyPanel());
  const [panelB, setPanelB] = useState<PanelType>(emptyPanel());
  const [diffModel, setDiffModel] = useState<DiffModel | null>(null);
  const [hasCompared, setHasCompared] = useState(false);

  const fetchDecision = useCallback(
    async (
      topicId: string,
      setPanel: React.Dispatch<React.SetStateAction<PanelType>>
    ) => {
      const topic = topics.find((t) => t.topic_id === topicId);
      if (!topic) return;

      setPanel({
        topic,
        state: 'loading',
        response: null,
        error: null,
      });

      try {
        const request = buildRequestEnvelope(topic);
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

        if (data.output.type === 'refusal') {
          setPanel({
            topic,
            state: 'refusal',
            response: data,
            error: null,
          });
        } else if (data.output.decision) {
          setPanel({
            topic,
            state: 'success',
            response: data,
            error: null,
          });
        } else {
          setPanel({
            topic,
            state: 'error',
            response: null,
            error: 'Invalid response structure',
          });
        }
      } catch (err) {
        const errorMessage = isContractError(err)
          ? 'Decision service unavailable'
          : err instanceof Error
            ? err.message
            : 'Decision service unavailable';

        setPanel({
          topic,
          state: 'error',
          response: null,
          error: errorMessage,
        });
      }
    },
    [topics]
  );

  const handleCompare = useCallback(() => {
    if (!selectedA || !selectedB) return;
    setHasCompared(true);
    fetchDecision(selectedA, setPanelA);
    fetchDecision(selectedB, setPanelB);
  }, [selectedA, selectedB, fetchDecision]);

  const handleReset = () => {
    setSelectedA(null);
    setSelectedB(null);
    setPanelA(emptyPanel());
    setPanelB(emptyPanel());
    setDiffModel(null);
    setHasCompared(false);
  };

  useEffect(() => {
    if (
      panelA.state === 'success' &&
      panelB.state === 'success' &&
      panelA.response &&
      panelB.response &&
      panelA.topic &&
      panelB.topic
    ) {
      const diff = computeDiff(
        panelA.response,
        panelB.response,
        panelA.topic,
        panelB.topic
      );
      setDiffModel(diff);
    } else {
      setDiffModel(null);
    }
  }, [panelA, panelB]);

  const canCompare = selectedA && selectedB && selectedA !== selectedB;
  const isLoading = panelA.state === 'loading' || panelB.state === 'loading';

  const logicVersionA = panelA.response?.metadata.logic_version;
  const logicVersionB = panelB.response?.metadata.logic_version;
  const logicVersion = logicVersionA || logicVersionB || undefined;

  const metaRailContent = hasCompared ? (
    <MetaRail
      logicVersion={logicVersion}
      confidence={
        panelA.response?.output.decision?.confidence ||
        panelB.response?.output.decision?.confidence ||
        null
      }
    />
  ) : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-stone-50 to-stone-100">
      {/* Hero header */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white">
        <PageGrid maxWidth="wide" className="py-12 md:py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Safari Index
          </Link>

          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Scale className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="font-editorial text-3xl md:text-4xl font-semibold mb-2">
                Compare decisions
              </h1>
              <p className="text-stone-400 text-lg">
                View two decisions side by side to understand the trade-offs.
              </p>
            </div>
          </div>
        </PageGrid>
      </div>

      <PageGrid maxWidth="wide" metaRail={metaRailContent} className="py-8">
        {/* Selectors */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <TopicSelector
              id="decision-a"
              label="Decision A"
              topics={topics}
              selectedId={selectedA}
              onSelect={setSelectedA}
              disabled={isLoading}
            />
            <TopicSelector
              id="decision-b"
              label="Decision B"
              topics={topics}
              selectedId={selectedB}
              onSelect={setSelectedB}
              disabled={isLoading}
            />
          </div>

          {/* Warning if same selection */}
          {selectedA && selectedB && selectedA === selectedB && (
            <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-700">
                Select two different decisions to compare.
              </p>
            </div>
          )}

          {/* Compare button */}
          <div className="flex gap-3">
            <button
              onClick={handleCompare}
              disabled={!canCompare || isLoading}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-amber-600 rounded-xl hover:bg-amber-700 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Scale className="w-4 h-4" />
                  Compare
                </>
              )}
            </button>
            {hasCompared && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-stone-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Differences section */}
        {hasCompared && diffModel && (
          <div id="diff-summary" className="scroll-mt-4 mb-6">
            <DiffSummary
              diff={diffModel}
              labelA="A"
              labelB="B"
            />
          </div>
        )}

        {/* Mobile jump links */}
        {hasCompared && (panelA.state === 'success' || panelB.state === 'success') && (
          <nav
            className="lg:hidden mb-6 p-4 bg-white border border-stone-200 rounded-xl shadow-sm"
            aria-label="Quick navigation"
          >
            <div className="flex items-center gap-2 mb-3">
              <Hash className="w-4 h-4 text-stone-400" />
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Jump to</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="#panel-a"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
              >
                Decision A
                <ArrowRight className="w-3 h-3" />
              </a>
              <a
                href="#panel-b"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
              >
                Decision B
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </nav>
        )}

        {/* Comparison panels */}
        {hasCompared && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="compare-panels-grid">
            <div
              id="panel-a"
              className="bg-white p-5 border border-stone-200 rounded-xl shadow-sm scroll-mt-4"
            >
              <div className="md:hidden mb-4 pb-3 border-b border-stone-200">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                  Decision A
                </span>
              </div>
              <ComparePanel {...panelA} />
            </div>

            <div
              id="panel-b"
              className="bg-white p-5 border border-stone-200 rounded-xl shadow-sm scroll-mt-4"
            >
              <div className="md:hidden mb-4 pb-3 border-b border-stone-200">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                  Decision B
                </span>
              </div>
              <ComparePanel {...panelB} />
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-stone-200">
          <p className="text-sm text-stone-400">
            Staging preview. Not visible in production.
          </p>
        </footer>
      </PageGrid>
    </div>
  );
}
