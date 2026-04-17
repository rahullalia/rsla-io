/**
 * claudeMdGuideImages.mjs
 *
 * Generates 3 new inline images for the claude-md-file-ai-context-guide post.
 *
 * Usage: node scripts/claudeMdGuideImages.mjs [--dry-run]
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

const DOC_ID = 'b23d8fed-dc0d-4cd9-8d04-558868b02d04';

const sanity = createClient({
  projectId: 'yz25oyux', dataset: 'production', token: SANITY_TOKEN,
  apiVersion: '2025-03-01', useCdn: false,
});

const IMAGES = [
  {
    style: 'processArrows',
    subject: 'CLAUDE.md hierarchy from global to project to folder',
    details: 'a hand-drawn vertical hierarchy on white paper with black marker showing three stacked layers connected by downward arrows: top layer is a house icon with a wide rectangle (global CLAUDE.md applies everywhere), middle layer is a folder icon with a medium rectangle (project CLAUDE.md applies to project), bottom layer is a subfolder icon with a small rectangle (folder CLAUDE.md applies locally), each layer slightly narrower than the one above showing specificity increasing downward, a small merge icon on the right with arrows combining all three, simple bold lines with imperfect hand-drawn feel',
    alt: 'Hierarchy diagram showing three CLAUDE.md levels: global at top applying everywhere, project in middle applying to one project, folder at bottom applying locally, all merging together',
    caption: 'Three levels. Global for preferences that apply everywhere. Project for project-specific context. Folder for subdirectory overrides. Claude Code merges all three.',
    afterH2Index: 1, // After "The hierarchy"
  },
  {
    style: 'splitScreen',
    subject: 'session without CLAUDE.md versus session with CLAUDE.md',
    details: 'a clean split on white paper with a vertical line down the middle drawn in black marker: left side shows a clock icon at top with many speech bubbles going back and forth and a frustrated face icon at bottom (without CLAUDE.md - repeated explanations, context from zero, inconsistent output), right side shows a document icon at top with a single speech bubble and a checkmark icon at bottom (with CLAUDE.md - instant context, consistent rules, productive from first message), simple minimal hand-drawn style',
    alt: 'Split comparison showing without CLAUDE.md having repeated explanations and frustration versus with CLAUDE.md having instant context and productivity',
    caption: 'Left: every session starts from zero. Right: every session picks up where you left off. The difference is one file.',
    afterH2Index: 4, // After "CLAUDE.md versus prompting every session"
  },
  {
    style: 'notebookPencil',
    subject: 'five essential CLAUDE.md sections to start with',
    details: 'a lined notebook page with pencil writing showing five numbered items with small icons: 1 with a document icon (project overview), 2 with a tag icon (naming conventions), 3 with a terminal icon (key commands), 4 with a tree icon (folder structure), 5 with a warning icon (known gotchas), clean graphite pencil on cream notebook paper with faint blue lines and a red margin line on the left, casual handwriting feel',
    alt: 'Notebook page listing five starter sections: 1. Project overview 2. Naming conventions 3. Key commands 4. Folder structure 5. Known gotchas',
    caption: 'Five sections. Ten minutes. That is all you need to start. Everything else grows from friction.',
    afterH2Index: 6, // After "Getting started in 10 minutes"
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
  console.log(`\nCLAUDE.md Guide: Generate 3 Inline Images (${DRY_RUN ? 'DRY RUN' : 'LIVE'})\n`);

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
    const fn = `claude-md-guide-inline-${i + 1}.png`;
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
