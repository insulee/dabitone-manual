/**
 * Quickstart 04 — 이미지 편집·전송.
 * BMP/PNG/JPG를 DAT로 변환해 전광판에 표출.
 */
import type { Tour } from "../../src/types"

const EDITOR = {
  src: "/assets/screens/manual-poc/main-editor.png",
  width: 1422,
  height: 1386,
  alt: "DabitONe 편집 탭 — 이미지 편집 모드",
} as const

const tour: Tour = {
  slug: "04-edit-image",
  title: "이미지 편집·전송",
  subtitle: "BMP·PNG·JPG를 전광판 포맷(DAT)으로 변환",
  steps: [
    {
      id: "step-1-open",
      title: "이미지 가져오기",
      description:
        "[편집] 탭에서 '이미지' 모드를 선택한 뒤, 파일 불러오기로 BMP·PNG·JPG를 엽니다. 드래그 앤 드롭도 지원합니다.",
      image: EDITOR,
      hotspot: { x: 8, y: 31, ariaLabel: "편집 탭", label: "편집" },
      srSummary:
        "편집 탭의 이미지 모드에서 파일을 불러오거나 드래그 앤 드롭으로 가져올 수 있습니다. BMP, PNG, JPG 포맷 지원.",
      tips: [
        "큰 이미지는 자동 리사이즈되어 전광판 해상도에 맞춰짐",
        "배경 투명 PNG 지원 — 검정 배경으로 채워짐",
      ],
      relatedRefs: [
        { label: "이미지 편집기 상세", path: "/ui-reference/04-editor/image" },
        { label: "DAT 포맷", path: "/file-formats/dat" },
      ],
    },
    {
      id: "step-2-adjust",
      title: "크기·위치·효과 조정",
      description:
        "이미지 크기, 위치, 효과를 조정합니다. 전광판 화면 대비 미리보기를 보면서 결정하세요.",
      image: EDITOR,
      srSummary:
        "이미지 크기는 드래그 또는 숫자 입력으로 조정 가능. 중앙 정렬 버튼으로 자동 배치. 효과는 페이드·슬라이드·점멸 등 선택 가능.",
      tips: [
        "선명도가 떨어지면 원본 이미지를 더 큰 해상도로 준비",
        "GIF는 이 모드에서는 첫 프레임만 — [GIF 편집] 사용",
      ],
    },
    {
      id: "step-3-send",
      title: "DAT로 저장 후 전송",
      description:
        "저장 시 자동으로 DAT 포맷(전광판 고유 형식)으로 변환됩니다. 전송 탭에서 컨트롤러로 보내면 표출 완료.",
      image: EDITOR,
      srSummary:
        "저장 시 DAT 파일이 프로젝트 폴더에 생성되고 전송 탭에서 선택해 전광판으로 보냅니다.",
      tips: [
        "저장 경로 기본: 내 문서\\DabitONe\\Data\\",
        "파일명은 내용을 알아볼 수 있게 — 예: logo-main.DAT",
      ],
    },
  ],
  nextTour: "05-gif-editor",
}

export default tour
