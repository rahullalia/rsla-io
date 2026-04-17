/**
 * clusterBlogImages.mjs
 *
 * Generates images for 12 Claude Code cluster blog posts (Posts 11-22)
 * using Gemini API, uploads to Sanity, and patches drafts.
 *
 * Auto-discovers H2 block keys for inline image placement.
 *
 * Usage:
 *   node scripts/clusterBlogImages.mjs              # all posts
 *   node scripts/clusterBlogImages.mjs claude-code   # single post by slug fragment
 *   node scripts/clusterBlogImages.mjs --post 3      # single post by number (1-12)
 */

import { createClient } from '@sanity/client';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..', 'generated-images');

// --- Config ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SANITY_PROJECT_ID = 'yz25oyux';
const SANITY_DATASET = 'production';
const SANITY_TOKEN = readFileSync('/Users/rahullalia/lalia/4-Resources/mcp/sanity.env', 'utf-8')
  .split('\n')
  .find(line => line.startsWith('SANITY_API_TOKEN_V2='))
  ?.split('=')[1]
  ?.trim();

if (!GEMINI_API_KEY) throw new Error('Missing GEMINI_API_KEY in .env');
if (!SANITY_TOKEN) throw new Error('Missing SANITY_API_TOKEN_V2 in sanity.env');

const sanity = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_TOKEN,
  apiVersion: '2025-03-01',
  useCdn: false,
});

// --- Gemini Image Generation ---
async function generateImage(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${err}`);
  }

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find(p => p.inlineData?.mimeType?.startsWith('image/'));

  if (!imagePart) {
    throw new Error('No image returned from Gemini');
  }

  return {
    base64: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType,
  };
}

// --- Sanity Upload ---
async function uploadToSanity(imageBuffer, filename) {
  const asset = await sanity.assets.upload('image', imageBuffer, {
    filename,
    contentType: 'image/png',
  });
  console.log(`    Uploaded: ${asset._id}`);
  return asset;
}

// --- Sanity Mutation Helper ---
async function mutate(mutations) {
  const response = await fetch(
    `https://${SANITY_PROJECT_ID}.api.sanity.io/v2025-03-01/data/mutate/${SANITY_DATASET}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SANITY_TOKEN}`,
      },
      body: JSON.stringify({ mutations }),
    }
  );
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Sanity mutation error: ${err}`);
  }
  return response.json();
}

// --- Set Featured Image ---
async function setFeaturedImage(docId, assetId, altText) {
  await mutate([{
    patch: {
      id: docId,
      set: {
        featuredImage: {
          _type: 'image',
          alt: altText,
          asset: { _type: 'reference', _ref: assetId },
        },
      },
    },
  }]);
  console.log(`    Featured image set on ${docId}`);
}

// --- Find H2 block keys for inline image placement ---
async function findInsertionPoints(docId) {
  const doc = await sanity.fetch(
    `*[_id == $id][0]{body}`,
    { id: docId },
    { perspective: 'raw' }
  );
  if (!doc?.body) throw new Error(`No body found for ${docId}`);

  // Find all H2 blocks
  const h2Blocks = doc.body
    .map((block, index) => ({ ...block, _index: index }))
    .filter(b => b._type === 'block' && b.style === 'h2');

  if (h2Blocks.length < 3) {
    // Fallback: distribute evenly across body
    const totalBlocks = doc.body.length;
    const positions = [
      Math.floor(totalBlocks * 0.25),
      Math.floor(totalBlocks * 0.50),
      Math.floor(totalBlocks * 0.75),
    ];
    return {
      body: doc.body,
      afterKeys: positions.map(i => doc.body[i]._key),
    };
  }

  // Pick H2s at roughly 25%, 50%, 75% positions
  const step = Math.floor(h2Blocks.length / 4);
  const picks = [
    h2Blocks[Math.max(0, step - 1)],
    h2Blocks[Math.max(0, step * 2 - 1)],
    h2Blocks[Math.max(0, step * 3 - 1)],
  ];

  return {
    body: doc.body,
    afterKeys: picks.map(b => b._key),
  };
}

// --- Insert Inline Image ---
async function insertBodyImage(docId, assetId, altText, caption, afterKey, size = 'full', aspectRatio = '1:1') {
  const doc = await sanity.fetch(`*[_id == $id][0]{body}`, { id: docId }, { perspective: 'raw' });
  if (!doc?.body) throw new Error(`No body found for ${docId}`);

  const insertIndex = doc.body.findIndex(b => b._key === afterKey);
  if (insertIndex === -1) throw new Error(`Block key ${afterKey} not found in body of ${docId}`);

  const imageBlock = {
    _type: 'image',
    _key: `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    alt: altText,
    caption,
    size,
    aspectRatio,
    asset: { _type: 'reference', _ref: assetId },
  };

  const newBody = [...doc.body];
  newBody.splice(insertIndex + 1, 0, imageBlock);

  await mutate([{ patch: { id: docId, set: { body: newBody } } }]);
  console.log(`    Inline image inserted after block ${afterKey}`);
}

// --- Save locally ---
function saveLocally(base64, filename) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const filepath = join(OUTPUT_DIR, filename);
  writeFileSync(filepath, Buffer.from(base64, 'base64'));
  console.log(`    Saved: ${filepath}`);
  return filepath;
}

