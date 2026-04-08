# Lead Magnet System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dynamic, Sanity-driven lead magnet system where each resource gets its own URL (`/r/:slug`), gates access behind email + name capture via Kit, then redirects to the Notion-hosted resource and triggers a follow-up email.

**Architecture:** Each lead magnet is a Sanity `leadMagnet` document with a slug, description, Notion URL, and Kit tag ID. The frontend renders a gated landing page at `/r/:slug`. On form submit, the visitor is subscribed to Kit (tagged for that specific lead magnet), then immediately redirected to the Notion page. Kit automation sends a follow-up email with the same link. No serverless functions needed — Kit's public API key is already used client-side.

**Tech Stack:** React 19, Vite, Sanity CMS, Kit (ConvertKit) V3 API, Tailwind CSS, GSAP (minimal)

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `rslaStudio/schemaTypes/leadMagnet.ts` | Create | Sanity document schema for lead magnets |
| `rslaStudio/schemaTypes/index.ts` | Modify | Register leadMagnet schema |
| `src/sanity/lib/queries.ts` | Modify | Add GROQ queries for lead magnets |
| `src/pages/LeadMagnet.jsx` | Create | The gated landing page component |
| `src/App.jsx` | Modify | Add `/r/:slug` route |
| `scripts/prerender.mjs` | Modify | Pre-render lead magnet pages |
| `scripts/generateSitemap.mjs` | Modify | Include lead magnet URLs in sitemap |

---

### Task 1: Sanity Schema — `leadMagnet` Document Type

**Files:**
- Create: `rslaStudio/schemaTypes/leadMagnet.ts`
- Modify: `rslaStudio/schemaTypes/index.ts`

- [ ] **Step 1: Create the leadMagnet schema**

Create `rslaStudio/schemaTypes/leadMagnet.ts`:

```typescript
import { defineType, defineField } from 'sanity';

export const leadMagnet = defineType({
  name: 'leadMagnet',
  title: 'Lead Magnet',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The name of the resource (shown on the landing page)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      description: 'URL will be rsla.io/r/{slug}',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'What the visitor gets — shown on the landing page above the form',
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Bullet points shown below the description (e.g., "20-page checklist", "Real examples from client work")',
    }),
    defineField({
      name: 'resourceUrl',
      title: 'Resource URL',
      type: 'url',
      description: 'The Notion page URL (or any URL) visitors are redirected to after submitting their email',
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'kitTagId',
      title: 'Kit Tag ID',
      type: 'string',
      description: 'The numeric tag ID from Kit (ConvertKit). Create the tag in Kit first, then paste the ID here. This triggers the follow-up email automation.',
    }),
    defineField({
      name: 'ctaButtonText',
      title: 'CTA Button Text',
      type: 'string',
      description: 'Text on the submit button',
      initialValue: 'Get instant access',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Small label above the title (e.g., "Free Resource", "AI Toolkit")',
      initialValue: 'Free Resource',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Overrides the page title for search engines. Falls back to title if empty.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
      description: 'Meta description for search engines. Falls back to description if empty.',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
        ],
      },
      initialValue: 'draft',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'status' },
  },
});
```

- [ ] **Step 2: Register the schema**

In `rslaStudio/schemaTypes/index.ts`, add the import and include it in the array:

Add import:
```typescript
import { leadMagnet } from './leadMagnet';
```

Add `leadMagnet` to the `schemaTypes` array:
```typescript
export const schemaTypes = [blogPost, author, category, blogGenerationJob, caseStudy, caseStudyV2, blogPostV2, industryPage, leadMagnet];
```

- [ ] **Step 3: Deploy the schema**

Run from `rslaStudio/`:
```bash
npx sanity deploy
```

Expected: Schema deploys successfully, `leadMagnet` document type appears in Sanity Studio.

- [ ] **Step 4: Commit**

```bash
cd /Users/rahullalia/lalia/myBusiness/rslaStudio
git add schemaTypes/leadMagnet.ts schemaTypes/index.ts
git commit -m "feat: add leadMagnet schema for gated resource pages"
```

---

### Task 2: GROQ Queries

**Files:**
- Modify: `src/sanity/lib/queries.ts` (append after existing queries, around line 685)

- [ ] **Step 1: Add lead magnet queries**

Append to `src/sanity/lib/queries.ts`:

