/**
 * Creates Post 2 (Claude pricing / is claude free) in Sanity with full Portable Text body.
 * Run: SANITY_TOKEN=xxx node content/scripts/patchPost2Body.mjs
 */

const PROJECT_ID = 'yz25oyux';
const DATASET = 'production';
const TOKEN = process.env.SANITY_TOKEN;

if (!TOKEN) { console.error('Set SANITY_TOKEN env var'); process.exit(1); }

let kc = 0;
const k = () => `p2${Date.now().toString(36)}${(kc++).toString(36)}`;

function block(text, style = 'normal') {
  return { _type: 'block', _key: k(), style, markDefs: [], children: [{ _type: 'span', _key: k(), text, marks: [] }] };
}

function blockWithChildren(segments, style = 'normal') {
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
  return { _type: 'block', _key: k(), style, markDefs, children };
}

function listItem(segments, level = 1) {
  const b = blockWithChildren(segments);
  b.listItem = 'bullet';
  b.level = level;
  return b;
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
  block('I started on the $20 plan. Like everyone else.'),
  block('It took maybe two weeks before I hit my first rate limit mid-project. I was building a client website, Claude Code was halfway through refactoring a component, and everything just stopped. "You\'ve reached your usage limit." That\'s it. No warning. No countdown. Just a wall.'),
  blockWithChildren([
    { text: 'So is Claude free? Technically, yes. Anthropic offers a free tier and it\'s more generous than you\'d expect. But if you\'re asking because you want to actually use Claude for work, the honest answer is more complicated. And the pricing page doesn\'t tell you the full story.' },
  ]),
  blockWithChildren([
    { text: 'I\'ve gone from Free to Pro to Max 5x to Max 20x over the past year. I\'ve paid Anthropic over $2,400 in subscriptions alone. Here\'s what I wish someone had told me before I started.' },
  ]),

  // H2: FREE TIER
  block('What you actually get for free', 'h2'),
  block('Claude\'s free tier is surprisingly solid. Since February 2026, Anthropic opened up features that used to be Pro-only:'),
  listItem([{ text: 'Claude Sonnet 4.5', bold: true }, { text: ' (same model paid users get, just with tighter limits)' }]),
  listItem([{ text: 'Projects', bold: true }, { text: ' (organize conversations with persistent context)' }]),
  listItem([{ text: 'Artifacts', bold: true }, { text: ' (interactive documents and code generation)' }]),
  listItem([{ text: 'App Connectors', bold: true }, { text: ' (Notion, Slack, Google Workspace, Figma integrations)' }]),
  listItem([{ text: 'Web search', bold: true }]),
  listItem([{ text: 'File uploads', bold: true }, { text: ' (up to 20 files per chat, 30MB max)' }]),
  block('That\'s a lot. Honestly? For someone just trying Claude out, it\'s enough to get a real feel for what it can do.'),
  block('Here\'s where it breaks down.'),
  block('You get roughly 15 to 40 messages per 5-hour window depending on message length. Longer conversations with attachments drop that to maybe 20 to 30 per day. There\'s no visible counter. No warning as you approach the limit. You just get locked out.'),
  block('And you don\'t get access to Opus (the most capable model), Claude Code, extended thinking, or Co-Work. For casual use that\'s fine. For building anything real, you\'ll hit the ceiling fast.'),

  // H2: PRO
  block('The $20 Pro plan (where most people start and where most people get stuck)', 'h2'),
  block('Pro is $20 a month ($17 if you pay annually). Here\'s what it unlocks on top of free:'),
  listItem([{ text: 'Claude Opus 4.6', bold: true }, { text: ' (the strongest model for complex reasoning)' }]),
  listItem([{ text: 'Claude Code', bold: true }, { text: ' (terminal-based agentic coding)' }]),
  listItem([{ text: 'Extended thinking', bold: true }, { text: ' (lets Claude reason through harder problems)' }]),
  listItem([{ text: 'Co-Work', bold: true }, { text: ' (background agent that works on tasks asynchronously)' }]),
  listItem([{ text: '1M context window', bold: true }, { text: ' beta for Opus and Sonnet 4.6' }]),
  listItem([{ text: '5x the usage', bold: true }, { text: ' of the free tier' }]),
  block('For $20, that\'s genuinely a lot of value. And if you\'re a business owner who isn\'t writing code all day, Pro might be all you need.'),
  block('But here\'s the thing.'),
  block('If you\'re using Claude Code for real development work, Pro\'s limits will catch you. I was maybe two weeks in before I started hitting rate limits regularly. You\'re mid-build, Claude is scanning files, editing code, running tests. That loop burns through tokens fast. And when it stops, you stop.'),
  block('The 5-hour rolling window means your usage doesn\'t reset at midnight like you\'d expect. It rolls. So if you burned through your limit at 2 PM, you\'re waiting until 7 PM. No dashboard to track it. No warning before it hits.'),
  blockWithChildren([
    { text: 'Rahul Lalia here at RSL/A. I\'ve been through every tier. Pro is where I\'d tell anyone to start. But if you\'re using Claude Code daily, know that the upgrade conversation is coming.' },
  ]),

  // [INLINE IMAGE 1 PLACEHOLDER]

  // H2: CLAUDE CODE BILLING
  block('Claude Code isn\'t a separate bill (but it eats from the same plate)', 'h2'),
  block('This is the biggest source of confusion I see. People think Claude Code has its own pricing. It doesn\'t.'),
  block('Claude Code draws from the exact same token pool as your claude.ai conversations. Use Claude Code heavily in the morning, and you\'ll have less capacity for regular chat in the afternoon. They share one budget.'),
  block('Three things most people don\'t realize:'),
  blockWithChildren([
    { text: 'The $50 "free" credit isn\'t free.', bold: true },
    { text: ' When you activate it, you\'re enrolled in pay-as-you-go billing on top of your subscription. After the credit runs out (or expires after 60 days), charges keep going unless you manually disable it. That\'s $5 per million input tokens and $25 per million output tokens. It adds up.' },
  ]),
  blockWithChildren([
    { text: 'Agent teams multiply your burn rate.', bold: true },
    { text: ' Running a 3-agent team in Claude Code uses roughly 7x more tokens than a single agent session. I\'ve seen people blow through their weekly limit in an afternoon running multi-agent workflows without realizing it.' },
  ]),
  blockWithChildren([
    { text: 'All Claude surfaces share the pool.', bold: true },
    { text: ' Claude.ai, Claude Code, Claude Desktop, Claude mobile. Same bucket. Every conversation counts against the same limit.' },
  ]),
  blockWithChildren([
    { text: 'According to ' },
    { text: 'Anthropic\'s own data', href: 'https://www.ssdnodes.com/blog/claude-code-pricing-in-2026-every-plan-explained-pro-max-api-teams/' },
    { text: ', the average Claude Code user costs about $6 per developer per day, with 90% staying under $12 per day. At full-time usage, that projects to $100 to $200 a month. Which is exactly why Max exists.' },
  ]),

  // H2: MAX
  block('Max at $100 and $200: when the math actually makes sense', 'h2'),
  block('Here\'s how the plans stack up:'),
  listItem([{ text: 'Free ($0):', bold: true }, { text: ' 1x usage, Sonnet only, no Claude Code' }]),
  listItem([{ text: 'Pro ($20/mo):', bold: true }, { text: ' 5x usage, all models including Opus, Claude Code included' }]),
  listItem([{ text: 'Max 5x ($100/mo):', bold: true }, { text: ' 25x usage (5x Pro), same models, priority access' }]),
  listItem([{ text: 'Max 20x ($200/mo):', bold: true }, { text: ' 100x usage (20x Pro), maximum priority' }]),
  block('Same models. Same features. You\'re paying for runway.'),
  block('I went through every step of this ladder. Started on Pro, hit limits constantly, upgraded to Max 5x at $100. Thought it would be enough.'),
  block('It wasn\'t.'),
  block('The gap between what I needed and what 5x gave me was maybe 2x more. Not 4x more. But there\'s no 10x plan. So I had to jump all the way to the $200 Max 20x plan.'),
  block('And you know what? I barely hit 50% of my usage now.'),
  block('There\'s a missing tier here. Something like $150 for 10x would be perfect for developers who outgrow 5x but don\'t need 20x. Anthropic, if you\'re reading this.'),

  // [INLINE IMAGE 2 PLACEHOLDER]

  blockWithChildren([
    { text: 'The ROI math that made the decision easy.', bold: true },
    { text: ' My hourly rate varies between $70 and $150 depending on the project. Claude saves me at least two hours every day. That\'s $140 to $300 in value per day. The $200 monthly subscription pays for itself in less than two days. The other 28 days are pure margin.' },
  ]),
  block('If you\'re billing clients for development or consulting work and Claude touches any part of your delivery, Max isn\'t an expense. It\'s the cheapest employee you\'ll ever hire.'),

  // H2: API
  block('The API is a separate world (and it\'s cheaper than you think)', 'h2'),
  block('The API is completely separate from your subscription. Different billing, different pricing, different use case.'),
  block('Here\'s what each model costs per million tokens:'),
  listItem([{ text: 'Opus 4.6:', bold: true }, { text: ' $5 input / $25 output' }]),
  listItem([{ text: 'Sonnet 4.6:', bold: true }, { text: ' $3 input / $15 output' }]),
  listItem([{ text: 'Haiku 4.5:', bold: true }, { text: ' $1 input / $5 output' }]),
  block('You can cut those prices further. Batch API gets you 50% off. Prompt caching saves up to 90% on repeated context. Stack both and you\'re looking at 95% cost reduction for the right workloads.'),
  block('My API bill runs between $5 and $20 a month. That\'s it. Every client automation I build runs on the client\'s own API key, so they pay their own token costs. I only use my key for testing and internal operations at RSL/A.'),
  block('For anyone building products or automations on top of Claude, the API is where the real value is. You\'re paying fractions of a cent per interaction instead of a flat monthly fee. At scale, it\'s dramatically cheaper than a subscription.'),
  blockWithChildren([
    { text: 'If you want to get started, I wrote a guide on ' },
    { text: 'how to set up Claude Code and connect it to your first project', href: 'https://rsla.io/blog/how-to-install-claude-code' },
    { text: '.' },
  ]),

  // H2: RATE LIMITS
  block('Rate limits are the real pricing (and Anthropic just made it worse)', 'h2'),
  block('Here\'s what the pricing page won\'t tell you. The actual cost of Claude isn\'t the dollar amount. It\'s the rate limits.'),
  block('How limits actually work:', 'h3'),
  block('Your usage runs on a 5-hour rolling window. Not daily. Not monthly. Rolling. Every message you send starts a timer, and that capacity frees up 5 hours later. On top of that, there are weekly caps. Even if your 5-hour window resets, you can burn through your weekly budget by Wednesday and you\'re stuck until next week.'),
  block('Then Anthropic made it worse.', 'h3'),
  blockWithChildren([
    { text: 'On March 26, 2026, ' },
    { text: 'Anthropic announced', href: 'https://www.theregister.com/2026/03/26/anthropic_tweaks_usage_limits/' },
    { text: ' that during peak hours (weekdays 5 AM to 11 AM Pacific), your 5-hour session limits drain faster. Your weekly total stays the same, but they\'re redistributing capacity to push usage off-peak.' },
  ]),
  blockWithChildren([
    { text: 'Reddit and Hacker News have been blowing up. Max subscribers are ' },
    { text: 'reporting their usage jumping from 21% to 100%', href: 'https://www.macrumors.com/2026/03/26/claude-code-users-rapid-rate-limit-drain-bug/' },
    { text: ' on a single prompt. One developer said Claude Code consumed their entire weekly allowance on a single pull request. Max 5x users are seeing limits hit after roughly 90 minutes of normal work.' },
  ]),
  block('I\'m on Max 20x and I personally haven\'t noticed a difference this week. But I also have 20x headroom. Pro and Max 5x users are getting hit the hardest. Anthropic says about 7% of users are affected, but the people in that 7% are loud about it. And I get it.'),
  block('The core frustration isn\'t even the limits themselves. It\'s the opacity. Anthropic doesn\'t publish exact token budgets. There\'s no real-time usage dashboard. You can run /status in Claude Code, but it just shows a percentage with no context for what 100% actually means in tokens.'),
  block('I hope they fix this soon. Paying $200 a month and not knowing exactly what you\'re getting is a hard sell, even when the product is this good.'),

  // [INLINE IMAGE 3 PLACEHOLDER]

  // H2: COMPETITION
  block('How Claude stacks up against the competition', 'h2'),
  block('Quick comparison of what you\'d pay across the main AI tools:'),
  listItem([{ text: 'Claude Pro:', bold: true }, { text: ' $20/mo (all models, Claude Code, extended thinking)' }]),
  listItem([{ text: 'ChatGPT Plus:', bold: true }, { text: ' $20/mo (GPT-4o, 160 messages per 3 hours)' }]),
  listItem([{ text: 'Gemini AI Plus:', bold: true }, { text: ' $7.99/mo (cheapest entry to a premium AI)' }]),
  listItem([{ text: 'Gemini AI Pro:', bold: true }, { text: ' $19.99/mo (comparable to Claude Pro)' }]),
  listItem([{ text: 'GitHub Copilot Pro:', bold: true }, { text: ' $10/mo (code completions, not agentic)' }]),
  listItem([{ text: 'Cursor Pro:', bold: true }, { text: ' $20/mo (IDE-native, uses multiple models)' }]),
  block('Gemini is the cheapest entry point at $7.99. GitHub Copilot Pro at $10 is the cheapest code assistant. But neither of them gives you what Claude Code gives you. Copilot is autocomplete. Gemini CLI is getting better but it\'s not at Claude Code\'s level for complex multi-file changes.'),
  blockWithChildren([
    { text: 'Claude Pro and ChatGPT Plus are price-matched at $20. At the top end, Claude Max 20x and ChatGPT Pro are both $200. Different strengths. I use Claude for building (code, architecture, complex reasoning) and ChatGPT when I need image generation or a different perspective on a problem.' },
  ]),
  blockWithChildren([
    { text: 'For a deeper comparison, I break down where each one wins in my ' },
    { text: 'Claude products guide', href: 'https://rsla.io/blog/anthropic-claude-products-guide' },
    { text: '.' },
  ]),
  blockWithChildren([
    { text: 'No student discount exists officially. But Anthropic has partnerships with universities like Northeastern and CMU where enrolled students get free or $1/month Pro access through their .edu email. If you\'re a student, check if your school has a deal before paying full price.' },
  ]),

  // H2: WHICH PLAN
  block('Which plan should you actually pick?', 'h2'),
  block('Here\'s how I\'d break it down:'),
  blockWithChildren([
    { text: 'Stay on free if:', bold: true },
    { text: ' You\'re just exploring. You want to see what Claude can do before committing. You don\'t need Opus or Claude Code. Free is genuinely useful now with Projects and Artifacts included.' },
  ]),
  blockWithChildren([
    { text: 'Go Pro ($20/mo) if:', bold: true },
    { text: ' You have a business and want to use Claude for real work. Writing, research, client communication, light automation. This is where I\'d tell any non-developer founder to start. It won\'t be long before you\'ll want to upgrade. Claude does so much work for you that you\'ll be tempted to move to the next plan.' },
  ]),
  blockWithChildren([
    { text: 'Go Max 5x ($100/mo) if:', bold: true },
    { text: ' You\'re using Claude Code for development and hitting Pro limits more than twice a week. The jump from $20 to $100 feels steep, but losing 30 minutes to a rate limit cooldown when you\'re billing $100 an hour is more expensive than the subscription.' },
  ]),
  blockWithChildren([
    { text: 'Go Max 20x ($200/mo) if:', bold: true },
    { text: ' You\'re like me. You live in Claude Code. It\'s running 8+ hours a day across multiple projects. You tried 5x and it still wasn\'t enough. The 20x gives you breathing room. I barely touch 50% of my capacity.' },
  ]),
  blockWithChildren([
    { text: 'Use the API if:', bold: true },
    { text: ' You\'re building products, automations, or tools that need Claude under the hood. Pay per token. Have your clients cover their own API costs. My bill is $5 to $20 a month because that\'s all my internal testing needs.' },
  ]),
  block('Don\'t overthink it. Start with Pro. If you keep hitting limits, upgrade. The worst case is you pay $100 for a month, realize you don\'t need it, and downgrade. Anthropic prorates everything.'),

  // FOOTER
  divider(),
  callout('tip', 'Not sure which Claude product you need?', 'Start with my guide that breaks down all 5 Claude products and when to use each one. It covers Claude.ai, Claude Code, Claude Desktop, Co-Work, and the API.'),
  ctaButton('Read the Claude products guide', 'https://rsla.io/blog/anthropic-claude-products-guide', 'primary'),
];

