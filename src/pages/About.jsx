import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { TextAnimate } from '@/components/ui/text-animate';
import Seo from '../components/Seo';

export default function About() {
    const pageRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);

        const ctx = gsap.context(() => {
            gsap.fromTo('.about-hero-content',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.1 }
            );

            gsap.fromTo('.about-section',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out', delay: 0.4 }
            );

            gsap.fromTo('.words-section blockquote p',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out', delay: 0.3 }
            );
        }, pageRef);

        return () => ctx.revert();
    }, []);

    return (
        <main ref={pageRef} className="min-h-screen">
            <Seo
                title="About | RSL/A"
                description="Meet Rahul Lalia, founder of RSL/A. Five years in marketing, automation, and business infrastructure, building systems that actually run businesses."
                keywords="Rahul Lalia, RSL/A founder, AI automation expert, marketing automation consultant, business systems builder"
                canonical="https://rsla.io/about"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'Person',
                    name: 'Rahul Lalia',
                    jobTitle: 'Founder & CEO',
                    url: 'https://rsla.io/about',
                    image: 'https://rsla.io/images/rahul.webp',
                    worksFor: {
                        '@type': 'Organization',
                        name: 'RSL/A',
                        url: 'https://rsla.io',
                    },
                    sameAs: [
                        'https://www.linkedin.com/in/rahullalia/',
                        'https://www.instagram.com/rahul.lalia/',
                        'https://www.youtube.com/@rahul_lalia',
                        'https://www.tiktok.com/@rahul_lalia',
                        'https://github.com/rahullalia',
                    ],
                }}
            />
            <section className="bg-surface pt-32 pb-20 md:pb-28 px-6 md:px-12">
                <div className="about-hero-content opacity-0 max-w-4xl mx-auto text-center">
                    <h1 className="font-drama italic font-bold text-3xl md:text-5xl lg:text-6xl text-text tracking-tight mb-6 leading-snug">
                        <TextAnimate animation="blurInUp" by="word" delay={0.08} startOnView={false} as="span">
                            "What a privilege to be tired from work you once begged the universe for..."
                        </TextAnimate>
                    </h1>
                </div>
            </section>

            {/* Body Content */}
            <div className="about-body bg-surfaceAlt pt-20 pb-24 px-6 md:px-12">
                <div className="max-w-3xl mx-auto">
                    {/* Origin Story */}
                    <div className="about-section opacity-0 mb-16">
                        <h2 className="font-sans font-bold text-2xl md:text-4xl text-text tracking-tight mb-6">
                            How it started
                        </h2>
                        <p className="font-body text-textMuted text-base md:text-lg leading-relaxed mb-6">
                            I started my career in marketing analytics. Numbers, dashboards, attribution models. I was the guy staring at spreadsheets while everyone else was making the creative decisions.
                        </p>
                        <p className="font-body text-textMuted text-base md:text-lg leading-relaxed mb-6">
                            Then I got laid off.
                        </p>
                        <p className="font-body text-textMuted text-base md:text-lg leading-relaxed mb-6">
                            And honestly? It was the best thing that happened to me. Because it forced me to build something on my own.
                        </p>
                        <p className="font-body text-textMuted text-base md:text-lg leading-relaxed mb-6">
                            I started an agency. The classic social media marketing agency thing. Posting content, running accounts, doing the hustle. But I kept noticing the same pattern with every client I worked with.
                        </p>
                        <p className="font-body text-textMuted text-base md:text-lg leading-relaxed mb-6">
                            They were not struggling because they lacked talent. They were drowning in manual work.
                        </p>
                        <p className="font-body text-textMuted text-base md:text-lg leading-relaxed mb-6">
                            Following up with leads at midnight. Copy-pasting between three different tools. Losing deals because they forgot to reply. Running ads with zero tracking. Paying for five different software subscriptions that did not talk to each other.
                        </p>
                        <p className="font-body text-textMuted text-base md:text-lg leading-relaxed mb-6">
                            And you know what? Most of the "solutions" out there made it worse. More tools, more complexity, more things to manage.
                        </p>
                        <p className="font-body text-textMuted text-base md:text-lg leading-relaxed">
                            So I started asking a different question. What if AI could handle all the stuff that founders should not be doing manually? Not theoretical AI. Not "we will build you a chatbot" AI. Practical, measured, actually-useful-for-your-business AI. That became the whole thing.
                        </p>
                    </div>

                    {/* What I Actually Do */}
                    <div className="about-section opacity-0 mb-16">
                        <h2 className="font-sans font-bold text-2xl md:text-4xl text-text tracking-tight mb-6">
                            What I actually do
                        </h2>
                        <p className="font-body text-textMuted text-base md:text-lg leading-relaxed mb-6">
                            I show founders how to put AI to work in their business. Then I build it for them.
                        </p>
                        <p className="font-body text-textMuted text-base md:text-lg leading-relaxed mb-6">
                            The teaching part is free. I post the workflows, the tools, the exact systems. No gatekeeping. If you can build it yourself after watching my content, I genuinely want that for you.
                        </p>
                        <p className="font-body text-textMuted text-base md:text-lg leading-relaxed">
                            But here is the thing. There is a difference between knowing what to build and building it right. A system that works for 10 leads breaks at 500. An AI bot that sounds great in a demo falls apart with real customers. The gap between a prototype and a production system is where most founders get stuck. That is where RSL/A comes in. My team and I are the ones who build the production version. The one that actually scales, actually handles edge cases, and actually shows you the numbers so you know it is working.
                        </p>
                    </div>

                    {/* Why I Am Different */}
                    <div className="about-section opacity-0 mb-16">
                        <h2 className="font-sans font-bold text-2xl md:text-4xl text-text tracking-tight mb-6">
                            Why I am different
                        </h2>
                        <p className="font-body text-textMuted text-base md:text-lg leading-relaxed mb-6">
                            I came from analytics. That matters.
                        </p>
                        <p className="font-body text-textMuted text-base md:text-lg leading-relaxed">
                            Most people in this space show you a demo and call it done. I show you a dashboard. Real numbers. What the AI system did this week, how many leads it handled, how many meetings it booked, what the conversion rate was. Because if you cannot measure it, it is just a toy. And founders do not need toys. They need infrastructure.
                        </p>
                    </div>

                    {/* CTA */}
                    <div className="about-section opacity-0">
                        <Link to="/work" className="link-underline inline-flex items-center gap-2 min-h-[44px] font-sans font-bold text-accent text-sm hover:text-text transition-colors group">
                            See what we have built
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Words I Like */}
            <section className="words-section bg-surfaceAlt py-16 md:py-36 px-6 md:px-12">
                <div className="max-w-3xl mx-auto text-center">
                    <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-accent block mb-6 md:mb-10">
                        Words I Like
                    </span>
                    <div className="relative">
                        <span className="font-drama text-accent/10 text-[5rem] md:text-[12rem] leading-none absolute -top-6 md:-top-16 left-0 select-none pointer-events-none">"</span>
                        <blockquote className="relative z-10">
                            <p className="font-drama italic font-bold text-lg md:text-2xl text-text/80 leading-relaxed md:leading-loose">What a privilege to be tired from work you once begged the universe for. What a privilege to feel overwhelmed by growth you used to dream about. What a privilege to be challenged by a life you created on purpose. What a privilege to outgrow things you used to settle for.</p>
                        </blockquote>
                    </div>
                    <cite className="block mt-6 md:mt-10 font-body text-sm text-textMuted not-italic">
                        Aryan Sachdeva, via Medium
                    </cite>
                </div>
            </section>

        </main>
    );
}
