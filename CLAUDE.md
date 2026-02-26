# CLAUDE.md - RSL/A Website (rsla.io)

## Project Overview

New rsla.io website. React 19 + Vite SPA with GSAP animations, Aurora background hero, Sanity CMS for blogs and case studies. Blue-gray light theme with Magic UI and 21st.dev components.

**Positioning:** "I show founders how to put AI to work, then I build it for them."

**Status:** Phases 1-7 in progress. Phase 7 (UI Component Implementation) actively building. See TODO.md for full task list.

**Deployed:** `new-rsla-website.vercel.app` (auto-deploys from `main` branch)
**GitHub:** `rahullalia/new-rslaWebsite`

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | React 19 + Vite |
| Styling | Tailwind CSS v3.4 + shadcn/ui utilities |
| Animation | GSAP 3 + ScrollTrigger, Motion (for Magic UI components only) |
| UI Components | Magic UI (MagicCard, TextAnimate, Marquee, NumberTicker, ShineBorder, InteractiveHoverButton) |
| Hero Background | Aurora Background (CSS keyframe, adapted from Aceternity) |
| CMS | Sanity (Project: `yz25oyux`, Dataset: `production`) |
| Icons | Lucide React |
| Rich Text | @portabletext/react |
| SEO | Custom Seo.jsx component (no dependencies) |

---

## Key Files and Folders

```
src/
  components/
    Seo.jsx           # Per-page SEO (title, description, OG, Twitter, canonical, robots)
    NavbarV2.jsx       # Tubelight navbar (desktop top pill + mobile bottom pill, GSAP lamp)
    FooterV2.jsx       # Light theme 4-col footer with Kit newsletter
    CookieConsent.jsx  # GDPR cookie banner (gates GTM loading, desktop pill + mobile card)
    FounderSection.jsx # Profile photo + bio
    AuroraBackground.jsx # CSS aurora hero background (adapted from Aceternity)
    HeroV2.jsx         # Aurora + TextAnimate + InteractiveHoverButton hero
    ServicesV2.jsx     # Magic Card grid (3 service cards)
    StatsSection.jsx   # Number Ticker count-up stats
    Testimonials.jsx   # Masonry grid testimonial cards (GSAP stagger)
    BlogPreview.jsx    # Latest 3 Sanity posts
    CtaWithGlow.jsx    # Bottom glow CTA section
    MarqueeV2.jsx      # Magic UI Marquee service labels
    BookingSection.jsx  # GHL booking embed
  pages/
    Home.jsx           # /
    About.jsx          # /about
    Services.jsx       # /services
    HowItWorksPage.jsx # /how-it-works
    StartHere.jsx      # /start-here
    Work.jsx           # /work (case studies listing)
    WorkInner.jsx      # /work/:slug
    Blog.jsx           # /blog
    BlogInner.jsx      # /blog/:slug
    BookCall.jsx       # /book-a-call (noindex)
    BookingConfirmed.jsx # /booking-confirmed (noindex)
    Rahul.jsx          # /rahul (chromeless, noindex)
    Sid.jsx            # /sid (chromeless, noindex)
    Insider.jsx        # /insider (noindex)
    Privacy.jsx        # /privacy-policy (noindex)
    Terms.jsx          # /terms (noindex)
    Disclaimer.jsx     # /disclaimer (noindex)
    Accessibility.jsx  # /accessibility (noindex)
    NotFound.jsx       # 404 catch-all (noindex)
  sanity/
    schemas/           # Sanity schema definitions
    lib/               # Sanity client, image helper, GROQ queries
brand/                 # Brand reference docs
public/
  images/rahul.png     # Profile photo
  rahul.vcf            # vCard for /rahul page
  favicon.ico          # 32x32 from logomark.svg
  apple-touch-icon.png # 180x180 from logomark.svg
  icon-192.png         # PWA icon
  icon-512.png         # PWA icon
PLAN.md                # Build plan (phases 1-5 done)
TODO.md                # Remaining tasks and wishlist
vercel.json            # Vite SPA routing config
```

---

## Route Architecture

| Route | Page | Indexed | Chrome |
|---|---|---|---|
| / | Home | Yes | Full |
| /about | About | Yes | Full |
| /services | Services | Yes | Full |
| /how-it-works | HowItWorksPage | Yes | Full |
| /start-here | StartHere | Yes | Full |
| /work | Work | Yes | Full |
| /work/:slug | WorkInner | Yes | Full |
| /blog | Blog | Yes | Full |
| /blog/:slug | BlogInner | Yes | Full |
| /book-a-call | BookCall | No | Full |
| /booking-confirmed | BookingConfirmed | No | Full |
| /rahul | Rahul | No | Chromeless |
| /sid | Sid | No | Chromeless |
| /insider | Insider | No | Full |
| /privacy-policy | Privacy | No | Full |
| /terms | Terms | No | Full |
| /disclaimer | Disclaimer | No | Full |
| /accessibility | Accessibility | No | Full |
| * (404) | NotFound | No | Full |

**Chromeless pages** (no navbar/footer): controlled by `chromelessRoutes` array in App.jsx.
**noIndex pages**: controlled per-page via `<Seo noIndex />` component prop.

