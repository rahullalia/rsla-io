On February 24, 2026, Anthropic shipped a feature that changed how I work. They called it Remote Control. The pitch: start a [Claude Code](https://rsla.io/blog/what-is-claude-code-guide) session on your computer, then monitor and control it from your phone. Or a tablet. Or any browser, anywhere.

The code never leaves your machine. Only messages travel through an encrypted bridge. You are not running Claude Code "on the cloud." You are controlling your local session remotely.

I have been using it daily since launch. And honestly? It is one of those features that sounds like a nice to have until you actually try it. Then you cannot go back.

## What Remote Control actually does

Remote Control lets you interact with an active Claude Code session on your computer from any web browser. Your laptop is running Claude Code in a terminal. The AI agent is reading files, writing code, running tests, building things. All of that computation and file access happens locally on your machine.

Remote Control gives you a browser based interface to that local session. You can see everything Claude Code is doing in real time, send new instructions or follow up messages, approve or reject tool calls like file edits and command execution, review the full conversation history, and stop or redirect the session.

The browser interface works on any device. Phone, tablet, another computer. As long as you have a browser and internet connection, you can control your session.

What it does not do: it does not move your code to the cloud. Your files stay on your machine. Your MCP integrations stay local. The only thing that travels through Anthropic's infrastructure is the conversation, your messages and Claude's responses plus tool results like error messages or file diffs. And that travels over an end to end encrypted connection.

## How the architecture works

Understanding the architecture matters because it explains why Remote Control is more secure than most remote access tools.

Your machine runs Claude Code normally. It has access to your files, your project, your terminal, your [MCP servers](https://rsla.io/blog/mcp-servers-explained-ai-integrations) like Notion, GitHub, Stripe, whatever you have configured. Nothing about the local setup changes.

An outbound HTTPS connection goes from your machine to Anthropic's API. This is the same connection Claude Code already uses to communicate with the Claude model. Remote Control extends this to include a session bridge.

The session bridge acts as a relay. It passes your remote messages to the local Claude Code process and sends Claude's responses back to your browser. It does not store your code. It does not have access to your file system. It is a message relay, nothing more.

Your phone or browser connects to the session bridge through a unique, authenticated URL. You open the URL and you see the live session. You type a message, it arrives at your local Claude Code process. Claude responds, and the response appears in your browser.

If you close your terminal or the Claude Code process stops for any reason, the remote session ends immediately. There is no persistent access. No background daemon. No always on service exposing your machine.

This design means Remote Control is inherently more secure than tools like SSH, VNC, or TeamViewer. Those tools give full machine access. Remote Control only exposes the Claude Code conversation. And the scope of what Claude Code can do is already controlled by your [CLAUDE.md](https://rsla.io/blog/claude-md-file-ai-context-guide) configuration and hooks. So even through the remote interface, the AI can only do what you have already authorized it to do.

## Setting up Remote Control

The setup is genuinely simple. Four steps, under a minute.

Start Claude Code normally. Open your terminal, navigate to your project, type `claude` and press enter.

Run the remote command. Inside the Claude Code session, type `/remote` and press enter. Claude Code will establish the outbound connection to Anthropic's session bridge.

Get your session URL. Claude Code will display a unique URL like `https://claude.ai/remote/abc123-xyz789`. This URL is your remote access point. It is unique to this session and expires when the session ends.

Open on your phone. Open the URL in any browser on your phone or any device. You will see the live Claude Code session. You can now send messages, approve actions, and monitor progress.

That is it. No app to install on your phone. No configuration files. No port forwarding. No VPN. Just a URL and a browser. The whole setup takes less than a minute. I have done it mid conversation on a phone call without the other person noticing.

## Why this matters for agencies and small teams

At RSL/A, we run a two person agency. Our mornings typically look like this: start a Claude Code session on a client project, kick off a build or content generation task, and then move on to something else. Client calls, strategy work, email, whatever needs attention.

Before Remote Control, checking on a running Claude Code session meant going back to my laptop. If I was on a call, I could not see if the build completed. If I was at lunch, I had no idea if it hit an error and was waiting for input. The session was tied to the physical terminal.

Now I start a build at 9 AM. At 9:30, I am on a client call. At 10:15, I pull out my phone, check the session. It is 90% done and asking for approval on a deployment. I approve from my phone. By the time the call ends, the work is deployed.

The use cases stack up fast.

**Monitoring long running tasks.** Some Claude Code sessions take 30 to 45 minutes. Content generation pipelines, database migrations, large refactoring jobs. You do not want to sit and watch a terminal for 45 minutes. Start it, walk away, check from your phone.

**Approving actions while mobile.** Claude Code has permission [hooks](https://rsla.io/blog/claude-code-hooks-automation-guide) that require your approval for certain operations. Deploying to production. Deleting files. Running destructive commands. Remote Control means you can approve these from anywhere instead of being chained to your desk.

**Client demonstrations.** This one surprised me. We have started pulling up Remote Control URLs during client calls to show Claude Code working in real time. The client sees the AI agent reading their project files, making changes, running tests. It is a dramatically better demo than screen sharing a terminal. The reaction is always the same: "Wait, it is doing all of that right now?" Yes. Yes it is. And you can see every step.

**Running sessions on a remote server.** If you run Claude Code on a cloud server or a dev machine at your office, Remote Control turns your phone into the interface. You do not need SSH, you do not need a VPN. Just the session URL.

## Security considerations

The URL is unique and ephemeral. Each session generates a new URL. When the session ends, the URL dies. There is no persistent endpoint. No one can bookmark your session and come back later.

Authentication is built in. The session URL contains an authentication token. Only someone with the exact URL can access the session. Treat it like a password.

End to end encryption means messages between your browser and your local Claude Code process are encrypted. Anthropic's bridge relays encrypted payloads.

No file system access through the remote interface. You can only see the Claude Code conversation. You cannot browse your file system, open other applications, or do anything outside the scope of the session. It is not remote desktop. It is remote conversation.

Session ends with your terminal. Close the terminal window and the remote session terminates immediately. There is no lingering access.

The biggest practical security tip: do not share your session URL in public channels. Treat it like a meeting link with admin privileges. Send it directly to specific people if needed. Better yet, keep it to yourself.

## What Remote Control does not do yet

No persistent sessions. If your computer goes to sleep or the terminal crashes, the session is gone. There is no way to resume a disconnected session. You start a new one. This is the biggest limitation in practice.

No multi user collaboration. Right now, Remote Control is one person controlling one session. There is no "share with a teammate so they can also send commands" feature. That could come later.

No native mobile app. It is a web interface in your phone's browser. It works well, but it is not a dedicated app with push notifications or offline queuing. I would love a proper iOS app that pings me when a session needs attention. For now, you have to check manually or set up hook based notifications to a separate channel like Slack.

No file preview in the remote interface. You can see that Claude Code edited a file and you can read the diff in the conversation. But you cannot open the full file in the remote interface. For that, you need to go back to your machine.

## Tips from daily use

Write detailed initial prompts. Since you are going to walk away and check back later, front load your instructions. Instead of iterating in real time, give Claude Code a comprehensive description of what you want before you leave. The better the initial prompt, the less you will need to course correct remotely.

Set up [hooks](https://rsla.io/blog/claude-code-hooks-automation-guide) before starting. If you have hooks configured to auto approve safe operations and require approval for risky ones, Remote Control works seamlessly. You will only get prompted on your phone for the things that actually matter. Without hooks, you get prompted for everything, and your phone keeps buzzing.

Check your machine's sleep settings. If your laptop goes to sleep after 15 minutes of inactivity, your session dies. Adjust your power settings before starting a long task, or use a desktop that stays awake.

Use it for builds, not for exploration. Remote Control is best when Claude Code is executing a known task. Exploratory sessions where you are figuring out the approach need the rapid back and forth that is better done at your desk with a full keyboard. Save Remote Control for the execution phase where Claude Code knows what to build and just needs occasional approval to keep going. The difference is significant. Exploration on a phone is painful. Monitoring on a phone is perfect.

## How Remote Control fits the ecosystem

Remote Control is part of a pattern. Anthropic is building Claude Code into a full workflow tool, not just a terminal app.

You have the [CLAUDE.md file](https://rsla.io/blog/claude-md-file-ai-context-guide) for persistent context. [Hooks](https://rsla.io/blog/claude-code-hooks-automation-guide) for automated guardrails. MCP servers for connecting to external tools. And now Remote Control for untethering from your desk.

Each feature makes Claude Code more useful for professional work. Context means it understands your business. Hooks mean it follows your rules. MCP means it talks to your tools. Remote Control means it fits into your schedule instead of demanding you sit in front of a terminal.

For a small agency, this combination is substantial. I can start a build before a client call, approve actions from my phone during lunch, and review the results from my tablet on the couch. The AI does the work. I steer from wherever I am.

## The bottom line

Remote Control is a simple feature with a big impact. Start a Claude Code session on your computer, control it from your phone. Your code stays local. Only messages travel through the bridge. End to end encrypted.

If you already use Claude Code, try it today. Run `/remote` in your next session and open the URL on your phone. That is literally all it takes. The future of AI assisted work is not sitting in front of a terminal watching an agent type. It is starting the work, walking away, and checking in from wherever life takes you. If you want help setting up Claude Code with Remote Control for your team, [RSL/A builds AI development workflows](https://rsla.io/#contact) that fit how you actually work.
