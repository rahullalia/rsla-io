# CLAUDE.md - RSL/A Website (rsla.io)

## Project Overview

New rsla.io website. React 19 + Vite SPA with GSAP animations, Canvas 2D hero, Sanity CMS for blogs and case studies.

**Positioning:** "I show founders how to put AI to work, then I build it for them."

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | React 19 + Vite |
| Styling | Tailwind CSS v3.4 |
| Animation | GSAP 3 + ScrollTrigger |
| Hero Background | Canvas 2D (custom, no Three.js) |
| CMS | Sanity (Project: `yz25oyux`, Dataset: `production`) |
| Icons | Lucide React |
| Rich Text | @portabletext/react |

---

## Key Files and Folders

```
src/
  components/     # Reusable UI components (Navbar, Footer, sections)
  pages/          # Route-level page components
  sanity/
    schemas/      # Sanity schema definitions (blogPost, caseStudy, V1 + V2)
    lib/          # Sanity client, image helper, GROQ queries
brand/            # All brand reference docs (copy, UI/UX playbook, strategy)
PLAN.md           # Build plan with phases and checklists
```

---

## Sanity CMS

- **Project ID:** `yz25oyux`
- **Dataset:** `production`
- **API Version:** `2025-03-01`
- **Schemas deployed:** blogPost, blogPostV2, caseStudy, caseStudyV2, author, category, blogGenerationJob
- **Legacy project:** `36wenybq` (has existing content, 12 case studies, blog posts)
- Content migration from legacy to new project is a future phase (see PLAN.md Phase 5)

---

## Typography

| Font | CSS Class | Role |
|---|---|---|
| Satoshi | `.font-sans` | Headlines, H1 to H3, logo wordmark |
| Inter | `.font-body` | Body copy, long-form, UI elements |
| Space Grotesk | `.font-mono` | Tech labels, tags, uppercase badges |
| Playfair Display | `.font-drama` | Single accent word per section (italic, max 2 words) |

**Current state:** Fonts not yet swapped. Still using Space Grotesk as primary and DM Serif Display as drama font. Phase 1 task.

---

## Color Palette

| Name | Hex | Tailwind |
|---|---|---|
| Deep Slate | `#111827` | `dark` |
| Pure White | `#FFFFFF` | `white` |
| Warm Sand | `#F9FAFB` | `sand` |
| Anchor Blue | `#0070F3` | `accent` |
| Electric Cyan | `#00C2FF` | `cyan` |
| Soft Coral | `#FF6B6B` | `coral` (errors only) |

---

## Animation Rules

- GSAP 3 + ScrollTrigger for all scroll-based animations
- No Framer Motion (one animation library only)
- `once: true` on entrance animations (don't re-trigger)
- Max 2 to 3 "strategic scroll moments" that genuinely surprise. Everything else stays clean.
- Canvas particles: `requestAnimationFrame`, 60fps, max 200 particles, pause when tab not visible

---

## Performance Budget

| Metric | Target |
|---|---|
| LCP | < 2.5s |
| TBT | < 200ms |
| CLS | < 0.1 |
| JS Bundle | < 250KB gzipped |
| Canvas | 60fps |

---

## MCP Components Available

- **Magic UI:** Border Beam, Shine Border, Marquee, Animated Beam, Neon Gradient Card, Blur Fade, Text Animations, Device Mocks
- **shadcn/ui:** Standard UI components (buttons, forms, dialogs)
- **21st.dev Magic:** AI-generated custom components, logo search

---

## Build Order

Follow PLAN.md. Summary:
1. Phase 1: Foundation (fonts, colors, navbar, footer, cleanup)
2. Phase 2: Homepage (hero, problem, services cards, how it works, founder, case studies, marquee, booking, micro-interactions)
3. Phase 3: Content pages (about, how it works, service pages, start here)
4. Phase 4: Inner pages (Sanity client, blog V2, case study V2)
5. Phase 5: Content migration (legacy Sanity to new)
6. Phase 6: Performance and launch

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
npx sanity schema deploy       # Deploy schemas to Sanity cloud
```
