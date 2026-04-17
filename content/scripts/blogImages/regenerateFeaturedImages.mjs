/**
 * regenerateFeaturedImages.mjs
 *
 * Regenerates featured images for all 60 published blogPostV2 posts
 * in proper landscape (16:9) orientation via Imagen 4.0 Fast.
 *
 * Uploads to Sanity CDN and patches the featuredImage field on each post.
 *
 * Usage:
 *   node scripts/regenerateFeaturedImages.mjs                 # all 60 posts
 *   node scripts/regenerateFeaturedImages.mjs --start 10      # start from post #10
 *   node scripts/regenerateFeaturedImages.mjs --post 5        # single post by number (1-60)
 *   node scripts/regenerateFeaturedImages.mjs maps            # single post by slug fragment
 *   node scripts/regenerateFeaturedImages.mjs --dry-run       # show prompts without generating
 */

import { createClient } from '@sanity/client';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { IMAGE_STYLES, buildPrompt } from './imageStyles.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..', 'generated-images', 'featured');

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
if (!GEMINI_API_KEY) throw new Error('Missing GEMINI_API_KEY in .env');

const sanity = createClient({
  projectId: 'yz25oyux',
  dataset: 'production',
  token: SANITY_TOKEN,
  apiVersion: '2025-03-01',
  useCdn: false,
});

// --- Featured image style rotation (personality-heavy styles for hero images) ---
const FEATURED_STYLES = [
  'napkinSketch', 'whiteboardMarker', 'splitScreen', 'stickyNote',
  'feltTipClean', 'metricViz', 'processArrows', 'dashboardSketch',
  'napkinSketch', 'whiteboardMarker',
];

function getFeaturedStyle(index) {
  return FEATURED_STYLES[index % FEATURED_STYLES.length];
}

// --- Strip text-related instructions from style base prompts ---
function stripTextInstructions(base) {
  return base
    .replace(/,?\s*imperfect hand-written text/gi, '')
    .replace(/,?\s*numbers written by hand/gi, '')
    .replace(/,?\s*axis labels hand-written/gi, '')
    .replace(/,?\s*showing rough boxes with numbers inside/gi, '')
    .replace(/,?\s*sparkline sketches,?\s*percentage indicators/gi, '')
    .replace(/,?\s*left side labeled "BEFORE" right side labeled "AFTER"/gi, '')
    .replace(/,?\s*contrasting sketches on each side/gi, ', contrasting visuals on each side')
    .replace(/,?\s*simple labeled boxes/gi, ', simple boxes')
    .replace(/,?\s*numbered steps/gi, '')
    .replace(/,?\s*hand-written/gi, '')
    .trim()
    .replace(/,\s*,/g, ',');
}

