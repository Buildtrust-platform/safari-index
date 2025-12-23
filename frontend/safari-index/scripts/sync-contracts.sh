#!/bin/bash
# Sync shared contracts from backend to frontend
#
# Usage: ./scripts/sync-contracts.sh
#
# This copies the single source of truth (backend/contracts/index.ts)
# to the frontend lib directory. Run this after updating contracts.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(dirname "$SCRIPT_DIR")"
BACKEND_CONTRACTS="$FRONTEND_DIR/../../backend/contracts/index.ts"
FRONTEND_CONTRACTS="$FRONTEND_DIR/lib/contracts.ts"

if [ ! -f "$BACKEND_CONTRACTS" ]; then
  echo "Error: Backend contracts not found at $BACKEND_CONTRACTS"
  exit 1
fi

echo "Syncing contracts from backend to frontend..."

# Create output file with header
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

# Replace SYNC_TIMESTAMP with current date
sed -i '' "s/SYNC_TIMESTAMP/$(date -u +"%Y-%m-%dT%H:%M:%SZ")/" "$TEMP_FILE"

# Append original content (skip header comment and import)
# Start from line after "import { z } from 'zod';"
grep -n "import { z }" "$BACKEND_CONTRACTS" | head -1 | cut -d: -f1 | xargs -I{} sh -c "tail -n +\$(({} + 1)) '$BACKEND_CONTRACTS' >> '$TEMP_FILE'"

mv "$TEMP_FILE" "$FRONTEND_CONTRACTS"

echo "Contracts synced successfully to $FRONTEND_CONTRACTS"
