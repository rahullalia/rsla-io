import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pngToIco from 'png-to-ico';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const SRC_SVG = path.join(PUBLIC_DIR, 'images', 'logo', 'logomark.svg');

// Google requires exactly multiples of 48px to prevent scaling artifacts (the white border)
// A viewBox of 0 0 50 50 getting scaled to 48x48 leaves sub-pixel white gaps.
// We will change the viewbox, render it to exactly 48px and 96px, and convert to .ico

const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" fill="#0070F3"/>
  <polygon points="26.54,3.84 36.14,3.84 21.46,44.16 11.86,44.16" fill="#ffffff"/>
</svg>
`;

async function generateFavicons() {
    console.log('Generating perfect 48x48 and 96x96 favicons...');

    // Save updated SVG
    fs.writeFileSync(SRC_SVG, svgContent);
    console.log('✅ Overwrote logomark.svg with a perfect 48x48 viewBox');

    // Generate 48x48 PNG
    const png48 = await sharp(Buffer.from(svgContent))
        .resize(48, 48)
        .png()
        .toBuffer();

    // Generate 96x96 PNG
    const png96 = await sharp(Buffer.from(svgContent))
        .resize(96, 96)
        .png()
        .toBuffer();

    fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon-48.png'), png48);
    fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon-96.png'), png96);

    // Create ICO from the PNGs
    const icoBuffer = await pngToIco([
        path.join(PUBLIC_DIR, 'favicon-48.png'),
        path.join(PUBLIC_DIR, 'favicon-96.png')
    ]);

    fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), icoBuffer);
    console.log('✅ Generated multi-size favicon.ico');

    // Generate 180x180 Apple Touch Icon
    const svgApple = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="180" height="180">
    <rect width="180" height="180" fill="#0070F3"/>
    <polygon points="99.5,14.4 135.5,14.4 80.5,165.6 44.5,165.6" fill="#ffffff"/>
  </svg>
  `;
    await sharp(Buffer.from(svgApple))
        .resize(180, 180)
        .png()
        .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
    console.log('✅ Generated apple-touch-icon.png');

    // Cleanup tmp PNGs
    fs.unlinkSync(path.join(PUBLIC_DIR, 'favicon-48.png'));
    fs.unlinkSync(path.join(PUBLIC_DIR, 'favicon-96.png'));

    console.log('All done! Favicons are now mathematically flush.');
}

generateFavicons().catch(console.error);
