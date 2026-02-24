import { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

const benefits = [
    'Case studies saving clients $20K to $136K annually',
    'Actionable automation tips you can use today',
    'Tool recommendations from real implementations',
];

export default function Insider() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Wire up to newsletter provider (ConvertKit, Mailchimp, GHL, etc.)
        setSubmitted(true);
    };

    return (
        <main className="min-h-screen bg-dark text-white relative overflow-hidden flex items-center justify-center px-6">
            <Seo
                title="Insider Newsletter | RSL/A"
                description="Get weekly automation insights delivered to your inbox."
                noIndex
            />
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-cyan/5 pointer-events-none" />

            <div className="relative z-10 max-w-lg w-full text-center">
                {/* Tag */}
                <span className="inline-block font-mono text-[10px] md:text-xs uppercase tracking-widest text-accent border border-accent/30 rounded-full px-4 py-1.5 mb-8">
                    The RSL/A Insider
                </span>

                {/* Headline */}
                <h1 className="font-sans font-bold text-3xl md:text-5xl tracking-tight mb-4 leading-tight">
                    Automate smarter <span className="font-drama italic font-normal">every week.</span>
                </h1>

                {/* Subhead */}
                <p className="font-body text-white/50 text-base md:text-lg mb-10 max-w-md mx-auto">
                    Real automation strategies, case studies, and AI tools delivered straight to your inbox every week.
                </p>

                {/* Benefits */}
                <div className="text-left max-w-sm mx-auto mb-10 space-y-3">
                    {benefits.map((benefit) => (
                        <div key={benefit} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                            <p className="font-body text-sm text-white/60">{benefit}</p>
                        </div>
                    ))}
                </div>

                {submitted ? (
                    <div className="bg-white/[0.04] border border-emerald-400/20 rounded-2xl p-8">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-emerald-400/40 flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <p className="font-sans font-bold text-lg mb-1">You're in.</p>
                        <p className="font-body text-sm text-white/40">Check your inbox to confirm your subscription.</p>
                    </div>
                ) : (
                    <>
                        {/* Signup form */}
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4">
                            <input
                                type="email"
                                required
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 px-5 py-3.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-white font-body text-sm placeholder:text-white/25 focus:outline-none focus:border-accent/50 transition-colors"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3.5 rounded-full bg-accent text-white font-sans font-bold text-sm btn-neon hover:scale-[1.03] active:scale-95 transition-transform duration-300 whitespace-nowrap"
                            >
                                Get weekly insights
                            </button>
                        </form>

                        {/* Trust line */}
                        <p className="font-body text-xs text-white/25">
                            No spam, unsubscribe anytime.{' '}
                            <Link to="/privacy-policy" className="underline underline-offset-2 hover:text-white/40 transition-colors">
                                Privacy Policy
                            </Link>
                        </p>
                    </>
                )}
            </div>
        </main>
    );
}
