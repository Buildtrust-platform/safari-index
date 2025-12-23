#!/bin/bash
#
# Verify Live Surface
#
# Checks that a deployed Safari Index instance is functioning correctly.
# Tests homepage, how-it-works, decision page, and CDN asset loading.
#
# Usage:
#   ./scripts/verify-live-surface.sh <base-url>
#
# Examples:
#   ./scripts/verify-live-surface.sh https://main.abc123.amplifyapp.com
#   ./scripts/verify-live-surface.sh https://staging.abc123.amplifyapp.com
#   ./scripts/verify-live-surface.sh http://localhost:3000
#

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <base-url>"
  echo ""
  echo "Examples:"
  echo "  $0 https://main.abc123.amplifyapp.com"
  echo "  $0 http://localhost:3000"
  exit 1
fi

BASE_URL="${1%/}"  # Remove trailing slash if present

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           Safari Index Live Surface Verification             ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "Target: $BASE_URL"
echo ""

PASSED=0
FAILED=0

check_url() {
  local name="$1"
  local url="$2"
  local expected_status="${3:-200}"

  printf "%-40s" "$name..."

  status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>/dev/null || echo "000")

  if [ "$status" = "$expected_status" ]; then
    echo "✅ $status"
    PASSED=$((PASSED + 1))
  else
    echo "❌ $status (expected $expected_status)"
    FAILED=$((FAILED + 1))
  fi
}

check_content() {
  local name="$1"
  local url="$2"
  local search="$3"

  printf "%-40s" "$name..."

  content=$(curl -s --max-time 10 "$url" 2>/dev/null || echo "")

  if echo "$content" | grep -q "$search"; then
    echo "✅ Found"
    PASSED=$((PASSED + 1))
  else
    echo "❌ Not found"
    FAILED=$((FAILED + 1))
  fi
}

echo "PAGE CHECKS"
echo "─────────────────────────────────────────────────────────────────"

# Core pages
check_url "Homepage" "$BASE_URL/"
check_url "How It Works" "$BASE_URL/how-it-works"
check_url "Explore" "$BASE_URL/explore"
check_url "Decision Page" "$BASE_URL/decisions/tanzania-safari-february"

# API health
check_url "API Health" "$BASE_URL/api/ops/health"

# Should return 404
check_url "404 handling" "$BASE_URL/nonexistent-page-12345" "404"

echo ""
echo "CONTENT CHECKS"
echo "─────────────────────────────────────────────────────────────────"

# Check homepage has Safari Index branding
check_content "Homepage branding" "$BASE_URL/" "Safari Index"

# Check decision page has verdict
check_content "Decision verdict" "$BASE_URL/decisions/tanzania-safari-february" "decision"

# Check health endpoint returns JSON
check_content "Health JSON" "$BASE_URL/api/ops/health" "status"

echo ""
echo "CDN CHECKS (if configured)"
echo "─────────────────────────────────────────────────────────────────"

# Check CloudFront production CDN
check_url "Production CDN" "https://d7lhxuw5xhnoj.cloudfront.net/" "403"  # 403 expected for root

# Check staging CDN
check_url "Staging CDN" "https://d3akaqzbxcmb8k.cloudfront.net/" "403"  # 403 expected for root

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "RESULTS: $PASSED passed, $FAILED failed"
echo "═══════════════════════════════════════════════════════════════"

if [ $FAILED -gt 0 ]; then
  exit 1
fi

echo ""
echo "✅ All checks passed"
