/**
 * Testimonials — adapted from Tailus (via 21st.dev)
 * Masonry grid with lifted white cards. Featured card spans 2 cols/rows.
 * GSAP ScrollTrigger stagger entrance.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
    {
        name: 'Sarah Chen',
        role: 'CEO, TechFlow Solutions',
        body: "Rahul didn't just run our ads. He rebuilt our entire lead flow from scratch. Within 60 days we went from guessing to having a system that practically runs itself. The dashboard alone saved us 10 hours a week in reporting.",
        featured: true,
    },
    {
        name: 'Marcus Rivera',
        role: 'Founder, Rivera Construction',
        body: 'The AI chatbot he built for us handles 80% of inquiries before they even reach our team. Our response time went from hours to seconds.',
    },
    {
        name: 'Priya Sharma',
        role: 'COO, Momentum Health',
        body: 'We were spending $12K a month on ads with zero tracking. Rahul set up attribution, cut waste, and tripled our qualified leads.',
    },
    {
        name: 'Jason Park',
        role: 'Founder, Park Digital',
        body: "Honestly, I was skeptical about AI automation. But the systems Rahul built saved us 20 hours a week. That's not hype, that's real.",
    },
    {
        name: 'Elena Voss',
        role: 'Director, Voss & Co Real Estate',
        body: "Our CRM was a mess. Three tools that didn't talk to each other. Rahul wired everything into one dashboard. Now I know exactly where every lead stands.",
    },
];

function Avatar({ name }) {
    const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('');
    return (
        <div className="w-12 h-12 rounded-full bg-accent-medium flex items-center justify-center text-accent font-sans font-bold text-sm shrink-0">
            {initials}
        </div>
    );
}

function TestimonialCard({ name, role, body, featured = false }) {
    return (
        <div
            className={`testimonial-card bg-surface rounded-2xl p-6 sm:p-8 border border-accent-border shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-lg transition-shadow ${
                featured ? 'sm:col-span-2 lg:row-span-2' : ''
            }`}
        >
            <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                <p className={`font-body leading-relaxed text-text ${featured ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'}`}>
                    &ldquo;{body}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                    <Avatar name={name} />
                    <div>
                        <cite className="font-sans font-medium text-sm text-text not-italic">{name}</cite>
                        <span className="block font-body text-xs text-textMuted">{role}</span>
                    </div>
                </div>
            </blockquote>
        </div>
    );
}

export default function Testimonials() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.testimonial-card',
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    stagger: 0.1,
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
    }, []);

    return (
        <section ref={sectionRef} className="py-20 md:py-32 bg-surfaceAlt px-6 md:px-12">
            <div className="max-w-6xl mx-auto space-y-12">
                <div className="max-w-xl mx-auto text-center space-y-4">
                    <span className="font-mono text-xs uppercase tracking-wider text-accent">
                        What clients say
                    </span>
                    <h2 className="font-sans font-bold text-3xl md:text-5xl tracking-tight text-text">
                        Real results, real businesses
                    </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-rows-2">
                    {testimonials.map((t) => (
                        <TestimonialCard key={t.name} {...t} />
                    ))}
                </div>
            </div>
        </section>
    );
}
