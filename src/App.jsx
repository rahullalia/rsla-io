import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Homepage loads eagerly (critical path)
import Home from './pages/Home';

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
const Insider = lazy(() => import('./pages/Insider'));
const NotFound = lazy(() => import('./pages/NotFound'));


const chromelessRoutes = ['/rahul'];

function App() {
  const location = useLocation();
  const hideChrome = chromelessRoutes.includes(location.pathname);

  return (
    <main className="w-full bg-background min-h-screen text-dark selection:bg-accent selection:text-white">
      {!hideChrome && <Navbar />}

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
          <Route path="/book-a-call" element={<BookCall />} />
          <Route path="/booking-confirmed" element={<BookingConfirmed />} />
          <Route path="/rahul" element={<Rahul />} />
          <Route path="/insider" element={<Insider />} />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {!hideChrome && <Footer />}
    </main>
  );
}

export default App;
