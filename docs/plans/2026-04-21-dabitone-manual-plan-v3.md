# DabitONe 매뉴얼 사이트 구현 계획 v3 (체험형 투어 피벗)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 기존 Quartz 기반 reference 매뉴얼(v2)을 유지하되, 랜딩과 Quickstart 8개 시나리오를 Apple 홈페이지 수준의 감각적 인터랙티브 투어(`/tour/*`)로 재구성한다. Reference/Troubleshooting/File Formats는 markdown 유지 + PDF 생성 대상으로 한정한다.

**Architecture:** Quartz v4를 기반으로 유지하되, `/tour/*` 경로에 Preact SPA를 임베드한다. 투어 앱은 Quartz의 기존 Preact 스택을 공유하므로 별도 번들러 불필요. 투어 앱 내부는 scroll-driven cinematic animation(Motion One + Lenis smooth scroll + CSS container queries)로 구성하고, 상태는 URL(History API)과 localStorage로 양방향 동기화. 투어 각 스텝은 JSON/TS 데이터 모델로 정의되어 hot-reload 가능. 기존 markdown 페이지와 투어는 양방향 cross-link된다. PDF 생성은 `/tour/*` 제외, reference 영역만 챕터 분할.

**Tech Stack:**
- **SSG**: Quartz v4 (유지) — Preact + esbuild
- **Tour App**: Preact 10 + TypeScript (Quartz 스택 공유)
- **Animation**: Motion One 11 (framework-agnostic, ~3.5KB), Lenis(smooth scroll), CSS `@starting-style`/container queries
- **Routing**: History API + 경량 라우터 (`wouter-preact` 또는 자작)
- **State**: Preact Signals + URL as source of truth
- **Screenshots**: Phase 3 capture mode(자동) + PoC 수동 캡처(즉시)
- **Typography**: Pretendard Variable (self-host, 기존 유지) + 디스플레이 전용 weight 확대

---

## v2 → v3 주요 변경 (대화 피벗 반영)

사용자 피드백(2026-04-21): v2의 reference 매뉴얼 스타일은 docs.dabitsol.com과 결이 유사하여 DabitONe 매뉴얼만의 체험형 가치를 충분히 못 살림. Apple 홈페이지 수준의 감각적 인터랙션(SVG hotspot + cinematic scroll + 딥링크 투어) 채택.

| 항목 | v2 | v3 |
|------|----|-----|
| 랜딩 | markdown index + 빠른 탐색 링크 | **Apple-style cinematic 투어** (hero → 5개 탭 섹션 → PDF 다운로드) |
| Quickstart 01~08 | markdown 8 페이지 | **Preact 투어 앱 1개** (8 시나리오, 각 3~5 스텝) |
| UI Reference | markdown 5그룹 | **유지** (reference 성격 그대로) |
| File Formats | markdown 6종 | **유지** |
| Troubleshooting | markdown 4+FAQ | **유지** |
| PDF | 3권 분할 (설치·콘텐츠·운영) | **2권 분할** (Reference / Troubleshooting+File Format) — Quickstart 투어는 PDF 제외 |
| 검색 | Quartz 기본 | Quartz 기본 + 투어 내부 스텝 검색(선택) |

---

## 디자인 방향성 (Apple-style, 감각적)

랜딩·투어 전반에 적용할 원칙. 구현 세부는 Phase R1 Task에서 구체화.

### 1. 타이포그래피

- Hero 헤드라인: Pretendard Variable, **80~120px**, weight 700, letter-spacing -0.03em
- 섹션 제목: 48~64px, weight 600
- 본문: 18~21px, line-height 1.6
- 코드/UI 라벨: JetBrains Mono, 16~18px

### 2. 레이아웃

- **섹션당 100vh 이상** — 스크롤 한 스와이프 = 한 장면
- **좌우 여백 120px+** (데스크톱), 큰 스크린에서 max-width 1440
- **아래로 펼쳐지는 스토리** — 수직 스토리텔링

### 3. 모션 원칙

- 기본 easing: `cubic-bezier(0.22, 1, 0.36, 1)` (apple-like "emphasized out")
- duration: 400ms(마이크로), 700ms(전환), 1200ms(히어로)
- **scroll-linked**: 스크롤 진행도 0~1이 애니메이션 타임라인과 1:1 대응
- **section lock**: 중요 섹션은 스크롤 잠금(sticky + translateY) — Apple iPhone 페이지 방식
- **staggered reveal**: 자식 요소 80ms 간격 cascade

### 4. 색감

- 베이스: 라이트 `#FFFFFF` / 다크 `#0A0A0A`
- 텍스트: `#1D1D1F` (라이트), `#F5F5F7` (다크)
- 액센트: DabitChe 블루 `#2563EB` (단, 포인트 컬러로만)
- 섹션 배경 전환: 라이트 → 연회색 → 다크 섹션 → 다시 라이트

### 5. 핫스팟 상호작용

- **idle 상태**: 반투명 원 + 4초 주기 pulse
- **hover**: 120% scale, blur(4px) backdrop behind popover
- **click**: 팝오버 센터에서 등장 + 뒷배경 darken(0.6 opacity, 300ms)
- **popover**: max-width 420px, rounded-2xl, shadow-2xl, Pretendard 17~19px

### 6. 애니메이션 금지 목록

- 회전(rotate) 남용 — 하드웨어 느낌 해침
- bouncy spring (초과 감쇠) — Apple은 거의 안 씀
- 무한 loop 애니 (pulse 제외) — 집중 방해
- parallax 과다 (수평 패럴럭스 금지, 수직 subtle만)

### 7. 접근성

