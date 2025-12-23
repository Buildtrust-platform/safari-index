# SEO Verification Checklist

Pre-deployment checklist for SEO correctness.

## Quick Verification Commands

```bash
# Build and check for errors
npm run build

# Start production server locally
npm run start

# Verify sitemap (should only contain decision pages + homepage)
curl http://localhost:3000/sitemap.xml

# Verify robots.txt
curl http://localhost:3000/robots.txt

# Check decision page meta tags
curl -s http://localhost:3000/decisions/tanzania-safari-february | grep -E '<title>|<meta|canonical|og:'

# Check dev page returns 404 in production (should 404 without ENABLE_DEV_PAGES=true)
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/dev/components
```

---

## Canonical URLs

### Decision Pages (`/decisions/[slug]`)

| Check | Expected | How to Verify |
|-------|----------|---------------|
| Canonical present | `<link rel="canonical" href="https://safariindex.com/decisions/{slug}">` | View page source |
| Absolute URL | Uses `https://safariindex.com` origin | Check `alternates.canonical` in layout.tsx |
| Matches page URL | No trailing slash mismatch | Compare canonical to actual URL |

### Embed Pages (`/embed/decision/[id]`)

| Check | Expected | How to Verify |
|-------|----------|---------------|
| noindex | `<meta name="robots" content="noindex, nofollow">` | View page source |
| No canonical to self | Should NOT have canonical (or canonical to source decision) | View page source |

### Assurance Pages (`/assurance/[id]`)

| Check | Expected | How to Verify |
|-------|----------|---------------|
| noindex | `<meta name="robots" content="noindex, nofollow">` | Check layout.tsx |
| Not in sitemap | Should not appear in sitemap.xml | Check sitemap output |

---

## robots.txt

Location: `/public/robots.txt`

### Required Disallow Rules

```
Disallow: /api/
Disallow: /_next/
Disallow: /dev/
Disallow: /embed/
Disallow: /assurance/
```

### Verification

```bash
curl https://safariindex.com/robots.txt
```

---

## Sitemap

Location: `/app/sitemap.ts` (generates `/sitemap.xml`)

### Must Include

- Homepage (`/`)
- All published decision pages (`/decisions/{slug}`)

### Must Exclude

- `/dev/*`
- `/embed/*`
- `/api/*`
- `/assurance/*`
- Unpublished topics (`published: false`)

### Verification

```bash
# List all URLs in sitemap
curl -s https://safariindex.com/sitemap.xml | grep '<loc>'
```

Expected output should only show:
- `https://safariindex.com`
- `https://safariindex.com/decisions/tanzania-safari-february`
- (other published decision URLs)

---

## Structured Data (JSON-LD)

### Decision Pages

Schema: `QAPage`

| Field | Expected |
|-------|----------|
| @type | QAPage |
| mainEntity.@type | Question |
| mainEntity.acceptedAnswer.@type | Answer |
| mainEntity.acceptedAnswer.author.name | Safari Index |
| url | Matches canonical URL |

### Validation

1. View page source, find `<script type="application/ld+json">`
2. Copy JSON to https://search.google.com/test/rich-results (optional)
3. Verify no forbidden phrases: "unforgettable", "magical", "guaranteed"

### Forbidden Content in JSON-LD

- Marketing superlatives
- Guarantees or promises
- Prices or promotional text

---

## OpenGraph / Twitter Cards

### Decision Pages

| Tag | Expected |
|-----|----------|
| og:title | Topic question |
| og:description | Context line (factual, non-promotional) |
| og:type | article |
| og:url | Canonical URL |

### What NOT to Include

- Exclamation marks
- "Best", "Amazing", "Perfect"
- Pricing or CTAs

---

## Page-Level noindex Rules

| Route | Indexed? | Reason |
|-------|----------|--------|
| `/` | Yes | Homepage |
| `/decisions/*` | Yes | Public content |
| `/dev/*` | No | Dev-only, gated |
| `/embed/*` | No | Embed-only, not standalone content |
| `/assurance/*` | No | Purchase-gated |
| `/api/*` | No | API endpoints |

---

## Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `SITE_ORIGIN` | Base URL for canonicals | `https://safariindex.com` |
| `ENABLE_DEV_PAGES` | Allow /dev/* in production | `false` |

---

## Sign-off

| Check | Date | Verified By |
|-------|------|-------------|
| Canonicals correct | | |
| robots.txt complete | | |
| Sitemap accurate | | |
| JSON-LD valid | | |
| noindex enforced | | |
