/**
 * Quickstart 페이지 자율 검증 — 1440×900 desktop viewport.
 * 각 quickstart의 모든 step에 대해:
 *   - fullPage screenshot (한 화면 안에 담기는지 확인)
 *   - stage cropped screenshot (hotspot 위치 정확성 확인)
 *
 * 실행: node scripts/verify-quickstart.mjs [slug]
 *   slug 안 주면 모든 quickstart, 주면 그것만.
 */
import { chromium } from "playwright"
import { mkdirSync } from "node:fs"

const BASE = "http://localhost:8888"
const OUT = "tmp/quickstart"
mkdirSync(OUT, { recursive: true })

const ALL_SLUGS = [
  "01-first-connection",
  "02-screen-size",
  "03-send-message",
  "04-edit-image",
  "05-gif-editor",
  "06-schedule-pla",
  "07-background-bgp",
  "08-firmware",
]

const target = process.argv[2]
const slugs = target ? [target] : ALL_SLUGS
const MAX_STEPS = 8

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: "reduce",
})
const page = await ctx.newPage()

for (const slug of slugs) {
  for (let s = 0; s < MAX_STEPS; s++) {
    const url = `${BASE}/tour/quickstart/${slug}/?s=${s}`
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 10000 })
      await page.waitForTimeout(400)
      const stageCount = await page.locator(".tour-stage").count()
      if (stageCount === 0) break
      // viewport (한 화면 안 담기는지) + stage crop (hotspot 위치)
      await page.screenshot({
        path: `${OUT}/${slug}-s${s + 1}-viewport.png`,
        fullPage: false,
      })
      await page.locator(".tour-stage").screenshot({
        path: `${OUT}/${slug}-s${s + 1}-stage.png`,
      })
      const hsCount = await page.locator(".tour-hotspot").count()
      console.log(`${slug} s${s + 1}: stage✓ hotspot=${hsCount}`)
    } catch (e) {
      if (s === 0) console.warn(`${slug} s${s + 1}: error ${e.message}`)
      break
    }
  }
}

await ctx.close()
await browser.close()
console.log("done")
