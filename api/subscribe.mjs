/**
 * Kit (ConvertKit) newsletter subscription proxy.
 *
 * Why this exists: Kit's v3 `api_key` is client-side by design, which means
 * anyone who opens DevTools on rsla.io can extract it and spam the subscribe
 * endpoint unlimited times. This proxy keeps the key server-side (never
 * embedded in the client bundle) and adds a honeypot field as light bot
 * protection.
 *
 * Environment variables (set in Vercel → Project → Settings → Env Vars):
 *   KIT_API_KEY   — v3 API key (NO `VITE_` prefix so Vite doesn't embed it)
 *   KIT_FORM_ID   — default form ID to subscribe to (optional; can be passed in request)
 *
 * Client usage:
 *   await fetch('/api/subscribe', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ email, firstName?, tags?, formId })
 *   })
 */

// Whitelist of form IDs we're willing to subscribe to.
// Prevents an attacker from hitting arbitrary forms via our proxy.
const ALLOWED_FORM_IDS = new Set([
    '9130465', // main RSL/A Insider form
]);

const rateMap = new Map();
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 5;

function isRateLimited(ip) {
    const now = Date.now();
    const entry = rateMap.get(ip);
    if (!entry || now - entry.start > RATE_WINDOW_MS) {
        rateMap.set(ip, { start: now, count: 1 });
        return false;
    }
    entry.count++;
    return entry.count > RATE_LIMIT;
}

function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    if (email.length > 254) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
        res.status(429).json({ error: 'Too many requests. Please try again later.' });
        return;
    }

    let body;
    try {
        body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    } catch {
        res.status(400).json({ error: 'Invalid JSON' });
        return;
    }

    const { email, firstName, tags, formId, website } = body;

    // Honeypot — a hidden "website" field that legitimate humans leave blank.
    // Bots that fill every form field get a success response without any
    // actual subscription call. No feedback so they don't probe further.
    if (website) {
        res.status(200).json({ success: true });
        return;
    }

    if (!isValidEmail(email)) {
        res.status(400).json({ error: 'Valid email required' });
        return;
    }

    const targetFormId = String(formId || process.env.KIT_FORM_ID || '');
    if (!ALLOWED_FORM_IDS.has(targetFormId)) {
        res.status(400).json({ error: 'Invalid form ID' });
        return;
    }

    const apiKey = process.env.KIT_API_KEY;
    if (!apiKey) {
        console.error('subscribe: KIT_API_KEY env var is not configured');
        res.status(500).json({ error: 'Server misconfigured' });
        return;
    }

    const payload = {
        api_key: apiKey,
        email,
    };
    if (firstName && typeof firstName === 'string') {
        payload.first_name = firstName.replace(/<[^>]*>/g, '').slice(0, 100);
    }
    if (Array.isArray(tags) && tags.length > 0 && tags.length <= 10) {
        payload.tags = tags.filter((t) => typeof t === 'string' || typeof t === 'number');
    }

    try {
        const kitRes = await fetch(
            `https://api.convertkit.com/v3/forms/${encodeURIComponent(targetFormId)}/subscribe`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            }
        );

        if (!kitRes.ok) {
            const detail = await kitRes.text().catch(() => '');
            console.error('subscribe: Kit API returned', kitRes.status, detail.slice(0, 200));
            res.status(502).json({ error: 'Subscription failed' });
            return;
        }

        res.status(200).json({ success: true });
    } catch (err) {
        console.error('subscribe: unexpected error', err);
        res.status(500).json({ error: 'Unexpected error' });
    }
}
