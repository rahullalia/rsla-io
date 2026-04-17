/**
 * post2Images.mjs
 *
 * Generates featured + 3 inline images for Post 2 (is-claude-free-pricing-every-tier).
 * Featured image includes Claude logo as reference input.
 *
 * Usage: GEMINI_API_KEY=xxx SANITY_TOKEN=xxx node content/scripts/post2Images.mjs [--dry-run]
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { IMAGE_STYLES, buildPrompt } from './imageStyles.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..', 'blogImages', 'is-claude-free-pricing-every-tier');
const DRY_RUN = process.argv.includes('--dry-run');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SANITY_TOKEN = process.env.SANITY_TOKEN;
const DOC_ID = 'p3wlPt7vRYboGM0QrAKWjx';
const CLAUDE_LOGO_PATH = '/Users/rahullalia/Downloads/claude-color.png';

if (!GEMINI_API_KEY) { console.error('Set GEMINI_API_KEY env var'); process.exit(1); }
if (!SANITY_TOKEN) { console.error('Set SANITY_TOKEN env var'); process.exit(1); }

const PROJECT_ID = 'yz25oyux';
const DATASET = 'production';

let kc = 0;
const k = () => `img2_${Date.now().toString(36)}${(kc++).toString(36)}`;

// Image specs
// Styles rotation: Post 0 used napkinSketch/whiteboardMarker/processArrows/dashboardSketch
// Drop used splitScreen/stickyNote/notebookPencil
// Post 1 used feltTipClean/metricViz/indexCard
// Post 2: minimalFlat (never used), napkinSketch, processArrows for inlines
const INLINE_IMAGES = [
  {
    style: 'minimalFlat',
    subject: 'pricing tier comparison',
    details: 'four rectangles in a row increasing in height from left to right, labeled FREE PRO MAX MAX, each with a hand-written dollar amount ($0 $20 $100 $200), the tallest one circled with a checkmark, muted blue and warm gray colors only',
    alt: 'Hand-drawn comparison of Claude pricing tiers from Free to Max showing increasing value',
    caption: 'Four tiers. Same AI. The difference is how long you can use it before hitting the wall.',
    afterH2Index: 1, // After "The $20 Pro plan"
  },
  {
    style: 'napkinSketch',
    subject: 'ROI calculation on a napkin',
    details: 'simple math written on a napkin: "$200/mo" at top, then "saves 2 hrs/day", then "$70-150/hr x 2 = $140-300/day", then "pays for itself in < 2 days" circled at bottom, with a small arrow pointing to "28 days = pure margin"',
    alt: 'Napkin sketch showing the ROI math for Claude Max subscription: $200 per month pays for itself in under 2 days',
    caption: 'The napkin math that made the $200 decision obvious.',
    afterH2Index: 3, // After "Max at $100 and $200"
  },
  {
    style: 'processArrows',
    subject: 'decision flowchart',
    details: 'a simple decision tree starting with "USE CLAUDE?" at top, branching into "exploring? -> FREE", "business use? -> PRO $20", "dev hitting limits? -> MAX $100", "living in it? -> MAX $200", "building products? -> API", arrows connecting each decision, bold black marker style',
    alt: 'Decision flowchart showing which Claude plan to pick based on your use case',
    caption: 'Start with Pro. Upgrade when the limits start costing you more than the subscription.',
    afterH2Index: 6, // After "How Claude stacks up" (before "Which plan")
  },
];

async function generateImage(prompt, referenceImageBase64 = null) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI_API_KEY}`;

  const parts = [{ text: prompt }];
  if (referenceImageBase64) {
    parts.push({
      inlineData: {
        mimeType: 'image/png',
        data: referenceImageBase64,
      },
    });
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${err}`);
  }

  const data = await response.json();
  const rparts = data.candidates?.[0]?.content?.parts || [];
  const imagePart = rparts.find(p => p.inlineData?.mimeType?.startsWith('image/'));

  if (!imagePart) throw new Error('No image returned from Gemini');

  return {
    base64: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType,
  };
}

async function uploadToSanity(buffer, filename) {
  const url = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/assets/images/${DATASET}?filename=${filename}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'image/png',
      Authorization: `Bearer ${SANITY_TOKEN}`,
    },
    body: buffer,
  });
  if (!res.ok) throw new Error(`Sanity upload failed: ${await res.text()}`);
  const data = await res.json();
  return data.document._id;
}

async function patchBody(imageBlocks) {
  // Fetch current body
  const queryUrl = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${DATASET}?query=${encodeURIComponent(`*[_id == "${DOC_ID}"][0]{body}`)}`;
  const qRes = await fetch(queryUrl, { headers: { Authorization: `Bearer ${SANITY_TOKEN}` } });
  const qData = await qRes.json();
  const body = qData.result?.body;
  if (!body) throw new Error('No body found');

  // Find H2 positions
  const h2Indices = [];
  body.forEach((block, idx) => {
    if (block._type === 'block' && block.style === 'h2') {
      const text = block.children?.map(c => c.text).join('') || '';
      h2Indices.push({ idx, text });
    }
  });

  console.log('\n  H2 positions:');
  h2Indices.forEach((h, i) => console.log(`    ${i}: ${h.text}`));

  // Insert images in reverse order to preserve indices
  const finalBody = [...body];
  const sorted = [...imageBlocks].sort((a, b) => b.afterH2Index - a.afterH2Index);

  for (const imgBlock of sorted) {
    const h2 = h2Indices[imgBlock.afterH2Index];
    if (!h2) {
      console.log(`    WARNING: H2 index ${imgBlock.afterH2Index} not found`);
      continue;
    }
    const nextH2Idx = imgBlock.afterH2Index + 1 < h2Indices.length
      ? h2Indices[imgBlock.afterH2Index + 1].idx
      : finalBody.length;

    const { afterH2Index, ...cleanBlock } = imgBlock;
    finalBody.splice(nextH2Idx, 0, cleanBlock);
    console.log(`    Inserted after "${h2.text}" (position ${nextH2Idx})`);
  }

  // Patch
  const mutateUrl = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}`;
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
  if (result.error) throw new Error(`Patch failed: ${JSON.stringify(result.error)}`);
  console.log(`  Patched body: ${finalBody.length} blocks. Transaction: ${result.transactionId}`);
}

async function run() {
  console.log(`\n${'='.repeat(60)}`);
  console.log('Post 2: Generate Featured + 3 Inline Images');
  console.log(`  Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  console.log(`${'='.repeat(60)}\n`);

  mkdirSync(OUTPUT_DIR, { recursive: true });

  // --- FEATURED IMAGE ---
  console.log('=== FEATURED IMAGE ===');
  const claudeLogoBase64 = readFileSync(CLAUDE_LOGO_PATH).toString('base64');
  const featuredPrompt = 'Create a clean, modern blog header image (16:9 landscape ratio, 1408x768 pixels). The image should feature the attached Claude AI logo (the orange starburst/asterisk shape) prominently centered, surrounded by hand-drawn pricing elements: dollar signs, tier labels ($0, $20, $100, $200) in a stepped arrangement, simple bar chart shapes showing increasing value. Style: minimal, tech-forward, dark slate background (#0F172A) with the orange logo as the focal point, white and light blue (#00C2FF) hand-drawn sketch elements around it. No photorealistic elements. Clean and editorial, like a premium tech blog header.';

  if (DRY_RUN) {
    console.log(`  [DRY RUN] Would generate featured image`);
    console.log(`  Prompt: ${featuredPrompt.substring(0, 120)}...`);
  } else {
    console.log('  Generating featured image with Claude logo reference...');
    const featured = await generateImage(featuredPrompt, claudeLogoBase64);
    const featuredFilename = 'featured-claude-pricing.png';
    const featuredBuffer = Buffer.from(featured.base64, 'base64');
    writeFileSync(join(OUTPUT_DIR, featuredFilename), featuredBuffer);
    console.log(`  Saved: ${featuredFilename}`);

    // Upload to Sanity
    const featuredAssetId = await uploadToSanity(featuredBuffer, featuredFilename);
    console.log(`  Uploaded: ${featuredAssetId}`);

    // Patch featured image onto doc
    const mutateUrl = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}`;
    const res = await fetch(mutateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SANITY_TOKEN}`,
      },
      body: JSON.stringify({
        mutations: [{
          patch: {
            id: DOC_ID,
            set: {
              featuredImage: {
                _type: 'image',
                alt: 'Claude AI pricing tiers from free to $200 per month Max plan',
                asset: { _type: 'reference', _ref: featuredAssetId },
              },
            },
          },
        }],
      }),
    });
    const result = await res.json();
    console.log(`  Featured image patched. Transaction: ${result.transactionId || 'check result'}`);
  }

  // Small delay
  if (!DRY_RUN) await new Promise(r => setTimeout(r, 3000));

  // --- INLINE IMAGES ---
  console.log('\n=== INLINE IMAGES ===');
  const imageBlocks = [];

  for (let i = 0; i < INLINE_IMAGES.length; i++) {
    const img = INLINE_IMAGES[i];
    const prompt = buildPrompt(img.style, img.subject, img.details);

    console.log(`\n  Image ${i + 1}/3: ${img.style} (${IMAGE_STYLES[img.style].name})`);
    console.log(`    Prompt: ${prompt.substring(0, 120)}...`);

    if (DRY_RUN) {
      console.log('    [DRY RUN] Would generate and upload');
      imageBlocks.push({
        _type: 'image',
        _key: k(),
        alt: img.alt,
        caption: img.caption,
        size: 'full',
        aspectRatio: '1:1',
        asset: { _type: 'reference', _ref: 'placeholder' },
        afterH2Index: img.afterH2Index,
      });
      continue;
    }

    const { base64 } = await generateImage(prompt);
    const filename = `inline-${i + 1}-${img.style}.png`;
    const buffer = Buffer.from(base64, 'base64');
    writeFileSync(join(OUTPUT_DIR, filename), buffer);
    console.log(`    Saved: ${filename}`);

    const assetId = await uploadToSanity(buffer, filename);
    console.log(`    Uploaded: ${assetId}`);

    imageBlocks.push({
      _type: 'image',
      _key: k(),
      alt: img.alt,
      caption: img.caption,
      size: 'full',
      aspectRatio: '1:1',
      asset: { _type: 'reference', _ref: assetId },
      afterH2Index: img.afterH2Index,
    });

    if (i < INLINE_IMAGES.length - 1) await new Promise(r => setTimeout(r, 3000));
  }

  // Patch inline images into body
  if (!DRY_RUN && imageBlocks.length > 0) {
    console.log('\n=== PATCHING BODY ===');
    await patchBody(imageBlocks);
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('DONE');
  console.log(`${'='.repeat(60)}\n`);
}

run().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
