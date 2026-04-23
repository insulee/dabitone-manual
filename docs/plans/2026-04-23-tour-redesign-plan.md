# Tour 풀 리디자인 구현 플랜

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Tour 앱(`/tour/` landing + `/tour/quickstart/01-08`)을 모노크롬 minimal 디자인 언어로 풀 리디자인. Hero 픽셀 모션 + 다크 반전 2곳 + Pretendard/Inter 폰트.

**Architecture:** 기존 Preact 투어 앱 구조 유지. `tour/src/styles/tokens.css` 팔레트 교체, `tour/src/styles/app.css` 컴포넌트 스타일 교체, 신규 `PixelMotion.tsx` 컴포넌트 추가, `Landing.tsx`·`TourScenario.tsx` 섹션 재구성. 커밋 단위: Phase별 1~3 커밋.

**Tech Stack:** Preact 10 + TypeScript + CSS Variables + Motion One + Canvas 2D + Pretendard Variable + Inter Variable + Playwright (시각 회귀)

**Design source:** `docs/plans/2026-04-23-tour-redesign-design.md`

**Worktree:** `D:\GitHub\dabitone-manual-tour-redesign\` (branch `feature/tour-redesign`)

---

## Phase 0 — 베이스라인 (30분)

구현 전 현재 상태를 스크린샷으로 기록. 이후 각 Phase 끝에서 시각 회귀 비교용.

### Task 0.1 — Dev 빌드 + 정적 서버 확인

**Files:** 없음 (실행만)

**Step 1:** 의존성 설치

```bash
cd D:/GitHub/dabitone-manual-tour-redesign
npm install
```

Expected: `node_modules/` 생성, 오류 없음

**Step 2:** Tour 빌드 + Quartz 빌드

```bash
npm run build
```

Expected: `public/static/tour/tour.js`, `public/static/tour/tour.css` 생성

**Step 3:** 정적 서버 띄우기 (백그라운드)

```bash
npx http-server public -p 8888 -s &
```

Expected: `Available on: http://127.0.0.1:8888`

**Step 4:** 커밋 없음 (세팅만)

### Task 0.2 — 베이스라인 스크린샷

**Files:**
- Run: `scripts/shot-landing.mjs`

**Step 1:** 기존 스크립트로 베이스라인 캡처

```bash
node scripts/shot-landing.mjs
```

Expected: `verify-compare/landing/*.png` (hero-manifesto·features-1·features-2·full)

**Step 2:** 베이스라인 별도 폴더로 이동

```bash
mkdir -p verify-compare/baseline-before
mv verify-compare/landing/*.png verify-compare/baseline-before/
```

**Step 3:** `.gitignore` 확인 — `verify-compare/` 무시되는지

```bash
git check-ignore verify-compare 2>&1
```

Expected: 경로 출력 (이미 무시됨) 또는 추가 필요

**Step 4:** 무시 안 되면 `.gitignore`에 `verify-compare/` 추가

**Step 5:** 커밋 (gitignore 변경 있는 경우만)

```bash
git add .gitignore
git commit -m "chore: verify-compare/ 시각 회귀 산출물 무시"
```

---

## Phase 1 — 디자인 토큰 & 폰트 (1시간)

### Task 1.1 — Inter Variable WOFF2 추가

**Files:**
- Create: `public/static/fonts/InterVariable.woff2`
- Create: `public/static/fonts/InterVariable-Italic.woff2`

**Step 1:** Inter Variable 공식 릴리즈에서 WOFF2 다운로드

출처: `https://github.com/rsms/inter/releases` (latest, `Inter-*.zip` 내 `InterVariable.woff2`)

```bash
# PowerShell — Invoke-WebRequest 또는 수동 다운로드
mkdir -p public/static/fonts
# 이후 InterVariable.woff2, InterVariable-Italic.woff2 복사
```

**Step 2:** Pretendard Variable 확인 — 이미 있는지

```bash
ls public/static/fonts/ 2>/dev/null || ls quartz/static/fonts/ 2>/dev/null
```

Expected: Pretendard Variable 파일 존재 확인. 없으면 `https://github.com/orioncactus/pretendard/releases` 에서 `PretendardVariable.woff2` 다운로드

**Step 3:** 커밋

```bash
git add public/static/fonts/
git commit -m "chore(fonts): Inter Variable WOFF2 추가 (Pretendard 공존)"
```

### Task 1.2 — `@font-face` 선언 추가

**Files:**
- Modify: `tour/src/styles/tokens.css` (맨 위에 `@font-face` 블록 추가)

**Step 1:** `tokens.css` 상단에 추가

```css
@font-face {
  font-family: "Inter Variable";
  src: url("/static/fonts/InterVariable.woff2") format("woff2-variations");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Inter Variable";
  src: url("/static/fonts/InterVariable-Italic.woff2") format("woff2-variations");
  font-weight: 100 900;
  font-style: italic;
  font-display: swap;
}
/* Pretendard Variable 선언은 기존 Quartz 측에 있으면 유지, 없으면 동일 패턴으로 추가 */
```

**Step 2:** 빌드 + 브라우저 Network 탭에서 폰트 로드 확인

```bash
npm run build
# 브라우저 http://localhost:8888/tour/ — DevTools Network → 폰트 200 OK
```

**Step 3:** 커밋

```bash
git add tour/src/styles/tokens.css
git commit -m "style(tour): Inter Variable @font-face 선언"
```

### Task 1.3 — 색 팔레트 모노크롬 전환

**Files:**
- Modify: `tour/src/styles/tokens.css:27-39` (`/* Colors — Light warm stone */` 블록)

**Step 1:** 색 토큰 교체 (기존 ↔ 신규)

