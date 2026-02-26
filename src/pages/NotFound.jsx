import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { FlickeringGrid } from '@/components/ui/flickering-grid';
import { TextAnimate } from '@/components/ui/text-animate';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import Seo from '../components/Seo';

export default function NotFound() {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.nf-content',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
            );
            gsap.fromTo('.nf-cta',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.6 }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <main ref={containerRef} className="min-h-screen bg-surface relative overflow-hidden flex items-center justify-center">
            <Seo title="Page Not Found | RSL/A" noIndex />

            {/* Flickering grid background */}
            <div className="absolute inset-0 z-0">
                <FlickeringGrid
                    className="w-full h-full"
                    squareSize={4}
                    gridGap={6}
                    color="rgb(0, 112, 243)"
                    maxOpacity={0.08}
                    flickerChance={0.3}
                />
            </div>

            {/* Soft radial overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,112,243,0.06),transparent_70%)] pointer-events-none z-[1]" />

            <section className="relative z-10 px-6 py-32 w-full max-w-2xl mx-auto text-center">
                {/* 404 Number */}
                <div className="nf-content">
                    <div className="mb-6">
                        <TextAnimate
                            as="h1"
                            className="text-[10rem] md:text-[14rem] font-sans font-bold leading-none tracking-tighter text-accent/30"
                            animation="blurIn"
                            duration={0.8}
                        >
                            404
                        </TextAnimate>
                    </div>

                    {/* Message */}
                    <h2 className="text-3xl md:text-4xl font-sans font-bold text-text mb-4 tracking-tight">
                        This page does not exist.
                    </h2>
                    <p className="font-body text-textMuted text-base leading-relaxed mb-12 max-w-md mx-auto">
                        Whatever you were looking for is not here. It may have moved, or it might never have existed. Either way, let's get you somewhere useful.
                    </p>
                </div>

                {/* CTAs */}
                <div className="nf-cta flex flex-col items-center gap-5">
                    <Link to="/">
                        <InteractiveHoverButton className="px-10 py-3.5 text-sm font-bold">
                            Back to Home
                        </InteractiveHoverButton>
                    </Link>
                    <div className="flex gap-4">
                        <Link
                            to="/work"
                            className="px-6 py-2.5 text-textMuted hover:text-accent border border-accent/20 hover:border-accent/50 rounded-full font-sans font-bold text-sm transition-all duration-300"
                        >
                            Case Studies
                        </Link>
                        <Link
                            to="/blog"
                            className="px-6 py-2.5 text-textMuted hover:text-accent border border-accent/20 hover:border-accent/50 rounded-full font-sans font-bold text-sm transition-all duration-300"
                        >
                            Blog
                        </Link>
                        <Link
                            to="/start-here"
                            className="px-6 py-2.5 text-textMuted hover:text-accent border border-accent/20 hover:border-accent/50 rounded-full font-sans font-bold text-sm transition-all duration-300"
                        >
                            Start Here
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
