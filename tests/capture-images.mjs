import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

await mkdir('test-results/sections', { recursive: true });
const browser = await chromium.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  headless: true
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
await page.goto('http://127.0.0.1:5173/');
await page.evaluate(() => document.fonts.ready);
await page.locator('img').evaluateAll(list => list.forEach(i => i.loading = 'eager'));
await page.evaluate(() => Promise.all(Array.from(document.images).map(i => i.decode().catch(() => {}))));

// Screenshot portrait-wide
await page.locator('.portrait-wide').screenshot({ path: 'test-results/sections/portrait-wide.png' });
// Screenshot photo-pair
await page.locator('.photo-pair').screenshot({ path: 'test-results/sections/photo-pair.png' });
// Screenshot profile-photo
await page.locator('.profile-photo').screenshot({ path: 'test-results/sections/profile-photo.png' });
// Screenshot story-images
await page.locator('.story-images').screenshot({ path: 'test-results/sections/story-images.png' });
// Screenshot compilation-cover
await page.locator('.compilation-cover').screenshot({ path: 'test-results/sections/compilation-cover.png' });

console.log('Screenshots captured successfully');
await browser.close();
