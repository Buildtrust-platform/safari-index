/**
 * Answer Versioning System
 *
 * Per task requirements:
 * - Each answer block must be versioned
 * - If decision logic changes, old answer remains accessible
 * - New answer is marked current
 * - Prevent silent answer rewriting
 *
 * Version format: v{major}.{minor}
 * - Major: outcome changed
 * - Minor: confidence or conditions changed, outcome same
 */

export interface AnswerVersion {
  version: string;
  issuedAt: string;
  logicVersion: string;
  outcome: 'book' | 'wait' | 'switch' | 'discard';
  quotableVerdict: string;
  confidence: number;
  supersededBy: string | null;
  isCurrent: boolean;
}

export interface VersionedAnswer {
  topicId: string;
  question: string;
  slug: string;
  canonicalUrl: string;
  currentVersion: string;
  versions: AnswerVersion[];
}

/**
 * Generate answer version string
 * Major increment on outcome change, minor on other changes
 */
export function generateVersionString(
  previousVersion: string | null,
  outcomeChanged: boolean
): string {
  if (!previousVersion) {
    return 'v1.0';
  }

  const match = previousVersion.match(/v(\d+)\.(\d+)/);
  if (!match) {
    return 'v1.0';
  }

  const [, major, minor] = match;
  if (outcomeChanged) {
    return `v${parseInt(major) + 1}.0`;
  }
  return `v${major}.${parseInt(minor) + 1}`;
}

/**
 * Build quotable verdict from decision data
 * 40-70 words, includes conditional logic
 */
export function buildQuotableVerdict(
  outcome: string,
  headline: string,
  primaryCondition: string,
  invalidatingCondition: string
): string {
  const outcomeVerbs: Record<string, string> = {
    book: 'proceed with booking',
    wait: 'wait before booking',
    switch: 'consider alternatives',
    discard: 'not pursue this option',
  };

  const verb = outcomeVerbs[outcome] || 'evaluate carefully';

  return `${headline}. Travelers should ${verb} because ${primaryCondition.toLowerCase()}. This recommendation changes if ${invalidatingCondition.toLowerCase()}.`;
}

/**
 * Static answer versions for published topics
 * In production, this would be stored in DynamoDB
 *
 * Per governance: answers are versioned artifacts, not mutable content
 */
export const ANSWER_VERSIONS: Record<string, VersionedAnswer> = {
  'topic_tz_feb': {
    topicId: 'topic_tz_feb',
    question: 'Should I book a Tanzania safari for February?',
    slug: 'tanzania-safari-february',
    canonicalUrl: '/decisions/tanzania-safari-february',
    currentVersion: 'v1.0',
    versions: [
      {
        version: 'v1.0',
        issuedAt: '2024-01-15T00:00:00Z',
        logicVersion: 'rules_v1.0',
        outcome: 'book',
        quotableVerdict:
          'February is an excellent time for a Tanzania safari. Travelers should proceed with booking because the dry season offers optimal wildlife viewing and the Great Migration is typically in the southern Serengeti. This recommendation changes if you require guaranteed low crowds or budget pricing.',
        confidence: 0.78,
        supersededBy: null,
        isCurrent: true,
      },
    ],
  },
  'topic_ke_aug': {
    topicId: 'topic_ke_aug',
    question: 'Is August the best time for a Kenya safari?',
    slug: 'kenya-safari-august',
    canonicalUrl: '/decisions/kenya-safari-august',
    currentVersion: 'v1.0',
    versions: [
      {
        version: 'v1.0',
        issuedAt: '2024-01-15T00:00:00Z',
        logicVersion: 'rules_v1.0',
        outcome: 'book',
        quotableVerdict:
          'August is peak season for Kenya safaris. Travelers should proceed with booking because the Great Migration river crossings occur in the Masai Mara and weather conditions are ideal. This recommendation changes if you cannot book 6+ months in advance or have strict budget constraints.',
        confidence: 0.82,
        supersededBy: null,
        isCurrent: true,
      },
    ],
  },
  'topic_za_first': {
    topicId: 'topic_za_first',
    question: 'Is South Africa good for a first safari?',
    slug: 'south-africa-first-safari',
    canonicalUrl: '/decisions/south-africa-first-safari',
    currentVersion: 'v1.0',
    versions: [
      {
        version: 'v1.0',
        issuedAt: '2024-01-15T00:00:00Z',
        logicVersion: 'rules_v1.0',
        outcome: 'book',
        quotableVerdict:
          'South Africa is well-suited for first-time safari visitors. Travelers should proceed with booking because malaria-free options exist, infrastructure is reliable, and Big Five sightings are consistent. This recommendation changes if you prioritize vast wilderness over accessibility or seek the Great Migration.',
        confidence: 0.85,
        supersededBy: null,
        isCurrent: true,
      },
    ],
  },
  'topic_bw_budget': {
    topicId: 'topic_bw_budget',
    question: 'Can I do Botswana on a budget?',
    slug: 'botswana-budget-safari',
    canonicalUrl: '/decisions/botswana-budget-safari',
    currentVersion: 'v1.0',
    versions: [
      {
        version: 'v1.0',
        issuedAt: '2024-01-15T00:00:00Z',
        logicVersion: 'rules_v1.0',
        outcome: 'switch',
        quotableVerdict:
          'Botswana is not suitable for budget-focused travelers. Travelers should consider alternatives because Botswana deliberately limits tourism volume through high-cost, low-impact policies. This recommendation changes if your definition of budget exceeds $400 per person per day or you can self-drive with camping gear.',
        confidence: 0.88,
        supersededBy: null,
        isCurrent: true,
      },
    ],
  },
  'topic_tz_vs_ke': {
    topicId: 'topic_tz_vs_ke',
    question: 'Tanzania or Kenya for the Great Migration?',
    slug: 'tanzania-vs-kenya-migration',
    canonicalUrl: '/decisions/tanzania-vs-kenya-migration',
    currentVersion: 'v1.0',
    versions: [
      {
        version: 'v1.0',
        issuedAt: '2024-01-15T00:00:00Z',
        logicVersion: 'rules_v1.0',
        outcome: 'wait',
        quotableVerdict:
          'The choice between Tanzania and Kenya depends on timing and priorities. Travelers should wait before booking because the optimal destination changes monthly based on herd location. This recommendation changes if you have fixed travel dates, which would determine the better destination.',
        confidence: 0.72,
        supersededBy: null,
        isCurrent: true,
      },
    ],
  },
};

/**
 * Get current answer for a topic
 */
export function getCurrentAnswer(topicId: string): AnswerVersion | null {
  const versionedAnswer = ANSWER_VERSIONS[topicId];
  if (!versionedAnswer) return null;

  return versionedAnswer.versions.find((v) => v.isCurrent) || null;
}

/**
 * Get all versions for a topic (for audit/history)
 */
export function getAnswerHistory(topicId: string): AnswerVersion[] {
  const versionedAnswer = ANSWER_VERSIONS[topicId];
  return versionedAnswer?.versions || [];
}

/**
 * Get answer by specific version
 */
export function getAnswerByVersion(
  topicId: string,
  version: string
): AnswerVersion | null {
  const versionedAnswer = ANSWER_VERSIONS[topicId];
  if (!versionedAnswer) return null;

  return versionedAnswer.versions.find((v) => v.version === version) || null;
}
