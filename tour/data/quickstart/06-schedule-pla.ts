/**
 * Quickstart 06 — 스케줄 편집 (PLA).
 * 여러 DAT·ANI 항목을 순차 재생하는 플레이리스트.
 */
import type { Tour } from "../../src/types"

const EDITOR = {
  src: "/assets/screens/manual-poc/main-editor.png",
  width: 1422,
  height: 1386,
  alt: "DabitOne 편집 탭 — 스케줄 편집",
} as const

const tour: Tour = {
  slug: "06-schedule-pla",
  title: "스케줄 편집 (PLA)",
  subtitle: "여러 메시지를 순차 재생하는 플레이리스트",
  steps: [
    {
      id: "step-1-new",
      title: "스케줄(PLA) 새로 만들기",
      description:
        "[편집] 탭의 스케줄 모드로 이동해 새 PLA 파일을 만듭니다. PLA는 여러 DAT·ANI 항목을 시간 순서대로 조합한 플레이리스트 파일입니다.",
      image: EDITOR,
      hotspot: { x: 3, y: 31, ariaLabel: "편집 탭", label: "편집" },
      srSummary:
        "스케줄 모드에서 새 PLA 파일을 생성합니다. 기존 저장된 DAT·ANI 메시지들을 선택해 조합할 수 있습니다.",
      relatedRefs: [
        {
          label: "스케줄 그리드 상세",
          path: "/ui-reference/04-editor/schedule-grid",
        },
        { label: "PLA 포맷", path: "/file-formats/pla" },
      ],
    },
    {
      id: "step-2-add",
      title: "메시지 추가·순서 조정",
      description:
        "우측 파일 목록에서 재생할 DAT/ANI를 드래그해 타임라인에 추가합니다. 각 항목의 재생 시간·반복 횟수·조건을 설정합니다.",
      image: EDITOR,
      srSummary:
        "타임라인에 메시지를 드래그 앤 드롭으로 추가합니다. 각 메시지의 재생 시간과 반복 횟수를 설정 가능.",
      tips: [
        "시간대별 조건 재생 지원 (예: 09:00~18:00만 재생)",
        "요일·날짜 조건도 설정 가능",
      ],
    },
    {
      id: "step-3-send",
      title: "전송 및 현장 확인",
      description:
        "PLA를 저장 후 [전송] 탭에서 컨트롤러로 보냅니다. 컨트롤러가 자체 시간에 맞춰 순차 재생합니다.",
      image: EDITOR,
      srSummary:
        "컨트롤러는 자체 실시간 시계를 기준으로 PLA를 재생합니다. 전송 후 즉시 플레이리스트 순환이 시작됩니다.",
      tips: [
        "컨트롤러 시계가 맞지 않으면 의도한 시간대와 어긋남 — 시계 설정 먼저",
        "한 PLA에 너무 많은 항목은 컨트롤러 메모리 초과 위험",
      ],
    },
  ],
  nextTour: "07-background-bgp",
}

export default tour
