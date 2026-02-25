import { Link } from 'react-router-dom';

const navLinks = [
    { label: 'About', to: '/about' },
    { label: 'Services', to: '/services' },
    { label: 'How It Works', to: '/how-it-works' },
    { label: 'Start Here', to: '/start-here' },
    { label: 'Work', to: '/work' },
    { label: 'Blog', to: '/blog' },
    { label: 'The Insider', to: '/insider' },
];

const socials = [
    { label: 'Instagram', href: 'https://www.instagram.com/rahulslalia/' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@rahul_lalia' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rahullalia/' },
    { label: 'YouTube', href: 'https://www.youtube.com/@rahul_lalia' },
    { label: 'X', href: 'https://x.com/rahul_lalia' },
];

export default function Footer() {
    return (
        <footer className="bg-dark text-white pt-24 pb-12 px-6 rounded-t-[4rem] rounded-b-none border-t border-dark/10 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] relative mt-[-2rem]">
            <div className="max-w-7xl mx-auto">

                {/* Mobile layout */}
                <div className="md:hidden mb-16 border-b border-white/10 pb-16">
                    {/* Brand */}
                    <div className="mb-10">
                        <img
                            src="/images/logo/lockup-nobg.webp"
                            alt="RSL/A Logo"
                            className="h-16 w-auto mb-5 block"
                        />
                        <p className="font-mono text-white/50 text-sm leading-relaxed mb-6">
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

                    {/* Nav links as wrapped pills */}
                    <div className="mb-10">
                        <div className="flex flex-wrap gap-2.5">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="font-mono text-xs uppercase tracking-wider text-white/50 border border-white/10 rounded-full px-4 py-2 hover:text-white hover:border-white/30 transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Socials as inline row */}
                    <div className="mb-8">
                        <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-sm text-white/50">
                            {socials.map((social) => (
                                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                    {social.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Email */}
                    <a href="mailto:hello@rsla.io" className="font-mono text-sm text-accent hover:text-white transition-colors">
                        hello@rsla.io
                    </a>
                </div>

                {/* Desktop layout */}
                <div className="hidden md:grid grid-cols-4 gap-12 mb-16 border-b border-white/10 pb-16">
                    {/* Brand */}
                    <div>
                        <img
                            src="/images/logo/lockup-nobg.webp"
                            alt="RSL/A Logo"
                            className="h-20 w-auto mb-5 block"
                        />
                        <p className="font-mono text-white/50 text-sm max-w-xs leading-relaxed mb-6">
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

                    {/* Explore */}
                    <div>
                        <h5 className="font-sans font-bold text-sm uppercase tracking-wider mb-4 text-white/80">Explore</h5>
                        <ul className="flex flex-col gap-2.5 font-mono text-sm text-white/50">
                            {navLinks.map((link) => (
                                <li key={link.to}>
                                    <Link to={link.to} className="hover:text-white transition-colors">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Follow */}
                    <div>
                        <h5 className="font-sans font-bold text-sm uppercase tracking-wider mb-4 text-white/80">Follow</h5>
                        <ul className="flex flex-col gap-2.5 font-mono text-sm text-white/50">
                            {socials.map((social) => (
                                <li key={social.label}>
                                    <a href={social.href} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{social.label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Get in Touch */}
                    <div>
                        <h5 className="font-sans font-bold text-sm uppercase tracking-wider mb-4 text-white/80">Get in Touch</h5>
                        <a href="mailto:hello@rsla.io" className="font-mono text-sm text-white/50 hover:text-white transition-colors">
                            hello@rsla.io
                        </a>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-white/40">
                    <p>&copy; {new Date().getFullYear()} RSL/A. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
