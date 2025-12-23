# Staging Deployment Commands & Verification

## Part A: Deploy and Verify Staging Isolation

### 1. Deploy Staging Stacks

```bash
# From infrastructure directory
cd infrastructure

# Build backend first
cd ../backend/decision-orchestrator
npm run build
cd ../../infrastructure

# Deploy staging (creates separate tables and Lambda)
ENV_NAME=staging npx cdk deploy --all --require-approval never

# Note outputs:
# - StagingSafariIndexApiStack.ApiUrl
# - StagingSafariIndexDataStack.DecisionTableName (staging-safari-index-decisions)
# - StagingSafariIndexDataStack.EventTableName (staging-safari-index-events)
```

### 2. Verify Resource Prefixes

```bash
# Confirm staging Lambda exists with prefix
aws lambda get-function \
  --function-name staging-safari-index-decision-orchestrator \
  --query 'Configuration.FunctionName' \
  --region eu-central-1

# Confirm staging tables exist
aws dynamodb describe-table \
  --table-name staging-safari-index-decisions \
  --query 'Table.TableName' \
  --region eu-central-1

aws dynamodb describe-table \
  --table-name staging-safari-index-events \
  --query 'Table.TableName' \
  --region eu-central-1
```

---

## Verification Checklist

### A. Confirm Staging API Routes Exist

```bash
# Get staging API URL
STAGING_API=$(aws cloudformation describe-stacks \
  --stack-name StagingSafariIndexApiStack \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
  --output text \
  --region eu-central-1)

echo "Staging API: $STAGING_API"

# Test decision/evaluate endpoint exists (expect 400 - missing body)
curl -s -o /dev/null -w "%{http_code}" \
  -X POST "${STAGING_API}decision/evaluate" \
  -H "Content-Type: application/json"
# Expected: 400 (endpoint exists, rejects empty body)

# Test ops/health endpoint
curl -s "${STAGING_API}ops/health" | jq .
# Expected: JSON with timestamp, logic_version, status, health_signals, guardrails
```

### B. Confirm Staging Writes to Staging Tables

```bash
# Count events in staging table BEFORE test
STAGING_COUNT_BEFORE=$(aws dynamodb scan \
  --table-name staging-safari-index-events \
  --select COUNT \
  --query 'Count' \
  --region eu-central-1)
echo "Staging events before: $STAGING_COUNT_BEFORE"

# Make a test request to staging API
curl -X POST "${STAGING_API}decision/evaluate" \
  -H "Content-Type: application/json" \
  -d '{
    "topic_id": "tz-feb",
    "traveler_context": {
      "trip_type": "first_safari",
      "budget_tier": "mid_range",
      "flexibility": "moderate",
      "travel_month": "February"
    }
  }'

# Count events in staging table AFTER test
STAGING_COUNT_AFTER=$(aws dynamodb scan \
  --table-name staging-safari-index-events \
  --select COUNT \
  --query 'Count' \
  --region eu-central-1)
echo "Staging events after: $STAGING_COUNT_AFTER"

# Verify count increased
if [ "$STAGING_COUNT_AFTER" -gt "$STAGING_COUNT_BEFORE" ]; then
  echo "PASS: Staging writes to staging-safari-index-events"
else
  echo "FAIL: No new events in staging table"
fi
```

### C. Confirm Prod Tables Unchanged

```bash
# Get prod event count
PROD_COUNT=$(aws dynamodb scan \
  --table-name safari-index-events \
  --select COUNT \
  --query 'Count' \
  --region eu-central-1)
echo "Prod events: $PROD_COUNT"

# Note: Run before and after staging tests to verify no change
# If prod count changed during staging tests, isolation is BROKEN
```

### D. Confirm APP_MODE Mismatch Blocked

```bash
cd frontend/safari-index

# Test 1: Production build should fail with build mode
APP_MODE=build npm run build:prod
# Expected: EXIT 1 with "BUILD BLOCKED" message

# Test 2: Staging build should fail with observation mode
APP_MODE=observation npm run build:staging
# Expected: EXIT 1 with "BUILD BLOCKED" message

# Test 3: Correct mode should pass
APP_MODE=observation npm run build:prod
# Expected: EXIT 0, build proceeds

APP_MODE=build npm run build:staging
# Expected: EXIT 0, build proceeds
```

---

## Quick Verification Script

Save as `scripts/verify-staging-isolation.sh`:

