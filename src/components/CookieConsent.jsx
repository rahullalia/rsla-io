import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const CONSENT_KEY = 'rsla_cookie_consent';

function loadGTM() {
    if (window._gtmLoaded) return;
    window._gtmLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-MVJQSMF8';
    document.head.appendChild(script);
}

export function initConsent() {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === 'accepted') {
        loadGTM();
    }
}

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(CONSENT_KEY);
        if (!consent) {
            const timer = setTimeout(() => setVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const dismiss = () => {
        setExiting(true);
        setTimeout(() => setVisible(false), 300);
    };

    const accept = () => {
        localStorage.setItem(CONSENT_KEY, 'accepted');
        loadGTM();
        dismiss();
    };

    const decline = () => {
        localStorage.setItem(CONSENT_KEY, 'declined');
        dismiss();
    };

    if (!visible) return null;

    return (
        <div
            className={`fixed bottom-0 inset-x-0 z-[9999] p-4 md:p-6 transition-all duration-300 ease-out ${
                exiting ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
            }`}
            role="dialog"
            aria-label="Cookie consent"
        >
            {/* Mobile: stacked card */}
            <div className="md:hidden max-w-sm mx-auto bg-white/95 backdrop-blur-xl border border-accent-border rounded-2xl shadow-[0_-4px_30px_rgba(0,0,0,0.08)] p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <p className="font-body text-xs text-textMuted leading-relaxed">
                        We use cookies to improve your experience.{' '}
                        <Link to="/privacy-policy" className="text-accent hover:underline">Privacy Policy</Link>
                    </p>
                    <button
                        onClick={decline}
                        className="shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2 -mt-2 text-textLight hover:text-text transition-colors"
                        aria-label="Dismiss"
                    >
                        <X size={16} />
                    </button>
                </div>
                <div className="flex items-center gap-2.5">
                    <button
                        onClick={accept}
                        className="flex-1 min-h-[44px] bg-accent text-white text-xs font-sans font-bold rounded-full hover:bg-accent/90 active:scale-95 transition-all"
                    >
                        Accept All
                    </button>
                    <button
                        onClick={decline}
                        className="flex-1 min-h-[44px] bg-surfaceAlt text-textMuted text-xs font-sans font-bold rounded-full border border-accent-border hover:text-text active:scale-95 transition-all"
                    >
                        Only Necessary
                    </button>
                </div>
            </div>

            {/* Desktop: sleek inline bar */}
            <div className="hidden md:block max-w-4xl mx-auto">
                <div className="bg-white/95 backdrop-blur-xl border border-accent-border rounded-full shadow-[0_-4px_30px_rgba(0,0,0,0.06)] px-8 py-3.5 flex items-center gap-6">
                    <p className="font-body text-[13px] text-textMuted leading-snug flex-1">
                        We use cookies to analyze site usage and improve your experience.{' '}
                        <Link to="/privacy-policy" className="text-accent hover:underline">Privacy Policy</Link>
                    </p>
                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            onClick={decline}
                            className="px-5 py-2 text-[13px] font-sans font-bold text-textMuted hover:text-text rounded-full border border-accent-border hover:border-accent/20 transition-all"
                        >
                            Only Necessary
                        </button>
                        <button
                            onClick={accept}
                            className="px-5 py-2 bg-accent text-white text-[13px] font-sans font-bold rounded-full hover:bg-accent/90 transition-colors"
                        >
                            Accept All
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
