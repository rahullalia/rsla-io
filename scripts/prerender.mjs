/**
 * Pre-render static HTML for all indexed pages.
 *
 * Runs after `vite build`. For each page:
 * 1. Reads the built dist/index.html as template (has all hashed script/link tags)
 * 2. Replaces meta tags (title, description, OG, Twitter, canonical) with page-specific values
 * 3. Injects semantic HTML content into <div id="root">...</div>
 * 4. Writes to the correct filesystem path (e.g., dist/about/index.html)
 *
 * Vercel serves filesystem files before rewrites, so pre-rendered pages
 * get served directly. React's createRoot().render() replaces the injected
 * content when JS loads — users see normal SPA behavior.
 */

import { createClient } from '@sanity/client';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import { portableTextToMarkdown } from '../api/lib/portableTextToMarkdown.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, '../dist');
const SITE = 'https://rsla.io';

const client = createClient({
  projectId: 'yz25oyux',
  dataset: 'production',
  apiVersion: '2025-03-01',
  useCdn: true,
});

// ── Utilities ─────────────────────────────────────────────────────────────────

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function inject(tmpl, { title, description, canonical, jsonLd, html, ogImage }) {
  let p = tmpl;

  p = p.replace(/<title>.*?<\/title>/, `<title>${esc(title)}</title>`);
  p = p.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${esc(description)}" />`
  );

  p = p.replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(title)}" />`);
  p = p.replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(description)}" />`);
  p = p.replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${esc(canonical)}" />`);

  if (ogImage) {
    p = p.replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${esc(ogImage)}" />`);
    p = p.replace(/<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${esc(ogImage)}" />`);
  }

  p = p.replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(title)}" />`);
  p = p.replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${esc(description)}" />`);

  p = p.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${esc(canonical)}" />`);

  if (jsonLd) {
    const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
    const scripts = schemas.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n');
    p = p.replace('</head>', `${scripts}\n</head>`);
  }

  p = p.replace('<div id="root"></div>', `<div id="root">${html}</div>`);

  return p;
}

