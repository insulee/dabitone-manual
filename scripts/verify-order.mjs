import { chromium } from "playwright"
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto("http://localhost:8888/", { waitUntil: "networkidle" })
await page.waitForTimeout(800)

const FOLDERS = ["통신", "설정", "전송", "편집", "고급"]
for (const name of FOLDERS) {
  const order = await page.$$eval(
    `.explorer-ul > li:has(span.folder-title:text-is("${name}")) .folder-outer ul > li`,
    (lis) => lis.map((li) => li.querySelector("a")?.textContent?.trim()),
  ).catch(() => [])
  console.log(`[${name}] ${order.join(" → ")}`)
}
await browser.close()
