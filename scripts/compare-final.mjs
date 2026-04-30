import { chromium } from "playwright"
import { mkdir } from "fs/promises"

await mkdir("verify-compare/final", { recursive: true })
const LOCAL = "http://localhost:8888"
const LIVE = "https://dabitone.dabitsol.com"

const browser = await chromium.launch()
const PAGES = [
  { name: "landing", local: "/", live: "/" },
  { name: "01-comm", local: "/01-communication/", live: "/01-communication/" },
  { name: "tour", local: "/tour/", live: "/tour/" },
]

for (const p of PAGES) {
  for (const [tag, base] of [["local", LOCAL], ["live", LIVE]]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    try {
      await page.goto(base + p.local, { waitUntil: "networkidle", timeout: 20000 })
      await page.waitForTimeout(1500)
      await page.screenshot({ path: `verify-compare/final/${p.name}-${tag}.png`, fullPage: false })

      if (p.name === "landing") {
        const items = await page.$$eval(".explorer-ul > li", (lis) =>
          lis.map((li) => {
            const a = li.querySelector(":scope > .folder-container a.folder-title")
            const span = li.querySelector(":scope > .folder-container span.folder-title")
            return (a || span)?.textContent?.trim()
          }).filter(Boolean),
        )
        console.log(`[${tag}] sidebar order:`, items.join(" → "))
      }
      if (p.name === "01-comm") {
        const h1 = await page.$eval(".article-title", (el) => el.textContent?.trim()).catch(() => null)
        console.log(`[${tag}] /01-communication/ h1:`, h1)
      }
      if (p.name === "tour") {
        const h = await page.evaluate(() => document.body.scrollHeight)
        console.log(`[${tag}] /tour/ total height:`, h + "px")
      }
    } catch (e) {
      console.log(`[${tag}] ${p.name} error:`, e.message)
    }
    await page.close()
  }
}
await browser.close()
console.log("\n=> verify-compare/final/*.png 스크린샷 저장 완료")
