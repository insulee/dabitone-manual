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
      hotspot: { x: 3, y: 18, ariaLabel: "설정 탭", label: "설정" },
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
      hotspot: {
        x: 23,
        y: 16,
        ariaLabel: "전광판 화면 구성 입력 영역",
        label: "화면 구성",
        box: { w: 38, h: 12 },
      },
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
      id: "step-display-signal",
      title: "표출신호 등록 (선택)",
      description:
        "전광판 모듈의 물리 사양(픽셀 간격·구동 IC·스캔 방식)에 맞는 표출신호를 목록에서 선택합니다. 새 모듈이라면 [★ 등록] 버튼으로 신호 정의를 추가할 수 있습니다.",
      image: SCREEN,
      hotspot: {
        x: 25,
        y: 50,
        ariaLabel: "표출신호 설정 영역",
        label: "표출신호 설정",
        box: { w: 32, h: 40 },
      },
      srSummary:
        "표출신호 설정 섹션에서 모듈 사양(예: 16D-P16D1S11 = 16dot·16×16·1:1 스캔)을 선택. 목록에 없으면 ★ 등록으로 새 정의 추가.",
      tips: [
        "신호 코드 의미: D=Dot, P=Pitch(픽셀 간격), S=Scan 방식",
        "모듈 공급사 스펙 시트의 값을 그대로 입력",
        "잘못된 신호 선택 시 화면 깨짐 — 실물로 맞춰야",
      ],
      relatedRefs: [
        {
          label: "표출신호 상세",
          path: "/ui-reference/02-settings/display-signal",
        },
      ],
    },
    {
      id: "step-3-send",
      title: "컨트롤러로 전송",
      description:
        "값을 입력한 뒤 [전송] 또는 [적용] 버튼으로 컨트롤러에 바로 반영됩니다. 현장에서 화면이 즉시 재배열되는 것을 확인하세요.",
      image: SCREEN,
      hotspot: {
        x: 50,
        y: 17,
        ariaLabel: "화면 구성 전송 버튼",
        label: "[전송]",
        box: { w: 6, h: 4 },
      },
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
    {
      id: "step-font",
      title: "폰트 전송 (선택)",
      description:
        "표출할 글꼴을 컨트롤러로 전송합니다. 영문(ENG)·한글조합형(KOR)·사용자 폰트 3종을 폰트그룹 1~4에 분산 배치 가능. 활성 그룹 체크 후 [폰트파일 전송] 실행.",
      image: SCREEN,
      hotspot: {
        x: 65,
        y: 18,
        ariaLabel: "폰트그룹 1 영역",
        label: "폰트그룹 1",
        box: { w: 28, h: 14 },
      },
      srSummary:
        "폰트전송 섹션에서 폰트그룹 체크 후 각 언어별 .fnt 파일 지정. 마지막에 폰트파일 전송 버튼 클릭.",
      tips: [
        "기본 폰트: ENG 08×16·KOR 16×16",
        "한글이 깨져 보이면 KOR 폰트 재전송으로 해결",
        "사용자 폰트는 특수 용도 (로고·기호 등)",
      ],
      relatedRefs: [
        { label: "폰트 파일 상세", path: "/ui-reference/02-settings/font" },
      ],
    },
  ],
  nextTour: "03-send-message",
}

export default tour
