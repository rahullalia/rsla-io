# Claude Code hooks: how to give AI a leash without slowing it down

Here's the tension with autonomous AI coding agents. You want [Claude Code](https://rsla.io/blog/what-is-claude-code-guide) to work independently. That's the whole point. Describe a task, walk away, come back to finished work. But you also don't want it to force-push to main at 2 AM, delete a production database, or deploy untested code to a client's live site.

Hooks solve this tension.

Claude Code [hooks](https://code.claude.com/docs/en/hooks-guide) are user-defined rules that fire automatically at specific points in Claude Code's workflow. They can block dangerous commands before they execute, run tests after every code change, format code after edits, send Slack notifications when tasks complete, and enforce any rule you can express as a shell command or script.

Think of hooks as guardrails for an autonomous car. The car drives itself. The guardrails keep it on the road. Without guardrails, the car is fast but dangerous. With them, it's fast and safe.

We use hooks every day at [RSL/A](https://rsla.io/blog/claude-code-marketing-agency-workflow). They're the reason we can run Claude Code with minimal supervision. And they're one of the most underused features in the entire Claude Code ecosystem.

Here's how they work, what they look like in practice, and the essential hooks every team should set up.

## How hooks work

Claude Code has a lifecycle. Every time it wants to do something (read a file, edit code, run a terminal command, create a file), that action passes through a defined sequence of events. Hooks let you intercept any point in that sequence and run your own logic.

The lifecycle looks like this:

1. Claude Code decides it needs to use a tool (say, run a shell command)
2. **PreToolUse hook fires.** Your hook sees what Claude is about to do and decides: allow it, modify it, or block it
3. If allowed, the tool executes
4. **PostToolUse hook fires.** Your hook sees the result and can take follow-up actions (run tests, format code, send a notification)

The key mechanism is exit codes. A hook is just a shell command. If it exits with code 0, Claude Code proceeds normally. If it exits with code 2, the tool call is denied entirely. Claude Code sees the denial and tries a different approach.

That's the whole system. Simple in concept, powerful in practice.

## The 12 lifecycle events

Claude Code supports hooks at 12 different points in its lifecycle. You don't need to use all of them. Most teams use 2 to 4. Here are the ones that matter most:

**PreToolUse** fires before any tool executes. This is your primary safety mechanism. Use it to block dangerous commands, restrict file access, or require confirmation for risky operations.

**PostToolUse** fires after a tool completes. Use it to run tests, lint code, format files, or log what changed.

**Notification** hooks fire when Claude Code wants to notify you about something. Use these to send Slack messages, desktop notifications, or email alerts when tasks complete or errors occur.

**PreCompact** fires before Claude Code compresses its conversation history (which happens automatically during long sessions). Use it to save context or trigger a session wrap-up.

**UserPromptSubmit** fires when you submit a new prompt. Use it to validate inputs, add context, or redirect requests.

The other lifecycle events cover specific scenarios like session start, session end, and error handling. They're useful for specialized workflows but not essential for getting started.

## Essential hooks every team needs

After months of refining our hook setup, here are the five hooks that cover 90% of what a small team needs.

### Hook 1: Block destructive commands

This is the most important hook. Period.

A PreToolUse hook that scans every shell command Claude Code is about to run and blocks the dangerous ones. At minimum, block:

- `git push --force` (can overwrite your team's work)
- `git reset --hard` (can destroy uncommitted changes)
- `rm -rf` (can delete entire directories)
- `DROP TABLE` or `DROP DATABASE` (can destroy data)
- `git branch -D` (can delete branches with unmerged work)

The hook is a shell script that checks the incoming command against a deny list. If it matches, exit with code 2. Claude Code sees the denial, understands why, and finds a safer alternative.

This hook has saved us multiple times. Not because Claude Code is reckless, but because in a long session with many operations, the probability of a destructive command increases. The hook ensures it never reaches execution.

### Hook 2: Auto-run tests after code changes

A PostToolUse hook that fires after any file edit. If the edited file is in your source directory, the hook runs your test suite automatically. If tests fail, Claude Code sees the failure in its output and fixes the issue before moving on.

This is the guardrail that addresses the [productivity panic](https://rsla.io/blog/ai-coding-agents-productivity-panic) Bloomberg wrote about. Speed without validation is reckless. Speed with automatic testing is productive.

### Hook 3: Auto-format after edits

A PostToolUse hook that runs your code formatter (Prettier, ESLint, Black, whatever you use) after every file edit. This ensures that every file Claude Code touches matches your project's formatting standards. No manual cleanup, no inconsistent indentation, no style debates.

### Hook 4: Notification on task completion

A notification hook that sends a message to Slack (or any webhook endpoint) when Claude Code completes a significant task. This is especially useful when running long sessions or using [Remote Control](https://rsla.io/blog/claude-code-remote-control-guide) from your phone. Instead of checking back periodically, you get notified when the work is done.

### Hook 5: Git commit backup before risky operations

A PreToolUse hook that creates a git stash or checkpoint commit before operations that could modify many files. If Claude Code is about to do a large refactoring or migration, the hook ensures you have a restore point. If something goes wrong, you can revert.

## Setting up hooks

Hooks are configured in your [Claude Code settings file](https://code.claude.com/docs). The format is straightforward:

You define each hook with a matcher (which tool or event to intercept), a command (what to run), and optionally a working directory and timeout.

For example, a PreToolUse hook for the Bash tool might check the command against a deny list. The matcher specifies "Bash" as the tool, and the command is a shell script that reads the incoming command from stdin, checks for dangerous patterns, and exits with the appropriate code.

Hooks can also be defined in your project's `.claude/settings.json` file, which means they travel with the project. When a new team member clones the repo, they get the hooks automatically. No setup required.

## Real scenarios from our first month

Let me share actual incidents where hooks made the difference. These are all from our first month of using Claude Code without hooks versus after adding them.

**The force push incident.** During a long refactoring session, Claude Code decided to clean up the git history and force-pushed to main. This overwrote 3 days of commits from another branch. We had backups, but the recovery took 2 hours. After adding the destructive command hook: never happened again.

**The wrong file deletion.** Claude Code was cleaning up temporary files and deleted a configuration file that shared a similar name. The file was committed to git, so we recovered it, but the 20 minutes of debugging wasn't fun. After adding the deletion protection hook: it catches these and asks Claude Code to confirm the path first.

**The untested deployment.** Claude Code built a feature, skipped the test run (it wasn't explicitly asked to test), and pushed to production. The feature had a bug that broke the checkout flow for 45 minutes. After adding the auto-test hook: every code change triggers tests. Broken code never makes it to deployment.

**The silent completion.** Claude Code finished a 40 minute build while we were on a client call. We didn't know it was done until we walked back to the laptop 30 minutes later. After adding the Slack notification hook: we get pinged the moment a task completes.

None of these incidents were catastrophic. But all of them wasted time and introduced stress. Hooks eliminated each scenario entirely.

## Advanced hook patterns

Once you're comfortable with the basics, hooks can do much more.

**Conditional blocking.** Instead of blocking all force pushes, block force pushes to `main` and `production` but allow them on feature branches. The hook checks the branch name before deciding.

**Input validation.** A UserPromptSubmit hook can check your prompts for common mistakes. If you accidentally type a production database connection string, the hook can flag it before Claude Code sees it.

**Audit logging.** A PostToolUse hook can log every action Claude Code takes to a file or external service. Useful for compliance, debugging, or understanding how Claude Code works through complex tasks.

**Cost monitoring.** Hooks can track token usage across sessions and alert you when you're approaching budget thresholds. Useful for teams on API pricing.

**Multi-step workflows.** A PostToolUse hook can trigger a chain: after a successful build, run tests. After tests pass, deploy to staging. After staging deploys, send a Slack message with the preview URL. The entire pipeline is automated through hooks.

## Hooks vs CLAUDE.md instructions

People ask: "Why not just put 'never force push' in the CLAUDE.md file instead of writing a hook?"

Good question. Here's the difference.

[CLAUDE.md instructions](https://rsla.io/blog/claude-md-file-ai-context-guide) are suggestions. Claude Code reads them and follows them to the best of its ability. But instructions can be overridden by complex reasoning, long sessions where context fades, or edge cases the instructions didn't anticipate.

Hooks are enforcement. They're not suggestions. They're programmatic rules that execute regardless of what Claude Code thinks. A PreToolUse hook that blocks force pushes will block force pushes even if Claude Code has a compelling reason to do one. The hook doesn't care about context. It cares about exit codes.

The ideal setup uses both. CLAUDE.md for guidance and preferences. Hooks for hard limits and safety boundaries. Think of CLAUDE.md as the employee handbook and hooks as the locked doors. The handbook says "don't go into the server room." The lock ensures compliance.

## The security angle

If you read our post on [OpenClaw's security issues](https://rsla.io/blog/openclaw-ai-assistant-security-lessons), you know what happens when AI tools run without guardrails. OpenClaw had no permission system. Plugins ran with full system access. The result was predictable and ugly.

Claude Code hooks are the opposite approach. Instead of running everything with full access and hoping nothing goes wrong, hooks let you define exactly what's allowed and what's blocked. The [Claude Code GitHub repository](https://github.com/anthropics/claude-code) has examples of production hook configurations. The default is permissive (Claude Code can do what it needs to do), but you can tighten the boundaries wherever you need them.

For businesses handling sensitive data, this matters enormously. A hook that prevents Claude Code from accessing certain directories, reading certain file types, or running commands that touch production systems turns Claude Code from "powerful but scary" into "powerful and controlled."

## Getting started: the 15-minute setup

Here's the minimum viable hooks configuration that every Claude Code user should have. It takes 15 minutes to set up and covers the most critical safety scenarios.

1. **Create a deny list script** that blocks force pushes, hard resets, and recursive deletions. Add it as a PreToolUse hook for the Bash tool.
2. **Add a test runner hook** that executes your test suite after file edits. Add it as a PostToolUse hook for the Edit and Write tools.
3. **Set up a notification hook** that pings you on completion. Use a simple curl to a Slack webhook or similar service.

That's it. Three hooks. Fifteen minutes. The safety improvement is immediate and significant.

From there, add hooks as you encounter scenarios that need guardrails. Every incident where Claude Code does something unexpected is an opportunity to add a hook that prevents it from happening again. Over time, your hook configuration becomes a comprehensive safety net tailored to your specific workflow.

## The bottom line

Hooks are what make Claude Code safe for professional use. Without them, autonomous AI execution is a liability. With them, it's an asset.

The five essential hooks (block destructive commands, auto-test, auto-format, notify on completion, git backup) take 15 to 30 minutes to set up and eliminate the most common failure modes. Advanced hooks add compliance, monitoring, and multi-step automation.

If you're using Claude Code without hooks, you're running an autonomous agent without guardrails. It'll work most of the time. But the one time it doesn't will cost you more than the 15 minutes it takes to set up the basics. Do it today.
