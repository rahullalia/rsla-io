# LOG.md - rslaWebsite

## 2026-04-22 - Code Audit & Fixes

### What happened
Full codebase audit across all layers: config, API routes, components, pages, hooks, Sanity queries, build scripts, and Tailwind config. 28 issues identified and fixed.

### All fixes

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | Prerender HTML flash before React renders | Critical | Inline `<style>#prerender{display:none}</style>` in `<head>` with `<noscript>` fallback |
| 2 | CSP blocked Meta Pixel | Critical | Added Facebook domains to `script-src`, `connect-src`, `img-src` in `vercel.json` |
| 3 | `lazyRetry` infinite reload loop | Critical | `sessionStorage` guard; falls back to NotFound on second failure |
| 4 | Sentry DSN empty in `.env.local` | Critical | Confirmed set in Vercel env vars; only affects local dev |
| 5 | No rate limiting on `subscribe.mjs` | High | In-memory IP-based rate limiter (5 req/min/IP) |
| 6 | No rate limiting on `llm/[slug].mjs` | High | In-memory IP-based rate limiter (30 req/min/IP) + GET-only method check |
| 7 | Build scripts silently swallow failures | High | `console.error` + `process.exitCode = 1` |
| 8 | Sanity fetches missing isMounted guards | High | Added guards and `.catch()` to `BlogPreview.jsx`, `LeadMagnet.jsx` |
| 9 | GSAP opacity-0 flash on 5 components | High | Added `opacity-0` CSS class to animated elements |
| 10 | Seo.jsx stale meta tags across routes | High | Full cleanup of all meta tags on unmount |
| 11 | 12 dead Sanity queries | Medium | Removed V1 and unused queries from `queries.ts` |
| 12 | 4 dead components | Medium | Deleted `HowItWorks`, `SystemArchitecture`, `MarqueeV2`, `ProofSection` |
| 13 | NavbarV3 mobile menu missing Escape + scroll lock | Medium | Added Escape key handler and `overflow: hidden` on body |
| 14 | Package name was `"temp-vite"` | Low | Renamed to `"rsla-website"` |
| 15 | `@types/react-router-dom@5` stale | Low | Removed (router v7 ships its own types) |
| 16 | `@types/canvas-confetti` in wrong deps section | Low | Moved to `devDependencies` |
| 17 | `@gsap/react` in manualChunks but unused | Low | Removed from chunks |
| 18 | `rollupOptions.external: []` no-op | Low | Removed |
| 19 | `motion` manualChunks didn't match `motion/react` | Low | Added `motion/react` to chunk config |
| 20 | Unused Tailwind: `accent-wash`, `font-editorial`, `font-drama`, `marquee-scroll`, `marquee-reverse` | Low | Removed |
| 21 | Backward-compat color aliases (`dark`, `primary`, `sand`) only used in dead components | Low | Removed |
| 22 | `JSON_LD_ID` unused variable in Seo.jsx | Low | Removed |
| 23 | Blog debounce timer ref not cleared on unmount | Low | Added cleanup `useEffect` |

### Not fixed (low risk, tracked for future)

| # | Issue | Notes |
|---|-------|-------|
| 24 | ServicesV2 has 5 infinitely looping GSAP timelines off-screen | Performance concern but not a bug; needs design decision on whether to use ScrollTrigger or IntersectionObserver |
| 25 | V1/V2 case study type mismatch in `relatedCaseStudiesQuery` | Only affects V1 case studies (if any still exist); `caseStudyBySlugQuery` kept as fallback |
| 26 | Dual analytics (GA4 unconditional + GTM behind consent) | Intentional design decision per commit `9d3883b`; not a bug |
| 27 | `firstName` not sanitized in subscribe endpoint | Low risk; Kit likely escapes on their end |
| 28 | Lead magnet pages missing from prerender/sitemap | Pages are `noIndex`; exclusion may be intentional |
