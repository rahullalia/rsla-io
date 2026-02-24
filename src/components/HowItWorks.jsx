import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.hiw-step',
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 70%',
                        once: true,
                    }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="w-full bg-sand py-24 md:py-32">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="text-center mb-16 md:mb-20">
                    <span className="font-mono text-accent text-xs uppercase tracking-widest font-bold">The Process</span>
                    <h2 className="font-sans font-bold text-3xl md:text-5xl text-dark tracking-tight mt-4">
                        How it <span className="font-drama italic font-normal">works.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {steps.map((step) => (
                        <div key={step.num} className="hiw-step text-center md:text-left">
                            <div className="font-drama italic font-normal text-6xl text-accent mb-4">{step.num}</div>
                            <h3 className="font-sans font-bold text-xl md:text-2xl text-dark mb-3">{step.title}</h3>
                            <p className="font-body text-dark/60 text-sm md:text-base leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
