# API Contracts

Single source of truth for API types and runtime validators.

## Architecture

```
backend/contracts/index.ts   <-- SOURCE OF TRUTH
       |
       | (sync script)
       v
frontend/lib/contracts.ts    <-- AUTO-GENERATED
       |
       v
frontend/lib/adapters.ts     <-- Runtime validators
```

## Source of Truth

**Location:** `backend/contracts/index.ts`

This file contains:
- Zod schemas for runtime validation
- TypeScript types inferred from schemas
- All API request/response shapes

## Contracts Defined

| Contract | Description |
|----------|-------------|
| `DecisionResponse` | Response from `/decision/evaluate` |
| `AssuranceResponse` | Response from `GET /assurance/{id}` |
| `AssuranceArtifact` | Immutable decision artifact |
| `AnswerBlock` | Item in `/api/answers` response |
| `AnswersListResponse` | Full `/api/answers` response |
| `EmbedEvent` | Embed tracking event payload |
| `FollowUpSubscription` | Follow-up subscription request |

## Updating Contracts

1. **Edit source:** `backend/contracts/index.ts`
2. **Sync to frontend:**
   ```bash
   cd frontend/safari-index
   npm run sync-contracts
   ```
3. **Verify builds:**
   ```bash
   npm run build
   npm run test
   ```
4. **Verify backend compiles** (if using shared types)

## Frontend Usage

```typescript
// Import types
import type { DecisionResponse, AssuranceArtifact } from './contracts';

// Import schemas for validation
import { DecisionResponseSchema } from './contracts';

// Use validators from adapters
import { normalizeDecisionResponse } from './adapters';

const validated = normalizeDecisionResponse(rawData);
```

## Runtime Validation

Frontend validates API responses at runtime using Zod:
- Invalid responses throw `ContractError`
- Errors route to existing calm error states
- No new error messages shown to users

## Adding a New Contract

1. Add Zod schema to `backend/contracts/index.ts`:
   ```typescript
   export const NewContractSchema = z.object({
     field: z.string(),
   });
   export type NewContract = z.infer<typeof NewContractSchema>;
   ```

2. Run sync script
3. Add validator to `frontend/lib/adapters.ts`:
   ```typescript
   export const normalizeNewContract: Validator<NewContract> =
     createValidator(NewContractSchema, 'NewContract');
   ```

## Preventing Schema Drift

- Types are derived from schemas (`z.infer<typeof Schema>`)
- Single source eliminates manual sync
- Runtime validation catches API changes early
- Tests verify contract compatibility

## CI Guard

CI runs `npm run check-contracts` which:
1. Syncs contracts from backend
2. Fails if any diff is detected

**If CI fails with "Contracts are out of sync":**
```bash
cd frontend/safari-index
npm run sync-contracts
git add lib/contracts.ts
git commit --amend   # or new commit
git push
```

## Local Development

Use `npm run build:strict` to check contracts before building:
```bash
npm run build:strict   # fails if contracts stale
```

Or check manually:
```bash
npm run check-contracts
```

## Scripts Reference

| Script | Purpose |
|--------|---------|
| `sync-contracts` | Copy backend contracts to frontend |
| `check-contracts` | Sync and fail if diff (CI use) |
| `build:strict` | Check freshness, then build |

## Governance

- Per MVP_FREEZE.md: No new types that change visible output
- Per 10_data_model.md: Types must match documented schemas
- Per 12_ai_prompts.md: Output formats are canonical
