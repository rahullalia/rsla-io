import { createClient } from '@sanity/client';
import { createReadStream } from 'fs';

const client = createClient({
    projectId: 'yz25oyux',
    dataset: 'production',
    token: process.env.SANITY_API_TOKEN_V2,
    apiVersion: '2025-03-01',
    useCdn: false,
});

const DOC_ID = 'drafts.cs-local-seo-spice-on-a-slice';

let keyCounter = 0;
const key = () => `ss${String(++keyCounter).padStart(3, '0')}`;

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
        createReadStream('/Users/rahullalia/Downloads/SooS/Local SEO.png'),
        { filename: 'spice-on-a-slice-featured.png' }
    );
    console.log(`  Featured: ${featuredAsset._id}`);

    console.log('Uploading review comparison screenshot...');
    const comparisonAsset = await client.assets.upload(
        'image',
        createReadStream('/Users/rahullalia/Downloads/SooS/Review Comparison.jpg'),
        { filename: 'spice-on-a-slice-review-comparison.jpg' }
    );
    console.log(`  Comparison: ${comparisonAsset._id}`);

    console.log('Uploading workflow screenshot...');
    const workflowAsset = await client.assets.upload(
        'image',
        createReadStream('/Users/rahullalia/Downloads/SooS/Google Request Workflow.jpg'),
        { filename: 'spice-on-a-slice-nps-workflow.jpg' }
    );
    console.log(`  Workflow: ${workflowAsset._id}`);

    // ===== BUILD DOCUMENT =====
    const document = {
        _id: DOC_ID,
        _type: 'caseStudyV2',

        // ===== STORY =====
        title: 'From 14 to 132 Google Reviews and $25K in 60 Days',
        slug: { _type: 'slug', current: 'local-seo-reputation-management' },
        clientName: 'Spice on a Slice',
        tag: 'Local SEO & Customer Nurture',
        description:
            'A local pizza shop had 14 Google reviews and was invisible online. We built an NPS driven review engine with automated nurture sequences. 60 days later: 132 reviews, $25K in new revenue, and a #1 local ranking.',
        featuredImage: {
            _type: 'image',
            asset: { _type: 'reference', _ref: featuredAsset._id },
            alt: 'Case study: 14 to 132 Google reviews and $25K revenue in 60 days',
        },
        tldr: 'Spice on a Slice made great pizza but had 14 Google reviews. Invisible online. We built an NPS driven review engine: customers scan a QR code for a free slice, get a quick survey 90 minutes later, and based on their score, the system either sends a review request immediately or delays it so the owner can do damage control first. 60 days later: 132 reviews, $25K in new revenue, #1 local ranking. Runs on autopilot.',
        pullQuote:
            '14 reviews to 132 in 60 days. $25K in new revenue. Zero manual work from the owner.',

        // ===== PROOF =====
        metrics: [
            { _key: key(), value: '14 to 132', label: 'Google Reviews' },
            { _key: key(), value: '$25K', label: 'New Revenue' },
            { _key: key(), value: '60 days', label: 'Time to Results' },
            { _key: key(), value: '#1', label: 'Local Ranking' },
        ],
        beforeAfter: {
            before: '14 Google reviews. Buried on page two. Potential customers searched "pizza near me" and found every competitor first. No system to capture customer info or ask for reviews. Regulars loved the food but nobody was telling Google about it.',
            after: '132 Google reviews. #1 ranking for local pizza searches. $25K in new revenue from increased visibility and repeat visits. NPS driven review requests, nurture sequences, and database reactivation running on autopilot with zero daily management.',
        },
        problemStatement:
            'Spice on a Slice made excellent pizza. Their regulars loved them. But online they were invisible. 14 Google reviews meant they were buried past page two of local search results. Basically nonexistent to anyone discovering restaurants online. Every day, potential customers searched "pizza near me" and found their competitors instead. The lack of social proof was strangling growth and leaving thousands on the table each month. Satisfied customers do not become reviewers automatically. Without a system to convert in store loyalty into online advocacy, even great businesses stay invisible.',
        solutionApproach:
            'We built a complete local SEO system with a twist: an NPS driven review engine. Customers scan a QR code for a free slice, get an internal survey 90 minutes later, and based on their score, the system routes them intelligently. Promoters (9 or 10) get a Google review request within minutes. Everyone else still gets the request (to comply with Google policy) but delayed by 2 hours, giving the owner a window to reach out and resolve any issues first. Combined with GBP optimization, in store lead capture, and automated nurture sequences.',
        resultsOutcome:
            'In under 60 days, the shop transformed. Reviews went from 14 to 132. That is 118 new reviews establishing undeniable social proof. $25,000 in new revenue from increased visibility and repeat visits. First page Google Maps ranking for key local searches, capturing walk in traffic that was going to competitors. Repeat business compounding from automated nurture sequences. The NPS routing meant happy customers left reviews fast while unhappy ones got personal attention before reviewing. Star rating actually went up from 4.5 to 4.6.',
        keyTakeaways: [
            'Use NPS surveys before review requests to route happy customers fast and give yourself a damage control window for everyone else.',
            'Always send the review request regardless of score. Gatekeeping reviews violates Google policy. Just control the timing.',
            'Deploy frictionless in store capture. Free slice for contact info creates a steady lead pipeline.',
            'Build nurture sequences that drive repeat visits with promotions, birthday rewards, and re engagement offers.',
            'Satisfied customers do not become reviewers automatically. You need a system.',
        ],

        // ===== SETTINGS =====
        status: 'draft',
        category: 'AI Lead Generation',
        industry: 'restaurant',
        servicesUsed: ['ai-lead-generation', 'ai-automations'],
        featured: false,
        priority: 5,
        annualSavings: 25000,
        timeframe: 60,
        publishedAt: '2026-03-08T00:00:00Z',

        seo: {
            metaTitle: 'From 14 to 132 Google Reviews in 60 Days | RSL/A',
            metaDescription:
                'How a pizza shop went from 14 to 132 Google reviews in 60 days with an NPS driven review engine, automated nurture, and $25K in new revenue.',
            keywords: [
                'google reviews automation',
                'local seo case study',
                'review generation system',
                'nps survey review request',
                'restaurant marketing automation',
                'google business profile optimization',
                'automated review requests',
            ],
        },

        faqSchema: [
            {
                _key: key(),
                question: 'How did the restaurant grow from 14 to 132 Google reviews in 60 days?',
                answer: 'We built an NPS driven review engine using GoHighLevel. Customers scanned a QR code for a free slice, received an internal NPS survey 90 minutes later, and based on their score, got a review request either immediately (for promoters) or after a 2 hour delay (giving the owner time for damage control). Combined with database reactivation and nurture sequences.',
            },
            {
                _key: key(),
                question: 'Why use an NPS survey before asking for a Google review?',
                answer: 'The NPS survey acts as an early warning system. Customers who score 9 or 10 are likely to leave positive reviews, so they get the request fast. Lower scores still get the review request (to comply with Google policy) but the delay gives the owner time to personally reach out and address concerns first.',
            },
            {
                _key: key(),
                question: 'Does delaying the review request for lower NPS scores violate Google policy?',
                answer: 'No. The system sends the Google review request to everyone regardless of their NPS score. It does not gatekeep the review link. It only controls timing. Promoters get it in about 9 minutes, everyone else gets it after 2 hours. Google policy requires that all customers have equal opportunity to leave reviews.',
            },
            {
                _key: key(),
                question: 'What tools were used for the review automation?',
                answer: 'The system runs on GoHighLevel for CRM, NPS surveys, and automation workflows. Google Business Profile for local SEO optimization. Leadsnap for review tracking and reputation management.',
            },
            {
                _key: key(),
                question: 'Can this work for other local businesses besides restaurants?',
                answer: 'Yes. Any local business that serves customers in person can use this system. Salons, dental offices, auto detailers, contractors. The NPS driven review engine works the same way across every industry.',
            },
        ],

        // ===== BODY CONTENT =====
        content: [
            // --- Section 1: The Problem ---
            block('Great pizza, zero visibility', 'h2'),

            richBlock([
                { text: 'Spice on a Slice made excellent pizza. Their regulars loved them. But online? They were invisible. With only ' },
                { text: '14 Google reviews', bold: true },
                { text: ', they were buried past page two of local search results. Basically nonexistent to anyone discovering restaurants online.' },
            ]),

            block(
                'Every day, potential customers searched "pizza near me" and found their competitors instead. The lack of social proof was strangling growth and leaving thousands on the table each month.'
            ),

            {
                _type: 'callout',
                _key: key(),
                type: 'info',
                title: 'The review economy',
                content:
                    '93% of consumers say online reviews impact their purchasing decisions. For local businesses, Google reviews are the single biggest factor determining whether a new customer walks through your door or goes to a competitor.',
            },

            block(
                'And here is the thing. Satisfied customers do not become reviewers automatically. Without a system to convert in store loyalty into online advocacy, even great businesses stay invisible to new customers.'
            ),

            block('The owner was not doing anything wrong. They just did not have a system.'),

            // --- Section 2: The Build ---
            block('An automated review engine built in a week', 'h2'),

            block(
                'We built a complete local SEO system with a twist. Instead of blasting every customer with a generic "leave us a review" text, we built an NPS driven review engine that routes customers intelligently based on how they actually feel about the experience.'
            ),

            // Phase 1
            block('Phase 1: Google Business Profile optimization', 'h3'),

            block(
                'Before driving reviews, we made sure the foundation was solid. A poorly optimized profile wastes review momentum.'
            ),

            bullet([
                { text: 'Complete profile audit: ', bold: true },
                { text: 'updated hours, photos, menu items, and service areas' },
            ]),
            bullet([
                { text: 'Keyword optimization: ', bold: true },
                { text: 'added relevant terms to business description and services' },
            ]),
            bullet([
                { text: 'Photo enhancement: ', bold: true },
                { text: 'uploaded high quality images of signature dishes and the dining area' },
            ]),
            bullet([
                { text: 'Q&A seeding: ', bold: true },
                { text: 'pre populated common customer questions with helpful answers' },
            ]),

            {
                _type: 'callout',
                _key: key(),
                type: 'tip',
                title: 'Photos matter more than you think',
                content:
                    'Google Business Profiles with 100+ photos get 520% more calls than those with fewer than 10. Visual content builds trust before customers even visit.',
            },

            // Phase 2
            block('Phase 2: In store lead capture plus CRM pipeline', 'h3'),

            block(
                'We needed a frictionless way to capture customer contact info without disrupting the dining experience.'
            ),

            bullet([
                { text: 'QR code at the counter: ', bold: true },
                { text: 'customers scan, enter their info, and claim a free slice on their next visit' },
            ]),
            bullet([
                { text: 'Instant CRM sync: ', bold: true },
                { text: 'every contact flowed automatically into the GoHighLevel pipeline' },
            ]),
            bullet([
                { text: 'Database reactivation: ', bold: true },
                { text: 'launched SMS and email campaigns to re engage past customers' },
            ]),
            bullet([
                { text: 'Segmentation: ', bold: true },
                { text: 'tagged contacts by visit frequency for personalized follow up' },
            ]),

            // Phase 3: The NPS Survey Workflow
            block('Phase 3: The NPS driven review engine', 'h3'),

            block(
                'This is where it gets interesting. Most review systems just blast a "please leave us a review" text after a visit. That is lazy and risky. You are sending the same request to someone who loved their meal and someone who waited 40 minutes for cold pizza.'
            ),

            block(
                'We built something smarter. Here is how it works:'
            ),

            numbered([
                { text: 'Customer scans the QR code ', bold: true },
                { text: 'and claims their free slice. Their contact info flows into the CRM.' },
            ]),
            numbered([
                { text: '90 minutes later, ', bold: true },
                { text: 'they get a quick internal NPS survey via SMS. "On a scale of 1 to 10, how was your experience?" One tap response.' },
            ]),
            numbered([
                { text: 'If they do not respond, ', bold: true },
                { text: 'they get one gentle reminder. If they still do not respond, the sequence stops. No harassment.' },
            ]),
            numbered([
                { text: 'Their NPS score updates in the CRM ', bold: true },
                { text: 'and triggers one of two paths.' },
            ]),

            block('The two paths', 'h4'),

            richBlock([
                { text: 'Promoter path (9 or 10): ', bold: true },
                { text: 'The system sends them the Google review request within 9 minutes. These people loved the experience. Strike while the iron is hot.' },
            ]),

            richBlock([
                { text: 'Passive or detractor path (8 or below): ', bold: true },
                { text: 'The system waits 2 hours before sending the Google review request. That delay is intentional. It gives the owner enough time to personally reach out, understand what went wrong, and do damage control before the customer sits down to write a review.' },
            ]),

            // Insert workflow screenshot here
            {
                _type: 'caseStudyImage',
                _key: key(),
                asset: {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: workflowAsset._id },
                },
                alt: 'GoHighLevel workflow: NPS score triggers promoter path with 9 minute delay or passive path with 2 hour delay before Google review request',
                caption:
                    'The NPS branching workflow. Promoters get the review request in 9 minutes. Everyone else gets a 2 hour delay for damage control.',
                size: 'large',
            },

            {
                _type: 'callout',
                _key: key(),
                type: 'warning',
                title: 'Important: we never gatekeep the review request',
                content:
                    'Every customer gets the Google review link regardless of their NPS score. We are not hiding the review request behind a gate. That would violate Google policy. We are controlling the timing, not the access. Promoters get it fast. Everyone else gets it delayed. But everyone gets it.',
            },

            {
                _type: 'callout',
                _key: key(),
                type: 'success',
                title: 'Why this works',
                content:
                    'Happy customers leave reviews while the experience is fresh. Unhappy customers get personal attention before they write anything. The owner does not need to monitor anything. The system handles routing automatically. And because everyone still gets the review request, you stay fully compliant with Google.',
            },

            // Phase 4
            block('Phase 4: Nurture campaigns for repeat business', 'h3'),

            block(
                'Reviews were just the beginning. Ongoing nurture campaigns drove repeat visits and compounded revenue.'
            ),

            bullet([
                { text: 'Weekly specials: ', bold: true },
                { text: 'automated SMS with rotating promotions' },
            ]),
            bullet([
                { text: 'Birthday rewards: ', bold: true },
                { text: 'free meal on customer birthdays with high redemption rate' },
            ]),
            bullet([
                { text: 'Seasonal campaigns: ', bold: true },
                { text: 'holiday themed offers drove traffic during slow periods' },
            ]),
            bullet([
                { text: 'Re engagement: ', bold: true },
                { text: 'customers inactive 30+ days received a "we miss you" offer' },
            ]),

            // Tech Stack
            {
                _type: 'techStack',
                _key: key(),
                tools: [
                    {
                        _key: key(),
                        name: 'Google Business Profile',
                        url: 'https://business.google.com/',
                    },
                    {
                        _key: key(),
                        name: 'GoHighLevel',
                        url: 'https://www.gohighlevel.com/?fp_ref=rahul-lalia',
                        promo: 'CRM, NPS surveys, SMS, review automation',
                    },
                    {
                        _key: key(),
                        name: 'Leadsnap',
                        url: 'https://app.leadsnap.com?ref=1723c878c5',
                        promo: 'Review tracking and reputation management',
                    },
                ],
            },

            // --- Section 3: What Changed ---
            block('What changed', 'h2'),

            {
                _type: 'statsCard',
                _key: key(),
                stats: [
                    { _key: key(), value: '14 to 132', label: 'Google Reviews' },
                    { _key: key(), value: '$25K', label: 'New Revenue' },
                    { _key: key(), value: '60 days', label: 'Time to Results' },
                    { _key: key(), value: '#1', label: 'Local Ranking' },
                ],
            },

            block(
                'In under 60 days, the shop went from invisible to dominant in local search.'
            ),

            // Insert review comparison screenshot
            {
                _type: 'caseStudyImage',
                _key: key(),
                asset: {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: comparisonAsset._id },
                },
                alt: 'Google Business Profile comparison showing Spice on a Slice before with 14 reviews at 4.5 stars and after with 132 reviews at 4.6 stars',
                caption:
                    'Before and after. 14 reviews at 4.5 stars became 132 reviews at 4.6 stars. The NPS routing helped the star rating go up, not down.',
                size: 'large',
            },

            block('Reviews', 'h3'),

            richBlock([
                { text: 'Reviews went from 14 to 132. That is ' },
                { text: '118 new reviews', bold: true },
                { text: ' in 60 days. And here is the kicker: the star rating actually went up from 4.5 to 4.6. Because the NPS routing gave the owner time to address issues before unhappy customers left reviews.' },
            ]),

            block('Revenue', 'h3'),

            richBlock([
                { text: '$25,000 in new revenue', bold: true },
                { text: ' from increased visibility and repeat visits. Walk in traffic went up because Google finally knew they existed. And the nurture sequences kept bringing people back.' },
            ]),

            block('Local ranking', 'h3'),

            block(
                'The shop went from buried on page two to ranking #1 for "pizza near me" in their neighborhood. That is the difference between being discovered and being ignored.'
            ),

            block('Repeat business', 'h3'),

            block(
                'The nurture sequences created a compounding effect. Old customers started coming back. New customers who found them through Google became regulars. Each review made the next customer more likely to walk through the door.'
            ),

            {
                _type: 'callout',
                _key: key(),
                type: 'success',
                title: 'The real story',
                content:
                    'People already liked their pizza. Not enough people knew about them. The system did not change their food. It changed their visibility. And once people could find them, the food did the rest.',
            },

            {
                _type: 'testimonial',
                _key: key(),
                quote: 'People already liked our pizza, but not enough people knew about us. New customers are finding us now, old ones are coming back, and our Google reviews finally show the quality we have always had.',
                author: 'Shop Owner',
                role: 'Spice on a Slice',
            },

            // --- Section 4: Who This Works For ---
            block('Who this works for', 'h2'),

            block(
                'Any local business that serves customers in person and does not have a system for reviews:'
            ),

            bullet([
                { text: 'Restaurants and cafes ', bold: true },
                { text: 'with loyal regulars but low review counts' },
            ]),
            bullet([
                { text: 'Salons and spas ', bold: true },
                { text: 'relying on word of mouth without digital proof' },
            ]),
            bullet([
                { text: 'Dental and medical offices ', bold: true },
                { text: 'competing for local search visibility' },
            ]),
            bullet([
                { text: 'Auto detailers and contractors ', bold: true },
                { text: 'where reviews directly drive bookings' },
            ]),
            bullet([
                { text: 'Any service business ', bold: true },
                { text: 'where "near me" searches matter' },
            ]),

            block(
                'The NPS driven review engine works the same way across every industry. Capture contact info, survey first, route intelligently, nurture repeat business. The product (or service) does the rest.'
            ),

            // CTA
            {
                _type: 'ctaButton',
                _key: key(),
                text: 'Build Your Review Engine',
                url: '/#contact',
                style: 'primary',
            },
        ],
    };

    console.log('Creating Spice on a Slice case study (V2)...');
    await client.createOrReplace(document);
    console.log(`Done. Document created: ${DOC_ID}`);
    console.log(`Total content blocks: ${document.content.length}`);
}

run().catch((e) => {
    console.error(e.message);
    process.exit(1);
});
