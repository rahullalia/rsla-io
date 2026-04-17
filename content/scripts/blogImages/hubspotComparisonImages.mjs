/**
 * hubspotComparisonImages.mjs
 *
 * Regenerates 2 inline images for the GHL vs HubSpot comparison post
 * using SVG → PNG (via sharp) for perfect text rendering.
 * Replaces existing images in-place by patching asset refs.
 *
 * Usage: node scripts/hubspotComparisonImages.mjs
 */

import { createClient } from '@sanity/client';
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..', 'generated-images');

const SANITY_PROJECT_ID = 'yz25oyux';
const SANITY_DATASET = 'production';
const SANITY_TOKEN = readFileSync('/Users/rahullalia/lalia/4-Resources/mcp/sanity.env', 'utf-8')
  .split('\n').find(l => l.startsWith('SANITY_API_TOKEN=')).split('=').slice(1).join('=').trim();

if (!SANITY_TOKEN) throw new Error('Missing SANITY_API_TOKEN');

const sanity = createClient({
  projectId: SANITY_PROJECT_ID, dataset: SANITY_DATASET, token: SANITY_TOKEN,
  apiVersion: '2025-03-01', useCdn: false,
});

const DOC_ID = '4h6ZovbNJGIiFWW2xZX6UC';
const PRICING_KEY = 'img_1773443514674_mvmmu5';
const SPLIT_KEY = 'img_1773443527599_l6o6ko';
const DECISION_KEY = 'img_1773443537960_1i2qhr';

// Marker Felt for hand-drawn look (macOS system font), Comic Sans as fallback
// Use single quotes inside since these go into SVG XML attributes (double-quoted)
const FONT = "'Marker Felt', 'Comic Sans MS', 'Bradley Hand', cursive";
const FONT_BOLD = "'Marker Felt Wide', 'Marker Felt', 'Comic Sans MS', cursive";

