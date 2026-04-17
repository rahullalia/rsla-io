# Blog Overhaul Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform 60 AI-generated blog posts into ~20 high-authority, experience-driven posts and build a sustainable content system (blogEngine skill).

**Architecture:** Five-phase approach: (1) triage all posts via GSC data + authority fit, (2) build the unified blogEngine skill, (3) implement noindex/cleanup in the website codebase, (4) rewrite keeper posts with interview-driven experience injection, (5) ongoing new content via the skill.

**Tech Stack:** Sanity CMS (content), React/Vite website (rslaWebsite repo), Vercel (hosting), Imagen 4.0/Gemini (images), GROQ (queries)

**Spec:** `docs/superpowers/specs/2026-03-12-blog-overhaul-design.md`

---

## Chunk 1: Triage and Skill Building (Tasks 1 through 4)

### Task 1: Pull and organize all 60 posts for triage

**Files:**
- Read: Sanity API (all blogPostV2 documents)
- Create: `docs/triage/postInventory.md` (the triage table)

**Context:** We need all 60 posts with their titles, slugs, categories, publishedAt dates, and status to cross-reference against GSC data. Rahul provides the GSC export separately.

- [ ] **Step 1: Query all blogPostV2 posts from Sanity**

Use the Sanity MCP `query_documents` tool:
```groq
*[_type == "blogPostV2"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  status,
  publishedAt,
  categories[]->{ name },
  "wordCount": length(pt::text(body)),
  "hasRelatedPosts": defined(relatedPosts) && count(relatedPosts) > 0
}
```

- [ ] **Step 2: Map each post to an authority zone**

Based on categories and title/slug, classify each post into one of:
- Claude Code / AI dev tools (strongest)
- GoHighLevel / CRM (strongest)
- Local SEO / GBP (strong)
- Marketing automation (strong)
- AEO/GEO/SEO (adjacent)
- Weak zone (cold email, lead gen, generic AI)

- [ ] **Step 3: Wait for Rahul's GSC data**

Ask Rahul to export from Google Search Console:
- Pages report, last 3 months, sorted by impressions
- Links report (external links by target page)

Provide instructions: GSC > Performance > Search results > Pages tab > Export. And GSC > Links > External links > Top linked pages > Export.

- [ ] **Step 4: Build the triage table**

Create the directory and file:
```bash
mkdir -p docs/triage
```

Create `docs/triage/postInventory.md` with columns:
| # | Title | Slug | Authority Zone | Impressions (3mo) | Clicks (3mo) | External Backlinks | Bucket | Notes |

Apply bucket rules from spec:
- Keep & rewrite: in authority zone AND (has impressions OR targets keyword worth owning)
- Consolidate: related to authority zone, thin/duplicative, AND (>500 impressions OR unique content)
- Noindex: outside authority zone OR zero impressions with no keyword upside

- [ ] **Step 5: Present triage table to Rahul for approval**

Present the table. Wait for Rahul to review and approve/adjust each bucket assignment. Do not proceed until approved.

- [ ] **Step 6: Commit triage table**

```bash
git add docs/triage/postInventory.md
git commit -m "Add blog post triage inventory with bucket assignments"
```

---

### Task 2: Build the blogEngine skill (skill.md)

**Files:**
- Create: `/Users/rahullalia/lalia/.claude/skills/blogEngine/skill.md` (global skill, accessible from any project)

**Context:** This is the unified blog skill that replaces the current blogMasterPrompt.md workflow. It must load `/brand` (voiceDna.md) before any writing, enforce the interview process, and integrate SEO/AEO/GEO in one document. The skill lives at the global workspace level (`~/.claude/skills/`) alongside other global skills like `coldEmailEngine` and `generateProposal`. Note: the rslaStudio project has existing built-in blog skills at `.claude/skills/blog/` (from Superpowers plugin) — these are generic and not RSLA-specific. The new blogEngine skill supersedes them for all rsla.io blog work.

- [ ] **Step 1: Read existing skills for structural pattern**

Read the coldEmailEngine skill at `/Users/rahullalia/lalia/.claude/skills/coldEmailEngine/` to understand frontmatter format, section structure, and how skills reference other commands.

