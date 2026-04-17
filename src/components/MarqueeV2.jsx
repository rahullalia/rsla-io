/**
 * MarqueeV2 — Magic UI Marquee replacing inline CSS animation.
 * Light theme. Service labels scrolling.
 */

import { Marquee } from '@/components/ui/marquee';

const labels = [
    'AUTOMATIONS',
    'LEAD GENERATION',
    'CRM INFRASTRUCTURE',
    'OPERATIONS',
    'SMART WEBSITES',
    'DATA ANALYTICS',
    'AI CHATBOTS',
    'PAID ADS',
];

export default function MarqueeV2() {
    return (
        <div className="w-full bg-surfaceAlt border-y border-accent-border py-5 overflow-hidden">
            <Marquee pauseOnHover className="[--duration:30s]">
                {labels.map((label) => (
                    <span
                        key={label}
                        className="flex items-center gap-6 mx-3"
                    >
                        <span className="font-sans text-lg uppercase tracking-widest whitespace-nowrap text-accent">
                            {label}
                        </span>
                        <span className="text-cyan text-lg">·</span>
                    </span>
                ))}
            </Marquee>
        </div>
    );
}
