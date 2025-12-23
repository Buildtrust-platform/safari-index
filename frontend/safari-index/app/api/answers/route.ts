/**
 * /answers API Endpoint (Read-Only)
 *
 * Per task requirements:
 * - Returns list of answer blocks for AI ingestion and programmatic reuse
 * - No UI required
 * - Intended for: AI ingestion, programmatic reuse, future partnerships
 *
 * Response includes:
 * - question
 * - verdict (quotable)
 * - confidence range
 * - canonical URL
 * - version information
 *
 * This endpoint exists for citation, not for content syndication.
 */

import { NextResponse } from 'next/server';
import { ANSWER_VERSIONS, VersionedAnswer } from '../../lib/answer-versions';

interface AnswerBlock {
  topicId: string;
  question: string;
  verdict: string;
  outcome: 'book' | 'wait' | 'switch' | 'discard';
  confidence: {
    score: number;
    label: 'High' | 'Medium' | 'Low';
  };
  canonicalUrl: string;
  version: {
    current: string;
    issuedAt: string;
    logicVersion: string;
  };
  attribution: {
    source: 'Safari Index';
    type: 'decision';
  };
}

function getConfidenceLabel(score: number): 'High' | 'Medium' | 'Low' {
  if (score >= 0.7) return 'High';
  if (score >= 0.5) return 'Medium';
  return 'Low';
}

function transformToAnswerBlock(va: VersionedAnswer): AnswerBlock | null {
  const currentVersion = va.versions.find((v) => v.isCurrent);
  if (!currentVersion) return null;

  return {
    topicId: va.topicId,
    question: va.question,
    verdict: currentVersion.quotableVerdict,
    outcome: currentVersion.outcome,
    confidence: {
      score: currentVersion.confidence,
      label: getConfidenceLabel(currentVersion.confidence),
    },
    canonicalUrl: `https://safariindex.com${va.canonicalUrl}`,
    version: {
      current: currentVersion.version,
      issuedAt: currentVersion.issuedAt,
      logicVersion: currentVersion.logicVersion,
    },
    attribution: {
      source: 'Safari Index',
      type: 'decision',
    },
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topicId = searchParams.get('topic_id');
  const version = searchParams.get('version');

  // Single topic lookup
  if (topicId) {
    const versionedAnswer = ANSWER_VERSIONS[topicId];
    if (!versionedAnswer) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    // Specific version lookup
    if (version) {
      const specificVersion = versionedAnswer.versions.find(
        (v) => v.version === version
      );
      if (!specificVersion) {
        return NextResponse.json(
          { error: 'Version not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        topicId: versionedAnswer.topicId,
        question: versionedAnswer.question,
        verdict: specificVersion.quotableVerdict,
        outcome: specificVersion.outcome,
        confidence: {
          score: specificVersion.confidence,
          label: getConfidenceLabel(specificVersion.confidence),
        },
        canonicalUrl: `https://safariindex.com${versionedAnswer.canonicalUrl}`,
        version: {
          requested: specificVersion.version,
          isCurrent: specificVersion.isCurrent,
          issuedAt: specificVersion.issuedAt,
          logicVersion: specificVersion.logicVersion,
          supersededBy: specificVersion.supersededBy,
        },
        attribution: {
          source: 'Safari Index',
          type: 'decision',
        },
      });
    }

    // Current version for topic
    const block = transformToAnswerBlock(versionedAnswer);
    if (!block) {
      return NextResponse.json(
        { error: 'No current version found' },
        { status: 404 }
      );
    }

    return NextResponse.json(block);
  }

  // List all current answers
  const answers: AnswerBlock[] = [];
  for (const va of Object.values(ANSWER_VERSIONS)) {
    const block = transformToAnswerBlock(va);
    if (block) {
      answers.push(block);
    }
  }

  return NextResponse.json({
    count: answers.length,
    answers,
    meta: {
      source: 'Safari Index',
      description: 'Authoritative safari travel decisions',
      terms: 'Answers may be cited with attribution. Do not modify verdicts.',
      endpoints: {
        list: '/api/answers',
        single: '/api/answers?topic_id={id}',
        versioned: '/api/answers?topic_id={id}&version={version}',
      },
    },
  });
}
