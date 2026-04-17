import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';

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
            const timer = setTimeout(() => setVisible(true), 2000);
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
            className={`fixed bottom-6 left-6 right-6 md:left-6 md:right-auto z-[9999] transition-all duration-300 ease-out ${
                exiting ? 'translate-y-8 opacity-0' : 'translate-y-0 opacity-100'
            }`}
            role="dialog"
            aria-label="Cookie consent"
        >
            <div className="bg-white border border-accent-border rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-5 md:p-6 max-w-sm">
                <div className="flex items-start gap-3 mb-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 mt-0.5">
                        <Cookie size={16} className="text-accent" />
                    </div>
                    <div>
                        <p className="font-sans font-semibold text-sm text-text mb-1">
                            We value your experience
                        </p>
                        <p className="font-sans text-sm text-textMuted leading-relaxed">
                            Cookies help us tailor the site to what you actually need. We only use analytics to improve your experience. No ad tracking, no data sales. Ever.{' '}
                            <Link to="/privacy-policy" className="text-accent hover:underline">Privacy Policy</Link>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 ml-11">
                    <button
                        onClick={accept}
                        className="px-6 py-2.5 bg-accent text-white font-sans font-bold text-sm rounded-xl hover:bg-accent/90 transition-colors shadow-sm"
                    >
                        Got it, accept all
                    </button>
                    <button
                        onClick={decline}
                        className="px-4 py-2.5 font-sans text-sm text-textLight hover:text-textMuted transition-colors"
                    >
                        Decline
                    </button>
                </div>
            </div>
        </div>
    );
}
