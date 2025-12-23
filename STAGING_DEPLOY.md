# Staging Deployment Guide

Deploy a separate staging environment to iterate without affecting production.

## Architecture

```
Production (Observation Mode)         Staging (Build Mode)
─────────────────────────────         ────────────────────
APP_MODE=observation                  APP_MODE=build
safari-index-decisions                staging-safari-index-decisions
safari-index-events                   staging-safari-index-events
safari-index-reviews                  staging-safari-index-reviews
safari-index-assurances               staging-safari-index-assurances
SafariIndexApiStack                   StagingSafariIndexApiStack
SafariIndexDataStack                  StagingSafariIndexDataStack
```

## Quick Start

```bash
# Deploy staging backend
cd infrastructure
ENV_NAME=staging npx cdk deploy --all

# Build staging frontend
cd frontend/safari-index
APP_MODE=build npm run build
```

## Environment Variables

### Backend (CDK)

| Variable | Production | Staging |
|----------|------------|---------|
| `ENV_NAME` | `prod` (default) | `staging` |

Set before running CDK:
```bash
export ENV_NAME=staging
npx cdk deploy --all
```

### Frontend (Next.js)

| Variable | Production | Staging |
|----------|------------|---------|
| `NEXT_PUBLIC_APP_MODE` | `observation` | `build` |
| `NEXT_PUBLIC_API_URL` | prod API URL | staging API URL |

Create `.env.staging`:
```env
NEXT_PUBLIC_APP_MODE=build
NEXT_PUBLIC_API_URL=https://staging-api.execute-api.eu-central-1.amazonaws.com/v1
```

Build with staging config:
```bash
cp .env.staging .env.local
npm run build
```

## CDK Stack Names

The CDK app uses `ENV_NAME` to prefix all resources:

| Resource | Production | Staging |
|----------|------------|---------|
| Data Stack | `SafariIndexDataStack` | `StagingSafariIndexDataStack` |
| API Stack | `SafariIndexApiStack` | `StagingSafariIndexApiStack` |
| Lambda | `safari-index-decision-orchestrator` | `staging-safari-index-decision-orchestrator` |
| API Name | `Safari Index Decision API` | `Staging Safari Index Decision API` |

## DynamoDB Table Names

Tables are prefixed with environment name:

| Table | Production | Staging |
|-------|------------|---------|
| Decisions | `safari-index-decisions` | `staging-safari-index-decisions` |
| Events | `safari-index-events` | `staging-safari-index-events` |
| Reviews | `safari-index-reviews` | `staging-safari-index-reviews` |
| Assurances | `safari-index-assurances` | `staging-safari-index-assurances` |

## Preventing Cross-Environment Data

### Problem
Staging writes must never reach production tables.

### Solution
1. **Separate table names**: Tables are prefixed by environment
2. **Separate Lambda functions**: Each environment has its own Lambda
3. **Environment variables**: Lambda reads table names from env vars
4. **Build protection**: Build fails if APP_MODE doesn't match expected

### Verification
```bash
# Check staging Lambda env vars
aws lambda get-function-configuration \
  --function-name staging-safari-index-decision-orchestrator \
  --query 'Environment.Variables' \
  --region eu-central-1

# Should show staging-prefixed table names
```

## Deployment Workflow

### 1. Deploy Staging Backend

```bash
cd infrastructure

# Synthesize to verify changes
ENV_NAME=staging npx cdk synth

# Deploy data stack first
ENV_NAME=staging npx cdk deploy StagingSafariIndexDataStack

# Deploy API stack
ENV_NAME=staging npx cdk deploy StagingSafariIndexApiStack

# Or deploy all
ENV_NAME=staging npx cdk deploy --all
```

### 2. Get Staging API URL

After deployment:
```bash
aws cloudformation describe-stacks \
  --stack-name StagingSafariIndexApiStack \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
  --output text \
  --region eu-central-1
```

### 3. Deploy Staging Frontend

```bash
cd frontend/safari-index

# Create staging env file
cat > .env.local << EOF
NEXT_PUBLIC_APP_MODE=build
NEXT_PUBLIC_API_URL=<staging-api-url-from-step-2>
EOF

# Build with staging config
npm run build

# Deploy to staging host (Vercel, S3, etc.)
```

## Build Protection

The build process validates APP_MODE matches the deployment target:

```bash
# Production build - fails if APP_MODE != observation
npm run build:prod

# Staging build - fails if APP_MODE != build
npm run build:staging
```

Add to `package.json`:
```json
{
  "scripts": {
    "build:prod": "./scripts/check-app-mode.sh observation && next build",
    "build:staging": "./scripts/check-app-mode.sh build && next build"
  }
}
```

## Observation Mode Guardrails

In `observation` mode, these features throw `ObservationModeViolation`:

- New navigation elements
- CTA placement changes
- New topic discovery pages
- Pricing experiments
- Layout wrappers that change DOM structure

```typescript
import { assertObservationSafe } from './lib/app-mode';

// This throws in production, passes in staging
assertObservationSafe('navigation_elements');
```

## Cleanup

Remove staging environment:
```bash
cd infrastructure
ENV_NAME=staging npx cdk destroy --all
```

**Warning**: This deletes staging DynamoDB tables. Data is not recoverable.

## Troubleshooting

### "Observation Mode Violation" in production
- Ensure `NEXT_PUBLIC_APP_MODE=observation` for production builds
- Check that staging code isn't accidentally deployed to production

### Staging writes appearing in production tables
- Verify Lambda function name starts with `staging-`
- Check Lambda environment variables for table names
- Ensure you deployed with `ENV_NAME=staging`

### CDK deployment fails with "already exists"
- Each environment needs unique resource names
- Ensure `ENV_NAME` is set correctly before deployment

### Build fails with "Build Mode Mismatch"
- Check `APP_MODE` or `NEXT_PUBLIC_APP_MODE` environment variable
- Production requires `observation`, staging requires `build`

## Best Practices

1. **Always set ENV_NAME explicitly** when deploying infrastructure
2. **Never share API keys** between production and staging
3. **Test in staging first** before any production changes
4. **Use separate AWS accounts** if possible for complete isolation
5. **Monitor staging separately** to catch issues before production
