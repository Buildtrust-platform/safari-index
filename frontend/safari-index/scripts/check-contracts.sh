#!/bin/bash
# CI Guard: Ensure contracts are synced
#
# Usage: ./scripts/check-contracts.sh
#
# This script:
# 1. Runs sync-contracts to update frontend from backend source
# 2. Checks if git shows any diff
# 3. Fails if contracts were stale (diff detected)
#
# Use in CI to prevent PRs with outdated contracts from merging.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(dirname "$SCRIPT_DIR")"
CONTRACTS_FILE="$FRONTEND_DIR/lib/contracts.ts"

echo "Checking contracts are in sync..."

# Hash content excluding timestamp line (line 7 contains "Last synced:")
hash_content() {
  sed '7d' "$1" | md5 -q 2>/dev/null || sed '7d' "$1" | md5sum | cut -d' ' -f1
}

# Store hash before sync (ignoring timestamp)
HASH_BEFORE=$(hash_content "$CONTRACTS_FILE")

# Run sync
"$SCRIPT_DIR/sync-contracts.sh"

# Store hash after sync (ignoring timestamp)
HASH_AFTER=$(hash_content "$CONTRACTS_FILE")

# Compare (ignoring timestamp changes)
if [ "$HASH_BEFORE" != "$HASH_AFTER" ]; then
  echo ""
  echo "ERROR: Contracts are out of sync!"
  echo ""
  echo "The frontend contracts file differs from the backend source."
  echo "This means backend/contracts/index.ts was updated but the frontend was not synced."
  echo ""
  echo "To fix:"
  echo "  cd frontend/safari-index"
  echo "  npm run sync-contracts"
  echo "  git add lib/contracts.ts"
  echo "  git commit --amend"
  echo ""
  exit 1
fi

echo "Contracts are in sync."
