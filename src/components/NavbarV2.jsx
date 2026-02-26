/**
 * NavbarV2 — Tubelight Navbar (desktop) + Hamburger menu (mobile)
 * Desktop: top floating pill with text labels + lamp glow
 * Mobile: top bar with logo + hamburger, full-screen overlay menu
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Menu, X } from 'lucide-react';

const navItems = [
    { name: 'Home', to: '/' },
    { name: 'About', to: '/about' },
    { name: 'Work', to: '/work' },
    { name: 'Blog', to: '/blog' },
];

export default function NavbarV2() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const pillRef = useRef(null);
    const lampRef = useRef(null);
    const navRefs = useRef({});
    const overlayRef = useRef(null);
    const menuItemsRef = useRef(null);

    const pagesWithContact = ['/'];

    // Determine active tab from current route
    const getActiveIndex = useCallback(() => {
        const path = location.pathname;
        if (path === '/') return 0;
        const idx = navItems.findIndex((item) => item.to !== '/' && path.startsWith(item.to));
        return idx >= 0 ? idx : -1;
    }, [location.pathname]);

    const activeIndex = getActiveIndex();

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    // Animate mobile menu open/close
    useEffect(() => {
        if (!overlayRef.current || !menuItemsRef.current) return;

        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
            gsap.set(overlayRef.current, { display: 'block' });
            gsap.to(overlayRef.current, { opacity: 1, duration: 0.2, ease: 'power2.out' });
            gsap.fromTo(
                menuItemsRef.current.children,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: 'power3.out', delay: 0.1 }
            );
        } else {
            document.body.style.overflow = '';
            gsap.to(overlayRef.current, {
                opacity: 0, duration: 0.2, ease: 'power2.in',
                onComplete: () => gsap.set(overlayRef.current, { display: 'none' }),
            });
        }

        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    // Scroll detection
    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 50);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Animate lamp indicator to active tab (desktop only)
    useEffect(() => {
        if (activeIndex < 0 || !lampRef.current) return;
        const activeEl = navRefs.current[activeIndex];
        if (!activeEl || !pillRef.current) return;

        const pillRect = pillRef.current.getBoundingClientRect();
        const activeRect = activeEl.getBoundingClientRect();

        gsap.to(lampRef.current, {
            left: activeRect.left - pillRect.left,
            width: activeRect.width,
            opacity: 1,
            duration: 0.35,
            ease: 'power2.out',
        });
    }, [activeIndex, scrolled]);

    const handleCtaClick = () => {
        setMobileOpen(false);
        if (pagesWithContact.includes(location.pathname)) {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/#contact');
        }
    };

    return (
        <>
            {/* Desktop navbar — top */}
            <nav className="fixed top-6 left-0 right-0 z-50 hidden md:flex justify-center px-4 pointer-events-none">
                <div className="pointer-events-auto flex items-center gap-6">
                    {/* Logo — fades out on scroll since it sits outside the pill */}
                    <Link
                        to="/"
                        className={`shrink-0 transition-all duration-300 ${
                            scrolled ? 'opacity-0 pointer-events-none -translate-y-1' : 'opacity-100'
                        }`}
                    >
                        <img
                            src="/images/logo/logomark.svg"
                            alt="RSL/A Logo"
                            width="24"
                            height="24"
                            className="h-6 w-auto"
                        />
                    </Link>

                    {/* Pill */}
                    <div
                        ref={pillRef}
                        className={`relative flex items-center gap-1 py-1.5 px-1.5 rounded-full transition-all duration-500 ${
                            scrolled
                                ? 'bg-surface/90 border border-accent-border shadow-md shadow-black/5 backdrop-blur-lg'
                                : 'bg-surface/60 border border-accent-border/50 backdrop-blur-md'
                        }`}
                    >
                        {/* Lamp indicator */}
                        <div
                            ref={lampRef}
                            className="absolute top-0 rounded-full bg-accent/5 -z-0 pointer-events-none"
                            style={{ height: '100%', opacity: activeIndex >= 0 ? 1 : 0 }}
                        >
                            {/* Tubelight glow bar */}
                            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-accent rounded-t-full">
                                <div className="absolute w-12 h-6 bg-accent/20 rounded-full blur-md -top-2 -left-2" />
                                <div className="absolute w-8 h-6 bg-accent/20 rounded-full blur-md -top-1" />
                                <div className="absolute w-4 h-4 bg-accent/20 rounded-full blur-sm top-0 left-2" />
                            </div>
                        </div>

                        {navItems.map((item, i) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                ref={(el) => { navRefs.current[i] = el; }}
                                className={`relative z-10 px-5 py-2 rounded-full font-mono text-sm uppercase tracking-wider transition-colors ${
                                    activeIndex === i
                                        ? 'text-accent font-bold'
                                        : 'text-text/60 hover:text-text'
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* CTA */}
                    <button
                        onClick={handleCtaClick}
                        className="shrink-0 px-5 py-2.5 rounded-full text-sm font-sans font-bold transition-all hover:scale-[1.03] active:scale-95 cursor-pointer bg-accent text-white btn-neon"
                    >
                        Let's Talk
                    </button>
                </div>
            </nav>

            {/* Mobile navbar — top bar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 md:hidden transition-all duration-300 ${
                scrolled ? 'bg-surface/95 backdrop-blur-lg shadow-sm' : 'bg-transparent'
            }`}>
                <div className="flex items-center justify-between px-5 py-4">
                    <Link to="/" className="shrink-0">
                        <img
                            src="/images/logo/logomark.svg"
                            alt="RSL/A Logo"
                            width="28"
                            height="28"
                            className="h-7 w-auto"
                        />
                    </Link>

                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="p-2 text-text/70 hover:text-text transition-colors cursor-pointer"
                        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile full-screen overlay */}
            <div
                ref={overlayRef}
                className="fixed inset-0 z-40 md:hidden"
                style={{ display: 'none', opacity: 0 }}
            >
                <div className="absolute inset-0 bg-surface" />
                <div ref={menuItemsRef} className="relative z-10 flex flex-col items-center justify-center h-full gap-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`font-sans text-3xl font-bold tracking-tight py-3 transition-colors ${
                                location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to))
                                    ? 'text-accent'
                                    : 'text-text/60 hover:text-text'
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <button
                        onClick={handleCtaClick}
                        className="mt-6 px-8 py-3 rounded-full bg-accent text-white font-sans font-bold text-base btn-neon cursor-pointer"
                    >
                        Let's Talk
                    </button>
                </div>
            </div>
        </>
    );
}
