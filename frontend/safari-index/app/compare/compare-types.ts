/**
 * Compare Page Types
 *
 * Types for the /compare route (staging only).
 * Side-by-side decision comparison.
 */

import type { DecisionResponse } from '../../lib/contracts';
import type { DecisionTopic } from '../content/decision-topics';

/**
 * State for a single comparison panel
 */
export type PanelState = 'idle' | 'loading' | 'success' | 'refusal' | 'error';

/**
 * Panel data including topic, response, and state
 */
export interface ComparePanel {
  topic: DecisionTopic | null;
  state: PanelState;
  response: DecisionResponse | null;
  error: string | null;
}

/**
 * Compare page state
 */
export interface CompareState {
  panelA: ComparePanel;
  panelB: ComparePanel;
}

/**
 * Initial empty panel
 */
export function emptyPanel(): ComparePanel {
  return {
    topic: null,
    state: 'idle',
    response: null,
    error: null,
  };
}