- [ ] **Step 2: Write skill.md**

The file must contain these sections in order:

**Frontmatter:**
```yaml
---
name: blogEngine
description: Write, rewrite, and triage blog posts for rsla.io with interview-driven experience injection, humanized voice, and unified SEO/AEO/GEO optimization
---
```

**Section 1 — Preamble and mode detection:**
- Three modes: write new, rewrite existing, triage
- Auto-detect mode from user input
- HARD GATE: Load `/brand` before any writing mode. Non-negotiable.

**Section 2 — Voice framework:**
- Reference voiceDna.md (`/Users/rahullalia/lalia/4-Resources/brandGuidelines/voiceDna.md`) as the authority
- Inline the key voice rules: conversational, fragments, rhetorical questions, contractions, no corporate speak, no em/en dashes, "to" for ranges
- Inline the "sounds like Rahul" markers: specific numbers, named tools, real outcomes, honest struggles, casual asides
- Inline the "does NOT sound like Rahul" markers: polished press-release style, vague claims, guru energy, motivational poster energy
- Reference `antiPatterns.md` for specific AI-slop examples to avoid
- Reference `voiceChecklist.md` for the quick audit

**Section 3 — Interview process (HARD GATE):**
- No post gets written or rewritten without user input via interview
- Generate 5 to 7 questions specific to the topic, drawn from `interviewTemplates.md`
- Questions must be specific and experience-probing, never generic
- Wait for all answers before proceeding
- Map each answer to the section of the post where it will be used

**Section 4 — Writing process:**
- For new posts: outline first (with experience markers showing where interview answers go), user approves outline, then write
- For rewrites: audit existing post first, identify generic vs valuable sections, then rewrite with experience injection
- Story-first structure: hook, context, challenge, action, result, insight, CTA
- Structural variety: explicitly vary heading patterns across posts (not every post gets "Step 1, Step 2, Step 3")
- Word count: 2,000+ but don't pad. 1,800 genuine words > 2,500 padded words
- All internal links use full domain: `https://rsla.io/blog/...`

**Section 5 — SEO layer:**
- Primary keyword in first 100 words, H1, meta title, slug
- E-E-A-T: first-person stories, named tools, specific numbers, dated results
- Internal links only to keeper posts (reference triage table)
- Publishing velocity: 2 to 4 genuinely NEW posts per month. Rewrites of existing keeper posts do NOT count toward this velocity (Google sees them as refreshed content, not new publications).

**Section 6 — AEO layer:**
- Core question answered in standalone 2 to 3 sentence paragraph near the top
- Question-based H2s matching real search patterns
- FAQ schema: 5 items, from actual People Also Ask research (not AI-generated)
- Statistics with named sources and dates

**Section 7 — GEO layer:**
- At least one "definitive statement" per post: clear, opinionated, quotable take
- Entity clarity: name Rahul Lalia, RSL/A, and specific tools
- Verify BlogPosting + FAQPage JSON-LD
- Note that markdown API at rsla.io/api/llm/[slug] exists

**Section 8 — Image generation:**
- 1 featured (16:9, Imagen 4.0 Fast) + 3 inline (1:1, Gemini)
- 11 hand-drawn styles, rotate through them
- Text-free prompts for featured images
- Regenerate when rewrite changes content significantly

**Section 9 — Quality gates:**
- Gate 1: Interview answers received before writing
- Gate 2: Outline approved before full write
- Gate 3: Voice audit against voiceDna before presenting (check against voiceChecklist.md)
- Gate 4: User reads and approves the post
- Gate 5: Metadata + images complete before Sanity publish

**Section 10 — Sanity specs:**
- Pull schema format, block types, category IDs, author ID from blogMasterPrompt.md
- Verify `status: "published"` is explicitly set
- Full domain internal links in portable text

**Section 11 — Triage mode:**
- How to evaluate posts for keep/consolidate/noindex
- Authority zones and bucket criteria from the spec
- Requires GSC data

**Section 12 — Writing style rules:**
- Pull capitalization, software names, acronyms, hyphenation from blogWritingGuide.md
- Pull pre-publish checklist items from blogChecklist.md
- These are integrated into the quality gates, not a separate step

