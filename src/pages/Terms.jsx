import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function Terms() {
    return (
        <main className="min-h-screen bg-background text-dark relative overflow-hidden pt-32 pb-24 px-6 md:px-12">
            <Seo
                title="Terms & Conditions | RSL/A"
                description="RSL/A terms and conditions for services and website usage."
                noIndex
            />
            <div className="max-w-4xl mx-auto relative z-10">
                <Link to="/" className="inline-flex items-center gap-2 text-dark/50 hover:text-accent font-mono text-sm transition-colors uppercase tracking-wider mb-12">
                    ← Back to Home
                </Link>

                <h1 className="text-4xl md:text-5xl font-sans font-bold mb-10 tracking-tight">
                    Terms & Conditions
                </h1>

                <div className="prose-container max-w-none font-mono text-sm md:text-base leading-relaxed text-dark/80">
                    <p className="mb-8">
                        <strong className="text-dark bg-dark/5 px-2 py-1 rounded">Effective Date:</strong> February 2026
                    </p>

                    <p className="mb-12">
                        These Terms and Conditions ("Terms") govern your access to and use of the website, services, and products provided by <strong className="text-accent">RSL/A</strong> ("Company," "we," "us," or "our"). By accessing or using our website at rsla.io (the "Site") or engaging our services, you agree to be bound by these Terms.
                    </p>

                    <h2 className="text-2xl mt-16 mb-6 font-sans font-bold text-dark border-b border-dark/10 pb-4">1. Acceptance of Terms</h2>
                    <p className="mb-8">
                        By accessing or using the Site, submitting any inquiry, or engaging our services, you acknowledge that you have read, understood, and agree to be bound by these Terms, including our Privacy Policy.
                    </p>

                    <h2 className="text-2xl mt-16 mb-6 font-sans font-bold text-dark border-b border-dark/10 pb-4">2. Services Provided</h2>
                    <p className="mb-8">
                        RSL/A provides marketing, automation, website development, CRM implementation, local SEO, paid advertising, AI automation, and related professional services. The specific scope of Services will be outlined in a separate Service Agreement or proposal.
                    </p>

                    <h2 className="text-2xl mt-16 mb-6 font-sans font-bold text-dark border-b border-dark/10 pb-4">3. No Refund Policy</h2>
                    <p className="mb-4 bg-red-500/10 text-red-700 border border-red-500/20 p-4 rounded-lg">
                        <strong>ALL SALES ARE FINAL. RSL/A DOES NOT OFFER REFUNDS UNDER ANY CIRCUMSTANCES.</strong>
                    </p>
                    <ul className="list-disc pl-8 mb-8 space-y-3 marker:text-accent">
                        <li>No refunds will be issued for any Services, whether completed, in progress, or not yet started.</li>
                        <li>All payments are non-refundable, including setup fees, monthly retainers, and project fees.</li>
                        <li>Dissatisfaction with results does not entitle you to a refund.</li>
                    </ul>

                    <h2 className="text-2xl mt-16 mb-6 font-sans font-bold text-dark border-b border-dark/10 pb-4">4. Payment Terms</h2>
                    <ul className="list-disc pl-8 mb-8 space-y-3 marker:text-accent">
                        <li>Setup fees and one-time project fees are due in full before work commences.</li>
                        <li>Monthly retainers are billed in advance.</li>
                        <li>Late payments will incur a late fee of 1.5% per month.</li>
                    </ul>

                    <h2 className="text-2xl mt-16 mb-6 font-sans font-bold text-dark border-b border-dark/10 pb-4">5. No Guarantees</h2>
                    <p className="mb-8 uppercase text-xs tracking-widest text-dark/60 border-l-2 border-dark/20 pl-4 py-2">
                        WE DO NOT GUARANTEE ANY SPECIFIC RESULTS FROM OUR SERVICES. Marketing, SEO, paid advertising, and automation services are inherently variable and depend on numerous factors outside our control.
                    </p>

                    <h2 className="text-2xl mt-16 mb-6 font-sans font-bold text-dark border-b border-dark/10 pb-4">6. Use of AI Tools</h2>
                    <p className="mb-8 p-6 bg-accent/5 border border-accent/20 rounded-xl">
                        We use artificial intelligence tools, including Claude, ChatGPT, and other AI services, to provide and improve our Services. By engaging our Services, you consent to our use of AI tools to process your information.
                    </p>

                    <h2 className="text-2xl mt-16 mb-6 font-sans font-bold text-dark border-b border-dark/10 pb-4">7. Intellectual Property</h2>
                    <p className="mb-8">
                        Upon receipt of full payment, you will own the final deliverables created specifically for you. However, we retain ownership of all pre-existing materials, templates, and methodologies.
                    </p>

                    <h2 className="text-2xl mt-16 mb-6 font-sans font-bold text-dark border-b border-dark/10 pb-4">8. Limitation of Liability</h2>
                    <p className="mb-8 uppercase text-xs tracking-widest text-dark/60 border-l-2 border-dark/20 pl-4 py-2">
                        TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL AGGREGATE LIABILITY SHALL NOT EXCEED THE TOTAL AMOUNT PAID BY YOU IN THE THREE (3) MONTHS PRECEDING THE EVENT GIVING RISE TO LIABILITY.
                    </p>

                    <h2 className="text-2xl mt-16 mb-6 font-sans font-bold text-dark border-b border-dark/10 pb-4">9. Governing Law</h2>
                    <p className="mb-8">
                        These Terms shall be governed by and construed in accordance with the laws of the State of New York.
                    </p>

                    <h2 className="text-2xl mt-16 mb-6 font-sans font-bold text-dark border-b border-dark/10 pb-4">10. Contact Information</h2>
                    <p className="mb-8 p-6 bg-dark/5 rounded-xl border border-dark/10">
                        <strong className="text-dark font-sans tracking-widest text-lg">RSL/A</strong><br />
                        <span className="opacity-50 text-xs uppercase tracking-widest mt-2 block">Direct Inquiry:</span>
                        <a href="mailto:lalia@rsla.io" className="text-accent hover:underline font-mono text-base mt-1 block">
                            lalia@rsla.io
                        </a>
                    </p>

                    <p className="mt-20 text-xs text-dark/30 uppercase tracking-widest border-t border-dark/10 pt-6">
                        Last updated: February 2026
                    </p>
                </div>
            </div>
        </main>
    );
}
