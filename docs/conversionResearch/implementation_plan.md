# Implement High-Converting Homepage Redesign

This plan outlines the technical steps to transform the `rslaWebsite` homepage to match the newly approved `homepage_wireframe.md` blueprint. 

## Proposed Changes

### Top-Level Page Structure
We will update the root homepage view to orchestrate the new conversion funnel flow.

#### [MODIFY] src/pages/Home.jsx
- Re-architect the component stack to follow the exact order of the wireframe: 
  1. `HeroV2`
  2. Logo Marquee (Trust Bar)
  3. Pain/Agitation section (New or repurposed component)
  4. `SystemArchitecture` (Mechanism)
  5. Case Studies / Proof (Horizontal Scroller)
  6. `RiskReversal` (New component)
  7. Pre-Footer CTA

### Component Updates
We will leverage your existing GSAP/Framer Motion tech stack to implement the new positioning.

#### [MODIFY] src/components/HeroV2.jsx
- **Copywriting:** Update the H1 (using `TextAnimate blurInUp`) to the new hook: *"Scale Your B2B Brand Without Scaling Your Headcount."*
- **Layout:** Update the subheadline and ensure the primary CTA button ("See If You Qualify") has a solid background with a hover state.
- **Visuals:** Ensure the `AuroraBackground` remains the foundational mood-setter.

#### [MODIFY] src/components/SystemArchitecture.jsx
- **Copywriting:** Update the text surrounding your 3D isometric stacking animation to reflect **"The Autonomous Growth Stack™"**.
- Match the 3 layers sequentially to: (1) The Digital Foundation, (2) The Traffic Engine, (3) The AI Sales Assistant.

#### [NEW] src/components/RiskReversal.jsx
- Create a brand new UI block featuring 3 visually distinct glassmorphism cards detailing the B2B guarantees (Infrastructure, Human-in-the-loop AI, 90-Day Execution).

#### [MODIFY] src/components/HowItWorks.jsx (or new component)
- Currently, this acts as a pinned GSAP timeline. We will repurpose this scroll-scrub behavior to visually highlight your **B2B Proof / Case Studies** instead, making the success metrics horizontal and engaging.

## Verification Plan
### Automated Verification
- Run local dev server (`npm run dev`) and build script (`npm run build`) to ensure there are no missing import aliases issues or Vite compilation errors (referencing the previous `../components/ui` vs `@/components/ui` import cache crashes).
### Manual Verification
- Verify the GSAP `ScrollTrigger` animations execute cleanly and clean themselves up via `ctx.revert()` on route change (referencing the recent March 20th bug fix).
- Confirm the `TextAnimate` hook enters perfectly.
- Visually review the dark mode (`#0a0a0a`) spacing, typography (Playfair/Satoshi), and overall aesthetic flow.
