/**
 * Quickstart 03 — 첫 메시지 전송.
 * 텍스트 입력 후 전광판에 즉시 표출.
 */
import type { Tour } from "../../src/types"

const EDITOR = {
  src: "/assets/screens/manual-poc/main-editor.png",
  width: 1422,
  height: 1386,
  alt: "DabitOne 편집 탭 — 텍스트 편집기",
} as const

const SIM = {
  src: "/assets/screens/manual-poc/main-simulator.png",
  width: 1422,
  height: 1386,
  alt: "DabitOne 전송 탭 — 진행률 표시",
} as const

const tour: Tour = {
  slug: "03-send-message",
  title: "첫 메시지 전송",
  subtitle: "텍스트를 입력하고 전광판에 띄워봅니다",
  steps: [
    {
      id: "step-1-editor",
      title: "[편집] 탭 → 텍스트 입력",
      description:
        "좌측 [편집] 탭에서 텍스트 편집기가 기본으로 열립니다. 전광판에 띄울 내용을 바로 입력합니다.",
      image: EDITOR,
      hotspot: { x: 3, y: 31, ariaLabel: "편집 탭", label: "편집" },
      srSummary:
        "편집 탭 진입 시 텍스트 편집기가 기본으로 열립니다. 글꼴·크기·색상·효과를 선택하면서 실시간으로 미리보기가 갱신됩니다.",
      tips: [
        "여러 줄 입력 시 줄바꿈이 그대로 표출됨",
        "글꼴·색상은 미리보기에 즉시 반영",
      ],
      relatedRefs: [
        { label: "텍스트 편집기 상세", path: "/ui-reference/04-editor/text" },
      ],
    },
    {
      id: "step-2-effect",
      title: "효과·속도 선택 (선택)",
      description:
        "흐름 효과(좌→우 흐름, 점멸, 고정 등), 표시 시간, 속도를 선택합니다. 처음엔 기본값으로도 충분합니다.",
      image: EDITOR,
      srSummary:
        "효과는 흐름·점멸·고정 등이 있고 속도를 느리게·빠르게 조절 가능합니다. 기본값은 보통 '좌에서 우로 흐름, 중간 속도'.",
      tips: [
        "효과 미리보기는 하단 프리뷰 영역에서 확인",
        "과한 효과는 가독성을 해침 — 현장 환경에 맞게 조정",
      ],
    },
    {
      id: "step-3-send",
      title: "[전송] 탭으로 이동 → 보내기",
      description:
        "[전송] 탭으로 이동해 편집한 메시지를 컨트롤러로 전송합니다. 진행률 바가 표시되고, 완료되면 전광판에 바로 표출됩니다.",
      image: SIM,
      hotspot: { x: 3, y: 24, ariaLabel: "전송 탭", label: "전송" },
      srSummary:
        "전송 탭에서 전송 버튼을 누르면 진행률이 실시간으로 표시되며, 완료되면 전광판이 해당 메시지를 보여줍니다.",
      tips: [
        "전송 실패 시 로그가 하단에 표시됨 — 연결 재확인",
        "같은 메시지를 다시 보내면 컨트롤러가 덮어씀",
      ],
      relatedRefs: [
        {
          label: "전송이 실패할 때",
          path: "/troubleshooting/03-transfer-fail",
        },
      ],
    },
  ],
  nextTour: "04-edit-image",
}

export default tour
