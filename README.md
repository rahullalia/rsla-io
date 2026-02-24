# RSL/A Website (rsla.io)

The new rsla.io website. AI-first brand positioning, custom Canvas 2D hero, GSAP scroll animations, Sanity CMS for blogs and case studies.

## Tech Stack

- **Framework:** React 19 + Vite (SPA)
- **Styling:** Tailwind CSS v3.4
- **Animation:** GSAP 3 + ScrollTrigger
- **CMS:** Sanity (Project: `yz25oyux`, Dataset: `production`)
- **Rich Text:** @portabletext/react
- **Icons:** Lucide React

## Sanity Schemas

| Schema | Status | Notes |
|---|---|---|
| `blogPost` | Legacy | Original blog schema from the original codebase |
| `blogPostV2` | New | Full Portable Text blocks, pull quote, reading time, social image |
| `caseStudy` | Legacy | Original case study schema from the original codebase |
| `caseStudyV2` | New | Featured image, before/after, AI-first categories, full blocks |
| `author` | Active | Shared by both blog versions |
| `category` | Active | Shared by both blog versions |

## Brand Reference

All brand docs live in `/brand/`:
- `brain.md` - Quick-reference brand context
- `brandIdentityGuide.md` - Core identity, mission, voice
- `rslaHomePageCopy.md` - Homepage copywriting
- `rslaPagesCopy.md` - All other page copy
- `rslaUiUxPlaybook.md` - UI/UX specs, animations, performance budget
- `rslaWebsiteStrategy.md` - Website architecture and strategy

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server
npx sanity schema deploy  # Deploy schemas to Sanity cloud
```
