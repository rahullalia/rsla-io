import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Card Visuals ---

function AnimatedBeamVisual() {
    const platforms = [
        { name: 'Facebook', color: '#1877F2', icon: 'f' },
        { name: 'Google', color: '#4285F4', icon: 'G' },
        { name: 'LinkedIn', color: '#0A66C2', icon: 'in' },
    ];

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Source platform cards */}
            <div className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 md:gap-5">
                {platforms.map((p, i) => (
                    <div key={p.name} className="beam-source flex items-center gap-2 md:gap-2.5 px-2.5 md:px-3 py-2 md:py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] backdrop-blur-sm" style={{ animationDelay: `${i * 0.5}s` }}>
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs md:text-sm shrink-0" style={{ backgroundColor: p.color + '20', border: `1px solid ${p.color}40` }}>
                            <span style={{ color: p.color }}>{p.icon}</span>
                        </div>
                        <span className="font-body text-[10px] md:text-xs text-white/60 hidden sm:block">{p.name}</span>
                    </div>
                ))}
            </div>

            {/* Funnel visualization */}
            <div className="absolute right-4 md:right-10 top-1/2 -translate-y-[40%] flex flex-col items-center">
                <svg width="110" height="130" viewBox="0 0 110 130" fill="none" className="md:w-[130px] md:h-[155px]">
                    <defs>
                        <filter id="funnelGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <linearGradient id="funnelFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                            <stop offset="50%" stopColor="rgba(200,220,255,0.06)" />
                            <stop offset="100%" stopColor="rgba(180,210,255,0.03)" />
                        </linearGradient>
                    </defs>
                    {/* Wide mouth tapering to narrow spout */}
                    <path d="M2 6 Q2 2 6 2 L104 2 Q108 2 108 6 L108 14 L64 70 L64 110 Q64 116 58 116 L52 116 Q46 116 46 110 L46 70 L2 14 Z" fill="url(#funnelFill)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" filter="url(#funnelGlow)" />
                    {/* Filter lines */}
                    <line x1="16" y1="30" x2="94" y2="30" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="4 4" />
                    <line x1="30" y1="50" x2="80" y2="50" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" strokeDasharray="3 3" />
                    {/* Drip */}
                    <circle cx="55" cy="124" r="3" fill="rgba(200,220,255,0.6)" className="funnel-drip" />
                </svg>
                {/* Output label */}
                <div className="mt-1 md:mt-2 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-[8px] md:text-[9px] uppercase tracking-wider text-emerald-400/70">Qualified Leads</span>
                </div>
            </div>

            {/* Dots only — traveling from platforms into funnel top */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 240">
                {/* Invisible paths for dot motion — curves from each platform into the funnel mouth */}
                <circle r="4" fill="#1877F2" className="beam-dot">
                    <animateMotion dur="2.2s" repeatCount="indefinite" path="M100,55 C160,30 250,10 310,45" />
                </circle>
                <circle r="4" fill="#4285F4" className="beam-dot">
                    <animateMotion dur="2.4s" repeatCount="indefinite" path="M100,120 C180,80 250,30 310,45" begin="0.7s" />
                </circle>
                <circle r="4" fill="#0A66C2" className="beam-dot">
                    <animateMotion dur="2.6s" repeatCount="indefinite" path="M100,185 C170,150 250,50 310,45" begin="1.4s" />
                </circle>
                {/* Second wave of dots (staggered) for continuous flow feel */}
                <circle r="3" fill="#1877F2" opacity="0.5" className="beam-dot">
                    <animateMotion dur="2.2s" repeatCount="indefinite" path="M100,55 C160,30 250,10 310,45" begin="1.1s" />
                </circle>
                <circle r="3" fill="#4285F4" opacity="0.5" className="beam-dot">
                    <animateMotion dur="2.4s" repeatCount="indefinite" path="M100,120 C180,80 250,30 310,45" begin="1.9s" />
                </circle>
                <circle r="3" fill="#0A66C2" opacity="0.5" className="beam-dot">
                    <animateMotion dur="2.6s" repeatCount="indefinite" path="M100,185 C170,150 250,50 310,45" begin="2.7s" />
                </circle>
            </svg>

            <style dangerouslySetInnerHTML={{ __html: `
                .beam-source {
                    animation: sourcePulse 3s ease-in-out infinite;
                }
                @keyframes sourcePulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(0,112,243,0); }
                    50% { box-shadow: 0 0 20px 4px rgba(0,112,243,0.15); }
                }
                .beam-dot {
                    filter: drop-shadow(0 0 6px currentColor);
                }
                .funnel-drip {
                    animation: drip 2s ease-in-out infinite;
                }
                @keyframes drip {
                    0%, 100% { opacity: 0.3; r: 2; }
                    50% { opacity: 1; r: 4; }
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
