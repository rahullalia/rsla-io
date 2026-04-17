import { createClient } from '@sanity/client';
import { createReadStream } from 'fs';

const client = createClient({
    projectId: 'yz25oyux',
    dataset: 'production',
    token: process.env.SANITY_API_TOKEN_V2,
    apiVersion: '2025-03-01',
    useCdn: false,
});

const DOC_ID = 'drafts.cs-ai-lead-autoresponder';

let keyCounter = 0;
const key = () => `ar${String(++keyCounter).padStart(3, '0')}`;

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
        createReadStream('/Users/rahullalia/Downloads/remaining/Auto-Responder/Auto Responder.png'),
        { filename: 'ai-autoresponder-featured.png' }
    );
    console.log(`  Featured: ${featuredAsset._id}`);

    console.log('Uploading workflow screenshot...');
    const workflowAsset = await client.assets.upload(
        'image',
        createReadStream('/Users/rahullalia/Downloads/remaining/Auto-Responder/ss workflow.jpg'),
        { filename: 'ai-autoresponder-make-workflow.jpg' }
    );
    console.log(`  Workflow: ${workflowAsset._id}`);

    // ===== BUILD DOCUMENT =====
    const document = {
        _id: DOC_ID,
        _type: 'caseStudyV2',

        // ===== STORY =====
        title: 'AI Auto-Responder That Actually Reads Every Email',
        slug: { _type: 'slug', current: 'ai-lead-response-autoresponder' },
        clientName: 'RSL/A (Internal)',
        tag: 'AI Automation & Lead Capture',
        description:
            'We built an AI email auto-responder that reads every message, extracts the specific question, and crafts a personalized reply in 24 seconds. Runs 24/7. Includes a downloadable Make.com blueprint.',
        featuredImage: {
            _type: 'image',
            asset: { _type: 'reference', _ref: featuredAsset._id },
            alt: 'Case study: 24 second AI responses with zero leads lost',
        },
        tldr: 'Generic auto-replies say "we got your email." Ours says "we read your email about X, and here is what happens next." We built a Make.com automation with two GPT passes. First extracts the question and intent. Second generates a personalized response. A random delay makes it feel human. 24 seconds, 24/7, every lead gets a reply that references their actual message.',
        pullQuote:
            '"We got your message" vs. "We read your message about X." That gap is massive. One feels robotic. The other feels attentive.',

        // ===== PROOF =====
        metrics: [
            { _key: key(), value: '24 sec', label: 'Avg Response Time' },
            { _key: key(), value: '24/7', label: 'Availability' },
            { _key: key(), value: '100%', label: 'Personalized' },
            { _key: key(), value: '5 modules', label: 'Total Build' },
        ],
        beforeAfter: {
            before: '"Thank you for contacting us. We will respond within 24 to 48 business hours." Generic, robotic, forgettable. 35% of leads arrive outside business hours. Every hour of delay decreases conversion by 10%. Leads go cold while you sleep.',
            after: 'Every email gets a personalized reply in 24 seconds that references the sender\'s specific question, their industry, and what happens next. Runs 24/7 including nights, weekends, and holidays. Leads feel heard before a human even sees the message.',
        },
        problemStatement:
            '"Thank you for contacting us. We will respond within 24 to 48 business hours." You have sent that email. You know what it means: nobody read your message, you are in a queue, your problem is not a priority. Harvard Business Review found leads who receive a response within 5 minutes are 21X more likely to convert than those contacted 30 minutes later. But what about evenings? Weekends? Meetings? The lead does not care. They are already comparing competitors. 35% of web leads arrive outside business hours. Every hour of delay decreases conversion by 10%. And 60% of customers would rather wait for a human than receive a robotic auto reply. The impossible choice: respond instantly with generic garbage, or respond personally hours later.',
        solutionApproach:
            'We built a 5 module Make.com automation with two GPT passes. Module 1 watches the inbox via IMAP. Module 2 reads the email body and generates a personalized reply referencing the sender\'s specific question, industry, and situation. Module 3 extracts the sender\'s email address. Module 4 adds a random 30 to 90 second delay so the reply feels human, not instant. Module 5 sends the personalized reply. The dual AI approach means the first pass understands the question, the second pass crafts the response. That separation produces sharper, more relevant replies than a single prompt.',
        resultsOutcome:
            'Every email now gets a personalized reply in 24 seconds that references what the sender actually asked about. "Thanks for reaching out about GoHighLevel CRM for your dental practice. We have helped several multi location dental offices with their patient management. Someone from our team will reach out within 24 to 48 hours to discuss your 3 location setup." Same response time as a generic auto reply. Completely different perception. The random delay makes it feel considered, not automated. Leads feel heard. Response rates went up because people reply when they believe someone actually read their message.',
        keyTakeaways: [
            'Use two GPT passes: first extracts the question, second generates the response. Single prompts produce weaker output.',
            'Add a random 30 to 90 second delay. Instant replies scream bot. A slight pause feels like someone actually read the message.',
            'Reference specific details from their email. "Your 3 location dental practice" beats "your inquiry" every time.',
            'Run the automation 24/7 including weekends and holidays. 35% of leads arrive outside business hours.',
            'Feeling heard matters more than knowing whether a human or AI did the hearing.',
        ],

        // ===== SETTINGS =====
        status: 'draft',
        category: 'AI Automations',
        industry: 'agency',
        servicesUsed: ['ai-automations', 'ai-lead-generation'],
        featured: false,
        priority: 6,
        timeframe: 1,
        publishedAt: '2026-03-08T00:00:00Z',

        seo: {
            metaTitle: 'AI Email Auto-Responder in 24 Seconds | RSL/A',
            metaDescription:
                'How we built an AI auto-responder that reads every email and crafts personalized replies in 24 seconds using Make.com and GPT. Free blueprint included.',
            keywords: [
                'ai auto responder',
                'email autoresponder ai',
                'lead response automation',
                'make.com email automation',
                'ai email reply',
                'speed to lead',
                'personalized auto reply',
            ],
        },

        faqSchema: [
            {
                _key: key(),
                question: 'How fast does the AI auto-responder reply to emails?',
                answer: 'The system responds in about 24 seconds on average. A random 30 to 90 second delay is built in so the reply feels human and considered, not instant and robotic.',
            },
            {
                _key: key(),
                question: 'How does the AI personalize each reply?',
                answer: 'Two GPT passes. The first reads the email and extracts the core question, inquiry category, and urgency. The second generates a personalized response that references the sender\'s specific question, industry, and situation.',
            },
            {
                _key: key(),
                question: 'Does this work outside business hours?',
                answer: 'Yes. The automation runs 24/7 including nights, weekends, and holidays. Since 35% of web leads arrive outside business hours, this captures leads that would otherwise go cold.',
            },
            {
                _key: key(),
                question: 'What tools are needed to build this?',
                answer: 'Make.com for the automation workflow, a Gmail or IMAP email connection, and OpenAI GPT for the AI responses. The entire system is 5 modules. A free Make.com blueprint is included in this case study.',
            },
            {
                _key: key(),
                question: 'Do recipients know the reply is AI generated?',
                answer: 'The random delay and personalized content make it feel like a quick human response. Most recipients do not notice. And even when they suspect automation, the personalization shifts perception from "nobody read my email" to "someone paid attention to my question."',
            },
        ],

        // ===== BODY CONTENT =====
        content: [
            // --- Section 1: The Problem ---
            block('The auto-reply nobody reads', 'h2'),

            block(
                '"Thank you for contacting us. We will respond within 24 to 48 business hours."'
            ),

            block(
                'You have sent that email. And you have received it. We all know what it really means: nobody read your message, you are in a queue, and your problem is not a priority.'
            ),

            {
                _type: 'callout',
                _key: key(),
                type: 'info',
                title: 'The speed to lead research',
                content:
                    'Harvard Business Review found that leads who receive a response within 5 minutes are 21X more likely to convert than those contacted 30 minutes later. Every hour of delay decreases conversion by 10% (Drift).',
            },

            block('The numbers are brutal:', 'h3'),

            bullet([
                { text: '35% of web leads arrive outside business hours. ', bold: true },
                { text: 'Evenings, weekends, holidays.' },
            ]),
            bullet([
                { text: 'Every hour of delay decreases conversion by 10%. ', bold: true },
                { text: 'Your leads are cooling while you sleep.' },
            ]),
            bullet([
                { text: '60% of customers would rather wait for a human ', bold: true },
                { text: 'than receive a robotic auto reply (Zendesk).' },
            ]),

            block(
                'The impossible choice: respond instantly with generic garbage (and turn people off), or respond personally hours later (and lose hot leads). Most businesses pick one poison or the other.'
            ),

            block('We built a third option.'),

            // --- Section 2: The Build ---
            block('An AI that actually reads every email', 'h2'),

            block(
                'We built an email response system that does not just acknowledge receipt. It reads, analyzes, and personalizes every reply in real time. The AI extracts the sender\'s specific question, identifies their industry, and crafts a response that references what they actually asked about.'
            ),

            block(
                'The result: emails that feel human written, delivered in 24 seconds, 24/7.'
            ),

            block('How it works: 5 modules in Make.com', 'h3'),

            // Workflow screenshot
            {
                _type: 'caseStudyImage',
                _key: key(),
                asset: {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: workflowAsset._id },
                },
                alt: 'Make.com workflow with 5 modules: Watch Emails, Write Customized Reply via GPT, Extract Email Address via GPT, Sleep delay, Send Email',
                caption:
                    'The full automation. 5 modules. Watch inbox, GPT writes the reply, GPT extracts the sender, random delay, send.',
                size: 'large',
            },

            numbered([
                { text: 'Watch Emails: ', bold: true },
                { text: 'Make.com monitors the inbox continuously via IMAP or Gmail connection. Smart filtering targets contact form submissions and specific keywords.' },
            ]),
            numbered([
                { text: 'Write Customized Reply (GPT): ', bold: true },
                { text: 'This is the first AI pass. GPT reads the full email body, extracts the core question, identifies the inquiry type (sales, support, partnership), and generates a personalized response that references specific details from their message.' },
            ]),
            numbered([
                { text: 'Extract Email Address (GPT): ', bold: true },
                { text: 'The second AI pass pulls the sender\'s email address from the message headers. This ensures the reply goes to the right place even with forwarded or aliased messages.' },
            ]),
            numbered([
                { text: 'Sleep (Random Delay): ', bold: true },
                { text: 'This is the detail that makes it work. A random 30 to 90 second delay before sending. More on why below.' },
            ]),
            numbered([
                { text: 'Send Email: ', bold: true },
                { text: 'The personalized reply goes out. From the outside, it looks like someone quickly read the message and typed a thoughtful response.' },
            ]),

            block('Why the random delay matters', 'h3'),

            block(
                'Critical insight: instant replies (0 to 5 seconds) scream "bot." If someone emails you at 2 AM and gets a detailed reply in 3 seconds, they know it is automated. The magic is gone.'
            ),

            block(
                'We added a random 30 to 90 second delay before sending. That small pause changes everything.'
            ),

            bullet([
                { text: 'Feels more human: ', bold: true },
                { text: 'suggests someone actually read the message' },
            ]),
            bullet([
                { text: 'Creates perception of consideration: ', bold: true },
                { text: 'a 60 second delay implies thought, not automation' },
            ]),
            bullet([
                { text: 'Bypasses spam filters: ', bold: true },
                { text: 'slight delays reduce automated flagging' },
            ]),

            {
                _type: 'callout',
                _key: key(),
                type: 'tip',
                title: 'The psychology of timing',
                content:
                    'A 3 second reply says "bot." A 60 second reply says "someone read this quickly." A 4 hour reply says "you are not a priority." The sweet spot is 30 to 90 seconds. Fast enough to impress, slow enough to feel real.',
            },

            block('What makes the reply actually good', 'h3'),

            block(
                'The difference between a useful AI reply and a terrible one comes down to what it references. Generic auto replies mention nothing specific. Ours reference everything specific.'
            ),

            {
                _type: 'testimonial',
                _key: key(),
                quote: 'Hi {first_name}, I came across your profile and thought we could connect. We help companies like yours improve their marketing with AI automation. Would you be open to a quick chat?',
                author: 'Before: Generic Template',
                role: 'Same message to every lead',
            },

            {
                _type: 'testimonial',
                _key: key(),
                quote: 'Hi Sarah, thanks for reaching out about GoHighLevel CRM for your dental practice. We have helped several multi location dental offices with their patient management and appointment systems. Someone from our team will reach out within 24 to 48 hours to discuss your 3 location setup. Looking forward to connecting!',
                author: 'After: AI Personalized Reply',
                role: 'References her industry, service need, and company details',
            },

            block(
                'Same response time. Completely different perception. The first gets deleted. The second gets a reply.'
            ),

            block('Why it converts', 'h3'),

            bullet([
                { text: 'Specific acknowledgment: ', bold: true },
                { text: 'references "dental practice," "3 locations," "GoHighLevel"' },
            ]),
            bullet([
                { text: 'Relevant social proof: ', bold: true },
                { text: '"we have helped several dental offices" signals expertise' },
            ]),
            bullet([
                { text: 'Conversational cadence: ', bold: true },
                { text: 'reads like a human who quickly replied, not a template that fired' },
            ]),
            bullet([
                { text: 'Trust signal: ', bold: true },
                { text: 'the sender knows their message was actually read' },
            ]),

            // Tech Stack
            {
                _type: 'techStack',
                _key: key(),
                tools: [
                    {
                        _key: key(),
                        name: 'Make.com',
                        url: 'https://www.make.com/en/register?pc=lalia',
                        promo: 'Free tier available',
                    },
                    {
                        _key: key(),
                        name: 'Gmail / IMAP',
                        url: 'https://mail.google.com/',
                    },
                    {
                        _key: key(),
                        name: 'OpenAI GPT',
                        url: 'https://chatgpt.com/',
                    },
                ],
            },

            // Gated Resource
            {
                _type: 'gatedResource',
                _key: key(),
                title: 'Make.com Blueprint',
                description:
                    'Import this directly into Make.com and connect your email account. The entire 5 module automation, ready to run.',
                downloadUrl:
                    '/downloads/case-studies/email-autoresponder/blueprint.json',
                buttonText: 'Download the Blueprint',
            },

            // --- Section 3: What Changed ---
            block('What changed', 'h2'),

            {
                _type: 'statsCard',
                _key: key(),
                stats: [
                    { _key: key(), value: '24 sec', label: 'Avg Response Time' },
                    { _key: key(), value: '24/7', label: 'Availability' },
                    { _key: key(), value: '100%', label: 'Personalized' },
                    { _key: key(), value: '5 modules', label: 'Total Build' },
                ],
            },

            block(
                'Every email now gets a reply that references the sender\'s actual question. Not a template. Not a "we got your message." A response that proves someone (or something) actually read what they wrote.'
            ),

            block('The perception shift', 'h3'),

            block(
                'Here is the fascinating part: customers often know it is automated. But because it references their specific question, perception shifts entirely.'
            ),

            {
                _type: 'callout',
                _key: key(),
                type: 'success',
                title: 'The gap',
                content:
                    'Generic auto reply: "They did not read my email. I am just a number." Personalized auto reply: "Someone quickly read my message and sent a thoughtful response. They are paying attention." Feeling heard matters more than knowing whether a human or AI did the hearing.',
            },

            block('Speed to lead', 'h3'),

            block(
                'The inbox placement problem went away. Leads that used to sit for hours now get a personalized response in under a minute. At 2 AM on a Saturday, on a holiday, during a meeting. The system does not sleep.'
            ),

            block(
                '35% of web leads arrive outside business hours. Before this, those leads went cold. Now they get the same quality response at midnight as they would at noon.'
            ),

            {
                _type: 'testimonial',
                _key: key(),
                quote: '"We got your message" vs. "We read your message about X and here is what happens next." The gap is massive. One feels robotic. The other feels attentive. Attentiveness equals trust equals conversion. The AI makes it possible at scale.',
                author: 'Rahul Lalia',
                role: 'RSL/A',
            },

            // --- Section 4: Who This Works For ---
            block('Who this works for', 'h2'),

            block(
                'Any business that loses leads to slow response times:'
            ),

            bullet([
                { text: 'Service businesses ', bold: true },
                { text: 'losing evening and weekend leads to competitors who reply first' },
            ]),
            bullet([
                { text: 'Agencies and consultants ', bold: true },
                { text: 'who can not always reply immediately during client work' },
            ]),
            bullet([
                { text: 'Local businesses ', bold: true },
                { text: 'with after hours form submissions that sit until morning' },
            ]),
            bullet([
                { text: 'SaaS companies ', bold: true },
                { text: 'with demo requests and support tickets arriving 24/7' },
            ]),
            bullet([
                { text: 'Professional services ', bold: true },
                { text: 'where first response time directly impacts whether the prospect hires you' },
            ]),

            block(
                'If your leads sit in an inbox while you sleep, eat, or work on other things, this system fixes that in an afternoon.'
            ),

            // CTA
            {
                _type: 'ctaButton',
                _key: key(),
                text: 'Stop Losing Leads to Slow Replies',
                url: '/#contact',
                style: 'primary',
            },
        ],
    };

    console.log('Creating AI Auto-Responder case study (V2)...');
    await client.createOrReplace(document);
    console.log(`Done. Document created: ${DOC_ID}`);
    console.log(`Total content blocks: ${document.content.length}`);
}

run().catch((e) => {
    console.error(e.message);
    process.exit(1);
});
