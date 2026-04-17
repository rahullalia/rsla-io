/**
 * agentSdkImages.mjs
 *
 * Generates 3 new inline images for the claude-agent-sdk-explained post.
 *
 * Usage: node scripts/agentSdkImages.mjs [--dry-run]
 */

import { createClient } from '@sanity/client';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { IMAGE_STYLES, buildPrompt } from './imageStyles.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..', 'generated-images');
const DRY_RUN = process.argv.includes('--dry-run');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SANITY_TOKEN = readFileSync('/Users/rahullalia/lalia/4-Resources/mcp/sanity.env', 'utf-8')
  .split('\n').find(l => l.startsWith('SANITY_API_TOKEN=')).split('=').slice(1).join('=').trim();

if (!GEMINI_API_KEY) throw new Error('Missing GEMINI_API_KEY');
if (!SANITY_TOKEN) throw new Error('Missing SANITY_API_TOKEN');

const DOC_ID = '488582ee-b8c2-4c07-a605-0d4f627cce5d';

const sanity = createClient({
  projectId: 'yz25oyux', dataset: 'production', token: SANITY_TOKEN,
  apiVersion: '2025-03-01', useCdn: false,
});

const IMAGES = [
  {
    style: 'napkinSketch',
    subject: 'three building blocks of an Agent SDK agent',
    details: 'a casual napkin sketch with blue ballpoint pen on a white paper napkin showing three connected elements in a triangle arrangement: top circle with a brain icon (the agent - reasoning and instructions), bottom left circle with a hand/wrench icon (tools - functions it can call), bottom right circle with a fence/shield icon (guardrails - boundaries and limits), connecting lines between all three forming a triangle, slightly wrinkled napkin texture, casual quick sketch feel',
    alt: 'Napkin sketch showing three building blocks: the agent (brain/reasoning), tools (functions), and guardrails (boundaries), connected in a triangle',
    caption: 'Three pieces. The brain decides what to do. The tools let it act. The guardrails keep it safe. That is the whole SDK.',
    afterH2Index: 0, // After "What the Agent SDK actually is"
  },
  {
    style: 'processArrows',
    subject: 'AI stack layers from chat to Code to Agent SDK',
    details: 'a hand-drawn vertical stack on white paper with black marker showing three stacked layers with upward arrows: bottom layer is a speech bubble icon (Claude Chat - conversations, no tools, no autonomy), middle layer is a terminal icon (Claude Code - file access, tools, human in the loop), top layer is a robot icon (Agent SDK - custom agents, autonomous, event-driven), each layer slightly wider than the one below showing increasing capability, simple bold lines with imperfect hand-drawn feel',
    alt: 'Stack diagram showing three layers: Claude Chat at bottom (conversations), Claude Code in middle (development), Agent SDK at top (autonomous deployment)',
    caption: 'Three layers. Chat for questions. Code for development. SDK for automation. Each builds on the previous one.',
    afterH2Index: 4, // After "Where the Agent SDK fits in the AI stack"
  },
  {
    style: 'dashboardSketch',
    subject: 'decision framework for Claude Code versus Agent SDK',
    details: 'a hand-drawn decision flowchart on white paper with black marker: starting circle at top (new task), first diamond (is it repeatable?), if no arrow goes left to a box (use Claude Code), if yes arrow goes down to second diamond (should it run without you?), if no arrow goes left to a box (use Claude Code), if yes arrow goes down to a box (build Agent SDK agent), clean connected lines with slight imperfection, simple icons in each box',
    alt: 'Decision flowchart: Is task repeatable? No: use Claude Code. Yes: Should it run without you? No: use Claude Code. Yes: build Agent SDK agent',
    caption: 'Two questions. That is the whole decision. If it is repeatable and should run without you, build an agent. Everything else is Claude Code.',
    afterH2Index: 1, // After "How the Agent SDK compares to Claude Code"
  },
];

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
  if (!response.ok) throw new Error(`Gemini ${response.status}: ${await response.text()}`);
  const data = await response.json();
  const img = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData?.mimeType?.startsWith('image/'));
  if (!img) throw new Error('No image from Gemini');
  return { base64: img.inlineData.data, mimeType: img.inlineData.mimeType };
}

