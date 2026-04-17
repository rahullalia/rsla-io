# UI Component Decisions — RSLA Website

Tracking selected components for implementation. Research done 2026-02-25.

---

## Selected Components

### Hero Background
- **Pick:** Aurora Background (Aceternity via 21st.dev)
- **Source:** https://21st.dev/community/components/aceternity/aurora-background/default
- **Adaptation:** White background variant (not dark). Convert Framer Motion `backgroundPosition` animation to GSAP tween. Remap aurora colors to brand palette (Anchor Blue #0070F3, Electric Cyan #00C2FF).
- **Replaces:** Current CanvasParticles.jsx
- **Status:** Installed / Converted

### Primary CTA Button
- **Pick:** Interactive Hover Button (Magic UI)
- **Source:** https://magicui.design/docs/components/interactive-hover-button
- **Notes:** Fill-on-hover with text color invert. Use for main CTAs (Book a Call, Start Here, etc).
- **Status:** Installed / Converted

### Secondary Button
- **Pick:** Ripple Button (Magic UI)
- **Source:** https://magicui.design/docs/components/ripple-button
- **Notes:** Click ripple effect. Use for secondary actions (Learn More, Read More, etc).
- **Status:** Installed / Converted

### Cards
- **Pick:** Magic Card (Magic UI)
- **Source:** https://magicui.design/docs/components/magic-card
- **Notes:** Mouse-follow gradient spotlight for service cards.
- **Status:** Installed / Converted

### Text Animation
- **Pick:** TextAnimate (Magic UI)
- **Source:** https://magicui.design/docs/components/text-animate
- **Notes:** CSS-based blur/fade/slide presets for headline entrances.
- **Status:** Installed / Converted

### Marquee
- **Pick:** Marquee (Magic UI)
- **Source:** https://magicui.design/docs/components/marquee
- **Notes:** Client/tech logo strip.
- **Status:** Installed / Converted

### Booking Confetti
- **Pick:** Confetti (Magic UI)
- **Source:** https://magicui.design/docs/components/confetti
- **Notes:** Celebration burst on /booking-confirmed page.
- **Status:** Installed / Converted

---

### Number Counter
- **Pick:** Number Ticker (Magic UI)
- **Source:** https://magicui.design/docs/components/number-ticker
- **Notes:** Scroll-triggered count-up for stats sections.
- **Status:** Installed / Converted

### Featured Borders
- **Pick:** Shine Border (Magic UI)
- **Source:** https://magicui.design/docs/components/shine-border
- **Notes:** Rotating shine for featured/highlighted cards.
- **Status:** Installed / Converted

### Navbar
- **Pick:** Tubelight Navbar (ayushmxxn via 21st.dev)
- **Source:** https://21st.dev/ayushmxxn/tubelight-navbar/default
- **Notes:** Floating pill with lamp glow on active tab. Icons on mobile, text on desktop. Needs Framer Motion layoutId to GSAP conversion.
- **Replaces:** Current Navbar.jsx
- **Status:** Installed / Converted

### CTA Section
- **Pick:** CTA with Glow (Launch UI via 21st.dev)
- **Source:** https://21st.dev/s/call-to-action
- **Notes:** Headline + button with bottom glow radial gradient that lifts on hover. Use for "Book a Call" CTA at page bottoms.
- **Status:** Installed / Converted

### Testimonials
- **Pick:** Testimonials One (Tailus via 21st.dev)
- **Source:** https://21st.dev/s/testimonials
- **Notes:** Masonry grid with lifted white cards. Featured card spans 2 cols/rows. Light theme, avatar + name + role.
- **Status:** Installed / Converted

### Footer
- **Pick:** Footer (clean, 4-column with newsletter)
- **Source:** https://21st.dev/nevsky118/footer/default
- **Notes:** Logo, links, social icons, newsletter subscribe form with success/error states. Wire to Kit API.
- **Replaces:** Current Footer.jsx
- **Status:** Installed / Converted

---

### Progressive Blur
- **Pick:** Progressive Blur (reuno-ui via 21st.dev)
- **Source:** https://21st.dev/reuno-ui/progressive-blur/default
- **Notes:** Fade-blur effect for blog inner page hero images. CSS-only version preferred (no animation deps).
- **Status:** Installed / Converted

### FAQ Section
- **Pick:** FAQ Section (split layout, 21st.dev)
- **Source:** https://21st.dev/vaib215/faq-tabs/default
- **Notes:** Two-column layout: headline left, accordion right. Uses Radix accordion (keep this dep). Two layout variants saved.
- **Status:** Installed / Converted

---

## Saved for Reference (no assigned use yet)

| Component | Source | Notes |
|---|---|---|
| Typewriter (danielpetho) | https://21st.dev/danielpetho/typewriter/default | Type/delete loop with cursor. Could use for hero tagline or terminal effect. |

---

### Flickering Grid
- **Pick:** Flickering Grid (Magic UI)
- **Source:** https://magicui.design/docs/components/flickering-grid
- **Notes:** Subtle animated dot grid. Used on CTA "Ready to put AI to work" section with dark bg, brand blue (#0070F3), low opacity.
- **Status:** Installed / Converted

---

## Pending Review

| Element | Pick | Source | Notes |
|---|---|---|---|
| Timeline | Process Timeline (Aceternity) | https://21st.dev/community/components/aceternity/timeline/default | Horizontal scroll cards for /how-it-works |

---

## Already In Use (Keep)

- Aurora Background (Aceternity) — homepage hero (replaced Canvas Particles)
- Magic Card (Magic UI) — service cards with mouse-follow gradient
- TextAnimate (Magic UI) — hero headline entrance
- InteractiveHoverButton (Magic UI) — primary CTAs
- Marquee (Magic UI) — service labels strip
- Number Ticker (Magic UI) — stats count-up
- Tubelight Navbar (ayushmxxn) — desktop top pill + mobile bottom pill
- CTA with Glow (Launch UI) — page-bottom CTAs
- Testimonials (Tailus) — masonry grid cards
- Footer with newsletter (21st.dev) — 4-column dark #0A0A0A theme
- Flickering Grid (Magic UI) — CTA section background
- GSAP ScrollTrigger fade-ups — entrance animations
- Card Beam (CSS) — rotating conic-gradient border on service cards (in index.css)
- Border Beam (CSS) — card accents (in index.css)

## Deprecated (still in codebase, not used on homepage)

- Retro Grid (Magic UI) — was homepage grid background
- Canvas Particles — was hero background
- Animated Beam — was in ServicesCards stacking cards
- Old Navbar.jsx — hamburger menu, dark/light switching
- Old Footer.jsx — dark theme footer

---

## Source Code Reference

All original component code saved at: `~/lalia/4-Resources/uiComponents/`
- `auroraBackground.jsx` — Aurora Background (Aceternity)
- `tubelightNavbar.jsx` — Tubelight Navbar (ayushmxxn)
- `ctaWithGlow.jsx` — CTA with Glow (Launch UI)
- `testimonials.jsx` — Testimonials One (Tailus)
- `footer.jsx` — Footer with newsletter
- `README.md` — Full index with Magic UI install commands

---

## Compatibility Notes

- Project uses GSAP only (no Framer Motion). All Framer Motion components need conversion.
- React 19 + Vite (not Next.js). No `next/image`, no `"use client"` directives needed.
- Tailwind CSS v3.4. shadcn `cn()` utility already set up at `src/lib/utils`.

---

Last updated: 2026-02-25 (Phase 7 homepage complete, polish pass done)
