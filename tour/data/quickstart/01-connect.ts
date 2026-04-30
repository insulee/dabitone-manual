/**
 * Quickstart 01 — 컨트롤러 최초 연결 투어 데이터.
 * 플랜 v3.1 Phase R3.2.
 *
 * XAML 원본 검증 완료 (이전 세션에서 D:\Gitea\dabitche\DabitChe.Desktop\MainWindow.xaml):
 * - [통신] 탭 기본 선택, Serial·Client TCP/IP·Server TCP/IP·UDP 라디오
 * - 포트·속도 드롭다운, 기본 115200, RS-485 Address 체크
 * - IP Address·IP Port (TCP 기본 192.168.0.201:5000, UDP 기본 192.168.0.202:5108)
 * - [연결 테스트] 버튼, 응답시간 기본 3초
 * - 토스트 색상: 녹(성공)·노(응답없음)·적(실패)
 *
 * 이미지는 manual-poc/main-comm.png (1422×1386) 기준 % 좌표.
 */
import type { Tour } from "../../src/types"

const SCREEN = {
  src: "/assets/screens/manual-poc/main-comm.png",
  width: 1422,
  height: 1386,
  alt: "DabitOne 통신 설정 화면 — Serial·Client TCP/IP·Server TCP/IP·UDP 그룹박스",
} as const

const TCP_SCREEN = {
  src: "/assets/screens/manual-poc/main-comm-tcp.png",
  width: 1183,
  height: 1155,
  alt: "DabitOne TCP 연결 화면 — Client TCP/IP 그룹 + dbNet 검색 결과",
} as const

