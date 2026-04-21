# /tour/ Landing Hero Redesign — Phase A Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** `/tour/` 랜딩 Hero 섹션을 refined/restrained-luxury tone으로 재구현하고 WhatsNew Before/After 비교 섹션을 완전 제거한다. Hotspot·PDF 섹션은 이번 Phase A에서 건드리지 않는다.

**Architecture:** Preact 컴포넌트 3개(`tour/data/landing.ts` 데이터, `tour/src/pages/Landing.tsx` Hero 함수, `tour/src/styles/{tokens,app}.css` 스타일) 동기 수정 → `npm run build` 빌드 통과 → git push → GitHub Actions 자동 배포 → `dabitone.dabitsol.com/tour/` 시각 검증.

**Tech Stack:** Preact, Motion One(`tour/src/lib/motion.ts` wrapper), TypeScript, CSS custom properties, Pretendard Variable, Vite(`scripts/build-tour.mjs`), Quartz SPA.

**Test strategy:** 이 프로젝트는 시각적 디자인 변경이라 TDD 대신 **빌드 성공 + 수동 브라우저 검증**을 검증 기준으로 사용. TypeScript·Vite 빌드가 타입·문법 오류를 자동 검출하므로 각 task 마지막은 `npm run build` 통과로 갈음.

---

### Task 1: WhatsNew 제거 (데이터·타입·컴포넌트·CSS)

**Files:**
- Modify: `tour/data/landing.ts`
- Modify: `tour/src/types.ts`
- Modify: `tour/src/pages/Landing.tsx`
- Modify: `tour/src/styles/app.css`

**Step 1 — types.ts:** `WhatsNewItem` interface 전체 삭제 (line 72~79). `LandingData.whatsNew` 필드 삭제 (line 91).

**Step 2 — landing.ts:** `WHATS_NEW` 상수(line 86~138) 삭제. `export const landing`에서 `whatsNew: WHATS_NEW` 라인 제거 (line 143).

**Step 3 — Landing.tsx:** 
- `<WhatsNewSection items={landing.whatsNew} />` JSX 삭제 (line 47)
- `function WhatsNewSection` 전체 삭제 (line 118~137)
- `function WhatsNewRow` 전체 삭제 (line 139~197)
- `import { revealOnEnter }` 사용처 체크: `HotspotsSection` 안에서도 쓰므로 import 유지.

**Step 4 — app.css:** `/* ==================== What's New (Before/After) ==================== */` 섹션 블록 전체 삭제 (.tour-whatsnew, .tour-whatsnew__cell, .tour-whatsnew__label, .tour-whatsnew__label--before, .tour-whatsnew__label--after, .tour-whatsnew__image, .tour-whatsnew__image--before 포함, 및 @media max-width:720px 안의 .tour-whatsnew 규칙).

**Step 5 — 빌드 검증:**
```bash
npm run build
```
Expected: `build:tour` 통과 + `quartz build` 통과. 경고·에러 없음.

**Step 6 — Commit:**
```bash
git -C D:/GitHub/dabitone-manual add tour/data/landing.ts tour/src/types.ts tour/src/pages/Landing.tsx tour/src/styles/app.css
git -C D:/GitHub/dabitone-manual commit -m "feat(tour): Phase A-1 — WhatsNew Before/After 섹션 완전 제거"
```

---

### Task 2: 토큰 업데이트 — Hero 타이포 + Accent

**Files:**
- Modify: `tour/src/styles/tokens.css`

**Step 1:** 다음 4개 토큰 값 교체:
```css
/* line 13: --tour-fs-hero */
--tour-fs-hero: clamp(96px, 12vw, 160px);  /* 기존 clamp(48px, 8vw, 120px) */

/* line 21: --tour-ls-tight */
--tour-ls-tight: -0.04em;  /* 기존 -0.03em */

/* line 31: --tour-c-accent */
--tour-c-accent: #0066FF;  /* 기존 #2563eb — DabitChe 원 블루 */

/* line 32: --tour-c-accent-soft */
--tour-c-accent-soft: rgba(0, 102, 255, 0.12);  /* 기존 rgba(37, 99, 235, 0.12) */
```

