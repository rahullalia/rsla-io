import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextAnimate } from '@/components/ui/text-animate';
import Seo from '../components/Seo';

gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        id: 'lead-generation',
        tag: 'LEAD GEN',
        title: 'Stop paying for clicks. Start paying for',
        accent: 'customers.',
        bg: 'bg-surfaceAlt',
        text: 'text-text',
        bodyText: 'text-textMuted',
        borderColor: 'border-accent-border',
        problem: 'Most founders either boost posts and hope for the best, or they hire an agency that shows them impressions and reach numbers. Neither gets you customers.',
        bullets: [
            { bold: 'Targeting that learns:', desc: 'Your campaigns learn which audiences convert and shift budget toward them automatically. No manual bid adjustments.' },
            { bold: 'Creative testing at scale:', desc: 'We test dozens of ad variations simultaneously. AI identifies the winners and kills the losers before they waste your money.' },
            { bold: 'Pipeline integration:', desc: 'Every qualified lead flows directly into your CRM. Tagged, scored, and ready for follow-up. No spreadsheets, no manual entry.' },
            { bold: 'Real-time dashboards:', desc: 'You see exactly what your ad spend is producing. Not vanity metrics. Revenue metrics.' },
        ],
        proof: '$600 in ad spend turned into $36,000 in closed revenue in 45 days. That is a 60x return. Not because of magic creative. Because the AI system optimized faster than any human could.',
        cta: 'Let\'s talk about what this looks like for your business',
    },
    {
        id: 'automations',
        tag: 'ZERO MANUAL WORK',
        title: 'Your business should not stop working when',
        accent: 'you do.',
        bg: 'bg-surface',
        text: 'text-text',
        bodyText: 'text-textMuted',
        borderColor: 'border-accent-border',
        problem: 'A lead messages you at 11 PM. You see it at 8 AM. By then they have already talked to two of your competitors. You lost the deal because you were sleeping. That is not a business problem. That is an infrastructure problem.',
        bullets: [
            { bold: 'Conversational bots:', desc: 'Not the robotic "please select an option" kind. Actual AI that understands context, qualifies leads, answers questions, and books meetings. At 2 AM. At 2 PM. Whenever.' },
            { bold: 'Workflow automations:', desc: 'Lead comes in, gets tagged, gets the right follow-up sequence, gets routed to the right person. Automatically. You do not touch it.' },
            { bold: 'Customer service AI:', desc: 'Handle the 80% of customer questions that are the same thing asked slightly differently. Your team focuses on the 20% that actually need a human.' },
            { bold: 'Database reactivation:', desc: 'Got a list of cold contacts collecting dust? AI wakes them up. Personalized outreach at scale, not mass blasts.' },
        ],
        proof: 'We built an AI chat system for an e-commerce brand that cut manual customer service hours by 80%. And the customers rated the experience higher than when humans were handling it.',
        cta: 'See AI automations in action. Let\'s talk.',
    },
    {
        id: 'operations',
        tag: 'OPERATIONS',
        title: 'Stop managing tools. Let AI manage your',
        accent: 'business.',
        bg: 'bg-surfaceAlt',
        text: 'text-text',
        bodyText: 'text-textMuted',
        borderColor: 'border-accent-border',
        problem: 'You are paying for Calendly. And Mailchimp. And some CRM you barely use. And a website builder. And a texting platform. And maybe two more things you forgot about. None of them talk to each other. You are the integration layer. That is expensive. Not just the subscriptions. Your time.',
        bullets: [
            { bold: 'Unified pipeline:', desc: 'Every lead, every deal, every customer in one place. AI tells you what needs attention today, not a spreadsheet you forgot to update.' },
            { bold: 'Intelligent follow ups:', desc: 'The system knows when someone has not responded and sends the right nudge at the right time. Not a generic "just checking in" email. Something contextual.' },
            { bold: 'Automated reporting:', desc: 'Stop building reports manually. Your dashboard updates in real time. Revenue, pipeline, conversion rates. All of it.' },
            { bold: 'Calendar and booking integration:', desc: 'One link, one system, no double bookings, no "let me check my availability" back and forth.' },
        ],
        proof: 'We reactivated a dead database of 13,000 cold contacts and booked 42 qualified appointments in one week. Not by emailing everyone the same thing. By using AI to personalize outreach based on what we knew about each contact.',
        cta: 'Let us audit your current tool stack. Let\'s talk.',
    },
    {
        id: 'digital-presence',
        tag: 'DIGITAL PRESENCE',
        title: 'Your website should work as hard as',
        accent: 'you do.',
        bg: 'bg-surface',
        text: 'text-text',
        bodyText: 'text-textMuted',
        borderColor: 'border-accent-border',
        problem: 'You have a website. It looks okay. But it is basically a digital business card that does not do anything. No one finds it on Google. The few people who do visit do not convert. And you have no idea why because there is no data.',
        bullets: [
            { bold: 'Conversion-focused design:', desc: 'Every page built around one goal: getting the visitor to take the next step. Tested layouts and copy that improve over time.' },
            { bold: 'SEO infrastructure:', desc: 'Content strategy informed by AI research. We target the searches your ideal clients are actually making, not vanity keywords.' },
            { bold: 'Performance tracking:', desc: 'You know exactly where visitors come from, what they do, and why they leave. No guessing.' },
            { bold: 'Content engine:', desc: 'AI-assisted content creation for blogs, case studies, and landing pages that drive organic traffic consistently.' },
        ],
        proof: null,
        cta: 'Let\'s talk',
    },
];

