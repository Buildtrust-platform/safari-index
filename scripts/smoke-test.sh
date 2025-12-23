#!/bin/bash
#
# Safari Index Smoke Test
# Tests the POST /decision/evaluate endpoint with minimal valid input
#
# Usage:
#   ./scripts/smoke-test.sh <API_URL>
#   ./scripts/smoke-test.sh https://xxxxx.execute-api.us-east-1.amazonaws.com/v1
#
# For local testing with SAM:
#   ./scripts/smoke-test.sh http://localhost:3000

set -e

API_URL="${1:-http://localhost:3000}"
ENDPOINT="${API_URL}/decision/evaluate"

echo "Testing: POST ${ENDPOINT}"
echo "---"

# Minimal valid input per 12_ai_prompts.md Standard Input Envelope
curl -s -X POST "${ENDPOINT}" \
  -H "Content-Type: application/json" \
  -d '{
    "task": "DECISION",
    "tracking": {
      "session_id": "sess_test123",
      "traveler_id": null,
      "lead_id": null
    },
    "user_context": {
      "traveler_type": "first_time",
      "budget_band": "fair_value",
      "pace_preference": "balanced",
      "drive_tolerance_hours": 4,
      "risk_tolerance": "medium",
      "dates": {
        "type": "month_year",
        "month": "February",
        "year": 2026
      },
      "group_size": 2,
      "prior_decisions": []
    },
    "request": {
      "question": "Is February a good time for a safari in Tanzania?",
      "scope": "thin_edge_scope_only=true",
      "destinations_considered": ["Tanzania"],
      "constraints": {}
    },
    "facts": {
      "known_constraints": [],
      "known_tradeoffs": [],
      "destination_notes": []
    },
    "policy": {
      "must_refuse_if": [
        "guarantee_requested",
        "inputs_conflict_unbounded",
        "missing_material_inputs"
      ],
      "forbidden_phrases": [
        "unforgettable",
        "magical",
        "once-in-a-lifetime",
        "breathtaking"
      ]
    }
  }' | jq .

echo "---"
echo "Smoke test complete"
