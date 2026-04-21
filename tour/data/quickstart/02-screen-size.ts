/**
 * Quickstart 02 — 화면 크기 설정.
 * 가로·세로 모듈 수, 색상 깊이, 모듈 배열을 컨트롤러로 전송.
 */
import type { Tour } from "../../src/types"

const SCREEN = {
  src: "/assets/screens/manual-poc/main-setup.png",
  width: 1422,
  height: 1386,
  alt: "DabitOne 설정 탭 — 화면 크기·시계·밝기 섹션",
} as const

const tour: Tour = {
  slug: "02-screen-size",
  title: "화면 크기 설정",
  subtitle: "가로·세로 모듈 수·색상 깊이를 컨트롤러로 전송",
  steps: [
    {
      id: "step-1-tab",
      title: "[설정] 탭 이동",
      description:
        "연결이 성공했다면 좌측 사이드바에서 [설정] 탭을 클릭합니다. 화면 크기·시계·밝기 스케줄 등을 한곳에서 관리합니다.",
      image: SCREEN,
      hotspot: { x: 8, y: 23, ariaLabel: "설정 탭", label: "설정" },
      srSummary:
        "좌측 [설정] 탭에 화면 크기 섹션이 있습니다. 먼저 연결이 성공한 상태여야 전송이 가능합니다.",
      relatedRefs: [
        { label: "설정 UI 레퍼런스", path: "/ui-reference/02-settings/" },
      ],
    },
    {
      id: "step-2-size",
      title: "가로·세로 모듈 수 입력",
      description:
        "전광판의 가로 모듈 수, 세로 모듈 수, 모듈 한 개당 픽셀(예: 16×16, 32×16)을 입력합니다. 색상 깊이(1비트 단색 ~ 24비트 풀컬러)도 함께 선택합니다.",
      image: SCREEN,
      srSummary:
        "가로 모듈 수, 세로 모듈 수, 픽셀 해상도를 입력합니다. 전광판 실물의 물리 구성과 일치해야 합니다. 색상 깊이는 모듈의 색상 지원에 맞춰 선택.",
      tips: [
        "일반 단색 전광판: 1비트",
        "3색 전광판: 3비트",
        "풀컬러 전광판: 24비트",
        "모듈이 세로/가로로 섞여 배치된 경우 '배열' 옵션에서 rotation 선택",
      ],
    },
    {
      id: "step-3-send",
      title: "컨트롤러로 전송",
      description:
        "값을 입력한 뒤 [전송] 또는 [적용] 버튼으로 컨트롤러에 바로 반영됩니다. 현장에서 화면이 즉시 재배열되는 것을 확인하세요.",
      image: SCREEN,
      srSummary:
        "전송 버튼을 클릭하면 컨트롤러로 즉시 반영되며, 전광판 화면이 재구성됩니다. 재부팅 없이 적용됩니다.",
      tips: [
        "잘못 입력한 경우 크기가 깨져 보임 → 즉시 수정해 재전송",
        "되돌리기는 이전 값 입력 후 재전송",
      ],
      relatedRefs: [
        {
          label: "화면이 이상하게 나올 때",
          path: "/troubleshooting/02-display-corruption",
        },
      ],
    },
  ],
  nextTour: "03-send-message",
}

export default tour
