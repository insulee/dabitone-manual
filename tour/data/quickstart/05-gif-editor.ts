/**
 * Quickstart 05 — GIF 편집.
 * 내장 GIF 편집기로 동영상 제작 (DabitONe 확장 기능).
 */
import type { Tour } from "../../src/types"

const EDITOR = {
  src: "/assets/screens/manual-poc/main-editor.png",
  width: 1422,
  height: 1386,
  alt: "DabitONe 편집 탭 — GIF 편집 모드",
} as const

const tour: Tour = {
  slug: "05-gif-editor",
  title: "GIF 편집",
  subtitle: "내장 편집기로 애니메이션 제작 (DabitONe 신기능)",
  steps: [
    {
      id: "step-1-open",
      title: "GIF 편집 모드 열기",
      description:
        "[편집] 탭에서 'GIF' 모드를 선택합니다. 기존 GIF 파일을 불러오거나 처음부터 프레임을 그릴 수 있습니다. 이 편집기는 DabitONe에서 새로 제공됩니다.",
      image: EDITOR,
      hotspot: { x: 8, y: 31, ariaLabel: "편집 탭 — GIF 모드", label: "편집" },
      srSummary:
        "편집 탭의 GIF 모드에서 기존 GIF 불러오기 또는 신규 제작 가능. 레거시 DabitChe에는 없던 기능입니다.",
      tips: [
        "프레임 단위로 이미지 삽입·편집·제거 가능",
        "프레임당 표시 시간 개별 설정",
      ],
      relatedRefs: [
        { label: "GIF 편집기 상세", path: "/ui-reference/04-editor/gif" },
        { label: "GIF 포맷", path: "/file-formats/gif" },
      ],
    },
    {
      id: "step-2-edit",
      title: "프레임 편집",
      description:
        "좌측 타임라인에서 프레임을 추가·복사·삭제합니다. 각 프레임은 이미지처럼 편집 가능하고, 효과 전환도 설정할 수 있습니다.",
      image: EDITOR,
      srSummary:
        "타임라인에서 프레임 순서 조정, 드래그로 재배열, 각 프레임에 이미지·텍스트 삽입 가능.",
      tips: [
        "반복 재생 횟수 설정 가능",
        "용량이 커질 수 있으니 프레임 수를 적당히",
      ],
    },
    {
      id: "step-3-send",
      title: "ANI 포맷으로 저장 후 전송",
      description:
        "저장 시 전광판 애니메이션 포맷(ANI)으로 변환됩니다. 전송 탭에서 컨트롤러로 보내면 표출.",
      image: EDITOR,
      srSummary:
        "ANI 파일은 여러 프레임과 타이밍을 포함하는 전광판 전용 애니메이션 포맷입니다.",
      tips: ["ANI 파일 크기가 크면 컨트롤러 메모리 제약 주의"],
      relatedRefs: [{ label: "ANI 포맷", path: "/file-formats/ani" }],
    },
  ],
  nextTour: "06-schedule-pla",
}

export default tour
