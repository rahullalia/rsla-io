/**
 * workflowAutomationsImages.mjs
 *
 * Generates 3 new inline images for the gohighlevel-workflow-automations-guide post.
 * Removes old images, generates via Gemini, uploads to Sanity, inserts into body.
 *
 * Usage: node scripts/workflowAutomationsImages.mjs [--dry-run]
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

const DOC_ID = 'yfy9cLha6032ya4d21y9YD';

const sanity = createClient({
  projectId: 'yz25oyux', dataset: 'production', token: SANITY_TOKEN,
  apiVersion: '2025-03-01', useCdn: false,
});

const IMAGES = [
  {
    style: 'notebookPencil',
    subject: 'workflow node system sketch',
    details: 'a simple workflow on lined notebook paper drawn in pencil: a circle on the left labeled with a play icon (start), an arrow to a rectangle with an envelope icon, an arrow splitting into two paths (one path going up to a rectangle with a phone icon, one going down to a rectangle with a clock icon), both paths converging to a circle on the right with a stop icon (end), clean and simple, graphite pencil with light eraser marks',
    alt: 'Notebook sketch showing a GoHighLevel workflow with start node, email action, conditional split to phone or wait, and end node',
    caption: 'Start node, actions, conditional split, end node. That is the entire Workflow Builder in one sketch.',
    afterH2Index: 0, // After "How the Workflow Builder actually works"
  },
  {
    style: 'stickyNote',
    subject: 'five foundational workflows checklist',
    details: 'a yellow sticky note with a numbered checklist of five items, each with a small checkbox, written in black felt tip marker: 1 with a calendar icon, 2 with a phone icon, 3 with a chat bubble icon, 4 with a bell icon, 5 with a star icon, simple and clean, slightly tilted on white desk',
    alt: 'Sticky note checklist of the five foundational GoHighLevel workflows to build first',
    caption: 'Five workflows. In this order. Get them running before you build anything else.',
    afterH2Index: 1, // After "The 5 workflows every GHL user should build first"
  },
  {
    style: 'whiteboardMarker',
    subject: 'workflow debugging process',
    details: 'a whiteboard sketch showing a simple debugging flow: a magnifying glass icon on the left, an arrow to a box with wavy lines (execution history), an arrow to a diamond shape with a question mark (find the broken node), an arrow splitting to a checkmark (fixed) going up and an X (timing conflict) going down, blue and red dry erase markers, slightly smudged whiteboard background',
    alt: 'Whiteboard sketch of the GoHighLevel workflow debugging process: check history, find broken node, fix or investigate timing conflict',
    caption: 'When a workflow breaks, start at the execution history. Walk through each node. Nine times out of ten, it is a condition issue.',
    afterH2Index: 3, // After "Debugging when things go wrong"
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
  console.log(`\nWorkflow Automations: Generate 3 Inline Images (${DRY_RUN ? 'DRY RUN' : 'LIVE'})\n`);

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
    const fn = `ghl-workflow-inline-${i + 1}.png`;
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
