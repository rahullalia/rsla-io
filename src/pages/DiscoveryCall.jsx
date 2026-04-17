import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';

export default function DiscoveryCall() {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://link.msgsndr.com/js/form_embed.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <main className="min-h-screen bg-surface pt-32 pb-24 px-6 md:px-12">
            <Seo
                title="Book a Discovery Call | RSL/A"
                description="Book a free 30-minute growth mapping call. We'll audit your funnel, find the bottlenecks, and show you exactly where AI moves the needle."
                canonical="https://rsla.io/contact"
            />
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="font-sans font-bold text-3xl md:text-5xl tracking-tight leading-[1.1] text-text mb-5">
                        Book a free growth mapping call.
                    </h1>
                    <p className="font-sans text-lg text-textMuted leading-relaxed max-w-xl mx-auto">
                        30 minutes. We audit your funnel, find the bottlenecks, and show you exactly where AI moves the needle. No pitch, just answers.
                    </p>
                </div>

                <div className="bg-surfaceAlt border border-accent-border rounded-2xl p-4 md:p-8">
                    <iframe
                        src="https://api.leadconnectorhq.com/widget/booking/nKrQmOaliDo1haSUwgRS"
                        style={{ width: '100%', border: 'none', overflow: 'hidden' }}
                        scrolling="no"
                        id="TVqOue0iVFx2OyOlu3bS_1776349784731"
                        title="Discovery Call Calendar"
                        className="rounded-xl h-[650px] md:h-[800px]"
                    />
                </div>

                <div className="mt-10 text-center">
                    <p className="font-sans text-sm text-textMuted">
                        Not ready for a call?{' '}
                        <Link to="/work" className="text-accent hover:underline inline-flex items-center gap-1">
                            See our case studies
                            <ArrowRight size={12} strokeWidth={2} />
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
