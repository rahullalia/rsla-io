# RSL/A (rsla.io) Website Strategy & Architecture Plan

## 1. Core Purpose & Tonality
The rsla.io website is the premium, high-trust conversion engine for the business. It must instantly establish Rahul as the person who makes AI actually work for founders, and drive qualified leads to book a call.

### Positioning on the Website
The website bridges both brand modes. The content and educational tone reflect The Mentor (Rahul Lalia). The service pages and booking flow reflect The Black Box (RSL/A). The visitor journey: learn what AI can do for your business, then let us build it.

### Tonality (Based on Brand Guide)
- **Confident & Results-Focused:** The website proves that AI works in real businesses with real numbers. Not hype, not theory.
- **Clear Over Clever:** Headlines should state exactly what AI does for the founder's business. Avoid vague marketing jargon.
- **Dynamic & Bespoke:** The design should feel modern and responsive, reflecting the technical depth behind the AI systems we build.

## 2. Global Design Rules
- **Typography:** Satoshi (Headings, bold/black weights) & Inter (Body copy). Use the accent cursive/serif *very* sparingly for emphasis.
- **Colors:** Deep Slate (#111827) or Pure White (#FFFFFF) backgrounds. Anchor Blue (#0070F3) for primary CTAs. Electric Cyan (#00C2FF) for subtle tech gradients/hover states.
- **Imagery:** High-fidelity dashboards, clean UI mockups, and professional photos of Rahul. No generic stock photos.
- **Navigation:** Sticky, minimalist header with a clear "Book a Call" CTA always visible.

---

## 3. Site Architecture & Page Structure

### A. The Core Funnel (Required Pages)

**1. Home Page (`/`)**
*Goal: Instantly communicate that RSL/A makes AI work for founders, and drive bookings.*
- **Hero Section:** Strong H1 that leads with the founder's problem, not the service. Primary CTA: "Build My System" (Anchors to `/#contact`).
- **Social Proof:** Logos of past clients or "As seen on" (if applicable).
- **The Problem/Solution:** Agitate the pain (manual work, missed leads, broken tools) and introduce AI as the practical solution.
- **Services Overview:** Three cards showing how AI applies across the business: AI-optimized lead generation, AI automations (core), AI-integrated operations. Each links to its service page.
- **Founder Section:** Rahul's story. The Mentor mode. Why he teaches AI publicly, and why execution requires precision. Bridges personal brand into the agency.
- **Case Study Teaser:** 2 to 3 results with real numbers. Reframed through the AI lens.
- **The Booking Section (`/#contact`):** Embedded GHL calendar with a brief pre-qualifying form. No generic "send us a message" forms.

**2. Service Pages (reframed under AI umbrella)**
*Goal: Detail specific offerings, all positioned as AI-powered solutions.*
- `/ai-lead-generation` (formerly Paid Acquisition. AI-optimized ad targeting, creative testing, and pipeline feeding.)
- `/ai-automations` (Core offering. The centerpiece. AI chatbots, workflows, lead handling, customer service.)
- `/ai-operations` (formerly CRM Implementation. AI-integrated pipelines, dashboards, and operational infrastructure.)
- `/ai-digital-presence` (formerly SEO/Websites. AI-informed web presence, content strategy, and conversion optimization.)

*Note: URL changes from old service page slugs require 301 redirects. Add old paths to the URL preservation list.*

**3. About / The Founder Page (`/about`)**
*Goal: Deepen trust and establish Rahul as the AI-for-business authority.*
- This is where The Mentor shines. Rahul's background (analytics, self-taught, laid off, built the agency).
- The philosophy: "I don't believe in gatekeeping knowledge." He teaches AI publicly. But execution requires precision, which is why RSL/A exists.
- The differentiator: analytics background means every AI system is measured, not just demoed.

**4. Case Studies (`/case-studies` or `/work`)**
*Goal: Undeniable proof that AI works in real businesses.*
- Each case study reframed: what AI system was built, what manual work it replaced, what the measurable outcome was.
- Keep existing URLs exactly as they are.

**5. Blog / Insights (`/blog`)**
*Goal: SEO traffic and Mentor-mode authority. This is where Rahul teaches AI.*
- Content pillars: "AI that actually works," "Behind the build," "The founder tech stack," "Founder diaries."
- No generic marketing tips. Everything through the AI lens.
- Keep existing URLs exactly as they are.

### B. Utility Pages
- `/privacy-policy`
- `/terms-of-service`

---

## 4. URL Preservation Strategy (CRITICAL)
To avoid losing SEO ranking and breaking existing links, the following URL structures **must** remain identical to the live site. (If a page is redesigned, the URL slug must not change).

*Note: Before any development begins, a full sitemap export of the current live site must be generated to ensure 100% path mapping.*

**Known Protected Paths:**
- `/#contact` (Booking anchor)
- `/blog/*` (All existing article paths)
- `/case-studies/*` (All existing case study paths)

---

## 5. Next Steps for Implementation
1. **Sitemap Verification:** Confirm any other existing URLs that need protecting.
2. **Wireframing:** Create structural wireframes for the Home Page and a Service Page template.
3. **Copywriting:** Draft the H1s, subheadlines, and CTA text based on the brand voice guidelines.
4. **UI Design:** Apply the Satoshi/Inter typography and Anchor Blue color palette to the wireframes.
