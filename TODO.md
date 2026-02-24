# RSL/A Website - Remaining Items

## Phase 6: Performance & Launch

### Must Do (Before Go-Live)
- [ ] Run Lighthouse audit on all key pages (target: LCP <2.5s, TBT <200ms, CLS <0.1)
- [ ] Code-split GSAP and Sanity client (main chunk is 585KB pre-gzip, over Vite's 500KB warning)
- [ ] Create og-image.png (1200x630) and place in /public — OG tags already reference it
- [ ] Wire /insider newsletter form to provider (GHL, ConvertKit, or Mailchimp)
- [ ] Connect custom domain rsla.io to Vercel (DNS + SSL)
- [ ] Set up Vercel redirects from old routes if URL structure changed
- [ ] Add sitemap.xml (auto-generate or static, exclude noindex routes)
- [ ] Add robots.txt (allow all, reference sitemap)
- [ ] Test all Sanity content rendering (blog posts, case studies) on production
- [ ] Verify booking embed (GHL widget) works on /book-a-call
- [ ] Test /booking-confirmed as redirect URL from booking tool
- [ ] Cross-browser testing (Chrome, Safari, Firefox, mobile Safari, Chrome Android)

### SEO Finalization
- [ ] Add structured data / Schema.org JSON-LD (Organization, BlogPosting, Article)
- [ ] Verify canonical tags render correctly on deployed site
- [ ] Set up Google Search Console for rsla.io
- [ ] Submit sitemap to Google Search Console
- [ ] Set up 301 redirects from old rsla.io routes to new ones (if URLs changed)
- [ ] Check that blog post and case study pages pull dynamic OG images from Sanity

## Wishlist (Nice to Have)

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
- [ ] Dark mode toggle (site already has dark sections, could extend)

### Mobile
- [ ] Test booking iframe height on very small phones (<375px width)
- [ ] Ensure all touch targets meet 44x44px minimum (some secondary buttons are 32-40px)
- [ ] Test hamburger menu animation on low-end Android devices

### Content & Marketing
- [ ] Swap fonts to final spec (Satoshi, Inter, Space Grotesk, Playfair Display) — some still use defaults
- [ ] Add testimonials/social proof section to homepage
- [ ] Add pricing page or pricing section
- [ ] Blog: Set up RSS feed
- [ ] Add Google Analytics / GA4 or Plausible
- [ ] Add Google Tag Manager
- [ ] Add Meta Pixel for ad tracking
- [ ] Set up email capture on blog posts (inline CTA or exit intent)

### Infrastructure
- [ ] Set up Vercel preview deployments for PRs
- [ ] Add error monitoring (Sentry or similar)
- [ ] Set up uptime monitoring
- [ ] Configure Vercel Edge caching headers for static assets
- [ ] Consider Cloudflare in front of Vercel if DDoS/WAF becomes a concern

### Future Pages
- [ ] /api routes (if server-side functionality needed: form handling, webhooks, etc.)
- [ ] Individual service pages (/services/ai-automation, /services/paid-ads, etc.)
- [ ] Pricing page
- [ ] FAQ page
- [ ] Careers page (when ready)
