/**
 * Quickstart 08 — 펌웨어 업데이트.
 */
import type { Tour } from "../../src/types"

const ADVANCED = {
  src: "/assets/screens/manual-poc/main-advanced.png",
  width: 1422,
  height: 1386,
  alt: "DabitOne 고급 탭 — 펌웨어 업데이트 섹션",
} as const

const tour: Tour = {
  slug: "08-firmware",
  title: "펌웨어 업데이트",
  subtitle: "컨트롤러 펌웨어를 새 버전으로 갱신",
  steps: [
    {
      id: "step-1-tab",
      title: "[고급] 탭 → 펌웨어 섹션",
      description:
        "좌측 [고급] 탭에 펌웨어 업데이트 섹션이 있습니다. 컨트롤러 제조사에서 제공한 .bin 파일이 있어야 진행 가능합니다.",
      image: ADVANCED,
      hotspot: { x: 3, y: 37, ariaLabel: "고급 탭", label: "고급" },
      srSummary:
        "고급 탭에 펌웨어 업데이트 섹션이 있습니다. 컨트롤러가 이미 연결된 상태여야 하고, .bin 펌웨어 파일이 준비돼 있어야 합니다.",
      tips: [
        "업데이트 중에는 컨트롤러 전원 끊지 않기 — 벽돌 위험",
        "현재 펌웨어 버전은 고급 탭에서 조회 가능",
      ],
      relatedRefs: [
        { label: "펌웨어 상세", path: "/ui-reference/05-advanced/firmware" },
        {
          label: "펌웨어 오류 대처",
          path: "/troubleshooting/04-firmware-error",
        },
      ],
    },
    {
      id: "step-2-select",
      title: "펌웨어 파일 선택",
      description:
        "파일 선택 창에서 .bin 펌웨어 파일을 열어 로드합니다. 파일 무결성 검사가 자동으로 수행됩니다.",
      image: ADVANCED,
      hotspot: {
        x: 80,
        y: 44,
        ariaLabel: "펌웨어 열기 버튼",
        label: "[열기]",
        box: { w: 8, h: 4 },
      },
      srSummary:
        "파일 선택 대화상자로 .bin 펌웨어를 열고 무결성 검증을 통과해야 업데이트 진행이 가능합니다.",
      tips: [
        "제조사 공식 경로에서 받은 파일만 사용",
        "검증 실패 시 파일 손상 가능성 — 재다운로드",
      ],
    },
    {
      id: "step-3-flash",
      title: "업데이트 실행 · 진행률 모니터링",
      description:
        "[업데이트 시작] 버튼을 누르면 진행률이 실시간 표시됩니다. 완료 후 컨트롤러가 자동 재부팅되고 새 버전으로 동작합니다.",
      image: ADVANCED,
      hotspot: {
        x: 80,
        y: 48,
        ariaLabel: "펌웨어 전송 버튼",
        label: "[전송]",
        box: { w: 8, h: 4 },
      },
      srSummary:
        "업데이트 시작 버튼 클릭 후 진행률 0~100% 바가 표시되고, 완료 후 컨트롤러가 재부팅됩니다. 재부팅 완료 후 재연결이 자동으로 이뤄집니다.",
      tips: [
        "업데이트는 수 분 소요 — 중단 금지",
        "재부팅 후 연결이 안 되면 설정 재적용 필요할 수 있음",
      ],
    },
    {
      id: "step-reboot",
      title: "재부팅 대기",
      description:
        "업데이트 완료 후 컨트롤러가 자동 재부팅됩니다. 재부팅은 10~30초 소요. 이 동안 전광판이 일시 꺼지거나 부팅 화면을 표시합니다.",
      image: ADVANCED,
      srSummary:
        "컨트롤러 자동 재부팅 10~30초. 현장 전광판이 잠시 꺼짐. 전원 유지 필수.",
      tips: [
        "전원 끊지 말 것 — 브릭(벽돌화) 위험",
        "RS-485 장거리 배선은 재부팅 후 통신 복구까지 1분 소요 가능",
      ],
    },
    {
      id: "step-reconnect",
      title: "재연결 확인",
      description:
        "재부팅 후 [통신] 탭에서 다시 [연결 테스트]를 눌러 연결 상태를 점검합니다. 새 펌웨어 버전이 [고급] 탭 펌웨어 정보에 반영됐는지 확인하세요.",
      image: ADVANCED,
      srSummary:
        "통신 탭에서 연결 재확인 + 고급 탭에서 새 펌웨어 버전 반영 확인. 이상 시 컨트롤러 재부팅 + 롤백 고려.",
      tips: [
        "연결 안 되면 Baud Rate 등 통신 설정 재적용 필요할 수 있음",
        "펌웨어 버전이 안 바뀌면 업데이트 실패 — 재시도",
      ],
      relatedRefs: [
        {
          label: "펌웨어 오류 대처",
          path: "/troubleshooting/04-firmware-error",
        },
      ],
    },
  ],
  // 마지막 투어 — nextTour 없음
}

export default tour
