# Services Page Rebuild - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the thin, noindexed service detail pages with substantial, indexed pages targeting high-value keywords, then add a Bakersfield city hub page as the template for future city expansion.

**Architecture:** Five new service detail pages replace the current single `ServiceDetail.jsx` with per-service components sharing a common layout. A new `CityHub.jsx` page handles city-specific landing pages with a data-driven approach. Routes change from `/services/:slug` (one component) to individual imports per service + `/services/bakersfield` for the city page. The existing `/services` pillar page gets a content overhaul.

**Tech Stack:** React 19, Vite, Tailwind CSS, GSAP + ScrollTrigger, Seo.jsx (meta/OG/JSON-LD), prerender.mjs (build-time HTML injection), generateSitemap.mjs

---

## File Structure

### New Files
```
src/
  pages/
    services/
      WebDesign.jsx              # /services/web-design
      Seo.jsx                    # /services/seo (renamed from search-visibility)
      AiAutomations.jsx          # /services/ai-automations
      CrmSystems.jsx             # /services/crm-systems
      CustomDevelopment.jsx      # /services/custom-development
  components/
    services/
      ServiceLayout.jsx          # Shared layout: hero, content sections, case studies, FAQ, CTA
      ServiceFaq.jsx             # FAQ section with schema generation
      RelatedCaseStudies.jsx     # Case study cards grid
      CityServiceCard.jsx        # Card linking to city-specific service pages (Phase 3 future use)
  pages/
    CityHub.jsx                  # /services/bakersfield (data-driven city page)
  data/
    serviceData.js               # Centralized service metadata (titles, descriptions, keywords, FAQ, case studies)
    cityData.js                  # Centralized city metadata (Bakersfield first, expandable)
```

### Modified Files
```
src/App.jsx                      # New routes for individual services + city hub
src/pages/Services.jsx           # Content overhaul for pillar page
src/components/ServicesV2.jsx     # Update hrefs if service slugs change
scripts/prerender.mjs            # Add prerender content for new service + city pages
scripts/generateSitemap.mjs      # Add new service + city URLs to sitemap
```

### Deleted Files
```
src/pages/ServiceDetail.jsx      # Replaced by individual service pages
```

---

## URL Structure Decisions

### Service slug changes

The current slugs in ServicesV2.jsx link to:
- `/services/websites`
- `/services/search-visibility`
- `/services/ai-automations`
- `/services/crm-systems`
- `/services/custom-development`

**Changes needed:**
- `/services/websites` -> `/services/web-design` (matches keyword "web design bakersfield", "sacramento web design")
- `/services/search-visibility` -> `/services/seo` (matches keyword "local seo services", "bakersfield seo")
- Others stay the same

Both old slugs get 301 redirects in vercel.json.

### City page URL

- `/services/bakersfield` - hub page for all services in Bakersfield
- Future: `/services/sacramento`, `/services/fresno`, `/services/orange-county`
- Phase 3 (not this plan): `/services/seo/bakersfield`, `/services/web-design/sacramento`

---

## Task 1: Create Service Data Module

**Files:**
- Create: `src/data/serviceData.js`

This centralizes all service metadata so the pillar page, detail pages, prerender script, and sitemap all pull from one source.

- [ ] **Step 1: Create the service data file**

