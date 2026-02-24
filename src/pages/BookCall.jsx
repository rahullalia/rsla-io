import { useEffect } from 'react';
import Seo from '../components/Seo';

export default function BookCall() {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://link.msgsndr.com/js/form_embed.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <main className="min-h-screen bg-primary text-dark relative overflow-hidden pt-32 pb-24 px-6 md:px-12">
            <Seo
                title="Book a Call | RSL/A"
                description="Schedule an onboarding or support call with RSL/A."
                canonical="https://rsla.io/book-a-call"
                noIndex
            />
            <div className="max-w-4xl mx-auto bg-dark border border-white/10 text-white rounded-[3rem] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden group">

                {/* Background blur blobs */}
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-accent rounded-full mix-blend-screen filter blur-[100px] opacity-30 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none" />
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-cyan rounded-full mix-blend-screen filter blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" />

                <div className="relative z-10">
                    <h1 className="text-3xl md:text-5xl font-sans font-bold mb-4 tracking-tight">
                        Establish <span className="font-drama italic font-normal">Connection.</span>
                    </h1>
                    <p className="font-body text-white/60 mb-10 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
                        Select a block to deploy the onboarding sequence.
                    </p>

                    <div className="rounded-2xl">
                        <iframe
                            src="https://api.leadconnectorhq.com/widget/booking/GHDT7fcZ1a6Yj4t3FCx7"
                            style={{ width: '100%', border: 'none', overflow: 'hidden' }}
                            scrolling="no"
                            id="client-booking-calendar"
                            title="Client Booking Calendar"
                            className="rounded-xl h-[750px] md:h-[1100px]"
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
