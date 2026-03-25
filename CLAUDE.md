# CLAUDE.md - RSL/A Website (rsla.io)

## Project Overview

New rsla.io website. React 19 + Vite SPA with GSAP animations, Aurora background hero, Sanity CMS for blogs and case studies. Blue-gray light theme with Magic UI and 21st.dev components.

**Positioning:** "I show founders how to put AI to work, then I build it for them."

**Status:** Live at rsla.io. All TODO items complete (P0 through P4). Pre-rendered pages for AI tool visibility. Only careers page remains (when ready).

**Deployed:** `rsla.io` via Vercel (auto-deploys from `main` branch)
**GitHub:** `rahullalia/new-rslaWebsite`
**Studio:** `studio.rsla.io` (separate repo: `rahullalia/rslaStudio`)

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | React 19 + Vite |
| Styling | Tailwind CSS v3.4 + shadcn/ui utilities |
| Animation | GSAP 3 + ScrollTrigger, Motion (for Magic UI components only) |
| UI Components | Magic UI (MagicCard, TextAnimate, NumberTicker, ShineBorder, InteractiveHoverButton) |
| Logo Marquee | Pure CSS (translateX(-50%) + duplicate content, not Magic UI Marquee) |
| Hero Background | Aurora Background (CSS keyframe, adapted from Aceternity) |
| CMS | Sanity (Project: `yz25oyux`, Dataset: `production`) |
| Icons | Lucide React |
| Rich Text | @portabletext/react |
| SEO | Custom Seo.jsx component (no dependencies) |
| Error Monitoring | Sentry (@sentry/react, ErrorBoundary, browser tracing, replay-on-error) |
| Fonts | Self-hosted WOFF2 (5 families: Satoshi, Inter, Space Grotesk, Playfair Display, Cormorant Garamond) |
| Pre-rendering | Build-time HTML injection (scripts/prerender.mjs + marked) |

---

## Key Files and Folders

```
src/
  components/
    Seo.jsx           # Per-page SEO (title, description, OG, Twitter, canonical, robots)
    NavbarV2.jsx       # Tubelight navbar (desktop top pill + mobile bottom pill, GSAP lamp)
    FooterV2.jsx       # Light theme 4-col footer with Kit newsletter
    CookieConsent.jsx  # GDPR cookie banner (gates GTM loading, desktop pill + mobile card)
    FounderSection.jsx # Profile photo + bio
    AuroraBackground.jsx # CSS aurora hero background (adapted from Aceternity)
    HeroV2.jsx         # Aurora + TextAnimate + InteractiveHoverButton hero
    ServicesV2.jsx     # Magic Card grid (3 service cards)
    StatsSection.jsx   # Number Ticker count-up stats
    Testimonials.jsx   # Masonry grid testimonial cards (GSAP stagger)
    BlogPreview.jsx    # Latest 3 Sanity posts
    CtaWithGlow.jsx    # Bottom glow CTA section
    MarqueeV2.jsx      # Magic UI Marquee service labels
    BookingSection.jsx  # GHL booking embed
  pages/
    Home.jsx           # /
    About.jsx          # /about
    Services.jsx       # /services
    HowItWorksPage.jsx # /how-it-works
    StartHere.jsx      # /start-here
    Work.jsx           # /work (case studies listing)
    WorkInner.jsx      # /work/:slug
    Blog.jsx           # /blog
    BlogInner.jsx      # /blog/:slug
    BookCall.jsx       # /book-a-call (noindex)
    BookingConfirmed.jsx # /booking-confirmed (noindex)
    Rahul.jsx          # /rahul (chromeless, noindex)
    Sid.jsx            # /sid (chromeless, noindex)
    Insider.jsx        # /insider (noindex)
    Privacy.jsx        # /privacy-policy (noindex)
    Terms.jsx          # /terms (noindex)
    Disclaimer.jsx     # /disclaimer (noindex)
    Accessibility.jsx  # /accessibility (noindex)
    NotFound.jsx       # 404 catch-all (noindex)
  sanity/
    lib/               # Sanity client, image helper, GROQ queries
public/
  images/rahul.png     # Profile photo
  rahul.vcf            # vCard for /rahul page
  favicon.ico          # 32x32 from logomark.svg
  apple-touch-icon.png # 180x180 from logomark.svg
  icon-192.png         # PWA icon
  icon-512.png         # PWA icon
api/
  llm/[slug].mjs       # Vercel serverless function: returns markdown for any blog/case study
  lib/portableTextToMarkdown.mjs  # Portable Text to markdown converter
scripts/
  prerender.mjs        # Build-time HTML injection for AI tool visibility
  generateSitemap.mjs  # Build-time sitemap generator
  generateRssFeed.mjs  # Build-time RSS feed generator
  generateLlmsTxt.mjs  # Build-time llms.txt generator (AI search index)
PLAN.md                # Build plan (phases 1-5 done)
TODO.md                # Remaining tasks and wishlist
vercel.json            # Vite SPA routing + serverless function config
```

