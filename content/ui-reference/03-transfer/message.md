---
title: 메시지 전송 (ASCII/HEX)
description: "편집한 DAT·ANI 메시지를 컨트롤러로 직접 전송 — ASCII/HEX 프로토콜"
last_updated: 2026-04-21
---

# 메시지 전송 (ASCII/HEX)

> 경로: **[전송] → 메시지 섹션**

## 이 화면의 역할

편집한 **DAT·ANI 메시지를 컨트롤러로 직접 전송**하거나 **ASCII/HEX 프로토콜**로 커스텀 명령을 보냅니다.

## 기본 사용 — DAT/ANI 전송

1. `파일 선택` — 편집기에서 저장한 `.DAT` 또는 `.ANI` 선택
2. `페이지 번호` — 컨트롤러의 몇 번 페이지에 저장할지 (보통 1)
3. **[전송]** → 진행률 바 확인

## 기본 사용 — ASCII/HEX 명령

개발자·트러블슈팅용 raw 프로토콜 전송. 컨트롤러 프로토콜 문서를 아는 경우에만 사용.

1. 입력창에 ASCII 또는 HEX 형식으로 명령 입력
2. 형식 선택: `ASCII` / `HEX`
3. **[전송]** → 응답을 로그에 표시

## 화면 구성

| 요소 | 유형 | 설명 |
|------|-----|-----|
| `파일 선택` | Button | DAT/ANI 파일 선택 |
| `페이지 번호` | NumericUpDown | 저장 위치 |
| `ASCII 입력` | TextBox (multiline) | ASCII 명령 |
| `HEX 입력` | TextBox (multiline) | HEX 바이트 (공백 구분) |
| `형식` | RadioButton | ASCII / HEX 선택 |
| **[전송]** | Button | 실행 |
| 응답 로그 | TextBox (readonly) | 보낸 명령·수신 응답 타임스탬프 |

## 주요 옵션

### 페이지 번호

컨트롤러는 여러 메시지를 페이지 슬롯에 저장할 수 있음. `1`번 페이지에 저장하면 보통 기본 표시됨. 페이지 개수는 컨트롤러마다 다름 ([[ui-reference/03-transfer/page|페이지 관리]] 참조).

### ASCII vs HEX

- **ASCII**: 텍스트로 읽을 수 있는 명령 (예: `STATUS\r\n`)
- **HEX**: 바이너리 명령을 16진수로 (예: `AA 01 02 FF`)

전광판 프로토콜 대부분은 HEX 기반. 컨트롤러 기술 문서 확인.

## 설정 영속성

전송한 메시지는 컨트롤러 비휘발 메모리에 저장. 마지막 전송 기록은 DabitOne 로그에 남음.

## 관련

- 체험: [/tour/quickstart/03-send-message/](/tour/quickstart/03-send-message/)
- 페이지 관리: [[ui-reference/03-transfer/page|페이지 전송]]
- 전송 실패: [[troubleshooting/03-transfer-fail|전송이 실패할 때]]
