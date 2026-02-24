import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <main className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
            {/* Background noise grid */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,112,243,0.05),transparent_60%)] pointer-events-none" />

            <section className="relative z-10 px-6 py-32 w-full max-w-2xl mx-auto text-center">
                {/* 404 Number */}
                <h1 className="text-[10rem] md:text-[14rem] font-sans font-bold leading-none tracking-tighter text-dark mb-4 group cursor-default">
                    <span className="text-accent hover:animate-pulse inline-block transition-transform duration-300">4</span>
                    <span className="text-dark/20 inline-block px-1">0</span>
                    <span className="text-accent hover:animate-pulse inline-block transition-transform duration-300">4</span>
                </h1>

                {/* Message */}
                <h2 className="text-2xl md:text-3xl font-sans font-bold text-dark mb-4">
                    Signal lost.
                </h2>
                <p className="font-mono text-dark/50 text-sm md:text-base leading-relaxed mb-10 max-w-sm mx-auto">
                    The endpoint you requested does not exist or has been re-routed.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center font-sans font-bold text-sm">
                    <Link
                        to="/"
                        className="px-8 py-3 bg-accent hover:bg-accent/90 text-white rounded-full transition-all shadow-[0_0_20px_rgba(0,112,243,0.3)] hover:scale-105"
                    >
                        Return Home
                    </Link>
                    <Link
                        to="/work"
                        className="px-8 py-3 bg-dark/5 text-dark border border-dark/10 hover:border-dark/30 hover:bg-dark/10 rounded-full transition-all"
                    >
                        View Our Work
                    </Link>
                </div>

                {/* Quick Links */}
                <div className="mt-20 pt-8 border-t border-dark/10 font-mono text-xs uppercase tracking-widest">
                    <p className="text-dark/40 mb-6">Popular Endpoints</p>
                    <div className="flex flex-wrap gap-4 justify-center items-center">
                        <Link to="/work" className="text-accent hover:underline decoration-accent/50 underline-offset-4 transition-colors">
                            Our Work
                        </Link>
                        <span className="text-dark/20">•</span>
                        <Link to="/blog" className="text-accent hover:underline decoration-accent/50 underline-offset-4 transition-colors">
                            Blog
                        </Link>
                        <span className="text-dark/20">•</span>
                        <Link to="/#contact" className="text-accent hover:underline decoration-accent/50 underline-offset-4 transition-colors">
                            Inquire
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
