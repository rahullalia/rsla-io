/**
 * Image Style Palette for RSLA Blog Images
 *
 * Rotating styles to keep visuals fresh across posts.
 * Each style has a base prompt fragment, surface, and medium.
 *
 * RULES:
 * - Never isometric or 3D
 * - Never polished/corporate illustration
 * - Always looks human-made, imperfect, authentic
 * - Vary styles within a single blog post (don't repeat the same style twice)
 * - Featured images get the most "personality" (napkin, sticky note, whiteboard)
 * - Inline images can be cleaner (flat vector, metric viz) for readability
 */

export const IMAGE_STYLES = {
  // --- HAND-DRAWN CATEGORY ---
  napkinSketch: {
    name: 'Napkin Sketch',
    base: 'napkin sketch style, blue ballpoint pen on a crumpled white paper napkin, spontaneous, authentic, raw texture, visible ink pressure, imperfect wobbly lines',
    bestFor: ['featured', 'conceptual', 'simple flows'],
    surface: 'crumpled white paper napkin',
    medium: 'blue ballpoint pen',
  },
  notebookPencil: {
    name: 'Notebook Pencil',
    base: 'hand-drawn sketch, graphite pencil on lined notebook paper, visible pencil pressure, light eraser smudges, imperfect wobbly lines, authentic student notebook feel',
    bestFor: ['flowcharts', 'step-by-step', 'branching logic'],
    surface: 'lined notebook paper',
    medium: 'graphite pencil',
  },
  stickyNote: {
    name: 'Sticky Note',
    base: 'hand-drawn on a yellow sticky note, black felt tip marker, adhesive strip visible at top, slightly tilted on white desk, imperfect hand-written text, authentic raw feel',
    bestFor: ['checklists', 'warnings', 'quick tips', '3-5 item lists'],
    surface: 'yellow sticky note on white desk',
    medium: 'black felt tip marker',
  },
  whiteboardMarker: {
    name: 'Whiteboard Sketch',
    base: 'quick whiteboard sketch, dry erase markers in blue and red on a slightly smudged white whiteboard, marker streaks visible, imperfect hand-drawn, looks like a team brainstorm session',
    bestFor: ['comparisons', 'vs diagrams', 'strategy overviews', 'featured'],
    surface: 'white whiteboard with slight smudges',
    medium: 'dry erase markers (blue and red)',
  },
  feltTipClean: {
    name: 'Felt Tip on White',
    base: 'hand-drawn sketch, black felt tip pen on plain white paper, clean but imperfect lines, minimal style, no background texture, authentic hand-drawn feel',
    bestFor: ['diagrams', 'component breakdowns', 'icon-style illustrations'],
    surface: 'plain white paper',
    medium: 'black felt tip pen',
  },

  // --- DATA/METRIC VISUALIZATION ---
  metricViz: {
    name: 'Metric Visualization',
    base: 'hand-drawn data visualization, minimalist bar chart or pie chart sketch, blue and black ink on graph paper, numbers written by hand, axis labels hand-written, imperfect grid lines, authentic data napkin math feel',
    bestFor: ['stats', 'comparisons', 'ROI numbers', 'cost breakdowns', 'percentages'],
    surface: 'graph paper with light grid',
    medium: 'blue and black ink pen',
  },
  dashboardSketch: {
    name: 'Dashboard Sketch',
    base: 'hand-drawn dashboard mockup, pencil on white paper, showing rough boxes with numbers inside, sparkline sketches, percentage indicators, minimal wireframe feel, imperfect hand-drawn UI elements',
    bestFor: ['analytics', 'KPIs', 'performance metrics', 'conversion rates'],
    surface: 'white paper',
    medium: 'graphite pencil with blue pen accents',
  },

  // --- SPLIT/COMPARISON ---
  splitScreen: {
    name: 'Split Screen Before/After',
    base: 'hand-drawn split comparison, divided by a thick hand-drawn vertical line down the center, left side labeled "BEFORE" right side labeled "AFTER", contrasting sketches on each side, blue ballpoint pen on white paper, imperfect wobbly lines',
    bestFor: ['transformations', 'before/after', 'manual vs automated', 'old vs new'],
    surface: 'white paper',
    medium: 'blue ballpoint pen',
  },

  // --- PROCESS/FLOW ---
  processArrows: {
    name: 'Process Arrow Flow',
    base: 'hand-drawn horizontal process flow, thick arrows connecting simple labeled boxes from left to right, numbered steps, black marker on white paper, bold and simple, imperfect hand-drawn, looks like a quick planning sketch',
    bestFor: ['step-by-step processes', 'pipelines', 'workflows', 'setup guides'],
    surface: 'white paper',
    medium: 'black marker',
  },

  // --- MINIMAL FLAT ---
  minimalFlat: {
    name: 'Minimal Flat Vector',
    base: 'extremely minimal flat illustration, only 2-3 colors (muted blue, warm gray, white), simple geometric shapes, no gradients, no shadows, no 3D, no isometric, paper-cut collage feel, clean but not corporate, slight hand-made imperfection in shapes',
    bestFor: ['abstract concepts', 'category headers', 'mood/tone images'],
    surface: 'solid white or off-white background',
    medium: 'flat color shapes',
  },
  lineIcon: {
    name: 'Line Icon Style',
    base: 'single continuous line drawing, thin black line on white background, one simple object or concept, minimalist, elegant, slightly imperfect like a quick confident sketch, no fill colors, just the outline',
    bestFor: ['single concepts', 'tool icons', 'simple metaphors'],
    surface: 'white background',
    medium: 'thin black line',
  },
};

/**
 * Returns a rotation of styles for a blog post.
 * Ensures no two images in the same post use the same style.
 *
 * @param {number} blogIndex - Which blog (0-9) to pick styles for
 * @param {number} imageCount - How many images needed (typically 3-4)
 * @returns {string[]} Array of style keys
 */
export function getStyleRotation(blogIndex, imageCount = 4) {
  // Featured image style rotation (cycles through the most "personality" styles)
  const featuredRotation = [
    'napkinSketch', 'whiteboardMarker', 'splitScreen', 'stickyNote',
    'metricViz', 'napkinSketch', 'whiteboardMarker', 'feltTipClean',
    'dashboardSketch', 'processArrows',
  ];

  // Inline style pool (everything except the featured style for this blog)
  const allStyles = Object.keys(IMAGE_STYLES);
  const featured = featuredRotation[blogIndex % featuredRotation.length];

  // Pick inline styles that don't repeat the featured
  const inlinePool = allStyles.filter(s => s !== featured);

  // Deterministic shuffle based on blog index
  const shuffled = inlinePool.sort((a, b) => {
    const hashA = (blogIndex * 7 + inlinePool.indexOf(a) * 13) % 100;
    const hashB = (blogIndex * 7 + inlinePool.indexOf(b) * 13) % 100;
    return hashA - hashB;
  });

  return [featured, ...shuffled.slice(0, imageCount - 1)];
}

/**
 * Builds the full prompt for an image.
 *
 * @param {string} styleKey - Key from IMAGE_STYLES
 * @param {string} subject - What to draw (the concept)
 * @param {string} details - Specific elements to include
 * @returns {string} Complete Gemini prompt
 */
export function buildPrompt(styleKey, subject, details) {
  const style = IMAGE_STYLES[styleKey];
  if (!style) throw new Error(`Unknown style: ${styleKey}`);

  return `Simple ${subject}, ${style.base}, featuring ${details}. No computer-generated text or fonts, all text should look hand-written. The image should look authentic and human-made, not AI-generated.`;
}
