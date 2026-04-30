/**
 * / QuadGrid 자율 검증 — desktop + mobile screenshot.
 * 8888 http-server 가 떠있어야 함.
 *
 * 실행: node scripts/verify-quad.mjs
 */
import { chromium } from "playwright"
import { mkdirSync } from "node:fs"

mkdirSync("tmp", { recursive: true })
const browser = await chromium.launch()

const viewports = [
  ["desktop", { width: 1440, height: 900 }],
  ["mobile", { width: 375, height: 812 }],
]

for (const [name, viewport] of viewports) {
  // reducedMotion=reduce → entrance fade-in 즉시 완료, fullPage screenshot에서 4 카드 모두 가시
  const ctx = await browser.newContext({
    viewport,
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  })
  const page = await ctx.newPage()
  await page.goto("http://localhost:8888/", { waitUntil: "networkidle" })
  await page.waitForFunction(() => document.querySelectorAll(".tour11-quad__card").length === 4, {
    timeout: 5000,
  })
  await page.locator("#features").scrollIntoViewIfNeeded()
  await page.waitForTimeout(900) // entrance stagger 80ms × 4 + transition 600ms
  await page.screenshot({ path: `tmp/quad-${name}.png`, fullPage: true })
  const cardCount = await page.locator(".tour11-quad__card").count()
  const visibleCount = await page.locator(".tour11-quad__card.is-visible").count()
  console.log(`${name}: ${cardCount} cards, ${visibleCount} visible — tmp/quad-${name}.png`)
  await ctx.close()
}

await browser.close()
console.log("done")
