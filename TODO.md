# RSL/A Website - Remaining Items

## Phase 6: Performance & Launch

### Must Do (Before Go-Live)
- [x] Run Lighthouse audit (Perf 58, Accessibility 94, Best Practices 96, SEO 100)
- [x] Code-split GSAP and Sanity client (585KB to 270KB main chunk)
- [x] Create og-image.png (1200x630)
- [x] Wire /insider newsletter form to Kit (ConvertKit)
- [ ] Connect custom domain rsla.io to Vercel (DNS + SSL)
- [x] URL parity audit (all 30 blog + 8 case study slugs match, no redirects needed)
- [x] Dynamic sitemap.xml (generated from Sanity at build time, 45 URLs)
- [x] robots.txt
- [x] Test all Sanity content rendering on production (fixed CORS)
- [x] Verify booking embed (GHL widget) on /book-a-call
- [x] Test /booking-confirmed (chromeless, no nav/footer)
- [x] Cross-browser testing (Chrome, Safari, Firefox, mobile, tablet)

### SEO Finalization
- [x] JSON-LD structured data on all indexed pages (Organization, Person, ProfessionalService, HowTo, CollectionPage, WebPage, BlogPosting, Article)
- [x] Dynamic OG images from Sanity featured images
- [x] Install Google Tag Manager snippet (gated behind cookie consent)
- [x] Install Meta Pixel
- [x] Favicon: logomark.svg + favicon.ico (32x32) + apple-touch-icon.png (180x180) + PWA icons
- [x] noIndex on all non-indexed pages (404, /book-a-call, /booking-confirmed, /rahul, /sid, /insider, /privacy-policy, /terms, /disclaimer, /accessibility)
- [ ] Verify canonical tags after domain switch (inspect page source on live site)
- [x] Google Search Console already set up for rsla.io (existing)
- [x] Sitemap auto-submits via robots.txt reference

### Optimizations Done
- [x] Images converted to WebP (rahul.png 801KB to 39KB, lockup-nobg.png 338KB to 6KB)
- [x] Corrupt font files replaced (SpaceGrotesk, PlayfairDisplay)
- [x] React.lazy route-level code splitting
- [x] Seo.jsx component with per-page title/description/OG/robots/JSON-LD

## Phase 7: UI Component Implementation (NEW)

### Completed
- [x] Initialize shadcn CLI (components.json, tsconfig.json)
- [x] Update Tailwind palette to blue-gray theme (slate-50 bg, slate-900 text, blue-tinted borders)
- [x] Add CSS custom properties for shadcn + brand glow
- [x] Install Magic UI components: InteractiveHoverButton, MagicCard, TextAnimate, Marquee, NumberTicker, ShineBorder
- [x] Convert Aurora Background (Aceternity) to JSX with brand colors
- [x] Convert CTA with Glow (Launch UI) to JSX, no shadcn deps
- [x] Convert Testimonials (Tailus) to plain HTML + Tailwind lifted cards
- [x] Convert Footer to FooterV2 with newsletter wired to Kit API
- [x] Convert Tubelight Navbar to NavbarV2 with GSAP lamp animation
- [x] Build HeroV2 with Aurora Background + TextAnimate + InteractiveHoverButton
- [x] Build ServicesV2 with Magic Card grid (replaces scroll-snap stacking cards)
- [x] Build StatsSection with Number Ticker count-up
- [x] Build Testimonials section with GSAP stagger entrance
- [x] Build BlogPreview fetching latest 3 posts from Sanity
- [x] Build MarqueeV2 with Magic UI Marquee component
- [x] Build CTA with Glow section
- [x] Swap NavbarV2 into App.jsx (site-wide)
- [x] Swap FooterV2 into App.jsx (site-wide)
- [x] Code-split motion library into separate chunk (93KB/31KB gzipped)

### Homepage Polish (Done)
- [x] FooterV2 dark theme (#0A0A0A) with bigger logo, email in brand column, no Start Here link
- [x] InteractiveHoverButton blue-filled with white dot expand animation
- [x] ServicesV2 card-beam rotating gradient border (conic-gradient CSS, 1px)
- [x] Testimonials masonry grid restored (1 featured 2x2 + 4 regular = 5 cards)
- [x] CTA section: FlickeringGrid background, InteractiveHoverButton CTA, fixed group hover conflict
- [x] Marquee keyframes added (was not animating)
- [x] ShineBorder shine keyframes added to Tailwind config
- [x] Newsletter subheading updated ("Join the insider club")
- [x] Visual QA pass on homepage (all sections verified via screenshots)

### Remaining
- [x] Propagate light theme to other pages (About, Services, HowItWorks, StartHere, NotFound, Work CTA, BlogInner related case study)
- [x] Install Confetti (Magic UI) for /booking-confirmed page
- [x] Convert Blog, BlogInner, Work, WorkInner, PortableTextRenderer to semantic colors
- [x] Convert remaining pages (Insider, BookCall, BookingConfirmed, Privacy, Terms) to light theme
- [x] Add UI polish components (ShineBorder, FlickeringGrid, Confetti) to business card and confirmation pages
- [x] Create /sid digital business card page
- [x] Cookie consent banner (mobile optimized, gates GTM loading)
- [ ] Visual QA pass on all non-homepage routes after theme change
- [x] Remove ThemePreview.jsx and route (temporary page)
- [x] Delete deprecated files (CanvasParticles.jsx, Navbar.jsx, Footer.jsx, ServicesCards.jsx, Hero.jsx, MarqueeStrip.jsx, ProblemSection.jsx, vite.svg)
- [ ] Re-run Lighthouse audit on new homepage
- [ ] Test mobile nav (bottom pill) on all screen sizes
- [ ] Add client logos or tech icons to Marquee
- [ ] Add real testimonials from RSLA clients (currently placeholder data)

## Wishlist (Post-Launch)

### Performance
- [ ] Lazy-load below-fold sections (services cards, case studies, marquee)
- [ ] Preload hero fonts (Satoshi, Space Grotesk) with font-display: swap
- [ ] Add loading skeleton states for blog/case study listings
- [ ] Image optimization: WebP/AVIF with Sanity image transforms

### UX Enhancements
- [ ] 404 page: Add search or suggested pages instead of just "go home"
- [ ] Blog: Add category filtering and search
- [ ] Blog: Add pagination or infinite scroll (currently loads all)
- [ ] Case studies: Add industry/service type filtering
- [ ] Scroll-to-top button on long pages
- [ ] Page transition animations between routes
- [ ] FAQ section (component saved, uses Radix accordion)
- [ ] Progressive blur for blog hero images (CSS-only version ready)

### Mobile
- [ ] Test booking iframe height on very small phones (<375px width)
- [ ] Ensure all touch targets meet 44x44px minimum

### Content & Marketing
- [ ] Add pricing page or pricing section
- [ ] Blog: Set up RSS feed
- [ ] Set up email capture on blog posts (inline CTA or exit intent)

### Infrastructure
- [ ] Set up Vercel preview deployments for PRs
- [ ] Add error monitoring (Sentry or similar)
- [ ] Set up uptime monitoring
- [ ] Configure Vercel Edge caching headers for static assets

### Future Pages
- [ ] Individual service pages (/services/ai-automation, /services/paid-ads, etc.)
- [ ] Pricing page
- [ ] FAQ page
- [ ] Careers page (when ready)
