# DabitOne 매뉴얼 사이트 구현 계획 v3 (체험형 투어 피벗)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** **레거시 DabitChe(5~6년간 사용)에서 DabitOne으로 큰 업데이트를 맞은 사용자에게 "얼마나 좋아졌는지"를 감각적으로 체감시키는 마케팅·쇼케이스형 매뉴얼 사이트**를 구축한다. 랜딩과 Quickstart 8개 시나리오는 Apple 홈페이지 수준의 인터랙티브 투어(`/tour/*`)로, Reference/Troubleshooting/File Formats는 markdown + PDF(optional).

**Architecture:** Quartz v4 유지. `/tour/*`는 **Quartz의 custom emitter**(ADR-006 선택 (b))가 각 deep link별 HTML shell을 emit하여 정적 호스팅에서 새로고침·직접 진입 모두 안전. 투어 앱은 Quartz의 기존 Preact 스택·router와 **one-router 원칙**으로 통합(독립 pushState 금지). 모션은 Motion One + CSS sticky + IntersectionObserver(Lenis는 MVP에서 **제외** — sticky/키보드/터치 충돌 리스크). 접근성은 `/tour/accessible`이 별도 문서가 아니라 같은 `TourStep` 데이터에서 대안 렌더. PDF는 reference 영역만, optional 다운로드.

**Tech Stack:**
- **SSG**: Quartz v4 (유지) — Preact + esbuild
- **Tour App**: Preact 10 + TypeScript (Quartz 스택 공유)
- **Animation**: Motion One 11 (framework-agnostic, ~3.5KB) + CSS sticky + IntersectionObserver (Lenis는 MVP 제외, R2 spike에서 필요성 증명 시만 재도입)
- **Routing**: Quartz의 SPA router 재사용 (one-router 원칙) — 투어 상태는 data attribute + query string로 표현
- **State**: Preact Signals + URL as source of truth
- **Screenshots**: 수동 PoC(즉시) + Phase 3 capture mode(자동, 병행)
- **Typography**: Pretendard Variable (self-host, 기존 유지) + 디스플레이 weight 확대
- **Offline**: 없음 — SW/app-shell 불필요, PDF는 optional 다운로드

---

## 🎯 타겟 오디언스 & 메시징 (최상위 원칙)

**이 섹션은 플랜의 모든 다른 결정보다 우선한다. 모든 Phase·Task·디자인 선택은 아래 타겟·톤에 부합해야 한다.**

### 타겟 오디언스

| 순위 | 대상 | 특성 | 니즈 |
|------|-----|------|------|
| **1차** | **레거시 DabitChe 사용자** | 5~6년간 구버전 UI에 익숙, 이번이 첫 큰 업데이트 | "뭐가 달라졌나", "적응할 가치가 있나" 확인 |
| **2차** | **DabitOne 신규 사용자** | 업계 처음 접하거나 경쟁 제품에서 전환 | "DabitOne은 어떤 도구인가" 전체 파악 |
| **비타겟** | **현장 설치기사** | 이미 숙지, 레거시 지식 보유 | (이 매뉴얼의 주 고객 아님) |

### 커뮤니케이션 톤

**핵심 원칙**: 기능은 대부분 레거시에 있던 것. 우리는 **"뭐가 바뀌었나"**와 **"얼마나 편해졌나"**를 팔고 있다.

| ❌ 나쁜 톤 (레퍼런스 매뉴얼 조) | ✅ 좋은 톤 (쇼케이스 조) |
|------------------------------|------------------------|
| "`[통신]` 탭에서 Serial을 선택하고 포트를 설정합니다." | "예전엔 3개 창을 오가야 했던 통신 설정이 이제 한 화면에." |
| "메시지 편집은 Editor 탭에서 수행합니다." | "드래그 앤 드롭이 됩니다. 정말로." |
| "파일 포맷은 `.DAT`, `.ANI`, `.PLA`가 있습니다." | (파일 포맷은 reference에만 — 투어엔 안 나옴) |
| "응답 시간은 기본 3초입니다." | "3초 안에 연결 못 하면 알려줍니다. 과거엔 무한 대기였죠." |

**변화 지시어 일관 사용**: "**이제는**", "**새롭게**", "**한 번에**", "**예전엔 ~ 이제는**"

### 핵심 메시지 후보 (Hero 카피, R2.2에서 1개 확정)

- (A) "5년을 기다린 DabitOne. 익숙했던 것을 더 우아하게."
- (B) "DabitChe는 이제 DabitOne입니다. 전광판 운영, 다시 설계했습니다."
- (C) "같은 컨트롤러, 새로운 경험."
- (D) "6년 만의 리프레시. 당신이 알던 기능은 그대로, 손끝 감각은 전부 새로."

### Before/After 필수 섹션 (랜딩 R2.X, 신규)

랜딩 Hero 바로 다음에 "**5년 만에 이렇게 달라졌습니다**" 섹션 배치:

- 3~5개 주요 개선점 (통신 설정 통합, 편집기 일신, 디자인 시스템, 성능, 편의 기능 등)
- 각 항목: Before 스크린샷 ↔ After 스크린샷 + 짧은 한줄 카피
- 스크롤 진행에 따라 Before → After로 crossfade