```css
/* 교체 후 */
--tour-c-bg: #ffffff;
--tour-c-bg-soft: #fafafa;
--tour-c-bg-panel: #ffffff;
--tour-c-bg-dark: #0a0a0a;
--tour-c-text: #0a0a0a;
--tour-c-text-soft: #525252;
--tour-c-text-dim: #a3a3a3;
--tour-c-text-dark: #fafafa;
--tour-c-text-dark-soft: #a3a3a3;
--tour-c-accent: currentColor; /* hotspot pulse 전용 — 배경 따라 자동 반전 */
--tour-c-accent-soft: rgba(10, 10, 10, 0.08);
--tour-c-line: rgba(10, 10, 10, 0.10);
--tour-c-line-strong: rgba(10, 10, 10, 0.18);
--tour-c-line-on-dark: rgba(255, 255, 255, 0.12);
```

**Step 2:** 빌드 후 브라우저 확인

```bash
npm run build
# 브라우저에서 기존 accent orange 사라졌는지, 전반 모노크롬 확인
```

Expected: 폰트 로드는 정상, 페이지 전체 색이 흑백으로 전환됨. Hotspot·button 등 accent 적용 부위는 다음 Task에서 수정.

**Step 3:** 커밋

```bash
git add tour/src/styles/tokens.css
git commit -m "style(tour): 팔레트 모노크롬 전환 (warm stone → neutral)"
```

### Task 1.4 — Typography scale 교체

**Files:**
- Modify: `tour/src/styles/tokens.css:12-26` (fs/lh/ls 블록)

**Step 1:** 값 교체

```css
--tour-fs-hero: clamp(44px, 9vw, 80px);      /* 기존 144 → 80 */
--tour-fs-manifesto: clamp(32px, 5vw, 48px); /* 기존 72 → 48 */
--tour-fs-title: clamp(24px, 3vw, 32px);
--tour-fs-section: clamp(20px, 2vw, 28px);
--tour-fs-body: clamp(15px, 1.1vw, 17px);
--tour-fs-small: 14px;
--tour-fs-label: 13px;

--tour-lh-tight: 1.1;
--tour-lh-normal: 1.65;
--tour-ls-tight: -0.03em;
--tour-ls-display: -0.03em;
--tour-ls-label: 0.1em;
```

**Step 2:** 폰트 family에 Inter Variable 추가

```css
--tour-font-display: "Pretendard Variable", "Inter Variable", -apple-system, BlinkMacSystemFont, sans-serif;
--tour-font-body: "Pretendard Variable", "Inter Variable", -apple-system, sans-serif;
```

**Step 3:** 빌드 + 브라우저 확인

```bash
npm run build
```

Expected: Hero 텍스트가 기존보다 작아지고, 전반 자간·행간이 더 tight. Pretendard 유지 + 영문은 Inter 폴백.

**Step 4:** 커밋

```bash
git add tour/src/styles/tokens.css
git commit -m "style(tour): type scale 축소 + Inter Variable 폴백"
```

---

## Phase 2 — 공통 컴포넌트 CSS (1.5시간)

### Task 2.1 — Hotspot을 `currentColor` 기반으로

**Files:**
- Modify: `tour/src/styles/app.css:21-59` (Hotspot 블록)

**Step 1:** Hotspot dot·ripple을 `currentColor`로

```css
.tour-hotspot__dot {
  background: currentColor;
  box-shadow: 0 0 0 4px rgba(10, 10, 10, 0.18);
}
.tour-hotspot__dot::before,
.tour-hotspot__dot::after {
  border-color: currentColor;
}
```

**Step 2:** 다크 반전 섹션에서 색 자동 전환 — `color: #fafafa` 상속받음

**Step 3:** `npm run verify:hotspots` 기존 산출물과 비교

```bash
npm run build
npx http-server public -p 8888 -s &
sleep 2
npm run verify:hotspots
```

Expected: `verify-hotspots/*.png`에서 점이 orange → black으로 전환, ripple 애니 유지

**Step 4:** 커밋

```bash
git add tour/src/styles/app.css
git commit -m "style(tour): hotspot currentColor 기반 자동 반전"
```

### Task 2.2 — Button primary/secondary/ghost CSS class 추출

**Files:**
- Modify: `tour/src/styles/app.css` (새 블록 추가)
- Modify: `tour/src/pages/TourScenario.tsx:430-457` (inline style 삭제 → className)

**Step 1:** `app.css`에 버튼 클래스 추가

```css
/* ==================== Buttons ==================== */
.tour-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  font-family: var(--tour-font-body);
  font-size: var(--tour-fs-body);
  font-weight: 600;
  letter-spacing: -0.01em;
  border: 0;
  border-radius: 0;
  cursor: pointer;
  text-decoration: none;
  transition: background var(--tour-dur-micro) var(--tour-ease-out),
              transform var(--tour-dur-micro) var(--tour-ease-out);
}
.tour-btn--primary {
  background: var(--tour-c-text);
  color: var(--tour-c-bg);
}
.tour-btn--primary:hover {
  background: #262626;
}
.tour-btn--secondary {
  background: transparent;
  color: var(--tour-c-text);
  border: 1px solid var(--tour-c-line-strong);
}
.tour-btn--secondary:hover {
  background: var(--tour-c-bg-soft);
}
.tour-btn--ghost {
  background: transparent;
  color: var(--tour-c-text-soft);
  padding: 8px 12px;
}
.tour-btn--ghost:hover {
  background: var(--tour-c-bg-soft);
}
.tour-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
/* Dark 섹션용 */
.tour-section--dark .tour-btn--primary {
  background: var(--tour-c-text-dark);
  color: var(--tour-c-bg-dark);
}
.tour-section--dark .tour-btn--secondary {
  color: var(--tour-c-text-dark);
  border-color: var(--tour-c-line-on-dark);
}
```

