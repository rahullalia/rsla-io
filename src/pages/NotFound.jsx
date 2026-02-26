import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function NotFound() {
    return (
        <main className="min-h-screen bg-surface relative overflow-hidden flex items-center justify-center">
            <Seo title="Page Not Found | RSL/A" />
            {/* Background noise grid */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,112,243,0.05),transparent_60%)] pointer-events-none" />

            <section className="relative z-10 px-6 py-32 w-full max-w-2xl mx-auto text-center">
                {/* 404 Number */}
                <h1 className="text-[10rem] md:text-[14rem] font-sans font-bold leading-none tracking-tighter text-text mb-4 group cursor-default">
                    <span className="text-accent hover:animate-pulse inline-block transition-transform duration-300">4</span>
                    <span className="text-textLight inline-block px-1">0</span>
                    <span className="text-accent hover:animate-pulse inline-block transition-transform duration-300">4</span>
                </h1>

                {/* Message */}
                <h2 className="text-2xl md:text-3xl font-sans font-bold text-text mb-4">
                    Signal lost.
                </h2>
                <p className="font-mono text-textMuted text-sm md:text-base leading-relaxed mb-10 max-w-sm mx-auto">
                    The endpoint you requested does not exist or has been re-routed.
                </p>

                {/* CTAs */}
                <div className="flex flex-col items-center gap-4">
                    <Link
                        to="/"
                        className="px-8 py-3 bg-accent hover:bg-accent/90 text-white rounded-full font-sans font-bold text-sm transition-all shadow-[0_0_20px_rgba(0,112,243,0.3)] hover:scale-105"
                    >
                        Return to Home
                    </Link>
                    <div className="flex gap-4">
                        <Link
                            to="/work"
                            className="px-6 py-2.5 text-textMuted hover:text-text border border-accent-border hover:border-accent/30 rounded-full font-sans font-bold text-sm transition-all"
                        >
                            Work
                        </Link>
                        <Link
                            to="/blog"
                            className="px-6 py-2.5 text-textMuted hover:text-text border border-accent-border hover:border-accent/30 rounded-full font-sans font-bold text-sm transition-all"
                        >
                            Blog
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
