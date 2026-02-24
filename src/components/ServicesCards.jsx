import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Card Visuals ---

function AnimatedBeamVisual() {
    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Source icons */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-6">
                {['Meta', 'Google', 'LinkedIn'].map((name, i) => (
                    <div key={name} className="w-10 h-10 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center font-mono text-[9px] text-white/50 beam-source" style={{ animationDelay: `${i * 0.4}s` }}>
                        {name[0]}
                    </div>
                ))}
            </div>

            {/* Funnel */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2">
                <div className="w-14 h-20 relative">
                    <svg viewBox="0 0 56 80" fill="none" className="w-full h-full">
                        <path d="M4 4 L52 4 L36 40 L36 72 L20 72 L20 40 Z" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="rgba(0,112,243,0.1)" />
                    </svg>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent animate-pulse" />
                </div>
            </div>

            {/* Animated beams */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 200">
                {[60, 100, 140].map((y, i) => (
                    <line key={i} x1="60" y1={y} x2="230" y2="100" stroke="url(#beamGrad)" strokeWidth="1" className="beam-line" style={{ animationDelay: `${i * 0.6}s` }} />
                ))}
                <defs>
                    <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(0,112,243,0)" />
                        <stop offset="50%" stopColor="rgba(0,112,243,0.6)" />
                        <stop offset="100%" stopColor="rgba(0,112,243,0)" />
                    </linearGradient>
                </defs>
            </svg>

            <style dangerouslySetInnerHTML={{ __html: `
                .beam-line {
                    stroke-dasharray: 40 260;
                    animation: beamFlow 2.5s linear infinite;
                }
                @keyframes beamFlow {
                    0% { stroke-dashoffset: 300; }
                    100% { stroke-dashoffset: 0; }
                }
                .beam-source {
                    animation: beamPulse 2s ease-in-out infinite;
                }
                @keyframes beamPulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(0,112,243,0); }
                    50% { box-shadow: 0 0 12px 2px rgba(0,112,243,0.3); }
                }
            `}} />
        </div>
    );
}

function TypewriterVisual() {
    const [lines, setLines] = useState([]);
    const fullConversation = [
        { role: 'system', text: '> New lead captured: Sarah M.' },
        { role: 'bot', text: '> AI: Qualifying lead...' },
        { role: 'bot', text: '> AI: Budget confirmed. Booking call.' },
        { role: 'bot', text: '> AI: Calendar invite sent.' },
        { role: 'system', text: '> Status: MEETING BOOKED' },
    ];

    useEffect(() => {
        let lineIdx = 0;
        let charIdx = 0;
        let currentLines = [];

        const interval = setInterval(() => {
            if (lineIdx >= fullConversation.length) {
                // Reset after pause
                setTimeout(() => {
                    setLines([]);
                    lineIdx = 0;
                    charIdx = 0;
                    currentLines = [];
                }, 2000);
                clearInterval(interval);
                return;
            }

            const currentLine = fullConversation[lineIdx];
            charIdx++;

            if (charIdx <= currentLine.text.length) {
                const updated = [...currentLines, { ...currentLine, text: currentLine.text.slice(0, charIdx) }];
                setLines(updated);
            }

            if (charIdx >= currentLine.text.length) {
                currentLines.push(currentLine);
                lineIdx++;
                charIdx = 0;
            }
        }, 50);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full bg-dark rounded-2xl border border-white/10 p-4 md:p-6 font-mono text-xs overflow-hidden">
            {/* Terminal header */}
            <div className="flex items-center gap-1.5 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-coral/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <span className="ml-2 text-[10px] text-white/30">rsla-bot v2.4</span>
            </div>
            <div className="space-y-1.5">
                {lines.map((line, i) => (
                    <div key={i} className={line.role === 'system' ? 'text-accent' : 'text-white/70'}>
                        {line.text}
                        {i === lines.length - 1 && <span className="inline-block w-1.5 h-3 bg-accent ml-0.5 animate-pulse" />}
                    </div>
                ))}
                {lines.length === 0 && <span className="inline-block w-1.5 h-3 bg-accent animate-pulse" />}
            </div>
        </div>
    );
}

function DashboardVisual() {
    const [counts, setCounts] = useState({ leads: 0, revenue: 0, booked: 0 });

    useEffect(() => {
        const targets = { leads: 847, revenue: 36, booked: 42 };
        const duration = 2000;
        const steps = 60;
        let step = 0;

        const interval = setInterval(() => {
            step++;
            const progress = Math.min(step / steps, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setCounts({
                leads: Math.round(targets.leads * eased),
                revenue: Math.round(targets.revenue * eased),
                booked: Math.round(targets.booked * eased),
            });
            if (step >= steps) clearInterval(interval);
        }, duration / steps);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full rounded-2xl border border-white/10 overflow-hidden bg-dark">
            {/* Browser frame */}
            <div className="flex items-center gap-1.5 px-4 py-2.5 bg-white/5 border-b border-white/10">
                <div className="w-2.5 h-2.5 rounded-full bg-coral/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <div className="ml-2 flex-1 bg-white/5 rounded-md h-5 flex items-center px-2">
                    <span className="text-[9px] text-white/30 font-mono">app.rsla.io/dashboard</span>
                </div>
            </div>
            {/* Dashboard content */}
            <div className="p-4 md:p-6 grid grid-cols-3 gap-3">
                {[
                    { label: 'Leads', value: counts.leads, suffix: '' },
                    { label: 'Revenue', value: counts.revenue, suffix: 'K' },
                    { label: 'Booked', value: counts.booked, suffix: '' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white/5 rounded-xl p-3 text-center">
                        <div className="font-sans font-bold text-xl md:text-2xl text-accent">{stat.value}{stat.suffix}</div>
                        <div className="font-mono text-[9px] uppercase tracking-wider text-white/40 mt-1">{stat.label}</div>
                    </div>
                ))}
                {/* Bar chart */}
                <div className="col-span-3 bg-white/5 rounded-xl p-3 mt-1">
                    <div className="flex items-end gap-1 h-16">
                        {[40, 65, 35, 80, 55, 90, 70, 95, 60, 85, 75, 100].map((h, i) => (
                            <div key={i} className="flex-1 bg-accent/30 rounded-t-sm transition-all duration-700"
                                style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Main Component ---

const services = [
    {
        tag: 'LEAD GEN',
        title: 'Leads that find',
        accent: 'you.',
        body: 'Stop boosting posts and hoping for the best. We build optimized ad campaigns across Meta and Google that learn what works and double down automatically. Every click tracked, every creative tested, every qualified lead fed directly into your pipeline.',
        cta: 'See how we find your leads',
        link: '/services#lead-generation',
        Visual: AnimatedBeamVisual,
    },
    {
        tag: 'ZERO MANUAL WORK',
        title: 'Booking calls while you',
        accent: 'sleep.',
        body: 'If someone messages you at 2 AM, they should have a calendar invite waiting for them by 2:01 AM. We build custom bots and workflow automations that qualify leads, handle customer questions, and do the repetitive work your team should not be wasting time on.',
        cta: 'See automations in action',
        link: '/services#automations',
        Visual: TypewriterVisual,
    },
    {
        tag: 'OPERATIONS',
        title: 'One brain running your',
        accent: 'business.',
        body: 'We consolidate your scattered tools into a single integrated operating system. Pipelines, calendars, follow-ups, and reporting. All connected, all intelligent. Your dashboard tells you what to do next instead of you having to figure it out.',
        cta: 'See how we run operations',
        link: '/services#operations',
        Visual: DashboardVisual,
    },
];

export default function ServicesCards() {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray('.service-card');

            gsap.set(cards, { filter: 'blur(0px)', opacity: 1, scale: 1 });

            cards.forEach((card, i) => {
                if (i === cards.length - 1) return;

                ScrollTrigger.create({
                    trigger: card,
                    start: 'top top',
                    endTrigger: cards[cards.length - 1],
                    end: 'top top',
                    pin: true,
                    pinSpacing: false,
                });

                const nextCard = cards[i + 1];
                if (nextCard) {
                    gsap.fromTo(card,
                        { scale: 1, opacity: 1, filter: 'blur(0px)' },
                        {
                            scale: 0.9, opacity: 0.5, filter: 'blur(20px)',
                            scrollTrigger: {
                                trigger: nextCard,
                                start: 'top bottom',
                                end: 'top top',
                                scrub: true,
                            }
                        }
                    );
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="bg-dark">
            <div className="max-w-7xl mx-auto px-6 pt-10 pb-10 text-center">
                <span className="font-mono text-accent text-xs uppercase tracking-widest font-bold">What We Build</span>
            </div>

            <div className="relative">
                {services.map((service, i) => (
                    <div key={i} className="service-card w-full min-h-screen flex items-center justify-center p-4 md:p-6 bg-dark origin-top" style={{ filter: 'blur(0px)', opacity: 1, scale: 1 }}>
                        <div className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-8 md:p-14 max-w-5xl w-full shadow-2xl flex flex-col md:flex-row gap-8 md:gap-12 items-center backdrop-blur-sm">
                            <div className="flex-1 text-left">
                                <span className="inline-block font-mono text-[10px] md:text-xs uppercase tracking-widest text-accent border border-accent/30 rounded-full px-4 py-1.5 mb-6">
                                    {service.tag}
                                </span>
                                <h3 className="font-sans font-bold text-2xl md:text-4xl lg:text-5xl text-primary mb-4 leading-tight">
                                    {service.title} <span className="font-drama italic font-normal">{service.accent}</span>
                                </h3>
                                <p className="font-body text-sm md:text-base text-white/60 leading-relaxed max-w-md mb-8">
                                    {service.body}
                                </p>
                                <a href={service.link} className="link-underline inline-flex items-center gap-2 font-sans font-bold text-accent text-sm hover:text-white transition-colors group">
                                    {service.cta}
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                                </a>
                            </div>
                            <div className="flex-1 w-full h-64 md:h-96">
                                <service.Visual />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
