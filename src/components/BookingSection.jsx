import { useEffect } from 'react';

export default function BookingSection() {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://link.msgsndr.com/js/form_embed.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <section id="contact" className="py-24 md:py-32 bg-primary px-4 md:px-6">
            <div className="max-w-4xl mx-auto bg-dark border border-white/10 text-white rounded-[1.5rem] md:rounded-[3rem] px-3 py-8 md:p-16 text-center shadow-2xl relative overflow-hidden group">

                {/* Background blur blobs */}
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-accent rounded-full mix-blend-screen filter blur-[100px] opacity-30 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none" />
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-cyan rounded-full mix-blend-screen filter blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" />

                <div className="relative z-10">
                    <h2 className="font-sans font-bold text-2xl md:text-5xl tracking-tight mb-3 md:mb-4">
                        Ready to put AI to <span className="font-drama italic font-normal">work?</span>
                    </h2>
                    <p className="font-body text-white/60 mb-8 md:mb-10 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
                        Book a free call. We will look at your business, find the manual work that AI should be handling, and show you exactly what the system looks like. No pitch deck. Just a screen share and honest answers.
                    </p>

                    <div className="rounded-2xl -mx-1 md:mx-0" style={{ transform: 'translateZ(0)', WebkitTransform: 'translateZ(0)' }}>
                        <iframe
                            src="https://api.leadconnectorhq.com/widget/booking/nKrQmOaliDo1haSUwgRS"
                            style={{ width: '100%', border: 'none', overflow: 'hidden', willChange: 'transform', transform: 'translateZ(0)', WebkitOverflowScrolling: 'touch' }}
                            scrolling="no"
                            id="TVqOue0iVFx2OyOlu3bS_1771896840614"
                            title="Book a Call"
                            className="rounded-xl h-[650px] md:h-[750px]"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
