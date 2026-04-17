/**
 * tier5BlogImages.mjs
 *
 * Generates 3 inline images for each of the 6 Tier 5 (Nov 2025) blog posts.
 * These posts were fully rewritten but have zero inline images.
 *
 * Uses Gemini gemini-2.5-flash-image for generation, uploads to Sanity CDN,
 * and patches body to insert image blocks after target H2s.
 *
 * Usage:
 *   node scripts/tier5BlogImages.mjs              # all 6 posts
 *   node scripts/tier5BlogImages.mjs --post 3     # single post by number (1-6)
 *   node scripts/tier5BlogImages.mjs maps          # single post by slug fragment
 */

import { createClient } from '@sanity/client';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getStyleRotation, buildPrompt } from './imageStyles.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..', 'generated-images');

// --- Config ---
const GEMINI_API_KEY = readFileSync(join(__dirname, '..', '.env'), 'utf-8')
  .split('\n')
  .find(line => line.startsWith('GEMINI_API_KEY='))
  ?.split('=').slice(1).join('=')
  ?.trim();

const SANITY_TOKEN = readFileSync('/Users/rahullalia/lalia/4-Resources/mcp/sanity.env', 'utf-8')
  .split('\n')
  .find(line => line.startsWith('SANITY_API_TOKEN_V2='))
  ?.split('=')[1]
  ?.trim();

if (!SANITY_TOKEN) throw new Error('Missing SANITY_API_TOKEN_V2 in sanity.env');

const sanity = createClient({
  projectId: 'yz25oyux',
  dataset: 'production',
  token: SANITY_TOKEN,
  apiVersion: '2025-03-01',
  useCdn: false,
});

