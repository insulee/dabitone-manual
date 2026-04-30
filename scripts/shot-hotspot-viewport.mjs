/**
 * shot-hotspot-viewport.mjs — hotspot dot의 사용자 viewport 시점 캡처.
 *
 * 격리 stage screenshot은 부모 chain context가 달라 currentColor 같은
 * 컨텍스트 의존 색이 다르게 resolve되므로 viewport 전체로 캡처해 검증.
 */
import { chromium } from "playwright"
import { mkdir } from "fs/promises"

const BASE = process.env.BASE_URL || "http://localhost:8888"
const OUT = "verify-hotspots"

// hotspot에 가깝게 crop된 영역만 시점별 캡처 — animation 진행 확인용.
const TARGET = { slug: "01-connect", step: 1 }
const FRAMES = [0, 750, 1500, 2250] // ms — duration 3s 기준 사이클 분포

await mkdir(OUT, { recursive: true })

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })

const url = `${BASE}/quickstart/${TARGET.slug}/?s=${TARGET.step}`
await page.goto(url, { waitUntil: "networkidle", timeout: 15000 })
await page.waitForTimeout(800) // SPA mount

// hotspot 주변 영역만 좁게 crop (sidebar 두번째 메뉴 부근)
const clip = { x: 80, y: 320, width: 200, height: 200 }

for (const t of FRAMES) {
  if (t > 0) await page.waitForTimeout(t === FRAMES[0] ? 0 : 600)
  const path = `${OUT}/ripple-frame-${t}.png`
  await page.screenshot({ path, clip })
  console.log(`✓ frame ${t}ms → ${path}`)
}

await browser.close()
