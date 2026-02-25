import { useState, useEffect, useRef } from 'react';

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
                    <path d="M2 6 Q2 2 6 2 L104 2 Q108 2 108 6 L108 14 L64 70 L64 110 Q64 116 58 116 L52 116 Q46 116 46 110 L46 70 L2 14 Z" fill="url(#funnelFill)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" filter="url(#funnelGlow)" />
                    <line x1="16" y1="30" x2="94" y2="30" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="4 4" />
                    <line x1="30" y1="50" x2="80" y2="50" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" strokeDasharray="3 3" />
                </svg>
                <div className="mt-2 md:mt-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-[8px] md:text-[9px] uppercase tracking-wider text-emerald-400/70">Qualified Leads</span>
                    <span className="font-bold text-[8px] md:text-[9px] text-emerald-400 funnel-drip">$$$</span>
                </div>
            </div>

            {/* Animated dots */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 240">
                <circle r="4" fill="#1877F2" className="beam-dot">
                    <animateMotion dur="2.5s" repeatCount="indefinite" path="M100,60 C150,-10 280,-10 305,15 Q315,25 310,80" />
                </circle>
                <circle r="4" fill="#4285F4" className="beam-dot">
                    <animateMotion dur="2.7s" repeatCount="indefinite" path="M100,120 C150,20 270,-10 305,15 Q315,25 310,80" begin="0.8s" />
                </circle>
                <circle r="4" fill="#0A66C2" className="beam-dot">
                    <animateMotion dur="2.9s" repeatCount="indefinite" path="M100,185 C150,60 270,-10 305,15 Q315,25 310,80" begin="1.6s" />
                </circle>
                <circle r="3" fill="#1877F2" opacity="0.5" className="beam-dot">
                    <animateMotion dur="2.5s" repeatCount="indefinite" path="M100,60 C150,-10 280,-10 305,15 Q315,25 310,80" begin="1.25s" />
                </circle>
                <circle r="3" fill="#4285F4" opacity="0.5" className="beam-dot">
                    <animateMotion dur="2.7s" repeatCount="indefinite" path="M100,120 C150,20 270,-10 305,15 Q315,25 310,80" begin="2.15s" />
                </circle>
                <circle r="3" fill="#0A66C2" opacity="0.5" className="beam-dot">
                    <animateMotion dur="2.9s" repeatCount="indefinite" path="M100,185 C150,60 270,-10 305,15 Q315,25 310,80" begin="3.05s" />
                </circle>
            </svg>

            <style dangerouslySetInnerHTML={{ __html: `
                .beam-source { animation: sourcePulse 3s ease-in-out infinite; }
                @keyframes sourcePulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(0,112,243,0); }
                    50% { box-shadow: 0 0 20px 4px rgba(0,112,243,0.15); }
                }
                .beam-dot { filter: drop-shadow(0 0 6px currentColor); }
                .funnel-drip { animation: drip 2s ease-in-out infinite; }
                @keyframes drip {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                }
            `}} />
        </div>
    );
}

