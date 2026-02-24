import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

const contactActions = [
    {
        label: 'Save My Info',
        icon: '📱',
        href: '/rahul.vcf',
        highlight: true,
    },
    {
        label: "Let's Talk",
        icon: '📞',
        href: 'tel:+16466413173',
    },
    {
        label: 'Text Me',
        icon: '💬',
        href: "sms:+16466413173?body=Hi%20Rahul%2C%20I'd%20like%20to%20connect%20with%20you.",
    },
    {
        label: 'Visit Website',
        icon: '🌐',
        href: 'https://rsla.io',
        external: true,
    },
];

const socials = [
    {
        name: 'LinkedIn',
        href: 'https://www.linkedin.com/in/rahullalia/',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
    },
    {
        name: 'Instagram',
        href: 'https://www.instagram.com/rahul.lalia/',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
        ),
    },
    {
        name: 'TikTok',
        href: 'https://www.tiktok.com/@rahul_lalia',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.18 8.18 0 004.77 1.52V6.79a4.83 4.83 0 01-1-.1z" />
            </svg>
        ),
    },
];

export default function Rahul() {
    return (
        <main className="min-h-screen bg-dark text-white flex items-center justify-center px-4 py-12">
            <Seo
                title="Rahul Lalia | RSL/A"
                description="Connect with Rahul Lalia, Founder & CEO of RSL/A."
                noIndex
            />
            {/* Background gradient */}
            <div className="fixed inset-0 bg-gradient-to-br from-accent/5 via-transparent to-cyan/5 pointer-events-none" />

            {/* Card */}
            <div className="relative z-10 w-full max-w-sm bg-white/[0.03] border border-white/10 backdrop-blur-sm rounded-[2rem] px-8 py-10 flex flex-col items-center shadow-2xl">
                {/* Profile photo */}
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-accent/30 shadow-lg shadow-accent/10 mb-6">
                    <img src="/images/rahul.png" alt="Rahul Lalia" className="w-full h-full object-cover" />
                </div>

                {/* Name & title */}
                <h1 className="font-sans font-bold text-2xl tracking-tight mb-1.5">Rahul Lalia</h1>
                <p className="font-sans text-accent text-sm font-bold mb-1">Founder & CEO, RSL/A</p>
                <p className="font-body text-white/40 text-sm mb-8">Marketing & AI Automation Expert</p>

                {/* Contact actions */}
                <div className="w-full flex flex-col gap-3 mb-8">
                    {contactActions.map((action) => (
                        <a
                            key={action.label}
                            href={action.href}
                            target={action.external ? '_blank' : undefined}
                            rel={action.external ? 'noopener noreferrer' : undefined}
                            className={`flex items-center justify-center gap-2.5 w-full py-4 rounded-full text-sm font-sans font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 ${
                                action.highlight
                                    ? 'bg-accent text-white btn-neon'
                                    : 'bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08]'
                            }`}
                        >
                            <span className="text-base">{action.icon}</span>
                            <span>{action.label}</span>
                        </a>
                    ))}
                </div>

                {/* Divider */}
                <div className="w-full border-t border-white/[0.06] mb-6" />

                {/* Email */}
                <a
                    href="mailto:lalia@rsla.io"
                    className="font-mono text-xs uppercase tracking-wider text-white/40 hover:text-accent transition-colors mb-5"
                >
                    📧 lalia@rsla.io
                </a>

                {/* Socials */}
                <div className="flex items-center gap-6 mb-8">
                    {socials.map((social) => (
                        <a
                            key={social.name}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/25 hover:text-accent transition-colors duration-300"
                            aria-label={social.name}
                        >
                            {social.icon}
                        </a>
                    ))}
                </div>

                {/* Divider */}
                <div className="w-full border-t border-white/[0.06] mb-6" />

                {/* Footer */}
                <Link to="/" className="font-mono text-[10px] uppercase tracking-widest text-white/15 hover:text-white/30 transition-colors">
                    Powered by RSL/A
                </Link>
            </div>
        </main>
    );
}
