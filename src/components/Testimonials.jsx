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
        name: 'Sid S.',
        role: 'Account Executive, SBC',
        body: "I recently hired Rahul to revamp our company website, and I couldn't be more thrilled with the results! Their expertise and dedication transformed my site by restructuring it, fixing critical errors, and significantly boosting its performance. Thanks to their outstanding work on on-page SEO and ongoing SEO efforts, my website has seen a remarkable increase in organic traffic and a substantial improvement in qualified inbound lead generation.",
        featured: true,
    },
    {
        name: 'Curtis H.',
        role: 'CEO/Founder, AdReviveAI',
        body: 'Working with Rahul on my GoHighLevel setup was an excellent experience. He was extremely knowledgeable, responsive, and efficient from start to finish. Rahul quickly understood what I needed and structured my GHL account properly. Pipelines, automations, workflows, integrations, and overall system flow.',
    },
    {
        name: 'Chris K.',
        role: 'CEO/Co-Founder, Fieldshare',
        body: 'Rahul redesigned our website, handled SEO optimization, and set up blogging automation. Site looks great, ranks better, and the automation saves us tons of time. Great communication and delivered on schedule. Highly recommend.',
    },
    {
        name: 'Laiz C.',
        role: 'CEO, Casagrande Salon',
        body: "I tried for months to rent my salon space and nothing worked. After Rahul and RSL/A, in just a few months both my rooms were filled. Now I don't stress about rent anymore.",
    },
    {
        name: 'Parminder S.',
        role: 'CEO/Founder, Chauffeur on Demand',
        body: 'Rahul does a stellar job on setting up GHL accounts. He is an expert and gave me immense knowledge about the platform. Would love to work with him again. Highly recommend anyone who wants an expert on Go High Level.',
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
                featured ? 'lg:row-span-2' : ''
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

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
                    {testimonials.map((t) => (
                        <TestimonialCard key={t.name} {...t} />
                    ))}
                </div>
            </div>
        </section>
    );
}
