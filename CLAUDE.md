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
    Navbar.jsx         # (deprecated) Desktop nav + mobile hamburger menu
    Footer.jsx         # (deprecated) Dark theme footer
    FounderSection.jsx # Profile photo + bio
    AuroraBackground.jsx # CSS aurora hero background (adapted from Aceternity)
    HeroV2.jsx         # Aurora + TextAnimate + InteractiveHoverButton hero
    ServicesV2.jsx     # Magic Card grid (3 service cards)
    StatsSection.jsx   # Number Ticker count-up stats
    Testimonials.jsx   # Masonry grid testimonial cards (GSAP stagger)
    BlogPreview.jsx    # Latest 3 Sanity posts
    CtaWithGlow.jsx    # Bottom glow CTA section
    MarqueeV2.jsx      # Magic UI Marquee service labels
    ServicesCards.jsx   # (deprecated) 3 stacking cards with animated visuals
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
    Insider.jsx        # /insider (noindex)
    Privacy.jsx        # /privacy-policy (noindex)
    Terms.jsx          # /terms (noindex)
    NotFound.jsx       # 404 catch-all
  sanity/
    schemas/           # Sanity schema definitions
    lib/               # Sanity client, image helper, GROQ queries
brand/                 # Brand reference docs
public/
  images/rahul.png     # Profile photo
  rahul.vcf            # vCard for /rahul page
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
| /insider | Insider | No | Full |
| /privacy-policy | Privacy | No | Full |
| /terms | Terms | No | Full |

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
- Props: `title`, `description`, `canonical`, `noIndex`
- Updates: description, og:title, og:description, og:url, twitter:title, twitter:description, canonical link, robots
- Default fallback tags in `index.html` for crawlers that don't execute JS
- BlogInner/WorkInner pull dynamic SEO from Sanity content
- OG image referenced as `/og-image.png` (needs to be created)

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

---

## Last Updated

2026-02-25
