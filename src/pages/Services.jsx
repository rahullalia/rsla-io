import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextAnimate } from '@/components/ui/text-animate';
import Seo from '../components/Seo';
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid';
import { features } from '../components/ServicesV2';

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
    const pageRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                gsap.set('.services-hero-content', { opacity: 1, y: 0 });
                gsap.set('.services-bento > *', { opacity: 1, y: 0 });
                return;
            }

            gsap.fromTo('.services-hero-content',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.1 }
            );

            gsap.fromTo('.services-bento > *',
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.services-bento',
                        start: 'top 80%',
                        once: true,
                    },
                }
            );
        }, pageRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={pageRef}>
            <Seo
                title="Services | RSL/A"
                description="End-to-end AI systems that generate leads, close deals, and scale operations. Websites, search visibility, AI automations, CRM systems, and custom development."
                keywords="AI services, custom websites, AI automation, CRM systems, search visibility, custom development, AI lead generation, B2B AI systems"
                canonical="https://rsla.io/services"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'ProfessionalService',
                    name: 'RSL/A',
                    url: 'https://rsla.io/services',
                    description: 'End-to-end AI systems that generate leads, close deals, and scale operations. Built and managed by a team that has done it across SMBs and enterprise.',
                    provider: {
                        '@type': 'Organization',
                        name: 'RSL/A',
                        url: 'https://rsla.io',
                    },
                    hasOfferCatalog: {
                        '@type': 'OfferCatalog',
                        name: 'AI Services',
                        itemListElement: [
                            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Websites', description: 'New builds and full rebuilds. Fast, custom-designed, SEO-ready.' } },
                            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Search Visibility', description: 'Rankings on Google, ChatGPT, Perplexity, and Claude.' } },
                            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Automations', description: 'n8n, Make, and custom scripts that replace manual work.' } },
                            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'CRM Systems', description: 'GoHighLevel pipelines, workflows, and integrations.' } },
                            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Custom Development', description: 'SaaS products, MVPs, internal tools, APIs.' } },
                        ],
                    },
                }}
            />

            {/* Hero */}
            <section className="bg-surface pt-32 pb-16 md:pb-20 px-6 md:px-12">
                <div className="services-hero-content opacity-0 max-w-4xl mx-auto text-center">
                    <h1 className="font-sans font-bold text-3xl md:text-5xl text-text tracking-tight mb-6 leading-[1.1]">
                        <TextAnimate animation="blurInUp" by="word" delay={0.08} startOnView={false} as="span">
                            What we can help you with.
                        </TextAnimate>
                    </h1>
                    <p className="font-sans text-lg text-textMuted leading-relaxed max-w-2xl mx-auto">
                        End-to-end AI systems that generate leads, close deals, and scale operations. Built and managed by a team that's done it across SMBs and enterprise.
                    </p>
                </div>
            </section>

            {/* Bento grid */}
            <section className="bg-accent-light pb-20 md:pb-32 pt-4 md:pt-8 px-6 md:px-12">
                <div className="max-w-6xl mx-auto">
                    <BentoGrid className="services-bento">
                        {features.map((feature) => (
                            <BentoCard key={feature.name} {...feature} />
                        ))}
                    </BentoGrid>
                </div>
            </section>
        </div>
    );
}
