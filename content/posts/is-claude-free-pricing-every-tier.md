# Is Claude actually free? What you get at every tier (and what they don't tell you)

I started on the $20 plan. Like everyone else.

It took maybe two weeks before I hit my first rate limit mid-project. I was building a client website, Claude Code was halfway through refactoring a component, and everything just stopped. "You've reached your usage limit." That's it. No warning. No countdown. Just a wall.

So is Claude free? Technically, yes. Anthropic offers a free tier and it's more generous than you'd expect. But if you're asking because you want to actually use Claude for work, the honest answer is more complicated. And the pricing page doesn't tell you the full story.

I've gone from Free to Pro to Max 5x to Max 20x over the past year. I've paid Anthropic over $2,400 in subscriptions alone. Here's what I wish someone had told me before I started.

## What you actually get for free

Claude's free tier is surprisingly solid. Since February 2026, Anthropic opened up features that used to be Pro-only:

- **Claude Sonnet 4.5** (same model paid users get, just with tighter limits)
- **Projects** (organize conversations with persistent context)
- **Artifacts** (interactive documents and code generation)
- **App Connectors** (Notion, Slack, Google Workspace, Figma integrations)
- **Web search**
- **File uploads** (up to 20 files per chat, 30MB max)

That's a lot. Honestly? For someone just trying Claude out, it's enough to get a real feel for what it can do.

Here's where it breaks down.

You get roughly 15 to 40 messages per 5-hour window depending on message length. Longer conversations with attachments drop that to maybe 20 to 30 per day. There's no visible counter. No warning as you approach the limit. You just get locked out.

And you don't get access to Opus (the most capable model), Claude Code, extended thinking, or Co-Work. For casual use that's fine. For building anything real, you'll hit the ceiling fast.

## The $20 Pro plan (where most people start and where most people get stuck)

Pro is $20 a month ($17 if you pay annually). Here's what it unlocks on top of free:

- **Claude Opus 4.6** (the strongest model for complex reasoning)
- **Claude Code** (terminal-based agentic coding)
- **Extended thinking** (lets Claude reason through harder problems)
- **Co-Work** (background agent that works on tasks asynchronously)
- **1M context window** beta for Opus and Sonnet 4.6
- **5x the usage** of the free tier

For $20, that's genuinely a lot of value. And if you're a business owner who isn't writing code all day, Pro might be all you need.

But here's the thing.

If you're using Claude Code for real development work, Pro's limits will catch you. I was maybe two weeks in before I started hitting rate limits regularly. You're mid-build, Claude is scanning files, editing code, running tests. That loop burns through tokens fast. And when it stops, you stop.

The 5-hour rolling window means your usage doesn't reset at midnight like you'd expect. It rolls. So if you burned through your limit at 2 PM, you're waiting until 7 PM. No dashboard to track it. No warning before it hits.

Rahul Lalia here at RSL/A. I've been through every tier. Pro is where I'd tell anyone to start. But if you're using Claude Code daily, know that the upgrade conversation is coming.

## Claude Code isn't a separate bill (but it eats from the same plate)

This is the biggest source of confusion I see. People think Claude Code has its own pricing. It doesn't.

Claude Code draws from the exact same token pool as your claude.ai conversations. Use Claude Code heavily in the morning, and you'll have less capacity for regular chat in the afternoon. They share one budget.

Three things most people don't realize:

**The $50 "free" credit isn't free.** When you activate it, you're enrolled in pay-as-you-go billing on top of your subscription. After the credit runs out (or expires after 60 days), charges keep going unless you manually disable it. That's $5 per million input tokens and $25 per million output tokens. It adds up.

**Agent teams multiply your burn rate.** Running a 3-agent team in Claude Code uses roughly 7x more tokens than a single agent session. I've seen people blow through their weekly limit in an afternoon running multi-agent workflows without realizing it.

**All Claude surfaces share the pool.** Claude.ai, Claude Code, Claude Desktop, Claude mobile. Same bucket. Every conversation counts against the same limit.

According to Anthropic's own data, the average Claude Code user costs about $6 per developer per day, with 90% staying under $12 per day. At full-time usage, that projects to $100 to $200 a month. Which is exactly why Max exists.

## Max at $100 and $200: when the math actually makes sense

Here's how the plans stack up:

- **Free ($0):** 1x usage, Sonnet only, no Claude Code
- **Pro ($20/mo):** 5x usage, all models including Opus, Claude Code included
- **Max 5x ($100/mo):** 25x usage (5x Pro), same models, priority access
- **Max 20x ($200/mo):** 100x usage (20x Pro), maximum priority

Same models. Same features. You're paying for runway.

I went through every step of this ladder. Started on Pro, hit limits constantly, upgraded to Max 5x at $100. Thought it would be enough.

It wasn't.

The gap between what I needed and what 5x gave me was maybe 2x more. Not 4x more. But there's no 10x plan. So I had to jump all the way to the $200 Max 20x plan.

And you know what? I barely hit 50% of my usage now.

There's a missing tier here. Something like $150 for 10x would be perfect for developers who outgrow 5x but don't need 20x. Anthropic, if you're reading this.

**The ROI math that made the decision easy.** My hourly rate varies between $70 and $150 depending on the project. Claude saves me at least two hours every day. That's $140 to $300 in value per day. The $200 monthly subscription pays for itself in less than two days. The other 28 days are pure margin.

If you're billing clients for development or consulting work and Claude touches any part of your delivery, Max isn't an expense. It's the cheapest employee you'll ever hire.

