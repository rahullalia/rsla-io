import { lazy, Suspense, useEffect, useState, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NavbarV2 from './components/NavbarV2';
import FooterV2 from './components/FooterV2';
import CookieConsent, { initConsent } from './components/CookieConsent';
import ScrollToTop from './components/ScrollToTop';

// Homepage loads eagerly (critical path)
import Home from './pages/Home';

// Retry wrapper for lazy imports — retries up to 3 times on network failure
// (handles flaky mobile connections and post-deploy chunk invalidation)
function lazyRetry(importFn) {
  return lazy(() =>
    new Promise((resolve, reject) => {
      const attempt = (remaining) => {
        importFn()
          .then(resolve)
          .catch((err) => {
            if (remaining <= 0) {
              // After retries exhausted, force reload to get fresh chunk references
              // (handles deploy-time chunk hash changes)
              window.location.reload();
              return;
            }
            setTimeout(() => attempt(remaining - 1), 1500);
          });
      };
      attempt(3);
    })
  );
}

// Scroll to top on route change, or to hash anchor if present (e.g. /#contact)
// Also proactively kills GSAP ScrollTriggers to prevent DOM desync during unmount.
function useScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    // NOTE: Do NOT kill ScrollTriggers here. Each page component cleans up
    // its own GSAP context via ctx.revert() in useEffect cleanup. Killing
    // them here destroys the NEW page's ScrollTriggers (child effects fire
    // before parent effects). ResilientErrorBoundary handles any remaining
    // DOM desync from GSAP pins during unmount.

    if (hash) {
      const id = hash.replace('#', '');
      const tryScroll = (attempts = 0) => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else if (attempts < 30) {
          setTimeout(() => tryScroll(attempts + 1), 100);
        }
      };
      tryScroll();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
}

// Minimal loading indicator shown while lazy chunks download
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
    </div>
  );
}

// Everything else lazy-loaded with retry
const About = lazyRetry(() => import('./pages/About'));
const Services = lazyRetry(() => import('./pages/Services'));
const HowItWorksPage = lazyRetry(() => import('./pages/HowItWorksPage'));
const StartHere = lazyRetry(() => import('./pages/StartHere'));
const Work = lazyRetry(() => import('./pages/Work'));
const WorkInner = lazyRetry(() => import('./pages/WorkInner'));
const Blog = lazyRetry(() => import('./pages/Blog'));
const BlogInner = lazyRetry(() => import('./pages/BlogInner'));
const Privacy = lazyRetry(() => import('./pages/Privacy'));
const Terms = lazyRetry(() => import('./pages/Terms'));
const BookCall = lazyRetry(() => import('./pages/BookCall'));
const BookingConfirmed = lazyRetry(() => import('./pages/BookingConfirmed'));
const Rahul = lazyRetry(() => import('./pages/Rahul'));
const Sid = lazyRetry(() => import('./pages/Sid'));
const Disclaimer = lazyRetry(() => import('./pages/Disclaimer'));
const Accessibility = lazyRetry(() => import('./pages/Accessibility'));
const Insider = lazyRetry(() => import('./pages/Insider'));
const IndustryPage = lazyRetry(() => import('./pages/IndustryPage'));
const NotFound = lazyRetry(() => import('./pages/NotFound'));

const chromelessRoutes = ['/rahul', '/sid', '/booking-confirmed'];

// Load GTM immediately if user already accepted cookies
initConsent();

function App() {
  const location = useLocation();
  useScrollToTop();
  const hideChrome = chromelessRoutes.includes(location.pathname);
  const isInitialLoad = useRef(true);
  const [pageReady, setPageReady] = useState(true);

  useEffect(() => {
    // Skip fade on initial page load — show content immediately
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    // Fade transition only on client-side navigation
    setPageReady(false);
    const frame = requestAnimationFrame(() => setPageReady(true));
    return () => cancelAnimationFrame(frame);
  }, [location.pathname]);

  return (
    <main className="w-full bg-background min-h-screen text-text selection:bg-accent selection:text-white">
      {!hideChrome && <NavbarV2 />}

      <div className={`transition-opacity duration-300 ease-out ${pageReady ? 'opacity-100' : 'opacity-0'}`}>
        <Suspense fallback={<PageLoader />}>
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

            {/* Programmatic SEO — Industry Pages */}
            <Route path="/ai-for/:slug" element={<IndustryPage />} />

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
