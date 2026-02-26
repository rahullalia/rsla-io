import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import { client } from '../sanity/lib/client';
import { caseStudyBySlugQuery, caseStudyBySlugV2Query, relatedCaseStudiesQuery } from '../sanity/lib/queries';
import { urlForImage } from '../sanity/lib/image';
import { PortableTextComponents } from '../components/blog/PortableTextRenderer';
import Seo from '../components/Seo';

// Local CaseStudyCard component
const CaseStudyCard = ({ slug, tag, title, description, metrics }) => (
    <Link
        to={`/work/${slug}`}
        className="group flex flex-col h-full bg-surfaceAlt rounded-[2rem] border border-accent-border overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
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
            <p className="font-mono text-sm text-textMuted mb-8 flex-grow leading-relaxed">
                {description}
            </p>
            {metrics && metrics.length > 0 && (
                <div className="mt-auto grid grid-cols-2 gap-4 pt-6 border-t border-accent-border">
                    {metrics.slice(0, 2).map((metric, idx) => (
                        <div key={idx}>
                            <strong className="block text-xl font-bold font-sans text-text">{metric.value}</strong>
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
            <div className="min-h-screen bg-surface pt-32 pb-24 flex items-center justify-center">
                <div className="font-mono text-accent animate-pulse">[FETCHING_CASE_STUDY...]</div>
            </div>
        );
    }

    if (!caseStudy) {
        return (
            <div className="min-h-screen bg-surface pt-32 pb-24 flex flex-col items-center justify-center">
                <h1 className="text-4xl font-sans font-bold text-text mb-4">404 - Case Study Not Found</h1>
                <Link to="/work" className="text-accent hover:underline font-mono">Back to Case Studies</Link>
            </div>
        );
    }

    // Build meta items inline
    const metaItems = [];
    if (caseStudy.industry) metaItems.push(INDUSTRY_LABELS[caseStudy.industry] || caseStudy.industry);
    if (caseStudy.timeframe) metaItems.push(`${caseStudy.timeframe} days`);
    if (caseStudy.servicesUsed?.length > 0) {
        caseStudy.servicesUsed.forEach(s => metaItems.push(SERVICE_LABELS[s] || s));
    }

    return (
        <article className="min-h-screen bg-surface text-text pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
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
            <div className="max-w-3xl mx-auto relative z-10">

                {/* Back link */}
                <Link to="/work" className="inline-flex items-center gap-2 min-h-[44px] text-textLight hover:text-accent font-mono text-sm transition-colors uppercase tracking-wider mb-12">
                    Back to Case Studies
                </Link>

                {/* Header */}
                <header className="mb-16">
                    {/* Tag + meta inline */}
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="font-mono text-xs uppercase tracking-wider text-accent border border-accent/20 bg-accent/5 px-3 py-1 rounded-full">
                            {caseStudy.tag}
                        </span>
                        {metaItems.length > 0 && (
                            <span className="font-mono text-xs text-textLight">
                                {metaItems.join(' / ')}
                            </span>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-6xl font-sans font-bold leading-tight tracking-tight text-text mb-6">
                        {caseStudy.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-textMuted font-quote italic">
                        {caseStudy.description}
                    </p>
                </header>

                {/* Featured Image (V2) */}
                {caseStudy.featuredImage?.asset && (
                    <div className="w-full aspect-video rounded-[2rem] overflow-hidden mb-16 shadow-lg border border-accent-border">
                        <img
                            src={urlForImage(caseStudy.featuredImage.asset)?.width(1600).height(900).url()}
                            alt={caseStudy.featuredImage?.alt || caseStudy.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Metrics — flat row, no box */}
                {caseStudy.metrics && caseStudy.metrics.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-accent-border mb-16">
                        {caseStudy.metrics.map((metric, idx) => (
                            <div key={idx}>
                                <strong className="text-4xl md:text-5xl font-sans font-bold text-accent block mb-1">
                                    {metric.value}
                                </strong>
                                <span className="font-mono text-[10px] text-textMuted uppercase tracking-widest">
                                    {metric.label}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* TL;DR — left border accent, no box */}
                {caseStudy.tldr && (
                    <div className="border-l-2 border-accent pl-6 mb-16">
                        <p className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">TL;DR</p>
                        <p className="text-lg text-textMuted leading-relaxed font-body">
                            {caseStudy.tldr}
                        </p>
                    </div>
                )}

                {/* Problem / Solution / Results — editorial flow */}
                {caseStudy.problemStatement && (
                    <section className="mb-12">
                        <h2 className="font-mono text-xs text-accent uppercase tracking-widest mb-4">The Problem</h2>
                        <p className="text-lg text-text leading-relaxed font-body">
                            {caseStudy.problemStatement}
                        </p>
                    </section>
                )}

                {caseStudy.solutionApproach && (
                    <section className="mb-12">
                        <h2 className="font-mono text-xs text-accent uppercase tracking-widest mb-4">The Solution</h2>
                        <p className="text-lg text-text leading-relaxed font-body">
                            {caseStudy.solutionApproach}
                        </p>
                    </section>
                )}

                {caseStudy.resultsOutcome && (
                    <section className="mb-16">
                        <h2 className="font-mono text-xs text-accent uppercase tracking-widest mb-4">The Results</h2>
                        <p className="text-lg text-text leading-relaxed font-body">
                            {caseStudy.resultsOutcome}
                        </p>
                    </section>
                )}

                {/* Before / After — kept as cards (contrast is the point) */}
                {caseStudy.beforeAfter && (caseStudy.beforeAfter.before || caseStudy.beforeAfter.after) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                        {caseStudy.beforeAfter.before && (
                            <div className="p-6 rounded-xl border border-red-200 bg-red-50/50">
                                <h3 className="text-xs font-bold font-mono text-red-500 uppercase tracking-widest mb-3">Before</h3>
                                <p className="text-base text-textMuted leading-relaxed font-body">{caseStudy.beforeAfter.before}</p>
                            </div>
                        )}
                        {caseStudy.beforeAfter.after && (
                            <div className="p-6 rounded-xl border border-green-200 bg-green-50/50">
                                <h3 className="text-xs font-bold font-mono text-green-600 uppercase tracking-widest mb-3">After</h3>
                                <p className="text-base text-textMuted leading-relaxed font-body">{caseStudy.beforeAfter.after}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Key Takeaways — simple numbered list, no box */}
                {caseStudy.keyTakeaways && caseStudy.keyTakeaways.length > 0 && (
                    <section className="mb-16">
                        <h2 className="font-mono text-xs text-accent uppercase tracking-widest mb-6">Key Takeaways</h2>
                        <ol className="space-y-4">
                            {caseStudy.keyTakeaways.map((takeaway, idx) => (
                                <li key={idx} className="flex items-start gap-4 text-text text-base leading-relaxed font-body">
                                    <span className="text-accent font-bold font-mono text-sm leading-none pt-1 shrink-0">{String(idx + 1).padStart(2, '0')}</span>
                                    <span>{takeaway}</span>
                                </li>
                            ))}
                        </ol>
                    </section>
                )}

                {/* Body Content */}
                <div className="prose-container max-w-none pb-20 border-b border-accent-border case-study-prose">
                    {caseStudy.content ? (
                        <PortableText value={caseStudy.content} components={PortableTextComponents} />
                    ) : (
                        <p className="text-textLight font-mono italic text-center py-10">
                            [Content formatting required in CMS]
                        </p>
                    )}
                </div>

                {/* Related Cases */}
                {relatedCases.length > 0 && (
                    <aside className="mt-20">
                        <h3 className="text-3xl font-sans font-bold text-text mb-10 text-center">
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
