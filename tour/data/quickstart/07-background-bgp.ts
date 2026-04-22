/**
 * Quickstart 07 — 배경 스케줄 (BGP).
 * 배경화면 전용 스케줄.
 */
import type { Tour } from "../../src/types"

const EDITOR = {
  src: "/assets/screens/manual-poc/main-editor.png",
  width: 1422,
  height: 1386,
  alt: "DabitOne 편집 탭 — 배경 스케줄",
} as const

const tour: Tour = {
  slug: "07-background-bgp",
  title: "배경 스케줄 (BGP)",
  subtitle: "배경화면 전용 순환",
  steps: [
    {
      id: "step-1-scope",
      title: "BGP와 PLA의 차이 이해",
      description:
        "BGP는 메인 메시지 뒤에서 순환하는 '배경' 전용 스케줄입니다. PLA와 별도 레이어로 재생되어 브랜딩·배경 무늬·시간표 등에 사용됩니다.",
      image: EDITOR,
      hotspot: { x: 3, y: 31, ariaLabel: "편집 탭 — 배경 모드", label: "편집" },
      srSummary:
        "PLA는 전면 메시지 플레이리스트, BGP는 배경 레이어 플레이리스트. 두 레이어가 동시에 재생됩니다.",
      relatedRefs: [
        { label: "BGP 포맷", path: "/file-formats/bgp" },
        {
          label: "배경 전송 옵션",
          path: "/ui-reference/03-transfer/background",
        },
      ],
    },
    {
      id: "step-2-create",
      title: "배경 이미지·스케줄 조립",
      description:
        "PLA 생성과 유사한 방식으로 배경용 이미지·GIF를 시간 순서로 배치합니다. 투명도·위치를 각 항목마다 조정할 수 있습니다.",
      image: EDITOR,
      srSummary:
        "배경 스케줄 편집기에서 이미지·GIF를 드래그해 타임라인 구성. 각 항목의 시간·조건 설정.",
      tips: [
        "PLA 메시지와 시각적으로 겹쳐도 가독성 유지되는 패턴 선호",
        "투명도를 낮춰 전면 메시지가 잘 보이도록",
      ],
    },
    {
      id: "step-3-send",
      title: "전송 및 효과 확인",
      description:
        "BGP를 저장·전송하면 컨트롤러가 배경 레이어에만 적용합니다. PLA 메시지가 그 위로 표출됩니다.",
      image: EDITOR,
      srSummary:
        "배경 전송 옵션에서 BGP 파일 선택 후 전송. 실물 화면에서 겹침 효과 확인.",
    },
  ],
  nextTour: "08-firmware",
}

export default tour
