import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight, MapPin, Check, X,
  Globe, Search, Bot, Pencil, Settings,
  Layers, RefreshCw, FileText, Plug, Headphones,
} from 'lucide-react';
import { services } from '@/data/serviceData';
import Seo from '@/components/Seo';
import ServiceFaq, { generateFaqSchema } from '@/components/services/ServiceFaq';
import { MagicCard } from '@/components/ui/magic-card';
import { FlickeringGrid } from '@/components/ui/flickering-grid';
import { TextAnimate } from '@/components/ui/text-animate';
import { ShineBorder } from '@/components/ui/shine-border';

gsap.registerPlugin(ScrollTrigger);

const service = services['web-design'];

const deliverables = [
  { icon: Globe, label: 'A website that is yours', desc: 'Built around your brand voice, your personality, and your audience. Not a template with your logo swapped in.' },
  { icon: Search, label: 'Built to rank from day one', desc: 'Proper site structure, keyword-optimized content, fast load times, and all the technical foundations that search engines need to find and trust you.' },
  { icon: Bot, label: 'Visible to AI, not just Google', desc: 'Structured so ChatGPT, Gemini, and Perplexity can find and recommend your business when people ask for services like yours.' },
  { icon: MapPin, label: 'Local search integration', desc: 'If you serve a local area, we connect your website to your Google Business Profile and build it for your service area.' },
  { icon: Pencil, label: 'Content that converts', desc: 'Every headline and call to action is written for your buyer. Not filler text. Words that make people pick up the phone.' },
  { icon: Settings, label: 'A site you can update', desc: 'You get a content management system so you can change text, add pages, and publish posts without calling us every time.' },
];

const processSteps = [
  { num: '01', title: 'Discovery', timeline: 'Week 1', body: 'We dig into your brand, your audience, your competitors, and your goals. We learn what you do, who you serve, and what makes you different before we touch a single design.' },
  { num: '02', title: 'Strategy and structure', timeline: 'Week 1-2', body: 'We map out your site architecture, plan your content, and define what every page needs to do. You approve the plan before we design anything.' },
  { num: '03', title: 'Design', timeline: 'Week 2-3', body: 'We create mockups of your key pages. You see exactly what your site will look like before we build it. Revisions happen here, not after launch.' },
  { num: '04', title: 'Build and test', timeline: 'Week 3-5', body: 'We build your site, wire up analytics, test across every device and browser, and optimize for speed and search. Nothing launches until it is ready.' },
  { num: '05', title: 'Launch and support', timeline: 'Week 5-6', body: 'We handle the technical launch, submit your site to search engines, and walk you through everything. You get 30 days of post-launch support included.' },
];

const costFactors = [
  { icon: Layers, label: 'Number of pages', desc: 'A 5-page business site is a different project than a 30-page resource hub. More pages means more content, more design, and more optimization.' },
  { icon: RefreshCw, label: 'New build vs. redesign', desc: 'Starting from scratch gives us full control. Redesigning means migrating content, preserving rankings, and handling redirects.' },
  { icon: FileText, label: 'Content and copy', desc: 'If you have your content ready, the project moves faster. If we are writing your copy and researching your audience, that adds real value.' },
  { icon: Plug, label: 'Integrations', desc: 'Booking systems, payment processing, CRM connections, email marketing, analytics. The more your website connects to, the more complex the build.' },
  { icon: Headphones, label: 'Ongoing support', desc: 'Some businesses want a one-time build. Others want ongoing updates, content publishing, and performance monitoring. We offer both.' },
];

const forYou = [
  'You need a website that actually brings in customers',
  'Your current site looks like everyone else in your industry',
  'You want to show up when people search, including in AI answers',
  'You need it done in weeks, not months',
  'You want to work directly with the person building it',
];

const notForYou = [
  'You are looking for the cheapest option available',
  'You want a one-page site built overnight',
  'You plan to build it yourself and just need a template',
  'You are not ready to invest in your online presence',
];

