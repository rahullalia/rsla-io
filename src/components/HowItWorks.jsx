import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagicCard } from './ui/magic-card';

gsap.registerPlugin(ScrollTrigger);

const steps = [
    {
        num: '01',
        title: 'We audit your business',
        desc: 'Find the manual work AI should handle. We map every workflow, every bottleneck, every hour wasted on tasks a machine could do better.',
    },
    {
        num: '02',
        title: 'We build your AI system',
        desc: 'Custom infrastructure, not templates. Lead gen, automations, CRM pipelines, AI bots. All built specifically for how your business operates.',
    },
    {
        num: '03',
        title: 'We optimize and scale',
        desc: 'Continuous improvement. We monitor performance, refine automations, and scale what works. Your system gets smarter the longer it runs.',
    },
];

export default function HowItWorks() {
    const sectionRef = useRef(null);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const sections = gsap.utils.toArray('.hiw-card');

            gsap.to(sections, {
                xPercent: -100 * (sections.length - 1),
                ease: 'none', // Important for smooth scrolling
                scrollTrigger: {
                    trigger: sectionRef.current,
                    pin: true,
                    scrub: 1, // Smooth scrub
                    snap: 1 / (sections.length - 1), // Optional: snaps to closest step
                    end: () => "+=" + scrollContainerRef.current.offsetWidth
                }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="w-full h-screen bg-sand flex items-center overflow-hidden relative">
            {/* Header Content - Fixed inside pinned section */}
            <div className="absolute top-16 md:top-24 left-6 md:left-12 z-10 w-full mb-8 pointer-events-none">
                <span className="font-mono text-accent text-xs uppercase tracking-widest font-bold">The Process</span>
                <h2 className="font-sans font-bold text-3xl md:text-5xl text-text tracking-tight mt-4">
                    How it <span className="font-drama italic font-bold text-accent">works.</span>
                </h2>
            </div>

            {/* Scrolling Container */}
            <div ref={scrollContainerRef} className="flex h-full w-[300vw] items-center pt-24 md:pt-0">
                {steps.map((step) => (
                    <div key={step.num} className="hiw-card w-screen h-full flex-shrink-0 flex items-center justify-center p-6 md:p-12">
                        <MagicCard
                            className="w-full max-w-lg cursor-pointer flex-col overflow-hidden bg-background shadow-2xl p-8 md:p-12 border-border/50 text-text rounded-2xl"
                            gradientColor="rgba(0, 112, 243, 0.1)"
                        >
                            <div className="font-drama italic font-bold text-6xl text-accent flex-shrink-0 mb-6">{step.num}</div>
                            <h3 className="font-sans font-bold text-2xl md:text-3xl mb-4">{step.title}</h3>
                            <p className="font-body text-textMuted text-base md:text-lg leading-relaxed">{step.desc}</p>
                        </MagicCard>
                    </div>
                ))}
            </div>
        </section>
    );
}
