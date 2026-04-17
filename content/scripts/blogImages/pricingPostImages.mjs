/**
 * pricingPostImages.mjs
 *
 * Generates 3 new inline images for the go-high-level-pricing post rewrite.
 * Removes old images, generates via Gemini, uploads to Sanity, inserts into body.
 *
 * Usage: node scripts/pricingPostImages.mjs [--dry-run]
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
  .split('\n')
  .find(line => line.startsWith('SANITY_API_TOKEN='))
  ?.split('=').slice(1).join('=')
  ?.trim();

if (!GEMINI_API_KEY) throw new Error('Missing GEMINI_API_KEY in .env');
if (!SANITY_TOKEN) throw new Error('Missing SANITY_API_TOKEN in sanity.env');

const DOC_ID = '4h6ZovbNJGIiFWW2xZX1mi';

const sanity = createClient({
  projectId: 'yz25oyux',
  dataset: 'production',
  token: SANITY_TOKEN,
  apiVersion: '2025-03-01',
  useCdn: false,
});

// 3 images, each with a different style
const IMAGES = [
  {
    style: 'splitScreen',
    subject: 'business tool comparison',
    details: 'left side showing multiple scattered app icons (calendar, email, phone, invoice) with dollar signs adding up, right side showing one single unified dashboard with all features connected, arrows converging into one platform',
    alt: 'Split comparison showing scattered business tools on left versus unified GoHighLevel dashboard on right',
    caption: 'One platform replaces the five or six tools most businesses are juggling',
    afterH2Index: 2, // After "Why $297 is the plan I recommend most"
  },
  {
    style: 'metricViz',
    subject: 'hidden cost breakdown chart',
    details: 'a hand-drawn bar chart with the main bar labeled "subscription" and smaller stacked bars next to it labeled with icons for phone, SMS bubbles, and a gear icon for AI, with dollar amounts sketched next to each bar, total circled at top',
    alt: 'Hand-drawn cost breakdown showing GoHighLevel subscription plus add-on costs for SMS, phone, and AI features',
    caption: 'The subscription is just part of the bill. Budget $20 to $100/month for add-ons.',
    afterH2Index: 4, // After "The costs GHL doesn't put on the pricing page"
  },
  {
    style: 'feltTipClean',
    subject: 'platform consolidation diagram',
    details: 'eight small circles arranged in a ring, each representing a different tool (CRM, email, funnel, calendar, SMS, reviews, website, forms), with arrows all pointing inward to one large central circle, simple and clean',
    alt: 'Diagram showing eight separate marketing tools consolidating into one GoHighLevel platform',
    caption: 'GHL covers about 80% of what each individual tool does. For most businesses, that is more than enough.',
    afterH2Index: 7, // After "How GHL stacks up against HubSpot and the rest"
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

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${err}`);
  }

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find(p => p.inlineData?.mimeType?.startsWith('image/'));

  if (!imagePart) throw new Error('No image returned from Gemini');

  return {
    base64: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType,
  };
}

async function run() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`GoHighLevel Pricing Post: Generate 3 Inline Images`);
  console.log(`  Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  console.log(`${'='.repeat(60)}\n`);

  // Step 1: Fetch current body and remove old images
  console.log('Fetching current body...');
  const doc = await sanity.fetch(
    `*[_id == $id][0]{body}`,
    { id: DOC_ID },
    { perspective: 'raw' }
  );

  if (!doc?.body) throw new Error('No body found');

  const oldImageCount = doc.body.filter(b => b._type === 'image').length;
  const textBlocks = doc.body.filter(b => b._type !== 'image');
  console.log(`  ${doc.body.length} total blocks, ${oldImageCount} old images removed, ${textBlocks.length} text blocks kept`);

  // Find H2 positions in the cleaned body
  const h2Indices = [];
  textBlocks.forEach((block, idx) => {
    if (block._type === 'block' && block.style === 'h2') {
      const text = block.children?.map(c => c.text).join('') || '';
      h2Indices.push({ idx, text });
    }
  });

  console.log(`\n  H2 positions:`);
  h2Indices.forEach((h, i) => console.log(`    ${i}: ${h.text}`));

  // Step 2: Generate images
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const newImageBlocks = [];

  for (let i = 0; i < IMAGES.length; i++) {
    const img = IMAGES[i];
    const style = IMAGE_STYLES[img.style];
    const prompt = buildPrompt(img.style, img.subject, img.details);

    console.log(`\n  Image ${i + 1}/3: ${img.style} (${style.name})`);
    console.log(`    Prompt: ${prompt.substring(0, 100)}...`);

    if (DRY_RUN) {
      console.log('    [DRY RUN] Would generate and upload');
      newImageBlocks.push({
        _type: 'image',
        _key: `img_new_${i}`,
        alt: img.alt,
        caption: img.caption,
        size: 'full',
        aspectRatio: '1:1',
        asset: { _type: 'reference', _ref: 'placeholder' },
        afterH2Index: img.afterH2Index,
      });
      continue;
    }

    // Generate
    const { base64 } = await generateImage(prompt);

    // Save locally
    const filename = `ghl-pricing-inline-${i + 1}.png`;
    writeFileSync(join(OUTPUT_DIR, filename), Buffer.from(base64, 'base64'));
    console.log(`    Saved locally: ${filename}`);

    // Upload to Sanity
    const asset = await sanity.assets.upload('image', Buffer.from(base64, 'base64'), {
      filename,
      contentType: 'image/png',
    });
    console.log(`    Uploaded: ${asset._id}`);

    newImageBlocks.push({
      _type: 'image',
      _key: `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      alt: img.alt,
      caption: img.caption,
      size: 'full',
      aspectRatio: '1:1',
      asset: { _type: 'reference', _ref: asset._id },
      afterH2Index: img.afterH2Index,
    });

    // Small delay between API calls
    if (i < IMAGES.length - 1) await new Promise(r => setTimeout(r, 2000));
  }

  // Step 3: Insert images into cleaned body
  console.log('\n  Inserting images into body...');
  const finalBody = [...textBlocks];

  // Insert in reverse order to preserve indices
  const sortedImages = [...newImageBlocks].sort((a, b) => b.afterH2Index - a.afterH2Index);

  for (const imgBlock of sortedImages) {
    const h2 = h2Indices[imgBlock.afterH2Index];
    if (!h2) {
      console.log(`    WARNING: H2 index ${imgBlock.afterH2Index} not found, skipping`);
      continue;
    }

    // Find the next H2 or end of body, then insert image before it
    const nextH2Idx = imgBlock.afterH2Index + 1 < h2Indices.length
      ? h2Indices[imgBlock.afterH2Index + 1].idx
      : finalBody.length;

    // Insert just before the next H2 (or end)
    const insertPos = nextH2Idx;
    const { afterH2Index, ...cleanBlock } = imgBlock;
    finalBody.splice(insertPos, 0, cleanBlock);

    console.log(`    Inserted after "${h2.text}" (position ${insertPos})`);
  }

  if (DRY_RUN) {
    console.log(`\n  DRY RUN: Would patch body with ${finalBody.length} blocks`);
    return;
  }

  // Step 4: Patch the body
  console.log(`\n  Patching body: ${finalBody.length} blocks...`);
  const mutateUrl = `https://yz25oyux.api.sanity.io/v2025-03-01/data/mutate/production`;
  const res = await fetch(mutateUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SANITY_TOKEN}`,
    },
    body: JSON.stringify({
      mutations: [{ patch: { id: DOC_ID, set: { body: finalBody } } }],
    }),
  });

  const result = await res.json();
  if (result.error) throw new Error(`Mutation failed: ${JSON.stringify(result.error)}`);
  console.log(`  Transaction: ${result.transactionId}`);

  // Verify
  const verify = await sanity.fetch(
    `*[_id == $id][0]{ "total": count(body), "images": count(body[_type == "image"]), "text": count(body[_type == "block"]) }`,
    { id: DOC_ID },
    { perspective: 'raw' }
  );
  console.log(`\n${'='.repeat(60)}`);
  console.log(`DONE: ${verify.total} blocks (${verify.images} images, ${verify.text} text)`);
  console.log(`${'='.repeat(60)}\n`);
}

run().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
