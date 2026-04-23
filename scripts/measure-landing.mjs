import { chromium } from "playwright"
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto("http://localhost:8888/tour/", { waitUntil: "networkidle" })
await page.waitForTimeout(1200)
const info = await page.evaluate(() => {
  const hero = document.querySelector(".tour-hero")
  const mani = document.querySelector(".tour-manifesto")
  const feats = Array.from(document.querySelectorAll(".tour-feature")).map((el, i) => {
    const num = el.querySelector(".tour-feature__num")?.textContent
    const label = el.querySelector(".tour-feature__label")?.textContent
    const title = el.querySelector(".tour-feature__title")?.textContent
    return { i, num, label, title, h: el.offsetHeight }
  })
  const tabs = document.querySelector(".tour-tabs")
  const footer = document.querySelector(".tour-footer")
  return {
    total: document.body.scrollHeight,
    hero: hero?.offsetHeight,
    manifesto: mani?.offsetHeight,
    features: feats,
    tabs: tabs?.offsetHeight,
    footer: footer?.offsetHeight,
  }
})
console.log(JSON.stringify(info, null, 2))
await browser.close()
