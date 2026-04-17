import { createClient } from '@sanity/client';
import { createReadStream } from 'fs';

const client = createClient({
    projectId: 'yz25oyux',
    dataset: 'production',
    token: process.env.SANITY_API_TOKEN_V2,
    apiVersion: '2025-03-01',
    useCdn: false,
});

const DOC_ID = 'drafts.cs-ai-content-automation';

let keyCounter = 0;
const key = () => `ca${String(++keyCounter).padStart(3, '0')}`;

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
        createReadStream('/Users/rahullalia/Downloads/remaining/Auto-Blog/Blog writer.png'),
        { filename: 'ai-content-automation-featured.png' }
    );
    console.log(`  Featured: ${featuredAsset._id}`);

    console.log('Uploading workflow screenshot...');
    const workflowAsset = await client.assets.upload(
        'image',
        createReadStream('/Users/rahullalia/Downloads/remaining/Auto-Blog/workflow.jpg'),
        { filename: 'ai-content-automation-make-workflow.jpg' }
    );
    console.log(`  Workflow: ${workflowAsset._id}`);

    // ===== BUILD DOCUMENT =====
    const document = {
        _id: DOC_ID,
        _type: 'caseStudyV2',

        // ===== STORY =====
        title: 'Saved $18K a Year with an AI Content Pipeline',
        slug: { _type: 'slug', current: 'seo-content-marketing-automation' },
        clientName: 'RSL/A (Internal)',
        tag: 'AI Automation & Content',
        description:
            'We were paying $75 per article and missing publishing schedules constantly. We built an end to end AI content pipeline using Make.com, GPT, and Typeform. $18K saved annually, 4X content velocity, under $5 per post.',
        featuredImage: {
            _type: 'image',
            asset: { _type: 'reference', _ref: featuredAsset._id },
            alt: 'Case study: $18K per year saved on content with AI SEO content automation',
        },
        tldr: 'We were paying $75 per article. $3,600 a year in raw copywriting, closer to $18K when you factor in coordination, editing, and publishing. So we built an AI content engine using Make.com, GPT, and Typeform. Topics go in, published SEO posts come out. 4X content velocity, 99% manual work eliminated, under $5 per post. We run on our own automation. Includes a downloadable Make.com blueprint.',
        pullQuote:
            'What used to cost the same as a part time employee now runs for less than the cost of a single outsourced article.',

        // ===== PROOF =====
        metrics: [
            { _key: key(), value: '$18K', label: 'Annual Savings' },
            { _key: key(), value: '4X', label: 'Content Velocity' },
            { _key: key(), value: '99%', label: 'Work Automated' },
            { _key: key(), value: '< $5', label: 'Cost Per Post' },
        ],
        beforeAfter: {
            before: '$75 per article from freelance writers. $3,600 a year in raw copywriting fees, $18K when you add coordination and publishing time. Weekly publishing was aspirational, not operational. Different writers meant inconsistent brand voice. Manual editing took 2 to 3 hours per post.',
            after: 'Under $5 per post. 4X content output. Weekly publishing now happens automatically. Consistent brand voice across every article. 99% of manual work eliminated. Topics go in, published posts come out.',
        },
        problemStatement:
            'Content marketing is non negotiable for demonstrating expertise. But at $75 per article, publishing four posts monthly cost $300 a month. That is $3,600 annually in raw copywriting fees. Factor in coordination, editing, and publishing time, and the true cost approached $18,000 per year. Beyond cost, two critical factors were failing. Manual editing and publishing choked the content pipeline, taking 2 to 3 hours per post. And weekly publishing schedules were aspirational, not operational. We would miss weeks at a time. Different writers meant inconsistent brand voice and SEO quality. Adding more content meant adding more cost linearly. Something had to change.',
        solutionApproach:
            'We built an end to end AI content engine using Make.com, GPT, and Typeform. The pipeline works in stages: Typeform captures the topic, target keywords, and internal links. Make.com triggers the automation. GPT generates a structured outline, then writes each section individually for higher quality. The sections get aggregated into a complete article, run through an SEO optimization pass, and published directly to the CMS via API. Google Sheets tracks every post through the pipeline. The entire system runs on a single Make.com scenario with branching logic for error handling.',
        resultsOutcome:
            '$18,000 annual savings compared to fully burdened manual copywriting costs. 4X content velocity. Weekly publishing is now operational, not aspirational. 99% of manual work eliminated. Data entry, writing, formatting, scheduling. All automated. Consistent quality on every post because the brand voice and SEO requirements are baked into the prompts. Under $5 per post including API costs. What used to cost the same as a part time employee now runs for less than a single outsourced article. We do not just sell automation. We run on it.',
        keyTakeaways: [
            'Calculate true content costs including coordination, editing, and publishing time. Not just raw writing fees.',
            'Generate articles section by section, not all at once. Breaking the content into parts produces higher quality output.',
            'Bake brand voice and SEO requirements into the system prompts so every post is consistent without manual review.',
            'Build end to end pipelines. Topic goes into Typeform, published post comes out of the CMS. Zero manual steps in between.',
            'Eat your own cooking. We built this for ourselves first, then opened it to clients.',
        ],

        // ===== SETTINGS =====
        status: 'draft',
        category: 'AI Automations',
        industry: 'agency',
        servicesUsed: ['ai-automations', 'ai-digital-presence'],
        featured: false,
        priority: 8,
        annualSavings: 18000,
        timeframe: 30,
        publishedAt: '2026-03-08T00:00:00Z',

        seo: {
            metaTitle: 'Saved $18K/Year with AI Content Automation | RSL/A',
            metaDescription:
                'How we built an AI content pipeline using Make.com, GPT, and Typeform that produces SEO blog posts for under $5 each. Free blueprint included.',
            keywords: [
                'ai content automation',
                'blog writing automation',
                'make.com content pipeline',
                'ai seo content',
                'automated blog publishing',
                'content marketing automation',
                'gpt blog writing',
            ],
        },

        faqSchema: [
            {
                _key: key(),
                question: 'How much does AI content generation actually cost per article?',
                answer: 'Under $5 per post including OpenAI API costs. Compared to $75 to $150 for freelance writers, the savings are massive at scale. Our system generates 4X more content for a fraction of the cost.',
            },
            {
                _key: key(),
                question: 'How does the AI maintain consistent brand voice?',
                answer: 'Brand voice requirements, writing style rules, and SEO patterns are built into the system prompts. Every article goes through the same prompt architecture, producing consistent tone and quality without manual review.',
            },
            {
                _key: key(),
                question: 'Does AI content rank on Google?',
                answer: 'Yes. Our AI generated posts follow SEO best practices including keyword density, header structure, internal linking, meta descriptions, and FAQ schema. Several posts rank on page 1 for target keywords. Google cares about content quality, not who wrote it.',
            },
            {
                _key: key(),
                question: 'What tools are needed to build this content pipeline?',
                answer: 'Make.com for the automation workflow, Typeform for topic input, OpenAI GPT for content generation, Google Sheets for pipeline tracking, and your CMS for publishing. A free Make.com blueprint is included in this case study.',
            },
            {
                _key: key(),
                question: 'Is human review still needed for AI generated content?',
                answer: 'Optional but recommended for high stakes content. The system includes optional review checkpoints. For routine blog posts, many businesses publish directly. For thought leadership or technical content, a quick human scan adds quality assurance.',
            },
        ],

        // ===== BODY CONTENT =====
        content: [
            // --- Section 1: The Problem ---
            block('$75 per article was unsustainable', 'h2'),

            richBlock([
                { text: 'Content marketing is non negotiable for demonstrating expertise. But at ' },
                { text: '$75 per article', bold: true },
                { text: ', publishing four posts monthly cost $300 a month. That is $3,600 annually in raw copywriting fees. Factor in coordination, editing, and publishing time, and the true cost approached ' },
                { text: '$18,000 per year', bold: true },
                { text: '.' },
            ]),

            block(
                'We faced a classic scaling problem: the more we grew, the more content we needed, and the more expensive it became.'
            ),

            {
                _type: 'callout',
                _key: key(),
                type: 'info',
                title: 'The content cost crisis',
                content:
                    'Companies publishing 16+ blog posts per month get 3.5X more traffic than those publishing 0 to 4. But at $75 to $150 per article, that level of output costs $15,000 to $30,000 a year. Often more than the ROI justifies.',
            },

            block('Beyond cost, everything else was failing too:', 'h3'),

            bullet([
                { text: 'Time drain: ', bold: true },
                { text: 'manual editing and publishing took 2 to 3 hours per post' },
            ]),
            bullet([
                { text: 'Consistency collapse: ', bold: true },
                { text: 'weekly publishing was aspirational, not operational. We would miss weeks at a time' },
            ]),
            bullet([
                { text: 'Quality variance: ', bold: true },
                { text: 'different writers meant inconsistent brand voice and SEO quality' },
            ]),
            bullet([
                { text: 'Scalability ceiling: ', bold: true },
                { text: 'adding more content meant adding more cost linearly' },
            ]),

            block(
                'Every hour spent on repetitive content tasks is an hour not spent on strategy. The math demanded automation.'
            ),

            // --- Section 2: The Build ---
            block('An autonomous content pipeline', 'h2'),

            block(
                'We built this system for ourselves first, then opened it to clients. An end to end AI content engine that takes topic input and delivers published, SEO optimized blog posts without human intervention.'
            ),

            // Workflow screenshot
            {
                _type: 'caseStudyImage',
                _key: key(),
                asset: {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: workflowAsset._id },
                },
                alt: 'Make.com workflow showing the full AI content pipeline from Typeform input through GPT generation to CMS publishing',
                caption:
                    'The full automation. Typeform captures the topic, GPT generates the outline and each section, the article assembles and publishes automatically.',
                size: 'large',
            },

            block('Stage 1: Structured input system', 'h3'),

            block(
                'The foundation: a clean data capture system that feeds the AI with exactly what it needs.'
            ),

            bullet([
                { text: 'Typeform frontend: ', bold: true },
                { text: 'captures blog topic, primary and secondary keywords, and internal and external links' },
            ]),
            bullet([
                { text: 'Google Sheets tracking: ', bold: true },
                { text: 'central record for content pipeline visibility and status updates' },
            ]),
            bullet([
                { text: 'Validation rules: ', bold: true },
                { text: 'ensures all required fields are populated before triggering the automation' },
            ]),

            block('Stage 2: AI content generation', 'h3'),

            block(
                'This is where the quality comes from. Instead of asking GPT to write a full article in one shot (which produces mediocre results), we break it into stages.'
            ),

            numbered([
                { text: 'GPT generates a structured outline ', bold: true },
                { text: 'based on the topic, keywords, and competitive research' },
            ]),
            numbered([
                { text: 'Each section gets written individually. ', bold: true },
                { text: 'Separate prompts for each section produce deeper, more focused content than a single massive prompt' },
            ]),
            numbered([
                { text: 'Sections aggregate into a complete article. ', bold: true },
                { text: 'The system stitches everything together with proper formatting and flow' },
            ]),
            numbered([
                { text: 'SEO optimization pass. ', bold: true },
                { text: 'A final GPT call checks keyword density, meta description, header structure, and internal linking' },
            ]),

            {
                _type: 'callout',
                _key: key(),
                type: 'tip',
                title: 'Section by section beats all at once',
                content:
                    'The difference between generic AI content and publishable AI content is in the prompt architecture. Writing each section individually with focused prompts produces dramatically better output than asking for a full article in one shot. We spent 40+ hours refining this approach.',
            },

            block('Stage 3: Automated publishing', 'h3'),

            block(
                'The entire system runs on Make.com. Topic enters Typeform, AI generates content, Google Drive organizes assets, CMS publishes automatically.'
            ),

            bullet([
                { text: 'Zero manual copying: ', bold: true },
                { text: 'content flows directly from AI to CMS via API' },
            ]),
            bullet([
                { text: 'Asset organization: ', bold: true },
                { text: 'generated content automatically saved to organized folder structure' },
            ]),
            bullet([
                { text: 'Scheduling flexibility: ', bold: true },
                { text: 'publish immediately or queue for optimal timing' },
            ]),
            bullet([
                { text: 'Error handling: ', bold: true },
                { text: 'failed steps trigger notifications for human intervention' },
            ]),

            block('Stage 4: Quality assurance layer', 'h3'),

            block(
                'Optional but recommended: human checkpoints for critical content.'
            ),

            bullet([
                { text: 'Draft review stage: ', bold: true },
                { text: 'content pauses for human approval before publishing' },
            ]),
            bullet([
                { text: 'Fact checking prompts: ', bold: true },
                { text: 'AI flags claims that may need verification' },
            ]),
            bullet([
                { text: 'Brand alignment check: ', bold: true },
                { text: 'quick scan for off brand language or tone' },
            ]),

            {
                _type: 'callout',
                _key: key(),
                type: 'warning',
                title: 'A note on quality',
                content:
                    'AI generated content still benefits from human oversight for accuracy and brand alignment. Our system automates 99% of the work but includes optional review checkpoints. For routine posts, many businesses skip the review. For thought leadership, a quick human scan adds quality assurance.',
            },

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
                        name: 'OpenAI GPT',
                        url: 'https://chatgpt.com/',
                    },
                    {
                        _key: key(),
                        name: 'Typeform',
                        url: 'https://www.typeform.com/',
                    },
                    {
                        _key: key(),
                        name: 'Google Sheets',
                        url: 'https://docs.google.com/',
                    },
                    {
                        _key: key(),
                        name: 'Google Drive',
                        url: 'https://drive.google.com/',
                    },
                    {
                        _key: key(),
                        name: 'Sanity CMS',
                        url: 'https://www.sanity.io/',
                    },
                ],
            },

            // Gated Resource
            {
                _type: 'gatedResource',
                _key: key(),
                title: 'Make.com Blueprint',
                description:
                    'Import this directly into Make.com. The entire content pipeline from Typeform input to CMS publishing, ready to customize for your brand.',
                downloadUrl:
                    '/downloads/case-studies/ai-content-generator/blueprint.json',
                buttonText: 'Download the Blueprint',
            },

            // --- Section 3: What Changed ---
            block('What changed', 'h2'),

            {
                _type: 'statsCard',
                _key: key(),
                stats: [
                    { _key: key(), value: '$18K', label: 'Annual Savings' },
                    { _key: key(), value: '4X', label: 'Content Velocity' },
                    { _key: key(), value: '99%', label: 'Work Automated' },
                    { _key: key(), value: '< $5', label: 'Cost Per Post' },
                ],
            },

            block('Cost', 'h3'),

            richBlock([
                { text: '$18,000 annual savings ', bold: true },
                { text: 'compared to fully burdened manual copywriting costs. What used to cost the same as a part time employee now runs for less than the cost of a single outsourced article. Under $5 per post including API costs.' },
            ]),

            block('Output', 'h3'),

            richBlock([
                { text: '4X content velocity. ', bold: true },
                { text: 'Weekly publishing is now operational, not aspirational. We went from struggling to publish once a month to effortlessly publishing weekly. The pipeline does not care about weekends or holidays.' },
            ]),

            block('Consistency', 'h3'),

            block(
                'Every post follows the same SEO best practices and brand voice guidelines because they are baked into the prompts. No more variance from different writers. No more posts that sound nothing like the rest of the blog.'
            ),

            block('Scalability', 'h3'),

            block(
                'Adding more content costs pennies, not dollars. The same pipeline that produces 4 posts a month can produce 16. The cost increase is negligible. The infrastructure is already built.'
            ),

            {
                _type: 'callout',
                _key: key(),
                type: 'success',
                title: 'Eating our own cooking',
                content:
                    'We do not just sell content automation. We run on it. This system powers our own blog at rsla.io. 60 published posts, consistent quality, consistent publishing schedule. The savings let us invest in strategy instead of production.',
            },

            {
                _type: 'testimonial',
                _key: key(),
                quote: 'We went from struggling to publish once a month to effortlessly publishing weekly. The content quality is indistinguishable from our manually written posts, and our organic traffic has grown 340% year over year.',
                author: 'Internal Results',
                role: 'RSL/A Content Team',
            },

            // --- Section 4: Who This Works For ---
            block('Who this works for', 'h2'),

            block(
                'Anyone spending too much on content or not publishing consistently:'
            ),

            bullet([
                { text: 'Agencies ', bold: true },
                { text: 'producing blog content for multiple clients at scale' },
            ]),
            bullet([
                { text: 'SaaS companies ', bold: true },
                { text: 'that need consistent thought leadership content' },
            ]),
            bullet([
                { text: 'Service businesses ', bold: true },
                { text: 'that know they should be blogging but never find the time' },
            ]),
            bullet([
                { text: 'E-commerce brands ', bold: true },
                { text: 'building organic traffic through product and category content' },
            ]),
            bullet([
                { text: 'Anyone paying $50 to $150 per article ', bold: true },
                { text: 'and wondering if the ROI justifies it' },
            ]),

            block(
                'If you are paying for content that could be automated, or worse, not publishing because it is too expensive, the math is broken. Every month you delay is a month your competitors are building organic traffic that you are not.'
            ),

            // CTA
            {
                _type: 'ctaButton',
                _key: key(),
                text: 'Fix Your Content Economics',
                url: '/#contact',
                style: 'primary',
            },
        ],
    };

    console.log('Creating AI Content Automation case study (V2)...');
    await client.createOrReplace(document);
    console.log(`Done. Document created: ${DOC_ID}`);
    console.log(`Total content blocks: ${document.content.length}`);
}

run().catch((e) => {
    console.error(e.message);
    process.exit(1);
});
