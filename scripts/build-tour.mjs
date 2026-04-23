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
import { mkdirSync, existsSync, readFileSync, writeFileSync, unlinkSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, "..")

const entry = resolve(projectRoot, "tour/src/index.tsx")
const outDir = resolve(projectRoot, "quartz/static/tour")

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

console.log("[build-tour] entry:", entry)
console.log("[build-tour] output:", outDir)

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

// 2. CSS 번들 — tokens + app + console + desktop + editorial + horizontal + scrolly + playground + craft + kinetic + canvas를 하나로 합침
await build({
  entryPoints: [
    resolve(projectRoot, "tour/src/styles/tokens.css"),
    resolve(projectRoot, "tour/src/styles/app.css"),
    resolve(projectRoot, "tour/src/styles/console.css"),
    resolve(projectRoot, "tour/src/styles/desktop.css"),
    resolve(projectRoot, "tour/src/styles/editorial.css"),
    resolve(projectRoot, "tour/src/styles/horizontal.css"),
    resolve(projectRoot, "tour/src/styles/scrolly.css"),
    resolve(projectRoot, "tour/src/styles/playground.css"),
    resolve(projectRoot, "tour/src/styles/craft.css"),
    resolve(projectRoot, "tour/src/styles/kinetic.css"),
    resolve(projectRoot, "tour/src/styles/canvas.css"),
  ],
  outdir: outDir,
  bundle: true,
  minify: true,
  loader: { ".css": "css" },
  // /static/fonts/*.woff2 같은 absolute 경로는 런타임에서 해석되므로 bundle 하지 않음
  external: ["/static/fonts/*"],
})

// 3. 병합: tokens + app + console + desktop + editorial + horizontal + scrolly + playground + craft + kinetic + canvas → tour.css
const tokensPath = resolve(outDir, "tokens.css")
const appPath = resolve(outDir, "app.css")
const consolePath = resolve(outDir, "console.css")
const desktopPath = resolve(outDir, "desktop.css")
const editorialPath = resolve(outDir, "editorial.css")
const horizontalPath = resolve(outDir, "horizontal.css")
const scrollyPath = resolve(outDir, "scrolly.css")
const playgroundPath = resolve(outDir, "playground.css")
const craftPath = resolve(outDir, "craft.css")
const kineticPath = resolve(outDir, "kinetic.css")
const canvasPath = resolve(outDir, "canvas.css")
const tourCssPath = resolve(outDir, "tour.css")

const tokens = readFileSync(tokensPath, "utf-8")
const app = readFileSync(appPath, "utf-8")
const consoleCss = readFileSync(consolePath, "utf-8")
const desktopCss = readFileSync(desktopPath, "utf-8")
const editorialCss = readFileSync(editorialPath, "utf-8")
const horizontalCss = readFileSync(horizontalPath, "utf-8")
const scrollyCss = readFileSync(scrollyPath, "utf-8")
const playgroundCss = readFileSync(playgroundPath, "utf-8")
const craftCss = readFileSync(craftPath, "utf-8")
const kineticCss = readFileSync(kineticPath, "utf-8")
const canvasCss = readFileSync(canvasPath, "utf-8")
writeFileSync(
  tourCssPath,
  tokens +
    "\n" +
    app +
    "\n" +
    consoleCss +
    "\n" +
    desktopCss +
    "\n" +
    editorialCss +
    "\n" +
    horizontalCss +
    "\n" +
    scrollyCss +
    "\n" +
    playgroundCss +
    "\n" +
    craftCss +
    "\n" +
    kineticCss +
    "\n" +
    canvasCss,
)
unlinkSync(tokensPath)
unlinkSync(appPath)
unlinkSync(consolePath)
unlinkSync(desktopPath)
unlinkSync(editorialPath)
unlinkSync(horizontalPath)
unlinkSync(scrollyPath)
unlinkSync(playgroundPath)
unlinkSync(craftPath)
unlinkSync(kineticPath)
unlinkSync(canvasPath)

const elapsed = Date.now() - startedAt
console.log(`[build-tour] done in ${elapsed}ms`)
