/**
 * Creates the "Claude features" Drop post in Sanity with full Portable Text body.
 * Run: SANITY_TOKEN=xxx node content/scripts/patchDropPostBody.mjs
 */

const PROJECT_ID = 'yz25oyux';
const DATASET = 'production';
const TOKEN = process.env.SANITY_TOKEN;

if (!TOKEN) {
  console.error('Set SANITY_TOKEN env var');
  process.exit(1);
}

// Helpers
let keyCounter = 0;
const k = () => `d${Date.now().toString(36)}${(keyCounter++).toString(36)}`;

function block(text, style = 'normal') {
  return {
    _type: 'block', _key: k(), style, markDefs: [],
    children: [{ _type: 'span', _key: k(), text, marks: [] }],
  };
}

function blockWithLink(segments) {
  const markDefs = [];
  const children = segments.map(seg => {
    if (seg.href) {
      const mk = k();
      markDefs.push({ _key: mk, _type: 'link', href: seg.href, blank: true });
      return { _type: 'span', _key: k(), text: seg.text, marks: [mk] };
    }
    if (seg.bold) return { _type: 'span', _key: k(), text: seg.text, marks: ['strong'] };
    return { _type: 'span', _key: k(), text: seg.text, marks: [] };
  });
  return { _type: 'block', _key: k(), style: 'normal', markDefs, children };
}

function boldBlock(segments) {
  const children = segments.map(seg => ({
    _type: 'span', _key: k(), text: seg.text,
    marks: seg.bold ? ['strong'] : [],
  }));
  return { _type: 'block', _key: k(), style: 'normal', markDefs: [], children };
}

function bulletItem(segments) {
  const markDefs = [];
  const children = segments.map(seg => {
    if (seg.href) {
      const mk = k();
      markDefs.push({ _key: mk, _type: 'link', href: seg.href, blank: true });
      return { _type: 'span', _key: k(), text: seg.text, marks: [mk] };
    }
    return { _type: 'span', _key: k(), text: seg.text, marks: seg.bold ? ['strong'] : [] };
  });
  return { _type: 'block', _key: k(), style: 'normal', listItem: 'bullet', level: 1, markDefs, children };
}

function callout(type, title, content) {
  return { _type: 'callout', _key: k(), type, title, content };
}

function ctaButton(text, url, style = 'primary') {
  return { _type: 'ctaButton', _key: k(), text, url, style };
}

function divider(style = 'line') {
  return { _type: 'divider', _key: k(), style };
}

