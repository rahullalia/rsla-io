# Blog Inner Page Revamp — Design Spec

## Goal

Revamp `BlogInner.jsx` to improve readability, scannability, and reading flow. Replace the current heavy header stack with a linear editorial layout. Add a sticky sidebar table of contents on desktop.

## Current Problems

1. **Header overload** — 5-6 distinct blocks (back link, category pills, animated title, author row with share bar, pull quote, ToC, hero image) before body content
2. **H2s styled as tiny mono labels** — unreadable when scanning
3. **No reading rhythm** — everything sits in the same `max-w-4xl` container
4. **Odd content order** — ToC between pull quote and hero image

## Layout Structure

```
Breadcrumb bar: Blog / Category Name
Category pill (single, first category)
Title (clamp 32-48px, weight 700)
Author line (avatar 36px + name + date + reading time)
TL;DR label + plain text (no callout box) — uses `pullQuote` field, hidden if empty
Featured image (16:9, max-width 720px, rounded-16px) — conditionally rendered
Mobile ToC (inline, hidden on desktop) — conditionally rendered
┌──────────────────────────────────────────────────┐
│  Sticky Sidebar (200px)  │  Body (max-w-2xl)     │
│  - Table of Contents     │  - H2 sections        │
│  - Share buttons         │  - Content            │
│                          │  - Newsletter         │
└──────────────────────────────────────────────────┘
Related posts (3-column grid) — conditionally rendered
Related case study (horizontal banner) — conditionally rendered
```

Outer container: `max-w-5xl` (1024px). Grid: `grid-cols-[200px_1fr]` with `gap-16`.

## Edge Cases

| Condition | Behavior |
|---|---|
| No featured image | TL;DR flows directly into mobile ToC (or body on desktop). No spacer needed. |
| No `pullQuote` | TL;DR section not rendered. Author line flows into featured image or body. |
| `showTableOfContents` is false or fewer than 2 H2s | Sidebar shows share buttons only. Mobile ToC not rendered. Sidebar still renders (share buttons need a home). |
| No related posts | "Read Next" section not rendered. |
| No related case study | Case study banner not rendered. |
| Loading state | Unchanged from current (mono pulsing text). |
| 404 / not found state | Unchanged from current (title + back link). |

## Data Mapping

- **TL;DR text** = `post.pullQuote` (existing Sanity field, repurposed as TL;DR)
- **Breadcrumb category** = `post.categories[0]` (first category only; if zero categories, breadcrumb is just `Blog / Post Title`)

## Typography

| Element | Before | After |
|---|---|---|
| Section labels (TL;DR, In this article, Share, See It In Action) | Space Grotesk 11px, weight 500 | Space Grotesk **text-xs (12px), weight 600** |
| H2 in body | `font-mono text-xs uppercase` (decorative label) | **Inter 24px (text-2xl), weight 700** (real heading) |
| H3 in body | 18-20px Inter | **Inter 18px (text-lg), weight 600** |
| Blockquotes / Pull quotes | Inter italic 20px | **Caveat 28px (text-[28px]), weight 500** (text-2xl on mobile) |
| Body paragraphs | Inter 16px | Inter 16px (unchanged) |
| Inline italic/emphasis | Inter italic | Inter italic (unchanged) |
| Title | Satoshi weight 800 (not loaded) | Satoshi **weight 700** (`font-bold`, already loaded) |

### New Font: Caveat

- Used exclusively for `<blockquote>` elements (pull quotes)
- Self-hosted WOFF2, ~17KB
- `font-display: swap` (consistent with all other fonts)
- Do NOT preload (blockquotes are below the fold)
- NOT used for inline `<em>` — those stay Inter italic

### Font Cleanup

- Remove Cormorant Garamond `@font-face` declarations from `index.css` (currently unused)
- Delete Cormorant Garamond WOFF2 files from `public/fonts/`
- Replace `quote` value in `tailwind.config.js` fontFamily (currently maps to Cormorant Garamond, will map to Caveat)

## Responsive Behavior

### Desktop (>= lg / 1024px)

- Two-column grid: 200px sidebar + auto content (body max-w-2xl / 672px)
- Sidebar is `position: sticky; top: 32px`
- **Remove `overflow-hidden`** from `<article>` wrapper (breaks sticky positioning)
- ToC highlights active section via `IntersectionObserver` on H2 elements:
  - `rootMargin: '-80px 0px -60% 0px'` (triggers when heading is in upper 40% of viewport)
  - `threshold: 0` (any visibility)
  - First heading active by default on mount
  - Cleanup observer in `useEffect` return
- Share buttons below ToC in sidebar

### Mobile (< lg / 1024px)

- Sidebar hidden entirely (`hidden lg:block`)
- Inline ToC appears after featured image in a rounded card (surfaceAlt bg, accentBorder)
- Related posts collapse to single column
- Case study banner stacks vertically, centered text
- Blockquotes scale to 24px
- All touch targets minimum 44px height (min-h-[44px])

