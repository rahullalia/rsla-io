import Seo from '../components/Seo';
import Hero from '../components/Hero';
import ProblemSection from '../components/ProblemSection';
import ServicesCards from '../components/ServicesCards';
import HowItWorks from '../components/HowItWorks';
import FounderSection from '../components/FounderSection';
import ProofSection from '../components/ProofSection';
import MarqueeStrip from '../components/MarqueeStrip';
import BookingSection from '../components/BookingSection';

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
            <Hero />
            <ProblemSection />
            <ServicesCards />
            <HowItWorks />
            <FounderSection />
            <ProofSection />
            <MarqueeStrip />
            <BookingSection />
        </>
    );
}
