import { createClient } from '@sanity/client';
import { createReadStream } from 'fs';

const client = createClient({
    projectId: 'yz25oyux',
    dataset: 'production',
    token: process.env.SANITY_API_TOKEN_V2,
    apiVersion: '2025-03-01',
    useCdn: false,
});

const DOC_ID = 'cs-cold-email-personalization';

async function run() {
    // Upload new workflow image
    console.log('Uploading new workflow image...');
    const asset = await client.assets.upload(
        'image',
        createReadStream('/Users/rahullalia/Downloads/Email Images/workflow.jpg'),
        { filename: 'cold-email-make-workflow.jpg' }
    );
    console.log(`  Uploaded: ${asset._id}`);

    // Get current document and replace the old workflow image
    const doc = await client.getDocument(DOC_ID);
    const content = [...doc.content];

    const workflowIdx = content.findIndex(
        (b) => b._key === 'ce025' && b._type === 'caseStudyImage'
    );

    if (workflowIdx >= 0) {
        content[workflowIdx] = {
            ...content[workflowIdx],
            asset: {
                _type: 'image',
                asset: { _type: 'reference', _ref: asset._id },
            },
            alt: 'Make.com workflow: Get Leads from Google Sheets, Generate Icebreaker with GPT, Update Row with Icebreaker',
        };
        console.log(`Replaced workflow image at position ${workflowIdx}`);
    } else {
        console.error('Could not find workflow image block (ce025)');
        process.exit(1);
    }

    await client.patch(DOC_ID).set({ content }).commit();
    console.log('Done. Workflow image replaced and published.');
}

run().catch((e) => {
    console.error(e.message);
    process.exit(1);
});