**Step 2 — 빌드 검증:**
```bash
npm run build
```
Expected: 통과. accent color 변경이 Hotspot pulse에도 자동 반영됨.

**Step 3 — Commit:**
```bash
git -C D:/GitHub/dabitone-manual add tour/src/styles/tokens.css
git -C D:/GitHub/dabitone-manual commit -m "feat(tour): Phase A-2 — 토큰 업데이트 (hero 96~160px, ls -0.04em, accent #0066FF)"
```

---

### Task 3: Hero 재구현 (배경·레이아웃·카피·모션)

**Files:**
- Modify: `tour/data/landing.ts` (HERO 카피)
- Modify: `tour/src/pages/Landing.tsx` (Hero 함수)
- Modify: `tour/src/styles/app.css` (.tour-hero* 규칙 전체 교체)

**Step 1 — landing.ts HERO:**
```typescript
const HERO: LandingData["hero"] = {
  title: "DabitOne.",
  subtitle: "새로운 전광판 운영 경험.",
  heroImage: {
    src: "/assets/screens/manual-poc/main-comm.png",
    width: 1422,
    height: 1386,
    alt: "DabitOne 메인 화면 — 통신 설정 탭이 기본 선택된 상태",
  },
}
```

**Step 2 — Landing.tsx Hero 함수 재작성:**
```tsx
function Hero({
  titleRef,
  subRef,
  imgRef,
  title,
  subtitle,
  heroImage,
}: {
  titleRef: preact.RefObject<HTMLHeadingElement>
  subRef: preact.RefObject<HTMLParagraphElement>
  imgRef: preact.RefObject<HTMLImageElement>
  title: string
  subtitle: string
  heroImage: { src: string; alt: string; width: number; height: number }
}) {
  return (
    <section class="tour-hero" aria-label="Hero">
      <div class="tour-hero__inner">
        <h1 class="tour-hero__title" ref={titleRef}>
          {title}
        </h1>
        <p class="tour-hero__subtitle" ref={subRef}>
          {subtitle}
        </p>
      </div>
      <img
        class="tour-hero__product"
        ref={imgRef}
        src={heroImage.src}
        alt={heroImage.alt}
        width={heroImage.width}
        height={heroImage.height}
        loading="eager"
        decoding="async"
      />
    </section>
  )
}
```

**Step 3 — Landing.tsx `Landing()` 컴포넌트에 imgRef 추가 + 애니 연결:**
```tsx
const heroTitleRef = useRef<HTMLHeadingElement>(null)
const heroSubRef = useRef<HTMLParagraphElement>(null)
const heroImgRef = useRef<HTMLImageElement>(null)

useEffect(() => {
  if (heroTitleRef.current) {
    animate(
      heroTitleRef.current,
      { opacity: [0, 1], transform: ["translateY(24px)", "translateY(0)"] },
      { duration: 1.0 },
    )
  }
  if (heroSubRef.current) {
    animate(
      heroSubRef.current,
      { opacity: [0, 1], transform: ["translateY(12px)", "translateY(0)"] },
      { duration: 0.8, delay: 0.3 },
    )
  }
  if (heroImgRef.current) {
    animate(
      heroImgRef.current,
      { opacity: [0, 1], transform: ["scale(0.96) translateY(40px)", "scale(1) translateY(0)"] },
      { duration: 1.2, delay: 0.6 },
    )
  }
}, [])
```

그리고 Hero JSX 호출부에 `imgRef={heroImgRef}` 추가.

**Step 4 — app.css Hero 규칙 전체 교체:**
```css
/* ==================== Hero ==================== */
.tour-hero {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  color: var(--tour-c-text);
  background: linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: clamp(80px, 12vh, 140px) clamp(40px, 10vw, 160px) 0;
}
.tour-hero__inner {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  text-align: left;
}
.tour-hero__title {
  font-family: var(--tour-font-display);
  font-size: var(--tour-fs-hero);
  line-height: 1.0;
  letter-spacing: var(--tour-ls-tight);
  font-weight: 700;
  color: var(--tour-c-text);
  margin: 0;
  opacity: 0;
}
.tour-hero__subtitle {
  font-size: clamp(22px, 2.4vw, 36px);
  letter-spacing: -0.02em;
  color: #4a4a4a;
  margin: clamp(16px, 2vh, 32px) 0 0;
  font-weight: 400;
  max-width: 900px;
  line-height: 1.25;
  opacity: 0;
}
.tour-hero__product {
  display: block;
  width: 100%;
  max-width: min(1400px, 92vw);
  margin: clamp(56px, 8vh, 120px) auto 0;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 60px 120px rgba(0, 0, 0, 0.12),
    0 20px 40px rgba(0, 0, 0, 0.06);
  opacity: 0;
  align-self: center;
}
```

