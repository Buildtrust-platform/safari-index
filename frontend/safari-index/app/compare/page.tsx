'use client';

/**
 * Compare Decisions Page
 *
 * Side-by-side decision comparison with premium safari aesthetic.
 * Uses ImageBand hero for immersive safari feel.
 */

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { getPublishedTopics, type DecisionTopic } from '../content/decision-topics';
import { buildRequestEnvelope } from '../../lib/page-assembly';
import { API_BASE } from '../../lib/api-client';
import { normalizeDecisionResponse, isContractError } from '../../lib/adapters';
import type { DecisionResponse } from '../../lib/contracts';
import { ComparePanel } from './ComparePanel';
import { DiffSummary } from './DiffSummary';
import { computeDiff, type DiffModel } from './compare-diff';
import { emptyPanel, type ComparePanel as PanelType } from './compare-types';
import { ImageBand, ImageBandContent, pageImages } from '../components/visual';
import { Navbar } from '../components/layout';
import { MetaRail } from '../components/layout/MetaRail';
import { ChevronRight, RefreshCw, Loader2, ArrowRight, Hash, Scale } from 'lucide-react';

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
  // PRODUCTION-SAFE: Read-only comparison tool, no internal diagnostics
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
    <main className="min-h-screen bg-stone-50">
      {/* Navbar */}
      <Navbar variant="transparent" />

      {/* Hero with safari imagery */}
      <ImageBand
        image={pageImages.compare}
        height="compare"
        overlay="strong"
        align="center"
        priority
        alwaysRender
      >
        <ImageBandContent maxWidth="wide" className="pt-24 pb-8">
          <div className="text-center">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-white/60 text-sm mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                Safari Index
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">Compare</span>
            </div>

            {/* Icon + Title */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Scale className="w-6 h-6 text-amber-400" />
              </div>
              <h1 className="font-editorial text-4xl md:text-5xl font-semibold text-white">
                Compare decisions
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              View two decisions side by side to understand the trade-offs.
            </p>
          </div>
        </ImageBandContent>
      </ImageBand>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
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
              className="bg-white p-5 border border-stone-200 rounded-2xl shadow-sm scroll-mt-4"
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
              className="bg-white p-5 border border-stone-200 rounded-2xl shadow-sm scroll-mt-4"
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
      </div>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="font-editorial text-lg font-semibold">Safari Index</span>
              <span className="text-stone-500 text-sm ml-2">Pan-African Decision System</span>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/" className="text-sm text-stone-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/decisions" className="text-sm text-stone-400 hover:text-white transition-colors">
                All Decisions
              </Link>
              <Link href="/explore" className="text-sm text-stone-400 hover:text-white transition-colors">
                Explore
              </Link>
              <Link href="/how-it-works" className="text-sm text-stone-400 hover:text-white transition-colors">
                How it works
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
