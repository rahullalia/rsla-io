# RSL/A (rsla.io) UI/UX & Animation Playbook

## The Core Philosophy: "Controlled Chaos"

The background and layout structure feels rigid, architectural, and secure (The Black Box). The interactions and scroll events feel fluid, unexpected, and custom (The Mentor).

**The rule:** If everything moves, nothing is important. Pick 2 to 3 strategic scroll moments that genuinely surprise. Everything else stays clean, fast, and confident.

---

## Tech Stack (Confirmed)

Proven and shipping:

| Layer | Tool | Why |
| :--- | :--- | :--- |
| Framework | React 19 + Vite | Fast builds, SPA, no SSR overhead needed for a brochure site |
| Styling | Tailwind CSS v3.4+ | Utility-first, already configured with the brand palette |
| Animation Engine | GSAP 3 + ScrollTrigger | Industry standard for scroll-pinning, scrub, and timeline animations |
| Hero Background | Canvas 2D (custom) | Lightweight interactive particles. No Three.js (overkill). No Magic UI particles (not customizable enough). |
| CMS | Sanity (Project: `yz25oyux`) | Integrated for blogs and case studies |
| Icons | Lucide React | Minimal, clean, already in the codebase |
| Rich Text | @portabletext/react | Rendering Sanity blog/case study content |

### Not Using (and why)

- **Three.js**: Too heavy (~150KB gzipped) for what's essentially a 2D particle effect.
- **Framer Motion**: GSAP handles everything we need. Adding a second animation library creates competing paradigms.
- **Next.js**: No SEO-critical server rendering needed right now. Vite is faster to develop with. Can migrate later if SEO demands it.

---

## MCP Component Libraries (Available for Use)

Three MCP integrations provide drop-in UI components. Use these to accelerate development without reinventing standard patterns.

### Magic UI (`mcp__magic-ui__*`)

Pre-built animated React components. Use for visual effects and special interactions.

**High-value components for rsla.io:**

| Component | Use Case on rsla.io |
| :--- | :--- |
| **Animated Beam** | Connecting visual elements (e.g., showing data flow between AI system components) |
| **Border Beam** | Glowing animated border on primary CTA buttons and hero cards |
| **Shine Border** | Sheen effect on service cards on hover |
| **Marquee** | Edge-to-edge scrolling text or client logo strip |
| **Neon Gradient Card** | Case study cards or proof point highlights |
| **Particles** | Fallback option if custom Canvas 2D hero proves too complex |
| **Blur Fade** | Entrance animations for sections as they scroll into view |
| **Text Animations** | Word-by-word headline reveals, shimmer effects on accent text |
| **Device Mocks** | Safari/iPhone frames for showing dashboard screenshots or AI bot demos |
| **Meteors** | Subtle background effect for the booking section |

**Access via:** `mcp__magic-ui__getComponents`, `mcp__magic-ui__getSpecialEffects`, `mcp__magic-ui__getAnimations`, `mcp__magic-ui__getTextAnimations`, `mcp__magic-ui__getDeviceMocks`

### shadcn/ui (`mcp__shadcn-ui__*`)

Standard UI components (buttons, forms, dialogs, inputs, etc.). Use for all functional UI elements.

**Access via:** `mcp__shadcn-ui__search_items_in_registries`, `mcp__shadcn-ui__view_items_in_registries`

### 21st.dev Magic (`mcp__magic__*`)

AI-generated custom components. Use when you need something specific that neither Magic UI nor shadcn provides.

- `21st_magic_component_builder`: Describe what you want, get a production-ready component
- `21st_magic_component_inspiration`: Browse existing components for ideas
- `21st_magic_component_refiner`: Improve an existing component's design
- `logo_search`: Get brand logos as React components (for social proof sections)

---

## Design System

### Typography (3 distinct roles)

