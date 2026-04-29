/**
 * 투어 앱 공유 타입.
 * 플랜 v3.1 Phase R1.1 Step 4 (codex finding 6 반영 확장 스키마) 기준.
 */

/**
 * 이미지 자산 — 비율 유지·alt·빌드 시 파일 존재 검증.
 */
export interface ImageAsset {
  src: string // 예: /assets/screens/manual-poc/main-comm.png
  width: number
  height: number
  alt: string
}

/**
 * 핫스팟 — 이미지 위 좌표 + 선택적 하이라이트 박스.
 * x, y는 이미지 width/height 대비 % (0~100).
 */
export interface Hotspot {
  x: number
  y: number
  /** 핫스팟 주위 하이라이트 사각형 (선택). x, y를 중심으로 w/h만큼의 영역. */
  box?: { w: number; h: number }
  /** 스크린 리더용 짧은 라벨 (필수). */
  ariaLabel: string
  /** 시각 라벨 (hover/focus 시 표시). */
  label: string
}

/**
 * 분기 옵션 — step 끝에서 다음 갈 곳을 사용자가 선택.
 * toStepId: 같은 quickstart 안 step id로 jump.
 * toTour: 다른 quickstart slug로 이동.
 */
export interface NextOption {
  label: string
  toStepId?: string
  toTour?: string
  primary?: boolean
}

/**
 * 투어 단일 스텝.
 */
export interface TourStep {
  id: string
  title: string
  description: string
  image: ImageAsset
  hotspot?: Hotspot
  /** 모바일 breakpoint 대응 hotspot 좌표 덮어쓰기. */
  mobileHotspot?: Partial<Hotspot>
  /** 스크린 리더·/accessible/ 대안 렌더용 전체 서사 (visual 없이도 이해 가능). */
  srSummary: string
  tips?: string[]
  nextHint?: string
  /** 관련 markdown reference 페이지 — R6 cross-link 데이터. */
  relatedRefs?: Array<{ label: string; path: string }>
  /** 분기 — 있으면 "다음 →" 버튼 대신 옵션 버튼들이 표시됨. */
  nextOptions?: NextOption[]
}

/**
 * 시나리오 투어.
 */
export interface Tour {
  slug: string
  title: string
  subtitle: string
  steps: TourStep[]
  nextTour?: string
}

/**
 * 랜딩 페이지 핫스팟 — 5 탭 대응.
 */
export interface LandingHotspot {
  id: string
  hotspot: Hotspot
  summary: string
  tourSlug: string
}

/**
 * 랜딩 페이지 전체 데이터.
 */
export interface LandingData {
  hero: {
    title: string
    subtitle: string
    heroImage: ImageAsset
  }
  hotspots: LandingHotspot[]
}
