# RSL/A Website Enhancements - Context for AI Agents

**Date of Changes:** March 4, 2026
**Primary Goal:** To elevate the RSL/A website's UI by introducing premium, Apple-style scroll animations and ensuring consistent "premium" UI entrances across all pages (both homepage components and inner pages).

## 1. Homepage Component Enhancements
*   **HeroV2 (`src/components/HeroV2.jsx`)**: Re-integrated the `AuroraBackground` component to act as the primary hero background, replacing the static grid for a more dynamic feel.
*   **HowItWorks (`src/components/HowItWorks.jsx`)**: Completely refactored this component from a vertical list into a pinned, Apple-style horizontal scroll-scrub timeline using GSAP `ScrollTrigger`.
*   **SystemArchitecture (`src/components/SystemArchitecture.jsx`)**: Created an isometric 3D stacking animation. As the user scrolls, the foundational layers (Infrastructure, AI Automation, Paid Acquisition) drop into place in 3D space (`rotateX(50deg) rotateY(-5deg) rotateZ(0deg)`).

## 2. Inner Page Consistency (TextAnimate Integration)
We systematically audited all inner pages to ensure they matched the new premium feel of the homepage. We applied the `TextAnimate` component (using the `blurInUp` by-word preset) to the primary `h1` headings of the following pages:
*   `src/pages/About.jsx`
*   `src/pages/Services.jsx`
*   `src/pages/Blog.jsx` (Header: "The Archive.")
*   `src/pages/Work.jsx` (Header: "Proven Performance.")
*   `src/pages/Privacy.jsx`
*   `src/pages/Terms.jsx`
*   `src/pages/Disclaimer.jsx`
*   `src/pages/Accessibility.jsx`

Then, in a follow-up phase, we applied the same `TextAnimate` upgrade to the headers of all remaining static inner pages, ensuring 100% consistency across the build:
*   `src/pages/HowItWorksPage.jsx`
*   `src/pages/StartHere.jsx`
*   `src/pages/BookCall.jsx`
*   `src/pages/BookingConfirmed.jsx`
*   `src/pages/Rahul.jsx`
*   `src/pages/Sid.jsx`
*   `src/pages/Insider.jsx`

Finally, we wrapped the dynamic headings (`{post.title}` and `{caseStudy.title}`) in the CMS templates:
*   `src/pages/BlogInner.jsx`
*   `src/pages/WorkInner.jsx`

## 3. Important Context & Bug Fixes
*   **Vite HMR/Import Alias Bug:** Initially, adding `TextAnimate` to the inner pages caused a fatal React Error Boundary crash (`Something went wrong. Please refresh the page.`). 
    *   **The Cause:** Using relative imports (`../components/ui/text-animate`) for the component misaligned with how it was imported elsewhere, breaking Vite's HMR cache.
    *   **The Fix:** **ALWAYS** use the strict absolute path alias for UI components: `import { TextAnimate } from '@/components/ui/text-animate';`. All inner pages were updated to use this pattern, which fully resolved the crashes.
*   **Sanity Integration:** The local dev server runs on port `3002`. The Sanity CMS project has CORS policies that block API requests from `localhost:3002`. Therefore, pages like `/blog` and `/work` will show loading skeletons or "No posts found" states locally, which is expected behavior. Content loads fine in production.

## 4. Animation Stack
*   **Core Library:** GSAP + ScrollTrigger (for the scroll-scrub timeline and 3D stacking).
*   **Text Entrances:** Framer Motion (via the Magic UI `TextAnimate` component wrapper).

## 5. Performance Optimization (March 20, 2026)
*   **Fonts:** All 23 fonts converted from OTF/TTF to WOFF2 (2,854KB → 1,066KB). 4 unused Satoshi weights removed. Preload links updated in index.html.
*   **Images:** 5 marquee PNG logos → resized WebP (507KB → 25KB). Dead PNGs deleted (rahul.png, lockup PNGs — 1.5MB with zero code refs).
*   **Homepage loading:** Single Suspense boundary split into 3 IntersectionObserver groups. GHL booking iframe deferred until scroll.
*   **JS bundles:** Sentry deferred via requestIdleCallback (main bundle 562KB → 310KB). Sentry in its own lazy chunk. Total dist: 7.1MB → 5.0MB.
*   **npm audit:** 0 vulnerabilities (flatted + minimatch patched).

