# How we use Claude Code to run a marketing agency (without a dev team)

RSL/A is a two-person marketing agency. We build websites, generate content, run automations, manage CRMs, handle deployments, and serve clients across multiple industries. We don't have a development team. We don't outsource code. We don't have a content team.

We have Claude Code.

This post is not theoretical. I'm not going to tell you what Claude Code *could* do for a marketing agency. I'm going to show you what it actually does for ours. Real workflows, real numbers, real constraints.

If you're running a small agency, consultancy, or marketing operation and wondering whether AI coding tools are practical for non-dev teams, this is the post I wish existed when we started.

## The stack that makes it work

Before diving into workflows, you need to understand the ecosystem. [Claude Code](https://rsla.io/blog/what-is-claude-code-guide) is powerful on its own, but the real power comes from connecting it to your business tools through [MCP servers](https://rsla.io/blog/mcp-servers-explained-ai-integrations).

Here's what our stack looks like:

- **[Claude Code](https://code.claude.com/docs)** as the autonomous AI agent (runs in terminal, reads our projects, executes tasks)
- **Sanity CMS** for blog posts, case studies, and content management
- **Vercel** for website deployments
- **GoHighLevel** for client CRM, pipelines, and communications
- **Notion** for task management and internal documentation
- **Google Workspace** for calendar, email, and documents
- **GitHub** for version control and code management
- **Gemini API** for image generation
- **Stripe** for payments

All of these connect to Claude Code through [MCP](https://modelcontextprotocol.io). When Claude Code needs to create a blog post, it talks to Sanity. When it needs to deploy a website, it talks to Vercel. When it needs to check a client's pipeline status, it talks to GoHighLevel. One agent, 9 integrations, zero custom API code.

The [CLAUDE.md file](https://rsla.io/blog/claude-md-file-ai-context-guide) ties it all together. It tells Claude Code about our naming conventions, our writing voice, our project structure, our MCP configuration, our workflow commands, and our permissions. Every session starts with full business context.

## Workflow 1: blog content pipeline

This is our most Claude Code intensive workflow. Here's exactly what happens when we produce a blog post.

**Step 1: Content planning.** We maintain an editorial calendar and content strategy in our studio repository. Claude Code reads these to understand our publishing schedule, target keywords, and content pillars.

**Step 2: Writing the post.** We describe the topic, target keyword, and any specific angles. Claude Code writes the full blog post (2,000 to 3,500 words) following our blog writing guide. It uses sentence case for headings, avoids em dashes, writes in Rahul's voice, includes specific numbers, and maintains a peer-to-peer tone. All of this is automatic because the rules are in our CLAUDE.md and writing guide files.

**Step 3: Generating images.** Each post gets 4 images: 1 featured and 3 inline. Claude Code runs a script that calls the Gemini API with style-specific prompts (we rotate through 11 hand-drawn styles like napkin sketches, whiteboard markers, and metric visualizations). The images are generated, downloaded, uploaded to Sanity, and patched into the document automatically.

**Step 4: SEO metadata.** Claude Code adds the meta title (under 60 characters), meta description (under 155 characters), keywords array (5 to 7 terms), FAQ schema (3 to 5 Q&A items), and social image. All following our SEO checklist.

**Step 5: Taxonomy and linking.** Author assigned, categories selected, related posts cross-referenced, reading time calculated. Internal links added to other relevant posts. External links to authoritative sources.

**Step 6: Review and publish.** We review the draft in Sanity Studio, check for voice and accuracy, and publish. The website picks it up automatically via Sanity's CDN.

**The old timeline:** 1 full day per post (writing, image sourcing, metadata, CMS entry, linking).

**The new timeline:** 2 to 3 hours including review. And we recently did 12 posts in a batch over 2 days.

## Workflow 2: client website builds

When a new client signs up and needs a website, here's what happens.

**Planning phase:** We discuss requirements with the client. Page list, branding, content needs, functionality. This is human work. No AI can replace the client conversation.

**Build phase:** Claude Code handles the implementation. We describe each page, its components, the layout, and the content. Claude Code builds the pages using our existing component library, matching the client's brand colors and styling. It creates responsive layouts, handles navigation, and wires up any interactive elements.

**Content integration:** If the client uses a CMS (we typically set up Sanity), Claude Code creates the schema, configures the studio, and builds the data fetching layer. Content editors can then manage the site independently.

**Deployment:** Claude Code pushes to GitHub, Vercel picks up the changes, and the site deploys automatically. DNS configuration is the only manual step.

**The old approach:** Hire a freelance developer ($50 to $100/hour, 1 to 2 week turnaround, multiple revision cycles).

**The new approach:** Built in 1 to 3 days, deployed same week. We review every component, but the implementation speed is dramatically faster.

## Workflow 3: CRM automations

GoHighLevel is our CRM platform. Clients use it for pipeline management, lead tracking, and automated communications. Claude Code helps us build and maintain automations.

**Contact management.** When we need to segment contacts, update tags, or clean up data, Claude Code queries GoHighLevel through its MCP server, processes the data, and makes bulk updates. What used to be hours of clicking through a web interface happens in a single session.

**Pipeline workflows.** Setting up automated sequences (when a lead enters a stage, send an email, wait 2 days, send a follow-up, if no response move to the next stage) used to require careful manual configuration in GoHighLevel's builder. Now we describe the workflow logic to Claude Code, and it configures the automation programmatically.

**Reporting.** Claude Code can pull client data from GoHighLevel, analyze engagement metrics, and generate reports. Weekly client updates that used to take 30 minutes of dashboard navigation now take 5 minutes.

## Workflow 4: operational tasks

The unglamorous stuff that keeps an agency running.

**Documentation.** Claude Code maintains our internal documentation in Notion. When we add a new process, integration, or client, Claude Code updates the relevant pages. Our workspace stays organized because the AI is responsible for keeping it current.

**Email and calendar.** Through the Google Workspace MCP, Claude Code can check calendar availability, draft emails, and manage scheduling. Not fully autonomous (we review emails before sending), but the drafting and organization save significant time.

**Data analysis.** When we need to analyze client performance, compare marketing metrics, or evaluate a new tool, Claude Code handles the research and number-crunching. It pulls data from multiple sources, processes it, and produces a summary with recommendations.

**Repository maintenance.** Git operations, dependency updates, code cleanup, file organization. Claude Code handles all of it. Our repos stay clean because the AI follows the naming conventions and folder structure defined in our CLAUDE.md.

## The numbers

Here's the productivity comparison. These are real numbers from our workflows:

**Blog post (full production):** 1 day manual to 2 to 3 hours with Claude Code. Roughly 3x improvement.

**Ad copy variations:** [Anthropic's own marketing team](https://www.anthropic.com/customers) documented this: 30 minutes manual to 30 seconds with Claude Code. 60x improvement.

**Email sequence (5 emails):** 4 hours manual to 45 minutes with Claude Code. Roughly 5x improvement.

**Website feature (new component):** 1 week with freelancer to 1 day with Claude Code. 5x improvement.

**Monthly output (same 2-person team):**
- 2025: 4 blog posts, 2 client site projects, 10 automations
- 2026: 12 blog posts, 5 client site projects, 30 automations

3x the output with the same team size. That's not a theoretical projection. That's our actual production volume.

## What Claude Code can't do for an agency

Honesty matters here. Claude Code has real limitations for agency work.

**Client relationships.** The human conversations, the trust-building, the strategic advice. That's you. Claude Code handles execution, not relationships.

**Creative strategy.** Claude Code can execute a content strategy brilliantly, but it can't tell you what your client's positioning should be. Strategic thinking is still a human skill.

**Brand voice without training.** Claude Code's default writing is generic. Without a detailed CLAUDE.md and writing guide, the content sounds AI-generated. The setup investment is real and necessary.

**Complex design decisions.** Claude Code can implement a design, but it can't make sophisticated visual design choices. You need a design reference (mockup, existing site, or detailed description) for Claude Code to execute effectively.

**Judgment calls on client work.** When a client asks for something that's a bad idea, you need human judgment to push back diplomatically. Claude Code will build whatever you describe, whether it's a good idea or not.

## The learning curve for non-developers

I want to be direct about this because it's the question that matters most for agency owners.

I'm not a traditional software engineer. I learned to code through AI tools, not through a CS degree. My background is marketing and business development. When I started using Claude Code, the terminal was intimidating.

The learning curve was real but manageable. Here's the timeline:

**Week 1:** Basic navigation. Opening a terminal, cd-ing to a project folder, running Claude Code, giving simple instructions. Lots of "that's not what I meant" moments. Felt frustrating.

**Week 2:** Understanding what Claude Code needs. Learning to be specific. "Build a contact form" produces garbage. "Build a contact form with name, email, and message fields, styled to match our existing components, that sends an email notification via SendGrid" produces something usable. The skill is describing what you want clearly.

**Week 3:** Building the CLAUDE.md. Adding rules as I discovered what mattered. Each rule reduced future friction. The AI started feeling like it understood our business.

**Month 2:** Productive. Running multiple sessions daily. Building client deliverables. Generating content. The terminal wasn't scary anymore. It was just where I worked.

**Month 3 and beyond:** Claude Code became invisible infrastructure. Like email. You don't think about how it works. You just use it to get things done.

If you're an agency owner considering Claude Code, budget 2 to 3 weeks for the learning curve. It's not zero, but it's not a degree program either. And our [non-developer guide](https://rsla.io/blog/what-is-claude-code-guide) covers the practical steps.

## Why this matters for small agencies

The economics of running a small agency changed when AI coding tools became practical. Here's the shift:

**Before:** A two-person agency either limited its service offerings or outsourced technical work. Outsourcing meant cost, delays, and communication overhead. Limited offerings meant smaller contracts and less competitive positioning.

**After:** A two-person agency can offer website builds, content production, CRM automation, deployment management, and data analysis. All in-house. All at the speed of a larger team. The overhead of outsourcing disappears. The limitations of headcount become much less constraining.

This doesn't mean AI replaces team growth. As we scale, we'll hire. But we'll hire for strategy, relationships, and creative direction. Not for execution tasks that Claude Code handles better and faster than any hire we could afford.

## What we'd do differently if starting over

Looking back, a few things would have saved us time in the early days.

**Build the CLAUDE.md first, before doing any real work.** We started using Claude Code and added rules to our context file as we encountered problems. If we'd spent a day upfront writing our naming conventions, voice guide, and folder structure, the first two weeks would have been smoother.

**Start with one workflow, not five.** We tried to do everything at once. Blog content, website builds, CRM management, deployments. The cognitive load was too high. If we started over, we'd master the blog content pipeline first, then expand to other workflows one at a time.

**Set up MCP servers on day one.** We initially used Claude Code without MCP integrations, manually copying data between tools. The moment we connected Sanity, GitHub, and Notion through MCP, our productivity jumped. Don't wait.

## The bottom line

Claude Code is the third employee at RSL/A. It doesn't attend client meetings. It doesn't make strategic decisions. But it builds, deploys, generates, manages, and automates at a pace that makes a two-person agency competitive with teams five times our size.

The investment: $20/month for Claude Code Pro, time to build a CLAUDE.md file, and 2 to 3 weeks to learn the workflow. The return: 3x output, same-day delivery on features that used to take weeks, and the ability to offer services that previously required a developer on staff.

If you're running a small agency and you're still outsourcing technical work or limiting your offerings because of headcount, Claude Code is worth a serious look. Not as a novelty. As infrastructure.
