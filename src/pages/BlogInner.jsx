import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import { client } from '../sanity/lib/client';
import { blogPostBySlugV2Query, relatedCaseStudyForBlogQuery, featuredCaseStudyFallbackQuery, relatedBlogPostsByCategoryQuery } from '../sanity/lib/queries';
import { urlForImage } from '../sanity/lib/image';
import { PortableTextComponents, slugify } from '../components/blog/PortableTextRenderer';
import Seo from '../components/Seo';
import InlineNewsletterCta from '../components/blog/InlineNewsletterCta';
import ShareBar from '../components/ShareBar';

function useActiveHeading(headingIds) {
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        if (!headingIds.length) return;

        const handleScroll = () => {
            let current = headingIds[0];
            for (const id of headingIds) {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top <= 140) {
                    current = id;
                }
            }
            setActiveId(current);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
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

                // Fetch category-based related posts if none were manually curated
                if ((!fetchedPost.relatedPosts || fetchedPost.relatedPosts.length === 0) && isMounted) {
                    const categorySlugsForRelated = fetchedPost.categories?.map((c) => c.slug?.current).filter(Boolean) || [];
                    if (categorySlugsForRelated.length > 0) {
                        const categoryRelated = await client.fetch(relatedBlogPostsByCategoryQuery, {
                            currentId: fetchedPost._id,
                            categorySlugs: categorySlugsForRelated,
                        });
                        if (isMounted && categoryRelated?.length > 0) {
                            setPost(prev => ({ ...prev, relatedPosts: categoryRelated.slice(0, 3) }));
                        }
                    }
                }

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

            {/* Featured Image — spans full grid width to bridge header and body */}
            {imageUrl && (
                <div className="max-w-5xl mx-auto px-6 mb-12">
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

            {/* Mobile ToC (visible < xl only) */}
            {headings.length > 0 && (
                <div className="xl:hidden max-w-[720px] mx-auto px-6 mb-8">
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

            {/* Body section — grid with sticky ToC on desktop, single column on mobile */}
            <div className="max-w-5xl mx-auto px-6 xl:grid xl:grid-cols-[200px_minmax(0,720px)] xl:gap-12 xl:justify-center">

                {/* Sidebar — sticky within this grid row, stops when grid ends */}
                <aside className="hidden xl:block">
                    <div className="sticky top-28">
                        {headings.length > 0 && (
                            <nav aria-label="Table of contents">
                                <span className="block font-mono text-xs font-semibold uppercase tracking-wider text-textLight mb-4">In this article</span>
                                <ul className="space-y-1">
                                    {headings.map((h) => (
                                        <li key={h.id}>
                                            <a
                                                href={`#${h.id}`}
                                                aria-current={activeId === h.id ? 'true' : undefined}
                                                className={`block text-[15px] leading-snug py-1.5 pl-3 border-l-2 transition-all ${
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

                {/* Article Body — same 720px max as header/image above */}
                <div className="max-w-[720px]">
                    <div className="prose-container max-w-none">
                        <PortableText value={post.body} components={PortableTextComponents} />
                    </div>

                    {/* Newsletter CTA */}
                    <InlineNewsletterCta />

                    {/* Mobile share (visible < xl only, after content) */}
                    <div className="xl:hidden mt-8 pt-6 border-t border-accent-border">
                        <ShareBar title={post.title} url={`https://rsla.io/blog/${slug}`} />
                    </div>
                </div>
            </div>

            {/* Related Posts */}
            {post.relatedPosts && post.relatedPosts.length > 0 && (
                <div className="max-w-5xl mx-auto px-6 mt-20 mb-16">
                    <h3 className="text-2xl font-sans font-bold text-text mb-8">Read Next</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {post.relatedPosts.filter(r => r.slug?.current).map((related) => {
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
