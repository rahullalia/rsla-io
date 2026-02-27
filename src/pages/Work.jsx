import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { client } from '../sanity/lib/client';
import { caseStudiesQuery } from '../sanity/lib/queries';
import { ArrowRight, ChevronDown } from "lucide-react";
import Seo from '../components/Seo';
import CaseStudyCardSkeleton from '../components/skeletons/CaseStudyCardSkeleton';

// Reusable inline card component 
const CaseStudyCard = ({ data }) => (
    <Link
        to={`/work/${data.slug}`}
        className="group flex flex-col h-full bg-surfaceAlt rounded-[2rem] border border-accent-border overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
    >
        <div className="p-8 flex flex-col flex-grow">
            <div className="mb-6 flex justify-between items-start">
                <span className="font-mono text-[10px] uppercase tracking-wider text-accent border border-accent/20 bg-accent/5 px-2 py-1 rounded-sm">
                    {data.tag}
                </span>
                {data.featured && (
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white bg-accent px-2 py-1 rounded-sm">
                        Featured
                    </span>
                )}
            </div>
            <h3 className="font-sans font-bold text-2xl tracking-tight mb-3 group-hover:text-accent transition-colors">
                {data.title}
            </h3>
            <p className="font-mono text-sm text-textMuted mb-8 flex-grow leading-relaxed">
                {data.description}
            </p>

            {data.metrics && data.metrics.length > 0 && (
                <div className="mt-auto grid grid-cols-2 gap-4 pt-6 border-t border-accent-border">
                    {data.metrics.slice(0, 2).map((metric, idx) => (
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

const categories = ["all", "AI Automation", "Marketing", "CRM & Operations", "Development"];

export default function Work() {
    const [caseStudies, setCaseStudies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        let isMounted = true;
        const fetchWorks = async () => {
            setLoading(true);
            try {
                const results = await client.fetch(caseStudiesQuery);
                if (isMounted) setCaseStudies(results);
            } catch (error) {
                console.error("Error fetching case studies:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchWorks();
        window.scrollTo(0, 0);

        return () => { isMounted = false; };
    }, []);

    const filteredAndSortedStudies = caseStudies
        .filter((study) => selectedCategory === "all" || study.category === selectedCategory)
        .sort((a, b) => a.priority - b.priority);

    const featuredStudies = filteredAndSortedStudies.filter(study => study.featured);

    return (
        <main className="min-h-screen bg-surface text-text pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
            <Seo
                title="Case Studies | RSL/A"
                description="Real results from real clients. See how RSL/A uses AI automation, paid ads, and CRM systems to drive measurable growth."
                canonical="https://rsla.io/work"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: 'Case Studies',
                    url: 'https://rsla.io/work',
                    description: 'Real results from real clients. See how RSL/A uses AI automation, paid ads, and CRM systems to drive measurable growth.',
                    isPartOf: { '@type': 'WebSite', name: 'RSL/A', url: 'https://rsla.io' },
                }}
            />
            {/* Hero Section */}
            <section className="mb-20 text-center max-w-4xl mx-auto relative z-10">
                <h1 className="text-5xl md:text-7xl font-sans font-bold mb-6 tracking-tighter">
                    Proven <span className="text-accent italic font-drama">Performance.</span>
                </h1>
                <p className="font-mono text-textMuted max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                    We don't sell promises. We sell engineered outcomes. Here is the proof.
                </p>
            </section>

            {/* Filters */}
            <section className="mb-12 border-b border-accent-border pb-8 relative z-10 max-w-7xl mx-auto">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="appearance-none min-h-[44px] pl-4 pr-10 rounded-full bg-surfaceAlt border border-accent-border text-text font-mono text-xs uppercase tracking-wider cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 transition-all"
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category === "all" ? "All Categories" : category}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
                    </div>
                    {!loading && (
                        <div className="font-mono text-xs text-textMuted">
                            Showing [{filteredAndSortedStudies.length}] result{filteredAndSortedStudies.length !== 1 ? 's' : ''}
                        </div>
                    )}
                </div>
            </section>

            {/* Grid */}
            <section className="max-w-7xl mx-auto relative z-10 mb-32">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <CaseStudyCardSkeleton key={i} />
                        ))}
                    </div>
                ) : filteredAndSortedStudies.length === 0 ? (
                    <div className="text-center py-20 font-mono text-textMuted">
                        No case studies found for this category.
                    </div>
                ) : (
                    <div className="space-y-16">
                        {/* Featured Row */}
                        {featuredStudies.length > 0 && (
                            <div>
                                <h2 className="font-mono text-xs text-textMuted uppercase tracking-widest mb-6 px-4">
                                    Featured Intelligence
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {featuredStudies.map((study) => (
                                        <CaseStudyCard data={study} key={study.slug} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* All Other Cases */}
                        {filteredAndSortedStudies.filter(s => !s.featured).length > 0 && (
                            <div>
                                <h2 className="font-mono text-xs text-textMuted uppercase tracking-widest mb-6 px-4">
                                    All Case Studies
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredAndSortedStudies.filter(s => !s.featured).map((study) => (
                                        <CaseStudyCard data={study} key={study.slug} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* CTA */}
            <section className="max-w-4xl mx-auto text-center relative z-10 bg-surfaceAlt border border-accent-border rounded-[3rem] p-16 overflow-hidden shadow-sm">
                <h2 className="text-4xl md:text-5xl font-sans font-bold text-text mb-6">
                    Let's build something like this <span className="text-accent font-drama italic font-normal">for you.</span>
                </h2>
                <p className="font-body text-textMuted mb-10 text-sm md:text-base max-w-xl mx-auto">
                    Tell us what you're working on. We'll show you what's possible.
                </p>
                <Link
                    to="/#contact"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-white font-sans font-bold rounded-full hover:bg-accent/90 hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,112,243,0.3)]"
                >
                    Start Your Project <ArrowRight size={18} />
                </Link>
            </section>
        </main>
    );
}
