import { createClient } from '@sanity/client';

const client = createClient({
    projectId: 'yz25oyux',
    dataset: 'production',
    token: process.env.SANITY_TOKEN,
    apiVersion: '2025-03-01',
    useCdn: false,
});

const DOC_ID = 'drafts.6cc64416-d2bb-4c0e-a0c3-4e6901f39a11';

async function run() {
    const doc = await client.getDocument(DOC_ID);
    const content = [...doc.content];

    const testimonialVideo = {
        _type: 'videoEmbed',
        _key: 'vid_testimonial',
        url: 'https://rsla.wistia.com/medias/hr0yfppjnl',
        orientation: 'vertical',
        caption: 'Laiz shares how both suites were filled in just a few months',
    };

    // Insert after the blockquote ("I tried for years...")
    const quoteIdx = content.findIndex(
        (b) => b._type === 'block' && b.style === 'blockquote'
    );

    if (quoteIdx >= 0) {
        content.splice(quoteIdx + 1, 0, testimonialVideo);
        console.log(`Inserted testimonial video at position ${quoteIdx + 1}`);
    } else {
        console.error('Could not find blockquote');
        process.exit(1);
    }

    await client.patch(DOC_ID).set({ content }).commit();
    console.log(`Done. Total content blocks: ${content.length}`);
}

run().catch((e) => {
    console.error(e.message);
    process.exit(1);
});
