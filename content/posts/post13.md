# OpenClaw: the open-source AI assistant that went from viral to security nightmare in 3 weeks

In January 2026, a developer named Peter Steinberger built an AI assistant over a weekend. He called it OpenClaw. It could connect to your WhatsApp, Telegram, Slack, email, calendar, files, and even your smart home devices. All in one tool. All self-hosted. All free.

Within three weeks, 180,000 people were running it.

Then the security reports started dropping. A critical remote code execution vulnerability. Over 800 malicious plugins flooding the marketplace. More than 30,000 instances exposed to the open internet with zero authentication. The dream of a free, open-source AI assistant that connects to everything turned into a case study on what happens when adoption outpaces security.

I've been following this story closely because it matters to anyone running a business that touches AI tools. At [RSL/A](https://rsla.io/blog/ai-marketing-stack-what-we-use), we evaluate AI tools constantly. OpenClaw is a perfect example of why "free and popular" doesn't mean "safe to use." Here's the full breakdown.

## What OpenClaw actually is

OpenClaw started as a personal project. Steinberger, who founded PSPDFKit (a well-known document processing company), wanted a single AI assistant that could access all his services. Not just a chatbot. An agent that could take actions across his entire digital life.

The concept was compelling. Install OpenClaw on your own server. Connect it to your messaging apps (WhatsApp, Telegram, Slack, Discord). Give it access to your email, your calendar, your files. Add smart home integration. Then talk to it in natural language, and it would handle tasks across all of those services.

"Send a message to John on WhatsApp about Friday's meeting, block my calendar for 2 PM, and set the office temperature to 72 degrees." One prompt, three actions, three different services.

It was open source, so anyone could inspect the code. It was self-hosted, so your data stayed on your machine. And it was extensible through a plugin marketplace, so the community could add integrations for any service.

On paper, this was everything people wanted. A free alternative to expensive corporate AI assistants with none of the privacy concerns.

## The viral growth

OpenClaw hit GitHub in early January 2026 and immediately took off. The pitch was irresistible: a free, self-hosted AI assistant that talks to everything.

Within the first week, it had 10,000 stars on GitHub. By week two, 50,000. By the end of January, 180,000 users were running OpenClaw instances. Tech publications covered it. YouTube tutorials proliferated. Reddit threads praised it as the best open-source AI project of the year.

The plugin marketplace exploded too. Community developers built integrations for everything from Spotify to Jira to Home Assistant to cryptocurrency exchanges. Within three weeks, there were over 2,000 plugins available.

The growth was organic, enthusiastic, and completely unsurprising. People want this kind of tool. The question nobody asked loudly enough was: is it safe?

## The first crack: CVE-2026-25253

