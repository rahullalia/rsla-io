import { createClient } from '@sanity/client';
import { createReadStream } from 'fs';

const client = createClient({
    projectId: 'yz25oyux',
    dataset: 'production',
    token: process.env.SANITY_API_TOKEN_V2,
    apiVersion: '2025-03-01',
    useCdn: false,
});

const DOC_ID = 'cs-fieldshare-seo-rebrand';

let keyCounter = 0;
const key = () => `fs${String(++keyCounter).padStart(3, '0')}`;

const block = (text, style = 'normal') => ({
    _type: 'block',
    _key: key(),
    style,
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
    markDefs: [],
});

const richBlock = (parts, style = 'normal', listConfig = null) => {
    const b = {
        _type: 'block',
        _key: key(),
        style,
        children: parts.map((p) => ({
            _type: 'span',
            _key: key(),
            text: p.text,
            marks: p.bold ? ['strong'] : p.em ? ['em'] : [],
        })),
        markDefs: [],
    };
    if (listConfig) {
        b.listItem = listConfig.type;
        b.level = listConfig.level || 1;
    }
    return b;
};

const bullet = (parts) => richBlock(parts, 'normal', { type: 'bullet', level: 1 });
const numbered = (parts) => richBlock(parts, 'normal', { type: 'number', level: 1 });

