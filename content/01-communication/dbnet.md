---
title: dbNet
description: "네트워크 자동 검색 도구 — 컨트롤러 발견·원격 설정"
last_updated: 2026-04-29
---

# dbNet

> [!abstract] 같은 네트워크의 컨트롤러를 자동 검색하고 IP·Port·Subnet 등을 원격으로 설정
> `통신` 탭 우측 패널. `Client TCP/IP` / `Server TCP/IP` / `UDP` 선택 시 활성화.

### 화면 구성

#### 상단
- `연결:` PC의 네트워크 어댑터 선택

#### 좌측 — Board List
- `Search` 후 발견된 컨트롤러의 MAC 주소 목록

#### 중앙 — Network 영역
- `Board Name` — 장비 이름
- `IP Address` — 컨트롤러 IPv4
- `Subnet`, `Gateway`, `Port` — 네트워크 설정
- `Static` / `DHCP` 라디오 버튼
- `Controller Client Mode (Server TCP/IP)` — Server TCP/IP 모드 활성화 체크박스
- `Server IP` `Server Port` — 위 체크 시 PC IP/Port 입력
- `Heartbeat` — 주기 (초)

#### 우측 — DB300 영역
- `Version`, `Debugging`, `Port`, `Baud Rate` — 컨버터 펌웨어 설정
- `Read` / `Write` — 컨버터 설정 읽기·쓰기
- `STA` / `AP` 라디오 — WiFi 모드
- `WiFi SSID` `WiFi PW` — WiFi 접속 정보

#### 하단 버튼
- `Search` — UDP 브로드캐스트로 같은 네트워크 컨트롤러 검색
- `Set` — 중앙·우측 입력값을 선택된 장비에 적용
- `Add` — 선택된 장비의 IP·Port를 좌측 통신 그룹박스에 자동 채움
- `Reset` — 선택된 장비를 공장 초기화

### 일반 흐름

- `통신` > `Client TCP/IP` 등 선택 → dbNet 활성화
- `Search` → 좌측 목록에 MAC 주소 표시
- MAC 클릭 → 중앙·우측 영역에 자동 입력
- 필요 시 IP·Port·Subnet 수정 후 `Set`
- `Add` → 좌측 통신 그룹박스에 자동 채움
- `연결 테스트`

> [!warning] `Reset`은 컨트롤러의 메시지·스케줄·네트워크 설정을 공장 초기 상태로 되돌린다.

> [!info] dbNet은 같은 서브넷에서만 동작 (UDP 브로드캐스트 기반).

---
