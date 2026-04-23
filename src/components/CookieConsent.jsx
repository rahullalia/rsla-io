import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';

const CONSENT_KEY = 'rsla_cookie_consent';

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
        dismiss();
    };

    const decline = () => {
        localStorage.setItem(CONSENT_KEY, 'declined');
        dismiss();
    };

    if (!visible) return null;

    return (
        <div
            className={`fixed bottom-6 left-6 right-6 md:left-6 md:right-auto z-[9999] transition-[transform,opacity] duration-md ease-out-smooth ${
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
                            This website uses cookies
                        </p>
                        <p className="font-sans text-sm text-textMuted leading-relaxed">
                            We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, personalize content, and serve targeted advertisements. By clicking &apos;Accept,&apos; you consent to our use of cookies. For more information, see our{' '}
                            <Link to="/privacy-policy" className="text-accent hover:underline">Privacy Policy</Link>.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 ml-11">
                    <button
                        onClick={accept}
                        className="px-6 py-2.5 bg-accent text-white font-sans font-bold text-sm rounded-xl hover:bg-accent/90 transition-colors shadow-sm"
                    >
                        Accept
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
