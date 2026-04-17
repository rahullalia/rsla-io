# The CLAUDE.md trick that serious teams are using to 10x their AI output

Every Claude Code session starts the same way. Claude reads a file called [CLAUDE.md](https://code.claude.com/docs). It's a plain text document that sits in your project directory. And it's the single most important thing separating people who get mediocre AI output from people who get consistently excellent results.

CLAUDE.md is your business context, written as instructions. Your naming conventions. Your writing style. Your folder structure. Your preferred tools. Your permissions. Your coding standards. Everything Claude needs to know about your project and your business, captured in one file.

Without it, [Claude Code](https://rsla.io/blog/what-is-claude-code-guide) is a brilliant generalist. It can write code, generate content, and build features. But it doesn't know your conventions, your voice, or your preferences. Every session starts from zero. You spend time re-explaining things that should be obvious.

With CLAUDE.md, Claude Code becomes a specialist who knows your business inside out. It follows your rules automatically. It writes in your voice. It uses your naming conventions. It respects your permissions. Every session picks up exactly where you left off on the knowledge front.

We've been using CLAUDE.md at [RSL/A](https://rsla.io/blog/ai-marketing-stack-what-we-use) since day one. Our file is over 200 lines. It covers everything from how we name files (camelCase, always) to how we write blog posts (conversational, no corporate speak, no em dashes) to which MCP integrations we use. The difference in output quality between a session with CLAUDE.md and a session without it is so large that we literally won't start a project without one.

Here's how to build yours.

## What goes in a CLAUDE.md file

A CLAUDE.md file is just a markdown document. There's no special syntax. No required format. You write instructions in plain English, organized however makes sense for your project. Claude Code reads it at the start of every session and follows whatever you've written.

That said, after months of refinement, we've settled on sections that work well for most projects.

### Project overview

Start with what this project is. One to three sentences that give Claude Code immediate context about what it's working with.

Our blog studio's CLAUDE.md starts with: "Sanity Studio for rsla.io content management. This is the source of truth for all Sanity schemas. The website repo has no schemas. It reads content via CDN only."

That single paragraph tells Claude Code the project type, its role in the architecture, and a critical constraint (schemas live here, not in the website repo). Without it, Claude might try to modify schemas in the wrong project.

### Naming conventions

Every project has naming preferences. Some use camelCase. Some use snake_case. Some use kebab-case. Some use a mix, and that's usually a problem.

Our CLAUDE.md says: "camelCase for everything. Every folder, every file." Then it lists the specific exceptions (numbered top-level folders, brand abbreviations, standard config files like .env and README.md).

When Claude Code creates a new file, it follows these rules automatically. No more renaming files after the AI creates them. No more explaining for the hundredth time that we don't use underscores.

### Writing style and voice

If Claude Code generates any content (blog posts, documentation, comments, commit messages), it needs to know your voice. Without guidance, it defaults to generic AI-speak. You know the kind. "Leveraging cutting-edge solutions to empower your workflow."

Our CLAUDE.md includes specific voice rules:

- Write like a real person, not an AI
- No robotic jargon, no AI-structured sentences
- No dashes (em dashes, en dashes) unless genuinely needed
- For ranges, use "to" instead: "$5,000 to $10,000" not "$5,000-$10,000"
- No emojis unless the platform warrants them
- Conversational, like texting a smart friend
- Specific numbers over vague descriptions

It also points to a detailed voice DNA profile that Claude can reference when writing long-form content. The result: every blog post, every piece of documentation, every client communication sounds like it was written by a human who works here. Because, in a way, it was.

### Permissions

CLAUDE.md can define what Claude Code is allowed to do without asking and what requires confirmation. This is separate from [hooks](https://rsla.io/blog/claude-code-hooks-automation-guide) (which are programmatic guardrails), but it works alongside them.

Our permissions section says things like:

- All files under ~/lalia/ are trusted. No permission prompts for reading, editing, or executing.
- All core tools (Bash, Read, Write, Edit, Glob, Grep, WebFetch) are pre-approved.
- You DO need to ask before: moving files between directories, destructive git operations, sending messages on shared platforms, deleting files that might contain work in progress.

This balance matters. Too restrictive, and Claude Code stops every 30 seconds to ask "Can I read this file?" Too permissive, and it might delete something you needed. The CLAUDE.md lets you tune this balance for your workflow.

### Tool and integration details

If your project uses specific tools, APIs, or services, document them. Claude Code can read this information and use it when making decisions about how to implement things.

Our CLAUDE.md lists every [MCP](https://modelcontextprotocol.io) integration we use (Notion, Google Workspace, Sanity, GitHub, Stripe, GoHighLevel, and 14 others). It includes project IDs, database IDs, API versions, and credential locations. When Claude Code needs to interact with Sanity, it knows the project ID is `yz25oyux` and the dataset is `production`. No guessing, no asking.

### Commands and workflows

You can define custom slash commands in CLAUDE.md that trigger specific workflows. We have commands like:

- `/commit` for git commit workflow
- `/deploy` for deployment
- `/wrap` for saving session context before exiting
- `/setup` for verifying all integrations are working

These commands are just instructions that Claude Code follows when you type the trigger. They make common workflows consistent and fast.

## Why CLAUDE.md works better than prompting

The question I hear most often: "Why not just tell Claude what you want at the start of each session?"

Three reasons.

### Persistence

When you type instructions at the start of a session, they exist in that session only. Next session, you start over. CLAUDE.md persists across every session. The instructions are always there. You don't need to re-explain your naming conventions or voice preferences. Ever.

### Completeness

A good CLAUDE.md is 100 to 300 lines of detailed context. Nobody types that at the start of a session. In practice, "just tell Claude what you want" means you give it the most critical 10% of your preferences and hope the other 90% doesn't matter. It does matter. CLAUDE.md captures everything because you build it over time, adding rules as you discover what matters.

### Team consistency

If multiple people use Claude Code on the same project (or if future you counts as a different person, which it does), CLAUDE.md ensures everyone gets the same context. The naming conventions, the voice, the permissions, the tool configuration. All consistent regardless of who starts the session.

## How to build your CLAUDE.md from scratch

Here's the practical guide. Step by step.

### Step 1: Start with the basics

Create a file called CLAUDE.md in your project root. Add a project overview (2 to 3 sentences), your most important naming convention, and one or two voice rules if you generate content.

Don't try to write a 200-line file on day one. Start small. Five to ten lines. Enough to give Claude Code the most critical context.

### Step 2: Work for a week and take notes

Use Claude Code normally for a week. Every time you correct Claude's output ("Actually, we use camelCase," "Don't use em dashes," "The config file is in this other folder"), write it down. These corrections are your CLAUDE.md entries.

By the end of the week, you'll have 10 to 20 rules that came from real friction. These are the rules that matter most because they address actual problems, not theoretical ones.

### Step 3: Add your corrections to CLAUDE.md

Take the corrections from the week and add them to your CLAUDE.md. Organize them into logical sections (naming, voice, permissions, tools). Be specific. "Use camelCase for all file and folder names" is better than "Use consistent naming."

### Step 4: Add integration details

If you use external tools or services, add their configuration details. Project IDs, database IDs, API endpoints, credential locations. The more Claude Code knows about your stack, the fewer questions it needs to ask.

### Step 5: Iterate weekly

Your CLAUDE.md should evolve. Every week, review it. Remove rules that turned out to be unnecessary. Add rules for new friction you encountered. Refine rules that were too vague. Over time, the file gets sharper and more effective.

Our CLAUDE.md has been through dozens of iterations. The version we use today looks nothing like the version we started with. That's expected and healthy.

## Common CLAUDE.md patterns that work

After working with several projects, here are patterns that consistently improve output quality.

**Negative rules work better than positive rules.** "Never use em dashes" is clearer than "Use periods for sentence breaks." "Don't create files unless absolutely necessary" is clearer than "Prefer editing existing files."

**Specific examples beat abstract descriptions.** Instead of "Use conversational tone," write: "Write like texting a smart friend. Use 'And you know what?', 'So basically', 'But yeah', 'Honestly?' Avoid 'leverage', 'synergy', 'revolutionary'."

**Reference IDs save time.** If Claude Code works with a CMS, database, or API that uses IDs, put the common ones in CLAUDE.md. Our file includes category IDs, author IDs, project IDs, and database IDs. This eliminates "What's the category ID for AI Automation?" conversations.

**Folder structures prevent misplacement.** A simple directory tree in CLAUDE.md prevents Claude Code from creating files in the wrong location. We include our full folder structure with descriptions. Claude Code never creates a file in the wrong directory because it knows exactly where everything goes.

**Workflow descriptions reduce back-and-forth.** If you have a specific workflow (like "always run tests after editing code" or "deploy to staging before production"), document it. Claude Code will follow the workflow without you needing to remind it.

## Real impact: before and after

Let me give you concrete numbers from our experience.

**Before CLAUDE.md:** Every Claude Code session started with 2 to 5 minutes of context-setting. Average output required 3 to 4 corrections per session for style, naming, or structural issues. About 15% of generated files needed renaming. Content output sounded generic.

**After CLAUDE.md:** Sessions start immediately with full context. Average corrections dropped to 0 to 1 per session. Zero files need renaming. Content output matches our voice consistently. The cumulative time savings over dozens of daily sessions is enormous.

The file took about 2 hours total to build (across the first week of iterating). It saves about 10 to 15 minutes per session. If you run 5 to 10 sessions per day, that's over an hour saved daily. The ROI is absurd.

## CLAUDE.md beyond Claude Code

One more thing worth mentioning. The concept of a context file isn't limited to Claude Code. If you use [Cursor](https://cursor.com), you can create a `.cursorrules` file that serves the same purpose. If you use other AI tools, most support some form of system prompt or project context.

The name changes. The format might change. But the principle is universal: give your AI tool persistent, detailed context about your project and your preferences, and the output quality improves dramatically.

Even if you eventually switch from Claude Code to another AI tool, the thinking you put into your CLAUDE.md transfers. The rules about naming, voice, permissions, and workflows are your business knowledge. They apply regardless of which AI reads them.

So even if you're not sure Claude Code is your long-term tool, building a CLAUDE.md is worth the investment. The context is yours. The AI is just the reader.

## The bottom line

CLAUDE.md is the competitive advantage that nobody talks about. Not the model. Not the subscription tier. Not the fancy features. A plain text file that tells Claude how your business works.

The teams getting the best results from AI coding tools aren't the ones with the biggest budgets or the most sophisticated prompts. They're the ones who invested time in context. CLAUDE.md is how that context becomes persistent, complete, and team-wide.

If you use [Claude Code](https://rsla.io/blog/claude-code-marketing-agency-workflow) and don't have a CLAUDE.md file, stop what you're doing and create one. Start with five lines. Add to it every time you correct Claude's output. Within a week, you'll wonder how you ever worked without it.
