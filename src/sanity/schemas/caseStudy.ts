import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'caseStudy',
    title: 'Case Study',
    type: 'document',
    groups: [
        { name: 'content', title: 'Content', default: true },
        { name: 'meta', title: 'SEO & Metadata' },
        { name: 'settings', title: 'Settings' },
    ],
    fields: [
        // ===== CONTENT GROUP =====
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            group: 'content',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            group: 'content',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'clientName',
            title: 'Client Name',
            type: 'string',
            group: 'content',
            description: 'Name of the client or project',
        }),
        defineField({
            name: 'tag',
            title: 'Tag / Service Line',
            type: 'string',
            group: 'content',
            description: 'Primary service category',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            group: 'content',
            rows: 3,
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'metrics',
            title: 'Key Metrics',
            type: 'array',
            group: 'content',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'value',
                            title: 'Value',
                            type: 'string',
                            description: 'Metric value',
                        }),
                        defineField({
                            name: 'label',
                            title: 'Label',
                            type: 'string',
                            description: 'Metric label',
                        }),
                    ],
                },
            ],
            validation: (Rule) => Rule.required().min(1).max(3),
        }),

        // ===== LLM-FRIENDLY STRUCTURED CONTENT =====
        defineField({
            name: 'tldr',
            title: 'TL;DR Summary',
            type: 'text',
            group: 'content',
            rows: 3,
            description: 'Executive summary (40-60 words). Front-load the key outcome. Appears at top for quick scanning.',
            validation: (Rule) => Rule.max(400),
        }),
        defineField({
            name: 'keyTakeaways',
            title: 'Key Takeaways',
            type: 'array',
            group: 'content',
            description: '3-5 actionable insights readers should remember. Start each with a verb.',
            of: [{ type: 'string' }],
            validation: (Rule) => Rule.max(5),
        }),
        defineField({
            name: 'problemStatement',
            title: 'The Problem',
            type: 'text',
            group: 'content',
            rows: 4,
            description: 'Clear statement of the challenge (100-200 words). Be visceral about the pain point.',
        }),
        defineField({
            name: 'solutionApproach',
            title: 'The Solution',
            type: 'text',
            group: 'content',
            rows: 4,
            description: 'How we solved it (100-200 words). Focus on methodology and approach.',
        }),
        defineField({
            name: 'resultsOutcome',
            title: 'The Results',
            type: 'text',
            group: 'content',
            rows: 4,
            description: 'Outcomes achieved (100-200 words). Lead with numbers and specific metrics.',
        }),

        // ===== SEO & METADATA GROUP =====
        defineField({
            name: 'seo',
            title: 'SEO Settings',
            type: 'object',
            group: 'meta',
            fields: [
                defineField({
                    name: 'metaTitle',
                    title: 'Meta Title',
                    type: 'string',
                    description: 'SEO title (60-70 chars). Leave blank to use main title.',
                    validation: (Rule) => Rule.max(70),
                }),
                defineField({
                    name: 'metaDescription',
                    title: 'Meta Description',
                    type: 'text',
                    rows: 3,
                    description: 'SEO description (155-160 chars)',
                    validation: (Rule) => Rule.max(160),
                }),
                defineField({
                    name: 'socialImage',
                    title: 'Social Share Image',
                    type: 'image',
                    description: 'Image for Twitter/LinkedIn/Facebook sharing (1200x630px recommended)',
                }),
            ],
        }),
        defineField({
            name: 'industry',
            title: 'Industry',
            type: 'string',
            group: 'meta',
            options: {
                list: [
                    { title: 'Salon/Spa', value: 'salon-spa' },
                    { title: 'Restaurant', value: 'restaurant' },
                    { title: 'Auto Detailing', value: 'auto-detailing' },
                    { title: 'Real Estate', value: 'real-estate' },
                    { title: 'Contractor/Home Services', value: 'contractor' },
                    { title: 'Medical/Dental', value: 'medical' },
                    { title: 'Legal', value: 'legal' },
                    { title: 'Fitness/Gym', value: 'fitness' },
                    { title: 'E-commerce', value: 'ecommerce' },
                    { title: 'SaaS', value: 'saas' },
                    { title: 'Agency', value: 'agency' },
                    { title: 'Non-Profit', value: 'nonprofit' },
                    { title: 'Media/Content', value: 'media' },
                    { title: 'Manufacturing', value: 'manufacturing' },
                ],
            },
            description: 'Industry vertical for topic clustering',
        }),
        defineField({
            name: 'servicesUsed',
            title: 'Services Used',
            type: 'array',
            group: 'meta',
            description: 'RSL/A services applied in this project (for filtering and clustering)',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'AI Automation', value: 'ai-automation' },
                    { title: 'Paid Acquisition', value: 'paid-acquisition' },
                    { title: 'CRM Infrastructure', value: 'crm-infrastructure' },
                    { title: 'Smart Websites', value: 'smart-websites' },
                    { title: 'Local SEO', value: 'local-seo' },
                    { title: 'Content Marketing', value: 'content-marketing' },
                ],
            },
        }),
        defineField({
            name: 'timeframe',
            title: 'Project Timeframe (days)',
            type: 'number',
            group: 'meta',
            description: 'How many days to achieve results (e.g., 90)',
        }),
        defineField({
            name: 'faqSchema',
            title: 'FAQ Schema',
            type: 'array',
            group: 'meta',
            description: 'FAQ items for rich snippets (3-5 recommended)',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'question',
                            title: 'Question',
                            type: 'string',
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'answer',
                            title: 'Answer',
                            type: 'text',
                            rows: 3,
                            validation: (Rule) => Rule.required(),
                        }),
                    ],
                    preview: {
                        select: { question: 'question' },
                        prepare({ question }) {
                            return { title: question };
                        },
                    },
                },
            ],
        }),

        // ===== SETTINGS GROUP =====
        defineField({
            name: 'featured',
            title: 'Featured',
            type: 'boolean',
            group: 'settings',
            initialValue: false,
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            group: 'settings',
            options: {
                list: [
                    { title: 'AI Automation', value: 'AI Automation' },
                    { title: 'Marketing', value: 'Marketing' },
                    { title: 'CRM & Operations', value: 'CRM & Operations' },
                    { title: 'Development', value: 'Development' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'priority',
            title: 'Priority',
            type: 'number',
            group: 'settings',
            description: 'Lower number = higher priority (appears first)',
            initialValue: 10,
        }),
        defineField({
            name: 'annualSavings',
            title: 'Annual Savings (Number)',
            type: 'number',
            group: 'settings',
            description: 'Used for sorting by highest ROI. Enter raw number (e.g., 136000)',
        }),
        defineField({
            name: 'publishedAt',
            title: 'Published at',
            type: 'datetime',
            group: 'settings',
        }),
        defineField({
            name: 'relatedBlogPosts',
            title: 'Related Blog Posts',
            type: 'array',
            group: 'settings',
            description: 'Pick 1-2 blog posts to link from this case study',
            of: [{ type: 'reference', to: [{ type: 'blogPost' }] }],
            validation: (Rule) => Rule.max(2),
        }),
        defineField({
            name: 'relatedCases',
            title: 'Related Case Studies',
            type: 'array',
            group: 'settings',
            description: 'Link to 2-3 related case studies for internal linking',
            of: [{ type: 'reference', to: [{ type: 'caseStudy' }] }],
            validation: (Rule) => Rule.max(3),
        }),
        defineField({
            name: 'content',
            title: 'Content',
            type: 'array',
            group: 'content',
            of: [
                { type: 'block' },
                // Enhanced Image with SEO fields
                {
                    type: 'object',
                    name: 'caseStudyImage',
                    title: 'Image',
                    fields: [
                        defineField({
                            name: 'asset',
                            title: 'Image',
                            type: 'image',
                            options: { hotspot: true },
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'alt',
                            title: 'Alt Text',
                            type: 'string',
                            description: 'Describe the image for accessibility & SEO (10-125 chars)',
                            validation: (Rule) => Rule.required().min(10).max(125),
                        }),
                        defineField({
                            name: 'caption',
                            title: 'Caption',
                            type: 'text',
                            rows: 2,
                            description: 'Optional caption displayed below image',
                        }),
                        defineField({
                            name: 'credit',
                            title: 'Credit/Attribution',
                            type: 'string',
                            description: 'Image attribution or source',
                        }),
                        defineField({
                            name: 'size',
                            title: 'Display Size',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Full Width', value: 'full' },
                                    { title: 'Large (75%)', value: 'large' },
                                    { title: 'Medium (50%)', value: 'medium' },
                                    { title: 'Small (25%)', value: 'small' },
                                ],
                            },
                            initialValue: 'full',
                        }),
                    ],
                    preview: {
                        select: { image: 'asset', alt: 'alt', caption: 'caption' },
                        prepare({ image, alt, caption }) {
                            return { title: alt || 'Image', subtitle: caption || 'No caption', media: image };
                        },
                    },
                },
                {
                    type: 'image',
                    title: 'Basic Image (Legacy)',
                    description: 'Use "Image" block instead for alt text and captions.',
                },
                { type: 'code' },
                // Video Embed
                {
                    type: 'object',
                    name: 'videoEmbed',
                    title: 'Video Embed',
                    fields: [
                        defineField({
                            name: 'url',
                            title: 'Video URL',
                            type: 'url',
                            description: 'YouTube, Vimeo, Loom, or Wistia URL',
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'orientation',
                            title: 'Orientation',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Horizontal (16:9)', value: 'horizontal' },
                                    { title: 'Vertical (9:16)', value: 'vertical' },
                                ],
                            },
                            initialValue: 'horizontal',
                        }),
                        defineField({
                            name: 'caption',
                            title: 'Caption',
                            type: 'string',
                        }),
                    ],
                    preview: {
                        select: { url: 'url', caption: 'caption', orientation: 'orientation' },
                        prepare({ url, caption, orientation }) {
                            const orient = orientation === 'vertical' ? '(Vertical)' : '';
                            return { title: caption || `Video Embed ${orient}`, subtitle: url };
                        },
                    },
                },
                // Callout Box (tips, warnings, info)
                {
                    type: 'object',
                    name: 'callout',
                    title: 'Callout Box',
                    fields: [
                        defineField({
                            name: 'type',
                            title: 'Type',
                            type: 'string',
                            options: {
                                list: [
                                    { title: '💡 Tip', value: 'tip' },
                                    { title: '⚠️ Warning', value: 'warning' },
                                    { title: 'ℹ️ Info', value: 'info' },
                                    { title: '✅ Success', value: 'success' },
                                ],
                            },
                            initialValue: 'info',
                        }),
                        defineField({
                            name: 'title',
                            title: 'Title',
                            type: 'string',
                        }),
                        defineField({
                            name: 'content',
                            title: 'Content',
                            type: 'text',
                            rows: 3,
                            validation: (Rule) => Rule.required(),
                        }),
                    ],
                    preview: {
                        select: { type: 'type', title: 'title', content: 'content' },
                        prepare({ type, title, content }) {
                            const icons: Record<string, string> = { tip: '💡', warning: '⚠️', info: 'ℹ️', success: '✅' };
                            return { title: `${icons[type] || ''} ${title || type}`, subtitle: content?.slice(0, 50) };
                        },
                    },
                },
                // Testimonial Quote
                {
                    type: 'object',
                    name: 'testimonial',
                    title: 'Testimonial',
                    fields: [
                        defineField({
                            name: 'quote',
                            title: 'Quote',
                            type: 'text',
                            rows: 3,
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'author',
                            title: 'Author Name',
                            type: 'string',
                        }),
                        defineField({
                            name: 'role',
                            title: 'Role/Company',
                            type: 'string',
                        }),
                    ],
                    preview: {
                        select: { quote: 'quote', author: 'author' },
                        prepare({ quote, author }) {
                            return { title: `"${quote?.slice(0, 40)}..."`, subtitle: author };
                        },
                    },
                },
                // Stats Card (inline metrics)
                {
                    type: 'object',
                    name: 'statsCard',
                    title: 'Stats Card',
                    fields: [
                        defineField({
                            name: 'stats',
                            title: 'Stats',
                            type: 'array',
                            of: [{
                                type: 'object',
                                fields: [
                                    defineField({ name: 'value', title: 'Value', type: 'string' }),
                                    defineField({ name: 'label', title: 'Label', type: 'string' }),
                                ],
                            }],
                            validation: (Rule) => Rule.max(4),
                        }),
                    ],
                    preview: {
                        select: { stats: 'stats' },
                        prepare({ stats }) {
                            return { title: 'Stats Card', subtitle: stats?.map((s: { value: string }) => s.value).join(' | ') };
                        },
                    },
                },
                // CTA Button
                {
                    type: 'object',
                    name: 'ctaButton',
                    title: 'CTA Button',
                    fields: [
                        defineField({
                            name: 'text',
                            title: 'Button Text',
                            type: 'string',
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'url',
                            title: 'URL',
                            type: 'string',
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'style',
                            title: 'Style',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Primary (Blue)', value: 'primary' },
                                    { title: 'Secondary (Outline)', value: 'secondary' },
                                ],
                            },
                            initialValue: 'primary',
                        }),
                    ],
                    preview: {
                        select: { text: 'text', url: 'url' },
                        prepare({ text, url }) {
                            return { title: `🔘 ${text}`, subtitle: url };
                        },
                    },
                },
                // Divider
                {
                    type: 'object',
                    name: 'divider',
                    title: 'Divider',
                    fields: [
                        defineField({
                            name: 'style',
                            title: 'Style',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Line', value: 'line' },
                                    { title: 'Dots', value: 'dots' },
                                    { title: 'Space', value: 'space' },
                                ],
                            },
                            initialValue: 'line',
                        }),
                    ],
                    preview: {
                        prepare() {
                            return { title: '─── Divider ───' };
                        },
                    },
                },
                // Gated Resource Download
                {
                    type: 'object',
                    name: 'gatedResource',
                    title: 'Gated Resource',
                    fields: [
                        defineField({
                            name: 'title',
                            title: 'Resource Title',
                            type: 'string',
                            validation: (Rule) => Rule.required(),
                            description: 'e.g., "Make.com Blueprint"',
                        }),
                        defineField({
                            name: 'description',
                            title: 'Description',
                            type: 'string',
                            description: 'Short description of what they get',
                        }),
                        defineField({
                            name: 'downloadUrl',
                            title: 'Download URL',
                            type: 'string',
                            validation: (Rule) => Rule.required(),
                            description: 'Path to the downloadable file (e.g., /downloads/case-studies/email-ice-breaker/blueprint.json)',
                        }),
                        defineField({
                            name: 'buttonText',
                            title: 'Button Text',
                            type: 'string',
                            initialValue: 'Download Free Resource',
                        }),
                    ],
                    preview: {
                        select: { title: 'title' },
                        prepare({ title }) {
                            return { title: `📥 ${title}` };
                        },
                    },
                },
                // Tech Stack
                {
                    type: 'object',
                    name: 'techStack',
                    title: 'Tech Stack',
                    fields: [
                        defineField({
                            name: 'tools',
                            title: 'Tools',
                            type: 'array',
                            of: [{
                                type: 'object',
                                fields: [
                                    defineField({ name: 'name', title: 'Tool Name', type: 'string', validation: (Rule) => Rule.required() }),
                                    defineField({ name: 'url', title: 'URL (Affiliate Link)', type: 'url' }),
                                    defineField({ name: 'promo', title: 'Promo Text', type: 'string', description: 'e.g., "Free snapshot included"' }),
                                ],
                                preview: {
                                    select: { name: 'name', promo: 'promo' },
                                    prepare({ name, promo }) {
                                        return { title: name, subtitle: promo };
                                    },
                                },
                            }],
                        }),
                    ],
                    preview: {
                        select: { tools: 'tools' },
                        prepare({ tools }) {
                            const names = tools?.map((t: { name: string }) => t.name).join(', ') || '';
                            return { title: '🔧 Tech Stack', subtitle: names.slice(0, 60) };
                        },
                    },
                },
            ],
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'tag',
        },
    },
});
