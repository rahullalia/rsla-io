import { createClient } from '@sanity/client';
import { createReadStream } from 'fs';

const client = createClient({
    projectId: 'yz25oyux',
    dataset: 'production',
    token: process.env.SANITY_API_TOKEN_V2,
    apiVersion: '2025-03-01',
    useCdn: false,
});

const DOC_ID = 'drafts.cs-ai-proposal-generator';

let keyCounter = 0;
const key = () => `pg${String(++keyCounter).padStart(3, '0')}`;

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
    // ===== Upload images =====
    console.log('Uploading featured image...');
    const featuredAsset = await client.assets.upload(
        'image',
        createReadStream('/Users/rahullalia/Downloads/proposalss/AI Proposals.png'),
        { filename: 'proposal-featured.png' }
    );
    console.log(`  Featured: ${featuredAsset._id}`);

    console.log('Uploading workflow screenshot...');
    const workflowAsset = await client.assets.upload(
        'image',
        createReadStream('/Users/rahullalia/Downloads/proposalss/workflow.jpg'),
        { filename: 'proposal-make-workflow.jpg' }
    );
    console.log(`  Workflow: ${workflowAsset._id}`);

    console.log('Uploading typeform screenshot...');
    const typeformAsset = await client.assets.upload(
        'image',
        createReadStream('/Users/rahullalia/Downloads/proposalss/typeform.jpg'),
        { filename: 'proposal-typeform-cover.jpg' }
    );
    console.log(`  Typeform: ${typeformAsset._id}`);

    // ===== Build document =====
    const document = {
        _id: DOC_ID,
        _type: 'caseStudyV2',

        // STORY
        title: 'How We Cut Proposal Time from 2 Hours to 10 Minutes with AI',
        slug: { _type: 'slug', current: 'ai-proposal-generator-sales-workflow' },
        clientName: 'RSL/A (Internal)',
        tag: 'AI Automation & Workflow',
        description:
            'We were spending 1 to 3 hours per proposal obsessing over formatting and design. A Typeform + Make.com + Claude pipeline now generates branded proposals in about 10 minutes. 105 hours recovered annually.',
        featuredImage: {
            _type: 'image',
            asset: { _type: 'reference', _ref: featuredAsset._id },
            alt: 'Case study: 92% faster proposals using AI powered document automation',
        },
        tldr: 'Every proposal used to be a 2-hour production. Open a blank doc, rewrite the narrative, obsess over formatting, finally send it a day later. We built a Typeform + Make.com + Claude pipeline that generates branded, client-ready proposals in about 10 minutes. 105 hours recovered per year. Built the whole thing in 2 hours.',
        pullQuote:
            'From 2 hours to 10 minutes. 105 hours recovered annually. Break-even hit on the second proposal.',

        // PROOF
        metrics: [
            { _key: key(), value: '~10 min', label: 'Per Proposal' },
            { _key: key(), value: '105 hrs', label: 'Saved/Year' },
            { _key: key(), value: '92%', label: 'Time Reduction' },
            { _key: key(), value: '2 hrs', label: 'Build Time' },
        ],
        beforeAfter: {
            before: '1 to 3 hours per proposal. Duplicate an old doc, rewrite everything, obsess over margins and fonts, send it a day later. Inconsistent formatting. Momentum dying between discovery call and proposal delivery.',
            after: 'Fill a 7-minute Typeform after the call. Branded proposal lands in Google Docs automatically. Same design, same quality, every time. Prospects get it the same day.',
        },
        problemStatement:
            'We are a two-person agency. When a discovery call goes well, the last thing you want is a 3-hour formatting session standing between you and a signed deal. But that is exactly what was happening. Every proposal turned into a design project. Margins had to be perfect. Section headers had to be consistent. The narrative had to sound polished without being generic. At 1 to 3 hours per proposal and roughly 5 a month, that is anywhere from 5 to 15 hours of production time. Not strategy time. Not sales time. Document formatting time. The worst part was the delay. A prospect finishes a call feeling excited, and then waits a day or two for a proposal. Momentum dies.',
        solutionApproach:
            'We built a pipeline connecting Typeform, Make.com, Claude, and Google Docs. After every discovery call, we fill out a structured Typeform (about 7 minutes) capturing prospect info, the problem, our proposed solution, deliverables, timeline, and investment. Make.com watches for submissions and sends the structured data to Claude, which generates a proposal title, problem narrative, solution narrative, deliverables, and phased timeline as structured JSON. That JSON feeds into a branded Google Docs template. Same design, same margins, same section structure every time. The template handles design. AI handles content. They never interfere with each other.',
        resultsOutcome:
            'Proposal time dropped from 1 to 3 hours down to about 10 minutes. At roughly 5 proposals a month, that is 105 hours recovered annually. The build took 2 hours. Break-even hit on the second proposal. Beyond the time savings, proposals now go out the same day as the discovery call. Prospects get them while they are still excited. And every proposal looks identical in quality because the template handles design.',
        keyTakeaways: [
            'Structure your inputs with specific form fields instead of dumping notes into an LLM',
            'Separate the design layer (template) from the content layer (AI) so they never interfere',
            'Send proposals same-day to preserve the momentum from discovery calls',
            'Use JSON output from AI so it flows directly into templates without cleanup',
            'Start with 3 to 5 real proposals to tune the prompt before going fully live',
        ],

        // SETTINGS
        status: 'draft',
        category: 'AI Automations',
        industry: 'agency',
        servicesUsed: ['ai-automations', 'ai-operations'],
        featured: true,
        priority: 3,
        timeframe: 1,
        publishedAt: '2026-03-08T00:00:00Z',

        seo: {
            metaTitle: 'How We Cut Proposal Time from 2 Hours to 10 Minutes | RSL/A',
            metaDescription:
                'A Typeform + Make.com + Claude pipeline generates branded proposals in 10 minutes. 92% time reduction, 105 hours saved per year.',
            keywords: [
                'AI proposal generator',
                'automated proposals',
                'Make.com proposal automation',
                'Claude AI proposals',
                'Typeform automation',
                'sales proposal workflow',
                'document automation',
            ],
        },

        faqSchema: [
            {
                _key: key(),
                question: 'How does the AI proposal generator work?',
                answer: 'After a discovery call, you fill out a structured Typeform (about 7 minutes). Make.com sends the form data to Claude, which generates proposal content as structured JSON. That JSON populates a branded Google Docs template automatically.',
            },
            {
                _key: key(),
                question: 'How long does it take to generate a proposal?',
                answer: 'About 10 minutes total. 7 minutes to fill out the Typeform, and the automation generates the branded Google Doc within a minute or two after submission.',
            },
            {
                _key: key(),
                question: 'What AI model does the proposal generator use?',
                answer: 'We currently use Claude (Anthropic), though the AI model is swappable. The prompt engineering and structured inputs matter more than the specific model.',
            },
            {
                _key: key(),
                question: 'How much time does this save per year?',
                answer: 'At roughly 5 proposals a month and 1 to 3 hours saved per proposal, we recover about 105 hours annually. The system was built in 2 hours, so break-even hit on the second proposal.',
            },
            {
                _key: key(),
                question: 'Can I download the Make.com blueprint?',
                answer: 'Yes. The Make.com blueprint is available as a free download on this page. It connects Typeform to Claude and outputs structured proposal content that you can feed into any document template.',
            },
        ],

        // BODY CONTENT
        content: [
            // === Section 1: The Problem ===
            block('Every proposal was a production', 'h2'),

            block(
                'We are a two-person agency. When a discovery call goes well, the last thing you want is a 3-hour formatting session standing between you and a signed deal.'
            ),

            block(
                'But that is exactly what was happening. Every proposal turned into a design project. Margins had to be perfect. Section headers had to be consistent. The narrative had to sound polished without being generic. And because we care about how things look, we could not just slap text into a doc and send it.'
            ),

            block('The process looked something like this:'),

            numbered([{ text: 'Finish the discovery call. Take notes.' }]),
            numbered([{ text: 'Open a blank document or duplicate an old proposal.' }]),
            numbered([{ text: 'Rewrite the problem statement for this specific prospect.' }]),
            numbered([{ text: 'Write the solution narrative tailored to their situation.' }]),
            numbered([{ text: 'Format deliverables, timeline, and pricing.' }]),
            numbered([{ text: 'Obsess over design details for 30 to 60 minutes.' }]),
            numbered([{ text: 'Finally send it, sometimes a full day later.' }]),

            block(
                'At 1 to 3 hours per proposal and roughly 5 a month, that is anywhere from 5 to 15 hours of production time. Not strategy time. Not sales time. Document formatting time.'
            ),

            {
                _type: 'testimonial',
                _key: key(),
                quote: 'I do not need a dedicated calendar block to create a proposal anymore. I just go in, fill a form, and that is it.',
                author: 'Rahul Lalia',
                role: 'Founder, RSL/A',
            },

            block(
                'The worst part was the delay. A prospect finishes a call feeling excited about working together, and then waits a day or two for a proposal. Momentum dies. We were not losing deals because our work was bad. We were losing them because the paperwork was slow.'
            ),

            // === Section 2: The Solution ===
            block('Typeform + Make.com + Claude + Google Docs', 'h2'),

            block(
                'We needed a system that could take structured inputs from a discovery call and produce a branded, client-ready proposal without any manual formatting.'
            ),

            // Workflow image
            {
                _type: 'caseStudyImage',
                _key: key(),
                asset: {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: workflowAsset._id },
                },
                alt: 'Make.com workflow: Typeform trigger, Tools, Typeform responses, Claude AI, JSON parse, Google Docs output',
                caption:
                    'The full automation. Six modules. Typeform watches for submissions, Claude generates the content, Google Docs produces the final document.',
                size: 'full',
            },

            block('Step 1: Structured intake via Typeform', 'h3'),

            // Typeform screenshot
            {
                _type: 'caseStudyImage',
                _key: key(),
                asset: {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: typeformAsset._id },
                },
                alt: 'Typeform cover page: "Fill out this form to automatically generate a proposal" with 7-minute estimate',
                caption:
                    'The Typeform intake. Takes about 7 minutes. Every field is structured so Claude gets clean inputs.',
                size: 'medium',
            },

            block(
                'After every discovery call, we fill out a Typeform that captures:'
            ),

            bullet([{ text: 'Prospect name, business name, phone, email' }]),
            bullet([{ text: 'One-line business summary' }]),
            bullet([{ text: 'The problem they described on the call' }]),
            bullet([{ text: 'The solution we proposed' }]),
            bullet([{ text: 'Specific deliverables' }]),
            bullet([{ text: 'Timeline' }]),
            bullet([{ text: 'Investment amount' }]),

            block(
                'This takes about 5 to 7 minutes. The key insight is that structuring the input is what makes the AI output good. If you dump unstructured notes into an LLM, you get generic copy. If you give it specific fields, you get specific proposals.'
            ),

            block('Step 2: Make.com orchestration', 'h3'),

            block(
                'Make.com watches for new Typeform submissions and triggers instantly. It takes the structured form data and sends it to the next step. No manual intervention. No copy-pasting between tools.'
            ),

            block('Step 3: Claude generates the narrative', 'h3'),

            block(
                'This is where it gets interesting. Claude receives the structured data and generates:'
            ),

            bullet([{ text: 'A compelling proposal title' }]),
            bullet([{ text: 'A problem narrative that reflects what the prospect actually said' }]),
            bullet([{ text: 'A solution narrative explaining our approach' }]),
            bullet([{ text: 'Deliverables formatted as clear scope items' }]),
            bullet([{ text: 'A phased timeline with milestones' }]),

            block(
                'The output is structured JSON, not free-form text. That matters because it flows directly into the template without any cleanup.'
            ),

            block(
                'We currently use Claude, though the AI model is swappable. The prompt engineering is what matters more than the model.'
            ),

            block('Step 4: Google Docs template population', 'h3'),

            block(
                'The final step injects Claude\'s output into a branded Google Docs template. Same design, same margins, same section structure every time. The template is the design layer. AI is the content layer. They never interfere with each other.'
            ),

            {
                _type: 'callout',
                _key: key(),
                type: 'info',
                title: 'Why we switched from PandaDocs',
                content:
                    'We started with PandaDocs ($65/month) for its built-in e-signatures and payment collection. After two months, we switched to Google Docs. The only trade-off is sending a separate payment link, which saves $780/year. For agencies that need integrated payments and signatures on every proposal, PandaDocs is worth it. For us, the manual follow-up is a non-issue.',
            },

            // Tech Stack
            {
                _type: 'techStack',
                _key: key(),
                tools: [
                    {
                        _key: key(),
                        name: 'Typeform',
                        url: 'https://www.typeform.com/',
                    },
                    {
                        _key: key(),
                        name: 'Make.com',
                        url: 'https://www.make.com/en/register?pc=lalia',
                        promo: 'Free tier available',
                    },
                    {
                        _key: key(),
                        name: 'Claude (Anthropic)',
                        url: 'https://www.anthropic.com/',
                    },
                    {
                        _key: key(),
                        name: 'Google Docs',
                        url: 'https://docs.google.com/',
                    },
                ],
            },

            // Gated Resource
            {
                _type: 'gatedResource',
                _key: key(),
                title: 'Proposal Generator Blueprint',
                description:
                    'The Make.com blueprint that connects Typeform to Claude and generates structured proposal content. Import it directly.',
                downloadUrl: '/downloads/proposal-generator-blueprint.json',
                buttonText: 'Download the Blueprint',
            },

            // === Section 3: The Results ===
            block('The results', 'h2'),

            {
                _type: 'statsCard',
                _key: key(),
                stats: [
                    { _key: key(), value: '~10 min', label: 'Per Proposal' },
                    { _key: key(), value: '105 hrs', label: 'Saved/Year' },
                    { _key: key(), value: '92%', label: 'Time Reduction' },
                    { _key: key(), value: '2 hrs', label: 'Build Time' },
                ],
            },

            block(
                'Before: 1 to 3 hours per proposal, inconsistent formatting, multi-day delivery delays.'
            ),

            block(
                'After: about 10 minutes per proposal, identical branding every time, same-day delivery.'
            ),

            block(
                'At roughly 5 proposals a month, that is about 105 hours recovered annually. The build took 2 hours. Break-even hit on the second proposal.'
            ),

            block('What actually changed', 'h3'),

            bullet([{ text: 'No more rabbit holes. ', bold: true }, { text: 'The template handles design. You never touch margins or fonts again.' }]),
            bullet([{ text: 'Same-day proposals. ', bold: true }, { text: 'Prospects get proposals hours after the call, not days.' }]),
            bullet([{ text: 'Brand consistency. ', bold: true }, { text: 'Every proposal looks like it came from the same agency, because it did.' }]),
            bullet([{ text: 'Scalable. ', bold: true }, { text: 'We could handle 10x the proposal volume without adding any time.' }]),

            block(
                'The $780/year PandaDocs savings is a nice bonus, but the real value is the 105 hours. That is over 2.5 full work weeks returned to actual revenue-generating work.'
            ),

            // === Section 4: How to Build This ===
            block('How to build something like this', 'h2'),

            block(
                'The framework is simple and repeatable for any service business that sends proposals:'
            ),

            numbered([{ text: 'Create a structured intake form. ', bold: true }, { text: 'Capture the specific fields your proposals need. Do not use a blank text box.' }]),
            numbered([{ text: 'Connect to Make.com. ', bold: true }, { text: 'Set up a trigger that fires on new form submissions.' }]),
            numbered([{ text: 'Prompt an LLM with structured output. ', bold: true }, { text: 'Tell it exactly what to generate: title, narratives, scope items, timeline. Require JSON output.' }]),
            numbered([{ text: 'Build a branded template. ', bold: true }, { text: 'Lock the design once. Never touch it again. AI populates the content.' }]),
            numbered([{ text: 'Test with 3 to 5 real proposals before going live. ', bold: true }, { text: 'Tune the prompt based on output quality.' }]),

            block(
                'Total build time should be under 3 hours for anyone comfortable with Make.com and API integrations.'
            ),

            // CTA
            {
                _type: 'ctaButton',
                _key: key(),
                text: 'Build a System Like This',
                url: '/#contact',
                style: 'primary',
            },

            block(
                'We build custom automation systems for agencies and service businesses. If you are spending hours on proposals, reports, or any repetitive document workflow, we can fix that.'
            ),

            {
                _type: 'ctaButton',
                _key: key(),
                text: 'See What We Can Automate',
                url: '/work',
                style: 'secondary',
            },
        ],
    };

    console.log('Creating proposal case study...');
    await client.createOrReplace(document);
    console.log(`Done. Document created: ${DOC_ID}`);
    console.log(`Total content blocks: ${document.content.length}`);
}

run().catch((e) => {
    console.error(e.message);
    process.exit(1);
});
