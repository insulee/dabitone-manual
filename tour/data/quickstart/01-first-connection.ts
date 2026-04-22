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

const tour: Tour = {
  slug: "01-first-connection",
  title: "컨트롤러 최초 연결",
  subtitle: "Serial·TCP·UDP 중 하나로 처음 연결하기",
  steps: [
    {
      id: "step-1-tab",
      title: "좌측 [통신] 탭 확인",
      description:
        "DabitOne을 실행하면 좌측 사이드바 맨 위의 [통신] 탭이 기본으로 선택되어 있고, 우측에 '통신 설정' 창이 뜹니다. 다른 탭에 있다면 [통신]을 클릭하세요.",
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
      relatedRefs: [
        { label: "통신 개요", path: "/01-communication/" },
      ],
    },
    {
      id: "step-2-method",
      title: "연결 방식 선택",
      description:
        "통신 설정 창 좌측 열에는 Serial / Client TCP/IP / Server TCP/IP / UDP 네 개의 그룹박스가 세로로 나열되어 있습니다. 각 그룹박스 헤더의 라디오 버튼으로 하나 선택. 기본은 Serial입니다.",
      image: SCREEN,
      hotspot: {
        x: 11,
        y: 11,
        ariaLabel: "연결 방식 라디오 버튼 그룹 — Serial 기본 선택",
        label: "연결 방식",
        box: { w: 23, h: 18 },
      },
      srSummary:
        "연결 방식은 네 가지: Serial(시리얼 케이블 직결), Client TCP/IP(컨트롤러 IP 입력), Server TCP/IP(컨트롤러가 접속해옴), UDP(브로드캐스트·단방향). 처음이라면 대부분 Serial 또는 Client TCP/IP입니다.",
      tips: [
        "컨트롤러-PC를 시리얼 케이블로 직접 연결 → Serial",
        "컨트롤러 IP를 알고 있음 → Client TCP/IP",
        "브로드캐스트·단방향 송출 → UDP",
        "컨트롤러가 PC로 접속 → Server TCP/IP (드물음)",
      ],
      relatedRefs: [
        { label: "Serial 상세", path: "/01-communication/serial" },
        { label: "TCP 상세", path: "/01-communication/tcp" },
      ],
    },
    {
      id: "step-3-config",
      title: "설정 입력",
      description:
        "Serial이면 '포트'와 '속도' 드롭다운을 채웁니다. 기본 속도는 115200. 컨트롤러 펌웨어 설정과 일치해야 합니다. 모르는 경우 [속도 찾기] 버튼으로 자동 탐색. TCP/UDP이면 'IP Address'와 'IP Port'를 입력합니다(기본 192.168.0.201 : 5000).",
      image: SCREEN,
      hotspot: {
        x: 23,
        y: 16,
        ariaLabel: "포트·속도 또는 IP·Port 입력 영역",
        label: "설정 입력",
        box: { w: 18, h: 8 },
      },
      srSummary:
        "Serial은 포트와 속도를 선택, TCP/UDP는 IP 주소와 포트 번호를 입력합니다. 모든 값은 컨트롤러 설정과 일치해야 합니다. 속도가 불확실하면 속도 찾기 버튼으로 자동 탐색 가능.",
      tips: [
        "속도 범위: 9600 / 19200 / 38400 / 57600 / 115200 / 230400 / 921600",
        "RS-485 배선이면 'RS-485 Address' 체크박스 활성화 후 주소값 선택",
        "TCP 기본 포트 5000, UDP 포트는 5108로 고정",
      ],
      relatedRefs: [
        { label: "Serial 상세", path: "/01-communication/serial" },
      ],
    },
    {
      id: "step-timing",
      title: "응답시간 조정 (선택)",
      description:
        "응답시간 드롭다운으로 컨트롤러 응답 대기 시간을 1~6초로 조정합니다. 기본 3초. 케이블이 길거나 RS-485 장거리 배선이면 5~6초 권장.",
      image: SCREEN,
      hotspot: {
        x: 22,
        y: 75,
        ariaLabel: "응답시간 드롭다운",
        label: "응답시간",
        box: { w: 10, h: 4 },
      },
      srSummary:
        "응답시간 기본 3초. 장거리 배선·노이즈 환경에서는 5~6초로 늘려 안정성 확보.",
      tips: [
        "단거리 USB-Serial: 3초 기본값 충분",
        "RS-485 100m 이상: 5~6초 권장",
        "응답시간을 늘리면 timeout 감소하지만 실패 인지가 늦어짐",
      ],
    },
    {
      id: "step-4-test",
      title: "[연결 테스트] 클릭",
      description:
        "통신 설정 창 맨 아래 [연결 테스트] 버튼을 클릭하면 현재 설정이 저장되고 컨트롤러에 echo 요청이 갑니다. 성공 시 '연결 테스트 성공' 녹색 토스트가 뜨고 상단 상태가 '연결됨'으로 바뀝니다.",
      image: SCREEN,
      hotspot: {
        x: 16,
        y: 75,
        ariaLabel: "연결 테스트 버튼",
        label: "[연결 테스트]",
        box: { w: 12, h: 4 },
      },
      srSummary:
        "연결 테스트 버튼이 통신 설정 창 하단에 있습니다. 클릭하면 설정 저장 + echo 요청 발송. 응답시간은 기본 3초이며 드롭다운으로 1~6초 선택 가능. 성공 시 녹색 토스트, 응답 없을 때 노란 토스트, 실패 시 빨간 토스트가 표시됩니다.",
      tips: [
        "응답 없음(노란색) → 케이블·속도·IP 재확인, 응답시간을 5~6초로 올려 재시도",
        "실패(빨간색) → 포트 점유(다른 프로그램이 COM 사용), 서브넷 불일치, 컨트롤러 펌웨어 이슈",
        "성공 후 다른 탭으로 이동해도 상태 유지됨",
      ],
      relatedRefs: [
        {
          label: "연결이 안 될 때",
          path: "/troubleshooting/01-connection",
        },
      ],
    },
    {
      id: "step-result",
      title: "연결 결과 확인",
      description:
        "테스트 후 화면 하단·우측에 토스트 알림이 뜹니다. 녹색=성공, 노란색=응답 없음(케이블·속도 재확인), 빨간색=실패(포트 점유·서브넷 불일치). 성공 시 상단 상태 표시가 '연결됨'으로 바뀝니다.",
      image: SCREEN,
      srSummary:
        "토스트 색상으로 결과 확인. 녹색은 정상 연결, 노란색은 응답 시간 초과, 빨간색은 연결 실패. 실패 시 통신 설정의 IP·속도·포트를 재점검.",
      tips: [
        "노란 토스트: 응답시간을 6초로 올려 재시도",
        "빨간 토스트: 다른 프로그램이 COM 포트 점유 중일 가능성",
        "토스트는 잠시 표시 후 자동 사라짐 — 로그 영역에서도 확인 가능",
      ],
      relatedRefs: [
        {
          label: "연결 트러블슈팅",
          path: "/troubleshooting/01-connection",
        },
      ],
    },
  ],
  nextTour: "02-screen-size",
}

export default tour
