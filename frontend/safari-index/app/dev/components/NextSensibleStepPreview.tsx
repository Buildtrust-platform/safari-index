/**
 * NextSensibleStep Preview Component
 *
 * Wrapper to show NextSensibleStep in multiple states for visual testing.
 * Uses the actual component props interface.
 */

import { NextSensibleStep } from '../../components/NextSensibleStep';

const mockAssumptions = [
  { id: 'A1', text: 'You have flexibility in your travel dates within the month', confidence: 0.85 },
  { id: 'A2', text: 'Budget allows for mid-range to premium accommodations', confidence: 0.7 },
  { id: 'A3', text: 'Group size is 2-4 adults without young children', confidence: 0.9 },
];

const lowConfidenceAssumptions = [
  { id: 'A1', text: 'You are comfortable with basic camping facilities', confidence: 0.45 },
  { id: 'A2', text: 'Budget allows for mid-range accommodations', confidence: 0.7 },
];

export function NextSensibleStepPreview() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
          Book outcome with high confidence assumptions
        </p>
        <p className="text-xs text-gray-400 mb-2">
          Shows no suggestion when assumptions are confident and outcome is book.
        </p>
        <NextSensibleStep
          decisionId="dec_preview_book"
          topicId="topic_tanzania_february"
          outcome="book"
          hasRelatedDecisions={true}
          assumptions={mockAssumptions}
        />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
          Wait outcome
        </p>
        <p className="text-xs text-gray-400 mb-2">
          Suggests subscribing to updates.
        </p>
        <NextSensibleStep
          decisionId="dec_preview_wait"
          topicId="topic_tanzania_march"
          outcome="wait"
          hasRelatedDecisions={true}
          assumptions={mockAssumptions}
        />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
          Switch outcome with related decisions
        </p>
        <p className="text-xs text-gray-400 mb-2">
          Suggests looking at alternatives.
        </p>
        <NextSensibleStep
          decisionId="dec_preview_switch"
          topicId="topic_botswana_june"
          outcome="switch"
          hasRelatedDecisions={true}
          assumptions={mockAssumptions}
        />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
          Low confidence assumption
        </p>
        <p className="text-xs text-gray-400 mb-2">
          Highlights the assumption that needs verification.
        </p>
        <NextSensibleStep
          decisionId="dec_preview_low_conf"
          topicId="topic_zambia_october"
          outcome="book"
          hasRelatedDecisions={false}
          assumptions={lowConfidenceAssumptions}
        />
      </div>
    </div>
  );
}
