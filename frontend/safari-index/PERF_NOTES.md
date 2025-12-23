# Performance Baseline

Build date: 2024-12-21
Next.js: 16.1.0 (Turbopack)

## Build Output

```
Route (app)
┌ ○ /                          (Static)
├ ○ /_not-found                (Static)
├ ƒ /api/answers               (Dynamic)
├ ƒ /api/events/embed          (Dynamic)
├ ƒ /api/followup/subscribe    (Dynamic)
├ ƒ /api/ops/health            (Dynamic)
├ ƒ /api/review-queue          (Dynamic)
├ ƒ /assurance/[id]            (Dynamic)
├ ○ /assurance/checkout        (Static)
├ ● /decisions/[slug]          (SSG - 10 paths)
├ ƒ /dev/components            (Dynamic - dev only)
├ ƒ /embed/decision/[id]       (Dynamic)
└ ○ /sitemap.xml               (Static)

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

## Bundle Size

Static output: ~964K total

Largest chunks (from .next/static/chunks):
- 220K - React/Next.js core
- 112K - Client runtime (x2)
- 40K  - Application code
- 36K  - Route handlers
- 32K  - Shared components

## Dependencies

Production (3):
- next@16.1.0
- react@19.2.3
- react-dom@19.2.3

No heavy third-party libraries. Bundle is framework-minimal.

## Known Observations

### Fonts
- Using `next/font/google` for Geist Sans and Geist Mono
- Proper font-display and subset configuration
- CSS variables: `--font-geist-sans`, `--font-geist-mono`

### CSS
- Tailwind CSS 4 via PostCSS
- Global styles in globals.css (~83 lines)
- Focus states and reduced-motion respected

### Data Fetching
- Decision pages: client-side fetch to external API
- Topic registry: static TypeScript data (tree-shakeable)
- Related topics: static graph lookups

### Caching Behavior
- SSG pages: /decisions/[slug] uses generateStaticParams
- Dynamic routes: API endpoints, embeds, dev pages
- No explicit cache headers configured

## Implemented Optimizations

1. **Cache headers** (next.config.ts):
   - Static assets: `max-age=31536000, immutable`
   - Embed pages: `max-age=300, stale-while-revalidate=60`
   - Dev routes: `no-store, must-revalidate`
   - API routes: `no-store`

2. **Build CI script** (package.json):
   - `npm run ci` - runs lint, build, and test
   - `npm run test` - Playwright tests

## Lint Status

All lint errors resolved:
- `app/assurance/checkout/page.tsx` - Changed `<a>` to `<Link>`
- `app/components/NextSensibleStep.tsx` - Removed unnecessary useState, compute step directly from props

## Playwright Tests

Tests are configured in `e2e/` directory. Note:
- If dev server is already running, stop it before running `npm run test`
- Or use `npm run test` which will start its own server
- Playwright config uses `reuseExistingServer: !process.env.CI` for local dev

## Verification Commands

```bash
# Build and check output
npm run build

# Check bundle size
du -sh .next/static

# List largest chunks
find .next/static -name "*.js" -exec du -h {} \; | sort -rh | head -10

# Run dev server
npm run dev

# Run tests (requires Playwright)
npx playwright test
```