export default function Services() {
    const pageRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);

        const ctx = gsap.context(() => {
            gsap.fromTo('.services-hero-content',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.1 }
            );

            document.querySelectorAll('.service-section').forEach((section) => {
                gsap.fromTo(section.querySelectorAll('.svc-animate'),
                    { y: 40, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 70%',
                            once: true,
                        }
                    }
                );
            });
        }, pageRef);

        return () => ctx.revert();
    }, []);

    return (
        <main ref={pageRef} className="min-h-screen">
            <Seo
                title="Services | RSL/A"
                description="AI automation, paid advertising, CRM implementation, and local SEO. Real systems that generate leads, book calls, and run your operations."
                canonical="https://rsla.io/services"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'ProfessionalService',
                    name: 'RSL/A',
                    url: 'https://rsla.io/services',
                    description: 'AI automation, paid advertising, CRM implementation, and local SEO. Real systems that generate leads, book calls, and run your operations.',
                    provider: {
                        '@type': 'Organization',
                        name: 'RSL/A',
                        url: 'https://rsla.io',
                    },
                    hasOfferCatalog: {
                        '@type': 'OfferCatalog',
                        name: 'Marketing & AI Services',
                        itemListElement: [
                            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Lead Generation', description: 'Paid ads with AI optimization that generate qualified leads and book calls automatically.' } },
                            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Automations', description: 'Custom AI systems that automate lead nurture, follow-ups, CRM workflows, and business operations.' } },
                            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Operations', description: 'CRM infrastructure, dashboards, and intelligent reporting systems that run your business.' } },
                        ],
                    },
                }}
            />
            <section className="bg-surface pt-32 pb-20 md:pb-28 px-6 md:px-12">
                <div className="services-hero-content max-w-4xl mx-auto text-center">
                    <h1 className="font-sans font-bold text-4xl md:text-6xl lg:text-7xl text-text tracking-tight mb-6 leading-tight">
                        <TextAnimate animation="blurInUp" by="word" delay={0.08} startOnView={false} as="span">
                            Everything we build runs on
                        </TextAnimate>{' '}
                        <span className="font-drama italic font-normal">
                            <TextAnimate animation="blurInUp" by="word" delay={0.6} startOnView={false} as="span">
                                AI.
                            </TextAnimate>
                        </span>
                    </h1>
                    <p className="font-body text-textMuted max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                        We do not do "marketing." We build AI infrastructure for founders. Here is what that actually means.
                    </p>
                </div>
            </section>

            {/* Service Sections */}
            {services.map((service) => (
                <section key={service.id} id={service.id} className={`service-section ${service.bg} py-20 md:py-28 px-6 md:px-12`}>
                    <div className="max-w-4xl mx-auto">
                        <span className={`svc-animate inline-block font-mono text-[10px] md:text-xs uppercase tracking-widest text-accent border border-accent/30 rounded-full px-4 py-1.5 mb-6`}>
                            {service.tag}
                        </span>

                        <h2 className={`svc-animate font-sans font-bold text-2xl md:text-4xl lg:text-5xl ${service.text} tracking-tight mb-8 leading-tight`}>
                            {service.title} <span className="font-drama italic font-normal">{service.accent}</span>
                        </h2>

                        <div className={`svc-animate mb-8`}>
                            <h3 className={`font-sans font-bold text-lg ${service.text} mb-3`}>The Problem</h3>
                            <p className={`font-body ${service.bodyText} text-base leading-relaxed`}>
                                {service.problem}
                            </p>
                        </div>

                        <div className={`svc-animate mb-8`}>
                            <h3 className={`font-sans font-bold text-lg ${service.text} mb-4`}>What We Build</h3>
                            <ul className="space-y-4">
                                {service.bullets.map((bullet, i) => (
                                    <li key={i} className={`font-body ${service.bodyText} text-base leading-relaxed`}>
                                        <strong className={service.text}>{bullet.bold}</strong> {bullet.desc}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {service.proof && (
                            <div className="svc-animate bg-accent-light border border-accent-border rounded-2xl p-6 md:p-8 mb-8">
                                <p className="font-body text-textMuted text-sm md:text-base leading-relaxed italic">
                                    {service.proof}
                                </p>
                            </div>
                        )}

                        <a href="/#contact" className="svc-animate link-underline inline-flex items-center gap-2 min-h-[44px] font-sans font-bold text-accent text-sm hover:text-text transition-colors group">
                            {service.cta}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                        </a>
                    </div>
                </section>
            ))}

        </main>
    );
}
