import { defineField, defineType, defineArrayMember } from 'sanity';

export const caseStudyV2 = defineType({
    name: 'caseStudyV2',
    title: 'Case Study (V2)',
    type: 'document',
    groups: [
        { name: 'story', title: 'The Story', default: true },
        { name: 'proof', title: 'Proof & Metrics' },
        { name: 'content', title: 'Full Content' },
        { name: 'seo', title: 'SEO' },
        { name: 'settings', title: 'Settings' },
    ],
    fields: [
        // ===== THE STORY (what readers see first) =====
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            group: 'story',
            description: 'Results-focused headline. Lead with the outcome, not the process.',
            validation: (Rule) => Rule.required().max(120),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            group: 'story',
            options: { source: 'title', maxLength: 96 },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'clientName',
            title: 'Client Name',
            type: 'string',
            group: 'story',
            description: 'Name of the client or project. Use a generic label if confidential.',
        }),
        defineField({
            name: 'tag',
            title: 'Tag / Service Line',
            type: 'string',
            group: 'story',
            description: 'Short label shown on cards (e.g., "AI Automation & Lead Nurture")',
            validation: (Rule) => Rule.required().max(50),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            group: 'story',
            rows: 3,
            description: 'One to two sentence summary for listing pages and cards.',
            validation: (Rule) => Rule.required().max(300),
        }),
        defineField({
            name: 'featuredImage',
            title: 'Featured Image',
            type: 'image',
            group: 'story',
            options: { hotspot: true },
            description: 'Hero image for the case study page, cards, and social sharing. 1200x630px recommended.',
            fields: [
                defineField({
                    name: 'alt',
                    title: 'Alt Text',
                    type: 'string',
                    validation: (Rule) => Rule.required().min(10).max(125),
                }),
            ],
        }),
        defineField({
            name: 'tldr',
            title: 'TL;DR',
            type: 'text',
            group: 'story',
            rows: 3,
            description: 'Executive summary in 40 to 60 words. Front-load the key outcome.',
            validation: (Rule) => Rule.max(400),
        }),
        defineField({
            name: 'pullQuote',
            title: 'Pull Quote',
            type: 'text',
            group: 'story',
            rows: 2,
            description: 'One killer line for homepage display or social cards. Optional.',
            validation: (Rule) => Rule.max(200),
        }),

        // ===== PROOF & METRICS =====
        defineField({
            name: 'metrics',
            title: 'Key Metrics',
            type: 'array',
            group: 'proof',
            description: 'The numbers that matter. Up to 4 shown in the metrics grid.',
            of: [
                defineArrayMember({
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'value',
                            title: 'Value',
                            type: 'string',
                            description: 'e.g., "$36,000", "80%", "42"',
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'label',
                            title: 'Label',
                            type: 'string',
                            description: 'e.g., "Revenue Generated", "Hours Saved"',
                            validation: (Rule) => Rule.required(),
                        }),
                    ],
                }),
            ],
            validation: (Rule) => Rule.required().min(1).max(4),
        }),
        defineField({
            name: 'beforeAfter',
            title: 'Before / After Snapshot',
            type: 'object',
            group: 'proof',
            description: 'Quick before/after comparison. Shows up as a visual card on the page.',
            fields: [
                defineField({
                    name: 'before',
                    title: 'Before',
                    type: 'text',
                    rows: 2,
                    description: 'What things looked like before RSL/A (1 to 2 sentences)',
                }),
                defineField({
                    name: 'after',
                    title: 'After',
                    type: 'text',
                    rows: 2,
                    description: 'What things look like now (1 to 2 sentences)',
                }),
            ],
        }),
        defineField({
            name: 'keyTakeaways',
            title: 'Key Takeaways',
            type: 'array',
            group: 'proof',
            description: '3 to 5 actionable insights. Start each with a verb.',
            of: [defineArrayMember({ type: 'string' })],
            validation: (Rule) => Rule.max(5),
        }),
        defineField({
            name: 'problemStatement',
            title: 'The Problem',
            type: 'text',
            group: 'proof',
            rows: 4,
            description: 'Clear statement of the challenge (100 to 200 words). Be visceral about the pain point.',
        }),
        defineField({
            name: 'solutionApproach',
            title: 'The Solution',
            type: 'text',
            group: 'proof',
            rows: 4,
            description: 'How we solved it (100 to 200 words). Focus on methodology.',
        }),
        defineField({
            name: 'resultsOutcome',
            title: 'The Results',
            type: 'text',
            group: 'proof',
            rows: 4,
            description: 'Outcomes achieved (100 to 200 words). Lead with numbers.',
        }),

        // ===== FULL CONTENT (Portable Text) =====
        defineField({
            name: 'content',
            title: 'Content',
            type: 'array',
            group: 'content',
            of: [
                // Rich text blocks
                defineArrayMember({
                    type: 'block',
                    styles: [
                        { title: 'Normal', value: 'normal' },
                        { title: 'H2', value: 'h2' },
                        { title: 'H3', value: 'h3' },
                        { title: 'H4', value: 'h4' },
                        { title: 'Quote', value: 'blockquote' },
                    ],
                    lists: [
                        { title: 'Bullet', value: 'bullet' },
                        { title: 'Numbered', value: 'number' },
                    ],
                    marks: {
                        decorators: [
                            { title: 'Strong', value: 'strong' },
                            { title: 'Emphasis', value: 'em' },
                            { title: 'Code', value: 'code' },
                        ],
                        annotations: [
                            {
                                name: 'link',
                                type: 'object',
                                title: 'Link',
                                fields: [
                                    defineField({
                                        name: 'href',
                                        type: 'url',
                                        title: 'URL',
                                        validation: (Rule) => Rule.uri({ scheme: ['http', 'https', 'mailto', 'tel'] }),
                                    }),
                                    defineField({
                                        name: 'blank',
                                        type: 'boolean',
                                        title: 'Open in new tab',
                                        initialValue: true,
                                    }),
                                ],
                            },
                        ],
                    },
                }),
                // Enhanced Image
                defineArrayMember({
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
                            description: 'Describe the image for accessibility and SEO (10 to 125 chars)',
                            validation: (Rule) => Rule.required().min(10).max(125),
                        }),
                        defineField({
                            name: 'caption',
                            title: 'Caption',
                            type: 'text',
                            rows: 2,
                        }),
                        defineField({
                            name: 'credit',
                            title: 'Credit / Attribution',
                            type: 'string',
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
                }),
                // Legacy basic image (preserved for backward compat)
                defineArrayMember({
                    type: 'image',
                    title: 'Basic Image (Legacy)',
                    description: 'Use "Image" block instead for alt text and captions.',
                }),
                // Code block
                defineArrayMember({ type: 'code' }),
                // Video Embed
                defineArrayMember({
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
                }),
                // Callout Box
                defineArrayMember({
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
                                    { title: 'Tip', value: 'tip' },
                                    { title: 'Warning', value: 'warning' },
                                    { title: 'Info', value: 'info' },
                                    { title: 'Success', value: 'success' },
                                ],
                            },
                            initialValue: 'info',
                        }),
                        defineField({ name: 'title', title: 'Title', type: 'string' }),
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
                            const icons: Record<string, string> = { tip: 'TIP', warning: 'WARN', info: 'INFO', success: 'OK' };
                            return { title: `[${icons[type] || type}] ${title || ''}`, subtitle: content?.slice(0, 50) };
                        },
                    },
                }),
                // Testimonial Quote
                defineArrayMember({
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
                        defineField({ name: 'author', title: 'Author Name', type: 'string' }),
                        defineField({ name: 'role', title: 'Role / Company', type: 'string' }),
                    ],
                    preview: {
                        select: { quote: 'quote', author: 'author' },
                        prepare({ quote, author }) {
                            return { title: `"${quote?.slice(0, 40)}..."`, subtitle: author };
                        },
                    },
                }),
                // Stats Card
                defineArrayMember({
                    type: 'object',
                    name: 'statsCard',
                    title: 'Stats Card',
                    fields: [
                        defineField({
                            name: 'stats',
                            title: 'Stats',
                            type: 'array',
                            of: [
                                defineArrayMember({
                                    type: 'object',
                                    fields: [
                                        defineField({ name: 'value', title: 'Value', type: 'string' }),
                                        defineField({ name: 'label', title: 'Label', type: 'string' }),
                                    ],
                                }),
                            ],
                            validation: (Rule) => Rule.max(4),
                        }),
                    ],
                    preview: {
                        select: { stats: 'stats' },
                        prepare({ stats }) {
                            return { title: 'Stats Card', subtitle: stats?.map((s: { value: string }) => s.value).join(' | ') };
                        },
                    },
                }),
                // CTA Button
                defineArrayMember({
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
                            return { title: text, subtitle: url };
                        },
                    },
                }),
                // Divider
                defineArrayMember({
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
                            return { title: '--- Divider ---' };
                        },
                    },
                }),
                // Gated Resource Download
                defineArrayMember({
                    type: 'object',
                    name: 'gatedResource',
                    title: 'Gated Resource',
                    fields: [
                        defineField({
                            name: 'title',
                            title: 'Resource Title',
                            type: 'string',
                            validation: (Rule) => Rule.required(),
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
                            return { title: `Download: ${title}` };
                        },
                    },
                }),
                // Tech Stack
                defineArrayMember({
                    type: 'object',
                    name: 'techStack',
                    title: 'Tech Stack',
                    fields: [
                        defineField({
                            name: 'tools',
                            title: 'Tools',
                            type: 'array',
                            of: [
                                defineArrayMember({
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
                                }),
                            ],
                        }),
                    ],
                    preview: {
                        select: { tools: 'tools' },
                        prepare({ tools }) {
                            const names = tools?.map((t: { name: string }) => t.name).join(', ') || '';
                            return { title: 'Tech Stack', subtitle: names.slice(0, 60) };
                        },
                    },
                }),
            ],
        }),

        // ===== SEO =====
        defineField({
            name: 'seo',
            title: 'SEO Settings',
            type: 'object',
            group: 'seo',
            fields: [
                defineField({
                    name: 'metaTitle',
                    title: 'Meta Title',
                    type: 'string',
                    description: 'SEO title (60 to 70 chars). Defaults to main title if blank.',
                    validation: (Rule) => Rule.max(70),
                }),
                defineField({
                    name: 'metaDescription',
                    title: 'Meta Description',
                    type: 'text',
                    rows: 3,
                    description: 'SEO description (155 to 160 chars)',
                    validation: (Rule) => Rule.max(160),
                }),
                defineField({
                    name: 'socialImage',
                    title: 'Social Share Image',
                    type: 'image',
                    description: 'Override for Twitter/LinkedIn/Facebook (1200x630px). Falls back to featured image.',
                }),
                defineField({
                    name: 'keywords',
                    title: 'Keywords',
                    type: 'array',
                    of: [defineArrayMember({ type: 'string' })],
                    description: 'SEO keywords for this case study',
                    validation: (Rule) => Rule.max(10),
                }),
            ],
        }),
        defineField({
            name: 'faqSchema',
            title: 'FAQ Schema',
            type: 'array',
            group: 'seo',
            description: 'FAQ items for Google rich snippets (3 to 5 recommended)',
            of: [
                defineArrayMember({
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
                }),
            ],
        }),

        // ===== SETTINGS =====
        defineField({
            name: 'industry',
            title: 'Industry',
            type: 'string',
            group: 'settings',
            options: {
                list: [
                    { title: 'Salon / Spa', value: 'salon-spa' },
                    { title: 'Restaurant', value: 'restaurant' },
                    { title: 'Auto Detailing', value: 'auto-detailing' },
                    { title: 'Real Estate', value: 'real-estate' },
                    { title: 'Contractor / Home Services', value: 'contractor' },
                    { title: 'Medical / Dental', value: 'medical' },
                    { title: 'Legal', value: 'legal' },
                    { title: 'Fitness / Gym', value: 'fitness' },
                    { title: 'E-commerce', value: 'ecommerce' },
                    { title: 'SaaS', value: 'saas' },
                    { title: 'Agency', value: 'agency' },
                    { title: 'Non-Profit', value: 'nonprofit' },
                    { title: 'Media / Content', value: 'media' },
                    { title: 'Manufacturing', value: 'manufacturing' },
                    { title: 'Professional Services', value: 'professional-services' },
                    { title: 'Education', value: 'education' },
                ],
            },
        }),
        defineField({
            name: 'servicesUsed',
            title: 'Services Used',
            type: 'array',
            group: 'settings',
            description: 'RSL/A services applied in this project',
            of: [defineArrayMember({ type: 'string' })],
            options: {
                list: [
                    { title: 'AI Lead Generation', value: 'ai-lead-generation' },
                    { title: 'AI Automations', value: 'ai-automations' },
                    { title: 'AI Operations', value: 'ai-operations' },
                    { title: 'AI Digital Presence', value: 'ai-digital-presence' },
                    // Legacy values preserved for existing data
                    { title: 'AI Automation (Legacy)', value: 'ai-automation' },
                    { title: 'Paid Acquisition (Legacy)', value: 'paid-acquisition' },
                    { title: 'CRM Infrastructure (Legacy)', value: 'crm-infrastructure' },
                    { title: 'Smart Websites (Legacy)', value: 'smart-websites' },
                    { title: 'Local SEO (Legacy)', value: 'local-seo' },
                    { title: 'Content Marketing (Legacy)', value: 'content-marketing' },
                ],
            },
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            group: 'settings',
            options: {
                list: [
                    { title: 'AI Lead Generation', value: 'AI Lead Generation' },
                    { title: 'AI Automations', value: 'AI Automations' },
                    { title: 'AI Operations', value: 'AI Operations' },
                    { title: 'AI Digital Presence', value: 'AI Digital Presence' },
                    // Legacy values preserved for existing data
                    { title: 'AI Automation (Legacy)', value: 'AI Automation' },
                    { title: 'Marketing (Legacy)', value: 'Marketing' },
                    { title: 'CRM & Operations (Legacy)', value: 'CRM & Operations' },
                    { title: 'Development (Legacy)', value: 'Development' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'timeframe',
            title: 'Project Timeframe (days)',
            type: 'number',
            group: 'settings',
            description: 'How many days to achieve results (e.g., 90)',
        }),
        defineField({
            name: 'featured',
            title: 'Featured',
            type: 'boolean',
            group: 'settings',
            initialValue: false,
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
            title: 'Published At',
            type: 'datetime',
            group: 'settings',
        }),
        defineField({
            name: 'relatedBlogPosts',
            title: 'Related Blog Posts',
            type: 'array',
            group: 'settings',
            description: 'Pick 1 to 2 blog posts to link from this case study',
            of: [defineArrayMember({ type: 'reference', to: [{ type: 'blogPost' }] })],
            validation: (Rule) => Rule.max(2),
        }),
        defineField({
            name: 'relatedCases',
            title: 'Related Case Studies',
            type: 'array',
            group: 'settings',
            description: 'Link to 2 to 3 related case studies for internal linking',
            of: [defineArrayMember({ type: 'reference', to: [{ type: 'caseStudyV2' }] })],
            validation: (Rule) => Rule.max(3),
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'tag',
            media: 'featuredImage',
        },
    },
});
