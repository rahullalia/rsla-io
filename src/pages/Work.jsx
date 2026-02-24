import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { client } from '../sanity/lib/client';
import { caseStudiesQuery } from '../sanity/lib/queries';
import { ArrowRight } from "lucide-react";
import Seo from '../components/Seo';

// Reusable inline card component 
const CaseStudyCard = ({ data }) => (
    <Link
        to={`/work/${data.slug}`}
        className="group flex flex-col h-full bg-primary rounded-[2rem] border border-dark/5 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
    >
        <div className="p-8 flex flex-col flex-grow">
            <div className="mb-6 flex justify-between items-start">
                <span className="font-mono text-[10px] uppercase tracking-wider text-accent border border-accent/20 bg-accent/5 px-2 py-1 rounded-sm">
                    {data.tag}
                </span>
                {data.featured && (
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white bg-dark px-2 py-1 rounded-sm">
                        Featured
                    </span>
                )}
            </div>
            <h3 className="font-sans font-bold text-2xl tracking-tight mb-3 group-hover:text-accent transition-colors">
                {data.title}
            </h3>
            <p className="font-mono text-sm text-dark/60 mb-8 flex-grow leading-relaxed">
                {data.description}
            </p>

            {data.metrics && data.metrics.length > 0 && (
                <div className="mt-auto grid grid-cols-2 gap-4 pt-6 border-t border-dark/5">
                    {data.metrics.slice(0, 2).map((metric, idx) => (
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

const categories = ["all", "AI Automation", "Marketing", "CRM & Operations", "Development"];

export default function Work() {
    const [caseStudies, setCaseStudies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("priority");

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
        .sort((a, b) => {
            if (sortBy === "priority") return a.priority - b.priority;
            return (b.annualSavings || 0) - (a.annualSavings || 0);
        });

    const featuredStudies = filteredAndSortedStudies.filter(study => study.featured);

    return (
        <main className="min-h-screen bg-background text-dark pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
            <Seo
                title="Case Studies | RSL/A"
                description="Real results from real clients. See how RSL/A uses AI automation, paid ads, and CRM systems to drive measurable growth."
                canonical="https://rsla.io/work"
            />
            {/* Hero Section */}
            <section className="mb-20 text-center max-w-4xl mx-auto relative z-10">
                <h1 className="text-5xl md:text-7xl font-sans font-bold mb-6 tracking-tighter">
                    Proven <span className="text-accent italic font-drama">Performance.</span>
                </h1>
                <p className="font-mono text-dark/70 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                    We don't sell promises. We sell engineered outcomes. Here is the proof.
                </p>
            </section>

            {/* Filters */}
            <section className="mb-12 border-b border-dark/10 pb-8 relative z-10 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    <div className="flex flex-wrap gap-3">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`
                                    px-4 py-2 rounded-full font-mono text-xs uppercase tracking-widest transition-all duration-300
                                    ${selectedCategory === category
                                        ? "bg-accent text-white"
                                        : "bg-dark/5 text-dark/60 border border-dark/10 hover:bg-dark/10 hover:text-dark"
                                    }
                                `}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="font-mono text-xs text-dark/50 uppercase tracking-widest">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-transparent border-b border-dark/20 text-dark font-sans font-bold pb-1 text-sm outline-none focus:border-accent transition-colors"
                        >
                            <option value="priority">Featured First</option>
                            <option value="savings">Highest ROI</option>
                        </select>
                    </div>
                </div>
                {!loading && (
                    <div className="mt-6 font-mono text-xs text-dark/40 text-left md:text-right">
                        Showing [{filteredAndSortedStudies.length}] result{filteredAndSortedStudies.length !== 1 ? 's' : ''}
                    </div>
                )}
            </section>

            {/* Grid */}
            <section className="max-w-7xl mx-auto relative z-10 mb-32">
                {loading ? (
                    <div className="flex justify-center items-center py-20 font-mono text-accent animate-pulse">
                        [FETCHING_DATA...]
                    </div>
                ) : filteredAndSortedStudies.length === 0 ? (
                    <div className="text-center py-20 font-mono text-dark/50">
                        No case studies found for this category.
                    </div>
                ) : (
                    <div className="space-y-16">
                        {/* Featured Row */}
                        {featuredStudies.length > 0 && (
                            <div>
                                <h2 className="font-mono text-xs text-dark/40 uppercase tracking-widest mb-6 px-4">
                                    Featured Intelligence
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {featuredStudies.map((study) => (
                                        <CaseStudyCard data={study} key={study.slug} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* CTA */}
            <section className="max-w-4xl mx-auto text-center relative z-10 bg-dark rounded-[3rem] p-16 overflow-hidden shadow-2xl">
                <div className="absolute -inset-20 bg-[radial-gradient(circle_at_50%_100%,rgba(0,112,243,0.15),transparent_60%)] pointer-events-none" />

                <h2 className="text-4xl md:text-5xl font-sans font-bold text-white mb-6">
                    Ready to be the next <span className="text-accent">case study?</span>
                </h2>
                <p className="font-mono text-white/50 mb-10 text-sm md:text-base max-w-xl mx-auto">
                    Let's build you an intelligent marketing system that delivers measurable results.
                </p>
                <Link
                    to="/#get-started"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-white font-sans font-bold rounded-full hover:bg-accent/90 hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,112,243,0.3)]"
                >
                    Start Your Project <ArrowRight size={18} />
                </Link>
            </section>
        </main>
    );
}
