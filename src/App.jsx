import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NavbarV2 from './components/NavbarV2';
import FooterV2 from './components/FooterV2';
import CookieConsent, { initConsent } from './components/CookieConsent';

// Homepage loads eagerly (critical path)
import Home from './pages/Home';

// Scroll to top on route change, or to hash anchor if present (e.g. /#contact)
function useScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
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

  return (
    <main className="w-full bg-background min-h-screen text-text selection:bg-accent selection:text-white">
      {!hideChrome && <NavbarV2 />}

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

      {!hideChrome && <FooterV2 />}
      <CookieConsent />
    </main>
  );
}

export default App;
