#!/bin/bash
# Pre-build guard: Check contracts are fresh (non-destructive)
#
# Usage: ./scripts/ensure-contracts-fresh.sh
#
# This script checks if contracts WOULD change if synced.
# Unlike check-contracts.sh, it does NOT modify files.
# Use before build to catch stale contracts early.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(dirname "$SCRIPT_DIR")"
BACKEND_CONTRACTS="$FRONTEND_DIR/../../backend/contracts/index.ts"
FRONTEND_CONTRACTS="$FRONTEND_DIR/lib/contracts.ts"

if [ ! -f "$BACKEND_CONTRACTS" ]; then
  echo "Warning: Backend contracts not found, skipping freshness check"
  exit 0
fi

if [ ! -f "$FRONTEND_CONTRACTS" ]; then
  echo "ERROR: Frontend contracts missing. Run: npm run sync-contracts"
  exit 1
fi

# Generate what the synced file would look like
TEMP_FILE=$(mktemp)
cat > "$TEMP_FILE" << 'EOF'
/**
 * AUTO-GENERATED - DO NOT EDIT DIRECTLY
 *
 * This file is synced from backend/contracts/index.ts
 * To update: edit backend/contracts/index.ts and run scripts/sync-contracts.sh
 *
 * Last synced: SYNC_TIMESTAMP
 */

import { z } from 'zod';

EOF

# Get content after import line from backend
grep -n "import { z }" "$BACKEND_CONTRACTS" | head -1 | cut -d: -f1 | xargs -I{} sh -c "tail -n +\$(({} + 1)) '$BACKEND_CONTRACTS' >> '$TEMP_FILE'"

# Compare content (ignoring timestamp line)
BACKEND_CONTENT=$(tail -n +12 "$TEMP_FILE" | md5 -q 2>/dev/null || tail -n +12 "$TEMP_FILE" | md5sum | cut -d' ' -f1)
FRONTEND_CONTENT=$(tail -n +12 "$FRONTEND_CONTRACTS" | md5 -q 2>/dev/null || tail -n +12 "$FRONTEND_CONTRACTS" | md5sum | cut -d' ' -f1)

rm "$TEMP_FILE"

if [ "$BACKEND_CONTENT" != "$FRONTEND_CONTENT" ]; then
  echo ""
  echo "ERROR: Contracts are stale!"
  echo ""
  echo "Run: npm run sync-contracts"
  echo ""
  exit 1
fi

echo "Contracts are fresh."
