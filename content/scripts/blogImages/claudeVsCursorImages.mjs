/**
 * claudeVsCursorImages.mjs
 *
 * Generates 3 new inline images for the claude-code-vs-cursor-vs-github-copilot post.
 *
 * Usage: node scripts/claudeVsCursorImages.mjs [--dry-run]
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

const DOC_ID = 'a11d17d1-0172-4ebb-afd9-b37d26c5cc94';

const sanity = createClient({
  projectId: 'yz25oyux', dataset: 'production', token: SANITY_TOKEN,
  apiVersion: '2025-03-01', useCdn: false,
});

const IMAGES = [
  {
    style: 'splitScreen',
    subject: 'three AI coding tool categories side by side',
    details: 'a clean split on white paper divided into three vertical sections with hand-drawn black marker lines: left section shows a robot icon with arrows going to multiple file icons (autonomous agent - describes and delegates), middle section shows two people icons sitting at a desk with a screen (co-editor - works together in real time), right section shows a keyboard with sparkle icons above it (autocomplete - predicts what you type), simple minimal hand-drawn style with blue accents',
    alt: 'Three-way split showing autonomous agent (delegates tasks), co-editor (works together), and autocomplete (predicts typing)',
    caption: 'Three categories. Autonomous agents delegate the whole task. Co-editors work alongside you. Autocomplete predicts what you type. Every AI coding tool falls into one of these three.',
    afterH2Index: 0, // After "What each tool actually does"
  },
  {
    style: 'napkinSketch',
    subject: 'monthly cost breakdown for all three tools',
    details: 'a napkin sketch in blue ballpoint pen showing three items stacked vertically with prices: top line with a terminal icon and $20 (Claude Code Pro), middle line with an editor icon and $20 (Cursor Pro), bottom line with a tab key icon and $10 (Copilot), a horizontal line underneath with a total of $50 circled, below the total a comparison note showing this equals one freelancer hour, casual napkin texture background',
    alt: 'Napkin sketch showing Claude Code $20 plus Cursor $20 plus Copilot $10 equals $50 per month total',
    caption: '$50 per month for all three. That is less than one hour of freelance developer time. The ROI is not even a question.',
    afterH2Index: 3, // After "Pricing"
  },
  {
    style: 'dashboardSketch',
    subject: 'RSL/A usage split across three tools',
    details: 'a hand-drawn dashboard mockup on white paper showing three horizontal progress bars with percentages: top bar filled to 50% with a terminal icon (Claude Code 50%), middle bar filled to 35% with an editor icon (Cursor 35%), bottom bar filled to 15% with a tab key icon (Copilot 15%), below the bars a small note showing different day types with arrows pointing to different distributions, pencil on white paper with blue pen accents',
    alt: 'Dashboard showing RSL/A tool usage: Claude Code 50%, Cursor 35%, Copilot 15%',
    caption: 'Our actual split. 50% Claude Code. 35% Cursor. 15% Copilot. Build days are 80% Claude Code. Debug days are 80% Cursor. Your split will look different.',
    afterH2Index: 4, // After "How we use all three at RSL/A"
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
  console.log(`\nClaude Code vs Cursor vs Copilot: Generate 3 Inline Images (${DRY_RUN ? 'DRY RUN' : 'LIVE'})\n`);

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
    const fn = `claude-vs-cursor-inline-${i + 1}.png`;
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
