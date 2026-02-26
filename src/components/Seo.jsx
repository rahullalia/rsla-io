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

export default function Seo({ title, description, canonical, noIndex, ogImage, jsonLd }) {
    useEffect(() => {
        // Title
        if (title) {
            document.title = title;
        }

        // Description
        if (description) {
            setOrCreateMeta('name', 'description', description);
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

        // JSON-LD structured data
        if (jsonLd) {
            let script = document.getElementById(JSON_LD_ID);
            if (!script) {
                script = document.createElement('script');
                script.id = JSON_LD_ID;
                script.type = 'application/ld+json';
                document.head.appendChild(script);
            }
            script.textContent = JSON.stringify(jsonLd);
        }

        // Cleanup on unmount
        return () => {
            const canonicalEl = document.querySelector('link[rel="canonical"]');
            if (canonicalEl) {
                canonicalEl.remove();
            }
            const jsonLdEl = document.getElementById(JSON_LD_ID);
            if (jsonLdEl) {
                jsonLdEl.remove();
            }
        };
    }, [title, description, canonical, noIndex, ogImage, jsonLd]);

    return null;
}
