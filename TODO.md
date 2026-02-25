# RSL/A Website - Remaining Items

## Phase 6: Performance & Launch

### Must Do (Before Go-Live)
- [x] Run Lighthouse audit (Perf 58, Accessibility 94, Best Practices 96, SEO 100)
- [x] Code-split GSAP and Sanity client (585KB → 270KB main chunk)
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
- [x] JSON-LD structured data (Organization, BlogPosting, Article)
- [x] Dynamic OG images from Sanity featured images
- [ ] Install Google Tag Manager snippet
- [ ] Install Meta Pixel
- [ ] Verify canonical tags after domain switch (inspect page source on live site)
- [x] Google Search Console already set up for rsla.io (existing)
- [x] Sitemap auto-submits via robots.txt reference

### Optimizations Done
- [x] Images converted to WebP (rahul.png 801KB → 39KB, lockup-nobg.png 338KB → 6KB)
- [x] Corrupt font files replaced (SpaceGrotesk, PlayfairDisplay)
- [x] React.lazy route-level code splitting
- [x] Seo.jsx component with per-page title/description/OG/robots/JSON-LD

## Wishlist (Post-Launch)

### Performance
- [ ] Lazy-load below-fold sections (services cards, case studies, marquee)
- [ ] Preload hero fonts (Satoshi, Space Grotesk) with font-display: swap
- [ ] Reduce Canvas particle count on mobile or disable entirely
- [ ] Add loading skeleton states for blog/case study listings
- [ ] Image optimization: WebP/AVIF with Sanity image transforms

### UX Enhancements
- [ ] 404 page: Add search or suggested pages instead of just "go home"
- [ ] Blog: Add category filtering and search
- [ ] Blog: Add pagination or infinite scroll (currently loads all)
- [ ] Case studies: Add industry/service type filtering
- [ ] Scroll-to-top button on long pages
- [ ] Page transition animations between routes
- [ ] Dark mode toggle

### Mobile
- [ ] Test booking iframe height on very small phones (<375px width)
- [ ] Ensure all touch targets meet 44x44px minimum
- [ ] Test hamburger menu animation on low-end Android devices

### Content & Marketing
- [ ] Add testimonials/social proof section to homepage
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
