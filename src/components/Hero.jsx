import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import CanvasParticles from './CanvasParticles';

export default function Hero() {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Word-by-word stagger on headline
            gsap.fromTo('.hero-word',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, stagger: 0.08, ease: 'power3.out', delay: 0.5 }
            );

            // SVG underline draws in after stagger completes
            const wordCount = document.querySelectorAll('.hero-word').length;
            const underlineDelay = 0.5 + wordCount * 0.08 + 0.3;
            gsap.fromTo('.accent-underline',
                { strokeDashoffset: 200 },
                { strokeDashoffset: 0, duration: 0.8, ease: 'power2.out', delay: underlineDelay }
            );

            // CTAs fade up after headline
            gsap.fromTo('.hero-cta',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: underlineDelay + 0.2 }
            );

            // Tags fade in
            gsap.fromTo('.hero-tag',
                { y: 10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: 'power3.out', delay: 0.3 }
            );
        }, containerRef);

        // Magnetic button effect
        const magneticBtns = containerRef.current.querySelectorAll('.magnetic-btn');
        const handlers = [];

        magneticBtns.forEach((btn) => {
            const onMove = (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                const dist = Math.sqrt(x * x + y * y);
                if (dist < 80) {
                    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
                }
            };
            const onLeave = () => {
                btn.style.transform = '';
            };
            btn.addEventListener('mousemove', onMove);
            btn.addEventListener('mouseleave', onLeave);
            handlers.push({ btn, onMove, onLeave });
        });

        return () => {
            ctx.revert();
            handlers.forEach(({ btn, onMove, onLeave }) => {
                btn.removeEventListener('mousemove', onMove);
                btn.removeEventListener('mouseleave', onLeave);
            });
        };
    }, []);

    const headlineWords = ['Your', 'business', 'is', 'doing', 'manually', 'what', 'AI', 'could', 'do', 'in'];

    return (
        <section ref={containerRef} className="relative w-full h-[100dvh] flex flex-col justify-end bg-dark overflow-hidden">
            <CanvasParticles />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-24 md:pb-32 flex flex-col items-start">
                {/* Tags */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {['AUTOMATIONS', 'LEAD GEN', 'OPERATIONS'].map((tag) => (
                        <span key={tag} className="hero-tag font-mono text-[10px] md:text-xs uppercase tracking-widest text-white/60 border border-white/20 rounded-full px-4 py-1.5">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Headline */}
                <h1 className="font-sans font-bold text-primary text-3xl sm:text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] max-w-4xl mb-6">
                    {headlineWords.map((word, i) => (
                        <span key={i} className="hero-word inline-block mr-[0.3em]">{word}</span>
                    ))}
                    <span className="hero-word inline-block relative">
                        <span className="font-drama italic font-normal">seconds.</span>
                        <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
                            <path
                                d="M0 8 Q50 0 100 6 Q150 12 200 4"
                                stroke="#0070F3"
                                strokeWidth="3"
                                strokeLinecap="round"
                                fill="none"
                                className="accent-underline"
                                strokeDasharray="200"
                                strokeDashoffset="200"
                            />
                        </svg>
                    </span>
                </h1>

                {/* Subheadline */}
                <p className="hero-cta font-body text-white/60 text-base md:text-lg max-w-xl mb-10 leading-relaxed">
                    I show founders how to put AI to work, then I build it for them. Lead generation, customer handling, follow-ups, operations. If it is repetitive, AI should be doing it. Not you.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap gap-4">
                    <a href="#contact" className="hero-cta magnetic-btn relative px-8 py-4 rounded-full bg-accent text-white font-sans font-bold text-lg transition-transform hover:scale-[1.03] active:scale-[0.98] duration-300 shadow-[0_0_40px_rgba(0,112,243,0.3)] hover:shadow-[0_0_60px_rgba(0,112,243,0.5)] border-beam btn-neon">
                        <span className="relative z-10 flex items-center gap-2">
                            Build My System
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                        </span>
                    </a>
                    <Link to="/work" className="hero-cta magnetic-btn relative px-8 py-4 rounded-full text-white font-sans font-bold text-lg transition-all hover:scale-[1.03] active:scale-[0.98] duration-300 btn-gradient-border">
                        <span className="relative z-10">See What We've Built</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
