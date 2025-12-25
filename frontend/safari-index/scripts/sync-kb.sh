#!/bin/bash
# Sync KB data from frontend to backend
#
# Usage: ./scripts/sync-kb.sh
#
# This generates a JSON bundle from frontend KB and copies it to backend.
# The backend loads this at build time for prompt injection.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(dirname "$SCRIPT_DIR")"
BACKEND_KB_DIR="$FRONTEND_DIR/../../backend/decision-orchestrator/src/kb"

# Ensure backend KB directory exists
mkdir -p "$BACKEND_KB_DIR"

echo "Generating KB bundle from frontend..."

# Generate the bundle
cd "$FRONTEND_DIR"
npx ts-node --project scripts/tsconfig.json scripts/generate-kb-bundle.ts

# Check if bundle was generated
if [ ! -f "$FRONTEND_DIR/kb-bundle.json" ]; then
  echo "Error: KB bundle generation failed"
  exit 1
fi

echo "Syncing KB bundle to backend..."

# Copy bundle to backend
cp "$FRONTEND_DIR/kb-bundle.json" "$BACKEND_KB_DIR/kb-data.json"

# Also sync raw JSON files for direct access
echo "Syncing raw KB files..."

# Copy evidence files
mkdir -p "$BACKEND_KB_DIR/evidence"
if [ -d "$FRONTEND_DIR/app/content/kb/evidence" ]; then
  cp -r "$FRONTEND_DIR/app/content/kb/evidence/"*.json "$BACKEND_KB_DIR/evidence/" 2>/dev/null || true
fi

# Copy template files
mkdir -p "$BACKEND_KB_DIR/templates"
if [ -d "$FRONTEND_DIR/app/content/kb/templates" ]; then
  cp -r "$FRONTEND_DIR/app/content/kb/templates/"*.json "$BACKEND_KB_DIR/templates/" 2>/dev/null || true
fi

# Clean up temp bundle from frontend
rm -f "$FRONTEND_DIR/kb-bundle.json"

echo "KB sync complete!"
echo "  Backend KB data: $BACKEND_KB_DIR/kb-data.json"
echo "  Evidence files: $BACKEND_KB_DIR/evidence/"
echo "  Template files: $BACKEND_KB_DIR/templates/"
