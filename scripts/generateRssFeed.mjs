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
const FEED_TITLE = 'RSL/A Blog';
const FEED_DESCRIPTION = 'Insights on marketing automation, AI systems, local SEO, and business growth strategies from RSL/A.';

function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function generateRssFeed() {
  console.log('Generating RSS feed...');

  const posts = await client.fetch(
    `*[_type == "blogPostV2" && status == "published" && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc) [0...50] {
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      "authorName": author->name,
      "categories": categories[]->name
    }`
  );

  const buildDate = new Date().toUTCString();

  const items = posts.map((post) => {
    const link = `${SITE_URL}/blog/${post.slug}`;
    const pubDate = new Date(post.publishedAt).toUTCString();
    const categories = (post.categories || [])
      .map((cat) => `      <category>${escapeXml(cat)}</category>`)
      .join('\n');

    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(post.excerpt || '')}</description>
      <pubDate>${pubDate}</pubDate>
      <dc:creator>${escapeXml(post.authorName || 'Rahul Lalia')}</dc:creator>
${categories}
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items.join('\n')}
  </channel>
</rss>`;

  const outputPath = resolve(__dirname, '../dist/rss.xml');
  writeFileSync(outputPath, xml, 'utf-8');
  console.log(`RSS feed generated: ${posts.length} posts`);
}

generateRssFeed().catch((err) => {
  console.error('ERROR: RSS feed generation FAILED:', err.message || err);
  process.exitCode = 1;
});
