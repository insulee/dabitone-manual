/**
 * migrate-wiki-links.mjs — Obsidian wiki link `[[target|text]]` → absolute markdown link `[text](/target)`.
 *
 * 이유:
 *   - Quartz CrawlLinks가 wiki link를 상대 경로로 변환 → 현재 페이지 depth 따라 resolve
 *   - 일부 브라우저·popover에서 상대 경로 해석 꼬임 가능
 *   - 절대 경로로 일괄 변환해 항상 명시적 target
 *
 * 변환 예:
 *   [[ui-reference/04-editor/gif|GIF 편집]]   → [GIF 편집](/ui-reference/04-editor/gif)
 *   [[file-formats/ani]]                      → [file-formats/ani](/file-formats/ani)
 *   [[ui-reference/index|목록]]               → [목록](/ui-reference/)
 *   [[#heading]]                              → [[#heading]] (same-page anchor, 건드리지 않음)
 *
 * Idempotent: 변환된 링크는 다시 변환 안 됨.
 */

import { readFile, writeFile } from "fs/promises"
import { globby } from "globby"

function normalizeTarget(target) {
  // index 파일은 trailing slash로 (예: ui-reference/index → ui-reference/)
  if (target.endsWith("/index")) return target.slice(0, -"index".length)
  return target
}

async function migrate(file) {
  let txt = await readFile(file, "utf-8")
  let changed = 0

  // 1. [[target|text]] or [[target#anchor|text]]
  txt = txt.replace(
    /\[\[([^|#\]]+)(#[^|\]]+)?\|([^\]]+)\]\]/g,
    (_, target, anchor, text) => {
      changed++
      return `[${text}](/${normalizeTarget(target)}${anchor || ""})`
    },
  )

  // 2. [[target]] or [[target#anchor]]  (no pipe)
  txt = txt.replace(
    /\[\[([^|#\]]+)(#[^|\]]+)?\]\]/g,
    (_, target, anchor) => {
      changed++
      const label = target.split("/").pop() || target
      return `[${label}](/${normalizeTarget(target)}${anchor || ""})`
    },
  )

  // [[#anchor]] same-page anchor는 남겨둠 (Quartz가 처리)

  if (changed > 0) {
    await writeFile(file, txt, "utf-8")
    console.log(`✓ ${file}: ${changed} links migrated`)
  }
  return changed
}

async function main() {
  const files = await globby("content/**/*.md")
  let total = 0
  let touched = 0
  for (const file of files) {
    const n = await migrate(file)
    total += n
    if (n > 0) touched++
  }
  console.log(`\n총 ${touched} 파일, ${total} wiki link → absolute link 변환`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
