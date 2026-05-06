import { services } from '@/data/serviceData';
import ServiceLayout from '@/components/services/ServiceLayout';

const service = services['web-design'];

const whatYouGet = [
  {
    label: 'Custom design',
    desc: 'Built in Figma and coded from scratch in React or Next.js. No templates, no page builders.',
  },
  {
    label: 'SEO-ready from day one',
    desc: 'Semantic HTML, proper heading hierarchy, meta tags, schema markup, and sitemap all wired up at launch.',
  },
  {
    label: 'Mobile-first',
    desc: 'Designed for mobile screens first, then scaled up. Works on every device without compromise.',
  },
  {
    label: 'Fast load times',
    desc: 'Optimized images, code splitting, and Vercel edge delivery. Core Web Vitals green before you go live.',
  },
];

const process = [
  {
    step: 'Strategy call',
    desc: 'We map your goals, audience, and conversion path before anything goes into Figma.',
  },
  {
    step: 'Wireframes and design',
    desc: 'Low-fi structure first, then high-fidelity Figma mockups with your brand. You review before we build.',
  },
  {
    step: 'Build and QA',
    desc: 'Component-by-component React build with cross-browser and device testing before handoff.',
  },
  {
    step: 'Launch and handoff',
    desc: 'We handle the Vercel deploy, DNS cutover, and a walkthrough so your team knows how to update content.',
  },
];

export default function WebDesign() {
  return (
    <ServiceLayout service={service}>
      <section className="bg-accent-light py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto space-y-16">
          <div>
            <h2 className="font-sans font-extrabold text-xl md:text-2xl tracking-tight text-text mb-4">
              What you get
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whatYouGet.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-accent-border bg-surface p-5"
                >
                  <p className="font-sans font-bold text-base text-text mb-1">{item.label}</p>
                  <p className="font-sans text-sm text-textMuted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-sans font-extrabold text-xl md:text-2xl tracking-tight text-text mb-4">
              Our process
            </h2>
            <ol className="space-y-4">
              {process.map((item, i) => (
                <li key={item.step} className="flex gap-4 items-start">
                  <span className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 font-sans text-sm font-bold text-accent">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-sans font-bold text-base text-text">{item.step}</p>
                    <p className="font-sans text-sm text-textMuted leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </ServiceLayout>
  );
}
