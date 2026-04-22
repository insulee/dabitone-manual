/**
 * Quickstart 04 — 이미지 편집·전송.
 * BMP/PNG/JPG를 DAT로 변환해 전광판에 표출.
 */
import type { Tour } from "../../src/types"

const EDITOR = {
  src: "/assets/screens/manual-poc/main-editor.png",
  width: 1422,
  height: 1386,
  alt: "DabitOne 편집 탭 — 이미지 편집 모드",
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
      hotspot: { x: 3, y: 31, ariaLabel: "편집 탭", label: "편집" },
      srSummary:
        "편집 탭의 이미지 모드에서 파일을 불러오거나 드래그 앤 드롭으로 가져올 수 있습니다. BMP, PNG, JPG 포맷 지원.",
      tips: [
        "큰 이미지는 자동 리사이즈되어 전광판 해상도에 맞춰짐",
        "배경 투명 PNG 지원 — 검정 배경으로 채워짐",
      ],
      relatedRefs: [
        { label: "이미지 편집기 상세", path: "/04-editor/image" },
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
        "저장 경로 기본: 내 문서\\DabitOne\\Data\\",
        "파일명은 내용을 알아볼 수 있게 — 예: logo-main.DAT",
      ],
    },
    {
      id: "step-color",
      title: "색상 보정 (풀컬러)",
      description:
        "풀컬러(24비트) 전광판이면 RGB 감마·채도·밝기 보정으로 현장 LED 특성에 맞춥니다. 단색·3색 전광판은 불필요.",
      image: EDITOR,
      srSummary:
        "RGB 보정 옵션으로 LED 모듈 제조사별 색 편차를 조정. 기본값은 중립. 현장에서 색이 어색하면 채도·감마 미세 조정.",
      tips: [
        "옐로우/오렌지 톤이 강하면 R 채널 살짝 낮추기",
        "흐릿하게 보이면 감마 0.9 정도로",
        "실내 조명·주변 광에 따라 달라지니 현장 조정이 정답",
      ],
    },
    {
      id: "step-verify",
      title: "전광판 표출 확인",
      description:
        "현장 전광판에서 이미지가 의도대로 표출되는지 확인합니다. 해상도·크기·색상 모두 점검.",
      image: EDITOR,
      srSummary:
        "현장 실제 표출 점검. 이상 있으면 편집 단계로 돌아가 수정 후 재전송.",
      tips: [
        "일부만 보이면 화면 크기 설정 재확인",
        "글자·외곽이 뭉개지면 원본 해상도 증가 후 재변환",
      ],
    },
  ],
  nextTour: "05-gif-editor",
}

export default tour
