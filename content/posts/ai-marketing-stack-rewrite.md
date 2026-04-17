Every marketing agency has a "what tools do you use?" page or blog post. Most of them list 15 to 20 tools and conveniently forget to mention that half of them have affiliate deals attached. I'm going to tell you exactly what [RSL/A](https://rsla.io) runs on, what each tool costs, and what we'd cut if we had to trim the budget.

This isn't a theoretical "best tools for marketers" list. It's the actual stack running the actual business. Every tool here is something I use weekly or daily. If I stopped paying for it, something would break. That's the filter. If a tool is nice to have but not load-bearing, it's not on this list.

## The core platform: GoHighLevel

[GoHighLevel](https://www.gohighlevel.com/?fp_ref=rahul-lalia) is the backbone. It handles CRM, client communication, [workflow automations](https://rsla.io/blog/gohighlevel-workflow-automations-guide), [Conversation AI](https://rsla.io/blog/go-high-level-new-features-2025), SMS, email, phone, calendars, [funnels](https://rsla.io/blog/gohighlevel-funnel-tutorial-high-converting), and pipeline management. Every client account lives in GHL. Every [lead follow up sequence](https://rsla.io/blog/gohighlevel-lead-follow-up-automation), every missed call text back, every review request, every AI conversation runs through it.

The cost is [$297 per month](https://rsla.io/blog/go-high-level-pricing) on the Unlimited plan because we manage multiple client accounts. A single business only needs the $97 Starter plan. The $297 plan adds unlimited sub-accounts and agency features.

This is the one tool I would never cut. If I had to run the business on one platform, it would be GHL. Everything else in the stack either feeds into GHL or builds on top of what GHL provides. The CRM data, the automation engine, the AI conversations, the client communication history. All of it lives here.

What makes GHL particularly valuable for an agency is that client accounts are all managed from one dashboard. I can see every client's pipeline, every active workflow, every Conversation AI interaction without logging into separate systems. When a client asks "how many leads came in this week?" I can answer in 30 seconds. That operational clarity is worth the monthly cost on its own, separate from all the automation features.

## AI for content and development: Claude

Claude from Anthropic is the AI I use most. Not ChatGPT, not Gemini. Claude. Specifically Claude Code for development work and Claude's API for content generation and automation scripts.

For content work, Claude handles blog writing, rewriting, SEO optimization, and content auditing. The voice and structure still need human direction (every blog post goes through my editorial process), but Claude does the heavy lifting on first drafts, research synthesis, and optimization passes.

For development, Claude Code is how we build and maintain the website, write automation scripts, manage the CMS, and handle technical tasks that would traditionally require a developer. I don't have a dev team. Claude Code is the dev team. It writes the code, runs the tests, and deploys the changes. The productivity difference is massive. Tasks that would take a junior developer a full day take Claude Code an hour or two with my direction.

The reason I chose Claude over ChatGPT or Gemini specifically is the quality of output for longer-form work. Blog rewrites, technical documentation, complex automation scripts. Claude handles extended context better and produces more natural writing. For quick one-off questions, any of them work. For the sustained work that actually runs a business, Claude is the one I trust with my content and my code.

Anthropic API costs vary based on usage but typically run $50 to $150 per month for our volume. Claude Code itself is billed through the API. No separate subscription fee beyond what the API usage costs. The per-token pricing means you only pay for what you actually use, which is fair.

## Website and CMS: Sanity plus Vercel plus Next.js

The rsla.io website runs on Next.js deployed to Vercel with content managed in Sanity CMS. This is a more technical setup than most businesses need, but for a marketing agency that publishes regularly and needs fast page loads for SEO, it works well.

**Sanity** is the content management system. All blog posts, case studies, and page content live in Sanity's structured content model. The Team plan runs about $99 per month. The advantage over WordPress is speed, flexibility, and the ability to manage content programmatically (which matters when you're using AI to help create and optimize content at scale).

**Vercel** hosts the website with automatic deployments from GitHub. The Pro plan is $20 per month. Pages load fast, deployments are instant, and the serverless functions handle our markdown API for LLM discoverability.

**Next.js** is the framework. It's free and open source. The development time is where the cost lives, and Claude Code handles most of that.

Total for the website stack: roughly $120 per month. Most businesses don't need this setup. A GHL website or a simple WordPress site would work fine for most service businesses. We run this stack because we need the performance and programmability for SEO and content operations.

## Project management: Notion

Notion is where everything organizational lives. Client projects, task tracking, content calendars, meeting notes, SOPs, and internal documentation. The Team plan is about $10 per month per member.

For a solo operator or small team, Notion is overkill. A spreadsheet or even a paper notebook would work. But as the number of clients and projects grows, having a single place where every task, every deadline, and every client note lives becomes essential. The alternative is losing track of things, and losing track costs money.

## Email and workspace: Google Workspace

Google Workspace handles email (lalia@rsla.io), Google Drive for file storage and sharing, Google Docs for proposals, Google Calendar for scheduling, and Google Sheets for reporting. $7 per month per user on the Business Starter plan.

Nothing fancy here. It's just email and docs. But having a professional email domain matters for client communication and cold outreach. Gmail on a personal address signals amateur. A branded domain signals legitimate business.

## Paid advertising: Meta Ads

We run Meta Ads (Facebook and Instagram) for clients who need paid traffic. The ad management tools within the Meta Ads Manager are free. The ad spend varies by client. We use GHL's tracking and pipeline features to measure which ads generate actual bookings, not just clicks.

There's no monthly software cost here beyond the ad spend itself. Meta's built-in tools handle campaign creation, audience targeting, creative testing, and reporting. GHL handles the lead follow up and attribution on the back end. The integration between Meta lead forms and GHL means that when someone fills out a Facebook lead form, the contact is created in GHL instantly and the automation fires within seconds. That [speed to lead](https://rsla.io/blog/lead-response-time-how-fast) advantage is the whole reason the integration matters. A lead from a Facebook ad at 10 PM gets the same instant response as one from your website at 2 PM.

## Cold outreach: Instantly plus Apify plus ZeroBounce

For lead generation campaigns, we use a three-tool stack.

**Apify** scrapes lead data from directories, Google Maps, and industry databases. Pay-per-use pricing, typically $30 to $50 per month depending on volume.

**ZeroBounce** verifies email addresses before we send. Bad emails destroy sender reputation. Verification costs about $15 to $30 per month for our volume.

**Instantly** sends the cold email campaigns with automated follow up sequences, inbox warmup, and deliverability management. Plans start at $30 per month for the basic tier and go up based on sending volume and number of email accounts.

Total cold outreach stack: roughly $75 to $110 per month. This stack only makes sense if you're actively running cold email campaigns. If your leads come through ads, referrals, and organic search, skip this entirely. Cold email is a separate discipline with its own rules around deliverability, domain reputation, and compliance. Don't bolt it on as an afterthought. Either commit to it properly or don't do it at all.

## The full monthly cost

Here's the actual breakdown:

- GoHighLevel (Unlimited): $297
- Claude/Anthropic API: $50 to $150
- Sanity CMS: $99
- Vercel: $20
- Notion: $10
- Google Workspace: $7
- Cold outreach stack: $75 to $110
- Meta Ads: ad spend varies (not a tool cost)

**Total: roughly $558 to $693 per month** for the full stack running everything.

That's the real number. No hidden costs, no "plus enterprise pricing" footnotes. Under $700 per month to run a marketing agency with AI-powered content creation, automated lead follow up, CRM, website, project management, and cold outreach.

## What I'd use if starting from zero

If I was launching today with minimal budget, here's the order I'd add tools.

**$97 per month:** GoHighLevel Starter. This alone gives you CRM, automation, Conversation AI, SMS, email, phone, funnels, and calendars. You can run a service business on this single tool. Use GHL's built-in website builder instead of a separate stack.

**$150 per month:** Add Google Workspace ($7) and Claude API (~$50). Now you have professional email, AI for content and development, and the full GHL platform.

**$250 per month:** Add Notion ($10) and the cold outreach stack ($75). Now you have organized project management and proactive lead generation on top of the reactive systems.

**$700 per month:** Add the full website stack (Sanity + Vercel) for maximum SEO performance and content operations at scale. This only makes sense when content is a significant part of your growth strategy and you're publishing frequently enough to justify a custom CMS.

The key insight: you can run a profitable service business on $97 per month with just GHL. Everything else scales up as revenue grows. Don't buy the full stack before the business justifies it.

## What we tried and dropped

**Separate email marketing tools.** Tried Mailchimp and ConvertKit before consolidating into GHL. Maintaining email lists in two places created sync issues and extra cost. GHL handles email marketing natively.

**Standalone chatbot platforms.** Tried dedicated chatbot tools before GHL added Conversation AI. The standalone tools required separate integration, separate dashboards, and separate billing. Every time we wanted to update the AI's knowledge base, we had to do it in two places. Conversation AI in GHL eliminated the need entirely.

**Multiple CRM tools.** Briefly used a separate CRM alongside GHL before realizing the duplication was creating more work, not less. Contacts would exist in one system but not the other, and nobody knew which one was the source of truth. Consolidated everything into GHL pipelines.

**Project management tools that weren't Notion.** Tried Asana and Monday.com. Both are powerful but overkill for a small team. Notion's flexibility (databases, docs, and wikis in one tool) fits better for how we work. Plus at $10 per month versus $30 or more, the cost difference adds up.

**Scheduling tools outside GHL.** Tried Calendly before realizing GHL's calendar handles the same booking flow and is already integrated with the CRM and automation engine. Using a separate scheduler meant contacts didn't automatically enter the pipeline. Consolidating eliminated that gap.

The pattern: every tool we dropped was replaced by something GHL already does or by something simpler and cheaper. The platform consolidation is one of GHL's biggest advantages. Fewer tools means fewer integrations, fewer sync issues, fewer points of failure, and fewer monthly bills. The simplest stack that works is always better than the impressive stack that has three tools nobody logs into.

## The bottom line

The AI marketing stack that actually works isn't about having the most tools. It's about having the right ones connected properly. GHL handles the client-facing automation. Claude handles the AI-powered content and development. The website stack handles organic presence. Everything else supports those three pillars.

Start with GHL at $97 per month. Add tools as your business grows and specific needs emerge. Don't buy a $700 per month stack on day one hoping it will make you look professional. Build it over time based on what you actually use and what generates actual revenue. The tools are only as valuable as the systems you build on top of them.

For help setting up any part of this stack, [RSL/A handles full implementations](https://rsla.io/#contact). We'll configure the tools, connect them, and have your systems running within a week.
