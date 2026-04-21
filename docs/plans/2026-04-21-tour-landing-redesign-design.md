# DabitOne /tour/ 랜딩 재설계 — Design Doc

**일자**: 2026-04-21
**세션**: brainstorming 후속 재설계 (v3.1 R2 결과물 미감 보강)
**참고 스킬**: `frontend-design` (Anthropic 공식, SKILL.md 방법론 준용)

## 배경

v3.1 R0~R7 완료 후 사용자 피드백: 기존 `/tour/` 랜딩이 "우스꽝스럽고 창피당하는 느낌", DabitOne 가치를 훼손. 원인 3가지:

1. Hero 배경 이미지를 `opacity: 0.55` + radial black shade로 덮어 **제품을 장식으로 격하**. 플랜 §151·§154 지시("제품을 거대한 단일 숏으로 당당히")와 정반대 구현.
2. Before/After 2열 정적 그리드 + grayscale 처리 = **싸구려 비교광고 톤**. 타겟 오디언스 양쪽(신규·기존) 모두에게 불필요 (신규는 모르고 기존은 이미 암).
3. Hero와 Hotspots가 **동일 이미지(main-comm.png) 중복** 사용 → 페이지 빈약.

## 결정

### 구조
- Hero → 편집기 하이라이트(신규) → 5-tab Hotspots → PDF Footer
- **WhatsNew Before/After 섹션 제거**. 타입 `whatsNew` 필드 삭제.

### Aesthetic direction — commit: **Refined / Restrained luxury**
Apple iPhone·Linear·Stripe 공통 결. 절제, 여백, 정밀한 타이포, 미묘한 모션. 제품 자체의 완성도가 주인공.

### 토큰 변경 (`tokens.css`)
- `--tour-ls-tight`: -0.03em → **-0.04em**
- `--tour-fs-hero`: clamp(48, 8vw, 120) → **clamp(96, 12vw, 160)**
- Accent 재정의: `--tour-c-accent`: #2563eb → **#0066FF** (DabitChe 원 블루, 채도 ↑)
- 섹션 배경 light ↔ dark 교차 스케일 유지

### Hero 세부
- 배경: 다크 → `linear-gradient(180deg, #FFFFFF 0%, #F0F0F0 100%)`
- **좌측 정렬** (asymmetric luxury, 현재 중앙 변경)
- Copy: `DabitOne.` / `새로운 전광판 운영 경험.` (레거시 호명 "당신이 알던" 제거)
- Product image: opacity 1.0, 하단 full-bleed. `scale(0.96→1.0) + opacity(0→1)` fade-in
- Title word-by-word stagger (어절 단위 80ms 간격)
- `↓` scroll hint 제거 (이미지 하단 걸침이 자연 힌트)

### 구현 단계 (리스크 축소)
- **Phase A** (이번 세션): Hero 재구현 + WhatsNew 제거. Hotspot·PDF는 손대지 않음. 토큰 변경은 Hero 관련만.
- **Phase B** (Hero 승인 후): 편집기 하이라이트 섹션 신규, Hotspot 섹션 `#0A0A0A` 다크 반전
- **Phase C**: PDF 섹션 타이포·간격 정돈, 전체 토큰 일관화 감사

## 레퍼런스 (tone commit 근거)
- apple.com/kr/iphone-16 — Hero 타이포 + 제품 하단 full-bleed
- linear.app — 섹션간 light↔dark 전환
- stripe.com — refined luxury 미묘 모션 예시

## 의도적 배제
- GSAP ScrollTrigger, Lenis smooth scroll (플랜 codex 권고 따름)
- word-by-word reveal은 영문 대응이며 **한국어는 어절 단위로 재해석**
- Before/After crossfade 스크러버 (플랜 §58) — 섹션 자체 제거로 사문화

## 위험 / 대응
- **"한 번에 다 바꿨다가 또 별로" 리스크** → Phase A만 먼저 배포. 사용자가 브라우저 확인 후 tone·정렬·색상 세부를 결정 (사용자 선호: "실제 구현 보고 판단")
- **핫스팟 이미지와 Hero 이미지 중복** → Phase B에서 Hotspot 섹션 다크 반전으로 문맥 차별화
- **모바일에서 Hero title clamp(96~160) 너무 큼 가능** → viewport 기반 clamp로 자동 축소, 실제 렌더 확인 필요

## 성공 기준
- Phase A 배포 후 사용자가 "창피하지 않음" 확인
- 데스크톱·모바일 둘 다에서 Hero 한 스와이프에 읽힘
- 제품 이미지가 주인공으로 보임 (opacity 1.0 + 중심 위치)
