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
  slug: "02-display-setup",
  title: "전광판 설정",
  subtitle: "화면 구성·표출신호·폰트 전송",
  steps: [
    {
      id: "step-1-tab",
      title: "[설정] 탭 이동",
      description:
        "좌측 사이드바에서 [설정] 탭을 클릭합니다.\n전광판 화면 구성, 표출신호 설정, 폰트 전송 등 전광판 설정을 한곳에서 관리합니다.",
      image: SCREEN,
      hotspot: { x: 3, y: 18, ariaLabel: "설정 탭", label: "설정" },
      srSummary:
        "[설정] 탭에서 전광판 화면 구성·표출신호·폰트 전송을 통합 관리합니다.",
    },
    {
      id: "step-2-size",
      title: "전광판 화면 구성 값 입력",
      description:
        "전광판의 가로 모듈 수, 세로 모듈 수, BPP, 모듈배열방법 선택합니다.\n[전송] 버튼을 눌러 화면구성 값을 전송합니다.",
      image: SCREEN,
      hotspot: {
        x: 8,
        y: 10,
        ariaLabel: "전광판 화면 구성 영역",
        label: "화면 구성",
        box: { w: 38, h: 12 },
      },
      srSummary:
        "전광판 화면 구성 영역에서 가로·세로 모듈 수, BPP, 배열을 입력 후 [전송] 버튼으로 컨트롤러에 적용합니다.",
    },
    {
      id: "step-display-signal",
      title: "표출신호 선택",
      description:
        "전광판 모듈에 맞는 표출신호를 목록에서 선택합니다.\n자주 사용하는 모듈이라면 [★ 등록] 버튼으로 표시할 수 있고, [표출신호 입력] 버튼으로 목록에 없는 표출신호를 전송할 수 있습니다.\n[전송] 버튼을 눌러 표출신호 값을 전송합니다.",
      image: SCREEN,
      hotspot: {
        x: 12,
        y: 28,
        ariaLabel: "표출신호 list 항목 (32D-P16D1S11)",
        label: "표출신호",
        box: { w: 18, h: 4 },
      },
      srSummary:
        "표출신호 list에서 모듈 사양(예: 32D-P16D1S11 = 32dot·16×16·1:1 스캔)을 선택. 자주 사용하는 신호는 ★ 등록으로 즐겨찾기 가능.",
    },
    {
      id: "step-font",
      title: "폰트 전송",
      description:
        "표출할 글꼴을 컨트롤러로 전송합니다.\n영문(ENG)·한글조합형(KOR)·사용자 폰트 3종을 폰트그룹 1~4에 분산 배치할 수 있습니다.\n활성 그룹을 체크하고 폰트파일을 불러와 [폰트파일 전송] 버튼을 누르면 실행됩니다.",
      image: SCREEN,
      hotspot: {
        x: 57,
        y: 10,
        ariaLabel: "폰트전송 영역",
        label: "폰트전송",
        box: { w: 28, h: 14 },
      },
      srSummary:
        "폰트전송 섹션에서 폰트그룹 체크 후 각 언어별 .fnt 파일 지정. 마지막에 폰트파일 전송 버튼 클릭.",
      relatedRefs: [
        { label: "폰트 파일 상세", path: "/02-settings/font" },
      ],
    },
  ],
  nextTour: "03-send-message",
}

export default tour
