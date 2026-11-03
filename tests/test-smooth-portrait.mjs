import sharp from 'sharp';

const input = 'Pictures/formal picture/1X1.jpg';
const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
// Smoothly fade alpha at the left and right edges and bottom
const fadeX = 65; // pixels to fade on left/right
const fadeY = 50; // pixels to fade on bottom

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * channels;
    let factor = 1.0;

    // Left fade
    if (x < fadeX) {
      // Smooth cosine or smoothstep fade
      const t = x / fadeX;
      factor *= Math.sin(t * Math.PI * 0.5);
    }
    // Right fade
    if (x > width - 1 - fadeX) {
      const t = (width - 1 - x) / fadeX;
      factor *= Math.sin(t * Math.PI * 0.5);
    }
    // Bottom fade
    if (y > height - 1 - fadeY) {
      const t = (height - 1 - y) / fadeY;
      factor *= Math.sin(t * Math.PI * 0.5);
    }

    // Blend towards white (255, 255, 255) for smooth edge against white container
    // If factor < 1, blend RGB towards 255
    data[idx] = Math.round(data[idx] * factor + 255 * (1 - factor));
    data[idx + 1] = Math.round(data[idx + 1] * factor + 255 * (1 - factor));
    data[idx + 2] = Math.round(data[idx + 2] * factor + 255 * (1 - factor));
  }
}

await sharp(data, { raw: { width, height, channels } })
  .webp({ quality: 90 })
  .toFile('public/images/archive/formal-picture-1x1-test.webp');

console.log('Processed smooth image test');