**Step 2:** `TourScenario.tsx`에서 inline `primaryButton`, `secondaryButton`, `primaryLink` 객체 삭제, className 사용

```tsx
<button class="tour-btn tour-btn--primary" onClick={onNext}>다음 →</button>
<button class="tour-btn tour-btn--secondary" onClick={onPrev} disabled={isFirst}>← 이전</button>
<a class="tour-btn tour-btn--primary" href={`/tour/quickstart/${nextTour}/`}>다음 투어 →</a>
```

**Step 3:** 빌드 + Quickstart 페이지 열어 시각 확인

```bash
npm run build
# 브라우저: http://localhost:8888/tour/quickstart/01-first-connection/
```

Expected: 버튼이 black solid · white text · 각진 radius 0

**Step 4:** 커밋

```bash
git add tour/src/styles/app.css tour/src/pages/TourScenario.tsx
git commit -m "refactor(tour): 버튼 CSS class로 추출, 모노크롬 적용"
```

### Task 2.3 — Quickstart 카드 CSS

**Files:**
- Modify: `tour/src/styles/app.css` (`.tour-tabs__*` 블록 기존 스타일 찾아 교체)

**Step 1:** 기존 카드 스타일 찾기

```bash
grep -n "tour-tabs__" tour/src/styles/app.css
```

**Step 2:** 카드 스타일 교체 — 1px border + hover bg + arrow translate

```css
.tour-tabs__item { }
.tour-tabs__link {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto auto;
  gap: 4px 16px;
  padding: 32px 28px;
  border: 1px solid var(--tour-c-line);
  background: var(--tour-c-bg-panel);
  text-decoration: none;
  color: inherit;
  transition: background var(--tour-dur-micro) var(--tour-ease-out);
}
.tour-tabs__link:hover {
  background: var(--tour-c-bg-soft);
}
.tour-tabs__num {
  grid-row: 1 / 3;
  font-family: var(--tour-font-body);
  font-size: 40px;
  font-weight: 300;
  color: var(--tour-c-text-dim);
  line-height: 1;
}
.tour-tabs__name {
  font-size: 24px;
  font-weight: 600;
}
.tour-tabs__desc {
  grid-column: 2 / 3;
  font-size: 14px;
  color: var(--tour-c-text-soft);
}
.tour-tabs__arrow {
  grid-row: 1 / 3;
  align-self: center;
  font-size: 20px;
  transition: transform var(--tour-dur-micro) var(--tour-ease-out);
}
.tour-tabs__link:hover .tour-tabs__arrow {
  transform: translateX(4px);
}
.tour-tabs__list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  list-style: none;
  padding: 0;
  margin: 0;
}
@media (max-width: 1023px) {
  .tour-tabs__list { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 639px) {
  .tour-tabs__list { grid-template-columns: 1fr; }
}
```

**Step 3:** 빌드 + 시각 확인

**Step 4:** 커밋

```bash
git add tour/src/styles/app.css
git commit -m "style(tour): Quickstart 카드 border + hover + 2×4 그리드"
```

---

## Phase 3 — Hero 픽셀 모션 (2시간)

### Task 3.1 — `PixelMotion.tsx` 컴포넌트 작성

**Files:**
- Create: `tour/src/components/PixelMotion.tsx`

**Step 1:** 컴포넌트 작성

```tsx
/**
 * Hero 배경 Canvas — dot matrix 극저대비 sine 기반 밝기 변화.
 * prefers-reduced-motion 시 정적 격자만 렌더.
 */
import { useEffect, useRef } from "preact/hooks"
import { reducedMotion } from "../lib/motion"

interface Props {
  dotSize?: number   // 기본 1.5px
  spacing?: number   // 기본 12px
  maxAlpha?: number  // 기본 0.15
  minAlpha?: number  // 기본 0.02
}

export function PixelMotion({
  dotSize = 1.5,
  spacing = 12,
  maxAlpha = 0.15,
  minAlpha = 0.02,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    function resize() {
      const dpr = window.devicePixelRatio || 1
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener("resize", resize)

    const reduced = reducedMotion()
    const points: { x: number; y: number; phase: number; speed: number }[] = []
    const cols = Math.ceil(window.innerWidth / spacing)
    const rows = Math.ceil(window.innerHeight / spacing)
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        points.push({
          x: i * spacing + spacing / 2,
          y: j * spacing + spacing / 2,
          phase: Math.random() * Math.PI * 2,
          speed: 0.0003 + Math.random() * 0.0005,
        })
      }
    }

    function draw(t: number) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of points) {
        const alpha = reduced
          ? minAlpha + (maxAlpha - minAlpha) * 0.3
          : minAlpha + (maxAlpha - minAlpha) * (0.5 + 0.5 * Math.sin(p.phase + t * p.speed))
        ctx.fillStyle = `rgba(10, 10, 10, ${alpha})`
        ctx.fillRect(p.x - dotSize / 2, p.y - dotSize / 2, dotSize, dotSize)
      }
      if (!reduced) {
        rafRef.current = requestAnimationFrame(draw)
      }
    }
    rafRef.current = requestAnimationFrame(draw)

    // IntersectionObserver로 뷰포트 밖 pause
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          if (!rafRef.current && !reduced) rafRef.current = requestAnimationFrame(draw)
        } else {
          if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
        }
      }
    }, { threshold: 0 })
    io.observe(canvas)

    return () => {
      window.removeEventListener("resize", resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      io.disconnect()
    }
  }, [dotSize, spacing, maxAlpha, minAlpha])

  return (
    <canvas
      ref={canvasRef}
      class="tour-hero__pixel-bg"
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  )
}
```