## The API is a separate world (and it's cheaper than you think)

The API is completely separate from your subscription. Different billing, different pricing, different use case.

Here's what each model costs per million tokens:

- **Opus 4.6:** $5 input / $25 output
- **Sonnet 4.6:** $3 input / $15 output
- **Haiku 4.5:** $1 input / $5 output

You can cut those prices further. Batch API gets you 50% off. Prompt caching saves up to 90% on repeated context. Stack both and you're looking at 95% cost reduction for the right workloads.

My API bill runs between $5 and $20 a month. That's it. Every client automation I build runs on the client's own API key, so they pay their own token costs. I only use my key for testing and internal operations at RSL/A.

For anyone building products or automations on top of Claude, the API is where the real value is. You're paying fractions of a cent per interaction instead of a flat monthly fee. At scale, it's dramatically cheaper than a subscription.

If you want to get started with the API, I wrote a guide on [how to set up Claude Code and connect it to your first project](https://rsla.io/blog/how-to-install-claude-code).

## Rate limits are the real pricing (and Anthropic just made it worse)

Here's what the pricing page won't tell you. The actual cost of Claude isn't the dollar amount. It's the rate limits.

**How limits actually work:**

Your usage runs on a 5-hour rolling window. Not daily. Not monthly. Rolling. Every message you send starts a timer, and that capacity frees up 5 hours later. On top of that, there are weekly caps. Even if your 5-hour window resets, you can burn through your weekly budget by Wednesday and you're stuck until next week.

**Then Anthropic made it worse.**

On March 26, 2026, Anthropic announced that during peak hours (weekdays 5 AM to 11 AM Pacific), your 5-hour session limits drain faster. Your weekly total stays the same, but they're redistributing capacity to push usage off-peak.

Reddit and Hacker News have been blowing up. Max subscribers are reporting their usage jumping from 21% to 100% on a single prompt. One developer said Claude Code consumed their entire weekly allowance on a single pull request. Max 5x users are seeing limits hit after roughly 90 minutes of normal work.

I'm on Max 20x and I personally haven't noticed a difference this week. But I also have 20x headroom. Pro and Max 5x users are getting hit the hardest. Anthropic says about 7% of users are affected, but the people in that 7% are loud about it. And I get it.

The core frustration isn't even the limits themselves. It's the opacity. Anthropic doesn't publish exact token budgets. There's no real-time usage dashboard. You can run `/status` in Claude Code, but it just shows a percentage with no context for what 100% actually means in tokens.

I hope they fix this soon. Paying $200 a month and not knowing exactly what you're getting is a hard sell, even when the product is this good.

## How Claude stacks up against the competition

Quick comparison of what you'd pay across the main AI tools:

- **Claude Pro:** $20/mo (all models, Claude Code, extended thinking)
- **ChatGPT Plus:** $20/mo (GPT-4o, 160 messages per 3 hours)
- **Gemini AI Plus:** $7.99/mo (cheapest entry to a premium AI)
- **Gemini AI Pro:** $19.99/mo (comparable to Claude Pro)
- **GitHub Copilot Pro:** $10/mo (code completions, not agentic)
- **Cursor Pro:** $20/mo (IDE-native, uses multiple models)

Gemini is the cheapest entry point at $7.99. GitHub Copilot Pro at $10 is the cheapest code assistant. But neither of them gives you what Claude Code gives you. Copilot is autocomplete. Gemini CLI is getting better but it's not at Claude Code's level for complex multi-file changes.

Claude Pro and ChatGPT Plus are price-matched at $20. At the top end, Claude Max 20x and ChatGPT Pro are both $200. Different strengths. I use Claude for building (code, architecture, complex reasoning) and ChatGPT when I need image generation or a different perspective on a problem.

For a deeper comparison, I break down where each one wins in my [Claude products guide](https://rsla.io/blog/anthropic-claude-products-guide).

No student discount exists officially. But Anthropic has partnerships with universities like Northeastern and CMU where enrolled students get free or $1/month Pro access through their .edu email. If you're a student, check if your school has a deal before paying full price.

## Which plan should you actually pick?

Here's how I'd break it down:

**Stay on free if:** You're just exploring. You want to see what Claude can do before committing. You don't need Opus or Claude Code. Free is genuinely useful now with Projects and Artifacts included.

**Go Pro ($20/mo) if:** You have a business and want to use Claude for real work. Writing, research, client communication, light automation. This is where I'd tell any non-developer founder to start. It won't be long before you'll want to upgrade. Claude does so much work for you that you'll be tempted to move to the next plan.

**Go Max 5x ($100/mo) if:** You're using Claude Code for development and hitting Pro limits more than twice a week. The jump from $20 to $100 feels steep, but losing 30 minutes to a rate limit cooldown when you're billing $100 an hour is more expensive than the subscription.

**Go Max 20x ($200/mo) if:** You're like me. You live in Claude Code. It's running 8+ hours a day across multiple projects. You tried 5x and it still wasn't enough. The 20x gives you breathing room. I barely touch 50% of my capacity.

**Use the API if:** You're building products, automations, or tools that need Claude under the hood. Pay per token. Have your clients cover their own API costs. My bill is $5 to $20 a month because that's all my internal testing needs.

Don't overthink it. Start with Pro. If you keep hitting limits, upgrade. The worst case is you pay $100 for a month, realize you don't need it, and downgrade. Anthropic prorates everything.