const tour: Tour = {
  slug: "01-connect",
  title: "통신 연결",
  subtitle: "Serial·TCP/IP로 컨트롤러 연결",
  steps: [
    {
      id: "step-1-tab",
      title: "좌측 [통신] 탭 확인",
      description:
        "DabitOne을 실행하면 좌측 사이드바 맨 위의 [통신] 탭이 기본으로 선택되어 있고, 우측에 '통신 설정' 창이 뜹니다.\n다른 탭에 있다면 [통신]을 클릭하세요.",
      image: SCREEN,
      hotspot: {
        x: 3,
        y: 12,
        ariaLabel: "통신 탭",
        label: "통신",
        box: { w: 7, h: 5 },
      },
      srSummary:
        "DabitOne 좌측 사이드바 맨 위에 통신 탭이 있고 기본으로 선택되어 있습니다. 클릭하면 통신 설정 창이 우측에 표시됩니다.",
      nextHint: "연결 방식을 고를 차례입니다.",
      relatedRefs: [{ label: "통신 개요", path: "/01-communication/overview" }],
    },
    {
      id: "step-2-method",
      title: "연결 방식 선택",
      description:
        "통신 설정 창 좌측 열에는 Serial / Client TCP/IP / Server TCP/IP / UDP 네 개의 그룹박스가 세로로 나열되어 있습니다.\n각 그룹박스 헤더의 라디오 버튼으로 하나 선택. 기본은 Serial입니다.",
      image: SCREEN,
      hotspot: {
        x: 9,
        y: 13,
        ariaLabel: "연결 방식 라디오 버튼 그룹 — Serial 기본 선택",
        label: "연결 방식",
        box: { w: 23, h: 36 },
      },
      srSummary:
        "연결 방식은 네 가지: Serial(시리얼 케이블 직결), Client TCP/IP(컨트롤러 IP 입력), Server TCP/IP(컨트롤러가 접속해옴), UDP(브로드캐스트·단방향). 처음이라면 대부분 Serial 또는 Client TCP/IP입니다.",
      nextOptions: [
        { label: "Serial 연결", toStepId: "step-3-config" },
        { label: "TCP/IP 연결", toStepId: "step-tcp-1" },
      ],
    },
    {
      id: "step-3-config",
      title: "설정 입력",
      description:
        "Serial이면 '포트'와 '속도' 드롭다운을 채웁니다.\n기본 속도는 115200. 컨트롤러 펌웨어 설정과 일치해야 합니다.\n모르는 경우 [속도 찾기] 버튼으로 자동 탐색. TCP/UDP이면 'IP Address'와 'IP Port'를 입력합니다(기본 192.168.0.201 : 5000).",
      image: SCREEN,
      hotspot: {
        x: 18,
        y: 13,
        ariaLabel: "포트·속도 또는 IP·Port 입력 영역",
        label: "설정 입력",
        box: { w: 18, h: 8 },
      },
      srSummary:
        "Serial은 포트와 속도를 선택, TCP/UDP는 IP 주소와 포트 번호를 입력합니다. 모든 값은 컨트롤러 설정과 일치해야 합니다. 속도가 불확실하면 속도 찾기 버튼으로 자동 탐색 가능.",
      relatedRefs: [{ label: "Serial 상세", path: "/01-communication/serial" }],
    },
    {
      id: "step-4-test",
      title: "[연결 테스트] 클릭",
      description:
        "통신 설정 창 맨 아래 [연결 테스트] 버튼을 클릭하면 현재 설정이 저장되고 컨트롤러에 echo 요청이 갑니다.\n성공 시 '연결 테스트 성공' 녹색 토스트가 뜨고 상단 상태가 '연결됨'으로 바뀝니다.",
      image: SCREEN,
      hotspot: {
        x: 8,
        y: 75,
        ariaLabel: "연결 테스트 버튼",
        label: "[연결 테스트]",
        box: { w: 12, h: 4 },
      },
      srSummary:
        "연결 테스트 버튼이 통신 설정 창 하단에 있습니다. 클릭하면 설정 저장 + echo 요청 발송. 응답시간은 기본 3초이며 드롭다운으로 1~6초 선택 가능. 성공 시 녹색 토스트, 응답 없을 때 노란 토스트, 실패 시 빨간 토스트가 표시됩니다.",
      relatedRefs: [
        {
          label: "연결이 안 될 때",
          path: "/troubleshooting/01-connection",
        },
      ],
      nextOptions: [
        { label: "TCP/IP 연결", toStepId: "step-tcp-1" },
        { label: "다음 투어", toTour: "02-display-setup" },
      ],
    },
    {
      id: "step-tcp-1",
      title: "Client TCP/IP 선택",
      description:
        "Client TCP/IP 라디오 버튼을 클릭해 TCP 연결 모드로 전환합니다.\n우측 dbNet 영역의 자동 검색·정보 조회가 활성화됩니다.",
      image: TCP_SCREEN,
      hotspot: {
        x: 15,
        y: 30,
        ariaLabel: "Client TCP/IP 라디오버튼",
        label: "Client TCP/IP",
        box: { w: 18, h: 4 },
      },
      srSummary:
        "Client TCP/IP 라디오 선택 시 dbNet 영역이 활성화되어 자동 검색·정보 조회가 가능합니다.",
    },
    {
      id: "step-tcp-2",
      title: "컨트롤러 검색",
      description:
        "dbNet 영역의 [Search] 버튼을 클릭하면 같은 네트워크 안 모든 컨트롤러가 자동 검색됩니다.",
      image: TCP_SCREEN,
      hotspot: {
        x: 54,
        y: 76,
        ariaLabel: "Search 버튼",
        label: "Search",
        box: { w: 8, h: 4 },
      },
      srSummary:
        "Search 버튼이 UDP 브로드캐스트로 같은 서브넷의 모든 컨트롤러를 검색합니다. 결과는 좌측 list에 MAC 주소로 표시됩니다.",
    },
    {
      id: "step-tcp-3",
      title: "컨트롤러 선택",
      description: "검색 list에서 연결할 컨트롤러의 MAC 주소(예: 54-ff-82-0f-ff-ff)를 클릭합니다.",
      image: TCP_SCREEN,
      hotspot: {
        x: 35,
        y: 17,
        ariaLabel: "MAC 주소 list 항목",
        label: "MAC 주소",
        box: { w: 18, h: 4 },
      },
      srSummary:
        "list에서 MAC 주소 항목을 클릭하면 우측 영역에 해당 컨트롤러의 상세 정보(Board Name·IP·Subnet 등)가 채워집니다.",
    },
    {
      id: "step-tcp-4",
      title: "컨트롤러 정보 확인",
      description:
        "선택한 컨트롤러의 Board Name, IP Address, Subnet, Gateway, Port 등 네트워크 정보가 자동 조회되어 표시됩니다.",
      image: TCP_SCREEN,
      hotspot: {
        x: 55,
        y: 19,
        ariaLabel: "Board Name 표시 영역",
        label: "Board Name",
        box: { w: 22, h: 4 },
      },
      srSummary:
        "Board Name·IP·Subnet·Gateway·Port 정보가 자동 채워져 별도 입력 없이 연결 설정에 반영할 수 있습니다.",
    },
    {
      id: "step-tcp-5",
      title: "적용 및 연결",
      description:
        "[Add] 버튼을 클릭하면 선택한 컨트롤러 정보가 Client TCP/IP 설정에 자동 반영되고, 곧바로 [연결 테스트]까지 자동 실행됩니다.",
      image: TCP_SCREEN,
      hotspot: {
        x: 68,
        y: 76,
        ariaLabel: "Add 버튼",
        label: "Add",
        box: { w: 6, h: 4 },
      },
      srSummary:
        "Add 버튼 클릭 시 IP/Port가 Client TCP/IP 영역에 자동 입력되고, 연결 테스트도 자동으로 실행되어 echo 응답을 즉시 확인할 수 있습니다.",
      nextOptions: [
        { label: "Serial 연결", toStepId: "step-3-config" },
        { label: "다음 투어", toTour: "02-display-setup" },
      ],
    },
  ],
  nextTour: "02-display-setup",
}

export default tour