**Step 2:** 단위 테스트 — reducedMotion 분기

```ts
// tour/src/components/PixelMotion.test.ts
import { test } from "node:test"
import assert from "node:assert"

test("PixelMotion 모듈은 export를 가진다", async () => {
  const mod = await import("./PixelMotion")
  assert.equal(typeof mod.PixelMotion, "function")
})
```

Run: `npm test -- tour/src/components/PixelMotion.test.ts`
Expected: PASS

**Step 3:** 커밋

```bash
git add tour/src/components/PixelMotion.tsx tour/src/components/PixelMotion.test.ts
git commit -m "feat(tour): PixelMotion Canvas 컴포넌트 추가"
```

### Task 3.2 — Hero에 통합 + 브라우저 성능 확인

**Files:**
- Modify: `tour/src/pages/Landing.tsx:58-76` (Hero 함수)
- Modify: `tour/src/styles/app.css` (`.tour-hero`, `.tour-hero__pixel-bg` 추가)

**Step 1:** Landing.tsx Hero에 통합 (다음 Phase 4.1에서 전체 구조 변경 예정, 우선 배경만 삽입)

```tsx
import { PixelMotion } from "../components/PixelMotion"

function Hero() {
  // 기존 revealOnEnter + DOM 구조 유지
  return (
    <section ref={ref} class="tour-hero" aria-label="Hero" style={{ opacity: 0, position: "relative" }}>
      <PixelMotion />
      <div class="tour-hero__inner" style={{ position: "relative", zIndex: 1 }}>
        {/* 기존 내용 유지 */}
      </div>
    </section>
  )
}
```

**Step 2:** `app.css`에 Hero 상대 포지셔닝 보장

```css
.tour-hero { position: relative; overflow: hidden; }
.tour-hero__pixel-bg { z-index: 0; }
.tour-hero__inner { position: relative; z-index: 1; }
```

**Step 3:** 빌드 + 브라우저 Chrome DevTools Performance 탭에서 FPS 측정

Expected: 60fps 안정. 저사양이면 30fps 이상. 미만이면 `spacing`을 16px로 늘려 점 수 절반.

**Step 4:** `prefers-reduced-motion: reduce` 토글해서 애니 멈추는지 확인 (Chrome DevTools Rendering 탭)

Expected: 격자 고정, RAF 정지

**Step 5:** 커밋

```bash
git add tour/src/pages/Landing.tsx tour/src/styles/app.css
git commit -m "feat(tour): Hero 픽셀 모션 배경 통합"
```

---

## Phase 4 — Landing 섹션 재구성 (3시간)

### Task 4.1 — Hero 구조 변경 (manifesto 분리, CTA 2개)

**Files:**
- Modify: `tour/src/pages/Landing.tsx:58-76` (Hero)
- Modify: `tour/src/pages/Landing.tsx:9-56` (최상위 return — Manifesto 섹션 삽입)

**Step 1:** Hero에서 manifesto 분리, CTA 2개 추가

```tsx
function Hero() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => { if (ref.current) revealOnEnter(ref.current) }, [])
  return (
    <section ref={ref} class="tour-hero" aria-label="Hero" style={{ opacity: 0 }}>
      <PixelMotion />
      <div class="tour-hero__inner">
        <h1 class="tour-hero__title">DabitOne.</h1>
        <p class="tour-hero__sub">다빛솔루션 LED 전광판 운영 소프트웨어.</p>
        <div class="tour-hero__cta">
          <a class="tour-btn tour-btn--primary" href="#quickstart">투어 시작하기 →</a>
          <a class="tour-btn tour-btn--secondary" href="https://www.dabitsol.com" target="_blank" rel="noreferrer">DabitOne 다운로드</a>
        </div>
      </div>
    </section>
  )
}
```

**Step 2:** CSS Hero CTA

```css
.tour-hero__cta {
  display: flex;
  gap: 12px;
  margin-top: 32px;
  flex-wrap: wrap;
}
@media (max-width: 639px) {
  .tour-hero__cta { flex-direction: column; align-items: stretch; }
  .tour-hero__cta .tour-btn { justify-content: center; }
}
```

**Step 3:** Manifesto 섹션 컴포넌트 추가

```tsx
function Manifesto() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => { if (ref.current) revealOnEnter(ref.current) }, [])
  return (
    <section ref={ref} class="tour-manifesto tour-section--dark" style={{ opacity: 0 }}>
      <div class="tour-manifesto__inner">
        <h2 class="tour-manifesto__title">
          픽셀에서 프로토콜까지,<br />하나의 소프트웨어.
        </h2>
      </div>
    </section>
  )
}
```

**Step 4:** CSS Manifesto + 다크 섹션 공통 클래스

```css
.tour-section--dark {
  background: var(--tour-c-bg-dark);
  color: var(--tour-c-text-dark);
}
.tour-section--dark .tour-c-text-soft { color: var(--tour-c-text-dark-soft); }
.tour-manifesto {
  padding: 160px 24px;
  text-align: center;
}
.tour-manifesto__inner {
  max-width: 900px;
  margin: 0 auto;
}
.tour-manifesto__title {
  font-family: var(--tour-font-display);
  font-size: var(--tour-fs-manifesto);
  font-weight: 600;
  line-height: var(--tour-lh-tight);
  letter-spacing: var(--tour-ls-tight);
  margin: 0;
}
```

**Step 5:** `Landing()` 최상위 return에 `<Manifesto />` 삽입 (Hero 직후)

```tsx
return (
  <>
    <Hero />
    <Manifesto />
    <Feature ... />
    ...
  </>
)
```

