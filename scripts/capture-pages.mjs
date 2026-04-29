// 라이브 사이트 직접 캡처 — 캐시 우회 위해 query string 추가
import { chromium } from "playwright"
import { mkdir } from "fs/promises"

const ts = Date.now()
const targets = [
  { url: `https://dabitone.dabitsol.com/?nc=${ts}`, out: "verify-routes/01-root.png" },
  { url: `https://dabitone.dabitsol.com/docs/?nc=${ts}`, out: "verify-routes/02-docs.png" },
  { url: `https://dabitone.dabitsol.com/docs/01-communication/serial?nc=${ts}`, out: "verify-routes/03-docs-serial.png" },
  { url: `https://dabitone.dabitsol.com/quickstart/01-connect/?nc=${ts}`, out: "verify-routes/04-quickstart.png" },
]

await mkdir("verify-routes", { recursive: true })

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  // 캐시 완전 무시
  bypassCSP: true,
  extraHTTPHeaders: { "Cache-Control": "no-cache, no-store, must-revalidate", "Pragma": "no-cache" },
})

for (const t of targets) {
  const page = await ctx.newPage()
  console.log(`→ ${t.url}`)
  // console error 수집
  const errors = []
  page.on("pageerror", e => errors.push(e.message))
  page.on("console", m => { if (m.type() === "error") errors.push(`console.error: ${m.text()}`) })
  await page.goto(t.url, { waitUntil: "networkidle", timeout: 30000 })
  // tour 페이지는 hydration 기다림
  if (t.url.includes("/quickstart/") || t.url.endsWith("/?nc=" + ts) || /\/\?nc=\d+$/.test(t.url)) {
    await page.waitForTimeout(1500) // Preact hydration
  }
  await page.screenshot({ path: t.out, fullPage: false })
  console.log(`  ✓ ${t.out}${errors.length ? ` (errors: ${errors.length})` : ""}`)
  errors.forEach(e => console.log(`    ! ${e}`))
  await page.close()
}

await browser.close()
console.log("\nDone. Screenshots in verify-routes/")
