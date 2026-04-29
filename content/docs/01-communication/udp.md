---
title: UDP
description: "UDP 연결 설정 — 비연결형·단방향 송출"
last_updated: 2026-04-29
aliases:
  - "/01-communication/udp"
---

# UDP

> [!abstract] 빠른 단방향 데이터 전송에 적합한 UDP 통신 설정
> `dbNet`으로 컨트롤러를 검색해 IP·Port를 자동으로 채운 뒤 `연결 테스트` 클릭.

### 연결 절차

- `통신` > `UDP` 라디오 버튼 선택
- 우측 `dbNet` > `Search` → 컨트롤러 MAC 주소 선택
- 중앙 Network 영역에서 IP·Subnet·Gateway 변경 (서버 환경에 맞춤)
- `Port`: **`5108`** (이더넷) 또는 **`5107`** (WiFi)
- `Set` → `Search`로 변경 확인 → `Add`
- 좌측 `UDP` 그룹박스에 IP·Port 자동 채움 확인
- `연결 테스트` 클릭

### 입력값

- `IP Address`: 컨트롤러 IPv4 (또는 브로드캐스트 `255.255.255.255`)
- `IP Port`: `5108` (이더넷) / `5107` (WiFi)

> [!warning] UDP는 비연결형으로 응답 확인 불가. 화면이 의도대로 나오는지 현장 육안 확인 필수.

---