## 6. Recent UI Changes (March 20, 2026)
*   **ShareBar** (`src/components/ShareBar.jsx`): LinkedIn, X, Email, Copy Link buttons added to BlogInner and WorkInner.
*   **OG image:** RSL/A lockup on #0a0a0a black, 92% fill, 1200x630, 15KB. Source SVG: `rsla-lockup.svg`.
*   **Decorative font:** `font-drama` (Playfair Display) swapped to `font-sans` (Satoshi) on blog/case study pages only (pull quotes, blockquotes, testimonials, case study descriptions). Rest of site keeps Playfair.
*   **IndustryPage:** Route `/ai-for/:slug` added to App.jsx. Component at `src/pages/IndustryPage.jsx` — now fully wired to Sanity CMS.

## 7. Bug Fixes (March 20-21, 2026)
*   **Blank page on first visit:** Lazy chunk import failures caused permanent blank pages. Added `lazyRetry()` wrapper in App.jsx (3 retries, 1.5s backoff, then reload). Added `<PageLoader />` spinner as Suspense fallback. Fixed `pageReady` to start `true` on initial load.
*   **Invisible page content after navigation:** `useScrollToTop` in App.jsx killed ALL ScrollTriggers on route change, including the new page's triggers. Removed the blanket kill — each page cleans up its own via `ctx.revert()`.
*   **Error boundary overhaul:** Now handles DOM desync (auto-recover), chunk errors (auto-reload), and app errors (retry button instead of blank page). In `src/main.jsx`.
*   **Hero CTA flash:** Added `opacity-0` CSS class to CTA buttons so they start hidden before GSAP entrance animation fires.
*   **Hero CTA stuck:** Changed `transition-all` to `transition-colors` on secondary CTA to stop CSS transitions from fighting GSAP opacity animation.

## 8. Logo Marquee Updates (March 20, 2026)
*   Merged two rows into single continuous row (27 logos, 45s duration).
*   Heading: "We have worked with" (was "We integrate with").
*   Logo order: lesser-known first (positions 1-6), high-profile (Anthropic, Claude, Meta, ChatGPT, Stripe, Gemini, Antigravity, GitHub) at positions 7-14 for viewport visibility on scroll.

## 9. Programmatic SEO Pipeline (March 21, 2026)

### Architecture
*   **Sanity schema:** `industryPage` document type in rslaStudio with 6 field groups (Hero, Pain & Stats, Before/After, Proof [optional], FAQ, SEO). Schema deployed to Sanity cloud.
*   **Template:** `src/pages/IndustryPage.jsx` — Hormozi/Acquisition.com inspired. Dark hero (#0A0A0A), question headlines, font-extrabold headings, font-light body, before/after comparisons, big proof stat (optional), objection-handling FAQ, mid-page CTA. No booking embed (links to /book-a-call).
*   **Sanity queries:** `industryPageBySlugQuery` and `industryPagesQuery` in `src/sanity/lib/queries.ts`.
*   **Pre-rendering:** `scripts/prerender.mjs` fetches all published industryPage documents and generates static HTML. 53 total pre-rendered pages.
*   **Internal linking:** "Industries We Serve" grid at bottom of `/services` page, auto-populated from Sanity.

### Live Pages (8 total)
| Slug | Industry | Proof | Case Study |
|------|----------|-------|------------|
| real-estate | Real Estate | 60x ROAS ($600→$36K) | salon-marketing-automation-roi |
| healthcare | Healthcare | — | — |
| accounting | Accounting | — | — |
| contractors | Contractors | $15K recovered | field-service-operations-automation |
| ecommerce | E-commerce | — | — |
| restaurants | Restaurants | 132 reviews, $25K | local-seo-reputation-management |
| dental | Dental | — | — |
| insurance | Insurance | — | — |

### To Add Next
*   More industries: law firms, financial advisors, small business, marketing agencies, salons, mortgage brokers
*   Tool pages: GoHighLevel, n8n, Make, Zapier
*   Service pages: voice agents, AI receptionist, chatbots, database reactivation
*   Comparison pages: GHL vs HubSpot, GHL vs Salesforce, etc.
*   `/solutions` directory page (optional)
*   Footer "Solutions" column (optional)

### Adding a New Industry Page (no code changes needed)
1. Go to studio.rsla.io → Industry Pages → Create new
2. Fill in all fields (Hero, Pain & Stats, Before/After, FAQ are required; Proof is optional)
3. Set status to "Published"
4. Publish the Sanity document
5. Next Vercel build auto-pre-renders it and includes it in the Services page grid
