# BRAIN.md — rslaWebsite

Reference material for the RSL/A website. Rules and behavior live in CLAUDE.md.

## Positioning

"I show founders how to put AI to work, then I build it for them."

**Status:** Live at rsla.io. All TODO items complete (P0 through P4). Only careers page remains (when ready).

## Key Files

```
src/
  components/
    Seo.jsx               # Per-page SEO (title, description, OG, Twitter, canonical, robots)
    NavbarV2.jsx           # Tubelight navbar (desktop top pill + mobile bottom pill, GSAP lamp)
    FooterV2.jsx           # Light theme 5-col footer with Kit newsletter + Solutions column
    CookieConsent.jsx      # GDPR cookie banner (gates GTM loading)
    blog/PortableTextRenderer.jsx  # Sanity rich text renderer
  pages/
    Home.jsx               # / (13 lazy-loaded sections, 3 Suspense groups)
    BlogInner.jsx          # /blog/:slug (editorial layout, sticky ToC, share bar)
    WorkInner.jsx          # /work/:slug
    IndustryPage.jsx       # /ai-for/:slug (Hormozi-inspired pSEO template)
api/
  llm/[slug].mjs           # Vercel serverless: returns markdown for any blog/case study
scripts/
  prerender.mjs            # Build-time HTML injection for AI tool visibility
  generateSitemap.mjs      # Build-time sitemap generator
  generateRssFeed.mjs      # Build-time RSS feed generator
  generateLlmsTxt.mjs      # Build-time llms.txt generator (AI search index)
  pingIndexNow.mjs         # Build-time IndexNow ping (Bing, Yandex, Naver, Seznam)
content/
  posts/                   # Blog post markdown source files
  blogImages/              # Featured + inline images per post slug
  scripts/
    blogImages/            # Per-post image generation scripts
    caseStudies/           # Case study creation scripts
    sanityPatches/         # Sanity body patch scripts
    utils/                 # Shared utilities
    fixes/                 # One-off content fixers
docs/
  seo/                     # Keyword research, content plan, triage data
  conversionResearch/      # Completed brand positioning + homepage wireframe research
.claude/
  agents/                  # Blog agents (researcher, writer, reviewer, seo)
```

## Route Architecture

| Route | Page | Indexed | Chrome |
|---|---|---|---|
| / | Home | Yes | Full |
| /about | About | Yes | Full |
| /services | Services | Yes | Full |
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

## Sanity CMS

- **Project ID:** `yz25oyux`, **Dataset:** `production`, **API Version:** `2025-03-01`
- **Active schemas:** blogPostV2, caseStudyV2, industryPage, author, category, blogGenerationJob
- **Legacy schemas:** blogPost, caseStudy (V1, not queried by website)
- **Content:** 60+ blog posts, 11 case studies, 12 industry pages, 19 categories, 1 author

## SEO

- `Seo.jsx` uses `useEffect` to set `document.title` and create/update meta tags
- JSON-LD on all indexed pages (Organization, Person, ProfessionalService, HowTo, BlogPosting, etc.)
- SoftwareApplication schema on GHL pricing page
- Pre-rendered nav on all pages for internal link discovery
- Related posts fallback: category-matched posts when `relatedPosts` is empty
- IndexNow key: `42f4e2d222a8441d91b82a1d06d0db72`
- 73 total pre-rendered pages: 15 static, 2 listings, 33 blog, 11 case studies, 12 industry

## Typography

| Font | CSS Class | Role |
|---|---|---|
| Satoshi | `.font-sans` | Headlines, H1 to H3, logo wordmark |
| Inter | `.font-body` | Body copy, long-form, UI elements |
| Space Grotesk | `.font-mono` | Tech labels, tags, uppercase badges |
| Playfair Display | `.font-drama` | Single accent word per section (italic, max 2 words) |
| Caveat | `.font-quote` | Blockquotes and pull quotes |

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
| Blue Wash | `rgba(0,112,243,0.05)` | `accent-light` |

**Section alternation pattern:** surface (white) -> accent-light (blue wash) -> surfaceAlt (slate-100)

## Error Handling

- `lazyRetry()` wraps all lazy imports (3 retries, 1.5s backoff, then page reload)
- `ResilientErrorBoundary`: frequency-based crash detection (3+ errors in 3s = genuine crash). Silent auto-recovery for transient errors, no `window.location.reload()`

## Industry Pages (pSEO)

12 pages live (8 industry + 4 tool pages). Paused to wait for Google indexation data.

Adding a new page requires no code changes:
1. Create in studio.rsla.io -> Industry Pages
2. Fill all fields (Hero, Pain & Stats, Before/After, FAQ required; Proof optional)
3. Publish the Sanity document
4. Next Vercel build auto-pre-renders it and adds it to the Services page grid