| Font | Weight | Role | Example |
| :--- | :--- | :--- | :--- |
| **Satoshi** | Bold / Black | Headlines, H1 to H3, prominent copy, logo wordmark | "Your business is doing manually what AI could do in seconds." |
| **Inter** | Regular | Body copy, long-form content, UI elements | Paragraph text, form labels, descriptions |
| **Space Grotesk** | Medium / Bold | Tech labels, tags, uppercase badges, data readouts | `[ AI AUTOMATIONS ]`, `[ ZERO MANUAL WORK ]` |
| **Playfair Display** | Italic | Single accent word per section (max 1 to 2 words). The human signature. | "...in *seconds.*", "...while you *sleep.*" |

**Rules:**
- Satoshi headings: letter-spacing slightly tight (-1% to -2%)
- Inter body: line-height 1.5 to 1.6
- Space Grotesk: uppercase only, used exclusively for small labels
- Playfair: never more than 2 words per section, always italic

### Color Palette

| Name | Hex | Usage |
| :--- | :--- | :--- |
| **Deep Slate** | `#111827` | Primary text, dark backgrounds, dark mode base |
| **Pure White** | `#FFFFFF` | Light backgrounds, primary text on dark |
| **Warm Sand** | `#F9FAFB` | Secondary backgrounds, subtle section dividers |
| **Anchor Blue** | `#0070F3` | Primary CTAs, logo mark, key brand highlights |
| **Electric Cyan** | `#00C2FF` | Gradients (with Anchor Blue), hover states, AI/tech emphasis |
| **Soft Coral** | `#FF6B6B` | Errors and warnings only |

### Global Texture

**Film grain overlay:** SVG `feTurbulence` fractalNoise filter, fixed position, `z-index: 9999`, `opacity: 0.03 to 0.05`. Gives the entire site a subtle analog texture without image assets.

---

## Homepage Sections (in order)

### 1. Hero: "The Live System"

**Goal:** Stop the scroll. Prove technical depth immediately.

**Background:** Canvas 2D interactive particle field on Deep Slate.
- Faint geometric nodes / dots drifting slowly across the dark background
- Mouse interaction: nodes within 150px of the cursor magnetically connect with thin lines, creating a constellation effect
- Particles respond to cursor velocity (move faster when the cursor moves fast)
- Subtle parallax depth: two layers of particles at different speeds
- Performance budget: 60fps, no more than 200 particles

**Headline animation:**
- Satoshi text fades up word-by-word using GSAP stagger (`duration: 1.2, stagger: 0.08, ease: 'power3.out'`)
- 500ms delay, then the Playfair accent word "writes" itself via SVG line-drawing animation
- Followed by a subtle Electric Cyan glow pulse on the accent word

**CTA animation:**
- Primary button: Border Beam effect (Magic UI) with a slow cyan-to-blue gradient rotation
- Hover: white overlay sweeps up from bottom (translate-y-full reveal)

**Layout:**
```
[ Full viewport, 100dvh ]

  [ AI AUTOMATIONS ]  [ AI LEAD GEN ]  [ AI OPERATIONS ]    <- Space Grotesk tags

  Your business is doing manually
  what AI could do in seconds.                               <- Satoshi + Playfair

  I show founders how to put AI to work,                     <- Inter subheadline
  then I build it for them.

  [ Build My AI System ]  [ See What We Have Built ]         <- CTAs
```

### 2. Problem & Solution: "The Bottleneck"

**Goal:** Agitate the pain, then present AI as the obvious answer.

**Animation:** Simple GSAP ScrollTrigger. Text fades up as section enters viewport. No pinning, no complexity. Let the copy do the work.

**Layout:** Full-width, dark background. Max-width text column centered. Clean, editorial. The content carries this section, not the effects.

### 3. Services: Stacking Cards (Strategic Scroll Moment #1)

**Goal:** Reveal the three AI services in a spatial, memorable way.

