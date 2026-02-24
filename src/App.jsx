import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page Imports
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import HowItWorksPage from './pages/HowItWorksPage';
import StartHere from './pages/StartHere';
import Work from './pages/Work';
import WorkInner from './pages/WorkInner';
import Blog from './pages/Blog';
import BlogInner from './pages/BlogInner';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import BookCall from './pages/BookCall';
import NotFound from './pages/NotFound';


function App() {
  return (
    <main className="w-full bg-background min-h-screen text-dark selection:bg-accent selection:text-white">
      <Navbar />

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

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </main>
  );
}

export default App;
