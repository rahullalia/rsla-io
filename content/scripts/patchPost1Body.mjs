/**
 * Creates Post 1 (install Claude Code) in Sanity with full Portable Text body.
 * Run: SANITY_TOKEN=xxx node content/scripts/patchPost1Body.mjs
 */

const PROJECT_ID = 'yz25oyux';
const DATASET = 'production';
const TOKEN = process.env.SANITY_TOKEN;

if (!TOKEN) { console.error('Set SANITY_TOKEN env var'); process.exit(1); }

let kc = 0;
const k = () => `p1${Date.now().toString(36)}${(kc++).toString(36)}`;

function block(text, style = 'normal') {
  return { _type: 'block', _key: k(), style, markDefs: [], children: [{ _type: 'span', _key: k(), text, marks: [] }] };
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

function codeBlock(code, language = 'bash') {
  return { _type: 'code', _key: k(), code, language };
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

const body = [
  // OPENING
  blockWithLink([
    { text: 'I started using Claude Code inside VS Code. The extension, the sidebar, the inline diffs. It was nice. Comfortable. Familiar.' },
  ]),
  block('That lasted about two weeks.'),
  blockWithLink([
    { text: 'Then I switched to running Claude Code directly in ' },
    { text: 'Ghostty', href: 'https://ghostty.org/' },
    { text: ', a GPU-accelerated terminal built by Mitchell Hashimoto (the creator of Terraform and Vagrant). Split panes with Cmd+D, zero config out of the box, hundreds of themes that auto-switch between light and dark mode. The same terminal that the developers working on Claude Code itself use.' },
  ]),
  block('I haven\'t opened the VS Code extension since.'),
  blockWithLink([
    { text: 'But here\'s the thing. Whether you use VS Code, the terminal, the Desktop app, or JetBrains, the actual install takes less than 3 minutes. Most of that time is just waiting for the download. The part that makes Claude Code useful? That\'s the setup after the install. And that\'s where most guides stop too early.' },
  ]),
  block('Here\'s the full walkthrough. Install, setup, and the first thing you should do before writing a single prompt.'),

  // H2: MAC
  block('Install Claude Code on Mac (the one-liner)', 'h2'),
  block('Open your terminal and run this:'),
  codeBlock('curl -fsSL https://claude.ai/install.sh | bash', 'bash'),
  block('That\'s it. The native installer downloads the binary, adds it to your PATH, and sets up auto-updates so you\'re always on the latest version.'),
  block('If you prefer Homebrew:'),
  codeBlock('brew install --cask claude-code', 'bash'),
  block('One difference. Homebrew installs don\'t auto-update. You\'ll need to run brew upgrade claude-code manually to get new features and security fixes. The native install handles that for you.'),
  block('After the install finishes, navigate to any project folder and type:'),
  codeBlock('cd your-project\nclaude', 'bash'),
  blockWithLink([
    { text: 'First time you run it, Claude Code prompts you to log in with your ' },
    { text: 'Claude account', href: 'https://claude.com/pricing' },
    { text: '. Sign in, and you\'re live.' },
  ]),

  // H2: WINDOWS
  block('Install Claude Code on Windows', 'h2'),
  blockWithLink([
    { text: 'Windows needs one prerequisite: ' },
    { text: 'Git for Windows', href: 'https://git-scm.com/downloads/win' },
    { text: '. Install that first if you don\'t have it.' },
  ]),
  block('Then open PowerShell and run:'),
  codeBlock('irm https://claude.ai/install.ps1 | iex', 'bash'),
  block('Or if you prefer Windows CMD:'),
  codeBlock('curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd', 'bash'),
  block('WinGet works too:'),
  codeBlock('winget install Anthropic.ClaudeCode', 'bash'),
  block('Same deal as Homebrew. WinGet installs don\'t auto-update. The native PowerShell install does.'),

  // H2: VS CODE
  block('Install Claude Code in VS Code (the visual route)', 'h2'),
  block('This is the easiest entry point if you\'ve never used a terminal tool before.'),
  block('Open VS Code. Hit Cmd+Shift+X (Mac) or Ctrl+Shift+X (Windows/Linux) to open the Extensions panel. Search for "Claude Code" and install the one by Anthropic.'),
  block('After installing, open the Command Palette (Cmd+Shift+P or Ctrl+Shift+P), type "Claude Code", and select Open in New Tab.'),
  block('You get inline diffs, @-mentions to reference files, plan review, and conversation history right inside your editor. It\'s a good way to start.'),
  block('The same extension works in Cursor too. Just search "Claude Code" in the Cursor extensions panel.'),
  block('And you know what? I\'d recommend starting here if you\'re new to Claude Code. Get comfortable with what it can do. See the diffs, watch it edit files, get a feel for the workflow. Then when you\'re ready for more speed and control, move to the terminal.'),

  // H2: JETBRAINS
  block('Install Claude Code in JetBrains (IntelliJ, PyCharm, WebStorm)', 'h2'),
  blockWithLink([
    { text: 'Install the ' },
    { text: 'Claude Code plugin', href: 'https://plugins.jetbrains.com/plugin/27310-claude-code-beta-' },
    { text: ' from the JetBrains Marketplace and restart your IDE. That\'s the whole process.' },
  ]),
  block('It gives you interactive diff viewing and selection context sharing. Not as full-featured as VS Code or the terminal, but it works if JetBrains is your home.'),

  // H2: WHY TERMINAL
  block('Why I use the terminal (and why you might want to, eventually)', 'h2'),
  block('VS Code is comfortable. The terminal is powerful.'),
  block('In the terminal, Claude Code runs with zero UI overhead. No sidebar competing for screen space. No extension loading. Just you, the prompt, and your codebase.'),
  blockWithLink([
    { text: 'But the real reason I switched? ' },
    { text: 'Ghostty', href: 'https://ghostty.org/' },
    { text: '.' },
  ]),
  block('Cmd+D splits your terminal horizontally. Cmd+Shift+D splits vertically. So I\'ll have Claude Code running in one pane, my project files in another, and a test runner in a third. All in one window.'),
  block('Ghostty 1.3.0 (released March 9, 2026) added scrollback search, native scrollbars, and click-to-move-cursor in shell prompts. It also lets you control working directory inheritance for new tabs and splits independently, which matters when you\'re jumping between client projects.'),
  block('It\'s platform-native, not Electron. GPU-accelerated rendering. Starts instantly. And the developers building Claude Code use it themselves, which tells you something about how well these two tools play together.'),
  block('If you want to try the terminal route, install Ghostty from ghostty.org, then install Claude Code with the curl command above. Open Ghostty, cd into your project, type claude, and you\'re running.'),

  // H2: FIRST THING AFTER INSTALL
  block('The first thing to do after installing (most guides skip this)', 'h2'),
  block('You\'ve installed Claude Code. You\'ve typed claude in a project folder. Now what?'),
  block('Before you ask it to build anything, do this:'),
  block('Create a file called CLAUDE.md in your project root. This is the instruction file Claude Code reads at the start of every session. It tells Claude about your project: what tech stack you use, what conventions to follow, where things live, what to avoid.'),
  block('Here\'s a minimal starting point:'),
  codeBlock('# Project: [your project name]\n\n## Tech stack\n- [framework, language, database]\n\n## Rules\n- [coding conventions you care about]\n- [files or folders to never modify]\n\n## Context\n- [what this project does in 2 sentences]', 'bash'),
  block('Even something that basic makes a huge difference. Without a CLAUDE.md, Claude Code works blind. With one, it works informed.'),
  blockWithLink([
    { text: 'I wrote a full deep dive on this: ' },
    { text: 'The CLAUDE.md trick that serious teams are using to 10x their AI output', href: 'https://rsla.io/blog/claude-md-file-ai-context-guide' },
    { text: '.' },
  ]),
  block('At RSL/A, Rahul Lalia here, every single client project has its own CLAUDE.md. Some of them are 500+ lines long. They include naming conventions, API keys location, deployment instructions, brand voice guidelines, even dietary restrictions for a meal planning project. The more context you give, the less you have to repeat yourself.'),

  // H2: MCP
  block('Connect your first MCP server (optional but worth it)', 'h2'),
  block('MCP stands for Model Context Protocol. It lets Claude Code connect to external tools: GitHub, Google Drive, Notion, Supabase, Slack, databases, anything with an API.'),
  block('You don\'t need MCP to use Claude Code. But once you set up your first server, you\'ll wonder how you worked without it.'),
  block('The simplest one to start with is the Git MCP server. It gives Claude Code deeper access to your git history, branches, and diffs beyond what the basic CLI integration offers.'),
  blockWithLink([
    { text: 'I run 20 MCP servers daily. If you want to go deeper, here\'s my full breakdown: ' },
    { text: 'MCP Servers Explained: The Universal Plug That Connects AI to Everything', href: 'https://rsla.io/blog/mcp-servers-explained-ai-integrations' },
    { text: '.' },
  ]),

  // H2: QUICK REFERENCE
  block('Quick reference: every install method in one place', 'h2'),
  block('Mac (terminal):', 'h3'),
  codeBlock('curl -fsSL https://claude.ai/install.sh | bash', 'bash'),
  block('Mac (Homebrew):', 'h3'),
  codeBlock('brew install --cask claude-code', 'bash'),
  block('Windows (PowerShell):', 'h3'),
  codeBlock('irm https://claude.ai/install.ps1 | iex', 'bash'),
  block('Windows (WinGet):', 'h3'),
  codeBlock('winget install Anthropic.ClaudeCode', 'bash'),
  block('VS Code / Cursor: Search "Claude Code" in Extensions (Cmd+Shift+X)'),
  blockWithLink([
    { text: 'JetBrains: Install from ' },
    { text: 'JetBrains Marketplace', href: 'https://plugins.jetbrains.com/plugin/27310-claude-code-beta-' },
  ]),
  block('Then in any project:'),
  codeBlock('cd your-project\nclaude', 'bash'),
  blockWithLink([
    { text: 'If you\'re not sure ' },
    { text: 'which Claude product', href: 'https://rsla.io/blog/anthropic-claude-products-guide' },
    { text: ' you need, or whether Claude Code is even the right tool for your use case, start with that guide. It covers all five Anthropic products and when to reach for each one.' },
  ]),
  block('That\'s it. Three minutes to install. A lifetime of "how did I ever code without this."'),

  // FOOTER
  divider(),
  callout('tip', 'New to Claude Code?', 'Start with VS Code. Get comfortable. Then move to Ghostty when you want more control. The install is the same either way.'),
  ctaButton('Read the full Claude products guide', 'https://rsla.io/blog/anthropic-claude-products-guide', 'primary'),
];

const doc = {
  _id: 'drafts.',
  _type: 'blogPostV2',
  title: 'How to install Claude Code in under 3 minutes (Mac, Windows, VS Code, CLI)',
  slug: { _type: 'slug', current: 'how-to-install-claude-code' },
  excerpt: 'Install Claude Code on Mac, Windows, VS Code, or any terminal in under 3 minutes. Plus the setup steps most guides skip: CLAUDE.md, MCP servers, and why Ghostty matters.',
  pullQuote: 'Three minutes to install. A lifetime of how did I ever code without this.',
  status: 'draft',
  showTableOfContents: true,
  featured: false,
  readingTime: 9,
  publishedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  author: { _type: 'reference', _ref: '88fc767a-b08d-4417-aa9e-528fc7972d4a' },
  categories: [
    { _type: 'reference', _ref: 'e8ef107c-d62e-4f54-ae47-f376e6b94548', _key: 'cat1' },
    { _type: 'reference', _ref: '2af0440c-d8d1-4d95-9bff-0802f9dc900b', _key: 'cat2' },
  ],
  relatedPosts: [
    { _type: 'reference', _ref: '8b58542f-4ec8-4d7d-ad6a-6681aa99a404', _key: 'rp1' },
    { _type: 'reference', _ref: '45cf75ee-807f-4b11-8bb5-8df18d301347', _key: 'rp2' },
    { _type: 'reference', _ref: 'b23d8fed-dc0d-4cd9-8d04-558868b02d04', _key: 'rp3' },
  ],
  seo: {
    metaTitle: 'How to Install Claude Code (Mac, Windows, VS Code)',
    metaDescription: 'Install Claude Code in under 3 minutes on Mac, Windows, or VS Code. Includes the post-install setup most guides skip: CLAUDE.md and MCP servers.',
    keywords: [
      'how to install claude code',
      'install claude code mac',
      'install claude code windows',
      'claude code vs code extension',
      'claude code cli install',
      'claude code ghostty',
      'how to start claude code',
    ],
  },
  faqSchema: [
    { _type: 'object', _key: k(), question: 'How do I install Claude Code on Mac?', answer: 'Run curl -fsSL https://claude.ai/install.sh | bash in your terminal. This is the recommended method as it auto-updates. Alternatively use Homebrew: brew install --cask claude-code (manual updates required).' },
    { _type: 'object', _key: k(), question: 'How do I install Claude Code on Windows?', answer: 'First install Git for Windows, then run irm https://claude.ai/install.ps1 | iex in PowerShell. You can also use WinGet: winget install Anthropic.ClaudeCode. The PowerShell method auto-updates while WinGet does not.' },
    { _type: 'object', _key: k(), question: 'Can I use Claude Code in VS Code?', answer: 'Yes. Search for Claude Code in the VS Code Extensions panel (Cmd+Shift+X) and install the Anthropic extension. It provides inline diffs, @-mentions, plan review, and conversation history. The same extension also works in Cursor.' },
    { _type: 'object', _key: k(), question: 'Is Claude Code free to install?', answer: 'Claude Code is free to install but requires a Claude account to use. The free tier has limited usage. Most daily users need the Pro ($20/month) or Max ($100 to $200/month) plan for meaningful work.' },
    { _type: 'object', _key: k(), question: 'What is a CLAUDE.md file and do I need one?', answer: 'CLAUDE.md is a markdown file in your project root that Claude Code reads at the start of every session. It contains your project context, coding conventions, and instructions. You do not need one to start, but it dramatically improves Claude Code output by giving it informed context about your project.' },
  ],
  body,
};

async function create() {
  const res = await fetch(`https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ mutations: [{ create: doc }] }),
  });
  const result = await res.json();
  if (res.ok) {
    console.log(`Created. ${body.length} body blocks.`);
    console.log('ID:', result.results?.[0]?.id || 'check Sanity');
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.error('Failed:', JSON.stringify(result, null, 2));
  }
}

create();