**Step 6:** 빌드 + 브라우저

Expected: Hero → 다크 Manifesto 전환 리듬, CTA 2개 버튼 정상 동작

**Step 7:** 커밋

```bash
git add tour/src/pages/Landing.tsx tour/src/styles/app.css
git commit -m "feat(tour): Hero CTA 2개 + Manifesto 다크 섹션 분리"
```

### Task 4.2 — Feature 4개 좌우 교대 레이아웃

**Files:**
- Modify: `tour/src/pages/Landing.tsx:78-116` (Feature 컴포넌트)
- Modify: `tour/src/styles/app.css` (Feature 관련 스타일)

**Step 1:** Feature 컴포넌트에 `flip` prop 추가

```tsx
function Feature({ num, label, title, lines, flip }: {
  num: string; label: string; title: string; lines: string[]; flip?: boolean
}) {
  ...
  return (
    <section
      ref={ref}
      class={`tour-feature ${flip ? "tour-feature--flip" : ""}`}
      style={{ opacity: 0 }}
      aria-label={label.toLowerCase()}
    >
      <div class="tour-feature__inner">
        <div class="tour-feature__text">
          <div class="tour-feature__head">
            <span class="tour-feature__num">{num}</span>
            <span class="tour-feature__label">{label}</span>
          </div>
          <h3 class="tour-feature__title">{title}</h3>
          <div class="tour-feature__body">
            {lines.map((line, i) => <p key={i} class="tour-feature__line">{line}</p>)}
          </div>
        </div>
        <div class="tour-feature__visual" aria-hidden="true" />
      </div>
    </section>
  )
}
```

**Step 2:** Landing에서 F02·F04에 `flip` 전달

```tsx
<Feature num="F01" ... />
<Feature num="F02" flip ... />
<Feature num="F03" ... />
<Feature num="F04" flip ... />
```

**Step 3:** CSS 좌우 교대

```css
.tour-feature {
  padding: 120px 24px;
}
.tour-feature__inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}
.tour-feature--flip .tour-feature__inner {
  direction: rtl;
}
.tour-feature--flip .tour-feature__text {
  direction: ltr;
}
.tour-feature__visual {
  min-height: 240px;
  /* 현재는 빈 공간 — 향후 SVG 아이콘 슬롯 */
}
@media (max-width: 1023px) {
  .tour-feature { padding: 96px 24px; }
  .tour-feature__inner { gap: 48px; }
}
@media (max-width: 639px) {
  .tour-feature { padding: 64px 20px; }
  .tour-feature__inner { grid-template-columns: 1fr; }
  .tour-feature--flip .tour-feature__inner { direction: ltr; }
  .tour-feature__visual { display: none; }
}
```

**Step 4:** 빌드 + 브라우저

Expected: 데스크톱에서 좌텍/우빈 → 좌빈/우텍 → 교대. 모바일에서 stack.

**Step 5:** 커밋

```bash
git add tour/src/pages/Landing.tsx tour/src/styles/app.css
git commit -m "refactor(tour): Feature 좌우 교대 레이아웃"
```

### Task 4.3 — Rest Moment 섹션 추가

**Files:**
- Create: `content/assets/landing/rest-moment.jpg` (Unsplash 추상 이미지 1장)
- Modify: `tour/src/pages/Landing.tsx` (RestMoment 컴포넌트 추가)
- Modify: `tour/src/styles/app.css`

**Step 1:** 이미지 선정 — Unsplash에서 LED 매크로·픽셀 매트릭스·라이트 트레일·기하학 중 하나

```
https://unsplash.com/s/photos/led-pixel-macro
```

다운로드 → `content/assets/landing/rest-moment.jpg` 저장 (1600×900 내외, 200KB 이하 권장 `sharp` 등으로 압축)

**Step 2:** RestMoment 컴포넌트

```tsx
function RestMoment() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => { if (ref.current) revealOnEnter(ref.current) }, [])
  return (
    <section ref={ref} class="tour-rest" aria-hidden="true" style={{ opacity: 0 }}>
      <img src="/assets/landing/rest-moment.jpg" alt="" loading="lazy" class="tour-rest__img" />
    </section>
  )
}
```

**Step 3:** CSS

```css
.tour-rest {
  width: 100%;
  height: 50vh;
  min-height: 360px;
  overflow: hidden;
}
.tour-rest__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
```

**Step 4:** Landing에 삽입 — TabIndex 직전

```tsx
<Feature num="F04" flip ... />
<RestMoment />
<TabIndex />
```

**Step 5:** 빌드 + 브라우저

**Step 6:** 커밋

```bash
git add content/assets/landing/ tour/src/pages/Landing.tsx tour/src/styles/app.css
git commit -m "feat(tour): Rest Moment 추상 이미지 섹션"
```

### Task 4.4 — Footer 다크 반전 + 설치 CTA

**Files:**
- Modify: `tour/src/pages/Landing.tsx:173-205` (PdfFooter)
- Modify: `tour/src/styles/app.css` (Footer 스타일)

**Step 1:** Footer 컴포넌트 — 다크 적용 + 설치 CTA 추가

```tsx
function Footer() {
  return (
    <footer class="tour-footer tour-section--dark" aria-label="다운로드 및 참조">
      <div class="tour-footer__inner">
        <div class="tour-footer__install">
          <p class="tour-footer__eyebrow">START USING</p>
          <h3 class="tour-footer__title">DabitOne 지금 다운로드.</h3>
          <a class="tour-btn tour-btn--primary" href="https://www.dabitsol.com" target="_blank" rel="noreferrer">
            DabitOne 다운로드 →
          </a>
        </div>
        <div class="tour-footer__pdfs">
          <p class="tour-footer__eyebrow">REFERENCE PDF</p>
          <a class="tour-footer__pdf-card" href="/pdf/DabitOne_Manual_Reference.pdf">...</a>
          <a class="tour-footer__pdf-card" href="/pdf/DabitOne_Manual_Operation.pdf">...</a>
        </div>
        <p class="tour-footer__colophon">© 다빛솔루션</p>
      </div>
    </footer>
  )
}
```