- [ ] **Step 3: Review the skill against the spec**

Read the spec at `docs/superpowers/specs/2026-03-12-blog-overhaul-design.md` and verify every requirement from the design is present in the skill.

- [ ] **Step 4: Commit**

```bash
git -C /Users/rahullalia/lalia add .claude/skills/blogEngine/skill.md
git -C /Users/rahullalia/lalia commit -m "Add blogEngine skill with interview-driven writing process"
```

---

### Task 3: Build supporting skill files

**Files:**
- Create: `/Users/rahullalia/lalia/.claude/skills/blogEngine/interviewTemplates.md`
- Create: `/Users/rahullalia/lalia/.claude/skills/blogEngine/antiPatterns.md`
- Create: `/Users/rahullalia/lalia/.claude/skills/blogEngine/voiceChecklist.md`

- [ ] **Step 1: Write interviewTemplates.md**

5 question banks, 7 to 10 questions each:

**Cluster 1: Claude Code / AI dev tools**
Questions about: daily usage patterns, specific projects built with Claude Code, agent workflows, MCP server experiences, tool comparisons from hands-on use, CLAUDE.md tricks, debugging stories, things that surprised you

**Cluster 2: GoHighLevel / CRM**
Questions about: client setups (which industries), automation wins and fails, pricing realities vs marketing claims, GHL vs competitors from experience, pipeline configurations, integration headaches, reporting setup, ROI for specific clients

**Cluster 3: Local SEO / GBP**
Questions about: specific client results (before/after numbers), category mistakes found, review management strategies, Maps ranking changes observed, GBP features most businesses miss, audit process, competitor analysis approach

**Cluster 4: Marketing automation**
Questions about: sequences built for clients, conversion numbers from real campaigns, tools compared hands-on, workflows that broke and why, email/SMS automation specifics, trigger configurations, reporting dashboards built

**Cluster 5: AEO/GEO/SEO**
Questions about: what's currently working in GSC, posts that rank vs don't and why you think, AI citation observations, content strategy decisions, keyword research process, how you think about search intent

Each question must be specific and experience-probing. Not "Tell me about GBP" but "What's the worst GBP listing you've ever seen and what was wrong with it?"

- [ ] **Step 2: Write antiPatterns.md**

Analyze the existing 60 posts (sample 5 to 8 across different batches) and document specific AI-slop patterns found. Structure:

For each pattern:
- **Pattern name** (e.g., "Definition opening", "This is crucial filler", "Formulaic step numbering")
- **Before** — actual quote from a current post
- **Why it's a problem** — what makes it sound like AI
- **After** — rewritten version in Rahul's voice

Cover at minimum:
1. Definition openings ("X is the process of...")
2. Filler importance statements ("This is crucial", "This is important because")
3. Formulaic step structures (every post: Step 1, Step 2, Step 3)
4. Generic advice without specifics ("Many businesses find success with...")
5. Hedge words ("It's worth noting that", "It can be argued that")
6. Transition padding ("Now that we've covered X, let's look at Y")
7. Summary restating ("As we've seen, X is important for Y")
8. Same-cadence paragraphs (every paragraph: statement, explanation, conclusion)
9. Missing first-person experience (entire sections with no "I", "we", or client reference)
10. Artificial enthusiasm ("This is where it gets really exciting")

- [ ] **Step 3: Write voiceChecklist.md**

Quick-reference checklist for the voice audit gate. Format as a YES/NO checklist:

