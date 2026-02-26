/**
 * BlogPreview — Latest 3 blog posts from Sanity.
 * Light theme cards with GSAP stagger entrance.
 */

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { client } from '../sanity/lib/client';
import imageUrlBuilder from '@sanity/image-url';

gsap.registerPlugin(ScrollTrigger);

const builder = imageUrlBuilder(client);
function urlFor(source) {
    return builder.image(source);
}

const query = `*[_type in ["blogPost", "blogPostV2"] && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    publishedAt,
    featuredImage { asset->, alt },
    categories[]->{ name, slug }
}`;

export default function BlogPreview() {
    const sectionRef = useRef(null);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        client.fetch(query).then(setPosts);
    }, []);

    useEffect(() => {
        if (posts.length === 0) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.blog-card',
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    stagger: 0.12,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                        once: true,
                    },
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, [posts]);

    if (posts.length === 0) return null;

    return (
        <section ref={sectionRef} className="py-20 md:py-32 bg-surface border-t border-accent-border px-6 md:px-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <span className="font-mono text-xs uppercase tracking-wider text-accent">Blog</span>
                        <h2 className="font-sans font-bold text-3xl md:text-4xl tracking-tight mt-3 text-text">
                            Latest from the blog
                        </h2>
                        <p className="font-body text-base text-textMuted mt-2">
                            Practical takes on AI, marketing, and building systems that scale.
                        </p>
                    </div>
                    <Link
                        to="/blog"
                        className="hidden md:inline-flex items-center gap-2 font-sans font-bold text-accent text-sm hover:text-accent/80 transition-colors group"
                    >
                        View all
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="group-hover:translate-x-1 transition-transform"
                        >
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <Link
                            key={post._id}
                            to={`/blog/${post.slug.current}`}
                            className="blog-card group bg-surface rounded-2xl border border-accent-border overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-lg transition-shadow"
                        >
                            {post.featuredImage?.asset && (
                                <div className="aspect-[16/10] overflow-hidden">
                                    <img
                                        src={urlFor(post.featuredImage).width(600).height(375).url()}
                                        alt={post.featuredImage.alt || post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                {post.categories?.length > 0 && (
                                    <div className="flex gap-2 mb-3">
                                        {post.categories.slice(0, 2).map((cat) => (
                                            <span
                                                key={cat.slug.current}
                                                className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-accent-light text-accent border border-accent-medium"
                                            >
                                                {cat.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <h3 className="font-sans font-bold text-lg text-text leading-snug mb-2 group-hover:text-accent transition-colors">
                                    {post.title}
                                </h3>
                                <time className="font-mono text-xs text-textLight">
                                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </time>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="md:hidden mt-8 text-center">
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 min-h-[44px] font-sans font-bold text-accent text-sm"
                    >
                        View all posts
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
