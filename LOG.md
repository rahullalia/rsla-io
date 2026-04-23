# LOG.md - rslaWebsite

## 2026-04-22 - Code Audit & Critical Fixes

### What happened
Full codebase audit across all layers: config, API routes, components, pages, hooks, Sanity queries, build scripts, and Tailwind config.

### Fixed (deployed)

| # | Issue | Severity | File | Fix |
|---|-------|----------|------|-----|
| 1 | Prerender HTML flash (unstyled plain text visible before React renders) | Critical | `index.html` | Added inline `<style>#prerender{display:none}</style>` in `<head>` with `<noscript>` fallback |
| 2 | CSP blocked Meta Pixel (script, img, connect-src all missing Facebook domains) | Critical | `vercel.json:23` | Added `connect.facebook.net` to `script-src` and `connect-src`, `www.facebook.com` to `img-src` |
| 3 | `lazyRetry` infinite reload loop (stale tab after deploy = infinite page reloads) | Critical | `src/App.jsx:17-24` | Added `sessionStorage` guard; second failure falls back to NotFound page instead of looping |

### Needs input from Rahul

| # | Issue | Severity | What's needed |
|---|-------|----------|---------------|
| 4 | Sentry DSN is empty - zero error monitoring in production | Critical | Sentry DSN string. Check if it's set in Vercel env vars or grab from sentry.io dashboard |

### Identified - not yet fixed

#### High priority
| # | Issue | Severity | File |
|---|-------|----------|------|
| 5 | No rate limiting on `subscribe.mjs` (Kit subscriber spam risk, costs money) | High | `api/subscribe.mjs` |
| 6 | No rate limiting on `llm/[slug].mjs` (serverless cost risk) | High | `api/llm/[slug].mjs` |
| 7 | Build scripts silently swallow failures (Sanity outage = broken deploy with no alert) | High | `scripts/prerender.mjs:1179`, `generateSitemap.mjs:92`, `generateRssFeed.mjs:81` |
| 8 | All Sanity fetches lack AbortController (wasted requests, state-on-unmounted errors) | High | Multiple pages |
| 9 | Multiple GSAP opacity-0 flash issues (elements missing `opacity-0` CSS class) | High | `FounderSection`, `BlogPreview`, `CtaWithGlow`, `StatsSection`, `Testimonials` |
| 10 | Seo.jsx stale meta tags persist across route changes | High | `src/components/Seo.jsx` |

#### Medium priority
| # | Issue | Severity | File |
|---|-------|----------|------|
| 11 | 10 dead Sanity queries in queries.ts | Medium | `src/sanity/lib/queries.ts` |
| 12 | 4 dead components never imported (HowItWorks, SystemArchitecture, MarqueeV2, ProofSection) | Medium | `src/components/` |
| 13 | V1/V2 case study type mismatch (related case studies always empty for V1 entries) | Medium | `WorkInner.jsx:91-106` |
| 14 | NavbarV3 mobile menu lacks focus trap and Escape key handling | Medium | `src/components/NavbarV3.jsx` |
| 15 | ServicesV2 has 5 infinitely looping GSAP timelines running off-screen | Medium | `src/pages/ServicesV2.jsx` |
| 16 | Dual analytics: GA4 unconditional + GTM behind consent (potential double-counting) | Medium | `index.html` + `CookieConsent.jsx` |

#### Low priority / housekeeping
| # | Issue | File |
|---|-------|------|
| 17 | Package name is `"temp-vite"` | `package.json:2` |
| 18 | `@types/react-router-dom@5` stale (router is v7) | `package.json:37` |
| 19 | `@types/canvas-confetti` in `dependencies` not `devDependencies` | `package.json:20` |
| 20 | `@gsap/react` in manualChunks but never imported | `vite.config.js:23` |
| 21 | `rollupOptions.external: []` is a no-op | `vite.config.js:19` |
| 22 | `firstName` not sanitized in subscribe endpoint | `api/subscribe.mjs:81` |
| 23 | Tags array accepts arbitrary values (no allowlist) | `api/subscribe.mjs:84` |
| 24 | No HTTP method check on LLM endpoint | `api/llm/[slug].mjs:156` |
| 25 | Unused Tailwind values (accent-wash, font-editorial, font-drama, marquee-scroll, marquee-reverse) | `tailwind.config.js` |
| 26 | Lead magnet pages missing from prerender/sitemap | `scripts/` |
| 27 | `fixFavicon.mjs` destructively overwrites source SVG | `scripts/fixFavicon.mjs:27` |
| 28 | 6 files with `console.error` left in production code | Various |
| 29 | Blog debounce timer ref not cleared on unmount | `Blog.jsx` |
| 30 | `JSON_LD_ID` unused variable in Seo.jsx | `src/components/Seo.jsx` |
