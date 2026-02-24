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

export default function Seo({ title, description, canonical, noIndex }) {
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

        // Cleanup canonical on unmount to avoid stale values
        return () => {
            const canonicalEl = document.querySelector('link[rel="canonical"]');
            if (canonicalEl) {
                canonicalEl.remove();
            }
        };
    }, [title, description, canonical, noIndex]);

    return null;
}
