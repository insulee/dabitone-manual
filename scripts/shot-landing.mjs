import { chromium } from "playwright"
import { mkdir } from "fs/promises"

await mkdir("verify-compare/landing", { recursive: true })
const browser = await chromium.launch()
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "no-preference",
})
const page = await context.newPage()

await page.goto("http://localhost:8888/tour/", { waitUntil: "networkidle" })
await page.waitForTimeout(1200)

// 섹션 하나씩 스크롤하여 IntersectionObserver 트리거 + 800ms 애니 완료 대기
const height = await page.evaluate(() => document.body.scrollHeight)
for (let y = 0; y < height; y += 400) {
  await page.evaluate((y) => window.scrollTo(0, y), y)
  await page.waitForTimeout(900)
}
// 모든 fade-in 완료 후 맨 위로 돌아가 전체 캡처
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(400)
await page.screenshot({ path: "verify-compare/landing/full.png", fullPage: true })

// Hero + Manifesto (첫 화면)
await page.screenshot({ path: "verify-compare/landing/hero-manifesto.png", fullPage: false })

// F01 + F02 근처
await page.evaluate(() => window.scrollTo(0, 1200))
await page.waitForTimeout(500)
await page.screenshot({ path: "verify-compare/landing/features-1.png", fullPage: false })

// F03 + F04 근처
await page.evaluate(() => window.scrollTo(0, 2000))
await page.waitForTimeout(500)
await page.screenshot({ path: "verify-compare/landing/features-2.png", fullPage: false })

await browser.close()
console.log("=> verify-compare/landing/*.png")
