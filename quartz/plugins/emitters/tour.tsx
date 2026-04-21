/**
 * TourEmitter — `/tour/*` 인터랙티브 투어 앱 HTML shell 발행
 *
 * 참조: docs/decisions/006-tour-app-integration.md (Custom emitter 채택)
 *      docs/decisions/008-route-contract.md (one-router 원칙)
 *
 * 이 emitter는 Quartz의 markdown content 파이프라인을 거치지 않고,
 * 하드코딩된 투어 URL 목록에 대해 HTML shell을 직접 발행한다.
 * 각 shell은 Quartz 공통 CSS/JS(`/index.css`, `/postscript.js`)를 로드하고
 * `<div id="tour-root">`에 Preact 투어 앱이 클라이언트 측 하이드레이션된다.
 *
 * 레거시 URL(`/quickstart/01-first-connection/`)은 meta refresh redirect stub으로
 * 새 경로(`/tour/quickstart/01-first-connection/`)로 이동시킨다.
 */
import { QuartzEmitterPlugin } from "../types"
import { write } from "./helpers"
import { FullSlug, joinSegments, pathToRoot } from "../../util/path"
import { BuildCtx } from "../../util/ctx"

type TourPageDef = {
  slug: FullSlug // 예: "tour" (→ /tour.html), "tour/quickstart/01-first-connection"
  title: string
  description: string
}

/**
 * 투어 페이지 정의. 새 시나리오 추가 시 여기에 한 줄 추가.
 * 플랜 v3.1 Phase R3에서 Quickstart 01~08 전체를 단계적으로 붙인다.
 */
/**
 * slug는 `<path>/index` 형태로 통일 — write()가 `<path>/index.html`을 생성하여
 * URL `/path/`에 매핑된다 (GitHub Pages 기본 디렉토리 인덱스 동작).
 */
const TOUR_PAGES: readonly TourPageDef[] = [
  {
    slug: "tour/index" as FullSlug,
    title: "DabitONe 투어",
    description: "6년 만의 리프레시 — 익숙했던 기능은 그대로, 경험은 새롭게.",
  },
  {
    slug: "tour/quickstart/01-first-connection/index" as FullSlug,
    title: "컨트롤러 최초 연결 — 투어",
    description: "Serial·TCP·UDP 중 하나로 처음 연결하는 과정을 단계별 체험.",
  },
  {
    slug: "tour/quickstart/02-screen-size/index" as FullSlug,
    title: "화면 크기 설정 — 투어",
    description: "가로·세로 모듈 수와 색상 깊이 설정.",
  },
  {
    slug: "tour/quickstart/03-send-message/index" as FullSlug,
    title: "첫 메시지 전송 — 투어",
    description: "텍스트 입력부터 전광판 표출까지.",
  },
  {
    slug: "tour/quickstart/04-edit-image/index" as FullSlug,
    title: "이미지 편집·전송 — 투어",
    description: "BMP/PNG/JPG를 DAT로 변환해 보내기.",
  },
  {
    slug: "tour/quickstart/05-gif-editor/index" as FullSlug,
    title: "GIF 편집 — 투어",
    description: "내장 GIF 편집기로 동영상 제작.",
  },
  {
    slug: "tour/quickstart/06-schedule-pla/index" as FullSlug,
    title: "스케줄 편집 (PLA) — 투어",
    description: "여러 메시지를 순차 재생.",
  },
  {
    slug: "tour/quickstart/07-background-bgp/index" as FullSlug,
    title: "배경 스케줄 (BGP) — 투어",
    description: "배경화면 순환 스케줄.",
  },
  {
    slug: "tour/quickstart/08-firmware/index" as FullSlug,
    title: "펌웨어 업데이트 — 투어",
    description: "컨트롤러 펌웨어 갱신.",
  },
  {
    slug: "tour/accessible/index" as FullSlug,
    title: "투어 (접근성 모드)",
    description: "키보드·스크린 리더 전용 텍스트 투어 경로.",
  },
]

/**
 * 레거시 URL redirect 매핑.
 * { 레거시_slug: 새_slug } 형태. fromSlug에도 `/index` 접미사 적용하여
 * 트레일링 슬래시 URL이 redirect되도록.
 *
 * 모든 /quickstart/* URL을 /tour/quickstart/* 로 이전한다 (plan v3.1 피벗).
 */
const TOUR_ALIASES: Record<string, string> = {
  "quickstart/index": "tour/",
  "quickstart/01-first-connection/index": "tour/quickstart/01-first-connection/",
  "quickstart/02-screen-size/index": "tour/quickstart/02-screen-size/",
  "quickstart/03-send-message/index": "tour/quickstart/03-send-message/",
  "quickstart/04-edit-image/index": "tour/quickstart/04-edit-image/",
  "quickstart/05-gif-editor/index": "tour/quickstart/05-gif-editor/",
  "quickstart/06-schedule-pla/index": "tour/quickstart/06-schedule-pla/",
  "quickstart/07-background-bgp/index": "tour/quickstart/07-background-bgp/",
  "quickstart/08-firmware/index": "tour/quickstart/08-firmware/",
}

