/**
 * generateBlogImages.mjs
 *
 * Generates napkin-sketch style images using Gemini API,
 * uploads them to Sanity, and patches blog posts.
 *
 * Usage: node scripts/generateBlogImages.mjs
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..', 'generated-images');

// --- Config ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SANITY_PROJECT_ID = 'yz25oyux';
const SANITY_DATASET = 'production';
// Read Sanity token from mcp env backup
const SANITY_TOKEN = readFileSync('/Users/rahullalia/lalia/4-Resources/mcp/sanity.env', 'utf-8')
  .split('\n')
  .find(line => line.startsWith('SANITY_API_TOKEN_V2='))
  ?.split('=')[1]
  ?.trim();

if (!GEMINI_API_KEY) throw new Error('Missing GEMINI_API_KEY in .env');
if (!SANITY_TOKEN) throw new Error('Missing SANITY_API_TOKEN_V2 in sanity.env');

const sanity = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_TOKEN,
  apiVersion: '2025-03-01',
  useCdn: false,
});

// --- Gemini Image Generation ---
async function generateImage(prompt, aspectRatio = '16:9') {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${err}`);
  }

  const data = await response.json();

  // Extract image from response
  const parts = data.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find(p => p.inlineData?.mimeType?.startsWith('image/'));

  if (!imagePart) {
    console.log('Response parts:', JSON.stringify(parts.map(p => ({ text: p.text?.slice(0, 100), hasImage: !!p.inlineData })), null, 2));
    throw new Error('No image returned from Gemini');
  }

  return {
    base64: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType,
  };
}

// --- Sanity Upload ---
async function uploadToSanity(imageBuffer, filename) {
  const asset = await sanity.assets.upload('image', imageBuffer, {
    filename,
    contentType: 'image/png',
  });
  console.log(`  Uploaded: ${asset._id} (${asset.metadata?.dimensions?.width}x${asset.metadata?.dimensions?.height})`);
  return asset;
}

// --- Patch Featured Image ---
async function setFeaturedImage(docId, assetId, altText) {
  // Use HTTP API to patch the draft directly
  const mutations = [{
    patch: {
      id: docId,
      set: {
        featuredImage: {
          _type: 'image',
          alt: altText,
          asset: {
            _type: 'reference',
            _ref: assetId,
          },
        },
      },
    },
  }];

  const response = await fetch(
    `https://${SANITY_PROJECT_ID}.api.sanity.io/v2025-03-01/data/mutate/${SANITY_DATASET}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SANITY_TOKEN}`,
      },
      body: JSON.stringify({ mutations }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Sanity mutation error: ${err}`);
  }

  console.log(`  Featured image set on ${docId}`);
}

// --- Insert Inline Image into Body ---
async function insertBodyImage(docId, assetId, altText, caption, afterKey, size = 'full', aspectRatio = 'auto') {
  // Fetch current body to find insert position
  const doc = await sanity.fetch(`*[_id == $id][0]{body}`, { id: docId }, { perspective: 'raw' });
  if (!doc?.body) throw new Error(`No body found for ${docId}`);

  const insertIndex = doc.body.findIndex(b => b._key === afterKey);
  if (insertIndex === -1) throw new Error(`Block key ${afterKey} not found in body`);

  const imageBlock = {
    _type: 'image',
    _key: `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    alt: altText,
    caption,
    size,
    aspectRatio,
    asset: {
      _type: 'reference',
      _ref: assetId,
    },
  };

  // Insert after the target block using splice on the body array
  const newBody = [...doc.body];
  newBody.splice(insertIndex + 1, 0, imageBlock);

  const mutations = [{
    patch: {
      id: docId,
      set: { body: newBody },
    },
  }];

  const response = await fetch(
    `https://${SANITY_PROJECT_ID}.api.sanity.io/v2025-03-01/data/mutate/${SANITY_DATASET}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SANITY_TOKEN}`,
      },
      body: JSON.stringify({ mutations }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Sanity mutation error: ${err}`);
  }

  console.log(`  Inline image inserted after block ${afterKey}`);
}

// --- Save image locally for review ---
function saveLocally(base64, filename) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const filepath = join(OUTPUT_DIR, filename);
  writeFileSync(filepath, Buffer.from(base64, 'base64'));
  console.log(`  Saved locally: ${filepath}`);
  return filepath;
}

// --- Main ---
async function processBlog(config) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Blog: ${config.title}`);
  console.log(`${'='.repeat(60)}`);

  for (const image of config.images) {
    console.log(`\n  Generating: ${image.name}...`);
    console.log(`  Prompt: ${image.prompt.slice(0, 120)}...`);

    try {
      const { base64, mimeType } = await generateImage(image.prompt, image.aspectRatio);
      const ext = mimeType.includes('png') ? 'png' : 'jpg';
      const filename = `${config.slug}-${image.name}.${ext}`;

      // Save locally for review
      saveLocally(base64, filename);

      // Upload to Sanity
      const buffer = Buffer.from(base64, 'base64');
      const asset = await uploadToSanity(buffer, filename);

      // Patch document
      if (image.type === 'featured') {
        await setFeaturedImage(config.docId, asset._id, image.alt);
      } else if (image.type === 'inline') {
        await insertBodyImage(
          config.docId,
          asset._id,
          image.alt,
          image.caption,
          image.afterKey,
          image.size || 'full',
          image.displayAspectRatio || 'auto',
        );
      }

      console.log(`  Done: ${image.name}`);
    } catch (err) {
      console.error(`  ERROR generating ${image.name}:`, err.message);
    }

    // Small delay between generations
    await new Promise(r => setTimeout(r, 2000));
  }
}

// ============================================================
// BLOG CONFIGS - Add one per blog
// ============================================================

const BLOGS = [
  {
    title: 'GoHighLevel Pricing 2025: Complete Cost Breakdown',
    slug: 'gohighlevel-pricing-2025',
    docId: 'drafts.r5ze5pNXPqeIpD1SeOk0l9',
    images: [
      {
        name: 'featured',
        type: 'featured',
        aspectRatio: '16:9',
        alt: 'Hand-drawn napkin sketch showing GoHighLevel pricing tiers from $97 to $497 per month',
        prompt: `Simple hand-drawn sketch of a pricing breakdown for a software product, napkin sketch style, blue ballpoint pen on a crumpled white paper napkin, featuring three circles arranged left to right labeled "$97/mo", "$297/mo", "$497/mo" with arrows connecting them pointing right, small labels above each circle reading "Starter", "Unlimited", "SaaS Pro", a scribbled underline beneath the whole thing, minimal detail, spontaneous, authentic, raw texture, visible ink pressure, imperfect wobbly lines, slight coffee ring stain in the bottom right corner. No computer-generated text, all text should look hand-written. The sketch should look like someone quickly jotted this down during a meeting.`,
      },
      {
        name: 'cost-comparison',
        type: 'inline',
        alt: 'Hand-drawn sketch comparing GoHighLevel cost versus using multiple separate marketing tools',
        caption: 'One platform vs. a stack of subscriptions — the math speaks for itself.',
        afterKey: '84fa0eb0-a59', // After "This creates a $195-565 monthly expense..." paragraph
        size: 'large',
        displayAspectRatio: '16:9',
        prompt: `Simple hand-drawn sketch of a cost comparison, napkin sketch style, blue ballpoint pen on lined notebook paper, featuring two columns divided by a big hand-drawn "VS" in the middle. Left column shows one box labeled "GHL" with "$97-497/mo" below it with a checkmark. Right column shows a messy stack of 6 small boxes labeled "CRM $150", "Email $99", "Funnels $97", "Phone $75", "Calendar $45", "Social $99" with a line under them and "= $565+/mo" circled aggressively. Minimal detail, spontaneous, authentic, raw texture, visible ink pressure, imperfect wobbly lines. No computer-generated fonts, all text hand-written looking.`,
      },
    ],
  },
];

// --- Run ---
const blogSlug = process.argv[2];

if (blogSlug) {
  const blog = BLOGS.find(b => b.slug.includes(blogSlug));
  if (!blog) {
    console.error(`Blog not found: ${blogSlug}`);
    console.log('Available:', BLOGS.map(b => b.slug).join(', '));
    process.exit(1);
  }
  await processBlog(blog);
} else {
  // Process all
  for (const blog of BLOGS) {
    await processBlog(blog);
  }
}

console.log('\nAll done!');