**Concept:** Three full-height cards, each pinned via GSAP ScrollTrigger. As the next card scrolls up from below, the current card compresses (`scale: 0.9, opacity: 0.5, filter: blur(20px)`) with scrub tied to scroll position.

**Each card contains:**
- Space Grotesk tag label
- Satoshi headline with Playfair accent word
- Inter body copy (2 to 3 sentences)
- A unique animated visual element:
  - **Card 1 (AI Lead Gen):** Animated beam (Magic UI) showing data flowing from ad platforms into a pipeline
  - **Card 2 (AI Automations):** Typewriter terminal readout showing an AI bot conversation happening in real time
  - **Card 3 (AI Operations):** Dashboard mockup in a Safari device frame (Magic UI) with live-updating metrics

**Card styling:** `rounded-[3rem]`, Neon Gradient Card effect (Magic UI) with accent blue glow. Dark backgrounds with glassmorphic overlay.

### 4. How It Works: Process Steps

**Goal:** Reduce friction. Show the journey is simple.

**Animation:** Clean GSAP stagger reveals. Each step fades in sequentially as user scrolls. No pinning.

**Layout:** Three steps, numbered, with Space Grotesk tags for the time/call labels. Simple and clean. Trust the content.

### 5. Founder Section: "The Mentor"

**Goal:** Human connection. The face behind the AI systems.

**Animation:** Photo transitions from grayscale to color on scroll (`duration-700`). Text fades up alongside.

**Layout:** Split layout. Image left (or sticky), text right. Playfair signature at the bottom. Blog CTA.

### 6. Case Studies: "The Proof" (Strategic Scroll Moment #2)

**Goal:** Undeniable evidence. These numbers should hit hard.

**Concept: X-Ray Hover.** Case studies are displayed as massive, minimalist text rows. On hover, a custom cursor appears as a circular "magnifying glass" (200px radius). Inside the cursor, a preview video of the actual AI system or dashboard loops silently, replacing the dark background only within the cursor's radius.

**Fallback (if X-Ray proves too complex):** GSAP stagger reveal layout. Large accent-colored metric numbers (`font-drama italic text-6xl`), tight description, border glow on hover.

**Layout:**
```
[ Dark full-width section ]

  The Proof                                                  <- H2 + Playfair

  01. Local Service Co.       $600 -> $36,000 in 45 days
  02. Consulting Firm         13,000 contacts, 42 appointments
  03. E-Commerce Brand        80% reduction in manual CS hours

  See all 14 case studies ->
```

### 7. Marquee: Social Proof Strip

**Goal:** Movement and credibility between static sections.

**Component:** Magic UI Marquee. Edge-to-edge, auto-scrolling. Contains Space Grotesk text labels or client logos.

**Content options:**
- Tool/platform logos: GoHighLevel, Meta, Google, Vercel, Claude (use `mcp__magic__logo_search`)
- Text labels: `[ AI AUTOMATIONS ]  [ LEAD GENERATION ]  [ CRM INFRASTRUCTURE ]  [ AI OPERATIONS ]`

**Scroll interaction:** Marquee speed increases subtly when user scrolls past it. Not the full velocity distortion from the old playbook (too gimmicky), just a 1.5x speed bump.

### 8. Booking Section: "Let's Talk"

**Goal:** Convert. No friction.

**Background:** Dark card with `rounded-[3rem]`. Two radial gradient blur blobs (accent blue + Electric Cyan) that pulse subtly on hover.

**Optional:** Magic UI Meteors as a subtle background effect behind the booking form.

**Form styling:** Terminal cursor `_` on input fields (blinking `animate-pulse`). Space Grotesk labels. Embedded GoHighLevel calendar widget.

---

## Navbar

Already perfect for the brand.