> **Before 스크린샷 소스**: 레거시 DabitChe v9.0 PDF(`D:\Gitea\dabitche\references\DabitChe_UserManual_v9.0.pdf`) 또는 `D:\Gitea\dabitche\references\DabitChe-V2.2.1\` 실행 캡처.
>
> **After**: 수동 PoC 캡처 (R0.3).

### 설계자 체크리스트 (모든 PR·페이지)

- [ ] 이 페이지/스텝이 **레거시 사용자**에게 "달라졌다"는 신호를 주는가?
- [ ] "기능 설명" 밀도보다 "개선 체감"이 우선인가?
- [ ] 카피에 변화 지시어(이제는/새롭게/한 번에)가 있는가?
- [ ] 모션·타이포가 "5년 지난 소프트웨어 매뉴얼"로 보이진 않는가?

---

## v2 → v3 주요 변경 (대화 피벗 반영)

사용자 피드백(2026-04-21): v2의 reference 매뉴얼 스타일은 docs.dabitsol.com과 결이 유사하여 DabitOne 매뉴얼만의 체험형 가치를 충분히 못 살림. Apple 홈페이지 수준의 감각적 인터랙션(SVG hotspot + cinematic scroll + 딥링크 투어) 채택.

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

### 참조 사이트 (카테고리별 + 구체 패턴)

> **중요한 전제**: 아래는 "이 느낌으로 가자"의 **상한 참조**. Apple·Rabbit 수준의 풀-WebGL·3D 캔버스는 이 프로젝트 범위 밖. 우리는 "Apple 스타일의 정제된 2D + scroll-linked CSS/JS 애니"로 **감각적 수준의 80%를 저예산으로 재현**하는 것이 목표.

#### A. Hero & 제품 리빌 (첫인상)

| 사이트 | 참고 패턴 | 우리 적용 |
|--------|----------|----------|
| **apple.com/iphone** | 전체 화면 제품 이미지 + 스크롤에 따라 zoom/pan + title fade 순차 | 랜딩 Hero: DabitOne 메인창 이미지 + 초기 1.2s 타이틀 reveal + 미세 zoom-out |
| **apple.com/vision-pro** | 대형 제품이 스크롤 따라 좌↔우·앞뒤로 회전 (clip-reveal 기법) | 안 씀 (과함). 대신 탭 이미지 교차 전환으로 축소 재현 |
| **arc.net** | 브랜드 컬러풀 gradient + soft bounce CTA | CTA(투어 시작 버튼)만 hover 시 부드러운 magnetic 움직임 |
| **rabbit.tech** | 제품을 거대한 단일 숏으로, 최소 UI | 랜딩 hero는 단일 숏 + 글자만 |
| **humane.com** | 어둠 베이스 + 단일 하이라이트, 미니멀 카피 | 다크 섹션 배경에 한해 적용 |

#### B. 스크롤 스토리텔링 (서사)

| 사이트 | 참고 패턴 | 우리 적용 |
|--------|----------|----------|
| **stripe.com/sessions** | sticky 섹션 + 오른쪽 고정 미디어 + 왼쪽 텍스트 step 교체 | 투어 시나리오 화면 구성과 정확히 일치 — **core reference** |
| **apple.com/mac** | 스크롤 0~100% 진행도를 타임라인에 매핑, 장면 전환 | 5 탭 섹션: 스크롤 진행도에 따라 각 탭이 차례로 나타나고 이전 탭은 사라짐 |
| **vercel.com/home** | section fade-up + subtle number counter | 체크포인트 "✅ 연결됨" 같은 완료 피드백을 숫자 counter로 연출 |
| **raycast.com** | hero 뒤 섹션이 가볍게 slide-in, 많은 여백 | 섹션 간 여백·리듬 기준 |
| **linear.app/homepage** | 각 섹션이 자기 배경을 가지며 스크롤 동기 cross-fade | 섹션 배경색 전환 방식 |

#### C. 타이포그래피 & 레이아웃

| 사이트 | 참고 패턴 | 우리 적용 |
|--------|----------|----------|
| **linear.app** | Inter Display 96px hero, -0.03em tight letter-spacing, 줄바꿈 설계 | Pretendard Variable 96~120px, 한글도 tight letter-spacing 적용(-0.025em), 수동 `<br>` 리듬 |
| **vercel.com** | Geist 폰트, 대비 100→900 단일 fontface | Pretendard Variable도 같은 방식 — weight axis 활용 |
| **superhuman.com** | Serif 제목(거대) + sans 본문 | 안 씀 (한글 세리프 폰트 제약). 대신 Pretendard weight 대비로 유사 효과 |
| **readymag showcase** | editorial magazine 느낌 (drop cap, 큰 따옴표) | 안 씀 (매뉴얼 격식 아님) |
| **framer.com** | 제목이 단어별 stagger reveal (120ms 간격) | Hero 제목 한 글자씩 reveal 검토 — 한글 자소 단위는 어려우니 **어절 단위** stagger |

#### D. 마이크로 인터랙션 (디테일)

| 사이트 | 참고 패턴 | 우리 적용 |
|--------|----------|----------|
| **framer.com** | 버튼 hover magnetic 효과(포인터로 살짝 따라감) | CTA 버튼에만 적용 (거리 > 8px에선 원위치) |
| **cursor.com** | 페이지 로드 시 cursor-follow spotlight (radial gradient) | 안 씀 (매뉴얼엔 산만) |
| **linear.app/features** | 카드 hover 시 가장자리에 subtle gradient border 움직임 | 5 탭 카드에 적용 검토 |
| **vercel.com** | `[⌘K]` 검색 버튼의 키캡 아이콘 | Quartz 검색 유지, 투어에서 "키보드로도 가능" 힌트만 |
| **stripe.com** | 코드 블록 탭 전환 시 crossfade | 투어의 step 전환 (700ms crossfade) |

#### E. 제품 투어 · 스텝 인터랙션 (가장 중요)

| 사이트 | 참고 패턴 | 우리 적용 |
|--------|----------|----------|
| **figma.com/product** | "Click here" annotation + 고정 사이드 설명 | 투어 스텝 핵심 패턴 |
| **raycast.com/blog** | 실제 제품 스크린샷 + 하이라이트 박스 + 캡션 | 핫스팟 + 라이트 박스 dim 조합 |
| **tldraw.com** | 임베드된 실제 제품 (iframe-less) — 직접 조작 가능 | 우리는 iframe으로 DabitOne을 못 임베드, 대신 **가짜 인터랙티브 목업** (클릭 가능한 SVG 위 XAML 재현) |
| **asana.com/product/tour** | 사이드 진행률 리스트 + 본문 스텝 | 투어 레이아웃의 좌 레일 |
| **rive.app/marketplace** | 실제 Rive 애니메이션이 페이지 안에서 돌아감 | Lottie/CSS로 "성공 토스트 등장" 같은 짧은 애니 재현 |

#### F. 색감 & 다크/라이트 전환

| 사이트 | 참고 패턴 | 우리 적용 |
|--------|----------|----------|
| **linear.app** | 섹션마다 배경이 라이트 → 다크로 자연 전환 | R2 랜딩 구성: Hero(dark) → 5탭(light) → 심화(dark) → PDF(light) |
| **apple.com/macbook-pro** | 다크 섹션에서 제품 이미지가 발광하는 듯한 느낌 | 다크 섹션의 스크린샷 주변에 radial glow 추가 (CSS box-shadow 다중) |
| **studiofreight.com/lenis** | 다크 + neon 액센트 | 다크 섹션 액센트는 DabitChe 블루(#2563EB) 단일 |

#### G. 핫스팟 / 인터랙티브 어노테이션 (핵심)

| 사이트 | 참고 패턴 | 우리 적용 |
|--------|----------|----------|
| **apple.com/iphone-16/specs** | 제품 부위별 hotspot + popover | 우리 핫스팟 디자인의 **직접 모델** |
| **notion.so/help** | 스크린샷에 번호 라벨 + 하단 설명 | 접근성 모드에서 fallback으로 사용 |
| **1password.com/tour** | 애니 GIF + 설명 pair | R4 markdown 페이지에서 GIF 임베드 방식 |
| **slack.com/tour** | 스크린샷 + 화살표 + 캡션 | 같은 패턴, 우리는 화살표 대신 pulse 링 |

#### H. 참조 수집 · 큐레이션 소스

큰 틀을 놓쳤을 때 주기적 점검용:

- **awwwards.com/websites** (SOTD, Developer Award 카테고리)
- **godly.website** (큐레이션)
- **siteinspire.com** (미니멀 지향)
- **typewolf.com** (타이포그래피 전용)
- **httpster.net** (데일리 큐레이션)

#### I. 기술 레퍼런스 (구현 라이브러리)

- **Motion One (motion.dev)** — scroll-linked API, keyframes, timeline (MVP 채택)
- **Lenis (lenis.darkroom.engineering)** — **MVP 제외**. sticky/scroll lock/키보드 스크롤/모바일 터치와 충돌 빈번. R2 spike 결과 CSS sticky + IO로 부족할 때만 재도입
- **GSAP ScrollTrigger** — 대안. pinned multi-track scrub이 **반드시** 필요하다는 증거가 R2 spike에서 나올 때만 고려
- **View Transitions API** — Chrome 111+, 투어 step 전환에 native 지원. fallback으로 Motion One
- **CSS `@starting-style`** (2024+) — 초기 진입 애니 native 지원, reveal 단순화

### 🎯 레퍼런스 태깅 (Codex 11 반영 — core/optional/out)

| 분류 | 항목 | 이유 |
|------|------|------|
| **Core (반드시 구현)** | **Stripe Sessions** sticky sidebar step 구성 | 투어 레이아웃의 직접 모델 |
| **Core** | **Figma Product** 핫스팟 + annotation | 핫스팟 UX 직접 모델 |
| **Core** | **Linear** 타이포 hierarchy + 섹션 배경 전환 | 감각의 기준선 |
| **Core** | **Apple HIG motion** easing·duration 원칙 | 모션 quality 기준 |
| **Core** | **apple.com/iphone-16/specs** 부위별 hotspot | 핫스팟 시각 언어 |
| **Optional (여력 있으면)** | apple.com/mac 스크롤 타임라인 매핑 | 5탭 섹션에서 시도 |
| **Optional** | framer.com magnetic hover CTA | CTA 1개에만 적용 |
| **Optional** | linear.app/features 카드 hover gradient | 5탭 카드 |
| **Optional** | vercel.com section fade-up + counter | 체크포인트 연출 |
| **Out (MVP 배제)** | **word stagger reveal** (framer) | 한글 어절 stagger 구현 비용 > 효과, 모바일에서 깨짐 |
| **Out** | **section lock/scroll jack** (apple vision-pro) | 독자 이탈 유발, 접근성 취약 |
| **Out** | **magnetic cursor·spotlight** (cursor.com) | 매뉴얼엔 산만, 접근성 해침 |
| **Out** | **parallax 수직 과다** | reduced-motion 대응 복잡 |
| **Out** | custom cursor 전면 교체 | 접근성 해침 |

### 디자인 톤 요약 (한 문장)

> **"Apple의 절제된 cinematic scroll + Linear의 타이포 대비 + Stripe의 sticky sidebar step 구성 + Pretendard 한글 최적화"** — 이 네 축의 교집합이 우리 톤.

### Anti-reference (이런 건 피함)

- **BMW·Mercedes 제품 페이지** — 자동차/명품급 과한 WebGL, 로드 무거움, 매뉴얼 성격과 안 맞음
- **중소기업 B2B 사이트 (카피캣 템플릿)** — Bootstrap 흔적, 시장 평균 이하
- **카지노·게임 랜딩** — 과한 네온, 반짝임
- **스크롤 jack(강제 페이지 고정 너무 오래)** — 독자가 빠져나갈 때 짜증
- **자동재생 비디오 + 음소거 안 된 상태** — 절대 금지
- **커서 교체 (custom cursor)** — 접근성 해침

### 검수 기준 (R2 완료 시)

Phase R2 완성 후 아래를 모두 통과해야 R3로 넘어감:

- [ ] 랜딩이 apple.com/iphone과 "같은 카테고리"로 보이는가 (지인 3명 블라인드 테스트)
- [ ] 모션이 부드럽고 끊김 없는가 (60fps 유지, 크롬 Performance 탭)
- [ ] 타이포 hierarchy가 linear.app 수준으로 뚜렷한가
- [ ] 핫스팟 → popover → 딥링크 흐름이 figma.com 투어만큼 명료한가
- [ ] 다크/라이트 섹션 전환이 자연스러운가

---

## 확정된 아키텍처 결정

### 프레임워크 (Q1)

**Preact 10** 채택. 근거: Quartz가 이미 Preact 사용 → 번들러·tsconfig 공유, 추가 런타임 없음. Apple-style 복잡 애니는 Preact+Motion One 조합으로 충분하며, 실제 DOM 노드 수는 단일 페이지 당 수십 개 수준이라 React 생태계 필요성 낮음.

### 01-first-connection.md 처리 (Q2) — codex 지적 반영

**Quartz의 `aliases` emitter** 활용 (v2 plan의 `Plugin.AliasRedirects()`와 같은 메커니즘):

- 파일을 **삭제하지 않고**, frontmatter에 `aliases: ["/quickstart/01-first-connection"]`와 같이 별칭을 추가한 **투어 접근 stub 파일**로 전환
- 기존 `/quickstart/01-first-connection/` URL은 Quartz가 `aliases` emitter로 자동 meta-refresh redirect stub 생성 → `/tour/quickstart/01/`로 이동
- **XAML 검증·UI 문자열·토스트 색상·기본값은 투어 데이터(`tour/data/quickstart/01-first-connection.ts`)에 복사 이관** 후 원본은 git history에만 남김 (파일 삭제 commit으로 정리)
- **주의**: `draft: true`나 `ignorePatterns` glob 방식은 원본 URL 자체가 빌드에서 사라져 redirect 불가 — codex가 지적한 문제

### 스크린샷 (Q3)

**수동 PoC + Phase 3 병행**:
- 즉시: DabitOne 실행 → 주요 5창(통신·설정·전송·편집·고급) 수동 캡처, PNG 원본 `content/assets/screens/manual-poc/` 저장
- 해상도: 1920×1080 이상, 2배 DPI 권장 (Retina 대응)
- 병행: Phase 3 (DabitChe.Desktop `CaptureModeService`) 진행 → 완성 후 자동 갱신 파이프라인 교체

### Quartz 통합 방식 (ADR-006, codex 지적으로 (b) 선택 확정)

**선택: (b) Custom emitter**. 근거:

- **(c) Static asset + History API**: `/tour/quickstart/01/` 직접 진입·새로고침 시 정적 호스팅(GitHub Pages)에서 404 — 각 URL에 실제 HTML 파일이 필요.
- **(a) Layout frontmatter**: Quartz가 기본 지원 안 함, 결국 emitter 수정 필요.
- **(b) Custom emitter**: `TourEmitter`가 `/tour/`, `/tour/quickstart/<slug>/`, `/tour/accessible/` 각각에 HTML shell을 emit. 정적 호스팅 안전, deep link·새로고침 모두 OK.

**구현 요점 (Task R1.0에서 스파이크)**:
- `quartz/plugins/emitters/tourEmitter.ts` 신규 작성 — `Plugin.ContentPage`와 유사 구조
- 각 HTML shell: Quartz의 공통 `<head>`·navbar·footer 공유 + `<div id="tour-root">`에 `TourApp` Preact root 마운트
- 투어 상태는 **Quartz의 기존 SPA router 재사용** (one-router 원칙) — 독립 pushState 금지
- 클라이언트 script: 빌드 시 `quartz/components/scripts/tour.inline.ts`에서 entry 주입

### 오프라인 전략 (Codex 10, 사용자 확정)

**결론: 오프라인 대응 불필요**. 이유:

- 매뉴얼 주 타겟이 **레거시 사용자 재교육 + 신규 사용자 쇼케이스** — 이들은 온라인 환경.
- 현장 설치기사는 이미 숙지 상태, 이 매뉴얼의 주 고객 아님.
- 쇼케이스 성격이 강해 애니메이션·인터랙션 손실 허용 안 됨.

**결과**:
- **Service Worker 추가 안 함**
- **PDF는 optional 다운로드** — 공식 오프라인 경로 아님, 원하는 사용자만 참조용
- Reference markdown 페이지는 모바일·저속망에서도 빠르게 뜨도록 (Quartz 기본으로 충분)

---

## Phase 개요 (v3.1, codex 피드백 반영 재정렬)

| Phase | 목적 | 산출물 | 소요 추정 |
|-------|------|--------|----------|
| **R0. 정리 + audit + 캡처** | plan v3.1 커밋, 01 aliases 전환, 수동 스크린샷 5장, **PDF pipeline audit**(신규) | 깨끗한 배포 상태, 투어 자산 초안, PDF 상태 파악 | 0.5~1일 |
| **R1. 투어 앱 foundation** | **R1.0 ADR-006 스파이크 + deep-link/hosting 검증 + route contract**(앞당김), 스키마 확장·접근성 baseline·one-router, 최소 /tour shell | `/tour` 라우트 최소 페이지 동작 | 2~3일 |
| **R2. 랜딩 MVP** | Hero + Before/After 섹션 + 5탭 스크롤 스토리 + 핫스팟 (**Lenis 없이 CSS sticky + IO + Motion One**) | 랜딩 배포, 레거시 대비 쇼케이스 동작 | 2일 |
| **R3. Quickstart 투어 01** | TourScenario 엔진 + 01 완성 → **a11y/mobile/perf 게이트 필수 통과** (통과 후 02~08 진행) | 01 시나리오 완전 체험, 게이트 통과 | 1.5일 |
| **R4. Quickstart 02~08 + Reference markdown** | 나머지 7 시나리오 + UI Reference·Troubleshoot·File Format 본문 | 전체 시나리오 + Reference 완성 | 4일 |
| **R5. PDF pipeline** | build-pdf.mjs 신규/복구 작성 + 2권 분할 (Reference + Operation) | 2권 PDF optional | 1~1.5일 |
| **R6. Cross-link + redirects/SEO** | 투어 ↔ markdown 양방향 딥링크 + aliases + OG/canonical | 완전 연동 + SEO | 0.5일 |
| **R7. QA 감사** (감사만 — 구현은 상위 Phase에서) | 접근성·모바일·SEO·성능 감사, PR merge | main 배포 | 0.5일 |

**총 ~12~13일 (AI 단독 작업 기준)**

> **주의**: 접근성·모바일·성능은 **각 Phase의 Definition of Done에 포함**. R7은 감사만. 이렇게 배치하지 않으면 반드시 분기 구현이 되고 R7이 폭발.

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

### Task R0.2: 01-first-connection.md 삭제 + aliases redirect 준비 (codex 반영)

**Files:**
- Delete: `content/quickstart/01-first-connection.md` (git history에 남음)
- (후속) 투어 데이터에 UI 문자열·토스트 색상·기본값 복사 이관 (R3.2)

**배경**: 원 플랜의 `draft: true` 처리는 원본 URL이 빌드에서 사라져 redirect 불가 — codex 지적. `aliases` emitter가 redirect stub을 발행하려면 **타겟 경로(`/tour/quickstart/01/`)**에 있는 페이지의 frontmatter에 `aliases` 필드를 넣어야 함. 따라서 현 단계에서는:

1. 현 01 파일의 내용을 투어 데이터용으로 백업 (로컬 메모장 또는 git history 참조 가능)
2. 파일 삭제
3. 투어 emitter 작성(R1.0) 후 투어 페이지 생성 시 `aliases: ["/quickstart/01-first-connection/"]` 추가하여 이전 URL → 새 URL redirect 자동 생성

**Step 1: 내용 확인·백업** — `git show HEAD:content/quickstart/01-first-connection.md` 언제든 복원 가능

**Step 2: 삭제**

```bash
cd D:/GitHub/dabitone-manual
git rm content/quickstart/01-first-connection.md
```

**Step 3: 커밋 + 푸시**

```bash
git commit -m "chore(content): 01 markdown 제거 — 투어 앱으로 이관 (aliases redirect는 R1.0 이후)"
git push origin main
```

**Step 4 (후속 R1.0 이후 자동)**: TourEmitter가 `/tour/quickstart/01/`에 HTML shell 생성할 때 `aliases` 메타 포함 → Quartz가 `/quickstart/01-first-connection/index.html`에 meta refresh stub 자동 생성.

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

### Task R0.4: 레거시 before 스크린샷 수집 (Before/After 섹션용)

**사용자 수행:**

1. `D:\Gitea\dabitche\references\DabitChe-V2.2.1\` 또는 레거시 exe 실행해 주요 화면 캡처
2. 저장: `D:\GitHub\dabitone-manual\content\assets\screens\legacy-before\`
   - `legacy-comm.png` — 구버전 통신 설정 화면 (가능하면 DabitChe v9 기준)
   - `legacy-editor.png` — 구버전 편집기
   - `legacy-schedule.png` — 구버전 스케줄
3. 또는 `D:\Gitea\dabitche\references\DabitChe_UserManual_v9.0.pdf`에서 스크린샷 발췌·저장

**완료 기준:** 3~5장 PNG 확보, Before/After 비교에 쓸 만한 화질

```bash
git -C D:/GitHub/dabitone-manual add content/assets/screens/legacy-before/
git -C D:/GitHub/dabitone-manual commit -m "feat(content): 레거시 before 스크린샷 (쇼케이스 Before/After용)"
git -C D:/GitHub/dabitone-manual push origin main
```

---

### Task R0.5: PDF pipeline audit (codex 9 반영)

**배경**: 원 플랜은 `scripts/build-pdf.mjs`가 있다고 가정했지만 **현 repo에 없음**. v2 plan 산출물이 Gitea→GitHub 이전 시 누락. R5에서 "수정"이 아니라 "신규 작성" 가능성.

**Files:**
- Create: `docs/decisions/007-pdf-pipeline-audit.md`

**Step 1: 현황 점검**

```bash
ls D:/GitHub/dabitone-manual/scripts/ 2>/dev/null
ls D:/Gitea/dabitche/manual/scripts/ 2>/dev/null  # 원 저장소에 있는지 확인
```

**Step 2: 결정 문서 작성**

- v2 plan의 `build-pdf.mjs` 설계(Phase 5 Task 5.2) 참조하여 재구현 범위 산정
- Playwright·pdf-lib·serve-handler 설치 필요 여부
- 예상 소요 시간 업데이트 (플랜은 1~1.5일로 이미 수정됨)

**Step 3: 커밋**

```bash
git add docs/decisions/007-pdf-pipeline-audit.md
git commit -m "docs: ADR-007 PDF pipeline 현황 audit — R5 범위 재산정"
git push origin main
```

---

## Phase R1 — 투어 앱 foundation (codex 반영 재정렬)

> **핵심 변화**: R1.0(ADR-006 스파이크 + route contract + 호스팅 검증)를 **맨 앞으로**. 원 플랜 R1.5가 뒤에 있던 탓에 R1.1~R1.4 재작업 리스크 높았음. 또한 접근성 baseline(focus trap·Escape·live region)을 R1 컴포넌트 구현에 포함, R7에서 분기 구현 방지.

### Task R1.0: ADR-006 스파이크 + deep-link 검증 + route contract 확정 [신규, 최우선]

**목적**: Custom emitter 방식이 실제로 동작하는지, Quartz SPA router와 충돌 없이 deep link이 유지되는지 검증.

**Files:**
- Create: `docs/decisions/006-tour-app-integration.md`
- Create: `quartz/plugins/emitters/tourEmitter.ts` (스파이크 버전)
- Create: `docs/decisions/008-route-contract.md`

**Step 1: Quartz emitter·router 소스 숙지**

- 읽기: `quartz/plugins/emitters/contentPage.tsx`, `aliases.ts`, `quartz/components/scripts/spa.inline.ts`
- 핵심 확인: emit 시그니처, SPA router의 `document.body` diff 방식, `data-router-ignore` 같은 escape hatch 존재 여부

**Step 2: 최소 TourEmitter 스파이크**

- `/tour/` 단일 HTML shell 생성, 본문에 "tour root" div만
- Quartz 빌드 후 `http://localhost:8080/tour` 접근 확인
- 새로고침·뒤로가기·외부 링크에서 진입 모두 테스트