// --- Process a single blog ---
async function processBlog(config) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`[${config.postNum}] ${config.title}`);
  console.log(`${'='.repeat(60)}`);

  // Auto-discover insertion points for inline images
  let afterKeys = [];
  if (config.images.some(img => img.type === 'inline' && !img.afterKey)) {
    console.log('  Discovering inline image insertion points...');
    const { afterKeys: keys } = await findInsertionPoints(config.docId);
    afterKeys = keys;
    console.log(`  Found ${afterKeys.length} insertion points`);
  }

  let inlineIndex = 0;
  for (let i = 0; i < config.images.length; i++) {
    const image = config.images[i];
    console.log(`\n  [${i + 1}/${config.images.length}] ${image.name}...`);

    try {
      const { base64, mimeType } = await generateImage(image.prompt);
      const ext = mimeType.includes('png') ? 'png' : 'jpg';
      const filename = `${config.slug}-${image.name}.${ext}`;

      saveLocally(base64, filename);

      const buffer = Buffer.from(base64, 'base64');
      const asset = await uploadToSanity(buffer, filename);

      if (image.type === 'featured') {
        await setFeaturedImage(config.docId, asset._id, image.alt);
      } else if (image.type === 'inline') {
        const key = image.afterKey || afterKeys[inlineIndex];
        if (!key) throw new Error(`No afterKey for inline image ${inlineIndex}`);
        await insertBodyImage(
          config.docId, asset._id, image.alt, image.caption,
          key, image.size || 'full', image.displayAspectRatio || '1:1'
        );
        inlineIndex++;
      }

      console.log(`  Done: ${image.name}`);
    } catch (err) {
      console.error(`  ERROR on ${image.name}:`, err.message);
    }

    // Rate limit between generations
    await new Promise(r => setTimeout(r, 3000));
  }
}

// ============================================================
// BLOG CONFIGS — 12 posts (Posts 11-22)
// ============================================================

