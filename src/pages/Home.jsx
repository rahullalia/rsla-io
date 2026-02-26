import Seo from '../components/Seo';
import HeroV2 from '../components/HeroV2';
import ServicesV2 from '../components/ServicesV2';
import StatsSection from '../components/StatsSection';
import ProofSection from '../components/ProofSection';
import Testimonials from '../components/Testimonials';
import FounderSection from '../components/FounderSection';
import BlogPreview from '../components/BlogPreview';
import BookingSection from '../components/BookingSection';
import CtaWithGlow from '../components/CtaWithGlow';
import MarqueeV2 from '../components/MarqueeV2';

export default function Home() {
    return (
        <>
            <Seo
                title="RSL/A | Intelligent Marketing Systems"
                description="We architect intelligent marketing systems. Paid Ads, AI Automation, and Smart Infrastructure for scaling businesses."
                canonical="https://rsla.io"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'Organization',
                    name: 'RSL/A',
                    url: 'https://rsla.io',
                    logo: 'https://rsla.io/images/logo/lockup-nobg.webp',
                    description: 'We architect intelligent marketing systems. Paid Ads, AI Automation, and Smart Infrastructure for scaling businesses.',
                    founder: {
                        '@type': 'Person',
                        name: 'Rahul Lalia',
                        jobTitle: 'Founder & CEO',
                    },
                    sameAs: [
                        'https://www.instagram.com/rahulslalia/',
                        'https://www.linkedin.com/in/rahullalia/',
                        'https://www.youtube.com/@rahul_lalia',
                        'https://www.tiktok.com/@rahul_lalia',
                        'https://x.com/rahul_lalia',
                    ],
                }}
            />
            <HeroV2 />
            <ServicesV2 />
            <StatsSection />
            <ProofSection />
            <Testimonials />
            <FounderSection />
            <BlogPreview />
            <BookingSection />
            <CtaWithGlow />
            <MarqueeV2 />
        </>
    );
}
