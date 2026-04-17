/**
 * hooksGuideImages.mjs
 *
 * Generates 3 new inline images for the claude-code-hooks-automation-guide post.
 *
 * Usage: node scripts/hooksGuideImages.mjs [--dry-run]
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

const DOC_ID = '54a71f58-9f9f-410e-9e65-07dd06883274';

const sanity = createClient({
  projectId: 'yz25oyux', dataset: 'production', token: SANITY_TOKEN,
  apiVersion: '2025-03-01', useCdn: false,
});

const IMAGES = [
  {
    style: 'processArrows',
    subject: 'hook lifecycle flow from tool request to execution',
    details: 'a hand-drawn horizontal process flow on white paper with black marker showing four connected boxes with arrows: first box with a robot icon (Claude wants to run command), arrow to second box with a shield icon (PreToolUse hook checks), a fork with two arrows: one going down to a red X (blocked exit code 2) and one going right to third box with a gear icon (tool executes), arrow to fourth box with a checkmark icon (PostToolUse hook runs tests), simple bold lines with imperfect hand-drawn feel',
    alt: 'Process flow showing Claude Code lifecycle: request, PreToolUse check, execution or block, PostToolUse follow-up',
    caption: 'The whole system. Claude Code wants to do something. The hook checks it. If safe, it runs. After running, another hook follows up. Exit code 0 means go. Exit code 2 means stop.',
    afterH2Index: 0, // After "How hooks work"
  },
  {
    style: 'stickyNote',
    subject: 'five essential hooks checklist',
    details: 'a sticky note sketch in black felt tip marker on a yellow sticky note showing five numbered items: 1 with a shield icon (block destructive commands), 2 with a checkmark icon (auto-run tests), 3 with a paintbrush icon (auto-format code), 4 with a bell icon (notify on completion), 5 with a save icon (git backup before risky ops), each item on its own line with a small checkbox, adhesive strip at top, slightly tilted on white desk',
    alt: 'Sticky note checklist: 1. Block destructive commands 2. Auto-run tests 3. Auto-format 4. Notify on completion 5. Git backup',
    caption: 'Five hooks. Fifteen minutes to set up. They cover 90% of what a small team needs. Start here.',
    afterH2Index: 2, // After "Five essential hooks every team needs"
  },
  {
    style: 'splitScreen',
    subject: 'CLAUDE.md suggestions versus hooks enforcement',
    details: 'a clean split on white paper with a vertical line down the middle drawn in black marker: left side shows a document icon at top with soft wavy lines below it and a speech bubble saying "please" (CLAUDE.md - suggestions, can be overridden, context-dependent), right side shows a lock icon at top with hard straight lines below it and a stop sign (Hooks - enforcement, cannot be bypassed, exit code based), simple minimal hand-drawn style',
    alt: 'Split comparison showing CLAUDE.md as suggestions that can be overridden versus hooks as enforcement that cannot be bypassed',
    caption: 'CLAUDE.md says "please do not force push." A hook says "you cannot force push." One is guidance. The other is a wall. Use both.',
    afterH2Index: 5, // After "Hooks versus CLAUDE.md instructions"
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
  console.log(`\nClaude Code Hooks Guide: Generate 3 Inline Images (${DRY_RUN ? 'DRY RUN' : 'LIVE'})\n`);

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
    const fn = `hooks-guide-inline-${i + 1}.png`;
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