// --- Map topic keywords to visual object descriptions (no words for the model to render) ---
function topicToVisualObjects(topic) {
  const t = topic.toLowerCase();

  // CRM / software comparisons
  if (t.includes(' vs ') || t.includes('comparison'))
    return 'two groups of abstract icons separated by a vertical dividing line, with arrows pointing between them showing differences';
  // Pricing
  if (t.includes('pricing') || t.includes('cost') || t.includes('price'))
    return 'abstract bar charts of different heights with coin icons and upward/downward arrows';
  // Lead follow-up / response
  if (t.includes('lead') && (t.includes('follow') || t.includes('response') || t.includes('losing')))
    return 'a funnel shape with arrows flowing downward, some arrows escaping sideways, clock icons nearby';
  // Automation / workflow
  if (t.includes('automat') || t.includes('workflow'))
    return 'connected gear icons with arrows flowing left to right through boxes, representing an automated pipeline';
  // SMS / email marketing
  if (t.includes('sms') || t.includes('email'))
    return 'envelope icons and phone icons connected by arrows, with a megaphone shape';
  // Reviews
  if (t.includes('review'))
    return 'star shapes in a row with upward trending arrow, speech bubble icons nearby';
  // SEO / ranking / Google Maps
  if (t.includes('seo') || t.includes('ranking') || t.includes('google maps') || t.includes('rank higher'))
    return 'a search magnifying glass icon with upward arrows and a bar chart trending upward, map pin icons';
  // Google Business Profile
  if (t.includes('google business') || t.includes('business profile'))
    return 'a storefront icon with a location pin, star icons, and a magnifying glass';
  // Funnel
  if (t.includes('funnel'))
    return 'a large funnel shape with arrows flowing in at the top and a narrow stream at the bottom, dollar sign shapes';
  // CRM
  if (t.includes('crm') || t.includes('client retention'))
    return 'a rolodex or contact card icon connected to multiple person silhouettes with arrows, heart and checkmark icons';
  // Restaurant
  if (t.includes('restaurant') || t.includes('table'))
    return 'plate and utensil icons, a storefront shape, connected by arrows to phone and envelope icons';
  // Salon / hair
  if (t.includes('salon') || t.includes('hair') || t.includes('stylist'))
    return 'scissors icon, a calendar grid, connected by arrows to person silhouettes and star shapes';
  // Home service / HVAC / contractor
  if (t.includes('home service') || t.includes('hvac') || t.includes('contract'))
    return 'a house icon with wrench and gear shapes, connected by arrows to a clipboard and phone';
  // Real estate
  if (t.includes('real estate'))
    return 'house icons with key shapes, connected by arrows to person silhouettes and a handshake icon';
  // AI / Claude / coding agents
  if (t.includes('claude') || t.includes('ai ') || t.includes('artificial') || t.includes('coding agent') || t.includes('agent sdk'))
    return 'a robot head icon connected by circuit-like lines to a laptop, gear, and lightbulb icons';
  // MCP / integrations
  if (t.includes('mcp') || t.includes('integration') || t.includes('plug'))
    return 'a central hub circle with radiating lines connecting to various tool icons like a plug, database cylinder, and cloud shape';
  // Marketing
  if (t.includes('marketing') || t.includes('content'))
    return 'a megaphone icon with radiating lines, connected to target bullseye, chart, and person icons';
  // Cold email
  if (t.includes('cold email') || t.includes('outreach'))
    return 'envelope icons with arrow trajectories, some hitting a target bullseye, some missing';
  // Answer engine / AEO
  if (t.includes('answer engine') || t.includes('aeo'))
    return 'a chat bubble icon connected to a search magnifying glass, with radiating connection lines to a globe';
  // Gemini / ChatGPT
  if (t.includes('gemini') || t.includes('chatgpt'))
    return 'three overlapping circles (like a Venn diagram) with different simple icons inside each';
  // Computer use
  if (t.includes('computer use'))
    return 'a computer monitor icon with a robotic hand cursor, clicking on interface elements';
  // No-code tools
  if (t.includes('no-code') || t.includes('no code'))
    return 'puzzle pieces clicking together, connected by arrows to a rocket and lightbulb icon';
  // Conversational AI / support
  if (t.includes('conversational') || t.includes('support') || t.includes('chatbot'))
    return 'overlapping speech bubbles with a robot icon and a person icon on opposite sides';
  // Appointment / booking
  if (t.includes('appointment') || t.includes('booking') || t.includes('reminder'))
    return 'a calendar grid with checkmarks, connected by arrows to a clock icon and bell icon';
  // Stack / tools
  if (t.includes('stack') || t.includes('tools'))
    return 'layered rectangles stacked vertically with different simple icons on each layer, connected by vertical arrows';

  // Default fallback
  return 'abstract connected shapes, arrows, and simple icons representing a business concept';
}

// --- Generate a contextual prompt based on post title/slug ---
function generateFeaturedPrompt(title, slug, styleKey) {
  const style = IMAGE_STYLES[styleKey];
  if (!style) throw new Error(`Unknown style: ${styleKey}`);

  // Extract the core topic from the title for the visual
  const topic = title
    .replace(/[:?!]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/\d{4}/g, '')
    .trim();

  const cleanBase = stripTextInstructions(style.base);

  // Convert the topic into visual object descriptions instead of words the model might render
  const visualSubject = topicToVisualObjects(topic);

  return `${cleanBase}. Draw ${visualSubject}. The image must contain absolutely ZERO text — no words, no letters, no numbers, no labels, no captions, no handwriting, no characters of any language. Only draw shapes, icons, arrows, lines, and abstract symbols. Keep it simple with plenty of white space. The image should look authentic and human-made, not AI-generated.`;
}

