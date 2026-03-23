/**
 * IndustryPage — Programmatic SEO template for /ai-for/[slug] pages.
 * Fetches content from Sanity CMS. Dark hero, Hormozi-inspired layout.
 */

import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { client } from '../sanity/lib/client';
import { industryPageBySlugQuery } from '../sanity/lib/queries';
import Seo from '../components/Seo';

gsap.registerPlugin(ScrollTrigger);

export default function IndustryPage() {
    const { slug } = useParams();
    const pageRef = useRef(null);
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        window.scrollTo(0, 0);
        setLoading(true);

        client.fetch(industryPageBySlugQuery, { slug })
            .then((data) => {
                if (isMounted) {
                    setPage(data);
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.error('[IndustryPage] Sanity fetch failed:', err);
                if (isMounted) {
                    setPage(null);
                    setLoading(false);
                }
            });

        return () => { isMounted = false; };
    }, [slug]);

    useEffect(() => {
        if (!page || loading) return;

        const ctx = gsap.context(() => {
            gsap.fromTo('.ind-hero-inner > *',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
            );

            document.querySelectorAll('.ind-section').forEach((section) => {
                gsap.fromTo(section.querySelectorAll('.ind-a'),
                    { y: 25, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out',
                        scrollTrigger: { trigger: section, start: 'top 78%', once: true }
                    }
                );
            });
        }, pageRef);

        return () => ctx.revert();
    }, [page, loading]);

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
            </main>
        );
    }

    if (!page) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-background">
                <p className="text-textMuted">Page not found.</p>
            </main>
        );
    }

    const industry = page.industry || 'Your Industry';
    const seoTitle = page.seoTitle || `AI Automation for ${industry} | RSL/A`;
    const seoDesc = page.seoDescription || `AI automation systems built for ${industry.toLowerCase()}. Respond to leads instantly, automate follow ups, and reactivate your database.`;

    return (
        <main ref={pageRef} className="min-h-screen">
            <Seo
                title={seoTitle}
                description={seoDesc}
                keywords={page.seoKeywords}
                canonical={`https://rsla.io/ai-for/${page.slug}`}
                jsonLd={[
                    {
                        '@context': 'https://schema.org', '@type': 'Service',
                        name: `AI Automation for ${page.industry}`,
                        description: seoDesc,
                        provider: { '@type': 'Organization', name: 'RSL/A', url: 'https://rsla.io' },
                        serviceType: 'AI Automation',
                    },
                    ...(page.faq?.length ? [{
                        '@context': 'https://schema.org', '@type': 'FAQPage',
                        mainEntity: page.faq.map(f => ({
                            '@type': 'Question', name: f.question,
                            acceptedAnswer: { '@type': 'Answer', text: f.answer },
                        })),
                    }] : []),
                ]}
            />

            {/* ── HERO ──────────────────────────────────────────────────── */}
            <section className="bg-[#0A0A0A] pt-36 pb-24 md:pt-44 md:pb-32 px-6 md:px-12">
                <div className="ind-hero-inner max-w-4xl mx-auto text-center">
                    <span className="inline-block font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-accent/80 mb-8 opacity-0">
                        AI for {page.industry}
                    </span>
                    <h1 className="font-sans font-extrabold text-white text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] tracking-tight leading-[1.1] mb-6 opacity-0">
                        {page.heroQuestion}
                    </h1>
                    <p className="font-body font-light text-white/60 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10 opacity-0">
                        {page.heroSubtitle}
                    </p>
                    <a
                        href="/book-a-call"
                        className="inline-flex items-center px-8 py-4 rounded-full font-sans font-semibold text-sm md:text-base bg-accent text-white hover:bg-accent/90 transition-colors opacity-0"
                    >
                        Book a Free Call
                    </a>
                </div>
            </section>

            {/* ── STATS ─────────────────────────────────────────────────── */}
            {page.costStats?.length > 0 && (
                <section className="ind-section bg-background py-20 md:py-28 px-6 md:px-12">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="ind-a font-sans font-extrabold text-2xl md:text-4xl text-text tracking-tight mb-10 text-center">
                            {page.costHeadline}
                        </h2>
                        <div className="ind-a grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
                            {page.costStats.map((s, i) => (
                                <div key={s._key || i} className="text-center">
                                    <span className="block font-sans font-extrabold text-5xl md:text-6xl text-accent leading-none mb-3">
                                        {s.value}
                                    </span>
                                    <span className="font-body font-light text-textMuted text-sm md:text-base leading-relaxed">
                                        {s.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p className="ind-a font-body font-light text-textMuted text-base md:text-lg leading-relaxed max-w-3xl mx-auto text-center whitespace-pre-line">
                            {page.painParagraph}
                        </p>
                    </div>
                </section>
            )}

            {/* ── BEFORE / AFTER ──────────────────────────────────────── */}
            {page.transformations?.length > 0 && (
                <section className="ind-section bg-surfaceAlt py-20 md:py-28 px-6 md:px-12">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="ind-a font-sans font-extrabold text-2xl md:text-4xl text-text tracking-tight mb-14 text-center">
                            {page.solutionHeadline}
                        </h2>
                        <div className="space-y-5">
                            {page.transformations.map((t, i) => (
                                <div key={t._key || i} className="ind-a grid grid-cols-1 md:grid-cols-[1fr_48px_1fr] gap-3 md:gap-0 items-stretch">
                                    <div className="bg-background rounded-xl p-5 md:p-6 flex items-center">
                                        <div>
                                            <span className="block font-mono text-[9px] uppercase tracking-[0.15em] text-textLight mb-2">Before</span>
                                            <p className="font-body font-light text-textMuted text-sm md:text-base leading-relaxed">{t.before}</p>
                                        </div>
                                    </div>
                                    <div className="hidden md:flex items-center justify-center">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></svg>
                                    </div>
                                    <div className="bg-accent/[0.04] border border-accent/10 rounded-xl p-5 md:p-6 flex items-center">
                                        <div>
                                            <span className="block font-mono text-[9px] uppercase tracking-[0.15em] text-accent mb-2">After</span>
                                            <p className="font-body text-text text-sm md:text-base leading-relaxed">{t.after}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── PROOF ──────────────────────────────────────────────── */}
            {page.proofNumber && (
                <section className="ind-section bg-[#0A0A0A] py-24 md:py-36 px-6 md:px-12">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="ind-a">
                            <span className="block font-sans font-extrabold text-[7rem] md:text-[11rem] leading-none text-white">
                                {page.proofNumber}
                            </span>
                            {page.proofLine && (
                                <p className="font-sans font-extrabold text-xl md:text-2xl text-white mt-3 mb-2">
                                    {page.proofLine}
                                </p>
                            )}
                            {page.proofTimeframe && (
                                <p className="font-sans font-bold text-base md:text-lg text-accent mb-8">
                                    {page.proofTimeframe}
                                </p>
                            )}
                            {page.proofDetail && (
                                <p className="font-body text-white/60 text-sm md:text-base leading-relaxed max-w-lg mx-auto">
                                    {page.proofDetail}
                                </p>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* ── MID CTA ────────────────────────────────────────────── */}
            <section className="ind-section bg-background py-16 md:py-24 px-6 md:px-12">
                <div className="max-w-2xl mx-auto text-center">
                    <p className="ind-a font-sans font-extrabold text-xl md:text-2xl text-text leading-snug mb-8">
                        We will look at your setup and tell you exactly what AI should be handling. No pitch deck. Just a screen share.
                    </p>
                    <a
                        href="/book-a-call"
                        className="ind-a inline-flex items-center px-8 py-4 rounded-full font-sans font-semibold text-sm md:text-base bg-accent text-white hover:bg-accent/90 transition-colors"
                    >
                        Book a Free Call
                    </a>
                </div>
            </section>

            {/* ── FAQ ─────────────────────────────────────────────────── */}
            {page.faq?.length > 0 && (
                <section className="ind-section bg-surfaceAlt py-20 md:py-28 px-6 md:px-12">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="ind-a font-sans font-extrabold text-2xl md:text-4xl text-text tracking-tight mb-12">
                            Questions you are probably asking
                        </h2>
                        <div className="space-y-0">
                            {page.faq.map((item, i) => (
                                <div key={item._key || i} className="ind-a border-b border-accent-border py-7 first:pt-0 last:border-b-0">
                                    <h3 className="font-sans font-bold text-base md:text-lg text-text mb-2">
                                        {item.question}
                                    </h3>
                                    <p className="font-body font-light text-textMuted text-sm md:text-base leading-relaxed">
                                        {item.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── CASE STUDY ──────────────────────────────────────────── */}
            {page.relatedCaseStudy && (
                <section className="ind-section bg-background py-20 md:py-28 px-6 md:px-12">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="ind-a font-sans font-extrabold text-2xl md:text-4xl text-text tracking-tight mb-8">
                            See the proof
                        </h2>
                        <Link
                            to={`/work/${page.relatedCaseStudy.slug}`}
                            className="ind-a group block bg-surfaceAlt rounded-2xl p-7 md:p-10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-accent">
                                {page.relatedCaseStudy.tag}
                            </span>
                            <h3 className="font-sans font-extrabold text-xl md:text-2xl text-text tracking-tight mt-3 mb-6 group-hover:text-accent transition-colors">
                                {page.relatedCaseStudy.title}
                            </h3>
                            {page.relatedCaseStudy.metrics?.length > 0 && (
                                <div className="flex gap-10">
                                    {page.relatedCaseStudy.metrics.map((m, i) => (
                                        <div key={i}>
                                            <strong className="block text-3xl font-extrabold font-sans text-text">{m.value}</strong>
                                            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-accent">{m.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Link>
                    </div>
                </section>
            )}
        </main>
    );
}