**Step 2:** CSS Footer 2-col + 모바일 stack

```css
.tour-footer {
  padding: 120px 24px 48px;
}
.tour-footer__inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
}
.tour-footer__pdf-card {
  display: block;
  padding: 24px;
  border: 1px solid var(--tour-c-line-on-dark);
  color: inherit;
  text-decoration: none;
  margin-bottom: 12px;
  transition: background var(--tour-dur-micro) var(--tour-ease-out);
}
.tour-footer__pdf-card:hover {
  background: rgba(255, 255, 255, 0.06);
}
.tour-footer__colophon {
  grid-column: 1 / -1;
  padding-top: 32px;
  border-top: 1px solid var(--tour-c-line-on-dark);
  font-size: 13px;
  color: var(--tour-c-text-dark-soft);
}
@media (max-width: 1023px) {
  .tour-footer__inner { grid-template-columns: 1fr; }
}
```

**Step 3:** Landing에서 `<PdfFooter />` → `<Footer />`로 이름 교체

**Step 4:** 빌드 + 브라우저

**Step 5:** 커밋

```bash
git add tour/src/pages/Landing.tsx tour/src/styles/app.css
git commit -m "feat(tour): Footer 다크 반전 + 설치 CTA 추가"
```

### Task 4.5 — Quickstart 섹션 id 앵커 추가

**Files:**
- Modify: `tour/src/pages/Landing.tsx` TabIndex 컴포넌트

**Step 1:** `id="quickstart"` 추가 — Hero CTA `#quickstart` 앵커와 연결

```tsx
<section ref={ref} id="quickstart" class="tour-tabs" ...>
```

**Step 2:** 빌드 + 브라우저에서 Hero CTA 클릭 시 Quickstart로 스무스 스크롤 되는지

**Step 3:** CSS

```css
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```

**Step 4:** 커밋

```bash
git add tour/src/pages/Landing.tsx tour/src/styles/app.css
git commit -m "feat(tour): Quickstart 앵커 + 스무스 스크롤"
```

---

## Phase 5 — Quickstart 페이지 업데이트 (2시간)

### Task 5.1 — ProgressHeader subtitle 표시

**Files:**
- Modify: `tour/src/pages/TourScenario.tsx:141-224` (ProgressHeader)

**Step 1:** ProgressHeader에 subtitle 추가

```tsx
<div>
  <div class="tour-scenario__eyebrow">DabitOne 투어</div>
  <h1 class="tour-scenario__title">{tour.title}</h1>
  {tour.subtitle && <p class="tour-scenario__subtitle">{tour.subtitle}</p>}
</div>
```

**Step 2:** 인라인 스타일 제거 → CSS class

```css
.tour-scenario__eyebrow {
  font-size: var(--tour-fs-small);
  color: var(--tour-c-text-soft);
  text-transform: uppercase;
  letter-spacing: var(--tour-ls-label);
  margin-bottom: 6px;
}
.tour-scenario__title {
  font-family: var(--tour-font-display);
  font-size: var(--tour-fs-manifesto);
  font-weight: 600;
  letter-spacing: var(--tour-ls-tight);
  line-height: var(--tour-lh-tight);
  margin: 0 0 8px;
}
.tour-scenario__subtitle {
  font-size: 20px;
  font-weight: 400;
  color: var(--tour-c-text-soft);
  margin: 0;
  line-height: 1.4;
}
```

**Step 3:** 빌드 + `/tour/quickstart/01-first-connection/` 확인

Expected: "컨트롤러 최초 연결" 아래에 "Serial·TCP·UDP 중 하나로 처음 연결하기" 서브타이틀 노출

**Step 4:** 커밋

```bash
git add tour/src/pages/TourScenario.tsx tour/src/styles/app.css
git commit -m "feat(tour): Quickstart subtitle 표시 + 인라인 스타일 제거"
```

### Task 5.2 — Stage 이미지 border + shadow, Progress bar 색/두께

**Files:**
- Modify: `tour/src/pages/TourScenario.tsx` (Stage, ProgressHeader progressbar)
- Modify: `tour/src/styles/app.css`

**Step 1:** Stage·Progress inline 스타일 교체

```tsx
// Stage
<div class="tour-stage" style={{ aspectRatio: `${step.image.width} / ${step.image.height}`, maxHeight: "78vh" }}>
  <img class="tour-stage__image" ... />
  {effective && <Hotspot ... />}
</div>
```

**Step 2:** CSS

```css
.tour-stage {
  position: relative;
  border: 1px solid var(--tour-c-line);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}
.tour-stage__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}
.tour-progress-bar {
  height: 2px;
  background: var(--tour-c-line);
  overflow: hidden;
}
.tour-progress-bar__fill {
  height: 100%;
  background: var(--tour-c-text);
  transition: width 400ms var(--tour-ease-out);
}
```

**Step 3:** ProgressHeader progressbar 인라인 → className + `.tour-progress-bar` 적용

**Step 4:** 빌드 + 브라우저

Expected: progress bar 2px · black, Stage 이미지 테두리 + 옅은 그림자

**Step 5:** 커밋

```bash
git add tour/src/pages/TourScenario.tsx tour/src/styles/app.css
git commit -m "style(tour): Stage 이미지 테두리 + progress bar 모노크롬"
```

