/**
 * IndustryPage — Programmatic SEO template for industry-specific landing pages.
 * Design: Hormozi-inspired. Dark hero, bold headlines, light body text,
 * massive whitespace, minimal decoration. Question-led copy.
 */

import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Seo from '../components/Seo';

gsap.registerPlugin(ScrollTrigger);

// ── Sample Data ───────────────────────────────────────────────────────────────

const SAMPLE_PAGES = {
    'real-estate': {
        industry: 'Real Estate',
        slug: 'real-estate',
        seo: {
            title: 'AI Automation for Real Estate | RSL/A',
            description: 'AI systems that respond to leads in under 60 seconds, qualify buyers automatically, and reactivate cold databases. Built for real estate teams.',
            keywords: 'ai automation for real estate, ai lead generation for real estate agents, real estate crm automation',
        },
        heroQuestion: 'Losing deals because you responded too slow?',
        heroSub: 'Your leads message at 11 PM. By 11:01 PM they have a calendar invite. No human touched it.',
        stats: [
            { value: '78%', label: 'of buyers go with the first agent who responds' },
            { value: '5 min', label: 'is the max before lead quality drops 80%' },
            { value: '~40%', label: 'of real estate leads never get a follow-up' },
        ],
        painParagraph: 'You are paying for Zillow, Realtor.com, Facebook ads, and open house sign-ins. Leads pour in from six places and land in six inboxes. Half never get a response. The 5,000 contacts from two years ago who said "not yet"? Some are ready to buy right now. Nobody is following up.',
        transformations: [
            {
                before: 'Lead messages at 11 PM. You see it at 7 AM.',
                after: 'AI responds in under 60 seconds, qualifies the buyer, books a showing.',
            },
            {
                before: 'Leads from 6 platforms. 6 different inboxes.',
                after: 'One pipeline. Every lead auto-tagged: buyer or seller, budget, timeline.',
            },
            {
                before: '5,000 cold contacts sitting in a spreadsheet.',
                after: 'AI sends personalized market updates. 42 appointments booked in a week.',
            },
            {
                before: 'You chase follow-ups manually between showings.',
                after: 'System nudges at the right time. You only talk to ready buyers.',
            },
        ],
        proofNumber: '42',
        proofLine: 'appointments booked from 13,000 cold contacts',
        proofTime: 'in one week',
        proofDetail: 'Not by mass-blasting the same email. AI personalized every message based on what we knew about each contact.',
        faq: [
            { q: 'How long until this is live?', a: '2 to 3 weeks. CRM, integrations, AI chat, follow-up sequences. You do not need to learn anything technical.' },
            { q: 'Does this work with my current CRM?', a: 'We build on GoHighLevel. If you are on Follow Up Boss or kvCORE, we migrate your data and set up the AI layer on top. One system instead of five.' },
            { q: 'What about Zillow and Realtor.com leads?', a: 'We connect all your sources. Zillow, Realtor.com, Facebook Lead Ads, your website, open house sign-ins. Everything flows into one pipeline.' },
            { q: 'I have a team of 5 agents. Does this scale?', a: 'Yes. Leads auto-route by zip code, source, buyer type, or round-robin. Each agent sees their own pipeline.' },
            { q: 'What does this cost?', a: 'Book a call. We look at your setup, tell you exactly what needs to be built, and give you a flat price. No retainers. No hourly billing.' },
        ],
        caseStudy: {
            slug: 'ai-reactivation-engine',
            title: '13,000 Cold Contacts. 42 Appointments. One Week.',
            tag: 'AI Lead Generation',
            metrics: [
                { value: '42', label: 'Appointments' },
                { value: '1 Week', label: 'Timeframe' },
            ],
        },
    },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function IndustryPage() {
    const { slug } = useParams();
    const pageRef = useRef(null);
    const page = SAMPLE_PAGES[slug];

    useEffect(() => {
        if (!page) return;
        window.scrollTo(0, 0);

        const ctx = gsap.context(() => {
            // Hero fade
            gsap.fromTo('.ind-hero-inner > *',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
            );

            // Sections
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
    }, [page]);

    if (!page) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-background">
                <p className="text-textMuted">Page not found.</p>
            </main>
        );
    }

    return (
        <main ref={pageRef} className="min-h-screen">
            <Seo
                title={page.seo.title}
                description={page.seo.description}
                keywords={page.seo.keywords}
                canonical={`https://rsla.io/ai-for/${slug}`}
                jsonLd={[
                    {
                        '@context': 'https://schema.org', '@type': 'Service',
                        name: `AI Automation for ${page.industry}`,
                        description: page.seo.description,
                        provider: { '@type': 'Organization', name: 'RSL/A', url: 'https://rsla.io' },
                        serviceType: 'AI Automation',
                    },
                    {
                        '@context': 'https://schema.org', '@type': 'FAQPage',
                        mainEntity: page.faq.map(f => ({
                            '@type': 'Question', name: f.q,
                            acceptedAnswer: { '@type': 'Answer', text: f.a },
                        })),
                    },
                ]}
            />

            {/* ── HERO — dark, bold, centered ──────────────────────────── */}
            <section className="bg-[#0A0A0A] pt-36 pb-24 md:pt-44 md:pb-32 px-6 md:px-12">
                <div className="ind-hero-inner max-w-4xl mx-auto text-center">
                    <span className="inline-block font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-accent/80 mb-8 opacity-0">
                        AI for {page.industry}
                    </span>
                    <h1 className="font-sans font-extrabold text-white text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] tracking-tight leading-[1.1] mb-6 opacity-0">
                        {page.heroQuestion}
                    </h1>
                    <p className="font-body font-light text-white/60 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10 opacity-0">
                        {page.heroSub}
                    </p>
                    <a
                        href="/book-a-call"
                        className="inline-flex items-center px-8 py-4 rounded-full font-sans font-semibold text-sm md:text-base bg-accent text-white hover:bg-accent/90 transition-colors opacity-0"
                    >
                        Book a Free Call
                    </a>
                </div>
            </section>

            {/* ── STATS — quantify the pain ─────────────────────────────── */}
            <section className="ind-section bg-background py-20 md:py-28 px-6 md:px-12">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
                        {page.stats.map((s, i) => (
                            <div key={i} className="ind-a text-center">
                                <span className="block font-sans font-extrabold text-5xl md:text-6xl text-accent leading-none mb-3">
                                    {s.value}
                                </span>
                                <span className="font-body font-light text-textMuted text-sm md:text-base leading-relaxed">
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>
                    <p className="ind-a font-body font-light text-textMuted text-base md:text-lg leading-relaxed max-w-3xl mx-auto text-center">
                        {page.painParagraph}
                    </p>
                </div>
            </section>

            {/* ── BEFORE / AFTER ─────────────────────────────────────────── */}
            <section className="ind-section bg-surfaceAlt py-20 md:py-28 px-6 md:px-12">
                <div className="max-w-4xl mx-auto">
                    <h2 className="ind-a font-sans font-extrabold text-2xl md:text-4xl text-text tracking-tight mb-14 text-center">
                        What changes when AI runs your follow-up
                    </h2>

                    <div className="space-y-5">
                        {page.transformations.map((t, i) => (
                            <div key={i} className="ind-a grid grid-cols-1 md:grid-cols-[1fr_48px_1fr] gap-3 md:gap-0 items-stretch">
                                {/* Before */}
                                <div className="bg-background rounded-xl p-5 md:p-6 flex items-center">
                                    <div>
                                        <span className="block font-mono text-[9px] uppercase tracking-[0.15em] text-textLight mb-2">Before</span>
                                        <p className="font-body font-light text-textMuted text-sm md:text-base leading-relaxed">{t.before}</p>
                                    </div>
                                </div>
                                {/* Arrow */}
                                <div className="hidden md:flex items-center justify-center">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></svg>
                                </div>
                                {/* After */}
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

            {/* ── PROOF — one big number ─────────────────────────────────── */}
            <section className="ind-section bg-[#0A0A0A] py-24 md:py-36 px-6 md:px-12">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="ind-a">
                        <span className="block font-sans font-extrabold text-[7rem] md:text-[11rem] leading-none text-white">
                            {page.proofNumber}
                        </span>
                        <p className="font-sans font-extrabold text-xl md:text-2xl text-white mt-3 mb-2">
                            {page.proofLine}
                        </p>
                        <p className="font-sans font-bold text-base md:text-lg text-accent mb-8">
                            {page.proofTime}
                        </p>
                        <p className="font-body text-white/60 text-sm md:text-base leading-relaxed max-w-lg mx-auto">
                            {page.proofDetail}
                        </p>
                    </div>
                </div>
            </section>

            {/* ── MID CTA ────────────────────────────────────────────────── */}
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

            {/* ── FAQ ────────────────────────────────────────────────────── */}
            <section className="ind-section bg-surfaceAlt py-20 md:py-28 px-6 md:px-12">
                <div className="max-w-3xl mx-auto">
                    <h2 className="ind-a font-sans font-extrabold text-2xl md:text-4xl text-text tracking-tight mb-12">
                        Questions you are probably asking
                    </h2>
                    <div className="space-y-0">
                        {page.faq.map((item, i) => (
                            <div key={i} className="ind-a border-b border-accent-border py-7 first:pt-0 last:border-b-0">
                                <h3 className="font-sans font-bold text-base md:text-lg text-text mb-2">
                                    {item.q}
                                </h3>
                                <p className="font-body font-light text-textMuted text-sm md:text-base leading-relaxed">
                                    {item.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CASE STUDY ─────────────────────────────────────────────── */}
            {page.caseStudy && (
                <section className="ind-section bg-background py-20 md:py-28 px-6 md:px-12">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="ind-a font-sans font-extrabold text-2xl md:text-4xl text-text tracking-tight mb-8">
                            See the proof
                        </h2>
                        <Link
                            to={`/work/${page.caseStudy.slug}`}
                            className="ind-a group block bg-surfaceAlt rounded-2xl p-7 md:p-10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-accent">
                                {page.caseStudy.tag}
                            </span>
                            <h3 className="font-sans font-extrabold text-xl md:text-2xl text-text tracking-tight mt-3 mb-6 group-hover:text-accent transition-colors">
                                {page.caseStudy.title}
                            </h3>
                            <div className="flex gap-10">
                                {page.caseStudy.metrics.map((m, i) => (
                                    <div key={i}>
                                        <strong className="block text-3xl font-extrabold font-sans text-text">{m.value}</strong>
                                        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-accent">{m.label}</span>
                                    </div>
                                ))}
                            </div>
                        </Link>
                    </div>
                </section>
            )}

        </main>
    );
}