```markdown
# Voice Audit Checklist

Run this before presenting any blog post to the user.

## Does it sound like Rahul?
- [ ] Opens with a specific moment, scenario, or observation (not a definition)
- [ ] Contains at least 3 specific numbers (dollar amounts, percentages, timeframes, counts)
- [ ] Names at least 2 specific tools by name
- [ ] Includes at least 1 real client story or personal experience
- [ ] Uses contractions naturally (you'll, we've, it's, don't)
- [ ] Has at least 2 casual asides ("And you know what?", "Here's the thing:", "Honestly?", etc.)
- [ ] No paragraph exceeds 4 sentences
- [ ] Sentences average 12 to 18 words (check a sample of 10 sentences)
- [ ] At least 1 rhetorical question directed at the reader

## Does it NOT sound like AI?
- [ ] No definition openings in any section
- [ ] No "This is crucial/important/key" filler
- [ ] No "Now let's look at" transitions
- [ ] No "As we've seen" summaries
- [ ] No "Many businesses/companies find that" generalizations
- [ ] No em dashes or en dashes
- [ ] No corporate speak (leverage, synergy, optimize, streamline, game-changer, revolutionary, unlock, empower)
- [ ] Heading structure varies from other recent posts (not the same H2 pattern)
- [ ] At least one genuinely opinionated statement (a take only Rahul would have)

## AEO/GEO readiness
- [ ] Core question answered in 2 to 3 standalone sentences near the top
- [ ] At least 1 "definitive statement" (clear opinion backed by experience)
- [ ] Entity clarity: Rahul Lalia and RSL/A named explicitly
- [ ] Statistics have named sources and dates
```

- [ ] **Step 4: Commit all supporting files**

```bash
git -C /Users/rahullalia/lalia add .claude/skills/blogEngine/interviewTemplates.md .claude/skills/blogEngine/antiPatterns.md .claude/skills/blogEngine/voiceChecklist.md
git -C /Users/rahullalia/lalia commit -m "Add blogEngine supporting files: interview templates, anti-patterns, voice checklist"
```

---

### Task 4: Dry-run the skill on one post

**Files:**
- Read: One keeper post from Sanity (pick the post with the highest impressions from the triage)
- No files created (this is a test of the process, not a live rewrite)

**Context:** This tests the full blogEngine workflow end-to-end before committing to all 20 rewrites. The goal is to validate that the interview → rewrite → review process produces content that sounds like Rahul.

- [ ] **Step 1: Load the blogEngine skill**

Invoke the skill and enter rewrite mode with the selected post slug.

- [ ] **Step 2: Load /brand**

Verify voiceDna.md is loaded and accessible.

- [ ] **Step 3: Run the interview round**

Generate 5 to 7 questions from the appropriate cluster in interviewTemplates.md. Present to Rahul. Wait for answers.

- [ ] **Step 4: Audit the existing post**

Read the current post content. Identify generic sections, AI-slop patterns (checking antiPatterns.md), and where interview answers should be injected.

- [ ] **Step 5: Write the rewrite**

Produce the full rewritten post. Run the voice checklist (voiceChecklist.md) before presenting.

- [ ] **Step 6: Present to Rahul for review**

Rahul reads and provides feedback: "sounds like me" vs "doesn't sound like me" with specifics. Iterate if needed.

- [ ] **Step 7: Evaluate the skill**

Based on the dry run, identify any gaps in the skill:
- Were the interview questions good enough?
- Did the rewrite actually sound different from the original?
- Were there anti-patterns that the checklist missed?
- Does the workflow feel manageable for 20 posts?

Update skill files if adjustments needed. Commit any changes.

---

## Chunk 2: Website Code Changes (Tasks 5 through 7)

### Task 5: Implement noindex for archived posts

**Files:**
- Modify: `/Users/rahullalia/lalia/1-Projects/rsl-a/rslaWebsite/src/components/Seo.jsx:74`
- Modify: `/Users/rahullalia/lalia/1-Projects/rsl-a/rslaWebsite/src/pages/BlogInner.jsx:152-160`

**Context:** The Seo component already accepts a `noIndex` prop but currently renders `noindex, nofollow`. The spec requires `noindex, follow`. BlogInner.jsx doesn't pass the `noIndex` prop yet. The GROQ query already fetches `status`.

- [ ] **Step 1: Change Seo.jsx to use `noindex, follow`**

In `/Users/rahullalia/lalia/1-Projects/rsl-a/rslaWebsite/src/components/Seo.jsx`, line 74:

Change:
```js
setOrCreateMeta('name', 'robots', 'noindex, nofollow');
```
To:
```js
setOrCreateMeta('name', 'robots', 'noindex, follow');
```

- [ ] **Step 2: Pass noIndex prop from BlogInner.jsx**

