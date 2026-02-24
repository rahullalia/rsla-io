import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-dark text-white pt-24 pb-12 px-6 rounded-t-[4rem] rounded-b-none border-t border-dark/10 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] relative mt-[-2rem]">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 border-b border-white/10 pb-16">
                    <div className="md:col-span-2">
                        <img
                            src="/images/logo/lockup-nobg.webp"
                            alt="RSL/A Logo"
                            className="h-20 md:h-28 w-auto mb-6 block"
                        />
                        <p className="font-mono text-white/50 text-sm max-w-sm leading-relaxed mb-8">
                            I show founders how to put AI to work, then I build it for them.
                        </p>
                        <div className="flex items-center gap-3">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <span className="font-mono text-xs uppercase tracking-widest text-white/70">Taking New Clients</span>
                        </div>
                    </div>

                    <div>
                        <h5 className="font-sans font-bold text-lg mb-4 text-white">Services</h5>
                        <ul className="flex flex-col gap-3 font-mono text-sm text-white/60">
                            <li><a href="/work" className="hover:text-white transition-colors">Lead Generation</a></li>
                            <li><a href="/work" className="hover:text-white transition-colors">Automations</a></li>
                            <li><a href="/work" className="hover:text-white transition-colors">Operations</a></li>
                            <li><a href="/work" className="hover:text-white transition-colors">Case Studies</a></li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="font-sans font-bold text-lg mb-4 text-white">Connect</h5>
                        <ul className="flex flex-col gap-3 font-mono text-sm text-white/60">
                            <li><a href="https://www.instagram.com/rahulslalia/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a></li>
                            <li><a href="https://www.tiktok.com/@rahul_lalia" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">TikTok</a></li>
                            <li><a href="https://www.linkedin.com/in/rahullalia/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a></li>
                            <li><a href="https://www.youtube.com/@rahul_lalia" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">YouTube</a></li>
                            <li><a href="https://x.com/rahul_lalia" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">X</a></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center text-xs font-mono text-white/40">
                    <p>&copy; {new Date().getFullYear()} RSL/A. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-white">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
