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
                description="We architect intelligent marketing systems. Paid Ads, AI Automation, and Smart Infrastructure for scaling businesses."
                canonical="https://rsla.io"
                jsonLd={[
                    {
                        '@context': 'https://schema.org',
                        '@type': 'Organization',
                        name: 'RSL/A',
                        alternateName: ['RSLA', 'RSL/A', 'RSL A', 'RSL/A Agency'],
                        url: 'https://rsla.io',
                        logo: 'https://rsla.io/images/logo/lockup-nobg.webp',
                        description: 'We architect intelligent marketing systems. Paid Ads, AI Automation, and Smart Infrastructure for scaling businesses.',
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
