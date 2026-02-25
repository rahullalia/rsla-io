import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function Privacy() {
    return (
        <main className="min-h-screen bg-background text-dark relative overflow-hidden pt-32 pb-24 px-6 md:px-12">
            <Seo
                title="Privacy Policy | RSL/A"
                description="RSL/A privacy policy. How we collect, use, and protect your information."
                noIndex
            />
            <div className="max-w-4xl mx-auto relative z-10">
                <Link to="/" className="inline-flex items-center gap-2 text-dark/50 hover:text-accent font-mono text-sm transition-colors uppercase tracking-wider mb-12">
                    ← Back to Home
                </Link>

                <h1 className="text-4xl md:text-5xl font-sans font-bold mb-10 tracking-tight">
                    Privacy Policy
                </h1>

                <div className="prose-container max-w-none font-mono text-sm md:text-base leading-relaxed text-dark/80">
                    <p className="mb-8">
                        <strong className="text-dark bg-dark/5 px-2 py-1 rounded">Effective Date:</strong> February 2026
                    </p>

                    <p className="mb-6">
                        This Privacy Policy ("Policy") describes how <strong className="text-accent">RSL/A</strong> ("Company," "we," "us," or "our") collects, uses, shares, and protects your personal information when you visit our website at rsla.io (the "Site") or engage our services.
                    </p>

                    <p className="mb-12">
                        By using our Site or services, you acknowledge that you have read and understood this Policy and consent to the collection, use, and disclosure of your information as described herein.
                    </p>

                    <h2 className="text-2xl mt-16 mb-6 font-sans font-bold text-dark border-b border-dark/10 pb-4">1. Information We Collect</h2>

                    <h3 className="text-lg mt-8 mb-4 font-sans font-semibold text-dark">1.1 Personal Information You Provide</h3>
                    <p className="mb-4">
                        When you use our Site, submit inquiries, engage our services, or communicate with us, you may provide:
                    </p>
                    <ul className="list-disc pl-8 mb-8 space-y-3 marker:text-accent">
                        <li><strong className="text-dark">Contact Information:</strong> Name, email address, phone number, company name, job title.</li>
                        <li><strong className="text-dark">Payment Information:</strong> Credit/debit card details processed securely through third-party processors.</li>
                        <li><strong className="text-dark">Business Information:</strong> Industry, marketing goals, budget, website URLs.</li>
                        <li><strong className="text-dark">Communications:</strong> Information in your emails, messages, or calls with us.</li>
                    </ul>

                    <h3 className="text-lg mt-8 mb-4 font-sans font-semibold text-dark">1.2 Information Automatically Collected</h3>
                    <ul className="list-disc pl-8 mb-8 space-y-3 marker:text-accent">
                        <li><strong className="text-dark">Device Information:</strong> IP address, browser type, operating system.</li>
                        <li><strong className="text-dark">Usage Information:</strong> Pages visited, time spent, links clicked.</li>
                        <li><strong className="text-dark">Cookies:</strong> We use cookies and similar technologies to collect information.</li>
                    </ul>

                    <h2 className="text-2xl mt-16 mb-6 font-sans font-bold text-dark border-b border-dark/10 pb-4">2. How We Use Your Information</h2>
                    <ul className="list-disc pl-8 mb-8 space-y-3 marker:text-accent">
                        <li>Delivering services you request (marketing campaigns, website development, CRM setup, AI automation).</li>
                        <li>Communicating with you about your project and providing support.</li>
                        <li>Processing payments and maintaining billing records.</li>
                        <li>Sending promotional emails and marketing materials (you may opt out at any time).</li>
                        <li>Analyzing and improving our services and user experience.</li>
                    </ul>

                    <h2 className="text-2xl mt-16 mb-6 font-sans font-bold text-dark border-b border-dark/10 pb-4">3. AI and Automation</h2>
                    <p className="mb-8 p-6 bg-accent/5 border border-accent/20 rounded-xl">
                        We use artificial intelligence tools (including Claude, ChatGPT, and other AI services) to generate content, analyze data, and automate workflows. By using our services, you consent to our use of AI tools to process your information.
                    </p>

                    <h2 className="text-2xl mt-16 mb-6 font-sans font-bold text-dark border-b border-dark/10 pb-4">4. How We Share Your Information</h2>
                    <p className="mb-4">
                        We do not sell your personal information. We may share information with:
                    </p>
                    <ul className="list-disc pl-8 mb-8 space-y-3 marker:text-accent">
                        <li><strong className="text-dark">Service Providers:</strong> Payment processors, hosting providers, analytics services.</li>
                        <li><strong className="text-dark">Legal Requirements:</strong> When required by law or to protect our rights.</li>
                        <li><strong className="text-dark">Business Transfers:</strong> In connection with mergers or acquisitions.</li>
                    </ul>

                    <h2 className="text-2xl mt-16 mb-6 font-sans font-bold text-dark border-b border-dark/10 pb-4">5. SMS/Text Messaging</h2>
                    <p className="mb-8">
                        No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. SMS consent data is only shared with SMS service providers for message delivery purposes.
                    </p>

                    <h2 className="text-2xl mt-16 mb-6 font-sans font-bold text-dark border-b border-dark/10 pb-4">6. Data Security</h2>
                    <p className="mb-8">
                        We implement reasonable security measures to protect your information. However, no method of transmission over the Internet is 100% secure.
                    </p>

                    <h2 className="text-2xl mt-16 mb-6 font-sans font-bold text-dark border-b border-dark/10 pb-4">7. Your Privacy Rights</h2>
                    <p className="mb-8">
                        Depending on your jurisdiction, you may have rights to access, correct, delete, or opt out of certain uses of your information. Contact us at{' '}
                        <a href="mailto:team@rsla.io" className="text-accent hover:underline decoration-accent/50 underline-offset-4 transition-colors">
                            team@rsla.io
                        </a>{' '}
                        to exercise these rights.
                    </p>

                    <h2 className="text-2xl mt-16 mb-6 font-sans font-bold text-dark border-b border-dark/10 pb-4">8. Contact Us</h2>
                    <p className="mb-8 p-6 bg-dark/5 rounded-xl border border-dark/10">
                        <strong className="text-dark font-sans tracking-widest text-lg">RSL/A</strong><br />
                        <span className="opacity-50 text-xs uppercase tracking-widest mt-2 block">Direct Inquiry:</span>
                        <a href="mailto:team@rsla.io" className="text-accent hover:underline font-mono text-base mt-1 block">
                            team@rsla.io
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
