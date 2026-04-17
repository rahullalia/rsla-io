/**
 * whatIsClaudeCodeImages.mjs
 *
 * Generates 3 new inline images for the what-is-claude-code-guide post.
 *
 * Usage: node scripts/whatIsClaudeCodeImages.mjs [--dry-run]
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

const DOC_ID = '45cf75ee-807f-4b11-8bb5-8df18d301347';

const sanity = createClient({
  projectId: 'yz25oyux', dataset: 'production', token: SANITY_TOKEN,
  apiVersion: '2025-03-01', useCdn: false,
});

const IMAGES = [
  {
    style: 'splitScreen',
    subject: 'Claude chat versus Claude Code comparison',
    details: 'a clean split on white paper with a vertical line down the middle drawn in black marker: left side shows a speech bubble icon at top with two smaller bubbles going back and forth (Claude Chat - conversation only, no file access, manual changes), right side shows a terminal icon at top with a folder tree and gear icons below it (Claude Code - full project access, reads files, runs commands, builds things), simple minimal hand-drawn style with slight imperfection',
    alt: 'Split comparison showing Claude Chat as conversation-only with no file access versus Claude Code as autonomous agent with full project access',
    caption: 'Left: you talk, it talks back. Right: you talk, it does the work. Same AI model. Completely different capability.',
    afterH2Index: 0, // After "How Claude Code differs from Claude chat"
  },
  {
    style: 'whiteboardMarker',
    subject: 'six things Claude Code can do listed on a whiteboard',
    details: 'a whiteboard sketch in blue dry-erase marker with a simple list of six items with icons: a wrench icon (build features end to end), a bug icon (debug and fix issues), a refresh icon (refactor code), a plug icon (connect external tools via MCP), a pen icon (generate content), a cloud icon (manage infrastructure and deploy), clean whiteboard with slight shadow at edges, casual hand-drawn marker feel',
    alt: 'Whiteboard listing six Claude Code capabilities: build features, debug issues, refactor code, connect tools via MCP, generate content, manage infrastructure',
    caption: 'Six categories of things Claude Code does well. The MCP integrations are the multiplier. Twenty tools connected through one agent.',
    afterH2Index: 3, // After "What Claude Code can actually do"
  },
  {
    style: 'metricViz',
    subject: 'time savings before and after Claude Code at RSL/A',
    details: 'a hand-drawn comparison chart on graph paper with blue ink showing three rows of horizontal bars: first row shows blog post in red (before: 8 hours) and blue (after: 2.5 hours), second row shows website feature in red (before: 40 hours) and blue (after: 8 hours), third row shows email sequence in red (before: 4 hours) and blue (after: 0.75 hours), each pair labeled with the multiplier (3x, 5x, 5x), clean graphite grid lines with hand-drawn feel',
    alt: 'Comparison chart showing time savings: blog post 8 hours to 2.5 hours (3x), website feature 40 hours to 8 hours (5x), email sequence 4 hours to 45 minutes (5x)',
    caption: 'Real numbers from our two person agency. Not projections. Not estimates. Actual tracked time before and after.',
    afterH2Index: 7, // After "How we use Claude Code at RSL/A"
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
  console.log(`\nWhat Is Claude Code Guide: Generate 3 Inline Images (${DRY_RUN ? 'DRY RUN' : 'LIVE'})\n`);

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
    const fn = `what-is-claude-code-inline-${i + 1}.png`;
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
