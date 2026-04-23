/**
 * /tour1/ (Variant B) screenshots for side-by-side comparison with /tour/ (Variant A).
 */
import { chromium } from "playwright"
import { mkdir } from "fs/promises"

await mkdir("verify-compare/tour1", { recursive: true })

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
})
const page = await ctx.newPage()

await page.goto("http://localhost:8888/tour1/", { waitUntil: "networkidle" })
await page.waitForTimeout(1500)

const h = await page.evaluate(() => document.body.scrollHeight)
for (let y = 0; y < h; y += 600) {
  await page.evaluate((y) => window.scrollTo(0, y), y)
  await page.waitForTimeout(400)
}
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(400)

await page.screenshot({ path: "verify-compare/tour1/landing-full.png", fullPage: true })
await page.screenshot({ path: "verify-compare/tour1/hero.png", fullPage: false })

await page.evaluate(() => {
  const g = document.querySelector(".tour-features-grid")
  if (g) g.scrollIntoView({ behavior: "instant", block: "start" })
})
await page.waitForTimeout(500)
await page.screenshot({ path: "verify-compare/tour1/features-grid.png", fullPage: false })

await browser.close()
console.log("scrollHeight:", h)
