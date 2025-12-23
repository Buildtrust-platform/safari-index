#!/bin/bash
#
# Smoke test for /ops/health endpoint
#
# Tests:
# 1. Base /ops/health returns expected structure
# 2. /ops/health?topic_breakdown=true returns topic_counters
#
# Usage:
#   ./scripts/smoke-test-health.sh [API_URL]
#
# Examples:
#   ./scripts/smoke-test-health.sh  # Uses staging default
#   ./scripts/smoke-test-health.sh https://api.safariindex.com/v1

set -e

# Default to staging API
API_BASE="${1:-https://qnxbpsr2a1.execute-api.eu-central-1.amazonaws.com/v1}"

echo "=== /ops/health Smoke Tests ==="
echo "API: $API_BASE"
echo ""

# Test 1: Base health endpoint
echo "Test 1: GET /ops/health (base)"
RESPONSE=$(curl -s "$API_BASE/ops/health")

# Check required fields exist
if echo "$RESPONSE" | grep -q '"status"'; then
  echo "  ✓ status field present"
else
  echo "  ✗ status field missing"
  exit 1
fi

if echo "$RESPONSE" | grep -q '"counters"'; then
  echo "  ✓ counters field present"
else
  echo "  ✗ counters field missing"
  exit 1
fi

if echo "$RESPONSE" | grep -q '"guardrails"'; then
  echo "  ✓ guardrails field present"
else
  echo "  ✗ guardrails field missing"
  exit 1
fi

# Verify topic_counters is NOT present without param
if echo "$RESPONSE" | grep -q '"topic_counters"'; then
  echo "  ✗ topic_counters should NOT be present without param"
  exit 1
else
  echo "  ✓ topic_counters correctly absent"
fi

echo ""

# Test 2: Health with topic breakdown
echo "Test 2: GET /ops/health?topic_breakdown=true"
RESPONSE=$(curl -s "$API_BASE/ops/health?topic_breakdown=true")

# Check base fields still present
if echo "$RESPONSE" | grep -q '"status"'; then
  echo "  ✓ status field present"
else
  echo "  ✗ status field missing"
  exit 1
fi

# Check for topic breakdown response
if echo "$RESPONSE" | grep -q '"topic_counters"'; then
  echo "  ✓ topic_counters field present"

  # Check structure of first topic counter
  if echo "$RESPONSE" | grep -q '"topic_id"'; then
    echo "  ✓ topic_id in counters"
  fi
  if echo "$RESPONSE" | grep -q '"refusal_rate"'; then
    echo "  ✓ refusal_rate in counters"
  fi
elif echo "$RESPONSE" | grep -q '"topic_breakdown_skipped"'; then
  echo "  ✓ topic_breakdown_skipped (safety limit triggered)"
  if echo "$RESPONSE" | grep -q '"topic_breakdown_reason"'; then
    REASON=$(echo "$RESPONSE" | grep -o '"topic_breakdown_reason":"[^"]*"' | cut -d'"' -f4)
    echo "  ✓ reason: $REASON"
  fi
else
  echo "  ✗ neither topic_counters nor topic_breakdown_skipped present"
  exit 1
fi

echo ""

# Test 3: Check for top_refusal_reasons (optional)
echo "Test 3: Check optional fields"
if echo "$RESPONSE" | grep -q '"top_refusal_reasons"'; then
  echo "  ✓ top_refusal_reasons present"
else
  echo "  ○ top_refusal_reasons not present (optional)"
fi

echo ""
echo "=== All smoke tests passed ==="