// === BUILD THE BODY ===
const body = [
  // OPENING
  block('Anthropic has been shipping at a pace I\'ve never seen. New features every single week. And not small things. We\'re talking about a 1 million token context window, autonomous coding mode, voice dictation, computer control. All in about 45 days.'),
  block('Most people saw the announcements, bookmarked them, and moved on.'),
  block('I tested every single one in my daily workflow. I use Claude Code 80% to 90% of my working day at RSL/A. Every client project, every proposal, every automation runs through it. So when a new feature drops, I find out fast whether it actually changes anything.'),
  block('Some of these features changed how I work. Some of them didn\'t. Here\'s the honest breakdown.'),

  // H2: 1M CONTEXT
  block('The 1M context window is the one that actually changes your economics', 'h2'),
  blockWithLink([
    { text: 'This is the big one. ' },
    { text: 'Anthropic made the 1 million token context window generally available', href: 'https://claude.com/blog/1m-context-ga' },
    { text: ' on March 13, 2026. Standard pricing. No multiplier. A 900K-token request costs the same per-token rate as a 9K one.' },
  ]),
  blockWithLink([
    { text: 'Before this, context ran out every 15 to 20 minutes. I\'d be mid-project, deep in a client\'s codebase, and Claude would forget everything we\'d been working on together. I mentioned this in my ' },
    { text: 'guide to Anthropic\'s five Claude products', href: 'https://rsla.io/blog/anthropic-claude-products-guide' },
    { text: '. It was the reason I almost gave up on Claude.ai and switched to Claude Code in the first place.' },
  ]),
  block('The old workflow looked like this. Start a session. Load your CLAUDE.md. Explain the project. Get 15 minutes of productive work. Context runs out. Start over. Re-explain everything. Lose another 5 to 10 minutes. Across 5 to 6 sessions a day, that\'s 2 or more hours just re-feeding context.'),
  block('Now? I load the entire project in one shot. The CLAUDE.md file. CSV files with client data. PDFs. Images. The whole codebase. One session covers everything.'),
  block('Here\'s the math that matters. If you bill $75 to $150 an hour and save 2 hours a day on context re-feeding, that\'s $150 to $300 a day. $750 to $1,500 a week. Even if you cut that estimate in half, it pays for the Max plan ($200 a month) many times over.'),
  block('And it\'s not just text. You can now send up to 600 images or PDF pages per request, up from 100. Feed Claude an entire client\'s document library and let it find the patterns you\'d miss.'),

  // H2: AUTO MODE
  block('Auto Mode killed permission fatigue', 'h2'),
  block('Every Claude Code user knows the drill. You ask Claude to build a feature. It starts working. Then it stops. "Can I edit this file?" Yes. "Can I run this command?" Yes. "Can I create this directory?" Yes.'),
  block('You sit there hitting "y" like a human rubber stamp. Fifty, sixty, sometimes a hundred times per session.'),
  blockWithLink([
    { text: '' },
    { text: 'Auto Mode launched March 24', href: 'https://www.theverge.com/ai-artificial-intelligence/900201/anthropic-claude-code-auto-mode' },
    { text: '. It uses an AI safety classifier that reviews each action before it runs. Safe actions proceed automatically. Risky ones get blocked. You stay in flow.' },
  ]),
  block('Here\'s what that saves you. If you approve 50 to 100 actions per session, each taking 3 to 5 seconds of context switching, that\'s 5 to 10 minutes per session. Across 6 to 8 sessions a day, that\'s 40 to 80 minutes of just... approving things. Gone.'),
  block('And you know what? It\'s not the same as dangerously-skip-permissions. That old flag handed all decision-making to Claude with zero guardrails. Auto Mode is the middle ground. It catches mass file deletions, sensitive data extraction, and suspicious commands. The stuff you actually want stopped.'),
  block('It currently works with Sonnet 4.6 and Opus 4.6. Team plans need admin approval. Enterprise and API support is coming.'),
  block('Honestly? This is the feature that made Claude Code feel like a real collaborator instead of a tool that needs babysitting.'),

  // H2: STATUS LINE + /RENAME
  block('Status Line and /rename sound small. They\'re not.', 'h2'),
  block('Two features that don\'t make headlines but made an immediate difference in my workflow.'),
  boldBlock([
    { text: 'Status Line', bold: true },
    { text: ' is a customizable bar at the bottom of your terminal showing context usage, cost, and token counts in real time. You know exactly when you\'re about to lose context. That means you compact at the right time instead of getting surprised mid-thought.' },
  ]),
  block('The money angle is subtle but real. Every time you lose context unexpectedly, you burn tokens re-establishing it. At API rates ($5 to $25 per million tokens for Opus), knowing when to compact saves real dollars across hundreds of sessions. You can set it up with the /statusline command or write your own shell script. The community has built some great ones already.'),
  boldBlock([
    { text: '/rename', bold: true },
    { text: ' lets you give sessions names instead of scrolling through 10 unnamed terminals trying to find the right one. Run /rename client-x-proposal and you can jump back to it anytime with /resume client-x-proposal. There\'s also /color to color-code sessions visually.' },
  ]),
  block('These are compound interest features. Small daily savings that stack over weeks and months. I have 8 to 10 terminal sessions open at any given time. Before /rename, finding the right one was a guessing game. Now each one is labeled: rsla-website, fieldshare-seo, cold-email-engine, proposal-draft. Five seconds saved per switch, dozens of times a day.'),

  // H2: VOICE MODE
  block('Voice Mode is promising but Wispr Flow still wins', 'h2'),
  block('Claude Code added voice dictation with the /voice command. Push-to-talk with the Space bar. Your speech appears in the prompt as you talk, dimmed until the transcript finalizes. It\'s tuned for coding vocabulary, so it recognizes things like OAuth, regex, JSON, and localhost without you spelling them out.'),
  block('I used it on and off. Not gonna lie, in the initial stages it wasn\'t the best.'),
  blockWithLink([
    { text: 'The issue is that tools like ' },
    { text: 'Wispr Flow', href: 'https://www.wispr.flow/' },
    { text: ' have had years to nail transcription accuracy. They\'re dedicated to one job. Claude\'s voice mode is good for quick prompts and brainstorming when you\'re away from the keyboard. But for anything that needs precision, like complex multi-line instructions or detailed specs, the dedicated transcription tools still win.' },
  ]),
  block('Here\'s what I think is happening though. Anthropic isn\'t going to leave voice mode in this state. The foundation is there. The coding vocabulary tuning is smart. It recognizes your project name and git branch automatically. When accuracy catches up to Wispr Flow levels, it\'ll be the better option because you won\'t need a separate tool. Everything stays inside Claude Code.'),
  block('Worth trying. Not worth switching your whole workflow to. Yet.'),

  // H2: COMPUTER USE
  block('Computer Use is powerful but browsers are fighting it', 'h2'),
  block('This one launched March 23. Claude can now open apps on your computer, navigate a web browser, fill in spreadsheets, and interact with your screen. The promise: automate repetitive GUI tasks that can\'t be scripted. Data entry, form filling, testing flows.'),
  block('I tested it. And I hit a wall.'),
  block('The most commonly used browsers, Edge and Chrome, actively detect and block AI agents. There\'s a blocklist. When Claude tries to automate browser actions, these browsers catch it and shut it down.'),
  block('That\'s the gap right now. The feature works beautifully for non-browser tasks. Opening apps, moving files, filling out desktop forms. But the moment you need browser automation, which is probably 70% of the tasks you\'d want to automate, you run into resistance.'),
  block('The VA replacement math is compelling on paper. If Computer Use worked without friction, you could replace $15 to $25 an hour of virtual assistant work for tasks like data entry, form filling, and basic research. But right now, the browser blocks make it situational.'),
  block('Available on macOS for Pro and Max subscribers. Research preview. Worth watching. Not worth building your workflow around today.'),

  // H2: DISPATCH
  block('Dispatch lets you work from your phone (if you\'re technical enough to set it up)', 'h2'),
  blockWithLink([
    { text: '' },
    { text: 'Dispatch is a community-built relay system', href: 'https://www.mindstudio.ai/blog/what-is-claude-code-dispatch' },
    { text: ', not an official Anthropic product. It routes commands through Telegram to your local Claude Code instance. The idea: kick off a task from your phone between meetings and check the results later.' },
  ]),
  block('The use case makes sense. You\'re walking to your car after a client meeting. You pull out your phone and text Claude: "Draft a follow up email to the prospect from today\'s call and put it in the client folder." By the time you sit down, it\'s done.'),
  block('But here\'s the reality. It takes 20 to 30 minutes to set up. You need a Telegram bot, a local Node.js server, environment variables, and a process manager to keep it running. It\'s single-user only. And if someone gets access to your Telegram bot, they can run commands on your machine.'),
  block('Who this is for: technical power users who already run Claude Code on a dedicated machine and want mobile access. Not for someone who just started using Claude last week.'),

  // H2: CONTEXT ABOUT YOUR LIFE
  block('The feature nobody\'s talking about: giving Claude context about your life', 'h2'),
  block('Here\'s what I\'d actually tell a founder friend to do first. Forget the individual features. Start with this.'),
  blockWithLink([
    { text: 'Organize everything. Start with your calendar. Connect your Google Workspace via MCP. Load your projects, your client list, your goals into a CLAUDE.md file. Give Claude the full picture. If you haven\'t set up MCP servers yet, ' },
    { text: 'here\'s how they work', href: 'https://rsla.io/blog/mcp-servers-explained-ai-integrations' },
    { text: '.' },
  ]),
  block('When Claude can see your whole situation, it stops being a coding tool and starts being a strategic partner. "You have a 90-minute gap between these meetings. That\'s enough time to draft the proposal for Client X." "You\'ve been spending 3 hours a week on invoice follow ups. Here\'s an automation that handles it." "Based on your last 5 client calls, your highest-converting service is X. You should lead with that."'),
  blockWithLink([
    { text: 'That\'s how I run things at RSL/A. Rahul Lalia, 20 MCP servers connected, every client project in its own folder with a ' },
    { text: 'CLAUDE.md', href: 'https://rsla.io/blog/claude-md-file-ai-context-guide' },
    { text: ', calendar synced. Claude doesn\'t just help me code. It helps me think.' },
  ]),
  block('The features I covered in this post are tools. The real upgrade is giving Claude enough context to see what you can\'t.'),

  // H2: BOTTOM LINE
  block('What to adopt now, what to wait on', 'h2'),
  boldBlock([{ text: 'Adopt now:', bold: true }]),
  bulletItem([{ text: '1M context window (the single biggest productivity unlock)' }]),
  bulletItem([{ text: 'Auto Mode (stop babysitting permissions)' }]),
  bulletItem([{ text: 'Status Line + /rename (stop wasting time and tokens)' }]),
  boldBlock([{ text: 'Try when you need it:', bold: true }]),
  bulletItem([{ text: 'Voice Mode (good for quick prompts, not ready to replace Wispr Flow)' }]),
  bulletItem([{ text: 'Dispatch (if you\'re technical and want mobile access)' }]),
  boldBlock([{ text: 'Watch but wait:', bold: true }]),
  bulletItem([{ text: 'Computer Use (until browser detection gets resolved)' }]),
  blockWithLink([
    { text: 'If you\'re not sure which Claude product these features belong to, start with ' },
    { text: 'this guide', href: 'https://rsla.io/blog/anthropic-claude-products-guide' },
    { text: '. It covers all five products and when to use each one.' },
  ]),
  block('That\'s it.'),

  // FOOTER
  divider(),
  callout('tip', 'Start here if you\'re overwhelmed', 'Set up the 1M context window and Auto Mode first. Those two alone will change how you work with Claude. Everything else is bonus.'),
  ctaButton('Read the full Claude products guide', 'https://rsla.io/blog/anthropic-claude-products-guide', 'primary'),
];