- 키보드 포커스: 3px outline, 액센트 색
- `prefers-reduced-motion`: 모든 모션 ≤ 100ms, scroll lock 해제
- 핫스팟 alt text 필수
- 스크린 리더용 대체 경로: `/tour/accessible` (순수 텍스트 버전)

### 참조 사이트

- apple.com/iphone — hero + section lock + product 360 (기술적 상한)
- linear.app — 타이포·여백·다크 섹션 전환
- framer.com/motion — 마이크로 인터랙션
- vercel.com — 코드 예시 블록 스타일
- stripe.com/sessions — 스크롤 스토리텔링

---

## 확정된 아키텍처 결정

### 프레임워크 (Q1)

**Preact 10** 채택. 근거: Quartz가 이미 Preact 사용 → 번들러·tsconfig 공유, 추가 런타임 없음. Apple-style 복잡 애니는 Preact+Motion One 조합으로 충분하며, 실제 DOM 노드 수는 단일 페이지 당 수십 개 수준이라 React 생태계 필요성 낮음.

### 01-first-connection.md 처리 (Q2)

**소스 원본 보존** 전략:
- `content/quickstart/01-first-connection.md` 그대로 유지 (현재 main에 배포됨)
- 파일 frontmatter에 `legacy: true` 추가 → `ignorePatterns` 통해 사이트 맵/검색에서 제외
- 투어 스텝 데이터(JSON) 작성 시 이 페이지의 XAML 검증·토스트 색상·기본값을 복붙 소스로 활용
- 투어 완성 후 Phase R7에서 이 URL에 `/tour/quickstart/01`로 meta refresh redirect

### 스크린샷 (Q3)

**수동 PoC + Phase 3 병행**:
- 즉시: DabitONe 실행 → 주요 5창(통신·설정·전송·편집·고급) 수동 캡처, PNG 원본 `content/assets/screens/manual-poc/` 저장
- 해상도: 1920×1080 이상, 2배 DPI 권장 (Retina 대응)
- 병행: Phase 3 (DabitChe.Desktop `CaptureModeService`) 진행 → 완성 후 자동 갱신 파이프라인 교체

### Quartz 통합 방식 (R1.5에서 확정)

후보 3가지 중 택일(Task R1.5 스파이크):

- **(a) Custom layout**: `content/tour.md` 특수 frontmatter `layout: tour-app` → `quartz.layout.ts`의 커스텀 레이아웃이 Preact tour root 렌더링. 가장 통합적이지만 Quartz 코어 수정 필요.
- **(b) Custom emitter**: 새 emitter가 `/tour/index.html` 직접 빌드, Quartz content 파이프라인 우회. 깔끔하지만 Quartz 네비/헤더 공유 어려움.
- **(c) Static asset embed**: `quartz/static/tour/` 에 사전 빌드된 SPA 번들 배치, markdown 페이지가 `<script>` 태그로 포함. 가장 단순, 별도 빌드 스크립트 필요.

**잠정**: (a) 우선 시도, 실패 시 (c) fallback.

---

## Phase 개요

| Phase | 목적 | 산출물 | 소요 추정 |
|-------|------|--------|----------|
| **R0. 정리 · 수동 캡처** | v2 잔여 정리, 01 legacy 표시, 수동 스크린샷 5장 | 깨끗한 배포 상태, 투어 자산 초안 | 0.5일 |
| **R1. 투어 앱 foundation** | Preact 스택·라우터·모션·데이터 스키마·Quartz 통합 | `/tour` 라우트 최소 페이지 동작 | 2일 |
| **R2. 랜딩 cinematic 투어** | Apple-style 랜딩 — hero + 5섹션 스크롤 스토리 + 핫스팟 | 랜딩 배포, 5탭 설명 popover | 2일 |
| **R3. Quickstart 투어 01~08** | 8 시나리오 각 3~5 스텝 인터랙티브 | 완전한 투어 체험 | 3일 |
| **R4. Reference markdown** | UI Reference·Troubleshoot·File Format 본문 | markdown 본문 완성 | 3일 |
| **R5. PDF (Reference만)** | build-pdf.mjs 수정, 2권 분할 | 2권 PDF | 0.5일 |
| **R6. Cross-link + 상호참조** | 투어 ↔ markdown 양방향 딥링크 | 완전 연동 | 0.5일 |
| **R7. QA & cutover** | 접근성·모바일·SEO·성능·PR merge | main 배포 | 1일 |

**총 ~12.5일 (AI 단독 작업 기준)**

---

## Phase R0 — 정리 · 수동 캡처

### Task R0.1: 플랜 v3 커밋

**Files:**
- Create: `D:\GitHub\dabitone-manual\docs\plans\2026-04-21-dabitone-manual-plan-v3.md` (이미 작성됨)

**Step 1: 커밋**

```bash
git -C D:/GitHub/dabitone-manual add docs/plans/2026-04-21-dabitone-manual-plan-v3.md
git -C D:/GitHub/dabitone-manual commit -m "docs: plan v3 — 체험형 투어 피벗 (Preact + Apple-style)"
git -C D:/GitHub/dabitone-manual push origin main
```

---

### Task R0.2: 01-first-connection.md legacy 표시

**Files:**
- Modify: `content/quickstart/01-first-connection.md` (frontmatter에 `legacy: true` 추가)
- Modify: `quartz.config.ts` (ignorePatterns에 `legacy` frontmatter 필터 추가 — RemoveDrafts 패턴 참조)

**Step 1: frontmatter 업데이트**

