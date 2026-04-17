Three months ago I started a Claude Code session on a client project without a CLAUDE.md file. Just wanted to make a quick fix. Twenty minutes later I was re-explaining our naming conventions, our folder structure, our deployment process, and which database to use. The fix itself took 4 minutes. The context setup took 16.

That is the tax you pay every single session without a CLAUDE.md file. And it compounds.

A CLAUDE.md file is a plain markdown document that sits in your project directory. [Claude Code](https://rsla.io/blog/what-is-claude-code-guide) reads it automatically at the start of every session. It contains your rules, your preferences, your project context, your conventions. Everything the AI needs to know about how you work, written once and applied forever.

At RSL/A, our main workspace CLAUDE.md is over 300 lines. It covers naming conventions, writing style, folder structure, permissions, MCP integrations, scheduling preferences, and session history. The difference between a session with it and a session without it is not incremental. It is the difference between working with a new contractor who knows nothing and working with a team member who has been here for months.

## What CLAUDE.md actually is

CLAUDE.md is not a prompt. It is not a system message. It is a persistent context file that Claude Code loads before your first message in every session. You never have to reference it or ask Claude to read it. It just happens.

The file is plain markdown. No special syntax, no YAML frontmatter required, no configuration format. You write instructions in English, organized however makes sense for your project. Claude Code interprets them as standing instructions that apply to everything it does during the session.

This matters because prompts are ephemeral. You type them once and they apply to one response. CLAUDE.md is persistent. It applies to every response, every tool call, every file edit, every command execution for the entire session. And for every future session too, because it lives in your project directory alongside your code.

The closest analogy is an employee handbook. When you hire someone new, you do not re-explain your coding standards, your deployment process, and your communication preferences every morning. You hand them the handbook. CLAUDE.md is that handbook for Claude Code.

## The hierarchy

Claude Code supports CLAUDE.md files at three levels, and this is where it gets powerful.

**Global level.** A CLAUDE.md file in your home directory (`~/.claude/CLAUDE.md`) applies to every project. Put universal preferences here. Your name, your timezone, your communication style, tools you always want available. Ours includes our writing style rules (no dashes, no corporate speak, conversational tone) because those apply to everything we do, not just one project.

**Project level.** A CLAUDE.md file in your project root applies to everything in that project. This is the most common level. Put project-specific context here: what the project does, which frameworks it uses, naming conventions, deployment targets, database configuration, API keys structure, folder layout.

**Folder level.** A CLAUDE.md file in any subdirectory applies only when Claude Code is working in that directory. Useful for monorepos or projects with distinct sections. Your API directory might have different conventions than your frontend directory. A folder-level CLAUDE.md handles that without cluttering the project-level file.

Claude Code merges all three levels. Global rules apply everywhere. Project rules add on top. Folder rules add on top of that. If there is a conflict, the more specific level wins. This means you can set broad rules globally and override them where needed without duplicating instructions across every project.

## What to put in your CLAUDE.md

After building and maintaining CLAUDE.md files for six months across multiple projects, here is what actually matters.

**Project overview.** Two to three sentences about what the project is and its role in your architecture. Our blog studio CLAUDE.md starts with: "Sanity Studio for rsla.io content management. This is the source of truth for all Sanity schemas. The website repo has no schemas, it reads content via CDN only." That single paragraph prevents Claude Code from trying to modify schemas in the wrong repo. It has saved us probably 20 confused sessions.

**Naming conventions.** Our workspace rule is four words: "camelCase for everything." Then we list the exceptions (numbered top-level folders, brand abbreviations, standard config files). Claude Code follows this automatically for every new file and folder it creates. No more renaming things after the fact.

**Writing style.** If Claude Code generates any content, documentation, blog posts, commit messages, it needs to know your voice. Without guidance, it defaults to generic AI writing. Our CLAUDE.md includes specific rules: write like a real person, no corporate jargon, no dashes, ranges use "to" not hyphens, and it points to a detailed voice DNA profile for long-form content. The result is output that sounds like it came from someone who works here.

**Permissions.** Define what Claude Code can do without asking and what requires confirmation. Too restrictive and it stops every 30 seconds for approval. Too permissive and it might delete something important. Our permissions section explicitly lists trusted directories, pre-approved tools, and actions that require confirmation (destructive git operations, moving files between directories, sending messages on shared platforms).

**Integrations.** If you use [MCP servers](https://rsla.io/blog/mcp-servers-explained-ai-integrations) for external tools, document them in CLAUDE.md. Which ones are active, how they authenticate, what they connect to. We list all 20 of our MCP integrations with their auth methods and key IDs. When Claude Code needs to interact with Notion or Sanity or GoHighLevel, it already knows the project IDs, database IDs, and authentication patterns.

**Folder structure.** A map of your project layout with brief descriptions of what lives where. This prevents Claude Code from putting files in wrong locations or searching the entire project when it needs to find something specific.

**Key gotchas.** Every project has landmines. API quirks, known bugs, things that work differently than you would expect. Our Sanity Studio CLAUDE.md has a section called "Data Notes" with entries like "When patching published documents via the Sanity MCP tool, it creates a draft, it does NOT modify the published doc directly." This one note has probably saved us 30 minutes of debugging across sessions.

## What not to put in your CLAUDE.md

This is just as important. A CLAUDE.md that is too long becomes noise. Claude Code has a context window and your file takes up space in it.

Do not put step by step tutorials. CLAUDE.md is for rules and context, not for teaching Claude Code how to code. It already knows how to code.

Do not put temporary information. If something is only relevant to your current task, say it in your prompt, not in CLAUDE.md. The file should contain durable knowledge that applies across sessions.

Do not duplicate documentation. If you have extensive API docs or framework guides, do not copy them into CLAUDE.md. Instead, point Claude Code to where the docs live. "For Sanity schema reference, see `schemaTypes/` directory."

Do not put obvious things. You do not need to tell Claude Code to write clean code or follow best practices. It already does that. Save your CLAUDE.md space for the things that are specific to your project and your preferences.

Our rule of thumb: if you have told Claude Code the same thing in three different sessions, it belongs in CLAUDE.md. If you have told it once, it probably does not.

## CLAUDE.md versus prompting every session

The obvious question: why not just include your preferences in every prompt?

Three reasons.

**Consistency.** Prompts vary. Some days you remember to include your naming conventions. Some days you forget. CLAUDE.md applies the same rules every time, regardless of what you type in the prompt.

**Scale.** Our CLAUDE.md is 300+ lines. You are not going to paste 300 lines into every prompt. And even if you did, it would crowd out the actual instructions for the task you want done.

**Evolution.** When you update CLAUDE.md, every future session gets the update. When you improve a prompt, only the current session benefits. CLAUDE.md compounds. Prompts do not.

There is also a relationship between CLAUDE.md and [hooks](https://rsla.io/blog/claude-code-hooks-automation-guide). CLAUDE.md is guidance. It tells Claude Code what you prefer. Hooks are enforcement. They programmatically block or modify actions regardless of what Claude Code thinks. The ideal setup uses both. CLAUDE.md for preferences and context. Hooks for hard safety boundaries.

## How CLAUDE.md evolves

Your first CLAUDE.md will be short. Maybe 20 lines. Project name, naming conventions, a few preferences. That is fine. Start there.

Then something happens. Claude Code creates a file with the wrong naming convention. You add a naming rule. Claude Code puts a file in the wrong directory. You add a folder structure section. Claude Code writes in a tone you do not like. You add voice guidelines.

Every correction becomes a permanent rule. The file grows organically based on real friction, not hypothetical scenarios. This is the right way to build it.

Our main workspace CLAUDE.md has a session log at the bottom. Every major session gets a dated entry noting what was set up, changed, or fixed. This serves two purposes: it gives Claude Code historical context about how the project evolved, and it gives us a changelog we can reference when something breaks.

After six months, our file covers everything from ADHD-aware scheduling preferences (Rahul's medication window affects when complex work should be scheduled) to which Notion databases to use for which tasks to how MCP server credentials are stored. None of this was planned upfront. All of it emerged from real sessions where we noticed Claude Code needed context it did not have.

The pattern is always the same. You notice friction. You identify the missing context. You add it to CLAUDE.md. Friction disappears. Permanently.

## Common patterns that work

**The "last updated" timestamp.** Put a date at the bottom of your CLAUDE.md. When you see it is months old, you know it is time to review and prune stale information.

**The integrations registry.** List every external tool Claude Code might need to interact with, including project IDs, database IDs, and auth methods. This eliminates the "which database do I use?" question that otherwise comes up constantly.

**The session log.** A running list of major changes and decisions. Keeps Claude Code oriented on project history without requiring it to read git logs.

**The rules of engagement.** Explicit do and do not lists. "Always use full domain URLs in blog links." "Never create documentation files unless explicitly requested." "Ask clarifying questions before diving into complex tasks." These rules prevent the most common friction points.

**The environment map.** Staging versus production URLs, API endpoints, deployment targets. Claude Code needs to know where things go, and putting this in CLAUDE.md prevents accidental production deployments.

## Getting started in 10 minutes

Create a file called CLAUDE.md in your project root. Add these five sections:

Project overview. Three sentences about what the project does and how it fits your architecture.

Naming conventions. One line about your preferred style (camelCase, snake_case, whatever you use) plus exceptions.

Key commands. How to run the dev server, run tests, build, and deploy. Claude Code will use these instead of guessing.

Folder structure. A tree showing where things live with one-line descriptions.

Known gotchas. Any project quirks that have tripped you up before.

That is a 10 minute task. Save the file, start a Claude Code session, and notice the difference immediately. Claude Code will reference your CLAUDE.md in its first response, confirming it loaded and understood your rules. You will see it follow your naming conventions without being asked. You will see it respect your folder structure without being reminded.

From there, grow the file based on friction. Every time you correct Claude Code about something project-specific, add it to CLAUDE.md. Within a month, you will have a comprehensive context file that makes every session feel like working with someone who knows your project intimately.

If you want help building a CLAUDE.md for your team or setting up [Claude Code workflows](https://rsla.io/blog/claude-code-marketing-agency-workflow) with proper context, [RSL/A builds AI development systems](https://rsla.io/#contact) that work the way you actually work.
