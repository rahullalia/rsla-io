/**
 * mdToPortableText.mjs
 *
 * Converts markdown content to Sanity portable text blocks and patches
 * the body field of a blogPostV2 document via the Sanity HTTP mutation API.
 *
 * This bypasses the MCP tool which truncates large content.
 *
 * Usage:
 *   node scripts/mdToPortableText.mjs <draft-id> <markdown-file>
 *
 * Example:
 *   node scripts/mdToPortableText.mjs drafts.488617b8-9bbf-4ac1-afb5-123fc12ad76e scripts/posts/post11.md
 */

import { readFileSync } from 'fs';
import crypto from 'crypto';

// --- Config ---
const SANITY_PROJECT_ID = 'yz25oyux';
const SANITY_DATASET = 'production';
const SANITY_TOKEN = readFileSync('/Users/rahullalia/lalia/4-Resources/mcp/sanity.env', 'utf-8')
  .split('\n')
  .find(line => line.startsWith('SANITY_API_TOKEN='))
  ?.split('=').slice(1).join('=')
  ?.trim();

if (!SANITY_TOKEN) throw new Error('Missing SANITY_API_TOKEN in sanity.env');

function genKey() {
  return crypto.randomBytes(6).toString('hex');
}

/**
 * Parse inline markdown (bold, italic, links, bold+italic) into Sanity spans.
 * Returns { children: [...spans], markDefs: [...linkDefs] }
 */
/**
 * Parse text that's already inside bold/italic for nested links.
 * Returns children spans (with outer marks applied) and any link markDefs.
 */
function parseInnerLinks(text, outerMarks) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const children = [];
  const markDefs = [];
  let lastIdx = 0;
  let m;

  while ((m = linkRegex.exec(text)) !== null) {
    if (m.index > lastIdx) {
      children.push({
        _key: genKey(),
        _type: 'span',
        marks: [...outerMarks],
        text: text.slice(lastIdx, m.index),
      });
    }
    const linkKey = genKey();
    markDefs.push({ _key: linkKey, _type: 'link', href: m[2] });
    children.push({
      _key: genKey(),
      _type: 'span',
      marks: [...outerMarks, linkKey],
      text: m[1],
    });
    lastIdx = m.index + m[0].length;
  }

  if (lastIdx < text.length) {
    children.push({
      _key: genKey(),
      _type: 'span',
      marks: [...outerMarks],
      text: text.slice(lastIdx),
    });
  }

  if (children.length === 0) {
    children.push({
      _key: genKey(),
      _type: 'span',
      marks: [...outerMarks],
      text: text,
    });
  }

  return { children, markDefs };
}

function parseInline(text) {
  const children = [];
  const markDefs = [];

  // Regex to match: ***bold italic***, **bold**, *italic*, [text](url)
  const inlineRegex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)]+)\))/g;

  let lastIndex = 0;
  let match;

  while ((match = inlineRegex.exec(text)) !== null) {
    // Add plain text before this match
    if (match.index > lastIndex) {
      const plainText = text.slice(lastIndex, match.index);
      if (plainText) {
        children.push({
          _key: genKey(),
          _type: 'span',
          marks: [],
          text: plainText,
        });
      }
    }

    if (match[2]) {
      // ***bold italic*** — check for nested links
      const innerResult = parseInnerLinks(match[2], ['strong', 'em']);
      children.push(...innerResult.children);
      markDefs.push(...innerResult.markDefs);
    } else if (match[3]) {
      // **bold** — check for nested links
      const innerResult = parseInnerLinks(match[3], ['strong']);
      children.push(...innerResult.children);
      markDefs.push(...innerResult.markDefs);
    } else if (match[4]) {
      // *italic* — check for nested links
      const innerResult = parseInnerLinks(match[4], ['em']);
      children.push(...innerResult.children);
      markDefs.push(...innerResult.markDefs);
    } else if (match[5] && match[6]) {
      // [text](url)
      const linkKey = genKey();
      markDefs.push({
        _key: linkKey,
        _type: 'link',
        href: match[6],
      });
      children.push({
        _key: genKey(),
        _type: 'span',
        marks: [linkKey],
        text: match[5],
      });
    }

    lastIndex = match.index + match[0].length;
  }

  // Remaining text after last match
  if (lastIndex < text.length) {
    const remaining = text.slice(lastIndex);
    if (remaining) {
      children.push({
        _key: genKey(),
        _type: 'span',
        marks: [],
        text: remaining,
      });
    }
  }

  // If no matches found, return the full text as a single span
  if (children.length === 0) {
    children.push({
      _key: genKey(),
      _type: 'span',
      marks: [],
      text: text,
    });
  }

  return { children, markDefs };
}

/**
 * Convert markdown string to Sanity portable text blocks.
 * Supports: h1-h4, paragraphs, bold, italic, links, bullet lists, numbered lists.
 */
