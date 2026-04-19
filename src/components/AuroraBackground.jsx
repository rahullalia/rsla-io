/**
 * Aurora Background — adapted from Aceternity (via 21st.dev)
 * CSS-only aurora effect with brand blue gradient.
 * No Framer Motion. Uses Tailwind animate-aurora keyframe.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

export default function AuroraBackground({ children, className, showRadialGradient = true }) {
    const bgRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to('.aurora-gradient-layer', {
                yPercent: 30, // Move down 30% of its height on scroll
                ease: 'none',
                scrollTrigger: {
                    trigger: bgRef.current,
                    start: 'top top',
                    end: 'bottom top', // when bottom of viewport hits top of viewport
                    scrub: true,
                }
            });
        }, bgRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={bgRef}
            className={cn(
                'relative flex flex-col min-h-[calc(100dvh-80px)] lg:h-[100dvh] items-center justify-center bg-background text-text transition-colors',
                className
            )}
        >
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className={cn(
                        `aurora-gradient-layer [--white-gradient:repeating-linear-gradient(100deg,_#F8FAFC_0%,_#F8FAFC_7%,_transparent_10%,_transparent_12%,_#F8FAFC_16%)]
                        [--aurora:repeating-linear-gradient(100deg,_#0070F3_10%,_#00C2FF_15%,_#38bdf8_20%,_#93c5fd_25%,_#0070F3_30%)]
                        [background-image:var(--white-gradient),var(--aurora)]
                        [background-size:300%,_200%]
                        [background-position:50%_50%,50%_50%]
                        filter blur-[10px] invert
                        after:content-[""] after:absolute after:inset-0
                        after:[background-image:var(--white-gradient),var(--aurora)]
                        after:[background-size:200%,_100%]
                        after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
                        pointer-events-none
                        absolute -inset-[10px] opacity-50 will-change-transform`,
                        showRadialGradient &&
                        '[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]'
                    )}
                />
            </div>
            <div className="relative z-10 w-full">{children}</div>
        </div>
    );
}