### Task 5.3 — Rail 배경·테두리 교체

**Files:**
- Modify: `tour/src/pages/TourScenario.tsx:257-428` (Rail 함수 inline style 제거)
- Modify: `tour/src/styles/app.css`

**Step 1:** inline → class

```tsx
<aside class="tour-rail">
  <h2 class="tour-rail__title">{step.title}</h2>
  <p class="tour-rail__desc">{step.description}</p>
  {step.tips && <ul class="tour-rail__tips">...</ul>}
  {step.relatedRefs && <div class="tour-rail__refs">...</div>}
  <div class="tour-rail__actions">...</div>
</aside>
```

**Step 2:** CSS

```css
.tour-rail {
  position: sticky;
  top: 40px;
  background: var(--tour-c-bg);
  padding: 32px 28px;
  border: 1px solid var(--tour-c-line);
  box-shadow: none;
}
.tour-rail__title {
  font-family: var(--tour-font-display);
  font-size: var(--tour-fs-title);
  font-weight: 600;
  letter-spacing: var(--tour-ls-tight);
  line-height: var(--tour-lh-tight);
  margin: 0 0 16px;
}
.tour-rail__desc {
  font-size: var(--tour-fs-body);
  line-height: var(--tour-lh-normal);
  color: var(--tour-c-text-soft);
  margin: 0 0 24px;
}
.tour-rail__tips {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
  border-top: 1px solid var(--tour-c-line);
  padding-top: 16px;
}
.tour-rail__tips li {
  font-size: 15px;
  color: var(--tour-c-text-soft);
  padding: 6px 0 6px 20px;
  position: relative;
}
.tour-rail__tips li::before {
  content: "·";
  position: absolute;
  left: 0;
  color: var(--tour-c-text);
}
.tour-rail__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
@media (max-width: 1023px) {
  .tour-rail { position: static; }
}
```

**Step 3:** 빌드 + 브라우저 + sticky 동작 확인

**Step 4:** 커밋

```bash
git add tour/src/pages/TourScenario.tsx tour/src/styles/app.css
git commit -m "refactor(tour): Rail inline style 제거 + 모노크롬 적용"
```

### Task 5.4 — 완료 스크린 컴포넌트

**Files:**
- Modify: `tour/src/pages/TourScenario.tsx` (ScenarioBody — `isLast && !nextTour` 분기 강화)

**Step 1:** 완료 스크린 렌더

```tsx
function CompletionScreen({ tour }: { tour: Tour }) {
  return (
    <section class="tour-completion tour-section--dark">
      <div class="tour-completion__inner">
        <p class="tour-completion__eyebrow">COMPLETE</p>
        <h2 class="tour-completion__title">투어 완료.</h2>
        <p class="tour-completion__text">
          {tour.title} 투어가 끝났습니다. 다른 투어를 이어가거나, DabitOne을 지금 설치할 수 있습니다.
        </p>
        <div class="tour-completion__actions">
          <a class="tour-btn tour-btn--primary" href="/tour/">모든 투어 보기 →</a>
          <a class="tour-btn tour-btn--secondary" href="https://www.dabitsol.com" target="_blank" rel="noreferrer">
            DabitOne 다운로드
          </a>
        </div>
      </div>
    </section>
  )
}
```

**Step 2:** ScenarioBody에서 `isLast && !nextTour`일 때 완료 스크린을 Stage 아래에 함께 노출 (stack) — 단순히 마지막 step의 Stage/Rail 뒤에 붙임

```tsx
return (
  <main class="tour-scenario" ...>
    ...
    <div class="tour-scenario__stage-and-rail">...</div>
    {isLast && !nextTour && <CompletionScreen tour={tour} />}
  </main>
)
```

**Step 3:** CSS

```css
.tour-completion {
  margin-top: 80px;
  padding: 96px 24px;
}
.tour-completion__inner {
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
}
.tour-completion__eyebrow {
  font-size: 13px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--tour-c-text-dark-soft);
  margin: 0 0 12px;
}
.tour-completion__title {
  font-family: var(--tour-font-display);
  font-size: var(--tour-fs-manifesto);
  font-weight: 600;
  letter-spacing: var(--tour-ls-tight);
  margin: 0 0 16px;
}
.tour-completion__text {
  font-size: 17px;
  line-height: 1.65;
  color: var(--tour-c-text-dark-soft);
  margin: 0 0 32px;
}
.tour-completion__actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
```

**Step 4:** 8번째 투어(`08-firmware`, nextTour 없음) 마지막 step에서 확인

```
/tour/quickstart/08-firmware/?s=<마지막>
```

Expected: Stage/Rail 아래에 다크 완료 스크린

**Step 5:** 커밋

```bash
git add tour/src/pages/TourScenario.tsx tour/src/styles/app.css
git commit -m "feat(tour): Quickstart 완료 스크린 추가 (isLast && !nextTour)"
```

---

## Phase 6 — 반응형 & 접근성 (1시간)

### Task 6.1 — Landing 반응형 체크 + 보완

**Files:**
- Modify: `tour/src/styles/app.css` (미싱 media query 보완)

**Step 1:** Chrome DevTools Device Toolbar로 1440/1024/640/375 breakpoint 브라우징

체크리스트:
- Hero Display clamp 적용 확인
- Manifesto 다크 섹션 모바일 padding 축소
- Feature 모바일 single-col stack
- RestMoment 모바일 높이 축소
- Quickstart 1×8 stack
- Footer 1-col stack

**Step 2:** 누락된 media query 보완

**Step 3:** 커밋

```bash
git add tour/src/styles/app.css
git commit -m "style(tour): Landing 반응형 보완"
```