```js
// src/data/serviceData.js

export const services = {
  'web-design': {
    title: 'Web Design',
    displayName: 'Websites',
    headline: 'Custom websites that actually convert.',
    description: 'New builds and full rebuilds. Fast, custom-designed, SEO-ready websites that launch in weeks, not quarters.',
    metaTitle: 'Custom Web Design for B2B Companies | RSL/A',
    metaDescription: 'Custom-designed, SEO-ready websites built on React and Next.js. From wireframe to launch in 2-4 weeks. See our portfolio and book a free strategy call.',
    keywords: 'custom web design, B2B website design, React website development, SEO-ready websites, website redesign, web design agency',
    canonical: 'https://rsla.io/services/web-design',
    caseStudies: [
      { href: '/work/fieldshare-seo-website-rebrand', title: 'Page 1 in 6 Months: Fieldshare SEO Case Study', metric: 'Page 1 rankings in 6 months' },
      { href: '/work/adreviveai-saas-build', title: 'Idea to SaaS in 4 Weeks: AdReviveAI', metric: 'From idea to live SaaS in 4 weeks' },
    ],
    faqs: [
      { q: 'How long does a website build take?', a: 'Most projects launch in 2 to 4 weeks. Complex builds with custom integrations take 4 to 6 weeks. We scope everything upfront so there are no surprises.' },
      { q: 'What platform do you build on?', a: 'React and Next.js for custom builds, or GoHighLevel for businesses that need a CRM-integrated site. We pick the right tool based on your goals, not our preferences.' },
      { q: 'Do you redesign existing websites?', a: 'Yes. Full rebuilds are about half of what we do. We migrate your content, set up redirects, and make sure you do not lose any search rankings in the process.' },
      { q: 'Is SEO included?', a: 'Every website we build includes on-page SEO: proper heading structure, meta tags, structured data, sitemap, fast load times, and mobile optimization. Ongoing SEO campaigns are a separate service.' },
    ],
  },
  seo: {
    title: 'SEO',
    displayName: 'Search Visibility',
    headline: 'Show up where your buyers are looking.',
    description: 'Local SEO, technical SEO, and answer engine optimization. Rankings on Google, ChatGPT, Perplexity, and Claude.',
    metaTitle: 'Local SEO Services for Small Business | RSL/A',
    metaDescription: 'Local SEO services that get your business found on Google, ChatGPT, and AI search engines. Technical SEO, content strategy, and Google Business Profile optimization.',
    keywords: 'local seo services, local seo for small business, seo agency, local seo consultant, answer engine optimization, Google Business Profile optimization',
    canonical: 'https://rsla.io/services/seo',
    caseStudies: [
      { href: '/work/seo-content-marketing-automation', title: 'Saved $18K/Year with AI Content Automation', metric: '$18K/year saved on content production' },
      { href: '/work/local-seo-reputation-management', title: 'From 14 to 132 Google Reviews in 60 Days', metric: '14 to 132 reviews in 60 days' },
      { href: '/work/fieldshare-seo-website-rebrand', title: 'Page 1 in 6 Months: Fieldshare SEO Case Study', metric: 'Page 1 rankings in 6 months' },
    ],
    faqs: [
      { q: 'How long does SEO take to show results?', a: 'Most clients see measurable movement within 30 to 60 days. Page 1 rankings for local keywords typically happen within 3 to 6 months depending on competition. We send monthly reports so you can track progress.' },
      { q: 'Do you work with Google Business Profile?', a: 'Yes. GBP optimization is a core part of our local SEO work. We optimize your profile, build a review generation system, and manage your local citations.' },
      { q: 'What is answer engine optimization?', a: 'AEO is making sure your business shows up when people ask AI tools like ChatGPT, Perplexity, or Claude for recommendations. We structure your content so AI systems can find and cite your business.' },
      { q: 'Do you guarantee rankings?', a: 'No. Anyone who guarantees specific rankings is lying. What we guarantee is a measurable improvement in your search visibility, tracked with real data from Google Search Console and analytics.' },
    ],
  },
  'ai-automations': {
    title: 'AI Automations',
    displayName: 'AI Automations',
    headline: 'Replace manual work with AI systems.',
    description: 'n8n, Make, and custom AI agents that handle lead follow-up, proposals, content, and reporting while you sleep.',
    metaTitle: 'AI Automation Services for B2B Companies | RSL/A',
    metaDescription: 'Custom AI automation systems using n8n, Make, and GoHighLevel. Automate lead follow-up, client onboarding, reporting, and operations. Book a free strategy call.',
    keywords: 'AI automation agency, business automation, n8n automation, Make automation, AI lead follow-up, workflow automation',
    canonical: 'https://rsla.io/services/ai-automations',
    caseStudies: [
      { href: '/work/ai-lead-response-autoresponder', title: 'AI Email Auto-Responder in 24 Seconds', metric: '24-second average response time' },
      { href: '/work/ai-cold-email-personalization', title: 'How We Personalize 1,200 Cold Emails a Day', metric: '1,200 personalized emails daily' },
      { href: '/work/field-service-operations-automation', title: 'Field Service Operations Rebuild with GHL', metric: 'Full operations rebuild' },
    ],
    faqs: [
      { q: 'What tools do you use for automation?', a: 'n8n for complex workflows, Make for simpler automations, GoHighLevel for CRM-connected workflows, and custom code when off-the-shelf tools hit their limits. We pick based on your needs and budget.' },
      { q: 'How much does AI automation cost?', a: 'Projects typically range from $2,000 to $10,000 depending on complexity. A simple lead follow-up system is on the lower end. A full operations overhaul with AI agents is on the higher end. We scope everything before you commit.' },
      { q: 'Will automation replace my team?', a: 'No. Automation handles repetitive tasks your team should not be doing manually. Your people focus on relationship building, strategy, and closing deals. The AI handles the rest.' },
      { q: 'How long does implementation take?', a: 'Most automation systems go live in 2 to 3 weeks. We build, test, and iterate before anything touches your real leads or customers.' },
    ],
  },
  'crm-systems': {
    title: 'CRM Systems',
    displayName: 'CRM Systems',
    headline: 'One dashboard for your entire business.',
    description: 'GoHighLevel pipelines, workflows, and integrations. One system managing leads, deals, bookings, and communication.',
    metaTitle: 'GoHighLevel CRM Setup & Management | RSL/A',
    metaDescription: 'GoHighLevel CRM setup, pipeline configuration, workflow automation, and ongoing management. One dashboard for leads, deals, and bookings. Book a free strategy call.',
    keywords: 'GoHighLevel setup, CRM setup service, GoHighLevel agency, CRM for small business, pipeline management, GoHighLevel consultant',
    canonical: 'https://rsla.io/services/crm-systems',
    caseStudies: [
      { href: '/work/nonprofit-crm-volunteer-automation', title: 'Automated Volunteer Onboarding Replaces $40K Role', metric: '$40K/year role automated' },
      { href: '/work/salon-marketing-automation-roi', title: '$600 in Meta Ads Drove $36K in Rental Income', metric: '$36K revenue from $600 ad spend' },
    ],
    faqs: [
      { q: 'Why GoHighLevel?', a: 'GHL replaces 5 to 10 separate tools (CRM, email, SMS, funnels, booking, reputation management) with one platform. For most service businesses, it is the best value per dollar. If GHL is not the right fit, we will tell you.' },
      { q: 'Can you migrate from my current CRM?', a: 'Yes. We have migrated clients from HubSpot, Salesforce, Keap, Jobber, and spreadsheets. We move your contacts, pipeline data, and automations without losing anything.' },
      { q: 'Do you offer ongoing CRM management?', a: 'Yes. After the initial setup, we offer month-to-month management: workflow optimization, new automation builds, reporting, and troubleshooting. No long-term contracts.' },
      { q: 'How long does a CRM setup take?', a: 'A standard GHL setup takes 1 to 2 weeks. Complex builds with custom integrations, data migration, and multi-location setups take 3 to 4 weeks.' },
    ],
  },
  'custom-development': {
    title: 'Custom Development',
    displayName: 'Custom Development',
    headline: 'When off-the-shelf is not enough.',
    description: 'SaaS products, MVPs, internal tools, and APIs. Full-stack builds from prototype to production, owned by you.',
    metaTitle: 'Custom Software Development for B2B | RSL/A',
    metaDescription: 'Custom SaaS products, MVPs, internal tools, and APIs. Full-stack development from prototype to production. Built with React, Next.js, Node.js, and Python.',
    keywords: 'custom software development, SaaS development, MVP development, internal tools, API development, B2B software',
    canonical: 'https://rsla.io/services/custom-development',
    caseStudies: [
      { href: '/work/adreviveai-saas-build', title: 'Idea to SaaS in 4 Weeks: AdReviveAI', metric: 'From idea to live product in 4 weeks' },
      { href: '/work/notion-productivity-dashboard-anchor-safety', title: '300 Files to One Notion Dashboard', metric: '300 files consolidated' },
    ],
    faqs: [
      { q: 'What tech stack do you use?', a: 'React and Next.js for frontends, Node.js and Python for backends, PostgreSQL and Supabase for databases, Vercel for hosting. We pick based on the project, not dogma.' },
      { q: 'Do I own the code?', a: 'Yes. 100%. Everything we build is yours. Full source code, documentation, and deployment access. No vendor lock-in.' },
      { q: 'Can you build an MVP?', a: 'Yes. We have taken products from napkin sketch to live users in 4 to 6 weeks. We focus on the core value proposition first and iterate from there.' },
      { q: 'Do you offer ongoing maintenance?', a: 'Yes. After launch, we offer month-to-month maintenance: bug fixes, feature additions, performance optimization, and infrastructure management.' },
    ],
  },
};

export const serviceOrder = ['web-design', 'seo', 'ai-automations', 'crm-systems', 'custom-development'];
```

