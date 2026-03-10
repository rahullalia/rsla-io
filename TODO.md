# RSL/A Website — TODO

## P0: This Week (Pre-Launch Polish)

- [x] Verify canonical tags on live rsla.io (all 7 indexed pages correct, added fallback to index.html)
- [x] Visual QA pass on all non-homepage routes after theme change
- [x] Test mobile bottom nav on all screen sizes (iPhone SE, standard, tablet)
- [x] Fix Lighthouse accessibility: accent color darkened #0070F3 to #0066E0 (WCAG AA)
- [x] Fix Lighthouse accessibility: footer `<h5>` tags changed to `<p>` (heading hierarchy)
- [x] Fix Lighthouse SEO: "Learn more" changed to "Privacy Policy" (descriptive link text)
- [x] Add `width`/`height` attributes to logo `<img>` tags (navbar + footer)

## P1: Soon (Post-Launch, High Impact) ✓

- [x] Add client logos or tech icons to Marquee (keeping service text labels for now, revisit later)
- [x] Preload hero fonts (Satoshi Bold, Space Grotesk, Inter) in index.html
- [x] Blog: category filtering and search (URL state, debounced search, category pills)
- [x] Blog: set up RSS feed (build-time generation at /rss.xml, 50 latest posts)
- [x] Email capture on blog posts (inline CTA using Kit form, after article body)
- [x] Test booking iframe height on very small phones (responsive, looks good)
- [x] Ensure all touch targets meet 44x44px minimum (33 violations fixed across 15 files)

## P2: When You Get To It (Nice to Have) ✓

- [x] Lazy-load below-fold sections (homepage sections lazy-loaded, main chunk 350KB → 272KB)
- [x] Loading skeleton states for blog/case study listings (BlogCardSkeleton, CaseStudyCardSkeleton)
- [x] Image optimization: WebP/AVIF with Sanity auto-format + quality(80)
- [x] Scroll-to-top button on long pages (floating chevron, appears after 600px scroll)
- [x] Page transition animations between routes (CSS opacity fade on route change)
- [x] Case studies: industry/service type filtering (already implemented with category buttons)
- [x] FAQ section (accordion on homepage, 7 questions, CSS grid transition)
- [x] Progressive blur for blog hero images (CSS blur-up effect on load)

## P3: Future (New Features)

- [~] Individual service pages — not needed for now, current /services covers it
- [~] Pricing page — not needed, custom quotes only
- [~] FAQ page — not needed, FAQ section lives on homepage
- [ ] Careers page (when ready)
- [x] Fix logo marquee Safari mobile overlap (replaced Magic UI Marquee with pure CSS, fixed SVGs, removed lazy loading)

## P4: Infrastructure (Background) ✓

- [x] Set up Vercel preview deployments for PRs (already enabled by default on Vercel GitHub integration)
- [x] Add error monitoring (Sentry SDK installed, ErrorBoundary in main.jsx, DSN via VITE_SENTRY_DSN env var)
- [x] Set up uptime monitoring (Vercel Speed Insights, external monitor TBD)
- [x] Configure Vercel Edge caching headers (immutable 1yr for /assets + /fonts, 30d for images, 7d for OG image)
- [x] Pre-render all indexed pages for AI tool visibility (57 pages via scripts/prerender.mjs)
- [x] Update public-facing positioning text (index.html, llms.txt) to current brand message

---

## Completed

<details>
<summary>Phase 6: Performance & Launch</summary>

- [x] Run Lighthouse audit (Perf 96, Accessibility 95, Best Practices 96, SEO 92)
- [x] Code-split GSAP and Sanity client (585KB to 270KB main chunk)
- [x] Create og-image.png (1200x630)
- [x] Wire /insider newsletter form to Kit (ConvertKit)
- [x] Connect custom domain rsla.io to Vercel (DNS + SSL)
- [x] URL parity audit (all 30 blog + 8 case study slugs match, no redirects needed)
- [x] Dynamic sitemap.xml (generated from Sanity at build time, 45 URLs)
- [x] robots.txt
- [x] Test all Sanity content rendering on production (fixed CORS)
- [x] Verify booking embed (GHL widget) on /book-a-call
- [x] Test /booking-confirmed (chromeless, no nav/footer)
- [x] Cross-browser testing (Chrome, Safari, Firefox, mobile, tablet)
- [x] JSON-LD structured data on all indexed pages + WebSite schema for SERP brand name
- [x] Dynamic OG images from Sanity featured images
- [x] Install Google Tag Manager snippet (gated behind cookie consent)
- [x] Install Meta Pixel
- [x] Favicon: logomark.svg + favicon.ico (48x48, 96x96) + apple-touch-icon.png (180x180) + PWA icons
- [x] noIndex on all non-indexed pages
- [x] Google Search Console set up for rsla.io
- [x] Sitemap auto-submits via robots.txt reference
- [x] Images converted to WebP
- [x] React.lazy route-level code splitting
- [x] Seo.jsx with per-page title/description/OG/robots/JSON-LD (supports array of schemas)

</details>

<details>
<summary>Phase 7: UI Component Implementation</summary>

- [x] Initialize shadcn CLI, update Tailwind to blue-gray theme
- [x] Install Magic UI components (InteractiveHoverButton, MagicCard, TextAnimate, Marquee, NumberTicker, ShineBorder, FlickeringGrid, Confetti)
- [x] Build all homepage sections (HeroV2, ServicesV2, StatsSection, Testimonials, BlogPreview, CtaWithGlow, MarqueeV2)
- [x] NavbarV2 + FooterV2 site-wide swap
- [x] Homepage polish (card-beam, masonry testimonials, marquee/shine keyframes, visual QA)
- [x] Propagate light theme + semantic colors to all pages
- [x] Cookie consent banner (gates GTM, desktop pill + mobile card, revocation via footer)
- [x] Real testimonials (5 clients, Sid S. featured)
- [x] 404 page redesign (FlickeringGrid, TextAnimate, InteractiveHoverButton)
- [x] Legal pages (Privacy, Terms, Disclaimer, Accessibility)
- [x] Digital business cards (/rahul, /sid)
- [x] Security headers in vercel.json (CSP, X-Frame-Options, etc.)
- [x] PortableText link sanitization (blocks javascript: protocol)
- [x] Delete all deprecated files from old website
- [x] Fix Dependabot alerts (basic-ftp, rollup)

</details>
