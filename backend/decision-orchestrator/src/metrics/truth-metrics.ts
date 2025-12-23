/**
 * Truth Metrics
 *
 * Per 04_metrics_truth.md:
 * - Only metrics that reflect decision quality
 * - No vanity metrics, no conversion optimization
 *
 * Metrics tracked:
 * - Decision Completion Rate: decisions issued / total requests
 * - Refusal Rate: refusals / total requests
 * - Decision Reversal Rate: outcome changes / total decisions
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

const DECISION_TABLE = process.env.DECISION_TABLE || 'safari-index-decisions';
const EVENT_TABLE = process.env.EVENT_TABLE || 'safari-index-events';
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT;

const ddbClient = new DynamoDBClient({
  region: AWS_REGION,
  ...(DYNAMODB_ENDPOINT && { endpoint: DYNAMODB_ENDPOINT }),
});
const docClient = DynamoDBDocumentClient.from(ddbClient);

export interface TopicMetrics {
  topic_id: string;
  total_requests: number;
  decisions_issued: number;
  refusals: number;
  completion_rate: number;
  refusal_rate: number;
  avg_confidence: number;
  outcome_distribution: Record<string, number>;
}

/**
 * Get metrics for a specific topic
 * Per 04_metrics_truth.md: truth metrics only
 */
export async function getTopicMetrics(topicId: string): Promise<TopicMetrics> {
  // Query decisions for this topic using inputs_snapshot.topic_id
  // For MVP, we scan and filter - can be optimized with GSI later
  const decisionsResult = await docClient.send(
    new ScanCommand({
      TableName: DECISION_TABLE,
      FilterExpression: 'contains(session_id, :topic)',
      ExpressionAttributeValues: { ':topic': topicId },
      Limit: 1000,
    })
  );

  const decisions = decisionsResult.Items || [];

  const issued = decisions.filter((d) => d.state === 'ISSUED');
  const refused = decisions.filter((d) => d.state === 'REFUSED');

  const totalRequests = decisions.length;
  const decisionsIssued = issued.length;
  const refusals = refused.length;

  // Calculate outcome distribution
  const outcomeDistribution: Record<string, number> = {};
  for (const d of issued) {
    const outcome = d.verdict?.outcome || 'unknown';
    outcomeDistribution[outcome] = (outcomeDistribution[outcome] || 0) + 1;
  }

  // Calculate average confidence
  const confidences = issued
    .map((d) => d.confidence)
    .filter((c): c is number => typeof c === 'number');
  const avgConfidence =
    confidences.length > 0
      ? confidences.reduce((a, b) => a + b, 0) / confidences.length
      : 0;

  return {
    topic_id: topicId,
    total_requests: totalRequests,
    decisions_issued: decisionsIssued,
    refusals,
    completion_rate: totalRequests > 0 ? decisionsIssued / totalRequests : 0,
    refusal_rate: totalRequests > 0 ? refusals / totalRequests : 0,
    avg_confidence: avgConfidence,
    outcome_distribution: outcomeDistribution,
  };
}

/**
 * Get confidence history for drift detection
 */
export async function getConfidenceHistory(
  topicId: string,
  limit: number = 50
): Promise<{ confidence: number; created_at: string }[]> {
  const result = await docClient.send(
    new ScanCommand({
      TableName: DECISION_TABLE,
      FilterExpression: 'contains(session_id, :topic) AND #state = :issued',
      ExpressionAttributeNames: { '#state': 'state' },
      ExpressionAttributeValues: {
        ':topic': topicId,
        ':issued': 'ISSUED',
      },
      Limit: limit,
    })
  );

  return (result.Items || [])
    .map((d) => ({
      confidence: d.confidence as number,
      created_at: d.created_at as string,
    }))
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

/**
 * Detect confidence drift for a topic
 * Returns true if drift exceeds threshold
 */
export async function detectConfidenceDrift(
  topicId: string,
  baselineConfidence: number,
  threshold: number = 0.15
): Promise<{ drifted: boolean; currentAvg: number; drift: number }> {
  const history = await getConfidenceHistory(topicId, 20);

  if (history.length < 5) {
    return { drifted: false, currentAvg: baselineConfidence, drift: 0 };
  }

  const recentConfidences = history.slice(0, 10).map((h) => h.confidence);
  const currentAvg =
    recentConfidences.reduce((a, b) => a + b, 0) / recentConfidences.length;
  const drift = baselineConfidence - currentAvg;

  return {
    drifted: drift >= threshold,
    currentAvg,
    drift,
  };
}

/**
 * Get all topic metrics summary
 * For review interface
 */
export async function getAllTopicsMetricsSummary(): Promise<
  { topic_id: string; refusal_rate: number; avg_confidence: number; total: number }[]
> {
  // For MVP, aggregate from known topic IDs
  const topicIds = [
    'tz-feb', 'tz-jul', 'tz-nov', 'ke-aug', 'bw-jun',
    'tz-vs-ke', 'short-safari', 'kids-safari', 'budget-tz', 'green-season',
  ];

  const summaries = await Promise.all(
    topicIds.map(async (topicId) => {
      const metrics = await getTopicMetrics(topicId);
      return {
        topic_id: topicId,
        refusal_rate: metrics.refusal_rate,
        avg_confidence: metrics.avg_confidence,
        total: metrics.total_requests,
      };
    })
  );

  return summaries.filter((s) => s.total > 0);
}
