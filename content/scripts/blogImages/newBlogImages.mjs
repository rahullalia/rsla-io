/**
 * newBlogImages.mjs
 *
 * Generates images for 10 new editorial calendar blog posts
 * using Gemini API, uploads to Sanity, and patches drafts.
 *
 * Usage:
 *   node scripts/newBlogImages.mjs              # all posts
 *   node scripts/newBlogImages.mjs aeo-guide    # single post by slug fragment
 *   node scripts/newBlogImages.mjs --post 3     # single post by number (1-10)
 */

import { createClient } from '@sanity/client';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..', 'generated-images');

// --- Config ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SANITY_PROJECT_ID = 'yz25oyux';
const SANITY_DATASET = 'production';
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
  return response.json();
}

// --- Set Featured Image ---
async function setFeaturedImage(docId, assetId, altText) {
  await mutate([{
    patch: {
      id: docId,
      set: {
        featuredImage: {
          _type: 'image',
          alt: altText,
          asset: { _type: 'reference', _ref: assetId },
        },
      },
    },
  }]);
  console.log(`    Featured image set on ${docId}`);
}

// --- Insert Inline Image ---
async function insertBodyImage(docId, assetId, altText, caption, afterKey, size = 'full', aspectRatio = 'auto') {
  const doc = await sanity.fetch(`*[_id == $id][0]{body}`, { id: docId }, { perspective: 'raw' });
  if (!doc?.body) throw new Error(`No body found for ${docId}`);

  const insertIndex = doc.body.findIndex(b => b._key === afterKey);
  if (insertIndex === -1) throw new Error(`Block key ${afterKey} not found in body of ${docId}`);

  const imageBlock = {
    _type: 'image',
    _key: `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    alt: altText,
    caption,
    size,
    aspectRatio,
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

  for (let i = 0; i < config.images.length; i++) {
    const image = config.images[i];
    console.log(`\n  [${i + 1}/${config.images.length}] ${image.name}...`);

    try {
      const { base64, mimeType } = await generateImage(image.prompt);
      const ext = mimeType.includes('png') ? 'png' : 'jpg';
      const filename = `${config.slug}-${image.name}.${ext}`;

      saveLocally(base64, filename);

      const buffer = Buffer.from(base64, 'base64');
      const asset = await uploadToSanity(buffer, filename);

      if (image.type === 'featured') {
        await setFeaturedImage(config.docId, asset._id, image.alt);
      } else if (image.type === 'inline') {
        await insertBodyImage(
          config.docId, asset._id, image.alt, image.caption,
          image.afterKey, image.size || 'full', image.displayAspectRatio || 'auto'
        );
      }

      console.log(`  Done: ${image.name}`);
    } catch (err) {
      console.error(`  ERROR on ${image.name}:`, err.message);
    }

    // Rate limit between generations
    await new Promise(r => setTimeout(r, 3000));
  }
}

// ============================================================
// BLOG CONFIGS — 10 posts
// ============================================================

const BLOGS = [
  // ── Post 1: AEO Guide ────────────────────────────────
  {
    postNum: 1,
    title: 'What Is Answer Engine Optimization? The Business Owner\'s Guide to AEO',
    slug: 'answer-engine-optimization-aeo-guide',
    docId: 'drafts.6bf6c6a8-ed83-429c-8136-2a684390dfc6',
    images: [
      {
        name: 'featured',
        type: 'featured',
        alt: 'Hand drawn napkin sketch showing the shift from Google search to AI answer engines like ChatGPT, Gemini, and Perplexity',
        prompt: 'Simple concept diagram showing the shift from traditional search to AI search, napkin sketch style, blue ballpoint pen on a crumpled white paper napkin, spontaneous, authentic, raw texture, visible ink pressure, imperfect wobbly lines, featuring a Google logo with an arrow pointing to icons of ChatGPT, Gemini, and Perplexity with a question mark above a small business icon. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-1-zero-click',
        type: 'inline',
        alt: 'Hand drawn bar chart showing zero click searches rising from 56 percent in 2024 to 69 percent in 2025',
        caption: '69% of Google searches now end without a click. That number is only going up.',
        afterKey: 'c1ee1ec0d24d', // After "What is answer engine optimization (AEO)?" h2
        size: 'large',
        displayAspectRatio: '16:9',
        prompt: 'Simple data visualization showing zero-click search growth, hand-drawn data visualization, minimalist bar chart sketch, blue and black ink on graph paper, numbers written by hand, axis labels hand-written, imperfect grid lines, authentic data napkin math feel, featuring two bars labeled "2024" at 56% and "2025" at 69% with "Zero-Click Searches" as the title, an upward arrow between them. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-2-audit-flow',
        type: 'inline',
        alt: 'Hand drawn process flow showing four steps of an AEO audit: FAQ schema, GBP optimization, content structuring, and monitoring AI citations',
        caption: 'The AEO starter checklist. Four steps you can do this week.',
        afterKey: 'a356bd0abe62', // After "AI tools pull from" paragraph
        size: 'full',
        displayAspectRatio: '16:9',
        prompt: 'Simple AEO audit checklist flow, hand-drawn horizontal process flow, thick arrows connecting simple labeled boxes from left to right, numbered steps, black marker on white paper, bold and simple, imperfect hand-drawn, looks like a quick planning sketch, featuring four boxes: "1. FAQ Schema" arrow to "2. GBP Optimize" arrow to "3. Structure Content" arrow to "4. Monitor AI Citations". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-3-before-after',
        type: 'inline',
        alt: 'Hand drawn split screen comparing traditional Google blue links on the left with an AI generated answer with citation on the right',
        caption: 'What your customer sees is changing. The question is whether your business shows up in the new format.',
        afterKey: '2a8693b955d9', // After last block
        size: 'full',
        displayAspectRatio: '16:9',
        prompt: 'Simple before and after comparison of search results, hand-drawn split comparison, divided by a thick hand-drawn vertical line down the center, left side labeled "BEFORE" right side labeled "AFTER", contrasting sketches on each side, blue ballpoint pen on white paper, imperfect wobbly lines, featuring left side showing "10 blue links" with small rectangles stacked, right side showing "AI Answer" with a chat bubble and a small citation link. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
    ],
  },

  // ── Post 2: AI Replacing Google Traffic ───────────────
  {
    postNum: 2,
    title: 'How AI Is Replacing Your Google Traffic',
    slug: 'ai-replacing-google-traffic',
    docId: 'drafts.caa4e10f-ced2-4249-afcf-c6104b81d1af',
    images: [
      {
        name: 'featured',
        type: 'featured',
        alt: 'Whiteboard sketch showing Google organic traffic declining while AI search traffic rises, crossing in 2026',
        prompt: 'Simple dramatic visualization of traffic decline, quick whiteboard sketch, dry erase markers in blue and red on a slightly smudged white whiteboard, marker streaks visible, imperfect hand-drawn, looks like a team brainstorm session, featuring a line graph going down with "Google Traffic" label, and a rising line labeled "AI Search" crossing it, with a big circled "2026" at the intersection point. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-1-dashboard',
        type: 'inline',
        alt: 'Hand drawn dashboard sketch showing declining website sessions and clicks while impressions stay flat',
        caption: 'This is what most business owners see in their analytics. Impressions are there. Clicks are vanishing.',
        afterKey: '001c0cb37a1b', // After Gartner stat paragraph
        size: 'large',
        displayAspectRatio: '16:9',
        prompt: 'Simple analytics dashboard showing traffic drop, hand-drawn dashboard mockup, pencil on white paper, showing rough boxes with numbers inside, sparkline sketches, percentage indicators, minimal wireframe feel, imperfect hand-drawn UI elements, featuring a main line chart trending down with "-25%" label, side boxes showing "Sessions: Down", "Clicks: Down", "Impressions: Flat", resembling a Google Analytics screen. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-2-ai-sources',
        type: 'inline',
        alt: 'Napkin sketch showing five sources AI engines pull from: schema data, reviews, FAQ content, authority links, and Google Business Profile',
        caption: 'AI engines don\'t guess. They pull from specific signals. Here\'s where to focus.',
        afterKey: '8ee0c27ebb28', // After "No, SEO isn't dead" h2
        size: 'full',
        displayAspectRatio: '16:9',
        prompt: 'Simple diagram of where AI gets its answers, napkin sketch style, blue ballpoint pen on a crumpled white paper napkin, spontaneous, authentic, raw texture, visible ink pressure, imperfect wobbly lines, featuring a central "AI Engine" bubble with arrows pointing in from "Schema Data", "Reviews", "FAQ Content", "Authority Links", and "GBP Profile". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-3-checklist',
        type: 'inline',
        alt: 'Yellow sticky note with a hand written five item checklist for adapting to AI search',
        caption: 'Your AI search survival checklist. Start here.',
        afterKey: 'c8f481344d75', // After "What smart businesses are doing" h2
        size: 'large',
        displayAspectRatio: 'auto',
        prompt: 'Simple action checklist for adapting to AI search, hand-drawn on a yellow sticky note, black felt tip marker, adhesive strip visible at top, slightly tilted on white desk, imperfect hand-written text, authentic raw feel, featuring a checklist with checkboxes: "Audit AI visibility", "Add FAQ schema", "Optimize GBP", "Track AI citations", "Structure for answers". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
    ],
  },

  // ── Post 3: AI Marketing Stack ────────────────────────
  {
    postNum: 3,
    title: 'The AI Marketing Stack We Actually Use (And What It Costs)',
    slug: 'ai-marketing-stack-what-we-use',
    docId: 'drafts.8e3131a7-dfa4-4dba-a1a6-c51f90d944fd',
    images: [
      {
        name: 'featured',
        type: 'featured',
        alt: 'Hand drawn split screen comparing a messy stack of eight marketing tools on the left with a clean integrated stack of five AI tools on the right',
        prompt: 'Simple before and after of an agency tool stack, hand-drawn split comparison, divided by a thick hand-drawn vertical line down the center, left side labeled "BEFORE" right side labeled "AFTER", contrasting sketches on each side, blue ballpoint pen on white paper, imperfect wobbly lines, featuring left side showing 7 to 8 scattered tool icons with dollar signs and tangled arrows between them, right side showing a clean stack of 4 to 5 tools in a neat column connected by straight arrows. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-1-costs',
        type: 'inline',
        alt: 'Hand drawn horizontal bar chart showing monthly costs for six AI marketing tools totaling roughly 386 dollars',
        caption: 'The full monthly cost. Under $400 for an AI stack that replaces three full time tools.',
        afterKey: '825119239bbd', // After "Total: $380/month" line
        size: 'large',
        displayAspectRatio: '16:9',
        prompt: 'Simple cost breakdown of AI tools, hand-drawn data visualization, minimalist bar chart sketch, blue and black ink on graph paper, numbers written by hand, axis labels hand-written, imperfect grid lines, authentic data napkin math feel, featuring horizontal bars with tool names and monthly costs: "Claude $20", "Gemini $20", "GHL $297", "Make $29", "Sanity $0", "Vercel $20" with a total line at the bottom. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-2-flowchart',
        type: 'inline',
        alt: 'Pencil sketch on notebook paper showing how Claude, Sanity, Vercel, Gemini, and GoHighLevel connect in the agency workflow',
        caption: 'How the stack actually connects. Claude is the brain. Everything else is an output channel.',
        afterKey: '4380959ce2f6', // After "How each tool earns its spot" h2
        size: 'full',
        displayAspectRatio: '16:9',
        prompt: 'Simple flowchart of how the tools connect, hand-drawn sketch, graphite pencil on lined notebook paper, visible pencil pressure, light eraser smudges, imperfect wobbly lines, authentic student notebook feel, featuring a vertical flowchart: "Claude (Build + Write)" arrow down to "Sanity (Publish)" arrow down to "Vercel (Deploy)", with a side branch from Claude to "Gemini (Research)" and another branch to "GHL (Deliver to Clients)". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-3-budget',
        type: 'inline',
        alt: 'Yellow sticky note showing three budget tiers for an AI marketing stack at 200, 400, and 800 dollars per month',
        caption: 'Start where you are. The $200 tier handles 80% of what most agencies need.',
        afterKey: '14ba3e0b82b3', // After "Sanity: the content backbone" h3
        size: 'large',
        displayAspectRatio: 'auto',
        prompt: 'Simple budget tier recommendation, hand-drawn on a yellow sticky note, black felt tip marker, adhesive strip visible at top, slightly tilted on white desk, imperfect hand-written text, authentic raw feel, featuring three tiers: "$200/mo: Claude + GHL Starter + Make", "$400/mo: Add Gemini + Sanity + Vercel", "$800/mo: Add GHL Pro + Scale". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
    ],
  },

  // ── Post 4: AEO for Local Businesses ──────────────────
  {
    postNum: 4,
    title: 'AEO for Local Businesses',
    slug: 'aeo-for-local-businesses',
    docId: 'drafts.f2e08fee-10fb-4503-b2bb-7402a7d5f864',
    images: [
      {
        name: 'featured',
        type: 'featured',
        alt: 'Yellow sticky note sketch of a phone asking AI for the best plumber nearby with some businesses getting recommended and others not',
        prompt: 'Simple concept of a phone asking AI for local recommendations, hand-drawn on a yellow sticky note, black felt tip marker, adhesive strip visible at top, slightly tilted on white desk, imperfect hand-written text, authentic raw feel, featuring a simple phone outline with a speech bubble saying "Best plumber near me?" and below it three small business icons with checkmarks and X marks. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-1-pillars',
        type: 'inline',
        alt: 'Hand drawn process flow showing five steps for local AEO: GBP profile, reviews, FAQ schema, local content, and citations',
        caption: 'The five pillars of local AEO. Start from the left and work your way across.',
        afterKey: 'e21f8b70c6c6', // After "The 5 pillars of local AEO" h2
        size: 'full',
        displayAspectRatio: '16:9',
        prompt: 'Simple local AEO optimization steps, hand-drawn horizontal process flow, thick arrows connecting simple labeled boxes from left to right, numbered steps, black marker on white paper, bold and simple, imperfect hand-drawn, looks like a quick planning sketch, featuring five boxes: "1. GBP Profile" arrow to "2. Reviews" arrow to "3. FAQ Schema" arrow to "4. Local Content" arrow to "5. Citations". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-2-disconnect',
        type: 'inline',
        alt: 'Whiteboard sketch comparing what AI search engines look for versus what most business owners actually focus on',
        caption: 'The disconnect. Most business owners are investing in the wrong column.',
        afterKey: '276dcd142af9', // After "Why local businesses need AEO" h2
        size: 'large',
        displayAspectRatio: '16:9',
        prompt: 'Simple comparison of what AI engines look for vs what business owners focus on, quick whiteboard sketch, dry erase markers in blue and red on a slightly smudged white whiteboard, marker streaks visible, imperfect hand-drawn, looks like a team brainstorm session, featuring two columns: blue column "What AI Looks For" listing "Structured data, Reviews, FAQ, Entity signals" and red column "What Owners Focus On" listing "Ads, Social posts, Website design, Logo". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-3-conversion',
        type: 'inline',
        alt: 'Hand drawn bar chart comparing conversion rates from Google clicks, Google Maps, and AI recommendations showing AI converts dramatically higher',
        caption: 'When AI recommends you, the customer already trusts you before they click.',
        afterKey: 'c2ea489be777', // After "Pillar 1" h2
        size: 'large',
        displayAspectRatio: '16:9',
        prompt: 'Simple data showing AI recommendation impact on local businesses, hand-drawn data visualization, minimalist bar chart sketch, blue and black ink on graph paper, numbers written by hand, axis labels hand-written, imperfect grid lines, authentic data napkin math feel, featuring three bars: "Google Click" converting at "2%", "Google Maps" at "5%", "AI Recommendation" at "23x" with a star next to it. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
    ],
  },

  // ── Post 5: Gemini Pricing ────────────────────────────
  {
    postNum: 5,
    title: 'Google Gemini for Business: Pricing, Plans, and What It Actually Does',
    slug: 'google-gemini-for-business-pricing-guide',
    docId: 'drafts.5268a16e-21c7-4e4f-bc02-51cff1c031cf',
    images: [
      {
        name: 'featured',
        type: 'featured',
        alt: 'Hand drawn pricing comparison chart showing Google Gemini free, business at 14 dollars per month, and enterprise at 22 dollars per month with feature checkmarks',
        prompt: 'Simple pricing tier comparison chart, hand-drawn data visualization, minimalist bar chart sketch, blue and black ink on graph paper, numbers written by hand, axis labels hand-written, imperfect grid lines, authentic data napkin math feel, featuring three columns labeled "Free", "Business $14/mo", "Enterprise $22/mo" with stacked feature checkmarks below each, progressively more checkmarks as you go right. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-1-vs-chatgpt',
        type: 'inline',
        alt: 'Hand drawn split screen comparing Gemini Business at 14 dollars per month bundled with Workspace versus ChatGPT Plus at 20 dollars standalone',
        caption: 'The price comparison everyone asks about. But price alone doesn\'t tell the whole story.',
        afterKey: '6282348471f4', // After "The three Gemini tiers" h2
        size: 'large',
        displayAspectRatio: '16:9',
        prompt: 'Simple comparison of Gemini vs ChatGPT pricing, hand-drawn split comparison, divided by a thick hand-drawn vertical line down the center, left side labeled "GEMINI" right side labeled "CHATGPT", contrasting sketches on each side, blue ballpoint pen on white paper, imperfect wobbly lines, featuring left side: "$14/mo, Workspace included, 27M users" and right side: "$20/mo, Standalone, 800M users" with circled price tags. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-2-workspace',
        type: 'inline',
        alt: 'Clean hand drawn diagram showing Gemini connected to Gmail, Docs, Sheets, Drive, and Calendar in Google Workspace',
        caption: 'This is Gemini\'s real advantage. It already lives where your team works.',
        afterKey: '3e4ca8a172ca', // After "Gemini Business" h3
        size: 'full',
        displayAspectRatio: '16:9',
        prompt: 'Simple diagram of Gemini Workspace integration, hand-drawn sketch, black felt tip pen on plain white paper, clean but imperfect lines, minimal style, no background texture, authentic hand-drawn feel, featuring a central "Gemini" circle with lines connecting to "Gmail", "Docs", "Sheets", "Drive", "Calendar" icons around it, showing native integration. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-3-recommendation',
        type: 'inline',
        alt: 'Yellow sticky note with hand written recommendations for which Google Gemini plan to choose based on team size',
        caption: 'The quick decision guide. Don\'t overthink this one.',
        afterKey: '1b2d363847b2', // After last block
        size: 'large',
        displayAspectRatio: 'auto',
        prompt: 'Simple recommendation for which plan to pick, hand-drawn on a yellow sticky note, black felt tip marker, adhesive strip visible at top, slightly tilted on white desk, imperfect hand-written text, authentic raw feel, featuring "Which plan?" at top, then "Solo freelancer → Free", "Small team (2-10) → Business", "Agency/Enterprise → Enterprise" with arrows between them. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
    ],
  },

  // ── Post 6: AI Lead Follow-Up System ──────────────────
  {
    postNum: 6,
    title: 'How to Build an AI Lead Follow-Up System That Books While You Sleep',
    slug: 'ai-lead-follow-up-system',
    docId: 'drafts.9ed10488-c1ce-4dc1-9e8f-b783ca3aa297',
    images: [
      {
        name: 'featured',
        type: 'featured',
        alt: 'Napkin sketch showing a lead message arriving at 11 PM being automatically responded to by AI while the business owner sleeps',
        prompt: 'Simple concept of leads coming in at night and getting auto-responded, napkin sketch style, blue ballpoint pen on a crumpled white paper napkin, spontaneous, authentic, raw texture, visible ink pressure, imperfect wobbly lines, featuring a clock showing 11 PM, a phone with a "New Lead!" notification, and an AI robot icon responding "I can help!" while a person sleeps (simple Z\'s above a bed). No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-1-flow',
        type: 'inline',
        alt: 'Hand drawn process flow showing five steps: lead arrives, AI responds in under 60 seconds, qualifies, books call, and updates CRM',
        caption: 'The full automation flow. Five steps, zero manual work.',
        afterKey: 'b6ce1a611402', // After "What an AI lead follow-up system actually does" h2
        size: 'full',
        displayAspectRatio: '16:9',
        prompt: 'Simple lead follow-up automation flow, hand-drawn horizontal process flow, thick arrows connecting simple labeled boxes from left to right, numbered steps, black marker on white paper, bold and simple, imperfect hand-drawn, looks like a quick planning sketch, featuring five boxes: "Lead Comes In" arrow to "AI Responds (<60s)" arrow to "Qualifies" arrow to "Books Call" arrow to "CRM Updates". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-2-metrics',
        type: 'inline',
        alt: 'Hand drawn dashboard sketch comparing before and after metrics: response time dropping from 47 hours to 30 seconds, booking rate rising from 4 to 22 percent',
        caption: 'The numbers after implementing AI follow-up. The response time alone changes everything.',
        afterKey: '785eabbd8568', // After last visible block
        size: 'large',
        displayAspectRatio: '16:9',
        prompt: 'Simple dashboard showing lead response metrics, hand-drawn dashboard mockup, pencil on white paper, showing rough boxes with numbers inside, sparkline sketches, percentage indicators, minimal wireframe feel, imperfect hand-drawn UI elements, featuring boxes: "Avg Response: 47 hrs → 30 sec", "Booking Rate: 4% → 22%", "Leads Lost: 60% → 8%", with down arrows on the bad numbers and up arrows on the good ones. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-3-architecture',
        type: 'inline',
        alt: 'Whiteboard sketch showing an AI lead follow-up system architecture with CRM at the center connected to chatbot, SMS, email, calendar, and lead scoring',
        caption: 'The system components. Your CRM is the brain. Everything else is a muscle.',
        afterKey: 'd05591d798f8', // After "Acknowledges what they asked about" list item
        size: 'full',
        displayAspectRatio: '16:9',
        prompt: 'Simple architecture diagram of AI follow-up system components, quick whiteboard sketch, dry erase markers in blue and red on a slightly smudged white whiteboard, marker streaks visible, imperfect hand-drawn, looks like a team brainstorm session, featuring a central "CRM" box with branches to "AI Chatbot", "SMS Sequences", "Email Sequences", "Calendar Booking", and "Lead Scoring" around it. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
    ],
  },

  // ── Post 7: Gemini vs ChatGPT ─────────────────────────
  {
    postNum: 7,
    title: 'Gemini vs ChatGPT for Business: Which AI Should You Actually Use?',
    slug: 'gemini-vs-chatgpt-for-business',
    docId: 'drafts.99d77250-6655-4c78-839e-e429accd51ad',
    images: [
      {
        name: 'featured',
        type: 'featured',
        alt: 'Whiteboard sketch showing Gemini versus ChatGPT comparison with key attributes listed under each',
        prompt: 'Simple VS diagram of Gemini and ChatGPT, quick whiteboard sketch, dry erase markers in blue and red on a slightly smudged white whiteboard, marker streaks visible, imperfect hand-drawn, looks like a team brainstorm session, featuring a large "VS" in the center with "Gemini" on the left side (blue) and "ChatGPT" on the right side (red), each with 3-4 key attributes listed below their names. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-1-use-cases',
        type: 'inline',
        alt: 'Hand drawn split screen showing when to use Gemini on the left and when to use ChatGPT on the right based on specific tasks',
        caption: 'The cheat sheet. Stop asking which is better. Ask which is better for this task.',
        afterKey: 'e18df9fc7df8', // After "The 30-second answer" h2
        size: 'full',
        displayAspectRatio: '16:9',
        prompt: 'Simple use-case split between the two tools, hand-drawn split comparison, divided by a thick hand-drawn vertical line down the center, left side labeled "USE GEMINI" right side labeled "USE CHATGPT", contrasting sketches on each side, blue ballpoint pen on white paper, imperfect wobbly lines, featuring left: "Email drafts, Sheets analysis, Meeting prep, Ad copy" and right: "Blog writing, Code, API tasks, Customer chatbots". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-2-pricing',
        type: 'inline',
        alt: 'Hand drawn bar chart comparing monthly costs of Gemini Business, ChatGPT Plus, ChatGPT Team, and Gemini Enterprise',
        caption: 'The pricing lineup. Gemini wins on price if you\'re already in Google Workspace.',
        afterKey: '18609c087ef1', // After "Pricing comparison" h2
        size: 'large',
        displayAspectRatio: '16:9',
        prompt: 'Simple cost comparison chart, hand-drawn data visualization, minimalist bar chart sketch, blue and black ink on graph paper, numbers written by hand, axis labels hand-written, imperfect grid lines, authentic data napkin math feel, featuring side by side bars: "Gemini Biz $14/mo" and "ChatGPT Plus $20/mo" and "ChatGPT Team $25/mo" and "Gemini Enterprise $22/mo". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-3-decision',
        type: 'inline',
        alt: 'Napkin sketch decision tree to choose between Gemini and ChatGPT starting with whether you use Google Workspace',
        caption: 'The 30 second decision. Most people overthink this.',
        afterKey: '0a4abc34bb1f', // After "Use case by use case" h2
        size: 'large',
        displayAspectRatio: 'auto',
        prompt: 'Simple decision tree for choosing between the two, napkin sketch style, blue ballpoint pen on a crumpled white paper napkin, spontaneous, authentic, raw texture, visible ink pressure, imperfect wobbly lines, featuring a flowchart: "Use Google Workspace?" with "Yes" arrow to "Gemini" and "No" arrow to "Need API?" with "Yes" to "ChatGPT" and "No" to "Either works". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
    ],
  },

  // ── Post 8: Gemini Marketing Prompts ──────────────────
  {
    postNum: 8,
    title: 'How to Use Google Gemini for Marketing: Prompts That Actually Work',
    slug: 'google-gemini-marketing-prompts',
    docId: 'drafts.f4541172-d341-4b8f-b7f5-89537137dd62',
    images: [
      {
        name: 'featured',
        type: 'featured',
        alt: 'Clean hand drawn diagram showing a marketing prompt going into Google Gemini and four types of output coming out: ad copy, email, landing page, and analysis',
        prompt: 'Simple concept of a prompt going into Gemini and marketing output coming out, hand-drawn sketch, black felt tip pen on plain white paper, clean but imperfect lines, minimal style, no background texture, authentic hand-drawn feel, featuring a simple flow: a text box labeled "Prompt" with an arrow going into a "Gemini" sparkle icon, then arrows coming out to "Ad Copy", "Email", "Landing Page", "Analysis". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-1-chain',
        type: 'inline',
        alt: 'Pencil sketch on notebook paper showing a four step prompt chain: research, draft, refine, and format',
        caption: 'Single prompts give average results. Prompt chains give great ones.',
        afterKey: '3e7368037777', // After "The universal prompt formula" h2
        size: 'full',
        displayAspectRatio: '16:9',
        prompt: 'Simple prompt chain diagram showing multi-step prompting, hand-drawn sketch, graphite pencil on lined notebook paper, visible pencil pressure, light eraser smudges, imperfect wobbly lines, authentic student notebook feel, featuring a vertical chain: "Step 1: Research prompt" arrow down "Step 2: Draft prompt" arrow down "Step 3: Refine prompt" arrow down "Step 4: Format prompt" with brief descriptions next to each. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-2-formula',
        type: 'inline',
        alt: 'Yellow sticky note with a hand written prompt formula showing role plus task plus context plus format plus constraints',
        caption: 'Tape this to your monitor. Every good prompt follows this structure.',
        afterKey: 'ead9c6a8ed49', // After "Ad copy prompts" h2
        size: 'large',
        displayAspectRatio: 'auto',
        prompt: 'Simple prompt formula cheat sheet, hand-drawn on a yellow sticky note, black felt tip marker, adhesive strip visible at top, slightly tilted on white desk, imperfect hand-written text, authentic raw feel, featuring "PROMPT FORMULA:" at top then "[Role] + [Task] + [Context] + [Format] + [Constraints]" with a small example below. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-3-metrics',
        type: 'inline',
        alt: 'Hand drawn dashboard comparing ad performance before and after using Gemini prompts showing CTR doubling and CPC halving',
        caption: 'Real numbers from testing Gemini-written ad copy against our manual copy.',
        afterKey: '0f5f922fcf32', // After "Email sequence prompts" h2
        size: 'large',
        displayAspectRatio: '16:9',
        prompt: 'Simple before/after of ad copy quality metrics, hand-drawn dashboard mockup, pencil on white paper, showing rough boxes with numbers inside, sparkline sketches, percentage indicators, minimal wireframe feel, imperfect hand-drawn UI elements, featuring "Before Gemini: CTR 1.2%, CPC $4.50" vs "After Gemini: CTR 2.8%, CPC $2.10" with improvement arrows. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
    ],
  },

  // ── Post 9: Best AI Tools ─────────────────────────────
  {
    postNum: 9,
    title: 'Best AI Tools for Service Business Marketing (2026)',
    slug: 'best-ai-tools-service-business-marketing',
    docId: 'drafts.8c54aba7-9a9d-4404-8b27-68a5e8a982e0',
    images: [
      {
        name: 'featured',
        type: 'featured',
        alt: 'Hand drawn dashboard organizing eight AI marketing tools into four categories: lead generation, follow up, content, and operations',
        prompt: 'Simple overview of AI tools organized by marketing function, hand-drawn dashboard mockup, pencil on white paper, showing rough boxes with numbers inside, sparkline sketches, percentage indicators, minimal wireframe feel, imperfect hand-drawn UI elements, featuring a grid layout with 4 sections: "Lead Gen" (2 tool names), "Follow-Up" (2 tool names), "Content" (2 tool names), "Operations" (2 tool names) with star ratings sketched next to each. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-1-costs',
        type: 'inline',
        alt: 'Hand drawn horizontal bar chart showing monthly costs for eight AI marketing tools sorted from cheapest to most expensive',
        caption: 'What each tool costs per month. The best value might surprise you.',
        afterKey: '2bae57357595', // After "We picked 8 tools" paragraph
        size: 'large',
        displayAspectRatio: '16:9',
        prompt: 'Simple cost comparison of AI tools, hand-drawn data visualization, minimalist bar chart sketch, blue and black ink on graph paper, numbers written by hand, axis labels hand-written, imperfect grid lines, authentic data napkin math feel, featuring horizontal bars for 8 tools with their monthly costs, sorted from cheapest to most expensive, with a "Best Value" star on one of them. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-2-tiers',
        type: 'inline',
        alt: 'Hand drawn process flow showing three budget tiers for building an AI marketing stack at 200, 400, and 800 dollars per month',
        caption: 'Start at $200. Scale when the tools pay for themselves.',
        afterKey: 'a9e0368d8d83', // After last block
        size: 'full',
        displayAspectRatio: '16:9',
        prompt: 'Simple starter stack recommendation flow, hand-drawn horizontal process flow, thick arrows connecting simple labeled boxes from left to right, numbered steps, black marker on white paper, bold and simple, imperfect hand-drawn, looks like a quick planning sketch, featuring "Start" arrow to "$200/mo Stack" arrow to "$400/mo Stack" arrow to "$800/mo Stack" with tool names listed under each tier. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-3-before-after',
        type: 'inline',
        alt: 'Hand drawn split screen comparing marketing operations without AI tools versus with AI tools showing faster response times and lower costs',
        caption: 'The before and after. Less money, fewer tools, better results.',
        afterKey: '5766f957decb', // After "Most of those lists" paragraph
        size: 'large',
        displayAspectRatio: '16:9',
        prompt: 'Simple before/after comparison of marketing with and without AI tools, hand-drawn split comparison, divided by a thick hand-drawn vertical line down the center, left side labeled "WITHOUT AI" right side labeled "WITH AI", contrasting sketches on each side, blue ballpoint pen on white paper, imperfect wobbly lines, featuring left: "Manual emails, 47hr response, 3 tools, $1200/mo" and right: "Auto sequences, 30sec response, 1 platform, $400/mo". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
    ],
  },

  // ── Post 10: Automate Client Intake ───────────────────
  {
    postNum: 10,
    title: 'How to Automate Your Entire Client Intake Process with AI',
    slug: 'automate-client-intake-ai',
    docId: 'drafts.658a4c32-4619-452e-ae81-37ab9afc1c7b',
    images: [
      {
        name: 'featured',
        type: 'featured',
        alt: 'Hand drawn process flow showing six steps of an automated client intake system from form submission to CRM record creation',
        prompt: 'Simple end-to-end client intake flow, hand-drawn horizontal process flow, thick arrows connecting simple labeled boxes from left to right, numbered steps, black marker on white paper, bold and simple, imperfect hand-drawn, looks like a quick planning sketch, featuring six boxes: "Form Submit" arrow to "AI Qualifies" arrow to "Route" arrow to "Book Call" arrow to "Send Prep" arrow to "CRM Record". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-1-architecture',
        type: 'inline',
        alt: 'Whiteboard sketch showing the components of an AI client intake system with an automation engine at the center connected to forms, chatbot, calendar, CRM, messaging, and team alerts',
        caption: 'The building blocks. Each one handles a piece of the intake puzzle.',
        afterKey: '419ffa9e7e8f', // After "What a modern AI intake system looks like" h2
        size: 'full',
        displayAspectRatio: '16:9',
        prompt: 'Simple system architecture of intake automation components, quick whiteboard sketch, dry erase markers in blue and red on a slightly smudged white whiteboard, marker streaks visible, imperfect hand-drawn, looks like a team brainstorm session, featuring a central "Automation Engine" box with branches to "Smart Form", "AI Chatbot", "Calendar", "CRM", "Email/SMS", and "Team Alerts" with arrows showing data flow. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-2-qualification',
        type: 'inline',
        alt: 'Napkin sketch showing an AI qualification decision tree that routes leads based on budget and timeline answers',
        caption: 'The qualification logic. AI asks the hard questions so you don\'t have to.',
        afterKey: 'd0c97df4907a', // After "Why most intake processes are broken" h2
        size: 'large',
        displayAspectRatio: '16:9',
        prompt: 'Simple qualification logic branching, napkin sketch style, blue ballpoint pen on a crumpled white paper napkin, spontaneous, authentic, raw texture, visible ink pressure, imperfect wobbly lines, featuring a decision tree: "New Lead" branches to "Budget OK?" with "Yes" going to "Timeline OK?" then to "Book Call", and "No" branches going to "Nurture Sequence". No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
      {
        name: 'inline-3-timeline',
        type: 'inline',
        alt: 'Hand drawn comparison of two timelines showing manual client intake taking over a day versus AI intake completing in under two minutes',
        caption: 'Same outcome. One takes a day and a half. The other takes 90 seconds.',
        afterKey: 'e37fe6a58538', // After last block
        size: 'full',
        displayAspectRatio: '16:9',
        prompt: 'Simple before/after timeline comparison, hand-drawn sketch, black felt tip pen on plain white paper, clean but imperfect lines, minimal style, no background texture, authentic hand-drawn feel, featuring two timelines: top "Manual: Form → 2hrs → Check Email → 4hrs → Phone → 1day → Book" and bottom "AI: Form → 30sec → Qualify → 1min → Book" with total time circled at each end. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.',
      },
    ],
  },
];

// --- Run ---
const arg = process.argv[2];
const postFlag = process.argv.indexOf('--post');

let blogsToProcess = BLOGS;

if (postFlag !== -1 && process.argv[postFlag + 1]) {
  const num = parseInt(process.argv[postFlag + 1]);
  blogsToProcess = BLOGS.filter(b => b.postNum === num);
} else if (arg && arg !== '--post') {
  blogsToProcess = BLOGS.filter(b => b.slug.includes(arg));
}

if (blogsToProcess.length === 0) {
  console.error('No matching blogs found.');
  console.log('Available:', BLOGS.map(b => `${b.postNum}: ${b.slug}`).join('\n  '));
  process.exit(1);
}

console.log(`\nProcessing ${blogsToProcess.length} blog(s), ${blogsToProcess.reduce((s, b) => s + b.images.length, 0)} images total.\n`);

for (const blog of blogsToProcess) {
  await processBlog(blog);
}

console.log('\n✓ All done!');
