#!/usr/bin/env node
/**
 * PDF 생성 파이프라인 — Reference + Operation 2권 분할.
 * 플랜 v3.1 Phase R5.
 *
 * 조건: Quartz `npx quartz build` 완료되어 `public/`에 정적 파일 있어야 함.
 *
 * 순서:
 * 1. `public/` 내용을 로컬 HTTP 서버로 서빙
 * 2. Chromium 브라우저로 각 URL 방문 + PDF로 인쇄
 * 3. 챕터별로 PDF 병합
 * 4. `public/pdf/DabitONe_Manual_{Reference,Operation}.pdf` 출력
 *
 * /tour/*, /quickstart/* 경로는 제외 (투어는 온라인 전용, plan v3.1 오프라인 전략).
 */
import { chromium } from "playwright"
import { PDFDocument } from "pdf-lib"
import fs from "node:fs/promises"
import path from "node:path"
import http from "node:http"
import handler from "serve-handler"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, "..")
const PUBLIC = path.join(projectRoot, "public")
const OUT_DIR = path.join(PUBLIC, "pdf")
const PORT = 3003
const MAX_MB = 25

const CHAPTERS = [
  {
    name: "Reference",
    title: "DabitONe 매뉴얼 — UI 레퍼런스편",
    filename: "DabitONe_Manual_Reference.pdf",
    includes: [/^ui-reference\//, /^file-formats\//, /^getting-started\//],
  },
  {
    name: "Operation",
    title: "DabitONe 매뉴얼 — 운영·문제해결편",
    filename: "DabitONe_Manual_Operation.pdf",
    includes: [/^troubleshooting\//, /^blog\//],
  },
]

const EXCLUDE = [
  /^tour\//,          // 투어 제외
  /^quickstart\//,    // 레거시 redirect stub 제외
  /^tags\//,          // 태그 인덱스 제외
  /^404\/?$/,         // 404 페이지 제외
]

function slugMatchesAny(slug, patterns) {
  return patterns.some((rx) => rx.test(slug))
}

async function collectSlugs() {
  // contentIndex.json을 읽어 모든 페이지 slug 확보
  const indexPath = path.join(PUBLIC, "static/contentIndex.json")
  const txt = await fs.readFile(indexPath, "utf-8")
  const idx = JSON.parse(txt)
  return Object.keys(idx).filter((slug) => {
    if (slugMatchesAny(slug, EXCLUDE)) return false
    return true
  })
}

async function buildChapterPdf(browser, page, chapter, slugs) {
  const merged = await PDFDocument.create()
  merged.setTitle(chapter.title)
  merged.setAuthor("다빛솔루션 DabitONe")
  merged.setCreationDate(new Date())

  const chapterSlugs = slugs.filter((slug) => slugMatchesAny(slug, chapter.includes))
  console.log(`[${chapter.name}] ${chapterSlugs.length} 페이지`)

  for (const slug of chapterSlugs) {
    const url = `http://localhost:${PORT}/${slug}`
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 })
      await page.emulateMedia({ media: "screen" })
      await page.evaluate(() => document.fonts.ready)
      const buf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "15mm", right: "12mm", bottom: "15mm", left: "12mm" },
      })
      const pdf = await PDFDocument.load(buf)
      const pages = await merged.copyPages(pdf, pdf.getPageIndices())
      pages.forEach((p) => merged.addPage(p))
    } catch (e) {
      console.warn(`[${chapter.name}] 실패: ${slug} — ${e.message}`)
    }
  }

  const bytes = await merged.save()
  const outPath = path.join(OUT_DIR, chapter.filename)
  await fs.writeFile(outPath, bytes)
  const mb = bytes.length / 1024 / 1024
  console.log(
    `[${chapter.name}] ${outPath} — ${mb.toFixed(2)} MB (${chapterSlugs.length} 페이지)`,
  )
  if (mb > MAX_MB) {
    console.warn(
      `[${chapter.name}] 경고: ${mb.toFixed(2)} MB > ${MAX_MB} MiB 목표 초과`,
    )
  }
  return { name: chapter.name, sizeMB: mb, pageCount: chapterSlugs.length }
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true })

  // 로컬 정적 서버
  const server = http.createServer((req, res) => handler(req, res, { public: PUBLIC }))
  await new Promise((resolve) => server.listen(PORT, resolve))
  console.log(`[pdf] 로컬 서버 기동: http://localhost:${PORT}`)

  const slugs = await collectSlugs()
  console.log(`[pdf] ${slugs.length} 페이지 수집 (제외 규칙 적용 후)`)

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1200, height: 1600 } })

  const results = []
  for (const chapter of CHAPTERS) {
    results.push(await buildChapterPdf(browser, page, chapter, slugs))
  }

  await browser.close()
  server.close()

  console.log("\n[pdf] 완료:")
  for (const r of results) {
    console.log(`  ${r.name}: ${r.sizeMB.toFixed(2)} MB, ${r.pageCount} 페이지`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