function pricingChartSVG() {
  const maxVal = 16500; // extra headroom so HubSpot bar doesn't hit right edge
  const chartLeft = 200;
  const chartRight = 880;
  const chartWidth = chartRight - chartLeft;
  const ghlBarW = Math.round((3564 / maxVal) * chartWidth);
  const hubBarW = Math.round((14880 / maxVal) * chartWidth);

  // Grid lines
  const gridLines = [];
  for (let x = 0; x < 1024; x += 32) {
    gridLines.push(`<line x1="${x}" y1="0" x2="${x}" y2="1024" stroke="#c8d8e8" stroke-width="0.5" opacity="0.45"/>`);
  }
  for (let y = 0; y < 1024; y += 32) {
    gridLines.push(`<line x1="0" y1="${y}" x2="1024" y2="${y}" stroke="#c8d8e8" stroke-width="0.5" opacity="0.45"/>`);
  }

  // GHL bar hatching
  const ghlHatch = [];
  for (let i = 0; i < ghlBarW; i += 16) {
    ghlHatch.push(`<line x1="${chartLeft + 5 + i}" y1="325" x2="${chartLeft + 5 + i}" y2="415" stroke="#1d4ed8" stroke-width="1.8" opacity="0.3"/>`);
  }

  // HubSpot bar hatching
  const hubHatch = [];
  for (let i = 0; i < hubBarW; i += 16) {
    hubHatch.push(`<line x1="${chartLeft + 5 + i}" y1="510" x2="${chartLeft + 5 + i}" y2="600" stroke="#dc2626" stroke-width="1.8" opacity="0.3"/>`);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <!-- Graph paper background -->
  <rect width="1024" height="1024" fill="#f8f6f0"/>
  ${gridLines.join('\n  ')}

  <!-- Title -->
  <text x="512" y="115" text-anchor="middle" font-family="${FONT_BOLD}" font-size="58" fill="#1a1a2e">Annual Cost</text>
  <text x="512" y="168" text-anchor="middle" font-family="${FONT}" font-size="32" fill="#555">Same business. 5,000 contacts.</text>

  <!-- Y axis -->
  <line x1="${chartLeft}" y1="250" x2="${chartLeft}" y2="660" stroke="#1a1a2e" stroke-width="3" stroke-linecap="round"/>
  <!-- X axis -->
  <line x1="${chartLeft - 5}" y1="660" x2="${chartRight + 20}" y2="660" stroke="#1a1a2e" stroke-width="3" stroke-linecap="round"/>

  <!-- GHL bar -->
  <rect x="${chartLeft}" y="320" width="${ghlBarW}" height="100" rx="5" fill="#2563eb" opacity="0.8"/>
  ${ghlHatch.join('\n  ')}
  <text x="${chartLeft - 15}" y="385" text-anchor="end" font-family="${FONT_BOLD}" font-size="36" fill="#2563eb">GHL</text>
  <text x="${chartLeft + ghlBarW + 14}" y="383" font-family="${FONT_BOLD}" font-size="40" fill="#1a1a2e">$3,564</text>

  <!-- HubSpot bar -->
  <rect x="${chartLeft}" y="505" width="${hubBarW}" height="100" rx="5" fill="#ef4444" opacity="0.75"/>
  ${hubHatch.join('\n  ')}
  <text x="${chartLeft - 15}" y="570" text-anchor="end" font-family="${FONT_BOLD}" font-size="36" fill="#ef4444">HubSpot</text>
  <text x="${chartLeft + hubBarW + 14}" y="568" font-family="${FONT_BOLD}" font-size="40" fill="#1a1a2e">$14,880</text>

  <!-- X-axis tick labels -->
  <line x1="${chartLeft + Math.round(chartWidth * 5000/maxVal)}" y1="655" x2="${chartLeft + Math.round(chartWidth * 5000/maxVal)}" y2="665" stroke="#1a1a2e" stroke-width="2"/>
  <text x="${chartLeft}" y="695" font-family="${FONT}" font-size="24" fill="#888">$0</text>
  <text x="${chartLeft + Math.round(chartWidth * 5000/maxVal)}" y="695" text-anchor="middle" font-family="${FONT}" font-size="24" fill="#888">$5k</text>
  <text x="${chartLeft + Math.round(chartWidth * 10000/maxVal)}" y="695" text-anchor="middle" font-family="${FONT}" font-size="24" fill="#888">$10k</text>
  <text x="${chartLeft + Math.round(chartWidth * 14880/maxVal)}" y="695" text-anchor="middle" font-family="${FONT}" font-size="24" fill="#888">$15k</text>

  <!-- Dashed arrow connecting bars -->
  <path d="M ${chartLeft + ghlBarW + 8} 420 C ${chartLeft + ghlBarW + 50} 460, ${chartLeft + hubBarW - 50} 470, ${chartLeft + hubBarW - 10} 505"
    fill="none" stroke="#555" stroke-width="2" stroke-dasharray="6,4"/>
  <polygon points="${chartLeft + hubBarW - 10},505 ${chartLeft + hubBarW - 18},492 ${chartLeft + hubBarW - 4},494" fill="#555"/>

  <!-- Callout -->
  <text x="512" y="800" text-anchor="middle" font-family="${FONT_BOLD}" font-size="42" fill="#2563eb">4.2x more expensive</text>
  <text x="512" y="850" text-anchor="middle" font-family="${FONT}" font-size="30" fill="#666">for the same 5,000 contacts</text>
</svg>`;
}

function splitComparisonSVG() {
  const leftX = 256;
  const rightX = 768;
  const itemStartY = 295;
  const itemGap = 95;

  const ghlItems = [
    'SMS + calls in one place',
    'Built-in CRM + pipeline',
    'Funnels + landing pages',
    'Review management',
    'Workflow automation',
  ];

  const hubItems = [
    'Advanced reporting',
    'Multi-touch attribution',
    'Custom objects + data',
    '1,500+ integrations',
    'Enterprise-grade CRM',
  ];

  const ghlBlocks = ghlItems.map((item, i) => {
    const y = itemStartY + i * itemGap;
    return `
    <rect x="55" y="${y}" width="395" height="70" rx="10" fill="#dbeafe" opacity="0.5"/>
    <circle cx="85" cy="${y + 38}" r="6" fill="#2563eb"/>
    <text x="105" y="${y + 46}" font-family="${FONT}" font-size="30" fill="#1a1a2e">${item}</text>`;
  }).join('');

  const hubBlocks = hubItems.map((item, i) => {
    const y = itemStartY + i * itemGap;
    return `
    <rect x="565" y="${y}" width="395" height="70" rx="10" fill="#fee2e2" opacity="0.5"/>
    <circle cx="595" cy="${y + 38}" r="6" fill="#ef4444"/>
    <text x="615" y="${y + 46}" font-family="${FONT}" font-size="30" fill="#1a1a2e">${item}</text>`;
  }).join('');

  const bottomY = itemStartY + 5 * itemGap + 20;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <!-- Whiteboard background -->
  <rect width="1024" height="1024" fill="#f5f5f0"/>

  <!-- Title -->
  <text x="512" y="80" text-anchor="middle" font-family="${FONT_BOLD}" font-size="48" fill="#1a1a2e">Different tools for different jobs</text>

  <!-- Center divider -->
  <line x1="512" y1="110" x2="512" y2="920" stroke="#1a1a2e" stroke-width="3.5" stroke-linecap="round"/>

  <!-- Left: GHL header -->
  <text x="${leftX}" y="170" text-anchor="middle" font-family="${FONT_BOLD}" font-size="44" fill="#2563eb">GoHighLevel</text>
  <text x="${leftX}" y="215" text-anchor="middle" font-family="${FONT}" font-size="27" fill="#2563eb" opacity="0.85">Consolidates communication</text>

  <!-- Left items -->
  ${ghlBlocks}

  <!-- GHL price -->
  <rect x="130" y="${bottomY}" width="250" height="60" rx="12" fill="#2563eb" opacity="0.12" stroke="#2563eb" stroke-width="2"/>
  <text x="${leftX}" y="${bottomY + 42}" text-anchor="middle" font-family="${FONT_BOLD}" font-size="36" fill="#2563eb">$297/mo</text>

  <!-- Right: HubSpot header -->
  <text x="${rightX}" y="170" text-anchor="middle" font-family="${FONT_BOLD}" font-size="44" fill="#ef4444">HubSpot</text>
  <text x="${rightX}" y="215" text-anchor="middle" font-family="${FONT}" font-size="27" fill="#ef4444" opacity="0.85">Goes deep on analytics</text>

  <!-- Right items -->
  ${hubBlocks}

  <!-- HubSpot price -->
  <rect x="642" y="${bottomY}" width="250" height="60" rx="12" fill="#ef4444" opacity="0.12" stroke="#ef4444" stroke-width="2"/>
  <text x="${rightX}" y="${bottomY + 42}" text-anchor="middle" font-family="${FONT_BOLD}" font-size="36" fill="#ef4444">$1,240/mo</text>

  <!-- Bottom note -->
  <text x="512" y="${bottomY + 120}" text-anchor="middle" font-family="${FONT}" font-size="30" fill="#555">Neither is "better." It depends on what you need.</text>
  <text x="512" y="${bottomY + 160}" text-anchor="middle" font-family="${FONT}" font-size="25" fill="#888">at 5,000 contacts</text>
</svg>`;
}

function decisionTreeSVG() {
  // Napkin-style decision flowchart
  // Diamond 1: "Agency or multiple clients?" → Yes → GHL $297, No → Diamond 2
  // Diamond 2: "Need enterprise CRM?" → Yes → HubSpot, No → GHL $97
  const inkColor = '#1a3a6a';
  const accentBlue = '#2563eb';
  const accentRed = '#ef4444';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <!-- Napkin background -->
  <rect width="1024" height="1024" fill="#f5f0e8"/>
  <!-- Subtle napkin texture lines -->
  ${Array.from({length: 20}, (_, i) => `<line x1="0" y1="${i * 52}" x2="1024" y2="${i * 52}" stroke="#e8e0d4" stroke-width="0.8" opacity="0.5"/>`).join('\n  ')}

  <!-- Title -->
  <text x="512" y="80" text-anchor="middle" font-family="${FONT_BOLD}" font-size="46" fill="${inkColor}">Which one do you actually need?</text>

  <!-- Diamond 1: Agency or multiple clients? -->
  <polygon points="512,140 720,260 512,380 304,260" fill="none" stroke="${inkColor}" stroke-width="3" stroke-linejoin="round"/>
  <text x="512" y="248" text-anchor="middle" font-family="${FONT}" font-size="28" fill="${inkColor}">Agency or</text>
  <text x="512" y="280" text-anchor="middle" font-family="${FONT}" font-size="28" fill="${inkColor}">multiple clients?</text>

  <!-- YES arrow → right → GHL $297 box -->
  <line x1="720" y1="260" x2="860" y2="260" stroke="${inkColor}" stroke-width="2.5" stroke-linecap="round"/>
  <polygon points="860,260 848,253 848,267" fill="${inkColor}"/>
  <text x="780" y="248" text-anchor="middle" font-family="${FONT_BOLD}" font-size="24" fill="#16a34a">yes</text>

  <!-- GHL $297 box -->
  <rect x="865" y="225" width="140" height="70" rx="8" fill="${accentBlue}" opacity="0.15" stroke="${accentBlue}" stroke-width="2.5"/>
  <text x="935" y="255" text-anchor="middle" font-family="${FONT_BOLD}" font-size="28" fill="${accentBlue}">GHL</text>
  <text x="935" y="283" text-anchor="middle" font-family="${FONT_BOLD}" font-size="26" fill="${accentBlue}">$297</text>

  <!-- NO arrow → down -->
  <line x1="512" y1="380" x2="512" y2="440" stroke="${inkColor}" stroke-width="2.5" stroke-linecap="round"/>
  <polygon points="512,440 505,428 519,428" fill="${inkColor}"/>
  <text x="530" y="415" font-family="${FONT_BOLD}" font-size="24" fill="${accentRed}">no</text>

  <!-- Diamond 2: Need enterprise CRM? -->
  <polygon points="512,450 720,570 512,690 304,570" fill="none" stroke="${inkColor}" stroke-width="3" stroke-linejoin="round"/>
  <text x="512" y="558" text-anchor="middle" font-family="${FONT}" font-size="28" fill="${inkColor}">Need enterprise</text>
  <text x="512" y="590" text-anchor="middle" font-family="${FONT}" font-size="28" fill="${inkColor}">CRM?</text>

  <!-- YES arrow → right → HubSpot box -->
  <line x1="720" y1="570" x2="860" y2="570" stroke="${inkColor}" stroke-width="2.5" stroke-linecap="round"/>
  <polygon points="860,570 848,563 848,577" fill="${inkColor}"/>
  <text x="780" y="558" text-anchor="middle" font-family="${FONT_BOLD}" font-size="24" fill="#16a34a">yes</text>

  <!-- HubSpot box -->
  <rect x="865" y="535" width="140" height="70" rx="8" fill="${accentRed}" opacity="0.15" stroke="${accentRed}" stroke-width="2.5"/>
  <text x="935" y="578" text-anchor="middle" font-family="${FONT_BOLD}" font-size="28" fill="${accentRed}">HubSpot</text>

  <!-- NO arrow → down → GHL $97 box -->
  <line x1="512" y1="690" x2="512" y2="760" stroke="${inkColor}" stroke-width="2.5" stroke-linecap="round"/>
  <polygon points="512,760 505,748 519,748" fill="${inkColor}"/>
  <text x="530" y="730" font-family="${FONT_BOLD}" font-size="24" fill="${accentRed}">no</text>

  <!-- GHL $97 box -->
  <rect x="442" y="770" width="140" height="70" rx="8" fill="${accentBlue}" opacity="0.15" stroke="${accentBlue}" stroke-width="2.5"/>
  <text x="512" y="800" text-anchor="middle" font-family="${FONT_BOLD}" font-size="28" fill="${accentBlue}">GHL</text>
  <text x="512" y="828" text-anchor="middle" font-family="${FONT_BOLD}" font-size="26" fill="${accentBlue}">$97</text>

  <!-- Bottom note -->
  <text x="512" y="920" text-anchor="middle" font-family="${FONT}" font-size="28" fill="#888">The decision is simpler than most comparison posts make it.</text>
</svg>`;
}

async function svgToPng(svgString) {
  return sharp(Buffer.from(svgString)).resize(1024, 1024).png().toBuffer();
}

async function mutate(mutations) {
  const res = await fetch(
    `https://${SANITY_PROJECT_ID}.api.sanity.io/v2025-03-01/data/mutate/${SANITY_DATASET}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SANITY_TOKEN}` },
      body: JSON.stringify({ mutations }),
    }
  );
  if (!res.ok) throw new Error(`Sanity error: ${await res.text()}`);
  return res.json();
}

