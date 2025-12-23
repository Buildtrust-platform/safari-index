/**
 * DEV-ONLY Frontend Map Page
 *
 * Access: /dev/map
 * Gating: NODE_ENV !== 'production' OR ENABLE_DEV_PAGES=true
 *
 * Purpose: Lists all routes and what components they assemble
 * NOT linked from production UI, NOT indexed
 */

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPublishedTopics } from '../../content/decision-topics';

// Environment gating (same as /dev/components)
function isDevAccessAllowed(): boolean {
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }
  if (process.env.ENABLE_DEV_PAGES === 'true') {
    return true;
  }
  return false;
}

export const metadata: Metadata = {
  title: 'Frontend Map (DEV)',
  robots: 'noindex, nofollow',
};

export const dynamic = 'force-dynamic';

// Route definitions with component assembly
const routes = [
  {
    path: '/',
    name: 'Homepage',
    type: 'static',
    components: ['Hero section', 'Topic links'],
    indexed: true,
  },
  {
    path: '/decisions/[slug]',
    name: 'Decision Page',
    type: 'dynamic',
    components: [
      'StructuredData',
      'AnswerOwnershipBlock',
      'VerdictCard',
      'TradeoffLedger',
      'FitMisfitBlock',
      'AssumptionsBlock',
      'ChangeConditions',
      'NextSensibleStep',
      'DecisionFollowUp',
      'CTABar',
      'AssuranceCTA',
      'RelatedDecisions',
      'AttributionFooter',
    ],
    indexed: true,
    notes: 'Renders QualityGateFailure if quality gates fail',
  },
  {
    path: '/embed/decision/[id]',
    name: 'Decision Embed',
    type: 'dynamic',
    components: ['DecisionEmbed'],
    indexed: false,
    notes: 'Standalone widget for external embedding',
  },
  {
    path: '/assurance/[id]',
    name: 'Assurance View',
    type: 'dynamic',
    components: [
      'VerdictCard',
      'TradeoffLedger',
      'AssumptionsBlock',
      'ChangeConditions',
      'EmbedCodeGenerator',
    ],
    indexed: false,
    notes: 'Purchase-gated, shows immutable decision artifact',
  },
  {
    path: '/assurance/checkout',
    name: 'Assurance Checkout',
    type: 'static',
    components: ['Checkout form', 'Price display'],
    indexed: false,
  },
  {
    path: '/sitemap.xml',
    name: 'Sitemap',
    type: 'generated',
    components: [],
    indexed: true,
    notes: 'Auto-generated from published topics',
  },
  {
    path: '/dev/components',
    name: 'Component Preview',
    type: 'dev-only',
    components: ['All UI components with mock data'],
    indexed: false,
    notes: 'Gated by ENABLE_DEV_PAGES',
  },
  {
    path: '/dev/map',
    name: 'Frontend Map',
    type: 'dev-only',
    components: ['Route listing'],
    indexed: false,
    notes: 'This page',
  },
];

// API routes
const apiRoutes = [
  {
    path: '/api/answers',
    method: 'GET',
    description: 'Fetch decision by topic ID',
  },
  {
    path: '/api/events/embed',
    method: 'POST',
    description: 'Track embed view events',
  },
  {
    path: '/api/followup/subscribe',
    method: 'POST',
    description: 'Subscribe to decision updates',
  },
  {
    path: '/api/ops/health',
    method: 'GET',
    description: 'System health check',
  },
  {
    path: '/api/review-queue',
    method: 'GET/POST',
    description: 'Review queue management',
  },
];

export default function DevMapPage() {
  if (!isDevAccessAllowed()) {
    notFound();
  }

  const topics = getPublishedTopics();

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12 pb-8 border-b border-gray-200">
        <div className="bg-amber-50 border border-amber-200 rounded p-4 mb-6">
          <p className="text-sm text-amber-800">
            DEV-ONLY: This page is not accessible in production.
          </p>
        </div>
        <h1 className="text-3xl font-semibold text-gray-900">Frontend Map</h1>
        <p className="mt-2 text-gray-600">
          All routes and their component assembly.
        </p>
      </header>

      {/* Page Routes */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Page Routes</h2>
        <div className="space-y-6">
          {routes.map((route) => (
            <div
              key={route.path}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {route.path}
                  </code>
                  <span className="ml-3 text-gray-700 font-medium">{route.name}</span>
                </div>
                <div className="flex gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      route.type === 'static'
                        ? 'bg-green-100 text-green-800'
                        : route.type === 'dynamic'
                        ? 'bg-blue-100 text-blue-800'
                        : route.type === 'dev-only'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {route.type}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      route.indexed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {route.indexed ? 'indexed' : 'noindex'}
                  </span>
                </div>
              </div>
              {route.components.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Components
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {route.components.map((comp) => (
                      <span
                        key={comp}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {route.notes && (
                <p className="mt-2 text-sm text-gray-500 italic">{route.notes}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* API Routes */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">API Routes</h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Path</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Method</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {apiRoutes.map((route) => (
                <tr key={route.path}>
                  <td className="px-4 py-2">
                    <code className="text-xs font-mono bg-gray-100 px-1 py-0.5 rounded">
                      {route.path}
                    </code>
                  </td>
                  <td className="px-4 py-2 text-gray-600">{route.method}</td>
                  <td className="px-4 py-2 text-gray-600">{route.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Published Topics */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Published Decision Topics ({topics.length})
        </h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Slug</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Topic ID</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Destinations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topics.map((topic) => (
                <tr key={topic.topic_id}>
                  <td className="px-4 py-2">
                    <code className="text-xs font-mono bg-gray-100 px-1 py-0.5 rounded">
                      /decisions/{topic.slug}
                    </code>
                  </td>
                  <td className="px-4 py-2 text-gray-600 font-mono text-xs">
                    {topic.topic_id}
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {topic.destinations.join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Shared Libraries */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shared Libraries</h2>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
              lib/api-client.ts
            </code>
            <p className="mt-2 text-sm text-gray-600">
              Shared fetch with timeout, error normalization, typed results
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
              lib/metadata.ts
            </code>
            <p className="mt-2 text-sm text-gray-600">
              Canonical URL helpers, metadataBase, robots directives
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
              lib/page-assembly.ts
            </code>
            <p className="mt-2 text-sm text-gray-600">
              Topic to request envelope mapping, render model derivation
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
              lib/quality-gates.ts
            </code>
            <p className="mt-2 text-sm text-gray-600">
              Decision quality validation before rendering
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
              lib/answer-versions.ts
            </code>
            <p className="mt-2 text-sm text-gray-600">
              Versioned answer registry for structured data
            </p>
          </div>
        </div>
      </section>

      <footer className="mt-16 pt-8 border-t border-gray-200 text-sm text-gray-500">
        <p>DEV-ONLY route map. Not for production use.</p>
      </footer>
    </main>
  );
}
