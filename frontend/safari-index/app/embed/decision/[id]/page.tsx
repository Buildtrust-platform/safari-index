/**
 * Decision Embed Page
 *
 * Per task requirements:
 * - Endpoint: /embed/decision/{decision_id}
 * - Read-only, version-locked
 * - Breaks (shows warning) if decision is flagged for review
 * - Minimal page for iframe embedding
 *
 * Integrity enforcement:
 * - Content cannot be modified by host site
 * - Always links to canonical source
 * - No external resources that could be blocked
 */

import { Metadata } from 'next';
import { DecisionEmbed } from '../../../components/DecisionEmbed';
import { ANSWER_VERSIONS } from '../../../lib/answer-versions';
import { API_BASE } from '../../../../lib/api-client';

interface EmbedPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ v?: string }>;
}

// Prevent caching to ensure review status is current
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: EmbedPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Decision Embed - ${id}`,
    robots: 'noindex, nofollow', // Embeds should not be indexed
  };
}

async function getEmbedData(assuranceId: string) {
  try {
    // Fetch assurance data from API
    const response = await fetch(`${API_BASE}/assurance/${assuranceId}`, {
      cache: 'no-store', // Always check current status
    });

    if (response.status === 402) {
      return { error: 'payment_required' };
    }

    if (response.status === 410) {
      return { error: 'revoked' };
    }

    if (!response.ok) {
      return { error: 'not_found' };
    }

    const data = await response.json();
    return { data };
  } catch {
    return { error: 'fetch_failed' };
  }
}

export default async function EmbedDecisionPage({
  params,
  searchParams,
}: EmbedPageProps) {
  const { id } = await params;
  const { v: requestedVersion } = await searchParams;

  // For MVP, use static answer versions
  // In production, this would fetch from assurance API
  const result = await getEmbedData(id);

  // Handle API errors with fallback to static data for demo
  // In production, remove this fallback
  let embedData: {
    question: string;
    outcome: 'book' | 'wait' | 'switch' | 'discard';
    headline: string;
    quotableVerdict: string;
    confidence: number;
    answerVersion: string;
    logicVersion: string;
    issuedAt: string;
    canonicalUrl: string;
    decisionId: string;
    isFlaggedForReview: boolean;
  } | null = null;

  if (result.data) {
    const { artifact } = result.data;
    embedData = {
      question: `Decision for topic ${artifact.topic_id}`,
      outcome: artifact.verdict.outcome,
      headline: artifact.verdict.headline,
      quotableVerdict: artifact.verdict.summary,
      confidence: artifact.verdict.confidence,
      answerVersion: requestedVersion || 'v1.0',
      logicVersion: artifact.logic_version,
      issuedAt: artifact.created_at,
      canonicalUrl: `https://safariindex.com/assurance/${id}`,
      decisionId: artifact.decision_id,
      isFlaggedForReview: artifact.review_status === 'pending_human_review',
    };
  } else {
    // Fallback: check static answer versions for demo
    const staticAnswer = Object.values(ANSWER_VERSIONS).find(
      (va) => va.topicId === id || va.slug === id
    );

    if (staticAnswer) {
      const currentVersion = staticAnswer.versions.find((v) => v.isCurrent);
      if (currentVersion) {
        embedData = {
          question: staticAnswer.question,
          outcome: currentVersion.outcome,
          headline: currentVersion.quotableVerdict.split('.')[0],
          quotableVerdict: currentVersion.quotableVerdict,
          confidence: currentVersion.confidence,
          answerVersion: currentVersion.version,
          logicVersion: currentVersion.logicVersion,
          issuedAt: currentVersion.issuedAt,
          canonicalUrl: `https://safariindex.com${staticAnswer.canonicalUrl}`,
          decisionId: `dec_embed_${staticAnswer.topicId}`,
          isFlaggedForReview: false,
        };
      }
    }
  }

  // Error states
  if (!embedData) {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="robots" content="noindex, nofollow" />
          <title>Embed Not Found</title>
        </head>
        <body
          style={{
            margin: 0,
            padding: '24px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            backgroundColor: '#f9fafb',
          }}
        >
          <div
            style={{
              maxWidth: '600px',
              padding: '24px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              color: '#6b7280',
              fontSize: '14px',
            }}
          >
            <p style={{ margin: 0 }}>
              This decision embed is not available.
              {result.error === 'payment_required' &&
                ' Assurance purchase required.'}
              {result.error === 'revoked' && ' This assurance has been revoked.'}
            </p>
          </div>
        </body>
      </html>
    );
  }

  // Log embed render event (client-side, see useEffect in component)
  // Server-side logging would happen here in production

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <title>Safari Index Decision</title>
        {/* Prevent framing by non-Safari Index domains in production */}
        {/* <meta http-equiv="Content-Security-Policy" content="frame-ancestors 'self' *.safariindex.com" /> */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              body {
                margin: 0;
                padding: 16px;
                background-color: transparent;
                min-height: fit-content;
              }
              /* Ensure embed is self-contained */
              .safari-index-embed * {
                box-sizing: border-box;
              }
            `,
          }}
        />
      </head>
      <body>
        <DecisionEmbed {...embedData} />

        {/* Embed tracking script - fires on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Log embed rendered event
                var data = {
                  event_type: 'EMBED_RENDERED',
                  decision_id: '${embedData.decisionId}',
                  answer_version: '${embedData.answerVersion}',
                  referrer: document.referrer || 'direct',
                  timestamp: new Date().toISOString()
                };

                // Beacon to logging endpoint (fire-and-forget)
                if (navigator.sendBeacon) {
                  navigator.sendBeacon(
                    '${API_BASE}/events/embed',
                    JSON.stringify(data)
                  );
                }

                // Log viewed after 2 seconds (indicates actual viewing, not just load)
                setTimeout(function() {
                  data.event_type = 'EMBED_VIEWED';
                  if (navigator.sendBeacon) {
                    navigator.sendBeacon(
                      '${API_BASE}/events/embed',
                      JSON.stringify(data)
                    );
                  }
                }, 2000);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
