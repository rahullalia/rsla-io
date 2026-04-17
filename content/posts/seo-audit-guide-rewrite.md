# Complete SEO audit guide: 16 steps to boost your rankings

Last quarter, a client came to us frustrated. They'd been blogging for a year, posting twice a week, and their organic traffic was flat. Forty posts. Zero movement. They were convinced "SEO doesn't work anymore."

We ran a full SEO audit. Found the problem in about 20 minutes. Their site had no SSL certificate (still on HTTP), their page speed score was 28 out of 100 on mobile, and 6 of their blog posts were cannibalizing each other for the same keyword.

After fixing those three issues, their organic traffic grew 34% in 60 days. No new content. No backlink campaigns. Just fixing what was already broken.

An SEO audit is a systematic review of your website to identify technical issues, content gaps, and off-page signals that are hurting your search rankings. It tells you exactly what's broken, what's missing, and what to fix first for the biggest impact.

That's what this guide is. Not theory. The actual 16-step audit process we run for every client at RSL/A.

## Step 1: Crawl your website for technical issues

Before you look at content or keywords, you need to know the technical state of your site. A crawler finds broken links, missing meta tags, redirect chains, orphan pages, and other issues that Google's bots hit every time they visit.

Use Screaming Frog (free for up to 500 URLs) or Ahrefs Site Audit. Run a full crawl and export the issues list. Sort by severity.

What you're looking for:
- **Broken links (404s):** Pages that don't exist anymore. Fix with redirects or by updating the link.
- **Redirect chains:** A page redirects to another page that redirects to another. Each hop loses PageRank. Flatten the chain.
- **Missing title tags or meta descriptions:** Every page needs both. No exceptions.
- **Duplicate content:** Multiple URLs serving the same content. Consolidate with canonical tags.

This single step typically surfaces 60% to 80% of a site's SEO problems.

## Step 2: Check your HTTPS security

If your site is still on HTTP (no SSL certificate), stop reading and fix this first. Google has used HTTPS as a ranking signal since 2014. In 2026, an HTTP site is actively penalized.

