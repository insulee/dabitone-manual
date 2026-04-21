# ADR-008: Route Contract (one-router 원칙)

**일자**: 2026-04-21
**상태**: 확정
**관련**: ADR-006 (투어 앱 통합 방식)
**근거**: codex 리뷰 finding 3

## 원칙

**single source of truth = Quartz SPA router**. 투어 앱은 독립 router를 가지지 않는다.

## URL 구조

```
/                                         → 메인 랜딩 (Quartz ContentPage로 index.md 렌더)
/tour/                                    → 투어 허브 (TourEmitter 발행)
/tour/quickstart/<slug>/                  → 특정 시나리오 투어 (첫 스텝 기본)
/tour/quickstart/<slug>/?s=<N>            → 특정 스텝 (0-indexed)
/tour/accessible/                         → 접근성 대안 경로 (같은 데이터, 텍스트 렌더)
/ui-reference/**                          → Quartz markdown 페이지
/file-formats/**                          → Quartz markdown 페이지
/troubleshooting/**                       → Quartz markdown 페이지
/blog/**                                  → Quartz markdown 페이지
/quickstart/01-first-connection/          → meta refresh → /tour/quickstart/01-first-connection/
```

## 규칙

### 1. Path 변경은 Quartz router가 담당

- 투어 앱 내부의 다른 시나리오로 이동 시: `<a href="/tour/quickstart/02-screen-size/">` 사용
- Quartz SPA router가 자동으로 click 이벤트 intercept → `micromorph`로 DOM diff → 페이지 전환
- **투어 앱 내부에서 `history.pushState()` 절대 금지**

### 2. Step 전환은 query string + `replaceState`

- 같은 시나리오 내 스텝 이동(예: `?s=2` → `?s=3`): `history.replaceState({}, "", url.toString())`
- `pushState` 대신 `replaceState`를 사용하는 이유:
  - Quartz router는 path만 보므로 query 변경은 router 미작동
  - `pushState`는 브라우저 back 스택에 entry 쌓음 → "뒤로가기" 4번에 UX 혼란
  - `replaceState`는 현재 히스토리 entry만 덮어씀 → 스텝 이동 기록을 히스토리에 남기지 않음

대안: 각 스텝을 자기 URL로 (`/tour/quickstart/01/step-2/`). 이 경우:
- TourEmitter가 step별 HTML shell 각각 emit (발행 수 급증)
- Quartz router가 step 간 이동마다 `micromorph` 수행 → DOM 교체 오버헤드
- 장점: 각 스텝 딥링크 가능, SEO friendly

**결정**: MVP는 query string + replaceState. 스텝별 딥링크 필요성이 실제 사용 중 드러나면 step별 HTML로 마이그레이션.

### 3. Escape Hatch — `data-router-ignore`

투어 앱 내 특정 엘리먼트가 Quartz router에 영향을 주면 안 되는 경우(예: 외부 링크 모달 등):

```html
<a href="..." data-router-ignore>...</a>
```

Quartz의 `spa.inline.ts:32`가 이 속성을 체크하여 intercept 건너뜀.

### 4. Popover·다이얼로그는 URL에 반영 금지

- 핫스팟 팝오버 열림 상태: **URL에 표현하지 않음**
- 팝오버 열림/닫힘은 Preact state로만 관리
- 브라우저 back 키는 Quartz SPA 뒤로가기로만 반응 (팝오버는 Escape로 닫기)

## 하이드레이션 순서 (새로고침·직접 진입 시)

1. 브라우저: `GET /tour/quickstart/01-first-connection/` → TourEmitter가 emit한 HTML 서빙
2. HTML parsing → `<div id="tour-root"></div>` 빈 컨테이너 렌더
3. `<script type="module" src="/static/tour/entry.js">` 로드 → Preact 앱 시작
4. Preact: `window.location.pathname` 파싱 → 현재 투어 slug 추론 → 해당 데이터 로드
5. `URLSearchParams.get("s")` → 현재 스텝 복원
6. Preact tree mount → 첫 프레임 애니 시작

## 앱 초기화 예시 코드

```typescript
// tour/src/index.tsx
import { render } from "preact"
import { App } from "./App"
import { hydrateFromUrl } from "./lib/state"

hydrateFromUrl()   // ?s=N 복원

const root = document.getElementById("tour-root")
if (root) {
  render(<App />, root)
}
```

## 검증 시나리오 (R1.0 완료 기준)

- [ ] `/tour/` 직접 접속 200 OK
- [ ] `/tour/quickstart/01-first-connection/` 직접 접속 200 OK
- [ ] `/tour/quickstart/01-first-connection/?s=3` 새로고침 시 스텝 3 유지
- [ ] `/tour/quickstart/01-first-connection/` → `/tour/quickstart/02-screen-size/` 링크 클릭 시 Quartz SPA 라우터로 전환 (페이지 reload 없이)
- [ ] `/quickstart/01-first-connection/` (레거시 URL) 접속 시 meta refresh로 새 URL 리디렉트
- [ ] 브라우저 뒤로가기: 스텝 간 이동은 기록 안 됨, 투어 간 이동은 기록됨

## 참조

- `quartz/components/scripts/spa.inline.ts:32` — `data-router-ignore` 체크
- `quartz/components/scripts/spa.inline.ts:146` — `spaNavigate()` 공개 API
- `quartz/components/scripts/spa.inline.ts:150-172` — popstate 핸들러
- MDN History API: https://developer.mozilla.org/docs/Web/API/History_API
