/**
 * verify-hotspots.mjs — 투어 핫스팟 좌표 자율 검증.
 *
 * 사용법:
 *   1. npm run build  (정적 산출물 준비)
 *   2. npx http-server public -p 8888 -s &  (background)
 *   3. node scripts/verify-hotspots.mjs
 *
 * 산출:
 *   - verify-hotspots/<slug>-s<n>.png — 각 step의 stage 영역 스크린샷 (점 포함)
 *   - 콘솔: 각 hotspot의 화면상 측정 좌표 (%, %) 보고
 *   - verify-hotspots/report.json — 머신 판독용 요약
 *
 * 이 스크립트의 출력 PNG를 사람 또는 Vision AI가 시각 검증해서
 * 좌표가 틀렸으면 tour/data/quickstart/<slug>.ts 업데이트 → 재빌드 → 재실행.
 */

import { chromium } from "playwright"
import { mkdir, writeFile } from "fs/promises"

const BASE = process.env.BASE_URL || "http://localhost:8888"
const OUT = "verify-hotspots"

const TOURS = [
  "01-first-connection",
  "02-screen-size",
  "03-send-message",
  "04-edit-image",
  "05-gif-editor",
  "06-schedule-pla",
  "07-background-bgp",
  "08-firmware",
]

const MAX_STEPS = 8

async function main() {
  await mkdir(OUT, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({
    viewport: { width: 1600, height: 1200 },
  })

  const results = []

  for (const slug of TOURS) {
    for (let s = 0; s < MAX_STEPS; s++) {
      const url = `${BASE}/tour/quickstart/${slug}/?s=${s}`
      try {
        await page.goto(url, {
          waitUntil: "networkidle",
          timeout: 15000,
        })

        // SPA 마운트 + reveal 애니 대기
        await page.waitForTimeout(800)

        // stage 존재 확인
        const stageCount = await page.locator(".tour-stage").count()
        if (stageCount === 0) {
          if (s === 0) {
            results.push({ slug, step: s, status: "no-stage" })
            console.warn(`✗ ${slug} s${s}: stage 없음`)
          }
          break
        }

        // hotspot 있는지
        const hotspotCount = await page.locator(".tour-hotspot").count()

        // stage 스크린샷 (hotspot 포함)
        const stagePath = `${OUT}/${slug}-s${s}.png`
        await page.locator(".tour-stage").screenshot({ path: stagePath })

        if (hotspotCount === 0) {
          results.push({
            slug,
            step: s,
            status: "no-hotspot",
            stagePath,
          })
          console.log(`○ ${slug} s${s}: hotspot 없음 (스크린샷 ${stagePath})`)
          continue
        }

        // 좌표 측정
        const hotspot = await page
          .locator(".tour-hotspot")
          .first()
          .boundingBox()
        const stage = await page.locator(".tour-stage").boundingBox()

        if (!hotspot || !stage) {
          results.push({ slug, step: s, status: "boundingBox-null" })
          console.warn(`✗ ${slug} s${s}: boundingBox null`)
          continue
        }

        const cx = hotspot.x + hotspot.width / 2 - stage.x
        const cy = hotspot.y + hotspot.height / 2 - stage.y
        const xPct = +((cx / stage.width) * 100).toFixed(2)
        const yPct = +((cy / stage.height) * 100).toFixed(2)

        results.push({
          slug,
          step: s,
          x: xPct,
          y: yPct,
          stagePath,
          status: "ok",
        })
        console.log(
          `✓ ${slug} s${s}: hotspot 화면상 (${xPct}%, ${yPct}%) → ${stagePath}`,
        )
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        results.push({ slug, step: s, status: "error", error: msg })
        console.warn(`✗ ${slug} s${s}: ${msg.split("\n")[0]}`)
        // 다음 step 시도 — 일부 시나리오는 0번이 hotspot 없을 수 있음
        if (msg.includes("Timeout")) break
      }
    }
  }

  await browser.close()

  // 요약 + JSON 저장
  await writeFile(
    `${OUT}/report.json`,
    JSON.stringify(results, null, 2),
    "utf-8",
  )

  console.log("\n=== 요약 ===")
  const ok = results.filter((r) => r.status === "ok").length
  const noHs = results.filter((r) => r.status === "no-hotspot").length
  const err = results.filter((r) => r.status === "error").length
  console.log(`OK: ${ok}, hotspot 없음: ${noHs}, 에러: ${err}`)
  console.log(`상세: ${OUT}/report.json`)
  console.log(
    `다음: ${OUT}/*.png를 시각 검증 → 좌표 틀린 step의 tour/data/quickstart/<slug>.ts hotspot 수정 → 재빌드 → 재실행`,
  )
}

main().catch((e) => {
  console.error("verify-hotspots failed:", e)
  process.exit(1)
})
