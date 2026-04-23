import { createClient } from '@sanity/client';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const client = createClient({
  projectId: 'yz25oyux',
  dataset: 'production',
  apiVersion: '2025-03-01',
  useCdn: true,
});

const SITE_URL = 'https://rsla.io';

async function generateLlmsTxt() {
  console.log('Generating llms.txt...');

  const blogPosts = await client.fetch(
    `*[_type == "blogPostV2" && status == "published" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc) {
      title,
      "slug": slug.current,
      excerpt
    }`
  );

  const caseStudies = await client.fetch(
    `*[_type == "caseStudyV2" && status == "published" && defined(slug.current)] | order(priority asc) {
      title,
      "slug": slug.current,
      description
    }`
  );

  const lines = [
    '# RSL/A',
    '',
    '> RSL/A shows founders how to put AI to work in their business, then builds it for them. We design and implement AI lead generation systems, automation infrastructure, CRM operations, and smart websites that replace manual work with intelligent systems.',
    '',
    '## Services',
    '',
    '- Websites: New builds and full rebuilds. Fast, custom-designed, SEO-ready websites built on React and Next.js.',
    '- Search Visibility: Rankings on Google, ChatGPT, Perplexity, and Claude. SEO, AEO, and content systems.',
    '- AI Automations: n8n, Make, and custom AI agents that replace manual work. Lead follow-up, proposals, content, reporting.',
    '- CRM Systems: GoHighLevel pipelines, workflows, and integrations. One system managing leads, bookings, and communication.',
    '- Custom Development: SaaS products, MVPs, internal tools, and APIs. Full-stack builds from prototype to production.',
    '',
    '## Blog Posts',
    '',
  ];

  for (const post of blogPosts) {
    const excerpt = post.excerpt ? `: ${post.excerpt}` : '';
    lines.push(`- [${post.title}](${SITE_URL}/blog/${post.slug})${excerpt}`);
    lines.push(`  LLM-optimized: ${SITE_URL}/api/llm/${post.slug}`);
  }

  lines.push('', '## Case Studies', '');

  for (const cs of caseStudies) {
    const desc = cs.description ? `: ${cs.description}` : '';
    lines.push(`- [${cs.title}](${SITE_URL}/work/${cs.slug})${desc}`);
    lines.push(`  LLM-optimized: ${SITE_URL}/api/llm/${cs.slug}`);
  }

  lines.push(
    '',
    '## Links',
    '',
    `- Website: ${SITE_URL}`,
    `- Blog: ${SITE_URL}/blog`,
    `- Case Studies: ${SITE_URL}/work`,
    `- Book a Call: ${SITE_URL}/book-a-call`,
    `- Sitemap: ${SITE_URL}/sitemap.xml`,
    `- RSS Feed: ${SITE_URL}/rss.xml`,
    ''
  );

  const output = lines.join('\n');
  const outputPath = resolve(__dirname, '../dist/llms.txt');
  writeFileSync(outputPath, output, 'utf-8');
  console.log(
    `llms.txt generated: ${blogPosts.length} blog posts, ${caseStudies.length} case studies`
  );
}

generateLlmsTxt().catch((err) => {
  console.warn('llms.txt generation skipped (non-fatal):', err.message || err);
});
