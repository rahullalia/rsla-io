import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, MapPin, Check, X } from 'lucide-react';
import { services } from '@/data/serviceData';
import ServiceLayout from '@/components/services/ServiceLayout';

gsap.registerPlugin(ScrollTrigger);

const service = services['web-design'];

const deliverables = [
  {
    label: 'A website that is yours',
    desc: 'Built around your brand voice, your personality, and your audience. Not a template with your logo swapped in.',
  },
  {
    label: 'Built to rank from day one',
    desc: 'Proper site structure, keyword-optimized content, fast load times, and all the technical foundations that search engines need to find and trust you.',
  },
  {
    label: 'Visible to AI, not just Google',
    desc: 'Structured so ChatGPT, Gemini, and Perplexity can find and recommend your business when people ask for services like yours.',
  },
  {
    label: 'Local search integration',
    desc: 'If you serve a local area, we connect your website to your Google Business Profile and build it for your service area. You show up in Maps, in local results, and in AI answers for your city.',
  },
  {
    label: 'Content that converts',
    desc: 'Every headline, every paragraph, and every call to action is written for your buyer. Not filler text. Words that make people pick up the phone.',
  },
  {
    label: 'A site you can actually update',
    desc: 'You get a content management system so you can change text, add pages, and publish blog posts without calling us every time.',
  },
];

const processSteps = [
  {
    num: '01',
    title: 'Discovery',
    timeline: 'Week 1',
    body: 'We dig into your brand, your audience, your competitors, and your goals. We learn what you do, who you serve, and what makes you different before we touch a single design.',
  },
  {
    num: '02',
    title: 'Strategy and structure',
    timeline: 'Week 1-2',
    body: 'We map out your site architecture, plan your content, and define what every page needs to do. You approve the plan before we design anything.',
  },
  {
    num: '03',
    title: 'Design',
    timeline: 'Week 2-3',
    body: 'We create mockups of your key pages. You see exactly what your site will look like and feel like before we build it. Revisions happen here, not after launch.',
  },
  {
    num: '04',
    title: 'Build and test',
    timeline: 'Week 3-5',
    body: 'We build your site, wire up analytics, test across every device and browser, and optimize for speed and search. Nothing launches until it is ready.',
  },
  {
    num: '05',
    title: 'Launch and support',
    timeline: 'Week 5-6',
    body: 'We handle the technical launch, submit your site to search engines, and walk you through everything. You get 30 days of post-launch support included.',
  },
];

