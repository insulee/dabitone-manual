/**
 * verify-links.mjs — 전체 사이트 링크 자율 검증 (codex review P1/P2 반영).
 *
 * 사용법:
 *   1. npm run build  (필수 선행 — Quartz + tour 산출물 최신)
 *   2. npm run verify:serve &  (background http-server 8888)
 *   3. node scripts/verify-links.mjs
 *
 * 산출:
 *   - verify-links/report.json — 모든 링크와 깨진 목록
 *   - 콘솔 요약, exit 1 if broken
 *
 * codex review findings 반영:
 *   - [P1] /tour/* 는 Preact hydration 대기 (waitForSelector)
 *   - [P1] /tour/quickstart/<slug>/ 는 ?s=0..7 순회 (relatedRefs 전수 수집)
 *   - [P2] /pdf/, /assets/ 는 HEAD 요청 status 체크 (404 방지)
 */

import { chromium } from "playwright"
import { writeFile, mkdir } from "fs/promises"

const BASE = process.env.BASE_URL || "http://localhost:8888"
const OUT = "verify-links"

const SEEDS = [
  "/",
  "/tour/",
  "/tour/accessible/",
  "/getting-started/",
  "/ui-reference/",
  "/file-formats/",
  "/troubleshooting/",
  "/blog/",
]

const TOUR_SLUGS = [
  "01-first-connection",
  "02-screen-size",
  "03-send-message",
  "04-edit-image",
  "05-gif-editor",
  "06-schedule-pla",
  "07-background-bgp",
  "08-firmware",
]

const TOUR_HYDRATION_SELECTORS = {
  "/tour/": ".tour-tabs__list",
  "/tour/accessible/": "a[href*='/tour/quickstart/']",
}
const SCENARIO_HYDRATION_SELECTOR = ".tour-scenario__rail"

async function waitForHydration(page, path) {
  const selector = TOUR_HYDRATION_SELECTORS[path] || null
  if (selector) {
    try {
      await page.waitForSelector(selector, { timeout: 8000 })
    } catch {
      /* best effort */
    }
  } else if (path.startsWith("/tour/quickstart/")) {
    try {
      await page.waitForSelector(SCENARIO_HYDRATION_SELECTOR, { timeout: 8000 })
    } catch {
      /* best effort */
    }
  }
}

async function collectLinks(page) {
  const hrefs = await page.$$eval("a[href]", (as) =>
    as.map((a) => a.getAttribute("href")),
  )
  return hrefs.filter(Boolean)
}

function normalize(href, fromUrl) {
  try {
    const abs = new URL(href, fromUrl)
    return abs.pathname + abs.search
  } catch {
    return null
  }
}

function skipLink(h) {
  if (!h) return true
  if (h.startsWith("mailto:")) return true
  if (h.startsWith("tel:")) return true
  if (h.startsWith("#")) return true
  if (h.startsWith("javascript:")) return true
  if (h.startsWith("http") && !h.startsWith(BASE)) return true
  return false
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  const visited = new Set()
  const queue = [...SEEDS]
  const broken = []
  const allLinks = []

  async function visit(path) {
    if (visited.has(path)) return
    visited.add(path)
    const url = BASE + path
    let status = 0
    try {
      const res = await page.goto(url, {
        waitUntil: "networkidle",
        timeout: 20000,
      })
      status = res?.status() ?? 0
    } catch {
      status = -1
    }
    if (status !== 200) {
      broken.push({ from: "seed", to: path, status })
      return
    }
    if (path.startsWith("/tour/")) {
      await waitForHydration(page, path)
    }
    await page.waitForTimeout(300)
    let hrefs
    try {
      hrefs = await collectLinks(page)
    } catch {
      hrefs = []
    }
    for (const h of hrefs) {
      if (skipLink(h)) continue
      const abs = normalize(h, url)
      if (!abs) continue
      allLinks.push({ from: path, to: abs })
      const pathOnly = abs.split("?")[0]
      if (
        pathOnly.startsWith("/") &&
        !pathOnly.startsWith("/pdf/") &&
        !pathOnly.startsWith("/assets/") &&
        !pathOnly.startsWith("/static/") &&
        !visited.has(pathOnly) &&
        !queue.includes(pathOnly)
      ) {
        queue.push(pathOnly)
      }
    }
  }

  while (queue.length) {
    await visit(queue.shift())
  }

  // Tour 시나리오 각 step ?s=0..7 순회
  for (const slug of TOUR_SLUGS) {
    for (let s = 0; s < 8; s++) {
      const path = `/tour/quickstart/${slug}/?s=${s}`
      try {
        const res = await page.goto(BASE + path, {
          waitUntil: "networkidle",
          timeout: 15000,
        })
        if ((res?.status() ?? 0) !== 200) continue
        await waitForHydration(page, `/tour/quickstart/${slug}/`)
        await page.waitForTimeout(300)
        let hrefs
        try {
          hrefs = await collectLinks(page)
        } catch {
          hrefs = []
        }
        for (const h of hrefs) {
          if (skipLink(h)) continue
          const abs = normalize(h, BASE + path)
          if (!abs) continue
          allLinks.push({ from: path, to: abs })
        }
      } catch {
        /* silent */
      }
    }
  }

  // 수집 타겟 status 검증 (visited는 이미 검증됨 → skip)
  const uniqTargets = [...new Set(allLinks.map((l) => l.to))]
  for (const target of uniqTargets) {
    const pathOnly = target.split("?")[0]
    if (visited.has(pathOnly)) continue
    const isBinary =
      pathOnly.startsWith("/pdf/") ||
      pathOnly.startsWith("/assets/") ||
      pathOnly.startsWith("/static/")
    try {
      let s
      if (isBinary) {
        const r = await context.request.head(BASE + pathOnly)
        s = r.status()
      } else {
        const res = await page.goto(BASE + pathOnly, {
          waitUntil: "domcontentloaded",
          timeout: 10000,
        })
        s = res?.status() ?? 0
      }
      if (s !== 200) {
        const froms = allLinks.filter((l) => l.to === target).map((l) => l.from)
        broken.push({
          from: [...new Set(froms)].slice(0, 3).join(" | "),
          to: target,
          status: s,
        })
      }
    } catch (e) {
      const froms = allLinks.filter((l) => l.to === target).map((l) => l.from)
      broken.push({
        from: [...new Set(froms)].slice(0, 3).join(" | "),
        to: target,
        status: -1,
        error: e instanceof Error ? e.message.split("\n")[0] : String(e),
      })
    }
  }

  await browser.close()

  await writeFile(
    `${OUT}/report.json`,
    JSON.stringify(
      {
        visited: [...visited],
        totalLinks: allLinks.length,
        uniqTargets: uniqTargets.length,
        broken,
      },
      null,
      2,
    ),
    "utf-8",
  )

  console.log("\n=== verify-links 결과 ===")
  console.log(`방문: ${visited.size} 페이지`)
  console.log(`수집: ${allLinks.length} (유니크 ${uniqTargets.length})`)
  console.log(`깨짐: ${broken.length}`)
  if (broken.length) {
    console.log("\n깨진 링크:")
    for (const b of broken) {
      console.log(
        `  [${b.status}] ${b.to}${b.error ? "  (" + b.error + ")" : ""}`,
      )
      console.log(`        from: ${b.from}`)
    }
    console.log(`\n상세: ${OUT}/report.json`)
    process.exit(1)
  }
  console.log(`\n상세: ${OUT}/report.json`)
}

main().catch((e) => {
  console.error("verify-links failed:", e)
  process.exit(1)
})
