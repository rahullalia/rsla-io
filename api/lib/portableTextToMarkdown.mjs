/**
 * Portable Text to Markdown Converter
 *
 * Converts Sanity Portable Text blocks into clean markdown for LLM consumption.
 * Handles headings, lists, marks (bold/italic/code/links), images, code blocks,
 * callouts, stats, testimonials, and tech stacks. Skips interactive elements
 * (CTA buttons, gated resources, video embeds) that aren't useful for AI readers.
 */

function processMarks(child, markDefs = []) {
  let text = child.text || '';
  if (!text) return '';

  const marks = child.marks || [];

  for (const mark of marks) {
    switch (mark) {
      case 'strong':
        text = `**${text}**`;
        break;
      case 'em':
        text = `*${text}*`;
        break;
      case 'code':
        text = `\`${text}\``;
        break;
      case 's':
        text = `~~${text}~~`;
        break;
      default: {
        // Check for link annotations
        const def = markDefs.find((d) => d._key === mark);
        if (def?.href) {
          text = `[${text}](${def.href})`;
        }
      }
    }
  }

  return text;
}

function processBlockChildren(block) {
  if (!block.children) return '';
  return block.children.map((child) => processMarks(child, block.markDefs)).join('');
}

export function portableTextToMarkdown(blocks) {
  if (!blocks || !Array.isArray(blocks)) return '';

  const lines = [];
  let prevWasList = false;

  for (const block of blocks) {
    // Handle list items
    if (block._type === 'block' && block.listItem) {
      const text = processBlockChildren(block);
      const indent = '  '.repeat((block.level || 1) - 1);
      const prefix = block.listItem === 'number' ? '1.' : '-';
      lines.push(`${indent}${prefix} ${text}`);
      prevWasList = true;
      continue;
    }

    // End of list — add blank line
    if (prevWasList) {
      lines.push('');
      prevWasList = false;
    }

    // Standard text blocks
    if (block._type === 'block') {
      const text = processBlockChildren(block);

      switch (block.style) {
        case 'h2':
          lines.push(`## ${text}`, '');
          break;
        case 'h3':
          lines.push(`### ${text}`, '');
          break;
        case 'h4':
          lines.push(`#### ${text}`, '');
          break;
        case 'blockquote':
          lines.push(`> ${text}`, '');
          break;
        default:
          if (text.trim()) {
            lines.push(text, '');
          }
          break;
      }
      continue;
    }

    // Images (both blog and case study variants)
    if (block._type === 'image' || block._type === 'caseStudyImage') {
      const alt = block.alt || block.asset?.alt || 'Image';
      const caption = block.caption || '';
      if (caption) {
        lines.push(`![${alt}](${caption})`, '');
      } else {
        lines.push(`![${alt}]`, '');
      }
      continue;
    }

    // Code blocks
    if (block._type === 'code') {
      const lang = block.language || '';
      lines.push(`\`\`\`${lang}`, block.code || '', '```', '');
      continue;
    }

    // Callout boxes
    if (block._type === 'callout') {
      const label = (block.type || 'note').toUpperCase();
      if (block.title) {
        lines.push(`> **${label}: ${block.title}**`);
      } else {
        lines.push(`> **${label}**`);
      }
      if (block.content) {
        const contentLines = block.content.split('\n');
        for (const line of contentLines) {
          lines.push(`> ${line}`);
        }
      }
      lines.push('');
      continue;
    }

    // Stats cards
    if (block._type === 'statsCard') {
      const stats = block.stats || [];
      for (const stat of stats) {
        lines.push(`- **${stat.value}**: ${stat.label}`);
      }
      lines.push('');
      continue;
    }

    // Testimonials
    if (block._type === 'testimonial') {
      lines.push(`> "${block.quote}"`);
      if (block.author) {
        const attribution = block.role ? `${block.author}, ${block.role}` : block.author;
        lines.push(`> — ${attribution}`);
      }
      lines.push('');
      continue;
    }

    // Tech stack
    if (block._type === 'techStack') {
      const tools = block.tools || [];
      for (const tool of tools) {
        if (tool.url) {
          lines.push(`- [${tool.name}](${tool.url})${tool.promo ? `: ${tool.promo}` : ''}`);
        } else {
          lines.push(`- ${tool.name}${tool.promo ? `: ${tool.promo}` : ''}`);
        }
      }
      lines.push('');
      continue;
    }

    // Dividers
    if (block._type === 'divider') {
      lines.push('---', '');
      continue;
    }

    // Skip interactive/non-text elements
    // videoEmbed, ctaButton, gatedResource — not useful for LLMs
  }

  // End of list at end of document
  if (prevWasList) {
    lines.push('');
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