---

## Sanity CMS

- **Project ID:** `yz25oyux`
- **Dataset:** `production`
- **API Version:** `2025-03-01`
- **Schemas deployed:** blogPost, blogPostV2, caseStudy, caseStudyV2, author, category, blogGenerationJob
- **Legacy project:** `36wenybq` (content migrated to new project, 2026-02-22)
- **Content:** 40 blog posts, 12 case studies, 17 categories, 1 author (Rahul Lalia), 176 images
- **Client config:** projectId/dataset hardcoded in `src/sanity/lib/client.ts` (env vars don't resolve during Vercel build)
- **Token:** `VITE_SANITY_API_TOKEN` in `.env.local` (only needed for draft content, not CDN reads)

---

## SEO Implementation

- `Seo.jsx` component uses `useEffect` to set `document.title` and create/update meta tags
- Props: `title`, `description`, `canonical`, `noIndex`, `jsonLd`
- Updates: description, og:title, og:description, og:url, twitter:title, twitter:description, canonical link, robots, JSON-LD
- Default fallback tags in `index.html` for crawlers that don't execute JS
- BlogInner/WorkInner pull dynamic SEO from Sanity content
- OG image: `/og-image.png` (1200x630, created)
- Favicons: logomark.svg (primary), favicon.ico (32x32), apple-touch-icon.png (180x180)
- JSON-LD on all indexed pages: Organization (Home), Person (About), ProfessionalService (Services), HowTo (HowItWorks), WebPage (StartHere), CollectionPage (Work, Blog), BlogPosting/Article (BlogInner, WorkInner)
- GTM (GTM-MVJQSMF8): loaded conditionally via CookieConsent.jsx only after user accepts cookies
- noIndex on: /book-a-call, /booking-confirmed, /rahul, /sid, /insider, /privacy-policy, /terms, /disclaimer, /accessibility, 404

---

## Typography

| Font | CSS Class | Role |
|---|---|---|
| Satoshi | `.font-sans` | Headlines, H1 to H3, logo wordmark |
| Inter | `.font-body` | Body copy, long-form, UI elements |
| Space Grotesk | `.font-mono` | Tech labels, tags, uppercase badges |
| Playfair Display | `.font-drama` | Single accent word per section (italic, max 2 words) |

---

## Color Palette (Blue-Gray Theme)

| Name | Hex / Value | Tailwind |
|---|---|---|
| Background | `#F8FAFC` (slate-50) | `background` |
| Surface | `#FFFFFF` (white cards) | `surface` |
| Surface Alt | `#F1F5F9` (slate-100) | `surfaceAlt` |
| Text | `#0F172A` (slate-900) | `text` |
| Text Muted | `#64748B` (slate-500) | `textMuted` |
| Text Light | `#94A3B8` (slate-400) | `textLight` |
| Accent | `#0070F3` (brand blue) | `accent` |
| Electric Cyan | `#00C2FF` | `cyan` |
| Soft Coral | `#FF6B6B` | `coral` (errors only) |
| Blue Wash | `rgba(0,112,243,0.05)` | `accent-light` |
| Blue Border | `rgba(0,112,243,0.08)` | `accent-border` |
| Blue Border Strong | `rgba(0,112,243,0.15)` | `accent-border-strong` |

**Backward-compat aliases:** `dark` (#0F172A), `primary` (#FFFFFF), `sand` (#F8FAFC) still work.

**Section alternation pattern:** surface (white) -> accent-light (blue wash) -> surfaceAlt (slate-100)

---

## Animation Rules

- GSAP 3 + ScrollTrigger for all scroll-based animations
- No Framer Motion (one animation library only)
- `once: true` on entrance animations (don't re-trigger)
- Max 2 to 3 "strategic scroll moments" that genuinely surprise. Everything else stays clean.
- Canvas particles: `requestAnimationFrame`, 60fps, max 200 particles, pause when tab not visible

---

## Performance Budget

| Metric | Target | Current |
|---|---|---|
| LCP | < 2.5s | TBD (needs Lighthouse) |
| TBT | < 200ms | TBD |
| CLS | < 0.1 | TBD |
| JS Bundle | < 250KB gzipped | 186KB gzipped |
| Canvas | 60fps | TBD |

**Note:** One chunk at 585KB pre-gzip triggers Vite warning. Needs code-splitting (GSAP, Sanity client).

---

## Brand Reference

All brand docs in `/brand/`:
- `brain.md` - Quick-reference brand context
- `brandIdentityGuide.md` - Core identity, mission, voice
- `rslaHomePageCopy.md` - Homepage section copy
- `rslaPagesCopy.md` - All other page copy
- `rslaUiUxPlaybook.md` - UI/UX specs, animations, performance budget
- `rslaWebsiteStrategy.md` - Website architecture and strategy

---

## Commands

```bash
npm install                    # Install dependencies
npm run dev                    # Start dev server (Vite)
npm run build                  # Production build
npx sanity schema deploy       # Deploy schemas to Sanity cloud
```

---

## Session Log

### 2026-02-24: Pages, SEO, Mobile Nav, Copy
- Added 3 new pages: /booking-confirmed, /rahul (digital business card), /insider (newsletter signup)
- Built Seo.jsx component, added per-page SEO to all 16 pages matching existing rsla.io metadata
- Built mobile hamburger menu with full-screen overlay and auto-close
- Replaced founder section placeholder with profile photo (/images/rahul.png)
- Styled About page quote with drama font and inline opening quote mark
- Refined all 3 service card copy (voice DNA aligned)
- Redesigned dashboard visual (donut chart, pipeline bar, colored stats)
- Made terminal animation loop continuously with realistic bot conversation
- Removed Siddharth author from Sanity, reassigned 3 posts to Rahul
- Updated .vcf with real vCard data
- Committed, pushed, auto-deploying to Vercel
- Created TODO.md with remaining tasks and wishlist

### 2026-02-25: UI Component Implementation (Phase 7)
- Initialized shadcn CLI (components.json, tsconfig.json with @ alias)
- Updated Tailwind to blue-gray theme palette (slate-50 bg, slate-900 text, blue-tinted borders)
- Installed 6 Magic UI components: InteractiveHoverButton, MagicCard, TextAnimate, Marquee, NumberTicker, ShineBorder
- motion library pulled in as dep (used by MagicCard, TextAnimate, NumberTicker), split into separate chunk (93KB/31KB gzipped)
- Converted 5 21st.dev components from Framer Motion/Next.js to GSAP/React Router:
  - AuroraBackground (CSS aurora, replaces CanvasParticles)
  - NavbarV2 (GSAP lamp indicator, desktop top + mobile bottom pill)
  - CtaWithGlow (radial gradient glow, GSAP scroll entrance)
  - Testimonials (plain HTML lifted cards, GSAP stagger)
  - FooterV2 (light theme, Kit newsletter, plain HTML)
- Built 7 new homepage sections: HeroV2, ServicesV2, StatsSection, Testimonials, BlogPreview, CtaWithGlow, MarqueeV2
- Swapped NavbarV2 and FooterV2 into App.jsx (site-wide)
- Removed from homepage: ProblemSection, HowItWorks, FounderSection, ProofSection (still available on their dedicated pages)
- Build passes, bundle size: 326KB/108KB gzipped main chunk
- UI_COMPONENTS.md updated as component decision tracker
- Reference source code at ~/lalia/4-Resources/uiComponents/

### 2026-02-25: Homepage Polish & Fixes
- FooterV2 switched to dark (#0A0A0A) — white/opacity text, bigger logo (h-20), email in brand column
- InteractiveHoverButton: blue-filled (bg-accent text-white), white dot expand on hover
- ServicesV2: replaced ShineBorder with card-beam CSS (rotating conic-gradient, 1px border via padding approach)
- Testimonials: restored masonry grid (1 featured 2x2 + 4 regular = 5 cards, fills 8-cell grid)
- CTA section: FlickeringGrid (Magic UI) background on dark #0A0A0A, InteractiveHoverButton CTA, removed `group` class that was triggering button hover on section enter
- Marquee: added missing `marquee` + `marquee-vertical` keyframes to tailwind.config.js (was not animating)
- ShineBorder: added `shine` keyframe to tailwind.config.js (was in @theme inline block, Tailwind v4 syntax ignored by v3.4)
- Footer: removed Start Here from nav, updated newsletter subheading, moved email from bottom bar to brand column
- Installed FlickeringGrid via `npx shadcn@latest add` from Magic UI
- Visual QA pass: all homepage sections verified via Puppeteer screenshots
- Installed puppeteer-core in /tmp for screenshot workflow

### 2026-02-25: Light Theme Propagation, Cookie Consent, SEO Hardening
- Converted all pages to semantic color tokens (surface, surfaceAlt, text, textMuted, textLight, accent-border)
- Converted Blog.jsx, BlogInner.jsx, Work.jsx, WorkInner.jsx, PortableTextRenderer.jsx, HowItWorks.jsx
- Built CookieConsent.jsx: desktop inline pill bar + mobile stacked card, gates GTM loading
  - GTM removed from index.html, loads dynamically only on "Accept All"
  - localStorage persistence, 1.5s delay before showing, smooth exit animation
- NavbarV2 logo fade: fades out on scroll (opacity-0, pointer-events-none) since logo sits outside pill nav
- Legal pages: Privacy, Terms redesigned; Accessibility, Disclaimer added (done in separate Claude instance)
- /sid digital business card page created (chromeless)
- SEO hardening:
  - Generated favicon.ico (32x32), apple-touch-icon.png (180x180), icon-192.png, icon-512.png from logomark.svg
  - Added JSON-LD structured data to 6 indexed pages (About, Services, HowItWorks, StartHere, Work, Blog)
  - Added noIndex to NotFound.jsx
- Fixed Dependabot alerts: basic-ftp 5.1.0→5.2.0 (critical), rollup 4.58.0→4.59.0 (high)
- Deleted 4 dead files from old website: Hero.jsx, MarqueeStrip.jsx, ProblemSection.jsx, vite.svg
- 4 commits pushed to main

---

## Last Updated

2026-02-25
