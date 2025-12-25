#!/bin/bash
# Ensure KB is fresh (non-destructive check)
#
# Usage: ./scripts/ensure-kb-fresh.sh
#
# Checks that backend KB data exists and is valid JSON.
# Does NOT check if it matches frontend (use check-kb.sh for that).
# Used as a fast pre-build check.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(dirname "$SCRIPT_DIR")"
BACKEND_KB_DATA="$FRONTEND_DIR/../../backend/decision-orchestrator/src/kb/kb-data.json"

echo "Checking KB freshness..."

# Check file exists
if [ ! -f "$BACKEND_KB_DATA" ]; then
  echo "Warning: Backend KB data not found at $BACKEND_KB_DATA"
  echo "KB retrieval will return empty results (fail-closed behavior)."
  echo ""
  echo "To populate KB, run: npm run sync-kb"
  exit 0  # Non-blocking - KB is optional
fi

# Check valid JSON
if ! jq empty "$BACKEND_KB_DATA" 2>/dev/null; then
  echo "Error: Backend KB data is not valid JSON"
  exit 1
fi

# Check required fields
EVIDENCE_COUNT=$(jq '.evidence | length' "$BACKEND_KB_DATA")
TOPICS_COUNT=$(jq '.topics | length' "$BACKEND_KB_DATA")
VERSION=$(jq -r '.version' "$BACKEND_KB_DATA")
SYNCED_AT=$(jq -r '.synced_at' "$BACKEND_KB_DATA")

echo "KB data is valid:"
echo "  Version: $VERSION"
echo "  Synced at: $SYNCED_AT"
echo "  Evidence cards: $EVIDENCE_COUNT"
echo "  Topics: $TOPICS_COUNT"

# Warn if stale (more than 7 days old)
SYNCED_EPOCH=$(date -j -f "%Y-%m-%dT%H:%M:%S" "${SYNCED_AT%.*}" "+%s" 2>/dev/null || echo 0)
NOW_EPOCH=$(date "+%s")
AGE_DAYS=$(( (NOW_EPOCH - SYNCED_EPOCH) / 86400 ))

if [ "$AGE_DAYS" -gt 7 ]; then
  echo ""
  echo "Warning: KB was synced $AGE_DAYS days ago. Consider running: npm run sync-kb"
fi

exit 0
