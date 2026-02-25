import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { codeInput } from '@sanity/code-input';
import { schemaTypes } from './src/sanity/schemas';

// Custom desk structure for clean Studio navigation
const deskStructure = (S: any) =>
    S.list()
        .title('Content')
        .items([
            // Blog Posts (V2 only — the ones the site uses)
            S.listItem()
                .title('Blog Posts')
                .schemaType('blogPostV2')
                .child(
                    S.documentTypeList('blogPostV2')
                        .title('Blog Posts')
                        .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                ),

            // Case Studies (V2 only)
            S.listItem()
                .title('Case Studies')
                .schemaType('caseStudyV2')
                .child(
                    S.documentTypeList('caseStudyV2')
                        .title('Case Studies')
                        .defaultOrdering([{ field: 'priority', direction: 'asc' }])
                ),

            S.divider(),

            // Categories
            S.listItem()
                .title('Categories')
                .schemaType('category')
                .child(S.documentTypeList('category').title('Categories')),

            // Authors
            S.listItem()
                .title('Authors')
                .schemaType('author')
                .child(S.documentTypeList('author').title('Authors')),

            S.divider(),

            // Legacy content (hidden from main nav but accessible)
            S.listItem()
                .title('Legacy')
                .child(
                    S.list()
                        .title('Legacy Content')
                        .items([
                            S.listItem()
                                .title('Blog Posts (V1)')
                                .schemaType('blogPost')
                                .child(S.documentTypeList('blogPost').title('Blog Posts (V1)')),
                            S.listItem()
                                .title('Case Studies (V1)')
                                .schemaType('caseStudy')
                                .child(S.documentTypeList('caseStudy').title('Case Studies (V1)')),
                            S.listItem()
                                .title('Blog Generation Jobs')
                                .schemaType('blogGenerationJob')
                                .child(S.documentTypeList('blogGenerationJob').title('Generation Jobs')),
                        ])
                ),
        ]);

export default defineConfig({
    name: 'default',
    title: 'RSL/A',
    projectId: 'yz25oyux',
    dataset: 'production',
    plugins: [
        structureTool({ structure: deskStructure }),
        visionTool({ defaultApiVersion: '2025-03-01' }),
        codeInput(),
    ],
    schema: {
        types: schemaTypes,
    },
});
