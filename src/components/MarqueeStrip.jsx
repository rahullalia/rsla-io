import { useEffect, useRef, useState } from 'react';

const labels = [
    'AUTOMATIONS',
    'LEAD GENERATION',
    'CRM INFRASTRUCTURE',
    'OPERATIONS',
    'SMART WEBSITES',
    'DATA ANALYTICS',
];

export default function MarqueeStrip() {
    const stripRef = useRef(null);
    const [fast, setFast] = useState(false);

    useEffect(() => {
        const el = stripRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => setFast(entry.isIntersecting),
            { threshold: 0.5 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const content = labels.map((label, i) => (
        <span key={i} className="flex items-center gap-6 shrink-0">
            <span className="font-mono text-sm md:text-base uppercase tracking-widest whitespace-nowrap">{label}</span>
            <span className="text-cyan text-lg">·</span>
        </span>
    ));

    return (
        <div ref={stripRef} className="w-full bg-dark border-y border-white/10 py-5 overflow-hidden">
            <div
                className="flex gap-6 items-center marquee-track text-accent"
                style={{ animationDuration: fast ? '20s' : '30s' }}
            >
                {/* Duplicate for seamless loop */}
                {content}
                {content}
                {content}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .marquee-track {
                    animation: marqueeScroll linear infinite;
                    width: max-content;
                }
                @keyframes marqueeScroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.333%); }
                }
            `}} />
        </div>
    );
}
