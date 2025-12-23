/**
 * Quiet Intent Signals
 *
 * Per task requirements:
 * - Detect non-invasive signals (returning visits, purchases, embeds)
 * - NO cookies, trackers, or profiling
 * - Session-scoped or decision-scoped only
 *
 * These signals indicate genuine interest, not marketing opportunity.
 * They inform helpful suggestions, not sales funnels.
 */

/**
 * Intent signal types
 * Each signal represents organic user behavior, not tracked behavior
 */
export type IntentSignal =
  | 'RETURNING_VISIT' // User has viewed this decision before in session
  | 'PURCHASED_ASSURANCE' // User bought Decision Assurance
  | 'EMBEDDED_DECISION' // User copied embed code
  | 'VIEWED_RELATED' // User viewed a related decision
  | 'REFINED_ASSUMPTIONS' // User interacted with assumptions
  | 'NONE'; // No signal detected

/**
 * Session-scoped storage key prefix
 * Uses sessionStorage (clears on tab close) - no persistence
 */
const SESSION_KEY_PREFIX = 'si_intent_';

/**
 * Record a decision view in session
 * No personal data, no cross-session tracking
 */
export function recordDecisionView(decisionId: string): void {
  if (typeof window === 'undefined') return;

  const key = `${SESSION_KEY_PREFIX}views`;
  const views = getSessionViews();

  if (!views.includes(decisionId)) {
    views.push(decisionId);
    sessionStorage.setItem(key, JSON.stringify(views));
  } else {
    // Mark as returning visit
    const returnKey = `${SESSION_KEY_PREFIX}returning_${decisionId}`;
    sessionStorage.setItem(returnKey, 'true');
  }
}

/**
 * Check if this is a returning visit to a decision
 */
export function isReturningVisit(decisionId: string): boolean {
  if (typeof window === 'undefined') return false;

  const returnKey = `${SESSION_KEY_PREFIX}returning_${decisionId}`;
  return sessionStorage.getItem(returnKey) === 'true';
}

/**
 * Record assurance purchase for a decision
 */
export function recordAssurancePurchase(decisionId: string): void {
  if (typeof window === 'undefined') return;

  const key = `${SESSION_KEY_PREFIX}purchased_${decisionId}`;
  sessionStorage.setItem(key, 'true');
}

/**
 * Check if user purchased assurance for this decision
 */
export function hasPurchasedAssurance(decisionId: string): boolean {
  if (typeof window === 'undefined') return false;

  const key = `${SESSION_KEY_PREFIX}purchased_${decisionId}`;
  return sessionStorage.getItem(key) === 'true';
}

/**
 * Record embed code copy
 */
export function recordEmbedCopy(decisionId: string): void {
  if (typeof window === 'undefined') return;

  const key = `${SESSION_KEY_PREFIX}embedded_${decisionId}`;
  sessionStorage.setItem(key, 'true');
}

/**
 * Check if user copied embed code
 */
export function hasEmbeddedDecision(decisionId: string): boolean {
  if (typeof window === 'undefined') return false;

  const key = `${SESSION_KEY_PREFIX}embedded_${decisionId}`;
  return sessionStorage.getItem(key) === 'true';
}

/**
 * Record related decision view
 */
export function recordRelatedView(fromDecisionId: string, toDecisionId: string): void {
  if (typeof window === 'undefined') return;

  const key = `${SESSION_KEY_PREFIX}related_${fromDecisionId}`;
  const related = JSON.parse(sessionStorage.getItem(key) || '[]');
  if (!related.includes(toDecisionId)) {
    related.push(toDecisionId);
    sessionStorage.setItem(key, JSON.stringify(related));
  }
}

/**
 * Get count of related decisions viewed
 */
export function getRelatedViewCount(decisionId: string): number {
  if (typeof window === 'undefined') return 0;

  const key = `${SESSION_KEY_PREFIX}related_${decisionId}`;
  const related = JSON.parse(sessionStorage.getItem(key) || '[]');
  return related.length;
}

/**
 * Get all session views (decision IDs viewed this session)
 */
function getSessionViews(): string[] {
  if (typeof window === 'undefined') return [];

  const key = `${SESSION_KEY_PREFIX}views`;
  return JSON.parse(sessionStorage.getItem(key) || '[]');
}

/**
 * Detect the strongest intent signal for a decision
 * Returns the most meaningful signal, not all signals
 */
export function detectIntentSignal(decisionId: string): IntentSignal {
  if (typeof window === 'undefined') return 'NONE';

  // Priority order: most meaningful signals first
  if (hasPurchasedAssurance(decisionId)) {
    return 'PURCHASED_ASSURANCE';
  }

  if (hasEmbeddedDecision(decisionId)) {
    return 'EMBEDDED_DECISION';
  }

  if (getRelatedViewCount(decisionId) >= 2) {
    return 'VIEWED_RELATED';
  }

  if (isReturningVisit(decisionId)) {
    return 'RETURNING_VISIT';
  }

  return 'NONE';
}

/**
 * Get session view count for a specific decision
 * Used to understand engagement depth without tracking
 */
export function getDecisionViewCount(decisionId: string): number {
  if (typeof window === 'undefined') return 0;

  const views = getSessionViews();
  return views.filter((id) => id === decisionId).length;
}
