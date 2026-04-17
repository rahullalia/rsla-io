import { useParams, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';

const services = {
    websites: {
        title: 'Websites',
        headline: 'Custom websites that convert.',
        description: 'New builds and full rebuilds. Fast, custom-designed, SEO-ready. Launches that ship in weeks, not quarters.',
    },
    'search-visibility': {
        title: 'Search Visibility',
        headline: 'Show up where buyers look.',
        description: 'Rankings on Google, ChatGPT, Perplexity, and Claude. One system that shows up everywhere buyers look.',
    },
    'ai-automations': {
        title: 'AI Automations',
        headline: 'Replace manual work with AI.',
        description: 'n8n, Make, and custom scripts that replace manual work. Leads qualified and tasks routed while you sleep.',
    },
    'crm-systems': {
        title: 'CRM Systems',
        headline: 'One dashboard for everything.',
        description: 'GoHighLevel pipelines, workflows, and integrations. One dashboard for leads, deals, and bookings.',
    },
    'custom-development': {
        title: 'Custom Development',
        headline: 'When off-the-shelf is not enough.',
        description: 'SaaS products, MVPs, internal tools, APIs. Built from scratch, owned by you.',
    },
};

export default function ServiceDetail() {
    const { slug } = useParams();
    const service = services[slug];

    if (!service) {
        return (
            <main className="min-h-screen bg-surface text-text pt-32 pb-24 px-6 md:px-12 flex flex-col items-center justify-center">
                <h1 className="text-3xl md:text-5xl font-sans font-bold mb-4">Service not found</h1>
                <Link to="/services" className="text-accent hover:text-accent/80 font-sans font-semibold">Back to Services</Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-surface text-text pt-32 pb-24 px-6 md:px-12">
            <Seo
                title={`${service.title} | RSL/A`}
                description={service.description}
                canonical={`https://rsla.io/services/${slug}`}
            />
            <div className="max-w-4xl mx-auto">
                <Link
                    to="/services"
                    className="inline-flex items-center gap-2 font-sans text-sm text-textMuted hover:text-accent transition-colors mb-12"
                >
                    Back to Services
                </Link>

                <h1 className="font-sans font-bold text-3xl md:text-5xl tracking-tight leading-[1.1] text-text mb-6">
                    {service.headline}
                </h1>
                <p className="font-sans text-lg text-textMuted leading-relaxed max-w-2xl mb-12">
                    {service.description}
                </p>

                <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3 font-sans font-bold text-base text-white shadow-sm transition-colors hover:bg-accent/90"
                >
                    Let's Talk
                    <ArrowRight size={16} strokeWidth={2} className="opacity-60" />
                </Link>
            </div>
        </main>
    );
}