const costFactors = [
  {
    label: 'Number of pages',
    desc: 'A 5-page business site is a different project than a 30-page resource hub. More pages means more content, more design, and more optimization.',
  },
  {
    label: 'New build vs. redesign',
    desc: 'Starting from scratch gives us full control. Redesigning an existing site means migrating content, preserving your search rankings, and handling redirects. Both are possible, but the work is different.',
  },
  {
    label: 'Content and copy',
    desc: 'If you have your content ready, the project moves faster. If we are writing your copy, researching your audience, and planning your content strategy, that is additional work that adds real value.',
  },
  {
    label: 'Integrations',
    desc: 'Booking systems, payment processing, CRM connections, email marketing, analytics. The more your website needs to connect to, the more complex the build.',
  },
  {
    label: 'Ongoing support',
    desc: 'Some businesses want a one-time build and handoff. Others want ongoing updates, content publishing, and performance monitoring. We offer both.',
  },
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

function CustomCta() {
  return (
    <section className="bg-surface border-t border-accent-border py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-sans font-extrabold text-text text-2xl md:text-4xl tracking-tight leading-[1.1] mb-4">
          See what your new site could look like.
        </h2>
        <p className="font-sans text-lg text-textMuted leading-relaxed mb-8">
          Book a free strategy call, or request a custom mockup of your homepage. On us. Delivered in 72 hours.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/contact"
            onClick={() => window.dataLayer?.push({ event: 'cta_click', cta_location: 'web_design_bottom' })}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3 font-sans font-bold text-base text-white shadow-sm transition-colors hover:bg-accent/90"
          >
            Book a call
            <ArrowRight size={16} strokeWidth={2} className="opacity-60" />
          </Link>
          <Link
            to="/contact?ref=mockup"
            onClick={() => window.dataLayer?.push({ event: 'cta_click', cta_location: 'web_design_mockup' })}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-accent px-8 py-3 font-sans font-bold text-base text-accent transition-colors hover:bg-accent/5"
          >
            Get a free mockup
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function WebDesign() {
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        gsap.utils.toArray('.wd-reveal').forEach((el) => {
          gsap.set(el, { opacity: 1, y: 0 });
        });
        return;
      }

      gsap.utils.toArray('.wd-reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          }
        );
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef}>
      <ServiceLayout service={service} ctaOverride={<CustomCta />}>

        {/* Section 2: The Problem */}
        <section className="bg-accent-light py-16 md:py-24 px-6 md:px-12 border-t border-accent-border">
          <div className="max-w-3xl mx-auto">
            <p className="wd-reveal opacity-0 font-sans text-lg text-text leading-relaxed mb-6">
              You have seen it before. You paid for a website and what you got looks like every other business in your industry. Same layout, same stock photos, same generic headlines. Maybe it came from a point-of-sale system or a page builder that ships the same template to hundreds of businesses. It does not rank, it does not convert, and it does not communicate what makes your business different.
            </p>
            <p className="wd-reveal opacity-0 font-sans text-lg text-textMuted leading-relaxed mb-10">
              Or worse, someone built you a custom site years ago and you have been trying to make it work ever since. You have thrown money at SEO, run ads to it, and still nothing. No calls, no leads, no movement. The problem is not your marketing. The problem is the foundation.
            </p>
            <blockquote className="wd-reveal opacity-0 border-l-4 border-accent pl-6">
              <p className="font-cormorant italic text-2xl md:text-3xl text-text leading-snug">
                A website that does not communicate what your business does is setting you up for failure.
              </p>
            </blockquote>
          </div>
        </section>

        {/* Section 3: What You Get */}
        <section className="bg-surface py-16 md:py-24 px-6 md:px-12">
          <div className="max-w-5xl mx-auto">
            <h2 className="wd-reveal opacity-0 font-sans font-extrabold text-2xl md:text-3xl tracking-tight text-text mb-10">
              What you actually get.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {deliverables.map((item) => (
                <div
                  key={item.label}
                  className="wd-reveal opacity-0 rounded-xl border border-accent-border bg-accent-light p-6"
                >
                  <p className="font-sans font-bold text-base text-text mb-2">{item.label}</p>
                  <p className="font-sans text-sm text-textMuted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: The AI Question */}
        <section className="bg-accent-light py-16 md:py-24 px-6 md:px-12 border-t border-accent-border">
          <div className="max-w-3xl mx-auto">
            <h2 className="wd-reveal opacity-0 font-sans font-extrabold text-2xl md:text-3xl tracking-tight text-text mb-8">
              Can AI just build my website?
            </h2>
            <p className="wd-reveal opacity-0 font-sans text-lg text-text leading-relaxed mb-6">
              Yes, AI can build you a website in 10 minutes. It will look modern, have nice animations, and feel polished on the surface. But here is the question nobody is asking: will it rank? Is the content written for your specific buyer? Is the site structure strong enough to even get indexed? Will an AI search engine recommend it to someone looking for what you sell?
            </p>
            <p className="wd-reveal opacity-0 font-sans text-lg text-textMuted leading-relaxed">
              A good-looking website that nobody finds is just an expensive business card that nobody reads. We use AI to move faster, but the strategy, the structure, and the optimization are done by people who know what actually drives results.
            </p>
          </div>
        </section>

        {/* Section 5: Before/After Placeholder */}
        <section className="bg-surface py-16 md:py-24 px-6 md:px-12">
          <div className="max-w-5xl mx-auto">
            <h2 className="wd-reveal opacity-0 font-sans font-extrabold text-2xl md:text-3xl tracking-tight text-text mb-10">
              The difference a real website makes.
            </h2>
            <div className="wd-reveal opacity-0 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-accent-border bg-accent-light p-8 flex flex-col items-center justify-center min-h-[240px]">
                <p className="font-sans text-sm font-bold uppercase tracking-widest text-textMuted mb-3">Before</p>
                <div className="w-full h-40 rounded-xl bg-slate-200 flex items-center justify-center">
                  <p className="font-sans text-sm text-textMuted">Screenshot coming soon</p>
                </div>
              </div>
              <div className="rounded-2xl border-2 border-accent bg-accent-light p-8 flex flex-col items-center justify-center min-h-[240px]">
                <p className="font-sans text-sm font-bold uppercase tracking-widest text-accent mb-3">After</p>
                <div className="w-full h-40 rounded-xl bg-slate-200 flex items-center justify-center">
                  <p className="font-sans text-sm text-textMuted">Screenshot coming soon</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-3 justify-center">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-accent/10 px-3 py-1 font-sans text-xs font-bold text-accent">
                    Page 1 rankings
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-accent/10 px-3 py-1 font-sans text-xs font-bold text-accent">
                    3x organic traffic
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-accent/10 px-3 py-1 font-sans text-xs font-bold text-accent">
                    Load time under 2s
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Founder Strip */}
        <section className="bg-accent-light py-16 md:py-20 px-6 md:px-12 border-t border-accent-border">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            <div className="shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-surface">
                <img
                  src="/images/rahul.webp"
                  alt="Rahul Lalia, Founder of RSL/A"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width="160"
                  height="160"
                />
              </div>
            </div>
            <div className="wd-reveal opacity-0 text-center md:text-left">
              <blockquote className="font-cormorant italic text-xl md:text-2xl text-text leading-snug mb-4">
                "Build it once and expect to build it again. A website is a living product. It needs to be fed, optimized, and taken care of. If you think you can build it and forget it, it is going to fall behind."
              </blockquote>
              <p className="font-sans font-bold text-base text-text">Rahul Lalia</p>
              <p className="font-sans text-sm text-textMuted">Founder, RSL/A. Based in Bakersfield, CA.</p>
              <Link
                to="/about"
                className="inline-flex items-center gap-1 mt-3 font-sans text-sm text-accent hover:underline"
              >
                About Rahul <ArrowRight size={12} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </section>

        {/* Section 7: Process */}
        <section className="bg-surface py-16 md:py-24 px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10 md:mb-14">
              <p className="wd-reveal opacity-0 mb-4 font-sans text-sm uppercase tracking-[0.2em] text-accent">
                How we work
              </p>
              <h2 className="wd-reveal opacity-0 font-sans font-extrabold text-2xl md:text-3xl tracking-tight text-text leading-[1.1]">
                From first call to launch.
              </h2>
            </div>
            <div className="relative">
              {processSteps.map((step, idx) => (
                <div key={step.num} className="wd-reveal opacity-0 relative flex justify-end gap-2 scroll-mt-24">
                  <div className="sticky top-24 flex w-36 flex-col items-end gap-2 self-start pb-4 max-md:hidden">
                    <span className="inline-flex h-6 items-center px-2.5 rounded-md bg-accent text-white font-sans font-semibold text-sm">
                      {step.num}
                    </span>
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
                      <span className="inline-flex h-6 items-center px-2.5 rounded-md bg-accent text-white font-sans font-semibold text-sm">
                        {step.num}
                      </span>
                      <span className="font-sans text-xs text-textMuted">{step.timeline}</span>
                    </div>
                    <h3 className="font-sans font-semibold text-xl md:text-2xl text-text tracking-tight">
                      {step.title}
                    </h3>
                    <p className="font-sans font-normal text-lg text-textMuted leading-relaxed max-w-xl">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 8: Case Studies - handled by ServiceLayout's RelatedCaseStudies */}

        {/* Section 9: What Determines Cost */}
        <section className="bg-accent-light py-16 md:py-24 px-6 md:px-12 border-t border-accent-border">
          <div className="max-w-4xl mx-auto">
            <h2 className="wd-reveal opacity-0 font-sans font-extrabold text-2xl md:text-3xl tracking-tight text-text mb-4">
              What determines the cost.
            </h2>
            <p className="wd-reveal opacity-0 font-sans text-lg text-textMuted leading-relaxed mb-10">
              Every website is different, and the cost reflects that. Here is what actually drives the price, and why the cheapest option is almost never the best investment.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {costFactors.map((item) => (
                <div
                  key={item.label}
                  className="wd-reveal opacity-0 rounded-xl border border-accent-border bg-surface p-6"
                >
                  <p className="font-sans font-bold text-base text-text mb-2">{item.label}</p>
                  <p className="font-sans text-sm text-textMuted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="wd-reveal opacity-0 mt-8 font-sans text-base text-text font-semibold">
              We give you a fixed price after the discovery call. No hourly billing, no surprise invoices, no scope creep.
            </p>
          </div>
        </section>

        {/* Section 10: Who This Is For */}
        <section className="bg-surface py-16 md:py-24 px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="wd-reveal opacity-0 font-sans font-extrabold text-2xl md:text-3xl tracking-tight text-text mb-10">
              Is this right for you?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="wd-reveal opacity-0">
                <p className="font-sans font-bold text-base text-text mb-4">This is for you if...</p>
                <ul className="space-y-3">
                  {forYou.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check size={18} strokeWidth={2.5} className="shrink-0 mt-0.5 text-green-600" />
                      <span className="font-sans text-base text-textMuted leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="wd-reveal opacity-0">
                <p className="font-sans font-bold text-base text-text mb-4">This might not be a fit if...</p>
                <ul className="space-y-3">
                  {notForYou.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <X size={18} strokeWidth={2.5} className="shrink-0 mt-0.5 text-textMuted/50" />
                      <span className="font-sans text-base text-textMuted leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 11: FAQ - handled by ServiceLayout's ServiceFaq */}

        {/* Section 12: Bakersfield Strip */}
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

        {/* Section 13: Custom CTA - handled via ctaOverride prop */}

      </ServiceLayout>
    </div>
  );
}
