/**
 * Footer V2 — adapted from 21st.dev footer template
 * Clean 4-column layout with newsletter subscribe.
 * Dark footer (#0A0A0A) anchoring the light site.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';

const navLinks = [
    { label: 'About', to: '/about' },
    { label: 'Services', to: '/services' },
    { label: 'How It Works', to: '/how-it-works' },
    { label: 'Work', to: '/work' },
    { label: 'Blog', to: '/blog' },
];

const socials = [
    { label: 'Instagram', href: 'https://www.instagram.com/rahul.lalia/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rahullalia/' },
    { label: 'YouTube', href: 'https://www.youtube.com/@rahul_lalia' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@rahul_lalia' },
    { label: 'X', href: 'https://x.com/rahul_lalia' },
];

export default function FooterV2() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle | submitting | success | error

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email || status === 'submitting') return;

        setStatus('submitting');
        try {
            const res = await fetch('https://api.convertkit.com/v3/forms/9130465/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ api_key: import.meta.env.VITE_KIT_API_KEY, email }),
            });
            if (res.ok) {
                setStatus('success');
                setEmail('');
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
        setTimeout(() => setStatus('idle'), 3000);
    };

    return (
        <footer className="bg-[#0A0A0A] text-white px-6 md:px-12">
            <div className="max-w-7xl mx-auto py-16">
                {/* Main grid */}
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12 mb-12">
                    {/* Brand */}
                    <div className="flex flex-col gap-4">
                        <Link to="/" className="inline-block">
                            <img
                                src="/images/logo/lockup-nobg.webp"
                                alt="RSL/A Logo"
                                width="200"
                                height="80"
                                className="h-20 w-auto"
                            />
                        </Link>
                        <p className="font-body text-sm text-white/50 leading-relaxed max-w-xs">
                            I show founders how to put AI to work, then I build it for them.
                        </p>
                        <a
                            href="mailto:hello@rsla.io"
                            className="font-body text-sm text-accent hover:text-white transition-colors inline-flex items-center min-h-[44px]"
                        >
                            hello@rsla.io
                        </a>
                        <div className="flex items-center gap-3">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                            </span>
                            <span className="font-mono text-xs uppercase tracking-wider text-white/60">
                                Taking New Clients
                            </span>
                        </div>
                    </div>

                    {/* Explore */}
                    <div>
                        <p className="font-sans font-bold text-sm uppercase tracking-wider mb-4 text-white/80">
                            Explore
                        </p>
                        <ul className="flex flex-col gap-0.5">
                            {navLinks.map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className="font-body text-sm text-white/50 hover:text-white transition-colors inline-flex items-center min-h-[44px]"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Follow */}
                    <div>
                        <p className="font-sans font-bold text-sm uppercase tracking-wider mb-4 text-white/80">
                            Follow
                        </p>
                        <ul className="flex flex-col gap-0.5">
                            {socials.map((social) => (
                                <li key={social.label}>
                                    <a
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-body text-sm text-white/50 hover:text-white transition-colors inline-flex items-center min-h-[44px]"
                                    >
                                        {social.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <p className="font-sans font-bold text-sm uppercase tracking-wider mb-4 text-white/80">
                            The Insider
                        </p>
                        <p className="font-body text-base text-white/60 mb-4">
                            Join the insider club. AI and marketing insights, weekly.
                        </p>
                        <form onSubmit={handleSubscribe} className="relative">
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={status === 'submitting' || status === 'success'}
                                    required
                                    className="flex-1 px-4 min-h-[44px] rounded-lg bg-white/5 border border-white/10 text-white font-body text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'submitting' || status === 'success'}
                                    className="px-4 min-h-[44px] rounded-lg bg-accent text-white font-sans font-bold text-sm hover:bg-accent/90 transition-colors disabled:opacity-50"
                                >
                                    {status === 'submitting' ? '...' : 'Join'}
                                </button>
                            </div>
                            {status === 'success' && (
                                <p className="font-body text-xs text-green-400 mt-2">You're in. Check your inbox.</p>
                            )}
                            {status === 'error' && (
                                <p className="font-body text-xs text-coral mt-2">Something went wrong. Try again.</p>
                            )}
                        </form>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="font-mono text-xs text-white/30">
                        &copy; {new Date().getFullYear()} RSL/A. All rights reserved.
                    </p>
                    <div className="flex flex-wrap gap-x-4 justify-center md:justify-end">
                        <Link to="/privacy-policy" className="font-mono text-xs text-white/30 hover:text-white transition-colors inline-flex items-center min-h-[44px]">
                            Privacy
                        </Link>
                        <Link to="/terms" className="font-mono text-xs text-white/30 hover:text-white transition-colors inline-flex items-center min-h-[44px]">
                            Terms
                        </Link>
                        <Link to="/disclaimer" className="font-mono text-xs text-white/30 hover:text-white transition-colors inline-flex items-center min-h-[44px]">
                            Disclaimer
                        </Link>
                        <Link to="/accessibility" className="font-mono text-xs text-white/30 hover:text-white transition-colors inline-flex items-center min-h-[44px]">
                            Accessibility
                        </Link>
                        <button
                            onClick={() => {
                                localStorage.removeItem('rsla_cookie_consent');
                                window.location.reload();
                            }}
                            className="font-mono text-xs text-white/30 hover:text-white transition-colors inline-flex items-center min-h-[44px]"
                        >
                            Cookie Settings
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
