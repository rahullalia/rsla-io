import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';
    const darkHeroPages = ['/', '/about', '/services', '/start-here', '/how-it-works'];
    const isDarkBgPage = darkHeroPages.includes(location.pathname);
    const pagesWithContact = ['/', '/about', '/services', '/start-here', '/how-it-works'];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const navLinks = [
        { to: '/', label: 'Home', onClick: scrollToTop },
        { to: '/about', label: 'About' },
        { to: '/work', label: 'Work' },
        { to: '/blog', label: 'Blog' },
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 w-full pointer-events-none">
            <div
                className={`pointer-events-auto flex items-center justify-between w-full max-w-5xl px-6 py-3 transition-all duration-500 rounded-[2rem] ${scrolled
                    ? 'bg-background/90 backdrop-blur-2xl border border-dark/10 text-dark shadow-md shadow-dark/5 translate-y-0'
                    : `bg-transparent border border-transparent translate-y-0 ${isDarkBgPage ? 'text-white' : 'text-dark'}`
                    }`}
            >
                <div className="flex items-center gap-2">
                    <Link to="/" onClick={scrollToTop} className="flex items-center">
                        <img
                            src="/images/logo/logomark.svg"
                            alt="RSL/A Logo"
                            className={`${scrolled ? 'h-5 md:h-[22px]' : 'h-6 md:h-[26px]'} w-auto transition-all duration-300`}
                        />
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-8 font-mono text-sm uppercase tracking-wider">
                    {navLinks.map(({ to, label, onClick }) => (
                        <Link
                            key={to}
                            to={to}
                            onClick={onClick}
                            className={`hover:-translate-y-[1px] transition-transform ${isActive(to) ? 'text-accent font-bold' : ''}`}
                        >
                            {label}
                        </Link>
                    ))}
                </div>

                {/* Hamburger button — mobile only */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] relative z-50"
                    aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                >
                    <span
                        className={`block w-5 h-[2px] rounded-full transition-all duration-300 origin-center ${
                            scrolled ? 'bg-dark' : (isDarkBgPage ? 'bg-white' : 'bg-dark')
                        } ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`}
                    />
                    <span
                        className={`block w-5 h-[2px] rounded-full transition-all duration-300 ${
                            scrolled ? 'bg-dark' : (isDarkBgPage ? 'bg-white' : 'bg-dark')
                        } ${mobileOpen ? 'opacity-0' : ''}`}
                    />
                    <span
                        className={`block w-5 h-[2px] rounded-full transition-all duration-300 origin-center ${
                            scrolled ? 'bg-dark' : (isDarkBgPage ? 'bg-white' : 'bg-dark')
                        } ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}
                    />
                </button>

                {/* Desktop CTA */}
                <div className="hidden md:block">
                    <button
                        onClick={() => {
                            if (pagesWithContact.includes(location.pathname)) {
                                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                            } else {
                                navigate('/#contact');
                            }
                        }}
                        className={`inline-block relative px-5 py-2.5 rounded-full text-sm font-sans font-bold transition-transform hover:scale-[1.03] active:scale-95 duration-300 btn-neon cursor-pointer ${scrolled
                            ? 'bg-accent text-white'
                            : (isDarkBgPage ? 'bg-white text-dark' : 'bg-dark text-white')}`}
                    >
                        <span className="relative z-10">Let's Talk</span>
                    </button>
                </div>
            </div>

            {/* Mobile menu overlay */}
            <div
                className={`fixed inset-0 bg-dark z-40 flex flex-col items-center justify-center transition-all duration-500 md:hidden ${
                    mobileOpen
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                }`}
            >
                <div className={`flex flex-col items-center gap-8 font-mono text-sm uppercase tracking-widest transition-all duration-500 delay-100 ${
                    mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}>
                    {navLinks.map(({ to, label, onClick }) => (
                        <Link
                            key={to}
                            to={to}
                            onClick={() => {
                                setMobileOpen(false);
                                if (onClick) onClick();
                            }}
                            className={`text-lg text-white transition-colors ${
                                isActive(to) ? 'text-accent font-bold' : 'hover:text-accent/80'
                            }`}
                        >
                            {label}
                        </Link>
                    ))}

                    <button
                        onClick={() => {
                            setMobileOpen(false);
                            if (pagesWithContact.includes(location.pathname)) {
                                setTimeout(() => {
                                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                                }, 300);
                            } else {
                                navigate('/#contact');
                            }
                        }}
                        className="mt-4 inline-block px-8 py-3 rounded-full text-sm font-sans font-bold bg-accent text-white transition-transform hover:scale-[1.03] active:scale-95 btn-neon cursor-pointer"
                    >
                        <span className="relative z-10">Let's Talk</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
