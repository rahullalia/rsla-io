import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Seo from '../components/Seo';
import { TextAnimate } from '@/components/ui/text-animate';

gsap.registerPlugin(ScrollTrigger);

const learnTiers = [
    {
        time: '5 minutes',
        label: 'Read this',
        desc: 'The short version of why most founders are doing manually what AI could handle in seconds.',
        link: '/blog',
        linkText: 'Read the blog',
    },
    {
        time: '30 minutes',
        label: 'Watch this',
        desc: 'I walk through a real AI system I built for a client. Start to finish. What it does, how it works, and the numbers.',
        link: 'https://youtube.com/@rahul_lalia',
        linkText: 'Watch on YouTube',
        external: true,
    },
    {
        time: 'Specific problem',
        label: 'Book a free call',
        desc: 'I will screen share, look at your business, and tell you exactly where AI fits. No pitch, just answers.',
        link: '/#contact',
        linkText: 'Book a call',
    },
];

const socials = [
    { name: 'LinkedIn', url: 'https://linkedin.com/in/rahul_lalia', desc: 'Where most of my thinking happens' },
    { name: 'YouTube', url: 'https://youtube.com/@rahul_lalia', desc: 'Deeper walkthroughs and builds' },
    { name: 'Instagram', url: 'https://www.instagram.com/rahul.lalia', desc: 'Behind the scenes' },
    { name: 'TikTok', url: 'https://tiktok.com/@rahul_lalia', desc: 'Quick takes' },
    { name: 'X', url: 'https://x.com/rahul_lalia', desc: 'Shorter thoughts' },
];

export default function StartHere() {
    const pageRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);

        const ctx = gsap.context(() => {
            gsap.fromTo('.start-hero-content',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.1 }
            );

            gsap.fromTo('.start-card',
                { y: 40, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.start-learn',
                        start: 'top 75%',
                        once: true,
                    }
                }
            );

            gsap.fromTo('.start-section',
                { y: 30, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.start-follow',
                        start: 'top 75%',
                        once: true,
                    }
                }
            );
        }, pageRef);

        return () => ctx.revert();
    }, []);

    return (
        <main ref={pageRef} className="min-h-screen">
            <Seo
                title="Start Here | RSL/A"
                description="Ready to put AI to work in your business? Start here. Book a call and see what RSL/A can build for you."
                keywords="hire AI automation agency, AI for my business, book AI consultation, business automation help"
                canonical="https://rsla.io/start-here"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'WebPage',
                    name: 'Start Here',
                    url: 'https://rsla.io/start-here',
                    description: 'Ready to put AI to work in your business? Start here. Book a call and see what RSL/A can build for you.',
                    isPartOf: { '@type': 'WebSite', name: 'RSL/A', url: 'https://rsla.io' },
                }}
            />
            {/* Hero */}
            <section className="bg-surface pt-32 pb-20 md:pb-28 px-6 md:px-12">
                <div className="start-hero-content opacity-0 max-w-4xl mx-auto text-center">
                    <h1 className="font-sans font-bold text-4xl md:text-6xl lg:text-7xl text-text tracking-tight mb-6 leading-tight">
                        <TextAnimate animation="blurInUp" by="word" delay={0.08} startOnView={false} as="span">
                            New here? Start
                        </TextAnimate>{' '}
                        <span className="font-drama italic font-bold text-accent">
                            <TextAnimate animation="blurInUp" by="word" delay={0.4} startOnView={false} as="span">
                                here.
                            </TextAnimate></span>
                    </h1>
                    <p className="font-body text-textMuted max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                        I am Rahul. I build AI systems for founders. But before you hire anyone (including me), you should understand what AI can actually do for your business. Here is the stuff I would send a friend who asked me "should I be using AI in my business?"
                    </p>
                </div>
            </section>

            {/* Learn Section */}
            <section className="start-learn bg-surfaceAlt py-20 md:py-28 px-6 md:px-12">
                <div className="max-w-4xl mx-auto">
                    <span className="font-mono text-accent text-xs uppercase tracking-widest font-bold">Learn</span>
                    <h2 className="font-sans font-bold text-2xl md:text-4xl text-text tracking-tight mt-4 mb-12">
                        Pick your depth
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {learnTiers.map((tier) => (
                            <div key={tier.time} className="start-card bg-surface border border-accent-border rounded-2xl p-8 flex flex-col shadow-sm hover:shadow-md transition-shadow">
                                <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-accent border border-accent/30 rounded-full px-3 py-1 self-start mb-4">
                                    {tier.time}
                                </span>
                                <h3 className="font-sans font-bold text-lg text-text mb-3">{tier.label}</h3>
                                <p className="font-body text-textMuted text-sm leading-relaxed mb-6 flex-grow">{tier.desc}</p>
                                {tier.external ? (
                                    <a href={tier.link} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex items-center gap-2 min-h-[44px] font-sans font-bold text-accent text-sm hover:text-text transition-colors group">
                                        {tier.linkText}
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                                    </a>
                                ) : tier.link.startsWith('#') ? (
                                    <a href={tier.link} className="link-underline inline-flex items-center gap-2 min-h-[44px] font-sans font-bold text-accent text-sm hover:text-text transition-colors group">
                                        {tier.linkText}
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                                    </a>
                                ) : (
                                    <Link to={tier.link} className="link-underline inline-flex items-center gap-2 min-h-[44px] font-sans font-bold text-accent text-sm hover:text-text transition-colors group">
                                        {tier.linkText}
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Follow Section */}
            <section className="start-follow bg-surface py-20 md:py-28 px-6 md:px-12">
                <div className="max-w-4xl mx-auto">
                    <div className="start-section">
                        <span className="font-mono text-accent text-xs uppercase tracking-widest font-bold">Follow</span>
                        <h2 className="font-sans font-bold text-2xl md:text-4xl text-text tracking-tight mt-4 mb-4">
                            Stay in the loop
                        </h2>
                        <p className="font-body text-textMuted text-base leading-relaxed mb-10">
                            I post regularly about AI for business. No fluff, no hype. Just what is working right now.
                        </p>
                    </div>

                    <div className="start-section grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {socials.map((social) => (
                            <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="group bg-accent-light border border-accent-border rounded-xl p-5 hover:border-accent/30 transition-colors">
                                <h3 className="font-sans font-bold text-text mb-1 group-hover:text-accent transition-colors">{social.name}</h3>
                                <p className="font-body text-textMuted text-sm">{social.desc}</p>
                            </a>
                        ))}
                        <Link to="/blog" className="group bg-accent-light border border-accent-border rounded-xl p-5 hover:border-accent/30 transition-colors">
                            <h3 className="font-sans font-bold text-text mb-1 group-hover:text-accent transition-colors">Blog</h3>
                            <p className="font-body text-textMuted text-sm">Long form, searchable, evergreen</p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Work Together */}
            <section className="bg-surfaceAlt py-20 md:py-28 px-6 md:px-12">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="font-sans font-bold text-2xl md:text-4xl text-text tracking-tight mb-4">
                        Ready to work together?
                    </h2>
                    <p className="font-body text-textMuted text-base leading-relaxed mb-8">
                        If you have already done the learning and want it built, here is how that works.
                    </p>
                    <Link to="/how-it-works" className="inline-flex items-center gap-2 min-h-[44px] font-sans font-bold text-accent text-sm hover:text-text transition-colors group">
                        See how it works
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    </Link>
                </div>
            </section>

        </main>
    );
}