function writePage(route, content) {
  const filePath = route === '/'
    ? resolve(DIST, 'index.html')
    : resolve(DIST, route.replace(/^\//, ''), 'index.html');
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(filePath, content, 'utf-8');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function ptToHtml(blocks) {
  if (!blocks) return '';
  const md = portableTextToMarkdown(blocks);
  if (!md) return '';
  return marked.parse(md);
}

// ── Static Pages ──────────────────────────────────────────────────────────────

function homeContent() {
  return {
    title: 'RSL/A | Intelligent Marketing Systems',
    description: 'We show founders how to put AI to work, then build it for them. AI lead generation, automations, and smart operations for scaling businesses.',
    canonical: SITE,
    jsonLd: [
      {
        '@context': 'https://schema.org', '@type': 'Organization',
        name: 'RSL/A', alternateName: ['RSLA', 'RSL/A', 'RSL A', 'RSL/A Agency'],
        url: SITE, logo: `${SITE}/images/logo/lockup-nobg.webp`,
        description: 'We show founders how to put AI to work, then build it for them. AI lead generation, automations, and smart operations for scaling businesses.',
        founder: { '@type': 'Person', name: 'Rahul Lalia', jobTitle: 'Founder & CEO' },
        sameAs: [
          'https://www.instagram.com/rahulslalia/',
          'https://www.linkedin.com/in/rahullalia/',
          'https://www.youtube.com/@rahul_lalia',
          'https://www.tiktok.com/@rahul_lalia',
          'https://x.com/rahul_lalia',
        ],
      },
      { '@context': 'https://schema.org', '@type': 'WebSite', name: 'RSL/A', alternateName: ['RSLA', 'RSL/A', 'RSL A'], url: SITE },
    ],
    html: `<main>
<h1>Your business is doing manually what AI could do in seconds.</h1>
<p><a href="/start-here">Build My System</a> | <a href="/work">See What We've Built</a></p>

<section><h2>What We Build</h2>
<article><h3>01 — Lead Gen: Leads that find you.</h3>
<p>We set up ad systems across Facebook and Google that test creatives, kill what's not working, and scale what is. Every dollar tracked, every lead scored, every qualified prospect fed straight into your pipeline.</p></article>
<article><h3>02 — AI Automation: Booking calls while you sleep.</h3>
<p>Someone messages at 2 AM. By 2:01 AM they have a calendar invite. No human touched it. We build bots and automations that qualify leads, answer questions, and chase follow-ups. All without you.</p></article>
<article><h3>03 — Operations: One brain running your business.</h3>
<p>Your CRM says one thing, your calendar says another. We wire it all into one system. Leads, pipeline, bookings, reporting. One dashboard that tells you exactly what needs attention.</p></article>
</section>

<section><h2>By the Numbers</h2>
<ul><li>40+ clients served</li><li>$2.1M+ revenue generated</li><li>12 case studies</li><li>98% client retention</li></ul>
</section>

<section><h2>What Clients Say</h2>
<blockquote><p>I recently hired Rahul to revamp our company website, and I couldn't be more thrilled with the results! Their expertise and dedication transformed my site by restructuring it, fixing critical errors, and significantly boosting its performance. Thanks to their outstanding work on on-page SEO and ongoing SEO efforts, my website has seen a remarkable increase in organic traffic and a substantial improvement in qualified inbound lead generation.</p><cite>Sid S., Account Executive, SBC</cite></blockquote>
<blockquote><p>Working with Rahul on my GoHighLevel setup was an excellent experience. He was extremely knowledgeable, responsive, and efficient from start to finish. Rahul quickly understood what I needed and structured my GHL account properly. Pipelines, automations, workflows, integrations, and overall system flow.</p><cite>Curtis H., CEO/Founder, AdReviveAI</cite></blockquote>
<blockquote><p>Rahul redesigned our website, handled SEO optimization, and set up blogging automation. Site looks great, ranks better, and the automation saves us tons of time. Great communication and delivered on schedule. Highly recommend.</p><cite>Chris K., CEO/Co-Founder, Fieldshare</cite></blockquote>
<blockquote><p>I tried for months to rent my salon space and nothing worked. After Rahul and RSL/A, in just a few months both my rooms were filled. Now I don't stress about rent anymore.</p><cite>Laiz C., CEO, Casagrande Salon</cite></blockquote>
<blockquote><p>Rahul does a stellar job on setting up GHL accounts. He is an expert and gave me immense knowledge about the platform. Would love to work with him again. Highly recommend anyone who wants an expert on Go High Level.</p><cite>Parminder S., CEO/Founder, Chauffeur on Demand</cite></blockquote>
</section>

<section><h2>About the Founder</h2>
<p>I have spent the better part of five years in the trenches of marketing, automation, and business infrastructure. Started in analytics. Got laid off. Built an agency from nothing. And along the way, I watched founders with real talent suffocate under work that never should have touched their hands.</p>
<p>That became the only question worth answering: how do you build systems that actually run a business, not just look good in a demo?</p>
<p>I put everything out there. The strategies, the tools, the exact workflows. You can learn all of it from my content. But knowing how it works and actually building it so it holds under pressure and scales without breaking? That demands precision. That is what RSL/A exists to do.</p>
<p>— Rahul Lalia, Founder, RSL/A</p>
</section>

<section><h2>Frequently Asked Questions</h2>
<dl>
<dt>What types of businesses do you work with?</dt><dd>We work with service-based businesses, local operators, and B2B companies doing $500K+ in revenue who want to systematize their marketing and operations. If you rely on leads, appointments, or repeat customers to grow, we can help.</dd>
<dt>How long does it take to see results?</dt><dd>Most clients see measurable results within 30 to 60 days. Ad campaigns typically start generating leads within the first week. Automation systems go live in 2 to 3 weeks. Full CRM and operations buildouts take 4 to 6 weeks depending on complexity.</dd>
<dt>Do you lock clients into long-term contracts?</dt><dd>No. We work on a month-to-month basis after the initial setup period. We believe in earning your business every month. If we're not delivering, you shouldn't be stuck.</dd>
<dt>What platforms do you use?</dt><dd>We primarily use GoHighLevel for CRM and automation, Meta and Google for paid ads, and custom AI tools built on OpenAI, Make, and Zapier. We pick the right tool for the job, not the one that pays us the most.</dd>
<dt>How is RSL/A different from other marketing agencies?</dt><dd>We don't just run ads. We build the entire system: lead generation, automated follow-up, CRM, booking, and reporting. Most agencies hand you leads and call it a day. We make sure those leads turn into revenue.</dd>
<dt>Do you offer white-label services for other agencies?</dt><dd>Yes. We partner with agencies who need AI automation, CRM buildouts, or technical infrastructure they cannot build in-house. Reach out and we can discuss your setup.</dd>
<dt>What does the onboarding process look like?</dt><dd>It starts with a strategy call where we audit your current setup. Then we deliver a custom roadmap within 48 hours. Once approved, we start building. Most clients are fully live within 2 to 4 weeks.</dd>
</dl>
</section>

<section><h2>Ready to put AI to work?</h2>
<p><a href="/start-here">Build My System</a></p>
</section>
</main>`,
  };
}

function aboutContent() {
  return {
    title: 'About | RSL/A',
    description: 'Meet Rahul Lalia, founder of RSL/A. Five years in marketing, automation, and business infrastructure, building systems that actually run businesses.',
    canonical: `${SITE}/about`,
    jsonLd: {
      '@context': 'https://schema.org', '@type': 'Person',
      name: 'Rahul Lalia', jobTitle: 'Founder & CEO',
      url: `${SITE}/about`, image: `${SITE}/images/rahul.webp`,
      worksFor: { '@type': 'Organization', name: 'RSL/A', url: SITE },
      sameAs: [
        'https://www.linkedin.com/in/rahullalia/',
        'https://www.instagram.com/rahul.lalia/',
        'https://www.youtube.com/@rahul_lalia',
        'https://www.tiktok.com/@rahul_lalia',
        'https://github.com/rahullalia',
      ],
    },
    html: `<main>
<h1>"What a privilege to be tired from work you once begged the universe for..."</h1>

<section><h2>How it started</h2>
<p>I started my career in marketing analytics. Numbers, dashboards, attribution models. I was the guy staring at spreadsheets while everyone else was making the creative decisions.</p>
<p>Then I got laid off.</p>
<p>And honestly? It was the best thing that happened to me. Because it forced me to build something on my own.</p>
<p>I started an agency. The classic social media marketing agency thing. Posting content, running accounts, doing the hustle. But I kept noticing the same pattern with every client I worked with.</p>
<p>They were not struggling because they lacked talent. They were drowning in manual work.</p>
<p>Following up with leads at midnight. Copy-pasting between three different tools. Losing deals because they forgot to reply. Running ads with zero tracking. Paying for five different software subscriptions that did not talk to each other.</p>
<p>And you know what? Most of the "solutions" out there made it worse. More tools, more complexity, more things to manage.</p>
<p>So I started asking a different question. What if AI could handle all the stuff that founders should not be doing manually? Not theoretical AI. Not "we will build you a chatbot" AI. Practical, measured, actually-useful-for-your-business AI. That became the whole thing.</p>
</section>

<section><h2>What I actually do</h2>
<p>I show founders how to put AI to work in their business. Then I build it for them.</p>
<p>The teaching part is free. I post the workflows, the tools, the exact systems. No gatekeeping. If you can build it yourself after watching my content, I genuinely want that for you.</p>
<p>But here is the thing. There is a difference between knowing what to build and building it right. A system that works for 10 leads breaks at 500. An AI bot that sounds great in a demo falls apart with real customers. The gap between a prototype and a production system is where most founders get stuck. That is where RSL/A comes in. My team and I are the ones who build the production version. The one that actually scales, actually handles edge cases, and actually shows you the numbers so you know it is working.</p>
</section>

<section><h2>Why I am different</h2>
<p>I came from analytics. That matters.</p>
<p>Most people in this space show you a demo and call it done. I show you a dashboard. Real numbers. What the AI system did this week, how many leads it handled, how many meetings it booked, what the conversion rate was. Because if you cannot measure it, it is just a toy. And founders do not need toys. They need infrastructure.</p>
</section>

<p><a href="/work">See what we have built</a></p>

<section><h2>Words I Like</h2>
<blockquote><p>What a privilege to be tired from work you once begged the universe for. What a privilege to feel overwhelmed by growth you used to dream about. What a privilege to be challenged by a life you created on purpose. What a privilege to outgrow things you used to settle for.</p><cite>Aryan Sachdeva, via Medium</cite></blockquote>
</section>
</main>`,
  };
}

function servicesContent() {
  return {
    title: 'Services | RSL/A',
    description: 'AI automation, paid advertising, CRM implementation, and local SEO. Real systems that generate leads, book calls, and run your operations.',
    canonical: `${SITE}/services`,
    jsonLd: {
      '@context': 'https://schema.org', '@type': 'ProfessionalService',
      name: 'RSL/A', url: `${SITE}/services`,
      description: 'AI automation, paid advertising, CRM implementation, and local SEO. Real systems that generate leads, book calls, and run your operations.',
      provider: { '@type': 'Organization', name: 'RSL/A', url: SITE },
      hasOfferCatalog: {
        '@type': 'OfferCatalog', name: 'Marketing & AI Services',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Lead Generation', description: 'Paid ads with AI optimization that generate qualified leads and book calls automatically.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Automations', description: 'Custom AI systems that automate lead nurture, follow-ups, CRM workflows, and business operations.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Operations', description: 'CRM infrastructure, dashboards, and intelligent reporting systems that run your business.' } },
        ],
      },
    },
    html: `<main>
<h1>Everything we build runs on AI.</h1>
<p>We do not do "marketing." We build AI infrastructure for founders. Here is what that actually means.</p>

<section id="lead-generation"><h2>Lead Gen: Stop paying for clicks. Start paying for customers.</h2>
<h3>The Problem</h3>
<p>Most founders either boost posts and hope for the best, or they hire an agency that shows them impressions and reach numbers. Neither gets you customers.</p>
<h3>What We Build</h3>
<ul>
<li><strong>Targeting that learns:</strong> Your campaigns learn which audiences convert and shift budget toward them automatically. No manual bid adjustments.</li>
<li><strong>Creative testing at scale:</strong> We test dozens of ad variations simultaneously. AI identifies the winners and kills the losers before they waste your money.</li>
<li><strong>Pipeline integration:</strong> Every qualified lead flows directly into your CRM. Tagged, scored, and ready for follow-up. No spreadsheets, no manual entry.</li>
<li><strong>Real-time dashboards:</strong> You see exactly what your ad spend is producing. Not vanity metrics. Revenue metrics.</li>
</ul>
<p><em>$600 in ad spend turned into $36,000 in closed revenue in 45 days. That is a 60x return. Not because of magic creative. Because the AI system optimized faster than any human could.</em></p>
</section>

<section id="automations"><h2>Zero Manual Work: Your business should not stop working when you do.</h2>
<h3>The Problem</h3>
<p>A lead messages you at 11 PM. You see it at 8 AM. By then they have already talked to two of your competitors. You lost the deal because you were sleeping. That is not a business problem. That is an infrastructure problem.</p>
<h3>What We Build</h3>
<ul>
<li><strong>Conversational bots:</strong> Not the robotic "please select an option" kind. Actual AI that understands context, qualifies leads, answers questions, and books meetings. At 2 AM. At 2 PM. Whenever.</li>
<li><strong>Workflow automations:</strong> Lead comes in, gets tagged, gets the right follow-up sequence, gets routed to the right person. Automatically. You do not touch it.</li>
<li><strong>Customer service AI:</strong> Handle the 80% of customer questions that are the same thing asked slightly differently. Your team focuses on the 20% that actually need a human.</li>
<li><strong>Database reactivation:</strong> Got a list of cold contacts collecting dust? AI wakes them up. Personalized outreach at scale, not mass blasts.</li>
</ul>
<p><em>We built an AI chat system for an e-commerce brand that cut manual customer service hours by 80%. And the customers rated the experience higher than when humans were handling it.</em></p>
</section>

<section id="operations"><h2>Operations: Stop managing tools. Let AI manage your business.</h2>
<h3>The Problem</h3>
<p>You are paying for Calendly. And Mailchimp. And some CRM you barely use. And a website builder. And a texting platform. And maybe two more things you forgot about. None of them talk to each other. You are the integration layer. That is expensive. Not just the subscriptions. Your time.</p>
<h3>What We Build</h3>
<ul>
<li><strong>Unified pipeline:</strong> Every lead, every deal, every customer in one place. AI tells you what needs attention today, not a spreadsheet you forgot to update.</li>
<li><strong>Intelligent follow ups:</strong> The system knows when someone has not responded and sends the right nudge at the right time. Not a generic "just checking in" email. Something contextual.</li>
<li><strong>Automated reporting:</strong> Stop building reports manually. Your dashboard updates in real time. Revenue, pipeline, conversion rates. All of it.</li>
<li><strong>Calendar and booking integration:</strong> One link, one system, no double bookings, no "let me check my availability" back and forth.</li>
</ul>
<p><em>We reactivated a dead database of 13,000 cold contacts and booked 42 qualified appointments in one week. Not by emailing everyone the same thing. By using AI to personalize outreach based on what we knew about each contact.</em></p>
</section>

<section id="digital-presence"><h2>Digital Presence: Your website should work as hard as you do.</h2>
<h3>The Problem</h3>
<p>You have a website. It looks okay. But it is basically a digital business card that does not do anything. No one finds it on Google. The few people who do visit do not convert. And you have no idea why because there is no data.</p>
<h3>What We Build</h3>
<ul>
<li><strong>Conversion-focused design:</strong> Every page built around one goal: getting the visitor to take the next step. Tested layouts and copy that improve over time.</li>
<li><strong>SEO infrastructure:</strong> Content strategy informed by AI research. We target the searches your ideal clients are actually making, not vanity keywords.</li>
<li><strong>Performance tracking:</strong> You know exactly where visitors come from, what they do, and why they leave. No guessing.</li>
<li><strong>Content engine:</strong> AI-assisted content creation for blogs, case studies, and landing pages that drive organic traffic consistently.</li>
</ul>
</section>
</main>`,
  };
}

function howItWorksContent() {
  return {
    title: 'How It Works | RSL/A',
    description: 'Our process from first call to live systems. Discovery, strategy, build, and launch in weeks, not months.',
    canonical: `${SITE}/how-it-works`,
    jsonLd: {
      '@context': 'https://schema.org', '@type': 'HowTo',
      name: 'How RSL/A Works',
      description: 'Our process from first call to live systems. Discovery, strategy, build, and launch in weeks, not months.',
      step: [
        { '@type': 'HowToStep', position: 1, name: 'Free Discovery Call', text: 'Book a call. We screen share, look at your business, and tell you exactly where AI should be doing the work instead of you.' },
        { '@type': 'HowToStep', position: 2, name: 'The Build', text: 'Your AI system gets designed, built, and tested. Lead generation, automations, operations. Everything we identified on the call.' },
        { '@type': 'HowToStep', position: 3, name: 'Launch & Optimize', text: 'We launch your system, monitor performance, and optimize continuously. Your system gets smarter the longer it runs.' },
      ],
    },
    html: `<main>
<h1>From "I think I need this" to running.</h1>
<p>Here is exactly how it works. No surprises, no scope creep, no six month timelines.</p>

<section><h2>Step 01: Let's Talk (Free)</h2>
<p>You book a call. We screen share. I look at your business and tell you exactly where AI should be doing the work instead of you.</p>
<p>No pitch deck. No discovery questionnaire. Just me looking at your tools, your lead flow, and your operations, and pointing at the gaps.</p>
<p>You walk away with a clear picture of what AI can do for your business. If you want to build it yourself after that, go for it. Seriously.</p>
</section>

<section><h2>Step 02: The Build</h2>
<p>If you want us to build it, we get to work. Your AI system gets designed, built, and tested. Lead generation, automations, operations. Whatever we identified on the call.</p>
<p>You do not need to learn anything technical. You do not need to manage the project. We handle everything and you see progress in real time.</p>
</section>

<section><h2>Step 03: The Handoff</h2>
<p>We hand you a fully working AI system with a dashboard that shows you exactly what it is doing. Not a black box you do not understand. A system you own, with numbers you can read.</p>
<p>We walk you through everything. And if you want ongoing optimization, we are here for that too.</p>
</section>
</main>`,
  };
}

function startHereContent() {
  return {
    title: 'Start Here | RSL/A',
    description: 'Ready to put AI to work in your business? Start here. Book a call and see what RSL/A can build for you.',
    canonical: `${SITE}/start-here`,
    jsonLd: {
      '@context': 'https://schema.org', '@type': 'WebPage',
      name: 'Start Here', url: `${SITE}/start-here`,
      description: 'Ready to put AI to work in your business? Start here. Book a call and see what RSL/A can build for you.',
      isPartOf: { '@type': 'WebSite', name: 'RSL/A', url: SITE },
    },
    html: `<main>
<h1>New here? Start here.</h1>
<p>I am Rahul. I build AI systems for founders. But before you hire anyone (including me), you should understand what AI can actually do for your business. Here is the stuff I would send a friend who asked me "should I be using AI in my business?"</p>

<section><h2>Pick your depth</h2>
<ul>
<li><strong>5 minutes — Read this:</strong> The short version of why most founders are doing manually what AI could handle in seconds. <a href="/blog">Read the blog</a></li>
<li><strong>30 minutes — Watch this:</strong> I walk through a real AI system I built for a client. Start to finish. What it does, how it works, and the numbers. <a href="https://youtube.com/@rahul_lalia">Watch on YouTube</a></li>
<li><strong>Specific problem — Book a free call:</strong> I will screen share, look at your business, and tell you exactly where AI fits. No pitch, just answers. <a href="/start-here#contact">Book a call</a></li>
</ul>
</section>

<section><h2>Stay in the loop</h2>
<p>I post regularly about AI for business. No fluff, no hype. Just what is working right now.</p>
<ul>
<li><a href="https://linkedin.com/in/rahul_lalia">LinkedIn</a> — Where most of my thinking happens</li>
<li><a href="https://youtube.com/@rahul_lalia">YouTube</a> — Deeper walkthroughs and builds</li>
<li><a href="https://instagram.com/rahul_lalia">Instagram</a> — Behind the scenes</li>
<li><a href="https://tiktok.com/@rahul_lalia">TikTok</a> — Quick takes</li>
<li><a href="https://x.com/rahul_lalia">X</a> — Shorter thoughts</li>
<li><a href="/blog">Blog</a> — Long form, searchable, evergreen</li>
</ul>
</section>

<section><h2>Ready to work together?</h2>
<p>If you have already done the learning and want it built, here is how that works.</p>
<p><a href="/how-it-works">See how it works</a></p>
</section>
</main>`,
  };
}

// ── Dynamic Page Builders ─────────────────────────────────────────────────────

function blogListingContent(posts) {
  const postItems = posts.map(p => {
    const date = formatDate(p.publishedAt);
    const cats = (p.categories || []).map(c => c.name).join(', ');
    const excerpt = p.excerpt ? `<p>${esc(p.excerpt)}</p>` : '';
    return `<li><article><h3><a href="/blog/${esc(p.slug)}">${esc(p.title)}</a></h3>${excerpt}<p>${date}${cats ? ` — ${esc(cats)}` : ''}</p></article></li>`;
  }).join('\n');

  return {
    title: 'Blog | RSL/A',
    description: 'Insights on marketing automation, AI systems, local SEO, and business growth strategies from RSL/A.',
    canonical: `${SITE}/blog`,
    jsonLd: {
      '@context': 'https://schema.org', '@type': 'CollectionPage',
      name: 'Blog', url: `${SITE}/blog`,
      isPartOf: { '@type': 'WebSite', name: 'RSL/A', url: SITE },
    },
    html: `<main>
<h1>The Archive</h1>
<p>Insights on marketing automation, AI systems, local SEO, and strategies to scale your operations without overhead.</p>
<ul>${postItems}</ul>
</main>`,
  };
}

function workListingContent(caseStudies) {
  const featured = caseStudies.filter(cs => cs.featured);
  const rest = caseStudies.filter(cs => !cs.featured);

  function renderCsList(list) {
    return list.map(cs => {
      const metrics = (cs.metrics || []).slice(0, 3).map(m => `${esc(m.value)} ${esc(m.label)}`).join(' | ');
      return `<li><article><h3><a href="/work/${esc(cs.slug)}">${esc(cs.title)}</a></h3>${cs.tag ? `<p>${esc(cs.tag)}</p>` : ''}${cs.description ? `<p>${esc(cs.description)}</p>` : ''}${metrics ? `<p>${metrics}</p>` : ''}</article></li>`;
    }).join('\n');
  }

  return {
    title: 'Case Studies | RSL/A',
    description: 'Real results from real clients. See how RSL/A uses AI automation, paid ads, and CRM systems to drive measurable growth.',
    canonical: `${SITE}/work`,
    jsonLd: {
      '@context': 'https://schema.org', '@type': 'CollectionPage',
      name: 'Case Studies', url: `${SITE}/work`,
      isPartOf: { '@type': 'WebSite', name: 'RSL/A', url: SITE },
    },
    html: `<main>
<h1>Proven Performance</h1>
<p>We don't sell promises. We sell engineered outcomes. Here is the proof.</p>
${featured.length ? `<section><h2>Featured Intelligence</h2><ul>${renderCsList(featured)}</ul></section>` : ''}
${rest.length ? `<section><h2>All Case Studies</h2><ul>${renderCsList(rest)}</ul></section>` : ''}
</main>`,
  };
}

function blogPostContent(post) {
  const title = post.seo?.metaTitle ? `${post.seo.metaTitle} | RSL/A` : `${post.title} | RSL/A`;
  const description = post.seo?.metaDescription || post.excerpt || '';
  const canonical = `${SITE}/blog/${post.slug}`;
  const ogImage = post.seo?.socialImage?.asset?.url || post.featuredImage?.asset?.url || null;

  const jsonLd = [{
    '@context': 'https://schema.org', '@type': 'BlogPosting',
    headline: post.title,
    description,
    datePublished: post.publishedAt,
    author: { '@type': 'Person', name: post.author?.name || 'Rahul Lalia' },
    publisher: { '@type': 'Organization', name: 'RSL/A', url: SITE },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
  }];

  if (post.faqSchema?.length) {
    jsonLd.push({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: post.faqSchema.map(f => ({
        '@type': 'Question', name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    });
  }

  const bodyHtml = ptToHtml(post.body);
  const date = formatDate(post.publishedAt);
  const cats = (post.categories || []).map(c => `<span>${esc(c.name)}</span>`).join(' ');

  return {
    route: `/blog/${post.slug}`,
    title,
    description,
    canonical,
    ogImage,
    jsonLd,
    html: `<main><article>
<h1>${esc(post.title)}</h1>
<p>${date}${post.author?.name ? ` — By ${esc(post.author.name)}` : ''}${cats ? ` — ${cats}` : ''}</p>
${post.excerpt ? `<p><em>${esc(post.excerpt)}</em></p>` : ''}
${bodyHtml}
</article></main>`,
  };
}

function caseStudyContent(cs) {
  const title = cs.seo?.metaTitle ? `${cs.seo.metaTitle} | RSL/A` : `${cs.title} | RSL/A`;
  const description = cs.seo?.metaDescription || cs.tldr || cs.description || '';
  const canonical = `${SITE}/work/${cs.slug}`;
  const ogImage = cs.seo?.socialImage?.asset?.url || cs.featuredImage?.asset?.url || null;

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: cs.title,
    description,
    datePublished: cs.publishedAt,
    author: { '@type': 'Person', name: 'Rahul Lalia' },
    publisher: { '@type': 'Organization', name: 'RSL/A', url: SITE },
  };

  const bodyHtml = ptToHtml(cs.content);

  const metricsHtml = (cs.metrics || []).map(m =>
    `<li><strong>${esc(m.value)}</strong> ${esc(m.label)}</li>`
  ).join('');

  const takeawaysHtml = (cs.keyTakeaways || []).map((t, i) =>
    `<li>${esc(t)}</li>`
  ).join('');

  return {
    route: `/work/${cs.slug}`,
    title,
    description,
    canonical,
    ogImage,
    jsonLd,
    html: `<main><article>
<h1>${esc(cs.title)}</h1>
${cs.tag ? `<p>${esc(cs.tag)}</p>` : ''}
${cs.description ? `<p><em>${esc(cs.description)}</em></p>` : ''}
${metricsHtml ? `<section><h2>Key Metrics</h2><ul>${metricsHtml}</ul></section>` : ''}
${cs.tldr ? `<section><h2>TL;DR</h2><p>${esc(cs.tldr)}</p></section>` : ''}
${cs.problemStatement ? `<section><h2>The Problem</h2><p>${esc(cs.problemStatement)}</p></section>` : ''}
${cs.solutionApproach ? `<section><h2>The Solution</h2><p>${esc(cs.solutionApproach)}</p></section>` : ''}
${cs.resultsOutcome ? `<section><h2>The Results</h2><p>${esc(cs.resultsOutcome)}</p></section>` : ''}
${bodyHtml}
${takeawaysHtml ? `<section><h2>Key Takeaways</h2><ol>${takeawaysHtml}</ol></section>` : ''}
</article></main>`,
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Pre-rendering pages...');

  const template = readFileSync(resolve(DIST, 'index.html'), 'utf-8');

  // Fetch all dynamic content from Sanity
  const [blogPosts, caseStudies] = await Promise.all([
    client.fetch(`
      *[_type == "blogPostV2" && status == "published" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc) {
        title,
        "slug": slug.current,
        excerpt,
        publishedAt,
        body,
        featuredImage { asset-> },
        author->{ name },
        categories[]->{ name, "slug": slug.current },
        seo { metaTitle, metaDescription, keywords, socialImage { asset-> } },
        faqSchema
      }
    `),
    client.fetch(`
      *[_type == "caseStudy" && defined(slug.current)] | order(priority asc) {
        title,
        "slug": slug.current,
        tag,
        description,
        metrics,
        featured,
        category,
        content,
        tldr,
        problemStatement,
        solutionApproach,
        resultsOutcome,
        keyTakeaways,
        industry,
        timeframe,
        servicesUsed,
        publishedAt,
        featuredImage { asset-> },
        seo { metaTitle, metaDescription, keywords, socialImage { asset-> } },
        faqSchema
      }
    `),
  ]);

  let count = 0;

  // Static pages
  const staticPages = [
    { route: '/', ...homeContent() },
    { route: '/about', ...aboutContent() },
    { route: '/services', ...servicesContent() },
    { route: '/how-it-works', ...howItWorksContent() },
    { route: '/start-here', ...startHereContent() },
  ];

  for (const page of staticPages) {
    writePage(page.route, inject(template, page));
    count++;
  }

  // Blog listing
  writePage('/blog', inject(template, blogListingContent(blogPosts)));
  count++;

  // Work listing
  writePage('/work', inject(template, workListingContent(caseStudies)));
  count++;

  // Individual blog posts
  for (const post of blogPosts) {
    const page = blogPostContent(post);
    writePage(page.route, inject(template, page));
    count++;
  }

  // Individual case studies
  for (const cs of caseStudies) {
    const page = caseStudyContent(cs);
    writePage(page.route, inject(template, page));
    count++;
  }

  console.log(`Pre-rendered ${count} pages (${staticPages.length} static, 2 listings, ${blogPosts.length} blog posts, ${caseStudies.length} case studies)`);
}

main().catch((err) => {
  console.error('Pre-render failed:', err);
  process.exit(1);
});
