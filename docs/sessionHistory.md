# rslaWebsite Session History

Archived from CLAUDE.md on 2026-03-27. Read on demand when historical context is needed.

---

### 2026-02-24 to 2026-03-08: Initial Build

Key decisions and gotchas from the initial build — the code is the source of truth for specifics.

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
- **Pre-rendering** — `prerender.mjs` updated to fetch and pre-render all published industryPage documents.
- **GROQ queries added** — `industryPageBySlugQuery` and `industryPagesQuery` in queries.ts.
- **Services page grid** — "Industries We Serve" section added to bottom of /services. Fetches from Sanity, auto-grows as new pages are published.
- **Case studies linked** — Real estate → salon-marketing-automation-roi, Contractors → field-service-operations-automation, Restaurants → local-seo-reputation-management.
- **Keyword research** — 370+ keywords scraped from Google Autocomplete across 45+ seed phrases.

### 2026-03-23: pSEO Tool Pages (Batch 2)

- **4 tool pages added** — GoHighLevel, n8n, Make, Zapier. All researched with verified stats, written in Rahul's voice, published to Sanity.
- **Footer updated** — "Solutions" column added to FooterV2. Shows first 6 industry pages alphabetically with "View all →" to /services. Grid updated from 4-col to 5-col on desktop.
- **Total: 12 pSEO pages live**.
- **Decision: pause pSEO page creation** — wait 2 to 4 weeks for Google to crawl and index the 12 pages. Check indexation rate in Search Console before adding more.

### 2026-03-23: Blog Inner Page Revamp

- **Complete layout rewrite** of BlogInner.jsx — editorial style, cleaner reading flow
- **New layout structure**: Breadcrumb → Category pill → Title → Author line → TL;DR (plain text, no box) → Featured image → Body content
- **Sticky floating ToC** — `position: fixed`, floats to the left of the 720px content column. Appears at `xl` breakpoint (1280px+). Fades in after 400px scroll.
- **Single-column alignment** — title, TL;DR, featured image, and body all share one 720px column.
- **Mobile**: ToC renders inline after featured image (xl:hidden), share bar after article body
- **Font swap**: Cormorant Garamond replaced with Caveat (self-hosted WOFF2, ~49KB). Used for blockquotes/pull quotes only via `font-quote` class.
- **Heading hierarchy fixed**: H2s changed from tiny mono labels to real headings (`text-2xl font-body font-bold`). H3s: `text-lg font-semibold`.
- **TL;DR** uses existing `pullQuote` Sanity field, rendered as plain text with accent label
- **SEO additions**: BreadcrumbList JSON-LD schema, `<nav aria-label="Breadcrumb">`, `<time datetime>` attributes, semantic landmarks

### 2026-03-24: Mobile Navigation Error Flash Fix

- **Rewrote `ResilientErrorBoundary` in `main.jsx`** — eliminated "Something went wrong" flash on mobile Safari navigation
  - **Root cause**: `window.location.reload()` is async — JS keeps running after the call, giving React time to process a second error and set `permanent: true`, flashing the error UI before reload completes
  - **Fix**: Silent auto-recovery (`setTimeout → setState({ hasError: false })`) with timestamp-based crash loop detection (3+ errors in 3 seconds = genuine crash, show error UI)
- **Added `lazyRetry()` to Home.jsx internal lazy imports** — all 13 bare `lazy()` calls now retry once after 200ms on failure
- **Fixed GSAP animation flash on nav pages** — Added `opacity-0` CSS class to hero containers on About, Services, HowItWorks, StartHere

### 2026-03-24: Universal Pre-rendering + Privacy Update

- **Pre-rendered ALL pages** — previously only indexed pages were pre-rendered. Now every page returns real semantic HTML to non-JS clients.
- **Privacy Policy updated**: Added Instagram Messaging API (Meta) to Section 5 third-party services table + Instagram DM Automation disclosure paragraph.

### 2026-03-25: Blog ToC Active Heading Fix