async function run() {
  console.log(`\nAgent SDK Explained: Generate 3 Inline Images (${DRY_RUN ? 'DRY RUN' : 'LIVE'})\n`);

  const doc = await sanity.fetch(`*[_id == $id][0]{body}`, { id: DOC_ID }, { perspective: 'raw' });
  if (!doc?.body) throw new Error('No body');

  const oldImgs = doc.body.filter(b => b._type === 'image').length;
  const textBlocks = doc.body.filter(b => b._type !== 'image');
  console.log(`${doc.body.length} blocks, ${oldImgs} old images removed, ${textBlocks.length} text kept`);

  const h2Indices = [];
  textBlocks.forEach((b, i) => {
    if (b._type === 'block' && b.style === 'h2') {
      h2Indices.push({ idx: i, text: b.children?.map(c => c.text).join('') || '' });
    }
  });
  h2Indices.forEach((h, i) => console.log(`  H2 ${i}: ${h.text}`));

  mkdirSync(OUTPUT_DIR, { recursive: true });
  const newBlocks = [];

  for (let i = 0; i < IMAGES.length; i++) {
    const img = IMAGES[i];
    const prompt = buildPrompt(img.style, img.subject, img.details);
    console.log(`\n  Image ${i + 1}/3: ${img.style}`);

    if (DRY_RUN) { newBlocks.push({ ...img, _type: 'image' }); continue; }

    const { base64 } = await generateImage(prompt);
    const fn = `agent-sdk-inline-${i + 1}.png`;
    writeFileSync(join(OUTPUT_DIR, fn), Buffer.from(base64, 'base64'));
    console.log(`    Saved: ${fn}`);

    const asset = await sanity.assets.upload('image', Buffer.from(base64, 'base64'), { filename: fn, contentType: 'image/png' });
    console.log(`    Uploaded: ${asset._id}`);

    newBlocks.push({
      _type: 'image',
      _key: `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      alt: img.alt, caption: img.caption, size: 'full', aspectRatio: '1:1',
      asset: { _type: 'reference', _ref: asset._id },
      afterH2Index: img.afterH2Index,
    });
    if (i < IMAGES.length - 1) await new Promise(r => setTimeout(r, 2000));
  }

  const finalBody = [...textBlocks];
  [...newBlocks].sort((a, b) => b.afterH2Index - a.afterH2Index).forEach(imgBlock => {
    const h2 = h2Indices[imgBlock.afterH2Index];
    if (!h2) return;
    const nextIdx = imgBlock.afterH2Index + 1 < h2Indices.length ? h2Indices[imgBlock.afterH2Index + 1].idx : finalBody.length;
    const { afterH2Index, style, subject, details, ...clean } = imgBlock;
    finalBody.splice(nextIdx, 0, clean);
    console.log(`  Inserted after "${h2.text}"`);
  });

  if (DRY_RUN) { console.log(`Would patch ${finalBody.length} blocks`); return; }

  const res = await fetch('https://yz25oyux.api.sanity.io/v2025-03-01/data/mutate/production', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SANITY_TOKEN}` },
    body: JSON.stringify({ mutations: [{ patch: { id: DOC_ID, set: { body: finalBody } } }] }),
  });
  const result = await res.json();
  console.log(`\nTransaction: ${result.transactionId}`);

  const v = await sanity.fetch(`*[_id == $id][0]{"t":count(body),"i":count(body[_type=="image"]),"b":count(body[_type=="block"])}`, { id: DOC_ID }, { perspective: 'raw' });
  console.log(`DONE: ${v.t} blocks (${v.i} images, ${v.b} text)\n`);
}

run().catch(e => { console.error(e.message); process.exit(1); });
