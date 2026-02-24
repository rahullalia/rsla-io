import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import { client } from '../sanity/lib/client';
import { caseStudyBySlugQuery, caseStudyBySlugV2Query, relatedCaseStudiesQuery } from '../sanity/lib/queries';
import { urlForImage } from '../sanity/lib/image';
import { PortableTextComponents } from '../components/blog/PortableTextRenderer';
import Seo from '../components/Seo';

// Local CaseStudyCard component (migrated structure)
const CaseStudyCard = ({ slug, tag, title, description, metrics }) => (
    <Link
        to={`/work/${slug}`}
        className="group flex flex-col h-full bg-primary rounded-[2rem] border border-dark/5 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
    >
        <div className="p-8 flex flex-col flex-grow">
            <div className="mb-6 flex justify-between items-start">
                <span className="font-mono text-[10px] uppercase tracking-wider text-accent border border-accent/20 bg-accent/5 px-2 py-1 rounded-sm">
                    {tag}
                </span>
            </div>
            <h3 className="font-sans font-bold text-2xl tracking-tight mb-3 group-hover:text-accent transition-colors">
                {title}
            </h3>
            <p className="font-mono text-sm text-dark/60 mb-8 flex-grow leading-relaxed">
                {description}
            </p>
            {metrics && metrics.length > 0 && (
                <div className="mt-auto grid grid-cols-2 gap-4 pt-6 border-t border-dark/5">
                    {metrics.slice(0, 2).map((metric, idx) => (
                        <div key={idx}>
                            <strong className="block text-xl font-bold font-sans text-dark">{metric.value}</strong>
                            <span className="font-mono text-[10px] uppercase tracking-wider text-accent">{metric.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </Link>
);

const INDUSTRY_LABELS = {
    'salon-spa': 'Salon/Spa',
    'restaurant': 'Restaurant',
    'auto-detailing': 'Auto Detailing',
    'real-estate': 'Real Estate',
    'contractor': 'Contractor/Home Services',
    'medical': 'Medical/Dental',
    'legal': 'Legal',
    'fitness': 'Fitness/Gym',
    'ecommerce': 'E-commerce',
    'saas': 'SaaS',
    'agency': 'Agency',
    'nonprofit': 'Non-Profit',
    'media': 'Media/Content',
    'manufacturing': 'Manufacturing',
    'professional-services': 'Professional Services',
    'education': 'Education',
};

const SERVICE_LABELS = {
    'ai-automation': 'AI Automation',
    'paid-acquisition': 'Paid Acquisition',
    'crm-infrastructure': 'CRM Infrastructure',
    'smart-websites': 'Smart Websites',
    'local-seo': 'Local SEO',
    'content-marketing': 'Content Marketing',
    'ai-lead-generation': 'AI Lead Generation',
    'ai-automations': 'AI Automations',
    'ai-operations': 'AI Operations',
    'ai-digital-presence': 'AI Digital Presence',
};

export default function WorkInner() {
    const { slug } = useParams();
    const [caseStudy, setCaseStudy] = useState(null);
    const [relatedCases, setRelatedCases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            setLoading(true);
            try {
                // Try V2 first, fall back to V1
                let fetchedStudy = await client.fetch(caseStudyBySlugV2Query, { slug });
                if (!fetchedStudy) {
                    fetchedStudy = await client.fetch(caseStudyBySlugQuery, { slug });
                }

                if (!fetchedStudy) {
                    if (isMounted) {
                        setCaseStudy(null);
                        setLoading(false);
                    }
                    return;
                }

                if (isMounted) setCaseStudy(fetchedStudy);

                // Replicate Next.js related cases fallback logic
                let cases = fetchedStudy.relatedCases;
                if (!cases || cases.length === 0) {
                    cases = await client.fetch(relatedCaseStudiesQuery, {
                        slug,
                        category: fetchedStudy.category,
                    });
                }

                if (isMounted) setRelatedCases(cases || []);

            } catch (error) {
                console.error("Error fetching case study:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();
        window.scrollTo(0, 0);

        return () => { isMounted = false; };
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background pt-32 pb-24 flex items-center justify-center">
                <div className="font-mono text-accent animate-pulse">[FETCHING_CASE_STUDY...]</div>
            </div>
        );
    }

    if (!caseStudy) {
        return (
            <div className="min-h-screen bg-background pt-32 pb-24 flex flex-col items-center justify-center">
                <h1 className="text-4xl font-sans font-bold text-dark mb-4">404 - Case Study Not Found</h1>
                <Link to="/work" className="text-accent hover:underline font-mono">← Return to Work</Link>
            </div>
        );
    }

    // Process NumberCounter equivalents for formatting statically for now
    const formatMetric = (value) => {
        return <>{value}</>; // Simplified metric render inherited from Next.js styling
    };

    return (
        <article className="min-h-screen bg-background text-dark pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
            <Seo
                title={`${caseStudy.title} | RSL/A`}
                description={caseStudy.tldr || caseStudy.description || ''}
                canonical={`https://rsla.io/work/${slug}`}
                ogImage="https://rsla.io/og-image.png"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'Article',
                    headline: caseStudy.title,
                    description: caseStudy.tldr || caseStudy.description || '',
                    datePublished: caseStudy.publishedAt || undefined,
                    author: {
                        '@type': 'Person',
                        name: 'Rahul Lalia',
                    },
                    publisher: {
                        '@type': 'Organization',
                        name: 'RSL/A',
                        logo: { '@type': 'ImageObject', url: 'https://rsla.io/images/logo/lockup-nobg.webp' },
                    },
                    mainEntityOfPage: `https://rsla.io/work/${slug}`,
                }}
            />
            <div className="max-w-4xl mx-auto relative z-10">

                {/* Header Breadcrumb & Back */}
                <div className="mb-12 flex flex-col items-start gap-4">
                    <Link to="/work" className="inline-flex items-center gap-2 text-dark/50 hover:text-accent font-mono text-sm transition-colors uppercase tracking-wider">
                        ← Back to Case Studies
                    </Link>
                </div>

                {/* Article Header */}
                <header className="mb-16">
                    <div className="mb-6 flex gap-3">
                        <span className="font-mono text-xs uppercase tracking-wider text-accent border border-accent/20 bg-accent/5 px-3 py-1 rounded-full">
                            {caseStudy.tag}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-sans font-bold leading-tight tracking-tight text-dark mb-6">
                        {caseStudy.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-dark/60 font-drama italic mb-12">
                        {caseStudy.description}
                    </p>

                    {/* Metrics Impact Highlights */}
                    {caseStudy.metrics && caseStudy.metrics.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-y border-dark/10 mb-12 bg-dark/5 px-8 rounded-3xl">
                            {caseStudy.metrics.map((metric, idx) => (
                                <div key={idx} className="flex flex-col">
                                    <strong className="text-4xl md:text-5xl font-sans font-bold text-accent mb-2">
                                        {formatMetric(metric.value)}
                                    </strong>
                                    <span className="font-mono text-[10px] text-dark/70 uppercase tracking-widest leading-tight">
                                        {metric.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Meta Tags / Badges */}
                    {(caseStudy.servicesUsed?.length > 0 || caseStudy.timeframe || caseStudy.industry) && (
                        <div className="flex flex-wrap gap-2 mb-12">
                            {caseStudy.industry && (
                                <span className="px-3 py-1 rounded-full text-xs font-mono tracking-widest uppercase bg-dark/5 border border-dark/10 text-dark/60">
                                    IND: {INDUSTRY_LABELS[caseStudy.industry] || caseStudy.industry}
                                </span>
                            )}
                            {caseStudy.timeframe && (
                                <span className="px-3 py-1 rounded-full text-xs font-mono tracking-widest uppercase bg-dark/5 border border-dark/10 text-dark/60">
                                    DUR: {caseStudy.timeframe} Days
                                </span>
                            )}
                            {caseStudy.servicesUsed?.map((service) => (
                                <span key={service} className="px-3 py-1 rounded-full text-xs font-mono tracking-widest uppercase bg-dark/5 border border-dark/10 text-dark/60">
                                    SVC: {SERVICE_LABELS[service] || service}
                                </span>
                            ))}
                        </div>
                    )}
                </header>

                {/* Featured Image (V2) */}
                {caseStudy.featuredImage?.asset && (
                    <div className="w-full aspect-video rounded-[2rem] overflow-hidden mb-16 shadow-lg border border-dark/5">
                        <img
                            src={urlForImage(caseStudy.featuredImage.asset)?.width(1600).height(900).url()}
                            alt={caseStudy.featuredImage?.alt || caseStudy.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* TL;DR Box */}
                {caseStudy.tldr && (
                    <div className="bg-accent/10 border border-accent/20 rounded-[2rem] p-8 mb-12 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_100%_0%,rgba(0,112,243,0.3),transparent_70%)] opacity-50 transition-opacity duration-500 group-hover:opacity-100 mix-blend-multiply" />
                        <h2 className="text-xs font-bold font-mono text-accent uppercase tracking-widest mb-4">
                            Executive TL;DR
                        </h2>
                        <p className="text-xl text-dark/80 leading-relaxed font-sans font-medium">
                            {caseStudy.tldr}
                        </p>
                    </div>
                )}

                {/* Before / After Snapshot (V2) */}
                {caseStudy.beforeAfter && (caseStudy.beforeAfter.before || caseStudy.beforeAfter.after) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        {caseStudy.beforeAfter.before && (
                            <div className="p-8 rounded-[2rem] border border-red-200 bg-red-50/50">
                                <h3 className="text-xs font-bold font-mono text-red-500 uppercase tracking-widest mb-4">Before</h3>
                                <p className="text-lg text-dark/80 leading-relaxed font-sans">{caseStudy.beforeAfter.before}</p>
                            </div>
                        )}
                        {caseStudy.beforeAfter.after && (
                            <div className="p-8 rounded-[2rem] border border-green-200 bg-green-50/50">
                                <h3 className="text-xs font-bold font-mono text-green-600 uppercase tracking-widest mb-4">After</h3>
                                <p className="text-lg text-dark/80 leading-relaxed font-sans">{caseStudy.beforeAfter.after}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Key Takeaways */}
                {caseStudy.keyTakeaways && caseStudy.keyTakeaways.length > 0 && (
                    <div className="bg-dark/5 border border-dark/10 rounded-[2rem] p-8 mb-16">
                        <h2 className="text-xl font-sans font-bold text-dark mb-6 flex items-center gap-3">
                            <span className="text-2xl">🎯</span> Strategy Shifts
                        </h2>
                        <ul className="space-y-4">
                            {caseStudy.keyTakeaways.map((takeaway, idx) => (
                                <li key={idx} className="flex items-start gap-4 text-dark/80 text-lg">
                                    <span className="text-accent font-bold font-mono text-xl leading-none pt-1">0{idx + 1}.</span>
                                    <span>{takeaway}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Body Content */}
                <div className="prose-container max-w-none pb-20 border-b border-dark/10">
                    {caseStudy.content ? (
                        <PortableText value={caseStudy.content} components={PortableTextComponents} />
                    ) : (
                        <p className="text-dark/40 font-mono italic p-10 bg-dark/5 text-center rounded-[2rem] mt-10">
                            [Content formatting required in CMS]
                        </p>
                    )}
                </div>

                {/* Related Cases Section */}
                {relatedCases.length > 0 && (
                    <aside className="mt-20">
                        <h3 className="text-3xl font-sans font-bold text-dark mb-10 text-center">
                            Similar Profiles
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {relatedCases.slice(0, 2).map((related) => (
                                <CaseStudyCard
                                    key={related.slug}
                                    slug={related.slug}
                                    tag={related.tag}
                                    title={related.title}
                                    description={related.description}
                                    metrics={related.metrics || []}
                                />
                            ))}
                        </div>
                    </aside>
                )}

            </div>
        </article>
    );
}