function markdownToPortableText(markdown) {
  const lines = markdown.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,4})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const style = `h${level}`;
      const { children, markDefs } = parseInline(headingMatch[2].trim());
      blocks.push({
        _key: genKey(),
        _type: 'block',
        style,
        children,
        markDefs,
      });
      i++;
      continue;
    }

    // Bullet list items
    const bulletMatch = line.match(/^[-*]\s+(.+)/);
    if (bulletMatch) {
      const { children, markDefs } = parseInline(bulletMatch[1].trim());
      blocks.push({
        _key: genKey(),
        _type: 'block',
        style: 'normal',
        level: 1,
        listItem: 'bullet',
        children,
        markDefs,
      });
      i++;
      continue;
    }

    // Numbered list items
    const numberedMatch = line.match(/^\d+\.\s+(.+)/);
    if (numberedMatch) {
      const { children, markDefs } = parseInline(numberedMatch[1].trim());
      blocks.push({
        _key: genKey(),
        _type: 'block',
        style: 'normal',
        level: 1,
        listItem: 'number',
        children,
        markDefs,
      });
      i++;
      continue;
    }

    // Regular paragraph (may span multiple lines until empty line)
    let paragraphText = line.trim();
    i++;
    // Collect continuation lines (non-empty, non-heading, non-list)
    while (i < lines.length) {
      const nextLine = lines[i];
      if (nextLine.trim() === '') break;
      if (nextLine.match(/^#{1,4}\s+/)) break;
      if (nextLine.match(/^[-*]\s+/)) break;
      if (nextLine.match(/^\d+\.\s+/)) break;
      paragraphText += ' ' + nextLine.trim();
      i++;
    }

    const { children, markDefs } = parseInline(paragraphText);
    blocks.push({
      _key: genKey(),
      _type: 'block',
      style: 'normal',
      children,
      markDefs,
    });
  }

  return blocks;
}

/**
 * Patch the body field of a Sanity document, preserving existing image blocks.
 */
async function patchBody(docId, newBlocks) {
  // First, fetch the existing body to preserve image blocks and their positions
  const queryUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2025-03-01/data/query/${SANITY_DATASET}?perspective=raw`;
  const queryRes = await fetch(`${queryUrl}&query=*[_id == "${docId}"][0]{ body }`, {
    headers: { Authorization: `Bearer ${SANITY_TOKEN}` },
  });
  const queryData = await queryRes.json();
  const existingBody = queryData.result?.body || [];

  // Extract existing image blocks (preserving their _key and position info)
  const imageBlocks = existingBody.filter(b => b._type === 'image');

  // Get existing H2 headings from old body to map image positions
  const oldH2Keys = [];
  for (const block of existingBody) {
    if (block._type === 'block' && block.style === 'h2') {
      const text = block.children?.map(c => c.text).join('') || '';
      oldH2Keys.push(text);
    }
  }

  // Get new H2 indices to figure out where to insert images
  const newH2Indices = [];
  for (let idx = 0; idx < newBlocks.length; idx++) {
    if (newBlocks[idx].style === 'h2') {
      newH2Indices.push(idx);
    }
  }

  // Insert images evenly: after ~25%, ~50%, ~75% of H2s
  const finalBlocks = [...newBlocks];
  if (imageBlocks.length === 3 && newH2Indices.length >= 3) {
    // Place after 1st, middle, and last-1 H2s (find the block AFTER each H2)
    const positions = [
      newH2Indices[0], // After first H2
      newH2Indices[Math.floor(newH2Indices.length / 2)], // After middle H2
      newH2Indices[newH2Indices.length - 2] || newH2Indices[newH2Indices.length - 1], // After second-to-last H2
    ];

    // Insert in reverse order to preserve indices
    for (let j = 2; j >= 0; j--) {
      const insertAfter = positions[j] + 1; // After the H2 heading
      finalBlocks.splice(insertAfter, 0, imageBlocks[j]);
    }
  } else if (imageBlocks.length > 0) {
    // Fallback: append images at evenly spaced positions
    const spacing = Math.floor(finalBlocks.length / (imageBlocks.length + 1));
    for (let j = imageBlocks.length - 1; j >= 0; j--) {
      finalBlocks.splice(spacing * (j + 1), 0, imageBlocks[j]);
    }
  }

  // Strip null markDefs from all blocks (image blocks sometimes have null entries)
  for (const block of finalBlocks) {
    if (block.markDefs) {
      block.markDefs = block.markDefs.filter(m => m != null);
    }
  }

  // Patch via mutation API
  const mutateUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2025-03-01/data/mutate/${SANITY_DATASET}`;
  const res = await fetch(mutateUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SANITY_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mutations: [{
        patch: {
          id: docId,
          set: { body: finalBlocks },
        },
      }],
    }),
  });

  const result = await res.json();
  if (result.error) {
    throw new Error(`Sanity mutation failed: ${JSON.stringify(result.error)}`);
  }
  return result;
}

// --- Main ---
const [,, docId, mdFile] = process.argv;

if (!docId || !mdFile) {
  console.error('Usage: node scripts/mdToPortableText.mjs <draft-id> <markdown-file>');
  process.exit(1);
}

const markdown = readFileSync(mdFile, 'utf-8');
const blocks = markdownToPortableText(markdown);

// Count stats
const wordCount = blocks.reduce((sum, b) => {
  if (b._type === 'block') {
    return sum + (b.children?.reduce((s, c) => s + (c.text?.split(/\s+/).length || 0), 0) || 0);
  }
  return sum;
}, 0);

const h2Count = blocks.filter(b => b.style === 'h2').length;
const h3Count = blocks.filter(b => b.style === 'h3').length;

console.log(`Parsed ${blocks.length} blocks (${wordCount} words, ${h2Count} H2s, ${h3Count} H3s)`);

console.log(`Patching ${docId}...`);
const result = await patchBody(docId, blocks);
console.log(`Done: ${result.transactionId || JSON.stringify(result)}`);

// Re-verify word count
const verifyUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2025-03-01/data/query/${SANITY_DATASET}?perspective=raw`;
const verifyRes = await fetch(`${verifyUrl}&query=*[_id == "${docId}"][0]{ "blockCount": count(body), "textBlocks": count(body[_type == "block"]), "imageBlocks": count(body[_type == "image"]) }`, {
  headers: { Authorization: `Bearer ${SANITY_TOKEN}` },
});
const verifyData = await verifyRes.json();
console.log(`Verified: ${JSON.stringify(verifyData.result)}`);
