import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { client } from '../sanity/lib/client';
import { blogPostsUnionQuery, blogPostsCountUnionQuery } from '../sanity/lib/queries';
import { urlForImage } from '../sanity/lib/image';
import Seo from '../components/Seo';

const POSTS_PER_PAGE = 9;

export default function Blog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        let isMounted = true;

        const fetchPosts = async () => {
            setLoading(true);
            try {
                const start = (currentPage - 1) * POSTS_PER_PAGE;
                const end = start + POSTS_PER_PAGE;

                const [fetchedPosts, totalCount] = await Promise.all([
                    client.fetch(blogPostsUnionQuery, { start, end }),
                    client.fetch(blogPostsCountUnionQuery)
                ]);

                if (isMounted) {
                    setPosts(fetchedPosts);
                    setTotalPages(Math.ceil(totalCount / POSTS_PER_PAGE));
                }
            } catch (error) {
                console.error("Error fetching blog posts:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchPosts();

        // Scroll to top on page change
        window.scrollTo(0, 0);

        return () => {
            isMounted = false;
        };
    }, [currentPage]);

    return (
        <div className="min-h-screen bg-surface text-text pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
            <Seo
                title="Blog | RSL/A"
                description="Insights on marketing automation, AI systems, local SEO, and business growth strategies from RSL/A."
                canonical="https://rsla.io/blog"
            />
            {/* Soft noise overlay inherited from globals */}
            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-20 text-center">
                    <h1 className="text-5xl md:text-7xl font-sans font-bold mb-6 tracking-tighter">
                        The <span className="text-accent italic font-drama pr-2">Archive.</span>
                    </h1>
                    <p className="font-mono text-textMuted max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                        Insights on marketing automation, AI systems, local SEO, and strategies to scale your operations without overhead.
                    </p>
                </header>

                {loading ? (
                    <div className="flex justify-center items-center py-20 font-mono text-accent animate-pulse">
                        [FETCHING_DATA...]
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 font-mono text-textLight">
                        No intel logged yet. Check back soon.
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                            {posts.map((post) => {
                                const imageUrl = post.featuredImage?.asset ? urlForImage(post.featuredImage)?.width(600).height(400).url() : '';

                                return (
                                    <Link
                                        key={post._id}
                                        to={`/blog/${post.slug.current}`}
                                        className="group flex flex-col h-full bg-surfaceAlt rounded-[2rem] border border-accent-border overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
                                    >
                                        {imageUrl && (
                                            <div className="relative aspect-[3/2] overflow-hidden bg-surfaceAlt">
                                                <img
                                                    src={imageUrl}
                                                    alt={post.featuredImage?.alt || post.title}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover transition-all duration-500 scale-100 group-hover:scale-105"
                                                />
                                            </div>
                                        )}
                                        <div className="p-8 flex flex-col flex-grow">
                                            {post.categories && post.categories.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {post.categories.slice(0, 2).map((category, idx) => (
                                                        <span key={idx} className="font-mono text-[10px] uppercase tracking-wider text-accent border border-accent/20 bg-accent/5 px-2 py-1 rounded-sm">
                                                            {category.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            <h2 className="font-sans font-bold text-2xl tracking-tight mb-3 group-hover:text-accent transition-colors line-clamp-2">
                                                {post.title}
                                            </h2>
                                            {post.excerpt && (
                                                <p className="font-mono text-sm text-textMuted line-clamp-3 mb-6 flex-grow leading-relaxed">
                                                    {post.excerpt}
                                                </p>
                                            )}
                                            <div className="flex items-center justify-between font-mono text-xs text-textLight mt-auto pt-4 border-t border-accent-border">
                                                <span>{post.author?.name || 'SYS.ADMIN'}</span>
                                                <time>
                                                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        year: '2-digit',
                                                    }).replace(/\//g, '.')}
                                                </time>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 font-mono text-sm">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 hover:text-accent disabled:opacity-30 disabled:hover:text-text transition-colors"
                                >
                                    &larr; PREV
                                </button>
                                <span className="text-textLight">
                                    PG {currentPage} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 hover:text-accent disabled:opacity-30 disabled:hover:text-text transition-colors"
                                >
                                    NEXT &rarr;
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