In `/Users/rahullalia/lalia/1-Projects/rsl-a/rslaWebsite/src/pages/BlogInner.jsx`, lines 152-160:

Change:
```jsx
<Seo
    title={seoTitle}
    description={seoDescription}
    canonical={`https://rsla.io/blog/${slug}`}
    ogImage={seoImage}
    ogType="article"
    keywords={seoKeywords}
    jsonLd={jsonLdSchemas}
/>
```
To:
```jsx
<Seo
    title={seoTitle}
    description={seoDescription}
    canonical={`https://rsla.io/blog/${slug}`}
    noIndex={post?.status === 'archived'}
    ogImage={seoImage}
    ogType="article"
    keywords={seoKeywords}
    jsonLd={jsonLdSchemas}
/>
```

- [ ] **Step 3: Verify blog listing already excludes archived posts**

Check the blog listing page GROQ query to confirm it filters by `status == "published"`. If not, add the filter.

- [ ] **Step 4: Check sitemap generation**

Search the website repo for sitemap generation: check for `sitemap.xml`, `sitemap.mjs`, `sitemap.ts`, or any Vite plugin config that generates sitemaps. Known: `dist/sitemap.xml` exists as a build artifact. Check `vite.config.ts` or `package.json` for sitemap plugins. If a sitemap generator exists, verify it filters by `status == "published"`. If no sitemap generation mechanism is found, note this explicitly — it may be manually maintained or generated by an external tool.

- [ ] **Step 5: Commit**

```bash
cd /Users/rahullalia/lalia/1-Projects/rsl-a/rslaWebsite
git add src/components/Seo.jsx src/pages/BlogInner.jsx
git commit -m "Add noindex support for archived blog posts

Archived posts (status: archived) now render noindex, follow
meta tag. Changed from noindex, nofollow to preserve link graph."
```

---

### Task 6: Archive noindex posts and add consolidation redirects

**Files:**
- Modify: Sanity documents (via MCP or HTTP API)
- Modify: `/Users/rahullalia/lalia/1-Projects/rsl-a/rslaWebsite/vercel.json` (for consolidation redirects)

**Context:** After Rahul approves the triage table, set `status: "archived"` on all noindex bucket posts and add 301 redirects for consolidation bucket posts. This task depends on Task 1 (triage approval).

- [ ] **Step 1: Set status to "archived" on all noindex bucket posts**

Use the Sanity HTTP mutation API to batch-update. For each post in the noindex bucket:
```json
{
  "mutations": [
    {
      "patch": {
        "id": "<post-id>",
        "set": { "status": "archived" }
      }
    }
  ]
}
```

Process one post at a time. Verify each mutation succeeds before proceeding.

- [ ] **Step 2: Add 301 redirects for consolidated posts**

For each post in the consolidation bucket, add a redirect entry to `vercel.json`:
```json
{
  "source": "/blog/<consolidated-slug>",
  "destination": "/blog/<keeper-slug>",
  "statusCode": 301
}
```

Add after the existing redirects (currently 9 entries at lines 79-89).

- [ ] **Step 3: Set status to "archived" on consolidated posts**

Same mutation as Step 1, for consolidated posts (backup behavior since redirect fires first).

- [ ] **Step 4: Remove archived posts from relatedPosts across all keeper posts**

For each keeper post, check if `relatedPosts` contains references to any archived/consolidated post. If so, use the Sanity mutation API with JSONPath selectors to remove specific array entries (NOT the entire field):
```json
{
  "mutations": [
    {
      "patch": {
        "id": "<keeper-post-id>",
        "unset": ["relatedPosts[_ref == \"<archived-post-id>\"]"]
      }
    }
  ]
}
```
Important: `unset` without a JSONPath selector would wipe the entire `relatedPosts` array. Always use the `[_ref == "..."]` selector to target individual entries.

- [ ] **Step 5: Update internal links in keeper posts**

Two sub-tasks:

**5a: Fix links pointing to archived/consolidated slugs.**
Scan keeper post body content for links to archived/consolidated slugs. For consolidated posts, update the link to point to the keeper slug. For noindexed posts, remove the link or replace with a link to a relevant keeper post.

**5b: Audit all keeper posts for relative-path internal links.**
Scan all keeper post body content for links using relative paths (`/blog/...`) and convert them to full domain format (`https://rsla.io/blog/...`). The portable text converter passes hrefs as-is, so the source content must have full URLs.

