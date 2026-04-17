Last month I asked [Claude Code](https://rsla.io/blog/what-is-claude-code-guide) to check our Notion task board, find the three highest priority items, create a Slack message summarizing them, and add the deadlines to our Google Calendar. It did all four in about 90 seconds. No browser tabs. No copy-pasting between apps. No manual anything.

That is MCP at work.

MCP stands for Model Context Protocol. It is the reason Claude Code can talk to Notion, Stripe, Google Workspace, GitHub, Sanity, GoHighLevel, and dozens of other tools. Without MCP, Claude Code is an incredibly smart AI that can read and write files on your computer. With MCP, it becomes an AI that can interact with your entire business stack.

If you have ever wished you could just tell an AI "send that email" or "update that CRM record" or "deploy that website" and have it actually do it, MCP is what makes that possible.

## What MCP actually is

MCP is a protocol. A standardized way for AI models to communicate with external tools. Think of it like USB for AI. Before USB, every device needed its own proprietary connector. Printers, mice, keyboards, cameras all had different cables and ports. USB standardized the connection. One port, any device.

MCP does the same thing for AI integrations. Before MCP, if you wanted Claude to interact with Notion, someone had to build a custom Notion integration. If you wanted it to interact with Stripe, someone had to build a separate Stripe integration. Each integration was custom, each one worked differently, and maintaining them was a headache.

MCP standardizes this. An MCP server is a small program that exposes a tool's capabilities through a consistent interface. Any AI that speaks MCP can use any MCP server. The AI does not need to know how Notion's API works or how Stripe authenticates. The MCP server handles all of that. The AI just says "create a task in Notion" and the MCP server translates that into the right API calls.

This is why MCP is growing so fast. Once the standard exists, anyone can build an MCP server for their tool. Anthropic built the protocol. The community and tool vendors are building the servers. There are already hundreds of MCP servers available, and more are launching every week. The ecosystem went from a handful of servers in late 2025 to hundreds by early 2026. It is the fastest growing part of the AI tools landscape right now.

## How MCP works in practice

You install an MCP server on your machine. It runs as a small background process. You configure [Claude Code](https://rsla.io/blog/what-is-claude-code-guide) to connect to it by adding an entry to your settings file. That is the setup.

Once connected, Claude Code gains new capabilities. If you connect a Notion MCP server, Claude Code can read, create, and update Notion pages and databases. If you connect a Stripe MCP server, Claude Code can look up customers, check invoices, and manage subscriptions. If you connect a Google Workspace MCP server, Claude Code can send emails, manage calendar events, read documents, and work with spreadsheets.

The MCP server handles authentication, API calls, rate limiting, and error handling. Claude Code sends high-level requests ("find the customer with email john@example.com") and the MCP server does the actual API work. This separation is important because it means Claude Code does not need API keys embedded in your prompts or your [CLAUDE.md file](https://rsla.io/blog/claude-md-file-ai-context-guide). Credentials stay in the MCP server configuration.

Each MCP server exposes a set of tools. The Notion MCP server might expose tools like "search pages," "create page," "update page," "query database." The Google Workspace MCP server exposes tools for Gmail, Calendar, Drive, Docs, Sheets, and more. Claude Code sees all these tools and can use them the same way it uses its built-in tools like reading files or running terminal commands. It decides which tool to use based on your instructions and calls it automatically. You do not need to specify which MCP server to use. Claude Code figures that out from context.

## Why MCP matters for your business

Three reasons.

**It eliminates the tab-switching tax.** Every time you switch between apps to copy data, you lose time and context. Research shows that context switching costs 15 to 25 minutes of productivity each time. MCP lets you stay in one place (your terminal with Claude Code) and interact with every tool through natural language. "Update the client's status in GoHighLevel to active and send them the welcome email sequence" is one instruction, not six steps across two apps. You never leave your terminal.

**It makes automation accessible without code.** Before MCP, connecting tools required writing API integration code or using platforms like Zapier. MCP lets you automate cross-tool workflows through conversation. You describe what you want and Claude Code orchestrates the API calls through MCP servers. No code required from you.

**It compounds.** Each MCP server you add makes Claude Code more capable. With one MCP server, Claude Code can interact with one external tool. With 20, it can orchestrate workflows across your entire business stack. The more servers you connect, the more complex the tasks you can delegate. Our setup at RSL/A with 20 MCP servers means we can ask Claude Code to do almost anything that involves our business tools. And the real magic happens when Claude Code chains multiple MCP servers together in a single workflow. Check CRM, update spreadsheet, send email, schedule follow-up. One instruction, four tools, zero manual work.

## What MCP servers are available

The ecosystem is large and growing. Here are the categories that matter for most businesses.

**CRM and sales.** GoHighLevel, HubSpot, Salesforce. Manage contacts, update pipelines, trigger automations, pull reports.

**Content management.** Sanity, Notion, WordPress. Create and update content, manage assets, publish posts, organize databases.

**Developer tools.** GitHub, GitLab, Vercel, Supabase. Manage repositories, deploy code, run database queries, configure infrastructure.

**Communication.** Google Workspace (Gmail, Calendar, Drive, Docs, Sheets), Slack. Send emails, schedule events, read and write documents, manage files, post messages.

**Finance.** Stripe. Look up customers, manage subscriptions, check payment status, generate invoices.

**Design.** Figma. Read design files, extract component specs, inspect layouts.

**AI and search.** Context7 for up-to-date documentation lookups. Chrome DevTools for browser automation and testing.

Most MCP servers are open source and maintained by the community. Some are official, built by the tool vendor (like Notion's official MCP server or Stripe's official MCP server). Others are community-built and vary in quality and maintenance. We test every MCP server before relying on it for client work. The official ones are almost always more reliable and better documented. When an official server exists, use it over the community alternative.

## Setting up an MCP server

The setup takes 5 to 15 minutes per server depending on the tool.

Install the server. Most MCP servers are npm packages or Python packages. One command to install.

Configure authentication. Each tool needs its own credentials. An API key for Stripe, an OAuth token for Google Workspace, a personal access token for GitHub. You get these from each tool's developer settings.

Add the server to your Claude Code configuration. This means adding an entry to your `~/.claude.json` file that tells Claude Code where the server runs and how to start it.

Test the connection. Start a Claude Code session and try a simple operation. "List my recent Notion pages" or "show my Stripe customers." If it works, the MCP server is connected. If it fails, the error messages are usually clear enough to diagnose the issue. Most problems are authentication related: expired tokens, wrong scopes, or missing permissions.

The initial setup is the only friction. Once configured, MCP servers run automatically every time you start Claude Code. You do not need to reconnect or re-authenticate unless your tokens expire. We keep backup copies of all our API tokens and OAuth credentials in a secure local directory so re-authentication takes minutes instead of hours if something expires.

## MCP security

MCP servers run on your machine. Your API keys and credentials stay on your machine. Claude Code communicates with MCP servers locally, not through the cloud. This means your Stripe API key never leaves your computer and never gets sent to Anthropic.

However, you are giving Claude Code the ability to act through your accounts. If Claude Code has access to your Gmail through an MCP server, it can send emails as you. If it has access to your Stripe account, it can create invoices. [Hooks](https://rsla.io/blog/claude-code-hooks-automation-guide) help by adding programmatic guardrails around what Claude Code can do, but you should still be thoughtful about which MCP servers you connect and what permission levels you grant.

Our approach: use read-only tokens where possible. Give write access only when the workflow requires it. Set up [hooks](https://rsla.io/blog/claude-code-hooks-automation-guide) to require approval for sensitive operations like sending emails or modifying production data. And always test new MCP servers with non-production accounts first before connecting them to live client data. One bad API call to a production Stripe account is not something you want to learn from the hard way.

## Our MCP stack at RSL/A

We run 20 MCP servers. Here is the full list and what each one does for us.

Notion handles our task management, project tracking, and content planning. Google Workspace covers email, calendar, documents, and spreadsheets. Sanity manages our blog content, case studies, and website CMS. GitHub handles code repositories and version control. Stripe manages client billing and invoicing. GoHighLevel manages CRM, lead pipelines, and marketing automations. Vercel handles website deployments. Supabase manages databases. Chrome DevTools handles browser testing. Context7 provides up-to-date documentation. Plus several others including GitLab, Figma, and Meta Ads.

The most-used combination is Notion plus Google Workspace plus Sanity. That triangle handles about 70% of our daily work. Claude Code checks tasks in Notion, writes content in Sanity, schedules meetings in Calendar, and sends follow-ups through Gmail. All from one terminal window. No browser tabs. No context switching. Just natural language instructions and Claude Code orchestrating the right tools behind the scenes.

The second most valuable combination is GitHub plus Vercel plus Supabase. This handles our entire development workflow. Code management, deployment, and database operations all through Claude Code. A new feature goes from code to production without us ever opening a browser.

## How to decide which MCP servers to set up

Start with three. Your most-used tools. The ones you switch between most often during a typical workday. For most people that is a combination of email (Google Workspace), project management (Notion or similar), and whatever domain-specific tool you live in (CRM, CMS, code repo).

Get comfortable with those three before adding more. Each MCP server adds capability but also complexity. Twenty servers running simultaneously means twenty tools Claude Code might try to use, and sometimes it picks the wrong one. A smaller, focused stack is more predictable than a sprawling one.

Add servers when you feel friction. If you find yourself repeatedly saying "I wish Claude Code could access my Stripe account," that is the signal to add the Stripe MCP server. Organic growth based on real need is better than installing everything at once. We started with 3 MCP servers and grew to 20 over four months. Each one was added because of a real workflow need, not because it seemed cool to have.

## The bottom line

MCP is what turns Claude Code from a smart assistant into a connected operator. Without MCP, it reads and writes files. With MCP, it interacts with your entire business stack. The setup takes an afternoon for your first three servers. The productivity impact shows up the same day. You will wonder how you ever worked without it, the same way you wonder how anyone used separate cables for every device before USB existed.

If you are using Claude Code without MCP servers, you are leaving most of its potential on the table. If you want help setting up an MCP integration stack for your team, [RSL/A builds connected AI workflows](https://rsla.io/#contact) that tie your tools together through Claude Code and MCP.
