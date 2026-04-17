/**
 * agencyWorkflowImages.mjs
 *
 * Generates 3 new inline images for the claude-code-marketing-agency-workflow post.
 *
 * Usage: node scripts/agencyWorkflowImages.mjs [--dry-run]
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

const DOC_ID = '69a47da3-e316-4d1b-94bf-4273d7ac8814';

const sanity = createClient({
  projectId: 'yz25oyux', dataset: 'production', token: SANITY_TOKEN,
  apiVersion: '2025-03-01', useCdn: false,
});

const IMAGES = [
  {
    style: 'feltTipClean',
    subject: 'agency tool stack connected through a central hub',
    details: 'a hub and spoke diagram on plain white paper drawn with black felt tip pen: center circle with a robot/AI icon (Claude Code), 9 spokes radiating outward connecting to smaller circles around the edge each with a simple icon: a document icon (Sanity), a rocket icon (Vercel), a pipeline icon (GoHighLevel), a checklist icon (Notion), an envelope icon (Google), a code bracket icon (GitHub), a camera icon (Gemini), a dollar sign icon (Stripe), a globe icon (Website), clean connected lines with slight imperfection',
    alt: 'Hub and spoke diagram showing Claude Code at center connected to 9 business tools: Sanity, Vercel, GoHighLevel, Notion, Google, GitHub, Gemini, Stripe, Website',
    caption: 'One agent. Nine integrations. Zero custom API code. Every tool talks to Claude Code through MCP. That is the entire stack.',
    afterH2Index: 0, // After "The stack that makes it work"
  },
  {
    style: 'metricViz',
    subject: 'productivity comparison before and after Claude Code',
    details: 'a hand-drawn comparison chart on graph paper with blue ink showing two rows of horizontal bars: top section shows three bars on the left (before) in red: blog 8 hours, email sequence 4 hours, website feature 40 hours, bottom section shows three matching bars on the right (after) in blue: blog 2.5 hours, email sequence 0.75 hours, website feature 8 hours, each pair connected by an arrow with the multiplier written next to it (3x, 5x, 5x), clean graphite grid lines',
    alt: 'Comparison chart showing time savings: blog post 8 hours to 2.5 hours (3x), email sequence 4 hours to 45 minutes (5x), website feature 40 hours to 8 hours (5x)',
    caption: 'Real numbers from our workflows. Blog production 3x faster. Email sequences 5x faster. Website features 5x faster. Same two person team.',
    afterH2Index: 5, // After "The numbers"
  },
  {
    style: 'stickyNote',
    subject: 'learning curve timeline for non-developers',
    details: 'a sticky note sketch in black felt tip marker on a yellow sticky note showing four items in a vertical timeline: Week 1 with a confused face icon (basic navigation, frustrating), Week 2 with a lightbulb icon (learning specificity), Week 3 with a wrench icon (building CLAUDE.md), Month 2 with a rocket icon (productive daily use), adhesive strip at top, slightly tilted on white desk, casual hand-written feel',
    alt: 'Sticky note showing learning curve: Week 1 basic navigation, Week 2 learning specificity, Week 3 building CLAUDE.md, Month 2 productive daily use',
    caption: 'The learning curve is real. Week 1 is frustrating. Week 3 it starts clicking. Month 2 it is just how you work. Budget 2 to 3 weeks.',
    afterH2Index: 7, // After "The learning curve for non developers"
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
  console.log(`\nAgency Workflow: Generate 3 Inline Images (${DRY_RUN ? 'DRY RUN' : 'LIVE'})\n`);

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
    const fn = `agency-workflow-inline-${i + 1}.png`;
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
