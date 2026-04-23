# LOG.md - rslaWebsite

## 2026-04-22 - Code Audit & Critical Fixes

### What happened
Full codebase audit across all layers: config, API routes, components, pages, hooks, Sanity queries, build scripts, and Tailwind config. 30 issues identified, 12 fixed so far.

### Fixed (deployed)

| # | Issue | Severity | File | Fix |
|---|-------|----------|------|-----|
| 1 | Prerender HTML flash (unstyled plain text visible before React renders) | Critical | `index.html` | Added inline `<style>#prerender{display:none}</style>` in `<head>` with `<noscript>` fallback |
| 2 | CSP blocked Meta Pixel (script, img, connect-src all missing Facebook domains) | Critical | `vercel.json:23` | Added `connect.facebook.net` to `script-src` and `connect-src`, `www.facebook.com` to `img-src` |
| 3 | `lazyRetry` infinite reload loop (stale tab after deploy = infinite page reloads) | Critical | `src/App.jsx:17-24` | Added `sessionStorage` guard; second failure falls back to NotFound page instead of looping |
| 4 | Sentry DSN empty in `.env.local` | Critical | `.env.local` | Confirmed DSN is set in Vercel env vars; works in production, only affects local dev |
| 5 | No rate limiting on `subscribe.mjs` (Kit subscriber spam risk) | High | `api/subscribe.mjs` | Added in-memory IP-based rate limiter (5 req/min per IP) |
| 6 | No rate limiting on `llm/[slug].mjs` (serverless cost risk) | High | `api/llm/[slug].mjs` | Added in-memory IP-based rate limiter (30 req/min per IP) + GET-only method check |
| 7 | Build scripts silently swallow failures | High | `scripts/prerender.mjs`, `generateSitemap.mjs`, `generateRssFeed.mjs` | Changed from `console.warn` to `console.error` + set `process.exitCode = 1` so failed builds are visible |
| 8 | Sanity fetches missing isMounted guards | High | `BlogPreview.jsx`, `LeadMagnet.jsx` | Added isMounted guards and .catch() error handling |
| 9 | GSAP opacity-0 flash on 5 components | High | `FounderSection`, `BlogPreview`, `StatsSection`, `Testimonials`, `CtaWithGlow` | Added `opacity-0` CSS class to all GSAP-animated elements |
| 10 | Seo.jsx stale meta tags persist across route changes | High | `src/components/Seo.jsx` | Full cleanup of all meta tags on unmount; removed unused `JSON_LD_ID` variable |

### Identified - not yet fixed

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
| 24 | Unused Tailwind values (accent-wash, font-editorial, font-drama, marquee-scroll, marquee-reverse) | `tailwind.config.js` |
| 25 | Lead magnet pages missing from prerender/sitemap | `scripts/` |
| 26 | `fixFavicon.mjs` destructively overwrites source SVG | `scripts/fixFavicon.mjs:27` |
| 27 | 6 files with `console.error` left in production code | Various |
| 28 | Blog debounce timer ref not cleared on unmount | `Blog.jsx` |
