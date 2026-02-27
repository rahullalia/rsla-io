import { useEffect } from 'react';

function setOrCreateMeta(attr, attrValue, content) {
    let el = document.querySelector(`meta[${attr}="${attrValue}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, attrValue);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

function setOrCreateLink(rel, href) {
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
    }
    el.setAttribute('href', href);
}

const JSON_LD_ID = 'seo-jsonld';

export default function Seo({ title, description, canonical, noIndex, ogImage, jsonLd, keywords }) {
    useEffect(() => {
        // Title
        if (title) {
            document.title = title;
        }

        // Description
        if (description) {
            setOrCreateMeta('name', 'description', description);
        }

        // Keywords
        if (keywords) {
            setOrCreateMeta('name', 'keywords', keywords);
        }

        // OG tags
        if (title) {
            setOrCreateMeta('property', 'og:title', title);
        }
        if (description) {
            setOrCreateMeta('property', 'og:description', description);
        }
        if (canonical) {
            setOrCreateMeta('property', 'og:url', canonical);
        }
        const resolvedOgImage = ogImage || 'https://rsla.io/og-image.png';
        setOrCreateMeta('property', 'og:image', resolvedOgImage);
        setOrCreateMeta('name', 'twitter:image', resolvedOgImage);

        // Twitter tags
        if (title) {
            setOrCreateMeta('name', 'twitter:title', title);
        }
        if (description) {
            setOrCreateMeta('name', 'twitter:description', description);
        }

        // Canonical link
        if (canonical) {
            setOrCreateLink('canonical', canonical);
        }

        // Robots
        if (noIndex) {
            setOrCreateMeta('name', 'robots', 'noindex, nofollow');
        } else {
            const robotsMeta = document.querySelector('meta[name="robots"]');
            if (robotsMeta) {
                robotsMeta.remove();
            }
        }

        // JSON-LD structured data (supports single object or array of objects)
        if (jsonLd) {
            const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
            // Remove any previous JSON-LD blocks
            document.querySelectorAll(`script[data-seo-jsonld]`).forEach(el => el.remove());
            schemas.forEach((schema, i) => {
                const script = document.createElement('script');
                script.setAttribute('data-seo-jsonld', '');
                script.type = 'application/ld+json';
                script.textContent = JSON.stringify(schema);
                document.head.appendChild(script);
            });
        }

        // Cleanup on unmount
        return () => {
            const canonicalEl = document.querySelector('link[rel="canonical"]');
            if (canonicalEl) {
                canonicalEl.remove();
            }
            document.querySelectorAll('script[data-seo-jsonld]').forEach(el => el.remove());
        };
    }, [title, description, canonical, noIndex, ogImage, jsonLd, keywords]);

    return null;
}
