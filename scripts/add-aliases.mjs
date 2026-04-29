#!/usr/bin/env node
// Phase 5: 매뉴얼 옛 deep link 보존을 위해 frontmatter aliases 추가
// 새 위치 docs/<...>/foo.md → 옛 URL /<...>/foo 를 alias로 등록 → AliasRedirects가 자동 redirect HTML 생성

import { readFile, writeFile } from "node:fs/promises"
import { glob } from "node:fs/promises"

const ROOT = "D:/GitHub/dabitone-manual-restructure/content/docs"
// templates는 ignorePatterns로 emit 안 됨, 처리 제외
const SKIP_PREFIX = ["templates/"]

async function main() {
  let modified = 0
  let skipped = 0
  for await (const f of glob("**/*.md", { cwd: ROOT })) {
    const rel = f.replace(/\\/g, "/")
    if (SKIP_PREFIX.some(p => rel.startsWith(p))) {
      skipped++
      continue
    }
    const filePath = `${ROOT}/${rel}`
    const slugNoExt = rel.replace(/\.md$/, "")
    // 옛 URL: /<slugNoExt> (index는 dir trailing slash로)
    const oldPath = "/" + (slugNoExt.endsWith("/index") ? slugNoExt.slice(0, -6) : slugNoExt)

    const text = await readFile(filePath, "utf8")
    const lines = text.split(/\r?\n/)
    if (lines[0] !== "---") {
      console.log(`  skip (no frontmatter): ${rel}`)
      skipped++
      continue
    }
    let endIdx = 1
    while (endIdx < lines.length && lines[endIdx] !== "---") endIdx++
    if (endIdx >= lines.length) {
      console.log(`  skip (unclosed frontmatter): ${rel}`)
      skipped++
      continue
    }
    const fmLines = lines.slice(1, endIdx)
    const hasAliases = fmLines.some(l => /^aliases\s*:/.test(l))
    if (hasAliases) {
      console.log(`  skip (has aliases): ${rel}`)
      skipped++
      continue
    }
    const newFmLines = [...fmLines, "aliases:", `  - "${oldPath}"`]
    const newText = ["---", ...newFmLines, ...lines.slice(endIdx)].join("\n")
    await writeFile(filePath, newText, "utf8")
    modified++
    console.log(`  + ${rel} → ${oldPath}`)
  }
  console.log(`\nDone: ${modified} modified, ${skipped} skipped`)
}

main().catch(e => { console.error(e); process.exit(1) })