삭제할 규칙: `.tour-hero__bg`, `.tour-hero__shade`, `.tour-hero__line` (이전 다중 줄 span 구조용), `.tour-hero__scroll-hint`, `@keyframes scroll-hint`.

**Step 5 — 빌드 검증:**
```bash
npm run build
```
Expected: 통과. 번들 사이즈 경미하게 감소 예상 (WhatsNew 제거 + CSS 감소).

**Step 6 — Commit:**
```bash
git -C D:/GitHub/dabitone-manual add tour/data/landing.ts tour/src/pages/Landing.tsx tour/src/styles/app.css
git -C D:/GitHub/dabitone-manual commit -m "feat(tour): Phase A-3 — Hero 재구현 (좌측 정렬, 라이트, 제품 full-bleed, orchestrated load)"
```

---

### Task 4: 배포 + 시각 검증

**Files:** 없음 (git push + CI)

**Step 1 — push:**
```bash
git -C D:/GitHub/dabitone-manual push origin main
```
Expected: GitHub Actions `deploy.yml` 트리거 → `build:tour` + `quartz build` + Pages 배포 → 3~5분 내 `dabitone.dabitsol.com/tour/` 반영.

**Step 2 — 배포 모니터링:**
```bash
gh run list --limit 3
gh run watch
```
CI 실패 시 로그 확인 후 수정.

**Step 3 — 사용자 시각 검증 요청:**
사용자에게 아래 체크리스트 제시하고 브라우저에서 확인받음:
- [ ] Hero 배경이 라이트 그라데이션이고 제품 이미지가 opacity 1.0으로 선명
- [ ] 카피 "DabitOne." (왼쪽 큰 제목) + "새로운 전광판 운영 경험." (서브)
- [ ] 제품 스크린샷이 카피 아래 풀폭으로 당당히, 하단 걸쳐서 다음 섹션 암시
- [ ] WhatsNew Before/After 섹션 사라짐
- [ ] Hotspot·PDF 섹션 그대로 (이번 Phase에서 의도적으로 미수정)
- [ ] 모바일 Chrome DevTools 에뮬레이션: title 자동 축소 OK, 이미지 깨지지 않음
- [ ] 페이지 로드 시 title→subtitle→product 순 1.4s 내 settled
- [ ] accent color(#0066FF)가 Hotspot 점에서 확인 가능

**Step 4:** 피드백 수집 후 Phase B(편집기 하이라이트 신규 + Hotspot 다크 반전) 진행 여부 결정.

---

## 검증 체크리스트 (Phase A 완료 기준)

- [ ] `npm run build` 전 단계 통과
- [ ] Hero 제품 이미지 opacity 1.0, 제품이 주인공
- [ ] 카피 변경 확인 (레거시 호명 "당신이 알던" 완전 제거)
- [ ] WhatsNew 섹션 코드·데이터·CSS 모두 사라짐
- [ ] Hotspot·PDF 섹션은 기능·외양 동일 (Phase A에서 미변경)
- [ ] 프로덕션 배포 성공 (CI 녹색)

## Phase B (Phase A 승인 후)
- 편집기 하이라이트 섹션 신규 (main-editor.png 사용, 대각 asymmetric)
- Hotspot 섹션 배경 `#0A0A0A` 다크 반전
- 핫스팟 좌표 재조정 (기존 추정치 x=8, y=19/23/27/31/35 검증)

## Phase C (Phase B 후)
- PDF 섹션 타이포·간격 정돈
- 전체 토큰 일관화 감사
- Lighthouse Performance·Accessibility 측정
- `/tour/accessible/` 대응 확인