- [ ] **Step 6: Regenerate llms.txt**

Run the `generateLlmsTxt.mjs` script in the website repo. Archived posts are auto-excluded by the existing `status == "published"` filter.

- [ ] **Step 7: Commit website changes**

```bash
cd /Users/rahullalia/lalia/1-Projects/rsl-a/rslaWebsite
git add vercel.json
git commit -m "Add 301 redirects for consolidated blog posts"
```

---

### Task 7: Deploy website changes and verify

**Files:**
- No new files

- [ ] **Step 1: Deploy to Vercel**

Push changes in the website repo to trigger Vercel auto-deploy. Or use Vercel CLI/API.

- [ ] **Step 2: Verify noindex on an archived post**

Visit an archived post URL (e.g., `rsla.io/blog/<archived-slug>`). Inspect page source. Confirm:
- `<meta name="robots" content="noindex, follow">` is present
- The post content still renders (URL alive, not 404)

- [ ] **Step 3: Verify archived posts excluded from blog listing**

Visit `rsla.io/blog`. Confirm archived posts do not appear in the listing cards.

- [ ] **Step 4: Verify consolidation redirects**

Visit a consolidated post URL. Confirm it 301 redirects to the keeper post.

- [ ] **Step 5: Verify llms.txt**

Visit `rsla.io/llms.txt`. Confirm archived posts are not listed.

- [ ] **Step 6: Record GSC baseline**

Note current impressions/clicks for the keeper posts. This is the baseline for the rollback plan.

- [ ] **Step 7: Set up weekly GSC monitoring (rollback plan)**

For 4 weeks after deployment, check GSC weekly. Compare keeper post impressions against the baseline from Step 6. If total impressions drop >30% from baseline:
1. Pause — do not archive any more posts
2. Re-evaluate bucket assignments with fresh GSC data
3. Consider reverting specific posts from `status: "archived"` back to `status: "published"` if they were contributing more than expected

The noindex is fully reversible (just set status back to "published" and redeploy).

---

## Chunk 3: Post Rewrites (Task 8 — repeatable template)

### Task 8: Rewrite keeper posts (repeat for each of ~20 posts)

**Files:**
- Read: Existing post from Sanity (via MCP)
- Modify: Post content in Sanity (via MCP or HTTP API)
- Potentially create: New images via Imagen/Gemini scripts

**Context:** Each rewrite follows the exact same process. This task is a template — execute it once per keeper post, one at a time. Do not batch. Every post gets individual attention.

**Pre-requisite:** blogEngine skill (Task 2) is built and tested (Task 4). Triage is approved (Task 1).

- [ ] **Step 1: Load blogEngine skill and /brand**

Enter rewrite mode. Load voiceDna.md.

- [ ] **Step 2: Pull the existing post from Sanity**

Query by slug. Read the full body content, metadata, FAQ schema, relatedPosts, categories, images.

- [ ] **Step 3: Run interview round**

Generate 5 to 7 targeted questions from the appropriate cluster in interviewTemplates.md. Present to Rahul. Wait for answers via Wispr or typing.

- [ ] **Step 4: Audit the existing post**

Identify:
- Generic sections to replace (flag with interview answers that map here)
- Valuable sections to keep and refine
- AI-slop patterns to remove (check antiPatterns.md)
- Missing first-person experience gaps
- Structural sameness to break

- [ ] **Step 5: Write the rewrite**

Build the post around Rahul's interview answers. Follow all voice, SEO, AEO, GEO rules from the skill. Run the voice checklist before presenting.

- [ ] **Step 6: Present to Rahul for review**

Rahul reads the full rewrite. Provides feedback:
- Voice check: "sounds like me" or specific issues
- Factual corrections
- Content additions or cuts

Iterate until approved.

- [ ] **Step 7: Update metadata**

