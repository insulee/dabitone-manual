import { chromium } from "playwright"
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

// 1) Landing — 상위 폴더
await page.goto("http://localhost:8888/", { waitUntil: "networkidle" })
await page.waitForTimeout(800)
const topItems = await page.$$eval(".explorer-ul > li", (lis) =>
  lis.map((li) => {
    const a = li.querySelector(":scope > .folder-container a.folder-title")
    const span = li.querySelector(":scope > .folder-container span.folder-title")
    return {
      text: (a || span)?.textContent?.trim(),
      isLink: !!a,
    }
  }).filter((x) => x.text),
)
console.log("[사이드바 최상위]")
console.log(JSON.stringify(topItems, null, 2))

// 2) 통신 폴더 펴기 + 하위 순서
await page.click('.folder-icon:has(~ div button:text-is("통신")), .folder-container:has(span.folder-title:text-is("통신")) .folder-icon')
  .catch(async () => {
    // Fallback: click the folder button (collapse behavior)
    const btn = await page.$('.folder-container:has(span.folder-title:text-is("통신")) .folder-button')
    if (btn) await btn.click()
  })
await page.waitForTimeout(400)
const commChildren = await page.$$eval(
  '.explorer-ul > li:has(span.folder-title:text-is("통신")) .folder-outer ul > li',
  (lis) =>
    lis.map((li) => {
      const a = li.querySelector("a")
      return { text: a?.textContent?.trim(), href: a?.getAttribute("href") }
    }),
)
console.log("\n[통신 폴더 하위 - 펼침 순서]")
console.log(JSON.stringify(commChildren, null, 2))

// 3) overview 페이지 접근 테스트
await page.goto("http://localhost:8888/01-communication/overview", { waitUntil: "networkidle" })
const art = await page.$eval(".article-title", (el) => el.textContent?.trim()).catch(() => null)
console.log("\n[/01-communication/overview article title]:", art)

// 4) 구 path가 여전히 살아 있는지 (auto folder listing)
const resp = await page.goto("http://localhost:8888/01-communication/", { waitUntil: "networkidle" })
console.log("\n[/01-communication/ status]:", resp.status())
const h1 = await page.$eval("h1", el => el.textContent?.trim()).catch(() => null)
console.log("[/01-communication/ first h1]:", h1)

await browser.close()
