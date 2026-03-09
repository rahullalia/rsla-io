import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import { client } from '../sanity/lib/client';
import { blogPostBySlugV2Query, relatedCaseStudyForBlogQuery, featuredCaseStudyFallbackQuery } from '../sanity/lib/queries';
import { urlForImage } from '../sanity/lib/image';
import { PortableTextComponents, slugify } from '../components/blog/PortableTextRenderer';
import Seo from '../components/Seo';
import InlineNewsletterCta from '../components/blog/InlineNewsletterCta';
import { TextAnimate } from '@/components/ui/text-animate';

export default function BlogInner() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [relatedCaseStudy, setRelatedCaseStudy] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchPostData = async () => {
            setLoading(true);
            try {
                // Fetch V2 blog post
                let fetchedPost = await client.fetch(blogPostBySlugV2Query, { slug });

                if (!fetchedPost && isMounted) {
                    setPost(null);
                    setLoading(false);
                    return;
                }

                if (isMounted) setPost(fetchedPost);

                // Replicate Next.js related case study logic
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

    const jsonLdSchemas = faqSchema ? [blogPostingSchema, faqSchema] : blogPostingSchema;

    return (
        <article className="min-h-screen bg-surface text-text pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
            <Seo
                title={seoTitle}
                description={seoDescription}
                canonical={`https://rsla.io/blog/${slug}`}
                ogImage={seoImage}
                ogType="article"
                keywords={seoKeywords}
                jsonLd={jsonLdSchemas}
            />
            <div className="max-w-4xl mx-auto relative z-10 block">

                {/* Header Breadcrumb & Back */}
                <div className="mb-12 flex flex-col items-start gap-4">
                    <Link to="/blog" className="inline-flex items-center gap-2 min-h-[44px] text-textMuted hover:text-accent font-mono text-sm transition-colors uppercase tracking-wider">
                        ← Back to Blog
                    </Link>

                    {post.categories && post.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {post.categories.map((category, idx) => (
                                <span key={idx} className="font-mono text-xs uppercase tracking-wider text-accent border border-accent/20 bg-accent/5 px-3 py-1 rounded-full">
                                    {category.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Article Header */}
                <header className="mb-16">
                    <h1 className="text-4xl md:text-6xl font-sans font-bold leading-tight tracking-tight text-text mb-8">
                        <TextAnimate animation="blurInUp" by="word" delay={0.08} startOnView={false} as="span">
                            {post.title}
                        </TextAnimate>
                    </h1>

                    <div className="flex items-start gap-4 py-6 border-y border-accent-border">
                        {post.author?.image?.asset && (
                            <img
                                src={urlForImage(post.author.image.asset)?.width(100).height(100).url()}
                                alt={post.author.name}
                                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                            />
                        )}
                        <div className="min-w-0">
                            <div className="font-sans font-bold text-lg">{post.author?.name || 'SYS.ADMIN'}</div>
                            <div className="font-mono text-xs text-textMuted uppercase tracking-wider mt-1">
                                {post.author?.role || 'Architect'}
                            </div>
                            <div className="font-mono text-xs text-textMuted uppercase tracking-wider mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                                <time>
                                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                        month: 'short', day: 'numeric', year: 'numeric'
                                    })}
                                </time>
                                {post.readingTime && (
                                    <>
                                        <span>•</span>
                                        <span>{post.readingTime} min read</span>
                                    </>
                                )}
                                {post.updatedAt && (
                                    <>
                                        <span>•</span>
                                        <span>Updated {new Date(post.updatedAt).toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric', year: 'numeric'
                                        })}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Pull Quote (V2) */}
                {post.pullQuote && (
                    <blockquote className="border-l-4 border-accent pl-8 my-12 italic text-2xl md:text-3xl text-textMuted font-drama leading-relaxed">
                        {post.pullQuote}
                    </blockquote>
                )}

                {/* Table of Contents */}
                {(() => {
                    if (!post.showTableOfContents) return null;
                    const headings = (post.body || [])
                        .filter((block) => block._type === 'block' && block.style === 'h2')
                        .map((block) => {
                            const text = (block.children || []).map((c) => c.text || '').join('');
                            return { text, id: slugify(text) };
                        })
                        .filter((h) => h.text);
                    if (headings.length < 2) return null;
                    return (
                        <nav className="my-12 p-8 rounded-[1.5rem] bg-surfaceAlt border border-accent-border">
                            <h2 className="font-mono text-xs text-accent uppercase tracking-widest mb-4">Table of Contents</h2>
                            <ol className="space-y-2 list-decimal list-inside">
                                {headings.map((h) => (
                                    <li key={h.id} className="font-mono text-sm">
                                        <a href={`#${h.id}`} className="text-textMuted hover:text-accent transition-colors underline-offset-4 hover:underline">
                                            {h.text}
                                        </a>
                                    </li>
                                ))}
                            </ol>
                        </nav>
                    );
                })()}

                {/* Hero Image */}
                {imageUrl && (
                    <div className="w-full aspect-video rounded-[2rem] overflow-hidden mb-16 shadow-lg border border-accent-border bg-surfaceAlt">
                        <img
                            src={imageUrl}
                            alt={post.featuredImage?.alt || post.title}
                            className="w-full h-full object-cover blur-up"
                            onLoad={(e) => e.target.classList.add('loaded')}
                        />
                    </div>
                )}

                {/* Body Content using PortableText */}
                <div className="prose-container max-w-none">
                    <PortableText value={post.body} components={PortableTextComponents} />
                </div>

                {/* Newsletter CTA */}
                <InlineNewsletterCta />

                {/* Related Posts (V2) */}
                {post.relatedPosts && post.relatedPosts.length > 0 && (
                    <div className="mt-20 mb-16">
                        <h3 className="text-3xl font-sans font-bold text-text mb-10 text-center">Read Next</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {post.relatedPosts.map((related) => {
                                const relatedImg = related.featuredImage?.asset
                                    ? urlForImage(related.featuredImage.asset)?.width(400).height(260).url()
                                    : null;
                                return (
                                    <Link
                                        key={related._id}
                                        to={`/blog/${related.slug.current}`}
                                        className="group flex flex-col bg-surfaceAlt rounded-[1.5rem] border border-accent-border overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                    >
                                        {relatedImg && (
                                            <div className="aspect-[3/2] overflow-hidden bg-surfaceAlt">
                                                <img
                                                    src={relatedImg}
                                                    alt={related.featuredImage?.alt || related.title}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover transition-all duration-500"
                                                />
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <h4 className="font-sans font-bold text-lg tracking-tight mb-2 group-hover:text-accent transition-colors line-clamp-2">
                                                {related.title}
                                            </h4>
                                            {related.excerpt && (
                                                <p className="font-mono text-sm text-textMuted line-clamp-2">{related.excerpt}</p>
                                            )}
                                            <div className="mt-4 font-mono text-xs text-textMuted flex items-center gap-2">
                                                <time>
                                                    {new Date(related.publishedAt).toLocaleDateString('en-US', {
                                                        month: 'short', day: 'numeric', year: 'numeric'
                                                    })}
                                                </time>
                                                {related.readingTime && (
                                                    <>
                                                        <span>•</span>
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

                {/* Related Case Study Injection */}
                {relatedCaseStudy && (
                    <div className="mt-24 p-10 bg-surfaceAlt border border-accent-border rounded-[2rem] shadow-sm relative overflow-hidden">
                        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                            <div className="max-w-xl">
                                <h3 className="font-mono text-accent text-sm uppercase tracking-widest mb-4">See It In Action</h3>
                                <h4 className="text-3xl font-sans font-bold text-text mb-3">{relatedCaseStudy.title}</h4>
                                <p className="text-textMuted font-body text-sm leading-relaxed mb-6">{relatedCaseStudy.description}</p>

                                {relatedCaseStudy.metrics && relatedCaseStudy.metrics.length > 0 && (
                                    <div className="flex gap-6 mb-8 border-l-2 border-accent pl-6">
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

            </div>
        </article>
    );
}