**Step 3: one-router 원칙 결정**

- (A) Quartz SPA router 재사용 — 투어 내부 링크도 `<a href>` 기반
- (B) `data-router-ignore` 서브트리로 Quartz router 차단 + 투어 자체 router 운용

**Step 4: route contract `008-route-contract.md` 작성**

URL 규약:
```
/tour/                          → 랜딩 투어 홈
/tour/quickstart/<slug>/        → 시나리오 진입 (step 1)
/tour/quickstart/<slug>/?s=N    → 특정 스텝 (query string, History API 오염 최소)
/tour/accessible/               → 접근성 대안 경로 (같은 데이터, 텍스트 렌더)
```

> **쿼리 스트링 기반 step 선택**: path에 step까지 넣으면 Quartz SPA router diff와 충돌 가능. query string은 path-layer 아래라 router는 `<slug>/`까지만 보고, 스텝 전환은 클라이언트 hydrate 후 처리.

**Step 5: 접근성 route baseline**

- `/tour/accessible/`은 **같은 TourStep 데이터에서 텍스트 렌더** — 별도 콘텐츠 금지
- focus trap·Escape close·focus restore·step-change live region을 R1.2 컴포넌트 spec에 포함

**Step 6: 커밋**

```bash
git add quartz/plugins/emitters/tourEmitter.ts docs/decisions/006-tour-app-integration.md docs/decisions/008-route-contract.md
git commit -m "feat(tour): R1.0 ADR-006 (b) + route contract + emitter 스파이크"
git push origin main
```

