import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export default function FounderSection() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Text fade up
            gsap.fromTo('.founder-text',
                { y: 40, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 65%',
                        once: true,
                    }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="w-full bg-surface py-24 md:py-32">
            <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-12 md:gap-16 items-start">
                {/* Photo */}
                <div className="md:sticky md:top-32 w-full md:w-2/5 flex-shrink-0">
                    <div className="w-full aspect-[3/4] rounded-[2rem] bg-accent-light overflow-hidden transition-all duration-700 hover:scale-[1.02]">
                        <img src="/images/rahul.webp" alt="Rahul Lalia" className="w-full h-full object-cover" />
                    </div>
                </div>

                {/* Text */}
                <div className="flex-1">
                    <h2 className="founder-text font-sans font-bold text-3xl md:text-5xl text-text tracking-tight mb-8">
                        Hi. I'm Rahul.
                    </h2>
                    <div className="space-y-6 font-body text-textMuted text-base md:text-lg leading-relaxed">
                        <p className="founder-text">
                            I have spent the better part of five years in the trenches of marketing, automation, and business infrastructure. Started in analytics. Got laid off. Built an agency from nothing. And along the way, I watched founders with real talent suffocate under work that never should have touched their hands.
                        </p>
                        <p className="founder-text">
                            That became the only question worth answering: how do you build systems that actually run a business, not just look good in a demo?
                        </p>
                        <p className="founder-text">
                            I put everything out there. The strategies, the tools, the exact workflows. You can learn all of it from my content. But knowing how it works and actually building it so it holds under pressure and scales without breaking? That demands precision. That is what RSL/A exists to do.
                        </p>
                    </div>

                    <div className="founder-text mt-10 border-t border-accent-border pt-8">
                        <p className="font-drama italic font-bold text-xl text-text mb-1">Rahul Lalia</p>
                        <p className="font-mono text-xs uppercase tracking-widest text-textMuted">Founder, RSL/A</p>
                    </div>

                    <Link to="/blog" className="founder-text link-underline inline-flex items-center gap-2 mt-8 font-sans font-bold text-accent hover:text-accent/80 transition-colors group">
                        Learn AI with me
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
