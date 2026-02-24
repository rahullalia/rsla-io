import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import { client } from '../sanity/lib/client';
import { blogPostBySlugQuery, blogPostBySlugV2Query, relatedCaseStudyForBlogQuery, featuredCaseStudyFallbackQuery } from '../sanity/lib/queries';
import { urlForImage } from '../sanity/lib/image';
import { PortableTextComponents } from '../components/blog/PortableTextRenderer';
import Seo from '../components/Seo';

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
                // Try V2 first, fall back to V1
                let fetchedPost = await client.fetch(blogPostBySlugV2Query, { slug });
                if (!fetchedPost) {
                    fetchedPost = await client.fetch(blogPostBySlugQuery, { slug });
                }

                if (!fetchedPost && isMounted) {
                    setPost(null);
                    setLoading(false);
                    return;
                }

                if (isMounted) setPost(fetchedPost);

                // Replicate Next.js related case study logic
                let caseStudy = fetchedPost.relatedCaseStudies?.[0] || null;

                if (!caseStudy) {
                    const categorySlugs = fetchedPost.categories?.map((c) => c.slug.current) || [];
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
                        'contractors': ['CRM & Operations'],
                        'small-business': ['Marketing', 'AI Automation'],
                        'hair-stylists': ['Marketing'],
                        'ai-lead-generation': ['AI Lead Generation', 'Marketing'],
                        'ai-automations': ['AI Automations', 'AI Automation'],
                        'ai-operations': ['AI Operations', 'CRM & Operations'],
                        'tools-and-tech': ['AI Automation', 'Development'],
                        'founder-diaries': ['AI Lead Generation', 'Marketing'],
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
            <div className="min-h-screen bg-background pt-32 pb-24 flex items-center justify-center">
                <div className="font-mono text-accent animate-pulse">[FETCHING_ARTICLE...]</div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-background pt-32 pb-24 flex flex-col items-center justify-center">
                <h1 className="text-4xl font-sans font-bold text-dark mb-4">404 - Article Not Found</h1>
                <Link to="/blog" className="text-accent hover:underline font-mono">← Return to Archive</Link>
            </div>
        );
    }

    const imageUrl = post.featuredImage?.asset ? urlForImage(post.featuredImage.asset)?.width(1600).height(900).url() : null;

    const seoDescription = post.excerpt || (post.body?.[0]?.children?.[0]?.text || '').slice(0, 160);

    return (
        <article className="min-h-screen bg-background text-dark pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
            <Seo
                title={`${post.title} | RSL/A`}
                description={seoDescription}
                canonical={`https://rsla.io/blog/${slug}`}
            />
            <div className="max-w-4xl mx-auto relative z-10 block">

                {/* Header Breadcrumb & Back */}
                <div className="mb-12 flex flex-col items-start gap-4">
                    <Link to="/blog" className="inline-flex items-center gap-2 text-dark/50 hover:text-accent font-mono text-sm transition-colors uppercase tracking-wider">
                        ← Back to Archive
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
                    <h1 className="text-4xl md:text-6xl font-sans font-bold leading-tight tracking-tight text-dark mb-8">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-4 py-6 border-y border-dark/10">
                        {post.author?.image?.asset && (
                            <img
                                src={urlForImage(post.author.image.asset)?.width(100).height(100).url()}
                                alt={post.author.name}
                                className="w-12 h-12 rounded-full object-cover grayscale"
                            />
                        )}
                        <div>
                            <div className="font-sans font-bold text-lg">{post.author?.name || 'SYS.ADMIN'}</div>
                            <div className="font-mono text-sm text-dark/50 uppercase tracking-wider flex items-center gap-2">
                                <span>{post.author?.role || 'Architect'}</span>
                                <span>•</span>
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
                            </div>
                        </div>
                    </div>
                </header>

                {/* Pull Quote (V2) */}
                {post.pullQuote && (
                    <blockquote className="border-l-4 border-accent pl-8 my-12 italic text-2xl md:text-3xl text-dark/80 font-drama leading-relaxed">
                        {post.pullQuote}
                    </blockquote>
                )}

                {/* Hero Image */}
                {imageUrl && (
                    <div className="w-full aspect-video rounded-[2rem] overflow-hidden mb-16 shadow-lg border border-dark/5">
                        <img
                            src={imageUrl}
                            alt={post.featuredImage?.alt || post.title}
                            className="w-full h-full object-cover"
                            priority="true"
                        />
                    </div>
                )}

                {/* Body Content using PortableText */}
                <div className="prose-container max-w-none">
                    <PortableText value={post.body} components={PortableTextComponents} />
                </div>

                {/* Related Posts (V2) */}
                {post.relatedPosts && post.relatedPosts.length > 0 && (
                    <div className="mt-20 mb-16">
                        <h3 className="text-3xl font-sans font-bold text-dark mb-10 text-center">Read Next</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {post.relatedPosts.map((related) => {
                                const relatedImg = related.featuredImage?.asset
                                    ? urlForImage(related.featuredImage.asset)?.width(400).height(260).url()
                                    : null;
                                return (
                                    <Link
                                        key={related._id}
                                        to={`/blog/${related.slug.current}`}
                                        className="group flex flex-col bg-primary rounded-[1.5rem] border border-dark/5 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                    >
                                        {relatedImg && (
                                            <div className="aspect-[3/2] overflow-hidden bg-dark/5">
                                                <img
                                                    src={relatedImg}
                                                    alt={related.featuredImage?.alt || related.title}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                                />
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <h4 className="font-sans font-bold text-lg tracking-tight mb-2 group-hover:text-accent transition-colors line-clamp-2">
                                                {related.title}
                                            </h4>
                                            {related.excerpt && (
                                                <p className="font-mono text-sm text-dark/50 line-clamp-2">{related.excerpt}</p>
                                            )}
                                            <div className="mt-4 font-mono text-xs text-dark/40 flex items-center gap-2">
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
                    <div className="mt-24 p-10 bg-dark rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
                        {/* Abstract Background Decoration */}
                        <div className="absolute -inset-10 bg-[radial-gradient(circle_at_100%_0%,rgba(0,112,243,0.15),transparent_50%)] 
                                        opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                            <div className="max-w-xl">
                                <h3 className="font-mono text-accent text-sm uppercase tracking-widest mb-4">See It In Action</h3>
                                <h4 className="text-3xl font-sans font-bold mb-3">{relatedCaseStudy.title}</h4>
                                <p className="text-white/60 font-mono text-sm leading-relaxed mb-6">{relatedCaseStudy.description}</p>

                                {relatedCaseStudy.metrics && relatedCaseStudy.metrics.length > 0 && (
                                    <div className="flex gap-6 mb-8 border-l-2 border-accent pl-6">
                                        {relatedCaseStudy.metrics.slice(0, 2).map((metric, idx) => (
                                            <div key={idx}>
                                                <strong className="block text-2xl font-bold">{metric.value}</strong>
                                                <span className="text-[10px] font-mono text-accent uppercase tracking-wider">{metric.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <Link
                                    to={`/work/${relatedCaseStudy.slug}`}
                                    className="inline-flex items-center gap-3 px-6 py-3 bg-white text-dark font-sans font-bold rounded-full hover:scale-105 transition-transform"
                                >
                                    Read Case Study <span className="text-accent">→</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </article>
    );
}
