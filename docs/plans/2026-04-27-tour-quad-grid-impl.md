# /tour 4분할 그리드 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** /tour 페이지의 HorizontalFeatures 가로 스크롤 섹션을 정적 2x2 풀-블리드 그라디언트 4분할 그리드로 교체.

**Architecture:** PANELS(F01~F04) 데이터는 유지. sticky/wheel/scroll 로직 전부 제거. 새 QuadGrid 컴포넌트가 IntersectionObserver 기반 fade-in entrance만 갖는다. CSS는 풀-블리드 그라디언트 + SVG turbulence noise grain inline.

**Tech Stack:** Preact, TypeScript, CSS, esbuild (build-tour.mjs), Quartz

**Reference:** `docs/plans/2026-04-27-tour-quad-grid-design.md` (commit 13c5ac8)

**Note on TDD:** 이 작업은 시각/UX 변경이라 unit test 비효율. typecheck + build + Playwright screenshot으로 자율 검증. verification-before-completion 원칙 적용.

---

## Task 1: hybrid.css 가로 스크롤 스타일 제거 + `.tour11-quad*` 추가

**Files:**
- Modify: `tour/src/styles/hybrid.css`

**Step 1: 제거**

다음 셀렉터 블록 모두 삭제 (가로 스크롤 관련 전부):
- `.tour11-horizontal`, `.tour11-horizontal__sticky`, `.tour11-horizontal__track`, `.tour11-horizontal__progress`, `.tour11-horizontal__progress-bar`
- `.tour11-horizontal__snap-stop`, `.tour11-horizontal__snap-stop--{0,1,2,3}`
- `.tour11-panel`, `.tour11-panel__text`, `.tour11-panel__label`, `.tour11-panel__title`, `.tour11-panel__body`

**Step 2: 추가**

파일 끝에 다음 추가:

```css
/* =========================================================================
   Quad Grid — 정적 2x2 풀-블리드 그라디언트 (HorizontalFeatures 대체)
   ========================================================================= */

.tour11-quad {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  max-width: 1280px;
  margin: 0 auto;
  padding: 96px 24px;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .tour11-quad {
    grid-template-columns: 1fr;
    padding: 64px 16px;
  }
}

.tour11-quad__card {
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 24px;
  display: flex;
  align-items: flex-end;
  padding: 48px;
  box-sizing: border-box;
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity 600ms ease-out,
    transform 600ms ease-out;
}

.tour11-quad__card.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .tour11-quad__card {
    padding: 32px;
  }
}

.tour11-quad__card--blue {
  background: linear-gradient(135deg, #0c4a6e 0%, #075985 100%);
}
.tour11-quad__card--purple {
  background: linear-gradient(135deg, #3b0764 0%, #581c87 100%);
}
.tour11-quad__card--teal {
  background: linear-gradient(135deg, #134e4a 0%, #115e59 100%);
}
.tour11-quad__card--charcoal {
  background: linear-gradient(135deg, #1c1917 0%, #292524 100%);
}

/* SVG turbulence noise grain overlay */
.tour11-quad__card::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.05 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  background-size: 200px 200px;
  opacity: 0.5;
  pointer-events: none;
}

.tour11-quad__text {
  position: relative;
  z-index: 1;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tour11-quad__label {
  margin: 0;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.6);
}

.tour11-quad__title {
  margin: 0;
  font-family: "Pretendard Variable", sans-serif;
  font-size: clamp(28px, 3vw, 44px);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: #fff;
  white-space: pre-line;
}

.tour11-quad__body {
  margin: 0;
  font-family: "Pretendard Variable", sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.75);
}

@media (prefers-reduced-motion: reduce) {
  .tour11-quad__card {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

**Step 3: prettier check**

Run: `cd D:/GitHub/dabitone-manual-tour-redesign && npx prettier tour/src/styles/hybrid.css --check`
Expected: `tour/src/styles/hybrid.css` 한 줄 후 종료 코드 0

(commit은 Task 2 끝나고 — CSS만 적용하면 화면 깨짐)

---

## Task 2: LandingHybrid.tsx의 HorizontalFeatures → QuadGrid 교체

**Files:**
- Modify: `tour/src/pages/LandingHybrid.tsx`

**Step 1: HorizontalFeatures + PanelCard 함수 삭제**

`tour/src/pages/LandingHybrid.tsx:144-342` (HorizontalFeatures 섹션 주석부터 PanelCard 함수 끝까지) 모두 삭제.

**Step 2: QuadGrid + QuadCard 함수 추가**

같은 위치에 다음 추가:

```tsx
/* =========================================================================
   QuadGrid — 정적 2x2 풀-블리드 그라디언트 4분할
   ========================================================================= */

const QUAD_COLORS = ["blue", "purple", "teal", "charcoal"] as const

function QuadGrid() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const cards = Array.from(root.querySelectorAll<HTMLElement>(".tour11-quad__card"))
    if (cards.length === 0) return

    if (reducedMotion()) {
      cards.forEach((c) => c.classList.add("is-visible"))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const idx = cards.indexOf(entry.target as HTMLElement)
          const stagger = idx >= 0 ? idx * 80 : 0
          window.setTimeout(() => {
            ;(entry.target as HTMLElement).classList.add("is-visible")
          }, stagger)
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    )

    cards.forEach((c) => observer.observe(c))
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="features"
      class="tour11-quad"
      ref={ref}
      aria-label="DabitOne 핵심 기능 4가지"
    >
      {PANELS.map((p, i) => (
        <QuadCard key={p.num} panel={p} colorIdx={i} />
      ))}
    </section>
  )
}

