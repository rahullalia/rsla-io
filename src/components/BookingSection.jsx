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
        <section id="contact" className="py-24 md:py-32 bg-surface px-4 md:px-6">
            <div className="max-w-4xl mx-auto bg-surfaceAlt border border-accent-border rounded-[1.5rem] md:rounded-[3rem] px-3 py-8 md:p-16 text-center shadow-sm relative overflow-hidden">

                <div className="relative z-10">
                    <span className="font-mono text-xs uppercase tracking-wider text-accent">Book a Call</span>
                    <h2 className="font-sans font-bold text-3xl md:text-5xl tracking-tight mb-3 md:mb-4 mt-3 text-text">
                        Let's <span className="font-drama italic font-bold text-accent">talk.</span>
                    </h2>
                    <p className="font-body text-textMuted mb-8 md:mb-10 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
                        Book a free call. We'll look at your business, find the manual work that AI should be handling, and show you exactly what the system looks like. No pitch deck. Just a screen share and honest answers.
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
