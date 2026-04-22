// Sidebar 5탭 순서 + 링크 + 개요 이동 검증
// 사전 실행: `npm run verify:serve` (public을 localhost:8888로 띄움)
import { chromium } from "playwright"

const BASE = "http://localhost:8888"
const browser = await chromium.launch()
const page = await browser.newPage()

// 1) Landing — 상위 폴더 순서/링크
await page.goto(BASE + "/", { waitUntil: "networkidle" })
await page.waitForTimeout(800)
const topItems = await page.$$eval(".explorer-ul > li", (lis) =>
  lis.map((li) => {
    const a = li.querySelector(":scope > .folder-container a.folder-title")
    const span = li.querySelector(":scope > .folder-container span.folder-title")
    const fileA = li.querySelector(":scope > a")
    return {
      text: (a || span || fileA)?.textContent?.trim(),
      hasLink: !!a,
      href: (a || fileA)?.getAttribute("href"),
    }
  }),
)
console.log("[LANDING sidebar top-level]")
console.log(JSON.stringify(topItems, null, 2))

// 2) 통신 클릭 → SPA 네비 URL 대기
const commA = await page.$('.explorer-ul a.folder-title[href*="01-communication"]')
if (commA) {
  await Promise.all([
    page.waitForURL("**/01-communication/**", { timeout: 5000 }),
    commA.click(),
  ])
  await page.waitForSelector(".article-title", { timeout: 5000 })
  const title = await page.$eval(".article-title", (el) => el.textContent?.trim())
  console.log("\n[After clicking 통신]")
  console.log("URL:", page.url())
  console.log("Article title:", title)
}

// 3) 통신 폴더 하위 항목
const children = await page.$$eval(
  '.explorer-ul li:has(a.folder-title[href*="01-communication"]) .folder-outer ul > li',
  (lis) =>
    lis.map((li) => {
      const a = li.querySelector("a")
      return { text: a?.textContent?.trim(), href: a?.getAttribute("href") }
    }),
)
console.log("\n[통신 폴더 하위 항목]")
console.log(JSON.stringify(children, null, 2))

await browser.close()
