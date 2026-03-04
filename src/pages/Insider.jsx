import { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { FlickeringGrid } from '../components/ui/flickering-grid';
import { TextAnimate } from '@/components/ui/text-animate';

const KIT_FORM_ID = import.meta.env.VITE_KIT_FORM_ID;
const KIT_API_KEY = import.meta.env.VITE_KIT_API_KEY;

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
            const res = await fetch(
                `https://api.convertkit.com/v3/forms/${KIT_FORM_ID}/subscribe`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ api_key: KIT_API_KEY, email }),
                }
            );

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
                {/* Tag */}
                <span className="inline-block font-mono text-[10px] md:text-xs uppercase tracking-widest text-accent border border-accent/30 rounded-full px-4 py-1.5 mb-8">
                    The RSL/A Insider
                </span>

                <h1 className="font-sans font-bold text-3xl md:text-5xl tracking-tight mb-4 leading-tight text-text">
                    <TextAnimate animation="blurInUp" by="word" delay={0.08} startOnView={false} as="span">
                        Automate smarter
                    </TextAnimate>{' '}
                    <span className="font-drama italic font-normal">
                        <TextAnimate animation="blurInUp" by="word" delay={0.3} startOnView={false} as="span">
                            every week.
                        </TextAnimate></span>
                </h1>

                {/* Subhead */}
                <p className="font-body text-textMuted text-base md:text-lg mb-10 max-w-md mx-auto">
                    Real automation strategies, case studies, and AI tools delivered straight to your inbox every week.
                </p>

                {/* Benefits */}
                <div className="text-left max-w-sm mx-auto mb-10 space-y-3">
                    {benefits.map((benefit) => (
                        <div key={benefit} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                            <p className="font-body text-sm text-textMuted">{benefit}</p>
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
                        <p className="font-sans font-bold text-lg text-text mb-1">You're in.</p>
                        <p className="font-body text-sm text-textMuted">Check your inbox to confirm your subscription.</p>
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
                                className="flex-1 px-5 py-3.5 rounded-full bg-surfaceAlt border border-accent-border text-text font-body text-sm placeholder:text-textMuted focus:outline-none focus:border-accent/50 transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3.5 rounded-full bg-accent text-white font-sans font-bold text-sm btn-neon hover:scale-[1.03] active:scale-95 transition-transform duration-300 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Subscribing...' : 'Get weekly insights'}
                            </button>
                        </form>

                        {error && (
                            <p className="font-body text-sm text-coral mb-2">{error}</p>
                        )}

                        {/* Trust line */}
                        <p className="font-body text-xs text-textMuted">
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
