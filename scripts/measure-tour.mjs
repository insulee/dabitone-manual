import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }});
await page.goto('http://localhost:8888/tour/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const doc = await page.evaluate(() => {
  const shots = Array.from(document.querySelectorAll('.tour-shot')).map((s,i) => ({
    i, label: s.querySelector('.tour-shot__eyebrow')?.textContent,
    h: s.offsetHeight, top: s.getBoundingClientRect().top + window.scrollY
  }));
  const hero = document.querySelector('.tour-hero');
  const mani = document.querySelector('.tour-manifesto');
  const tabs = document.querySelector('.tour-tabs');
  const footer = document.querySelector('.tour-footer');
  return {
    total: document.body.scrollHeight,
    viewport: window.innerHeight,
    hero: hero?.offsetHeight,
    manifesto: mani?.offsetHeight,
    shots,
    tabs: tabs?.offsetHeight,
    footer: footer?.offsetHeight,
  };
});
console.log(JSON.stringify(doc, null, 2));
await browser.close();
