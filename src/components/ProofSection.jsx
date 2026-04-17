import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { client } from '../sanity/lib/client';
import { featuredCaseStudiesV2Query, featuredCaseStudiesQuery } from '../sanity/lib/queries';

gsap.registerPlugin(ScrollTrigger);

// Hardcoded fallback in case Sanity is unreachable
const fallbackProofs = [
    {
        slug: 'fieldshare-seo-website-rebrand',
        type: 'SaaS · Oil & Gas',
        result: 'Rebuilt the website and repositioned the brand around one core industry. Ranked #1 on Google for 20+ keywords in 6 months. The new site closed a mid-size operator on its own.',
        metric: '20+',
    },
    {
        slug: 'local-seo-reputation-management',
        type: 'Local · Restaurant',
        result: 'Built an NPS-driven review engine. 14 Google reviews to 132 in 60 days. $25K in new revenue. Now ranking #1 for local pizza searches.',
        metric: '$25K',
    },
    {
        slug: null,
        type: 'Beauty · Salon',
        result: 'Two vacant salon rental rooms filled in months using our lead engine and automated follow-up. Owner stopped stressing about rent.',
        metric: '2/2',
    },
];

export default function ProofSection() {
    const sectionRef = useRef(null);
    const [proofs, setProofs] = useState(fallbackProofs);

    useEffect(() => {
        async function fetchCaseStudies() {
            try {
                // Try V2 first, fall back to V1
                let data = await client.fetch(featuredCaseStudiesV2Query);

                if (!data || data.length === 0) {
                    data = await client.fetch(featuredCaseStudiesQuery);

                }
                if (data && data.length > 0) {
                    const mapped = data.map((cs) => ({
                        slug: cs.slug,
                        type: cs.tag || 'Case Study',
                        result: cs.description,
                        metric: cs.metrics?.[0]?.value || '',
                    }));

                    setProofs(mapped);
                }
            } catch (err) {
                console.error('[ProofSection] fetch error:', err);
            }
        }
        fetchCaseStudies();
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.proof-row',
                { y: 40, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 70%',
                        once: true,
                    }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, [proofs]);

    return (
        <section ref={sectionRef} className="w-full bg-surfaceAlt py-24 md:py-32">
            <div className="max-w-6xl mx-auto px-6 md:px-12">
                <span className="font-sans text-sm uppercase tracking-wider text-accent">Case Studies</span>
                <h2 className="font-sans font-extrabold text-2xl md:text-4xl text-text tracking-tight mt-3 mb-16 md:mb-20">
                    <span className="text-text">The Proof</span>
                </h2>

                <div className="space-y-0">
                    {proofs.map((proof, i) => {
                        const inner = (
                            <>
                                <div className="flex-1">
                                    <span className="font-sans text-xs md:text-sm uppercase tracking-widest text-accent font-bold">{proof.type}</span>
                                    <p className="font-sans text-textMuted text-lg leading-relaxed mt-2 max-w-xl">{proof.result}</p>
                                </div>
                                <div className="flex-shrink-0 flex items-center gap-3">
                                    <div className="font-sans font-bold text-5xl md:text-7xl text-accent leading-none">{proof.metric}</div>
                                    {proof.slug && (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-textMuted group-hover:text-accent group-hover:translate-x-1 transition-all">
                                            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                                        </svg>
                                    )}
                                </div>
                            </>
                        );

                        const rowClass = "proof-row flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8 py-8 md:py-10 border-b border-accent-border group hover:border-accent/30 transition-colors duration-500";

                        return proof.slug ? (
                            <Link key={i} to={`/work/${proof.slug}`} className={rowClass}>
                                {inner}
                            </Link>
                        ) : (
                            <div key={i} className={rowClass}>
                                {inner}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12">
                    <Link to="/work" className="link-underline inline-flex items-center gap-2 font-sans font-bold text-accent hover:text-accent/80 transition-colors group">
                        See all case studies
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