---

## Route Architecture

| Route | Page | Indexed | Chrome |
|---|---|---|---|
| / | Home | Yes | Full |
| /about | About | Yes | Full |
| /services | Services | Yes | Full |
| /how-it-works | HowItWorksPage | Yes | Full |
| /start-here | StartHere | Yes | Full |
| /work | Work | Yes | Full |
| /work/:slug | WorkInner | Yes | Full |
| /blog | Blog | Yes | Full |
| /blog/:slug | BlogInner | Yes | Full |
| /book-a-call | BookCall | No | Full |
| /booking-confirmed | BookingConfirmed | No | Full |
| /rahul | Rahul | No | Chromeless |
| /sid | Sid | No | Chromeless |
| /insider | Insider | No | Full |
| /privacy-policy | Privacy | No | Full |
| /terms | Terms | No | Full |
| /disclaimer | Disclaimer | No | Full |
| /accessibility | Accessibility | No | Full |
| * (404) | NotFound | No | Full |
| /api/llm/:slug | Serverless Function | N/A | N/A |
| /llms.txt | Static (build-time) | N/A | N/A |

**Chromeless pages** (no navbar/footer): controlled by `chromelessRoutes` array in App.jsx.
**noIndex pages**: controlled per-page via `<Seo noIndex />` component prop.

---

## Sanity CMS

