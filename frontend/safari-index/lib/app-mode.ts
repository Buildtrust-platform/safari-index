/**
 * App Mode Guardrails
 *
 * Protects production Observation Mode from accidental changes.
 *
 * APP_MODE values:
 * - "observation" (prod): Frozen UI/flows, no new features
 * - "build" (staging/dev): Free to iterate
 *
 * Per MVP_FREEZE.md: No changes to decision logic, refusal logic,
 * assurance, embeds, or follow-up behavior in observation mode.
 */

export type AppMode = 'observation' | 'build';

/**
 * Get current app mode from environment
 * Defaults to 'observation' for safety
 */
export function getAppMode(): AppMode {
  const mode = process.env.NEXT_PUBLIC_APP_MODE || process.env.APP_MODE;
  if (mode === 'build') {
    return 'build';
  }
  // Default to observation for safety
  return 'observation';
}

/**
 * Check if running in observation (production) mode
 */
export function isObservationMode(): boolean {
  return getAppMode() === 'observation';
}

/**
 * Check if running in build (staging/dev) mode
 */
export function isBuildMode(): boolean {
  return getAppMode() === 'build';
}

/**
 * Protected feature categories that are frozen in observation mode
 */
export type ProtectedFeature =
  | 'navigation_elements'
  | 'cta_placement'
  | 'topic_discovery_pages'
  | 'pricing_experiments'
  | 'layout_wrappers'
  | 'decision_logic'
  | 'refusal_logic'
  | 'assurance_flow'
  | 'embed_behavior'
  | 'follow_up_behavior';

/**
 * Human-readable descriptions for protected features
 */
const FEATURE_DESCRIPTIONS: Record<ProtectedFeature, string> = {
  navigation_elements: 'new navigation elements',
  cta_placement: 'CTA placement changes',
  topic_discovery_pages: 'new topic discovery pages',
  pricing_experiments: 'pricing experiments',
  layout_wrappers: 'layout wrappers that change DOM structure',
  decision_logic: 'decision logic modifications',
  refusal_logic: 'refusal logic modifications',
  assurance_flow: 'assurance flow modifications',
  embed_behavior: 'embed behavior modifications',
  follow_up_behavior: 'follow-up behavior modifications',
};

/**
 * Error thrown when attempting to enable protected features in observation mode
 */
export class ObservationModeViolation extends Error {
  public readonly feature: ProtectedFeature;
  public readonly mode: AppMode;

  constructor(feature: ProtectedFeature) {
    const description = FEATURE_DESCRIPTIONS[feature];
    super(
      `Observation Mode Violation: Cannot enable ${description} in production. ` +
        `Set APP_MODE=build for staging/development.`
    );
    this.name = 'ObservationModeViolation';
    this.feature = feature;
    this.mode = 'observation';
  }
}

/**
 * Assert that a feature is safe to enable in the current mode
 *
 * In observation mode: throws ObservationModeViolation
 * In build mode: returns true (no restriction)
 *
 * @example
 * // In a component that adds new navigation
 * assertObservationSafe('navigation_elements');
 * // Throws in prod, passes in staging
 */
export function assertObservationSafe(feature: ProtectedFeature): boolean {
  if (isObservationMode()) {
    throw new ObservationModeViolation(feature);
  }
  return true;
}

/**
 * Check if a feature is safe without throwing
 * Useful for conditional rendering
 *
 * @example
 * {isFeatureSafe('navigation_elements') && <NewNavItem />}
 */
export function isFeatureSafe(_feature: ProtectedFeature): boolean {
  return !isObservationMode();
}

/**
 * Decorator-style guard for feature flags
 * Returns a wrapped function that only executes in build mode
 *
 * @example
 * const enableNewFeature = guardFeature('pricing_experiments', () => {
 *   // This only runs in build mode
 *   showPricingExperiment();
 * });
 */
export function guardFeature<T>(
  feature: ProtectedFeature,
  fn: () => T
): () => T | undefined {
  return () => {
    if (isObservationMode()) {
      console.warn(
        `[APP_MODE] Skipped ${FEATURE_DESCRIPTIONS[feature]} (observation mode)`
      );
      return undefined;
    }
    return fn();
  };
}

/**
 * Build-time validation helper
 * Call during build to ensure correct mode is set
 */
export function validateBuildMode(expectedMode: AppMode): void {
  const actualMode = getAppMode();
  if (actualMode !== expectedMode) {
    throw new Error(
      `Build Mode Mismatch: Expected APP_MODE=${expectedMode}, got APP_MODE=${actualMode}. ` +
        `This prevents accidental wrong deployments.`
    );
  }
}

/**
 * Log current mode at startup (for debugging)
 */
export function logAppMode(): void {
  const mode = getAppMode();
  const emoji = mode === 'observation' ? '🔒' : '🔧';
  console.log(`[APP_MODE] ${emoji} Running in ${mode.toUpperCase()} mode`);
}
