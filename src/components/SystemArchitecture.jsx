import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const layers = [
    {
        id: 'layer-1',
        title: 'Smart Infrastructure',
        desc: 'The foundation. Secure, scalable hosting with high-availability CDNs and headless architectures.',
        color: 'rgba(0, 112, 243, 0.05)', // Anchor Blue
        borderColor: 'rgba(0, 112, 243, 0.3)',
    },
    {
        id: 'layer-2',
        title: 'AI Automation',
        desc: 'The brain. Custom LLM integrations, automated CRM pipelines, and intelligent workflows.',
        color: 'rgba(158, 122, 255, 0.05)', // Purple
        borderColor: 'rgba(158, 122, 255, 0.3)',
    },
    {
        id: 'layer-3',
        title: 'Paid Acquisition',
        desc: 'The growth engine. Laser-targeted campaigns driven by real-time analytics and machine learning.',
        color: 'rgba(0, 194, 255, 0.05)', // Cyan
        borderColor: 'rgba(0, 194, 255, 0.3)',
    }
];

export default function SystemArchitecture() {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: '+=200%',
                    pin: true,
                    scrub: 1,
                }
            });

            // Initial state: Base layer is semi-transparent and slightly lowered.
            gsap.set('.arch-layer-1', { y: 50, opacity: 0 });
            gsap.set('.arch-layer-2', { y: -150, opacity: 0 });
            gsap.set('.arch-layer-3', { y: -300, opacity: 0 });

            // Animate layers coming into place
            tl.to('.arch-layer-1', { y: 0, opacity: 1, duration: 1 })
                .to('.arch-layer-2', { y: -60, opacity: 1, duration: 1 }, "-=0.2")
                .to('.arch-layer-3', { y: -120, opacity: 1, duration: 1 }, "-=0.2")
                .to({}, { duration: 0.5 }); // Pause at the end for reading

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="w-full h-screen bg-sand overflow-hidden relative flex flex-col md:flex-row items-center justify-center">

            {/* Left side text */}
            <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-24 z-10 text-center md:text-left pt-32 md:pt-0">
                <span className="font-mono text-accent text-xs uppercase tracking-widest font-bold">The Architecture</span>
                <h2 className="font-sans font-bold text-3xl md:text-5xl lg:text-6xl text-text tracking-tight mt-4 mb-6">
                    Constructing the <span className="font-drama italic font-bold text-accent">System.</span>
                </h2>
                <p className="font-body text-textMuted text-base md:text-lg max-w-lg mx-auto md:mx-0">
                    A multi-layered ecosystem designed for uncompromising scale, speed, and automation. Assembled layer by layer as you scroll.
                </p>
            </div>

            {/* Right side 3D stack */}
            <div className="w-full md:w-1/2 h-[50vh] md:h-full flex items-center justify-center relative pb-16 md:pb-0" style={{ perspective: '1000px' }}>
                <div
                    className="relative w-64 md:w-80 lg:w-96 h-64 md:h-80 lg:h-96"
                    style={{ transform: 'rotateX(50deg)', transformStyle: 'preserve-3d' }}
                >
                    {layers.map((layer, index) => (
                        <div
                            key={layer.id}
                            className={`arch-layer-${index + 1} absolute inset-0 rounded-2xl border backdrop-blur-xl shadow-2xl p-6 md:p-8 flex flex-col justify-end transition-shadow duration-300 pointer-events-none`}
                            style={{
                                backgroundColor: layer.color,
                                borderColor: layer.borderColor,
                                zIndex: index
                            }}
                        >
                            <h3 className="font-sans font-bold text-xl md:text-2xl text-text mb-2 drop-shadow-sm">{layer.title}</h3>
                            <p className="font-body text-textMuted text-xs md:text-sm drop-shadow-sm">{layer.desc}</p>

                            {/* Glass reflection highlight */}
                            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-2xl pointer-events-none" />
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
}