## SEO

### Preserved (already working)

- `<Seo>` component: title, description, canonical, og:tags, twitter:tags
- JSON-LD `BlogPosting` schema with author, publisher, dates
- JSON-LD `FAQPage` schema (when faqSchema data exists)
- H2 anchor IDs via `slugify()` for deep linking
- `scroll-mt-32` on H2/H3 for anchor offset (navbar height)
- Pre-rendered HTML via `prerender.mjs`

### Added

- **Proper heading hierarchy**: H1 (title) > H2 (sections) > H3 (subsections). No more H2s as decorative labels.
- **BreadcrumbList JSON-LD schema**:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Blog", "item": "https://rsla.io/blog" },
    { "@type": "ListItem", "position": 2, "name": "Post Title" }
  ]
}
```

Note: Category is NOT included in BreadcrumbList because the blog page uses client-side filtering (no `/blog/category-slug` routes exist). Including a non-existent URL in structured data would be invalid.

- **Semantic landmarks**: `<article>`, `<header>`, `<aside>`, `<nav aria-label="Table of contents">`, `<time datetime={post.publishedAt}>`

### Updated

- `prerender.mjs`:
  - Add `pullQuote` to the Sanity query for blog posts
  - Add `<nav aria-label="Breadcrumb">` to pre-rendered HTML
  - Add BreadcrumbList JSON-LD to the `jsonLd` array
  - Add TL;DR text (from `pullQuote`) to pre-rendered `<header>`
  - Wrap content in `<article>` with `<header>` for title/author block
  - Two-column grid is irrelevant for pre-render (crawlers see linear HTML)

## Accessibility

- ToC links are keyboard-navigable (`<a href="#id">`)
- Active ToC item gets `aria-current="true"` for screen readers
- Sidebar uses `<aside>` landmark
- ToC wrapped in `<nav aria-label="Table of contents">`
- `<time>` elements include `datetime` attribute
- Caveat blockquotes remain readable at 28px with sufficient line-height (1.4)
- Focus visible on all interactive elements (browser default, no custom outline override)

## What Gets Removed

- `TextAnimate` blur-in on title (animation overhead, hurts LCP)
- Pull quote section between author and ToC (redundant with TL;DR)
- Multiple category pills in header (replaced by breadcrumb + single pill)
- Share bar in author row (moved to sidebar)
- `border-y` divider under author row
- Desktop ToC card (replaced by sidebar)
- `overflow-hidden` on article wrapper (breaks sticky)
- Cormorant Garamond font files and declarations (unused)

## What Gets Added

- Caveat font (WOFF2 self-hosted, `@font-face` in index.css, `font-display: swap`, no preload)
- Sticky sidebar component with ToC + share
- `IntersectionObserver` hook for active ToC section highlighting
- BreadcrumbList JSON-LD
- `<nav>` landmark for ToC accessibility
- Mobile inline ToC (conditionally rendered below lg breakpoint)

## Files to Modify

| File | Change |
|---|---|
| `src/pages/BlogInner.jsx` | Complete layout rewrite: new structure, sidebar, breadcrumb, TL;DR, IntersectionObserver, remove TextAnimate, remove overflow-hidden |
| `src/components/blog/PortableTextRenderer.jsx` | H2: Inter 24px bold (real heading). H3: 18px semibold. Blockquote: Caveat 28px. Keep scroll-mt-32. |
| `src/components/ShareBar.jsx` | Add `showLabel` prop (default true). BlogInner passes `showLabel={false}`, WorkInner keeps default. |
| `src/index.css` | Add Caveat `@font-face` (swap). Remove Cormorant Garamond `@font-face` declarations. |
| `public/fonts/` | Add Caveat-Medium.woff2. Delete CormorantGaramond WOFF2 files. |
| `scripts/prerender.mjs` | Add `pullQuote` to Sanity query. Update blog post HTML template: breadcrumb nav, header with TL;DR, article wrapper, BreadcrumbList JSON-LD. |
| `tailwind.config.js` | Change `quote` fontFamily from Cormorant Garamond to `['Caveat', 'cursive']` |

## Design Reference

Mockups saved in `.superpowers/brainstorm/78792-1774296503/`:
- `blog-layout-v6.html` — final approved layout
- `font-compare.html` — Caveat vs Patrick Hand vs Playfair comparison

## Constraints

- React 19 + Vite SPA (not Next.js)
- GSAP for scroll animations (no Framer Motion)
- Sanity CMS for content (PortableText rendering)
- Existing Seo.jsx component for meta tags
- Self-hosted WOFF2 fonts only
- Must maintain pre-rendering for AI crawlers
- Use Tailwind standard breakpoints (lg: 1024px), not custom values
