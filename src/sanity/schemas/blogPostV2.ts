import { defineType, defineField, defineArrayMember } from 'sanity';

export const blogPostV2 = defineType({
    name: 'blogPostV2',
    title: 'Blog Post (V2)',
    type: 'document',
    groups: [
        { name: 'content', title: 'Content', default: true },
        { name: 'seo', title: 'SEO' },
        { name: 'settings', title: 'Settings' },
    ],
    fields: [
        // ===== CONTENT =====
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            group: 'content',
            validation: (Rule) => Rule.required().max(120),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            group: 'content',
            options: { source: 'title', maxLength: 96 },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'excerpt',
            title: 'Excerpt',
            type: 'text',
            group: 'content',
            rows: 3,
            description: 'Brief summary for listing pages and social sharing (max 200 chars)',
            validation: (Rule) => Rule.required().max(200),
        }),
        defineField({
            name: 'pullQuote',
            title: 'Pull Quote',
            type: 'text',
            group: 'content',
            rows: 2,
            description: 'One standout line for homepage cards or social posts. Optional.',
            validation: (Rule) => Rule.max(200),
        }),
        defineField({
            name: 'featuredImage',
            title: 'Featured Image',
            type: 'image',
            group: 'content',
            options: { hotspot: true },
            fields: [
                defineField({
                    name: 'alt',
                    title: 'Alt Text',
                    type: 'string',
                    description: 'Describe the image for accessibility and SEO',
                    validation: (Rule) => Rule.required(),
                }),
            ],
        }),
        defineField({
            name: 'author',
            title: 'Author',
            type: 'reference',
            group: 'content',
            to: [{ type: 'author' }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'body',
            title: 'Body',
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
                // Image with alt, caption, sizing
                defineArrayMember({
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        defineField({
                            name: 'alt',
                            type: 'string',
                            title: 'Alt Text',
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'caption',
                            type: 'string',
                            title: 'Caption',
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
                                ],
                            },
                            initialValue: 'full',
                        }),
                    ],
                }),
                // Code block
                defineArrayMember({
                    type: 'code',
                    options: {
                        language: 'javascript',
                        languageAlternatives: [
                            { title: 'JavaScript', value: 'javascript' },
                            { title: 'TypeScript', value: 'typescript' },
                            { title: 'Python', value: 'python' },
                            { title: 'HTML', value: 'html' },
                            { title: 'CSS', value: 'css' },
                            { title: 'JSON', value: 'json' },
                            { title: 'Bash', value: 'bash' },
                            { title: 'GROQ', value: 'groq' },
                        ],
                        withFilename: true,
                    },
                }),
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
                                        defineField({ name: 'promo', title: 'Promo Text', type: 'string', description: 'e.g., "Free trial available"' }),
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
            validation: (Rule) => Rule.required(),
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
                    description: 'SEO title (60 chars max). Defaults to post title if blank.',
                    validation: (Rule) => Rule.max(60),
                }),
                defineField({
                    name: 'metaDescription',
                    title: 'Meta Description',
                    type: 'text',
                    rows: 3,
                    description: 'SEO description (160 chars max). Defaults to excerpt if blank.',
                    validation: (Rule) => Rule.max(160),
                }),
                defineField({
                    name: 'keywords',
                    title: 'Keywords',
                    type: 'array',
                    of: [defineArrayMember({ type: 'string' })],
                    description: 'SEO keywords for this post',
                    validation: (Rule) => Rule.max(10),
                }),
                defineField({
                    name: 'socialImage',
                    title: 'Social Share Image',
                    type: 'image',
                    description: 'Override for social sharing (1200x630px). Falls back to featured image.',
                }),
            ],
        }),

        // ===== SETTINGS =====
        defineField({
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
            group: 'settings',
            initialValue: () => new Date().toISOString(),
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'categories',
            title: 'Categories',
            type: 'array',
            group: 'settings',
            of: [defineArrayMember({ type: 'reference', to: [{ type: 'category' }] })],
        }),
        defineField({
            name: 'readingTime',
            title: 'Reading Time (minutes)',
            type: 'number',
            group: 'settings',
            description: 'Estimated reading time. Set manually or leave blank.',
        }),
        defineField({
            name: 'relatedCaseStudies',
            title: 'Related Case Studies',
            type: 'array',
            group: 'settings',
            description: 'Pick 1 to 2 case studies to link from this post',
            of: [
                defineArrayMember({ type: 'reference', to: [{ type: 'caseStudy' }, { type: 'caseStudyV2' }] }),
            ],
            validation: (Rule) => Rule.max(2),
        }),
        defineField({
            name: 'relatedPosts',
            title: 'Related Blog Posts',
            type: 'array',
            group: 'settings',
            description: 'Pick 1 to 3 related posts for the "Read Next" section',
            of: [
                defineArrayMember({ type: 'reference', to: [{ type: 'blogPostV2' }] }),
            ],
            validation: (Rule) => Rule.max(3),
        }),
    ],
    preview: {
        select: {
            title: 'title',
            author: 'author.name',
            media: 'featuredImage',
            publishedAt: 'publishedAt',
        },
        prepare({ title, author, media, publishedAt }) {
            const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : 'No date';
            return {
                title,
                subtitle: `By ${author || 'Unknown'} | ${date}`,
                media,
            };
        },
    },
});
