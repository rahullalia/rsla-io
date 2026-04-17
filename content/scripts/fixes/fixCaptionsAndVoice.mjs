/**
 * Fix caption, voice, and heading issues in blogPostV2 documents.
 *
 * Pass --dry-run to preview changes without applying them.
 *
 * Issues addressed:
 * 1. "game-changer" in body text -> natural alternative
 * 2. "Revolutionizing" in title -> "Changing"
 * 3. Run-on captions -> add periods
 * 4. Semicolons in captions -> colons (before lists) or periods
 * 5. Title Case headings -> sentence case
 *
 * Usage:
 *   node scripts/fixCaptionsAndVoice.mjs           # apply changes
 *   node scripts/fixCaptionsAndVoice.mjs --dry-run  # preview only
 */

const DRY_RUN = process.argv.includes('--dry-run');

const PROJECT_ID = 'yz25oyux';
const DATASET = 'production';
const API_VERSION = '2025-03-01';
const TOKEN = process.env.SANITY_API_TOKEN_V2;

if (!TOKEN) {
    console.error('ERROR: SANITY_API_TOKEN_V2 env var required. Set it in .env.local or export before running.');
    process.exit(1);
}

const QUERY_URL = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}`;
const MUTATE_URL = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`;

// ============================================================
// Proper nouns / brand names that must stay capitalized
// ============================================================
const PROPER_NOUNS = new Set([
  // Brands & products
  'GoHighLevel', 'GHL', 'HighLevel', 'LeadConnector', 'Vagaro',
  'Google', 'Facebook', 'Instagram', 'Yelp', 'YouTube', 'TikTok',
  'HubSpot', 'Salesforce', 'Zapier', 'WordPress', 'Wix', 'Squarespace',
  'Jobber', 'ServiceTitan', 'Housecall', 'Keap',
  'Gemini', 'ChatGPT', 'GPT', 'OpenAI', 'Anthropic',
  'Twilio', 'Stripe', 'Calendly', 'Mailchimp', 'ActiveCampaign',
  'iPhone', 'iPad', 'iOS', 'Android', 'WhatsApp', 'Messenger', 'Mac', 'Windows',
  'Zapier', 'Notion', 'Slack', 'Zoom', 'QuickBooks',
  'Spice', 'Slice', // "Spice on a Slice" brand name
  // Acronyms
  'AI', 'SEO', 'CRM', 'SMS', 'ROI', 'KPI', 'API', 'URL', 'HTML', 'CSS',
  'JSON', 'HVAC', 'LLC', 'FAQ', 'FAQs', 'DIY', 'B2B', 'B2C', 'SaaS', 'PPC',
  'GMB', 'GBP', 'RSL/A', 'RSLA', 'USA', 'US', 'UK', 'CA',
  // Common words that should stay uppercase in context
  'I',
]);

// Headings to skip entirely (quoted titles, brand names, etc.)
const HEADING_SKIP_PATTERNS = [
  /^❌/, // emoji-prefixed headings (stylistic choice)
  /^3\.\s+[Cc]reate/, // "3. Create a "Review Us" Page" - quoted page title
];

// ============================================================
// Helpers
// ============================================================
async function fetchAllPosts() {
  const query = encodeURIComponent(
    `*[_type == "blogPostV2" && !(_id in path("drafts.**"))]{_id, title, "slug": slug.current, body}`
  );
  const res = await fetch(`${QUERY_URL}?query=${query}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) throw new Error(`Query failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.result;
}

async function mutate(mutations) {
  const res = await fetch(MUTATE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ mutations }),
  });
  if (!res.ok) throw new Error(`Mutation failed: ${res.status} ${await res.text()}`);
  return res.json();
}

