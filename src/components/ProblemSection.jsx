import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ProblemSection() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.problem-anim',
                { y: 40, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%',
                        once: true,
                    }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="w-full bg-dark pt-24 md:pt-32 pb-12 md:pb-16">
            <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
                <h2 className="problem-anim font-sans font-bold text-3xl md:text-5xl text-primary tracking-tight mb-8">
                    You are the bottleneck. AI fixes that.
                </h2>
                <div className="problem-anim space-y-6 font-body text-white/60 text-base md:text-lg leading-relaxed">
                    <p>
                        Most founders are stuck doing work that should not require them. Replying to leads at midnight. Copy-pasting between three different tools. Following up when they remember to. Wondering why their ads keep burning cash with nothing to show for it.
                    </p>
                    <p>
                        Here is the thing. You are not bad at this. You are just doing work that AI should be handling.
                    </p>
                    <p>
                        We build AI infrastructure that runs the repetitive parts of your business. Leads come in, AI qualifies them, the right follow-up fires, and a meeting gets booked. You do not touch a thing.
                    </p>
                    <p className="text-white/80 font-sans font-bold text-lg md:text-xl">
                        Here is exactly what that looks like.
                    </p>
                </div>
            </div>
        </section>
    );
}