```markdown
---
title: 컨트롤러 최초 연결 (레거시)
description: "투어 앱으로 대체 예정 — /tour/quickstart/01"
last_updated: 2026-04-21
legacy: true
draft: true
---
```

**Step 2: `draft: true`가 Quartz 기본 RemoveDrafts 필터로 이미 빌드 제외됨을 확인**

**Step 3: 커밋 + 푸시**

```bash
git -C D:/GitHub/dabitone-manual add content/quickstart/01-first-connection.md
git -C D:/GitHub/dabitone-manual commit -m "chore(content): 01 페이지 draft 처리 — 투어 앱 대체 대기"
git -C D:/GitHub/dabitone-manual push origin main
```

---

### Task R0.3: 수동 스크린샷 캡처 5장

**사용자 수행:**

1. DabitChe.Desktop 실행 (mock 환경 또는 실제 연결)
2. 각 탭 순회 캡처 — 화면 크기 1920×1080 고정, Windows 스냅샷(Win+Shift+S) 또는 ShareX
3. 저장: `D:\GitHub\dabitone-manual\content\assets\screens\manual-poc\`
   - `main-comm.png` — 통신 탭 (기본 시작 화면)
   - `main-setup.png` — 설정 탭
   - `main-simulator.png` — 전송 탭
   - `main-editor.png` — 편집 탭
   - `main-advanced.png` — 고급 탭
4. 각 최소 200KB, PNG 무손실

**완료 기준:** 5장 PNG 준비, 해상도 1920×1080 이상

**Step: 커밋**

```bash
git -C D:/GitHub/dabitone-manual add content/assets/screens/manual-poc/
git -C D:/GitHub/dabitone-manual commit -m "feat(content): 수동 PoC 스크린샷 5장 (투어 랜딩용)"
git -C D:/GitHub/dabitone-manual push origin main
```

---

## Phase R1 — 투어 앱 foundation

### Task R1.1: 디렉토리 구조 + 의존성

**Files:**
- Create: `tour/` (투어 앱 소스 루트)
- Create: `tour/src/index.tsx`
- Create: `tour/src/types.ts`
- Create: `tour/data/tours.ts` (투어 데이터)
- Modify: `package.json` (devDependencies 추가)

**Step 1: 디렉토리 구조**

```
tour/
├── src/
│   ├── index.tsx         # SPA 엔트리
│   ├── App.tsx           # 최상위 라우팅
│   ├── components/
│   │   ├── Hotspot.tsx
│   │   ├── Popover.tsx
│   │   ├── StepNav.tsx
│   │   ├── ProgressBar.tsx
│   │   └── Hero.tsx
│   ├── pages/
│   │   ├── Landing.tsx
│   │   └── TourScenario.tsx
│   ├── lib/
│   │   ├── motion.ts     # Motion One wrapper
│   │   ├── router.ts     # History API 기반 라우팅
│   │   └── storage.ts    # localStorage 진행률
│   └── styles/
│       ├── tokens.css
│       ├── reset.css
│       └── app.css
├── data/
│   ├── landing.ts        # 랜딩 핫스팟 데이터
│   └── quickstart/
│       ├── 01-first-connection.ts
│       ├── 02-screen-size.ts
│       └── ... (08까지)
└── tsconfig.json
```

**Step 2: 의존성 설치**

```bash
cd D:/GitHub/dabitone-manual
npm install --save motion lenis
npm install --save-dev @types/node
```

> Preact는 Quartz가 이미 설치. `motion`은 Motion One 패키지명.

**Step 3: `tour/tsconfig.json` 작성**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "jsxImportSource": "preact",
    "strict": true,
    "types": ["node"],
    "paths": {
      "react": ["../node_modules/preact/compat"],
      "react-dom": ["../node_modules/preact/compat"]
    }
  },
  "include": ["src/**/*", "data/**/*"]
}
```

**Step 4: `tour/src/types.ts`**

```typescript
export interface TourStep {
  id: string;
  title: string;
  description: string;
  hotspot?: { x: number; y: number; label: string };
  screenshot: string;
  tips?: string[];
  nextHint?: string;
}

export interface Tour {
  slug: string;
  title: string;
  subtitle: string;
  steps: TourStep[];
  nextTour?: string;
}

export interface LandingHotspot {
  id: string;
  x: number;
  y: number;
  label: string;
  summary: string;
  tourSlug: string;
}

export interface LandingData {
  hero: {
    title: string;
    subtitle: string;
    heroImage: string;
  };
  hotspots: LandingHotspot[];
}
```

**Step 5: 커밋**

```bash
git add tour/ package.json package-lock.json
git commit -m "feat(tour): foundation — Preact + Motion One + 타입 스키마"
git push origin main
```

---

### Task R1.2: Motion One wrapper + Lenis smooth scroll

**Files:**
- Create: `tour/src/lib/motion.ts`

**Step 1: Motion 래퍼 작성**

```typescript
import { animate as motionAnimate, timeline as motionTimeline } from "motion";

export const EASE = "cubic-bezier(0.22, 1, 0.36, 1)"; // Apple emphasized out

export const DUR = {
  micro: 0.4,
  transition: 0.7,
  hero: 1.2,
} as const;

export function reducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function animate(
  target: Element | Element[],
  keyframes: Record<string, unknown>,
  options: { duration?: number; delay?: number; easing?: string } = {},
) {
  if (reducedMotion()) {
    return motionAnimate(target, keyframes, { duration: 0.1 });
  }
  return motionAnimate(target, keyframes, {
    duration: options.duration ?? DUR.transition,
    delay: options.delay ?? 0,
    easing: options.easing ?? EASE,
  });
}

export function stagger(baseDelay: number, gap = 0.08) {
  return (i: number) => baseDelay + i * gap;
}
```

