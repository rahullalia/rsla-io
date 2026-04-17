import { createClient } from '@sanity/client';
import { createReadStream } from 'fs';

const client = createClient({
    projectId: 'yz25oyux',
    dataset: 'production',
    token: process.env.SANITY_API_TOKEN_V2,
    apiVersion: '2025-03-01',
    useCdn: false,
});

const DOC_ID = 'drafts.cs-adreviveai-saas-build';

let keyCounter = 0;
const key = () => `av${String(++keyCounter).padStart(3, '0')}`;

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
        createReadStream('/Users/rahullalia/Downloads/adreviveai/AdReviveAI.png'),
        { filename: 'adreviveai-featured.png' }
    );
    console.log(`  Featured: ${featuredAsset._id}`);

    console.log('Uploading pricing screenshot...');
    const pricingAsset = await client.assets.upload(
        'image',
        createReadStream('/Users/rahullalia/Downloads/adreviveai/screenshot 2026-03-08-19.07.25.jpg'),
        { filename: 'adreviveai-pricing-tiers.jpg' }
    );
    console.log(`  Pricing: ${pricingAsset._id}`);

    // ===== BUILD DOCUMENT =====
    const document = {
        _id: DOC_ID,
        _type: 'caseStudyV2',

        // ===== STORY =====
        title: 'Idea to SaaS in 4 Weeks',
        slug: { _type: 'slug', current: 'adreviveai-saas-build' },
        clientName: 'AdReviveAI',
        tag: 'GHL SaaS Build',
        description:
            'Built a complete 3-tier SaaS platform for MedSpa marketing automation on GoHighLevel. Two AI agents, 31 workflows, 5 pipelines, and full documentation. Four weeks, start to finish.',
        featuredImage: {
            _type: 'image',
            asset: { _type: 'reference', _ref: featuredAsset._id },
            alt: 'Case study: Idea to SaaS in 4 weeks. 2 AI agents, 31 automations, zero code.',
        },
        tldr: 'AdReviveAI needed a full SaaS platform built on GoHighLevel to sell marketing automation to MedSpas. We delivered a 3-tier product with 2 AI agents, 31 workflows, 5 pipelines, 88 CRM fields, and a 10-week lead magnet sequence in 4 weeks. Ready to sell on day one.',
        pullQuote: 'From a concept on Upwork to a launch-ready SaaS with 31 automations. Four weeks.',

        // ===== BODY =====
        content: [
            // --- THE ASK ---
            block('The ask', 'h2'),
            block('Curtis Haessley, co-founder of AdReviveAI, came to us through Upwork with a clear vision: build a SaaS platform that helps MedSpas automate their entire marketing operation. Not just ads. Not just a CRM. The full picture. Lead capture, appointment booking, follow-ups, reviews, loyalty programs, reactivation campaigns, and AI agents that handle conversations 24/7.'),
            block('The platform would run on GoHighLevel, and it needed to support three pricing tiers, each with a different feature set, so AdReviveAI could sell subscriptions to MedSpa owners at $247, $697, or $1,497 a month.'),
            block('The catch? They wanted it done fast. Four weeks from kickoff to a sellable product.'),

            // --- WHY IT MATTERS ---
            block('Why this matters', 'h2'),
            block('Most people think building a SaaS means hiring developers, writing code, and spending six months in a beta phase. That used to be true. But with GoHighLevel as the backbone, you can build a real product with real automation, real AI, and real value, without writing a single line of code.'),
            block('The question isn\'t whether GHL can handle it. It\'s whether someone knows how to architect it properly. That\'s where this project gets interesting.'),

            // --- WHAT WE BUILT ---
            block('What we built', 'h2'),

            block('Three subscription tiers', 'h3'),
            block('Each tier unlocks a different set of features inside GHL. Not cosmetic differences. Actual capability differences.'),
            richBlock([{ text: 'Starter ($247/mo)', bold: true }, { text: ' — Self-service. Digital loyalty cards, automated rewards, Apple and Google Wallet integration, referral program, and a client analytics dashboard. Built for new MedSpas that want retention without complexity.' }]),
            richBlock([{ text: 'Growth ($697/mo)', bold: true }, { text: ' — Do-with-you. Everything in Starter plus AI chatbot (conversation AI), content AI, reviews AI, database reactivation, funnels, social planner, and ROI analytics. Built for growing MedSpas with one location.' }]),
            richBlock([{ text: 'Scale ($1,497/mo)', bold: true }, { text: ' — Done-for-you. Everything in Growth plus Voice AI (phone receptionist), multi-location support, agent studio, funnel AI, memberships, communities, and an affiliate manager. Built for multi-location operations.' }]),

            // --- PRICING SCREENSHOT ---
            {
                _type: 'caseStudyImage',
                _key: key(),
                asset: {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: pricingAsset._id },
                },
                alt: 'AdReviveAI pricing page showing three tiers: Starter at $247 per month, Growth at $697 per month, and Scale at $1,497 per month',
                caption: 'The live pricing page at adreviveai.com. Three tiers, each mapped to a specific GHL sub-account configuration.',
                size: 'full',
            },

            // --- AI AGENTS ---
            block('Two AI agents', 'h3'),
            block('This is the part that took the most thought. Both agents use a methodology called NEPQ (Needs, Explore Consequences, Problem, Qualify). It\'s pain-focused discovery. The AI doesn\'t pitch features. It asks questions, validates frustrations, and books a call.'),

            richBlock([{ text: 'Conversation AI ("Ava")', bold: true }, { text: ' — A 24/7 chatbot that lives on the AdReviveAI website. Responds via SMS, Instagram, and Facebook. Greets every visitor, captures pain points, and funnels qualified leads to a demo booking. Never quotes prices. Keeps responses under 20 words. Uses natural paragraphs, not bullet lists.' }]),
            richBlock([{ text: 'Voice AI ("Ava")', bold: true }, { text: ' — A phone receptionist that answers calls, asks probing questions, and books appointments. Handles after-hours calls, missed calls, and overflow. Keeps responses under 50 words. The knowledge base is separate from the prompt, which cut token costs by 78% (from $27.50 to $6 per 100 calls).' }]),

            block('Both agents pull from 7 knowledge bases we built: general FAQ, services, pricing packages, campaigns and offers, booking process, compliance, and escalation protocols.'),

            // --- AUTOMATIONS ---
            block('31 workflows', 'h3'),
            block('We started with 23 workflows, then consolidated down to 16 core automations with 15 supporting workflows. Every workflow was documented and tested.'),
            bullet([{ text: 'Booking confirmation and reminders', bold: true }, { text: ' — 14-step workflow with SMS messages under 165 characters' }]),
            bullet([{ text: 'Database reactivation', bold: true }, { text: ' — Both B2C (for MedSpa clients) and B2B (for AdReviveAI\'s own outreach) versions' }]),
            bullet([{ text: 'Social comment automation', bold: true }, { text: ' — Instagram comment triggers DM, Facebook comment triggers Messenger, both hand off to the AI agent' }]),
            bullet([{ text: 'Lead capture workflows', bold: true }, { text: ' — Special offers, referral programs, and trial signup sequences' }]),
            bullet([{ text: 'Client onboarding', bold: true }, { text: ' — 6-stage workflow with forms, surveys, and automatic stage progression' }]),
            bullet([{ text: 'Trial management', bold: true }, { text: ' — From signup through conversion or cancellation handling' }]),
            bullet([{ text: 'NPS and review collection', bold: true }, { text: ' — Post-setup survey that routes feedback based on score' }]),

            // --- PIPELINES ---
            block('5 pipelines, 38 stages', 'h3'),
            block('Every stage of the customer lifecycle has a pipeline.'),
            numbered([{ text: 'Main Sales', bold: true }, { text: ' — Cold leads through to Won or Lost (8 stages)' }]),
            numbered([{ text: 'Free Trial', bold: true }, { text: ' — Trial requested through to Converted or Expired (6 stages)' }]),
            numbered([{ text: 'Onboarding', bold: true }, { text: ' — Kickoff through to Onboarding Complete (6 stages)' }]),
            numbered([{ text: 'Referral', bold: true }, { text: ' — New referral through to Closed (4 stages)' }]),
            numbered([{ text: 'Upsell', bold: true }, { text: ' — Active client through to Upsell Won or Churned (6 stages), including a churn risk stage with automated outreach' }]),

            // --- CRM ---
            block('88 custom CRM fields', 'h3'),
            block('We built a full CRM structure organized by category: general business info (11 fields), contact details (12 fields), referral tracking (8 fields), trial management (5 fields), and digital wallet and loyalty data (24 fields). Plus 30 tags with category prefixes for clean filtering.'),

            // --- LEAD MAGNETS ---
            block('10-week lead magnet sequence', 'h3'),
            block('AdReviveAI needed a way to nurture leads before they\'re ready to buy. We built a 10-week email sequence, each week delivering a condensed lead magnet (1 to 2 pages) that solves a specific MedSpa problem.'),
            numbered([{ text: 'The No-Show Killer', em: true }, { text: ' — Automated reminder systems' }]),
            numbered([{ text: '5-Star Google Review System', em: true }, { text: ' — Review collection automation' }]),
            numbered([{ text: 'After-Hours Lead Capture', em: true }, { text: ' — Never miss a lead outside business hours' }]),
            numbered([{ text: 'Client Reactivation Playbook', em: true }, { text: ' — Re-engage past clients' }]),
            numbered([{ text: 'Speed to Lead', em: true }, { text: ' — 5-minute response system' }]),
            numbered([{ text: 'Pricing Objection Cheat Sheet', em: true }]),
            numbered([{ text: 'Rebooking Machine', em: true }, { text: ' — Automated rebooking workflows' }]),
            numbered([{ text: '$0 Marketing Playbook', em: true }, { text: ' — 15 no-spend strategies' }]),
            numbered([{ text: 'Front Desk Follow-Up Formula', em: true }, { text: ' — 5 critical scripts' }]),
            numbered([{ text: 'Revenue Calculator', em: true }, { text: ' — $100K to $300K leak finder' }]),

            // --- DOCUMENTATION ---
            block('Full documentation', 'h3'),
            block('Every piece of the system was documented. 60+ files covering AI agent prompts, knowledge base setup guides, workflow logic, pipeline structures, SaaS plan configurations, custom field mappings, and voice AI action setups. We didn\'t just build it and hand over the keys. We made sure anyone on the AdReviveAI team could understand, modify, and extend what was built.'),

            // --- DIVIDER ---
            { _type: 'divider', _key: key(), style: 'dots' },

            // --- HOW WE DID IT ---
            block('How we did it in 4 weeks', 'h2'),
            block('Week 1: Architecture', 'h3'),
            block('Mapped out the entire product. Defined all three tiers. Designed the pipeline stages, custom field structure, and tag taxonomy. Built the CRM skeleton.'),

            block('Week 2: AI agents and core workflows', 'h3'),
            block('Built and tested both AI agents (Conversation AI and Voice AI). Created the NEPQ-based prompts. Wrote all 7 knowledge bases. Set up the booking, lead capture, and social comment automation workflows.'),

            block('Week 3: Remaining workflows and lead magnets', 'h3'),
            block('Built the onboarding, trial management, referral, upsell, NPS, and database reactivation workflows. Created all 10 lead magnets and the 11-email nurture sequence. Consolidated 23 workflows down to 16 core automations.'),

            block('Week 4: Testing, documentation, and handoff', 'h3'),
            block('End-to-end testing of every workflow and AI agent. Wrote all documentation (60+ files). Optimized Voice AI token costs (78% reduction). Final handoff to the AdReviveAI team.'),

            // --- CALLOUT ---
            {
                _type: 'callout',
                _key: key(),
                type: 'info',
                title: 'Why GoHighLevel for SaaS',
                content: 'GHL lets you build a full SaaS product without code. Sub-accounts act as individual client instances. SaaS mode handles billing, feature gating, and provisioning. Add AI agents, automations, and CRM on top, and you have a product that rivals custom-built platforms at a fraction of the cost and timeline.',
            },

            // --- TECH STACK ---
            {
                _type: 'techStack',
                _key: key(),
                tools: [
                    { _key: key(), name: 'GoHighLevel', url: 'https://www.gohighlevel.com/', promo: 'CRM, automations, SaaS mode, AI agents' },
                    { _key: key(), name: 'GoHighLevel Voice AI', promo: 'Phone receptionist with NEPQ methodology' },
                    { _key: key(), name: 'GoHighLevel Conversation AI', promo: '24/7 chatbot across SMS, IG, Facebook' },
                    { _key: key(), name: 'Stripe', url: 'https://stripe.com/', promo: 'Subscription billing' },
                    { _key: key(), name: 'Apple Wallet + Google Wallet', promo: 'Digital loyalty cards (no app required)' },
                ],
            },

            // --- THE BOTTOM LINE ---
            block('The bottom line', 'h2'),
            block('Four weeks. One platform. A sellable SaaS product with 2 AI agents, 31 automations, 5 pipelines, 88 CRM fields, a 10-week lead magnet sequence, and 60+ pages of documentation. All on GoHighLevel, no code.'),
            block('AdReviveAI walked away with a product they can sell to MedSpas at $247 to $1,497 a month. Not a prototype. Not an MVP. A real product with real pricing and real automation behind it.'),
            block('That\'s the difference between "we can build that" and actually building it.'),

            // --- CTA ---
            {
                _type: 'ctaButton',
                _key: key(),
                text: 'Want something like this built for you?',
                url: 'https://rsla.io/book-a-call',
                style: 'primary',
            },
        ],

        // ===== PROOF =====
        metrics: [
            { _key: key(), value: '4 weeks', label: 'Start to finish' },
            { _key: key(), value: '31', label: 'Automations built' },
            { _key: key(), value: '2', label: 'AI agents deployed' },
            { _key: key(), value: '3 tiers', label: 'SaaS plans configured' },
        ],
        beforeAfter: {
            before: 'A concept for a MedSpa automation SaaS. No platform, no automations, no AI, no documentation, no product to sell.',
            after: 'A launch-ready SaaS on GoHighLevel with 3 pricing tiers, 2 AI agents, 31 workflows, 5 pipelines, 88 CRM fields, 10 lead magnets, and 60+ pages of documentation.',
        },
        problemStatement:
            'AdReviveAI had a clear vision for an AI-powered MedSpa marketing platform but no way to build it. Traditional development would have taken months and tens of thousands of dollars. They needed someone who could architect and build a complete SaaS product on GoHighLevel, including AI agents, automations, CRM design, lead nurture sequences, and full documentation, in weeks, not months.',
        solutionApproach:
            'We treated GoHighLevel like a full development platform. Week 1 was architecture: mapping tiers, pipelines, CRM fields, and tag taxonomy. Week 2 was AI agents: building two NEPQ-based conversational agents with 7 shared knowledge bases. Week 3 was automations and content: 31 workflows, 10 lead magnets, and an 11-email nurture sequence. Week 4 was testing, token optimization (78% cost reduction on Voice AI), documentation, and handoff.',
        resultsOutcome:
            'In 4 weeks, AdReviveAI had a sellable product. Three subscription tiers ($247, $697, $1,497/mo) with real feature differentiation. Two AI agents handling conversations 24/7 across SMS, Instagram, Facebook, and phone. 31 automations covering the full customer lifecycle from lead capture through upsell. 60+ pages of documentation so the team could own and extend everything we built.',
        keyTakeaways: [
            'Architect the full product before touching GHL. Pipeline stages, CRM fields, and tier feature mapping should all be decided in week one.',
            'Separate AI knowledge bases from prompts. It cut Voice AI costs by 78% and made updates easier.',
            'Consolidate workflows aggressively. We started with 23, ended with 16 core automations. Fewer, smarter workflows are easier to maintain.',
            'Document everything. 60+ files meant the client\'s team could modify and extend the system without calling us.',
            'GHL SaaS mode is seriously underestimated. Sub-accounts, billing, feature gating, and AI agents. That\'s a real product without code.',
        ],

        // ===== SETTINGS =====
        status: 'draft',
        category: 'AI Automations',
        industry: 'saas',
        servicesUsed: ['ai-automations', 'ai-operations'],
        timeframe: 28,
        featured: true,
        priority: 4,
        publishedAt: new Date().toISOString(),
        seo: {
            metaTitle: 'Idea to SaaS in 4 Weeks: AdReviveAI Case Study | RSL/A',
            metaDescription:
                'How we built a 3-tier MedSpa SaaS on GoHighLevel in 4 weeks. 2 AI agents, 31 automations, 5 pipelines, and full documentation.',
            keywords: [
                'GoHighLevel SaaS',
                'GHL SaaS build',
                'MedSpa automation',
                'AI chatbot GHL',
                'Voice AI GoHighLevel',
                'SaaS without code',
                'GoHighLevel case study',
            ],
        },
        faqSchema: [
            {
                _key: key(),
                question: 'Can you build a SaaS product on GoHighLevel without code?',
                answer: 'Yes. GoHighLevel\'s SaaS mode supports sub-accounts (individual client instances), subscription billing via Stripe, feature gating per tier, AI agents (conversation and voice), automations, pipelines, and CRM. We built AdReviveAI\'s entire 3-tier platform without writing any code.',
            },
            {
                _key: key(),
                question: 'How long does it take to build a SaaS on GoHighLevel?',
                answer: 'It depends on scope, but a fully featured SaaS with AI agents, 31 automations, and 5 pipelines took us 4 weeks from kickoff to handoff. Architecture in week 1, AI agents in week 2, automations and content in week 3, testing and documentation in week 4.',
            },
            {
                _key: key(),
                question: 'What is AdReviveAI?',
                answer: 'AdReviveAI is an AI-powered marketing automation platform built for MedSpas and healthcare practices. It helps businesses attract new clients, book appointments automatically, and retain existing clients through loyalty programs. It runs on GoHighLevel with three subscription tiers: Starter ($247/mo), Growth ($697/mo), and Scale ($1,497/mo).',
            },
            {
                _key: key(),
                question: 'What AI agents were built for AdReviveAI?',
                answer: 'Two AI agents: a Conversation AI chatbot named Ava that handles website, SMS, Instagram, and Facebook messages 24/7, and a Voice AI phone receptionist that answers calls, qualifies leads, and books appointments. Both use a pain-focused questioning methodology called NEPQ.',
            },
        ],
    };

    console.log('Creating AdReviveAI case study (V2)...');
    await client.createOrReplace(document);
    console.log(`Done. Document created: ${DOC_ID}`);
    console.log(`Total content blocks: ${document.content.length}`);
}

run().catch((e) => {
    console.error(e.message);
    process.exit(1);
});