- **Fixed ToC heading ID mismatch** — `PortableTextRenderer.jsx` h2/h3 renderers extracted text from React `children` using `c.props?.text`, which returned empty string for styled spans. Now uses `value.children` (raw Sanity block data).
- **Replaced IntersectionObserver with scroll listener** — `scroll` event listener walks all heading IDs and picks the last one with `getBoundingClientRect().top <= 140`.
- **Sanity CORS note**: `localhost:5175` is not in Sanity CORS origins (only 5173 whitelisted).

### 2026-03-25: SEMRush SEO Audit — Full Analysis + Fixes

- **SEMRush site audit analyzed** — Site Health 98%, AI Search Health 94%, Authority Score 8 (low), Organic Traffic 15/mo, 119 keywords, 14 referring domains
- **GSC data analyzed** — 130K impressions across 3 months. GHL pricing page: 35K impressions, 8 clicks. Claude content surprise winner: claude-code-vs-cowork gets 36 clicks.
- **Sitemap fix** — Added 12 industry pages, removed noindex `/book-a-call`. 47 → 58 URLs.
- **Pre-rendered nav** — Added `<nav>` with links to all 7 main pages in every pre-rendered page.
- **Broken blog posts fixed** — ai-lead-follow-up-system (future-dated), answer-engine-optimization-aeo-guide (301 redirect)
- **Related Posts fallback** — `BlogInner.jsx` now fetches category-matched posts when `relatedPosts` is empty.
- **GHL pricing CTR optimization** — New meta title with pricing tiers and social proof.
- **SoftwareApplication schema** — Added for GHL pricing page.
- **SEO Action Plan saved** — `SEO_ACTION_PLAN.md`

### 2026-03-25: Claude/Anthropic SEO Blog Pipeline + Post 0 Published

- **Created `docs/seo/` folder** — 29-post content plan, keyword research, Google Sheet tracker
- **Post 0 (Anchor Post) published** — slug: `anthropic-claude-products-guide`, Sanity ID: `8b58542f-4ec8-4d7d-ad6a-6681aa99a404`
- **blogEngine workflow validated** — Interview → outline → draft → voice audit → Sanity creation → image generation → upload → publish → post-publish tasks

### 2026-03-26: Drop Post + Post 1 Published

- **Drop Post** — slug: `claude-new-features-actually-worth-it`, Sanity ID: `p3wlPt7vRYboGM0Qqyj79H`
- **Post 1** — slug: `how-to-install-claude-code`, Sanity ID: `s46qKlJ461Y7vhDmdMKLv7`
- **Sanity publish via MCP** — Discovered `mcp__sanity__publish_documents` tool. Can now publish directly without Studio UI.
- **Image styles rotated**: Post 0 (napkinSketch, whiteboardMarker, processArrows, dashboardSketch) → Drop (splitScreen, stickyNote, notebookPencil) → Post 1 (feltTipClean, metricViz, indexCard)

### 2026-03-25: Folder Reorganization (Studio/Website Split)

- **Moved all content production from rslaStudio to rslaWebsite** — Studio is now schema-only
- **posts/** (49 markdown files) moved to `content/posts/`
- **55 content scripts** moved to `content/scripts/`
- **14 blog skills + references + templates** moved to `4-Resources/skills/blogEngine/genericBlogSkill/`

### 2026-03-27: Post 2 Published + IndexNow Automation

- **Post 2** — slug: `is-claude-free-pricing-every-tier`, Sanity ID: `p3wlPt7vRYboGM0QrAKWjx`
- **IndexNow automation** — `scripts/pingIndexNow.mjs` runs as last step of `npm run build`. Key: `42f4e2d222a8441d91b82a1d06d0db72`.
- **Build chain**: `vite build → prerender → sitemap → rss → llms.txt → IndexNow ping`
- **Site rebuilt**: 73 pre-rendered pages, 63 sitemap URLs, 33 blog posts in RSS + llms.txt