**Step 2: Lenis smooth scroll 초기화**

```typescript
// tour/src/lib/smoothScroll.ts
import Lenis from "lenis";

export function initSmoothScroll() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  return lenis;
}
```

**Step 3: 커밋**

```bash
git add tour/src/lib/
git commit -m "feat(tour): Motion One 래퍼 + Lenis smooth scroll"
```

---

### Task R1.3: 디자인 토큰 CSS

**Files:**
- Create: `tour/src/styles/tokens.css`

**Step 1: Apple-like 토큰 정의**

```css
:root {
  /* Typography */
  --font-display: "Pretendard Variable", -apple-system, BlinkMacSystemFont, sans-serif;
  --font-body: "Pretendard Variable", -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --fs-hero: clamp(48px, 8vw, 120px);
  --fs-title: clamp(32px, 4.5vw, 64px);
  --fs-section: clamp(24px, 3vw, 40px);
  --fs-body: clamp(17px, 1.3vw, 21px);
  --fs-small: 15px;

  --lh-tight: 1.05;
  --lh-normal: 1.6;
  --ls-tight: -0.03em;
  --ls-display: -0.025em;

  /* Colors (라이트) */
  --c-bg: #ffffff;
  --c-bg-soft: #f5f5f7;
  --c-bg-dark: #0a0a0a;
  --c-text: #1d1d1f;
  --c-text-soft: #515154;
  --c-text-dark: #f5f5f7;
  --c-accent: #2563eb;
  --c-accent-soft: rgba(37, 99, 235, 0.12);
  --c-line: rgba(0, 0, 0, 0.08);

  /* Motion */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.83, 0, 0.17, 1);
  --dur-micro: 400ms;
  --dur-trans: 700ms;
  --dur-hero: 1200ms;

  /* Spacing */
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 40px;
  --space-5: 64px;
  --space-6: 96px;
  --space-7: 160px;

  /* Radii */
  --r-sm: 6px;
  --r-md: 12px;
  --r-lg: 20px;
  --r-2xl: 32px;

  /* Shadows */
  --shadow-pop: 0 20px 48px rgba(0, 0, 0, 0.16), 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-hero: 0 40px 100px rgba(0, 0, 0, 0.12);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Step 2: 커밋**

```bash
git add tour/src/styles/tokens.css
git commit -m "feat(tour): Apple-style 디자인 토큰 CSS"
```

---

### Task R1.4: 핵심 컴포넌트 — Hotspot + Popover

**Files:**
- Create: `tour/src/components/Hotspot.tsx`
- Create: `tour/src/components/Popover.tsx`

**Step 1: `Hotspot.tsx` — pulse ring + click 핸들러**

```tsx
import { useEffect, useRef, useState } from "preact/hooks";
import { animate } from "../lib/motion";

interface Props {
  x: number;
  y: number;
  label: string;
  onClick: () => void;
}

export function Hotspot({ x, y, label, onClick }: Props) {
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!ringRef.current) return;
    // 4초 주기 pulse
    const id = setInterval(() => {
      if (!ringRef.current) return;
      animate(
        ringRef.current,
        { scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] },
        { duration: 1.6, easing: "ease-out" },
      );
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <button
      class="hotspot"
      style={{ left: `${x}%`, top: `${y}%` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      aria-label={label}
    >
      <span class="hotspot__ring" ref={ringRef} />
      <span class="hotspot__dot" />
      {hovered && <span class="hotspot__label">{label}</span>}
    </button>
  );
}
```

**Step 2: `Popover.tsx` — centered modal with backdrop blur**

```tsx
import { useEffect, useRef } from "preact/hooks";
import { animate } from "../lib/motion";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: preact.ComponentChildren;
  cta?: { label: string; href: string };
}

export function Popover({ open, onClose, title, children, cta }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !backdropRef.current || !cardRef.current) return;
    animate(backdropRef.current, { opacity: [0, 1] }, { duration: 0.3 });
    animate(
      cardRef.current,
      { opacity: [0, 1], transform: ["scale(0.94)", "scale(1)"] },
      { duration: 0.5, delay: 0.08 },
    );
  }, [open]);

  if (!open) return null;

  return (
    <div class="popover__backdrop" ref={backdropRef} onClick={onClose}>
      <div
        class="popover__card"
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h3 class="popover__title">{title}</h3>
        <div class="popover__body">{children}</div>
        {cta && (
          <a class="popover__cta" href={cta.href}>
            {cta.label} →
          </a>
        )}
      </div>
    </div>
  );
}
```

**Step 3: CSS 추가 `tour/src/styles/app.css`** (Hotspot·Popover 스타일)

```css
/* Hotspot */
.hotspot {
  position: absolute;
  transform: translate(-50%, -50%);
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
}
.hotspot__dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--c-accent);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.25);
  z-index: 2;
}
.hotspot__ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid var(--c-accent);
  opacity: 0;
  z-index: 1;
}
.hotspot__label {
  position: absolute;
  top: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: var(--fs-small);
  background: var(--c-text);
  color: var(--c-bg);
  padding: 6px 12px;
  border-radius: var(--r-sm);
  font-weight: 500;
}

