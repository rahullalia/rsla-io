# RSL/A Website Enhancements - Context for AI Agents

**Date of Changes:** March 4, 2026
**Primary Goal:** To elevate the RSL/A website's UI by introducing premium, Apple-style scroll animations and ensuring consistent "premium" UI entrances across all pages (both homepage components and inner pages).

## 1. Homepage Component Enhancements
*   **HeroV2 (`src/components/HeroV2.jsx`)**: Re-integrated the `AuroraBackground` component to act as the primary hero background, replacing the static grid for a more dynamic feel.
*   **HowItWorks (`src/components/HowItWorks.jsx`)**: Completely refactored this component from a vertical list into a pinned, Apple-style horizontal scroll-scrub timeline using GSAP `ScrollTrigger`.
*   **SystemArchitecture (`src/components/SystemArchitecture.jsx`)**: Created an isometric 3D stacking animation. As the user scrolls, the foundational layers (Infrastructure, AI Automation, Paid Acquisition) drop into place in 3D space (`rotateX(50deg) rotateY(-5deg) rotateZ(0deg)`).

## 2. Inner Page Consistency (TextAnimate Integration)
We systematically audited all inner pages to ensure they matched the new premium feel of the homepage. We applied the `TextAnimate` component (using the `blurInUp` by-word preset) to the primary `h1` headings of the following pages:
*   `src/pages/About.jsx`
*   `src/pages/Services.jsx`
*   `src/pages/Blog.jsx` (Header: "The Archive.")
*   `src/pages/Work.jsx` (Header: "Proven Performance.")
*   `src/pages/Privacy.jsx`
*   `src/pages/Terms.jsx`
*   `src/pages/Disclaimer.jsx`
*   `src/pages/Accessibility.jsx`

## 3. Important Context & Bug Fixes
*   **Vite HMR/Import Alias Bug:** Initially, adding `TextAnimate` to the inner pages caused a fatal React Error Boundary crash (`Something went wrong. Please refresh the page.`). 
    *   **The Cause:** Using relative imports (`../components/ui/text-animate`) for the component misaligned with how it was imported elsewhere, breaking Vite's HMR cache.
    *   **The Fix:** **ALWAYS** use the strict absolute path alias for UI components: `import { TextAnimate } from '@/components/ui/text-animate';`. All inner pages were updated to use this pattern, which fully resolved the crashes.
*   **Sanity Integration:** The local dev server runs on port `3002`. The Sanity CMS project has CORS policies that block API requests from `localhost:3002`. Therefore, pages like `/blog` and `/work` will show loading skeletons or "No posts found" states locally, which is expected behavior. Content loads fine in production.

## 4. Animation Stack
*   **Core Library:** GSAP + ScrollTrigger (for the scroll-scrub timeline and 3D stacking).
*   **Text Entrances:** Framer Motion (via the Magic UI `TextAnimate` component wrapper).