```typescript
// ===== LEAD MAGNETS =====

// Get single lead magnet by slug
export const leadMagnetBySlugQuery = groq`
  *[_type == "leadMagnet" && slug.current == $slug && status == "published"][0] {
    title,
    "slug": slug.current,
    description,
    benefits,
    resourceUrl,
    kitTagId,
    ctaButtonText,
    tagline,
    seoTitle,
    seoDescription
  }
`;

// Get all published lead magnet slugs (for prerender + sitemap)
export const leadMagnetSlugsQuery = groq`
  *[_type == "leadMagnet" && status == "published" && defined(slug.current)] {
    "slug": slug.current,
    title,
    description,
    seoTitle,
    seoDescription,
    tagline
  }
`;
```

- [ ] **Step 2: Commit**

```bash
cd /Users/rahullalia/lalia/myBusiness/rslaWebsite
git add src/sanity/lib/queries.ts
git commit -m "feat: add GROQ queries for lead magnets"
```

---

### Task 3: Lead Magnet Page Component

**Files:**
- Create: `src/pages/LeadMagnet.jsx`

- [ ] **Step 1: Create the LeadMagnet page**

Create `src/pages/LeadMagnet.jsx`:

```jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Seo from '@/components/Seo';
import { client } from '@/sanity/lib/client';
import { leadMagnetBySlugQuery } from '@/sanity/lib/queries';
import { FlickeringGrid } from '@/components/ui/flickering-grid';

const KIT_FORM_ID = import.meta.env.VITE_KIT_FORM_ID;
const KIT_API_KEY = import.meta.env.VITE_KIT_API_KEY;

export default function LeadMagnet() {
  const { slug } = useParams();
  const [magnet, setMagnet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    client.fetch(leadMagnetBySlugQuery, { slug }).then((data) => {
      if (!data) {
        setNotFound(true);
      } else {
        setMagnet(data);
      }
      setLoading(false);
    });
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    setError('');

    try {
      const body = {
        api_key: KIT_API_KEY,
        email,
        first_name: firstName || undefined,
      };
      // Add tag if configured
      if (magnet.kitTagId) {
        body.tags = [magnet.kitTagId];
      }

      const res = await fetch(
        `https://api.convertkit.com/v3/forms/${KIT_FORM_ID}/subscribe`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) throw new Error('Subscription failed');

      // Redirect to the resource
      window.location.href = magnet.resourceUrl;
    } catch {
      setError('Something went wrong. Try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <Seo title="Not Found | RSL/A" description="This resource could not be found." noIndex />
        <h1 className="font-sans font-bold text-3xl text-text mb-4">Resource not found</h1>
        <p className="font-body text-textMuted mb-6">This link may have expired or been removed.</p>
        <Link to="/" className="font-sans font-bold text-sm text-accent hover:underline">
          Back to home
        </Link>
      </main>
    );
  }

  const pageTitle = magnet.seoTitle || `${magnet.title} | RSL/A`;
  const pageDescription = magnet.seoDescription || magnet.description;

  return (
    <main className="min-h-screen bg-surface relative overflow-hidden flex items-center justify-center px-6 py-24">
      <Seo
        title={pageTitle}
        description={pageDescription}
        canonical={`https://rsla.io/r/${magnet.slug}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: magnet.title,
          description: pageDescription,
          url: `https://rsla.io/r/${magnet.slug}`,
          publisher: {
            '@type': 'Organization',
            name: 'RSL/A',
            url: 'https://rsla.io',
          },
        }}
      />

      <FlickeringGrid
        className="absolute inset-0 z-0"
        squareSize={4}
        gridGap={6}
        color="rgb(0, 112, 243)"
        maxOpacity={0.06}
        flickerChance={0.1}
      />

      <div className="relative z-10 max-w-lg w-full text-center">
        {/* Tagline */}
        {magnet.tagline && (
          <span className="inline-block font-mono text-[10px] md:text-xs uppercase tracking-widest text-accent border border-accent/30 rounded-full px-4 py-1.5 mb-8">
            {magnet.tagline}
          </span>
        )}

        {/* Title */}
        <h1 className="font-sans font-bold text-3xl md:text-5xl tracking-tight mb-4 leading-tight text-text">
          {magnet.title}
        </h1>

        {/* Description */}
        <p className="font-body text-textMuted text-base md:text-lg mb-8 max-w-md mx-auto">
          {magnet.description}
        </p>

        {/* Benefits */}
        {magnet.benefits?.length > 0 && (
          <div className="text-left max-w-sm mx-auto mb-10 space-y-3">
            {magnet.benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                <p className="font-body text-sm text-textMuted">{benefit}</p>
              </div>
            ))}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md mx-auto mb-4">
          <input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={submitting}
            className="w-full px-5 py-3.5 rounded-full bg-surfaceAlt border border-accent-border text-text font-body text-sm placeholder:text-textMuted focus:outline-none focus:border-accent/50 transition-colors"
          />
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
            className="w-full px-5 py-3.5 rounded-full bg-surfaceAlt border border-accent-border text-text font-body text-sm placeholder:text-textMuted focus:outline-none focus:border-accent/50 transition-colors"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-3.5 rounded-full bg-accent text-white font-sans font-bold text-sm btn-neon hover:scale-[1.03] active:scale-95 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Sending...' : magnet.ctaButtonText || 'Get instant access'}
          </button>
        </form>

        {error && (
          <p className="font-body text-sm text-coral mb-2">{error}</p>
        )}

        {/* Trust line */}
        <p className="font-body text-xs text-textMuted">
          No spam, unsubscribe anytime.{' '}
          <Link to="/privacy-policy" className="underline underline-offset-2 hover:text-textMuted transition-colors">
            Privacy Policy
          </Link>
        </p>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/rahullalia/lalia/myBusiness/rslaWebsite
