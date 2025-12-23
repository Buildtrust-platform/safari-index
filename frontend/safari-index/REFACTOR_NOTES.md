# Refactor Notes

Internal code consolidation with zero-output-change guarantee.

## Changes Made

### Shared Libraries Created

**lib/api-client.ts**
- Centralizes API_BASE constant
- Provides typed `apiGet`/`apiPost` helpers with timeout
- Exports `isSuccess`/`isError` type guards

**lib/metadata.ts**
- Centralizes SITE_ORIGIN and canonical URL helpers
- Provides metadata builder functions for different page types
- Exports standard robots directives

**lib/page-assembly.ts**
- Extracted from decisions page
- `buildRequestEnvelope()` - topic to API request mapping
- `deriveFitMisfitModel()` - outcome to fit/misfit UI model
- `extractPrimaryCondition()` - derive primary condition from assumptions
- `extractInvalidatingCondition()` - derive invalidating condition from change conditions
- `DecisionResponse` type export

### Pages Refactored

| File | Change |
|------|--------|
| `/app/decisions/[slug]/page.tsx` | Uses `buildRequestEnvelope`, `deriveFitMisfitModel`, `extractPrimaryCondition`, `extractInvalidatingCondition` from lib/page-assembly.ts; `API_BASE` from lib/api-client.ts |
| `/app/assurance/[id]/page.tsx` | Uses `API_BASE` from lib/api-client.ts |
| `/app/assurance/checkout/page.tsx` | Uses `API_BASE` from lib/api-client.ts |
| `/app/embed/decision/[id]/page.tsx` | Uses `API_BASE` from lib/api-client.ts |

### Not Changed

- No output changes (HTML/DOM identical)
- No behavioral changes
- Special error handling (402/404/410) preserved in assurance/embed pages
- Checkout page retains inline AssuranceResponse type (different shape from assurance page)

## Verification

- Build passes: `npm run build`
- Tests pass: 48/48 Playwright tests
- No TypeScript errors

## Future Considerations

- `apiGet`/`apiPost` helpers could replace manual fetch calls when pages need changes
- Metadata helpers available but not adopted yet (would require generateMetadata changes)