// --- Blog Configs (6 Tier 5 posts) ---
// Style rotation starts at blogIndex 30 to avoid overlapping with existing posts
const BLOGS = [
  {
    postNum: 1,
    title: 'How AI Is Transforming Marketing Automation in 2026',
    slug: 'ai-marketing-automation-2026',
    docId: '4h6ZovbNJGIiFWW2xZX83M',
    images: [
      {
        name: 'lead-scoring',
        afterH2Key: 'accc812c96dd',
        subject: 'AI lead scoring funnel',
        details: 'a funnel with leads entering the top labeled "All Leads", AI brain icon in the middle sorting them, hot leads coming out bottom-left with fire icon, cold leads going right with snowflake. Numbers "87% accuracy" written beside it',
        alt: 'Hand-drawn sketch of an AI lead scoring funnel sorting hot and cold leads',
        caption: 'AI lead scoring separates high-intent leads from tire-kickers automatically.',
      },
      {
        name: 'personalization-scale',
        afterH2Key: '853ce49aa498',
        subject: 'AI marketing cost breakdown',
        details: 'a simple bar chart comparing monthly costs: "Manual" bar at $4,500, "AI + Tools" bar at $1,200, savings arrow between them labeled "73% less". Dollar signs and a calculator icon',
        alt: 'Hand-drawn bar chart comparing manual vs AI marketing automation costs',
        caption: 'The cost difference between manual marketing and AI-powered automation.',
      },
      {
        name: 'implementation-steps',
        afterH2Key: 'e1861770d5d7',
        subject: 'AI marketing implementation roadmap',
        details: 'a horizontal process flow with 4 boxes connected by arrows: "Audit Current Stack" -> "Pick AI Tools" -> "Migrate Data" -> "Automate Workflows". Each box has a small icon inside (magnifying glass, tools, database, gear). A timeline below showing "Week 1-2-3-4"',
        alt: 'Hand-drawn process flow showing 4 steps to implement AI marketing automation',
        caption: 'A realistic implementation timeline for adding AI to your marketing stack.',
      },
    ],
  },
  {
    postNum: 2,
    title: 'Top No-Code Tools for Marketing Agencies in 2026',
    slug: 'top-no-code-tools-for-marketers-2026',
    docId: '4h6ZovbNJGIiFWW2xZX8Vh',
    images: [
      {
        name: 'landing-pages',
        afterH2Key: '055a76141ef2',
        subject: 'no-code landing page builder comparison',
        details: 'a simple comparison table with 3 columns for tools, rows for features like "Drag and Drop", "A/B Testing", "Speed". Checkmarks and X marks in cells. Tool names across top. Clean wireframe style',
        alt: 'Hand-drawn comparison table of no-code landing page builders',
        caption: 'Not all no-code builders are created equal. Features that matter most for agencies.',
      },
      {
        name: 'automation-tools',
        afterH2Key: 'a90b0e97340a',
        subject: 'marketing automation workflow',
        details: 'a branching workflow diagram with a trigger event at top (envelope icon labeled "New Lead"), decision diamond "Score > 70?", two paths: Yes arrow to "Auto Nurture Sequence" and No arrow to "Manual Review". Icons for each step',
        alt: 'Hand-drawn workflow diagram showing automated lead nurturing decision tree',
        caption: 'A typical no-code automation workflow for lead nurturing.',
      },
      {
        name: 'implementation',
        afterH2Key: 'd971fee1362c',
        subject: 'agency tool stack layers',
        details: 'a layered stack diagram showing 4 horizontal layers from bottom to top: "CRM Foundation" at base, "Automation Layer" above it, "Analytics Layer" next, "Client Dashboards" on top. Arrows connecting layers. Simple clean boxes',
        alt: 'Hand-drawn diagram showing the four layers of an agency no-code tool stack',
        caption: 'Build your agency stack in layers, starting with the CRM foundation.',
      },
    ],
  },
  {
    postNum: 3,
    title: 'Boost Support with Conversational AI: A Complete Guide',
    slug: 'boost-support-with-conversational-ai',
    docId: '4h6ZovbNJGIiFWW2xZX5xo',
    images: [
      {
        name: 'ai-setup',
        afterH2Key: '211713066b57',
        subject: 'conversational AI architecture',
        details: 'a simple diagram showing a customer icon on the left, speech bubbles going to a chatbot icon in the center, the chatbot connected to three boxes: "Knowledge Base", "CRM", "Calendar". Arrows showing data flow both ways',
        alt: 'Hand-drawn diagram of conversational AI architecture connecting chatbot to CRM and knowledge base',
        caption: 'A good conversational AI setup connects to your existing systems.',
      },
      {
        name: 'results-metrics',
        afterH2Key: '46bfed6f6508',
        subject: 'conversational AI results dashboard',
        details: 'a simple dashboard with 4 metric boxes: "Response Time: 8sec" with down arrow, "Resolution Rate: 73%" with up arrow, "Customer Satisfaction: 4.6 stars", "Cost per Ticket: $2.40" with down arrow. Before/after comparison arrows',
        alt: 'Hand-drawn dashboard showing conversational AI performance metrics',
        caption: 'Typical results after 90 days of conversational AI implementation.',
      },
      {
        name: 'cost-breakdown',
        afterH2Key: '78efb48a7888',
        subject: 'conversational AI cost comparison',
        details: 'a split comparison with left side "Human Agent" showing salary $3,500/mo, training $500, limited hours icon, and right side "AI + Human Hybrid" showing AI $200/mo, human $2,000/mo for escalations only, 24/7 icon. Total at bottom of each',
        alt: 'Hand-drawn split comparison of human-only vs AI hybrid support costs',
        caption: 'The hybrid model costs less and covers more hours than human-only support.',
      },
    ],
  },
  {
    postNum: 4,
    title: 'Google Business Profile Optimization Guide (Complete 2026)',
    slug: 'google-business-profile-optimization-guide-2026',
    docId: 'r5ze5pNXPqeIpD1SeOF5WP',
    images: [
      {
        name: 'gbp-setup',
        afterH2Key: '894d1a435c83',
        subject: 'Google Business Profile setup checklist',
        details: 'a checklist on paper with items: "Business Name (exact match)", "Primary Category", "Phone Number", "Address", "Hours", "Description (750 chars)", "Photos (10+)". Checkboxes next to each, some checked. A pen beside the list',
        alt: 'Hand-drawn checklist for Google Business Profile setup essentials',
        caption: 'The GBP setup checklist. Every field matters for ranking.',
      },
      {
        name: 'optimization-priority',
        afterH2Key: '274bd4eb2498',
        subject: 'GBP optimization priority matrix',
        details: 'a 2x2 grid matrix with axes "Impact" (vertical, low to high) and "Effort" (horizontal, low to high). Items placed in quadrants: "Categories" and "NAP" in high impact/low effort (star them), "Photos" and "Posts" in high impact/medium effort, "Q&A" in low impact/low effort. Circle the high-impact/low-effort quadrant',
        alt: 'Hand-drawn priority matrix showing GBP optimization tasks by impact and effort',
        caption: 'Start with high-impact, low-effort optimizations like categories and NAP consistency.',
      },
      {
        name: 'advanced-strategies',
        afterH2Key: 'a92f80457271',
        subject: 'GBP ranking signals diagram',
        details: 'a central circle labeled "GBP Ranking" with 5 arrows pointing inward from surrounding elements: "Reviews (velocity + rating)", "Citations (NAP consistency)", "Website SEO", "Google Posts", "Photos + Engagement". Size of arrows showing relative importance, reviews arrow being the biggest',
        alt: 'Hand-drawn diagram showing the five key signals that affect GBP ranking',
        caption: 'Reviews carry the most weight, but all five signals work together.',
      },
    ],
  },
  {
    postNum: 5,
    title: 'Complete SEO Audit Guide: 16 Essential Steps',
    slug: 'complete-seo-audit-guide',
    docId: 'r5ze5pNXPqeIpD1SeOF4h7',
    images: [
      {
        name: 'technical-audit',
        afterH2Key: 'e10fc645316f',
        subject: 'website speed test results',
        details: 'a simple speedometer/gauge drawing showing page load time. Needle pointing to "3.2s" in the yellow zone. Zones marked: green "Under 2s", yellow "2-4s", red "Over 4s". Below it: "Mobile: 4.1s" with sad face, "Desktop: 1.8s" with happy face',
        alt: 'Hand-drawn page speed gauge showing mobile vs desktop load times',
        caption: 'Mobile speed is what Google actually measures. Most sites fail here.',
      },
      {
        name: 'content-audit',
        afterH2Key: '47377e3eeec1',
        subject: 'keyword cannibalization diagram',
        details: 'two web page icons both targeting the same keyword "best crm software" with arrows pointing at each other. A confused Google logo in the middle with question marks. Below: "Fix: merge into one authoritative page" with an arrow pointing to a single combined page',
        alt: 'Hand-drawn diagram showing keyword cannibalization between two pages competing for the same term',
        caption: 'When two pages target the same keyword, neither ranks well.',
      },
      {
        name: 'backlink-audit',
        afterH2Key: '56b9791b5a17',
        subject: 'backlink profile health check',
        details: 'a pie chart showing backlink quality distribution: "High Quality (DA 50+): 15%", "Medium (DA 20-50): 45%", "Low Quality (DA under 20): 30%", "Toxic/Spam: 10%". An arrow pointing to the toxic slice with "Disavow these" written beside it',
        alt: 'Hand-drawn pie chart showing typical backlink profile quality distribution',
        caption: 'A healthy backlink profile. The toxic 10% needs a disavow file.',
      },
    ],
  },
  {
    postNum: 6,
    title: 'How to Rank Higher on Google Maps in 2026',
    slug: 'how-to-rank-higher-on-google-maps',
    docId: 'r5ze5pNXPqeIpD1SeOF5dF',
    images: [
      {
        name: 'ranking-factors',
        afterH2Key: '3059a9aaa33c',
        subject: 'Google Maps ranking factors',
        details: 'a Venn diagram with three overlapping circles labeled "Relevance", "Distance", and "Prominence". The center overlap labeled "Map Pack #1". Inside each circle: Relevance has "Categories, Description, Posts", Distance has "Address, Service Area", Prominence has "Reviews, Citations, Links"',
        alt: 'Hand-drawn Venn diagram of the three Google Maps ranking factors: relevance, distance, and prominence',
        caption: 'The three factors Google uses to rank local businesses on Maps.',
      },
      {
        name: 'review-system',
        afterH2Key: 'b208637aa384',
        subject: 'automated review generation flow',
        details: 'a horizontal process flow: "Service Complete" -> "SMS sent (1 hour later)" -> "Customer clicks link" -> "Leaves Google Review". A branch from step 2: "No response after 48hrs" -> "One follow-up SMS". Numbers beside each step: "85% open rate", "32% conversion"',
        alt: 'Hand-drawn process flow of an automated review generation system via SMS',
        caption: 'The automated review system. Timing is everything.',
      },
      {
        name: 'local-seo-tactics',
        afterH2Key: '4f3bab6055ce',
        subject: 'local SEO citation consistency',
        details: 'a checklist showing the same business info across platforms: "Google: Joe Pizza, 123 Main St, 555-1234" with checkmark, "Yelp: Joe Pizza, 123 Main Street, 555-1234" with X mark (Street vs St mismatch circled), "Website: Joes Pizza, 123 Main St, 555-1234" with X mark (missing apostrophe circled). Big arrow pointing to "MUST MATCH EXACTLY"',
        alt: 'Hand-drawn example showing NAP inconsistencies across Google, Yelp, and a website',
        caption: 'Even small NAP differences hurt. "St" vs "Street" counts as a mismatch.',
      },
    ],
  },
];

