# Snapshot Cache Verification Checklist

## Overview

This document provides verification procedures for the Safari Index snapshot cache system.
The cache eliminates "At capacity" refusals for normal decision page views by:

1. Pre-computing decisions for P0 topics using the prewarm script
2. Serving instant responses from DynamoDB snapshot table
3. Using session_id convention to distinguish page views from user-customized inputs

## Architecture Summary

```
Frontend (decision page)          Backend (decision-orchestrator)
       |                                    |
       | session_id: sess_page_<topic_id>   |
       +----------------->------------------>+ isDefaultInput() checks session_id
       |                                    |     - sess_page_* → cacheable
       |                                    |     - sess_prewarm_* → cacheable
       |                                    |     - sess_user_* → bypass cache
       |                                    |
       | <-- X-Snapshot-Status: hit --------+
       | <-- X-Lock-Status: skipped --------+
       | <-- X-Bedrock-Called: false -------+
```

## Verification Commands

### 1. Check Backend Compilation

```bash
cd backend/decision-orchestrator
npx tsc --noEmit
```

Expected: No errors

### 2. Run Prewarm Script (Dry Run)

```bash
cd /path/to/safari-index
npx ts-node scripts/prewarm-snapshots.ts --env=staging --dry-run --verbose
```

Expected output:
- Lists all P0 topics
- Shows topic count (should be ~40)
- All marked as `snapshot=dry-run`

### 3. Prewarm Staging Environment

```bash
npx ts-node scripts/prewarm-snapshots.ts --env=staging --rate-limit=2000 --verbose
```

Expected output per topic:
- `✓` = Fresh evaluation (first time)
- `⚡` = Cache hit (already prewarmed)
- `snapshot=hit|miss|stale` shows cache state
- `lock=acquired|skipped` shows lock state
- `bedrock=true|false` shows AI invocation

### 4. Verify Cache Hit on Second Run

```bash
# Run prewarm again - all should be cache hits
npx ts-node scripts/prewarm-snapshots.ts --env=staging --verbose
```

Expected:
- All topics show `⚡` (cached)
- `snapshot=hit` for all
- `bedrock=false` for all

### 5. Manual cURL Verification

Test a single decision endpoint:

```bash
# First request (should populate cache)
curl -X POST https://api.staging.safariindex.com/decision/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "task": "DECISION",
    "tracking": { "session_id": "sess_page_first-timer-ready" },
    "user_context": {
      "traveler_type": "first_time",
      "budget_band": "fair_value",
      "pace_preference": "balanced",
      "drive_tolerance_hours": 4,
      "risk_tolerance": "medium",
      "dates": { "type": "flexible" },
      "group_size": 2,
      "prior_decisions": []
    },
    "request": {
      "question": "Am I ready for my first safari?",
      "scope": "thin_edge_scope_only=true",
      "destinations_considered": ["Tanzania", "Kenya", "Botswana"],
      "constraints": {}
    },
    "facts": {
      "known_constraints": [],
      "known_tradeoffs": [],
      "destination_notes": []
    },
    "policy": {
      "must_refuse_if": ["guarantee_requested", "inputs_conflict_unbounded", "missing_material_inputs"],
      "forbidden_phrases": ["unforgettable", "magical", "once-in-a-lifetime"]
    }
  }' \
  -v 2>&1 | grep -E "X-(Snapshot|Lock|Bedrock|Decision)"
```

Expected headers:
```
< X-Snapshot-Status: hit (or miss on first call)
< X-Lock-Status: acquired (or skipped)
< X-Bedrock-Called: true (or false if cached)
< X-Decision-Id: dec_...
```

### 6. Verify User Override Bypasses Cache

```bash
# Request with user override session_id (should bypass cache)
curl -X POST https://api.staging.safariindex.com/decision/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "task": "DECISION",
    "tracking": { "session_id": "sess_user_test_1234" },
    ...
  }' \
  -v 2>&1 | grep -E "X-(Snapshot|Bedrock)"
```

Expected:
```
< X-Snapshot-Status: skipped
< X-Bedrock-Called: true
```

## Expected Behaviors

### Normal Decision Page View

| Scenario | snapshot_status | lock_status | bedrock_called |
|----------|-----------------|-------------|----------------|
| Cache hit (prewarmed) | hit | skipped | false |
| Cache miss (first view) | miss | acquired | true |
| Cache stale (>24h) | stale | acquired | true |
| Lock contention | locked | existing | false |

### User-Customized Input (Preflight Wizard)

| Scenario | snapshot_status | lock_status | bedrock_called |
|----------|-----------------|-------------|----------------|
| Any user override | skipped | skipped | true |

### Error Conditions

| Scenario | snapshot_status | lock_status | bedrock_called |
|----------|-----------------|-------------|----------------|
| DynamoDB unavailable | skipped | unavailable | true |
| Bedrock error | miss/stale | acquired | true (attempted) |

## Troubleshooting

### "At capacity" still appearing

1. Check session_id convention:
   - Page views must use `sess_page_<topic_id>`
   - Prewarm must use `sess_prewarm_<topic_id>`

2. Verify DynamoDB snapshot table exists:
   ```bash
   aws dynamodb describe-table --table-name safari-index-snapshots
   ```

3. Check Lambda environment variables:
   - `SNAPSHOT_TABLE` should be set
   - `DYNAMODB_ENDPOINT` should NOT be set in production

### Cache misses when expecting hits

1. Verify inputs_hash consistency:
   - Compare `hashInputs()` output between prewarm and page request
   - Check that topic data (question, destinations, risks) matches

2. Check topic_id extraction:
   - `extractTopicId()` uses hash of `question:scope`
   - Same question + scope = same topic_id

### Lock infrastructure errors

1. DynamoDB conditional writes may fail if:
   - Table doesn't have correct key schema (`topic_id` as partition key)
   - IAM permissions missing for `UpdateItem` with conditions

2. Lock failures are non-fatal:
   - `lockResult.status === 'unavailable'` proceeds without caching
   - Decision still works, just not cached

## Monitoring Queries (CloudWatch Logs Insights)

### Cache hit rate
```
fields @timestamp, @message
| filter @message like /Snapshot cache hit/
| stats count() as hits by bin(1h)
```

### Lock acquisition failures
```
fields @timestamp, @message
| filter @message like /Lock held by another process/
| stats count() as contention by bin(1h)
```

### Bedrock invocation rate
```
fields @timestamp, @message
| filter @message like /Invoking Bedrock/
| stats count() as invocations by bin(1h)
```

## Post-Deployment Verification

After deploying to staging or production:

1. Run prewarm script
2. Visit `/decisions/am-i-ready-for-first-safari`
3. Open browser DevTools → Network → Look for `/decision/evaluate` response headers
4. Verify `X-Snapshot-Status: hit`
5. Repeat for 2-3 other P0 topic pages
