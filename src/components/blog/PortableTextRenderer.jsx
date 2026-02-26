import { Link } from 'react-router-dom';
import { urlForImage } from '../../sanity/lib/image';

// Helper function to generate slug from text for anchor links
function slugify(text) {
    if (!text) return '';
    return text.toString().toLowerCase()
        .replace(/[-\s]+/g, '-') // Replace spaces and dashes with a single dash
        .replace(/^-|-$/g, '') // Remove leading and trailing dashes
        .replace(/[^a-z0-9-]/g, ''); // Remove all other non-alphanumeric characters
}

export const PortableTextComponents = {
    types: {
        image: ({ value }) => {
            if (!value?.asset?._ref) return null;
            const imageUrl = urlForImage(value.asset)?.width(1000).fit('max').url() || '';

            return (
                <figure className="my-12">
                    <div className="relative w-full overflow-hidden bg-surfaceAlt rounded-[1.5rem] border border-accent-border">
                        <img
                            src={imageUrl}
                            alt={value.alt || 'Blog illustration'}
                            title={value.alt}
                            loading="lazy"
                            className="w-full h-auto object-cover max-h-[600px]"
                        />
                    </div>
                    {value.caption && (
                        <figcaption className="text-center text-sm font-mono text-textLight mt-4 italic">
                            {value.caption}
                        </figcaption>
                    )}
                </figure>
            );
        },
        code: ({ value }) => {
            return (
                <pre className="bg-slate-900 text-white rounded-xl p-6 overflow-x-auto my-8 max-w-full shadow-lg">
                    {value.filename && (
                        <div className="text-sm text-accent font-mono mb-4 border-b border-white/10 pb-3">
                            {value.filename}
                        </div>
                    )}
                    <code className="text-sm font-mono block leading-relaxed">{value.code}</code>
                </pre>
            );
        },
        videoEmbed: ({ value }) => {
            const { url, caption } = value;
            let embedUrl = '';

            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                const videoId = url.includes('youtu.be')
                    ? url.split('youtu.be/')[1]?.split('?')[0]
                    : url.split('v=')[1]?.split('&')[0];
                embedUrl = `https://www.youtube.com/embed/${videoId}`;
            } else if (url.includes('vimeo.com')) {
                const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
                embedUrl = `https://player.vimeo.com/video/${videoId}`;
            } else if (url.includes('loom.com')) {
                const videoId = url.split('/share/')[1]?.split('?')[0];
                embedUrl = `https://www.loom.com/embed/${videoId}`;
            }

            if (!embedUrl) return null;

            return (
                <figure className="my-10 flex flex-col items-center">
                    <div className="relative rounded-xl overflow-hidden w-full aspect-video bg-surfaceAlt border border-accent-border shadow-lg">
                        <iframe
                            src={embedUrl}
                            className="absolute inset-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                        />
                    </div>
                    {caption && (
                        <figcaption className="text-center text-sm font-mono text-textLight mt-4 italic">
                            {caption}
                        </figcaption>
                    )}
                </figure>
            );
        },
        callout: ({ value }) => {
            const { title, content } = value;
            return (
                <div className="my-10 p-8 rounded-[1.5rem] border bg-accent/5 border-accent/20">
                    <div className="flex items-start gap-4">
                        <span className="text-2xl pt-1">💡</span>
                        <div className="flex-1">
                            {title && <h4 className="text-xl font-bold font-sans text-text mb-3">{title}</h4>}
                            <p className="font-mono text-textMuted leading-relaxed text-sm md:text-base">{content}</p>
                        </div>
                    </div>
                </div>
            );
        },
        statsCard: ({ value }) => {
            const { stats } = value;
            if (!stats || stats.length === 0) return null;

            return (
                <div className="my-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-surfaceAlt border border-accent-border rounded-2xl p-6 text-center shadow-sm">
                            <div className="text-4xl font-bold font-sans text-accent mb-2">{stat.value}</div>
                            <div className="text-xs font-mono text-textLight uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>
            );
        },
        divider: ({ value }) => {
            const { style } = value;
            if (style === 'dots') {
                return (
                    <div className="my-16 flex justify-center gap-4">
                        <span className="w-2 h-2 rounded-full bg-accent/40"></span>
                        <span className="w-2 h-2 rounded-full bg-accent/40"></span>
                        <span className="w-2 h-2 rounded-full bg-accent/40"></span>
                    </div>
                );
            }
            return <hr className="my-16 border-t border-accent-border" />;
        },
        ctaButton: ({ value }) => {
            const { text, url, style } = value;
            if (!text || !url) return null;

            const isInternal = url.startsWith('/');
            const Tag = isInternal ? Link : 'a';
            const linkProps = isInternal
                ? { to: url }
                : { href: url, target: '_blank', rel: 'noopener noreferrer' };

            const isPrimary = style !== 'secondary';

            return (
                <div className="my-10 flex justify-center">
                    <Tag
                        {...linkProps}
                        className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-sans font-bold text-base transition-all hover:scale-105 ${
                            isPrimary
                                ? 'bg-accent text-white shadow-[0_0_20px_rgba(0,112,243,0.3)]'
                                : 'bg-transparent text-text border-2 border-accent-border hover:border-accent/40'
                        }`}
                    >
                        {text} <span className={isPrimary ? 'text-white/70' : 'text-accent'}>→</span>
                    </Tag>
                </div>
            );
        },
        gatedResource: ({ value }) => {
            const { title, description, downloadUrl, buttonText } = value;
            if (!title || !downloadUrl) return null;

            return (
                <div className="my-12 p-8 rounded-[1.5rem] border-2 border-dashed border-accent/30 bg-accent/5 text-center">
                    <span className="text-3xl mb-4 block">📥</span>
                    <h4 className="text-xl font-bold font-sans text-text mb-2">{title}</h4>
                    {description && (
                        <p className="font-mono text-sm text-textMuted mb-6 max-w-md mx-auto">{description}</p>
                    )}
                    <a
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-sans font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,112,243,0.3)]"
                    >
                        {buttonText || 'Download Free Resource'}
                    </a>
                </div>
            );
        },
        testimonial: ({ value }) => {
            const { quote, author, role } = value;
            if (!quote) return null;

            return (
                <div className="my-12 p-8 rounded-[1.5rem] bg-surfaceAlt border border-accent-border relative">
                    <span className="text-6xl text-accent/20 font-drama absolute top-4 left-6 leading-none">"</span>
                    <blockquote className="text-xl md:text-2xl text-textMuted font-drama italic leading-relaxed pl-8 pt-4">
                        {quote}
                    </blockquote>
                    {(author || role) && (
                        <div className="mt-6 pl-8 flex items-center gap-3">
                            <div className="w-8 h-[2px] bg-accent/40" />
                            <div className="font-mono text-sm text-textMuted">
                                {author && <span className="font-bold text-text">{author}</span>}
                                {author && role && <span className="mx-1">·</span>}
                                {role && <span>{role}</span>}
                            </div>
                        </div>
                    )}
                </div>
            );
        },
        techStack: ({ value }) => {
            const { tools } = value;
            if (!tools || tools.length === 0) return null;

            return (
                <div className="my-10 p-8 rounded-[1.5rem] border bg-slate-900 text-white border-slate-900">
                    <div className="flex items-start gap-4">
                        <span className="text-2xl pt-1">⚡️</span>
                        <div className="flex-1">
                            <h4 className="text-xl font-bold font-sans mb-4">Tech Specs</h4>
                            <ul className="space-y-3 font-mono text-sm md:text-base">
                                {tools.map((tool, idx) => (
                                    <li key={idx} className="flex items-baseline gap-3">
                                        <span className="text-accent">◆</span>
                                        <div>
                                            {tool.url ? (
                                                <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-accent transition-colors underline decoration-white/30 underline-offset-4">
                                                    {tool.name}
                                                </a>
                                            ) : (
                                                <span className="text-white/80">{tool.name}</span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            );
        },
    },
    block: {
        h2: ({ children }) => {
            // Very basic text extraction for IDs
            let text = '';
            if (Array.isArray(children)) {
                text = children.map(c => typeof c === 'string' ? c : (c.props?.text || '')).join('');
            } else if (typeof children === 'string') {
                text = children;
            }
            const id = slugify(text);
            return <h2 id={id} className="text-4xl md:text-5xl text-text mt-16 mb-8 font-sans font-bold tracking-tight scroll-mt-32">{children}</h2>;
        },
        h3: ({ children }) => {
            let text = '';
            if (Array.isArray(children)) {
                text = children.map(c => typeof c === 'string' ? c : (c.props?.text || '')).join('');
            } else if (typeof children === 'string') {
                text = children;
            }
            const id = slugify(text);
            return <h3 id={id} className="text-2xl md:text-3xl text-text mt-12 mb-6 font-sans font-semibold scroll-mt-32">{children}</h3>;
        },
        h4: ({ children }) => <h4 className="text-xl md:text-2xl text-text mt-10 mb-4 font-sans font-medium">{children}</h4>,
        normal: ({ children }) => <p className="text-lg md:text-xl leading-relaxed text-textMuted mb-8 max-w-[80ch]">{children}</p>,
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-accent pl-8 my-12 italic text-2xl text-textMuted font-drama leading-relaxed">
                {children}
            </blockquote>
        ),
    },
    list: {
        bullet: ({ children }) => <ul className="list-disc pl-8 mb-8 text-lg md:text-xl leading-relaxed text-textMuted max-w-[80ch] space-y-3 marker:text-accent/50">{children}</ul>,
        number: ({ children }) => <ol className="list-decimal pl-8 mb-8 text-lg md:text-xl leading-relaxed text-textMuted max-w-[80ch] space-y-3 marker:text-accent font-mono">{children}</ol>,
    },
    listItem: {
        bullet: ({ children }) => <li>{children}</li>,
        number: ({ children }) => <li className="font-sans text-textMuted">{children}</li>,
    },
    marks: {
        strong: ({ children }) => <strong className="font-bold text-text">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        code: ({ children }) => <code className="bg-surfaceAlt text-accent px-2 py-1 rounded text-[0.85em] font-mono border border-accent-border">{children}</code>,
        link: ({ value, children }) => {
            const href = value?.href || '#';
            const isUnsafe = /^(javascript|data|vbscript):/i.test(href);
            if (isUnsafe) return <span>{children}</span>;

            const target = value?.blank ? '_blank' : undefined;
            const rel = value?.blank ? 'noopener noreferrer' : undefined;

            if (href.startsWith('/')) {
                return <Link to={href} className="text-accent underline decoration-accent/30 hover:decoration-accent underline-offset-4 transition-all">{children}</Link>;
            }
            return (
                <a href={href} target={target} rel={rel} className="text-accent underline decoration-accent/30 hover:decoration-accent underline-offset-4 transition-all">
                    {children}
                </a>
            );
        },
    },
};
