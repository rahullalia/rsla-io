# Blog Overhaul Design Spec

**Date:** 2026-03-12
**Status:** Approved
**Author:** Rahul Lalia + Claude

---

## Problem

GA4 and Search Console performance dropped starting Feb 26, 2026. Root causes:

1. **Google's February 2026 Discover Core Update** completed Feb 27 — prioritizes original content with topic expertise
2. **Unconfirmed organic ranking volatility** — SEMrush Sensor hit 9.5/10 that week
3. **March 2026 Core Update** rolling out early March — rewards original research, expert commentary, penalizes mass-generated AI content without human insight
4. **Content quality gap** — 60 blogPostV2 posts were AI-generated in bulk. They are structurally sound (SEO metadata, FAQ schema, images, internal links) but lack genuine first-hand experience, authentic voice, and original perspective. Posts read like "well-trained AI writing in a slightly casual tone" rather than Rahul's actual voice.
5. **Authority mismatch** — posts cover topics outside Rahul's expertise zones (cold email, lead gen theory) alongside genuine authority areas (Claude Code, GHL, Local SEO)

## Goal

Transform the blog from 60 generic AI posts into ~20 high-authority, experience-driven posts that rank on Google, get cited by AI engines, and sound like Rahul actually wrote them. Build a sustainable system for all future content.

## Decision

**Approach A: Surgical Triage** (selected over "Nuke and rebuild" and "Light humanization pass")

- Preserves performing URLs and link equity
- Removes content that hurts authority signals
- Injects genuine experience through interview process
- Builds a skill-based system for sustainable future content

---

## Design

### 1. Post Triage System

