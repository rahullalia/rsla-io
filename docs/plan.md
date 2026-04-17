# RSL/A Website Build Plan

## Phase 1: Foundation ✓

### 1.1 Font Swap
- [x] Replace Google Fonts in index.html (Satoshi, Inter, Space Grotesk, Playfair Display)
- [x] Update tailwind.config.js font families
- [x] Add `.font-body` (Inter) utility
- [x] Update all className references across components
- [x] Preload Satoshi Bold for hero headline

### 1.2 Color and Design Tokens
- [x] Verify tailwind palette matches brand (Deep Slate, Pure White, Warm Sand, Anchor Blue, Electric Cyan, Soft Coral)
- [x] Update any hardcoded color values

### 1.3 Navbar
- [x] Update nav links: Home, About, Work, Blog, Let's Talk
- [x] Update CTA text to "Let's Talk"
- [x] Verify scroll behavior (transparent to glassmorphic)

### 1.4 Footer
- [x] Update links to match new site structure
- [x] Update copy

### 1.5 Cleanup
- [x] Remove unused pages: Rahul.jsx, Sid.jsx, Insider.jsx, BookingConfirmed.jsx
- [x] Remove unused components: Team.jsx
- [x] Update router in App.jsx

---

## Phase 2: Homepage ✓

### 2.1 Canvas Particle Hero
- [x] Build CanvasParticles.jsx (Canvas 2D, interactive nodes)
  - Faint geometric nodes on Deep Slate
  - Mouse interaction: connect within 150px radius
  - Respond to cursor velocity
  - Two parallax layers
  - 60fps, max 200 particles
  - Pause when tab not visible
- [x] Hero layout with tags, headline, subheadline, CTAs
- [x] Word-by-word GSAP stagger on headline
- [x] Playfair accent word SVG line-drawing animation
- [x] Border Beam effect on primary CTA

### 2.2 Problem Section ("The Bottleneck")
- [x] Build ProblemSection.jsx
- [x] Dark background, centered max-width text
- [x] GSAP ScrollTrigger text fade-up
- [x] Copy from rslaHomePageCopy.md section 2

### 2.3 Services Stacking Cards (Strategic Scroll Moment #1)
- [x] Build ServicesCards.jsx
- [x] Three pinned cards with GSAP ScrollTrigger scrub
- [x] Current card compresses on next card entry (scale 0.9, opacity 0.5, blur 20px)
- [x] Card 1: AI Lead Gen with animated beam visual
- [x] Card 2: AI Automations with typewriter terminal
- [x] Card 3: AI Operations with dashboard mockup
- [x] Copy from rslaHomePageCopy.md section 3

### 2.4 How It Works
- [x] Build HowItWorks.jsx
- [x] Three numbered steps with GSAP stagger reveals
- [x] Copy from rslaHomePageCopy.md / rslaPagesCopy.md section 2

### 2.5 Founder Section ("The Mentor")
- [x] Build FounderSection.jsx
- [x] Split layout: grayscale-to-color photo + text
- [x] GSAP scroll-triggered photo transition
- [x] Playfair signature
- [x] Blog CTA
- [x] Copy from rslaHomePageCopy.md section 4

### 2.6 Case Studies Teaser ("The Proof" - Strategic Scroll Moment #2)
- [x] Build ProofSection.jsx
- [x] Option B: Minimalist rows with GSAP stagger, large accent metrics
- [x] Connect to Sanity for live case study data
- [x] Copy from rslaHomePageCopy.md section 5

### 2.7 Marquee Strip
- [x] Build MarqueeStrip.jsx
- [x] Edge-to-edge auto-scrolling labels or logos
- [x] Subtle speed increase on scroll past (1.5x)

### 2.8 Booking Section
- [x] Build BookingSection.jsx
- [x] Dark card with rounded-[3rem]
- [x] Radial gradient blur blobs
- [x] GHL calendar embed
- [x] Copy from rslaHomePageCopy.md section 6

### 2.9 Micro-Interactions (polish pass)
- [x] Magnetic buttons on primary CTAs
- [x] Border beam / neon glow on service cards
- [x] Grayscale lift on images
- [x] Link underline animation
- [x] Button sweep (already exists)

---

## Phase 3: Content Pages ✓

### 3.1 About Page
- [x] Build /about route and page
- [x] Copy from rslaPagesCopy.md section 1
- [x] GSAP entrance animations

### 3.2 How It Works Page
- [x] Build /how-it-works route and page
- [x] Copy from rslaPagesCopy.md section 2

### 3.3 Service Pages (consolidated into /services)
- [x] AI Lead Generation section
- [x] AI Automations section
- [x] AI Operations section
- [x] AI Digital Presence section
- [x] Copy from rslaPagesCopy.md section 3

### 3.4 Start Here Page
- [x] Build /start-here route and page
- [x] Copy from rslaPagesCopy.md section 4

---

## Phase 4: Inner Pages Update ✓

### 4.1 Sanity Client
- [x] Verify client points to new project (yz25oyux)
- [x] Update API version to 2025-03-01

### 4.2 Blog Pages
- [x] Add V2 schema query support alongside V1
- [x] Union query for blog index (V1 + V2)
- [x] Update PortableText renderer for new block types

### 4.3 Case Study Pages
- [x] Add V2 schema query support (tries V2 first, falls back to V1)
- [x] Add featured image rendering to WorkInner.jsx
- [x] Add before/after snapshot rendering
- [x] Update SERVICE_LABELS and INDUSTRY_LABELS
- [x] Update BLOG_SLUG_TO_CASE_CATEGORY mapping

### 4.4 Other Pages
- [x] Update 404 page copy ("Signal lost.")
- [x] Update Privacy Policy copy (February 2026)
- [x] Update Terms of Service copy (February 2026)

---

## Phase 5: Content Migration ✓

### 5.1 Migrate from old Sanity project (36wenybq) to new (yz25oyux)
- [x] Migrate authors and categories first (2 authors, 17 categories)
- [x] Migrate blog posts (40 total: 30 published, 10 drafts)
- [x] Migrate case studies (12 total: 8 published, 4 drafts)
- [x] Migrate image assets (176 images re-uploaded to new CDN)
- [x] Verify all Portable Text content, images, references preserved
- [x] Clean up migration artifacts (legacy-export.ndjson, migrate.mjs)

---

## Phase 6: Performance and Launch

### 6.1 Performance Audit
- [ ] Lighthouse: LCP < 2.5s, TBT < 200ms, CLS < 0.1
- [ ] Bundle analysis: target < 250KB gzipped
- [ ] Canvas: verify 60fps
- [ ] Font loading: font-display swap on all fonts
- [ ] Lazy load below-fold images
- [ ] GSAP ScrollTrigger: once: true on entrance animations

### 6.2 Deployment
- [ ] Vercel project setup
- [ ] Custom domain (rsla.io)
- [ ] Environment variables configured
- [ ] Production build verified