git add src/pages/LeadMagnet.jsx
git commit -m "feat: add LeadMagnet page component with email gate"
```

---

### Task 4: Route Registration

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Add lazy import for LeadMagnet**

In `src/App.jsx`, add after line 78 (the `NotFound` lazy import):

```jsx
const LeadMagnet = lazyRetry(() => import('./pages/LeadMagnet'));
```

- [ ] **Step 2: Add the route**

In the `<Routes>` block, add before the 404 catch-all (before line 138 `<Route path="*"`):

```jsx
{/* Lead Magnets — Gated Resource Pages */}
<Route path="/r/:slug" element={<LeadMagnet />} />
```

- [ ] **Step 3: Verify dev server works**

Run: `npm run dev`

Navigate to `http://localhost:5173/r/test-slug` — should show the loading spinner then "Resource not found" (since no lead magnets exist in Sanity yet). No console errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/rahullalia/lalia/myBusiness/rslaWebsite
git add src/App.jsx
git commit -m "feat: add /r/:slug route for lead magnets"
```

---

### Task 5: Pre-rendering

**Files:**
- Modify: `scripts/prerender.mjs`

- [ ] **Step 1: Fetch lead magnets in the main function**

In `scripts/prerender.mjs`, inside the `main()` function, modify the `Promise.all` (line 1122) to also fetch lead magnets. Add a fourth element to the array:

```javascript
client.fetch(`
  *[_type == "leadMagnet" && status == "published" && defined(slug.current)] {
    title,
    "slug": slug.current,
    description,
    tagline,
    seoTitle,
    seoDescription
  }
`),
```

Update the destructuring on line 1122 from:
```javascript
const [blogPosts, caseStudies, industryPages] = await Promise.all([
```
to:
```javascript
const [blogPosts, caseStudies, industryPages, leadMagnets] = await Promise.all([
```

- [ ] **Step 2: Add the leadMagnetContent helper function**

Add this function before `main()`:

```javascript
function leadMagnetContent(lm) {
  const title = lm.seoTitle || `${lm.title} | RSL/A`;
  const description = lm.seoDescription || lm.description;
  return {
    route: `/r/${lm.slug}`,
    title,
    description,
    canonical: `${SITE}/r/${lm.slug}`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: lm.title,
      description,
      url: `${SITE}/r/${lm.slug}`,
      publisher: { '@type': 'Organization', name: 'RSL/A', url: SITE },
    },
    html: `<main>
<h1>${esc(lm.title)}</h1>
${lm.tagline ? `<p>${esc(lm.tagline)}</p>` : ''}
<p>${esc(lm.description)}</p>
<p>Enter your name and email to get instant access to this resource.</p>
</main>`,
  };
}
```

- [ ] **Step 3: Write lead magnet pages in the main loop**

Add after the industry pages loop (after line 1238):

```javascript
// Individual lead magnet pages
for (const lm of leadMagnets) {
  const page = leadMagnetContent(lm);
  writePage(page.route, inject(template, page));
  count++;
}
```

Update the final log line to include lead magnets:

```javascript
console.log(`Pre-rendered ${count} pages (${staticPages.length} static, 2 listings, ${blogPosts.length} blog posts, ${caseStudies.length} case studies, ${industryPages.length} industry pages, ${leadMagnets.length} lead magnets)`);
```

- [ ] **Step 4: Verify build works**

Run: `npm run build`

Expected: Build completes without errors. Log line shows "0 lead magnets" (none exist yet).

- [ ] **Step 5: Commit**

```bash
cd /Users/rahullalia/lalia/myBusiness/rslaWebsite
git add scripts/prerender.mjs
git commit -m "feat: pre-render lead magnet pages at build time"
```

---

### Task 6: Sitemap

**Files:**
- Modify: `scripts/generateSitemap.mjs`

- [ ] **Step 1: Fetch lead magnet slugs**

In `scripts/generateSitemap.mjs`, inside `generateSitemap()`, add a fourth fetch to the existing parallel fetches. After the `industrySlugs` fetch (line 48-52), add:

```javascript
// Fetch all published lead magnets
const leadMagnetSlugs = await client.fetch(
  `*[_type == "leadMagnet" && status == "published" && defined(slug.current)]{
    "slug": slug.current
  }`
);
```

Note: This can be added to a `Promise.all` if the existing fetches are already parallelized, or kept sequential since sitemap generation is a build-time script and speed is not critical. Looking at the current code, the fetches are sequential — keep it consistent.

- [ ] **Step 2: Add lead magnet URLs to the sitemap**

In the `urls` array construction, add after the industry pages entry:

```javascript
// Lead magnets
...leadMagnetSlugs.map(({ slug }) => ({
  loc: `${SITE_URL}/r/${slug}`,
  lastmod: today,
  priority: '0.5',
})),
```

- [ ] **Step 3: Update the log line**

Update the final `console.log` to include lead magnets:

```javascript
console.log(`Sitemap generated: ${urls.length} URLs (${staticRoutes.length} static, ${blogSlugs.length} blog, ${caseSlugs.length} case studies, ${industrySlugs.length} industry pages, ${leadMagnetSlugs.length} lead magnets)`);
```

- [ ] **Step 4: Verify build works**

Run: `npm run build`

Expected: Sitemap generates without errors. Log shows "0 lead magnets".

- [ ] **Step 5: Commit**

```bash
cd /Users/rahullalia/lalia/myBusiness/rslaWebsite
git add scripts/generateSitemap.mjs
git commit -m "feat: include lead magnet URLs in sitemap"
```

---

### Task 7: End-to-End Test with a Real Lead Magnet

This is a manual verification task. No code changes.

- [ ] **Step 1: Create a test lead magnet in Sanity Studio**

Go to studio.rsla.io (or run `npx sanity dev` locally in rslaStudio).

Create a new Lead Magnet document:
- **Title:** "AI Marketing Checklist"
- **Slug:** `ai-marketing-checklist`
- **Description:** "A step-by-step checklist for implementing AI in your marketing stack."
- **Benefits:** ["10 actionable steps", "Real tools we use with clients", "Takes 30 minutes to implement"]
- **Resource URL:** (a Notion page URL)
- **CTA Button Text:** "Download the checklist"
- **Tagline:** "Free Checklist"
- **Status:** Published

- [ ] **Step 2: Test locally**

Run: `npm run dev`

Navigate to `http://localhost:5173/r/ai-marketing-checklist`

Expected:
- Page loads with FlickeringGrid background
- Tagline "Free Checklist" shown as badge
- Title "AI Marketing Checklist" displayed
- Description and benefits rendered
- Name + email form visible
- Submit button says "Download the checklist"
- Privacy policy link works

- [ ] **Step 3: Test form submission**

Fill in name and email, submit.

Expected:
- Button shows "Sending..."
- Kit API call succeeds (check Network tab)
- Browser redirects to the Notion page URL

- [ ] **Step 4: Test build + prerender**

Run: `npm run build`

Check: `dist/r/ai-marketing-checklist/index.html` exists and contains proper meta tags.
Check: `dist/sitemap.xml` includes `https://rsla.io/r/ai-marketing-checklist`.

---

## Kit Setup (Manual — Not Code)

After the code is deployed, set up the follow-up email automation in Kit:

1. **Create a tag** in Kit for each lead magnet (e.g., "lead-magnet-ai-marketing-checklist")
2. **Note the tag ID** (visible in Kit's tag settings URL)
3. **Paste the tag ID** into the Sanity lead magnet document's `kitTagId` field
4. **Create a Visual Automation** in Kit:
   - Trigger: "Tag is added" → select the tag
   - Action: "Send email" → write an email with subject like "Here's your AI Marketing Checklist" and include the Notion link
5. **Activate** the automation

This ensures every new subscriber tagged with that lead magnet gets the follow-up email with the resource link.
