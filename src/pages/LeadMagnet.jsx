import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Seo from '@/components/Seo';
import { client } from '@/sanity/lib/client';
import { leadMagnetBySlugQuery } from '@/sanity/lib/queries';
import { FlickeringGrid } from '@/components/ui/flickering-grid';

const KIT_FORM_ID = import.meta.env.VITE_KIT_FORM_ID;
const KIT_API_KEY = import.meta.env.VITE_KIT_API_KEY;

export default function LeadMagnet() {
  const { slug } = useParams();
  const [magnet, setMagnet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    client.fetch(leadMagnetBySlugQuery, { slug }).then((data) => {
      if (!data) {
        setNotFound(true);
      } else {
        setMagnet(data);
      }
      setLoading(false);
    });
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !firstName || submitting) return;
    setSubmitting(true);
    setError('');

    try {
      const body = {
        api_key: KIT_API_KEY,
        email,
        first_name: firstName || undefined,
      };
      // Add tag if configured
      if (magnet.kitTagId) {
        body.tags = [magnet.kitTagId];
      }

      const res = await fetch(
        `https://api.convertkit.com/v3/forms/${KIT_FORM_ID}/subscribe`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) throw new Error('Subscription failed');

      // Redirect to the resource — only allow https:// or same-origin paths
      // to prevent javascript:/data:/protocol-relative redirect abuse via Sanity content
      const url = magnet.resourceUrl || '';
      const isSafeUrl = /^https:\/\//i.test(url) || /^\//.test(url);
      if (!isSafeUrl) {
        throw new Error('Invalid resource URL');
      }
      window.location.href = url;
    } catch {
      setError('Something went wrong. Try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <Seo title="Not Found | RSL/A" description="This resource could not be found." noIndex />
        <h1 className="font-sans font-bold text-3xl md:text-5xl text-text mb-4">Resource not found</h1>
        <p className="font-sans text-textMuted mb-6">This link may have expired or been removed.</p>
        <Link to="/" className="font-sans font-bold text-sm text-accent hover:underline">
          Back to home
        </Link>
      </main>
    );
  }

  const pageTitle = magnet.seoTitle || `${magnet.title} | RSL/A`;
  const pageDescription = magnet.seoDescription || magnet.description;

  return (
    <main className="min-h-screen bg-surface relative overflow-hidden flex items-center justify-center px-6 py-24">
      <Seo
        title={pageTitle}
        description={pageDescription}
        noIndex
      />

      <FlickeringGrid
        className="absolute inset-0 z-0"
        squareSize={4}
        gridGap={6}
        color="rgb(0, 112, 243)"
        maxOpacity={0.06}
        flickerChance={0.1}
      />

      <div className="relative z-10 max-w-lg w-full text-center">
        {/* Title */}
        <h1 className="font-sans font-bold text-3xl md:text-5xl tracking-tight mb-4 leading-[1.1] text-text">
          {magnet.title}
        </h1>

        {/* Description */}
        <p className="font-sans text-textMuted text-lg mb-8 max-w-md mx-auto">
          {magnet.description}
        </p>

        {/* Benefits */}
        {magnet.benefits?.length > 0 && (
          <div className="text-left max-w-sm mx-auto mb-10 space-y-3">
            {magnet.benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                <p className="font-sans text-sm text-textMuted">{benefit}</p>
              </div>
            ))}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md mx-auto mb-4">
          <input
            type="text"
            required
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={submitting}
            className="w-full px-5 py-3 rounded-xl bg-surfaceAlt border border-accent-border text-text font-sans text-base placeholder:text-textMuted focus:outline-none focus:border-accent/50 transition-colors"
          />
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
            className="w-full px-5 py-3 rounded-xl bg-surfaceAlt border border-accent-border text-text font-sans text-base placeholder:text-textMuted focus:outline-none focus:border-accent/50 transition-colors"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-accent text-white px-6 py-3 font-sans font-bold text-base hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Sending...' : magnet.ctaButtonText || 'Get instant access'}
          </button>
        </form>

        {error && (
          <p className="font-sans text-sm text-coral mb-2">{error}</p>
        )}

        {/* Trust line */}
        <p className="font-sans text-sm text-textMuted">
          No spam, unsubscribe anytime.{' '}
          <Link to="/privacy-policy" className="underline underline-offset-2 hover:text-textMuted transition-colors">
            Privacy Policy
          </Link>
        </p>
      </div>
    </main>
  );
}
