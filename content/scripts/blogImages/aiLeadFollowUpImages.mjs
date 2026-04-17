/**
 * aiLeadFollowUpImages.mjs
 *
 * Generates 3 new inline images for the ai-lead-follow-up-system post.
 *
 * Usage: node scripts/aiLeadFollowUpImages.mjs [--dry-run]
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

const DOC_ID = '9ed10488-c1ce-4dc1-9e8f-b783ca3aa297';

const sanity = createClient({
  projectId: 'yz25oyux', dataset: 'production', token: SANITY_TOKEN,
  apiVersion: '2025-03-01', useCdn: false,
});

const IMAGES = [
  {
    style: 'splitScreen',
    subject: 'automated versus AI follow-up comparison',
    details: 'a clean split on white paper with a vertical line down the middle drawn in black marker: left side shows a one-way arrow with three envelope icons going down (automated sequence - monologue), right side shows two-way arrows between a robot face and a person icon going back and forth (AI conversation - dialogue), simple and minimal hand-drawn style with slight imperfection',
    alt: 'Split comparison showing automated follow-up as a one-way monologue versus AI follow-up as a two-way dialogue',
    caption: 'Automated follow-up talks at the lead. AI follow-up talks with the lead. The best systems use both.',
    afterH2Index: 0, // After "The difference between automated follow up and AI follow up"
  },
  {
    style: 'notebookPencil',
    subject: 'knowledge base content checklist',
    details: 'a notebook page with a pencil-drawn checklist of six items, each with a small icon: a wrench icon (services), a dollar sign (pricing), a map pin (service area), a clock (hours), a question mark (common questions), a calendar (booking instructions), each item has a checkbox next to it, clean graphite pencil on lined paper with slight eraser marks',
    alt: 'Notebook checklist of the six essential items to include in a Conversation AI knowledge base',
    caption: 'Six things your knowledge base needs. Services, pricing, area, hours, common questions, booking instructions. Miss one and the AI stumbles.',
    afterH2Index: 2, // After "Setting up the knowledge base"
  },
  {
    style: 'processArrows',
    subject: 'four-layer system architecture',
    details: 'a horizontal flow on white paper with black marker showing four connected layers from left to right: first circle with a lightning bolt (instant acknowledgment), an arrow to a second circle with a robot face (AI qualification), an arrow to a third circle with a clock and envelope (automated sequence), an arrow to a fourth circle with a person icon (human handoff), all four connected by arrows, below each circle a small label area, clean minimal hand-drawn style',
    alt: 'Flow diagram showing the four layers of an AI lead follow-up system: instant response, AI qualification, automated sequence, and human handoff',
    caption: 'Four layers. Instant acknowledgment, AI conversation, automated persistence, human handoff. No lead falls through.',
    afterH2Index: 3, // After "The complete system architecture"
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
  console.log(`\nAI Lead Follow-Up: Generate 3 Inline Images (${DRY_RUN ? 'DRY RUN' : 'LIVE'})\n`);

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
    const fn = `ai-lead-followup-inline-${i + 1}.png`;
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
