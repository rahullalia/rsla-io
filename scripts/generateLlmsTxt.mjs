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
    `*[_type in ["caseStudy", "caseStudyV2"] && defined(slug.current)] | order(priority asc) {
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
    '- AI Lead Generation: Paid ads with AI optimization that generate qualified leads and book calls automatically.',
    '- AI Automations: Custom AI systems that automate lead nurture, follow-ups, CRM workflows, and business operations.',
    '- AI Operations: CRM infrastructure, dashboards, and intelligent reporting systems that run your business.',
    '- Smart Websites: High-converting websites built for lead capture and search visibility.',
    '- Local SEO: Google Business Profile optimization, local search rankings, and review management.',
    '',
    '## Blog Posts',
    '',
  ];

  for (const post of blogPosts) {
    const excerpt = post.excerpt ? `: ${post.excerpt}` : '';
    lines.push(`- [${post.title}](${SITE_URL}/api/llm/${post.slug})${excerpt}`);
  }

  lines.push('', '## Case Studies', '');

  for (const cs of caseStudies) {
    const desc = cs.description ? `: ${cs.description}` : '';
    lines.push(`- [${cs.title}](${SITE_URL}/api/llm/${cs.slug})${desc}`);
  }

  lines.push(
    '',
    '## Links',
    '',
    `- Website: ${SITE_URL}`,
    `- Blog: ${SITE_URL}/blog`,
    `- Case Studies: ${SITE_URL}/work`,
    `- Book a Call: ${SITE_URL}/start-here`,
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
  console.error('Failed to generate llms.txt:', err);
  process.exit(1);
});
