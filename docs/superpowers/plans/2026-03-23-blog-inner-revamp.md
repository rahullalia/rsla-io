# Blog Inner Page Revamp — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Revamp BlogInner.jsx with a cleaner editorial layout — linear header flow, sticky sidebar ToC, Caveat blockquotes, proper heading hierarchy, BreadcrumbList schema.

**Architecture:** Single-column header (title, author, TL;DR, image) flows into a two-column grid (sticky sidebar ToC + body content) on desktop. Mobile collapses to single column with inline ToC after the featured image. All existing Sanity data fields are reused (no schema changes).

**Tech Stack:** React 19, Vite, Tailwind CSS v3.4, GSAP (ScrollTrigger not used here — IntersectionObserver instead), Sanity CMS (PortableText), self-hosted WOFF2 fonts.

**Spec:** `docs/superpowers/specs/2026-03-23-blog-inner-revamp-design.md`

---

### Task 1: Font Swap — Replace Cormorant Garamond with Caveat

**Files:**
- Create: `public/fonts/Caveat-Medium.woff2`
- Modify: `src/index.css:145-160` (remove Cormorant Garamond, add Caveat)
- Modify: `tailwind.config.js:101` (change `quote` font family)
- Delete: `public/fonts/CormorantGaramond-Regular.woff2`
- Delete: `public/fonts/CormorantGaramond-Italic.woff2`

- [ ] **Step 1: Download Caveat Medium WOFF2**

```bash
cd /Users/rahullalia/lalia/1-Projects/rsl-a/rslaWebsite
curl -L "https://fonts.gstatic.com/s/caveat/v18/WnznHAc5bAfYB2Q7azYpiN_EYPhb.woff2" -o public/fonts/Caveat-Medium.woff2
```

Verify: file exists and is ~17KB.

- [ ] **Step 2: Replace Cormorant Garamond with Caveat in index.css**

Replace lines 145-160 in `src/index.css` (the two Cormorant Garamond `@font-face` blocks) with:

```css
/* Caveat @font-face declaration */
@font-face {
  font-family: 'Caveat';
  src: url('/fonts/Caveat-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
```

- [ ] **Step 3: Update tailwind.config.js font family**

Change line 101 from:
```js
quote: ['"Cormorant Garamond"', "serif"],
```
to:
```js
quote: ["Caveat", "cursive"],
```

- [ ] **Step 4: Delete old Cormorant Garamond font files**

```bash
rm public/fonts/CormorantGaramond-Regular.woff2 public/fonts/CormorantGaramond-Italic.woff2
```

- [ ] **Step 5: Verify build still works**

```bash
npm run build
```

Expected: Build succeeds with no errors. No component currently uses `font-quote` so nothing breaks.

- [ ] **Step 6: Commit**

```bash
git add public/fonts/Caveat-Medium.woff2 src/index.css tailwind.config.js
git commit -m "feat(fonts): replace Cormorant Garamond with Caveat for pull quotes"
```

---

### Task 2: Update PortableTextRenderer — Heading Hierarchy and Blockquote Font

**Files:**
- Modify: `src/components/blog/PortableTextRenderer.jsx:349-379` (h2, h3, blockquote blocks)

- [ ] **Step 1: Update H2 block renderer**

Replace the `h2` block handler (lines 349-361) with:

```jsx
h2: ({ children }) => {
    let text = '';
    if (Array.isArray(children)) {
        text = children.map(c => typeof c === 'string' ? c : (c.props?.text || '')).join('');
    } else if (typeof children === 'string') {
        text = children;
    }
    const id = slugify(text);
    return (
        <h2 id={id} className="text-2xl font-body font-bold text-text mt-12 mb-4 scroll-mt-32">
            {children}
        </h2>
    );
},
```

Key change: was `font-mono text-xs text-accent uppercase` (tiny label), now `text-2xl font-body font-bold` (real heading).

- [ ] **Step 2: Update H3 block renderer**

Replace the `h3` block handler (lines 363-371) with:

