/**
 * Quickstart 05 — 고급 설정.
 * 보드기능설정, 펌웨어 업데이트, 기타 컨트롤러 설정 관리.
 */
import type { Tour } from "../../src/types"

const SCREEN = {
  src: "/assets/screens/manual-poc/main-advanced.png",
  width: 1422,
  height: 1386,
  alt: "DabitOne 고급 설정 탭 — 시간설정·보드기능설정·펌웨어 업데이트·기타 설정",
} as const

const tour: Tour = {
  slug: "05-advanced",
  title: "고급 설정",
  subtitle: "보드기능·펌웨어·기타 설정 관리",
  steps: [
    {
      id: "step-1-tab",
      title: "[고급] 탭 이동",
      description:
        "좌측 사이드바에서 [고급] 탭을 클릭합니다.\n시간설정, 보드기능설정, 펌웨어 업데이트, 정보문구 설정, 시리얼 모니터 등 컨트롤러의 다양한 고급 기능을 한곳에서 관리합니다.",
      image: SCREEN,
      hotspot: { x: 3, y: 37, ariaLabel: "고급 탭", label: "고급" },
      srSummary:
        "고급 탭에서 시간·보드기능·펌웨어·정보문구·시리얼모니터 등 컨트롤러 고급 기능을 통합 관리합니다.",
    },
    {
      id: "step-2-board",
      title: "보드기능설정",
      description:
        "[읽기] 버튼을 눌러 컨트롤러의 현재 보드기능설정(디버깅 여부, BH1·J2·J3·J4 Function/Baud, RS485 Address 등)을 불러와 확인합니다.\n값을 변경한 뒤 [저장] 버튼을 누르면 컨트롤러에 적용됩니다.",
      image: SCREEN,
      hotspot: {
        x: 8,
        y: 21,
        ariaLabel: "보드기능설정 영역",
        label: "보드기능설정",
        box: { w: 30, h: 35 },
      },
      srSummary:
        "보드기능설정 영역의 [읽기]로 현재 값을 불러오고 변경 후 [저장]으로 컨트롤러에 적용합니다.",
    },
    {
      id: "step-3-firmware",
      title: "펌웨어 업데이트",
      description:
        "[펌웨어 읽기] 버튼으로 컨트롤러의 현재 펌웨어 정보를 확인합니다.\n[열기] 버튼으로 새 펌웨어 파일을 선택하고 [전송] 버튼을 누르면 업데이트가 진행됩니다.",
      image: SCREEN,
      hotspot: {
        x: 40,
        y: 10,
        ariaLabel: "펌웨어 업데이트 영역",
        label: "펌웨어 업데이트",
        box: { w: 40, h: 45 },
      },
      srSummary:
        "펌웨어 업데이트 영역에서 [펌웨어 읽기]로 현재 정보 확인, [열기]로 파일 선택, [전송]으로 업데이트 실행.",
    },
    {
      id: "step-4-misc",
      title: "기타 설정",
      description:
        "컨트롤러 재시작, 공장 초기화, 정보문구 설정, 스케줄속도 설정, 깜빡임 횟수, 폰트 가중치, 오프셋, 잔상 딜레이, 배경 스케줄, 릴레이 신호 등 다양한 컨트롤러 설정을 우측 영역에서 관리합니다.\n시리얼 모니터로 통신 상태도 직접 확인할 수 있습니다.",
      image: SCREEN,
      hotspot: {
        x: 82,
        y: 9,
        ariaLabel: "기타 설정 버튼 모음",
        label: "기타 설정",
        box: { w: 14, h: 50 },
      },
      srSummary:
        "정보문구·스케줄속도·깜빡임 횟수·폰트 가중치·오프셋 등 부가 설정과 시리얼 모니터를 우측 패널 버튼들로 관리합니다.",
    },
  ],
  // 마지막 투어 — nextTour 없음
}

export default tour
