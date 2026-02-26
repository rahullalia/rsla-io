import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Seo from '../components/Seo';

gsap.registerPlugin(ScrollTrigger);

const steps = [
    {
        num: '01',
        tag: '30 MIN CALL',
        title: 'Let\'s Talk (Free)',
        body: [
            'You book a call. We screen share. I look at your business and tell you exactly where AI should be doing the work instead of you.',
            'No pitch deck. No discovery questionnaire. Just me looking at your tools, your lead flow, and your operations, and pointing at the gaps.',
            'You walk away with a clear picture of what AI can do for your business. If you want to build it yourself after that, go for it. Seriously.',
        ],
    },
    {
        num: '02',
        tag: '2 TO 4 WEEKS',
        title: 'The Build',
        body: [
            'If you want us to build it, we get to work. Your AI system gets designed, built, and tested. Lead generation, automations, operations. Whatever we identified on the call.',
            'You do not need to learn anything technical. You do not need to manage the project. We handle everything and you see progress in real time.',
        ],
    },
    {
        num: '03',
        tag: 'YOUR SYSTEM, YOUR DATA',
        title: 'The Handoff',
        body: [
            'We hand you a fully working AI system with a dashboard that shows you exactly what it is doing. Not a black box you do not understand. A system you own, with numbers you can read.',
            'We walk you through everything. And if you want ongoing optimization, we are here for that too.',
        ],
    },
];

export default function HowItWorksPage() {
    const pageRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);

        const ctx = gsap.context(() => {
            gsap.fromTo('.hiw-hero-content',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.1 }
            );

            document.querySelectorAll('.hiw-expanded-step').forEach((step) => {
                gsap.fromTo(step.querySelectorAll('.hiw-animate'),
                    { y: 40, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out',
                        scrollTrigger: {
                            trigger: step,
                            start: 'top 70%',
                            once: true,
                        }
                    }
                );
            });
        }, pageRef);

        return () => ctx.revert();
    }, []);

    return (
        <main ref={pageRef} className="min-h-screen">
            <Seo
                title="How It Works | RSL/A"
                description="Our process from first call to live systems. Discovery, strategy, build, and launch in weeks, not months."
                canonical="https://rsla.io/how-it-works"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'HowTo',
                    name: 'How RSL/A Works',
                    description: 'Our process from first call to live systems. Discovery, strategy, build, and launch in weeks, not months.',
                    step: [
                        { '@type': 'HowToStep', position: 1, name: 'Free Discovery Call', text: 'Book a call. We screen share, look at your business, and tell you exactly where AI should be doing the work instead of you.' },
                        { '@type': 'HowToStep', position: 2, name: 'The Build', text: 'Your AI system gets designed, built, and tested. Lead generation, automations, operations. Everything we identified on the call.' },
                        { '@type': 'HowToStep', position: 3, name: 'Launch & Optimize', text: 'We launch your system, monitor performance, and optimize continuously. Your system gets smarter the longer it runs.' },
                    ],
                }}
            />
            {/* Hero */}
            <section className="bg-surface pt-32 pb-20 md:pb-28 px-6 md:px-12">
                <div className="hiw-hero-content max-w-4xl mx-auto text-center">
                    <h1 className="font-sans font-bold text-4xl md:text-6xl lg:text-7xl text-text tracking-tight mb-6 leading-tight">
                        From "I think I need this" to <span className="font-drama italic font-normal">running.</span>
                    </h1>
                    <p className="font-body text-textMuted max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                        Here is exactly how it works. No surprises, no scope creep, no six month timelines.
                    </p>
                </div>
            </section>

            {/* Steps */}
            {steps.map((step, i) => (
                <section key={step.num} className={`hiw-expanded-step ${i % 2 === 0 ? 'bg-surfaceAlt' : 'bg-surface'} py-20 md:py-28 px-6 md:px-12`}>
                    <div className="max-w-3xl mx-auto">
                        <div className="hiw-animate font-drama italic font-normal text-6xl md:text-8xl text-accent mb-4">
                            {step.num}
                        </div>

                        <span className="hiw-animate inline-block font-mono text-[10px] md:text-xs uppercase tracking-widest text-accent border border-accent/30 rounded-full px-4 py-1.5 mb-6">
                            {step.tag}
                        </span>

                        <h2 className="hiw-animate font-sans font-bold text-2xl md:text-4xl text-text tracking-tight mb-8">
                            {step.title}
                        </h2>

                        {step.body.map((paragraph, j) => (
                            <p key={j} className="hiw-animate font-body text-textMuted text-base md:text-lg leading-relaxed mb-6 last:mb-0">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </section>
            ))}

        </main>
    );
}
