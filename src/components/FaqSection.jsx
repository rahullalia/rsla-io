import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        q: 'What types of businesses do you work with?',
        a: 'We work with service-based businesses, local operators, and B2B companies doing $500K+ in revenue who want to systematize their marketing and operations. If you rely on leads, appointments, or repeat customers to grow, we can help.',
    },
    {
        q: 'How long does it take to see results?',
        a: "Most clients see measurable results within 30 to 60 days. Ad campaigns typically start generating leads within the first week. Automation systems go live in 2 to 3 weeks. Full CRM and operations buildouts take 4 to 6 weeks depending on complexity.",
    },
    {
        q: 'Do you lock clients into long-term contracts?',
        a: "No. We work on a month-to-month basis after the initial setup period. We believe in earning your business every month. If we're not delivering, you shouldn't be stuck.",
    },
    {
        q: 'What platforms do you use?',
        a: 'We primarily use GoHighLevel for CRM and automation, Meta and Google for paid ads, and custom AI tools built on OpenAI, Make, and Zapier. We pick the right tool for the job, not the one that pays us the most.',
    },
    {
        q: 'How is RSL/A different from other marketing agencies?',
        a: "We don't just run ads. We build the entire system: lead generation, automated follow-up, CRM, booking, and reporting. Most agencies hand you leads and call it a day. We make sure those leads turn into revenue.",
    },
    {
        q: 'Do you offer white-label services for other agencies?',
        a: 'Yes. We partner with agencies who need AI automation, CRM buildouts, or technical infrastructure they cannot build in-house. Reach out and we can discuss your setup.',
    },
    {
        q: 'What does the onboarding process look like?',
        a: "It starts with a strategy call where we audit your current setup. Then we deliver a custom roadmap within 48 hours. Once approved, we start building. Most clients are fully live within 2 to 4 weeks.",
    },
];

export default function FaqSection() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (i) => {
        setOpenIndex(openIndex === i ? null : i);
    };

    return (
        <section className="py-20 md:py-32 bg-surfaceAlt px-6 md:px-12">
            <div className="max-w-3xl mx-auto">
                <div className="mb-12 text-center">
                    <span className="font-sans text-sm uppercase tracking-wider text-accent">FAQ</span>
                    <h2 className="font-sans font-extrabold text-2xl md:text-4xl tracking-tight mt-3 text-text">
                        Common questions
                    </h2>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="bg-surface border border-accent-border rounded-2xl overflow-hidden transition-shadow hover:shadow-sm"
                        >
                            <button
                                onClick={() => toggle(i)}
                                className="w-full flex items-center justify-between gap-4 px-6 py-5 min-h-[44px] text-left cursor-pointer transition-transform duration-sm ease-out-smooth active:scale-[0.995]"
                            >
                                <span className="font-sans font-bold text-text text-base pr-4">
                                    {faq.q}
                                </span>
                                <ChevronDown
                                    size={18}
                                    className={`shrink-0 text-textMuted transition-transform duration-md ease-out-smooth ${
                                        openIndex === i ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>
                            <div
                                className={`grid transition-[grid-template-rows,opacity] duration-lg ease-out-smooth ${
                                    openIndex === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                }`}
                            >
                                <div className="overflow-hidden">
                                    <p className="px-6 pb-5 font-sans text-sm text-textMuted leading-relaxed">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