// === DOCUMENT CREATION ===
const doc = {
  _id: 'drafts.',
  _type: 'blogPostV2',
  title: 'Claude has been shipping nonstop. These are the features that actually changed how I work.',
  slug: { _type: 'slug', current: 'claude-new-features-actually-worth-it' },
  excerpt: 'Anthropic shipped a dozen features in 45 days. I tested all of them. Here are the ones that actually changed my daily workflow and the ones that didn\'t.',
  pullQuote: 'The real upgrade is giving Claude enough context to see what you can\'t.',
  status: 'draft',
  showTableOfContents: true,
  featured: false,
  readingTime: 10,
  publishedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  author: { _type: 'reference', _ref: '88fc767a-b08d-4417-aa9e-528fc7972d4a' },
  categories: [
    { _type: 'reference', _ref: 'e8ef107c-d62e-4f54-ae47-f376e6b94548', _key: 'cat1' },
    { _type: 'reference', _ref: '2af0440c-d8d1-4d95-9bff-0802f9dc900b', _key: 'cat2' },
  ],
  relatedPosts: [
    { _type: 'reference', _ref: '8b58542f-4ec8-4d7d-ad6a-6681aa99a404', _key: 'rp1' },
    { _type: 'reference', _ref: '488617b8-9bbf-4ac1-afb5-123fc12ad76e', _key: 'rp2' },
    { _type: 'reference', _ref: '54a71f58-9f9f-410e-9e65-07dd06883274', _key: 'rp3' },
  ],
  seo: {
    metaTitle: 'New Claude Features Worth Using (Tested Daily)',
    metaDescription: 'I tested every Claude feature shipped in the last 45 days. The 1M context window and Auto Mode changed everything. Voice and Computer Use? Not yet.',
    keywords: [
      'claude new features 2026',
      'claude code auto mode',
      'claude 1m context window',
      'claude code voice mode',
      'claude computer use',
      'claude code status line',
      'claude dispatch',
    ],
  },
  faqSchema: [
    {
      _type: 'object', _key: k(),
      question: 'Is Claude Code Auto Mode safe to use?',
      answer: 'Auto Mode uses an AI safety classifier that reviews each action before executing. Safe actions proceed automatically while risky ones like mass file deletions or sensitive data extraction get blocked. It is safer than the old dangerously-skip-permissions flag but Anthropic recommends using it in isolated environments.',
    },
    {
      _type: 'object', _key: k(),
      question: 'How much does the 1M token context window cost?',
      answer: 'The 1M context window is available at standard pricing with no multiplier. Opus 4.6 costs $5 per million input tokens and $25 per million output tokens. Sonnet 4.6 costs $3 and $15 respectively. A 900K-token request is billed at the same per-token rate as a 9K one.',
    },
    {
      _type: 'object', _key: k(),
      question: 'Does Claude Code voice mode work on the free plan?',
      answer: 'Voice dictation requires a Claude.ai account login. It is not available when Claude Code is configured to use an Anthropic API key directly, Amazon Bedrock, Google Vertex AI, or Microsoft Foundry. It requires Claude Code v2.1.69 or later.',
    },
    {
      _type: 'object', _key: k(),
      question: 'Can Claude Computer Use work with Chrome and Edge?',
      answer: 'Currently Chrome and Edge actively detect and block AI agents attempting to automate browser actions. Computer Use works well for non-browser tasks like opening apps, moving files, and filling desktop forms but browser automation is limited by these blocklists.',
    },
    {
      _type: 'object', _key: k(),
      question: 'What is the difference between Auto Mode and dangerously-skip-permissions?',
      answer: 'The dangerously-skip-permissions flag hands all decision-making to Claude with zero safety checks. Auto Mode adds an AI safety classifier that reviews each action before it runs, blocking risky operations like mass file deletions or sensitive data extraction while letting safe actions proceed automatically.',
    },
  ],
  body,
};

async function create() {
  const mutations = [{ create: doc }];
  const res = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ mutations }),
    }
  );
  const result = await res.json();
  if (res.ok) {
    console.log(`Document created. ${body.length} body blocks.`);
    console.log('ID:', result.results?.[0]?.id);
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.error('Failed:', JSON.stringify(result, null, 2));
  }
}

create();