/* Popover */
.popover__backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
  display: grid;
  place-items: center;
  z-index: 100;
  opacity: 0;
}
.popover__card {
  background: var(--c-bg);
  border-radius: var(--r-2xl);
  padding: var(--space-5);
  max-width: 420px;
  box-shadow: var(--shadow-pop);
  opacity: 0;
  transform: scale(0.94);
}
.popover__title {
  font-size: var(--fs-section);
  letter-spacing: var(--ls-tight);
  margin: 0 0 var(--space-2);
}
.popover__body {
  font-size: var(--fs-body);
  line-height: var(--lh-normal);
  color: var(--c-text-soft);
}
.popover__cta {
  display: inline-block;
  margin-top: var(--space-3);
  font-weight: 600;
  color: var(--c-accent);
  text-decoration: none;
}
.popover__cta:hover {
  text-decoration: underline;
}
```

**Step 4: 커밋**

```bash
git add tour/src/components/ tour/src/styles/app.css
git commit -m "feat(tour): Hotspot + Popover 컴포넌트 + Apple-style CSS"
```

---

### Task R1.5: Quartz 통합 — 3가지 방식 스파이크 + 결정

**Files:**
- Create: `docs/decisions/006-tour-app-integration.md`

**Step 1: 세 방식 모두 PoC 시도 (각 30분 이내)**

- (a) Custom layout — `quartz.layout.ts` 조사, `content/tour.md` frontmatter로 layout 지정 시도
- (b) Custom emitter — `quartz/plugins/emitters/` 기존 emitter 구조 파악 후 TourEmitter 작성
- (c) Static asset — `quartz/static/tour/index.html`에 사전 빌드 SPA 배치

**Step 2: 기록 문서 `006-tour-app-integration.md`**

템플릿:
```markdown
# ADR-006: 투어 앱 Quartz 통합 방식

## 후보
(a) Custom layout / (b) Custom emitter / (c) Static asset embed

## 시도 결과
...

## 선택: (N)
이유: ...

## 트레이드오프
...
```

**Step 3: 선택안 구현 (별도 Task로 이어짐)**

**Step 4: 커밋**

```bash
git add docs/decisions/006-tour-app-integration.md
git commit -m "docs: ADR-006 투어 앱 Quartz 통합 방식 결정"
```

---

### Task R1.6: `/tour` 최소 경로 동작

**Files:**
- Create 또는 Modify (R1.5 결정에 따라): 투어 SPA 엔트리 + Quartz 연결

**Step 1: 최소 Hello World 페이지 `/tour`**

Landing.tsx가 "DabitONe 투어" 헤드라인만 표시.

**Step 2: 로컬 빌드 + 확인**

```bash
cd D:/GitHub/dabitone-manual
npx quartz build --serve
# → http://localhost:8080/tour 접속 시 헤드라인 렌더
```

**Step 3: 커밋 + 푸시 → 실제 URL 확인**

```bash
git add .
git commit -m "feat(tour): /tour 경로 최소 페이지 배포"
git push origin main
# → https://dabitone.dabitsol.com/tour
```

---

### Task R1.7: 라우터 + 상태 관리

**Files:**
- Create: `tour/src/lib/router.ts`
- Create: `tour/src/lib/storage.ts`

**Step 1: `router.ts` — History API 기반**

```typescript
import { signal } from "@preact/signals";

export const path = signal(window.location.pathname);

export function navigate(to: string) {
  window.history.pushState({}, "", to);
  path.value = to;
}

window.addEventListener("popstate", () => {
  path.value = window.location.pathname;
});
```

**Step 2: `storage.ts` — 진행률 localStorage**

```typescript
const KEY = "dabitone-tour-progress";

export interface TourProgress {
  [tourSlug: string]: { completedSteps: string[]; lastStepId: string };
}

