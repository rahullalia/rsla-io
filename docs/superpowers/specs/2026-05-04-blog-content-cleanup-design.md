# Blog Content Cleanup & Local SEO Repositioning

**Date:** 2026-05-04
**Goal:** Remove off-topic content, fix broken URLs, rewrite top-performer meta, and reposition rsla.io as a local marketing agency site (California + New York) rather than a developer blog.

---

## Context

- 34 posts currently live on rsla.io/blog
- 16 Sanity-only "zombie" URLs serve wrong content (all render "Best CRM for Hair Stylists" regardless of URL)
- Site-wide CTR is 0.18% despite 213K+ impressions
- Zero posts target local/geo queries
- 131 pages crawled-but-not-indexed (quality signal damage)
- 46 pages with only 1 internal link

## Desired End State

- 15 high-quality posts aligned with RSL/A's 4 services (GHL, SEO, Websites, AI Automations)
- All zombie URLs properly handled (301 or 410)
- All removed posts 301-redirected to preserve link equity
- Top performers get title/meta rewrites for CTR improvement
- Clean sitemap with only live, relevant content
- Internal linking improved across keeper posts

---

## Section 1: Keeper Posts (15)

### GHL Expertise (8 posts)

| Slug | Title | Action |
|---|---|---|
| go-high-level-pricing | GoHighLevel Pricing 2026: What It Actually Costs | Rewrite title/meta for CTR |
| go-high-level-new-features-2025 | GoHighLevel Changelog 2026: Every Update Worth Knowing | Rewrite title/meta for CTR |
| what-is-go-high-level | What Is GoHighLevel? Complete Guide for Service Businesses | Keep as-is |
| gohighlevel-workflow-automations-guide | GoHighLevel Workflow Automations: Complete Beginner's Guide | Keep as-is |
| gohighlevel-funnel-tutorial-high-converting | How to Build a High-Converting Funnel in GoHighLevel | Keep as-is |
| gohighlevel-lead-follow-up-automation | How to Set Up Automated Lead Follow-Up in GoHighLevel | Keep as-is |
| gohighlevel-vs-jobber-home-service-crm | GoHighLevel vs Jobber: Best CRM for Home Service Businesses | Keep as-is |
| gohighlevel-vs-hubspot-comparison | GoHighLevel vs HubSpot: Complete 2026 Comparison | Rewrite for depth (add tables, clear winner rec) |

### Local SEO Proof (2 posts)

| Slug | Title | Action |
|---|---|---|
| how-to-rank-higher-on-google-maps-a-comprehensive-guide | How to Rank Higher on Google Maps | Keep, add internal links |
| google-business-profile-optimization-guide-2026 | Google Business Profile Optimization Guide | Keep, add internal links |

### AI Capability Proof (2 posts)

| Slug | Title | Action |
|---|---|---|
| claude-code-marketing-agency-workflow | How We Use Claude Code to Run a Marketing Agency | Keep as-is |
| ai-marketing-stack-what-we-use | The AI Marketing Stack We Actually Use | Keep as-is |

### Strategic Keeps (3 posts)

| Slug | Title | Action |
|---|---|---|
| claude-code-vs-cowork-vs-claude-app | Claude Code vs Cowork vs Claude Chat | Rewrite title/meta for CTR (70K impressions) |
| aeo-for-local-businesses | AEO for Local Businesses | Keep, add internal links |
| gohighlevel-for-restaurants-fill-tables | GoHighLevel for Restaurants: Fill Tables on Autopilot | Keep as-is |

---

## Section 2: Posts to Remove (19 posts)

All get 301 redirects to the specified target.

### Claude Developer Content (12 posts) → redirect to /blog/claude-code-marketing-agency-workflow

| Slug |
|---|
| is-claude-free-pricing-every-tier |
| how-to-install-claude-code |
| claude-new-features-actually-worth-it |
| anthropic-claude-products-guide |
| claude-agent-sdk-explained |
| anthropic-computer-use-guide |
| claude-code-hooks-automation-guide |
| claude-md-file-ai-context-guide |
| claude-code-vs-cursor-vs-github-copilot |
| claude-code-remote-control-guide |
| what-is-claude-code-guide |
| openclaw-ai-assistant-security-lessons |

### Generic/Off-Topic (5 posts) → redirect to homepage (/)

| Slug |
|---|
| ai-coding-agents-productivity-panic |
| mcp-servers-explained-ai-integrations |
| ai-replacing-google-traffic |
| lead-response-time-how-fast |
| gemini-vs-chatgpt-vs-claude-for-business |

### To Be Replaced by Local Versions (2 posts) → redirect to relevant keeper for now