function renderTourShell(ctx: BuildCtx, page: TourPageDef): string {
  const cfg = ctx.cfg.configuration
  const baseDir = pathToRoot(page.slug)
  const quartzCss = joinSegments(baseDir, "index.css")
  const tourCss = joinSegments(baseDir, "static/tour/tour.css")
  const tourJs = joinSegments(baseDir, "static/tour/tour.js")
  const preScript = joinSegments(baseDir, "prescript.js")
  const postScript = joinSegments(baseDir, "postscript.js")
  const fullTitle = `${page.title}${cfg.pageTitleSuffix ?? ""}`
  const lang = cfg.locale?.split("-")[0] ?? "ko"

  return `<!DOCTYPE html>
<html lang="${lang}" data-tour-page>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="description" content="${escapeHtml(page.description)}">
  <meta name="color-scheme" content="light dark">
  <title>${escapeHtml(fullTitle)}</title>
  <link rel="stylesheet" href="${quartzCss}">
  <link rel="stylesheet" href="${tourCss}">
  <link rel="icon" href="${joinSegments(baseDir, "static/icon.png")}">
  <script src="${preScript}"></script>
</head>
<body data-slug="${page.slug}" class="tour-page">
  <div id="tour-root">
    <div class="tour-loading" role="status" aria-live="polite">
      <h1 style="font-family: 'Pretendard Variable', sans-serif; letter-spacing: -0.03em; font-size: clamp(48px, 8vw, 96px); margin: 0; padding: 20vh 6vw 0; opacity: 0.6;">
        ${escapeHtml(page.title)}
      </h1>
      <p style="font-family: 'Pretendard Variable', sans-serif; font-size: 19px; color: #515154; padding: 24px 6vw 0; max-width: 640px;">
        ${escapeHtml(page.description)}
      </p>
    </div>
  </div>
  <noscript>
    <div style="padding: 6vw; font-family: 'Pretendard Variable', sans-serif;">
      <h2>JavaScript가 필요합니다</h2>
      <p>이 투어는 브라우저 JavaScript를 사용합니다. 접근성 대안 텍스트 경로는
        <a href="${joinSegments(baseDir, "tour/accessible")}/">/tour/accessible/</a>에서 이용 가능합니다.
      </p>
    </div>
  </noscript>
  <script src="${postScript}" type="module"></script>
  <script src="${tourJs}" type="module"></script>
</body>
</html>`
}

function renderAliasRedirect(ctx: BuildCtx, fromSlug: string, toSlug: string): string {
  const baseDir = pathToRoot(fromSlug as FullSlug)
  const redirUrl = joinSegments(baseDir, toSlug)
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>이동 중... DabitONe</title>
  <link rel="canonical" href="${redirUrl}">
  <meta name="robots" content="noindex">
  <meta http-equiv="refresh" content="0; url=${redirUrl}">
  <style>body{font-family:system-ui;padding:40px;color:#515154}</style>
</head>
<body>
  <p>투어 앱으로 이동합니다. 자동 이동이 안 되면 <a href="${redirUrl}">여기를 클릭하세요</a>.</p>
</body>
</html>`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export const TourEmitter: QuartzEmitterPlugin = () => ({
  name: "TourEmitter",
  getQuartzComponents() {
    return []
  },
  async *emit(ctx) {
    for (const page of TOUR_PAGES) {
      yield await write({
        ctx,
        slug: page.slug,
        ext: ".html",
        content: renderTourShell(ctx, page),
      })
    }
    for (const [fromSlug, toSlug] of Object.entries(TOUR_ALIASES)) {
      yield await write({
        ctx,
        slug: fromSlug as FullSlug,
        ext: ".html",
        content: renderAliasRedirect(ctx, fromSlug, toSlug),
      })
    }
  },
  async *partialEmit(ctx) {
    // MVP: 전체 재발행 (투어 페이지 목록이 짧아 비용 낮음)
    for (const page of TOUR_PAGES) {
      yield await write({
        ctx,
        slug: page.slug,
        ext: ".html",
        content: renderTourShell(ctx, page),
      })
    }
    for (const [fromSlug, toSlug] of Object.entries(TOUR_ALIASES)) {
      yield await write({
        ctx,
        slug: fromSlug as FullSlug,
        ext: ".html",
        content: renderAliasRedirect(ctx, fromSlug, toSlug),
      })
    }
  },
})
