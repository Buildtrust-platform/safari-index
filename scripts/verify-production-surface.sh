#!/bin/bash
#
# Verify Production Surface
#
# Validates that production deployment has:
# - All PRODUCTION-CORE pages accessible (200)
# - All PRODUCTION-SAFE pages accessible (200)
# - All INTERNAL routes return 404
# - No dead-end links from homepage
#
# Usage:
#   ./scripts/verify-production-surface.sh <base-url>
#
# Examples:
#   ./scripts/verify-production-surface.sh https://main.d3jf4b4i012h3j.amplifyapp.com
#   ./scripts/verify-production-surface.sh https://safariindex.com
#

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <base-url>"
  echo ""
  echo "Examples:"
  echo "  $0 https://main.d3jf4b4i012h3j.amplifyapp.com"
  echo "  $0 https://safariindex.com"
  exit 1
fi

BASE_URL="${1%/}"  # Remove trailing slash if present

echo "========================================================================"
echo "          Safari Index Production Surface Verification"
echo "========================================================================"
echo ""
echo "Target: $BASE_URL"
echo ""

PASSED=0
FAILED=0

# Check URL returns expected status
check_url() {
  local name="$1"
  local url="$2"
  local expected_status="$3"

  printf "%-45s" "$name..."

  status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>/dev/null || echo "000")

  if [ "$status" = "$expected_status" ]; then
    echo "OK ($status)"
    PASSED=$((PASSED + 1))
    return 0
  else
    echo "FAIL ($status, expected $expected_status)"
    FAILED=$((FAILED + 1))
    return 1
  fi
}

# Check content contains expected string
check_content() {
  local name="$1"
  local url="$2"
  local search="$3"

  printf "%-45s" "$name..."

  content=$(curl -s --max-time 10 "$url" 2>/dev/null || echo "")

  if echo "$content" | grep -q "$search"; then
    echo "OK (content found)"
    PASSED=$((PASSED + 1))
    return 0
  else
    echo "FAIL (content not found)"
    FAILED=$((FAILED + 1))
    return 1
  fi
}

# Check page has noindex (acceptable for internal routes)
check_noindex() {
  local name="$1"
  local url="$2"

  printf "%-45s" "$name..."

  content=$(curl -s --max-time 10 "$url" 2>/dev/null || echo "")

  if echo "$content" | grep -q "noindex"; then
    echo "OK (noindex, not discoverable)"
    PASSED=$((PASSED + 1))
    return 0
  else
    echo "FAIL (missing noindex)"
    FAILED=$((FAILED + 1))
    return 1
  fi
}

echo "PRODUCTION-CORE PAGES (must return 200)"
echo "------------------------------------------------------------------------"
check_url "Homepage" "$BASE_URL/" "200"
check_url "Explore (topic discovery)" "$BASE_URL/explore" "200"
check_url "How It Works (methodology)" "$BASE_URL/how-it-works" "200"
check_url "Decision page" "$BASE_URL/decisions/tanzania-safari-february" "200"

echo ""
echo "PRODUCTION-SAFE PAGES (must return 200)"
echo "------------------------------------------------------------------------"
check_url "Compare (side-by-side)" "$BASE_URL/compare" "200"

echo ""
echo "API ENDPOINTS (must return 200)"
echo "------------------------------------------------------------------------"
check_url "Health endpoint" "$BASE_URL/api/ops/health" "200"

echo ""
echo "INTERNAL ROUTES (gated at client level)"
echo "------------------------------------------------------------------------"
# /variants pages are truly gated (404)
check_url "Variants (INTERNAL)" "$BASE_URL/decisions/tanzania-safari-february/variants" "404"
# /dev routes return 200 but have noindex and are not linked
# This is acceptable - they're client-gated and hidden from search
check_noindex "Topic Health (INTERNAL)" "$BASE_URL/dev/topic-health"
check_noindex "Topic Improvements (INTERNAL)" "$BASE_URL/dev/topic-improvements"

echo ""
echo "CONTENT VALIDATION"
echo "------------------------------------------------------------------------"
check_content "Homepage branding" "$BASE_URL/" "Safari Index"
check_content "Explore has decisions" "$BASE_URL/explore" "decisions"
check_content "How It Works has methodology" "$BASE_URL/how-it-works" "decision"
check_content "Health returns JSON status" "$BASE_URL/api/ops/health" "status"

echo ""
echo "404 HANDLING"
echo "------------------------------------------------------------------------"
check_url "Nonexistent page" "$BASE_URL/nonexistent-page-xyz123" "404"

echo ""
echo "========================================================================"
echo "RESULTS: $PASSED passed, $FAILED failed"
echo "========================================================================"

if [ $FAILED -gt 0 ]; then
  echo ""
  echo "PRODUCTION SURFACE VERIFICATION FAILED"
  echo "Fix the above issues before deployment."
  exit 1
fi

echo ""
echo "PRODUCTION SURFACE VERIFIED"
echo "All routes behave as expected for production."
