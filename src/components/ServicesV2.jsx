/**
 * ServicesV2 — Magic Card grid replacing scroll-snap stacking cards.
 * 3 cards with mouse-follow gradient effect. Light theme.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { MagicCard } from '@/components/ui/magic-card';

gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        tag: 'LEAD GEN',
        title: 'Leads that find',
        accent: 'you.',
        body: "We set up ad systems across Facebook and Google that test creatives, kill what's not working, and scale what is. Every dollar tracked, every lead scored, every qualified prospect fed straight into your pipeline.",
        cta: 'How we find your leads',
        link: '/services#lead-generation',
        num: '01',
    },
    {
        tag: 'AI AUTOMATION',
        title: 'Booking calls while you',
        accent: 'sleep.',
        body: "Someone messages at 2 AM. By 2:01 AM they have a calendar invite. No human touched it. We build bots and automations that qualify leads, answer questions, and chase follow-ups. All without you.",
        cta: 'See automations in action',
        link: '/services#automations',
        num: '02',
    },
    {
        tag: 'OPERATIONS',
        title: 'One brain running your',
        accent: 'business.',
        body: "Your CRM says one thing, your calendar says another. We wire it all into one system. Leads, pipeline, bookings, reporting. One dashboard that tells you exactly what needs attention.",
        cta: 'How we run operations',
        link: '/services#operations',
        num: '03',
    },
];

export default function ServicesV2() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.service-card-v2',
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%',
                        once: true,
                    },
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-20 md:py-32 bg-accent-light px-6 md:px-12">
            <div className="max-w-6xl mx-auto">
                <div className="mb-12">
                    <span className="font-mono text-xs uppercase tracking-wider text-accent">
                        What we build
                    </span>
                    <h2 className="font-sans font-bold text-3xl md:text-5xl tracking-tight mt-3 text-text">
                        Three ways we help you grow
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {services.map((s) => (
                        <div key={s.num} className="service-card-v2 card-beam rounded-2xl">
                            <MagicCard
                                className="relative z-[1] flex flex-col p-8 h-full bg-surface rounded-[15px] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-lg transition-shadow cursor-default"
                                gradientColor="rgba(0,112,243,0.06)"
                                gradientFrom="#0070F3"
                                gradientTo="#00C2FF"
                            >
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 font-mono text-sm font-bold bg-accent-medium text-accent">
                                    {s.num}
                                </div>
                                <span className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3 block">
                                    {s.tag}
                                </span>
                                <h3 className="font-sans font-bold text-xl mb-1 text-text">
                                    {s.title}{' '}
                                    <span className="font-drama italic font-normal">{s.accent}</span>
                                </h3>
                                <p className="font-body text-sm leading-relaxed text-textMuted mb-6 flex-1">
                                    {s.body}
                                </p>
                                <Link
                                    to={s.link}
                                    className="link-underline inline-flex items-center gap-2 min-h-[44px] font-sans font-bold text-accent text-sm hover:text-accent/80 transition-colors group"
                                >
                                    {s.cta}
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
                            </MagicCard>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
