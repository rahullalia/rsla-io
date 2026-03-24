import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import Seo from '../components/Seo';
import HeroV2 from '../components/HeroV2';

// Retry wrapper for lazy imports — handles Safari mobile import() failures
function lazyRetry(importFn) {
    return lazy(() =>
        importFn().catch(() =>
            new Promise(resolve => setTimeout(resolve, 200)).then(() => importFn())
        )
    );
}

// Lazy-load below-fold sections (with retry for Safari resilience)
const SystemArchitecture = lazyRetry(() => import('../components/SystemArchitecture'));
const ServicesV2 = lazyRetry(() => import('../components/ServicesV2'));
const HowItWorks = lazyRetry(() => import('../components/HowItWorks'));
const StatsSection = lazyRetry(() => import('../components/StatsSection'));
const ProofSection = lazyRetry(() => import('../components/ProofSection'));
const Testimonials = lazyRetry(() => import('../components/Testimonials'));
const FounderSection = lazyRetry(() => import('../components/FounderSection'));
const BlogPreview = lazyRetry(() => import('../components/BlogPreview'));
const BookingSection = lazyRetry(() => import('../components/BookingSection'));
const FaqSection = lazyRetry(() => import('../components/FaqSection'));
const CtaWithGlow = lazyRetry(() => import('../components/CtaWithGlow'));
const MarqueeV2 = lazyRetry(() => import('../components/MarqueeV2'));
const LogoMarquee = lazyRetry(() => import('../components/LogoMarquee'));

/** Renders children only after the sentinel enters the viewport */
function LazyOnView({ children, rootMargin = '200px' }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect(); } },
            { rootMargin },
        );
        io.observe(el);
        return () => io.disconnect();
    }, [rootMargin]);
    return <div ref={ref}>{visible ? children : null}</div>;
}

export default function Home() {
    return (
        <>
            <Seo
                title="RSL/A | Intelligent Marketing Systems"
                description="We show founders how to put AI to work, then build it for them. AI lead generation, automations, and smart operations for scaling businesses."
                keywords="AI for business, AI automation agency, AI lead generation, marketing automation, business automation, AI systems for founders, intelligent marketing"
                canonical="https://rsla.io"
                jsonLd={[
                    {
                        '@context': 'https://schema.org',
                        '@type': 'Organization',
                        name: 'RSL/A',
                        alternateName: ['RSLA', 'RSL/A', 'RSL A', 'RSL/A Agency'],
                        url: 'https://rsla.io',
                        logo: 'https://rsla.io/images/logo/lockup-nobg.webp',
                        description: 'We show founders how to put AI to work, then build it for them. AI lead generation, automations, and smart operations for scaling businesses.',
                        founder: {
                            '@type': 'Person',
                            name: 'Rahul Lalia',
                            jobTitle: 'Founder & CEO',
                        },
                        sameAs: [
                            'https://www.instagram.com/rahul.lalia/',
                            'https://www.linkedin.com/in/rahullalia/',
                            'https://www.youtube.com/@rahul_lalia',
                            'https://www.tiktok.com/@rahul_lalia',
                            'https://x.com/rahul_lalia',
                        ],
                    },
                    {
                        '@context': 'https://schema.org',
                        '@type': 'WebSite',
                        name: 'RSL/A',
                        alternateName: ['RSLA', 'RSL/A', 'RSL A'],
                        url: 'https://rsla.io',
                    },
                    {
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        mainEntity: [
                            { '@type': 'Question', name: 'What types of businesses do you work with?', acceptedAnswer: { '@type': 'Answer', text: 'We work with service-based businesses, local operators, and B2B companies doing $500K+ in revenue who want to systematize their marketing and operations. If you rely on leads, appointments, or repeat customers to grow, we can help.' } },
                            { '@type': 'Question', name: 'How long does it take to see results?', acceptedAnswer: { '@type': 'Answer', text: 'Most clients see measurable results within 30 to 60 days. Ad campaigns typically start generating leads within the first week. Automation systems go live in 2 to 3 weeks. Full CRM and operations buildouts take 4 to 6 weeks depending on complexity.' } },
                            { '@type': 'Question', name: 'Do you lock clients into long-term contracts?', acceptedAnswer: { '@type': 'Answer', text: 'No. We work on a month-to-month basis after the initial setup period. We believe in earning your business every month. If we are not delivering, you should not be stuck.' } },
                            { '@type': 'Question', name: 'What platforms do you use?', acceptedAnswer: { '@type': 'Answer', text: 'We primarily use GoHighLevel for CRM and automation, Meta and Google for paid ads, and custom AI tools built on OpenAI, Make, and Zapier. We pick the right tool for the job, not the one that pays us the most.' } },
                            { '@type': 'Question', name: 'How is RSL/A different from other marketing agencies?', acceptedAnswer: { '@type': 'Answer', text: 'We do not just run ads. We build the entire system: lead generation, automated follow-up, CRM, booking, and reporting. Most agencies hand you leads and call it a day. We make sure those leads turn into revenue.' } },
                        ],
                    },
                ]}
            />
            <HeroV2 />

            {/* Near-fold: loads immediately after hero */}
            <Suspense fallback={null}>
                <LogoMarquee />
                <SystemArchitecture />
                <ServicesV2 />
                <HowItWorks />
                <StatsSection />
            </Suspense>

            {/* Mid-page: loads when approaching viewport */}
            <LazyOnView rootMargin="400px">
                <Suspense fallback={null}>
                    <ProofSection />
                    <Testimonials />
                    <FounderSection />
                    <BlogPreview />
                </Suspense>
            </LazyOnView>

            {/* Bottom: booking iframe + footer sections — loads only when near */}
            <LazyOnView rootMargin="200px">
                <Suspense fallback={null}>
                    <BookingSection />
                    <FaqSection />
                    <CtaWithGlow />
                    <MarqueeV2 />
                </Suspense>
            </LazyOnView>
        </>
    );
}