**완료 기준**: `/tour/`가 200 OK로 뜨고, 새로고침·딥링크 모두 동작. route contract·one-router 원칙 문서화 완료.

---

### Task R1.1: 디렉토리 구조 + 의존성 (codex 6 반영 스키마 확장)

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

**Step 2: 의존성 설치 (Lenis 제외 — codex 7 반영)**

```bash
cd D:/GitHub/dabitone-manual
npm install --save motion @preact/signals
npm install --save-dev @types/node
```

> Preact는 Quartz가 이미 설치. `motion`은 Motion One 패키지명. **Lenis는 R2 spike에서 필요성 증명 시만 추가** — MVP는 CSS sticky + IntersectionObserver로 충분.

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

**Step 4: `tour/src/types.ts` — codex 6 반영 확장 스키마**

```typescript
/**
 * 이미지 자산 기본 정보 (비율 유지·alt·파일 존재 검증용)
 */
export interface ImageAsset {
  src: string;           // 예: /assets/screens/manual-poc/main-comm.png
  width: number;         // 원본 px
  height: number;        // 원본 px
  alt: string;           // 스크린 리더용 이미지 요약
}

/**
 * 핫스팟 — 좌표 + 선택적 하이라이트 박스
 * x, y는 image width/height 대비 % (0~100)
 */
export interface Hotspot {
  x: number;
  y: number;
  /** 핫스팟 중심 주위의 하이라이트 사각형 박스 (선택) */
  box?: { w: number; h: number };  // % 단위
  /** 스크린 리더용 짧은 라벨 (필수) */
  ariaLabel: string;
  /** 시각 라벨 (hover/focus 시 표시) */
  label: string;
}

/**
 * 투어 단일 스텝
 */
export interface TourStep {
  id: string;
  title: string;
  description: string;
  image: ImageAsset;              // screenshot (확장)
  hotspot?: Hotspot;
  /** 모바일·터치용 다른 좌표/박스가 필요하면 오버라이드 (선택) */
  mobileHotspot?: Partial<Hotspot>;
  /** 스크린 리더용 전체 서사 (visual popover가 필요 없는 사용자) */
  srSummary: string;
  tips?: string[];
  nextHint?: string;
  /** 관련 markdown reference 페이지들 (R6 cross-link) */
  relatedRefs?: Array<{ label: string; path: string }>;
}

export interface Tour {
  slug: string;
  title: string;
  subtitle: string;
  steps: TourStep[];
  nextTour?: string;
}

/**
 * 랜딩 핫스팟
 */
export interface LandingHotspot {
  id: string;
  hotspot: Hotspot;
  summary: string;
  tourSlug: string;
}

export interface LandingData {
  hero: {
    title: string;
    subtitle: string;
    heroImage: ImageAsset;
  };
  hotspots: LandingHotspot[];
  /** Before/After 섹션 (R2.X, 레거시 대비) */
  whatsNew: Array<{
    title: string;
    caption: string;
    before: ImageAsset;
    after: ImageAsset;
  }>;
}

/**
 * 빌드 타임 검증: 모든 image.src 파일이 실제 존재하는지
 * (TourEmitter가 빌드 중 실행)
 */
export function validateImageAsset(asset: ImageAsset, projectRoot: string): void {
  // 구현: R1.0 emitter에서 fs.existsSync 체크
  // 없으면 빌드 실패
}
```