export default function WebDesign() {
  const pageRef = useRef(null);
  const [showStickyMobile, setShowStickyMobile] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        gsap.utils.toArray('.wd-reveal').forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
        return;
      }

      gsap.utils.toArray('.wd-reveal').forEach((el) => {
        gsap.fromTo(el, { y: 30, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyMobile(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.metaDescription,
    provider: { '@type': 'Organization', name: 'RSL/A', url: 'https://rsla.io' },
    url: service.canonical,
    areaServed: { '@type': 'Country', name: 'US' },
  };
  const faqSchema = generateFaqSchema(service.faqs);
  const jsonLd = faqSchema ? [serviceSchema, faqSchema] : serviceSchema;

  return (
    <div ref={pageRef}>
      <Seo
        title={service.metaTitle}
        description={service.metaDescription}
        keywords={service.keywords}
        canonical={service.canonical}
        jsonLd={jsonLd}
      />

      {/* ── SECTION 1: HERO ── */}
      <section className="relative bg-surface pt-32 pb-16 md:pt-36 md:pb-20 px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_30%_50%,black_30%,transparent_70%)] pointer-events-none">
          <FlickeringGrid
            className="w-full h-full"
            squareSize={4}
            gridGap={6}
            color="rgba(0,112,243,0.3)"
            flickerChance={0.1}
          />
        </div>

        <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <div className="flex-1 max-w-xl">
            <Link
              to="/services"
              className="inline-flex items-center gap-1 font-sans text-sm text-textMuted hover:text-accent transition-colors mb-8"
            >
              All Services
            </Link>
            <h1 className="font-sans font-extrabold text-3xl md:text-5xl tracking-tight leading-[1.1] text-text mb-5">
              <TextAnimate animation="blurInUp" by="word" delay={0.06} startOnView={false} as="span">
                {service.headline}
              </TextAnimate>
            </h1>
            <p className="font-sans text-lg text-textMuted leading-relaxed mb-8 max-w-md">
              Websites that rank on Google, get recommended by AI, and turn visitors into customers. No templates. No cookie-cutter designs.
            </p>
            <Link
              to="/contact"
              onClick={() => window.dataLayer?.push({ event: 'cta_click', cta_location: 'web_design_hero' })}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 font-sans font-bold text-base text-white shadow-sm transition-colors hover:bg-accent/90"
            >
              Book a free call
              <ArrowRight size={16} strokeWidth={2} className="opacity-60" />
            </Link>
            <p className="mt-3 font-caveat text-base text-textMuted">
              No contracts. No pressure. Just a conversation.
            </p>
          </div>

          <div className="flex-shrink-0 w-full md:w-[44%] perspective-[1200px]">
            <div className="transform md:rotate-y-[-4deg] md:rotate-x-[2deg] transition-transform duration-500 hover:rotate-y-0 hover:rotate-x-0">
              <div className="rounded-xl border border-accent-border bg-white shadow-[0_8px_40px_rgba(0,0,0,0.12)] overflow-hidden">
                <div className="flex items-center gap-1.5 border-b border-accent-border px-3 py-2 bg-slate-50">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  <span className="h-2 w-2 rounded-full bg-yellow-400" />
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  <div className="ml-2 flex items-center gap-1 rounded-md bg-white/80 px-2 py-0.5">
                    <span className="font-sans text-[10px] text-textMuted">rsla.io</span>
                  </div>
                </div>
                <div className="aspect-[16/10] bg-gradient-to-br from-slate-50 to-accent-light">
                  <img
                    src="/images/og-image.png"
                    alt="RSL/A website preview"
                    className="w-full h-full object-cover object-top"
                    loading="eager"
                    width="640"
                    height="400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: THE PROBLEM ── */}
      <section className="bg-accent-light py-16 md:py-24 px-6 md:px-12 border-t border-accent-border">
        <div className="max-w-3xl mx-auto">
          <p className="wd-reveal opacity-0 font-sans text-lg text-text leading-relaxed mb-6">
            You paid for a website and what you got looks like every other business in your industry. Same layout, same stock photos, same generic headlines. Maybe it came from a point-of-sale system that ships the <span className="highlight-mark font-semibold">same template to hundreds of businesses</span>.
          </p>
          <p className="wd-reveal opacity-0 font-sans text-lg text-textMuted leading-relaxed mb-10">
            Or someone built you a site years ago and it has never worked. No calls, no leads, no movement. The problem is not your marketing. <span className="highlight-mark font-semibold">The problem is the foundation.</span>
          </p>
          <blockquote className="wd-reveal opacity-0 border-l-4 border-accent pl-6 py-2">
            <p className="font-caveat text-3xl md:text-4xl text-text leading-snug">
              A website that does not communicate what your business does is setting you up for failure.
            </p>
          </blockquote>
        </div>
      </section>

      {/* ── SECTION 3: WHAT YOU GET ── */}
      <section className="bg-surface py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="wd-reveal opacity-0 font-sans font-extrabold text-2xl md:text-3xl tracking-tight text-text mb-10">
            What you actually get.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {deliverables.map((item) => {
              const Icon = item.icon;
              return (
                <MagicCard
                  key={item.label}
                  className="wd-reveal opacity-0 rounded-xl border border-accent-border bg-accent-light p-6 cursor-default"
                  gradientColor="rgba(0,112,243,0.06)"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 mb-4">
                    <Icon size={20} strokeWidth={1.8} className="text-accent" />
                  </div>
                  <p className="font-sans font-bold text-base text-text mb-2">{item.label}</p>
                  <p className="font-sans text-sm text-textMuted leading-relaxed">{item.desc}</p>
                </MagicCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: THE AI QUESTION ── */}
      <section className="bg-accent-light py-16 md:py-24 px-6 md:px-12 border-t border-accent-border">
        <div className="max-w-3xl mx-auto relative">
          <h2 className="wd-reveal opacity-0 font-sans font-extrabold text-2xl md:text-3xl tracking-tight text-text mb-8">
            Can AI just build my website?
          </h2>
          <p className="wd-reveal opacity-0 font-sans text-lg text-text leading-relaxed mb-6">
            Yes, AI can build you a website in 10 minutes. It will look modern and feel polished on the surface. But here is the question nobody is asking: <span className="highlight-mark font-semibold">will it rank?</span> Is the content written for your specific buyer? Is the site structure strong enough to even get indexed?
          </p>
          <p className="wd-reveal opacity-0 font-sans text-lg text-textMuted leading-relaxed">
            A good-looking website that nobody finds is just an expensive business card that nobody reads. We use AI to move faster, but the strategy, the structure, and the optimization are done by people who know what actually drives results.
          </p>
          <p className="wd-reveal opacity-0 hidden md:block absolute -right-16 top-16 font-caveat text-lg text-accent -rotate-3 select-none">
            this is the part most people miss
          </p>
        </div>
      </section>

      {/* ── SECTION 5: BEFORE / AFTER ── */}
      <section className="bg-surface py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="wd-reveal opacity-0 font-sans font-extrabold text-2xl md:text-3xl tracking-tight text-text mb-10">
            The difference a real website makes.
          </h2>
          <div className="wd-reveal opacity-0 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-accent-border bg-accent-light p-8 flex flex-col items-center justify-center min-h-[260px]">
              <p className="font-sans text-sm font-bold uppercase tracking-widest text-textMuted mb-4">Before</p>
              <div className="w-full h-44 rounded-xl bg-slate-200/60 flex items-center justify-center border border-slate-300/50">
                <p className="font-sans text-sm text-textMuted">Screenshot coming soon</p>
              </div>
            </div>
            <ShineBorder
              className="rounded-2xl bg-accent-light p-8 flex flex-col items-center justify-center min-h-[260px]"
              color={['#0070F3', '#10B981']}
              borderWidth={2}
            >
              <p className="font-sans text-sm font-bold uppercase tracking-widest text-accent mb-4">After</p>
              <div className="w-full h-44 rounded-xl bg-slate-200/60 flex items-center justify-center border border-accent/20">
                <p className="font-sans text-sm text-textMuted">Screenshot coming soon</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2 justify-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 font-sans text-xs font-bold text-accent">
                  <Check size={12} strokeWidth={3} /> Page 1 rankings
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 font-sans text-xs font-bold text-accent">
                  <Check size={12} strokeWidth={3} /> 3x organic traffic
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 font-sans text-xs font-bold text-accent">
                  <Check size={12} strokeWidth={3} /> Sub-2s load time
                </span>
              </div>
            </ShineBorder>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: FOUNDER + TESTIMONIAL ── */}
      <section className="bg-accent-light py-16 md:py-24 px-6 md:px-12 border-t border-accent-border">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
          <div className="wd-reveal opacity-0 flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="shrink-0">
              <div className="w-36 h-36 md:w-48 md:h-48 rounded-2xl overflow-hidden bg-surface shadow-sm">
                <img src="/images/rahul.webp" alt="Rahul Lalia, Founder of RSL/A" className="w-full h-full object-cover" loading="lazy" width="200" height="200" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <blockquote className="font-caveat text-xl md:text-2xl text-text leading-snug mb-4">
                "Build it once and expect to build it again. A website is a living product. It needs to be fed, optimized, and taken care of."
              </blockquote>
              <p className="font-sans font-bold text-base text-text">Rahul Lalia</p>
              <p className="font-sans text-sm text-textMuted">Founder, RSL/A</p>
              <Link to="/about" className="inline-flex items-center gap-1 mt-2 font-sans text-sm text-accent hover:underline">
                About Rahul <ArrowRight size={12} strokeWidth={2} />
              </Link>
            </div>
          </div>

          <div className="wd-reveal opacity-0 flex flex-col justify-center">
            <div className="rounded-xl border border-accent-border bg-surface p-6">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="font-sans text-base text-text leading-relaxed mb-4">
                "Rahul redesigned our website, handled SEO optimization, and set up blogging automation. Site looks great, ranks better, and the automation saves us tons of time. Great communication and delivered on schedule."
              </p>
              <p className="font-sans text-sm font-bold text-text">Chris K.</p>
              <p className="font-sans text-xs text-textMuted">CEO/Co-Founder, Fieldshare</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: MID-PAGE CTA ── */}
      <section className="bg-accent py-12 md:py-16 px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-sans font-extrabold text-xl md:text-2xl text-white tracking-tight mb-5">
            Ready to see what your new site could look like?
          </p>
          <Link
            to="/contact?ref=mockup"
            onClick={() => window.dataLayer?.push({ event: 'cta_click', cta_location: 'web_design_midpage' })}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-sans font-bold text-base text-accent shadow-sm transition-colors hover:bg-white/90"
          >
            Get a free mockup in 72 hours
            <ArrowRight size={16} strokeWidth={2} className="opacity-60" />
          </Link>
        </div>
      </section>

      {/* ── SECTION 8: PROCESS ── */}
      <section className="bg-surface py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 md:mb-14">
            <p className="wd-reveal opacity-0 mb-4 font-sans text-sm uppercase tracking-[0.2em] text-accent">How we work</p>
            <h2 className="wd-reveal opacity-0 font-sans font-extrabold text-2xl md:text-3xl tracking-tight text-text leading-[1.1]">
              From first call to launch.
            </h2>
          </div>
          <div className="relative">
            {processSteps.map((step, idx) => (
              <div key={step.num} className="wd-reveal opacity-0 relative flex justify-end gap-2 scroll-mt-24">
                <div className="sticky top-24 flex w-36 flex-col items-end gap-2 self-start pb-4 max-md:hidden">
                  <span className="inline-flex h-6 items-center px-2.5 rounded-md bg-accent text-white font-sans font-semibold text-sm">{step.num}</span>
                  <span className="font-sans text-xs text-textMuted">{step.timeline}</span>
                </div>
                <div className="flex flex-col items-center self-stretch">
                  <div className="flex w-6 h-6 items-center justify-center shrink-0">
                    <span className="bg-accent/20 flex w-[1.125rem] h-[1.125rem] shrink-0 items-center justify-center rounded-full">
                      <span className="bg-accent w-3 h-3 rounded-full" />
                    </span>
                  </div>
                  {idx !== processSteps.length - 1 && (
                    <span className="w-0.5 flex-1 bg-gradient-to-b from-accent/40 via-accent/20 to-accent/40" />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-4 pb-14 pl-4 md:pl-6 lg:pl-9">
                  <div className="flex items-center gap-3 md:hidden">
                    <span className="inline-flex h-6 items-center px-2.5 rounded-md bg-accent text-white font-sans font-semibold text-sm">{step.num}</span>
                    <span className="font-sans text-xs text-textMuted">{step.timeline}</span>
                  </div>
                  <h3 className="font-sans font-semibold text-xl md:text-2xl text-text tracking-tight">{step.title}</h3>
                  <p className="font-sans font-normal text-lg text-textMuted leading-relaxed max-w-xl">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 9: CASE STUDIES ── */}
      <section className="bg-accent-light py-16 md:py-24 px-6 md:px-12 border-t border-accent-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="wd-reveal opacity-0 font-sans font-extrabold text-2xl md:text-3xl tracking-tight text-text mb-10">
            See it in action.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.caseStudies.map((cs) => (
              <Link
                key={cs.href}
                to={cs.href}
                className="wd-reveal opacity-0 group rounded-xl border border-accent-border bg-surface p-6 transition-colors hover:border-accent/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
              >
                <p className="font-sans text-2xl font-extrabold text-accent mb-2">{cs.metric}</p>
                <p className="font-sans text-lg font-semibold text-text leading-snug mb-3 group-hover:text-accent transition-colors">{cs.title}</p>
                <span className="inline-flex items-center gap-1 font-sans text-sm text-textMuted group-hover:text-accent transition-colors">
                  Read the full story <ArrowRight size={14} strokeWidth={2} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 10: WHAT DETERMINES COST ── */}
      <section className="bg-surface py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="wd-reveal opacity-0 font-sans font-extrabold text-2xl md:text-3xl tracking-tight text-text mb-4">
            What determines the cost.
          </h2>
          <p className="wd-reveal opacity-0 font-sans text-lg text-textMuted leading-relaxed mb-10">
            Every website is different, and the cost reflects that. Here is what actually drives the price, and why the cheapest option is almost never the best investment.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {costFactors.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="wd-reveal opacity-0 rounded-xl border border-accent-border bg-accent-light p-6 flex gap-4 items-start">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 shrink-0 mt-0.5">
                    <Icon size={18} strokeWidth={1.8} className="text-accent" />
                  </div>
                  <div>
                    <p className="font-sans font-bold text-base text-text mb-1">{item.label}</p>
                    <p className="font-sans text-sm text-textMuted leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="wd-reveal opacity-0 mt-8 font-sans text-base text-text font-semibold">
            We give you a fixed price after the discovery call. No hourly billing, no surprise invoices, no scope creep.
          </p>
        </div>
      </section>

      {/* ── SECTION 11: WHO THIS IS FOR ── */}
      <section className="bg-accent-light py-16 md:py-24 px-6 md:px-12 border-t border-accent-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="wd-reveal opacity-0 font-sans font-extrabold text-2xl md:text-3xl tracking-tight text-text mb-10">
            Is this right for you?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="wd-reveal opacity-0">
              <p className="font-sans font-bold text-base text-text mb-5">This is for you if...</p>
              <ul className="space-y-4">
                {forYou.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 shrink-0 mt-0.5">
                      <Check size={14} strokeWidth={3} className="text-green-600" />
                    </div>
                    <span className="font-sans text-base text-text leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="wd-reveal opacity-0">
              <p className="font-sans font-bold text-base text-text mb-5">This might not be a fit if...</p>
              <ul className="space-y-4">
                {notForYou.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 shrink-0 mt-0.5">
                      <X size={14} strokeWidth={3} className="text-textMuted/50" />
                    </div>
                    <span className="font-sans text-base text-textMuted leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 12: FAQ ── */}
      <ServiceFaq faqs={service.faqs} serviceName={service.title} />

      {/* ── SECTION 13: BAKERSFIELD STRIP ── */}
      <section className="bg-accent-light py-10 px-6 md:px-12 border-t border-accent-border">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <MapPin size={16} strokeWidth={2.5} className="text-accent shrink-0" />
          <p className="font-sans text-base text-text">
            Based in Bakersfield, serving businesses nationally. Local to Kern County?{' '}
            <Link to="/services/bakersfield" className="text-accent font-semibold hover:underline">
              See our local services.
            </Link>
          </p>
        </div>
      </section>

      {/* ── SECTION 14: FINAL CTA ── */}
      <section className="bg-surface border-t border-accent-border py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-accent/20">
              <img src="/images/rahul.webp" alt="Rahul Lalia" className="w-full h-full object-cover" loading="lazy" width="40" height="40" />
            </div>
          </div>
          <h2 className="font-sans font-extrabold text-text text-2xl md:text-4xl tracking-tight leading-[1.1] mb-4">
            See what your new site could look like.
          </h2>
          <p className="font-sans text-lg text-textMuted leading-relaxed mb-8">
            Book a free strategy call, or request a custom mockup of your homepage. On us.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              onClick={() => window.dataLayer?.push({ event: 'cta_click', cta_location: 'web_design_bottom' })}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 font-sans font-bold text-base text-white shadow-sm transition-colors hover:bg-accent/90"
            >
              Book a call
              <ArrowRight size={16} strokeWidth={2} className="opacity-60" />
            </Link>
            <Link
              to="/contact?ref=mockup"
              onClick={() => window.dataLayer?.push({ event: 'cta_click', cta_location: 'web_design_mockup' })}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-accent px-8 py-3.5 font-sans font-bold text-base text-accent transition-colors hover:bg-accent/5"
            >
              Get a free mockup
            </Link>
          </div>
          <p className="mt-4 font-caveat text-lg text-textMuted">
            72-hour delivery. On us.
          </p>
        </div>
      </section>

      {/* ── STICKY MOBILE CTA ── */}
      <div className={`fixed bottom-0 inset-x-0 z-50 md:hidden transition-transform duration-300 ${showStickyMobile ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="bg-surface/95 backdrop-blur-sm border-t border-accent-border px-4 py-3 safe-bottom">
          <Link
            to="/contact"
            onClick={() => window.dataLayer?.push({ event: 'cta_click', cta_location: 'web_design_sticky' })}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-accent px-6 py-3 font-sans font-bold text-base text-white shadow-sm"
          >
            Book a free call
            <ArrowRight size={16} strokeWidth={2} className="opacity-60" />
          </Link>
        </div>
      </div>
    </div>
  );
}
