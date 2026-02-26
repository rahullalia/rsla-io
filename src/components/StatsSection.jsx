/**
 * StatsSection — Number Ticker count-up stats on scroll.
 * Uses Magic UI NumberTicker component.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NumberTicker } from '@/components/ui/number-ticker';

gsap.registerPlugin(ScrollTrigger);

const stats = [
    { value: 40, suffix: '+', label: 'Clients served' },
    { value: 2.1, suffix: 'M', prefix: '$', decimals: 1, label: 'Revenue generated' },
    { value: 12, suffix: '', label: 'Case studies' },
    { value: 98, suffix: '%', label: 'Client retention' },
];

export default function StatsSection() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.stat-item',
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
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
        <section
            ref={sectionRef}
            className="bg-surface border-y border-accent-border px-6 md:px-12 py-16"
        >
            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {stats.map((stat) => (
                    <div key={stat.label} className="stat-item">
                        <div className="font-sans font-bold text-4xl md:text-5xl tracking-tight text-text">
                            {stat.prefix || ''}
                            <NumberTicker
                                value={stat.value}
                                decimalPlaces={stat.decimals || 0}
                            />
                            {stat.suffix}
                        </div>
                        <div className="font-body text-sm mt-2 text-textMuted">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