**스키마 변경 요점**:
- `screenshot: string` → `image: ImageAsset` (width·height·alt 필수)
- `hotspot.label` → `hotspot.ariaLabel` + `hotspot.label` 분리 (SR과 visual 구분)
- `mobileHotspot` 신규 — breakpoint 대응
- `srSummary` 신규 — 스크린 리더·accessible 라우트에서 대안 렌더
- `relatedRefs` 신규 — R6 cross-link 데이터 주입용

**Step 5: 커밋**

```bash
git add tour/ package.json package-lock.json
git commit -m "feat(tour): foundation — Preact + Motion One + 타입 스키마"
git push origin main
```

---

### Task R1.2: Motion One wrapper (Lenis는 MVP 제외 — codex 7 반영)

**Files:**
- Create: `tour/src/lib/motion.ts`
- Create: `tour/src/lib/observe.ts` (IntersectionObserver helper, Lenis 대체)

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

**Step 2: IntersectionObserver helper (Lenis 대신, MVP)**

```typescript
// tour/src/lib/observe.ts
import { animate } from "./motion";

/**
 * 요소가 뷰포트에 진입하면 한 번 reveal 애니.
 * Lenis smooth scroll 없이도 CSS sticky + IO로 섹션 연출 충분.
 */
export function revealOnEnter(el: HTMLElement, delay = 0) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          animate(
            e.target,
            { opacity: [0, 1], transform: ["translateY(32px)", "translateY(0)"] },
            { duration: 0.8, delay },
          );
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.25, rootMargin: "0px 0px -10% 0px" },
  );
  io.observe(el);
  return io;
}
```