async function run() {
    // ===== UPLOAD IMAGES =====
    console.log('Uploading featured image...');
    const featuredAsset = await client.assets.upload(
        'image',
        createReadStream('/Users/rahullalia/Downloads/fieldshare/Fieldshare.png'),
        { filename: 'fieldshare-featured.png' }
    );
    console.log(`  Featured: ${featuredAsset._id}`);

    console.log('Uploading homepage screenshot...');
    const homepageAsset = await client.assets.upload(
        'image',
        createReadStream('/Users/rahullalia/Downloads/fieldshare/screenshot 2026-03-08-19.55.16.jpg'),
        { filename: 'fieldshare-homepage.jpg' }
    );
    console.log(`  Homepage: ${homepageAsset._id}`);

    // ===== BUILD DOCUMENT =====
    const document = {
        _id: DOC_ID,
        _type: 'caseStudyV2',

        // ===== STORY =====
        title: 'Page 1 in 6 Months',
        slug: { _type: 'slug', current: 'fieldshare-seo-website-rebrand' },
        clientName: 'Fieldshare',
        tag: 'SEO & Website Rebrand',
        description:
            'Rebuilt Fieldshare\'s website, repositioned from 6 industries to 1 primary focus, and ranked #1 on Google for 20+ keywords in 6 months. The new site closed a client on its own.',
        featuredImage: {
            _type: 'image',
            asset: { _type: 'reference', _ref: featuredAsset._id },
            alt: 'Case study: Page 1 in 6 months. Ranking in the top 3 for 20+ keywords.',
        },
        tldr: 'Fieldshare was a SaaS company trying to sell to 6 industries at once with a generic Webflow template. We rebuilt their website on WordPress, repositioned them around oil and gas, wrote SEO content targeting specific industry keywords, and got them ranking #1 for 20+ terms in 6 months. The redesigned site even closed a new client on its own.',
        pullQuote: 'Generic Webflow template selling to 6 industries. Six months later: #1 on Google for 20+ keywords and closing clients from the website alone.',

        // ===== BODY =====
        content: [
            // --- THE SITUATION ---
            block('The situation', 'h2'),
            block('Fieldshare is an all-in-one field management platform for oil and gas operators, based in Vancouver, British Columbia. They help companies track asset retirement obligations, automate regulatory reporting, centralize wellsite data, and coordinate field crews. Serious software for a serious industry.'),
            block('But you wouldn\'t have known that from their website.'),
            block('When Chris Kam, Fieldshare\'s founder, came to us, the site was a generic Webflow SaaS template. It looked like every other software company on the internet. Worse, they were trying to sell to six different industries at once: oil and gas, environmental services, property management, municipal, construction, and utilities. The messaging was diluted. The positioning was scattered. And Google had no idea what to rank them for.'),
            block('The result? Low visibility, no organic traffic to speak of, and a website that didn\'t convert because it didn\'t speak to anyone specifically.'),

            // --- WHAT WE DID ---
            block('What we did', 'h2'),

            block('Repositioned the entire brand', 'h3'),
            block('The first thing we did was kill the "we serve everyone" approach. Fieldshare\'s strongest product-market fit was in oil and gas. That\'s where their features (ARO management, AER and BCER reporting, wellsite data, pipeline compliance) actually matched real buyer pain points.'),
            block('We restructured the positioning:'),
            bullet([{ text: 'Primary:', bold: true }, { text: ' Oil and Gas (the homepage, the hero, the main CTA)' }]),
            bullet([{ text: 'Secondary:', bold: true }, { text: ' Environmental Field Services, Property Management, Municipal' }]),
            block('Each secondary industry still has a dedicated page, but oil and gas leads the brand. Every visitor knows within 3 seconds what Fieldshare does and who it\'s for.'),

            // --- HOMEPAGE SCREENSHOT ---
            {
                _type: 'caseStudyImage',
                _key: key(),
                asset: {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: homepageAsset._id },
                },
                alt: 'Fieldshare redesigned homepage showing Oil and Gas Asset Management as the primary focus with industry-specific messaging',
                caption: 'The redesigned homepage. Oil and Gas front and center. No more generic SaaS template.',
                size: 'full',
            },

            // --- WEBSITE REBUILD ---
            block('Rebuilt the website from scratch', 'h3'),
            block('We moved off the generic Webflow template and rebuilt the entire site on WordPress with Elementor. The old design looked like it could belong to any software company. The new one looks like it belongs to an oil and gas technology company.'),
            block('The redesign wasn\'t just visual. We rewrote every page with industry-specific language that matches how oil and gas operators actually talk and search. ARO management. Wellsite compliance. Pipeline data. BCER reporting. Real terms that real buyers use.'),
            block('Chris\'s existing clients noticed immediately. Multiple clients told him the new site matched Fieldshare\'s brand and persona much better than the old one.'),

            // --- TESTIMONIAL ---
            {
                _type: 'testimonial',
                _key: key(),
                quote: 'We closed a new client last month. A mid to high-profile operator. They told us our website was impressive and that it was a big factor in choosing us over the competition.',
                author: 'Chris Kam',
                role: 'Founder, Fieldshare.io',
            },

            // --- SEO ---
            block('Built an SEO engine around industry keywords', 'h3'),
            block('With the positioning clear, we went after the keywords that oil and gas buyers actually search for. Not broad SaaS terms. Industry-specific queries that signal real intent.'),
            block('Within 6 months, Fieldshare was ranking #1 on Google for:'),
            bullet([{ text: 'ARO management oil and gas' }]),
            bullet([{ text: 'Asset management software for municipalities' }]),
            bullet([{ text: 'Environmental data management system' }]),
            bullet([{ text: 'ARO management' }]),
            bullet([{ text: 'Environmental data systems' }]),
            bullet([{ text: 'Field data capture (oil and gas)' }]),
            bullet([{ text: 'Municipal management system' }]),
            block('And ranking in the top 3 for 20+ additional keywords, including "oil and gas industries in Vancouver."'),
            block('This wasn\'t paid traffic. This was organic. Every one of these rankings was earned through on-page SEO, content strategy, and technical cleanup.'),

            // --- CALLOUT ---
            {
                _type: 'callout',
                _key: key(),
                type: 'tip',
                title: 'Why niche beats broad for SaaS SEO',
                content: 'When you try to rank for 6 industries, you rank for none. Google rewards specificity. A page about "ARO management for oil and gas" with industry language, real use cases, and technical depth will always outrank a generic "asset management software" page that tries to speak to everyone.',
            },

            // --- DIVIDER ---
            { _type: 'divider', _key: key(), style: 'dots' },

            // --- THE APPROACH ---
            block('How we did it', 'h2'),

            block('Month 1 to 2: Strategy and rebuild', 'h3'),
            block('Audited the existing site and competitive landscape. Defined the positioning hierarchy (1 primary, 3 secondary industries). Rebuilt the entire site on WordPress with Elementor. Rewrote all copy with industry-specific language and search intent in mind.'),

            block('Month 3 to 4: SEO foundation', 'h3'),
            block('On-page optimization across every page. Technical SEO cleanup (site speed, meta tags, schema markup, internal linking). Started publishing targeted blog content around high-intent oil and gas keywords. Set up Google Business Profile optimization.'),

            block('Month 5 to 6: Rankings and results', 'h3'),
            block('Continued content publishing. Monitored keyword movement and adjusted strategy. Fieldshare started appearing on page 1 for target keywords. First inbound lead attributed to organic search. The client close from the website happened during this phase.'),

            // --- TECH STACK ---
            {
                _type: 'techStack',
                _key: key(),
                tools: [
                    { _key: key(), name: 'WordPress', url: 'https://wordpress.org/', promo: 'CMS and site foundation' },
                    { _key: key(), name: 'Elementor', url: 'https://elementor.com/', promo: 'Page builder and design system' },
                    { _key: key(), name: 'Google Search Console', promo: 'Keyword tracking and indexing' },
                    { _key: key(), name: 'Google Business Profile', promo: 'Local SEO and visibility' },
                ],
            },

            // --- VIDEO ---
            {
                _type: 'videoEmbed',
                _key: key(),
                url: 'https://youtu.be/aqod4UDKYDc',
                orientation: 'horizontal',
                caption: 'SaaS explainer video we created for Fieldshare using Remotion and Claude.',
            },

            // --- THE BOTTOM LINE ---
            block('The bottom line', 'h2'),
            block('Fieldshare went from a generic Webflow template selling to 6 industries to a focused, industry-specific website ranking #1 for 20+ keywords on Google. In 6 months.'),
            block('The site isn\'t just ranking. It\'s converting. Existing clients are complimenting the rebrand. New clients are signing because the website impressed them before the sales call even happened.'),
            block('That\'s what happens when your website actually says what you do, for who, and why it matters. No fluff. No "we serve everyone." Just clarity, and Google rewards clarity.'),

            // --- CTA ---
            {
                _type: 'ctaButton',
                _key: key(),
                text: 'Want your SaaS ranking like this?',
                url: 'https://rsla.io/#contact',
                style: 'primary',
            },
        ],

        // ===== PROOF =====
        metrics: [
            { _key: key(), value: '#1', label: 'Google ranking for 7+ keywords' },
            { _key: key(), value: '20+', label: 'Top 3 keyword rankings' },
            { _key: key(), value: '6 months', label: 'Start to results' },
            { _key: key(), value: '1', label: 'Client closed from website alone' },
        ],
        beforeAfter: {
            before: 'Generic Webflow SaaS template targeting 6 industries. No clear positioning. No organic rankings. Website didn\'t convert or differentiate from competitors.',
            after: 'Custom WordPress site focused on oil and gas. Ranking #1 for 7+ industry keywords, top 3 for 20+ keywords. Closed a client from the website alone. Existing clients praised the rebrand.',
        },
        problemStatement:
            'Fieldshare had a capable product but an invisible website. The generic Webflow template tried to sell to six industries at once, which meant it didn\'t speak specifically to any of them. Google couldn\'t figure out what to rank them for. Buyers couldn\'t tell Fieldshare apart from any other SaaS company. The website wasn\'t generating leads, and it certainly wasn\'t closing deals.',
        solutionApproach:
            'We started with positioning. Fieldshare\'s strongest fit was oil and gas, so we made that the primary focus and pushed the other three industries to secondary pages. We rebuilt the site from scratch on WordPress with Elementor, rewrote all copy with industry-specific language (ARO, BCER, wellsite compliance), and built an SEO strategy around the exact keywords oil and gas operators search for. Six months of on-page optimization, content publishing, and technical SEO.',
        resultsOutcome:
            'In 6 months, Fieldshare went from invisible to ranking #1 on Google for keywords like "ARO management oil and gas," "environmental data management system," and "field data capture oil and gas." They\'re in the top 3 for 20+ keywords. The redesigned website closed a mid to high-profile client on its own, and existing clients have praised the rebrand as a much better match for Fieldshare\'s brand and persona.',
        keyTakeaways: [
            'Pick one industry and lead with it. Fieldshare\'s product serves multiple verticals, but ranking for "ARO management oil and gas" beats ranking for nothing because you\'re targeting six industries at once.',
            'Rewrite copy in your buyer\'s language. Oil and gas operators don\'t search for "asset management software." They search for "ARO management" and "BCER reporting." Use their words.',
            'A great website closes deals before the sales call. Fieldshare\'s redesign directly led to a new client signing because the site impressed them.',
            'WordPress and Elementor are still excellent for SaaS marketing sites. Fast to build, easy for the client to maintain, and great for SEO.',
            'SEO is a 6-month game, not a 6-week one. Rankings build over time. The strategy was set in month 1, but page 1 results came in month 5.',
        ],

        // ===== SETTINGS =====
        status: 'published',
        category: 'AI Digital Presence',
        industry: 'saas',
        servicesUsed: ['ai-digital-presence'],
        timeframe: 180,
        featured: true,
        priority: 5,
        publishedAt: new Date().toISOString(),
        seo: {
            metaTitle: 'Page 1 in 6 Months: Fieldshare SEO Case Study | RSL/A',
            metaDescription:
                'How we repositioned Fieldshare from 6 industries to 1, rebuilt their website, and ranked #1 on Google for 20+ oil and gas keywords in 6 months.',
            keywords: [
                'SaaS SEO case study',
                'oil and gas SEO',
                'website rebrand',
                'B2B SaaS website',
                'WordPress SaaS website',
                'industry-specific SEO',
                'Fieldshare',
            ],
        },
        faqSchema: [
            {
                _key: key(),
                question: 'How long does SaaS SEO take to show results?',
                answer: 'In Fieldshare\'s case, we saw page 1 rankings within 6 months. The first 2 months were strategy and website rebuild, months 3 to 4 were on-page optimization and content publishing, and results started compounding in months 5 to 6. SEO is a long game, but with the right positioning and keyword strategy, results are predictable.',
            },
            {
                _key: key(),
                question: 'Should a SaaS company focus on one industry or multiple?',
                answer: 'Lead with one. Fieldshare serves oil and gas, environmental services, property management, and municipal clients, but their website now leads with oil and gas because that\'s their strongest product-market fit. Secondary industries have their own pages, but the brand is anchored in one vertical. This clarity is what drives both SEO rankings and buyer trust.',
            },
            {
                _key: key(),
                question: 'Can a website redesign directly lead to new clients?',
                answer: 'Yes. Fieldshare closed a mid to high-profile client who specifically cited the website as a factor in their decision. A well-designed, clearly positioned website builds trust before the first sales conversation. It\'s not just a brochure. It\'s a sales tool.',
            },
            {
                _key: key(),
                question: 'Why move from Webflow to WordPress for a SaaS site?',
                answer: 'For Fieldshare, WordPress with Elementor gave more flexibility for SEO optimization, faster page load times, and easier content management for the team. Webflow is great for design, but WordPress\'s plugin ecosystem and SEO tooling made it the better choice for a site that needed to rank.',
            },
        ],
    };

    console.log('Creating Fieldshare case study (V2)...');
    await client.createOrReplace(document);
    console.log(`Done. Document created: ${DOC_ID}`);
    console.log(`Total content blocks: ${document.content.length}`);
}

run().catch((e) => {
    console.error(e.message);
    process.exit(1);
});
