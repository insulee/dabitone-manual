/**
 * Quickstart 03 — 메시지 전송.
 * 전송 탭에서 HEX/ASCII 프로토콜 작성·전송 + 기타 전송 작업.
 */
import type { Tour } from "../../src/types"

const SIM = {
  src: "/assets/screens/manual-poc/main-simulator.png",
  width: 1422,
  height: 1386,
  alt: "DabitOne 전송 탭 — HEX/ASCII 프로토콜·페이지메시지·밝기·켜기/끄기 등",
} as const

const tour: Tour = {
  slug: "03-send-message",
  title: "메시지 전송",
  subtitle: "HEX·ASCII 프로토콜로 메시지·페이지·밝기 등을 컨트롤러에 전송",
  steps: [
    {
      id: "step-1-tab",
      title: "[전송] 탭 이동",
      description:
        "좌측 사이드바에서 [전송] 탭을 클릭합니다.\n메시지 전송, 페이지메시지, 밝기, 전광판 켜기/끄기, 배경이미지 등 컨트롤러로 보내는 모든 작업을 한곳에서 관리합니다.",
      image: SIM,
      hotspot: { x: 3, y: 24, ariaLabel: "전송 탭", label: "전송" },
      srSummary:
        "전송 탭은 컨트롤러로 보내는 모든 작업을 통합한 화면입니다. HEX/ASCII 프로토콜·페이지메시지·밝기·켜기/끄기·배경이미지 등.",
    },
    {
      id: "step-2-hex",
      title: "HEX 프로토콜",
      description:
        "메시지 종류·섹션·표시반복·화면전환·인코딩/폰트·효과·영역·색상 등 옵션을 선택하고 메시지 내용을 입력한 뒤 [HEX 전송] 버튼을 누르면 HEX 프로토콜이 컨트롤러로 전송됩니다.",
      image: SIM,
      hotspot: {
        x: 7,
        y: 10,
        ariaLabel: "HEX 프로토콜 영역",
        label: "HEX 프로토콜",
        box: { w: 40, h: 55 },
      },
      srSummary:
        "HEX 프로토콜 영역에서 메시지 옵션·내용을 작성한 후 [HEX 전송]을 누르면 컨트롤러로 HEX 패킷이 전송됩니다.",
    },
    {
      id: "step-3-ascii-convert",
      title: "ASCII 변환",
      description:
        "HEX 프로토콜에서 선택한 옵션과 입력 내용을 [ASCII 변환] 버튼으로 ASCII 프로토콜로 자동 변환합니다.\n변환된 문자열은 아래 'ASCII 프로토콜' 영역에 채워집니다.",
      image: SIM,
      hotspot: {
        x: 22,
        y: 63,
        ariaLabel: "ASCII 변환 버튼",
        label: "ASCII 변환",
        box: { w: 12, h: 4 },
      },
      srSummary:
        "[ASCII 변환] 버튼 클릭 시 HEX 옵션 + 메시지가 ASCII 문자열로 변환되어 아래 영역에 채워집니다.",
    },
    {
      id: "step-4-ascii",
      title: "ASCII 프로토콜",
      description:
        "ASCII 프로토콜 영역에 변환된 문자열을 확인하거나 직접 입력한 뒤 [ASCII 전송] 버튼을 누르면 컨트롤러로 ASCII 프로토콜이 전송됩니다.",
      image: SIM,
      hotspot: {
        x: 8,
        y: 68,
        ariaLabel: "ASCII 프로토콜 영역",
        label: "ASCII 프로토콜",
        box: { w: 40, h: 12 },
      },
      srSummary:
        "ASCII 프로토콜 영역에서 변환·직접 입력 후 [ASCII 전송]으로 컨트롤러에 전송합니다.",
    },
    {
      id: "step-5-other",
      title: "기타 전송",
      description:
        "페이지메시지(페이지 수·전송·초기화), 밝기, 전광판 켜기/끄기, 배경이미지, 화면채우기, 섹션별 효과 등 메시지 외 컨트롤러 전송 작업을 우측 영역에서 관리합니다.",
      image: SIM,
      hotspot: {
        x: 77,
        y: 8,
        ariaLabel: "페이지메시지 및 기타 전송 영역",
        label: "기타 전송",
        box: { w: 22, h: 80 },
      },
      srSummary:
        "페이지메시지·밝기·켜기/끄기·배경이미지·화면채우기·섹션별 효과 등 메시지 외 전송 옵션을 우측 패널에서 일괄 관리합니다.",
    },
  ],
  nextTour: "04-edit-image",
}

export default tour
