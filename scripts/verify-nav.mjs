import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:8888/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
console.log('start url:', page.url());
// Direct click, verify navigation
await Promise.all([
  page.waitForURL('**/01-communication/**', { timeout: 5000 }).catch(e => console.log('wait err:', e.message)),
  page.click('.explorer-ul a.folder-title[href*="01-communication"]'),
]);
await page.waitForTimeout(500);
console.log('after click url:', page.url());
const h1 = await page.$eval('.article-title', el => el.textContent?.trim()).catch(() => null);
console.log('article title:', h1);
await browser.close();
