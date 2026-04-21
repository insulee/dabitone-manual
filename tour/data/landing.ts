/**
 * 랜딩 페이지 데이터 — Hero + 5 핫스팟.
 * 2026-04-21 재설계: 레거시 호명 제거, "DabitOne." / "새로운 전광판 운영 경험."
 * 핫스팟 좌표는 main-comm.png (1422×1386) 기준 % 값. 실제 렌더 후 시각 검증으로 조정.
 */
import type { LandingData } from "../src/types"

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

const HOTSPOTS: LandingData["hotspots"] = [
  {
    id: "nav-connect",
    hotspot: {
      x: 8,
      y: 19,
      ariaLabel: "통신 탭 — 컨트롤러 연결",
      label: "통신",
    },
    summary:
      "Serial·TCP·UDP·BLE·MQTT·dbNet을 한 화면에 모았습니다. 예전엔 별도 창으로 흩어져 있던 설정이 이제 한눈에 보이고 한 번에 바뀝니다.",
    tourSlug: "01-first-connection",
  },
  {
    id: "nav-setup",
    hotspot: {
      x: 8,
      y: 23,
      ariaLabel: "설정 탭 — 화면 크기·시계·밝기",
      label: "설정",
    },
    summary:
      "화면 크기, 색상 깊이, 시계, 밝기 스케줄 등 컨트롤러의 기본 운영 설정을 모았습니다. 값이 바뀌면 바로 저장, 복잡한 확인창 없이 깔끔하게.",
    tourSlug: "02-screen-size",
  },
  {
    id: "nav-simulator",
    hotspot: {
      x: 8,
      y: 27,
      ariaLabel: "전송 탭 — 메시지·스케줄 전송",
      label: "전송",
    },
    summary:
      "편집한 메시지와 스케줄을 컨트롤러로 전송합니다. 진행률·재시도·실패 분석이 더 선명해졌습니다.",
    tourSlug: "03-send-message",
  },
  {
    id: "nav-editor",
    hotspot: {
      x: 8,
      y: 31,
      ariaLabel: "편집 탭 — 텍스트·이미지·GIF 제작",
      label: "편집",
    },
    summary:
      "텍스트·이미지·GIF 제작 환경을 전면 재설계했습니다. 드래그 앤 드롭이 됩니다. 정말로.",
    tourSlug: "04-edit-image",
  },
  {
    id: "nav-advanced",
    hotspot: {
      x: 8,
      y: 35,
      ariaLabel: "고급 탭 — 펌웨어·로그·진단",
      label: "고급",
    },
    summary:
      "펌웨어 업데이트, 로그, 진단 등 고급 운영 기능을 모았습니다. 신규 사용자에겐 안 보여도 전문가에겐 바로 손에 닿는 곳에.",
    tourSlug: "08-firmware",
  },
]

export const landing: LandingData = {
  hero: HERO,
  hotspots: HOTSPOTS,
}
