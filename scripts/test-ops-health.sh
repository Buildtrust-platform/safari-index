#!/bin/bash
#
# Safari Index Ops Health Smoke Test
# Validates the /ops/health endpoint returns expected structure
#
# Usage:
#   ./scripts/test-ops-health.sh <API_URL>
#   ./scripts/test-ops-health.sh https://xxxxx.execute-api.us-east-1.amazonaws.com/v1

set -e

API_URL="${1:-http://localhost:3000}"
ENDPOINT="${API_URL}/ops/health"

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo "=========================================="
echo "Safari Index Ops Health Smoke Test"
echo "Endpoint: ${ENDPOINT}"
echo "=========================================="
echo ""

# Make request
echo "Fetching health status..."
response=$(curl -s -w "\n%{http_code}" "${ENDPOINT}")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

# Check HTTP status
if [ "$http_code" != "200" ]; then
  echo -e "${RED}FAIL${NC}: Expected HTTP 200, got ${http_code}"
  echo "Response: ${body}"
  exit 1
fi

echo -e "${GREEN}HTTP 200 OK${NC}"
echo ""

# Validate required keys
echo "Validating response structure..."

required_keys=(
  "timestamp"
  "logic_version"
  "status"
  "health_signals"
  "guardrails"
  "counters"
)

failed=0
for key in "${required_keys[@]}"; do
  value=$(echo "$body" | jq -r ".${key} // \"MISSING\"")
  if [ "$value" == "MISSING" ] || [ "$value" == "null" ]; then
    echo -e "  ${RED}MISSING${NC}: ${key}"
    ((failed++))
  else
    echo -e "  ${GREEN}OK${NC}: ${key}"
  fi
done

# Validate nested guardrails structure (booleans need has() check)
bedrock_circuit=$(echo "$body" | jq 'has("guardrails") and (.guardrails | has("bedrock_circuit_open"))')
if [ "$bedrock_circuit" != "true" ]; then
  echo -e "  ${RED}MISSING${NC}: guardrails.bedrock_circuit_open"
  ((failed++))
else
  echo -e "  ${GREEN}OK${NC}: guardrails.bedrock_circuit_open"
fi

assurance_paused=$(echo "$body" | jq 'has("guardrails") and (.guardrails | has("assurance_paused"))')
if [ "$assurance_paused" != "true" ]; then
  echo -e "  ${RED}MISSING${NC}: guardrails.assurance_paused"
  ((failed++))
else
  echo -e "  ${GREEN}OK${NC}: guardrails.assurance_paused"
fi

active_alerts=$(echo "$body" | jq 'has("guardrails") and (.guardrails | has("active_alerts"))')
if [ "$active_alerts" != "true" ]; then
  echo -e "  ${RED}MISSING${NC}: guardrails.active_alerts"
  ((failed++))
else
  echo -e "  ${GREEN}OK${NC}: guardrails.active_alerts"
fi

# Validate status is valid enum
status=$(echo "$body" | jq -r '.status')
if [[ "$status" != "healthy" && "$status" != "degraded" && "$status" != "critical" ]]; then
  echo -e "  ${RED}INVALID${NC}: status must be healthy|degraded|critical, got: ${status}"
  ((failed++))
else
  echo -e "  ${GREEN}OK${NC}: status = ${status}"
fi

echo ""
echo "=========================================="

if [ $failed -gt 0 ]; then
  echo -e "${RED}FAIL${NC}: ${failed} validation error(s)"
  echo ""
  echo "Full response:"
  echo "$body" | jq .
  exit 1
fi

echo -e "${GREEN}PASS${NC}: All validations passed"
echo ""
echo "Response summary:"
echo "  timestamp:     $(echo "$body" | jq -r '.timestamp')"
echo "  logic_version: $(echo "$body" | jq -r '.logic_version')"
echo "  status:        $(echo "$body" | jq -r '.status')"
echo "  signals:       $(echo "$body" | jq '.health_signals | length') health signals"
echo "  alerts:        $(echo "$body" | jq -r '.guardrails.active_alerts') active"
echo ""
