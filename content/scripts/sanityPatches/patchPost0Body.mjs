/**
 * Patches the body of Post 0 (anthropic-claude-products-guide) with full Portable Text.
 * Run: node content/scripts/patchPost0Body.mjs
 */

const DOC_ID = 'drafts.8b58542f-4ec8-4d7d-ad6a-6681aa99a404';
const PROJECT_ID = 'yz25oyux';
const DATASET = 'production';
const TOKEN = process.env.SANITY_TOKEN;

if (!TOKEN) {
  console.error('Set SANITY_TOKEN env var first. Get it from 4-Resources/mcp/sanity.env');
  process.exit(1);
}

// Helpers
let keyCounter = 0;
const k = () => `k${Date.now().toString(36)}${(keyCounter++).toString(36)}`;

function block(text, style = 'normal', marks = []) {
  return {
    _type: 'block',
    _key: k(),
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: k(), text, marks }],
  };
}

function blockWithLink(segments) {
  // segments: [{text, href?, blank?}, ...]
  const markDefs = [];
  const children = segments.map(seg => {
    if (seg.href) {
      const markKey = k();
      markDefs.push({ _key: markKey, _type: 'link', href: seg.href, blank: seg.blank ?? true });
      return { _type: 'span', _key: k(), text: seg.text, marks: [markKey] };
    }
    if (seg.bold) {
      return { _type: 'span', _key: k(), text: seg.text, marks: ['strong'] };
    }
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

function listItem(segments, level = 1) {
  const markDefs = [];
  const children = segments.map(seg => {
    if (seg.href) {
      const mk = k();
      markDefs.push({ _key: mk, _type: 'link', href: seg.href, blank: true });
      return { _type: 'span', _key: k(), text: seg.text, marks: [mk] };
    }
    return { _type: 'span', _key: k(), text: seg.text, marks: seg.bold ? ['strong'] : [] };
  });
  return { _type: 'block', _key: k(), style: 'normal', listItem: 'number', level, markDefs, children };
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

// Build the full body
const body = [
  // === OPENING ===
  block('I tried to build my entire website using Claude.ai.'),
  block('Sat there for a couple of hours, pasting code back and forth, copying from Artifacts, trying to get a React app off the ground. And then the context ran out. Back then we didn\'t have the 1 million token context window. That\'s something super new. So every 15 to 20 minutes, Claude would forget what we were building together.'),
  blockWithLink([
    { text: 'Then I found ' },
    { text: 'Claude Code', href: 'https://code.claude.com/docs/en/overview#terminal' },
    { text: '.' },
  ]),
  block('Three months later, rsla.io was live. Built with React 19, GSAP animations, Sanity CMS, 60 blog posts, 11 case studies, pre-rendered pages for AI search visibility. All from the terminal.'),
  block('The problem wasn\'t Claude. The problem was that I was using the wrong Claude product for the job. And if you\'ve ever said "I tried Claude and it didn\'t work," there\'s a good chance you did the same thing.'),
  block('Anthropic doesn\'t make one product. They make five. And they\'re shockingly different from each other. Here\'s the breakdown from someone who uses all of them daily.'),

  // === H2: QUICK REFERENCE ===
  block('The quick reference (save this)', 'h2'),

  // Table as callout (Sanity doesn't support tables)
  callout('info', 'Claude products at a glance',
    'Claude.ai: Web chat app. Free/Pro $20/Max $100 to $200. Best for quick conversations, Projects, Artifacts.\n\n' +
    'Claude Desktop: Native Mac/Windows app. Same subscription. Best for MCP support (connects to external tools).\n\n' +
    'Claude Code: Agentic coding tool for terminal, IDE, desktop, web. Pro/Max or API credits. Best for reading codebases, editing files, running commands.\n\n' +
    'Claude Co-Work: Background agent inside Claude.ai. Same subscription. Best for async tasks without the terminal.\n\n' +
    'Claude API: Developer API, pay per token. Best for automations with no human in the loop.'
  ),

  blockWithLink([
    { text: 'For current pricing details across all tiers, check ' },
    { text: 'Anthropic\'s pricing page', href: 'https://claude.com/pricing' },
    { text: '.' },
  ]),
  block('Now let me break each one down with how I actually use them. Not the marketing page version. The real version.'),

  // === H2: DESKTOP VS WEB ===
  block('Claude.ai and Claude Desktop are basically the same thing (with one key difference)', 'h2'),
  block('I almost never open Claude.ai anymore. The Desktop app replaced it completely.'),
  block('They\'re the same product. Same models, same subscription, same features. The Desktop app just runs natively on your Mac or Windows instead of in a browser tab. One less tab fighting for your attention.'),
  blockWithLink([
    { text: 'The real difference? Claude Desktop supports ' },
    { text: 'MCP', href: 'https://modelcontextprotocol.io/docs/getting-started/intro' },
    { text: '. That stands for Model Context Protocol. It\'s an open standard for connecting AI tools to external data sources and tools. Think: your file system, databases, APIs, GitHub, Google Calendar. Claude.ai in the browser can\'t do any of that.' },
  ]),
  block('But honestly? I use the Desktop app for quick things. A search I need answered fast. A short email I need reworded. A question about a tax form. Tasks where I don\'t need to load an entire project\'s worth of context.'),
  block('Five minutes, in and out. That\'s the Desktop app for me.'),
  blockWithLink([
    { text: 'If you want to understand MCP in more depth, I wrote a full breakdown: ' },
    { text: 'MCP Servers Explained: The Universal Plug That Connects AI to Everything', href: 'https://rsla.io/blog/mcp-servers-explained-ai-integrations' },
    { text: '.' },
  ]),

  // === H2: CLAUDE CODE ===
  block('Claude Code is where the real work happens', 'h2'),
  block('Here\'s the thing most people get confused about. Claude Code is not an IDE.'),
  block('Claude Code runs inside an IDE. There\'s a difference.'),
  block('Think of it like this. An IDE like Visual Studio Code or Antigravity is the driver. Claude Code is the car. And you\'re the one telling it where to go. You can\'t just sit in the back seat and arrive at your destination. You need all three.'),
  block('I use Claude Code for probably 80% to 90% of my working day. Every client project, every proposal, every automation, every piece of the website you\'re reading right now.'),
  block('Why? Context.'),
  blockWithLink([
    { text: 'When I open a project folder in Claude Code, it reads everything. The CLAUDE.md file with all my instructions. The CSV files with client data. The PDFs. The images. The entire codebase. It knows what I\'m working on before I type a single word. If you haven\'t heard of CLAUDE.md files, ' },
    { text: 'here\'s why they matter', href: 'https://rsla.io/blog/claude-md-file-ai-context-guide' },
    { text: '.' },
  ]),
  block('And you know what? The most common mistake I see is people running Claude Code inside the Claude Desktop app. It sounds like it should work. It doesn\'t. Not well, anyway. The Desktop app acts like a shell around it and limits what Claude Code can actually do.'),
  block('If you\'re using Claude Code, use it in one of three places:'),

  // Numbered list
  listItem([
    { text: 'Inside VS Code', bold: true },
    { text: ' with the Claude Code extension. Easiest starting point. You get a nice interface and your file tree right there.' },
  ]),
  listItem([
    { text: 'Inside Antigravity', bold: true },
    { text: ' or another AI-native IDE. Similar experience, built for this.' },
  ]),
  listItem([
    { text: 'In your terminal directly.', bold: true },
    { text: ' This is what I use. Specifically, I use ' },
    { text: 'Ghostty', href: 'https://ghostty.org/' },
    { text: '. It\'s a terminal emulator built by Mitchell Hashimoto (the guy behind HashiCorp, Terraform, Vagrant). GPU-accelerated rendering, platform-native UI instead of Electron, hundreds of built-in themes that auto-switch between light and dark mode. And it starts with zero configuration. You just open it and go. I\'ve tried iTerm2, Warp, Hyper. Ghostty is the one that stuck. Fast, clean, no bloat.' },
  ]),

  block('The terminal version gives you the most control. It\'s not pretty. But it\'s the most powerful version of Claude Code you can get.'),
  blockWithLink([
    { text: 'For a deeper look at what Claude Code can actually do, I wrote a full guide: ' },
    { text: 'What Is Claude Code? The Non-Developer\'s Guide', href: 'https://rsla.io/blog/what-is-claude-code-guide' },
    { text: '.' },
  ]),

  // === H2: API ===
  block('The API is for automations you never want to think about again', 'h2'),
  block('The Claude API is a completely different product. It\'s not a chat interface. It\'s not a coding tool. It\'s a way to put Claude inside your own software.'),
  block('I use different models with different instructions for different jobs. That\'s the key. You\'re not having a conversation. You\'re programming Claude to do a specific task, the same way, every time.'),
  block('Some examples from my actual setup:'),

  boldBlock([
    { text: 'Cron jobs.', bold: true },
    { text: ' I have scheduled tasks that run at specific hours every day or every week. One of them generates client proposals using Claude Opus with extended thinking. Another one extracts data from incoming PDFs.' },
  ]),
  blockWithLink([
    { text: 'The expense vault.', bold: true },
    { text: ' ' },
    { text: 'I built an expense tracker', href: 'https://www.linkedin.com/posts/rahullalia_this-is-probably-the-time-when-youre-sitting-activity-7442302821716307968-vzJY' },
    { text: ' that uses Claude\'s image recognition to read receipts and invoices. You upload a PDF or photo, and Claude API reads it, pulls out the vendor name, amount, date, and category. Optical character recognition, but smarter.' },
  ]),
  boldBlock([
    { text: 'Web app backends.', bold: true },
    { text: ' Some of my client-facing tools have Claude running behind the scenes. The user never sees it. They fill out a form, hit submit, and Claude processes the request on the backend.' },
  ]),

  block('Here\'s the honest truth about the learning curve. If you\'re not a developer, the API isn\'t where you start. You need to write code to use it. Python or JavaScript, usually. There\'s no chat window. There\'s no UI. You write instructions in code, send them to Claude, and get a response back.'),
  block('But if you are technical, or you have a developer who can set it up for you, the API is where the real leverage lives. Set it up once, and it runs forever.'),

  // === H2: CO-WORK ===
  block('Co-Work is Claude Code for people who don\'t want the terminal', 'h2'),
  block('I\'m going to be honest. I don\'t use Co-Work.'),
  block('Not because it\'s bad. Because it doesn\'t fit how I work.'),
  block('Claude Desktop handles the quick, easy stuff. Claude Code handles the complex, deep work. Co-Work lives in the middle. It\'s basically Claude Code\'s capabilities wrapped in a nicer user interface, running inside Claude.ai as a background agent.'),
  block('For someone who wants to hand Claude a bigger task ("research these 10 competitors and build me a spreadsheet") but doesn\'t want to open a terminal, Co-Work makes sense. It can work on things asynchronously while you go do something else.'),
  block('I just don\'t need that middle ground. I\'m either in Claude Code with full context loaded, or I\'m in Desktop asking a quick question. There\'s no in-between in my workflow.'),
  block('If you\'re not technical and the terminal feels intimidating, Co-Work might actually be the right product for you. It gives you a lot of Claude Code\'s power without the learning curve.'),
  blockWithLink([
    { text: 'For a more detailed comparison of these three, check out: ' },
    { text: 'Claude Code, Claude Cowork, or Just Claude? Here\'s Which One You Actually Need', href: 'https://rsla.io/blog/claude-code-vs-cowork-vs-claude-app' },
    { text: '.' },
  ]),

  // === H2: WHICH ONE ===
  block('Which one should you actually use?', 'h2'),
  block('Forget the feature comparison for a second. Here\'s how I\'d actually steer you based on who you are.'),

  boldBlock([
    { text: 'If you\'re a founder or business owner', bold: true },
    { text: ' who wants to automate something: Start with Claude Desktop (it\'s included in the free tier). Pick a task you do every single day that eats your time. Talk to Claude like you\'d talk to a friend. "Hey, I spend 2 hours every morning doing X. Can you help me automate that?" When you get stuck, paste the error message in. Claude will walk you through it.' },
  ]),
  boldBlock([
    { text: 'If you\'re a marketer or content creator:', bold: true },
    { text: ' Claude Desktop or Co-Work. You don\'t need the terminal. You need a fast collaborator for writing, research, and brainstorming.' },
  ]),
  boldBlock([
    { text: 'If you\'re a developer:', bold: true },
    { text: ' Claude Code. No contest. Start in VS Code if you want training wheels. Move to the terminal when you\'re ready. Load your CLAUDE.md. Connect your MCP servers. You\'ll wonder how you ever worked without it.' },
  ]),
  boldBlock([
    { text: 'If you\'re building a product or SaaS:', bold: true },
    { text: ' Claude API. You need Claude running inside your software, not alongside it. Different models for different tasks. Opus for complex reasoning, Sonnet for speed, Haiku for cheap high-volume jobs.' },
  ]),
  boldBlock([
    { text: 'One pricing note.', bold: true },
    { text: ' A lot of people start on the Pro plan at $20 a month. That\'s fine for Claude Desktop and Claude.ai. But if you want to use Claude Code seriously, you\'re going to hit the usage limits fast. The Max plan ($100 or $200 per month) is where Claude Code actually becomes usable for daily work. Don\'t fight the limits for weeks before upgrading. I did that. It\'s a waste of time.' },
  ]),

  // === H2: CLOSING ===
  block('The real mistake isn\'t picking the wrong product', 'h2'),
  block('It\'s not knowing the products exist in the first place.'),
  block('Most people hear "Claude" and think it\'s one thing. One chatbot. One tool. And when that one tool doesn\'t do what they need, they say "Claude doesn\'t work" and move on.'),
  block('Claude works. You might just be sitting in the back seat of a parked car, wondering why you\'re not moving.'),
  block('Pick the right product. Match it to the task. And if you\'re not sure where to start, go back to the table at the top of this post.'),
  block('That\'s it.'),

  // === FOOTER ===
  divider(),
  callout('tip', 'Bookmark this before you forget', 'Save or screenshot the quick reference above. Most people only realize they picked the wrong Claude product after they\'ve already burned hours fighting the tool.'),
  ctaButton('Learn how to write a CLAUDE.md file', 'https://rsla.io/blog/claude-md-file-ai-context-guide', 'primary'),
];

// Patch via Sanity HTTP API
async function patch() {
  const mutations = [{
    patch: {
      id: DOC_ID,
      set: { body },
    },
  }];

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
    console.log(`Body patched successfully. ${body.length} blocks written.`);
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.error('Patch failed:', JSON.stringify(result, null, 2));
  }
}

patch();