function QuadCard({ panel, colorIdx }: { panel: Panel; colorIdx: number }) {
  const color = QUAD_COLORS[colorIdx % QUAD_COLORS.length]
  return (
    <article class={`tour11-quad__card tour11-quad__card--${color}`}>
      <div class="tour11-quad__text">
        <p class="tour11-quad__label">{panel.label}</p>
        <h2 class="tour11-quad__title">{panel.title}</h2>
        {panel.lines.map((line, i) => (
          <p key={i} class="tour11-quad__body">
            {line}
          </p>
        ))}
      </div>
    </article>
  )
}
```

**Step 3: `<HorizontalFeatures />` 호출 → `<QuadGrid />`**

`tour/src/pages/LandingHybrid.tsx:28` 부근의 `<HorizontalFeatures />`를 `<QuadGrid />`로 교체.

**Step 4: 사용 안 하는 import 제거**

`useState`가 다른 곳에서 사용 안 되면 삭제. `useRef`, `useEffect`, `reducedMotion`은 QuadGrid에서 사용.

확인: `grep -n "useState" tour/src/pages/LandingHybrid.tsx` — 다른 곳에서도 안 쓰면 import에서 제거.

**Step 5: typecheck**

Run: `cd D:/GitHub/dabitone-manual-tour-redesign && npx tsc --noEmit`
Expected: errors 0

**Step 6: build:tour**

Run: `cd D:/GitHub/dabitone-manual-tour-redesign && npm run build:tour`
Expected: `[build-tour] done in <1500ms`

---

## Task 3: full build + Playwright 자율 검증 (desktop + mobile)

**Files:**
- Create: `scripts/verify-quad.mjs`

**Step 1: full build**

Run: `cd D:/GitHub/dabitone-manual-tour-redesign && npm run build`
Expected: `Emitted 136 files`

**Step 2: Playwright 스크립트 작성**

Create `scripts/verify-quad.mjs`:

```js
import { chromium } from "playwright"
import { mkdirSync } from "node:fs"

mkdirSync("tmp", { recursive: true })
const browser = await chromium.launch()
const viewports = [
  ["desktop", { width: 1440, height: 900 }],
  ["mobile", { width: 375, height: 812 }],
]

for (const [name, viewport] of viewports) {
  const ctx = await browser.newContext({ viewport })
  const page = await ctx.newPage()
  await page.goto("http://localhost:8888/tour/", { waitUntil: "networkidle" })
  await page.waitForFunction(
    () => document.querySelectorAll(".tour11-quad__card").length === 4,
    { timeout: 5000 },
  )
  await page.locator("#features").scrollIntoViewIfNeeded()
  await page.waitForTimeout(900) // entrance stagger 80ms × 4 + transition 600ms
  await page.screenshot({ path: `tmp/quad-${name}.png`, fullPage: true })
  const cardCount = await page.locator(".tour11-quad__card").count()
  const visibleCount = await page.locator(".tour11-quad__card.is-visible").count()
  console.log(`${name}: ${cardCount} cards, ${visibleCount} visible`)
  await ctx.close()
}
await browser.close()
console.log("done")
```

**Step 3: 실행**

Run: `cd D:/GitHub/dabitone-manual-tour-redesign && node scripts/verify-quad.mjs`
Expected:
- `desktop: 4 cards, 4 visible`
- `mobile: 4 cards, 4 visible`
- `done`
- `tmp/quad-desktop.png` + `tmp/quad-mobile.png` 생성

**Step 4: 스크린샷 시각 확인**

`tmp/quad-desktop.png` Read tool로 보고 다음 확인:
- 2x2 정사각 그리드
- 4개 카드 각 컬러: F01 blue, F02 purple, F03 teal, F04 charcoal
- 텍스트 좌하단 정렬, label 작게/title 크게/body 작게
- noise grain 보임 (지나치게 진하지 않음)

`tmp/quad-mobile.png` Read tool로 보고 1열 stack 4 카드 확인.

**Step 5: 사용자에게 시각 확인 요청**

지나치게 진한 noise, 컬러 매핑 어색, 카드 크기 비례 같은 부분이 눈에 띄면 사용자 의견 받기.

---

## Task 4: Commit

**Step 1: stage**

Run:
```
cd D:/GitHub/dabitone-manual-tour-redesign
git add tour/src/styles/hybrid.css tour/src/pages/LandingHybrid.tsx quartz/static/tour/tour.css quartz/static/tour/tour.js
```

**Step 2: commit**

```
git commit -m "$(cat <<'EOF'
feat(tour): HorizontalFeatures 가로 스크롤 → 2x2 풀-블리드 그라디언트 그리드

LandingHybrid 가운데 4-feature 섹션을 정적 2x2 정사각 카드 그리드로 교체.
sticky 400vh + wheel-snap 가로 스크롤 로직 전부 제거. 카드 = deep cool
컬러 그라디언트(blue/purple/teal/charcoal) + SVG turbulence noise grain.
좌하단 텍스트 정렬, IntersectionObserver 기반 진입 fade-in stagger 80ms.
Hover 없음.

Design: docs/plans/2026-04-27-tour-quad-grid-design.md (13c5ac8)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

Expected: `[feature/tour-redesign <hash>] feat(tour): ...`

**Step 3: scripts/verify-quad.mjs는 untracked로 둠** (디버깅 자산, 추후 사용자 결정)

---

## 완료 후 확인

- [ ] `git log --oneline -3`에 새 commit 보임
- [ ] `git status --short` 깨끗 (untracked는 verify-quad.mjs, tmp/quad-*.png 정도)
- [ ] localhost:8888/tour/ 에 4분할 그리드 정상 렌더