- **Project ID:** `yz25oyux`
- **Dataset:** `production`
- **API Version:** `2025-03-01`
- **Studio:** `studio.rsla.io` (repo: `rahullalia/rslaStudio`, path: `~/lalia/1-Projects/rsl-a/rslaStudio/`)
- **Schemas:** Owned by Studio repo (source of truth). Website repo has no schemas.
- **Schemas deployed:** blogPost, blogPostV2, caseStudy, caseStudyV2, author, category, blogGenerationJob
- **Blog content:** 60 published V2 blog posts (`blogPostV2`). V1 blog posts (`blogPost`) are legacy.
- **Case study content:** 11 published V2 case studies (`caseStudyV2`). V1 case studies (`caseStudy`) are legacy. Website queries V2 only.
- **V2 case study categories:** "AI Automations", "AI Lead Generation", "AI Operations", "AI Digital Presence"
- **Old studio:** `admin.rsla.io` (content migrated to `yz25oyux`, 2026-02-22)
- **Content:** 60 blog posts, 11 case studies, 19 categories, 1 author (Rahul Lalia)
- **Client config:** projectId/dataset hardcoded in `src/sanity/lib/client.ts` (env vars don't resolve during Vercel build)
- **Token:** `VITE_SANITY_API_TOKEN` in `.env.local` (only needed for draft content, not CDN reads)

---

## SEO Implementation

- `Seo.jsx` component uses `useEffect` to set `document.title` and create/update meta tags
- Props: `title`, `description`, `canonical`, `noIndex`, `jsonLd`
- Updates: description, og:title, og:description, og:url, twitter:title, twitter:description, canonical link, robots, JSON-LD
- Default fallback tags in `index.html` for crawlers that don't execute JS
- BlogInner/WorkInner pull dynamic SEO from Sanity content
- OG image: `/og-image.png` (1200x630, created)
- Favicons: logomark.svg (primary), favicon.ico (32x32), apple-touch-icon.png (180x180)
- JSON-LD on all indexed pages: Organization (Home), Person (About), ProfessionalService (Services), HowTo (HowItWorks), WebPage (StartHere), CollectionPage (Work, Blog), BlogPosting/Article (BlogInner, WorkInner)
- GTM (GTM-MVJQSMF8): loaded conditionally via CookieConsent.jsx only after user accepts cookies
- noIndex on: /book-a-call, /booking-confirmed, /rahul, /sid, /insider, /privacy-policy, /terms, /disclaimer, /accessibility, 404

---

## Typography

| Font | CSS Class | Role |
|---|---|---|
| Satoshi | `.font-sans` | Headlines, H1 to H3, logo wordmark |
| Inter | `.font-body` | Body copy, long-form, UI elements |
| Space Grotesk | `.font-mono` | Tech labels, tags, uppercase badges |
| Playfair Display | `.font-drama` | Single accent word per section (italic, max 2 words) |

---

## Color Palette (Blue-Gray Theme)

| Name | Hex / Value | Tailwind |
|---|---|---|
| Background | `#F8FAFC` (slate-50) | `background` |
| Surface | `#FFFFFF` (white cards) | `surface` |
| Surface Alt | `#F1F5F9` (slate-100) | `surfaceAlt` |
| Text | `#0F172A` (slate-900) | `text` |
| Text Muted | `#64748B` (slate-500) | `textMuted` |
| Text Light | `#94A3B8` (slate-400) | `textLight` |
| Accent | `#0070F3` (brand blue) | `accent` |
| Electric Cyan | `#00C2FF` | `cyan` |
| Soft Coral | `#FF6B6B` | `coral` (errors only) |
| Blue Wash | `rgba(0,112,243,0.05)` | `accent-light` |
| Blue Border | `rgba(0,112,243,0.08)` | `accent-border` |
| Blue Border Strong | `rgba(0,112,243,0.15)` | `accent-border-strong` |

**Backward-compat aliases:** `dark` (#0F172A), `primary` (#FFFFFF), `sand` (#F8FAFC) still work.

**Section alternation pattern:** surface (white) -> accent-light (blue wash) -> surfaceAlt (slate-100)

---

## Animation Rules

- GSAP 3 + ScrollTrigger for all scroll-based animations
- No Framer Motion (one animation library only)
- `once: true` on entrance animations (don't re-trigger)
- Max 2 to 3 "strategic scroll moments" that genuinely surprise. Everything else stays clean.
- Canvas particles: `requestAnimationFrame`, 60fps, max 200 particles, pause when tab not visible

---

## Performance Budget

| Metric | Target | Current |
|---|---|---|
| LCP | < 2.5s | TBD (needs Lighthouse) |
| TBT | < 200ms | TBD |
| CLS | < 0.1 | TBD |
| JS Bundle | < 250KB gzipped | 186KB gzipped |
| Canvas | 60fps | TBD |

**Note:** One chunk at 585KB pre-gzip triggers Vite warning. Needs code-splitting (GSAP, Sanity client).

---

## Brand Reference

All brand docs live in `../theBrand/` (the central brand folder for all RSL/A projects):
- `brain.md` - Quick-reference brand context
- `brandIdentityGuide.md` - Core identity, mission, voice
- `rslaHomePageCopy.md` - Homepage section copy
- `rslaPagesCopy.md` - All other page copy
- `rslaUiUxPlaybook.md` - UI/UX specs, animations, performance budget
- `rslaWebsiteStrategy.md` - Website architecture and strategy
- `llmArchitecture.md` - LLM/agentic search optimization strategy
- `llmApiReference.ts` - Markdown API reference implementation
- `insiderNewsletterTemplate.html` - Newsletter email template
- `insiderConfirmationEmail.html` - Confirmation email template

---

## Commands

```bash
npm install                    # Install dependencies
npm run dev                    # Start dev server (Vite)
npm run build                  # Production build (includes sitemap + RSS + llms.txt generation)
```

**Sanity Studio commands (run from rslaStudio/ repo, not here):**
```bash
npm run dev                    # Local Studio dev server
npm run schema:deploy          # Deploy schemas to Sanity cloud
```

---

## Session Log

<details>
<summary>2026-02-24 to 2026-03-08: Initial Build (click to expand)</summary>

**Key decisions and gotchas from the initial build — the code is the source of truth for specifics.**

- Kit API: use `api.convertkit.com/v3/forms/{id}/subscribe` (NOT `app.kit.com/forms/`). Form ID: 9130465. Env var: `VITE_KIT_API_KEY`
- Vite + Vercel serverless: needs explicit `functions` block in vercel.json (`"runtime": "@vercel/node@5.6.9"`). SPA rewrite must exclude `/api/`: `/((?!api/).*) → /index.html`
- CSP: whitelists GTM, Sanity CDN, GHL embed, Kit (api.convertkit.com), YouTube/Vimeo/Loom/Wistia, Sentry. `blob:` in script-src + `worker-src 'self' blob:` for canvas-confetti
- Sentry: deferred via `requestIdleCallback` + dynamic import. 20% traces, 100% replay-on-error, prod-only. DSN via `VITE_SENTRY_DSN`
- Case study images: double-nested `asset.asset._ref` in Sanity schema
- Pre-rendering: `scripts/prerender.mjs` injects semantic HTML into `<div id="root">`. Vercel serves filesystem files before rewrites. React replaces on mount.
- All V1 schemas (blogPost, caseStudy) are legacy. Website queries V2 only (blogPostV2, caseStudyV2)
- Case study V2 categories: "AI Automations", "AI Lead Generation", "AI Operations", "AI Digital Presence"
- Gated resources: every download requires email (no localStorage persistence)
- Lighthouse baseline: Perf 96, A11y 95, BP 96, SEO 92
- Accent color: #0066E0 (WCAG AA, changed from #0070F3)
- font-quote = Caveat (blockquotes). font-drama = Playfair Display (accent words). font-sans = Satoshi (headlines)

</details>

### 2026-03-10: Logo Marquee Safari Fix

- **Replaced Magic UI Marquee with pure CSS marquee** — Magic UI's `justify-around` + 4x repeat caused huge gaps and broken animation on Safari mobile
- New approach: two copies of content in `w-max` flex track, `translateX(-50%)`, dual rows (14 + 13 logos)
- Added `marquee-scroll` and `marquee-reverse` keyframes to tailwind.config.js (kept old Magic UI `marquee`/`marquee-vertical` keyframes for other potential uses)
- **SVG cleanup**: Rebuilt YouTube SVG from scratch (removed Inkscape bloat), added explicit `width`/`height` to ChatGPT, Stripe, Gemini SVGs, converted TikTok SVG from mm to px units
- **Removed `loading="lazy"`** from marquee logos — second copy starts off-screen, Safari lazy-loading prevented them from rendering, causing visible gaps mid-animation
- **GPU compositing**: `translate3d` + `will-change: transform` for smooth Safari rendering
- Wider fade masks (8%/92%) for smoother edge transitions
- `src/components/ui/marquee.tsx` still exists but is no longer used by LogoMarquee (may be used elsewhere)

### 2026-03-12: Pre-render Flash Fix

- **Fixed FOUC (flash of unstyled content)** from pre-rendered HTML showing briefly before React mounts
- Pre-rendered content was injected directly into `<div id="root">` with no hiding mechanism
- Browsers rendered the raw semantic HTML (plain text wall) for a fraction of a second before React replaced it
- **Fix**: Wrapped pre-rendered HTML in `<div id="prerender">` (no CSS hiding) + added inline `<script>` to `index.html` that removes the div before first paint
- Inline script: `document.getElementById('prerender')?.remove()` — runs synchronously, blocks rendering, zero flash
- **No `display:none`** — researched LLM crawler behavior; Googlebot renders CSS and devalues hidden content; future crawlers (Perplexity Atlas, Crawl4AI) may also strip it
- LLM crawlers (GPTBot, ClaudeBot, PerplexityBot) fetch raw HTML without executing JS or CSS, so they still see the full pre-rendered content
- Files modified: `scripts/prerender.mjs` (line 80), `index.html` (inline script before module script)
- 70 pre-rendered pages (5 static, 2 listings, 52 blog posts, 11 case studies)

### 2026-03-20: Performance Optimization

- **Marquee logo PNGs converted to WebP** — 5 logos (antigravity 285KB, instantly 163KB, gohighlevel 35KB, make 13KB, redis 11KB) converted to WebP. Total: 507KB → 102KB (saved 405KB, 80% reduction). Updated LogoMarquee.jsx references.
- **All fonts converted from OTF/TTF to WOFF2** — 23 font files across 5 families. Total: 2,854KB → 1,066KB (saved 1.8MB, 63% reduction). Updated all @font-face declarations in index.css and preload links in index.html. Old OTF/TTF files deleted.
- **Removed 4 unused Satoshi font weights** — Light (300), Light Italic (300i), Black (900), Black Italic (900i) had zero usage in codebase. Declarations removed from index.css, files deleted.
- **Homepage Suspense boundaries split into 3 groups** — was 1 boundary loading all 13 sections immediately. Now:
  - Near-fold (immediate): LogoMarquee, SystemArchitecture, ServicesV2, HowItWorks, StatsSection
  - Mid-page (IntersectionObserver, 400px rootMargin): ProofSection, Testimonials, FounderSection, BlogPreview
  - Bottom (IntersectionObserver, 200px rootMargin): BookingSection, FaqSection, CtaWithGlow, MarqueeV2
  - BookingSection GHL iframe no longer loads until user scrolls near it (was the single biggest request multiplier, ~30-50 requests alone)
- **Marquee logos resized for display dimensions** — images were 640-2000px wide, displayed at 80-120px. Resized to max 240px (2x retina). Total: 102KB → 25KB.
- **Deleted dead weight PNGs** — rahul.png (801KB), lockup-bg.png (362KB), lockup-nobg.png (338KB), and 5 original marquee PNGs. All had zero code references (WebP versions already in use). Saved 2MB of deployed assets.
- **Sentry SDK deferred** — moved from synchronous import in main.jsx to `requestIdleCallback` + dynamic `import('./sentry')`. Error boundary also uses dynamic import. Sentry no longer blocks first paint.
- **Code splitting improved** — added `sentry` to manualChunks in vite.config.js. Main bundle dropped from 562KB → 310KB (45% smaller). Sentry (435KB) now in separate lazy-loaded chunk. Total dist: 7.1MB → 5.0MB.
- **Total savings**: ~1.8MB font weight, ~2.5MB deleted dead images, ~480KB logo optimization, 252KB off critical-path JS, ~30-50 fewer HTTP requests from deferred GHL iframe.
- **Share bar added** to BlogInner and WorkInner — LinkedIn, X, Email, Copy Link buttons. Blog: right-aligned in author row (desktop), below on mobile. Case study: below description in header.
- **OG image replaced** — RSL/A lockup SVG centered on #0a0a0a black, 92% fill, 1200x630, 15KB (was 140KB). Source: `rsla-lockup.svg`.
- **Decorative font swapped on blog/case study pages** — `font-drama` (Playfair Display) replaced with `font-sans` (Satoshi) for pull quotes, blockquotes, testimonials, and case study descriptions. Rest of site keeps Playfair for accent words.
- **npm audit fix** — patched flatted (prototype pollution) and minimatch (ReDoS), 0 vulnerabilities.
- **IndustryPage route staged** — `/ai-for/:slug` route added to App.jsx, IndustryPage.jsx component (WIP, not yet content-populated).

### 2026-03-20: Bug Fixes (Page Loading, ScrollTrigger, Hero CTA)

- **Fixed blank page on first visit** — lazy chunk import failures caused permanent blank pages. Added `lazyRetry()` wrapper (3 retries, 1.5s backoff, then page reload). Added `<PageLoader />` spinner as Suspense fallback. Fixed `pageReady` opacity transition to start `true` on initial load (was `false`, causing invisible content).
- **Fixed invisible page content (ScrollTrigger kill bug)** — `useScrollToTop` in App.jsx killed ALL ScrollTriggers on route change, including the NEW page's triggers (child effects fire before parent). Removed the blanket kill. Each page cleans up its own GSAP context via `ctx.revert()`. ResilientErrorBoundary catches remaining DOM desync.
- **Fixed error boundary** — now handles 3 error types: DOM desync (auto-recover), chunk load errors (auto-reload), app errors (retry button instead of permanent blank page).
- **Fixed hero CTA button flash** — buttons rendered at full opacity before GSAP `useEffect` set them to `opacity:0`. Added `opacity-0` CSS class so they start hidden before first paint.
- **Fixed hero secondary CTA stuck animation** — `transition-all` on "See What We've Built" button fought with GSAP opacity animation. Changed to `transition-colors`.

### 2026-03-20: Logo Marquee Updates

- **Merged to single row** — was two rows (row1 left, row2 right). Second row had visible gap on right side. Now one continuous row, 27 logos, 45s duration.
- **Heading changed** — "We integrate with" → "We have worked with"
- **Logo order optimized** — lesser-known logos first (positions 1-6), high-profile logos (Anthropic, Claude, Meta, ChatGPT, Stripe, Gemini, Antigravity, GitHub) land in viewport when user scrolls to section (~positions 7-14).

### 2026-03-20: Programmatic SEO (pSEO) — Full Pipeline

- **Sanity schema created** — `industryPage` document type in rslaStudio with 6 field groups: Hero, Pain & Stats, Before/After, Proof (optional), FAQ, SEO. Deployed to Sanity cloud, added to Studio desk structure.
- **8 industry pages live** — real-estate, healthcare, accounting, contractors, ecommerce, restaurants, dental, insurance. Each with researched industry stats (MIT, WAV Group, NAR, BLS, etc.), written in Rahul's voice (voiceDna.md), unique pain points and before/after transformations.
- **Template design** — Hormozi/Acquisition.com inspired: dark hero, question headlines, font-extrabold (800 weight), font-light (300) body, before/after comparisons, big proof stat, objection-handling FAQ, mid-page CTA. No booking embed on industry pages (links to /book-a-call instead).
- **Sanity integration** — IndustryPage.jsx fetches from Sanity via `industryPageBySlugQuery`. Proof section and case study link are optional (only render when data exists).
- **Pre-rendering** — `prerender.mjs` updated to fetch and pre-render all published industryPage documents. 53 total pre-rendered pages (was 45).
- **GROQ queries added** — `industryPageBySlugQuery` and `industryPagesQuery` in queries.ts.
- **Services page grid** — "Industries We Serve" section added to bottom of /services. Fetches from Sanity, auto-grows as new pages are published. 2-col mobile, 3-col tablet, 4-col desktop.
- **Case studies linked** — Real estate → salon-marketing-automation-roi ($600→$36K), Contractors → field-service-operations-automation (Housecall Pro), Restaurants → local-seo-reputation-management (14→132 reviews). Healthcare, accounting, dental, insurance, e-commerce have no proof sections.
- **Keyword research** — 370+ keywords scraped from Google Autocomplete across 45+ seed phrases. Organized into industry, service, tool, and comparison clusters.
- **Google Search Console** — user submitted sitemap and requested indexing for /ai-for/real-estate.

### 2026-03-23: pSEO Tool Pages (Batch 2)

- **4 tool pages added** — GoHighLevel, n8n, Make, Zapier. All researched with verified stats, written in Rahul's voice, published to Sanity.
- **GoHighLevel page** links to `adreviveai-saas-build` case study (4-week SaaS build). Pain angle: "40 to 80 hours of setup that most business owners never finish."
- **n8n page** — 95% cheaper than Zapier at scale, but 20-40 hour self-hosted setup. Pain: "the gap between installed and running."
- **Make page** — 30x cheaper per operation than Zapier, but wrong polling intervals eat the budget. Pain: "43,000 operations consumed monthly just from a trigger polling every minute."
- **Zapier page** — positioned as migration/optimization. Pain: "you are paying a success tax." Links to Make and n8n as alternatives.
- **Footer updated** — "Solutions" column added to FooterV2. Shows first 6 industry pages alphabetically with "View all →" to /services. Grid updated from 4-col to 5-col on desktop.
- **Total: 12 pSEO pages live**, 57 pre-rendered pages total.
- **Decision: pause pSEO page creation** — wait 2 to 4 weeks for Google to crawl and index the 12 pages. Check indexation rate in Search Console before adding more. If 9+ out of 12 index, template works and we scale.

### 2026-03-23: Blog Inner Page Revamp

- **Complete layout rewrite** of BlogInner.jsx — editorial style, cleaner reading flow
- **New layout structure**: Breadcrumb → Category pill → Title → Author line → TL;DR (plain text, no box) → Featured image → Body content
- **Sticky floating ToC** — `position: fixed`, floats to the left of the 720px content column. Appears at `xl` breakpoint (1280px+). Fades in after 400px scroll, hidden at page top. Uses IntersectionObserver for active section highlighting.
- **Single-column alignment** — title, TL;DR, featured image, and body all share one 720px column. ToC sits outside via `calc()` left positioning.
- **Mobile**: ToC renders inline after featured image (xl:hidden), share bar after article body
- **Font swap**: Cormorant Garamond replaced with Caveat (self-hosted WOFF2, ~49KB). Used for blockquotes/pull quotes only via `font-quote` class. `font-display: swap`, no preload.
- **Heading hierarchy fixed**: H2s changed from tiny mono labels (`font-mono text-xs uppercase`) to real headings (`text-2xl font-body font-bold`). H3s: `text-lg font-semibold`.
- **TL;DR** uses existing `pullQuote` Sanity field, rendered as plain text with accent label (no callout box)
- **ShareBar** gained `showLabel` prop — BlogInner passes `showLabel={false}` (sidebar has its own label), WorkInner keeps default
- **SEO additions**: BreadcrumbList JSON-LD schema, `<nav aria-label="Breadcrumb">`, `<time datetime>` attributes, proper `<header>` + `<article>` + `<aside>` semantic landmarks
- **Removed**: TextAnimate on title, pull quote section (redundant with TL;DR), overflow-hidden on article wrapper, multiple category pills, border-y divider, Cormorant Garamond font files
- **Prerender updated**: `prerender.mjs` now includes pullQuote in Sanity query, generates breadcrumb nav, header wrapper, TL;DR, and BreadcrumbList JSON-LD
- **Design spec**: `docs/superpowers/specs/2026-03-23-blog-inner-revamp-design.md`
- **Implementation plan**: `docs/superpowers/plans/2026-03-23-blog-inner-revamp.md`
- **Mockups**: `.superpowers/brainstorm/78792-1774296503/blog-layout-v6.html` (final approved)

### 2026-03-24: Mobile Navigation Error Flash Fix

- **Rewrote `ResilientErrorBoundary` in `main.jsx`** — eliminated "Something went wrong" flash on mobile Safari navigation
  - **Root cause**: `window.location.reload()` is async — JS keeps running after the call, giving React time to process a second error and set `permanent: true`, flashing the error UI before reload completes
  - **Fix**: Removed `window.location.reload()` entirely. Now uses silent auto-recovery (`setTimeout → setState({ hasError: false })`) with timestamp-based crash loop detection (3+ errors in 3 seconds = genuine crash, show error UI)
  - Old approach: `_reloadAttempted` boolean flag → race condition on second error
  - New approach: `_errorTimestamps` array → frequency-based detection, no race
- **Added `lazyRetry()` to Home.jsx internal lazy imports** — all 13 bare `lazy()` calls now retry once after 200ms on failure, preventing Safari `import()` errors from reaching the error boundary
- **Fixed GSAP animation flash on nav pages** — GSAP `fromTo()` runs in `useEffect` (after first paint), so animated hero containers flashed at full opacity for one frame before GSAP set them to `opacity: 0`. Added `opacity-0` CSS class to hero containers on About, Services, HowItWorks, StartHere so they start hidden from first paint.
- **Pattern established**: Any element animated by GSAP `fromTo` starting at `opacity: 0` needs `opacity-0` CSS class to prevent first-paint flash. Same pattern already used on hero CTA buttons.

---

## Last Updated

2026-03-24
