/**
 * Follow-Up Email Templates
 *
 * Per task requirements:
 * - Follow-up must never recommend action
 * - Emails must restate the decision calmly
 * - No CTAs other than "View updated decision"
 *
 * These are notification emails, not marketing emails.
 * They inform, they do not persuade.
 */

export interface FollowUpEmailData {
  recipientEmail: string;
  decisionId: string;
  topicId: string;
  question: string;
  previousOutcome: string;
  newOutcome: string;
  previousConfidence: number;
  newConfidence: number;
  previousLogicVersion: string;
  newLogicVersion: string;
  changeReason: 'logic_version_change' | 'confidence_drift' | 'review_outcome';
  canonicalUrl: string;
}

/**
 * Generate plain text email for decision change notification
 * No HTML, no styling, no marketing language
 */
export function generateFollowUpEmailText(data: FollowUpEmailData): string {
  const changeDescriptions: Record<string, string> = {
    logic_version_change: 'The decision logic has been updated.',
    confidence_drift: 'The confidence level has changed significantly.',
    review_outcome: 'This decision has been reviewed.',
  };

  const changeDescription = changeDescriptions[data.changeReason];

  const outcomeChanged = data.previousOutcome !== data.newOutcome;
  const confidenceChanged =
    Math.abs(data.previousConfidence - data.newConfidence) >= 0.1;

  let changeDetails = '';

  if (outcomeChanged) {
    changeDetails += `\nOutcome changed: ${data.previousOutcome} → ${data.newOutcome}`;
  }

  if (confidenceChanged) {
    const prevPct = Math.round(data.previousConfidence * 100);
    const newPct = Math.round(data.newConfidence * 100);
    changeDetails += `\nConfidence changed: ${prevPct}% → ${newPct}%`;
  }

  if (data.previousLogicVersion !== data.newLogicVersion) {
    changeDetails += `\nLogic version: ${data.previousLogicVersion} → ${data.newLogicVersion}`;
  }

  return `
A decision you subscribed to has been updated.

Question: ${data.question}

${changeDescription}
${changeDetails}

View updated decision:
${data.canonicalUrl}

---

This is an automated notification from Safari Index.
You subscribed to updates for this specific decision.
No other emails will be sent.

To unsubscribe: ${data.canonicalUrl}?unsubscribe=true

Decision ID: ${data.decisionId}
`.trim();
}

/**
 * Generate email subject line
 * Factual, not attention-grabbing
 */
export function generateFollowUpEmailSubject(data: FollowUpEmailData): string {
  const outcomeChanged = data.previousOutcome !== data.newOutcome;

  if (outcomeChanged) {
    return `Decision updated: ${data.question.substring(0, 50)}...`;
  }

  return `Decision reviewed: ${data.question.substring(0, 50)}...`;
}

/**
 * Example email output:
 *
 * Subject: Decision updated: Should I book a Tanzania safari for February?...
 *
 * A decision you subscribed to has been updated.
 *
 * Question: Should I book a Tanzania safari for February?
 *
 * The decision logic has been updated.
 *
 * Outcome changed: book → wait
 * Confidence changed: 78% → 65%
 * Logic version: rules_v1.0 → rules_v1.1
 *
 * View updated decision:
 * https://safariindex.com/decisions/tanzania-safari-february
 *
 * ---
 *
 * This is an automated notification from Safari Index.
 * You subscribed to updates for this specific decision.
 * No other emails will be sent.
 *
 * To unsubscribe: https://safariindex.com/decisions/tanzania-safari-february?unsubscribe=true
 *
 * Decision ID: dec_abc123def456
 */
