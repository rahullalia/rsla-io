import { createClient } from '@sanity/client';
import { createReadStream } from 'fs';

const client = createClient({
    projectId: 'yz25oyux',
    dataset: 'production',
    token: process.env.SANITY_API_TOKEN_V2,
    apiVersion: '2025-03-01',
    useCdn: false,
});

const DOC_ID = 'drafts.cs-nonprofit-volunteer-automation';

async function run() {
    // 1. Upload featured image
    console.log('Uploading featured image...');
    const asset = await client.assets.upload(
        'image',
        createReadStream('/Users/rahullalia/Downloads/Non Profit Images/Volunteer Onboarding Automation.png'),
        { filename: 'nonprofit-volunteer-onboarding-featured.png' }
    );
    console.log(`  Asset ID: ${asset._id}`);

    // 2. Set featured image on the draft
    console.log('Setting featured image...');
    await client
        .patch(DOC_ID)
        .set({
            featuredImage: {
                _type: 'image',
                asset: { _type: 'reference', _ref: asset._id },
                alt: 'Case study: $40K role replaced in 5 days with volunteer onboarding automation',
            },
            status: 'published',
        })
        .commit();
    console.log('Featured image set and status updated to published.');

    // 3. Publish the document
    console.log('Publishing...');
    const response = await fetch(
        'https://yz25oyux.api.sanity.io/v2025-03-01/data/actions/production',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.SANITY_API_TOKEN_V2}`,
            },
            body: JSON.stringify({
                actions: [
                    {
                        actionType: 'sanity.action.document.publish',
                        draftId: DOC_ID,
                        publishedId: 'cs-nonprofit-volunteer-automation',
                    },
                ],
            }),
        }
    );

    if (response.ok) {
        console.log('Done. Nonprofit case study published.');
    } else {
        const err = await response.text();
        console.error('Publish failed:', err);
        process.exit(1);
    }
}

run().catch((e) => {
    console.error(e.message);
    process.exit(1);
});
