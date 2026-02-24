import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function BookingConfirmed() {
    return (
        <main className="min-h-screen bg-dark text-white relative overflow-hidden flex items-center justify-center px-6">
            <Seo
                title="Booking Confirmed | RSL/A"
                description="Your call has been booked. Check your inbox for meeting details."
                noIndex
            />
            {/* Subtle gradient bg */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-cyan/5 pointer-events-none" />

            <div className="relative z-10 text-center max-w-xl">
                {/* Checkmark */}
                <div className="w-16 h-16 mx-auto mb-8 rounded-full border-2 border-emerald-400/40 flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>

                <h1 className="font-sans font-bold text-4xl md:text-5xl tracking-tight mb-4">
                    You're all set.
                </h1>

                <p className="font-body text-lg md:text-xl text-white/70 mb-3">
                    Your call has been booked.
                </p>

                <p className="font-body text-sm md:text-base text-white/40 mb-12">
                    Check your inbox for a calendar invite with the meeting details.
                </p>

                <Link
                    to="/"
                    className="inline-block px-6 py-3 rounded-full bg-accent text-white font-sans font-bold text-sm hover:scale-[1.03] active:scale-95 transition-transform duration-300"
                >
                    Back to Home
                </Link>
            </div>
        </main>
    );
}