- [ ] **Step 2: Verify the file is importable**

Run: `cd /Users/rahullalia/lalia/myBusiness/rslaWebsite/.worktrees/servicesPage && node -e "import('./src/data/serviceData.js').then(m => console.log(Object.keys(m.services))).catch(e => console.error(e.message))"`

Expected: `['web-design', 'seo', 'ai-automations', 'crm-systems', 'custom-development']`

- [ ] **Step 3: Commit**

```bash
git add src/data/serviceData.js
git commit -m "feat: add centralized service data module"
```

---

## Task 2: Create City Data Module

**Files:**
- Create: `src/data/cityData.js`

Bakersfield first, structured for easy expansion.

- [ ] **Step 1: Create the city data file**

```js
// src/data/cityData.js

export const cities = {
  bakersfield: {
    name: 'Bakersfield',
    state: 'CA',
    slug: 'bakersfield',
    metaTitle: 'Digital Marketing Agency in Bakersfield, CA | RSL/A',
    metaDescription: 'Bakersfield-based digital marketing agency. Web design, local SEO, and AI automation for businesses in Kern County and the Central Valley.',
    keywords: 'marketing agency bakersfield, web design bakersfield, bakersfield seo, digital marketing bakersfield ca, seo bakersfield, bakersfield web design, website design bakersfield',
    canonical: 'https://rsla.io/services/bakersfield',
    headline: 'Digital marketing that works for Bakersfield businesses.',
    subheadline: 'Web design, SEO, and AI automation from a team that lives and works in Bakersfield.',
    localContent: {
      intro: 'Bakersfield businesses compete in one of the fastest-growing metros in California. Whether you are in agriculture, energy, healthcare, or professional services, your customers are searching online before they pick up the phone. RSL/A is based right here in Bakersfield, and we build the systems that make sure they find you first.',
      whyLocal: 'We are not a remote agency guessing at your market. We live in Bakersfield. We understand the Central Valley business landscape, the industries that drive Kern County, and what it takes to stand out in a market where most businesses still rely on word of mouth and outdated websites.',
      industries: ['Agriculture & farming operations', 'Oil & energy services', 'Healthcare & medical practices', 'Professional services & law firms', 'Restaurants & hospitality', 'Construction & home services', 'Auto dealerships & repair shops'],
    },
    serviceHighlights: ['web-design', 'seo'],
    areaServed: {
      type: 'City',
      name: 'Bakersfield',
      containedIn: 'Kern County, California',
    },
    nearbyAreas: ['Kern County', 'Tehachapi', 'Delano', 'Shafter', 'Arvin', 'Wasco'],
    faqs: [
      { q: 'Do you work with businesses outside Bakersfield?', a: 'Yes. We work with businesses across California and nationally. But Bakersfield is home, and local businesses get the added benefit of in-person meetings, local market knowledge, and faster turnaround.' },
      { q: 'How much does a website cost for a Bakersfield business?', a: 'Most projects range from $3,000 to $10,000 depending on scope. A simple 5-page business site is on the lower end. A custom build with integrations, booking systems, and CRM connections is on the higher end. We scope everything before you commit.' },
      { q: 'Can you help with Google Business Profile?', a: 'Yes. Google Business Profile optimization is part of our local SEO service. We optimize your listing, set up review generation, manage photos and posts, and track your local pack rankings.' },
      { q: 'How do I get started?', a: 'Book a free 30-minute strategy call. We will review your current online presence, identify quick wins, and outline a plan. No pressure, no contracts.' },
    ],
  },
};

export const cityOrder = ['bakersfield'];
```

- [ ] **Step 2: Commit**

```bash
git add src/data/cityData.js
git commit -m "feat: add city data module with Bakersfield"
```

---

## Task 3: Create Shared Service Layout Component

**Files:**
- Create: `src/components/services/ServiceLayout.jsx`
- Create: `src/components/services/ServiceFaq.jsx`
- Create: `src/components/services/RelatedCaseStudies.jsx`

These shared components define the visual structure that all service detail pages use.

- [ ] **Step 1: Create the FAQ component**

```jsx
// src/components/services/ServiceFaq.jsx

export default function ServiceFaq({ faqs, serviceName }) {
  if (!faqs?.length) return null;

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-accent-light border-t border-accent-border">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-sans font-extrabold text-2xl md:text-3xl tracking-tight text-text mb-10">
          Frequently asked questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group rounded-xl border border-accent-border bg-surface p-5 transition-colors open:border-accent/30"
            >
              <summary className="cursor-pointer font-sans font-bold text-base md:text-lg text-text leading-snug list-none flex items-start justify-between gap-4">
                <span>{faq.q}</span>
                <span className="shrink-0 text-textMuted text-lg leading-none transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 font-sans text-base text-textMuted leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function generateFaqSchema(faqs) {
  if (!faqs?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
}
```