async function uploadAndReplace(pngBuffer, filename, altText, imageKey) {
  const asset = await sanity.assets.upload('image', pngBuffer, { filename, contentType: 'image/png' });
  console.log(`  Uploaded: ${asset._id}`);

  await mutate([{
    patch: {
      id: DOC_ID,
      set: {
        [`body[_key=="${imageKey}"].asset`]: { _type: 'reference', _ref: asset._id },
        [`body[_key=="${imageKey}"].alt`]: altText,
      },
    },
  }]);
  console.log(`  Patched body[_key="${imageKey}"]`);
  return asset;
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log('Regenerating GHL vs HubSpot images (SVG → PNG)...\n');

  // 1. Pricing chart
  console.log('1. Pricing chart ($3,564 vs $14,880)');
  const pricingSvg = pricingChartSVG();
  writeFileSync(join(OUTPUT_DIR, 'ghl-vs-hubspot-pricing.svg'), pricingSvg);
  const pricingPng = await svgToPng(pricingSvg);
  writeFileSync(join(OUTPUT_DIR, 'ghl-vs-hubspot-pricing.png'), pricingPng);
  console.log(`  PNG: ${Math.round(pricingPng.length / 1024)}KB`);
  await uploadAndReplace(
    pricingPng,
    'ghl-vs-hubspot-pricing-chart.png',
    'Bar chart comparing GoHighLevel at $3,564 per year versus HubSpot at $14,880 per year for 5,000 contacts',
    PRICING_KEY,
  );

  // 2. Split comparison
  console.log('\n2. Split comparison (communication vs analytics)');
  const splitSvg = splitComparisonSVG();
  writeFileSync(join(OUTPUT_DIR, 'ghl-vs-hubspot-split.svg'), splitSvg);
  const splitPng = await svgToPng(splitSvg);
  writeFileSync(join(OUTPUT_DIR, 'ghl-vs-hubspot-split.png'), splitPng);
  console.log(`  PNG: ${Math.round(splitPng.length / 1024)}KB`);
  await uploadAndReplace(
    splitPng,
    'ghl-vs-hubspot-split-comparison.png',
    'Split comparison showing GoHighLevel consolidates communication versus HubSpot goes deep on analytics',
    SPLIT_KEY,
  );

  // 3. Decision tree
  console.log('\n3. Decision tree (which one do you need?)');
  const decisionSvg = decisionTreeSVG();
  writeFileSync(join(OUTPUT_DIR, 'ghl-vs-hubspot-decision.svg'), decisionSvg);
  const decisionPng = await svgToPng(decisionSvg);
  writeFileSync(join(OUTPUT_DIR, 'ghl-vs-hubspot-decision.png'), decisionPng);
  console.log(`  PNG: ${Math.round(decisionPng.length / 1024)}KB`);
  await uploadAndReplace(
    decisionPng,
    'ghl-vs-hubspot-decision-tree.png',
    'Decision tree flowchart for choosing between GoHighLevel and HubSpot based on business type',
    DECISION_KEY,
  );

  console.log('\nDone! All 3 images replaced on published doc.');
}

main().catch(err => { console.error('ERROR:', err.message); process.exit(1); });
