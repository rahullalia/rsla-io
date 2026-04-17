import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';

const serviceSubLinks = [
    { title: 'Websites', url: '/services/websites' },
    { title: 'Search Visibility', url: '/services/search-visibility' },
    { title: 'AI Automations', url: '/services/ai-automations' },
    { title: 'CRM Systems', url: '/services/crm-systems' },
    { title: 'Custom Development', url: '/services/custom-development' },
];

const menu = [
    { title: 'Home', url: '/' },
    { title: 'About', url: '/about' },
    { title: 'Services', url: '/services', children: serviceSubLinks },
    { title: 'Work', url: '/work' },
    { title: 'Blog', url: '/blog' },
];

const LOGO_SRC = '/images/logo/logomark.svg';

export default function NavbarV3() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
        setMobileServicesOpen(false);
    }, [location.pathname]);

    const isActive = (url) => {
        if (url === '/') return location.pathname === '/';
        return location.pathname.startsWith(url);
    };

    const handleCtaClick = () => {
        navigate('/contact');
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
                    scrolled || mobileOpen
                        ? 'bg-background/85 backdrop-blur-md border-b border-accent-border'
                        : 'bg-transparent'
                }`}
            >
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-4">
                    {/* Desktop */}
                    <nav className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center">
                        <Link to="/" className="flex items-center shrink-0 justify-self-start" aria-label="RSL/A home">
                            <img
                                src={LOGO_SRC}
                                alt="RSL/A"
                                className="h-10 w-auto"
                            />
                        </Link>
                        <ul className="flex items-center justify-self-center">
                            {menu.map((item) => {
                                const active = isActive(item.url);

                                if (item.children) {
                                    return (
                                        <li key={item.url} className="relative group">
                                            <Link
                                                to={item.url}
                                                className={`inline-flex h-11 items-center gap-1 px-5 font-sans font-medium text-base transition-colors ${
                                                    active ? 'text-accent' : 'text-text/70 hover:text-text'
                                                }`}
                                            >
                                                {item.title}
                                                <ChevronDown size={14} strokeWidth={2} className="opacity-50 transition-transform group-hover:rotate-180" />
                                            </Link>
                                            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute top-full left-0 pt-2">
                                                <div className="bg-surface border border-accent-border rounded-xl shadow-lg py-2 min-w-[220px]">
                                                    {item.children.map((child) => (
                                                        <Link
                                                            key={child.url}
                                                            to={child.url}
                                                            className={`block px-5 py-2.5 font-sans text-sm transition-colors ${
                                                                location.pathname === child.url
                                                                    ? 'text-accent bg-accent/5'
                                                                    : 'text-text/70 hover:text-text hover:bg-surfaceAlt'
                                                            }`}
                                                        >
                                                            {child.title}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </li>
                                    );
                                }

                                return (
                                    <li key={item.url}>
                                        <Link
                                            to={item.url}
                                            className={`inline-flex h-11 items-center px-5 font-sans font-medium text-base transition-colors ${
                                                active ? 'text-accent' : 'text-text/70 hover:text-text'
                                            }`}
                                        >
                                            {item.title}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="flex items-center gap-2 shrink-0 justify-self-end">
                            <InteractiveHoverButton
                                onClick={handleCtaClick}
                                className="font-sans font-bold text-sm px-5 py-2.5"
                            >
                                Let&apos;s Talk
                            </InteractiveHoverButton>
                        </div>
                    </nav>

                    {/* Mobile */}
                    <div className="flex lg:hidden items-center justify-between">
                        <Link to="/" className="flex items-center" aria-label="RSL/A home">
                            <img
                                src={LOGO_SRC}
                                alt="RSL/A"
                                className="h-10 w-auto"
                            />
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-accent-border bg-surface text-text hover:bg-surfaceAlt transition-colors"
                        >
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile sheet */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 top-[64px] z-40 bg-background">
                    <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8 h-full overflow-y-auto">
                        <ul className="flex flex-col">
                            {menu.map((item) => {
                                if (item.children) {
                                    return (
                                        <li key={item.url}>
                                            <button
                                                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                                                className={`w-full flex items-center justify-between py-4 font-sans font-semibold text-xl border-b border-accent-border ${
                                                    isActive(item.url) ? 'text-accent' : 'text-text'
                                                }`}
                                            >
                                                {item.title}
                                                <ChevronDown size={18} strokeWidth={2} className={`transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                            {mobileServicesOpen && (
                                                <ul className="pl-4 border-b border-accent-border">
                                                    <li>
                                                        <Link
                                                            to={item.url}
                                                            className="block py-3 font-sans text-base text-textMuted hover:text-accent transition-colors"
                                                        >
                                                            All Services
                                                        </Link>
                                                    </li>
                                                    {item.children.map((child) => (
                                                        <li key={child.url}>
                                                            <Link
                                                                to={child.url}
                                                                className={`block py-3 font-sans text-base transition-colors ${
                                                                    location.pathname === child.url ? 'text-accent' : 'text-textMuted hover:text-accent'
                                                                }`}
                                                            >
                                                                {child.title}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    );
                                }
                                return (
                                    <li key={item.url}>
                                        <Link
                                            to={item.url}
                                            className={`block py-4 font-sans font-semibold text-xl border-b border-accent-border ${
                                                isActive(item.url) ? 'text-accent' : 'text-text'
                                            }`}
                                        >
                                            {item.title}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="flex flex-col gap-3">
                            <InteractiveHoverButton
                                onClick={handleCtaClick}
                                className="w-full font-sans font-bold text-base px-6 py-4"
                            >
                                Let&apos;s Talk
                            </InteractiveHoverButton>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
