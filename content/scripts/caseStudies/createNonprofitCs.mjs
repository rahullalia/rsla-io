import { createClient } from '@sanity/client';
import { createReadStream } from 'fs';

const client = createClient({
    projectId: 'yz25oyux',
    dataset: 'production',
    token: process.env.SANITY_API_TOKEN_V2,
    apiVersion: '2025-03-01',
    useCdn: false,
});

const DOC_ID = 'drafts.cs-nonprofit-volunteer-automation';

let keyCounter = 0;
const key = () => `np${String(++keyCounter).padStart(3, '0')}`;

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
    // ===== Upload images =====
    console.log('Uploading workflow screenshot...');
    const workflowAsset = await client.assets.upload(
        'image',
        createReadStream('/Users/rahullalia/Downloads/Non Profit Images/workflow.jpg'),
        { filename: 'nonprofit-ghl-workflow.jpg' }
    );
    console.log(`  Workflow: ${workflowAsset._id}`);

    console.log('Uploading contacts list screenshot...');
    const contactsAsset = await client.assets.upload(
        'image',
        createReadStream('/Users/rahullalia/Downloads/Non Profit Images/contacts list.jpg'),
        { filename: 'nonprofit-contacts-list.jpg' }
    );
    console.log(`  Contacts: ${contactsAsset._id}`);

    console.log('Uploading contact count screenshot...');
    const countAsset = await client.assets.upload(
        'image',
        createReadStream('/Users/rahullalia/Downloads/Non Profit Images/number of contacts.jpg'),
        { filename: 'nonprofit-contact-count.jpg' }
    );
    console.log(`  Count: ${countAsset._id}`);

    // ===== Build document =====
    const document = {
        _id: DOC_ID,
        _type: 'caseStudyV2',

        // STORY
        title: 'Automated Volunteer Onboarding Replaces $40K Coordinator Role',
        slug: { _type: 'slug', current: 'nonprofit-crm-volunteer-automation' },
        clientName: 'International Nonprofit (Confidential)',
        tag: 'Nonprofit CRM & Automation',
        description:
            'An international nonprofit lost their volunteer coordinator. We built a GoHighLevel CRM with automated onboarding in under a week. 3,600+ volunteers managed automatically. $40K annual role eliminated.',
        tldr: 'The person who ran the entire volunteer operation left. Signups piled up with no follow-up. We built a GoHighLevel CRM in under a week that handles signups, onboarding, tagging, communications, and emergency mobilization automatically. 3,600+ volunteers, zero manual coordination, $40K annual role replaced.',
        pullQuote:
            'One week of setup replaced a $40K annual role. 3,600+ volunteers onboarded and managed without a coordinator.',

        // PROOF
        metrics: [
            { _key: key(), value: '$40K', label: 'Annual Cost Eliminated' },
            { _key: key(), value: '3,600+', label: 'Volunteers Managed' },
            { _key: key(), value: '5 days', label: 'Build Time' },
            { _key: key(), value: '100%', label: 'Onboarding Automated' },
        ],
        beforeAfter: {
            before: 'One person handled all volunteer coordination manually. When they left, signups sat in limbo. Some volunteers got onboarding calls, others heard nothing for weeks. No system, no consistency, no way to mobilize fast.',
            after: 'Every signup gets an instant response. Automated tagging by country, state, and occupation. Welcome email, SMS, and internal notification fire automatically. Emergency mobilization takes seconds, not hours.',
        },
        problemStatement:
            'The person who ran the entire volunteer operation at an international nonprofit left the organization. Signups, onboarding, communications, document collection, ongoing coordination. One person had handled all of it. And when they walked out the door, so did the process. New signups were piling up with no follow-up. Some volunteers got onboarding calls. Others heard nothing for weeks. The inconsistency was not just inefficient. It was costing the organization people who genuinely wanted to help. When someone who cares enough to sign up as a volunteer gets no response, you are not just losing a name on a list. You are losing someone who wanted to give their time to your cause.',
        solutionApproach:
            'We built the entire system in GoHighLevel in under a week. A signup form on their existing WordPress website feeds directly into the CRM. The moment someone submits, the system creates a contact, tags them by country, state, and occupation, sends a welcome email and SMS, and notifies the internal team. A follow-up sequence guides the volunteer to schedule their onboarding call. After the call, required documents are sent automatically. Smart lists separate volunteers by status (signed up, onboarded, active) and location, making emergency mobilization instant.',
        resultsOutcome:
            'The system replaced the full-time volunteer coordinator role. That is $40,000 per year redirected from admin overhead back to the mission. 3,600+ volunteers are managed automatically. Every signup gets a response within minutes. Every record stays current. When the organization needs to mobilize volunteers in a specific city, they filter by location and send a mass text in under 30 seconds.',
        keyTakeaways: [
            'Automate the first response so no volunteer signup goes unanswered',
            'Tag contacts by location and skills at signup for instant mobilization later',
            'Separate the human touchpoint (onboarding call) from the logistics (everything else)',
            'Use smart lists to give leadership a real-time view of volunteer pipeline health',
            'Build on existing tools (WordPress + CRM) instead of introducing new platforms',
        ],
        annualSavings: 40000,

        // SETTINGS
        status: 'draft',
        category: 'AI Automations',
        industry: 'nonprofit',
        servicesUsed: ['ai-automations', 'ai-operations'],
        featured: true,
        priority: 4,
        timeframe: 5,
        publishedAt: '2026-03-08T00:00:00Z',

        seo: {
            metaTitle: 'Automated Volunteer Onboarding Replaces $40K Role | RSL/A',
            metaDescription:
                'How a GoHighLevel CRM replaced a $40K volunteer coordinator role in under a week. 3,600+ volunteers managed automatically.',
            keywords: [
                'nonprofit CRM automation',
                'volunteer onboarding automation',
                'GoHighLevel nonprofit',
                'volunteer management system',
                'nonprofit operations automation',
                'CRM for nonprofits',
                'volunteer coordinator replacement',
            ],
        },

        faqSchema: [
            {
                _key: key(),
                question: 'How did automation replace a volunteer coordinator?',
                answer: 'A GoHighLevel CRM handles signups, onboarding communications, tagging, document collection, and emergency mobilization automatically. The only manual step is the onboarding call itself, which a senior team member handles.',
            },
            {
                _key: key(),
                question: 'How long did it take to build the volunteer CRM?',
                answer: 'Under a week. The system was built in GoHighLevel and connected to the existing WordPress website. No complex tech stack or multi-month implementation.',
            },
            {
                _key: key(),
                question: 'How does the emergency mobilization work?',
                answer: 'Volunteers are tagged by country, state, and occupation at signup. When the organization needs people in a specific area, they filter by location and send a mass text in under 30 seconds. Responses come back into the same CRM.',
            },
            {
                _key: key(),
                question: 'How many volunteers does this system manage?',
                answer: 'Over 3,600 volunteers across multiple countries. The system handles signups, onboarding sequences, status tracking, and location-based mobilization for all of them automatically.',
            },
            {
                _key: key(),
                question: 'Can this work for other nonprofits?',
                answer: 'Yes. Any organization that onboards volunteers, members, or participants through a repeatable process can use this framework. The key is automating the logistics while keeping the human connection for the moments that matter.',
            },
        ],

        // BODY CONTENT
        content: [
            // === Section 1: The Problem ===
            block('Volunteer manager gone, no system left behind', 'h2'),

            block(
                'The person who ran the entire volunteer operation left the organization. Signups, onboarding, communications, document collection, ongoing coordination. One person had handled all of it. And when they walked out the door, so did the process.'
            ),

            richBlock([
                { text: 'The work landed on someone already stretched thin. New signups were piling up with ' },
                { text: 'no follow-up', bold: true },
                { text: '. Some volunteers got onboarding calls. Others heard nothing for weeks. The inconsistency was not just inefficient. It was costing the organization people who genuinely wanted to help.' },
            ]),

            {
                _type: 'callout',
                _key: key(),
                type: 'info',
                title: 'The hidden cost',
                content:
                    'When a volunteer signs up and hears nothing for two weeks, they move on. Nonprofit volunteer retention depends heavily on that first interaction. A slow or nonexistent onboarding process silently kills your pipeline.',
            },

            block('What the breakdown looked like', 'h3'),

            bullet([{ text: 'No automated follow-up: ', bold: true }, { text: 'Signups sat in limbo waiting for someone to manually reach out' }]),
            bullet([{ text: 'Inconsistent onboarding: ', bold: true }, { text: 'Some volunteers got the full welcome, others got forgotten' }]),
            bullet([{ text: 'Scattered contact data: ', bold: true }, { text: 'No single place to see who signed up, who completed onboarding, or where they were located' }]),
            bullet([{ text: 'No way to mobilize fast: ', bold: true }, { text: 'When the org needed volunteers in a specific city, it meant hours of digging through lists' }]),

            {
                _type: 'testimonial',
                _key: key(),
                quote: 'When someone who cares enough to sign up as a volunteer gets no response, you are not just losing a name on a list. You are losing someone who wanted to give their time to your cause.',
                author: 'Rahul Lalia',
                role: 'RSL/A',
            },

            // === Section 2: The Solution ===
            block('One CRM, one week, zero manual work', 'h2'),

            richBlock([
                { text: 'We built the entire system in ' },
                { text: 'GoHighLevel', bold: true },
                { text: ' in under a week. No complex tech stack. No multi-month implementation. A CRM, an automated pipeline, and a form on their website.' },
            ]),

            block('This is an international nonprofit based in New York City, affiliated with the United Nations. They operate across multiple countries with thousands of volunteers. The system needed to handle that scale from day one.'),

            block('Step 1: Signup form on the website', 'h3'),

            block(
                'The nonprofit already had a WordPress website with traffic. We installed a signup form directly on the site so volunteers could register without being sent to a separate platform. Name, location, profession, availability, and a notes field. Everything flows straight into the CRM.'
            ),

            block('Step 2: Automated onboarding sequence', 'h3'),

            block('The moment someone submits the form, the system takes over.'),

            bullet([{ text: 'Contact created: ', bold: true }, { text: 'Form submission creates a CRM record and tags them as a registered volunteer' }]),
            bullet([{ text: 'Auto-tagging: ', bold: true }, { text: 'Country, state, and occupation tags are applied automatically from form data' }]),
            bullet([{ text: 'Welcome email + SMS: ', bold: true }, { text: 'Immediate messages confirming their signup and introducing the organization' }]),
            bullet([{ text: 'Internal notification: ', bold: true }, { text: 'The team gets alerted so a senior member can prepare for the onboarding call' }]),
            bullet([{ text: 'Onboarding call booking: ', bold: true }, { text: 'Follow-up sequence guides the volunteer to schedule their welcome call' }]),
            bullet([{ text: 'Post-call paperwork: ', bold: true }, { text: 'After the call, required documents are sent automatically' }]),

            richBlock([
                { text: 'The senior member just shows up to the call. Everything before and after it is ' },
                { text: 'handled by the system', bold: true },
                { text: '.' },
            ]),

            // Workflow image
            {
                _type: 'caseStudyImage',
                _key: key(),
                asset: {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: workflowAsset._id },
                },
                alt: 'GoHighLevel onboarding workflow: form, contact creation, tagging, welcome email, SMS, notification',
                caption:
                    'The full onboarding workflow. Form submission triggers contact creation, tagging by country, state, and occupation, then fires a welcome email, SMS, and internal notification.',
                size: 'full',
            },

            {
                _type: 'callout',
                _key: key(),
                type: 'tip',
                title: 'Why this works',
                content:
                    'The volunteer does not feel like they are talking to a machine. They get timely, relevant messages that guide them through a real onboarding process. The automation handles the logistics. The human connection happens on the call.',
            },

            block('Step 3: CRM tracking and smart lists', 'h3'),

            block('Inside GoHighLevel, every volunteer is tagged and tracked by status.'),

            bullet([{ text: 'Just signed up: ', bold: true }, { text: 'Submitted the form, onboarding sequence in progress' }]),
            bullet([{ text: 'Onboarded: ', bold: true }, { text: 'Completed the welcome call and paperwork' }]),
            bullet([{ text: 'Active: ', bold: true }, { text: 'Available and ready to be deployed' }]),
            bullet([{ text: 'Location and profession: ', bold: true }, { text: 'Searchable fields for fast filtering' }]),

            block(
                'Smart lists separate these stages automatically. The team sees a clean dashboard instead of a messy spreadsheet. One glance shows how many volunteers are in the pipeline, how many are fully onboarded, and where they are located.'
            ),

            // Contact count image
            {
                _type: 'caseStudyImage',
                _key: key(),
                asset: {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: countAsset._id },
                },
                alt: 'GoHighLevel CRM showing 3,643 total contacts with Active and Registered Volunteer smart list tabs',
                caption:
                    '3,643 contacts organized by smart lists. One tab for active volunteers, another for registered signups.',
                size: 'medium',
            },

            block('Step 4: Emergency mobilization', 'h3'),

            richBlock([
                { text: 'This is where the CRM pays for itself ten times over. When the organization needs to mobilize volunteers for a project or emergency in a specific area, the process takes ' },
                { text: 'seconds', bold: true },
                { text: '.' },
            ]),

            bullet([{ text: 'Filter by city or region' }]),
            bullet([{ text: 'Select all matching volunteers' }]),
            bullet([{ text: 'Send a mass text asking for availability' }]),
            bullet([{ text: 'Responses come back into the same CRM' }]),

            block(
                'What used to require hours of combing through spreadsheets and making phone calls now happens with a few clicks. The right people, in the right location, contacted instantly.'
            ),

            // Contacts list image
            {
                _type: 'caseStudyImage',
                _key: key(),
                asset: {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: contactsAsset._id },
                },
                alt: 'GoHighLevel CRM volunteer database with smart list tabs and filterable columns for location and role',
                caption:
                    'The full volunteer database. Smart list tabs across the top, filterable columns for city, state, occupation, and more.',
                size: 'full',
            },

            {
                _type: 'testimonial',
                _key: key(),
                quote: 'The best system is the one your team actually uses. If it requires training manuals and weekly check-ins to maintain, it is already failing. This one runs itself.',
                author: 'Rahul Lalia',
                role: 'RSL/A',
            },

            // === Section 3: The Results ===
            block('$40K role replaced in under a week', 'h2'),

            {
                _type: 'statsCard',
                _key: key(),
                stats: [
                    { _key: key(), value: '$40K', label: 'Annual Cost Eliminated' },
                    { _key: key(), value: '3,600+', label: 'Volunteers Managed' },
                    { _key: key(), value: '5 days', label: 'Build Time' },
                    { _key: key(), value: '100%', label: 'Onboarding Automated' },
                ],
            },

            richBlock([
                { text: 'The system replaced the full-time volunteer coordinator role. That is ' },
                { text: '$40,000 per year', bold: true },
                { text: ' redirected from admin overhead back to the mission.' },
            ]),

            block(
                'But the real impact is consistency. A person gets sick, takes vacation, gets overwhelmed, or quits. The system does not. Every volunteer gets the same onboarding experience. Every signup gets a response within minutes. Every record stays current.'
            ),

            bullet([{ text: 'Response time: ', bold: true }, { text: 'Minutes instead of days or weeks' }]),
            bullet([{ text: 'Onboarding consistency: ', bold: true }, { text: '100% of signups receive the same sequence, no one falls through the cracks' }]),
            bullet([{ text: 'Emergency deployment: ', bold: true }, { text: 'Filter and contact volunteers by location in under 30 seconds' }]),
            bullet([{ text: 'Data accuracy: ', bold: true }, { text: 'One source of truth for every volunteer record, status, and interaction' }]),

            {
                _type: 'callout',
                _key: key(),
                type: 'success',
                title: 'The bottom line',
                content:
                    'A week of setup replaced a $40K annual role. The system handles signups, onboarding, communications, and mobilization automatically. The nonprofit gets a more reliable operation and their budget goes further.',
            },

            // Tech Stack
            {
                _type: 'techStack',
                _key: key(),
                tools: [
                    {
                        _key: key(),
                        name: 'GoHighLevel CRM',
                        url: 'https://www.gohighlevel.com/?fp_ref=rahul-lalia',
                    },
                    {
                        _key: key(),
                        name: 'WordPress (existing website)',
                    },
                    {
                        _key: key(),
                        name: 'SMS Automation',
                    },
                    {
                        _key: key(),
                        name: 'Email Sequences',
                    },
                    {
                        _key: key(),
                        name: 'Smart Lists & Filtering',
                    },
                ],
            },

            // === Section 4: CTA ===
            block('Your team is doing work a system should handle', 'h2'),

            block(
                'If someone on your team spends hours on repetitive coordination, follow-ups, or data entry, that is time and money a simple system could save. We build CRM infrastructure that runs your operations without adding headcount.'
            ),

            {
                _type: 'ctaButton',
                _key: key(),
                text: 'See What You Can Automate',
                url: '/#contact',
                style: 'primary',
            },
        ],
    };

    console.log('Creating nonprofit case study...');
    await client.createOrReplace(document);
    console.log(`Done. Document created: ${DOC_ID}`);
    console.log(`Total content blocks: ${document.content.length}`);
}

run().catch((e) => {
    console.error(e.message);
    process.exit(1);
});