| Slug | Redirect Target |
|---|---|
| ai-lead-follow-up-system | /blog/gohighlevel-lead-follow-up-automation |
| best-crm-hair-stylists-salon-owners | /blog/gohighlevel-for-restaurants-fill-tables |

---

## Section 3: Zombie Sanity URLs (16 URLs)

These exist in Sanity but either don't appear on the blog listing or render wrong content. Each gets a 301 to the nearest relevant keeper post.

| Zombie Slug | Redirect Target |
|---|---|
| salon-appointment-reminder-automation | /blog/gohighlevel-for-restaurants-fill-tables |
| salon-client-retention-automated-strategies | /blog/gohighlevel-for-restaurants-fill-tables |
| get-more-salon-reviews-automated | /blog/gohighlevel-for-restaurants-fill-tables |
| best-crm-for-hvac-companies | /blog/gohighlevel-vs-jobber-home-service-crm |
| restaurant-sms-marketing-fill-slow-nights | /blog/gohighlevel-for-restaurants-fill-tables |
| gohighlevel-for-salons-setup-guide | /blog/gohighlevel-for-restaurants-fill-tables |
| go-high-level-for-real-estate-agents | /blog/what-is-go-high-level |
| gohighlevel-for-real-estate | /blog/what-is-go-high-level |
| best-crm-solo-real-estate-agent | /blog/what-is-go-high-level |
| automate-real-estate-lead-nurturing | /blog/gohighlevel-lead-follow-up-automation |
| automate-quote-follow-ups-contractors | /blog/gohighlevel-lead-follow-up-automation |
| gohighlevel-for-home-services-guide | /blog/gohighlevel-vs-jobber-home-service-crm |
| cold-emails-not-getting-replies-fix | /blog/ai-marketing-stack-what-we-use |
| why-am-i-losing-leads-5-signs | /blog/gohighlevel-lead-follow-up-automation |
| gohighlevel-vs-keap-crm-comparison | /blog/gohighlevel-vs-hubspot-comparison |
| get-more-restaurant-reviews-google-yelp | /blog/gohighlevel-for-restaurants-fill-tables |

Additionally, these 3 old posts from November 2025 (in Sanity but not on live site):

| Zombie Slug | Redirect Target |
|---|---|
| complete-seo-audit-guide-16-essential-steps-to-boost-your-rankings | /blog/google-business-profile-optimization-guide-2026 |
| boost-support-with-conversational-ai-a-complete-guide | / |
| scale-your-agency-top-no-code-tools-for-marketers-in-2025 | / |
| how-ai-is-revolutionizing-marketing-automation-in-2025 | / |

---

## Section 4: Title/Meta Rewrites (Top Performers)

### go-high-level-pricing (88K impressions, 0.02% CTR, position 8.4)

**Current title:** "GoHighLevel Pricing 2026: What It Actually Costs"
**New title:** "GoHighLevel Pricing 2026: $97, $297, or $497? (Real Cost Breakdown)"
**New meta:** "GHL starts at $97/mo but most businesses need the $297 plan. Here's exactly what each tier includes, hidden costs, and whether it replaces your current stack."

### go-high-level-new-features-2025 (55K impressions, 0.07% CTR, position 5.9)

**Current title:** "GoHighLevel Changelog 2026: Every Update Worth Knowing"
**New title:** "GoHighLevel New Features 2026: Monthly Changelog (Updated May)"
**New meta:** "Every GHL update in 2026, organized by month. AI agents, workflow builder changes, conversation AI upgrades, and what actually matters for your business."

### claude-code-vs-cowork-vs-claude-app (70K impressions, 0.13% CTR, position 7.6)

**Current title:** "Claude Code vs Cowork vs Claude Chat: Which One Actually Wins"
**New title:** "Claude Code vs Claude Desktop (Cowork) vs Claude Chat: Quick Decision Guide"
**New meta:** "Code is for terminal. Desktop is for projects. Chat is for conversations. 30-second guide to picking the right Claude product for your workflow."

---

## Section 5: Internal Linking Improvements

After cleanup, add cross-links between the 15 keeper posts:

**GHL cluster:** Each GHL post links to at least 2 other GHL posts.
- pricing → features, what-is-ghl, vs-hubspot
- features → pricing, workflow-automations
- what-is-ghl → pricing, funnel-tutorial, lead-follow-up
- workflow-automations → funnel-tutorial, lead-follow-up
- funnel-tutorial → lead-follow-up, pricing
- lead-follow-up → workflow-automations, vs-jobber
- vs-jobber → vs-hubspot, what-is-ghl
- vs-hubspot → pricing, vs-jobber
- for-restaurants → lead-follow-up, pricing