**Step 3: 커밋**

```bash
git add tour/src/lib/motion.ts tour/src/lib/observe.ts
git commit -m "feat(tour): Motion One 래퍼 + IntersectionObserver (Lenis 제외, MVP)"
git push origin main
```

> **Lenis 재도입 조건**: R2 spike에서 CSS sticky+IO로 부족하다는 증거(구체적: 섹션 lock이 뚝뚝 끊김, 스크롤 휠 가속이 "싼 느낌" 등)가 나올 때만 `npm install lenis` + 별도 Task 추가. GSAP은 pinned multi-track scrub가 반드시 필요할 때만.

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

### Task R1.4: 핵심 컴포넌트 — Hotspot + Popover + LiveRegion (codex 5 접근성 baseline 반영)

**Files:**
- Create: `tour/src/components/Hotspot.tsx`
- Create: `tour/src/components/Popover.tsx`
- Create: `tour/src/components/LiveRegion.tsx` (step change 알림용)
- Create: `tour/src/lib/focusTrap.ts` (포커스 함정)

**접근성 요구사항 (모든 컴포넌트에 필수)**:
- Popover 열릴 때 **focus trap** 적용 (Tab·Shift+Tab이 popover 내부에만 돌기)
- Popover 닫힐 때 **focus restore** (열기 전에 포커스 있던 요소로 복귀)
- **Escape 키**로 닫기
- step 변경 시 **aria-live="polite"** live region이 제목·설명을 읽어줌
- 키보드 전용 사용자가 투어 완주 가능
- `prefers-reduced-motion` 존중 (tokens.css의 미디어쿼리 + motion wrapper 이미 처리)

**Step 1: `lib/focusTrap.ts`**

```typescript
export function createFocusTrap(container: HTMLElement) {
  const previouslyFocused = document.activeElement as HTMLElement | null;
  const focusables = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
  );
  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  function onKey(e: KeyboardEvent) {
    if (e.key !== "Tab") return;
    if (focusables.length === 0) return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  }

  container.addEventListener("keydown", onKey);
  first?.focus();

  return () => {
    container.removeEventListener("keydown", onKey);
    previouslyFocused?.focus?.();
  };
}
```

**Step 2: `Hotspot.tsx` — pulse ring + 키보드 포커스 + aria-label 분리**

```tsx
import { useEffect, useRef, useState } from "preact/hooks";
import { animate, reducedMotion } from "../lib/motion";
import type { Hotspot as HotspotData } from "../types";

interface Props {
  data: HotspotData;
  onActivate: () => void;   // click OR Enter/Space
}

export function Hotspot({ data, onActivate }: Props) {
  const ringRef = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!ringRef.current || reducedMotion()) return;
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
      style={{ left: `${data.x}%`, top: `${data.y}%` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}     // 키보드 포커스 시 라벨 표시
      onBlur={() => setHovered(false)}
      onClick={onActivate}
      aria-label={data.ariaLabel}
    >
      <span class="hotspot__ring" ref={ringRef} aria-hidden="true" />
      <span class="hotspot__dot" aria-hidden="true" />
      {hovered && <span class="hotspot__label">{data.label}</span>}
    </button>
  );
}
```

**Step 3: `Popover.tsx` — focus trap + Escape + focus restore**

```tsx
import { useEffect, useRef } from "preact/hooks";
import { animate } from "../lib/motion";
import { createFocusTrap } from "../lib/focusTrap";

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
    const releaseFocus = createFocusTrap(cardRef.current);
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      releaseFocus();    // focus restore
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div class="popover__backdrop" ref={backdropRef} onClick={onClose}>
      <div
        class="popover__card"
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="popover-title"
      >
        <h3 class="popover__title" id="popover-title">{title}</h3>
        <div class="popover__body">{children}</div>
        {cta && (
          <a class="popover__cta" href={cta.href}>
            {cta.label} →
          </a>
        )}
        <button class="popover__close" onClick={onClose} aria-label="닫기">×</button>
      </div>
    </div>
  );
}
```

