#!/usr/bin/env node
/**
 * 투어 앱 번들러 — tour/src/index.tsx → quartz/static/tour/{tour.js, tour.css}
 *
 * Quartz의 inline-script-loader는 JSX/TSX 미지원이라서 별도 esbuild로 분리.
 * 빌드 결과물은 quartz/static/tour/로 들어가고, Quartz의 Static emitter가
 * public/static/tour/로 복사한다.
 *
 * 호출: `npm run build:tour` 또는 `node scripts/build-tour.mjs`
 */
import { build } from "esbuild"
import chokidar from "chokidar"
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, "..")

const entry = resolve(projectRoot, "tour/src/index.tsx")
const outDir = resolve(projectRoot, "quartz/static/tour")
const publicOutDir = resolve(projectRoot, "public/static/tour")
const watchMode = process.argv.includes("--watch")

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

console.log("[build-tour] entry:", entry)
console.log("[build-tour] output:", outDir)

async function buildTour() {
  const startedAt = Date.now()

  // 1. JS 번들 (JSX/TSX)
  await build({
    entryPoints: [entry],
    outfile: resolve(outDir, "tour.js"),
    bundle: true,
    minify: true,
    format: "esm",
    target: ["es2022", "chrome115", "firefox102", "safari15", "edge115"],
    platform: "browser",
    jsx: "automatic",
    jsxImportSource: "preact",
    external: [],
    sourcemap: false,
    legalComments: "none",
  })

  // 2. CSS 번들 — tokens + app + hybrid를 하나로 합침
  await build({
    entryPoints: [
      resolve(projectRoot, "tour/src/styles/tokens.css"),
      resolve(projectRoot, "tour/src/styles/app.css"),
      resolve(projectRoot, "tour/src/styles/hybrid.css"),
    ],
    outdir: outDir,
    bundle: true,
    minify: true,
    loader: { ".css": "css" },
    // /static/fonts/*.woff2 같은 absolute 경로는 런타임에서 해석되므로 bundle 하지 않음
    external: ["/static/fonts/*"],
  })

  // 3. 병합: tokens + app + hybrid → tour.css
  const tokensPath = resolve(outDir, "tokens.css")
  const appPath = resolve(outDir, "app.css")
  const hybridPath = resolve(outDir, "hybrid.css")
  const tourCssPath = resolve(outDir, "tour.css")

  const tokens = readFileSync(tokensPath, "utf-8")
  const app = readFileSync(appPath, "utf-8")
  const hybridCss = readFileSync(hybridPath, "utf-8")
  writeFileSync(tourCssPath, tokens + "\n" + app + "\n" + hybridCss)
  unlinkSync(tokensPath)
  unlinkSync(appPath)
  unlinkSync(hybridPath)

  // 4. 로컬 preview 서버(public/)가 떠 있는 경우 즉시 반영되도록 미러링.
  // 배포용 public 전체 생성은 Quartz build가 담당하지만, tour 수정 확인에는 이 단계가 더 빠르다.
  if (existsSync(resolve(projectRoot, "public"))) {
    mkdirSync(publicOutDir, { recursive: true })
    copyFileSync(resolve(outDir, "tour.css"), resolve(publicOutDir, "tour.css"))
    copyFileSync(resolve(outDir, "tour.js"), resolve(publicOutDir, "tour.js"))
  }

  const elapsed = Date.now() - startedAt
  console.log(`[build-tour] done in ${elapsed}ms`)
}

let building = false
let pending = false

async function queuedBuild() {
  if (building) {
    pending = true
    return
  }
  building = true
  try {
    await buildTour()
  } finally {
    building = false
    if (pending) {
      pending = false
      await queuedBuild()
    }
  }
}

await queuedBuild()

if (watchMode) {
  console.log("[build-tour] watch mode: tour/src and tour/data")
  const watcher = chokidar.watch(
    [resolve(projectRoot, "tour/src"), resolve(projectRoot, "tour/data")],
    {
      ignoreInitial: true,
      awaitWriteFinish: { stabilityThreshold: 100, pollInterval: 50 },
    },
  )
  watcher.on("all", (event, path) => {
    console.log(`[build-tour] ${event}: ${path}`)
    void queuedBuild().catch((e) => {
      console.error("[build-tour] rebuild failed")
      console.error(e)
    })
  })
}