```bash
#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo "==========================================="
echo "Safari Index Staging Isolation Verification"
echo "==========================================="

# 1. Check staging Lambda
echo -n "Checking staging Lambda... "
if aws lambda get-function --function-name staging-safari-index-decision-orchestrator --region eu-central-1 > /dev/null 2>&1; then
  echo -e "${GREEN}OK${NC}"
else
  echo -e "${RED}MISSING${NC}"
  exit 1
fi

# 2. Check staging tables
for table in decisions events reviews assurances; do
  echo -n "Checking staging-safari-index-${table}... "
  if aws dynamodb describe-table --table-name "staging-safari-index-${table}" --region eu-central-1 > /dev/null 2>&1; then
    echo -e "${GREEN}OK${NC}"
  else
    echo -e "${RED}MISSING${NC}"
    exit 1
  fi
done

# 3. Check staging API health
STAGING_API=$(aws cloudformation describe-stacks \
  --stack-name StagingSafariIndexApiStack \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
  --output text \
  --region eu-central-1 2>/dev/null)

if [ -z "$STAGING_API" ]; then
  echo -e "${RED}FAIL${NC}: Could not get staging API URL"
  exit 1
fi

echo -n "Checking staging /ops/health... "
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${STAGING_API}ops/health")
if [ "$HEALTH_STATUS" = "200" ]; then
  echo -e "${GREEN}OK${NC}"
else
  echo -e "${RED}FAIL (HTTP $HEALTH_STATUS)${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}All staging isolation checks passed${NC}"
echo "Staging API URL: $STAGING_API"
```

---

## Resource Summary

| Resource | Production | Staging |
|----------|------------|---------|
| Data Stack | SafariIndexDataStack | StagingSafariIndexDataStack |
| API Stack | SafariIndexApiStack | StagingSafariIndexApiStack |
| Lambda | safari-index-decision-orchestrator | staging-safari-index-decision-orchestrator |
| Decisions Table | safari-index-decisions | staging-safari-index-decisions |
| Events Table | safari-index-events | staging-safari-index-events |
| Reviews Table | safari-index-reviews | staging-safari-index-reviews |
| Assurances Table | safari-index-assurances | staging-safari-index-assurances |
| API Name | Safari Index Decision API | Staging Safari Index Decision API |

---

## Part B: Staging-Only Routes

### /explore Route

**Purpose**: Browse and discover decision topics.

### File List

| File | Purpose |
|------|---------|
| `app/explore/page.tsx` | Main explore page with APP_MODE gate |
| `app/explore/explore-types.ts` | TypeScript types for filters, sort, topics |
| `app/explore/explore-data.ts` | Data utilities for filtering/sorting/searching |

### Features

- **Search**: Client-side search over titles/tags
- **Filters**: Region, Travel Style, Decision Type
- **Sort**: Most Used, Most Refused, Newest (mock metrics in staging)
- **Gate**: Returns 404 in observation mode (production)

### Data Source

Uses existing `app/content/decision-topics.ts` registry (10 topics).
No new seed files needed - transforms existing DecisionTopic to ExploreTopic.

---

## Production Protection Notes

### How /explore is Protected

1. **APP_MODE Gate in page.tsx**:
   ```typescript
   if (!isBuildMode()) {
     notFound();  // Returns 404 in observation mode
   }
   ```

2. **Default to observation mode**:
   ```typescript
   // lib/app-mode.ts
   export function getAppMode(): AppMode {
     const mode = process.env.NEXT_PUBLIC_APP_MODE || process.env.APP_MODE;
     if (mode === 'build') return 'build';
     return 'observation';  // Default = safe
   }
   ```

3. **Build protection scripts**:
   - `npm run build:prod` requires APP_MODE=observation
   - `npm run build:staging` requires APP_MODE=build
   - Mismatch = build fails

### What Cannot Happen in Production

| Action | Protection |
|--------|------------|
| /explore route visible | `isBuildMode()` returns false → 404 |
| Staging code deployed | `build:prod` fails if APP_MODE=build |
| Staging writes to prod tables | Lambda reads table names from env vars (prefixed) |
| New navigation added | `assertObservationSafe('navigation_elements')` throws |

### Verification in Production

```bash
# Production /explore should 404
curl -s -o /dev/null -w "%{http_code}" https://safariindex.com/explore
# Expected: 404

# Production /decisions/tanzania-safari-february should work
curl -s -o /dev/null -w "%{http_code}" https://safariindex.com/decisions/tanzania-safari-february
# Expected: 200
```

### Safe to Iterate in Staging

- /explore route fully available
- New filters/sorts can be added
- Mock metrics can be replaced with real data
- No impact on production routes or decision logic

