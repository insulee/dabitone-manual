# ADR-006: 투어 앱 Quartz 통합 방식

**일자**: 2026-04-21
**상태**: 확정 (codex 리뷰 반영)
**관련 플랜**: `docs/plans/2026-04-21-dabitone-manual-plan-v3.md` Phase R1.0

## 배경

DabitOne 매뉴얼 사이트의 `/tour/*` 경로에 Preact 기반 인터랙티브 투어 앱을 임베드하기 위한 Quartz v4 통합 방식을 결정해야 함. 후보는 세 가지.

## 후보 평가

### (a) Custom layout via frontmatter

접근: `content/tour.md`에 `layout: tour-app` frontmatter를 두고 `quartz.layout.ts`에서 커스텀 레이아웃 분기.

- **장점**: Quartz의 markdown 중심 파이프라인 활용, 기존 navbar·head 자연 재사용
- **단점**: **Quartz v4는 frontmatter 기반 layout 분기를 기본 지원하지 않음.** 구현하려면 `contentPage.tsx` emitter 또는 layout resolution 로직을 수정해야 함 → 결국 코어 수정 필요
- **판정**: 복잡도 대비 이득 없음

### (b) Custom emitter (채택)

접근: `quartz/plugins/emitters/tour.tsx` 신규 작성. `/tour/`, `/tour/quickstart/<slug>/`, `/tour/accessible/` 각각에 HTML shell을 emit. Preact 앱은 shell 안의 `<div id="tour-root">`에 client-side hydration.

- **장점**:
  - 각 deep link URL에 **실제 HTML 파일**이 존재 → 정적 호스팅(GitHub Pages)에서 새로고침·직접 진입 모두 200 OK
  - Quartz의 `write()` helper, `renderPage()` 재사용 가능 → navbar·footer·Head 공유
  - `partialEmit()`로 dev 모드 watch 지원
  - AliasRedirects 스타일 패턴을 그대로 따라 쓰므로 코드 학습 곡선 낮음
- **단점**:
  - Quartz 플러그인 파일 1개 신규 작성 필요 (`quartz/plugins/emitters/tour.tsx`)
  - 투어 URL 목록이 코드 상수로 박혀 있거나 config로 받아야 함 (관리 비용)
- **판정**: **채택**

### (c) Static asset embed + client-side History API

접근: `quartz/static/tour/` 아래에 사전 빌드된 SPA를 정적 자산으로 배치, markdown 페이지가 `<script>` 태그로 포함.

- **장점**: Quartz 손 안 댐. 별도 빌드 파이프라인이지만 깔끔
- **단점**:
  - **치명적**: `/tour/quickstart/01/`에 실제 파일이 없으므로 정적 호스팅에서 직접 진입·새로고침 시 **404**
  - SPA 내부 라우터(History API 자작)가 Quartz SPA router와 충돌 (one-router 위배)
  - 별도 번들러(vite 등) 필요 → 빌드 파이프라인 이중화
- **판정**: 호스팅 제약으로 탈락

## 결정: (b) Custom Emitter

codex 리뷰 finding 2의 권고와 일치. 호스팅·one-router·코드 재사용 세 축에서 유일하게 모두 만족.

## 구현 개요 (R1.0 Step 2~5)

### Step 2: `quartz/plugins/emitters/tour.tsx` 신규 작성

```typescript
import { QuartzEmitterPlugin } from "../types"
import { write } from "./helpers"
import type { BuildCtx } from "../../util/ctx"
import type { FullSlug } from "../../util/path"

// 투어 URL 목록 — 투어 데이터가 추가되면 여기 반영
const TOUR_SLUGS: readonly string[] = [
  "tour",
  "tour/quickstart/01-first-connection",
  "tour/quickstart/02-screen-size",
  "tour/quickstart/03-send-message",
  "tour/quickstart/04-edit-image",
  "tour/quickstart/05-gif-editor",
  "tour/quickstart/06-schedule-pla",
  "tour/quickstart/07-background-bgp",
  "tour/quickstart/08-firmware",
  "tour/accessible",
]

// 레거시 alias → 새 URL redirect 매핑
const TOUR_ALIASES: Record<string, string> = {
  "quickstart/01-first-connection": "tour/quickstart/01-first-connection",
  // 다른 레거시 URL도 필요 시 추가
}

export const TourEmitter: QuartzEmitterPlugin = () => ({
  name: "TourEmitter",
  getQuartzComponents: () => [],
  async *emit(ctx) {
    for (const slug of TOUR_SLUGS) {
      const html = renderTourShell(ctx, slug as FullSlug)
      yield await write({ ctx, slug: slug as FullSlug, ext: ".html", content: html })
    }
    for (const [from, to] of Object.entries(TOUR_ALIASES)) {
      const html = renderAliasRedirect(ctx, to)
      yield await write({ ctx, slug: from as FullSlug, ext: ".html", content: html })
    }
  },
  async *partialEmit(ctx, _content, _resources, changeEvents) {
    // MVP: 전체 재생성 (투어 URL 목록이 짧아 비용 낮음)
    yield* this.emit!(ctx, [], {} as any)
  },
})
```

