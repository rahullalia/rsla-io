/**
 * claudeVsCoworkImages.mjs
 *
 * Generates 3 new inline images for the claude-code-vs-cowork-vs-claude-app post.
 *
 * Usage: node scripts/claudeVsCoworkImages.mjs [--dry-run]
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

const DOC_ID = '488617b8-9bbf-4ac1-afb5-123fc12ad76e';

const sanity = createClient({
  projectId: 'yz25oyux', dataset: 'production', token: SANITY_TOKEN,
  apiVersion: '2025-03-01', useCdn: false,
});

const IMAGES = [
  {
    style: 'whiteboardMarker',
    subject: 'three Claude products with their interfaces',
    details: 'a whiteboard sketch with three columns drawn with colored dry erase markers: left column in blue with a chat bubble icon at top (Claude Chat) with small icons below for a question mark and a lightbulb (quick answers and brainstorming), middle column in green with a terminal prompt icon at top (Claude Code) with small icons below for a wrench and a rocket (build and deploy), right column in purple with a desktop window icon at top (Cowork) with small icons below for a magnifying glass and a document stack (research and documents), clean whiteboard background with slight smudge marks',
    alt: 'Whiteboard showing three Claude products: Chat for quick answers, Code for building and deploying, Cowork for research and documents',
    caption: 'Three products. One brain. Chat for thinking. Code for building. Cowork for researching. Use all three.',
    afterH2Index: 0, // After "What each product actually does"
  },
  {
    style: 'processArrows',
    subject: 'decision tree for choosing which Claude product',
    details: 'a hand-drawn flowchart on white paper with black marker showing a simple decision tree: a diamond shape at top with a question mark, three arrows going down to three boxes: left arrow labeled with a speech bubble going to a box with the word Chat, middle arrow labeled with a code bracket going to a box with the word Code, right arrow labeled with a document icon going to a box with the word Cowork, simple bold lines with imperfect hand-drawn feel',
    alt: 'Decision tree flowchart: quick question goes to Chat, building or deploying goes to Code, research or documents goes to Cowork',
    caption: 'Three seconds. That is how long the decision takes. Quick question? Chat. Building something? Code. Research or documents? Cowork.',
    afterH2Index: 6, // After "The decision tree we actually use"
  },
  {
    style: 'metricViz',
    subject: 'RSL/A usage split across three Claude products',
    details: 'a hand-drawn pie chart on graph paper with three sections drawn in blue ink: the largest section taking up about 60% with a terminal icon (Claude Code 60%), a medium section taking up about 25% with a chat bubble icon (Claude Chat 25%), and a small section taking up about 15% with a desktop icon (Cowork 15%), each section has its percentage written by hand, clean graphite grid lines',
    alt: 'Pie chart showing RSL/A usage: Claude Code 60%, Claude Chat 25%, Cowork 15%',
    caption: '60% Claude Code. 25% Claude Chat. 15% Cowork. That is how the split looks at an agency that builds websites, content, and automations. Your split will look different.',
    afterH2Index: 9, // After "The bottom line"
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
  console.log(`\nClaude vs Cowork vs Claude App: Generate 3 Inline Images (${DRY_RUN ? 'DRY RUN' : 'LIVE'})\n`);

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
    const fn = `claude-vs-cowork-inline-${i + 1}.png`;
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