const BLOGS = [
  // ── Post 11: Claude Code vs Cowork vs Claude App ──
  {
    postNum: 1,
    title: 'Claude Code, Claude Cowork, or Just Claude? Here\'s Which One You Actually Need',
    slug: 'claude-code-vs-cowork-vs-claude-app',
    docId: 'drafts.488617b8-9bbf-4ac1-afb5-123fc12ad76e',
    images: [
      {
        name: 'featured',
        type: 'featured',
        alt: 'Hand drawn three column comparison of Claude chat, Claude Code terminal, and Claude Cowork desktop showing key differences',
        prompt: 'Simple three-way comparison of Claude products, hand-drawn split comparison, divided by two thick hand-drawn vertical lines creating three columns, blue ballpoint pen on white paper, imperfect wobbly lines, left column labeled "Claude" with a chat bubble icon, middle column labeled "Code" with a terminal prompt icon, right column labeled "Cowork" with a desktop window icon, each with 3 to 4 bullet points below showing key traits. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-1-pricing',
        type: 'inline',
        alt: 'Hand drawn pricing chart showing Claude Pro at 20 dollars, Max at 100 dollars, and Max at 200 dollars with usage multipliers',
        caption: 'The pricing breakdown. Pro covers most people. Max is for teams that live in Claude all day.',
        prompt: 'Simple pricing tier breakdown, hand-drawn data visualization, minimalist chart, blue and black ink on graph paper, numbers written by hand, axis labels hand-written, imperfect grid lines, authentic data napkin math feel, featuring three rows: "Pro $20/mo" with a bar showing 1x usage, "Max $100/mo" with 5x bar, "Max $200/mo" with 20x bar, each row listing which products are included. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-2-decision',
        type: 'inline',
        alt: 'Whiteboard sketch showing a decision tree routing tasks to Claude chat, Claude Code, or Cowork based on the type of work',
        caption: 'The decision tree we actually use. Takes 3 seconds.',
        prompt: 'Simple scenario routing diagram, quick whiteboard sketch, dry erase markers in blue and red on a slightly smudged white whiteboard, marker streaks visible, imperfect hand-drawn, looks like a team brainstorm session, featuring a central question "What are you doing?" with blue arrows pointing to three scenarios: "Quick question → Claude", "Building something → Code", "Docs and research → Cowork". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-3-roles',
        type: 'inline',
        alt: 'Yellow sticky note with hand written recommendations for which Claude product different roles should use',
        caption: 'Match the tool to the role. Don\'t overthink it.',
        prompt: 'Simple recommendation by role, hand-drawn on a yellow sticky note, black felt tip marker, adhesive strip visible at top, slightly tilted on white desk, imperfect hand-written text, authentic raw feel, featuring "Who needs what:" then "Founder → Claude + Cowork", "Developer → Claude Code", "Marketer → Claude + Cowork", "Agency → All three" with small arrows. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
    ],
  },

  // ── Post 12: What Is Claude Code ──
  {
    postNum: 2,
    title: 'What Is Claude Code? The Non-Developer\'s Guide',
    slug: 'what-is-claude-code-guide',
    docId: 'drafts.45cf75ee-807f-4b11-8bb5-8df18d301347',
    images: [
      {
        name: 'featured',
        type: 'featured',
        alt: 'Napkin sketch showing Claude Code as an AI brain inside a terminal with arrows looping through reading files, writing code, running tests, and fixing errors',
        prompt: 'Simple concept of an AI agent working on a computer, napkin sketch style, blue ballpoint pen on a crumpled white paper napkin, spontaneous, authentic, raw texture, visible ink pressure, imperfect wobbly lines, featuring a terminal window icon with an AI brain inside it, arrows pointing outward to icons representing "Read Files", "Write Code", "Run Tests", "Fix Errors" in a circular loop. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-1-workflow',
        type: 'inline',
        alt: 'Hand drawn process flow showing five steps of how Claude Code works from describing the task to autonomous building and testing',
        caption: 'The workflow in five steps. You describe. Claude does.',
        prompt: 'Simple step-by-step of how Claude Code works, hand-drawn horizontal process flow, thick arrows connecting simple labeled boxes from left to right, numbered steps, black marker on white paper, bold and simple, imperfect hand-drawn, looks like a quick planning sketch, featuring five boxes: "1. You Describe" arrow to "2. Claude Reads Codebase" arrow to "3. Claude Plans" arrow to "4. Claude Builds" arrow to "5. Claude Tests and Fixes". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-2-claudemd',
        type: 'inline',
        alt: 'Clean hand drawn diagram showing a CLAUDE.md file feeding business context like voice, structure, and rules into Claude\'s brain',
        caption: 'This is the secret. One markdown file that tells Claude how your business works. Every session starts with context.',
        prompt: 'Simple diagram of CLAUDE.md concept, hand-drawn sketch, black felt tip pen on plain white paper, clean but imperfect lines, minimal style, no background texture, authentic hand-drawn feel, featuring a document icon labeled "CLAUDE.md" with arrows pointing to different labels: "Voice/Tone", "Project Structure", "Naming Rules", "Tool Preferences", "Permissions", all feeding into a brain icon labeled "Claude". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-3-capabilities',
        type: 'inline',
        alt: 'Yellow sticky note with two columns listing what Claude Code can and cannot do',
        caption: 'Setting expectations. Powerful, not magic.',
        prompt: 'Simple what Claude Code can and cannot do, hand-drawn on a yellow sticky note, black felt tip marker, adhesive strip visible at top, slightly tilted on white desk, imperfect hand-written text, authentic raw feel, featuring two columns: left side "CAN DO:" with checkmarks next to "Read files", "Write code", "Run commands", "Fix errors", "Deploy sites" and right side "CAN\'T DO:" with X marks next to "Think for itself", "Access the internet*", "Replace strategy", "Read your mind". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
    ],
  },

  // ── Post 13: OpenClaw Security ──
  {
    postNum: 3,
    title: 'OpenClaw: From Viral AI Assistant to Security Nightmare',
    slug: 'openclaw-ai-assistant-security-lessons',
    docId: 'drafts.c84eb254-cc23-4121-ac4b-74c397e5b329',
    images: [
      {
        name: 'featured',
        type: 'featured',
        alt: 'Whiteboard sketch showing OpenClaw\'s timeline from weekend project to viral adoption to security nightmare to creator joining OpenAI',
        prompt: 'Simple dramatic timeline of OpenClaw\'s rise and fall, quick whiteboard sketch, dry erase markers in blue and red on a slightly smudged white whiteboard, marker streaks visible, imperfect hand-drawn, looks like a team brainstorm session, featuring a timeline from left to right: "Weekend Project" arrow to "Viral 180K users" arrow to "RCE Vulnerability" (circled in red) arrow to "800 Bad Plugins" (red X) arrow to "Creator joins OpenAI" with a big question mark. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-1-dashboard',
        type: 'inline',
        alt: 'Hand drawn security dashboard showing OpenClaw vulnerability stats including CVSS 8.8 score, 800 malicious plugins, and 30,000 exposed instances',
        caption: 'The numbers. One CVE, 800 malicious plugins, 30,000 unprotected instances.',
        prompt: 'Simple security vulnerability dashboard, hand-drawn dashboard mockup, pencil on white paper, showing rough boxes with numbers inside, sparkline sketches, percentage indicators, minimal wireframe feel, imperfect hand-drawn UI elements, featuring boxes showing "CVE-2026-25253 CVSS: 8.8", "Malicious Plugins: 800+", "Exposed Instances: 30,000+", "Users Affected: 180K", with red warning triangles. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-2-comparison',
        type: 'inline',
        alt: 'Hand drawn split screen comparing OpenClaw\'s open access approach with red X marks versus Claude Code\'s sandboxed approach with green checkmarks',
        caption: 'Two approaches to agentic AI. One prioritized speed. The other prioritized safety.',
        prompt: 'Simple comparison of OpenClaw vs Claude Code security approach, hand-drawn split comparison, divided by a thick hand-drawn vertical line down the center, left side labeled "OpenClaw" right side labeled "Claude Code", contrasting sketches on each side, blue ballpoint pen on white paper, imperfect wobbly lines, featuring left side: "Open access, No auth, Unvetted plugins, Full system access" with red X marks, right side: "Sandboxed, Permission hooks, Vetted MCP, E2E encrypted" with green checkmarks. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-3-checklist',
        type: 'inline',
        alt: 'Yellow sticky note with a five question security checklist to ask before giving any AI tool access to business data',
        caption: 'Five questions. Ask them before you install anything that touches your business data.',
        prompt: 'Simple 5-question security checklist for AI tools, hand-drawn on a yellow sticky note, black felt tip marker, adhesive strip visible at top, slightly tilted on white desk, imperfect hand-written text, authentic raw feel, featuring "Before giving AI access to your data:" then numbered list: "1. Does it require auth?", "2. Is execution sandboxed?", "3. Can you control access?", "4. Are plugins vetted?", "5. Who maintains it?". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
    ],
  },

  // ── Post 14: Remote Control ──
  {
    postNum: 4,
    title: 'Claude Code Remote Control: Manage AI from Your Phone',
    slug: 'claude-code-remote-control-guide',
    docId: 'drafts.e9b59b1a-4b6b-4be7-8d25-e50326d52769',
    images: [
      {
        name: 'featured',
        type: 'featured',
        alt: 'Yellow sticky note showing a laptop running Claude Code connected to a phone via an encrypted arrow',
        prompt: 'Simple concept of remote phone control, hand-drawn on a yellow sticky note, black felt tip marker, adhesive strip visible at top, slightly tilted on white desk, imperfect hand-written text, authentic raw feel, featuring a laptop icon on the left with a terminal window, a dotted arrow across to a phone icon on the right showing a chat interface, with "E2E Encrypted" written along the arrow and a small lock icon. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-1-architecture',
        type: 'inline',
        alt: 'Napkin sketch showing the Remote Control architecture with local machine connecting through Anthropic\'s encrypted bridge to a phone browser',
        caption: 'The architecture in 30 seconds. Everything runs locally. Only messages travel through the bridge.',
        prompt: 'Simple architectural diagram of how Remote Control works, napkin sketch style, blue ballpoint pen on a crumpled white paper napkin, spontaneous, authentic, raw texture, visible ink pressure, imperfect wobbly lines, featuring a flow: "Your Machine" box with "Claude Code + Files + MCP" inside, arrow labeled "HTTPS outbound" to "Anthropic Bridge" cloud shape, arrow labeled "E2E encrypted" to "Phone/Browser" with an eye icon labeled "View + Control". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-2-setup',
        type: 'inline',
        alt: 'Hand drawn process flow showing four steps to set up Claude Code Remote Control',
        caption: 'Setup takes 30 seconds. One command, one URL, done.',
        prompt: 'Simple step-by-step setup flow, hand-drawn horizontal process flow, thick arrows connecting simple labeled boxes from left to right, numbered steps, black marker on white paper, bold and simple, imperfect hand-drawn, looks like a quick planning sketch, featuring four boxes: "1. Start Claude Code" arrow to "2. Run /remote" arrow to "3. Get Session URL" arrow to "4. Open on Phone". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-3-timeline',
        type: 'inline',
        alt: 'Hand drawn timeline showing an agency owner starting a build at 9 AM, attending a meeting, then approving the deploy from their phone at 10:30 AM',
        caption: 'A real morning. Build started before a call, approved from my phone during coffee.',
        prompt: 'Simple use case timeline showing agency workflow with Remote Control, hand-drawn data visualization, blue and black ink on graph paper, numbers written by hand, imperfect grid lines, authentic data napkin math feel, featuring a horizontal timeline: "9:00 AM Start build" then "9:30 AM Client meeting" then "10:15 AM Check from phone: 90% done" then "10:30 AM Approve deploy from phone" with time blocks colored in. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
    ],
  },

  // ── Post 15: MCP Servers ──
  {
    postNum: 5,
    title: 'MCP Servers Explained: The Universal Plug That Connects AI to Everything',
    slug: 'mcp-servers-explained-ai-integrations',
    docId: 'drafts.fe98fe17-883d-4639-8399-12fdf4bf7260',
    images: [
      {
        name: 'featured',
        type: 'featured',
        alt: 'Napkin sketch showing MCP as a central hub connecting Claude Code to Notion, GitHub, Stripe, Google, Slack, and other tools',
        prompt: 'Simple concept of MCP as a universal connector, napkin sketch style, blue ballpoint pen on a crumpled white paper napkin, spontaneous, authentic, raw texture, visible ink pressure, imperfect wobbly lines, featuring a central "MCP" hub circle with lines radiating out to simple icons representing Notion, GitHub, Stripe, Google, Slack, and a "..." for more, with Claude Code on one side connecting through the hub. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-1-before-after',
        type: 'inline',
        alt: 'Hand drawn comparison showing five custom integrations before MCP versus one standardized connection through MCP after',
        caption: 'Before MCP: custom code for every tool. After MCP: one standard, every tool.',
        prompt: 'Simple before and after of how AI connects to tools, hand-drawn horizontal comparison, thick arrows, black marker on white paper, bold and simple, imperfect hand-drawn, featuring top row "Before MCP": 5 separate arrows from "AI" to 5 tools each with "Custom code" labels, bottom row "After MCP": single arrow from "AI" through "MCP" hub to 5 tools. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-2-stack',
        type: 'inline',
        alt: 'Pencil sketch on notebook paper showing eight MCP servers RSLA uses including Notion, Google Workspace, Sanity, GitHub, Vercel, GHL, Stripe, and Chrome DevTools',
        caption: 'Our actual MCP stack. 20 servers, but these 8 do 90% of the daily work.',
        prompt: 'Simple RSLA MCP stack diagram, hand-drawn sketch, graphite pencil on lined notebook paper, visible pencil pressure, light eraser smudges, imperfect wobbly lines, authentic student notebook feel, featuring a vertical list of 8 MCP server names with icons: "Notion (tasks)", "Google Workspace (calendar, drive)", "Sanity (blog content)", "GitHub (code)", "Vercel (deploys)", "GHL (CRM)", "Stripe (billing)", "Chrome DevTools (testing)" all connected to a "Claude Code" box at the top. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-3-growth',
        type: 'inline',
        alt: 'Hand drawn line chart showing MCP downloads growing from 100,000 in November 2024 to 8 million by April 2025',
        caption: 'From 100K to 8M downloads in 5 months. Then the Linux Foundation adopted it. This is a standards moment.',
        prompt: 'Simple MCP ecosystem growth chart, hand-drawn data visualization, minimalist chart, blue and black ink on graph paper, numbers written by hand, imperfect grid lines, authentic data napkin math feel, featuring a line graph showing "MCP Downloads" from "Nov 2024: 100K" rising sharply to "Apr 2025: 8M" with "Adopted by: Anthropic, OpenAI, Google" noted below, and "Linux Foundation" with a star. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
    ],
  },

  // ── Post 16: Claude Code vs Cursor vs Copilot ──
  {
    postNum: 6,
    title: 'Claude Code vs Cursor vs GitHub Copilot: The Honest Take',
    slug: 'claude-code-vs-cursor-vs-github-copilot',
    docId: 'drafts.a11d17d1-0172-4ebb-afd9-b37d26c5cc94',
    images: [
      {
        name: 'featured',
        type: 'featured',
        alt: 'Hand drawn three column comparison of Claude Code as autonomous, Cursor as co-pilot, and GitHub Copilot as autocomplete',
        prompt: 'Simple three-way tool comparison, hand-drawn split comparison with two thick hand-drawn vertical lines creating three columns, blue ballpoint pen on white paper, imperfect wobbly lines, left column labeled "Claude Code" with a terminal icon and "Autonomous", middle column "Cursor" with an editor icon and "Co-pilot", right column "Copilot" with a code icon and "Autocomplete", each with 2 to 3 traits listed below. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-1-revenue',
        type: 'inline',
        alt: 'Hand drawn bar chart comparing annual recurring revenue for GitHub Copilot at 800 million, Claude Code at 1 billion milestone, and Cursor at 100 million',
        caption: 'The revenue numbers tell the story. This isn\'t a niche anymore. It\'s the default.',
        prompt: 'Simple market data comparison, hand-drawn data visualization, minimalist chart, blue and black ink on graph paper, numbers written by hand, imperfect grid lines, authentic data napkin math feel, featuring three horizontal bars: "Copilot: ~$800M ARR" (longest), "Claude Code: $1B+ milestone" (nearly as long), "Cursor: $100M+ ARR" (shorter), with "78% of dev teams use AI" noted at the bottom. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-2-tasks',
        type: 'inline',
        alt: 'Whiteboard grid matching development tasks to the best AI coding tool for each scenario',
        caption: 'The cheat sheet. Match the task to the tool.',
        prompt: 'Simple scenario-based tool selection guide, quick whiteboard sketch, dry erase markers in blue and red on a slightly smudged white whiteboard, marker streaks visible, imperfect hand-drawn, looks like a team brainstorm session, featuring a grid with tasks on the left and tool names across the top, checkmarks showing: "New feature from scratch → Claude Code", "Refactor existing code → Cursor", "Boilerplate/repetitive → Copilot", "Debug complex bug → Claude Code", "Explore new codebase → Cursor". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-3-pricing',
        type: 'inline',
        alt: 'Yellow sticky note showing monthly pricing for Copilot, Cursor, and Claude with a recommended combo at 40 dollars per month',
        caption: 'The pricing cheat sheet. The best value combo is $40/month.',
        prompt: 'Simple pricing cheat sheet, hand-drawn on a yellow sticky note, black felt tip marker, adhesive strip visible at top, slightly tilted on white desk, imperfect hand-written text, authentic raw feel, featuring "Monthly cost:" then "Copilot: $10-19", "Cursor: ~$20", "Claude Pro: $20", "Claude Max: $100-200", then "Best combo: Claude Pro + Cursor = $40/mo". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
    ],
  },

  // ── Post 17: CLAUDE.md Guide ──
  {
    postNum: 7,
    title: 'The CLAUDE.md Trick That Serious Teams Are Using',
    slug: 'claude-md-file-ai-context-guide',
    docId: 'drafts.b23d8fed-dc0d-4cd9-8d04-558868b02d04',
    images: [
      {
        name: 'featured',
        type: 'featured',
        alt: 'Pencil sketch on notebook paper showing a CLAUDE.md file with sections for voice, structure, tools, permissions, and commands',
        prompt: 'Simple representation of a CLAUDE.md file with business rules, hand-drawn sketch, graphite pencil on lined notebook paper, visible pencil pressure, light eraser smudges, imperfect wobbly lines, authentic student notebook feel, featuring a page with "CLAUDE.md" as a title, then indented sections: "## Voice:", "## Structure:", "## Tools:", "## Permissions:", "## Commands:" with scribbled content lines under each. A brain icon in the margin with an arrow pointing to the page. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-1-before-after',
        type: 'inline',
        alt: 'Clean hand drawn comparison showing generic AI output without CLAUDE.md versus structured consistent output with CLAUDE.md',
        caption: 'Same prompt. Different context. The output quality gap is massive.',
        prompt: 'Simple before and after of AI output quality, hand-drawn sketch, black felt tip pen on plain white paper, clean but imperfect lines, minimal style, no background texture, authentic hand-drawn feel, featuring two code block outlines side by side: left labeled "Without CLAUDE.md" showing generic, messy output with question marks, right labeled "With CLAUDE.md" showing clean, structured output with checkmarks. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-2-funnel',
        type: 'inline',
        alt: 'Napkin sketch showing SOPs, brand voice, tool preferences, and rules flowing through a CLAUDE.md funnel into consistent AI output',
        caption: 'Your competitive advantage isn\'t the AI model. It\'s the context you feed it.',
        prompt: 'Simple concept of CLAUDE.md as institutional knowledge, napkin sketch style, blue ballpoint pen on a crumpled white paper napkin, spontaneous, authentic, raw texture, visible ink pressure, imperfect wobbly lines, featuring a funnel diagram: top has "SOPs", "Brand Voice", "Tool Preferences", "Client Rules", "Folder Structure" all flowing down through a funnel labeled "CLAUDE.md" into a single output: "Consistent AI Output Every Time". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-3-steps',
        type: 'inline',
        alt: 'Hand drawn process flow showing five steps to build a CLAUDE.md file from initialization to weekly iteration',
        caption: 'Start with /init. Refine over time. The file gets smarter as you do.',
        prompt: 'Simple step-by-step guide to building a CLAUDE.md, hand-drawn horizontal process flow, thick arrows connecting simple labeled boxes from left to right, numbered steps, black marker on white paper, bold and simple, imperfect hand-drawn, looks like a quick planning sketch, featuring five boxes: "1. Run /init" arrow to "2. Add Voice Rules" arrow to "3. Add Permissions" arrow to "4. Add Integrations" arrow to "5. Iterate Weekly". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
    ],
  },

  // ── Post 18: AI Coding Productivity Panic ──
  {
    postNum: 8,
    title: 'AI Coding Agents Are Fueling a Productivity Panic',
    slug: 'ai-coding-agents-productivity-panic',
    docId: 'drafts.3c0e40ee-fc59-4920-bb2e-bd7a14846d69',
    images: [
      {
        name: 'featured',
        type: 'featured',
        alt: 'Hand drawn productivity dashboard showing output up 5x and shipping speed up 10x alongside growing tech debt and declining review time',
        prompt: 'Simple productivity dashboard showing conflicting signals, hand-drawn dashboard mockup, pencil on white paper, showing rough boxes with numbers inside, sparkline sketches, percentage indicators, minimal wireframe feel, imperfect hand-drawn UI elements, featuring boxes: "Output: 5x" (green arrow up), "Quality: ???" (yellow question mark), "Tech Debt: 3x" (red arrow up), "Shipping Speed: 10x" (green), "Review Time: 0.5x" (red arrow down), showing tension between speed and quality. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-1-split',
        type: 'inline',
        alt: 'Hand drawn split screen comparing shipping fast with 10x output but 3x bugs versus shipping smart with 5x output and fewer bugs',
        caption: 'The real choice isn\'t fast vs slow. It\'s fast and broken vs fast and reliable.',
        prompt: 'Simple comparison of shipping fast vs shipping smart, hand-drawn split comparison, divided by a thick hand-drawn vertical line down the center, left side labeled "Ship Fast" right side labeled "Ship Smart", contrasting sketches on each side, blue ballpoint pen on white paper, imperfect wobbly lines, left side: "No review, No tests, No context, 10x output, 3x bugs" right side: "CLAUDE.md, Hooks, Tests, 5x output, 0.5x bugs" with the right side circled. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-2-market',
        type: 'inline',
        alt: 'Hand drawn chart showing AI coding assistant market growing from 8.5 billion in 2026 to 47.3 billion by 2034',
        caption: 'The market isn\'t slowing down. $8.5B now, $47B by 2034. The question is who builds the guardrails.',
        prompt: 'Simple market size visualization, hand-drawn data visualization, minimalist chart, blue and black ink on graph paper, numbers written by hand, imperfect grid lines, authentic data napkin math feel, featuring two data points connected by a rising arrow: "2026: $8.5B" and "2034: $47.3B" with "AI Coding Market" as the title and "78% dev team adoption" noted below. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-3-guardrails',
        type: 'inline',
        alt: 'Yellow sticky note with a checklist of five guardrails for shipping fast and safely with AI coding agents',
        caption: 'The guardrails we run. Speed without these is just generating future problems.',
        prompt: 'Simple guardrails checklist, hand-drawn on a yellow sticky note, black felt tip marker, adhesive strip visible at top, slightly tilted on white desk, imperfect hand-written text, authentic raw feel, featuring "Ship fast AND safe:" then checklist: "CLAUDE.md context file", "PreToolUse hooks", "Auto-run tests", "Human review at deploy", "Weekly tech debt audit". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
    ],
  },

  // ── Post 19: Agency Workflow ──
  {
    postNum: 9,
    title: 'How We Use Claude Code to Run a Marketing Agency',
    slug: 'claude-code-marketing-agency-workflow',
    docId: 'drafts.69a47da3-e316-4d1b-94bf-4273d7ac8814',
    images: [
      {
        name: 'featured',
        type: 'featured',
        alt: 'Hand drawn process flow showing an agency blog workflow from brief to Claude writing, image generation, CMS publishing, deployment, and task updates',
        prompt: 'Simple day-in-the-life workflow of an agency using Claude Code, hand-drawn horizontal process flow, thick arrows connecting simple labeled boxes from left to right, numbered steps, black marker on white paper, bold and simple, imperfect hand-drawn, looks like a quick planning sketch, featuring a flow: "Blog Brief" arrow to "Claude Writes Draft" arrow to "Generate Images" arrow to "Push to CMS" arrow to "Deploy to Vercel" arrow to "Update Notion Tasks". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-1-comparison',
        type: 'inline',
        alt: 'Hand drawn dashboard comparing time to complete marketing tasks manually versus with Claude Code showing 3 to 60x improvement',
        caption: 'Real numbers from our workflow. Not theoretical. Not cherry-picked.',
        prompt: 'Simple productivity comparison dashboard, hand-drawn dashboard mockup, pencil on white paper, showing rough boxes with numbers inside, sparkline sketches, percentage indicators, minimal wireframe feel, imperfect hand-drawn UI elements, featuring comparison boxes: "Blog Post: 1 day → 2-3 hrs", "Ad Variations: 30 min → 30 sec", "Email Sequence: 4 hrs → 45 min", "Website Feature: 1 week → 1 day" with percentage improvement arrows. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-2-ecosystem',
        type: 'inline',
        alt: 'Napkin sketch showing Claude Code at the center connected to Sanity, Vercel, GHL, Notion, Google, Gemini, and GitHub',
        caption: 'The hub. Claude Code talks to everything through MCP servers. No custom code for each tool.',
        prompt: 'Simple diagram of the RSLA Claude Code ecosystem, napkin sketch style, blue ballpoint pen on a crumpled white paper napkin, spontaneous, authentic, raw texture, visible ink pressure, imperfect wobbly lines, featuring "Claude Code" in the center with spokes going to "Sanity (blogs)", "Vercel (deploy)", "GHL (clients)", "Notion (tasks)", "Google (calendar)", "Gemini (images)", "GitHub (code)" showing the integrated workflow. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-3-output',
        type: 'inline',
        alt: 'Hand drawn bar chart comparing 2025 monthly output of 4 blogs and 10 automations versus 2026 output of 12 blogs and 30 automations with the same two person team',
        caption: 'Same two people. 3x the output. That\'s what Claude Code actually changed.',
        prompt: 'Simple output volume comparison, hand-drawn data visualization, minimalist chart, blue and black ink on graph paper, numbers written by hand, imperfect grid lines, authentic data napkin math feel, featuring two bars: "2025 Monthly Output: 4 blogs, 2 client sites, 10 automations" and "2026 Monthly Output: 12 blogs, 5 client sites, 30 automations" with "Same team size: 2 people" noted below. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
    ],
  },

  // ── Post 20: Hooks Guide ──
  {
    postNum: 10,
    title: 'Claude Code Hooks: How to Give AI a Leash Without Slowing It Down',
    slug: 'claude-code-hooks-automation-guide',
    docId: 'drafts.54a71f58-9f9f-410e-9e65-07dd06883274',
    images: [
      {
        name: 'featured',
        type: 'featured',
        alt: 'Clean hand drawn diagram showing PreToolUse and PostToolUse hooks as gates around Claude Code\'s tool execution',
        prompt: 'Simple diagram of hooks as guardrails around AI execution, hand-drawn sketch, black felt tip pen on plain white paper, clean but imperfect lines, minimal style, no background texture, authentic hand-drawn feel, featuring a flow: "Claude Code" box with two gate icons on either side labeled "PreToolUse" (left gate) and "PostToolUse" (right gate), arrows flowing through the gates to "Tool Execution" in the middle, with "BLOCK" and "ALLOW" labels on the gates. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-1-lifecycle',
        type: 'inline',
        alt: 'Hand drawn flow diagram showing how a PreToolUse hook evaluates a command and either allows execution or blocks it',
        caption: 'The lifecycle. Every command hits the hook first. Exit code 2 means denied.',
        prompt: 'Simple hook lifecycle flow, hand-drawn horizontal process flow, thick arrows connecting simple labeled boxes from left to right, numbered steps, black marker on white paper, bold and simple, imperfect hand-drawn, featuring: "Claude wants to run command" arrow to "PreToolUse Hook" with a decision diamond "Allow?" with "Yes" going to "Execute" then to "PostToolUse Hook" then "Result", and "No" going down to "Blocked (exit 2)". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-2-essentials',
        type: 'inline',
        alt: 'Yellow sticky note listing five essential Claude Code hooks including blocking dangerous commands, auto-linting, running tests, Slack notifications, and git backups',
        caption: 'The starter kit. Five hooks that cover 90% of what a small team needs.',
        prompt: 'Simple list of essential hooks to set up, hand-drawn on a yellow sticky note, black felt tip marker, adhesive strip visible at top, slightly tilted on white desk, imperfect hand-written text, authentic raw feel, featuring "Must-have hooks:" then "1. Block rm -rf and force push", "2. Auto-lint after edits", "3. Run tests after changes", "4. Slack notify on complete", "5. Git backup before risky ops". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-3-with-without',
        type: 'inline',
        alt: 'Whiteboard sketch comparing AI without hooks causing force pushes and deleted files versus AI with hooks that blocks and catches errors',
        caption: 'Real scenarios from our first month. The left column is why the right column exists.',
        prompt: 'Simple comparison of AI with and without hooks, quick whiteboard sketch, dry erase markers in blue and red on a slightly smudged white whiteboard, marker streaks visible, imperfect hand-drawn, looks like a team brainstorm session, featuring two columns: red column "No Hooks" with "Force pushed at 2 AM", "Deleted wrong file", "Deployed broken code", "No notification" and blue column "With Hooks" with "Push blocked", "Deletion denied", "Tests caught it", "Slack pinged". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
    ],
  },

  // ── Post 21: Computer Use ──
  {
    postNum: 11,
    title: 'Anthropic Computer Use: The AI That Can Actually Use Your Computer',
    slug: 'anthropic-computer-use-guide',
    docId: 'drafts.635d80f4-a02a-4d6a-b1de-faaa11ab1e8a',
    images: [
      {
        name: 'featured',
        type: 'featured',
        alt: 'Whiteboard sketch showing an AI brain controlling a computer screen by seeing, clicking, typing, and navigating',
        prompt: 'Simple concept of AI controlling a desktop, quick whiteboard sketch, dry erase markers in blue and red on a slightly smudged white whiteboard, marker streaks visible, imperfect hand-drawn, looks like a team brainstorm session, featuring a computer screen outline with an AI brain icon at the top, arrows pointing to different screen elements: a browser tab, a form field, a button, a menu, with labels "See", "Click", "Type", "Navigate". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-1-rpa',
        type: 'inline',
        alt: 'Hand drawn split screen comparing traditional RPA with brittle selectors versus Computer Use with visual understanding and adaptability',
        caption: 'RPA breaks when a button moves. Computer Use adapts because it sees the screen like a human.',
        prompt: 'Simple comparison of Computer Use vs traditional RPA, hand-drawn split comparison, divided by a thick hand-drawn vertical line down the center, left side labeled "Traditional RPA" right side labeled "Computer Use", contrasting sketches on each side, blue ballpoint pen on white paper, imperfect wobbly lines, left: "CSS selectors, Brittle scripts, Expensive licenses, Breaks on updates" right: "Visual understanding, Adaptive, Pay per use, Handles changes". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-2-loop',
        type: 'inline',
        alt: 'Hand drawn process flow showing Computer Use taking a screenshot, understanding the UI, planning an action, executing it, and verifying the result in a loop',
        caption: 'The loop. Screenshot, understand, act, verify, repeat. Same pattern a human uses.',
        prompt: 'Simple Computer Use workflow diagram, hand-drawn horizontal process flow, thick arrows connecting simple labeled boxes from left to right, numbered steps, black marker on white paper, bold and simple, imperfect hand-drawn, looks like a quick planning sketch, featuring: "1. Screenshot" arrow to "2. Understand UI" arrow to "3. Plan Action" arrow to "4. Move/Click/Type" arrow to "5. Verify Result" with a loop arrow from 5 back to 1. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-3-usecases',
        type: 'inline',
        alt: 'Napkin sketch showing four primary use cases for Computer Use: QA testing, data entry, legacy tool automation, and cross-platform workflows',
        caption: 'Where Computer Use shines. Legacy tools without APIs. QA that doesn\'t need custom scripts.',
        prompt: 'Simple use case map for Computer Use, napkin sketch style, blue ballpoint pen on a crumpled white paper napkin, spontaneous, authentic, raw texture, visible ink pressure, imperfect wobbly lines, featuring a central "Computer Use" circle with four branches: "QA Testing" (checkmark icon), "Data Entry" (spreadsheet icon), "Legacy Tools" (old computer icon), "Cross-Platform" (multiple window icon), each with a short note. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
    ],
  },

  // ── Post 22: Agent SDK ──
  {
    postNum: 12,
    title: 'Claude Agent SDK: What It Means When Your AI Can Build Its Own Tools',
    slug: 'claude-agent-sdk-explained',
    docId: 'drafts.488582ee-b8c2-4c07-a605-0d4f627cce5d',
    images: [
      {
        name: 'featured',
        type: 'featured',
        alt: 'Napkin sketch showing a three layer stack with Claude reasoning at the bottom, Agent SDK in the middle, and custom agent on top with tools plugging in from the sides',
        prompt: 'Simple concept of building custom agents, napkin sketch style, blue ballpoint pen on a crumpled white paper napkin, spontaneous, authentic, raw texture, visible ink pressure, imperfect wobbly lines, featuring a stack diagram: bottom layer "Claude Brain (Reasoning)", middle layer "Agent SDK (Your Tools)", top layer "Your Custom Agent" with arrows showing how custom tools plug in from the sides: "Query DB", "Send Email", "Update CRM", "Generate Report". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-1-workflow',
        type: 'inline',
        alt: 'Hand drawn process flow showing a custom client health check agent that pulls CRM data, checks uptime, reviews SEO, generates a report, and emails the client',
        caption: 'A real agent we could build. Pulls data from five sources, produces a report, sends it. No human in the loop.',
        prompt: 'Simple example of a custom agent workflow, hand-drawn horizontal process flow, thick arrows connecting simple labeled boxes from left to right, numbered steps, black marker on white paper, bold and simple, imperfect hand-drawn, looks like a quick planning sketch, featuring: "Agent: Client Health Check" then flow: "1. Pull GHL Data" arrow to "2. Check Website Uptime" arrow to "3. Review SEO Rankings" arrow to "4. Generate Report" arrow to "5. Email to Client". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-2-shift',
        type: 'inline',
        alt: 'Pencil sketch on notebook paper showing the difference between using AI tools and building AI products for clients with the Agent SDK',
        caption: 'The shift. From using AI to build for clients, to building AI that works for clients.',
        prompt: 'Simple comparison of using AI vs building AI products, hand-drawn sketch, graphite pencil on lined notebook paper, visible pencil pressure, light eraser smudges, imperfect wobbly lines, authentic student notebook feel, featuring two rows: top row "Using AI: Claude Code → Build client work" and bottom row "Selling AI: Agent SDK → Build AI products for clients" with the bottom row circled and labeled "The next level". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-3-roi',
        type: 'inline',
        alt: 'Hand drawn chart showing three custom AI agents saving over 40 hours per month through automated client health checks, lead qualification, and content pipelines',
        caption: 'The ROI of building your own agents. 40+ hours back per month, per agent.',
        prompt: 'Simple value proposition of custom agents, hand-drawn data visualization, minimalist chart, blue and black ink on graph paper, numbers written by hand, imperfect grid lines, authentic data napkin math feel, featuring three example agents with time savings: "Client Health Check: 4 hrs → 0 (automated weekly)", "Lead Qualification: 24/7 vs 9-5 manual", "Content Pipeline: 1 day → 2 hrs" with total "Hours saved/month: 40+" at the bottom. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
    ],
  },
];

// ============================================================
// MAIN
// ============================================================

async function main() {
  const args = process.argv.slice(2);
  let blogsToProcess = BLOGS;

  if (args.length > 0) {
    if (args[0] === '--post' && args[1]) {
      const num = parseInt(args[1]);
      blogsToProcess = BLOGS.filter(b => b.postNum === num);
    } else {
      const fragment = args[0].toLowerCase();
      blogsToProcess = BLOGS.filter(b => b.slug.includes(fragment));
    }

    if (blogsToProcess.length === 0) {
      console.error('No matching blog found.');
      process.exit(1);
    }
  }

  console.log(`Processing ${blogsToProcess.length} blog(s)...`);
  console.log(`Total images: ${blogsToProcess.reduce((sum, b) => sum + b.images.length, 0)}`);

  for (const blog of blogsToProcess) {
    await processBlog(blog);
  }

  console.log('\nAll done!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