- [ ] **Step 2: Create the related case studies component**

```jsx
// src/components/services/RelatedCaseStudies.jsx

import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function RelatedCaseStudies({ caseStudies }) {
  if (!caseStudies?.length) return null;

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-surface">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-sans font-extrabold text-2xl md:text-3xl tracking-tight text-text mb-10">
          See it in action
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((cs) => (
            <Link
              key={cs.href}
              to={cs.href}
              className="group rounded-xl border border-accent-border bg-accent-light p-6 transition-colors hover:border-accent/40"
            >
              <p className="font-sans text-sm font-bold text-accent mb-2">{cs.metric}</p>
              <p className="font-sans text-base font-semibold text-text leading-snug group-hover:text-accent transition-colors">
                {cs.title}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 font-sans text-sm text-textMuted group-hover:text-accent transition-colors">
                Read case study <ArrowRight size={14} strokeWidth={2} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create the shared service layout**

```jsx
// src/components/services/ServiceLayout.jsx

import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';
import { TextAnimate } from '@/components/ui/text-animate';
import Seo from '@/components/Seo';
import ServiceFaq, { generateFaqSchema } from './ServiceFaq';
import RelatedCaseStudies from './RelatedCaseStudies';

export default function ServiceLayout({ service, children }) {
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        gsap.set('.service-hero-content', { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo('.service-hero-content',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.1 }
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: 'RSL/A',
      url: 'https://rsla.io',
      logo: 'https://rsla.io/images/logo/lockup-nobg.webp',
    },
    url: service.canonical,
    areaServed: { '@type': 'Country', name: 'US' },
  };

  const faqSchema = generateFaqSchema(service.faqs);
  const jsonLd = faqSchema ? [serviceSchema, faqSchema] : serviceSchema;

  return (
    <div ref={pageRef}>
      <Seo
        title={service.metaTitle}
        description={service.metaDescription}
        keywords={service.keywords}
        canonical={service.canonical}
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="bg-surface pt-36 pb-12 md:pb-16 px-6 md:px-12">
        <div className="service-hero-content opacity-0 max-w-4xl mx-auto">
          <Link
            to="/services"
            className="inline-flex items-center gap-1 font-sans text-sm text-textMuted hover:text-accent transition-colors mb-8"
          >
            All Services
          </Link>
          <h1 className="font-sans font-bold text-3xl md:text-5xl text-text tracking-tight mb-6 leading-[1.1]">
            <TextAnimate animation="blurInUp" by="word" delay={0.08} startOnView={false} as="span">
              {service.headline}
            </TextAnimate>
          </h1>
          <p className="font-sans text-lg text-textMuted leading-relaxed max-w-2xl">
            {service.description}
          </p>
        </div>
      </section>

      {/* Service-specific content (passed as children) */}
      {children}

      <RelatedCaseStudies caseStudies={service.caseStudies} />
      <ServiceFaq faqs={service.faqs} serviceName={service.title} />

      {/* Bottom CTA */}
      <section className="bg-surface py-16 md:py-24 px-6 md:px-12 border-t border-accent-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-sans font-extrabold text-2xl md:text-3xl tracking-tight text-text mb-4">
            Ready to get started?
          </h2>
          <p className="font-sans text-lg text-textMuted leading-relaxed mb-8">
            Book a free 30-minute call and we will map out exactly what your business needs.
          </p>
          <Link
            to="/contact"
            onClick={() => window.dataLayer?.push({ event: 'cta_click', cta_location: `service_${service.title.toLowerCase().replace(/\s+/g, '_')}` })}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3 font-sans font-bold text-base text-white shadow-sm transition-colors hover:bg-accent/90"
          >
            Book a free call
            <ArrowRight size={16} strokeWidth={2} className="opacity-60" />
          </Link>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/services/
git commit -m "feat: add shared service layout, FAQ, and case study components"
```

---

## Task 4: Create Individual Service Pages

**Files:**
- Create: `src/pages/services/WebDesign.jsx`
- Create: `src/pages/services/SeoService.jsx`
- Create: `src/pages/services/AiAutomations.jsx`
- Create: `src/pages/services/CrmSystems.jsx`
- Create: `src/pages/services/CustomDevelopment.jsx`

Each page imports `ServiceLayout` and passes service-specific content sections as children. The content sections are unique per service and contain the substance that makes these pages worth indexing. 

**IMPORTANT:** The content for these pages needs to come from Rahul in a follow-up interview. The structure and components are built here; the actual copy will be filled in during a content pass. For now, each page gets placeholder content sections that demonstrate the layout and can be swapped out.

- [ ] **Step 1: Create the web design service page**

```jsx
// src/pages/services/WebDesign.jsx

import { services } from '@/data/serviceData';
import ServiceLayout from '@/components/services/ServiceLayout';

const service = services['web-design'];

export default function WebDesign() {
  return (
    <ServiceLayout service={service}>
      <section className="bg-accent-light py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto space-y-16">
          <div>
            <h2 className="font-sans font-extrabold text-xl md:text-2xl tracking-tight text-text mb-4">
              What you get
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                { label: 'Custom design', desc: 'No templates. Every page designed around your brand, your audience, and your conversion goals.' },
                { label: 'SEO-ready from day one', desc: 'Proper heading structure, meta tags, structured data, sitemap, and fast load times baked into every build.' },
                { label: 'Mobile-first', desc: 'Responsive design that looks and works perfectly on every device. Over 60% of your traffic is mobile.' },
                { label: 'Fast load times', desc: 'Optimized images, code splitting, and modern hosting. Your site loads in under 2 seconds.' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-accent-border bg-surface p-5">
                  <p className="font-sans font-bold text-base text-text mb-1">{item.label}</p>
                  <p className="font-sans text-sm text-textMuted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-sans font-extrabold text-xl md:text-2xl tracking-tight text-text mb-4">
              Our process
            </h2>
            <ol className="space-y-4">
              {[
                { step: 'Strategy call', desc: 'We audit your current site, identify quick wins, and define the project scope.' },
                { step: 'Wireframes & design', desc: 'You see the full layout before we write a line of code. Revisions happen here, not after launch.' },
                { step: 'Build & QA', desc: 'We build on React or Next.js, test across devices and browsers, and set up analytics.' },
                { step: 'Launch & handoff', desc: 'We handle DNS, SSL, redirects, and submit your sitemap. You get full access and documentation.' },
              ].map((item, i) => (
                <li key={item.step} className="flex gap-4 items-start">
                  <span className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 font-sans text-sm font-bold text-accent">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-sans font-bold text-base text-text">{item.step}</p>
                    <p className="font-sans text-sm text-textMuted leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </ServiceLayout>
  );
}
```

- [ ] **Step 2: Create the SEO service page**

```jsx
// src/pages/services/SeoService.jsx

import { services } from '@/data/serviceData';
import ServiceLayout from '@/components/services/ServiceLayout';

const service = services['seo'];

export default function SeoService() {
  return (
    <ServiceLayout service={service}>
      <section className="bg-accent-light py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto space-y-16">
          <div>
            <h2 className="font-sans font-extrabold text-xl md:text-2xl tracking-tight text-text mb-4">
              What we cover
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { label: 'Local SEO', desc: 'Google Business Profile, local citations, review generation, and map pack optimization for businesses that serve a geographic area.' },
                { label: 'Technical SEO', desc: 'Site speed, crawlability, structured data, internal linking, and indexing issues. The foundation everything else builds on.' },
                { label: 'Answer engine optimization', desc: 'Content structured so AI tools like ChatGPT, Perplexity, and Claude recommend your business when users ask for services you provide.' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-accent-border bg-surface p-5">
                  <p className="font-sans font-bold text-base text-text mb-1">{item.label}</p>
                  <p className="font-sans text-sm text-textMuted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-sans font-extrabold text-xl md:text-2xl tracking-tight text-text mb-4">
              How we work
            </h2>
            <ol className="space-y-4">
              {[
                { step: 'Audit', desc: 'We run a full technical and competitive audit. You get a prioritized list of what to fix and what to build.' },
                { step: 'Fix the foundation', desc: 'Technical issues first. Broken links, missing structured data, slow load times, indexing problems.' },
                { step: 'Build content', desc: 'Keyword-targeted content that answers real questions your customers are asking.' },
                { step: 'Track and iterate', desc: 'Monthly reporting with Google Search Console data. We show you what moved, what is working, and what is next.' },
              ].map((item, i) => (
                <li key={item.step} className="flex gap-4 items-start">
                  <span className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 font-sans text-sm font-bold text-accent">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-sans font-bold text-base text-text">{item.step}</p>
                    <p className="font-sans text-sm text-textMuted leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </ServiceLayout>
  );
}
```

- [ ] **Step 3: Create the AI automations service page**

```jsx
// src/pages/services/AiAutomations.jsx

import { services } from '@/data/serviceData';
import ServiceLayout from '@/components/services/ServiceLayout';

const service = services['ai-automations'];

export default function AiAutomations() {
  return (
    <ServiceLayout service={service}>
      <section className="bg-accent-light py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto space-y-16">
          <div>
            <h2 className="font-sans font-extrabold text-xl md:text-2xl tracking-tight text-text mb-4">
              What we automate
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                { label: 'Lead follow-up', desc: 'AI-powered responses within seconds of form submission. Qualify leads, book meetings, and route to the right rep automatically.' },
                { label: 'Client onboarding', desc: 'Contracts, intake forms, welcome sequences, and project setup. All triggered the moment a deal closes.' },
                { label: 'Reporting & analytics', desc: 'Automated dashboards that pull data from your CRM, ad accounts, and website into one view. No more manual spreadsheets.' },
                { label: 'Content & outreach', desc: 'AI-personalized cold emails, social media scheduling, and content repurposing workflows.' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-accent-border bg-surface p-5">
                  <p className="font-sans font-bold text-base text-text mb-1">{item.label}</p>
                  <p className="font-sans text-sm text-textMuted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </ServiceLayout>
  );
}
```

- [ ] **Step 4: Create the CRM systems service page**

```jsx
// src/pages/services/CrmSystems.jsx

import { services } from '@/data/serviceData';
import ServiceLayout from '@/components/services/ServiceLayout';

const service = services['crm-systems'];

export default function CrmSystems() {
  return (
    <ServiceLayout service={service}>
      <section className="bg-accent-light py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto space-y-16">
          <div>
            <h2 className="font-sans font-extrabold text-xl md:text-2xl tracking-tight text-text mb-4">
              What we set up
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                { label: 'Pipelines & workflows', desc: 'Visual deal tracking with automated stage progression. Know exactly where every lead and deal stands.' },
                { label: 'Email & SMS automation', desc: 'Drip campaigns, follow-up sequences, appointment reminders, and review requests. All running on autopilot.' },
                { label: 'Booking & calendars', desc: 'Online booking integrated with your calendar. Automatic confirmations, reminders, and no-show follow-up.' },
                { label: 'Integrations', desc: 'Connect your CRM to your website, ad accounts, payment processor, and communication tools. One system, not ten.' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-accent-border bg-surface p-5">
                  <p className="font-sans font-bold text-base text-text mb-1">{item.label}</p>
                  <p className="font-sans text-sm text-textMuted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </ServiceLayout>
  );
}
```

- [ ] **Step 5: Create the custom development service page**

```jsx
// src/pages/services/CustomDevelopment.jsx

import { services } from '@/data/serviceData';
import ServiceLayout from '@/components/services/ServiceLayout';

const service = services['custom-development'];

export default function CustomDevelopment() {
  return (
    <ServiceLayout service={service}>
      <section className="bg-accent-light py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto space-y-16">
          <div>
            <h2 className="font-sans font-extrabold text-xl md:text-2xl tracking-tight text-text mb-4">
              What we build
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                { label: 'SaaS products', desc: 'Full-stack web applications with auth, billing, dashboards, and API integrations. From prototype to production.' },
                { label: 'MVPs', desc: 'Test your idea with real users in 4 to 6 weeks. We build the core value proposition and iterate from there.' },
                { label: 'Internal tools', desc: 'Custom dashboards, data pipelines, and admin panels that replace spreadsheets and manual processes.' },
                { label: 'APIs & integrations', desc: 'Connect systems that do not talk to each other. Custom middleware, webhooks, and data sync solutions.' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-accent-border bg-surface p-5">
                  <p className="font-sans font-bold text-base text-text mb-1">{item.label}</p>
                  <p className="font-sans text-sm text-textMuted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </ServiceLayout>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/pages/services/
git commit -m "feat: add 5 individual service detail pages"
```

---

## Task 5: Create Bakersfield City Hub Page

**Files:**
- Create: `src/pages/CityHub.jsx`

Single component that reads city data by slug. Bakersfield is the only city now, but this component handles any city from `cityData.js`.

- [ ] **Step 1: Create the city hub page**

```jsx
// src/pages/CityHub.jsx

import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight, MapPin } from 'lucide-react';
import { TextAnimate } from '@/components/ui/text-animate';
import Seo from '@/components/Seo';
import ServiceFaq, { generateFaqSchema } from '@/components/services/ServiceFaq';
import { cities } from '@/data/cityData';
import { services } from '@/data/serviceData';

export default function CityHub() {
  const { citySlug } = useParams();
  const city = cities[citySlug];
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        gsap.set('.city-hero-content', { opacity: 1, y: 0 });
        gsap.set('.city-section', { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo('.city-hero-content',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.1 }
      );
      gsap.fromTo('.city-section',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out', delay: 0.3 }
      );
    }, pageRef);
    return () => ctx.revert();
  }, [citySlug]);

  if (!city) {
    return (
      <main className="min-h-screen bg-surface text-text pt-36 pb-20 px-6 md:px-12 flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-5xl font-sans font-bold mb-4">Location not found</h1>
        <Link to="/services" className="text-accent hover:text-accent/80 font-sans font-semibold">Back to Services</Link>
      </main>
    );
  }

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `RSL/A - ${city.name}`,
    description: city.metaDescription,
    url: city.canonical,
    areaServed: {
      '@type': city.areaServed.type,
      name: city.areaServed.name,
      containedInPlace: { '@type': 'AdministrativeArea', name: city.areaServed.containedIn },
    },
    provider: {
      '@type': 'Organization',
      name: 'RSL/A',
      url: 'https://rsla.io',
      logo: 'https://rsla.io/images/logo/lockup-nobg.webp',
    },
  };

  const faqSchema = generateFaqSchema(city.faqs);
  const jsonLd = faqSchema ? [localBusinessSchema, faqSchema] : localBusinessSchema;

  const highlightedServices = city.serviceHighlights
    .map((slug) => ({ slug, ...services[slug] }))
    .filter(Boolean);

  return (
    <div ref={pageRef}>
      <Seo
        title={city.metaTitle}
        description={city.metaDescription}
        keywords={city.keywords}
        canonical={city.canonical}
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="bg-surface pt-36 pb-12 md:pb-16 px-6 md:px-12">
        <div className="city-hero-content opacity-0 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-1.5 font-sans text-sm text-accent font-semibold mb-6">
            <MapPin size={14} strokeWidth={2.5} />
            {city.name}, {city.state}
          </div>
          <h1 className="font-sans font-bold text-3xl md:text-5xl text-text tracking-tight mb-6 leading-[1.1]">
            <TextAnimate animation="blurInUp" by="word" delay={0.08} startOnView={false} as="span">
              {city.headline}
            </TextAnimate>
          </h1>
          <p className="font-sans text-lg text-textMuted leading-relaxed max-w-2xl">
            {city.subheadline}
          </p>
        </div>
      </section>

      {/* Local intro */}
      <section className="city-section bg-accent-light py-16 md:py-24 px-6 md:px-12 border-t border-accent-border">
        <div className="max-w-4xl mx-auto">
          <p className="font-sans text-lg text-text leading-relaxed mb-8">
            {city.localContent.intro}
          </p>
          <p className="font-sans text-base text-textMuted leading-relaxed">
            {city.localContent.whyLocal}
          </p>
        </div>
      </section>

      {/* Services in this city */}
      <section className="city-section bg-surface py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-sans font-extrabold text-2xl md:text-3xl tracking-tight text-text mb-10">
            What we do in {city.name}
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {highlightedServices.map((svc) => (
              <Link
                key={svc.slug}
                to={`/services/${svc.slug}`}
                className="group rounded-xl border border-accent-border bg-accent-light p-6 transition-colors hover:border-accent/40"
              >
                <p className="font-sans text-lg font-bold text-text mb-2 group-hover:text-accent transition-colors">
                  {svc.displayName}
                </p>
                <p className="font-sans text-sm text-textMuted leading-relaxed mb-3">
                  {svc.description}
                </p>
                <span className="inline-flex items-center gap-1 font-sans text-sm font-semibold text-accent">
                  Learn more <ArrowRight size={14} strokeWidth={2} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="city-section bg-accent-light py-16 md:py-24 px-6 md:px-12 border-t border-accent-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-sans font-extrabold text-2xl md:text-3xl tracking-tight text-text mb-6">
            Industries we serve in {city.name}
          </h2>
          <ul className="grid gap-3 md:grid-cols-2">
            {city.localContent.industries.map((industry) => (
              <li key={industry} className="flex items-center gap-2 font-sans text-base text-text">
                <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                {industry}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Nearby areas */}
      {city.nearbyAreas?.length > 0 && (
        <section className="city-section bg-surface py-12 px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <p className="font-sans text-sm text-textMuted">
              Also serving: {city.nearbyAreas.join(', ')}
            </p>
          </div>
        </section>
      )}

      <ServiceFaq faqs={city.faqs} serviceName={`${city.name} services`} />

      {/* Bottom CTA */}
      <section className="bg-surface py-16 md:py-24 px-6 md:px-12 border-t border-accent-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-sans font-extrabold text-2xl md:text-3xl tracking-tight text-text mb-4">
            Ready to grow your {city.name} business?
          </h2>
          <p className="font-sans text-lg text-textMuted leading-relaxed mb-8">
            Book a free 30-minute call. We will review your online presence and outline a plan.
          </p>
          <Link
            to="/contact"
            onClick={() => window.dataLayer?.push({ event: 'cta_click', cta_location: `city_${city.slug}` })}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3 font-sans font-bold text-base text-white shadow-sm transition-colors hover:bg-accent/90"
          >
            Book a free call
            <ArrowRight size={16} strokeWidth={2} className="opacity-60" />
          </Link>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/CityHub.jsx
git commit -m "feat: add data-driven city hub page (Bakersfield)"
```

---

## Task 6: Update Routing in App.jsx

**Files:**
- Modify: `src/App.jsx`

Replace the single `ServiceDetail` route with individual service routes + city hub route. Add 301 redirects in vercel.json for changed slugs.

- [ ] **Step 1: Update App.jsx imports and routes**

Add the new lazy imports after the existing lazy declarations (around line 70-84):

```jsx
// Replace the existing ServiceDetail import:
// const ServiceDetail = lazyRetry(() => import('./pages/ServiceDetail'));

// With individual service page imports:
const WebDesign = lazyRetry(() => import('./pages/services/WebDesign'));
const SeoService = lazyRetry(() => import('./pages/services/SeoService'));
const AiAutomations = lazyRetry(() => import('./pages/services/AiAutomations'));
const CrmSystems = lazyRetry(() => import('./pages/services/CrmSystems'));
const CustomDevelopment = lazyRetry(() => import('./pages/services/CustomDevelopment'));
const CityHub = lazyRetry(() => import('./pages/CityHub'));
```

Replace the routes section (around line 117-118):

```jsx
// Replace:
// <Route path="/services/:slug" element={<ServiceDetail />} />

// With:
<Route path="/services/web-design" element={<WebDesign />} />
<Route path="/services/seo" element={<SeoService />} />
<Route path="/services/ai-automations" element={<AiAutomations />} />
<Route path="/services/crm-systems" element={<CrmSystems />} />
<Route path="/services/custom-development" element={<CustomDevelopment />} />
<Route path="/services/:citySlug" element={<CityHub />} />
```

**Note:** The city hub route uses `:citySlug` and MUST come after the named service routes so `/services/seo` matches the explicit route, not the city wildcard.

- [ ] **Step 2: Delete the old ServiceDetail.jsx**

```bash
rm src/pages/ServiceDetail.jsx
```

- [ ] **Step 3: Update ServicesV2.jsx href values**

In `src/components/ServicesV2.jsx`, update the features array hrefs (around line 1102-1148):

- Change `href: '/services/websites'` to `href: '/services/web-design'`
- Change `href: '/services/search-visibility'` to `href: '/services/seo'`

- [ ] **Step 4: Add 301 redirects in vercel.json**

Add these to the `redirects` array:

```json
{ "source": "/services/websites", "destination": "/services/web-design", "statusCode": 301 },
{ "source": "/services/search-visibility", "destination": "/services/seo", "statusCode": 301 }
```

- [ ] **Step 5: Verify the dev server starts**

Run: `cd /Users/rahullalia/lalia/myBusiness/rslaWebsite/.worktrees/servicesPage && npm run dev`

Navigate to:
- `/services` (pillar page)
- `/services/web-design` (should render WebDesign)
- `/services/seo` (should render SeoService)
- `/services/bakersfield` (should render CityHub)
- `/services/websites` (should still work via React Router, verify redirect works on Vercel later)

- [ ] **Step 6: Commit**

```bash
git add src/App.jsx src/components/ServicesV2.jsx vercel.json
git rm src/pages/ServiceDetail.jsx
git commit -m "feat: replace ServiceDetail with individual service routes + city hub"
```

---

## Task 7: Update Prerender Script

**Files:**
- Modify: `scripts/prerender.mjs`

Add prerender content for all 5 service detail pages (now indexed, not noIndexed) and the Bakersfield city hub page. Remove the old `serviceDetailContent` function.

- [ ] **Step 1: Replace SERVICE_DETAILS and serviceDetailContent**

Remove the old `SERVICE_DETAILS` object and `serviceDetailContent` function (around lines 720-788). Replace with new service page content that uses data from the plan. Each service page gets real semantic HTML with heading structure, content sections, FAQ, and internal links.

The key differences from the old version:
- `noIndex: false` (was `true`)
- Full HTML content with multiple sections (was a single `<h1>` and `<p>`)
- FAQ schema included
- areaServed changed to `Country: US` (was `Place: Worldwide`)

- [ ] **Step 2: Add Bakersfield city page prerender**

Add a new `cityHubContent(slug)` function that generates prerender content for city pages. Bakersfield content should include:
- LocalBusiness/ProfessionalService schema with `areaServed: Bakersfield`
- FAQ schema
- Semantic HTML with local content, service highlights, industries, and nearby areas

- [ ] **Step 3: Add city pages to the prerender loop**

After the service detail loop, add:

```js
// City hub pages
for (const slug of ['bakersfield']) {
  const page = cityHubContent(slug);
  if (page) {
    writePage(page.route, inject(tmpl, page));
    count.static++;
  }
}
```

- [ ] **Step 4: Verify build succeeds**

Run: `cd /Users/rahullalia/lalia/myBusiness/rslaWebsite/.worktrees/servicesPage && npm run build`

Expected: Pre-rendered pages count increases by 1 (Bakersfield). Service detail pages now show as indexed (no noIndex).

- [ ] **Step 5: Commit**

```bash
git add scripts/prerender.mjs
git commit -m "feat: update prerender with indexed service pages + Bakersfield city hub"
```

---

## Task 8: Update Sitemap Generator

**Files:**
- Modify: `scripts/generateSitemap.mjs`

Add the 5 service detail pages and Bakersfield city hub to the sitemap.

- [ ] **Step 1: Add new URLs to the static pages array**

Add after the existing `/services` entry:

```js
{ path: '/services/web-design', priority: '0.8' },
{ path: '/services/seo', priority: '0.8' },
{ path: '/services/ai-automations', priority: '0.8' },
{ path: '/services/crm-systems', priority: '0.8' },
{ path: '/services/custom-development', priority: '0.8' },
{ path: '/services/bakersfield', priority: '0.7' },
```

- [ ] **Step 2: Verify sitemap generates correctly**

Run: `cd /Users/rahullalia/lalia/myBusiness/rslaWebsite/.worktrees/servicesPage && npm run build`

Check the sitemap output includes the new URLs.

- [ ] **Step 3: Commit**

```bash
git add scripts/generateSitemap.mjs
git commit -m "feat: add service detail + Bakersfield pages to sitemap"
```

---

## Task 9: Update Services Pillar Page

**Files:**
- Modify: `src/pages/Services.jsx`

Update the pillar page SEO targeting. The page structure (bento grid) stays, but the meta tags and schema get updated to target the "local seo services" keyword cluster. Add a brief content section below the bento grid with more text for search engines.

- [ ] **Step 1: Update meta tags and schema**

Update the `Seo` component props to target the primary keyword cluster:

```jsx
<Seo
  title="Local SEO Services & AI Marketing for Small Business | RSL/A"
  description="Local SEO services, custom web design, AI automation, and CRM systems for small businesses. We build the systems that get you found and keep you growing."
  keywords="local seo services, local seo for small business, web design agency, AI automation, CRM setup, marketing agency, local seo packages"
  canonical="https://rsla.io/services"
  jsonLd={/* keep existing schema but add areaServed */}
/>
```

- [ ] **Step 2: Add a Bakersfield link to the page**

Below the bento grid, before the CTA, add a local services section:

```jsx
<section className="bg-surface py-12 px-6 md:px-12">
  <div className="max-w-4xl mx-auto">
    <h2 className="font-sans font-bold text-lg text-text mb-4">Local services</h2>
    <Link to="/services/bakersfield" className="font-sans text-accent hover:underline">
      Bakersfield, CA
    </Link>
  </div>
</section>
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/Services.jsx
git commit -m "feat: update services pillar page SEO targeting + local services section"
```

---

## Task 10: Update Prerender for Services Pillar

**Files:**
- Modify: `scripts/prerender.mjs`

Update the `servicesContent()` function to match the new meta tags from Task 9.

- [ ] **Step 1: Update servicesContent()**

Update the title, description, keywords, and HTML to match the React component changes. Add a "Local services" section to the prerender HTML with a link to `/services/bakersfield`.

- [ ] **Step 2: Build and verify**

Run: `npm run build`

Check `dist/services/index.html` has the updated meta tags.

- [ ] **Step 3: Commit**

```bash
git add scripts/prerender.mjs
git commit -m "feat: update services pillar prerender content"
```

---

## Task 11: Final Build Verification

- [ ] **Step 1: Full build**

```bash
cd /Users/rahullalia/lalia/myBusiness/rslaWebsite/.worktrees/servicesPage && npm run build
```

Expected output should show increased pre-rendered page count (was 52, should be ~59: +5 service detail pages now indexed + 1 Bakersfield page + old 5 noindexed service detail pages removed).

- [ ] **Step 2: Check pre-rendered HTML**

```bash
# Verify service pages exist and are NOT noindexed
grep -l "noindex" dist/services/*/index.html 2>/dev/null
# Should return nothing (no noindex on service pages)

# Verify Bakersfield page exists
cat dist/services/bakersfield/index.html | head -20
```

- [ ] **Step 3: Verify sitemap**

```bash
grep "services/" dist/sitemap.xml
```

Expected: `/services`, `/services/web-design`, `/services/seo`, `/services/ai-automations`, `/services/crm-systems`, `/services/custom-development`, `/services/bakersfield`

- [ ] **Step 4: Commit any final fixes**

```bash
git add -A
git commit -m "fix: build verification fixes"
```

---

## Out of Scope (Future Tasks)

These are explicitly not part of this plan but are documented for the next iteration:

1. **Content interview pass:** Rahul needs to provide real content for each service page (client stories, specific process details, pricing signals, tools used). The current pages have structural placeholder content.

2. **Services pillar page content overhaul:** The bento grid is visually strong but the page needs more text content for SEO. A full rewrite targeting "local seo services" (22,200/mo) should be a separate content task.

3. **Additional city pages:** Sacramento, Fresno, Orange County. Same CityHub component, just new entries in `cityData.js`.

4. **Service x City intersection pages:** `/services/seo/bakersfield`, `/services/web-design/sacramento`. These require a new route pattern and component. Phase 3.

5. **Internal linking from blog posts:** Blog posts about SEO, web design, and local business should link to the relevant service detail pages. Separate Sanity content update.

6. **Navbar mega-menu updates:** If service slugs changed, verify the navbar mega-menu links match.