Classify all 60 posts into three buckets based on two axes: performance (GSC data) and authority fit (Rahul's expertise zones).

| Bucket | Criteria | Action |
|---|---|---|
| **Keep & rewrite** (~20) | In authority zones AND has impressions or targets a keyword worth owning | Deep rewrite with experience injection |
| **Consolidate** (~5 to 10) | Related to authority zones but thin, duplicative, or covering the same ground as a keeper AND has >500 impressions or contains a unique section worth preserving | Merge useful parts into the keeper post, then 301 redirect the original to the keeper (via `vercel.json`) |
| **Noindex** (~25 to 30) | Outside authority zones OR getting zero impressions with no keyword upside | Set `status: "archived"` in Sanity. Website renders `noindex, follow` for archived posts. URL stays alive (avoids 404s). If a post is a consolidation candidate but has <500 impressions and no unique content worth preserving, noindex it instead of consolidating. |

**Authority zones (strongest to adjacent):**
1. Claude Code / AI dev tools (strongest — daily user, builds infrastructure)
2. GoHighLevel / CRM automations (strongest — deep practitioner)
3. Local SEO / GBP optimization (strong — real client work, real results)
4. Marketing automation (strong — hands-on)
5. AEO/GEO (adjacent — growing, keep if tied to SEO)

**Weak zones (candidates for noindex):**
- Cold email / lead gen theory (no proven expertise yet)
- Generic AI for business (unless specific angle Rahul owns)

**Bucket priority (when a post fits multiple buckets):**
If a post qualifies for both Keep and Consolidate, keep the one with higher impressions and consolidate the other. If two posts target the same keyword, keep the one with more genuine experience potential and consolidate the weaker one into it.

**Triage execution:**
1. Pull all 60 posts from Sanity with slugs, titles, categories
2. Rahul pulls GSC export (impressions + clicks, last 3 months)
3. Check external backlink profiles (GSC Links report). Posts with quality external backlinks may be worth keeping even if impressions are low — the backlinks pass authority to the domain.
4. Cross-reference and present a triage table for review
5. Rahul approves bucket assignments before anything is touched

**Noindex mechanism (technical implementation):**

Posts in the Noindex bucket get `status: "archived"` set in Sanity. This drives three behaviors:

1. **`BlogInner.jsx`** — pass `noIndex={post.status === 'archived'}` to the `<Seo>` component. Use `noindex, follow` (not `noindex, nofollow`) so Google still follows outbound links from those pages, which helps the site's link graph.
2. **Blog listing page** — the existing query filters by `status == "published"`. Archived posts are automatically excluded from `rsla.io/blog` listing cards, category pages, and search pages.
3. **`llms.txt`** — `generateLlmsTxt.mjs` already queries `status == "published"`. Archived posts are automatically excluded. The markdown API at `rsla.io/api/llm/[slug]` stays functional (URL alive) but the post won't appear in the llms.txt index that AI engines crawl.
4. **XML sitemap** — if the site has an auto-generated sitemap, archived posts should be excluded. Check the sitemap generation and add a `status == "published"` filter if not already present.

**Consolidate mechanism (technical implementation):**

Posts in the Consolidate bucket get their useful content merged into the keeper post, then:
1. Add a 301 redirect in `vercel.json` from the consolidated slug to the keeper slug
2. Set the consolidated post's `status: "archived"` in Sanity (as backup, since the redirect fires first)
3. Remove the consolidated post from all `relatedPosts` references across keeper posts

---

### 2. Per-Post Rewrite Process

Every keeper post goes through 5 phases. No shortcuts. No batch processing.

**Phase 1: Interview round (~15 min per post)**

Before touching a word, 5 to 7 questions specific to the post's topic. Not generic questions — targeted based on what the current post is missing.

Example for a GBP optimization post:
- "What's the dumbest GBP mistake you've fixed for a client? What happened before vs. after?"
- "You mentioned Spice on a Slice went from invisible to #2. Walk me through what you actually changed."
- "What do you tell a client who says 'I already have a Google listing, why do I need to optimize it?'"
- "What's one thing about GBP that most guides get wrong or skip?"

Rahul answers via Wispr (voice-to-text) or typing. Short answers are fine — 2 to 3 sentences per question is enough.

**Phase 2: Content audit of existing post**

Read the current post and identify:
- Sections that are generic (could appear on any blog) — flagged for replacement
- Sections that already have real value — kept and refined
- AI-slop patterns (definition openings, "this is crucial" filler, formulaic step-by-step) — removed
- Missing first-person experience — where interview answers slot in
- Structural sameness — where the cadence needs to break from the template

**Phase 3: Rewrite**

Not a cosmetic pass. A genuine rewrite where:
- Interview answers become the backbone of key sections
- Generic advice gets replaced with specific "here's what we did for [client]" stories
- The opening leads with a moment, not a concept
- Headings get de-templated (not every post needs "Step 1, Step 2, Step 3")
- Voice DNA phrases show up naturally, not forced
- Word count stays 2,000+ but isn't padded — 1,800 genuine words beats 2,500 padded ones
- Images regenerated where existing ones don't fit the rewritten content

**Phase 4: User review**

Rahul reads the rewritten post and provides feedback:
- "This sounds like me" or "This doesn't sound like me" (with specifics)
- Factual corrections (wrong numbers, wrong tool, wrong client story)
- Anything to add or cut

Revisions based on feedback. Only after approval does it go to Sanity.

**Phase 5: Metadata refresh**

After content is locked:
- Meta title, meta description updated
- FAQ schema refreshed (based on current People Also Ask)
- Keywords updated
- Internal links point only to other keeper posts
- `updatedAt` set to current date
- Verify `status` is set to `"published"` (critical — the schema defaults to "draft", and posts created via scripts can retain that default even after publishing via the API)
- Noindexed posts removed from `relatedPosts` references
- Images regenerated if needed (featured + inline)
- All internal links use full domain format (`https://rsla.io/blog/...` not `/blog/...`) — the portable text converter passes hrefs as-is from markdown

---

### 3. AEO/GEO/SEO Integration

One coherent optimization, not three separate ones. The convergence point: being the most genuinely useful, experience-backed answer to a question.

**Google (SEO):**
- Primary keyword in first 100 words, H1, meta title, slug (existing system works)
- E-E-A-T signals are the new priority: first-person client stories, named tools, specific numbers, dated results — all from interview rounds
- `updatedAt` set on every rewrite
- Internal links only to keeper posts
- Publishing velocity: 2 to 4 posts per month (sustainable, non-suspicious)

**AI engines (AEO):**
- Core question answered in standalone 2 to 3 sentence paragraph near the top (what ChatGPT/Perplexity cite)
- Question-based H2s matching real search patterns
- FAQ schema with 5 items per post (feeds People Also Ask AND AI engine parsing)
- Statistics with named sources and dates
- `llms.txt` auto-excludes archived posts (query already filters by `status == "published"`). Markdown API URLs stay functional but aren't indexed.

**AI citation (GEO):**
- At least one "definitive statement" per post — clear, opinionated, quotable take based on experience
- Entity clarity: every post names Rahul Lalia, RSL/A, and specific tools used
- BlogPosting + FAQPage JSON-LD verified on each rewrite
- Markdown API gives AI engines clean content (competitive advantage)

**What changes from current approach:**

| Current | New |
|---|---|
| SEO metadata thorough but content generic | Content leads with real experience, metadata supports |
| FAQ schema with AI-generated questions | FAQ from actual People Also Ask research |
| AEO paragraphs are generic summaries | AEO paragraphs are opinionated answers with specific experience |
| All 60 posts interlink | Only keeper posts interlink (tighter cluster) |
| 12 posts published in 2 days | 2 to 4 posts per month, each interview-driven |

**What stays unchanged:**
- Image generation pipeline (Imagen 4.0 Fast for featured, Gemini for inline)
- 11 hand-drawn image styles
- Sanity schema and block types
- Markdown API (`rsla.io/api/llm/[slug]`) functional for all posts
- BlogPosting + FAQPage JSON-LD setup

**What changes (previously listed as unchanged):**
- `llms.txt` — no code changes needed, but output changes because archived posts are excluded by the existing `status == "published"` filter. Must regenerate after triage.

---

### 4. Unified Blog Skill

**Location:** `.claude/skills/blogEngine/`

**Structure:**
```
blogEngine/
  skill.md                 # Master skill file (all rules, all processes)
  interviewTemplates.md    # Question banks by topic cluster (5 clusters, 7 to 10 questions each)
  antiPatterns.md          # AI-slop patterns with before/after examples from current 60 posts
  voiceChecklist.md        # Quick-reference voice audit checklist
```

**Interview template clusters (5 banks):**
1. Claude Code / AI dev tools — questions about daily usage, specific builds, agent workflows, tool comparisons from experience
2. GoHighLevel / CRM — questions about client setups, automation wins/fails, pricing realities, GHL vs competitors
3. Local SEO / GBP — questions about client results, category mistakes, review strategies, Maps ranking changes
4. Marketing automation — questions about sequences built, conversion numbers, tools compared, workflows that broke
5. AEO/GEO/SEO — questions about search strategy, what's working in GSC, AI citation observations, content that ranks vs doesn't

Each cluster has 7 to 10 questions. The skill selects 5 to 7 per post based on what the current content is missing.

**`skill.md` contents (unified, single document):**

1. **Voice framework** — references `/brand` (voiceDna.md) as authority. Key rules inline so always loaded. `/brand` MUST be loaded before any writing.
2. **SEO layer** — keyword strategy, meta specs, internal linking rules, publishing velocity
3. **AEO layer** — standalone citable paragraphs, question-based H2s, FAQ schema from real PAA
4. **GEO layer** — definitive statements, entity clarity, structured data verification, markdown API
5. **Interview process** — 5 to 7 question requirement, topic-specific question generation, no post written without user input
6. **Rewrite process** — full Phase 1 through 5 workflow
7. **New post process** — same interview-first flow, starting from blank
8. **Image generation** — when to regenerate, style specs, Imagen/Gemini pipeline
9. **Quality gates** — outline approval before writing, voice audit before presenting, user approval before Sanity
10. **Sanity specs** — schema format, block types, category IDs, author ID, publish workflow
11. **Anti-patterns** — references `antiPatterns.md`
12. **Triage mode** — how to evaluate existing posts for keep/consolidate/noindex

**Three modes:**
- **"Write a new post about [topic]"** — full interview → outline → write → review → publish
- **"Rewrite [slug]"** — pulls existing post, interview round, rewrite with experience injection
- **"Triage the blog"** — pulls all posts, cross-references GSC, presents triage table

**What happens to existing files:**

| File | Action |
|---|---|
| `blogMasterPrompt.md` | Stays for reference, skill supersedes for all blog work |
| `blogWritingGuide.md` | Capitalization/style rules pulled into skill |
| `blogChecklist.md` | Replaced by skill's quality gates |
| `editorialCalendar.md` | Stays, updated after triage for keeper posts only |
| `contentPlan.md` | Archived post-triage |
| `voiceDna.md` | Stays in `4-Resources/brandGuidelines/`, loaded via `/brand` |

---

### 5. Execution Phases

**Phase 1: Triage** (1 session)
- Pull all 60 posts from Sanity with slugs, titles, categories, publishedAt
- Rahul pulls GSC export (impressions + clicks, last 3 months) + check GSC Links for external backlinks
- Cross-reference and present triage table
- Rahul approves bucket assignments

**Phase 2: Build the skill** (1 to 2 sessions)
- Write unified blogEngine skill (skill.md)
- Populate interviewTemplates.md with 5 question banks
- Populate antiPatterns.md from analyzing current 60 posts
- Write voiceChecklist.md
- Test the skill against one post (dry run rewrite, Rahul provides interview answers)

**Phase 3: Noindex and cleanup** (1 session)
- Set `status: "archived"` on all noindex bucket posts in Sanity
- Add 301 redirects in `vercel.json` for consolidated posts
- Update `BlogInner.jsx` to pass `noIndex={post.status === 'archived'}` to Seo component (use `noindex, follow`)
- Check/update sitemap generation to exclude archived posts
- Remove archived posts from all `relatedPosts` references across keeper posts
- Update internal links in keeper posts (remove links to archived/redirected slugs)
- Regenerate `llms.txt` (archived posts auto-excluded by existing filter)
- Deploy website changes

**Phase 4: Rewrite the keepers** (~20 posts, 3 to 5 per week over 4 to 6 weeks)
- One post at a time, each getting full attention
- Interview round with Rahul per post (~15 min)
- Full rewrite with experience injection
- Image regeneration where content changed significantly
- Rahul reviews and approves each post before Sanity publish
- Verify `status: "published"` is explicitly set on each rewrite
- The "2 to 4 posts per month" velocity applies to NEW posts only. Rewrites are updates to existing URLs and don't count toward publishing velocity (Google sees them as refreshed content, not new publications).

**Phase 5: New content going forward** (ongoing)
- All new posts use blogEngine skill
- 2 to 4 genuinely new posts per month
- Interview-first, always
- LinkedIn cross-posting for each published post

**Rollback plan:**
Monitor GSC weekly for 4 weeks after Phase 3 (noindex/cleanup). If impressions drop >30% from the pre-Phase-3 baseline:
1. Pause — do not noindex any more posts
2. Re-evaluate bucket assignments with fresh GSC data
3. Consider reverting specific posts from archived back to published if they were contributing more than expected
The noindex is reversible (just set status back to "published"), so this is low-risk.

---

## Constraints and Commitments

- **No rushing.** Every post gets equal attention and thorough individual review, even when using parallel agents.
- **Interview round is non-negotiable.** No post gets written or rewritten without Rahul's real input.
- **`/brand` loaded before every rewrite.** voiceDna.md is the voice authority, not blogMasterPrompt.md.
- **One post at a time during rewrites.** No batch processing.
- **Rahul approves at every stage.** Triage assignments, outline, rewrite, publish — all gated on approval.
- **Images regenerated where needed.** Not forced, but available for any post where the rewrite changes the content significantly.

---

## Success Criteria

- ~20 keeper posts, each with genuine first-hand experience injected
- Every keeper post passes a voice audit against voiceDna.md
- All noindexed posts removed from interlinks and relatedPosts
- Unified blogEngine skill tested and working for new content
- Publishing cadence drops to 2 to 4 posts per month
- GSC impressions stabilize/recover within 4 to 8 weeks of rewrite completion
- At least one post gets cited by an AI engine within 3 months