Check: type your domain in the browser. Do you see a padlock icon? If not, your host can usually install a free SSL certificate (Let's Encrypt) in minutes.

Also check for mixed content warnings. That's when your site loads over HTTPS but some images or scripts still load over HTTP. Your crawler should flag these.

## Step 3: Analyze your page speed

Google's Core Web Vitals are a confirmed ranking factor. Slow sites rank lower. Period.

Run your site through [Google PageSpeed Insights](https://pagespeed.web.dev/). You want:
- **Performance score:** 90+ on mobile (where most searches happen)
- **Largest Contentful Paint (LCP):** Under 2.5 seconds
- **Cumulative Layout Shift (CLS):** Under 0.1
- **First Input Delay (FID):** Under 100ms

Common fixes:
- Compress images (use WebP format, not PNG or JPEG)
- Enable browser caching
- Minimize JavaScript and CSS
- Use a CDN (Vercel, Cloudflare, or your host's built-in CDN)
- Lazy-load images below the fold

Our client's site went from a speed score of 28 to 87 just by compressing images and switching to a CDN. That's a 30-minute fix with massive ranking impact.

## Step 4: Review your organic traffic patterns

Open Google Search Console and Google Analytics. Look at the last 12 months of data.

Key questions:
- Is organic traffic trending up, flat, or down?
- Which pages get the most impressions but lowest click-through rate? (These need better meta titles and descriptions.)
- Which pages rank on positions 4 to 10? (These are your quick wins. A small push gets them to page 1.)
- Are there sudden traffic drops? (Could indicate a Google algorithm update, a technical issue, or a manual penalty.)

We use Google Search Console's Performance report filtered by "Position" to find pages ranking 4 to 10. These are the pages closest to the first page. Often, updating the content and meta description is enough to push them over.

## Step 5: Clean up your URL structure

Good URLs are short, descriptive, and contain the target keyword. Bad URLs are long, coded, and meaningless.

- Good: `rsla.io/blog/seo-audit-guide`
- Bad: `example.com/blog/2025/11/17/complete-seo-audit-guide-16-essential-steps-to-boost-your-rankings`

Check for:
- URLs with dates (remove them if possible without breaking existing links)
- URLs with parameters (`?id=123&sort=date`)
- URLs with capital letters (lowercase is the standard)
- URL depth (keep it under 3 levels: `domain.com/category/page`)

Don't change URLs on pages that already rank well. Set up 301 redirects if you must change a URL, and do it in bulk to minimize the impact.

## Step 6: Audit your content quality

This is where most audits get interesting. Pull up every page on your site and evaluate:

- **Word count:** Pages under 500 words rarely rank for competitive keywords. Aim for 2,000+ for blog content.
- **Primary keyword:** Does every page target a specific keyword? Is it in the H1, the first 100 words, and the meta title?
- **Freshness:** When was the content last updated? Google rewards fresh content, especially for topics that change (pricing, tools, regulations).
- **Uniqueness:** Is the content saying something your competitors aren't? Or is it the same 10 tips everyone else publishes?
- **E-E-A-T signals:** Does the content demonstrate Experience, Expertise, Authoritativeness, and Trustworthiness? Named authors, specific examples, real data, and cited sources all help.

Flag every page that doesn't meet these criteria. Decide whether to update, merge, or delete it.

## Step 7: Find and fix keyword cannibalization

Keyword cannibalization happens when two or more pages on your site compete for the same keyword. Google can't decide which one to rank, so it ranks neither well.

How to find it: In Google Search Console, go to Performance, filter by a specific keyword, and look at which pages appear. If multiple pages show up for the same keyword, you have cannibalization.

Fixes:
- **Merge the pages.** Combine the best content from both into one definitive page. 301 redirect the weaker page.
- **Differentiate the intent.** If one page targets "GoHighLevel pricing" and another targets "GoHighLevel pricing comparison," they can coexist because the search intent is different.
- **Use canonical tags.** If you need both pages to exist, point one to the other as the canonical version.

We found 6 cannibalization instances on a client's site. Merging those pages into 3 stronger pages lifted their rankings for all target keywords within 4 weeks.

## Step 8: Eliminate duplicate content

Duplicate content confuses search engines and splits your PageRank. Common causes:
- WWW vs non-WWW versions of your site (fix with redirects)
- HTTP vs HTTPS versions (fix with HTTPS redirect)
- Trailing slashes (`/page/` vs `/page`)
- Printer-friendly or AMP versions without canonical tags
- Product descriptions copied from manufacturer sites

Use your crawler's duplicate content report. Add canonical tags or 301 redirects to consolidate.

## Step 9: Analyze your backlink profile

Backlinks (other sites linking to yours) remain one of the top 3 ranking factors. Use Ahrefs, Semrush, or Moz to analyze:

- **Total backlinks and referring domains:** More referring domains is better than more total links.
- **Domain authority of linking sites:** A link from a DA 70 news site is worth more than 100 links from DA 10 directories.
- **Anchor text distribution:** Natural anchor text is varied. If 80% of your anchors are your exact target keyword, it looks spammy.
- **Toxic links:** Links from spam sites, link farms, or irrelevant foreign-language sites. Use Google's Disavow Tool for these.

For local service businesses, the most effective backlink sources are: local news sites, Chamber of Commerce, industry associations, partner businesses, and local event sponsorships.

## Step 10: Optimize your images

Images affect both page speed and ranking potential.

Checklist:
- Every image has descriptive alt text (not "IMG_4523.jpg")
- Images are compressed and in WebP format
- File names are descriptive and keyword-relevant (`seo-audit-checklist.webp` not `screenshot1.png`)
- Images are properly sized (don't load a 4000px image in a 800px container)
- Lazy loading is enabled for images below the fold

Google Images drives a surprising amount of traffic. Properly optimized images can rank in both regular search and image search.

## Step 11: Test mobile responsiveness

Over 60% of searches happen on mobile. If your site doesn't work perfectly on a phone, you're losing more than half your potential traffic.

Use Google's [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly) and manually test on your own phone:
- Can you read all text without zooming?
- Are buttons and links easy to tap?
- Does the layout adapt properly?
- Do forms work smoothly?
- Is the navigation accessible?

Google uses mobile-first indexing, meaning it primarily evaluates the mobile version of your site for ranking. Desktop-only optimization is a dead strategy.

## Step 12: Audit your social media signals

Social signals aren't a direct ranking factor, but they amplify your SEO efforts:
- Social shares drive traffic to your content, which signals relevance to Google
- Social profiles rank in branded search results, giving you more real estate on page 1
- Active social presence builds brand authority, which feeds into E-E-A-T

Check that your social media profiles link to your website, your website links to your social profiles, and your content is shareable (Open Graph tags, Twitter cards, share buttons).

## Step 13: Optimize your meta descriptions

Meta descriptions don't directly affect rankings, but they massively affect click-through rate. A higher CTR tells Google your result is relevant, which can boost your ranking indirectly.

For every page:
- Keep under 155 characters
- Include the primary keyword naturally
- Include a value hook or CTA ("Learn how...", "Get the free checklist...")
- Write unique descriptions for every page (no duplicates)

We rewrote meta descriptions on 15 blog posts for a client and saw their average CTR increase from 2.1% to 3.8% in 30 days. That's an 80% improvement from just changing the meta descriptions.

## Step 14: Create your ongoing SEO checklist

An audit is a snapshot. To maintain and improve rankings, you need an ongoing process:

**Weekly:** Publish fresh content. Monitor keyword rankings for movement.

**Monthly:** Check Google Search Console for new errors. Review page speed. Analyze top-performing and declining pages.

**Quarterly:** Run a full site crawl. Update stale content. Check backlink profile for new toxic links. Review competitor rankings.

**Annually:** Complete the full 16-step audit again. SEO is never "done."

## Step 15: Implement schema markup

Schema markup helps search engines understand your content and can trigger rich snippets (FAQ dropdowns, star ratings, how-to cards, event details).

Priority schemas for most businesses:
- **Organization schema:** Your business name, logo, social profiles
- **LocalBusiness schema:** Address, phone, hours (essential for local SEO)
- **FAQ schema:** Question and answer pairs from your content
- **Article/BlogPosting schema:** Author, publish date, featured image
- **BreadcrumbList schema:** Your site's navigation hierarchy

Use Google's [Rich Results Test](https://search.google.com/test/rich-results) to validate your markup. Every page with FAQ content should have FAQPage schema for [rich snippet eligibility](https://rsla.io/blog/answer-engine-optimization-aeo-guide).

## Step 16: Implement, monitor, and iterate

Don't try to fix everything at once. Prioritize by impact:

1. **Critical fixes first:** HTTPS, broken pages, page speed. These block everything else.
2. **Quick wins second:** Meta descriptions on pages ranking 4 to 10, keyword cannibalization merges, missing alt text.
3. **Growth plays third:** New content targeting gap keywords, backlink outreach, schema markup.

Set up weekly monitoring in Google Search Console to track the impact of your changes. Most technical fixes show results within 2 to 4 weeks. Content updates take 4 to 8 weeks. Backlink growth takes 2 to 6 months.

## The bottom line

An SEO audit isn't glamorous work. But it's the work that separates sites that rank from sites that don't.

The 16 steps above are the exact audit process we run at RSL/A for every client engagement. Most sites have 10 to 15 fixable issues that are actively hurting their rankings. Find them, fix them in order of impact, and the traffic follows.

If you'd rather have someone run the audit for you, [book a 30-minute call](https://rsla.io/contact) and we'll do a quick assessment of your site's biggest SEO gaps and map out the fixes.