**Step 4: `LiveRegion.tsx` — step 변경·성공 토스트 알림**

```tsx
import { useEffect, useRef } from "preact/hooks";

interface Props {
  /** 새 메시지가 바뀌면 SR이 읽어줌. 빈 문자열이면 읽지 않음. */
  message: string;
  /** assertive면 즉시, polite면 다른 발화 끝난 뒤 */
  mode?: "polite" | "assertive";
}

export function LiveRegion({ message, mode = "polite" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    // Content 바뀔 때마다 SR이 발화하도록 강제
    ref.current.textContent = "";
    const t = setTimeout(() => {
      if (ref.current) ref.current.textContent = message;
    }, 50);
    return () => clearTimeout(t);
  }, [message]);
  return <div ref={ref} aria-live={mode} aria-atomic="true" class="sr-only" />;
}
```

`.sr-only` CSS는 tokens.css 또는 app.css에 추가:
```css
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  margin: -1px; padding: 0;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
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

### Task R1.5: 상태 관리 + 진행률 localStorage (codex 3 one-router 반영 — 독립 라우터 제거)

**Files:**
- Create: `tour/src/lib/state.ts` (Signals 기반 상태)
- Create: `tour/src/lib/storage.ts` (진행률)

**핵심 변경 (vs 원 플랜의 R1.7)**:
- **독립 `router.ts` 삭제** — codex 3 지적. Quartz의 SPA router 재사용. 투어 내부 링크는 `<a href>`.
- 스텝 간 이동은 URL path 변경 대신 **query string `?s=N`** 또는 **signals state**로 처리 (R1.0 route contract 참조)

**Step 1: `state.ts` — 현재 투어·스텝 signals**

```typescript
import { signal, computed } from "@preact/signals";

export const currentStepIndex = signal(0);
export const currentTourSlug = signal<string | null>(null);
export const popoverOpen = signal<{ id: string } | null>(null);

export function gotoStep(n: number) {
  currentStepIndex.value = Math.max(0, n);
  const url = new URL(window.location.href);
  url.searchParams.set("s", String(n));
  // replaceState — Quartz router에 영향 없이 같은 path 내 state만
  window.history.replaceState({}, "", url.toString());
}

// 초기화 시 query string에서 step 복원
export function hydrateFromUrl() {
  const s = new URL(window.location.href).searchParams.get("s");
  if (s) currentStepIndex.value = parseInt(s, 10) || 0;
}
```

**Step 2: `storage.ts` — 진행률**

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

**Step 3: 커밋**

```bash
git add tour/src/lib/state.ts tour/src/lib/storage.ts
git commit -m "feat(tour): signals 상태 + 진행률 localStorage (one-router, Quartz SPA router 재사용)"
git push origin main
```

---

### Task R1.6: `/tour` 최소 shell 배포

**Files:**
- Modify: `quartz/plugins/emitters/tourEmitter.ts` (R1.0 스파이크를 완성)
- Create: `tour/src/pages/Landing.tsx` (Hello World 수준)
- Create: `tour/src/index.tsx` (Preact 마운트 엔트리)

**Step 1: Landing.tsx 최소 구현**

"DabitOne 투어" 헤드라인 + Pretendard 적용 + 토큰 CSS 적용 확인

**Step 2: TourEmitter 완성**

R1.0 스파이크에서 시작한 emitter가 `/tour/index.html` + `/tour/quickstart/<slug>/index.html`(스텁) 발행하도록

**Step 3: 로컬 빌드**

```bash
cd D:/GitHub/dabitone-manual
npx quartz build --serve
# → http://localhost:8080/tour 헤드라인 렌더 확인
# → http://localhost:8080/tour/quickstart/01-first-connection 직접 진입 200 확인
# → 새로고침 후에도 정상
```

**Step 4: 커밋 + 푸시**

```bash
git add quartz/plugins/emitters/tourEmitter.ts tour/src/pages/Landing.tsx tour/src/index.tsx
git commit -m "feat(tour): R1.6 /tour 최소 shell + emitter 완성 + 토큰·Pretendard 적용"
git push origin main
# → https://dabitone.dabitsol.com/tour 실제 확인
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
    subtitle: "DabitOne으로 다빛솔루션 LED 전광판을 운영하세요.",
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

### Task R2.1b: Hero 카피 후보 확정 + Before/After 섹션 데이터 정의 [신규, 타겟 오디언스 반영]

**배경**: 이 섹션이 **레거시 사용자를 설득하는 핵심**. 랜딩에서 Hero 바로 다음에 와서 "5년 만에 이렇게 달라졌다"는 메시지를 전달.

**Files:**
- Modify: `tour/data/landing.ts` — `whatsNew` 필드 (types.ts에서 이미 정의됨) 데이터 추가
- Create: `tour/src/components/WhatsNew.tsx`

**Step 1: Hero 카피 확정**

후보 중 사용자와 1개 확정 (또는 AI 제안 + 검토):
- (A) "5년을 기다린 DabitOne. 익숙했던 것을 더 우아하게."
- (B) "DabitChe는 이제 DabitOne입니다. 전광판 운영, 다시 설계했습니다."
- (C) "같은 컨트롤러, 새로운 경험."
- (D) "6년 만의 리프레시. 당신이 알던 기능은 그대로, 손끝 감각은 전부 새로."

**Step 2: `whatsNew` 데이터 작성** — 3~5개 Before/After 대비

```typescript
// tour/data/landing.ts (발췌)
export const landing: LandingData = {
  hero: { /* ... */ },
  hotspots: [ /* ... */ ],
  whatsNew: [
    {
      title: "통신 설정, 한 화면에",
      caption: "예전엔 Serial·TCP·UDP가 각자 별도 창이었습니다. 이제 한눈에 보고 바로 바꿉니다.",
      before: { src: "/assets/screens/legacy-before/legacy-comm.png", width: 1200, height: 800, alt: "레거시 DabitChe의 통신 설정 화면" },
      after: { src: "/assets/screens/manual-poc/main-comm.png", width: 1920, height: 1080, alt: "DabitOne의 통일된 통신 설정 화면" },
    },
    {
      title: "편집기, 드래그 앤 드롭",
      caption: "Word처럼, 정말로. 글자를 쓰고, 이미지를 끌어다 놓으세요.",
      before: { src: "/assets/screens/legacy-before/legacy-editor.png", width: 1024, height: 768, alt: "레거시 편집기" },
      after: { src: "/assets/screens/manual-poc/main-editor.png", width: 1920, height: 1080, alt: "DabitOne 편집기" },
    },
    {
      title: "디자인 시스템",
      caption: "Windows 95 체크리스트가 아닌, 2026의 UI.",
      before: { src: "/assets/screens/legacy-before/legacy-schedule.png", width: 1024, height: 768, alt: "레거시 스케줄러" },
      after: { src: "/assets/screens/manual-poc/main-simulator.png", width: 1920, height: 1080, alt: "DabitOne 전송 탭" },
    },
    // 필요 시 2개 더 추가
  ],
};
```

