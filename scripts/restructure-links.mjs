#!/usr/bin/env node
// Phase 2: 매뉴얼 마크다운 내부 절대 URL 일괄 치환
// /tour/* → /, /tour/quickstart/* → /quickstart/*, /<카테고리>/* → /docs/<카테고리>/*
// 옛 quickstart slug → 새 quickstart slug

import { readFile, writeFile } from "node:fs/promises"
import { glob } from "node:fs/promises"

const ROOT = "D:/GitHub/dabitone-manual-restructure/content/docs"

// 순서 중요: 더 구체적인 패턴부터
const PATTERNS = [
  // tour/quickstart 옛 slug → 새 slug + tour 제거
  [/\(\/tour\/quickstart\/01-first-connection/g, "(/quickstart/01-connect"],
  [/\(\/tour\/quickstart\/02-screen-size/g, "(/quickstart/02-display-setup"],
  [/\(\/tour\/quickstart\/05-gif-editor/g, "(/quickstart/04-edit-image"],
  [/\(\/tour\/quickstart\/06-schedule-pla/g, "(/quickstart/04-edit-image"],
  [/\(\/tour\/quickstart\/07-background-bgp/g, "(/quickstart/04-edit-image"],
  [/\(\/tour\/quickstart\/08-firmware/g, "(/quickstart/05-advanced"],
  // tour/quickstart → quickstart (slug 그대로)
  [/\(\/tour\/quickstart\//g, "(/quickstart/"],
  // tour/accessible → accessible
  [/\(\/tour\/accessible/g, "(/accessible"],
  // /tour/ root → /
  [/\(\/tour\/\)/g, "(/)"],
  [/\(\/tour\)/g, "(/)"],
  // 매뉴얼 카테고리 → /docs/<카테고리>/
  [/\(\/01-communication\//g, "(/docs/01-communication/"],
  [/\(\/02-settings\//g, "(/docs/02-settings/"],
  [/\(\/03-transfer\//g, "(/docs/03-transfer/"],
  [/\(\/04-editor\//g, "(/docs/04-editor/"],
  [/\(\/05-advanced\//g, "(/docs/05-advanced/"],
  [/\(\/getting-started\//g, "(/docs/getting-started/"],
  [/\(\/file-formats\//g, "(/docs/file-formats/"],
  [/\(\/troubleshooting\//g, "(/docs/troubleshooting/"],
  [/\(\/blog\//g, "(/docs/blog/"],
  // quickstart 옛 slug → 새 slug (이미 /tour/ prefix 처리됐으므로 root 패턴)
  [/\(\/quickstart\/01-first-connection/g, "(/quickstart/01-connect"],
  [/\(\/quickstart\/02-screen-size/g, "(/quickstart/02-display-setup"],
  [/\(\/quickstart\/05-gif-editor/g, "(/quickstart/04-edit-image"],
  [/\(\/quickstart\/06-schedule-pla/g, "(/quickstart/04-edit-image"],
  [/\(\/quickstart\/07-background-bgp/g, "(/quickstart/04-edit-image"],
  [/\(\/quickstart\/08-firmware/g, "(/quickstart/05-advanced"],
  // 마크다운 링크 텍스트 [/tour/...] 또는 따옴표/공백 prefix
  [/(["'\s\[])\/tour\/quickstart\/01-first-connection/g, "$1/quickstart/01-connect"],
  [/(["'\s\[])\/tour\/quickstart\/02-screen-size/g, "$1/quickstart/02-display-setup"],
  [/(["'\s\[])\/tour\/quickstart\/05-gif-editor/g, "$1/quickstart/04-edit-image"],
  [/(["'\s\[])\/tour\/quickstart\/06-schedule-pla/g, "$1/quickstart/04-edit-image"],
  [/(["'\s\[])\/tour\/quickstart\/07-background-bgp/g, "$1/quickstart/04-edit-image"],
  [/(["'\s\[])\/tour\/quickstart\/08-firmware/g, "$1/quickstart/05-advanced"],
  [/(["'\s\[])\/tour\/quickstart\//g, "$1/quickstart/"],
  [/(["'\s\[])\/tour\/accessible/g, "$1/accessible"],
  [/(["'\s\[])\/tour\//g, "$1/"],
  [/(["'\s\[])\/01-communication\//g, "$1/docs/01-communication/"],
  [/(["'\s\[])\/02-settings\//g, "$1/docs/02-settings/"],
  [/(["'\s\[])\/03-transfer\//g, "$1/docs/03-transfer/"],
  [/(["'\s\[])\/04-editor\//g, "$1/docs/04-editor/"],
  [/(["'\s\[])\/05-advanced\//g, "$1/docs/05-advanced/"],
  [/(["'\s\[])\/getting-started\//g, "$1/docs/getting-started/"],
  [/(["'\s\[])\/file-formats\//g, "$1/docs/file-formats/"],
  [/(["'\s\[])\/troubleshooting\//g, "$1/docs/troubleshooting/"],
  [/(["'\s\[])\/blog\//g, "$1/docs/blog/"],
  // 옛 quickstart slug가 [...] 안에서도 변환되도록
  [/(["'\s\[])\/quickstart\/01-first-connection/g, "$1/quickstart/01-connect"],
  [/(["'\s\[])\/quickstart\/02-screen-size/g, "$1/quickstart/02-display-setup"],
  [/(["'\s\[])\/quickstart\/05-gif-editor/g, "$1/quickstart/04-edit-image"],
  [/(["'\s\[])\/quickstart\/06-schedule-pla/g, "$1/quickstart/04-edit-image"],
  [/(["'\s\[])\/quickstart\/07-background-bgp/g, "$1/quickstart/04-edit-image"],
  [/(["'\s\[])\/quickstart\/08-firmware/g, "$1/quickstart/05-advanced"],
]

async function main() {
  const files = []
  // node 22+ glob
  for await (const f of glob("**/*.md", { cwd: ROOT })) {
    files.push(`${ROOT}/${f}`)
  }
  let modifiedCount = 0
  let totalReplacements = 0
  for (const file of files) {
    const text = await readFile(file, "utf8")
    let newText = text
    let fileReplacements = 0
    for (const [pattern, replacement] of PATTERNS) {
      const matches = newText.match(pattern)
      if (matches) {
        fileReplacements += matches.length
        newText = newText.replace(pattern, replacement)
      }
    }
    if (newText !== text) {
      await writeFile(file, newText, "utf8")
      modifiedCount++
      totalReplacements += fileReplacements
      console.log(`  ${file.replace(ROOT + "/", "")}: ${fileReplacements} replacements`)
    }
  }
  console.log(`\nDone: ${modifiedCount} files modified, ${totalReplacements} total replacements`)
}

main().catch(e => { console.error(e); process.exit(1) })