**SEO cluster:** Link to each other + to GHL posts where relevant.
- google-maps → gbp-guide, aeo-for-local
- gbp-guide → google-maps, aeo-for-local
- aeo-for-local → google-maps, gbp-guide

**AI capability posts:** Link to GHL posts (shows what you build with the tools).
- claude-code-marketing-agency → ai-marketing-stack, workflow-automations
- ai-marketing-stack → claude-code-marketing-agency, lead-follow-up

**claude-code-vs-cowork:** Link to claude-code-marketing-agency (only internal link needed)

---

## Section 6: Technical Execution Order

The site already runs on `blogPostV2` schema. All 34 live posts are V2 documents queried by
`*[_type == "blogPostV2" && status == "published"]`. The frontend already renders all V2 fields
(pullQuote, keyTakeaways, bottomLine, faqSchema, relatedCaseStudies, relatedPosts) and applies
`noIndex` to archived posts automatically.

### Step 1: Archive 19 posts in Sanity
Set `status: 'archived'` on each post to remove. This:
- Removes them from the blog listing (query filters by status == "published")
- Adds noIndex meta tag (frontend handles this at BlogInner.jsx line 238)
- Keeps the document for potential future reuse

### Step 2: Add 301 redirects in vercel.json
For all 19 archived slugs + 16 zombie V1 URLs. This prevents:
- Users hitting 404s from old bookmarks/links
- Google crawling archived pages and getting noIndex signals (301 is cleaner)
- Loss of any backlink equity pointing to removed posts

### Step 3: Delete V1 zombie documents from Sanity
The 30 `blogPost` (V1 type) documents are invisible to the frontend but still exist in the
dataset. Delete them to keep the CMS clean. They serve no purpose.

### Step 4: Fill V2 SEO fields on 15 keeper posts
For each keeper, fill:
- `seo.metaTitle` (max 60 chars) - optimized SERP title
- `seo.metaDescription` (max 155 chars) - click-driving description
- `pullQuote` (max 200 chars) - TL;DR for AI engines
- `keyTakeaways` (3-7 items) - featured snippet bait
- `bottomLine` (max 300 chars) - definitive conclusion for AEO
- `faqSchema` (3-5 items) - FAQ rich snippets
- `relatedCaseStudies` - link to 1-2 relevant case studies
- `relatedPosts` - link to 1-3 related keeper posts (internal linking)
- `seo.keywords` - up to 10 target keywords

### Step 5: Rewrite title/meta on top 3 performers
Using the V2 `seo.metaTitle` and `seo.metaDescription` fields (separate from H1 title):
- go-high-level-pricing (88K impressions, 0.02% CTR)
- go-high-level-new-features-2025 (55K impressions, 0.07% CTR)
- claude-code-vs-cowork-vs-claude-app (70K impressions, 0.13% CTR)

### Step 6: Clean up pre-rendered content files
Remove the markdown files in `content/posts/` for archived posts. These were part of the old
build-time pre-render system. The site now fetches from Sanity client-side for V2 posts.

### Step 7: Rebuild and deploy
- Rebuild triggers sitemap + RSS + llms.txt regeneration
- New sitemap will only include the 15 published posts
- Deploy to Vercel (auto-deploys from main)

### Step 8: Post-deploy
- Submit updated sitemap to GSC
- Request re-indexing on the 3 posts with new title/meta
- Monitor GSC for crawl errors from the redirected URLs

---

## Section 7: Content Architecture for Future (Post-SEMrush)

When keyword data is available, new content will follow this structure:

**Pillar pages** (city-level): Bakersfield, California, New York
**Cluster posts** (industry + location): salon/restaurant/contractor/medspa + city
**Supporting posts** (problem-aware + location): lead gen, automation, reviews + location
**Case studies** (with geo signals): existing 8 case studies referenced throughout

Funnel ratio: 60% BOFU, 30% MOFU, 10% already covered by keepers.
Publishing cadence: 2x/week during buildout, 1x/week maintenance.

---

## Success Metrics

| Metric | Before Cleanup | After Cleanup (30d) | After New Content (90d) |
|---|---|---|---|
| Live posts | 34 + 16 zombies | 15 (clean) | 25-30 |
| Indexed pages | 52 (declining) | 15-20 (intentional) | 35-40 (growing) |
| Pages with 1 internal link | 46 | <10 | <5 |
| Site-wide CTR | 0.18% | 1%+ | 2%+ |
| Organic clicks/month | ~80 | 150+ | 500+ |
| Local keyword rankings | 0 | 0 (content not written yet) | multiple top-10 |
