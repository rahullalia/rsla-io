import { Link } from 'react-router-dom';
import { UserPlus, Phone, MessageCircle, Globe } from 'lucide-react';
import Seo from '../components/Seo';
import { ShineBorder } from '../components/ui/shine-border';

const contactActions = [
    {
        label: 'Save My Info',
        icon: UserPlus,
        href: '/sid.vcf',
        highlight: true,
    },
    {
        label: "Let's Talk",
        icon: Phone,
        href: 'tel:+919356252711',
    },
    {
        label: 'Text Me',
        icon: MessageCircle,
        href: "sms:+919356252711?body=Hi%20Siddharth%2C%20I'd%20like%20to%20connect%20with%20you.",
    },
    {
        label: 'Visit Website',
        icon: Globe,
        href: 'https://rsla.io',
        external: true,
    },
];

const socials = [
    {
        name: 'LinkedIn',
        href: 'https://www.linkedin.com/in/dorddis/',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
    },
    {
        name: 'GitHub',
        href: 'https://github.com/dorddis/',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
        ),
    },
];

export default function Sid() {
    return (
        <main className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
            <Seo
                title="Siddharth Rodrigues | RSL/A"
                description="Connect with Siddharth Rodrigues, Co-Founder & CTO of RSL/A."
                noIndex
            />

            {/* Card */}
            <div className="relative z-10 w-full max-w-sm bg-surfaceAlt border border-accent-border rounded-[2rem] px-8 py-10 flex flex-col items-center shadow-sm overflow-hidden">
                <ShineBorder shineColor={['#0070F3', '#00C2FF']} borderWidth={1} duration={10} />
                {/* Profile photo */}
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-accent/30 shadow-lg shadow-accent/10 mb-6">
                    <img src="/images/sid.webp" alt="Siddharth Rodrigues" className="w-full h-full object-cover" />
                </div>

                {/* Name & title */}
                <h1 className="font-sans font-bold text-2xl tracking-tight mb-1.5 text-text">Siddharth Rodrigues</h1>
                <p className="font-sans text-accent text-sm font-bold mb-1">Co-Founder & CTO, RSL/A</p>
                <p className="font-body text-textLight text-sm mb-8">Software Development & AI Systems Expert</p>

                {/* Contact actions */}
                <div className="w-full flex flex-col gap-3 mb-8">
                    {contactActions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <a
                                key={action.label}
                                href={action.href}
                                target={action.external ? '_blank' : undefined}
                                rel={action.external ? 'noopener noreferrer' : undefined}
                                className={`flex items-center justify-center gap-3 w-full py-5 rounded-full text-base font-sans font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 ${
                                    action.highlight
                                        ? 'bg-accent text-white btn-neon'
                                        : 'bg-surface border border-accent-border text-text hover:border-accent/30'
                                }`}
                            >
                                <Icon size={20} strokeWidth={2} />
                                <span>{action.label}</span>
                            </a>
                        );
                    })}
                </div>

                {/* Divider */}
                <div className="w-full border-t border-accent-border mb-6" />

                {/* Email */}
                <a
                    href="mailto:sid@rsla.io"
                    className="font-mono text-xs tracking-wider text-textLight hover:text-accent transition-colors mb-5 inline-flex items-center min-h-[44px]"
                >
                    sid@rsla.io
                </a>

                {/* Socials */}
                <div className="flex items-center gap-2 mb-8">
                    {socials.map((social) => (
                        <a
                            key={social.name}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-textLight hover:text-accent transition-colors duration-300"
                            aria-label={social.name}
                        >
                            {social.icon}
                        </a>
                    ))}
                </div>

                {/* Divider */}
                <div className="w-full border-t border-accent-border mb-6" />

                {/* Footer */}
                <Link to="/" className="font-mono text-[10px] uppercase tracking-widest text-textLight/50 hover:text-textLight transition-colors inline-flex items-center min-h-[44px] px-4">
                    Powered by RSL/A
                </Link>
            </div>
        </main>
    );
}
