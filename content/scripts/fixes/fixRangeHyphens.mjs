#!/usr/bin/env node

/**
 * Fix range hyphens across all published blogPostV2 and caseStudy documents.
 * Replaces patterns like "24-48 hours" → "24 to 48 hours" in both
 * plain text fields and Portable Text body content.
 */

const PROJECT_ID = 'yz25oyux';
const DATASET = 'production';
const API_VERSION = '2025-03-01';
const TOKEN = 'skAhaCsua4bfA0ooEnN5XdJ1So0E7Q8MogaW932a20AKLIh6qGiOfZx7pDDRhRrEWNSQNlFT527F74i8tGoxoyNBIBqROP249vXhktwZEyTGVQBf5aXe80gcgeErZ8jE8US2bTsE1F9ozjntXYeAhhLkcThOPCgosrlznOI9k5JsSryHIaya';
const BASE_URL = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}`;

// Range hyphen pattern: number (with optional $, commas) followed by hyphen/en-dash/em-dash
// followed by number (with optional commas), then optional suffix (%, x, +, k, K, M)
// OR followed by number + space + unit word
const RANGE_PATTERN = /(\$?\d[\d,]*)[\u002D\u2013\u2014](\d[\d,]*(?:\s*(?:%|x|X|\+|k|K|M|hrs?|hours?|days?|weeks?|months?|years?|minutes?|mins?|seconds?|secs?|posts?|clients?|leads?|calls?|pages?|steps?|times?|reviews?|locations?|keywords?|visits?|sessions?|employees?|people|users?|members?|businesses?|campaigns?|emails?|contacts?|appointments?|projects?|websites?|tools?|platforms?|integrations?|channels?|automations?|workflows?|templates?|funnels?|pipelines?|stages?|tasks?|tickets?|agents?|reps?|seats?|accounts?|subscribers?|customers?|orders?|transactions?|bookings?|spots?|slots?))?)/g;

function fixRangeHyphens(text) {
  if (!text || typeof text !== 'string') return { text, changed: false };

  const original = text;
  const fixed = text.replace(RANGE_PATTERN, (match, num1, num2AndSuffix) => {
    // Extra safety: skip if this looks like a date (YYYY-MM or MM-DD patterns)
    // Dates: 4-digit year followed by dash + 2-digit month
    if (/^\d{4}$/.test(num1) && /^\d{2}/.test(num2AndSuffix)) return match;
    // Also skip 2-digit-2-digit that could be MM-DD
    if (/^\d{2}$/.test(num1) && /^\d{2}$/.test(num2AndSuffix.trim())) {
      // But allow things like "10-15x" or "25-35%"
      if (/^\d{2}\s*(%|x|X)/.test(num2AndSuffix)) {
        return `${num1} to ${num2AndSuffix}`;
      }
      // Could be a date or a range. If the first number is > 31 it's not a date.
      const n1 = parseInt(num1);
      if (n1 > 31) return `${num1} to ${num2AndSuffix}`;
      // For small numbers (potential dates), still replace since we filtered YYYY above
      return `${num1} to ${num2AndSuffix}`;
    }
    return `${num1} to ${num2AndSuffix}`;
  });

  return { text: fixed, changed: fixed !== original };
}

async function fetchDocs(type, fields) {
  const query = `*[_type == "${type}" && !(_id in path("drafts.**"))]{_id, ${fields.join(', ')}}`;
  const url = `${BASE_URL}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) throw new Error(`Fetch ${type} failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.result || [];
}

function processPlainField(doc, fieldName, mutations, log) {
  const value = doc[fieldName];
  if (!value || typeof value !== 'string') return;
  const { text, changed } = fixRangeHyphens(value);
  if (changed) {
    if (!mutations[doc._id]) mutations[doc._id] = {};
    mutations[doc._id][fieldName] = text;
    log.push({ docId: doc._id, title: doc.title || doc._id, field: fieldName, before: value, after: text });
  }
}

function processBody(doc, mutations, log) {
  const body = doc.body;
  if (!Array.isArray(body)) return;

  let bodyChanged = false;
  const newBody = body.map((block) => {
    if (block._type !== 'block' || !Array.isArray(block.children)) return block;

    let blockChanged = false;
    const newChildren = block.children.map((child) => {
      if (child._type !== 'span' || typeof child.text !== 'string') return child;
      const { text, changed } = fixRangeHyphens(child.text);
      if (changed) {
        blockChanged = true;
        log.push({
          docId: doc._id,
          title: doc.title || doc._id,
          field: `body[${block._key}].children[${child._key}]`,
          before: child.text,
          after: text,
        });
        return { ...child, text };
      }
      return child;
    });

    if (blockChanged) {
      bodyChanged = true;
      return { ...block, children: newChildren };
    }
    return block;
  });

  if (bodyChanged) {
    if (!mutations[doc._id]) mutations[doc._id] = {};
    mutations[doc._id].body = newBody;
  }
}

async function postMutations(mutationBatch) {
  const url = `${BASE_URL}/data/mutate/${DATASET}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ mutations: mutationBatch }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Mutation failed: ${res.status} ${text}`);
  }
  return res.json();
}

async function main() {
  console.log('Fetching blogPostV2 documents...');
  const blogFields = ['title', 'excerpt', 'pullQuote', 'body'];
  const blogs = await fetchDocs('blogPostV2', blogFields);
  console.log(`  Found ${blogs.length} published blogPostV2 docs`);

  console.log('Fetching caseStudy documents...');
  const caseFields = ['title', 'description', 'tldr', 'problemStatement', 'solutionApproach', 'resultsOutcome', 'body'];
  const cases = await fetchDocs('caseStudy', caseFields);
  console.log(`  Found ${cases.length} published caseStudy docs`);

  const mutations = {}; // docId → { field: newValue }
  const log = [];

  // Process blogPostV2
  for (const doc of blogs) {
    processPlainField(doc, 'title', mutations, log);
    processPlainField(doc, 'excerpt', mutations, log);
    processPlainField(doc, 'pullQuote', mutations, log);
    processBody(doc, mutations, log);
  }

  // Process caseStudy
  for (const doc of cases) {
    processPlainField(doc, 'title', mutations, log);
    processPlainField(doc, 'description', mutations, log);
    processPlainField(doc, 'tldr', mutations, log);
    processPlainField(doc, 'problemStatement', mutations, log);
    processPlainField(doc, 'solutionApproach', mutations, log);
    processPlainField(doc, 'resultsOutcome', mutations, log);
    processBody(doc, mutations, log);
  }

  const docIds = Object.keys(mutations);
  console.log(`\nFound ${log.length} replacements across ${docIds.length} documents.\n`);

  if (docIds.length === 0) {
    console.log('Nothing to fix. All clean!');
    return;
  }

  // Print change log
  console.log('--- CHANGES ---');
  for (const entry of log) {
    console.log(`[${entry.title}] ${entry.field}`);
    console.log(`  BEFORE: ${entry.before.substring(0, 120)}`);
    console.log(`  AFTER:  ${entry.after.substring(0, 120)}`);
    console.log();
  }

  // Build mutation batches
  const allMutations = docIds.map((id) => ({
    patch: { id, set: mutations[id] },
  }));

  const BATCH_SIZE = 50;
  let totalPatched = 0;
  for (let i = 0; i < allMutations.length; i += BATCH_SIZE) {
    const batch = allMutations.slice(i, i + BATCH_SIZE);
    console.log(`Sending mutation batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} docs)...`);
    await postMutations(batch);
    totalPatched += batch.length;
  }

  console.log(`\n--- SUMMARY ---`);
  console.log(`Total documents patched: ${totalPatched}`);
  console.log(`Total replacements made: ${log.length}`);
  console.log('Done!');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