After content is approved:
- Meta title (under 60 chars, keyword near start)
- Meta description (under 155 chars, keyword + CTA)
- FAQ schema (5 items from current People Also Ask)
- Keywords (5 to 7)
- Internal links (only to other keeper posts, full domain format)
- relatedPosts (2 to 3 keeper posts)
- readingTime (word count / 250)
- updatedAt (set to today)
- Verify status is "published"

- [ ] **Step 8: Regenerate images if needed**

If the rewrite significantly changed the content:
- Regenerate featured image (Imagen 4.0 Fast, 16:9, text-free)
- Regenerate inline images (Gemini, 1:1, hand-drawn styles)
- Upload to Sanity and patch into the document

If content is similar enough, keep existing images.

- [ ] **Step 9: Publish to Sanity**

Patch all changes to the published document. Verify no Sanity validation errors. Confirm the post renders correctly on the live site.

- [ ] **Step 10: Submit to GSC for re-indexing**

Submit the rewritten URL to Google Search Console via: GSC > URL Inspection > paste URL > "Request Indexing". Do this per post after each rewrite. Alternatively, batch-submit all rewritten URLs after completing all rewrites using GSC's URL Inspection tool.

- [ ] **Step 11: Draft LinkedIn post for cross-posting**

For each rewritten post, draft a LinkedIn post that drives traffic back to the blog. Use Rahul's voice (LinkedIn-adapted — slightly more professional but still conversational). The post should stand alone with value, not just "check out my new blog post." Include 1 key insight from the post and end with a question for engagement.

---

## Chunk 4: Ongoing System (Task 9)

### Task 9: Update CLAUDE.md and editorial calendar

**Files:**
- Modify: `/Users/rahullalia/lalia/1-Projects/rsl-a/rslaStudio/CLAUDE.md`
- Modify: `contentStrategy/editorialCalendar.md`
- Archive: `contentStrategy/contentPlan.md`

- [ ] **Step 1: Update CLAUDE.md**

Add to the Blog Writing Rules section:
- Reference the blogEngine skill (at `/Users/rahullalia/lalia/.claude/skills/blogEngine/`) as the primary writing system
- Note that blogMasterPrompt.md is now a technical reference only
- Add the blog overhaul context (triage completed, ~20 keeper posts, noindex applied)
- Note the publishing velocity: 2 to 4 genuinely NEW posts per month (rewrites don't count)
- Note LinkedIn cross-posting workflow for each published post

- [ ] **Step 2: Update editorial calendar**

Remove noindexed/consolidated posts. Keep only keeper posts and planned new posts. Update the publishing schedule to 2 to 4 per month.

- [ ] **Step 3: Archive contentPlan.md**

Move to an archive location or add a note at the top marking it as superseded by the blogEngine skill.

- [ ] **Step 4: Update memory files**

Update the MEMORY.md blog post state section to reflect the new reality:
- Number of keeper posts
- Number of noindexed posts
- Number of consolidated posts with redirects
- blogEngine skill location
- New publishing cadence

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md contentStrategy/editorialCalendar.md contentStrategy/contentPlan.md
git commit -m "Update docs to reflect blog overhaul: blogEngine skill, triage results, new cadence"
```

---

## Execution Order and Dependencies

```
Task 1 (Triage) ──────────────────────────────────┐
                                                    │
Task 2 (Build skill.md) ───┐                       │
Task 3 (Supporting files) ─┤                       │
                            ├─ Task 4 (Dry run) ───┤
                            │                       │
Task 5 (Website noindex) ──┤                       │
                            │                       │
                            └───────────────────── Task 6 (Archive + redirects)
                                                    │
                                                    ├─ Task 7 (Deploy + verify)
                                                    │
                                                    └─ Task 8 (Rewrites, x20, sequential)
                                                        │
                                                        └─ Task 9 (Update docs)
```

**Parallelizable:** Tasks 2+3 and Task 5 can run in parallel (no dependencies). Task 1 blocks Task 6. Task 4 blocks the rewrite phase.

**Sequential:** Task 8 is strictly sequential — one post at a time, each requiring Rahul's interview input and review.

**Human-gated:** Tasks 1, 4, and 8 require Rahul's active participation (GSC data, interview answers, post review).
