import { createClient } from '@sanity/client';
import { createReadStream } from 'fs';

const client = createClient({
    projectId: 'yz25oyux',
    dataset: 'production',
    token: process.env.SANITY_API_TOKEN_V2,
    apiVersion: '2025-03-01',
    useCdn: false,
});

const DOC_ID = 'drafts.cs-field-service-operations';

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

async function run() {
    // ===== UPLOAD IMAGE =====
    console.log('Uploading featured image...');
    const featuredAsset = await client.assets.upload(
        'image',
        createReadStream('/Users/rahullalia/Downloads/remaining/ricco/GHL + Housecall Pro.png'),
        { filename: 'field-service-operations-featured.png' }
    );
    console.log(`  Featured: ${featuredAsset._id}`);

    // ===== BUILD DOCUMENT =====
    const document = {
        _id: DOC_ID,
        _type: 'caseStudyV2',

        // ===== STORY =====
        title: 'Rebuilt Entire Operations With AI and Housecall Pro Sync',
        slug: { _type: 'slug', current: 'field-service-operations-automation' },
        clientName: 'Professional Cleaning Company',
        tag: 'GoHighLevel & Operations',
        description:
            'A cleaning company with 50+ clients had operations scattered across 4 systems. We rebuilt everything in GoHighLevel with bidirectional Housecall Pro sync. 2 employee workloads eliminated, 99% confirmation rate, $15K recovered.',
        featuredImage: {
            _type: 'image',
            asset: { _type: 'reference', _ref: featuredAsset._id },
            alt: 'Case study: 2 employee workloads saved with full GHL operations rebuild',
        },
        tldr: 'Cleaning company with 50+ recurring clients had operations scattered across Housecall Pro, Google Sheets, manual texts, and email. Owner was burning 20+ hours a week on admin. They hired 2 employees just to answer phones. We rebuilt everything in GoHighLevel with bidirectional Housecall Pro sync via Make.com. AI handles confirmations, review requests, and rebooking automatically. 2 positions eliminated, 99% confirmation rate, $15K recovered from dormant clients.',
        pullQuote:
            '4 systems consolidated into one. 2 employee workloads eliminated. $15K recovered from clients they forgot they had.',

        // ===== PROOF =====
        metrics: [
            { _key: key(), value: '100%', label: 'Ops Consolidated' },
            { _key: key(), value: '2', label: 'Positions Redeployed' },
            { _key: key(), value: '99%', label: 'Confirmation Rate' },
            { _key: key(), value: '$15K', label: 'Revenue Recovered' },
        ],
        beforeAfter: {
            before: 'Customer data fragmented across 4 systems. No single source of truth. Employees typing the same confirmation texts hundreds of times a month. Weekly double bookings from scheduling not synced with communication. Owner burning 20+ hours weekly on admin. 2 full time employees hired just to answer phones and send texts.',
            after: 'All customer data, communications, and workflows in one system. Bidirectional sync keeps GoHighLevel and Housecall Pro in lockstep. Automated confirmations, review requests, rebooking sequences. AI chat widget captures leads 24/7. Owner gets a morning email showing exactly what is happening that day.',
        },
        problemStatement:
            'The cleaning company had grown to 50+ recurring clients and their operations were collapsing under the weight. Housecall Pro for scheduling. Google Sheets for customer notes. Manual texts for follow ups. Email for invoicing. The owner was burning 20+ hours weekly on admin tasks. They had hired 2 full time employees just to answer phones and send confirmation texts. Customer data was fragmented across 4 systems. No single source of truth for history, preferences, or communications. Weekly double bookings because scheduling was not synced with communication. Revenue leaking everywhere. No automated upsell, rebooking, or dormant client reactivation.',
        solutionApproach:
            'We rebuilt their entire operations in GoHighLevel with a critical constraint: they needed to keep Housecall Pro for scheduling. So we engineered bidirectional sync via Make.com. Jobs scheduled in Housecall Pro automatically create opportunities in GHL. All customer data, job history, and notes migrated into unified contacts. Then we deployed AI powered communication workflows. Automated confirmations at 48 hours, 24 hours, and morning of. AI personalized review requests 2 hours post completion. Smart rebooking sequences triggered by service frequency. A 24/7 AI chat widget that answers FAQs, books estimates, and qualifies leads while the team sleeps.',
        resultsOutcome:
            'Within 60 days the transformation was complete. 100% operations consolidated into one system. 2 employees redeployed from admin to fieldwork, increasing service capacity. 99% appointment confirmation rate. Automated reminders virtually eliminated no shows. The AI chat widget captured 37 leads while the team slept. 18 converted. $15K recovered annually from rebooking workflows that reactivated 23 dormant clients who would have been forgotten. The owner now gets a morning email showing exactly what is happening that day. Entire business visible in one place.',
        keyTakeaways: [
            'Build bidirectional sync when clients cannot abandon existing tools. Housecall Pro stayed, but GoHighLevel became the brain.',
            'Automate the communication cascade. Confirmations at 48 hours, 24 hours, and morning of eliminate no shows.',
            'Deploy AI chat widgets for after hours lead capture. 37 leads captured, 18 converted while the team slept.',
            'Run rebooking workflows based on service frequency. Weekly, bi weekly, monthly triggers prevent revenue leakage.',
            'Send review requests 2 hours post completion with service specific messaging. Timing matters.',
        ],

        // ===== SETTINGS =====
        status: 'draft',
        category: 'AI Operations',
        industry: 'contractor',
        servicesUsed: ['ai-operations', 'ai-automations', 'ai-lead-generation'],
        featured: false,
        priority: 7,
        timeframe: 30,
        publishedAt: '2026-03-08T00:00:00Z',

        seo: {
            metaTitle: 'Field Service Operations Rebuild with GHL | RSL/A',
            metaDescription:
                'How a cleaning company consolidated 4 systems into GoHighLevel with Housecall Pro sync, eliminating 2 admin positions and recovering $15K in revenue.',
            keywords: [
                'gohighlevel operations',
                'housecall pro integration',
                'field service automation',
                'cleaning business crm',
                'operations consolidation',
                'service business automation',
                'ghl make.com integration',
            ],
        },

        faqSchema: [
            {
                _key: key(),
                question: 'Can GoHighLevel integrate with Housecall Pro?',
                answer: 'Yes, through custom API integration via Make.com. We built bidirectional sync so jobs scheduled in Housecall Pro automatically create opportunities in GoHighLevel, and customer data stays in lockstep across both systems.',
            },
            {
                _key: key(),
                question: 'How did automation eliminate 2 employee positions?',
                answer: 'The 2 employees were hired specifically to answer phones and send confirmation texts. Automated confirmations, an AI chat widget, and smart workflows handled all of that work. The employees were redeployed to fieldwork, increasing service capacity.',
            },
            {
                _key: key(),
                question: 'How did the system recover $15K in revenue?',
                answer: 'Automated rebooking workflows triggered by service frequency (weekly, bi weekly, monthly) reactivated 23 dormant clients who would have been forgotten without the system. Those clients represented $15K in annual recurring revenue.',
            },
            {
                _key: key(),
                question: 'What does the AI chat widget do?',
                answer: 'The AI chat widget answers frequently asked questions, books estimates, and qualifies leads 24/7 including nights and weekends. In 60 days it captured 37 leads and converted 18 of them while the team was off the clock.',
            },
            {
                _key: key(),
                question: 'How long did the operations rebuild take?',
                answer: 'About 30 days from start to full go live. That includes data migration, Housecall Pro integration, workflow setup, AI chat deployment, and team training.',
            },
        ],

        // ===== BODY CONTENT =====
        content: [
            // --- Section 1: The Problem ---
            block('50+ clients, 4 systems, zero visibility', 'h2'),

            richBlock([
                { text: 'The cleaning company had grown to 50+ recurring clients, and their operations were collapsing under the weight. Housecall Pro for scheduling. Google Sheets for customer notes. Manual texts for follow ups. Email for invoicing. The owner was burning ' },
                { text: '20+ hours weekly', bold: true },
                { text: ' on admin tasks. They had hired 2 full time employees just to answer phones and send confirmation texts.' },
            ]),

            {
                _type: 'callout',
                _key: key(),
                type: 'info',
                title: 'The hidden cost of fragmentation',
                content:
                    'When customer data lives in 4+ systems, every interaction requires context switching. Staff waste hours hunting for information, customers get inconsistent experiences, and revenue leaks through the cracks of disconnected workflows.',
            },

            block('The operational bleeding:', 'h3'),

            bullet([
                { text: 'Customer data fragmented across 4 systems: ', bold: true },
                { text: 'no single source of truth for history, preferences, or communications' },
            ]),
            bullet([
                { text: 'Manual follow up workflows: ', bold: true },
                { text: 'employees typing the same confirmation texts hundreds of times monthly' },
            ]),
            bullet([
                { text: 'Weekly double bookings: ', bold: true },
                { text: 'scheduling not synced with communication, conflicts guaranteed' },
            ]),
            bullet([
                { text: 'Revenue leaking everywhere: ', bold: true },
                { text: 'no automated upsell, rebooking, or dormant client reactivation' },
            ]),

            block(
                'Scattered operations do not just waste time. They create blind spots that cost you customers. Every disconnected system is a leak in your revenue pipeline. You cannot fix what you cannot see.'
            ),

            // --- Section 2: The Build ---
            block('GoHighLevel as central command', 'h2'),

            richBlock([
                { text: 'We rebuilt their entire operations infrastructure in GoHighLevel, creating a ' },
                { text: 'single source of truth', bold: true },
                { text: ' for all customer interactions, scheduling, and communications. Critical constraint: they needed to keep Housecall Pro for scheduling. So we engineered bidirectional sync so both systems stayed in lockstep.' },
            ]),

            {
                _type: 'callout',
                _key: key(),
                type: 'tip',
                title: 'Why bidirectional sync matters',
                content:
                    'Most integrations are one way. Jobs created in Housecall Pro appear in GHL, but not vice versa. We built true bidirectional sync so the team can work from either system without data drift.',
            },

            // Phase 1
            block('Phase 1: Housecall Pro integration and data migration', 'h3'),

            bullet([
                { text: 'Custom API integration ', bold: true },
                { text: 'between Housecall Pro and GoHighLevel using Make.com' },
            ]),
            bullet([
                { text: 'Migrated all customer data, ', bold: true },
                { text: 'job history, and notes into unified GoHighLevel contacts' },
            ]),
            bullet([
                { text: 'Bidirectional sync: ', bold: true },
                { text: 'jobs scheduled in Housecall Pro automatically create opportunities in GHL' },
            ]),
            bullet([
                { text: 'Custom fields ', bold: true },
                { text: 'tracking service type, frequency, property size, and preferences' },
            ]),

            // Phase 2
            block('Phase 2: AI powered communication workflows', 'h3'),

            block(
                'This is where the admin workload disappeared. Every repetitive communication task got automated.'
            ),

            bullet([
                { text: 'Automated appointment confirmations: ', bold: true },
                { text: 'SMS and email at 48 hours, 24 hours, and morning of' },
            ]),
            bullet([
                { text: 'AI personalized review requests: ', bold: true },
                { text: 'sent 2 hours post completion with service specific messaging' },
            ]),
            bullet([
                { text: 'Smart rebooking sequences: ', bold: true },
                { text: 'workflows triggered by service frequency (weekly, bi weekly, monthly)' },
            ]),
            bullet([
                { text: '24/7 AI chat widget: ', bold: true },
                { text: 'answers FAQs, books estimates, qualifies leads while the team sleeps' },
            ]),
            bullet([
                { text: 'Emergency request handling: ', bold: true },
                { text: 'after hours inquiries get instant responses with next available slots' },
            ]),

            // Phase 3
            block('Phase 3: Operational command dashboard', 'h3'),

            block(
                'The owner went from managing chaos across 4 apps to seeing everything in one place.'
            ),

            bullet([
                { text: 'Custom pipeline views: ', bold: true },
                { text: 'new leads, active jobs, follow ups, recurring clients' },
            ]),
            bullet([
                { text: 'Daily digest emails: ', bold: true },
                { text: 'jobs scheduled, completions, review scores, revenue at a glance' },
            ]),
            bullet([
                { text: 'Automated reporting: ', bold: true },
                { text: 'customer lifetime value, rebooking rates, service profitability' },
            ]),
            bullet([
                { text: 'Team task automation: ', bold: true },
                { text: 'quality checks and special requests routed automatically' },
            ]),

            // Tech Stack
            {
                _type: 'techStack',
                _key: key(),
                tools: [
                    {
                        _key: key(),
                        name: 'GoHighLevel',
                        url: 'https://www.gohighlevel.com/?fp_ref=rahul-lalia',
                        promo: 'CRM, automations, review requests, AI chat',
                    },
                    {
                        _key: key(),
                        name: 'Housecall Pro',
                        url: 'https://www.housecallpro.com/',
                    },
                    {
                        _key: key(),
                        name: 'Make.com',
                        url: 'https://www.make.com/en/register?pc=lalia',
                        promo: 'Bidirectional API sync',
                    },
                    {
                        _key: key(),
                        name: 'Retell AI',
                        url: 'https://www.retellai.com/',
                        promo: '24/7 AI chat widget',
                    },
                ],
            },

            // --- Section 3: What Changed ---
            block('What changed', 'h2'),

            {
                _type: 'statsCard',
                _key: key(),
                stats: [
                    { _key: key(), value: '100%', label: 'Ops Consolidated' },
                    { _key: key(), value: '2', label: 'Positions Redeployed' },
                    { _key: key(), value: '99%', label: 'Confirmation Rate' },
                    { _key: key(), value: '$15K', label: 'Revenue Recovered' },
                ],
            },

            block('Within 60 days of go live, the transformation was complete.'),

            block('Operations', 'h3'),

            richBlock([
                { text: '100% consolidated. ', bold: true },
                { text: 'All customer data, communications, and workflows in one system. No more hunting across 4 apps for a customer\'s service history or contact preferences.' },
            ]),

            block('Staffing', 'h3'),

            richBlock([
                { text: '2 employees redeployed to fieldwork. ', bold: true },
                { text: 'The admin positions were eliminated because the automation handles confirmations, follow ups, and lead capture. Service capacity went up because those same people are now cleaning, not texting.' },
            ]),

            block('No shows', 'h3'),

            richBlock([
                { text: '99% appointment confirmation rate. ', bold: true },
                { text: 'Automated reminders at 48 hours, 24 hours, and morning of virtually eliminated no shows. Before, the team was manually texting every client. Now it happens automatically.' },
            ]),

            block('Lead capture', 'h3'),

            richBlock([
                { text: 'AI chat widget captured 37 leads while the team slept. ', bold: true },
                { text: '18 of those converted into paying customers. The widget answers FAQs, books estimates, and qualifies leads 24/7. Nobody had to be awake for any of it.' },
            ]),

            block('Revenue recovery', 'h3'),

            richBlock([
                { text: '$15K recovered annually ', bold: true },
                { text: 'from rebooking workflows that reactivated 23 dormant clients. These were customers who had used the service before but stopped booking. Without the automation, they would have been forgotten.' },
            ]),

            {
                _type: 'callout',
                _key: key(),
                type: 'success',
                title: 'The compound effect',
                content:
                    'The right operations platform does not just save time. It unlocks revenue you did not know was leaking. Automated rebooking recovered 23 dormant clients. Review automation built social proof. AI chat captured leads 24/7. Each piece compounds the others.',
            },

            {
                _type: 'testimonial',
                _key: key(),
                quote: 'We went from needing 2 people just to answer phones and schedule jobs to having everything run automatically. I get a morning email showing exactly what is happening that day, and I can see our entire business in one place. The AI chat even books estimates while I am sleeping. This paid for itself in the first month.',
                author: 'Owner',
                role: 'White Glove Cleaning',
            },

            // --- Section 4: Who This Works For ---
            block('Who this works for', 'h2'),

            block(
                'Any service business running operations across multiple disconnected platforms:'
            ),

            bullet([
                { text: 'Cleaning companies ', bold: true },
                { text: 'managing recurring schedules across multiple tools' },
            ]),
            bullet([
                { text: 'Contractors and home services ', bold: true },
                { text: 'using Housecall Pro, Jobber, or ServiceTitan alongside a CRM' },
            ]),
            bullet([
                { text: 'Field service businesses ', bold: true },
                { text: 'where confirmation texts and rebooking drive revenue' },
            ]),
            bullet([
                { text: 'Any business ', bold: true },
                { text: 'that hired admin staff to do work that should be automated' },
            ]),

            block(
                'If you are managing your business across multiple platforms, you are paying for inefficiency you cannot even see. The cost is not just wasted time. It is lost clients, missed rebookings, and leads that went cold while you were context switching.'
            ),

            // CTA
            {
                _type: 'ctaButton',
                _key: key(),
                text: 'Consolidate Your Operations',
                url: '/#contact',
                style: 'primary',
            },
        ],
    };

    console.log('Creating Field Service Operations case study (V2)...');
    await client.createOrReplace(document);
    console.log(`Done. Document created: ${DOC_ID}`);
    console.log(`Total content blocks: ${document.content.length}`);
}

run().catch((e) => {
    console.error(e.message);
    process.exit(1);
});
