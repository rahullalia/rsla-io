import { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { FlickeringGrid } from '../components/ui/flickering-grid';
import { TextAnimate } from '@/components/ui/text-animate';

const KIT_FORM_ID = import.meta.env.VITE_KIT_FORM_ID;

const benefits = [
    'Case studies saving clients $20K to $136K annually',
    'Actionable automation tips you can use today',
    'Tool recommendations from real implementations',
];

export default function Insider() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, formId: KIT_FORM_ID }),
            });

            if (!res.ok) throw new Error('Subscription failed');
            setSubmitted(true);
        } catch {
            setError('Something went wrong. Try again?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-surface relative overflow-hidden flex items-center justify-center px-6">
            <Seo
                title="Insider Newsletter | RSL/A"
                description="Get weekly automation insights delivered to your inbox."
                noIndex
            />

            {/* Flickering grid background */}
            <FlickeringGrid
                className="absolute inset-0 z-0"
                squareSize={4}
                gridGap={6}
                color="rgb(0, 112, 243)"
                maxOpacity={0.06}
                flickerChance={0.1}
            />

            <div className="relative z-10 max-w-lg w-full text-center">
                <h1 className="font-sans font-bold text-3xl md:text-5xl tracking-tight mb-4 leading-[1.1] text-text">
                    <TextAnimate animation="blurInUp" by="word" delay={0.08} startOnView={false} as="span">
                        Automate smarter every week.
                    </TextAnimate>
                </h1>

                {/* Subhead */}
                <p className="font-sans text-textMuted text-lg mb-10 max-w-md mx-auto">
                    Real automation strategies, case studies, and AI tools delivered straight to your inbox every week.
                </p>

                {/* Benefits */}
                <div className="text-left max-w-md mx-auto mb-10 space-y-3">
                    {benefits.map((benefit) => (
                        <div key={benefit} className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-accent mt-2.5 shrink-0" />
                            <p className="font-sans text-base text-textMuted leading-relaxed">{benefit}</p>
                        </div>
                    ))}
                </div>

                {submitted ? (
                    <div className="bg-surfaceAlt border border-emerald-400/20 rounded-2xl p-8">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-emerald-400/40 flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <p className="font-sans font-extrabold text-2xl text-text mb-2">You're in.</p>
                        <p className="font-sans text-base text-textMuted">Check your inbox to confirm your subscription.</p>
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
                                className="flex-1 px-5 py-3 rounded-xl bg-surfaceAlt border border-accent-border text-text font-sans text-base placeholder:text-textMuted focus:outline-none focus:border-accent/50 transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent text-white px-6 py-3 font-sans font-bold text-base hover:bg-accent/90 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Subscribing...' : 'Subscribe'}
                            </button>
                        </form>

                        {error && (
                            <p className="font-sans text-sm text-coral mb-2">{error}</p>
                        )}

                        {/* Trust line */}
                        <p className="font-sans text-sm text-textMuted">
                            No spam, unsubscribe anytime.{' '}
                            <Link to="/privacy-policy" className="underline underline-offset-2 hover:text-textMuted transition-colors">
                                Privacy Policy
                            </Link>
                        </p>
                    </>
                )}
            </div>
        </main>
    );
}
