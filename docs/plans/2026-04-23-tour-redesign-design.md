---
title: Tour 풀 리디자인 — Design Doc
date: 2026-04-23
status: approved
scope: /tour/ Landing + /tour/quickstart/01-08 (8개 시나리오)
out_of_scope: Quartz SSG 매뉴얼 본문 (/01-communication/ 등)
---

# Tour 풀 리디자인 — Design Doc

## 1. 배경

DabitOne은 다빛솔루션 LED 전광판 운영 WPF 데스크톱 앱. 레거시 DabitChe의 전면 리뉴얼 제품. 이 레포(`dabitone-manual`)는 Quartz v4 SSG + Preact 독립 투어 앱(`/tour/*`)으로 구성된 매뉴얼·쇼케이스 사이트.

현재 `/tour/` Landing은 2026-04-23 오전에 텍스트 중심으로 개정되었으나, 본 디자인은 이를 **풀 리디자인**한다. 목표는 "Apple product page 수준의 감각적 경험으로 제품 본질(픽셀/프로토콜) 전달".

## 2. 스코프

- **In**: `/tour/` Landing + `/tour/quickstart/01-first-connection` ~ `08-firmware` 8개 시나리오. Preact 투어 앱 단일 번들 내부.
- **Out**: Quartz SSG 매뉴얼 본문. 동일 디자인 언어 공유는 안 함.

## 3. 오디언스 & 목표

- **독자 비중**: A(신규 고객) 50% + B(레거시 DabitChe 사용자) 50%. 둘 다 커버.
- **주요 CTA (병렬 2개)**:
  1. Quickstart 투어 8개 체험 (내부)
  2. DabitOne 설치파일 다운로드 (외부 `dabitsol.com`)
- **Before/After 비교 금지** — 레거시 호명 없이 DabitOne 자체를 주인공으로 부각 (기존 메모리 원칙).

## 4. 디자인 언어

### 톤
Raycast의 단호함 + Linear의 구체성 + Arc의 여백 리듬. 감정 형용사(`clean`, `calm`) 금지. Apple/Samsung 공식 제품 페이지의 직설·단언형.

### 색 — 순수 모노크롬

```css
--color-bg: #FFFFFF;
--color-bg-inverse: #0A0A0A;
--color-text-primary: #0A0A0A;
--color-text-primary-on-dark: #FAFAFA;
--color-text-secondary: #525252;
--color-text-secondary-on-dark: #A3A3A3;
--color-border: #E5E5E5;
--color-border-on-dark: #262626;
--color-surface-hover: #FAFAFA;
--color-accent-pulse: currentColor; /* hotspot pulse만 — 배경 따라 자동 반전 */
```

브랜드 컬러 없음. **섹션 단위 다크 반전 2곳**(Manifesto, Footer)으로 시각 리듬.

### 타이포 — Pretendard Variable + Inter Variable (self-hosted WOFF2)

```css
--font-display: "Pretendard Variable", "Inter Variable", sans-serif;
--font-body: "Pretendard Variable", "Inter Variable", sans-serif;

--fs-display: 80px;
--fs-section: 48px;
--fs-feature: 32px;
--fs-body: 17px;
--fs-small: 14px;
--fs-eyebrow: 13px;

--lh-tight: 1.1;
--lh-snug: 1.25;
--lh-normal: 1.65;

--ls-tight: -0.03em;
--ls-snug: -0.02em;
--ls-eyebrow: 0.1em;
```

`font-display: swap`. 약 2MB 1회 로드 후 캐시.

### 여백·레이아웃

```css
--space-section-y: 160px;
--space-section-y-alt: 120px;
--space-inner-y: 48px;
--gap-xl: 48px;
--gap-lg: 32px;
--gap-md: 24px;
--gap-sm: 12px;
--content-max: 1200px;
--content-max-wide: 1600px;
```

Arc식 **좌우 교대 리듬**. 최대 폭 1200px 중앙 정렬.

