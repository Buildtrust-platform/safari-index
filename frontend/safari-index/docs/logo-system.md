# Vurara Safaris Logo System

Documentation for the Vurara Safaris brand logo assets and usage guidelines.

## Logo Assets

All logo files are located in `/public/`:

| File | Description | Use Case |
|------|-------------|----------|
| `logo.svg` | Full logo (rhino + wordmark) in Obsidian | Light backgrounds, default usage |
| `logo-white.svg` | Full logo in white | Dark backgrounds, hero overlays |
| `logo-sandstone.svg` | Full logo in Sandstone | Special accents, footer variants |
| `icon.svg` | Rhino mark only | Small spaces, loading states |
| `favicon.svg` | Favicon (obsidian bg + sandstone rhino) | Browser tabs, bookmarks |

## Brand Colors

The logo system uses three core brand colors:

```css
--obsidian: #0B0B0B      /* Primary - depth, logic, clarity */
--sandstone: #D7C4A5     /* Secondary - grounded terrain, restraint */
--technical-gold: #A68942 /* Accent - decision nodes, validation */
```

## Usage Guidelines

### Navbar Logo

The Navbar automatically switches between logo variants based on scroll state:

```tsx
// Transparent mode (over hero images) → white logo
// Solid mode (scrolled or solid variant) → dark logo

<Image
  src={showSolid ? '/logo.svg' : '/logo-white.svg'}
  alt="Vurara Safaris"
  width={160}
  height={40}
  className="h-8 w-auto"
  priority
/>
```

### Using the Logo Component

Import and use the reusable Logo component:

```tsx
import { Logo, LogoMark } from '@/app/components/Logo';

// Full logo with wordmark
<Logo variant="dark" size="md" />
<Logo variant="light" size="lg" />
<Logo variant="sandstone" size="sm" />

// Icon only (rhino mark)
<LogoMark variant="dark" size="md" />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'dark' \| 'light' \| 'sandstone'` | `'dark'` | Color variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size preset (h-6, h-8, h-10) |
| `showWordmark` | `boolean` | `true` | Show full logo or just rhino mark |
| `className` | `string` | - | Additional CSS classes |

### Size Guidelines

| Size | Height | Use Case |
|------|--------|----------|
| `sm` | 24px (h-6) | Compact headers, mobile |
| `md` | 32px (h-8) | Standard navbar, cards |
| `lg` | 40px (h-10) | Footer, hero sections |

## Variant Selection

### When to use each variant:

**Dark (`logo.svg`):**
- Light/paper backgrounds
- Standard page content
- Solid navbar state

**Light (`logo-white.svg`):**
- Dark backgrounds
- Hero image overlays
- Transparent navbar over images

**Sandstone (`logo-sandstone.svg`):**
- Dark sections needing warmth
- Footer on obsidian background
- Special promotional materials

## Favicon

The favicon uses an obsidian background with the rhino mark in sandstone. This ensures visibility across browser tabs regardless of the user's system theme.

```tsx
// In layout.tsx metadata
icons: {
  icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  apple: "/favicon.svg",
}
```

## SVG Structure

Each logo SVG contains:
1. **Rhino Symbol** - The primary brand mark
2. **VURARA Text** - Primary wordmark
3. **SAFARIS Text** - Secondary wordmark
4. **Decorative Lines** - Horizontal accent lines

ViewBox: `0 0 2048 1365`

## Accessibility

- All logo images include proper `alt` text: "Vurara Safaris"
- Logo links to homepage for consistent navigation
- Priority loading enabled for above-fold logos

## File Optimization

All SVG files are:
- Cleaned of unnecessary metadata
- Using single-color fills for easy theming
- Optimized paths from the original vectorized source

## Original Source

The logo was vectorized from: `/logo/envato-labs-vectorized(7).svg`

---

*Brand Identity: Vurara Safaris - "The Truth of the Wild, Revealed"*