### Step 3: `renderTourShell` 구현 (별도 파일 또는 같은 파일)

Quartz의 기존 `renderPage()`를 그대로 쓰기보다, 투어용 얇은 shell 함수를 직접 작성. 이유: `renderPage`는 markdown tree와 page components를 받도록 돼 있어 투어 같은 empty content 케이스에선 synthetic 객체를 만들어야 함.

투어 shell의 최소 구조:

```html
<!DOCTYPE html>
<html lang="ko-KR" data-router-ignore-subtree>
  <head>
    <!-- Quartz Head component 결과 inline -->
    <link rel="stylesheet" href="/index.css">
    <link rel="stylesheet" href="/tour.css">
    <title>DabitOne 매뉴얼 — {페이지 제목}</title>
  </head>
  <body>
    <div id="tour-root"></div>
    <script type="module" src="/static/tour/entry.js"></script>
  </body>
</html>
```

### Step 4: 투어 앱 entry script 등록

`quartz/components/scripts/tour.inline.ts`에 Preact mount 코드 작성. esbuild가 번들해서 `/static/tour/entry.js`에 emit.

### Step 5: `quartz.config.ts` emitters 배열에 추가

```typescript
emitters: [
  Plugin.TourEmitter(),  // ← 추가
  Plugin.AliasRedirects(),
  Plugin.ComponentResources(),
  Plugin.ContentPage(),
  // ... 나머지
]
```

## One-Router 원칙 준수

- **투어 앱은 `history.pushState()` 금지**
- 스텝 간 이동은 `<a href="/tour/quickstart/02/">` 링크 또는 **query string** 기반 (`?s=2`)
- query string 변경은 `history.replaceState()`로 — Quartz router는 path만 보므로 영향 없음
- 외부 페이지로 이동 시 Quartz SPA router가 자동 intercept → `micromorph` 기반 DOM diff

## Alias Redirect 전략 (codex 1 반영)

기존 `/quickstart/01-first-connection/` URL은 TourEmitter가 **직접 redirect stub HTML을 emit**하여 `/tour/quickstart/01-first-connection/`로 meta refresh. Quartz의 `AliasRedirects` emitter와 동일 원리이지만, 투어 쪽이 markdown 파일이 아니므로 TourEmitter 내부에서 처리.

```html
<!-- renderAliasRedirect 출력 예시 -->
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="refresh" content="0; url=/tour/quickstart/01-first-connection/">
    <link rel="canonical" href="/tour/quickstart/01-first-connection/">
  </head>
</html>
```

## 참조 파일 (Quartz 내부)

| 참고 경로 | 용도 |
|----------|------|
| `quartz/plugins/types.ts:42-65` | `QuartzEmitterPlugin` 타입 정의 |
| `quartz/plugins/emitters/helpers.ts:14-20` | `write()` 파일 출력 helper |
| `quartz/plugins/emitters/aliases.ts` | async generator emit 패턴 참고 |
| `quartz/plugins/emitters/contentPage.tsx` | 공통 shell 구성 방식 참조 |
| `quartz/components/renderPage.tsx:215-302` | HTML 구조 참조 (full rewrite 시) |
| `quartz/components/scripts/spa.inline.ts:32,150-172` | SPA router intercept·popstate 로직 |
| `quartz.config.ts:84-97` | emitter 등록 위치 |

## 트레이드오프

- **장점**:
  - 정적 호스팅에서 모든 deep link 안전
  - Quartz 기존 SPA router 재사용 (한 router 원칙)
  - `partialEmit`로 dev watch 호환
  - alias redirect stub 자체 발행 가능 (레거시 URL 보존)
- **단점**:
  - 투어 URL 목록 관리(`TOUR_SLUGS`) — 투어 추가 시 emitter도 수정
  - Quartz 플러그인 1개 신규 작성 → 추후 Quartz 업그레이드 시 호환성 확인 필요
- **대안 시 복귀 조건**: TourEmitter 접근이 Quartz v5 등에서 호환 안 되면 (c) + hash routing으로 fallback 검토

## 다음 액션

R1.0 Step 2 — 최소 TourEmitter 스파이크 구현. `/tour/` 단일 경로만 emit하고 로컬 빌드·새로고침 확인 후 커밋.