```jsx
h3: ({ children }) => {
    let text = '';
    if (Array.isArray(children)) {
        text = children.map(c => typeof c === 'string' ? c : (c.props?.text || '')).join('');
    } else if (typeof children === 'string') {
        text = children;
    }
    const id = slugify(text);
    return <h3 id={id} className="text-lg text-text mt-8 mb-3 font-body font-semibold scroll-mt-32">{children}</h3>;
},
```

- [ ] **Step 3: Update blockquote renderer**

Replace the `blockquote` block handler (lines 375-379) with:

```jsx
blockquote: ({ children }) => (
    <blockquote className="border-l-[3px] border-accent pl-6 my-10 font-quote text-[28px] lg:text-[28px] text-[24px] text-text leading-[1.4]">
        {children}
    </blockquote>
),
```

Wait — Tailwind processes the last matching class. Use responsive prefix properly:

```jsx
blockquote: ({ children }) => (
    <blockquote className="border-l-[3px] border-accent pl-6 my-10 font-quote text-2xl lg:text-[28px] text-text leading-[1.4]">
        {children}
    </blockquote>
),
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: Build succeeds. Blog posts will now show real headings and Caveat blockquotes.

- [ ] **Step 5: Commit**

```bash
git add src/components/blog/PortableTextRenderer.jsx
git commit -m "feat(blog): update heading hierarchy and blockquote font to Caveat"
```

---

### Task 3: Add showLabel Prop to ShareBar

**Files:**
- Modify: `src/components/ShareBar.jsx:33,78` (add prop, conditionally render label)

- [ ] **Step 1: Add showLabel prop**

Change the function signature on line 33 from:
```jsx
export default function ShareBar({ title, url }) {
```
to:
```jsx
export default function ShareBar({ title, url, showLabel = true }) {
```

- [ ] **Step 2: Conditionally render the label**

Change line 78 from:
```jsx
<span className="font-mono text-[10px] uppercase tracking-widest text-textLight mr-2">Share</span>
```
to:
```jsx
{showLabel && <span className="font-mono text-[10px] uppercase tracking-widest text-textLight mr-2">Share</span>}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: Build succeeds. WorkInner.jsx still shows label (default true). BlogInner will pass `showLabel={false}` in the next task.

- [ ] **Step 4: Commit**

```bash
git add src/components/ShareBar.jsx
git commit -m "feat(ShareBar): add showLabel prop for sidebar usage"
```

---

### Task 4: Rewrite BlogInner.jsx — New Layout

This is the core task. Complete rewrite of the page layout.

**Files:**
- Modify: `src/pages/BlogInner.jsx` (complete rewrite)

- [ ] **Step 1: Rewrite BlogInner.jsx**

Replace the entire file with the new layout. The data fetching logic (lines 13-90) stays identical. The render output changes completely.

```jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import { client } from '../sanity/lib/client';
import { blogPostBySlugV2Query, relatedCaseStudyForBlogQuery, featuredCaseStudyFallbackQuery } from '../sanity/lib/queries';
import { urlForImage } from '../sanity/lib/image';
import { PortableTextComponents, slugify } from '../components/blog/PortableTextRenderer';
import Seo from '../components/Seo';
import InlineNewsletterCta from '../components/blog/InlineNewsletterCta';
import ShareBar from '../components/ShareBar';

function useActiveHeading(headingIds) {
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        if (!headingIds.length) return;
        setActiveId(headingIds[0]);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
        );

        headingIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [headingIds]);

    return activeId;
}

export default function BlogInner() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [relatedCaseStudy, setRelatedCaseStudy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [headings, setHeadings] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const fetchPostData = async () => {
            setLoading(true);
            try {
                let fetchedPost = await client.fetch(blogPostBySlugV2Query, { slug });

                if (!fetchedPost && isMounted) {
                    setPost(null);
                    setLoading(false);
                    return;
                }

                if (isMounted) {
                    setPost(fetchedPost);

                    // Extract headings for ToC
                    if (fetchedPost.showTableOfContents && fetchedPost.body) {
                        const h2s = fetchedPost.body
                            .filter((block) => block._type === 'block' && block.style === 'h2')
                            .map((block) => {
                                const text = (block.children || []).map((c) => c.text || '').join('');
                                return { text, id: slugify(text) };
                            })
                            .filter((h) => h.text);
                        if (h2s.length >= 2) setHeadings(h2s);
                    }
                }

                // Fetch related case study (same logic as before)
                let caseStudy = fetchedPost.relatedCaseStudies?.[0] || null;

                if (!caseStudy) {
                    const categorySlugs = fetchedPost.categories?.map((c) => c.slug?.current).filter(Boolean) || [];
                    const BLOG_SLUG_TO_CASE_CATEGORY = {
                        'ai-automation': ['AI Automation'],
                        'marketing-automation': ['Marketing', 'AI Automation'],
                        'lead-nurture': ['AI Automation', 'Marketing'],
                        'crm': ['CRM & Operations'],
                        'go-high-level': ['CRM & Operations'],
                        'business-tools': ['CRM & Operations', 'Development'],
                        'google-reviews': ['Marketing'],
                        'reputation-management': ['Marketing'],
                        'sms-marketing': ['Marketing'],
                        'salons': ['Marketing'],
                        'restaurant': ['Marketing'],
                        'real-estate': ['Marketing'],
                        'home-services': ['CRM & Operations'],
                        'hvac': ['CRM & Operations'],
                        'contractors': ['AI Operations'],
                        'small-business': ['AI Lead Generation', 'AI Automations'],
                        'hair-stylists': ['AI Lead Generation'],
                        'ai-lead-generation': ['AI Lead Generation'],
                        'ai-automations': ['AI Automations'],
                        'ai-operations': ['AI Operations'],
                        'tools-and-tech': ['AI Automations', 'AI Operations'],
                        'founder-diaries': ['AI Lead Generation'],
                    };

                    const categoryNames = [...new Set(categorySlugs.flatMap((s) => BLOG_SLUG_TO_CASE_CATEGORY[s] || []))];

                    if (categoryNames.length > 0) {
                        caseStudy = await client.fetch(relatedCaseStudyForBlogQuery, { categoryNames });
                    }
                }

                if (!caseStudy) {
                    caseStudy = await client.fetch(featuredCaseStudyFallbackQuery);
                }

                if (isMounted) setRelatedCaseStudy(caseStudy);

            } catch (error) {
                console.error("Error fetching article:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchPostData();
        window.scrollTo(0, 0);

        return () => { isMounted = false; };
    }, [slug]);

    const headingIds = headings.map((h) => h.id);
    const activeId = useActiveHeading(headingIds);

    if (loading) {
        return (
            <div className="min-h-screen bg-surface pt-32 pb-24 flex items-center justify-center">
                <div className="font-mono text-accent animate-pulse">[FETCHING_ARTICLE...]</div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-surface pt-32 pb-24 flex flex-col items-center justify-center">
                <h1 className="text-4xl font-sans font-bold text-text mb-4">404 - Article Not Found</h1>
                <Link to="/blog" className="text-accent hover:underline font-mono">← Back to Blog</Link>
            </div>
        );
    }

    const imageUrl = post.featuredImage?.asset ? urlForImage(post.featuredImage.asset)?.width(1600).height(900).url() : null;
    const seoDescription = post.seo?.metaDescription || post.excerpt || (post.body?.[0]?.children?.[0]?.text || '').slice(0, 160);
    const seoTitle = post.seo?.metaTitle ? `${post.seo.metaTitle} | RSL/A` : `${post.title} | RSL/A`;
    const seoImage = post.seo?.socialImage?.asset?.url || imageUrl || 'https://rsla.io/og-image.png';
    const seoKeywords = post.seo?.keywords?.join(', ') || null;
    const firstCategory = post.categories?.[0] || null;

    const blogPostingSchema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.seo?.metaTitle || post.title,
        description: seoDescription,
        image: seoImage !== 'https://rsla.io/og-image.png' ? seoImage : undefined,
        datePublished: post.publishedAt,
        ...(post.updatedAt && { dateModified: post.updatedAt }),
        author: {
            '@type': 'Person',
            name: post.author?.name || 'Rahul Lalia',
        },
        publisher: {
            '@type': 'Organization',
            name: 'RSL/A',
            logo: { '@type': 'ImageObject', url: 'https://rsla.io/images/logo/lockup-nobg.webp' },
        },
        mainEntityOfPage: `https://rsla.io/blog/${slug}`,
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Blog', item: 'https://rsla.io/blog' },
            { '@type': 'ListItem', position: 2, name: post.title },
        ],
    };

    const faqSchema = post.faqSchema?.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faqSchema.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    } : null;

    const jsonLdSchemas = [blogPostingSchema, breadcrumbSchema, ...(faqSchema ? [faqSchema] : [])];

    return (
        <article className="min-h-screen bg-surface text-text pt-32 pb-24 relative">
            <Seo
                title={seoTitle}
                description={seoDescription}
                canonical={`https://rsla.io/blog/${slug}`}
                ogImage={seoImage}
                ogType="article"
                keywords={seoKeywords}
                jsonLd={jsonLdSchemas}
                noIndex={post?.status === 'archived'}
            />

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="px-6 md:px-8 py-4 border-b border-accent-border">
                <div className="max-w-5xl mx-auto flex items-center gap-2">
                    <Link to="/blog" className="font-mono text-xs uppercase tracking-wider text-textMuted hover:text-accent transition-colors">
                        Blog
                    </Link>
                    {firstCategory && (
                        <>
                            <span className="text-textLight text-xs">/</span>
                            <span className="font-mono text-xs uppercase tracking-wider text-textLight">
                                {firstCategory.name}
                            </span>
                        </>
                    )}
                </div>
            </nav>

            {/* Article Header — centered, narrow */}
            <header className="max-w-[720px] mx-auto px-6 pt-16">
                {firstCategory && (
                    <span className="inline-block font-mono text-[11px] uppercase tracking-widest text-accent bg-accent-light border border-accent-border-strong px-3 py-1 rounded-full mb-5">
                        {firstCategory.name}
                    </span>
                )}

                <h1 className="text-4xl md:text-5xl font-sans font-bold leading-tight tracking-tight text-text mb-6">
                    {post.title}
                </h1>

                {/* Author line */}
                <div className="flex items-center gap-3 mb-6">
                    {post.author?.image?.asset && (
                        <img
                            src={urlForImage(post.author.image.asset)?.width(100).height(100).url()}
                            alt={post.author.name}
                            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                            width="36"
                            height="36"
                        />
                    )}
                    <div>
                        <div className="font-body font-semibold text-sm text-text">{post.author?.name || 'Rahul Lalia'}</div>
                        <div className="font-mono text-xs text-textMuted flex items-center gap-2">
                            <time dateTime={post.publishedAt}>
                                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                    month: 'short', day: 'numeric', year: 'numeric'
                                })}
                            </time>
                            {post.readingTime && (
                                <>
                                    <span className="text-textLight">&middot;</span>
                                    <span>{post.readingTime} min read</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* TL;DR */}
                {post.pullQuote && (
                    <div className="mb-8">
                        <span className="block font-mono text-xs font-semibold uppercase tracking-wider text-accent mb-2">TL;DR</span>
                        <p className="text-base text-textMuted leading-relaxed font-body">{post.pullQuote}</p>
                    </div>
                )}
            </header>

            {/* Featured Image */}
            {imageUrl && (
                <div className="max-w-[720px] mx-auto px-6 mb-12">
                    <div className="w-full aspect-video rounded-2xl overflow-hidden bg-surfaceAlt border border-accent-border">
                        <img
                            src={imageUrl}
                            alt={post.featuredImage?.alt || post.title}
                            className="w-full h-full object-cover"
                            width="1600"
                            height="900"
                        />
                    </div>
                </div>
            )}

            {/* Mobile ToC (visible < lg only) */}
            {headings.length > 0 && (
                <div className="lg:hidden max-w-[720px] mx-auto px-6 mb-8">
                    <nav aria-label="Table of contents" className="bg-surfaceAlt border border-accent-border rounded-xl p-4">
                        <span className="block font-mono text-xs font-semibold uppercase tracking-wider text-accent mb-3">In this article</span>
                        <ul className="space-y-1">
                            {headings.map((h) => (
                                <li key={h.id}>
                                    <a
                                        href={`#${h.id}`}
                                        className="block text-sm text-textMuted hover:text-accent transition-colors py-1 pl-3 border-l-2 border-transparent hover:border-accent"
                                    >
                                        {h.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            )}

            {/* Main layout: sidebar + content */}
            <div className="max-w-5xl mx-auto px-6 lg:grid lg:grid-cols-[200px_1fr] lg:gap-16">

                {/* Sidebar (desktop only) — always renders for share buttons, ToC conditional */}
                <aside className="hidden lg:block relative">
                    <div className="sticky top-8">
                        {headings.length > 0 && (
                            <nav aria-label="Table of contents">
                                <span className="block font-mono text-xs font-semibold uppercase tracking-wider text-textLight mb-4">In this article</span>
                                <ul className="space-y-1">
                                    {headings.map((h) => (
                                        <li key={h.id}>
                                            <a
                                                href={`#${h.id}`}
                                                aria-current={activeId === h.id ? 'true' : undefined}
                                                className={`block text-[13px] leading-snug py-1.5 pl-3 border-l-2 transition-all ${
                                                    activeId === h.id
                                                        ? 'border-accent text-accent font-medium'
                                                        : 'border-transparent text-textMuted hover:text-accent hover:border-accent'
                                                }`}
                                            >
                                                {h.text}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        )}

                        <div className={headings.length > 0 ? 'mt-8 pt-6 border-t border-accent-border' : ''}>
                            <span className="block font-mono text-xs font-semibold uppercase tracking-wider text-textLight mb-3">Share</span>
                            <ShareBar title={post.title} url={`https://rsla.io/blog/${slug}`} showLabel={false} />
                        </div>
                    </div>
                </aside>

                {/* Article Body */}
                <div className="max-w-2xl">
                    <div className="prose-container max-w-none">
                        <PortableText value={post.body} components={PortableTextComponents} />
                    </div>

                    {/* Newsletter CTA */}
                    <InlineNewsletterCta />

                    {/* Mobile share (visible < lg only, after content) */}
                    <div className="lg:hidden mt-8 pt-6 border-t border-accent-border">
                        <ShareBar title={post.title} url={`https://rsla.io/blog/${slug}`} />
                    </div>
                </div>
            </div>

            {/* Related Posts */}
            {post.relatedPosts && post.relatedPosts.length > 0 && (
                <div className="max-w-5xl mx-auto px-6 mt-20 mb-16">
                    <h3 className="text-2xl font-sans font-bold text-text mb-8">Read Next</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {post.relatedPosts.map((related) => {
                            const relatedImg = related.featuredImage?.asset
                                ? urlForImage(related.featuredImage.asset)?.width(400).height(260).url()
                                : null;
                            return (
                                <Link
                                    key={related._id}
                                    to={`/blog/${related.slug.current}`}
                                    className="group flex flex-col bg-surface rounded-xl border border-accent-border overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    {relatedImg && (
                                        <div className="aspect-[3/2] overflow-hidden bg-surfaceAlt">
                                            <img
                                                src={relatedImg}
                                                alt={related.featuredImage?.alt || related.title}
                                                loading="lazy"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <h4 className="font-body font-semibold text-[15px] tracking-tight mb-2 group-hover:text-accent transition-colors line-clamp-2">
                                            {related.title}
                                        </h4>
                                        <div className="font-mono text-xs text-textMuted flex items-center gap-2">
                                            <time dateTime={related.publishedAt}>
                                                {new Date(related.publishedAt).toLocaleDateString('en-US', {
                                                    month: 'short', day: 'numeric', year: 'numeric'
                                                })}
                                            </time>
                                            {related.readingTime && (
                                                <>
                                                    <span className="text-textLight">&middot;</span>
                                                    <span>{related.readingTime} min</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Related Case Study */}
            {relatedCaseStudy && (
                <div className="max-w-5xl mx-auto px-6 mb-16">
                    <div className="bg-surfaceAlt border border-accent-border rounded-2xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                        <div className="max-w-xl">
                            <span className="block font-mono text-xs font-semibold uppercase tracking-wider text-accent mb-2">See It In Action</span>
                            <h4 className="text-xl font-sans font-bold text-text mb-2">{relatedCaseStudy.title}</h4>
                            <p className="text-sm text-textMuted font-body leading-relaxed mb-6">{relatedCaseStudy.description}</p>

                            {relatedCaseStudy.metrics && relatedCaseStudy.metrics.length > 0 && (
                                <div className="flex gap-6 mb-6 border-l-2 border-accent pl-6">
                                    {relatedCaseStudy.metrics.slice(0, 2).map((metric, idx) => (
                                        <div key={idx}>
                                            <strong className="block text-2xl font-bold text-text">{metric.value}</strong>
                                            <span className="text-[10px] font-mono text-accent uppercase tracking-wider">{metric.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <Link
                                to={`/work/${relatedCaseStudy.slug}`}
                                className="inline-flex items-center gap-3 px-6 py-3 bg-accent text-white font-sans font-bold rounded-full hover:scale-105 transition-transform"
                            >
                                Read Case Study <span>→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </article>
    );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 3: Dev server visual check**

```bash
npm run dev
```

Navigate to a blog post (e.g., `/blog/how-ai-automations-save-small-businesses`). Verify:
- Breadcrumb shows at top
- Title is large and bold (no animation)
- Author line is compact (avatar + name + date)
- TL;DR shows as plain text with accent label (if post has pullQuote)
- Featured image renders (if post has one)
- Sticky sidebar ToC appears on desktop (if showTableOfContents is true and 2+ H2s)
- ToC highlights active section on scroll
- Share buttons in sidebar
- Mobile: sidebar hidden, inline ToC after image, share bar after content
- Related posts grid at bottom
- Case study banner at bottom

- [ ] **Step 4: Commit**

```bash
git add src/pages/BlogInner.jsx
git commit -m "feat(blog): rewrite BlogInner with editorial layout and sticky sidebar ToC"
```

---

### Task 5: Update prerender.mjs — New Blog Post HTML Structure

**Files:**
- Modify: `scripts/prerender.mjs:480-523` (blogPostContent function)
- Modify: `scripts/prerender.mjs:651-663` (Sanity query — add pullQuote field)

- [ ] **Step 1: Add pullQuote to the Sanity query**

In the blog posts fetch query (around line 651-663), add `pullQuote` to the field list after `excerpt`:

```
excerpt,
pullQuote,
publishedAt,
```

- [ ] **Step 2: Update blogPostContent function**

Replace the `blogPostContent` function (lines 480-524) with:

```js
function blogPostContent(post) {
  const title = post.seo?.metaTitle ? `${post.seo.metaTitle} | RSL/A` : `${post.title} | RSL/A`;
  const description = post.seo?.metaDescription || post.excerpt || '';
  const canonical = `${SITE}/blog/${post.slug}`;
  const ogImage = post.seo?.socialImage?.asset?.url || post.featuredImage?.asset?.url || null;

  const jsonLd = [
    {
      '@context': 'https://schema.org', '@type': 'BlogPosting',
      headline: post.title,
      description,
      datePublished: post.publishedAt,
      author: { '@type': 'Person', name: post.author?.name || 'Rahul Lalia' },
      publisher: { '@type': 'Organization', name: 'RSL/A', url: SITE },
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Blog', item: `${SITE}/blog` },
        { '@type': 'ListItem', position: 2, name: post.title },
      ],
    },
  ];

  if (post.faqSchema?.length) {
    jsonLd.push({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: post.faqSchema.map(f => ({
        '@type': 'Question', name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    });
  }

  const bodyHtml = ptToHtml(post.body);
  const date = formatDate(post.publishedAt);
  const firstCat = (post.categories || [])[0];

  return {
    route: `/blog/${post.slug}`,
    title,
    description,
    canonical,
    ogImage,
    jsonLd,
    html: `<main><article>
<nav aria-label="Breadcrumb"><a href="/blog">Blog</a>${firstCat ? ` / ${esc(firstCat.name)}` : ''}</nav>
<header>
<h1>${esc(post.title)}</h1>
<p><time datetime="${post.publishedAt}">${date}</time>${post.author?.name ? ` — By ${esc(post.author.name)}` : ''}</p>
${post.pullQuote ? `<p><strong>TL;DR:</strong> ${esc(post.pullQuote)}</p>` : ''}
</header>
${bodyHtml}
</article></main>`,
  };
}
```

- [ ] **Step 3: Verify build (includes prerender)**

```bash
npm run build
```

Expected: Build succeeds. Pre-rendered blog posts now have breadcrumb nav, header wrapper, TL;DR, and BreadcrumbList JSON-LD.

- [ ] **Step 4: Spot-check a pre-rendered file**

```bash
head -100 dist/blog/how-ai-automations-save-small-businesses/index.html | grep -E "(Breadcrumb|BreadcrumbList|TL;DR|<nav|<header|<article)"
```

Expected: Should see `<nav aria-label="Breadcrumb">`, `<header>`, `<article>`, and `BreadcrumbList` in the JSON-LD script tag.

- [ ] **Step 5: Commit**

```bash
git add scripts/prerender.mjs
git commit -m "feat(prerender): update blog post HTML with breadcrumb, header, TL;DR, BreadcrumbList schema"
```

---

### Task 6: Final QA and Cleanup

**Files:** None new — visual verification only.

- [ ] **Step 1: Full build and deploy preview**

```bash
npm run build
```

Verify no warnings about missing fonts or unused CSS.

- [ ] **Step 2: Desktop QA checklist**

Open dev server. Check 3 different blog posts:
1. A post WITH featured image, pullQuote, showTableOfContents, and 3+ H2s
2. A post WITHOUT featured image or pullQuote
3. A post with showTableOfContents but fewer than 2 H2s

For each, verify:
- [ ] Breadcrumb renders correctly
- [ ] Title is large, bold, no animation
- [ ] Author line is compact
- [ ] TL;DR renders when pullQuote exists, hidden when empty
- [ ] Featured image renders when present, layout fine without it
- [ ] Sticky sidebar ToC appears when applicable
- [ ] ToC active state highlights on scroll
- [ ] Share buttons in sidebar work
- [ ] Body H2s are real headings (24px bold), not tiny mono labels
- [ ] Blockquotes use Caveat font
- [ ] Newsletter CTA renders mid-article
- [ ] Related posts render at bottom
- [ ] Case study banner renders at bottom

- [ ] **Step 3: Mobile QA checklist**

Resize browser to mobile width (375px). Same 3 posts:
- [ ] Sidebar hidden
- [ ] Inline ToC appears after featured image (when applicable)
- [ ] Share bar appears after article content
- [ ] Blockquotes scale to 24px
- [ ] No horizontal overflow
- [ ] All touch targets 44px+

- [ ] **Step 4: SEO verification**

View page source or inspect. Verify:
- [ ] JSON-LD contains BlogPosting, BreadcrumbList (and FAQPage if applicable)
- [ ] `<time>` has `datetime` attribute
- [ ] `<nav aria-label="Breadcrumb">` exists
- [ ] `<nav aria-label="Table of contents">` exists (when ToC shown)
- [ ] H1 > H2 > H3 hierarchy is correct
- [ ] No duplicate H1s

- [ ] **Step 5: Commit any final fixes**

If any issues found during QA, fix and commit:

```bash
git add -A
git commit -m "fix(blog): QA fixes for blog inner page revamp"
```
