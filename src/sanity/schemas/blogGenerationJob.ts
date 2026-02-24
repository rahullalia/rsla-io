import { defineField, defineType } from 'sanity'

export const blogGenerationJob = defineType({
  name: 'blogGenerationJob',
  title: 'Blog Generation Job',
  type: 'document',
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Generating Outline', value: 'generating-outline' },
          { title: 'Generating Sections', value: 'generating-sections' },
          { title: 'Generating SEO', value: 'generating-seo' },
          { title: 'Creating Draft', value: 'creating-draft' },
          { title: 'Completed', value: 'completed' },
          { title: 'Failed', value: 'failed' },
        ],
      },
    }),
    defineField({
      name: 'progress',
      title: 'Progress',
      type: 'number',
    }),
    defineField({
      name: 'currentStep',
      title: 'Current Step',
      type: 'string',
    }),
    defineField({
      name: 'brief',
      title: 'Content Brief',
      type: 'object',
      fields: [
        defineField({ name: 'title', type: 'string' }),
        defineField({ name: 'primaryKeyword', type: 'string' }),
        defineField({ name: 'tone', type: 'string' }),
        defineField({ name: 'wordCount', type: 'number' }),
        defineField({ name: 'secondaryKeywords', type: 'array', of: [{ type: 'string' }] }),
        defineField({ name: 'additionalInstructions', type: 'text' }),
      ],
    }),
    defineField({
      name: 'outline',
      title: 'Generated Outline',
      type: 'text',
    }),
    defineField({
      name: 'sections',
      title: 'Generated Sections',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'fullMarkdown',
      title: 'Full Markdown',
      type: 'text',
    }),
    defineField({
      name: 'seoMetadata',
      title: 'SEO Metadata',
      type: 'object',
      fields: [
        defineField({ name: 'title', type: 'string' }),
        defineField({ name: 'description', type: 'text' }),
        defineField({ name: 'slug', type: 'string' }),
        defineField({ name: 'excerpt', type: 'text' }),
        defineField({ name: 'tags', type: 'array', of: [{ type: 'string' }] }),
      ],
    }),
    defineField({
      name: 'logs',
      title: 'Logs',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'error',
      title: 'Error',
      type: 'string',
    }),
    defineField({
      name: 'result',
      title: 'Result',
      type: 'object',
      fields: [
        defineField({ name: 'sanityDocumentId', type: 'string' }),
        defineField({ name: 'studioUrl', type: 'string' }),
        defineField({ name: 'futurePublishedUrl', type: 'string' }),
      ],
    }),
  ],
})
