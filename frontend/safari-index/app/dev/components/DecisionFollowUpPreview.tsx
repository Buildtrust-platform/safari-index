/**
 * DecisionFollowUp Preview Component
 *
 * Wrapper to show DecisionFollowUp in multiple states for visual testing.
 * Shows unchecked and checked states side by side.
 */

'use client';

import { DecisionFollowUp } from '../../components/DecisionFollowUp';

export function DecisionFollowUpPreview() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
          Default (unchecked)
        </p>
        <DecisionFollowUp
          decisionId="dec_preview_followup_1"
          topicId="topic_tanzania_february"
          currentLogicVersion="v2.1"
          currentConfidence={0.82}
        />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
          Interactive - Check the box to see email form
        </p>
        <p className="text-xs text-gray-400 mb-2">
          The component above is interactive. Check the checkbox to reveal the email input form.
        </p>
      </div>
    </div>
  );
}