**Step 3: `WhatsNew.tsx` 컴포넌트**

- 각 항목이 100vh 섹션
- 상단: 제목(fs-title) + 캡션(fs-body)
- 중앙: Before ↔ After 가로 분할 스크러버(드래그로 비율 조정) 또는 스크롤 진행도에 따라 opacity crossfade
- 스크롤 진입 시 IntersectionObserver reveal

**Step 4: Landing.tsx에 배치**

Hero → **WhatsNew 섹션 (5년 만의 변화)** → 5탭 핫스팟 설명 → PDF 카드 → Footer 순서

**Step 5: 커밋 + 푸시**

```bash
git commit -m "feat(tour): R2.1b Hero 카피 + Before/After 5년 변화 쇼케이스"
git push origin main
```

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
      description: "DabitOne을 실행하면 좌측 사이드바 맨 위의 [통신] 탭이 기본으로 선택되어 있고, 우측에 '통신 설정' 창이 뜹니다.",
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

### Task R3.2b: **GATE** — 01 완성 후 a11y/mobile/perf 체크 (codex 5 반영)

**핵심**: 01만 완성되고 **나머지 02~08 진행 전** 아래 기준 모두 통과해야 함. 통과 못 하면 게이트에서 멈추고 수정.

**체크리스트**:
- [ ] Lighthouse Accessibility ≥ 95 (01 페이지)
- [ ] 키보드만으로 01 투어 완주 가능 (Tab·Enter·Escape·Shift+Tab)
- [ ] NVDA로 step 변경마다 제목·설명 발화 확인
- [ ] iPhone 14 에뮬레이션에서 01 투어 완주 (터치 타겟 ≥ 44px, Prev/Next 동작)
- [ ] Lighthouse Performance ≥ 80 (Moto G Power, 4G Slow)
- [ ] `/tour/accessible/`에서 01 스텝 전체가 텍스트로 렌더

**GATE 실패 시 액션**: R1.4 컴포넌트 보정 Task 생성, 02~08 진입 보류.

---

### Task R3.3 ~ R3.9: Quickstart 02~08 투어 데이터 (GATE 통과 후 실행)

각 파일:
- `tour/data/quickstart/02-screen-size.ts`
- `tour/data/quickstart/03-send-message.ts`
- ... (08까지)

각 투어 3~5 스텝, XAML·기술 문서 참조하여 정확한 UI 문자열 사용. 각 데이터에 `relatedRefs`, `srSummary`, `mobileHotspot`(필요 시) 포함.

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

## Phase R5 — PDF (Reference만) — codex 9 반영 재작성

> **주의**: 원 플랜은 `scripts/build-pdf.mjs` 수정을 가정했으나 현 repo에 파일 없음. R0.5 audit 결과 반영하여 신규 작성.

### Task R5.1: build-pdf.mjs 신규 작성 (Reference + Operation 2권)

**Files:**
- Create: `scripts/build-pdf.mjs`
- Modify: `package.json` (playwright·pdf-lib·serve-handler devDependencies)

**Step 1: CHAPTERS 재정의**

```javascript
const CHAPTERS = [
  {
    name: 'Reference',
    title: 'DabitOne 매뉴얼 — UI 레퍼런스편',
    includes: [/^ui-reference\//, /^file-formats\//],
  },
  {
    name: 'Operation',
    title: 'DabitOne 매뉴얼 — 운영·문제해결편',
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

R2.5에서 이미 2권 카드 작성. URL 확정: `/pdf/DabitOne_Manual_Reference.pdf`, `/pdf/DabitOne_Manual_Operation.pdf`.

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

## Phase R7 — 종합 QA 감사 (구현은 상위 Phase에서, 여기는 감사만 — codex 5 반영)

> **주의**: 접근성·모바일·성능·SEO 구현 자체는 각 Phase의 Definition of Done에 이미 포함됨 (R1 컴포넌트·R2 랜딩·R3 스텝 엔진·R6 cross-link). R7은 **감사·체크리스트 검증·버그 패치**만.

### Task R7.1: 접근성 감사 (구현은 R1.4·R3에 이미 완료)

**감사 항목 (구현 검증)**:
- [ ] 스크린 리더(NVDA + Windows)로 투어 01 완주 — 제목·설명·hotspot·popover 모두 발화
- [ ] `/tour/accessible` 경로가 같은 데이터로 텍스트 기반 렌더 (별도 콘텐츠 없음)
- [ ] Tab 키만으로 투어 시작 → 스텝 이동 → 링크 진입 → 뒤로가기 완주
- [ ] Escape로 popover 닫힘 + focus restore
- [ ] `prefers-reduced-motion` ON 시 모든 애니 ≤ 100ms, sticky 해제
- [ ] Lighthouse Accessibility ≥ 95

**구현 결함 발견 시**: R1.4 컴포넌트 수정 Task 추가 (R7은 감사이므로 수정 책임 이동)

### Task R7.2: 모바일 감사 (구현은 R2·R3에 이미 완료)

**감사 항목**:
- [ ] iPhone 14 / Galaxy S23 에뮬레이션에서 투어 01 완주
- [ ] 터치 타겟 모두 ≥ 44×44px
- [ ] Hover-only 라벨이 모두 focus/tap으로 대체 노출
- [ ] Prev/Next 버튼이 기본 조작, 스와이프는 stage 내부에서만
- [ ] 세로 스크롤과 제스처 경합 없음 (`touch-action: pan-y`)

### Task R7.3: 성능 감사

- [ ] Lighthouse Performance ≥ 85 (Moto G Power, 4G Slow)
- [ ] JS 번들 총 ≤ 150KB gzipped (투어 앱만)
- [ ] 랜딩 초기 로드 ≤ 3초 (Fast 3G)
- [ ] 투어 진입 ≤ 1초
- [ ] 이미지 lazy + responsive srcset (AVIF 우선, WebP fallback)

### Task R7.4: SEO + Open Graph

- [ ] 랜딩 meta: 제목, description, og:image 히어로
- [ ] 투어 각 시나리오 개별 meta
- [ ] Reference 페이지 canonical, OG 태그
- [ ] sitemap.xml, robots.txt, contentIndex.json 유효
- [ ] aliases redirect가 SERP에 중복 URL을 만들지 않는지(canonical 우선)

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