### Task 6.2 — Quickstart 반응형

**Files:**
- Modify: `tour/src/styles/app.css` (`.tour-scenario` 반응형)

**Step 1:** Stage : Rail grid 반응형

```css
.tour-scenario__stage-and-rail {
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(280px, 1fr);
  gap: 40px;
  align-items: start;
}
@media (max-width: 1023px) {
  .tour-scenario__stage-and-rail {
    grid-template-columns: minmax(0, 1.2fr) minmax(240px, 1fr);
    gap: 32px;
  }
}
@media (max-width: 767px) {
  .tour-scenario__stage-and-rail {
    grid-template-columns: 1fr;
  }
}
```

**Step 2:** Container padding 반응형

```css
.tour-scenario {
  padding: 40px 32px;
}
@media (max-width: 1023px) { .tour-scenario { padding: 32px 24px; } }
@media (max-width: 639px) { .tour-scenario { padding: 24px 16px; } }
```

**Step 3:** 빌드 + 모바일 체크

**Step 4:** 커밋

```bash
git add tour/src/styles/app.css
git commit -m "style(tour): Quickstart 반응형 breakpoint 보완"
```

### Task 6.3 — 접근성 회귀 체크

**Files:** 없음 (테스트만)

**Step 1:** 키보드 네비게이션

- Landing Hero CTA → Tab으로 "투어 시작하기" → "다운로드" 순서
- Quickstart `← →` 화살표 동작
- 버튼 focus-visible outline 확인

**Step 2:** 스크린리더 (NVDA 또는 VoiceOver 시뮬)

- Hero h1 "DabitOne." 읽힘
- Manifesto 다크 섹션 텍스트 읽힘
- Quickstart 카드 num/name/desc 모두 읽힘
- LiveRegion step 변경 발화

**Step 3:** `prefers-reduced-motion: reduce` 상태에서 픽셀 모션·ripple·reveal 모두 멈춤

**Step 4:** 문제 있으면 수정 후 커밋. 없으면 skip.

---

## Phase 7 — 시각 회귀 + 최종 검증 (1시간)

### Task 7.1 — shot-landing 재실행 + 베이스라인 비교

**Files:** 없음 (실행만)

**Step 1:** 새 스크린샷

```bash
npm run build
npx http-server public -p 8888 -s &
sleep 2
node scripts/shot-landing.mjs
```

Expected: `verify-compare/landing/*.png` 생성 (새 버전)

**Step 2:** 베이스라인 (`verify-compare/baseline-before/`)과 나란히 놓고 육안 검토. 시각 회귀 없는지, 의도한 변경만 반영됐는지.

**Step 3:** 이슈 발견 시 해당 Phase로 돌아가 수정 후 재실행. 없으면 다음.

### Task 7.2 — verify-hotspots 재실행

**Files:** 없음 (실행만)

**Step 1:**

```bash
npm run verify:hotspots
```

Expected: 64장(8 투어 × 최대 8 스텝) PNG 생성. 모든 hotspot 점이 이미지의 맞는 UI 요소 위에 위치.

**Step 2:** 어긋나는 것 있으면 `tour/data/quickstart/<slug>.ts` 좌표 수정 후 재빌드·재실행

### Task 7.3 — Lighthouse 측정

**Files:** 없음

**Step 1:** Chrome DevTools Lighthouse → Performance + Accessibility + Best Practices

Expected:
- Performance ≥ 90 (픽셀 모션 RAF가 main thread 안 막는지)
- Accessibility ≥ 95
- Best Practices ≥ 95

**Step 2:** 문제 있으면 개별 이슈 해결

### Task 7.4 — 최종 커밋 + PR 준비

**Files:** 없음

**Step 1:** 상태 점검

```bash
git -C D:/GitHub/dabitone-manual-tour-redesign log --oneline -30
git -C D:/GitHub/dabitone-manual-tour-redesign status
```

Expected: 모든 Task 커밋 누적, working tree clean

**Step 2:** PR 생성 (사용자 확인 후)

```bash
git push -u origin feature/tour-redesign
gh pr create --title "feat(tour): 풀 리디자인 — 모노크롬 + 픽셀 모션 + 다크 반전" ...
```

**Step 3:** PR merge 후 워크트리 정리

```bash
cd D:/GitHub/dabitone-manual
git worktree remove D:/GitHub/dabitone-manual-tour-redesign
git branch -d feature/tour-redesign
```

---

## 예상 소요

| Phase | 소요 | 커밋 수 |
|---|---|---|
| 0 베이스라인 | 30분 | 0~1 |
| 1 토큰·폰트 | 1시간 | 4 |
| 2 컴포넌트 CSS | 1.5시간 | 3 |
| 3 픽셀 모션 | 2시간 | 2 |
| 4 Landing 재구성 | 3시간 | 5 |
| 5 Quickstart 업데이트 | 2시간 | 4 |
| 6 반응형·접근성 | 1시간 | 2 |
| 7 검증·PR | 1시간 | 0~1 |
| **합계** | **12시간** | **~21 커밋** |

## 롤백 계획

각 Task가 독립 커밋이라 문제 있는 Task만 `git revert <SHA>` 가능. 전체 되돌리려면 `feature/tour-redesign` 브랜치 폐기 후 main에서 재시작.

## 오픈 이슈 (구현 중 발견 시 대응)

1. **픽셀 모션 성능**: 저사양에서 30fps 미달 시 `spacing: 16` 또는 `SVG 정적` 폴백
2. **폰트 번들**: 2MB 크면 Inter 제외하고 시스템 폰트 폴백
3. **Feature visual slot 비어 있음**: MVP 후 미니멀 SVG 아이콘 도입 검토