In late January, security researchers from [Palo Alto Networks' Unit 42](https://unit42.paloaltonetworks.com) team disclosed a critical vulnerability. CVE-2026-25253. CVSS score: 8.8 out of 10 (which is very high).

The vulnerability was a remote code execution (RCE) flaw. In plain English: an attacker could run any code on your machine through your OpenClaw instance. Not just read your data. Not just access your messages. Full code execution. They could install malware, steal credentials, encrypt your files, pivot to other machines on your network.

The root cause was how OpenClaw handled plugin execution. Plugins ran with the same permissions as the main OpenClaw process, which typically ran with the user's full system permissions. There was no sandboxing, no isolation, no permission boundary between what a plugin could do and what the host system could do.

This meant a malicious plugin didn't need to exploit a vulnerability. It just needed to be installed. Once running, it had full access to everything the user had access to.

For context, when we talk about tools like [Claude Code](https://rsla.io/blog/what-is-claude-code-guide) being sandboxed, this is exactly the scenario that sandboxing prevents. Claude Code runs operations within a controlled environment with explicit permission hooks. You can define rules about what it can and cannot access. OpenClaw had none of that.

## The supply chain attack: 800+ malicious plugins

If the RCE vulnerability was the crack, the plugin marketplace was the flood.

Within days of the CVE disclosure, researchers discovered that over 800 plugins on the OpenClaw marketplace were malicious. They didn't look malicious. They had legitimate-sounding names, professional descriptions, and functional code. But embedded in the codebase were payloads designed to steal data.

Some plugins exfiltrated environment variables (which often contain API keys, database credentials, and authentication tokens). Others installed cryptocurrency miners. Some established reverse shells, giving attackers persistent remote access to the host machine. A few were designed to spread laterally across local networks.

The marketplace had no vetting process. Anyone could publish a plugin. There was no code review, no signature verification, no security scan. The community was building faster than anyone could audit.

This is the supply chain attack pattern that security professionals have been warning about for years. It's the same pattern that's hit npm, PyPI, and the VS Code extension marketplace. But OpenClaw's case was worse because the plugins had access to messaging apps, email, calendars, and files. The blast radius of a compromised plugin wasn't just your code. It was your entire digital life.

## 30,000 exposed instances

Here's where it gets worse. Researchers found that over 30,000 OpenClaw instances were exposed to the public internet with no authentication. No password, no token, no authentication of any kind.

How did this happen? OpenClaw's default configuration bound to `0.0.0.0` (all network interfaces), and the setup guide didn't emphasize the importance of configuring authentication. Many users followed quick-start tutorials that focused on getting OpenClaw running as fast as possible, not on securing it.

The result: anyone on the internet could send commands to these 30,000+ instances. Read their messages. Access their files. Trigger actions on their connected services. The instances were essentially open doors to people's digital lives.

This is the "lethal trifecta" that [Simon Willison](https://simonwillison.net) (a prominent developer and security researcher) described in his analysis of OpenClaw: maximum access permissions, no authentication boundary, and internet exposure. Any one of these issues is bad. All three together is catastrophic.

## What makes this different from other AI tools

Every software has bugs. Every marketplace has bad actors. What made OpenClaw's situation uniquely dangerous was the combination of three factors:

**Factor 1: The access scope.** OpenClaw wasn't a code editor or a note-taking app. It was connected to messaging apps, email, calendars, files, and smart home devices. A compromise didn't just affect one service. It affected everything.

**Factor 2: The speed of adoption.** 180,000 users in three weeks. The security team (which was essentially one person and a few community contributors) couldn't keep up with the growth. Code reviews fell behind. The plugin marketplace scaled faster than the security processes.

**Factor 3: The trust assumption.** Because OpenClaw was open source and self-hosted, users assumed it was safe. "I can read the code" and "my data stays on my server" became security blankets that masked the real risks. Self-hosting doesn't protect you from malicious plugins. Open source doesn't mean audited.

## The comparison to Claude Code

People ask me this constantly: "Why do you use Claude Code instead of something free like OpenClaw?"

The comparison matters because they're both "agentic" AI tools. Both can take actions on your behalf. Both can access your files. But the approaches to security are fundamentally different.

**Authentication:** Claude Code requires an Anthropic subscription with authenticated access. OpenClaw's default configuration had no authentication.

**Sandboxing:** Claude Code runs in a controlled environment. You define [permission hooks](https://rsla.io/blog/claude-code-hooks-automation-guide) that control what it can and cannot do. You can block specific commands, require approval for destructive operations, and restrict file access to specific directories. OpenClaw plugins ran with full system permissions.

**Plugin vetting:** Claude Code's integrations use the [Model Context Protocol](https://modelcontextprotocol.io) (MCP), an open standard with a defined security model. MCP servers are explicitly configured by the user, not downloaded from an unvetted marketplace. You choose exactly which integrations to connect, and each one runs in its own process with defined capabilities.

**Encryption:** Claude Code uses end-to-end encrypted connections for remote sessions. Your code and data never leave your machine except through encrypted channels you control.

**Maintenance:** Claude Code is maintained by Anthropic, a company with billions in funding, a dedicated security team, and commercial accountability. OpenClaw was a weekend project maintained primarily by one person (who, notably, was hired by OpenAI shortly after the security issues surfaced).

This isn't about open source being inherently insecure. Open-source software powers most of the internet. It's about the difference between a mature, commercially-supported tool with security as a design principle versus a passion project that went viral before its security infrastructure was ready.

## What businesses should learn from OpenClaw

If you're a business owner, agency operator, or anyone who gives AI tools access to business data, here are the takeaways.

### Always ask the five questions

Before installing any AI tool that accesses your data, ask:

1. **Does it require authentication?** If you can access it without a password or token, so can everyone else.
2. **Is execution sandboxed?** Can the tool's actions be contained, or does it have full access to your system?
3. **Can you control what it accesses?** Can you restrict it to specific files, folders, or services?
4. **Are extensions and plugins vetted?** Is there a review process, or can anyone publish anything?
5. **Who maintains it?** Is there a team, a company, a security process? Or is it one person?

### Free doesn't mean safe

Open-source, self-hosted, and free are not security guarantees. They're distribution models. Security comes from architecture, process, and sustained investment. A free tool that connects to your WhatsApp, email, and files without authentication is more dangerous than a paid tool that sandboxes every operation.

### Speed of adoption is a risk factor

When a tool goes from zero to 180,000 users in three weeks, that's a red flag, not a green light. Growth that fast almost always outpaces security processes. Early adopters of viral tools are essentially beta testers for security. That's fine for personal experimentation. It's not fine for business data.

### Agentic AI requires stronger security, not weaker

The more capable an AI tool is, the more damage it can do if compromised. A chatbot that can only generate text has limited blast radius. An agent that can send messages, access files, and control your smart home has enormous blast radius. The security requirements should scale with the capabilities.

This is why tools like Claude Code invest heavily in [permission hooks and guardrails](https://rsla.io/blog/claude-code-hooks-automation-guide). When you give AI the ability to take actions, the safety mechanisms become more important, not less.

## Where OpenClaw is now

As of late February 2026, OpenClaw's story has taken a few interesting turns.

Peter Steinberger, the creator, was hired by OpenAI shortly after the security issues made headlines. The project is now maintained by community contributors, though the pace of security fixes has been uneven.

The critical RCE vulnerability has been patched, but the plugin marketplace remains a concern. The community has implemented basic scanning, but the vetting process is still maturing. Some organizations have forked OpenClaw with hardened security configurations, but these forks are fragmented and not well-publicized.

30,000 exposed instances is a number from early February. It's unclear how many have been secured since then. The broader pattern of users deploying internet-facing services without authentication is not unique to OpenClaw and remains a persistent issue across self-hosted software.

## The bottom line

OpenClaw's story isn't about one bad tool. It's about a pattern that will repeat. As AI agents become more capable and more connected, the gap between "exciting new tool" and "security-reviewed, production-ready tool" will matter more, not less.

When we choose tools at RSL/A, we're not looking for the most features or the lowest price. We're looking for tools that [take security seriously](https://rsla.io/blog/best-ai-tools-service-business-marketing) at the architecture level. That means authentication by default, sandboxed execution, vetted integrations, encrypted communications, and a team that's accountable for maintaining all of it.

OpenClaw showed us what happens when adoption outpaces security. It's a lesson worth remembering every time a new AI tool goes viral.
