# Claude Code Remote Control: how to manage your AI agent from your phone

On February 24, 2026, [Anthropic](https://www.anthropic.com/claude) shipped a feature that changed how I work. They called it Remote Control. The pitch: start a Claude Code session on your computer, then monitor and control it from your phone. Or a tablet. Or any browser, anywhere.

The code never leaves your machine. Only messages travel through an encrypted bridge. You're not running Claude Code "on the cloud." You're controlling your local session remotely.

I've been using it for about a week now. And honestly? It's one of those features that sounds like a nice-to-have until you try it. Then you can't go back.

Here's everything you need to know. What it does, how it works, how to set it up, and the real use cases that make it worth your attention.

## What Remote Control actually does

Let's be specific, because the name "Remote Control" could mean a lot of things.

Remote Control lets you interact with an active [Claude Code](https://rsla.io/blog/what-is-claude-code-guide) session on your computer from any web browser. Your laptop is running Claude Code in a terminal. The AI agent is reading files, writing code, running tests, building things. All of that computation and file access happens locally on your machine.

Remote Control gives you a browser-based interface to that local session. You can:

- See everything Claude Code is doing in real-time
- Send new instructions or follow-up messages
- Approve or reject tool calls (file edits, command execution)
- Review the full conversation history
- Stop the session or redirect it

The browser interface works on any device. Phone, tablet, another computer. As long as you have a browser and internet connection, you can control your session.

What it does *not* do: it does not move your code to the cloud. Your files stay on your machine. Your MCP integrations stay local. The only thing that travels through Anthropic's infrastructure is the conversation (your messages and Claude's responses, plus tool results like error messages or file diffs). And that travel happens over an end-to-end encrypted connection.

## How the architecture works

Understanding the architecture matters because it explains why Remote Control is more secure than most remote access tools.

Here's the flow:

**Your machine** runs Claude Code normally. It has access to your files, your project, your terminal, your MCP servers (Notion, GitHub, Stripe, whatever you've configured). Nothing about the local setup changes.

**An outbound HTTPS connection** goes from your machine to Anthropic's API. This is the same connection Claude Code already uses to communicate with the Claude model. Remote Control extends this to include a session bridge.

**The session bridge** acts as a relay. It passes your remote messages to the local Claude Code process and sends Claude's responses back to your browser. It doesn't store your code. It doesn't have access to your file system. It's a message relay, nothing more.

**Your phone or browser** connects to the session bridge through a unique, authenticated URL. You open the URL, and you see the live session. You type a message, it arrives at your local Claude Code process. Claude responds, and the response appears in your browser.

If you close your terminal (or the Claude Code process stops for any reason), the remote session ends immediately. There's no persistent access. No background daemon. No always-on service exposing your machine.

This design means Remote Control is inherently more secure than tools like SSH, VNC, or TeamViewer. Those tools give full machine access. Remote Control only exposes the Claude Code conversation. You can't browse files, open applications, or access anything outside the Claude Code session through the remote interface.

## Setting up Remote Control

The setup is genuinely simple. Four steps, under a minute.

### Step 1: Start Claude Code

Open your terminal, navigate to your project, and start Claude Code as you normally would:

- Open your terminal
- Navigate to your project folder
- Type `claude` and press enter

### Step 2: Run the remote command

Inside the Claude Code session, type `/remote` and press enter. Claude Code will establish the outbound connection to Anthropic's session bridge. The full setup is documented in the [Remote Control guide](https://code.claude.com/docs/en/remote-control).

### Step 3: Get your session URL

Claude Code will display a unique URL. Something like `https://claude.ai/remote/abc123-xyz789`. This URL is your remote access point. It's unique to this session and expires when the session ends.

### Step 4: Open on your phone

Open the URL in any browser on your phone (or any device). You'll see the live Claude Code session. You can now send messages, approve actions, and monitor progress.

That's it. No app to install on your phone. No configuration files. No port forwarding. No VPN. Just a URL and a browser.

## Why this matters for agencies and small teams

Here's where Remote Control stops being a cool feature and starts being a workflow shift.

At [RSL/A](https://rsla.io/blog/ai-marketing-stack-what-we-use), we run a two-person agency. Our mornings typically look like this: start a Claude Code session on a client project, kick off a build or content generation task, and then move on to something else. Client calls, strategy work, email, whatever needs attention.

Before Remote Control, checking on a running Claude Code session meant going back to my laptop. If I was on a call, I couldn't see if the build completed. If I was at lunch, I had no idea if it hit an error and was waiting for input. The session was tied to the physical terminal.

Now? I start a build at 9 AM. At 9:30, I'm on a client call. At 10:15, I pull out my phone, check the session. It's 90% done and asking for approval on a deployment. I approve from my phone. By the time the call ends, the work is deployed.

The use cases stack up fast:

### Monitoring long-running tasks

Some Claude Code sessions take 30 to 45 minutes. Content generation pipelines, database migrations, large refactoring jobs. You don't want to sit and watch a terminal for 45 minutes. Start it, walk away, check from your phone.

### Approving actions while mobile

Claude Code has [permission hooks](https://rsla.io/blog/claude-code-hooks-automation-guide) that require your approval for certain operations. Deploying to production. Deleting files. Running destructive commands. Remote Control means you can approve these from anywhere instead of being chained to your desk.

### Supervising from a different room

Working from home and need to check on a session running in your office? Pull it up on your phone. Running a session on a desktop but working from your laptop? Open the URL in your laptop's browser. The session is wherever you are.

### Client demonstrations

This one surprised me. We've started pulling up Remote Control URLs during client calls to show Claude Code working in real-time. The client sees the AI agent reading their project files, making changes, running tests. It's a dramatically better demo than screen sharing a terminal.

### Running sessions on a remote server

If you run Claude Code on a cloud server or a dev machine at your office, Remote Control turns your phone into the interface. You don't need SSH, you don't need a VPN, you don't need a remote desktop tool. Just the session URL.

## Security considerations

I know what you're thinking. "You're giving my AI agent a URL that anyone could access?" Fair concern. Here's why it's actually secure.

**The URL is unique and ephemeral.** Each session generates a new URL. When the session ends, the URL dies. There's no persistent endpoint. No one can bookmark your session and come back later.

**Authentication is built in.** The session URL contains an authentication token. Only someone with the exact URL can access the session. Treat it like a password.

**End-to-end encryption.** Messages between your browser and your local Claude Code process are encrypted. Anthropic's bridge relays encrypted payloads. Even Anthropic can't read the content of your session.

**No file system access.** The remote interface only shows the Claude Code conversation. You can't browse your file system, open other applications, or do anything outside the scope of the session. It's not remote desktop. It's remote conversation.

**Session ends with your terminal.** Close the terminal window, and the remote session terminates immediately. There's no lingering access, no orphaned connections.

**You control the scope.** Your Claude Code session's capabilities are defined by your CLAUDE.md file, your hooks, and your MCP configuration. Remote Control doesn't expand those capabilities. It just gives you another way to interact with them.

The biggest practical security tip: don't share your session URL in public channels. Treat it like a meeting link with admin privileges. Share it directly with people you trust, if anyone.

## What Remote Control doesn't do (yet)

A few limitations worth knowing:

**No persistent sessions.** If your computer goes to sleep or the terminal crashes, the session is gone. There's no way to resume a disconnected session. You start a new one.

**No multi-user collaboration.** Right now, Remote Control is one person controlling one session. There's no "share with a teammate so they can also send commands" feature. That could come later, but for now, it's single-user.

**No native mobile app.** It's a web interface in your phone's browser. It works well, but it's not a dedicated app with push notifications, offline queuing, or deep OS integration.

**No file preview in the remote interface.** You can see that Claude Code edited a file, and you can read the diff in the conversation. But you can't open the full file in the remote interface. For that, you'd need to go back to your machine or use a separate tool.

**Team and Enterprise plans don't have it yet.** As of February 2026, Remote Control is available on Pro and Max plans as a research preview. Team and Enterprise access is coming but hasn't shipped.

## How Remote Control fits into the Claude Code ecosystem

Remote Control is part of a pattern. Anthropic is building Claude Code into a [full workflow tool](https://code.claude.com/docs), not just a terminal app.

You've got the [CLAUDE.md file](https://rsla.io/blog/claude-md-file-ai-context-guide) for persistent context. [Hooks](https://rsla.io/blog/claude-code-hooks-automation-guide) for automated guardrails. [MCP servers](https://rsla.io/blog/mcp-servers-explained-ai-integrations) for connecting to external tools. And now Remote Control for untethering from your desk.

Each feature makes Claude Code more useful for professional work. Context means it understands your business. Hooks mean it follows your rules. MCP means it talks to your tools. Remote Control means it fits into your schedule instead of demanding you sit in front of a terminal.

For a small agency, this combination is substantial. I can start a build before a client call, approve actions from my phone during lunch, and review the results from my tablet on the couch. The AI does the work. I steer from wherever I am.

## Tips for getting the most out of Remote Control

After a week of daily use, here are the things I wish I'd known from the start.

**Write detailed initial prompts.** Since you're going to walk away and check back later, front-load your instructions. Instead of iterating in real-time, give Claude Code a comprehensive description of what you want before you leave. The better the initial prompt, the less you'll need to course-correct remotely.

**Set up hooks before starting.** If you have hooks configured to auto-approve safe operations (like file reads) and require approval for risky ones (like deployments), Remote Control works seamlessly. You'll only get prompted on your phone for the things that actually matter. Without hooks, you'll get prompted for everything, and your phone will keep buzzing.

**Keep your session URL private.** I know I said this in the security section, but it bears repeating. Don't share it in a Slack channel or paste it in a group chat. Send it directly to specific people if needed. Better yet, keep it to yourself.

**Check your machine's sleep settings.** If your laptop goes to sleep after 15 minutes of inactivity, your session dies. Adjust your power settings before starting a long task, or use a desktop that stays awake.

**Use it for builds, not for exploration.** Remote Control is best when Claude Code is executing a known task. Exploratory sessions where you're figuring out the approach need the back-and-forth that's better done at your desk. Save Remote Control for the execution phase.

## The bottom line

Remote Control is a simple feature with a big impact. Start a Claude Code session on your computer, control it from your phone. Your code stays local. Only messages travel through the bridge. End-to-end encrypted.

If you already use Claude Code, try it today. Run `/remote` in your next session and open the URL on your phone. That's all it takes. If you don't use Claude Code yet, read our [beginner's guide](https://rsla.io/blog/what-is-claude-code-guide) first, then come back to this.

The future of AI-assisted work isn't sitting in front of a terminal watching an agent type. It's starting the work, walking away, and checking in from wherever life takes you. Remote Control makes that real.
