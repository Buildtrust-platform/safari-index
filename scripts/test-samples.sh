#!/bin/bash
#
# Safari Index Sample Test Runner
# Tests each sample file and validates expected outcomes
#
# Usage:
#   ./scripts/test-samples.sh <API_URL>
#   ./scripts/test-samples.sh https://xxxxx.execute-api.us-east-1.amazonaws.com/v1

set -e

API_URL="${1:-http://localhost:3000}"
ENDPOINT="${API_URL}/decision/evaluate"
SAMPLES_DIR="$(dirname "$0")/samples"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Safari Index Sample Tests"
echo "Endpoint: ${ENDPOINT}"
echo "=========================================="
echo ""

test_sample() {
  local file=$1
  local expected_type=$2
  local name=$(basename "$file" .json)

  echo -n "Testing ${name}... "

  response=$(curl -s -X POST "${ENDPOINT}" \
    -H "Content-Type: application/json" \
    -d @"${file}")

  # Extract the output type from response
  actual_type=$(echo "$response" | jq -r '.output.type // .type // "error"')
  decision_id=$(echo "$response" | jq -r '.decision_id // "none"')

  if [ "$actual_type" == "$expected_type" ]; then
    echo -e "${GREEN}PASS${NC} (type=${actual_type}, decision_id=${decision_id})"
    return 0
  else
    echo -e "${RED}FAIL${NC} (expected=${expected_type}, got=${actual_type})"
    echo "Response:"
    echo "$response" | jq .
    return 1
  fi
}

# Track results
passed=0
failed=0

echo "--- Refusal Tests ---"
echo ""

# Test: guarantee_request.json → should produce type=refusal
if test_sample "${SAMPLES_DIR}/guarantee_request.json" "refusal"; then
  ((passed++))
else
  ((failed++))
fi

# Test: conflicting_constraints.json → should produce type=refusal
if test_sample "${SAMPLES_DIR}/conflicting_constraints.json" "refusal"; then
  ((passed++))
else
  ((failed++))
fi

# Test: missing_material_inputs.json → should produce type=refusal
if test_sample "${SAMPLES_DIR}/missing_material_inputs.json" "refusal"; then
  ((passed++))
else
  ((failed++))
fi

echo ""
echo "--- Decision Tests ---"
echo ""

# Test: valid_decision.json → should produce type=decision
if test_sample "${SAMPLES_DIR}/valid_decision.json" "decision"; then
  ((passed++))
else
  ((failed++))
fi

echo ""
echo "=========================================="
echo "Results: ${passed} passed, ${failed} failed"
echo "=========================================="

if [ $failed -gt 0 ]; then
  exit 1
fi