- Fixed, floating pill shape (`rounded-[2rem]`), centered
- **On dark hero:** Fully transparent, white text, white logo
- **After 50px scroll:** Transitions to glassmorphic `bg-background/90 backdrop-blur-2xl border border-dark/10 shadow-md`
- Logo shrinks from `h-6` to `h-5` on scroll
- CTA button color adapts: white on dark hero, `bg-accent` when scrolled
- Always-visible "Let's Talk" CTA in the nav

---

## Micro-Interactions (The Premium Feel)

These are the "leather stitching" details that make the site feel expensive.

| Interaction | Where | How |
| :--- | :--- | :--- |
| **Magnetic buttons** | Primary CTAs | Button pulls toward cursor within 50px radius. CSS transform + JS `mousemove` listener. |
| **Border beam** | Hero CTA, booking button | Magic UI Border Beam. Slow gradient rotation (cyan to blue). |
| **Shine border** | Service cards on hover | Magic UI Shine Border. Brief sheen sweep on mouseenter. |
| **Grayscale lift** | Photos, case study images | `grayscale` to `grayscale-0` + `scale-105` on hover, `duration-700`. |
| **Terminal cursor** | Form inputs | Blinking `_` cursor (`animate-pulse`) on focus. Space Grotesk styling. |
| **Button sweep** | All buttons | White `translate-y-full` overlay slides up on hover. |
| **Link underline** | Text links | Animated underline that draws from left to right on hover. CSS `transform: scaleX()`. |

---

## Inner Pages (Blog & Case Studies)

Rahul has confirmed he likes these. Minimal changes needed.

### Blog Index (`/blog`)
- Paginated grid (9 posts per page)
- Cards: `rounded-[2rem]`, grayscale-to-color hover on featured images
- Dates in mono format (`02.21.26`)
- Pagination: `PG 1 / 4` in monospace

### Blog Inner (`/blog/:slug`)
- Max-width article layout (`max-w-4xl mx-auto`)
- Hero image: `aspect-video rounded-[2rem]`
- PortableText renderer with custom blocks: code terminals, video embeds, callout boxes, stats cards, tech stack panels
- Byline with grayscale author avatar

### Case Study Index (`/work`)
- Filterable by category, sortable by Priority or ROI
- Featured vs non-featured separation
- Monospace result count: `[N] result(s)`

### Case Study Inner (`/work/:slug`)
- Metrics grid: `grid grid-cols-2 md:grid-cols-4` with large accent numbers
- Meta badges in monospace pills: `IND: Salon/Spa`, `DUR: 30 Days`
- TL;DR box with radial gradient glow
- Key takeaways: numbered `01.`, `02.` in accent mono
- Related case studies grid at bottom

---

## Performance Budget

Non-negotiable constraints:

| Metric | Target |
| :--- | :--- |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Total Blocking Time | < 200ms |
| Cumulative Layout Shift | < 0.1 |
| Hero canvas | 60fps, max 200 particles |
| Total JS bundle | < 250KB gzipped (excluding Sanity content) |
| GSAP + ScrollTrigger | ~45KB gzipped (acceptable) |

**Rules:**
- Lazy load all images below the fold
- GSAP ScrollTrigger: use `once: true` for entrance animations (don't re-trigger)
- Canvas particle system: `requestAnimationFrame` loop, throttle to 60fps, pause when tab is not visible
- Font loading: `font-display: swap` for all custom fonts. Preload Satoshi Bold (hero headline).

---

## Build Order

When it is time to implement, build in this order:

1. **Navbar + global layout**
2. **Hero section** (Canvas particles + headline animation)
3. **Blog & Case Study pages** (connect to Sanity)
4. **Services stacking cards** (GSAP ScrollTrigger pin + scrub)
5. **Case studies section** (X-Ray hover or fallback layout)
6. **Remaining homepage sections** (problem, founder, how it works, booking)
7. **Marquee + micro-interactions** (polish pass)
8. **About page + Start Here page** (content pages, minimal animation)
9. **Performance audit** (Lighthouse, bundle analysis, canvas optimization)
