import { lazy, Suspense } from 'react';
import Seo from '../components/Seo';
import HeroV2 from '../components/HeroV2';

// Lazy-load below-fold sections
const SystemArchitecture = lazy(() => import('../components/SystemArchitecture'));
const ServicesV2 = lazy(() => import('../components/ServicesV2'));
const HowItWorks = lazy(() => import('../components/HowItWorks'));
const StatsSection = lazy(() => import('../components/StatsSection'));
const ProofSection = lazy(() => import('../components/ProofSection'));
const Testimonials = lazy(() => import('../components/Testimonials'));
const FounderSection = lazy(() => import('../components/FounderSection'));
const BlogPreview = lazy(() => import('../components/BlogPreview'));
const BookingSection = lazy(() => import('../components/BookingSection'));
const FaqSection = lazy(() => import('../components/FaqSection'));
const CtaWithGlow = lazy(() => import('../components/CtaWithGlow'));
const MarqueeV2 = lazy(() => import('../components/MarqueeV2'));

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
            <Suspense fallback={null}>
                <SystemArchitecture />
                <ServicesV2 />
                <HowItWorks />
                <StatsSection />
                <ProofSection />
                <Testimonials />
                <FounderSection />
                <BlogPreview />
                <BookingSection />
                <FaqSection />
                <CtaWithGlow />
                <MarqueeV2 />
            </Suspense>
        </>
    );
}