const doc = {
  _type: 'blogPostV2',
  title: 'Is Claude actually free? What you get at every tier (and what they don\'t tell you)',
  slug: { _type: 'slug', current: 'is-claude-free-pricing-every-tier' },
  excerpt: 'Claude has a free tier, but the pricing page doesn\'t tell the full story. Here\'s what you actually get at Free, Pro ($20), Max ($100/$200), and the API, from someone who\'s paid for every tier.',
  pullQuote: 'The $200 monthly subscription pays for itself in less than two days. The other 28 days are pure margin.',
  status: 'draft',
  showTableOfContents: true,
  featured: false,
  readingTime: 11,
  publishedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  author: { _type: 'reference', _ref: '88fc767a-b08d-4417-aa9e-528fc7972d4a' },
  categories: [
    { _type: 'reference', _ref: '2af0440c-d8d1-4d95-9bff-0802f9dc900b', _key: 'cat1' }, // Tools and Tech
    { _type: 'reference', _ref: 'e8ef107c-d62e-4f54-ae47-f376e6b94548', _key: 'cat2' }, // AI Development Tools
  ],
  relatedPosts: [
    { _type: 'reference', _ref: '8b58542f-4ec8-4d7d-ad6a-6681aa99a404', _key: 'rp1' }, // Post 0: anthropic-claude-products-guide
    { _type: 'reference', _ref: 's46qKlJ461Y7vhDmdMKLv7', _key: 'rp2' }, // Post 1: how-to-install-claude-code
    { _type: 'reference', _ref: '488617b8-9bbf-4ac1-afb5-123fc12ad76e', _key: 'rp3' }, // claude-code-vs-cowork-vs-claude-app
  ],
  seo: {
    metaTitle: 'Is Claude Free? What Every Tier Actually Gets You (2026)',
    metaDescription: 'Claude is free, but the limits hit fast. Here\'s what you actually get at Free, Pro ($20), Max ($100/$200), and the API. From someone who\'s paid $2,400+ to find out.',
    keywords: [
      'is claude free',
      'is claude code free',
      'how much is claude',
      'claude pricing',
      'claude pro vs max',
      'how much does claude code cost',
      'when does claude code usage reset',
    ],
  },
  faqSchema: [
    { _type: 'object', _key: k(), question: 'Is Claude Code free?', answer: 'No. Claude Code requires at minimum a Pro subscription ($20 per month) or your own API key. It is not available on the free tier. Claude Code shares the same usage pool as your claude.ai conversations.' },
    { _type: 'object', _key: k(), question: 'When does Claude usage reset?', answer: 'Claude uses a 5-hour rolling window, not a daily or monthly reset. Your oldest messages expire after 5 hours, freeing up capacity. There are also separate weekly caps that reset every 7 days. All Claude surfaces (claude.ai, Claude Code, Desktop, mobile) count against the same pool.' },
    { _type: 'object', _key: k(), question: 'Does Claude offer a student discount?', answer: 'There is no official standalone student discount. However, Anthropic has partnerships with universities like Northeastern and CMU where enrolled students get free or discounted Pro access through their .edu email. Check if your university has a deal before paying full price.' },
    { _type: 'object', _key: k(), question: 'Is the $50 Claude Code credit actually free?', answer: 'No. Activating the $50 credit enrolls you in pay-as-you-go billing on top of your subscription. After the credit runs out or expires after 60 days, charges continue at $5 per million input tokens and $25 per million output tokens unless you manually disable it.' },
    { _type: 'object', _key: k(), question: 'Is Claude Pro worth it over the free tier?', answer: 'For casual exploration, the free tier works. For real work, Pro ($20 per month) unlocks Opus (the strongest model), Claude Code, extended thinking, Co-Work, and 5x the usage. Most business users find the free limits too restrictive within a few days of regular use.' },
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
    console.log(`Created draft. ${body.length} body blocks.`);
    console.log('ID:', result.results?.[0]?.id || 'check Sanity');
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.error('Failed:', JSON.stringify(result, null, 2));
  }
}

create();
