/**
 * HeroV2 — Aurora Background + TextAnimate headline + InteractiveHoverButton CTAs
 * Light theme version. Replaces dark Hero with CanvasParticles.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import AuroraBackground from './AuroraBackground';
import { TextAnimate } from '@/components/ui/text-animate';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';

export default function HeroV2() {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // CTAs fade up
            gsap.fromTo(
                '.hero-cta',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 1.2 }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <AuroraBackground>
            <div ref={containerRef} className="w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-start justify-end h-[100dvh] pb-24 md:pb-32">
                {/* Headline */}
                <h1 className="font-sans font-bold text-text text-3xl sm:text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] max-w-4xl mb-6">
                    <TextAnimate
                        animation="blurInUp"
                        by="word"
                        delay={0.08}
                        startOnView={false}
                        as="span"
                    >
                        Your business is doing manually what AI could do in
                    </TextAnimate>{' '}
                    <span className="font-drama italic font-normal text-accent">
                        <TextAnimate
                            animation="blurInUp"
                            by="word"
                            delay={0.08}
                            startOnView={false}
                            as="span"
                        >
                            seconds.
                        </TextAnimate>
                    </span>
                </h1>

                {/* CTAs */}
                <div className="flex flex-wrap gap-4">
                    <a href="#contact" className="hero-cta">
                        <InteractiveHoverButton className="font-sans font-bold text-base px-8 py-4 rounded-full">
                            Build My System
                        </InteractiveHoverButton>
                    </a>
                    <Link
                        to="/work"
                        className="hero-cta inline-flex items-center px-8 py-4 rounded-full font-sans font-bold text-base text-text border border-accent-border-strong hover:border-accent/30 hover:bg-accent-light transition-all"
                    >
                        See What We've Built
                    </Link>
                </div>
            </div>
        </AuroraBackground>
    );
}
