#!/usr/bin/env node
/**
 * shot-tour4.mjs — /tour4/ Editorial Magazine 5종 스크린샷.
 *
 * 1. cover (viewport 1440×900)
 * 2. contents (viewport, scrolled)
 * 3. spread-01 (viewport, scrolled)
 * 4. ticker-colophon (viewport, near bottom)
 * 5. full (fullPage 1440w)
 * 6. mobile cover (viewport 375×812)
 */
import { chromium } from "playwright"
import { mkdirSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, "..")
const outDir = resolve(projectRoot, "tmp", "tour4-shots")
mkdirSync(outDir, { recursive: true })

const URL = "http://localhost:8888/tour4/"

const browser = await chromium.launch()
const ctxDesktop = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
})
const page = await ctxDesktop.newPage()
await page.goto(URL, { waitUntil: "networkidle" })
await page.waitForTimeout(1000) // wait for font load + reveal animations

// 1. Cover
await page.screenshot({ path: resolve(outDir, "1-cover.png") })
console.log("✓ 1-cover.png")

// 2. Contents — scroll to #contents
await page.evaluate(() => document.querySelector("#contents")?.scrollIntoView({ block: "start" }))
await page.waitForTimeout(800)
await page.screenshot({ path: resolve(outDir, "2-contents.png") })
console.log("✓ 2-contents.png")

// 3. Spread 01
await page.evaluate(() => document.querySelector("#fig01")?.scrollIntoView({ block: "start" }))
await page.waitForTimeout(800)
await page.screenshot({ path: resolve(outDir, "3-spread-01.png") })
console.log("✓ 3-spread-01.png")

// 4. Ticker + Colophon — scroll to bottom
await page.evaluate(() =>
  document.querySelector(".tour4-ticker")?.scrollIntoView({ block: "center" }),
)
await page.waitForTimeout(800)
await page.screenshot({ path: resolve(outDir, "4-ticker-colophon.png") })
console.log("✓ 4-ticker-colophon.png")

// 5. Full page — 모든 섹션 reveal 트리거를 위해 scroll-warm 후 top 복귀
await page.evaluate(() => {
  // 모든 reveal 대상을 강제로 opacity 1 + transform 초기화 (screenshot용).
  // revealOnEnter는 IO 기반이라 fullPage 캡처 시 뷰포트 밖 요소가 숨겨져 있음.
  const els = Array.from(document.querySelectorAll("[style*='opacity']"))
  for (const el of els) {
    el.style.opacity = "1"
    el.style.transform = "none"
  }
})
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(300)
await page.screenshot({ path: resolve(outDir, "5-full.png"), fullPage: true })
console.log("✓ 5-full.png")
await page.close()
await ctxDesktop.close()

// 6. Mobile cover
const ctxMobile = await browser.newContext({
  viewport: { width: 375, height: 812 },
  deviceScaleFactor: 2,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
})
const mobile = await ctxMobile.newPage()
await mobile.goto(URL, { waitUntil: "networkidle" })
await mobile.waitForTimeout(1000)
await mobile.screenshot({ path: resolve(outDir, "6-mobile-cover.png") })
console.log("✓ 6-mobile-cover.png")
await mobile.close()
await ctxMobile.close()

await browser.close()
console.log(`\nAll screenshots → ${outDir}`)