function TypewriterVisual() {
    const [lines, setLines] = useState([]);
    const fullConversation = [
        { role: 'system', text: '> Inbound lead: Sarah M. via Instagram' },
        { role: 'bot', text: '> Bot: Hey Sarah! What service are you looking for?' },
        { role: 'system', text: '> Sarah: I need help with my Google ads' },
        { role: 'bot', text: '> Bot: Got it. What\'s your monthly ad budget?' },
        { role: 'system', text: '> Sarah: Around $3,000' },
        { role: 'bot', text: '> Bot: Perfect. Grabbing a time for you...' },
        { role: 'bot', text: '> Bot: You\'re booked for Thursday 2pm.' },
        { role: 'system', text: '> Status: CALL BOOKED ✓' },
    ];

    useEffect(() => {
        let lineIdx = 0;
        let charIdx = 0;
        let currentLines = [];
        let interval;
        let timeout;

        function startTyping() {
            lineIdx = 0;
            charIdx = 0;
            currentLines = [];
            setLines([]);

            interval = setInterval(() => {
                if (lineIdx >= fullConversation.length) {
                    clearInterval(interval);
                    timeout = setTimeout(startTyping, 2500);
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
        }

        startTyping();

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    return (
        <div className="w-full h-full bg-dark rounded-2xl border border-white/10 p-4 md:p-6 font-mono text-xs overflow-hidden">
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
    const ref = useRef(null);
    const [counts, setCounts] = useState({ leads: 0, revenue: 0, booked: 0 });
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started) setStarted(true);
            },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [started]);

    useEffect(() => {
        if (!started) return;
        const targets = { leads: 847, revenue: 36, booked: 42 };
        const duration = 2000;
        const steps = 60;
        let step = 0;

        const interval = setInterval(() => {
            step++;
            const progress = Math.min(step / steps, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCounts({
                leads: Math.round(targets.leads * eased),
                revenue: Math.round(targets.revenue * eased),
                booked: Math.round(targets.booked * eased),
            });
            if (step >= steps) clearInterval(interval);
        }, duration / steps);

        return () => clearInterval(interval);
    }, [started]);

    return (
        <div ref={ref} className="w-full h-full rounded-2xl border border-white/10 overflow-hidden bg-dark">
            <div className="flex items-center gap-1.5 px-4 py-2.5 bg-white/5 border-b border-white/10">
                <div className="w-2.5 h-2.5 rounded-full bg-coral/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <div className="ml-2 flex-1 bg-white/5 rounded-md h-5 flex items-center px-2">
                    <span className="text-[9px] text-white/30 font-mono">go.rsla.io/dashboard</span>
                </div>
            </div>
            <div className="p-3 md:p-5 grid grid-cols-3 gap-2 md:gap-3">
                {[
                    { label: 'Leads', value: counts.leads, suffix: '', color: 'text-accent' },
                    { label: 'Revenue', value: counts.revenue, suffix: 'K', prefix: '$', color: 'text-emerald-400' },
                    { label: 'Booked', value: counts.booked, suffix: '', color: 'text-cyan' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white/5 rounded-xl p-2.5 md:p-3 text-center">
                        <div className={`font-sans font-bold text-lg md:text-2xl ${stat.color}`}>{stat.prefix || ''}{stat.value}{stat.suffix}</div>
                        <div className="font-mono text-[8px] md:text-[9px] uppercase tracking-wider text-white/40 mt-0.5">{stat.label}</div>
                    </div>
                ))}
                <div className="col-span-2 bg-white/5 rounded-xl p-2.5 md:p-3">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-[8px] text-white/30 uppercase tracking-wider">Monthly Leads</span>
                        <span className="font-mono text-[8px] text-emerald-400/60">+23%</span>
                    </div>
                    <div className="flex items-end gap-[3px] h-12 md:h-14">
                        {[30, 45, 35, 60, 50, 70, 55, 80, 65, 85, 75, 95].map((h, i) => (
                            <div key={i} className="flex-1 rounded-t-sm transition-all duration-700"
                                style={{ height: `${h}%`, background: i >= 10 ? 'rgba(0,112,243,0.5)' : 'rgba(0,112,243,0.25)' }} />
                        ))}
                    </div>
                </div>
                <div className="col-span-1 bg-white/5 rounded-xl p-2.5 md:p-3 flex flex-col items-center justify-center">
                    <div className="relative w-12 h-12 md:w-14 md:h-14">
                        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                            <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#0070F3" strokeWidth="3" strokeDasharray="52 88" strokeLinecap="round" />
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#00C2FF" strokeWidth="3" strokeDasharray="22 88" strokeDashoffset="-52" strokeLinecap="round" />
                            <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" strokeDasharray="14 88" strokeDashoffset="-74" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-bold text-[10px] md:text-xs text-white/70">72%</span>
                        </div>
                    </div>
                    <span className="font-mono text-[7px] md:text-[8px] text-white/30 uppercase tracking-wider mt-1">Close Rate</span>
                </div>
                <div className="col-span-3 bg-white/5 rounded-xl p-2.5 md:p-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[8px] text-white/30 uppercase tracking-wider">Pipeline</span>
                    </div>
                    <div className="flex gap-1 h-2 rounded-full overflow-hidden">
                        <div className="bg-accent/70 rounded-l-full" style={{ width: '35%' }} />
                        <div className="bg-cyan/50" style={{ width: '25%' }} />
                        <div className="bg-emerald-400/50" style={{ width: '22%' }} />
                        <div className="bg-white/10 rounded-r-full" style={{ width: '18%' }} />
                    </div>
                    <div className="flex justify-between mt-1.5">
                        {['New', 'Qualified', 'Proposal', 'Won'].map((stage) => (
                            <span key={stage} className="font-mono text-[7px] md:text-[8px] text-white/25 uppercase">{stage}</span>
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
        body: 'Stop boosting posts and hoping for the best. We set up ad systems across Facebook and Google that test creatives, kill what\'s not working, and scale what is. No guessing. Every dollar tracked, every lead scored, every qualified prospect fed straight into your pipeline.',
        cta: 'See how we find your leads',
        link: '/services#lead-generation',
        Visual: AnimatedBeamVisual,
    },
    {
        tag: 'ZERO MANUAL WORK',
        title: 'Booking calls while you',
        accent: 'sleep.',
        body: 'Someone messages you at 2 AM. By 2:01 AM they have a calendar invite. No human touched it. We build the bots and automations that do the stuff your team keeps losing hours to... qualifying leads, answering the same five questions, chasing follow ups. All of it runs without you.',
        cta: 'See automations in action',
        link: '/services#automations',
        Visual: TypewriterVisual,
    },
    {
        tag: 'OPERATIONS',
        title: 'One brain running your',
        accent: 'business.',
        body: 'Right now your CRM says one thing, your calendar says another, and half your follow ups live in someone\'s head. We wire it all into one system. Leads, pipeline, bookings, reporting. You open one dashboard and it tells you exactly what needs attention. No digging, no guessing.',
        cta: 'See how we run operations',
        link: '/services#operations',
        Visual: DashboardVisual,
    },
];

function ServiceCard({ service, index }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className="snap-card w-full min-h-screen flex items-center justify-center p-4 md:p-6 bg-dark snap-start"
        >
            <div
                className={`bg-white/[0.03] border border-white/10 rounded-[3rem] p-8 md:p-14 max-w-5xl w-full shadow-2xl flex flex-col md:flex-row gap-8 md:gap-12 items-center backdrop-blur-sm transition-all duration-700 ease-out ${
                    visible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: '100ms' }}
            >
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
    );
}

export default function ServicesCards() {
    return (
        <section className="bg-dark">
            <div className="max-w-7xl mx-auto px-6 pt-10 pb-10 text-center">
                <span className="font-mono text-accent text-xs uppercase tracking-widest font-bold">What We Build</span>
            </div>

            <div className="snap-container">
                {services.map((service, i) => (
                    <ServiceCard key={i} service={service} index={i} />
                ))}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @supports (scroll-snap-type: y mandatory) {
                    .snap-container {
                        scroll-snap-type: y proximity;
                    }
                    .snap-card {
                        scroll-snap-align: start;
                    }
                }
            `}} />
        </section>
    );
}
