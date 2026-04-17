RSL/A is a two person marketing agency. We build websites, generate content, run automations, manage CRMs, handle deployments, and serve clients across multiple industries. We do not have a development team. We do not outsource code. We do not have a content team.

We have [Claude Code](https://rsla.io/blog/what-is-claude-code-guide).

This post is not theoretical. I am not going to tell you what Claude Code could do for a marketing agency. I am going to show you what it actually does for ours. Real workflows, real numbers, real constraints. If you are running a small agency, consultancy, or marketing operation and wondering whether AI coding tools are practical for non dev teams, this is the post I wish existed when we started.

## The stack that makes it work

Claude Code is powerful on its own, but the real power comes from connecting it to your business tools through [MCP servers](https://rsla.io/blog/mcp-servers-explained-ai-integrations).

Here is what our stack looks like: Claude Code as the autonomous AI agent, Sanity CMS for blog posts and case studies, Vercel for website deployments, GoHighLevel for client CRM and communications, Notion for task management and internal docs, Google Workspace for calendar, email, and documents, GitHub for version control, Gemini API for image generation, and Stripe for payments.

All of these connect to Claude Code through MCP. When Claude Code needs to create a blog post, it talks to Sanity. When it needs to deploy a website, it talks to Vercel. When it needs to check a client's pipeline status, it talks to GoHighLevel. One agent, 9 integrations, zero custom API code.

The [CLAUDE.md file](https://rsla.io/blog/claude-md-file-ai-context-guide) ties it all together. It tells Claude Code about our naming conventions, our writing voice, our project structure, our MCP configuration, and our permissions. Every session starts with full business context. Without that file, Claude Code produces generic output. With it, the output matches what a team member who knows the business would produce.

## Blog content pipeline

This is our most Claude Code intensive workflow.

Content planning starts with our editorial calendar and content strategy docs. Claude Code reads these to understand our publishing schedule, target keywords, and content pillars.

Writing the post means we describe the topic, target keyword, and any specific angles. Claude Code writes the full blog post at 2,000 to 3,500 words following our blog writing guide. It uses sentence case for headings, avoids dashes, writes in Rahul's voice, includes specific numbers, and maintains a peer to peer tone. All automatic because the rules are in our CLAUDE.md and writing guide files.

Image generation means each post gets 4 images: 1 featured and 3 inline. Claude Code runs a script that calls the Gemini API with style specific prompts. We rotate through 11 hand drawn styles like napkin sketches, whiteboard markers, and metric visualizations. Generated, downloaded, uploaded to Sanity, and patched into the document automatically.

SEO metadata means meta title under 60 characters, meta description under 155 characters, keywords array of 5 to 7 terms, FAQ schema with 3 to 5 Q&A items, social image, reading time, pull quote, and excerpt. All following our SEO checklist.

Taxonomy and linking means author assigned, categories selected, related posts cross referenced, internal links added to relevant posts, external links to authoritative sources.

Review and publish is the final step. We check the draft in Sanity Studio for voice and accuracy, then publish. The website picks it up automatically via Sanity's CDN.

The old timeline: 1 full day per post, including writing, image sourcing, metadata, CMS entry, and linking. The new timeline: 2 to 3 hours including review. And we recently did 12 posts in a batch over 2 days. Every single one had custom images, FAQ schema, cross references, and optimized metadata. That kind of throughput simply was not possible before Claude Code.

## Client website builds

When a new client signs up and needs a website, the planning phase is human work. Discussing requirements, page list, branding, content needs. No AI can replace the client conversation.

The build phase is where Claude Code takes over. We describe each page, its components, the layout, and the content. Claude Code builds the pages using our existing component library, matching the client's brand colors and styling. Responsive layouts, navigation, interactive elements.

Content integration means if the client uses a CMS, Claude Code creates the schema, configures the studio, and builds the data fetching layer. Content editors can then manage the site independently.

Deployment is straightforward. Claude Code pushes to GitHub, Vercel picks up the changes, and the site deploys. DNS configuration is the only manual step.

The old approach: hire a freelance developer at $50 to $100 per hour, 1 to 2 week turnaround, multiple revision cycles, and the constant back and forth of "that is not quite what I meant." The new approach: built in 1 to 3 days, deployed same week. I have had clients ask which developer built a feature and the answer was "Claude Code, reviewed by me." They could not tell the difference. And honestly? That is the whole point. The output quality is equivalent. The speed and cost are not even comparable.

## CRM automations

[GoHighLevel](https://rsla.io/blog/what-is-go-high-level) is our CRM platform. Claude Code helps us build and maintain automations through the GHL MCP server.

Contact management used to mean hours of clicking through a web interface to segment contacts, update tags, or clean up data. Now Claude Code queries GoHighLevel, processes the data, and makes bulk updates in a single session.

Pipeline [workflows](https://rsla.io/blog/gohighlevel-workflow-automations-guide) used to require careful manual configuration in GoHighLevel's builder. Now we describe the logic to Claude Code and it configures the automation programmatically. When a lead enters a stage, send an email, wait 2 days, send a follow up, if no response move to the next stage. All set up in minutes instead of an hour.

Reporting means Claude Code pulls client data from GoHighLevel, analyzes engagement metrics, and generates summaries. Weekly client updates that used to take 30 minutes of dashboard navigation now take 5 minutes.

## Operational tasks

The unglamorous stuff that keeps an agency running.

Documentation means Claude Code maintains our internal docs in Notion. When we add a new process, integration, or client, Claude Code updates the relevant pages. Our workspace stays organized because the AI is responsible for keeping it current.

Email and calendar through the Google Workspace MCP means Claude Code can check calendar availability, draft emails, and manage scheduling. Not fully autonomous because we review emails before sending. But the drafting and organization save significant time.

Repository maintenance means git operations, dependency updates, code cleanup, file organization. Claude Code handles all of it. Our repos stay clean because the AI follows the naming conventions and folder structure defined in our CLAUDE.md. And when something falls out of place because we were moving fast, Claude Code catches it and fixes it the next time it reads the project. It is like having a team member whose entire job is maintaining code hygiene.

## The numbers

These are real numbers from our workflows. Not projections.

Blog post full production: 1 day manual to 2 to 3 hours with Claude Code. Roughly 3x improvement.

Email sequence of 5 emails: 4 hours manual to 45 minutes with Claude Code. Roughly 5x improvement.

Website feature or new component: 1 week with freelancer to 1 day with Claude Code. 5x improvement.

Monthly output with the same 2 person team: in 2025, 4 blog posts, 2 client site projects, 10 automations. In 2026, 12 blog posts, 5 client site projects, 30 automations. 3x the output with the same team size. That is not a theoretical projection. That is our actual production volume.

## What Claude Code cannot do for an agency

Honesty matters here.

Client relationships. The human conversations, the trust building, the strategic advice. That is you. Claude Code handles execution, not relationships.

Creative strategy. Claude Code can execute a content strategy brilliantly, but it cannot tell you what your client's positioning should be. Strategic thinking is still a human skill.

Brand voice without training. Claude Code's default writing is generic. Without a detailed CLAUDE.md and writing guide, the content sounds AI generated. The setup investment is real and necessary.

Complex design decisions. Claude Code can implement a design, but it cannot make sophisticated visual design choices. You need a design reference for Claude Code to execute effectively.

Judgment calls on client work. When a client asks for something that is a bad idea, you need human judgment to push back diplomatically. Claude Code will build whatever you describe, whether it is a good idea or not.

## The learning curve for non developers

I am not a traditional software engineer. I learned to code through AI tools, not through a CS degree. My background is marketing and business development. When I started using Claude Code, the terminal was intimidating.

Week 1 was basic navigation. Opening a terminal, cd ing to a project folder, running Claude Code, giving simple instructions. Lots of "that is not what I meant" moments. Felt frustrating.

Week 2 was understanding what Claude Code needs. Learning to be specific. "Build a contact form" produces garbage. "Build a contact form with name, email, and message fields, styled to match our existing components, that sends an email notification via SendGrid" produces something usable. The skill is describing what you want clearly.

Week 3 was building the [CLAUDE.md](https://rsla.io/blog/claude-md-file-ai-context-guide). Adding rules as I discovered what mattered. Each rule reduced future friction. The AI started feeling like it understood our business.

Month 2 was productive. Running multiple sessions daily. Building client deliverables. Generating content. The terminal was not scary anymore. It was just where I worked.

Month 3 and beyond, Claude Code became invisible infrastructure. Like email. You do not think about how it works. You just use it to get things done.

If you are an agency owner considering Claude Code, budget 2 to 3 weeks for the learning curve. It is not zero, but it is not a degree program either. The biggest unlock is learning to describe what you want with enough specificity that Claude Code can execute without constant correction. Once that skill clicks, the terminal stops feeling like a barrier and starts feeling like a superpower.

## What we would do differently if starting over

Build the CLAUDE.md first, before doing any real work. We started using Claude Code and added rules as we encountered problems. If we had spent a day upfront writing our naming conventions, voice guide, and folder structure, the first two weeks would have been smoother.

Start with one workflow, not five. We tried to do everything at once. The cognitive load was too high. If we started over, we would master the blog content pipeline first, then expand to other workflows one at a time.

Set up [MCP servers](https://rsla.io/blog/mcp-servers-explained-ai-integrations) on day one. We initially used Claude Code without MCP integrations, manually copying data between tools. The moment we connected Sanity, GitHub, and Notion through MCP, our productivity jumped. Claude Code went from a smart assistant you had to feed information to an autonomous agent that could pull what it needed from your actual business systems. Do not wait on this. It is the difference between having a tool and having infrastructure.

## The bottom line

Claude Code is the third employee at RSL/A. It does not attend client meetings. It does not make strategic decisions. But it builds, deploys, generates, manages, and automates at a pace that makes a two person agency competitive with teams five times our size.

The investment: $20 per month for Claude Code Pro, time to build a CLAUDE.md file, and 2 to 3 weeks to learn the workflow. The return: 3x output, same day delivery on features that used to take weeks, and the ability to offer services that previously required a developer on staff.

If you are running a small agency and you are still outsourcing technical work or limiting your offerings because of headcount, [Claude Code is worth a serious look](https://rsla.io/#contact). Not as a novelty. As infrastructure.