// --- Imagen 4.0 Fast Image Generation (16:9 landscape) ---
async function generateImage(prompt) {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': GEMINI_API_KEY,
    },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: { sampleCount: 1, aspectRatio: '16:9' },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Imagen API error (${response.status}): ${err}`);
  }

  const data = await response.json();
  const base64 = data.predictions?.[0]?.bytesBase64Encoded;

  if (!base64) {
    throw new Error('No image returned from Imagen');
  }

  return {
    base64,
    mimeType: 'image/png',
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

// --- Save locally ---
function saveLocally(base64, filename) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const filepath = join(OUTPUT_DIR, filename);
  writeFileSync(filepath, Buffer.from(base64, 'base64'));
  console.log(`    Saved: ${filepath}`);
  return filepath;
}

// --- Process a single post ---
async function processPost(post, index, dryRun) {
  const styleKey = getFeaturedStyle(index);
  const prompt = generateFeaturedPrompt(post.title, post.slug, styleKey);

  console.log(`\n  [${index + 1}] ${post.title.slice(0, 60)}`);
  console.log(`      ID: ${post._id}`);
  console.log(`      Style: ${styleKey}`);

  if (dryRun) {
    console.log(`      Prompt: ${prompt.slice(0, 120)}...`);
    return;
  }

  try {
    const { base64, mimeType } = await generateImage(prompt);
    const ext = mimeType.includes('png') ? 'png' : 'jpg';
    const filename = `featured-${post.slug}.${ext}`;

    saveLocally(base64, filename);

    const buffer = Buffer.from(base64, 'base64');
    const asset = await uploadToSanity(buffer, filename);

    // Build the alt text from the title
    const altText = `Featured illustration for: ${post.title}`;

    // Patch the featuredImage field on the published doc
    await mutate([{
      patch: {
        id: post._id,
        set: {
          featuredImage: {
            _type: 'image',
            alt: altText,
            asset: { _type: 'reference', _ref: asset._id },
          },
        },
      },
    }]);

    console.log(`      Featured image replaced successfully`);
  } catch (err) {
    console.error(`      ERROR: ${err.message}`);
  }

  // Delay between posts to avoid rate limiting
  await new Promise(r => setTimeout(r, 3000));
}

// --- Main ---
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  // Fetch all 60 published posts
  const posts = await sanity.fetch(
    `*[_type == "blogPostV2" && status == "published"] | order(publishedAt asc) {
      _id,
      title,
      "slug": slug.current
    }`
  );

  console.log(`Found ${posts.length} published posts`);

  let postsToProcess = posts;

  if (args.includes('--post')) {
    const postNum = parseInt(args[args.indexOf('--post') + 1]);
    if (postNum < 1 || postNum > posts.length) {
      console.error(`Post number must be between 1 and ${posts.length}`);
      process.exit(1);
    }
    postsToProcess = [posts[postNum - 1]];
  } else if (args.includes('--start')) {
    const startNum = parseInt(args[args.indexOf('--start') + 1]);
    postsToProcess = posts.slice(startNum - 1);
    console.log(`Starting from post #${startNum}`);
  } else if (args.length > 0 && !args[0].startsWith('--')) {
    const fragment = args[0].toLowerCase();
    postsToProcess = posts.filter(p => p.slug.includes(fragment));
    if (postsToProcess.length === 0) {
      console.error(`No post found matching "${fragment}"`);
      process.exit(1);
    }
  }

  console.log(`Processing ${postsToProcess.length} posts${dryRun ? ' (DRY RUN)' : ''}...`);
  console.log(`Estimated cost: ~$${(postsToProcess.length * 0.04).toFixed(2)}`);

  for (let i = 0; i < postsToProcess.length; i++) {
    const post = postsToProcess[i];
    const globalIndex = posts.indexOf(post);
    await processPost(post, globalIndex, dryRun);
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Done! ${postsToProcess.length} featured images ${dryRun ? 'previewed' : 'generated and uploaded'}.`);
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
