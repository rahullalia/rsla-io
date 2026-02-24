import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';
    const isDarkBgPage = isHome;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

                <div>
                    <Link
                        to="/book-a-call"
                        className={`inline-block relative px-5 py-2.5 rounded-full text-sm font-sans font-bold transition-transform hover:scale-[1.03] active:scale-95 duration-300 btn-neon ${scrolled
                            ? 'bg-accent text-white'
                            : (isDarkBgPage ? 'bg-white text-dark' : 'bg-dark text-white')}`}
                    >
                        <span className="relative z-10">Let's Talk</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
