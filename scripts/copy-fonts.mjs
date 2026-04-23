#!/usr/bin/env node
/**
 * copy-fonts.mjs — Variable WOFF2 폰트를 node_modules → quartz/static/fonts/ 로 복사.
 *
 * quartz/static/**는 Quartz Static emitter가 빌드 시 public/static/**으로 복사하므로,
 * 이 스크립트의 최종 산출물은 런타임에 /static/fonts/*.woff2 URL로 접근 가능.
 *
 * 대상:
 *   1. Inter Variable (Latin weight axis, normal)
 *        @fontsource-variable/inter/files/inter-latin-wght-normal.woff2
 *        → quartz/static/fonts/InterVariable.woff2
 *   2. Inter Variable (Latin weight axis, italic)
 *        @fontsource-variable/inter/files/inter-latin-wght-italic.woff2
 *        → quartz/static/fonts/InterVariable-Italic.woff2
 *   3. Pretendard Variable (단일 파일, 한글 전 영역 포함)
 *        pretendard/dist/web/variable/woff2/PretendardVariable.woff2
 *        → quartz/static/fonts/PretendardVariable.woff2
 *
 * build 전 자동 실행 (package.json scripts의 `build` 체인 참조).
 *
 * Latin 서브셋만 사용하는 이유: 한글은 Pretendard 가 덮고, Greek/Cyrillic/Vietnamese 는
 * 현재 제품 범위에 불필요. 번들 용량 최소화.
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, "..")

const destDir = resolve(projectRoot, "quartz/static/fonts")

/** @type {Array<{ src: string, dest: string, label: string }>} */
const assets = [
  {
    label: "Inter Variable (Latin, normal)",
    src: resolve(
      projectRoot,
      "node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
    ),
    dest: resolve(destDir, "InterVariable.woff2"),
  },
  {
    label: "Inter Variable (Latin, italic)",
    src: resolve(
      projectRoot,
      "node_modules/@fontsource-variable/inter/files/inter-latin-wght-italic.woff2",
    ),
    dest: resolve(destDir, "InterVariable-Italic.woff2"),
  },
  {
    label: "Pretendard Variable",
    src: resolve(
      projectRoot,
      "node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
    ),
    dest: resolve(destDir, "PretendardVariable.woff2"),
  },
]

const missing = assets.filter((a) => !existsSync(a.src))
if (missing.length > 0) {
  console.error("[copy-fonts] FAIL — 아래 소스 파일이 존재하지 않음:")
  for (const a of missing) {
    console.error(`  - ${a.label}: ${a.src}`)
  }
  console.error(
    "패키지가 업데이트되면서 파일 경로가 바뀌었을 수 있음. node_modules 를 재설치하거나 이 스크립트의 경로를 갱신하세요.",
  )
  process.exit(1)
}

if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true })

for (const a of assets) {
  copyFileSync(a.src, a.dest)
}

console.log(
  `✓ Copied ${assets.length} font files to quartz/static/fonts/ (Quartz Static emitter → public/static/fonts/)`,
)