export function getProgress(): TourProgress {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function setStepComplete(tourSlug: string, stepId: string) {
  const prog = getProgress();
  const entry = prog[tourSlug] || { completedSteps: [], lastStepId: "" };
  if (!entry.completedSteps.includes(stepId)) {
    entry.completedSteps.push(stepId);
  }
  entry.lastStepId = stepId;
  prog[tourSlug] = entry;
  localStorage.setItem(KEY, JSON.stringify(prog));
}
```

**Step 3: signals 의존성 추가 + 설치**

```bash
npm install @preact/signals
```

**Step 4: 커밋**

```bash
git add tour/src/lib/router.ts tour/src/lib/storage.ts package.json package-lock.json
git commit -m "feat(tour): 라우터(History API) + 진행률 localStorage"
```

---

## Phase R2 — 랜딩 cinematic 투어

### Task R2.1: Landing 데이터 정의

**Files:**
- Create: `tour/data/landing.ts`

**Step 1: 5개 핫스팟 좌표 + 텍스트**

`main-comm.png`(통신 탭 기본 화면) 위에 사이드바 5개 버튼 위치를 픽셀 측정 → 이미지 좌표(%)로 환산.

```typescript
import type { LandingData } from "../src/types";

export const landing: LandingData = {
  hero: {
    title: "컨트롤러와\n대화하는 가장 우아한 방법",
    subtitle: "DabitONe으로 다빛솔루션 LED 전광판을 운영하세요.",
    heroImage: "/assets/screens/manual-poc/main-comm.png",
  },
  hotspots: [
    {
      id: "nav-connect",
      x: 12, y: 22,
      label: "통신",
      summary: "Serial·TCP·UDP·BLE·MQTT·dbNet 중 선택해 컨트롤러와 첫 연결을 만듭니다.",
      tourSlug: "01-first-connection",
    },
    {
      id: "nav-setup",
      x: 12, y: 32,
      label: "설정",
      summary: "화면 크기, 색상 깊이, 시계, 밝기 등 컨트롤러 기본 운영 설정을 관리합니다.",
      tourSlug: "02-screen-size",
    },
    {
      id: "nav-simulator",
      x: 12, y: 42,
      label: "전송",
      summary: "편집한 메시지와 스케줄을 컨트롤러로 전송합니다.",
      tourSlug: "03-send-message",
    },
    {
      id: "nav-editor",
      x: 12, y: 52,
      label: "편집",
      summary: "텍스트·이미지·GIF 메시지를 제작하고 편집합니다.",
      tourSlug: "04-edit-image",
    },
    {
      id: "nav-advanced",
      x: 12, y: 62,
      label: "고급",
      summary: "펌웨어 업데이트, 로그, 진단 등 고급 운영 기능입니다.",
      tourSlug: "08-firmware",
    },
  ],
};
```

**Step 2: 좌표 검증** — 브라우저 devtools에서 이미지 위에 overlay 그려 시각 확인.

**Step 3: 커밋**

---

### Task R2.2: Hero 섹션 (cinematic)

**Files:**
- Create: `tour/src/components/Hero.tsx`

**Step 1: Hero 구성**

- 전체 화면 100vh
- 배경: 이미지 + 어두운 gradient overlay
- 타이포: hero title (clamp 크기) + subtitle
- 스크롤 힌트: 아래 화살표 subtle bounce
- 초기 등장: title 페이드 인 + Y 12px → 0 (600ms 순차)

```tsx
import { useEffect, useRef } from "preact/hooks";
import { animate } from "../lib/motion";
import type { LandingData } from "../types";

export function Hero({ data }: { data: LandingData["hero"] }) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      animate(
        titleRef.current,
        { opacity: [0, 1], transform: ["translateY(24px)", "translateY(0)"] },
        { duration: 1.0 },
      );
    }
    if (subRef.current) {
      animate(
        subRef.current,
        { opacity: [0, 1], transform: ["translateY(12px)", "translateY(0)"] },
        { duration: 0.8, delay: 0.3 },
      );
    }
  }, []);

  return (
    <section class="hero">
      <img class="hero__bg" src={data.heroImage} alt="" />
      <div class="hero__shade" />
      <div class="hero__inner">
        <h1 class="hero__title" ref={titleRef}>
          {data.title.split("\n").map((l, i) => (
            <span key={i} class="hero__line">{l}</span>
          ))}
        </h1>
        <p class="hero__subtitle" ref={subRef}>{data.subtitle}</p>
      </div>
      <div class="hero__scroll-hint" aria-hidden>↓</div>
    </section>
  );
}
```

**Step 2: CSS**

```css
.hero {
  position: relative;
  height: 100vh;
  overflow: hidden;
  color: var(--c-text-dark);
  display: grid;
  place-items: center;
}
.hero__bg {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  filter: brightness(0.55);
}
.hero__shade {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at center, transparent, rgba(0,0,0,0.5));
}
.hero__inner {
  position: relative;
  text-align: center;
  max-width: 1200px;
  padding: 0 var(--space-4);
}
.hero__title {
  font-size: var(--fs-hero);
  line-height: var(--lh-tight);
  letter-spacing: var(--ls-tight);
  font-weight: 700;
  margin: 0;
}
.hero__line { display: block; }
.hero__subtitle {
  font-size: var(--fs-body);
  opacity: 0.85;
  margin-top: var(--space-4);
}
.hero__scroll-hint {
  position: absolute;
  bottom: 40px; left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
  animation: scroll-hint 2s var(--ease-out) infinite;
}
@keyframes scroll-hint {
  0%,100% { transform: translate(-50%, 0); opacity: 0.6; }
  50%     { transform: translate(-50%, 12px); opacity: 1; }
}
```

**Step 3: 커밋**

---

### Task R2.3: 5개 탭 섹션 (스크롤 reveal)

**Files:**
- Create: `tour/src/components/TabSection.tsx`
- Create: `tour/src/lib/scrollReveal.ts`

**Step 1: IntersectionObserver 기반 reveal**

```typescript
// scrollReveal.ts
import { animate } from "./motion";