function isProperNoun(word) {
  // Strip punctuation for lookup
  const clean = word.replace(/[.,!?:;'")\]]+$/, '').replace(/^['"(\[]+/, '');
  if (PROPER_NOUNS.has(clean)) return true;
  // All-caps 2+ chars (acronyms)
  if (/^[A-Z]{2,}$/.test(clean)) return true;
  // Mixed case brand names (GoHighLevel, iPhone, etc.)
  if (/[a-z][A-Z]/.test(clean)) return true;
  // Contains digits (Step 1, Day 5, etc.)
  if (/\d/.test(clean)) return true;
  return false;
}

/**
 * Convert a heading to sentence case, handling hyphenated words properly.
 * "Multi-Channel Follow-Up Campaigns" -> "Multi-channel follow-up campaigns"
 */
function toSentenceCase(text) {
  if (!text || text.length <= 1) return text;

  // Split into tokens preserving whitespace
  const tokens = text.split(/(\s+)/);

  // Check if this is Title Case (60%+ of content words capitalized)
  const contentWords = tokens.filter(t => /\S/.test(t) && t.length > 1);
  const capitalizedCount = contentWords.filter(t => /^[A-Z]/.test(t)).length;
  if (contentWords.length === 0 || capitalizedCount / contentWords.length < 0.6) {
    return text; // Already sentence case
  }

  let isFirstContentWord = true;
  let afterColon = false;

  return tokens.map((token) => {
    // Preserve whitespace tokens
    if (/^\s+$/.test(token)) return token;

    // Check if previous non-whitespace ended with colon
    if (afterColon) {
      afterColon = false;
      // Capitalize first word after colon
      return processWord(token, true);
    }

    if (token.endsWith(':')) afterColon = true;

    if (isFirstContentWord) {
      isFirstContentWord = false;
      // If first token is a number/bullet (like "5" or "1."), keep it and capitalize next
      if (/^[\d]+\.?$/.test(token)) {
        // The NEXT content word should be capitalized
        isFirstContentWord = true; // reset so next word gets capitalized
        return token;
      }
      return processWord(token, true); // Keep first word capitalized
    }

    return processWord(token, false);
  }).join('');
}

/**
 * Process a single word (possibly hyphenated).
 * keepCap = true means keep the first letter capitalized.
 */
function processWord(word, keepCap) {
  // Handle hyphenated words: "Follow-Up" -> "follow-up", "Multi-Channel" -> "Multi-channel"
  if (word.includes('-')) {
    const parts = word.split('-');
    return parts.map((part, idx) => {
      if (idx === 0 && keepCap) return processSimpleWord(part, true);
      if (idx === 0) return processSimpleWord(part, false);
      // All parts after the hyphen: lowercase unless proper noun
      return processSimpleWord(part, false);
    }).join('-');
  }
  return processSimpleWord(word, keepCap);
}

function processSimpleWord(word, keepCap) {
  if (!word) return word;
  if (isProperNoun(word)) return word;
  // "A/B" style - keep as is
  if (/^[A-Z]\/[A-Z]$/.test(word)) return word;

  if (keepCap) {
    // Ensure first letter is uppercase
    return word[0].toUpperCase() + word.slice(1);
  }
  // Lowercase first letter
  if (/^[A-Z][a-z]/.test(word)) {
    return word[0].toLowerCase() + word.slice(1);
  }
  return word;
}

// ============================================================
// Issue detectors
// ============================================================

// Issue 1: "game-changer" voice violation
function findAndFixGameChanger(posts) {
  const fixes = [];
  for (const post of posts) {
    if (!post.body) continue;
    for (let i = 0; i < post.body.length; i++) {
      const block = post.body[i];
      if (block._type !== 'block' || !block.children) continue;
      for (let j = 0; j < block.children.length; j++) {
        const child = block.children[j];
        if (child._type !== 'span' || !child.text) continue;
        if (/game[\s-]?changer/i.test(child.text)) {
          const original = child.text;
          // Context-aware replacement
          let fixed = original;
          // "Game-changer." standalone -> "Seriously useful."
          fixed = fixed.replace(/Game[\s-]?[Cc]hanger\./g, 'Seriously useful.');
          // "a Game-Changer" -> "a real difference-maker"
          fixed = fixed.replace(/a\s+Game[\s-]?[Cc]hanger/g, 'a real difference-maker');
          // "genuine game-changers" -> "genuine standouts"
          fixed = fixed.replace(/genuine\s+game[\s-]?changers/gi, 'genuine standouts');
          // Catch remaining
          fixed = fixed.replace(/[Gg]ame[\s-]?[Cc]hangers?/g, 'difference-maker');

          if (fixed !== original) {
            fixes.push({ post, blockIdx: i, childIdx: j, original, fixed });
            post.body[i].children[j].text = fixed;
          }
        }
      }
    }
  }
  return fixes;
}

// Issue 2: "Revolutionizing" in title
function findAndFixRevolutionizing(posts) {
  const fixes = [];
  for (const post of posts) {
    if (/revolutioniz/i.test(post.title)) {
      const original = post.title;
      const fixed = original.replace(/Revolutionizing/gi, 'Changing');
      fixes.push({ post, original, fixed });
    }
    // Also check body headings for "Revolutionizing"
    if (!post.body) continue;
    for (let i = 0; i < post.body.length; i++) {
      const block = post.body[i];
      if (block._type !== 'block' || !block.children) continue;
      for (let j = 0; j < block.children.length; j++) {
        const child = block.children[j];
        if (child._type !== 'span' || !child.text) continue;
        if (/revolutioniz/i.test(child.text)) {
          const original = child.text;
          const fixed = original.replace(/[Rr]evolutionizing/g, 'Changing');
          if (fixed !== original) {
            fixes.push({ post, blockIdx: i, childIdx: j, original, fixed, isBody: true });
            post.body[i].children[j].text = fixed;
          }
        }
      }
    }
  }
  return fixes;
}

// Issue 3 & 4: Caption issues
function findAndFixCaptions(posts) {
  const fixes = [];
  for (const post of posts) {
    if (!post.body) continue;
    for (let i = 0; i < post.body.length; i++) {
      const block = post.body[i];
      if (block._type !== 'image' || !block.caption) continue;
      const original = block.caption;
      let fixed = original;

      // Fix semicolons: replace with colon if followed by a list, otherwise period
      if (fixed.includes(';')) {
        fixed = fixed.replace(/;\s*/g, (match, offset) => {
          const after = fixed.slice(offset + match.length);
          // If what follows looks like a list (e.g., "no-show rates, booking trends...")
          // use a colon
          if (/^[a-z]/.test(after)) {
            return ': ';
          }
          return '. ';
        });
      }

      // Fix specific run-on captions (identified manually from corpus review)
      // These are captions where two independent clauses run together without punctuation.

      // "in real time" followed by a new independent clause
      fixed = fixed.replace(
        /in real time\s+(rebooking|referral|booking|conversion)/gi,
        (m, word) => `in real time. ${word[0].toUpperCase()}${word.slice(1)}`
      );

      // "automatically." followed by new clause (but not "automatically when/while/if/etc")
      // "...identify your happiest clients automatically." is fine on its own
      // But here we target specific run-on joins

      // "the awkward ask automated" -> "the awkward ask. Automated"
      fixed = fixed.replace(
        /the awkward ask\s+automated/gi,
        'the awkward ask. Automated'
      );

      // "five-star reviews the right system" -> "five-star reviews. The right system"
      fixed = fixed.replace(
        /five-star reviews\s+the right/gi,
        'five-star reviews. The right'
      );

      // Capitalize first letter after period
      fixed = fixed.replace(/\.\s+([a-z])/g, (m, c) => `. ${c.toUpperCase()}`);

      if (fixed !== original) {
        fixes.push({ post, blockIdx: i, original, fixed });
        post.body[i].caption = fixed;
      }
    }
  }
  return fixes;
}

// Issue 5: Title Case headings
function findAndFixHeadings(posts) {
  const fixes = [];
  for (const post of posts) {
    if (!post.body) continue;
    const postFixes = [];
    for (let i = 0; i < post.body.length; i++) {
      const block = post.body[i];
      if (block._type !== 'block') continue;
      if (!['h2', 'h3', 'h4'].includes(block.style)) continue;
      if (!block.children) continue;

      for (let j = 0; j < block.children.length; j++) {
        const child = block.children[j];
        if (child._type !== 'span' || !child.text) continue;
        const original = child.text;
        // Skip headings matching exclusion patterns
        if (HEADING_SKIP_PATTERNS.some(p => p.test(original))) continue;
        const fixed = toSentenceCase(original);
        if (fixed !== original) {
          postFixes.push({ blockIdx: i, childIdx: j, style: block.style, original, fixed });
          post.body[i].children[j].text = fixed;
        }
      }
    }
    if (postFixes.length > 0) {
      fixes.push({ post, headings: postFixes });
    }
  }
  return fixes;
}

// ============================================================
// Main
// ============================================================
async function main() {
  console.log(DRY_RUN ? '=== DRY RUN MODE ===' : '=== LIVE MODE ===');
  console.log('Fetching all blogPostV2 documents...');
  const posts = await fetchAllPosts();
  console.log(`Found ${posts.length} published blogPostV2 documents.\n`);

  const changedPostIds = new Set();
  const titleMutations = []; // separate title patches

  // --- Issue 1: game-changer ---
  console.log('--- Issue 1: "game-changer" in body text ---');
  const gcFixes = findAndFixGameChanger(posts);
  if (gcFixes.length === 0) {
    console.log('  No instances found.\n');
  } else {
    for (const f of gcFixes) {
      console.log(`  [${f.post.slug}] block ${f.blockIdx}:`);
      console.log(`    BEFORE: "${f.original}"`);
      console.log(`    AFTER:  "${f.fixed}"`);
      changedPostIds.add(f.post._id);
    }
    console.log();
  }

  // --- Issue 2: revolutionizing ---
  console.log('--- Issue 2: "Revolutionizing" in titles/body ---');
  const revFixes = findAndFixRevolutionizing(posts);
  if (revFixes.length === 0) {
    console.log('  No instances found.\n');
  } else {
    for (const f of revFixes) {
      if (f.isBody) {
        console.log(`  [${f.post.slug}] block ${f.blockIdx}: "${f.original}" -> "${f.fixed}"`);
        changedPostIds.add(f.post._id);
      } else {
        console.log(`  [${f.post.slug}] TITLE: "${f.original}" -> "${f.fixed}"`);
        titleMutations.push({ patch: { id: f.post._id, set: { title: f.fixed } } });
      }
    }
    console.log();
  }

  // --- Issue 3 & 4: captions ---
  console.log('--- Issue 3 & 4: Caption fixes (semicolons, run-ons) ---');
  const captionFixes = findAndFixCaptions(posts);
  if (captionFixes.length === 0) {
    console.log('  No caption issues found.\n');
  } else {
    for (const f of captionFixes) {
      console.log(`  [${f.post.slug}] block ${f.blockIdx}:`);
      console.log(`    BEFORE: "${f.original}"`);
      console.log(`    AFTER:  "${f.fixed}"`);
      changedPostIds.add(f.post._id);
    }
    console.log();
  }

  // --- Issue 5: headings ---
  console.log('--- Issue 5: Title Case headings -> sentence case ---');
  const headingFixes = findAndFixHeadings(posts);
  console.log(`  Found ${headingFixes.length} posts with Title Case headings\n`);
  for (const item of headingFixes) {
    console.log(`  [${item.post.slug}] (${item.headings.length} headings):`);
    for (const h of item.headings) {
      console.log(`    ${h.style}: "${h.original}" -> "${h.fixed}"`);
    }
    changedPostIds.add(item.post._id);
  }
  console.log();

  // --- Build mutations ---
  const mutations = [...titleMutations];
  for (const postId of changedPostIds) {
    const post = posts.find(p => p._id === postId);
    // Check if there's already a title mutation
    const existing = mutations.find(m => m.patch && m.patch.id === postId);
    if (existing) {
      existing.patch.set.body = post.body;
    } else {
      mutations.push({ patch: { id: postId, set: { body: post.body } } });
    }
  }

  console.log(`Total mutations: ${mutations.length}`);
  console.log(`Posts affected: ${changedPostIds.size}`);

  if (DRY_RUN) {
    console.log('\nDry run complete. No changes applied.');
    return;
  }

  if (mutations.length === 0) {
    console.log('\nNo changes to apply.');
    return;
  }

  console.log('\nApplying mutations...');
  const result = await mutate(mutations);
  console.log(`Done. Transaction ID: ${result.transactionId}`);
}

main().catch(err => {
  console.error('Script failed:', err.message);
  process.exit(1);
});
