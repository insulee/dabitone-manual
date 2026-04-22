/**
 * compare-sites.mjs — 로컬 dabitone vs docs.dabitsol.com 스크린샷 비교.
 *
 * 사용법:
 *   1. npm run build
 *   2. npm run verify:serve & (background)
 *   3. node scripts/compare-sites.mjs
 *
 * 산출: verify-compare/<idx>-<name>-ours.png, -theirs.png
 */

import { chromium } from "playwright"
import { mkdir } from "fs/promises"

const OUR_BASE = "http://localhost:8888"
const THEIRS_BASE = "https://docs.dabitsol.com"

const PAGES = [
  {
    name: "landing",
    ours: `${OUR_BASE}/`,
    theirs: `${THEIRS_BASE}/`,
  },
  {
    name: "subpage-ours-01",
    ours: `${OUR_BASE}/01-communication/`,
    theirs: `${THEIRS_BASE}/2.-사용자-매뉴얼/2.1.-통신-설정/`,
  },
  {
    name: "subpage-ours-detail",
    ours: `${OUR_BASE}/01-communication/serial`,
    theirs: `${THEIRS_BASE}/2.-사용자-매뉴얼/2.1.-통신-설정/`,
  },
]

async function main() {
  await mkdir("verify-compare", { recursive: true })
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } })
  const page = await ctx.newPage()

  for (const [i, p] of PAGES.entries()) {
    for (const side of ["ours", "theirs"]) {
      const url = p[side]
      const out = `verify-compare/${i}-${p.name}-${side}.png`
      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 20000 })
        await page.waitForTimeout(500)
        await page.screenshot({ path: out, fullPage: true })
        console.log(`✓ ${side}: ${url} → ${out}`)
      } catch (e) {
        console.warn(`✗ ${side}: ${url} — ${e instanceof Error ? e.message.split("\n")[0] : e}`)
      }
    }
  }

  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
