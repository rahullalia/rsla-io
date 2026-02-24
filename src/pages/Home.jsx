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
