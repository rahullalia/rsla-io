import { createClient } from '@sanity/client';

const client = createClient({
    projectId: 'yz25oyux',
    dataset: 'production',
    token: process.env.SANITY_API_TOKEN_V2,
    apiVersion: '2025-03-01',
    useCdn: false,
});

const DOC_ID = 'drafts.cs-cold-email-personalization';

let keyCounter = 0;
const key = () => `ce${String(++keyCounter).padStart(3, '0')}`;

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

const document = {
    _id: DOC_ID,
    _type: 'caseStudyV2',

    // ===== STORY =====
    title: 'How We Personalize 1,200 Cold Emails a Day with a 3-Step Automation',
    slug: { _type: 'slug', current: 'ai-cold-email-personalization' },
    clientName: 'RSL/A (Internal)',
    tag: 'AI Automation',
    description:
        'Our cold emails were landing in spam. We built a 90-minute Make.com automation that shortens company names and generates personalized icebreakers for 1,200+ emails a day.',
    tldr: 'We send 900 to 1,500 cold emails a day. Every one used to be identical. We built a Make.com automation in 90 minutes that pulls leads from a Google Sheet, uses GPT to shorten company names and write personalized icebreakers, and writes them back. Deliverability went up, spam flags went down, and prospects actually started replying.',
    pullQuote:
        '1,200 personalized emails a day. Built in 90 minutes. Cost per email: basically zero.',

    // ===== PROOF =====
    metrics: [
        { _key: key(), value: '1,200+', label: 'Emails Personalized/Day' },
        { _key: key(), value: '90 min', label: 'Total Build Time' },
        { _key: key(), value: '~$0', label: 'Per Email Cost' },
        { _key: key(), value: '6 days/wk', label: 'Runs Automatically' },
    ],
    beforeAfter: {
        before: 'Every cold email was identical. Same opener, same pitch, same forgettable intro. Spam filters caught them, prospects deleted them. Manually personalizing 1,200 emails a day would take 160 hours. Physically impossible.',
        after: 'Every email references something specific about the prospect. Their shortened company name, their role, their LinkedIn headline. Runs 6 days a week on autopilot. Deliverability improved, spam flags dropped, response rates went up.',
    },
    problemStatement:
        'We send between 900 and 1,500 cold emails a day. Monday through Saturday. At that volume, personalization was never an option. Every message went out with the same template, the same opening line, the same forgettable intro. Inbox placement tests told the story. Emails were landing in spam folders. Prospects never saw them. The ones that did get through looked exactly like what they were: mass outreach from a stranger. The math made it worse. Manually personalizing each email takes about 8 minutes. At 1,200 emails a day, that is 160 hours of research. Every single day. We were stuck between two bad options: send garbage at scale, or send quality to nobody.',
    solutionApproach:
        'We built a 3-module automation in Make.com in about 90 minutes. Step 1: pull leads from a Google Sheet (business name plus a one-liner). Step 2: GPT shortens the company name to sound casual ("ABC Limited" becomes just "ABC") and generates a personalized icebreaker using their info. Step 3: the shortened name and icebreaker write back to the same row. No new tools. No new dashboards. The icebreaker just appears in the column next to the lead, ready for the sending platform to pick up.',
    resultsOutcome:
        'Every cold email now references something specific about the prospect. Their shortened company name (like a friend would use it, not a formal pitch), their role, their situation. Deliverability improved because personalized emails look different to spam filters. Unique content in each message, specific references, natural language. Mailbox providers stopped flagging us. Response rates went up because people reply when they feel seen.',
    keyTakeaways: [
        'Personalize at scale by combining lead data with AI, not manual research',
        'Shorten company names to sound casual and familiar, not corporate',
        'Build the automation in your existing tools so nothing changes in your workflow',
        'Feed the AI specific data points for sharper output, not generic prompts',
        'Unique content per email improves deliverability as much as it improves replies',
    ],

    // ===== SETTINGS =====
    status: 'draft',
    category: 'AI Automations',
    industry: 'agency',
    servicesUsed: ['ai-automations'],
    featured: true,
    priority: 2,
    timeframe: 1,
    publishedAt: '2026-03-08T00:00:00Z',

    seo: {
        metaTitle: 'How We Personalize 1,200 Cold Emails a Day | RSL/A',
        metaDescription:
            'A 90-minute Make.com automation generates personalized icebreakers using GPT for 1,200+ cold emails daily. Free blueprint included.',
        keywords: [
            'cold email personalization',
            'AI icebreaker generator',
            'Make.com automation',
            'cold email deliverability',
            'GPT cold email',
            'email personalization at scale',
            'cold outreach automation',
        ],
    },

    faqSchema: [
        {
            _key: key(),
            question: 'How do you personalize 1,200 cold emails a day?',
            answer: 'We use a 3-step Make.com automation. It pulls leads from a Google Sheet, sends their data to GPT to shorten the company name and generate a personalized icebreaker, then writes the result back to the same sheet. The entire process runs automatically 6 days a week.',
        },
        {
            _key: key(),
            question: 'How long did it take to build this automation?',
            answer: 'About 90 minutes. The entire system is three modules in Make.com: read from Google Sheets, generate icebreaker with GPT, write back to Google Sheets.',
        },
        {
            _key: key(),
            question: 'What data do you need for the icebreaker to work?',
            answer: 'At minimum, a business name and a one-liner about what the company does. The more data you add (LinkedIn headline, company size, industry), the sharper the icebreaker gets.',
        },
        {
            _key: key(),
            question: 'Why shorten company names in cold emails?',
            answer: 'Calling a company "TechFlow" instead of "TechFlow Solutions LLC" makes the email feel casual and personal, like you actually know who you are writing to. It removes the corporate feel that signals mass outreach.',
        },
        {
            _key: key(),
            question: 'Does personalizing cold emails improve deliverability?',
            answer: 'Yes. Spam filters flag identical messages sent in bulk. When each email has unique content with specific references, mailbox providers treat them as individual messages rather than mass outreach.',
        },
    ],

    // ===== BODY CONTENT =====
    content: [
        // --- Section 1: The Problem ---
        block('Our cold emails were landing in spam', 'h2'),

        block(
            'We send between 900 and 1,500 cold emails a day. Monday through Saturday. At that volume, personalization was never an option. Every message went out with the same template, the same opening line, the same forgettable intro.'
        ),

        block(
            'The inbox placement tests told the story. Emails were landing in spam folders. Prospects never saw them. The ones that did get through looked exactly like what they were: mass outreach from a stranger.'
        ),

        {
            _type: 'callout',
            _key: key(),
            type: 'info',
            title: 'The math we were ignoring',
            content:
                'Manually personalizing each email takes about 8 minutes. LinkedIn research, company context, writing the icebreaker. At 1,200 emails a day, that is 160 hours of research. Every single day. We needed a third option.',
        },

        block(
            'We were stuck between two bad options. Send garbage at scale, or send quality to nobody.'
        ),
        block('So we built a system that does both.'),

        // --- Section 2: The Build ---
        block('A 3-step automation built in 90 minutes', 'h2'),

        block(
            'The entire system is three modules in Make.com. It reads from a Google Sheet, uses GPT to shorten the company name and generate a personalized icebreaker, and writes it back. That is it.'
        ),

        // Make.com workflow image (carried from V1)
        {
            _type: 'caseStudyImage',
            _key: key(),
            asset: {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: 'image-1e534f68862f3225411d8176ee780eae9e4bcedf-1316x527-jpg',
                },
            },
            alt: 'Make.com workflow with three modules: get leads, generate icebreaker with GPT, update Google Sheet',
            caption:
                'The full automation. Three modules. Google Sheets, GPT, Google Sheets.',
            size: 'large',
        },

        // Step 1
        block('Step 1: Pull leads from Google Sheets', 'h3'),

        block(
            'The scenario runs on a schedule, pulling every lead that does not have an icebreaker yet. Your sheet needs two things at minimum: a business name and a one-liner about what they do.'
        ),

        block(
            'Optional but helpful: LinkedIn headline, job title, company size, industry, recent posts, tech stack. Each additional data point makes the icebreaker sharper.'
        ),

        // Step 2
        block('Step 2: Shorten the name and generate the icebreaker', 'h3'),

        block('This is where it gets interesting. GPT does two things in one pass.'),

        block(
            'First, it shortens the company name. If someone works at "TechFlow Solutions LLC," the system just calls them "TechFlow." If it is "Anderson & Partners Consulting Group," it becomes "Anderson."'
        ),

        block(
            'Why? Because that is how you would actually say it in conversation. Nobody emails a friend and says "I was looking at Anderson & Partners Consulting Group." You say "I was looking at Anderson."'
        ),

        block(
            'That one small change makes the entire email feel less corporate. Less mass-produced. More like someone who actually knows who they are writing to.'
        ),

        block(
            'Second, it generates a one-liner icebreaker using whatever data you have on the lead. Their LinkedIn headline, their company description, their industry. The prompt tells GPT to reference something specific and connect it naturally to why you are reaching out.'
        ),

        {
            _type: 'callout',
            _key: key(),
            type: 'tip',
            title: 'The formula',
            content:
                'The icebreaker references something from their profile (a role, a stated priority, a company detail) and bridges to your value prop. It should read like you spent 5 minutes researching them. The AI does it in under a second.',
        },

        // Step 3
        block('Step 3: Write it back', 'h3'),

        block(
            'The generated icebreaker and shortened company name write back to the same Google Sheet row. Your sending platform picks it up from there. No exports, no imports, no copy-pasting.'
        ),

        block(
            'No new tools to learn. No new dashboards. The icebreaker just appears in the column next to the lead.'
        ),

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
                    name: 'Google Sheets',
                    url: 'https://docs.google.com/',
                },
                {
                    _key: key(),
                    name: 'OpenAI GPT',
                    url: 'https://chatgpt.com/',
                },
                {
                    _key: key(),
                    name: 'Apollo.io',
                    url: 'https://get.apollo.io/rslmh',
                },
                {
                    _key: key(),
                    name: 'Instantly',
                    url: 'https://instantly.ai/',
                },
            ],
        },

        // Gated Resource
        {
            _type: 'gatedResource',
            _key: key(),
            title: 'Make.com Blueprint',
            description:
                'Import this directly into Make.com and connect your Google Sheet. The entire 3-step scenario, ready to run.',
            downloadUrl:
                '/downloads/case-studies/email-ice-breaker/blueprint.json',
            buttonText: 'Download the Blueprint',
        },

        // --- Section 3: What Changed ---
        block('What changed', 'h2'),

        {
            _type: 'statsCard',
            _key: key(),
            stats: [
                { _key: key(), value: '1,200+', label: 'Emails Personalized/Day' },
                { _key: key(), value: '90 min', label: 'Total Build Time' },
                { _key: key(), value: '~$0', label: 'Per Email Cost' },
                { _key: key(), value: '6 days/wk', label: 'Runs Automatically' },
            ],
        },

        block(
            'Before this automation, every cold email was identical. The same opener, the same pitch, the same result: spam folder or delete.'
        ),

        block(
            'After: every email references something specific about the prospect. Their shortened company name (like a friend would use it, not a formal pitch), their role, their situation. It reads like someone actually looked them up before hitting send. Because technically, something did.'
        ),

        block('Deliverability', 'h3'),

        block(
            'The inbox placement problem largely went away. Personalized emails look different to spam filters. Unique content in each message, specific references, natural language. Mailbox providers stopped flagging us.'
        ),

        block('Response rates', 'h3'),

        block(
            'People reply when they feel seen. An email that mentions their actual company by its shortened name and references their actual role gets read differently than "Hi {first_name}, I noticed your company is growing."'
        ),

        block(
            'The response rate went up because the emails stopped looking like mass outreach.'
        ),

        block('The time equivalent', 'h3'),

        block(
            'If we had done this manually at 8 minutes per email across 1,200 emails a day, that is 160 hours of research. Every single day. The automation handles it in the background while we do actual work.'
        ),

        {
            _type: 'callout',
            _key: key(),
            type: 'success',
            title: 'The real win',
            content:
                'This is not about saving time on something we were already doing. We were not personalizing emails before because it was impossible at our volume. The automation made personalization possible for the first time. That is the difference.',
        },

        // Before/After Examples
        block('Before and after', 'h3'),

        {
            _type: 'testimonial',
            _key: key(),
            quote: 'Hi {first_name}, I came across your profile and thought we could connect. We help companies like yours improve their marketing with AI automation. Would you be open to a quick chat?',
            author: 'Before: Generic Template',
            role: 'Same message to every prospect',
        },

        {
            _type: 'testimonial',
            _key: key(),
            quote: 'Hi Sarah, saw TechFlow just closed the Series B. Hiring 4 SDRs is one way to hit that outbound target. We built a system for a similar stage SaaS company that personalized 1,200 emails a day without adding headcount. Happy to share the playbook if useful.',
            author: 'After: AI-Generated Icebreaker',
            role: 'References her LinkedIn activity, company stage, and hiring signals',
        },

        block(
            'Same prospect. Two completely different emails. The first gets deleted. The second gets a reply.'
        ),

        // --- Section 4: Who This Works For ---
        block('Who this works for', 'h2'),

        block(
            'Anyone sending cold emails who has hit the wall between quality and volume:'
        ),

        bullet([
            { text: 'B2B sales teams ', bold: true },
            { text: 'sending 50 to 5,000 emails a day' },
        ]),
        bullet([
            { text: 'Agencies ', bold: true },
            { text: 'running outbound for multiple clients' },
        ]),
        bullet([
            { text: 'Recruiters ', bold: true },
            { text: 'reaching out to passive candidates' },
        ]),
        bullet([
            { text: 'SaaS founders ', bold: true },
            { text: 'doing their own sales outreach' },
        ]),
        bullet([
            { text: 'Consultants ', bold: true },
            { text: 'building a pipeline without a sales team' },
        ]),

        block(
            'If you have a lead list in a spreadsheet and you are sending the same email to everyone on it, this system fixes that in 90 minutes.'
        ),

        // CTA
        {
            _type: 'ctaButton',
            _key: key(),
            text: 'Build Your Icebreaker System',
            url: '/#contact',
            style: 'primary',
        },
    ],
};

async function run() {
    console.log('Creating cold email case study (V2)...');
    await client.createOrReplace(document);
    console.log(`Done. Document created: ${DOC_ID}`);
    console.log(`Total content blocks: ${document.content.length}`);
}

run().catch((e) => {
    console.error(e.message);
    process.exit(1);
});
