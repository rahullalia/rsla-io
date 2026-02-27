import { useState } from 'react';
import { Link } from 'react-router-dom';
import { urlForImage } from '../../sanity/lib/image';

const KIT_FORM_ID = '9130465';
const KIT_API_KEY = import.meta.env.VITE_KIT_API_KEY;

function GatedResourceBlock({ title, description, downloadUrl, buttonText }) {
    const alreadyUnlocked = typeof window !== 'undefined' && localStorage.getItem('rsla_resource_unlocked');
    const [status, setStatus] = useState(alreadyUnlocked ? 'unlocked' : 'idle'); // idle | submitting | unlocked | error
    const [email, setEmail] = useState('');

    const triggerDownload = (url) => {
        const a = document.createElement('a');
        a.href = url;
        a.download = url.split('/').pop() || 'resource';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || status === 'submitting') return;

        setStatus('submitting');
        try {
            const res = await fetch(`https://api.convertkit.com/v3/forms/${KIT_FORM_ID}/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ api_key: KIT_API_KEY, email }),
            });
            if (res.ok) {
                localStorage.setItem('rsla_resource_unlocked', '1');
                setStatus('unlocked');
                triggerDownload(downloadUrl);
            } else {
                setStatus('error');
                setTimeout(() => setStatus('idle'), 4000);
            }
        } catch {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 4000);
        }
    };

    if (status === 'unlocked') {
        return (
            <div className="my-12 p-8 rounded-[1.5rem] border-2 border-accent/30 bg-accent/5 text-center">
                <p className="font-mono text-xs text-accent uppercase tracking-widest mb-4">Download Ready</p>
                <h4 className="text-xl font-bold font-sans text-text mb-2">{title}</h4>
                <p className="font-mono text-sm text-textMuted mb-6">Your download should start automatically.</p>
                <a
                    href={downloadUrl}
                    download
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-sans font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,112,243,0.3)]"
                >
                    Download Again
                </a>
            </div>
        );
    }

    return (
        <div className="my-12 p-8 rounded-[1.5rem] border-2 border-dashed border-accent/30 bg-accent/5 text-center">
            <p className="font-mono text-xs text-accent uppercase tracking-widest mb-4">Free Resource</p>
            <h4 className="text-xl font-bold font-sans text-text mb-2">{title}</h4>
            {description && (
                <p className="font-mono text-sm text-textMuted mb-6 max-w-md mx-auto">{description}</p>
            )}
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
                <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'submitting'}
                    required
                    className="flex-1 px-4 min-h-[44px] rounded-full bg-surface border border-accent-border text-text font-mono text-sm placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 transition-all"
                />
                <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="px-5 min-h-[44px] rounded-full bg-accent text-white font-sans font-bold text-sm hover:bg-accent/90 transition-colors disabled:opacity-50 cursor-pointer"
                >
                    {status === 'submitting' ? '...' : (buttonText || 'Download')}
                </button>
            </form>
            {status === 'error' && (
                <p className="font-mono text-xs text-coral mt-3">Something went wrong. Try again.</p>
            )}
        </div>
    );
}

// Helper function to generate slug from text for anchor links
export function slugify(text) {
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

            const aspectRatio = value.aspectRatio;
            const hasRatio = aspectRatio && aspectRatio !== 'auto';
            const ratioClass = aspectRatio === '16:9' ? 'aspect-video'
                : aspectRatio === '1:1' ? 'aspect-square'
                : aspectRatio === '4:5' ? 'aspect-[4/5]'
                : '';

            return (
                <figure className="my-12">
                    <div className={`relative w-full overflow-hidden bg-surfaceAlt rounded-[1.5rem] border border-accent-border ${hasRatio ? ratioClass : ''}`}>
                        <img
                            src={imageUrl}
                            alt={value.alt || 'Blog illustration'}
                            title={value.alt}
                            loading="lazy"
                            className={hasRatio ? 'absolute inset-0 w-full h-full object-cover' : 'w-full h-auto object-cover max-h-[600px]'}
                        />
                    </div>
                    {value.caption && (
                        <figcaption className="text-center text-sm font-mono text-textMuted mt-4 italic">
                            {value.caption}
                        </figcaption>
                    )}
                </figure>
            );
        },
        caseStudyImage: ({ value }) => {
            // Case study images have double-nested refs: value.asset is { _type: "image", asset: { _ref } }
            const ref = value?.asset?.asset?._ref;
            if (!ref) return null;
            const imageUrl = urlForImage(value.asset)?.width(1000).fit('max').url() || '';

            const sizeClass = value.size === 'small' ? 'max-w-md mx-auto' :
                              value.size === 'large' ? 'max-w-5xl mx-auto' : '';

            return (
                <figure className={`my-12 ${sizeClass}`}>
                    <div className="relative w-full overflow-hidden bg-surfaceAlt rounded-[1.5rem] border border-accent-border">
                        <img
                            src={imageUrl}
                            alt={value.alt || 'Case study image'}
                            title={value.alt}
                            loading="lazy"
                            className="w-full h-auto object-cover max-h-[600px]"
                        />
                    </div>
                    {(value.caption || value.credit) && (
                        <figcaption className="text-center text-sm font-mono text-textMuted mt-4 italic">
                            {value.caption}{value.credit ? ` — ${value.credit}` : ''}
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
            const { url, caption, orientation } = value;
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
            } else if (url.includes('wistia.com/medias/')) {
                const videoId = url.split('/medias/')[1]?.split('?')[0];
                embedUrl = `https://fast.wistia.net/embed/iframe/${videoId}`;
            }

            if (!embedUrl) return null;

            const isVertical = orientation === 'vertical';

            return (
                <figure className="my-10 flex flex-col items-center">
                    <div className={`relative rounded-xl overflow-hidden bg-surfaceAlt border border-accent-border shadow-lg ${isVertical ? 'w-full max-w-sm aspect-[9/16]' : 'w-full aspect-video'}`}>
                        <iframe
                            src={embedUrl}
                            className="absolute inset-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                        />
                    </div>
                    {caption && (
                        <figcaption className="text-center text-sm font-mono text-textMuted mt-4 italic">
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
                        <span className="w-1 self-stretch bg-accent/40 rounded-full shrink-0"></span>
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
                            <div className="text-xs font-mono text-textMuted uppercase tracking-widest">{stat.label}</div>
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

            return <GatedResourceBlock title={title} description={description} downloadUrl={downloadUrl} buttonText={buttonText} />;
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
                        <span className="w-1 self-stretch bg-accent rounded-full shrink-0"></span>
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
            let text = '';
            if (Array.isArray(children)) {
                text = children.map(c => typeof c === 'string' ? c : (c.props?.text || '')).join('');
            } else if (typeof children === 'string') {
                text = children;
            }
            const id = slugify(text);
            return (
                <h2 id={id} className="mt-16 mb-6 scroll-mt-32">
                    <span className="font-mono text-xs text-accent uppercase tracking-widest">{children}</span>
                </h2>
            );
        },
        h3: ({ children }) => {
            let text = '';
            if (Array.isArray(children)) {
                text = children.map(c => typeof c === 'string' ? c : (c.props?.text || '')).join('');
            } else if (typeof children === 'string') {
                text = children;
            }
            const id = slugify(text);
            return <h3 id={id} className="text-lg md:text-xl text-text mt-12 mb-4 font-sans font-semibold scroll-mt-32">{children}</h3>;
        },
        h4: ({ children }) => <h4 className="text-base md:text-lg text-text mt-8 mb-3 font-sans font-medium">{children}</h4>,
        normal: ({ children }) => <p className="text-base md:text-lg leading-relaxed text-textMuted mb-6 font-body">{children}</p>,
        blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-accent pl-6 my-10 italic text-xl text-textMuted font-drama leading-relaxed">
                {children}
            </blockquote>
        ),
    },
    list: {
        bullet: ({ children }) => <ul className="list-disc pl-6 mb-6 text-base md:text-lg leading-relaxed text-textMuted space-y-2 marker:text-accent/40">{children}</ul>,
        number: ({ children }) => <ol className="list-decimal pl-6 mb-6 text-base md:text-lg leading-relaxed text-textMuted space-y-2 marker:text-accent/60 font-mono">{children}</ol>,
    },
    listItem: {
        bullet: ({ children }) => <li>{children}</li>,
        number: ({ children }) => <li className="font-sans text-textMuted">{children}</li>,
    },
    marks: {
        strong: ({ children }) => <strong className="font-bold text-text">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        code: ({ children }) => <code className="bg-surfaceAlt text-accent px-2 py-1 rounded text-[0.85em] font-mono border border-accent-border">{children}</code>,
        s: ({ children }) => <del className="text-textMuted line-through">{children}</del>,
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
