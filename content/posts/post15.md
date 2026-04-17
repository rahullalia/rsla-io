# MCP servers explained: the universal plug that connects AI to everything

There's a reason [Claude Code](https://rsla.io/blog/what-is-claude-code-guide) can talk to Notion, Stripe, GitHub, Google Calendar, GoHighLevel, and dozens of other tools without custom integrations for each one. That reason is MCP.

Model Context Protocol. If you haven't heard of it yet, you will. It's the standard that's reshaping how AI tools connect to the software you already use. And understanding it, even at a basic level, will change how you think about what AI can actually do for your business.

At RSL/A, we run [20 MCP servers](https://rsla.io/blog/ai-marketing-stack-what-we-use) in our daily workflow. They connect Claude Code to everything from our CMS (Sanity) to our client management platform (GoHighLevel) to our version control (GitHub) to our payment processor (Stripe). One protocol, 20 integrations. No custom code for any of them.

Here's what MCP is, why it matters, and how to think about it even if you never plan to set one up yourself.

## What is MCP?

MCP stands for Model Context Protocol. It's an [open standard created by Anthropic](https://www.anthropic.com/news/model-context-protocol) that gives AI tools a universal way to connect to external applications and services.

Think of it like USB-C for AI.

Before USB-C, every device had its own charging cable. iPhones had Lightning. Android phones had Micro USB. Laptops had proprietary connectors. Your drawer was full of cables, and you could never find the right one.

USB-C fixed that. One cable, every device. The same port charges your phone, your laptop, your headphones, and your game controller.

MCP does the same thing for AI integrations. Before MCP, if you wanted Claude Code to talk to Notion, someone had to build a custom Notion integration. Want it to talk to Stripe? Another custom integration. GitHub? Another one. Each integration was a one-off project, and they all worked differently.

With MCP, there's one standard. Build an MCP server for Notion, and any MCP-compatible AI tool can use it. Not just Claude Code. Cursor, Windsurf, VS Code, Copilot, Cline, Zed, Replit. They all speak MCP.

One standard. Every tool.

## How MCP works (the non-technical version)

You don't need to understand the protocol specification. Here's the mental model that matters:

**Your AI tool (the client)** is Claude Code, Cursor, or whatever you're using. It knows how to speak MCP. When it needs information from an external service or wants to take an action, it sends a request through the MCP protocol.

**The MCP server** is a small program that sits between your AI tool and the external service. It translates MCP requests into API calls that the service understands, and translates the responses back into MCP format. Think of it as an interpreter.

**The external service** is Notion, Stripe, GitHub, or whatever tool you want to connect. It doesn't need to know anything about MCP. The MCP server handles the translation.

So the flow is: Claude Code says "I need to create a new page in Notion." The MCP server hears this, translates it into a Notion API call, sends it to Notion, gets the response, and translates it back for Claude Code. Done.

The key insight: the AI tool doesn't need to understand every service's API. It just needs to speak MCP. The MCP server handles the rest.

## Why MCP matters for your business

This might sound like infrastructure nobody cares about. But the practical impact is enormous.

### Before MCP: integration hell

Before MCP, connecting an AI tool to your business stack required custom development for every single integration. Want Claude Code to update your CRM? Write custom code. Want it to check your calendar? Write more custom code. Want it to deploy your website? More custom code.

Each integration was a bespoke project. Different APIs, different authentication methods, different data formats, different error handling. Every integration was maintained separately. When an API changed, every integration that used it broke.

For a small agency like ours, this was a non-starter. We don't have time to build and maintain 20 custom integrations.

### After MCP: plug and play

With MCP, adding a new integration to Claude Code takes minutes, not days. Find an MCP server for the service you want (GitHub, Notion, Stripe, whatever). Add it to your Claude Code configuration. Done.

The MCP server handles authentication, API translation, error handling, and data formatting. You just tell Claude Code what you want, and it uses the MCP server to make it happen.

When we added GoHighLevel to our stack, it took about 10 minutes. Find the official GHL MCP server. Add the connection to our config file. Test it with a simple query. That's it. Claude Code could now pull contact data, update pipelines, and manage our client communications. No custom code, no API wrangling.

### The network effect

Here's where it gets really interesting. Because MCP is an open standard, every MCP server that anyone builds benefits everyone. When someone creates an MCP server for Airtable, every Claude Code user, every Cursor user, every MCP-compatible tool can use it.

The ecosystem had 8 million downloads by April 2025, up from 100,000 at launch in November 2024. That's 80x growth in five months. The market is projected at $2.7 billion in 2025, growing to $5.6 billion by 2034.

This isn't a niche protocol. It's becoming the standard for how AI connects to everything.

## What MCP servers are available right now

The list is long and growing weekly. Here are the categories that matter most for businesses.

### Productivity and project management

- **Notion:** Read, create, and update pages, databases, and comments
- **Google Workspace:** Calendar events, Drive files, Sheets data, Docs content, Slides presentations
- **Slack:** Read channels, send messages, search conversations
- **Linear:** Issues, projects, and workflow management
- **Asana, Monday.com, ClickUp, Trello:** Task management integrations

### Development and deployment

- **GitHub:** Repositories, pull requests, issues, code search, file management
- **GitLab:** Similar capabilities to GitHub's MCP server
- **Vercel:** Deployments, domains, project management
- **Supabase:** Database queries, edge functions, project management
- **Cloudflare:** Workers, KV storage, R2 storage

### CRM and marketing

- **GoHighLevel:** Contacts, pipelines, conversations, calendars, blog posts, social media
- **HubSpot:** CRM data, marketing automation
- **Stripe:** Customers, products, prices, invoices, subscriptions
- **Meta Ads:** Campaign management, ad sets, creatives, audience targeting, analytics

### Content and design

- **Sanity:** Document querying, content creation, schema management, image generation
- **Figma:** Design file access, component inspection
- **ShadCN UI:** Component discovery and installation
- **Magic UI:** Animation and component design

### Data and infrastructure

- **PostgreSQL:** Direct database querying and management
- **Redis:** Key-value storage operations
- **Chrome DevTools:** Browser automation, screenshots, network monitoring

We run 20 of these at RSL/A. Not all at once. Some are always active (Notion, Google Workspace, Sanity, GitHub). Others are on-demand (Meta Ads, Stripe, Figma). The point is: each one took minutes to add, and they all work through the same protocol.

## How to set up an MCP server

If you're using Claude Code, adding an MCP server is straightforward. Here's the general process:

1. **Find the MCP server** for the service you want. Check the [official MCP server registry](https://github.com/modelcontextprotocol/servers), npm, or the service's documentation.
2. **Get authentication credentials** for the service (API key, OAuth token, or whatever the service requires).
3. **Add the server to your Claude Code configuration.** This is a JSON entry in your settings file that specifies the server command and authentication details.
4. **Test it.** Ask Claude Code to do something with the new integration. "List my GitHub repositories" or "Show my upcoming calendar events."

The specifics vary by server, but the pattern is always the same. Find, authenticate, configure, test. Most servers have clear documentation, and the setup takes 5 to 15 minutes including authentication.

## MCP security: what you should know

Because MCP servers have access to your business tools, security matters. Here's how the protocol handles it.

**You control which servers run.** MCP servers are explicitly configured by you. Nothing runs without your knowledge. This is fundamentally different from [unvetted plugin marketplaces](https://rsla.io/blog/openclaw-ai-assistant-security-lessons) where anyone can publish code.

**Each server runs in its own process.** An MCP server for Notion can't access your Stripe data. Each integration is isolated. A compromised server can only affect the service it's connected to.

**Authentication is per-server.** Each MCP server has its own credentials. You can revoke access to one service without affecting others. If your Stripe MCP token is compromised, your GitHub access is unaffected.

**The protocol itself is read-write explicit.** MCP servers declare their capabilities upfront. A server that only reads data can't suddenly start writing. The capabilities are defined in the server's manifest, and the AI tool respects those boundaries.

**Community servers require trust.** While official MCP servers (like those from Anthropic, GitHub, or Notion) are well-maintained, community-built servers vary in quality. We only use servers from trusted sources, official integrations, major open-source projects, or code we've reviewed ourselves.

## MCP isn't just for Claude Code

This is an important point that most coverage misses. MCP was created by Anthropic, but it's not locked to Anthropic's tools. The full [MCP specification and documentation](https://modelcontextprotocol.io) is publicly available.

In December 2024, Anthropic donated MCP to the Linux Foundation. Since then, OpenAI has adopted it for their developer tools. Google has added MCP support. Microsoft's tools speak MCP.

This means the MCP servers you set up for Claude Code also work with Cursor, Windsurf, VS Code with Copilot, Cline, Zed, and Replit. If you switch AI tools, your integrations come with you.

For businesses, this eliminates vendor lock-in. Your investment in MCP integrations isn't tied to any single AI tool. The same Notion MCP server that connects Claude Code to your workspace will work with whatever AI tool you use next year.

## Real-world example: our MCP stack

Here's how MCP works in practice at RSL/A.

When Claude Code starts a session, it loads our CLAUDE.md file (which tells it about our business) and connects to our configured MCP servers. From that point, it can:

- **Query our CMS** to find published blog posts, check SEO metadata, or identify content gaps (Sanity MCP)
- **Create and manage content** by writing documents, uploading images, and patching metadata (Sanity MCP)
- **Check our calendar** to find open time blocks for scheduling (Google Workspace MCP)
- **Create pull requests** and manage code reviews (GitHub MCP)
- **Look up client data** and pipeline status (GoHighLevel MCP)
- **Search for components** when building client websites (ShadCN UI MCP)

All of this happens through MCP. Claude Code doesn't know Sanity's API or GoHighLevel's API or GitHub's API. It knows MCP, and the servers handle the translation.

The result is an AI agent that's truly integrated into our business, not isolated in a chat window. When we tell Claude Code to "generate 12 blog posts with images and upload them to Sanity with proper SEO metadata," it can actually do that because MCP connects it to our CMS. When we say "check GoHighLevel for Lisa Paqueta's contact info and last interaction," it can pull that data because MCP connects it to our CRM.

## How to think about MCP as a business decision

If you're evaluating AI tools for your business, MCP compatibility should be on your checklist. Here's why:

**Futureproofing.** AI tools will change. The integrations you set up through MCP will work with future tools, not just today's.

**Reduced development cost.** Every MCP server that the community builds is one less integration you need to build yourself. The ecosystem is growing fast enough that most business tools already have MCP servers.

**Composability.** You can combine MCP servers in ways the creators never intended. Claude Code can use Notion MCP to read a content brief, Google Workspace MCP to check your calendar for publication dates, Sanity MCP to create the blog post, and GitHub MCP to deploy the updated site. Four services, one workflow, zero custom integration code.

**Security model.** MCP's architecture of isolated servers with explicit capabilities is more secure than monolithic tools that try to do everything. You choose exactly what's connected, and each connection is independently controlled.

## The bottom line

MCP is the infrastructure layer that makes AI agents practical for business. Without it, every AI integration is a custom project. With it, connecting your AI tool to a new service takes minutes.

You don't need to set up MCP servers yourself to benefit from them. But understanding that MCP exists and how it works will help you evaluate AI tools, plan your tech stack, and make smarter decisions about which AI investments will last.

The USB-C analogy holds: once you've used a universal standard, going back to proprietary cables feels absurd. MCP is that standard for AI integrations. And with 8 million downloads and growing, it's not going anywhere.
