# RSL/A Website — TODO

## P0: Programmatic SEO — Next Actions

- [ ] Add more industry pages: law firms, financial advisors, small business, marketing agencies, salons, mortgage brokers, recruitment, startups (all had keyword signal)
- [ ] Add "Industries We Serve" grid to Services page as internal linking (Option C) — DONE, live
- [ ] Add "Solutions" column to footer linking to /ai-for/ pages (Option B, optional)
- [ ] Build a `/solutions` directory page listing all industry pages (optional, for browsing)
- [ ] Monitor Google Search Console indexation rate for /ai-for/ pages — target >70% within 30 days
- [ ] Track which industry pages rank and for which keywords (consider SerpBear self-hosted tracker)
- [ ] Add tool pages: GoHighLevel, n8n, Make, Zapier (8 tool-specific pages from keyword research)
- [ ] Add service pages: voice agents, AI receptionist, chatbots, database reactivation, lead nurturing, email automation, appointment booking, sales automation (8 service pages)
- [ ] Add comparison pages: GHL vs HubSpot, GHL vs Salesforce, GHL vs Pipedrive, etc. (10 comparison pages)

## P1: Bug Fixes — Completed This Session

- [x] Fix blank page on first visit (lazy chunk retry + error boundary recovery)
- [x] Fix invisible page content after navigation (ScrollTrigger kill bug in useScrollToTop)
- [x] Fix hero CTA buttons flashing before GSAP entrance animation
- [x] Fix secondary hero CTA "stuck" during load (transition-all fighting GSAP)

## P2: Logo Marquee — Completed This Session

- [x] Merge two rows into single continuous row (fixes gap on second row)
- [x] Change heading to "We have worked with"
- [x] Reorder logos — high-profile names visible when user scrolls to section

## P3: Future (New Features)

- [~] Individual service pages — not needed for now, current /services covers it
- [~] Pricing page — not needed, custom quotes only
- [~] FAQ page — not needed, FAQ section lives on homepage
- [ ] Careers page (when ready)

## P4: Infrastructure

- [x] Update Vercel CLI (48.10.11 → latest)
- [x] Pre-render all indexed pages including industry pages (53 pages total)
- [x] Performance pass: WOFF2 fonts, WebP images, split Suspense, deferred Sentry
- [x] npm audit: 0 vulnerabilities

## SERP Site Name

- Technical implementation is correct (WebSite JSON-LD, og:site_name, title all say "RSL/A")
- User submitted re-index request in Google Search Console
- Google just needs time to process — no code changes needed
- Check back in 2-4 weeks

---

## Completed (This Session)

<details>
<summary>2026-03-20: Bug Fixes + Marquee + Programmatic SEO</summary>

- [x] Fix blank page on first visit (lazyRetry wrapper, PageLoader, error boundary overhaul)
- [x] Fix invisible page content (removed ScrollTrigger kill from useScrollToTop)
- [x] Fix hero CTA flash (added opacity-0 CSS class)
- [x] Fix hero CTA stuck animation (transition-all → transition-colors)
- [x] Merge marquee to single row, reorder logos, change heading
- [x] Keyword research: 370+ keywords from Google Autocomplete
- [x] Sanity schema: industryPage document type (6 field groups, optional proof)
- [x] IndustryPage.jsx template: Hormozi-inspired dark hero, before/after, stats, FAQ
- [x] Wire IndustryPage to Sanity CMS (GROQ queries, dynamic fetch)
- [x] Add pre-rendering for industry pages in prerender.mjs
- [x] 8 industry pages researched, written, and published:
  - Real Estate (60x ROAS proof, salon suite case study linked)
  - Healthcare (no proof)
  - Accounting (no proof)
  - Contractors ($15K recovered proof, Housecall Pro case study linked)
  - E-commerce (no proof)
  - Restaurants (132 reviews proof, pizza restaurant case study linked)
  - Dental (no proof)
  - Insurance (no proof)
- [x] Industries grid on /services page (auto-grows from Sanity)
- [x] Production deploy: 53 pre-rendered pages
- [x] Sitemap submitted to Google Search Console
</details>

<details>
<summary>Previous sessions (P0–P4, Phase 6–7)</summary>

- [x] All P0 through P4 items from previous sessions
- [x] Phase 6: Performance & Launch (Lighthouse 96/95/96/92)
- [x] Phase 7: UI Component Implementation (Magic UI, shadcn, etc.)
- [x] Phase 8: Performance Optimization (fonts, images, Sentry, code splitting)
</details>