---

### /compare Route

**Purpose**: Side-by-side comparison of two decisions.

#### File List

| File | Purpose |
|------|---------|
| `app/compare/page.tsx` | Main compare page with APP_MODE gate |
| `app/compare/compare-types.ts` | TypeScript types for panel state |
| `app/compare/ComparePanel.tsx` | Single decision panel component |

#### Features

- **Selectors**: Two dropdowns to pick Decision A and Decision B
- **Compare button**: Fetches both decisions in parallel
- **Side-by-side panels**: Shows for each:
  - Question + context
  - Verdict (outcome + confidence)
  - Headline + summary
  - Fit/Misfit (top 2 each)
  - Trade-offs (top 3 gains/losses)
  - Change conditions (top 3)
  - Assumptions (top 3)
- **Refusal handling**: Shows refusal panel as-is (no copy changes)
- **Error handling**: Uses existing error components
- **Dev analytics**: Logs compare events to console (staging only)
- **Gate**: Returns 404 in observation mode (production)

#### Data Source

- Uses existing `decision-topics.ts` registry for dropdown options
- Fetches decisions via existing `/decision/evaluate` endpoint
- Uses existing `buildRequestEnvelope()` from `lib/page-assembly.ts`
- Uses existing `normalizeDecisionResponse()` for contract validation

#### How /compare is Protected

Same pattern as /explore:
```typescript
if (!isBuildMode()) {
  notFound();  // Returns 404 in observation mode
}
```

#### Verification

```bash
# In staging (APP_MODE=build): returns 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/compare
# Expected: 200

# In production (APP_MODE=observation): returns 404
# (would need to restart server without APP_MODE=build)
```

---

### /decisions/[slug]/variants Route

**Purpose**: Test how different assumptions change the decision outcome.

#### File List

| File | Purpose |
|------|---------|
| `app/decisions/[slug]/variants/page.tsx` | Main variants page with APP_MODE gate |
| `app/decisions/[slug]/variants/layout.tsx` | Adds noindex, nofollow metadata |
| `app/decisions/[slug]/variants/variant-types.ts` | TypeScript types for form state |
| `app/decisions/[slug]/variants/VariantForm.tsx` | Assumption toggles/selects form |
| `app/decisions/[slug]/variants/VariantCard.tsx` | Variant result card component |

#### Features

- **Base decision**: Shows the original decision at top (uses VerdictCard)
- **Assumption form**: 8 toggles/selects mapping to StandardInputEnvelope:
  - Budget tier (Budget / Mid-range / Luxury)
  - Travel style (First Safari / Repeat / Family / Honeymoon / Photography / Adventure)
  - Crowd tolerance (Low / Medium / High)
  - Comfort tolerance (Low / Medium / High)
  - Date flexibility (Fixed / Flexible / Very flexible)
  - Risk tolerance (Low / Medium / High)
  - Group composition (Solo / Couple / Family / Friends)
  - Time available (3-5 / 6-8 / 9-12 / 13+ days)
- **Run variant button**: Fetches decision with modified assumptions
- **Variant cards**: Show for each:
  - Variant label (what changed)
  - Outcome + confidence
  - Headline + summary
  - "What changed the outcome" (if outcome differs vs base)
- **Refusal handling**: Shows refusal using existing UI pattern
- **Dev analytics**: Logs VARIANT_RUN to console (staging only)
- **noindex**: Metadata prevents search indexing
- **Gate**: Returns 404 in observation mode (production)

#### Data Flow

1. Uses existing `buildRequestEnvelope()` as base
2. `buildVariantEnvelope()` overrides fields from form state
3. Fetches via existing `/decision/evaluate` endpoint
4. Uses `normalizeDecisionResponse()` for contract validation
5. Derives change reason from first change_condition or tradeoff

#### Integrity Constraints

- Does NOT alter the base decision page
- Does NOT create new topics
- Does NOT write to any database
- Variants are ephemeral (client-side only)

#### How /variants is Protected

Same pattern as /explore and /compare:
```typescript
if (!isBuildMode()) {
  notFound();  // Returns 404 in observation mode
}
```

Plus layout.tsx adds:
```typescript
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
```

#### Verification

```bash
# In staging (APP_MODE=build): returns 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/decisions/tanzania-safari-february/variants
# Expected: 200

# Verify noindex header
curl -s -I http://localhost:3000/decisions/tanzania-safari-february/variants | grep -i robot
# Expected: X-Robots-Tag: noindex, nofollow (or via meta tag in HTML)
```
