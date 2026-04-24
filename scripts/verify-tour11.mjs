/**
 * Verify /tour11/ — Hero + Horizontal sticky features + Quickstart + Footer.
 *
 * 6 screenshots:
 *   hero.png             — 초기 히어로 영역
 *   panel-1.png          — F01 패널 (진행 25%)
 *   panel-3.png          — F03~F04 패널 (진행 75%)
 *   quickstart.png       — Quickstart 탭 섹션
 *   quickstart-hover.png — 탭 hover 반응 (visible border + arrow + num scale)
 *   footer.png           — 다크 CTA 풋터
 */
import { chromium } from "playwright"
import { mkdirSync } from "node:fs"

mkdirSync("tmp/tour11-verify", { recursive: true })

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "no-preference",
  deviceScaleFactor: 1,
})
const page = await ctx.newPage()

page.on("pageerror", (err) => {
  console.error("[pageerror]", err.message)
})
page.on("console", (msg) => {
  if (msg.type() === "error") console.error("[console error]", msg.text())
})

await page.goto("http://localhost:8888/tour11/", { waitUntil: "networkidle" })
await page.waitForTimeout(500)

// Sanity checks
const heroTitleText = await page.$eval(".tour11-hero__title", (el) => el.textContent?.trim())
console.log("HERO TITLE:", heroTitleText)

const panelCount = await page.$$eval(".tour11-panel", (els) => els.length)
console.log("PANEL COUNT:", panelCount)

const tabCount = await page.$$eval(".tour11-tab", (els) => els.length)
console.log("TAB COUNT:", tabCount)

const features = await page.$("#features")
console.log("HAS #features:", Boolean(features))

const quickstart = await page.$("#quickstart")
console.log("HAS #quickstart:", Boolean(quickstart))

// 1. Hero
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(400)
await page.screenshot({ path: "tmp/tour11-verify/hero.png", fullPage: false })
console.log("[1/6] hero.png")

// 1b. Hero with cursor lit — move mouse into upper-right area to trigger matrix lighting
await page.mouse.move(1050, 300)
await page.waitForTimeout(400)
await page.screenshot({ path: "tmp/tour11-verify/hero-lit.png", fullPage: false })
console.log("[1b] hero-lit.png")
await page.mouse.move(0, 0)
await page.waitForTimeout(200)

// 2. Panel 1 (25% progress into horizontal section)
// horizontal section height = 400vh = 3600px at vh=900.
// To get 25% progress we need scroll to reach features top + 0.25*(3600-900) = featuresTop + 675.
// Easier: scroll to document position where features top is ~0, then +(0.25*2700)
const scrollTargets = await page.evaluate(() => {
  const features = document.getElementById("features")
  if (!features) return null
  const rect = features.getBoundingClientRect()
  const top = rect.top + window.scrollY
  const h = features.offsetHeight
  const vh = window.innerHeight
  const total = h - vh
  return { top, total, vh, h }
})
console.log("Features scroll target:", scrollTargets)

if (scrollTargets) {
  // Panel 1 (F01) = progress 0.  But at progress 0 exactly, the section has just hit pin,
  // so features top is at scrollY. To make sure pin engaged, scroll a few px past (progress 0.01).
  await page.evaluate(
    ({ top }) => window.scrollTo(0, top + 10),
    scrollTargets,
  )
  // Move mouse into F01 visual to trigger spotlight (right half of viewport)
  await page.mouse.move(1100, 500)
  await page.waitForTimeout(600)
  await page.screenshot({ path: "tmp/tour11-verify/panel-1.png", fullPage: false })
  console.log("[2/6] panel-1.png (F01 at progress 0)")

  // Panel 2 (F02) = progress 1/3.
  await page.evaluate(
    ({ top, total }) => window.scrollTo(0, top + Math.round(total * (1 / 3))),
    scrollTargets,
  )
  await page.mouse.move(1100, 500)
  await page.waitForTimeout(600)
  await page.screenshot({ path: "tmp/tour11-verify/panel-2.png", fullPage: false })
  console.log("[2b] panel-2.png (F02 at progress 1/3)")

  // Panel 3 (F03) = progress 2/3.
  await page.evaluate(
    ({ top, total }) => window.scrollTo(0, top + Math.round(total * (2 / 3))),
    scrollTargets,
  )
  await page.mouse.move(1100, 500)
  await page.waitForTimeout(600)
  await page.screenshot({ path: "tmp/tour11-verify/panel-3.png", fullPage: false })
  console.log("[3/6] panel-3.png (F03 at progress 2/3)")

  // Panel 4 (F04) = progress ~0.98 (end of horizontal section).
  await page.evaluate(
    ({ top, total }) => window.scrollTo(0, top + Math.round(total * 0.99)),
    scrollTargets,
  )
  await page.mouse.move(1100, 500)
  await page.waitForTimeout(600)
  await page.screenshot({ path: "tmp/tour11-verify/panel-4.png", fullPage: false })
  console.log("[3b] panel-4.png (F04 at progress ~1)")
}

// 4. Quickstart
await page.evaluate(() => {
  const qs = document.getElementById("quickstart")
  if (qs) {
    const top = qs.getBoundingClientRect().top + window.scrollY
    window.scrollTo(0, top - 40)
  }
})
await page.waitForTimeout(500)
await page.screenshot({ path: "tmp/tour11-verify/quickstart.png", fullPage: false })
console.log("[4/6] quickstart.png")

// 5. Quickstart hover — hover one of the tabs
// First make sure quickstart is centered on viewport
await page.evaluate(() => {
  const qs = document.getElementById("quickstart")
  if (qs) {
    const top = qs.getBoundingClientRect().top + window.scrollY
    window.scrollTo(0, top - 40)
  }
})
await page.waitForTimeout(300)

// Hover on the 3rd tab (03 전송)
const tab = page.locator(".tour11-tab").nth(2)
await tab.scrollIntoViewIfNeeded()
await page.waitForTimeout(200)
await tab.hover()
await page.waitForTimeout(500)
await page.screenshot({ path: "tmp/tour11-verify/quickstart-hover.png", fullPage: false })
console.log("[5/6] quickstart-hover.png")

// 6. Footer
await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
await page.waitForTimeout(500)
// Move mouse far away to reset magnetic state
await page.mouse.move(0, 0)
await page.waitForTimeout(500)
await page.screenshot({ path: "tmp/tour11-verify/footer.png", fullPage: false })
console.log("[6/6] footer.png")

await browser.close()
console.log("Done. All 6 screenshots captured to tmp/tour11-verify/")
