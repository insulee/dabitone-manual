/**
 * Quickstart 04 — 스케줄/배경이미지 전송.
 * 콘텐츠·이미지·GIF 편집 후 PLA/BGP로 컨트롤러에 전송.
 */
import type { Tour } from "../../src/types"

const EDITOR = {
  src: "/assets/screens/manual-poc/main-editor.png",
  width: 1422,
  height: 1386,
  alt: "DabitOne 편집 탭 — 표시파일 list 기본 화면",
} as const

const CONTENTS = {
  src: "/assets/screens/manual-poc/main-editor-contents.png",
  width: 1182,
  height: 1156,
  alt: "DabitOne 편집 탭 — 콘텐츠 편집 창",
} as const

const IMAGE = {
  src: "/assets/screens/manual-poc/main-editor-image.png",
  width: 1182,
  height: 1152,
  alt: "DabitOne 편집 탭 — 이미지 편집 창",
} as const

const GIF = {
  src: "/assets/screens/manual-poc/main-editor-gif.png",
  width: 1182,
  height: 1151,
  alt: "DabitOne 편집 탭 — GIF 편집 창",
} as const

const SB = {
  src: "/assets/screens/manual-poc/main-editor-sb.png",
  width: 1182,
  height: 1152,
  alt: "DabitOne 편집 탭 — 표시파일 list (PLA/BGP)",
} as const

const tour: Tour = {
  slug: "04-edit-image",
  title: "스케줄/배경이미지 전송",
  subtitle: "콘텐츠·이미지·GIF 편집 후 PLA/BGP로 컨트롤러 전송",
  steps: [
    {
      id: "step-1-tab",
      title: "[편집] 탭 이동",
      description:
        "좌측 사이드바에서 [편집] 탭을 클릭합니다.\n콘텐츠 편집(텍스트·이미지·GIF), 이미지 편집(픽셀 단위 BMP/JPG), GIF 편집(픽셀 단위 GIF), PLA·BGP 파일 저장·전송까지 표시 콘텐츠 제작·관리를 한곳에서 합니다.",
      image: EDITOR,
      hotspot: { x: 3, y: 31, ariaLabel: "편집 탭", label: "편집" },
      srSummary:
        "편집 탭에서 콘텐츠·이미지·GIF 편집과 PLA/BGP 파일 저장·전송을 통합 관리합니다.",
    },
    {
      id: "step-2-contents",
      title: "콘텐츠 편집",
      description:
        "[콘텐츠 편집] 버튼으로 콘텐츠 편집 창을 엽니다.\n메인 블록에 텍스트를 직접 입력하거나 이미지·GIF 파일을 불러와 배치하고, 입장/퇴장 효과·효과속도·유지시간 등 표시 옵션을 설정한 뒤 DAT 파일로 저장합니다.",
      image: CONTENTS,
      hotspot: {
        x: 10,
        y: 13,
        ariaLabel: "콘텐츠 편집 버튼",
        label: "콘텐츠 편집",
        box: { w: 10, h: 4 },
      },
      srSummary:
        "콘텐츠 편집 창에서 텍스트·이미지·GIF를 조합하고 효과·속도·유지시간을 설정 후 DAT 파일로 저장합니다.",
    },
    {
      id: "step-3-image",
      title: "이미지 편집",
      description:
        "[이미지 편집] 버튼으로 이미지 편집 창을 엽니다.\n색상을 선택해 픽셀 단위로 직접 이미지를 그리고 BMP·JPG 등으로 저장합니다.\n저장한 이미지는 [콘텐츠 편집]에서 불러와 DAT 파일로 변환해 전광판에 표출할 수 있습니다.",
      image: IMAGE,
      hotspot: {
        x: 19,
        y: 13,
        ariaLabel: "이미지 편집 버튼",
        label: "이미지 편집",
        box: { w: 10, h: 4 },
      },
      srSummary:
        "이미지 편집 창에서 픽셀 단위로 이미지를 그려 BMP·JPG로 저장. 저장한 이미지는 콘텐츠 편집에서 DAT로 변환합니다.",
    },
    {
      id: "step-4-gif",
      title: "GIF 편집",
      description:
        "[GIF 편집] 버튼으로 GIF 편집 창을 엽니다.\n픽셀 단위로 프레임을 그려 GIF 파일을 생성·편집합니다.\n저장한 GIF는 [콘텐츠 편집]에서 불러와 ANI 파일로 변환해 동영상 콘텐츠를 표출할 수 있습니다.",
      image: GIF,
      hotspot: {
        x: 29,
        y: 13,
        ariaLabel: "GIF 편집 버튼",
        label: "GIF 편집",
        box: { w: 8, h: 4 },
      },
      srSummary:
        "GIF 편집 창에서 픽셀 단위로 프레임을 그려 GIF를 생성. 저장한 GIF는 콘텐츠 편집에서 ANI로 변환합니다.",
    },
    {
      id: "step-5-sb",
      title: "PLA/BGP 저장 및 전송",
      description:
        "표시파일 list 하단의 [편집] 버튼으로 항목을 추가하고 이미지(DAT) 또는 동영상(ANI) 파일을 골라 list를 구성합니다.\n[다른 이름 저장]으로 PLA(스케줄) 또는 BGP(배경) 파일로 저장한 뒤 [전송] 버튼을 누르면 컨트롤러로 전송되어 전광판에 원하는 대로 표출됩니다.",
      image: SB,
      hotspot: {
        x: 38,
        y: 13,
        ariaLabel: "전송 버튼",
        label: "전송",
        box: { w: 6, h: 4 },
      },
      srSummary:
        "표시파일 list에 DAT/ANI 항목을 추가하고 PLA/BGP 파일로 저장한 뒤 [전송] 버튼으로 컨트롤러에 보냅니다.",
    },
  ],
  nextTour: "05-advanced",
}

export default tour
