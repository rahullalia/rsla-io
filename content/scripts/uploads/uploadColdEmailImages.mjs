import { createClient } from '@sanity/client';
import { createReadStream } from 'fs';

const client = createClient({
    projectId: 'yz25oyux',
    dataset: 'production',
    token: process.env.SANITY_API_TOKEN_V2,
    apiVersion: '2025-03-01',
    useCdn: false,
});

const DOC_ID = 'drafts.cs-cold-email-personalization';

async function run() {
    // 1. Upload featured image
    console.log('Uploading featured image...');
    const featuredAsset = await client.assets.upload(
        'image',
        createReadStream('/Users/rahullalia/Downloads/Email Images/Feature Image.png'),
        { filename: 'cold-email-featured.png' }
    );
    console.log(`  Featured: ${featuredAsset._id}`);

    // 2. Upload leads spreadsheet screenshot
    console.log('Uploading leads screenshot...');
    const leadsAsset = await client.assets.upload(
        'image',
        createReadStream('/Users/rahullalia/Downloads/Email Images/Leads SS.jpg'),
        { filename: 'cold-email-leads-sheet.jpg' }
    );
    console.log(`  Leads SS: ${leadsAsset._id}`);

    // 3. Set featured image
    console.log('Setting featured image...');
    await client
        .patch(DOC_ID)
        .set({
            featuredImage: {
                _type: 'image',
                asset: { _type: 'reference', _ref: featuredAsset._id },
                alt: 'Case study: 1,200 personalized cold emails a day using AI icebreaker automation',
            },
        })
        .commit();

    // 4. Insert leads screenshot into the body after the "shortens the company name" paragraph
    const doc = await client.getDocument(DOC_ID);
    const content = [...doc.content];

    const leadsImage = {
        _type: 'caseStudyImage',
        _key: 'img_leads_sheet',
        asset: {
            _type: 'image',
            asset: { _type: 'reference', _ref: leadsAsset._id },
        },
        alt: 'Google Sheet with AI-generated icebreakers and shortened company names for cold email outreach',
        caption:
            'Each row gets a shortened company name and a personalized icebreaker, written back automatically by GPT.',
        size: 'large',
    };

    // Find the block about "The formula" callout (tip) and insert the screenshot after Step 2's callout
    const formulaIdx = content.findIndex(
        (b) => b._type === 'callout' && b.title === 'The formula'
    );

    if (formulaIdx >= 0) {
        content.splice(formulaIdx + 1, 0, leadsImage);
        console.log(`Inserted leads screenshot at position ${formulaIdx + 1}`);
    } else {
        // Fallback: find the "Step 3" heading and insert before it
        const step3Idx = content.findIndex(
            (b) =>
                b._type === 'block' &&
                b.style === 'h3' &&
                b.children?.[0]?.text?.includes('Step 3')
        );
        if (step3Idx >= 0) {
            content.splice(step3Idx, 0, leadsImage);
            console.log(`Inserted leads screenshot at position ${step3Idx}`);
        } else {
            console.error('Could not find insertion point for leads screenshot');
            process.exit(1);
        }
    }

    await client.patch(DOC_ID).set({ content }).commit();
    console.log(`Done. Total content blocks: ${content.length}`);
}

run().catch((e) => {
    console.error(e.message);
    process.exit(1);
});
