#!/bin/bash
# Check if KB is in sync between frontend and backend
#
# Usage: ./scripts/check-kb.sh
#
# Returns 0 if in sync, 1 if out of sync.
# Used in CI to fail builds if KB is stale.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(dirname "$SCRIPT_DIR")"
BACKEND_KB_DATA="$FRONTEND_DIR/../../backend/decision-orchestrator/src/kb/kb-data.json"

# Check if backend KB data exists
if [ ! -f "$BACKEND_KB_DATA" ]; then
  echo "Error: Backend KB data not found at $BACKEND_KB_DATA"
  echo "Run: npm run sync-kb"
  exit 1
fi

echo "Generating fresh KB bundle for comparison..."

# Generate fresh bundle (to temp location)
cd "$FRONTEND_DIR"
TEMP_BUNDLE=$(mktemp)
npx ts-node --project scripts/tsconfig.json -e "
const fs = require('fs');
const { evidenceCards, bannedPhrases, topics } = require('./app/content/kb');

function inferTags(topic) {
  const tags = [topic.bucket.replace('_', '-')];
  topic.destinations.forEach(d => tags.push(d.toLowerCase()));
  const id = topic.topic_id;
  if (id.includes('tz-') || id.includes('tanzania')) tags.push('tanzania');
  if (id.includes('ke-') || id.includes('kenya')) tags.push('kenya');
  if (id.includes('bw-') || id.includes('botswana')) tags.push('botswana');
  if (id.includes('budget') || id.includes('cost')) tags.push('cost');
  if (id.includes('timing') || id.includes('season')) tags.push('timing');
  if (id.includes('migration')) tags.push('migration');
  return [...new Set(tags)];
}

const topicMeta = {};
for (const [id, t] of Object.entries(topics)) {
  topicMeta[id] = {
    topic_id: t.topic_id,
    title: t.title,
    bucket: t.bucket,
    destinations: t.destinations,
    tags: inferTags(t),
  };
}

const bundle = {
  version: '1.0.0',
  evidence: evidenceCards,
  banned_phrases: bannedPhrases,
  topics: topicMeta,
};

// Remove synced_at for comparison (it changes each run)
fs.writeFileSync('$TEMP_BUNDLE', JSON.stringify(bundle, null, 2));
"

# Extract current bundle without synced_at for comparison
CURRENT_BUNDLE=$(mktemp)
jq 'del(.synced_at)' "$BACKEND_KB_DATA" > "$CURRENT_BUNDLE"

# Compare
if diff -q "$TEMP_BUNDLE" "$CURRENT_BUNDLE" > /dev/null 2>&1; then
  echo "KB is in sync!"
  rm -f "$TEMP_BUNDLE" "$CURRENT_BUNDLE"
  exit 0
else
  echo "Error: KB is out of sync!"
  echo "Frontend KB has changed since last sync."
  echo ""
  echo "Run: npm run sync-kb"
  echo ""
  echo "Diff preview:"
  diff "$CURRENT_BUNDLE" "$TEMP_BUNDLE" | head -20 || true
  rm -f "$TEMP_BUNDLE" "$CURRENT_BUNDLE"
  exit 1
fi
