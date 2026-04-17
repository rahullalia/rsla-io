import { createClient } from '@sanity/client';
import { createReadStream } from 'fs';

const client = createClient({
    projectId: 'yz25oyux',
    dataset: 'production',
    token: process.env.SANITY_API_TOKEN_V2,
    apiVersion: '2025-03-01',
    useCdn: false,
});

const DOC_ID = 'drafts.cs-anchor-safety-notion-dashboard';

let keyCounter = 0;
const key = () => `as${String(++keyCounter).padStart(3, '0')}`;

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
        createReadStream('/Users/rahullalia/Downloads/anchor safety/AS - Stephen.png'),
        { filename: 'anchor-safety-featured.png' }
    );
    console.log(`  Featured: ${featuredAsset._id}`);

    console.log('Uploading task dashboard screenshot...');
    const taskDashAsset = await client.assets.upload(
        'image',
        createReadStream('/Users/rahullalia/Downloads/anchor safety/Task tracker dashboard.jpg'),
        { filename: 'anchor-safety-task-dashboard.jpg' }
    );
    console.log(`  Task Dashboard: ${taskDashAsset._id}`);

    console.log('Uploading expense dashboard screenshot...');
    const expenseDashAsset = await client.assets.upload(
        'image',
        createReadStream('/Users/rahullalia/Downloads/anchor safety/expense dashboard.jpg'),
        { filename: 'anchor-safety-expense-dashboard.jpg' }
    );
    console.log(`  Expense Dashboard: ${expenseDashAsset._id}`);

    // ===== BUILD DOCUMENT =====
    const document = {
        _id: DOC_ID,
        _type: 'caseStudyV2',

        // ===== STORY =====
        title: '300 Files to One Notion Dashboard',
        slug: { _type: 'slug', current: 'notion-productivity-dashboard-anchor-safety' },
        clientName: 'Anchor Safety',
        tag: 'Notion Dashboard Build',
        description:
            'Built 3 Notion dashboards and a Telegram voice-to-task bot to replace 300+ scattered SharePoint files. Tasks, expenses, and habits. All in one place. Two weeks.',
        featuredImage: {
            _type: 'image',
            asset: { _type: 'reference', _ref: featuredAsset._id },
            alt: 'Case study: 300 files to one Notion dashboard. 3 dashboards, voice-to-task automation, 2 weeks.',
        },
        tldr: 'Stephen Smith had 300+ documents scattered across SharePoint and 160 open tasks on any given day. We built him 3 Notion dashboards (tasks, expenses, habits) and a Telegram bot that turns voice notes into tasks. Two weeks. Everything is now in one place with proper structure, priorities, and progress tracking.',
        pullQuote: '300 documents in SharePoint. 160 open tasks. Zero structure. We fixed that in two weeks with Notion and a Telegram bot.',

        // ===== BODY =====
        content: [
            // --- THE SITUATION ---
            block('The situation', 'h2'),
            block('Stephen Smith is a founder in a leadership position at Anchor Safety. He runs a lot of things. And for a long time, he was running all of it out of Microsoft Office 365 and SharePoint.'),
            block('We\'re talking 300+ documents. Word files, Excel spreadsheets, CSVs. All scattered across folders with no real system holding them together. On any given day, he had about 160 open tasks floating around in his head, in sticky notes, in random spreadsheets, wherever.'),
            block('Stephen deals with focus and productivity challenges. The kind where you know what needs to get done, but the system you\'re using makes it harder, not easier. When everything lives in 300 different files, even figuring out what to work on next becomes a task.'),
            block('He didn\'t need another app. He needed one place where everything made sense.'),

            // --- WHAT WE BUILT ---
            block('What we built', 'h2'),
            block('Three dashboards in Notion, each designed for a specific part of Stephen\'s day. Plus an automation that lets him add tasks without even opening Notion.'),

            // --- TASK DASHBOARD ---
            block('Task dashboard', 'h3'),
            block('This is the core of the system. Every task Stephen tracks lives here with proper structure.'),
            bullet([{ text: 'Recurring tasks', bold: true }, { text: ' with automatic reminders so nothing falls through the cracks' }]),
            bullet([{ text: 'Priority settings', bold: true }, { text: ' so he can see what matters most right now, not just what\'s loudest' }]),
            bullet([{ text: 'Due dates and status tracking', bold: true }, { text: ' across every task' }]),
            bullet([{ text: 'Subtasks', bold: true }, { text: ' for anything that needs to be broken down further' }]),
            bullet([{ text: 'Project containers', bold: true }, { text: ' that group related tasks together with a progress bar showing how far along each project is' }]),
            bullet([{ text: 'A resource section', bold: true }, { text: ' inside each task where he can attach URLs, documents, PDFs, images. Everything is one click away instead of buried in a SharePoint folder somewhere' }]),
            block('He can check off daily tasks, track project progress visually, and always know exactly where things stand.'),

            // TASK DASHBOARD SCREENSHOT
            {
                _type: 'caseStudyImage',
                _key: key(),
                asset: {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: taskDashAsset._id },
                },
                alt: 'Notion task dashboard showing projects with progress bars, priority settings, and organized task views',
                caption: 'The task dashboard. Projects with progress bars, recurring tasks, priorities, and everything linked in one place.',
                size: 'full',
            },

            // --- EXPENSE DASHBOARD ---
            block('Expense dashboard', 'h3'),
            block('Same philosophy, different domain. Every bill and expense tracked in one view.'),
            bullet([{ text: 'Upload invoices', bold: true }, { text: ' directly to each expense entry' }]),
            bullet([{ text: 'Track payment methods', bold: true }, { text: ' so he knows which card or account is being used for what' }]),
            bullet([{ text: 'Categorize expenses', bold: true }, { text: ' with filters and views' }]),
            bullet([{ text: 'Full history', bold: true }, { text: ' of every bill, when it was paid, and what\'s upcoming' }]),
            block('No more digging through Excel sheets to find an invoice or figure out what got paid last month.'),

            // EXPENSE DASHBOARD SCREENSHOT
            {
                _type: 'caseStudyImage',
                _key: key(),
                asset: {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: expenseDashAsset._id },
                },
                alt: 'Notion expense dashboard showing bills, invoices, payment methods, and expense categories',
                caption: 'The expense dashboard. Bills, invoices, payment methods, and categories. All in one view.',
                size: 'full',
            },

            // --- HABIT DASHBOARD ---
            block('Habit dashboard', 'h3'),
            block('This one was a bonus. We built it as a freebie because it made sense alongside the other two dashboards. Stephen can track daily habits, build streaks, and keep personal accountability front and center. For someone with focus challenges, having habits visible next to tasks and expenses creates a feedback loop that keeps momentum going.'),

            // --- DIVIDER ---
            { _type: 'divider', _key: key(), style: 'dots' },

            // --- THE TELEGRAM BOT ---
            block('The voice-to-task bot', 'h2'),
            block('This is the part that changes everything.'),
            block('We built a Telegram bot connected to Make.com and ChatGPT. Here\'s how it works: Stephen records a voice note in Telegram. The audio is sent to Make.com, which runs it through ChatGPT\'s Whisper transcription. The transcription is parsed, and a new task is automatically added to his Notion task dashboard with the right fields populated.'),
            block('That\'s it. Voice note in, task created. No opening Notion. No typing. No forgetting about it by the time he sits down at his desk.'),
            block('For someone who\'s always on the move and deals with focus challenges, this is the difference between a thought staying a thought and a thought becoming an action. He uses it regularly. It\'s become his primary way of capturing tasks on the go.'),

            // --- CALLOUT ---
            {
                _type: 'callout',
                _key: key(),
                type: 'tip',
                title: 'Why Telegram over a Notion mobile app?',
                content: 'Notion\'s mobile app works fine for browsing, but adding a properly structured task with priorities, dates, and categories takes multiple taps. A voice note in Telegram takes 5 seconds. The automation handles the rest. For people with focus challenges, removing friction from task capture is everything.',
            },

            // --- HOW WE DID IT ---
            block('How we built it in 2 weeks', 'h2'),
            block('Week 1', 'h3'),
            block('Started by auditing everything Stephen had in SharePoint. Understood his workflow, what he tracks, what he needs to see daily, and where things were falling apart. Designed the database structure for all three dashboards in Notion. Built the task dashboard and expense dashboard with all views, filters, relations, and rollups.'),

            block('Week 2', 'h3'),
            block('Built the habit dashboard. Set up the Telegram to Notion automation via Make.com (Telegram bot, Whisper transcription, Notion API). Migrated critical data from SharePoint into the new system. Tested everything. Walked Stephen through each dashboard so he could own it going forward.'),

            // --- TECH STACK ---
            {
                _type: 'techStack',
                _key: key(),
                tools: [
                    { _key: key(), name: 'Notion', url: 'https://www.notion.so/', promo: 'Dashboards, databases, task and expense tracking' },
                    { _key: key(), name: 'Make.com', url: 'https://www.make.com/', promo: 'Automation orchestration (Telegram to Notion pipeline)' },
                    { _key: key(), name: 'Telegram', url: 'https://telegram.org/', promo: 'Voice note capture on the go' },
                    { _key: key(), name: 'ChatGPT Whisper', url: 'https://openai.com/', promo: 'Voice-to-text transcription' },
                ],
            },

            // --- THE BOTTOM LINE ---
            block('The bottom line', 'h2'),
            block('Stephen went from 300+ documents scattered across SharePoint to 3 clean dashboards in Notion. His 160 daily tasks now have structure, priorities, due dates, and progress tracking. His expenses have a proper home with invoices attached. His habits are visible and trackable.'),
            block('And when a thought hits him while he\'s away from his desk, he records a voice note in Telegram and it shows up as a task in Notion. No friction. No forgetting.'),
            block('Two weeks. Three dashboards. One bot. That\'s what it took to go from chaos to clarity.'),

            // --- CTA ---
            {
                _type: 'ctaButton',
                _key: key(),
                text: 'Need a system like this built for you?',
                url: 'https://rsla.io/book-a-call',
                style: 'primary',
            },
        ],

        // ===== PROOF =====
        metrics: [
            { _key: key(), value: '300+', label: 'Scattered files replaced' },
            { _key: key(), value: '160', label: 'Daily tasks now organized' },
            { _key: key(), value: '3', label: 'Dashboards built' },
            { _key: key(), value: '2 weeks', label: 'Start to finish' },
        ],
        beforeAfter: {
            before: '300+ documents scattered across SharePoint and Office 365. 160 open tasks with no structure, no priorities, no tracking. Expenses in random spreadsheets. No system for capturing tasks on the go.',
            after: '3 Notion dashboards (tasks, expenses, habits) with priorities, progress bars, invoice uploads, and a Telegram bot that turns voice notes into structured tasks automatically.',
        },
        problemStatement:
            'Stephen Smith had everything in Microsoft Office 365 and SharePoint. 300+ documents. Word files, Excel spreadsheets, CSVs. No linking, no structure, no single view of what needed to get done. On any given day, he had about 160 open tasks with no priority system and no way to track progress. For someone who deals with focus and productivity challenges, the disorganization was making the problem worse.',
        solutionApproach:
            'We audited his entire SharePoint setup to understand what he actually needed to track daily. Then we built three Notion dashboards: a task tracker with recurring tasks, priorities, subtasks, project containers, and progress bars; an expense tracker with invoice uploads and payment method tracking; and a habit tracker for daily accountability. On top of that, we built a Telegram bot via Make.com that uses ChatGPT Whisper to transcribe voice notes and create tasks in Notion automatically.',
        resultsOutcome:
            'In 2 weeks, Stephen went from 300+ scattered files to 3 organized dashboards. Every task has a priority, a due date, and a status. Projects show progress bars. Expenses have invoices attached. And the Telegram voice-to-task bot became his primary way of capturing tasks on the go. The system is fully self-service. Stephen runs it himself.',
        keyTakeaways: [
            'Audit the mess before building the system. Understanding what someone actually tracks daily matters more than what they think they need.',
            'Remove friction from task capture. The Telegram voice bot works because it takes 5 seconds, not 5 taps in a mobile app.',
            'Build dashboards around decisions, not data. Each view should answer a specific question: "What do I work on next?" or "What bills are due?"',
            'Throw in a bonus when it makes sense. The habit tracker was free, but it completed the system and made the other two dashboards more valuable.',
            'Notion is underrated for founder productivity. Databases, relations, rollups, and views can replace a dozen scattered tools.',
        ],

        // ===== SETTINGS =====
        status: 'draft',
        category: 'AI Operations',
        industry: 'professional-services',
        servicesUsed: ['ai-operations', 'ai-automations'],
        timeframe: 14,
        featured: false,
        priority: 7,
        publishedAt: new Date().toISOString(),
        seo: {
            metaTitle: '300 Files to One Notion Dashboard: Anchor Safety Case Study | RSL/A',
            metaDescription:
                'How we replaced 300+ scattered SharePoint files with 3 Notion dashboards and a Telegram voice-to-task bot in 2 weeks for a founder with productivity challenges.',
            keywords: [
                'Notion dashboard',
                'Notion productivity',
                'founder productivity system',
                'Telegram Notion automation',
                'voice to task automation',
                'Notion expense tracker',
                'Make.com Notion',
            ],
        },
        faqSchema: [
            {
                _key: key(),
                question: 'Can Notion replace SharePoint for personal productivity?',
                answer: 'For individual productivity and task management, yes. Notion\'s databases, views, relations, and rollups can consolidate hundreds of scattered documents into organized dashboards. It\'s not a 1:1 SharePoint replacement for enterprise file storage, but for a founder tracking tasks, expenses, and habits, it\'s significantly more effective.',
            },
            {
                _key: key(),
                question: 'How does the Telegram voice-to-task automation work?',
                answer: 'You record a voice note in Telegram. Make.com picks it up, sends the audio to ChatGPT Whisper for transcription, then creates a structured task in your Notion database with the transcribed content. The whole process takes seconds and requires no manual input beyond the voice note.',
            },
            {
                _key: key(),
                question: 'How long does it take to build a custom Notion dashboard system?',
                answer: 'This project took 2 weeks and included 3 dashboards (tasks, expenses, habits), a Telegram voice-to-task automation via Make.com, and data migration from SharePoint. Simpler setups can be done faster; more complex systems with multiple integrations may take longer.',
            },
            {
                _key: key(),
                question: 'Is Notion good for people with focus or productivity challenges?',
                answer: 'Yes, when set up properly. The key is reducing friction. Dashboards that answer "what do I work on next?" with clear priorities, progress bars, and due dates remove decision fatigue. Adding a voice-to-task bot means capturing thoughts instantly without switching apps or losing focus.',
            },
        ],
    };

    console.log('Creating Anchor Safety case study (V2)...');
    await client.createOrReplace(document);
    console.log(`Done. Document created: ${DOC_ID}`);
    console.log(`Total content blocks: ${document.content.length}`);
}

run().catch((e) => {
    console.error(e.message);
    process.exit(1);
});