// --- Gemini Image Generation ---
async function generateImage(prompt) {
  if (!GEMINI_API_KEY) throw new Error('Missing GEMINI_API_KEY in sanity.env');
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

  if (!imagePart) {
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
  console.log(`    Uploaded: ${asset._id}`);
  return asset;
}

// --- Sanity Mutation Helper ---
async function mutate(mutations) {
  const response = await fetch(
    `https://yz25oyux.api.sanity.io/v2025-03-01/data/mutate/production`,
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
  return response.json();
}

// --- Insert Inline Image ---
async function insertBodyImage(docId, assetId, altText, caption, afterKey) {
  const doc = await sanity.fetch(`*[_id == $id][0]{body}`, { id: docId }, { perspective: 'raw' });
  if (!doc?.body) throw new Error(`No body found for ${docId}`);

  const insertIndex = doc.body.findIndex(b => b._key === afterKey);
  if (insertIndex === -1) throw new Error(`Block key ${afterKey} not found in body of ${docId}`);

  const imageBlock = {
    _type: 'image',
    _key: `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    alt: altText,
    caption,
    size: 'full',
    aspectRatio: '1:1',
    asset: { _type: 'reference', _ref: assetId },
  };

  const newBody = [...doc.body];
  newBody.splice(insertIndex + 1, 0, imageBlock);

  await mutate([{ patch: { id: docId, set: { body: newBody } } }]);
  console.log(`    Inline image inserted after block ${afterKey}`);
}

// --- Save locally ---
function saveLocally(base64, filename) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const filepath = join(OUTPUT_DIR, filename);
  writeFileSync(filepath, Buffer.from(base64, 'base64'));
  console.log(`    Saved: ${filepath}`);
  return filepath;
}

// --- Process a single blog ---
async function processBlog(config) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`[${config.postNum}] ${config.title}`);
  console.log(`${'='.repeat(60)}`);

  // Get style rotation (offset by 30 to avoid clashing with existing post styles)
  const styles = getStyleRotation(30 + config.postNum, 3);

  for (let i = 0; i < config.images.length; i++) {
    const image = config.images[i];
    const styleKey = styles[i];
    console.log(`\n  [${i + 1}/${config.images.length}] ${image.name} (style: ${styleKey})...`);

    const prompt = buildPrompt(styleKey, image.subject, image.details);

    try {
      const { base64, mimeType } = await generateImage(prompt);
      const ext = mimeType.includes('png') ? 'png' : 'jpg';
      const filename = `${config.slug}-${image.name}.${ext}`;

      saveLocally(base64, filename);

      const buffer = Buffer.from(base64, 'base64');
      const asset = await uploadToSanity(buffer, filename);

      await insertBodyImage(config.docId, asset._id, image.alt, image.caption, image.afterH2Key);

      console.log(`  Done: ${image.name}`);
    } catch (err) {
      console.error(`  ERROR on ${image.name}: ${err.message}`);
    }

    // Small delay between images to avoid rate limiting
    if (i < config.images.length - 1) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

// --- Main ---
async function main() {
  const args = process.argv.slice(2);

  let blogsToProcess = BLOGS;

  if (args.includes('--post')) {
    const postNum = parseInt(args[args.indexOf('--post') + 1]);
    blogsToProcess = BLOGS.filter(b => b.postNum === postNum);
    if (blogsToProcess.length === 0) {
      console.error(`No post found with number ${postNum}`);
      process.exit(1);
    }
  } else if (args.length > 0 && !args[0].startsWith('--')) {
    const fragment = args[0].toLowerCase();
    blogsToProcess = BLOGS.filter(b => b.slug.includes(fragment));
    if (blogsToProcess.length === 0) {
      console.error(`No post found matching "${fragment}"`);
      process.exit(1);
    }
  }

  console.log(`Processing ${blogsToProcess.length} blog(s)...`);

  for (const blog of blogsToProcess) {
    await processBlog(blog);
  }

  console.log('\n\nAll done!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