### Border / Radius / Shadow

```css
--border-thin: 1px solid var(--color-border);
--radius: 0;
--shadow-none: none;
--shadow-subtle: 0 4px 24px rgba(0, 0, 0, 0.06);
```

**Radius 0 전면 각진 형태** (Apple/Linear식). 그림자는 Stage 이미지 한 곳에만.

### 이미지 정책

- **Landing**: 프로그램 캡쳐 **사용 안 함**. 이전 테스트에서 가치 훼손 확인됨.
- **Hero 배경**: Canvas 기반 **픽셀 모션** (제품 본질 메타포), 외부 이미지 자산 0.
- **Rest Moment 섹션** (Quickstart 직전): 추상 고퀄 이미지 **1장** (Unsplash 라이선스, LED 매크로·픽셀 매트릭스·라이트 트레일 계열).
- **Quickstart 시나리오 페이지**: `manual-poc/*.png` + `reference/*.png` 기존 자산 적극 활용.
- **Legacy-before/**: 사용하지 않음.

### 모션 원칙
"**필요한 곳에만**". 과도한 parallax·scroll-linked 금지. 기본은 섹션 진입 `fade-up` 수준.

## 5. Landing 레이아웃 (9 섹션)

| # | 섹션 | 배경 | 역할 |
|---|------|------|------|
| 1 | Hero | light + 픽셀 모션 | 제품 정체 선언 + CTA 2개 |
| 2 | Manifesto | **dark ⬛** | 철학 한 줄, 시선 환기 |
| 3 | F01 ALL-IN-ONE | light | 좌 텍스트 / 우 visual slot |
| 4 | F02 ONE SCREEN PER TAB | light | 좌우 반전 |
| 5 | F03 DBNET | light | F01 패턴 |
| 6 | F04 HEX · ASCII | light | F02 패턴 |
| 7 | Rest Moment | light | 추상 이미지 1장, 캡션 없음 |
| 8 | Quickstart | light | 2×4 카드, "어디서부터 시작할까요?" |
| 9 | Footer | **dark ⬛** | 설치 CTA + PDF 2권 |

### 섹션별 디테일

**#1 Hero** (100vh)
- Display `DabitOne.` 80px / 700 / tracking -0.03em
- Sub `다빛솔루션 LED 전광판 운영 소프트웨어.` 17px / 400
- **CTA 2개**:
  - Primary: `투어 시작하기 →` (black solid, #quickstart 앵커)
  - Secondary: `DabitOne 다운로드` (outline 1px, `https://www.dabitsol.com` 외부)
- 배경: Canvas 기반 dot matrix 모션 (흑백, 극저대비)
- 현 Hero 안의 manifesto 텍스트는 **#2로 이동**

**#2 Manifesto** (dark, 상하 160px)
- 흑 배경 / 흰 텍스트 / 가운데 정렬
- H2 `픽셀에서 프로토콜까지, / 하나의 소프트웨어.` 48px / 600
- 이미지 없음

**#3~#6 Feature 4개** (light, 상하 120px)
- **4개 유지** (탭 매칭 5개가 아닌 **제품 특색 매칭** — TabIndex와 정보 중복 회피)
- 좌우 교대: F01 좌텍/우빈 → F02 좌빈/우텍 → F03 F01 → F04 F02
- 구성: `num` + `label` + `title 32px/600` + `body 17px × 2~3줄`
- 우/좌 "visual slot" = 현 단계 빈 공간, 향후 미니멀 SVG 아이콘 1개 가능

**#7 Rest Moment** (light, full-bleed)
- 풀블리드 추상 이미지 1장
- 캡션·텍스트 없음, 순수 시각 호흡

**#8 Quickstart** (light)
- Eyebrow `QUICKSTART` / H3 `어디서부터 시작할까요?`
- 2×4 그리드 (desktop), 1×8 stack (mobile)
- 카드: `01` / `통신` / `Serial · TCP · UDP · …` / `→`
- 카드 hover: bg `#FAFAFA`, arrow `translateX(4px)`

**#9 Footer** (dark)
- 좌: 설치 CTA 큰 버튼 `DabitOne 다운로드` → `dabitsol.com`
- 우: PDF 2권 카드 2장 (현 구조 유지)
- 하단: `© 다빛솔루션` + 법적 링크

## 6. Quickstart 페이지 공통 템플릿

**구조 유지 + 시각 언어 교체** 방침. 현 좌(Stage)/우(Rail) + 상단 Progress 레이아웃은 양호.

### 레이아웃
- **ProgressHeader**: eyebrow `DabitOne 투어` / 투어 제목 48px / subtitle 20px (신규 추가) / `N / Total` / progress bar
- **Stage 1.8fr**: 스크린샷 (aspect-ratio 유지, max-height 78vh, **1px border + shadow-subtle**) + hotspot overlay
- **Rail 1fr** (min 280px, sticky top 40px): step.title 32px / description / tips / relatedRefs / 이전·다음 버튼

### 시각 교체 표

| 요소 | 현재 | 새로 |
|---|---|---|
| 투어 제목 | clamp 24~32px | 48px / 600 |
| Step title | clamp 24~32px | 32px / 600 |
| Accent 사용처 | bar · button · hotspot · link | **hotspot + link만** |
| Primary button | accent bg | **black bg + white text, radius 0** |
| Rail 배경 | panel + shadow-pop | white + 1px border + shadow none |
| Stage 이미지 | 테두리 없음 | **1px border + shadow-subtle** |
| Progress bar | 3px accent | **2px black** on `#F0F0F0` |

### 마이크로 개선 (확정)

1. **Subtitle 표시 추가** — `tour.subtitle` 데이터에 있으나 미사용. ProgressHeader 투어 제목 아래 `20px / 400 / soft gray` 한 줄 추가.
2. **완료 스크린 추가** — `isLast && !nextTour`일 때 짧은 완료 카드(eyebrow `COMPLETE` + title `투어 완료` + supporting + 홈/설치 CTA).

## 7. 컴포넌트

### Button

- **Primary**: `bg #0A0A0A / color #FAFAFA / padding 14px 28px / 17px 600 / radius 0`
- **Secondary**: `outline 1px #E5E5E5 / text primary / 같은 padding`
- **Ghost**: `transparent / hover bg #FAFAFA` (Rail 내부 등)
- Dark 반전 섹션에서는 색 반전 버전 사용

### Card (Quickstart 탭)

- `border 1px #E5E5E5 / bg white / padding 32px / gap 12px`
- hover: `bg #FAFAFA / arrow translateX(4px)`
- 구성: `num 40px/300` + `name 24px/600` + `desc 14px/400 secondary` + arrow

### Stage (Quickstart)

- `border 1px #E5E5E5 / shadow-subtle`
- aspect-ratio 유지, max-height 78vh

### Rail (Quickstart)

- `bg white / border 1px #E5E5E5 / padding 32px 28px / shadow none`
- sticky top 40px (desktop/tablet)

### Hotspot

- 현 ripple ×2 pulse 유지
- 색 `currentColor` — 배경 따라 자동 반전 (라이트: 검정 / 다크: 흰)

### Divider

- 섹션 간은 여백만으로 분리
- 명시적 divider는 Footer 내부 구획 정도만

## 8. 모션

### 토큰

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-inout: cubic-bezier(0.65, 0, 0.35, 1);
--dur-fast: 250ms;
--dur-normal: 400ms;
--dur-reveal: 600ms;
```

### 패턴

1. **Reveal on enter** — 섹션 진입 `opacity 0→1 + translateY 40→0`, 600ms `ease-out`. 기존 `revealOnEnter` 함수 값만 조정.
2. **Hero 픽셀 모션** — Canvas 2D, 격자 점 ~1000개, 각 점 alpha `sin` 기반 0.02~0.15 범위 느리게 변화. 뷰포트 밖 RAF pause.
3. **Hotspot pulse** — 기존 ripple ×2 유지.
4. **Hover** — 카드 bg fade 250ms + arrow `translateX(4px)` 동시. 버튼 미세 opacity.
5. **Step 전환 (Quickstart)** — Stage `cross-fade 250ms` + Rail `slide 8px + fade 250ms`. Hotspot 좌표 `transform 400ms ease-out`.
6. **Progress bar** — `width transition 400ms ease-out` (현재 코드 유지, 색 교체만).

### Reduced Motion

`@media (prefers-reduced-motion: reduce)`:
- 모든 duration 0ms
- 픽셀 모션 → 정적 격자
- pulse → 애니메이션 없이 dot만

## 9. 반응형

### Breakpoints

```css
--bp-mobile: 640px;
--bp-tablet: 1024px;
--bp-desktop: 1440px;
```

### Landing

| 요소 | Desktop (>1024) | Tablet (640~1024) | Mobile (<640) |
|---|---|---|---|
| Hero Display | 80px | 64px | `clamp(44px, 9vw, 56px)` |
| Section H2 | 48px | 40px | 32px |
| Feature title | 32px | 28px | 24px |
| Section padding-y | 120~160px | 96~120px | 64~80px |
| Content max-width | 1200px | 100% ± 24px | 100% ± 20px |
| Feature 좌우 교대 | 2-col | 2-col | single-col stack |
| Hero CTA | side-by-side | side-by-side | stack full-width |
| Quickstart | 2×4 | 2×4 | 1×8 |
| Footer 설치/PDF | 2-col | stack | stack |

### Quickstart

| 요소 | Desktop | Tablet | Mobile |
|---|---|---|---|
| Stage : Rail | 1.8fr : 1fr | 1.2fr : 1fr | Stage 풀폭 / Rail stack 아래 |
| Stage max-height | 78vh | 70vh | auto |
| Rail sticky | top 40 | top 32 | 해제 |
| Container padding | 40 / 32 | 32 / 24 | 24 / 16 |
| 투어 제목 | 48 | 40 | 28 |
| Step title | 32 | 28 | 24 |

### 모바일 hotspot

- `mobileHotspot` 필드(이미 존재) 좌표 덮어쓰기로 모바일 크롭 대응
- pulse radius 축소, 터치 target 최소 44×44

## 10. 다음 단계

- **구현 계획 작성**: `superpowers:writing-plans` skill로 전환해 단계별 구현 플랜 생성
- **폰트 자산 추가**: `public/static/fonts/Pretendard*.woff2`, `public/static/fonts/Inter*.woff2` 배치 및 CSS `@font-face`
- **토큰 확장**: `tour/styles/tokens.css`에 신규 변수 추가 (기존 `--tour-*` 네임스페이스 유지 또는 전면 리네임 판단은 구현 단계)
- **Rest Moment 이미지 확보**: Unsplash/Pexels에서 추상 고퀄 이미지 1장 선정 후 `content/assets/landing/` 하위에 저장
- **검증**: `npm run verify:hotspots` + Playwright 시각 회귀, 기존 snapshots 갱신

## 11. 오픈 이슈

- **픽셀 모션 실제 성능**: Canvas 1000 점 @60fps가 저사양 노트북에서 허용 가능한지 측정 필요. 미달 시 SVG 정적 격자로 폴백.
- **폰트 2MB 번들 비용**: 현 사이트 평균 페이지 load와의 비율 체크. 과하면 Pretendard만 로드, Inter는 시스템 폰트 폴백으로.
- **Feature visual slot**: "좌우 교대"에서 한쪽 빈 공간이 어색할 경우 미니멀 SVG 아이콘 도입 검토 (MVP 외).
