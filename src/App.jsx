import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NavbarV2 from './components/NavbarV2';
import FooterV2 from './components/FooterV2';
import CookieConsent, { initConsent } from './components/CookieConsent';
import ScrollToTop from './components/ScrollToTop';

// Homepage loads eagerly (critical path)
import Home from './pages/Home';

// Scroll to top on route change, or to hash anchor if present (e.g. /#contact)
// Also proactively kills GSAP ScrollTriggers to prevent DOM desync during unmount.
function useScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    // Kill all active ScrollTriggers BEFORE React unmounts pinned components.
    // This prevents the "removeChild" DOM desync error.
    ScrollTrigger.getAll().forEach(st => st.kill());

    if (hash) {
      const id = hash.replace('#', '');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
}

// Everything else lazy-loaded
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));
const StartHere = lazy(() => import('./pages/StartHere'));
const Work = lazy(() => import('./pages/Work'));
const WorkInner = lazy(() => import('./pages/WorkInner'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogInner = lazy(() => import('./pages/BlogInner'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const BookCall = lazy(() => import('./pages/BookCall'));
const BookingConfirmed = lazy(() => import('./pages/BookingConfirmed'));
const Rahul = lazy(() => import('./pages/Rahul'));
const Sid = lazy(() => import('./pages/Sid'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));
const Accessibility = lazy(() => import('./pages/Accessibility'));
const Insider = lazy(() => import('./pages/Insider'));
const NotFound = lazy(() => import('./pages/NotFound'));

const chromelessRoutes = ['/rahul', '/sid', '/booking-confirmed'];

// Load GTM immediately if user already accepted cookies
initConsent();

function App() {
  const location = useLocation();
  useScrollToTop();
  const hideChrome = chromelessRoutes.includes(location.pathname);
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    setPageReady(false);
    const frame = requestAnimationFrame(() => setPageReady(true));
    return () => cancelAnimationFrame(frame);
  }, [location.pathname]);

  return (
    <main className="w-full bg-background min-h-screen text-text selection:bg-accent selection:text-white">
      {!hideChrome && <NavbarV2 />}

      <div className={`transition-opacity duration-300 ease-out ${pageReady ? 'opacity-100' : 'opacity-0'}`}>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/start-here" element={<StartHere />} />

            {/* Ported Routes */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogInner />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:slug" element={<WorkInner />} />

            {/* Static Pages */}
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="/book-a-call" element={<BookCall />} />
            <Route path="/booking-confirmed" element={<BookingConfirmed />} />
            <Route path="/rahul" element={<Rahul />} />
            <Route path="/sid" element={<Sid />} />
            <Route path="/insider" element={<Insider />} />

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>

      {!hideChrome && <FooterV2 />}
      {!hideChrome && <ScrollToTop />}
      <CookieConsent />
    </main>
  );
}

export default App;