export function observeReveal(el: HTMLElement, delay = 0) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          animate(
            e.target,
            { opacity: [0, 1], transform: ["translateY(40px)", "translateY(0)"] },
            { duration: 0.8, delay },
          );
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.3 },
  );
  io.observe(el);
  return io;
}
```

**Step 2: TabSection 컴포넌트** — 각 탭마다 표지 이미지 + 제목 + 설명 + 핫스팟 클릭 유도

각 섹션: min-height 100vh, 상단 텍스트 + 하단 screenshot with hotspot marker.

**Step 3: Landing에서 5개 탭 데이터 매핑해서 렌더**

**Step 4: 커밋**

---

### Task R2.4: 핫스팟 클릭 → Popover 시네마틱

**Files:**
- Modify: `tour/src/pages/Landing.tsx`

**Step 1: Popover open state 관리**

Hotspot 클릭 시 해당 핫스팟 데이터를 Popover에 전달. "자세히" 클릭 시 `navigate(\`/tour/quickstart/${tourSlug}\`)`.

**Step 2: 뒷배경 blur + darken 시네마틱**

이미 R1.4에서 CSS에 backdrop-filter 추가됨 — 동작 확인.

**Step 3: Esc 키 + 백드롭 클릭 close**

**Step 4: 커밋 + 푸시**

```bash
git push origin main
# → 실제 랜딩에서 핫스팟 클릭 체험 확인
```

---

### Task R2.5: PDF 다운로드 섹션 (랜딩 최하단)

**Files:**
- Modify: `tour/src/pages/Landing.tsx`

**Step 1: Footer 바로 위 "현장 참조용 PDF" 섹션**

2권 PDF 큰 카드 UI — 제목 + 챕터 요약 + 다운로드 버튼

**Step 2: 반응형 — 모바일에서 세로 스택**

**Step 3: 커밋**

---

## Phase R3 — Quickstart 투어 01~08

### Task R3.1: 투어 스텝 렌더 엔진 `TourScenario.tsx`

**Files:**
- Create: `tour/src/pages/TourScenario.tsx`

**Step 1: URL `/tour/quickstart/<slug>/step-<n>` 파싱**

**Step 2: 레이아웃 — 좌 70% screenshot(highlight), 우 30% 설명 레일**

- 스크린샷: 현재 스텝의 UI 영역을 밝게 하이라이트, 나머지 dim
- 설명 레일: 제목, 설명, tip, prev/next/skip

**Step 3: 스텝 전환 애니** — 설명 레일 fade/slide, 스크린샷 hotspot 이동

**Step 4: 진행률 바 상단 고정**

**Step 5: 커밋**

---

### Task R3.2: 01-first-connection 투어 데이터

**Files:**
- Create: `tour/data/quickstart/01-first-connection.ts`

**원본:** `content/quickstart/01-first-connection.md` (R0.2에서 draft 처리한 파일)

**Step 1: markdown 내용을 TourStep[]로 변환**

4개 스텝 제안:
1. "통신 탭 확인" — 좌측 사이드바 [통신] 버튼 핫스팟
2. "연결 방식 선택" — Serial/Client TCP/IP/UDP 라디오 3개 중 하나 선택 (인터랙티브: 클릭 시 해당 그룹박스만 활성화되는 애니)
3. "설정 입력" — 포트/속도 OR IP/포트 입력 필드 하이라이트
4. "연결 테스트 실행" — [연결 테스트] 버튼 핫스팟, 성공 시 녹색 토스트 애니

```typescript
import type { Tour } from "../../src/types";

export const tour01: Tour = {
  slug: "01-first-connection",
  title: "컨트롤러 최초 연결",
  subtitle: "Serial·TCP·UDP 중 하나로 처음 연결하기",
  steps: [
    {
      id: "step-1",
      title: "좌측 [통신] 탭 확인",
      description: "DabitONe을 실행하면 좌측 사이드바 맨 위의 [통신] 탭이 기본으로 선택되어 있고, 우측에 '통신 설정' 창이 뜹니다.",
      hotspot: { x: 12, y: 22, label: "통신" },
      screenshot: "/assets/screens/manual-poc/main-comm.png",
      nextHint: "연결 방식을 골라봅시다.",
    },
    {
      id: "step-2",
      title: "연결 방식 선택",
      description: "Serial은 시리얼 케이블 직결 환경에서, Client TCP/IP는 컨트롤러 IP를 알고 있을 때, UDP는 브로드캐스트·단방향 송출에 사용합니다. 처음이라면 대부분 Serial이나 Client TCP/IP입니다.",
      hotspot: { x: 28, y: 40, label: "Serial" },
      screenshot: "/assets/screens/manual-poc/main-comm.png",
      tips: [
        "컨트롤러-PC를 시리얼 케이블로 직접 연결 → Serial",
        "컨트롤러 IP를 알고 있음 → Client TCP/IP",
        "브로드캐스트·단방향 송출 → UDP",
      ],
    },
    {
      id: "step-3",
      title: "설정 입력",
      description: "Serial이면 '포트'와 '속도'(기본 115200)를 컨트롤러 펌웨어 설정에 맞춰 선택합니다. TCP/UDP이면 'IP Address'와 'IP Port'(기본 5000)를 입력합니다.",
      hotspot: { x: 40, y: 52, label: "포트 / 속도" },
      screenshot: "/assets/screens/manual-poc/main-comm.png",
      tips: [
        "속도를 모르면 [속도 찾기] 버튼으로 자동 탐색",
        "RS-485 배선이면 'RS-485 Address' 체크박스 ON",
      ],
    },
    {
      id: "step-4",
      title: "[연결 테스트] 클릭",
      description: "통신 설정 창 맨 아래 [연결 테스트] 버튼을 클릭하면 설정이 저장되고 컨트롤러에 echo 요청이 갑니다. 성공하면 '연결 테스트 성공' 녹색 토스트가 뜨고 상단 상태가 '연결됨'으로 바뀝니다.",
      hotspot: { x: 28, y: 82, label: "연결 테스트" },
      screenshot: "/assets/screens/manual-poc/main-comm.png",
      tips: [
        "응답 없음 (노란색) → 케이블/속도/IP 재확인",
        "실패 (빨간색) → 포트 점유, 서브넷, 컨트롤러 상태 확인",
      ],
    },
  ],
  nextTour: "02-screen-size",
};
```

**Step 2: TourScenario에 연결 + 로컬 빌드 확인**

**Step 3: 커밋 + 푸시**

---

### Task R3.3 ~ R3.9: Quickstart 02~08 투어 데이터

각 파일:
- `tour/data/quickstart/02-screen-size.ts`
- `tour/data/quickstart/03-send-message.ts`
- ... (08까지)

각 투어 3~5 스텝, XAML·기술 문서 참조하여 정확한 UI 문자열 사용.

**순차 작업 + 페이지별 커밋 + 푸시**

---

## Phase R4 — Reference markdown

v2 Phase 6 Task 6.3~6.6 그대로 진행.

### Task R4.1: UI Reference 5그룹

파일 리스트 (기존 skeleton 존재):
- `content/ui-reference/01-communication/*.md` — serial, tcp, udp, ble, mqtt, dbnet, index
- `content/ui-reference/02-settings/*.md`
- `content/ui-reference/03-transfer/*.md`
- `content/ui-reference/04-editor/*.md`
- `content/ui-reference/05-advanced/*.md`

각 파일 `content/templates/reference.md` 구조 따라 작성. 페이지 1개 = 1 커밋 + 푸시.

### Task R4.2: File Formats 6종

- `content/file-formats/{dat,ani,gif,pla,bgp,fnt}.md`

`content/templates/file-format.md` 구조.

### Task R4.3: Troubleshooting 5

- `content/troubleshooting/{01-connection,02-display-corruption,03-transfer-fail,04-firmware-error,05-faq}.md`

`content/templates/troubleshoot.md` 구조.

### Task R4.4: Blog 릴리즈 노트

- `content/blog/2026-04-21-v1-1-0.md`

---

## Phase R5 — PDF (Reference만)

### Task R5.1: build-pdf.mjs 수정 — Quickstart/Landing 제외

**Files:**
- Modify: `scripts/build-pdf.mjs` (또는 해당 경로)

**Step 1: CHAPTERS 재정의**

```javascript
const CHAPTERS = [
  {
    name: 'Reference',
    title: 'DabitONe 매뉴얼 — UI 레퍼런스편',
    includes: [/^ui-reference\//, /^file-formats\//],
  },
  {
    name: 'Operation',
    title: 'DabitONe 매뉴얼 — 운영·문제해결편',
    includes: [/^troubleshooting\//, /^blog\//],
  },
];
```

**Step 2: URL 수집 시 `/tour`·`/quickstart` 전면 제외**

```javascript
const urls = Object.keys(index)
  .filter(slug => !slug.startsWith("tour/") && !slug.startsWith("quickstart/"))
  .map(slug => `http://localhost:${PORT}/${slug}`);
```

**Step 3: 로컬 실행 + 크기 확인 (각 < 25 MiB)**

**Step 4: 커밋**

---

### Task R5.2: 랜딩 PDF 다운로드 섹션 업데이트

R2.5에서 이미 2권 카드 작성. URL 확정: `/pdf/DabitONe_Manual_Reference.pdf`, `/pdf/DabitONe_Manual_Operation.pdf`.

---

## Phase R6 — Cross-link

### Task R6.1: 투어 스텝 → Reference 링크

**Files:**
- Modify: `tour/src/pages/TourScenario.tsx`

**Step 1: 각 스텝 하단 "더 자세히" 블록**

`relatedRefs?: Array<{ label: string; path: string }>` 필드를 `TourStep` 타입에 추가. 각 스텝이 해당 UI Reference 페이지 링크를 제공.

**Step 2: 투어 01 데이터에 링크 추가**

```typescript
relatedRefs: [
  { label: "통신 UI 레퍼런스", path: "/ui-reference/01-communication/" },
  { label: "연결 문제 해결", path: "/troubleshooting/01-connection" },
],
```

---

### Task R6.2: Reference → 투어 진입 CTA

**Files:**
- Modify: `quartz.layout.ts` 또는 페이지 템플릿

**Step 1: UI Reference 페이지 상단에 "투어에서 체험하기" 버튼**

frontmatter `tour: quickstart/01-first-connection` 필드 → 레이아웃이 자동 CTA 렌더.

---

## Phase R7 — QA & cutover

### Task R7.1: 접근성 감사

- 스크린 리더(NVDA)로 투어 순회
- `/tour/accessible` 대체 텍스트 경로 구현
- 키보드만으로 전체 투어 가능 확인
- `prefers-reduced-motion` 실제 시뮬레이트

### Task R7.2: 모바일 반응형

- 투어 레이아웃: 스크린샷 상단 + 설명 하단으로 세로 스택
- 핫스팟 크기 확대 (터치 타겟 ≥ 44px)
- 스와이프 제스처로 스텝 이동

### Task R7.3: 성능 예산

- 랜딩 초기 로드 ≤ 3초 (3G Fast)
- 투어 진입 ≤ 1초
- 이미지 lazy loading + AVIF 우선 + WebP fallback
- JS 번들 총 ≤ 150KB gzipped

### Task R7.4: SEO + Open Graph

- 랜딩 meta: 제목 "DabitONe 매뉴얼 — 다빛솔루션", og:image 히어로 이미지
- 투어 각 시나리오 개별 meta
- Reference 페이지 canonical

### Task R7.5: 최종 체크리스트

- [ ] `dabitone.dabitsol.com` 200 OK, 랜딩 hero 애니 동작
- [ ] `/tour/quickstart/01` 4 스텝 순회 OK
- [ ] 핫스팟 클릭 → popover → "자세히" 딥링크
- [ ] Reference 페이지에서 "투어에서 체험" CTA → 투어로 이동
- [ ] Reference 2권 PDF 다운로드 OK, 각 < 25 MiB
- [ ] 모바일(iPhone 14 에뮬레이션) 투어 OK
- [ ] `prefers-reduced-motion` ON 시 모션 비활성
- [ ] Lighthouse Performance ≥ 85, Accessibility ≥ 95

---

## 참고 자료

- 원 설계 문서 (v2): `D:\Gitea\dabitche\docs\plans\2026-04-21-dabitone-manual-design.md`
- 플랜 v2: `D:\Gitea\dabitche\docs\plans\2026-04-21-dabitone-manual-plan.md`
- Motion One: https://motion.dev/
- Lenis smooth scroll: https://lenis.darkroom.engineering/
- Preact 공식: https://preactjs.com/
- Apple HIG motion: https://developer.apple.com/design/human-interface-guidelines/motion
- Lighthouse scoring: https://developer.chrome.com/docs/lighthouse/overview
